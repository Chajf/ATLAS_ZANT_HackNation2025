from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from services import evaluate_injury_description, extract_pdf_data
import io

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