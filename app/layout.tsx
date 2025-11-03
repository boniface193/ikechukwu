'use client';

import "../app/globals.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import ProjectForm from "./components/forms";
import { projectService } from "./api";

// Check if admin features should be enabled
const isAdminEnabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true';

// Define the complete Project interface
interface Project {
  id?: number;
  title: string;
  description: string;
  category: string;
  image: string;
  slug: string;
  overview?: string;
  role?: string;
  tasks?: string[];
  achievements?: string[];
  technologies?: string[];
  challenges?: string[];
  solutions?: string[];
  liveUrl?: string;
  githubUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projectsData = await projectService.getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    fetchProjects();
  }, []);

  // Payload for creating a new project (id is assigned by backend)
  const handleCreateProject = async (projectData: Project) => {
    try {
      await projectService.createProject(projectData);
      // Refresh projects after creation
      const updatedProjects = await projectService.getProjects();
      setProjects(updatedProjects);
      setShowProjectForm(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <html lang="en">
      <body>
        <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-purple-100">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className='text-center items-center flex'>
                <div className="w-9 h-9 rounded-full bg-linear-to-r from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold mr-2">B</div>
                <span className='text-purple-700 font-semibold text-lg'>Boniface</span>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="w-6 h-0.5 bg-purple-700 mb-1.5 transition-transform"></div>
                <div className="w-6 h-0.5 bg-purple-700 mb-1.5 transition-transform"></div>
                <div className="w-6 h-0.5 bg-purple-700 transition-transform"></div>
              </button>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8 font-medium items-center">
                <div className="relative group inline-block">
                  <button className="text-purple-700 hover:text-purple-800 transition-colors font-medium flex items-center gap-1" type="button">
                    Projects Built
                    <svg
                      className="w-4 h-4 text-purple-600 group-hover:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown content */}
                  <div className="z-10 absolute hidden group-hover:block bg-white divide-y divide-purple-100 rounded-lg shadow-lg border border-purple-100 w-48">
                    <ul className="py-2">
                      {projects.map((project) => (
                        <li key={project.id}>
                          <Link
                            href={`/projects/${project.slug}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                          >
                            {project.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {isAdminEnabled && (
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="flex items-center cursor-pointer gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    <FaPlus className="text-sm" />
                    Add Project
                  </button>
                )}

                <a
                  target='_blank'
                  href={'https://calendar.app.google/YYTsWAG1DYR3u1bZ6'}
                  className="hover:bg-purple-700 bg-linear-to-r from-purple-600 to-purple-800 flex items-center justify-center text-white rounded-lg px-6 py-2.5 transition-all hover:shadow-lg"
                >
                  Contact Me
                </a>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-purple-100">
                <div className="flex flex-col space-y-4 pt-4">
                  <div className="space-y-2">
                    <span className="text-purple-700 font-medium">Projects Built</span>
                    {projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="block px-2 py-1 text-gray-600 hover:text-purple-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {project.title}
                      </Link>
                    ))}
                  </div>

                  {isAdminEnabled && (
                    <button
                      onClick={() => {
                        setShowProjectForm(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center cursor-pointer justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      <FaPlus className="text-sm" />
                      Add Project
                    </button>
                  )}

                  <a
                    target='_blank'
                    href={'https://calendar.app.google/YYTsWAG1DYR3u1bZ6'}
                    className="hover:bg-purple-700 bg-linear-to-r from-purple-600 to-purple-800 flex items-center justify-center text-white rounded-lg px-4 py-2 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Me
                  </a>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Project Forms */}
        {showProjectForm && (
          <ProjectForm
            onSave={handleCreateProject}
            onCancel={() => setShowProjectForm(false)}
            isEditing={false}
            project={undefined}
          />
        )}

        {children}
      </body>
    </html>
  );
}