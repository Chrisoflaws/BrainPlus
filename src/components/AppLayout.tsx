import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CheckSquare, TrendingUp, Brain, Star } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="sticky bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800 z-50">
        <div className="max-w-lg mx-auto px-4 h-20">
          <div className="flex items-center justify-around h-full">
            <button
              onClick={() => navigate('/app/dashboard')}
              className={`flex flex-col items-center gap-1 ${
                location.pathname === '/app/dashboard' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => navigate('/app/daily-checklist')}
              className={`flex flex-col items-center gap-1 ${
                location.pathname === '/app/daily-checklist' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <CheckSquare className="w-6 h-6" />
              <span className="text-xs">Tasks</span>
            </button>

            <button
              onClick={() => navigate('/app/progress-goals')}
              className={`flex flex-col items-center gap-1 ${
                location.pathname === '/app/progress-goals' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Progress</span>
            </button>

            <button
              onClick={() => navigate('/app/resources')}
              className={`flex flex-col items-center gap-1 ${
                location.pathname === '/app/resources' 
                  ? 'text-yellow-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Star className="w-6 h-6" />
              <span className="text-xs">Resources</span>
            </button>

            <button
              onClick={() => navigate('/app/connect')}
              className={`flex flex-col items-center gap-1 ${
                location.pathname === '/app/connect' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Brain className="w-6 h-6" />
              <span className="text-xs">AI Chat</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;