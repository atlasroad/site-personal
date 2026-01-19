'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Context to track heading hierarchy
interface HeadingContextType {
  level: number;
  registerHeading: (level: number) => void;
}

const HeadingContext = createContext<HeadingContextType>({
  level: 0,
  registerHeading: () => {},
});

// Provider component to manage heading hierarchy
interface HeadingProviderProps {
  children: ReactNode;
  initialLevel?: number;
}

export function HeadingProvider({ children, initialLevel = 0 }: HeadingProviderProps) {
  const [currentLevel, setCurrentLevel] = React.useState(initialLevel);

  const registerHeading = React.useCallback((level: number) => {
    if (process.env.NODE_ENV === 'development') {
      // Validate heading hierarchy in development
      if (level > currentLevel + 1) {
        console.warn(
          `Heading hierarchy violation: Jumping from H${currentLevel} to H${level}. ` +
          `Consider using H${currentLevel + 1} instead.`
        );
      }
    }
    setCurrentLevel(level);
  }, [currentLevel]);

  return (
    <HeadingContext.Provider value={{ level: currentLevel, registerHeading }}>
      {children}
    </HeadingContext.Provider>
  );
}

// Hook to use heading context
export function useHeadingContext() {
  return useContext(HeadingContext);
}

// Main Heading component with automatic validation
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  id?: string;
  autoLevel?: boolean; // Automatically determine level based on context
}

export function Heading({ 
  level, 
  children, 
  className, 
  id,
  autoLevel = false 
}: HeadingProps) {
  const { level: contextLevel, registerHeading } = useHeadingContext();
  
  // Determine the actual level to use
  const actualLevel = autoLevel ? Math.min(contextLevel + 1, 6) : level;
  
  React.useEffect(() => {
    registerHeading(actualLevel);
  }, [actualLevel, registerHeading]);

  // Create the appropriate heading element
  const HeadingTag = `h${actualLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  // Default styles for each heading level
  const defaultStyles = {
    1: 'text-4xl md:text-6xl lg:text-8xl font-black tracking-tight',
    2: 'text-3xl md:text-5xl lg:text-6xl font-black',
    3: 'text-2xl md:text-3xl font-bold',
    4: 'text-xl md:text-2xl font-bold',
    5: 'text-lg md:text-xl font-semibold',
    6: 'text-base md:text-lg font-semibold',
  };

  return (
    <HeadingTag
      id={id}
      className={cn(
        defaultStyles[actualLevel as keyof typeof defaultStyles],
        className
      )}
    >
      {children}
    </HeadingTag>
  );
}

// Convenience components for each heading level
export function H1(props: Omit<HeadingProps, 'level'>) {
  return <Heading level={1} {...props} />;
}

export function H2(props: Omit<HeadingProps, 'level'>) {
  return <Heading level={2} {...props} />;
}

export function H3(props: Omit<HeadingProps, 'level'>) {
  return <Heading level={3} {...props} />;
}

export function H4(props: Omit<HeadingProps, 'level'>) {
  return <Heading level={4} {...props} />;
}

export function H5(props: Omit<HeadingProps, 'level'>) {
  return <Heading level={5} {...props} />;
}

export function H6(props: Omit<HeadingProps, 'level'>) {
  return <Heading level={6} {...props} />;
}

// Utility function to validate heading hierarchy in a component tree
export function validateHeadingHierarchy(element: ReactNode): string[] {
  const errors: string[] = [];
  let lastLevel = 0;

  function traverse(node: ReactNode): void {
    if (React.isValidElement(node)) {
      // Check if it's a heading element
      if (typeof node.type === 'string' && /^h[1-6]$/.test(node.type)) {
        const level = parseInt(node.type.charAt(1));
        
        if (level > lastLevel + 1) {
          errors.push(
            `Heading hierarchy violation: Found ${node.type.toUpperCase()} after H${lastLevel}. ` +
            `Consider using H${lastLevel + 1} instead.`
          );
        }
        
        lastLevel = level;
      }

      // Recursively check children
      const props = node.props as { children?: ReactNode };
      if (props && props.children) {
        React.Children.forEach(props.children, traverse);
      }
    }
  }

  traverse(element);
  return errors;
}

// Hook for runtime heading validation
export function useHeadingValidation(enabled = process.env.NODE_ENV === 'development') {
  const validate = React.useCallback((element: ReactNode) => {
    if (!enabled) return [];
    return validateHeadingHierarchy(element);
  }, [enabled]);

  return { validate };
}