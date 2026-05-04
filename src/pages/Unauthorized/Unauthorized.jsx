import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-2xl shadow-xl">
        <div className="flex justify-center">
          <div className="p-4 bg-red-100 rounded-full">
            <i className="fa-solid fa-shield-halved text-6xl text-red-600"></i>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-slate-800">Access Denied</h1>
        
        <p className="text-slate-600 text-lg">
          Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="pt-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-primary-200"
          >
            Go Back
          </button>
        </div>
        
        <div className="text-sm text-slate-400">
          Error Code: 403 Unauthorized
        </div>
      </div>
    </div>
  );
}
