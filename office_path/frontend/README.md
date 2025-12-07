# Office Path Frontend

React application for processing workplace accident reports - Office Worker Flow.

## Features

1. **Document Upload** - Upload accident report PDF and supporting documents
2. **Causal Diagram Analysis** - Visual analysis of 4 key relationships (causal, temporal, spatial, functional)
3. **Data Consistency Check** - Verify consistency across all documents
4. **Eligibility Assessment** - Determine if case qualifies as workplace accident
5. **Explanation Section** - Detailed justification for decision
6. **Official Statement** - Generate official position with auto-filled data
7. **Accident Card** - Complete accident card per Ministry regulation (23 Jan 2022)

## Prerequisites

- Node.js (v14 or higher)
- Backend API running on port 8000

## Installation

```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm start
```

The app will open at `http://localhost:3000`

### Production Build
```bash
npm run build
```

## Backend Configuration

By default, the app connects to the backend at `http://localhost:8000`.

To change this, set the environment variable:
```bash
REACT_APP_API_URL=http://your-backend-url npm start
```

## API Integration

The application integrates with the backend `/upload-pdf` endpoint which:
- Accepts PDF accident report forms
- Extracts structured data using AI
- Returns data in a standardized format
- Auto-fills forms throughout the workflow

## Workflow Steps

1. Upload PDF accident report (required) and victim explanation (required)
2. System analyzes the document and extracts key data
3. Navigate through 7 steps to complete the accident evaluation:
   - Step 1: File Upload
   - Step 2: Causal Diagram (color-coded analysis)
   - Step 3: Data Consistency Check
   - Step 4: Eligibility Assessment
   - Step 5: Decision Explanation
   - Step 6: Official Statement
   - Step 7: Accident Card (full form)

## Color Coding

- 🟢 **Green** - Correctly filled and matches
- 🟡 **Yellow** - Partially matches, needs clarification
- 🔴 **Red** - Incomplete or doesn't match
