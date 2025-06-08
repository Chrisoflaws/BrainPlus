import React from 'react';
import { MessageSquare, Calendar, Database, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Solutions = () => {
  const navigate = useNavigate();

  return (
    <section id="solutions" className="py-24 neon-section-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our AI Solutions</h2>
          <p className="text-xl text-cyan-300">
            Comprehensive automation solutions for every business need
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="group neon-card p-8 rounded-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {solution.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-cyan-300 group-hover:text-cyan-400 transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-blue-200 mb-4">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-cyan-200">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/services')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

const solutions = [
  {
    icon: <MessageSquare className="w-6 h-6 text-cyan-400" />,
    title: "AI Customer Support",
    description: "24/7 automated customer support that learns and improves over time.",
    features: [
      "Natural language processing",
      "Multi-language support",
      "Custom knowledge base",
      "Seamless handoff to human agents",
    ],
  },
  {
    icon: <Calendar className="w-6 h-6 text-cyan-400" />,
    title: "AI Appointment Scheduling",
    description: "Intelligent scheduling that optimizes your time and resources.",
    features: [
      "Smart availability management",
      "Automated reminders",
      "Calendar integration",
      "Conflict resolution",
    ],
  },
  {
    icon: <Database className="w-6 h-6 text-cyan-400" />,
    title: "AI Data Management",
    description: "Automated data entry, organization, and analysis.",
    features: [
      "Automated data entry",
      "Real-time validation",
      "Custom reporting",
      "Data visualization",
    ],
  },
  {
    icon: <Users className="w-6 h-6 text-cyan-400" />,
    title: "AI Lead Generation",
    description: "Intelligent lead identification and qualification.",
    features: [
      "Predictive lead scoring",
      "Automated outreach",
      "Pipeline optimization",
      "Performance analytics",
    ],
  },
];

export default Solutions;