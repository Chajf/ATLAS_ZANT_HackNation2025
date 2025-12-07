import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

function EligibilityAssessment({ analysisData, onAssessmentComplete }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [victimDescription, setVictimDescription] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      // Extract victim's description from analysisData
      const description = analysisData?.extractedData?.accidentDescription || 
                         analysisData?.extractedData?.explanationText ||
                         '';
      
      setVictimDescription(description);

      if (!description) {
        setError('Brak opisu zdarzenia do oceny.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.ASSESS_WORKPLACE_ACCIDENT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ description }),
        });

        if (!response.ok) {
          throw new Error('Nie udało się przeprowadzić oceny');
        }

        const data = await response.json();
        setAssessment(data);
        // Pass assessment data to parent component
        if (onAssessmentComplete) {
          onAssessmentComplete(data);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching assessment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [analysisData, onAssessmentComplete]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return '#039b45';
      case 'warning': return '#FFC107';
      case 'danger': return '#e74c3c';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return '✓';
      case 'warning': return '⚠';
      case 'danger': return '✗';
      default: return '?';
    }
  };

  const [expandedCriteria, setExpandedCriteria] = useState({});

  const toggleDescription = (key) => {
    setExpandedCriteria(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const criteria = [
    {
      key: 'sudden',
      title: 'Nagłość zdarzenia',
      fullDescription: 'Wypadek przy pracy jest zdarzeniem nagłym, spowodowanym przez przyczynę zewnętrzną. Przez nagłość rozumiemy natychmiastowe ujawnienie się przyczyny zewnętrznej, która wywołała określone skutki, lub działanie tej przyczyny przez pewien okres, ale nie dłużej niż przez jedną dniówkę roboczą. Zdarzeniem nagłym może być np. wybuch, upadek, zderzenie, porażenie jak również hałas, działanie niskich lub wysokich temperatur albo promieniowania.'
    },
    {
      key: 'external',
      title: 'Przyczyna zewnętrzna prowadząca do urazu lub śmierci',
      fullDescription: 'O przyczynie zewnętrznej możemy mówić jeśli do urazu doszło w wyniku oddziaływania na człowieka czynnika występującego poza jego organizmem. Do przyczyn zewnętrznych zaliczamy czynniki działające z zewnątrz, które spowodowały wypadek lub przyczyniły się do jego powstania, np. działanie ruchomych lub ostrych elementów maszyn i urządzeń, energia elektryczna, działanie ekstremalnych temperatur, substancje chemiczne powodujące zatrucie, spadający przedmiot uderzający człowieka, działanie sił natury, nietypowe warunki w miejscu pracy (np. śliska podłoga, porozrzucane przedmioty).'
    },
    {
      key: 'work',
      title: 'Związek z pracą (przyczynowy, czasowy, miejscowy, funkcjonalny)',
      fullDescription: 'Między wypadkiem a pracą musi zachodzić ścisły związek przyczynowy, czasowy, miejscowy i funkcjonalny. Chronione z tytułu ubezpieczenia wypadkowego są te zdarzenia, do których doszło podczas wykonywania zwykłych czynności związanych z prowadzeniem pozarolniczej działalności. Musi być spełniony związek: przyczynowy (praca doprowadziła do wypadku), czasowy (podczas godzin pracy), miejscowy (w miejscu pracy) i funkcjonalny (wykonywanie czynności służbowych).'
    },
    {
      key: 'injury',
      title: 'Skutek - uraz lub śmierć',
      fullDescription: 'Urazem jest uszkodzenie tkanek ciała (np. skaleczenie, stłuczenie) lub narządów (np. zwichnięcie kończyny, wstrząśnienie mózgu) człowieka wskutek działania czynnika zewnętrznego. Skutkiem wypadku może być także śmierć poszkodowanego.'
    }
  ];

  if (loading) {
    return (
      <div className="eligibility-section">
        <h2>Ocena Kwalifikowalności do Ubezpieczenia</h2>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Analizuję opis zdarzenia...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="eligibility-section">
        <h2>Ocena Kwalifikowalności do Ubezpieczenia</h2>
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="eligibility-section">
      <h2>Ocena Kwalifikowalności do Ubezpieczenia</h2>
      <p className="section-description">
        Automatyczna ocena opisu zdarzenia pod kątem spełnienia kryteriów wypadku przy pracy
      </p>

      {/* Victim's Description */}
      <div className="victim-description-frame">
        <h3>Opis zdarzenia od poszkodowanego:</h3>
        <div className="description-content">
          {victimDescription}
        </div>
      </div>

      {/* Criteria Assessment Grid */}
      <div className="criteria-assessment-grid">
        {criteria.map(criterion => {
          const criterionData = assessment[criterion.key];
          const color = getStatusColor(criterionData.status);
          const icon = getStatusIcon(criterionData.status);
          const isExpanded = expandedCriteria[criterion.key];
          
          return (
            <div 
              key={criterion.key}
              className="criterion-card"
              style={{ borderColor: color }}
            >
              <div className="criterion-header" style={{ backgroundColor: color }}>
                <span className="criterion-icon">{icon}</span>
                <h3>{criterion.title}</h3>
              </div>
              <div className="criterion-body">
                <div className="criterion-assessment">
                  <strong>Ocena asystenta AI:</strong>
                  <p>{criterionData.description}</p>
                </div>
                <div className="criterion-legal-toggle">
                  <button 
                    className="toggle-description-btn"
                    onClick={() => toggleDescription(criterion.key)}
                  >
                    {isExpanded ? '▼ Ukryj wymóg prawny' : '▶ Pokaż wymóg prawny'}
                  </button>
                  {isExpanded && (
                    <div className="criterion-full-desc">
                      <p>{criterion.fullDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Information Box */}
      <div className="info-message">
        <strong>ℹ️ Informacja:</strong> Zdarzenie powinno zostać uznane za wypadek przy pracy jeżeli spełnia 
        wszystkie powyższe kryteria: było zdarzeniem nagłym, spowodowanym przez przyczynę zewnętrzną, 
        która doprowadziła do urazu lub śmierci, i zachodzi ścisły związek przyczynowy, czasowy, 
        miejscowy i funkcjonalny z wykonywaną pracą.
      </div>
    </div>
  );
}

export default EligibilityAssessment;
