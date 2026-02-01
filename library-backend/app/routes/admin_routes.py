from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from app.repositories.admin_repo import AdminRepository

router = APIRouter(prefix="/admin", tags=["Admin"])

admin_repo = AdminRepository()


@router.get("/transactions")
def get_all_transactions():
    transactions = admin_repo.get_daily_transactions(datetime.utcnow())
    return {"count": len(transactions), "transactions": transactions}
