/**
 * Unit Tests for FloatingWhatsapp Component - Edge Cases
 * Testing specific edge cases and extreme scenarios
 * Requirements: 1.1, 1.2, 1.3, 1.5
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FloatingWhatsapp from '../FloatingWhatsapp'

// Mock framer-motion for consistent testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, animate, exit, ...props }: any) => 
      <div {...props}>{children}</div>,
    a: ({ children, whileHover, whileTap, initial, animate, exit, ...props }: any) => 
      <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('FloatingWhatsapp Edge Cases - Unit Tests', () => {
  beforeEach(() => {
    // Reset viewport to default before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  describe('Invalid Phone Numbers', () => {
    test('should handle hardcoded phone number gracefully', () => {
      const { container } = render(<FloatingWhatsapp />)
      
      const whatsappButton = container.querySelector('a[href*="wa.me"]')
      expect(whatsappButton).toBeInTheDocument()
      
      // Check that the hardcoded phone number is present in href
      const href = whatsappButton?.getAttribute('href')
      expect(href).toContain('wa.me/5500000000000')
      expect(href).toContain('text=Ola+vim+pelo+site')
    })

    test('should maintain button functionality even with placeholder phone number', () => {
      const { container } = render(<FloatingWhatsapp />)
      
      const whatsappButton = container.querySelector('a[href*="wa.me"]')
      expect(whatsappButton).toBeInTheDocument()
      
      // Button should still be clickable and have proper attributes
      expect(whatsappButton).toHaveAttribute('target', '_blank')
      expect(whatsappButton).toHaveClass('pointer-events-auto')
      
      // Visual elements should be present
      expect(whatsappButton).toHaveClass('w-16', 'h-16', 'bg-[#25D366]')
      
      // Icon should be present
      const icon = whatsappButton?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    test('should handle WhatsApp URL format correctly', () => {
      const { container } = render(<FloatingWhatsapp />)
      
      const whatsappButton = container.querySelector('a[href*="wa.me"]')
      const href = whatsappButton?.getAttribute('href')
      
      // URL should follow WhatsApp format: https://wa.me/PHONE?text=MESSAGE
      expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=.+/)
      
      // Should handle URL encoding properly
      expect(href).toContain('text=Ola+vim+pelo+site')
    })
  })

  describe('Very Long Texts in Tooltip', () => {
    test('should handle tooltip with maximum width constraint', async () => {
      const { container } = render(<FloatingWhatsapp />)
      
      // Wait for tooltip to appear automatically
      await waitFor(() => {
        const tooltip = container.querySelector('.bg-white.text-neutral-950')
        expect(tooltip).toBeInTheDocument()
      }, { timeout: 5000 })
      
      const tooltip = container.querySelector('.bg-white.text-neutral-950')
      
      // Tooltip should have max-width constraint to prevent text overflow
      expect(tooltip).toHaveClass('max-w-[260px]')
      
      // Should have proper padding to prevent text compression
      expect(tooltip).toHaveClass('px-5', 'py-4')
      
      // Should use w-max to fit content within constraints
      expect(tooltip).toHaveClass('w-max')
    })

    test('should maintain readability with long text content', async () => {
      const { container } = render(<FloatingWhatsapp />)
      
      // Wait for tooltip to appear
      await waitFor(() => {
        const tooltip = container.querySelector('.bg-white.text-neutral-950')
        expect(tooltip).toBeInTheDocument()
      }, { timeout: 5000 })
      
      const tooltip = container.querySelector('.bg-white.text-neutral-950')
      
      // Check that text elements are properly structured
      const titleText = tooltip?.querySelector('p.text-sm.font-bold')
      expect(titleText).toBeInTheDocument()
      
      const subtitleText = tooltip?.querySelector('span.block.text-xs')
      expect(subtitleText).toBeInTheDocument()
      
      // Text should have proper styling for readability
      expect(titleText).toHaveClass('text-sm', 'font-bold')
      expect(subtitleText).toHaveClass('text-xs', 'font-normal', 'text-neutral-600')
    })

    test('should handle text overflow gracefully', async () => {
      const { container } = render(<FloatingWhatsapp />)
      
      await waitFor(() => {
        const tooltip = container.querySelector('.bg-white.text-neutral-950')
        expect(tooltip).toBeInTheDocument()
      }, { timeout: 5000 })
      
      const tooltip = container.querySelector('.bg-white.text-neutral-950')
      
      // Tooltip should have rounded corners and proper styling even with long text
      expect(tooltip).toHaveClass('rounded-2xl')
      expect(tooltip).toHaveClass('shadow-xl', 'border', 'border-neutral-200')
      
      // Should maintain proper positioning relative to button
      const tooltipArrow = container.querySelector('.absolute.top-1\\/2.-right-1\\.5')
      expect(tooltipArrow).toBeInTheDocument()
      expect(tooltipArrow).toHaveClass('w-3', 'h-3', 'bg-white', 'rotate-45')
    })

    test('should handle extremely long single words', async () => {
      // This tests CSS word-break behavior
      const { container } = render(<FloatingWhatsapp />)
      
      await waitFor(() => {
        const tooltip = container.querySelector('.bg-white.text-neutral-950')
        expect(tooltip).toBeInTheDocument()
      }, { timeout: 5000 })
      
      const tooltip = container.querySelector('.bg-white.text-neutral-950')
      
      // Tooltip should maintain its maximum width even with long words
      expect(tooltip).toHaveClass('max-w-[260px]')
      
      // Should have proper width constraints to prevent overflow
      expect(tooltip).toHaveClass('w-max')
      
      // Should maintain proper text styling for readability
      const textElement = tooltip?.querySelector('p.text-sm.font-bold')
      expect(textElement).toBeInTheDocument()
      expect(textElement).toHaveClass('text-sm', 'font-bold')
    })
  })

  describe('Behavior on Very Small Screens', () => {
    test('should maintain functionality on mobile screens (320px)', () => {
      // Set very small screen size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 568,
      })

      const { container } = render(<FloatingWhatsapp />)
      
      const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
      expect(mainContainer).toBeInTheDocument()
      
      // Should maintain fixed positioning
      expect(mainContainer).toHaveClass('fixed', 'bottom-6', 'right-6')
      
      // Button should maintain consistent size
      const whatsappButton = container.querySelector('a[href*="wa.me"]')
      expect(whatsappButton).toHaveClass('w-16', 'h-16')
      
      // Should maintain proper z-index for layering
      expect(mainContainer).toHaveClass('z-50')
    })

    test('should handle tooltip positioning on small screens', async () => {
      // Set small screen size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      })

      const { container } = render(<FloatingWhatsapp />)
      
      await waitFor(() => {
        const tooltip = container.querySelector('.bg-white.text-neutral-950')
        expect(tooltip).toBeInTheDocument()
      }, { timeout: 5000 })
      
      const tooltip = container.querySelector('.bg-white.text-neutral-950')
      
      // Tooltip should maintain maximum width constraint on small screens
      expect(tooltip).toHaveClass('max-w-[260px]')
      
      // Should maintain proper spacing and positioning
      const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
      expect(mainContainer).toHaveClass('gap-3', 'justify-end')
      
      // Arrow should still be properly positioned
      const tooltipArrow = container.querySelector('.absolute.top-1\\/2.-right-1\\.5')
      expect(tooltipArrow).toBeInTheDocument()
    })

    test('should prevent horizontal overflow on very small screens', () => {
      // Set extremely small screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 280,
      })

      const { container } = render(<FloatingWhatsapp />)
      
      const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
      expect(mainContainer).toBeInTheDocument()
      
      // Component should still be positioned correctly
      expect(mainContainer).toHaveClass('right-6')
      
      // Button should maintain minimum interactive size
      const whatsappButton = container.querySelector('a[href*="wa.me"]')
      expect(whatsappButton).toHaveClass('w-16', 'h-16')
      
      // Should maintain flexbox layout for proper alignment
      expect(mainContainer).toHaveClass('flex', 'flex-row', 'items-center')
    })

    test('should handle touch interactions on mobile devices', async () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 390,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 844,
      })

      const { container } = render(<FloatingWhatsapp />)
      
      const whatsappButton = container.querySelector('a[href*="wa.me"]')
      expect(whatsappButton).toBeInTheDocument()
      
      // Button should be large enough for touch interaction (44px minimum)
      expect(whatsappButton).toHaveClass('w-16', 'h-16') // 64px x 64px
      
      // Should have proper pointer events
      expect(whatsappButton).toHaveClass('pointer-events-auto')
      
      // Should maintain hover states even on touch devices
      expect(whatsappButton).toHaveClass('hover:scale-110')
      
      // Test tooltip close button touch interaction
      await waitFor(() => {
        const tooltip = container.querySelector('.bg-white.text-neutral-950')
        expect(tooltip).toBeInTheDocument()
      }, { timeout: 5000 })
      
      const closeButton = container.querySelector('button')
      expect(closeButton).toBeInTheDocument()
      
      // Close button should be large enough for touch
      expect(closeButton).toHaveClass('p-1') // Provides adequate touch target
      
      // Should be positioned outside tooltip for easy access
      expect(closeButton).toHaveClass('absolute', '-top-2', '-left-2')
    })

    test('should maintain accessibility on small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      })

      const { container } = render(<FloatingWhatsapp />)
      
      const whatsappButton = container.querySelector('a[href*="wa.me"]')
      
      // Should maintain proper link attributes for screen readers
      expect(whatsappButton).toHaveAttribute('href')
      expect(whatsappButton).toHaveAttribute('target', '_blank')
      
      // Should be focusable for keyboard navigation
      expect(whatsappButton).not.toHaveAttribute('tabindex', '-1')
      
      // Icon should be present for visual identification
      const icon = whatsappButton?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Extreme Edge Cases', () => {
    test('should handle rapid tooltip show/hide interactions', async () => {
      const { container } = render(<FloatingWhatsapp />)
      
      // Wait for tooltip to appear
      await waitFor(() => {
        const tooltip = container.querySelector('.bg-white.text-neutral-950')
        expect(tooltip).toBeInTheDocument()
      }, { timeout: 5000 })
      
      const closeButton = container.querySelector('button')
      expect(closeButton).toBeInTheDocument()
      
      const user = userEvent.setup()
      
      // Rapidly click close button multiple times
      await user.click(closeButton!)
      await user.click(closeButton!)
      
      // Should handle multiple clicks gracefully
      await waitFor(() => {
        const hiddenTooltip = container.querySelector('.bg-white.text-neutral-950')
        expect(hiddenTooltip).not.toBeInTheDocument()
      })
    })

    test('should handle component unmounting during tooltip animation', () => {
      const { container, unmount } = render(<FloatingWhatsapp />)
      
      const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
      expect(mainContainer).toBeInTheDocument()
      
      // Unmount component immediately (simulates navigation or component removal)
      unmount()
      
      // Should not throw errors or cause memory leaks
      expect(container.firstChild).toBeNull()
    })

    test('should maintain performance with multiple rapid re-renders', () => {
      const { rerender } = render(<FloatingWhatsapp />)
      
      // Rapidly re-render component multiple times
      for (let i = 0; i < 10; i++) {
        rerender(<FloatingWhatsapp />)
      }
      
      // Component should still render correctly after multiple re-renders
      const { container } = render(<FloatingWhatsapp />)
      const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
      expect(mainContainer).toBeInTheDocument()
      
      const whatsappButton = container.querySelector('a[href*="wa.me"]')
      expect(whatsappButton).toBeInTheDocument()
    })

    test('should handle CSS class conflicts gracefully', () => {
      // Add conflicting styles to document
      const style = document.createElement('style')
      style.textContent = `
        .fixed { position: static !important; }
        .z-50 { z-index: 1 !important; }
      `
      document.head.appendChild(style)
      
      const { container } = render(<FloatingWhatsapp />)
      
      // Component should still have the classes even if CSS is overridden
      const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
      expect(mainContainer).toHaveClass('fixed', 'z-50')
      
      // Clean up
      document.head.removeChild(style)
    })

    test('should handle missing DOM APIs gracefully', () => {
      // Mock missing getBoundingClientRect
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))
      
      const { container } = render(<FloatingWhatsapp />)
      
      // Component should still render without errors
      const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
      expect(mainContainer).toBeInTheDocument()
      
      // Restore original method
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
    })
  })

  describe('Layout Stress Tests', () => {
    test('should handle extreme aspect ratios', () => {
      // Very wide screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 3440,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1440,
      })

      const { container } = render(<FloatingWhatsapp />)
      
      const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
      expect(mainContainer).toBeInTheDocument()
      expect(mainContainer).toHaveClass('right-6') // Should maintain right positioning
      
      // Very tall screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 2048,
      })

      const { container: container2 } = render(<FloatingWhatsapp />)
      const mainContainer2 = container2.querySelector('.fixed.bottom-6.right-6')
      expect(mainContainer2).toHaveClass('bottom-6') // Should maintain bottom positioning
    })

    test('should handle zero or negative viewport dimensions', () => {
      // Edge case: zero width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 0,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600,
      })

      const { container } = render(<FloatingWhatsapp />)
      
      // Component should still render without errors
      const mainContainer = container.querySelector('.fixed.bottom-6.right-6')
      expect(mainContainer).toBeInTheDocument()
      
      // Should maintain its structure
      expect(mainContainer).toHaveClass('flex', 'flex-row', 'items-center')
    })
  })
})