from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app instance
app = FastAPI(
    title="Library Management System",
    description="Backend API for College Library Management System",
    version="1.0.0"
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
