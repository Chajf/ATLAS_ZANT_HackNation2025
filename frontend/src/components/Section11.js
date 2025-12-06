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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '0.5rem' }}>
              <input
                type="radio"
                name="responseMethod"
                value="w placówce ZUS"
                checked={formData.responseMethod === 'w placówce ZUS'}
                onChange={(e) => updateFormData('responseMethod', e.target.value)}
                style={{ marginTop: '0.25rem', cursor: 'pointer', flexShrink: 0 }}
              />
              <span>W placówce ZUS (osobiście lub przez osobę upoważnioną)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '0.5rem' }}>
              <input
                type="radio"
                name="responseMethod"
                value="pocztą na adres wskazany we wniosku"
                checked={formData.responseMethod === 'pocztą na adres wskazany we wniosku'}
                onChange={(e) => updateFormData('responseMethod', e.target.value)}
                style={{ marginTop: '0.25rem', cursor: 'pointer', flexShrink: 0 }}
              />
              <span>Pocztą na adres wskazany we wniosku</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '0.5rem' }}>
              <input
                type="radio"
                name="responseMethod"
                value="na moim koncie na PUE ZUS"
                checked={formData.responseMethod === 'na moim koncie na PUE ZUS'}
                onChange={(e) => updateFormData('responseMethod', e.target.value)}
                style={{ marginTop: '0.25rem', cursor: 'pointer', flexShrink: 0 }}
              />
              <span>Na moim koncie na Platformie Usług Elektronicznych (PUE ZUS)</span>
            </label>
          </div>
        </div>

        <div style={{ 
          background: '#f0f4ff', 
          border: '2px solid #667eea', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginTop: '2rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ 
            fontSize: '1rem', 
            color: '#333', 
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
