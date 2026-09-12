from typing import List, Dict, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Member, GanttTask, Contribution, ProjectModule, Milestone
from app.schemas import SummaryMetrics

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Velocity"])

@router.get("/summary", response_model=SummaryMetrics)
def get_summary_metrics(db: Session = Depends(get_db)):
    active_members = db.query(Member).count()
    all_tasks = db.query(GanttTask).all()
    all_contributions = db.query(Contribution).all()
    all_modules = db.query(ProjectModule).all()
    all_milestones = db.query(Milestone).all()

    total_tasks = len(all_tasks)
    completed_tasks = len([t for t in all_tasks if t.status == "Completed"])
    inprogress_tasks = len([t for t in all_tasks if t.status == "In Progress"])
    pending_tasks = len([t for t in all_tasks if t.status == "Pending"])

    completed_modules = len([m for m in all_modules if m.status == "Completed"])
    milestones_met = len([ms for ms in all_milestones if ms.completed])

    completed_ratio = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0
    total_logs = len(all_contributions)
    total_hours = round(sum(c.hours for c in all_contributions), 1)
    total_points = sum(c.points for c in all_contributions)
    overall_progress = (sum(t.progress_pct for t in all_tasks) // total_tasks) if total_tasks > 0 else 0

    return SummaryMetrics(
        project_name="RaktSeva Blood Bank System",
        project_duration="16 Weeks",
        active_week=13,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        inprogress_tasks=inprogress_tasks,
        pending_tasks=pending_tasks,
        total_modules=len(all_modules),
        completed_modules=completed_modules,
        milestones_met=milestones_met,
        total_milestones=len(all_milestones),
        sprint_velocity=f"{completed_ratio}%",
        overall_progress_pct=overall_progress,
        active_members=active_members,
        total_logs=total_logs,
        total_hours=total_hours,
        total_points=total_points,
        sprint_health="+18.4%",
        completed_ratio=completed_ratio
    )

@router.get("/weekly-velocity")
def get_weekly_velocity(member_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """
    Returns the 16-week project schedule velocity trajectory (W1 to W16)
    comparing planned tasks vs completed progress.
    """
    all_tasks = db.query(GanttTask).all()
    if member_id and member_id.upper() != "ALL":
        filtered_tasks = [t for t in all_tasks if t.assignee_id == member_id]
        if not filtered_tasks:
            filtered_tasks = all_tasks
    else:
        filtered_tasks = all_tasks

    result = []
    accumulated_planned = 0
    accumulated_completed = 0

    for w in range(1, 17):
        # Tasks active in week w
        active_in_w = [t for t in filtered_tasks if t.start_week <= w <= t.end_week]
        # Tasks ending in week w
        due_in_w = [t for t in filtered_tasks if t.end_week == w]
        completed_in_w = [t for t in due_in_w if t.status == "Completed"]
        
        points_w = sum(t.points for t in active_in_w)
        hours_w = sum(t.duration_weeks * 6.0 for t in active_in_w)

        accumulated_planned += len(due_in_w)
        accumulated_completed += len(completed_in_w)

        result.append({
            "week": f"W{w:02d}",
            "weekNumber": w,
            "activeTasks": len(active_in_w),
            "points": points_w,
            "hours": round(hours_w, 1),
            "target": 35,
            "plannedCumulative": accumulated_planned,
            "completedCumulative": accumulated_completed,
            "isCurrent": (w == 6)
        })

    return result

@router.get("/category-distribution")
def get_category_distribution(member_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Contribution)
    if member_id and member_id.upper() != "ALL":
        query = query.filter(Contribution.member_id == member_id)

    contributions = query.all()
    total_points = sum(c.points for c in contributions) or 1

    cat_map: Dict[str, Dict] = {
        "Planning": {"points": 0, "count": 0, "color": "#a78bfa"},
        "Design": {"points": 0, "count": 0, "color": "#38bdf8"},
        "Development": {"points": 0, "count": 0, "color": "#818cf8"},
        "Testing": {"points": 0, "count": 0, "color": "#34d399"},
        "Bug Fix": {"points": 0, "count": 0, "color": "#f87171"},
        "DevOps": {"points": 0, "count": 0, "color": "#fbbf24"}
    }

    for c in contributions:
        cat = c.category
        if cat not in cat_map:
            cat_map[cat] = {"points": 0, "count": 0, "color": "#94a3b8"}
        cat_map[cat]["points"] += c.points
        cat_map[cat]["count"] += 1

    result = []
    for cat, val in cat_map.items():
        if val["points"] > 0:
            result.append({
                "category": cat,
                "points": val["points"],
                "percentage": round((val["points"] / total_points) * 100, 1),
                "count": val["count"],
                "color": val["color"]
            })

    result.sort(key=lambda x: x["points"], reverse=True)
    return result
