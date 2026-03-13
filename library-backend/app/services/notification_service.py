import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import os
import http.client
import json
from app.config import settings
from app.database_utils import users_collection, transactions_collection, books_collection
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.FROM_EMAIL

    def send_email(self, to_email: str, subject: str, body: str, is_html: bool = False) -> bool:
        """Send email using SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = subject

            msg.attach(MIMEText(body, 'html' if is_html else 'plain'))

            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls(context=context)
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

class SMSService:
    def __init__(self):
        self.api_key = settings.SMS_API_KEY
        self.api_secret = settings.SMS_API_SECRET
        self.sender_id = settings.SMS_SENDER_ID

    def send_sms(self, phone_number: str, message: str) -> bool:
        """Send SMS using SMS API (example with a generic SMS service)"""
        try:
            # Example using a generic SMS API
            # You can replace this with your preferred SMS provider (Twilio, AWS SNS, etc.)
            
            # For demonstration, using a mock SMS service
            conn = http.client.HTTPSConnection("api.sms-provider.com")
            
            payload = {
                "api_key": self.api_key,
                "api_secret": self.api_secret,
                "to": phone_number,
                "from": self.sender_id,
                "message": message
            }
            
            headers = {
                'Content-Type': 'application/json'
            }
            
            conn.request("POST", "/v1/send", json.dumps(payload), headers)
            response = conn.getresponse()
            data = response.read()
            
            if response.status == 200:
                logger.info(f"SMS sent successfully to {phone_number}")
                return True
            else:
                logger.error(f"SMS failed for {phone_number}: {data.decode('utf-8')}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to send SMS to {phone_number}: {str(e)}")
            return False

class NotificationService:
    def __init__(self):
        self.email_service = EmailService()
        self.sms_service = SMSService()

    def get_overdue_books(self) -> List[Dict]:
        """Get all overdue books"""
        overdue_date = datetime.utcnow() - timedelta(days=1)
        overdue_transactions = list(transactions_collection.find({
            "status": "issued",
            "due_date": {"$lt": overdue_date}
        }))
        
        result = []
        for transaction in overdue_transactions:
            book = books_collection.find_one({"_id": transaction["book_id"]})
            user = users_collection.find_one({"_id": transaction["user_id"]})
            
            if book and user:
                days_overdue = (datetime.utcnow() - transaction["due_date"]).days
                fine_amount = days_overdue * 10  # 10 rupees per day
                
                result.append({
                    "transaction_id": str(transaction["_id"]),
                    "user": user,
                    "book": book,
                    "due_date": transaction["due_date"],
                    "days_overdue": days_overdue,
                    "fine_amount": fine_amount
                })
        
        return result

    def get_due_soon_books(self, days_ahead: int = 2) -> List[Dict]:
        """Get books due within specified days"""
        due_date = datetime.utcnow() + timedelta(days=days_ahead)
        due_soon_transactions = list(transactions_collection.find({
            "status": "issued",
            "due_date": {"$lte": due_date, "$gte": datetime.utcnow()}
        }))
        
        result = []
        for transaction in due_soon_transactions:
            book = books_collection.find_one({"_id": transaction["book_id"]})
            user = users_collection.find_one({"_id": transaction["user_id"]})
            
            if book and user:
                result.append({
                    "transaction_id": str(transaction["_id"]),
                    "user": user,
                    "book": book,
                    "due_date": transaction["due_date"],
                    "days_until_due": (transaction["due_date"] - datetime.utcnow()).days
                })
        
        return result

    def send_overdue_reminder(self, user_info: Dict, book_info: Dict, days_overdue: int, fine_amount: float) -> bool:
        """Send overdue book reminder via email and SMS"""
        
        # Email template
        email_subject = "URGENT: Overdue Book Return Reminder - Library Management System"
        email_body = f"""
        <html>
        <body>
            <h2>📚 Overdue Book Return Reminder</h2>
            <p>Dear {user_info['name']},</p>
            
            <p>This is a reminder that you have an overdue book that needs to be returned immediately.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>Book Details:</h3>
                <p><strong>Title:</strong> {book_info['title']}</p>
                <p><strong>Author:</strong> {book_info['author']}</p>
                <p><strong>Due Date:</strong> {book_info.get('due_date', 'N/A')}</p>
                <p><strong>Days Overdue:</strong> {days_overdue} days</p>
                <p><strong>Fine Amount:</strong> ₹{fine_amount}</p>
            </div>
            
            <p><strong>Please return the book to the library as soon as possible to avoid additional fines.</strong></p>
            
            <p>For any queries, please contact the library staff.</p>
            
            <hr>
            <p><em>This is an automated message from the Library Management System.</em></p>
            <p><small>College Library | Contact: library@college.edu | Phone: +91-1234567890</small></p>
        </body>
        </html>
        """
        
        # SMS template
        sms_message = f"LIBRARY ALERT: Your book '{book_info['title']}' is overdue by {days_overdue} days. Fine: ₹{fine_amount}. Please return immediately. Library Management System"
        
        # Send notifications
        email_sent = self.email_service.send_email(
            user_info['email'], 
            email_subject, 
            email_body, 
            is_html=True
        )
        
        sms_sent = False
        if user_info.get('phone'):
            sms_sent = self.sms_service.send_sms(user_info['phone'], sms_message)
        
        return email_sent or sms_sent

    def send_due_soon_reminder(self, user_info: Dict, book_info: Dict, days_until_due: int) -> bool:
        """Send due soon reminder via email and SMS"""
        
        # Email template
        email_subject = "Book Return Reminder - Library Management System"
        email_body = f"""
        <html>
        <body>
            <h2>📚 Book Return Reminder</h2>
            <p>Dear {user_info['name']},</p>
            
            <p>This is a friendly reminder that you have a book due for return soon.</p>
            
            <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>Book Details:</h3>
                <p><strong>Title:</strong> {book_info['title']}</p>
                <p><strong>Author:</strong> {book_info['author']}</p>
                <p><strong>Due Date:</strong> {book_info.get('due_date', 'N/A')}</p>
                <p><strong>Days Until Due:</strong> {days_until_due} days</p>
            </div>
            
            <p>Please return the book on or before the due date to avoid late fees.</p>
            
            <p>Thank you for using the library!</p>
            
            <hr>
            <p><em>This is an automated message from the Library Management System.</em></p>
            <p><small>College Library | Contact: library@college.edu | Phone: +91-1234567890</small></p>
        </body>
        </html>
        """
        
        # SMS template
        sms_message = f"LIBRARY REMINDER: Your book '{book_info['title']}' is due in {days_until_due} days. Please return on time. Library Management System"
        
        # Send notifications
        email_sent = self.email_service.send_email(
            user_info['email'], 
            email_subject, 
            email_body, 
            is_html=True
        )
        
        sms_sent = False
        if user_info.get('phone'):
            sms_sent = self.sms_service.send_sms(user_info['phone'], sms_message)
        
        return email_sent or sms_sent

    def send_fine_notification(self, user_info: Dict, fine_amount: float, book_info: Dict) -> bool:
        """Send fine notification to user"""
        
        email_subject = "Fine Payment Notification - Library Management System"
        email_body = f"""
        <html>
        <body>
            <h2>💰 Fine Payment Notification</h2>
            <p>Dear {user_info['name']},</p>
            
            <p>A fine has been generated for overdue book return.</p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>Fine Details:</h3>
                <p><strong>Book Title:</strong> {book_info['title']}</p>
                <p><strong>Fine Amount:</strong> ₹{fine_amount}</p>
                <p><strong>Reason:</strong> Late return of book</p>
            </div>
            
            <p>Please visit the library to clear the fine at your earliest convenience.</p>
            
            <hr>
            <p><em>This is an automated message from the Library Management System.</em></p>
            <p><small>College Library | Contact: library@college.edu | Phone: +91-1234567890</small></p>
        </body>
        </html>
        """
        
        sms_message = f"LIBRARY: Fine of ₹{fine_amount} generated for overdue book '{book_info['title']}'. Please pay at library. Library Management System"
        
        email_sent = self.email_service.send_email(
            user_info['email'], 
            email_subject, 
            email_body, 
            is_html=True
        )
        
        sms_sent = False
        if user_info.get('phone'):
            sms_sent = self.sms_service.send_sms(user_info['phone'], sms_message)
        
        return email_sent or sms_sent

    def send_library_staff_alert(self, alert_type: str, message: str, data: Dict = None) -> bool:
        """Send alerts to library staff"""
        
        # Get all library staff
        library_staff = list(users_collection.find({"role": "library_staff"}))
        
        email_subject = f"Library Alert: {alert_type}"
        email_body = f"""
        <html>
        <body>
            <h2>🔔 Library Alert: {alert_type}</h2>
            <p>Dear Library Staff,</p>
            
            <p>{message}</p>
            
            {data and f"""
            <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>Additional Details:</h3>
                {json.dumps(data, indent=2)}
            </div>
            """}
            
            <p>Please take appropriate action.</p>
            
            <hr>
            <p><em>This is an automated alert from the Library Management System.</em></p>
        </body>
        </html>
        """
        
        success_count = 0
        for staff in library_staff:
            if self.email_service.send_email(staff['email'], email_subject, email_body, is_html=True):
                success_count += 1
        
        logger.info(f"Library staff alert sent to {success_count}/{len(library_staff)} staff members")
        return success_count > 0

    def send_welcome_email(self, user_info: Dict, role: str) -> bool:
        """Send welcome email to new users"""
        
        email_subject = "Welcome to Library Management System"
        email_body = f"""
        <html>
        <body>
            <h2>🎉 Welcome to Library Management System!</h2>
            <p>Dear {user_info['name']},</p>
            
            <p>Welcome to the College Library Management System. Your account has been successfully created with the role of <strong>{role}</strong>.</p>
            
            <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>Your Account Details:</h3>
                <p><strong>Name:</strong> {user_info['name']}</p>
                <p><strong>Email:</strong> {user_info['email']}</p>
                <p><strong>Role:</strong> {role}</p>
                {user_info.get('prn') and f"<p><strong>PRN:</strong> {user_info['prn']}</p>"}
                {user_info.get('employee_id') and f"<p><strong>Employee ID:</strong> {user_info['employee_id']}</p>"}
            </div>
            
            <p>You can now access the library system using your credentials.</p>
            
            <p>For any assistance, please contact the library staff.</p>
            
            <hr>
            <p><em>This is an automated message from the Library Management System.</em></p>
            <p><small>College Library | Contact: library@college.edu | Phone: +91-1234567890</small></p>
        </body>
        </html>
        """
        
        return self.email_service.send_email(
            user_info['email'], 
            email_subject, 
            email_body, 
            is_html=True
        )

# Global notification service instance
notification_service = NotificationService()
