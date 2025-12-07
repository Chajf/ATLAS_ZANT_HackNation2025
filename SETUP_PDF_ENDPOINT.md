# Setup Instructions - PDF Generation Endpoint

## Summary of Changes

I've converted your standalone Python script into a FastAPI endpoint that:
1. Accepts JSON data from the frontend
2. Fills a PDF template (ZUS EWYP form)
3. Returns the filled PDF for download

## Files Modified

### Backend Files:

1. **`backend/schemas.py`**
   - Added `AccidentNotificationRequest` schema with all form fields

2. **`backend/services.py`**
   - Added `format_date()` function to convert dates
   - Added `fill_pdf_with_pymupdf()` function to fill PDF using PyMuPDF
   - Added `generate_accident_notification_pdf()` main service function

3. **`backend/main.py`**
   - Added `/generate-accident-notification` POST endpoint
   - Returns PDF file as downloadable response

4. **`backend/requirements.txt`**
   - Added `pymupdf` package

### Frontend Files:

5. **`user_path/frontend/src/components/FeedbackSection.js`**
   - Added `handleDownloadPDF()` function to call the endpoint
   - Added download PDF button with loading state
   - Added error handling and display
   - Kept existing JSON download functionality

### Documentation:

6. **`backend/PDF_GENERATION_ENDPOINT.md`**
   - Complete API documentation
   - Request/response examples
   - Setup instructions

## Installation Steps

### 1. Install Backend Dependencies

```bash
cd backend
pip install pymupdf
# or install all requirements
pip install -r requirements.txt
```

### 2. Add PDF Template

You need to place the empty ZUS EWYP form template in the backend directory:

```bash
# Place file: backend/EWYP_wypelnij_i_wydrukuj.pdf
```

**Important:** The template PDF file `EWYP_wypelnij_i_wydrukuj.pdf` must be in the `backend/` directory for the endpoint to work.

### 3. Start Backend Server

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Start Frontend (if not already running)

```bash
cd user_path/frontend
npm install  # if not done already
npm start
```

## How It Works

### User Flow:

1. User fills out the accident notification form in the frontend
2. On the final "Feedback" section, they see:
   - Summary of entered data
   - Button to download JSON (existing functionality)
   - **NEW:** Button to download filled PDF
3. When clicking "Pobierz Zawiadomienie o Wypadku (PDF)":
   - Frontend sends form data to backend
   - Backend fills the PDF template
   - PDF is returned and auto-downloaded

### Technical Flow:

```
Frontend (FeedbackSection.js)
    ↓ POST /generate-accident-notification
    ↓ JSON data (formData)
Backend (main.py)
    ↓ calls generate_accident_notification_pdf()
    ↓ (services.py)
    ↓ calls fill_pdf_with_pymupdf()
    ↓ Opens template PDF
    ↓ Fills text fields
    ↓ Marks checkboxes
    ↓ Returns PDF bytes
Frontend
    ↓ Creates blob
    ↓ Triggers download
User gets filled PDF file
```

## Environment Variables

The frontend uses the following environment variable (optional):

```bash
# In user_path/frontend/.env (create if doesn't exist)
REACT_APP_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`.

## Testing the Endpoint

### Using the Frontend:
1. Navigate through the accident notification form
2. Fill in the required information
3. Proceed to the final "Feedback" section
4. Click "📄 Pobierz Zawiadomienie o Wypadku (PDF)"

### Using cURL:
```bash
curl -X POST http://localhost:8000/generate-accident-notification \
  -H "Content-Type: application/json" \
  -d '{
    "pesel": "12345678901",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "birthDate": "1990-01-15",
    "accidentDate": "2025-12-01",
    "accidentTime": "14:30",
    "city": "Warszawa"
  }' \
  --output test_zawiadomienie.pdf
```

### Using Python:
```python
import requests

data = {
    "pesel": "12345678901",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "birthDate": "1990-01-15",
    "accidentDate": "2025-12-01"
}

response = requests.post(
    'http://localhost:8000/generate-accident-notification',
    json=data
)

if response.status_code == 200:
    with open('zawiadomienie.pdf', 'wb') as f:
        f.write(response.content)
    print("PDF downloaded successfully!")
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

## Troubleshooting

### Error: "Template PDF not found"
- Make sure `EWYP_wypelnij_i_wydrukuj.pdf` is in the `backend/` directory
- Check the filename matches exactly

### Error: "PyMuPDF is required"
- Install PyMuPDF: `pip install pymupdf`

### Frontend can't connect to backend
- Check if backend is running on port 8000
- Check CORS settings in `backend/main.py` (currently allows all origins)
- Verify `REACT_APP_API_URL` if using custom backend URL

### PDF downloads but is empty or corrupted
- Check backend logs for errors
- Verify template PDF is valid and not corrupted
- Ensure date fields are in correct format (YYYY-MM-DD)

## Key Features

✅ **Field Mapping**: All form fields from frontend are mapped to PDF fields
✅ **Date Formatting**: Automatic conversion from YYYY-MM-DD to DDMMYYYY
✅ **Checkbox Support**: Proper checkbox marking using PyMuPDF
✅ **Error Handling**: Comprehensive error messages for debugging
✅ **Loading States**: Frontend shows "Generowanie PDF..." during generation
✅ **Automatic Download**: PDF automatically downloads with timestamped filename
✅ **Polish Characters**: Full UTF-8 support for Polish text

## Next Steps (Optional Enhancements)

1. **Add validation**: Validate required fields before PDF generation
2. **Add preview**: Show PDF preview before download
3. **Multiple formats**: Support for different PDF templates
4. **Email delivery**: Option to email the PDF directly
5. **Database storage**: Save generated PDFs to database
6. **Async processing**: For large forms, use background tasks
