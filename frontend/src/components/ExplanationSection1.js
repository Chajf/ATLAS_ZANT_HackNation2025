import React from 'react';

function ExplanationSection1({ formData, updateFormData, onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    return formData.accidentDate &&
           formData.accidentTime &&
           formData.accidentStreet &&
           formData.accidentHouseNumber &&
           formData.accidentPostalCode &&
           formData.accidentCity;
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 1: Dane o wypadku</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="required">Data wypadku</label>
            <input
              type="date"
              value={formData.accidentDate || ''}
              onChange={(e) => updateFormData('accidentDate', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="required">Godzina wypadku</label>
            <input
              type="time"
              value={formData.accidentTime || ''}
              onChange={(e) => updateFormData('accidentTime', e.target.value)}
              required
            />
          </div>
        </div>

        <h3 style={{ color: '#333', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
          Miejsce wypadku
        </h3>

        <div className="form-group">
          <label className="required">Ulica</label>
          <input
            type="text"
            value={formData.accidentStreet || ''}
            onChange={(e) => updateFormData('accidentStreet', e.target.value)}
            placeholder="Wprowadź nazwę ulicy"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required">Numer domu</label>
            <input
              type="text"
              value={formData.accidentHouseNumber || ''}
              onChange={(e) => updateFormData('accidentHouseNumber', e.target.value)}
              placeholder="np. 123"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Numer lokalu</label>
            <input
              type="text"
              value={formData.accidentApartmentNumber || ''}
              onChange={(e) => updateFormData('accidentApartmentNumber', e.target.value)}
              placeholder="np. 4A (opcjonalnie)"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required">Kod pocztowy</label>
            <input
              type="text"
              value={formData.accidentPostalCode || ''}
              onChange={(e) => updateFormData('accidentPostalCode', e.target.value)}
              placeholder="00-000"
              pattern="[0-9]{2}-[0-9]{3}"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="required">Miejscowość</label>
            <input
              type="text"
              value={formData.accidentCity || ''}
              onChange={(e) => updateFormData('accidentCity', e.target.value)}
              placeholder="Wprowadź miejscowość"
              required
            />
          </div>
        </div>

        <div className="button-group">
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

export default ExplanationSection1;
