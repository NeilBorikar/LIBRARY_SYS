from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # JWT Configuration
    JWT_SECRET: str = "your-secret-key-here"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION: int = 24  # hours

    # Database Configuration
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "library_db"

    # Email Configuration
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    GMAIL_EMAIL: str = "library@college.edu"
    GMAIL_PASSWORD: str = "app_password"
    LIBRARY_STAFF_EMAIL: str = "library@college.edu"

    # Application Configuration
    DEBUG: bool = True

    class Config:
        env_file = ".env"


# Create settings instance
settings = Settings()
