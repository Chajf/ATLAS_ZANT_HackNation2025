from pydantic import BaseModel, Field
from typing import Literal, Optional, List


class WitnessInfo(BaseModel):
    """Information about a witness"""
    firstName: str = ""
    lastName: str = ""
    street: str = ""
    apartmentNumber: str = ""
    houseNumber: str = ""
    city: str = ""
    postalCode: str = ""
    country: str = ""


class PDFExtractionResponse(BaseModel):
    """Response model for PDF data extraction - simplified version"""
    # CZĘŚĆ 1: Dane osoby poszkodowanej
    pesel: str = ""
    documentType: str = ""
    documentSeries: str = ""
    documentNumber: str = ""
    firstName: str = ""
    lastName: str = ""
    birthDate: str = ""
    birthPlace: str = ""
    phoneNumber: str = ""
    street: str = ""
    houseNumber: str = ""
    apartmentNumber: str = ""
    postalCode: str = ""
    city: str = ""
    country: str = ""
    isCorrespondenceAddress: str = ""
    
    # CZĘŚĆ 4: Działalność pozarolnicza
    hasBusinessActivity: str = ""
    
    # CZĘŚĆ 6: Dane osoby zawiadamiającej
    notifierFirstName: str = ""
    notifierLastName: str = ""
    
    # CZĘŚĆ 8: Informacje o wypadku
    accidentDate: str = ""
    accidentTime: str = ""
    accidentLocation: str = ""
    plannedStartTime: str = ""
    plannedEndTime: str = ""
    injuryType: str = ""
    accidentDescription: str = ""
    wasFirstAidGiven: str = ""
    healthFacilityInfo: str = ""
    investigatingAuthority: str = ""
    wasMachineryInvolved: str = ""
    machineryCondition: str = ""
    hasCertification: str = ""
    isInInventory: str = ""
    
    # CZĘŚĆ 9: Dane świadków
    witness1: WitnessInfo = Field(default_factory=WitnessInfo)
    witness2: WitnessInfo = Field(default_factory=WitnessInfo)
    witness3: WitnessInfo = Field(default_factory=WitnessInfo)
    
    # CZĘŚĆ 10: Załączniki
    attachHospitalCard: bool = False
    attachProsecutorDecision: bool = False
    attachDeathCertificate: bool = False
    attachRightToIssueCard: bool = False
    otherAttachments: str = ""
    documentsDeliveryDate: str = ""
    additionalDocuments: List[str] = Field(default_factory=lambda: [""] * 8)


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


class AccidentNotificationRequest(BaseModel):
    """Request model for accident notification PDF generation"""
    # Personal data
    pesel: str = ""
    firstName: str = ""
    lastName: str = ""
    birthDate: str = ""
    birthPlace: str = ""
    phoneNumber: str = ""
    documentType: str = ""
    documentSeries: str = ""
    documentNumber: str = ""
    
    # Current address
    street: str = ""
    houseNumber: str = ""
    apartmentNumber: str = ""
    postalCode: str = ""
    city: str = ""
    country: str = ""
    
    # Last Poland address
    lastPolandStreet: str = ""
    lastPolandHouseNumber: str = ""
    lastPolandApartmentNumber: str = ""
    lastPolandPostalCode: str = ""
    lastPolandCity: str = ""
    
    # Correspondence address
    isLastPolandCorrespondenceAddress: str = ""
    corrStreet: str = ""
    corrHouseNumber: str = ""
    corrApartmentNumber: str = ""
    corrPostalCode: str = ""
    corrCity: str = ""
    corrCountry: str = ""
    
    # Accident details
    accidentDate: str = ""
    accidentTime: str = ""
    accidentLocation: str = ""
    plannedStartTime: str = ""
    plannedEndTime: str = ""
    injuryType: str = ""
    accidentDescription: str = ""
    wasFirstAidGiven: str = ""
    healthFacilityInfo: str = ""
    investigatingAuthority: str = ""
    wasMachineryInvolved: str = ""
    machineryCondition: str = ""
    hasCertification: str = ""
    isInInventory: str = ""
    
    # Attachments
    attachHospitalCard: bool = False
    attachProsecutorDecision: bool = False
    attachDeathCertificate: bool = False
    attachRightToIssueCard: bool = False
    otherAttachments: str = ""
    
    # Declaration
    declarationDate: str = ""
    documentsDeliveryDate: str = ""
    responseMethod: str = ""


class InjuredStatementRequest(BaseModel):
    """Request model for injured person's statement DOCX generation"""
    # Accident details
    generatedDate: str = ""
    accidentDate: str = ""
    accidentTime: str = ""
    accidentStreet: str = ""
    accidentHouseNumber: str = ""
    accidentApartmentNumber: str = ""
    accidentPostalCode: str = ""
    accidentCity: str = ""
    
    # Personal data
    firstName: str = ""
    lastName: str = ""
    fatherName: str = ""
    birthDate: str = ""
    birthPlace: str = ""
    pesel: str = ""
    nip: str = ""
    residenceAddress: str = ""
    correspondenceAddress: str = ""
    employmentPlace: str = ""
    position: str = ""
    identityDocument: str = ""
    
    # Description
    accidentDescription: str = ""
    medicalDocuments: List[str] = Field(default_factory=list)
