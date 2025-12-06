import React, { useState, useEffect } from 'react';

function Section8({ formData, updateFormData, onNext, onPrev }) {
  const [analysis, setAnalysis] = useState({
    hasWhen: false,
    hasWhere: false,
    hasWhatDoing: false,
    hasHowHappened: false,
    hasWhyCause: false,
    hasConsequence: false
  });
  
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock API - symulacja wywołania asystenta AI
  const callAIAssistant = async (description) => {
    setIsAnalyzing(true);
    
    // Symulacja opóźnienia API (500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock odpowiedzi od API
    const mockApiResponse = {
      aspects: [
        {
          name: 'when',
          status: /(\d{1,2}:\d{2}|godzin|około|o\s+\d|rano|wieczór|po południu|dnia|w dniu|podczas|w trakcie|w momencie gdy)/i.test(description) ? 'ok' : 'missing',
          userMessage: 'Dodaj precyzyjną godzinę wystąpienia wypadku. Przykład: "O godzinie 14:30, podczas..." lub "Około godziny 10:00 rano..."'
        },
        {
          name: 'where',
          status: /(w miejscu|na stanowisku|w pomieszczeniu|w hali|w biurze|na|w|przy|obok|znajduje się|zlokalizow|lokalizacja|obszar|miejsce|strefa)/i.test(description) ? 'ok' : 'missing',
          userMessage: 'Wskaż dokładną lokalizację: nazwę pomieszczenia, halę, stanowisko pracy lub konkretny obszar. Przykład: "W hali produkcyjnej nr 2, przy stanowisku pakowania..."'
        },
        {
          name: 'what_doing',
          status: /(wykonywał|wykonywała|pracował|pracowała|zajmował się|zajmowała się|obsługiwał|obsługiwała|przygotowywał|przygotowywała|realizował|realizowała|podczas|w trakcie)/i.test(description) ? 'ok' : 'missing',
          userMessage: 'Opisz szczegółowo, co dokładnie robiła osoba poszkodowana w momencie wypadku. Przykład: "Pracownik zajmował się pakowaniem produktów na palety..."'
        },
        {
          name: 'how_happened',
          status: /(nagle|następnie|po czym|w wyniku|wówczas|wtedy|w efekcie|potem|później|najpierw|za chwilę|niespodziewanie|nieoczekiwanie)/i.test(description) ? 'ok' : 'incomplete',
          userMessage: 'Opisz krok po kroku przebieg wypadku. Użyj słów typu: "najpierw", "następnie", "nagle", "w wyniku czego".'
        },
        {
          name: 'why_cause',
          status: /(ponieważ|dlatego że|z powodu|z uwagi|ze względu|spowodowane|przyczyna|wynika|na skutek|w wyniku|przez co|wobec czego)/i.test(description) ? 'ok' : 'missing',
          userMessage: 'Wyjaśnij, co było bezpośrednią przyczyną wypadku. Przykład: "Wypadek wydarzył się z powodu braku oznakowania mokrej podłogi..."'
        },
        {
          name: 'consequence',
          status: /(uraz|obrażenie|rana|złamanie|skręcenie|stłuczenie|uszkodzenie|ból|krwawienie|upadek|doznał|doznała|w wyniku czego|co spowodowało|skutkowało)/i.test(description) ? 'ok' : 'incomplete',
          userMessage: 'Wskaż, jakie urazy odniosła osoba poszkodowana bezpośrednio w wyniku wypadku. Przykład: "W wyniku upadku doznał złamania nadgarstka prawej ręki..."'
        }
      ]
    };
    
    setIsAnalyzing(false);
    return mockApiResponse;
  };

  const analyzeDescription = async (description) => {
    // Wywołanie mock API
    const apiResponse = await callAIAssistant(description);
    
    // Przetworzenie odpowiedzi z API
    const analysisResult = {
      hasWhen: apiResponse.aspects.find(a => a.name === 'when')?.status === 'ok',
      hasWhere: apiResponse.aspects.find(a => a.name === 'where')?.status === 'ok',
      hasWhatDoing: apiResponse.aspects.find(a => a.name === 'what_doing')?.status === 'ok',
      hasHowHappened: apiResponse.aspects.find(a => a.name === 'how_happened')?.status === 'ok',
      hasWhyCause: apiResponse.aspects.find(a => a.name === 'why_cause')?.status === 'ok',
      hasConsequence: apiResponse.aspects.find(a => a.name === 'consequence')?.status === 'ok'
    };

    setAnalysis(analysisResult);
    generateRecommendations(apiResponse.aspects, description);
    setIsChecked(true);
  };

  const generateRecommendations = (aspects, description) => {
    const recommendations = [];

    aspects.forEach(aspect => {
      if (aspect.status === 'missing') {
        recommendations.push({
          priority: 'high',
          aspectName: aspect.name,
          title: getAspectTitle(aspect.name),
          message: aspect.userMessage
        });
      } else if (aspect.status === 'incomplete') {
        recommendations.push({
          priority: 'medium',
          aspectName: aspect.name,
          title: getAspectTitle(aspect.name),
          message: aspect.userMessage
        });
      }
    });

    // Sprawdź czy wszystko jest OK
    const allOk = aspects.every(a => a.status === 'ok');
    if (allOk) {
      recommendations.push({
        priority: 'success',
        title: 'Doskonały opis wypadku!',
        message: 'Twój opis zawiera wszystkie kluczowe elementy wymagane do prawidłowego zgłoszenia wypadku. Dokument będzie kompletny i czytelny dla służb ZUS.'
      });
    }

    setAiRecommendations(recommendations);
  };

  const getAspectTitle = (aspectName) => {
    const titles = {
      'when': 'Brak dokładnego czasu wypadku',
      'where': 'Niewystarczające określenie miejsca',
      'what_doing': 'Brak opisu wykonywanych czynności',
      'how_happened': 'Brak sekwencji zdarzeń',
      'why_cause': 'Nie wskazano przyczyny wypadku',
      'consequence': 'Brak opisu skutków wypadku'
    };
    return titles[aspectName] || 'Uwaga';
  };

  // Reset sprawdzenia gdy użytkownik zmienia tekst
  useEffect(() => {
    if (formData.accidentDescription && formData.accidentDescription.length > 20) {
      setShowAnalysis(true);
      // Reset flagi sprawdzenia gdy tekst się zmienił
      if (isChecked) {
        setIsChecked(false);
      }
    } else {
      setShowAnalysis(false);
      setIsChecked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.accidentDescription]);

  const handleCheckText = async () => {
    if (formData.accidentDescription && formData.accidentDescription.length > 20) {
      await analyzeDescription(formData.accidentDescription);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Jeśli tekst nie został sprawdzony, wykonaj sprawdzenie przed przejściem dalej
    if (!isChecked && formData.accidentDescription && formData.accidentDescription.length > 20) {
      await analyzeDescription(formData.accidentDescription);
      
      // Po analizie sprawdź czy są problemy
      const score = getCompletionScore();
      if (score < 100) {
        const confirmMessage = `⚠️ Wykryto problemy z opisem wypadku!\n\nKompletność opisu: ${score}%\n\nBrakujące elementy mogą spowodować odrzucenie zgłoszenia przez ZUS.\n\nCzy na pewno chcesz przejść dalej bez poprawienia opisu?`;
        
        if (!window.confirm(confirmMessage)) {
          return; // Nie przechodzimy dalej
        }
      }
    } else if (isChecked) {
      // Sprawdź wynik jeśli był już sprawdzony
      const score = getCompletionScore();
      if (score < 100) {
        const confirmMessage = `⚠️ Wykryto problemy z opisem wypadku!\n\nKompletność opisu: ${score}%\n\nBrakujące elementy mogą spowodować odrzucenie zgłoszenia przez ZUS.\n\nCzy na pewno chcesz przejść dalej bez poprawienia opisu?`;
        
        if (!window.confirm(confirmMessage)) {
          return; // Nie przechodzimy dalej
        }
      }
    }
    
    onNext();
  };

  const isFormValid = () => {
    return formData.accidentDate &&
           formData.accidentTime &&
           formData.accidentLocation &&
           formData.plannedStartTime &&
           formData.plannedEndTime &&
           formData.injuryType &&
           formData.accidentDescription &&
           formData.wasFirstAidGiven !== '' &&
           formData.investigatingAuthority &&
           formData.wasMachineryInvolved !== '';
  };

  const getCompletionScore = () => {
    const totalCriteria = 6;
    const metCriteria = Object.values(analysis).filter(val => val === true).length;
    return Math.round((metCriteria / totalCriteria) * 100);
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 8: Informacja o wypadku</h2>
      
      <form onSubmit={handleSubmit}>
        {/* BASIC INFORMATION */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Podstawowe informacje
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="required">Data wypadku</label>
              <input
                type="date"
                value={formData.accidentDate}
                onChange={(e) => updateFormData('accidentDate', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="required">Godzina wypadku</label>
              <input
                type="time"
                value={formData.accidentTime}
                onChange={(e) => updateFormData('accidentTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="required">Miejsce wypadku</label>
            <input
              type="text"
              value={formData.accidentLocation}
              onChange={(e) => updateFormData('accidentLocation', e.target.value)}
              placeholder="Wprowadź miejsce wypadku"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="required">Planowana godzina rozpoczęcia pracy</label>
              <input
                type="time"
                value={formData.plannedStartTime}
                onChange={(e) => updateFormData('plannedStartTime', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="required">Planowana godzina zakończenia pracy</label>
              <input
                type="time"
                value={formData.plannedEndTime}
                onChange={(e) => updateFormData('plannedEndTime', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* INJURIES AND DESCRIPTION */}
        <div style={{ 
          background: '#fff9f0', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '2px solid #ffa726'
        }}>
          <h3 style={{ color: '#f57c00', marginBottom: '1rem', fontSize: '1.1rem' }}>
            ⚠️ Opis wypadku i urazów (kluczowa sekcja)
          </h3>

          <div className="form-group">
            <label className="required">Rodzaj doznanych urazów</label>
            <textarea
              value={formData.injuryType}
              onChange={(e) => updateFormData('injuryType', e.target.value)}
              placeholder="Opisz rodzaj doznanych urazów, np: złamanie nadgarstka prawej ręki, głębokie skaleczenie lewej dłoni, stłuczenie kolana..."
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ffa726',
                borderRadius: '6px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="required">
              Szczegółowy opis okoliczności, miejsca i przyczyn wypadku
            </label>
            <div style={{ 
              background: '#e3f2fd', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              marginBottom: '0.5rem',
              fontSize: '0.85rem',
              color: '#1565c0'
            }}>
              <strong>💡 Wskazówka:</strong> Dobry opis powinien zawierać:
              <ul style={{ margin: '0.5rem 0 0 1.5rem', paddingLeft: 0 }}>
                <li>Kiedy dokładnie doszło do wypadku (godzina, okoliczności)</li>
                <li>Gdzie dokładnie miało miejsce zdarzenie</li>
                <li>Co robiła osoba poszkodowana w tym momencie</li>
                <li>Jak przebiegał wypadek krok po kroku</li>
                <li>Co było przyczyną wypadku</li>
                <li>Jakie były skutki (urazy)</li>
              </ul>
            </div>
            <textarea
              value={formData.accidentDescription}
              onChange={(e) => updateFormData('accidentDescription', e.target.value)}
              placeholder="Przykład: O godzinie 14:30 w hali produkcyjnej nr 2, przy stanowisku pakowania, pracownik zajmował się układaniem paczek na palecie. Podczas podnoszenia ciężkiej skrzynki (ok. 25 kg), poślizgnął się na mokrej podłodze, ponieważ wcześniej została ona umyta bez oznakowania. W wyniku upadku doznał złamania nadgarstka prawej ręki oraz silnego stłuczenia kolana..."
              rows="8"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: showAnalysis && getCompletionScore() < 100 ? '2px solid #ff9800' : '2px solid #4caf50',
                borderRadius: '6px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxShadow: showAnalysis ? '0 0 10px rgba(255, 152, 0, 0.2)' : 'none'
              }}
              required
            />
          </div>

          {/* PRZYCISK SPRAWDŹ TEKST */}
          {formData.accidentDescription && formData.accidentDescription.length > 20 && (
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={handleCheckText}
                disabled={isAnalyzing}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: isChecked ? '#4caf50' : '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  opacity: isAnalyzing ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <span style={{ 
                      display: 'inline-block', 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></span>
                    Analizuję...
                  </>
                ) : isChecked ? (
                  <>✅ Sprawdzono</>
                ) : (
                  <>🔍 Sprawdź tekst</>
                )}
              </button>

              {/* STATUS INDICATORS - DIODY */}
              {isChecked && (
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <StatusLED status={analysis.hasWhen} label="Kiedy" />
                  <StatusLED status={analysis.hasWhere} label="Gdzie" />
                  <StatusLED status={analysis.hasWhatDoing} label="Co robił" />
                  <StatusLED status={analysis.hasHowHappened} label="Jak" />
                  <StatusLED status={analysis.hasWhyCause} label="Dlaczego" />
                  <StatusLED status={analysis.hasConsequence} label="Skutki" />
                </div>
              )}
            </div>
          )}

          {/* AI ANALYSIS SECTION */}
          {showAnalysis && isChecked && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{
                background: getCompletionScore() === 100 ? '#e8f5e9' : '#fff3e0',
                border: `2px solid ${getCompletionScore() === 100 ? '#4caf50' : '#ff9800'}`,
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                    {getCompletionScore() === 100 ? '✅' : '🤖'}
                  </span>
                  <h4 style={{ color: '#333', margin: 0 }}>
                    Analiza AI: Kompletność opisu ({getCompletionScore()}%)
                  </h4>
                </div>

                {/* Visual Indicators */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '0.75rem',
                  marginBottom: '1.5rem'
                }}>
                  <IndicatorItem 
                    label="Kiedy?" 
                    met={analysis.hasWhen} 
                    icon="🕐"
                  />
                  <IndicatorItem 
                    label="Gdzie?" 
                    met={analysis.hasWhere} 
                    icon="📍"
                  />
                  <IndicatorItem 
                    label="Co robił?" 
                    met={analysis.hasWhatDoing} 
                    icon="👷"
                  />
                  <IndicatorItem 
                    label="Jak doszło?" 
                    met={analysis.hasHowHappened} 
                    icon="📋"
                  />
                  <IndicatorItem 
                    label="Dlaczego?" 
                    met={analysis.hasWhyCause} 
                    icon="❓"
                  />
                  <IndicatorItem 
                    label="Skutki" 
                    met={analysis.hasConsequence} 
                    icon="🩹"
                  />
                </div>

                {/* Recommendations */}
                {aiRecommendations.length > 0 && (
                  <div>
                    <h5 style={{ color: '#555', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      📝 Rekomendacje AI dla Twojego przypadku:
                    </h5>
                    {aiRecommendations.map((rec, index) => (
                      <div
                        key={index}
                        style={{
                          background: rec.priority === 'success' ? '#c8e6c9' : 
                                     rec.priority === 'high' ? '#ffcdd2' : '#fff9c4',
                          border: `1px solid ${rec.priority === 'success' ? '#4caf50' : 
                                               rec.priority === 'high' ? '#f44336' : '#fbc02d'}`,
                          borderRadius: '6px',
                          padding: '0.75rem',
                          marginBottom: '0.5rem'
                        }}
                      >
                        <strong style={{ 
                          display: 'block', 
                          marginBottom: '0.25rem',
                          color: rec.priority === 'success' ? '#2e7d32' : 
                                 rec.priority === 'high' ? '#c62828' : '#f57f17'
                        }}>
                          {rec.priority === 'high' && '⚠️ '}
                          {rec.priority === 'medium' && 'ℹ️ '}
                          {rec.priority === 'success' && '✅ '}
                          {rec.title}
                        </strong>
                        <span style={{ fontSize: '0.9rem', color: '#555' }}>
                          {rec.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* OTHER INFORMATION */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Dodatkowe informacje
          </h3>

        <div className="form-group">
          <label className="required">Czy była udzielona pierwsza pomoc medyczna?</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="first-aid-yes"
                name="wasFirstAidGiven"
                value="Tak"
                checked={formData.wasFirstAidGiven === 'Tak'}
                onChange={(e) => updateFormData('wasFirstAidGiven', e.target.value)}
              />
              <label htmlFor="first-aid-yes">Tak</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="first-aid-no"
                name="wasFirstAidGiven"
                value="Nie"
                checked={formData.wasFirstAidGiven === 'Nie'}
                onChange={(e) => updateFormData('wasFirstAidGiven', e.target.value)}
              />
              <label htmlFor="first-aid-no">Nie</label>
            </div>
          </div>
        </div>

        {formData.wasFirstAidGiven === 'Tak' && (
          <div className="form-group">
            <label className="required">Nazwa i adres placówki służby zdrowia</label>
            <textarea
              value={formData.healthFacilityInfo}
              onChange={(e) => updateFormData('healthFacilityInfo', e.target.value)}
              placeholder="Wprowadź nazwę i adres placówki służby zdrowia"
              rows="2"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label className="required">Organ, który prowadził postępowanie w sprawie wypadku</label>
          <textarea
            value={formData.investigatingAuthority}
            onChange={(e) => updateFormData('investigatingAuthority', e.target.value)}
            placeholder="Podaj nazwę i adres organu, który prowadził postępowanie (np. policja, prokuratura)"
            rows="2"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            required
          />
        </div>

        <div className="form-group">
          <label className="required">Czy wypadek powstał podczas obsługi maszyn, urządzeń?</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="machinery-yes"
                name="wasMachineryInvolved"
                value="Tak"
                checked={formData.wasMachineryInvolved === 'Tak'}
                onChange={(e) => updateFormData('wasMachineryInvolved', e.target.value)}
              />
              <label htmlFor="machinery-yes">Tak</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="machinery-no"
                name="wasMachineryInvolved"
                value="Nie"
                checked={formData.wasMachineryInvolved === 'Nie'}
                onChange={(e) => updateFormData('wasMachineryInvolved', e.target.value)}
              />
              <label htmlFor="machinery-no">Nie</label>
            </div>
          </div>
        </div>

        {formData.wasMachineryInvolved === 'Tak' && (
          <>
            <div className="form-group">
              <label className="required">
                Czy maszyna, urządzenie były sprawne i użytkowane zgodnie z zasadami producenta?
              </label>
              <textarea
                value={formData.machineryCondition}
                onChange={(e) => updateFormData('machineryCondition', e.target.value)}
                placeholder="Opisz czy maszyna/urządzenie były sprawne i w jaki sposób były użytkowane"
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <div className="form-group">
              <label className="required">Czy maszyna, urządzenie posiada atest/deklarację zgodności?</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="cert-yes"
                    name="hasCertification"
                    value="Tak"
                    checked={formData.hasCertification === 'Tak'}
                    onChange={(e) => updateFormData('hasCertification', e.target.value)}
                  />
                  <label htmlFor="cert-yes">Tak</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="cert-no"
                    name="hasCertification"
                    value="Nie"
                    checked={formData.hasCertification === 'Nie'}
                    onChange={(e) => updateFormData('hasCertification', e.target.value)}
                  />
                  <label htmlFor="cert-no">Nie</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="required">
                Czy maszyna, urządzenie zostało wpisane do ewidencji środków trwałych?
              </label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="inventory-yes"
                    name="isInInventory"
                    value="Tak"
                    checked={formData.isInInventory === 'Tak'}
                    onChange={(e) => updateFormData('isInInventory', e.target.value)}
                  />
                  <label htmlFor="inventory-yes">Tak</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="inventory-no"
                    name="isInInventory"
                    value="Nie"
                    checked={formData.isInInventory === 'Nie'}
                    onChange={(e) => updateFormData('isInInventory', e.target.value)}
                  />
                  <label htmlFor="inventory-no">Nie</label>
                </div>
              </div>
            </div>
          </>
        )}
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onPrev}
          >
            Wstecz
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!isFormValid()}
          >
            Dalej
          </button>
        </div>
      </form>
    </div>
  );
}

// Helper component for visual indicators
function IndicatorItem({ label, met, icon }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem',
      background: met ? '#c8e6c9' : '#ffcdd2',
      border: `2px solid ${met ? '#4caf50' : '#f44336'}`,
      borderRadius: '6px',
      fontSize: '0.85rem'
    }}>
      <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{icon}</span>
      <span style={{ fontWeight: '500', color: '#333' }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>
        {met ? '✅' : '❌'}
      </span>
    </div>
  );
}

// Komponent diody LED statusu
function StatusLED({ status, label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.3rem 0.6rem',
      background: status ? '#e8f5e9' : '#ffebee',
      borderRadius: '12px',
      border: `1px solid ${status ? '#4caf50' : '#f44336'}`,
      fontSize: '0.75rem',
      fontWeight: '600'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: status ? '#4caf50' : '#f44336',
        boxShadow: status ? '0 0 6px #4caf50' : '0 0 6px #f44336',
        animation: status ? 'none' : 'pulse 2s ease-in-out infinite'
      }}></div>
      <span style={{ color: status ? '#2e7d32' : '#c62828' }}>
        {label}
      </span>
    </div>
  );
}

export default Section8;
