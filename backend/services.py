from langchain_ollama import ChatOllama
from langchain_groq import ChatGroq
from schemas import InjuryEvaluationResponse, InjuryDescriptionRequest, ComponentEvaluation, PDFExtractionResponse, AccidentNotificationRequest
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import json
import os
from pypdf import PdfReader
import io
from typing import BinaryIO
from datetime import datetime

try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

# llm = ChatOllama(
#     model="qwen3:latest",
#     num_ctx=12000,
#     reasoning=True
# )

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model_name="openai/gpt-oss-20b",
    reasoning_effort="low",
    temperature=0.1,
    max_retries=2
)

llm_llama = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0,
    max_retries=2
)

with open("injury_evaluation_prompt.txt", "r", encoding="utf-8") as file:
    injury_evaluation_prompt = file.read()

with open("pdf_extraction_prompt.txt", "r", encoding="utf-8") as file:
    pdf_extraction_prompt = file.read()

def evaluate_injury_description(user_msg: str) -> InjuryEvaluationResponse:
    try:
        structured_llm = llm.with_structured_output(
            schema=InjuryEvaluationResponse,
            method="json_mode"
        )

        messages = [
            SystemMessage(content=injury_evaluation_prompt),
            HumanMessage(content=user_msg)
        ]

        ans = structured_llm.invoke(messages)
        return ans
    
    except Exception as e:
        print(f"Error in evaluate_injury_description: {e}")
        # Zwróć domyślną odpowiedź w przypadku błędu
        return InjuryEvaluationResponse(
            When=ComponentEvaluation(
                Status="danger",
                Description="Wystąpił błąd podczas analizy. Spróbuj ponownie lub skontaktuj się z administratorem."
            ),
            Where=ComponentEvaluation(
                Status="danger",
                Description="Wystąpił błąd podczas analizy."
            ),
            Doing=ComponentEvaluation(
                Status="danger",
                Description="Wystąpił błąd podczas analizy."
            ),
            How=ComponentEvaluation(
                Status="danger",
                Description="Wystąpił błąd podczas analizy."
            ),
            Why=ComponentEvaluation(
                Status="danger",
                Description="Wystąpił błąd podczas analizy."
            ),
            Injury=ComponentEvaluation(
                Status="danger",
                Description="Wystąpił błąd podczas analizy."
            )
        )


def extract_pdf_data(pdf_file: BinaryIO) -> PDFExtractionResponse:
    """
    Extract structured data from PDF file using LLM with advanced prompt
    """
    try:
        # Read PDF content
        pdf_reader = PdfReader(pdf_file)
        pdf_text = ""
        for page in pdf_reader.pages:
            pdf_text += page.extract_text() + "\n"

        messages = [
            SystemMessage(content=pdf_extraction_prompt),
            HumanMessage(content=f"Wyodrębnij dane z następującego tekstu formularza:\n\n{pdf_text}")
        ]

        try:
            # Use LLM to extract structured data
            structured_llm = llm_llama.with_structured_output(
                schema=PDFExtractionResponse,
                method="json_mode"
            )

            result = structured_llm.invoke(messages)
        except:
            # Fallback to llama model if Groq fails
            structured_llm = llm.with_structured_output(
                schema=PDFExtractionResponse,
                method="json_mode"
            )
            result = structured_llm.invoke(messages)
        return result
    
    except Exception as e:
        print(f"Error in extract_pdf_data: {e}")
        # Return empty response on error
        return PDFExtractionResponse()


def format_date(date_str: str) -> str:
    """Format date from YYYY-MM-DD to DDMMYYYY"""
    if not date_str or len(date_str) != 10:
        return date_str
    try:
        year, month, day = date_str.split('-')
        return f"{day}{month}{year}"
    except:
        return date_str


def fill_pdf_with_pymupdf(input_pdf_path: str, json_data: dict) -> bytes:
    """Fill PDF form using PyMuPDF and return bytes"""
    doc = fitz.open(input_pdf_path)

    # Page1 - dane osobowe + ostatni adres w Polsce
    field_data = {
        'PESEL[0]': json_data.get('pesel', ''),
        'Imię[0]': json_data.get('firstName', ''),
        'Nazwisko[0]': json_data.get('lastName', ''),
        'Dataurodzenia[0]': format_date(json_data.get('birthDate', '')),
        'Miejsceurodzenia[0]': json_data.get('birthPlace', ''),
        'Numertelefonu[0]': json_data.get('phoneNumber', ''),
        'Rodzajseriainumerdokumentu[0]': f"{json_data.get('documentType', '')} {json_data.get('documentSeries', '')} {json_data.get('documentNumber', '')}",
        'Ulica[0]': json_data.get('street', ''),
        'Numerdomu[0]': json_data.get('houseNumber', ''),
        'Numerlokalu[0]': json_data.get('apartmentNumber', ''),
        'Kodpocztowy[0]': json_data.get('postalCode', ''),
        'Poczta[0]': json_data.get('city', ''),
        'Nazwapaństwa[0]': json_data.get('country', ''),
        # Ostatni adres w Polsce
        'Ulica2A[0]': json_data.get('lastPolandStreet', ''),
        'Numerdomu2A[0]': json_data.get('lastPolandHouseNumber', ''),
        'Numerlokalu2A[0]': json_data.get('lastPolandApartmentNumber', ''),
        'Kodpocztowy2A[0]': json_data.get('lastPolandPostalCode', ''),
        'Poczta2A[0]': json_data.get('lastPolandCity', ''),
        # Pozostałe pola
        'Datawyp[0]': format_date(json_data.get('accidentDate', '')),
        'Godzina[0]': json_data.get('accidentTime', ''),
        'Miejscewyp[0]': json_data.get('accidentLocation', ''),
        'Godzina3A[0]': json_data.get('plannedStartTime', ''),
        'Godzina3B[0]': json_data.get('plannedEndTime', ''),
        'Tekst4[0]': json_data.get('injuryType', ''),
        'Tekst5[0]': json_data.get('accidentDescription', ''),
        'Tekst6[0]': json_data.get('healthFacilityInfo', ''),
        'Tekst7[0]': json_data.get('investigatingAuthority', ''),
        'Tekst8[0]': json_data.get('machineryCondition', ''),
        'Data[0]': format_date(json_data.get('declarationDate', '')),
        'Data[1]': format_date(json_data.get('documentsDeliveryDate', '')),
        'Inne[0]': json_data.get('otherAttachments', ''),
    }

    # Page2 - adres korespondencyjny
    field_last_corr = {
        'Ulica2[1]': json_data.get('corrStreet', ''),
        'Numerdomu2[1]': json_data.get('corrHouseNumber', ''),
        'Numerlokalu2[1]': json_data.get('corrApartmentNumber', ''),
        'Kodpocztowy2[1]': json_data.get('corrPostalCode', ''),
        'Poczta2[1]': json_data.get('corrCity', ''),
        'Nazwapaństwa2[0]': json_data.get('corrCountry', ''),
    }

    # Checkboxes
    response_method = json_data.get('responseMethod', '').lower()
    check_placowka = 'w placówce zus' in response_method
    check_poczta = 'pocztą na adres' in response_method
    check_pue = 'pue zus' in response_method

    checkbox_data = {
        'TAK6[0]': json_data.get('wasFirstAidGiven') == 'Tak',
        'NIE6[0]': json_data.get('wasFirstAidGiven') == 'Nie',
        'TAK8[0]': json_data.get('wasMachineryInvolved') == 'Tak',
        'NIE8[0]': json_data.get('wasMachineryInvolved') == 'Nie',
        'TAK9[0]': json_data.get('hasCertification') == 'Tak',
        'NIE9[0]': json_data.get('hasCertification') == 'Nie',
        'TAK10[0]': json_data.get('isInInventory') == 'Tak',
        'NIE10[0]': json_data.get('isInInventory') == 'Nie',
        'ZaznaczX1[0]': json_data.get('attachHospitalCard') == True,
        'ZaznaczX2[0]': json_data.get('attachProsecutorDecision') == True,
        'ZaznaczX3[0]': json_data.get('attachDeathCertificate') == True,
        'ZaznaczX4[0]': json_data.get('attachRightToIssueCard') == True,
        'wplacowce[0]': check_placowka,
        'poczta[0]': check_poczta,
        'PUE[0]': check_pue,
        'adres[0]': json_data.get('isLastPolandCorrespondenceAddress', '').lower() == 'tak',
    }

    for page in doc:
        for widget in page.widgets():
            field_name = widget.field_name
            field_type = widget.field_type

            # Text fields
            for key, value in {**field_data, **field_last_corr}.items():
                if key in field_name and value and str(value).strip():
                    try:
                        widget.field_value = str(value)
                        widget.text_encoding = fitz.TEXT_ENCODING_LATIN
                        widget.update()
                    except:
                        pass

            # Checkboxes
            for key, should_check in checkbox_data.items():
                if key in field_name and field_type == 2:
                    try:
                        if should_check:
                            rect = widget.rect
                            margin = 3
                            page.draw_line((rect.x0 + margin, rect.y0 + margin),
                                           (rect.x1 - margin, rect.y1 - margin),
                                           color=(0, 0, 0), width=2.5)
                            page.draw_line((rect.x1 - margin, rect.y0 + margin),
                                           (rect.x0 + margin, rect.y1 - margin),
                                           color=(0, 0, 0), width=2.5)
                        else:
                            widget.field_value = False
                            widget.update()
                    except:
                        pass

    # Save to bytes
    pdf_bytes = doc.tobytes(garbage=4, deflate=True, clean=True, pretty=True)
    doc.close()
    return pdf_bytes


def generate_accident_notification_pdf(data: AccidentNotificationRequest) -> bytes:
    """
    Generate filled accident notification PDF from form data
    Returns PDF as bytes
    """
    input_pdf = 'EWYP_wypelnij_i_wydrukuj.pdf'
    
    if not os.path.exists(input_pdf):
        raise FileNotFoundError(f"Template PDF not found: {input_pdf}")
    
    # Convert Pydantic model to dict
    json_data = data.model_dump()
    
    if PYMUPDF_AVAILABLE:
        return fill_pdf_with_pymupdf(input_pdf, json_data)
    else:
        raise ImportError("PyMuPDF (fitz) is required for PDF generation. Install with: pip install pymupdf")