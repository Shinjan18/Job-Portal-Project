// client/src/pages/jobs/JobDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  BookmarkIcon as BookmarkIconOutline,
  ShareIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getJobById, applyForJob } from '../../services/jobService';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [similarJobs, setSimilarJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [companyJobs, setCompanyJobs] = useState([]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const data = await getJobById(id);
        // `data` may be { job: {...} } or the job object itself depending on backend
        const jobData = data.job || data;
        setJob(jobData);

        // Mock similar & company jobs (keep as before)
        setSimilarJobs([
          {
            _id: '1',
            title: 'Frontend Developer',
            company: 'WebSolutions Inc',
            location: 'New York, NY',
            salaryRange: '$110,000 - $140,000',
            jobType: 'Full-time',
            postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isFeatured: true,
          },
          {
            _id: '2',
            title: 'React Native Developer',
            company: 'MobileFirst',
            location: 'Remote',
            salaryRange: '$100,000 - $130,000',
            jobType: 'Full-time',
            postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '3',
            title: 'UI/UX Developer',
            company: 'DesignHub',
            location: 'Austin, TX',
            salaryRange: '$95,000 - $125,000',
            jobType: 'Contract',
            postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]);

        setCompanyJobs([
          {
            _id: '4',
            title: 'Backend Developer',
            company: 'TechCorp',
            location: 'San Francisco, CA',
            salaryRange: '$130,000 - $160,000',
            jobType: 'Full-time',
            postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '5',
            title: 'DevOps Engineer',
            company: 'TechCorp',
            location: 'Remote',
            salaryRange: '$140,000 - $170,000',
            jobType: 'Full-time',
            postedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]);

        // Application status check left as null (requires backend support)
        setApplicationStatus(null);
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to apply for this job');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }

    try {
      setApplying(true);

      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('coverLetter', coverLetter);

      // If your backend expects authenticated apply, include Authorization header
      await applyForJob(id, formData);

      setApplicationStatus('applied');
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = () => {
    setSaved(!saved);
    toast.success(saved ? 'Job removed from saved jobs' : 'Job saved successfully');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  if (loading || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const postedAgo = job.postedAt ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) : '';
  const deadline = job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:space-x-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <BuildingOfficeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {job.company}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {job.jobType}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.experience}
                      </span>
                      {job.isFeatured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveJob}
                      className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      title={saved ? 'Remove from saved jobs' : 'Save job'}
                    >
                      {saved ? (
                        <BookmarkIconSolid className="h-6 w-6 text-teal-600" aria-hidden="true" />
                      ) : (
                        <BookmarkIconOutline className="h-6 w-6" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      title="Share job"
                    >
                      <ShareIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {job.salaryRange}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    Posted {postedAgo}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{job.applicants || 0}</span> applicants • 
                      <span className="font-medium text-gray-900 ml-1">{job.views || 0}</span> views
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'description'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Job Description
                    </button>
                    <button
                      onClick={() => setActiveTab('company')}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'company'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Company
                    </button>
                    <button
                      onClick={() => setActiveTab('application')}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'application'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Application Process
                    </button>
                  </nav>
                </div>

                <div className="mt-6">
                  {activeTab === 'description' && (
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-medium text-gray-900">Job Description</h3>
                      <p className="mt-2 text-gray-700">{job.description}</p>

                      <h4 className="mt-6 text-md font-medium text-gray-900">Requirements</h4>
                      <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                        {(job.requirements || []).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>

                      <h4 className="mt-6 text-md font-medium text-gray-900">Responsibilities</h4>
                      <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                        {(job.responsibilities || []).map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>

                      <h4 className="mt-6 text-md font-medium text-gray-900">Benefits</h4>
                      <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                        {(job.benefits || []).map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>

                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-900">Skills Required</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(job.skills || []).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'company' && (
                    <div className="prose max-w-none">
                      <div className="flex items-center">
                        <img
                          className="h-16 w-16 rounded-full object-cover"
                          src={job.companyLogo}
                          alt={job.company}
                        />
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{job.company}</h3>
                          <p className="text-sm text-gray-500">{job.jobCategory}</p>
                        </div>
                      </div>

                      <h4 className="mt-6 text-md font-medium text-gray-900">About Us</h4>
                      <p className="mt-2 text-gray-700">{job.companyDescription}</p>

                      <h4 className="mt-6 text-md font-medium text-gray-900">Company Culture</h4>
                      <p className="mt-2 text-gray-700">
                        At {job.company}, we value innovation, collaboration, and a strong work-life balance. 
                        Our team is made up of talented individuals who are passionate about technology and making an impact.
                      </p>

                      <h4 className="mt-6 text-md font-medium text-gray-900">Work Environment</h4>
                      <p className="mt-2 text-gray-700">
                        • {job.workLocation} work options available<br />
                        • Flexible working hours<br />
                        • Modern office spaces with great amenities<br />
                        • Team outings and social events
                      </p>
                    </div>
                  )}

                  {activeTab === 'application' && (
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-medium text-gray-900">Application Process</h3>
                      <p className="mt-2 text-gray-700">
                        Here's what you can expect during the application process for the {job.title} position at {job.company}:
                      </p>

                      <ol className="mt-4 space-y-4">
                        {(job.applicationProcess || []).map((step, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-teal-100 text-teal-800 text-sm font-medium">
                              {index + 1}
                            </div>
                            <p className="ml-3 text-gray-700">{step}</p>
                          </li>
                        ))}
                      </ol>

                      <div className="mt-6 p-4 bg-blue-50 rounded-md">
                        <h4 className="text-md font-medium text-blue-800">Application Deadline</h4>
                        <p className="mt-1 text-blue-700">
                          Applications for this position will be accepted until {deadline}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end space-x-3">
                {applicationStatus === 'applied' ? (
                  <div className="flex items-center text-teal-600">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <span className="font-medium">Application Submitted</span>
                  </div>
                ) : applicationStatus === 'rejected' ? (
                  <div className="flex items-center text-red-600">
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    <span className="font-medium">Application Rejected</span>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <label className="group relative flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer">
                        <PaperClipIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500 mr-2" />
                        <span>{resumeFile ? resumeFile.name : 'Upload Resume'}</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                    </div>
                    <button
                      onClick={handleApply}
                      disabled={applying || !resumeFile}
                      className={`inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                        (!resumeFile || applying) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {applying ? 'Applying...' : 'Apply Now'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Similar Jobs</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {similarJobs.map((job) => (
                  <div key={job._id} className="p-4 hover:bg-gray-50">
                    <Link to={`/jobs/${job._id}`} className="block">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-md font-medium text-gray-900">{job.title}</h4>
                          <p className="mt-1 text-sm text-gray-500">{job.company}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {job.jobType}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {job.salaryRange}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0 lg:w-1/3 space-y-6">
            {/* Application Status */}
            {isAuthenticated && applicationStatus && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">Application Status</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  {applicationStatus === 'applied' && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Application Submitted</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>Your application has been successfully submitted for this position.</p>
                          </div>
                          <div className="mt-4">
                            <div className="text-sm text-green-700">
                              <p className="font-medium">Next Steps:</p>
                              <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>Our team will review your application</li>
                                <li>You'll hear back from us within 5-7 business days</li>
                                <li>Check your email for updates</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {applicationStatus === 'rejected' && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Application Not Selected</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>We appreciate your interest, but we've decided to move forward with other candidates.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* About the Employer */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">About the Employer</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={job.companyLogo}
                    alt={job.company}
                  />
                  <div className="ml-4">
                    <h4 className="text-md font-medium text-gray-900">{job.company}</h4>
                    <p className="text-sm text-gray-500">{job.jobCategory}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    {job.companyDescription ? `${job.companyDescription.substring(0, 150)}...` : 'No company description available'}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/companies/${job.companyId}`}
                    className="text-sm font-medium text-teal-600 hover:text-teal-500"
                  >
                    View company profile <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <h4 className="text-sm font-medium text-gray-900">Company Details</h4>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 text-sm">
                  <div className="flex">
                    <dt className="text-gray-500 w-24">Industry</dt>
                    <dd className="text-gray-900">Technology</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-500 w-24">Company Size</dt>
                    <dd className="text-gray-900">201-500 employees</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-500 w-24">Founded</dt>
                    <dd className="text-gray-900">2015</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-500 w-24">Website</dt>
                    <dd className="text-gray-900">
                      <a href="#" className="text-teal-600 hover:text-teal-500">
                        www.techcorp.com
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Other Jobs from this Company */}
            {companyJobs.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">Other Jobs at {job.company}</h3>
                </div>
                <div className="border-t border-gray-200 divide-y divide-gray-200">
                  {companyJobs.map((companyJob) => (
                    <div key={companyJob._id} className="p-4 hover:bg-gray-50">
                      <Link to={`/jobs/${companyJob._id}`} className="block">
                        <h4 className="text-md font-medium text-gray-900">{companyJob.title}</h4>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {companyJob.jobType}
                          </span>
                          <span className="text-sm text-gray-500">{companyJob.location}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {companyJob.salaryRange}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6 text-right">
                  <Link
                    to={`/companies/${job.companyId}/jobs`}
                    className="text-sm font-medium text-teal-600 hover:text-teal-500"
                  >
                    View all jobs at {job.company} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Job Alerts */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Get Job Alerts</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-500">
                  Create a job alert and get notified when similar jobs are posted.
                </p>
                <div className="mt-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
                  >
                    Create Job Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default JobDetailPage;
