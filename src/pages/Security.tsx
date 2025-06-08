import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Security = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Security</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8">
              Security is at the core of everything we do at Synapse Automations. Learn about our comprehensive approach to protecting your data and systems.
            </p>

            {sections.map((section, index) => (
              <section key={index} className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                <p className="text-gray-300 mb-4">{section.content}</p>
                {section.features && (
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {section.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="bg-gray-900 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Security Contacts</h2>
              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg p-8">
                <p className="text-gray-300 mb-4">
                  For security-related inquiries or to report vulnerabilities, please contact our security team:
                </p>
                <a 
                  href="mailto:security@synapseautomations.com"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
                >
                  Contact Security Team
                </a>
              </div>
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
    title: "Infrastructure Security",
    content: "Our infrastructure is built on enterprise-grade cloud providers with multiple layers of security controls.",
    features: [
      {
        title: "Data Encryption",
        description: "All data is encrypted at rest and in transit using industry-standard encryption protocols."
      },
      {
        title: "Network Security",
        description: "Multiple layers of firewalls and intrusion detection systems protect our network."
      },
      {
        title: "Access Control",
        description: "Strict access controls and authentication mechanisms protect your resources."
      },
      {
        title: "Monitoring",
        description: "24/7 monitoring and alerting systems detect and respond to security events."
      }
    ]
  },
  {
    title: "Compliance & Certifications",
    content: "We maintain compliance with major security standards and regularly undergo security audits.",
    features: [
      {
        title: "SOC 2 Compliance",
        description: "Our systems and processes are SOC 2 Type II certified."
      },
      {
        title: "GDPR Compliance",
        description: "We follow GDPR requirements for processing and protecting personal data."
      },
      {
        title: "Regular Audits",
        description: "Independent security firms regularly audit our systems and processes."
      },
      {
        title: "Industry Standards",
        description: "We follow security best practices and industry standards."
      }
    ]
  },
  {
    title: "Security Features",
    content: "Our platform includes built-in security features to protect your data and operations.",
    features: [
      {
        title: "Multi-Factor Authentication",
        description: "Optional MFA adds an extra layer of security to your account."
      },
      {
        title: "Audit Logging",
        description: "Comprehensive audit logs track all system activities and changes."
      },
      {
        title: "Backup & Recovery",
        description: "Regular backups and disaster recovery procedures protect your data."
      },
      {
        title: "Vulnerability Management",
        description: "Regular security assessments and patch management keep systems secure."
      }
    ]
  }
];

export default Security;