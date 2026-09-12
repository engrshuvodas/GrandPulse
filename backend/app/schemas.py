from typing import Optional, List
from pydantic import BaseModel, EmailStr

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserResponse"

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = "Engineer"
    member_id: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    member_id: Optional[str] = None

    class Config:
        from_attributes = True

# Member Schemas
class MemberBase(BaseModel):
    id: str
    name: str
    role: str
    email: Optional[str] = None
    avatar_bg: Optional[str] = "bg-primary"
    avatar_text_color: Optional[str] = "text-on-primary"
    avatar_initial: Optional[str] = "GP"
    avatar_url: Optional[str] = None
    join_date: Optional[str] = "Jan 2024"
    tech_stack: Optional[str] = "Full Stack"
    active_lead: Optional[bool] = False
    accent_color: Optional[str] = "#c0c1ff"
    progress_fill_class: Optional[str] = "bg-primary"

class MemberCreate(MemberBase):
    pass

class MemberResponse(MemberBase):
    score: Optional[int] = 0
    hours: Optional[float] = 0.0
    tasksCompleted: Optional[int] = 0
    tasksInProgress: Optional[int] = 0
    logsCount: Optional[int] = 0
    rank: Optional[int] = 1
    percentage: Optional[float] = 0.0

    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assignee_id: Optional[str] = None
    status: Optional[str] = "Pending"
    priority: Optional[str] = "Medium"
    points: Optional[int] = 3
    estimated_hours: Optional[float] = 4.0

class TaskCreate(TaskBase):
    id: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee_id: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    points: Optional[int] = None
    estimated_hours: Optional[float] = None

class TaskStatusUpdate(BaseModel):
    status: str

class TaskResponse(TaskBase):
    id: str
    time_label: Optional[str] = "Active"
    assignee: Optional[MemberBase] = None

    class Config:
        from_attributes = True

# Contribution Schemas
class ContributionBase(BaseModel):
    member_id: str
    task_id: Optional[str] = None
    title: str
    category: Optional[str] = "Development"
    level: Optional[str] = "Medium"
    hours: Optional[float] = 2.0
    points: Optional[int] = 2
    verified: Optional[bool] = True
    date: Optional[str] = None

class ContributionCreate(ContributionBase):
    id: Optional[str] = None

class ContributionResponse(ContributionBase):
    id: str
    time_label: Optional[str] = "Just now"
    member: Optional[MemberBase] = None

    class Config:
        from_attributes = True

# Summary & Metrics Schemas
class SummaryMetrics(BaseModel):
    active_members: int
    total_tasks: int
    completed_tasks: int
    completed_ratio: float
    inprogress_tasks: int
    pending_tasks: int
    total_logs: int
    total_hours: float
    total_points: int
    sprint_health: str
    sprint_velocity: str

class WeeklyVelocityItem(BaseModel):
    week: str
    points: int
    hours: float

class CategoryAttributionItem(BaseModel):
    category: str
    points: float
    percentage: float
    count: int
