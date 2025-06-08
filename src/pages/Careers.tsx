import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Careers = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Careers at Synapse Automations</h1>
          <p className="text-xl text-gray-300 mb-12">
            Join us in shaping the future of business automation
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                <h3 className="text-xl font-semibold mb-3">{position.title}</h3>
                <p className="text-gray-400 mb-4">{position.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span>{position.location}</span>
                  <span>•</span>
                  <span>{position.type}</span>
                </div>
                <a 
                  href={`mailto:careers@synapseautomations.com?subject=Application for ${position.title}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const openPositions = [
  {
    title: "AI Engineer",
    description: "Design and implement AI solutions for business process automation.",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Full Stack Developer",
    description: "Build robust and scalable automation platforms using modern technologies.",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Solutions Architect",
    description: "Design comprehensive automation solutions for enterprise clients.",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Product Manager",
    description: "Lead the development of our automation products from conception to launch.",
    location: "Remote",
    type: "Full-time",
  },
];

export default Careers;