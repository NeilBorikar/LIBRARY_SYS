from datetime import datetime
from typing import List, Optional

from app.database import (
    issues_collection,
    returns_collection,
    fines_collection,
    deposits_collection
)


class TransactionRepository:
    """
    Read-only transaction repository.
    Used for analytics, audit, and admin views.
    NO write-side business logic lives here.
    """

    # -------------------------
    # ISSUES
    # -------------------------
    def get_all_issues(self) -> List[dict]:
        return list(issues_collection.find({}))

    def get_issues_by_user(
        self,
        user_type: str,
        user_id: str
    ) -> List[dict]:
        return list(
            issues_collection.find({
                "user_type": user_type,
                "user_id": user_id
            })
        )

    def get_active_issues(self) -> List[dict]:
        return list(
            issues_collection.find({"status": "issued"})
        )

    # -------------------------
    # RETURNS
    # -------------------------
    def get_all_returns(self) -> List[dict]:
        return list(returns_collection.find({}))

    def get_returns_by_user(
        self,
        user_type: str,
        user_id: str
    ) -> List[dict]:
        return list(
            returns_collection.find({
                "user_type": user_type,
                "user_id": user_id
            })
        )

    # -------------------------
    # FINES
    # -------------------------
    def get_all_fines(self) -> List[dict]:
        return list(fines_collection.find({}))

    def get_fines_by_user(
        self,
        user_type: str,
        user_id: str
    ) -> List[dict]:
        return list(
            fines_collection.find({
                "user_type": user_type,
                "user_id": user_id
            })
        )

    # -------------------------
    # DEPOSITS (STAFF)
    # -------------------------
    def get_all_deposits(self) -> List[dict]:
        return list(deposits_collection.find({}))

    def get_deposit_by_staff(
        self,
        emp_id: str
    ) -> Optional[dict]:
        return deposits_collection.find_one({"emp_id": emp_id})
