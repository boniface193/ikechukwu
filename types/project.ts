export interface Project {
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