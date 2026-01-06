import { useState, useEffect } from 'react';
import { getEmployerApplications } from '../../services/employerService';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    UsersIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EmployerApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                setLoading(true);
                const data = await getEmployerApplications();
                setApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
                toast.error('Failed to load applications');
            } finally {
                setLoading(false);
            }
        };

        fetchApps();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Under Review': return 'bg-blue-100 text-blue-800';
            case 'Interview': return 'bg-purple-100 text-purple-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Accepted': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Applications ({applications.length})</h1>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {applications.length === 0 ? (
                        <div className="text-center py-12">
                            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Wait for candidates to apply to your jobs.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {applications.map((app) => (
                                <li key={app._id}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-medium text-teal-600 truncate">
                                                        {app.applicant?.name || app.applicantName || 'Anonymous'}
                                                    </p>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    <p>Applied for <span className="font-medium text-gray-900">{app.job?.title || app.jobTitle}</span></p>
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {new Date(app.createdAt).toLocaleString()} • {app.source === 'quick' ? 'Quick Apply' : 'Regular Apply'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <Link
                                                    to={`/employer/applications/${app._id}`}
                                                    className="font-medium text-teal-600 hover:text-teal-500 flex items-center"
                                                >
                                                    <EyeIcon className="h-5 w-5 mr-1" />
                                                    Review
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerApplicationsPage;
