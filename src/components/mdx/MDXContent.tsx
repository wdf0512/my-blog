'use client';

import * as runtime from 'react/jsx-runtime';
import { useMemo } from 'react';

type MDXContentProps = {
  code: string;
};

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMemo(() => {
    // The serialized MDX code is a function that:
    // 1. Takes runtime (jsx, jsxs, Fragment) as arguments[0]
    // 2. Returns an object with a 'default' property containing the component
    const fn = new Function(code);
    const result = fn(runtime);
    return result.default;
  }, [code]);

  // Render the component
  return <Component />;
}
