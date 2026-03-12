from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-here")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION = os.getenv("JWT_EXPIRATION", 24)  # hours

# Database Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "library_db")

# Email Configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
GMAIL_EMAIL = os.getenv("GMAIL_EMAIL", "library@college.edu")
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD", "app_password")
LIBRARY_STAFF_EMAIL = os.getenv("LIBRARY_STAFF_EMAIL", "library@college.edu")

# Application Configuration
DEBUG = os.getenv("DEBUG", "True").lower() == "true"