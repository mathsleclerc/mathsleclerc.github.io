/* =====================================================================
   ACTIVITÉ « LES TRIOMINOS DES ÉCRITURES DÉCIMALES » — 6e, chapitre 6
   Version en ligne de l'activité papier : 16 triangles à faire glisser et
   à tourner pour reconstituer un grand triangle. Deux côtés qui se touchent
   portent deux écritures du même nombre ; les 12 « pièges » vont au bord.
   Utilise el(), piedDePage() (app.js), melanger(), choisir(), svg() (moteur.js).
   ===================================================================== */

/* ---------- Les pièces ----------
   Chaque côté : [texte, numérateur, dénominateur]. Dans le texte, « a/b » s'écrit en fraction.
   Pièce « pointe en haut » : côtés [bas, gauche, droite] ; « pointe en bas » : [gauche, haut, droite].
   rang / place : position dans la solution (rang 0 en haut, places numérotées de gauche à droite). */
const PIECES = [
  { id: 3,  rang: 0, place: 0, cotes: [["75 %", 3, 4], ["0,7", 7, 10], ["6,6", 66, 10]] },
  { id: 6,  rang: 1, place: 0, cotes: [["4 + 1/2", 9, 2], ["0,12", 12, 100], ["5,03", 503, 100]] },
  { id: 2,  rang: 1, place: 1, cotes: [["503/100", 503, 100], ["3/4", 3, 4], ["15 centièmes", 15, 100]] },
  { id: 11, rang: 1, place: 2, cotes: [["1/2", 1, 2], ["0,15", 15, 100], ["2,07", 207, 100]] },
  { id: 16, rang: 2, place: 0, cotes: [["2 + 1/4", 9, 4], ["1/3", 1, 3], ["7/100", 7, 100]] },
  { id: 1,  rang: 2, place: 1, cotes: [["0,07", 7, 100], ["4,5", 9, 2], ["12/1000", 12, 1000]] },
  { id: 15, rang: 2, place: 2, cotes: [["10 %", 1, 10], ["0,012", 12, 1000], ["1 + 1/4", 5, 4]] },
  { id: 9,  rang: 2, place: 3, cotes: [["1,25", 5, 4], ["0,5", 1, 2], ["0,8", 8, 10]] },
  { id: 4,  rang: 2, place: 4, cotes: [["3 + 4/10 + 7/100", 347, 100], ["8 dixièmes", 8, 10], ["4,05", 405, 100]] },
  { id: 7,  rang: 3, place: 0, cotes: [["30 %", 3, 10], ["1,4", 14, 10], ["2,7", 27, 10]] },
  { id: 10, rang: 3, place: 1, cotes: [["27/10", 27, 10], ["9/4", 9, 4], ["25 %", 1, 4]] },
  { id: 5,  rang: 3, place: 2, cotes: [["53/10", 53, 10], ["0,25", 1, 4], ["0,2", 1, 5]] },
  { id: 8,  rang: 3, place: 3, cotes: [["1/5", 1, 5], ["0,1", 1, 10], ["60 %", 3, 5]] },
  { id: 13, rang: 3, place: 4, cotes: [["3,7", 37, 10], ["3/5", 3, 5], ["1 + 3/10", 13, 10]] },
  { id: 12, rang: 3, place: 5, cotes: [["13/10", 13, 10], ["3,47", 347, 100], ["6 + 6/100", 606, 100]] },
  { id: 14, rang: 3, place: 6, cotes: [["2,14", 214, 100], ["6,06", 606, 100], ["5/100", 5, 100]] }
];
const egaux = (c1, c2) => c1[1] * c2[2] === c2[1] * c1[2];

/* ---------- Géométrie ----------
   Angles en degrés, mesurés dans le sens des aiguilles d'une montre (l'axe y descend).
   Une pièce à l'angle θ = 0 a la pointe en haut ; ses côtés 0, 1, 2 ont pour normales 90° (bas),
   210° (gauche) et 330° (droite). Tournée de θ, la normale du côté k vaut BASE[k] + θ. */
const A = 170, H = A * Math.sqrt(3) / 2, R = H / 3; // côté, hauteur, rayon du cercle inscrit
const BASE = [90, 210, 330];
const dir = deg => ({ x: Math.cos(deg * Math.PI / 180), y: Math.sin(deg * Math.PI / 180) });
const mod = (x, m) => ((x % m) + m) % m;

let L = null;             // disposition : largeur, hauteur, origine du plateau, cases de la réserve
let emplacements = [];    // les 16 cases du plateau
let jonctions = [];       // les 18 côtés intérieurs : paires (case, normale)
let pieces = [];          // état des pièces
let table, calqueJonctions, groupePieces, indices = 0;

function disposition() {
  const large = document.getElementById("table").clientWidth >= 900;
  const reserve = (x0, y0) => {
    const cases = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) cases.push({ x: x0 + 88 + c * 175, y: y0 + 85 + r * 170 });
    return cases;
  };
  if (large) {
    return { W: 1470, Hh: 760, px: 30, py: 40 + (700 - 4 * H) / 2, zone: { x: 740, y: 30, w: 710, h: 715 }, cases: reserve(745, 60) };
  }
  const yRes = 40 + 4 * H + 40;
  return { W: 740, Hh: yRes + 735, px: 30, py: 40, zone: { x: 15, y: yRes, w: 710, h: 715 }, cases: reserve(20, yRes + 30) };
}

function construireEmplacements() {
  emplacements = [];
  const sommet = (r, j) => ({ x: L.px + 2 * A - r * A / 2 + j * A, y: L.py + r * H });
  for (let r = 0; r < 4; r++) {
    for (let k = 0; k <= 2 * r; k++) {
      const j = Math.floor(k / 2), s = sommet(r, j);
      const haut = k % 2 === 0;
      emplacements.push({
        rang: r, place: k, haut,
        cx: haut ? s.x : s.x + A / 2, cy: haut ? s.y + 2 * H / 3 : s.y + H / 3,
        normales: haut ? [90, 210, 330] : [270, 30, 150], piece: null
      });
    }
  }
  // côtés communs à deux cases : même milieu
  const milieux = new Map();
  jonctions = [];
  for (const e of emplacements) for (const n of e.normales) {
    const d = dir(n), m = { x: e.cx + R * d.x, y: e.cy + R * d.y };
    const cle = Math.round(m.x) + "," + Math.round(m.y);
    if (milieux.has(cle)) jonctions.push({ a: milieux.get(cle), b: { e, n }, m, n });
    else milieux.set(cle, { e, n });
  }
}

/* ---------- Dessin ---------- */
function etiquette(texte) {
  const g = svg("g", {});
  const morceaux = texte.split(/(\d+\/\d+)/).filter(Boolean);
  const largeurs = morceaux.map(m => /^\d+\/\d+$/.test(m) ? Math.max(...m.split("/").map(t => t.length)) * 7.4 + 6 : m.length * 8.1);
  const total = largeurs.reduce((s, l) => s + l, 0);
  let x = -total / 2;
  morceaux.forEach((m, i) => {
    const c = x + largeurs[i] / 2;
    if (/^\d+\/\d+$/.test(m)) {
      const [n, d] = m.split("/");
      g.append(svg("text", { x: c, y: -4, class: "lab lab-frac", "text-anchor": "middle" }, n),
        svg("line", { x1: c - largeurs[i] / 2 + 2, x2: c + largeurs[i] / 2 - 2, y1: 0, y2: 0, class: "barre" }),
        svg("text", { x: c, y: 13, class: "lab lab-frac", "text-anchor": "middle" }, d));
    } else {
      g.append(svg("text", { x: c, y: 5, class: "lab", "text-anchor": "middle", "xml:space": "preserve" }, m));
    }
    x += largeurs[i];
  });
  const max = 90; // largeur disponible le long d'un côté
  if (total > max) g.setAttribute("transform", `scale(${max / total})`);
  return g;
}

function dessinerPiece(p) {
  const g = svg("g", { class: "piece", tabindex: 0, role: "button",
    "aria-label": "Pièce : " + p.cotes.map(c => c[0]).join(", ") + ". Entrée pour tourner." });
  g.append(svg("path", { d: `M0,${-2 * H / 3} L${A / 2},${H / 3} L${-A / 2},${H / 3} Z`, class: "corps" }));
  p.cotes.forEach((c, k) => {
    const d = dir(BASE[k]), lab = etiquette(c[0]);
    const pos = svg("g", { transform: `translate(${(R - 18) * d.x},${(R - 18) * d.y}) rotate(${BASE[k] - 90})` });
    pos.append(lab);
    g.append(pos);
  });
  // bouton « tourner » au centre de la pièce
  g.append(svg("g", { class: "tourner", "aria-hidden": "true" },
    svg("circle", { cx: 0, cy: 0, r: 13 }),
    svg("path", { d: "M5.5,-5.5 A7.8,7.8 0 1 0 7.8,0", class: "fleche-rot" }),
    svg("path", { d: "M2.5,-8.5 L7,-5 L2,-2.5", class: "pointe-rot" })));
  return g;
}

function placer(p, anime = false) {
  p.g.classList.toggle("tourne", anime);
  p.g.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.theta}deg)`;
  if (anime) setTimeout(() => p.g.classList.remove("tourne"), 280);
}

function construireTable() {
  L = disposition();
  construireEmplacements();
  table = svg("svg", { viewBox: `0 0 ${L.W} ${L.Hh}`, class: "table", role: "application", "aria-label": "Plateau des triominos" });
  const z = L.zone;
  table.append(svg("rect", { x: z.x, y: z.y, width: z.w, height: z.h, rx: 16, class: "zone-pieces" }),
    svg("text", { x: z.x + 14, y: z.y + 22, class: "titre-zone" }, "Les pièces"));
  const p0 = { x: L.px + 2 * A, y: L.py }, p1 = { x: L.px + 4 * A, y: L.py + 4 * H }, p2 = { x: L.px, y: L.py + 4 * H };
  table.append(svg("path", { d: `M${p0.x},${p0.y} L${p1.x},${p1.y} L${p2.x},${p2.y} Z`, class: "contour-plateau" }));
  for (const e of emplacements) {
    const pts = [0, 1, 2].map(i => { const d = dir((e.haut ? -90 : 90) + 120 * i); return `${e.cx + 2 * R * d.x},${e.cy + 2 * R * d.y}`; });
    table.append(svg("polygon", { points: pts.join(" "), class: "emplacement" }));
  }
  groupePieces = svg("g");
  calqueJonctions = svg("g");
  table.append(groupePieces, calqueJonctions);
  document.getElementById("table").replaceChildren(table);
}

/* ---------- État ---------- */
function melangerTout() {
  for (const e of emplacements) e.piece = null;
  const cases = melanger([...L.cases]);
  pieces.forEach((p, i) => {
    p.maison = cases[i];
    p.theta = 60 * Math.floor(Math.random() * 6);
    rentrer(p);
  });
  indices = 0;
  effacerJonctions();
  coach("");
  majEtat();
}
/* Une pièce retourne dans la réserve, centrée dans sa case selon son orientation */
function rentrer(p) {
  if (p.emplacement) p.emplacement.piece = null;
  p.emplacement = null;
  const pointeEnHaut = mod(p.theta, 120) === 0;
  p.x = p.maison.x; p.y = p.maison.y + (pointeEnHaut ? 24 : -24);
  placer(p, true);
}

function poser(p, e, theta) {
  if (e.piece && e.piece !== p) rentrer(e.piece);
  if (p.emplacement && p.emplacement !== e) p.emplacement.piece = null;
  e.piece = p; p.emplacement = e;
  p.x = e.cx; p.y = e.cy;
  if (theta !== undefined) p.theta = theta;
  else if (mod(p.theta, 120) !== (e.haut ? 0 : 60)) p.theta += 60; // la pièce se retourne pour entrer dans la case
  placer(p, true);
}

function tourner(p, sens = 1) {
  p.theta += sens * (p.emplacement ? 120 : 60);
  if (!p.emplacement) { // dans la réserve, la pièce reste centrée dans sa case
    const pointeEnHaut = mod(p.theta, 120) === 0;
    if (Math.abs(p.x - p.maison.x) < 1) p.y = p.maison.y + (pointeEnHaut ? 24 : -24);
  }
  placer(p, true);
  effacerJonctions();
}

/* Côté de la pièce tourné vers la normale n */
const coteVers = (p, n) => p.cotes[[0, 1, 2].find(k => mod(BASE[k] + p.theta - n, 360) === 0)];

/* ---------- Glisser-déposer ---------- */
function coords(ev) {
  const pt = table.createSVGPoint();
  pt.x = ev.clientX; pt.y = ev.clientY;
  return pt.matrixTransform(table.getScreenCTM().inverse());
}

function rendreMobile(p) {
  let depart = null, glisse = false;
  p.g.addEventListener("pointerdown", ev => {
    ev.preventDefault();
    if (ev.target.closest(".tourner")) { depart = null; tourner(p); return; } // bouton ↻ : on tourne sans déplacer
    const c = coords(ev);
    depart = { cx: c.x, cy: c.y, x: p.x, y: p.y };
    glisse = false;
    if (groupePieces.lastChild !== p.g) groupePieces.append(p.g); // au premier plan (avant la capture, qui serait perdue)
    p.g.setPointerCapture(ev.pointerId);
  });
  p.g.addEventListener("pointermove", ev => {
    if (!depart) return;
    const c = coords(ev), dx = c.x - depart.cx, dy = c.y - depart.cy;
    if (!glisse && Math.hypot(dx, dy) < 10) return;
    if (!glisse) { glisse = true; p.g.classList.add("glisse"); effacerJonctions(); }
    p.x = Math.min(L.W - 20, Math.max(20, depart.x + dx));
    p.y = Math.min(L.Hh - 20, Math.max(20, depart.y + dy));
    placer(p);
  });
  const fin = () => {
    if (!depart) return;
    depart = null;
    p.g.classList.remove("glisse");
    if (!glisse) { tourner(p); return; }
    const proche = emplacements.find(e => Math.hypot(e.cx - p.x, e.cy - p.y) < 55);
    if (proche) poser(p, proche);
    else if (p.emplacement) { p.emplacement.piece = null; p.emplacement = null; }
    majEtat();
  };
  p.g.addEventListener("pointerup", fin);
  p.g.addEventListener("pointercancel", fin);
  p.g.addEventListener("keydown", ev => {
    if (["Enter", " ", "ArrowRight", "r", "R"].includes(ev.key)) { ev.preventDefault(); tourner(p); }
    else if (ev.key === "ArrowLeft") { ev.preventDefault(); tourner(p, -1); }
  });
  // clic droit : tourner dans l'autre sens
  p.g.addEventListener("contextmenu", ev => { ev.preventDefault(); tourner(p, -1); });
}

/* ---------- Vérifier, indice ---------- */
function effacerJonctions() { calqueJonctions.replaceChildren(); }

function verifier() {
  effacerJonctions();
  let justes = 0, faux = 0;
  for (const j of jonctions) {
    const pa = j.a.e.piece, pb = j.b.e.piece;
    if (!pa || !pb) continue;
    const ok = egaux(coteVers(pa, j.a.n), coteVers(pb, j.b.n));
    ok ? justes++ : faux++;
    const t = dir(j.n + 90), demi = A / 2 - 22;
    calqueJonctions.append(svg("line", { x1: j.m.x - demi * t.x, y1: j.m.y - demi * t.y, x2: j.m.x + demi * t.x, y2: j.m.y + demi * t.y,
      class: "jonction " + (ok ? "juste" : "faux") }));
  }
  const posees = emplacements.filter(e => e.piece).length;
  if (posees === 16 && justes === jonctions.length) {
    coach(`🎉 Bravo ! Le grand triangle est reconstitué : les ${jonctions.length} côtés qui se touchent portent bien le même nombre${indices ? ` (avec ${indices} indice${indices > 1 ? "s" : ""})` : ""}. Les 12 nombres du bord sont les pièges.`, "ok");
  } else if (justes + faux === 0) {
    coach("Pose au moins deux pièces côte à côte sur le grand triangle avant de vérifier.", "attention");
  } else {
    const phrases = [];
    if (justes) phrases.push(`${justes} côté${justes > 1 ? "s" : ""} en vert : ${justes > 1 ? "ils portent" : "il porte"} bien le même nombre.`);
    if (faux) phrases.push(`${faux} côté${faux > 1 ? "s" : ""} en rouge : les deux nombres ne sont pas égaux. Tourne ou déplace ces pièces.`);
    if (posees < 16) phrases.push(`Il reste ${16 - posees} pièce${16 - posees > 1 ? "s" : ""} à poser.`);
    coach(phrases.join(" "), faux ? "attention" : "ok");
  }
}

const caseSolution = p => emplacements.find(e => e.rang === p.rang && e.place === p.place);
function bienPlacee(p) {
  const e = caseSolution(p);
  return p.emplacement === e && mod(p.theta, 360) === (e.haut ? 0 : 60);
}

function indice() {
  const aPlacer = pieces.filter(p => !bienPlacee(p));
  if (!aPlacer.length) { coach("Toutes les pièces sont déjà bien placées !", "ok"); return; }
  // de préférence une pièce voisine d'une pièce déjà bien placée, sinon le sommet
  const voisine = aPlacer.filter(p => jonctions.some(j => {
    const e = caseSolution(p);
    const autre = j.a.e === e ? j.b.e : j.b.e === e ? j.a.e : null;
    return autre && autre.piece && bienPlacee(autre.piece);
  }));
  const p = choisir(voisine.length ? voisine : aPlacer.filter(q => q.rang === Math.min(...aPlacer.map(r => r.rang))));
  const e = caseSolution(p), cible = e.haut ? 0 : 60;
  groupePieces.append(p.g);
  poser(p, e, p.theta + mod(cible - p.theta + 180, 360) - 180);
  indices++;
  effacerJonctions();
  majEtat();
  coach(`Indice : cette pièce a été placée et tournée correctement. Cherche maintenant les pièces qui la touchent.`, "attention");
}

/* ---------- Divers ---------- */
function coach(html, type = "") {
  const c = document.getElementById("coach");
  c.className = "coach " + type;
  c.innerHTML = html;
}
function majEtat() {
  const n = emplacements.filter(e => e.piece).length;
  document.getElementById("etat").textContent = `${n} pièce${n > 1 ? "s" : ""} posée${n > 1 ? "s" : ""} sur 16`;
  document.getElementById("indices").textContent = indices;
  if (n === 16 && !document.getElementById("coach").classList.contains("ok")) coach("Toutes les pièces sont posées : clique sur « Vérifier » !", "");
}

function demarrer() {
  construireTable();
  pieces = PIECES.map(def => ({ ...def, emplacement: null }));
  for (const p of pieces) {
    p.g = dessinerPiece(p);
    groupePieces.append(p.g);
    rendreMobile(p);
  }
  melangerTout();
  for (const p of pieces) placer(p); // position initiale sans animation
}

if (window.self !== window.top) document.body.classList.add("integre");
piedDePage();
demarrer();
document.getElementById("verifier").addEventListener("click", verifier);
document.getElementById("indice").addEventListener("click", indice);
document.getElementById("melanger").addEventListener("click", () => { melangerTout(); });
