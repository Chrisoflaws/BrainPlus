import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8">
              Please read these terms of service carefully before using Synapse Automations' services.
            </p>

            {sections.map((section, index) => (
              <section key={index} className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                <p className="text-gray-300 mb-4">{section.content}</p>
                {section.subsections && (
                  <ul className="list-disc pl-6 space-y-3 text-gray-400">
                    {section.subsections.map((subsection, subIndex) => (
                      <li key={subIndex}>{subsection}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-gray-300">
                For any questions regarding these terms, please contact us at{' '}
                <a href="mailto:legal@synapseautomations.com" className="text-blue-400 hover:text-blue-300">
                  legal@synapseautomations.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using our services, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access our services."
  },
  {
    title: "Use License",
    content: "Permission is granted to temporarily access our services for personal, non-commercial transitory viewing only.",
    subsections: [
      "You must not modify or copy the materials",
      "You must not use the materials for any commercial purpose",
      "You must not attempt to decompile or reverse engineer any software",
      "Your license shall automatically terminate if you violate any of these restrictions"
    ]
  },
  {
    title: "Service Availability",
    content: "We strive to provide uninterrupted service, but we may need to temporarily suspend access for maintenance or updates. We are not liable for any service interruptions."
  },
  {
    title: "User Obligations",
    content: "When using our services, you agree to:",
    subsections: [
      "Provide accurate and complete information",
      "Maintain the security of your account",
      "Not interfere with or disrupt the services",
      "Comply with all applicable laws and regulations"
    ]
  },
  {
    title: "Intellectual Property",
    content: "All content, features, and functionality are owned by Synapse Automations and are protected by international copyright, trademark, and other intellectual property laws."
  }
];

export default Terms;