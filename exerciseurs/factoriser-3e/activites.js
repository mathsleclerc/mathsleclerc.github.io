/* =====================================================================
   EXERCISEUR « CALCUL LITTÉRAL : FACTORISER » — 3e, chapitre 7

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   Les expressions tapées sont lues par litteral.js ; une factorisation doit être un produit.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Facteur commun simple";
const F2 = "Feuille 2 — Une expression en facteur commun";
const F3 = "Feuille 3 — Factoriser avec a² − b²";
const F4 = "Feuille 4 — Développer ou factoriser ?";
const F5 = "Feuille 5 — Calculer astucieusement";
const F6 = "Feuille 6 — Démontrer, problèmes type brevet";
const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const nz = (a, b) => { let x = 0; while (x === 0) x = alea(a, b); return x; };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
/* Monôme a·l écrit proprement : 1x → x, −1x → −x */
const mono = (a, l = "x") => a === 0 ? "" : a === 1 ? l : a === -1 ? "−" + l : nb(a) + l;
/* Polynôme a x² + b x + c écrit proprement */
function poly(a, b, c) {
  const t = [[a, "x²"], [b, "x"], [c, ""]].filter(([k]) => k !== 0);
  if (!t.length) return "0";
  return t.map(([k, l], i) => {
    const s = l ? mono(Math.abs(k), l) : nb(Math.abs(k));
    return i === 0 ? (k < 0 ? "−" : "") + s : (k < 0 ? " − " : " + ") + s;
  }).join("");
}
const pa = s => "(" + s + ")";

function champ(placeholder = "ex. : 3x + 2") {
  return el("input", { class: "case", type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false",
    style: "width:min(13em,85vw);text-align:left", placeholder, "aria-label": "Ton expression" });
}
/* L'expression est-elle un produit (au premier niveau) ? */
function estProduit(t) {
  let s = String(t).replace(/\s/g, "").replace(/[−–]/g, "-");
  let avant; do { avant = s; s = s.replace(/\([^()]*\)/g, "P"); } while (s !== avant);
  return /\(/.test(t) && /^[+-]?[^+-]+$/.test(s);
}
/* Question où l'élève tape une expression. mode : "reduite" (au plus `termes` termes, sans parenthèses) ou "produit" */
function questionExpression({ consigne, attendu, lettres = ["x"], termes = null, mode = "reduite", indice, correction }) {
  const c = champ(mode === "produit" ? "ex. : 3(x + 2)" : "ex. : 3x² + 2x − 1");
  return {
    consigne, figure: c,
    verifier() {
      const t = c.value.trim();
      if (!t) return { etat: "incomplet", message: "Écris ton expression dans la case." };
      if (!lireExpression(t)) return { etat: "incomplet", message: "Ton expression est mal écrite : vérifie les signes et les parenthèses." };
      if (!equivalentes(t, attendu, lettres)) return { etat: "faux" };
      if (mode === "produit" && !estProduit(t)) return { etat: "faux", message: "Ton expression est égale, mais ce n'est pas un produit : il faut factoriser." };
      const n = nbTermes(t);
      if (mode === "reduite" && n === -1) return { etat: "faux", message: "Ton expression est juste, mais il reste des parenthèses : développe." };
      if (mode === "reduite" && termes !== null && n > termes) return { etat: "faux", message: "Ton expression est juste, mais elle n'est pas réduite." };
      return { etat: "juste" };
    },
    indice, correction,
    bloquer: () => { c.disabled = true; }
  };
}

/* forme attendue pour litteral.js */
const att = (a, b, c) => `(${a})*x^2+(${b})*x+(${c})`;
/* (p x + q) écrit proprement */
const lin = (p, q) => poly(0, p, q);
/* « + 3x » ou « − 3x » selon le signe de l'expression ajoutée */
const plus = t => t.startsWith("−") ? "− " + t.slice(1) : "+ " + t;

/* (p x + q) entre parenthèses, attendu litteral.js */
const P = (p, q) => `(${p}*x+(${q}))`;
const pgcd = (a, b) => b === 0 ? Math.abs(a) : pgcd(b, a % b);

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "fc-nombre",
    titre: "Un nombre en facteur commun",
    description: "ka + kb = k(a + b).",
    generer() {
      const k = alea(2, 9); let p, q; do { p = nz(-7, 7); q = nz(-9, 9); } while (pgcd(p, q) !== 1);
      return questionExpression({ consigne: `Factorise : ${lin(k * p, k * q)}`, attendu: att(0, k * p, k * q), mode: "produit", indice: `Les deux termes sont des multiples de ${k}.`, correction: `${k}(${lin(p, q)})` });
    }
  },

  {
    groupe: F1,
    id: "fc-lettre",
    titre: "x en facteur commun",
    description: "x² et x.",
    generer() {
      const k = choisir([1, 1, 2, 3, 5]); let p, q; do { p = alea(1, 6); q = nz(-9, 9); } while (pgcd(p, q) !== 1);
      return questionExpression({ consigne: `Factorise au maximum : ${poly(k * p, k * q, 0)}`, attendu: att(k * p, k * q, 0), mode: "produit", indice: k === 1 ? "x est un facteur commun aux deux termes." : `${k}x est un facteur commun aux deux termes.`, correction: `${mono(k)}(${lin(p, q)})` });
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "fc-expression",
    titre: "Une parenthèse en facteur commun",
    description: "(…)A + (…)B.",
    generer() {
      const a = nz(-6, 6), b = choisir([1, 2, 3]), c = nz(-6, 6), d = choisir([1, 2]), e = nz(-6, 6), moins = Math.random() < 0.4;
      const s2 = moins ? -1 : 1, p = b + s2 * d, q = c + s2 * e;
      if (p === 0) return this.generer();
      const F = `(x ${a < 0 ? "−" : "+"} ${Math.abs(a)})`;
      return questionExpression({ consigne: `Factorise : ${F}(${lin(b, c)}) ${moins ? "−" : "+"} ${F}(${lin(d, e)})`, attendu: `(x+(${a}))*${P(p, q)}`, mode: "produit", indice: `${F} est un facteur commun.${moins ? " Attention au signe − devant la deuxième parenthèse." : ""}`, correction: `${F}[(${lin(b, c)}) ${moins ? "−" : "+"} (${lin(d, e)})] = ${F}(${lin(p, q)})` });
    }
  },

  {
    groupe: F2,
    id: "fc-cache",
    titre: "Le facteur 1 caché",
    description: "(…)(…) + (…).",
    generer() {
      const a = nz(-6, 6), b = choisir([1, 2, 3]), c = nz(-6, 6), moins = Math.random() < 0.5, q = c + (moins ? -1 : 1);
      const F = `(${lin(b, a)})`;
      return questionExpression({ consigne: `Factorise : ${F}(x ${c < 0 ? "−" : "+"} ${Math.abs(c)}) ${moins ? "−" : "+"} ${F}`, attendu: `${P(b, a)}*(x+(${q}))`, mode: "produit", indice: `${F} = ${F} × 1.`, correction: `${F}(x ${c < 0 ? "−" : "+"} ${Math.abs(c)} ${moins ? "−" : "+"} 1) = ${F}(${lin(1, q)})` });
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "diff-carres",
    titre: "a² − b²",
    description: "Différence de deux carrés.",
    generer() {
      const a = choisir([1, 1, 2, 3, 4, 5]), b = alea(1, 10);
      return questionExpression({ consigne: `Factorise : ${poly(a * a, 0, -b * b)}`, attendu: att(a * a, 0, -b * b), mode: "produit", indice: `C'est ${a === 1 ? "x" : "(" + a + "x)"}² − ${b}².`, correction: `(${lin(a, -b)})(${lin(a, b)})` });
    }
  },

  {
    groupe: F3,
    id: "diff-carres-2",
    titre: "(x + a)² − b²",
    description: "Avec une parenthèse.",
    generer() {
      const a = nz(-6, 6), b = alea(1, 9);
      return questionExpression({ consigne: `Factorise puis réduis chaque facteur : (x ${a < 0 ? "−" : "+"} ${Math.abs(a)})² − ${b * b}`, attendu: `(x+(${a})-${b})*(x+(${a})+${b})`, mode: "produit", indice: `${b * b} = ${b}² : utilise a² − b² = (a − b)(a + b) avec a = x ${a < 0 ? "−" : "+"} ${Math.abs(a)}.`, correction: `(${lin(1, a - b)})(${lin(1, a + b)})` });
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "nature",
    titre: "Développée ou factorisée ?",
    description: "Somme ou produit.",
    generer() {
      const [e, r] = choisir([["(x + 3)(x − 2)", "factorisée"], ["x² + x − 6", "développée"], ["3x(x − 4)", "factorisée"], ["(x + 1)² − 9", "ni l'une ni l'autre"], ["x² − 9", "développée"], ["(2x − 1)²", "factorisée"], ["(x + 2)(x − 1) + 4", "ni l'une ni l'autre"], ["5x² − 2x", "développée"]]);
      return { consigne: `L'expression ${e} est-elle sous forme développée (somme de termes simples), factorisée (produit) ou ni l'une ni l'autre ?`, choix: ["développée", "factorisée", "ni l'une ni l'autre"], verifier: choixVerif(r), indice: "Regarde la dernière opération à effectuer.", correction: `${e} est ${r === "ni l'une ni l'autre" ? "une somme dont un terme est un produit ou un carré : ni l'une ni l'autre" : "sous forme " + r}.` };
    }
  },

  {
    groupe: F4,
    id: "bonne-forme",
    titre: "Choisir la bonne forme",
    description: "Calculer astucieusement une valeur.",
    generer() {
      const a = alea(1, 6), b = alea(1, 6), x = choisir([a + b, a - b, 0, a]);
      const val = (x - a) ** 2 - b * b;
      return { consigne: `D = (x − ${a})² − ${b * b} = (x − ${a + b})(x ${a - b < 0 ? "+" : "−"} ${Math.abs(a - b)}) = x² − ${2 * a}x ${a * a - b * b < 0 ? "−" : "+"} ${Math.abs(a * a - b * b)}. Calcule D pour x = ${nb(x)}.`, ligne: "D = [d]", verifier: v => verifierNombre(v[0], val), indice: x === 0 ? "Utilise la forme développée." : x === a ? "Utilise la première forme." : "Utilise la forme factorisée : un facteur est nul.", correction: `D = ${nb(val)}` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "astuce",
    titre: "Calcul astucieux",
    description: "Facteur commun ou a² − b².",
    generer() {
      const t = alea(1, 2);
      if (t === 1) { const k = alea(12, 89), a = alea(11, 89), b = 100 - a; return { consigne: `Calcule astucieusement ${k} × ${a} + ${k} × ${b}.`, ligne: "[n]", verifier: v => verifierNombre(v[0], 100 * k), indice: `${k} est un facteur commun.`, correction: `${k} × (${a} + ${b}) = ${k} × 100 = ${nb(100 * k)}` }; }
      const m = choisir([50, 60, 70, 80, 100]), d = alea(1, 9);
      return { consigne: `Calcule astucieusement ${m + d}² − ${m - d}².`, ligne: "[n]", verifier: v => verifierNombre(v[0], (m + d) ** 2 - (m - d) ** 2), indice: "a² − b² = (a − b)(a + b).", correction: `(${m + d} − ${m - d})(${m + d} + ${m - d}) = ${2 * d} × ${2 * m} = ${nb(4 * m * d)}` };
    }
  },

  {
    groupe: F5,
    id: "carre",
    titre: "Reconnaître un carré",
    description: "a² ± 2ab + b².",
    generer() {
      const a = choisir([1, 1, 2, 3]), b = nz(-6, 6);
      return questionExpression({ consigne: `Factorise sous la forme d'un carré : ${poly(a * a, 2 * a * b, b * b)}`, attendu: att(a * a, 2 * a * b, b * b), mode: "produit", indice: "Reconnais a² + 2ab + b² = (a + b)² ou a² − 2ab + b² = (a − b)².", correction: `(${lin(a, b)})²` });
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "demontrer",
    titre: "Démontrer",
    description: "Multiples et identités.",
    generer() {
      const [e, bonne, autres] = choisir([
        ["(n + 1)² − (n − 1)²", "4n, donc un multiple de 4", ["2, donc toujours pair", "2n², donc un carré", "0"]],
        ["(2n + 1)² − (2n − 1)²", "8n, donc un multiple de 8", ["2, donc toujours pair", "4n², donc un carré", "4n + 2"]],
        ["(n − 1)(n + 1)", "n² − 1", ["n² + 1", "n² − 2n − 1", "2n"]],
        ["n² + 2n + 1", "(n + 1)², donc un carré parfait", ["(n + 2)n", "(n − 1)²", "2(n + 1)"]]
      ]);
      return { consigne: `Pour tout entier n, l'expression ${e} est égale à…`, choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne), indice: "Factorise avec a² − b² ou développe, puis simplifie.", correction: `${e} = ${bonne}.` };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Un nombre en facteur commun", activites: ["fc-nombre"] },
    { competence: "x en facteur commun", activites: ["fc-lettre"] },
    { competence: "Une parenthèse en facteur commun", activites: ["fc-expression"] },
    { competence: "Le facteur 1 caché", activites: ["fc-cache"] },
    { competence: "Factoriser a² − b²", activites: ["diff-carres"] },
    { competence: "Factoriser (x + a)² − b²", activites: ["diff-carres-2"] },
    { competence: "Développée ou factorisée ?", activites: ["nature"] },
    { competence: "Choisir la bonne forme", activites: ["bonne-forme"] },
    { competence: "Calcul astucieux", activites: ["astuce"] },
    { competence: "Reconnaître un carré", activites: ["carre"] },
    { competence: "Démontrer", activites: ["demontrer"] },
    { competence: "Factoriser a² − b²", activites: ["diff-carres", "diff-carres-2"] }
  ]
};
