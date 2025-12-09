import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, uploadResume, getUserApplications } from '../../services/userService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  DocumentTextIcon,
  TrashIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // Profile state
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
    resume: null,
  });
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });
  const [newEducation, setNewEducation] = useState({
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
  });
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  
  // Fetch user profile and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const [profileData, apps] = await Promise.all([
        //   getUserProfile(),
        //   getUserApplications()
        // ]);
        
        // Mock data
        const mockProfile = {
          fullName: user?.name || 'John Doe',
          email: user?.email || 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          headline: 'Senior Frontend Developer',
          bio: 'Passionate frontend developer with 5+ years of experience building responsive and user-friendly web applications using React, TypeScript, and modern JavaScript frameworks.',
          skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Redux', 'HTML5', 'CSS3', 'RESTful APIs'],
          experience: [
            {
              id: '1',
              title: 'Senior Frontend Developer',
              company: 'TechCorp',
              location: 'San Francisco, CA',
              startDate: '2020-01-01',
              endDate: null,
              current: true,
              description: 'Leading frontend development for enterprise applications, mentoring junior developers, and implementing best practices.'
            },
            {
              id: '2',
              title: 'Frontend Developer',
              company: 'WebSolutions',
              location: 'New York, NY',
              startDate: '2018-01-01',
              endDate: '2019-12-31',
              current: false,
              description: 'Developed and maintained multiple client websites and web applications.'
            }
          ],
          education: [
            {
              id: '1',
              school: 'Stanford University',
              degree: 'Master of Science',
              field: 'Computer Science',
              startDate: '2016-01-01',
              endDate: '2018-12-31',
              current: false
            },
            {
              id: '2',
              school: 'University of California, Berkeley',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              startDate: '2012-01-01',
              endDate: '2015-12-31',
              current: false
            }
          ],
          resume: {
            url: 'https://example.com/resume.pdf',
            name: 'John_Doe_Resume.pdf',
            uploadedAt: '2023-01-15T10:30:00Z'
          }
        };
        
        const mockApplications = [
          {
            id: 'app1',
            jobId: 'job1',
            jobTitle: 'Senior React Developer',
            company: 'TechCorp',
            status: 'submitted',
            appliedDate: '2023-05-15T14:30:00Z',
            lastUpdated: '2023-05-15T14:30:00Z'
          },
          {
            id: 'app2',
            jobId: 'job2',
            jobTitle: 'Frontend Engineer',
            company: 'WebSolutions',
            status: 'review',
            appliedDate: '2023-05-10T09:15:00Z',
            lastUpdated: '2023-05-12T11:20:00Z'
          },
          {
            id: 'app3',
            jobId: 'job3',
            jobTitle: 'UI/UX Developer',
            company: 'DesignHub',
            status: 'interview',
            appliedDate: '2023-05-01T16:45:00Z',
            lastUpdated: '2023-05-05T10:30:00Z',
            interviewDate: '2023-05-20T14:00:00Z'
          }
        ];
        
        setProfile(mockProfile);
        setApplications(mockApplications);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle experience input changes
  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle education input changes
  const handleEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Add a new skill
  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };
  
  // Remove a skill
  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  // Add new experience
  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      const experience = {
        id: Date.now().toString(),
        ...newExperience,
        current: newExperience.current || !newExperience.endDate
      };
      
      setProfile(prev => ({
        ...prev,
        experience: [experience, ...prev.experience]
      }));
      
      // Reset form
      setNewExperience({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
      
      setShowExperienceForm(false);
    }
  };
  
  // Remove experience
  const removeExperience = (id) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };
  
  // Add new education
  const addEducation = () => {
    if (newEducation.school && newEducation.degree) {
      const education = {
        id: Date.now().toString(),
        ...newEducation,
        current: newEducation.current || !newEducation.endDate
      };
      
      setProfile(prev => ({
        ...prev,
        education: [education, ...prev.education]
      }));
      
      // Reset form
      setNewEducation({
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false
      });
      
      setShowEducationForm(false);
    }
  };
  
  // Remove education
  const removeEducation = (id) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };
  
  // Handle resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size should be less than 5MB');
      return;
    }
    
    setUploadingResume(true);
    
    try {
      // In a real app, this would be an API call
      // const resumeData = await uploadResume(file);
      // setProfile(prev => ({
      //   ...prev,
      //   resume: resumeData
      // });
      
      // Mock upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResume = {
        url: URL.createObjectURL(file),
        name: file.name,
        uploadedAt: new Date().toISOString()
      };
      
      setProfile(prev => ({
        ...prev,
        resume: mockResume
      }));
      
      toast.success('Resume uploaded successfully');
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };
  
  // Remove resume
  const removeResume = () => {
    setProfile(prev => ({
      ...prev,
      resume: null
    }));
    
    // In a real app, you would also call an API to delete the resume from the server
    toast.success('Resume removed');
  };
  
  // Save profile
  const saveProfile = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // const updatedUser = await updateUserProfile(profile);
      // updateUser(updatedUser);
      
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({ ...user, name: profile.fullName });
      
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading && !editing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <div className="flex space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <XMarkIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Applications
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'resume'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Resume
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Settings
              </button>
            </nav>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <UserCircleIcon className="h-full w-full text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {editing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleInputChange}
                          className="block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500"
                          placeholder="Full Name"
                        />
                      ) : (
                        profile.fullName
                      )}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {editing ? (
                        <input
                          type="text"
                          name="headline"
                          value={profile.headline}
                          onChange={handleInputChange}
                          className="block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 mt-1"
                          placeholder="Your professional headline"
                        />
                      ) : (
                        profile.headline
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {editing ? (
                        <div className="flex w-full">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            className="block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 text-sm"
                            placeholder="Add a skill and press Enter"
                          />
                        </div>
                      ) : null}
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                        >
                          {skill}
                          {editing && (
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-teal-200 text-teal-600 hover:bg-teal-300 focus:outline-none"
                            >
                              <span className="sr-only">Remove skill</span>
                              <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                                <path fillRule="evenodd" d="M4 3.293L6.646.646a.5.5 0 01.708.708L4.707 4l2.647 2.646a.5.5 0 01-.708.708L4 4.707l-2.646 2.647a.5.5 0 01-.708-.708L3.293 4 .646 1.354a.5.5 0 01.708-.708L4 3.293z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  {profile.resume ? (
                    <div className="flex items-center">
                      <a
                        href={profile.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                        View Resume
                      </a>
                      {editing && (
                        <button
                          onClick={removeResume}
                          className="ml-2 p-2 text-gray-400 hover:text-red-500 focus:outline-none"
                          title="Remove resume"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ) : editing ? (
                    <div>
                      <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer">
                        <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                        Upload Resume
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          disabled={uploadingResume}
                        />
                      </label>
                      {uploadingResume && (
                        <p className="mt-1 text-xs text-gray-500">Uploading...</p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500"
                      />
                    ) : (
                      <a href={`mailto:${profile.email}`} className="text-teal-600 hover:text-teal-500">
                        {profile.email}
                      </a>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        className="block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500"
                      />
                    ) : (
                      <a href={`tel:${profile.phone.replace(/\D/g, '')}`} className="text-teal-600 hover:text-teal-500">
                        {profile.phone}
                      </a>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {editing ? (
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleInputChange}
                        className="block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500"
                        placeholder="City, Country"
                      />
                    ) : (
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {profile.location}
                      </div>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">About</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {editing ? (
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="whitespace-pre-line">{profile.bio}</p>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Experience Section */}
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                {editing && (
                  <button
                    type="button"
                    onClick={() => setShowExperienceForm(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-teal-700 bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    + Add Experience
                  </button>
                )}
              </div>

              {showExperienceForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Add Experience</h4>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={newExperience.title}
                        onChange={handleExperienceChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                        Company *
                      </label>
                      <input
                        type="text"
                        name="company"
                        id="company"
                        value={newExperience.company}
                        onChange={handleExperienceChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={newExperience.location}
                        onChange={handleExperienceChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date *
                      </label>
                      <input
                        type="month"
                        name="startDate"
                        id="startDate"
                        value={newExperience.startDate}
                        onChange={handleExperienceChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="month"
                          name="endDate"
                          id="endDate"
                          value={newExperience.endDate}
                          onChange={handleExperienceChange}
                          disabled={newExperience.current}
                          className={`block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                            newExperience.current ? 'bg-gray-100 text-gray-500' : ''
                          }`}
                        />
                        <div className="ml-3 flex items-center">
                          <input
                            id="current"
                            name="current"
                            type="checkbox"
                            checked={newExperience.current}
                            onChange={handleExperienceChange}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                          <label htmlFor="current" className="ml-2 block text-sm text-gray-700">
                            I currently work here
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={newExperience.description}
                        onChange={handleExperienceChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        placeholder="Describe your role and responsibilities"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowExperienceForm(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Save Experience
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flow-root">
                <ul className="-mb-8">
                  {profile.experience.length > 0 ? (
                    profile.experience.map((exp, expIdx) => (
                      <li key={exp.id}>
                        <div className="relative pb-8">
                          {expIdx !== profile.experience.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center ring-8 ring-white">
                                <BriefcaseIcon className="h-5 w-5 text-white" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-800 font-medium">
                                  {exp.title} at {exp.company}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                  {exp.location && ` • ${exp.location}`}
                                </p>
                                {exp.description && (
                                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                              {editing && (
                                <div className="text-right text-sm">
                                  <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        {editing ? 'Add your work experience to showcase your background' : 'No work experience added yet'}
                      </p>
                    </div>
                  )}
                </ul>
              </div>
            </div>

            {/* Education Section */}
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Education</h3>
                {editing && (
                  <button
                    type="button"
                    onClick={() => setShowEducationForm(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-teal-700 bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    + Add Education
                  </button>
                )}
              </div>

              {showEducationForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Add Education</h4>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                        School *
                      </label>
                      <input
                        type="text"
                        name="school"
                        id="school"
                        value={newEducation.school}
                        onChange={handleEducationChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                        Degree *
                      </label>
                      <input
                        type="text"
                        name="degree"
                        id="degree"
                        value={newEducation.degree}
                        onChange={handleEducationChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        placeholder="e.g. Bachelor's"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="field" className="block text-sm font-medium text-gray-700">
                        Field of Study *
                      </label>
                      <input
                        type="text"
                        name="field"
                        id="field"
                        value={newEducation.field}
                        onChange={handleEducationChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="eduStartDate" className="block text-sm font-medium text-gray-700">
                        Start Date *
                      </label>
                      <input
                        type="month"
                        name="startDate"
                        id="eduStartDate"
                        value={newEducation.startDate}
                        onChange={handleEducationChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="eduEndDate" className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="month"
                          name="endDate"
                          id="eduEndDate"
                          value={newEducation.endDate}
                          onChange={handleEducationChange}
                          disabled={newEducation.current}
                          className={`block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                            newEducation.current ? 'bg-gray-100 text-gray-500' : ''
                          }`}
                        />
                        <div className="ml-3 flex items-center">
                          <input
                            id="eduCurrent"
                            name="current"
                            type="checkbox"
                            checked={newEducation.current}
                            onChange={handleEducationChange}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                          <label htmlFor="eduCurrent" className="ml-2 block text-sm text-gray-700">
                            I currently study here
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEducationForm(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Save Education
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flow-root">
                <ul className="-mb-8">
                  {profile.education.length > 0 ? (
                    profile.education.map((edu, eduIdx) => (
                      <li key={edu.id}>
                        <div className="relative pb-8">
                          {eduIdx !== profile.education.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <AcademicCapIcon className="h-5 w-5 text-white" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-800 font-medium">
                                  {edu.school}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {edu.degree} in {edu.field}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                                </p>
                              </div>
                              {editing && (
                                <div className="text-right text-sm">
                                  <button
                                    onClick={() => removeEducation(edu.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        {editing ? 'Add your education background' : 'No education added yet'}
                      </p>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">My Applications</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Track the status of your job applications</p>
            </div>
            <div className="border-t border-gray-200">
              {applications.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {applications.map((application) => (
                    <li key={application.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-teal-600 truncate">
                            {application.jobTitle}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {application.company}
                          </p>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            Applied on {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      {application.interviewDate && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Interview scheduled for {new Date(application.interviewDate).toLocaleString()}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't applied to any jobs yet.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/jobs"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      <BriefcaseIcon className="-ml-1 mr-2 h-5 w-5" />
                      Browse Jobs
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">My Resume</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Upload and manage your resume to apply for jobs quickly
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              {profile.resume ? (
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {profile.resume.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date(profile.resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={profile.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-teal-600 hover:text-teal-500"
                      >
                        View
                      </a>
                      <button
                        onClick={removeResume}
                        className="ml-4 font-medium text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No resume uploaded</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload your resume to apply for jobs with a single click.
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <label className="group relative flex flex-col items-center justify-center w-full py-10 border-2 border-gray-300 border-dashed rounded-lg bg-white text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-500"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm text-gray-600">
                      <span className="relative cursor-pointer rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="resume-upload" 
                          name="resume-upload" 
                          type="file" 
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          disabled={uploadingResume}
                        />
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX up to 5MB
                    </p>
                  </div>
                </label>
                {uploadingResume && (
                  <div className="mt-4 flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2 text-sm text-gray-500">Uploading resume...</span>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Resume Tips</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                    <span>Use a professional, easy-to-read format</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                    <span>Include relevant skills and experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                    <span>Keep it concise (1-2 pages recommended)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" />
                    <span>Save as a PDF for best results</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage your account preferences and security settings
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="current-password"
                            id="current-password"
                            className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-4">
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-4">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            name="confirm-password"
                            id="confirm-password"
                            className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-4">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Email Notifications</h4>
                  <div className="bg-white">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="job-alerts"
                            name="job-alerts"
                            type="checkbox"
                            defaultChecked
                            className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="job-alerts" className="font-medium text-gray-700">
                            Job Alerts
                          </label>
                          <p className="text-gray-500">Receive email notifications about new job postings that match your profile</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="application-updates"
                            name="application-updates"
                            type="checkbox"
                            defaultChecked
                            className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="application-updates" className="font-medium text-gray-700">
                            Application Updates
                          </label>
                          <p className="text-gray-500">Get updates on your job applications</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="newsletter"
                            name="newsletter"
                            type="checkbox"
                            defaultChecked
                            className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="newsletter" className="font-medium text-gray-700">
                            Newsletter
                          </label>
                          <p className="text-gray-500">Receive our monthly newsletter with career tips and industry insights</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-md font-medium text-red-700">Delete Account</h4>
                      <p className="text-sm text-gray-500">
                        Permanently delete your account and all of your data.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfilePage;
