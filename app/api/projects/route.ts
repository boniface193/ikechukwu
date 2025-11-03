import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Path to your projects data file
const projectsFilePath = path.join(process.cwd(), 'data', 'projects.json');

// Helper function to read projects from file
async function readProjects() {
  try {

    const data = await fs.readFile(projectsFilePath, 'utf8');
    const projects = JSON.parse(data);

    // Reverse the array to show most recent projects first
    return projects;
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Helper function to write projects to file
interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image?: string;
  slug: string;
  overview?: string;
  role?: string;
  tasks?: string[];
  achievements?: string[];
  challenges?: string[];
  solutions?: string[];
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
}

async function writeProjects(projects: Project[]): Promise<void> {
  await fs.mkdir(path.dirname(projectsFilePath), { recursive: true });
  await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2));
}

// GET all projects
export async function GET() {
  try {
    const projects = await readProjects();
    return NextResponse.json(projects.reverse());
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST new project
export async function POST(request: Request): Promise<NextResponse> {
  interface NewProjectData {
    title: string;
    description: string;
    category: string;
    image?: string;
    slug?: string;
    overview?: string;
    role?: string;
    tasks?: string[];
    achievements?: string[];
    challenges?: string[];
    solutions?: string[];
    technologies?: string[];
    liveUrl?: string;
    githubUrl?: string;
  }

  try {
    const projectData = (await request.json()) as Partial<NewProjectData>;

    // Validate required fields
    const requiredFields: (keyof NewProjectData)[] = ['title', 'description', 'category'];
    const missingFields = requiredFields.filter(field => !projectData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const projects: Project[] = (await readProjects()) as Project[];

    // Create new project with ID and slug
    const newProject: Project = {
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      title: projectData.title as string,
      description: projectData.description as string,
      category: projectData.category as string,
      image: projectData.image || '/portfolio-default.jpg',
      slug:
        projectData.slug ||
        (projectData.title || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-'),
      overview: projectData.overview || '',
      role: projectData.role || '',
      tasks: projectData.tasks || [],
      achievements: projectData.achievements || [],
      challenges: projectData.challenges || [],
      solutions: projectData.solutions || [],
      technologies: projectData.technologies || [],
      liveUrl: projectData.liveUrl || '',
      githubUrl: projectData.githubUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    await writeProjects(projects);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}