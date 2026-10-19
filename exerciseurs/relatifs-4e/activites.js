/* =====================================================================
   EXERCISEUR « NOMBRES RELATIFS » — 4e, chapitre 2

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   Les cases [r] acceptent le signe moins (clavier complet sur téléphone).
   PARCOURS (en bas du fichier) : le test « Je me teste » en 14 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Additionner et soustraire (rappels)";
const F2 = "Feuille 2 — Multiplier deux relatifs";
const F3 = "Feuille 3 — Produits de plusieurs facteurs";
const F4 = "Feuille 4 — Diviser des relatifs";
const F5 = "Feuille 5 — Enchaîner les opérations";
const F6 = "Feuille 6 — Programmes de calcul et problèmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const par = x => rr(x) < 0 ? "(" + nb(x) + ")" : nb(x);            // (−3) ou 3
const relatif = (min, max, dec = 0) => rr(alea(min * 10 ** dec, max * 10 ** dec) / 10 ** dec);
const nonNul = (min, max) => { let x = 0; while (x === 0) x = alea(min, max); return x; };
const verifierRel = (v, r) => verifierNombre(v[0], rr(r));
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "additionner",
    titre: "Additionner et soustraire",
    description: "Deux nombres relatifs.",
    generer() {
      const a = choisir([relatif(-20, 20), relatif(-99, 99, 1)]), b = choisir([relatif(-20, 20), relatif(-99, 99, 1)]);
      const plus = Math.random() < 0.5, r = plus ? a + b : a - b;
      const ecr = choisir([`${nb(a)} ${plus ? "+" : "−"} ${par(b)}`, `${nb(a)} ${plus ? (b < 0 ? "−" : "+") : (b < 0 ? "+" : "−")} ${nb(Math.abs(b))}`]);
      return {
        consigne: `Calcule : ${ecr}`,
        ligne: `${ecr} = [r]`, verifier: v => verifierRel(v, r),
        indice: "Soustraire un nombre, c'est additionner son opposé. Même signe : on additionne les distances à zéro ; signes contraires : on les soustrait.",
        correction: `${ecr} = ${nb(r)}`
      };
    }
  },

  {
    groupe: F1,
    id: "somme-algebrique",
    titre: "Sommes algébriques",
    description: "Plusieurs termes.",
    generer() {
      const t = Array.from({ length: alea(4, 6) }, () => nonNul(-15, 15));
      const ecr = t.map((x, i) => i === 0 ? nb(x) : (x < 0 ? " − " : " + ") + Math.abs(x)).join("");
      const r = t.reduce((s, x) => s + x, 0), pos = t.filter(x => x > 0).reduce((s, x) => s + x, 0), neg = t.filter(x => x < 0).reduce((s, x) => s + x, 0);
      return { consigne: `Calcule : ${ecr}`, ligne: "[r]", verifier: v => verifierRel(v, r), indice: "Regroupe les termes positifs d'un côté et les termes négatifs de l'autre.", correction: `Positifs : ${pos} ; négatifs : ${nb(neg)} ; total : ${nb(r)}.` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "signe-produit",
    titre: "Signe d'un produit ou d'un quotient",
    description: "Sans calculer !",
    generer() {
      const n = alea(2, 5), f = Array.from({ length: n }, () => choisir([relatif(-20, -1), relatif(1, 20), relatif(-99, -1, 1), relatif(1, 99, 1)]));
      const neg = f.filter(x => x < 0).length;
      const ecr = f.map((x, i) => i === 0 ? nb(x) : par(x)).join(" × ");
      return { consigne: `Quel est le signe de ${ecr} ?`, choix: ["positif", "négatif"], verifier: choixVerif(neg % 2 ? "négatif" : "positif"), indice: "Compte les facteurs négatifs : un nombre pair donne un produit positif.", correction: `${neg} facteur${neg > 1 ? "s" : ""} négatif${neg > 1 ? "s" : ""} : le produit est ${neg % 2 ? "négatif" : "positif"}.` };
    }
  },

  {
    groupe: F2,
    id: "multiplier",
    titre: "Multiplier deux relatifs",
    description: "La règle des signes.",
    generer(s) {
      const dec = s.serie >= 3 && Math.random() < 0.5;
      const a = dec ? choisir([-0.5, -0.2, -2.5, 0.4, -1.5, 0.3]) : nonNul(-12, 12), b = nonNul(-12, 12) * (dec ? choisir([1, 10]) : 1);
      const ecr = `${nb(a)} × ${par(b)}`;
      return { consigne: `Calcule : ${ecr}`, ligne: `${ecr} = [r]`, verifier: v => verifierRel(v, a * b), indice: "Même signe : positif ; signes contraires : négatif. Puis multiplie les distances à zéro.", correction: `${ecr} = ${nb(a * b)}` };
    }
  },

  {
    groupe: F2,
    id: "trou-produit",
    titre: "Multiplications à trou",
    description: "Retrouver le facteur manquant.",
    generer() {
      const a = nonNul(-10, 10), b = nonNul(-10, 10), p = a * b;
      return { consigne: `Complète : ${nb(a)} × … = ${nb(p)}`, ligne: `${nb(a)} × [r] = ${nb(p)}`, verifier: v => verifierRel(v, b), indice: "Cherche d'abord la distance à zéro, puis le signe avec la règle des signes.", correction: `${nb(a)} × ${par(b)} = ${nb(p)}, donc le nombre est ${nb(b)}.` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "produit-plusieurs",
    titre: "Produits de plusieurs facteurs",
    description: "Le signe, puis le calcul.",
    generer() {
      const f = melanger(choisir([[2, 5, 3], [4, 25, 2], [0.5, 4, 7], [2, 5, 10, 3], [1, 2, 3, 4], [0.25, 4, 9]]).map(x => x * choisir([1, -1])));
      const p = f.reduce((s, x) => s * x, 1), ecr = f.map((x, i) => i === 0 ? nb(x) : par(x)).join(" × ");
      return { consigne: `Calcule : ${ecr}`, ligne: "[r]", verifier: v => verifierRel(v, p), indice: "Compte les facteurs négatifs pour le signe, puis regroupe les facteurs (2 × 5, 4 × 25…).", correction: `${f.filter(x => x < 0).length} facteur(s) négatif(s) : ${ecr} = ${nb(p)}.` };
    }
  },

  {
    groupe: F3,
    id: "puissance",
    titre: "Puissances et signes",
    description: "(−3)² ou −3² ?",
    generer() {
      const a = alea(1, 6), n = alea(2, a <= 2 ? 6 : 3), forme = choisir(["par", "moins", "par"]);
      const r = forme === "par" ? (-a) ** n : -(a ** n), ecr = forme === "par" ? `(−${a})<sup>${n}</sup>` : `−${a}<sup>${n}</sup>`;
      return { consigne: `Calcule : ${ecr}`, ligne: "[r]", verifier: v => verifierRel(v, r), indice: forme === "par" ? "La puissance porte sur le nombre négatif entre parenthèses : compte les facteurs négatifs." : "Sans parenthèses, la puissance ne porte que sur le nombre : on calcule la puissance, puis on prend l'opposé.", correction: forme === "par" ? `(−${a})<sup>${n}</sup> = ${Array(n).fill("(−" + a + ")").join(" × ")} = ${nb(r)}` : `−${a}<sup>${n}</sup> = −(${Array(n).fill(a).join(" × ")}) = ${nb(r)}` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "diviser",
    titre: "Diviser deux relatifs",
    description: "Même règle des signes.",
    generer(s) {
      const b = nonNul(-9, 9) * (s.serie >= 3 && Math.random() < 0.4 ? 0.1 : 1), q = nonNul(-12, 12), a = rr(b * q);
      const ecr = `${nb(a)} ÷ ${par(b)}`;
      return { consigne: `Calcule : ${ecr}`, ligne: `${ecr} = [r]`, verifier: v => verifierRel(v, q), indice: "Divise les distances à zéro, puis applique la règle des signes.", correction: `${ecr} = ${nb(q)} car ${nb(q)} × ${par(b)} = ${nb(a)}.` };
    }
  },

  {
    groupe: F4,
    id: "fraction-signe",
    titre: "Écriture fractionnaire",
    description: "Donner l'écriture décimale.",
    generer() {
      const d = choisir([2, 4, 5, 8, 10]), n = alea(1, 30), sn = choisir([1, -1]), sd = choisir([1, -1]);
      const q = (sn * n) / (sd * d);
      return { consigne: `Donne l'écriture décimale de ${frac(nb(sn * n), nb(sd * d))}.`, ligne: "[r]", verifier: v => verifierRel(v, q), indice: "Même règle des signes que pour la division.", correction: `${frac(nb(sn * n), nb(sd * d))} = ${nb(q)}` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "priorites",
    titre: "Priorités opératoires",
    description: "Expressions avec des relatifs.",
    generer() {
      const a = nonNul(-9, 9), b = nonNul(-9, 9), c = nonNul(-9, 9), d = nonNul(-6, 6);
      const [ecr, r, det] = choisir([
        [`${nb(a)} + ${par(b)} × ${par(c)}`, a + b * c, `${nb(a)} + ${par(b * c)}`],
        [`(${nb(a)} + ${par(b)}) × ${par(c)}`, (a + b) * c, `${par(a + b)} × ${par(c)}`],
        [`${nb(a)} − ${par(b)} × ${par(c)}`, a - b * c, `${nb(a)} − ${par(b * c)}`],
        [`${nb(a * d)} ÷ ${par(d)} − ${par(c)}`, a - c, `${nb(a)} − ${par(c)}`],
        [`${nb(a)} × ${par(b)} − ${par(c)} × ${par(d)}`, a * b - c * d, `${nb(a * b)} − ${par(c * d)}`],
        [`${nb(a)} − ${par(b)}<sup>2</sup>`, a - b * b, `${nb(a)} − ${b * b}`]
      ]);
      return { consigne: `Calcule : ${ecr}`, ligne: "[r]", verifier: v => verifierRel(v, r), indice: "Parenthèses, puis puissances, puis × et ÷, enfin + et −.", correction: `${ecr} = ${det} = ${nb(r)}` };
    }
  },

  {
    groupe: F5,
    id: "substitution",
    titre: "Calculer pour une valeur négative",
    description: "Remplacer x par sa valeur.",
    generer() {
      const x = nonNul(-6, -1), a = alea(2, 5), b = nonNul(-9, 9);
      const [e, f] = choisir([
        [`${a}x + ${b < 0 ? "(" + nb(b) + ")" : b}`, t => a * t + b],
        [`x<sup>2</sup> − ${a}x`, t => t * t - a * t],
        [`−x<sup>2</sup> + ${a}`, t => -t * t + a],
        [`(x − ${a})(x + ${a})`, t => (t - a) * (t + a)],
        [`${a}x<sup>2</sup> + x`, t => a * t * t + t]
      ]);
      return { consigne: `Calcule ${e} pour x = ${nb(x)}.`, ligne: "[r]", verifier: v => verifierRel(v, f(x)), indice: `Remplace x par (${nb(x)}) entre parenthèses, puis respecte les priorités.`, correction: `On obtient ${nb(f(x))}.` };
    }
  },

  {
    groupe: F5,
    id: "quotient-expression",
    titre: "Quotients avec une barre de fraction",
    description: "Numérateur et dénominateur d'abord.",
    generer() {
      const d1 = nonNul(-6, 6), d2 = nonNul(-6, 6), den = d1 + d2 === 0 ? d1 : d1 + d2, q = nonNul(-8, 8), num = q * den;
      const n1 = nonNul(-20, 20), n2 = num - n1;
      const D = d1 + d2 === 0 ? nb(d1) : `${nb(d1)} + ${par(d2)}`;
      return { consigne: `Calcule : ${frac(`${nb(n1)} + ${par(n2)}`, D)}`, ligne: "[r]", verifier: v => verifierRel(v, q), indice: "Calcule séparément le numérateur et le dénominateur, puis divise.", correction: `${frac(nb(num), nb(den))} = ${nb(q)}` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "nature",
    titre: "Nature d'une expression",
    description: "Somme, différence, produit ou quotient ?",
    generer() {
      const [e, r] = choisir([
        ["(−3 + 8) × 4", "un produit"], ["−3 + 8 × 4", "une somme"], ["(−5 − 2) ÷ 7", "un quotient"], ["−5 − 2 ÷ 7", "une différence"],
        ["6 × (−2) − 9", "une différence"], ["6 × (−2 − 9)", "un produit"], ["(−4)<sup>2</sup> + 1", "une somme"], ["12 ÷ (−3 + 1)", "un quotient"]
      ]);
      return { consigne: `L'expression ${e} est…`, choix: ["une somme", "une différence", "un produit", "un quotient"], verifier: choixVerif(r), indice: "C'est la dernière opération effectuée qui donne la nature.", correction: `C'est ${r} (dernière opération effectuée).` };
    }
  },

  {
    groupe: F6,
    id: "programme",
    titre: "Programmes de calcul",
    description: "Avec un nombre négatif.",
    generer() {
      const x = nonNul(-8, -1), a = alea(2, 6), b = alea(1, 9);
      const [t, f] = choisir([
        [`Choisir un nombre ; le multiplier par −${a} ; ajouter ${b}.`, u => -a * u + b],
        [`Choisir un nombre ; lui ajouter ${b} ; multiplier le résultat par le nombre de départ.`, u => (u + b) * u],
        [`Choisir un nombre ; soustraire ${b} ; élever au carré.`, u => (u - b) ** 2],
        [`Choisir un nombre ; le multiplier par ${a} ; soustraire le carré du nombre de départ.`, u => a * u - u * u]
      ]);
      return { consigne: `<em>${t}</em> Quel résultat obtient-on avec ${nb(x)} ?`, ligne: "[r]", verifier: v => verifierRel(v, f(x)), indice: "Applique chaque étape dans l'ordre, en mettant les nombres négatifs entre parenthèses.", correction: `On obtient ${nb(f(x))}.` };
    }
  },

  {
    groupe: F6,
    id: "probleme",
    titre: "Problèmes",
    description: "Températures, QCM, jeux…",
    generer() {
      const [q, r, u, c] = choisir([
        (() => { const b = alea(8, 15), m = alea(2, 7); return [`Un QCM rapporte +3 points par bonne réponse et −2 par mauvaise réponse. Inès a ${b} bonnes réponses et ${m} mauvaises. Quelle est sa note ?`, 3 * b - 2 * m, "points", `${b} × 3 + ${m} × (−2) = ${3 * b - 2 * m}`]; })(),
        (() => { const t0 = alea(2, 8), d = alea(2, 4), h = alea(3, 6); return [`La température d'un congélateur est de ${t0} °C. Elle baisse de ${d} °C par heure. Quelle sera-t-elle dans ${h} h ?`, t0 - d * h, "°C", `${t0} + ${h} × (−${d}) = ${nb(t0 - d * h)} °C`]; })(),
        (() => { const t = [alea(-50, -40), alea(-50, -40), alea(-50, -40), alea(-50, -40)]; const s = t.reduce((a, b) => a + b, 0); const k = ((s % 4) + 4) % 4; t[0] -= k; const S = s - k; return [`Températures relevées en Sibérie : ${t.map(nb).join(" ; ")} °C. Quelle est la moyenne ?`, S / 4, "°C", `(${nb(S)}) ÷ 4 = ${nb(S / 4)} °C`]; })(),
        (() => { const p = alea(2, 5), v = alea(2, 4) * 10; return [`Un plongeur descend de ${p} m par minute. Au bout de combien de minutes atteint-il −${p * v / 10} m ?`, v / 10, "min", `−${p * v / 10} ÷ (−${p}) = ${v / 10} min`]; })()
      ]);
      return { consigne: q, ligne: `[r] ${u}`, verifier: v => verifierRel(v, r), indice: "Traduis chaque gain ou perte par un nombre relatif.", correction: c };
    }
  }
];

/* ---------- Le test « Je me teste » : 14 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "14 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Additionner et soustraire", activites: ["additionner"] },
    { competence: "Calculer une somme algébrique", activites: ["somme-algebrique"] },
    { competence: "Trouver le signe d'un produit", activites: ["signe-produit"] },
    { competence: "Multiplier deux relatifs", activites: ["multiplier"] },
    { competence: "Compléter une multiplication à trou", activites: ["trou-produit"] },
    { competence: "Calculer un produit de plusieurs facteurs", activites: ["produit-plusieurs"] },
    { competence: "Puissances d'un nombre négatif", activites: ["puissance"] },
    { competence: "Diviser deux relatifs", activites: ["diviser"] },
    { competence: "Écriture fractionnaire et signe", activites: ["fraction-signe"] },
    { competence: "Respecter les priorités", activites: ["priorites"] },
    { competence: "Calculer avec une barre de fraction", activites: ["quotient-expression"] },
    { competence: "Remplacer une lettre par un nombre négatif", activites: ["substitution"] },
    { competence: "Nature d'une expression et programmes", activites: ["nature", "programme"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
