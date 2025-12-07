from langchain_ollama import ChatOllama
from langchain_groq import ChatGroq
from schemas import InjuryEvaluationResponse, InjuryDescriptionRequest, ComponentEvaluation, PDFExtractionResponse
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import json
import os
from pypdf import PdfReader
import io
from typing import BinaryIO

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
            structured_llm = llm.with_structured_output(
                schema=PDFExtractionResponse,
                method="json_mode"
            )

            result = structured_llm.invoke(messages)
        except:
            # Fallback to llama model if Groq fails
            structured_llm = llm_llama.with_structured_output(
                schema=PDFExtractionResponse,
                method="json_mode"
            )
            result = structured_llm.invoke(messages)
        return result
    
    except Exception as e:
        print(f"Error in extract_pdf_data: {e}")
        # Return empty response on error
        return PDFExtractionResponse()