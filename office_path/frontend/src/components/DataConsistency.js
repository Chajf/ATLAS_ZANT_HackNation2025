import React from 'react';

function DataConsistency({ data }) {
  const checkCategories = [
    { key: 'dates', label: 'Daty', icon: '📅' },
    { key: 'circumstances', label: 'Okoliczności wypadku', icon: '📋' },
    { key: 'location', label: 'Miejsce wypadku', icon: '📍' },
    { key: 'victim', label: 'Dane poszkodowanego', icon: '👤' },
    { key: 'witnesses', label: 'Świadkowie wypadku', icon: '👥' },
    { key: 'causes', label: 'Przyczyny wypadku', icon: '🔍' }
  ];

  return (
    <div className="data-consistency-section">
      <h2>Spójność Danych w Dokumentach</h2>
      <p className="section-description">
        Weryfikacja zgodności informacji pomiędzy różnymi dokumentami
      </p>

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
          System zidentyfikował rozbieżności w dokumentach, które wymagają wyjaśnienia 
          przed podjęciem ostatecznej decyzji o uznaniu zdarzenia za wypadek przy pracy.
        </p>
      </div>
    </div>
  );
}

export default DataConsistency;
