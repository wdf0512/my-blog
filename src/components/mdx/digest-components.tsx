'use client';

import {
  createContext,
  useContext,
  useRef,
  isValidElement,
  Children,
  type ReactNode,
  type ComponentType,
  type ReactElement,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
} from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SourceLink } from '@/components/digest/SourceLink';

type CounterCtx = {
  itemCounter: { current: number };
  ordinalById: Map<string, number>;
  dropCapAfter: Set<string>;
};

const Ctx = createContext<CounterCtx | null>(null);

export function DigestProvider({ children }: { children: ReactNode }) {
  const itemCounter = useRef(0);
  const ordinalById = useRef<Map<string, number>>(new Map());
  const dropCapAfter = useRef<Set<string>>(new Set());
  return (
    <Ctx.Provider
      value={{
        itemCounter,
        ordinalById: ordinalById.current,
        dropCapAfter: dropCapAfter.current,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

function useCounters(): CounterCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('digest MDX components must be rendered inside <DigestProvider>');
  return c;
}

/** Walk children to find the first inner anchor-like element (if any).
 *  Matches both raw `<a>` and any element with an `href` prop (e.g. the
 *  MDX-mapped `<A>` override that wraps each link in SourceLink). */
function findInnerAnchor(
  children: ReactNode,
): { anchor: ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>; tail: ReactNode[] } | null {
  const kids = Children.toArray(children);
  for (let i = 0; i < kids.length; i++) {
    const k = kids[i];
    if (!isValidElement(k)) continue;
    const props = k.props as { href?: string };
    const isAnchorLike = k.type === 'a' || typeof props?.href === 'string';
    if (isAnchorLike) {
      const tail = kids.slice(0, i).concat(kids.slice(i + 1));
      return {
        anchor: k as ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>,
        tail,
      };
    }
  }
  return null;
}

function H2({ children, id, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const { itemCounter, ordinalById } = useCounters();
  const key = id ?? '';
  let ordinal = ordinalById.get(key);
  if (ordinal === undefined) {
    itemCounter.current += 1;
    ordinal = itemCounter.current;
    ordinalById.set(key, ordinal);
  }

  const inner = findInnerAnchor(children);

  if (!inner) {
    return (
      <h2
        id={id}
        className="font-display text-2xl md:text-3xl font-black text-text-primary leading-snug mt-16 mb-4"
        {...props}
      >
        {children}
      </h2>
    );
  }

  const { anchor, tail } = inner;
  const linkHref = anchor.props.href ?? '#';
  const linkChildren = anchor.props.children;
  const titleText =
    typeof linkChildren === 'string'
      ? linkChildren
      : Children.toArray(linkChildren).join(' ');

  const isExternal = /^https?:\/\//i.test(linkHref);

  return (
    <h2
      id={id}
      data-title={titleText}
      data-ordinal={ordinal}
      className="digest-item-heading group relative mt-20 mb-5 scroll-mt-24"
      {...props}
    >
      <span className="block digest-mono-eyebrow text-primary mb-3">
        № {String(ordinal).padStart(2, '0')}
      </span>
      <a
        href={linkHref}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="font-display text-2xl md:text-3xl font-black text-text-primary leading-[1.15] hover:text-primary transition-colors inline-flex items-start gap-2 group/title"
      >
        <span>{linkChildren}</span>
        {isExternal && (
          <ArrowUpRight
            aria-hidden="true"
            className="w-5 h-5 mt-1 text-text-muted group-hover/title:text-primary group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 transition-all shrink-0"
          />
        )}
      </a>
      {tail.length > 0 && (
        <span className="font-mono text-sm text-text-muted ml-2">{tail}</span>
      )}
    </h2>
  );
}

function P({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className="text-base md:text-lg leading-[1.75] text-text-primary my-5"
      {...props}
    >
      {children}
    </p>
  );
}

function Blockquote({ children }: HTMLAttributes<HTMLQuoteElement>) {
  return <blockquote className="digest-pull-quote">{children}</blockquote>;
}

function Hr() {
  return (
    <div className="digest-ornament" aria-hidden="true">
      ✦
    </div>
  );
}

function A({ href = '#', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  // Internal anchors and TOC links: render plain
  if (href.startsWith('#') || href.startsWith('/')) {
    return (
      <a href={href} className="text-primary hover:underline" {...props}>
        {children}
      </a>
    );
  }
  return <SourceLink href={href}>{children}</SourceLink>;
}

function Ul({ children }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className="my-5 pl-6 space-y-2 [&>li]:relative [&>li]:pl-3 [&>li]:text-text-primary [&>li]:leading-relaxed [&>li]:before:content-['—'] [&>li]:before:absolute [&>li]:before:-left-3 [&>li]:before:text-primary [&>li]:before:font-mono">
      {children}
    </ul>
  );
}

function Ol({ children }: HTMLAttributes<HTMLOListElement>) {
  return (
    <ol className="my-5 pl-8 space-y-2 list-decimal marker:font-mono marker:text-primary marker:text-sm [&>li]:text-text-primary [&>li]:leading-relaxed [&>li]:pl-1">
      {children}
    </ol>
  );
}

function Strong({ children }: HTMLAttributes<HTMLElement>) {
  return <strong className="font-bold text-text-primary">{children}</strong>;
}

function Em({ children }: HTMLAttributes<HTMLElement>) {
  return <em className="italic text-text-secondary">{children}</em>;
}

export const digestComponents: Record<string, ComponentType<Record<string, unknown>>> = {
  h2: H2 as ComponentType<Record<string, unknown>>,
  p: P as ComponentType<Record<string, unknown>>,
  blockquote: Blockquote as ComponentType<Record<string, unknown>>,
  hr: Hr as ComponentType<Record<string, unknown>>,
  a: A as ComponentType<Record<string, unknown>>,
  ul: Ul as ComponentType<Record<string, unknown>>,
  ol: Ol as ComponentType<Record<string, unknown>>,
  strong: Strong as ComponentType<Record<string, unknown>>,
  em: Em as ComponentType<Record<string, unknown>>,
};
