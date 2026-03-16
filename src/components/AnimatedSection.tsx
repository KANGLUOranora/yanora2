import { ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-in';
  delay?: number;
  className?: string;
}

export default function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  className = ''
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const animationClass = {
    'fade-up': 'animate-fade-in-up',
    'fade-in': 'animate-fade-in',
    'fade-left': 'animate-fade-in-left',
    'fade-right': 'animate-fade-in-right',
    'scale-in': 'animate-scale-in'
  }[animation];

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animationClass : 'opacity-0'}`}
      style={{
        animationDelay: isVisible ? `${delay}ms` : '0ms'
      }}
    >
      {children}
    </div>
  );
}
