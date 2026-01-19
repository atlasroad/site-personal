import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  Heading, 
  HeadingProvider, 
  H1, 
  H2, 
  H3, 
  H4, 
  H5, 
  H6,
  validateHeadingHierarchy 
} from '../ui/Heading';

describe('Heading Components', () => {
  describe('Basic Heading Component', () => {
    it('renders H1 with correct tag and default styles', () => {
      render(<H1>Test Heading</H1>);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Heading');
      expect(heading.tagName).toBe('H1');
      expect(heading).toHaveClass('text-4xl', 'md:text-6xl', 'lg:text-8xl', 'font-black', 'tracking-tight');
    });

    it('renders H2 with correct tag and default styles', () => {
      render(<H2>Test Heading</H2>);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Heading');
      expect(heading.tagName).toBe('H2');
      expect(heading).toHaveClass('text-3xl', 'md:text-5xl', 'lg:text-6xl', 'font-black');
    });

    it('renders H3 with correct tag and default styles', () => {
      render(<H3>Test Heading</H3>);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Heading');
      expect(heading.tagName).toBe('H3');
      expect(heading).toHaveClass('text-2xl', 'md:text-3xl', 'font-bold');
    });

    it('applies custom className alongside default styles', () => {
      render(<H1 className="text-red-500 custom-class">Test</H1>);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-red-500', 'custom-class');
      // Should still have default styles
      expect(heading).toHaveClass('font-black', 'tracking-tight');
    });

    it('applies id attribute correctly', () => {
      render(<H1 id="main-title">Test</H1>);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveAttribute('id', 'main-title');
    });
  });

  describe('HeadingProvider Context', () => {
    it('provides heading context to child components', () => {
      const TestComponent = () => {
        return (
          <HeadingProvider initialLevel={0}>
            <H1>Main Title</H1>
            <H2>Section Title</H2>
            <H3>Subsection Title</H3>
          </HeadingProvider>
        );
      };

      render(<TestComponent />);
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    it('warns about hierarchy violations in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const TestComponent = () => {
        return (
          <HeadingProvider initialLevel={0}>
            <H1>Main Title</H1>
            <H4>Skipped H2 and H3</H4>
          </HeadingProvider>
        );
      };

      render(<TestComponent />);
      
      // Should warn about jumping from H1 to H4
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Heading hierarchy violation')
      );
      
      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Heading Hierarchy Validation', () => {
    it('detects proper heading hierarchy', () => {
      const validStructure = (
        <div>
          <h1>Main Title</h1>
          <h2>Section</h2>
          <h3>Subsection</h3>
          <h2>Another Section</h2>
        </div>
      );

      const errors = validateHeadingHierarchy(validStructure);
      expect(errors).toHaveLength(0);
    });

    it('detects heading hierarchy violations', () => {
      const invalidStructure = (
        <div>
          <h1>Main Title</h1>
          <h4>Skipped H2 and H3</h4>
        </div>
      );

      const errors = validateHeadingHierarchy(invalidStructure);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('Heading hierarchy violation');
      expect(errors[0]).toContain('Found H4 after H1');
    });

    it('handles nested component structures', () => {
      const nestedStructure = (
        <div>
          <h1>Main</h1>
          <section>
            <h2>Section</h2>
            <article>
              <h3>Article</h3>
            </article>
          </section>
        </div>
      );

      const errors = validateHeadingHierarchy(nestedStructure);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Accessibility and SEO', () => {
    it('ensures only one H1 per page structure', () => {
      const pageStructure = (
        <div>
          <H1>Main Page Title</H1>
          <H2>Section 1</H2>
          <H3>Subsection 1.1</H3>
          <H2>Section 2</H2>
          <H3>Subsection 2.1</H3>
          <H4>Sub-subsection 2.1.1</H4>
        </div>
      );

      render(pageStructure);
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
      expect(h1Elements[0]).toHaveTextContent('Main Page Title');
    });

    it('maintains logical heading progression', () => {
      const logicalStructure = (
        <div>
          <H1>Main Title</H1>
          <H2>Section A</H2>
          <H3>Subsection A.1</H3>
          <H3>Subsection A.2</H3>
          <H2>Section B</H2>
          <H3>Subsection B.1</H3>
        </div>
      );

      render(logicalStructure);
      
      // Verify all heading levels are present and in correct order
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<H1></H1>);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toBeEmptyDOMElement();
    });

    it('handles complex children with nested elements', () => {
      render(
        <H1>
          <span>Complex</span> <strong>Heading</strong> <em>Content</em>
        </H1>
      );
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Complex Heading Content');
    });

    it('handles maximum heading level (H6)', () => {
      render(<H6>Deepest Level</H6>);
      
      const heading = screen.getByRole('heading', { level: 6 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H6');
      expect(heading).toHaveClass('text-base', 'md:text-lg', 'font-semibold');
    });
  });
});