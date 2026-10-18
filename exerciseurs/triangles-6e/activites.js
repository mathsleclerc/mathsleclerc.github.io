/* =====================================================================
   EXERCISEUR « TRIANGLES » — 6e, chapitre 9

   Les activités sont rangées comme les feuilles d'exercices du chapitre.
   Les angles sont toujours nommés avec trois lettres (l'angle ABC).
   Les constructions se font à l'écran avec le compas et le rapporteur
   (les mêmes outils que dans les exerciseurs des chapitres 5 et 7).

   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Vocabulaire et codage";
const F2 = "Feuille 2 — Construire avec trois longueurs";
const F3 = "Feuille 3 — Construire avec des angles";
const F4 = "Feuille 4 — Triangles particuliers";
const F5 = "Feuille 5 — Somme des angles : calculer";
const F6 = "Feuille 6 — Somme des angles : construire et raisonner";
const F7 = "Feuille 7 — Médiatrices et cercle circonscrit";

const nb = x => ecrireNombre(Math.round(x * 1e6) / 1e6);
const cm = x => nb(x) + " cm";
const deg = x => `${nb(x)}°`;
const cap = t => t[0].toUpperCase() + t.slice(1);
const dist = (P, Q) => Math.hypot(P.x - Q.x, P.y - Q.y);
const angleDe = (C, M) => Math.atan2(M.y - C.y, M.x - C.x);
const CW = 640, CH = 420; // figures de construction (CM pixels par cm)

/* Noms : l'angle ABC (chapeau sur les trois lettres), le segment [AB], la longueur AB */
const ang = (a, b, c) => `<span class="nom-angle"><span class="angle">${a}${b}${c}</span></span>`;
const seg = (a, b) => `[${a}${b}]`;

/* Direction d'un angle en degrés, compté dans le sens inverse des aiguilles d'une montre (y vers le bas à l'écran) */
const dir = phi => ({ x: Math.cos(phi * DEG), y: -Math.sin(phi * DEG) });
const pt = (O, phi, r) => V.plus(O, V.fois(dir(phi), r));
const normaliser = a => ((a % 360) + 540) % 360 - 180;
const directionDeg = (P, Q) => Math.atan2(P.y - Q.y, Q.x - P.x) / DEG; // direction de P vers Q, en degrés

function positionClic(s, e) {
  const p = s.createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(s.getScreenCTM().inverse());
}

/* ---------- Triangles dessinés ---------- */

/* Les trois sommets d'un triangle d'angles a0 (en P0) et a1 (en P1), de base horizontale L */
function triangleAngles(a0, a1, L = 200) {
  const d = L * Math.sin(a1 * DEG) / Math.sin((a0 + a1) * DEG);
  const P0 = { x: 0, y: 0 }, P1 = { x: L, y: 0 };
  return [P0, P1, pt(P0, a0, d)];
}
/* Fait tenir les points dans un cadre l × h (rotation facultative, en degrés) */
function cadrer(pts, l, h, rot = 0, marge = 34) {
  const G = { x: (pts[0].x + pts[1].x + pts[2].x) / 3, y: (pts[0].y + pts[1].y + pts[2].y) / 3 };
  let q = pts.map(p => V.tourner(p, G, -rot * DEG));
  const xs = q.map(p => p.x), ys = q.map(p => p.y);
  const k = Math.min((l - 2 * marge) / (Math.max(...xs) - Math.min(...xs)), (h - 2 * marge) / (Math.max(...ys) - Math.min(...ys)));
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  return q.map(p => ({ x: l / 2 + (p.x - cx) * k, y: h / 2 + (p.y - cy) * k }));
}
/* Un triangle dessiné avec ses noms et son codage.
   egaux : [[i, j, n]] (n traits) ; droit : i ; angles : [[i, texte]] ; cotes : [[i, j, texte]] */
function dessinerTriangle(s, P, noms, { egaux = [], droit = null, angles = [], cotes = [], arcs = [], classe = "geo-trait" } = {}) {
  const G = V.fois(V.plus(V.plus(P[0], P[1]), P[2]), 1 / 3);
  for (const [i, j] of [[0, 1], [1, 2], [2, 0]]) dessinerTrait(s, P[i], P[j], "segment", classe);
  for (const [i, j, n] of egaux) codageLongueur(s, P[i], P[j], n);
  if (droit != null) { const o = [0, 1, 2].filter(k => k !== droit); codageAngleDroit(s, P[droit], V.moins(P[o[0]], P[droit]), V.moins(P[o[1]], P[droit]), 12); }
  for (const [i, n] of arcs) {
    const o = [0, 1, 2].filter(k => k !== i), a1 = directionDeg(P[i], P[o[0]]), a2 = directionDeg(P[i], P[o[1]]);
    let d = normaliser(a2 - a1), debut = d > 0 ? a1 : a2; d = Math.abs(d);
    for (let k = 0; k < n; k++) { const r = 20 + 5 * k, A1 = pt(P[i], debut, r), A2 = pt(P[i], debut + d, r); s.append(svg("path", { d: `M${A1.x},${A1.y} A${r},${r} 0 0 0 ${A2.x},${A2.y}`, class: "geo-codage" })); }
  }
  for (const [i, t] of angles) {
    const u = V.unitaire(V.moins(G, P[i]));
    dessinerTexte(s, V.plus(P[i], V.fois(u, 38)), t, "geo-mesure");
  }
  for (const [i, j, t] of cotes) {
    const m = V.milieu(P[i], P[j]), u = V.unitaire(V.moins(m, G));
    dessinerTexte(s, V.plus(m, V.fois(u, 16)), t, "geo-mesure");
  }
  noms.forEach((n, i) => { const u = V.unitaire(V.moins(P[i], G)); dessinerTexte(s, V.plus(P[i], V.fois(u, 16)), n); });
  return s;
}
/* Une petite figure (SVG) d'un triangle, prête à afficher */
function figTriangle(a0, a1, noms, codage = {}, { l = 330, h = 230, rot = alea(-15, 15), flip = false } = {}) {
  let P = triangleAngles(a0, a1);
  if (flip) P = P.map(p => ({ x: p.x, y: -p.y }));
  P = cadrer(P, l, h, rot);
  const s = figureGeo(l, h, "Triangle " + noms.join(""));
  dessinerTriangle(s, P, noms, codage);
  return { svg: s, P };
}
const html = noeud => noeud.outerHTML;

/* ---------- Les natures de triangles, avec leur codage ---------- */
/* Un triangle particulier : angles (en P0, P1), sommet principal ou angle droit, codage */
function triangleNature(type) {
  if (type === "isocele") { const b = alea(40, 72); return { a0: b, a1: b, special: 2, egaux: [[2, 0, 1], [2, 1, 1]] }; }
  if (type === "equilateral") return { a0: 60, a1: 60, special: null, egaux: [[0, 1, 2], [1, 2, 2], [2, 0, 2]] };
  if (type === "rectangle") { const b = alea(28, 62); return { a0: 90, a1: b, special: 0, droit: 0 }; }
  if (type === "rect-isocele") return { a0: 90, a1: 45, special: 0, droit: 0, egaux: [[0, 1, 1], [0, 2, 1]] };
  let a, b; do { a = alea(35, 80); b = alea(35, 80); } while (Math.abs(a - b) < 8 || 180 - a - b < 35 || Math.abs(180 - a - b - a) < 8 || Math.abs(180 - a - b - b) < 8 || Math.abs(180 - a - b - 90) < 6);
  return { a0: a, a1: b, special: null };
}
const NOM_NATURE = { isocele: "isocèle", equilateral: "équilatéral", rectangle: "rectangle", "rect-isocele": "rectangle isocèle", quelconque: "quelconque" };
function phraseNature(type, nomSommet) {
  if (type === "isocele") return `isocèle en ${nomSommet}`;
  if (type === "rectangle") return `rectangle en ${nomSommet}`;
  if (type === "rect-isocele") return `rectangle isocèle en ${nomSommet}`;
  return NOM_NATURE[type];
}

/* ---------- Atelier de construction (comme au chapitre 7) ----------
   Une suite d'étapes guidées. Types d'étape : champ, clic (placer un point sur un trait),
   point (cliquer à un endroit), compas (tracer, puis « J'ai tracé »), tracer (un bouton). Chaque étape a « Montre-moi ». */
function atelier(s, etapes, { compas = null, bloquerOutils = () => {}, consigne, apres = [] } = {}) {
  const message = el("p", { class: "atelier-message" });
  const actions = el("div", { class: "atelier-actions" });
  const pastilles = el("div", { class: "etapes-construction" }, ...etapes.map(e => el("span", {}, e.nom)));
  const controle = el("div", { class: "atelier-controle" }, pastilles, message, actions, ...apres);
  if (compas) controle.append(barreCompas(compas));
  let k = -1, fini = false, actif = true, clic = null, pointClic = null, champ = null, point = null;
  const dire = (t, type = "") => { message.innerHTML = t; message.className = "atelier-message " + type; };
  const bouton = (t, f, c = "") => el("button", { type: "button", class: "btn " + c, onclick: () => { if (actif) f(); } }, t);

  const placerSurSegment = t => {
    pointClic?.remove();
    pointClic = dessinerPoint(s, V.plus(clic.depart, V.fois(clic.direction, t * CM)), clic.nom, { vers: V.normal(clic.direction), classe: "geo-point-eleve" });
    clic.valeur = t;
  };
  const placerLibre = q => {
    pointClic?.remove();
    pointClic = dessinerPoint(s, q, point.nom, { vers: point.vers || { x: 0.7, y: -1 }, classe: "geo-point-eleve" });
    point.valeur = q;
  };
  s.addEventListener("pointerdown", e => {
    if (!actif || e.target.closest(".compas, .outil-poignee, .rayon-poignee")) return;
    const q = positionClic(s, e);
    if (clic) {
      const r = V.moins(q, clic.depart);
      const d = Math.abs(r.x * clic.direction.y - r.y * clic.direction.x);
      if (d > 24) return;
      e.stopPropagation();
      const t = Math.round((r.x * clic.direction.x + r.y * clic.direction.y) / CM * 10) / 10;
      placerSurSegment(Math.min(clic.longueur, Math.max(0, t)));
    } else if (point && !e.target.closest(".instrument")) {
      e.stopPropagation();
      placerLibre(q);
    }
  }, true);

  function etape(i) {
    k = i;
    const e = etapes[i];
    [...pastilles.children].forEach((p, j) => { p.className = j < i ? "faite" : j === i ? "en-cours" : ""; });
    e.avant?.();
    dire(e.texte);
    actions.replaceChildren();
    clic = null; pointClic = null; champ = null; point = null;
    if (e.champ) {
      const [avant, apres2] = e.champ.split("[d]");
      champ = el("input", { class: "case", inputmode: "decimal", autocomplete: "off", "aria-label": "Réponse" });
      const ok = bouton("OK", () => {
        const v = lireNombre(champ.value);
        if (isNaN(v)) { dire("Écris un nombre.", "attention"); return; }
        const r = e.valider(v);
        if (r === true) reussir(); else dire(r, "attention");
      }, "principal");
      champ.addEventListener("keydown", ev => { if (ev.key === "Enter") { ev.preventDefault(); ev.stopPropagation(); ok.click(); } });
      const a = el("span", {}); a.innerHTML = avant;
      actions.append(a, champ, el("span", {}, apres2 || ""), ok);
    } else if (e.clic) {
      clic = { ...e.clic, valeur: null };
      actions.append(bouton("OK", () => {
        if (clic.valeur == null) { dire("Clique sur le trait pour placer le point.", "attention"); return; }
        if (Math.abs(clic.valeur - clic.cible) < 0.05) { clic = null; pointClic?.remove(); reussir(); } else dire(e.clic.message(clic.valeur), "attention");
      }, "principal"));
    } else if (e.point) {
      point = { ...e.point, valeur: null };
      actions.append(bouton("OK", () => {
        if (!point.valeur) { dire("Clique sur la figure pour placer le point.", "attention"); return; }
        if (dist(point.valeur, point.cible) <= (point.tol || 10)) { pointClic?.remove(); point = null; reussir(); }
        else dire(e.point.message || "Ce n'est pas le bon endroit : regarde bien où se coupent les traits.", "attention");
      }, "principal"));
    } else if (e.compas) {
      actions.append(bouton("J'ai tracé ✓", () => {
        const r = e.compas();
        if (r === true) reussir(); else dire(r, "attention");
      }, "principal"));
    } else if (e.tracer) {
      actions.append(bouton(e.bouton || "Tracer", () => {
        const r = e.tracer();
        if (r === true) reussir(); else dire(r, "attention");
      }, "principal"));
    }
    actions.append(bouton("Montre-moi", () => montrer(e), "discret"));
  }

  function montrer(e) {
    e.montrer?.();
    if (e.champ) { champ.value = ecrireNombre(e.reponse); dire(`La réponse est ${ecrireNombre(e.reponse)}. Clique sur OK.`, "bien"); }
    else if (e.clic) { placerSurSegment(e.clic.cible); dire("Voici où placer le point. Clique sur OK.", "bien"); }
    else if (e.point) { placerLibre(e.point.cible); dire("Voici où placer le point. Clique sur OK.", "bien"); }
    else if (e.compas) dire("Regarde comment placer le compas et tracer. Clique sur « J'ai tracé ».", "bien");
    else if (e.tracer) dire(e.montrerTexte || `Clique sur « ${e.bouton || "Tracer"} ».`, "bien");
  }

  function reussir() {
    const e = etapes[k];
    e.dessin?.();
    if (k + 1 < etapes.length) { etape(k + 1); return; }
    fini = true;
    [...pastilles.children].forEach(p => { p.className = "faite"; });
    compas?.bloquer();
    bloquerOutils();
    actions.replaceChildren();
    dire((e.fin || "Construction terminée !") + " Clique sur « Valider ».", "bien");
  }

  etape(0);
  return {
    consigne: consigne || "Suis les étapes de la construction. Si tu es bloqué, utilise « Montre-moi ».",
    figure: [s, controle],
    verifier: () => fini ? { etat: "juste" } : { etat: "incomplet", message: "Termine d'abord toutes les étapes de la construction." },
    indice: "Suis les étapes une par une ; le bouton « Montre-moi » aide à chaque étape.",
    correction: "Les étapes : " + etapes.map(e => e.nom[0].toLowerCase() + e.nom.slice(1)).join(" → ") + ".",
    surCorrection() {
      while (!fini && k < etapes.length) {
        const e = etapes[k];
        e.montrer?.();
        if (e.point) pointClic?.remove();
        reussir();
      }
    },
    bloquer() { actif = false; compas?.bloquer(); bloquerOutils(); }
  };
}

function barreCompas(compas) {
  return el("div", { class: "outils-compas" },
    el("span", { class: "aide-compas" }, "Compas : glisse la pointe pour le déplacer, la mine pour l'écartement, ↻ pour tracer."),
    el("button", { type: "button", class: "btn discret", onclick: () => compas.effacerDernier() }, "↶ Effacer le dernier arc"),
    el("button", { type: "button", class: "btn discret", onclick: () => compas.effacerTout() }, "Tout effacer"));
}
function figureConstruction(etiquette = "Construction") {
  const s = figureGeo(CW, CH, etiquette);
  s.classList.add("construction", "geo-manipuler");
  return s;
}
/* Médiatrice de [AB] au compas : des arcs de même rayon, centrés en A et en B, qui se coupent deux fois */
function mediatriceAuCompas(arcs, A, B, nA, nB) {
  const AB = dist(A, B);
  const arcsA = arcsDeCentre(arcs, A), arcsB = arcsDeCentre(arcs, B);
  if (!arcsA.length && !arcsB.length) return `Trace des arcs de cercle : la pointe du compas en ${nA}, puis en ${nB}.`;
  if (!arcsA.length) return `Il manque les arcs de centre ${nA}.`;
  if (!arcsB.length) return `Il manque les arcs de centre ${nB}.`;
  let message = `Les arcs de centre ${nA} et de centre ${nB} doivent avoir le même écartement.`;
  for (const a of arcsA) {
    if (a.r <= AB / 2 + 2) { message = `L'écartement doit être plus grand que la moitié de ${nA}${nB} : sinon les arcs ne se coupent pas.`; continue; }
    const pts = intersectionCercles(A, a.r, B, a.r);
    if (!arcsB.some(b => Math.abs(b.r - a.r) < 0.1 * CM)) continue;
    const ok = pts.map(P => arcsA.some(x => Math.abs(x.r - a.r) < 0.1 * CM && arcPassePar(x, P)) && arcsB.some(x => Math.abs(x.r - a.r) < 0.1 * CM && arcPassePar(x, P)));
    if (ok[0] && ok[1]) return { pts, r: a.r };
    message = "Les arcs doivent se couper deux fois : une fois de chaque côté du segment. Trace des arcs un peu plus longs.";
  }
  return message;
}
function montrerMediatrice(compas, A, B) {
  const r = dist(A, B) * 0.72;
  const pts = intersectionCercles(A, r, B, r);
  for (const C of [A, B]) for (const P of pts) { const t = angleDe(C, P); compas.placer(C, r, t - 0.3); compas.tracer(t - 0.3, t + 0.3); }
  return pts;
}

/* ---------- Le rapporteur et la demi-droite mobile (comme au chapitre 5) ---------- */
function creerRapporteur(R = 150) {
  const g = svg("g", { class: "rapporteur" });
  const Rp = R + 12;
  g.append(svg("path", { d: `M${-Rp},0 A${Rp},${Rp} 0 0 1 ${Rp},0 Z`, class: "rap-fond" }));
  for (let d = 0; d <= 180; d++) {
    const l = d % 10 === 0 ? 13 : d % 5 === 0 ? 9 : 5;
    const p1 = pt({ x: 0, y: 0 }, d, Rp), p2 = pt({ x: 0, y: 0 }, d, Rp - l);
    g.append(svg("line", { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, class: "rap-grad" }));
    if (d % 10 === 0) {
      const e = pt({ x: 0, y: 0 }, d, Rp - 21), i = pt({ x: 0, y: 0 }, d, Rp - 45);
      g.append(svg("text", { x: e.x, y: e.y + 4, class: "rap-ext" }, String(180 - d)));
      g.append(svg("text", { x: i.x, y: i.y + 4, class: "rap-int" }, String(d)));
    }
  }
  g.append(svg("line", { x1: -Rp, y1: 0, x2: Rp, y2: 0, class: "rap-base" }),
    svg("line", { x1: 0, y1: 0, x2: 0, y2: -18, class: "rap-base" }),
    svg("circle", { cx: 0, cy: 0, r: 3.5, class: "rap-centre" }));
  g.placer = (x, y, rot) => g.setAttribute("transform", `translate(${x},${y}) rotate(${rot})`);
  return g;
}
/* Une demi-droite d'origine O qu'on fait tourner en tirant sa poignée (angle entier, en degrés) */
function demiDroiteMobile(s, O, phi0, longueur) {
  const g = svg("g", { class: "rayon-mobile" });
  const trait = svg("line", { class: "rayon-trait" });
  const poignee = svg("circle", { r: 11, class: "rayon-poignee" });
  g.append(trait, poignee);
  s.append(g);
  const res = { phi: phi0, actif: true, touche: false, g };
  const placer = phi => {
    res.phi = Math.round(phi);
    const B = pt(O, res.phi, longueur);
    trait.setAttribute("x1", O.x); trait.setAttribute("y1", O.y);
    trait.setAttribute("x2", B.x); trait.setAttribute("y2", B.y);
    poignee.setAttribute("cx", B.x); poignee.setAttribute("cy", B.y);
  };
  placer(phi0);
  let tire = false;
  poignee.addEventListener("pointerdown", e => { if (!res.actif) return; e.preventDefault(); e.stopPropagation(); tire = true; s.setPointerCapture?.(e.pointerId); });
  s.addEventListener("pointermove", e => {
    if (!tire) return;
    const p = positionClic(s, e);
    res.touche = true;
    placer(Math.atan2(O.y - p.y, p.x - O.x) / DEG);
  });
  s.addEventListener("pointerup", () => { tire = false; });
  res.tourner = d => { if (res.actif) { res.touche = true; placer(res.phi + d); } };
  res.placer = placer;
  return res;
}
const boutonsRotation = rayon => el("div", { class: "rotation" },
  el("span", {}, "Faire tourner :"),
  ...[[-5, "↻ 5°"], [-1, "↻ 1°"], [1, "↺ 1°"], [5, "↺ 5°"]].map(([d, t]) => el("button", { type: "button", class: "btn", onclick: () => rayon.tourner(d) }, t)));
/* Une demi-droite graduée en centimètres (pour reporter une longueur) */
function regleSur(s, O, phi, longueurCm) {
  const g = svg("g", { class: "regle-trait" }), u = dir(phi), n = V.normal(u);
  for (let mm = 0; mm <= longueurCm * 10; mm++) {
    const l = mm % 10 === 0 ? 9 : mm % 5 === 0 ? 6 : 3, P = V.plus(O, V.fois(u, mm * CM / 10));
    const a = V.plus(P, V.fois(n, l)), b = V.moins(P, V.fois(n, mm % 10 === 0 ? 2 : 0));
    g.append(svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: "geo-graduation" }));
    if (mm % 10 === 0 && mm) { const t = V.plus(P, V.fois(n, 20)); g.append(svg("text", { x: t.x, y: t.y + 5, class: "regle-etiquette" }, String(mm / 10))); }
  }
  s.append(g);
  return g;
}

/* ---------- Petits outils de questionnaire ---------- */
function selection(liste) {
  const choisies = new Set();
  let actif = true;
  const boutons = liste.map((t, i) => {
    const b = el("button", { type: "button", class: "btn etiquette-choix", "aria-pressed": "false" });
    b.innerHTML = t;
    b.addEventListener("click", () => {
      if (!actif) return;
      if (choisies.has(i)) choisies.delete(i); else choisies.add(i);
      b.setAttribute("aria-pressed", String(choisies.has(i)));
    });
    return b;
  });
  return { noeud: el("div", { class: "etiquettes" }, ...boutons), choisies, boutons, bloquer: () => { actif = false; } };
}
/* Schéma en barres de 180° (somme des angles) */
function schema180(parts) {
  const L = 300, x0 = 10, somme = 180;
  let x = x0, s = `<svg viewBox="0 0 ${L + 20} 92" width="${L + 20}" height="92" class="fig-schema barres" role="img" aria-label="Schéma : la somme des angles fait 180°">`;
  s += `<path d="M${x0},30 v-8 H${x0 + L} v8" class="accolade"/><text x="${x0 + L / 2}" y="16">180°</text>`;
  for (const [t, w] of parts) {
    const l = L * w / somme;
    s += `<rect x="${x}" y="36" width="${l}" height="40" class="fig-part"/><text x="${x + l / 2}" y="62" class="${t === "?" ? "valeur" : ""}">${t}</text>`;
    x += l;
  }
  const d = el("div", { class: "aide-schema" });
  d.innerHTML = s + "</svg>";
  return d;
}
/* Trois angles d'un triangle quelconque, entiers, assez différents */
function troisAngles() {
  let a, b; do { a = alea(25, 95); b = alea(25, 95); } while (180 - a - b < 20 || a === b || 180 - a - b === a || 180 - a - b === b);
  return [a, b, 180 - a - b];
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "sommets-cotes",
    titre: "Sommets, côtés, angles",
    description: "Cliquer sur le côté, le sommet ou l'angle demandé.",
    generer() {
      const noms = tirerLettres(3), [A, B, C] = noms;
      let P = cadrer(triangleAngles(alea(45, 75), alea(40, 70), 200), 380, 260, alea(-20, 20));
      const s = figureGeo(380, 260, "Triangle " + noms.join(""));
      const G = V.fois(V.plus(V.plus(P[0], P[1]), P[2]), 1 / 3);
      dessinerTriangle(s, P, noms, { classe: "geo-objet" });
      const cotes = [[0, 1], [1, 2], [2, 0]];
      let choisi = null, actif = true;
      const zones = [];
      const marquer = (z) => { zones.forEach(x => x.noeud.classList.toggle("choisi", x === z)); choisi = z; };
      P.forEach((p, i) => {
        // le coin de l'angle : un petit secteur à l'intérieur ; le sommet : un disque sur le point
        const o = [0, 1, 2].filter(k => k !== i), u1 = V.unitaire(V.moins(P[o[0]], p)), u2 = V.unitaire(V.moins(P[o[1]], p)), r = 44;
        const a1 = V.plus(p, V.fois(u1, r)), a2 = V.plus(p, V.fois(u2, r));
        const secteur = svg("path", { d: `M${p.x},${p.y} L${a1.x},${a1.y} A${r},${r} 0 0 ${(u1.x * u2.y - u1.y * u2.x) > 0 ? 1 : 0} ${a2.x},${a2.y} Z`, class: "zone-clic zone-angle" });
        const za = { type: "angle", id: String(i), noeud: secteur };
        secteur.addEventListener("click", () => actif && marquer(za));
        zones.push(za); s.append(secteur);
      });
      cotes.forEach(([i, j]) => {
        const l = svg("line", { x1: P[i].x, y1: P[i].y, x2: P[j].x, y2: P[j].y, class: "zone-clic zone-cote" });
        const z = { type: "cote", id: [i, j].sort().join(""), noeud: l };
        l.addEventListener("click", () => actif && marquer(z));
        zones.push(z); s.append(l);
      });
      P.forEach((p, i) => {
        const c = svg("circle", { cx: p.x, cy: p.y, r: 13, class: "zone-clic zone-sommet" });
        const z = { type: "sommet", id: String(i), noeud: c };
        c.addEventListener("click", () => actif && marquer(z));
        zones.push(z); s.append(c);
      });
      const i = alea(0, 2), o = [0, 1, 2].filter(k => k !== i);
      const nomCote = (a, b) => seg(noms[a], noms[b]);
      const cas = choisir([
        { q: `Clique sur le <strong>côté ${nomCote(o[0], o[1])}</strong>.`, type: "cote", id: [o[0], o[1]].sort().join("") },
        { q: `Clique sur le <strong>côté opposé au sommet ${noms[i]}</strong>.`, type: "cote", id: [o[0], o[1]].sort().join("") },
        { q: `Clique sur le <strong>sommet opposé au côté ${nomCote(o[0], o[1])}</strong>.`, type: "sommet", id: String(i) },
        { q: `Clique sur l'<strong>angle ${ang(noms[o[0]], noms[i], noms[o[1]])}</strong> (à l'intérieur du triangle, près de son sommet).`, type: "angle", id: String(i) },
        { q: `Clique sur l'<strong>angle opposé au côté ${nomCote(o[0], o[1])}</strong>.`, type: "angle", id: String(i) },
        { q: `Clique sur le <strong>sommet ${noms[i]}</strong>.`, type: "sommet", id: String(i) }
      ]);
      const nomZone = z => z.type === "cote" ? "le côté " + nomCote(+z.id[0], +z.id[1]) : z.type === "sommet" ? "le sommet " + noms[+z.id] : "l'angle " + ang(noms[[0, 1, 2].filter(k => k !== +z.id)[0]], noms[+z.id], noms[[0, 1, 2].filter(k => k !== +z.id)[1]]);
      const bonne = zones.find(z => z.type === cas.type && z.id === cas.id);
      return {
        consigne: cas.q,
        figure: s,
        verifier() {
          if (!choisi) return { etat: "incomplet", message: "Clique sur la figure." };
          if (choisi === bonne) return { etat: "juste" };
          return { etat: "faux", message: `Tu as choisi ${nomZone(choisi)}.` };
        },
        indice: "Un côté est un segment ; un sommet est un point ; un angle se nomme avec trois lettres, le sommet au milieu. Le côté opposé à un sommet est celui qui ne passe pas par ce sommet.",
        correction: `Il fallait choisir ${nomZone(bonne)}.`,
        surCorrection() { bonne.noeud.classList.add("bonne"); },
        bloquer: () => { actif = false; }
      };
    }
  },

  {
    groupe: F1,
    id: "bon-symbole",
    titre: "Le bon symbole",
    description: "[AB], AB ou l'angle ABC ?",
    generer() {
      const [A, B, C] = tirerLettres(3);
      const options = [seg(A, B), `${A}${B}`, ang(A, B, C)];
      const cas = choisir([
        [`Le côté … du triangle ${A}${B}${C} est tracé en bleu.`, 0],
        [`La longueur … est égale à 5 cm : … = 5 cm.`, 1],
        [`Le segment … a pour milieu le point M.`, 0],
        [`L'angle … mesure 40° : … = 40°.`, 2],
        [`… = ${A}${C} : le triangle est isocèle en ${A}.`, 1],
        [`Je trace la droite perpendiculaire à … passant par ${C}.`, 0],
        [`… = 90° : le triangle est rectangle en ${B}.`, 2]
      ]);
      return {
        consigne: `Complète avec la bonne écriture :<br><strong>${cas[0]}</strong>`,
        choix: options,
        verifier: (v, c) => ({ etat: c === options[cas[1]] ? "juste" : "faux" }),
        indice: `${seg(A, B)} est un segment (un objet qu'on trace) ; ${A}${B} est sa longueur (un nombre) ; ${ang(A, B, C)} est un angle, son sommet est la lettre du milieu.`,
        correction: `Il faut écrire ${options[cas[1]]}.`
      };
    }
  },

  {
    groupe: F1,
    id: "lire-codage",
    titre: "Lire le codage",
    description: "Ce que le codage d'une figure nous apprend.",
    generer() {
      const type = choisir(["isocele", "isocele", "equilateral", "rectangle", "rect-isocele"]);
      const T = triangleNature(type), noms = tirerLettres(3), [P0, P1, P2] = noms;
      const f = figTriangle(T.a0, T.a1, noms, { egaux: T.egaux || [], droit: T.droit ?? null });
      const L = (i, j) => noms[i] + noms[j];
      const vrais = new Set(), tous = [];
      const ajouter = (t, v) => { tous.push(t); if (v) vrais.add(t); };
      // les égalités de longueurs
      const egales = (i, j, k, l) => {
        const e = T.egaux || [];
        const n = (a, b) => e.find(x => (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a))?.[2];
        return n(i, j) != null && n(i, j) === n(k, l);
      };
      ajouter(`${L(2, 0)} = ${L(2, 1)}`, egales(2, 0, 2, 1));
      ajouter(`${L(0, 1)} = ${L(0, 2)}`, egales(0, 1, 0, 2));
      ajouter(`${L(0, 1)} = ${L(1, 2)}`, egales(0, 1, 1, 2));
      ajouter(`${ang(P1, P0, P2)} = 90°`, T.droit === 0);
      ajouter(`${ang(P0, P2, P1)} = 90°`, false);
      const liste = melanger(tous);
      const sel = selection(liste);
      return {
        consigne: `Voici une figure à main levée. Sélectionne <strong>tout</strong> ce que son codage nous apprend, puis valide.`,
        figure: [f.svg, sel.noeud],
        verifier() {
          const choix = new Set([...sel.choisies].map(i => liste[i]));
          if (!choix.size) return { etat: "incomplet", message: "Sélectionne au moins une information." };
          const manque = [...vrais].filter(t => !choix.has(t)).length, trop = [...choix].filter(t => !vrais.has(t)).length;
          if (!manque && !trop) return { etat: "juste" };
          return { etat: "faux", message: trop ? "Tu as choisi une information que le codage ne donne pas : on ne lit que ce qui est codé, pas ce qui « semble » vrai." : "Il manque une information." };
        },
        indice: "Les petits traits identiques indiquent des longueurs égales ; le petit carré indique un angle droit.",
        correction: "Le codage nous apprend : " + [...vrais].join(" ; ") + ".",
        surCorrection() { sel.boutons.forEach((b, i) => b.classList.toggle("bonne", vrais.has(liste[i]))); },
        bloquer: sel.bloquer
      };
    }
  },

  {
    groupe: F1,
    id: "enonce-figure",
    titre: "Associer énoncé et figure",
    description: "Relier chaque énoncé à sa figure à main levée.",
    generer() {
      const types = melanger(["isocele", "equilateral", "rectangle", "rect-isocele", "quelconque-angle"]).slice(0, 3);
      const items = types.map((type, k) => {
        const noms = tirerLettres(3);
        if (type === "quelconque-angle") {
          const [a, b, c] = troisAngles();
          const f = figTriangle(a, b, noms, { angles: [[0, `${a}°`]] }, { l: 200, h: 140, rot: alea(-10, 10) });
          return { cle: k, fig: html(f.svg), texte: `${noms.join("")} tel que ${ang(noms[1], noms[0], noms[2])} = ${a}°` };
        }
        const T = triangleNature(type);
        const f = figTriangle(T.a0, T.a1, noms, { egaux: T.egaux || [], droit: T.droit ?? null }, { l: 200, h: 140, rot: alea(-10, 10) });
        const sommet = noms[T.special ?? 0];
        const texte = type === "isocele" ? `${noms.join("")} isocèle en ${sommet}` : type === "equilateral" ? `${noms.join("")} équilatéral` : type === "rectangle" ? `${noms.join("")} rectangle en ${sommet}` : `${noms.join("")} rectangle isocèle en ${sommet}`;
        return { cle: k, fig: html(f.svg), texte };
      });
      const r = relier(items.map(x => ({ html: x.texte, cle: x.cle })), items.map(x => ({ html: x.fig, cle: x.cle })));
      return {
        consigne: "Relie chaque énoncé à la figure à main levée qui lui correspond : clique sur un énoncé, puis sur une figure.",
        figure: r.noeud,
        verifier: r.verifier,
        indice: "Regarde les codages : traits égaux, angle droit, mesure d'angle.",
        correction: items.map(x => x.texte).join(" ; ") + " : chaque figure porte le codage de son énoncé.",
        surCorrection: r.corriger,
        bloquer: r.bloquer
      };
    }
  },

  {
    groupe: F1,
    id: "coder-figure",
    titre: "Coder une figure",
    description: "Ajouter les traits et l'angle droit qui correspondent à l'énoncé.",
    generer() {
      const type = choisir(["isocele", "equilateral", "rectangle", "rect-isocele"]);
      const T = triangleNature(type), noms = tirerLettres(3);
      let P = cadrer(triangleAngles(T.a0, T.a1), 380, 260, alea(-15, 15));
      const s = figureGeo(380, 260, "Triangle à coder");
      dessinerTriangle(s, P, noms);
      const codes = svg("g", {}); s.append(codes);
      const traits = { "01": 0, "12": 0, "02": 0 }; let droit = null, actif = true;
      const redessiner = () => {
        codes.replaceChildren();
        const tmp = figureGeo(10, 10);
        for (const [k, n] of Object.entries(traits)) if (n) codageLongueur(tmp, P[+k[0]], P[+k[1]], n);
        if (droit != null) { const o = [0, 1, 2].filter(k => k !== droit); codageAngleDroit(tmp, P[droit], V.moins(P[o[0]], P[droit]), V.moins(P[o[1]], P[droit]), 12); }
        codes.append(...tmp.childNodes);
      };
      for (const k of Object.keys(traits)) {
        const l = svg("line", { x1: P[+k[0]].x, y1: P[+k[0]].y, x2: P[+k[1]].x, y2: P[+k[1]].y, class: "zone-clic zone-cote" });
        l.addEventListener("click", () => { if (actif) { traits[k] = (traits[k] + 1) % 3; redessiner(); } });
        s.append(l);
      }
      P.forEach((p, i) => {
        const c = svg("circle", { cx: p.x, cy: p.y, r: 18, class: "zone-clic zone-sommet" });
        c.addEventListener("click", () => { if (actif) { droit = droit === i ? null : i; redessiner(); } });
        s.append(c);
      });
      const nomT = noms.join(""), sommet = noms[T.special ?? 0];
      const enonce = { isocele: `${nomT} est isocèle en ${sommet}`, equilateral: `${nomT} est équilatéral`, rectangle: `${nomT} est rectangle en ${sommet}`, "rect-isocele": `${nomT} est rectangle et isocèle en ${sommet}` }[type];
      const attendus = new Set((T.egaux || []).map(([i, j]) => [i, j].sort().join("")));
      return {
        consigne: `Code la figure pour qu'elle corresponde à l'énoncé : <strong>${enonce}</strong>.<br>Clique sur un côté pour ajouter des petits traits (un clic : |, deux clics : ||, trois clics : rien), sur un sommet pour ajouter ou enlever un angle droit.`,
        figure: s,
        verifier() {
          const marques = Object.entries(traits).filter(([, n]) => n);
          if (!marques.length && droit == null) return { etat: "incomplet", message: "Ajoute le codage sur la figure." };
          if ((T.droit ?? null) !== droit) return { etat: "faux", message: T.droit != null ? `Il faut un angle droit en ${noms[T.droit]}.` : "Il n'y a pas d'angle droit dans cet énoncé." };
          const marquesOk = attendus.size === 0 ? !marques.length
            : marques.length === attendus.size && marques.every(([k]) => attendus.has(k)) && new Set(marques.map(([, n]) => n)).size === 1;
          if (!marquesOk) return { etat: "faux", message: attendus.size ? "Les côtés de même longueur portent le même codage, et seulement eux." : "Il n'y a pas de côtés de même longueur dans cet énoncé." };
          return { etat: "juste" };
        },
        indice: "Isocèle en A : les deux côtés qui partent de A ont la même longueur. Rectangle en A : l'angle droit est en A.",
        correction: `${enonce} : ${attendus.size === 3 ? "les trois côtés ont le même codage" : attendus.size ? "les deux côtés issus de " + sommet + " ont le même codage" : ""}${attendus.size && T.droit != null ? ", et " : ""}${T.droit != null ? "un petit carré en " + noms[T.droit] : ""}.`,
        surCorrection() { for (const k of Object.keys(traits)) traits[k] = attendus.has(k) ? 1 : 0; droit = T.droit ?? null; redessiner(); },
        bloquer: () => { actif = false; }
      };
    }
  },

  {
    groupe: F1,
    id: "phrase-figure",
    titre: "La phrase qui correspond",
    description: "Choisir la phrase qui décrit exactement la figure codée.",
    generer() {
      const noms = tirerLettres(3), [P0, P1, P2] = noms;
      const a = choisir([100, 110, 120, 30, 40, 50]);
      // isocèle en P0 avec un angle marqué en P0
      const b = (180 - a) / 2;
      const f = figTriangle(b, a, [P1, P0, P2], { egaux: [[1, 0, 1], [1, 2, 1]], angles: [[1, `${a}°`]] });
      const bonne = `${P1}${P0} = ${P0}${P2} et ${ang(P1, P0, P2)} = ${a}°`;
      const options = melanger([bonne, `${P1}${P0} = ${P1}${P2} et ${ang(P0, P1, P2)} = ${a}°`, `${P0}${P1} = ${P0}${P2} et ${ang(P0, P2, P1)} = ${a}°`, `${noms.join("")} est équilatéral`]);
      return {
        consigne: "Quelle phrase décrit exactement cette figure codée ?",
        figure: f.svg,
        choix: options,
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Regarde quels côtés portent les mêmes traits, et à quel sommet est la mesure de l'angle.",
        correction: bonne + "."
      };
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "construire-trois-longueurs",
    titre: "Construire un triangle au compas",
    description: "Connaissant les longueurs de ses trois côtés.",
    generer() {
      const s = figureConstruction();
      const [A, B, C] = tirerLettres(3);
      const iso = Math.random() < 0.3;
      let a, b, c;
      do { c = alea(45, 70) / 10; b = alea(30, 55) / 10; a = iso ? b : alea(30, 55) / 10; } while (a + b <= c + 1 || (!iso && Math.abs(a - b) < 0.3));
      const pA = { x: 320 - c * CM / 2, y: 330 }, pB = { x: 320 + c * CM / 2, y: 330 };
      const pC = intersectionCercles(pA, b * CM, pB, a * CM).sort((p, q) => p.y - q.y)[0];
      dessinerTrait(s, pA, pB, "segment", "geo-objet");
      dessinerPoint(s, pA, A, { vers: { x: -1, y: 0.5 } }); dessinerPoint(s, pB, B, { vers: { x: 1, y: 0.5 } });
      const compas = creerCompas(s, { aimants: [pA, pB], P: { x: CW - 80, y: 80 }, r: 1.5 * CM, a: Math.PI });
      const arcPar = (centre, r, nom, ecart) => {
        const liste = arcsDeCentre(compas.arcs, centre);
        if (!liste.length) return `Trace un arc : la pointe du compas en ${nom}.`;
        if (!liste.some(x => Math.abs(x.r - r * CM) < 0.1 * CM)) return `L'écartement doit être de ${cm(r)} ${ecart}.`;
        if (!liste.some(x => Math.abs(x.r - r * CM) < 0.1 * CM && arcPassePar(x, pC))) return `Ton arc n'est pas au bon endroit : trace-le au-dessus du segment, là où se trouvera ${C}.`;
        return true;
      };
      const montrerArc = (centre, r) => { const t = angleDe(centre, pC); compas.placer(centre, r * CM, t - 0.35); compas.tracer(t - 0.35, t + 0.35); };
      return atelier(s, [
        { nom: `Arc de centre ${A}`, texte: `Le côté ${seg(A, B)} est tracé (${cm(c)}). Trace un arc de cercle de centre ${A} et de rayon ${A}${C} = ${cm(b)}, au-dessus du segment.`,
          compas: () => arcPar(pA, b, A, `(c'est la longueur ${A}${C})`), montrer: () => montrerArc(pA, b) },
        { nom: `Arc de centre ${B}`, texte: `Trace un arc de cercle de centre ${B} et de rayon ${B}${C} = ${cm(a)}. Il doit couper le premier arc.`,
          compas: () => arcPar(pB, a, B, `(c'est la longueur ${B}${C})`), montrer: () => montrerArc(pB, a) },
        { nom: "Placer " + C, texte: `Clique sur le point d'intersection des deux arcs : c'est ${C}.`,
          point: { cible: pC, nom: C, tol: 10, vers: { x: 0, y: -1 } },
          dessin: () => { dessinerPoint(s, pC, C, { vers: { x: 0, y: -1 } }); dessinerTrait(s, pA, pC, "segment", "geo-trace"); dessinerTrait(s, pB, pC, "segment", "geo-trace"); },
          fin: `Bravo ! Le triangle ${A}${B}${C} est construit${iso ? ` : il est isocèle en ${C}` : ""}.` }
      ], { compas, consigne: `Construis le triangle ${A}${B}${C} tel que ${A}${B} = ${cm(c)}, ${A}${C} = ${cm(b)} et ${B}${C} = ${cm(a)}.` });
    }
  },

  {
    groupe: F2,
    id: "quel-rayon",
    titre: "Quel rayon pour l'arc ?",
    description: "Où piquer le compas, et avec quel écartement.",
    generer() {
      const noms = tirerLettres(3), [D, E, F] = noms;
      let l1, l2, l3; do { l1 = alea(40, 70) / 10; l2 = alea(25, 60) / 10; l3 = alea(25, 60) / 10; } while (l2 + l3 <= l1 || l2 === l3);
      // [DE] est tracé ; DF = l2, EF = l3
      const ordre = Math.random() < 0.5;
      const donnees = melanger([`${D}${E} = ${cm(l1)}`, `${D}${F} = ${cm(l2)}`, `${E}${F} = ${cm(l3)}`]);
      const [P1, r1, P2, r2] = ordre ? [D, l2, E, l3] : [E, l3, D, l2];
      return {
        consigne: `On construit le triangle ${D}${E}${F} tel que ${donnees.join(", ")}. Le côté ${seg(D, E)} est déjà tracé.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p class="rep">Je pique en ${P1}, avec un écartement de [d] cm ;</p></div><div class="etape-pb"><p class="rep">puis je pique en ${P2}, avec un écartement de [d] cm.</p></div>`,
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux écartements." };
          if (Math.abs(x[0] - r1) < 1e-9 && Math.abs(x[1] - r2) < 1e-9) return { etat: "juste" };
          if (Math.abs(x[0] - r2) < 1e-9 && Math.abs(x[1] - r1) < 1e-9) return { etat: "faux", message: `Tu as échangé les deux longueurs : la pointe en ${P1}, l'arc doit passer par ${F} : c'est la longueur ${P1}${F}.` };
          if (x.some(t => Math.abs(t - l1) < 1e-9)) return { etat: "faux", message: `${D}${E} est déjà tracé : on n'en a plus besoin.` };
          return { etat: "faux" };
        },
        indice: `La pointe en ${P1} : l'arc passe par le point ${F} qu'on cherche, donc le rayon est ${P1}${F}.`,
        correction: `Pointe en ${P1} : rayon ${P1}${F} = ${cm(r1)} ; pointe en ${P2} : rayon ${P2}${F} = ${cm(r2)}.`
      };
    }
  },

  {
    groupe: F2,
    id: "longueur-perimetre",
    titre: "La longueur manquante grâce au périmètre",
    description: "Le périmètre et deux côtés sont connus.",
    generer() {
      const [X, Y, Z] = tirerLettres(3);
      const iso = Math.random() < 0.3;
      let a, b, c; do { a = alea(25, 70) / 10; b = iso ? a : alea(25, 70) / 10; c = alea(25, 70) / 10; } while (a + b <= c || a + c <= b || b + c <= a);
      const p = Math.round((a + b + c) * 10) / 10;
      if (iso) return {
        consigne: `Le triangle ${X}${Y}${Z} est isocèle en ${X}, avec ${X}${Y} = ${cm(a)}. Son périmètre est ${cm(p)}. Calcule ${Y}${Z}.`,
        ligne: `${Y}${Z} = [d] cm`,
        verifier: v => verifierNombre(v[0], c),
        indice: `Isocèle en ${X} : ${X}${Z} = ${X}${Y}.`,
        correction: `${X}${Z} = ${X}${Y} = ${cm(a)}, donc ${Y}${Z} = ${nb(p)} − ${nb(a)} − ${nb(a)} = ${cm(c)}.`
      };
      return {
        consigne: `Le triangle ${X}${Y}${Z} a un périmètre de ${cm(p)}. On sait que ${X}${Y} = ${cm(a)} et ${Y}${Z} = ${cm(b)}. Calcule ${X}${Z}.`,
        ligne: `${X}${Z} = [d] cm`,
        verifier: v => verifierNombre(v[0], c),
        indice: "Le périmètre est la somme des trois côtés.",
        correction: `${X}${Z} = ${nb(p)} − ${nb(a)} − ${nb(b)} = ${cm(c)}.`
      };
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: F3,
    id: "construire-angles",
    titre: "Construire avec le rapporteur",
    description: "Deux côtés et l'angle compris, ou un côté et ses deux angles.",
    generer() {
      const s = figureConstruction();
      const [A, B, C] = tirerLettres(3);
      const deuxAngles = Math.random() < 0.45;
      const c = alea(45, 65) / 10;
      const pA = { x: 320 - c * CM / 2 - 20, y: 340 }, pB = { x: pA.x + c * CM, y: 340 };
      dessinerTrait(s, pA, pB, "segment", "geo-objet");
      dessinerPoint(s, pA, A, { vers: { x: -1, y: 0.6 } }); dessinerPoint(s, pB, B, { vers: { x: 1, y: 0.6 } });
      const rap = creerRapporteur(150);
      const rayons = [];
      const nouveauRayon = (O, phi0) => { const r = demiDroiteMobile(s, O, phi0, 7 * CM); rayons.push(r); return r; };
      let rayon = null;
      const zone = el("div", { class: "zone-rotation" });
      const etapeAngle = (O, nomO, autre, mesure, sens, nomDernier) => ({
        nom: `Angle en ${nomO}`,
        avant() {
          // rapporteur centré en O, posé sur [O autre]
          rap.placer(O.x, O.y, 0);
          s.append(rap);
          rayon = nouveauRayon(O, sens > 0 ? 90 : 90);
          zone.replaceChildren(boutonsRotation(rayon));
        },
        texte: `Le rapporteur est centré en ${nomO}, son zéro sur ${seg(nomO, autre)}. Fais tourner la demi-droite (tire le point rond) pour que ${ang(autre, nomO, nomDernier)} = ${mesure}°.`,
        tracer() {
          const m = sens > 0 ? rayon.phi : 180 - rayon.phi;
          if (!rayon.touche) return "Fais tourner la demi-droite en tirant le point rond, ou avec les boutons.";
          if (Math.abs(normaliser(m - mesure)) <= 0.5) return true;
          if (Math.abs(normaliser(m - (180 - mesure))) <= 0.5) return `Ton angle mesure ${180 - mesure}° : tu as lu la mauvaise graduation. Prends celle qui part de 0 sur ${seg(nomO, autre)}.`;
          return `Ton angle mesure ${Math.round(((m % 360) + 360) % 360)}°.`;
        },
        bouton: "J'ai tracé ✓",
        montrer() { rayon.placer(sens > 0 ? mesure : 180 - mesure); rayon.touche = true; },
        montrerTexte: "Voici la bonne position. Clique sur « J'ai tracé ».",
        dessin() { rayon.actif = false; rap.remove(); zone.replaceChildren(); }
      });
      if (!deuxAngles) {
        const alpha = alea(4, 24) * 5, b = alea(30, 60) / 10;
        const pC = pt(pA, alpha, b * CM);
        return atelier(s, [
          etapeAngle(pA, A, B, alpha, 1, C),
          { nom: `Placer ${C}`, texte: `Sur la demi-droite que tu viens de tracer, place ${C} tel que ${A}${C} = ${cm(b)} : clique sur la graduation.`,
            avant() { regleSur(s, pA, alpha, 7); },
            clic: { depart: pA, direction: dir(alpha), longueur: 7, cible: b, nom: C, message: t => `Tu as placé ${C} à ${cm(t)} de ${A}.` },
            dessin() { dessinerPoint(s, pC, C, { vers: { x: 0.3, y: -1 } }); s.querySelector(".regle-trait")?.remove(); } },
          { nom: "Terminer", texte: `Trace le côté ${seg(B, C)}.`, bouton: `Tracer ${seg(B, C)}`, tracer: () => true,
            dessin() { dessinerTrait(s, pB, pC, "segment", "geo-trace"); },
            fin: `Bravo ! ${A}${B}${C} est construit : ${A}${B} = ${cm(c)}, ${ang(B, A, C)} = ${alpha}° et ${A}${C} = ${cm(b)}.` }
        ], { consigne: `Construis le triangle ${A}${B}${C} tel que ${A}${B} = ${cm(c)}, ${ang(B, A, C)} = ${alpha}° et ${A}${C} = ${cm(b)}.`, apres: [zone], bloquerOutils: () => rayons.forEach(r => { r.actif = false; }) });
      }
      let alpha, beta, pC;
      do { alpha = alea(5, 16) * 5; beta = alea(5, 16) * 5; pC = intersectionDemiDroites(pA, alpha, pB, 180 - beta); }
      while (alpha + beta > 140 || alpha + beta < 60 || pC.y < 40);
      return atelier(s, [
        etapeAngle(pA, A, B, alpha, 1, C),
        etapeAngle(pB, B, A, beta, -1, C),
        { nom: `Placer ${C}`, texte: `Clique sur le point où les deux demi-droites se coupent : c'est ${C}.`, point: { cible: pC, nom: C, tol: 10 },
          dessin() { dessinerPoint(s, pC, C, { vers: { x: 0, y: -1 } }); },
          fin: `Bravo ! ${A}${B}${C} est construit. Son troisième angle mesure 180° − ${alpha}° − ${beta}° = ${180 - alpha - beta}°.` }
      ], { consigne: `Construis le triangle ${A}${B}${C} tel que ${A}${B} = ${cm(c)}, ${ang(B, A, C)} = ${alpha}° et ${ang(A, B, C)} = ${beta}°.`, apres: [zone], bloquerOutils: () => rayons.forEach(r => { r.actif = false; }) });
    }
  },

  {
    groupe: F3,
    id: "main-levee-juste",
    titre: "Quelle figure à main levée est juste ?",
    description: "L'angle doit être au bon sommet, entre les bons côtés.",
    generer() {
      const [A, B, C] = tirerLettres(3);
      const ab = alea(3, 7), bc = alea(3, 7), beta = alea(7, 16) * 5;
      // bonne : angle en B, entre [BA] et [BC]
      const fig = (sommet, cotes) => {
        const f = figTriangle(65, beta, [A, B, C], { angles: [[sommet, `${beta}°`]], cotes }, { l: 220, h: 160, rot: 0 });
        return f.svg;
      };
      const options = [
        fig(1, [[0, 1, `${ab} cm`], [1, 2, `${bc} cm`]]),
        fig(0, [[0, 1, `${ab} cm`], [1, 2, `${bc} cm`]]),
        fig(1, [[0, 1, `${ab} cm`], [0, 2, `${bc} cm`]])
      ];
      const ordre = melanger([0, 1, 2]);
      return {
        consigne: `On veut construire le triangle ${A}${B}${C} tel que ${A}${B} = ${cm(ab)}, ${ang(A, B, C)} = ${beta}° et ${B}${C} = ${cm(bc)}. Quelle figure à main levée est juste ?`,
        choix: ordre.map(i => options[i]),
        verifier: (v, c) => ({ etat: ordre[c] === 0 ? "juste" : "faux", message: ordre[c] === 1 ? `L'angle ${ang(A, B, C)} a pour sommet ${B}, la lettre du milieu.` : `${B}${C} est le côté qui relie ${B} et ${C}.` }),
        indice: `Dans ${ang(A, B, C)}, le sommet est la lettre du milieu : ${B}.`,
        correction: `L'angle ${ang(A, B, C)} est en ${B}, entre les côtés ${seg(B, A)} et ${seg(B, C)}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "nature-codage",
    titre: "La nature d'après le codage",
    description: "Isocèle, équilatéral, rectangle… et en quel sommet.",
    generer() {
      const type = choisir(["isocele", "equilateral", "rectangle", "rect-isocele", "quelconque"]);
      const T = triangleNature(type), noms = tirerLettres(3);
      const angles = type === "quelconque" ? [[0, `${T.a0}°`], [1, `${T.a1}°`]] : [];
      const f = figTriangle(T.a0, T.a1, noms, { egaux: T.egaux || [], droit: T.droit ?? null, angles });
      const sommet = noms[T.special ?? 0];
      const bonne = cap(phraseNature(type, sommet));
      const autresSommets = noms.filter(n => n !== sommet);
      const pool = [`Isocèle en ${choisir(autresSommets)}`, "Équilatéral", `Rectangle en ${sommet}`, `Rectangle isocèle en ${sommet}`, `Isocèle en ${sommet}`, "Quelconque", `Rectangle en ${choisir(autresSommets)}`];
      const options = melanger([bonne, ...melanger(pool.filter(p => p !== bonne)).slice(0, 3)]);
      return {
        consigne: `Quelle est la nature du triangle ${noms.join("")} ?`,
        figure: f.svg,
        choix: options,
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Deux côtés égaux : isocèle (en leur point commun). Trois côtés égaux : équilatéral. Un angle droit : rectangle.",
        correction: `${noms.join("")} est ${phraseNature(type, sommet)}.`
      };
    }
  },

  {
    groupe: F4,
    id: "nature-longueurs",
    titre: "La nature d'après les longueurs",
    description: "Attention aux unités !",
    generer() {
      const noms = tirerLettres(3), [R, S, T] = noms;
      const type = choisir(["isocele", "isocele", "equilateral", "quelconque"]);
      const a = alea(3, 8);
      let l; // longueurs de [RS], [ST], [RT] en cm
      const sommet = choisir([0, 1, 2]);
      if (type === "equilateral") l = [a, a, a];
      else if (type === "quelconque") { l = melanger([a, a + 1, a + 2]); }
      else { const b = choisir([a - 1, a + 2, a + 1.5].filter(x => x > a / 2 && x < 2 * a)); l = sommet === 0 ? [a, b, a] : sommet === 1 ? [a, a, b] : [b, a, a]; }
      // [RS] et [RT] partent de R (0) ; [RS] et [ST] de S (1) ; [ST] et [RT] de T (2)
      const conv = alea(0, 2);
      const ecrit = l.map((x, i) => i === conv && Math.random() < 0.6 ? `${nb(x * 10)} mm` : cm(x));
      const bonne = type === "isocele" ? `Isocèle en ${noms[sommet]}` : cap(NOM_NATURE[type]);
      const options = melanger([...new Set([bonne, "Quelconque", "Équilatéral", ...noms.map(n => `Isocèle en ${n}`)])]).slice(0, 5);
      if (!options.includes(bonne)) options[0] = bonne;
      return {
        consigne: `Dans le triangle ${R}${S}${T} : ${R}${S} = ${ecrit[0]}, ${S}${T} = ${ecrit[1]} et ${R}${T} = ${ecrit[2]}. Quelle est sa nature ?`,
        choix: melanger(options),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Écris toutes les longueurs dans la même unité. Un triangle isocèle l'est en son sommet principal : le point commun aux deux côtés égaux.",
        correction: `${R}${S} = ${cm(l[0])}, ${S}${T} = ${cm(l[1])}, ${R}${T} = ${cm(l[2])} : ${R}${S}${T} est ${bonne[0].toLowerCase() + bonne.slice(1)}.`
      };
    }
  },

  {
    groupe: F4,
    id: "isocele-vocabulaire",
    titre: "Isocèle : base, côtés égaux, angles égaux",
    description: "Le vocabulaire du triangle isocèle.",
    generer() {
      const noms = tirerLettres(3), [R, S, T] = noms;
      // isocèle en S
      const base = seg(R, T), cotes = `${S}${R} = ${S}${T}`;
      const anglesEgaux = `${ang(S, R, T)} = ${ang(R, T, S)}`;
      return {
        consigne: `Le triangle ${R}${S}${T} est isocèle en ${S}. Complète.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Sa base est :</p>[s]</div><div class="etape-pb"><p>2. Les côtés de même longueur :</p>[s]</div><div class="etape-pb"><p>3. Les angles de même mesure :</p>[s]</div>`,
        listes: [melanger([seg(R, S), seg(S, T), base]), melanger([`${R}${S} = ${R}${T}`, cotes, `${T}${R} = ${T}${S}`]),
          melanger([anglesEgaux, `${ang(R, S, T)} = ${ang(S, R, T)}`, `${ang(R, S, T)} = ${ang(R, T, S)}`])],
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Réponds aux trois questions." };
          const l = this.listes;
          const faux = [l[0][v[0]] !== base, l[1][v[1]] !== cotes, l[2][v[2]] !== anglesEgaux].map((f, i) => f ? i + 1 : 0).filter(Boolean);
          return faux.length ? { etat: "faux", message: `Revois ${faux.length > 1 ? "les questions " + faux.join(" et ") : "la question " + faux[0]}.` } : { etat: "juste" };
        },
        indice: `${S} est le sommet principal : les deux côtés égaux partent de ${S} ; la base est le côté opposé à ${S} ; les angles à la base sont égaux.`,
        correction: `Base : ${base} ; ${cotes} ; ${anglesEgaux} (les angles à la base).`
      };
    }
  },

  {
    groupe: F4,
    id: "nature-angles",
    titre: "La nature d'après les angles",
    description: "Deux angles égaux, trois angles égaux, un angle droit…",
    generer() {
      const noms = tirerLettres(3), [D, E, F] = noms;
      const cas = choisir(["iso", "iso", "equi", "rect", "rect-iso", "quelc"]);
      let aD, aF, bonne;
      if (cas === "iso") { aD = aF = alea(25, 75); bonne = `Isocèle en ${E}`; }
      else if (cas === "equi") { aD = aF = 60; bonne = "Équilatéral"; }
      else if (cas === "rect") { aD = alea(25, 65); aF = 90 - aD; if (aD === aF) aD += 5, aF -= 5; bonne = `Rectangle en ${E}`; }
      else if (cas === "rect-iso") { aD = aF = 45; bonne = `Rectangle isocèle en ${E}`; }
      else { do { aD = alea(30, 80); aF = alea(30, 80); } while (aD === aF || aD + aF === 90 || aD + aF > 150 || 180 - aD - aF === aD || 180 - aD - aF === aF || aD + aF === 120); bonne = "Quelconque"; }
      const options = melanger([...new Set([bonne, `Isocèle en ${E}`, `Isocèle en ${D}`, "Équilatéral", `Rectangle en ${E}`, `Rectangle isocèle en ${E}`, "Quelconque"])].filter(x => x !== bonne)).slice(0, 3).concat(bonne);
      return {
        consigne: `Dans le triangle ${D}${E}${F}, ${ang(E, D, F)} = ${aD}° et ${ang(D, F, E)} = ${aF}°. Quelle est sa nature ?`,
        choix: melanger(options),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: `Calcule d'abord le troisième angle, ${ang(D, E, F)}, avec la somme des angles (180°).`,
        correction: `${ang(D, E, F)} = 180° − ${aD}° − ${aF}° = ${180 - aD - aF}° : ${D}${E}${F} est ${bonne[0].toLowerCase() + bonne.slice(1)}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */

  {
    groupe: F5,
    id: "troisieme-angle",
    titre: "Calculer le troisième angle",
    description: "La somme des angles d'un triangle est 180°.",
    generer(stats) {
      const [E, F, G] = tirerLettres(3), [a, b, c] = troisAngles();
      const aide = (stats?.serie ?? 0) < 3;
      return {
        consigne: `Dans le triangle ${E}${F}${G}, ${ang(F, E, G)} = ${a}° et ${ang(E, F, G)} = ${b}°. Calcule ${ang(E, G, F)}.`,
        figure: aide ? schema180([[`${a}°`, a], [`${b}°`, b], ["?", c]]) : undefined,
        ligne: `${ang(E, G, F)} = [d] °`,
        verifier(v) {
          const r = verifierNombre(v[0], c);
          if (r.etat === "faux" && Math.abs(lireNombre(v[0]) - (a + b)) < 1e-9) r.message = "Tu as calculé la somme des deux angles : il faut la retirer de 180°.";
          return r;
        },
        indice: "180° − les deux angles connus.",
        correction: `${ang(E, G, F)} = 180° − ${a}° − ${b}° = ${c}°.`
      };
    }
  },

  {
    groupe: F5,
    id: "triangle-rectangle",
    titre: "Triangles rectangles",
    description: "Les deux angles aigus ont pour somme 90°.",
    generer() {
      const [A, B, C] = tirerLettres(3), a = alea(15, 75);
      const cas = Math.random() < 0.8;
      if (!cas) return {
        consigne: `${A}${B}${C} est rectangle en ${B} et ${ang(B, A, C)} = ${ang(B, C, A)}. Calcule ${ang(B, A, C)}.`,
        ligne: `${ang(B, A, C)} = [d] °`,
        verifier: v => verifierNombre(v[0], 45),
        indice: "Les deux angles aigus sont égaux, et leur somme fait 90°.",
        correction: `(180° − 90°) ÷ 2 = 45°.`
      };
      return {
        consigne: `${A}${B}${C} est rectangle en ${A} et ${ang(A, B, C)} = ${a}°. Calcule ${ang(A, C, B)}.`,
        ligne: `${ang(A, C, B)} = [d] °`,
        verifier(v) {
          const r = verifierNombre(v[0], 90 - a);
          if (r.etat === "faux" && Math.abs(lireNombre(v[0]) - (180 - a)) < 1e-9) r.message = `N'oublie pas l'angle droit en ${A} : il mesure 90°.`;
          return r;
        },
        indice: `L'angle droit en ${A} mesure 90°.`,
        correction: `${ang(A, C, B)} = 180° − 90° − ${a}° = ${90 - a}°.`
      };
    }
  },

  {
    groupe: F5,
    id: "isocele-sommet",
    titre: "Isocèle : on connaît l'angle au sommet principal",
    description: "Les deux angles à la base sont égaux.",
    generer() {
      const [K, L, M] = tirerLettres(3);
      const a = 2 * alea(10, 70);
      const b = (180 - a) / 2;
      return {
        consigne: `${K}${L}${M} est isocèle en ${K} et ${ang(L, K, M)} = ${a}°. Calcule les deux autres angles.`,
        ligne: `${ang(K, L, M)} = ${ang(K, M, L)} = [d] °`,
        verifier(v) {
          const r = verifierNombre(v[0], b);
          if (r.etat === "faux" && Math.abs(lireNombre(v[0]) - (180 - a)) < 1e-9) r.message = "C'est la somme des deux angles à la base : il faut la partager en deux.";
          return r;
        },
        indice: "Les deux angles à la base sont égaux : (180° − angle au sommet) ÷ 2.",
        correction: `(180° − ${a}°) ÷ 2 = ${180 - a}° ÷ 2 = ${b}°.`
      };
    }
  },

  {
    groupe: F5,
    id: "isocele-base",
    titre: "Isocèle : on connaît un angle à la base",
    description: "L'autre angle à la base est égal.",
    generer() {
      const [T, U, Vv] = tirerLettres(3), b = alea(20, 85);
      return {
        consigne: `${T}${U}${Vv} est isocèle en ${T} et ${ang(T, U, Vv)} = ${b}°. Calcule les deux autres angles.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p class="rep">${ang(T, Vv, U)} = [d] °</p></div><div class="etape-pb"><p class="rep">${ang(U, T, Vv)} = [d] °</p></div>`,
        verifier(v) {
          const r = [verifierNombre(v[0], b), verifierNombre(v[1], 180 - 2 * b)];
          if (r.some(x => x.etat === "incomplet")) return { etat: "incomplet", message: "Complète les deux angles." };
          if (r[0].etat === "faux") return { etat: "faux", message: `${ang(T, U, Vv)} et ${ang(T, Vv, U)} sont les deux angles à la base : ils sont égaux.` };
          return r[1];
        },
        indice: `Isocèle en ${T} : les angles en ${U} et en ${Vv} sont égaux.`,
        correction: `${ang(T, Vv, U)} = ${b}° ; ${ang(U, T, Vv)} = 180° − ${b}° − ${b}° = ${180 - 2 * b}°.`
      };
    }
  },

  {
    groupe: F5,
    id: "existe",
    titre: "Ce triangle existe-t-il ?",
    description: "La somme des angles doit faire exactement 180°.",
    generer() {
      const existe = Math.random() < 0.5;
      let a = troisAngles();
      if (!existe) a = a.map((x, i) => i === 2 ? x + choisir([-15, -10, -5, 5, 10, 20]) : x);
      const s = a[0] + a[1] + a[2];
      return {
        consigne: `Un triangle peut-il avoir des angles de ${a[0]}°, ${a[1]}° et ${a[2]}° ?`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p class="rep">Somme des angles : [d] °</p></div><div class="etape-pb"><p>Donc ce triangle :</p>[s]</div>`,
        listes: [["existe", "n'existe pas"]],
        verifier(v) {
          const r = verifierNombre(v[0], s);
          if (r.etat !== "juste") return r.etat === "incomplet" ? { etat: "incomplet", message: "Calcule la somme." } : { etat: "faux", message: "Vérifie ta somme." };
          if (v[1] == null) return { etat: "incomplet", message: "Conclus." };
          return (v[1] === 0) === existe ? { etat: "juste" } : { etat: "faux", message: "Compare la somme à 180°." };
        },
        indice: "Dans un triangle, la somme des angles est toujours 180°.",
        correction: `${a.join(" + ")} = ${s}° ${existe ? "= 180° : il existe." : "≠ 180° : il n'existe pas."}`
      };
    }
  },

  {
    groupe: F5,
    id: "angle-figure",
    titre: "L'angle marqué « ? » sur une figure",
    description: "Lire le codage, puis calculer.",
    generer() {
      const noms = tirerLettres(3);
      const cas = choisir(["iso-sommet", "iso-base", "rect", "quelc", "equi"]);
      let f, rep, explic;
      if (cas === "iso-sommet") { const b = alea(25, 80); f = figTriangle(b, b, noms, { egaux: [[2, 0, 1], [2, 1, 1]], angles: [[0, `${b}°`], [2, "?"]] }); rep = 180 - 2 * b; explic = `isocèle : les deux angles à la base mesurent ${b}°, donc ? = 180° − 2 × ${b}° = ${rep}°.`; }
      else if (cas === "iso-base") { const b = alea(25, 80); f = figTriangle(b, b, noms, { egaux: [[2, 0, 1], [2, 1, 1]], angles: [[2, `${180 - 2 * b}°`], [0, "?"]] }); rep = b; explic = `isocèle : ? = (180° − ${180 - 2 * b}°) ÷ 2 = ${rep}°.`; }
      else if (cas === "rect") { const b = alea(20, 70); f = figTriangle(90, b, noms, { droit: 0, angles: [[1, `${b}°`], [2, "?"]] }); rep = 90 - b; explic = `rectangle : ? = 90° − ${b}° = ${rep}°.`; }
      else if (cas === "equi") { f = figTriangle(60, 60, noms, { egaux: [[0, 1, 1], [1, 2, 1], [2, 0, 1]], angles: [[2, "?"]] }); rep = 60; explic = "équilatéral : ses trois angles sont égaux, 180° ÷ 3 = 60°."; }
      else { const [a, b, c] = troisAngles(); f = figTriangle(a, b, noms, { angles: [[0, `${a}°`], [1, `${b}°`], [2, "?"]] }); rep = c; explic = `? = 180° − ${a}° − ${b}° = ${c}°.`; }
      return {
        consigne: "Cette figure est à main levée : on ne mesure pas, on calcule. Trouve la mesure de l'angle marqué « ? ».",
        figure: f.svg,
        ligne: "? = [d] °",
        verifier: v => verifierNombre(v[0], rep),
        indice: "Regarde le codage : des côtés égaux (isocèle, équilatéral), un angle droit ? Puis utilise la somme des angles.",
        correction: "Le triangle est " + explic
      };
    }
  },

  /* ================= Feuille 6 ================= */

  {
    groupe: F6,
    id: "calculer-avant",
    titre: "Calculer avant de construire",
    description: "Trouver l'angle qui manque pour pouvoir construire.",
    generer() {
      const [A, B, C] = tirerLettres(3);
      let a, c; do { a = alea(6, 14) * 5; c = alea(6, 16) * 5; } while (a + c > 150);
      const b = 180 - a - c, l = alea(4, 7);
      return {
        consigne: `On veut construire ${A}${B}${C} tel que ${A}${B} = ${cm(l)}, ${ang(B, A, C)} = ${a}° et ${ang(A, C, B)} = ${c}°. Pour tracer les deux angles aux extrémités de ${seg(A, B)}, il manque une mesure.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Quel angle faut-il calculer ?</p>[s]</div><div class="etape-pb"><p class="rep">2. Il mesure [d] °</p></div>`,
        listes: [melanger([ang(A, B, C), ang(B, A, C), ang(A, C, B)])],
        verifier(v) {
          if (v[0] == null) return { etat: "incomplet", message: "Choisis l'angle à calculer." };
          if (this.listes[0][v[0]] !== ang(A, B, C)) return { etat: "faux", message: `Les angles à tracer sont ceux qui touchent ${seg(A, B)} : en ${A} et en ${B}.` };
          return verifierNombre(v[1], b);
        },
        indice: `On trace ${seg(A, B)}, puis un angle en ${A} et un angle en ${B}. L'angle en ${B} manque : la somme des angles vaut 180°.`,
        correction: `${ang(A, B, C)} = 180° − ${a}° − ${c}° = ${b}°. On peut alors tracer ${seg(A, B)}, l'angle de ${a}° en ${A} et l'angle de ${b}° en ${B}.`
      };
    }
  },

  {
    groupe: F6,
    id: "points-alignes",
    titre: "Les points sont-ils alignés ?",
    description: "Calculer un angle, puis comparer à 180°.",
    generer() {
      const [A, B, C, D] = tirerLettres(4);
      let a, b; do { a = alea(30, 75); b = alea(30, 75); } while (a + b > 140);
      const acb = 180 - a - b;
      const aligne = Math.random() < 0.5;
      const acd = aligne ? 180 - acb : 180 - acb + choisir([-6, -4, 4, 6]);
      // figure : B, C (à droite de B), A au-dessus ; D à droite de C
      const s = figureGeo(420, 240, "Figure à main levée");
      const pB = { x: 40, y: 190 }, pC = { x: 230, y: 190 };
      const d = 190 * Math.sin(b * DEG) / Math.sin((a + b) * DEG);
      const pA = pt(pB, b, d);
      const pD = pt(pC, -(acd - (180 - acb)) * 0.6, 150);
      for (const [p, q] of [[pB, pC], [pB, pA], [pA, pC], [pC, pD]]) dessinerTrait(s, p, q, "segment", "geo-trait");
      for (const [p, n, v] of [[pA, A, { x: 0, y: -1 }], [pB, B, { x: -1, y: 0.5 }], [pC, C, { x: 0, y: 1 }], [pD, D, { x: 1, y: 0.5 }]]) dessinerTexte(s, V.plus(p, V.fois(V.unitaire(v), 16)), n);
      dessinerTexte(s, pt(pB, b / 2, 40), `${b}°`, "geo-mesure");
      dessinerTexte(s, V.plus(pA, V.fois(V.unitaire(V.moins(V.milieu(pB, pC), pA)), 38)), `${a}°`, "geo-mesure");
      const dirCA = directionDeg(pC, pA), dirCD = directionDeg(pC, pD);
      dessinerTexte(s, pt(pC, (dirCA + dirCD) / 2, 40), `${acd}°`, "geo-mesure");
      return {
        consigne: `Sur cette figure à main levée, on ne peut pas voir si ${B}, ${C} et ${D} sont alignés. On calcule !`,
        figure: s,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p class="rep">1. ${ang(A, C, B)} = [d] °</p></div><div class="etape-pb"><p class="rep">2. ${ang(B, C, A)} + ${ang(A, C, D)} = [d] °</p></div><div class="etape-pb"><p>3. Les points ${B}, ${C} et ${D} sont-ils alignés ?</p>[s]</div>`,
        listes: [["Oui", "Non"]],
        verifier(v) {
          const r1 = verifierNombre(v[0], acb), r2 = verifierNombre(v[1], acb + acd);
          if (r1.etat === "incomplet" || r2.etat === "incomplet" || v[2] == null) return { etat: "incomplet", message: "Réponds aux trois questions." };
          if (r1.etat === "faux") return { etat: "faux", message: `Dans le triangle ${A}${B}${C}, la somme des angles fait 180°.` };
          if (r2.etat === "faux") return { etat: "faux", message: "Vérifie ton addition." };
          return (v[2] === 0) === aligne ? { etat: "juste" } : { etat: "faux", message: "Des points alignés forment un angle plat : 180°." };
        },
        indice: `Calcule l'angle ${ang(A, C, B)} dans le triangle ${A}${B}${C}, puis ajoute ${ang(A, C, D)}. ${B}, ${C}, ${D} sont alignés si l'angle ${ang(B, C, D)} est plat (180°).`,
        correction: `${ang(A, C, B)} = 180° − ${a}° − ${b}° = ${acb}° ; ${acb}° + ${acd}° = ${acb + acd}° ${aligne ? "= 180° : les points sont alignés." : "≠ 180° : les points ne sont pas alignés."}`
      };
    }
  },

  /* ================= Feuille 7 ================= */

  {
    groupe: F7,
    id: "trouver-centre",
    titre: "Trouver le centre du cercle circonscrit",
    description: "Le point où se coupent les médiatrices.",
    generer() {
      const s = figureGeo(420, 320, "Triangle et médiatrices");
      s.classList.add("geo-manipuler");
      const noms = tirerLettres(3), O = { x: 210 + alea(-20, 20), y: 165 + alea(-15, 15) }, R = alea(95, 120);
      const angs = [alea(190, 230), alea(300, 345), alea(60, 120)].map(t => t * DEG);
      const P = angs.map(t => V.plus(O, V.fois(V.angle(t), R)));
      dessinerTriangle(s, P, noms, { classe: "geo-objet" });
      const nbMed = choisir([2, 3]);
      [[0, 1], [1, 2], [2, 0]].slice(0, nbMed).forEach(([i, j]) => {
        const M = V.milieu(P[i], P[j]), u = V.normal(V.unitaire(V.moins(P[j], P[i])));
        dessinerTrait(s, M, V.plus(M, u), "droite", "geo-trait-fin");
        codageAngleDroit(s, M, V.moins(P[j], M), u, 8);
        codageLongueur(s, P[i], M, 1); codageLongueur(s, M, P[j], 1);
      });
      let choix = null, marque = null, actif = true;
      s.addEventListener("pointerdown", e => {
        if (!actif) return;
        choix = positionClic(s, e);
        marque?.remove();
        marque = dessinerPoint(s, choix, "", { classe: "geo-eleve" });
      });
      return {
        consigne: `Les ${nbMed === 2 ? "deux" : "trois"} droites tracées sont des médiatrices des côtés du triangle ${noms.join("")}. Clique sur le centre du cercle qui passe par ${noms[0]}, ${noms[1]} et ${noms[2]}.`,
        figure: s,
        verifier() {
          if (!choix) return { etat: "incomplet", message: "Clique sur la figure." };
          return dist(choix, O) < 12 ? { etat: "juste" } : { etat: "faux", message: "Le centre est à égale distance des trois sommets : il est sur chaque médiatrice." };
        },
        indice: "Un point de la médiatrice d'un segment est à égale distance de ses extrémités. Le centre est sur toutes les médiatrices.",
        correction: "Le centre est le point d'intersection des médiatrices. Voici le cercle circonscrit.",
        surCorrection() { dessinerCercle(s, O, R, "geo-axe-correct geo-cercle-correct"); dessinerPoint(s, O, "O", { classe: "geo-correct", vers: { x: 1, y: 1 } }); },
        bloquer: () => { actif = false; }
      };
    }
  },

  {
    groupe: F7,
    id: "cercle-circonscrit",
    titre: "Construire le cercle circonscrit",
    description: "Deux médiatrices au compas, puis le cercle.",
    generer() {
      const s = figureConstruction();
      const [E, F, G, O] = tirerLettres(4);
      const C = { x: 300 + alea(-20, 20), y: 215 }, R = alea(30, 38) / 10 * CM;
      const pE = V.plus(C, V.fois(V.angle(alea(150, 185) * DEG), R)), pF = V.plus(C, V.fois(V.angle(alea(355, 390) * DEG), R)), pG = V.plus(C, V.fois(V.angle(alea(245, 290) * DEG), R));
      for (const [p, q] of [[pE, pF], [pF, pG], [pG, pE]]) dessinerTrait(s, p, q, "segment", "geo-objet");
      for (const [p, n] of [[pE, E], [pF, F], [pG, G]]) dessinerPoint(s, p, n, { vers: V.moins(p, C) });
      const aimants = [pE, pF, pG];
      const compas = creerCompas(s, { aimants, P: { x: CW - 70, y: CH - 50 }, r: 1.5 * CM, a: Math.PI });
      const etapeMed = (P, Q, nP, nQ) => {
        let pts = null;
        return {
          nom: `Médiatrice de ${seg(nP, nQ)}`, texte: `Construis au compas la médiatrice de ${seg(nP, nQ)} : des arcs de même écartement, centrés en ${nP} et en ${nQ}, qui se coupent de part et d'autre du côté.`,
          compas: () => { const r = mediatriceAuCompas(compas.arcs, P, Q, nP, nQ); if (typeof r === "string") return r; pts = r.pts; return true; },
          montrer: () => { pts = montrerMediatrice(compas, P, Q); },
          dessin: () => dessinerDroite(s, pts[0], V.unitaire(V.moins(pts[1], pts[0])), "", CW, CH, "geo-trace")
        };
      };
      return atelier(s, [
        etapeMed(pE, pF, E, F),
        etapeMed(pF, pG, F, G),
        { nom: "Le centre", texte: `Clique sur le point ${O} où les deux médiatrices se coupent.`, point: { cible: C, nom: O, tol: 9, message: "Ce n'est pas le point d'intersection des deux médiatrices." },
          dessin: () => { dessinerPoint(s, C, O, { vers: { x: 0.8, y: 1 } }); aimants.push(C); } },
        { nom: "Le cercle", texte: `Trace le cercle de centre ${O} passant par ${E} : pointe en ${O}, mine en ${E}, un tour complet avec ↻.`,
          compas: () => cercleTrace(compas.arcs, C, R) || (arcsDeCentre(compas.arcs, C).length ? "Le cercle doit passer par " + E + " et être complet (un tour entier avec ↻)." : `La pointe du compas doit être en ${O}.`),
          montrer: () => { const t = angleDe(C, pE); compas.placer(C, R, t); compas.tracer(t, t + 2 * Math.PI); },
          fin: `Bravo ! Le cercle passe par ${E}, ${F} et ${G} : c'est le cercle circonscrit au triangle.` }
      ], { compas, consigne: `Construis le cercle circonscrit au triangle ${E}${F}${G}.` });
    }
  },

  {
    groupe: F7,
    id: "justifier-centre",
    titre: "Pourquoi le cercle passe par les trois sommets",
    description: "Compléter la justification avec les médiatrices.",
    generer() {
      const [R, S, T] = tirerLettres(3), O = "O";
      const egalites = [`${O}${R} = ${O}${S}`, `${O}${S} = ${O}${T}`, `${O}${R} = ${O}${T}`, `${R}${S} = ${S}${T}`];
      return {
        consigne: `${O} est le point d'intersection des médiatrices de ${seg(R, S)} et de ${seg(S, T)}. Complète la justification.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>${O} est sur la médiatrice de ${seg(R, S)}, donc :</p>[s]</div><div class="etape-pb"><p>${O} est sur la médiatrice de ${seg(S, T)}, donc :</p>[s]</div><div class="etape-pb"><p>Donc ${O}${R} = ${O}${S} = ${O}${T} : ${O} est le centre du cercle qui passe par…</p>[s]</div>`,
        listes: [melanger([...egalites]), melanger([...egalites]), melanger([`${R}, ${S} et ${T}`, `${R} et ${T} seulement`, "le milieu de chaque côté"])],
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Complète les trois phrases." };
          const l = this.listes;
          if (l[0][v[0]] !== egalites[0]) return { etat: "faux", message: `Un point de la médiatrice de ${seg(R, S)} est à la même distance de ${R} et de ${S}.` };
          if (l[1][v[1]] !== egalites[1]) return { etat: "faux", message: `Un point de la médiatrice de ${seg(S, T)} est à la même distance de ${S} et de ${T}.` };
          return l[2][v[2]] === `${R}, ${S} et ${T}` ? { etat: "juste" } : { etat: "faux", message: `${O} est à la même distance des trois sommets.` };
        },
        indice: "Un point de la médiatrice d'un segment est équidistant des extrémités de ce segment.",
        correction: `${egalites[0]} et ${egalites[1]}, donc le cercle de centre ${O} passe par ${R}, ${S} et ${T} : c'est le cercle circonscrit. Deux médiatrices suffisent !`
      };
    }
  },

  {
    groupe: F7,
    id: "assiette-cassee",
    titre: "L'assiette cassée",
    description: "Retrouver le centre d'un cercle à partir d'un morceau.",
    generer() {
      const s = figureConstruction("Morceau d'assiette");
      const C = { x: 320 + alea(-30, 30), y: 250 }, R = alea(30, 40) / 10 * CM;
      const t0 = alea(195, 215), t1 = alea(325, 345);
      // le morceau d'assiette : un arc épais
      const p0 = V.plus(C, V.fois(V.angle(t0 * DEG), R)), p1 = V.plus(C, V.fois(V.angle(t1 * DEG), R));
      s.append(svg("path", { d: `M${p0.x},${p0.y} A${R},${R} 0 0 1 ${p1.x},${p1.y}`, class: "assiette" }));
      const [P, Q, Rn, O] = tirerLettres(4);
      const pP = V.plus(C, V.fois(V.angle((t0 + 8) * DEG), R)), pQ = V.plus(C, V.fois(V.angle(((t0 + t1) / 2) * DEG), R)), pR = V.plus(C, V.fois(V.angle((t1 - 8) * DEG), R));
      for (const [p, n] of [[pP, P], [pQ, Q], [pR, Rn]]) dessinerPoint(s, p, n, { vers: V.moins(p, C) });
      dessinerTrait(s, pP, pQ, "segment", "geo-trait-fin"); dessinerTrait(s, pQ, pR, "segment", "geo-trait-fin");
      const aimants = [pP, pQ, pR];
      const compas = creerCompas(s, { aimants, P: { x: CW - 70, y: CH - 50 }, r: 1.5 * CM, a: Math.PI });
      const echelle = choisir([3, 4, 5]), rDessin = Math.round(R / CM * 10) / 10;
      const etapeMed = (A, B, nA, nB) => {
        let pts = null;
        return {
          nom: `Médiatrice de ${seg(nA, nB)}`, texte: `Les points ${P}, ${Q}, ${Rn} sont sur le bord de l'assiette. Construis au compas la médiatrice de la corde ${seg(nA, nB)}.`,
          compas: () => { const r = mediatriceAuCompas(compas.arcs, A, B, nA, nB); if (typeof r === "string") return r; pts = r.pts; return true; },
          montrer: () => { pts = montrerMediatrice(compas, A, B); },
          dessin: () => dessinerDroite(s, pts[0], V.unitaire(V.moins(pts[1], pts[0])), "", CW, CH, "geo-trace")
        };
      };
      return atelier(s, [
        etapeMed(pP, pQ, P, Q),
        etapeMed(pQ, pR, Q, Rn),
        { nom: "Le centre", texte: `Clique sur le centre ${O} de l'assiette : il est sur les deux médiatrices.`, point: { cible: C, nom: O, tol: 10 },
          dessin: () => { dessinerPoint(s, C, O, { vers: { x: 0.8, y: 1 } }); dessinerTrait(s, C, pQ, "segment", "geo-trace"); dessinerCercle(s, C, R, "geo-cercle-fin"); } },
        { nom: "Le rayon", texte: `Sur le dessin, le rayon ${O}${Q} mesure ${cm(rDessin)}. Échelle : 1 cm sur le dessin représente ${echelle} cm dans la réalité.`,
          champ: "Rayon réel de l'assiette : [d] cm", reponse: Math.round(rDessin * echelle * 10) / 10,
          valider: x => Math.abs(x - rDessin * echelle) < 1e-6 || `Multiplie la mesure sur le dessin par ${echelle}.`,
          fin: `Bravo ! L'assiette a un rayon de ${cm(Math.round(rDessin * echelle * 10) / 10)}.` }
      ], { compas, consigne: "Un archéologue a retrouvé ce morceau d'une assiette ronde. Retrouve le centre de l'assiette, puis son rayon réel." });
    }
  }

];

/* Intersection des demi-droites d'origine P (direction a, en degrés) et Q (direction b) */
function intersectionDemiDroites(P, a, Q, b) {
  const u = dir(a), v = dir(b), det = u.x * (-v.y) - u.y * (-v.x);
  const t = ((Q.x - P.x) * (-v.y) - (Q.y - P.y) * (-v.x)) / det;
  return V.plus(P, V.fois(u, t));
}

/* ---------- Le test « Je me teste » : 12 questions, une par compétence de la grille ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Le vocabulaire du triangle", activites: ["sommets-cotes", "bon-symbole"] },
    { competence: "Lire un codage", activites: ["lire-codage", "phrase-figure"] },
    { competence: "Coder une figure à main levée", activites: ["coder-figure", "enonce-figure"] },
    { competence: "Construire avec trois longueurs", activites: ["quel-rayon", "longueur-perimetre"] },
    { competence: "Construire avec des angles", activites: ["main-levee-juste"] },
    { competence: "Reconnaître un triangle particulier", activites: ["nature-codage", "nature-longueurs"] },
    { competence: "Le triangle isocèle", activites: ["isocele-vocabulaire", "nature-angles"] },
    { competence: "Calculer le troisième angle", activites: ["troisieme-angle", "triangle-rectangle"] },
    { competence: "Angles d'un triangle isocèle", activites: ["isocele-sommet", "isocele-base"] },
    { competence: "Calculer sur une figure", activites: ["angle-figure", "existe"] },
    { competence: "Raisonner avec les angles", activites: ["calculer-avant", "points-alignes"] },
    { competence: "Le cercle circonscrit", activites: ["trouver-centre", "justifier-centre"] }
  ]
};
