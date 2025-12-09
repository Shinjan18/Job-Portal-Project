import api from './authService';

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/api/profile', profileData);
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

    const response = await api.post('/api/profile/upload-resume', formData, {
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
    await api.delete('/api/profile/resume');
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// Get user applications
export const getUserApplications = async () => {
  try {
    const response = await api.get('/api/applications/mine');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    await api.put('/api/profile/password', { currentPassword, newPassword });
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (preferences) => {
  try {
    await api.put('/api/profile/notifications', { preferences });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

// Delete user account
export const deleteAccount = async (password) => {
  try {
    await api.delete('/api/profile', { data: { password } });
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};