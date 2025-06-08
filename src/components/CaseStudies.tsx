import React from 'react';

const CaseStudies = () => {
  return (
    <section id="case-studies" className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-500/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/20 blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Success Stories
          </h2>
          <p className="text-xl text-blue-300">
            See how businesses are transforming with AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Neon glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300"></div>
              
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 group-hover:transform group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-blue-500/20 border border-gray-800 group-hover:border-blue-500/20">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.company}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                </div>
                
                <div className="p-6 relative">
                  <h3 className="text-xl font-semibold mb-2 text-blue-300 group-hover:text-blue-200">
                    {study.company}
                  </h3>
                  <p className="text-gray-300 mb-4 group-hover:text-gray-200">
                    {study.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors duration-300">
                      {study.improvement}
                    </span>
                    <span className="text-purple-400 group-hover:text-purple-300">
                      {study.industry}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const caseStudies = [
  {
    company: "TechCorp Solutions",
    description: "Automated customer support reduced response time by 80% and improved satisfaction scores.",
    improvement: "80% Faster Response",
    industry: "Technology",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800",
  },
  {
    company: "Global Logistics",
    description: "AI-powered scheduling optimized delivery routes and reduced operational costs.",
    improvement: "45% Cost Reduction",
    industry: "Logistics",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800",
  },
  {
    company: "HealthCare Plus",
    description: "Automated appointment scheduling reduced no-shows and improved patient satisfaction.",
    improvement: "90% Less No-shows",
    industry: "Healthcare",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=800",
  },
];

export default CaseStudies;