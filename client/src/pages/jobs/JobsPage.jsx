// client/src/pages/jobs/JobsPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';
import { useAuth } from '../../context/AuthContext';

// Icons
import {
  BriefcaseIcon,
  MapPinIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

// Components
import JobCard from '../../components/jobs/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';

// API helper
import { searchJobs, getMyApplications } from '../../services/jobService';

// Constants
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Remote'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'];
const SALARY_RANGES = [
  { label: '$0 - $50,000', value: '0-50000' },
  { label: '$50,000 - $100,000', value: '50000-100000' },
  { label: '$100,000 - $150,000', value: '100000-150000' },
  { label: '$150,000+', value: '150000-' },
];

const JobsPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [appliedIds, setAppliedIds] = useState([]);

  // Fetch user's applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (user) {
        try {
          const apps = await getMyApplications();
          const ids = apps.map(app => app.job?._id || app.job);
          setAppliedIds(ids);
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      }
    };

    fetchApplications();
  }, [user]);

  // Get query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchQuery = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const jobType = searchParams.get('type') || '';
  const experience = searchParams.get('experience') || '';
  const salaryRange = searchParams.get('salary') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  // State for form inputs
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [locationInput, setLocationInput] = useState(location);
  const [selectedJobTypes, setSelectedJobTypes] = useState(jobType ? jobType.split(',') : []);
  const [selectedExperience, setSelectedExperience] = useState(experience ? experience.split(',') : []);
  const [selectedSalary, setSelectedSalary] = useState(salaryRange || '');
  const [selectedSort, setSelectedSort] = useState(sortBy);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (page > 1) params.set('page', page);
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    if (selectedJobTypes.length > 0) params.set('type', selectedJobTypes.join(','));
    if (selectedExperience.length > 0) params.set('experience', selectedExperience.join(','));
    if (selectedSalary) params.set('salary', selectedSalary);
    if (selectedSort !== 'newest') params.set('sort', selectedSort);
    
    // Update URL without page reload
    setSearchParams(params, { replace: true });
  }, [page, searchQuery, location, selectedJobTypes, selectedExperience, selectedSalary, selectedSort, setSearchParams]);

  // Fetch jobs when URL params change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        // Build query params object from URL
        const queryParams = {
          page,
          limit,
          q: searchQuery,
          location,
          type: selectedJobTypes.join(','),
          experience: selectedExperience.join(','),
          salary: selectedSalary,
          sort: selectedSort,
        };

        // Build query string
        const qs = new URLSearchParams(
          Object.entries(queryParams).reduce((acc, [k, v]) => {
            if (v !== undefined && v !== null && v !== '') acc[k] = v;
            return acc;
          }, {})
        ).toString();

        const data = await searchJobs({
          page,
          limit,
          q: searchQuery,
          location,
          jobType,
          experience,
          salary: salaryRange,
          sort: sortBy,
        });

        const jobsData = Array.isArray(data) ? data : data.jobs || data.data || [];
        setJobs(jobsData);
        setTotalJobs(data.total || jobsData.length || 0);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchQuery, location, jobType, experience, salaryRange, sortBy]);

  // Debounced search function
  const debouncedSearch = debounce((value) => {
    updateSearchParams({ q: value, page: 1 });
  }, 500);

  // Handle search input change with debounce
  const handleSearch = debounce((value) => {
    setSearchInput(value);
    // The URL will be updated by the effect above
  }, 500);

  // Handle location input change
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    updateSearchParams({ location: value, page: 1 });
  };

  // Handle filter changes
  const handleJobTypeChange = (type) => {
    setSelectedJobTypes(prev => {
      const newTypes = prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type];
      return newTypes;
    });
  };

  const handleExperienceChange = (level) => {
    setSelectedExperience(prev => {
      const newLevels = prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level];
      return newLevels;
    });
  };

  const handleSalaryChange = (range) => {
    setSelectedSalary(prev => prev === range ? '' : range);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
  };

  // Clear all filters and reset to defaults
  const clearAllFilters = () => {
    // Reset all filter states
    setSearchInput('');
    setLocationInput('');
    setSelectedJobTypes([]);
    setSelectedExperience([]);
    setSelectedSalary('');
    setSelectedSort('newest');
    
    // Reset URL parameters to default and trigger refetch
    setSearchParams({ 
      page: '1', 
      limit: '10',
      q: '',
      location: '',
      type: '',
      experience: '',
      salary: '',
      sort: 'newest'
    });
    
    // Force a refetch with default parameters
    fetchJobs({ 
      page: 1, 
      limit: 10,
      q: '',
      location: '',
      type: '',
      experience: '',
      salary: '',
      sort: 'newest'
    });
  };

  // Update URL search params
  const updateSearchParams = (updates) => {
    const params = new URLSearchParams(searchParams);

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalJobs / limit);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-teal-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div className="w-full">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Find your dream job</span>
              <span className="block text-teal-200">Browse {totalJobs}+ opportunities</span>
            </h2>

            {/* Search Bar */}
            <div className="mt-8 max-w-3xl">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <SearchBar
                    value={searchInput}
                    onChange={handleSearch}
                    placeholder="Job title, keywords, or company"
                    icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                <div className="w-full sm:w-64">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={locationInput}
                      onChange={handleLocationChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      placeholder="Location"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-teal-700 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <FunnelIcon className="h-5 w-5 mr-2 text-teal-500" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Mobile */}
          {showFilters && (
            <div className="lg:hidden bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Job Type</h4>
                  <div className="space-y-2">
                    {JOB_TYPES.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          id={`mobile-job-type-${type}`}
                          type="checkbox"
                          checked={selectedJobTypes.includes(type)}
                          onChange={() => toggleJobType(type)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`mobile-job-type-${type}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h4>
                  <div className="space-y-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <div key={level} className="flex items-center">
                        <input
                          id={`mobile-exp-${level}`}
                          type="checkbox"
                          checked={selectedExperience.includes(level)}
                          onChange={() => toggleExperience(level)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`mobile-exp-${level}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Salary Range</h4>
                  <div className="space-y-2">
                    {SALARY_RANGES.map((range) => (
                      <div key={range.value} className="flex items-center">
                        <input
                          id={`mobile-salary-${range.value}`}
                          type="radio"
                          name="salary-range"
                          checked={selectedSalary === range.value}
                          onChange={() => handleSalaryChange(range.value)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                        />
                        <label
                          htmlFor={`mobile-salary-${range.value}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearAllFilters}
                  className="w-full text-center text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                {(selectedJobTypes.length > 0 || selectedExperience.length > 0 || selectedSalary) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Job Type</h4>
                  <div className="space-y-2">
                    {JOB_TYPES.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          id={`desktop-job-type-${type}`}
                          type="checkbox"
                          checked={selectedJobTypes.includes(type)}
                          onChange={() => toggleJobType(type)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`desktop-job-type-${type}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h4>
                  <div className="space-y-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <div key={level} className="flex items-center">
                        <input
                          id={`desktop-exp-${level}`}
                          type="checkbox"
                          checked={selectedExperience.includes(level)}
                          onChange={() => toggleExperience(level)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`desktop-exp-${level}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Salary Range</h4>
                  <div className="space-y-2">
                    {SALARY_RANGES.map((range) => (
                      <div key={range.value} className="flex items-center">
                        <input
                          id={`desktop-salary-${range.value}`}
                          type="radio"
                          name="salary-range"
                          checked={selectedSalary === range.value}
                          onChange={() => handleSalaryChange(range.value)}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                        />
                        <label
                          htmlFor={`desktop-salary-${range.value}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {totalJobs} {totalJobs === 1 ? 'Job' : 'Jobs'} Found
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {searchQuery && `Results for "${searchQuery}"`}
                    {location && ` in ${location}`}
                  </p>
                </div>
                <div className="flex items-center">
                  <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={selectedSort}
                    onChange={handleSortChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="salary_high">Salary: High to Low</option>
                    <option value="salary_low">Salary: Low to High</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    appliedIds={appliedIds}
                    onApplied={(jobId) => {
                      setAppliedIds(prev => [...prev, jobId]);
                    }}
                  />
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <AdjustmentsHorizontalIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <div className="mt-6">
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
