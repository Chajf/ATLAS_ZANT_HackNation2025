import React from 'react';

function CausalDiagram({ data }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'green': return '#039b45';
      case 'yellow': return '#FFC107';
      case 'red': return '#e74c3c';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'green': return '✓';
      case 'yellow': return '⚠';
      case 'red': return '✗';
      default: return '?';
    }
  };

  const relations = [
    { key: 'causalRelation', title: 'Związek przyczynowy', 
      description: 'Dlaczego doszło do wypadku? Jakie zdarzenie było skutkiem zaistniałych okoliczności, które wprost przyczyniły się do jego wystąpienia.' },
    { key: 'timeRelation', title: 'Związek czasowy',
      description: 'Kiedy doszło do zdarzenia? W jakim momencie wykonywania obowiązków służbowych doszło do wypadku.' },
    { key: 'placeRelation', title: 'Związek miejscowy',
      description: 'Gdzie dokładnie miało miejsce zdarzenie? W jakim dokładnie miejscu doszło do zdarzenia.' },
    { key: 'functionalRelation', title: 'Związek funkcjonalny',
      description: 'Co to była za czynność? Czy wykonywana czynność była ściśle związana z obowiązkami zawodowymi?' }
  ];

  return (
    <div className="causal-diagram-section">
      <h2>Schemat Przyczynowo-Skutkowy</h2>
      <p className="section-description">
        Analiza czterech kluczowych związków określających wypadek przy pracy
      </p>

      <div className="diagram-container">
        <div className="diagram-title">Wypadek w pracy</div>
        
        <div className="relations-grid">
          {relations.map(relation => {
            const relationData = data[relation.key];
            const color = getStatusColor(relationData.status);
            const icon = getStatusIcon(relationData.status);
            
            return (
              <div 
                key={relation.key} 
                className="relation-card"
                style={{ borderColor: color }}
              >
                <div className="relation-header" style={{ backgroundColor: color }}>
                  <span className="relation-icon">{icon}</span>
                  <h3>{relation.title}</h3>
                </div>
                <div className="relation-body">
                  <p className="relation-question">{relation.description}</p>
                  <div className="relation-result">
                    <strong>Ocena:</strong> {relationData.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#039b45' }}></span>
            <span>Zielony - Prawidłowo wypełnione i zgadza się</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#FFC107' }}></span>
            <span>Żółty - Połowicznie się zgadza, wymaga wyjaśnienia</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#e74c3c' }}></span>
            <span>Czerwony - Niewypełnione lub się nie zgadza</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CausalDiagram;
