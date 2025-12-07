import React from 'react';

function PathSelection({ onSelectPath }) {
  return (
    <div className="section-container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#039b45',
          marginBottom: '1rem',
          fontWeight: '700'
        }}>
          System Zgłaszania Wypadków przy Pracy
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#666',
          lineHeight: '1.6'
        }}>
          Wybierz odpowiedni formularz, który chcesz wypełnić
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem',
        marginTop: '3rem'
      }}>
        {/* EWYP - Zawiadomienie o Wypadku */}
        <div 
          onClick={() => onSelectPath('ewyp')}
          className="path-selection-card"
          style={{
            background: 'linear-gradient(135deg, #039b45 0%, #81cb32 100%)',
            padding: '2.5rem',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 24px rgba(3, 155, 69, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(3, 155, 69, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(3, 155, 69, 0.25)';
          }}
        >
          <div style={{ 
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              marginBottom: '1.25rem',
              textAlign: 'center',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="white" style={{ display: 'inline-block' }}>
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h2 style={{ 
              color: 'white', 
              fontSize: '1.6rem',
              marginBottom: '1rem',
              fontWeight: '700',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Zawiadomienie o Wypadku przy Pracy
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.95)', 
              fontSize: '0.95rem',
              lineHeight: '1.7',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              Formularz EWYP służący do oficjalnego zgłoszenia wypadku przy pracy do ZUS
            </p>
            <div style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <strong>Wypełnia:</strong> Pracodawca lub pracownik
            </div>
          </div>
        </div>

        {/* Wyjaśnienia poszkodowanego */}
        <div 
          onClick={() => onSelectPath('explanation')}
          className="path-selection-card"
          style={{
            background: 'linear-gradient(135deg, #81cb32 0%, #bcd144 100%)',
            padding: '2.5rem',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 24px rgba(129, 203, 50, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(129, 203, 50, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(129, 203, 50, 0.25)';
          }}
        >
          <div style={{ 
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              marginBottom: '1.25rem',
              textAlign: 'center',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="white" style={{ display: 'inline-block' }}>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </div>
            <h2 style={{ 
              color: 'white', 
              fontSize: '1.6rem',
              marginBottom: '1rem',
              fontWeight: '700',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Zapis Wyjaśnień Poszkodowanego
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.95)', 
              fontSize: '0.95rem',
              lineHeight: '1.7',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              Dokument zawierający relację poszkodowanego pracownika o okolicznościach wypadku
            </p>
            <div style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <strong>Wypełnia:</strong> Poszkodowany pracownik
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ color: '#333', fontSize: '1rem', marginBottom: '0.75rem' }}>
          ℹ️ Informacja
        </h3>
        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
          Oba dokumenty są wymagane do kompleksowego zgłoszenia wypadku przy pracy. 
          Możesz wypełnić je w dowolnej kolejności. System pomoże Ci w prawidłowym 
          wypełnieniu wszystkich wymaganych pól.
        </p>
      </div>
    </div>
  );
}

export default PathSelection;
