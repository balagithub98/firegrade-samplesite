import { initThemeToggle } from './components/theme.js';
import { initAccordion } from './components/accordion.js';

document.getElementById('year')?.append(new Date().getFullYear());
initThemeToggle();
initAccordion();
