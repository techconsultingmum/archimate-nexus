import { useEffect, useCallback } from 'react';

/**
 * Hook to trap focus within a container (useful for modals, dialogs)
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    }

    if (e.key === 'Escape') {
      firstElement?.focus();
    }
  }, [containerRef, isActive]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);
}

/**
 * Hook for keyboard navigation in lists
 */
export function useListNavigation<T>(
  items: T[],
  selectedIndex: number,
  onSelect: (index: number) => void,
  onActivate?: (item: T) => void
) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        onSelect(Math.min(selectedIndex + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        onSelect(Math.max(selectedIndex - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        onSelect(0);
        break;
      case 'End':
        e.preventDefault();
        onSelect(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onActivate && items[selectedIndex]) {
          onActivate(items[selectedIndex]);
        }
        break;
    }
  }, [items, selectedIndex, onSelect, onActivate]);

  return { handleKeyDown };
}

/**
 * Announces a message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Generates a unique ID for accessibility purposes
 */
let idCounter = 0;
export function generateAccessibleId(prefix: string = 'accessible'): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
