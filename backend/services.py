from langchain_ollama import ChatOllama
from langchain_groq import ChatGroq
from schemas import InjuryEvaluationResponse, InjuryDescriptionRequest
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import json

# llm = ChatOllama(
#     model="qwen3:latest",
#     num_ctx=12000,
#     reasoning=True
# )

llm = ChatGroq(
    model_name="openai/gpt-oss-20b",
    reasoning_effort="low"
)

with open("injury_evaluation_prompt.txt", "r") as file:
    injury_evaluation_prompt = file.read()

def evaluate_injury_description(user_msg: str) -> InjuryEvaluationResponse:
    structured_llm = llm.with_structured_output(
        schema=InjuryEvaluationResponse
    )

    messages = [
        SystemMessage(content=injury_evaluation_prompt),
        HumanMessage(content=user_msg)
    ]

    ans = structured_llm.invoke(
               messages
            )
    
    return ans