@echo off
echo ===================================================
echo   AI CODING PLATFORM - ONE-CLICK DEPLOYMENT
echo ===================================================

echo.
echo [1/3] Saving and Pushing Code to GitHub...
git add .
set /p commit_msg="Enter commit message (default: 'Auto update'): " || set commit_msg=Auto update
git commit -m "%commit_msg%"
git branch -M main
git push -u origin main

echo.
echo [2/3] Building Frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed! Exiting.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Deploying to Firebase...
call firebase deploy
if %errorlevel% neq 0 (
    echo Firebase deploy failed! Exiting.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo   SUCCESS! Frontend is live. 
echo   Don't forget to 'git pull' on PythonAnywhere!
echo ===================================================
pause
