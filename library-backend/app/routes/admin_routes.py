from fastapi import APIRouter, HTTPException
from datetime import date

from app.repositories.admin_repo import AdminRepository
from app.models.admin import AdminDashboardMetrics, AdminDailyReport, AdminRegister

router = APIRouter()
admin_repo = AdminRepository()

@router.post("/register")
def register_admin(data: AdminRegister):
    try:
        admin_id = admin_repo.create_admin(data.dict())
        return {"message": "Admin registered successfully", "id": admin_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/dashboard", response_model=AdminDashboardMetrics)
def admin_dashboard():
    return admin_repo.get_dashboard_metrics()


@router.get("/reports", response_model=AdminDailyReport)
def daily_report(report_date: date):
    return admin_repo.get_daily_report(report_date)
