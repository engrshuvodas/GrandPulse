from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(100), default="Engineer")
    member_id = Column(String(50), ForeignKey("members.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    member = relationship("Member", back_populates="user")


class Member(Base):
    __tablename__ = "members"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'shuvo', 'monami', 'setu'
    name = Column(String(150), nullable=False)
    role = Column(String(150), nullable=False)
    email = Column(String(255), nullable=True)
    avatar_bg = Column(String(50), default="bg-primary")
    avatar_text_color = Column(String(50), default="text-on-primary")
    avatar_initial = Column(String(10), default="GP")
    avatar_url = Column(Text, nullable=True)
    join_date = Column(String(100), default="Jan 2024")
    tech_stack = Column(String(255), default="Full Stack")
    active_lead = Column(Boolean, default=False)
    accent_color = Column(String(20), default="#c0c1ff")
    progress_fill_class = Column(String(50), default="bg-primary")

    user = relationship("User", back_populates="member", uselist=False)
    tasks = relationship("Task", back_populates="assignee")
    contributions = relationship("Contribution", back_populates="member")
    weekly_velocities = relationship("WeeklyVelocity", back_populates="member")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'T-101'
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    assignee_id = Column(String(50), ForeignKey("members.id"), nullable=True)
    status = Column(String(50), default="Pending", index=True) # Pending, In Progress, Completed
    priority = Column(String(50), default="Medium") # Urgent, High, Medium, Small
    points = Column(Integer, default=3)
    estimated_hours = Column(Float, default=4.0)
    time_label = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

    assignee = relationship("Member", back_populates="tasks")
    contributions = relationship("Contribution", back_populates="task")


class Contribution(Base):
    __tablename__ = "contributions"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'C-01'
    member_id = Column(String(50), ForeignKey("members.id"), nullable=False, index=True)
    task_id = Column(String(50), ForeignKey("tasks.id"), nullable=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="Development", index=True) # Development, Bug Fix, Architecture, Design, Testing, DevOps
    level = Column(String(50), default="Medium") # Small, Medium, Large, Major
    hours = Column(Float, default=2.0)
    points = Column(Integer, default=2)
    verified = Column(Boolean, default=True)
    time_label = Column(String(50), default="Just now")
    date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    member = relationship("Member", back_populates="contributions")
    task = relationship("Task", back_populates="contributions")


class WeeklyVelocity(Base):
    __tablename__ = "weekly_velocities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    member_id = Column(String(50), ForeignKey("members.id"), nullable=False)
    week_label = Column(String(20), nullable=False) # 'W05', 'W06', etc.
    points = Column(Integer, default=0)
    hours = Column(Float, default=0.0)
    week_order = Column(Integer, default=1)

    member = relationship("Member", back_populates="weekly_velocities")
