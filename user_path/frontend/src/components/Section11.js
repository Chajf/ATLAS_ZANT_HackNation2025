import React from 'react';

function Section11({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    return formData.responseMethod !== '' && formData.declarationDate !== '';
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 11: Sposób odbioru odpowiedzi i oświadczenie</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required">Sposób odbioru odpowiedzi</label>
          <div style={{ marginTop: '0.75rem' }}>
            <div 
              className={`radio-card ${formData.responseMethod === 'w placówce ZUS' ? 'selected' : ''}`}
              onClick={() => updateFormData('responseMethod', 'w placówce ZUS')}
            >
              <div className="radio-card-radio">
                <input
                  type="radio"
                  name="responseMethod"
                  value="w placówce ZUS"
                  checked={formData.responseMethod === 'w placówce ZUS'}
                  onChange={(e) => e.stopPropagation()}
                  readOnly
                />
                <span className="radio-dot"></span>
              </div>
              <div className="radio-card-content">
                W placówce ZUS (osobiście lub przez osobę upoważnioną)
              </div>
            </div>

            <div 
              className={`radio-card ${formData.responseMethod === 'pocztą na adres wskazany we wniosku' ? 'selected' : ''}`}
              onClick={() => updateFormData('responseMethod', 'pocztą na adres wskazany we wniosku')}
            >
              <div className="radio-card-radio">
                <input
                  type="radio"
                  name="responseMethod"
                  value="pocztą na adres wskazany we wniosku"
                  checked={formData.responseMethod === 'pocztą na adres wskazany we wniosku'}
                  onChange={(e) => e.stopPropagation()}
                  readOnly
                />
                <span className="radio-dot"></span>
              </div>
              <div className="radio-card-content">
                Pocztą na adres wskazany we wniosku
              </div>
            </div>

            <div 
              className={`radio-card ${formData.responseMethod === 'na moim koncie na PUE ZUS' ? 'selected' : ''}`}
              onClick={() => updateFormData('responseMethod', 'na moim koncie na PUE ZUS')}
            >
              <div className="radio-card-radio">
                <input
                  type="radio"
                  name="responseMethod"
                  value="na moim koncie na PUE ZUS"
                  checked={formData.responseMethod === 'na moim koncie na PUE ZUS'}
                  onChange={(e) => e.stopPropagation()}
                  readOnly
                />
                <span className="radio-dot"></span>
              </div>
              <div className="radio-card-content">
                Na moim koncie na Platformie Usług Elektronicznych (PUE ZUS)
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          background: '#e8f5e9', 
          border: '2px solid #039b45', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginTop: '2rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ 
            fontSize: '1rem', 
            color: '#005540', 
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            Oświadczam, że dane zawarte w zawiadomieniu podaję zgodnie z prawdą, 
            co potwierdzam złożonym podpisem.
          </p>
        </div>

        <div className="form-group">
          <label className="required">Data złożenia oświadczenia</label>
          <input
            type="date"
            value={formData.declarationDate}
            onChange={(e) => updateFormData('declarationDate', e.target.value)}
            required
          />
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
            Zakończ i zobacz podsumowanie
          </button>
        </div>
      </form>
    </div>
  );
}

export default Section11;
