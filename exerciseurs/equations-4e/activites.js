/* =====================================================================
   EXERCISEUR « ÉQUATIONS » — 4e, chapitre 13

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Équation et solution";
const F2 = "Feuille 2 — Équations simples";
const F3 = "Feuille 3 — Résoudre ax + b = cx + d";
const F4 = "Feuille 4 — Développer avant de résoudre";
const F5 = "Feuille 5 — Mettre en équation";
const F6 = "Feuille 6 — Résoudre des problèmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const nbp = x => x < 0 ? `(${nb(x)})` : nb(x);
const nz = () => { let n = 0; while (n === 0) n = alea(-9, 9); return n; };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
/* écrit a·x + b proprement : « 3x − 4 », « −x + 2 », « 5 » */
function lin(a, b, l = "x") {
  let s = a === 0 ? "" : a === 1 ? l : a === -1 ? "−" + l : nb(a) + l;
  if (b !== 0) s += s === "" ? nb(b) : (b > 0 ? " + " : " − ") + nb(Math.abs(b));
  return s === "" ? "0" : s;
}
/* forme « b + ax » (le nombre d'abord) */
function linInv(a, b) { return b === 0 ? lin(a, 0) : nb(b) + (a > 0 ? " + " : " − ") + (Math.abs(a) === 1 ? "" : nb(Math.abs(a))) + "x"; }
const verifSol = s => v => verifierNombre(v[0], rr(s));
const LIGNE = "x = [d]";

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "tester",
    titre: "Est-ce une solution ?",
    description: "Remplacer et comparer les deux membres.",
    generer() {
      const a = nz(), b = alea(-9, 9), c = nz(), x0 = alea(-5, 6);
      if (a === c) return this.generer();
      const sol = Math.random() < 0.5, d = sol ? (a - c) * x0 + b : (a - c) * x0 + b + choisir([-2, -1, 1, 2, 3]);
      const g = a * x0 + b, dr = c * x0 + d;
      return { consigne: `${nb(x0)} est-il solution de l'équation ${lin(a, b)} = ${lin(c, d)} ?`, choix: ["oui", "non"], verifier: choixVerif(g === dr ? "oui" : "non"), indice: "Calcule séparément chaque membre en remplaçant x, puis compare.", correction: `Membre de gauche : ${nb(g)} ; membre de droite : ${nb(dr)}. ${g === dr ? "Ils sont égaux : oui." : "Ils sont différents : non."}` };
    }
  },

  {
    groupe: F1,
    id: "mental",
    titre: "Solution mentale",
    description: "Trouver le nombre qui convient.",
    generer() {
      const x = alea(1, 12), t = choisir(["+", "−", "×", "÷", "ax+b"]);
      const [e, sol, c] = t === "+" ? (b => [`x + ${b} = ${x + b}`, x, `${x} + ${b} = ${x + b}`])(alea(2, 15))
        : t === "−" ? (b => [`x − ${b} = ${nb(x - b)}`, x, `${x} − ${b} = ${nb(x - b)}`])(alea(2, 15))
        : t === "×" ? (a => [`${a}x = ${a * x}`, x, `${a} × ${x} = ${a * x}`])(alea(2, 9))
        : t === "÷" ? (a => [`x ÷ ${a} = ${x}`, a * x, `${a * x} ÷ ${a} = ${x}`])(alea(2, 6))
        : ((a, b) => [`${a}x + ${b} = ${a * x + b}`, x, `${a} × ${x} + ${b} = ${a * x + b}`])(alea(2, 5), alea(1, 9));
      return { consigne: `Trouve mentalement la solution : ${e}`, ligne: LIGNE, verifier: verifSol(sol), indice: "Quel nombre faut-il mettre à la place de x pour que l'égalité soit vraie ?", correction: `x = ${sol} car ${c}` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "additif",
    titre: "x + a = b",
    description: "Ajouter ou soustraire.",
    generer() {
      const a = nz(), x = alea(-12, 12), b = x + a, inv = Math.random() < 0.3;
      return { consigne: `Résous l'équation : ${inv ? linInv(1, a) : lin(1, a)} = ${nb(b)}`, ligne: LIGNE, verifier: verifSol(x), indice: a > 0 ? `Soustrais ${a} aux deux membres.` : `Ajoute ${-a} aux deux membres.`, correction: `x = ${nb(b)} ${a > 0 ? "−" : "+"} ${Math.abs(a)} = ${nb(x)}` };
    }
  },

  {
    groupe: F2,
    id: "multiplicatif",
    titre: "ax = b",
    description: "Diviser par le coefficient.",
    generer() {
      const a = choisir([2, 3, 4, 5, 6, 8, 10, -2, -3, -4, -5, -1, 0.5]), x = choisir([alea(-10, 10), alea(-10, 10), alea(-19, 19) / 2]);
      if (!Number.isInteger(rr(a * x) * 10)) return this.generer();
      const b = rr(a * x);
      return { consigne: `Résous l'équation : ${lin(a, 0)} = ${nb(b)}`, ligne: LIGNE, verifier: verifSol(x), indice: a === -1 ? "−x = b donne x = −b." : `Divise les deux membres par ${nb(a)}.`, correction: a === -1 ? `x = ${nb(x)}` : `x = ${nb(b)} ÷ ${nbp(a)} = ${nb(x)}` };
    }
  },

  {
    groupe: F2,
    id: "quotient",
    titre: "x ÷ a = b",
    description: "Multiplier par le diviseur.",
    generer() {
      const a = choisir([2, 3, 4, 5, 6, 7, -2, -3, -4]), b = nz(), x = a * b;
      return { consigne: `Résous l'équation : x/${nbp(a)} = ${nb(b)}  (c'est-à-dire x ÷ ${nbp(a)} = ${nb(b)})`, ligne: LIGNE, verifier: verifSol(x), indice: `Multiplie les deux membres par ${nb(a)}.`, correction: `x = ${nb(b)} × ${nbp(a)} = ${nb(x)}` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "ax-b-c",
    titre: "ax + b = c",
    description: "Deux étapes.",
    generer() {
      const a = choisir([2, 3, 4, 5, 6, -2, -3, -4, 7]), b = nz(), x = choisir([alea(-8, 8), alea(-8, 8), alea(-15, 15) / 2]), c = rr(a * x + b);
      if (!Number.isInteger(c)) return this.generer();
      const inv = Math.random() < 0.3;
      return { consigne: `Résous l'équation : ${inv ? linInv(a, b) : lin(a, b)} = ${nb(c)}`, ligne: LIGNE, verifier: verifSol(x), indice: `D'abord ${b > 0 ? "soustrais " + b : "ajoute " + -b} aux deux membres, puis divise par ${nb(a)}.`, correction: `${lin(a, 0)} = ${nb(c)} ${b > 0 ? "−" : "+"} ${Math.abs(b)} = ${nb(c - b)} ; x = ${nb(c - b)} ÷ ${nbp(a)} = ${nb(x)}` };
    }
  },

  {
    groupe: F3,
    id: "ax-b-cx-d",
    titre: "ax + b = cx + d",
    description: "Regrouper les x d'un côté.",
    generer() {
      const a = nz(), c = nz();
      if (a === c) return this.generer();
      const x = choisir([alea(-8, 8), alea(-8, 8), alea(-15, 15) / 2]), b = alea(-12, 12), d = rr((a - c) * x + b);
      if (!Number.isInteger(d)) return this.generer();
      const k = a - c;
      return { consigne: `Résous l'équation : ${lin(a, b)} = ${lin(c, d)}`, ligne: LIGNE, verifier: verifSol(x), indice: `Fais disparaître ${lin(c, 0)} du membre de droite (en l'ajoutant ou en le soustrayant aux deux membres), pour regrouper les x à gauche.`, correction: `${lin(k, b)} = ${nb(d)} ; ${lin(k, 0)} = ${nb(d - b)} ; x = ${nb(d - b)} ÷ ${nbp(k)} = ${nb(x)}` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "parentheses",
    titre: "Avec des parenthèses",
    description: "Développer puis résoudre.",
    generer() {
      const t = alea(1, 3), x = alea(-6, 8);
      if (t === 1) { const k = choisir([2, 3, 4, 5, -2, -3]), b = nz(), c = k * (x + b); return { consigne: `Résous l'équation : ${nb(k)}(${lin(1, b)}) = ${nb(c)}`, ligne: LIGNE, verifier: verifSol(x), indice: "Développe le membre de gauche, ou divise directement par le facteur.", correction: `${lin(k, k * b)} = ${nb(c)} ; ${lin(k, 0)} = ${nb(c - k * b)} ; x = ${nb(x)}` }; }
      if (t === 2) { const k = choisir([2, 3, 4, 5]), b = nz(), c = choisir([1, 2, -1, -2]), d = k * (x + b) - c * x; if (k === c) return this.generer(); return { consigne: `Résous l'équation : ${k}(${lin(1, b)}) = ${lin(c, d)}`, ligne: LIGNE, verifier: verifSol(x), indice: "Développe le membre de gauche, puis regroupe les x.", correction: `${lin(k, k * b)} = ${lin(c, d)} ; ${lin(k - c, 0)} = ${nb(d - k * b)} ; x = ${nb(x)}` }; }
      const p = choisir([3, 4, 5]), q = choisir([2, 3]), a = nz(), b = nz(); if (p === q) return this.generer(); const r = p * (x + a) - q * (x + b);
      return { consigne: `Résous l'équation : ${p}(${lin(1, a)}) − ${q}(${lin(1, b)}) = ${nb(r)}`, ligne: LIGNE, verifier: verifSol(x), indice: "Attention au signe − devant la deuxième parenthèse : il change tous les signes.", correction: `${lin(p, p * a)} − ${q}x ${q * b > 0 ? "−" : "+"} ${Math.abs(q * b)} = ${nb(r)} ; ${lin(p - q, p * a - q * b)} = ${nb(r)} ; x = ${nb(x)}` };
    }
  },

  {
    groupe: F4,
    id: "nb-solutions",
    titre: "Combien de solutions ?",
    description: "Aucune, une, une infinité.",
    generer() {
      const k = choisir([2, 3, 4, 5]), a = nz(), t = alea(1, 3);
      const [e, r, c] = t === 1 ? [`${k}(${lin(1, a)}) = ${lin(k, k * a + choisir([1, 2, -1]))}`, "aucune", "On obtient une égalité fausse entre deux nombres : aucune solution."]
        : t === 2 ? [`${k}(${lin(1, a)}) = ${lin(k, k * a)}`, "une infinité", "Les deux membres sont égaux pour tout x : une infinité de solutions."]
        : [`${k}(${lin(1, a)}) = ${lin(k + 1, k * a + 2)}`, "une seule", `On trouve x = ${nb(-2)} : une seule solution.`];
      return { consigne: `Combien l'équation ${e} a-t-elle de solutions ?`, choix: ["aucune", "une seule", "une infinité"], verifier: choixVerif(r), indice: "Développe et regroupe les x : que reste-t-il ?", correction: c };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "traduire",
    titre: "Traduire en équation",
    description: "Choisir la bonne équation.",
    generer() {
      const a = alea(2, 5), b = alea(2, 12), c = alea(15, 40);
      const mult = { 2: "double", 3: "triple", 4: "quadruple", 5: "quintuple" }[a];
      const [phrase, bonne, autres] = choisir([
        [`Le ${mult} d'un nombre, augmenté de ${b}, vaut ${c}.`, `${a}x + ${b} = ${c}`, [`${a}(x + ${b}) = ${c}`, `x + ${a} + ${b} = ${c}`, `${a}x = ${b} + x`]],
        [`Le ${mult} de la somme d'un nombre et de ${b} vaut ${c}.`, `${a}(x + ${b}) = ${c}`, [`${a}x + ${b} = ${c}`, `x + ${a * b} = ${c}`, `${a} + x + ${b} = ${c}`]],
        [`Un nombre diminué de ${b} est égal à son ${mult}.`, `x − ${b} = ${a}x`, [`${a}x − ${b} = x`, `x − ${b} = ${a} + x`, `${b} − x = ${a}x`]],
        [`Un nombre et son ${mult} ont pour somme ${c}.`, `x + ${a}x = ${c}`, [`${a}x = ${c}`, `x + ${a} = ${c}`, `x × ${a}x = ${c}`]]
      ]);
      return { consigne: `Soit x le nombre. Quelle équation traduit : « ${phrase} » ?`, choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne), indice: "Traduis mot à mot : « le triple de » = 3 ×, « augmenté de » = +, « la somme de … et … » = parenthèses.", correction: bonne };
    }
  },

  {
    groupe: F5,
    id: "programme",
    titre: "Programme de calcul",
    description: "Retrouver le nombre de départ.",
    generer() {
      const a = alea(2, 6), b = alea(1, 12), x = alea(-5, 12), plus = Math.random() < 0.5, r = plus ? a * x + b : a * x - b;
      return { consigne: `Programme : choisir un nombre, le multiplier par ${a}, puis ${plus ? "ajouter" : "soustraire"} ${b}. Quel nombre faut-il choisir pour obtenir ${nb(r)} ?`, ligne: "[d]", verifier: verifSol(x), indice: `Résous ${a}x ${plus ? "+" : "−"} ${b} = ${nb(r)}.`, correction: `${a}x ${plus ? "+" : "−"} ${b} = ${nb(r)} ; ${a}x = ${nb(plus ? r - b : r + b)} ; x = ${nb(x)}` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "probleme",
    titre: "Problèmes",
    description: "Tarifs, âges, partages, périmètres…",
    generer() {
      const t = alea(1, 5);
      if (t === 1) { const p = alea(7, 11), q = alea(4, p - 2), n = alea(5, 15), ab = (p - q) * n; return { consigne: `Cinéma — tarif A : ${p} € la séance ; tarif B : abonnement de ${ab} € puis ${q} € la séance. Pour combien de séances les deux tarifs sont-ils égaux ?`, ligne: "[d] séances", verifier: verifSol(n), indice: `Résous ${p}x = ${ab} + ${q}x.`, correction: `${p}x = ${ab} + ${q}x ; ${p - q}x = ${ab} ; x = ${n} séances.` }; }
      if (t === 2) { const f = alea(5, 14), k = choisir([3, 4]), n = (k - 2) * f; return { consigne: `Un père a ${k} fois l'âge de son fils. Dans ${n} ans, il aura le double de l'âge de son fils. Quel est l'âge actuel du fils ?`, ligne: "[d] ans", verifier: verifSol(f), indice: `Avec x l'âge du fils : ${k}x + ${n} = 2(x + ${n}).`, correction: `${k}x + ${n} = 2x + ${2 * n} ; ${k - 2}x = ${n} ; x = ${f} ans.` }; }
      if (t === 3) { const x = alea(5, 30), s = 2 * x + 20; return { consigne: `Deux frères se partagent ${2 * x + 20} €. L'aîné reçoit 20 € de plus que le cadet. Combien reçoit le cadet ?`, ligne: "[d] €", verifier: verifSol(x), indice: `x + (x + 20) = ${s}.`, correction: `2x + 20 = ${s} ; 2x = ${s - 20} ; x = ${x} €.` }; }
      if (t === 4) { const l = alea(3, 15), P = 6 * l; return { consigne: `Un rectangle a une longueur égale au double de sa largeur. Son périmètre est ${P} m. Quelle est sa largeur ?`, ligne: "[d] m", verifier: verifSol(l), indice: "Avec x la largeur : 2x + 2 × 2x = périmètre.", correction: `6x = ${P} ; x = ${l} m.` }; }
      const n = alea(10, 40), d = alea(4, n - 4), total = 2 * d + (n - d); return { consigne: `Une tirelire contient ${n} pièces de 1 € et de 2 €, pour un total de ${total} €. Combien y a-t-il de pièces de 2 € ?`, ligne: "[d] pièces", verifier: verifSol(d), indice: `Avec x pièces de 2 € : 2x + (${n} − x) = ${total}.`, correction: `x + ${n} = ${total} ; x = ${d}.` };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Tester si un nombre est solution", activites: ["tester"] },
    { competence: "Trouver mentalement une solution", activites: ["mental"] },
    { competence: "Résoudre x + a = b", activites: ["additif"] },
    { competence: "Résoudre ax = b", activites: ["multiplicatif", "quotient"] },
    { competence: "Résoudre ax + b = c", activites: ["ax-b-c"] },
    { competence: "Résoudre ax + b = cx + d", activites: ["ax-b-cx-d"] },
    { competence: "Résoudre ax + b = cx + d", activites: ["ax-b-cx-d"] },
    { competence: "Équations avec parenthèses", activites: ["parentheses"] },
    { competence: "Nombre de solutions", activites: ["nb-solutions"] },
    { competence: "Mettre en équation", activites: ["traduire"] },
    { competence: "Programme de calcul", activites: ["programme"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
