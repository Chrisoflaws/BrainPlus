import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/home') {
      navigate('/home', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const state = location.state as { scrollTo?: string };
    if (state?.scrollTo) {
      const element = document.getElementById(state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, navigate]);

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className="fixed w-full bg-black/90 backdrop-blur-sm z-50 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('/home')}>
              <span className="text-2xl font-bold text-white">
                Second<span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Brain</span>
              </span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <NavLink onClick={() => handleNavigation('/second-brain')}>Second Brain AI</NavLink>
                <NavLink onClick={() => scrollToSection('solutions')}>Solutions</NavLink>
                <NavLink onClick={() => scrollToSection('why-choose-us')}>Why Us</NavLink>
                <NavLink onClick={() => handleNavigation('/resources')}>Resources</NavLink>
                <NavLink onClick={() => handleNavigation('/build-my-own-ai')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg">
                  Build My AI
                </NavLink>
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-black border-t border-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink onClick={() => handleNavigation('/second-brain')}>Second Brain AI</MobileNavLink>
              <MobileNavLink onClick={() => scrollToSection('solutions')}>Solutions</MobileNavLink>
              <MobileNavLink onClick={() => scrollToSection('why-choose-us')}>Why Us</MobileNavLink>
              <MobileNavLink onClick={() => handleNavigation('/resources')}>Resources</MobileNavLink>
              <MobileNavLink onClick={() => handleNavigation('/build-my-own-ai')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Build My AI
              </MobileNavLink>
            </div>
          </div>
        )}
      </nav>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
        aria-label="Back to top"
      >
        <ChevronUp size={24} />
      </button>
    </>
  );
};

interface NavLinkProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ onClick, children, className = '' }: NavLinkProps) => (
  <button
    onClick={onClick}
    className={`text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

const MobileNavLink = ({ onClick, children, className = '' }: NavLinkProps) => (
  <button
    onClick={onClick}
    className={`text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left ${className}`}
  >
    {children}
  </button>
);

export default NavBar;