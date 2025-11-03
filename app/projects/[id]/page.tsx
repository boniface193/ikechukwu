// components/ProjectDetailPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCalendar, FaTasks, FaTrophy, FaLightbulb } from 'react-icons/fa';
import { projectService } from '@/app/api';

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaCalendar },
    { id: 'role', label: 'Role & Tasks', icon: FaTasks },
    { id: 'achievements', label: 'Key Achievements', icon: FaTrophy },
    { id: 'challenges', label: 'Challenges & Solutions', icon: FaLightbulb }
  ];

  const params = useParams();
  const projectId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const loadProjects = async () => {
    try {
      const projectData = await projectService.getProjectsById(projectId || '');
      setProject(projectData);
    } catch (error) {
      alert('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  interface Project {
    id?: string;
    slug?: string;
    title: string;
    description?: string;
    image?: string;
    category?: string;
    overview?: string;
    role?: string;
    duration?: string;
    teamSize?: string;
    tasks?: string[];
    achievements?: string[];
    challenges?: string[];
    solutions?: string[];
    technologies?: string[];
    liveUrl?: string;
    githubUrl?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  // Default data structure to handle missing fields
  const projectData = {
    title: project?.title || 'Project Title',
    description: project?.description || 'Project description',
    category: project?.category || 'Full Stack',
    image: project?.image || '/portfolio-default.jpg',
    overview: project?.overview || 'No overview available.',
    role: project?.role || 'Lead Developer',
    duration: project?.duration || 'Not specified',
    teamSize: project?.teamSize || 'Not specified',
    tasks: project?.tasks || ['No tasks specified'],
    achievements: project?.achievements || ['No achievements specified'],
    challenges: project?.challenges || ['No challenges specified'],
    solutions: project?.solutions || ['No solutions specified'],
    technologies: project?.technologies || [],
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    createdAt: project?.createdAt || new Date().toISOString(),
    updatedAt: project?.updatedAt || new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-purple-50 to-purple-100">

      {/* Back Button */}
      <div className="py-36 pb-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Project Header */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading projects...</p>
        </div>
      ) : (
        <section className="px-6 pb-12">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-white rounded-2xl shadow-2xl shadow-purple-100 overflow-hidden border border-purple-100">
              <div className="h-64 md:h-80 bg-linear-to-br from-purple-500 to-purple-700 overflow-hidden">
                <div className="flex flex-col items-center text-white justify-center h-full px-6 text-center">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {projectData.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold mt-2">{projectData.title}</h1>
                  <p className="text-purple-100 text-lg mt-1">{projectData.description}</p>
                </div>
              </div>

              {/* Project Meta */}
              <div className="p-6 border-b border-purple-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div>
                      <strong className="text-gray-800">Duration:</strong> {projectData.duration}
                    </div>
                    <div>
                      <strong className="text-gray-800">Team Size:</strong> {projectData.teamSize}
                    </div>
                    <div>
                      <strong className="text-gray-800">Role:</strong> {projectData.role}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {projectData.githubUrl && (
                      <a
                        href={projectData.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <FaGithub className="w-4 h-4" />
                        Code
                      </a>
                    )}
                    {projectData.liveUrl && (
                      <a
                        href={projectData.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-purple-100">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex cursor-pointer items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-600 hover:text-purple-500'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Project Overview</h3>
                      <p className="text-gray-600 leading-relaxed">{projectData.overview}</p>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Technologies Used</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {projectData.technologies.map((tech: string, index: number) => (
                          <div key={index} className="bg-purple-50 rounded-lg p-4 text-center border border-purple-100">
                            <div className="font-semibold text-purple-700">{tech}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'role' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">My Role & Responsibilities</h3>
                    <div className="space-y-4">
                      {projectData.tasks.map((task, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 flex-1">{task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Achievements</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      {projectData.achievements.map((achievement: string, index: number) => (
                        <div key={index} className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm">
                          <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'challenges' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">Challenges & Solutions</h3>
                      <div className="space-y-6">
                        {projectData.challenges.map((challenge: string, index: number) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                              <h4 className="font-semibold text-red-700 flex items-center gap-2">
                                <FaLightbulb className="w-4 h-4" />
                                Challenge {index + 1}
                              </h4>
                              <p className="text-red-600 mt-1">{challenge}</p>
                            </div>
                            <div className="bg-green-50 px-6 py-4">
                              <h5 className="font-semibold text-green-700 mb-2">Solution:</h5>
                              <p className="text-green-600">{projectData.solutions[index]}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Next Project CTA */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Interested in seeing more?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Check out my other projects or let&apos;s discuss how I can help bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all font-medium"
            >
              View All Projects
            </Link>
            <a
              target='_blank'
              href={'https://calendar.app.google/YYTsWAG1DYR3u1bZ6'}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all font-medium"
            >
              Discuss Your Project
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}