// client/src/pages/jobs/CompaniesPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Icons
import { BuildingOfficeIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner';

// API helper
import { apiClient } from '../../api';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        // For now, we'll get companies from the jobs collection
        // In a real implementation, you'd have a separate companies collection
        const response = await apiClient.get('/jobs');
        const jobsData = response.data.jobs || response.data || [];
        
        // Extract unique companies from jobs
        const uniqueCompanies = {};
        jobsData.forEach(job => {
          if (job.company && !uniqueCompanies[job.company]) {
            uniqueCompanies[job.company] = {
              name: job.company,
              location: job.location || 'Location not specified',
              jobCount: 1,
              logo: job.companyLogo || null
            };
          } else if (job.company) {
            uniqueCompanies[job.company].jobCount += 1;
          }
        });
        
        const companiesArray = Object.values(uniqueCompanies);
        setCompanies(companiesArray);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-teal-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Discover Great Companies</span>
              <span className="block text-teal-200 mt-2">
                Explore {filteredCompanies.length}+ companies hiring now
              </span>
            </h2>
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pr-10 py-4 text-lg border-gray-300 rounded-md"
                  placeholder="Search companies by name or location..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {company.logo ? (
                        <img className="h-16 w-16 rounded-full" src={company.logo} alt={company.name} />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                          <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{company.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <UsersIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'}</span>
                    </div>
                    <Link
                      to={`/jobs?q=${encodeURIComponent(company.name)}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      View Jobs
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No companies found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;