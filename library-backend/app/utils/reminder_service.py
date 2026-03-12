import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import List, Dict, Any
import os
from app.repositories.transaction_repo import TransactionRepository
from app.repositories.student_repo import StudentRepository
from app.utils.fine_calculator import FineCalculator

class ReminderService:
    """Service for sending email and SMS reminders"""
    
    def __init__(self):
        self.transaction_repo = TransactionRepository()
        self.student_repo = StudentRepository()
        self.fine_calculator = FineCalculator()
        
        # Email configuration (should be moved to environment variables)
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = os.getenv("GMAIL_EMAIL", "library@college.edu")
        self.sender_password = os.getenv("GMAIL_PASSWORD", "app_password")
    
    async def send_daily_reminders(self) -> Dict[str, Any]:
        """Send daily reminders to students about due and overdue books"""
        try:
            reminders_sent = 0
            errors = []
            
            # Get all current book transactions
            current_books = await self.transaction_repo.get_all_current_books()
            
            for book in current_books:
                if not book.get('returned_at'):
                    student_id = book['user_id']
                    student = await self.student_repo.get_by_id(student_id)
                    
                    if student:
                        days_until_due = (book['due_date'] - datetime.now()).days
                        
                        # Send reminder if due soon or overdue
                        if days_until_due <= 2:
                            try:
                                await self._send_email_reminder(student, book, days_until_due)
                                reminders_sent += 1
                            except Exception as e:
                                errors.append(f"Failed to send reminder to {student['email']}: {str(e)}")
            
            return {
                "reminders_sent": reminders_sent,
                "errors": errors,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            raise Exception(f"Failed to send daily reminders: {str(e)}")
    
    async def send_overdue_alerts(self) -> Dict[str, Any]:
        """Send overdue alerts to library staff"""
        try:
            alerts_sent = 0
            errors = []
            
            # Get overdue books
            overdue_books = await self.transaction_repo.get_overdue_books()
            
            if overdue_books:
                try:
                    await self._send_staff_alert(overdue_books)
                    alerts_sent = 1
                except Exception as e:
                    errors.append(f"Failed to send staff alert: {str(e)}")
            
            return {
                "alerts_sent": alerts_sent,
                "overdue_books_count": len(overdue_books),
                "errors": errors,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            raise Exception(f"Failed to send overdue alerts: {str(e)}")
    
    async def _send_email_reminder(self, student: Dict[str, Any], book: Dict[str, Any], days_until_due: int):
        """Send email reminder to student"""
        subject = "Library Book Return Reminder"
        
        if days_until_due <= 0:
            # Overdue book
            days_overdue = abs(days_until_due)
            fine = self.fine_calculator.calculate_fine(book['due_date'], datetime.now())
            
            body = f"""
Dear {student['name']},

This is a reminder that you have an overdue book:

Book Title: {book['book_title']}
Due Date: {book['due_date'].strftime('%d %B %Y')}
Days Overdue: {days_overdue}
Current Fine: ₹{fine:.2f}

Please return the book as soon as possible to avoid additional charges.

Thank you,
Library Management System
"""
        else:
            # Due soon
            body = f"""
Dear {student['name']},

This is a reminder that you have a book due soon:

Book Title: {book['book_title']}
Due Date: {book['due_date'].strftime('%d %B %Y')}
Days Remaining: {days_until_due}

Please return the book on or before the due date to avoid late charges.

Thank you,
Library Management System
"""
        
        await self._send_email(student['email'], subject, body)
    
    async def _send_staff_alert(self, overdue_books: List[Dict[str, Any]]):
        """Send alert to library staff about overdue books"""
        subject = f"Alert: {len(overdue_books)} Overdue Books"
        
        body = """
Dear Library Staff,

This is an automated alert about overdue books in the library:

"""
        
        for book in overdue_books[:10]:  # Limit to first 10 books
            student_id = book['user_id']
            student = await self.student_repo.get_by_id(student_id)
            student_name = student['name'] if student else "Unknown"
            days_overdue = (datetime.now() - book['due_date']).days
            fine = self.fine_calculator.calculate_fine(book['due_date'], datetime.now())
            
            body += f"""
• {student_name} - {book['book_title']}
  Due: {book['due_date'].strftime('%d %B %Y')}
  Overdue: {days_overdue} days
  Fine: ₹{fine:.2f}
"""
        
        if len(overdue_books) > 10:
            body += f"\n... and {len(overdue_books) - 10} more books."
        
        body += """

Please take appropriate action to recover these books and collect fines.

Thank you,
Library Management System
"""
        
        # Send to library staff email (should be configurable)
        library_email = os.getenv("LIBRARY_STAFF_EMAIL", "library@college.edu")
        await self._send_email(library_email, subject, body)
    
    async def _send_email(self, to_email: str, subject: str, body: str):
        """Send email using SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            server.send_message(msg)
            server.quit()
            
        except Exception as e:
            raise Exception(f"Failed to send email: {str(e)}")
    
    async def get_recent_notifications(self) -> List[Dict[str, Any]]:
        """Get recent notifications for dashboard display"""
        # This would typically fetch from a database
        # For now, return mock data
        return [
            {
                "type": "overdue_alert",
                "message": "5 books are overdue today",
                "timestamp": datetime.now() - timedelta(hours=2),
                "severity": "high"
            },
            {
                "type": "high_fine",
                "message": "Student John Doe has fine exceeding ₹100",
                "timestamp": datetime.now() - timedelta(hours=5),
                "severity": "medium"
            },
            {
                "type": "reminder_sent",
                "message": "Daily reminders sent to 15 students",
                "timestamp": datetime.now() - timedelta(days=1),
                "severity": "low"
            }
        ]
