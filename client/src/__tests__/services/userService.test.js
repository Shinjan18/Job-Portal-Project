import axios from 'axios';
import {
  getUserProfile,
  updateUserProfile,
  uploadResume,
  deleteResume,
  getUserApplications,
  updatePassword,
  updateNotificationPreferences,
  deleteAccount,
} from '../../services/userService';

// Mock axios
jest.mock('axios');

describe('User Service', () => {
  const mockResponse = (data) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  });

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    axios.get.mockClear();
    axios.post.mockClear();
    axios.put.mockClear();
    axios.delete.mockClear();
  });

  describe('getUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
      axios.get.mockResolvedValueOnce(mockResponse(mockUser));

      const result = await getUserProfile();

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/users/me'), {
        withCredentials: true,
      });
      expect(result).toEqual(mockUser);
    });

    it('should handle errors when fetching user profile', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getUserProfile()).rejects.toThrow(errorMessage);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const profileData = { name: 'John Updated' };
      const updatedUser = { id: '1', ...profileData };
      axios.put.mockResolvedValueOnce(mockResponse(updatedUser));

      const result = await updateUserProfile(profileData);

      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/me'),
        profileData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('uploadResume', () => {
    it('should upload resume successfully', async () => {
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const responseData = { url: 'http://example.com/resume.pdf' };
      axios.post.mockResolvedValueOnce(mockResponse(responseData));

      const result = await uploadResume(file);

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/me/resume'),
        expect.any(FormData),
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('deleteResume', () => {
    it('should delete resume successfully', async () => {
      axios.delete.mockResolvedValueOnce(mockResponse({}));

      await deleteResume();

      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/me/resume'),
        {
          withCredentials: true,
        }
      );
    });
  });

  describe('getUserApplications', () => {
    it('should fetch user applications successfully', async () => {
      const mockApplications = [{ id: '1', jobTitle: 'Frontend Developer' }];
      axios.get.mockResolvedValueOnce(mockResponse(mockApplications));

      const result = await getUserApplications();

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/applications/me'), {
        withCredentials: true,
      });
      expect(result).toEqual(mockApplications);
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const passwordData = {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
      };
      axios.put.mockResolvedValueOnce(mockResponse({}));

      await expect(updatePassword(passwordData.currentPassword, passwordData.newPassword)).resolves.toBeUndefined();

      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/me/password'),
        passwordData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });

  describe('updateNotificationPreferences', () => {
    it('should update notification preferences successfully', async () => {
      const preferences = { email: true, sms: false };
      axios.put.mockResolvedValueOnce(mockResponse({}));

      await updateNotificationPreferences(preferences);

      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/me/notifications'),
        { preferences },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account successfully', async () => {
      const password = 'password123';
      axios.delete.mockResolvedValueOnce(mockResponse({}));

      await deleteAccount(password);

      expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/api/users/me'), {
        withCredentials: true,
        data: { password },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });
});
