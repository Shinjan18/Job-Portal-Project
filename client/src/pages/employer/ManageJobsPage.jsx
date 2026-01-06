import { useState, useEffect } from 'react';
import { getMyJobs, deleteJob } from '../../services/jobService';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    MapPinIcon,
    CalendarIcon,
    PencilIcon,
    TrashIcon,
    BriefcaseIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getMyJobs();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await deleteJob(jobId);
                toast.success('Job deleted successfully');
                fetchJobs();
            } catch (error) {
                console.error('Error deleting job:', error);
                toast.error(error.message || 'Failed to delete job');
            }
        }
    };

    const handleEditJob = (job) => {
        navigate('/employer/post-job', { state: { job, isEdit: true } });
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
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Manage Jobs
                        </h2>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <Link
                            to="/employer/post-job"
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Post New Job
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {jobs.length === 0 ? (
                        <div className="text-center py-12">
                            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs posted</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new job listing.</p>
                            <div className="mt-6">
                                <Link
                                    to="/employer/post-job"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                >
                                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                    Post a Job
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <li key={job._id}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center">
                                                    <p className="text-sm font-bold text-teal-600 truncate">{job.title}</p>
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex">
                                                    <div className="flex items-center text-sm text-gray-500 mr-6">
                                                        <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                        {job.location}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => handleEditJob(job)}
                                                    className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm font-medium"
                                                >
                                                    <PencilIcon className="h-4 w-4 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteJob(job._id)}
                                                    className="text-red-600 hover:text-red-900 flex items-center text-sm font-medium"
                                                >
                                                    <TrashIcon className="h-4 w-4 mr-1" />
                                                    Delete
                                                </button>
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

export default ManageJobsPage;
