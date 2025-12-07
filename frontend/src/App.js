import React, { useState } from 'react';
import './App.css';
import PathSelection from './components/PathSelection';
import Section1 from './components/Section1';
import Section2 from './components/Section2';
import Section3 from './components/Section3';
import Section4 from './components/Section4';
import Section5 from './components/Section5';
import Section6 from './components/Section6';
import Section7 from './components/Section7';
import Section8 from './components/Section8';
import Section9 from './components/Section9';
import Section10 from './components/Section10';
import Section11 from './components/Section11';
import FeedbackSection from './components/FeedbackSection';
import ExplanationSection1 from './components/ExplanationSection1';
import ExplanationSection2 from './components/ExplanationSection2';
import ExplanationSection3 from './components/ExplanationSection3';
import ExplanationSection4 from './components/ExplanationSection4';

function App() {
  const [selectedPath, setSelectedPath] = useState(null); // null, 'ewyp', 'explanation'
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    // Section 1 - Victim's personal data
    pesel: '',
    documentType: '',
    documentSeries: '',
    documentNumber: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    phoneNumber: '',
    street: '',
    houseNumber: '',
    apartmentNumber: '',
    postalCode: '',
    city: '',
    country: 'Polska',
    isCorrespondenceAddress: 'Tak',
    
    // Section 2 - Last address in Poland
    lastPolandStreet: '',
    lastPolandHouseNumber: '',
    lastPolandApartmentNumber: '',
    lastPolandPostalCode: '',
    lastPolandCity: '',
    isLastPolandCorrespondenceAddress: 'Tak',
    
    // Section 3 - Correspondence address
    correspondenceType: 'adres',
    corrStreet: '',
    corrHouseNumber: '',
    corrApartmentNumber: '',
    corrPostalCode: '',
    corrCity: '',
    corrCountry: 'Polska',
    
    // Section 4 - Business activity
    hasBusinessActivity: '',
    businessStreet: '',
    businessHouseNumber: '',
    businessApartmentNumber: '',
    businessPostalCode: '',
    businessCity: '',
    businessPhoneNumber: '',
    
    // Section 5 - Childcare work
    isNanny: '',
    childcareStreet: '',
    childcareHouseNumber: '',
    childcareApartmentNumber: '',
    childcarePostalCode: '',
    childcareCity: '',
    childcarePhoneNumber: '',
    
    // Section 6 - Notifier information
    notifierPesel: '',
    notifierDocumentType: '',
    notifierDocumentSeries: '',
    notifierDocumentNumber: '',
    notifierFirstName: '',
    notifierLastName: '',
    notifierBirthDate: '',
    notifierPhoneNumber: '',
    notifierStreet: '',
    notifierHouseNumber: '',
    notifierApartmentNumber: '',
    notifierPostalCode: '',
    notifierCity: '',
    notifierCountry: 'Polska',
    isNotifierCorrespondenceAddress: 'Tak',
    notifierLastPolandStreet: '',
    notifierLastPolandHouseNumber: '',
    notifierLastPolandApartmentNumber: '',
    notifierLastPolandPostalCode: '',
    notifierLastPolandCity: '',
    isNotifierLastPolandCorrespondenceAddress: 'Tak',
    
    // Section 7 - Notifier correspondence address
    notifierCorrType: 'adres',
    notifierCorrStreet: '',
    notifierCorrHouseNumber: '',
    notifierCorrApartmentNumber: '',
    notifierCorrPostalCode: '',
    notifierCorrCity: '',
    notifierCorrCountry: 'Polska',
    
    // Section 8 - Accident information
    accidentDate: '',
    accidentTime: '',
    accidentLocation: '',
    plannedStartTime: '',
    plannedEndTime: '',
    injuryType: '',
    accidentDescription: '',
    wasFirstAidGiven: '',
    healthFacilityInfo: '',
    investigatingAuthority: '',
    wasMachineryInvolved: '',
    machineryCondition: '',
    hasCertification: '',
    isInInventory: '',
    
    // Section 9 - Witnesses
    witness1: {},
    witness2: {},
    witness3: {},
    
    // Section 10 - Attachments
    attachHospitalCard: false,
    attachProsecutorDecision: false,
    attachDeathCertificate: false,
    attachRightToIssueCard: false,
    otherAttachments: '',
    documentsDeliveryDate: '',
    additionalDocuments: Array(8).fill(''),
    
    // Section 11 - Response method and declaration
    responseMethod: '',
    declarationDate: '',
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextSection = () => {
    setCurrentSection(prev => prev + 1);
  };

  const prevSection = () => {
    setCurrentSection(prev => prev - 1);
  };

  // Conditional logic for sections
  const shouldShowSection2 = formData.country && formData.country !== 'Polska';
  const shouldShowSection3 = formData.isCorrespondenceAddress === 'Nie' || 
    (shouldShowSection2 && formData.isLastPolandCorrespondenceAddress === 'Nie');
  
  const hasNotifierData = formData.notifierPesel || formData.notifierFirstName || formData.notifierLastName;
  const shouldShowSection7 = hasNotifierData && 
    (formData.isNotifierCorrespondenceAddress === 'Nie' || 
     (formData.notifierCountry && formData.notifierCountry !== 'Polska' && 
      formData.isNotifierLastPolandCorrespondenceAddress === 'Nie'));

  const getTotalSections = () => {
    let total = 6; // Sections 1, 4, 5, 6, 8, 9, 10, 11 are always shown (8 base)
    if (shouldShowSection2) total++;
    if (shouldShowSection3) total++;
    if (shouldShowSection7) total++;
    return total + 1; // +1 for feedback section
  };

  const renderSection = () => {
    let sectionNumber = 1;
    
    // Section 1 - Always shown
    if (currentSection === sectionNumber) {
      return (
        <Section1 
          formData={formData} 
          updateFormData={updateFormData}
          onNext={nextSection}
        />
      );
    }
    sectionNumber++;
    
    // Section 2 - Conditional (if living abroad)
    if (shouldShowSection2) {
      if (currentSection === sectionNumber) {
        return (
          <Section2 
            formData={formData} 
            updateFormData={updateFormData}
            onNext={nextSection}
            onPrev={prevSection}
          />
        );
      }
      sectionNumber++;
    }
    
    // Section 3 - Conditional (if different correspondence address)
    if (shouldShowSection3) {
      if (currentSection === sectionNumber) {
        return (
          <Section3 
            formData={formData} 
            updateFormData={updateFormData}
            onNext={nextSection}
            onPrev={prevSection}
          />
        );
      }
      sectionNumber++;
    }
    
    // Section 4 - Always shown
    if (currentSection === sectionNumber) {
      return (
        <Section4 
          formData={formData} 
          updateFormData={updateFormData}
          onNext={nextSection}
          onPrev={prevSection}
        />
      );
    }
    sectionNumber++;
    
    // Section 5 - Always shown
    if (currentSection === sectionNumber) {
      return (
        <Section5 
          formData={formData} 
          updateFormData={updateFormData}
          onNext={nextSection}
          onPrev={prevSection}
        />
      );
    }
    sectionNumber++;
    
    // Section 6 - Always shown
    if (currentSection === sectionNumber) {
      return (
        <Section6 
          formData={formData} 
          updateFormData={updateFormData}
          onNext={nextSection}
          onPrev={prevSection}
        />
      );
    }
    sectionNumber++;
    
    // Section 7 - Conditional (if notifier has different correspondence address)
    if (shouldShowSection7) {
      if (currentSection === sectionNumber) {
        return (
          <Section7 
            formData={formData} 
            updateFormData={updateFormData}
            onNext={nextSection}
            onPrev={prevSection}
          />
        );
      }
      sectionNumber++;
    }
    
    // Section 8 - Always shown
    if (currentSection === sectionNumber) {
      return (
        <Section8 
          formData={formData} 
          updateFormData={updateFormData}
          onNext={nextSection}
          onPrev={prevSection}
        />
      );
    }
    sectionNumber++;
    
    // Section 9 - Always shown
    if (currentSection === sectionNumber) {
      return (
        <Section9 
          formData={formData} 
          updateFormData={updateFormData}
          onNext={nextSection}
          onPrev={prevSection}
        />
      );
    }
    sectionNumber++;
    
    // Section 10 - Always shown
    if (currentSection === sectionNumber) {
      return (
        <Section10 
          formData={formData} 
          updateFormData={updateFormData}
          onNext={nextSection}
          onPrev={prevSection}
        />
      );
    }
    sectionNumber++;
    
    // Section 11 - Always shown
    if (currentSection === sectionNumber) {
      return (
        <Section11 
          formData={formData} 
          updateFormData={updateFormData}
          onNext={nextSection}
          onPrev={prevSection}
        />
      );
    }
    sectionNumber++;
    
    // Feedback section - Always shown at the end
    if (currentSection === sectionNumber) {
      return (
        <FeedbackSection 
          formData={formData}
          onPrev={prevSection}
        />
      );
    }
    
    // Default case - shouldn't happen
    return null;
  };

  const handlePathSelection = (path) => {
    setSelectedPath(path);
    setCurrentSection(1);
  };

  const handleBackToSelection = () => {
    setSelectedPath(null);
    setCurrentSection(1);
  };

  // Jeśli nie wybrano ścieżki, pokaż ekran wyboru
  if (!selectedPath) {
    return (
      <div className="App">
        <header className="app-header" style={{ marginBottom: '2rem' }}>
          <h1>ATLAS ZANT</h1>
        </header>
        
        <main className="main-content">
          <PathSelection onSelectPath={handlePathSelection} />
        </main>
        
        <footer className="app-footer">
          <p>System do zgłaszania wypadków przy pracy - ATLAS ZANT</p>
        </footer>
      </div>
    );
  }

  // Funkcja renderująca sekcje dla ścieżki Wyjaśnień
  const renderExplanationSection = () => {
    switch(currentSection) {
      case 1:
        return (
          <ExplanationSection1
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextSection}
          />
        );
      case 2:
        return (
          <ExplanationSection2
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextSection}
            onPrev={prevSection}
          />
        );
      case 3:
        return (
          <ExplanationSection3
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextSection}
            onPrev={prevSection}
          />
        );
      case 4:
        return (
          <ExplanationSection4
            formData={formData}
            onPrev={prevSection}
          />
        );
      default:
        return null;
    }
  };

  const handleBackToHome = () => {
    const confirmMessage = 'Czy na pewno chcesz wrócić do strony głównej?\n\nWszystkie wprowadzone dane zostaną utracone!';
    if (window.confirm(confirmMessage)) {
      setSelectedPath(null);
      setCurrentSection(1);
      // Reset formData
      setFormData({
        // Reset wszystkich pól
      });
    }
  };

  // Jeśli wybrano ścieżkę "explanation"
  if (selectedPath === 'explanation') {
    const totalSections = 4;
    
    return (
      <div className="App">
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <button 
              onClick={handleBackToHome}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
                Wróć do strony głównej
              </span>
            </button>
            <h1>Zapis Wyjaśnień Poszkodowanego</h1>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentSection / totalSections) * 100}%` }}
            />
          </div>
          <p className="section-indicator">Sekcja {currentSection} z {totalSections}</p>
        </header>
        
        <main className="main-content">
          {renderExplanationSection()}
        </main>
        
        <footer className="app-footer">
          <p>System do zgłaszania wypadków przy pracy - ATLAS ZANT</p>
        </footer>
      </div>
    );
  }

  // Ścieżka EWYP - istniejący formularz
  return (
    <div className="App">
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={handleBackToHome}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
              Wróć do strony głównej
            </span>
          </button>
          <h1>ZANT - Zawiadomienie o Wypadku przy Pracy (EWYP)</h1>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentSection / getTotalSections()) * 100}%` }}
          />
        </div>
        <p className="section-indicator">Sekcja {currentSection} z {getTotalSections()}</p>
      </header>
      
      <main className="main-content">
        {renderSection()}
      </main>
      
      <footer className="app-footer">
        <p>System do zgłaszania wypadków przy pracy - ATLAS ZANT</p>
      </footer>
    </div>
  );
}

export default App;
