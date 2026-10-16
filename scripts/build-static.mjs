// Génère les SVG statiques du profil dans la DA des vitrines Salks. : ouverture,
// cover, en-têtes de section, panthéon, index des projets, parcours, stack,
// boutons et pied de page. Un fichier par thème (sombre, clair).
// Usage : node scripts/build-static.mjs
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { THEMES, fonts, esc, write, svg, GREEK_NUM, ROOT } from './theme.mjs';
import { PANTHEON, byId, art } from './pantheon.mjs';

const W = 900;
const both = (name, fn) => {
  for (const [mode, t] of Object.entries(THEMES)) write(`assets/${name}-${mode}.svg`, fn(t, mode));
};
/** Couleur d'une divinité dans le thème courant. */
const hueOf = (g, mode) => (mode === 'dark' ? g.hue : g.hueLight);
const rule = (y, color, x1 = 0, x2 = W) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}"/>`;

/* ------------------------------------------------------------- le logo */

// « Salks. » : le S porte sa barre, le point ferme le mot.
// Mesures relevées dans Chrome pour Plus Jakarta Sans 800 à 150 px, letter-spacing -5.
const LOGO_ADV = 364;
function logo(t, id = 'cut') {
  // le masque creuse l'espace entre le S et sa barre : fond transparent, pas de contour
  return `<g>
    <mask id="${id}" maskUnits="userSpaceOnUse" x="-60" y="-220" width="520" height="300">
      <rect x="-60" y="-220" width="520" height="300" fill="#fff"/>
      <polygon points="-26,6 44,6 84,-47 9,-47" fill="#000"/>
    </mask>
    <text x="0" y="0" font-size="150" font-weight="800" letter-spacing="-5" fill="${t.text}" mask="url(#${id})">Salks</text>
    <polygon points="-18,0 38,0 68,-36 12,-36" fill="${t.accent}"/>
    <circle cx="${LOGO_ADV + 22}" cy="-17" r="17" fill="${t.accent}"/>
  </g>`;
}

/* ------------------------------------------------------------ l'ouverture */

// Comme l'en-tête et l'ouverture d'une vitrine : le nom, une phrase en serif,
// le chapeau, les faits ; à droite l'index du panthéon, chaque projet à sa couleur.
both('hero', (t, mode) => {
  const H = 440, SPLIT = 620;
  const index = PANTHEON.map((g, i) => {
    const y = 132 + i * 30;
    return `<g class="r" style="animation-delay:${(0.5 + i * 0.06).toFixed(2)}s">
<circle cx="${SPLIT + 34}" cy="${y - 5}" r="4" fill="${hueOf(g, mode)}"/>
<text x="${SPLIT + 50}" y="${y}" class="serif" font-size="17" fill="${t.text}">${esc(g.god)}</text>
<text x="${W - 30}" y="${y}" text-anchor="end" class="mono" font-size="10.5" letter-spacing="1" fill="${t.faint}">${esc(g.name.toUpperCase())}</text></g>`;
  }).join('\n');
  return svg(W, H, 'Salks. — Ensemble, construisons quelque chose de grand.', fonts(800, 400, 'mono', 'serif', 'italic'),
  `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="3" fill="${t.bg}" stroke="${t.rule}"/>
<g transform="translate(30 41) scale(.17)">${logo(t)}</g>
<text x="${W - 30}" y="36" text-anchor="end" class="mono" font-size="11" letter-spacing="2.4" fill="${t.faint}">FREELANCE · MINECRAFT · WEB</text>
${rule(60.5, t.rule)}
<text x="30" y="112" class="mono r" font-size="12" letter-spacing="2" fill="${t.muted}"><tspan fill="${t.accent}">SALKS.</tspan> · DÉVELOPPEUR MINECRAFT &amp; WEB</text>
<text x="30" y="180" class="serif r" font-size="54" letter-spacing="-1.2" fill="${t.text}" style="animation-delay:.08s">Ensemble, construisons</text>
<text x="30" y="242" class="it r" font-size="54" letter-spacing="-1.2" fill="${t.text}" style="animation-delay:.16s">quelque chose de grand<tspan class="serif" font-style="normal" fill="${t.accent}">.</tspan></text>
<g class="r" style="animation-delay:.24s">
<text x="30" y="292" font-size="16.5" fill="${t.muted}">Plugins et mods Minecraft Java &amp; Bedrock, sites, panels et API,</text>
<text x="30" y="317" font-size="16.5" fill="${t.muted}">du schéma de base jusqu’à la mise en prod. Aujourd’hui en freelance.</text>
</g>
${rule(364.5, t.rule, 30, SPLIT - 30)}
<text x="30" y="396" class="r" font-size="13.5" fill="${t.faint}" style="animation-delay:.32s;white-space:pre">France · Remote     Discord salks     @EarthQuestMc     salks.me</text>
<line x1="${SPLIT + 0.5}" y1="61" x2="${SPLIT + 0.5}" y2="${H}" stroke="${t.rule}"/>
<text x="${SPLIT + 34}" y="100" class="mono" font-size="11" letter-spacing="2" fill="${t.muted}"><tspan class="it" font-size="17" letter-spacing="0" fill="${t.accent}">${PANTHEON.length}</tspan><tspan dx="10">LE PANTHÉON</tspan></text>
${index}`);
});

/* -------------------------------------------------------------- la cover */

{
  const img = readFileSync(join(ROOT, 'scripts', 'cover.jpg')).toString('base64');
  const H = Math.round(W * 788 / 1400);
  const cap = 'Salks à son bureau, version Minecraft';
  const cw = cap.length * 6.6 + 26;
  both('cover', (t) => svg(W, H, cap, fonts('mono'), `<defs><clipPath id="c"><rect width="${W}" height="${H}" rx="3"/></clipPath></defs>
<image href="data:image/jpeg;base64,${img}" width="${W}" height="${H}" clip-path="url(#c)" preserveAspectRatio="xMidYMid slice"/>
<rect x="${W - cw}" y="${H - 30}" width="${cw}" height="30" fill="${t.bg}"/>
<line x1="${W - cw}" y1="${H - 30.5}" x2="${W}" y2="${H - 30.5}" stroke="${t.rule}"/><line x1="${W - cw + 0.5}" y1="${H - 30}" x2="${W - cw + 0.5}" y2="${H}" stroke="${t.rule}"/>
<text x="${W - cw / 2}" y="${H - 11}" text-anchor="middle" class="mono" font-size="11" letter-spacing=".8" fill="${t.faint}">${esc(cap)}</text>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="3" fill="none" stroke="${t.rule}"/>`));
}

/* ---------------------------------------------------- en-têtes de section */

// Même gabarit que <SectionHead> des vitrines : numéro grec, intitulé, titre en serif, chapeau.
const SECTIONS = [
  ['about', 'Qui suis-je', 'Développeur Minecraft et web.', ''],
  ['projects', 'Projets', 'Ce que j’ai construit.', 'Chaque projet porte le nom d’une divinité grecque, et se documente sur Chronos.'],
  ['journey', 'Parcours', 'D’un premier plugin à l’indépendance.', ''],
  ['stack', 'Compétences', 'Ce avec quoi je travaille.', ''],
  ['activity', 'Activité', 'Mon année en code.', ''],
  ['guestbook', 'Livre d’or', 'Passe dire bonjour.', 'Ton message apparaît ici quelques secondes après.'],
  ['contact', 'Contact', 'Un projet en tête ? Parlons-en.', 'Décris ton besoin en quelques lignes, je reviens vers toi rapidement.'],
];
SECTIONS.forEach(([id, label, title, intro], i) => {
  both(`section-${id}`, (t) => {
    const H = intro ? 172 : 136;
    // le point final prend la couleur de la marque
    const body = title.replace(/[.?]$/, '');
    const end = title.slice(body.length);
    return svg(W, H, title, fonts(400, 'mono', 'serif', 'italic'), `${rule(0.5, t.rule2)}
<g class="r"><text x="0" y="56" class="it" font-size="21" fill="${t.accent}">${GREEK_NUM[i]}</text>
<text x="34" y="54" class="mono" font-size="12" letter-spacing="2" fill="${t.muted}">${esc(label.toUpperCase())}</text></g>
<text x="0" y="110" class="serif r" font-size="44" letter-spacing="-.8" fill="${t.text}" style="animation-delay:.08s">${esc(body)}<tspan fill="${t.accent}">${esc(end)}</tspan></text>
${intro ? `<text x="0" y="150" font-size="16.5" fill="${t.muted}" class="r" style="animation-delay:.16s">${esc(intro)}</text>` : ''}`);
  });
});

/* --------------------------------------------------------------- panthéon */

// Une case par divinité, séparées par des filets : le dessin au trait, puis le nom.
both('pantheon', (t, mode) => {
  const PER = 3, CW = W / PER, CH = 312;
  const rows = Math.ceil(PANTHEON.length / PER), H = rows * CH;
  const cells = PANTHEON.map((g, i) => {
    const x = (i % PER) * CW, y = Math.floor(i / PER) * CH, hue = hueOf(g, mode);
    return `<g class="r" style="animation-delay:${(0.06 * i).toFixed(2)}s">
<svg x="${x}" y="${y + 18}" width="${CW}" height="196" viewBox="80 180 640 880" preserveAspectRatio="xMidYMid meet">
  <g fill="none" stroke="${hue}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${art(g, hue)}</g>
</svg>
<text x="${x + 24}" y="${y + 246}" class="mono" font-size="10.5" letter-spacing="1.6" fill="${hue}">${esc(g.greek)}</text>
<text x="${x + CW - 24}" y="${y + 246}" text-anchor="end" class="it" font-size="16" fill="${t.faint}">${GREEK_NUM[i]}</text>
<text x="${x + 24}" y="${y + 278}" class="serif" font-size="27" letter-spacing="-.4" fill="${t.text}">${esc(g.god)}<tspan fill="${hue}">.</tspan></text>
<text x="${x + 24}" y="${y + 299}" class="mono" font-size="10.5" letter-spacing="1.2" fill="${t.faint}">${esc(`${g.name} · ${g.role}`.toUpperCase())}</text>
</g>`;
  }).join('\n');
  const grid = [
    ...Array.from({ length: PER - 1 }, (_, k) => `<line x1="${(k + 1) * CW}" y1="0" x2="${(k + 1) * CW}" y2="${H}" stroke="${t.rule}"/>`),
    ...Array.from({ length: rows - 1 }, (_, k) => rule((k + 1) * CH, t.rule)),
  ].join('');
  return svg(W, H, `Le panthéon : ${PANTHEON.map((g) => g.god).join(', ')}`, fonts('mono', 'serif', 'italic'),
    `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="3" fill="${t.bg2}" stroke="${t.rule}"/>
${grid}
${cells}`);
});

/* ------------------------------------------------------ index des projets */

// Une rangée par projet, comme l'index de l'accueil de Chronos. Chaque rangée est
// une image à part, pour que le README la rende cliquable vers le site du projet.
export const PROJECTS = [
  { file: 'chronos', god: 'chronos', cat: 'Documentation', state: 'live', name: 'Chronos',
    sub: ['La doc de tous mes projets, en français et en anglais,', 'avec la Pythie pour trouver la bonne page.'],
    tags: ['Docusaurus', 'React', 'TypeScript'] },
  { file: 'kern', god: 'kern', cat: 'Desktop', state: 'wip', name: 'Kern',
    sub: ['Mon poste de commande : projets locaux, Git,', 'GitHub, Trello et agents IA au même endroit.'],
    tags: ['Tauri', 'Rust', 'React'] },
  { file: 'hermes', god: 'hermes', cat: 'Bot Discord', state: 'live', name: 'Hermès',
    sub: ['Le bot du freelance, de la commande à l’avis.', 'Gratuit, hébergé, réglé depuis un panel web.'],
    tags: ['TypeScript', 'discord.js', 'MySQL'] },
  { file: 'mnemosyne', god: 'mnemosyne', cat: 'Bot PRONOTE', state: 'live', name: 'Mnémosyne',
    sub: ['PRONOTE dans tes messages Discord : brief du', 'matin, notifications, sac du lendemain.'],
    tags: ['TypeScript', 'discord.js', 'pawnote'] },
  { file: 'calliope', god: 'calliope', cat: 'Bac de français', state: 'live', name: 'Calliope',
    sub: ['Tes fiches du bac de français, de l’oral à l’écrit,', 'exportées en PDF ou en Word. Sans inscription.'],
    tags: ['Next.js', 'React', 'TypeScript'] },
  { file: 'myschool', god: 'athena', cat: 'Mobile & desktop', state: 'live', name: 'MySchool',
    sub: ['Mon classeur archivé sur Windows et Android.', 'Le scanner est piloté en HTTP, sans driver.'],
    tags: ['Flutter', 'Dart', 'Supabase'] },
  { file: 'minecraft', god: 'gaia', cat: 'Mods & plugins', state: 'wip', name: 'Minecraft',
    sub: ['Mods Forge et plugins Bukkit / PocketMine,', 'Java et Bedrock, pour EarthQuest et EarthReborn.'],
    tags: ['Java', 'Forge', 'Bukkit'] },
  { file: 'portfolio', god: 'apollon', cat: 'Web', state: 'wip', name: 'Portfolio',
    sub: ['Site bilingue piloté par la base, avec un studio', 'local pour tout modifier sans toucher au code.'],
    tags: ['Next.js', 'Prisma', 'PostgreSQL'] },
  { file: 'gameoflife', god: 'promethee', cat: 'Jeu', state: 'wip', name: 'GameOfLife',
    sub: ['Jeu multijoueur : API temps réel, client mobile', 'et panel d’administration complet.'],
    tags: ['TypeScript', 'Fastify', 'Socket.IO'] },
];
const STATES = { live: 'En ligne', wip: 'En cours' };

rmSync(join(ROOT, 'assets', 'projects'), { recursive: true, force: true });
PROJECTS.forEach((p, i) => {
  const g = byId[p.god];
  both(`projects/${p.file}`, (t, mode) => {
    const H = 118, hue = hueOf(g, mode);
    return svg(W, H, `${p.name} · ${g.god} — ${p.sub.join(' ')}`, fonts(400, 'mono', 'serif', 'italic'), `${i === 0 ? rule(0.5, t.rule2) : ''}
${rule(H - 0.5, t.rule)}
<g class="r">
<text x="0" y="52" class="it" font-size="20" fill="${hue}">${String(i + 1).padStart(2, '0')}</text>
<text x="46" y="56" class="serif" font-size="36" letter-spacing="-.6" fill="${t.text}">${esc(p.name)}<tspan fill="${hue}">.</tspan></text>
<text x="46" y="86" class="mono" font-size="10.5" letter-spacing="1.4" fill="${t.faint}">${esc(`${g.god} · ${p.cat}`.toUpperCase())}</text>
<text x="350" y="46" font-size="14.5" fill="${t.muted}">${esc(p.sub[0])}</text>
<text x="350" y="68" font-size="14.5" fill="${t.muted}">${esc(p.sub[1])}</text>
<text x="350" y="94" class="mono" font-size="10.5" letter-spacing="1.2" fill="${t.faint}">${esc(p.tags.join(' · ').toUpperCase())}</text>
<text x="${W}" y="46" text-anchor="end" class="mono" font-size="10.5" letter-spacing="1.4" fill="${t[p.state]}">${STATES[p.state].toUpperCase()}</text>
<text x="${W}" y="80" text-anchor="end" font-size="18" fill="${hue}">→</text>
</g>`);
  });
});

/* ---------------------------------------------------------------- parcours */

// Repris de la table Experience du portfolio : des rangées à filets.
const JOURNEY = [
  { period: '2025 — auj.', title: 'Développement Java & Minecraft', org: 'EarthQuestMC', current: true,
    desc: 'Plugins et mods pour plusieurs versions du jeu, fonctionnalités et systèmes du serveur.' },
  { period: '2024 — auj.', title: 'Développement web', org: 'EarthQuestMC', current: true,
    desc: 'Panel d’administration, site web, API publique et privée du serveur, et des bots Discord.' },
  { period: '2023 — 2025', title: 'Développement PocketMine-MP', org: 'EarthRebornMC',
    desc: 'Serveurs Bedrock sous PocketMine-MP 5 : plugins sur mesure et Resource Packs.' },
];
both('journey', (t) => {
  const RH = 100, H = JOURNEY.length * RH + 1;
  const rows = JOURNEY.map((j, i) => {
    const y = i * RH;
    return `<g class="r" style="animation-delay:${i * 0.1}s">
<text x="0" y="${y + 44}" class="mono" font-size="11" letter-spacing="1.6" fill="${t.faint}">${esc(j.period.toUpperCase())}</text>
<text x="190" y="${y + 46}" class="serif" font-size="24" letter-spacing="-.3" fill="${t.text}">${esc(j.title)}<tspan dx="12" font-family="'Jakarta'" font-size="14" fill="${t.faint}">${esc(j.org)}</tspan></text>
${j.current ? `<text x="${W}" y="${y + 44}" text-anchor="end" class="mono" font-size="10.5" letter-spacing="1.4" fill="${t.accent}">EN COURS</text>` : ''}
<text x="190" y="${y + 74}" font-size="14.5" fill="${t.muted}">${esc(j.desc)}</text>
${rule(y + RH + 0.5, t.rule)}
</g>`;
  }).join('\n');
  return svg(W, H, 'Mon parcours', fonts(400, 'mono', 'serif'), `${rule(0.5, t.rule2)}\n${rows}`);
});

/* ------------------------------------------------------------------- stack */

const STACK = [
  ['Langages', ['Java', 'TypeScript', 'JavaScript', 'PHP', 'Rust', 'Dart']],
  ['Minecraft', ['#Java', 'Forge 1.7.10', 'Bukkit / Spigot', '#Bedrock', 'PocketMine-MP', 'Resource Packs']],
  ['Web & desktop', ['Next.js', 'React', 'Docusaurus', 'Tailwind', 'Tauri', 'Flutter']],
  ['Données & outils', ['PostgreSQL', 'Redis', 'Supabase', 'Docker', 'Git', 'GitHub Actions']],
];
both('stack', (t) => {
  const CW = W / 4, H = 286;
  const cols = STACK.map(([cat, items], i) => {
    const x = i * CW + (i ? 26 : 0);
    // « #Titre » ouvre un sous-groupe (Java / Bedrock dans la colonne Minecraft)
    const list = items.map((it, k) => it.startsWith('#')
      ? `<text x="${x}" y="${82 + k * 32}" class="it" font-size="17" fill="${t.accent}">${esc(it.slice(1))}</text>`
      : `<text x="${x}" y="${82 + k * 32}" font-size="15" fill="${t.text}">${esc(it)}</text>`).join('');
    return `<g class="r" style="animation-delay:${i * 0.08}s">${i ? `<line x1="${i * CW + 0.5}" y1="0" x2="${i * CW + 0.5}" y2="${H}" stroke="${t.rule}"/>` : ''}
<text x="${x}" y="40" class="mono" font-size="11" letter-spacing="1.6" fill="${t.faint}">${esc(cat.toUpperCase())}</text>${list}</g>`;
  }).join('\n');
  return svg(W, H, 'Compétences : ' + STACK.map(([c, it]) => `${c} : ${it.map((s) => s.replace('#', '')).join(', ')}`).join(' · '),
    fonts(400, 'mono', 'italic'), `${rule(0.5, t.rule2)}\n${cols}\n${rule(H - 0.5, t.rule)}`);
});

/* ----------------------------------------------------------------- boutons */

// .v-btn-solid et .v-btn des vitrines : plein (couleur du texte) ou filet.
const BUTTONS = {
  projects: ['Voir mes projets  →', true], contact: ['Me contacter', false], guestbook: ['Signer le livre d’or', true],
  email: ['Écrire un email', true], discord: ['Discord · salks', false], portfolio: ['Le portfolio · salks.me', false],
};
for (const [id, [label, solid]] of Object.entries(BUTTONS)) {
  both(`btn-${id}`, (t) => {
    const w = Math.round(label.length * 8 + 44), h = 46;
    return svg(w, h, label.replace('  →', ''), fonts(600), `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="3" fill="${solid ? t.text : 'none'}" stroke="${solid ? t.text : t.rule2}"/>
<text x="${w / 2}" y="28.5" text-anchor="middle" font-size="15" font-weight="600" fill="${solid ? t.onSolid : t.text}">${esc(label)}</text>`);
  });
}

/* ------------------------------------------------- colophon et pied de page */

// Le colophon des vitrines : le nom en grand, en creux, puis la signature.
both('footer', (t, mode) => {
  const H = 250;
  const dots = PANTHEON.map((g, i) => `<circle cx="${W - 8 - (PANTHEON.length - 1 - i) * 16}" cy="216" r="4" fill="${hueOf(g, mode)}"/>`).join('');
  return svg(W, H, 'Salks. — Ensemble, construisons quelque chose de grand.', fonts(800, 'mono', 'serif'), `<text x="-6" y="132" class="serif" font-size="170" letter-spacing="6" fill="${t.bg3}">SALKS</text>
${rule(170.5, t.rule)}
<g transform="translate(0 222) scale(.15)">${logo(t, 'cutf')}</g>
<text x="96" y="219" class="mono" font-size="10.5" letter-spacing="1.6" fill="${t.faint}">ENSEMBLE, CONSTRUISONS QUELQUE CHOSE DE GRAND<tspan fill="${t.accent}">.</tspan></text>
<text x="${W}" y="194" text-anchor="end" class="mono" font-size="10.5" letter-spacing="1.4" fill="${t.faint}">© ${new Date().getFullYear()} SALKS. · SALKS.ME</text>
${dots}`);
});

// Les anciennes frises de grecques sont remplacées par les filets des en-têtes.
for (const mode of Object.keys(THEMES)) rmSync(join(ROOT, 'assets', `meander-${mode}.svg`), { force: true });

console.log('assets statiques générés');
