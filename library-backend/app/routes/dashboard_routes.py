from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime

from app.services.dashboard_service import dashboard_service
from app.services.auth_service import auth_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


# ==============================
# STUDENT DASHBOARD ENDPOINTS
# ==============================

@router.get("/student/{student_prn}")
async def get_student_dashboard(student_prn: str):
    """Get student-specific dashboard data"""
    try:
        dashboard_data = await dashboard_service.get_student_dashboard(student_prn)
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==============================
# LIBRARY STAFF DASHBOARD ENDPOINTS
# ==============================

@router.get("/library")
async def get_library_dashboard():
    """Get library staff dashboard data"""
    try:
        dashboard_data = await dashboard_service.get_library_dashboard()
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==============================
# COLLEGE STAFF DASHBOARD ENDPOINTS
# ==============================

@router.get("/college")
async def get_college_dashboard():
    """Get college staff dashboard data"""
    try:
        dashboard_data = await dashboard_service.get_college_dashboard()
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==============================
# GLOBAL DASHBOARD ENDPOINTS
# ==============================

@router.get("/global-stats")
async def get_global_stats():
    """Get global statistics for all dashboards"""
    try:
        global_stats = await dashboard_service.get_global_stats()
        return global_stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/defaulter-students")
async def get_defaulter_students():
    """Get list of students with overdue books"""
    try:
        defaulters = await dashboard_service.get_defaulter_students()
        return {"defaulter_students": defaulters}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==============================
# REMINDER ENDPOINTS
# ==============================

@router.post("/send-reminder/{student_prn}")
async def send_manual_reminder(student_prn: str):
    """Send manual reminder to a student with overdue books"""
    try:
        result = await dashboard_service.send_manual_reminder(student_prn)
        if result["success"]:
            return {
                "message": result["message"],
                "student_email": result["student_email"],
                "student_name": result["student_name"],
                "overdue_books_count": result["overdue_books_count"],
                "total_fine": result["total_fine"]
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==============================
# HEALTH CHECK
# ==============================

@router.get("/health")
async def dashboard_health():
    """Dashboard service health check"""
    return {
        "status": "Dashboard service is running",
        "timestamp": datetime.utcnow(),
        "services": {
            "dashboard_service": "active",
            "auth_service": "active"
        }
    }
