import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCurrentUser, updateProfile, uploadResume } from '../../services/authService';
import { toast } from 'react-hot-toast';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    bio: '',
    experience: '',
    education: '',
    skills: '',
    resumeUrl: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch the current user's profile
        // const userData = await getCurrentUser();
        
        // For now, we'll use the auth context user data
        setProfile({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          location: user?.location || '',
          headline: user?.headline || '',
          bio: user?.bio || '',
          experience: user?.experience || '',
          education: user?.education || '',
          skills: (user?.skills || []).join(', '),
          resumeUrl: user?.resumeUrl || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleUploadResume = async () => {
    if (!resumeFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      const response = await uploadResume(formData);
      setProfile(prev => ({
        ...prev,
        resumeUrl: response.resumeUrl
      }));
      toast.success('Resume uploaded successfully!');
      setResumeFile(null);
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const profileData = {
        ...profile,
        skills: profile.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };
      
      const response = await updateProfile(profileData);
      updateUser(response.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your personal and professional information.
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                    Professional Headline
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="headline"
                      id="headline"
                      value={profile.headline}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={profile.bio}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={profile.location}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                    Skills
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="skills"
                      id="skills"
                      value={profile.skills}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      placeholder="e.g. React, JavaScript, Node.js (comma separated)"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Enter skills separated by commas
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Work Experience
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="experience"
                      name="experience"
                      rows={3}
                      value={profile.experience}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      placeholder="Describe your work experience..."
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                    Education
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="education"
                      name="education"
                      rows={3}
                      value={profile.education}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      placeholder="Your educational background..."
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Resume
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="flex-1">
                      {profile.resumeUrl ? (
                        <div className="flex items-center text-sm text-gray-500">
                          <DocumentTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                          <a 
                            href={profile.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-500"
                          >
                            View Current Resume
                          </a>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No resume uploaded</p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="flex items-center">
                        <input
                          type="file"
                          id="resume-upload"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="resume-upload"
                          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          Choose File
                        </label>
                        {resumeFile && (
                          <button
                            type="button"
                            onClick={handleUploadResume}
                            disabled={uploading}
                            className={`ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                              uploading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                          >
                            {uploading ? 'Uploading...' : 'Upload'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    PDF, DOC, DOCX up to 5MB
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.name || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.email || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.phone || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.location || 'Not provided'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Professional Headline</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.headline || 'Not provided'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.bio || 'Not provided'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Skills</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.skills ? profile.skills.split(',').map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mr-2"
                      >
                        {skill.trim()}
                      </span>
                    )) : 'Not provided'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Work Experience</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{profile.experience || 'Not provided'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Education</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{profile.education || 'Not provided'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Resume</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.resumeUrl ? (
                      <a 
                        href={profile.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-teal-600 hover:text-teal-500"
                      >
                        <DocumentTextIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                        View Resume
                      </a>
                    ) : (
                      'Not uploaded'
                    )}
                  </dd>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;