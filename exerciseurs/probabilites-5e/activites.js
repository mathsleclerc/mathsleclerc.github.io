/* =====================================================================
   EXERCISEUR « PROBABILITÉS » — 5e, chapitre 13

   Les activités sont rangées comme les 5 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Vocabulaire des probabilités";
const F2 = "Feuille 2 — L'échelle des probabilités";
const F3 = "Feuille 3 — Calculer une probabilité";
const F4 = "Feuille 4 — Roues, urnes et jeux";
const F5 = "Feuille 5 — Fréquences et probabilités";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const F = (a, b) => frac(a, b);
const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
const FS = (a, b) => { const g = pgcd(a, b); return b / g === 1 ? String(a / g) : F(a / g, b / g); };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const pluriel = (c, n) => n > 1 ? c + "s" : c;

/* ---------- Dessins : un sac de billes, des roues ---------- */
const TEINTES = { rouge: "#d64541", bleue: "#3f7fd0", verte: "#2e8b57", jaune: "#e0b020", noire: "#333" };
function sac(compo) { // compo : [[couleur, nombre]]
  const billes = melanger(compo.flatMap(([c, n]) => Array(n).fill(c)));
  const par = Math.min(8, Math.ceil(Math.sqrt(billes.length * 2))), l = par * 30 + 30, h = Math.ceil(billes.length / par) * 30 + 40;
  const s = svg("svg", { viewBox: `0 0 ${l} ${h}`, width: l, height: h, class: "sac", role: "img", "aria-label": "Sac de billes : " + compo.map(([c, n]) => `${n} ${pluriel(c, n)}`).join(", ") });
  s.append(svg("rect", { x: 4, y: 12, width: l - 8, height: h - 16, rx: 22, class: "sac-fond" }));
  billes.forEach((c, i) => s.append(svg("circle", { cx: 30 + (i % par) * 30, cy: 36 + Math.floor(i / par) * 30, r: 12, fill: TEINTES[c], class: "bille" })));
  return s;
}
/* Roue : parts = [[couleur, angle en degrés]] */
function roue(parts) {
  const s = svg("svg", { viewBox: "0 0 220 220", width: 200, height: 200, class: "roue", role: "img", "aria-label": "Roue de loterie" });
  const C = { x: 110, y: 110 }, r = 96, P = t => ({ x: C.x + r * Math.cos(t), y: C.y + r * Math.sin(t) });
  let t = -Math.PI / 2;
  for (const [c, a] of parts) {
    const t1 = t + a * Math.PI / 180, A = P(t), B = P(t1);
    s.append(svg("path", { d: `M${C.x},${C.y} L${A.x},${A.y} A${r},${r} 0 ${a > 180 ? 1 : 0} 1 ${B.x},${B.y} Z`, fill: TEINTES[c], class: "secteur-roue" }));
    t = t1;
  }
  s.append(svg("path", { d: `M110,4 l-9,-2 l9,18 l9,-18 z`, class: "roue-fleche" }));
  return s;
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "issues",
    titre: "Compter les issues",
    description: "Combien de résultats possibles ?",
    generer() {
      const mot = choisir(["MATHS", "COLLEGE", "PROBA", "HASARD", "CINQUIEME"]);
      const lettres = [...new Set(mot)];
      const [exp, n, liste] = choisir([
        ["On lance une pièce de monnaie.", 2, "pile ; face"],
        ["On lance un dé à six faces.", 6, "1 ; 2 ; 3 ; 4 ; 5 ; 6"],
        ["On lance un dé à douze faces numérotées de 1 à 12.", 12, "1 ; 2 ; … ; 12"],
        [`On tire une lettre au hasard dans le mot ${mot} et on note la lettre obtenue.`, lettres.length, lettres.join(" ; ")],
        ["On lance deux pièces l'une après l'autre.", 4, "PP ; PF ; FP ; FF"],
        ["On tire une carte dans un jeu de 32 cartes.", 32, "les 32 cartes"],
        ["On choisit un jour de la semaine au hasard.", 7, "lundi ; mardi ; … ; dimanche"]
      ]);
      return {
        consigne: `${exp} Combien y a-t-il d'issues possibles ?`,
        ligne: "[n] issues",
        verifier: v => verifierNombre(v[0], n),
        indice: "Écris la liste de tous les résultats possibles, sans en oublier, sans répéter deux fois le même.",
        correction: `${n} issues : ${liste}.`
      };
    }
  },

  {
    groupe: F1,
    id: "impossible-certain",
    titre: "Impossible, certain ou possible ?",
    description: "Avec un dé à six faces.",
    generer() {
      const [ev, rep] = choisir([
        ["obtenir 7", "Impossible"], ["obtenir 0", "Impossible"], ["obtenir un nombre plus grand que 6", "Impossible"],
        ["obtenir un nombre entre 1 et 6", "Certain"], ["obtenir un nombre inférieur à 10", "Certain"], ["ne pas obtenir 8", "Certain"],
        ["obtenir un nombre pair", "Possible"], ["obtenir 6", "Possible"], ["obtenir un multiple de 3", "Possible"], ["obtenir au moins 2", "Possible"]
      ]);
      return {
        consigne: `On lance un dé à six faces. L'évènement « ${ev} » est :`,
        choix: ["Impossible", "Possible", "Certain"], verifier: choixVerif(rep),
        indice: "Impossible : aucune issue ne le réalise. Certain : toutes les issues le réalisent.",
        correction: `« ${ev} » est ${rep.toLowerCase()}.`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "ecritures",
    titre: "Fraction, décimal, pourcentage",
    description: "« Une chance sur quatre » = 0,25 = 25 %.",
    generer() {
      const [a, b] = choisir([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 10], [3, 10], [7, 10], [1, 20], [1, 100], [9, 10]]);
      const d = a / b, type = choisir(["dec", "pct", "mots"]);
      if (type === "mots") return {
        consigne: `« ${a === 1 ? "Une chance" : a + " chances"} sur ${b} » : écris cette probabilité sous forme décimale.`,
        ligne: "[d]", verifier: v => verifierNombre(v[0], d),
        indice: `${a} chance(s) sur ${b}, c'est ${a} ÷ ${b}.`, correction: `${F(a, b)} = ${a} ÷ ${b} = ${nb(d)}`
      };
      return {
        consigne: type === "dec" ? `Écris la probabilité ${F(a, b)} sous forme décimale.` : `Écris la probabilité ${F(a, b)} sous forme de pourcentage.`,
        ligne: type === "dec" ? `${F(a, b)} = [d]` : `${F(a, b)} = [d] %`,
        verifier: v => verifierNombre(v[0], type === "dec" ? d : rr(d * 100)),
        indice: type === "dec" ? `Calcule ${a} ÷ ${b}.` : `Calcule ${a} ÷ ${b}, puis multiplie par 100.`,
        correction: type === "dec" ? `${F(a, b)} = ${nb(d)}` : `${F(a, b)} = ${nb(d)} = ${nb(d * 100)} %`
      };
    }
  },

  {
    groupe: F2,
    id: "est-probabilite",
    titre: "Est-ce une probabilité ?",
    description: "Un nombre entre 0 et 1.",
    generer() {
      const [x, ok] = choisir([["0,7", true], ["1,2", false], [F(3, 8), true], [F(9, 7), false], ["150 %", false], ["45 %", true], ["0", true], ["1", true], ["−0,3", false], [F(5, 5), true], ["2", false], ["0,05", true]]);
      return {
        consigne: `Le nombre ${x} peut-il être une probabilité ?`,
        choix: ["Oui", "Non"], verifier: choixVerif(ok ? "Oui" : "Non"),
        indice: "Une probabilité est toujours comprise entre 0 et 1 (entre 0 % et 100 %).",
        correction: ok ? `Oui : ${x} est compris entre 0 et 1.` : `Non : ${x} n'est pas compris entre 0 et 1.`
      };
    }
  },

  {
    groupe: F2,
    id: "echelle",
    titre: "L'échelle des probabilités",
    description: "Impossible, peu probable, une chance sur deux…",
    generer() {
      const [ev, rep] = choisir([
        ["obtenir pile en lançant une pièce", "Une chance sur deux"], ["obtenir 3 en lançant un dé", "Peu probable"],
        ["obtenir 7 en lançant un dé", "Impossible"], ["obtenir un nombre entre 1 et 6 avec un dé", "Certain"],
        ["ne pas gagner au loto", "Très probable"], ["gagner au loto", "Peu probable"], ["obtenir un nombre pair avec un dé", "Une chance sur deux"],
        ["obtenir au moins 2 avec un dé", "Très probable"], ["obtenir 1 dix fois de suite avec un dé", "Peu probable"],
        ["tirer une boule rouge dans un sac de 9 rouges et 1 bleue", "Très probable"]
      ]);
      return {
        consigne: `Où placer l'évènement « ${ev} » sur l'échelle des probabilités ?`,
        choix: ["Impossible", "Peu probable", "Une chance sur deux", "Très probable", "Certain"], verifier: choixVerif(rep),
        indice: "Estime la probabilité : 0, proche de 0, 0,5, proche de 1 ou 1 ?",
        correction: `« ${ev} » : ${rep.toLowerCase()}.`
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "proba-de",
    titre: "Probabilités avec un dé",
    description: "Issues favorables ÷ issues possibles.",
    generer() {
      const [ev, k] = choisir([
        ["obtenir 5", 1], ["obtenir un nombre pair", 3], ["obtenir un nombre impair", 3], ["obtenir au moins 5", 2], ["obtenir un multiple de 3", 2],
        ["obtenir un nombre premier", 3], ["obtenir moins de 5", 4], ["obtenir un diviseur de 6", 4], ["ne pas obtenir 6", 5]
      ]);
      return {
        consigne: `On lance un dé équilibré à six faces. Quelle est la probabilité de l'évènement « ${ev} » ?`,
        ligne: "[f]",
        verifier: v => verifierFraction(v[0], k, 6),
        indice: "Compte les faces qui réalisent l'évènement, puis divise par 6.",
        correction: `${k} issue${k > 1 ? "s" : ""} favorable${k > 1 ? "s" : ""} sur 6 : P = ${F(k, 6)}${pgcd(k, 6) > 1 ? " = " + FS(k, 6) : ""}`
      };
    }
  },

  {
    groupe: F3,
    id: "proba-sac",
    titre: "Tirer une bille dans un sac",
    description: "Le sac est dessiné.",
    generer() {
      const coul = melanger(["rouge", "bleue", "verte", "jaune"]).slice(0, alea(2, 3));
      const compo = coul.map(c => [c, alea(1, 6)]), tot = compo.reduce((s, [, n]) => s + n, 0);
      const [c, n] = choisir(compo), non = Math.random() < 0.25;
      const k = non ? tot - n : n;
      return {
        consigne: `On tire une bille au hasard dans ce sac. Quelle est la probabilité ${non ? `de <strong>ne pas</strong> tirer une bille ${c}` : `de tirer une bille ${c}`} ?`,
        figure: sac(compo),
        ligne: "[f]",
        verifier: v => verifierFraction(v[0], k, tot),
        indice: "Compte toutes les billes, puis celles qui conviennent.",
        correction: `${k} bille${k > 1 ? "s" : ""} sur ${tot} : P = ${F(k, tot)}${pgcd(k, tot) > 1 ? " = " + FS(k, tot) : ""}`
      };
    }
  },

  {
    groupe: F3,
    id: "proba-situation",
    titre: "Probabilités en situation",
    description: "Lettres, cartes, élèves…",
    generer() {
      const f = alea(10, 18), g = alea(8, 15), t = f + g;
      const mot = choisir(["PROBABILITE", "MATHEMATIQUES", "ALEATOIRE", "BANANE"]);
      const voy = [...mot].filter(x => "AEIOUY".includes(x)).length;
      const [q, a, b, expl] = choisir([
        [`Une classe compte ${f} filles et ${g} garçons. On choisit un élève au hasard. Probabilité que ce soit une fille ?`, f, t, `${f} filles sur ${t} élèves`],
        [`On tire une lettre au hasard dans le mot ${mot}. Probabilité de tirer une voyelle ?`, voy, mot.length, `${voy} voyelles sur ${mot.length} lettres`],
        ["On tire une carte dans un jeu de 32 cartes. Probabilité de tirer un as ?", 4, 32, "4 as sur 32 cartes"],
        ["On tire une carte dans un jeu de 32 cartes. Probabilité de tirer un cœur ?", 8, 32, "8 cœurs sur 32 cartes"],
        ["On tire une carte dans un jeu de 32 cartes. Probabilité de tirer une figure (valet, dame ou roi) ?", 12, 32, "12 figures sur 32 cartes"],
        ["On choisit au hasard un nombre entier de 1 à 20. Probabilité qu'il soit multiple de 5 ?", 4, 20, "5, 10, 15, 20 : 4 nombres sur 20"]
      ]);
      return {
        consigne: q, ligne: "[f]", verifier: v => verifierFraction(v[0], a, b),
        indice: "Probabilité = nombre de cas favorables ÷ nombre de cas possibles.",
        correction: `${expl} : P = ${F(a, b)}${pgcd(a, b) > 1 ? " = " + FS(a, b) : ""}`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "contraire",
    titre: "Évènement contraire",
    description: "P(non A) = 1 − P(A)",
    generer() {
      const pct = Math.random() < 0.5, p = pct ? alea(5, 95) : alea(1, 99) / 100;
      const ev = choisir(["il pleuve demain", "le bus soit en retard", "Léa gagne la partie", "la graine germe"]);
      const contr = { "il pleuve demain": "il ne pleuve pas", "le bus soit en retard": "le bus ne soit pas en retard", "Léa gagne la partie": "Léa ne gagne pas", "la graine germe": "la graine ne germe pas" }[ev];
      return {
        consigne: `La probabilité que ${ev} est ${pct ? p + " %" : nb(p)}. Quelle est la probabilité que ${contr} ?`,
        ligne: pct ? "[d] %" : "[d]",
        verifier: v => verifierNombre(v[0], pct ? 100 - p : rr(1 - p)),
        indice: pct ? "Les deux probabilités ont pour somme 100 %." : "Les deux probabilités ont pour somme 1.",
        correction: pct ? `100 % − ${p} % = ${100 - p} %` : `1 − ${nb(p)} = ${nb(1 - p)}`
      };
    }
  },

  {
    groupe: F4,
    id: "roue",
    titre: "Roues de loterie",
    description: "Secteurs égaux ou non.",
    generer() {
      const egaux = Math.random() < 0.5, cible = choisir(["rouge", "bleue", "verte"]);
      let parts;
      if (egaux) {
        const n = choisir([4, 5, 6, 8]);
        parts = Array.from({ length: n }, () => [choisir(["rouge", "bleue", "verte", "jaune"]), 360 / n]);
        if (!parts.some(p => p[0] === cible)) parts[0][0] = cible;
        const k = parts.filter(p => p[0] === cible).length;
        return { consigne: `La roue est partagée en ${n} secteurs égaux. Quelle est la probabilité que la flèche s'arrête sur le ${cible === "bleue" ? "bleu" : cible === "verte" ? "vert" : "rouge"} ?`,
          figure: roue(parts), ligne: "[f]", verifier: v => verifierFraction(v[0], k, n),
          indice: "Compte les secteurs de cette couleur parmi tous les secteurs.", correction: `${k} secteur${k > 1 ? "s" : ""} sur ${n} : P = ${FS(k, n)}` };
      }
      const [a1, a2, a3] = choisir([[180, 90, 90], [180, 120, 60], [90, 90, 180], [240, 60, 60], [120, 120, 120], [270, 60, 30], [150, 150, 60]]);
      parts = melanger([["rouge", a1], ["bleue", a2], ["verte", a3]]);
      const ang = parts.find(p => p[0] === cible)[1];
      return { consigne: `La roue a des secteurs de ${parts.map(p => p[1] + "°").join(", ")}. Quelle est la probabilité que la flèche s'arrête sur le ${cible === "bleue" ? "bleu" : cible === "verte" ? "vert" : "rouge"} ?`,
        figure: roue(parts), ligne: "[f]", verifier: v => verifierFraction(v[0], ang, 360),
        indice: "Les secteurs n'ont pas la même taille : la probabilité est l'angle du secteur divisé par 360°.",
        correction: `${ang}° sur 360° : P = ${F(ang, 360)} = ${FS(ang, 360)}` };
    }
  },

  {
    groupe: F4,
    id: "meilleur-sac",
    titre: "Quel sac choisir ?",
    description: "Comparer deux probabilités.",
    generer() {
      let r1, b1, r2, b2;
      do { r1 = alea(1, 6); b1 = alea(1, 8); r2 = alea(1, 6); b2 = alea(1, 8); } while (r1 * (r2 + b2) === r2 * (r1 + b1) || (r1 === r2 && b1 === b2));
      const p1 = r1 / (r1 + b1), p2 = r2 / (r2 + b2), bon = p1 > p2 ? "Sac A" : "Sac B";
      return {
        consigne: `On gagne si on tire une bille rouge. Sac A : ${r1} ${pluriel("rouge", r1)} et ${b1} ${pluriel("bleue", b1)}. Sac B : ${r2} ${pluriel("rouge", r2)} et ${b2} ${pluriel("bleue", b2)}. Quel sac faut-il choisir ?`,
        choix: ["Sac A", "Sac B"], verifier: choixVerif(bon),
        indice: "Calcule la probabilité de tirer une rouge dans chaque sac (rouges ÷ total), puis compare.",
        correction: `Sac A : ${F(r1, r1 + b1)} ≈ ${nb(Math.round(p1 * 100) / 100)} ; sac B : ${F(r2, r2 + b2)} ≈ ${nb(Math.round(p2 * 100) / 100)}. Il faut choisir le ${bon.toLowerCase()}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "frequence",
    titre: "Calculer une fréquence",
    description: "Effectif ÷ nombre d'essais.",
    generer() {
      const n = choisir([20, 25, 40, 50, 100, 200, 500]), k = alea(1, n - 1), d = k / n;
      if (!Number.isInteger(d * 1000)) return this.generer();
      const [exp, issue] = choisir([["On a lancé une pièce", "pile"], ["On a lancé un dé", "le 6"], ["On a lancé une punaise", "« pointe en l'air »"], ["On a tiré une bille (avec remise)", "une bille rouge"]]);
      return {
        consigne: `${exp} ${n} fois. On a obtenu ${k} fois ${issue}. Quelle est la fréquence de ${issue} (en écriture décimale) ?`,
        ligne: "[d]", verifier: v => verifierNombre(v[0], d),
        indice: "Fréquence = nombre de fois où l'issue est obtenue ÷ nombre total d'essais.",
        correction: `${F(k, n)} = ${nb(d)}`
      };
    }
  },

  {
    groupe: F5,
    id: "prevoir",
    titre: "Prévoir un nombre de résultats",
    description: "Probabilité × nombre d'essais.",
    generer() {
      const [desc, a, b] = choisir([["obtenir pile avec une pièce", 1, 2], ["obtenir 6 avec un dé", 1, 6], ["obtenir un nombre pair avec un dé", 1, 2], ["tirer un cœur dans un jeu de cartes", 1, 4], ["tirer une bille rouge dans un sac de 3 rouges et 7 bleues", 3, 10]]);
      const n = b * choisir([10, 20, 50, 100]);
      return {
        consigne: `On répète ${n} fois l'expérience. Environ combien de fois peut-on s'attendre à ${desc} ?`,
        ligne: "environ [n] fois", verifier: v => verifierNombre(v[0], n * a / b),
        indice: `La probabilité est ${F(a, b)} : sur un grand nombre d'essais, la fréquence est proche de ${F(a, b)}.`,
        correction: `${F(a, b)} × ${n} = ${n * a / b} fois environ (ce n'est qu'une estimation : le hasard fait varier ce nombre).`
      };
    }
  },

  {
    groupe: F5,
    id: "frequence-probabilite",
    titre: "Fréquence ou probabilité ?",
    description: "Vrai ou faux ?",
    generer() {
      const [aff, vrai, expl] = choisir([
        ["Si on lance 10 fois une pièce, on obtient forcément 5 piles.", false, "le hasard fait varier les résultats, surtout sur peu d'essais"],
        ["Sur 10 000 lancers d'une pièce, la fréquence de pile sera proche de 0,5.", true, "les fréquences se stabilisent autour de la probabilité"],
        ["Après 5 faces de suite, on a plus de chances d'obtenir pile au lancer suivant.", false, "la pièce n'a pas de mémoire : la probabilité reste 0,5"],
        ["On peut estimer la probabilité qu'une punaise tombe sur la pointe en la lançant un grand nombre de fois.", true, "on prend la fréquence observée comme estimation"],
        ["Une fréquence peut être supérieure à 1.", false, "l'effectif est toujours inférieur ou égal au nombre d'essais"],
        ["Si on lance 6 fois un dé, on obtient forcément au moins un 6.", false, "on peut ne jamais obtenir de 6"],
        ["Plus on fait d'essais, plus la fréquence a de chances d'être proche de la probabilité.", true, "c'est la stabilisation des fréquences"]
      ]);
      return {
        consigne: `« ${aff} »`, choix: ["Vrai", "Faux"], verifier: choixVerif(vrai ? "Vrai" : "Faux"),
        indice: "La probabilité est une valeur théorique ; la fréquence est observée et varie d'une série à l'autre.",
        correction: `${vrai ? "Vrai" : "Faux"} : ${expl}.`
      };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Compter les issues", activites: ["issues"] },
    { competence: "Impossible, certain, possible", activites: ["impossible-certain"] },
    { competence: "Écritures d'une probabilité", activites: ["ecritures"] },
    { competence: "Valeurs possibles d'une probabilité", activites: ["est-probabilite", "echelle"] },
    { competence: "Probabilités avec un dé", activites: ["proba-de"] },
    { competence: "Tirage dans un sac", activites: ["proba-sac"] },
    { competence: "Probabilités en situation", activites: ["proba-situation"] },
    { competence: "Évènement contraire", activites: ["contraire"] },
    { competence: "Roues de loterie", activites: ["roue"] },
    { competence: "Comparer des probabilités", activites: ["meilleur-sac"] },
    { competence: "Calculer une fréquence", activites: ["frequence"] },
    { competence: "Fréquence et probabilité", activites: ["prevoir", "frequence-probabilite"] }
  ]
};
