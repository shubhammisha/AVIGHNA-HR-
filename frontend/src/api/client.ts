import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avighna-hr.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jdApi = {
  refine: (rawRequirements: string) => 
    apiClient.post('/jd/refine', null, { params: { raw_requirements: rawRequirements } }),
};

export const candidateApi = {
  uploadCv: (file: File, jdText?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (jdText) formData.append('jd_text', jdText);
    return apiClient.post('/candidates/upload-cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const interviewApi = {
  getQuestions: (jdText: string, cvText: string) => 
    apiClient.post('/interview/generate-questions', { jd_text: jdText, cv_text: cvText }),
};

export const psychometricApi = {
  analyze: (responses: any) => 
    apiClient.post('/psychometric/analyze', responses),
};

export default apiClient;
