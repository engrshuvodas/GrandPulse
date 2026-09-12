from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Task, Contribution, Member
from app.schemas import TaskResponse, TaskCreate, TaskUpdate, TaskStatusUpdate
from app.services.attribution import calculate_task_attribution

router = APIRouter(prefix="/api/tasks", tags=["Tasks & Kanban"])

@router.get("", response_model=List[TaskResponse])
def get_tasks(
    status: Optional[str] = Query(None),
    assignee: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Task)

    if status and status.lower() != "all":
        query = query.filter(Task.status == status)
    if assignee and assignee != "ALL":
        query = query.filter(Task.assignee_id == assignee)
    if priority and priority != "ALL":
        query = query.filter(Task.priority == priority)
    if search:
        query = query.filter(Task.title.ilike(f"%{search}%") | Task.id.ilike(f"%{search}%"))

    tasks = query.order_by(Task.created_at.desc()).all()
    return tasks

@router.post("", response_model=TaskResponse)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    task_id = payload.id
    if not task_id:
        count = db.query(Task).count()
        task_id = f"T-{count + 101}"

    # Verify ID uniqueness
    if db.query(Task).filter(Task.id == task_id).first():
        task_id = f"T-{int(datetime.utcnow().timestamp()) % 10000}"

    task = Task(
        id=task_id,
        title=payload.title,
        description=payload.description,
        assignee_id=payload.assignee_id,
        status=payload.status or "Pending",
        priority=payload.priority or "Medium",
        points=payload.points or 3,
        estimated_hours=payload.estimated_hours or 4.0,
        time_label="Just now"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.patch("/{task_id}/status")
def update_task_status(task_id: str, payload: TaskStatusUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_status = task.status
    new_status = payload.status
    task.status = new_status
    db.commit()

    attribution_created = None
    # Automated Attribution Engine trigger
    if old_status != "Completed" and new_status == "Completed" and task.assignee_id:
        level, hours, points = calculate_task_attribution(task.points)
        contrib_count = db.query(Contribution).count()
        new_contrib_id = f"C-{contrib_count + 1:02d}"

        # Check uniqueness
        if db.query(Contribution).filter(Contribution.id == new_contrib_id).first():
            new_contrib_id = f"C-{int(datetime.utcnow().timestamp()) % 10000}"

        auto_contrib = Contribution(
            id=new_contrib_id,
            member_id=task.assignee_id,
            task_id=task.id,
            title=f"Completed sprint milestone: {task.title}",
            category="Development",
            level=level,
            hours=hours,
            points=points,
            verified=True,
            time_label="Just now",
            date=datetime.utcnow().strftime("%Y-%m-%d")
        )
        db.add(auto_contrib)
        db.commit()
        db.refresh(auto_contrib)

        member = db.query(Member).filter(Member.id == task.assignee_id).first()
        attribution_created = {
            "contribution_id": auto_contrib.id,
            "points": points,
            "member_name": member.name if member else task.assignee_id,
            "message": f"+{points} Points credited to {member.name if member else task.assignee_id}!"
        }

    return {
        "success": True,
        "task_id": task.id,
        "status": task.status,
        "attribution": attribution_created
    }

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, payload: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"success": True, "message": f"Task {task_id} deleted"}
