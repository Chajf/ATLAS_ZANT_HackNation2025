import React from 'react';

function FeedbackSection({ formData, onPrev }) {
  const handleDownload = () => {
    // Create JSON file with form data
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wypadek_przy_pracy_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDataForDisplay = () => {
    const sections = [];

    // Section 1
    const section1Data = [
      { label: 'PESEL', value: formData.pesel },
      { label: 'Dokument', value: `${formData.documentType}${formData.documentSeries ? ' ' + formData.documentSeries : ''} ${formData.documentNumber}` },
      { label: 'Imię i nazwisko', value: `${formData.firstName} ${formData.lastName}` },
      { label: 'Data urodzenia', value: formData.birthDate },
      { label: 'Miejsce urodzenia', value: formData.birthPlace },
    ];
    
    if (formData.phoneNumber) {
      section1Data.push({ label: 'Telefon', value: formData.phoneNumber });
    }

    section1Data.push(
      { label: 'Adres', value: `${formData.street} ${formData.houseNumber}${formData.apartmentNumber ? '/' + formData.apartmentNumber : ''}` },
      { label: 'Kod i miejscowość', value: `${formData.postalCode} ${formData.city}` },
      { label: 'Państwo', value: formData.country }
    );

    sections.push({ title: 'Dane osoby poszkodowanej', data: section1Data });

    // Section 2 (if applicable)
    if (formData.country && formData.country !== 'Polska') {
      const section2Data = [
        { label: 'Adres w Polsce', value: `${formData.lastPolandStreet} ${formData.lastPolandHouseNumber}${formData.lastPolandApartmentNumber ? '/' + formData.lastPolandApartmentNumber : ''}` },
        { label: 'Kod i miejscowość', value: `${formData.lastPolandPostalCode} ${formData.lastPolandCity}` },
      ];
      sections.push({ title: 'Ostatni adres w Polsce', data: section2Data });
    }

    // Section 3 (if applicable)
    if (formData.isCorrespondenceAddress === 'Nie' || 
        (formData.country && formData.country !== 'Polska' && formData.isLastPolandCorrespondenceAddress === 'Nie')) {
      const section3Data = [
        { label: 'Sposób korespondencji', value: formData.correspondenceType },
      ];

      if (formData.correspondenceType === 'adres') {
        section3Data.push(
          { label: 'Adres', value: `${formData.corrStreet} ${formData.corrHouseNumber}${formData.corrApartmentNumber ? '/' + formData.corrApartmentNumber : ''}` },
          { label: 'Kod i miejscowość', value: `${formData.corrPostalCode} ${formData.corrCity}` },
          { label: 'Państwo', value: formData.corrCountry }
        );
      } else if (formData.correspondenceType === 'poste restante') {
        section3Data.push(
          { label: 'Placówka', value: `${formData.corrPostalCode} ${formData.corrCity}` },
          { label: 'Państwo', value: formData.corrCountry }
        );
      } else {
        section3Data.push(
          { label: 'Adres placówki', value: `${formData.corrStreet}` },
          { label: `Numer ${formData.correspondenceType}`, value: formData.corrHouseNumber },
          { label: 'Placówka', value: `${formData.corrPostalCode} ${formData.corrCity}` },
          { label: 'Państwo', value: formData.corrCountry }
        );
      }

      sections.push({ title: 'Adres korespondencyjny', data: section3Data });
    }

    return sections;
  };

  return (
    <div className="section-container feedback-container">
      <div className="feedback-icon">✅</div>
      <h2>Formularz został wypełniony pomyślnie!</h2>
      <p>
        Dziękujemy za wypełnienie formularza zgłoszenia wypadku przy pracy. 
        Wszystkie dane zostały zapisane i są gotowe do wygenerowania dokumentu PDF.
      </p>

      <div className="data-summary">
        <h3>Podsumowanie wprowadzonych danych:</h3>
        {formatDataForDisplay().map((section, idx) => (
          <div key={idx} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#667eea', marginBottom: '0.75rem', fontSize: '1rem' }}>
              {section.title}
            </h4>
            {section.data.map((item, itemIdx) => (
              <div key={itemIdx} className="data-item">
                <span className="data-label">{item.label}:</span>
                <span className="data-value">{item.value}</span>
              </div>
            ))}
          </div>
        ))}
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
          type="button" 
          className="btn btn-primary"
          onClick={handleDownload}
        >
          Pobierz dane (JSON)
        </button>
      </div>

      <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
        Dane zostały zapisane i mogą być wykorzystane do wygenerowania dokumentu PDF 
        przez system backendowy.
      </p>
    </div>
  );
}

export default FeedbackSection;
