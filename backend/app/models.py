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

    id = Column(String(50), primary_key=True, index=True)
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
    tasks = relationship("GanttTask", back_populates="assignee")
    contributions = relationship("Contribution", back_populates="member")


class GanttTask(Base):
    __tablename__ = "gantt_tasks"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'GT-01'
    title = Column(String(255), nullable=False)
    phase = Column(String(100), default="Development") # Planning, Design, Development, Testing, Deployment
    start_week = Column(Integer, nullable=False) # 1 to 16
    end_week = Column(Integer, nullable=False)   # 1 to 16
    duration_weeks = Column(Integer, nullable=False)
    progress_pct = Column(Integer, default=0)    # 0 to 100
    status = Column(String(50), default="Pending") # Completed, In Progress, Pending
    priority = Column(String(50), default="Medium")
    points = Column(Integer, default=3)
    assignee_id = Column(String(50), ForeignKey("members.id"), nullable=True)
    module_id = Column(Integer, ForeignKey("project_modules.id"), nullable=True)
    color = Column(String(20), default="#6366f1")
    created_at = Column(DateTime, default=datetime.utcnow)

    assignee = relationship("Member", back_populates="tasks")
    module = relationship("ProjectModule", back_populates="tasks")

    @property
    def estimated_hours(self):
        return float(self.duration_weeks * 8)

# Backwards compatibility alias
Task = GanttTask


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    week = Column(Integer, nullable=False) # Week 2, 5, 9, 12, 14, 15, 16
    title = Column(String(255), nullable=False)
    status = Column(String(50), default="Pending") # Completed, In Progress, Upcoming
    completed = Column(Boolean, default=False)


class ProjectModule(Base):
    __tablename__ = "project_modules"

    id = Column(Integer, primary_key=True) # 1 to 10
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="In Progress") # Completed, In Progress, Queued
    completion_pct = Column(Integer, default=0)
    lead_id = Column(String(50), ForeignKey("members.id"), nullable=True)

    tasks = relationship("GanttTask", back_populates="module")


class Contribution(Base):
    __tablename__ = "contributions"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'C-01'
    member_id = Column(String(50), ForeignKey("members.id"), nullable=False, index=True)
    task_id = Column(String(50), nullable=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="Development")
    level = Column(String(50), default="Medium")
    hours = Column(Float, default=2.0)
    points = Column(Integer, default=2)
    verified = Column(Boolean, default=True)
    time_label = Column(String(50), default="Just now")
    date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    member = relationship("Member", back_populates="contributions")
