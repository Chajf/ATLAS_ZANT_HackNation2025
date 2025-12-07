from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from services import (
    evaluate_injury_description, 
    assess_workplace_accident,
    generate_decision_justification,
    extract_pdf_data, 
    extract_docx_explanation,
    compare_pdf_docx_data,
    generate_accident_notification_pdf, 
    generate_injured_statement_docx
)
from schemas import AccidentNotificationRequest, InjuredStatementRequest, JustificationRequest
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

@app.post("/assess-workplace-accident")
async def assess_accident(request: dict):
    """
    Office worker endpoint - assess if event qualifies as workplace accident
    according to Polish labor law (4 criteria: sudden, external, work-related, injury)
    """
    description = request.get("description", "")
    if not description:
        raise HTTPException(status_code=400, detail="Description is required")
    
    result = assess_workplace_accident(description)
    return result

@app.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    file2: UploadFile = File(default=None)
):
    """
    Upload a PDF file and extract structured data from it.
    Optionally upload a second file (DOCX - injured person's explanation) for automatic comparison.
    
    Parameters:
    - file: PDF file (zawiadomienie o wypadku ZUS)
    - file2: Optional DOCX file (wyjaśnienia poszkodowanego)
    
    If only PDF is provided: Returns extracted PDF data.
    If both files are provided: Returns comparison result with merged data and validation.
    """
    if not file.filename.endswith('.pdf'):
        return {"error": "First file must be a PDF"}
    
    try:
        # Extract data from PDF
        pdf_content = await file.read()
        pdf_data = extract_pdf_data(io.BytesIO(pdf_content))
        
        # If second file (DOCX) is also provided, compare and merge data
        if file2 is not None and file2.filename and file2.filename != '':
            if not file2.filename.endswith('.docx'):
                return {"error": "Second file must be a DOCX"}
            
            # Extract data from DOCX
            docx_content = await file2.read()
            docx_data = extract_docx_explanation(io.BytesIO(docx_content))
            
            # Compare and merge data
            comparison_result = compare_pdf_docx_data(pdf_data, docx_data)
            await file2.close()
            return comparison_result
        
        # Return only PDF data if no DOCX provided
        return pdf_data
    except Exception as e:
        return {"error": f"Error processing files: {str(e)}"}
    finally:
        await file.close()

@app.post("/upload-docx")
async def upload_docx(file: UploadFile = File(...)):
    """
    Upload a DOCX file with injured person's explanation and extract structured data.
    Returns parsed information about the accident and injured person.
    """
    if not file.filename.endswith('.docx'):
        return {"error": "File must be a DOCX"}
    
    try:
        # Read file content
        content = await file.read()
        docx_file = io.BytesIO(content)
        
        # Extract data from DOCX
        result = extract_docx_explanation(docx_file)
        return result
    except Exception as e:
        return {"error": f"Error processing DOCX: {str(e)}"}
    finally:
        await file.close()

@app.post("/compare-documents")
async def compare_documents(pdf_file: UploadFile = File(...), docx_file: UploadFile = File(...)):
    """
    Upload both PDF (ZUS form) and DOCX (injured person's explanation) files.
    Compare data between documents, validate consistency, and return merged data.
    This endpoint automates data validation for office workers processing accident claims.
    """
    if not pdf_file.filename.endswith('.pdf'):
        return {"error": "First file must be a PDF"}
    
    if not docx_file.filename.endswith('.docx'):
        return {"error": "Second file must be a DOCX"}
    
    try:
        # Extract data from PDF
        pdf_content = await pdf_file.read()
        pdf_data = extract_pdf_data(io.BytesIO(pdf_content))
        
        # Extract data from DOCX
        docx_content = await docx_file.read()
        docx_data = extract_docx_explanation(io.BytesIO(docx_content))
        
        # Compare and merge data
        comparison_result = compare_pdf_docx_data(pdf_data, docx_data)
        
        return comparison_result
    except Exception as e:
        return {"error": f"Error comparing documents: {str(e)}"}
    finally:
        await pdf_file.close()
        await docx_file.close()


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


@app.post("/generate-injured-statement")
async def generate_injured_statement(request: InjuredStatementRequest):
    """
    Generate injured person's statement DOCX (Zapis wyjaśnień poszkodowanego) from form data.
    Returns a downloadable DOCX file.
    """
    try:
        # Generate DOCX
        docx_bytes = generate_injured_statement_docx(request)
        
        # Create filename with timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d_%H%M%S')
        filename = f'Zapis_wyjasnienia_poszkodowanego_{timestamp}.docx'
        
        # Return DOCX as downloadable file
        return Response(
            content=docx_bytes,
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            headers={
                'Content-Disposition': f'attachment; filename="{filename}"'
            }
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ImportError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating DOCX: {str(e)}")


@app.post("/generate-justification")
async def generate_justification(request: JustificationRequest):
    """
    Generate professional justification for office worker's decision
    based on AI assessment and selected decision type.
    
    Parameters:
    - decision: approved/rejected/investigation_needed
    - assessment: Complete OfficeAssessmentResponse with all 4 criteria
    
    Returns:
    - justification: Professional text in Polish explaining the decision
    """
    try:
        justification = generate_decision_justification(
            decision=request.decision,
            assessment=request.assessment,
            validation_issues=request.validationIssues if hasattr(request, 'validationIssues') else None
        )
        return {"justification": justification}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating justification: {str(e)}")