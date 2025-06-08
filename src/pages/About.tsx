import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">About Synapse Automations</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-6">
              Synapse Automations is at the forefront of business process automation, leveraging cutting-edge AI technology to transform how companies operate.
            </p>
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              To empower businesses with intelligent automation solutions that drive efficiency, reduce costs, and accelerate growth.
            </p>
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Vision</h2>
            <p className="text-gray-300 mb-6">
              To be the global leader in AI-powered business automation, making advanced technology accessible to companies of all sizes.
            </p>
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-3">
              <li>Innovation: Constantly pushing the boundaries of what's possible</li>
              <li>Excellence: Delivering the highest quality solutions</li>
              <li>Integrity: Building trust through transparency and honesty</li>
              <li>Customer Success: Ensuring our clients achieve their goals</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;