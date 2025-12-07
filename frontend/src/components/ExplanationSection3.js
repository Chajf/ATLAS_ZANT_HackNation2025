import React, { useState } from 'react';

function ExplanationSection3({ formData, updateFormData, onNext, onPrev }) {
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
  const [isChecked, setIsChecked] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTextModified, setIsTextModified] = useState(false);

  // Konfiguracja API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Jeśli tekst nie został sprawdzony i jest niepusty, wykonaj sprawdzenie przed przejściem dalej
    if (!isChecked && formData.accidentDescription && formData.accidentDescription.length > 0) {
      await analyzeDescription(formData.accidentDescription);
      
      // Po analizie sprawdź czy są problemy
      const score = getCompletionScore();
      if (score < 100) {
        const confirmMessage = `⚠️ Wykryto problemy z opisem wypadku!\n\nKompletność opisu: ${score}%\n\nBrakujące elementy mogą spowodować odrzucenie zgłoszenia przez ZUS.\n\nCzy na pewno chcesz przejść dalej bez poprawienia opisu?`;
        
        if (!window.confirm(confirmMessage)) {
          return;
        }
      }
    } else if (isChecked) {
      const score = getCompletionScore();
      if (score < 100) {
        const confirmMessage = `⚠️ Wykryto problemy z opisem wypadku!\n\nKompletność opisu: ${score}%\n\nBrakujące elementy mogą spowodować odrzucenie zgłoszenia przez ZUS.\n\nCzy na pewno chcesz przejść dalej bez poprawienia opisu?`;
        
        if (!window.confirm(confirmMessage)) {
          return;
        }
      }
    }
    
    onNext();
  };

  const isFormValid = () => {
    return formData.accidentDescription && formData.accidentDescription.length > 0;
  };

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
    const apiResponse = await callAIAssistant(description);
    
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
    generateRecommendations(apiResponse.aspects);
    setIsChecked(true);
  };

  const generateRecommendations = (aspects) => {
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

  const handleCheckText = async () => {
    if (formData.accidentDescription && formData.accidentDescription.length > 0) {
      setIsTextModified(false);
      await analyzeDescription(formData.accidentDescription);
    }
  };

  const getCompletionScore = () => {
    const totalCriteria = 6;
    const metCriteria = Object.values(analysis).filter(val => val === 'ok').length;
    return Math.round((metCriteria / totalCriteria) * 100);
  };

  const getMedicalDocuments = () => {
    return formData.medicalDocuments || [];
  };

  const addMedicalDocument = () => {
    const documents = getMedicalDocuments();
    documents.push('');
    updateFormData('medicalDocuments', [...documents]);
  };

  const updateMedicalDocument = (index, value) => {
    const documents = getMedicalDocuments();
    documents[index] = value;
    updateFormData('medicalDocuments', [...documents]);
  };

  const removeMedicalDocument = (index) => {
    const documents = getMedicalDocuments();
    documents.splice(index, 1);
    updateFormData('medicalDocuments', [...documents]);
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 3: Opis wypadku i dokumentacja medyczna</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required">Opis wypadku</label>
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
            </strong> Opisz szczegółowo:
            <ul style={{ margin: '0.5rem 0 0 1.5rem', paddingLeft: 0 }}>
              <li>Kiedy dokładnie doszło do wypadku</li>
              <li>Co robiłeś/robiłaś w momencie wypadku</li>
              <li>Jak przebiegał wypadek (krok po kroku)</li>
              <li>Co było przyczyną wypadku</li>
              <li>Jakie odniosłeś/odniosłaś obrażenia</li>
            </ul>
          </div>
          <textarea
            value={formData.accidentDescription || ''}
            onChange={(e) => {
              updateFormData('accidentDescription', e.target.value);
              if (isChecked) {
                setIsTextModified(true);
              }
            }}
            placeholder="Opisz dokładnie przebieg wypadku, okoliczności, przyczyny i skutki."
            rows="10"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: isChecked && getCompletionScore() < 100 ? '2px solid #ff9800' : '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxShadow: isChecked && getCompletionScore() < 100 ? '0 0 10px rgba(255, 152, 0, 0.2)' : 'none'
            }}
            required
          />
          <small style={{ 
            color: '#666', 
            fontSize: '0.85rem', 
            marginTop: '0.25rem', 
            display: 'block' 
          }}>
            Liczba znaków: {formData.accidentDescription?.length || 0}
          </small>
        </div>

        {/* PRZYCISK SPRAWDŹ TEKST */}
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={handleCheckText}
            disabled={isAnalyzing || !formData.accidentDescription}
            style={{
              padding: '0.75rem 1.5rem',
              background: isChecked ? '#039b45' : '#81cb32',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: (isAnalyzing || !formData.accidentDescription) ? 'not-allowed' : 'pointer',
              opacity: (isAnalyzing || !formData.accidentDescription) ? 0.6 : 1,
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
        {isChecked && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{
              background: getCompletionScore() === 100 ? '#e8f5e9' : '#fff3e0',
              border: `2px solid ${getCompletionScore() === 100 ? '#4caf50' : '#ff9800'}`,
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
                )}              {isTextModified && (
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
                gap: '0.75rem',
                marginBottom: '1.5rem'
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

        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fff9f0',
          borderRadius: '8px',
          border: '2px solid #ffa726'
        }}>
          <h3 style={{ color: '#f57c00', marginBottom: '1rem', fontSize: '1.1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              Dokumenty medyczne potwierdzające uszkodzenia ciała
            </span>
          </h3>

          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Wymień dokumenty medyczne, które potwierdzają odniesione obrażenia 
            (np. karty informacyjne ze szpitala, zaświadczenia lekarskie, wyniki badań)
          </p>

          {getMedicalDocuments().map((doc, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: '500', color: '#333', marginBottom: '0.25rem', display: 'block' }}>
                    Dokument {index + 1}
                  </label>
                  <input
                    type="text"
                    value={doc || ''}
                    onChange={(e) => updateMedicalDocument(index, e.target.value)}
                    placeholder="np. Karta informacyjna ze Szpitala Miejskiego, data: 10.10.2024"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeMedicalDocument(index)}
                  style={{
                    marginTop: '1.75rem',
                    padding: '0.75rem 1rem',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMedicalDocument}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#81cb32',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              marginTop: '0.5rem'
            }}
          >
            + Dodaj dokument medyczny
          </button>

          {getMedicalDocuments().length === 0 && (
            <p style={{ 
              color: '#999', 
              fontSize: '0.9rem', 
              fontStyle: 'italic', 
              marginTop: '1rem' 
            }}>
              Nie dodano jeszcze żadnych dokumentów medycznych. Kliknij przycisk powyżej, aby dodać.
            </p>
          )}
        </div>

        <div className="button-group" style={{ marginTop: '2rem' }}>
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

// Komponent wizualizacji statusu LED
const StatusLED = ({ status }) => {
  const colors = {
    ok: '#039b45',
    warning: '#bcd144',
    danger: '#ff6b6b',
  };
  
  const color = colors[status] || '#9e9e9e';
  
  return (
    <div style={{
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: color,
      boxShadow: `0 0 6px ${color}`,
      display: 'inline-block',
      marginRight: '8px'
    }} />
  );
};

// Komponent pojedynczego wskaźnika
const IndicatorItem = ({ title, status, description }) => {
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
};

export default ExplanationSection3;
