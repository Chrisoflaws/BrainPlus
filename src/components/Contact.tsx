import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../contexts/AuthContext';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('consultations')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          service: formData.service,
          message: formData.message.trim() || null,
        }]);

      if (error) throw error;

      // Also send to webhook for immediate notification
      await fetch('https://hook.eu2.make.com/gkgn00l8ai4rlxs9b4mj3imzxs2hhkd5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      setFormData({
        name: '',
        email: '',
        company: '',
        service: '',
        message: '',
      });
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-24 bg-gray-900 min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-6">Thank You!</h2>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for your interest in our services. A member of our team will personally reach out to you within 24 hours to discuss your needs and schedule your free consultation.
            </p>
            <div className="text-gray-400 border-t border-gray-700 pt-6 mt-6">
              <p>In the meantime, feel free to explore more about our services.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Get Started Today</h2>
          <p className="text-xl text-gray-400">
            Book your free business analysis and see how we can transform your business
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                Company*
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border ${errors.company ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
                disabled={isSubmitting}
              />
              {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                Service of Interest*
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border ${errors.service ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none cursor-pointer max-h-60 overflow-y-auto`}
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4B5563 #1F2937'
                }}
                disabled={isSubmitting}
              >
                <option value="">Select a service</option>
                {serviceCategories.map((category) => (
                  <optgroup 
                    key={category.title} 
                    label={category.title}
                    className="text-blue-400 font-semibold bg-gray-900"
                  >
                    {category.services.map((service) => (
                      <option 
                        key={service} 
                        value={service}
                        className="text-white font-normal bg-gray-800 py-1"
                      >
                        {service}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.service && <p className="mt-1 text-sm text-red-500">{errors.service}</p>}
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Tell us more about your needs..."
                disabled={isSubmitting}
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Book Free Consultation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const serviceCategories = [
  {
    title: "Website Development",
    services: [
      "Rapid Web Development (10-Minute Websites)",
      "Custom Web Solutions",
      "Instant Deployment",
      "Modern UI/UX Design",
    ],
  },
  {
    title: "Lead Generation & Customer Engagement",
    services: [
      "AI Chatbots",
      "AI Voice Assistants",
      "AI SMS & Email Outreach",
      "AI Live Chat",
      "AI Retargeting & Marketing",
    ],
  },
  {
    title: "Appointment & Workflow Automation",
    services: [
      "AI Appointment Booking",
      "AI CRM Automations",
      "AI Data Entry & Processing",
      "AI Property Matching",
      "AI Follow-Up Sequences",
    ],
  },
  {
    title: "AI for Sales & Conversions",
    services: [
      "AI Sales Assistant",
      "AI Call Handling",
      "AI-Powered Market Analysis",
      "AI Predictive Analytics",
    ],
  },
  {
    title: "Custom AI Solutions & Integrations",
    services: [
      "Custom AI Chatbots & Workflows",
      "AI Integrations",
      "AI for Real Estate Agencies",
      "AI for E-commerce & Local Businesses",
    ],
  },
];

export default Contact;