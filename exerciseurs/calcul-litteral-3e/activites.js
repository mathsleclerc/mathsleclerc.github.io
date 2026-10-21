/* =====================================================================
   EXERCISEUR « CALCUL LITTÉRAL : DÉVELOPPER » — 3e, chapitre 2

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   Les expressions tapées par l'élève sont lues par litteral.js (3x + 2, x², (x + 1)²…).
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Expressions, valeurs et réductions";
const F2 = "Feuille 2 — Distributivité simple";
const F3 = "Feuille 3 — Double distributivité";
const F4 = "Feuille 4 — Identités remarquables";
const F5 = "Feuille 5 — Programmes de calcul";
const F6 = "Feuille 6 — Démontrer et utiliser un tableur";
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

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "valeur",
    titre: "Valeur d'une expression",
    description: "Remplacer x par un nombre.",
    generer() {
      const a = nz(-4, 4), b = nz(-9, 9), c = alea(-9, 9), x = nz(-4, 5), v = a * x * x + b * x + c;
      return { consigne: `Calcule A = ${poly(a, b, c)} pour x = ${nb(x)}.`, ligne: "A = [d]", verifier: v2 => verifierNombre(v2[0], v), indice: x < 0 ? `Remplace x par (${nb(x)}) : attention, (${nb(x)})² est positif.` : "Remplace x par sa valeur et respecte les priorités (le carré d'abord).", correction: `A = ${nb(a)} × ${x < 0 ? "(" + nb(x) + ")" : nb(x)}² ${b < 0 ? "−" : "+"} ${nb(Math.abs(b))} × ${x < 0 ? "(" + nb(x) + ")" : nb(x)} ${c < 0 ? "−" : "+"} ${nb(Math.abs(c))} = ${nb(v)}` };
    }
  },

  {
    groupe: F1,
    id: "reduire",
    titre: "Réduire",
    description: "Regrouper les termes semblables.",
    generer() {
      const a1 = nz(-6, 6), a2 = nz(-6, 6), b1 = nz(-9, 9), b2 = nz(-9, 9), c1 = nz(-9, 9), c2 = nz(-9, 9);
      return questionExpression({ consigne: `Réduis : ${poly(a1, b1, c1)} ${poly(a2, b2, c2).startsWith("−") ? "− " + poly(a2, b2, c2).slice(1) : "+ " + poly(a2, b2, c2)}`, attendu: att(a1 + a2, b1 + b2, c1 + c2), termes: 3, indice: "Regroupe les termes en x², puis les termes en x, puis les nombres.", correction: poly(a1 + a2, b1 + b2, c1 + c2) });
    }
  },

  {
    groupe: F1,
    id: "parentheses",
    titre: "Supprimer des parenthèses",
    description: "Attention au signe − devant.",
    generer() {
      const k = alea(1, 9), p = nz(-6, 6), q = nz(-9, 9), r = nz(-6, 6), s = nz(-9, 9);
      return questionExpression({ consigne: `Réduis : ${k} − (${lin(p, q)}) + (${lin(r, s)})`, attendu: att(0, -p + r, k - q + s), termes: 2, indice: "Un signe − devant une parenthèse change tous les signes à l'intérieur.", correction: `${k} ${p > 0 ? "−" : "+"} ${mono(Math.abs(p))} ${q > 0 ? "−" : "+"} ${Math.abs(q)} ${r > 0 ? "+" : "−"} ${mono(Math.abs(r))} ${s > 0 ? "+" : "−"} ${Math.abs(s)} = ${lin(r - p, k - q + s)}` });
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "dev-simple",
    titre: "Développer k(a + b)",
    description: "Distributivité simple.",
    generer() {
      const kx = Math.random() < 0.4, k = nz(-6, 6), p = nz(-7, 7), q = nz(-9, 9);
      const kk = kx ? mono(k) : nb(k);
      const A = kx ? att(k * p, k * q, 0) : att(0, k * p, k * q);
      return questionExpression({ consigne: `Développe et réduis : ${kk}(${lin(p, q)})`, attendu: A, termes: 2, indice: `Multiplie ${kk} par chacun des deux termes de la parenthèse.`, correction: kx ? poly(k * p, k * q, 0) : lin(k * p, k * q) });
    }
  },

  {
    groupe: F2,
    id: "dev-somme",
    titre: "Développer et réduire",
    description: "Deux produits à développer.",
    generer() {
      const k1 = nz(-5, 5), p1 = nz(-6, 6), q1 = nz(-9, 9), k2 = nz(-5, 5), p2 = nz(-6, 6), q2 = nz(-9, 9);
      return questionExpression({ consigne: `Développe et réduis : ${nb(k1)}(${lin(p1, q1)}) ${k2 < 0 ? "−" : "+"} ${nb(Math.abs(k2))}(${lin(p2, q2)})`, attendu: att(0, k1 * p1 + k2 * p2, k1 * q1 + k2 * q2), termes: 2, indice: "Développe chaque produit séparément, puis réduis.", correction: `${lin(k1 * p1, k1 * q1)} ${k2 < 0 ? "− (" + lin(-k2 * p2, -k2 * q2) + ")" : plus(lin(k2 * p2, k2 * q2))} = ${lin(k1 * p1 + k2 * p2, k1 * q1 + k2 * q2)}` });
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "double",
    titre: "Double distributivité",
    description: "(ax + b)(cx + d).",
    generer() {
      const a = choisir([1, 1, 2, 3, -1]), b = nz(-9, 9), c = choisir([1, 1, 2, 3]), d = nz(-9, 9);
      return questionExpression({ consigne: `Développe et réduis : (${lin(a, b)})(${lin(c, d)})`, attendu: att(a * c, a * d + b * c, b * d), termes: 3, indice: "Multiplie chaque terme de la première parenthèse par chaque terme de la seconde (4 produits), puis réduis.", correction: `${poly(a * c, 0, 0)} ${a * d < 0 ? "−" : "+"} ${mono(Math.abs(a * d))} ${b * c < 0 ? "−" : "+"} ${mono(Math.abs(b * c))} ${b * d < 0 ? "−" : "+"} ${Math.abs(b * d)} = ${poly(a * c, a * d + b * c, b * d)}` });
    }
  },

  {
    groupe: F3,
    id: "double-plus",
    titre: "Double distributivité et réduction",
    description: "Un produit puis un autre terme.",
    generer() {
      const b = nz(-6, 6), d = nz(-6, 6), k = nz(-4, 4), e = nz(-5, 5);
      return questionExpression({ consigne: `Développe et réduis : (x ${b < 0 ? "−" : "+"} ${Math.abs(b)})(x ${d < 0 ? "−" : "+"} ${Math.abs(d)}) ${k < 0 ? "−" : "+"} ${mono(Math.abs(k))}(x ${e < 0 ? "−" : "+"} ${Math.abs(e)})`, attendu: att(1 + k, b + d + k * e, b * d), termes: 3, indice: "Développe les deux produits, puis regroupe les termes semblables.", correction: `${poly(1, b + d, b * d)} ${k < 0 ? "− (" + poly(-k, -k * e, 0) + ")" : plus(poly(k, k * e, 0))} = ${poly(1 + k, b + d + k * e, b * d)}` });
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "carre-somme",
    titre: "(a + b)² et (a − b)²",
    description: "Carré d'une somme ou d'une différence.",
    generer() {
      const a = choisir([1, 1, 2, 3, 4, 5]), b = nz(-9, 9);
      return questionExpression({ consigne: `Développe : (${lin(a, b)})²`, attendu: att(a * a, 2 * a * b, b * b), termes: 3, indice: b > 0 ? "(a + b)² = a² + 2ab + b² : n'oublie pas le double produit." : "(a − b)² = a² − 2ab + b² : n'oublie pas le double produit.", correction: `${a === 1 ? "x²" : "(" + a + "x)²"} ${b < 0 ? "−" : "+"} 2 × ${mono(a)} × ${Math.abs(b)} + ${Math.abs(b)}² = ${poly(a * a, 2 * a * b, b * b)}` });
    }
  },

  {
    groupe: F4,
    id: "diff-carres",
    titre: "(a + b)(a − b)",
    description: "Différence de deux carrés.",
    generer() {
      const a = choisir([1, 1, 2, 3, 4, 5]), b = alea(1, 9), inv = Math.random() < 0.5;
      return questionExpression({ consigne: `Développe : ${inv ? `(${lin(a, -b)})(${lin(a, b)})` : `(${lin(a, b)})(${lin(a, -b)})`}`, attendu: att(a * a, 0, -b * b), termes: 2, indice: "(a + b)(a − b) = a² − b².", correction: `${a === 1 ? "x²" : "(" + a + "x)²"} − ${b}² = ${poly(a * a, 0, -b * b)}` });
    }
  },

  {
    groupe: F4,
    id: "mental",
    titre: "Calcul mental",
    description: "Avec une identité remarquable.",
    generer() {
      const t = alea(1, 3), r = choisir([20, 30, 40, 50, 60, 70, 80, 100]), e = alea(1, 3);
      const [q, v, c] = t === 1 ? [`${r + e}²`, (r + e) ** 2, `(${r} + ${e})² = ${nb(r * r)} + ${2 * r * e} + ${e * e} = ${nb((r + e) ** 2)}`] : t === 2 ? [`${r - e}²`, (r - e) ** 2, `(${r} − ${e})² = ${nb(r * r)} − ${2 * r * e} + ${e * e} = ${nb((r - e) ** 2)}`] : [`${r - e} × ${r + e}`, r * r - e * e, `(${r} − ${e})(${r} + ${e}) = ${nb(r * r)} − ${e * e} = ${nb(r * r - e * e)}`];
      return { consigne: `Calcule mentalement ${q} à l'aide d'une identité remarquable.`, ligne: "[d]", verifier: v2 => verifierNombre(v2[0], v), indice: `Pense à ${r}, un nombre rond.`, correction: c };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "programme",
    titre: "Programme de calcul",
    description: "Exprimer le résultat en fonction de x.",
    generer() {
      const a = alea(1, 6), t = alea(1, 2);
      if (t === 1) return questionExpression({ consigne: `Programme : choisir un nombre x, lui ajouter ${a}, élever le résultat au carré, puis soustraire le carré du nombre de départ. Écris le résultat en fonction de x sous forme réduite.`, attendu: att(0, 2 * a, a * a), termes: 2, indice: `Le résultat est (x + ${a})² − x² : développe et réduis.`, correction: `(x + ${a})² − x² = x² + ${2 * a}x + ${a * a} − x² = ${lin(2 * a, a * a)}` });
      const b = alea(1, 6);
      return questionExpression({ consigne: `Programme : choisir un nombre x, lui ajouter ${a}, multiplier par le nombre de départ diminué de ${b}. Écris le résultat en fonction de x sous forme développée et réduite.`, attendu: att(1, a - b, -a * b), termes: 3, indice: `Le résultat est (x + ${a})(x − ${b}).`, correction: `(x + ${a})(x − ${b}) = ${poly(1, a - b, -a * b)}` });
    }
  },

  {
    groupe: F5,
    id: "tester",
    titre: "Tester un programme",
    description: "Avec un nombre.",
    generer() {
      const a = alea(1, 6), x = nz(-6, 9);
      return { consigne: `Programme : choisir un nombre, lui ajouter ${a}, élever au carré, puis soustraire le carré du nombre de départ. Quel résultat obtient-on avec ${nb(x)} ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], (x + a) ** 2 - x * x), indice: "Suis les étapes dans l'ordre.", correction: `${nb(x)} + ${a} = ${nb(x + a)} ; ${nb(x + a)}² = ${(x + a) ** 2} ; ${(x + a) ** 2} − ${x * x} = ${nb((x + a) ** 2 - x * x)}` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "toujours",
    titre: "Toujours vrai ?",
    description: "Égalité vraie pour tout x ?",
    generer() {
      const a = alea(1, 6);
      const [e, r, c] = choisir([
        [`(x + ${a})² = x² + ${a * a}`, "non", `Contre-exemple : x = 1 donne ${(1 + a) ** 2} et ${1 + a * a}. Il manque le double produit ${2 * a}x.`],
        [`(x + ${a})² = x² + ${2 * a}x + ${a * a}`, "oui", "C'est l'identité (a + b)² = a² + 2ab + b²."],
        [`(x − ${a})(x + ${a}) = x² − ${a * a}`, "oui", "C'est l'identité (a − b)(a + b) = a² − b²."],
        [`(x − ${a})² = x² − ${a * a}`, "non", `Contre-exemple : x = 0 donne ${a * a} et −${a * a}.`],
        [`(2x)² = 2x²`, "non", "Contre-exemple : x = 1 donne 4 et 2. En fait (2x)² = 4x²."],
        [`x(x + ${2 * a}) + ${a * a} = (x + ${a})²`, "oui", `x² + ${2 * a}x + ${a * a} = (x + ${a})².`]
      ]);
      return { consigne: `L'égalité ${e} est-elle vraie pour tout nombre x ?`, choix: ["oui", "non"], verifier: choixVerif(r), indice: "Développe chaque membre, ou cherche un contre-exemple.", correction: c };
    }
  },

  {
    groupe: F6,
    id: "tableur",
    titre: "Formule de tableur",
    description: "Quelle expression ?",
    generer() {
      const a = alea(2, 6), b = alea(1, 9);
      const [f, bonne, autres] = choisir([
        [`=(A2+${a})^2`, `(x + ${a})²`, [`x + ${a}²`, `x² + ${a}`, `(x + ${a}) × 2`]],
        [`=${a}*A2-${b}`, `${a}x − ${b}`, [`${a}(x − ${b})`, `${a} − ${b}x`, `x${a} − ${b}`]],
        [`=${a}*(A2-${b})`, `${a}(x − ${b})`, [`${a}x − ${b}`, `${a} − ${b}x`, `(${a}x)²`]],
        [`=A2^2-${b}`, `x² − ${b}`, [`(x − ${b})²`, `2x − ${b}`, `x − ${b}²`]]
      ]);
      return { consigne: `Dans un tableur, x est en A2 et on écrit en B2 la formule ${f}. Quelle expression calcule-t-elle ?`, choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne), indice: "« A2 » remplace x, « * » est la multiplication et « ^2 » le carré.", correction: bonne };
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
    { competence: "Réduire une expression", activites: ["reduire"] },
    { competence: "Supprimer des parenthèses", activites: ["parentheses"] },
    { competence: "Développer avec k(a + b)", activites: ["dev-simple"] },
    { competence: "Développer et réduire", activites: ["dev-somme"] },
    { competence: "Double distributivité", activites: ["double"] },
    { competence: "Double distributivité", activites: ["double-plus"] },
    { competence: "Identités : carrés", activites: ["carre-somme"] },
    { competence: "Identité : différence de deux carrés", activites: ["diff-carres"] },
    { competence: "Programme de calcul", activites: ["programme", "tester"] },
    { competence: "Prouver ou réfuter", activites: ["toujours"] },
    { competence: "Calcul mental et identités", activites: ["mental"] }
  ]
};
