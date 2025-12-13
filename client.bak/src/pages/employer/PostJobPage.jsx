import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createJob } from '../../services/jobService';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salaryRange: '',
    jobType: '',
    experienceLevel: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    skillsRequired: '',
    benefits: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert skills to array
      const jobData = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim()).filter(skill => skill)
      };
      
      await createJob(jobData);
      toast.success('Job posted successfully!');
      navigate('/employer');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Post a New Job</h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to create a new job listing.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="company"
                    id="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="e.g. San Francisco, CA or Remote"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700">
                  Salary Range
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="salaryRange"
                    id="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="e.g. $80,000 - $120,000"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                  Job Type
                </label>
                <div className="mt-1">
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  >
                    <option value="">Select job type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
                  Experience Level
                </label>
                <div className="mt-1">
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  >
                    <option value="">Select experience level</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead">Lead</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Job Description *
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="Provide a detailed description of the role, responsibilities, and what makes this position exciting..."
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">
                  Key Responsibilities
                </label>
                <div className="mt-1">
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    rows={3}
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="List the main responsibilities for this role, one per line..."
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
                  Qualifications
                </label>
                <div className="mt-1">
                  <textarea
                    id="qualifications"
                    name="qualifications"
                    rows={3}
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="List the required qualifications, education, or certifications..."
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700">
                  Skills Required
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="skillsRequired"
                    id="skillsRequired"
                    value={formData.skillsRequired}
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
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
                  Benefits
                </label>
                <div className="mt-1">
                  <textarea
                    id="benefits"
                    name="benefits"
                    rows={3}
                    value={formData.benefits}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="List the benefits offered with this position..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/employer')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;