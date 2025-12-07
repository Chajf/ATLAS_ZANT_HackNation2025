// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  UPLOAD_PDF: `${API_BASE_URL}/upload-pdf`,
  EVALUATE_INJURY: `${API_BASE_URL}/evaluate-injury`,
  ASSESS_WORKPLACE_ACCIDENT: `${API_BASE_URL}/assess-workplace-accident`,
  GENERATE_JUSTIFICATION: `${API_BASE_URL}/generate-justification`,
  HEALTH: `${API_BASE_URL}/health`
};

export default API_BASE_URL;
