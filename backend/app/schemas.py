from typing import Optional, List
from pydantic import BaseModel

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
    email: str
    password: str
    role: Optional[str] = "Engineer"
    member_id: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    member_id: Optional[str] = None

    model_config = {"from_attributes": True}

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

class MemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    tech_stack: Optional[str] = None
    avatar_url: Optional[str] = None
    avatar_initial: Optional[str] = None
    active_lead: Optional[bool] = None
    accent_color: Optional[str] = None

class MemberResponse(MemberBase):
    score: Optional[int] = 0
    hours: Optional[float] = 0.0
    tasksCompleted: Optional[int] = 0
    tasksInProgress: Optional[int] = 0
    logsCount: Optional[int] = 0
    rank: Optional[int] = 1
    percentage: Optional[float] = 0.0

    model_config = {"from_attributes": True}

# Gantt Task Schemas (Directly from User PDF)
class GanttTaskBase(BaseModel):
    title: str
    phase: Optional[str] = "Development"
    start_week: int
    end_week: int
    duration_weeks: int
    progress_pct: Optional[int] = 0
    status: Optional[str] = "Pending"
    priority: Optional[str] = "Medium"
    points: Optional[int] = 3
    assignee_id: Optional[str] = None
    module_id: Optional[int] = None
    color: Optional[str] = "#6366f1"

class GanttTaskCreate(GanttTaskBase):
    id: Optional[str] = None

class GanttTaskUpdate(BaseModel):
    progress_pct: Optional[int] = None
    status: Optional[str] = None
    assignee_id: Optional[str] = None

class GanttTaskResponse(GanttTaskBase):
    id: str
    assignee: Optional[MemberBase] = None

    model_config = {"from_attributes": True}

# Compatibility aliases
TaskResponse = GanttTaskResponse
TaskCreate = GanttTaskCreate
TaskUpdate = GanttTaskUpdate

class TaskStatusUpdate(BaseModel):
    status: str

# Milestone Schemas (PDF Page 3)
class MilestoneResponse(BaseModel):
    id: int
    week: int
    title: str
    status: str
    completed: bool

    model_config = {"from_attributes": True}

# Project Module Schemas (PDF Page 3: 10 Major Modules)
class ProjectModuleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    status: str
    completion_pct: int
    lead_id: Optional[str] = None

    model_config = {"from_attributes": True}

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

    model_config = {"from_attributes": True}

# Summary Metrics
class SummaryMetrics(BaseModel):
    project_name: Optional[str] = "Hostel Management System"
    project_duration: Optional[str] = "16 Weeks"
    active_week: Optional[int] = 6
    total_tasks: int
    completed_tasks: int
    inprogress_tasks: int
    pending_tasks: Optional[int] = 0
    total_modules: Optional[int] = 10
    completed_modules: Optional[int] = 0
    milestones_met: Optional[int] = 2
    total_milestones: Optional[int] = 7
    sprint_velocity: Optional[str] = "94.8%"
    overall_progress_pct: Optional[int] = 35
    active_members: Optional[int] = 3
    total_logs: Optional[int] = 12
    total_hours: Optional[float] = 95.0
    total_points: Optional[int] = 85
    sprint_health: Optional[str] = "+18.4%"
    completed_ratio: Optional[float] = 35.0
