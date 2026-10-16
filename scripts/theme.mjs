// Palette de la DA Salks. (identique aux vitrines, salks-kit/vitrine.css) :
// page imprimée la nuit. Fond encre chaud ou papier, titres en serif, filets fins
// plutôt que cartes, aucune lueur ni dégradé décoratif. Une couleur par projet.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const THEMES = {
  dark: {
    bg: '#0d0d0c', bg2: '#141412', bg3: '#1b1b18', rule: '#262622', rule2: '#393833',
    text: '#ece8df', muted: '#aaa598', faint: '#7a766c', onSolid: '#0d0d0c',
    accent: '#b3a7e8', // violet Salks., désaturé
    live: '#7fbf8e', wip: '#d9b25c',
    // rampe du calendrier : de l'encre vers le violet
    ramp: ['#1b1b18', '#34314a', '#544d80', '#8278bd', '#b3a7e8'],
  },
  light: {
    bg: '#f3f0e8', bg2: '#ebe7dd', bg3: '#e2ddd1', rule: '#d8d2c4', rule2: '#bfb8a8',
    text: '#1b1a17', muted: '#57534a', faint: '#858073', onSolid: '#f3f0e8',
    accent: '#5a4bb0',
    live: '#2f7a45', wip: '#9a6a12',
    ramp: ['#e2ddd1', '#cfc8e4', '#a59bd6', '#7a6cc2', '#5a4bb0'],
  },
};

const font = (file) => readFileSync(join(ROOT, 'scripts', 'fonts', file)).toString('base64');
const FACES = {
  400: ['Jakarta', 400, 'normal', 'plus-jakarta-sans-latin-400-normal.woff2'],
  600: ['Jakarta', 600, 'normal', 'plus-jakarta-sans-latin-600-normal.woff2'],
  800: ['Jakarta', 800, 'normal', 'plus-jakarta-sans-latin-800-normal.woff2'],
  mono: ['JB', 400, 'normal', 'jetbrains-mono-latin-400-normal.woff2'],
  serif: ['Serif', 400, 'normal', 'source-serif-4-latin-400-normal.woff2'],
  italic: ['Serif', 400, 'italic', 'source-serif-4-latin-400-italic.woff2'],
};

/** @font-face embarqués : un SVG servi en <img> ne peut pas charger de police externe. */
export function fonts(...keys) {
  return keys.map((k) => {
    const [family, weight, style, file] = FACES[k];
    return `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url(data:font/woff2;base64,${font(file)}) format('woff2')}`;
  }).join('\n');
}

export const SANS = "'Jakarta', 'Segoe UI', system-ui, sans-serif";
export const MONO = "'JB', Consolas, ui-monospace, monospace";
export const SERIF = "'Serif', Georgia, 'Times New Roman', serif";

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function write(rel, content) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}

/** Numéros grecs des sections, comme sur les vitrines. */
export const GREEK_NUM = ['α′', 'β′', 'γ′', 'δ′', 'ε′', 'ϛ′', 'ζ′', 'η′', 'θ′'];

// Apparition douce, comme le composant <Reveal> des sites.
export const REVEAL = `.r{opacity:0;animation:reveal .7s cubic-bezier(.22,1,.36,1) forwards}
@keyframes reveal{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-delay:0s!important}}`;

/** Enveloppe SVG commune : polices, classes de texte, apparition. */
export const svg = (w, h, label, css, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
<style>
${css}
text{font-family:${SANS}}
.mono{font-family:${MONO}}
.serif{font-family:${SERIF}}
.it{font-family:${SERIF};font-style:italic}
${REVEAL}
</style>
${body}
</svg>
`;
