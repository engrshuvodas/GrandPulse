import csv
import io
from datetime import datetime
from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Member, Task, Contribution
from app.services.excel_service import generate_grandpulse_excel

router = APIRouter(prefix="/api/export", tags=["Export & Reports"])

@router.get("/excel")
def export_excel(db: Session = Depends(get_db)):
    """
    Export full GrandPulse ledger and sprint velocity data to Excel (.xlsx)
    using openpyxl with multiple styled worksheets.
    """
    members = db.query(Member).all()
    contributions = db.query(Contribution).all()
    tasks = db.query(Task).all()

    # Precalculate member summary
    total_score = sum(c.points for c in contributions) or 1
    members_data = []
    for m in members:
        m_logs = [c for c in contributions if c.member_id == m.id]
        score = sum(c.points for c in m_logs)
        hours = sum(c.hours for c in m_logs)
        completed = len([t for t in tasks if t.assignee_id == m.id and t.status == "Completed"])
        inprogress = len([t for t in tasks if t.assignee_id == m.id and t.status == "In Progress"])
        members_data.append({
            "id": m.id,
            "name": m.name,
            "role": m.role,
            "score": score,
            "hours": hours,
            "tasksCompleted": completed,
            "tasksInProgress": inprogress,
            "logsCount": len(m_logs),
            "percentage": round((score / total_score) * 100, 1)
        })

    members_data.sort(key=lambda x: x["score"], reverse=True)
    for idx, m in enumerate(members_data):
        m["rank"] = idx + 1

    contributions_data = [
        {
            "id": c.id,
            "member_id": c.member_id,
            "title": c.title,
            "category": c.category,
            "level": c.level,
            "hours": c.hours,
            "points": c.points,
            "task_id": c.task_id,
            "verified": c.verified,
            "date": c.date
        }
        for c in contributions
    ]

    tasks_data = [
        {
            "id": t.id,
            "title": t.title,
            "assignee_id": t.assignee_id,
            "status": t.status,
            "priority": t.priority,
            "points": t.points,
            "estimated_hours": t.estimated_hours
        }
        for t in tasks
    ]

    completed_tasks = len([t for t in tasks if t.status == "Completed"])
    summary_data = {
        "active_members": len(members),
        "total_tasks": len(tasks),
        "completed_tasks": completed_tasks,
        "completed_ratio": round((completed_tasks / len(tasks) * 100), 1) if tasks else 0.0,
        "inprogress_tasks": len([t for t in tasks if t.status == "In Progress"]),
        "total_points": total_score,
        "total_hours": round(sum(c.hours for c in contributions), 1),
        "sprint_velocity": f"{round((completed_tasks / len(tasks) * 100), 1)}%" if tasks else "0%"
    }

    excel_stream = generate_grandpulse_excel(
        members_data=members_data,
        contributions_data=contributions_data,
        tasks_data=tasks_data,
        summary_data=summary_data
    )

    filename = f"GrandPulse_Ledger_Report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/csv")
def export_csv(db: Session = Depends(get_db)):
    """Export contribution ledger to standard CSV."""
    contributions = db.query(Contribution).order_by(Contribution.created_at.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Member ID", "Title", "Category", "Impact Level", "Hours", "Points", "Task ID", "Verified", "Date"])

    for c in contributions:
        writer.writerow([c.id, c.member_id, c.title, c.category, c.level, c.hours, c.points, c.task_id or "", c.verified, c.date])

    output.seek(0)
    filename = f"GrandPulse_Ledger_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
