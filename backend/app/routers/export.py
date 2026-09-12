import csv
import io
from datetime import datetime
from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Member, Contribution, GanttTask, Milestone, ProjectModule
from app.services.excel_service import generate_grandpulse_excel

router = APIRouter(prefix="/api/export", tags=["Export & Reports"])

@router.get("/excel")
def export_excel(db: Session = Depends(get_db)):
    """
    Export full RaktSeva Blood Bank System 16-Week Gantt Schedule, Milestones, Major Modules,
    Member Leaderboard, and Contribution Ledger to a styled Excel (.xlsx) workbook using openpyxl.
    """
    members = db.query(Member).all()
    contributions = db.query(Contribution).all()
    gantt_tasks = db.query(GanttTask).order_by(GanttTask.start_week, GanttTask.id).all()
    milestones = db.query(Milestone).order_by(Milestone.week).all()
    modules = db.query(ProjectModule).order_by(ProjectModule.id).all()

    # Precalculate member summary
    total_score = sum(c.points for c in contributions) or 1
    members_data = []
    for m in members:
        m_logs = [c for c in contributions if c.member_id == m.id]
        score = sum(c.points for c in m_logs)
        hours = sum(c.hours for c in m_logs)
        completed = len([t for t in gantt_tasks if t.assignee_id == m.id and t.status == "Completed"])
        inprogress = len([t for t in gantt_tasks if t.assignee_id == m.id and t.status == "In Progress"])
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

    gantt_tasks_data = [
        {
            "id": t.id,
            "title": t.title,
            "phase": t.phase,
            "start_week": t.start_week,
            "end_week": t.end_week,
            "duration_weeks": t.duration_weeks,
            "progress_pct": t.progress_pct,
            "status": t.status,
            "priority": t.priority,
            "points": t.points,
            "assignee_id": t.assignee_id,
            "module_id": t.module_id
        }
        for t in gantt_tasks
    ]

    milestones_data = [
        {
            "id": ms.id,
            "week": ms.week,
            "title": ms.title,
            "status": ms.status,
            "completed": ms.completed
        }
        for ms in milestones
    ]

    modules_data = [
        {
            "id": mod.id,
            "name": mod.name,
            "description": mod.description,
            "status": mod.status,
            "completion_pct": mod.completion_pct,
            "lead_id": mod.lead_id
        }
        for mod in modules
    ]

    completed_tasks = len([t for t in gantt_tasks if t.status == "Completed"])
    summary_data = {
        "active_members": len(members),
        "total_tasks": len(gantt_tasks),
        "completed_tasks": completed_tasks,
        "completed_ratio": round((completed_tasks / len(gantt_tasks) * 100), 1) if gantt_tasks else 0.0,
        "inprogress_tasks": len([t for t in gantt_tasks if t.status == "In Progress"]),
        "total_points": total_score,
        "total_hours": round(sum(c.hours for c in contributions), 1),
        "sprint_velocity": f"{round((completed_tasks / len(gantt_tasks) * 100), 1)}%" if gantt_tasks else "0%"
    }

    excel_stream = generate_grandpulse_excel(
        members_data=members_data,
        contributions_data=contributions_data,
        gantt_tasks_data=gantt_tasks_data,
        milestones_data=milestones_data,
        modules_data=modules_data,
        summary_data=summary_data
    )

    filename = f"RaktSeva_BloodBank_SPM_GanttReport_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=\"{ filename }\""}
    )

@router.get("/csv")
def export_csv(db: Session = Depends(get_db)):
    """Export 16-Week Gantt Schedule to standard CSV."""
    tasks = db.query(GanttTask).order_by(GanttTask.start_week, GanttTask.id).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Task ID", "Task Name", "Phase", "Start Week", "End Week", "Duration (Weeks)", "Progress %", "Status", "Assignee", "Points"])

    for t in tasks:
        writer.writerow([t.id, t.title, t.phase, f"W{t.start_week}", f"W{t.end_week}", t.duration_weeks, f"{t.progress_pct}%", t.status, t.assignee_id or "Unassigned", t.points])

    output.seek(0)
    filename = f"GrandPulse_Gantt_Schedule_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
