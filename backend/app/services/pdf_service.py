"""
pdf_service.py  -  RaktSeva Blood Bank Management System
A4 Landscape PDF Report using ReportLab (no emoji - proper Unicode symbols only)
Pages: Cover | Gantt Chart | System Modules | Member Leaderboard
"""

import io
from datetime import datetime, timezone
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak,
)

# ---------------------------------------------------------------------------
# COLOUR PALETTE
# ---------------------------------------------------------------------------
C_RED        = colors.HexColor("#b91c1c")
C_RED_DARK   = colors.HexColor("#7f1d1d")
C_RED_BG     = colors.HexColor("#fff1f2")
C_RED_LIGHT  = colors.HexColor("#fecaca")
C_DARK       = colors.HexColor("#1e293b")
C_SLATE      = colors.HexColor("#334155")
C_GRAY_DARK  = colors.HexColor("#475569")
C_GRAY       = colors.HexColor("#94a3b8")
C_GRAY_LIGHT = colors.HexColor("#e2e8f0")
C_WHITE      = colors.white
C_BG         = colors.HexColor("#f8fafc")
C_GREEN      = colors.HexColor("#059669")
C_GREEN_BG   = colors.HexColor("#d1fae5")
C_BLUE       = colors.HexColor("#1d4ed8")
C_BLUE_BG    = colors.HexColor("#dbeafe")
C_VIOLET     = colors.HexColor("#7c3aed")
C_AMBER      = colors.HexColor("#d97706")
C_AMBER_BG   = colors.HexColor("#fef3c7")

PHASE_COLOR = {
    "Planning":    colors.HexColor("#7c3aed"),
    "Design":      colors.HexColor("#0284c7"),
    "Development": colors.HexColor("#1d4ed8"),
    "Testing":     colors.HexColor("#059669"),
    "Deployment":  colors.HexColor("#d97706"),
}
PHASE_BG = {
    "Planning":    colors.HexColor("#ede9fe"),
    "Design":      colors.HexColor("#e0f2fe"),
    "Development": colors.HexColor("#dbeafe"),
    "Testing":     colors.HexColor("#d1fae5"),
    "Deployment":  colors.HexColor("#fef3c7"),
}
MEMBER_COLOR = {
    "shuvo":  C_RED,
    "monami": C_BLUE,
    "setu":   C_GREEN,
}
MEMBER_NAME = {
    "shuvo":  "Shuvo Das",
    "monami": "Monami Sadhu",
    "setu":   "Setu Mondol",
}

PAGE_W, PAGE_H = landscape(A4)
MARGIN = 16 * mm
PHASE_ORDER = ["Planning", "Design", "Development", "Testing", "Deployment"]

# ---------------------------------------------------------------------------
# PAGE HEADER / FOOTER (called on every page)
# ---------------------------------------------------------------------------
def _header_footer(canvas, doc):
    canvas.saveState()
    w, h = landscape(A4)

    # Red top bar
    canvas.setFillColor(C_RED)
    canvas.rect(0, h - 13 * mm, w, 13 * mm, fill=1, stroke=0)
    canvas.setFont("Helvetica-Bold", 9.5)
    canvas.setFillColor(C_WHITE)
    canvas.drawString(MARGIN, h - 8.5 * mm, "RaktSeva  |  Blood Bank & Donor Management System")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(C_RED_LIGHT)
    ts = datetime.now().strftime("%d %b %Y  %H:%M")
    canvas.drawRightString(w - MARGIN, h - 8.5 * mm, f"Generated: {ts}")

    # Light grey bottom bar
    canvas.setFillColor(C_GRAY_LIGHT)
    canvas.rect(0, 0, w, 9 * mm, fill=1, stroke=0)
    canvas.setFont("Helvetica", 6.5)
    canvas.setFillColor(C_GRAY_DARK)
    canvas.drawCentredString(
        w / 2, 3 * mm,
        "RaktSeva  |  Parul University  |  Software Project Management (SPM)  |  CONFIDENTIAL"
    )
    canvas.drawRightString(w - MARGIN, 3 * mm, f"Page {doc.page}")
    canvas.restoreState()


# ---------------------------------------------------------------------------
# HELPER STYLES
# ---------------------------------------------------------------------------
def S(name="n", font="Helvetica", size=8, color=None, bold=False,
      align=TA_LEFT, leading=None, space_after=0):
    return ParagraphStyle(
        name,
        fontName="Helvetica-Bold" if bold else font,
        fontSize=size,
        textColor=color or C_DARK,
        alignment=align,
        leading=leading or (size * 1.3),
        spaceAfter=space_after,
    )


# ---------------------------------------------------------------------------
# COVER PAGE
# ---------------------------------------------------------------------------
def _cover(summary_data, members_data):
    story = []
    story.append(Spacer(1, 18 * mm))

    # Title block
    story.append(Paragraph(
        "RaktSeva",
        S("t1", size=34, color=C_RED, bold=True, align=TA_CENTER, space_after=2)
    ))
    story.append(Paragraph(
        "Blood Bank &amp; Donor Management System",
        S("t2", size=15, color=C_SLATE, bold=True, align=TA_CENTER, space_after=2)
    ))
    story.append(Paragraph(
        "Software Project Management (SPM)  |  16-Week Academic Schedule  |  Parul University",
        S("t3", size=9, color=C_GRAY_DARK, align=TA_CENTER, space_after=8)
    ))
    story.append(HRFlowable(width="70%", thickness=2, color=C_RED,
                             hAlign="CENTER", spaceAfter=8))
    story.append(Spacer(1, 5 * mm))

    # --- Stats row ---
    total     = summary_data.get("total_tasks", 23)
    done      = summary_data.get("completed_tasks", 20)
    ratio     = summary_data.get("completed_ratio", 86.9)
    members_n = summary_data.get("active_members", 3)
    hours     = summary_data.get("total_hours", 0)

    def stat_cell(value, label, bg, fg):
        return Paragraph(
            f'<font size="18" color="#{fg.hexval()[2:]}"><b>{value}</b></font>'
            f'<br/><font size="8" color="#475569">{label}</font>',
            S("sc", align=TA_CENTER, leading=22)
        )

    stat_data = [[
        stat_cell(str(total),    "Total Tasks",  colors.HexColor("#fff1f2"), C_RED),
        stat_cell(str(done),     "Completed",    C_GREEN_BG,                 C_GREEN),
        stat_cell(f"{ratio}%",   "Progress",     C_BLUE_BG,                  C_BLUE),
        stat_cell(str(members_n),"Team Members", colors.HexColor("#ede9fe"), C_VIOLET),
        stat_cell("16",          "Weeks Total",  C_AMBER_BG,                 C_AMBER),
    ]]
    stat_tbl = Table(stat_data, colWidths=[50*mm]*5, rowHeights=[20*mm])
    stat_tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(0,0), colors.HexColor("#fff1f2")),
        ("BACKGROUND",   (1,0),(1,0), C_GREEN_BG),
        ("BACKGROUND",   (2,0),(2,0), C_BLUE_BG),
        ("BACKGROUND",   (3,0),(3,0), colors.HexColor("#ede9fe")),
        ("BACKGROUND",   (4,0),(4,0), C_AMBER_BG),
        ("INNERGRID",    (0,0),(-1,-1), 0.5, C_GRAY_LIGHT),
        ("BOX",          (0,0),(-1,-1), 1,   C_GRAY_LIGHT),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
        ("ALIGN",        (0,0),(-1,-1), "CENTER"),
        ("TOPPADDING",   (0,0),(-1,-1), 4),
        ("BOTTOMPADDING",(0,0),(-1,-1), 4),
    ]))
    story.append(stat_tbl)
    story.append(Spacer(1, 7 * mm))

    # Progress bar (visual)
    bar_w_total = 250 * mm
    filled_w    = bar_w_total * (ratio / 100)
    story.append(Paragraph(
        f"<b>Overall Project Progress: {ratio}%</b>",
        S("pb_lbl", size=8.5, color=C_SLATE, align=TA_CENTER, space_after=3)
    ))
    bar_data = [[""]]
    bar_tbl  = Table(bar_data, colWidths=[bar_w_total], rowHeights=[7*mm])
    bar_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0,0),(0,0), C_GRAY_LIGHT),
        ("BOX",        (0,0),(0,0), 0.5, C_GRAY),
    ]))
    story.append(bar_tbl)
    # We'll draw the filled part via canvas — easier to just fake with a nested table
    prog_data = [["", ""]]
    prog_tbl  = Table(prog_data,
                      colWidths=[filled_w, bar_w_total - filled_w],
                      rowHeights=[7*mm])
    prog_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0,0),(0,0), C_GREEN),
        ("BACKGROUND", (1,0),(1,0), C_GRAY_LIGHT),
        ("BOX",        (0,0),(-1,-1), 0.5, C_GRAY),
        ("TOPPADDING",    (0,0),(-1,-1), 0),
        ("BOTTOMPADDING", (0,0),(-1,-1), 0),
        ("LEFTPADDING",   (0,0),(-1,-1), 0),
        ("RIGHTPADDING",  (0,0),(-1,-1), 0),
    ]))
    # Replace the plain bar with the progress bar
    story.pop()
    story.append(prog_tbl)
    story.append(Spacer(1, 7 * mm))

    # --- Team Members ---
    story.append(Paragraph("Project Team", S("tm_h", size=9, color=C_SLATE, bold=True,
                                              align=TA_CENTER, space_after=4)))
    medals = ["#1", "#2", "#3"]
    m_cells = []
    for i, m in enumerate(members_data[:3]):
        mc = MEMBER_COLOR.get(m.get("id",""), C_SLATE)
        m_cells.append(Paragraph(
            f'<font size="11" color="#{mc.hexval()[2:]}"><b>{medals[i]}  {m.get("name","")}</b></font>'
            f'<br/><font size="7.5" color="#475569">{m.get("role","")}</font>'
            f'<br/><font size="7" color="#94a3b8">Score: {m.get("score",0)} pts  |  '
            f'Tasks: {m.get("tasksCompleted",0)} done</font>',
            S("mc", align=TA_CENTER, leading=14)
        ))
    while len(m_cells) < 3:
        m_cells.append(Paragraph("", S()))

    m_tbl = Table([m_cells], colWidths=[83*mm]*3, rowHeights=[18*mm])
    m_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0,0),(-1,-1), C_BG),
        ("BOX",        (0,0),(-1,-1), 0.8, C_GRAY_LIGHT),
        ("INNERGRID",  (0,0),(-1,-1), 0.4, C_GRAY_LIGHT),
        ("VALIGN",     (0,0),(-1,-1), "MIDDLE"),
        ("ALIGN",      (0,0),(-1,-1), "CENTER"),
        ("TOPPADDING", (0,0),(-1,-1), 4),
        ("BOTTOMPADDING",(0,0),(-1,-1), 4),
    ]))
    story.append(m_tbl)
    story.append(Spacer(1, 6 * mm))
    story.append(HRFlowable(width="60%", thickness=0.5, color=C_GRAY_LIGHT, hAlign="CENTER"))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(
        f"Report generated on {datetime.now().strftime('%d %B %Y at %H:%M')}"
        "  |  For academic evaluation purposes only",
        S("ft", size=7, color=C_GRAY, align=TA_CENTER)
    ))
    story.append(PageBreak())
    return story


# ---------------------------------------------------------------------------
# GANTT CHART PAGE
# ---------------------------------------------------------------------------
def _gantt(gantt_tasks_data, milestones_data):
    story = []
    story.append(Paragraph(
        "16-Week Gantt Chart  -  Project Schedule",
        S("gh", size=12, color=C_RED, bold=True, space_after=2)
    ))
    story.append(Paragraph(
        "RaktSeva Blood Bank & Donor Management System  |  Software Project Management (SPM)",
        S("gs", size=7.5, color=C_GRAY_DARK, space_after=4)
    ))

    WEEKS = list(range(1, 17))
    # Column widths: ID, Task Name, Phase, Assignee, Wks, Prog%, Status | W1..W16
    FIXED = [10*mm, 58*mm, 22*mm, 22*mm, 9*mm, 12*mm, 16*mm]
    avail = PAGE_W - 2*MARGIN - sum(FIXED)
    wk_w  = avail / 16
    COL_W = FIXED + [wk_w]*16

    # ── Header row ──────────────────────────────────────────────────────────
    def hcell(txt):
        return Paragraph(txt, S("hc", size=6.5, color=C_WHITE, bold=True,
                                 align=TA_CENTER, leading=9))

    hdr = [hcell("ID"), hcell("Task Name"), hcell("Phase"), hcell("Assignee"),
           hcell("Wk"), hcell("Prog%"), hcell("Status")] + \
          [Paragraph(f"W{w}", S("wh", size=5.5, color=C_WHITE, bold=True,
                                align=TA_CENTER, leading=7)) for w in WEEKS]

    rows     = [hdr]
    rstyles  = []   # extra per-cell styles
    row_idx  = 1    # header = 0

    tasks_by_phase = {p: [] for p in PHASE_ORDER}
    for t in gantt_tasks_data:
        if t["phase"] in tasks_by_phase:
            tasks_by_phase[t["phase"]].append(t)

    for phase in PHASE_ORDER:
        tasks = tasks_by_phase.get(phase, [])
        if not tasks:
            continue
        pc = PHASE_COLOR[phase]
        pb = PHASE_BG[phase]

        # Phase header row (spans all cols)
        ph_row = [Paragraph(
            f"  {phase.upper()} PHASE",
            S("phr", size=7.5, color=C_WHITE, bold=True, leading=10)
        )] + [""]*( len(COL_W)-1 )
        rows.append(ph_row)
        rstyles += [
            ("SPAN",       (0, row_idx), (-1, row_idx)),
            ("BACKGROUND", (0, row_idx), (-1, row_idx), pc),
            ("ROWHEIGHT",  (0, row_idx), (-1, row_idx), 8*mm),
        ]
        row_idx += 1

        for t in tasks:
            tid    = t.get("id","")
            ttitle = t.get("title","")
            tphase = t.get("phase","")
            tassig = MEMBER_NAME.get(t.get("assignee_id",""), t.get("assignee_id","") or "-")
            tdur   = t.get("duration_weeks","")
            tprog  = t.get("progress_pct", 0)
            tstat  = t.get("status","")
            tstart = t.get("start_week", 1)
            tend   = t.get("end_week", 1)
            ac     = MEMBER_COLOR.get(t.get("assignee_id",""), C_GRAY)

            if tstat == "Completed" or tprog == 100:
                sc, sbg, stxt = C_GREEN, C_GREEN_BG, "Done"
            elif tstat == "In Progress":
                sc, sbg, stxt = C_BLUE, C_BLUE_BG, "Active"
            else:
                sc, sbg, stxt = C_GRAY, colors.HexColor("#f1f5f9"), "Pending"

            bar_color = C_GREEN if tprog == 100 else pc

            week_cells = [""] * 16

            row = [
                Paragraph(tid,
                          S("id_s", size=6.5, color=pc, bold=True, leading=9)),
                Paragraph(ttitle,
                          S("tt_s", size=6.5, color=C_DARK, leading=9)),
                Paragraph(tphase,
                          S("ph_s", size=6, color=pc, leading=8)),
                Paragraph(tassig,
                          S("as_s", size=6, color=ac, leading=8)),
                Paragraph(str(tdur),
                          S("du_s", size=7, color=C_SLATE, bold=True,
                            align=TA_CENTER, leading=9)),
                Paragraph(f"{tprog}%",
                          S("pg_s", size=7, color=sc, bold=True,
                            align=TA_CENTER, leading=9)),
                Paragraph(stxt,
                          S("st_s", size=6.5, color=sc, bold=True,
                            align=TA_CENTER, leading=9)),
            ] + week_cells

            rows.append(row)

            # Gantt bar colours
            for w in WEEKS:
                ci = 7 + (w - 1)
                if tstart <= w <= tend:
                    rstyles.append(("BACKGROUND", (ci, row_idx), (ci, row_idx), bar_color))

            rstyles += [
                ("BACKGROUND", (0,  row_idx), (0,  row_idx), pb),
                ("BACKGROUND", (6,  row_idx), (6,  row_idx), sbg),
                ("ROWHEIGHT",  (0,  row_idx), (-1, row_idx), 7.5*mm),
            ]
            row_idx += 1

    # ── Milestone sub-row ───────────────────────────────────────────────────
    ms_hdr = [Paragraph("MILESTONES",
                         S("ms_h", size=6.5, color=C_RED, bold=True, leading=9)),
              Paragraph("", S())] + [""]*( len(COL_W)-2 )
    rows.append(ms_hdr)
    rstyles += [
        ("BACKGROUND", (0, row_idx), (-1, row_idx), C_RED_BG),
        ("LINEABOVE",  (0, row_idx), (-1, row_idx), 1.2, C_RED),
        ("SPAN",       (1, row_idx), (-1, row_idx)),
        ("ROWHEIGHT",  (0, row_idx), (-1, row_idx), 7*mm),
    ]
    row_idx += 1

    for ms in milestones_data:
        mw     = ms.get("week", 1)
        mtitle = ms.get("title", "")
        mdone  = ms.get("completed", False)
        mstat  = ms.get("status","")
        icon   = "v" if mdone else "o"
        mc_clr = C_GREEN if mdone else C_GRAY
        ms_row = [
            Paragraph(icon, S("mi", size=8, color=mc_clr, bold=True,
                               align=TA_CENTER, leading=10)),
            Paragraph(f"W{mw}: {mtitle[:60]}{'...' if len(mtitle)>60 else ''}",
                      S("mt", size=6.5, color=C_SLATE, leading=9)),
            Paragraph(mstat, S("ms2", size=6.5, color=mc_clr, bold=True, leading=9)),
        ] + [""]*( len(COL_W)-3 )
        rows.append(ms_row)
        col_ms = 7 + (mw - 1)
        rstyles += [
            ("BACKGROUND", (col_ms, row_idx), (col_ms, row_idx), C_RED),
            ("SPAN",       (2, row_idx), (6, row_idx)),
            ("SPAN",       (7, row_idx), (-1, row_idx)),
            ("ROWHEIGHT",  (0, row_idx), (-1, row_idx), 7*mm),
        ]
        row_idx += 1

    # ── Base table style ────────────────────────────────────────────────────
    base = [
        ("BACKGROUND",   (0,0), (-1,0), C_DARK),
        ("ROWHEIGHT",    (0,0), (-1,0), 9*mm),
        ("VALIGN",       (0,0), (-1,-1), "MIDDLE"),
        ("ALIGN",        (0,0), (-1, 0), "CENTER"),
        ("ALIGN",        (4,1), (6,-1), "CENTER"),
        ("ALIGN",        (7,0), (-1,-1), "CENTER"),
        ("INNERGRID",    (0,0), (-1,-1), 0.25, C_GRAY_LIGHT),
        ("BOX",          (0,0), (-1,-1), 0.8,  C_GRAY),
        ("LEFTPADDING",  (0,0), (-1,-1), 2),
        ("RIGHTPADDING", (0,0), (-1,-1), 2),
        ("TOPPADDING",   (0,0), (-1,-1), 1),
        ("BOTTOMPADDING",(0,0), (-1,-1), 1),
    ] + rstyles

    gantt_tbl = Table(rows, colWidths=COL_W, repeatRows=1)
    gantt_tbl.setStyle(TableStyle(base))
    story.append(gantt_tbl)
    story.append(PageBreak())
    return story


# ---------------------------------------------------------------------------
# SYSTEM MODULES PAGE
# ---------------------------------------------------------------------------
def _modules(modules_data):
    story = []
    story.append(Paragraph(
        "System Modules  -  RaktSeva Blood Bank",
        S("mh", size=12, color=C_RED, bold=True, space_after=2)
    ))
    story.append(Spacer(1, 3*mm))

    HDR = [
        Paragraph(h, S("hc2", size=7, color=C_WHITE, bold=True, align=TA_CENTER, leading=9))
        for h in ["ID", "Module Name", "Description", "Lead", "Complete%", "Status"]
    ]
    COL_W = [10*mm, 50*mm, 115*mm, 35*mm, 22*mm, 22*mm]
    rows = [HDR]
    mstyles = []

    for i, mod in enumerate(modules_data):
        pct  = mod.get("completion_pct", 100)
        lead = MEMBER_NAME.get(mod.get("lead_id",""), mod.get("lead_id","") or "-")
        stat = mod.get("status","")
        sc   = C_GREEN if pct >= 100 else (C_BLUE if pct > 0 else C_GRAY)
        bg   = C_BG if i%2==0 else C_WHITE

        rows.append([
            Paragraph(str(mod.get("id","")),
                      S("mi3", size=8, color=C_RED, bold=True, align=TA_CENTER, leading=10)),
            Paragraph(f"<b>{mod.get('name','')}</b>",
                      S("mn", size=8, color=C_DARK, leading=10)),
            Paragraph(mod.get("description",""),
                      S("md", size=7.5, color=C_GRAY_DARK, leading=10)),
            Paragraph(lead,
                      S("ml", size=7.5, color=C_SLATE, align=TA_CENTER, leading=10)),
            Paragraph(f"<b>{pct}%</b>",
                      S("mp", size=9, color=sc, bold=True, align=TA_CENTER, leading=11)),
            Paragraph(stat,
                      S("ms3", size=7.5, color=sc, bold=True, align=TA_CENTER, leading=10)),
        ])
        mstyles.append(("BACKGROUND", (0,i+1),(-1,i+1), bg))

    mod_tbl = Table(rows, colWidths=COL_W, repeatRows=1)
    mod_tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,0), C_DARK),
        ("ROWHEIGHT",    (0,0),(-1,0), 9*mm),
        ("ROWHEIGHT",    (0,1),(-1,-1), 9*mm),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
        ("ALIGN",        (0,0),(-1, 0), "CENTER"),
        ("ALIGN",        (0,1),(0,-1), "CENTER"),
        ("ALIGN",        (3,1),(5,-1), "CENTER"),
        ("INNERGRID",    (0,0),(-1,-1), 0.3, C_GRAY_LIGHT),
        ("BOX",          (0,0),(-1,-1), 0.8, C_GRAY),
        ("LEFTPADDING",  (0,0),(-1,-1), 3),
        ("RIGHTPADDING", (0,0),(-1,-1), 3),
        ("TOPPADDING",   (0,0),(-1,-1), 3),
        ("BOTTOMPADDING",(0,0),(-1,-1), 3),
    ] + mstyles))
    story.append(mod_tbl)
    story.append(PageBreak())
    return story


# ---------------------------------------------------------------------------
# MEMBER LEADERBOARD PAGE
# ---------------------------------------------------------------------------
def _leaderboard(members_data, contributions_data):
    story = []
    story.append(Paragraph(
        "Member Contribution Leaderboard",
        S("lh", size=12, color=C_RED, bold=True, space_after=2)
    ))
    story.append(Spacer(1, 3*mm))

    HDR = [
        Paragraph(h, S("hcl", size=7.5, color=C_WHITE, bold=True, align=TA_CENTER, leading=10))
        for h in ["Rank", "Member", "Role", "Score (pts)", "Hours", "Tasks Done",
                  "Log Count", "Share %"]
    ]
    COL_W = [16*mm, 55*mm, 60*mm, 32*mm, 22*mm, 25*mm, 25*mm, 22*mm]
    rows = [HDR]
    medals = ["1st", "2nd", "3rd"]
    row_bgs = [
        colors.HexColor("#fff7ed"),   # gold
        colors.HexColor("#f8fafc"),   # silver
        colors.HexColor("#fef7ee"),   # bronze
    ]

    for idx, m in enumerate(members_data):
        rank  = m.get("rank", idx+1)
        medal = medals[rank-1] if rank <= 3 else str(rank)
        name  = m.get("name","")
        role  = m.get("role","")
        score = m.get("score", 0)
        hours = m.get("hours", 0)
        done  = m.get("tasksCompleted", 0)
        logs  = m.get("logsCount", 0)
        pct   = m.get("percentage", 0)
        mc    = MEMBER_COLOR.get(m.get("id",""), C_SLATE)
        bg    = row_bgs[idx] if idx < 3 else C_WHITE

        rows.append([
            Paragraph(f"<b>{medal}</b>",
                      S("rk", size=10, color=C_AMBER, bold=True, align=TA_CENTER, leading=13)),
            Paragraph(f"<b>{name}</b>",
                      S("nm", size=9.5, color=mc, bold=True, leading=12)),
            Paragraph(role,
                      S("rl", size=8, color=C_GRAY_DARK, leading=10)),
            Paragraph(f"<b>{score}</b>",
                      S("sc2", size=12, color=C_RED, bold=True, align=TA_CENTER, leading=15)),
            Paragraph(str(round(hours,1)),
                      S("hr", size=9, color=C_SLATE, align=TA_CENTER, leading=11)),
            Paragraph(f"<b>{done}</b>",
                      S("dk", size=11, color=C_GREEN, bold=True, align=TA_CENTER, leading=13)),
            Paragraph(str(logs),
                      S("lg", size=9, color=C_GRAY_DARK, align=TA_CENTER, leading=11)),
            Paragraph(f"<b>{pct}%</b>",
                      S("pt", size=10, color=C_VIOLET, bold=True, align=TA_CENTER, leading=12)),
        ])
        # row background
        rows[-1]  # just reference; applied via style below

    lb_tbl = Table(rows, colWidths=COL_W,
                   rowHeights=[9*mm] + [16*mm]*len(members_data))
    lb_style = [
        ("BACKGROUND",   (0,0),(-1,0), C_DARK),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
        ("ALIGN",        (0,0),(-1, 0), "CENTER"),
        ("ALIGN",        (1,1),(2,-1), "LEFT"),
        ("ALIGN",        (3,1),(3,-1), "CENTER"),
        ("ALIGN",        (4,1),(7,-1), "CENTER"),
        ("INNERGRID",    (0,0),(-1,-1), 0.3, C_GRAY_LIGHT),
        ("BOX",          (0,0),(-1,-1), 0.8, C_GRAY),
        ("LEFTPADDING",  (0,0),(-1,-1), 4),
        ("RIGHTPADDING", (0,0),(-1,-1), 4),
        ("TOPPADDING",   (0,0),(-1,-1), 3),
        ("BOTTOMPADDING",(0,0),(-1,-1), 3),
    ]
    for i, bg in enumerate(row_bgs):
        lb_style.append(("BACKGROUND", (0, i+1), (-1, i+1), bg))

    lb_tbl.setStyle(TableStyle(lb_style))
    story.append(lb_tbl)
    return story


# ---------------------------------------------------------------------------
# MAIN ENTRY POINT
# ---------------------------------------------------------------------------
def generate_raktseva_pdf(
    members_data: list,
    contributions_data: list,
    gantt_tasks_data: list,
    milestones_data: list,
    modules_data: list,
    summary_data: dict,
) -> io.BytesIO:
    """
    Generate A4 Landscape PDF for RaktSeva SPM project.
    Returns BytesIO ready for StreamingResponse.
    """
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=landscape(A4),
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=17*mm,
        bottomMargin=13*mm,
        title="RaktSeva Blood Bank System - SPM Gantt Report",
        author="RaktSeva Project Team",
        subject="Software Project Management - Gantt Schedule",
    )

    story = []
    story += _cover(summary_data, members_data)
    story += _gantt(gantt_tasks_data, milestones_data)
    story += _modules(modules_data)
    story += _leaderboard(members_data, contributions_data)

    doc.build(story, onFirstPage=_header_footer, onLaterPages=_header_footer)
    buf.seek(0)
    return buf
