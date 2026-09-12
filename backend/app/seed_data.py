from sqlalchemy.orm import Session
from app.models import User, Member, GanttTask, Milestone, ProjectModule, Contribution
from app.auth import hash_password

HOSTEL_MEMBERS = [
    {
        "id": "shuvo",
        "name": "Shuvo Das",
        "role": "Lead Architect & Full-Stack Engineer",
        "email": "shuvo.das@grandpulse.dev",
        "avatar_bg": "bg-primary",
        "avatar_text_color": "text-on-primary",
        "avatar_initial": "SD",
        "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCyIkzpzbhTYMNn_kKdfN1LsEPYodRx3Hp8HVMUPbyssOHWwIshvll443HDsmGy3Zl3sP4Pkvbn_Rjo4bbsvGyZqA3nw5UDW6kmNwbGHKr8C8N74BFefsRh07KW6fyiiOU6EJK5fTDDfKVH0GRua8OjK3VQqEtjQcVabQJ0l_DKpPT6Hc83k4RtbS_HSG-q_WSw8NEv7bUsYjeWvXe8KaEdyYazydgj1Pt5DprwDmjJgFgDrUWfYOqibg",
        "join_date": "Week 1",
        "tech_stack": "React · FastAPI · MySQL · openpyxl",
        "active_lead": True,
        "accent_color": "#c0c1ff",
        "progress_fill_class": "bg-primary"
    },
    {
        "id": "monami",
        "name": "Monami Sadhu",
        "role": "Backend & Database Architect",
        "email": "monami.sadhu@grandpulse.dev",
        "avatar_bg": "bg-secondary",
        "avatar_text_color": "text-on-secondary",
        "avatar_initial": "MS",
        "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBjWBUD5BcbXvKIG20Lj5jqa1IB957wAW3H1oySYet_0QvIKK5Op5IksGXRSXhOWHklKPggFClLVyvZSBVKXs5YOi0qK1NwglWIeYVLW_gLxZoxWkVKxTYGytAr-MFIwj42eW03cQstdThpMVKy3P3htN698QEsTtK577tBYaaYDEgAyRUn8tc4XgWmEsxjJNyM4jVYYk2Ze97yTor6dgXmKBsL_4wOdi52gZO4RMaWfL55DIbM8JWVLA",
        "join_date": "Week 1",
        "tech_stack": "MySQL · FastAPI · Security & Auth",
        "active_lead": False,
        "accent_color": "#4cd7f6",
        "progress_fill_class": "bg-secondary"
    },
    {
        "id": "setu",
        "name": "Setu Mondol",
        "role": "UI/UX & Systems Lead",
        "email": "setu.mondol@grandpulse.dev",
        "avatar_bg": "bg-tertiary",
        "avatar_text_color": "text-on-tertiary",
        "avatar_initial": "SM",
        "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuC4B6188o9vphpgZM01CvLERW4GV_x_SIJWmT19Abj5WSX3lX1SVuVICaTtEWc9xm9-RRfrkjUsUILk4DhCMDj2cY-9z1rXXWm5RdZgPGHlY24PtVTzSf2_tpZhhtW72jzrraOKgfTe6AqTQ_f5kkOZnHVDwJvhA-Ig6rpaf7khY3fehfBRGIVv01R1j-XMkyWjfN65f1afTIk8iUfSC-By1fiTMF6rI8AzKdtqwltT-pNmWKDTjtpmnQ",
        "join_date": "Week 1",
        "tech_stack": "Tailwind CSS · Recharts · Figma",
        "active_lead": False,
        "accent_color": "#4edea3",
        "progress_fill_class": "bg-tertiary"
    }
]

HOSTEL_USERS = [
    {"username": "shuvo", "email": "shuvo@grandpulse.dev", "password": "password123", "role": "Lead Architect", "member_id": "shuvo"},
    {"username": "monami", "email": "monami@grandpulse.dev", "password": "password123", "role": "Backend Lead", "member_id": "monami"},
    {"username": "setu", "email": "setu@grandpulse.dev", "password": "password123", "role": "UI/UX Lead", "member_id": "setu"}
]

# EXACT 17 TASKS FROM PDF PAGES 2 & 3
HOSTEL_TASKS = [
    {"id": "GT-01", "title": "Project Planning", "phase": "Planning", "start_week": 1, "end_week": 2, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "Urgent", "points": 5, "assignee_id": "shuvo", "color": "#6366f1"},
    {"id": "GT-02", "title": "Requirement Analysis", "phase": "Analysis", "start_week": 2, "end_week": 3, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "monami", "color": "#8b5cf6"},
    {"id": "GT-03", "title": "Feasibility Study", "phase": "Analysis", "start_week": 2, "end_week": 3, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "Medium", "points": 3, "assignee_id": "setu", "color": "#a855f7"},
    {"id": "GT-04", "title": "System Design (SRS, UML)", "phase": "Design", "start_week": 4, "end_week": 6, "duration_weeks": 3, "progress_pct": 100, "status": "Completed", "priority": "Urgent", "points": 5, "assignee_id": "monami", "color": "#ec4899"},
    {"id": "GT-05", "title": "Database Design", "phase": "Design", "start_week": 5, "end_week": 6, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "shuvo", "color": "#f43f5e"},
    {"id": "GT-06", "title": "UI Design", "phase": "Design", "start_week": 4, "end_week": 6, "duration_weeks": 3, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "setu", "color": "#06b6d4"},
    {"id": "GT-07", "title": "Module Development", "phase": "Development", "start_week": 5, "end_week": 9, "duration_weeks": 5, "progress_pct": 100, "status": "Completed", "priority": "Urgent", "points": 8, "assignee_id": "shuvo", "color": "#3b82f6"},
    {"id": "GT-08", "title": "Login Module", "phase": "Development", "start_week": 5, "end_week": 6, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 3, "assignee_id": "monami", "module_id": 1, "color": "#10b981"},
    {"id": "GT-09", "title": "Student Module", "phase": "Development", "start_week": 6, "end_week": 7, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "setu", "module_id": 2, "color": "#14b8a6"},
    {"id": "GT-10", "title": "Room Allocation Module", "phase": "Development", "start_week": 7, "end_week": 8, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "shuvo", "module_id": 4, "color": "#f59e0b"},
    {"id": "GT-11", "title": "Fee Management Module", "phase": "Development", "start_week": 7, "end_week": 9, "duration_weeks": 3, "progress_pct": 100, "status": "Completed", "priority": "Urgent", "points": 5, "assignee_id": "monami", "module_id": 5, "color": "#eab308"},
    {"id": "GT-12", "title": "Report Generation", "phase": "Development", "start_week": 9, "end_week": 10, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "Medium", "points": 3, "assignee_id": "setu", "module_id": 9, "color": "#84cc16"},
    {"id": "GT-13", "title": "Testing", "phase": "QA & Testing", "start_week": 10, "end_week": 12, "duration_weeks": 3, "progress_pct": 90, "status": "In Progress", "priority": "Urgent", "points": 5, "assignee_id": "shuvo", "color": "#4edea3"},
    {"id": "GT-14", "title": "Bug Fixing", "phase": "QA & Testing", "start_week": 11, "end_week": 13, "duration_weeks": 3, "progress_pct": 75, "status": "In Progress", "priority": "High", "points": 5, "assignee_id": "monami", "color": "#22c55e"},
    {"id": "GT-15", "title": "Documentation", "phase": "Documentation", "start_week": 12, "end_week": 14, "duration_weeks": 3, "progress_pct": 50, "status": "In Progress", "priority": "Medium", "points": 3, "assignee_id": "setu", "color": "#4cd7f6"},
    {"id": "GT-16", "title": "Deployment", "phase": "Deployment", "start_week": 14, "end_week": 15, "duration_weeks": 2, "progress_pct": 0, "status": "Pending", "priority": "Urgent", "points": 5, "assignee_id": "monami", "color": "#8083ff"},
    {"id": "GT-17", "title": "Maintenance", "phase": "Maintenance", "start_week": 15, "end_week": 16, "duration_weeks": 2, "progress_pct": 0, "status": "Pending", "priority": "Medium", "points": 3, "assignee_id": "shuvo", "color": "#c0c1ff"}
]

# EXACT 7 MILESTONES FROM PDF PAGE 3
HOSTEL_MILESTONES = [
    {"id": 1, "week": 2, "title": "Project Planning Completed", "status": "Completed", "completed": True},
    {"id": 2, "week": 5, "title": "Requirements & System Design Approved", "status": "Completed", "completed": True},
    {"id": 3, "week": 9, "title": "Module Development Completed", "status": "Completed", "completed": True},
    {"id": 4, "week": 12, "title": "Testing Completed", "status": "In Progress", "completed": False},
    {"id": 5, "week": 14, "title": "Documentation Completed", "status": "Upcoming", "completed": False},
    {"id": 6, "week": 15, "title": "System Deployment", "status": "Upcoming", "completed": False},
    {"id": 7, "week": 16, "title": "Project Completion & Maintenance", "status": "Upcoming", "completed": False}
]

# EXACT 10 MAJOR MODULES FROM PDF PAGE 3
HOSTEL_MODULES = [
    {"id": 1, "name": "User Login & Authentication", "description": "JWT-secured role authentication (Student, Warden, Admin)", "status": "Completed", "completion_pct": 100, "lead_id": "monami"},
    {"id": 2, "name": "Student Registration", "description": "Profile intake, KYC documents, hostel admission form", "status": "Completed", "completion_pct": 100, "lead_id": "setu"},
    {"id": 3, "name": "Hostel & Room Management", "description": "Block, floor, room inventory, capacity & amenity catalog", "status": "Completed", "completion_pct": 100, "lead_id": "shuvo"},
    {"id": 4, "name": "Room Allocation", "description": "Algorithmic room assignment, vacancy matching, bed allocation", "status": "Completed", "completion_pct": 100, "lead_id": "shuvo"},
    {"id": 5, "name": "Fee Collection", "description": "Mess fee, room rent ledger, receipt generator, dues tracker", "status": "Completed", "completion_pct": 100, "lead_id": "monami"},
    {"id": 6, "name": "Visitor Management", "description": "Guest logs, entry-exit gate pass, warden verification", "status": "In Progress", "completion_pct": 90, "lead_id": "setu"},
    {"id": 7, "name": "Complaint Management", "description": "Maintenance tickets, plumbing/electric repair status tracker", "status": "In Progress", "completion_pct": 85, "lead_id": "monami"},
    {"id": 8, "name": "Attendance Management", "description": "Daily biometric / gate attendance, night roll call record", "status": "In Progress", "completion_pct": 80, "lead_id": "shuvo"},
    {"id": 9, "name": "Report Generation", "description": "Occupancy rate, financial reconciliation, student dossier export", "status": "Completed", "completion_pct": 100, "lead_id": "setu"},
    {"id": 10, "name": "Admin Dashboard", "description": "Executive Gantt velocity overview, warden controls, audit stream", "status": "In Progress", "completion_pct": 95, "lead_id": "shuvo"}
]

HOSTEL_CONTRIBUTIONS = [
    {"id": "C-01", "member_id": "shuvo", "title": "Finalized 16-Week Project Schedule & Gantt Architecture", "category": "Planning", "level": "Major", "hours": 8.0, "points": 5, "time_label": "Week 2", "date": "2026-02-10", "verified": True},
    {"id": "C-02", "member_id": "monami", "title": "Authored SRS & UML Class Diagrams for Hostel System", "category": "Design", "level": "Major", "hours": 9.5, "points": 5, "time_label": "Week 5", "date": "2026-03-02", "verified": True},
    {"id": "C-03", "member_id": "setu", "title": "Constructed Dark High-Density UI Components & Wireframes", "category": "Design", "level": "Large", "hours": 6.5, "points": 3, "time_label": "Week 5", "date": "2026-03-05", "verified": True},
    {"id": "C-04", "member_id": "shuvo", "title": "Engineered Relational MySQL Schema for Rooms & Allocations", "category": "Development", "level": "Major", "hours": 8.5, "points": 5, "time_label": "Week 6", "date": "2026-03-12", "verified": True},
    {"id": "C-05", "member_id": "monami", "title": "Implemented User Login & JWT Session Validation", "category": "Development", "level": "Large", "hours": 5.0, "points": 3, "time_label": "Week 6", "date": "2026-03-15", "verified": True},
    {"id": "C-06", "member_id": "setu", "title": "Designed Student Registration & Intake Interface", "category": "Development", "level": "Large", "hours": 6.0, "points": 3, "time_label": "Week 7", "date": "2026-03-20", "verified": True},
    {"id": "C-07", "member_id": "shuvo", "title": "Built Automated Room Allocation Matching Engine", "category": "Development", "level": "Major", "hours": 9.0, "points": 5, "time_label": "Week 8", "date": "2026-03-28", "verified": True},
    {"id": "C-08", "member_id": "monami", "title": "Developed Fee Collection & Dues Calculation Module", "category": "Development", "level": "Major", "hours": 8.0, "points": 5, "time_label": "Week 9", "date": "2026-04-05", "verified": True},
    {"id": "C-09", "member_id": "setu", "title": "Implemented Report Generation & openpyxl Excel Export", "category": "Development", "level": "Large", "hours": 6.0, "points": 3, "time_label": "Week 10", "date": "2026-04-12", "verified": True},
    {"id": "C-10", "member_id": "shuvo", "title": "Authored Integration Test Cases for 10 Hostel Modules", "category": "Testing", "level": "Large", "hours": 7.0, "points": 3, "time_label": "Week 11", "date": "2026-04-18", "verified": True},
    {"id": "C-11", "member_id": "monami", "title": "Patched Concurrency Race in Room Booking Transactions", "category": "Bug Fix", "level": "Large", "hours": 5.5, "points": 3, "time_label": "Week 12", "date": "2026-04-25", "verified": True},
    {"id": "C-12", "member_id": "setu", "title": "Finalized System Documentation & User Manual", "category": "Documentation", "level": "Medium", "hours": 4.5, "points": 2, "time_label": "Week 12", "date": "2026-04-28", "verified": True}
]

def seed_database(db: Session):
    # Members
    if db.query(Member).count() == 0:
        for m in HOSTEL_MEMBERS:
            db.add(Member(**m))
        db.commit()

    # Users
    if db.query(User).count() == 0:
        for u in HOSTEL_USERS:
            user = User(
                username=u["username"],
                email=u["email"],
                hashed_password=hash_password(u["password"]),
                role=u["role"],
                member_id=u["member_id"]
            )
            db.add(user)
        db.commit()

    # Project Modules (10 Modules from PDF Page 3)
    if db.query(ProjectModule).count() == 0:
        for mod in HOSTEL_MODULES:
            db.add(ProjectModule(**mod))
        db.commit()

    # Milestones (7 Milestones from PDF Page 3)
    if db.query(Milestone).count() == 0:
        for ms in HOSTEL_MILESTONES:
            db.add(Milestone(**ms))
        db.commit()

    # Gantt Tasks (17 Tasks from PDF Pages 2 & 3)
    if db.query(GanttTask).count() == 0:
        for t in HOSTEL_TASKS:
            db.add(GanttTask(**t))
        db.commit()

    # Contributions
    if db.query(Contribution).count() == 0:
        for c in HOSTEL_CONTRIBUTIONS:
            db.add(Contribution(**c))
        db.commit()
