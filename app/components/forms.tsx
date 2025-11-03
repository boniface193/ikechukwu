'use client'

import Image from "next/image";
import { useRef, useState } from "react";
import { projectService } from "../api";

// Project form component
interface Project {
  title?: string;
  description?: string;
  category?: string;
  image?: string;
  overview?: string;
  role?: string;
  tasks?: string[];
  achievements?: string[];
  technologies?: string[];
  challenges?: string[];
  solutions?: string[];
  liveUrl?: string;
  githubUrl?: string;
  slug?: string;
}

// Check if admin features should be enabled
const isAdminEnabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true';

export default function ProjectForm({
  project,
  onSave,
  onCancel,
  isEditing
}: {
  project?: Project;
  onSave: (project: Project) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}) {

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || 'Full Stack',
    image: project?.image || '',
    overview: project?.overview || '',
    role: project?.role || '',
    tasks: project?.tasks?.join(', ') || '',
    achievements: project?.achievements?.join(', ') || '',
    technologies: project?.technologies?.join(', ') || '',
    challenges: project?.challenges?.join(', ') || '',
    solutions: project?.solutions?.join(', ') || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || ''
  });

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(project?.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdminEnabled) return null;

  interface FormDataType {
    title: string;
    description: string;
    category: string;
    image: string;
    overview: string;
    role: string;
    tasks: string;
    achievements: string;
    technologies: string;
    challenges: string;
    solutions: string;
    liveUrl: string;
    githubUrl: string;
  }

  interface ProjectDataType extends Omit<FormDataType, 'tasks' | 'achievements' | 'technologies' | 'challenges' | 'solutions'> {
    tasks: string[];
    achievements: string[];
    technologies: string[];
    challenges: string[];
    solutions: string[];
  }

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // If there's an existing Cloudinary image, delete it first
      if (formData.image && formData.image.includes('cloudinary')) {
        try {
          await projectService.deleteExistingProject(formData.image);
          console.log('Old image deleted successfully');
        } catch (error) {
          console.error('Error deleting old image:', error);
          // Continue with upload even if deletion fails
        }
      }

      // Create FormData for the new upload
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      // Upload new image
      const result = await projectService.uploadToCloudinary(uploadFormData);

      // Update form data with Cloudinary URL
      setFormData(prev => ({
        ...prev,
        image: result.imageUrl
      }));

      setPreviewUrl(result.imageUrl);

    } catch (error) {
      alert('Failed to upload image: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const handleRemoveImage = async () => {
    // If there's an existing image from Cloudinary, delete it
    if (formData.image && formData.image.includes('cloudinary')) {
      try {
        await projectService.deleteExistingProject(formData.image);
        console.log('Old image deleted successfully');
      } catch (error) {
        console.error('Error deleting old image:', error);
        // Continue with removal even if deletion fails
      }
    }

    setFormData(prev => ({ ...prev, image: '' }));
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const projectData: ProjectDataType = {
        ...formData,
        tasks: formData.tasks.split(',').map(task => task.trim()).filter(task => task),
        achievements: formData.achievements.split(',').map(achievement => achievement.trim()).filter(achievement => achievement),
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        challenges: formData.challenges.split(',').map(challenge => challenge.trim()).filter(challenge => challenge),
        solutions: formData.solutions.split(',').map(solution => solution.trim()).filter(solution => solution)
      };

      await onSave(projectData);
    } catch (error: unknown) {
      alert('Error saving project: ' + (error as Error).message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-700">
        <h3 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Project' : 'Add New Project'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Image
            </label>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mb-4 relative">
                <div className="w-full h-48 relative rounded-lg overflow-hidden border">
                  <Image
                    src={previewUrl}
                    alt="Project preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            )}

            {/* Upload Controls */}
            <div className="flex items-center gap-4">
              <label className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer text-center">
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span className="text-gray-600">Uploading...</span>
                    </div>
                  ) : (
                    <span className="text-gray-600">
                      {previewUrl ? 'Change Image' : 'Choose Image'}
                    </span>
                  )}
                </div>
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Recommended: 1200×630px, max 5MB. Supports JPG, PNG, WebP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Mobile">Mobile</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tasks (comma separated)</label>
            <textarea
              name="tasks"
              value={formData.tasks}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Achievements (comma separated)</label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Challenges (comma separated)</label>
            <textarea
              name="challenges"
              value={formData.challenges}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Solutions (comma separated)</label>
            <textarea
              name="solutions"
              value={formData.solutions}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
              <input
                type="url"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 cursor-pointer bg-linear-to-r from-purple-600 to-purple-800 text-white py-2.5 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all font-medium"
            >
              {isEditing ? 'Update Project' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border cursor-pointer border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}