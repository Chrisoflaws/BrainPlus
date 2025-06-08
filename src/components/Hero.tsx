import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const splineRef = useRef<HTMLElement | null>(null);
  const splineLoaded = useRef(false);
  const handleMouseMove = useRef((e: MouseEvent) => {
    console.log('Mouse move event triggered');
    if (splineRef.current) {
      const rect = splineRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      splineRef.current.dispatchEvent(
        new CustomEvent('mousePosition', {
          detail: { x, y },
          bubbles: true,
        })
      );
    }
  });

  const handleMouseEnter = useRef(() => {
    console.log('Mouse enter event triggered');
    if (splineRef.current) {
      splineRef.current.dispatchEvent(
        new CustomEvent('mouseEnter', {
          bubbles: true,
        })
      );
    }
  });

  const handleMouseLeave = useRef(() => {
    console.log('Mouse leave event triggered');
    if (splineRef.current) {
      splineRef.current.dispatchEvent(
        new CustomEvent('mouseLeave', {
          bubbles: true,
        })
      );
    }
  });

  useEffect(() => {
    console.log('Hero component mounted');
    if (splineLoaded.current) {
      console.log('Spline already loaded, skipping initialization');
      return;
    }

    const loadSplineViewer = async () => {
      try {
        console.log('Loading Spline viewer script...');
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
        script.async = true;
        
        script.onload = () => {
          console.log('Spline viewer script loaded');
          splineLoaded.current = true;
          const checkSplineViewer = setInterval(() => {
            const viewer = document.querySelector('spline-viewer') as HTMLElement;
            if (viewer) {
              console.log('Spline viewer element found');
              splineRef.current = viewer;
              clearInterval(checkSplineViewer);
              setupSplineEvents();
            }
          }, 100);

          // Clear interval after 10 seconds to prevent infinite checking
          setTimeout(() => {
            clearInterval(checkSplineViewer);
            if (!splineRef.current) {
              console.warn('Failed to find Spline viewer element after 10 seconds');
            }
          }, 10000);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Spline viewer:', error);
      }
    };

    loadSplineViewer();

    return () => {
      console.log('Cleaning up Hero component');
      cleanupSplineEvents();
    };
  }, []);

  const setupSplineEvents = () => {
    console.log('Setting up Spline events');
    if (!splineRef.current) {
      console.warn('Cannot setup events: Spline viewer not found');
      return;
    }
    
    document.addEventListener('mousemove', handleMouseMove.current);
    document.addEventListener('mouseenter', handleMouseEnter.current);
    document.addEventListener('mouseleave', handleMouseLeave.current);
    console.log('Spline events setup complete');
  };

  const cleanupSplineEvents = () => {
    console.log('Cleaning up Spline events');
    document.removeEventListener('mousemove', handleMouseMove.current);
    document.removeEventListener('mouseenter', handleMouseEnter.current);
    document.removeEventListener('mouseleave', handleMouseLeave.current);
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Colorful background elements */}
      <div className="hero-background absolute inset-0"></div>
      <div className="grid-background"></div>
      <div className="color-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Spline Animation Container */}
      <div className="absolute inset-0 z-[3]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-cyan-500/30 animate-gradient"></div>
        
        {/* Additional color layers */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-pink-500/20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/20 blur-[100px] animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-purple-500/20 blur-[100px] animate-pulse delay-1000"></div>
        </div>
        
        {/* Spline Animation */}
        <div className="spline-container relative z-10 scale-120">
          <spline-viewer 
            url="https://prod.spline.design/S3hndN-MI8C7VpUW/scene.splinecode"
            events-target="global"
            style={{ transform: 'scale(1.2)', transformOrigin: 'center center' }}
          ></spline-viewer>
        </div>
        
        {/* Gradient overlays for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-[4] h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
            The Future of <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Automation</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
            AI-powered solutions that streamline your business
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={scrollToContact}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group backdrop-blur-sm"
            >
              Free Business Analysis
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;