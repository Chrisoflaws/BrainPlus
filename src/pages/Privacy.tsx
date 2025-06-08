import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8">
              At Synapse Automations, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
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
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about our privacy policy, please contact us at{' '}
                <a href="mailto:privacy@synapseautomations.com" className="text-blue-400 hover:text-blue-300">
                  privacy@synapseautomations.com
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
    title: "Information We Collect",
    content: "We collect information that you provide directly to us, as well as information we receive from your use of our services.",
    subsections: [
      "Contact information (name, email, phone number)",
      "Company information",
      "Usage data and analytics",
      "Technical information about your devices and systems"
    ]
  },
  {
    title: "How We Use Your Information",
    content: "We use the collected information for the following purposes:",
    subsections: [
      "Providing and improving our services",
      "Communicating with you about our services",
      "Analyzing and optimizing our platform",
      "Ensuring security and preventing fraud"
    ]
  },
  {
    title: "Data Security",
    content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
  },
  {
    title: "Your Rights",
    content: "You have certain rights regarding your personal information:",
    subsections: [
      "Right to access your personal data",
      "Right to correct inaccurate data",
      "Right to request deletion of your data",
      "Right to restrict processing of your data"
    ]
  }
];

export default Privacy;