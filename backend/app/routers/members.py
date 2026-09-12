from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Member, Task, Contribution
from app.schemas import MemberResponse, MemberCreate, MemberUpdate

router = APIRouter(prefix="/api/members", tags=["Team Members"])

@router.get("", response_model=List[MemberResponse])
def get_members(
    category: Optional[str] = Query("ALL"),
    sort_by: Optional[str] = Query("score"), # score, hours, tasks
    db: Session = Depends(get_db)
):
    members = db.query(Member).all()
    all_contributions = db.query(Contribution).all()
    all_tasks = db.query(Task).all()

    # Filter contributions by category if requested
    filtered_contributions = all_contributions
    if category and category != "ALL":
        filtered_contributions = [c for c in all_contributions if c.category == category]

    # Compute stats
    member_stats = []
    for m in members:
        m_logs = [c for c in filtered_contributions if c.member_id == m.id]
        score = sum(c.points for c in m_logs)
        hours = sum(c.hours for c in m_logs)
        completed = len([t for t in all_tasks if t.assignee_id == m.id and t.status == "Completed"])
        inprogress = len([t for t in all_tasks if t.assignee_id == m.id and t.status == "In Progress"])

        member_stats.append({
            "id": m.id,
            "name": m.name,
            "role": m.role,
            "email": m.email,
            "avatar_bg": m.avatar_bg,
            "avatar_text_color": m.avatar_text_color,
            "avatar_initial": m.avatar_initial,
            "avatar_url": m.avatar_url,
            "join_date": m.join_date,
            "tech_stack": m.tech_stack,
            "active_lead": m.active_lead,
            "accent_color": m.accent_color,
            "progress_fill_class": m.progress_fill_class,
            "score": score,
            "hours": round(hours, 1),
            "tasksCompleted": completed,
            "tasksInProgress": inprogress,
            "logsCount": len(m_logs),
        })

    # Sort
    if sort_by == "hours":
        member_stats.sort(key=lambda x: x["hours"], reverse=True)
    elif sort_by == "tasks":
        member_stats.sort(key=lambda x: x["tasksCompleted"], reverse=True)
    else:
        member_stats.sort(key=lambda x: x["score"], reverse=True)

    # Calculate rank and percentage
    total_score = sum(m["score"] for m in member_stats) or 1
    for idx, m in enumerate(member_stats):
        m["rank"] = idx + 1
        m["percentage"] = round((m["score"] / total_score) * 100, 1)

    return member_stats

@router.get("/{member_id}")
def get_member_dossier(member_id: str, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    tasks = db.query(Task).filter(Task.assignee_id == member_id).all()
    contributions = db.query(Contribution).filter(Contribution.member_id == member_id).order_by(Contribution.created_at.desc()).all()

    total_score = sum(c.points for c in contributions)
    total_hours = sum(c.hours for c in contributions)
    completed_tasks = len([t for t in tasks if t.status == "Completed"])
    inprogress_tasks = len([t for t in tasks if t.status == "In Progress"])

    # Category breakdown for this member
    categories = {}
    for c in contributions:
        categories[c.category] = categories.get(c.category, 0) + c.points

    return {
        "member": member,
        "score": total_score,
        "hours": round(total_hours, 1),
        "tasksCompleted": completed_tasks,
        "tasksInProgress": inprogress_tasks,
        "totalTasks": len(tasks),
        "categoryBreakdown": categories,
        "contributions": contributions,
        "tasks": tasks
    }

@router.post("", response_model=MemberResponse)
def create_member(payload: MemberCreate, db: Session = Depends(get_db)):
    existing = db.query(Member).filter(Member.id == payload.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Member ID already exists")

    # Generate initials if not given
    initials = payload.avatar_initial
    if not initials and payload.name:
        parts = payload.name.strip().split()
        initials = "".join([p[0].upper() for p in parts[:2]])

    member_dict = payload.dict()
    member_dict["avatar_initial"] = initials
    new_member = Member(**member_dict)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return {
        **member_dict,
        "score": 0,
        "hours": 0.0,
        "tasksCompleted": 0,
        "tasksInProgress": 0,
        "logsCount": 0,
        "rank": 99,
        "percentage": 0.0
    }

@router.put("/{member_id}")
def update_member(member_id: str, payload: MemberUpdate, db: Session = Depends(get_db)):
    """Update team member details (name, role, email, tech stack, avatar)."""
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    update_data = payload.dict(exclude_unset=True)
    
    # Auto-generate initials if name changed and avatar_initial not provided
    if "name" in update_data and not update_data.get("avatar_initial"):
        parts = update_data["name"].strip().split()
        update_data["avatar_initial"] = "".join([p[0].upper() for p in parts[:2]])

    for key, value in update_data.items():
        if value is not None:
            setattr(member, key, value)

    db.commit()
    db.refresh(member)

    return {
        "success": True,
        "message": f"Member {member.name} updated successfully",
        "member": {
            "id": member.id,
            "name": member.name,
            "role": member.role,
            "email": member.email,
            "tech_stack": member.tech_stack,
            "avatar_initial": member.avatar_initial,
            "avatar_url": member.avatar_url,
            "active_lead": member.active_lead,
            "accent_color": member.accent_color
        }
    }

@router.delete("/{member_id}")
def delete_member(member_id: str, db: Session = Depends(get_db)):
    """Delete team member and cleanly unlink associated tasks/modules."""
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    # Unlink tasks
    tasks = db.query(Task).filter(Task.assignee_id == member_id).all()
    for t in tasks:
        t.assignee_id = None

    # Delete contributions
    db.query(Contribution).filter(Contribution.member_id == member_id).delete()

    db.delete(member)
    db.commit()

    return {
        "success": True,
        "message": f"Member {member.name} deleted successfully"
    }
