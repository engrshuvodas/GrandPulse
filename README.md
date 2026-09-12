# GrandPulse — Executive Velocity & Contribution Tracker

> High-density executive velocity, project Kanban, and peer-audited contribution tracking system built to match [Stitch Project 16172299304246968090](https://stitch.withgoogle.com/projects/16172299304246968090).

---

## ⚡ Quick Start (Windows)

Just double-click **`run.bat`** in the root directory:

```cmd
run.bat
```

This will automatically:
1. Verify Python and Node.js environments.
2. Install any missing backend Python packages or frontend `node_modules`.
3. Launch the **FastAPI backend** on `http://localhost:8000`.
4. Launch the **React + Vite frontend** on `http://localhost:5173`.
5. Open your default browser to `http://localhost:5173/`.

To stop the servers at any time, run **`stop.bat`** or close the terminal windows.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: MySQL (with seamless auto-fallback to SQLite for immediate local execution)
- **Excel Export**: Python `openpyxl` (styled multi-sheet `.xlsx` workbooks)
- **Authentication**: JWT (PyJWT) with bearer token session security
- **Design System**: Kinetic Enterprise Precision Dark Mode (`#0f131d`), Plus Jakarta Sans, Inter, Material Symbols Outlined

---

## 🌐 URLs & Endpoints

- **Frontend Application**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API**: [http://localhost:8000/](http://localhost:8000/)
- **Swagger Interactive API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Excel Ledger Export (`.xlsx`)**: [http://localhost:8000/api/export/excel](http://localhost:8000/api/export/excel)
- **CSV Data Export**: [http://localhost:8000/api/export/csv](http://localhost:8000/api/export/csv)

---

## 🔑 Pre-Seeded Accounts (for Testing)

| Username | Password | Role | Description |
|---|---|---|---|
| `shuvo` | `password123` | Lead Architect | Full-stack sprint lead (#1 / #2 rank) |
| `monami` | `password123` | Backend Lead | Systems architecture & distributed streams |
| `setu` | `password123` | UI/UX Lead | Design system tokens & interactive prototype |

*(You can also use the 1-click quick login buttons inside the application's Sign In dialog!)*