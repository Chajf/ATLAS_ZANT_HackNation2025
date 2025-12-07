import React, { useState, useEffect } from 'react';

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
    victimEducation: '',
    victimPosition: '',
    victimExperience: '',
    victimEmploymentType: '',
    
    // III. Dane dotyczące wypadku
    accidentDate: '',
    accidentTime: '',
    accidentPlace: '',
    accidentDescription: '',
    accidentCause: '',
    witnesses: '',
    
    // IV. Skutki wypadku
    injuryType: '',
    injuryDescription: '',
    medicalHelp: '',
    hospitalName: '',
    sickLeaveDays: '',
    
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
    decisionJustification: ''
  });

  // Auto-fill form data when extractedData is available
  useEffect(() => {
    if (extractedData) {
      const fullAddress = `${extractedData.street || ''} ${extractedData.houseNumber || ''}${extractedData.apartmentNumber ? '/' + extractedData.apartmentNumber : ''}, ${extractedData.postalCode || ''} ${extractedData.city || ''}`.trim();
      
      // Format witnesses
      const witnessesText = [
        extractedData.witness1?.firstName && extractedData.witness1?.lastName ? `${extractedData.witness1.firstName} ${extractedData.witness1.lastName}` : '',
        extractedData.witness2?.firstName && extractedData.witness2?.lastName ? `${extractedData.witness2.firstName} ${extractedData.witness2.lastName}` : '',
        extractedData.witness3?.firstName && extractedData.witness3?.lastName ? `${extractedData.witness3.firstName} ${extractedData.witness3.lastName}` : ''
      ].filter(w => w).join(', ');

      setCardData(prev => ({
        ...prev,
        // II. Dane dotyczące poszkodowanego
        victimLastName: extractedData.lastName || '',
        victimFirstName: extractedData.firstName || '',
        victimPesel: extractedData.pesel || '',
        victimAddress: fullAddress,
        
        // III. Dane dotyczące wypadku
        accidentDate: extractedData.accidentDate || '',
        accidentTime: extractedData.accidentTime || '',
        accidentPlace: extractedData.accidentLocation || '',
        accidentDescription: extractedData.accidentDescription || '',
        witnesses: witnessesText,
        
        // IV. Skutki wypadku
        injuryType: extractedData.injuryType?.toLowerCase().includes('ciężki') ? 'ciezkie' : 'lekkie',
        injuryDescription: extractedData.injuryType || '',
        medicalHelp: extractedData.wasFirstAidGiven === 'Tak' ? 'Pierwsza pomoc udzielona' : 'Brak informacji',
        hospitalName: extractedData.healthFacilityInfo || '',
        
        // V. Okoliczności wypadku
        workTask: extractedData.accidentDescription ? 'Wykonywanie zwykłych obowiązków służbowych' : '',
        
        // VII. Decyzja
        decision: analysisData?.eligibility?.decision || ''
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

  const exportToPDF = () => {
    alert('Eksport do PDF - funkcjonalność w przygotowaniu');
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

          <div className="form-group">
            <label htmlFor="witnesses">Świadkowie wypadku</label>
            <textarea
              id="witnesses"
              name="witnesses"
              value={cardData.witnesses}
              onChange={handleChange}
              rows="2"
              placeholder="Imiona, nazwiska i stanowiska świadków"
            />
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
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Zapisz kartę wypadku
          </button>
          <button type="button" className="export-btn" onClick={exportToPDF}>
            Eksportuj do PDF
          </button>
          <button type="button" className="print-btn" onClick={() => window.print()}>
            Drukuj
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccidentCard;
