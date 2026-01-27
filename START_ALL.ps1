#!/usr/bin/env pwsh
# Smart Soil Monitoring System - Complete Startup Script

Write-Host "`n" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  🌱 SMART SOIL MONITORING SYSTEM - STARTUP GUIDE" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`n"

# Configuration
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$mlApiPath = Join-Path $scriptPath "Crop-Recommendation-System-Using-Machine-Learning"
$backendPath = Join-Path $scriptPath "backend"
$frontendPath = Join-Path $scriptPath "frontend"

Write-Host "📁 Paths:" -ForegroundColor Yellow
Write-Host "  ML API:    $mlApiPath" 
Write-Host "  Backend:   $backendPath"
Write-Host "  Frontend:  $frontendPath"
Write-Host "`n"

# Function to start service
function Start-Service-Window {
    param(
        [string]$Title,
        [string]$Path,
        [string]$Command
    )
    Write-Host "Starting $Title..." -ForegroundColor Cyan
    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = "powershell.exe"
    $processInfo.Arguments = "-NoExit -Command `"Set-Location '$Path'; & $Command`""
    $processInfo.UseShellExecute = $true
    $processInfo.WindowStyle = "Normal"
    [System.Diagnostics.Process]::Start($processInfo) | Out-Null
    Start-Sleep -Seconds 2
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "STEP 1: Start Services" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`n"

# Start ML API
Start-Service-Window -Title "ML API (Port 5001)" -Path $mlApiPath -Command "python ml_api.py"

# Start Backend
Start-Service-Window -Title "Backend (Port 5000)" -Path $backendPath -Command "npm start"

Write-Host "`n"
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "STEP 2: Services Started" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "✅ ML API should be running on:     http://localhost:5001" -ForegroundColor Green
Write-Host "✅ Backend should be running on:    http://localhost:5000" -ForegroundColor Green
Write-Host "`n"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "STEP 3: Access the Application" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "1. Open browser and go to:" -ForegroundColor Yellow
Write-Host "   → http://localhost:5000" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "2. Navigate to 'Crop Recommendation' page" -ForegroundColor Yellow
Write-Host "`n"

Write-Host "3. Enter soil parameters:" -ForegroundColor Yellow
Write-Host "   • Nitrogen (N):     0-100 mg/kg" -ForegroundColor Gray
Write-Host "   • Phosphorus (P):   0-100 mg/kg" -ForegroundColor Gray
Write-Host "   • Potassium (K):    0-400 mg/kg" -ForegroundColor Gray
Write-Host "   • pH:               0-14" -ForegroundColor Gray
Write-Host "   • Temperature:      0-50 °C" -ForegroundColor Gray
Write-Host "   • Humidity:         0-100 %%" -ForegroundColor Gray
Write-Host "   • Rainfall:         0-500 mm" -ForegroundColor Gray
Write-Host "`n"

Write-Host "4. Click 'Get Recommendation' button" -ForegroundColor Yellow
Write-Host "`n"

Write-Host "5. 🌾 System will suggest best crop based on ML model!" -ForegroundColor Green
Write-Host "`n"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "STEP 4: System Flow" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "Frontend (You enter data)" -ForegroundColor Cyan
Write-Host "       ↓" -ForegroundColor Green
Write-Host "Backend API (http://localhost:5000)" -ForegroundColor Cyan
Write-Host "       ↓" -ForegroundColor Green
Write-Host "ML API (http://localhost:5001)" -ForegroundColor Cyan
Write-Host "       ↓" -ForegroundColor Green
Write-Host "Machine Learning Model" -ForegroundColor Cyan
Write-Host "       ↓" -ForegroundColor Green
Write-Host "Crop Recommendation (e.g., Crop #11)" -ForegroundColor Yellow
Write-Host "`n"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "✅ SYSTEM READY!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "📌 IMPORTANT:" -ForegroundColor Yellow
Write-Host "   • Keep all service windows open" -ForegroundColor Gray
Write-Host "   • To stop a service: Press Ctrl+C in its window" -ForegroundColor Gray
Write-Host "   • To stop all: Close each window" -ForegroundColor Gray
Write-Host "`n"

Write-Host "🆘 TROUBLESHOOTING:" -ForegroundColor Yellow
Write-Host "   If backend not running:     'npm install' in backend folder" -ForegroundColor Gray
Write-Host "   If ML API not running:      'pip install -r requirements.txt'" -ForegroundColor Gray
Write-Host "   If port in use:             Check for other instances on that port" -ForegroundColor Gray
Write-Host "`n"

# Optional: Test services
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Testing Services..." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`n"

Start-Sleep -Seconds 3

$mlApiTest = $false
$backendTest = $false

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/predict" -Method POST -Body '{"N":50,"P":35,"K":180,"temperature":25,"humidity":65,"ph":6.5,"rainfall":150}' -ContentType "application/json" -ErrorAction Stop -TimeoutSec 2
    if ($response.StatusCode -ge 400 -and $response.StatusCode -lt 500) {
        $mlApiTest = $true
        Write-Host "✅ ML API is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "⏳ ML API: Still starting or checking..." -ForegroundColor Yellow
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -ErrorAction Stop -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        $backendTest = $true
        Write-Host "✅ Backend is running" -ForegroundColor Green
    }
} catch {
    Write-Host "⏳ Backend: Still starting or checking..." -ForegroundColor Yellow
}

Write-Host "`n"
if ($mlApiTest -and $backendTest) {
    Write-Host "🎉 All systems operational! Enjoy using Smart Soil Monitoring System!" -ForegroundColor Green
} else {
    Write-Host "⏳ Services are starting... Please wait a moment and refresh the browser." -ForegroundColor Yellow
}

Write-Host "`n"
