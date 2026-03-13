from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.auth_routes import router as auth_router
from app.routes.student_routes import router as student_router
from app.routes.library_staff_routes import router as library_staff_router
from app.routes.staff_routes import router as staff_router
from app.routes.admin_routes import router as admin_router
from app.routes.reminder_routes import router as reminder_router
from app.services.reminder_scheduler import reminder_scheduler
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    reminder_scheduler.start()
    yield
    # Shutdown
    reminder_scheduler.stop()

app = FastAPI(
    title="Library Management System",
    description="Backend API for College Library Management System",
    version="1.0.0",
    lifespan=lifespan
)

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# ROUTE REGISTRATION
# -----------------------------
app.include_router(dashboard_router, tags=["Dashboard"])
app.include_router(auth_router, tags=["Auth"])
app.include_router(student_router, tags=["Student"])
app.include_router(staff_router, tags=["Staff"])
app.include_router(library_staff_router, tags=["Library"])
app.include_router(admin_router, tags=["Admin"])
app.include_router(reminder_router, tags=["Reminders"])

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/")
def health_check():
    return {
        "status": "OK",
        "message": "Library Management System API is running"
    }
