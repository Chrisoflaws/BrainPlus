import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Support = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Support Center</h1>
          
          {/* Quick Help Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">How can we help you?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {quickHelp.map((item, index) => (
                <div key={index} className="bg-gray-900 p-6 rounded-lg hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400 mb-4">{item.description}</p>
                  <a href={item.link} className="text-blue-400 hover:text-blue-300">Learn more →</a>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Support */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Still Need Help?</h2>
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg p-8 text-center">
              <p className="text-xl mb-6">Our support team is available 24/7 to help you</p>
              <a 
                href="mailto:support@synapseautomations.com"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-300"
              >
                Contact Support
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const quickHelp = [
  {
    title: "Getting Started",
    description: "New to Synapse Automations? Learn the basics and set up your first automation.",
    link: "/documentation#getting-started"
  },
  {
    title: "API Documentation",
    description: "Detailed documentation for integrating our API into your systems.",
    link: "/documentation#api-reference"
  },
  {
    title: "Tutorials",
    description: "Step-by-step guides to help you make the most of our platform.",
    link: "/documentation#tutorials"
  }
];

const faqs = [
  {
    question: "How do I get started with Synapse Automations?",
    answer: "Getting started is easy! Simply book a free consultation, and our team will guide you through the process of implementing automation solutions tailored to your business needs."
  },
  {
    question: "What types of processes can be automated?",
    answer: "We can automate a wide range of business processes, including customer support, data entry, appointment scheduling, and more. Our AI-powered solutions are highly adaptable to various industries and use cases."
  },
  {
    question: "How long does implementation take?",
    answer: "Implementation time varies depending on the complexity of your automation needs. Simple automations can be set up within days, while more complex solutions might take a few weeks to fully implement and optimize."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security very seriously. Our platform uses enterprise-grade encryption and follows industry best practices for data protection and privacy compliance."
  }
];

export default Support;