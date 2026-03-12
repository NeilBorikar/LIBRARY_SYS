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

from app.config import settings

# ROUTES
from app.routes.auth_routes import router as auth_router
from app.routes.student_routes import router as student_router
from app.routes.staff_routes import router as staff_router
from app.routes.library_staff_routes import router as library_router
from app.routes.admin_routes import router as admin_router


app = FastAPI(
<<<<<<< HEAD
    title="Library Management System",
    description="Backend API for College Library Management System",
    version="1.0.0",
    lifespan=lifespan
=======
    title=settings.APP_NAME,
    version="1.0.0"
>>>>>>> e6d8db4533e4bd76b2850fb35827a25a589cf1bb
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
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(student_router, prefix="/student", tags=["Student"])
app.include_router(staff_router, prefix="/staff", tags=["Staff"])
app.include_router(library_router, prefix="/library", tags=["Library"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/")
def health_check():
    return {
        "status": "OK",
        "message": "Library Management System API is running"
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
