import React from 'react';

function Section2({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    return formData.lastPolandStreet &&
           formData.lastPolandHouseNumber &&
           formData.lastPolandPostalCode &&
           formData.lastPolandCity;
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 2: Adres ostatniego miejsca zamieszkania w Polsce</h2>
      
      <div className="info-message">
        Podaj adres ostatniego miejsca zamieszkania w Polsce, jeśli obecnie mieszkasz za granicą, 
        ale wcześniej mieszkałeś w Polsce. Jeśli nie masz adresu zamieszkania, podaj adres miejsca 
        pobytu lub adres ostatniego miejsca zamieszkania w Polsce.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required">Ulica</label>
          <input
            type="text"
            value={formData.lastPolandStreet}
            onChange={(e) => updateFormData('lastPolandStreet', e.target.value)}
            placeholder="Wprowadź nazwę ulicy"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required">Numer domu</label>
            <input
              type="text"
              value={formData.lastPolandHouseNumber}
              onChange={(e) => updateFormData('lastPolandHouseNumber', e.target.value)}
              placeholder="np. 12"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Numer lokalu</label>
            <input
              type="text"
              value={formData.lastPolandApartmentNumber}
              onChange={(e) => updateFormData('lastPolandApartmentNumber', e.target.value)}
              placeholder="np. 5"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required">Kod pocztowy</label>
            <input
              type="text"
              value={formData.lastPolandPostalCode}
              onChange={(e) => updateFormData('lastPolandPostalCode', e.target.value)}
              placeholder="00-000"
              maxLength="6"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="required">Miejscowość</label>
            <input
              type="text"
              value={formData.lastPolandCity}
              onChange={(e) => updateFormData('lastPolandCity', e.target.value)}
              placeholder="Wprowadź miejscowość"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="required">
            Czy podany powyżej adres jest również adresem korespondencyjnym?
          </label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="poland-corr-yes"
                name="lastPolandCorrespondenceAddress"
                value="Tak"
                checked={formData.isLastPolandCorrespondenceAddress === 'Tak'}
                onChange={(e) => updateFormData('isLastPolandCorrespondenceAddress', e.target.value)}
              />
              <label htmlFor="poland-corr-yes">Tak</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="poland-corr-no"
                name="lastPolandCorrespondenceAddress"
                value="Nie"
                checked={formData.isLastPolandCorrespondenceAddress === 'Nie'}
                onChange={(e) => updateFormData('isLastPolandCorrespondenceAddress', e.target.value)}
              />
              <label htmlFor="poland-corr-no">Nie</label>
            </div>
          </div>
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

export default Section2;
