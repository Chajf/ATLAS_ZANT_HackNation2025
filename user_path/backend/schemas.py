from pydantic import BaseModel, Field
from typing import Literal


class ComponentEvaluation(BaseModel):
    """Evaluation of a single component of the injury description"""
    Status: Literal["ok", "warning", "danger"] = Field(
        description="Assessment status: ok (sufficient), warning (needs improvement), danger (critical issues)"
    )
    Description: str = Field(
        description="Polish language explanation of the status and improvement suggestions"
    )


class InjuryEvaluationResponse(BaseModel):
    """Complete evaluation response for workplace injury description"""
    When: ComponentEvaluation = Field(
        description="Evaluation of temporal information (date and time)"
    )
    Where: ComponentEvaluation = Field(
        description="Evaluation of location information"
    )
    Doing: ComponentEvaluation = Field(
        description="Evaluation of work activity being performed"
    )
    How: ComponentEvaluation = Field(
        description="Evaluation of sequence of events"
    )
    Why: ComponentEvaluation = Field(
        description="Evaluation of root cause analysis"
    )
    Injury: ComponentEvaluation = Field(
        description="Evaluation of injury description"
    )


class InjuryDescriptionRequest(BaseModel):
    """Request model for injury description evaluation"""
    description: str = Field(
        description="User's description of the workplace injury incident"
    )
