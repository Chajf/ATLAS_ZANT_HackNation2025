import React from 'react';

function Section5({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    if (formData.isNanny === 'Tak') {
      return formData.childcareStreet &&
             formData.childcareHouseNumber &&
             formData.childcarePostalCode &&
             formData.childcareCity;
    }
    return formData.isNanny !== '';
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 5: Umowa uaktywniająca</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required">
            Czy poszkodowany wykonuje pracę na podstawie umowy uaktywniającej (jako niania)?
          </label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="nanny-yes"
                name="isNanny"
                value="Tak"
                checked={formData.isNanny === 'Tak'}
                onChange={(e) => updateFormData('isNanny', e.target.value)}
              />
              <label htmlFor="nanny-yes">✓ Tak</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="nanny-no"
                name="isNanny"
                value="Nie"
                checked={formData.isNanny === 'Nie'}
                onChange={(e) => updateFormData('isNanny', e.target.value)}
              />
              <label htmlFor="nanny-no">✗ Nie</label>
            </div>
          </div>
        </div>

        {formData.isNanny === 'Tak' && (
          <>
            <h3 className="section-title" style={{ marginTop: '2rem' }}>
              Adres sprawowania opieki nad dzieckiem w wieku do lat 3
            </h3>

            <div className="form-group">
              <label className="required">Ulica</label>
              <input
                type="text"
                value={formData.childcareStreet}
                onChange={(e) => updateFormData('childcareStreet', e.target.value)}
                placeholder="Wprowadź nazwę ulicy"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="required">Numer domu</label>
                <input
                  type="text"
                  value={formData.childcareHouseNumber}
                  onChange={(e) => updateFormData('childcareHouseNumber', e.target.value)}
                  placeholder="np. 12"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Numer lokalu</label>
                <input
                  type="text"
                  value={formData.childcareApartmentNumber}
                  onChange={(e) => updateFormData('childcareApartmentNumber', e.target.value)}
                  placeholder="np. 5"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="required">Kod pocztowy</label>
                <input
                  type="text"
                  value={formData.childcarePostalCode}
                  onChange={(e) => updateFormData('childcarePostalCode', e.target.value)}
                  placeholder="00-000"
                  maxLength="6"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="required">Miejscowość</label>
                <input
                  type="text"
                  value={formData.childcareCity}
                  onChange={(e) => updateFormData('childcareCity', e.target.value)}
                  placeholder="Wprowadź miejscowość"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Numer telefonu (dobrowolne)</label>
              <input
                type="tel"
                value={formData.childcarePhoneNumber}
                onChange={(e) => updateFormData('childcarePhoneNumber', e.target.value)}
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

export default Section5;
