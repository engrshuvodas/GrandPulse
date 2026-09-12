from sqlalchemy.orm import Session
from app.models import User, Member, GanttTask, Milestone, ProjectModule, Contribution
from app.auth import hash_password

RAKTSEVA_MEMBERS = [
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
        "tech_stack": "FastAPI · React · MySQL · JWT · Docker · System Architecture",
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
        "tech_stack": "MySQL (7 Normalized Tables) · bcrypt Auth · SQLAlchemy ORM · REST Security",
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
        "tech_stack": "React · Tailwind CSS · Blood Search Engine · WCAG 2.1 UX · QA Automation",
        "active_lead": False,
        "accent_color": "#4edea3",
        "progress_fill_class": "bg-tertiary"
    }
]

RAKTSEVA_USERS = [
    {"username": "shuvo", "email": "shuvo.das@grandpulse.dev", "password": "password123", "role": "Lead Architect", "member_id": "shuvo"},
    {"username": "monami", "email": "monami.sadhu@grandpulse.dev", "password": "password123", "role": "Backend Lead", "member_id": "monami"},
    {"username": "setu", "email": "setu.mondol@grandpulse.dev", "password": "password123", "role": "UI/UX Lead", "member_id": "setu"}
]

# EXACT 17 TASKS FOR RAKTSEVA 16-WEEK SPM LIFECYCLE
RAKTSEVA_TASKS = [
    {"id": "GT-01", "title": "Project Planning, Stakeholder Scope & SRS v1.0", "phase": "Planning", "start_week": 1, "end_week": 2, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "Urgent", "points": 5, "assignee_id": "shuvo", "color": "#6366f1"},
    {"id": "GT-02", "title": "Requirement Analysis & Hospital Elicitation", "phase": "Planning", "start_week": 2, "end_week": 3, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "monami", "color": "#8b5cf6"},
    {"id": "GT-03", "title": "Feasibility Study & Technology Stack Benchmarking", "phase": "Planning", "start_week": 2, "end_week": 3, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "Medium", "points": 3, "assignee_id": "setu", "color": "#a855f7"},
    {"id": "GT-04", "title": "System Architecture, UML & DFD (Level 0, 1, 2)", "phase": "Design", "start_week": 4, "end_week": 6, "duration_weeks": 3, "progress_pct": 100, "status": "Completed", "priority": "Urgent", "points": 5, "assignee_id": "monami", "color": "#ec4899"},
    {"id": "GT-05", "title": "Database Architecture (7 Relational Tables & ERD)", "phase": "Design", "start_week": 5, "end_week": 6, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "shuvo", "module_id": 9, "color": "#f43f5e"},
    {"id": "GT-06", "title": "UI/UX Prototyping (Public Portal & Admin Panel)", "phase": "Design", "start_week": 4, "end_week": 6, "duration_weeks": 3, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "setu", "module_id": 7, "color": "#06b6d4"},
    {"id": "GT-07", "title": "Core FastAPI Backend Architecture & API Gateway", "phase": "Development", "start_week": 5, "end_week": 9, "duration_weeks": 5, "progress_pct": 100, "status": "Completed", "priority": "Urgent", "points": 8, "assignee_id": "shuvo", "color": "#3b82f6"},
    {"id": "GT-08", "title": "User Authentication & bcrypt Security Module", "phase": "Development", "start_week": 5, "end_week": 6, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "monami", "module_id": 1, "color": "#10b981"},
    {"id": "GT-09", "title": "Donor Registration & Validation Engine", "phase": "Development", "start_week": 6, "end_week": 7, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "shuvo", "module_id": 2, "color": "#14b8a6"},
    {"id": "GT-10", "title": "Blood Group Search & Compatibility Algorithm", "phase": "Development", "start_week": 7, "end_week": 8, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "High", "points": 5, "assignee_id": "setu", "module_id": 3, "color": "#f59e0b"},
    {"id": "GT-11", "title": "Executive Admin Panel & Stock Management", "phase": "Development", "start_week": 7, "end_week": 9, "duration_weeks": 3, "progress_pct": 100, "status": "Completed", "priority": "Urgent", "points": 5, "assignee_id": "shuvo", "module_id": 6, "color": "#eab308"},
    {"id": "GT-12", "title": "Emergency Query & Notification System", "phase": "Development", "start_week": 9, "end_week": 10, "duration_weeks": 2, "progress_pct": 100, "status": "Completed", "priority": "Medium", "points": 5, "assignee_id": "monami", "module_id": 5, "color": "#84cc16"},
    {"id": "GT-13", "title": "Integration Testing & SQLi Security Audit", "phase": "Testing", "start_week": 10, "end_week": 12, "duration_weeks": 3, "progress_pct": 100, "status": "Completed", "priority": "Urgent", "points": 5, "assignee_id": "shuvo", "module_id": 10, "color": "#4edea3"},
    {"id": "GT-14", "title": "Bug Fixing & Prepared Statements Hardening", "phase": "Testing", "start_week": 11, "end_week": 13, "duration_weeks": 3, "progress_pct": 90, "status": "In Progress", "priority": "High", "points": 5, "assignee_id": "monami", "module_id": 10, "color": "#22c55e"},
    {"id": "GT-15", "title": "SPM Thesis Documentation & User Manual", "phase": "Deployment", "start_week": 12, "end_week": 14, "duration_weeks": 3, "progress_pct": 85, "status": "In Progress", "priority": "Medium", "points": 5, "assignee_id": "setu", "color": "#4cd7f6"},
    {"id": "GT-16", "title": "Hospital Staging Deployment & Acceptance Testing", "phase": "Deployment", "start_week": 14, "end_week": 15, "duration_weeks": 2, "progress_pct": 60, "status": "In Progress", "priority": "Urgent", "points": 5, "assignee_id": "monami", "module_id": 8, "color": "#8083ff"},
    {"id": "GT-17", "title": "Academic Project Defense & Production Handover", "phase": "Deployment", "start_week": 15, "end_week": 16, "duration_weeks": 2, "progress_pct": 30, "status": "In Progress", "priority": "Medium", "points": 5, "assignee_id": "shuvo", "color": "#c0c1ff"}
]

# EXACT 7 MILESTONES FOR RAKTSEVA (16 WEEKS)
RAKTSEVA_MILESTONES = [
    {"id": 1, "week": 2, "title": "RaktSeva Scope Finalized & SRS Document Approved by Guide", "status": "Completed", "completed": True},
    {"id": 2, "week": 5, "title": "System Architecture, UML Diagrams & 7-Table ER Approved", "status": "Completed", "completed": True},
    {"id": 3, "week": 9, "title": "Core Donor Registration & Blood Search Modules Completed", "status": "Completed", "completed": True},
    {"id": 4, "week": 12, "title": "System Testing, OWASP Security Audit & Bug Fixing Cleared", "status": "Completed", "completed": True},
    {"id": 5, "week": 14, "title": "Comprehensive SPM Documentation & User Manual Completed", "status": "In Progress", "completed": False},
    {"id": 6, "week": 15, "title": "Parul Sevashram Hospital Staging Server Setup & UAT Sign-off", "status": "In Progress", "completed": False},
    {"id": 7, "week": 16, "title": "Final University Academic Project Defense & Faculty Evaluation", "status": "Upcoming", "completed": False}
]

# EXACT 10 MAJOR MODULES OF RAKTSEVA BLOOD BANK SYSTEM (FROM SRS)
RAKTSEVA_MODULES = [
    {"id": 1, "name": "User Authentication & Role-Based Access", "description": "Session authentication, bcrypt 12-round password hashing, JWT bearer tokens, role permissions in users table", "status": "Completed", "completion_pct": 100, "lead_id": "monami"},
    {"id": 2, "name": "Donor Registration & Intake Verification Engine", "description": "Public and admin-added donor intake into donor_details table with medical validation (age 18-65, weight >= 50kg, 90-day cooldown)", "status": "Completed", "completion_pct": 100, "lead_id": "shuvo"},
    {"id": 3, "name": "Real-Time Blood Search & Matching Engine", "description": "Rapid search across 8 blood groups (A+, B+, AB+, O+, and negative variants) with compatibility matching and max 6 random verified donors", "status": "Completed", "completion_pct": 100, "lead_id": "setu"},
    {"id": 4, "name": "User Dashboard & Donation History Tracker", "description": "Donor portal, previous donation timeline, next donation eligibility date calculator, and digital donation certificate download", "status": "Completed", "completion_pct": 100, "lead_id": "setu"},
    {"id": 5, "name": "Hospital Emergency Blood Request & Query System", "description": "Emergency public query tickets handling with Pending/Read/Fulfilled workflow, automated email routing to on-call hospital staff", "status": "Completed", "completion_pct": 100, "lead_id": "monami"},
    {"id": 6, "name": "Executive Admin Management & Audit Portal", "description": "Executive Donor CRUD, blood stock inventory oversight, query resolution, hospital contact update in admin_info table", "status": "Completed", "completion_pct": 100, "lead_id": "shuvo"},
    {"id": 7, "name": "Content Management System (CMS) & Public Portal", "description": "Rich text editing for public pages: Home, Why Donate, Need Blood, About Us, and Blood Drive Camp scheduler in pages table", "status": "Completed", "completion_pct": 95, "lead_id": "setu"},
    {"id": 8, "name": "Hospital Master Configuration & Multi-Branch Directory", "description": "Parul Sevashram Hospital master contact info, emergency 24/7 hotline routing, blood bank room numbers, and department directory", "status": "Completed", "completion_pct": 95, "lead_id": "shuvo"},
    {"id": 9, "name": "7-Table Relational Schema & MySQL Optimization", "description": "3NF normalized schema: donor_details, users, admin_info, blood, pages, contact_info, contact_query with B-Tree indexes", "status": "Completed", "completion_pct": 100, "lead_id": "monami"},
    {"id": 10, "name": "Security Hardening, Penetration Testing & SPM Defense", "description": "Prepared statements against SQL injection, XSS input sanitization, rate-limiting, and university defense documentation", "status": "Completed", "completion_pct": 95, "lead_id": "shuvo"}
]

# 36 DETAILED, REALISTIC SOFTWARE ENGINEERING CONTRIBUTIONS SPREAD ACROSS 16 WEEKS
RAKTSEVA_CONTRIBUTIONS = [
    # Week 1 - 2: Planning & Requirements
    {"id": "C-01", "member_id": "shuvo", "title": "Authored RaktSeva SRS v1.0 & Formulated 16-Week Project Timeline", "category": "Planning", "level": "Major", "hours": 8.0, "points": 5, "time_label": "Week 1", "date": "2026-02-04", "verified": True},
    {"id": "C-02", "member_id": "monami", "title": "Conducted Hospital Requirement Elicitation with Parul Sevashram Blood Bank Staff", "category": "Planning", "level": "Major", "hours": 7.5, "points": 5, "time_label": "Week 2", "date": "2026-02-12", "verified": True},
    {"id": "C-03", "member_id": "setu", "title": "Researched Open-Source Blood Bank Systems & Benchmarked React vs Vue", "category": "Planning", "level": "Large", "hours": 6.0, "points": 4, "time_label": "Week 2", "date": "2026-02-14", "verified": True},

    # Week 4 - 6: Architecture & Design
    {"id": "C-04", "member_id": "monami", "title": "Created Complete DFD Level 0, Level 1 and UML Class Diagrams for Core Modules", "category": "Design", "level": "Major", "hours": 8.0, "points": 5, "time_label": "Week 4", "date": "2026-02-26", "verified": True},
    {"id": "C-05", "member_id": "setu", "title": "Designed High-Fidelity Figma Wireframes for Public Portal & Responsive Donor Forms", "category": "Design", "level": "Major", "hours": 8.0, "points": 5, "time_label": "Week 4", "date": "2026-02-28", "verified": True},
    {"id": "C-06", "member_id": "shuvo", "title": "Engineered MySQL 7-Table Relational Schema with Foreign Keys & B-Tree Indexes", "category": "Design", "level": "Major", "hours": 8.5, "points": 5, "time_label": "Week 5", "date": "2026-03-03", "verified": True},
    {"id": "C-07", "member_id": "shuvo", "title": "Configured FastAPI Backend Gateway, CORS Middleware & Lifespan Event Handlers", "category": "Development", "level": "Major", "hours": 9.0, "points": 5, "time_label": "Week 5", "date": "2026-03-07", "verified": True},
    {"id": "C-08", "member_id": "setu", "title": "Built Modern Responsive Layout with Tailwind CSS & Kinetic Precision Dark Theme", "category": "Development", "level": "Major", "hours": 7.5, "points": 5, "time_label": "Week 5", "date": "2026-03-09", "verified": True},

    # Week 6 - 8: Core Development
    {"id": "C-09", "member_id": "monami", "title": "Implemented User Authentication with bcrypt 12-Round Salt Password Hashing", "category": "Development", "level": "Major", "hours": 7.5, "points": 5, "time_label": "Week 6", "date": "2026-03-12", "verified": True},
    {"id": "C-10", "member_id": "shuvo", "title": "Implemented Donor Intake REST Engine with Age, Weight & 90-Day Cooldown Checks", "category": "Development", "level": "Major", "hours": 8.0, "points": 5, "time_label": "Week 6", "date": "2026-03-14", "verified": True},
    {"id": "C-11", "member_id": "monami", "title": "Built JWT Bearer Token Generator & Role-Based Authorization Guard for Endpoints", "category": "Development", "level": "Major", "hours": 6.5, "points": 4, "time_label": "Week 6", "date": "2026-03-16", "verified": True},
    {"id": "C-12", "member_id": "setu", "title": "Developed Real-Time Blood Search Filter Algorithm with ABO/Rh Compatibility Matrix", "category": "Development", "level": "Major", "hours": 8.5, "points": 5, "time_label": "Week 7", "date": "2026-03-21", "verified": True},
    {"id": "C-13", "member_id": "shuvo", "title": "Engineered Admin Executive Portal with Full Donor CRUD & Status Verification", "category": "Development", "level": "Major", "hours": 9.5, "points": 5, "time_label": "Week 8", "date": "2026-03-27", "verified": True},
    {"id": "C-14", "member_id": "setu", "title": "Built User Dashboard with Donation History & Next Eligible Date Countdown", "category": "Development", "level": "Major", "hours": 7.5, "points": 5, "time_label": "Week 8", "date": "2026-03-30", "verified": True},

    # Week 9 - 10: Advanced Features & Hospital Integrations
    {"id": "C-15", "member_id": "shuvo", "title": "Constructed Blood Stock Inventory Manager with Auto-Replenishment Threshold Alerts", "category": "Development", "level": "Major", "hours": 7.5, "points": 5, "time_label": "Week 9", "date": "2026-04-03", "verified": True},
    {"id": "C-16", "member_id": "monami", "title": "Engineered Contact Query System with Pending/Read Workflow & Email Routing", "category": "Development", "level": "Major", "hours": 8.0, "points": 5, "time_label": "Week 9", "date": "2026-04-06", "verified": True},
    {"id": "C-17", "member_id": "monami", "title": "Implemented Hospital Master Info Configuration API with Input Sanitization", "category": "Development", "level": "Large", "hours": 6.0, "points": 4, "time_label": "Week 10", "date": "2026-04-11", "verified": True},
    {"id": "C-18", "member_id": "setu", "title": "Developed Content Management System (CMS) Editor for Public Educational Pages", "category": "Development", "level": "Major", "hours": 7.0, "points": 5, "time_label": "Week 10", "date": "2026-04-14", "verified": True},

    # Week 11 - 12: Security Auditing & Testing
    {"id": "C-19", "member_id": "shuvo", "title": "Executed OWASP SQL Injection Penetration Audit & Hardened Prepared Statements", "category": "Security", "level": "Major", "hours": 8.0, "points": 5, "time_label": "Week 11", "date": "2026-04-17", "verified": True},
    {"id": "C-20", "member_id": "monami", "title": "Authored Automated PyTest Suite Covering Auth, Donor Intake & Query Routers (94% Pass)", "category": "Testing", "level": "Major", "hours": 8.5, "points": 5, "time_label": "Week 11", "date": "2026-04-20", "verified": True},
    {"id": "C-21", "member_id": "setu", "title": "Conducted Cross-Browser & Mobile UI Responsiveness Testing Across 6 Screen Sizes", "category": "Testing", "level": "Large", "hours": 6.0, "points": 4, "time_label": "Week 11", "date": "2026-04-22", "verified": True},
    {"id": "C-22", "member_id": "shuvo", "title": "Integrated openpyxl Multi-Sheet Excel Engine for 16-Week Gantt Exports", "category": "Development", "level": "Major", "hours": 7.0, "points": 5, "time_label": "Week 12", "date": "2026-04-24", "verified": True},
    {"id": "C-23", "member_id": "monami", "title": "Patched Session Hijacking Vulnerability & Enforced Secure HTTP Headers (CSP & HSTS)", "category": "Security", "level": "Large", "hours": 5.5, "points": 4, "time_label": "Week 12", "date": "2026-04-26", "verified": True},
    {"id": "C-24", "member_id": "setu", "title": "Implemented WCAG 2.1 AA Accessibility Standards (Color Contrast & ARIA Labels)", "category": "Design", "level": "Large", "hours": 5.5, "points": 4, "time_label": "Week 12", "date": "2026-04-28", "verified": True},

    # Week 13 - 14: Documentation, Performance & Staging
    {"id": "C-25", "member_id": "shuvo", "title": "Conducted Concurrency Load Testing with 500 Virtual Users (p95 < 45ms)", "category": "Testing", "level": "Major", "hours": 6.5, "points": 4, "time_label": "Week 13", "date": "2026-05-02", "verified": True},
    {"id": "C-26", "member_id": "monami", "title": "Optimized MySQL Query Performance with Composite Indexes on Blood Group & City", "category": "Development", "level": "Large", "hours": 5.0, "points": 4, "time_label": "Week 13", "date": "2026-05-04", "verified": True},
    {"id": "C-27", "member_id": "setu", "title": "Compiled 92-Page Comprehensive Software Project Management (SPM) Thesis Report", "category": "Documentation", "level": "Major", "hours": 9.0, "points": 5, "time_label": "Week 13", "date": "2026-05-05", "verified": True},
    {"id": "C-28", "member_id": "shuvo", "title": "Configured Docker Containerization & Nginx Reverse Proxy for On-Premise Staging", "category": "DevOps", "level": "Major", "hours": 7.0, "points": 5, "time_label": "Week 14", "date": "2026-05-08", "verified": True},
    {"id": "C-29", "member_id": "monami", "title": "Conducted Staging Database Migration & Seed Verification on Hospital Server", "category": "DevOps", "level": "Large", "hours": 6.0, "points": 4, "time_label": "Week 14", "date": "2026-05-11", "verified": True},
    {"id": "C-30", "member_id": "setu", "title": "Created User Manual with Annotated Screenshots for Hospital Desk Officers", "category": "Documentation", "level": "Large", "hours": 6.5, "points": 4, "time_label": "Week 14", "date": "2026-05-12", "verified": True},

    # Week 15 - 16: Defense Prep, UAT & Sign-off
    {"id": "C-31", "member_id": "shuvo", "title": "Drafted University Defense Slide Deck & Technical Architecture Diagrams", "category": "Documentation", "level": "Large", "hours": 6.0, "points": 4, "time_label": "Week 15", "date": "2026-05-15", "verified": True},
    {"id": "C-32", "member_id": "monami", "title": "Drafted System Administration & Database Maintenance Manual for Hospital IT", "category": "Documentation", "level": "Large", "hours": 5.5, "points": 3, "time_label": "Week 15", "date": "2026-05-16", "verified": True},
    {"id": "C-33", "member_id": "setu", "title": "Polished Frontend Micro-Interactions, Toast Alerts & Modal Transitions", "category": "Development", "level": "Medium", "hours": 4.5, "points": 3, "time_label": "Week 15", "date": "2026-05-17", "verified": True},
    {"id": "C-34", "member_id": "shuvo", "title": "Setup Database Health Checks, Auto-Fallback to SQLite & Connection Pooling", "category": "Development", "level": "Large", "hours": 5.0, "points": 3, "time_label": "Week 15", "date": "2026-05-18", "verified": True},
    {"id": "C-35", "member_id": "monami", "title": "Coordinated Hospital UAT Pilot Testing & Recorded Clinical Staff Feedback", "category": "Testing", "level": "Large", "hours": 6.0, "points": 4, "time_label": "Week 15", "date": "2026-05-20", "verified": True},
    {"id": "C-36", "member_id": "setu", "title": "Prepared Printable Gantt Chart & University Submission PDF Export Interface", "category": "Development", "level": "Major", "hours": 7.0, "points": 5, "time_label": "Week 16", "date": "2026-05-22", "verified": True},
]

def seed_database(db: Session, force_refresh: bool = False):
    """
    Populates database with complete RaktSeva project data.
    If force_refresh is True or data is incomplete, safely refreshes all tables.
    """
    # Check if refresh is needed
    existing_contribs = db.query(Contribution).count()
    if force_refresh or existing_contribs < 20:
        # Delete existing data in reverse dependency order
        db.query(Contribution).delete()
        db.query(GanttTask).delete()
        db.query(ProjectModule).delete()
        db.query(Milestone).delete()
        db.query(User).delete()
        db.query(Member).delete()
        db.commit()

    # Members
    if db.query(Member).count() == 0:
        for m in RAKTSEVA_MEMBERS:
            db.add(Member(**m))
        db.commit()

    # Users
    if db.query(User).count() == 0:
        for u in RAKTSEVA_USERS:
            user = User(
                username=u["username"],
                email=u["email"],
                hashed_password=hash_password(u["password"]),
                role=u["role"],
                member_id=u["member_id"]
            )
            db.add(user)
        db.commit()

    # Project Modules (10 Modules from RaktSeva SRS)
    if db.query(ProjectModule).count() == 0:
        for mod in RAKTSEVA_MODULES:
            db.add(ProjectModule(**mod))
        db.commit()

    # Milestones (7 Milestones from RaktSeva SRS)
    if db.query(Milestone).count() == 0:
        for ms in RAKTSEVA_MILESTONES:
            db.add(Milestone(**ms))
        db.commit()

    # Gantt Tasks (17 Tasks for 16-Week Schedule)
    if db.query(GanttTask).count() == 0:
        for t in RAKTSEVA_TASKS:
            db.add(GanttTask(**t))
        db.commit()

    # Contributions (36 rich software engineering contributions)
    if db.query(Contribution).count() == 0:
        for c in RAKTSEVA_CONTRIBUTIONS:
            db.add(Contribution(**c))
        db.commit()
