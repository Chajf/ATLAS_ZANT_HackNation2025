import React, { useState } from 'react';

function ExplanationSection4({ formData, onPrev }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleDownloadDOCX = async () => {
    setIsDownloading(true);
    setError(null);
    
    try {
      // Prepare data with generated date
      const requestData = {
        ...formData,
        generatedDate: new Date().toLocaleString('pl-PL')
      };

      const response = await fetch(`${API_URL}/generate-injured-statement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Błąd serwera' }));
        throw new Error(errorData.detail || `Błąd HTTP: ${response.status}`);
      }

      // Get DOCX blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `Zapis_wyjasnienia_poszkodowanego_${new Date().toISOString().split('T')[0]}.docx`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error downloading DOCX:', err);
      setError(err.message || 'Nie udało się pobrać pliku DOCX. Sprawdź czy backend jest uruchomiony.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = (format) => {
    // Przygotowanie danych do pobrania
    const data = {
      ...formData,
      generatedDate: new Date().toLocaleString('pl-PL')
    };

    if (format === 'json') {
      // Pobierz jako JSON (edytowalny format)
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wyjasnienia_poszkodowanego_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'txt') {
      // Pobierz jako TXT (edytowalny format tekstowy)
      let content = '='.repeat(80) + '\n';
      content += 'ZAPIS WYJAŚNIEŃ POSZKODOWANEGO\n';
      content += '='.repeat(80) + '\n\n';
      
      content += 'CZĘŚĆ 1: DANE O WYPADKU\n';
      content += '-'.repeat(80) + '\n';
      content += `Data wypadku: ${formData.accidentDate || 'Nie podano'}\n`;
      content += `Godzina wypadku: ${formData.accidentTime || 'Nie podano'}\n`;
      content += `Miejsce wypadku:\n`;
      content += `  Ulica: ${formData.accidentStreet || 'Nie podano'}\n`;
      content += `  Numer domu: ${formData.accidentHouseNumber || 'Nie podano'}\n`;
      content += `  Numer lokalu: ${formData.accidentApartmentNumber || '-'}\n`;
      content += `  Kod pocztowy: ${formData.accidentPostalCode || 'Nie podano'}\n`;
      content += `  Miejscowość: ${formData.accidentCity || 'Nie podano'}\n\n`;
      
      content += 'CZĘŚĆ 2: DANE POSZKODOWANEGO\n';
      content += '-'.repeat(80) + '\n';
      content += `Imię (Imiona): ${formData.firstName || 'Nie podano'}\n`;
      content += `Nazwisko: ${formData.lastName || 'Nie podano'}\n`;
      content += `Imię ojca: ${formData.fatherName || 'Nie podano'}\n`;
      content += `Data urodzenia: ${formData.birthDate || 'Nie podano'}\n`;
      content += `Miejsce urodzenia: ${formData.birthPlace || 'Nie podano'}\n`;
      content += `PESEL: ${formData.pesel || 'Nie podano'}\n`;
      content += `NIP: ${formData.nip || 'Nie podano'}\n`;
      content += `Miejsce zamieszkania: ${formData.residenceAddress || 'Nie podano'}\n`;
      content += `Adres do korespondencji: ${formData.correspondenceAddress || 'Nie podano'}\n`;
      content += `Miejsce zatrudnienia: ${formData.employmentPlace || 'Nie podano'}\n`;
      content += `Stanowisko: ${formData.position || 'Nie podano'}\n`;
      content += `Dokument tożsamości: ${formData.identityDocument || 'Nie podano'}\n\n`;
      
      content += 'CZĘŚĆ 3: OPIS WYPADKU\n';
      content += '-'.repeat(80) + '\n';
      content += `${formData.accidentDescription || 'Nie podano opisu wypadku'}\n\n`;
      
      if (formData.medicalDocuments && formData.medicalDocuments.length > 0) {
        content += 'DOKUMENTY MEDYCZNE:\n';
        formData.medicalDocuments.forEach((doc, index) => {
          if (doc) {
            content += `${index + 1}. ${doc}\n`;
          }
        });
        content += '\n';
      }
      
      content += '='.repeat(80) + '\n';
      content += `Dokument wygenerowany: ${data.generatedDate}\n`;
      content += '='.repeat(80) + '\n';

      const dataBlob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wyjasnienia_poszkodowanego_${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Część 4: Podsumowanie i pobieranie dokumentu</h2>
      
      <div style={{
        background: '#e8f5e9',
        border: '2px solid #4caf50',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#2e7d32', marginBottom: '1rem', fontSize: '1.2rem' }}>
          ✅ Formularz wypełniony pomyślnie!
        </h3>
        <p style={{ color: '#333', lineHeight: '1.6', marginBottom: '0' }}>
          Wszystkie wymagane dane zostały wprowadzone. Możesz teraz pobrać dokument 
          i przesłać go do ZUS.
        </p>
      </div>

      <div style={{
        background: '#fff3e0',
        border: '2px solid #ff9800',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#e65100', marginBottom: '1rem', fontSize: '1.1rem' }}>
          ⚠️ Koniecznie:
        </h3>
        <ul style={{ color: '#333', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem' }}>
          <li>
            <strong>Pobierz i zapoznaj się</strong> z treścią sporządzonego zapisu wyjaśnień poszkodowanego
          </li>
          <li>
            <strong>Złóż podpis</strong> na wydrukowanym dokumencie
          </li>
          <li>
            <strong>Prześlij dokument</strong> za pośrednictwem PUE/eZUS lub złóż go bezpośrednio 
            w dowolnej placówce ZUS
          </li>
        </ul>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: '1px solid #fcc'
        }}>
          <strong>Błąd:</strong> {error}
        </div>
      )}

      <div style={{
        background: 'white',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#333', marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
          </svg>
          Pobierz dokument
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={handleDownloadDOCX}
            disabled={isDownloading}
            style={{
              padding: '1.5rem',
              background: isDownloading 
                ? 'linear-gradient(135deg, #999 0%, #777 100%)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              opacity: isDownloading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isDownloading) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              {isDownloading ? 'Generowanie DOCX...' : '📄 Pobierz Zapis Wyjaśnień (DOCX)'}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              Gotowy dokument Word do wydruku i podpisu
            </div>
          </button>
        </div>

        <details style={{ marginTop: '1rem' }}>
          <summary style={{ cursor: 'pointer', color: '#667eea', fontWeight: '600', marginBottom: '0.5rem' }}>
            Pobierz w innych formatach (opcjonalnie)
          </summary>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={() => handleDownload('txt')}
              disabled={isDownloading}
              style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            <div style={{ marginBottom: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Format edytowalny (TXT)</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              Plik tekstowy do edycji i wydruku
            </div>
          </button>

            <button
              onClick={() => handleDownload('json')}
              disabled={isDownloading}
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)',
                opacity: isDownloading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isDownloading) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 87, 108, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 87, 108, 0.3)';
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
              </div>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Format danych (JSON)</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                Do przechowania i ponownej edycji
              </div>
            </button>
          </div>
        </details>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '6px',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <strong>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '0.25rem' }}>
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
            </svg>
            Wskazówka:
          </strong> {isDownloading 
            ? 'Trwa generowanie dokumentu...' 
            : 'Pobierz dokument w formacie DOCX (Word), wydrukuj go, podpisz i dostarcz do ZUS. Możesz też pobrać kopię w innych formatach.'
          }
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
      </div>
    </div>
  );
}

export default ExplanationSection4;
