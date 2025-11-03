import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

const projectsFilePath = path.join(process.cwd(), 'data', 'projects.json');

async function readProjects() {
  try {
    // Check if directory exists, if not create it
    try {
      await fs.access(path.dirname(projectsFilePath));
    } catch {
      await fs.mkdir(path.dirname(projectsFilePath), { recursive: true });
    }

    // Check if file exists, if not create it with empty array
    try {
      await fs.access(projectsFilePath);
      const data = await fs.readFile(projectsFilePath, 'utf8');
      return JSON.parse(data);
    } catch {
      const initialData: never[] = [];
      await fs.writeFile(projectsFilePath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

interface Project {
  id: number;
  title: string;
  description: string;
  updatedAt?: string;
  // Add other project properties as needed
}

async function writeProjects(projects: Project[]): Promise<void> {
  await fs.mkdir(path.dirname(projectsFilePath), { recursive: true });
  await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2));
}

// GET single project by ID
export async function GET(request: Request, { params: { id } }: { params: { id: string } }): Promise<NextResponse> {
  try {

    const projects: Project[] = await readProjects();
    const { id } = await params;
    const project: Project | undefined = projects.find(p => p.id === parseInt(id));

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT update project
export async function PUT(request: Request, { params: { id } }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const updateData: Partial<Project> = await request.json();
    const projects: Project[] = await readProjects();
    const { id } = await params;
    const projectIndex: number = projects.findIndex(p => p.id === parseInt(id));

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Store old image for potential deletion
    const oldImage = projects[projectIndex]?.image;

    // Update project
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Delete old image if it was changed and was a Cloudinary image
    if (oldImage && oldImage !== projects[projectIndex]?.image && oldImage.includes('cloudinary')) {
      try {
        const publicId = getPublicIdFromUrl(oldImage);
        if (publicId) {
          await deleteImage(publicId);
          console.log('Deleted old image:', publicId);
        }
      } catch (error) {
        console.error('Error deleting old image:', error);
        // Don't fail the entire update if image deletion fails
      }
    }

    await writeProjects(projects);
    return NextResponse.json(projects[projectIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project ' },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(request: Request, { params: { id } }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const projects: Project[] = await readProjects();
    const { id } = await params;
    const projectIndex: number = projects.findIndex(p => p.id === parseInt(id));

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const deletedProject: Project = projects.splice(projectIndex, 1)[0];

    // Delete associated image from Cloudinary if it exists
    if (deletedProject?.image && deletedProject?.image.includes('cloudinary')) {
      try {
        const publicId = getPublicIdFromUrl(deletedProject?.image);
        if (publicId) {
          await deleteImage(publicId);
          console.log('Deleted project image:', publicId);
        }
      } catch (error) {
        console.error('Error deleting project image:', error);
        // Don't fail the entire deletion if image deletion fails
      }
    }

    await writeProjects(projects);

    return NextResponse.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}