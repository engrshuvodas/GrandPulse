@echo off
title GrandPulse Launcher
color 0B

echo ================================================================
echo           GRANDPULSE - TEAM CONTRIBUTION TRACKER
echo           Executive Velocity & Attribution Console
echo ================================================================
echo.

cd /d "%~dp0"

:: 1. Check Python
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ and add it to PATH.
    pause
    exit /b 1
)

:: 2. Check Node / npm
where npm.cmd >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js / npm is not installed or not in PATH!
    echo Please install Node.js 18+ from https://nodejs.org.
    pause
    exit /b 1
)

:: 3. Check Backend Dependencies
echo [1/4] Checking Python dependencies...
python -c "import fastapi, uvicorn, openpyxl, jwt, sqlalchemy" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Installing backend dependencies from requirements.txt...
    cd /d "%~dp0backend"
    pip install -r requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install backend dependencies.
        pause
        exit /b 1
    )
    cd /d "%~dp0"
)
echo [OK] Backend environment ready.
echo.

:: 4. Check Frontend Dependencies
echo [2/4] Checking Frontend node_modules...
if not exist "%~dp0frontend\node_modules" (
    echo [INFO] Installing frontend npm packages...
    cd /d "%~dp0frontend"
    call npm.cmd install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install frontend packages.
        pause
        exit /b 1
    )
    cd /d "%~dp0"
)
echo [OK] Frontend environment ready.
echo.

:: 5. Launch Backend Server
echo [3/4] Starting FastAPI Backend on http://localhost:8000 ...
start "GrandPulse Backend (FastAPI)" cmd /c "cd /d "%~dp0backend" && python run.py"

:: Wait 2 seconds for backend initialization
timeout /t 2 /nobreak >nul

:: 6. Launch Frontend Dev Server
echo [4/4] Starting Vite Frontend on http://localhost:5173 ...
start "GrandPulse Frontend (Vite)" cmd /c "cd /d "%~dp0frontend" && npm.cmd run dev"

:: Wait 2 seconds and launch browser
timeout /t 2 /nobreak >nul
start http://localhost:5173/

echo.
echo ================================================================
echo   GrandPulse is now running!
echo.
echo   * Frontend UI:   http://localhost:5173/
echo   * Backend API:  http://localhost:8000/
echo   * API Docs:     http://localhost:8000/docs
echo   * Excel Export: http://localhost:8000/api/export/excel
echo ================================================================
echo.
echo Leave this window open, or close it when done.
echo To stop servers, close the backend and frontend command windows.
echo.
pause
