import React, { useState, useEffect } from 'react';

function OfficialStatement({ analysisData, extractedData }) {
  const [formData, setFormData] = useState({
    caseNumber: '',
    victimName: '',
    victimPesel: '',
    employerName: '',
    accidentDate: '',
    decision: analysisData?.eligibility?.decision || 'investigation_needed',
    justification: '',
    officerName: '',
    officerTitle: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Auto-fill form data when extractedData is available
  useEffect(() => {
    if (extractedData) {
      setFormData(prev => ({
        ...prev,
        victimName: `${extractedData.firstName || ''} ${extractedData.lastName || ''}`.trim(),
        victimPesel: extractedData.pesel || '',
        accidentDate: extractedData.accidentDate || '',
        decision: analysisData?.eligibility?.decision || 'investigation_needed'
      }));
    }
  }, [extractedData, analysisData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Statement submitted:', formData);
    alert('Stanowisko zostało zapisane');
  };

  const generateJustification = () => {
    let text = '';
    
    if (analysisData?.eligibility?.decision === 'approved') {
      text = `Po przeprowadzeniu szczegółowej analizy dokumentacji oraz okoliczności zdarzenia, `;
      text += `stwierdzam, że przedmiotowe zdarzenie spełnia wszystkie kryteria wypadku przy pracy `;
      text += `określone w art. 3 ust. 1 ustawy z dnia 30 października 2002 r. o ubezpieczeniu społecznym `;
      text += `z tytułu wypadków przy pracy i chorób zawodowych.\n\n`;
      text += `Zdarzenie charakteryzowało się nagłością, zostało wywołane przyczyną zewnętrzną `;
      text += `i pozostaje w bezpośrednim związku z wykonywaną pracą. Potwierdzone zostały wszystkie `;
      text += `wymagane związki: przyczynowy, czasowy, miejscowy oraz funkcjonalny.`;
    } else if (analysisData?.eligibility?.decision === 'rejected') {
      text = `Po analizie przedstawionej dokumentacji oraz okoliczności zdarzenia, `;
      text += `stwierdzam, że przedmiotowe zdarzenie nie spełnia kryteriów wypadku przy pracy `;
      text += `w rozumieniu art. 3 ust. 1 ustawy z dnia 30 października 2002 r. o ubezpieczeniu społecznym `;
      text += `z tytułu wypadków przy pracy i chorób zawodowych.\n\n`;
      text += `Analiza wykazała brak niezbędnych związków lub niespełnienie innych warunków `;
      text += `określonych w przepisach prawa.`;
    } else {
      text = `Po wstępnej analizie przedstawionej dokumentacji stwierdzam, że w celu podjęcia `;
      text += `ostatecznej decyzji o uznaniu lub odmowie uznania zdarzenia za wypadek przy pracy, `;
      text += `konieczne jest przeprowadzenie postępowania wyjaśniającego.\n\n`;
      text += `Wymaga się uzupełnienia dokumentacji o następujące dokumenty: `;
      text += (analysisData?.eligibility?.missingDocuments || []).join(', ');
      text += `.\n\nDopiero po otrzymaniu kompletnej dokumentacji możliwe będzie wydanie `;
      text += `merytorycznego rozstrzygnięcia w sprawie.`;
    }
    
    setFormData(prev => ({ ...prev, justification: text }));
  };

  return (
    <div className="official-statement-section">
      <h2>Oficjalne Stanowisko</h2>
      <p className="section-description">
        Sformułowanie oficjalnego wniosku stanowiska i jego uzasadnienia
      </p>

      <form onSubmit={handleSubmit} className="statement-form">
        <div className="form-section">
          <h3>Dane sprawy</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="caseNumber">Numer sprawy</label>
              <input
                type="text"
                id="caseNumber"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleChange}
                placeholder="np. WP/2025/001"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="accidentDate">Data wypadku</label>
              <input
                type="date"
                id="accidentDate"
                name="accidentDate"
                value={formData.accidentDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="victimName">Imię i nazwisko poszkodowanego</label>
              <input
                type="text"
                id="victimName"
                name="victimName"
                value={formData.victimName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="victimPesel">PESEL poszkodowanego</label>
              <input
                type="text"
                id="victimPesel"
                name="victimPesel"
                value={formData.victimPesel}
                onChange={handleChange}
                pattern="[0-9]{11}"
                maxLength="11"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="employerName">Nazwa pracodawcy</label>
            <input
              type="text"
              id="employerName"
              name="employerName"
              value={formData.employerName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Stanowisko</h3>
          
          <div className="form-group">
            <label htmlFor="decision">Decyzja</label>
            <select
              id="decision"
              name="decision"
              value={formData.decision}
              onChange={handleChange}
              required
            >
              <option value="approved">Uznanie za wypadek przy pracy</option>
              <option value="rejected">Odmowa uznania za wypadek przy pracy</option>
              <option value="investigation_needed">Postępowanie wyjaśniające</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="justification">Uzasadnienie</label>
            <button 
              type="button" 
              className="generate-btn"
              onClick={generateJustification}
            >
              Generuj uzasadnienie
            </button>
            <textarea
              id="justification"
              name="justification"
              value={formData.justification}
              onChange={handleChange}
              rows="12"
              required
              placeholder="Szczegółowe uzasadnienie stanowiska..."
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Osoba wydająca stanowisko</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="officerName">Imię i nazwisko</label>
              <input
                type="text"
                id="officerName"
                name="officerName"
                value={formData.officerName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="officerTitle">Stanowisko</label>
              <input
                type="text"
                id="officerTitle"
                name="officerTitle"
                value={formData.officerTitle}
                onChange={handleChange}
                placeholder="np. Inspektor ds. wypadków przy pracy"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Data wydania stanowiska</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Zapisz stanowisko
          </button>
          <button type="button" className="preview-btn">
            Podgląd dokumentu
          </button>
        </div>
      </form>
    </div>
  );
}

export default OfficialStatement;
