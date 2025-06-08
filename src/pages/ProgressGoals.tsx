import React from 'react';
import { TrendingUp, Target, Award, ArrowUp, ArrowDown } from 'lucide-react';

const ProgressGoals = () => {
  const goals = [
    { id: 1, title: 'Complete Project Milestones', progress: 75, trend: 'up', category: 'Work' },
    { id: 2, title: 'Learning New Skills', progress: 60, trend: 'up', category: 'Personal Development' },
    { id: 3, title: 'Health & Wellness Goals', progress: 45, trend: 'down', category: 'Health' },
    { id: 4, title: 'Reading Goals', progress: 80, trend: 'up', category: 'Education' },
  ];

  const achievements = [
    { id: 1, title: 'Consistent Progress', description: '7-day streak of completing daily tasks', icon: Award },
    { id: 2, title: 'Goal Setter', description: 'Created and tracked 5 new goals', icon: Target },
    { id: 3, title: 'Growth Mindset', description: 'Improved in 3 key areas this week', icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Progress & Goals</h1>
        <p className="text-gray-400">Track your progress and achieve your goals</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Goals Section */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Current Goals
          </h2>
          
          <div className="space-y-6">
            {goals.map(goal => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-500">{goal.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{goal.progress}%</span>
                    {goal.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Recent Achievements
          </h2>
          
          <div className="space-y-4">
            {achievements.map(achievement => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressGoals;