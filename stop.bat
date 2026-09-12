@echo off
title Stop GrandPulse
color 0C

echo ================================================================
echo           STOPPING GRANDPULSE PROCESSES
echo ================================================================
echo.

:: Kill processes running on port 8000 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Terminating backend process on port 8000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

:: Kill processes running on port 5173 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Terminating frontend process on port 5173 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [OK] All GrandPulse background services have been stopped.
echo.
timeout /t 2 >nul
