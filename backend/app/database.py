import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

# Attempt connection to MySQL first; fallback to SQLite if MySQL is unavailable
db_url = settings.DATABASE_URL
engine = None
active_dialect = "mysql"

try:
    if "mysql" in db_url.lower():
        test_engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=3600,
            connect_args={"connect_timeout": 3}
        )
        # Test connection immediately
        with test_engine.connect() as conn:
            logger.info("Successfully connected to MySQL database.")
        engine = test_engine
        active_dialect = "mysql"
    else:
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
        active_dialect = "sqlite"
except Exception as e:
    logger.warning(
        f"Could not connect to MySQL at {db_url} ({e}). "
        f"Falling back to local SQLite database: {settings.SQLITE_URL}"
    )
    engine = create_engine(
        settings.SQLITE_URL,
        connect_args={"check_same_thread": False}
    )
    active_dialect = "sqlite"

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
