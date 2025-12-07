from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services import evaluate_injury_description

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