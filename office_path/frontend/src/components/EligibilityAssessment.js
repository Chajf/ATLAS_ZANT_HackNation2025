import React from 'react';

function EligibilityAssessment({ data }) {
  const getDecisionInfo = (decision) => {
    switch (decision) {
      case 'approved':
        return {
          title: 'Zdarzenie uznane za wypadek przy pracy',
          color: '#4CAF50',
          icon: '✓',
          description: 'Zdarzenie spełnia wszystkie kryteria wypadku przy pracy zgodnie z obowiązującymi przepisami.'
        };
      case 'rejected':
        return {
          title: 'Zdarzenie nieuznaane za wypadek przy pracy',
          color: '#F44336',
          icon: '✗',
          description: 'Zdarzenie nie spełnia kryteriów wypadku przy pracy.'
        };
      case 'investigation_needed':
        return {
          title: 'Wymagane postępowanie wyjaśniające',
          color: '#FF9800',
          icon: '⚠',
          description: 'Konieczne uzyskanie dodatkowych dokumentów w celu podjęcia ostatecznej decyzji.'
        };
      default:
        return {
          title: 'Oczekuje na ocenę',
          color: '#9E9E9E',
          icon: '?',
          description: 'Trwa analiza dokumentów.'
        };
    }
  };

  const decisionInfo = getDecisionInfo(data.decision);

  return (
    <div className="eligibility-section">
      <h2>Ocena Kwalifikowalności do Ubezpieczenia</h2>
      
      <div 
        className="decision-box"
        style={{ borderColor: decisionInfo.color }}
      >
        <div 
          className="decision-header"
          style={{ backgroundColor: decisionInfo.color }}
        >
          <span className="decision-icon">{decisionInfo.icon}</span>
          <h3>{decisionInfo.title}</h3>
        </div>
        <div className="decision-body">
          <p>{decisionInfo.description}</p>
        </div>
      </div>

      {data.decision === 'investigation_needed' && data.missingDocuments && (
        <div className="missing-documents">
          <h3>Wymagane dodatkowe dokumenty:</h3>
          <ul>
            {data.missingDocuments.map((doc, idx) => (
              <li key={idx}>
                <span className="doc-icon">📄</span>
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.requiresZUSOpinion && (
        <div className="zus-opinion-box">
          <div className="alert-icon">⚕️</div>
          <div className="alert-content">
            <h3>Wymagana opinia Głównego Lekarza Orzecznika ZUS</h3>
            <p>
              W przypadku wątpliwości, czy doznany wskutek wypadku uraz spełnia 
              kryteria definicyjne wypadku przy pracy, konieczne jest pozyskanie 
              opinii Głównego Lekarza Orzecznika ZUS.
            </p>
          </div>
        </div>
      )}

      <div className="criteria-checklist">
        <h3>Kryteria wypadku przy pracy:</h3>
        <div className="checklist">
          <div className="check-item">
            <input type="checkbox" id="criterion1" defaultChecked />
            <label htmlFor="criterion1">Nagłe zdarzenie wywołane przyczyną zewnętrzną</label>
          </div>
          <div className="check-item">
            <input type="checkbox" id="criterion2" defaultChecked />
            <label htmlFor="criterion2">Zdarzenie związane z pracą</label>
          </div>
          <div className="check-item">
            <input type="checkbox" id="criterion3" />
            <label htmlFor="criterion3">Spowodowało uraz lub śmierć</label>
          </div>
          <div className="check-item">
            <input type="checkbox" id="criterion4" defaultChecked />
            <label htmlFor="criterion4">Podczas lub w związku z wykonywaniem zwykłych czynności</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EligibilityAssessment;
