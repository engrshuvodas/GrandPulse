import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import GanttTask, Milestone, ProjectModule, Member, Contribution
from app.schemas import (
    GanttTaskResponse, GanttTaskUpdate,
    MilestoneResponse, ProjectModuleResponse,
    SummaryMetrics
)

logger = logging.getLogger("grandpulse")
router = APIRouter(prefix="/api/gantt", tags=["Gantt Chart & Schedule"])

@router.get("/tasks", response_model=List[GanttTaskResponse])
def get_gantt_tasks(phase: Optional[str] = None, db: Session = Depends(get_db)):
    """Fetch all project tasks for the 16-week Gantt schedule."""
    query = db.query(GanttTask)
    if phase and phase.upper() != "ALL":
        query = query.filter(GanttTask.phase == phase)
    tasks = query.order_by(GanttTask.start_week, GanttTask.id).all()
    return tasks

@router.get("/milestones", response_model=List[MilestoneResponse])
def get_milestones(db: Session = Depends(get_db)):
    """Fetch the 7 key project milestones from the PDF."""
    milestones = db.query(Milestone).order_by(Milestone.week).all()
    return milestones

@router.get("/modules", response_model=List[ProjectModuleResponse])
def get_modules(db: Session = Depends(get_db)):
    """Fetch the 10 major modules of the Hostel Management System."""
    modules = db.query(ProjectModule).order_by(ProjectModule.id).all()
    return modules

@router.patch("/tasks/{task_id}/progress", response_model=GanttTaskResponse)
def update_task_progress(task_id: str, payload: GanttTaskUpdate, db: Session = Depends(get_db)):
    """Update task progress percentage or status, awarding velocity points to assignee."""
    task = db.query(GanttTask).filter(GanttTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_progress = task.progress_pct
    if payload.progress_pct is not None:
        clamped = max(0, min(100, payload.progress_pct))
        task.progress_pct = clamped
        if clamped == 100:
            task.status = "Completed"
        elif clamped > 0:
            task.status = "In Progress"
        else:
            task.status = "Pending"

    if payload.status:
        task.status = payload.status
        if payload.status == "Completed":
            task.progress_pct = 100

    if payload.assignee_id is not None:
        task.assignee_id = payload.assignee_id

    # If completed and wasn't 100% before, award points to member
    if task.progress_pct == 100 and old_progress < 100 and task.assignee_id:
        member = db.query(Member).filter(Member.id == task.assignee_id).first()
        if member:
            member.score += task.points
            member.completed_tasks_count += 1
            # Log contribution
            contrib = Contribution(
                id=f"C-GANTT-{task.id}",
                member_id=member.id,
                task_id=task.id,
                title=f"Completed {task.title} (Week {task.start_week}-{task.end_week})",
                category="Development" if "Module" in task.title or "Design" in task.title else "Planning",
                level="High" if task.priority == "High" else "Medium",
                hours=float(task.duration_weeks * 8),
                points=task.points,
                verified=True,
                time_label="Just now"
            )
            db.merge(contrib)

    # Check if related module progress should update
    if task.module_id:
        mod = db.query(ProjectModule).filter(ProjectModule.id == task.module_id).first()
        if mod:
            related_tasks = db.query(GanttTask).filter(GanttTask.module_id == mod.id).all()
            if related_tasks:
                avg_pct = sum(t.progress_pct for t in related_tasks) // len(related_tasks)
                mod.completion_pct = avg_pct
                if avg_pct == 100:
                    mod.status = "Completed"
                elif avg_pct > 0:
                    mod.status = "In Progress"

    db.commit()
    db.refresh(task)
    return task

@router.get("/summary", response_model=SummaryMetrics)
def get_gantt_summary(db: Session = Depends(get_db)):
    """Compute overall project progress and velocity metrics."""
    total_tasks = db.query(GanttTask).count()
    completed_tasks = db.query(GanttTask).filter(GanttTask.status == "Completed").count()
    inprogress_tasks = db.query(GanttTask).filter(GanttTask.status == "In Progress").count()
    
    total_modules = db.query(ProjectModule).count()
    completed_modules = db.query(ProjectModule).filter(ProjectModule.status == "Completed").count()

    total_milestones = db.query(Milestone).count()
    milestones_met = db.query(Milestone).filter(Milestone.completed == True).count()

    tasks = db.query(GanttTask).all()
    overall_progress = (sum(t.progress_pct for t in tasks) // total_tasks) if total_tasks > 0 else 0

    return SummaryMetrics(
        project_name="RaktSeva Blood Bank System",
        project_duration="16 Weeks",
        active_week=13,  # Currently in Week 13 of Testing/Deployment phase
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        inprogress_tasks=inprogress_tasks,
        total_modules=total_modules,
        completed_modules=completed_modules,
        milestones_met=milestones_met,
        total_milestones=total_milestones,
        sprint_velocity="94.8%",
        overall_progress_pct=overall_progress
    )
