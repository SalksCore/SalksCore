// Le panthéon : chaque projet porte le nom d'une divinité grecque et son dessin au trait néon.
// Mêmes dessins que les fonds de Chronos (la doc de mes projets), sur une toile de 800 × 1200.
export const W = 800, H = 1200;
const CX = 400;
const f = (n) => Math.round(n * 10) / 10;

// Pseudo-aléatoire déterministe : les SVG ne changent pas d'une génération à l'autre.
export function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

// ─── Chronos : le cadran, ses graduations et ses aiguilles ──────────────────
function dial() {
  const cy = 560;
  const ticks = Array.from({length: 60}, (_, i) => `<line x1="0" y1="-250" x2="0" y2="${i % 5 ? -234 : -212}" stroke-width="${i % 5 ? 2 : 4}" opacity="${i % 5 ? 0.5 : 1}" transform="rotate(${i * 6})"/>`).join('');
  const numerals = ['XII', 'III', 'VI', 'IX'].map((n, i) => {
    const a = (i * 90 - 90) * Math.PI / 180;
    return `<text x="${f(Math.cos(a) * 172)}" y="${f(Math.sin(a) * 172 + 12)}" text-anchor="middle" font-family="serif" font-size="34" fill="currentColor" stroke="none" opacity=".8">${n}</text>`;
  }).join('');
  return `<g transform="translate(${CX} ${cy})">
    <circle r="290" opacity=".35"/><circle r="262"/>${ticks}${numerals}
    <circle r="120" stroke-dasharray="3 14" opacity=".6"/>
    <g transform="rotate(-60)"><line x1="0" y1="18" x2="0" y2="-120" stroke-width="7"/><animateTransform attributeName="transform" type="rotate" from="-60" to="300" dur="720s" repeatCount="indefinite"/></g>
    <g transform="rotate(60)"><line x1="0" y1="26" x2="0" y2="-200" stroke-width="4"/><animateTransform attributeName="transform" type="rotate" from="60" to="420" dur="60s" repeatCount="indefinite"/></g>
    <circle r="14" fill="currentColor"/>
  </g>
  <path d="M${CX - 70} 930 L${CX + 70} 930 L${CX + 18} 1010 L${CX + 70} 1090 L${CX - 70} 1090 L${CX - 18} 1010 Z" opacity=".7"/>
  <path d="M${CX - 44} 944 L${CX + 44} 944 L${CX} 1000 Z" fill="currentColor" fill-opacity=".25" opacity=".7"/>`;
}

// ─── Kern · Héphaïstos : l'enclume, le marteau et l'engrenage ───────────────
function forge() {
  const gear = `<g transform="translate(${CX} 380)">
    <circle r="150" stroke-width="22" stroke-dasharray="20 15" opacity=".9"/>
    <circle r="112"/><circle r="34"/><circle r="12" fill="currentColor"/>
    ${Array.from({length: 6}, (_, i) => `<line x1="0" y1="-38" x2="0" y2="-108" transform="rotate(${i * 60})"/>`).join('')}
  </g>`;
  const anvil = `<path d="M150 735 C220 720 260 712 300 712 L600 712 L600 762 L560 762 C530 778 520 800 520 830 L562 878 L585 902 L215 902 L238 878 L280 830 C280 800 270 778 242 768 C212 760 182 750 150 735 Z"/>
    <line x1="300" y1="736" x2="580" y2="736" opacity=".5"/>
    <path d="M190 902 L610 902 L640 960 L160 960 Z" opacity=".6"/>`;
  const hammer = `<g transform="translate(560 560) rotate(-32)">
    <rect x="-8" y="-10" width="16" height="190" rx="6"/>
    <rect x="-62" y="-52" width="124" height="46" rx="8"/>
    <line x1="-40" y1="-29" x2="40" y2="-29" opacity=".5"/>
  </g>`;
  const r = rng(7);
  const sparks = Array.from({length: 26}, () => {
    const a = -Math.PI / 2 + (r() - 0.5) * 2.4, l = 20 + r() * 70, x = 420 + (r() - 0.5) * 40, y = 700;
    return `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + Math.cos(a) * l)}" y2="${f(y + Math.sin(a) * l)}" stroke-width="${f(1 + r() * 2)}" opacity="${f(0.4 + r() * 0.6)}"/>`;
  }).join('');
  return gear + anvil + hammer + sparks;
}

// ─── Hermès : le caducée ailé ───────────────────────────────────────────────
function wings() {
  const wing = (side) => Array.from({length: 6}, (_, i) => {
    const s = side, y0 = 340, len = 130 + i * 42, rise = 120 - i * 14;
    const tx = CX + s * (40 + len), ty = y0 - rise + i * 26;
    return `<path d="M${CX + s * 18} ${y0 + i * 6} C${f(CX + s * (60 + len * 0.4))} ${f(y0 - rise - 30)} ${f(tx - s * 30)} ${f(ty - 40)} ${f(tx)} ${f(ty)} C${f(tx - s * 60)} ${f(ty + 18)} ${f(CX + s * 80)} ${y0 + 30 + i * 8} ${CX + s * 18} ${y0 + 20 + i * 6}" opacity="${f(1 - i * 0.1)}"/>`;
  }).join('');
  const snake = (phase) => {
    const pts = [];
    for (let y = 440; y <= 960; y += 8) {
      const amp = 90 * (1 - (y - 440) / 700);
      pts.push(`${f(CX + Math.sin((y - 440) / 62 + phase) * amp)} ${y}`);
    }
    return `<path d="M${pts.join(' L')}"/>`;
  };
  return `<line x1="${CX}" y1="300" x2="${CX}" y2="1010" stroke-width="5"/>
    <circle cx="${CX}" cy="282" r="18"/><circle cx="${CX}" cy="282" r="6" fill="currentColor"/>
    ${wing(-1)}${wing(1)}${snake(0)}${snake(Math.PI)}
    <circle cx="${f(CX + Math.sin(Math.PI) * 90)}" cy="436" r="10"/><circle cx="${CX}" cy="436" r="10" opacity=".6"/>
    ${Array.from({length: 8}, (_, i) => `<line x1="${60 + i * 12}" y1="${600 + i * 38}" x2="${230 + i * 6}" y2="${600 + i * 38}" opacity="${f(0.25 + (i % 3) * 0.15)}"/>`).join('')}
    ${Array.from({length: 8}, (_, i) => `<line x1="${570 - i * 6}" y1="${620 + i * 38}" x2="${740 - i * 12}" y2="${620 + i * 38}" opacity="${f(0.25 + (i % 3) * 0.15)}"/>`).join('')}`;
}

// ─── MySchool · Athéna : la chouette devant le temple ───────────────────────
function stars() {
  const column = (x) => `<g opacity=".55"><rect x="${x - 36}" y="330" width="72" height="720" rx="4"/>
    <rect x="${x - 50}" y="300" width="100" height="30" rx="4"/><rect x="${x - 50}" y="1050" width="100" height="26" rx="4"/>
    ${[-18, 0, 18].map((d) => `<line x1="${x + d}" y1="348" x2="${x + d}" y2="1032"/>`).join('')}</g>`;
  const pediment = `<path d="M60 290 L${CX} 150 L740 290 Z" opacity=".55"/><line x1="60" y1="290" x2="740" y2="290" opacity=".55"/>`;
  const owl = `<g transform="translate(${CX} 0)">
    <path d="M-120 560 C-150 700 -130 850 0 900 C130 850 150 700 120 560 C100 470 -100 470 -120 560 Z"/>
    <path d="M-120 520 L-100 430 L-50 490"/><path d="M120 520 L100 430 L50 490"/>
    <circle cx="-55" cy="560" r="52"/><circle cx="55" cy="560" r="52"/>
    <circle cx="-55" cy="560" r="30" opacity=".6"/><circle cx="55" cy="560" r="30" opacity=".6"/>
    <circle cx="-55" cy="560" r="12" fill="currentColor"/><circle cx="55" cy="560" r="12" fill="currentColor"/>
    <path d="M-14 620 L0 660 L14 620 Z"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${-60 + i * 8} ${700 + i * 38} Q0 ${730 + i * 38} ${60 - i * 8} ${700 + i * 38}" opacity=".6"/>`).join('')}
    <path d="M-110 600 C-160 690 -140 800 -80 860" opacity=".7"/><path d="M110 600 C160 690 140 800 80 860" opacity=".7"/>
  </g>
  <path d="M200 920 Q${CX} 895 600 920"/>
  ${[250, 320, 480, 550].map((x, i) => `<ellipse cx="${x}" cy="${912 - (i % 2) * 6}" rx="22" ry="8" transform="rotate(${i % 2 ? 20 : -20} ${x} ${912})" opacity=".8"/>`).join('')}`;
  return column(130) + column(670) + pediment + owl;
}


// ─── Minecraft · Gaïa : le bloc d'herbe, la pousse et la pioche ─────────────
function blocks() {
  const K = 0.866;
  const cube = (cx, cy, s, grass = false, o = 1) => {
    const top = `${f(cx)},${f(cy - s)} ${f(cx + K * s)},${f(cy - s / 2)} ${f(cx)},${f(cy)} ${f(cx - K * s)},${f(cy - s / 2)}`;
    const left = `${f(cx - K * s)},${f(cy - s / 2)} ${f(cx)},${f(cy)} ${f(cx)},${f(cy + s)} ${f(cx - K * s)},${f(cy + s / 2)}`;
    const right = `${f(cx + K * s)},${f(cy - s / 2)} ${f(cx)},${f(cy)} ${f(cx)},${f(cy + s)} ${f(cx + K * s)},${f(cy + s / 2)}`;
    // bordure d'herbe en escalier, comme la texture du jeu
    const edge = (side) => {
      const pts = [];
      const n = 8;
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = cx + side * K * s * (1 - t), yTop = cy - s / 2 * (1 - t);
        pts.push(`${f(x)},${f(yTop + s * (i % 2 ? 0.22 : 0.14))}`);
      }
      return `<polyline points="${pts.join(' ')}" opacity=".8"/>`;
    };
    return `<g opacity="${o}"><polygon points="${top}"/><polygon points="${left}" opacity=".75"/><polygon points="${right}" opacity=".75"/>${grass ? edge(-1) + edge(1) : ''}</g>`;
  };
  const sapling = `<g transform="translate(${CX} 520)">
    <line x1="0" y1="0" x2="0" y2="-150" stroke-width="5"/>
    ${[[-40, -150], [0, -190], [40, -150], [-70, -110], [70, -110], [-30, -115], [30, -115]].map(([x, y]) => `<rect x="${x - 22}" y="${y - 22}" width="44" height="44" rx="3"/>`).join('')}
  </g>`;
  const pick = `<g transform="translate(610 330) rotate(35)">
    <rect x="-7" y="-10" width="14" height="190" rx="4"/>
    <path d="M-95 -6 Q0 -60 95 -6 L80 8 Q0 -30 -80 8 Z"/>
  </g>`;
  const r = rng(5);
  const floaters = Array.from({length: 6}, () => cube(90 + r() * 620, 200 + r() * 880, 18 + r() * 26, false, 0.35 + r() * 0.35)).join('');
  return floaters + cube(CX, 690, 170, true) + sapling + pick
    + `<path d="M120 1010 L680 1010" opacity=".4"/><path d="M180 1045 L620 1045" opacity=".25"/>`;
}

// ─── Mnémosyne : le livre, l'emploi du temps et la cloche ───────────────────
function memory() {
  const book = `<g transform="translate(${CX} 860)">
    <path d="M0 -10 C-80 -50 -200 -50 -270 -20 L-270 120 C-200 90 -80 90 0 130 Z"/>
    <path d="M0 -10 C80 -50 200 -50 270 -20 L270 120 C200 90 80 90 0 130 Z"/>
    <line x1="0" y1="-10" x2="0" y2="130"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M-235 ${10 + i * 20} C-170 ${-8 + i * 20} -80 ${-6 + i * 20} -30 ${16 + i * 20}" opacity=".45"/><path d="M235 ${10 + i * 20} C170 ${-8 + i * 20} 80 ${-6 + i * 20} 30 ${16 + i * 20}" opacity=".45"/>`).join('')}
  </g>`;
  // emploi du temps PRONOTE : 5 jours, quelques cours remplis
  const gx = 190, gy = 250, cw = 84, ch = 58;
  const cells = [];
  const filled = [[0, 0], [0, 1], [1, 2], [2, 0], [2, 3], [3, 1], [3, 2], [4, 0], [4, 4], [1, 4]];
  for (let c = 0; c < 5; c++) for (let l = 0; l < 6; l++) {
    const on = filled.some(([a, b]) => a === c && b === l);
    cells.push(`<rect x="${gx + c * cw + 4}" y="${gy + l * ch + 4}" width="${cw - 8}" height="${ch - 8}" rx="6" ${on ? 'fill="currentColor" fill-opacity=".18"' : 'opacity=".35"'}/>`);
  }
  const grid = `<g>${'LMMJV'.split('').map((d, i) => `<text x="${gx + i * cw + cw / 2}" y="${gy - 14}" text-anchor="middle" font-family="monospace" font-size="18" fill="currentColor" stroke="none" opacity=".7">${d}</text>`).join('')}${cells.join('')}</g>`;
  const bell = `<g transform="translate(650 180)">
    <path d="M-38 30 C-38 -10 -30 -42 0 -46 C30 -42 38 -10 38 30 L48 42 L-48 42 Z"/>
    <circle cx="0" cy="54" r="9"/><circle cx="34" cy="-36" r="11" fill="currentColor"/>
  </g>`;
  const r = rng(9);
  const wisps = Array.from({length: 7}, (_, i) => {
    const x0 = CX - 150 + i * 50, y0 = 840;
    return `<path d="M${x0} ${y0} C${f(x0 + (r() - 0.5) * 200)} ${f(y0 - 90)} ${f(x0 + (r() - 0.5) * 240)} ${f(y0 - 150)} ${f(x0 + (r() - 0.5) * 160)} ${f(y0 - 200 - r() * 60)}" opacity="${f(0.25 + r() * 0.35)}" stroke-dasharray="4 10"/>`;
  }).join('');
  return grid + bell + wisps + book;
}

export const PANTHEON = [
  {id: 'chronos', name: 'Chronos', greek: 'ΧΡΟΝΟΣ', god: 'Chronos', role: 'Documentation', hue: '#c4b5fd', deep: '#150f26', art: dial(), seed: 3},
  {id: 'kern', name: 'Kern', greek: 'ΗΦΑΙΣΤΟΣ', god: 'Héphaïstos', role: 'Desktop', hue: '#ff7a3d', deep: '#24110a', art: forge(), seed: 11},
  {id: 'hermes', name: 'Hermès', greek: 'ΕΡΜΗΣ', god: 'Hermès', role: 'Bot Discord', hue: '#9b7dff', deep: '#170f2e', art: wings(), seed: 23},
  {id: 'mnemosyne', name: 'Mnémosyne', greek: 'ΜΝΗΜΟΣΥΝΗ', god: 'Mnémosyne', role: 'Bot PRONOTE', hue: '#f472b6', deep: '#26101d', art: memory(), seed: 53},
  {id: 'gaia', name: 'EarthQuest', greek: 'ΓΑΙΑ', god: 'Gaïa', role: 'Minecraft', hue: '#5fd068', deep: '#0b1f0d', art: blocks(), seed: 41},
  {id: 'athena', name: 'MySchool', greek: 'ΑΘΗΝΑ', god: 'Athéna', role: 'Mobile', hue: '#3fd0c9', deep: '#08201f', art: stars(), seed: 37},
].map((p) => ({...p, art: p.art.replaceAll('currentColor', p.hue)}));

export const byId = Object.fromEntries(PANTHEON.map((p) => [p.id, p]));

/** Frise de grecques (méandre) : une clé en spirale tous les `step` px, posée sur un filet. */
export function meander(width, {step = 24, h = 20, color, opacity = 1} = {}) {
  const n = Math.floor(width / step), x0 = (width - n * step) / 2;
  const u = step / 6, k = h / 4; // grille : 6 unités de large, 4 de haut
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * step;
    d += `M${f(x)} ${f(h)} V0 H${f(x + 4 * u)} V${f(3 * k)} H${f(x + 1.5 * u)} V${f(1.4 * k)} H${f(x + 2.6 * u)} `;
  }
  return `<g fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" opacity="${opacity}"><path d="${d.trim()}"/><path d="M${f(x0)} ${f(h)} H${f(x0 + n * step)}"/></g>`;
}
