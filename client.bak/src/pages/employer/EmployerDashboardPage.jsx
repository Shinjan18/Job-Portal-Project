import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getJobApplications } from '../../services/jobService';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EmployerDashboardPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pending: 0,
    reviewed: 0,
    interviews: 0,
    rejected: 0,
    accepted: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch:
        // 1. Employer's jobs
        // 2. Applications to those jobs
        // 3. Statistics
        
        // For now, we'll mock the data
        const mockApplications = [
          {
            _id: '1',
            job: {
              _id: 'job1',
              title: 'Senior React Developer',
              company: 'TechCorp'
            },
            applicant: {
              _id: 'user1',
              name: 'John Doe',
              email: 'john@example.com'
            },
            status: 'Pending',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            _id: '2',
            job: {
              _id: 'job2',
              title: 'Frontend Engineer',
              company: 'TechCorp'
            },
            applicant: {
              _id: 'user2',
              name: 'Jane Smith',
              email: 'jane@example.com'
            },
            status: 'Under Review',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          },
          {
            _id: '3',
            job: {
              _id: 'job1',
              title: 'Senior React Developer',
              company: 'TechCorp'
            },
            applicant: {
              _id: 'user3',
              name: 'Bob Johnson',
              email: 'bob@example.com'
            },
            status: 'Interview',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        ];
        
        setApplications(mockApplications);
        
        // Calculate mock stats
        const newStats = {
          totalJobs: 5,
          totalApplications: mockApplications.length,
          pending: mockApplications.filter(app => app.status === 'Pending').length,
          reviewed: mockApplications.filter(app => app.status === 'Under Review').length,
          interviews: mockApplications.filter(app => app.status === 'Interview').length,
          rejected: 2,
          accepted: 1
        };
        setStats(newStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Interview':
        return 'bg-purple-100 text-purple-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-teal-500 rounded-md p-3">
                  <BriefcaseIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.pending}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Interviews</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.interviews}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
              <Link 
                to="/employer/applications" 
                className="text-sm font-medium text-teal-600 hover:text-teal-500"
              >
                View all applications
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {applications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Candidates will appear here once they apply to your jobs.
                </p>
                <div className="mt-6">
                  <Link
                    to="/employer/post-job"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Post a Job
                  </Link>
                </div>
              </div>
            ) : (
              applications.map((application) => (
                <div key={application._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-teal-600 truncate">
                          {application.applicant?.name || 'Applicant Name'}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                        <span>{application.job?.title || 'Job Title'}</span>
                        <span className="hidden sm:inline mx-2">•</span>
                        <span className="sm:hidden">Applied on </span>
                        <span>
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button className="text-teal-600 hover:text-teal-900">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <Link
                        to={`/employer/applications/${application._id}`}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
            <Link
              to="/employer/post-job"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
            >
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Post a Job</p>
                <p className="text-sm text-gray-500 truncate">Create a new job listing</p>
              </div>
            </Link>

            <Link
              to="/employer/jobs"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
            >
              <div className="flex-shrink-0">
                <EyeIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Manage Jobs</p>
                <p className="text-sm text-gray-500 truncate">View and edit your listings</p>
              </div>
            </Link>

            <Link
              to="/employer/applications"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
            >
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">View Applications</p>
                <p className="text-sm text-gray-500 truncate">Review candidate applications</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardPage;