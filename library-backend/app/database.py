from pymongo import MongoClient
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
