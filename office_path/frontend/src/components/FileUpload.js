import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config';

function FileUpload({ onFilesUploaded }) {
  const [files, setFiles] = useState({
    accidentReport: null,
    victimExplanation: null,
    additionalDocs: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (type, event) => {
    const selectedFiles = event.target.files;
    
    if (type === 'additionalDocs') {
      setFiles(prev => ({
        ...prev,
        additionalDocs: Array.from(selectedFiles)
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        [type]: selectedFiles[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData to send PDF and optionally DOCX files
      const formData = new FormData();
      formData.append('file', files.accidentReport);  // PDF file (zawiadomienie o wypadku)
      
      // Only append DOCX if it exists
      if (files.victimExplanation) {
        formData.append('file2', files.victimExplanation);  // DOCX file (wyjaśnienie poszkodowanego)
      }

      // Send file(s) to backend endpoint
      const response = await fetch(API_ENDPOINTS.UPLOAD_PDF, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload and analyze documents');
      }

      const extractedData = await response.json();
      
      // Pass files and extracted data to parent
      onFilesUploaded({
        files,
        extractedData
      });
    } catch (err) {
      setError(err.message);
      console.error('Error uploading files:', err);
    } finally {
      setLoading(false);
    }
  };

  const isValid = files.accidentReport;  // Only PDF is required

  return (
    <div className="file-upload-section">
      <h2>Wczytanie Dokumentów</h2>
      <p className="section-description">
        Prześlij wszystkie dokumenty związane ze zgłoszeniem wypadku przy pracy
      </p>

      <form onSubmit={handleSubmit}>
        <div className="file-input-group">
          <label htmlFor="accidentReport">
            <span className="required">*</span> Formularz zgłoszenia wypadku (PDF)
          </label>
          <input
            type="file"
            id="accidentReport"
            accept=".pdf"
            onChange={(e) => handleFileChange('accidentReport', e)}
            required
            disabled={loading}
          />
          {files.accidentReport && (
            <span className="file-name">✓ {files.accidentReport.name}</span>
          )}
        </div>

        <div className="file-input-group">
          <label htmlFor="victimExplanation">
            Wyjaśnienie poszkodowanego (DOCX)
          </label>
          <input
            type="file"
            id="victimExplanation"
            accept=".docx"
            onChange={(e) => handleFileChange('victimExplanation', e)}
            disabled={loading}
          />
          {files.victimExplanation && (
            <span className="file-name">✓ {files.victimExplanation.name}</span>
          )}
          <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
            Jeśli dostępne, załącz wyjaśnienie poszkodowanego dla automatycznego porównania danych
          </small>
        </div>

        <div className="file-input-group">
          <label htmlFor="additionalDocs">
            Dodatkowe dokumenty (opcjonalnie)
          </label>
          <input
            type="file"
            id="additionalDocs"
            accept=".pdf,.doc,.docx,.jpg,.png"
            multiple
            onChange={(e) => handleFileChange('additionalDocs', e)}
            disabled={loading}
          />
          {files.additionalDocs.length > 0 && (
            <div className="file-list">
              {files.additionalDocs.map((file, idx) => (
                <span key={idx} className="file-name">✓ {file.name}</span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            ⚠️ Błąd: {error}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={!isValid || loading}
        >
          {loading ? 'Analizowanie dokumentu...' : 'Rozpocznij analizę'}
        </button>
      </form>
    </div>
  );
}

export default FileUpload;
