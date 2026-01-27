@echo off
REM Smart Soil Monitoring System - Complete Startup Script
REM This script starts ML API, Backend, and tests the system

echo.
echo ============================================================
echo  🌱 SMART SOIL MONITORING SYSTEM - STARTUP
echo ============================================================
echo.

REM Start ML API in new window
echo [1/3] Starting ML API on port 5001...
start "ML API (Port 5001)" cmd /k "cd Crop-Recommendation-System-Using-Machine-Learning && python ml_api.py"
timeout /t 3 /nobreak

REM Start Backend in new window
echo [2/3] Starting Backend on port 5000...
start "Backend (Port 5000)" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak

REM Start Frontend dev server (optional)
echo [3/3] Starting Frontend (optional - for development)...
echo Open new terminal and run: cd frontend && npm run dev
echo.

echo ============================================================
echo ✅ ALL SERVICES STARTED!
echo ============================================================
echo.
echo 📱 Frontend: http://localhost:5000
echo 🔌 Backend API: http://localhost:5000/api/*
echo 🤖 ML API: http://localhost:5001/predict
echo.
echo 🧪 Testing system in 5 seconds...
timeout /t 5 /nobreak

REM Test the system
echo.
echo Testing connections...
python -c "import requests; r1 = requests.get('http://localhost:5001/predict', timeout=2); print('✅ ML API: RUNNING' if r1.status_code == 400 else '❌ ML API: ERROR')" 2>nul || echo ❌ ML API: Not responding
python -c "import requests; r2 = requests.get('http://localhost:5000', timeout=2); print('✅ Backend: RUNNING') if r2.status_code == 200 else print('Backend response:', r2.status_code)" 2>nul || echo ❌ Backend: Not responding

echo.
echo ============================================================
echo 📝 INSTRUCTIONS
echo ============================================================
echo.
echo 1. Open browser: http://localhost:5000
echo 2. Go to "Crop Recommendation" page
echo 3. Enter soil parameters:
echo    - N (Nitrogen): 0-100 mg/kg
echo    - P (Phosphorus): 0-100 mg/kg
echo    - K (Potassium): 0-400 mg/kg
echo    - pH: 0-14
echo    - Temperature: 0-50 °C
echo    - Humidity: 0-100 %%
echo    - Rainfall: 0-500 mm
echo 4. Click "Get Recommendation"
echo 5. See crop suggestion! 🌾
echo.
echo ============================================================
echo Keep all windows open while using the system.
echo Press Ctrl+C in any window to stop that service.
echo ============================================================
echo.
pause
