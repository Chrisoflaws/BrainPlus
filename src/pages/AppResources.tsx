import React, { useState, useEffect } from 'react';
import { Brain, Trophy, Rocket, DollarSign, Shield, Clock, Star, Play, ExternalLink, Users, MessageSquare, Search, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../contexts/AuthContext';

interface VideoProgress {
  [videoId: string]: boolean;
}

const AppResources = () => {
  const { user, isAuthenticated } = useAuth();
  const [videoProgress, setVideoProgress] = useState<VideoProgress>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchVideoProgress();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchVideoProgress = async () => {
    if (!user?.id) {
      console.warn('No user ID available for fetching video progress');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching video progress for user:', user.id);
      const { data, error } = await supabase
        .from('video_progress')
        .select('video_id, is_watched')
        .eq('user_id', user.id);

      if (error) {
        console.error('Supabase error fetching video progress:', error);
        throw error;
      }

      console.log('Video progress data received:', data);

      const progressMap: VideoProgress = {};
      data?.forEach(item => {
        progressMap[item.video_id] = item.is_watched;
      });
      
      setVideoProgress(progressMap);
      console.log('Video progress state updated:', progressMap);
    } catch (error) {
      console.error('Error fetching video progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoWatched = async (videoId: string) => {
    if (!isAuthenticated || !user?.id) {
      alert('Please log in to track your progress');
      return;
    }

    if (updating === videoId) {
      console.log('Already updating video:', videoId);
      return; // Prevent double-clicks
    }

    const currentWatchedState = videoProgress[videoId] || false;
    const newWatchedState = !currentWatchedState;
    
    console.log(`Toggling video ${videoId} from ${currentWatchedState} to ${newWatchedState}`);
    
    setUpdating(videoId);
    
    // Optimistically update the UI
    setVideoProgress(prev => ({
      ...prev,
      [videoId]: newWatchedState
    }));
    
    try {
      // First, try to check if a record exists
      const { data: existingRecord, error: selectError } = await supabase
        .from('video_progress')
        .select('id, is_watched')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .maybeSingle();

      if (selectError) {
        console.error('Error checking existing record:', selectError);
        throw selectError;
      }

      console.log('Existing record:', existingRecord);

      let result;
      if (existingRecord) {
        // Update existing record
        console.log('Updating existing record...');
        result = await supabase
          .from('video_progress')
          .update({
            is_watched: newWatchedState,
            watched_at: newWatchedState ? new Date().toISOString() : null
          })
          .eq('user_id', user.id)
          .eq('video_id', videoId)
          .select();
      } else {
        // Insert new record
        console.log('Inserting new record...');
        result = await supabase
          .from('video_progress')
          .insert({
            user_id: user.id,
            video_id: videoId,
            is_watched: newWatchedState,
            watched_at: newWatchedState ? new Date().toISOString() : null
          })
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('Supabase error updating video progress:', error);
        throw error;
      }

      console.log('Video progress updated successfully:', data);
    } catch (error) {
      console.error('Error updating video progress:', error);
      
      // Revert the optimistic update on error
      setVideoProgress(prev => ({
        ...prev,
        [videoId]: currentWatchedState
      }));
      
      alert('Failed to update progress. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const getCompletionStats = () => {
    const totalVideos = visualizationResources.length;
    const watchedVideos = Object.values(videoProgress).filter(Boolean).length;
    const percentage = totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;
    
    return { totalVideos, watchedVideos, percentage };
  };

  const { totalVideos, watchedVideos, percentage } = getCompletionStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Star className="w-12 h-12 text-yellow-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Visualization Resource Hub
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Rewire your brain for success using proven mental rehearsal techniques from elite performers and neuroscientists.
        </p>
        
        {/* Progress Tracker */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Your Progress
          </h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300">Videos Watched</span>
            <span className="text-white font-semibold">{watchedVideos} / {totalVideos}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-400">{percentage}% Complete</div>
        </div>
      </div>

      {/* Visualization Resources */}
      <section className="mb-16">
        <div className="grid gap-8">
          {visualizationResources.map((resource, index) => {
            const isWatched = videoProgress[resource.id] || false;
            const isUpdating = updating === resource.id;
            
            return (
              <div key={index} className={`bg-gray-900 rounded-xl p-8 border transition-all duration-300 ${
                isWatched 
                  ? 'border-green-500/30 bg-green-900/10' 
                  : 'border-gray-800 hover:border-blue-500/20'
              }`}>
                <div className="flex items-start gap-6">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleVideoWatched(resource.id)}
                    className="mt-2 flex-shrink-0 transition-colors duration-200 disabled:opacity-50"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : isWatched ? (
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    ) : (
                      <Circle className="w-8 h-8 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={`text-2xl font-bold transition-colors ${
                        isWatched ? 'text-green-300' : 'text-white'
                      }`}>
                        {resource.title}
                        {isWatched && <span className="ml-2 text-green-400">✓</span>}
                      </h3>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                        {resource.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-semibold text-blue-400">{resource.author}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{resource.role}</span>
                    </div>
                    <p className="text-gray-300 mb-6">{resource.description}</p>
                    
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-purple-300">Key Takeaways:</h4>
                      <div className="space-y-3">
                        {resource.keyTakeaways.map((takeaway, takeawayIndex) => (
                          <div key={takeawayIndex} className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <span className="text-purple-400 font-medium">{takeaway.timestamp}</span>
                              <span className="text-gray-300 ml-2">{takeaway.content}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-4">
                      <button 
                        onClick={() => toggleVideoWatched(resource.id)}
                        disabled={isUpdating}
                        className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          isWatched
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        }`}
                      >
                        {isUpdating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            {isWatched ? 'Watched' : 'Watch Now'}
                          </>
                        )}
                      </button>
                      <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5" />
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Suggested Watch Order */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/20">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            Suggested Watch Order
          </h2>
          <p className="text-gray-300 mb-6">To get the most impact:</p>
          <div className="grid md:grid-cols-3 gap-6">
            {watchOrder.map((step, index) => (
              <div key={index} className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{step.phase}</h3>
                </div>
                <p className="text-gray-400 mb-3">{step.description}</p>
                <div className="text-sm text-blue-400 font-medium">{step.resources}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Search Terms */}
      <section className="mb-16">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Search className="w-6 h-6 text-pink-400" />
            </div>
            Bonus Search Terms
          </h2>
          <p className="text-gray-300 mb-6">Explore these additional resources for deeper learning:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {bonusSearchTerms.map((term, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <Search className="w-5 h-5 text-pink-400 flex-shrink-0" />
                <span className="text-gray-300 font-medium">"{term}"</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community & Support */}
      <section>
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/20">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                Join Our Community
              </h3>
              <p className="text-gray-300 mb-6">
                Connect with other users practicing visualization techniques and share your success stories.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                Join Community
              </button>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-400" />
                Get Personalized Guidance
              </h3>
              <p className="text-gray-300 mb-6">
                Need help implementing these techniques? Our AI coaches can provide personalized visualization training.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                Start Training
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const visualizationResources = [
  {
    id: 'huberman-visualization-science',
    icon: <Brain className="w-8 h-8 text-blue-400" />,
    title: "1. The Science of Visualization",
    author: "Andrew Huberman",
    role: "Neuroscientist",
    category: "Science",
    description: "Understand how visualization physically rewires your brain's motor cortex and activates the Reticular Activating System (RAS) to detect opportunities.",
    keyTakeaways: [
      {
        timestamp: "5:30–12:00:",
        content: "15 mins/day of vivid visualization boosts skill learning."
      },
      {
        timestamp: "22:45:",
        content: "Pair visualization with movement (e.g., shadowboxing goals) for 3x faster results."
      }
    ]
  },
  {
    id: 'phelps-olympic-visualization',
    icon: <Trophy className="w-8 h-8 text-yellow-400" />,
    title: "2. Olympic Athletes' Visualization Secrets",
    author: "Coach Bob Bowman",
    role: "Michael Phelps' Coach",
    category: "Elite Performance",
    description: "Learn the exact mental blueprint that helped Phelps win 28 Olympic medals.",
    keyTakeaways: [
      {
        timestamp: "3:15:",
        content: "Visualizing every micro-step before action = flawless execution."
      },
      {
        timestamp: "8:50:",
        content: "Use \"failure visualization\" to rehearse for adversity."
      }
    ]
  },
  {
    id: 'musk-manifestation-techniques',
    icon: <Rocket className="w-8 h-8 text-purple-400" />,
    title: "3. Manifest Like Elon Musk",
    author: "Top Tier Mindset",
    role: "Case Study",
    category: "Innovation",
    description: "Discover how Musk uses reverse engineering and modeling to visualize billion-dollar outcomes.",
    keyTakeaways: [
      {
        timestamp: "6:20:",
        content: "Reverse-write goals: \"Mars colony by 2050 → Rocket test by 2026\""
      },
      {
        timestamp: "11:10:",
        content: "Visualize inventions using 3D tools before building them."
      }
    ]
  },
  {
    id: 'lakhiani-wealth-visualization',
    icon: <DollarSign className="w-8 h-8 text-green-400" />,
    title: "4. Guided Visualization for Wealth",
    author: "Vishen Lakhiani",
    role: "Mindvalley Founder",
    category: "Wealth",
    description: "A 20-min immersive audio to imprint wealth goals into your subconscious.",
    keyTakeaways: [
      {
        timestamp: "4:30–9:00:",
        content: "Script your \"perfect day\" with touch-based sensory detail."
      },
      {
        timestamp: "15:00:",
        content: "Use \"Future Memory\" to make success feel inevitable."
      }
    ]
  },
  {
    id: 'goggins-mental-toughness',
    icon: <Shield className="w-8 h-8 text-red-400" />,
    title: "5. Navy SEALs' Mental Toughness Visualization",
    author: "David Goggins",
    role: "Former Navy SEAL",
    category: "Mental Toughness",
    description: "Learn to override fear and pain through deliberate mental rehearsal.",
    keyTakeaways: [
      {
        timestamp: "7:45:",
        content: "Use the \"Cookie Jar Method\" — visualize past wins to boost inner strength."
      },
      {
        timestamp: "12:30:",
        content: "Pre-visualize worst-case scenarios to kill fear."
      }
    ]
  },
  {
    id: 'robbins-morning-visualization',
    icon: <Clock className="w-8 h-8 text-orange-400" />,
    title: "6. The 10-Minute Morning Visualization",
    author: "Mel Robbins",
    role: "Motivational Speaker",
    category: "Daily Practice",
    description: "A short, effective daily visualization for busy people.",
    keyTakeaways: [
      {
        timestamp: "2:15:",
        content: "Speak your goal aloud: \"I am a millionaire.\""
      },
      {
        timestamp: "5:00:",
        content: "Use sensory cues (e.g., coffee aroma) to anchor your vision."
      }
    ]
  }
];

const watchOrder = [
  {
    phase: "Start with Science",
    description: "Build your foundation with neuroscience",
    resources: "Huberman"
  },
  {
    phase: "Elite Performance",
    description: "Learn from world-class athletes",
    resources: "Phelps, Goggins"
  },
  {
    phase: "Daily Routines",
    description: "Implement practical daily habits",
    resources: "Lakhiani, Robbins"
  }
];

const bonusSearchTerms = [
  "Jim Kwik visualization meditation",
  "Tony Robbins future self visualization",
  "Joe Dispenza meditation visualization",
  "Neville Goddard visualization techniques",
  "Silva Method visualization training",
  "Creative visualization Shakti Gawain"
];

export default AppResources;