/* Outils de dessin pour les exerciseurs de géométrie — pas besoin de modifier ce fichier.
   Les figures sont en SVG ; un point est un objet { x, y }. */

const LETTRES_POINTS = "ABCDEFGHKLMNPRSTUV".split("");

function tirerLettres(n) { return melanger([...LETTRES_POINTS]).slice(0, n); }
function arrondir1(x) { return Math.round(x * 10) / 10; }

/* ---------- Vecteurs ---------- */
const V = {
  plus: (p, q) => ({ x: p.x + q.x, y: p.y + q.y }),
  moins: (p, q) => ({ x: p.x - q.x, y: p.y - q.y }),
  fois: (p, k) => ({ x: p.x * k, y: p.y * k }),
  norme: p => Math.hypot(p.x, p.y),
  unitaire: p => V.fois(p, 1 / V.norme(p)),
  normal: p => ({ x: -p.y, y: p.x }),
  angle: a => ({ x: Math.cos(a), y: Math.sin(a) }),
  milieu: (p, q) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }),
  tourner: (p, c, a) => {
    const dx = p.x - c.x, dy = p.y - c.y;
    return { x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a) };
  }
};
const DEG = Math.PI / 180;

/* ---------- Figure ---------- */
function figureGeo(largeur, hauteur, etiquette = "Figure") {
  return svg("svg", { viewBox: `0 0 ${largeur} ${hauteur}`, width: largeur, height: hauteur,
    class: "geo", role: "img", "aria-label": etiquette });
}

/* Un point : une croix et son nom, placé du côté indiqué par « vers » (un vecteur). */
function dessinerPoint(s, p, nom, { vers = { x: 0, y: -1 }, classe = "" } = {}) {
  const t = 5, u = V.unitaire(vers);
  const g = svg("g", { class: "geo-point " + classe },
    svg("line", { x1: p.x - t, y1: p.y - t, x2: p.x + t, y2: p.y + t }),
    svg("line", { x1: p.x - t, y1: p.y + t, x2: p.x + t, y2: p.y - t }));
  if (nom) {
    g.append(svg("text", { x: p.x + u.x * 17, y: p.y + u.y * 17 + 6 }, nom));
  }
  s.append(g);
  return g;
}

/* Un segment, une demi-droite (d'origine p) ou une droite passant par p et q. */
function dessinerTrait(s, p, q, type = "segment", classe = "geo-trait") {
  const u = V.unitaire(V.moins(q, p)), loin = 3000;
  const debut = type === "droite" ? V.moins(p, V.fois(u, loin)) : p;
  const fin = type === "segment" ? q : V.plus(p, V.fois(u, loin));
  const l = svg("line", { x1: debut.x, y1: debut.y, x2: fin.x, y2: fin.y, class: classe });
  s.append(l);
  return l;
}

function dessinerTexte(s, p, texte, classe = "") {
  const t = svg("text", { x: p.x, y: p.y + 6, class: classe }, texte);
  s.append(t);
  return t;
}

/* Codage de l'angle droit au point o, entre les directions u et v. */
function codageAngleDroit(s, o, u, v, taille = 11) {
  u = V.fois(V.unitaire(u), taille); v = V.fois(V.unitaire(v), taille);
  const a = V.plus(o, u), b = V.plus(V.plus(o, u), v), c = V.plus(o, v);
  s.append(svg("path", { d: `M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y}`, class: "geo-codage" }));
}

/* Codage des longueurs égales : n petits traits au milieu du segment [pq]. */
function codageLongueur(s, p, q, n = 1) {
  const m = V.milieu(p, q), u = V.unitaire(V.moins(q, p)), w = V.normal(u);
  for (let i = 0; i < n; i++) {
    const c = V.plus(m, V.fois(u, (i - (n - 1) / 2) * 5));
    const a = V.plus(c, V.plus(V.fois(w, 7), V.fois(u, 2.5))), b = V.moins(c, V.plus(V.fois(w, 7), V.fois(u, 2.5)));
    s.append(svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: "geo-codage" }));
  }
}

/* ---------- Quadrillage ----------
   colonnes × lignes carreaux de « pas » pixels. Les nœuds sont repérés par (i, j),
   i de 0 à colonnes (vers la droite) et j de 0 à lignes (vers le bas). */
function quadrillage(colonnes, lignes, pas = 32, marge = 14) {
  const s = figureGeo(colonnes * pas + 2 * marge, lignes * pas + 2 * marge, "Quadrillage");
  const P = (i, j) => ({ x: marge + i * pas, y: marge + j * pas });
  const fond = svg("g", { class: "quad" });
  for (let i = 0; i <= colonnes; i++) fond.append(svg("line", { x1: P(i, 0).x, y1: P(i, 0).y, x2: P(i, lignes).x, y2: P(i, lignes).y }));
  for (let j = 0; j <= lignes; j++) fond.append(svg("line", { x1: P(0, j).x, y1: P(0, j).y, x2: P(colonnes, j).x, y2: P(colonnes, j).y }));
  s.append(fond);
  /* Coordonnées (en carreaux, non arrondies) d'un clic ou d'un toucher. */
  const position = e => {
    const p = s.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(s.getScreenCTM().inverse());
    return { i: (q.x - marge) / pas, j: (q.y - marge) / pas };
  };
  return { svg: s, P, pas, colonnes, lignes, position, fond };
}

/* Paramètre t du point O + t·u où la droite sort du cadre (avec une marge). */
function tSortie(O, u, largeur, hauteur, marge = 24) {
  let t = Infinity;
  if (u.x > 1e-9) t = Math.min(t, (largeur - marge - O.x) / u.x);
  if (u.x < -1e-9) t = Math.min(t, (marge - O.x) / u.x);
  if (u.y > 1e-9) t = Math.min(t, (hauteur - marge - O.y) / u.y);
  if (u.y < -1e-9) t = Math.min(t, (marge - O.y) / u.y);
  return t;
}

/* Trace la droite passant par O de direction u, et écrit son nom près du bord du cadre. */
function dessinerDroite(s, O, u, nom, largeur, hauteur, classe = "geo-trait") {
  dessinerTrait(s, O, V.plus(O, u), "droite", classe);
  if (nom) {
    const p = V.plus(O, V.fois(u, tSortie(O, u, largeur, hauteur, 30)));
    dessinerTexte(s, V.plus(p, V.fois(V.normal(u), 15)), nom, "geo-nom");
  }
}

/* ---------- Instruments : règle graduée et équerre ----------
   CM pixels par centimètre. Un instrument est un groupe SVG qu'on fait glisser et
   tourner (poignée ↻) ; il s'aimante près des positions utiles (points et directions). */
const CM = 42;

function instrument(classe, dessin, poigneeX, poigneeY) {
  const g = svg("g", { class: "instrument " + classe });
  dessin(g);
  const poignee = svg("g", { class: "outil-poignee" },
    svg("circle", { cx: poigneeX, cy: poigneeY, r: 13 }),
    svg("text", { x: poigneeX, y: poigneeY + 5 }, "↻"));
  g.append(poignee);
  g.pos = { x: 0, y: 0, rot: 0 };
  g.placer = (x, y, rot) => {
    g.pos = { x, y, rot: ((rot % 360) + 360) % 360 };
    g.setAttribute("transform", `translate(${x},${y}) rotate(${g.pos.rot})`);
  };
  return g;
}

/* Règle : le zéro est à l'origine, sur le bord du haut ; graduations en millimètres */
function creerRegle(longueurCm = 11) {
  const L = longueurCm * CM;
  return instrument("regle", g => {
    g.append(svg("rect", { x: -14, y: 0, width: L + 28, height: 40, rx: 4, class: "regle-corps" }));
    for (let mm = 0; mm <= longueurCm * 10; mm++) {
      const x = mm * CM / 10, l = mm % 10 === 0 ? 14 : mm % 5 === 0 ? 9 : 5;
      g.append(svg("line", { x1: x, y1: 0, x2: x, y2: l, class: "regle-grad" }));
      if (mm % 10 === 0) g.append(svg("text", { x, y: 27, class: "regle-num" }, String(mm / 10)));
    }
    g.append(svg("text", { x: L + 4, y: 36, class: "regle-cm" }, "cm"));
  }, L + 34, 20);
}

/* Équerre : le sommet de l'angle droit est à l'origine ; un côté vers la droite, l'autre vers le haut */
function creerEquerre() {
  const a = 6.5 * CM, b = 4.5 * CM;
  return instrument("equerre", g => {
    g.append(svg("path", { d: `M0,0 L${a},0 L0,${-b} Z M18,-18 L${a - 60},-18 L18,${-b + 42} Z`, class: "equerre-corps", "fill-rule": "evenodd" }),
      svg("path", { d: "M0,-14 L14,-14 L14,0", class: "equerre-coin" }));
  }, a + 22, -4);
}

/* Rend un instrument mobile. aimants : { points: [{x, y}], angles: [rotations en degrés] } */
function rendreMobile(s, outil, aimants) {
  let mode = null, depart = null, actif = true;
  const coord = e => { const p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(s.getScreenCTM().inverse()); };
  const ecart = (a, b) => Math.abs(((a - b) % 360 + 540) % 360 - 180);
  outil.addEventListener("pointerdown", e => {
    if (!actif) return;
    e.preventDefault(); e.stopPropagation();
    mode = e.target.closest(".outil-poignee") ? "tourner" : "glisser";
    const p = coord(e);
    depart = { px: p.x, py: p.y, ...outil.pos };
    s.setPointerCapture?.(e.pointerId);
    s.append(outil); // l'instrument manipulé passe au premier plan
  });
  s.addEventListener("pointermove", e => {
    if (!mode) return;
    const p = coord(e);
    if (mode === "glisser") {
      let x = depart.x + p.x - depart.px, y = depart.y + p.y - depart.py;
      for (const q of aimants.points) if (Math.hypot(x - q.x, y - q.y) < 14) { x = q.x; y = q.y; }
      outil.placer(x, y, outil.pos.rot);
    } else {
      let rot = Math.atan2(p.y - outil.pos.y, p.x - outil.pos.x) / DEG;
      for (const r of aimants.angles) if (ecart(rot, r) < 4) rot = r;
      outil.placer(outil.pos.x, outil.pos.y, rot);
    }
  });
  const fin = () => { mode = null; };
  s.addEventListener("pointerup", fin);
  s.addEventListener("pointercancel", fin);
  return {
    bloquer: () => { actif = false; },
    /* Vrai si l'instrument est sur un des points, orienté selon un des angles */
    surPoint: (q, angles = aimants.angles) => Math.hypot(outil.pos.x - q.x, outil.pos.y - q.y) < 1 && angles.some(r => ecart(outil.pos.rot, r) < 0.5)
  };
}
