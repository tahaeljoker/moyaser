import { useEffect, useRef, useState } from 'react';

export default function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.05,
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsVisible(true);
      return;
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: '0px 0px 50px 0px' }
    );

    observer.observe(node);

    // Fallback: guarantee visibility even if observer never fires
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [threshold]);

  const transformStyle = direction === 'up'
    ? (isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')
    : (isVisible ? 'opacity-100' : 'opacity-0');

  return (
    <Tag
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`transition-all ${transformStyle} ${className}`}
    >
      {children}
    </Tag>
  );
}
