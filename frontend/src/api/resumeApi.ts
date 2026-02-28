import axios from 'axios';

// Use environment variable initially, fallback to empty string (relative path) for production
// When served from the same domain, relative path '/api' hits the same server.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

export const resumeApi = {
    pingHealth: async () => {
        try {
            const response = await apiClient.get('/health');
            return response.data;
        } catch (error) {
            console.error('Failed to ping server health:', error);
            throw error;
        }
    },

    analyzeResume: async (formData: FormData) => {
        try {
            const response = await apiClient.post('/api/resume/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to analyze resume:', error);
            throw error;
        }
    },

    generatePdf: async (optimizedData: any) => {
        try {
            const response = await apiClient.post('/api/resume/generate-pdf', { optimizedData }, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            throw error;
        }
    }
};
