import { apiClient } from '../api';

const JOB_API = '/jobs';

export const getJobs = async (filters = {}) => {
  try {
    const { q, jobType, location, page = 1, limit = 10 } = filters;
    const params = new URLSearchParams();
    
    if (q) params.append('q', q);
    if (jobType) params.append('type', jobType);
    if (location) params.append('location', location);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    
    const response = await apiClient.get(`${JOB_API}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
  }
};

// Alias getJobs as searchJobs for backward compatibility
export const searchJobs = getJobs;

export const getJobById = async (id) => {
  try {
    const response = await apiClient.get(`${JOB_API}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch job details');
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await apiClient.post(JOB_API, jobData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create job');
  }
};

export const updateJob = async (id, jobData) => {
  try {
    const response = await apiClient.put(`${JOB_API}/${id}`, jobData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update job');
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await apiClient.delete(`${JOB_API}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete job');
  }
};

export const applyForJob = async (jobId, applicationData) => {
  try {
    const response = await apiClient.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to apply for job');
  }
};

export const getMyApplications = async () => {
  try {
    const response = await apiClient.get('/applications/mine');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch applications');
  }
};

export const getJobApplications = async (jobId) => {
  try {
    // This endpoint doesn't seem to exist in the backend, using employer applications instead
    const response = await apiClient.get('/applications/employer');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch job applications');
  }
};

export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await apiClient.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update application status');
  }
};

export const quickApplyForJob = async (jobId, formData) => {
  try {
    const response = await apiClient.post(`/jobs/${jobId}/quick-apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit quick application');
  }
};
