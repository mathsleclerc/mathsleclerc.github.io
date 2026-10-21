/* =====================================================================
   EXERCISEUR « PROBABILITÉS » — 3e, chapitre 6 (une épreuve)

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste ».
   ===================================================================== */

const F1 = "Feuille 1 — Vocabulaire des probabilités";
const F2 = "Feuille 2 — Calculer des probabilités";
const F3 = "Feuille 3 — Contraire, « et », « ou »";
const F4 = "Feuille 4 — Situations sans équiprobabilité";
const F5 = "Feuille 5 — Fréquences et simulation";
const F6 = "Feuille 6 — Problèmes type brevet";
const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
const Fr = (a, b) => { const g = pgcd(a, b); return b / g === 1 ? String(a / g) : frac(a / g, b / g); };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const COUL = { rouges: "#d62828", bleues: "#1d4e89", vertes: "#2a9d8f", jaunes: "#f4c430" };

/* Urne dessinée : { rouges: 3, bleues: 5, … } */
function urneSVG(contenu) {
  const billes = Object.entries(contenu).flatMap(([c, n]) => Array(n).fill(c));
  const parLigne = 6, lignes = Math.ceil(billes.length / parLigne), W = parLigne * 30 + 30, H = lignes * 30 + 30;
  const s = svg("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "img", "aria-label": "Urne" });
  s.append(svg("path", { d: `M8,6 L8,${H - 6} L${W - 8},${H - 6} L${W - 8},6`, style: "fill:none;stroke:var(--cours);stroke-width:3;stroke-linejoin:round" }));
  billes.forEach((c, k) => s.append(svg("circle", { cx: 30 + (k % parLigne) * 30, cy: H - 22 - Math.floor(k / parLigne) * 30, r: 11, style: `fill:${COUL[c]};stroke:#333;stroke-width:1` })));
  return s;
}

const ACTIVITES = [
  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "vocabulaire",
    titre: "Certain, impossible ou possible ?",
    description: "Le vocabulaire.",
    generer() {
      const [e, r] = choisir([
        ["Obtenir 7 avec un dé à six faces.", "impossible"], ["Obtenir un nombre inférieur à 7 avec un dé à six faces.", "certain"],
        ["Obtenir un nombre pair avec un dé.", "possible"], ["Tirer une boule rouge dans une urne ne contenant que des boules bleues.", "impossible"],
        ["Tirer une carte rouge ou noire dans un jeu de cartes.", "certain"], ["Obtenir pile en lançant une pièce.", "possible"],
        ["Obtenir une somme de 13 avec deux dés.", "impossible"], ["Obtenir une somme supérieure à 1 avec deux dés.", "certain"]
      ]);
      return { consigne: `« ${e} » Cet événement est…`, choix: ["certain", "impossible", "possible"], verifier: choixVerif(r), indice: "Certain : toujours réalisé. Impossible : jamais réalisé.", correction: `Il est ${r}.` };
    }
  },

  {
    groupe: F1,
    id: "issues",
    titre: "Compter les issues",
    description: "Combien d'issues favorables ?",
    generer() {
      const [e, n] = choisir([
        ["« obtenir un nombre pair » avec un dé à six faces", 3], ["« obtenir un nombre premier » avec un dé à six faces", 3], ["« obtenir au moins 5 » avec un dé à six faces", 2],
        ["« tirer un roi » dans un jeu de 32 cartes", 4], ["« tirer un cœur » dans un jeu de 32 cartes", 8], ["« tirer une figure » dans un jeu de 32 cartes", 12],
        ["« obtenir un multiple de 3 » avec un dé à six faces", 2], ["« obtenir un diviseur de 6 » avec un dé à six faces", 4]
      ]);
      return { consigne: `Combien d'issues réalisent l'événement ${e} ?`, ligne: "[n]", verifier: v => verifierNombre(v[0], n), indice: "Écris la liste des issues qui conviennent.", correction: `${n} issues.` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "urne",
    titre: "Tirer une boule",
    description: "Favorables sur total.",
    generer() {
      const c = { rouges: alea(1, 6), bleues: alea(1, 6), vertes: alea(0, 4) };
      if (!c.vertes) delete c.vertes;
      const tot = Object.values(c).reduce((a, b) => a + b, 0), coul = choisir(Object.keys(c));
      return { consigne: `On tire une boule au hasard dans cette urne. Quelle est la probabilité de tirer une boule ${coul.slice(0, -1)} ?`, figure: urneSVG(c), ligne: "[f]", verifier: v => verifierFraction(v[0], c[coul], tot), indice: "Compte les boules de cette couleur, puis toutes les boules.", correction: `${c[coul]} boules ${coul} sur ${tot} : P = ${frac(c[coul], tot)}${pgcd(c[coul], tot) > 1 ? " = " + Fr(c[coul], tot) : ""}.` };
    }
  },

  {
    groupe: F2,
    id: "cartes",
    titre: "Dés, cartes, lettres",
    description: "Équiprobabilité.",
    generer() {
      const [e, a, b] = choisir([
        ["tirer un roi dans un jeu de 32 cartes", 4, 32], ["tirer un cœur dans un jeu de 32 cartes", 8, 32], ["tirer une figure (valet, dame, roi) dans un jeu de 32 cartes", 12, 32],
        ["tirer l'as de pique dans un jeu de 32 cartes", 1, 32], ["obtenir un nombre pair avec un dé", 3, 6], ["obtenir 5 ou 6 avec un dé", 2, 6],
        ["choisir une voyelle parmi les lettres du mot CAHIER", 3, 6], ["choisir la lettre M parmi les lettres du mot MATHEMATIQUES", 2, 13]
      ]);
      return { consigne: `Quelle est la probabilité de ${e} ?`, ligne: "[f]", verifier: v => verifierFraction(v[0], a, b), indice: "Nombre d'issues favorables sur nombre total d'issues.", correction: `P = ${frac(a, b)}${pgcd(a, b) > 1 ? " = " + Fr(a, b) : ""}` };
    }
  },

  {
    groupe: F2,
    id: "formes",
    titre: "Fraction, décimal, pourcentage",
    description: "Changer d'écriture.",
    generer() {
      const [a, b] = choisir([[1, 4], [3, 4], [1, 2], [2, 5], [3, 5], [1, 5], [7, 10], [3, 20], [9, 25], [1, 8]]);
      return Math.random() < 0.5
        ? { consigne: `Écris la probabilité ${frac(a, b)} sous forme décimale.`, ligne: "[d]", verifier: v => verifierNombre(v[0], a / b), indice: "Divise le numérateur par le dénominateur.", correction: `${frac(a, b)} = ${nb(a / b)}` }
        : { consigne: `Écris la probabilité ${frac(a, b)} en pourcentage.`, ligne: "[d] %", verifier: v => verifierNombre(v[0], rr(a / b * 100)), indice: "Écris la fraction avec le dénominateur 100.", correction: `${frac(a, b)} = ${nb(a / b)} = ${nb(a / b * 100)} %` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "contraire",
    titre: "Événement contraire",
    description: "P(non A) = 1 − P(A).",
    generer() {
      const p = choisir([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6, 0.72, 0.85, 0.08]);
      const ctx = choisir(["de gagner à un jeu", "qu'il pleuve demain", "qu'un composant soit défectueux", "de tirer une boule rouge"]);
      return { consigne: `La probabilité ${ctx} est ${nb(p)}. Quelle est la probabilité de l'événement contraire ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], rr(1 - p)), indice: "P(non A) = 1 − P(A).", correction: `1 − ${nb(p)} = ${nb(1 - p)}` };
    }
  },

  {
    groupe: F3,
    id: "et-ou",
    titre: "« Et », « ou » avec un dé",
    description: "Intersection et réunion.",
    generer() {
      const E = { pair: [2, 4, 6], impair: [1, 3, 5], premier: [2, 3, 5], "au moins 4": [4, 5, 6], "multiple de 3": [3, 6], "inférieur à 3": [1, 2] };
      const [n1, n2] = melanger(Object.keys(E)).slice(0, 2), A = E[n1], B = E[n2];
      const et = Math.random() < 0.5, S = et ? A.filter(x => B.includes(x)) : [...new Set([...A, ...B])];
      return { consigne: `On lance un dé équilibré. A : « le nombre est ${n1} » ; B : « le nombre est ${n2} ». Quelle est la probabilité de « A ${et ? "et" : "ou"} B » ?`, ligne: "[f]", verifier: v => verifierFraction(v[0], S.length, 6), indice: et ? "« A et B » : les issues communes à A et à B." : "« A ou B » : les issues de A, de B, ou des deux.", correction: `A = {${A.join(" ; ")}}, B = {${B.join(" ; ")}} ; A ${et ? "et" : "ou"} B = {${S.join(" ; ") || "aucune issue"}} : P = ${frac(S.length, 6)}${S.length && pgcd(S.length, 6) > 1 ? " = " + Fr(S.length, 6) : ""}.` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "manquante",
    titre: "Probabilité manquante",
    description: "La somme vaut 1.",
    generer() {
      let p, r; do { p = [alea(1, 4), alea(1, 4), alea(1, 3)].map(x => x / 10); r = rr(1 - p[0] - p[1] - p[2]); } while (r <= 0);
      return { consigne: `Un osselet a quatre faces. On admet : P(dos) = ${nb(p[0])}, P(ventre) = ${nb(p[1])}, P(creux) = ${nb(p[2])}. Que vaut P(plat) ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], r), indice: "La somme des probabilités de toutes les issues vaut 1.", correction: `1 − ${nb(p[0])} − ${nb(p[1])} − ${nb(p[2])} = ${nb(r)}` };
    }
  },

  {
    groupe: F4,
    id: "roue",
    titre: "Roue à secteurs inégaux",
    description: "Proportionnel à l'angle.",
    generer() {
      const a = choisir([30, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270]);
      return { consigne: `Sur une roue, le secteur gagnant a un angle de ${a}°. Quelle est la probabilité de gagner ? (fraction irréductible)`, ligne: "[f]", verifier: v => verifierFraction(v[0], a / pgcd(a, 360), 360 / pgcd(a, 360)), indice: "La probabilité est l'angle du secteur divisé par 360°.", correction: `${a} ÷ 360 = ${Fr(a, 360)}` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "frequence",
    titre: "Calculer une fréquence",
    description: "Effectif ÷ total.",
    generer() {
      const N = choisir([50, 100, 200, 500, 1000]), k = Math.round(N * (alea(10, 70) / 100));
      return { consigne: `On a lancé une punaise ${N} fois ; elle est tombée ${k} fois « pointe en haut ». Quelle est la fréquence de « pointe en haut » (écriture décimale) ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], rr(k / N)), indice: "Fréquence = effectif ÷ effectif total.", correction: `${k} ÷ ${N} = ${nb(k / N)}` };
    }
  },

  {
    groupe: F5,
    id: "grands-nombres",
    titre: "Fluctuation ou stabilisation ?",
    description: "La loi des grands nombres.",
    generer() {
      const [q, r] = choisir([
        ["Sur 10 lancers, Léo obtient 4 fois « 6 ». Son dé est-il forcément truqué ?", "Non, 10 lancers c'est trop peu"],
        ["On lance une pièce 10 000 fois. La fréquence de « pile » sera probablement…", "proche de 0,5"],
        ["Pour estimer la probabilité qu'une punaise tombe pointe en haut, il vaut mieux…", "faire un très grand nombre de lancers"]
      ]);
      const choix = { "Non, 10 lancers c'est trop peu": ["Non, 10 lancers c'est trop peu", "Oui, il est truqué"], "proche de 0,5": ["proche de 0,5", "exactement 0,5", "impossible à prévoir"], "faire un très grand nombre de lancers": ["faire un très grand nombre de lancers", "faire 10 lancers très soigneusement"] }[r];
      return { consigne: q, choix, verifier: choixVerif(r), indice: "Les fréquences fluctuent, mais se stabilisent autour de la probabilité quand le nombre d'essais devient très grand.", correction: r + "." };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "equitable",
    titre: "Jeu équitable ?",
    description: "Même chance de gagner ?",
    generer() {
      const [q, r, c] = choisir([
        ["On lance deux dés. Alice gagne si la somme est paire, Bob si elle est impaire.", "Oui", "18 issues sur 36 pour chacun."],
        ["On lance deux dés. Alice gagne si le produit est pair, Bob s'il est impair.", "Non", "Produit impair : 9 issues sur 36 seulement."],
        ["On lance un dé. Alice gagne si le résultat est 1 ou 2, Bob sinon.", "Non", "Alice : 2 chances sur 6, Bob : 4 sur 6."],
        ["On lance deux pièces. Alice gagne si les deux faces sont identiques, Bob sinon.", "Oui", "PP, FF pour Alice ; PF, FP pour Bob : 2 sur 4 chacun."]
      ]);
      return { consigne: q + " Le jeu est-il équitable ?", choix: ["Oui", "Non"], verifier: choixVerif(r), indice: "Calcule la probabilité de gagner de chaque joueur.", correction: `${r === "Oui" ? "Oui" : "Non"} : ${c}` };
    }
  },

  {
    groupe: F6,
    id: "composition",
    titre: "Retrouver la composition d'un sac",
    description: "Problème type brevet.",
    generer() {
      const n = choisir([20, 25, 40, 50]), pr = choisir([0.2, 0.3, 0.4]), pv = choisir([0.2, 0.3, 0.4]);
      if (pr + pv >= 0.9) return this.generer();
      const pb = rr(1 - pr - pv), b = Math.round(pb * n);
      if (Math.abs(pb * n - b) > 1e-9 || Math.abs(pr * n - Math.round(pr * n)) > 1e-9) return this.generer();
      return { consigne: `Un sac contient des jetons rouges, verts et bleus. P(rouge) = ${nb(pr)}, P(vert) = ${nb(pv)}, et il y a ${b} jetons bleus. Combien y a-t-il de jetons en tout ?`, ligne: "[n] jetons", verifier: v => verifierNombre(v[0], n), indice: "Calcule P(bleu), puis divise le nombre de jetons bleus par cette probabilité.", correction: `P(bleu) = 1 − ${nb(pr)} − ${nb(pv)} = ${nb(pb)} ; ${b} ÷ ${nb(pb)} = ${n} jetons` };
    }
  },

  {
    groupe: F6,
    id: "comparer",
    titre: "Quelle urne choisir ?",
    description: "Comparer des probabilités.",
    generer() {
      let a, n, b, m; do { n = alea(5, 12); a = alea(1, n - 1); m = alea(5, 20); b = alea(1, m - 1); } while (Math.abs(a / n - b / m) < 0.02);
      const bonne = a / n > b / m ? "l'urne A" : "l'urne B";
      return { consigne: `Urne A : ${a} boules gagnantes sur ${n}. Urne B : ${b} boules gagnantes sur ${m}. Laquelle donne la plus grande probabilité de gagner ?`, choix: ["l'urne A", "l'urne B"], verifier: choixVerif(bonne), indice: "Compare les probabilités (fractions), pas le nombre de boules gagnantes.", correction: `P(A) = ${Fr(a, n)} ≈ ${nb(Math.round(a / n * 1000) / 1000)} ; P(B) = ${Fr(b, m)} ≈ ${nb(Math.round(b / m * 1000) / 1000)} : ${bonne}.` };
    }
  }
];

/* ---------- Le test « Je me teste » ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Vocabulaire", activites: ["vocabulaire"] },
    { competence: "Compter les issues", activites: ["issues"] },
    { competence: "Calculer une probabilité", activites: ["urne"] },
    { competence: "Calculer une probabilité", activites: ["cartes"] },
    { competence: "Écrire une probabilité", activites: ["formes"] },
    { competence: "Événement contraire", activites: ["contraire"] },
    { competence: "« Et », « ou »", activites: ["et-ou"] },
    { competence: "Roue à secteurs inégaux", activites: ["roue"] },
    { competence: "La somme des probabilités vaut 1", activites: ["manquante"] },
    { competence: "Fréquence et probabilité", activites: ["frequence", "grands-nombres"] },
    { competence: "Comparer des probabilités", activites: ["comparer", "equitable"] },
    { competence: "Problème type brevet", activites: ["composition"] }
  ]
};
