'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

// Announcer context for screen reader announcements
interface AnnouncerContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  message: string;
  politeness: 'polite' | 'assertive';
}

const AnnouncerContext = createContext<AnnouncerContextType>({
  announce: () => {},
  message: '',
  politeness: 'polite',
});

export function useAnnouncer() {
  return useContext(AnnouncerContext);
}

export function AnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [politeness, setPoliteness] = useState<'polite' | 'assertive'>('polite');

  const announce = useCallback((msg: string, priority: 'polite' | 'assertive' = 'polite') => {
    setPoliteness(priority);
    // Clear first to ensure re-announcement of same message
    setMessage('');
    setTimeout(() => setMessage(msg), 100);
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce, message, politeness }}>
      {children}
      {/* Screen reader live region */}
      <div
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
    </AnnouncerContext.Provider>
  );
}

// Skip to content link component
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-terracotta focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}

// Focus trap component for modals
export function FocusTrap({ children }: { children: React.ReactNode }) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return <>{children}</>;
}

// Reduced motion hook
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// Color contrast helper
export function getContrastColor(hexColor: string): string {
  // Remove # if present
  const color = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Visually hidden content for screen readers
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Expandable section with proper ARIA
export function AccessibleExpand({
  title,
  children,
  defaultExpanded = false
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentId = React.useId();
  const buttonId = React.useId();

  return (
    <div className="border border-sandstone rounded-lg overflow-hidden">
      <button
        id={buttonId}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-sandstone/30 hover:bg-sandstone/50 transition-colors text-left"
      >
        <span className="font-semibold text-charcoal">{title}</span>
        <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!expanded}
        className={`px-4 py-3 ${expanded ? 'block' : 'hidden'}`}
      >
        {children}
      </div>
    </div>
  );
}
