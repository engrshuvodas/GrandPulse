import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal, active_dialect
from app.seed_data import seed_database
from app.routers import auth, members, tasks, contributions, analytics, export, gantt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("grandpulse")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    logger.info(f"Initializing database tables using dialect: {active_dialect}...")
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed initial data
    db = SessionLocal()
    try:
        seed_database(db)
        logger.info("Database seeding completed successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

    yield
    logger.info("GrandPulse API shutting down...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Backend API for GrandPulse Team Contribution Tracker",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow development frontends
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(gantt.router)
app.include_router(members.router)
app.include_router(tasks.router)
app.include_router(contributions.router)
app.include_router(analytics.router)
app.include_router(export.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "database_dialect": active_dialect
    }
