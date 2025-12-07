# Office Path - Workplace Accident Evaluation System

System for office workers to evaluate workplace accident reports and determine eligibility for insurance coverage.

## Project Structure

```
office_path/
├── frontend/          # React application (port 3000)
└── (uses shared backend at ../backend/)
```

## Quick Start

### 1. Start the Backend (from root)

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend runs on `http://localhost:8000`

### 2. Start the Frontend

```bash
cd office_path/frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## System Overview

### Office Worker Flow

The system guides office workers through a 7-step process to evaluate workplace accident reports:

1. **Document Upload**
   - Upload PDF accident report form
   - Upload victim's explanation
   - Optional additional documents

2. **Causal Diagram Analysis**
   - Związek przyczynowy (Causal relation)
   - Związek czasowy (Temporal relation)
   - Związek miejscowy (Spatial relation)
   - Związek funkcjonalny (Functional relation)
   - Color-coded status: Green ✓ / Yellow ⚠ / Red ✗

3. **Data Consistency Check**
   - Verifies dates, circumstances, location, victim data, witnesses, causes
   - Identifies discrepancies between documents

4. **Eligibility Assessment**
   - Decision: Approved / Rejected / Investigation Needed
   - Lists missing documents if applicable
   - Flags need for ZUS Chief Medical Officer opinion

5. **Explanation Section**
   - Detailed justification for the decision
   - Analysis breakdown
   - Legal basis references

6. **Official Statement**
   - Auto-filled with extracted data
   - Case details and victim information
   - Decision and justification
   - Officer details

7. **Accident Card**
   - Complete form per Ministry regulation (23 Jan 2022)
   - Auto-populated from extracted data
   - Export to PDF functionality

## Features

- **AI-Powered PDF Extraction** - Automatically extracts structured data from accident report PDFs
- **Auto-Fill Forms** - Extracted data auto-populates all forms
- **Color-Coded Analysis** - Visual indicators for document completeness
- **Progress Tracking** - Step-by-step workflow with progress bar
- **Responsive Design** - Works on desktop and mobile devices
- **Print Support** - Print-ready accident cards and statements

## Technical Stack

### Frontend
- React 18
- Modern CSS with gradients and animations
- Responsive design
- Fetch API for backend integration

### Backend
- FastAPI (Python)
- PDF extraction with AI
- CORS enabled for frontend communication

## API Endpoints

- `POST /upload-pdf` - Upload and extract data from PDF accident report
- `GET /health` - Health check endpoint

## Data Format

The system extracts and works with structured data including:
- Personal information (PESEL, name, address, phone)
- Accident details (date, time, location, description)
- Injury information
- Witness information
- Attachments and supporting documents

See frontend README for complete data structure.

## Legal Compliance

The system implements requirements from:
- Ustawa z dnia 30 października 2002 r. o ubezpieczeniu społecznym z tytułu wypadków przy pracy
- Rozporządzenie Ministra Rodziny i Polityki Społecznej z dnia 23 stycznia 2022 r.

## Development

### Frontend Development
```bash
cd office_path/frontend
npm start
```

### Backend Development
```bash
cd backend
uvicorn main:app --reload
```

## Environment Variables

Frontend:
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8000)

Backend:
- Configure as needed in backend documentation
