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

const beliefs = [
  { heading: 'Ship, then learn', body: 'Real feedback from production beats any amount of planning. I ship early and iterate fast.' },
  { heading: 'Build end-to-end', body: 'I own the whole stack — backend, API, frontend. Context collapse across layers is where the real problems live.' },
  { heading: 'Learn in public', body: 'Writing forces clarity. If I can\'t explain what I built, I don\'t fully understand it yet.' },
  { heading: 'AI is the craft', body: 'Not a tool I use — the thing I think about most. The models, the patterns, the failures, and where it\'s all going.' },
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
                I&apos;m a full-stack developer turned AI engineer, with experience
                shipping production LLM systems and complex enterprise web apps.
                I specialize in the full chain — from multi-agent backends with
                LangGraph to generative UI frontends in React.
              </p>
              <p>
                When I&apos;m not shipping code, I&apos;m exploring new AI frameworks,
                writing about what I&apos;ve learned, or working on a side project.
                I believe in learning in public and sharing knowledge freely.
              </p>
              <p>
                Currently building an AI-driven Agentic ERP system at Nuobinteng,
                architecting multi-agent workflows and Generative UI with SSE streaming.
              </p>
            </div>
          </div>

          {/* Beliefs */}
          <div>
            <h2 className="font-display text-3xl font-black mb-6 text-text-primary">
              What I believe
            </h2>
            <div className="flex flex-col gap-5">
              {beliefs.map((item) => (
                <div key={item.heading}>
                  <p className="text-sm font-semibold text-primary mb-1">{item.heading}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
