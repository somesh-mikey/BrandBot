@echo off
echo Starting BrandBot Frontend and Backend Servers...
echo.

echo Starting Backend Server...
start "BrandBot Backend" cmd /k "cd brandbot-backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "BrandBot Frontend" cmd /k "cd brandbot-frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: https://brandbot.onrender.com
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul

