from sqlalchemy.orm import Session
from app.models import User, Member, Task, Contribution, WeeklyVelocity
from app.auth import hash_password

INITIAL_MEMBERS = [
    {
        "id": "shuvo",
        "name": "Shuvo K.",
        "role": "Principal Full-Stack Engineer",
        "email": "shuvo@grandpulse.dev",
        "avatar_bg": "bg-primary",
        "avatar_text_color": "text-on-primary",
        "avatar_initial": "SK",
        "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCyIkzpzbhTYMNn_kKdfN1LsEPYodRx3Hp8HVMUPbyssOHWwIshvll443HDsmGy3Zl3sP4Pkvbn_Rjo4bbsvGyZqA3nw5UDW6kmNwbGHKr8C8N74BFefsRh07KW6fyiiOU6EJK5fTDDfKVH0GRua8OjK3VQqEtjQcVabQJ0l_DKpPT6Hc83k4RtbS_HSG-q_WSw8NEv7bUsYjeWvXe8KaEdyYazydgj1Pt5DprwDmjJgFgDrUWfYOqibg",
        "join_date": "Joined Jan 14, 2023 · 1y 3m",
        "tech_stack": "React · TypeScript · Python · FastAPI · MySQL",
        "active_lead": True,
        "accent_color": "#c0c1ff",
        "progress_fill_class": "bg-primary"
    },
    {
        "id": "monami",
        "name": "Monami Sen",
        "role": "Lead Architecture & Backend",
        "email": "monami@grandpulse.dev",
        "avatar_bg": "bg-secondary",
        "avatar_text_color": "text-on-secondary",
        "avatar_initial": "MS",
        "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBjWBUD5BcbXvKIG20Lj5jqa1IB957wAW3H1oySYet_0QvIKK5Op5IksGXRSXhOWHklKPggFClLVyvZSBVKXs5YOi0qK1NwglWIeYVLW_gLxZoxWkVKxTYGytAr-MFIwj42eW03cQstdThpMVKy3P3htN698QEsTtK577tBYaaYDEgAyRUn8tc4XgWmEsxjJNyM4jVYYk2Ze97yTor6dgXmKBsL_4wOdi52gZO4RMaWfL55DIbM8JWVLA",
        "join_date": "Joined Aug 20, 2023 · 9m",
        "tech_stack": "Distributed Systems · Kafka · MySQL · Redis",
        "active_lead": False,
        "accent_color": "#4cd7f6",
        "progress_fill_class": "bg-secondary"
    },
    {
        "id": "setu",
        "name": "Setu Rahman",
        "role": "Design System & UI Lead",
        "email": "setu@grandpulse.dev",
        "avatar_bg": "bg-tertiary",
        "avatar_text_color": "text-on-tertiary",
        "avatar_initial": "SR",
        "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuC4B6188o9vphpgZM01CvLERW4GV_x_SIJWmT19Abj5WSX3lX1SVuVICaTtEWc9xm9-RRfrkjUsUILk4DhCMDj2cY-9z1rXXWm5RdZgPGHlY24PtVTzSf2_tpZhhtW72jzrraOKgfTe6AqTQ_f5kkOZnHVDwJvhA-Ig6rpaf7khY3fehfBRGIVv01R1j-XMkyWjfN65f1afTIk8iUfSC-By1fiTMF6rI8AzKdtqwltT-pNmWKDTjtpmnQ",
        "join_date": "Joined Nov 02, 2023 · 6m",
        "tech_stack": "Tailwind CSS · Figma · Accessible Tokens · Micro-Interactions",
        "active_lead": False,
        "accent_color": "#4edea3",
        "progress_fill_class": "bg-tertiary"
    }
]

INITIAL_USERS = [
    {"username": "shuvo", "email": "shuvo@grandpulse.dev", "password": "password123", "role": "Lead Architect", "member_id": "shuvo"},
    {"username": "monami", "email": "monami@grandpulse.dev", "password": "password123", "role": "Backend Lead", "member_id": "monami"},
    {"username": "setu", "email": "setu@grandpulse.dev", "password": "password123", "role": "UI/UX Lead", "member_id": "setu"}
]

INITIAL_TASKS = [
    # Completed Tasks
    {"id": "T-101", "title": "Implement WebSocket delta stream bus", "assignee_id": "monami", "status": "Completed", "priority": "Urgent", "points": 5, "estimated_hours": 6.0, "time_label": "2h ago"},
    {"id": "T-102", "title": "Migrate Grand Chart to GPU canvas matrix", "assignee_id": "shuvo", "status": "Completed", "priority": "High", "points": 5, "estimated_hours": 7.0, "time_label": "4h ago"},
    {"id": "T-103", "title": "Dark token design specs & contrast verification", "assignee_id": "setu", "status": "Completed", "priority": "High", "points": 3, "estimated_hours": 4.0, "time_label": "1d ago"},
    {"id": "T-104", "title": "Query optimizer for multi-tenant analytics", "assignee_id": "monami", "status": "Completed", "priority": "Medium", "points": 3, "estimated_hours": 5.0, "time_label": "1d ago"},
    {"id": "T-105", "title": "Interactive task drag reorder kanban lane", "assignee_id": "shuvo", "status": "Completed", "priority": "Urgent", "points": 5, "estimated_hours": 8.0, "time_label": "2d ago"},
    {"id": "T-106", "title": "Mobile responsive Gantt track pinch-zoom", "assignee_id": "setu", "status": "Completed", "priority": "Medium", "points": 3, "estimated_hours": 4.0, "time_label": "2d ago"},
    {"id": "T-107", "title": "Integrate OAuth2 SSO with GitHub & Google", "assignee_id": "shuvo", "status": "Completed", "priority": "High", "points": 3, "estimated_hours": 5.0, "time_label": "3d ago"},
    {"id": "T-108", "title": "Audit latency in telemetry ingestion pipe", "assignee_id": "monami", "status": "Completed", "priority": "Urgent", "points": 5, "estimated_hours": 6.5, "time_label": "3d ago"},
    {"id": "T-109", "title": "Accessible color palette and WCAG tokens", "assignee_id": "setu", "status": "Completed", "priority": "Small", "points": 2, "estimated_hours": 3.0, "time_label": "3d ago"},
    {"id": "T-110", "title": "Redis cluster failover protocol script", "assignee_id": "monami", "status": "Completed", "priority": "High", "points": 3, "estimated_hours": 4.5, "time_label": "4d ago"},
    {"id": "T-111", "title": "CSV & Parquet export service worker", "assignee_id": "shuvo", "status": "Completed", "priority": "Medium", "points": 2, "estimated_hours": 3.0, "time_label": "4d ago"},
    {"id": "T-112", "title": "Bento box visual layout polish", "assignee_id": "setu", "status": "Completed", "priority": "Medium", "points": 2, "estimated_hours": 3.5, "time_label": "5d ago"},
    {"id": "T-113", "title": "Automated CI/CD rollback playbook", "assignee_id": "monami", "status": "Completed", "priority": "Medium", "points": 3, "estimated_hours": 4.0, "time_label": "5d ago"},
    {"id": "T-114", "title": "Task metadata filter and search indexing", "assignee_id": "shuvo", "status": "Completed", "priority": "Medium", "points": 2, "estimated_hours": 3.0, "time_label": "6d ago"},
    {"id": "T-115", "title": "Micro-interaction badges for Leaderboard", "assignee_id": "setu", "status": "Completed", "priority": "Small", "points": 1, "estimated_hours": 2.0, "time_label": "6d ago"},
    # In Progress Tasks
    {"id": "T-116", "title": "Distributed memory caching for dashboard metrics", "assignee_id": "monami", "status": "In Progress", "priority": "Urgent", "points": 5, "estimated_hours": 6.0, "time_label": "Active"},
    {"id": "T-117", "title": "Cross-functional dependency graph renderer", "assignee_id": "shuvo", "status": "In Progress", "priority": "High", "points": 3, "estimated_hours": 5.0, "time_label": "Active"},
    {"id": "T-118", "title": "Real-time avatar live cursor presence layer", "assignee_id": "setu", "status": "In Progress", "priority": "High", "points": 3, "estimated_hours": 4.5, "time_label": "Active"},
    {"id": "T-119", "title": "GraphQL schema migration for audit logs", "assignee_id": "monami", "status": "In Progress", "priority": "Medium", "points": 3, "estimated_hours": 4.0, "time_label": "Active"},
    {"id": "T-120", "title": "Batch contribution validation endpoint", "assignee_id": "shuvo", "status": "In Progress", "priority": "Medium", "points": 2, "estimated_hours": 3.0, "time_label": "Active"},
    {"id": "T-121", "title": "Figma to Tailwind token auto-sync CLI plugin", "assignee_id": "setu", "status": "In Progress", "priority": "Medium", "points": 2, "estimated_hours": 3.0, "time_label": "Active"},
    # Pending Tasks
    {"id": "T-122", "title": "Multi-region disaster recovery drill", "assignee_id": "monami", "status": "Pending", "priority": "Urgent", "points": 5, "estimated_hours": 8.0, "time_label": "Queue"},
    {"id": "T-123", "title": "End-to-end Cypress test suite for leaderboard", "assignee_id": "shuvo", "status": "Pending", "priority": "Medium", "points": 3, "estimated_hours": 5.0, "time_label": "Queue"},
    {"id": "T-124", "title": "Mobile modal swipe gestures optimization", "assignee_id": "setu", "status": "Pending", "priority": "Medium", "points": 2, "estimated_hours": 4.0, "time_label": "Queue"}
]

INITIAL_CONTRIBUTIONS = [
    {"id": "C-01", "member_id": "monami", "title": "Architected distributed event bus with zero packet loss", "category": "Architecture", "level": "Major", "hours": 8.5, "points": 5, "time_label": "1h ago", "date": "2025-05-18", "verified": True},
    {"id": "C-02", "member_id": "shuvo", "title": "Resolved memory leak in real-time chart canvas rendering loop", "category": "Bug Fix", "level": "Major", "hours": 7.0, "points": 5, "time_label": "3h ago", "date": "2025-05-18", "verified": True},
    {"id": "C-03", "member_id": "setu", "title": "Completed high-contrast accessible dark design system theme", "category": "Design", "level": "Large", "hours": 5.5, "points": 3, "time_label": "5h ago", "date": "2025-05-18", "verified": True},
    {"id": "C-04", "member_id": "monami", "title": "Optimized database execution plans for telemetry query", "category": "Development", "level": "Large", "hours": 6.0, "points": 3, "time_label": "8h ago", "date": "2025-05-17", "verified": True},
    {"id": "C-05", "member_id": "shuvo", "title": "Engineered instant task drag-and-drop reactive state sync", "category": "Development", "level": "Major", "hours": 9.0, "points": 5, "time_label": "1d ago", "date": "2025-05-17", "verified": True},
    {"id": "C-06", "member_id": "setu", "title": "Authored interactive prototype for milestone timeline", "category": "Design", "level": "Large", "hours": 4.5, "points": 3, "time_label": "1d ago", "date": "2025-05-17", "verified": True},
    {"id": "C-07", "member_id": "monami", "title": "Configured automated database failover with Redis sentinel", "category": "DevOps", "level": "Major", "hours": 6.5, "points": 5, "time_label": "2d ago", "date": "2025-05-16", "verified": True},
    {"id": "C-08", "member_id": "shuvo", "title": "Integrated unified search filter with fuzzy score matching", "category": "Development", "level": "Large", "hours": 5.0, "points": 3, "time_label": "2d ago", "date": "2025-05-16", "verified": True},
    {"id": "C-09", "member_id": "setu", "title": "Designed Leaderboard prestige tokens and Gold/Silver badges", "category": "Design", "level": "Medium", "hours": 3.5, "points": 2, "time_label": "2d ago", "date": "2025-05-16", "verified": True},
    {"id": "C-10", "member_id": "shuvo", "title": "Patched concurrency race condition in task status toggle", "category": "Bug Fix", "level": "Large", "hours": 4.0, "points": 3, "time_label": "3d ago", "date": "2025-05-15", "verified": True},
    {"id": "C-11", "member_id": "monami", "title": "Built high-throughput WebSocket message multiplexer", "category": "Development", "level": "Major", "hours": 8.0, "points": 5, "time_label": "3d ago", "date": "2025-05-15", "verified": True},
    {"id": "C-12", "member_id": "setu", "title": "Refactored component library typography to fluid scales", "category": "Design", "level": "Medium", "hours": 3.5, "points": 2, "time_label": "3d ago", "date": "2025-05-15", "verified": True},
    {"id": "C-13", "member_id": "shuvo", "title": "Reduced initial bundle payload by 42% via dynamic imports", "category": "Architecture", "level": "Large", "hours": 5.5, "points": 3, "time_label": "4d ago", "date": "2025-05-14", "verified": True},
    {"id": "C-14", "member_id": "monami", "title": "Stress tested telemetry engine up to 50k concurrent events", "category": "Testing", "level": "Large", "hours": 6.0, "points": 3, "time_label": "4d ago", "date": "2025-05-14", "verified": True},
    {"id": "C-15", "member_id": "setu", "title": "Created 24 high-density responsive SVG state diagrams", "category": "Design", "level": "Large", "hours": 6.5, "points": 3, "time_label": "4d ago", "date": "2025-05-14", "verified": True},
    {"id": "C-16", "member_id": "shuvo", "title": "Integrated instant CSV summary export with web worker", "category": "Development", "level": "Medium", "hours": 3.0, "points": 2, "time_label": "5d ago", "date": "2025-05-13", "verified": True},
    {"id": "C-17", "member_id": "monami", "title": "Deployed Kubernetes cluster auto-scaler on AWS EKS", "category": "DevOps", "level": "Large", "hours": 7.0, "points": 3, "time_label": "5d ago", "date": "2025-05-13", "verified": True},
    {"id": "C-18", "member_id": "setu", "title": "User testing interview synthesis for velocity dashboard", "category": "Testing", "level": "Medium", "hours": 4.0, "points": 2, "time_label": "5d ago", "date": "2025-05-13", "verified": True},
    {"id": "C-19", "member_id": "shuvo", "title": "Added keyboard accessibility tab navigation traps", "category": "Bug Fix", "level": "Small", "hours": 2.0, "points": 1, "time_label": "6d ago", "date": "2025-05-12", "verified": True},
    {"id": "C-20", "member_id": "monami", "title": "Hardened JWT session rotation and encryption salt keys", "category": "Architecture", "level": "Major", "hours": 6.0, "points": 5, "time_label": "6d ago", "date": "2025-05-12", "verified": True},
    {"id": "C-21", "member_id": "setu", "title": "Refined dark mode neutral contrast and surface step tiers", "category": "Design", "level": "Medium", "hours": 3.0, "points": 2, "time_label": "6d ago", "date": "2025-05-12", "verified": True},
    {"id": "C-22", "member_id": "shuvo", "title": "Created live telemetry pulse heartbeat daemon", "category": "Development", "level": "Large", "hours": 5.5, "points": 3, "time_label": "7d ago", "date": "2025-05-11", "verified": True}
]

INITIAL_VELOCITIES = [
    # Shuvo trajectory
    {"member_id": "shuvo", "week_label": "W05", "points": 22, "hours": 34.0, "week_order": 1},
    {"member_id": "shuvo", "week_label": "W06", "points": 31, "hours": 42.0, "week_order": 2},
    {"member_id": "shuvo", "week_label": "W07", "points": 38, "hours": 45.0, "week_order": 3},
    {"member_id": "shuvo", "week_label": "W08", "points": 35, "hours": 40.0, "week_order": 4},
    {"member_id": "shuvo", "week_label": "W09", "points": 46, "hours": 48.0, "week_order": 5},
    {"member_id": "shuvo", "week_label": "W10", "points": 51, "hours": 54.0, "week_order": 6},
    {"member_id": "shuvo", "week_label": "W11", "points": 54, "hours": 58.0, "week_order": 7},
    {"member_id": "shuvo", "week_label": "W12", "points": 58, "hours": 64.5, "week_order": 8},
    # Monami trajectory
    {"member_id": "monami", "week_label": "W05", "points": 28, "hours": 38.0, "week_order": 1},
    {"member_id": "monami", "week_label": "W06", "points": 34, "hours": 44.0, "week_order": 2},
    {"member_id": "monami", "week_label": "W07", "points": 36, "hours": 46.0, "week_order": 3},
    {"member_id": "monami", "week_label": "W08", "points": 40, "hours": 48.0, "week_order": 4},
    {"member_id": "monami", "week_label": "W09", "points": 42, "hours": 50.0, "week_order": 5},
    {"member_id": "monami", "week_label": "W10", "points": 45, "hours": 52.0, "week_order": 6},
    {"member_id": "monami", "week_label": "W11", "points": 46, "hours": 54.0, "week_order": 7},
    {"member_id": "monami", "week_label": "W12", "points": 48, "hours": 58.0, "week_order": 8},
    # Setu trajectory
    {"member_id": "setu", "week_label": "W05", "points": 18, "hours": 30.0, "week_order": 1},
    {"member_id": "setu", "week_label": "W06", "points": 24, "hours": 36.0, "week_order": 2},
    {"member_id": "setu", "week_label": "W07", "points": 29, "hours": 38.0, "week_order": 3},
    {"member_id": "setu", "week_label": "W08", "points": 32, "hours": 40.0, "week_order": 4},
    {"member_id": "setu", "week_label": "W09", "points": 36, "hours": 42.0, "week_order": 5},
    {"member_id": "setu", "week_label": "W10", "points": 38, "hours": 44.0, "week_order": 6},
    {"member_id": "setu", "week_label": "W11", "points": 40, "hours": 45.0, "week_order": 7},
    {"member_id": "setu", "week_label": "W12", "points": 42, "hours": 46.0, "week_order": 8},
]

def seed_database(db: Session):
    """Seed database with initial members, users, tasks, and contributions if empty."""
    # Seed Members
    if db.query(Member).count() == 0:
        for m_data in INITIAL_MEMBERS:
            member = Member(**m_data)
            db.add(member)
        db.commit()

    # Seed Users
    if db.query(User).count() == 0:
        for u_data in INITIAL_USERS:
            user = User(
                username=u_data["username"],
                email=u_data["email"],
                hashed_password=hash_password(u_data["password"]),
                role=u_data["role"],
                member_id=u_data["member_id"]
            )
            db.add(user)
        db.commit()

    # Seed Tasks
    if db.query(Task).count() == 0:
        for t_data in INITIAL_TASKS:
            task = Task(**t_data)
            db.add(task)
        db.commit()

    # Seed Contributions
    if db.query(Contribution).count() == 0:
        for c_data in INITIAL_CONTRIBUTIONS:
            contrib = Contribution(**c_data)
            db.add(contrib)
        db.commit()

    # Seed Weekly Velocities
    if db.query(WeeklyVelocity).count() == 0:
        for v_data in INITIAL_VELOCITIES:
            vel = WeeklyVelocity(**v_data)
            db.add(vel)
        db.commit()
