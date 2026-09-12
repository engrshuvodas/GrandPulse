import io
from datetime import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def generate_grandpulse_excel(
    members_data: list[dict],
    contributions_data: list[dict],
    gantt_tasks_data: list[dict],
    milestones_data: list[dict],
    modules_data: list[dict],
    summary_data: dict
) -> io.BytesIO:
    """
    Generates a beautifully styled, comprehensive GrandPulse Excel spreadsheet
    using openpyxl with multiple dedicated worksheets, including the 16-Week Gantt Matrix,
    Milestones, 10 Major Modules, and Member Contributions.
    """
    wb = Workbook()
    
    # Define styles
    header_fill = PatternFill(start_color="1F2430", end_color="1F2430", fill_type="solid")
    accent_fill = PatternFill(start_color="4F46E5", end_color="4F46E5", fill_type="solid")
    gantt_bar_fill = PatternFill(start_color="4338CA", end_color="4338CA", fill_type="solid") # deep indigo
    gantt_done_fill = PatternFill(start_color="059669", end_color="059669", fill_type="solid") # emerald green
    gold_fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
    silver_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    bronze_fill = PatternFill(start_color="FFEDD5", end_color="FFEDD5", fill_type="solid")
    zebra_fill = PatternFill(start_color="F9FAFB", end_color="F9FAFB", fill_type="solid")
    week_header_fill = PatternFill(start_color="312E81", end_color="312E81", fill_type="solid")
    
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    white_bold_font = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
    title_font = Font(name="Calibri", size=16, bold=True, color="1E1B4B")
    subtitle_font = Font(name="Calibri", size=10, italic=True, color="6B7280")
    bold_font = Font(name="Calibri", size=11, bold=True)
    regular_font = Font(name="Calibri", size=11)
    
    thin_border = Border(
        left=Side(style='thin', color='E5E7EB'),
        right=Side(style='thin', color='E5E7EB'),
        top=Side(style='thin', color='E5E7EB'),
        bottom=Side(style='thin', color='E5E7EB')
    )
    
    align_center = Alignment(horizontal="center", vertical="center")
    align_left = Alignment(horizontal="left", vertical="center")
    align_right = Alignment(horizontal="right", vertical="center")

    # ==========================================
    # SHEET 1: 16-Week Gantt Schedule Matrix
    # ==========================================
    ws_gantt = wb.active
    ws_gantt.title = "16-Week Gantt Matrix"
    ws_gantt.views.sheetView[0].showGridLines = True
    
    ws_gantt.merge_cells("A1:W1")
    ws_gantt["A1"] = "HOSTEL MANAGEMENT SYSTEM — 16-WEEK GANTT SCHEDULE (PDF SPECIFICATION)"
    ws_gantt["A1"].font = title_font
    ws_gantt["A1"].alignment = align_left
    
    ws_gantt["A2"] = f"Generated on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')} · Project Duration: 16 Weeks · Software Engineering Documentation"
    ws_gantt["A2"].font = subtitle_font

    gantt_static_headers = ["ID", "Task Name", "Phase", "Start Wk", "End Wk", "Duration", "Progress %", "Status", "Assignee"]
    week_headers = [f"W{i}" for i in range(1, 17)]
    all_gantt_headers = gantt_static_headers + week_headers

    for col_idx, h in enumerate(all_gantt_headers, 1):
        cell = ws_gantt.cell(row=4, column=col_idx, value=h)
        cell.fill = week_header_fill if col_idx > len(gantt_static_headers) else header_fill
        cell.font = header_font
        cell.alignment = align_center
        cell.border = thin_border

    start_row = 5
    for r_idx, task in enumerate(gantt_tasks_data, start_row):
        ws_gantt.cell(row=r_idx, column=1, value=task.get("id"))
        ws_gantt.cell(row=r_idx, column=2, value=task.get("title")).font = bold_font
        ws_gantt.cell(row=r_idx, column=3, value=task.get("phase"))
        ws_gantt.cell(row=r_idx, column=4, value=f"W{task.get('start_week')}")
        ws_gantt.cell(row=r_idx, column=5, value=f"W{task.get('end_week')}")
        ws_gantt.cell(row=r_idx, column=6, value=f"{task.get('duration_weeks')} wks")
        ws_gantt.cell(row=r_idx, column=7, value=f"{task.get('progress_pct', 0)}%")
        ws_gantt.cell(row=r_idx, column=8, value=task.get("status"))
        ws_gantt.cell(row=r_idx, column=9, value=task.get("assignee_id") or "Unassigned")

        for c_idx in range(1, 10):
            c = ws_gantt.cell(row=r_idx, column=c_idx)
            c.border = thin_border
            if r_idx % 2 == 0:
                c.fill = zebra_fill
            if c_idx in [1, 4, 5, 6, 7, 8]:
                c.alignment = align_center

        # Week Columns W1 to W16
        s_wk = task.get("start_week", 1)
        e_wk = task.get("end_week", 1)
        pct = task.get("progress_pct", 0)

        for w in range(1, 17):
            w_col = 9 + w
            w_cell = ws_gantt.cell(row=r_idx, column=w_col)
            w_cell.border = thin_border
            if s_wk <= w <= e_wk:
                # Active week block (PDF: █)
                if pct == 100:
                    w_cell.fill = gantt_done_fill
                    w_cell.value = "DONE"
                else:
                    w_cell.fill = gantt_bar_fill
                    w_cell.value = f"{pct}%" if w == s_wk else "█"
                w_cell.font = white_bold_font
                w_cell.alignment = align_center
            else:
                w_cell.value = ""

    # ==========================================
    # SHEET 2: Major Modules (10 Modules)
    # ==========================================
    ws_modules = wb.create_sheet(title="Major Modules")
    ws_modules.views.sheetView[0].showGridLines = True

    ws_modules.merge_cells("A1:E1")
    ws_modules["A1"] = "HOSTEL MANAGEMENT SYSTEM — 10 MAJOR MODULES (PDF SPECIFICATION)"
    ws_modules["A1"].font = title_font
    
    mod_headers = ["Module #", "Module Title", "Description", "Status", "Completion %", "Module Lead"]
    for col_idx, h in enumerate(mod_headers, 1):
        cell = ws_modules.cell(row=3, column=col_idx, value=h)
        cell.fill = accent_fill
        cell.font = header_font
        cell.alignment = align_center
        cell.border = thin_border

    for r_idx, mod in enumerate(modules_data, 4):
        ws_modules.cell(row=r_idx, column=1, value=f"Module {mod.get('id')}").alignment = align_center
        ws_modules.cell(row=r_idx, column=2, value=mod.get("name")).font = bold_font
        ws_modules.cell(row=r_idx, column=3, value=mod.get("description", ""))
        ws_modules.cell(row=r_idx, column=4, value=mod.get("status")).alignment = align_center
        ws_modules.cell(row=r_idx, column=5, value=f"{mod.get('completion_pct', 0)}%").alignment = align_center
        ws_modules.cell(row=r_idx, column=6, value=mod.get("lead_id") or "Engineering Team")

        for col_idx in range(1, 7):
            c = ws_modules.cell(row=r_idx, column=col_idx)
            c.border = thin_border
            if r_idx % 2 == 0:
                c.fill = zebra_fill

    # ==========================================
    # SHEET 3: Key Milestones
    # ==========================================
    ws_milestones = wb.create_sheet(title="Key Milestones")
    ws_milestones.views.sheetView[0].showGridLines = True

    ws_milestones.merge_cells("A1:D1")
    ws_milestones["A1"] = "PROJECT MILESTONES ROADMAP (16 WEEKS)"
    ws_milestones["A1"].font = title_font

    ms_headers = ["Milestone #", "Target Week", "Milestone Deliverable", "Status"]
    for col_idx, h in enumerate(ms_headers, 1):
        cell = ws_milestones.cell(row=3, column=col_idx, value=h)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = align_center
        cell.border = thin_border

    for r_idx, ms in enumerate(milestones_data, 4):
        ws_milestones.cell(row=r_idx, column=1, value=f"MS-{ms.get('id')}").alignment = align_center
        ws_milestones.cell(row=r_idx, column=2, value=f"Week {ms.get('week')}").alignment = align_center
        ws_milestones.cell(row=r_idx, column=3, value=ms.get("title")).font = bold_font
        status_cell = ws_milestones.cell(row=r_idx, column=4, value=ms.get("status"))
        status_cell.alignment = align_center
        if ms.get("completed"):
            status_cell.fill = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")

        for col_idx in range(1, 5):
            ws_milestones.cell(row=r_idx, column=col_idx).border = thin_border

    # ==========================================
    # SHEET 4: Grand Contribution & Leaderboard
    # ==========================================
    ws_leaderboard = wb.create_sheet(title="Team Grand Chart")
    ws_leaderboard.views.sheetView[0].showGridLines = True
    
    lb_headers = ["Rank", "Member ID", "Full Name", "Role", "Points Recorded", "Total Hours", "Tasks Completed", "Tasks WIP", "Total Logs", "Team Share %"]
    for col_idx, h in enumerate(lb_headers, 1):
        cell = ws_leaderboard.cell(row=1, column=col_idx, value=h)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = align_center
        cell.border = thin_border

    for row_idx, m in enumerate(members_data, 2):
        rank = m.get("rank", row_idx - 1)
        r_cell = ws_leaderboard.cell(row=row_idx, column=1, value=f"#{rank}")
        ws_leaderboard.cell(row=row_idx, column=2, value=m.get("id"))
        ws_leaderboard.cell(row=row_idx, column=3, value=m.get("name"))
        ws_leaderboard.cell(row=row_idx, column=4, value=m.get("role"))
        pts_cell = ws_leaderboard.cell(row=row_idx, column=5, value=m.get("score", 0))
        ws_leaderboard.cell(row=row_idx, column=6, value=round(m.get("hours", 0.0), 1))
        ws_leaderboard.cell(row=row_idx, column=7, value=m.get("tasksCompleted", 0))
        ws_leaderboard.cell(row=row_idx, column=8, value=m.get("tasksInProgress", 0))
        ws_leaderboard.cell(row=row_idx, column=9, value=m.get("logsCount", 0))
        pct_cell = ws_leaderboard.cell(row=row_idx, column=10, value=f"{m.get('percentage', 0.0)}%")

        pts_cell.font = bold_font
        pts_cell.alignment = align_right
        r_cell.alignment = align_center
        pct_cell.alignment = align_right

        tier_fill = gold_fill if rank == 1 else (silver_fill if rank == 2 else (bronze_fill if rank == 3 else None))
        for col_idx in range(1, 11):
            cell = ws_leaderboard.cell(row=row_idx, column=col_idx)
            cell.border = thin_border
            if tier_fill:
                cell.fill = tier_fill

    # Auto-adjust column widths
    for ws in wb.worksheets:
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                val = str(cell.value or '')
                if len(val) > max_len:
                    max_len = len(val)
            ws.column_dimensions[col_letter].width = max(min(max_len + 4, 38), 7)

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return output
