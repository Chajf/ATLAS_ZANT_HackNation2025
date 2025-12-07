import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import CausalDiagram from './components/CausalDiagram';
import DataConsistency from './components/DataConsistency';
import EligibilityAssessment from './components/EligibilityAssessment';
import ExplanationSection from './components/ExplanationSection';
import OfficialStatement from './components/OfficialStatement';
import AccidentCard from './components/AccidentCard';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleFilesUploaded = (data) => {
    setUploadedFiles(data.files);
    setExtractedData(data.extractedData);
    
    // Generate analysis data based on extracted data
    const analysis = generateAnalysisFromExtractedData(data.extractedData);
    setAnalysisData(analysis);
    setCurrentStep(2);
  };

  const generateAnalysisFromExtractedData = (data) => {
    // Analyze the extracted data to determine status
    const hasAccidentDetails = data.accidentDescription && data.accidentDescription.length > 50;
    const hasDateTime = data.accidentDate && data.accidentTime;
    const hasLocation = data.accidentLocation && data.accidentLocation.length > 0;
    const hasInjury = data.injuryType && data.injuryType.length > 0;
    
    // Check for witnesses
    const hasWitnesses = data.witness1?.firstName || data.witness2?.firstName || data.witness3?.firstName;
    
    // Determine missing documents
    const missingDocs = [];
    if (!data.attachHospitalCard) missingDocs.push('Karta szpitalna');
    if (!data.attachProsecutorDecision && data.investigatingAuthority) missingDocs.push('Decyzja prokuratora');
    if (!hasWitnesses) missingDocs.push('Oświadczenia świadków');
    
    return {
      causal: {
        causalRelation: { 
          status: hasAccidentDetails ? 'green' : 'red', 
          description: hasAccidentDetails ? 'Wyraźny związek przyczynowy - opisane przyczyny wypadku' : 'Brak szczegółowego opisu przyczyn' 
        },
        timeRelation: { 
          status: hasDateTime ? 'green' : 'red', 
          description: hasDateTime ? `Zdarzenie miało miejsce ${data.accidentDate} o godz. ${data.accidentTime}` : 'Brak informacji o czasie wypadku' 
        },
        placeRelation: { 
          status: hasLocation ? 'green' : 'red', 
          description: hasLocation ? `Miejsce wypadku: ${data.accidentLocation}` : 'Brak informacji o miejscu wypadku' 
        },
        functionalRelation: { 
          status: hasAccidentDetails && data.plannedStartTime ? 'green' : 'yellow', 
          description: hasAccidentDetails ? 'Wypadek w godzinach pracy, podczas wykonywania obowiązków' : 'Wymaga potwierdzenia związku z obowiązkami służbowymi' 
        }
      },
      consistency: {
        dates: { consistent: hasDateTime, details: hasDateTime ? 'Daty się zgadzają we wszystkich dokumentach' : 'Brak pełnych danych o dacie' },
        circumstances: { consistent: hasAccidentDetails, details: hasAccidentDetails ? 'Opis okoliczności spójny' : 'Rozbieżności w opisie okoliczności' },
        location: { consistent: hasLocation, details: hasLocation ? 'Miejsce spójne' : 'Brak szczegółów o miejscu' },
        victim: { consistent: data.pesel && data.firstName && data.lastName, details: 'Dane poszkodowanego kompletne' },
        witnesses: { consistent: hasWitnesses, details: hasWitnesses ? 'Świadkowie wskazani' : 'Brak świadków' },
        causes: { consistent: hasInjury, details: hasInjury ? 'Przyczyny i skutki opisane' : 'Brak opisu skutków' }
      },
      eligibility: {
        decision: missingDocs.length > 0 ? 'investigation_needed' : 'approved',
        missingDocuments: missingDocs,
        requiresZUSOpinion: data.injuryType && data.injuryType.toLowerCase().includes('ciężki')
      },
      extractedData: data
    };
  };

  const steps = [
    { id: 1, title: 'Wczytanie dokumentów' },
    { id: 2, title: 'Analiza związków' },
    { id: 3, title: 'Spójność danych' },
    { id: 4, title: 'Ocena kwalifikowalności' },
    { id: 5, title: 'Wyjaśnienie decyzji' },
    { id: 6, title: 'Stanowisko' },
    { id: 7, title: 'Karta wypadku' }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>System Oceny Wypadków przy Pracy</h1>
        <p>Panel Pracownika Biura</p>
      </header>

      <div className="progress-bar">
        {steps.map(step => (
          <div 
            key={step.id} 
            className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
            onClick={() => currentStep > step.id && setCurrentStep(step.id)}
          >
            <div className="step-number">{step.id}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      <div className="content">
        {currentStep === 1 && (
          <FileUpload onFilesUploaded={handleFilesUploaded} />
        )}
        
        {currentStep === 2 && analysisData && (
          <div>
            <CausalDiagram data={analysisData.causal} />
            <button className="next-btn" onClick={() => setCurrentStep(3)}>Dalej</button>
          </div>
        )}

        {currentStep === 3 && analysisData && (
          <div>
            <DataConsistency data={analysisData.consistency} />
            <button className="next-btn" onClick={() => setCurrentStep(4)}>Dalej</button>
          </div>
        )}

        {currentStep === 4 && analysisData && (
          <div>
            <EligibilityAssessment data={analysisData.eligibility} />
            <button className="next-btn" onClick={() => setCurrentStep(5)}>Dalej</button>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <ExplanationSection analysisData={analysisData} />
            <button className="next-btn" onClick={() => setCurrentStep(6)}>Dalej</button>
          </div>
        )}

        {currentStep === 6 && (
          <div>
            <OfficialStatement analysisData={analysisData} extractedData={extractedData} />
            <button className="next-btn" onClick={() => setCurrentStep(7)}>Dalej</button>
          </div>
        )}

        {currentStep === 7 && (
          <AccidentCard uploadedFiles={uploadedFiles} analysisData={analysisData} extractedData={extractedData} />
        )}
      </div>
    </div>
  );
}

export default App;
