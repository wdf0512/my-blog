'use client';

import { Code2, Rocket, Coffee, Users } from 'lucide-react';

const stats = [
  {
    icon: Code2,
    value: '5+',
    label: 'Years Coding',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Rocket,
    value: '10+',
    label: 'Projects Built',
    color: 'bg-blue/10 text-blue',
  },
  {
    icon: Coffee,
    value: '∞',
    label: 'Cups of Coffee',
    color: 'bg-brown/10 text-brown',
  },
  {
    icon: Users,
    value: '1K+',
    label: 'Blog Readers',
    color: 'bg-primary/10 text-primary',
  },
];

const skills = [
  'React & Next.js',
  'TypeScript',
  'Node.js',
  'Three.js & WebGL',
  'Tailwind CSS',
  'PostgreSQL',
  'AI/ML Integration',
  'Cloud Deployment',
];

export function AboutSection() {
  return (
    <section className="bg-surface py-16 md:py-20 border-t border-b border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="text-center p-6 bg-background rounded-2xl border border-border"
              >
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-display text-3xl font-black text-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* About & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* About */}
          <div>
            <h2 className="font-display text-3xl font-black mb-4 text-text-primary">
              About Me
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                I'm a self-taught developer who fell in love with coding back in 2019.
                What started as a curiosity turned into a career building web applications
                and exploring creative technology.
              </p>
              <p>
                When I'm not coding, you'll find me experimenting with 3D graphics,
                writing about my experiences, or working on my next side project.
                I believe in learning in public and sharing knowledge with the community.
              </p>
              <p>
                Currently focused on building AI-powered web tools and exploring the
                intersection of design and development.
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="font-display text-3xl font-black mb-4 text-text-primary">
              Tech Stack
            </h2>
            <p className="text-text-secondary mb-6">
              Technologies and tools I work with regularly:
            </p>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-background rounded-xl border border-border text-sm font-medium text-text-primary hover:border-primary hover:bg-primary/5 transition-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
