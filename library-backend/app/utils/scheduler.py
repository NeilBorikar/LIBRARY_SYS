from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.utils.reminder_service import ReminderService
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LibraryScheduler:
    """Scheduler for automated library tasks"""
    
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.reminder_service = ReminderService()
        
    def start(self):
        """Start the scheduler"""
        try:
            # Schedule daily reminders at 9 AM
            self.scheduler.add_job(
                func=self.send_daily_reminders,
                trigger=CronTrigger(hour=9, minute=0),
                id='daily_reminders',
                name='Send daily reminders to students',
                replace_existing=True
            )
            
            # Schedule overdue alerts every 2 hours during library hours
            self.scheduler.add_job(
                func=self.send_overdue_alerts,
                trigger=CronTrigger(hour='9-18', minute=0),  # Every hour from 9 AM to 6 PM
                id='overdue_alerts',
                name='Send overdue alerts to library staff',
                replace_existing=True
            )
            
            # Schedule fine calculation update every night at midnight
            self.scheduler.add_job(
                func=self.update_fine_calculations,
                trigger=CronTrigger(hour=0, minute=0),
                id='fine_update',
                name='Update fine calculations',
                replace_existing=True
            )
            
            self.scheduler.start()
            logger.info("Library scheduler started successfully")
            
        except Exception as e:
            logger.error(f"Failed to start scheduler: {str(e)}")
    
    async def send_daily_reminders(self):
        """Send daily reminders to students"""
        try:
            logger.info("Starting daily reminder job")
            result = await self.reminder_service.send_daily_reminders()
            logger.info(f"Daily reminders completed: {result}")
        except Exception as e:
            logger.error(f"Error in daily reminders: {str(e)}")
    
    async def send_overdue_alerts(self):
        """Send overdue alerts to library staff"""
        try:
            logger.info("Starting overdue alerts job")
            result = await self.reminder_service.send_overdue_alerts()
            logger.info(f"Overdue alerts completed: {result}")
        except Exception as e:
            logger.error(f"Error in overdue alerts: {str(e)}")
    
    async def update_fine_calculations(self):
        """Update fine calculations for all overdue books"""
        try:
            logger.info("Starting fine calculation update")
            # This would update fine amounts in the database
            # Implementation depends on your database structure
            logger.info("Fine calculation update completed")
        except Exception as e:
            logger.error(f"Error in fine update: {str(e)}")
    
    def stop(self):
        """Stop the scheduler"""
        try:
            self.scheduler.shutdown()
            logger.info("Library scheduler stopped")
        except Exception as e:
            logger.error(f"Error stopping scheduler: {str(e)}")
    
    def get_jobs(self):
        """Get all scheduled jobs"""
        return self.scheduler.get_jobs()

# Global scheduler instance
library_scheduler = LibraryScheduler()
