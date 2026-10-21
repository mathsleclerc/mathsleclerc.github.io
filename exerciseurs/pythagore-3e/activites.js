/* =====================================================================
   EXERCISEUR « THÉORÈME DE PYTHAGORE ET RÉCIPROQUE » — 3e, chapitre 3

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Calculer l'hypoténuse";
const F2 = "Feuille 2 — Calculer un côté de l'angle droit";
const F3 = "Feuille 3 — Le triangle est-il rectangle ?";
const F4 = "Feuille 4 — Valeurs exactes, aires et périmètres";
const F5 = "Feuille 5 — Pythagore dans l'espace";
const F6 = "Feuille 6 — Problèmes type brevet";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const arr1 = x => Math.round(x * 10) / 10;
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const verifierArrondi = (s, exact) => {
  const x = lireNombre(s);
  if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre dans la case." };
  if (Math.abs(x - arr1(exact)) < 1e-9) return { etat: "juste" };
  if (Math.abs(x - exact) < 0.1) return { etat: "faux", message: "Attention à l'arrondi au dixième." };
  return { etat: "faux" };
};
/* Triplets pythagoriciens (a, b, c) avec c hypoténuse */
const TRIPLETS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [15, 20, 25], [20, 21, 29], [1.5, 2, 2.5], [2.4, 3.2, 4], [0.9, 1.2, 1.5], [10, 24, 26], [12, 35, 37]];

/* Triangle rectangle en A : côtés AB = a, AC = b (unités quelconques), orienté au hasard.
   etiq = { AB, AC, BC } : textes à écrire sur les côtés. */
function figTriangle(a, b, [nA, nB, nC], etiq = {}) {
  const L = 300, H = 220, ang = choisir([0, 90, 180, 270, 30, -30]) * DEG, sym = Math.random() < 0.5 ? 1 : -1;
  const k = 150 / Math.max(a, b);
  let A = { x: 0, y: 0 }, B = V.tourner({ x: a * k, y: 0 }, A, ang), C = V.tourner({ x: 0, y: -b * k * sym }, A, ang);
  const xs = [A.x, B.x, C.x], ys = [A.y, B.y, C.y], dx = (L - (Math.max(...xs) + Math.min(...xs))) / 2, dy = (H - (Math.max(...ys) + Math.min(...ys))) / 2;
  [A, B, C] = [A, B, C].map(p => ({ x: p.x + dx, y: p.y + dy }));
  const s = figureGeo(L, H, "Triangle rectangle");
  const G = V.fois(V.plus(V.plus(A, B), C), 1 / 3);
  [[A, B], [B, C], [C, A]].forEach(([p, q]) => dessinerTrait(s, p, q));
  codageAngleDroit(s, A, V.moins(B, A), V.moins(C, A));
  [[A, nA], [B, nB], [C, nC]].forEach(([p, n]) => dessinerTexte(s, V.plus(p, V.fois(V.unitaire(V.moins(p, G)), 16)), n, "geo-nom"));
  const cote = (p, q, t) => { if (!t) return; const m = V.milieu(p, q); dessinerTexte(s, V.plus(m, V.fois(V.unitaire(V.moins(m, G)), 20)), t, "geo-nom"); };
  cote(A, B, etiq.AB); cote(A, C, etiq.AC); cote(B, C, etiq.BC);
  return s;
}

const ACTIVITES = [
  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "hypotenuse-nom",
    titre: "Repérer l'hypoténuse",
    description: "Le côté opposé à l'angle droit.",
    generer() {
      const [A, B, C] = tirerLettres(3);
      const fig = figTriangle(alea(3, 6), alea(3, 6), [A, B, C]);
      return { consigne: `Quelle est l'hypoténuse de ce triangle rectangle en ${A} ?`, figure: fig, choix: melanger([`[${A}${B}]`, `[${A}${C}]`, `[${B}${C}]`]), verifier: choixVerif(`[${B}${C}]`), indice: "L'hypoténuse est le côté opposé à l'angle droit : c'est le plus long.", correction: `L'angle droit est en ${A} ; le côté opposé est [${B}${C}].` };
    }
  },

  {
    groupe: F1,
    id: "egalite",
    titre: "Écrire l'égalité de Pythagore",
    description: "La bonne égalité.",
    generer() {
      const [A, B, C] = tirerLettres(3);
      const fig = figTriangle(alea(3, 6), alea(3, 6), [A, B, C]);
      const bonne = `${B}${C}² = ${A}${B}² + ${A}${C}²`;
      return { consigne: `Le triangle ${A}${B}${C} est rectangle en ${A}. Quelle égalité est vraie ?`, figure: fig, choix: melanger([bonne, `${A}${B}² = ${B}${C}² + ${A}${C}²`, `${A}${C}² = ${A}${B}² + ${B}${C}²`]), verifier: choixVerif(bonne), indice: "L'hypoténuse est seule d'un côté du signe =.", correction: `L'hypoténuse est [${B}${C}] : ${bonne}.` };
    }
  },

  {
    groupe: F1,
    id: "hypotenuse",
    titre: "Calculer l'hypoténuse",
    description: "BC² = AB² + AC².",
    generer() {
      const [A, B, C] = tirerLettres(3), juste = Math.random() < 0.6;
      let a, b, c;
      if (juste) [a, b, c] = choisir(TRIPLETS); else { a = alea(2, 9); b = alea(2, 9); c = Math.sqrt(a * a + b * b); }
      const fig = figTriangle(a, b, [A, B, C], { AB: nb(a) + " cm", AC: nb(b) + " cm", BC: "?" });
      return { consigne: `Le triangle ${A}${B}${C} est rectangle en ${A}. Calcule ${B}${C}${juste ? "" : " (arrondi au dixième)"}.`, figure: fig, ligne: `${B}${C} = [d] cm`, verifier: v => juste ? verifierNombre(v[0], c) : verifierArrondi(v[0], c), indice: `${B}${C}² = ${A}${B}² + ${A}${C}², puis on prend la racine carrée.`, correction: `${B}${C}² = ${nb(a)}² + ${nb(b)}² = ${nb(a * a)} + ${nb(b * b)} = ${nb(a * a + b * b)}, donc ${B}${C} = √${nb(a * a + b * b)} ${juste ? "= " + nb(c) : "≈ " + nb(arr1(c))} cm.` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "cote",
    titre: "Calculer un côté de l'angle droit",
    description: "On soustrait !",
    generer() {
      const [A, B, C] = tirerLettres(3), juste = Math.random() < 0.6;
      let a, b, c;
      if (juste) [a, b, c] = choisir(TRIPLETS); else { c = alea(6, 15); a = alea(2, c - 2); b = Math.sqrt(c * c - a * a); }
      const fig = figTriangle(a, b, [A, B, C], { AB: nb(a) + " cm", AC: "?", BC: nb(c) + " cm" });
      return { consigne: `Le triangle ${A}${B}${C} est rectangle en ${A}. Calcule ${A}${C}${juste ? "" : " (arrondi au dixième)"}.`, figure: fig, ligne: `${A}${C} = [d] cm`, verifier: v => juste ? verifierNombre(v[0], b) : verifierArrondi(v[0], b), indice: `${B}${C}² = ${A}${B}² + ${A}${C}², donc ${A}${C}² = ${B}${C}² − ${A}${B}².`, correction: `${A}${C}² = ${nb(c)}² − ${nb(a)}² = ${nb(c * c)} − ${nb(a * a)} = ${nb(c * c - a * a)}, donc ${A}${C} = √${nb(c * c - a * a)} ${juste ? "= " + nb(b) : "≈ " + nb(arr1(b))} cm.` };
    }
  },

  {
    groupe: F2,
    id: "cote-ou-hyp",
    titre: "Additionner ou soustraire ?",
    description: "Hypoténuse ou côté de l'angle droit.",
    generer() {
      const [a, b, c] = choisir(TRIPLETS), [A, B, C] = tirerLettres(3), cherche = choisir(["hyp", "cote"]);
      return cherche === "hyp"
        ? { consigne: `${A}${B}${C} est rectangle en ${A}, avec ${A}${B} = ${nb(a)} cm et ${A}${C} = ${nb(b)} cm. Calcule ${B}${C}.`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], c), indice: "Tu cherches l'hypoténuse : additionne les carrés.", correction: `${B}${C}² = ${nb(a * a)} + ${nb(b * b)} = ${nb(c * c)} ; ${B}${C} = ${nb(c)} cm.` }
        : { consigne: `${A}${B}${C} est rectangle en ${A}, avec ${B}${C} = ${nb(c)} cm et ${A}${C} = ${nb(b)} cm. Calcule ${A}${B}.`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], a), indice: "Tu cherches un côté de l'angle droit : soustrais au carré de l'hypoténuse.", correction: `${A}${B}² = ${nb(c * c)} − ${nb(b * b)} = ${nb(a * a)} ; ${A}${B} = ${nb(a)} cm.` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "rectangle",
    titre: "Le triangle est-il rectangle ?",
    description: "Réciproque ou contraposée.",
    generer() {
      const oui = Math.random() < 0.5;
      let [a, b, c] = choisir(TRIPLETS);
      if (!oui) c = rr(c + choisir([1, -1, 0.5]) * (c > 5 ? 1 : 0.2));
      const [A, B, C] = tirerLettres(3), cotes = melanger([[`${A}${B}`, a], [`${A}${C}`, b], [`${B}${C}`, c]]);
      return { consigne: `Le triangle ${A}${B}${C} est tel que ${cotes.map(([n, l]) => `${n} = ${nb(l)} cm`).join(", ")}. Est-il rectangle ?`, choix: ["Oui, il est rectangle", "Non, il n'est pas rectangle"], verifier: choixVerif(oui ? "Oui, il est rectangle" : "Non, il n'est pas rectangle"), indice: "Compare le carré du plus long côté avec la somme des carrés des deux autres.", correction: `${nb(c)}² = ${nb(c * c)} et ${nb(a)}² + ${nb(b)}² = ${nb(a * a + b * b)} : ${oui ? "égalité, donc il est rectangle (réciproque du théorème de Pythagore)." : "pas d'égalité, donc il n'est pas rectangle (contraposée)."}` };
    }
  },

  {
    groupe: F3,
    id: "sommet",
    titre: "Où est l'angle droit ?",
    description: "Opposé au plus long côté.",
    generer() {
      const [a, b, c] = choisir(TRIPLETS), [A, B, C] = tirerLettres(3);
      const cotes = melanger([[`${A}${B}`, a], [`${A}${C}`, b], [`${B}${C}`, c]]);
      return { consigne: `Le triangle ${A}${B}${C} est tel que ${cotes.map(([n, l]) => `${n} = ${nb(l)} cm`).join(", ")}. Il est rectangle : en quel sommet ?`, choix: [A, B, C], verifier: choixVerif(A), indice: "L'angle droit est opposé au plus long côté.", correction: `Le plus long côté est [${B}${C}] ; l'angle droit est en ${A}.` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "racine",
    titre: "Racines carrées",
    description: "Décimaux, sommes, propriétés.",
    generer() {
      const [q, r, c] = choisir([
        (() => { const n = alea(1, 9); return [`√${nb(n * n / 100)}`, n / 10, `${nb(n / 10)}<sup>2</sup> = ${nb(n * n / 100)}`]; })(),
        (() => { const n = alea(2, 30); return [`(√${n})<sup>2</sup>`, n, `Par définition, (√a)<sup>2</sup> = a.`]; })(),
        (() => { const [a, b, cc] = choisir([[3, 4, 5], [6, 8, 10], [5, 12, 13]]); return [`√(${a * a} + ${b * b})`, cc, `√${a * a + b * b} = ${cc} (attention : ce n'est pas √${a * a} + √${b * b} = ${a + b}).`]; })(),
        (() => { const n = alea(2, 9) * 10; return [`√${n * n}`, n, `${n}<sup>2</sup> = ${n * n}`]; })()
      ]);
      return { consigne: `Calcule ${q}.`, ligne: `${q} = [d]`, verifier: v => verifierNombre(v[0], rr(r)), indice: "La racine carrée de a est le nombre positif dont le carré vaut a.", correction: c };
    }
  },

  {
    groupe: F4,
    id: "encadrer",
    titre: "Encadrer une racine carrée",
    description: "Entre deux entiers consécutifs.",
    generer() {
      let n; do { n = alea(2, 150); } while (Number.isInteger(Math.sqrt(n)));
      const e = Math.floor(Math.sqrt(n));
      return { consigne: `Encadre √${n} entre deux entiers consécutifs.`, ligne: `[n] < √${n} < [n]`, verifier: v => { const a = lireEntier(v[0]), b = lireEntier(v[1]); if (isNaN(a) || isNaN(b)) return { etat: "incomplet", message: "Remplis les deux cases." }; return a === e && b === e + 1 ? { etat: "juste" } : { etat: "faux" }; }, indice: `Cherche les deux carrés parfaits qui entourent ${n}.`, correction: `${e * e} < ${n} < ${(e + 1) ** 2}, donc ${e} < √${n} < ${e + 1}.` };
    }
  },

  {
    groupe: F4,
    id: "aire-carre",
    titre: "Côté d'un carré d'aire donnée",
    description: "c = √A.",
    generer() {
      const exact = Math.random() < 0.5, n = exact ? alea(2, 15) ** 2 : alea(5, 90);
      return exact
        ? { consigne: `Un carré a une aire de ${n} cm². Quelle est la longueur de son côté ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], Math.sqrt(n)), indice: "Le côté est la racine carrée de l'aire.", correction: `√${n} = ${Math.sqrt(n)} cm.` }
        : { consigne: `Un carré a une aire de ${n} cm². Donne la longueur de son côté arrondie au dixième.`, ligne: "[d] cm", verifier: v => verifierArrondi(v[0], Math.sqrt(n)), indice: "Utilise la touche √ de la calculatrice.", correction: `√${n} ≈ ${nb(arr1(Math.sqrt(n)))} cm.` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "pave",
    titre: "Diagonale d'un pavé",
    description: "Deux fois Pythagore.",
    generer() {
      const [a, b, c, d] = choisir([[2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15], [1, 12, 12, 17]]);
      const q = Math.random() < 0.4;
      if (q) return { consigne: `ABCDEFGH est un pavé droit avec AB = ${a} cm, BC = ${b} cm et CG = ${c} cm. Calcule AC² (le carré de la diagonale de la face ABCD).`, ligne: "AC² = [d]", verifier: v => verifierNombre(v[0], a * a + b * b), indice: "Le triangle ABC est rectangle en B.", correction: `AC² = ${a}² + ${b}² = ${a * a + b * b}` };
      return { consigne: `ABCDEFGH est un pavé droit avec AB = ${a} cm, BC = ${b} cm et CG = ${c} cm. Calcule la longueur de la grande diagonale AG.`, ligne: "AG = [d] cm", verifier: v => verifierNombre(v[0], d), indice: "Calcule d'abord AC² dans le triangle ABC rectangle en B, puis utilise le triangle ACG rectangle en C.", correction: `AC² = ${a * a} + ${b * b} = ${a * a + b * b} ; AG² = ${a * a + b * b} + ${c * c} = ${d * d} ; AG = ${d} cm` };
    }
  },

  {
    groupe: F5,
    id: "cone",
    titre: "Cônes et pyramides",
    description: "Génératrice, hauteur, apothème.",
    generer() {
      const [r, h, g] = choisir(TRIPLETS.filter(t => Number.isInteger(t[0])));
      const t = alea(1, 3);
      if (t === 1) return { consigne: `Un cône de révolution a pour rayon ${r} cm et pour hauteur ${h} cm. Calcule la longueur d'une génératrice.`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], g), indice: "La hauteur, le rayon et la génératrice forment un triangle rectangle.", correction: `g² = ${r}² + ${h}² = ${g * g} ; g = ${g} cm` };
      if (t === 2) return { consigne: `Un cône de révolution a une génératrice de ${g} cm et un rayon de ${r} cm. Calcule sa hauteur.`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], h), indice: "La génératrice est l'hypoténuse.", correction: `h² = ${g}² − ${r}² = ${h * h} ; h = ${h} cm` };
      return { consigne: `Une pyramide régulière à base carrée a une hauteur SO = ${h} cm. M est le milieu d'un côté de la base et OM = ${r} cm. Calcule SM.`, ligne: "SM = [d] cm", verifier: v => verifierNombre(v[0], g), indice: "Le triangle SOM est rectangle en O.", correction: `SM² = ${h}² + ${r}² = ${g * g} ; SM = ${g} cm` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "probleme",
    titre: "Problèmes",
    description: "Échelles, écrans, raccourcis…",
    generer() {
      const [q, r, u, c, juste] = choisir([
        (() => { const [a, b, cc] = choisir([[5, 12, 13], [3, 4, 5], [6, 8, 10]]); return [`Une échelle de ${cc} m est appuyée contre un mur vertical ; son pied est à ${a} m du mur. À quelle hauteur arrive-t-elle ?`, b, "m", `h² = ${cc}² − ${a}² = ${cc * cc - a * a}, donc h = ${b} m.`, true]; })(),
        (() => { const [a, b, cc] = choisir([[300, 400, 500], [60, 80, 100], [90, 120, 150]]); return [`Pour aller de A à C, on longe deux rues perpendiculaires de ${a} m et ${b} m. Combien de mètres gagne-t-on en prenant le chemin direct ?`, a + b - cc, "m", `Chemin direct : √(${a}² + ${b}²) = ${cc} m ; gain : ${a + b} − ${cc} = ${a + b - cc} m.`, true]; })(),
        (() => { const L = choisir([4, 5, 6]), l = choisir([2, 3]); const d = Math.sqrt(L * L + l * l); return [`Quelle est la longueur de la diagonale d'un rectangle de ${L} m sur ${l} m (au dixième) ?`, d, "m", `d = √(${L * L} + ${l * l}) = √${L * L + l * l} ≈ ${nb(arr1(d))} m.`, false]; })(),
        (() => { const [a, b, cc] = choisir([[30, 40, 50], [24, 32, 40]]); return [`Un cerf-volant est retenu par un fil tendu de ${cc} m. L'enfant est à ${a} m du point situé sous le cerf-volant. À quelle hauteur vole-t-il ?`, b, "m", `h² = ${cc}² − ${a}² = ${b * b}, donc h = ${b} m.`, true]; })()
      ]);
      return { consigne: q, ligne: `[d] ${u}`, verifier: v => juste ? verifierNombre(v[0], r) : verifierArrondi(v[0], r), indice: "Repère le triangle rectangle et son hypoténuse.", correction: c };
    }
  },

  {
    groupe: F6,
    id: "exacte",
    titre: "Valeur exacte ou approchée ?",
    description: "√ et arrondis.",
    generer() {
      const a = alea(2, 9), b = alea(2, 9), s2 = a * a + b * b, rac = Math.sqrt(s2);
      if (Number.isInteger(rac)) return this.generer();
      const bonne = `√${s2} cm`;
      return { consigne: `Un triangle rectangle a des côtés de l'angle droit de ${a} cm et ${b} cm. Quelle est la valeur exacte de son hypoténuse ?`, choix: melanger([bonne, `${nb(arr1(rac))} cm`, `${a + b} cm`, `√${a + b} cm`]), verifier: choixVerif(bonne), indice: "La valeur exacte s'écrit avec une racine carrée ; un arrondi est une valeur approchée.", correction: `h² = ${a * a} + ${b * b} = ${s2}, donc h = √${s2} cm (≈ ${nb(arr1(rac))} cm).` };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Repérer l'hypoténuse", activites: ["hypotenuse-nom"] },
    { competence: "Écrire l'égalité de Pythagore", activites: ["egalite"] },
    { competence: "Calculer l'hypoténuse", activites: ["hypotenuse"] },
    { competence: "Calculer un côté de l'angle droit", activites: ["cote"] },
    { competence: "Additionner ou soustraire", activites: ["cote-ou-hyp"] },
    { competence: "Prouver qu'un triangle est (ou n'est pas) rectangle", activites: ["rectangle"] },
    { competence: "Trouver le sommet de l'angle droit", activites: ["sommet"] },
    { competence: "Racines carrées", activites: ["racine", "encadrer"] },
    { competence: "Valeur exacte et valeur approchée", activites: ["exacte"] },
    { competence: "Pythagore dans un pavé", activites: ["pave"] },
    { competence: "Cônes et pyramides", activites: ["cone"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
