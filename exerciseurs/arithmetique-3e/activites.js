/* =====================================================================
   EXERCISEUR « ARITHMÉTIQUE » — 3e, chapitre 1

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — La division euclidienne";
const F2 = "Feuille 2 — Multiples et diviseurs";
const F3 = "Feuille 3 — Nombres premiers";
const F4 = "Feuille 4 — Décomposer en facteurs premiers";
const F5 = "Feuille 5 — Fractions irréductibles";
const F6 = "Feuille 6 — Problèmes : diviseurs et multiples communs";

const nb = x => (x < 0 ? "−" : "") + ecrireNombre(Math.abs(x));
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const pgcd = (a, b) => b === 0 ? a : pgcd(b, a % b);
const ppcm = (a, b) => a / pgcd(a, b) * b;
const estPremier = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const PREMIERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
function facteurs(n) { const f = {}; for (let d = 2; n > 1; d++) while (n % d === 0) { f[d] = (f[d] || 0) + 1; n /= d; } return f; }
const SUP = { "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9 };
const puiss = e => e === 1 ? "" : String(e).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("");
function ecrireDecomp(n) { return Object.entries(facteurs(n)).map(([p, e]) => p + puiss(e)).join(" × "); }
/* nombre « agréable » : produit de petits facteurs premiers */
function nombreDecomposable(max = 2000) {
  for (;;) { let n = 1; const k = alea(3, 5); for (let i = 0; i < k; i++) n *= choisir([2, 2, 2, 3, 3, 5, 7, 11, 13]); if (n >= 30 && n <= max) return n; }
}
/* Lit « 2^3 × 3² × 5 », « 2*2*2*3*3*5 », « 2x2x2x3x3x5 »… et renvoie { produit, premiers } */
function lireDecomp(s) {
  s = String(s).replace(/\s/g, "").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => "^" + m.split("").map(c => SUP[c]).join(""));
  if (!/^\d+(\^\d+)?([×x*.·]\d+(\^\d+)?)*$/.test(s)) return null;
  let produit = 1, premiers = true;
  for (const f of s.split(/[×x*.·]/)) {
    const [b, e = "1"] = f.split("^").map(Number);
    if (!estPremier(b)) premiers = false;
    produit *= b ** e;
  }
  return { produit, premiers };
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "division",
    titre: "Division euclidienne",
    description: "Trouver le quotient et le reste.",
    generer() {
      const b = alea(6, 30), q = alea(5, 90), r = alea(0, b - 1), a = b * q + r;
      return { consigne: `Écris la division euclidienne de ${nb(a)} par ${b}.`, ligne: `${nb(a)} = ${b} × [n] + [n]`, verifier: v => { const [x, y] = v.map(lireEntier); if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux cases." }; if (x === q && y === r) return { etat: "juste" }; if (b * x + y === a) return { etat: "faux", message: "L'égalité est vraie, mais le reste doit être inférieur au diviseur." }; return { etat: "faux" }; }, indice: `Cherche le plus grand multiple de ${b} inférieur ou égal à ${nb(a)}.`, correction: `${nb(a)} = ${b} × ${q} + ${r} (et ${r} < ${b})` };
    }
  },

  {
    groupe: F1,
    id: "est-division",
    titre: "Est-ce une division euclidienne ?",
    description: "Le reste doit être plus petit que le diviseur.",
    generer() {
      const b = alea(5, 15), q = alea(5, 20), ok = Math.random() < 0.5, r = ok ? alea(0, b - 1) : alea(b, b + 8), a = b * q + r;
      return { consigne: `L'égalité ${a} = ${b} × ${q} + ${r} est-elle la division euclidienne de ${a} par ${b} ?`, choix: ["oui", "non"], verifier: choixVerif(ok ? "oui" : "non"), indice: "Dans la division euclidienne, le reste est strictement inférieur au diviseur.", correction: ok ? `Oui : ${r} < ${b}.` : `Non : le reste ${r} n'est pas inférieur à ${b}. La division euclidienne est ${a} = ${b} × ${Math.floor(a / b)} + ${a % b}.` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "divisible",
    titre: "Critères de divisibilité",
    description: "Par 2, 3, 4, 5, 9, 10.",
    generer() {
      const d = choisir([2, 3, 4, 5, 9, 10]), oui = Math.random() < 0.5;
      let n; do { n = alea(100, 9999); } while ((n % d === 0) !== oui);
      const crit = { 2: "chiffre des unités pair", 3: "somme des chiffres divisible par 3", 4: "nombre formé par les deux derniers chiffres divisible par 4", 5: "chiffre des unités 0 ou 5", 9: "somme des chiffres divisible par 9", 10: "chiffre des unités 0" }[d];
      const somme = String(n).split("").reduce((s, c) => s + +c, 0);
      return { consigne: `${nb(n)} est-il divisible par ${d} ?`, choix: ["oui", "non"], verifier: choixVerif(oui ? "oui" : "non"), indice: `Critère : ${crit}.`, correction: `${oui ? "Oui" : "Non"}${d === 3 || d === 9 ? ` : la somme des chiffres vaut ${somme}` : ""}.` };
    }
  },

  {
    groupe: F2,
    id: "nb-diviseurs",
    titre: "Combien de diviseurs ?",
    description: "Lister les diviseurs.",
    generer() {
      const n = choisir([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 60, 72, 84, 90, 96, 100]);
      const L = []; for (let d = 1; d <= n; d++) if (n % d === 0) L.push(d);
      return { consigne: `Combien le nombre ${n} a-t-il de diviseurs (1 et ${n} compris) ?`, ligne: "[n] diviseurs", verifier: v => verifierNombre(v[0], L.length), indice: "Cherche les produits de deux entiers égaux au nombre : 1 × …, 2 × …, 3 × …", correction: `Diviseurs de ${n} : ${L.join(" ; ")} (${L.length} diviseurs).` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "premier",
    titre: "Premier ou pas ?",
    description: "Chercher un diviseur.",
    generer() {
      const oui = Math.random() < 0.45;
      const n = oui ? choisir(PREMIERS.filter(p => p > 20).concat([101, 103, 107, 109, 113, 127, 131, 137, 139, 149])) : choisir([21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 111, 117, 119, 121, 133, 143, 161, 169, 187, 203, 209, 221]);
      const d = oui ? null : [3, 7, 11, 13].find(p => n % p === 0);
      return { consigne: `Le nombre ${n} est-il premier ?`, choix: ["oui", "non"], verifier: choixVerif(oui ? "oui" : "non"), indice: "Teste la divisibilité par 2, 3, 5, 7, 11, 13… tant que le carré du diviseur ne dépasse pas le nombre.", correction: oui ? `Oui : ${n} n'est divisible par aucun nombre premier dont le carré est inférieur à ${n}.` : `Non : ${n} = ${d} × ${n / d}.` };
    }
  },

  {
    groupe: F3,
    id: "plus-petit",
    titre: "Plus petit diviseur premier",
    description: "Le premier qui divise.",
    generer() {
      const p = choisir([3, 7, 11, 13, 17]), q = choisir(PREMIERS.filter(x => x >= p && x < 40)), n = p * q;
      return { consigne: `Quel est le plus petit nombre premier qui divise ${n} ?`, ligne: "[n]", verifier: v => verifierNombre(v[0], p), indice: "Teste 2, puis 3, puis 5, puis 7…", correction: `${n} = ${p} × ${q} : c'est ${p}.` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "decomposer",
    titre: "Décomposer",
    description: "En produit de facteurs premiers.",
    generer() {
      const n = nombreDecomposable();
      return { consigne: `Décompose ${nb(n)} en produit de facteurs premiers. <br><small>Écris par exemple 2^3 × 5 ou 2×2×2×5.</small>`, ligne: `${nb(n)} = [r]`, verifier: v => { const r = lireDecomp(v[0]); if (!r) return { etat: "incomplet", message: "Écris un produit, par exemple 2^3 × 3 × 5." }; if (r.produit !== n) return { etat: "faux", message: "Ce produit n'est pas égal au nombre." }; if (!r.premiers) return { etat: "faux", message: "Le produit est juste, mais tous les facteurs ne sont pas premiers : continue à décomposer." }; return { etat: "juste" }; }, indice: "Divise successivement par 2, puis 3, puis 5, puis 7…", correction: `${nb(n)} = ${ecrireDecomp(n)}` };
    }
  },

  {
    groupe: F4,
    id: "recomposer",
    titre: "Retrouver le nombre",
    description: "À partir de sa décomposition.",
    generer() {
      const n = nombreDecomposable(3000);
      return { consigne: `Quel nombre a pour décomposition ${ecrireDecomp(n)} ?`, ligne: "[n]", verifier: v => verifierNombre(v[0], n), indice: "Calcule les puissances, puis le produit.", correction: `${ecrireDecomp(n)} = ${nb(n)}` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "irreductible",
    titre: "Fraction irréductible",
    description: "Simplifier au maximum.",
    generer() {
      let a, b, k;
      do { a = alea(2, 30); b = alea(2, 30); } while (pgcd(a, b) !== 1 || a === b);
      k = choisir([4, 6, 9, 12, 14, 15, 18, 21, 22, 24, 35]);
      const N = a * k, D = b * k;
      return { consigne: `Écris la fraction ${frac(N, D)} sous forme irréductible.`, ligne: "[f]", verifier: v => { const n = lireEntier(v[0].num), d = lireEntier(v[0].den); if (isNaN(n) || isNaN(d) || d === 0) return { etat: "incomplet", message: "Écris un entier au numérateur et au dénominateur." }; if (n * D !== N * d) return { etat: "faux" }; return pgcd(Math.abs(n), Math.abs(d)) === 1 ? { etat: "juste" } : { etat: "faux", message: "Ta fraction est égale, mais elle n'est pas encore irréductible." }; }, indice: "Décompose le numérateur et le dénominateur en facteurs premiers.", correction: `${N} = ${ecrireDecomp(N)} et ${D} = ${ecrireDecomp(D)} ; on simplifie par ${k} : ${frac(a, b)}` };
    }
  },

  {
    groupe: F5,
    id: "est-irreductible",
    titre: "Irréductible ou pas ?",
    description: "Chercher un diviseur commun.",
    generer() {
      let a, b; do { a = alea(10, 99); b = alea(10, 99); } while (a === b);
      const g = pgcd(a, b);
      return { consigne: `La fraction ${frac(a, b)} est-elle irréductible ?`, choix: ["oui", "non"], verifier: choixVerif(g === 1 ? "oui" : "non"), indice: "Le numérateur et le dénominateur ont-ils un diviseur commun autre que 1 ?", correction: g === 1 ? `Oui : ${a} = ${ecrireDecomp(a)} et ${b} = ${ecrireDecomp(b)} n'ont aucun facteur commun.` : `Non : ${a} et ${b} sont divisibles par ${g}. ${frac(a, b)} = ${frac(a / g, b / g)}` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "pgcd",
    titre: "Plus grand diviseur commun",
    description: "PGCD de deux nombres.",
    generer() {
      const g = choisir([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 18, 21, 24]); let a, b;
      do { a = alea(2, 12); b = alea(2, 12); } while (pgcd(a, b) !== 1 || a === b);
      return { consigne: `Quel est le plus grand diviseur commun (PGCD) de ${a * g} et ${b * g} ?`, ligne: "[n]", verifier: v => verifierNombre(v[0], g), indice: "Décompose les deux nombres et prends les facteurs communs.", correction: `${a * g} = ${ecrireDecomp(a * g)} ; ${b * g} = ${ecrireDecomp(b * g)} ; PGCD = ${g}` };
    }
  },

  {
    groupe: F6,
    id: "ppcm",
    titre: "Plus petit multiple commun",
    description: "PPCM de deux nombres.",
    generer() {
      const [a, b] = choisir([[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [12, 18], [9, 12], [15, 20], [12, 16], [14, 21], [18, 24], [20, 30], [15, 25], [16, 24]]);
      return { consigne: `Quel est le plus petit multiple commun non nul (PPCM) de ${a} et ${b} ?`, ligne: "[n]", verifier: v => verifierNombre(v[0], ppcm(a, b)), indice: `Écris les multiples de ${b} et cherche le premier qui est aussi multiple de ${a}.`, correction: `Multiples de ${b} : ${[1, 2, 3, 4, 5].map(k => b * k).filter(m => m <= ppcm(a, b)).join(" ; ")}… PPCM = ${ppcm(a, b)}` };
    }
  },

  {
    groupe: F6,
    id: "probleme",
    titre: "Problèmes",
    description: "Bouquets, dalles, phares…",
    generer() {
      const t = alea(1, 3);
      if (t === 1) { const g = choisir([6, 8, 12, 14, 15, 18, 21, 24]); let a, b; do { a = alea(2, 9); b = alea(2, 9); } while (pgcd(a, b) !== 1 || a === b); return { consigne: `Un fleuriste a ${a * g} roses et ${b * g} tulipes. Il veut faire le plus grand nombre possible de bouquets identiques en utilisant toutes les fleurs. Combien de bouquets ?`, ligne: "[n] bouquets", verifier: v => verifierNombre(v[0], g), indice: "Le nombre de bouquets doit diviser les deux nombres de fleurs.", correction: `PGCD(${a * g} ; ${b * g}) = ${g} bouquets, de ${a} roses et ${b} tulipes.` }; }
      if (t === 2) { const [a, b] = choisir([[12, 18], [15, 25], [8, 12], [10, 15], [20, 30], [6, 15], [14, 21]]); return { consigne: `Un phare s'allume toutes les ${a} s, un autre toutes les ${b} s. Ils s'allument ensemble. Au bout de combien de secondes s'allumeront-ils de nouveau ensemble ?`, ligne: "[n] s", verifier: v => verifierNombre(v[0], ppcm(a, b)), indice: "Cherche un multiple commun aux deux durées, le plus petit possible.", correction: `PPCM(${a} ; ${b}) = ${ppcm(a, b)} s` }; }
      const g = choisir([20, 30, 40, 50, 60]); let a, b; do { a = alea(3, 9); b = alea(3, 9); } while (pgcd(a, b) !== 1 || a === b);
      return { consigne: `Une pièce mesure ${a * g} cm sur ${b * g} cm. On la carrèle avec les plus grandes dalles carrées possible, sans découpe. Quel est le côté d'une dalle ?`, ligne: "[n] cm", verifier: v => verifierNombre(v[0], g), indice: "Le côté doit diviser les deux dimensions.", correction: `PGCD(${a * g} ; ${b * g}) = ${g} cm (${a * b} dalles).` };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Effectuer une division euclidienne", activites: ["division"] },
    { competence: "Reconnaître une division euclidienne", activites: ["est-division"] },
    { competence: "Critères de divisibilité", activites: ["divisible"] },
    { competence: "Trouver les diviseurs d'un nombre", activites: ["nb-diviseurs"] },
    { competence: "Reconnaître un nombre premier", activites: ["premier", "plus-petit"] },
    { competence: "Décomposer en facteurs premiers", activites: ["decomposer"] },
    { competence: "Décomposer en facteurs premiers", activites: ["decomposer", "recomposer"] },
    { competence: "Rendre une fraction irréductible", activites: ["irreductible"] },
    { competence: "Reconnaître une fraction irréductible", activites: ["est-irreductible"] },
    { competence: "Plus grand diviseur commun", activites: ["pgcd"] },
    { competence: "Plus petit multiple commun", activites: ["ppcm"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
