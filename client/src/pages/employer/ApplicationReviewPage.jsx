import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationDetails, updateAppStatus } from '../../services/employerService';
import { toast } from 'react-hot-toast';
import {
    UserIcon,
    BriefcaseIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    DocumentTextIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ApplicationReviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const data = await getApplicationDetails(id);
                setApplication(data);
            } catch (error) {
                console.error('Error fetching application details:', error);
                toast.error('Failed to load application details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        try {
            setStatusLoading(true);
            const updatedApp = await updateAppStatus(id, newStatus);
            setApplication({ ...application, status: updatedApp.status });
            toast.success(`Application status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setStatusLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-xl font-medium text-gray-900">Application not found</h2>
                <button
                    onClick={() => navigate('/employer/applications')}
                    className="mt-4 text-teal-600 hover:text-teal-500"
                >
                    Back to Applications
                </button>
            </div>
        );
    }

    const { applicant, job, status, coverLetter, resumeUrl, pdfUrl, source } = application;
    // Handle different applicant structure (regular vs quick)
    const applicantName = applicant?.name || 'Unknown';
    const applicantEmail = applicant?.email || 'N/A';
    const applicantPhone = applicant?.phone || 'N/A';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/employer/applications')}
                    className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Applications
                </button>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Application Details
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Applied for <span className="font-medium text-gray-900">{job?.title}</span>
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={statusLoading}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Interview">Interview</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                                    Full Name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {applicantName}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                                    Email address
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {applicantEmail}
                                </dd>
                            </div>
                            {applicantPhone !== 'N/A' && (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        Phone number
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {applicantPhone}
                                    </dd>
                                </div>
                            )}
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
                                    Job Position
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {job?.title} at {job?.company}
                                </dd>
                            </div>
                            {coverLetter && (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        Cover Letter
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                                        {coverLetter}
                                    </dd>
                                </div>
                            )}
                            {(resumeUrl || pdfUrl) && (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        Resume/CV
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <a
                                            href={resumeUrl || pdfUrl} // In real app, this should be a proper file URL
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-teal-600 hover:text-teal-500"
                                        >
                                            View Resume
                                        </a>
                                    </dd>
                                </div>
                            )}
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                                    Applied At
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {new Date(application.createdAt || application.appliedAt).toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationReviewPage;
