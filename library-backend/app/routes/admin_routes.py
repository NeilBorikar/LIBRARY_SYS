from fastapi import APIRouter
from datetime import date

from app.repositories.admin_repo import AdminRepository
from app.models.admin import AdminDashboardMetrics, AdminDailyReport

router = APIRouter()
admin_repo = AdminRepository()


@router.get("/dashboard", response_model=AdminDashboardMetrics)
def admin_dashboard():
    return admin_repo.get_dashboard_metrics()


@router.get("/reports", response_model=AdminDailyReport)
def daily_report(report_date: date):
    return admin_repo.get_daily_report(report_date)
