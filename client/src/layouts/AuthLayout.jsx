import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
            <Outlet />
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Job Portal. All rights reserved.</p>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default AuthLayout;
