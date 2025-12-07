# DOCX Endpoint Setup - Summary

## What Was Done

I've created a new FastAPI endpoint to generate filled DOCX documents (Zapis wyjaśnień poszkodowanego) from form data and integrated it with the frontend.

---

## 📋 Changes Summary

### Backend Changes:

#### 1. **`backend/schemas.py`**
- Added `InjuredStatementRequest` schema containing all fields for the injured person's statement form

#### 2. **`backend/services.py`**
- Added `replace_placeholders_in_paragraph()` - Replaces `{{placeholder}}` in Word paragraphs
- Added `replace_placeholders_in_tables()` - Replaces placeholders in Word tables
- Added `generate_injured_statement_docx()` - Main service function that:
  - Loads DOCX template
  - Maps form data to placeholder values
  - Replaces all placeholders
  - Returns filled DOCX as bytes

#### 3. **`backend/main.py`**
- Added `/generate-injured-statement` POST endpoint
- Returns DOCX file with proper headers for download

#### 4. **`backend/requirements.txt`**
- Added `python-docx` dependency

### Frontend Changes:

#### 5. **`user_path/frontend/src/components/ExplanationSection4.js`**
- Added `handleDownloadDOCX()` function to call the endpoint
- Added primary DOCX download button (prominent position)
- Moved TXT and JSON downloads to collapsible "other formats" section
- Added loading states and error handling
- Updated UI to emphasize DOCX as the primary download option

### Documentation:

#### 6. **`backend/DOCX_GENERATION_ENDPOINT.md`**
- Complete API documentation
- Request/response examples
- Template placeholder format guide
- Troubleshooting section

---

## 🚀 Installation & Setup

### 1. Install Backend Dependency

```bash
cd backend
pip install python-docx
```

Or install all requirements:
```bash
pip install -r requirements.txt
```

### 2. Add DOCX Template

Place the template file in the backend directory:
```
backend/B1a_wyjasnienia_poszkodowanego_o_wypadku_przy_pracy.docx
```

**Important:** The template must contain placeholders in the format `{{placeholderName}}`

### Supported Placeholders:
- `{{generatedDate}}` - Generated timestamp
- `{{accidentDate}}` - Date of accident
- `{{accidentTime}}` - Time of accident
- `{{accidentLocation}}` - Full address (auto-formatted)
- `{{firstNameLastName}}` - Full name (auto-formatted)
- `{{fatherName}}` - Father's name
- `{{birthDatePlace}}` - Birth date and place (auto-formatted)
- `{{pesel}}` - PESEL number
- `{{nip}}` - NIP number
- `{{residenceAddress}}` - Residence address
- `{{employmentPlace}}` - Workplace
- `{{position}}` - Job position
- `{{identityDocument}}` - ID document info
- `{{accidentDescription}}` - Full accident description
- `{{medicalDocuments}}` - Medical documents list

### 3. Start Backend (if not running)

```bash
cd backend
uvicorn main:app --reload
```

The endpoint will be available at: `http://localhost:8000/generate-injured-statement`

---

## 📱 User Flow

### On Frontend (ExplanationSection4):

1. User completes all explanation form sections (1-3)
2. Reaches final section (Section 4 - Summary)
3. Sees prominent **"📄 Pobierz Zapis Wyjaśnień (DOCX)"** button
4. Clicks button to download
5. Frontend:
   - Shows loading state ("Generowanie DOCX...")
   - Sends form data to backend
   - Receives filled DOCX file
   - Triggers automatic download
6. User gets file: `Zapis_wyjasnienia_poszkodowanego_YYYY-MM-DD_HHMMSS.docx`

### Optional Alternative Formats:

Users can expand "Pobierz w innych formatach" to download:
- **TXT** - Plain text format
- **JSON** - Raw data for backup

---

## 🔧 Technical Flow

```
User fills form
    ↓
ExplanationSection4.js
    ↓
handleDownloadDOCX()
    ↓
POST /generate-injured-statement
    ↓ (JSON payload)
Backend (main.py)
    ↓
generate_injured_statement_docx()
    ↓ (services.py)
Load template DOCX
    ↓
Replace all {{placeholders}}
    ↓
Return DOCX bytes
    ↓
Frontend receives file
    ↓
Auto-download triggered
    ↓
User gets filled DOCX
```

---

## 📊 Data Mapping Example

### Input JSON:
```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "accidentStreet": "Marszałkowska",
  "accidentHouseNumber": "10",
  "accidentApartmentNumber": "5",
  "accidentPostalCode": "00-001",
  "accidentCity": "Warszawa"
}
```

### Template Placeholders:
```
Imię i nazwisko: {{firstNameLastName}}
Miejsce wypadku: {{accidentLocation}}
```

### Result in DOCX:
```
Imię i nazwisko: Jan Kowalski
Miejsce wypadku: Marszałkowska 10/5, 00-001 Warszawa
```

---

## 🎯 Key Features

✅ **Automatic placeholder replacement** - All `{{placeholders}}` filled automatically  
✅ **Field formatting** - Complex fields auto-formatted (address, name, etc.)  
✅ **Table support** - Placeholders in tables are replaced  
✅ **Polish characters** - Full UTF-8 support  
✅ **Error handling** - Comprehensive error messages  
✅ **Loading states** - Frontend shows progress during generation  
✅ **Timestamped filenames** - Each download has unique filename  
✅ **Primary action** - DOCX is the main download option (most prominent)  

---

## 🧪 Testing

### Using Frontend:
1. Navigate to "Zapis Wyjaśnień Poszkodowanego" path
2. Fill in sections 1-3
3. Go to section 4 (Summary)
4. Click "📄 Pobierz Zapis Wyjaśnień (DOCX)"
5. File downloads automatically

### Using cURL:
```bash
curl -X POST http://localhost:8000/generate-injured-statement \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jan",
    "lastName": "Kowalski",
    "accidentDate": "2025-12-01",
    "accidentDescription": "Test description"
  }' \
  --output test.docx
```

### Check if working:
1. Open downloaded DOCX
2. Verify all placeholders are replaced
3. Check Polish characters display correctly
4. Verify no `{{placeholder}}` text remains

---

## ⚠️ Troubleshooting

### Template not found
**Error:** `Template DOCX not found: B1a_wyjasnienia_poszkodowanego_o_wypadku_przy_pracy.docx`

**Solution:** Place template file in `backend/` directory with exact filename

### python-docx not installed
**Error:** `python-docx is required for DOCX generation`

**Solution:** Run `pip install python-docx`

### Placeholders not replaced
**Problem:** Seeing `{{placeholder}}` in output

**Solution:**
- Check placeholder format: `{{name}}` (double braces, no spaces)
- Verify placeholder names match exactly (case-sensitive)
- Ensure placeholders are in regular text, not fields/objects

### Backend not responding
**Problem:** Frontend shows connection error

**Solution:**
- Check if backend is running: `http://localhost:8000/health`
- Verify port 8000 is not blocked
- Check CORS settings in `main.py`

### Polish characters corrupted
**Problem:** Ą, Ć, Ę, etc. display incorrectly

**Solution:**
- Ensure template is saved as UTF-8
- Verify Word version supports UTF-8
- Check system locale settings

---

## 📦 Files Delivered

### Backend:
- ✅ `backend/schemas.py` - Added `InjuredStatementRequest` schema
- ✅ `backend/services.py` - Added DOCX generation functions
- ✅ `backend/main.py` - Added `/generate-injured-statement` endpoint
- ✅ `backend/requirements.txt` - Added `python-docx`
- ✅ `backend/DOCX_GENERATION_ENDPOINT.md` - Full API documentation

### Frontend:
- ✅ `user_path/frontend/src/components/ExplanationSection4.js` - Updated with DOCX download

### Documentation:
- ✅ This summary file
- ✅ API documentation
- ✅ Setup instructions

---

## 🔄 Comparison: Before vs After

### Before:
- Only TXT and JSON downloads available
- Both options equally prominent
- No structured DOCX output
- Manual template filling required

### After:
- **DOCX is primary download** (most prominent)
- TXT and JSON available as alternatives (collapsible)
- **Automated template filling**
- Professional Word document output
- Ready to print and sign

---

## ✨ Next Steps (Optional Enhancements)

1. **Add preview** - Show DOCX preview before download
2. **Digital signature** - Support for electronic signatures
3. **Email delivery** - Send DOCX directly via email
4. **Multiple templates** - Support different template versions
5. **Batch processing** - Generate multiple documents at once
6. **PDF export** - Convert DOCX to PDF automatically
7. **Template validation** - Check if all required placeholders exist
8. **Custom branding** - Add company logos/headers

---

## 📞 Support

If you encounter issues:
1. Check backend logs for errors
2. Verify template file exists and is valid
3. Ensure all dependencies are installed
4. Check API endpoint is accessible
5. Review browser console for frontend errors

The endpoint is fully functional and ready to use! 🎉
