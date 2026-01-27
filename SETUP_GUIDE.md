# 🌱 Smart Soil Monitoring System - Setup & Usage Guide

## 📋 System Overview

This Smart Soil Monitoring System uses **Machine Learning** to recommend the best crop based on soil parameters.

```
Frontend (React) → Backend (Node.js) → ML API (Python Flask) → ML Model
     Port 5000              Port 5000                Port 5001
```

## ✅ Prerequisites

- **Node.js** (v14+) - For backend and frontend
- **Python** (3.8+) - For ML API
- **pip** - Python package manager

## 🚀 Quick Start

### Option 1: Windows Batch File (Easiest)
```bash
# Double-click this file:
START_ALL.bat
```

### Option 2: PowerShell
```powershell
# Run in PowerShell:
.\START_ALL.ps1
```

### Option 3: Manual (3 Terminals)

**Terminal 1 - ML API (Python):**
```bash
cd Crop-Recommendation-System-Using-Machine-Learning
pip install -r requirements.txt
python ml_api.py
# Expected: Running on http://127.0.0.1:5001
```

**Terminal 2 - Backend (Node.js):**
```bash
cd backend
npm install
npm start
# Expected: 🚀 Backend running on port 5000
```

**Terminal 3 - Frontend (React):**
```bash
cd frontend
npm install
npm run dev
# OR access at http://localhost:5000 (served by backend)
```

## 🌐 Access the Application

Once all services are running:

1. **Open browser:** http://localhost:5000
2. **Navigate to:** Crop Recommendation page
3. **Enter soil parameters:**
   - **N (Nitrogen):** 0-100 mg/kg
   - **P (Phosphorus):** 0-100 mg/kg
   - **K (Potassium):** 0-400 mg/kg
   - **pH:** 0-14 (acidic to alkaline)
   - **Temperature:** 0-50 °C
   - **Humidity:** 0-100 %
   - **Rainfall:** 0-500 mm

4. **Click "Get Recommendation"** to see suggested crop!

## 🧪 Test the System

### Test ML API Directly
```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"N": 50, "P": 35, "K": 180, "temperature": 25, "humidity": 65, "ph": 6.5, "rainfall": 150}'

# Response: {"recommended_crop": "11"}
```

### Test Backend API
```bash
curl -X POST http://localhost:5000/api/crop-recommendation \
  -H "Content-Type: application/json" \
  -d '{"N": 50, "P": 35, "K": 180, "temperature": 25, "humidity": 65, "ph": 6.5, "rainfall": 150}'
```

### Run Automated Test
```bash
python test_system.py
```

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | `cd backend && npm install && npm start` |
| ML API won't start | `cd Crop-Recommendation-System-Using-Machine-Learning && pip install -r requirements.txt` |
| Port 5000 already in use | Change PORT in `backend/.env` or kill process: `netstat -ano \| findstr :5000` |
| Port 5001 already in use | Modify `ml_api.py` line: `app.run(port=5002)` |
| Firewall blocking | Use `127.0.0.1` instead of `localhost` |
| CORS errors | Check backend CORS configuration in `server.js` |

## 📁 Project Structure

```
smart-soil-hub/
├── frontend/                    # React UI
│   ├── src/
│   │   ├── pages/CropRecommendation.tsx
│   │   └── lib/geminiApi.ts
│   └── dist/                    # Built frontend (served by backend)
│
├── backend/                     # Node.js Express Server
│   ├── server.js               # Main server file
│   ├── .env                    # Configuration
│   └── package.json
│
├── Crop-Recommendation-System-Using-Machine-Learning/  # Python ML API
│   ├── ml_api.py               # Flask server
│   ├── model.pkl               # ML model
│   ├── minmaxscaler.pkl        # Data scaler
│   ├── standscaler.pkl         # Standard scaler
│   └── requirements.txt        # Python dependencies
│
├── START_ALL.bat               # Windows startup (batch)
├── START_ALL.ps1               # Windows startup (PowerShell)
└── test_system.py              # System integration test
```

## 🔌 API Endpoints

### Backend API (Node.js - Port 5000)

**POST /api/crop-recommendation**
```json
Request:
{
  "N": 50,
  "P": 35,
  "K": 180,
  "temperature": 25,
  "humidity": 65,
  "ph": 6.5,
  "rainfall": 150
}

Response:
{
  "recommended_crop": "11",
  "success": true
}
```

**POST /api/chat** (Gemini AI Chatbot)
```json
Request:
{
  "message": "Tell me about rice farming"
}

Response:
{
  "reply": "Rice farming is..."
}
```

### ML API (Python - Port 5001)

**POST /predict**
```json
Request:
{
  "N": 50,
  "P": 35,
  "K": 180,
  "temperature": 25,
  "humidity": 65,
  "ph": 6.5,
  "rainfall": 150
}

Response:
{
  "recommended_crop": "11"
}
```

## 📚 ML Model Details

- **Model Type:** Naive Bayes Classifier
- **Training Data:** Crop recommendation dataset
- **Input Features:** N, P, K, Temperature, Humidity, pH, Rainfall
- **Output:** Crop ID (numeric)
- **Scalers:** MinMaxScaler + StandardScaler (for preprocessing)

## 🔐 Environment Variables

**backend/.env:**
```
PORT=5000
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=development
```

## 📝 Development

### Building Frontend
```bash
cd frontend
npm run build
# Output: dist/ folder (served by backend on port 5000)
```

### Running Frontend in Dev Mode
```bash
cd frontend
npm run dev
# Hot reload on port 5173 (during development)
```

### Running Backend in Dev Mode (with auto-reload)
```bash
cd backend
npm run dev
# Uses nodemon for auto-reload
```

## 🌟 Features

- ✅ **Machine Learning Crop Recommendation** - Based on soil parameters
- ✅ **AI Chatbot** - Powered by Google Gemini
- ✅ **Interactive Dashboard** - Real-time sensor visualization
- ✅ **Multi-language Support** - English, Spanish, French, etc.
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Integrated Backend** - Single Node.js server for API + frontend

## 🐛 Known Issues

- Scikit-learn version warning (non-critical) - Can be updated in requirements.txt
- First request may be slow due to model loading

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review server logs in each terminal
3. Ensure all dependencies are installed: `pip install -r requirements.txt` and `npm install`

## 🎉 Success Indicators

✅ ML API running: `http://localhost:5001` responds with crop recommendations
✅ Backend running: `http://localhost:5000` serves frontend
✅ Frontend accessible: Can enter crop recommendation form
✅ Full flow: Input parameters → Get crop suggestion

---

**Happy farming! 🌾**
