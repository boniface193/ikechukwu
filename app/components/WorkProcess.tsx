// components/WorkProcess.tsx
'use client';

import { useState } from 'react';
import {
  RiBook2Fill,
  RiLightbulbFlashLine,
  RiPaletteLine,
  RiRocketLine,
  RiCodeSSlashLine,
  RiTestTubeLine,
  RiServerLine,
  RiGitBranchLine,
  RiCloudLine,
  RiRefreshLine
} from 'react-icons/ri';

const WorkProcess = () => {
  const [activePhase, setActivePhase] = useState(0);

  const phases = [
    {
      id: 1,
      title: 'Discovery & Planning',
      icon: RiBook2Fill,
      color: 'from-purple-500 to-purple-600',
      description: 'Understanding your vision and defining project requirements',
      steps: [
        'Initial consultation and requirement gathering',
        'Market research and competitor analysis',
        'Technical feasibility assessment',
        'Project scope definition and timeline planning',
        'Technology stack selection'
      ],
      deliverables: ['Project Specification Document', 'Technical Architecture Plan', 'Project Timeline'],
      tools: ['Figma', 'Notion', 'Google Docs', 'Lucidchart']
    },
    {
      id: 2,
      title: 'Design & Architecture',
      icon: RiLightbulbFlashLine,
      color: 'from-blue-500 to-blue-600',
      description: 'Creating the blueprint for your application',
      steps: [
        'Database design and schema planning',
        'API architecture and endpoint design',
        'UI/UX wireframing and prototyping',
        'System architecture planning',
        'Security and scalability considerations'
      ],
      deliverables: ['Database Schema', 'API Documentation', 'UI Mockups', 'System Architecture Diagram'],
      tools: ['Figma', 'Draw.io', 'Swagger', 'Postman']
    },
    {
      id: 3,
      title: 'Development Setup',
      icon: RiCodeSSlashLine,
      color: 'from-green-500 to-green-600',
      description: 'Setting up the development environment and foundation',
      steps: [
        'Project repository initialization',
        'Development environment setup',
        'CI/CD pipeline configuration',
        'Database and backend scaffolding',
        'Frontend application structure'
      ],
      deliverables: ['Git Repository', 'Development Environment', 'CI/CD Pipeline', 'Project Boilerplate'],
      tools: ['Git', 'Docker', 'GitHub Actions', 'Vercel/Netlify']
    },
    {
      id: 4,
      title: 'Backend Development',
      icon: RiServerLine,
      color: 'from-orange-500 to-orange-600',
      description: 'Building the server-side logic and APIs',
      steps: [
        'RESTful API development',
        'Database models and relationships',
        'Authentication and authorization',
        'Third-party API integrations',
        'Background job processing'
      ],
      deliverables: ['Functional APIs', 'Database Setup', 'Authentication System', 'API Documentation'],
      tools: ['Node.js/Express', 'MongoDB/PostgreSQL', 'JWT', 'Redis', 'WebSocket']
    },
    {
      id: 5,
      title: 'Frontend Development',
      icon: RiPaletteLine,
      color: 'from-pink-500 to-pink-600',
      description: 'Creating responsive and interactive user interfaces',
      steps: [
        'Component library development',
        'State management implementation',
        'API integration and data fetching',
        'Responsive design implementation',
        'Performance optimization'
      ],
      deliverables: ['Responsive UI', 'State Management', 'API Integration', 'Performance Optimized App'],
      tools: ['React/Next.js', 'TypeScript', 'Tailwind CSS', 'Redux/Zustand', 'React Query']
    },
    {
      id: 6,
      title: 'Testing & Quality Assurance',
      icon: RiTestTubeLine,
      color: 'from-red-500 to-red-600',
      description: 'Ensuring code quality and application reliability',
      steps: [
        'Unit and integration testing',
        'End-to-end testing',
        'Performance testing',
        'Security testing',
        'User acceptance testing'
      ],
      deliverables: ['Test Coverage Report', 'Performance Metrics', 'Security Audit', 'QA Sign-off'],
      tools: ['Jest', 'Cypress', 'Lighthouse', 'OWASP ZAP', 'Postman']
    },
    {
      id: 7,
      title: 'Deployment & DevOps',
      icon: RiCloudLine,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Deploying to production and setting up monitoring',
      steps: [
        'Production environment setup',
        'Database migration and seeding',
        'SSL certificate configuration',
        'Monitoring and analytics setup',
        'Backup and disaster recovery'
      ],
      deliverables: ['Live Application', 'Monitoring Dashboard', 'SSL Certificate', 'Backup System'],
      tools: ['AWS/Vercel', 'PM2', 'Certbot', 'Google Analytics', 'Sentry']
    },
    {
      id: 8,
      title: 'Maintenance & Iteration',
      icon: RiRefreshLine,
      color: 'from-teal-500 to-teal-600',
      description: 'Ongoing support and feature improvements',
      steps: [
        'Performance monitoring and optimization',
        'Security updates and patches',
        'Feature updates and enhancements',
        'User feedback implementation',
        'Scalability improvements'
      ],
      deliverables: ['Performance Reports', 'Security Updates', 'Feature Releases', 'User Feedback Analysis'],
      tools: ['LogRocket', 'New Relic', 'GitHub Issues', 'Slack/Discord']
    }
  ];

  return (
    <section id="process" className="container mx-auto max-w-6xl py-36">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            My Full-Stack Development Process
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            A comprehensive approach to building scalable, maintainable, and user-friendly applications
            from concept to deployment and beyond.
          </p>
        </div>

        {/* Process Overview - Desktop */}
        <div className="hidden lg:block mb-12">
          <div className="grid grid-cols-8 gap-4">
            {phases.map((phase, index) => (
              <div key={phase.id} className="text-center">
                <button
                  onClick={() => setActivePhase(index)}
                  className={`w-16 cursor-pointer h-16 rounded-2xl flex items-center shadow-purple-100 justify-center mx-auto mb-3 transition-all ${activePhase === index
                      ? `bg-linear-to-r ${phase.color} text-white shadow-lg scale-110`
                      : 'bg-white text-gray-400 shadow-md hover:shadow-lg'
                    }`}
                >
                  <phase.icon size={24} />
                </button>
                <span className={`text-sm font-medium ${activePhase === index ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                  Phase {phase.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Process Overview - Mobile */}
        <div className="lg:hidden mb-8">
          <div className="flex overflow-x-auto pb-4 space-x-4">
            {phases.map((phase, index) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(index)}
                className={`shrink-0 px-4 py-2 rounded-lg transition-all ${activePhase === index
                    ? `bg-linear-to-r ${phase.color} text-white shadow-2xl shadow-purple-100`
                    : 'bg-white text-gray-600 shadow-md'
                  }`}
              >
                <span className="text-sm font-medium">Phase {phase.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Phase Details */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-purple-100 border border-purple-100 overflow-hidden">
          <div className={`bg-linear-to-r ${phases[activePhase].color} p-8 text-white`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                {(() => {
                  const Icon = phases[activePhase].icon;
                  return <Icon size={32} />;
                })()}
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  {phases[activePhase].title}
                </h3>
                <p className="text-white/90 text-lg mt-1">
                  {phases[activePhase].description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Development Steps */}
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <RiGitBranchLine className="text-purple-600" />
                  Development Steps
                </h4>
                <ul className="space-y-3">
                  {phases[activePhase].steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-600">
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <RiRocketLine className="text-blue-600" />
                  Key Deliverables
                </h4>
                <ul className="space-y-3">
                  {phases[activePhase].deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools & Technologies */}
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <RiCodeSSlashLine className="text-green-600" />
                  Tools & Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {phases[activePhase].tools.map((tool, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { number: '99%', label: 'Client Satisfaction' },
            { number: '24/7', label: 'Support Available' },
            { number: '2-8', label: 'Weeks Delivery' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-2xl shadow-purple-100 border border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkProcess;