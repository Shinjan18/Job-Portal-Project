import { API_BASE_URL, apiClient } from '../api';

const JOB_API = `${API_BASE_URL}/jobs`;

export const getJobs = async (filters = {}) => {
  try {
    const { q, jobType, location, page = 1, limit = 10, type, experience, salary, sort } = filters;
    const params = new URLSearchParams();
    
    if (q) params.append('q', q);
    if (jobType || type) params.append('type', jobType || type);
    if (location) params.append('location', location);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (experience) params.append('experience', experience);
    if (salary) params.append('salary', salary);
    if (sort) params.append('sort', sort);
    
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
    const config =
      applicationData instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;
    const response = await apiClient.post(`${API_BASE_URL}/apply/${jobId}`, applicationData, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to apply for job');
  }
};

export const getMyApplications = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/applications/mine`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch applications');
  }
};

export const getJobApplications = async (jobId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/applications/employer`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch job applications');
  }
};

export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await apiClient.patch(`${API_BASE_URL}/applications/${applicationId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update application status');
  }
};
