import React from 'react';
import { Brain, Zap, Scale } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-24 neon-section-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-blue-300">
            Our AI connects with your business systems, automates repetitive tasks, and delivers results instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group neon-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-cyan-300">{feature.title}</h3>
                <p className="text-blue-200">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: <Brain className="w-6 h-6 text-cyan-400" />,
    title: "AI-Powered Analysis",
    description: "Our advanced AI analyzes your business processes and identifies automation opportunities.",
  },
  {
    icon: <Zap className="w-6 h-6 text-cyan-400" />,
    title: "Instant Integration",
    description: "Seamlessly connect with your existing tools and start automating within minutes.",
  },
  {
    icon: <Scale className="w-6 h-6 text-cyan-400" />,
    title: "Scalable Solutions",
    description: "Grow your automation as your business grows, with flexible and adaptable solutions.",
  },
];

export default Features;