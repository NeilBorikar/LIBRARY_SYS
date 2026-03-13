from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from app.services.notification_service import notification_service
from app.services.reminder_scheduler import reminder_scheduler
from app.database_utils import users_collection, transactions_collection, books_collection
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reminders", tags=["Reminders"])

# Pydantic models for request/response
class ReminderRequest(BaseModel):
    user_id: str
    book_id: str
    reminder_type: str  # "overdue", "due_soon", "fine"
    custom_message: Optional[str] = None

class BulkReminderRequest(BaseModel):
    reminder_type: str  # "overdue", "due_soon", "fine"
    user_ids: Optional[List[str]] = None
    role_filter: Optional[str] = None  # "student", "staff", "library_staff"

class NotificationPreferences(BaseModel):
    email_enabled: bool = True
    sms_enabled: bool = True
    reminder_days_before_due: int = 2

class ManualReminderRequest(BaseModel):
    recipient_email: EmailStr
    recipient_phone: Optional[str] = None
    subject: str
    message: str
    send_email: bool = True
    send_sms: bool = False

@router.post("/send-manual")
async def send_manual_reminder(request: ManualReminderRequest, background_tasks: BackgroundTasks):
    """Send manual reminder to specific user"""
    try:
        user_info = {
            "name": "User",
            "email": request.recipient_email,
            "phone": request.recipient_phone
        }
        
        success = False
        
        if request.send_email:
            background_tasks.add_task(
                notification_service.email_service.send_email,
                request.recipient_email,
                request.subject,
                request.message,
                False
            )
            success = True
        
        if request.send_sms and request.recipient_phone:
            background_tasks.add_task(
                notification_service.sms_service.send_sms,
                request.recipient_phone,
                request.message
            )
            success = True
        
        return {
            "message": "Manual reminder sent successfully",
            "email_sent": request.send_email,
            "sms_sent": request.send_sms and request.recipient_phone is not None
        }
        
    except Exception as e:
        logger.error(f"Error sending manual reminder: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send-bulk")
async def send_bulk_reminders(request: BulkReminderRequest, background_tasks: BackgroundTasks):
    """Send bulk reminders to multiple users"""
    try:
        sent_count = 0
        
        if request.reminder_type == "overdue":
            overdue_books = notification_service.get_overdue_books()
            
            # Filter by user IDs if provided
            if request.user_ids:
                overdue_books = [b for b in overdue_books if str(b["user"]["_id"]) in request.user_ids]
            
            # Filter by role if provided
            if request.role_filter:
                overdue_books = [b for b in overdue_books if b["user"]["role"] == request.role_filter]
            
            for overdue in overdue_books:
                user = overdue['user']
                book = overdue['book']
                days_overdue = overdue['days_overdue']
                fine_amount = overdue['fine_amount']
                
                background_tasks.add_task(
                    notification_service.send_overdue_reminder,
                    user, book, days_overdue, fine_amount
                )
                sent_count += 1
        
        elif request.reminder_type == "due_soon":
            due_soon_books = notification_service.get_due_soon_books()
            
            if request.user_ids:
                due_soon_books = [b for b in due_soon_books if str(b["user"]["_id"]) in request.user_ids]
            
            if request.role_filter:
                due_soon_books = [b for b in due_soon_books if b["user"]["role"] == request.role_filter]
            
            for due_soon in due_soon_books:
                user = due_soon['user']
                book = due_soon['book']
                days_until_due = due_soon['days_until_due']
                
                background_tasks.add_task(
                    notification_service.send_due_soon_reminder,
                    user, book, days_until_due
                )
                sent_count += 1
        
        elif request.reminder_type == "fine":
            # Get users with fines
            pipeline = [
                {
                    "$match": {
                        "status": "issued",
                        "due_date": {"$lt": datetime.utcnow() - timedelta(days=1)}
                    }
                },
                {
                    "$group": {
                        "_id": "$user_id",
                        "total_fine": {"$sum": 10}  # 10 rupees per day
                    }
                }
            ]
            
            users_with_fines = list(transactions_collection.aggregate(pipeline))
            
            for user_fine in users_with_fines:
                user = users_collection.find_one({"_id": user_fine["_id"]})
                
                if user:
                    # Filter by user IDs if provided
                    if request.user_ids and str(user["_id"]) not in request.user_ids:
                        continue
                    
                    # Filter by role if provided
                    if request.role_filter and user["role"] != request.role_filter:
                        continue
                    
                    # Get most recent overdue book
                    recent_transaction = transactions_collection.find_one(
                        {"user_id": user_fine["_id"], "status": "issued"},
                        sort=[("due_date", -1)]
                    )
                    
                    if recent_transaction:
                        book = books_collection.find_one({"_id": recent_transaction["book_id"]})
                        if book:
                            background_tasks.add_task(
                                notification_service.send_fine_notification,
                                user, user_fine["total_fine"], book
                            )
                            sent_count += 1
        
        return {
            "message": f"Bulk reminders queued successfully",
            "reminder_type": request.reminder_type,
            "sent_count": sent_count
        }
        
    except Exception as e:
        logger.error(f"Error sending bulk reminders: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/overdue-books")
async def get_overdue_books():
    """Get list of all overdue books"""
    try:
        overdue_books = notification_service.get_overdue_books()
        
        # Convert ObjectId to string for JSON serialization
        for book in overdue_books:
            book["user"]["_id"] = str(book["user"]["_id"])
            book["book"]["_id"] = str(book["book"]["_id"])
        
        return {
            "overdue_books": overdue_books,
            "total_count": len(overdue_books),
            "total_fine": sum(book["fine_amount"] for book in overdue_books)
        }
        
    except Exception as e:
        logger.error(f"Error getting overdue books: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/due-soon-books")
async def get_due_soon_books(days_ahead: int = 2):
    """Get list of books due within specified days"""
    try:
        due_soon_books = notification_service.get_due_soon_books(days_ahead)
        
        # Convert ObjectId to string for JSON serialization
        for book in due_soon_books:
            book["user"]["_id"] = str(book["user"]["_id"])
            book["book"]["_id"] = str(book["book"]["_id"])
        
        return {
            "due_soon_books": due_soon_books,
            "total_count": len(due_soon_books),
            "days_ahead": days_ahead
        }
        
    except Exception as e:
        logger.error(f"Error getting due soon books: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}/reminders")
async def get_user_reminders(user_id: str):
    """Get all reminders for a specific user"""
    try:
        user = users_collection.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get user's transactions
        user_transactions = list(transactions_collection.find({"user_id": user_id}))
        
        overdue_reminders = []
        due_soon_reminders = []
        
        for transaction in user_transactions:
            if transaction["status"] == "issued":
                book = books_collection.find_one({"_id": transaction["book_id"]})
                if book:
                    days_until_due = (transaction["due_date"] - datetime.utcnow()).days
                    
                    if days_until_due < 0:
                        # Overdue
                        days_overdue = abs(days_until_due)
                        fine_amount = days_overdue * 10
                        
                        overdue_reminders.append({
                            "book": {
                                "title": book["title"],
                                "author": book["author"]
                            },
                            "due_date": transaction["due_date"],
                            "days_overdue": days_overdue,
                            "fine_amount": fine_amount
                        })
                    
                    elif days_until_due <= 2:
                        # Due soon
                        due_soon_reminders.append({
                            "book": {
                                "title": book["title"],
                                "author": book["author"]
                            },
                            "due_date": transaction["due_date"],
                            "days_until_due": days_until_due
                        })
        
        return {
            "user": {
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            },
            "overdue_reminders": overdue_reminders,
            "due_soon_reminders": due_soon_reminders,
            "total_overdue_fine": sum(r["fine_amount"] for r in overdue_reminders)
        }
        
    except Exception as e:
        logger.error(f"Error getting user reminders: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test-email")
async def test_email_configuration():
    """Test email configuration"""
    try:
        test_email = {
            "name": "Test User",
            "email": "test@example.com"
        }
        
        success = notification_service.send_welcome_email(test_email, "student")
        
        return {
            "message": "Test email sent successfully" if success else "Test email failed",
            "success": success
        }
        
    except Exception as e:
        logger.error(f"Error testing email: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test-sms")
async def test_sms_configuration(phone_number: str = "+1234567890"):
    """Test SMS configuration"""
    try:
        test_message = "This is a test SMS from Library Management System"
        
        success = notification_service.sms_service.send_sms(phone_number, test_message)
        
        return {
            "message": "Test SMS sent successfully" if success else "Test SMS failed",
            "success": success,
            "phone_number": phone_number
        }
        
    except Exception as e:
        logger.error(f"Error testing SMS: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/scheduler-status")
async def get_scheduler_status():
    """Get reminder scheduler status"""
    try:
        jobs = reminder_scheduler.get_job_status()
        
        return {
            "scheduler_running": reminder_scheduler.scheduler.running,
            "jobs": jobs,
            "total_jobs": len(jobs)
        }
        
    except Exception as e:
        logger.error(f"Error getting scheduler status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/trigger-job/{job_id}")
async def trigger_scheduler_job(job_id: str, background_tasks: BackgroundTasks):
    """Manually trigger a scheduled job"""
    try:
        job_map = {
            "overdue_reminders": reminder_scheduler.send_overdue_reminders,
            "due_soon_reminders": reminder_scheduler.send_due_soon_reminders,
            "fine_notifications": reminder_scheduler.send_fine_notifications,
            "weekly_staff_report": reminder_scheduler.send_weekly_staff_report,
            "monthly_cleanup": reminder_scheduler.monthly_cleanup_and_stats
        }
        
        if job_id not in job_map:
            raise HTTPException(status_code=404, detail="Job not found")
        
        background_tasks.add_task(job_map[job_id])
        
        return {
            "message": f"Job '{job_id}' triggered successfully",
            "job_id": job_id
        }
        
    except Exception as e:
        logger.error(f"Error triggering job: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/statistics")
async def get_reminder_statistics():
    """Get reminder and notification statistics"""
    try:
        overdue_books = notification_service.get_overdue_books()
        due_soon_books = notification_service.get_due_soon_books()
        
        # Get notification statistics from database (you would need to create a notifications collection)
        total_notifications = 0  # Placeholder
        successful_notifications = 0  # Placeholder
        
        return {
            "overdue_books_count": len(overdue_books),
            "due_soon_books_count": len(due_soon_books),
            "total_overdue_fine": sum(book["fine_amount"] for book in overdue_books),
            "total_notifications": total_notifications,
            "successful_notifications": successful_notifications,
            "scheduler_status": reminder_scheduler.scheduler.running,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting reminder statistics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
