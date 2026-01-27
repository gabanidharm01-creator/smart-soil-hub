#!/usr/bin/env python3
"""Test the complete system: Frontend → Backend → ML API"""

import requests
import json
import time

print("=" * 60)
print("🌱 SMART SOIL MONITORING SYSTEM - INTEGRATION TEST")
print("=" * 60)

# Test data
test_input = {
    "N": 50,
    "P": 35,
    "K": 180,
    "temperature": 25,
    "humidity": 65,
    "ph": 6.5,
    "rainfall": 150
}

print("\n📊 Test Input (Soil Parameters):")
print(json.dumps(test_input, indent=2))

# Test 1: ML API directly
print("\n" + "=" * 60)
print("TEST 1: ML API (Port 5001)")
print("=" * 60)
try:
    r1 = requests.post('http://localhost:5001/predict', json=test_input, timeout=5)
    if r1.status_code == 200:
        ml_result = r1.json()
        print(f"✅ ML API Working!")
        print(f"Response: {json.dumps(ml_result, indent=2)}")
    else:
        print(f"❌ ML API Error: {r1.status_code}")
        print(f"Response: {r1.text[:200]}")
except Exception as e:
    print(f"❌ ML API Error: {e}")

# Test 2: Backend API (connects to ML API)
print("\n" + "=" * 60)
print("TEST 2: Backend API (Port 5000)")
print("=" * 60)
try:
    r2 = requests.post('http://localhost:5000/api/crop-recommendation', json=test_input, timeout=5)
    if r2.status_code == 200:
        backend_result = r2.json()
        print(f"✅ Backend Working!")
        print(f"Response: {json.dumps(backend_result, indent=2)}")
    else:
        print(f"❌ Backend Error: {r2.status_code}")
        print(f"Response: {r2.text[:200]}")
except Exception as e:
    print(f"❌ Backend Error: {e}")

# Test 3: Frontend
print("\n" + "=" * 60)
print("TEST 3: Frontend (Port 5000)")
print("=" * 60)
try:
    r3 = requests.get('http://localhost:5000', timeout=5)
    if r3.status_code == 200:
        print(f"✅ Frontend Available!")
        print(f"📱 Access at: http://localhost:5000")
    else:
        print(f"❌ Frontend Error: {r3.status_code}")
except Exception as e:
    print(f"❌ Frontend Error: {e}")

print("\n" + "=" * 60)
print("✅ SYSTEM TEST COMPLETE!")
print("=" * 60)
print("\n📝 Instructions:")
print("1. Open browser: http://localhost:5000")
print("2. Go to 'Crop Recommendation' page")
print("3. Enter soil parameters")
print("4. Click 'Get Recommendation'")
print("5. See crop suggestion from ML model!")
