import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avighna-hr.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (formData: FormData) => apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  register: (data: any) => apiClient.post('/auth/register', data),
};

export const jdApi = {
  refine: (rawRequirements: string) => 
    apiClient.post('/jd/refine', null, { params: { raw_requirements: rawRequirements } }),
};

export const candidateApi = {
  uploadCv: (files: File[], jdText?: string) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
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
