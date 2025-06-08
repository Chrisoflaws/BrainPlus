import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const AccountCreated = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Account Created!</h1>
        <p className="text-gray-300 mb-8">
          Your account has been successfully created. You can now access your dashboard.
        </p>
        <button
          onClick={() => navigate('/app/dashboard')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AccountCreated;