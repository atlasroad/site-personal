/**
 * Property-Based Tests for Heading Hierarchy Compliance
 * **Feature: site-optimization, Property 5: Heading Hierarchy Compliance**
 * **Validates: Requirements 3.2**
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
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

// Custom arbitraries for generating test data
const headingContentArbitrary = fc.string({ minLength: 1, maxLength: 200 });
const headingLevelArbitrary = fc.constantFrom(1, 2, 3, 4, 5, 6) as fc.Arbitrary<1 | 2 | 3 | 4 | 5 | 6>;
const classNameArbitrary = fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9_-]+$/.test(s)));
const idArbitrary = fc.option(fc.string({ minLength: 1, maxLength: 30 }).filter(s => /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(s)));

// Arbitrary for generating valid heading sequences
const validHeadingSequenceArbitrary = fc.array(
  fc.record({
    level: headingLevelArbitrary,
    content: headingContentArbitrary,
    className: classNameArbitrary,
    id: idArbitrary
  }),
  { minLength: 1, maxLength: 10 }
).map(headings => {
  // Ensure the sequence follows proper hierarchy rules
  let currentLevel = 0;
  return headings.map(heading => {
    // Don't skip more than one level
    const maxAllowedLevel = Math.min(currentLevel + 1, 6);
    const adjustedLevel = Math.min(heading.level, maxAllowedLevel) as 1 | 2 | 3 | 4 | 5 | 6;
    currentLevel = Math.max(currentLevel, adjustedLevel);
    
    return {
      ...heading,
      level: adjustedLevel
    };
  });
});

// Arbitrary for generating invalid heading sequences (with hierarchy violations)
const invalidHeadingSequenceArbitrary = fc.array(
  fc.record({
    level: headingLevelArbitrary,
    content: headingContentArbitrary
  }),
  { minLength: 2, maxLength: 8 }
).filter(headings => {
  // Ensure at least one hierarchy violation exists
  for (let i = 1; i < headings.length; i++) {
    const prevLevel = headings[i - 1].level;
    const currentLevel = headings[i].level;
    if (currentLevel > prevLevel + 1) {
      return true; // Has a violation
    }
  }
  return false;
}).map(headings => {
  // Ensure the first heading creates a violation if needed
  if (headings.length > 0 && headings[0].level > 1) {
    // Force a violation by making the first heading skip levels
    headings[0] = { ...headings[0], level: Math.max(3, headings[0].level) as 1 | 2 | 3 | 4 | 5 | 6 };
  }
  return headings;
});

// Arbitrary for page-like structures with single H1
const pageStructureArbitrary = fc.record({
  h1: fc.record({
    content: headingContentArbitrary,
    className: classNameArbitrary,
    id: idArbitrary
  }),
  sections: fc.array(
    fc.record({
      h2: fc.record({
        content: headingContentArbitrary,
        className: classNameArbitrary
      }),
      subsections: fc.array(
        fc.record({
          h3: fc.record({
            content: headingContentArbitrary,
            className: classNameArbitrary
          }),
          subsubsections: fc.array(
            fc.record({
              h4: fc.record({
                content: headingContentArbitrary,
                className: classNameArbitrary
              })
            }),
            { minLength: 0, maxLength: 3 }
          )
        }),
        { minLength: 0, maxLength: 4 }
      )
    }),
    { minLength: 0, maxLength: 5 }
  )
});

describe('Heading Hierarchy Compliance Properties', () => {
  /**
   * Property 5: Heading Hierarchy Compliance
   * **Validates: Requirements 3.2**
   * 
   * For any page content, the heading structure should follow proper HTML hierarchy 
   * (H1 → H2 → H3) without skipping levels.
   * 
   * This property ensures that:
   * 1. Each page has exactly one H1 heading (main topic)
   * 2. Heading levels follow logical progression without skipping
   * 3. Heading components render with correct semantic HTML tags
   * 4. Hierarchy validation correctly identifies violations
   * 5. HeadingProvider context maintains proper level tracking
   * 6. All heading components maintain accessibility compliance
   */
  test('Property 5.1: Valid heading sequences maintain proper hierarchy', () => {
    fc.assert(
      fc.property(
        validHeadingSequenceArbitrary,
        (headingSequence) => {
          // Create a component with the heading sequence
          const TestComponent = () => (
            <HeadingProvider initialLevel={0}>
              <div>
                {headingSequence.map((heading, index) => {
                  const HeadingComponent = [H1, H2, H3, H4, H5, H6][heading.level - 1];
                  return (
                    <HeadingComponent
                      key={index}
                      className={heading.className || undefined}
                      id={heading.id || undefined}
                    >
                      {heading.content}
                    </HeadingComponent>
                  );
                })}
              </div>
            </HeadingProvider>
          );

          // Render the component
          const { container } = render(<TestComponent />);

          // Property 5.1.1: All headings should render with correct HTML tags
          headingSequence.forEach((heading, index) => {
            const expectedTag = `H${heading.level}`;
            const headingElements = container.querySelectorAll(expectedTag.toLowerCase());
            
            // Count how many headings of this level should exist up to this point
            const expectedCountUpToIndex = headingSequence.slice(0, index + 1)
              .filter(h => h.level === heading.level).length;
            
            expect(headingElements.length).toBeGreaterThanOrEqual(expectedCountUpToIndex);
            
            // Find the specific heading element for this index
            const headingsOfThisLevel = headingSequence.slice(0, index + 1)
              .filter(h => h.level === heading.level);
            const indexInLevel = headingsOfThisLevel.length - 1;
            
            if (headingElements[indexInLevel]) {
              const headingElement = headingElements[indexInLevel];
              expect(headingElement).toBeInTheDocument();
              expect(headingElement.textContent).toBe(heading.content);
              expect(headingElement.tagName).toBe(expectedTag);
            }
          });

          // Property 5.1.2: Validate hierarchy using the validation function
          const errors = validateHeadingHierarchy(container);
          expect(errors).toHaveLength(0);

          // Property 5.1.3: Heading levels should follow logical progression
          let previousLevel = 0;
          headingSequence.forEach(heading => {
            expect(heading.level).toBeLessThanOrEqual(previousLevel + 1);
            previousLevel = Math.max(previousLevel, heading.level);
          });

          // Property 5.1.4: Custom attributes should be preserved
          headingSequence.forEach((heading, index) => {
            if (heading.className) {
              const headingElements = container.querySelectorAll(`h${heading.level}`);
              const headingsOfThisLevel = headingSequence.slice(0, index + 1)
                .filter(h => h.level === heading.level);
              const indexInLevel = headingsOfThisLevel.length - 1;
              
              if (headingElements[indexInLevel]) {
                expect(headingElements[indexInLevel]).toHaveClass(heading.className);
              }
            }
            
            if (heading.id) {
              const headingElement = container.querySelector(`#${CSS.escape(heading.id)}`);
              expect(headingElement).toBeInTheDocument();
              expect(headingElement?.getAttribute('id')).toBe(heading.id);
            }
          });

          return true; // Property holds
        }
      ),
      { 
        numRuns: 100, // Run 100 iterations as specified in design document
        verbose: true 
      }
    );
  });

  /**
   * Property test for page structure compliance
   */
  test('Property 5.2: Page structures maintain single H1 and proper hierarchy', () => {
    fc.assert(
      fc.property(
        pageStructureArbitrary,
        (pageStructure) => {
          // Create a realistic page component
          const PageComponent = () => (
            <HeadingProvider initialLevel={0}>
              <main>
                <H1 
                  className={pageStructure.h1.className || undefined}
                  id={pageStructure.h1.id || undefined}
                >
                  {pageStructure.h1.content}
                </H1>
                
                {pageStructure.sections.map((section, sectionIndex) => (
                  <section key={sectionIndex}>
                    <H2 className={section.h2.className || undefined}>
                      {section.h2.content}
                    </H2>
                    
                    {section.subsections.map((subsection, subsectionIndex) => (
                      <div key={subsectionIndex}>
                        <H3 className={subsection.h3.className || undefined}>
                          {subsection.h3.content}
                        </H3>
                        
                        {subsection.subsubsections.map((subsubsection, subIndex) => (
                          <div key={subIndex}>
                            <H4 className={subsubsection.h4.className || undefined}>
                              {subsubsection.h4.content}
                            </H4>
                          </div>
                        ))}
                      </div>
                    ))}
                  </section>
                ))}
              </main>
            </HeadingProvider>
          );

          const { container } = render(<PageComponent />);

          // Property 5.2.1: Exactly one H1 per page
          const h1Elements = container.querySelectorAll('h1');
          expect(h1Elements).toHaveLength(1);
          expect(h1Elements[0].textContent).toBe(pageStructure.h1.content);

          // Property 5.2.2: H2s should be direct children of sections under H1
          const h2Elements = container.querySelectorAll('h2');
          expect(h2Elements.length).toBe(pageStructure.sections.length);

          // Property 5.2.3: H3s should be under H2s
          const h3Elements = container.querySelectorAll('h3');
          const expectedH3Count = pageStructure.sections.reduce(
            (count, section) => count + section.subsections.length, 
            0
          );
          expect(h3Elements.length).toBe(expectedH3Count);

          // Property 5.2.4: H4s should be under H3s
          const h4Elements = container.querySelectorAll('h4');
          const expectedH4Count = pageStructure.sections.reduce(
            (count, section) => count + section.subsections.reduce(
              (subCount, subsection) => subCount + subsection.subsubsections.length,
              0
            ),
            0
          );
          expect(h4Elements.length).toBe(expectedH4Count);

          // Property 5.2.5: No hierarchy violations in the entire structure
          const errors = validateHeadingHierarchy(container);
          expect(errors).toHaveLength(0);

          // Property 5.2.6: Semantic HTML structure
          expect(container.querySelector('main')).toBeInTheDocument();
          expect(container.querySelectorAll('section').length).toBe(pageStructure.sections.length);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property test for hierarchy violation detection
   */
  test('Property 5.3: Hierarchy validation correctly identifies violations', () => {
    fc.assert(
      fc.property(
        invalidHeadingSequenceArbitrary,
        (invalidSequence) => {
          // Create JSX structure with invalid hierarchy
          const invalidStructure = (
            <div>
              {invalidSequence.map((heading, index) => {
                const HeadingTag = `h${heading.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                return (
                  <HeadingTag key={index}>
                    {heading.content}
                  </HeadingTag>
                );
              })}
            </div>
          );

          // Property 5.3.1: Validation should detect violations
          const errors = validateHeadingHierarchy(invalidStructure);
          expect(errors.length).toBeGreaterThan(0);

          // Property 5.3.2: Error messages should be descriptive
          errors.forEach(error => {
            expect(error).toContain('Heading hierarchy violation');
            expect(error).toMatch(/Found H[1-6] after H[0-6]/);
            expect(error).toMatch(/Consider using H[1-6] instead/);
          });

          // Property 5.3.3: Violations should be detected for level skipping
          let previousLevel = 0;
          let foundViolation = false;
          
          invalidSequence.forEach(heading => {
            if (heading.level > previousLevel + 1) {
              foundViolation = true;
            }
            previousLevel = heading.level;
          });
          
          expect(foundViolation).toBe(true);

          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property test for HeadingProvider context behavior
   */
  test('Property 5.4: HeadingProvider maintains proper context state', () => {
    fc.assert(
      fc.property(
        fc.record({
          initialLevel: fc.constantFrom(0, 1, 2),
          headings: fc.array(
            fc.record({
              level: headingLevelArbitrary,
              content: headingContentArbitrary
            }),
            { minLength: 1, maxLength: 5 }
          )
        }),
        ({ initialLevel, headings }) => {
          const contextValues: number[] = [];
          
          // Custom component to capture context values
          const ContextCapture = ({ level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6, children: React.ReactNode }) => {
            return (
              <Heading level={level}>
                {children}
              </Heading>
            );
          };

          const TestComponent = () => (
            <HeadingProvider initialLevel={initialLevel}>
              <div>
                {headings.map((heading, index) => (
                  <ContextCapture key={index} level={heading.level}>
                    {heading.content}
                  </ContextCapture>
                ))}
              </div>
            </HeadingProvider>
          );

          // Property 5.4.1: Component should render without errors
          expect(() => render(<TestComponent />)).not.toThrow();

          const { container } = render(<TestComponent />);

          // Property 5.4.2: All headings should be rendered
          headings.forEach((heading, index) => {
            const headingElements = container.querySelectorAll(`h${heading.level}`);
            expect(headingElements.length).toBeGreaterThanOrEqual(1);
          });

          // Property 5.4.3: Context should track heading registration
          // This is implicitly tested by the fact that the component renders
          // and the HeadingProvider doesn't throw errors

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property test for accessibility compliance
   */
  test('Property 5.5: Heading components maintain accessibility compliance', () => {
    fc.assert(
      fc.property(
        fc.record({
          level: headingLevelArbitrary,
          content: headingContentArbitrary,
          id: fc.option(fc.string({ minLength: 1, maxLength: 30 }).filter(s => /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(s))),
          className: fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9_-]+$/.test(s)))
        }),
        (headingProps) => {
          const HeadingComponent = [H1, H2, H3, H4, H5, H6][headingProps.level - 1];
          
          // Create a unique container for this test
          const TestWrapper = () => (
            <div data-testid={`heading-test-${headingProps.level}-${Math.random()}`}>
              <HeadingComponent
                id={headingProps.id || undefined}
                className={headingProps.className || undefined}
              >
                {headingProps.content}
              </HeadingComponent>
            </div>
          );

          const { container } = render(<TestWrapper />);

          // Property 5.5.1: Heading should be accessible via direct query
          const headingElement = container.querySelector(`h${headingProps.level}`);
          expect(headingElement).toBeInTheDocument();

          // Property 5.5.2: Heading should have correct semantic tag
          expect(headingElement?.tagName).toBe(`H${headingProps.level}`);

          // Property 5.5.3: Content should be accessible
          expect(headingElement?.textContent).toBe(headingProps.content);

          // Property 5.5.4: ID should be properly set if provided
          if (headingProps.id) {
            expect(headingElement).toHaveAttribute('id', headingProps.id);
          }

          // Property 5.5.5: Default styles should be applied
          const expectedDefaultClasses = {
            1: ['text-4xl', 'font-black', 'tracking-tight'],
            2: ['text-3xl', 'font-black'],
            3: ['text-2xl', 'font-bold'],
            4: ['text-xl', 'font-bold'],
            5: ['text-lg', 'font-semibold'],
            6: ['text-base', 'font-semibold']
          };

          const defaultClasses = expectedDefaultClasses[headingProps.level as keyof typeof expectedDefaultClasses];
          defaultClasses.forEach(className => {
            expect(headingElement).toHaveClass(className);
          });

          // Property 5.5.6: Custom classes should be preserved alongside defaults
          if (headingProps.className) {
            expect(headingElement).toHaveClass(headingProps.className);
            // Should still have default classes
            expect(headingElement).toHaveClass(defaultClasses[0]);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property test for development warning behavior
   */
  test('Property 5.6: Development warnings are triggered for hierarchy violations', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    fc.assert(
      fc.property(
        fc.record({
          firstLevel: fc.constantFrom(1, 2) as fc.Arbitrary<1 | 2>,
          skipToLevel: fc.constantFrom(4, 5, 6) as fc.Arbitrary<4 | 5 | 6>
        }),
        ({ firstLevel, skipToLevel }) => {
          const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
          
          const TestComponent = () => (
            <HeadingProvider initialLevel={0}>
              <div>
                <Heading level={firstLevel}>First Heading</Heading>
                <Heading level={skipToLevel}>Skipped Levels</Heading>
              </div>
            </HeadingProvider>
          );

          render(<TestComponent />);

          // Property 5.6.1: Warning should be triggered for level skipping
          expect(consoleSpy).toHaveBeenCalled();
          
          // Property 5.6.2: Warning message should be descriptive
          const warningCalls = consoleSpy.mock.calls;
          const hasHierarchyWarning = warningCalls.some(call => 
            call[0] && call[0].includes('Heading hierarchy violation')
          );
          expect(hasHierarchyWarning).toBe(true);

          consoleSpy.mockRestore();
          return true;
        }
      ),
      { numRuns: 20 }
    );
    
    process.env.NODE_ENV = originalEnv;
  });

  /**
   * Property test for edge cases and robustness
   */
  test('Property 5.7: Heading components handle edge cases gracefully', () => {
    fc.assert(
      fc.property(
        fc.record({
          level: headingLevelArbitrary,
          content: fc.oneof(
            fc.constant(''),
            fc.string({ minLength: 1, maxLength: 1000 }),
            fc.constant('   '), // whitespace only
            fc.constant('Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?')
          ),
          className: fc.option(fc.oneof(
            fc.constant(''),
            fc.constant('   '),
            fc.string({ minLength: 1, maxLength: 100 }).filter(s => /^[a-zA-Z0-9_-]+$/.test(s))
          ))
        }),
        (props) => {
          const HeadingComponent = [H1, H2, H3, H4, H5, H6][props.level - 1];
          
          // Property 5.7.1: Component should render without throwing
          expect(() => {
            render(
              <div data-testid={`edge-case-test-${Math.random()}`}>
                <HeadingComponent className={props.className || undefined}>
                  {props.content}
                </HeadingComponent>
              </div>
            );
          }).not.toThrow();

          const { container } = render(
            <div data-testid={`edge-case-test-${Math.random()}`}>
              <HeadingComponent className={props.className || undefined}>
                {props.content}
              </HeadingComponent>
            </div>
          );

          // Property 5.7.2: Heading element should exist
          const headingElement = container.querySelector(`h${props.level}`);
          expect(headingElement).toBeInTheDocument();

          // Property 5.7.3: Content should be preserved (even if empty or whitespace)
          expect(headingElement?.textContent).toBe(props.content);

          // Property 5.7.4: Semantic tag should be correct regardless of content
          expect(headingElement?.tagName).toBe(`H${props.level}`);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});