/* =====================================================================
   EXERCISEUR « ÉQUATIONS PRODUIT NUL ET x² = a » — 3e, chapitre 8

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Équations produit nul";
const F2 = "Feuille 2 — Factoriser pour résoudre";
const F3 = "Feuille 3 — Les équations x² = a";
const F4 = "Feuille 4 — Choisir la bonne méthode";
const F5 = "Feuille 5 — Problèmes de géométrie";
const F6 = "Feuille 6 — Problèmes type brevet";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const nz = (a, b) => { let x = 0; while (x === 0) x = alea(a, b); return x; };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
/* p x + q écrit proprement */
function lin(p, q) {
  let s = p === 1 ? "x" : p === -1 ? "−x" : nb(p) + "x";
  if (q) s += (q > 0 ? " + " : " − ") + nb(Math.abs(q));
  return s;
}
/* deux solutions, dans n'importe quel ordre (ou une seule si a = b) */
const deuxSol = (a, b) => v => {
  const x = v.map(lireNombre);
  if (x.some(isNaN)) return { etat: "incomplet", message: "Remplis les deux cases (le même nombre deux fois s'il n'y a qu'une solution)." };
  const ok = (Math.abs(x[0] - a) < 1e-9 && Math.abs(x[1] - b) < 1e-9) || (Math.abs(x[0] - b) < 1e-9 && Math.abs(x[1] - a) < 1e-9);
  return ok ? { etat: "juste" } : { etat: "faux" };
};
const DEUX = "x = [d] ou x = [d]";
/* racine « simple » : entier ou demi-entier */
const racine = () => choisir([alea(-9, 9), alea(-9, 9), alea(-9, 9) + 0.5]);

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "produit-nul",
    titre: "Résoudre (ax + b)(cx + d) = 0",
    description: "Un des facteurs est nul.",
    generer() {
      const a = choisir([1, 1, 2, 3, -1]), r1 = racine(), c = choisir([1, 1, 2, 4]), r2 = racine();
      const b = rr(-a * r1), d = rr(-c * r2);
      if (!Number.isInteger(b) || !Number.isInteger(d) || r1 === r2) return this.generer();
      return { consigne: `Résous : (${lin(a, b)})(${lin(c, d)}) = 0`, ligne: DEUX, verifier: deuxSol(r1, r2), indice: "Un produit est nul si l'un de ses facteurs est nul : résous chaque facteur = 0.", correction: `${lin(a, b)} = 0 ou ${lin(c, d)} = 0 : x = ${nb(r1)} ou x = ${nb(r2)}` };
    }
  },

  {
    groupe: F1,
    id: "produit-x",
    titre: "Résoudre x(ax + b) = 0",
    description: "x est un facteur.",
    generer() {
      const a = choisir([1, 2, 3, -1, 4]), r = racine(), b = rr(-a * r);
      if (!Number.isInteger(b) || r === 0) return this.generer();
      return { consigne: `Résous : x(${lin(a, b)}) = 0`, ligne: DEUX, verifier: deuxSol(0, r), indice: "x = 0 est une solution… et l'autre ?", correction: `x = 0 ou ${lin(a, b)} = 0 : x = 0 ou x = ${nb(r)}` };
    }
  },

  {
    groupe: F1,
    id: "piege",
    titre: "La règle s'applique-t-elle ?",
    description: "Seulement si le produit vaut 0.",
    generer() {
      const a = nz(-6, 6), b = nz(-6, 6), k = choisir([0, 0, 2, 5, -3]);
      const e = `(x ${a < 0 ? "+" : "−"} ${Math.abs(a)})(x ${b < 0 ? "+" : "−"} ${Math.abs(b)}) = ${nb(k)}`;
      const bonne = k === 0 ? "oui" : "non";
      return { consigne: `Pour résoudre ${e}, peut-on écrire « x ${a < 0 ? "+" : "−"} ${Math.abs(a)} = ${nb(k)} ou x ${b < 0 ? "+" : "−"} ${Math.abs(b)} = ${nb(k)} » ?`, choix: ["oui", "non"], verifier: choixVerif(bonne), indice: "La règle du produit nul ne marche que pour un produit égal à 0.", correction: k === 0 ? "Oui : c'est la règle du produit nul." : `Non : la règle ne marche que si le produit vaut 0, pas ${nb(k)}.` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "facteur-commun",
    titre: "x² + bx = 0",
    description: "Factoriser par x.",
    generer() {
      const a = choisir([1, 1, 2, 3]), r = nz(-9, 9), b = -a * r, eg = Math.random() < 0.4;
      return { consigne: eg ? `Résous : ${a === 1 ? "" : a}x² = ${nb(-b)}x` : `Résous : ${a === 1 ? "" : a}x² ${b < 0 ? "−" : "+"} ${nb(Math.abs(b))}x = 0`, ligne: DEUX, verifier: deuxSol(0, r), indice: eg ? "Ramène tout dans le membre de gauche, puis factorise par x. Ne divise pas par x !" : "Factorise par x.", correction: `${a === 1 ? "" : a}x(x ${r > 0 ? "−" : "+"} ${Math.abs(r)}) = 0 : x = 0 ou x = ${nb(r)}` };
    }
  },

  {
    groupe: F2,
    id: "difference-carres",
    titre: "(x + a)² − b² = 0",
    description: "Factoriser avec a² − b².",
    generer() {
      const a = nz(-6, 6), b = alea(1, 8);
      return { consigne: `Résous : (x ${a < 0 ? "−" : "+"} ${Math.abs(a)})² − ${b * b} = 0`, ligne: DEUX, verifier: deuxSol(-a + b, -a - b), indice: `Factorise avec a² − b² : ${b * b} = ${b}².`, correction: `(${lin(1, a - b)})(${lin(1, a + b)}) = 0 : x = ${nb(-a + b)} ou x = ${nb(-a - b)}` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "nb-solutions",
    titre: "Combien de solutions ?",
    description: "x² = a.",
    generer() {
      const a = choisir([16, 7, 0, -4, -25, 50, 1, -1]);
      const r = a > 0 ? "deux" : a === 0 ? "une" : "aucune";
      return { consigne: `Combien de solutions l'équation x² = ${nb(a)} a-t-elle ?`, choix: ["aucune", "une", "deux"], verifier: choixVerif(r), indice: "Un carré est toujours positif ou nul.", correction: a > 0 ? `Deux : √${a} et −√${a}.` : a === 0 ? "Une : 0." : "Aucune : un carré n'est jamais négatif." };
    }
  },

  {
    groupe: F3,
    id: "x2-egal-a",
    titre: "Résoudre x² = a",
    description: "Deux solutions opposées.",
    generer() {
      const r = alea(1, 12), k = choisir([1, 1, 2, 3, 5]), c = choisir([0, 0, alea(1, 20)]);
      return { consigne: `Résous : ${k === 1 ? "" : k}x²${c ? " + " + c : ""} = ${nb(k * r * r + c)}`, ligne: DEUX, verifier: deuxSol(r, -r), indice: "Isole x², puis cherche les deux nombres dont le carré convient.", correction: `x² = ${r * r} : x = ${r} ou x = −${r}` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "methode",
    titre: "Quelle méthode ?",
    description: "Isoler, factoriser, x² = a.",
    generer() {
      const [e, r] = choisir([
        ["3x − 7 = 2x + 5", "isoler x (premier degré)"], ["(x + 4)(2x − 3) = 0", "produit nul directement"], ["x² = 121", "x² = a"],
        ["x² + 5x = 0", "factoriser, puis produit nul"], ["(x − 1)² − 16 = 0", "factoriser, puis produit nul"], ["5x² = 45", "x² = a"], ["(x + 2)² − x² = 20", "isoler x (premier degré)"]
      ]);
      return { consigne: `Quelle méthode utiliser pour résoudre ${e} ?`, choix: ["isoler x (premier degré)", "produit nul directement", "factoriser, puis produit nul", "x² = a"], verifier: choixVerif(r), indice: "Regarde s'il y a un x² et si l'équation est déjà un produit égal à 0.", correction: r + (e === "(x + 2)² − x² = 20" ? " : les x² s'éliminent (4x + 4 = 20)." : ".") };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "aire",
    titre: "Aire donnée, longueur cherchée",
    description: "Carré ou disque.",
    generer() {
      if (Math.random() < 0.5) { const A = choisir([20, 30, 45, 60, 72, 80, 90, 120]), c = Math.sqrt(A); return { consigne: `Un carré a une aire de ${A} cm². Quelle est la longueur de son côté, arrondie au dixième ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], Math.round(c * 10) / 10), indice: "c² = aire et c > 0.", correction: `c = √${A} ≈ ${nb(Math.round(c * 10) / 10)} cm` }; }
      const A = choisir([20, 30, 50, 80, 100]), r = Math.sqrt(A / Math.PI);
      return { consigne: `Un disque a une aire de ${A} cm². Quel est son rayon, arrondi au dixième ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], Math.round(r * 10) / 10), indice: "πr² = aire, donc r² = aire ÷ π.", correction: `r² = ${A} ÷ π ≈ ${nb(Math.round(A / Math.PI * 100) / 100)} ; r ≈ ${nb(Math.round(r * 10) / 10)} cm` };
    }
  },

  {
    groupe: F5,
    id: "cadre",
    titre: "Le cadre",
    description: "(x + 2e)² = aire.",
    generer() {
      const e = choisir([1, 2, 3]), x = alea(5, 20), T = (x + 2 * e) ** 2;
      return { consigne: `Une photo carrée de côté x est entourée d'un cadre de ${e} cm de large. L'aire totale est ${T} cm². Calcule x.`, ligne: "x = [d] cm", verifier: v => verifierNombre(v[0], x), indice: `(x + ${2 * e})² = ${T}, et x + ${2 * e} est positif.`, correction: `x + ${2 * e} = √${T} = ${x + 2 * e} ; x = ${x} cm` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "antecedents-0",
    titre: "Antécédents de 0",
    description: "f(x) = (x + a)(b − x).",
    generer() {
      const a = nz(-7, 7), b = nz(-7, 7); if (-a === b) return this.generer();
      return { consigne: `f(x) = (x ${a < 0 ? "−" : "+"} ${Math.abs(a)})(${nb(b)} − x). Quels sont les antécédents de 0 par f ?`, ligne: DEUX, verifier: deuxSol(-a, b), indice: "Résous f(x) = 0 : c'est une équation produit nul.", correction: `x ${a < 0 ? "−" : "+"} ${Math.abs(a)} = 0 ou ${nb(b)} − x = 0 : ${nb(-a)} et ${nb(b)}` };
    }
  },

  {
    groupe: F6,
    id: "balle",
    titre: "La balle",
    description: "h(t) = t(v − 5t).",
    generer() {
      const T = alea(2, 6), v = 5 * T;
      return { consigne: `Une balle lancée vers le haut est à la hauteur h(t) = t(${v} − 5t) mètres après t secondes. Au bout de combien de secondes retombe-t-elle au sol ?`, ligne: "[d] s", verifier: v2 => verifierNombre(v2[0], T), indice: "Résous h(t) = 0 ; t = 0 correspond au lancer.", correction: `t = 0 ou ${v} − 5t = 0 : t = ${T} s` };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Équation produit nul", activites: ["produit-nul"] },
    { competence: "Équation produit nul", activites: ["produit-x"] },
    { competence: "Quand appliquer la règle ?", activites: ["piege"] },
    { competence: "Factoriser par x pour résoudre", activites: ["facteur-commun"] },
    { competence: "Factoriser avec a² − b² pour résoudre", activites: ["difference-carres"] },
    { competence: "Nombre de solutions de x² = a", activites: ["nb-solutions"] },
    { competence: "Résoudre x² = a", activites: ["x2-egal-a"] },
    { competence: "Choisir la méthode", activites: ["methode"] },
    { competence: "Aire et longueur", activites: ["aire"] },
    { competence: "Problème de géométrie", activites: ["cadre"] },
    { competence: "Antécédents de 0", activites: ["antecedents-0"] },
    { competence: "Problème type brevet", activites: ["balle"] }
  ]
};
