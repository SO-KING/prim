import { ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export default function AnimatedSection({ children, className = '', delay = 0, direction = 'up' }: Props) {
  const { ref, isVisible } = useScrollReveal();

  const directionClasses: Record<string, string> = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: '-translate-x-8',
    right: 'translate-x-8',
    fade: 'translate-y-0',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${directionClasses[direction]} ${isVisible ? 'opacity-100 translate-y-0 translate-x-0' : 'opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
