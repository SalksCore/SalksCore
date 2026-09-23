// Génère les cartes de stats du profil à partir de l'API GraphQL de GitHub, dans la DA Salks.
// Aucun service tiers : les SVG sont écrits dans assets/generated/ et commités par l'Action.
// Usage : GH_TOKEN=xxx node scripts/generate-stats.mjs [login]
import { THEMES, fonts, SANS, MONO, esc, write, REVEAL } from './theme.mjs';

const LOGIN = process.argv[2] || process.env.GH_LOGIN || 'SalksCore';
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!TOKEN) throw new Error('GH_TOKEN manquant');

const W = 900;
const fmt = (n) => n.toLocaleString('fr-FR').replace(/ | /g, ' ');

/* -------------------------------------------------------------- données */

const LANGS = 'languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name } } }';
const QUERY = `query($login: String!) {
  user(login: $login) {
    pullRequests { totalCount }
    repositories(ownerAffiliations: OWNER, isFork: false, first: 100) { nodes { ${LANGS} } }
    repositoriesContributedTo(first: 100, includeUserRepositories: false, contributionTypes: [COMMIT, PULL_REQUEST]) { nodes { ${LANGS} } }
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } }
    }
  }
}`;

async function fetchUser() {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'salks-profile' },
    body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors || json));
  return json.data.user;
}

function streaks(days) {
  let longest = 0, run = 0;
  for (const d of days) {
    run = d.contributionCount > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // aujourd'hui peut encore être vide sans casser la série
  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].contributionCount === 0) i--;
  for (; i >= 0 && days[i].contributionCount > 0; i--) current++;
  return { current, longest };
}

function languages(repos) {
  const map = new Map();
  for (const r of repos) for (const e of r.languages.edges) map.set(e.node.name, (map.get(e.node.name) || 0) + e.size);
  const all = [...map].map(([name, size]) => ({ name, size })).sort((a, b) => b.size - a.size);
  const total = all.reduce((s, l) => s + l.size, 0) || 1;
  const top = all.slice(0, 6).filter((l) => l.size / total >= 0.01);
  const rest = total - top.reduce((s, l) => s + l.size, 0);
  if (rest / total >= 0.01) top.push({ name: 'Autres', size: rest });
  return top.map((l) => ({ ...l, pct: (l.size / total) * 100 }));
}

/* ---------------------------------------------------------------- cartes */

const svg = (h, label, css, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-label="${esc(label)}">
<style>
${css}
text{font-family:${SANS}}
.mono{font-family:${MONO}}
${REVEAL}
</style>
${body}
</svg>
`;

// Les « chiffres clés » du hero du portfolio : valeur en gras, suffixe violet, légende discrète.
function tiles(s, t) {
  const items = [
    [fmt(s.total), '', 'contributions en 12 mois'],
    [fmt(s.commits), '', 'commits'],
    [String(s.activeDays), ' j', 'jours actifs'],
    [String(s.longest), ' j', 'meilleure série'],
  ];
  const GAP = 10, CW = (W - GAP * 3) / 4, H = 120;
  const body = items.map(([v, suf, label], i) => {
    const x = i * (CW + GAP);
    return `<g class="r" style="animation-delay:${i * 0.07}s">
<rect x="${x + 0.5}" y=".5" width="${CW - 1}" height="${H - 1}" rx="8" fill="${t.card}" stroke="${t.line}"/>
<text x="${x + CW / 2}" y="60" text-anchor="middle" font-size="32" font-weight="800" fill="${t.text}">${v}<tspan fill="${t.accent}">${suf || '.'}</tspan></text>
<text x="${x + CW / 2}" y="90" text-anchor="middle" font-size="13" fill="${t.muted}">${label}</text></g>`;
  }).join('\n');
  return svg(H, 'Chiffres clés', fonts(800, 400), body);
}

// Un seul violet : chaque langage prend une teinte de la rampe, du plus fort au plus pâle.
function langCard(langs, t) {
  const H = 196, BW = W - 56;
  const shades = [t.ramp[4], t.ramp[3], t.ramp[2], t.ramp[1], t.muted, t.faint, t.lineStrong];
  let x = 0;
  const segs = langs.map((l, i) => {
    const w = Math.max(3, (l.pct / 100) * BW);
    const s = `<rect x="${x.toFixed(1)}" width="${(w - 2).toFixed(1)}" height="10" rx="2" fill="${shades[i]}"/>`;
    x += w;
    return s;
  }).join('');
  const cols = 4, colW = BW / cols;
  const legend = langs.map((l, i) => {
    const cx = 28 + (i % cols) * colW, cy = 118 + Math.floor(i / cols) * 34;
    return `<g class="r" style="animation-delay:${(0.4 + i * 0.06).toFixed(2)}s"><rect x="${cx}" y="${cy - 10}" width="10" height="10" rx="2" fill="${shades[i]}"/>
<text x="${cx + 18}" y="${cy}" font-size="14" font-weight="600" fill="${t.text}">${esc(l.name)}</text>
<text x="${cx + colW - 24}" y="${cy}" text-anchor="end" class="mono" font-size="12" fill="${t.muted}">${l.pct.toFixed(1)}%</text></g>`;
  }).join('\n');
  const css = `${fonts(600, 'mono')}
.bar{transform:scaleX(0);transform-origin:left;animation:grow 1.2s cubic-bezier(.22,1,.36,1) .15s forwards}
@keyframes grow{to{transform:scaleX(1)}}`;
  return svg(H, 'Langages', css, `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="8" fill="${t.card}" stroke="${t.line}"/>
<text x="28" y="40" class="mono" font-size="11" letter-spacing="1.6" fill="${t.faint}">LANGAGES</text>
<g transform="translate(28 62)"><g class="bar">${segs}</g></g>
${legend}`);
}

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

function activityCard(weeks, s, t) {
  const n = weeks.length, X0 = 56, STEP = (W - X0 - 28) / n, CELL = STEP - 3, Y0 = 86;
  const H = Y0 + 7 * STEP + 50;
  const counts = weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount)).filter((c) => c > 0).sort((a, b) => a - b);
  const q = (p) => counts[Math.floor((counts.length - 1) * p)] ?? 1;
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  const level = (c) => (c === 0 ? 0 : c <= q1 ? 1 : c <= q2 ? 2 : c <= q3 ? 3 : 4);

  let cells = '', months = '', last = -1;
  weeks.forEach((w, wi) => {
    const first = new Date(w.contributionDays[0].date);
    const m = first.getUTCMonth();
    if (m !== last) {
      if (wi > 0 && wi < n - 2) months += `<text x="${(X0 + wi * STEP).toFixed(1)}" y="${Y0 - 12}" class="mono" font-size="10.5" fill="${t.faint}">${MONTHS[m]}</text>`;
      last = m;
    }
    for (const d of w.contributionDays) {
      const wd = new Date(d.date).getUTCDay();
      cells += `<rect x="${(X0 + wi * STEP).toFixed(1)}" y="${(Y0 + wd * STEP).toFixed(1)}" width="${CELL.toFixed(1)}" height="${CELL.toFixed(1)}" rx="2.5" fill="${t.ramp[level(d.contributionCount)]}" style="animation-delay:${(wi * 0.018).toFixed(3)}s"/>`;
    }
  });
  const days = [[1, 'lun.'], [3, 'mer.'], [5, 'ven.']].map(([i, d]) => `<text x="${X0 - 10}" y="${(Y0 + i * STEP + CELL - 2).toFixed(1)}" text-anchor="end" class="mono" font-size="10.5" fill="${t.faint}">${d}</text>`).join('');
  const LX = W - 28 - 5 * 15 - 34;
  const legend = t.ramp.map((c, i) => `<rect x="${LX + i * 15}" y="${H - 34}" width="11" height="11" rx="2" fill="${c}"/>`).join('');
  const updated = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });
  const css = `${fonts(600, 400, 'mono')}
.cells rect{opacity:0;transform-box:fill-box;transform-origin:center;animation:pop .5s cubic-bezier(.22,1,.36,1) forwards}
@keyframes pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}`;
  return svg(H, `${s.total} contributions sur les 12 derniers mois`, css, `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="8" fill="${t.card}" stroke="${t.line}"/>
<text x="28" y="40" class="mono" font-size="11" letter-spacing="1.6" fill="${t.faint}">12 DERNIERS MOIS</text>
<text x="${W - 28}" y="40" text-anchor="end" font-size="13" fill="${t.muted}">série en cours <tspan font-weight="600" fill="${t.accent}">${s.current} j</tspan></text>
${months}${days}
<g class="cells">${cells}</g>
<text x="28" y="${H - 24}" class="mono" font-size="10.5" fill="${t.faint}">MIS À JOUR LE ${esc(updated.toUpperCase())}</text>
<text x="${LX - 8}" y="${H - 24}" text-anchor="end" class="mono" font-size="10.5" fill="${t.faint}">moins</text>${legend}
<text x="${LX + 5 * 15 + 4}" y="${H - 24}" class="mono" font-size="10.5" fill="${t.faint}">plus</text>`);
}

/* ------------------------------------------------------------------ main */

const u = await fetchUser();
const cc = u.contributionsCollection;
const weeks = cc.contributionCalendar.weeks;
const days = weeks.flatMap((w) => w.contributionDays);
const stats = {
  total: cc.contributionCalendar.totalContributions,
  commits: cc.totalCommitContributions + cc.restrictedContributionsCount,
  prs: u.pullRequests.totalCount,
  activeDays: days.filter((d) => d.contributionCount > 0).length,
  ...streaks(days),
};
// dépôts perso + dépôts d'organisations où je contribue (les mods EarthQuest vivent chez @EarthQuestMc)
const langs = languages([...u.repositories.nodes, ...u.repositoriesContributedTo.nodes]);

for (const [mode, t] of Object.entries(THEMES)) {
  write(`assets/generated/tiles-${mode}.svg`, tiles(stats, t));
  write(`assets/generated/languages-${mode}.svg`, langCard(langs, t));
  write(`assets/generated/activity-${mode}.svg`, activityCard(weeks, stats, t));
}
console.log(JSON.stringify({ ...stats, langs: langs.map((l) => `${l.name} ${l.pct.toFixed(1)}%`) }));
