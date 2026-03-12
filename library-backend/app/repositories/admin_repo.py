from datetime import datetime, date, time
from typing import List, Dict

from app.database import (
    admins_collection,
    issues_collection,
    returns_collection,
    fines_collection,
    books_collection
)
from app.utils.password import hash_password

class AdminRepository:
    def __init__(self):
        pass

    def create_admin(self, data: dict) -> str:
        if admins_collection.find_one({"email": data["email"]}):
            raise ValueError("Admin with this email already exists")

        data["password"] = hash_password(data["password"])
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = None

        result = admins_collection.insert_one(data)
        print("DATA RECEIVED:", data)
        print("PASSWORD FIELD:", data.get("password"))
        print("TYPE:", type(data.get("password")))
        return str(result.inserted_id)

    # -------------------------
    # DASHBOARD METRICS
    # -------------------------
    def get_dashboard_metrics(self) -> Dict[str, int]:
        total_books = books_collection.count_documents({})
        active_issues = issues_collection.count_documents({"status": "issued"})
        total_issued = issues_collection.count_documents({})
        total_returns = returns_collection.count_documents({})
        total_fines = fines_collection.count_documents({})

        return {
            "total_books": total_books,
            "active_issues": active_issues,
            "total_issued": total_issued,
            "total_returns": total_returns,
            "total_fines_collected": total_fines
        }

    # -------------------------
    # TODAY REPORTS
    # -------------------------
    def get_today_issued_books(self) -> List[dict]:
        start = datetime.combine(date.today(), time.min)
        end = datetime.combine(date.today(), time.max)

        return list(
            issues_collection.find({
                "issue_date": {"$gte": start, "$lte": end}
            })
        )

    def get_today_returned_books(self) -> List[dict]:
        start = datetime.combine(date.today(), time.min)
        end = datetime.combine(date.today(), time.max)

        return list(
            returns_collection.find({
                "return_date": {"$gte": start, "$lte": end}
            })
        )

    def get_today_fines_collected(self) -> List[dict]:
        start = datetime.combine(date.today(), time.min)
        end = datetime.combine(date.today(), time.max)

        return list(
            fines_collection.find({
                "paid_at": {"$gte": start, "$lte": end}
            })
        )

    # -------------------------
    # DAILY REPORT (ANY DATE)
    # -------------------------
    def get_daily_report(self, report_date: date) -> Dict[str, List[dict]]:
        start = datetime.combine(report_date, time.min)
        end = datetime.combine(report_date, time.max)

        issued = list(
            issues_collection.find({
                "issue_date": {"$gte": start, "$lte": end}
            })
        )

        returned = list(
            returns_collection.find({
                "return_date": {"$gte": start, "$lte": end}
            })
        )

        fines = list(
            fines_collection.find({
                "paid_at": {"$gte": start, "$lte": end}
            })
        )

        return {
            "issued": issued,
            "returned": returned,
            "fines": fines
        }

    # -------------------------
    # RAW LISTING (OPTIONAL)
    # -------------------------
    def get_all_issued_books(self) -> List[dict]:
        return list(issues_collection.find({}))

    def get_all_returned_books(self) -> List[dict]:
        return list(returns_collection.find({}))

    def get_all_fines(self) -> List[dict]:
        return list(fines_collection.find({}))
