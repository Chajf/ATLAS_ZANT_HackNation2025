import React from 'react';

function ExplanationSection2({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    return formData.firstName &&
           formData.lastName &&
           formData.fatherName &&
           formData.birthDate &&
           formData.birthPlace &&
           formData.pesel &&
           formData.residenceAddress &&
           formData.correspondenceAddress &&
           formData.employmentPlace &&
           formData.position &&
           formData.identityDocument;
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 2: Dane poszkodowanego</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="required">Imię (Imiona)</label>
            <input
              type="text"
              value={formData.firstName || ''}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              placeholder="Wprowadź imię lub imiona"
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

        <div className="form-group">
          <label className="required">Imię ojca</label>
          <input
            type="text"
            value={formData.fatherName || ''}
            onChange={(e) => updateFormData('fatherName', e.target.value)}
            placeholder="Wprowadź imię ojca"
            required
          />
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
              placeholder="Miasto/miejscowość urodzenia"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="required">PESEL</label>
            <input
              type="text"
              value={formData.pesel || ''}
              onChange={(e) => updateFormData('pesel', e.target.value)}
              placeholder="11 cyfr bez spacji"
              pattern="[0-9]{11}"
              maxLength="11"
              required
            />
          </div>
          
          <div className="form-group">
            <label>NIP (opcjonalnie)</label>
            <input
              type="text"
              value={formData.nip || ''}
              onChange={(e) => updateFormData('nip', e.target.value)}
              placeholder="10 cyfr bez kresek"
              pattern="[0-9]{10}"
              maxLength="10"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="required">Miejsce zamieszkania</label>
          <textarea
            value={formData.residenceAddress || ''}
            onChange={(e) => updateFormData('residenceAddress', e.target.value)}
            placeholder="Pełny adres zamieszkania (ulica, nr domu/lokalu, kod pocztowy, miejscowość)"
            rows="2"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            required
          />
        </div>

        <div className="form-group">
          <label className="required">Adres do korespondencji</label>
          <textarea
            value={formData.correspondenceAddress || ''}
            onChange={(e) => updateFormData('correspondenceAddress', e.target.value)}
            placeholder="Pełny adres do korespondencji (jeśli inny niż zamieszkania)"
            rows="2"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            required
          />
        </div>

        <div className="form-group">
          <label className="required">Miejsce zatrudnienia (nazwa i adres zakładu)</label>
          <textarea
            value={formData.employmentPlace || ''}
            onChange={(e) => updateFormData('employmentPlace', e.target.value)}
            placeholder="Pełna nazwa firmy oraz adres zakładu pracy"
            rows="2"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            required
          />
        </div>

        <div className="form-group">
          <label className="required">Stanowisko lub rodzaj pracy</label>
          <input
            type="text"
            value={formData.position || ''}
            onChange={(e) => updateFormData('position', e.target.value)}
            placeholder="np. Pracownik produkcji, Magazynier, Kierowca"
            required
          />
        </div>

        <div className="form-group">
          <label className="required">Nazwa i numer dokumentu (przez kogo wydany)</label>
          <textarea
            value={formData.identityDocument || ''}
            onChange={(e) => updateFormData('identityDocument', e.target.value)}
            placeholder="np. Dowód osobisty ABC123456, wydany przez Prezydenta Miasta Warszawa"
            rows="2"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            required
          />
          <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
            Dokument na podstawie którego ustalono tożsamość
          </small>
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

export default ExplanationSection2;
