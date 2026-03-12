from pymongo import MongoClient
<<<<<<< HEAD
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "library_db")

# Create MongoDB client
client = MongoClient(MONGODB_URL)

# Get database
db = client[DATABASE_NAME]

# Collections
students_collection = db.students
library_staff_collection = db.library_staff
staff_collection = db.staff
books_collection = db.books
transactions_collection = db.transactions
admin_collection = db.admin

# Test connection
def test_connection():
    try:
        client.server_info()
        print("✅ MongoDB connection successful")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        return False

# Close connection
def close_connection():
    client.close()
=======
from app.config import settings

# -----------------------------
# MONGO CLIENT
# -----------------------------
client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

# -----------------------------
# COLLECTIONS
# -----------------------------
students_collection = db.students
staff_collection = db.staff
library_staff_collection = db.library_staff
admins_collection = db.admins

books_collection = db.books

issues_collection = db.issues
returns_collection = db.returns
fines_collection = db.fines
deposits_collection = db.deposits
>>>>>>> e6d8db4533e4bd76b2850fb35827a25a589cf1bb
