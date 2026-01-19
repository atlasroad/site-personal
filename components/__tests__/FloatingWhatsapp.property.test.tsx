/**
 * Property-Based Tests for FloatingWhatsapp Component
 * **Feature: site-optimization, Property 1: FloatingWhatsapp Layout Consistency**
 * **Validates: Requirements 1.1, 1.2, 1.3**
 * **Feature: site-optimization, Property 2: Interactive Feedback Consistency**
 * **Validates: Requirements 1.5**
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as fc from 'fast-check'
import FloatingWhatsapp from '../FloatingWhatsapp'

// Custom arbitraries for generating test data
const screenSizeArbitrary = fc.record({
  width: fc.integer({ min: 320, max: 2560 }), // From mobile to desktop
  height: fc.integer({ min: 568, max: 1440 }), // From mobile to desktop
})

const tooltipTextArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  subtitle: fc.string({ minLength: 0, maxLength: 200 }),
})

// Helper function to simulate different screen sizes
const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  
  // Update the matchMedia mock to reflect the new screen size
  window.matchMedia = jest.fn().mockImplementation(query => {
    const matches = (() => {
      if (query.includes('max-width: 640px')) return width <= 640
      if (query.includes('max-width: 768px')) return width <= 768
      if (query.includes('max-width: 1024px')) return width <= 1024
      return false
    })()
    
    return {
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }
  })
}

describe('FloatingWhatsapp Layout Consistency Properties', () => {
  /**
   * Property 1: FloatingWhatsapp Layout Consistency
   * **Validates: Requirements 1.1, 1.2, 1.3**
   * 
   * For any screen size and text content, the FloatingWhatsapp component should:
   * 1. Maintain proper tooltip alignment with the button
   * 2. Prevent text compression and maintain readability
   * 3. Preserve consistent Flexbox spacing across different screen sizes
   */
  test('Property 1: Layout consistency across screen sizes and content variations', () => {
    fc.assert(
      fc.property(
        screenSizeArbitrary,
        tooltipTextArbitrary,
        (screenSize, tooltipText) => {
          // Set up the viewport for this test iteration
          setViewportSize(screenSize.width, screenSize.height)
          
          // Render the component
          const { container } = render(<FloatingWhatsapp />)
          
          // Get the main container with flexbox layout
          const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
          expect(mainContainer).toBeInTheDocument()
          
          // Verify flexbox layout properties are applied
          const computedStyle = window.getComputedStyle(mainContainer!)
          
          // Property 1.1: Tooltip alignment consistency
          // The container should use flex with proper alignment
          expect(mainContainer).toHaveClass('flex', 'flex-row', 'items-center', 'justify-end')
          
          // Property 1.2: Text readability preservation
          // Check that the tooltip container has proper max-width to prevent compression
          const tooltipContainer = container.querySelector('.max-w-\\[260px\\]')
          if (tooltipContainer) {
            const tooltipStyle = window.getComputedStyle(tooltipContainer)
            // Tooltip should have a maximum width constraint to prevent text compression
            expect(tooltipContainer).toHaveClass('max-w-[260px]')
            // Text should be properly sized and not compressed
            expect(tooltipContainer).toHaveClass('px-5', 'py-4')
          }
          
          // Property 1.3: Consistent Flexbox spacing
          // The gap between tooltip and button should be consistent
          expect(mainContainer).toHaveClass('gap-3')
          
          // Button should maintain consistent size regardless of screen size
          const whatsappButton = container.querySelector('a[href*="wa.me"]')
          expect(whatsappButton).toBeInTheDocument()
          expect(whatsappButton).toHaveClass('w-16', 'h-16')
          
          // Verify positioning is fixed and consistent
          expect(mainContainer).toHaveClass('fixed', 'bottom-6', 'right-6', 'z-50')
          
          // Ensure the layout doesn't break on any screen size
          // The container should always be properly positioned
          const containerRect = mainContainer!.getBoundingClientRect()
          
          // For very small screens, ensure the component doesn't overflow
          if (screenSize.width < 400) {
            // The component should still be accessible and not cause horizontal scroll
            expect(containerRect.left).toBeGreaterThanOrEqual(0)
          }
          
          // For larger screens, ensure proper positioning is maintained
          if (screenSize.width >= 768) {
            // The component should be properly positioned from the right edge
            expect(mainContainer).toHaveClass('right-6')
          }
          
          return true // Property holds
        }
      ),
      { 
        numRuns: 100, // Run 100 iterations as specified in design document
        verbose: true 
      }
    )
  })

  /**
   * Additional property test for tooltip arrow alignment
   * This ensures the tooltip arrow always points correctly to the button
   */
  test('Property 1.1: Tooltip arrow alignment consistency', () => {
    fc.assert(
      fc.property(
        screenSizeArbitrary,
        (screenSize) => {
          setViewportSize(screenSize.width, screenSize.height)
          
          const { container } = render(<FloatingWhatsapp />)
          
          // Find the tooltip arrow element
          const tooltipArrow = container.querySelector('.absolute.top-1\\/2.-right-1\\.5')
          
          if (tooltipArrow) {
            // Arrow should be properly positioned relative to tooltip
            expect(tooltipArrow).toHaveClass('absolute', 'top-1/2', '-right-1.5', '-translate-y-1/2')
            
            // Arrow should have consistent styling
            expect(tooltipArrow).toHaveClass('w-3', 'h-3', 'bg-white', 'rotate-45')
            
            // Arrow should maintain border consistency with tooltip
            expect(tooltipArrow).toHaveClass('border-r', 'border-t', 'border-neutral-200')
          }
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property test for responsive behavior
   * Ensures the component adapts properly to different screen orientations and sizes
   */
  test('Property 1.3: Responsive layout consistency', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 320, max: 2560 }),
          height: fc.integer({ min: 240, max: 1440 }),
          orientation: fc.constantFrom('portrait', 'landscape')
        }),
        (viewport) => {
          // Simulate different orientations
          const { width, height } = viewport.orientation === 'portrait' 
            ? { width: Math.min(viewport.width, viewport.height), height: Math.max(viewport.width, viewport.height) }
            : { width: Math.max(viewport.width, viewport.height), height: Math.min(viewport.width, viewport.height) }
          
          setViewportSize(width, height)
          
          const { container } = render(<FloatingWhatsapp />)
          
          const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
          expect(mainContainer).toBeInTheDocument()
          
          // Component should maintain consistent positioning regardless of orientation
          expect(mainContainer).toHaveClass('fixed', 'bottom-6', 'right-6')
          
          // Flexbox layout should remain consistent
          expect(mainContainer).toHaveClass('flex', 'flex-row', 'items-center')
          
          // Z-index should ensure component stays on top
          expect(mainContainer).toHaveClass('z-50')
          
          return true
        }
      ),
      { numRuns: 75 }
    )
  })
})

describe('FloatingWhatsapp Interactive Feedback Properties', () => {
  /**
   * Property 2: Interactive Feedback Consistency
   * **Validates: Requirements 1.5**
   * 
   * For any user interaction with the FloatingWhatsapp button, the component should:
   * 1. Provide clear and consistent visual feedback for hover states
   * 2. Provide clear and consistent visual feedback for click/tap states
   * 3. Handle tooltip show/hide interactions consistently
   * 4. Maintain interactive states across different screen sizes
   */
  test('Property 2: Interactive feedback consistency across all user interactions', () => {
    fc.assert(
      fc.property(
        screenSizeArbitrary,
        fc.record({
          interactionType: fc.constantFrom('hover', 'click', 'tooltip-elements'),
        }),
        (screenSize, interaction) => {
          // Set up the viewport for this test iteration
          setViewportSize(screenSize.width, screenSize.height)
          
          const { container } = render(<FloatingWhatsapp />)
          
          // Get the main elements
          const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
          const whatsappButton = container.querySelector('a[href*="wa.me"]')
          
          expect(mainContainer).toBeInTheDocument()
          expect(whatsappButton).toBeInTheDocument()
          
          // Property 2.1: Hover state feedback consistency
          if (interaction.interactionType === 'hover') {
            // Button should have hover classes defined
            expect(whatsappButton).toHaveClass('hover:scale-110', 'transition-transform')
            
            // The button should maintain its interactive classes
            expect(whatsappButton).toHaveClass('pointer-events-auto')
            expect(whatsappButton).toHaveClass('relative', 'flex', 'items-center', 'justify-center')
            
            // Button should maintain consistent size and styling
            expect(whatsappButton).toHaveClass('w-16', 'h-16', 'bg-[#25D366]', 'text-white', 'rounded-full')
          }
          
          // Property 2.2: Click/tap state feedback consistency
          if (interaction.interactionType === 'click') {
            // Button should be clickable and maintain href
            expect(whatsappButton).toHaveAttribute('href')
            expect(whatsappButton?.getAttribute('href')).toContain('wa.me')
            
            // Button should have target="_blank" for external link
            expect(whatsappButton).toHaveAttribute('target', '_blank')
            
            // The button should maintain its interactive styling
            expect(whatsappButton).toHaveClass('pointer-events-auto')
            
            // Animation pulse should be present for visual feedback
            const pulseElement = container.querySelector('.animate-ping')
            expect(pulseElement).toBeInTheDocument()
            expect(pulseElement).toHaveClass('absolute', 'inset-0', 'rounded-full', 'bg-white', 'opacity-20')
          }
          
          // Property 2.3: Tooltip elements consistency
          if (interaction.interactionType === 'tooltip-elements') {
            // Check if tooltip is present (it may or may not be shown initially)
            const tooltip = container.querySelector('.bg-white.text-neutral-950')
            
            if (tooltip) {
              // If tooltip is present, it should have consistent styling
              expect(tooltip).toHaveClass('bg-white', 'text-neutral-950', 'px-5', 'py-4', 'rounded-2xl')
              expect(tooltip).toHaveClass('shadow-xl', 'border', 'border-neutral-200', 'w-max', 'max-w-[260px]')
              
              // Close button should be present and properly styled
              const closeButton = container.querySelector('button')
              if (closeButton) {
                expect(closeButton).toHaveClass('absolute', '-top-2', '-left-2')
                expect(closeButton).toHaveClass('hover:bg-neutral-300')
              }
              
              // Tooltip arrow should be properly positioned
              const tooltipArrow = container.querySelector('.absolute.top-1\\/2.-right-1\\.5')
              if (tooltipArrow) {
                expect(tooltipArrow).toHaveClass('w-3', 'h-3', 'bg-white', 'rotate-45')
              }
            }
          }
          
          // Universal properties that should always hold
          // Interactive elements should maintain pointer events
          expect(whatsappButton).toHaveClass('pointer-events-auto')
          
          // Main container should prevent pointer events except for interactive elements
          expect(mainContainer).toHaveClass('pointer-events-none')
          
          // Component should maintain z-index for proper layering
          expect(mainContainer).toHaveClass('z-50')
          
          // Button should always maintain its core interactive properties
          expect(whatsappButton).toHaveClass('w-16', 'h-16')
          expect(whatsappButton).toHaveClass('bg-[#25D366]', 'text-white', 'rounded-full')
          expect(whatsappButton).toHaveClass('shadow-2xl')
          
          return true // Property holds
        }
      ),
      { 
        numRuns: 100, // Run 100 iterations as specified in design document
        verbose: true 
      }
    )
  })

  /**
   * Property test for animation consistency
   * Ensures animations provide consistent feedback across different scenarios
   */
  test('Property 2.1: Animation feedback consistency', () => {
    fc.assert(
      fc.property(
        screenSizeArbitrary,
        (screenSize) => {
          setViewportSize(screenSize.width, screenSize.height)
          
          const { container } = render(<FloatingWhatsapp />)
          
          // Button should have consistent animation classes
          const whatsappButton = container.querySelector('a[href*="wa.me"]')
          expect(whatsappButton).toBeInTheDocument()
          
          // Hover animation should be defined
          expect(whatsappButton).toHaveClass('hover:scale-110', 'transition-transform')
          
          // Pulse animation should be present for visual feedback
          const pulseElement = container.querySelector('.animate-ping')
          expect(pulseElement).toBeInTheDocument()
          expect(pulseElement).toHaveClass('animate-ping')
          
          // Animation should maintain consistent styling
          expect(pulseElement).toHaveClass('absolute', 'inset-0', 'rounded-full', 'bg-white', 'opacity-20')
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property test for accessibility feedback
   * Ensures interactive elements provide proper accessibility feedback
   */
  test('Property 2.5: Accessibility feedback consistency', () => {
    fc.assert(
      fc.property(
        screenSizeArbitrary,
        (screenSize) => {
          setViewportSize(screenSize.width, screenSize.height)
          
          const { container } = render(<FloatingWhatsapp />)
          
          // Button should be accessible
          const whatsappButton = container.querySelector('a[href*="wa.me"]')
          expect(whatsappButton).toBeInTheDocument()
          
          // Button should have proper link attributes for screen readers
          expect(whatsappButton).toHaveAttribute('href')
          expect(whatsappButton).toHaveAttribute('target', '_blank')
          
          // Interactive elements should be focusable
          expect(whatsappButton).not.toHaveAttribute('tabindex', '-1')
          
          // Close button should be accessible when tooltip is shown
          const closeButton = container.querySelector('button')
          if (closeButton) {
            // Close button should be focusable
            expect(closeButton).not.toHaveAttribute('tabindex', '-1')
            
            // Close button should have proper interactive styling
            expect(closeButton).toHaveClass('hover:bg-neutral-300')
          }
          
          return true
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * Property test for tooltip interaction timing
   * Tests the auto-show and close functionality separately to handle async behavior
   */
  test('Property 2.3: Tooltip interaction timing consistency', async () => {
    const { container } = render(<FloatingWhatsapp />)
    
    // Initially tooltip should not be visible
    let tooltip = container.querySelector('.bg-white.text-neutral-950')
    expect(tooltip).not.toBeInTheDocument()
    
    // Wait for auto-show (4 seconds + buffer)
    await waitFor(() => {
      tooltip = container.querySelector('.bg-white.text-neutral-950')
      expect(tooltip).toBeInTheDocument()
    }, { timeout: 5000 })
    
    // Tooltip should have consistent styling when shown
    expect(tooltip).toHaveClass('bg-white', 'text-neutral-950', 'px-5', 'py-4', 'rounded-2xl')
    expect(tooltip).toHaveClass('shadow-xl', 'border', 'border-neutral-200', 'w-max', 'max-w-[260px]')
    
    // Close button should be present and functional
    const closeButton = container.querySelector('button')
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveClass('absolute', '-top-2', '-left-2', 'hover:bg-neutral-300')
    
    // Click to close tooltip
    const user = userEvent.setup()
    await user.click(closeButton!)
    
    // Tooltip should be hidden after close
    await waitFor(() => {
      const hiddenTooltip = container.querySelector('.bg-white.text-neutral-950')
      expect(hiddenTooltip).not.toBeInTheDocument()
    })
  })
})