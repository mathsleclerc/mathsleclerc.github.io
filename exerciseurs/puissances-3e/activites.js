/* =====================================================================
   EXERCISEUR « PUISSANCES ET NOTATION SCIENTIFIQUE » — 3e, chapitre 10

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste ».
   ===================================================================== */

const F1 = "Feuille 1 — Puissances et exposants négatifs";
const F2 = "Feuille 2 — Règles de calcul";
const F3 = "Feuille 3 — Puissances de 10";
const F4 = "Feuille 4 — Écrire en notation scientifique";
const F5 = "Feuille 5 — Calculer en notation scientifique";
const F6 = "Feuille 6 — Problèmes type brevet";
const rr = x => x === 0 ? 0 : Number(x.toPrecision(10));
/* Écriture française avec jusqu'à 12 décimales (ecrireNombre s'arrête à 6) */
const nb = x => {
  const y = Math.abs(rr(x)), [e, d] = y.toLocaleString("fr-FR", { maximumFractionDigits: 12, useGrouping: false }).split(",");
  return (rr(x) < 0 ? "−" : "") + e.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f") + (d ? "," + d.replace(/(\d{3})(?=\d)/g, "$1\u202f") : "");
};
const ex = n => `<sup>${n < 0 ? "−" + -n : n}</sup>`;
const p10 = n => "10" + ex(n);
const sci = (a, n) => `${nb(a)} × ${p10(n)}`;
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const verifierExp = (v, n) => { const x = lireEntier(v); if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre entier (relatif)." }; return x === n ? { etat: "juste" } : { etat: "faux" }; };
/* Notation scientifique : a (décimal 1 ≤ a < 10) et n */
const lireSci = x => { const n = Math.floor(Math.log10(x) + 1e-12); return [rr(x / 10 ** n), n]; };

const ACTIVITES = [
  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "calculer",
    titre: "Calculer une puissance",
    description: "Avec ou sans nombre négatif.",
    generer() {
      const [ecr, r, c] = choisir([
        (() => { const a = alea(2, 5), n = alea(2, a === 2 ? 8 : 4); return [`${a}${ex(n)}`, a ** n, Array(n).fill(a).join(" × ")]; })(),
        (() => { const a = alea(1, 4), n = alea(2, 5); return [`(−${a})${ex(n)}`, (-a) ** n, `exposant ${n % 2 ? "impair : négatif" : "pair : positif"}`]; })(),
        (() => { const a = alea(2, 5), n = 2; return [`−${a}${ex(n)}`, -(a ** n), `la puissance ne porte que sur ${a}`]; })(),
        (() => { const a = alea(2, 9); return [`${a}${ex(0)}`, 1, "a⁰ = 1"]; })(),
        (() => { const a = choisir([0.1, 0.2, 0.5]), n = alea(2, 3); return [`${nb(a)}${ex(n)}`, rr(a ** n), Array(n).fill(nb(a)).join(" × ")]; })()
      ]);
      return { consigne: `Calcule ${ecr}.`, ligne: `${ecr} = [r]`, verifier: v => verifierNombre(v[0], r), indice: "aⁿ = a × a × … × a (n facteurs). Attention aux parenthèses et au signe.", correction: `${ecr} = ${nb(r)} (${c}).` };
    }
  },

  {
    groupe: F1,
    id: "exposant",
    titre: "Trouver l'exposant",
    description: "64 = 2^… ",
    generer() {
      const a = choisir([2, 3, 5, 10]), n = alea(2, a === 2 ? 10 : a === 10 ? 9 : 5);
      return { consigne: `Complète : ${ecrireNombre(a ** n)} = ${a}<sup>…</sup>`, ligne: `${ecrireNombre(a ** n)} = ${a}<sup>[n]</sup>`, verifier: v => verifierExp(v[0], n), indice: `Combien de fois faut-il multiplier ${a} par lui-même ?`, correction: `${ecrireNombre(a ** n)} = ${a}${ex(n)}` };
    }
  },

  {
    groupe: F1,
    id: "inverse",
    titre: "Exposant négatif",
    description: "a⁻ⁿ = 1/aⁿ.",
    generer() {
      const a = choisir([2, 3, 4, 5, 10]), n = alea(1, 3), den = a ** n;
      return { consigne: `Écris ${a}${ex(-n)} sous la forme d'une fraction.`, ligne: "[f]", verifier: v => verifierFraction(v[0], 1, den), indice: `a${ex(-n)} = 1 / a${ex(n)}.`, correction: `${a}${ex(-n)} = 1 / ${a}${ex(n)} = ${frac(1, den)}` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "produit",
    titre: "Produit de puissances",
    description: "aᵐ × aⁿ = aᵐ⁺ⁿ.",
    generer() {
      const a = choisir(["2", "3", "5", "7", "x", "a"]), m = alea(1, 8), n = alea(1, 8);
      return { consigne: `Écris ${a}${ex(m)} × ${a}${ex(n)} sous la forme d'une seule puissance de ${a}.`, ligne: `${a}${ex(m)} × ${a}${ex(n)} = ${a}<sup>[n]</sup>`, verifier: v => verifierExp(v[0], m + n), indice: "On ajoute les exposants : il y a m + n facteurs en tout.", correction: `${a}${ex(m)} × ${a}${ex(n)} = ${a}${ex(m + n)}` };
    }
  },

  {
    groupe: F2,
    id: "meme-exposant",
    titre: "Même exposant",
    description: "aⁿ × bⁿ = (ab)ⁿ.",
    generer() {
      const [a, b] = choisir([[2, 5], [4, 25], [5, 20], [2, 50], [0.5, 2], [2.5, 4]]), n = alea(2, 5);
      return { consigne: `Écris ${nb(a)}${ex(n)} × ${nb(b)}${ex(n)} sous la forme d'une seule puissance.`, ligne: `[d]<sup>[n]</sup>`, verifier: v => { const x = lireNombre(v[0]), y = lireEntier(v[1]); if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux cases." }; return Math.abs(x ** y - (a * b) ** n) < 1e-6 ? { etat: "juste" } : { etat: "faux" }; }, indice: "aⁿ × bⁿ = (a × b)ⁿ.", correction: `${nb(a)}${ex(n)} × ${nb(b)}${ex(n)} = (${nb(a)} × ${nb(b)})${ex(n)} = ${nb(a * b)}${ex(n)}` };
    }
  },

  {
    groupe: F2,
    id: "vrai-faux",
    titre: "Vrai ou faux ?",
    description: "Les pièges classiques.",
    generer() {
      const [e, v, c] = choisir([
        ["2³ + 2⁴ = 2⁷", false, "8 + 16 = 24 et 2⁷ = 128 : on n'ajoute pas les exposants dans une somme."],
        ["3² × 3⁵ = 3⁷", true, "on ajoute les exposants."],
        ["3² × 3⁵ = 9⁷", false, "le résultat est 3⁷ (on ne multiplie pas les nombres)."],
        ["(2 × 3)⁴ = 2⁴ × 3⁴", true, "aⁿ × bⁿ = (ab)ⁿ."],
        ["(−3)² = −3²", false, "(−3)² = 9 et −3² = −9."],
        ["5⁰ = 0", false, "5⁰ = 1."],
        ["2⁵ = 10", false, "2⁵ = 32 (et non 2 × 5)."],
        ["10³ × 10⁻³ = 1", true, "10⁰ = 1."]
      ]);
      return { consigne: `« ${e} »`, choix: ["Vrai", "Faux"], verifier: choixVerif(v ? "Vrai" : "Faux"), indice: "Calcule chaque membre si besoin.", correction: `${v ? "Vrai" : "Faux"} : ${c}` };
    }
  },

  {
    groupe: F2,
    id: "quotient-puissance",
    titre: "Quotient et puissance de puissance",
    description: "aᵐ/aⁿ et (aᵐ)ⁿ.",
    generer() {
      const a = choisir([2, 3, 5, 7]), m = alea(-4, 8), n = alea(-3, 6);
      if (Math.random() < 0.5) return { consigne: `Écris sous la forme d'une puissance de ${a}.`, ligne: `${a}${ex(m)} ÷ ${a}${ex(n)} = ${a}<sup>[r]</sup>`, verifier: v => verifierExp(v[0], m - n), indice: "aᵐ ÷ aⁿ = aᵐ⁻ⁿ : on soustrait les exposants.", correction: `${a}${ex(m)} ÷ ${a}${ex(n)} = ${a}${ex(m - n)}` };
      const p = alea(2, 4);
      return { consigne: `Écris sous la forme d'une puissance de ${a}.`, ligne: `(${a}${ex(m)})${ex(p)} = ${a}<sup>[r]</sup>`, verifier: v => verifierExp(v[0], m * p), indice: "(aᵐ)ⁿ = aᵐˣⁿ : on multiplie les exposants.", correction: `(${a}${ex(m)})${ex(p)} = ${a}${ex(m * p)}` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "p10-decimal",
    titre: "Écriture décimale de 10ⁿ",
    description: "Positif ou négatif.",
    generer() {
      const n = choisir([alea(1, 7), -alea(1, 6)]);
      return { consigne: `Donne l'écriture décimale de ${p10(n)}.`, ligne: `${p10(n)} = [d]`, verifier: v => verifierNombre(v[0], rr(10 ** n)), indice: n > 0 ? `1 suivi de ${n} zéros.` : `10⁻ⁿ = 1 ÷ 10ⁿ : le 1 est au ${-n}e rang après la virgule.`, correction: `${p10(n)} = ${nb(10 ** n)}` };
    }
  },

  {
    groupe: F3,
    id: "decimal-p10",
    titre: "Écrire comme puissance de 10",
    description: "1 000 = 10³ ; 0,01 = 10⁻².",
    generer() {
      const n = choisir([alea(0, 8), -alea(1, 7)]);
      return { consigne: `Écris ${nb(10 ** n)} sous la forme d'une puissance de 10.`, ligne: `${nb(10 ** n)} = 10<sup>[r]</sup>`, verifier: v => verifierExp(v[0], n), indice: n >= 0 ? "Compte les zéros." : "Compte le rang du 1 après la virgule : l'exposant est négatif.", correction: `${nb(10 ** n)} = ${p10(n)}` };
    }
  },

  {
    groupe: F3,
    id: "decaler",
    titre: "Multiplier par 10ⁿ",
    description: "Déplacer la virgule.",
    generer() {
      const a = choisir([3.7, 52, 0.08, 4500, 6, 0.25, 13, 9.1, 1.2]), n = choisir([alea(1, 5), -alea(1, 4)]);
      return { consigne: `Calcule ${nb(a)} × ${p10(n)}.`, ligne: "[d]", verifier: v => verifierNombre(v[0], rr(a * 10 ** n)), indice: n > 0 ? `Décale la virgule de ${n} rangs vers la droite.` : `Décale la virgule de ${-n} rangs vers la gauche.`, correction: `${nb(a)} × ${p10(n)} = ${nb(a * 10 ** n)}` };
    }
  },

  {
    groupe: F3,
    id: "regles10",
    titre: "Règles de calcul",
    description: "Produit, quotient, puissance.",
    generer() {
      const m = alea(-6, 8), n = alea(-5, 6), k = alea(2, 3), t = choisir(["prod", "quot", "pui"]);
      const [ecr, r] = t === "prod" ? [`${p10(m)} × ${p10(n)}`, m + n] : t === "quot" ? [`${frac(p10(m), p10(n))}`, m - n] : [`(${p10(m)})${ex(k)}`, m * k];
      return { consigne: `Écris ${ecr} sous la forme 10<sup>n</sup>.`, ligne: `${ecr} = 10<sup>[r]</sup>`, verifier: v => verifierExp(v[0], r), indice: t === "prod" ? "On ajoute les exposants." : t === "quot" ? "On soustrait les exposants (haut − bas)." : "On multiplie les exposants.", correction: `${ecr} = ${p10(r)}` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "notation-sci",
    titre: "Notation scientifique",
    description: "a × 10ⁿ avec 1 ≤ a < 10.",
    generer() {
      const a = choisir([3.9, 7.83, 4.526, 5, 7.1, 1.2, 2.04, 6.5, 9.1]), n = choisir([alea(2, 9), -alea(1, 6)]);
      const x = rr(a * 10 ** n);
      return { consigne: `Donne la notation scientifique de ${nb(x)}.`, ligne: "[d] × 10<sup>[r]</sup>", verifier: v => { const b = lireNombre(v[0]), e = lireEntier(v[1]); if (isNaN(b) || isNaN(e)) return { etat: "incomplet", message: "Remplis les deux cases." }; if (Math.abs(b * 10 ** e - x) > 1e-9 * Math.max(1, x)) return { etat: "faux" }; return b >= 1 && b < 10 ? { etat: "juste" } : { etat: "faux", message: "Le nombre est égal, mais le premier facteur doit être compris entre 1 et 10." }; }, indice: "Place la virgule après le premier chiffre non nul et compte les rangs.", correction: `${nb(x)} = ${sci(a, n)}` };
    }
  },

  {
    groupe: F4,
    id: "corriger-sci",
    titre: "Rectifier une écriture",
    description: "35 × 10⁴ = 3,5 × 10⁵.",
    generer() {
      const a = choisir([35, 0.6, 452, 0.07, 12, 0.24]), n = alea(-5, 6), [b, e] = lireSci(a * 10 ** n);
      return { consigne: `Écris ${sci(a, n)} en notation scientifique.`, ligne: "[d] × 10<sup>[r]</sup>", verifier: v => { const x = lireNombre(v[0]), y = lireEntier(v[1]); if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux cases." }; return Math.abs(x - b) < 1e-9 && y === e ? { etat: "juste" } : { etat: "faux" }; }, indice: `Écris d'abord ${nb(a)} en notation scientifique, puis multiplie les puissances de 10.`, correction: `${sci(a, n)} = ${sci(b, e)}` };
    }
  },

  {
    groupe: F4,
    id: "comparer-sci",
    titre: "Comparer",
    description: "Exposant d'abord.",
    generer() {
      const a = alea(11, 99) / 10, b = alea(11, 99) / 10, n = alea(-6, 9), m = n + choisir([-1, 0, 1]);
      const x = a * 10 ** n, y = b * 10 ** m, s = x < y ? "<" : x > y ? ">" : "=";
      return { consigne: `Compare ${sci(a, n)} et ${sci(b, m)}.`, ligne: `${sci(a, n)} [c] ${sci(b, m)}`, choix: ["<", "=", ">"], verifier: (v, c) => ({ etat: c === s ? "juste" : "faux" }), indice: "Le plus grand exposant donne le plus grand nombre ; à exposant égal, compare les premiers facteurs.", correction: `${sci(a, n)} ${s} ${sci(b, m)}` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "calcul-sci",
    titre: "Calculer en notation scientifique",
    description: "Regrouper nombres et puissances de 10.",
    generer() {
      const a = alea(2, 9), b = alea(2, 9), n = alea(-5, 8), m = alea(-5, 8), div = Math.random() < 0.4;
      const val = div ? (a * b) / b * 10 ** n / 10 ** m : a * b * 10 ** (n + m);
      const A = div ? a * b : a;
      const ecr = div ? frac(sci(A, n), sci(b, m)) : `(${sci(a, n)}) × (${sci(b, m)})`;
      const [c, e] = lireSci(val);
      return { consigne: `Calcule ${ecr} et donne le résultat en notation scientifique.`, ligne: "[d] × 10<sup>[r]</sup>", verifier: v => { const x = lireNombre(v[0]), y = lireEntier(v[1]); if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux cases." }; return Math.abs(x - c) < 1e-9 && y === e ? { etat: "juste" } : Math.abs(x * 10 ** y - val) < 1e-9 * val ? { etat: "faux", message: "Le résultat est égal, mais ce n'est pas une notation scientifique." } : { etat: "faux" }; }, indice: "Regroupe les nombres d'un côté et les puissances de 10 de l'autre.", correction: `${ecr} = ${sci(c, e)}` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "prefixes",
    titre: "Les préfixes",
    description: "De nano à giga.",
    generer() {
      const [p, n, ex1] = choisir([["giga", 9, "Go"], ["méga", 6, "MW"], ["kilo", 3, "km"], ["milli", -3, "mm"], ["micro", -6, "µm"], ["nano", -9, "nm"]]);
      return { consigne: `Le préfixe « ${p} » (comme dans ${ex1}) correspond à quelle puissance de 10 ?`, ligne: "10<sup>[r]</sup>", verifier: v => verifierExp(v[0], n), indice: "giga 10⁹, méga 10⁶, kilo 10³, milli 10⁻³, micro 10⁻⁶, nano 10⁻⁹.", correction: `${p} = ${p10(n)}` };
    }
  },

  {
    groupe: F6,
    id: "convertir",
    titre: "Convertir avec les préfixes",
    description: "En notation scientifique.",
    generer() {
      const [u, n, base] = choisir([["µm", -6, "m"], ["nm", -9, "m"], ["Mm", 6, "m"], ["Go", 9, "octets"], ["mL", -3, "L"], ["km", 3, "m"]]), a = choisir([2, 3, 4.5, 7, 25, 250, 0.3]);
      const [c, e] = lireSci(a * 10 ** n);
      return { consigne: `Convertis ${nb(a)} ${u} en ${base}, en notation scientifique.`, ligne: `[d] × 10<sup>[r]</sup> ${base}`, verifier: v => { const x = lireNombre(v[0]), y = lireEntier(v[1]); if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux cases." }; return Math.abs(x - c) < 1e-9 && y === e ? { etat: "juste" } : { etat: "faux" }; }, indice: `1 ${u} = ${p10(n)} ${base}.`, correction: `${nb(a)} ${u} = ${nb(a)} × ${p10(n)} ${base} = ${sci(c, e)} ${base}` };
    }
  },

  {
    groupe: F6,
    id: "doubler",
    titre: "Ça double !",
    description: "Croissance par puissances de 2.",
    generer() {
      const k = alea(3, 10), d = choisir([20, 30, 60]);
      return { consigne: `Une bactérie se divise en deux toutes les ${d} minutes. Combien y a-t-il de bactéries au bout de ${k * d} minutes (en partant d'une seule) ?`, ligne: "[n]", verifier: v => verifierNombre(v[0], 2 ** k), indice: `Il y a ${k} divisions : 2 multiplié ${k} fois par lui-même.`, correction: `${k} divisions : 2${ex(k)} = ${ecrireNombre(2 ** k)} bactéries.` };
    }
  }
];

/* ---------- Le test « Je me teste » ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Calculer une puissance", activites: ["calculer"] },
    { competence: "Exposant négatif", activites: ["inverse"] },
    { competence: "Produit de puissances", activites: ["produit", "meme-exposant"] },
    { competence: "Quotient, puissance de puissance", activites: ["quotient-puissance"] },
    { competence: "Puissances de 10", activites: ["p10-decimal", "decimal-p10"] },
    { competence: "Règles de calcul avec 10ⁿ", activites: ["regles10"] },
    { competence: "Multiplier par 10ⁿ", activites: ["decaler"] },
    { competence: "Notation scientifique", activites: ["notation-sci"] },
    { competence: "Comparer", activites: ["comparer-sci"] },
    { competence: "Calculer en notation scientifique", activites: ["calcul-sci"] },
    { competence: "Préfixes", activites: ["prefixes", "convertir"] },
    { competence: "Croissance exponentielle", activites: ["doubler"] }
  ]
};
