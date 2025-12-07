import React from 'react';

function Section6({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const hasNotifierData = () => {
    return formData.notifierPesel || 
           formData.notifierFirstName || 
           formData.notifierLastName ||
           formData.notifierStreet;
  };

  const isNotifierDataComplete = () => {
    if (!hasNotifierData()) return true; // If no data entered, it's valid (optional section)
    
    // If any data is entered, require all mandatory fields
    return formData.notifierPesel &&
           formData.notifierDocumentType &&
           formData.notifierDocumentNumber &&
           formData.notifierFirstName &&
           formData.notifierLastName &&
           formData.notifierBirthDate &&
           formData.notifierStreet &&
           formData.notifierHouseNumber &&
           formData.notifierPostalCode &&
           formData.notifierCity;
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 6: Dane osoby zawiadamiającej o wypadku</h2>
      
      <div className="info-message">
        Wypełnij tę sekcję tylko jeśli jesteś inną osobą niż poszkodowany. W przeciwnym razie możesz pominąć tę część.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>PESEL</label>
          <input
            type="text"
            value={formData.notifierPesel}
            onChange={(e) => updateFormData('notifierPesel', e.target.value)}
            placeholder="Wprowadź numer PESEL"
            maxLength="11"
          />
        </div>

        <div className="form-row three-cols">
          <div className="form-group">
            <label>Rodzaj dokumentu</label>
            <select
              value={formData.notifierDocumentType}
              onChange={(e) => updateFormData('notifierDocumentType', e.target.value)}
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
              value={formData.notifierDocumentSeries}
              onChange={(e) => updateFormData('notifierDocumentSeries', e.target.value)}
              placeholder="Seria"
            />
          </div>
          
          <div className="form-group">
            <label>Numer</label>
            <input
              type="text"
              value={formData.notifierDocumentNumber}
              onChange={(e) => updateFormData('notifierDocumentNumber', e.target.value)}
              placeholder="Numer"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Imię</label>
            <input
              type="text"
              value={formData.notifierFirstName}
              onChange={(e) => updateFormData('notifierFirstName', e.target.value)}
              placeholder="Wprowadź imię"
            />
          </div>
          
          <div className="form-group">
            <label>Nazwisko</label>
            <input
              type="text"
              value={formData.notifierLastName}
              onChange={(e) => updateFormData('notifierLastName', e.target.value)}
              placeholder="Wprowadź nazwisko"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Data urodzenia</label>
            <input
              type="date"
              value={formData.notifierBirthDate}
              onChange={(e) => updateFormData('notifierBirthDate', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Numer telefonu (dobrowolne)</label>
            <input
              type="tel"
              value={formData.notifierPhoneNumber}
              onChange={(e) => updateFormData('notifierPhoneNumber', e.target.value)}
              placeholder="+48 123 456 789"
            />
          </div>
        </div>

        <h3 className="section-title" style={{ marginTop: '2rem' }}>
          Adres zamieszkania osoby zawiadamiającej o wypadku
        </h3>

        <div className="form-group">
          <label>Ulica</label>
          <input
            type="text"
            value={formData.notifierStreet}
            onChange={(e) => updateFormData('notifierStreet', e.target.value)}
            placeholder="Wprowadź nazwę ulicy"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Numer domu</label>
            <input
              type="text"
              value={formData.notifierHouseNumber}
              onChange={(e) => updateFormData('notifierHouseNumber', e.target.value)}
              placeholder="np. 12"
            />
          </div>
          
          <div className="form-group">
            <label>Numer lokalu</label>
            <input
              type="text"
              value={formData.notifierApartmentNumber}
              onChange={(e) => updateFormData('notifierApartmentNumber', e.target.value)}
              placeholder="np. 5"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Kod pocztowy</label>
            <input
              type="text"
              value={formData.notifierPostalCode}
              onChange={(e) => updateFormData('notifierPostalCode', e.target.value)}
              placeholder="00-000"
              maxLength="6"
            />
          </div>
          
          <div className="form-group">
            <label>Miejscowość</label>
            <input
              type="text"
              value={formData.notifierCity}
              onChange={(e) => updateFormData('notifierCity', e.target.value)}
              placeholder="Wprowadź miejscowość"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Nazwa państwa</label>
          <input
            type="text"
            value={formData.notifierCountry}
            onChange={(e) => updateFormData('notifierCountry', e.target.value)}
            placeholder="Polska"
          />
          <small style={{ color: '#666', fontSize: '0.85rem' }}>
            Podaj jeżeli jest inna niż Polska
          </small>
        </div>

        {hasNotifierData() && (
          <div className="form-group">
            <label>
              Czy podany powyżej adres jest również adresem korespondencyjnym?
            </label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="notifier-corr-yes"
                  name="notifierCorrespondenceAddress"
                  value="Tak"
                  checked={formData.isNotifierCorrespondenceAddress === 'Tak'}
                  onChange={(e) => updateFormData('isNotifierCorrespondenceAddress', e.target.value)}
                />
                <label htmlFor="notifier-corr-yes">✓ Tak</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="notifier-corr-no"
                  name="notifierCorrespondenceAddress"
                  value="Nie"
                  checked={formData.isNotifierCorrespondenceAddress === 'Nie'}
                  onChange={(e) => updateFormData('isNotifierCorrespondenceAddress', e.target.value)}
                />
                <label htmlFor="notifier-corr-no">✗ Nie</label>
              </div>
            </div>
          </div>
        )}

        {formData.notifierCountry && formData.notifierCountry !== 'Polska' && hasNotifierData() && (
          <>
            <h3 className="section-title" style={{ marginTop: '2rem' }}>
              Adres ostatniego miejsca zamieszkania w Polsce
            </h3>
            
            <div className="info-message">
              Podaj adres ostatniego miejsca zamieszkania w Polsce, jeśli obecnie mieszkasz za granicą, 
              ale wcześniej mieszkałeś w Polsce. Jeśli nie masz adresu zamieszkania, podaj adres miejsca 
              pobytu lub adres ostatniego miejsca zamieszkania w Polsce.
            </div>

            <div className="form-group">
              <label>Ulica</label>
              <input
                type="text"
                value={formData.notifierLastPolandStreet}
                onChange={(e) => updateFormData('notifierLastPolandStreet', e.target.value)}
                placeholder="Wprowadź nazwę ulicy"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Numer domu</label>
                <input
                  type="text"
                  value={formData.notifierLastPolandHouseNumber}
                  onChange={(e) => updateFormData('notifierLastPolandHouseNumber', e.target.value)}
                  placeholder="np. 12"
                />
              </div>
              
              <div className="form-group">
                <label>Numer lokalu</label>
                <input
                  type="text"
                  value={formData.notifierLastPolandApartmentNumber}
                  onChange={(e) => updateFormData('notifierLastPolandApartmentNumber', e.target.value)}
                  placeholder="np. 5"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kod pocztowy</label>
                <input
                  type="text"
                  value={formData.notifierLastPolandPostalCode}
                  onChange={(e) => updateFormData('notifierLastPolandPostalCode', e.target.value)}
                  placeholder="00-000"
                  maxLength="6"
                />
              </div>
              
              <div className="form-group">
                <label>Miejscowość</label>
                <input
                  type="text"
                  value={formData.notifierLastPolandCity}
                  onChange={(e) => updateFormData('notifierLastPolandCity', e.target.value)}
                  placeholder="Wprowadź miejscowość"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Czy podany powyżej adres jest również adresem korespondencyjnym?
              </label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="notifier-poland-corr-yes"
                    name="notifierLastPolandCorrespondenceAddress"
                    value="Tak"
                    checked={formData.isNotifierLastPolandCorrespondenceAddress === 'Tak'}
                    onChange={(e) => updateFormData('isNotifierLastPolandCorrespondenceAddress', e.target.value)}
                  />
                  <label htmlFor="notifier-poland-corr-yes">✓ Tak</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="notifier-poland-corr-no"
                    name="notifierLastPolandCorrespondenceAddress"
                    value="Nie"
                    checked={formData.isNotifierLastPolandCorrespondenceAddress === 'Nie'}
                    onChange={(e) => updateFormData('isNotifierLastPolandCorrespondenceAddress', e.target.value)}
                  />
                  <label htmlFor="notifier-poland-corr-no">✗ Nie</label>
                </div>
              </div>
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
            disabled={!isNotifierDataComplete()}
          >
            Dalej
          </button>
        </div>
      </form>
    </div>
  );
}

export default Section6;
