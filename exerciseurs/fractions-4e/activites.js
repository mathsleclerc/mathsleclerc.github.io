/* =====================================================================
   EXERCISEUR « FRACTIONS ET NOMBRES RATIONNELS » — 4e, chapitre 4

   Les activités sont rangées comme les 7 feuilles d'exercices du chapitre.
   Les résultats à écrire sous forme de fraction sont positifs (le signe est travaillé
   dans des questions à choix). Une fraction doit être donnée irréductible quand c'est demandé.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 14 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Nombres premiers et décomposition";
const F2 = "Feuille 2 — Simplifier, fractions égales";
const F3 = "Feuille 3 — Comparer, additionner, soustraire";
const F4 = "Feuille 4 — Multiplier des fractions";
const F5 = "Feuille 5 — Inverse et division";
const F6 = "Feuille 6 — Enchaîner les opérations";
const F7 = "Feuille 7 — Résoudre des problèmes";

const pgcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const PREMIERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const F = (a, b) => frac(a < 0 ? "−" + -a : a, b);                      // fraction affichée
const red = (a, b) => { const g = pgcd(a, b) || 1, s = b < 0 ? -1 : 1; return [s * a / g, s * b / g]; };
const Fr = (a, b) => { const [p, q] = red(a, b); return q === 1 ? (p < 0 ? "−" + -p : String(p)) : F(p, q); };
/* Vérifie une fraction (positive) et exige la forme irréductible */
function verifierIrr(v, a, b) {
  const [p, q] = red(a, b), r = verifierFraction(v, p, q);
  if (r.etat !== "juste") return r;
  const n = lireEntier(v.num), d = lireEntier(v.den);
  if (pgcd(n, d) !== 1) return { etat: "faux", message: "Le résultat est juste, mais la fraction n'est pas irréductible : simplifie-la." };
  return { etat: "juste" };
}
const ligneF = "[f]";

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "premier",
    titre: "Premier ou pas ?",
    description: "Exactement deux diviseurs.",
    generer() {
      const n = Math.random() < 0.5 ? choisir(PREMIERS.filter(p => p > 10)) : choisir([21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 99, 111, 119, 121, 133]);
      const p = PREMIERS.includes(n), d = !p && PREMIERS.find(x => n % x === 0);
      return { consigne: `Le nombre ${n} est-il premier ?`, choix: ["Oui", "Non"], verifier: choixVerif(p ? "Oui" : "Non"), indice: "Teste la divisibilité par 2, 3, 5, 7, 11…", correction: p ? `${n} est premier : ses seuls diviseurs sont 1 et ${n}.` : `${n} n'est pas premier : ${n} = ${d} × ${n / d}.` };
    }
  },

  {
    groupe: F1,
    id: "decomposer",
    titre: "Décomposer en facteurs premiers",
    description: "Trouver les exposants.",
    generer() {
      const e = [alea(0, 4), alea(0, 3), alea(0, 2)], e7 = Math.random() < 0.3 ? 1 : 0;
      if (e[0] + e[1] + e[2] < 2) e[0] += 2;
      const n = 2 ** e[0] * 3 ** e[1] * 5 ** e[2] * 7 ** e7;
      return {
        consigne: `Complète la décomposition de ${ecrireNombre(n)} en produit de facteurs premiers (un exposant peut valoir 0).`,
        ligne: `${ecrireNombre(n)} = 2<sup>[n]</sup> × 3<sup>[n]</sup> × 5<sup>[n]</sup> × 7<sup>[n]</sup>`,
        verifier: v => { const x = v.map(lireEntier); if (x.some(isNaN)) return { etat: "incomplet", message: "Remplis toutes les cases (0 si le facteur n'apparaît pas)." }; return x[0] === e[0] && x[1] === e[1] && x[2] === e[2] && x[3] === e7 ? { etat: "juste" } : { etat: "faux" }; },
        indice: "Divise successivement par 2 tant que c'est possible, puis par 3, par 5, par 7.",
        correction: `${ecrireNombre(n)} = 2<sup>${e[0]}</sup> × 3<sup>${e[1]}</sup> × 5<sup>${e[2]}</sup> × 7<sup>${e7}</sup>`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "simplifier",
    titre: "Rendre irréductible",
    description: "Simplifier une fraction.",
    generer() {
      let p, q; do { p = alea(1, 15); q = alea(2, 16); } while (pgcd(p, q) !== 1 || p === q);
      const k = choisir([2, 3, 4, 5, 6, 7, 9, 12, 14, 15]);
      return { consigne: `Écris ${F(p * k, q * k)} sous forme d'une fraction irréductible.`, ligne: `${F(p * k, q * k)} = ${ligneF}`, verifier: v => verifierIrr(v[0], p, q), indice: "Décompose le numérateur et le dénominateur, puis simplifie par les facteurs communs.", correction: `On divise par ${k} : ${F(p * k, q * k)} = ${F(p, q)}.` };
    }
  },

  {
    groupe: F2,
    id: "signe",
    titre: "Signe d'une fraction",
    description: "−a/b = a/(−b) = −(a/b).",
    generer() {
      const a = alea(1, 9), b = alea(2, 9), pos = Math.random() < 0.5;
      const ecr = pos ? frac("−" + a, "−" + b) : choisir([`${frac("−" + a, b)}`, `${frac(a, "−" + b)}`]);
      return { consigne: `La fraction ${ecr} est égale à…`, choix: [F(a, b), "−" + F(a, b)], verifier: choixVerif(pos ? F(a, b) : "−" + F(a, b)), indice: "Même règle des signes que pour la division.", correction: pos ? `Deux signes « − » : ${ecr} = ${F(a, b)}.` : `Un seul signe « − » : ${ecr} = −${F(a, b)}.` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "comparer",
    titre: "Comparer deux fractions",
    description: "Même dénominateur d'abord.",
    generer() {
      const d1 = choisir([3, 4, 5, 6, 8, 9, 10, 12]), m = choisir([2, 3, 4]), d2 = d1 * m, n1 = alea(1, d1 * 2), n2 = n1 * m + choisir([-1, 1, 0]);
      const s = n1 * m < n2 ? "<" : n1 * m > n2 ? ">" : "=";
      return { consigne: `Compare ${F(n1, d1)} et ${F(n2, d2)}.`, ligne: `${F(n1, d1)} [c] ${F(n2, d2)}`, choix: ["<", "=", ">"], verifier: (v, c) => ({ etat: c === s ? "juste" : "faux" }), indice: `Écris ${F(n1, d1)} avec le dénominateur ${d2}.`, correction: `${F(n1, d1)} = ${F(n1 * m, d2)}, donc ${F(n1, d1)} ${s} ${F(n2, d2)}.` };
    }
  },

  {
    groupe: F3,
    id: "additionner",
    titre: "Additionner, soustraire",
    description: "Résultat irréductible.",
    generer() {
      let a, b, c, d, plus, n, D;
      do {
        b = choisir([2, 3, 4, 5, 6, 8, 9, 10, 12]); d = choisir([2, 3, 4, 5, 6, 8, 9, 10, 12]); a = alea(1, b + 3); c = alea(1, d + 3);
        plus = Math.random() < 0.55; n = plus ? a * d + c * b : a * d - c * b; D = b * d;
      } while (b === d || n <= 0);
      const op = plus ? "+" : "−";
      return { consigne: `Calcule ${F(a, b)} ${op} ${F(c, d)} et donne le résultat sous forme irréductible.`, ligne: ligneF, verifier: v => verifierIrr(v[0], n, D), indice: "Écris les deux fractions avec un même dénominateur (un multiple commun de " + b + " et " + d + ").", correction: `${F(a, b)} ${op} ${F(c, d)} = ${F(a * d, D)} ${op} ${F(c * b, D)} = ${F(n, D)} = ${Fr(n, D)}` };
    }
  },

  {
    groupe: F3,
    id: "entier-fraction",
    titre: "Entier et fraction",
    description: "3 − 5/4 …",
    generer() {
      const e = alea(1, 4), b = choisir([2, 3, 4, 5, 6, 7]), a = alea(1, b * e - 1), plus = Math.random() < 0.5;
      const n = plus ? e * b + a : e * b - a;
      return { consigne: `Calcule ${e} ${plus ? "+" : "−"} ${F(a, b)} (fraction irréductible).`, ligne: ligneF, verifier: v => verifierIrr(v[0], n, b), indice: `Écris ${e} sous la forme ${F(e * b, b)}.`, correction: `${e} ${plus ? "+" : "−"} ${F(a, b)} = ${F(e * b, b)} ${plus ? "+" : "−"} ${F(a, b)} = ${Fr(n, b)}` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "multiplier",
    titre: "Multiplier deux fractions",
    description: "Simplifier avant de calculer.",
    generer() {
      const a = alea(1, 9), b = alea(2, 12), c = alea(1, 12), d = alea(2, 9);
      const neg = Math.random() < 0.3;
      return neg
        ? { consigne: `Quel est le signe de ${F(-a, b)} × ${F(c, -d)} ?`, choix: ["positif", "négatif"], verifier: choixVerif("positif"), indice: "Deux signes « − » : règle des signes.", correction: `Il y a deux signes « − » : le produit est positif et vaut ${Fr(a * c, b * d)}.` }
        : { consigne: `Calcule ${F(a, b)} × ${F(c, d)} (fraction irréductible).`, ligne: ligneF, verifier: v => verifierIrr(v[0], a * c, b * d), indice: "Numérateurs entre eux, dénominateurs entre eux, puis simplifie.", correction: `${F(a, b)} × ${F(c, d)} = ${F(a * c, b * d)} = ${Fr(a * c, b * d)}` };
    }
  },

  {
    groupe: F4,
    id: "fraction-quantite",
    titre: "Fraction d'une quantité",
    description: "Multiplier par la fraction.",
    generer() {
      const b = choisir([3, 4, 5, 6, 8, 10]), a = alea(1, b - 1), q = b * alea(2, 15);
      const [u, ctx] = choisir([["€", "d'une somme de"], ["élèves", "des élèves d'un collège de"], ["min", "d'une durée de"], ["km", "d'un trajet de"]]);
      return { consigne: `Calcule les ${F(a, b)} ${ctx} ${q} ${u}.`, ligne: `[d] ${u}`, verifier: v => verifierNombre(v[0], a * q / b), indice: `${F(a, b)} × ${q} : divise ${q} par ${b}, puis multiplie par ${a}.`, correction: `${F(a, b)} × ${q} = ${q} ÷ ${b} × ${a} = ${a * q / b} ${u}.` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "inverse",
    titre: "Inverse d'un nombre",
    description: "Produit égal à 1.",
    generer() {
      const [txt, p, q] = choisir([
        (() => { const n = alea(2, 12); return [String(n), 1, n]; })(),
        (() => { let a, b; do { a = alea(1, 9); b = alea(2, 9); } while (pgcd(a, b) !== 1 || a === b); return [F(a, b), b, a]; })(),
        (() => { const [d, f] = choisir([["0,5", [2, 1]], ["0,25", [4, 1]], ["0,2", [5, 1]], ["0,1", [10, 1]], ["1,5", [2, 3]], ["2,5", [2, 5]]]); return [d, f[0], f[1]]; })()
      ]);
      return { consigne: `Quel est l'inverse de ${txt} ? (Réponds par une fraction ; écris /1 pour un entier.)`, ligne: ligneF, verifier: v => verifierFraction(v[0], p, q), indice: "C'est le nombre qui, multiplié par lui, donne 1.", correction: `L'inverse de ${txt} est ${Fr(p, q)}.` };
    }
  },

  {
    groupe: F5,
    id: "diviser",
    titre: "Diviser par une fraction",
    description: "Multiplier par l'inverse.",
    generer() {
      const a = alea(1, 9), b = alea(2, 9), c = alea(1, 9), d = alea(2, 9);
      return { consigne: `Calcule ${F(a, b)} ÷ ${F(c, d)} (fraction irréductible).`, ligne: ligneF, verifier: v => verifierIrr(v[0], a * d, b * c), indice: `Diviser par ${F(c, d)}, c'est multiplier par ${F(d, c)}.`, correction: `${F(a, b)} ÷ ${F(c, d)} = ${F(a, b)} × ${F(d, c)} = ${F(a * d, b * c)} = ${Fr(a * d, b * c)}` };
    }
  },

  {
    groupe: F5,
    id: "oppose-inverse",
    titre: "Opposé ou inverse ?",
    description: "Ne pas confondre.",
    generer() {
      let a, b; do { a = alea(2, 9); b = alea(2, 9); } while (a === b);
      const inv = Math.random() < 0.5;
      const bonne = inv ? F(b, a) : "−" + F(a, b);
      return { consigne: `Quel est ${inv ? "l'inverse" : "l'opposé"} de ${F(a, b)} ?`, choix: melanger([F(b, a), "−" + F(a, b), "−" + F(b, a)]), verifier: choixVerif(bonne), indice: inv ? "Produit égal à 1." : "Somme égale à 0.", correction: `${inv ? "L'inverse" : "L'opposé"} de ${F(a, b)} est ${bonne}.` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "enchainer",
    titre: "Enchaîner les opérations",
    description: "Priorités avec des fractions.",
    generer() {
      const [ecr, n, d, det] = choisir([
        (() => { const b = choisir([2, 3, 4]), c = alea(1, 5), e = alea(2, 6); return [`${F(1, b)} + ${F(c, b)} × ${F(b, e)}`, e + c * b, b * e, `${F(1, b)} + ${F(c * b, b * e)}`]; })(),
        (() => { const a = alea(2, 5), b = a + alea(1, 4), k = alea(2, 5); return [`(${F(1, a)} − ${F(1, b)}) × ${k}`, (b - a) * k, a * b, `${F(b - a, a * b)} × ${k}`]; })(),
        (() => { const a = alea(1, 4), b = alea(5, 8), c = alea(1, 4), d = alea(2, 5); return [`${a} − ${F(c, d)} ÷ ${F(b, 2)}`, a * d * b - 2 * c, d * b, `${a} − ${F(c, d)} × ${F(2, b)}`]; })(),
        (() => { const a = alea(1, 5), b = alea(2, 6); return [`(1 + ${F(a, b)}) ÷ (1 − ${F(1, b + 1)})`, (b + a) * (b + 1), b * b, `${F(b + a, b)} ÷ ${F(b, b + 1)}`]; })()
      ]);
      if (n <= 0) return this.generer();
      return { consigne: `Calcule ${ecr} (fraction irréductible).`, ligne: ligneF, verifier: v => verifierIrr(v[0], n, d), indice: "Respecte les priorités : parenthèses, puis × et ÷, puis + et −.", correction: `${ecr} = ${det} = ${Fr(n, d)}` };
    }
  },

  /* ================= Feuille 7 ================= */
  {
    groupe: F7,
    id: "probleme",
    titre: "Problèmes",
    description: "Le reste, la fraction d'une fraction…",
    generer() {
      const [q, n, d, c] = choisir([
        (() => { const a = choisir([[1, 3], [1, 4], [2, 5], [1, 6]]), b = choisir([[1, 4], [1, 5], [1, 3]]); const N = a[1] * b[1] - a[0] * b[1] - b[0] * a[1], D = a[1] * b[1]; return [`Dans un jardin, ${F(...a)} de la surface est en légumes et ${F(...b)} en fleurs. Quelle fraction reste pour le gazon ?`, N, D, `1 − ${F(...a)} − ${F(...b)} = ${Fr(N, D)}`]; })(),
        (() => { const a = choisir([[3, 4], [2, 3], [3, 5]]), b = choisir([[1, 2], [2, 3], [1, 3]]); return [`Les ${F(...a)} des élèves mangent à la cantine ; parmi eux, ${F(...b)} sont des filles. Quelle fraction des élèves sont des filles qui mangent à la cantine ?`, a[0] * b[0], a[1] * b[1], `${F(...b)} × ${F(...a)} = ${Fr(a[0] * b[0], a[1] * b[1])}`]; })(),
        (() => { const a = choisir([[1, 3], [1, 4], [2, 5]]); const R = [a[1] - a[0], a[1]]; return [`Tom mange ${F(...a)} d'une tablette, puis Léa mange la moitié du reste. Quelle fraction de la tablette Léa a-t-elle mangée ?`, R[0], 2 * R[1], `Reste : ${F(...R)} ; Léa : ${F(1, 2)} × ${F(...R)} = ${Fr(R[0], 2 * R[1])}`]; })()
      ]);
      return { consigne: q + " (fraction irréductible)", ligne: ligneF, verifier: v => verifierIrr(v[0], n, d), indice: "« Le reste » : 1 − … ; « la fraction d'une fraction » : on multiplie.", correction: c };
    }
  },

  {
    groupe: F7,
    id: "combien-fois",
    titre: "Combien de fois ?",
    description: "Diviser par une fraction.",
    generer() {
      const [v, b] = choisir([[[3, 4], 6], [[1, 4], 3], [[3, 16], 3], [[2, 5], 4], [[1, 3], 5]]), N = b * v[1] / v[0];
      if (!Number.isInteger(N)) return this.generer();
      return { consigne: `Combien de verres de ${F(...v)} L peut-on remplir avec ${b} L de jus ?`, ligne: "[n] verres", verifier: x => verifierNombre(x[0], N), indice: `Calcule ${b} ÷ ${F(...v)}.`, correction: `${b} ÷ ${F(...v)} = ${b} × ${F(v[1], v[0])} = ${N} verres.` };
    }
  }
];

/* ---------- Le test « Je me teste » : 14 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "14 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Reconnaître un nombre premier", activites: ["premier"] },
    { competence: "Décomposer en facteurs premiers", activites: ["decomposer"] },
    { competence: "Rendre une fraction irréductible", activites: ["simplifier"] },
    { competence: "Signe d'une fraction", activites: ["signe"] },
    { competence: "Comparer deux fractions", activites: ["comparer"] },
    { competence: "Additionner, soustraire des fractions", activites: ["additionner"] },
    { competence: "Calculer avec un entier et une fraction", activites: ["entier-fraction"] },
    { competence: "Multiplier des fractions", activites: ["multiplier"] },
    { competence: "Fraction d'une quantité", activites: ["fraction-quantite"] },
    { competence: "Inverse d'un nombre", activites: ["inverse", "oppose-inverse"] },
    { competence: "Diviser par une fraction", activites: ["diviser"] },
    { competence: "Enchaîner les opérations", activites: ["enchainer"] },
    { competence: "Résoudre un problème", activites: ["probleme"] },
    { competence: "Combien de fois ?", activites: ["combien-fois"] }
  ]
};
