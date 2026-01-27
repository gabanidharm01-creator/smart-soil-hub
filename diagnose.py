#!/usr/bin/env python3
"""
Smart Soil Monitoring System - Diagnostic & Troubleshooting Tool
This script checks all system components and helps fix issues.
"""

import subprocess
import os
import sys
import time
import socket

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'

def print_header(text):
    print(f"\n{Colors.CYAN}{'='*60}{Colors.RESET}")
    print(f"{Colors.CYAN}{text}{Colors.RESET}")
    print(f"{Colors.CYAN}{'='*60}{Colors.RESET}\n")

def print_success(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.RESET}")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.RESET}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.RESET}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.RESET}")

def check_port(host, port):
    """Check if a port is accessible"""
    try:
        socket.create_connection((host, port), timeout=2)
        return True
    except (socket.timeout, socket.error):
        return False

def check_file_exists(path):
    """Check if a file exists"""
    return os.path.exists(path)

def run_command(cmd, shell=False):
    """Run a command and return output"""
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, shell=shell, timeout=5)
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timeout"
    except Exception as e:
        return False, "", str(e)

print_header("🌱 SMART SOIL MONITORING SYSTEM - DIAGNOSTIC TOOL")

# 1. Check Python
print_info("Checking Python installation...")
success, stdout, stderr = run_command([sys.executable, "--version"])
if success:
    print_success(f"Python: {stdout.strip()}")
else:
    print_error("Python not found")
    sys.exit(1)

# 2. Check Node.js
print_info("Checking Node.js installation...")
success, stdout, stderr = run_command(["node", "--version"])
if success:
    print_success(f"Node.js: {stdout.strip()}")
else:
    print_error("Node.js not found - Install from https://nodejs.org")

# 3. Check npm
print_info("Checking npm installation...")
success, stdout, stderr = run_command(["npm", "--version"])
if success:
    print_success(f"npm: {stdout.strip()}")
else:
    print_error("npm not found")

# 4. Check Python packages
print_header("Python Dependencies Check")

required_packages = ['flask', 'numpy', 'scikit-learn']
missing_packages = []

for package in required_packages:
    try:
        __import__(package)
        print_success(f"  {package} ✓")
    except ImportError:
        print_error(f"  {package} ✗")
        missing_packages.append(package)

if missing_packages:
    print_warning(f"\nMissing packages: {', '.join(missing_packages)}")
    print_info("Fix: Run this in Crop-Recommendation-System-Using-Machine-Learning folder:")
    print(f"{Colors.CYAN}pip install -r requirements.txt{Colors.RESET}\n")

# 5. Check ML API files
print_header("ML API Files Check")

ml_api_dir = "Crop-Recommendation-System-Using-Machine-Learning"
ml_files = {
    "ml_api.py": "Flask server",
    "model.pkl": "ML model",
    "minmaxscaler.pkl": "Min-Max scaler",
    "standscaler.pkl": "Standard scaler",
    "requirements.txt": "Dependencies"
}

for file, description in ml_files.items():
    path = os.path.join(ml_api_dir, file)
    if check_file_exists(path):
        print_success(f"  {file} ({description})")
    else:
        print_error(f"  {file} ({description}) - NOT FOUND")

# 6. Check Backend files
print_header("Backend Files Check")

backend_dir = "backend"
backend_files = {
    "server.js": "Express server",
    "package.json": "Dependencies",
    ".env": "Configuration"
}

for file, description in backend_files.items():
    path = os.path.join(backend_dir, file)
    if check_file_exists(path):
        print_success(f"  {file} ({description})")
    else:
        print_warning(f"  {file} ({description}) - Optional or missing")

# 7. Check Frontend files
print_header("Frontend Files Check")

frontend_dir = "frontend"
frontend_files = {
    "package.json": "Dependencies",
    "src/pages/CropRecommendation.tsx": "Main page",
    "dist/index.html": "Built frontend (needed for production)"
}

for file, description in frontend_files.items():
    path = os.path.join(frontend_dir, file)
    if check_file_exists(path):
        print_success(f"  {file} ({description})")
    else:
        if "dist" in file:
            print_warning(f"  {file} ({description}) - Build needed: npm run build")
        else:
            print_error(f"  {file} ({description}) - NOT FOUND")

# 8. Check ports
print_header("Port Availability Check")

ports_to_check = {
    5001: "ML API (Python)",
    5000: "Backend (Node.js)"
}

for port, service in ports_to_check.items():
    if check_port("127.0.0.1", port):
        print_info(f"Port {port} ({service}): Already in use")
    else:
        print_success(f"Port {port} ({service}): Available")

# 9. Recommendations
print_header("📋 RECOMMENDATIONS")

print(f"""{Colors.YELLOW}
If you haven't started the system yet:

Option 1 (Easiest - Windows):
  1. Double-click: START_ALL.bat

Option 2 (PowerShell):
  1. Run: .\\START_ALL.ps1

Option 3 (Manual - 3 terminals):
  Terminal 1: cd Crop-Recommendation-System-Using-Machine-Learning && python ml_api.py
  Terminal 2: cd backend && npm install && npm start
  Terminal 3: Open http://localhost:5000 in browser

If services aren't responding:

1. ML API issues:
   → cd Crop-Recommendation-System-Using-Machine-Learning
   → pip install -r requirements.txt
   → python ml_api.py

2. Backend issues:
   → cd backend
   → npm install
   → npm start

3. Port conflicts:
   → Check: netstat -ano | findstr :5000 (or :5001)
   → Kill process if needed
   → Or change PORT in backend/.env

4. Frontend issues:
   → cd frontend
   → npm install
   → npm run build
   → Then backend will serve it at http://localhost:5000

{Colors.RESET}""")

# 10. Summary
print_header("✅ DIAGNOSTIC COMPLETE")
print_info("For detailed setup instructions, read: SETUP_GUIDE.md")
print_info("For API documentation, check: README.md")
print()
