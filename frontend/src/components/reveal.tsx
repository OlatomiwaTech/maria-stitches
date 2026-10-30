'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    element.dataset.revealState = 'hidden';
    element.style.setProperty('--reveal-delay', `${Math.min(delay, 280)}ms`);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.revealState = 'visible';
      observer.unobserve(element);
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  return <div className="motion-reveal" ref={ref}>{children}</div>;
}
