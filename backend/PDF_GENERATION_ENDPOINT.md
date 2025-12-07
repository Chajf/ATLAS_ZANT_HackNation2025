# PDF Generation Endpoint Documentation

## Endpoint: `/generate-accident-notification`

This endpoint generates a filled PDF document (Zawiadomienie o wypadku - ZUS EWYP) from form data submitted by users.

### Method
`POST`

### URL
```
http://localhost:8000/generate-accident-notification
```

### Request Body
Send a JSON object with the following structure (all fields are optional, but should match the form data):

```json
{
  "pesel": "12345678901",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "birthDate": "1990-01-15",
  "birthPlace": "Warszawa",
  "phoneNumber": "+48 123 456 789",
  "documentType": "Dowód osobisty",
  "documentSeries": "ABC",
  "documentNumber": "123456",
  "street": "Marszałkowska",
  "houseNumber": "10",
  "apartmentNumber": "5",
  "postalCode": "00-001",
  "city": "Warszawa",
  "country": "Polska",
  "lastPolandStreet": "",
  "lastPolandHouseNumber": "",
  "lastPolandApartmentNumber": "",
  "lastPolandPostalCode": "",
  "lastPolandCity": "",
  "isLastPolandCorrespondenceAddress": "tak",
  "corrStreet": "",
  "corrHouseNumber": "",
  "corrApartmentNumber": "",
  "corrPostalCode": "",
  "corrCity": "",
  "corrCountry": "",
  "accidentDate": "2025-12-01",
  "accidentTime": "14:30",
  "accidentLocation": "Magazyn główny",
  "plannedStartTime": "08:00",
  "plannedEndTime": "16:00",
  "injuryType": "Złamanie ręki",
  "accidentDescription": "Opis przebiegu wypadku...",
  "wasFirstAidGiven": "Tak",
  "healthFacilityInfo": "Szpital Miejski",
  "investigatingAuthority": "PIP",
  "wasMachineryInvolved": "Nie",
  "machineryCondition": "",
  "hasCertification": "Tak",
  "isInInventory": "Tak",
  "attachHospitalCard": true,
  "attachProsecutorDecision": false,
  "attachDeathCertificate": false,
  "attachRightToIssueCard": false,
  "otherAttachments": "",
  "declarationDate": "2025-12-07",
  "documentsDeliveryDate": "2025-12-10",
  "responseMethod": "pocztą na adres"
}
```

### Response

#### Success (200 OK)
Returns a PDF file as binary data with headers:
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="Zawiadomienie_o_wypadku_YYYY-MM-DD_HHMMSS.pdf"`

#### Error Responses

**500 Internal Server Error** - Template PDF not found
```json
{
  "detail": "Template PDF not found: EWYP_wypelnij_i_wydrukuj.pdf"
}
```

**500 Internal Server Error** - PyMuPDF not installed
```json
{
  "detail": "PyMuPDF (fitz) is required for PDF generation. Install with: pip install pymupdf"
}
```

**500 Internal Server Error** - Other errors
```json
{
  "detail": "Error generating PDF: [error message]"
}
```

### Prerequisites

1. **Template PDF**: Place the empty ZUS EWYP form template named `EWYP_wypelnij_i_wydrukuj.pdf` in the backend directory.

2. **Python Dependencies**: Install required packages:
   ```bash
   pip install pymupdf
   ```

### Date Format
- Input dates should be in format: `YYYY-MM-DD`
- They will be automatically converted to `DDMMYYYY` format for the PDF

### Checkbox Fields
The following fields accept "Tak" or "Nie" values:
- `wasFirstAidGiven`
- `wasMachineryInvolved`
- `hasCertification`
- `isInInventory`
- `isLastPolandCorrespondenceAddress`

Boolean fields for attachments:
- `attachHospitalCard`
- `attachProsecutorDecision`
- `attachDeathCertificate`
- `attachRightToIssueCard`

Response method checkboxes (triggered by keywords in `responseMethod` field):
- "w placówce zus" → checks placówka checkbox
- "pocztą na adres" → checks poczta checkbox
- "pue zus" → checks PUE checkbox

### Example Usage (Frontend)

```javascript
const handleDownloadPDF = async () => {
  try {
    const response = await fetch('http://localhost:8000/generate-accident-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Zawiadomienie_o_wypadku.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Testing with cURL

```bash
curl -X POST http://localhost:8000/generate-accident-notification \
  -H "Content-Type: application/json" \
  -d '{
    "pesel": "12345678901",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "accidentDate": "2025-12-01"
  }' \
  --output zawiadomienie.pdf
```

### Notes

- The template PDF must be present in the backend directory before using this endpoint
- PyMuPDF is preferred over pypdf for better checkbox support
- All text fields support Polish characters (UTF-8 encoding)
- Empty or missing fields will be left blank in the generated PDF
