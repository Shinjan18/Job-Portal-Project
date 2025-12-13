import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications } from '../../services/jobService';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Function to open resume in new tab
  const openResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  // Function to download PDF
  const downloadPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const apps = await getMyApplications();
        setApplications(apps);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status.toLowerCase() === filter.toLowerCase());

  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Submitted', label: 'Submitted' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">Track the status of your job applications</p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  filter === option.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="divide-y divide-gray-200">
            {filteredApplications.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'all' 
                    ? 'Get started by applying to jobs that match your skills.' 
                    : `You don't have any applications with status "${filter}".`}
                </p>
                <div className="mt-6">
                  <Link
                    to="/jobs"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Browse Jobs
                  </Link>
                </div>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div key={application._id} className="px-4 py-6 sm:px-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900 truncate">
                          {application.job?.title || 'Job Title'}
                        </p>
                        <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                        <span className="font-medium">{application.job?.company || 'Company Name'}</span>
                        <span className="hidden sm:inline mx-2">•</span>
                        <span>Applied on {new Date(application.createdAt).toLocaleDateString()}</span>
                      </div>
                      {application.job?.location && (
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {application.job.location}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                      <Link
                        to={`/jobs/${application.job?._id || '#'}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Job
                      </Link>
                    </div>
                  </div>
                  
                  {/* Status Timeline */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      {application.resumeUrl && (
                        <button 
                          onClick={() => openResume(application.resumeUrl)}
                          className="flex items-center text-sm text-teal-600 hover:text-teal-800"
                        >
                          <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          <span>View Resume</span>
                        </button>
                      )}
                      
                      {application.pdfUrl && (
                        <button 
                          onClick={() => downloadPdf(application.pdfUrl)}
                          className="flex items-center text-sm text-teal-600 hover:text-teal-800"
                        >
                          <ArrowDownTrayIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          <span>Download Summary</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;