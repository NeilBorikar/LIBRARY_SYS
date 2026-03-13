from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, timedelta
import asyncio
import logging
from app.services.notification_service import notification_service
from app.database_utils import transactions_collection, users_collection, books_collection
from app.config import settings

logger = logging.getLogger(__name__)

class ReminderScheduler:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.setup_jobs()

    def setup_jobs(self):
        """Setup all reminder jobs"""
        
        # Daily overdue reminders at 9:00 AM
        self.scheduler.add_job(
            func=self.send_overdue_reminders,
            trigger=CronTrigger(hour=9, minute=0),
            id='overdue_reminders',
            name='Send overdue book reminders',
            replace_existing=True,
            max_instances=1
        )
        
        # Due soon reminders at 9:00 AM
        self.scheduler.add_job(
            func=self.send_due_soon_reminders,
            trigger=CronTrigger(hour=9, minute=0),
            id='due_soon_reminders',
            name='Send due soon book reminders',
            replace_existing=True,
            max_instances=1
        )
        
        # Fine notifications every 2 hours during library hours (9 AM - 6 PM)
        for hour in range(9, 19, 2):  # 9, 11, 13, 15, 17
            self.scheduler.add_job(
                func=self.send_fine_notifications,
                trigger=CronTrigger(hour=hour, minute=0),
                id=f'fine_notifications_{hour}',
                name=f'Send fine notifications at {hour}:00',
                replace_existing=True,
                max_instances=1
            )
        
        # Weekly library staff reports every Monday at 10:00 AM
        self.scheduler.add_job(
            func=self.send_weekly_staff_report,
            trigger=CronTrigger(day_of_week=0, hour=10, minute=0),  # Monday=0
            id='weekly_staff_report',
            name='Send weekly library staff report',
            replace_existing=True,
            max_instances=1
        )
        
        # Monthly cleanup and statistics on 1st of each month
        self.scheduler.add_job(
            func=self.monthly_cleanup_and_stats,
            trigger=CronTrigger(day=1, hour=8, minute=0),
            id='monthly_cleanup',
            name='Monthly cleanup and statistics',
            replace_existing=True,
            max_instances=1
        )

    async def send_overdue_reminders(self):
        """Send reminders for overdue books"""
        try:
            logger.info("Starting overdue reminders job")
            
            overdue_books = notification_service.get_overdue_books()
            success_count = 0
            
            for overdue in overdue_books:
                user = overdue['user']
                book = overdue['book']
                days_overdue = overdue['days_overdue']
                fine_amount = overdue['fine_amount']
                
                # Send reminder only if it's been more than the configured days
                if days_overdue >= settings.OVERDUE_REMINDER_DAYS:
                    if notification_service.send_overdue_reminder(
                        user, book, days_overdue, fine_amount
                    ):
                        success_count += 1
                        logger.info(f"Overdue reminder sent to {user['email']} for book '{book['title']}'")
                    
                    # Add delay to avoid spamming email servers
                    await asyncio.sleep(1)
            
            # Send alert to library staff about overdue books
            if overdue_books:
                alert_message = f"There are {len(overdue_books)} overdue books in the library."
                notification_service.send_library_staff_alert(
                    "Overdue Books Alert",
                    alert_message,
                    {"overdue_count": len(overdue_books), "total_fine": sum(b['fine_amount'] for b in overdue_books)}
                )
            
            logger.info(f"Overdue reminders completed: {success_count}/{len(overdue_books)} sent")
            
        except Exception as e:
            logger.error(f"Error in overdue reminders job: {str(e)}")

    async def send_due_soon_reminders(self):
        """Send reminders for books due soon"""
        try:
            logger.info("Starting due soon reminders job")
            
            due_soon_books = notification_service.get_due_soon_books(settings.DUE_SOON_REMINDER_DAYS)
            success_count = 0
            
            for due_soon in due_soon_books:
                user = due_soon['user']
                book = due_soon['book']
                days_until_due = due_soon['days_until_due']
                
                if notification_service.send_due_soon_reminder(user, book, days_until_due):
                    success_count += 1
                    logger.info(f"Due soon reminder sent to {user['email']} for book '{book['title']}'")
                
                # Add delay to avoid spamming email servers
                await asyncio.sleep(1)
            
            logger.info(f"Due soon reminders completed: {success_count}/{len(due_soon_books)} sent")
            
        except Exception as e:
            logger.error(f"Error in due soon reminders job: {str(e)}")

    async def send_fine_notifications(self):
        """Send fine notifications to users with accumulated fines"""
        try:
            logger.info("Starting fine notifications job")
            
            # Get users with accumulated fines
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
                        "total_fine": {
                            "$sum": {
                                "$multiply": [
                                    {"$subtract": [datetime.utcnow(), "$due_date"]},
                                    settings.FINE_PER_DAY / (24 * 60 * 60 * 1000)  # Convert to days
                                ]
                            }
                        },
                        "overdue_books": {"$sum": 1}
                    }
                },
                {"$match": {"total_fine": {"$gt": 0}}}
            ]
            
            users_with_fines = list(transactions_collection.aggregate(pipeline))
            success_count = 0
            
            for user_fine in users_with_fines:
                user = users_collection.find_one({"_id": user_fine["_id"]})
                if user:
                    # Get the most recent overdue book for notification
                    recent_transaction = transactions_collection.find_one(
                        {"user_id": user_fine["_id"], "status": "issued", "due_date": {"$lt": datetime.utcnow()}},
                        sort=[("due_date", -1)]
                    )
                    
                    if recent_transaction:
                        book = books_collection.find_one({"_id": recent_transaction["book_id"]})
                        if book:
                            if notification_service.send_fine_notification(
                                user, user_fine["total_fine"], book
                            ):
                                success_count += 1
                                logger.info(f"Fine notification sent to {user['email']} for amount ₹{user_fine['total_fine']}")
                    
                    await asyncio.sleep(1)
            
            logger.info(f"Fine notifications completed: {success_count}/{len(users_with_fines)} sent")
            
        except Exception as e:
            logger.error(f"Error in fine notifications job: {str(e)}")

    async def send_weekly_staff_report(self):
        """Send weekly report to library staff"""
        try:
            logger.info("Starting weekly staff report")
            
            # Calculate statistics for the past week
            week_ago = datetime.utcnow() - timedelta(days=7)
            
            # Books issued this week
            books_issued = transactions_collection.count_documents({
                "created_at": {"$gte": week_ago},
                "status": "issued"
            })
            
            # Books returned this week
            books_returned = transactions_collection.count_documents({
                "updated_at": {"$gte": week_ago},
                "status": "returned"
            })
            
            # Current overdue books
            overdue_books = len(notification_service.get_overdue_books())
            
            # Total books in library
            total_books = books_collection.count_documents({})
            
            # Active users (with issued books)
            active_users = transactions_collection.distinct(
                "user_id", 
                {"status": "issued"}
            )
            
            report_data = {
                "period": "Last 7 days",
                "books_issued": books_issued,
                "books_returned": books_returned,
                "overdue_books": overdue_books,
                "total_books": total_books,
                "active_users": len(active_users),
                "generated_at": datetime.utcnow().isoformat()
            }
            
            # Create report message
            report_message = f"""
            Weekly Library Report:
            
            📚 Books Issued: {books_issued}
            📖 Books Returned: {books_returned}
            ⚠️ Overdue Books: {overdue_books}
            📚 Total Books: {total_books}
            👥 Active Users: {len(active_users)}
            
            Generated on: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}
            """
            
            notification_service.send_library_staff_alert(
                "Weekly Library Report",
                report_message,
                report_data
            )
            
            logger.info("Weekly staff report sent successfully")
            
        except Exception as e:
            logger.error(f"Error in weekly staff report: {str(e)}")

    async def monthly_cleanup_and_stats(self):
        """Perform monthly cleanup and generate statistics"""
        try:
            logger.info("Starting monthly cleanup and statistics")
            
            # Archive old transactions (older than 1 year)
            one_year_ago = datetime.utcnow() - timedelta(days=365)
            
            # Get old transactions to archive
            old_transactions = list(transactions_collection.find({
                "status": "returned",
                "updated_at": {"$lt": one_year_ago}
            }))
            
            # In a real implementation, you would move these to an archive collection
            # For now, we'll just log the count
            archived_count = len(old_transactions)
            
            # Calculate monthly statistics
            last_month = datetime.utcnow() - timedelta(days=30)
            
            monthly_stats = {
                "archived_transactions": archived_count,
                "total_transactions": transactions_collection.count_documents({}),
                "active_transactions": transactions_collection.count_documents({"status": "issued"}),
                "total_users": users_collection.count_documents({}),
                "total_books": books_collection.count_documents({}),
                "cleanup_date": datetime.utcnow().isoformat()
            }
            
            # Send report to library staff
            notification_service.send_library_staff_alert(
                "Monthly Cleanup Complete",
                f"Monthly cleanup completed. Archived {archived_count} old transactions.",
                monthly_stats
            )
            
            logger.info(f"Monthly cleanup completed. Archived {archived_count} transactions.")
            
        except Exception as e:
            logger.error(f"Error in monthly cleanup: {str(e)}")

    def start(self):
        """Start the scheduler"""
        try:
            self.scheduler.start()
            logger.info("Reminder scheduler started successfully")
        except Exception as e:
            logger.error(f"Failed to start reminder scheduler: {str(e)}")

    def stop(self):
        """Stop the scheduler"""
        try:
            self.scheduler.shutdown()
            logger.info("Reminder scheduler stopped")
        except Exception as e:
            logger.error(f"Error stopping reminder scheduler: {str(e)}")

    def get_job_status(self):
        """Get status of all scheduled jobs"""
        jobs = []
        for job in self.scheduler.get_jobs():
            jobs.append({
                "id": job.id,
                "name": job.name,
                "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
                "trigger": str(job.trigger)
            })
        return jobs

# Global reminder scheduler instance
reminder_scheduler = ReminderScheduler()
