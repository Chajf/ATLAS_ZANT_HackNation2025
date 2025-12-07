import React from 'react';

function Section4({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    if (formData.hasBusinessActivity === 'Tak') {
      return formData.businessStreet &&
             formData.businessHouseNumber &&
             formData.businessPostalCode &&
             formData.businessCity;
    }
    return formData.hasBusinessActivity !== '';
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 4: Pozarolnicza działalność</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required">
            Czy poszkodowany prowadzi pozarolniczą działalność albo współpracuje przy prowadzeniu takiej działalności?
          </label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="business-yes"
                name="hasBusinessActivity"
                value="Tak"
                checked={formData.hasBusinessActivity === 'Tak'}
                onChange={(e) => updateFormData('hasBusinessActivity', e.target.value)}
              />
              <label htmlFor="business-yes">✓ Tak</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="business-no"
                name="hasBusinessActivity"
                value="Nie"
                checked={formData.hasBusinessActivity === 'Nie'}
                onChange={(e) => updateFormData('hasBusinessActivity', e.target.value)}
              />
              <label htmlFor="business-no">✗ Nie</label>
            </div>
          </div>
        </div>

        {formData.hasBusinessActivity === 'Tak' && (
          <>
            <h3 className="section-title" style={{ marginTop: '2rem' }}>
              Adres miejsca prowadzenia pozarolniczej działalności
            </h3>

            <div className="form-group">
              <label className="required">Ulica</label>
              <input
                type="text"
                value={formData.businessStreet}
                onChange={(e) => updateFormData('businessStreet', e.target.value)}
                placeholder="Wprowadź nazwę ulicy"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="required">Numer domu</label>
                <input
                  type="text"
                  value={formData.businessHouseNumber}
                  onChange={(e) => updateFormData('businessHouseNumber', e.target.value)}
                  placeholder="np. 12"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Numer lokalu</label>
                <input
                  type="text"
                  value={formData.businessApartmentNumber}
                  onChange={(e) => updateFormData('businessApartmentNumber', e.target.value)}
                  placeholder="np. 5"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="required">Kod pocztowy</label>
                <input
                  type="text"
                  value={formData.businessPostalCode}
                  onChange={(e) => updateFormData('businessPostalCode', e.target.value)}
                  placeholder="00-000"
                  maxLength="6"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="required">Miejscowość</label>
                <input
                  type="text"
                  value={formData.businessCity}
                  onChange={(e) => updateFormData('businessCity', e.target.value)}
                  placeholder="Wprowadź miejscowość"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Numer telefonu (dobrowolne)</label>
              <input
                type="tel"
                value={formData.businessPhoneNumber}
                onChange={(e) => updateFormData('businessPhoneNumber', e.target.value)}
                placeholder="+48 123 456 789"
              />
            </div>
          </>
        )}

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

export default Section4;
