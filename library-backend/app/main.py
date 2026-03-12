from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.auth_routes import router as auth_router
from app.routes.student_routes import router as student_router
from app.routes.library_staff_routes import router as library_staff_router
from app.routes.staff_routes import router as staff_router
from app.routes.admin_routes import router as admin_router
from app.utils.scheduler import library_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    library_scheduler.start()
    yield
    # Shutdown
    library_scheduler.stop()

# Create FastAPI app instance
app = FastAPI(
    title="Library Management System",
    description="Backend API for College Library Management System",
    version="1.0.0",
    lifespan=lifespan
)

# -----------------------------
# CORS CONFIGURATION
# -----------------------------
# This allows React frontend to talk to backend

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later we will restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# HEALTH CHECK ROUTE
# -----------------------------
@app.get("/")
def health_check():
    return {
        "status": "Backend is running",
        "message": "Library Management System API is alive"
    }

# -----------------------------
# INCLUDE ALL ROUTES
# -----------------------------
app.include_router(dashboard_router)
app.include_router(auth_router)
app.include_router(student_router)
app.include_router(library_staff_router)
app.include_router(staff_router)
app.include_router(admin_router)
