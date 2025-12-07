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


class ValidationIssue(BaseModel):
    """Single validation issue found during comparison"""
    field: str  # Nazwa pola
    severity: Literal["error", "warning", "info"]  # Poziom ważności
    message: str  # Opis problemu
    pdfValue: str = ""  # Wartość z PDF
    docxValue: str = ""  # Wartość z DOCX


class DataComparisonResponse(BaseModel):
    """Response model for comparing PDF and DOCX data"""
    isValid: bool  # Czy dane są spójne
    issues: List[ValidationIssue]  # Lista znalezionych problemów
    mergedData: dict  # Połączone dane z priorytetem
    summary: str  # Podsumowanie walidacji


class DOCXExplanationResponse(BaseModel):
    """Response model for injured person's explanation (DOCX extraction)"""
    explanationDate: str = ""  # Data wyjaśnienia (dd.mm.rrrr, HH:MM:SS)
    accidentDate: str = ""  # Data wypadku (YYYY-MM-DD)
    accidentTime: str = ""  # Godzina wypadku (HH:MM)
    accidentLocation: str = ""  # Miejsce wypadku
    
    # Dane poszkodowanego
    firstName: str = ""  # Imię
    lastName: str = ""  # Nazwisko
    fatherName: str = ""  # Imię ojca
    birthDate: str = ""  # Data urodzenia (YYYY-MM-DD)
    birthPlace: str = ""  # Miejsce urodzenia
    pesel: str = ""  # Numer PESEL
    nip: str = ""  # NIP
    residence: str = ""  # Miejsce zamieszkania
    
    # Dane pracodawcy/miejsca zatrudnienia
    employerName: str = ""  # Miejsce zatrudnienia
    employerLocation: str = ""  # Lokalizacja pracodawcy
    position: str = ""  # Stanowisko lub rodzaj pracy
    
    # Dokument tożsamości
    documentType: str = ""  # Rodzaj dokumentu (np. "Dowód osobisty")
    documentNumber: str = ""  # Numer dokumentu
    documentIssuedBy: str = ""  # Kto wydał dokument
    
    # Wyjaśnienia
    explanationText: str = ""  # Treść wyjaśnień
    medicalDocuments: str = ""  # Dokumenty medyczne


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


class CriterionAssessment(BaseModel):
    """Assessment of a single criterion for office worker evaluation"""
    status: Literal["ok", "warning", "danger"] = Field(
        description="Assessment status: ok (fully met), warning (needs clarification), danger (not met or critical issues)"
    )
    description: str = Field(
        description="Detailed Polish language justification referencing legal requirements and suggesting actions if needed"
    )


class OfficeAssessmentResponse(BaseModel):
    """Complete assessment response for office worker - workplace accident eligibility"""
    sudden: CriterionAssessment = Field(
        description="Assessment of sudden event criterion (nagłość zdarzenia)"
    )
    external: CriterionAssessment = Field(
        description="Assessment of external cause leading to injury (przyczyna zewnętrzna)"
    )
    work: CriterionAssessment = Field(
        description="Assessment of work-related connection (związek z pracą)"
    )
    injury: CriterionAssessment = Field(
        description="Assessment of injury or death as a result (uraz lub śmierć)"
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
    
    # Employment
    employmentPlace: str = ""
    position: str = ""
    identityDocument: str = ""
    
    # Description
    accidentDescription: str = ""
    medicalDocuments: List[str] = Field(default_factory=list)


class JustificationRequest(BaseModel):
    """Request model for generating decision justification"""
    decision: Literal["approved", "rejected", "investigation_needed"] = Field(
        description="Office worker's decision: approved (uznanie za wypadek), rejected (odmowa), investigation_needed (postępowanie wyjaśniające)"
    )
    assessment: OfficeAssessmentResponse = Field(
        description="Complete AI assessment with all four criteria evaluations"
    )
    validationIssues: Optional[List[ValidationIssue]] = Field(
        default=None,
        description="Optional list of data mismatches/inconsistencies between documents (PDF vs DOCX)"
    )


class JustificationResponse(BaseModel):
    """Response model for generated justification"""
    justification: str = Field(
        description="Professional, detailed justification text in Polish for the office worker's decision"
    )


class AccidentCardRequest(BaseModel):
    """Request model for accident card DOCX generation"""
    # All fields from the accident card form
    employerName: str = ""
    employerAddress: str = ""
    employerRegon: str = ""
    employerNip: str = ""
    employerActivity: str = ""
    
    victimLastName: str = ""
    victimFirstName: str = ""
    victimPesel: str = ""
    victimAddress: str = ""
    victimDocumentType: str = ""
    victimDocumentSeries: str = ""
    victimDocumentNumber: str = ""
    victimBirthDate: str = ""
    victimBirthPlace: str = ""
    victimEducation: str = ""
    victimPosition: str = ""
    victimExperience: str = ""
    victimEmploymentType: str = ""
    victimInsuranceTitle: str = ""
    victimInsuranceTitleNumber: str = ""
    
    accidentDate: str = ""
    accidentTime: str = ""
    accidentPlace: str = ""
    accidentDescription: str = ""
    accidentCause: str = ""
    witness1Name: str = ""
    witness1Address: str = ""
    witness2Name: str = ""
    witness2Address: str = ""
    witness3Name: str = ""
    witness3Address: str = ""
    
    injuryType: str = ""
    injuryDescription: str = ""
    medicalHelp: str = ""
    hospitalName: str = ""
    sickLeaveDays: str = ""
    medicalDocuments: str = ""
    
    workTask: str = ""
    safetyTraining: str = ""
    safetyEquipment: str = ""
    dangerousConditions: str = ""
    
    teamConclusion: str = ""
    preventiveMeasures: str = ""
    responsible: str = ""
    
    decision: str = ""
    decisionJustification: str = ""
    victimViolationProved: str = "nie"
    victimViolationEvidence: str = ""
    victimIntoxicationProved: str = "nie"
    victimIntoxicationEvidence: str = ""
    
    cardReceivedDate: str = ""
    cardPreparationObstacles: str = ""
    preparingEntityName: str = ""
    preparerName: str = ""
    
    accidentIsWorkAccident: str = "tak"
    accidentReportDate: str = ""
    accidentReporterName: str = ""
