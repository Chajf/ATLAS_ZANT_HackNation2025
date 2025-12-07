# DOCX Generation Endpoint Documentation

## Endpoint: `/generate-injured-statement`

This endpoint generates a filled DOCX document (Zapis wyjaśnień poszkodowanego o wypadku przy pracy - B1a) from form data submitted by users.

### Method
`POST`

### URL
```
http://localhost:8000/generate-injured-statement
```

### Request Body
Send a JSON object with the following structure:

```json
{
  "generatedDate": "07.12.2025, 10:30:00",
  "accidentDate": "2025-12-01",
  "accidentTime": "14:30",
  "accidentStreet": "Marszałkowska",
  "accidentHouseNumber": "10",
  "accidentApartmentNumber": "5",
  "accidentPostalCode": "00-001",
  "accidentCity": "Warszawa",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "fatherName": "Piotr",
  "birthDate": "1990-01-15",
  "birthPlace": "Warszawa",
  "pesel": "90011512345",
  "residenceAddress": "ul. Nowa 5/10, 00-002 Warszawa",
  "correspondenceAddress": "ul. Nowa 5/10, 00-002 Warszawa",
  "employmentPlace": "Firma ABC Sp. z o.o.",
  "position": "Pracownik magazynu",
  "identityDocument": "Dowód osobisty ABC 123456",
  "accidentDescription": "Szczegółowy opis przebiegu wypadku...",
  "medicalDocuments": [
    "Karta informacyjna ze szpitala",
    "Wyniki badań RTG"
  ]
}
```

### Response

#### Success (200 OK)
Returns a DOCX file as binary data with headers:
- `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `Content-Disposition: attachment; filename="Zapis_wyjasnienia_poszkodowanego_YYYY-MM-DD_HHMMSS.docx"`

#### Error Responses

**500 Internal Server Error** - Template DOCX not found
```json
{
  "detail": "Template DOCX not found: B1a_wyjasnienia_poszkodowanego_o_wypadku_przy_pracy.docx"
}
```

**500 Internal Server Error** - python-docx not installed
```json
{
  "detail": "python-docx is required for DOCX generation. Install with: pip install python-docx"
}
```

**500 Internal Server Error** - Other errors
```json
{
  "detail": "Error generating DOCX: [error message]"
}
```

### Prerequisites

1. **Template DOCX**: Place the template file named `B1a_wyjasnienia_poszkodowanego_o_wypadku_przy_pracy.docx` in the backend directory.
   - The template should contain placeholders in the format: `{{placeholderName}}`
   - Supported placeholders:
     - `{{generatedDate}}` - Date when document was generated
     - `{{accidentDate}}` - Date of accident
     - `{{accidentTime}}` - Time of accident
     - `{{accidentLocation}}` - Full formatted address
     - `{{firstNameLastName}}` - Full name
     - `{{fatherName}}` - Father's name
     - `{{birthDatePlace}}` - Birth date and place combined
     - `{{pesel}}` - PESEL number
     - `{{nip}}` - NIP number (currently not provided)
     - `{{residenceAddress}}` - Residence address
     - `{{employmentPlace}}` - Place of employment
     - `{{position}}` - Job position
     - `{{identityDocument}}` - Identity document info
     - `{{accidentDescription}}` - Detailed accident description
     - `{{medicalDocuments}}` - Medical documents list

2. **Python Dependencies**: Install required packages:
   ```bash
   pip install python-docx
   ```

### Field Mapping

The following automatic transformations are applied:

- `accidentLocation` is constructed from:
  - `accidentStreet`
  - `accidentHouseNumber`
  - `accidentApartmentNumber`
  - `accidentPostalCode`
  - `accidentCity`
  - Format: `{street} {houseNumber}/{apartmentNumber}, {postalCode} {city}`

- `firstNameLastName` is constructed from:
  - `firstName`
  - `lastName`
  - Format: `{firstName} {lastName}`

- `birthDatePlace` is constructed from:
  - `birthDate`
  - `birthPlace`
  - Format: `{birthDate}, {birthPlace}`

- `medicalDocuments` array is joined with commas

### Example Usage (Frontend - React)

```javascript
const handleDownloadDOCX = async () => {
  try {
    const requestData = {
      ...formData,
      generatedDate: new Date().toLocaleString('pl-PL')
    };

    const response = await fetch('http://localhost:8000/generate-injured-statement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Failed to generate DOCX');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Zapis_wyjasnienia_poszkodowanego.docx';
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
curl -X POST http://localhost:8000/generate-injured-statement \
  -H "Content-Type: application/json" \
  -d '{
    "generatedDate": "07.12.2025, 10:30:00",
    "accidentDate": "2025-12-01",
    "accidentTime": "14:30",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "accidentDescription": "Opis wypadku..."
  }' \
  --output zapis_wyjasnienia.docx
```

### Testing with Python

```python
import requests

data = {
    "generatedDate": "07.12.2025, 10:30:00",
    "accidentDate": "2025-12-01",
    "accidentTime": "14:30",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "pesel": "90011512345",
    "accidentDescription": "Szczegółowy opis wypadku..."
}

response = requests.post(
    'http://localhost:8000/generate-injured-statement',
    json=data
)

if response.status_code == 200:
    with open('zapis_wyjasnienia.docx', 'wb') as f:
        f.write(response.content)
    print("DOCX downloaded successfully!")
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

### Integration with Frontend

The endpoint is integrated with the `ExplanationSection4` component in the user path frontend:

1. User fills out the accident explanation form
2. On the final section (ExplanationSection4), they see:
   - Primary button to download filled DOCX
   - Optional alternative formats (TXT, JSON) in expandable section
3. When clicking "📄 Pobierz Zapis Wyjaśnień (DOCX)":
   - Frontend sends form data to backend
   - Backend fills the DOCX template with placeholders replaced
   - DOCX is returned and auto-downloaded

### Template Placeholder Format

The DOCX template uses double curly braces for placeholders:

```
Data wypadku: {{accidentDate}}
Godzina: {{accidentTime}}
Miejsce: {{accidentLocation}}

Imię i nazwisko: {{firstNameLastName}}
Imię ojca: {{fatherName}}
Data i miejsce urodzenia: {{birthDatePlace}}
PESEL: {{pesel}}

Opis wypadku:
{{accidentDescription}}
```

### Notes

- All placeholders are replaced with actual values from the request
- Empty fields are replaced with empty strings
- The template file must contain placeholders in the exact format shown
- Polish characters (UTF-8) are fully supported
- Multiple paragraphs and tables in the template are supported
- Medical documents list is comma-separated if multiple items provided

### Troubleshooting

**Error: "Template DOCX not found"**
- Ensure `B1a_wyjasnienia_poszkodowanego_o_wypadku_przy_pracy.docx` is in the `backend/` directory
- Check the filename matches exactly (case-sensitive)

**Error: "python-docx is required"**
- Install python-docx: `pip install python-docx`

**Placeholders not being replaced**
- Verify placeholder format: `{{placeholderName}}` (double curly braces, no spaces)
- Check placeholder names match exactly (case-sensitive)
- Ensure placeholders are in text runs, not as separate elements

**Polish characters display incorrectly**
- The library handles UTF-8 automatically
- Ensure your template file is saved with UTF-8 encoding
