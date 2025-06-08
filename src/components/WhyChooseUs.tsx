import React from 'react';
import { Zap, Scale, Clock } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-24 neon-section-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Synapse Automations?</h2>
          <p className="text-xl text-pink-300">
            Leading the future of business automation with cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-pink-500/20 rounded-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                {reason.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-pink-300">{reason.title}</h3>
              <p className="text-pink-200">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const reasons = [
  {
    icon: <Zap className="w-8 h-8 text-pink-400" />,
    title: "Lightning Fast",
    description: "Set up automation workflows in minutes, not days. Our AI adapts and learns instantly.",
  },
  {
    icon: <Scale className="w-8 h-8 text-pink-400" />,
    title: "Infinitely Scalable",
    description: "From startups to enterprises, our solutions grow with your business needs.",
  },
  {
    icon: <Clock className="w-8 h-8 text-pink-400" />,
    title: "Always Available",
    description: "24/7 automation that never sleeps, ensuring your business runs smoothly around the clock.",
  },
];

export default WhyChooseUs;