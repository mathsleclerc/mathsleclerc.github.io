/* =====================================================================
   EXERCISEUR « CALCUL LITTÉRAL » — 4e, chapitre 5

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   Les expressions tapées par l'élève sont lues par litteral.js (3x + 2, x², 2(x + 1)…).
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Expressions littérales";
const F2 = "Feuille 2 — Réduire une expression";
const F3 = "Feuille 3 — Développer";
const F4 = "Feuille 4 — Factoriser";
const F5 = "Feuille 5 — La double distributivité";
const F6 = "Feuille 6 — Démontrer avec le calcul littéral";

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

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "valeur",
    titre: "Valeur d'une expression",
    description: "Remplacer x par un nombre.",
    generer() {
      const x = nz(-5, 6), a = nz(-4, 5), b = nz(-6, 6), c = alea(-9, 9);
      const [e, f] = choisir([
        [poly(a, b, c), t => a * t * t + b * t + c],
        [`${a}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)})`, t => a * (t + b)],
        [`(x ${b < 0 ? "−" : "+"} ${Math.abs(b)})(x ${c < 0 ? "−" : "+"} ${Math.abs(c) || 1})`, t => (t + b) * (t + (c || 1) * (c < 0 ? 1 : 1))]
      ]);
      const r = f(x);
      return { consigne: `Calcule ${e.replace("1(", "(")} pour x = ${nb(x)}.`, ligne: "[r]", verifier: v => verifierNombre(v[0], rr(r)), indice: `Remplace x par ${x < 0 ? "(" + nb(x) + ")" : nb(x)} et respecte les priorités.`, correction: `On obtient ${nb(r)}.` };
    }
  },

  {
    groupe: F1,
    id: "tester",
    titre: "Tester une égalité",
    description: "Le nombre est-il solution ?",
    generer() {
      const x = alea(-3, 6), a = alea(2, 6), c = alea(1, 4), d = alea(-6, 9), oui = Math.random() < 0.5;
      const b = oui ? (c - a) * x + d : (c - a) * x + d + choisir([-2, -1, 1, 2]);
      const g = poly(0, a, b), dr = poly(0, c, d);
      return { consigne: `${nb(x)} est-il solution de l'équation ${g} = ${dr} ?`, choix: ["Oui", "Non"], verifier: choixVerif(oui ? "Oui" : "Non"), indice: "Calcule séparément les deux membres en remplaçant x, puis compare.", correction: `Membre de gauche : ${nb(a * x + b)} ; membre de droite : ${nb(c * x + d)} : ${oui ? "égaux, donc oui." : "différents, donc non."}` };
    }
  },

  {
    groupe: F1,
    id: "nature",
    titre: "Somme ou produit ?",
    description: "La dernière opération.",
    generer() {
      const [e, r] = choisir([["3x + 12", "une somme"], ["3(x + 4)", "un produit"], ["x² − 5x", "une différence"], ["(2x − 1)(x + 3)", "un produit"], ["4 + 2(x − 7)", "une somme"], ["5x × (x + 1)", "un produit"], ["(x + 1)² − 4", "une différence"], ["x(x − 2)", "un produit"]]);
      return { consigne: `L'expression ${e} est…`, choix: ["une somme", "une différence", "un produit"], verifier: choixVerif(r), indice: "Cherche la dernière opération à effectuer.", correction: `C'est ${r}.` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "reduire",
    titre: "Réduire une somme",
    description: "Regrouper les termes semblables.",
    generer() {
      const a = alea(-3, 4), b = nz(-7, 8), c = alea(-9, 9), a2 = alea(-3, 3), b2 = nz(-6, 6), c2 = nz(-9, 9);
      const termes = melanger([[a, "x²"], [b, "x"], [c, ""], [a2, "x²"], [b2, "x"], [c2, ""]].filter(([k]) => k !== 0));
      const ecr = termes.map(([k, l], i) => { const s = l ? mono(Math.abs(k), l) : nb(Math.abs(k)); return i === 0 ? (k < 0 ? "−" : "") + s : (k < 0 ? " − " : " + ") + s; }).join("");
      const A = a + a2, B = b + b2, C = c + c2, att = `${A}*x^2 + ${B}*x + ${C}`;
      return questionExpression({ consigne: `Réduis : ${ecr}`, attendu: att, termes: [A, B, C].filter(k => k !== 0).length || 1, indice: "Regroupe les termes en x², puis les termes en x, puis les nombres.", correction: `${ecr} = ${poly(A, B, C)}` });
    }
  },

  {
    groupe: F2,
    id: "produit",
    titre: "Réduire un produit",
    description: "3x × 2x = 6x².",
    generer() {
      const a = nz(-6, 7), b = nz(-6, 7), [l1, l2, res, att] = choisir([["x", "", "x", "x"], ["x", "x", "x²", "x^2"], ["x²", "x", "x³", "x^3"], ["x", "y", "xy", "x*y"]]);
      const ecr = `${mono(a, l1) || nb(a)} × ${b < 0 ? "(" : ""}${l2 ? mono(b, l2) : nb(b)}${b < 0 ? ")" : ""}`;
      return questionExpression({ consigne: `Réduis : ${ecr}`, attendu: `${a * b}*${att}`, lettres: ["x", "y"], termes: 1, indice: "Multiplie les nombres entre eux, puis les lettres entre elles.", correction: `${ecr} = ${mono(a * b, res)}` });
    }
  },

  {
    groupe: F2,
    id: "parentheses",
    titre: "Supprimer des parenthèses",
    description: "Précédées d'un signe −.",
    generer() {
      const a = nz(-9, 9), b = nz(-5, 6), c = nz(-9, 9), k = alea(1, 9);
      const ecr = `${k} − (${poly(0, b, c)})${a > 0 ? " + " : " − "}${mono(Math.abs(a))}`;
      const B = -b + a, C = k - c;
      return questionExpression({ consigne: `Supprime les parenthèses, puis réduis : ${ecr}`, attendu: `${B}*x + ${C}`, termes: [B, C].filter(t => t !== 0).length || 1, indice: "Une parenthèse précédée de « − » : on change le signe de chaque terme.", correction: `${ecr} = ${k} ${poly(0, -b, -c).replace(/^−/, "− ").replace(/^(?=\d|x)/, "+ ")}${a > 0 ? " + " : " − "}${mono(Math.abs(a))} = ${poly(0, B, C)}` });
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "developper",
    titre: "Développer",
    description: "k(a + b) = ka + kb.",
    generer() {
      const k = nz(-7, 8), a = nz(-6, 7), b = nz(-9, 9), lx = Math.random() < 0.3;
      const K = lx ? mono(k) : nb(k), ecr = `${K}(${poly(0, a, b)})`;
      const att = lx ? `${k * a}*x^2 + ${k * b}*x` : `${k * a}*x + ${k * b}`;
      return questionExpression({ consigne: `Développe et réduis : ${ecr}`, attendu: att, termes: 2, indice: `Multiplie ${K} par chaque terme de la parenthèse ; attention aux signes.`, correction: `${ecr} = ${lx ? poly(k * a, k * b, 0) : poly(0, k * a, k * b)}` });
    }
  },

  {
    groupe: F3,
    id: "developper-reduire",
    titre: "Développer et réduire",
    description: "Deux produits, puis on réduit.",
    generer() {
      const k1 = nz(-6, 7), a = nz(-4, 5), b = nz(-8, 8), k2 = nz(-6, 6), c = nz(-4, 5), d = nz(-8, 8);
      const ecr = `${nb(k1)}(${poly(0, a, b)}) ${k2 < 0 ? "−" : "+"} ${Math.abs(k2) === 1 ? "" : nb(Math.abs(k2))}(${poly(0, c, d)})`;
      const B = k1 * a + k2 * c, C = k1 * b + k2 * d;
      return questionExpression({ consigne: `Développe et réduis : ${ecr}`, attendu: `${B}*x + ${C}`, termes: [B, C].filter(t => t !== 0).length || 1, indice: "Développe chaque produit (attention au signe devant le deuxième), puis regroupe.", correction: `${ecr} = ${poly(0, k1 * a, k1 * b)} ${poly(0, k2 * c, k2 * d).replace(/^−/, "− ").replace(/^(?=[^−])/, "+ ")} = ${poly(0, B, C)}` });
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "factoriser",
    titre: "Factoriser",
    description: "Trouver le facteur commun.",
    generer() {
      const type = choisir(["nombre", "nombre", "x", "kx"]);
      let a, b, k, ecr, att, corr;
      if (type === "nombre") { k = alea(2, 9); do { a = nz(-5, 6); b = nz(-9, 9); } while (Math.abs(a) === 1 && Math.abs(b) === 1 || [a, b].every(t => t % 2 === 0) || [a, b].every(t => t % 3 === 0)); ecr = poly(0, k * a, k * b); att = `${k}*(${a}*x + ${b})`; corr = `${nb(k)}(${poly(0, a, b)})`; }
      else if (type === "x") { b = nz(-9, 9); ecr = poly(1, b, 0); att = `x*(x + ${b})`; corr = `x(${poly(0, 1, b)})`; }
      else { k = alea(2, 6); b = nz(-7, 7); a = alea(1, 3); ecr = poly(k * a, k * b, 0); att = `${k}*x*(${a}*x + ${b})`; corr = `${mono(k)}(${poly(0, a, b)})`; }
      return questionExpression({ consigne: `Factorise : ${ecr}`, attendu: att, mode: "produit", indice: "Écris chaque terme comme un produit faisant apparaître le même facteur, puis mets ce facteur devant une parenthèse.", correction: `${ecr} = ${corr}` });
    }
  },

  {
    groupe: F4,
    id: "dev-ou-fact",
    titre: "Développer ou factoriser ?",
    description: "Reconnaître la transformation.",
    generer() {
      const [e, r] = choisir([["2(x + 7) = 2x + 14", "développer"], ["9x − 6 = 3(3x − 2)", "factoriser"], ["x² + x = x(x + 1)", "factoriser"], ["−(x − 3) = −x + 3", "développer"], ["(x + 1)(x + 2) = x² + 3x + 2", "développer"], ["5x + 5 = 5(x + 1)", "factoriser"]]);
      return { consigne: `Dans l'égalité ${e}, on est passé de gauche à droite en…`, choix: ["développant", "factorisant"], verifier: choixVerif(r === "développer" ? "développant" : "factorisant"), indice: "Développer : produit → somme. Factoriser : somme → produit.", correction: `On a ${r === "développer" ? "développé (produit → somme)" : "factorisé (somme → produit)"}.` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "double",
    titre: "Double distributivité",
    description: "(a + b)(c + d).",
    generer() {
      const a = choisir([1, 1, 2, 3]), b = nz(-7, 7), c = choisir([1, 1, 2]), d = nz(-7, 7);
      const ecr = `(${poly(0, a, b)})(${poly(0, c, d)})`;
      return questionExpression({ consigne: `Développe et réduis : ${ecr}`, attendu: `${a * c}*x^2 + ${a * d + b * c}*x + ${b * d}`, termes: [a * c, a * d + b * c, b * d].filter(t => t !== 0).length, indice: "Multiplie chaque terme de la première parenthèse par chaque terme de la seconde, puis réduis.", correction: `${ecr} = ${mono(a * c, "x²")} ${poly(0, a * d, 0).replace(/^(?!−)/, "+ ").replace(/^−/, "− ")} ${poly(0, b * c, 0).replace(/^(?!−)/, "+ ").replace(/^−/, "− ")} ${b * d < 0 ? "− " + nb(-b * d) : "+ " + nb(b * d)} = ${poly(a * c, a * d + b * c, b * d)}` });
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "programme",
    titre: "Programme de calcul",
    description: "Écrire l'expression en fonction de x.",
    generer() {
      const a = alea(2, 6), b = alea(1, 9);
      const [t, att, corr] = choisir([
        [`Choisir un nombre x ; le multiplier par ${a} ; ajouter ${b}.`, `${a}*x + ${b}`, `${a}x + ${b}`],
        [`Choisir un nombre x ; lui ajouter ${b} ; multiplier le résultat par ${a}.`, `${a}*(x + ${b})`, `${a}(x + ${b}) = ${a}x + ${a * b}`],
        [`Choisir un nombre x ; lui ajouter ${b} ; multiplier le résultat par le nombre de départ.`, `(x + ${b})*x`, `(x + ${b}) × x = x² + ${b}x`],
        [`Choisir un nombre x ; ajouter ${b} ; multiplier par 2 ; soustraire ${2 * b}.`, `2*x`, `2(x + ${b}) − ${2 * b} = 2x`]
      ]);
      const c = champ("ex. : 3(x + 2)");
      return { consigne: `<em>${t}</em> Écris le résultat en fonction de x.`, figure: c,
        verifier() { const s = c.value.trim(); if (!s) return { etat: "incomplet", message: "Écris ton expression." }; if (!lireExpression(s)) return { etat: "incomplet", message: "Expression mal écrite." }; return { etat: equivalentes(s, att) ? "juste" : "faux" }; },
        indice: "Applique chaque étape à la lettre x, avec des parenthèses si besoin.", correction: corr, bloquer: () => { c.disabled = true; } };
    }
  },

  {
    groupe: F6,
    id: "preuve",
    titre: "Vrai pour tout nombre ?",
    description: "Preuve ou contre-exemple.",
    generer() {
      const [aff, vrai, expl] = choisir([
        ["La somme de trois entiers consécutifs est un multiple de 3.", true, "n + (n + 1) + (n + 2) = 3(n + 1)."],
        ["La somme de deux nombres impairs est paire.", true, "(2n + 1) + (2m + 1) = 2(n + m + 1)."],
        ["(a + b)² = a² + b² pour tous les nombres a et b.", false, "contre-exemple : a = b = 1 donne 4 et 2."],
        ["Le carré d'un nombre est toujours plus grand que ce nombre.", false, "contre-exemple : 0,5² = 0,25 < 0,5."],
        ["Pour tout x, 3(x + 2) − 2(x + 3) = x.", true, "3x + 6 − 2x − 6 = x."],
        ["Pour tout x, 2x + 3 > 3.", false, "contre-exemple : x = −1 donne 1."],
        ["Le produit de deux nombres pairs est un multiple de 4.", true, "2n × 2m = 4nm."],
        ["Si n est impair, n² + 1 est impair.", false, "contre-exemple : n = 3 donne 10."]
      ]);
      return { consigne: `« ${aff} »`, choix: ["Toujours vrai", "Faux"], verifier: choixVerif(vrai ? "Toujours vrai" : "Faux"), indice: "Teste quelques exemples, puis essaie de prouver avec des lettres.", correction: `${vrai ? "Toujours vrai" : "Faux"} : ${expl}` };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Calculer la valeur d'une expression", activites: ["valeur"] },
    { competence: "Tester une égalité", activites: ["tester"] },
    { competence: "Reconnaître une somme ou un produit", activites: ["nature"] },
    { competence: "Réduire une somme", activites: ["reduire"] },
    { competence: "Réduire un produit", activites: ["produit"] },
    { competence: "Supprimer des parenthèses", activites: ["parentheses"] },
    { competence: "Développer", activites: ["developper"] },
    { competence: "Développer et réduire", activites: ["developper-reduire"] },
    { competence: "Factoriser", activites: ["factoriser"] },
    { competence: "Double distributivité", activites: ["double"] },
    { competence: "Traduire un programme de calcul", activites: ["programme"] },
    { competence: "Démontrer ou réfuter", activites: ["preuve"] }
  ]
};
