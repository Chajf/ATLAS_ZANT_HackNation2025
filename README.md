# ATLAS_ZANT_HackNation2025
Project repository for ZUS Accident Notification Tool task at HackNation2025

## Project Structure

```
my-project/
   ├── backend/
   │   ├── main.py
   │   └── requirements.txt
   └── frontend/
       ├── src/
       │   ├── App.js
       │   └── index.js
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

## Frontend (React)

The frontend is a React web application.

### Setup
```bash
cd frontend
npm install
```

### Run
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`
