import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchJobs } from '../services/jobService';
import { toast } from 'react-hot-toast';

// Hero Icons
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Components
import JobCard from '../components/jobs/JobCard';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const { isAuthenticated, isEmployer } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        const data = await searchJobs({ limit: 6, featured: true });
        setFeaturedJobs(data.jobs || []);
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
        toast.error('Failed to load featured jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would navigate to the jobs page with search parameters
    toast.success(`Searching for: ${searchQuery} in ${location || 'all locations'}`);
  };

  const features = [
    {
      name: 'Find Your Dream Job',
      description: 'Access thousands of job listings from top companies around the world.',
      icon: BriefcaseIcon,
    },
    {
      name: 'Easy Application',
      description: 'Apply to multiple jobs with just a few clicks using your profile.',
      icon: CheckCircleIcon,
    },
    {
      name: 'Company Insights',
      description: 'Get valuable insights into company culture and work environment.',
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Career Growth',
      description: 'Discover opportunities that match your skills and career goals.',
      icon: ChartBarIcon,
    },
  ];

  const stats = [
    { name: 'Jobs Available', value: '10,000+', icon: BriefcaseIcon },
    { name: 'Companies Hiring', value: '2,500+', icon: BuildingOfficeIcon },
    { name: 'Active Users', value: '500,000+', icon: UserGroupIcon },
    { name: 'Success Stories', value: '50,000+', icon: CheckCircleIcon },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-teal-700 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-teal-700 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Find your next</span>
                  <span className="block text-teal-200">career opportunity</span>
                </h1>
                <p className="mt-3 text-base text-teal-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Connect with top employers and find the perfect job that matches your skills and experience.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  {!isAuthenticated ? (
                    <div className="sm:flex">
                      <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                        <Link
                          to="/register"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-white hover:bg-teal-50 md:py-4 md:text-lg md:px-10"
                        >
                          Get Started
                        </Link>
                      </div>
                      <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                        <Link
                          to="/jobs"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-500 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                        >
                          Browse Jobs
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="sm:flex">
                      <div className="mt-3 rounded-md shadow sm:mt-0">
                        <Link
                          to={isEmployer ? "/employer/post-job" : "/jobs"}
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-white hover:bg-teal-50 md:py-4 md:text-lg md:px-10"
                        >
                          {isEmployer ? 'Post a Job' : 'Find Jobs'}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt="People working on laptops"
          />
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title, keywords, or company"
                    icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                <div className="w-full sm:w-64">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      placeholder="Location"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Search
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-4 text-sm">
                <span className="text-gray-500">Popular Searches:</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('Software Engineer')}
                  className="text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Software Engineer
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('Product Manager')}
                  className="text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Product Manager
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('Data Scientist')}
                  className="text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Data Scientist
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Jobs
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Discover the most exciting job opportunities from top companies
            </p>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-2 lg:max-w-none xl:grid-cols-3">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              View all jobs
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to find your next job
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform is designed to make your job search faster, easier, and more effective.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-teal-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by job seekers and employers worldwide
            </h2>
            <p className="mt-3 text-xl text-teal-100">
              Join thousands of professionals who found their dream job through our platform.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col">
                <dt className="flex items-center justify-center order-2 text-lg font-medium text-teal-100">
                  {stat.name}
                </dt>
                <dd className="order-1 text-5xl font-extrabold text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-teal-600">Start your job search today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to={isAuthenticated ? (isEmployer ? "/employer/post-job" : "/jobs") : "/register"}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
              >
                {isAuthenticated ? (isEmployer ? 'Post a Job' : 'Browse Jobs') : 'Get Started'}
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
