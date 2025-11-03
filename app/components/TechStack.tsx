// components/TechStack.tsx
'use client';

import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiAmazon,
  SiDocker,
  SiGit,
  SiTypescript,
  SiTailwindcss,
  SiJest,
  SiVuedotjs,
  SiNuxtdotjs
} from 'react-icons/si';

const TechStack = () => {
  const technologies = [
    {
      category: 'Frontend',
      color: 'from-blue-500 to-blue-600',
      tech: [
        { name: 'React', icon: SiReact, level: 'Advanced' },
        { name: 'Vue', icon: SiVuedotjs, level: 'Advanced' },
        { name: 'Next.js', icon: SiNextdotjs, level: 'Advanced' },
        { name: 'Nuxt.js', icon: SiNuxtdotjs, level: 'Advanced' },
        { name: 'TypeScript', icon: SiTypescript, level: 'Advanced' },
        { name: 'Tailwind CSS', icon: SiTailwindcss, level: 'Expert' }
      ]
    },
    {
      category: 'Backend',
      color: 'from-green-500 to-green-600',
      tech: [
        { name: 'Node.js', icon: SiNodedotjs, level: 'Advanced' },
        { name: 'Express.js', icon: SiExpress, level: 'Advanced' },
        { name: 'MongoDB', icon: SiMongodb, level: 'Advanced' },
        { name: 'PostgreSQL', icon: SiPostgresql, level: 'Intermediate' }
      ]
    },
    {
      category: 'DevOps & Tools',
      color: 'from-purple-500 to-purple-600',
      tech: [
        { name: 'AWS', icon: SiAmazon, level: 'Intermediate' },
        { name: 'Docker', icon: SiDocker, level: 'Intermediate' },
        { name: 'Redis', icon: SiRedis, level: 'Intermediate' },
        { name: 'Git', icon: SiGit, level: 'Expert' },
        { name: 'Jest', icon: SiJest, level: 'Advanced' }
      ]
    }
  ];

  return (
    <section className="py-36 bg-white px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Technology Stack
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Modern tools and technologies I use to build scalable, performant applications
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {technologies.map((category) => (
            <div key={category.category} className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 shadow-2xl shadow-purple-100 border border-gray-200">
              <h3 className={`text-2xl font-bold bg-linear-to-r ${category.color} bg-clip-text text-transparent mb-6`}>
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.tech.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <div key={tech.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-gray-700" />
                        <span className="font-semibold text-gray-800">{tech.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-500">{tech.level}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;