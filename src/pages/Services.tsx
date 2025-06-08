import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { MessageSquare, Calendar, Database, Users, Home, Phone, Mail, MessageCircle, Target, Notebook as Robot, FileSpreadsheet, Search, DollarSign, BarChart, Settings, Link as LinkIcon, Building, Store, Globe, Zap, Code, Palette } from 'lucide-react';

const Services = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Our AI Services</h1>
          
          {serviceCategories.map((category, index) => (
            <section key={index} className="mb-16">
              <h2 className="text-3xl font-semibold mb-8 text-blue-400">{category.title}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {category.services.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="bg-gray-900 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3 text-blue-300">{service.title}</h3>
                        <p className="text-gray-400">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const serviceCategories = [
  {
    title: "Lightning Fast Website Development",
    services: [
      {
        icon: <Zap className="w-6 h-6 text-blue-400" />,
        title: "Rapid Web Development",
        description: "Get your website up and running in just 10 minutes with our lightning-fast development process",
      },
      {
        icon: <Code className="w-6 h-6 text-blue-400" />,
        title: "Custom Web Solutions",
        description: "Tailored websites built with modern technologies like React, Next.js, and Tailwind CSS",
      },
      {
        icon: <Globe className="w-6 h-6 text-blue-400" />,
        title: "Instant Deployment",
        description: "Deploy your website instantly with automated CI/CD pipelines and cloud hosting",
      },
      {
        icon: <Palette className="w-6 h-6 text-blue-400" />,
        title: "Modern UI/UX Design",
        description: "Beautiful, responsive designs that work perfectly on all devices",
      },
    ],
  },
  {
    title: "Lead Generation & Customer Engagement",
    services: [
      {
        icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
        title: "AI Chatbots",
        description: "Capture & qualify leads instantly with intelligent conversation flows",
      },
      {
        icon: <Phone className="w-6 h-6 text-blue-400" />,
        title: "AI Voice Assistants",
        description: "Answer calls, provide property info, and pre-qualify buyers automatically",
      },
      {
        icon: <Mail className="w-6 h-6 text-blue-400" />,
        title: "AI SMS & Email Outreach",
        description: "Automate follow-ups & nurture leads with personalized communication",
      },
      {
        icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
        title: "AI Live Chat",
        description: "Provide instant responses on websites & social media platforms",
      },
      {
        icon: <Target className="w-6 h-6 text-blue-400" />,
        title: "AI Retargeting & Marketing",
        description: "Create personalized ads & re-engagement campaigns",
      },
    ],
  },
  {
    title: "Appointment & Workflow Automation",
    services: [
      {
        icon: <Calendar className="w-6 h-6 text-blue-400" />,
        title: "AI Appointment Booking",
        description: "Auto-scheduling for real estate agents & businesses",
      },
      {
        icon: <Robot className="w-6 h-6 text-blue-400" />,
        title: "AI CRM Automations",
        description: "Sync leads, automate reminders, and manage client pipelines",
      },
      {
        icon: <FileSpreadsheet className="w-6 h-6 text-blue-400" />,
        title: "AI Data Entry & Processing",
        description: "Automatically update spreadsheets & databases",
      },
      {
        icon: <Home className="w-6 h-6 text-blue-400" />,
        title: "AI Property Matching",
        description: "Suggest listings based on buyer preferences",
      },
      {
        icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
        title: "AI Follow-Up Sequences",
        description: "Keep leads warm with automated responses",
      },
    ],
  },
  {
    title: "AI for Sales & Conversions",
    services: [
      {
        icon: <DollarSign className="w-6 h-6 text-blue-400" />,
        title: "AI Sales Assistant",
        description: "Close deals faster with AI-driven scripts & responses",
      },
      {
        icon: <Phone className="w-6 h-6 text-blue-400" />,
        title: "AI Call Handling",
        description: "Pre-qualify clients & route calls to the right agent",
      },
      {
        icon: <Search className="w-6 h-6 text-blue-400" />,
        title: "AI-Powered Market Analysis",
        description: "Provide real-time insights on trends & pricing",
      },
      {
        icon: <BarChart className="w-6 h-6 text-blue-400" />,
        title: "AI Predictive Analytics",
        description: "Identify high-converting leads & sales opportunities",
      },
    ],
  },
  {
    title: "Custom AI Solutions & Integrations",
    services: [
      {
        icon: <Settings className="w-6 h-6 text-blue-400" />,
        title: "Custom AI Chatbots & Workflows",
        description: "Tailored solutions for unique business needs",
      },
      {
        icon: <LinkIcon className="w-6 h-6 text-blue-400" />,
        title: "AI Integrations",
        description: "Sync AI with Voiceflow, Make.com, BlandAi, Vapi, Airtable, and more",
      },
      {
        icon: <Building className="w-6 h-6 text-blue-400" />,
        title: "AI for Real Estate Agencies",
        description: "Scalable automation for brokerage firms",
      },
      {
        icon: <Store className="w-6 h-6 text-blue-400" />,
        title: "AI for E-commerce & Local Businesses",
        description: "Abandoned cart recovery, customer support, and automated upselling",
      },
    ],
  },
];

export default Services;