from pydantic import BaseSettings


class Settings(BaseSettings):
    # -----------------------------
    # APP
    # -----------------------------
    APP_NAME: str = "Library Management System"
    DEBUG: bool = False

    # -----------------------------
    # DATABASE
    # -----------------------------
    MONGO_URI: str
    MONGO_DB_NAME: str = "library_db"

    # -----------------------------
    # SECURITY
    # -----------------------------
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_MINUTES: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
