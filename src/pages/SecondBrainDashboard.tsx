import React from 'react';
import { CheckSquare, TrendingUp, Brain, Star, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SecondBrainDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-full bg-black text-white relative">
      {/* Logout Button - Top Right Corner */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-1.5 bg-gray-800/50 hover:bg-gray-700/60 backdrop-blur-sm border border-gray-600/30 hover:border-gray-500/50 text-gray-400 hover:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          title="Logout"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header - Centered */}
        <div className="text-center mb-8 sm:mb-12 pt-8 sm:pt-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Welcome to Your Second Brain
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            Your AI companion for optimal decision making
          </p>
        </div>

        {/* Dashboard Cards - Mobile Optimized Grid */}
        <div className="grid gap-4 sm:gap-6 max-w-3xl mx-auto">
          <button 
            onClick={() => navigate('/app/daily-checklist')}
            className="group bg-gradient-to-r from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors flex-shrink-0">
                <CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl font-semibold text-blue-400 mb-1 sm:mb-2">
                  Daily Checklist
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Review and complete your personalized tasks for today
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/app/progress-goals')}
            className="group bg-gradient-to-r from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors flex-shrink-0">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl font-semibold text-purple-400 mb-1 sm:mb-2">
                  Progress
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Track your growth and achievements over time
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/app/resources')}
            className="group bg-gradient-to-r from-yellow-500/10 to-orange-500/5 hover:from-yellow-500/20 hover:to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 hover:border-orange-500/40 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 bg-yellow-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors flex-shrink-0">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 group-hover:text-orange-400 group-hover:rotate-12 transition-all" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl font-semibold text-yellow-400 group-hover:text-orange-400 mb-1 sm:mb-2 transition-colors">
                  Visualization Resources
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Access powerful visualization techniques and training materials
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/app/connect')}
            className="group bg-gradient-to-r from-pink-500/10 to-pink-500/5 hover:from-pink-500/20 hover:to-pink-500/10 backdrop-blur-sm border border-pink-500/20 hover:border-pink-500/40 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="p-3 sm:p-4 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition-colors flex-shrink-0">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl font-semibold text-pink-400 mb-1 sm:mb-2">
                  Connect to Second Brain
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Start a new session with your AI companion
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondBrainDashboard;