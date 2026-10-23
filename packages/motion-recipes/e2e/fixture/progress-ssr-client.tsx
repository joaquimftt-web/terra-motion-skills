import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { ProgressFixture } from './progress-shared.mjs';
hydrateRoot(document.getElementById('progress-ssr-root')!, createElement(ProgressFixture));
