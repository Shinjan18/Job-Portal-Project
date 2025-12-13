import apiClient from '../api';

export interface JobParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  location?: string;
  jobType?: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: string;
  jobType: string;
  experienceLevel: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  logo?: string;
  jobCount: number;
  website?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<{ jobs: T[]; total: number; page: number; limit: number }> {}

export const jobService = {
  // Get all jobs with optional filters
  getJobs: async (params: JobParams = {}): Promise<PaginatedResponse<Job>> => {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      type, 
      location, 
      jobType 
    } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (search) queryParams.append('search', search);
    if (type) queryParams.append('type', type);
    if (location) queryParams.append('location', location);
    if (jobType) queryParams.append('jobType', jobType);
    
    const response = await apiClient.get<PaginatedResponse<Job>>(`/jobs?${queryParams}`);
    return response.data;
  },

  // Get a single job by ID
  async getJobById(id: string): Promise<Job> {
    const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data.data;
  },

  // Get featured jobs (first page with 6 items)
  getFeaturedJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<PaginatedResponse<Job>>('/jobs?page=1&limit=6');
    return response.data.data.jobs;
  },

  // Quick apply for a job
  quickApply: async (jobId: string, formData: FormData): Promise<{ success: boolean; trackToken: string; message?: string }> => {
    const response = await apiClient.post(
      `/jobs/${jobId}/quick-apply`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Track application status
  trackApplication: async (token: string): Promise<{
    success: boolean;
    data?: {
      _id: string;
      job: string | { _id: string; title: string; company: string };
      applicant: string | { _id: string; name: string; email: string };
      email: string;
      status: string;
      resumeUrl: string;
      pdfUrl?: string;
      message?: string;
      createdAt: string;
      updatedAt: string;
    };
    message?: string;
  }> => {
    try {
      const response = await apiClient.get(`/applications/track/${token}`);
      return response.data;
    } catch (error: any) {
      console.error('Error tracking application:', error);
      throw error;
    }
  },

  // Get all companies
  async getCompanies(): Promise<Company[]> {
    const response = await apiClient.get<ApiResponse<Company[]>>('/companies');
    return response.data.data;
  },
};
