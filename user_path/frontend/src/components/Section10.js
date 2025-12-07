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
          <div 
            className={`checkbox-card ${formData.attachHospitalCard ? 'checked' : ''}`}
            onClick={() => handleCheckboxChange('attachHospitalCard', !formData.attachHospitalCard)}
          >
            <div className="checkbox-card-checkbox">
              <input
                type="checkbox"
                checked={formData.attachHospitalCard || false}
                onChange={(e) => e.stopPropagation()}
                readOnly
              />
              <span className="checkmark">✓</span>
            </div>
            <div className="checkbox-card-content">
              Kserokopia karty informacyjnej ze szpitala/zaświadczenia o udzieleniu pierwszej pomocy 
              z pogotowia ratunkowego wraz z wywiadem
            </div>
          </div>

          <div 
            className={`checkbox-card ${formData.attachProsecutorDecision ? 'checked' : ''}`}
            onClick={() => handleCheckboxChange('attachProsecutorDecision', !formData.attachProsecutorDecision)}
          >
            <div className="checkbox-card-checkbox">
              <input
                type="checkbox"
                checked={formData.attachProsecutorDecision || false}
                onChange={(e) => e.stopPropagation()}
                readOnly
              />
              <span className="checkmark">✓</span>
            </div>
            <div className="checkbox-card-content">
              Kserokopia postanowienia prokuratury o wszczęciu postępowania karnego lub 
              zawieszeniu/umorzeniu postępowania
            </div>
          </div>

          <div 
            className={`checkbox-card ${formData.attachDeathCertificate ? 'checked' : ''}`}
            onClick={() => handleCheckboxChange('attachDeathCertificate', !formData.attachDeathCertificate)}
          >
            <div className="checkbox-card-checkbox">
              <input
                type="checkbox"
                checked={formData.attachDeathCertificate || false}
                onChange={(e) => e.stopPropagation()}
                readOnly
              />
              <span className="checkmark">✓</span>
            </div>
            <div className="checkbox-card-content">
              Kserokopia statystycznej karty zgonu lub zaświadczenie lekarskie stwierdzające przyczynę zgonu, 
              skrócony odpis aktu zgonu (w przypadku wypadku ze skutkiem śmiertelnym)
            </div>
          </div>

          <div 
            className={`checkbox-card ${formData.attachRightToIssueCard ? 'checked' : ''}`}
            onClick={() => handleCheckboxChange('attachRightToIssueCard', !formData.attachRightToIssueCard)}
          >
            <div className="checkbox-card-checkbox">
              <input
                type="checkbox"
                checked={formData.attachRightToIssueCard || false}
                onChange={(e) => e.stopPropagation()}
                readOnly
              />
              <span className="checkmark">✓</span>
            </div>
            <div className="checkbox-card-content">
              Dokumenty potwierdzające prawo do wydania karty wypadku osobie innej niż poszkodowany 
              (m.in. skrócony odpis aktu urodzenia, skrócony odpis aktu małżeństwa, pełnomocnictwo)
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Inne dokumenty</label>
          <textarea
            value={formData.otherAttachments}
            onChange={(e) => updateFormData('otherAttachments', e.target.value)}
            placeholder="Podaj jakie inne dokumenty dołączasz (np. dokumenty dotyczące udzielonej pomocy medycznej, umowa na wykonywaną usługę, faktura, rachunek, notatka z policji, ksero mandatu karnego itp.)"
            rows="3"
          />
        </div>

        <h3 className="subsection-title" style={{ marginTop: '2rem' }}>
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
