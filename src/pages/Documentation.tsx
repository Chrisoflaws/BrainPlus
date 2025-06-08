import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                <nav className="space-y-1">
                  {sections.map((section, index) => (
                    <a
                      key={index}
                      href={`#${section.id}`}
                      className="block py-2 px-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-8">Documentation</h1>
              
              {sections.map((section, index) => (
                <section key={index} id={section.id} className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-6">{section.content}</p>
                    {section.subsections && (
                      <ul className="space-y-4">
                        {section.subsections.map((subsection, subIndex) => (
                          <li key={subIndex}>
                            <h3 className="text-xl font-medium mb-2">{subsection.title}</h3>
                            <p className="text-gray-400">{subsection.content}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: 'Learn how to integrate Synapse Automations into your business workflow.',
    subsections: [
      {
        title: 'Quick Start Guide',
        content: 'Set up your first automation workflow in minutes.',
      },
      {
        title: 'Installation',
        content: 'Step-by-step guide to installing and configuring our solutions.',
      },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    content: 'Complete documentation of our API endpoints and integration options.',
    subsections: [
      {
        title: 'Authentication',
        content: 'Secure your API requests with our authentication system.',
      },
      {
        title: 'Endpoints',
        content: 'Detailed information about available API endpoints and their usage.',
      },
    ],
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    content: 'Step-by-step guides to help you make the most of our platform.',
    subsections: [
      {
        title: 'Basic Automation',
        content: 'Create your first automated workflow.',
      },
      {
        title: 'Advanced Features',
        content: 'Explore advanced automation capabilities and customization options.',
      },
    ],
  },
];

export default Documentation;