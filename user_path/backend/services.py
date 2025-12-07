from langchain_ollama import ChatOllama
from langchain_groq import ChatGroq
from schemas import InjuryEvaluationResponse, InjuryDescriptionRequest, ComponentEvaluation
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import json
import os

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

with open("injury_evaluation_prompt.txt", "r") as file:
    injury_evaluation_prompt = file.read()

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