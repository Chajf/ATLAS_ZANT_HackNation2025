from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from services import evaluate_injury_description, extract_pdf_data, generate_accident_notification_pdf
from schemas import AccidentNotificationRequest
import io
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/evaluate-injury")
async def evaluate_injury(request: dict):
    description = request.get("description", "")
    result = evaluate_injury_description(description)
    return result

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF file and extract structured data from it.
    Returns all form fields in a structured format.
    """
    if not file.filename.endswith('.pdf'):
        return {"error": "File must be a PDF"}
    
    try:
        # Read file content
        content = await file.read()
        pdf_file = io.BytesIO(content)
        
        # Extract data from PDF
        result = extract_pdf_data(pdf_file)
        return result
    except Exception as e:
        return {"error": f"Error processing PDF: {str(e)}"}
    finally:
        await file.close()


@app.post("/generate-accident-notification")
async def generate_accident_notification(request: AccidentNotificationRequest):
    """
    Generate accident notification PDF (Zawiadomienie o wypadku) from form data.
    Returns a downloadable PDF file.
    """
    try:
        # Generate PDF
        pdf_bytes = generate_accident_notification_pdf(request)
        
        # Create filename with timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d_%H%M%S')
        filename = f'Zawiadomienie_o_wypadku_{timestamp}.pdf'
        
        # Return PDF as downloadable file
        return Response(
            content=pdf_bytes,
            media_type='application/pdf',
            headers={
                'Content-Disposition': f'attachment; filename="{filename}"'
            }
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ImportError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")