import React, { useState, useEffect } from 'react';

function OfficialStatement({ analysisData, extractedData, assessmentData }) {
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
        employerName: extractedData.employerName || '',
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

  const downloadJSON = () => {
    const jsonData = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stanowisko_${formData.caseNumber || 'draft'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateJustification = async () => {
    if (!assessmentData) {
      alert('Brak danych oceny AI. Przejdź najpierw przez krok Oceny Kwalifikowalności.');
      return;
    }

    try {
      // Show loading state
      setFormData(prev => ({ ...prev, justification: 'Generuję uzasadnienie...' }));

      // Prepare validation issues if available
      const validationIssues = analysisData?.eligibility?.validationIssues || [];

      const response = await fetch('http://localhost:8000/generate-justification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decision: formData.decision,
          assessment: assessmentData,
          validationIssues: validationIssues.length > 0 ? validationIssues : null
        }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się wygenerować uzasadnienia');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, justification: data.justification }));
    } catch (err) {
      console.error('Error generating justification:', err);
      // Fallback to simple justification
      let text = '';
      if (formData.decision === 'approved') {
        text = `Po przeprowadzeniu szczegółowej analizy dokumentacji oraz okoliczności zdarzenia, stwierdzam, że przedmiotowe zdarzenie spełnia wszystkie kryteria wypadku przy pracy określone w art. 3 ust. 1 ustawy z dnia 30 października 2002 r. o ubezpieczeniu społecznym z tytułu wypadków przy pracy i chorób zawodowych.`;
      } else if (formData.decision === 'rejected') {
        text = `Po analizie przedstawionej dokumentacji oraz okoliczności zdarzenia, stwierdzam, że przedmiotowe zdarzenie nie spełnia kryteriów wypadku przy pracy w rozumieniu art. 3 ust. 1 ustawy z dnia 30 października 2002 r. o ubezpieczeniu społecznym z tytułu wypadków przy pracy i chorób zawodowych.`;
      } else {
        text = `Po wstępnej analizie przedstawionej dokumentacji stwierdzam, że w celu podjęcia ostatecznej decyzji o uznaniu lub odmowie uznania zdarzenia za wypadek przy pracy, konieczne jest przeprowadzenie postępowania wyjaśniającego.`;
      }
      setFormData(prev => ({ ...prev, justification: text }));
      alert('Nie udało się połączyć z serwerem AI. Użyto podstawowego uzasadnienia.');
    }
  };

  return (
    <div className="official-statement-section">
      <h2>Oficjalne Stanowisko</h2>
      <p className="section-description">
        Sformułowanie oficjalnego wniosku stanowiska i jego uzasadnienia
      </p>

      {/* VALIDATION ISSUES ALERT */}
      {analysisData?.eligibility?.validationIssues && analysisData.eligibility.validationIssues.length > 0 && (
        <div className="validation-alert" style={{ 
          backgroundColor: '#fff3cd', 
          border: '2px solid #ffc107', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '2rem' 
        }}>
          <h3 style={{ color: '#856404', marginBottom: '1rem' }}>
            ⚠️ Wykryto rozbieżności w dokumentach
          </h3>
          <ul style={{ marginLeft: '1.5rem' }}>
            {analysisData.eligibility.validationIssues
              .filter(issue => issue.severity === 'error' || issue.severity === 'warning')
              .map((issue, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', color: issue.severity === 'error' ? '#d32f2f' : '#f57c00' }}>
                  <strong>{issue.field}:</strong> {issue.message}
                </li>
              ))}
          </ul>
        </div>
      )}

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

        {/* DETAILED EXPLANATION FROM INJURED PERSON (DOCX) */}
        {extractedData?.detailedExplanation && (
          <div className="form-section" style={{ backgroundColor: '#f0f8ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #2196f3' }}>
            <h3>📝 Wyjaśnienie poszkodowanego</h3>
            <div className="info-box">
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#333', marginBottom: '1rem' }}>
                {extractedData.detailedExplanation}
              </p>
              {extractedData.medicalDocuments && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                  <strong>Dokumenty medyczne:</strong>
                  <p style={{ marginTop: '0.5rem' }}>{extractedData.medicalDocuments}</p>
                </div>
              )}
            </div>
            {extractedData.explanationDate && (
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <strong>Data wyjaśnienia:</strong> {extractedData.explanationDate}
              </p>
            )}
          </div>
        )}

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
          <button type="button" className="download-json-btn" onClick={downloadJSON}>
            Pobierz JSON
          </button>
        </div>
      </form>
    </div>
  );
}

export default OfficialStatement;
