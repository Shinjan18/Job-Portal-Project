import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-100">
              <ExclamationTriangleIcon className="h-6 w-6 text-teal-600" aria-hidden="true" />
            </div>
            <div className="mt-6 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                404
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Page not found
              </p>
              <p className="mt-2 text-base text-gray-500">
                Sorry, we couldn't find the page you're looking for.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
              >
                Go back home
              </Link>
            </div>
            <div className="mt-3 inline-flex rounded-md shadow">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-gray-50"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;