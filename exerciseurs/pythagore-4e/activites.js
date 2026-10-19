/* =====================================================================
   EXERCISEUR « RACINE CARRÉE ET THÉORÈME DE PYTHAGORE » — 4e, chapitre 3

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Carrés et racines carrées";
const F2 = "Feuille 2 — Calculer l'hypoténuse";
const F3 = "Feuille 3 — Calculer un côté de l'angle droit";
const F4 = "Feuille 4 — Le triangle est-il rectangle ?";
const F5 = "Feuille 5 — Triangle rectangle et cercle circonscrit";
const F6 = "Feuille 6 — Résoudre des problèmes";

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
    id: "carres",
    titre: "Carrés parfaits",
    description: "De 0² à 12², et retour.",
    generer() {
      const n = alea(0, 12), sens = Math.random() < 0.5;
      return sens
        ? { consigne: `Calcule ${n}<sup>2</sup>.`, ligne: `${n}<sup>2</sup> = [n]`, verifier: v => verifierNombre(v[0], n * n), indice: `${n}<sup>2</sup> = ${n} × ${n}.`, correction: `${n}<sup>2</sup> = ${n * n}` }
        : { consigne: `Calcule √${n * n}.`, ligne: `√${n * n} = [n]`, verifier: v => verifierNombre(v[0], n), indice: `Cherche le nombre positif dont le carré vaut ${n * n}.`, correction: `√${n * n} = ${n} car ${n}<sup>2</sup> = ${n * n}.` };
    }
  },

  {
    groupe: F1,
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
    groupe: F1,
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
    groupe: F1,
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

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
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
    groupe: F2,
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
    groupe: F2,
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

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
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
    groupe: F3,
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

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
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
    groupe: F4,
    id: "sommet",
    titre: "Où est l'angle droit ?",
    description: "Opposé au plus long côté.",
    generer() {
      const [a, b, c] = choisir(TRIPLETS), [A, B, C] = tirerLettres(3);
      const cotes = melanger([[`${A}${B}`, a], [`${A}${C}`, b], [`${B}${C}`, c]]);
      return { consigne: `Le triangle ${A}${B}${C} est tel que ${cotes.map(([n, l]) => `${n} = ${nb(l)} cm`).join(", ")}. Il est rectangle : en quel sommet ?`, choix: [A, B, C], verifier: choixVerif(A), indice: "L'angle droit est opposé au plus long côté.", correction: `Le plus long côté est [${B}${C}] ; l'angle droit est en ${A}.` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "cercle",
    titre: "Cercle circonscrit",
    description: "L'hypoténuse est un diamètre.",
    generer() {
      const h = choisir([6, 7, 8, 9, 10, 11, 13, 15]), [A, B, C] = tirerLettres(3), q = choisir(["rayon", "mediane", "hyp"]);
      if (q === "rayon") return { consigne: `${A}${B}${C} est rectangle en ${A} et ${B}${C} = ${h} cm. Quel est le rayon de son cercle circonscrit ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], h / 2), indice: "L'hypoténuse est un diamètre du cercle circonscrit.", correction: `Rayon = ${h} ÷ 2 = ${nb(h / 2)} cm.` };
      if (q === "mediane") return { consigne: `${A}${B}${C} est rectangle en ${A}, ${B}${C} = ${h} cm et I est le milieu de [${B}${C}]. Que vaut ${A}I ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], h / 2), indice: `${A} est sur le cercle de centre I et de diamètre [${B}${C}].`, correction: `${A}I = ${B}${C} ÷ 2 = ${nb(h / 2)} cm.` };
      return { consigne: `${A}${B}${C} est rectangle en ${A} ; son cercle circonscrit a un rayon de ${nb(h / 2)} cm. Que vaut ${B}${C} ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], h), indice: "L'hypoténuse est un diamètre.", correction: `${B}${C} = 2 × ${nb(h / 2)} = ${h} cm.` };
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
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Connaître les carrés parfaits", activites: ["carres"] },
    { competence: "Calculer une racine carrée", activites: ["racine"] },
    { competence: "Encadrer une racine carrée", activites: ["encadrer"] },
    { competence: "Côté d'un carré d'aire donnée", activites: ["aire-carre"] },
    { competence: "Repérer l'hypoténuse", activites: ["hypotenuse-nom"] },
    { competence: "Écrire l'égalité de Pythagore", activites: ["egalite"] },
    { competence: "Calculer l'hypoténuse", activites: ["hypotenuse"] },
    { competence: "Calculer un côté de l'angle droit", activites: ["cote"] },
    { competence: "Prouver qu'un triangle est (ou n'est pas) rectangle", activites: ["rectangle"] },
    { competence: "Trouver le sommet de l'angle droit", activites: ["sommet"] },
    { competence: "Triangle rectangle et cercle circonscrit", activites: ["cercle"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
