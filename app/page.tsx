'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaMedium, FaBriefcase, FaHeart, FaGithub, FaLinkedin, FaTwitter, FaEdit, FaTrash } from 'react-icons/fa';
import { RiBook2Fill, RiLightbulbFlashLine, RiPaletteLine, RiRocketLine } from 'react-icons/ri';
import { projectService } from './api';
import ProjectForm from './components/forms';
import WorkProcess from './components/WorkProcess';
import TechStack from './components/TechStack';
import { Project } from '@/types/project';

// Check if admin features should be enabled
const isAdminEnabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await projectService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      alert('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Project type used across this component
  const currentYear = new Date().getFullYear(); // Get the current year
  const startingYear = 2019; // Starting year (or whatever you want)
  const yearsPassed = currentYear - startingYear;

  const handleUpdateProject = async (projectData: Omit<Project, 'id'>): Promise<void> => {

    if (editingProject?.id) {
      await projectService.updateProject(editingProject.id, projectData);
    } else {
      alert('Editing project is null or missing id');
    }
    await loadProjects();
    setEditingProject(null);
  };

  const handleDeleteProject = async (projectId?: string): Promise<void> => {
    if (!projectId) {
      alert('Project id is missing');
      return;
    }

    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(projectId);
        await loadProjects();
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  const openEditForm = (project: Project): void => {
    setEditingProject(project);
  };

  const closeEditForm = () => {
    setEditingProject(null);
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-white via-purple-50 to-purple-100">

      {editingProject && (
        <ProjectForm
          onSave={handleUpdateProject}
          project={editingProject}
          onCancel={closeEditForm}
          isEditing={true}
        />
      )}

      {/* Hero Section */}
      <section id="home" className="py-36 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-6">
                Hello, I&apos;m<br />
                <span className="font-bold bg-linear-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Boniface Dennis</span>
              </h1>

              <div className="text-lg text-gray-600 space-y-4 mb-8">
                <p>— a full-stack JavaScript engineer with {yearsPassed}+ years of experience building performant apps using React, Next.js, Express, and AWS Serverless. I help businesses turn ideas into production-grade solutions.</p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  target='_blank'
                  href={'https://calendar.app.google/YYTsWAG1DYR3u1bZ6'}
                  className="bg-linear-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-purple-900 cursor-pointer transition-all font-medium text-center shadow-lg hover:shadow-xl"
                >
                  Let&apos;s discuss your project
                </a>
                <a href='/ikechukwu_frontend.pdf' target='_blank' download={'ikechukwu_frontend.pdf'} className="border border-purple-600 text-purple-600 px-8 py-3 cursor-pointer rounded-lg hover:bg-purple-600 hover:text-white transition-all font-medium">
                  Download Resume
                </a>
              </div>
            </div>

            {/* Right Content - Profile */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 overflow-hidden h-80 bg-linear-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                  <Image src={'/team3.jpg'} width={400} height={100} alt={'my picture'} className='rounded-lg' />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-purple-100">
                  <div className="flex items-center gap-2">
                    <FaBriefcase className="text-purple-500" />
                    <span className="font-semibold text-purple-600">Portfolio</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-purple-100">
                  <div className="flex items-center gap-2">
                    <FaHeart className="text-red-500" />
                    <span className="font-semibold text-purple-600">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio grid */}
      <section id="portfolio" className="py-36 bg-white px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center items-center mb-12">
            <div className='text-center'>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Portfolio</h2>
              <p className="text-gray-600 text-lg">A selection of my recent work</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <article key={project.id} className="bg-white rounded-2xl shadow-2xl shadow-purple-100 hover:shadow-xl transition-all overflow-hidden border border-purple-50 relative">
                  {/* Admin controls */}
                  <div className="absolute top-4 right-4 flex gap-2 transition-opacity z-10">
                    {isAdminEnabled && (
                      <>
                        <button
                          onClick={() => openEditForm(project)}
                          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                          title="Edit project"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="bg-red-600 cursor-pointer hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                          title="Delete project"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="relative h-48 overflow-hidden">
                    <div className="w-full h-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-lg">{project.title}</span>
                      )}
                    </div>
                    <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all"></div>
                  </div>
                  <div className="p-6">
                    <span className="text-xs float-right bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{project.category}</span>
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-800 md:text-xl text-lg">{project.title}</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/projects/${project.id}?id=${project.slug}`}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 transition-colors"
                      >
                        View Case Study
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Work Process */}
      <WorkProcess />

      {/* Technology Stack */}
      <TechStack />

      {/* Final CTA */}
      <section className="py-20 bg-linear-to-r from-purple-600 to-purple-800 text-white px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Do you have a Project Idea?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your project and turn it into a successful product.
          </p>
          <a
            target='_blank'
            href={'https://calendar.app.google/YYTsWAG1DYR3u1bZ6'}
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Schedule a Call
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className=" text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-8 md:mb-0">
              <div className='text-center items-center flex'>
                <div className="w-9 h-9 rounded-full bg-linear-to-r from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold mr-2">B</div>
                <span className='text-purple-700 font-semibold text-lg'>Boniface</span>
              </div>
              <p className="text-purple-800 mt-2">Full-Stack JavaScript Engineer</p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: FaGithub, name: 'GitHub', url: 'https://github.com/boniface193' },
                { icon: FaLinkedin, name: 'LinkedIn', url: 'https://www.linkedin.com/in/boniface-ikechukwu/' },
                { icon: FaTwitter, name: 'Twitter', url: 'https://twitter.com/bidtechnologies' },
                { icon: FaMedium, name: 'Medium', url: 'https://medium.com/@bonifaceikechukwu' }
              ].map((social, index) => (
                <a
                  key={index}
                  target='_blank'
                  href={social.url}
                  className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors shadow-lg"
                  title={social.name}
                >
                  <social.icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-purple-800 border-t border-purple-700 pt-8">
            <p>&copy; 2024 Boniface Dennis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </section>
  );
}
