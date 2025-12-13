import { Link } from 'react-router-dom';
import { ClockIcon, MapPinIcon, CurrencyDollarIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job }) => {
  const {
    _id,
    title,
    company,
    location,
    salaryRange,
    jobType,
    skills = [],
    createdAt,
    isFeatured = false,
  } = job;

  // Format the date to show how long ago the job was posted
  const postedAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  // Limit the number of skills shown
  const displayedSkills = skills.slice(0, 3);
  const remainingSkills = skills.length > 3 ? skills.length - 3 : 0;

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${isFeatured ? 'border-teal-500' : 'border-transparent'} hover:shadow-lg transition-shadow duration-200`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                <BriefcaseIcon className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <Link to={`/jobs/${_id}`} className="hover:text-teal-600">
                    {title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500">{company}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                {location || 'Remote'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                {salaryRange || 'Not specified'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <BriefcaseIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                {jobType || 'Full-time'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                {postedAgo}
              </div>
            </div>

            {skills.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {displayedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                    >
                      {skill}
                    </span>
                  ))}
                  {remainingSkills > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{remainingSkills} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="ml-4 flex-shrink-0">
            {isFeatured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to={`/jobs/${_id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
