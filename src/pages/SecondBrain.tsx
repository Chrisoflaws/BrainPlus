import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const SecondBrain = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Logo at top */}
          <div className="flex justify-center mb-12">
            <img 
              src="/images/second-brain-logo.png" 
              alt="Second Brain AI Logo"
              className="logo-glow"
            />
          </div>

          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">Build Your Second Brain</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              A personal AI that learns you. Plans with you. And makes achieving your goals inevitable.
            </p>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 text-white">
              What if you made the best possible decision every time?
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              AI wins at chess by knowing every possibility. When your life is treated the same way—fully mapped, deeply understood—growth becomes inevitable. ♔
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="aspect-video mb-16 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-blue-500/20">
            <div className="text-gray-400 text-lg">Video Coming Soon</div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-transparent border-2 border-blue-500/50 hover:border-blue-500 text-white px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Login
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SecondBrain;