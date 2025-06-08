import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { AlertCircle, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

interface TroubleshootingForm {
  platform: string;
  accountCreationSteps: string;
  errorMessage: string;
  lastAccess: string;
  recentChanges: string;
  browserInfo: string;
}

const TroubleshootingGuide = () => {
  const [formData, setFormData] = useState<TroubleshootingForm>({
    platform: '',
    accountCreationSteps: '',
    errorMessage: '',
    lastAccess: '',
    recentChanges: '',
    browserInfo: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://hook.eu2.make.com/u27fgk5xn2c7gsuvmznahb9bexwph2w1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'troubleshooting_request',
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Troubleshooting Request Received</h2>
              <p className="text-gray-300 mb-8">
                Our support team will analyze your issue and respond within 24 hours with detailed resolution steps.
              </p>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">What happens next?</h3>
                <ul className="text-left space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-blue-500/20 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <span>Our team will review your submission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-purple-500/20 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <span>You'll receive an email with troubleshooting steps</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 bg-pink-500/20 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-pink-400" />
                    </div>
                    <span>Follow-up support if needed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-4">Profile Access Troubleshooting</h1>
              <p className="text-xl text-gray-300">
                Let's help you regain access to your account
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl">
              <div className="mb-8 p-4 bg-blue-900/30 border border-blue-500/50 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-300 mb-2">Before You Begin</h3>
                    <p className="text-gray-300 text-sm">
                      Please provide as much detail as possible to help us quickly identify and resolve your access issue.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-2">
                    Which system or platform are you trying to access?
                  </label>
                  <input
                    type="text"
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="e.g., Second Brain AI Dashboard, Mobile App, etc."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="accountCreationSteps" className="block text-sm font-medium text-gray-300 mb-2">
                    What steps did you take to create your account?
                  </label>
                  <textarea
                    id="accountCreationSteps"
                    name="accountCreationSteps"
                    value={formData.accountCreationSteps}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Describe the registration process you followed..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="errorMessage" className="block text-sm font-medium text-gray-300 mb-2">
                    What error message(s) are you seeing?
                  </label>
                  <textarea
                    id="errorMessage"
                    name="errorMessage"
                    value={formData.errorMessage}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Copy and paste any error messages here..."
                  />
                </div>

                <div>
                  <label htmlFor="lastAccess" className="block text-sm font-medium text-gray-300 mb-2">
                    When did you last successfully access the system?
                  </label>
                  <input
                    type="text"
                    id="lastAccess"
                    name="lastAccess"
                    value={formData.lastAccess}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="e.g., Yesterday, Last week, Never accessed before"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="recentChanges" className="block text-sm font-medium text-gray-300 mb-2">
                    What has changed since your last successful login?
                  </label>
                  <textarea
                    id="recentChanges"
                    name="recentChanges"
                    value={formData.recentChanges}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="e.g., Password changes, browser updates, system changes..."
                  />
                </div>

                <div>
                  <label htmlFor="browserInfo" className="block text-sm font-medium text-gray-300 mb-2">
                    Browser and System Information
                  </label>
                  <input
                    type="text"
                    id="browserInfo"
                    name="browserInfo"
                    value={formData.browserInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="e.g., Chrome 121 on Windows 11"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Submit Troubleshooting Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TroubleshootingGuide;