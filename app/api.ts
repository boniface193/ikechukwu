// API service functions
export type Project = Record<string, unknown>;

export const projectService = {
  // Get all projects
  async getProjects() {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  // Get all projects
  async getProjectsById(id: string) {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  // Create new project
  async createProject(projectData: Project) {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  // Update project
  async updateProject(id: number, projectData: Project) {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  // Delete project
  async deleteProject(id: number) {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return response.json();
  },

  // Delete project
  async deleteExistingProject(imageUrl: string): Promise<void>  {
    // Get the image URL from formData using .get() method
    if (!imageUrl || !imageUrl.includes('cloudinary')) {
      throw new Error('No Cloudinary image to delete');
    }

    const response = await fetch(`/api/images?url=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete old image');
    }
    return response.json();
  },

  async uploadToCloudinary(formData: FormData): Promise<{ imageUrl: string }> {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }
};