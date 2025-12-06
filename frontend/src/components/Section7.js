import React from 'react';

function Section7({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    const type = formData.notifierCorrType;
    
    if (type === 'adres') {
      return formData.notifierCorrStreet &&
             formData.notifierCorrHouseNumber &&
             formData.notifierCorrPostalCode &&
             formData.notifierCorrCity;
    } else if (type === 'poste restante') {
      return formData.notifierCorrPostalCode &&
             formData.notifierCorrCity;
    } else if (type === 'skrytka pocztowa' || type === 'przegródka pocztowa') {
      return formData.notifierCorrStreet &&
             formData.notifierCorrHouseNumber &&
             formData.notifierCorrPostalCode &&
             formData.notifierCorrCity;
    }
    return false;
  };

  const renderAddressFields = () => {
    const type = formData.notifierCorrType;

    if (type === 'adres') {
      return (
        <>
          <div className="form-group">
            <label className="required">Ulica</label>
            <input
              type="text"
              value={formData.notifierCorrStreet}
              onChange={(e) => updateFormData('notifierCorrStreet', e.target.value)}
              placeholder="Wprowadź nazwę ulicy"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="required">Numer domu</label>
              <input
                type="text"
                value={formData.notifierCorrHouseNumber}
                onChange={(e) => updateFormData('notifierCorrHouseNumber', e.target.value)}
                placeholder="np. 12"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Numer lokalu</label>
              <input
                type="text"
                value={formData.notifierCorrApartmentNumber}
                onChange={(e) => updateFormData('notifierCorrApartmentNumber', e.target.value)}
                placeholder="np. 5"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="required">Kod pocztowy</label>
              <input
                type="text"
                value={formData.notifierCorrPostalCode}
                onChange={(e) => updateFormData('notifierCorrPostalCode', e.target.value)}
                placeholder="00-000"
                maxLength="6"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="required">Miejscowość</label>
              <input
                type="text"
                value={formData.notifierCorrCity}
                onChange={(e) => updateFormData('notifierCorrCity', e.target.value)}
                placeholder="Wprowadź miejscowość"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nazwa państwa</label>
            <input
              type="text"
              value={formData.notifierCorrCountry}
              onChange={(e) => updateFormData('notifierCorrCountry', e.target.value)}
              placeholder="Polska"
            />
            <small style={{ color: '#666', fontSize: '0.85rem' }}>
              Podaj jeżeli jest inna niż Polska
            </small>
          </div>
        </>
      );
    } else if (type === 'poste restante') {
      return (
        <>
          <div className="form-row">
            <div className="form-group">
              <label className="required">Kod pocztowy (placówki pocztowej)</label>
              <input
                type="text"
                value={formData.notifierCorrPostalCode}
                onChange={(e) => updateFormData('notifierCorrPostalCode', e.target.value)}
                placeholder="00-000"
                maxLength="6"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="required">Miejscowość (nazwa placówki pocztowej)</label>
              <input
                type="text"
                value={formData.notifierCorrCity}
                onChange={(e) => updateFormData('notifierCorrCity', e.target.value)}
                placeholder="Nazwa placówki"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nazwa państwa</label>
            <input
              type="text"
              value={formData.notifierCorrCountry}
              onChange={(e) => updateFormData('notifierCorrCountry', e.target.value)}
              placeholder="Polska"
            />
            <small style={{ color: '#666', fontSize: '0.85rem' }}>
              Podaj jeżeli jest inna niż Polska
            </small>
          </div>
        </>
      );
    } else if (type === 'skrytka pocztowa' || type === 'przegródka pocztowa') {
      const label = type === 'skrytka pocztowa' ? 'skrytki' : 'przegródki';
      return (
        <>
          <div className="form-group">
            <label className="required">Ulica</label>
            <input
              type="text"
              value={formData.notifierCorrStreet}
              onChange={(e) => updateFormData('notifierCorrStreet', e.target.value)}
              placeholder="Wprowadź nazwę ulicy"
              required
            />
          </div>

          <div className="form-group">
            <label className="required">Numer {label}</label>
            <input
              type="text"
              value={formData.notifierCorrHouseNumber}
              onChange={(e) => updateFormData('notifierCorrHouseNumber', e.target.value)}
              placeholder={`Numer ${label}`}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="required">Kod pocztowy (placówki)</label>
              <input
                type="text"
                value={formData.notifierCorrPostalCode}
                onChange={(e) => updateFormData('notifierCorrPostalCode', e.target.value)}
                placeholder="00-000"
                maxLength="6"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="required">Miejscowość (nazwa placówki pocztowej)</label>
              <input
                type="text"
                value={formData.notifierCorrCity}
                onChange={(e) => updateFormData('notifierCorrCity', e.target.value)}
                placeholder="Nazwa placówki"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nazwa państwa</label>
            <input
              type="text"
              value={formData.notifierCorrCountry}
              onChange={(e) => updateFormData('notifierCorrCountry', e.target.value)}
              placeholder="Polska"
            />
            <small style={{ color: '#666', fontSize: '0.85rem' }}>
              Podaj jeżeli jest inna niż Polska
            </small>
          </div>
        </>
      );
    }
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 7: Adres do korespondencji osoby zawiadamiającej</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required">Sposób korespondencji</label>
          <select
            value={formData.notifierCorrType}
            onChange={(e) => {
              updateFormData('notifierCorrType', e.target.value);
              // Reset fields when changing type
              updateFormData('notifierCorrStreet', '');
              updateFormData('notifierCorrHouseNumber', '');
              updateFormData('notifierCorrApartmentNumber', '');
              updateFormData('notifierCorrPostalCode', '');
              updateFormData('notifierCorrCity', '');
              updateFormData('notifierCorrCountry', 'Polska');
            }}
            required
          >
            <option value="adres">Adres</option>
            <option value="poste restante">Poste restante</option>
            <option value="skrytka pocztowa">Skrytka pocztowa</option>
            <option value="przegródka pocztowa">Przegródka pocztowa</option>
          </select>
        </div>

        {renderAddressFields()}

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

export default Section7;
