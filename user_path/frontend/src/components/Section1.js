import React from 'react';

function Section1({ formData, updateFormData, onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    return formData.pesel &&
           formData.documentType &&
           formData.documentNumber &&
           formData.firstName &&
           formData.lastName &&
           formData.birthDate &&
           formData.birthPlace &&
           formData.street &&
           formData.houseNumber &&
           formData.postalCode &&
           formData.city;
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 1: Dane osoby poszkodowanej</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required">PESEL</label>
          <input
            type="text"
            value={formData.pesel || ''}
            onChange={(e) => updateFormData('pesel', e.target.value)}
            placeholder="Wprowadź numer PESEL"
            maxLength="11"
            required
          />
        </div>

        <div className="form-row three-cols">
          <div className="form-group">
            <label className="required">Rodzaj dokumentu</label>
            <select
              value={formData.documentType || ''}
              onChange={(e) => updateFormData('documentType', e.target.value)}
              required
            >
              <option value="">Wybierz rodzaj</option>
              <option value="Dowód osobisty">Dowód osobisty</option>
              <option value="Paszport">Paszport</option>
              <option value="Prawo jazdy">Prawo jazdy</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Seria</label>
            <input
              type="text"
              value={formData.documentSeries || ''}
              onChange={(e) => updateFormData('documentSeries', e.target.value)}
              placeholder="Seria"
            />
          </div>
          
          <div className="form-group">
            <label className="required">Numer</label>
            <input
              type="text"
              value={formData.documentNumber || ''}
              onChange={(e) => updateFormData('documentNumber', e.target.value)}
              placeholder="Numer"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required">Imię</label>
            <input
              type="text"
              value={formData.firstName || ''}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              placeholder="Wprowadź imię"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="required">Nazwisko</label>
            <input
              type="text"
              value={formData.lastName || ''}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              placeholder="Wprowadź nazwisko"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required">Data urodzenia</label>
            <input
              type="date"
              value={formData.birthDate || ''}
              onChange={(e) => updateFormData('birthDate', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="required">Miejsce urodzenia</label>
            <input
              type="text"
              value={formData.birthPlace || ''}
              onChange={(e) => updateFormData('birthPlace', e.target.value)}
              placeholder="Wprowadź miejsce urodzenia"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Numer telefonu (dobrowolne)</label>
          <input
            type="tel"
            value={formData.phoneNumber || ''}
            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
            placeholder="+48 123 456 789"
          />
        </div>

        <h3 className="section-title" style={{ marginTop: '2rem' }}>
          Adres zamieszkania osoby poszkodowanej
        </h3>

        <div className="form-group">
          <label className="required">Ulica</label>
          <input
            type="text"
            value={formData.street || ''}
            onChange={(e) => updateFormData('street', e.target.value)}
            placeholder="Wprowadź nazwę ulicy"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required">Numer domu</label>
            <input
              type="text"
              value={formData.houseNumber || ''}
              onChange={(e) => updateFormData('houseNumber', e.target.value)}
              placeholder="np. 12"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Numer lokalu</label>
            <input
              type="text"
              value={formData.apartmentNumber || ''}
              onChange={(e) => updateFormData('apartmentNumber', e.target.value)}
              placeholder="np. 5"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required">Kod pocztowy</label>
            <input
              type="text"
              value={formData.postalCode || ''}
              onChange={(e) => updateFormData('postalCode', e.target.value)}
              placeholder="00-000"
              maxLength="6"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="required">Miejscowość</label>
            <input
              type="text"
              value={formData.city || ''}
              onChange={(e) => updateFormData('city', e.target.value)}
              placeholder="Wprowadź miejscowość"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Nazwa państwa</label>
          <input
            type="text"
            value={formData.country || ''}
            onChange={(e) => updateFormData('country', e.target.value)}
            placeholder="Polska"
          />
          <small style={{ color: '#666', fontSize: '0.85rem' }}>
            Podaj jeżeli jest inna niż Polska
          </small>
        </div>

        <div className="form-group">
          <label className="required">
            Czy podany powyżej adres zamieszkania jest również adresem korespondencyjnym?
          </label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="corr-yes"
                name="correspondenceAddress"
                value="Tak"
                checked={formData.isCorrespondenceAddress === 'Tak'}
                onChange={(e) => updateFormData('isCorrespondenceAddress', e.target.value)}
              />
              <label htmlFor="corr-yes">✓ Tak</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="corr-no"
                name="correspondenceAddress"
                value="Nie"
                checked={formData.isCorrespondenceAddress === 'Nie'}
                onChange={(e) => updateFormData('isCorrespondenceAddress', e.target.value)}
              />
              <label htmlFor="corr-no">✗ Nie</label>
            </div>
          </div>
        </div>

        <div className="button-group">
          <div></div>
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

export default Section1;
