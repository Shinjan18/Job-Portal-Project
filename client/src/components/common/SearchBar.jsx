import React from 'react';

const SearchBar = ({ value, onChange, placeholder, icon, className = '', ...props }) => {
  return (
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${className}`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default SearchBar;
