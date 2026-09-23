import io
from datetime import datetime, date, timedelta, timezone
from openpyxl import Workbook
from openpyxl.styles import (
    Font, PatternFill, Alignment, Border, Side
)
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.page import PageMargins

# ─────────────────────────────────────────────────────────────────────────────
#  WHITE THEME COLOR PALETTE (RaktSeva Blood Bank Management System)
# ─────────────────────────────────────────────────────────────────────────────
C_WHITE          = "FFFFFF"   # main sheet background
C_LIGHT_BG       = "F8FAFC"   # subtle zebra / weekend col
C_PANEL_BG       = "F1F5F9"   # toolbar / summary panel
C_HEADER_DARK    = "1E293B"   # dark slate header (crisp contrast)
C_HEADER_DEEP    = "0F172A"   # deep slate
C_SUBHEADER      = "334155"   # day header row
C_BORDER         = "CBD5E1"   # crisp thin border
C_BORDER_LIGHT   = "E2E8F0"   # inner grid border
C_FONT_DARK      = "0F172A"   # primary text
C_FONT_MUTED     = "64748B"   # secondary text / dates
C_FONT_WHITE     = "FFFFFF"

# Phase Accent Colors (exactly matching the reference screenshot)
C_PHASE_ORANGE   = "F59E0B"   # 1. Project Setup & Planning
C_PHASE_YELLOW   = "EAB308"   # 2. System Design
C_PHASE_CYAN     = "06B6D4"   # 3. Core Module Development I
C_PHASE_PINK     = "EC4899"   # 4. Core Module Development II
C_PHASE_RED      = "EF4444"   # 5. Testing & QA
C_PHASE_GREEN    = "10B981"   # 6. Deployment & Maintenance

# Subtask Gantt Bar Color (from reference screenshot)
C_SUBTASK_BAR    = "3B82F6"   # Royal / Sky Blue
C_SUBTASK_BORDER = "2563EB"   # Border for subtask bar

# Brand Red for RaktSeva
C_RAKTSEVA_RED   = "B91C1C"
C_RAKTSEVA_LIGHT = "FEF2F2"

# ─────────────────────────────────────────────────────────────────────────────
#  CANONICAL 23 RAKTSEVA SPM TASKS (Matching Reference Image Hierarchy & Data)
# ─────────────────────────────────────────────────────────────────────────────
RAKTSEVA_23_TASKS = [
    # ── Phase 1: Project Setup & Planning ──
    {
        "id": 1,
        "name": "▼ Project Setup & Planning",
        "is_parent": True,
        "phase": "Planning",
        "start": "2026-09-27",
        "end": "2026-10-04",
        "duration": "6 days",
        "prog": "100%",
        "depend": "",
        "resources": "All Team",
        "color": C_PHASE_ORANGE,
    },
    {
        "id": 2,
        "name": "   Project Planning & Hospital Scope Definition",
        "is_parent": False,
        "phase": "Planning",
        "start": "2026-09-27",
        "end": "2026-09-28",
        "duration": "2 days",
        "prog": "100%",
        "depend": "",
        "resources": "Engr Shuvo Das",
        "color": "",
    },
    {
        "id": 3,
        "name": "   Requirement Gathering & Hospital Elicitation",
        "is_parent": False,
        "phase": "Planning",
        "start": "2026-09-29",
        "end": "2026-09-30",
        "duration": "2 days",
        "prog": "100%",
        "depend": "2FS",
        "resources": "Monami Sadhu",
        "color": "",
    },
    {
        "id": 4,
        "name": "   Feasibility Study & Tech Stack Benchmarking",
        "is_parent": False,
        "phase": "Planning",
        "start": "2026-10-01",
        "end": "2026-10-04",
        "duration": "2 days",
        "prog": "100%",
        "depend": "3FS",
        "resources": "Setu Mondol",
        "color": "",
    },

    # ── Phase 2: System Design ──
    {
        "id": 5,
        "name": "▼ System Design",
        "is_parent": True,
        "phase": "Design",
        "start": "2026-10-05",
        "end": "2026-10-12",
        "duration": "6 days",
        "prog": "100%",
        "depend": "",
        "resources": "All Team",
        "color": C_PHASE_YELLOW,
    },
    {
        "id": 6,
        "name": "   System Design (SRS, Use Case, ER, DFD)",
        "is_parent": False,
        "phase": "Design",
        "start": "2026-10-05",
        "end": "2026-10-06",
        "duration": "2 days",
        "prog": "100%",
        "depend": "4FS",
        "resources": "Monami Sadhu",
        "color": "",
    },
    {
        "id": 7,
        "name": "   Database Design (7 Tables: donor_details, etc.)",
        "is_parent": False,
        "phase": "Design",
        "start": "2026-10-07",
        "end": "2026-10-08",
        "duration": "2 days",
        "prog": "100%",
        "depend": "6FS",
        "resources": "Engr Shuvo Das",
        "color": "",
    },
    {
        "id": 8,
        "name": "   UI/UX Design & Prototyping (Bootstrap 4.6 Theme)",
        "is_parent": False,
        "phase": "Design",
        "start": "2026-10-11",
        "end": "2026-10-12",
        "duration": "2 days",
        "prog": "100%",
        "depend": "7FS",
        "resources": "Setu Mondol",
        "color": "",
    },

    # ── Phase 3: Core Module Development I ──
    {
        "id": 9,
        "name": "▼ Core Module Development I (User Portal)",
        "is_parent": True,
        "phase": "Development I",
        "start": "2026-10-13",
        "end": "2026-10-20",
        "duration": "6 days",
        "prog": "100%",
        "depend": "",
        "resources": "Dev Team",
        "color": C_PHASE_CYAN,
    },
    {
        "id": 10,
        "name": "   User Registration & Session Login Module",
        "is_parent": False,
        "phase": "Development I",
        "start": "2026-10-13",
        "end": "2026-10-14",
        "duration": "2 days",
        "prog": "100%",
        "depend": "8FS",
        "resources": "Engr Shuvo Das",
        "color": "",
    },
    {
        "id": 11,
        "name": "   Donor Registration & Validation Engine",
        "is_parent": False,
        "phase": "Development I",
        "start": "2026-10-15",
        "end": "2026-10-18",
        "duration": "2 days",
        "prog": "100%",
        "depend": "10FS",
        "resources": "Monami Sadhu",
        "color": "",
    },
    {
        "id": 12,
        "name": "   Blood Group Search & Compatibility Matching",
        "is_parent": False,
        "phase": "Development I",
        "start": "2026-10-19",
        "end": "2026-10-20",
        "duration": "2 days",
        "prog": "100%",
        "depend": "11FS",
        "resources": "Setu Mondol",
        "color": "",
    },

    # ── Phase 4: Core Module Development II ──
    {
        "id": 13,
        "name": "▼ Core Module Development II (Admin Portal & CMS)",
        "is_parent": True,
        "phase": "Development II",
        "start": "2026-10-21",
        "end": "2026-10-28",
        "duration": "6 days",
        "prog": "90%",
        "depend": "",
        "resources": "Dev Team",
        "color": C_PHASE_PINK,
    },
    {
        "id": 14,
        "name": "   Secure Admin Login & Live Statistics Dashboard",
        "is_parent": False,
        "phase": "Development II",
        "start": "2026-10-21",
        "end": "2026-10-22",
        "duration": "2 days",
        "prog": "100%",
        "depend": "12FS",
        "resources": "Engr Shuvo Das",
        "color": "",
    },
    {
        "id": 15,
        "name": "   Manage Donor List & Blood Request / Stock Tracking",
        "is_parent": False,
        "phase": "Development II",
        "start": "2026-10-25",
        "end": "2026-10-26",
        "duration": "2 days",
        "prog": "90%",
        "depend": "14FS",
        "resources": "Monami Sadhu",
        "color": "",
    },
    {
        "id": 16,
        "name": "   User Queries Tracker & CMS Page Content Editor",
        "is_parent": False,
        "phase": "Development II",
        "start": "2026-10-27",
        "end": "2026-10-28",
        "duration": "2 days",
        "prog": "85%",
        "depend": "15FS",
        "resources": "Setu Mondol",
        "color": "",
    },

    # ── Phase 5: Testing & QA ──
    {
        "id": 17,
        "name": "▼ Testing & QA",
        "is_parent": True,
        "phase": "Testing",
        "start": "2026-10-29",
        "end": "2026-11-05",
        "duration": "6 days",
        "prog": "80%",
        "depend": "",
        "resources": "QA Team",
        "color": C_PHASE_RED,
    },
    {
        "id": 18,
        "name": "   Unit, Integration & Security Testing (SQLi / XSS Audit)",
        "is_parent": False,
        "phase": "Testing",
        "start": "2026-10-29",
        "end": "2026-11-01",
        "duration": "2 days",
        "prog": "85%",
        "depend": "16FS",
        "resources": "Monami Sadhu",
        "color": "",
    },
    {
        "id": 19,
        "name": "   Bug Fixing & Prepared Statements Hardening",
        "is_parent": False,
        "phase": "Testing",
        "start": "2026-11-02",
        "end": "2026-11-03",
        "duration": "2 days",
        "prog": "80%",
        "depend": "18FS",
        "resources": "Engr Shuvo Das",
        "color": "",
    },
    {
        "id": 20,
        "name": "   Documentation (SPMP / Thesis / User Manual)",
        "is_parent": False,
        "phase": "Testing",
        "start": "2026-11-04",
        "end": "2026-11-05",
        "duration": "2 days",
        "prog": "75%",
        "depend": "19FS",
        "resources": "Setu Mondol",
        "color": "",
    },

    # ── Phase 6: Deployment & Maintenance ──
    {
        "id": 21,
        "name": "▼ Deployment & Maintenance",
        "is_parent": True,
        "phase": "Deployment",
        "start": "2026-11-08",
        "end": "2026-11-11",
        "duration": "4 days",
        "prog": "40%",
        "depend": "",
        "resources": "DevOps / IT",
        "color": C_PHASE_GREEN,
    },
    {
        "id": 22,
        "name": "   Hospital Staging Server Setup & UAT Sign-off",
        "is_parent": False,
        "phase": "Deployment",
        "start": "2026-11-08",
        "end": "2026-11-09",
        "duration": "2 days",
        "prog": "50%",
        "depend": "20FS",
        "resources": "Engr Shuvo Das",
        "color": "",
    },
    {
        "id": 23,
        "name": "   Final University Academic Defense & Maintenance",
        "is_parent": False,
        "phase": "Deployment",
        "start": "2026-11-10",
        "end": "2026-11-11",
        "duration": "2 days",
        "prog": "30%",
        "depend": "22FS",
        "resources": "Engr Shuvo Das & Team",
        "color": "",
    },
]


def _thin_border(color=C_BORDER_LIGHT):
    s = Side(style="thin", color=color)
    return Border(left=s, right=s, top=s, bottom=s)


def _thick_border(color="94A3B8"):
    thick = Side(style="medium", color=color)
    thin  = Side(style="thin",   color=C_BORDER_LIGHT)
    return Border(left=thick, right=thick, top=thin, bottom=thin)


def _fill(hex_color):
    return PatternFill(start_color=hex_color, end_color=hex_color, fill_type="solid")


def _font(bold=False, size=10, color=C_FONT_DARK, italic=False, name="Segoe UI"):
    return Font(name=name, size=size, bold=bold, color=color, italic=italic)


def _align(h="left", v="center", wrap=False):
    return Alignment(horizontal=h, vertical=v, wrap_text=wrap)


def _set_col_widths(ws, widths: dict):
    for col_letter, w in widths.items():
        ws.column_dimensions[col_letter].width = w


# ═══════════════════════════════════════════════════════════════════
#   MAIN ENTRY POINT
# ═══════════════════════════════════════════════════════════════════
def generate_grandpulse_excel(
    members_data: list,
    contributions_data: list,
    gantt_tasks_data: list,
    milestones_data: list,
    modules_data: list,
    summary_data: dict
) -> io.BytesIO:
    """
    Generates a 5-sheet, beautifully styled White-Theme Excel workbook
    for RaktSeva Blood Bank Management System SPM project matching the reference photo.
    """
    wb = Workbook()

    _build_gantt_sheet(wb, gantt_tasks_data, milestones_data, summary_data)
    _build_leaderboard_sheet(wb, members_data, summary_data)
    _build_contributions_sheet(wb, contributions_data)
    _build_modules_sheet(wb, modules_data)
    _build_milestones_sheet(wb, milestones_data)

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return output


# ═══════════════════════════════════════════════════════════════════
#   SHEET 1 — RAKTSEVA WHITE-THEME GANTT SCHEDULE MATRIX
# ═══════════════════════════════════════════════════════════════════
def _build_gantt_sheet(wb, tasks, milestones, summary):
    ws = wb.active
    ws.title = "📊 Gantt Schedule"
    ws.sheet_view.showGridLines = True

    # Page setup for printing
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.page_margins = PageMargins(left=0.3, right=0.3, top=0.5, bottom=0.5)

    now_utc = datetime.now(timezone.utc)
    ws.oddHeader.center.text = "RaktSeva — Blood Bank & Donor Management System — Project Gantt Chart"
    ws.oddFooter.right.text = f"Exported: {now_utc.strftime('%Y-%m-%d %H:%M UTC')}"

    # ── ROW 1: TOOLBAR (From Photo: + Add, Expand all, Collapse all, Zoom...) ──
    toolbar_buttons = [
        "+ Add", "⊞ Expand all", "⊟ Collapse all", "🔍 Zoom in", "🔍 Zoom out", "⤢ Zoom to fit"
    ]
    ws.row_dimensions[1].height = 24
    for ci, btn in enumerate(toolbar_buttons, 1):
        cell = ws.cell(row=1, column=ci, value=f"  {btn}  ")
        cell.fill = _fill(C_PANEL_BG)
        cell.font = _font(bold=True, size=9, color="334155")
        cell.alignment = _align("center", "center")
        cell.border = _thin_border(C_BORDER)

    # ── ROW 2: TITLE BANNER ──
    ws.row_dimensions[2].height = 28
    title_cell = ws.cell(row=2, column=1, value="RaktSeva — Blood Bank & Donor Management System — Project Gantt Chart")
    title_cell.font = _font(bold=True, size=15, color=C_FONT_DARK)
    title_cell.alignment = _align("left", "center")

    # ── ROW 3: SUBTITLE / METADATA ──
    ws.row_dimensions[3].height = 18
    sub_cell = ws.cell(
        row=3, column=1,
        value="Parul Sevashram Hospital Initiative  |  Tech: PHP 8.x, MySQL (7 Tables), Bootstrap 4.6  |  Lead: Engr Shuvo Das  |  SPM Schedule"
    )
    sub_cell.font = _font(italic=True, size=9, color=C_FONT_MUTED)
    sub_cell.alignment = _align("left", "center")

    # ── TIMELINE CALENDAR SETUP (50 Days spanning 2026-09-27 to 2026-11-15) ──
    timeline_start = date(2026, 9, 27)
    timeline_days = [timeline_start + timedelta(days=i) for i in range(50)]

    # ── STATIC TABLE HEADERS (Cols A to I) ──
    STATIC_HEADERS = [
        ("ID", 6),
        ("Task Name", 44),
        ("Start", 13),
        ("End", 13),
        ("Duration", 11),
        ("Prog %", 9),
        ("Depend.", 9),
        ("Resources", 22),
        ("Col", 5),
    ]

    for ci, (h, width) in enumerate(STATIC_HEADERS, 1):
        letter = get_column_letter(ci)
        ws.column_dimensions[letter].width = width

    # Timeline daily columns width
    for ci in range(10, 10 + len(timeline_days)):
        letter = get_column_letter(ci)
        ws.column_dimensions[letter].width = 3.4

    # ── HEADER ROWS 4 & 5 ──
    ws.row_dimensions[4].height = 19
    ws.row_dimensions[5].height = 18

    # Merge static columns vertically across row 4 and row 5
    for ci, (h, _) in enumerate(STATIC_HEADERS, 1):
        ws.merge_cells(start_row=4, start_column=ci, end_row=5, end_column=ci)
        cell = ws.cell(row=4, column=ci, value=h)
        cell.fill = _fill(C_HEADER_DARK)
        cell.font = _font(bold=True, size=9, color=C_FONT_WHITE)
        cell.alignment = _align("center", "center")
        cell.border = _thin_border("334155")
        ws.cell(row=5, column=ci).border = _thin_border("334155")

    # Timeline Tier 1: Merged week dates on Row 4
    week_starts = [0, 7, 14, 21, 28, 35, 42]
    for wi, start_idx in enumerate(week_starts):
        end_idx = min(start_idx + 6, len(timeline_days) - 1)
        c_start = 10 + start_idx
        c_end = 10 + end_idx
        ws.merge_cells(start_row=4, start_column=c_start, end_row=4, end_column=c_end)
        top_cell = ws.cell(row=4, column=c_start, value=timeline_days[start_idx].strftime("%Y-%m-%d"))
        top_cell.fill = _fill(C_HEADER_DEEP)
        top_cell.font = _font(bold=True, size=8, color=C_FONT_WHITE)
        top_cell.alignment = _align("center", "center")
        for c in range(c_start, c_end + 1):
            ws.cell(row=4, column=c).border = _thin_border("334155")

    # Timeline Tier 2: Individual day numbers on Row 5
    for idx, d in enumerate(timeline_days):
        col = 10 + idx
        day_cell = ws.cell(row=5, column=col, value=str(d.day))
        day_cell.fill = _fill(C_HEADER_DARK)
        day_cell.font = _font(bold=True, size=7, color="CBD5E1")
        day_cell.alignment = _align("center", "center")
        day_cell.border = _thin_border("334155")

    # ── POPULATE 23 RAKTSEVA TASKS (Rows 6 to 28) ──
    for ri, task in enumerate(RAKTSEVA_23_TASKS, 6):
        ws.row_dimensions[ri].height = 20
        is_p = task["is_parent"]
        p_color = task.get("color")
        row_bg = "F8FAFC" if is_p else ("FFFFFF" if ri % 2 == 0 else "FAFAFA")

        # Col A: ID
        c_id = ws.cell(row=ri, column=1, value=task["id"])
        c_id.fill = _fill(row_bg)
        c_id.font = _font(bold=is_p, size=9, color=C_FONT_DARK)
        c_id.alignment = _align("center", "center")
        c_id.border = _thin_border()

        # Col B: Task Name (bold for parent, indented for child)
        c_name = ws.cell(row=ri, column=2, value=task["name"])
        c_name.fill = _fill(row_bg)
        c_name.font = _font(bold=is_p, size=9, color=C_FONT_DARK if is_p else "1E293B")
        c_name.alignment = _align("left", "center")
        c_name.border = _thin_border()

        # Col C: Start
        c_start = ws.cell(row=ri, column=3, value=task["start"])
        c_start.fill = _fill(row_bg)
        c_start.font = _font(size=9, color="475569")
        c_start.alignment = _align("center", "center")
        c_start.border = _thin_border()

        # Col D: End
        c_end = ws.cell(row=ri, column=4, value=task["end"])
        c_end.fill = _fill(row_bg)
        c_end.font = _font(size=9, color="475569")
        c_end.alignment = _align("center", "center")
        c_end.border = _thin_border()

        # Col E: Duration
        c_dur = ws.cell(row=ri, column=5, value=task["duration"])
        c_dur.fill = _fill(row_bg)
        c_dur.font = _font(size=9, color="475569")
        c_dur.alignment = _align("center", "center")
        c_dur.border = _thin_border()

        # Col F: Prog %
        c_prog = ws.cell(row=ri, column=6, value=task["prog"])
        c_prog.fill = _fill(row_bg)
        is_done = task["prog"] == "100%"
        c_prog.font = _font(bold=True, size=9, color="059669" if is_done else "475569")
        c_prog.alignment = _align("center", "center")
        c_prog.border = _thin_border()

        # Col G: Depend.
        c_dep = ws.cell(row=ri, column=7, value=task["depend"])
        c_dep.fill = _fill(row_bg)
        c_dep.font = _font(bold=True, size=8, color="6366F1")
        c_dep.alignment = _align("center", "center")
        c_dep.border = _thin_border()

        # Col H: Resources
        c_res = ws.cell(row=ri, column=8, value=task["resources"])
        c_res.fill = _fill(row_bg)
        c_res.font = _font(bold=is_p, size=9, color=C_FONT_DARK)
        c_res.alignment = _align("left" if not is_p else "center", "center")
        c_res.border = _thin_border()

        # Col I: Col (Small colored square indicator block for parent phases)
        c_col = ws.cell(row=ri, column=9)
        if is_p and p_color:
            c_col.fill = _fill(p_color)
            c_col.border = _thin_border("94A3B8")
        else:
            c_col.fill = _fill(row_bg)
            c_col.border = _thin_border()

        # Timeline columns (Cols J to BH)
        t_start = datetime.strptime(task["start"], "%Y-%m-%d").date()
        t_end = datetime.strptime(task["end"], "%Y-%m-%d").date()

        for idx, d in enumerate(timeline_days):
            col = 10 + idx
            cell = ws.cell(row=ri, column=col)
            is_wknd = (d.weekday() in (5, 6))

            if t_start <= d <= t_end:
                if is_p:
                    cell.fill = _fill(p_color)
                    cell.border = _thin_border(p_color)
                else:
                    cell.fill = _fill(C_SUBTASK_BAR)
                    s_top = Side(style="thin", color=C_SUBTASK_BORDER)
                    s_left = s_top if d == t_start else None
                    s_right = s_top if d == t_end else None
                    cell.border = Border(top=s_top, bottom=s_top, left=s_left, right=s_right)
            else:
                cell.fill = _fill("F1F5F9" if is_wknd else C_WHITE)
                cell.border = _thin_border("F1F5F9" if is_wknd else C_BORDER_LIGHT)

    # ── LEGEND & PROJECT INFO BLOCK (Row 30 onwards) ──
    leg_row = 30
    ws.row_dimensions[leg_row].height = 20
    ws.merge_cells(f"A{leg_row}:I{leg_row}")
    l_title = ws.cell(row=leg_row, column=1, value="  PHASE COLOR LEGEND & DEPENDENCY NOTATION:")
    l_title.font = _font(bold=True, size=9, color=C_HEADER_DARK)
    l_title.fill = _fill(C_PANEL_BG)
    l_title.border = _thin_border(C_BORDER)

    phase_legends = [
        (C_PHASE_ORANGE, "Phase 1: Setup & Planning"),
        (C_PHASE_YELLOW, "Phase 2: System Design"),
        (C_PHASE_CYAN, "Phase 3: Core Dev I (User)"),
        (C_PHASE_PINK, "Phase 4: Core Dev II (Admin)"),
        (C_PHASE_RED, "Phase 5: Testing & QA"),
        (C_PHASE_GREEN, "Phase 6: Deployment & Defense"),
        (C_SUBTASK_BAR, "Task Activity Span (Blue)"),
    ]

    for li, (col_hex, lbl) in enumerate(phase_legends):
        c_start = 10 + li * 5
        c_end = min(c_start + 4, 10 + len(timeline_days) - 1)
        ws.merge_cells(start_row=leg_row, start_column=c_start, end_row=leg_row, end_column=c_end)
        leg_cell = ws.cell(row=leg_row, column=c_start, value=f" ■ {lbl}")
        leg_cell.fill = _fill(col_hex)
        leg_cell.font = _font(bold=True, size=8, color=C_FONT_WHITE)
        leg_cell.alignment = _align("center", "center")
        for c in range(c_start, c_end + 1):
            ws.cell(row=leg_row, column=c).border = _thin_border()

    # ── FREEZE PANES (Keeps Columns A-I locked while scrolling dates horizontally) ──
    ws.freeze_panes = "J6"


# ═══════════════════════════════════════════════════════════════════
#   SHEET 2 — TEAM LEADERBOARD (White Theme)
# ═══════════════════════════════════════════════════════════════════
def _build_leaderboard_sheet(wb, members_data, summary):
    ws = wb.create_sheet(title="🏆 Team Leaderboard")
    ws.sheet_view.showGridLines = True
    ws.page_setup.orientation = "portrait"

    # Title
    ws.merge_cells("A1:J1")
    t = ws["A1"]
    t.value = "RAKTSEVA — TEAM VELOCITY GRAND LEADERBOARD"
    t.font  = _font(bold=True, size=15, color=C_HEADER_DARK)
    t.fill  = _fill(C_PANEL_BG)
    t.alignment = _align("center", "center")
    t.border = _thin_border(C_BORDER)
    ws.row_dimensions[1].height = 28

    # Summary bar
    ws.merge_cells("A2:J2")
    total_pts  = summary.get("total_points", 0)
    total_hrs  = summary.get("total_hours", 0)
    ws["A2"].value = (
        f"Hospital: Parul Sevashram  |  Total Team Points: {total_pts}  |  Total Hours Logged: {total_hrs}h  |  "
        f"Velocity: {summary.get('sprint_velocity', '100%')}  |  "
        f"Completed Tasks: {summary.get('completed_tasks', 0)} / {summary.get('total_tasks', 0)}"
    )
    ws["A2"].font  = _font(size=9, italic=True, color=C_FONT_MUTED)
    ws["A2"].alignment = _align("center")
    ws["A2"].fill  = _fill(C_LIGHT_BG)
    ws.row_dimensions[2].height = 16

    ws.row_dimensions[3].height = 6  # spacer

    # Headers
    HEADERS = ["Rank", "Member ID", "Full Name", "Role",
                "Points", "Hours", "Completed Tasks", "WIP Tasks",
                "Log Count", "Team Share %"]
    for ci, h in enumerate(HEADERS, 1):
        cell = ws.cell(row=4, column=ci, value=h)
        cell.fill  = _fill(C_HEADER_DARK)
        cell.font  = _font(bold=True, size=10, color=C_FONT_WHITE)
        cell.alignment = _align("center")
        cell.border = _thin_border("334155")
    ws.row_dimensions[4].height = 20

    RANK_FILLS  = {1: "FEF9C3", 2: "F1F5F9", 3: "FFEDD5"}
    RANK_LABELS = {1: "🥇 #1", 2: "🥈 #2", 3: "🥉 #3"}

    for ri, m in enumerate(members_data, 5):
        rank = m.get("rank", ri - 4)
        row_bg = RANK_FILLS.get(rank, C_WHITE if (ri % 2) else C_LIGHT_BG)

        vals = [
            RANK_LABELS.get(rank, f"#{rank}"),
            m.get("id"),
            m.get("name"),
            m.get("role"),
            m.get("score", 0),
            round(m.get("hours", 0), 1),
            m.get("tasksCompleted", 0),
            m.get("tasksInProgress", 0),
            m.get("logsCount", 0),
            f"{m.get('percentage', 0)}%",
        ]

        for ci, val in enumerate(vals, 1):
            cell = ws.cell(row=ri, column=ci, value=val)
            cell.fill   = _fill(row_bg)
            cell.border = _thin_border(C_BORDER)
            cell.alignment = _align("center" if ci != 3 else "left", "center")
            if ci == 5:
                cell.font = _font(bold=True, size=12, color=C_SUBTASK_BORDER)
            elif ci == 3:
                cell.font = _font(bold=True, size=10)
            elif ci == 1:
                cell.font = _font(bold=True, size=11)
            else:
                cell.font = _font(size=9.5)
        ws.row_dimensions[ri].height = 22

    widths = {"A": 9, "B": 12, "C": 22, "D": 32, "E": 10,
              "F": 10, "G": 16, "H": 12, "I": 11, "J": 13}
    _set_col_widths(ws, widths)


# ═══════════════════════════════════════════════════════════════════
#   SHEET 3 — FULL CONTRIBUTION LEDGER (White Theme)
# ═══════════════════════════════════════════════════════════════════
def _build_contributions_sheet(wb, contributions):
    ws = wb.create_sheet(title="📝 Contribution Ledger")
    ws.sheet_view.showGridLines = True

    ws.merge_cells("A1:I1")
    t = ws["A1"]
    t.value = f"RAKTSEVA — FULL CONTRIBUTION LEDGER  ({len(contributions)} Verified Engineering Logs)"
    t.font  = _font(bold=True, size=14, color=C_HEADER_DARK)
    t.fill  = _fill(C_PANEL_BG)
    t.alignment = _align("center", "center")
    t.border = _thin_border(C_BORDER)
    ws.row_dimensions[1].height = 24

    HEADERS = ["Log ID", "Member", "Contribution Title", "Category",
                "Level", "Hours", "Points", "Verified", "Date"]
    for ci, h in enumerate(HEADERS, 1):
        cell = ws.cell(row=3, column=ci, value=h)
        cell.fill  = _fill(C_HEADER_DARK)
        cell.font  = _font(bold=True, size=10, color=C_FONT_WHITE)
        cell.alignment = _align("center")
        cell.border = _thin_border("334155")
    ws.row_dimensions[3].height = 18

    LEVEL_COLORS = {
        "Major":  ("E0E7FF", "3730A3"),
        "Large":  ("D1FAE5", "065F46"),
        "Medium": ("FEF9C3", "854D0E"),
        "Small":  ("F1F5F9", "475569"),
    }

    CAT_ICONS = {
        "Planning": "📋", "Design": "🎨", "Development": "⚙️",
        "Testing": "🧪", "Security": "🔐", "DevOps": "🚀",
        "Documentation": "📄",
    }

    for ri, c in enumerate(contributions, 4):
        is_zebra = (ri % 2 == 0)
        row_bg   = C_LIGHT_BG if is_zebra else C_WHITE
        level    = c.get("level", "Medium")
        lv_bg, lv_fg = LEVEL_COLORS.get(level, ("F1F5F9", "475569"))
        cat      = c.get("category", "Development")

        vals = [
            c.get("id", ""),
            c.get("member_id", ""),
            f"{CAT_ICONS.get(cat, '•')} {c.get('title', '')}",
            cat,
            level,
            c.get("hours", 0),
            c.get("points", 0),
            "✅ Yes" if c.get("verified") else "❌ No",
            c.get("date", ""),
        ]

        for ci, val in enumerate(vals, 1):
            cell = ws.cell(row=ri, column=ci, value=val)
            cell.border = _thin_border(C_BORDER)
            cell.alignment = _align("left" if ci == 3 else "center", "center")

            if ci == 1:
                cell.font = _font(bold=True, size=9, color=C_SUBTASK_BORDER)
                cell.fill = _fill(row_bg)
            elif ci == 2:
                cell.font = _font(bold=True, size=9.5, color="4338CA")
                cell.fill = _fill(row_bg)
            elif ci == 3:
                cell.font = _font(size=9)
                cell.fill = _fill(row_bg)
                cell.alignment = _align("left", "center", wrap=True)
            elif ci == 4:
                cell.font = _font(bold=True, size=9, color="0369A1")
                cell.fill = _fill("EFF6FF" if is_zebra else "DBEAFE")
            elif ci == 5:
                cell.font = _font(bold=True, size=9, color=lv_fg)
                cell.fill = _fill(lv_bg)
            elif ci == 6:
                cell.font = _font(size=9, color=C_FONT_MUTED)
                cell.fill = _fill(row_bg)
            elif ci == 7:
                cell.font = _font(bold=True, size=11, color="1E3A8A")
                cell.fill = _fill(row_bg)
            elif ci == 8:
                cell.font = _font(bold=True, size=9,
                                   color="166534" if c.get("verified") else "991B1B")
                cell.fill = _fill(row_bg)
            elif ci == 9:
                cell.font = _font(size=9, color=C_FONT_MUTED)
                cell.fill = _fill(row_bg)

        ws.row_dimensions[ri].height = 18

    # Totals row
    total_row = 4 + len(contributions)
    ws.merge_cells(f"A{total_row}:E{total_row}")
    ws.cell(row=total_row, column=1, value="TOTALS").font = _font(bold=True, size=11, color=C_FONT_WHITE)
    ws.cell(row=total_row, column=1).fill = _fill(C_HEADER_DARK)
    ws.cell(row=total_row, column=1).alignment = _align("right")
    ws.cell(row=total_row, column=6,
            value=round(sum(c.get("hours", 0) for c in contributions), 1)
            ).font = _font(bold=True, size=11, color="34D399")
    ws.cell(row=total_row, column=6).fill = _fill(C_HEADER_DARK)
    ws.cell(row=total_row, column=7,
            value=sum(c.get("points", 0) for c in contributions)
            ).font = _font(bold=True, size=13, color="FCD34D")
    ws.cell(row=total_row, column=7).fill = _fill(C_HEADER_DARK)
    ws.row_dimensions[total_row].height = 20

    widths = {"A": 9, "B": 11, "C": 62, "D": 15, "E": 10, "F": 8, "G": 8, "H": 10, "I": 12}
    _set_col_widths(ws, widths)
    ws.freeze_panes = ws["A4"]


# ═══════════════════════════════════════════════════════════════════
#   SHEET 4 — 10 MAJOR MODULES (White Theme)
# ═══════════════════════════════════════════════════════════════════
def _build_modules_sheet(wb, modules):
    ws = wb.create_sheet(title="🧩 Major Modules")
    ws.sheet_view.showGridLines = True

    ws.merge_cells("A1:F1")
    t = ws["A1"]
    t.value = "RAKTSEVA — 10 MAJOR SOFTWARE MODULES (from SRS Document)"
    t.font  = _font(bold=True, size=14, color=C_HEADER_DARK)
    t.fill  = _fill(C_PANEL_BG)
    t.alignment = _align("center", "center")
    t.border = _thin_border(C_BORDER)
    ws.row_dimensions[1].height = 24

    HEADERS = ["Module #", "Module Name", "Description", "Status", "Completion %", "Module Lead"]
    for ci, h in enumerate(HEADERS, 1):
        cell = ws.cell(row=3, column=ci, value=h)
        cell.fill  = _fill(C_HEADER_DARK)
        cell.font  = _font(bold=True, size=10, color=C_FONT_WHITE)
        cell.alignment = _align("center")
        cell.border = _thin_border("334155")
    ws.row_dimensions[3].height = 18

    for ri, mod in enumerate(modules, 4):
        is_zebra = (ri % 2 == 0)
        row_bg   = C_LIGHT_BG if is_zebra else C_WHITE
        pct      = mod.get("completion_pct", 0)
        status   = mod.get("status", "In Progress")

        ws.cell(row=ri, column=1, value=f"M-{mod.get('id', ri - 3):02d}").font = _font(bold=True, size=10, color=C_SUBTASK_BORDER)
        ws.cell(row=ri, column=1).alignment = _align("center")
        ws.cell(row=ri, column=1).fill = _fill(row_bg)
        ws.cell(row=ri, column=1).border = _thin_border(C_BORDER)

        ws.cell(row=ri, column=2, value=mod.get("name", "")).font = _font(bold=True, size=10)
        ws.cell(row=ri, column=2).alignment = _align("left", "center", wrap=True)
        ws.cell(row=ri, column=2).fill = _fill(row_bg)
        ws.cell(row=ri, column=2).border = _thin_border(C_BORDER)

        ws.cell(row=ri, column=3, value=mod.get("description", "")).font = _font(size=9, color=C_FONT_MUTED)
        ws.cell(row=ri, column=3).alignment = _align("left", "center", wrap=True)
        ws.cell(row=ri, column=3).fill = _fill(row_bg)
        ws.cell(row=ri, column=3).border = _thin_border(C_BORDER)

        status_map = {
            "Completed":   ("DCFCE7", "166534"),
            "In Progress": ("FEF9C3", "854D0E"),
            "Queued":      ("F1F5F9", "475569"),
        }
        sbg, sfg = status_map.get(status, ("F1F5F9", "475569"))
        sc = ws.cell(row=ri, column=4, value=status)
        sc.fill      = _fill(sbg)
        sc.font      = _font(bold=True, size=9, color=sfg)
        sc.alignment = _align("center")
        sc.border    = _thin_border(C_BORDER)

        pct_color = "166534" if pct == 100 else ("2563EB" if pct >= 70 else "D97706")
        pc = ws.cell(row=ri, column=5, value=f"{pct}%")
        pc.font      = _font(bold=True, size=11, color=pct_color)
        pc.alignment = _align("center")
        pc.fill      = _fill(row_bg)
        pc.border    = _thin_border(C_BORDER)

        lead_map = {"shuvo": "Engr Shuvo Das", "monami": "Monami Sadhu", "setu": "Setu Mondol"}
        lc = ws.cell(row=ri, column=6, value=lead_map.get(mod.get("lead_id", ""), mod.get("lead_id", "")))
        lc.font      = _font(bold=True, size=9.5, color="4338CA")
        lc.alignment = _align("center")
        lc.fill      = _fill(row_bg)
        lc.border    = _thin_border(C_BORDER)

        ws.row_dimensions[ri].height = 36

    widths = {"A": 10, "B": 35, "C": 58, "D": 14, "E": 13, "F": 18}
    _set_col_widths(ws, widths)


# ═══════════════════════════════════════════════════════════════════
#   SHEET 5 — KEY MILESTONES (White Theme)
# ═══════════════════════════════════════════════════════════════════
def _build_milestones_sheet(wb, milestones):
    ws = wb.create_sheet(title="🎯 Milestones")
    ws.sheet_view.showGridLines = True

    ws.merge_cells("A1:E1")
    t = ws["A1"]
    t.value = "RAKTSEVA — 7 KEY PROJECT MILESTONES ROADMAP (16-Week Timeline)"
    t.font  = _font(bold=True, size=14, color=C_HEADER_DARK)
    t.fill  = _fill(C_PANEL_BG)
    t.alignment = _align("center", "center")
    t.border = _thin_border(C_BORDER)
    ws.row_dimensions[1].height = 24

    HEADERS = ["Milestone #", "Target Week", "Gate / Deliverable", "Status", "Achieved?"]
    for ci, h in enumerate(HEADERS, 1):
        cell = ws.cell(row=3, column=ci, value=h)
        cell.fill  = _fill(C_HEADER_DARK)
        cell.font  = _font(bold=True, size=10, color=C_FONT_WHITE)
        cell.alignment = _align("center")
        cell.border = _thin_border("334155")
    ws.row_dimensions[3].height = 18

    for ri, ms in enumerate(milestones, 4):
        done   = ms.get("completed", False)
        status = ms.get("status", "Upcoming")
        row_bg = "DCFCE7" if done else ("FEF9C3" if status == "In Progress" else C_WHITE)

        ws.cell(row=ri, column=1, value=f"MS-{ms.get('id')}").font = _font(bold=True, size=11, color=C_SUBTASK_BORDER)
        ws.cell(row=ri, column=1).alignment = _align("center")
        ws.cell(row=ri, column=1).fill = _fill(row_bg)
        ws.cell(row=ri, column=1).border = _thin_border(C_BORDER)

        week_cell = ws.cell(row=ri, column=2, value=f"Week {ms.get('week')}")
        week_cell.font      = _font(bold=True, size=10, color=C_HEADER_DARK)
        week_cell.alignment = _align("center")
        week_cell.fill      = _fill(row_bg)
        week_cell.border    = _thin_border(C_BORDER)

        title_cell = ws.cell(row=ri, column=3, value=ms.get("title", ""))
        title_cell.font      = _font(bold=True, size=9.5)
        title_cell.alignment = _align("left", "center", wrap=True)
        title_cell.fill      = _fill(row_bg)
        title_cell.border    = _thin_border(C_BORDER)

        status_colors = {
            "Completed":   ("166534", "DCFCE7"),
            "In Progress": ("854D0E", "FEF9C3"),
            "Upcoming":    ("475569", "F1F5F9"),
        }
        fg, bg = status_colors.get(status, ("475569", "F1F5F9"))
        sc = ws.cell(row=ri, column=4, value=status)
        sc.font      = _font(bold=True, size=9.5, color=fg)
        sc.fill      = _fill(bg)
        sc.alignment = _align("center")
        sc.border    = _thin_border(C_BORDER)

        check = ws.cell(row=ri, column=5, value="✅ Achieved" if done else ("🔄 In Progress" if status == "In Progress" else "⏳ Upcoming"))
        check.font      = _font(bold=True, size=10,
                                 color="166534" if done else ("B45309" if status == "In Progress" else "94A3B8"))
        check.alignment = _align("center")
        check.fill      = _fill(row_bg)
        check.border    = _thin_border(C_BORDER)

        ws.row_dimensions[ri].height = 30

    widths = {"A": 13, "B": 13, "C": 64, "D": 14, "E": 15}
    _set_col_widths(ws, widths)
