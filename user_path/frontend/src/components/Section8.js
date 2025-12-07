import React, { useState, useEffect } from 'react';

function Section8({ formData, updateFormData, onNext, onPrev }) {
  const [analysis, setAnalysis] = useState({
    when: 'danger',
    where: 'danger',
    whatDoing: 'danger',
    howHappened: 'danger',
    whyCause: 'danger',
    consequence: 'danger',
    whenDesc: '',
    whereDesc: '',
    whatDoingDesc: '',
    howHappenedDesc: '',
    whyCauseDesc: '',
    consequenceDesc: ''
  });
  
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTextModified, setIsTextModified] = useState(false);

  // Konfiguracja API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Wywołanie prawdziwego API
  const callAIAssistant = async (description) => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch(`${API_URL}/evaluate-injury`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapowanie odpowiedzi z backendu do formatu używanego przez frontend
      const mappedResponse = {
        aspects: [
          {
            name: 'when',
            status: data.When.Status,
            userMessage: data.When.Description
          },
          {
            name: 'where',
            status: data.Where.Status,
            userMessage: data.Where.Description
          },
          {
            name: 'what_doing',
            status: data.Doing.Status,
            userMessage: data.Doing.Description
          },
          {
            name: 'how_happened',
            status: data.How.Status,
            userMessage: data.How.Description
          },
          {
            name: 'why_cause',
            status: data.Why.Status,
            userMessage: data.Why.Description
          },
          {
            name: 'consequence',
            status: data.Injury.Status,
            userMessage: data.Injury.Description
          }
        ]
      };
      
      setIsAnalyzing(false);
      return mappedResponse;
      
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      setIsAnalyzing(false);
      
      // Fallback do mock response w przypadku błędu
      return {
        aspects: [
          {
            name: 'when',
            status: 'danger',
            userMessage: 'Nie udało się połączyć z serwerem AI. Sprawdź czy backend jest uruchomiony.'
          },
          {
            name: 'where',
            status: 'danger',
            userMessage: 'Nie udało się połączyć z serwerem AI.'
          },
          {
            name: 'what_doing',
            status: 'danger',
            userMessage: 'Nie udało się połączyć z serwerem AI.'
          },
          {
            name: 'how_happened',
            status: 'danger',
            userMessage: 'Nie udało się połączyć z serwerem AI.'
          },
          {
            name: 'why_cause',
            status: 'danger',
            userMessage: 'Nie udało się połączyć z serwerem AI.'
          },
          {
            name: 'consequence',
            status: 'danger',
            userMessage: 'Nie udało się połączyć z serwerem AI.'
          }
        ]
      };
    }
  };

  const analyzeDescription = async (description) => {
    // Wywołanie API
    const apiResponse = await callAIAssistant(description);
    
    // Przetworzenie odpowiedzi z API
    const analysisResult = {
      when: apiResponse.aspects.find(a => a.name === 'when')?.status || 'danger',
      where: apiResponse.aspects.find(a => a.name === 'where')?.status || 'danger',
      whatDoing: apiResponse.aspects.find(a => a.name === 'what_doing')?.status || 'danger',
      howHappened: apiResponse.aspects.find(a => a.name === 'how_happened')?.status || 'danger',
      whyCause: apiResponse.aspects.find(a => a.name === 'why_cause')?.status || 'danger',
      consequence: apiResponse.aspects.find(a => a.name === 'consequence')?.status || 'danger',
      whenDesc: apiResponse.aspects.find(a => a.name === 'when')?.userMessage || '',
      whereDesc: apiResponse.aspects.find(a => a.name === 'where')?.userMessage || '',
      whatDoingDesc: apiResponse.aspects.find(a => a.name === 'what_doing')?.userMessage || '',
      howHappenedDesc: apiResponse.aspects.find(a => a.name === 'how_happened')?.userMessage || '',
      whyCauseDesc: apiResponse.aspects.find(a => a.name === 'why_cause')?.userMessage || '',
      consequenceDesc: apiResponse.aspects.find(a => a.name === 'consequence')?.userMessage || ''
    };

    setAnalysis(analysisResult);
    generateRecommendations(apiResponse.aspects, description);
    setIsChecked(true);
  };

  const generateRecommendations = (aspects, description) => {
    const recommendations = [];

    aspects.forEach(aspect => {
      if (aspect.status === 'danger') {
        recommendations.push({
          priority: 'high',
          aspectName: aspect.name,
          title: getAspectTitle(aspect.name),
          message: aspect.userMessage
        });
      } else if (aspect.status === 'warning') {
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

  // Oznacz tekst jako zmodyfikowany gdy użytkownik zmienia treść po sprawdzeniu
  useEffect(() => {
    // Oznacz że tekst został zmodyfikowany po sprawdzeniu
    if (isChecked && formData.accidentDescription) {
      setIsTextModified(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.accidentDescription]);

  const handleCheckText = async () => {
    if (formData.accidentDescription && formData.accidentDescription.length > 0) {
      setIsTextModified(false);
      setShowAnalysis(true);
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
    const metCriteria = Object.values(analysis).filter(val => val === 'ok').length;
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
              className="textarea-warning"
              required
            />
          </div>

          <div className="form-group">
            <label className="required">
              Szczegółowy opis okoliczności, miejsca i przyczyn wypadku
            </label>
            <div style={{ 
              background: '#e8f5e9', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              marginBottom: '0.5rem',
              fontSize: '0.85rem',
              color: '#005540'
            }}>
              <strong>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '0.25rem' }}>
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                </svg>
                Wskazówka:
              </strong> Dobry opis powinien zawierać:
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
                border: showAnalysis && getCompletionScore() < 100 ? '2px solid #bcd144' : '2px solid #039b45',
                borderRadius: '6px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxShadow: showAnalysis ? '0 0 10px rgba(188, 209, 68, 0.2)' : 'none'
              }}
              required
            />
          </div>

          {/* PRZYCISK SPRAWDŹ TEKST */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={handleCheckText}
              disabled={isAnalyzing || !formData.accidentDescription || formData.accidentDescription.length === 0}
              style={{
                padding: '0.75rem 1.5rem',
                background: isChecked ? '#039b45' : '#81cb32',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: (isAnalyzing || !formData.accidentDescription || formData.accidentDescription.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (isAnalyzing || !formData.accidentDescription || formData.accidentDescription.length === 0) ? 0.6 : 1,
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
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    Sprawdź tekst
                  </span>
                )}
            </button>
          </div>

          {/* AI ANALYSIS SECTION */}
          {showAnalysis && isChecked && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{
                background: getCompletionScore() === 100 ? '#e8f5e9' : '#fff9e6',
                border: `2px solid ${getCompletionScore() === 100 ? '#039b45' : '#bcd144'}`,
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ marginRight: '0.75rem' }}>
                    {getCompletionScore() === 100 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#039b45">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ffa726">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    )}
                  </span>
                  <h4 style={{ color: '#333', margin: 0 }}>
                    Analiza AI: Kompletność opisu ({getCompletionScore()}%)
                  </h4>
                </div>
                
                {getCompletionScore() < 100 && (
                  <div style={{
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%)',
                    border: '2px solid #039b45',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#039b45" style={{ flexShrink: 0 }}>
                      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                    </svg>
                    <span style={{ color: '#005540', fontSize: '0.95rem', fontWeight: '500' }}>
                      Uzupełnienie braków w opisie przyspieszy proces weryfikacji wniosku przez ZUS.
                    </span>
                  </div>
                )}
                
                {isTextModified && (
                  <div style={{
                    background: '#fff3cd',
                    border: '2px solid #ffc107',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                    <span style={{ fontSize: '0.9rem', color: '#856404' }}>
                      <strong>Tekst został zmodyfikowany.</strong> Kliknij "Sprawdź tekst" ponownie, aby zaktualizować analizę AI.
                    </span>
                  </div>
                )}

                {/* Visual Indicators */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '0.75rem'
                }}>
                  <IndicatorItem 
                    title="Kiedy?" 
                    status={analysis.when} 
                    description={analysis.whenDesc || 'Określ dokładny czas wypadku'}
                  />
                  <IndicatorItem 
                    title="Gdzie?" 
                    status={analysis.where} 
                    description={analysis.whereDesc || 'Określ dokładne miejsce wypadku'}
                  />
                  <IndicatorItem 
                    title="Co robił?" 
                    status={analysis.whatDoing} 
                    description={analysis.whatDoingDesc || 'Opisz czynności przed wypadkiem'}
                  />
                  <IndicatorItem 
                    title="Jak doszło?" 
                    status={analysis.howHappened} 
                    description={analysis.howHappenedDesc || 'Opisz sekwencję zdarzeń'}
                  />
                  <IndicatorItem 
                    title="Dlaczego?" 
                    status={analysis.whyCause} 
                    description={analysis.whyCauseDesc || 'Określ przyczynę wypadku'}
                  />
                  <IndicatorItem 
                    title="Skutki" 
                    status={analysis.consequence} 
                    description={analysis.consequenceDesc || 'Opisz obrażenia'}
                  />
                </div>
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
              <label htmlFor="first-aid-yes">✓ Tak</label>
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
              <label htmlFor="first-aid-no">✗ Nie</label>
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
              <label htmlFor="machinery-yes">✓ Tak</label>
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
              <label htmlFor="machinery-no">✗ Nie</label>
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
                  <label htmlFor="cert-yes">✓ Tak</label>
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
                  <label htmlFor="cert-no">✗ Nie</label>
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
                  <label htmlFor="inventory-yes">✓ Tak</label>
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
                  <label htmlFor="inventory-no">✗ Nie</label>
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
function IndicatorItem({ title, status, description }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'ok': return '#039b45';
      case 'warning': return '#bcd144';
      case 'danger': return '#ff6b6b';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ok': return '✓';
      case 'warning': return '!';
      case 'danger': return '✗';
      default: return '?';
    }
  };

  return (
    <div style={{
      padding: '1rem',
      border: `2px solid ${getStatusColor(status)}`,
      borderRadius: '8px',
      backgroundColor: `${getStatusColor(status)}10`,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5rem',
        fontWeight: 'bold',
      }}>
        <span style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(status),
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '0.5rem',
          fontSize: '14px',
        }}>
          {getStatusIcon(status)}
        </span>
        {title}
      </div>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
        {description}
      </p>
    </div>
  );
}

// Komponent diody LED statusu
function StatusLED({ status, label }) {
  const getColors = () => {
    switch(status) {
      case 'ok':
        return {
          bg: '#e8f5e9',
          border: '#039b45',
          led: '#039b45',
          text: '#005540',
          animation: 'none'
        };
      case 'warning':
        return {
          bg: '#fff9e6',
          border: '#bcd144',
          led: '#bcd144',
          text: '#6b8e00',
          animation: 'none'
        };
      case 'danger':
      default:
        return {
          bg: '#ffebee',
          border: '#ff6b6b',
          led: '#ff6b6b',
          text: '#c62828',
          animation: 'pulse 2s ease-in-out infinite'
        };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.3rem 0.6rem',
      background: colors.bg,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      fontSize: '0.75rem',
      fontWeight: '600'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: colors.led,
        boxShadow: `0 0 6px ${colors.led}`,
        animation: colors.animation
      }}></div>
      <span style={{ color: colors.text }}>
        {label}
      </span>
    </div>
  );
}

export default Section8;
