import React, { useEffect, useRef } from 'react';

const ConnectToSecondBrain = () => {
  const splineRef = useRef<HTMLElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
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

  // Auto-scroll functionality
  const setupAutoScroll = () => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) {
      console.log('Chat container not found for auto-scroll setup');
      return;
    }

    console.log('Setting up auto-scroll for chat widget');

    // Function to check if user is at the bottom of the chat
    const isUserAtBottom = () => {
      const threshold = 100; // pixels from bottom
      const scrollTop = chatContainer.scrollTop;
      const scrollHeight = chatContainer.scrollHeight;
      const clientHeight = chatContainer.clientHeight;
      
      return scrollHeight - scrollTop - clientHeight <= threshold;
    };

    // Function to scroll to bottom
    const scrollToBottom = () => {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
    };

    // Create mutation observer to watch for new content
    mutationObserverRef.current = new MutationObserver((mutations) => {
      let shouldScroll = false;
      
      // Check if user was at bottom before new content was added
      const wasAtBottom = isUserAtBottom();
      
      // Check if there were actual content changes (not just attribute changes)
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if added nodes contain actual content (not just empty elements)
          const hasContent = Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              return node.textContent?.trim().length > 0;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              return element.textContent?.trim().length > 0 || 
                     element.querySelector('img, video, audio, canvas');
            }
            return false;
          });
          
          if (hasContent) {
            shouldScroll = true;
          }
        }
      });

      // Only auto-scroll if user was at bottom and there's new content
      if (shouldScroll && wasAtBottom) {
        console.log('Auto-scrolling to new content');
        // Small delay to ensure content is fully rendered
        setTimeout(scrollToBottom, 100);
      }
    });

    // Start observing the chat container and all its descendants
    mutationObserverRef.current.observe(chatContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });

    console.log('Auto-scroll mutation observer started');
  };

  useEffect(() => {
    console.log('ConnectToSecondBrain component mounted');
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
      console.log('Cleaning up ConnectToSecondBrain component');
      cleanupSplineEvents();
      cleanupAutoScroll();
    };
  }, []);

  // Set up auto-scroll when Voiceflow widget is ready
  useEffect(() => {
    const checkVoiceflowWidget = setInterval(() => {
      const chatContainer = document.getElementById('vf-chat');
      if (chatContainer && chatContainer.children.length > 0) {
        console.log('Voiceflow widget detected, setting up auto-scroll');
        chatContainerRef.current = chatContainer;
        setupAutoScroll();
        clearInterval(checkVoiceflowWidget);
      }
    }, 500);

    // Clear interval after 30 seconds to prevent infinite checking
    setTimeout(() => {
      clearInterval(checkVoiceflowWidget);
    }, 30000);

    return () => {
      clearInterval(checkVoiceflowWidget);
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

  const cleanupAutoScroll = () => {
    console.log('Cleaning up auto-scroll');
    if (mutationObserverRef.current) {
      mutationObserverRef.current.disconnect();
      mutationObserverRef.current = null;
    }
  };

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://cdn.voiceflow.com/widget-next/bundle.mjs"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
      
      script.onload = () => {
        // Clean up any existing widget instances
        const chatContainer = document.getElementById('vf-chat');
        if (chatContainer && chatContainer.shadowRoot) {
          chatContainer.attachShadow({ mode: 'open' }); // This will throw if shadow root exists
        }

        // Initialize the widget only if it hasn't been initialized
        if (window.voiceflow?.chat && !window.voiceflowInitialized) {
          window.voiceflow.chat.load({
            verify: { projectID: '682e6d5988eaa129bffb1b01' },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production',
            voice: {
              url: 'https://runtime-api.voiceflow.com'
            },
            render: {
              mode: 'embedded',
              target: chatContainer
            }
          });
          window.voiceflowInitialized = true;
        }
      };

      document.body.appendChild(script);
    }

    return () => {
      // Cleanup function
      const chatContainer = document.getElementById('vf-chat');
      if (chatContainer && chatContainer.shadowRoot) {
        try {
          // Remove the shadow root if possible
          const shadowRoot = chatContainer.shadowRoot;
          while (shadowRoot.firstChild) {
            shadowRoot.removeChild(shadowRoot.firstChild);
          }
        } catch (error) {
          console.warn('Error cleaning up shadow root:', error);
        }
      }

      // Remove any Voiceflow-related elements
      const vfElements = document.querySelectorAll('[id^="vfassistant"]');
      vfElements.forEach(el => el.remove());

      // Reset initialization flag
      window.voiceflowInitialized = false;

      // Remove the script only if component is unmounting
      const script = document.querySelector('script[src="https://cdn.voiceflow.com/widget-next/bundle.mjs"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-500/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/20 blur-[100px] animate-pulse delay-700"></div>
      </div>

      {/* Chat container - takes up all available space */}
      <div 
        id="vf-chat" 
        className="flex-1 w-full relative z-10 min-h-0"
        style={{
          height: 'auto',
          minHeight: '400px'
        }}
      />

      <style>{`
        #vf-chat {
          overflow: auto !important;
        }
        #vf-chat > div {
          overflow: auto !important;
        }
        
        /* Hide Synapse Automations microphone button */
        #vf-chat [data-testid="voice-button"],
        #vf-chat button[aria-label*="microphone"],
        #vf-chat button[aria-label*="voice"],
        #vf-chat button[title*="microphone"],
        #vf-chat button[title*="voice"],
        #vf-chat .vf-voice-button,
        #vf-chat .voice-button,
        #vf-chat button[class*="voice"],
        #vf-chat button[class*="mic"],
        #vf-chat svg[class*="microphone"],
        #vf-chat svg[class*="mic"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        
        /* Hide any buttons with microphone icons */
        #vf-chat button:has(svg[viewBox*="12 2"]),
        #vf-chat button:has(svg[d*="m12 2"]) {
          display: none !important;
        }
        
        /* Additional selectors for Voiceflow widget microphone button */
        #vf-chat [class*="VoiceButton"],
        #vf-chat [class*="voiceButton"],
        #vf-chat [class*="MicButton"],
        #vf-chat [class*="micButton"] {
          display: none !important;
        }
        
        /* Hide any element that contains microphone-related text */
        #vf-chat *[aria-label*="Start recording"],
        #vf-chat *[aria-label*="Stop recording"],
        #vf-chat *[title*="Start recording"],
        #vf-chat *[title*="Stop recording"] {
          display: none !important;
        }
        
        /* Target shadow DOM elements if possible */
        #vf-chat::part(voice-button),
        #vf-chat::part(microphone-button) {
          display: none !important;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Add type declaration for window object
declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: any) => void;
      };
    };
    voiceflowInitialized?: boolean;
  }
}

export default ConnectToSecondBrain;