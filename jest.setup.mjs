// Jest setup file
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = () => ({
  ok: true,
  json: () => Promise.resolve({}),
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
};

// Console wrapper to make test output cleaner
const originalError = console.error;
console.error = (...args) => {
  // Filter out React warnings about act() in tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('act') || args[0].includes('Warning:'))
  ) {
    return;
  }
  originalError(...args);
};