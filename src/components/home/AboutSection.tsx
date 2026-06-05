'use client';

import { useRef } from 'react';
import { Code2, Rocket, Coffee, Users } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { CodeEditor } from './CodeEditor/CodeEditor';

const stats = [
  { icon: Code2,  value: '5+',   label: 'Years Coding',    color: 'bg-primary/10 text-primary' },
  { icon: Rocket, value: '10+',  label: 'Projects Built',  color: 'bg-blue/10 text-blue' },
  { icon: Coffee, value: '∞',    label: 'Cups of Coffee',  color: 'bg-brown/10 text-brown' },
  { icon: Users,  value: '1K+',  label: 'Blog Readers',    color: 'bg-primary/10 text-primary' },
];


function StatCounter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useCountUp(ref, value);
  return (
    <div ref={ref} className={className}>
      {value}
    </div>
  );
}

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
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <StatCounter
                  value={stat.value}
                  className="font-display text-3xl font-black text-text-primary mb-1"
                />
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* About & beliefs, rendered as code */}
        <CodeEditor />
      </div>
    </section>
  );
}
