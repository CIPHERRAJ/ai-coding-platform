@echo off
echo ===================================================
echo Starting AI Adaptive Coding Platform (Full Stack)
echo ===================================================

:: Set the API Key
rem Environment variables are loaded from .env

:: Start Django Backend in a new window
echo Starting Django Backend...
start "Django Backend" cmd /k "python manage.py runserver"

:: Start React Frontend in a new window
echo Starting React Frontend...
cd frontend
start "React Frontend" cmd /k "npm run dev"

echo.
echo All services are launching!
echo ---------------------------------------------------
echo Backend API: http://127.0.0.1:8000
echo Frontend UI: http://localhost:5173
echo ---------------------------------------------------
echo You can close this window if you like.
pause
