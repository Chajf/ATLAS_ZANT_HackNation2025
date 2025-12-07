import React from 'react';

function ExplanationSection({ analysisData }) {
  return (
    <div className="explanation-section">
      <h2>Wyjaśnienie Decyzji</h2>
      <p className="section-description">
        Szczegółowe uzasadnienie stanowiska w sprawie uznania zdarzenia za wypadek przy pracy
      </p>

      <div className="explanation-content">
        <div className="explanation-block">
          <h3>📋 Analiza związków przyczynowo-skutkowych</h3>
          <div className="explanation-text">
            <h4>Związek przyczynowy:</h4>
            <p>{analysisData?.causal?.causalRelation?.description}</p>
            
            <h4>Związek czasowy:</h4>
            <p>{analysisData?.causal?.timeRelation?.description}</p>
            
            <h4>Związek miejscowy:</h4>
            <p>{analysisData?.causal?.placeRelation?.description}</p>
            
            <h4>Związek funkcjonalny:</h4>
            <p>{analysisData?.causal?.functionalRelation?.description}</p>
          </div>
        </div>

        <div className="explanation-block">
          <h3>🔍 Weryfikacja spójności dokumentów</h3>
          <div className="explanation-text">
            <p>
              Podczas analizy dokumentacji stwierdzono następujące elementy:
            </p>
            <ul>
              <li>
                <strong>Zgodność dat:</strong> {analysisData?.consistency?.dates?.details}
              </li>
              <li>
                <strong>Okoliczności zdarzenia:</strong> {analysisData?.consistency?.circumstances?.details}
              </li>
              <li>
                <strong>Miejsce wypadku:</strong> {analysisData?.consistency?.location?.details}
              </li>
              <li>
                <strong>Świadkowie:</strong> {analysisData?.consistency?.witnesses?.details}
              </li>
            </ul>
          </div>
        </div>

        <div className="explanation-block">
          <h3>⚖️ Podstawa prawna</h3>
          <div className="explanation-text">
            <p>
              Zgodnie z art. 3 ust. 1 ustawy z dnia 30 października 2002 r. o ubezpieczeniu 
              społecznym z tytułu wypadków przy pracy i chorób zawodowych (Dz.U. 2022 poz. 2189), 
              za wypadek przy pracy uważa się nagłe zdarzenie wywołane przyczyną zewnętrzną 
              powodujące uraz lub śmierć, które nastąpiło w związku z pracą.
            </p>
          </div>
        </div>

        <div className="explanation-block highlight">
          <h3>📌 Wnioski</h3>
          <div className="explanation-text">
            {analysisData?.eligibility?.decision === 'approved' && (
              <p>
                Na podstawie analizy przedstawionej dokumentacji oraz obowiązujących przepisów 
                prawa, zdarzenie spełnia wszystkie kryteria definicyjne wypadku przy pracy. 
                Stwierdzone zostały wszystkie wymagane związki: przyczynowy, czasowy, miejscowy 
                i funkcjonalny.
              </p>
            )}
            {analysisData?.eligibility?.decision === 'rejected' && (
              <p>
                Na podstawie analizy przedstawionej dokumentacji stwierdzono, że zdarzenie 
                nie spełnia kryteriów definicyjnych wypadku przy pracy ze względu na brak 
                wymaganych związków lub niespełnienie innych warunków określonych w przepisach.
              </p>
            )}
            {analysisData?.eligibility?.decision === 'investigation_needed' && (
              <p>
                Przedstawiona dokumentacja nie pozwala na jednoznaczne podjęcie decyzji 
                o uznaniu lub odmowie uznania zdarzenia za wypadek przy pracy. Konieczne 
                jest przeprowadzenie postępowania wyjaśniającego oraz uzyskanie dodatkowych 
                dokumentów wskazanych w sekcji oceny kwalifikowalności.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplanationSection;
