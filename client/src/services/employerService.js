import { apiClient } from '../api';

// Get employer dashboard overview stats
export const getEmployerOverview = async () => {
    try {
        const response = await apiClient.get('/employer/overview');
        return response.data;
    } catch (error) {
        console.error('Error fetching employer overview:', error);
        throw error;
    }
};

export const getEmployerApplications = async () => {
    const response = await apiClient.get('/employer/applications');
    return response.data;
};

export const getApplicationDetails = async (id) => {
    const response = await apiClient.get(`/employer/applications/${id}`);
    return response.data;
};

export const updateAppStatus = async (id, status) => {
    const response = await apiClient.patch(`/employer/applications/${id}/status`, { status });
    return response.data;
};
