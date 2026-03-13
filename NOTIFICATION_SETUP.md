# 📧 Email & SMS Notification Setup Guide

This guide will help you configure the email and SMS notification system for the Library Management System.

## 🚀 Quick Setup

### 1. Email Configuration (Gmail SMTP)

The system uses Gmail SMTP for sending emails. Follow these steps:

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication

#### Step 2: Generate App Password
1. Go to Google Account → Security → App Passwords
2. Generate a new app password for "Mail"
3. Copy the generated password (16 characters)

#### Step 3: Update .env File
```env
# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
FROM_EMAIL=library@college.edu
```

### 2. SMS Configuration

The system supports multiple SMS providers. Here are examples for popular providers:

#### Option 1: Twilio Setup
1. Sign up for Twilio account
2. Get your Account SID and Auth Token
3. Purchase a phone number

```env
# SMS Configuration (Twilio)
SMS_API_KEY=your-twilio-account-sid
SMS_API_SECRET=your-twilio-auth-token
SMS_SENDER_ID=your-twilio-phone-number
```

#### Option 2: AWS SNS Setup
```env
# SMS Configuration (AWS SNS)
SMS_API_KEY=your-aws-access-key
SMS_API_SECRET=your-aws-secret-key
SMS_SENDER_ID=your-sender-id
```

#### Option 3: Local Indian SMS Providers
```env
# SMS Configuration (Indian Provider)
SMS_API_KEY=your-provider-api-key
SMS_API_SECRET=your-provider-api-secret
SMS_SENDER_ID=LIBRARY
```

### 3. Notification Settings

Configure when and how notifications are sent:

```env
# Notification Settings
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=true

# Reminder Settings
OVERDUE_REMINDER_DAYS=1      # Send overdue reminders after 1 day
DUE_SOON_REMINDER_DAYS=2     # Send due soon reminders 2 days before
FINE_PER_DAY=10.0            # Fine amount per overdue day
```

## 📅 Automated Reminder Schedule

The system automatically sends reminders at these times:

### Daily Reminders (9:00 AM)
- **Overdue Books**: Users with books overdue by 1+ day
- **Due Soon Books**: Users with books due within 2 days

### Fine Notifications (Every 2 Hours: 9 AM, 11 AM, 1 PM, 3 PM, 5 PM)
- Users with accumulated fines

### Weekly Reports (Mondays at 10:00 AM)
- Library staff receive weekly statistics
- Books issued/returned counts
- Overdue books summary

### Monthly Cleanup (1st of each month at 8:00 AM)
- Archive old transactions
- Generate monthly statistics

## 🧪 Testing Configuration

### Test Email Configuration
```bash
# Using the API
curl -X POST http://localhost:8004/reminders/test-email

# Or use the frontend dashboard
# Navigate to Library → Reminder Management → Settings → Test Email
```

### Test SMS Configuration
```bash
# Using the API
curl -X POST "http://localhost:8004/reminders/test-sms?phone_number=+1234567890"

# Or use the frontend dashboard
# Navigate to Library → Reminder Management → Settings → Test SMS
```

## 📊 Reminder Management Dashboard

Access the reminder management interface:

1. **Login as Library Staff**
2. **Navigate to Reminder Management**
3. **Features available**:
   - View overdue and due-soon books
   - Send manual reminders
   - Send bulk reminders
   - Monitor scheduler status
   - Test email/SMS configuration

## 🔧 Advanced Configuration

### Custom Email Templates

Email templates are located in `backend/app/services/notification_service.py`:

```python
def send_overdue_reminder(self, user_info, book_info, days_overdue, fine_amount):
    email_subject = "URGENT: Overdue Book Return Reminder"
    email_body = f"""
    <html>
    <body>
        <h2>📚 Overdue Book Return Reminder</h2>
        <!-- Customize your template here -->
    </body>
    </html>
    """
```

### Custom SMS Templates

SMS templates are in the same file:

```python
sms_message = f"LIBRARY ALERT: Your book '{book_info['title']}' is overdue..."
```

### Adding New Reminder Types

1. **Add new method in `notification_service.py`**
2. **Add API endpoint in `reminder_routes.py`**
3. **Add scheduler job in `reminder_scheduler.py`**
4. **Update frontend dashboard if needed**

## 🚨 Troubleshooting

### Common Email Issues

#### "SMTP Authentication Failed"
- Check your Gmail app password
- Ensure 2FA is enabled
- Verify SMTP username and password

#### "Connection Timed Out"
- Check SMTP host and port
- Verify firewall settings
- Ensure internet connectivity

### Common SMS Issues

#### "Invalid API Key"
- Verify SMS provider credentials
- Check API key format
- Ensure account is active

#### "Number Not Reachable"
- Verify phone number format (+countrycode)
- Check SMS provider coverage
- Ensure number is not on DND list

### Scheduler Issues

#### "Jobs Not Running"
- Check server logs: `INFO:app.services.reminder_scheduler`
- Verify scheduler status: `GET /reminders/scheduler-status`
- Restart backend server if needed

## 📱 Mobile Number Format

Use international format with country code:
- India: `+919876543210`
- US: `+11234567890`
- UK: `+442071838750`

## 🔐 Security Considerations

1. **Never commit real credentials to Git**
2. **Use app passwords instead of regular passwords**
3. **Rotate API keys regularly**
4. **Monitor email/SMS usage**
5. **Implement rate limiting for notifications**

## 📈 Monitoring & Analytics

### View Notification Statistics
```bash
curl http://localhost:8004/reminders/statistics
```

### Monitor Scheduler Status
```bash
curl http://localhost:8004/reminders/scheduler-status
```

### View System Logs
Check backend logs for notification delivery status:
```
INFO:app.services.notification_service:Email sent successfully to user@example.com
INFO:app.services.notification_service:SMS sent successfully to +1234567890
```

## 🆘 Support

If you encounter issues:

1. **Check the logs** in the backend console
2. **Verify configuration** in .env file
3. **Test individual components** using the test endpoints
4. **Check provider status** (Gmail, SMS provider)
5. **Review firewall settings**

## 📋 Configuration Checklist

- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] SMTP credentials updated in .env
- [ ] SMS provider configured
- [ ] Notification settings verified
- [ ] Test emails sent successfully
- [ ] Test SMS sent successfully
- [ ] Scheduler status is "Running"
- [ ] Reminder dashboard accessible

---

**🎉 Your notification system is now ready to keep students and staff informed!**
