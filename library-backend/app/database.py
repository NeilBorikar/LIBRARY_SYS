from pymongo import MongoClient
from app.config import settings

# -----------------------------
# MONGO CLIENT
# -----------------------------
client = MongoClient(settings.MONGODB_URL)

# -----------------------------
# DATABASE
# -----------------------------
db = client[settings.DATABASE_NAME]

# -----------------------------
# COLLECTIONS
# -----------------------------
students_collection = db.students
library_staff_collection = db.library_staff
staff_collection = db.staff
books_collection = db.books
transactions_collection = db.transactions
admin_collection = db.admin
issues_collection = db.issues
returns_collection = db.returns
fines_collection = db.fines

# -----------------------------
# CONNECTION TEST
# -----------------------------
def test_connection():
    try:
        client.server_info()
        print("✅ MongoDB connection successful")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        return False

# -----------------------------
# CLOSE CONNECTION
# -----------------------------
def close_connection():
    client.close()
