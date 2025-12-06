import React from 'react';

function Section10({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    return true; // All fields are optional
  };

  const handleCheckboxChange = (field, checked) => {
    updateFormData(field, checked);
  };

  const updateDocumentField = (index, value) => {
    const documents = formData.additionalDocuments || Array(8).fill('');
    documents[index] = value;
    updateFormData('additionalDocuments', documents);
  };

  const getDocumentValue = (index) => {
    const documents = formData.additionalDocuments || Array(8).fill('');
    return documents[index] || '';
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 10: Załączniki</h2>
      
      <div className="info-message">
        Zaznacz dokumenty, które dołączasz do sprawy oraz wskaż dokumenty, które dostarczysz później.
      </div>

      <form onSubmit={handleSubmit}>
        <h3 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.1rem' }}>
          Załączniki dołączane do sprawy
        </h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.attachHospitalCard || false}
                onChange={(e) => handleCheckboxChange('attachHospitalCard', e.target.checked)}
                style={{ marginTop: '0.25rem', cursor: 'pointer', flexShrink: 0 }}
              />
              <span>
                Kserokopia karty informacyjnej ze szpitala/zaświadczenia o udzieleniu pierwszej pomocy 
                z pogotowia ratunkowego wraz z wywiadem
              </span>
            </label>
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.attachProsecutorDecision || false}
                onChange={(e) => handleCheckboxChange('attachProsecutorDecision', e.target.checked)}
                style={{ marginTop: '0.25rem', cursor: 'pointer', flexShrink: 0 }}
              />
              <span>
                Kserokopia postanowienia prokuratury o wszczęciu postępowania karnego lub 
                zawieszeniu/umorzeniu postępowania
              </span>
            </label>
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.attachDeathCertificate || false}
                onChange={(e) => handleCheckboxChange('attachDeathCertificate', e.target.checked)}
                style={{ marginTop: '0.25rem', cursor: 'pointer', flexShrink: 0 }}
              />
              <span>
                Kserokopia statystycznej karty zgonu lub zaświadczenie lekarskie stwierdzające przyczynę zgonu, 
                skrócony odpis aktu zgonu (w przypadku wypadku ze skutkiem śmiertelnym)
              </span>
            </label>
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.attachRightToIssueCard || false}
                onChange={(e) => handleCheckboxChange('attachRightToIssueCard', e.target.checked)}
                style={{ marginTop: '0.25rem', cursor: 'pointer', flexShrink: 0 }}
              />
              <span>
                Dokumenty potwierdzające prawo do wydania karty wypadku osobie innej niż poszkodowany 
                (m.in. skrócony odpis aktu urodzenia, skrócony odpis aktu małżeństwa, pełnomocnictwo)
              </span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Inne dokumenty</label>
          <textarea
            value={formData.otherAttachments}
            onChange={(e) => updateFormData('otherAttachments', e.target.value)}
            placeholder="Podaj jakie inne dokumenty dołączasz (np. dokumenty dotyczące udzielonej pomocy medycznej, umowa na wykonywaną usługę, faktura, rachunek, notatka z policji, ksero mandatu karnego itp.)"
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
          />
        </div>

        <h3 style={{ color: '#333', margin: '2rem 0 1rem', fontSize: '1.1rem' }}>
          Dokumenty do dostarczenia później
        </h3>

        <div className="form-group">
          <label>Data, do której zobowiązujesz się dostarczyć dokumenty</label>
          <input
            type="date"
            value={formData.documentsDeliveryDate}
            onChange={(e) => updateFormData('documentsDeliveryDate', e.target.value)}
          />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ marginBottom: '1rem', color: '#555', fontWeight: '500' }}>
            Nazwy dokumentów do dostarczenia:
          </p>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <div key={index} className="form-group" style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                value={getDocumentValue(index)}
                onChange={(e) => updateDocumentField(index, e.target.value)}
                placeholder={`Dokument ${index + 1}`}
              />
            </div>
          ))}
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

export default Section10;
