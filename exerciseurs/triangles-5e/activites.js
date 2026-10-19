/* =====================================================================
   EXERCISEUR « TRIANGLES : DROITES REMARQUABLES ET AIRE » — 5e, chapitre 6

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Médiatrices et cercle circonscrit";
const F2 = "Feuille 2 — Les hauteurs";
const F3 = "Feuille 3 — Les médianes";
const F4 = "Feuille 4 — Aire d'un triangle";
const F5 = "Feuille 5 — Aires : figures composées et médiane";
const F6 = "Feuille 6 — Triangles particuliers";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const egal = (x, y) => Math.abs(x - y) < 1e-9;

/* ---------- Figures : triangle avec une droite remarquable ---------- */
const PX = 40;                                   // 1 unité = 40 px
function triangleHasard() {
  for (;;) {
    const A = { x: alea(10, 50) / 10, y: alea(30, 50) / 10 }, B = { x: 0, y: 0 }, C = { x: alea(55, 80) / 10, y: alea(-5, 5) / 10 };
    const ang = (P, Q, R) => { const u = V.moins(Q, P), v = V.moins(R, P); return Math.acos((u.x * v.x + u.y * v.y) / V.norme(u) / V.norme(v)) / DEG; };
    const a = [ang(A, B, C), ang(B, A, C), ang(C, A, B)];
    if (a.every(x => x > 30 && x < 85)) return { A, B, C };
  }
}
const proj = (P, Q, R) => { const u = V.moins(R, Q), t = ((P.x - Q.x) * u.x + (P.y - Q.y) * u.y) / (u.x * u.x + u.y * u.y); return V.plus(Q, V.fois(u, t)); };
function figureTriangle({ A, B, C }, trace) {
  const xs = [A.x, B.x, C.x], ys = [A.y, B.y, C.y], x0 = Math.min(...xs) - 1, y1 = Math.max(...ys) + 1;
  const L = (Math.max(...xs) + 1 - x0) * PX, H = (y1 - Math.min(...ys) + 1) * PX;
  const s = figureGeo(L, H, "Triangle");
  const P = p => ({ x: (p.x - x0) * PX, y: (y1 - p.y) * PX });
  s.append(svg("polygon", { points: [A, B, C].map(P).map(p => p.x + "," + p.y).join(" "), style: "fill: color-mix(in srgb, var(--cours) 10%, transparent); stroke: var(--cours); stroke-width: 2.5" }));
  [["A", A, { x: 0, y: -1 }], ["B", B, { x: -1, y: 0.4 }], ["C", C, { x: 1, y: 0.4 }]].forEach(([n, p, v]) => dessinerTexte(s, V.plus(P(p), V.fois(v, 16)), n, "geo-nom"));
  if (trace) {
    const [p, q] = trace.points.map(P);
    s.append(svg("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, style: "stroke: var(--video); stroke-width: 3" }));
    (trace.droit || []).forEach(([o, d1, d2]) => codageAngleDroit(s, P(o), V.moins(P(d1), P(o)), V.moins(P(d2), P(o))));
    (trace.egaux || []).forEach(([a, b]) => codageLongueur(s, P(a), P(b), 1));
    if (trace.nom) dessinerTexte(s, V.plus(P(trace.nom[0]), { x: -10, y: 16 }), trace.nom[1], "geo-nom");
  }
  return s;
}
/* Trace d'une droite remarquable issue de A / relative à [BC] */
function traceRemarquable(T, type) {
  const { A, B, C } = T, I = V.milieu(B, C), Hf = proj(A, B, C);
  if (type === "hauteur") return { points: [A, Hf], droit: [[Hf, A, C]] };
  if (type === "médiane") return { points: [A, I], egaux: [[B, I], [I, C]] };
  if (type === "médiatrice") { const u = V.unitaire(V.normal(V.moins(C, B))); return { points: [V.plus(I, V.fois(u, 2.6)), V.moins(I, V.fois(u, 0.6))], droit: [[I, V.plus(I, u), C]], egaux: [[B, I], [I, C]] }; }
  // « aucune » : une droite issue de A qui n'est ni hauteur ni médiane
  const D = V.plus(V.milieu(Hf, I), V.fois(V.unitaire(V.moins(C, B)), Math.abs(I.x - Hf.x) > 0.6 ? 0 : 1.2));
  return { points: [A, D] };
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "centre-cercle",
    titre: "Le cercle circonscrit",
    description: "Où est son centre ?",
    generer() {
      const [q, bonne, autres] = choisir([
        ["Le centre du cercle circonscrit à un triangle est le point d'intersection…", "des médiatrices des côtés", ["des hauteurs", "des médianes"]],
        ["Dans un triangle rectangle, le centre du cercle circonscrit est…", "le milieu de l'hypoténuse", ["le sommet de l'angle droit", "le centre de gravité"]],
        ["Le cercle circonscrit à un triangle ABC est le cercle…", "qui passe par A, B et C", ["qui est à l'intérieur du triangle", "dont le centre est A"]],
        ["Si O est le centre du cercle circonscrit à ABC, alors…", "OA = OB = OC", ["O est le milieu de [BC]", "O est sur le côté [AB]"]]
      ]);
      return {
        consigne: q,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Un point de la médiatrice d'un segment est à égale distance des extrémités du segment.",
        correction: `${q.replace("…", "")} ${bonne}.`
      };
    }
  },

  {
    groupe: F1,
    id: "rayon-rectangle",
    titre: "Rayon et triangle rectangle",
    description: "L'hypoténuse est un diamètre.",
    generer() {
      const h = alea(30, 150) / 10, sens = Math.random() < 0.5;
      return {
        consigne: sens ? `Un triangle rectangle a une hypoténuse de ${nb(h)} cm. Quel est le rayon de son cercle circonscrit ?` : `Le cercle circonscrit à un triangle rectangle a un rayon de ${nb(h / 2)} cm. Quelle est la longueur de l'hypoténuse ?`,
        ligne: "[d] cm",
        verifier: v => verifierNombre(v[0], sens ? rr(h / 2) : h),
        indice: "Le centre du cercle circonscrit est le milieu de l'hypoténuse : l'hypoténuse est un diamètre.",
        correction: sens ? `Rayon = ${nb(h)} ÷ 2 = ${nb(h / 2)} cm.` : `Hypoténuse = 2 × ${nb(h / 2)} = ${nb(h)} cm.`
      };
    }
  },

  /* ================= Feuilles 2 et 3 ================= */
  {
    groupe: F2,
    id: "quelle-droite",
    titre: "Quelle droite remarquable ?",
    description: "Hauteur, médiane, médiatrice… ou aucune ?",
    generer() {
      const T = triangleHasard(), type = choisir(["hauteur", "médiane", "médiatrice", "hauteur", "médiane", "aucune"]);
      const r = { hauteur: "la hauteur issue de A", "médiane": "la médiane issue de A", "médiatrice": "la médiatrice de [BC]", aucune: "aucune des trois" }[type];
      return {
        consigne: "La droite rouge est…",
        figure: figureTriangle(T, traceRemarquable(T, type)),
        choix: ["la hauteur issue de A", "la médiane issue de A", "la médiatrice de [BC]", "aucune des trois"],
        verifier: (v, c) => ({ etat: c === r ? "juste" : "faux" }),
        indice: "Regarde les codages : un angle droit ? des longueurs égales ? La droite passe-t-elle par A ?",
        correction: { hauteur: "Elle passe par A et elle est perpendiculaire à (BC) : c'est la hauteur issue de A.", "médiane": "Elle joint A au milieu de [BC] : c'est la médiane issue de A.", "médiatrice": "Elle est perpendiculaire à [BC] en son milieu : c'est la médiatrice de [BC].", aucune: "Elle passe par A, mais elle n'est ni perpendiculaire à (BC), ni dirigée vers le milieu de [BC]." }[type]
      };
    }
  },

  {
    groupe: F2,
    id: "definitions",
    titre: "Définitions",
    description: "Reconnaître une droite à sa description.",
    generer() {
      const [d, r] = choisir([
        ["Elle passe par un sommet et elle est perpendiculaire au côté opposé.", "une hauteur"],
        ["Elle passe par un sommet et par le milieu du côté opposé.", "une médiane"],
        ["Elle est perpendiculaire à un côté en son milieu.", "une médiatrice"],
        ["Ses points sont à égale distance des extrémités d'un côté.", "une médiatrice"],
        ["Les trois se coupent au centre de gravité.", "une médiane"],
        ["Dans un triangle obtus, elle peut être à l'extérieur du triangle.", "une hauteur"]
      ]);
      return {
        consigne: d + " C'est…",
        choix: ["une hauteur", "une médiane", "une médiatrice"],
        verifier: (v, c) => ({ etat: c === r ? "juste" : "faux" }),
        indice: "Hauteur : sommet + angle droit. Médiane : sommet + milieu. Médiatrice : milieu + angle droit.",
        correction: `C'est ${r}.`
      };
    }
  },

  {
    groupe: F3,
    id: "vrai-faux",
    titre: "Vrai ou faux ?",
    description: "Hauteurs, médianes, médiatrices.",
    generer() {
      const [t, v, e] = choisir([
        ["Une médiane passe toujours par un sommet.", true, "elle joint un sommet au milieu du côté opposé"],
        ["Une médiane est toujours perpendiculaire au côté opposé.", false, "seulement dans certains triangles (isocèle, par exemple)"],
        ["Une médiatrice passe toujours par un sommet.", false, "elle passe par le milieu d'un côté, pas forcément par un sommet"],
        ["Les trois hauteurs d'un triangle sont concourantes.", true, "elles se coupent en un même point"],
        ["Dans un triangle rectangle, les hauteurs se coupent au sommet de l'angle droit.", true, "deux côtés sont des hauteurs"],
        ["Le centre de gravité peut être à l'extérieur du triangle.", false, "il est toujours à l'intérieur"],
        ["Une médiane partage un triangle en deux triangles de même aire.", true, "même base et même hauteur"]
      ]);
      return {
        consigne: t,
        choix: ["Vrai", "Faux"],
        verifier: (x, c) => ({ etat: (c === "Vrai") === v ? "juste" : "faux" }),
        indice: "Pense à la définition de chaque droite.",
        correction: `${v ? "Vrai" : "Faux"} : ${e}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "aire",
    titre: "Calculer l'aire d'un triangle",
    description: "Base × hauteur ÷ 2",
    generer() {
      const b = alea(20, 120) / 10, h = alea(15, 90) / 10, u = choisir(["cm", "m", "mm", "dm"]);
      const rect = Math.random() < 0.3;
      return {
        consigne: rect ? `Un triangle rectangle a des côtés de l'angle droit de ${nb(b)} ${u} et ${nb(h)} ${u}. Quelle est son aire ?` : `Un triangle a une base de ${nb(b)} ${u} et une hauteur relative à cette base de ${nb(h)} ${u}. Quelle est son aire ?`,
        ligne: `[d] ${u}²`,
        verifier: v => verifierNombre(v[0], rr(b * h / 2)),
        indice: rect ? "Dans un triangle rectangle, un côté de l'angle droit est la hauteur relative à l'autre." : "Aire = base × hauteur ÷ 2.",
        correction: `${nb(b)} × ${nb(h)} ÷ 2 = ${nb(b * h / 2)} ${u}²`
      };
    }
  },

  {
    groupe: F4,
    id: "aire-figure",
    titre: "Aire sur une figure",
    description: "Choisir les bonnes longueurs.",
    generer() {
      const T = triangleHasard(), { A, B, C } = T, Hf = proj(A, B, C);
      const fig = figureTriangle(T, { points: [A, Hf], droit: [[Hf, A, C]], nom: [Hf, "H"] });
      const bc = rr(Math.round(V.norme(V.moins(C, B)) * 10) / 10), h = rr(Math.round(V.norme(V.moins(A, Hf)) * 10) / 10), ab = rr(Math.round(V.norme(V.moins(A, B)) * 10) / 10);
      return {
        consigne: `On donne BC = ${nb(bc)} cm, AB = ${nb(ab)} cm et la hauteur rouge [AH] mesure ${nb(h)} cm. Calcule l'aire du triangle ABC.`,
        figure: fig,
        ligne: "[d] cm²",
        verifier: v => verifierNombre(v[0], rr(bc * h / 2)),
        indice: "La hauteur [AH] est relative au côté [BC]. La longueur AB ne sert pas.",
        correction: `${nb(bc)} × ${nb(h)} ÷ 2 = ${nb(bc * h / 2)} cm²`
      };
    }
  },

  {
    groupe: F4,
    id: "hauteur-depuis-aire",
    titre: "Retrouver une hauteur ou une base",
    description: "L'aire est connue.",
    generer() {
      const b = alea(4, 16), h = alea(3, 12), aire = b * h / 2, trouverH = Math.random() < 0.5;
      return {
        consigne: trouverH ? `Un triangle a une aire de ${nb(aire)} cm² et une base de ${b} cm. Quelle est la hauteur relative à cette base ?` : `Un triangle a une aire de ${nb(aire)} cm² et une hauteur de ${h} cm. Quelle est la base relative à cette hauteur ?`,
        ligne: "[d] cm",
        verifier: v => verifierNombre(v[0], trouverH ? h : b),
        indice: "Base × hauteur = 2 × aire.",
        correction: trouverH ? `${nb(aire)} × 2 ÷ ${b} = ${h} cm` : `${nb(aire)} × 2 ÷ ${h} = ${b} cm`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "aire-composee",
    titre: "Figures composées",
    description: "Rectangle et triangle.",
    generer() {
      const l = alea(4, 12), L = alea(3, 8), h = alea(2, 6);
      const plus = Math.random() < 0.6;
      const r = plus ? l * L + l * h / 2 : l * L - l * h / 2;
      if (r <= 0 || (!plus && h >= L)) return this.generer();
      return {
        consigne: plus ? `Une façade de maison est formée d'un rectangle de ${l} m sur ${L} m, surmonté d'un toit triangulaire de base ${l} m et de hauteur ${h} m. Quelle est l'aire de la façade ?`
          : `Dans un rectangle de ${l} cm sur ${L} cm, on découpe un triangle de base ${l} cm (un côté du rectangle) et de hauteur ${h} cm. Quelle est l'aire restante ?`,
        ligne: plus ? "[d] m²" : "[d] cm²",
        verifier: v => verifierNombre(v[0], r),
        indice: "Calcule séparément l'aire du rectangle et celle du triangle.",
        correction: `${l} × ${L} ${plus ? "+" : "−"} ${l} × ${h} ÷ 2 = ${l * L} ${plus ? "+" : "−"} ${nb(l * h / 2)} = ${nb(r)}`
      };
    }
  },

  {
    groupe: F5,
    id: "mediane-aire",
    titre: "Médiane et aire",
    description: "Deux triangles de même aire.",
    generer() {
      const a = alea(10, 80) * choisir([1, 0.5]), quart = Math.random() < 0.3;
      return {
        consigne: quart ? `Un triangle d'aire ${nb(a)} cm² est partagé par une médiane, puis chaque moitié est de nouveau partagée par une médiane. Quelle est l'aire de chaque petit triangle obtenu ?`
          : `La médiane [AI] partage le triangle ABC, d'aire ${nb(a)} cm², en deux triangles. Quelle est l'aire du triangle ABI ?`,
        ligne: "[d] cm²",
        verifier: v => verifierNombre(v[0], rr(quart ? a / 4 : a / 2)),
        indice: "Une médiane partage un triangle en deux triangles de même aire.",
        correction: quart ? `${nb(a)} ÷ 4 = ${nb(a / 4)} cm²` : `${nb(a)} ÷ 2 = ${nb(a / 2)} cm²`
      };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "particuliers",
    titre: "Triangles particuliers",
    description: "Isocèle, équilatéral, rectangle.",
    generer() {
      const [q, bonne, autres] = choisir([
        ["Dans un triangle isocèle en A, la médiane issue de A est aussi…", "la hauteur issue de A", ["la médiatrice de [AB]", "parallèle à (BC)"]],
        ["Dans un triangle équilatéral, le centre du cercle circonscrit est…", "aussi le centre de gravité", ["un sommet du triangle", "à l'extérieur du triangle"]],
        ["Dans un triangle rectangle en A, la hauteur issue de B est…", "la droite (AB)", ["la droite (BC)", "la médiane issue de B"]],
        ["Un triangle isocèle a combien d'axes de symétrie (s'il n'est pas équilatéral) ?", "un seul", ["trois", "aucun"]],
        ["Dans un triangle isocèle en A, la médiatrice de [BC] passe par…", "le sommet A", ["le milieu de [AB]", "le point B"]]
      ]);
      return {
        consigne: q,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Dans un triangle isocèle, l'axe de symétrie est à la fois médiane, hauteur, médiatrice et bissectrice.",
        correction: `${q.replace("…", "")} ${bonne}.`
      };
    }
  }
];

/* ---------- Le test « Je me teste » : 10 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "10 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Le cercle circonscrit", activites: ["centre-cercle"] },
    { competence: "Triangle rectangle et cercle circonscrit", activites: ["rayon-rectangle"] },
    { competence: "Reconnaître une droite remarquable", activites: ["quelle-droite"] },
    { competence: "Définitions des droites remarquables", activites: ["definitions", "vrai-faux"] },
    { competence: "Calculer l'aire d'un triangle", activites: ["aire"] },
    { competence: "Choisir la bonne hauteur", activites: ["aire-figure"] },
    { competence: "Retrouver une hauteur ou une base", activites: ["hauteur-depuis-aire"] },
    { competence: "Aire d'une figure composée", activites: ["aire-composee"] },
    { competence: "Médiane et aire", activites: ["mediane-aire"] },
    { competence: "Triangles particuliers", activites: ["particuliers"] }
  ]
};
