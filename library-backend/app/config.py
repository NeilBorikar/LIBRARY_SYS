from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # JWT Configuration
    JWT_SECRET: str = "a3f9b6e4d1c7a0e9b2f8d6c5e4a7b1c3d9f2e0a8c6b5"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION: int = 60  # minutes

    # Database Configuration
    MONGODB_URL: str = os.getenv("MONGO_URI", "mongodb+srv://neilborikar:Neil%403025@cluster0.fxogrnh.mongodb.net/?retryWrites=true&w=majority")
    DATABASE_NAME: str = os.getenv("MONGO_DB_NAME", "library_management_system")

    # Email Configuration
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "your-email@gmail.com")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "your-app-password")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "library@college.edu")

    # SMS Configuration
    SMS_API_KEY: str = os.getenv("SMS_API_KEY", "your-sms-api-key")
    SMS_API_SECRET: str = os.getenv("SMS_API_SECRET", "your-sms-api-secret")
    SMS_SENDER_ID: str = os.getenv("SMS_SENDER_ID", "LIBRARY")

    # Notification Settings
    ENABLE_EMAIL_NOTIFICATIONS: bool = os.getenv("ENABLE_EMAIL_NOTIFICATIONS", "true").lower() == "true"
    ENABLE_SMS_NOTIFICATIONS: bool = os.getenv("ENABLE_SMS_NOTIFICATIONS", "true").lower() == "true"

    # Reminder Settings
    OVERDUE_REMINDER_DAYS: int = int(os.getenv("OVERDUE_REMINDER_DAYS", "1"))
    DUE_SOON_REMINDER_DAYS: int = int(os.getenv("DUE_SOON_REMINDER_DAYS", "2"))
    FINE_PER_DAY: float = float(os.getenv("FINE_PER_DAY", "10.0"))

    # Email Configuration
    EMAIL_HOST: str = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    EMAIL_PORT: int = int(os.getenv("EMAIL_PORT", "587"))
    EMAIL_USERNAME: str = os.getenv("EMAIL_USERNAME", "")
    EMAIL_PASSWORD: str = os.getenv("EMAIL_PASSWORD", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "library@college.edu")

    # Application Configuration
    APP_NAME: str = "Library Management System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    BACKEND_HOST: str = "localhost"
    BACKEND_PORT: int = 8004

    class Config:
        env_file = ".env"


# Create settings instance
settings = Settings()
