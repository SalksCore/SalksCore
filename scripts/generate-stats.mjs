// Génère les cartes de stats du profil à partir de l'API GraphQL de GitHub, dans la DA Salks.
// Aucun service tiers : les SVG sont écrits dans assets/generated/ et commités par l'Action.
// Usage : GH_TOKEN=xxx node scripts/generate-stats.mjs [login]
import { pathToFileURL } from 'node:url';
import { THEMES, fonts, esc, write, svg as frame } from './theme.mjs';

const LOGIN = process.argv[2] || process.env.GH_LOGIN || 'SalksCore';
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

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

const svg = (h, label, css, body) => frame(W, h, label, css, body);

// Mêmes gabarits que les vitrines : colonnes séparées par des filets, chiffres en serif.
export function tiles(s, t) {
  const items = [
    [fmt(s.total), 'contributions en 12 mois'],
    [fmt(s.commits), 'commits'],
    [`${s.activeDays} j`, 'jours actifs'],
    [`${s.longest} j`, 'meilleure série'],
  ];
  const CW = W / 4, H = 124;
  const body = items.map(([v, label], i) => {
    const x = i * CW + (i ? 28 : 0);
    return `<g class="r" style="animation-delay:${i * 0.07}s">${i ? `<line x1="${i * CW + 0.5}" y1="0" x2="${i * CW + 0.5}" y2="${H}" stroke="${t.rule}"/>` : ''}
<text x="${x}" y="40" class="mono" font-size="11" letter-spacing="1.4" fill="${t.faint}">${label.toUpperCase()}</text>
<text x="${x}" y="94" class="serif" font-size="46" letter-spacing="-1" fill="${t.text}">${v}</text></g>`;
  }).join('\n');
  return svg(H, 'Chiffres clés', fonts('mono', 'serif'), `<line x1="0" y1=".5" x2="${W}" y2=".5" stroke="${t.rule2}"/>
${body}
<line x1="0" y1="${H - 0.5}" x2="${W}" y2="${H - 0.5}" stroke="${t.rule}"/>`);
}

export function langCard(langs, t) {
  const H = 190, BW = W;
  const shades = [t.ramp[4], t.ramp[3], t.ramp[2], t.ramp[1], t.muted, t.faint, t.rule2];
  let x = 0;
  const segs = langs.map((l, i) => {
    const w = Math.max(3, (l.pct / 100) * BW);
    const s = `<rect x="${x.toFixed(1)}" width="${(w - 2).toFixed(1)}" height="8" fill="${shades[i]}"/>`;
    x += w;
    return s;
  }).join('');
  const cols = 4, colW = BW / cols;
  const legend = langs.map((l, i) => {
    const cx = (i % cols) * colW + (i % cols ? 24 : 0), cy = 118 + Math.floor(i / cols) * 36;
    return `<g class="r" style="animation-delay:${(0.4 + i * 0.06).toFixed(2)}s"><rect x="${cx}" y="${cy - 9}" width="9" height="9" fill="${shades[i]}"/>
<text x="${cx + 18}" y="${cy}" font-size="14.5" fill="${t.text}">${esc(l.name)}</text>
<text x="${(i % cols + 1) * colW - 24}" y="${cy}" text-anchor="end" class="it" font-size="15" fill="${t.muted}">${l.pct.toFixed(1)} %</text></g>`;
  }).join('\n');
  const css = `${fonts(400, 'mono', 'italic')}
.bar{transform:scaleX(0);transform-origin:left;animation:grow 1.2s cubic-bezier(.22,1,.36,1) .15s forwards}
@keyframes grow{to{transform:scaleX(1)}}`;
  return svg(H, 'Langages', css, `<line x1="0" y1=".5" x2="${W}" y2=".5" stroke="${t.rule2}"/>
<text x="0" y="40" class="mono" font-size="11" letter-spacing="1.6" fill="${t.faint}">LANGAGES</text>
<g transform="translate(0 62)"><g class="bar">${segs}</g></g>
${legend}
<line x1="0" y1="${H - 0.5}" x2="${W}" y2="${H - 0.5}" stroke="${t.rule}"/>`);
}

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export function activityCard(weeks, s, t) {
  const n = weeks.length, X0 = 40, STEP = (W - X0) / n, CELL = STEP - 3, Y0 = 92;
  const H = Y0 + 7 * STEP + 56;
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
      cells += `<rect x="${(X0 + wi * STEP).toFixed(1)}" y="${(Y0 + wd * STEP).toFixed(1)}" width="${CELL.toFixed(1)}" height="${CELL.toFixed(1)}" rx="1.5" fill="${t.ramp[level(d.contributionCount)]}" style="animation-delay:${(wi * 0.018).toFixed(3)}s"/>`;
    }
  });
  const days = [[1, 'lun.'], [3, 'mer.'], [5, 'ven.']].map(([i, d]) => `<text x="0" y="${(Y0 + i * STEP + CELL - 2).toFixed(1)}" class="mono" font-size="10.5" fill="${t.faint}">${d}</text>`).join('');
  const LX = W - 5 * 15 - 34;
  const legend = t.ramp.map((c, i) => `<rect x="${LX + i * 15}" y="${H - 33}" width="11" height="11" rx="1.5" fill="${c}"/>`).join('');
  const updated = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });
  const css = `${fonts(400, 'mono', 'italic')}
.cells rect{opacity:0;transform-box:fill-box;transform-origin:center;animation:pop .5s cubic-bezier(.22,1,.36,1) forwards}
@keyframes pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}`;
  return svg(H, `${s.total} contributions sur les 12 derniers mois`, css, `<line x1="0" y1=".5" x2="${W}" y2=".5" stroke="${t.rule2}"/>
<text x="0" y="40" class="mono" font-size="11" letter-spacing="1.6" fill="${t.faint}">12 DERNIERS MOIS</text>
<text x="${W}" y="40" text-anchor="end" font-size="13.5" fill="${t.muted}">série en cours <tspan class="it" font-size="17" fill="${t.accent}">${s.current} j</tspan></text>
${months}${days}
<g class="cells">${cells}</g>
<text x="0" y="${H - 23}" class="mono" font-size="10.5" letter-spacing="1" fill="${t.faint}">MIS À JOUR LE ${esc(updated.toUpperCase())}</text>
<text x="${LX - 8}" y="${H - 23}" text-anchor="end" class="mono" font-size="10.5" fill="${t.faint}">moins</text>${legend}
<text x="${LX + 5 * 15 + 4}" y="${H - 23}" class="mono" font-size="10.5" fill="${t.faint}">plus</text>
<line x1="0" y1="${H - 0.5}" x2="${W}" y2="${H - 0.5}" stroke="${t.rule}"/>`);
}

/* ------------------------------------------------------------------ main */

// Lancé directement (workflow nocturne) : lit GitHub et écrit assets/generated/.
// Importé : expose seulement les cartes (aperçu local avec des données d'exemple).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!TOKEN) throw new Error('GH_TOKEN manquant');
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
  const langs = languages([...u.repositories.nodes, ...u.repositoriesContributedTo.nodes]);

  for (const [mode, t] of Object.entries(THEMES)) {
    write(`assets/generated/tiles-${mode}.svg`, tiles(stats, t));
    write(`assets/generated/languages-${mode}.svg`, langCard(langs, t));
    write(`assets/generated/activity-${mode}.svg`, activityCard(weeks, stats, t));
  }
  console.log(JSON.stringify({ ...stats, langs: langs.map((l) => `${l.name} ${l.pct.toFixed(1)}%`) }));
}
