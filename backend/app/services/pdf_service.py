"""
pdf_service.py  –  RaktSeva Blood Bank Management System
A4 Landscape PDF Report Generator using ReportLab
Sections: Cover, Gantt Chart (16-Week), Milestones, Modules, Member Leaderboard
"""

import io
from datetime import datetime, timezone
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.platypus.flowables import HRFlowable
from reportlab.graphics.shapes import Drawing, Rect, String, Line
from reportlab.graphics import renderPDF

# ─── Color Palette ────────────────────────────────────────────────────────────
C_RED        = colors.HexColor("#b91c1c")       # RaktSeva red
C_RED_LIGHT  = colors.HexColor("#fecaca")
C_RED_BG     = colors.HexColor("#fff1f2")
C_DARK       = colors.HexColor("#1e1e2e")
C_SLATE      = colors.HexColor("#334155")
C_GRAY_DARK  = colors.HexColor("#475569")
C_GRAY       = colors.HexColor("#94a3b8")
C_GRAY_LIGHT = colors.HexColor("#e2e8f0")
C_WHITE      = colors.white
C_BG         = colors.HexColor("#f8fafc")

# Phase colors
PHASE_COLORS = {
    "Planning":    colors.HexColor("#7c3aed"),   # violet
    "Design":      colors.HexColor("#0284c7"),   # sky
    "Development": colors.HexColor("#1d4ed8"),   # blue
    "Testing":     colors.HexColor("#059669"),   # emerald
    "Deployment":  colors.HexColor("#d97706"),   # amber
}
PHASE_BG = {
    "Planning":    colors.HexColor("#ede9fe"),
    "Design":      colors.HexColor("#e0f2fe"),
    "Development": colors.HexColor("#dbeafe"),
    "Testing":     colors.HexColor("#d1fae5"),
    "Deployment":  colors.HexColor("#fef3c7"),
}

MEMBER_COLORS = {
    "shuvo":  colors.HexColor("#b91c1c"),
    "monami": colors.HexColor("#1d4ed8"),
    "setu":   colors.HexColor("#059669"),
}
MEMBER_NAMES = {
    "shuvo":  "Shuvo Das",
    "monami": "Monami Sadhu",
    "setu":   "Setu Mondol",
}

PAGE_W, PAGE_H = landscape(A4)
MARGIN = 18 * mm


# ─── Styles ──────────────────────────────────────────────────────────────────
def _make_styles():
    base = getSampleStyleSheet()
    styles = {}

    styles["title"] = ParagraphStyle(
        "title", fontName="Helvetica-Bold", fontSize=28, textColor=C_RED,
        alignment=TA_CENTER, spaceAfter=4
    )
    styles["subtitle"] = ParagraphStyle(
        "subtitle", fontName="Helvetica", fontSize=11, textColor=C_SLATE,
        alignment=TA_CENTER, spaceAfter=2
    )
    styles["section"] = ParagraphStyle(
        "section", fontName="Helvetica-Bold", fontSize=13, textColor=C_RED,
        spaceBefore=10, spaceAfter=6, borderPad=4
    )
    styles["body"] = ParagraphStyle(
        "body", fontName="Helvetica", fontSize=8, textColor=C_SLATE,
        spaceAfter=2, leading=12
    )
    styles["cell_bold"] = ParagraphStyle(
        "cell_bold", fontName="Helvetica-Bold", fontSize=7.5, textColor=C_DARK,
        leading=10
    )
    styles["cell"] = ParagraphStyle(
        "cell", fontName="Helvetica", fontSize=7, textColor=C_GRAY_DARK,
        leading=10
    )
    styles["header_cell"] = ParagraphStyle(
        "header_cell", fontName="Helvetica-Bold", fontSize=7.5,
        textColor=C_WHITE, alignment=TA_CENTER, leading=10
    )
    styles["week_num"] = ParagraphStyle(
        "week_num", fontName="Helvetica-Bold", fontSize=6,
        textColor=C_WHITE, alignment=TA_CENTER, leading=8
    )
    styles["footer"] = ParagraphStyle(
        "footer", fontName="Helvetica", fontSize=7, textColor=C_GRAY,
        alignment=TA_CENTER
    )
    return styles


# ─── Header / Footer callbacks ────────────────────────────────────────────────
def _page_header_footer(canvas, doc):
    canvas.saveState()
    w, h = landscape(A4)

    # Top red band
    canvas.setFillColor(C_RED)
    canvas.rect(0, h - 14 * mm, w, 14 * mm, fill=1, stroke=0)

    canvas.setFont("Helvetica-Bold", 10)
    canvas.setFillColor(C_WHITE)
    canvas.drawString(MARGIN, h - 9 * mm, "🩸 RaktSeva Blood Bank Management System")

    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#fecaca"))
    ts = datetime.now().strftime("%d %b %Y  %H:%M")
    canvas.drawRightString(w - MARGIN, h - 9 * mm, f"Generated: {ts}")

    # Bottom footer
    canvas.setFillColor(C_GRAY_LIGHT)
    canvas.rect(0, 0, w, 10 * mm, fill=1, stroke=0)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(C_GRAY_DARK)
    canvas.drawCentredString(
        w / 2, 3.5 * mm,
        "RaktSeva SPM Project  •  Parul University  •  Software Project Management  •  CONFIDENTIAL"
    )
    canvas.setFont("Helvetica", 7)
    canvas.drawRightString(w - MARGIN, 3.5 * mm, f"Page {doc.page}")
    canvas.restoreState()


# ─── Cover Page ───────────────────────────────────────────────────────────────
def _build_cover(styles, summary_data, members_data):
    story = []
    story.append(Spacer(1, 20 * mm))

    story.append(Paragraph("🩸 RaktSeva", styles["title"]))
    story.append(Paragraph("Blood Bank &amp; Donor Management System", ParagraphStyle(
        "st2", fontName="Helvetica-Bold", fontSize=16, textColor=C_SLATE,
        alignment=TA_CENTER, spaceAfter=3
    )))
    story.append(Paragraph(
        "Software Project Management (SPM) • 16-Week Academic Schedule • Parul University",
        styles["subtitle"]
    ))
    story.append(HRFlowable(width="80%", thickness=1.5, color=C_RED, spaceAfter=10))
    story.append(Spacer(1, 6 * mm))

    # Stats summary box
    total   = summary_data.get("total_tasks", 23)
    done    = summary_data.get("completed_tasks", 23)
    ratio   = summary_data.get("completed_ratio", 100.0)
    hours   = summary_data.get("total_hours", 0)
    pts     = summary_data.get("total_points", 0)
    members = summary_data.get("active_members", 3)

    stat_data = [
        [
            Paragraph(f"<b>{total}</b><br/>Total Tasks", ParagraphStyle("sc",fontName="Helvetica-Bold",fontSize=13,textColor=C_RED,alignment=TA_CENTER,leading=16)),
            Paragraph(f"<b>{done}</b><br/>Completed", ParagraphStyle("sc",fontName="Helvetica-Bold",fontSize=13,textColor=colors.HexColor("#059669"),alignment=TA_CENTER,leading=16)),
            Paragraph(f"<b>{ratio}%</b><br/>Progress", ParagraphStyle("sc",fontName="Helvetica-Bold",fontSize=13,textColor=colors.HexColor("#1d4ed8"),alignment=TA_CENTER,leading=16)),
            Paragraph(f"<b>{members}</b><br/>Members", ParagraphStyle("sc",fontName="Helvetica-Bold",fontSize=13,textColor=colors.HexColor("#7c3aed"),alignment=TA_CENTER,leading=16)),
            Paragraph(f"<b>16</b><br/>Weeks", ParagraphStyle("sc",fontName="Helvetica-Bold",fontSize=13,textColor=colors.HexColor("#d97706"),alignment=TA_CENTER,leading=16)),
        ]
    ]
    stat_table = Table(stat_data, colWidths=[50*mm]*5, rowHeights=[22*mm])
    stat_table.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (0,0), colors.HexColor("#fff1f2")),
        ("BACKGROUND",  (1,0), (1,0), colors.HexColor("#dcfce7")),
        ("BACKGROUND",  (2,0), (2,0), colors.HexColor("#dbeafe")),
        ("BACKGROUND",  (3,0), (3,0), colors.HexColor("#ede9fe")),
        ("BACKGROUND",  (4,0), (4,0), colors.HexColor("#fef3c7")),
        ("ROUNDEDCORNERS", [6]),
        ("BOX",         (0,0), (-1,-1), 1, C_GRAY_LIGHT),
        ("INNERGRID",   (0,0), (-1,-1), 0.5, C_GRAY_LIGHT),
        ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
        ("ALIGN",       (0,0), (-1,-1), "CENTER"),
    ]))
    story.append(stat_table)
    story.append(Spacer(1, 8 * mm))

    # Member cards
    story.append(Paragraph("Project Team", ParagraphStyle(
        "tm", fontName="Helvetica-Bold", fontSize=10, textColor=C_SLATE,
        alignment=TA_CENTER, spaceAfter=4
    )))
    m_cells = []
    for m in members_data:
        name = m.get("name", "")
        role = m.get("role", "")
        score = m.get("score", 0)
        rank  = m.get("rank", "-")
        mc = colors.HexColor("#b91c1c") if m["id"] == "shuvo" else (
             colors.HexColor("#1d4ed8") if m["id"] == "monami" else
             colors.HexColor("#059669"))
        m_cells.append(Paragraph(
            f'<font color="#{mc.hexval()[2:]}"><b>#{rank} {name}</b></font><br/>'
            f'<font size="8" color="#475569">{role}</font><br/>'
            f'<font size="8" color="#94a3b8">Score: {score} pts</font>',
            ParagraphStyle("mc", fontName="Helvetica", fontSize=9, alignment=TA_CENTER, leading=13)
        ))

    while len(m_cells) < 3:
        m_cells.append(Paragraph("", styles["cell"]))

    m_table = Table([m_cells], colWidths=[82*mm]*3, rowHeights=[20*mm])
    m_table.setStyle(TableStyle([
        ("BOX",        (0,0), (-1,-1), 1, C_GRAY_LIGHT),
        ("INNERGRID",  (0,0), (-1,-1), 0.5, C_GRAY_LIGHT),
        ("BACKGROUND", (0,0), (-1,-1), C_BG),
        ("VALIGN",     (0,0), (-1,-1), "MIDDLE"),
        ("ALIGN",      (0,0), (-1,-1), "CENTER"),
    ]))
    story.append(m_table)
    story.append(Spacer(1, 6 * mm))

    story.append(Paragraph(
        f"Report generated on {datetime.now().strftime('%d %B %Y at %H:%M')}  •  "
        "This document is for academic evaluation purposes only.",
        styles["footer"]
    ))
    story.append(PageBreak())
    return story


# ─── Gantt Chart Section ──────────────────────────────────────────────────────
def _build_gantt_section(styles, gantt_tasks_data, milestones_data):
    story = []
    story.append(Paragraph("📅 16-Week Gantt Chart — Project Schedule", styles["section"]))
    story.append(Paragraph(
        "RaktSeva Blood Bank &amp; Donor Management System  •  Software Project Management",
        styles["body"]
    ))
    story.append(Spacer(1, 3 * mm))

    WEEKS = list(range(1, 17))
    NUM_WEEKS = 16

    # Column widths: ID, Task, Phase, Assignee, Dur, Prog, Status, then 16 weeks
    FIXED_COLS = [10*mm, 62*mm, 22*mm, 22*mm, 10*mm, 12*mm, 17*mm]
    avail_w = PAGE_W - 2 * MARGIN - sum(FIXED_COLS)
    week_w  = avail_w / NUM_WEEKS
    COL_WIDTHS = FIXED_COLS + [week_w] * NUM_WEEKS

    # Phase legend row (merged cells spanning week columns)
    PHASE_WEEK_SPANS = [
        ("Planning",    1,  3),
        ("Design",      4,  6),
        ("Development", 5, 10),
        ("Testing",     10, 13),
        ("Deployment",  14, 16),
    ]

    # Header row 1: labels + Week W1..W16
    def wlabel(w):
        return Paragraph(f"W{w}", ParagraphStyle("wl", fontName="Helvetica-Bold",
                                                   fontSize=5.5, textColor=C_WHITE,
                                                   alignment=TA_CENTER, leading=7))
    hdr1 = [
        Paragraph("ID",       styles["header_cell"]),
        Paragraph("Task Name",styles["header_cell"]),
        Paragraph("Phase",    styles["header_cell"]),
        Paragraph("Assignee", styles["header_cell"]),
        Paragraph("Wk",       styles["header_cell"]),
        Paragraph("Prog %",   styles["header_cell"]),
        Paragraph("Status",   styles["header_cell"]),
    ] + [wlabel(w) for w in WEEKS]

    table_data = [hdr1]

    # Milestone lookup {week: milestone_title}
    ms_map = {ms["week"]: ms for ms in milestones_data}

    # Group by phase order
    phase_order = ["Planning", "Design", "Development", "Testing", "Deployment"]
    tasks_by_phase = {p: [] for p in phase_order}
    for t in gantt_tasks_data:
        if t["phase"] in tasks_by_phase:
            tasks_by_phase[t["phase"]].append(t)

    row_styles = []  # (cmd, r1, c1, r2, c2, ...)
    row_idx = 1      # header is row 0

    for phase in phase_order:
        tasks = tasks_by_phase.get(phase, [])
        if not tasks:
            continue

        ph_color  = PHASE_COLORS.get(phase, C_SLATE)
        ph_bg     = PHASE_BG.get(phase, C_BG)

        # Phase sub-header
        phase_label_row = [
            Paragraph(f"◆  {phase.upper()} PHASE",
                      ParagraphStyle("ph", fontName="Helvetica-Bold", fontSize=8,
                                     textColor=C_WHITE, leading=11)),
            "", "", "", "", "", "",
        ] + [""] * NUM_WEEKS

        table_data.append(phase_label_row)
        # Merge all columns in phase header
        row_styles.append(("SPAN",         (0, row_idx), (-1, row_idx)))
        row_styles.append(("BACKGROUND",   (0, row_idx), (-1, row_idx), ph_color))
        row_styles.append(("ROWBACKGROUND",(0, row_idx), (-1, row_idx), ph_color))
        row_idx += 1

        for task in tasks:
            t_id     = task.get("id", "")
            t_title  = task.get("title", "")
            t_phase  = task.get("phase", "")
            t_assign = task.get("assignee_id", "")
            t_dur    = task.get("duration_weeks", "")
            t_prog   = task.get("progress_pct", 0)
            t_status = task.get("status", "")
            t_start  = task.get("start_week", 1)
            t_end    = task.get("end_week", 1)

            # Status badge color
            if t_status == "Completed" or t_prog == 100:
                s_color = colors.HexColor("#059669")
                s_bg    = colors.HexColor("#d1fae5")
                s_txt   = "✓ Done"
            elif t_status == "In Progress":
                s_color = colors.HexColor("#1d4ed8")
                s_bg    = colors.HexColor("#dbeafe")
                s_txt   = "▶ Active"
            else:
                s_color = colors.HexColor("#6b7280")
                s_bg    = colors.HexColor("#f3f4f6")
                s_txt   = "◌ Pending"

            # Assignee name
            a_name  = MEMBER_NAMES.get(t_assign, t_assign or "—")
            a_color = MEMBER_COLORS.get(t_assign, C_GRAY)

            # Progress bar text
            prog_bar = f"{t_prog}%"

            # Build week cells (colored bar for task range)
            week_cells = []
            for w in WEEKS:
                if t_start <= w <= t_end:
                    week_cells.append("")  # will be colored via style
                else:
                    week_cells.append("")

            row = [
                Paragraph(t_id,    ParagraphStyle("id", fontName="Helvetica-Bold", fontSize=6.5,
                                                   textColor=ph_color, leading=9)),
                Paragraph(t_title, ParagraphStyle("tn", fontName="Helvetica", fontSize=7,
                                                   textColor=C_DARK, leading=9)),
                Paragraph(t_phase, ParagraphStyle("ph2", fontName="Helvetica", fontSize=6.5,
                                                   textColor=ph_color, leading=9)),
                Paragraph(a_name,  ParagraphStyle("an", fontName="Helvetica", fontSize=6.5,
                                                   textColor=a_color, leading=9)),
                Paragraph(str(t_dur), ParagraphStyle("dur", fontName="Helvetica-Bold", fontSize=7,
                                                      textColor=C_SLATE, alignment=TA_CENTER, leading=9)),
                Paragraph(prog_bar, ParagraphStyle("pg", fontName="Helvetica-Bold", fontSize=7,
                                                    textColor=s_color, alignment=TA_CENTER, leading=9)),
                Paragraph(s_txt,   ParagraphStyle("st", fontName="Helvetica-Bold", fontSize=6.5,
                                                   textColor=s_color, alignment=TA_CENTER, leading=9)),
            ] + week_cells

            table_data.append(row)

            # Color the Gantt bar columns
            bar_color = ph_color
            for w in WEEKS:
                col_idx = 7 + (w - 1)
                if t_start <= w <= t_end:
                    row_styles.append(("BACKGROUND", (col_idx, row_idx), (col_idx, row_idx), bar_color))
                    # Progress overlay: lighter shade for 100%
                    if t_prog == 100:
                        row_styles.append(("BACKGROUND", (col_idx, row_idx), (col_idx, row_idx),
                                           colors.HexColor("#059669")))

            row_styles.append(("BACKGROUND", (0, row_idx), (0, row_idx), ph_bg))
            row_styles.append(("BACKGROUND", (6, row_idx), (6, row_idx), s_bg))
            row_idx += 1

    # Milestone indicator rows
    ms_row = ["", Paragraph("<b>★ MILESTONES</b>",
                             ParagraphStyle("msl", fontName="Helvetica-Bold", fontSize=6.5,
                                            textColor=C_RED, leading=8)),
              "", "", "", "", ""] + ["" for _ in WEEKS]
    table_data.append(ms_row)
    row_styles.append(("BACKGROUND", (0, row_idx), (-1, row_idx), C_RED_BG))
    row_styles.append(("LINEABOVE",  (0, row_idx), (-1, row_idx), 1, C_RED))

    for ms in milestones_data:
        ms_week = ms.get("week", 1)
        ms_title = ms.get("title", "")[:48] + ("…" if len(ms.get("title","")) > 48 else "")
        ms_status = ms.get("status", "")
        ms_done   = ms.get("completed", False)
        icon = "✔" if ms_done else "◌"
        ms_data_row = [
            Paragraph(icon, ParagraphStyle("mi", fontName="Helvetica-Bold", fontSize=8,
                                            textColor=colors.HexColor("#059669") if ms_done else C_GRAY,
                                            alignment=TA_CENTER, leading=10)),
            Paragraph(ms_title, ParagraphStyle("mt", fontName="Helvetica", fontSize=6.5,
                                               textColor=C_SLATE, leading=9)),
            Paragraph(ms_status, ParagraphStyle("ms", fontName="Helvetica-Bold", fontSize=6.5,
                                                 textColor=colors.HexColor("#059669") if ms_done else C_GRAY,
                                                 leading=9)),
            "", "", "", "",
        ] + [""] * NUM_WEEKS
        # Mark the milestone week column
        col_ms = 7 + (ms_week - 1)
        table_data.append(ms_data_row)
        row_styles.append(("BACKGROUND", (col_ms, row_idx+1), (col_ms, row_idx+1), C_RED))
        row_styles.append(("SPAN",       (3, row_idx+1), (6, row_idx+1)))
        row_idx += 1

    # Build base TableStyle
    base_style = [
        # Header
        ("BACKGROUND",  (0, 0), (-1, 0), C_DARK),
        ("TEXTCOLOR",   (0, 0), (-1, 0), C_WHITE),
        ("FONTNAME",    (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, 0), 6.5),
        ("ROWHEIGHT",   (0, 0), (-1, 0), 9 * mm),
        ("ALIGN",       (0, 0), (-1, 0), "CENTER"),
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        # Grid
        ("INNERGRID",   (0, 0), (-1, -1), 0.3, C_GRAY_LIGHT),
        ("BOX",         (0, 0), (-1, -1), 0.8, C_GRAY),
        # Alternating rows (applied per task row in row_styles)
        ("ROWHEIGHT",   (0, 1), (-1, -1), 8 * mm),
        # Left-align task name col
        ("ALIGN",       (1, 1), (1, -1), "LEFT"),
        ("ALIGN",       (4, 1), (4, -1), "CENTER"),
        ("ALIGN",       (5, 1), (5, -1), "CENTER"),
        ("ALIGN",       (6, 1), (6, -1), "CENTER"),
        # Week cols center
        ("ALIGN",       (7, 0), (-1, -1), "CENTER"),
        ("LEFTPADDING",  (0,0), (-1,-1), 2),
        ("RIGHTPADDING", (0,0), (-1,-1), 2),
        ("TOPPADDING",   (0,0), (-1,-1), 2),
        ("BOTTOMPADDING",(0,0), (-1,-1), 2),
    ] + row_styles

    gantt_table = Table(table_data, colWidths=COL_WIDTHS, repeatRows=1)
    gantt_table.setStyle(TableStyle(base_style))
    story.append(gantt_table)
    story.append(PageBreak())
    return story


# ─── Modules Section ──────────────────────────────────────────────────────────
def _build_modules_section(styles, modules_data):
    story = []
    story.append(Paragraph("🧩 Major System Modules", styles["section"]))
    story.append(Spacer(1, 2 * mm))

    mod_header = [
        Paragraph("ID",          styles["header_cell"]),
        Paragraph("Module Name", styles["header_cell"]),
        Paragraph("Description", styles["header_cell"]),
        Paragraph("Lead",        styles["header_cell"]),
        Paragraph("Completion",  styles["header_cell"]),
        Paragraph("Status",      styles["header_cell"]),
    ]
    mod_rows = [mod_header]

    col_w = [12*mm, 55*mm, 110*mm, 35*mm, 24*mm, 24*mm]

    for i, mod in enumerate(modules_data):
        pct  = mod.get("completion_pct", 100)
        lead = MEMBER_NAMES.get(mod.get("lead_id",""), mod.get("lead_id",""))
        s    = mod.get("status","")
        s_color = colors.HexColor("#059669") if pct == 100 else colors.HexColor("#1d4ed8")
        bg = C_BG if i % 2 == 0 else C_WHITE

        mod_rows.append([
            Paragraph(str(mod.get("id","")), ParagraphStyle("mi2", fontName="Helvetica-Bold",
                      fontSize=8, textColor=C_RED, alignment=TA_CENTER, leading=10)),
            Paragraph(f"<b>{mod.get('name','')}</b>",
                      ParagraphStyle("mn", fontName="Helvetica-Bold", fontSize=8,
                                     textColor=C_DARK, leading=10)),
            Paragraph(mod.get("description",""),
                      ParagraphStyle("md", fontName="Helvetica", fontSize=7.5,
                                     textColor=C_GRAY_DARK, leading=10)),
            Paragraph(lead, ParagraphStyle("ml", fontName="Helvetica", fontSize=7.5,
                                            textColor=C_SLATE, alignment=TA_CENTER, leading=10)),
            Paragraph(f"<b>{pct}%</b>",
                      ParagraphStyle("mp", fontName="Helvetica-Bold", fontSize=8.5,
                                     textColor=s_color, alignment=TA_CENTER, leading=10)),
            Paragraph(s, ParagraphStyle("ms2", fontName="Helvetica-Bold", fontSize=7.5,
                                         textColor=s_color, alignment=TA_CENTER, leading=10)),
        ])

    mod_table = Table(mod_rows, colWidths=col_w, repeatRows=1)
    mod_table.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,0), C_DARK),
        ("TEXTCOLOR",    (0,0), (-1,0), C_WHITE),
        ("FONTNAME",     (0,0), (-1,0), "Helvetica-Bold"),
        ("ROWHEIGHT",    (0,0), (-1,0), 9*mm),
        ("ROWHEIGHT",    (0,1), (-1,-1), 9*mm),
        ("ALIGN",        (0,0), (-1,-1), "CENTER"),
        ("ALIGN",        (2,1), (2,-1), "LEFT"),
        ("ALIGN",        (1,1), (1,-1), "LEFT"),
        ("VALIGN",       (0,0), (-1,-1), "MIDDLE"),
        ("INNERGRID",    (0,0), (-1,-1), 0.3, C_GRAY_LIGHT),
        ("BOX",          (0,0), (-1,-1), 0.8, C_GRAY),
        ("LEFTPADDING",  (0,0), (-1,-1), 3),
        ("RIGHTPADDING", (0,0), (-1,-1), 3),
        ("TOPPADDING",   (0,0), (-1,-1), 3),
        ("BOTTOMPADDING",(0,0), (-1,-1), 3),
    ]))
    story.append(mod_table)
    story.append(PageBreak())
    return story


# ─── Member Leaderboard Section ───────────────────────────────────────────────
def _build_leaderboard_section(styles, members_data, contributions_data):
    story = []
    story.append(Paragraph("🏆 Member Contribution Leaderboard", styles["section"]))
    story.append(Spacer(1, 2 * mm))

    lb_header = [
        Paragraph("Rank",        styles["header_cell"]),
        Paragraph("Member",      styles["header_cell"]),
        Paragraph("Role",        styles["header_cell"]),
        Paragraph("Score (pts)", styles["header_cell"]),
        Paragraph("Hours",       styles["header_cell"]),
        Paragraph("Tasks Done",  styles["header_cell"]),
        Paragraph("Log Count",   styles["header_cell"]),
        Paragraph("Share %",     styles["header_cell"]),
    ]
    lb_rows = [lb_header]
    medals = ["🥇", "🥈", "🥉"]

    for m in members_data:
        rank   = m.get("rank", "-")
        medal  = medals[rank-1] if rank <= 3 else str(rank)
        name   = m.get("name","")
        role   = m.get("role","")
        score  = m.get("score", 0)
        hours  = m.get("hours", 0)
        done   = m.get("tasksCompleted", 0)
        logs   = m.get("logsCount", 0)
        pct    = m.get("percentage", 0)
        mc     = MEMBER_COLORS.get(m.get("id",""), C_SLATE)

        lb_rows.append([
            Paragraph(f"<b>{medal}</b>", ParagraphStyle("rk", fontName="Helvetica-Bold",
                      fontSize=13, alignment=TA_CENTER, leading=16)),
            Paragraph(f"<b>{name}</b>",  ParagraphStyle("nm", fontName="Helvetica-Bold",
                      fontSize=9, textColor=mc, leading=11)),
            Paragraph(role, ParagraphStyle("rl", fontName="Helvetica", fontSize=8,
                      textColor=C_GRAY_DARK, leading=10)),
            Paragraph(f"<b>{score}</b>", ParagraphStyle("sc", fontName="Helvetica-Bold",
                      fontSize=11, textColor=C_RED, alignment=TA_CENTER, leading=13)),
            Paragraph(str(round(hours,1)), ParagraphStyle("hr", fontName="Helvetica-Bold",
                      fontSize=9, textColor=C_SLATE, alignment=TA_CENTER, leading=11)),
            Paragraph(str(done), ParagraphStyle("dk", fontName="Helvetica-Bold",
                      fontSize=11, textColor=colors.HexColor("#059669"),
                      alignment=TA_CENTER, leading=13)),
            Paragraph(str(logs), ParagraphStyle("lg", fontName="Helvetica", fontSize=9,
                      textColor=C_GRAY_DARK, alignment=TA_CENTER, leading=11)),
            Paragraph(f"<b>{pct}%</b>", ParagraphStyle("pt", fontName="Helvetica-Bold",
                      fontSize=10, textColor=colors.HexColor("#7c3aed"),
                      alignment=TA_CENTER, leading=12)),
        ])

    col_w = [16*mm, 55*mm, 55*mm, 30*mm, 22*mm, 25*mm, 25*mm, 22*mm]
    lb_table = Table(lb_rows, colWidths=col_w, rowHeights=[9*mm] + [14*mm]*len(members_data))
    lb_table.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,0), C_DARK),
        ("TEXTCOLOR",    (0,0), (-1,0), C_WHITE),
        ("FONTNAME",     (0,0), (-1,0), "Helvetica-Bold"),
        ("ROWHEIGHT",    (0,0), (-1,0), 9*mm),
        ("ALIGN",        (0,0), (-1,-1), "CENTER"),
        ("ALIGN",        (1,1), (2,-1), "LEFT"),
        ("VALIGN",       (0,0), (-1,-1), "MIDDLE"),
        ("INNERGRID",    (0,0), (-1,-1), 0.3, C_GRAY_LIGHT),
        ("BOX",          (0,0), (-1,-1), 0.8, C_GRAY),
        ("BACKGROUND",   (0,1), (-1,1), colors.HexColor("#fff7ed")),  # gold
        ("BACKGROUND",   (0,2), (-1,2), colors.HexColor("#f8fafc")),  # silver
        ("BACKGROUND",   (0,3), (-1,3), colors.HexColor("#fef7ee")),  # bronze
        ("LEFTPADDING",  (0,0), (-1,-1), 4),
        ("RIGHTPADDING", (0,0), (-1,-1), 4),
        ("TOPPADDING",   (0,0), (-1,-1), 3),
        ("BOTTOMPADDING",(0,0), (-1,-1), 3),
    ]))
    story.append(lb_table)
    return story


# ─── Main Entry Point ─────────────────────────────────────────────────────────
def generate_raktseva_pdf(
    members_data: list,
    contributions_data: list,
    gantt_tasks_data: list,
    milestones_data: list,
    modules_data: list,
    summary_data: dict,
) -> io.BytesIO:
    """
    Generate a full A4 Landscape PDF report for the RaktSeva project.
    Returns a BytesIO stream ready to be streamed as HTTP response.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=18 * mm,
        bottomMargin=14 * mm,
        title="RaktSeva Blood Bank System – SPM Report",
        author="RaktSeva Project Team",
        subject="Software Project Management – Gantt Report",
    )

    styles = _make_styles()
    story  = []

    # 1. Cover page
    story += _build_cover(styles, summary_data, members_data)

    # 2. Gantt chart + milestones
    story += _build_gantt_section(styles, gantt_tasks_data, milestones_data)

    # 3. Modules table
    story += _build_modules_section(styles, modules_data)

    # 4. Leaderboard
    story += _build_leaderboard_section(styles, members_data, contributions_data)

    doc.build(story, onFirstPage=_page_header_footer, onLaterPages=_page_header_footer)
    buffer.seek(0)
    return buffer
