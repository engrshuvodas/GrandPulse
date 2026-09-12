from typing import List, Dict
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Member, Task, Contribution, WeeklyVelocity
from app.schemas import SummaryMetrics

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Velocity"])

@router.get("/summary", response_model=SummaryMetrics)
def get_summary_metrics(db: Session = Depends(get_db)):
    active_members = db.query(Member).count()
    all_tasks = db.query(Task).all()
    all_contributions = db.query(Contribution).all()

    total_tasks = len(all_tasks)
    completed_tasks = len([t for t in all_tasks if t.status == "Completed"])
    inprogress_tasks = len([t for t in all_tasks if t.status == "In Progress"])
    pending_tasks = len([t for t in all_tasks if t.status == "Pending"])

    completed_ratio = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0
    total_logs = len(all_contributions)
    total_hours = round(sum(c.hours for c in all_contributions), 1)
    total_points = sum(c.points for c in all_contributions)

    return {
        "active_members": active_members,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "completed_ratio": completed_ratio,
        "inprogress_tasks": inprogress_tasks,
        "pending_tasks": pending_tasks,
        "total_logs": total_logs,
        "total_hours": total_hours,
        "total_points": total_points,
        "sprint_health": "+18.4%",
        "sprint_velocity": f"{completed_ratio}%"
    }

@router.get("/weekly-velocity")
def get_weekly_velocity(member_id: str = Query("shuvo"), db: Session = Depends(get_db)):
    velocities = (
        db.query(WeeklyVelocity)
        .filter(WeeklyVelocity.member_id == member_id)
        .order_by(WeeklyVelocity.week_order.asc())
        .all()
    )
    if not velocities:
        # Fallback default trajectory
        weeks = ["W05", "W06", "W07", "W08", "W09", "W10", "W11", "W12"]
        points = [22, 31, 38, 35, 46, 51, 54, 58]
        hours = [34.0, 42.0, 45.0, 40.0, 48.0, 54.0, 58.0, 64.5]
        return [
            {"week": w, "points": p, "hours": h, "target": 45}
            for w, p, h in zip(weeks, points, hours)
        ]

    return [
        {
            "week": v.week_label,
            "points": v.points,
            "hours": v.hours,
            "target": 45
        }
        for v in velocities
    ]

@router.get("/category-distribution")
def get_category_distribution(member_id: str = Query(None), db: Session = Depends(get_db)):
    query = db.query(Contribution)
    if member_id and member_id != "ALL":
        query = query.filter(Contribution.member_id == member_id)

    contributions = query.all()
    total_points = sum(c.points for c in contributions) or 1

    cat_map: Dict[str, Dict] = {
        "Development": {"points": 0, "count": 0, "color": "#c0c1ff"},
        "Bug Fix": {"points": 0, "count": 0, "color": "#4cd7f6"},
        "Architecture": {"points": 0, "count": 0, "color": "#8083ff"},
        "Design": {"points": 0, "count": 0, "color": "#4edea3"},
        "Testing": {"points": 0, "count": 0, "color": "#acedff"},
        "DevOps": {"points": 0, "count": 0, "color": "#ffb4ab"}
    }

    for c in contributions:
        cat = c.category
        if cat not in cat_map:
            cat_map[cat] = {"points": 0, "count": 0, "color": "#908fa0"}
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
