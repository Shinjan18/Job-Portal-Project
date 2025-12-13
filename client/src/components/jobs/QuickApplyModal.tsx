import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { jobService } from '../../services/jobService';

interface QuickApplyModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  onClose: () => void;
  onSuccess: (data: { success: boolean; trackToken?: string; message?: string }) => void;
}

export const QuickApplyModal = ({
  jobId,
  jobTitle,
  companyName,
  onClose,
  onSuccess,
}: QuickApplyModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: any) => {
    if (!resumeFile) {
      setError('Please upload your resume');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('message', data.message || '');
    formData.append('resume', resumeFile);

    try {
      setIsSubmitting(true);
      setError('');
      console.log('Submitting application...');
      const result = await jobService.quickApply(jobId, formData);
      console.log('Application submitted successfully:', result);
      
      if (result.success && result.trackToken) {
        const trackUrl = `/track-application/${result.trackToken}?email=${encodeURIComponent(data.email)}`;
        console.log('Setting tracking URL:', trackUrl);
        setTrackingUrl(trackUrl);
      } else {
        console.warn('No trackToken in response:', result);
      }
      
      setIsSubmitted(true);
      onSuccess(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to submit application';
      console.error('Error submitting application:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setValue('resume', file.name); // Update form value
      trigger('resume'); // Trigger validation
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Apply for {jobTitle}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">at {companyName}</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9\-+()\s]+$/,
                  message: 'Invalid phone number',
                },
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resume">
              Resume (PDF, DOC, DOCX) *
            </label>
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              {...register('resume', { required: 'Resume is required' })}
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {resumeFile ? resumeFile.name : 'Choose File'}
              </button>
              {resumeFile && (
                <button
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    setValue('resume', '');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="ml-2 text-sm text-red-600 hover:text-red-800"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
            {errors.resume && (
              <p className="text-red-500 text-xs mt-1">{errors.resume.message as string}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Cover Letter (Optional)
            </label>
            <textarea
              id="message"
              rows={4}
              {...register('message')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting || !resumeFile}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
        
        {isSubmitted && (
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Application submitted successfully!
                </p>
                {trackingUrl && (
                  <div className="mt-2">
                    <a
                      href={trackingUrl}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = trackingUrl;
                      }}
                    >
                      Track My Application
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
