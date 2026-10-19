/* =====================================================================
   EXERCISEUR « ANGLES ET PARALLÉLISME » — 5e, chapitre 4

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Angles particuliers";
const F2 = "Feuille 2 — Alternes-internes et correspondants";
const F3 = "Feuille 3 — Angles et droites parallèles";
const F4 = "Feuille 4 — La somme des angles d'un triangle";
const F5 = "Feuille 5 — Construire des triangles";
const F6 = "Feuille 6 — Démontrer avec les angles";

const nb = x => ecrireNombre(Math.round(x * 1e6) / 1e6);
const deg = x => nb(x) + "°";
const STYLE_ARC = "fill: color-mix(in srgb, var(--exercices) 55%, transparent); stroke: none";
const STYLE_TRAIT = "stroke: var(--cours); stroke-width: 2.5; fill: none";
const STYLE_TEXTE = "font-size: 15px; font-weight: 700; fill: var(--texte); text-anchor: middle";

/* Figure : deux droites (parallèles ou non) coupées par une sécante.
   Secteurs numérotés : en P (droite du bas) 1 haut-droite, 2 haut-gauche, 3 bas-gauche, 4 bas-droite ;
   en Q (droite du haut) 5, 6, 7, 8 dans le même ordre. marques : liste de numéros à colorier. */
function figureSecante({ theta = 60, pente = 0, numeros = true, marques = [], etiquettes = {} } = {}) {
  const L = 360, H = 230, s = svg("svg", { viewBox: `0 0 ${L} ${H}`, width: L, height: H, role: "img", "aria-label": "Deux droites coupées par une sécante" });
  const Y = y => H - y;                                   // repère mathématique → SVG
  const t = theta * Math.PI / 180, p = pente * Math.PI / 180;
  const P = { x: 140, y: 50 };
  // Q : intersection de la sécante et de la droite du haut (passant par (0, 160) avec la pente p)
  const k = (160 + Math.tan(p) * P.x - P.y) / (Math.sin(t) - Math.tan(p) * Math.cos(t));
  const Q = { x: P.x + k * Math.cos(t), y: P.y + k * Math.sin(t) };
  const ligne = (a, b) => s.append(svg("line", { x1: a.x, y1: Y(a.y), x2: b.x, y2: Y(b.y), style: STYLE_TRAIT }));
  const secteur = (C, a1, a2, r) => {
    const A = { x: C.x + r * Math.cos(a1), y: C.y + r * Math.sin(a1) }, B = { x: C.x + r * Math.cos(a2), y: C.y + r * Math.sin(a2) };
    s.append(svg("path", { d: `M${C.x},${Y(C.y)} L${A.x},${Y(A.y)} A${r},${r} 0 0 0 ${B.x},${Y(B.y)} Z`, style: STYLE_ARC }));
  };
  // secteurs : bornes des angles en P et en Q
  const bornes = C => {
    const d = C === P ? 0 : p;                            // direction de la droite
    return [[d, t], [t, d + Math.PI], [d + Math.PI, t + Math.PI], [t + Math.PI, d + 2 * Math.PI]];
  };
  marques.forEach(n => { const C = n <= 4 ? P : Q, [a1, a2] = bornes(C)[(n - 1) % 4]; secteur(C, a1, a2, 30); });
  ligne({ x: 10, y: 50 }, { x: L - 10, y: 50 });
  ligne({ x: 10, y: 160 + Math.tan(p) * 10 }, { x: L - 10, y: 160 + Math.tan(p) * (L - 10) });
  ligne({ x: P.x - 70 * Math.cos(t), y: P.y - 70 * Math.sin(t) }, { x: Q.x + 60 * Math.cos(t), y: Q.y + 60 * Math.sin(t) });
  if (numeros) [P, Q].forEach((C, j) => bornes(C).forEach(([a1, a2], i) => {
    const m = (a1 + a2) / 2;
    s.append(svg("text", { x: C.x + 42 * Math.cos(m), y: Y(C.y + 42 * Math.sin(m)) + 5, style: STYLE_TEXTE }, String(4 * j + i + 1)));
  }));
  for (const [n, txt] of Object.entries(etiquettes)) {
    const C = n <= 4 ? P : Q, [a1, a2] = bornes(C)[(n - 1) % 4], m = (a1 + a2) / 2;
    s.append(svg("text", { x: C.x + 50 * Math.cos(m), y: Y(C.y + 50 * Math.sin(m)) + 5, style: STYLE_TEXTE }, txt));
  }
  s.append(svg("text", { x: L - 20, y: Y(50) - 8, style: STYLE_TEXTE }, "(d)"));
  s.append(svg("text", { x: L - 20, y: Y(160 + Math.tan(p) * (L - 20)) - 8, style: STYLE_TEXTE }, "(d′)"));
  return s;
}
/* Relation entre deux secteurs (numéros 1 à 8) */
function relation(a, b) {
  [a, b] = [Math.min(a, b), Math.max(a, b)];
  const AI = [[1, 7], [2, 8]], C = [[1, 5], [2, 6], [3, 7], [4, 8]], O = [[1, 3], [2, 4], [5, 7], [6, 8]];
  const dans = l => l.some(([x, y]) => x === a && y === b);
  return dans(AI) ? "alternes-internes" : dans(C) ? "correspondants" : dans(O) ? "opposés par le sommet" : "aucun des trois";
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "complementaire",
    titre: "Complémentaire et supplémentaire",
    description: "90° ou 180° ?",
    generer() {
      const comp = Math.random() < 0.5, a = comp ? choisir([alea(5, 85), alea(10, 170) / 2]) : choisir([alea(5, 175), alea(10, 350) / 2]);
      if ((comp && a >= 90) || a >= 180) return this.generer();
      const r = (comp ? 90 : 180) - a;
      return {
        consigne: `Quelle est la mesure du ${comp ? "complémentaire" : "supplémentaire"} d'un angle de ${deg(a)} ?`,
        ligne: "[d] °",
        verifier: v => verifierNombre(v[0], r),
        indice: comp ? "Deux angles complémentaires ont une somme de 90°." : "Deux angles supplémentaires ont une somme de 180°.",
        correction: `${comp ? 90 : 180}° − ${deg(a)} = ${deg(r)}`
      };
    }
  },

  {
    groupe: F1,
    id: "secantes",
    titre: "Deux droites sécantes",
    description: "Opposés par le sommet et supplémentaires.",
    generer() {
      const a = alea(20, 160), oppose = Math.random() < 0.5;
      return {
        consigne: `Deux droites sécantes forment un angle de ${a}°. Quelle est la mesure de l'angle ${oppose ? "opposé par le sommet" : "adjacent qui lui est supplémentaire"} ?`,
        ligne: "[n] °",
        verifier: v => verifierNombre(v[0], oppose ? a : 180 - a),
        indice: "Deux angles opposés par le sommet ont la même mesure ; deux angles adjacents formés par deux droites sécantes sont supplémentaires.",
        correction: oppose ? `Il mesure aussi ${a}°.` : `180° − ${a}° = ${180 - a}°`
      };
    }
  },

  {
    groupe: F1,
    id: "angle-plat",
    titre: "Dans un angle plat",
    description: "Trois angles qui forment 180°.",
    generer() {
      const a = alea(20, 80), b = alea(20, 80), droit = Math.random() < 0.3;
      const tot = droit ? 90 : 180, b2 = droit ? alea(10, 80 - Math.min(a, 70)) : b, a2 = droit ? Math.min(a, 70) : a;
      const x = tot - a2 - (droit ? 0 : b2);
      if (x <= 0) return this.generer();
      return {
        consigne: droit ? `Un angle droit est partagé en deux angles. L'un mesure ${a2}°. Combien mesure l'autre ?` : `Trois angles adjacents forment un angle plat. Deux d'entre eux mesurent ${a2}° et ${b2}°. Combien mesure le troisième ?`,
        ligne: "[n] °",
        verifier: v => verifierNombre(v[0], x),
        indice: droit ? "Un angle droit mesure 90°." : "Un angle plat mesure 180°.",
        correction: droit ? `90° − ${a2}° = ${x}°` : `180° − ${a2}° − ${b2}° = ${x}°`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "reconnaitre-paire",
    titre: "Reconnaître une paire d'angles",
    description: "Alternes-internes, correspondants… ?",
    generer() {
      const paires = [[1, 7], [2, 8], [1, 5], [2, 6], [3, 7], [4, 8], [1, 3], [5, 7], [1, 6], [2, 7], [3, 5], [4, 6]];
      const [a, b] = choisir(paires);
      const r = relation(a, b);
      const choix = ["alternes-internes", "correspondants", "opposés par le sommet", "aucun des trois"];
      return {
        consigne: "Les deux angles coloriés sont…",
        figure: figureSecante({ theta: alea(50, 70), pente: choisir([0, 0, 5, -5]), numeros: false, marques: [a, b] }),
        choix,
        verifier: (v, c) => ({ etat: c === r ? "juste" : "faux" }),
        indice: "Alternes-internes : entre les deux droites, de part et d'autre de la sécante. Correspondants : du même côté de la sécante, « à la même place ».",
        correction: `Ces angles sont ${r === "aucun des trois" ? "dans aucune de ces situations" : r}.`
      };
    }
  },

  {
    groupe: F2,
    id: "trouver-numero",
    titre: "Quel est l'angle… ?",
    description: "Trouver l'angle correspondant ou alterne-interne.",
    generer() {
      const type = choisir(["alterne-interne", "correspondant"]);
      const n = type === "alterne-interne" ? choisir([1, 2, 7, 8]) : alea(1, 8);
      const r = type === "alterne-interne" ? { 1: 7, 7: 1, 2: 8, 8: 2 }[n] : (n <= 4 ? n + 4 : n - 4);
      return {
        consigne: `Quel angle est ${type} ${type === "alterne-interne" ? "avec" : "à"} l'angle ${n} ?`,
        figure: figureSecante({ theta: alea(50, 70), pente: choisir([0, 6, -6]), marques: [n] }),
        ligne: "angle n° [n]",
        verifier: v => verifierNombre(v[0], r),
        indice: type === "alterne-interne" ? "Il est aussi entre les deux droites, mais de l'autre côté de la sécante." : "Il est du même côté de la sécante, à la même place sur l'autre droite.",
        correction: `C'est l'angle ${r}.`
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "calcul-paralleles",
    titre: "Calculer avec des parallèles",
    description: "Les huit angles à partir d'un seul.",
    generer() {
      const theta = alea(35, 80), n = alea(1, 8), cible = choisir([...Array(8).keys()].map(k => k + 1).filter(k => k !== n));
      const mesure = k => [1, 3, 5, 7].includes(k) ? theta : 180 - theta;
      return {
        consigne: `Les droites (d) et (d′) sont parallèles. L'angle ${n} mesure ${mesure(n)}°. Combien mesure l'angle ${cible} ?`,
        figure: figureSecante({ theta, marques: [n] }),
        ligne: "[n] °",
        verifier: v => verifierNombre(v[0], mesure(cible)),
        indice: "Utilise les angles opposés par le sommet, supplémentaires, alternes-internes et correspondants.",
        correction: `Les angles 1, 3, 5, 7 mesurent ${theta}° et les angles 2, 4, 6, 8 mesurent ${180 - theta}° : l'angle ${cible} mesure ${mesure(cible)}°.`
      };
    }
  },

  {
    groupe: F3,
    id: "paralleles-ou-pas",
    titre: "Parallèles ou pas ?",
    description: "Comparer des angles alternes-internes ou correspondants.",
    generer() {
      const [a, b] = choisir([[1, 7], [2, 8], [1, 5], [3, 7], [4, 8], [2, 6]]);
      const theta = alea(45, 75), para = Math.random() < 0.5, d = para ? 0 : choisir([-6, -5, -4, 4, 5, 6]);
      const va = [1, 3].includes(a) ? theta : 180 - theta;
      const vb = para ? ([5, 7].includes(b) ? theta : 180 - theta) : ([5, 7].includes(b) ? theta - d : 180 - theta + d);
      const r = relation(a, b);
      return {
        consigne: `Les angles coloriés mesurent ${va}° et ${vb}°. Les droites (d) et (d′) sont-elles parallèles ?`,
        figure: figureSecante({ theta, pente: d, numeros: false, marques: [a, b], etiquettes: { [a]: va + "°", [b]: vb + "°" } }),
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === para ? "juste" : "faux" }),
        indice: `Ces angles sont ${r}. Ont-ils la même mesure ?`,
        correction: para ? `Les angles ${r} ont la même mesure : les droites sont parallèles.` : `Les angles ${r} n'ont pas la même mesure : les droites ne sont pas parallèles (sinon ils seraient égaux).`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "troisieme-angle",
    titre: "Le troisième angle",
    description: "La somme des angles vaut 180°.",
    generer() {
      const a = alea(20, 120), b = alea(15, 160 - a), c = 180 - a - b;
      return {
        consigne: `Dans le triangle ABC, l'angle Â mesure ${a}° et l'angle B̂ mesure ${b}°. Combien mesure l'angle Ĉ ?`,
        ligne: "Ĉ = [n] °",
        verifier: v => verifierNombre(v[0], c),
        indice: "La somme des angles d'un triangle est 180°.",
        correction: `180° − ${a}° − ${b}° = ${c}°`
      };
    }
  },

  {
    groupe: F4,
    id: "triangles-particuliers",
    titre: "Triangles particuliers",
    description: "Isocèle, équilatéral, rectangle.",
    generer() {
      const [q, r, c] = choisir([
        (() => { const a = 2 * alea(10, 70); return [`ABC est isocèle en A et l'angle au sommet Â mesure ${a}°. Combien mesure l'angle B̂ ?`, (180 - a) / 2, `(180° − ${a}°) ÷ 2 = ${(180 - a) / 2}°`]; })(),
        (() => { const b = alea(20, 80); return [`ABC est isocèle en A et l'angle B̂ mesure ${b}°. Combien mesure l'angle Â ?`, 180 - 2 * b, `180° − 2 × ${b}° = ${180 - 2 * b}°`]; })(),
        (() => { const b = alea(10, 80); return [`ABC est rectangle en A et l'angle B̂ mesure ${b}°. Combien mesure l'angle Ĉ ?`, 90 - b, `90° − ${b}° = ${90 - b}° (les angles aigus sont complémentaires)`]; })(),
        [`ABC est équilatéral. Combien mesure chaque angle ?`, 60, "180° ÷ 3 = 60°"],
        [`ABC est rectangle et isocèle en A. Combien mesure l'angle B̂ ?`, 45, "90° ÷ 2 = 45°"]
      ]);
      return {
        consigne: q,
        ligne: "[d] °",
        verifier: v => verifierNombre(v[0], r),
        indice: "Dans un triangle isocèle, les deux angles à la base ont la même mesure. La somme des angles vaut 180°.",
        correction: c
      };
    }
  },

  {
    groupe: F4,
    id: "existe-triangle",
    titre: "Ce triangle existe-t-il ?",
    description: "Des angles possibles ou pas.",
    generer() {
      const a = alea(20, 100), b = alea(20, 100), ok = Math.random() < 0.5, c = ok ? 180 - a - b : 180 - a - b + choisir([-10, 10, 20]);
      if (c <= 0) return this.generer();
      const oui = a + b + c === 180;
      return {
        consigne: `Existe-t-il un triangle dont les angles mesurent ${a}°, ${b}° et ${c}° ?`,
        choix: ["Oui", "Non"],
        verifier: (v, x) => ({ etat: (x === "Oui") === oui ? "juste" : "faux" }),
        indice: "Calcule la somme des trois angles.",
        correction: `${a}° + ${b}° + ${c}° = ${a + b + c}° : ${oui ? "oui, la somme vaut 180°" : "non, la somme devrait valoir 180°"}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "inegalite",
    titre: "L'inégalité triangulaire",
    description: "Peut-on construire ce triangle ?",
    generer() {
      const a = alea(2, 9), b = alea(2, 9), type = choisir(["oui", "non", "plat"]);
      const c = type === "oui" ? alea(Math.abs(a - b) + 1, a + b - 1) : type === "plat" ? a + b : a + b + alea(1, 4);
      if (c <= 0) return this.generer();
      const l = melanger([a, b, c]), m = Math.max(...l), autres = [...l]; autres.splice(autres.indexOf(m), 1);
      const s = autres[0] + autres[1];
      const rep = s > m ? "Oui" : s === m ? "Non, les points sont alignés" : "Non";
      return {
        consigne: `Peut-on construire un triangle dont les côtés mesurent ${l.join(" cm, ")} cm ?`,
        choix: ["Oui", "Non", "Non, les points sont alignés"],
        verifier: (v, x) => ({ etat: x === rep ? "juste" : "faux" }),
        indice: "Compare la plus grande longueur à la somme des deux autres.",
        correction: `${autres[0]} + ${autres[1]} = ${s} ${s > m ? ">" : s === m ? "=" : "<"} ${m} : ${s > m ? "le triangle est constructible" : s === m ? "le triangle est « aplati », les trois points sont alignés" : "le triangle n'est pas constructible"}.`
      };
    }
  },

  {
    groupe: F5,
    id: "troisieme-cote",
    titre: "La longueur du troisième côté",
    description: "Encadrer avec l'inégalité triangulaire.",
    generer() {
      const a = alea(2, 8), b = alea(a + 1, 12);
      const props = melanger([b - a - alea(0, 1), b + a + alea(0, 2), alea(b - a + 1, b + a - 1)]);
      const bonne = props.find(x => x > b - a && x < a + b);
      if (props.filter(x => x > b - a && x < a + b).length !== 1 || props.some(x => x <= 0)) return this.generer();
      return {
        consigne: `Un triangle a deux côtés de ${a} cm et ${b} cm. Quelle peut être la longueur du troisième côté ?`,
        choix: props.map(x => x + " cm"),
        verifier: (v, c) => ({ etat: c === bonne + " cm" ? "juste" : "faux" }),
        indice: `Le troisième côté doit être plus petit que ${a} + ${b} et plus grand que ${b} − ${a}.`,
        correction: `Il doit être compris entre ${b - a} cm et ${a + b} cm (exclus) : ${bonne} cm convient.`
      };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "justifier",
    titre: "Quelle propriété ?",
    description: "Choisir la bonne justification.",
    generer() {
      const [q, bonne, autres] = choisir([
        ["(d) // (d′) et une sécante forme deux angles alternes-internes. Pourquoi ont-ils la même mesure ?", "Si deux droites parallèles sont coupées par une sécante, les angles alternes-internes ont la même mesure.", ["Si deux angles ont la même mesure, les droites sont parallèles.", "Car on les a mesurés au rapporteur."]],
        ["Deux angles correspondants mesurent 64° et 64°. Pourquoi (d) // (d′) ?", "Si deux droites coupées par une sécante forment des angles correspondants de même mesure, elles sont parallèles.", ["Si deux droites sont parallèles, les angles correspondants ont la même mesure.", "Car deux angles de 64° sont supplémentaires."]],
        ["Dans ABC, Â = 50° et B̂ = 60°. Pourquoi Ĉ = 70° ?", "Car la somme des angles d'un triangle est égale à 180°.", ["Car les angles d'un triangle sont égaux.", "Car Ĉ = Â + 20°."]],
        ["ABC est rectangle en A. Pourquoi B̂ + Ĉ = 90° ?", "Car la somme des angles vaut 180° et Â = 90°.", ["Car B̂ et Ĉ sont opposés par le sommet.", "Car un triangle rectangle est isocèle."]]
      ]);
      return {
        consigne: q,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Attention au sens de la propriété : que sait-on, et que veut-on démontrer ?",
        correction: bonne
      };
    }
  },

  {
    groupe: F6,
    id: "probleme-triangle-paralleles",
    titre: "Triangle entre deux parallèles",
    description: "Alternes-internes puis somme des angles.",
    generer() {
      const a = alea(35, 75), b = alea(35, 75);
      return {
        consigne: `Le sommet A d'un triangle ABC est sur une droite (xy) parallèle à (BC). On sait que l'angle xAB mesure ${a}° et l'angle yAC mesure ${b}°. Calcule l'angle BAC.`,
        ligne: "angle BAC = [n] °",
        verifier: v => verifierNombre(v[0], 180 - a - b),
        indice: "Les angles xAB, BAC et CAy forment un angle plat (ou : utilise les alternes-internes puis la somme des angles du triangle).",
        correction: `xAB + BAC + CAy = 180°, donc BAC = 180° − ${a}° − ${b}° = ${180 - a - b}°. (Par les angles alternes-internes, on trouve aussi ABC = ${a}° et ACB = ${b}°.)`
      };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Angles complémentaires et supplémentaires", activites: ["complementaire"] },
    { competence: "Angles opposés par le sommet", activites: ["secantes", "angle-plat"] },
    { competence: "Reconnaître des angles alternes-internes ou correspondants", activites: ["reconnaitre-paire"] },
    { competence: "Trouver un angle sur une figure", activites: ["trouver-numero"] },
    { competence: "Calculer avec des droites parallèles", activites: ["calcul-paralleles"] },
    { competence: "Démontrer que des droites sont parallèles", activites: ["paralleles-ou-pas"] },
    { competence: "Le troisième angle d'un triangle", activites: ["troisieme-angle"] },
    { competence: "Triangles particuliers", activites: ["triangles-particuliers"] },
    { competence: "Des angles possibles pour un triangle ?", activites: ["existe-triangle"] },
    { competence: "L'inégalité triangulaire", activites: ["inegalite", "troisieme-cote"] },
    { competence: "Choisir la bonne propriété", activites: ["justifier"] },
    { competence: "Résoudre un problème", activites: ["probleme-triangle-paralleles"] }
  ]
};
