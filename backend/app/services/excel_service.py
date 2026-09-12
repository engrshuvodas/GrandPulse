import io
from datetime import datetime
from openpyxl import Workbook
from openpyxl.styles import (
    Font, PatternFill, Alignment, Border, Side, GradientFill
)
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.page import PageMargins

# ─────────────────────────────────────────────
#  COLOR PALETTE  (RaktSeva SPM Report Theme)
# ─────────────────────────────────────────────
C_DARK_BG       = "0F1117"   # page bg
C_HEADER_DARK   = "1A1D2E"   # section header row
C_INDIGO        = "4F46E5"   # accent / Gantt bar active
C_INDIGO_DEEP   = "312E81"   # week-column headers
C_EMERALD       = "059669"   # completed bar
C_AMBER         = "D97706"   # in-progress bar
C_ROSE          = "E11D48"   # urgent / red
C_GOLD_BG       = "FEF9C3"   # rank 1
C_SILVER_BG     = "F1F5F9"   # rank 2
C_BRONZE_BG     = "FFEDD5"   # rank 3
C_ZEBRA         = "F8FAFC"   # alternating row
C_ZEBRA2        = "EFF6FF"   # second shade
C_COMPLETED_BG  = "DCFCE7"   # milestone done
C_PENDING_BG    = "FEF3C7"   # milestone pending
C_FONT_DARK     = "1E293B"   # body text
C_FONT_WHITE    = "FFFFFF"
C_FONT_GRAY     = "64748B"
C_BORDER        = "CBD5E1"


def _thin_border(color=C_BORDER):
    s = Side(style="thin", color=color)
    return Border(left=s, right=s, top=s, bottom=s)


def _thick_border():
    thick = Side(style="medium", color="94A3B8")
    thin  = Side(style="thin",   color=C_BORDER)
    return Border(left=thick, right=thick, top=thin, bottom=thin)


def _fill(hex_color):
    return PatternFill(start_color=hex_color, end_color=hex_color, fill_type="solid")


def _font(bold=False, size=11, color=C_FONT_DARK, italic=False, name="Calibri"):
    return Font(name=name, size=size, bold=bold, color=color, italic=italic)


def _align(h="left", v="center", wrap=False):
    return Alignment(horizontal=h, vertical=v, wrap_text=wrap)


def _style_cell(cell, value=None, fill=None, font=None, align=None, border=None):
    if value is not None:
        cell.value = value
    if fill:
        cell.fill = fill
    if font:
        cell.font = font
    if align:
        cell.alignment = align
    if border:
        cell.border = border


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
    Generates a 5-sheet, beautifully styled, university-submission-ready
    GrandPulse Excel workbook for the RaktSeva Blood Bank System SPM project.
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
#   SHEET 1 — 16-WEEK GANTT SCHEDULE MATRIX
# ═══════════════════════════════════════════════════════════════════
def _build_gantt_sheet(wb, tasks, milestones, summary):
    ws = wb.active
    ws.title = "📊 Gantt Schedule"
    ws.sheet_view.showGridLines = False

    # ── Page setup for printing ──
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.page_margins = PageMargins(left=0.4, right=0.4, top=0.6, bottom=0.6)
    ws.print_area = "A1:Z50"
    ws.oddHeader.center.text = "RaktSeva Blood Bank System — 16-Week SPM Gantt Schedule"
    ws.oddFooter.right.text = f"Generated: {datetime.utcnow().strftime('%Y-%m-%d')}"

    # ── TITLE BLOCK (row 1-3) ──
    ws.merge_cells("A1:Z1")
    t = ws["A1"]
    t.value = "RAKTSEVA BLOOD BANK SYSTEM — 16-WEEK SOFTWARE PROJECT MANAGEMENT SCHEDULE"
    t.font = Font(name="Calibri", size=18, bold=True, color=C_INDIGO)
    t.fill = _fill("EEF2FF")
    t.alignment = _align("center", "center")
    t.border = _thin_border()
    ws.row_dimensions[1].height = 30

    ws.merge_cells("A2:Z2")
    sub = ws["A2"]
    sub.value = (
        f"Project Type: Blood Bank Management System  |  Team: Shuvo Das · Monami Sadhu · Setu Mondol  |  "
        f"Duration: 16 Weeks (Feb–May 2026)  |  Methodology: Agile-Waterfall Hybrid  |  "
        f"Generated: {datetime.utcnow().strftime('%d %b %Y %H:%M UTC')}"
    )
    sub.font = _font(size=9, color=C_FONT_GRAY, italic=True)
    sub.alignment = _align("center")
    sub.fill = _fill("F8FAFF")
    ws.row_dimensions[2].height = 16

    ws.row_dimensions[3].height = 4  # spacer

    # ── COLUMN HEADER ROW (row 4) ──
    STATIC_COLS  = ["ID", "Task Description", "Phase", "Start", "End", "Dur.", "Progress", "Status", "Lead"]
    WEEK_LABELS  = [f"W{i}" for i in range(1, 17)]
    ALL_HEADERS  = STATIC_COLS + WEEK_LABELS
    HEADER_ROW   = 4

    for ci, h in enumerate(ALL_HEADERS, 1):
        cell = ws.cell(row=HEADER_ROW, column=ci, value=h)
        is_week = ci > len(STATIC_COLS)
        cell.fill  = _fill(C_INDIGO_DEEP if is_week else C_HEADER_DARK)
        cell.font  = _font(bold=True, size=10, color=C_FONT_WHITE)
        cell.alignment = _align("center", "center")
        cell.border = _thin_border("4F46E5" if is_week else "374151")
    ws.row_dimensions[HEADER_ROW].height = 20

    # ── TASK DATA ROWS (row 5+) ──
    PHASE_COLORS = {
        "Planning":    "6366F1",
        "Design":      "EC4899",
        "Development": "0EA5E9",
        "Testing":     "F59E0B",
        "Deployment":  "10B981",
    }

    DATA_START = 5
    for ri, task in enumerate(tasks, DATA_START):
        is_zebra = (ri % 2 == 0)
        row_bg   = C_ZEBRA if is_zebra else C_FONT_WHITE

        # Status → bar color
        pct    = task.get("progress_pct", 0)
        status = task.get("status", "Pending")
        if status == "Completed" or pct == 100:
            bar_fill = _fill(C_EMERALD)
            bar_text = "✓ DONE"
            bar_font = _font(bold=True, size=8, color=C_FONT_WHITE)
        elif pct >= 50:
            bar_fill = _fill(C_INDIGO)
            bar_text = f"{pct}%"
            bar_font = _font(bold=True, size=8, color=C_FONT_WHITE)
        elif pct > 0:
            bar_fill = _fill(C_AMBER)
            bar_text = f"{pct}%"
            bar_font = _font(bold=True, size=8, color=C_FONT_WHITE)
        else:
            bar_fill = None
            bar_text = ""
            bar_font = _font(size=8)

        # Phase color dot
        phase       = task.get("phase", "Development")
        phase_color = PHASE_COLORS.get(phase, "6B7280")

        # Static columns
        static_vals = [
            task.get("id", ""),
            task.get("title", ""),
            phase,
            f"W{task.get('start_week', '')}",
            f"W{task.get('end_week', '')}",
            f"{task.get('duration_weeks', '')}w",
            f"{pct}%",
            status,
            task.get("assignee_id", "") or "—",
        ]

        for ci, val in enumerate(static_vals, 1):
            cell = ws.cell(row=ri, column=ci, value=val)
            cell.fill   = _fill(row_bg)
            cell.border = _thin_border()

            # Column-specific formatting
            if ci == 1:  # ID
                cell.font      = _font(bold=True, size=9, color=C_INDIGO)
                cell.alignment = _align("center")
            elif ci == 2:  # Title — bold, wrap
                cell.font      = _font(bold=True, size=9)
                cell.alignment = _align("left", "center", wrap=True)
            elif ci == 3:  # Phase
                cell.font      = _font(bold=True, size=9, color=phase_color)
                cell.alignment = _align("center")
                cell.fill      = _fill("F0F4FF" if not is_zebra else "E8EEFF")
            elif ci in (4, 5, 6):  # Start/End/Dur
                cell.font      = _font(size=9, color=C_FONT_GRAY)
                cell.alignment = _align("center")
            elif ci == 7:  # Progress
                cell.font      = _font(bold=True, size=9,
                                        color=C_EMERALD if pct == 100 else
                                             (C_INDIGO if pct >= 50 else C_AMBER if pct > 0 else C_FONT_GRAY))
                cell.alignment = _align("center")
            elif ci == 8:  # Status
                status_colors = {
                    "Completed":   ("DCFCE7", "166534"),
                    "In Progress": ("FEF9C3", "854D0E"),
                    "Pending":     ("F1F5F9", "475569"),
                }
                bg, fg = status_colors.get(status, ("F1F5F9", "475569"))
                cell.fill      = _fill(bg)
                cell.font      = _font(bold=True, size=9, color=fg)
                cell.alignment = _align("center")
            elif ci == 9:  # Assignee
                cell.font      = _font(bold=True, size=9, color="7C3AED")
                cell.alignment = _align("center")

        # Week columns W1–W16
        sw = task.get("start_week", 1)
        ew = task.get("end_week", 1)

        for w in range(1, 17):
            wc = len(STATIC_COLS) + w
            cell = ws.cell(row=ri, column=wc)

            if sw <= w <= ew:
                cell.fill      = bar_fill or _fill(row_bg)
                cell.font      = bar_font
                cell.alignment = _align("center", "center")
                cell.border    = _thin_border("4F46E5")
                # Only put text in first cell of bar
                if w == sw:
                    cell.value = bar_text
                else:
                    cell.value = ""
            else:
                cell.fill      = _fill(row_bg)
                cell.border    = _thin_border()
                cell.value     = ""

        ws.row_dimensions[ri].height = 18

    # ── MILESTONE MARKER ROW ──
    ms_row = DATA_START + len(tasks) + 1
    ws.merge_cells(f"A{ms_row}:I{ms_row}")
    ms_hdr = ws.cell(row=ms_row, column=1,
                      value="  KEY MILESTONES — TARGET WEEK MARKERS")
    ms_hdr.fill      = _fill(C_INDIGO_DEEP)
    ms_hdr.font      = _font(bold=True, size=10, color=C_FONT_WHITE)
    ms_hdr.alignment = _align("left")
    ws.row_dimensions[ms_row].height = 18

    milestone_weeks = {ms.get("week"): ms for ms in milestones}
    for w in range(1, 17):
        ci   = len(STATIC_COLS) + w
        cell = ws.cell(row=ms_row, column=ci)
        if w in milestone_weeks:
            ms = milestone_weeks[w]
            cell.value = f"MS-{ms.get('id')}"
            cell.fill  = _fill("FDE68A" if ms.get("completed") else "FCA5A5")
            cell.font  = _font(bold=True, size=8,
                                color="92400E" if ms.get("completed") else "991B1B")
        else:
            cell.fill = _fill(C_INDIGO_DEEP)
        cell.alignment = _align("center")
        cell.border    = _thin_border("4F46E5")

    # ── LEGEND ──
    leg_row = ms_row + 2
    ws.merge_cells(f"A{leg_row}:I{leg_row}")
    ws.cell(row=leg_row, column=1, value="LEGEND:").font = _font(bold=True, size=9, color=C_FONT_GRAY)

    legends = [
        (C_EMERALD, "✓ Completed (100%)"),
        (C_INDIGO, "In Progress (≥50%)"),
        (C_AMBER, "In Progress (<50%)"),
        ("FDE68A", "Milestone ✓ Reached"),
        ("FCA5A5", "Milestone ○ Upcoming"),
    ]
    for li, (col, lbl) in enumerate(legends):
        start_ci = len(STATIC_COLS) + 1 + li * 3
        cell = ws.cell(row=leg_row, column=start_ci, value=f"  {lbl}")
        cell.fill  = _fill(col)
        cell.font  = _font(bold=True, size=8,
                            color=C_FONT_WHITE if col in (C_EMERALD, C_INDIGO, C_AMBER) else C_FONT_DARK)
        cell.alignment = _align("left")
        cell.border    = _thin_border()
        ws.merge_cells(
            start_row=leg_row, start_column=start_ci,
            end_row=leg_row, end_column=min(start_ci + 2, 25)
        )

    # ── FREEZE PANES (keep ID+Title visible while scrolling weeks) ──
    ws.freeze_panes = ws.cell(row=5, column=3)

    # ── COLUMN WIDTHS ──
    col_widths = {
        "A": 7,   # ID
        "B": 36,  # Title
        "C": 13,  # Phase
        "D": 7,   # Start
        "E": 7,   # End
        "F": 6,   # Dur
        "G": 9,   # Progress
        "H": 11,  # Status
        "I": 9,   # Lead
    }
    _set_col_widths(ws, col_widths)
    for w in range(1, 17):
        letter = get_column_letter(len(STATIC_COLS) + w)
        ws.column_dimensions[letter].width = 5.5

    ws.row_dimensions[1].height = 32
    ws.row_dimensions[2].height = 14


# ═══════════════════════════════════════════════════════════════════
#   SHEET 2 — TEAM GRAND LEADERBOARD
# ═══════════════════════════════════════════════════════════════════
def _build_leaderboard_sheet(wb, members_data, summary):
    ws = wb.create_sheet(title="🏆 Team Leaderboard")
    ws.sheet_view.showGridLines = False
    ws.page_setup.orientation = "portrait"

    # Title
    ws.merge_cells("A1:J1")
    t = ws["A1"]
    t.value = "RAKTSEVA — TEAM VELOCITY GRAND LEADERBOARD"
    t.font  = Font(name="Calibri", size=16, bold=True, color=C_INDIGO)
    t.fill  = _fill("EEF2FF")
    t.alignment = _align("center", "center")
    t.border = _thin_border()
    ws.row_dimensions[1].height = 28

    # Summary bar
    ws.merge_cells("A2:J2")
    total_pts  = summary.get("total_points", 0)
    total_hrs  = summary.get("total_hours", 0)
    ws["A2"].value = (
        f"Total Team Points: {total_pts}  |  Total Hours Logged: {total_hrs}h  |  "
        f"Sprint Velocity: {summary.get('sprint_velocity', 'N/A')}  |  "
        f"Tasks Completed: {summary.get('completed_tasks', 0)} / {summary.get('total_tasks', 0)}"
    )
    ws["A2"].font  = _font(size=9, italic=True, color=C_FONT_GRAY)
    ws["A2"].alignment = _align("center")
    ws["A2"].fill  = _fill("F8FAFF")
    ws.row_dimensions[2].height = 14

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
        cell.border = _thin_border("374151")
    ws.row_dimensions[4].height = 20

    RANK_FILLS  = {1: C_GOLD_BG, 2: C_SILVER_BG, 3: C_BRONZE_BG}
    RANK_LABELS = {1: "🥇 #1", 2: "🥈 #2", 3: "🥉 #3"}

    for ri, m in enumerate(members_data, 5):
        rank = m.get("rank", ri - 4)
        row_bg = RANK_FILLS.get(rank, C_FONT_WHITE if (ri % 2) else C_ZEBRA)

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
            cell.border = _thin_border()
            cell.alignment = _align("center" if ci != 3 else "left", "center")
            if ci == 5:  # Points — big + bold
                cell.font = _font(bold=True, size=13, color=C_INDIGO)
            elif ci == 3:  # Name
                cell.font = _font(bold=True, size=11)
            elif ci == 1:  # Rank
                cell.font = _font(bold=True, size=12)
            else:
                cell.font = _font(size=10)
        ws.row_dimensions[ri].height = 22

    # Column widths
    widths = {"A": 9, "B": 12, "C": 20, "D": 30, "E": 10,
              "F": 10, "G": 16, "H": 12, "I": 11, "J": 13}
    _set_col_widths(ws, widths)


# ═══════════════════════════════════════════════════════════════════
#   SHEET 3 — FULL CONTRIBUTION LEDGER (all 36 logs)
# ═══════════════════════════════════════════════════════════════════
def _build_contributions_sheet(wb, contributions):
    ws = wb.create_sheet(title="📝 Contribution Ledger")
    ws.sheet_view.showGridLines = False

    ws.merge_cells("A1:I1")
    t = ws["A1"]
    t.value = f"RAKTSEVA — FULL CONTRIBUTION LEDGER  ({len(contributions)} Verified Logs)"
    t.font  = Font(name="Calibri", size=14, bold=True, color=C_INDIGO)
    t.fill  = _fill("EEF2FF")
    t.alignment = _align("center", "center")
    t.border = _thin_border()
    ws.row_dimensions[1].height = 24

    HEADERS = ["Log ID", "Member", "Contribution Title", "Category",
                "Level", "Hours", "Points", "Verified", "Date"]
    for ci, h in enumerate(HEADERS, 1):
        cell = ws.cell(row=3, column=ci, value=h)
        cell.fill  = _fill(C_INDIGO_DEEP)
        cell.font  = _font(bold=True, size=10, color=C_FONT_WHITE)
        cell.alignment = _align("center")
        cell.border = _thin_border("4F46E5")
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
        row_bg   = C_ZEBRA if is_zebra else C_FONT_WHITE
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
            cell.border = _thin_border()
            cell.alignment = _align("left" if ci == 3 else "center", "center")

            if ci == 1:
                cell.font = _font(bold=True, size=9, color=C_INDIGO)
                cell.fill = _fill(row_bg)
            elif ci == 2:
                cell.font = _font(bold=True, size=10, color="7C3AED")
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
                cell.font = _font(size=9, color=C_FONT_GRAY)
                cell.fill = _fill(row_bg)
            elif ci == 7:
                cell.font = _font(bold=True, size=11, color=C_INDIGO)
                cell.fill = _fill(row_bg)
            elif ci == 8:
                cell.font = _font(bold=True, size=9,
                                   color="166534" if c.get("verified") else "991B1B")
                cell.fill = _fill(row_bg)
            elif ci == 9:
                cell.font = _font(size=9, color=C_FONT_GRAY)
                cell.fill = _fill(row_bg)

        ws.row_dimensions[ri].height = 17

    # Totals row
    total_row = 4 + len(contributions)
    ws.merge_cells(f"A{total_row}:E{total_row}")
    ws.cell(row=total_row, column=1, value="TOTALS").font = _font(bold=True, size=11, color=C_FONT_WHITE)
    ws.cell(row=total_row, column=1).fill = _fill(C_HEADER_DARK)
    ws.cell(row=total_row, column=1).alignment = _align("right")
    ws.cell(row=total_row, column=6,
            value=round(sum(c.get("hours", 0) for c in contributions), 1)
            ).font = _font(bold=True, size=11, color=C_EMERALD)
    ws.cell(row=total_row, column=6).fill = _fill(C_HEADER_DARK)
    ws.cell(row=total_row, column=7,
            value=sum(c.get("points", 0) for c in contributions)
            ).font = _font(bold=True, size=13, color="FCD34D")
    ws.cell(row=total_row, column=7).fill = _fill(C_HEADER_DARK)
    ws.row_dimensions[total_row].height = 20

    widths = {"A": 9, "B": 10, "C": 60, "D": 15, "E": 10, "F": 8, "G": 8, "H": 10, "I": 12}
    _set_col_widths(ws, widths)
    ws.freeze_panes = ws["A4"]


# ═══════════════════════════════════════════════════════════════════
#   SHEET 4 — 10 MAJOR MODULES
# ═══════════════════════════════════════════════════════════════════
def _build_modules_sheet(wb, modules):
    ws = wb.create_sheet(title="🧩 Major Modules")
    ws.sheet_view.showGridLines = False

    ws.merge_cells("A1:F1")
    t = ws["A1"]
    t.value = "RAKTSEVA — 10 MAJOR SOFTWARE MODULES (from SRS Document)"
    t.font  = Font(name="Calibri", size=14, bold=True, color=C_INDIGO)
    t.fill  = _fill("EEF2FF")
    t.alignment = _align("center", "center")
    t.border = _thin_border()
    ws.row_dimensions[1].height = 24

    HEADERS = ["Module #", "Module Name", "Description", "Status", "Completion %", "Module Lead"]
    for ci, h in enumerate(HEADERS, 1):
        cell = ws.cell(row=3, column=ci, value=h)
        cell.fill  = _fill(C_HEADER_DARK)
        cell.font  = _font(bold=True, size=10, color=C_FONT_WHITE)
        cell.alignment = _align("center")
        cell.border = _thin_border("374151")
    ws.row_dimensions[3].height = 18

    for ri, mod in enumerate(modules, 4):
        is_zebra = (ri % 2 == 0)
        row_bg   = C_ZEBRA if is_zebra else C_FONT_WHITE
        pct      = mod.get("completion_pct", 0)
        status   = mod.get("status", "In Progress")

        ws.cell(row=ri, column=1, value=f"M-{mod.get('id', ri - 3):02d}").font = _font(bold=True, size=11, color=C_INDIGO)
        ws.cell(row=ri, column=1).alignment = _align("center")
        ws.cell(row=ri, column=1).fill = _fill(row_bg)
        ws.cell(row=ri, column=1).border = _thin_border()

        ws.cell(row=ri, column=2, value=mod.get("name", "")).font = _font(bold=True, size=10)
        ws.cell(row=ri, column=2).alignment = _align("left", "center", wrap=True)
        ws.cell(row=ri, column=2).fill = _fill(row_bg)
        ws.cell(row=ri, column=2).border = _thin_border()

        ws.cell(row=ri, column=3, value=mod.get("description", "")).font = _font(size=9, color=C_FONT_GRAY)
        ws.cell(row=ri, column=3).alignment = _align("left", "center", wrap=True)
        ws.cell(row=ri, column=3).fill = _fill(row_bg)
        ws.cell(row=ri, column=3).border = _thin_border()

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
        sc.border    = _thin_border()

        pct_color = C_EMERALD if pct == 100 else (C_INDIGO if pct >= 70 else C_AMBER)
        pc = ws.cell(row=ri, column=5, value=f"{pct}%")
        pc.font      = _font(bold=True, size=12, color=pct_color)
        pc.alignment = _align("center")
        pc.fill      = _fill(row_bg)
        pc.border    = _thin_border()

        lead_map = {"shuvo": "Shuvo Das", "monami": "Monami Sadhu", "setu": "Setu Mondol"}
        lc = ws.cell(row=ri, column=6, value=lead_map.get(mod.get("lead_id", ""), mod.get("lead_id", "")))
        lc.font      = _font(bold=True, size=10, color="7C3AED")
        lc.alignment = _align("center")
        lc.fill      = _fill(row_bg)
        lc.border    = _thin_border()

        ws.row_dimensions[ri].height = 36

    widths = {"A": 10, "B": 35, "C": 55, "D": 14, "E": 13, "F": 16}
    _set_col_widths(ws, widths)


# ═══════════════════════════════════════════════════════════════════
#   SHEET 5 — KEY MILESTONES
# ═══════════════════════════════════════════════════════════════════
def _build_milestones_sheet(wb, milestones):
    ws = wb.create_sheet(title="🎯 Milestones")
    ws.sheet_view.showGridLines = False

    ws.merge_cells("A1:E1")
    t = ws["A1"]
    t.value = "RAKTSEVA — 7 KEY PROJECT MILESTONES ROADMAP (16-Week Timeline)"
    t.font  = Font(name="Calibri", size=14, bold=True, color=C_INDIGO)
    t.fill  = _fill("EEF2FF")
    t.alignment = _align("center", "center")
    t.border = _thin_border()
    ws.row_dimensions[1].height = 24

    HEADERS = ["Milestone #", "Target Week", "Gate / Deliverable", "Status", "Achieved?"]
    for ci, h in enumerate(HEADERS, 1):
        cell = ws.cell(row=3, column=ci, value=h)
        cell.fill  = _fill(C_HEADER_DARK)
        cell.font  = _font(bold=True, size=10, color=C_FONT_WHITE)
        cell.alignment = _align("center")
        cell.border = _thin_border("374151")
    ws.row_dimensions[3].height = 18

    for ri, ms in enumerate(milestones, 4):
        done   = ms.get("completed", False)
        status = ms.get("status", "Upcoming")
        row_bg = C_COMPLETED_BG if done else (C_PENDING_BG if status == "In Progress" else C_FONT_WHITE)

        ws.cell(row=ri, column=1, value=f"MS-{ms.get('id')}").font = _font(bold=True, size=12, color=C_INDIGO)
        ws.cell(row=ri, column=1).alignment = _align("center")
        ws.cell(row=ri, column=1).fill = _fill(row_bg)
        ws.cell(row=ri, column=1).border = _thin_border()

        week_cell = ws.cell(row=ri, column=2, value=f"Week {ms.get('week')}")
        week_cell.font      = _font(bold=True, size=11, color=C_INDIGO_DEEP)
        week_cell.alignment = _align("center")
        week_cell.fill      = _fill(row_bg)
        week_cell.border    = _thin_border()

        title_cell = ws.cell(row=ri, column=3, value=ms.get("title", ""))
        title_cell.font      = _font(bold=True, size=10)
        title_cell.alignment = _align("left", "center", wrap=True)
        title_cell.fill      = _fill(row_bg)
        title_cell.border    = _thin_border()

        status_colors = {
            "Completed":   ("166534", "DCFCE7"),
            "In Progress": ("854D0E", "FEF9C3"),
            "Upcoming":    ("475569", "F1F5F9"),
        }
        fg, bg = status_colors.get(status, ("475569", "F1F5F9"))
        sc = ws.cell(row=ri, column=4, value=status)
        sc.font      = _font(bold=True, size=10, color=fg)
        sc.fill      = _fill(bg)
        sc.alignment = _align("center")
        sc.border    = _thin_border()

        check = ws.cell(row=ri, column=5, value="✅ Achieved" if done else ("🔄 In Progress" if status == "In Progress" else "⏳ Upcoming"))
        check.font      = _font(bold=True, size=11,
                                 color="166534" if done else ("B45309" if status == "In Progress" else "94A3B8"))
        check.alignment = _align("center")
        check.fill      = _fill(row_bg)
        check.border    = _thin_border()

        ws.row_dimensions[ri].height = 32

    widths = {"A": 13, "B": 13, "C": 60, "D": 14, "E": 15}
    _set_col_widths(ws, widths)
