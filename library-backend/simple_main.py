from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all routes
from app.routes.library_staff_routes import router as library_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.admin_routes import router as admin_router

# Create FastAPI app instance
app = FastAPI(
    title="Library Management System",
    description="Backend API for College Library Management System",
    version="1.0.0"
)

# -----------------------------
# CORS CONFIGURATION
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# INCLUDE ALL ROUTES
# -----------------------------
app.include_router(library_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

# -----------------------------
# HEALTH CHECK ROUTE
# -----------------------------
@app.get("/")
def health_check():
    return {
        "status": "Backend is running",
        "message": "Library Management System API is alive",
        "version": "1.0.0",
        "endpoints": {
            "library": "/api/library/*",
            "dashboard": "/api/dashboard/*",
            "admin": "/api/admin/*"
        }
    }

# -----------------------------
# BASIC DASHBOARD ROUTE
# -----------------------------
@app.get("/dashboard/test")
def test_dashboard():
    return {
        "message": "Dashboard endpoint working",
        "data": {
            "student_books": 5,
            "library_stats": {
                "total_books": 1000,
                "issued_books": 245
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
