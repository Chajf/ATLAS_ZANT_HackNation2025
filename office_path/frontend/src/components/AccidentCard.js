import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

function AccidentCard({ uploadedFiles, analysisData, extractedData }) {
  const [cardData, setCardData] = useState({
    // I. Dane dotyczące pracodawcy
    employerName: '',
    employerAddress: '',
    employerRegon: '',
    employerNip: '',
    employerActivity: '',
    
    // II. Dane dotyczące poszkodowanego
    victimLastName: '',
    victimFirstName: '',
    victimPesel: '',
    victimAddress: '',
    victimDocumentType: '',
    victimDocumentSeries: '',
    victimDocumentNumber: '',
    victimBirthDate: '',
    victimBirthPlace: '',
    victimEducation: '',
    victimPosition: '',
    victimExperience: '',
    victimEmploymentType: '',
    victimInsuranceTitle: '',
    victimInsuranceTitleNumber: '',
    
    // III. Dane dotyczące wypadku
    accidentDate: '',
    accidentTime: '',
    accidentPlace: '',
    accidentDescription: '',
    accidentCause: '',
    witness1Name: '',
    witness1Address: '',
    witness2Name: '',
    witness2Address: '',
    witness3Name: '',
    witness3Address: '',
    
    // IV. Skutki wypadku
    injuryType: '',
    injuryDescription: '',
    medicalHelp: '',
    hospitalName: '',
    sickLeaveDays: '',
    medicalDocuments: '',
    
    // V. Okoliczności wypadku
    workTask: '',
    safetyTraining: '',
    safetyEquipment: '',
    dangerousConditions: '',
    
    // VI. Ustalenia zespołu powypadkowego
    teamConclusion: '',
    preventiveMeasures: '',
    responsible: '',
    
    // VII. Decyzja
    decision: analysisData?.eligibility?.decision || '',
    decisionJustification: '',
    victimViolationProved: 'nie',
    victimViolationEvidence: '',
    victimIntoxicationProved: 'nie',
    victimIntoxicationEvidence: '',
    
    // VIII. Dane administracyjne
    cardReceivedDate: '',
    cardPreparationObstacles: '',
    preparingEntityName: '',
    preparerName: '',
    
    // IX. Dodatkowe informacje
    accidentIsWorkAccident: 'tak',
    accidentReportDate: '',
    accidentReporterName: ''
  });

  // Auto-fill form data when extractedData is available
  useEffect(() => {
    if (extractedData) {
      const fullAddress = `${extractedData.street || ''} ${extractedData.houseNumber || ''}${extractedData.apartmentNumber ? '/' + extractedData.apartmentNumber : ''}, ${extractedData.postalCode || ''} ${extractedData.city || ''}`.trim();
      
      // Format witnesses
      const witness1Name = extractedData.witness1?.firstName && extractedData.witness1?.lastName ? `${extractedData.witness1.firstName} ${extractedData.witness1.lastName}` : '';
      const witness2Name = extractedData.witness2?.firstName && extractedData.witness2?.lastName ? `${extractedData.witness2.firstName} ${extractedData.witness2.lastName}` : '';
      const witness3Name = extractedData.witness3?.firstName && extractedData.witness3?.lastName ? `${extractedData.witness3.firstName} ${extractedData.witness3.lastName}` : '';
      
      // Build employer address from DOCX data
      const employerAddress = extractedData.employerLocation || '';

      setCardData(prev => ({
        ...prev,
        // I. Dane dotyczące pracodawcy (from DOCX)
        employerName: extractedData.employerName || '',
        employerAddress: employerAddress,
        employerNip: extractedData.nip || '',
        
        // II. Dane dotyczące poszkodowanego
        victimLastName: extractedData.lastName || '',
        victimFirstName: extractedData.firstName || '',
        victimPesel: extractedData.pesel || '',
        victimAddress: fullAddress,
        victimPosition: extractedData.position || '',
        
        // III. Dane dotyczące wypadku
        accidentDate: extractedData.accidentDate || '',
        accidentTime: extractedData.accidentTime || '',
        accidentPlace: extractedData.accidentLocation || '',
        accidentDescription: extractedData.accidentDescription || extractedData.detailedExplanation || '',
        witness1Name: witness1Name,
        witness2Name: witness2Name,
        witness3Name: witness3Name,
        
        // IV. Skutki wypadku
        injuryType: extractedData.injuryType?.toLowerCase().includes('ciężki') ? 'ciezkie' : 'lekkie',
        injuryDescription: extractedData.injuryType || '',
        medicalHelp: extractedData.wasFirstAidGiven === 'Tak' ? 'Pierwsza pomoc udzielona' : 'Brak informacji',
        hospitalName: extractedData.healthFacilityInfo || '',
        medicalDocuments: extractedData.medicalDocuments || '',
        
        // V. Okoliczności wypadku
        workTask: extractedData.accidentDescription ? 'Wykonywanie zwykłych obowiązków służbowych' : '',
        
        // VII. Decyzja
        decision: analysisData?.eligibility?.decision || '',
        
        // IX. Dodatkowe informacje
        accidentReportDate: extractedData.accidentDate || '',
        accidentReporterName: extractedData.notifierFirstName && extractedData.notifierLastName 
          ? `${extractedData.notifierFirstName} ${extractedData.notifierLastName}`.trim() 
          : '',
        
        // Additional victim data
        victimBirthDate: extractedData.birthDate || '',
        victimBirthPlace: extractedData.birthPlace || '',
        victimDocumentType: extractedData.documentType || '',
        victimDocumentSeries: extractedData.documentSeries || '',
        victimDocumentNumber: extractedData.documentNumber || ''
      }));
    }
  }, [extractedData, analysisData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Accident card submitted:', cardData);
    alert('Karta wypadku została zapisana');
  };

  const exportToDOCX = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_ACCIDENT_CARD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        throw new Error('Nie udało się wygenerować karty wypadku');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `karta_wypadku_${cardData.victimLastName || 'draft'}_${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading DOCX:', err);
      alert('Nie udało się pobrać karty wypadku. Sprawdź czy serwer działa.');
    }
  };

  return (
    <div className="accident-card-section">
      <h2>Karta Wypadku przy Pracy</h2>
      <p className="section-description">
        Zgodnie z wzorem do rozporządzenia Ministra Rodziny i Polityki Społecznej 
        z dnia 23 stycznia 2022 r.
      </p>

      <form onSubmit={handleSubmit} className="accident-card-form">
        {/* I. DANE DOTYCZĄCE PRACODAWCY */}
        <div className="form-section-card">
          <h3>I. Dane dotyczące pracodawcy</h3>
          
          <div className="form-group">
            <label htmlFor="employerName">Nazwa pracodawcy *</label>
            <input
              type="text"
              id="employerName"
              name="employerName"
              value={cardData.employerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="employerAddress">Adres siedziby *</label>
            <input
              type="text"
              id="employerAddress"
              name="employerAddress"
              value={cardData.employerAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employerRegon">REGON</label>
              <input
                type="text"
                id="employerRegon"
                name="employerRegon"
                value={cardData.employerRegon}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="employerNip">NIP</label>
              <input
                type="text"
                id="employerNip"
                name="employerNip"
                value={cardData.employerNip}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="employerActivity">Rodzaj działalności</label>
            <input
              type="text"
              id="employerActivity"
              name="employerActivity"
              value={cardData.employerActivity}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* II. DANE DOTYCZĄCE POSZKODOWANEGO */}
        <div className="form-section-card">
          <h3>II. Dane dotyczące poszkodowanego</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="victimLastName">Nazwisko *</label>
              <input
                type="text"
                id="victimLastName"
                name="victimLastName"
                value={cardData.victimLastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="victimFirstName">Imię *</label>
              <input
                type="text"
                id="victimFirstName"
                name="victimFirstName"
                value={cardData.victimFirstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="victimPesel">PESEL *</label>
            <input
              type="text"
              id="victimPesel"
              name="victimPesel"
              value={cardData.victimPesel}
              onChange={handleChange}
              pattern="[0-9]{11}"
              maxLength="11"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="victimAddress">Adres zamieszkania *</label>
            <input
              type="text"
              id="victimAddress"
              name="victimAddress"
              value={cardData.victimAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="victimBirthDate">Data urodzenia</label>
              <input
                type="date"
                id="victimBirthDate"
                name="victimBirthDate"
                value={cardData.victimBirthDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="victimBirthPlace">Miejsce urodzenia</label>
              <input
                type="text"
                id="victimBirthPlace"
                name="victimBirthPlace"
                value={cardData.victimBirthPlace}
                onChange={handleChange}
                placeholder="Miasto, kraj"
              />
            </div>
          </div>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#555' }}>Dokument tożsamości</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="victimDocumentType">Rodzaj dokumentu</label>
              <select
                id="victimDocumentType"
                name="victimDocumentType"
                value={cardData.victimDocumentType}
                onChange={handleChange}
              >
                <option value="">Wybierz...</option>
                <option value="dowod_osobisty">Dowód osobisty</option>
                <option value="paszport">Paszport</option>
                <option value="karta_pobytu">Karta pobytu</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="victimDocumentSeries">Seria</label>
              <input
                type="text"
                id="victimDocumentSeries"
                name="victimDocumentSeries"
                value={cardData.victimDocumentSeries}
                onChange={handleChange}
                placeholder="np. ABC"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="victimDocumentNumber">Numer</label>
              <input
                type="text"
                id="victimDocumentNumber"
                name="victimDocumentNumber"
                value={cardData.victimDocumentNumber}
                onChange={handleChange}
                placeholder="np. 123456"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="victimEducation">Wykształcenie</label>
              <select
                id="victimEducation"
                name="victimEducation"
                value={cardData.victimEducation}
                onChange={handleChange}
              >
                <option value="">Wybierz...</option>
                <option value="podstawowe">Podstawowe</option>
                <option value="zawodowe">Zawodowe</option>
                <option value="srednie">Średnie</option>
                <option value="wyzsze">Wyższe</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="victimExperience">Staż pracy (lata)</label>
              <input
                type="number"
                id="victimExperience"
                name="victimExperience"
                value={cardData.victimExperience}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="victimPosition">Stanowisko/zawód *</label>
            <input
              type="text"
              id="victimPosition"
              name="victimPosition"
              value={cardData.victimPosition}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="victimEmploymentType">Rodzaj zatrudnienia</label>
            <select
              id="victimEmploymentType"
              name="victimEmploymentType"
              value={cardData.victimEmploymentType}
              onChange={handleChange}
            >
              <option value="">Wybierz...</option>
              <option value="umowa_o_prace">Umowa o pracę</option>
              <option value="umowa_zlecenie">Umowa zlecenie</option>
              <option value="umowa_o_dzielo">Umowa o dzieło</option>
              <option value="samozatrudnienie">Samozatrudnienie</option>
            </select>
          </div>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#555' }}>Tytuł ubezpieczenia wypadkowego</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="victimInsuranceTitleNumber">Numer pozycji</label>
              <input
                type="text"
                id="victimInsuranceTitleNumber"
                name="victimInsuranceTitleNumber"
                value={cardData.victimInsuranceTitleNumber}
                onChange={handleChange}
                placeholder="np. 01 10 00"
              />
            </div>
            
            <div className="form-group" style={{ flex: '2' }}>
              <label htmlFor="victimInsuranceTitle">Pełny tytuł ubezpieczenia</label>
              <input
                type="text"
                id="victimInsuranceTitle"
                name="victimInsuranceTitle"
                value={cardData.victimInsuranceTitle}
                onChange={handleChange}
                placeholder="np. Pracownik zatrudniony na podstawie umowy o pracę"
              />
            </div>
          </div>
        </div>

        {/* III. DANE DOTYCZĄCE WYPADKU */}
        <div className="form-section-card">
          <h3>III. Dane dotyczące wypadku</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="accidentDate">Data wypadku *</label>
              <input
                type="date"
                id="accidentDate"
                name="accidentDate"
                value={cardData.accidentDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="accidentTime">Godzina wypadku *</label>
              <input
                type="time"
                id="accidentTime"
                name="accidentTime"
                value={cardData.accidentTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="accidentPlace">Miejsce wypadku *</label>
            <input
              type="text"
              id="accidentPlace"
              name="accidentPlace"
              value={cardData.accidentPlace}
              onChange={handleChange}
              placeholder="Dokładne określenie miejsca"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accidentDescription">Opis wypadku *</label>
            <textarea
              id="accidentDescription"
              name="accidentDescription"
              value={cardData.accidentDescription}
              onChange={handleChange}
              rows="5"
              placeholder="Szczegółowy opis przebiegu zdarzenia"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accidentCause">Przyczyny wypadku *</label>
            <textarea
              id="accidentCause"
              name="accidentCause"
              value={cardData.accidentCause}
              onChange={handleChange}
              rows="3"
              placeholder="Bezpośrednie i pośrednie przyczyny"
              required
            />
          </div>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#555' }}>Świadkowie wypadku</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="witness1Name">Świadek 1 - Imię i nazwisko</label>
              <input
                type="text"
                id="witness1Name"
                name="witness1Name"
                value={cardData.witness1Name}
                onChange={handleChange}
                placeholder="Jan Kowalski"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="witness1Address">Miejsce zamieszkania</label>
              <input
                type="text"
                id="witness1Address"
                name="witness1Address"
                value={cardData.witness1Address}
                onChange={handleChange}
                placeholder="ul. Przykładowa 1, 00-000 Warszawa"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="witness2Name">Świadek 2 - Imię i nazwisko</label>
              <input
                type="text"
                id="witness2Name"
                name="witness2Name"
                value={cardData.witness2Name}
                onChange={handleChange}
                placeholder="Anna Nowak"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="witness2Address">Miejsce zamieszkania</label>
              <input
                type="text"
                id="witness2Address"
                name="witness2Address"
                value={cardData.witness2Address}
                onChange={handleChange}
                placeholder="ul. Przykładowa 2, 00-000 Warszawa"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="witness3Name">Świadek 3 - Imię i nazwisko</label>
              <input
                type="text"
                id="witness3Name"
                name="witness3Name"
                value={cardData.witness3Name}
                onChange={handleChange}
                placeholder="Piotr Wiśniewski"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="witness3Address">Miejsce zamieszkania</label>
              <input
                type="text"
                id="witness3Address"
                name="witness3Address"
                value={cardData.witness3Address}
                onChange={handleChange}
                placeholder="ul. Przykładowa 3, 00-000 Warszawa"
              />
            </div>
          </div>
        </div>

        {/* IV. SKUTKI WYPADKU */}
        <div className="form-section-card">
          <h3>IV. Skutki wypadku</h3>
          
          <div className="form-group">
            <label htmlFor="injuryType">Rodzaj obrażeń *</label>
            <select
              id="injuryType"
              name="injuryType"
              value={cardData.injuryType}
              onChange={handleChange}
              required
            >
              <option value="">Wybierz...</option>
              <option value="lekkie">Lekkie</option>
              <option value="ciezkie">Ciężkie</option>
              <option value="smiertelny">Śmiertelny</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="injuryDescription">Opis obrażeń *</label>
            <textarea
              id="injuryDescription"
              name="injuryDescription"
              value={cardData.injuryDescription}
              onChange={handleChange}
              rows="3"
              placeholder="Szczegółowy opis doznanych obrażeń"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="medicalHelp">Udzielona pomoc medyczna</label>
            <input
              type="text"
              id="medicalHelp"
              name="medicalHelp"
              value={cardData.medicalHelp}
              onChange={handleChange}
              placeholder="np. pierwsza pomoc, karetka pogotowia"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hospitalName">Nazwa placówki medycznej</label>
            <input
              type="text"
              id="hospitalName"
              name="hospitalName"
              value={cardData.hospitalName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sickLeaveDays">Przewidywany okres niezdolności do pracy (dni)</label>
            <input
              type="number"
              id="sickLeaveDays"
              name="sickLeaveDays"
              value={cardData.sickLeaveDays}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="medicalDocuments">Dokumenty medyczne (z wyjaśnienia poszkodowanego)</label>
            <textarea
              id="medicalDocuments"
              name="medicalDocuments"
              value={cardData.medicalDocuments}
              onChange={handleChange}
              rows="2"
              placeholder="Lista dokumentów medycznych potwierdzających uszkodzenia ciała"
              readOnly
              style={{ backgroundColor: '#f0f8ff' }}
            />
          </div>
        </div>

        {/* V. OKOLICZNOŚCI WYPADKU */}
        <div className="form-section-card">
          <h3>V. Okoliczności wypadku</h3>
          
          <div className="form-group">
            <label htmlFor="workTask">Wykonywana czynność w chwili wypadku</label>
            <textarea
              id="workTask"
              name="workTask"
              value={cardData.workTask}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="safetyTraining">Szkolenie BHP (data i rodzaj)</label>
            <input
              type="text"
              id="safetyTraining"
              name="safetyTraining"
              value={cardData.safetyTraining}
              onChange={handleChange}
              placeholder="np. 15.01.2024 - szkolenie wstępne"
            />
          </div>

          <div className="form-group">
            <label htmlFor="safetyEquipment">Stosowane środki ochrony osobistej</label>
            <input
              type="text"
              id="safetyEquipment"
              name="safetyEquipment"
              value={cardData.safetyEquipment}
              onChange={handleChange}
              placeholder="np. kask, okulary ochronne, rękawice"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dangerousConditions">Stwierdzone nieprawidłowości lub warunki niebezpieczne</label>
            <textarea
              id="dangerousConditions"
              name="dangerousConditions"
              value={cardData.dangerousConditions}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        {/* DETAILED EXPLANATION FROM INJURED PERSON (DOCX) */}
        {extractedData?.detailedExplanation && (
          <div className="form-section-card" style={{ backgroundColor: '#f0f8ff', border: '2px solid #2196f3' }}>
            <h3>📝 Wyjaśnienie poszkodowanego (z dokumentu DOCX)</h3>
            <div className="info-box">
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#333' }}>
                {extractedData.detailedExplanation}
              </p>
            </div>
            {extractedData.explanationDate && (
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <strong>Data wyjaśnienia:</strong> {extractedData.explanationDate}
              </p>
            )}
          </div>
        )}

        {/* VI. USTALENIA ZESPOŁU POWYPADKOWEGO */}
        <div className="form-section-card">
          <h3>VI. Ustalenia zespołu powypadkowego</h3>
          
          <div className="form-group">
            <label htmlFor="teamConclusion">Wnioski zespołu</label>
            <textarea
              id="teamConclusion"
              name="teamConclusion"
              value={cardData.teamConclusion}
              onChange={handleChange}
              rows="4"
              placeholder="Ustalenia dotyczące przyczyn i okoliczności wypadku"
            />
          </div>

          <div className="form-group">
            <label htmlFor="preventiveMeasures">Zalecane środki zapobiegawcze</label>
            <textarea
              id="preventiveMeasures"
              name="preventiveMeasures"
              value={cardData.preventiveMeasures}
              onChange={handleChange}
              rows="3"
              placeholder="Działania mające zapobiec podobnym wypadkom w przyszłości"
            />
          </div>

          <div className="form-group">
            <label htmlFor="responsible">Osoby odpowiedzialne za wdrożenie zaleceń</label>
            <input
              type="text"
              id="responsible"
              name="responsible"
              value={cardData.responsible}
              onChange={handleChange}
              placeholder="Imiona, nazwiska i stanowiska"
            />
          </div>
        </div>

        {/* VII. DECYZJA */}
        <div className="form-section-card highlight">
          <h3>VII. Decyzja końcowa</h3>
          
          <div className="form-group">
            <label htmlFor="decision">Kwalifikacja zdarzenia *</label>
            <select
              id="decision"
              name="decision"
              value={cardData.decision}
              onChange={handleChange}
              required
            >
              <option value="">Wybierz...</option>
              <option value="approved">Wypadek przy pracy</option>
              <option value="rejected">Nie uznaje się za wypadek przy pracy</option>
              <option value="investigation_needed">Wymagane dodatkowe wyjaśnienie</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="decisionJustification">Uzasadnienie decyzji *</label>
            <textarea
              id="decisionJustification"
              name="decisionJustification"
              value={cardData.decisionJustification}
              onChange={handleChange}
              rows="5"
              placeholder="Szczegółowe uzasadnienie podjętej decyzji z powołaniem się na przepisy prawa"
              required
            />
          </div>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#555' }}>Okoliczności wyłączające uznanie za wypadek przy pracy</h4>
          
          <div className="form-group">
            <label htmlFor="victimViolationProved">
              5. Stwierdzono, że wyłączną przyczyną wypadku było udowodnione naruszenie przez poszkodowanego 
              przepisów dotyczących ochrony życia i zdrowia, spowodowane przez niego umyślnie lub wskutek rażącego niedbalstwa
            </label>
            <select
              id="victimViolationProved"
              name="victimViolationProved"
              value={cardData.victimViolationProved}
              onChange={handleChange}
            >
              <option value="nie">Nie</option>
              <option value="tak">Tak</option>
            </select>
          </div>

          {cardData.victimViolationProved === 'tak' && (
            <div className="form-group">
              <label htmlFor="victimViolationEvidence">Wskazać dowody naruszenia przepisów *</label>
              <textarea
                id="victimViolationEvidence"
                name="victimViolationEvidence"
                value={cardData.victimViolationEvidence}
                onChange={handleChange}
                rows="4"
                placeholder="Szczegółowe wskazanie dowodów (zeznania świadków, dokumentacja, nagrania, itp.)"
                required={cardData.victimViolationProved === 'tak'}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="victimIntoxicationProved">
              6. Stwierdzono, że poszkodowany, będąc w stanie nietrzeźwości lub pod wpływem środków odurzających 
              lub substancji psychotropowych, przyczynił się w znacznym stopniu do spowodowania wypadku
            </label>
            <select
              id="victimIntoxicationProved"
              name="victimIntoxicationProved"
              value={cardData.victimIntoxicationProved}
              onChange={handleChange}
            >
              <option value="nie">Nie</option>
              <option value="tak">Tak</option>
              <option value="odmowa_badania">Poszkodowany odmówił poddania się badaniu</option>
            </select>
          </div>

          {(cardData.victimIntoxicationProved === 'tak' || cardData.victimIntoxicationProved === 'odmowa_badania') && (
            <div className="form-group">
              <label htmlFor="victimIntoxicationEvidence">
                {cardData.victimIntoxicationProved === 'odmowa_badania' 
                  ? 'Informacja o odmowie poddania się badaniu *'
                  : 'Wskazać dowody stanu nietrzeźwości/odurzenia *'}
              </label>
              <textarea
                id="victimIntoxicationEvidence"
                name="victimIntoxicationEvidence"
                value={cardData.victimIntoxicationEvidence}
                onChange={handleChange}
                rows="4"
                placeholder={cardData.victimIntoxicationProved === 'odmowa_badania'
                  ? 'Data, godzina i okoliczności odmowy poddania się badaniu'
                  : 'Wyniki badań, zeznania świadków, dokumentacja medyczna, itp.'}
                required={cardData.victimIntoxicationProved === 'tak' || cardData.victimIntoxicationProved === 'odmowa_badania'}
              />
            </div>
          )}
        </div>

        {/* VIII. DANE ADMINISTRACYJNE */}
        <div className="form-section-card">
          <h3>VIII. Dane administracyjne</h3>
          
          <div className="form-group">
            <label htmlFor="cardReceivedDate">Kartę wypadku odebrano w dniu</label>
            <input
              type="date"
              id="cardReceivedDate"
              name="cardReceivedDate"
              value={cardData.cardReceivedDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardPreparationObstacles">
              Przeszkody i trudności uniemożliwiające sporządzenie karty wypadku w wymaganym terminie 14 dni
            </label>
            <textarea
              id="cardPreparationObstacles"
              name="cardPreparationObstacles"
              value={cardData.cardPreparationObstacles}
              onChange={handleChange}
              rows="3"
              placeholder="Opisać przyczyny opóźnienia (jeśli występują)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="preparingEntityName">Nazwa podmiotu obowiązanego do sporządzenia karty wypadku *</label>
            <input
              type="text"
              id="preparingEntityName"
              name="preparingEntityName"
              value={cardData.preparingEntityName}
              onChange={handleChange}
              placeholder="Pełna nazwa pracodawcy/jednostki"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preparerName">Imię i nazwisko osoby sporządzającej kartę wypadku *</label>
            <input
              type="text"
              id="preparerName"
              name="preparerName"
              value={cardData.preparerName}
              onChange={handleChange}
              placeholder="Jan Kowalski"
              required
            />
          </div>
        </div>

        {/* IX. DODATKOWE INFORMACJE */}
        <div className="form-section-card">
          <h3>IX. Dodatkowe informacje</h3>
          
          <div className="form-group">
            <label htmlFor="accidentIsWorkAccident">Czy wypadek miał miejsce w godzinach pracy? *</label>
            <select
              id="accidentIsWorkAccident"
              name="accidentIsWorkAccident"
              value={cardData.accidentIsWorkAccident}
              onChange={handleChange}
              required
            >
              <option value="tak">Tak</option>
              <option value="nie">Nie</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="accidentReportDate">Data zgłoszenia wypadku *</label>
              <input
                type="date"
                id="accidentReportDate"
                name="accidentReportDate"
                value={cardData.accidentReportDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="accidentReporterName">Imię i nazwisko osoby zgłaszającej *</label>
              <input
                type="text"
                id="accidentReporterName"
                name="accidentReporterName"
                value={cardData.accidentReporterName}
                onChange={handleChange}
                placeholder="Jan Kowalski"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Zapisz kartę wypadku
          </button>
          <button type="button" className="export-btn" onClick={exportToDOCX}>
            Eksportuj do DOCX
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccidentCard;
