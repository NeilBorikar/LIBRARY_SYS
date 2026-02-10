from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

# ROUTES
from app.routes.auth_routes import router as auth_router
from app.routes.student_routes import router as student_router
from app.routes.staff_routes import router as staff_router
from app.routes.library_staff_routes import router as library_router
from app.routes.admin_routes import router as admin_router


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
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
