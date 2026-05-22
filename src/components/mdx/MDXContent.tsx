'use client';

import * as runtime from 'react/jsx-runtime';
import { useMemo, type ComponentType } from 'react';

type MDXComponents = Record<string, ComponentType<Record<string, unknown>>>;

type MDXContentProps = {
  code: string;
  components?: MDXComponents;
};

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMemo(() => {
    const fn = new Function(code);
    const result = fn(runtime);
    return result.default as ComponentType<{ components?: MDXComponents }>;
  }, [code]);

  return <Component components={components} />;
}
