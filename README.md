# ATLAS_ZANT_HackNation2025
Project repository for ZUS Accident Notification Tool task at HackNation2025

## Overview

This system provides two distinct workflows for handling workplace accident reports:
- **User Path** - For injured workers to submit accident reports
- **Office Path** - For office workers to evaluate accident reports and determine insurance eligibility

## Project Structure

```
ATLAS_ZANT_HackNation2025/
├── backend/                    # Shared FastAPI backend
│   ├── main.py                # API endpoints
│   ├── services.py            # Business logic
│   ├── schemas.py             # Data models
│   ├── requirements.txt       # Python dependencies
│   └── ...
├── user_path/                  # User submission workflow
│   ├── frontend/              # React app for users
│   └── backend/               # User-specific backend logic
└── office_path/               # Office evaluation workflow
    └── frontend/              # React app for office workers
        ├── src/
        │   ├── App.js
        │   ├── components/    # 7-step workflow components
        │   └── config.js      # API configuration
        └── package.json
```

## Backend (FastAPI)

The backend is developed using FastAPI and Python.

### Setup
```bash
cd backend
pip install -r requirements.txt
```

### Run
```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`

## Frontend Applications

### User Path Frontend (Port 3000)
For injured workers to submit accident reports.

```bash
cd user_path/frontend
npm install
npm start
```

Available at `http://localhost:3000`

### Office Path Frontend (Port 3001)
For office workers to evaluate accident reports.

```bash
cd office_path/frontend
npm install
PORT=3001 npm start
```

Available at `http://localhost:3001`

## Office Path Features

The Office Path provides a comprehensive 7-step workflow:

1. **Document Upload** - Upload PDF accident report and supporting documents
2. **Causal Diagram** - Color-coded analysis of 4 key relationships
3. **Data Consistency** - Verify information across documents
4. **Eligibility Assessment** - Determine if case qualifies as workplace accident
5. **Explanation** - Detailed justification for decision
6. **Official Statement** - Generate official position with auto-filled data
7. **Accident Card** - Complete form per Ministry regulation (23 Jan 2022)

### Key Features:
- ✨ **AI-Powered PDF Extraction** - Automatically extracts structured data
- 📝 **Auto-Fill Forms** - Pre-populates all fields from extracted data
- 🎨 **Color-Coded Analysis** - Visual indicators (Green/Yellow/Red)
- 📊 **Progress Tracking** - Clear workflow with step indicators
- 🖨️ **Export & Print** - Print-ready documents

## API Endpoints

- `POST /upload-pdf` - Upload and extract data from PDF accident report
- `POST /evaluate-injury` - Evaluate injury description
- `GET /health` - Health check

## Quick Start (Full System)

### Terminal 1 - Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Terminal 2 - User Path Frontend
```bash
cd user_path/frontend
npm install
npm start
```

### Terminal 3 - Office Path Frontend
```bash
cd office_path/frontend
npm install
PORT=3001 npm start
```

Now you have:
- Backend API: http://localhost:8000
- User Path: http://localhost:3000
- Office Path: http://localhost:3001
