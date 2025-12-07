import React from 'react';

function DataConsistency({ data, comparisonData }) {
  const checkCategories = [
    { key: 'dates', label: 'Daty', icon: '📅' },
    { key: 'circumstances', label: 'Okoliczności wypadku', icon: '📋' },
    { key: 'location', label: 'Miejsce wypadku', icon: '📍' },
    { key: 'victim', label: 'Dane poszkodowanego', icon: '👤' },
    { key: 'witnesses', label: 'Świadkowie wypadku', icon: '👥' },
    { key: 'causes', label: 'Przyczyny wypadku', icon: '🔍' }
  ];

  const isComparisonMode = comparisonData !== null && comparisonData !== undefined;

  return (
    <div className="data-consistency-section">
      <h2>Spójność Danych w Dokumentach</h2>
      <p className="section-description">
        {isComparisonMode 
          ? 'Weryfikacja zgodności informacji pomiędzy dokumentami PDF i DOCX' 
          : 'Analiza kompletności danych z dokumentu PDF'}
      </p>
      
      {!isComparisonMode && (
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '1rem', 
          borderRadius: '6px', 
          marginBottom: '1.5rem',
          border: '1px solid #90caf9'
        }}>
          <p style={{ margin: 0, color: '#1976d2' }}>
            ℹ️ Analiza oparta tylko na dokumencie PDF. Dodaj wyjaśnienie poszkodowanego (DOCX) dla automatycznego porównania danych.
          </p>
        </div>
      )}

      <div className="consistency-grid">
        {checkCategories.map(category => {
          const categoryData = data[category.key] || { consistent: null, details: 'Brak danych' };
          const isConsistent = categoryData.consistent;
          
          return (
            <div 
              key={category.key}
              className={`consistency-card ${isConsistent === true ? 'consistent' : isConsistent === false ? 'inconsistent' : 'unknown'}`}
            >
              <div className="consistency-icon">{category.icon}</div>
              <h3>{category.label}</h3>
              <div className="consistency-status">
                {isConsistent === true && <span className="status-badge success">✓ Zgodne</span>}
                {isConsistent === false && <span className="status-badge error">✗ Rozbieżności</span>}
                {isConsistent === null && <span className="status-badge unknown">? Brak weryfikacji</span>}
              </div>
              <p className="consistency-details">{categoryData.details}</p>
            </div>
          );
        })}
      </div>

      <div className="summary-box">
        <h3>Podsumowanie weryfikacji</h3>
        <p>
          {isComparisonMode 
            ? comparisonData?.summary || 'System przeprowadził porównanie dokumentów PDF i DOCX. Sprawdź wyniki powyżej.'
            : 'Analiza oparta na pojedynczym dokumencie PDF. Wszystkie dostępne dane zostały wyekstrahowane i zweryfikowane pod kątem kompletności.'}
        </p>
      </div>
    </div>
  );
}

export default DataConsistency;
