import { API_BASE_URL, apiClient } from '../api';

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/auth/me`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Upload resume
export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await apiClient.post(`${API_BASE_URL}/profile/upload-resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

// Delete resume
export const deleteResume = async () => {
  try {
    await apiClient.delete(`${API_BASE_URL}/profile/resume`);
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// Get user applications
export const getUserApplications = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/applications/mine`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    await apiClient.put(`${API_BASE_URL}/profile/password`, { currentPassword, newPassword });
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (preferences) => {
  try {
    await apiClient.put(`${API_BASE_URL}/profile/notifications`, { preferences });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

// Delete user account
export const deleteAccount = async (password) => {
  try {
    await apiClient.delete(`${API_BASE_URL}/profile`, { data: { password } });
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};