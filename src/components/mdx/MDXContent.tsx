'use client';

import * as runtime from 'react/jsx-runtime';
import { useMemo, createElement } from 'react';

type MDXContentProps = {
  code: string;
};

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMemo(() => {
    // The serialized MDX code is a function that:
    // 1. Takes runtime (jsx, jsxs, Fragment) as arguments[0]
    // 2. Returns the MDXContent component function
    const fn = new Function(code);
    return fn(runtime);
  }, [code]);

  // Use createElement to render the component
  return createElement(Component);
}
