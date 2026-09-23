// Palette de la DA Salks. (identique au portfolio, apps/web/src/app/globals.css) :
// deux thèmes, un seul violet, Plus Jakarta Sans + JetBrains Mono.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const THEMES = {
  dark: {
    bg: '#0e0d11', panel: '#17151b', panelLine: '#232028', card: '#131216', line: '#232028', lineStrong: '#322e39',
    text: '#f2f0f4', muted: '#9a95a3', faint: '#6a6572',
    accent: '#9b7dff', accentSoft: '#211a36', onAccent: '#100c1c',
    live: '#34d399', wip: '#fbbf24',
    // rampe du calendrier : du panneau vers le violet
    ramp: ['#1d1a23', '#2e2450', '#4b3a8f', '#7458d6', '#b3a0ff'],
  },
  light: {
    bg: '#faf9fa', panel: '#e9e6ea', panelLine: '#dcd8de', card: '#f3f1f3', line: '#e2dee4', lineStrong: '#cfc9d4',
    text: '#1a171c', muted: '#6a6472', faint: '#97919e',
    accent: '#7c5cff', accentSoft: '#ece7ff', onAccent: '#ffffff',
    live: '#059669', wip: '#d97706',
    ramp: ['#e9e6ea', '#d9ceff', '#ae98ff', '#7c5cff', '#4a2fc4'],
  },
};

const font = (file) => readFileSync(join(ROOT, 'scripts', 'fonts', file)).toString('base64');
const FACES = {
  400: ['Jakarta', 400, 'plus-jakarta-sans-latin-400-normal.woff2'],
  600: ['Jakarta', 600, 'plus-jakarta-sans-latin-600-normal.woff2'],
  800: ['Jakarta', 800, 'plus-jakarta-sans-latin-800-normal.woff2'],
  mono: ['JB', 400, 'jetbrains-mono-latin-400-normal.woff2'],
};

/** @font-face embarqués : un SVG servi en <img> ne peut pas charger de police externe. */
export function fonts(...keys) {
  return keys.map((k) => {
    const [family, weight, file] = FACES[k];
    return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${font(file)}) format('woff2')}`;
  }).join('\n');
}

export const SANS = "'Jakarta', 'Segoe UI', system-ui, sans-serif";
export const MONO = "'JB', Consolas, ui-monospace, monospace";

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function write(rel, content) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}

// Apparition douce, comme le composant <Reveal> du portfolio.
export const REVEAL = `.r{opacity:0;animation:reveal .7s cubic-bezier(.22,1,.36,1) forwards}
@keyframes reveal{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-delay:0s!important}}`;
