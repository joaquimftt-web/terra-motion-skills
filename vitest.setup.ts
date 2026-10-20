import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom has no scrolling/layout implementation. Browser tests verify the real behavior.
if (typeof window !== 'undefined') window.scrollTo = () => {};

afterEach(cleanup);
