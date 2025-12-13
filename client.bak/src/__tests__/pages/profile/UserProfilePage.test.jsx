import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserProfilePage from '../../../pages/profile/UserProfilePage';
import { AuthProvider } from '../../../context/AuthContext';
import * as userService from '../../../services/userService';

// Mock the userService
jest.mock('../../../services/userService');

// Mock the react-hot-toast
global.toast = {
  success: jest.fn(),
  error: jest.fn(),
};

// Mock the AuthContext
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  updateUser: jest.fn(),
};

const renderWithProviders = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  
  return render(
    <AuthProvider value={{ user: mockUser, updateUser: mockUser.updateUser }}>
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('UserProfilePage', () => {
  const mockProfile = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    location: 'New York, USA',
    headline: 'Senior Developer',
    bio: 'Experienced developer with 5+ years of experience',
    skills: ['React', 'Node.js', 'TypeScript'],
    experience: [
      {
        id: '1',
        title: 'Senior Developer',
        company: 'Tech Corp',
        location: 'New York, USA',
        startDate: '2020-01-01',
        endDate: null,
        current: true,
        description: 'Working on awesome projects',
      },
    ],
    education: [
      {
        id: '1',
        school: 'Tech University',
        degree: 'BSc Computer Science',
        field: 'Computer Science',
        startDate: '2015-01-01',
        endDate: '2019-12-31',
        current: false,
      },
    ],
    resume: {
      url: 'http://example.com/resume.pdf',
      name: 'resume.pdf',
      uploadedAt: '2023-01-01T00:00:00.000Z',
    },
  };

  const mockApplications = [
    {
      id: '1',
      jobId: '1',
      jobTitle: 'Frontend Developer',
      company: 'Web Solutions',
      status: 'submitted',
      appliedDate: '2023-01-01T00:00:00.000Z',
      lastUpdated: '2023-01-01T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock the userService functions
    userService.getUserProfile.mockResolvedValue(mockProfile);
    userService.getUserApplications.mockResolvedValue(mockApplications);
    userService.updateUserProfile.mockResolvedValue({ ...mockProfile, fullName: 'John Updated' });
    userService.uploadResume.mockResolvedValue({
      url: 'http://example.com/new-resume.pdf',
      name: 'new-resume.pdf',
    });
  });

  test('renders user profile with data', async () => {
    renderWithProviders(<UserProfilePage />);

    // Check if loading spinner is shown initially
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('New York, USA')).toBeInTheDocument();
    });

    // Check if skills are rendered
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Check if experience is rendered
    expect(screen.getByText('Senior Developer at Tech Corp')).toBeInTheDocument();

    // Check if education is rendered
    expect(screen.getByText('BSc Computer Science in Computer Science')).toBeInTheDocument();
  });

  test('switches between tabs', async () => {
    renderWithProviders(<UserProfilePage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click on Applications tab
    fireEvent.click(screen.getByText('My Applications'));
    expect(screen.getByText('My Applications')).toHaveClass('border-teal-500');
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();

    // Click on Resume tab
    fireEvent.click(screen.getByText('Resume'));
    expect(screen.getByText('Resume')).toHaveClass('border-teal-500');
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();

    // Click on Settings tab
    fireEvent.click(screen.getByText('Account Settings'));
    expect(screen.getByText('Account Settings')).toHaveClass('border-teal-500');
    expect(screen.getByText('Change Password')).toBeInTheDocument();
  });

  test('enables edit mode', async () => {
    renderWithProviders(<UserProfilePage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText('Edit Profile'));

    // Check if form fields are in edit mode
    const nameInput = screen.getByDisplayValue('John Doe');
    expect(nameInput).toBeInTheDocument();

    // Change the name
    fireEvent.change(nameInput, { target: { value: 'John Updated' } });
    expect(nameInput.value).toBe('John Updated');

    // Save changes
    fireEvent.click(screen.getByText('Save Changes'));

    // Check if updateUserProfile was called
    await waitFor(() => {
      expect(userService.updateUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: 'John Updated' })
      );
    });
  });

  test('adds and removes skills', async () => {
    renderWithProviders(<UserProfilePage />);

    // Wait for data to load and enter edit mode
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Edit Profile'));

    // Add a new skill
    const skillInput = screen.getByPlaceholderText('Add a skill and press Enter');
    fireEvent.change(skillInput, { target: { value: 'GraphQL' } });
    fireEvent.keyDown(skillInput, { key: 'Enter', code: 'Enter' });

    // Check if the skill was added
    expect(screen.getByText('GraphQL')).toBeInTheDocument();

    // Remove a skill
    const skillToRemove = screen.getByText('React').nextSibling;
    fireEvent.click(skillToRemove);
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  test('uploads a resume', async () => {
    // Mock file
    const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });
    
    renderWithProviders(<UserProfilePage />);

    // Wait for data to load and go to Resume tab
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Resume'));

    // Upload a new resume
    const fileInput = screen.getByLabelText(/upload a file/i);
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });
    fireEvent.change(fileInput);

    // Check if uploadResume was called
    await waitFor(() => {
      expect(userService.uploadResume).toHaveBeenCalledWith(file);
    });
  });

  test('handles API errors', async () => {
    // Mock API error
    userService.getUserProfile.mockRejectedValueOnce(new Error('Failed to fetch profile'));
    
    // Mock console.error to avoid error logs in test output
    const originalError = console.error;
    console.error = jest.fn();

    renderWithProviders(<UserProfilePage />);

    // Check if error toast was shown
    await waitFor(() => {
      expect(global.toast.error).toHaveBeenCalledWith('Failed to load profile data');
    });

    // Restore console.error
    console.error = originalError;
  });
});
