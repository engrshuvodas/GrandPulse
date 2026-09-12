"""
GrandPulse Automated Attribution Engine v2.2
Rules for point weighting, impact calculation, and automated task-to-contribution attribution.
"""

SCORE_WEIGHTS = {
    "Small": 1,
    "Medium": 2,
    "Large": 3,
    "Major": 5
}

CATEGORY_HOURS_RATIO = {
    "Development": 1.2,
    "Architecture": 1.5,
    "Bug Fix": 1.0,
    "Design": 1.1,
    "Testing": 1.0,
    "DevOps": 1.3
}

def get_points_for_level(level: str) -> int:
    """Returns points according to GrandPulse scoring matrix."""
    return SCORE_WEIGHTS.get(level, 2)

def calculate_task_attribution(task_points: int) -> tuple[str, float, int]:
    """
    Given a task's points, determine default impact level, hours and points
    for automated contribution logging.
    """
    if task_points >= 5:
        return ("Major", 4.0, task_points)
    elif task_points >= 3:
        return ("Large", 3.0, task_points)
    elif task_points >= 2:
        return ("Medium", 2.0, task_points)
    else:
        return ("Small", 1.0, task_points)
