import logging
import urllib.parse
from datetime import datetime
from typing import Generator
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text,
    Float,
    DateTime,
    ForeignKey,
    text
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from .config import settings

logger = logging.getLogger("debot.database")

Base = declarative_base()

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class SavedDraftModel(Base):
    __tablename__ = "saved_drafts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    original_text = Column(Text, nullable=False)
    rewritten_text = Column(Text, nullable=False)
    mode = Column(String(50), nullable=False)
    language = Column(String(20), nullable=False)
    change_summary = Column(Text, nullable=True)
    preservation_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


def _init_db_engine():
    """
    Attempt to initialize MySQL connection with auto-database creation.
    If MySQL connection fails or credentials aren't set, gracefully fall back to SQLite
    so the entire authentication & session workflow remains 100% operational.
    """
    # 1. Check if an explicit DATABASE_URL was provided
    if settings.DATABASE_URL:
        try:
            engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Connected to database via configured DATABASE_URL")
            db_type = "mysql" if "mysql" in settings.DATABASE_URL.lower() else "sqlite"
            return engine, db_type
        except Exception as e:
            logger.warning("Configured DATABASE_URL failed: %s. Attempting fallback.", e)

    # 2. Try MySQL connection using individual settings
    try:
        user = settings.MYSQL_USER
        pwd = settings.MYSQL_PASSWORD
        host = settings.MYSQL_HOST
        port = settings.MYSQL_PORT
        db_name = settings.MYSQL_DATABASE

        # URL to connect to MySQL server (without specifying DB first to create it)
        if pwd:
            escaped_pwd = urllib.parse.quote_plus(pwd)
            server_url = f"mysql+pymysql://{user}:{escaped_pwd}@{host}:{port}/?charset=utf8mb4"
            db_url = f"mysql+pymysql://{user}:{escaped_pwd}@{host}:{port}/{db_name}?charset=utf8mb4"
        else:
            server_url = f"mysql+pymysql://{user}@{host}:{port}/?charset=utf8mb4"
            db_url = f"mysql+pymysql://{user}@{host}:{port}/{db_name}?charset=utf8mb4"

        # Attempt to auto-create database if not exists
        server_engine = create_engine(server_url, pool_pre_ping=True, connect_args={"connect_timeout": 3})
        with server_engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"))
            conn.commit()
        server_engine.dispose()

        # Connect to target MySQL database
        engine = create_engine(db_url, pool_pre_ping=True, pool_recycle=3600)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        logger.info("Successfully connected to MySQL database: %s on %s:%s", db_name, host, port)
        return engine, "mysql"
    except Exception as exc:
        logger.warning(
            "MySQL connection not ready (%s). Automatically falling back to SQLite (sqlite:///./debot.db).",
            exc
        )
        sqlite_engine = create_engine(
            "sqlite:///./debot.db",
            connect_args={"check_same_thread": False}
        )
        return sqlite_engine, "sqlite"


engine, active_db_type = _init_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """Create all database tables on application startup."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully on %s", active_db_type)
    except Exception as e:
        logger.error("Error creating database tables: %s", e)

def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency yielding a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
