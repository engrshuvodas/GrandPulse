import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "GrandPulse API"
    VERSION: str = "2.4.0"
    
    # Database configuration - defaults to MySQL with auto-fallback to SQLite
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE", "grandpulse")
    
    # Custom DATABASE_URL override if supplied
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
    )
    
    # Fallback SQLite DB
    SQLITE_URL: str = "sqlite:///./grandpulse.db"
    
    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "grandpulse-super-secret-jwt-key-2026-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
