from pymongo import MongoClient
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