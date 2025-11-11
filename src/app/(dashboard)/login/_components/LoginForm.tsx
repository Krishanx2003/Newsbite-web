import React, { useState } from 'react';
import { ArrowRight, LucideGoal as LucideGoogle } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleGoogleLogin = () => {
    // In a real implementation, this would connect to Google OAuth
    console.log('Google login initiated');
  };

  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Welcome Back</h2>

      <button
        className="w-full bg-white text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        onClick={handleGoogleLogin}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <LucideGoogle className="h-5 w-5" />
        <span>Continue with Google</span>
        <ArrowRight className={`h-4 w-4 transition-all duration-300 ${isHovered ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
      </button>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          By signing in, you agree to our <a href="#" className="text-indigo-400 hover:underline">Terms</a> and <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;