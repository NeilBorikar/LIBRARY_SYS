from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from app.models.student import StudentResponse
from app.models.library_staff import LibraryStaffResponse
from app.models.staff import StaffResponse
from app.models.transaction import TransactionResponse
from app.repositories.student_repo import StudentRepository
from app.repositories.library_staff_repo import LibraryStaffRepository
from app.repositories.staff_repo import StaffRepository
from app.repositories.transaction_repo import TransactionRepository
from app.utils.fine_calculator import FineCalculator
from app.utils.reminder_service import ReminderService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Dependencies
student_repo = StudentRepository()
library_staff_repo = LibraryStaffRepository()
staff_repo = StaffRepository()
transaction_repo = TransactionRepository()
fine_calculator = FineCalculator()
reminder_service = ReminderService()

# ==============================
# STUDENT DASHBOARD ENDPOINTS
# ==============================

@router.get("/student/{student_id}")
async def get_student_dashboard(student_id: str):
    """Get comprehensive student dashboard data"""
    try:
        # Get student info
        student = await student_repo.get_by_id(student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Get current borrowed books
        current_books = await transaction_repo.get_current_books(student_id)
        
        # Get book history
        book_history = await transaction_repo.get_book_history(student_id)
        
        # Get fine history
        fine_history = await transaction_repo.get_fine_history(student_id)
        
        # Calculate total statistics
        total_borrowed = len(book_history)
        total_fine_paid = sum(fine['fine_amount'] for fine in fine_history if fine['fine_amount'] > 0)
        pending_fine = sum(fine_calculator.calculate_fine(book['due_date'], datetime.now()) 
                          for book in current_books if not book['returned_at'])
        
        return {
            "student_info": student,
            "current_books": current_books,
            "book_history": book_history,
            "fine_history": fine_history,
            "statistics": {
                "total_borrowed": total_borrowed,
                "total_fine_paid": total_fine_paid,
                "pending_fine": pending_fine
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/student/{student_id}/reminders")
async def get_student_reminders(student_id: str):
    """Get reminders for student (due soon, overdue)"""
    try:
        current_books = await transaction_repo.get_current_books(student_id)
        reminders = []
        
        for book in current_books:
            if not book['returned_at']:
                days_until_due = (book['due_date'] - datetime.now()).days
                
                if days_until_due <= 0:  # Overdue
                    reminders.append({
                        "type": "overdue",
                        "book_title": book['book_title'],
                        "due_date": book['due_date'],
                        "days_overdue": abs(days_until_due),
                        "fine": fine_calculator.calculate_fine(book['due_date'], datetime.now())
                    })
                elif days_until_due <= 2:  # Due soon
                    reminders.append({
                        "type": "due_soon",
                        "book_title": book['book_title'],
                        "due_date": book['due_date'],
                        "days_remaining": days_until_due
                    })
        
        return {"reminders": reminders}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==============================
# LIBRARY STAFF DASHBOARD ENDPOINTS
# ==============================

@router.get("/library-staff/{staff_id}")
async def get_library_staff_dashboard(staff_id: str):
    """Get comprehensive library staff dashboard data"""
    try:
        # Handle "current" as a special case - return mock data for now
        if staff_id == "current":
            return {
                "staff_info": {
                    "name": "Sarah Johnson",
                    "email": "sarah@library.edu",
                    "employee_id": "LIB001"
                },
                "statistics": {
                    "total_books": 1000,
                    "issued_books": 245,
                    "overdue_books": 18,
                    "pending_fines": 1250.50
                },
                "notifications": [
                    {
                        "type": "overdue_alert",
                        "message": "5 books are overdue today",
                        "timestamp": datetime.now(),
                        "severity": "high"
                    }
                ],
                "fine_alerts": [
                    {
                        "student_name": "John Doe",
                        "book_title": "Data Structures and Algorithms",
                        "days_late": 5,
                        "fine_amount": 25,
                        "student_email": "john@college.edu",
                        "prn": "2021001"
                    }
                ]
            }
        
        # Get staff info
        staff = await library_staff_repo.get_by_id(staff_id)
        if not staff:
            raise HTTPException(status_code=404, detail="Library staff not found")
        
        # Get library statistics
        total_books = await transaction_repo.get_total_books()
        issued_books = await transaction_repo.get_issued_books_count()
        overdue_books = await transaction_repo.get_overdue_books_count()
        pending_fines = await transaction_repo.get_pending_fines_amount()
        
        # Get student fine alerts
        fine_alerts = await transaction_repo.get_student_fine_alerts()
        
        # Get recent notifications
        notifications = await reminder_service.get_recent_notifications()
        
        return {
            "staff_info": staff,
            "statistics": {
                "total_books": total_books,
                "issued_books": issued_books,
                "overdue_books": overdue_books,
                "pending_fines": pending_fines
            },
            "fine_alerts": fine_alerts,
            "notifications": notifications
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/library-staff/{staff_id}/fine-alerts")
async def get_fine_alerts(staff_id: str):
    """Get detailed fine alerts for library staff"""
    try:
        alerts = await transaction_repo.get_student_fine_alerts()
        return {"alerts": alerts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==============================
# COLLEGE STAFF DASHBOARD ENDPOINTS
# ==============================

@router.get("/college-staff/{staff_id}")
async def get_college_staff_dashboard(staff_id: str):
    """Get comprehensive college staff dashboard data"""
    try:
        # Get staff info
        staff = await staff_repo.get_by_id(staff_id)
        if not staff:
            raise HTTPException(status_code=404, detail="College staff not found")
        
        # Get department level statistics
        department_stats = await transaction_repo.get_department_statistics()
        
        # Get defaulter students
        defaulter_students = await transaction_repo.get_defaulter_students()
        
        # Get monthly trends for charts
        monthly_trends = await transaction_repo.get_monthly_trends()
        
        return {
            "staff_info": staff,
            "department_stats": department_stats,
            "defaulter_students": defaulter_students,
            "monthly_trends": monthly_trends
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/college-staff/{staff_id}/department-stats")
async def get_department_statistics(staff_id: str):
    """Get detailed department level book usage statistics"""
    try:
        stats = await transaction_repo.get_department_statistics()
        return {"statistics": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/college-staff/{staff_id}/defaulters")
async def get_defaulter_students(staff_id: str):
    """Get list of students with unpaid fines and overdue books"""
    try:
        defaulters = await transaction_repo.get_defaulter_students()
        return {"defaulters": defaulters}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/college-staff/{staff_id}/trends")
async def get_monthly_trends(
    staff_id: str,
    months: int = Query(default=12, description="Number of months to get trends for")
):
    """Get monthly book issue and fine collection trends for charts"""
    try:
        trends = await transaction_repo.get_monthly_trends(months)
        return {"trends": trends}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==============================
# NOTIFICATION ENDPOINTS
# ==============================

@router.post("/send-reminders")
async def send_daily_reminders():
    """Send daily reminders to students (triggered by scheduler)"""
    try:
        result = await reminder_service.send_daily_reminders()
        return {"message": "Reminders sent successfully", "details": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send-overdue-alerts")
async def send_overdue_alerts():
    """Send overdue alerts to library staff"""
    try:
        result = await reminder_service.send_overdue_alerts()
        return {"message": "Overdue alerts sent successfully", "details": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
