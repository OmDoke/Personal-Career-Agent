import axios from 'axios';

// Use environment variable or default to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
    }
};
