// client/src/pages/applications/TrackApplicationPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  BriefcaseIcon, 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// API helper
import { apiClient } from '../../api';

const TrackApplicationPage = () => {
  const [searchParams] = useSearchParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const fetchApplication = async () => {
      if (!token || !email) {
        setError('Missing tracking information');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get(`/applications/track?token=${token}&email=${email}`);
        if (response.data.success) {
          setApplication(response.data.application);
        } else {
          setError(response.data.message || 'Application not found');
        }
      } catch (err) {
        console.error('Error fetching application:', err);
        setError(err.response?.data?.message || 'Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [token, email]);

  const openResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  const downloadPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Unable to Track Application</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Application Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">We couldn't find an application matching your tracking information.</p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-indigo-100 text-indigo-800';
      case 'Interview':
        return 'bg-purple-100 text-purple-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Application Tracking</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Track the status of your job application
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{application.jobTitle}</h2>
                <div className="mt-2 flex items-center text-gray-600">
                  <BuildingOfficeIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                  <span>{application.company}</span>
                </div>
              </div>
              <span className={`mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Applicant Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <UserIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-base text-gray-900">{application.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <EnvelopeIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base text-gray-900">{application.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <PhoneIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-base text-gray-900">{application.phone}</p>
                    </div>
                  </div>
                  {application.message && (
                    <div className="flex items-start">
                      <BriefcaseIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Message</p>
                        <p className="text-base text-gray-900">{application.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <ClockIcon className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Applied On</p>
                      <p className="text-base text-gray-900">
                        {new Date(application.createdAt).toLocaleDateString()} at {new Date(application.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-4">
                      {application.resumeUrl && (
                        <button 
                          onClick={() => openResume(application.resumeUrlFull)}
                          className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <DocumentTextIcon className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" />
                          View Resume
                        </button>
                      )}
                      
                      {application.pdfUrl && (
                        <button 
                          onClick={() => downloadPdf(application.pdfUrlFull)}
                          className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <ArrowDownTrayIcon className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" />
                          Download Summary
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-gray-500">
                Need help with your application? Contact us at{' '}
                <a href="mailto:support@jobportal.com" className="font-medium text-teal-600 hover:text-teal-500">
                  support@jobportal.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackApplicationPage;