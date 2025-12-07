import React from 'react';

function EligibilityAssessment({ data }) {
  const getDecisionInfo = (decision) => {
    switch (decision) {
      case 'approved':
        return {
          title: 'Zdarzenie uznane za wypadek przy pracy',
          color: '#039b45',
          icon: '✓',
          description: 'Zdarzenie spełnia wszystkie kryteria wypadku przy pracy zgodnie z obowiązującymi przepisami.'
        };
      case 'rejected':
        return {
          title: 'Zdarzenie nieuznaane za wypadek przy pracy',
          color: '#e74c3c',
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
      case 'conditional_approval':
        return {
          title: 'Warunkowa akceptacja',
          color: '#81cb32',
          icon: '✓',
          description: 'Zdarzenie może zostać uznane za wypadek przy pracy po dopełnieniu formalności.'
        };
      default:
        return {
          title: 'Oczekuje na ocenę',
          color: '#757575',
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

      {data.validationIssues && data.validationIssues.length > 0 && (
        <div className="validation-issues">
          <h3>Wykryte problemy z danymi:</h3>
          {data.validationIssues.map((issue, idx) => (
            <div 
              key={idx}
              className={`validation-issue ${issue.severity}`}
            >
              <span className="severity-icon">
                {issue.severity === 'error' ? '🔴' : issue.severity === 'warning' ? '🟡' : 'ℹ️'}
              </span>
              <div className="issue-content">
                <strong>{issue.field}:</strong> {issue.message}
                {issue.pdf_value && (
                  <div className="value-comparison">
                    <span className="value-label">PDF:</span> <code>{issue.pdf_value}</code>
                    {issue.docx_value && (
                      <>
                        <span className="value-label">DOCX:</span> <code>{issue.docx_value}</code>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
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
