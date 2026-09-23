// Génère les SVG statiques du profil dans la DA Salks. : bannière, cover,
// en-têtes de section, cartes projets, parcours et stack. Un fichier par thème.
// Usage : node scripts/build-static.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { THEMES, fonts, SANS, MONO, esc, write, REVEAL, ROOT } from './theme.mjs';

const W = 900;
const svg = (w, h, label, css, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
<style>
${css}
text{font-family:${SANS}}
.mono{font-family:${MONO}}
${REVEAL}
</style>
${body}
</svg>
`;
const both = (name, fn) => {
  for (const [mode, t] of Object.entries(THEMES)) write(`assets/${name}-${mode}.svg`, fn(t, mode));
};

// largeur approximative d'un texte mono (JetBrains Mono : 0,6 em)
const monoW = (s, size, track = 0) => s.length * (size * 0.6 + track);

/* ------------------------------------------------------------- le logo */

// « Salks. » : le S porte sa barre violette, le point ferme le mot.
// Mesures relevées dans Chrome pour Plus Jakarta Sans 800 à 150 px, letter-spacing -5.
const LOGO_ADV = 364;
function logo(t, anim = true) {
  // le masque creuse l'espace entre le S et sa barre : fond transparent, pas de contour
  return `<g>
    <mask id="cut" maskUnits="userSpaceOnUse" x="-60" y="-220" width="520" height="300">
      <rect x="-60" y="-220" width="520" height="300" fill="#fff"/>
      <polygon points="-26,6 44,6 84,-47 9,-47" fill="#000"/>
    </mask>
    <text x="0" y="0" font-size="150" font-weight="800" letter-spacing="-5" fill="${t.text}" mask="url(#cut)" class="${anim ? 'r' : ''}" style="animation-delay:.1s">Salks</text>
    <g class="${anim ? 'slash' : ''}">
      <polygon points="-18,0 38,0 68,-36 12,-36" fill="${t.accent}"/>
    </g>
    <circle class="${anim ? 'dot' : ''}" cx="${LOGO_ADV + 22}" cy="-17" r="17" fill="${t.accent}"/>
  </g>`;
}

both('hero', (t, mode) => {
  const H = 360, cx = W / 2;
  const glow = mode === 'dark' ? 0.55 : 0.28;
  const tagline = `<text x="${cx}" y="0" text-anchor="middle" class="mono" font-size="14" letter-spacing="5" fill="${t.muted}">ENSEMBLE, CONSTRUISONS QUELQUE CHOSE DE GRAND<tspan fill="${t.accent}">.</tspan></text>`;
  return svg(W, H, 'Salks. — Ensemble, construisons quelque chose de grand.', `${fonts(800, 400, 'mono')}
.glow{animation:breathe 7s ease-in-out infinite}
.glow2{animation:breathe 7s ease-in-out -3.5s infinite}
@keyframes breathe{0%,100%{opacity:1}50%{opacity:.55}}
.slash{opacity:0;animation:slash .8s cubic-bezier(.22,1,.36,1) .45s forwards}
@keyframes slash{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none}}
.dot{transform-box:fill-box;transform-origin:center;transform:scale(0);animation:dot .6s cubic-bezier(.34,1.56,.64,1) .9s forwards}
@keyframes dot{to{transform:scale(1)}}
`,
  `<defs>
  <radialGradient id="g1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) scale(520 360)">
    <stop offset="0" stop-color="${t.accent}" stop-opacity="${glow}"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
  <radialGradient id="g2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${W} ${H}) scale(420 260)">
    <stop offset="0" stop-color="${t.accent}" stop-opacity="${glow * 0.7}"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
  <clipPath id="c"><rect width="${W}" height="${H}" rx="12"/></clipPath>
</defs>
<g clip-path="url(#c)">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  <rect class="glow" width="${W}" height="${H}" fill="url(#g1)"/>
  <rect class="glow2" width="${W}" height="${H}" fill="url(#g2)"/>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="${t.panelLine}"/>
<g transform="translate(${cx - (LOGO_ADV + 39) / 2} 196)">${logo(t)}</g>
<g transform="translate(0 264)"><g class="r" style="animation-delay:.6s">${tagline}</g></g>`);
});

/* -------------------------------------------------------------- la cover */

{
  const img = readFileSync(join(ROOT, 'scripts', 'cover.jpg')).toString('base64');
  const H = Math.round(W * 788 / 1400);
  both('cover', (t) => svg(W, H, 'Salks à son bureau, version Minecraft', '', `<defs><clipPath id="c"><rect width="${W}" height="${H}" rx="12"/></clipPath></defs>
<image href="data:image/jpeg;base64,${img}" width="${W}" height="${H}" clip-path="url(#c)" preserveAspectRatio="xMidYMid slice"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="${t.panelLine}"/>`));
}

/* ---------------------------------------------------- en-têtes de section */

// Même gabarit que <Section> du portfolio : pilule, grand titre, courte intro.
const SECTIONS = {
  about: ['Qui suis-je', 'Développeur Minecraft et web', 'Minecraft Java et Bedrock, du plugin serveur jusqu’au site et aux API.'],
  projects: ['Mes projets', "Ce que j'ai construit", 'Des outils que je développe et que j’utilise au quotidien.'],
  journey: ['Mon parcours', "D'un premier plugin à l'indépendance", ''],
  stack: ['Compétences', 'Ce avec quoi je travaille', ''],
  activity: ['Activité', 'Mon année en code', ''],
  contact: ['Contact', 'Un projet en tête ? Parlons-en.', 'Décris ton besoin en quelques lignes, je reviens vers toi rapidement.'],
};
for (const [id, [eyebrow, title, intro]] of Object.entries(SECTIONS)) {
  both(`section-${id}`, (t) => {
    const H = intro ? 160 : 124;
    const pw = eyebrow.length * 7.3 + 36;
    // le point de la marque ferme chaque titre
    const end = /[.?]$/.test(title) ? '' : `<tspan fill="${t.accent}">.</tspan>`;
    return svg(W, H, title, fonts(800, 400), `<g class="r"><rect x="${(W - pw) / 2}" y="8" width="${pw}" height="30" rx="15" fill="${t.card}" stroke="${t.line}"/>
<text x="${W / 2}" y="28" text-anchor="middle" font-size="13" fill="${t.muted}">${esc(eyebrow)}</text></g>
<text x="${W / 2}" y="90" text-anchor="middle" font-size="34" font-weight="800" letter-spacing="-.5" fill="${t.text}" class="r" style="animation-delay:.08s">${esc(title)}${end}</text>
${intro ? `<text x="${W / 2}" y="130" text-anchor="middle" font-size="15" fill="${t.muted}" class="r" style="animation-delay:.16s">${esc(intro)}</text>` : ''}`);
  });
}

/* --------------------------------------------------------- cartes projets */

const PROJECTS = [
  { file: 'earthquest', cat: 'Minecraft', state: 'wip', name: 'EarthQuest',
    sub: ['Serveur Minecraft 1.7.10 moddé : mods Forge,', 'plugins Bukkit/Crucible, API, site et panel.'],
    tags: ['Java', 'Forge', 'Bukkit', 'Gradle'] },
  { file: 'kernpath', cat: 'Desktop', state: 'wip', name: 'Kernpath',
    sub: ['Mon poste de commande : projets locaux, Git,', 'GitHub, Trello et agents IA au même endroit.'],
    tags: ['Tauri', 'Rust', 'React', 'TypeScript'] },
  { file: 'portfolio', cat: 'Web', state: 'wip', name: 'Portfolio',
    sub: ['Site bilingue piloté par la base, avec un studio', 'local pour tout modifier sans toucher au code.'],
    tags: ['Next.js', 'Prisma', 'PostgreSQL'] },
  { file: 'gameoflife', cat: 'Jeu · temps réel', state: 'wip', name: 'GameOfLife',
    sub: ['Jeu multijoueur : API temps réel, client mobile', "et panel d'administration complet."],
    tags: ['TypeScript', 'Fastify', 'Socket.IO'] },
  { file: 'myschool', cat: 'Mobile & desktop', state: 'live', name: 'MySchool',
    sub: ['Mon classeur archivé sur Windows et Android.', 'Le scanner est piloté en HTTP, sans driver.'],
    tags: ['Flutter', 'Dart', 'Supabase'] },
  { file: 'pronote-bot', cat: 'Bot Discord', state: 'live', name: 'Bot PRONOTE',
    sub: ['Brief quotidien en image, notifications en', 'temps réel et préparation du sac.'],
    tags: ['TypeScript', 'discord.js', 'pawnote'] },
];
const STATES = { live: 'En ligne', wip: 'En cours' };

for (const p of PROJECTS) {
  both(`projects/${p.file}`, (t) => {
    const CW = 440, CH = 212;
    let x = 24;
    const tags = p.tags.map((tag) => {
      const w = monoW(tag, 11.5) + 22;
      const s = `<rect x="${x}" y="160" width="${w}" height="26" rx="13" fill="${t.panel}" stroke="${t.line}"/><text x="${x + w / 2}" y="177" text-anchor="middle" class="mono" font-size="11.5" fill="${t.muted}">${esc(tag)}</text>`;
      x += w + 6;
      return s;
    }).join('');
    const stateCol = t[p.state];
    return svg(CW, CH, p.name, fonts(800, 600, 400, 'mono'), `<rect x=".5" y=".5" width="${CW - 1}" height="${CH - 1}" rx="8" fill="${t.card}" stroke="${t.line}"/>
<g class="r">
<text x="24" y="36" class="mono" font-size="11" letter-spacing="1.6" fill="${t.accent}">${esc(p.cat.toUpperCase())}</text>
<text x="${CW - 24}" y="36" text-anchor="end" class="mono" font-size="11" letter-spacing="1.6" fill="${stateCol}">${STATES[p.state].toUpperCase()}</text>
<text x="24" y="76" font-size="23" font-weight="800" letter-spacing="-.3" fill="${t.text}">${esc(p.name)}<tspan fill="${t.accent}">.</tspan></text>
<text x="24" y="108" font-size="14" fill="${t.muted}">${esc(p.sub[0])}</text>
<text x="24" y="129" font-size="14" fill="${t.muted}">${esc(p.sub[1])}</text>
${tags}
</g>`);
  });
}

/* ---------------------------------------------------------------- parcours */

// Repris de la table Experience du portfolio.
const JOURNEY = [
  { period: '2025 — auj.', title: 'Développement Java & Minecraft', org: 'EarthQuestMC', current: true,
    desc: 'Plugins et mods pour plusieurs versions du jeu, fonctionnalités et systèmes du serveur EarthQuest.' },
  { period: '2024 — auj.', title: 'Développement web', org: 'NationsGlory / EarthQuestMC', current: true,
    desc: "StaffTools, puis le panel d'administration, le site et les API publique et privée d'EarthQuest." },
  { period: '2023 — 2025', title: 'Développement Minecraft PocketMine-MP', org: 'EarthRebornMC',
    desc: 'Serveurs Bedrock sous PocketMine-MP 5 : plugins sur mesure et Resource Packs.' },
];
both('journey', (t) => {
  const RH = 96, GAP = 10, H = JOURNEY.length * (RH + GAP) - GAP;
  const rows = JOURNEY.map((j, i) => {
    const y = i * (RH + GAP);
    const tw = j.title.length * 10.2;
    const ow = j.org.length * 7.6;
    const badge = j.current ? `<rect x="${200 + tw + ow + 34}" y="${y + 23}" width="70" height="22" rx="11" fill="${t.accentSoft}"/><text x="${200 + tw + ow + 69}" y="${y + 38}" text-anchor="middle" font-size="11" fill="${t.accent}">En cours</text>` : '';
    return `<g class="r" style="animation-delay:${i * 0.1}s">
<rect x=".5" y="${y + 0.5}" width="${W - 1}" height="${RH - 1}" rx="8" fill="${t.card}" stroke="${t.line}"/>
<text x="28" y="${y + 40}" class="mono" font-size="11" letter-spacing="1.6" fill="${t.faint}">${esc(j.period.toUpperCase())}</text>
<text x="200" y="${y + 40}" font-size="18" font-weight="600" fill="${t.text}">${esc(j.title)}<tspan font-size="14" font-weight="400" fill="${t.faint}">  — ${esc(j.org)}</tspan></text>
${badge}
<text x="200" y="${y + 69}" font-size="14" fill="${t.muted}">${esc(j.desc)}</text>
</g>`;
  }).join('\n');
  return svg(W, H, 'Mon parcours', fonts(600, 400, 'mono'), rows);
});

/* ------------------------------------------------------------------- stack */

const STACK = [
  ['Langages', ['Java', 'TypeScript', 'Rust', 'Dart', 'SQL']],
  ['Minecraft', ['Forge 1.7.10', 'Bukkit', 'Crucible', 'Paper', 'Mixins']],
  ['Web & desktop', ['Next.js', 'React', 'Tailwind', 'Tauri', 'Flutter']],
  ['Données & outils', ['PostgreSQL', 'Redis', 'Supabase', 'Docker', 'Git']],
];
both('stack', (t) => {
  const GAP = 10, CW = (W - GAP * 3) / 4, H = 250;
  const cols = STACK.map(([cat, items], i) => {
    const x = i * (CW + GAP);
    const list = items.map((it, k) => `<g transform="translate(${x + 20} ${70 + k * 34})"><circle cx="3" cy="-4.5" r="3" fill="${t.accent}"/><text x="16" y="0" font-size="15" fill="${t.text}">${esc(it)}</text></g>`).join('');
    return `<g class="r" style="animation-delay:${i * 0.08}s"><rect x="${x + 0.5}" y=".5" width="${CW - 1}" height="${H - 1}" rx="8" fill="${t.card}" stroke="${t.line}"/>
<text x="${x + 20}" y="36" class="mono" font-size="11" letter-spacing="1.6" fill="${t.faint}">${esc(cat.toUpperCase())}</text>${list}</g>`;
  }).join('\n');
  return svg(W, H, 'Compétences', fonts(400, 'mono'), cols);
});

/* ----------------------------------------------------------------- boutons */

// .btn-accent et .btn-plain du portfolio, rendus cliquables par le lien qui les entoure.
const BUTTONS = { projects: ['Voir mes projets', true], contact: ['Me contacter', false], email: ['Écrire un email', true], discord: ['Discord · salks', false] };
for (const [id, [label, accent]] of Object.entries(BUTTONS)) {
  both(`btn-${id}`, (t) => {
    const w = Math.round(label.length * 8.1 + 48), h = 46;
    const fill = accent ? t.accent : t.card;
    return svg(w, h, label, fonts(600), `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="8" fill="${fill}" stroke="${accent ? fill : t.line}"/>
<text x="${w / 2}" y="28.5" text-anchor="middle" font-size="15" font-weight="600" fill="${accent ? t.onAccent : t.text}">${esc(label)}</text>`);
  });
}

/* ------------------------------------------------------------- pied de page */

both('footer', (t) => svg(W, 110, 'Salks.', fonts(800), `<g transform="translate(${W / 2 - 403 * 0.32 / 2} 72) scale(.32)">${logo(t, false)}</g>`));

console.log('assets statiques générés');
