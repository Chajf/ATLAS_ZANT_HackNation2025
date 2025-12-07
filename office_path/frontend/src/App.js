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

  const generateAnalysisFromExtractedData = (responseData) => {
    // Check if we received comparison data (with both PDF and DOCX)
    const isComparisonData = responseData.mergedData !== undefined;
    
    // Use merged data if available, otherwise use direct PDF data
    const data = isComparisonData ? responseData.mergedData : responseData;
    const validationIssues = responseData.issues || [];
    
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
    
    // Process validation issues from comparison
    const errorIssues = validationIssues.filter(issue => issue.severity === 'error');
    const warningIssues = validationIssues.filter(issue => issue.severity === 'warning');
    const hasErrors = errorIssues.length > 0;
    const hasWarnings = warningIssues.length > 0;
    
    // Build consistency data from validation issues
    const consistencyData = {
      dates: { 
        consistent: !validationIssues.some(i => i.field.includes('Date') || i.field.includes('date')),
        details: validationIssues.find(i => i.field.includes('Date') || i.field.includes('date'))?.message || 
                 (isComparisonData ? 'Daty się zgadzają we wszystkich dokumentach' : hasDateTime ? 'Data wypadku podana w dokumencie' : 'Brak pełnych danych o dacie')
      },
      circumstances: { 
        consistent: !validationIssues.some(i => i.field.includes('Description') || i.field.includes('description')),
        details: validationIssues.find(i => i.field.includes('Description'))?.message || 
                 (isComparisonData ? 'Opis okoliczności spójny między dokumentami' : hasAccidentDetails ? 'Opis okoliczności zawarty' : 'Rozbieżności w opisie okoliczności')
      },
      location: { 
        consistent: !validationIssues.some(i => i.field.includes('Location') || i.field.includes('location')),
        details: validationIssues.find(i => i.field.includes('Location'))?.message ||
                 (isComparisonData ? 'Miejsce wypadku zgodne' : hasLocation ? 'Miejsce wypadku określone' : 'Brak szczegółów o miejscu')
      },
      victim: { 
        consistent: !validationIssues.some(i => ['pesel', 'firstName', 'lastName'].includes(i.field)),
        details: validationIssues.find(i => ['pesel', 'firstName', 'lastName'].includes(i.field))?.message ||
                 (isComparisonData ? 'Dane poszkodowanego zgodne w obu dokumentach' : 'Dane poszkodowanego kompletne')
      },
      witnesses: { 
        consistent: hasWitnesses,
        details: hasWitnesses ? 'Świadkowie wskazani' : (isComparisonData ? 'Brak świadków w dokumentach' : 'Brak świadków')
      },
      causes: { 
        consistent: !validationIssues.some(i => i.field.includes('injury') || i.field.includes('Injury')),
        details: validationIssues.find(i => i.field.includes('injury'))?.message ||
                 (hasInjury ? 'Przyczyny i skutki opisane' : 'Brak opisu skutków')
      }
    };
    
    return {
      causal: {
        causalRelation: { 
          status: hasAccidentDetails ? 'green' : 'red', 
          description: hasAccidentDetails ? 'Wyraźny związek przyczynowy - opisane przyczyny wypadku' : 'Brak szczegółowego opisu przyczyn' 
        },
        timeRelation: { 
          status: hasDateTime && !validationIssues.some(i => i.field.includes('Date')) ? 'green' : 'yellow', 
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
      consistency: consistencyData,
      eligibility: {
        decision: hasErrors || missingDocs.length > 0 ? 'investigation_needed' : hasWarnings ? 'conditional_approval' : 'approved',
        missingDocuments: missingDocs,
        requiresZUSOpinion: data.injuryType && data.injuryType.toLowerCase().includes('ciężki'),
        validationIssues: validationIssues
      },
      extractedData: data,
      comparisonData: isComparisonData ? responseData : null
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
            <DataConsistency data={analysisData.consistency} comparisonData={analysisData.comparisonData} />
            <button className="next-btn" onClick={() => setCurrentStep(4)}>Dalej</button>
          </div>
        )}

        {currentStep === 4 && analysisData && (
          <div>
            <EligibilityAssessment analysisData={analysisData} />
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
