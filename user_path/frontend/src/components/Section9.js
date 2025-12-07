import React from 'react';

function Section9({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    // At least witness 1 is optional, so this section can always proceed
    return true;
  };

  const updateWitnessField = (witnessNum, field, value) => {
    const witnessKey = `witness${witnessNum}`;
    const currentWitness = formData[witnessKey] || {};
    updateFormData(witnessKey, { ...currentWitness, [field]: value });
  };

  const getWitnessValue = (witnessNum, field) => {
    const witnessKey = `witness${witnessNum}`;
    return formData[witnessKey]?.[field] || '';
  };

  const renderWitnessFields = (witnessNum) => {
    return (
      <div key={witnessNum} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>Świadek wypadku – {witnessNum}</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label>Imię</label>
            <input
              type="text"
              value={getWitnessValue(witnessNum, 'firstName')}
              onChange={(e) => updateWitnessField(witnessNum, 'firstName', e.target.value)}
              placeholder="Wprowadź imię"
            />
          </div>
          
          <div className="form-group">
            <label>Nazwisko</label>
            <input
              type="text"
              value={getWitnessValue(witnessNum, 'lastName')}
              onChange={(e) => updateWitnessField(witnessNum, 'lastName', e.target.value)}
              placeholder="Wprowadź nazwisko"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Ulica</label>
          <input
            type="text"
            value={getWitnessValue(witnessNum, 'street')}
            onChange={(e) => updateWitnessField(witnessNum, 'street', e.target.value)}
            placeholder="Wprowadź nazwę ulicy"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Numer domu</label>
            <input
              type="text"
              value={getWitnessValue(witnessNum, 'houseNumber')}
              onChange={(e) => updateWitnessField(witnessNum, 'houseNumber', e.target.value)}
              placeholder="np. 12"
            />
          </div>
          
          <div className="form-group">
            <label>Numer lokalu</label>
            <input
              type="text"
              value={getWitnessValue(witnessNum, 'apartmentNumber')}
              onChange={(e) => updateWitnessField(witnessNum, 'apartmentNumber', e.target.value)}
              placeholder="np. 5"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Kod pocztowy</label>
            <input
              type="text"
              value={getWitnessValue(witnessNum, 'postalCode')}
              onChange={(e) => updateWitnessField(witnessNum, 'postalCode', e.target.value)}
              placeholder="00-000"
              maxLength="6"
            />
          </div>
          
          <div className="form-group">
            <label>Miejscowość</label>
            <input
              type="text"
              value={getWitnessValue(witnessNum, 'city')}
              onChange={(e) => updateWitnessField(witnessNum, 'city', e.target.value)}
              placeholder="Wprowadź miejscowość"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Nazwa państwa</label>
          <input
            type="text"
            value={getWitnessValue(witnessNum, 'country')}
            onChange={(e) => updateWitnessField(witnessNum, 'country', e.target.value)}
            placeholder="Polska"
          />
          <small style={{ color: '#666', fontSize: '0.85rem' }}>
            Podaj jeżeli jest inna niż Polska
          </small>
        </div>
      </div>
    );
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 9: Dane świadków wypadku</h2>
      
      <div className="info-message">
        Wprowadź dane świadków wypadku (opcjonalnie). Możesz dodać do 3 świadków.
      </div>

      <form onSubmit={handleSubmit}>
        {renderWitnessFields(1)}
        {renderWitnessFields(2)}
        {renderWitnessFields(3)}

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

export default Section9;
