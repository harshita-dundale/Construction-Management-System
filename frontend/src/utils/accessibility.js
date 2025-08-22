// Accessibility utilities

// Focus management
export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  firstElement.focus();

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

// Announce to screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// High contrast mode detection
export const prefersHighContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Skip link functionality
export const addSkipLink = () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
};

// Keyboard navigation helpers
export const handleArrowNavigation = (items, currentIndex, direction) => {
  let newIndex;
  
  if (direction === 'up' || direction === 'left') {
    newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
  } else {
    newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
  }
  
  items[newIndex].focus();
  return newIndex;
};

// Color contrast checker (basic)
export const checkColorContrast = (foreground, background) => {
  // This is a simplified version - in production, use a proper contrast checking library
  const getLuminance = (color) => {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return {
    ratio,
    passAA: ratio >= 4.5,
    passAAA: ratio >= 7
  };
};