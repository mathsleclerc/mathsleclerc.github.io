/* =====================================================================
   EXERCISEUR « PROBABILITÉS » — 6e, chapitre 11

   Les activités sont rangées comme les 5 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Expériences aléatoires et évènements";
const F2 = "Feuille 2 — L'échelle des probabilités";
const F3 = "Feuille 3 — Calculer une probabilité";
const F4 = "Feuille 4 — Expériences à deux étapes";
const F5 = "Feuille 5 — Fréquence et probabilité";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const F = (a, b) => frac(a, b);
const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
const simplifiable = (a, b) => pgcd(a, b) > 1;

function selection(liste) {
  const choisies = new Set();
  let actif = true;
  const boutons = liste.map((t, i) => {
    const b = el("button", { type: "button", class: "btn etiquette-choix", "aria-pressed": "false" });
    b.innerHTML = t;
    b.addEventListener("click", () => { if (!actif) return; choisies.has(i) ? choisies.delete(i) : choisies.add(i); b.setAttribute("aria-pressed", String(choisies.has(i))); });
    return b;
  });
  return { noeud: el("div", { class: "etiquettes" }, ...boutons), choisies, boutons, bloquer: () => { actif = false; } };
}
/* Probabilité attendue a/b : on accepte toute fraction égale */
const verifierProba = (v, a, b) => verifierFraction(v, a, b);

/* ---------- Dessins : un sac de billes, une roue ---------- */
const TEINTES = { rouge: "#d64541", bleue: "#3f7fd0", verte: "#2e8b57", jaune: "#e0b020", noire: "#333" };
function sac(compo) { // compo : [[couleur, nombre]]
  const billes = melanger(compo.flatMap(([c, n]) => Array(n).fill(c)));
  const par = Math.min(8, Math.ceil(Math.sqrt(billes.length * 2))), l = par * 30 + 30, h = Math.ceil(billes.length / par) * 30 + 40;
  const s = svg("svg", { viewBox: `0 0 ${l} ${h}`, width: l, height: h, class: "sac", role: "img", "aria-label": "Sac de billes : " + compo.map(([c, n]) => `${n} ${c}${n > 1 ? "s" : ""}`).join(", ") });
  s.append(svg("rect", { x: 4, y: 12, width: l - 8, height: h - 16, rx: 22, class: "sac-fond" }));
  billes.forEach((c, i) => s.append(svg("circle", { cx: 30 + (i % par) * 30, cy: 36 + Math.floor(i / par) * 30, r: 12, fill: TEINTES[c], class: "bille" })));
  return s;
}
function roue(couleurs) { // secteurs égaux
  const n = couleurs.length, s = svg("svg", { viewBox: "0 0 220 220", width: 200, height: 200, class: "roue", role: "img", "aria-label": `Roue partagée en ${n} secteurs égaux` });
  const C = { x: 110, y: 110 }, r = 96;
  const P = t => ({ x: C.x + r * Math.cos(t), y: C.y + r * Math.sin(t) });
  couleurs.forEach((c, i) => {
    const t0 = -Math.PI / 2 + i * 2 * Math.PI / n, t1 = t0 + 2 * Math.PI / n, A = P(t0), B = P(t1);
    s.append(svg("path", { d: `M${C.x},${C.y} L${A.x},${A.y} A${r},${r} 0 0 1 ${B.x},${B.y} Z`, fill: TEINTES[c], class: "secteur-roue" }));
  });
  s.append(svg("path", { d: `M110,4 l-9,-2 l9,18 l9,-18 z`, class: "roue-fleche" }));
  return s;
}
const pluriel = (c, n) => n > 1 ? c + "s" : c;

/* ---------- Expériences ---------- */
const EXPERIENCES_ALEA = [
  ["On lance une pièce de monnaie et on regarde la face du dessus.", true],
  ["On lance un dé à six faces et on note le nombre obtenu.", true],
  ["On tire une carte au hasard dans un jeu de 32 cartes.", true],
  ["On tire une bille sans regarder dans un sac de billes de couleurs différentes.", true],
  ["On fait tourner une roue de loterie et on note la couleur.", true],
  ["On lâche une balle et on regarde si elle tombe.", false],
  ["On compte le nombre de jours de la semaine prochaine.", false],
  ["On met de l'eau au congélateur pendant une journée et on regarde si elle a gelé.", false],
  ["On regarde quelle est la somme de 3 et de 4.", false],
  ["On tire au sort le nom d'un élève de la classe.", true],
  ["On regarde l'heure à laquelle le soleil se lèvera demain, d'après le calendrier.", false]
];

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "aleatoire-ou-pas",
    titre: "Expérience aléatoire ou pas ?",
    description: "Peut-on prévoir le résultat ?",
    generer() {
      const [t, alea_] = choisir(EXPERIENCES_ALEA);
      return {
        consigne: `${t}<br>Cette expérience est-elle aléatoire ?`,
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === alea_ ? "juste" : "faux" }),
        indice: "Une expérience est aléatoire si on connaît tous les résultats possibles, sans pouvoir prévoir lequel va se produire.",
        correction: alea_ ? "Oui : on connaît les issues possibles, mais on ne peut pas prévoir laquelle va sortir." : "Non : on peut prévoir le résultat à l'avance."
      };
    }
  },

  {
    groupe: F1,
    id: "nombre-issues",
    titre: "Combien d'issues ?",
    description: "Compter tous les résultats possibles.",
    generer() {
      const n = alea(4, 20);
      const [t, r, liste] = choisir([
        ["On lance une pièce de monnaie.", 2, "pile, face"],
        ["On lance un dé à six faces.", 6, "1, 2, 3, 4, 5, 6"],
        [`On tire une carte parmi ${n} cartes numérotées de 1 à ${n}.`, n, `les nombres de 1 à ${n}`],
        ["On tire une lettre au hasard parmi les lettres du mot MATHS (une lettre par carte).", 5, "M, A, T, H, S"],
        ["On fait tourner une roue partagée en 8 secteurs numérotés de 1 à 8.", 8, "1, 2, …, 8"],
        ["On choisit au hasard un jour de la semaine.", 7, "lundi, mardi, …, dimanche"],
        ["On choisit au hasard un mois de l'année.", 12, "janvier, février, …, décembre"]
      ]);
      return {
        consigne: `${t} Combien y a-t-il d'issues possibles ?`,
        ligne: "[n] issues",
        verifier: v => verifierNombre(v[0], r),
        indice: "Écris la liste de tous les résultats possibles, puis compte-les.",
        correction: `${r} issues : ${liste}.`
      };
    }
  },

  {
    groupe: F1,
    id: "issues-evenement",
    titre: "Les issues qui réalisent un évènement",
    description: "Sélectionner toutes les issues favorables.",
    generer() {
      const n = choisir([8, 10, 12]);
      const [nom, test] = choisir([
        ["« obtenir un nombre pair »", k => k % 2 === 0],
        ["« obtenir un nombre impair »", k => k % 2 === 1],
        ["« obtenir un multiple de 3 »", k => k % 3 === 0],
        [`« obtenir un nombre supérieur à ${n - 4} »`, k => k > n - 4],
        ["« obtenir un nombre inférieur ou égal à 4 »", k => k <= 4],
        ["« obtenir un diviseur de 12 »", k => 12 % k === 0],
        ["« obtenir un nombre à deux chiffres »", k => k >= 10]
      ]);
      const issues = [...Array(n).keys()].map(k => k + 1);
      if (!issues.some(test)) return this.generer();
      const sel = selection(issues.map(String));
      return {
        consigne: `On lance un dé équilibré à ${n} faces, numérotées de 1 à ${n}. Sélectionne toutes les issues qui réalisent l'évènement ${nom}.`,
        figure: sel.noeud,
        verifier() {
          if (!sel.choisies.size) return { etat: "incomplet", message: "Sélectionne au moins une issue." };
          const manque = issues.filter((k, i) => test(k) && !sel.choisies.has(i)).length, trop = [...sel.choisies].filter(i => !test(issues[i])).length;
          return !manque && !trop ? { etat: "juste" } : { etat: "faux", message: trop ? "Une des issues choisies ne réalise pas l'évènement." : "Il manque des issues." };
        },
        indice: "Passe en revue chaque nombre de 1 à " + n + ".",
        correction: `L'évènement ${nom} est réalisé par : ${issues.filter(test).join(", ")}.`,
        surCorrection() { sel.boutons.forEach((b, i) => b.classList.toggle("bonne", test(issues[i]))); },
        bloquer: sel.bloquer
      };
    }
  },

  {
    groupe: F1,
    id: "impossible-certain",
    titre: "Impossible, possible ou certain ?",
    description: "Un évènement peut-il se réaliser ?",
    generer() {
      const [t, r, pourquoi] = choisir([
        ["On lance un dé à six faces. « Obtenir 7 »", "impossible", "aucune face ne porte 7"],
        ["On lance un dé à six faces. « Obtenir un nombre inférieur à 7 »", "certain", "toutes les faces portent un nombre inférieur à 7"],
        ["On lance un dé à six faces. « Obtenir un nombre pair »", "possible", "2, 4 et 6 le réalisent, mais pas 1, 3 et 5"],
        ["Un sac ne contient que des billes rouges. « Tirer une bille rouge »", "certain", "toutes les billes sont rouges"],
        ["Un sac ne contient que des billes rouges. « Tirer une bille bleue »", "impossible", "il n'y a pas de bille bleue"],
        ["Une roue a 8 secteurs numérotés de 1 à 8. « Obtenir 0 »", "impossible", "aucun secteur ne porte 0"],
        ["Une roue a 8 secteurs numérotés de 1 à 8. « Obtenir un nombre entre 1 et 8 »", "certain", "toutes les issues le réalisent"],
        ["On tire une carte numérotée de 1 à 10. « Obtenir un multiple de 5 »", "possible", "5 et 10 le réalisent"],
        ["On lance une pièce. « Obtenir pile ou face »", "certain", "ce sont les deux seules issues"]
      ]);
      return {
        consigne: `${t} : cet évènement est…`,
        choix: ["impossible", "possible", "certain"],
        verifier: (v, c) => ({ etat: c === r ? "juste" : "faux" }),
        indice: "Impossible : aucune issue ne le réalise. Certain : toutes les issues le réalisent.",
        correction: `Il est ${r} : ${pourquoi}.`
      };
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "echelle",
    titre: "Sur l'échelle des probabilités",
    description: "De « impossible » à « certain ».",
    generer() {
      const [t, r] = choisir([
        ["Obtenir 7 avec un dé à six faces.", 0],
        ["Obtenir 6 avec un dé à six faces.", 1],
        ["Obtenir pile en lançant une pièce.", 2],
        ["Obtenir un nombre pair avec un dé à six faces.", 2],
        ["Obtenir un nombre supérieur à 1 avec un dé à six faces.", 3],
        ["Obtenir un nombre inférieur à 7 avec un dé à six faces.", 4],
        ["Tirer une bille rouge dans un sac de 9 billes rouges et 1 bleue.", 3],
        ["Tirer une bille bleue dans un sac de 9 billes rouges et 1 bleue.", 1],
        ["Tirer un as dans un jeu de 32 cartes.", 1]
      ]);
      const niveaux = ["impossible", "peu probable", "une chance sur deux", "très probable", "certain"];
      return {
        consigne: `Où placer cet évènement sur l'échelle des probabilités ? <strong>${t}</strong>`,
        choix: niveaux,
        verifier: (v, c) => ({ etat: c === niveaux[r] ? "juste" : "faux" }),
        indice: "Compare le nombre d'issues favorables au nombre total d'issues.",
        correction: `C'est « ${niveaux[r]} ».`
      };
    }
  },

  {
    groupe: F2,
    id: "est-probabilite",
    titre: "Ce nombre peut-il être une probabilité ?",
    description: "Une probabilité est comprise entre 0 et 1.",
    generer() {
      const [t, ok] = choisir([["0,7", true], ["1,2", false], ["0", true], ["1", true], [F(3, 2), false], [F(2, 3), true], ["45 %", true], ["120 %", false], ["−0,3", false], ["100 %", true], ["0,05", true], [F(5, 4), false], ["2", false]]);
      return {
        consigne: `Le nombre <strong>${t}</strong> peut-il être une probabilité ?`,
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === ok ? "juste" : "faux" }),
        indice: "Une probabilité est un nombre compris entre 0 (impossible) et 1 (certain), c'est-à-dire entre 0 % et 100 %.",
        correction: ok ? `Oui : ${t} est compris entre 0 et 1.` : `Non : ${t} n'est pas compris entre 0 et 1.`
      };
    }
  },

  {
    groupe: F2,
    id: "trois-ecritures",
    titre: "Fraction, nombre décimal, pourcentage",
    description: "Écrire une probabilité de trois façons.",
    generer() {
      const [a, b] = choisir([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [3, 20], [1, 25], [7, 25]]);
      return {
        consigne: `Une probabilité vaut ${F(a, b)}. Écris-la sous forme d'un nombre décimal, puis d'un pourcentage.`,
        ligne: `${F(a, b)} = [d] = [d] %`,
        verifier(v) {
          const r = [verifierNombre(v[0], a / b), verifierNombre(v[1], 100 * a / b)];
          if (r.some(x => x.etat === "incomplet")) return { etat: "incomplet", message: "Complète les deux cases." };
          if (r[0].etat === "faux") return { etat: "faux", message: `Divise ${a} par ${b}.` };
          return r[1].etat === "juste" ? { etat: "juste" } : { etat: "faux", message: "Un pourcentage, c'est une fraction de dénominateur 100." };
        },
        indice: `${a} ÷ ${b} donne le nombre décimal ; pour le pourcentage, écris la fraction sur 100.`,
        correction: `${F(a, b)} = ${nb(a / b)} = ${F(nb(100 * a / b), 100)} = ${nb(100 * a / b)} %.`
      };
    }
  },

  {
    groupe: F2,
    id: "ranger-evenements",
    titre: "Du moins probable au plus probable",
    description: "Ranger des évènements selon leur probabilité.",
    generer() {
      const R = alea(2, 5), B = alea(1, 4), V = alea(1, 4);
      const tot = R + B + V + 1;
      const ev = [
        { t: "tirer une bille rouge", p: R / tot }, { t: "tirer une bille bleue", p: B / tot }, { t: "tirer une bille verte", p: V / tot },
        { t: "tirer une bille jaune", p: 1 / tot }, { t: "tirer une bille noire", p: 0 }, { t: "tirer une bille qui n'est pas noire", p: 1 }
      ];
      const items = melanger(ev).slice(0, 4);
      if (new Set(items.map(x => x.p)).size < 4) return this.generer();
      const ordre = [...items.keys()].sort((i, j) => items[i].p - items[j].p);
      const r = rangement(items.map(x => ({ texte: x.t })), "<");
      return {
        consigne: `Un sac contient ${R} billes rouges, ${B} ${pluriel("bleue", B)}, ${V} ${pluriel("verte", V)} et 1 jaune. On tire une bille au hasard. Range ces évènements du moins probable au plus probable : clique dessus dans l'ordre.`,
        figure: [sac([["rouge", R], ["bleue", B], ["verte", V], ["jaune", 1]]), r.noeud],
        verifier() {
          const o = r.ordre();
          if (o.length < items.length) return { etat: "incomplet", message: "Range tous les évènements." };
          return o.every((i, k) => items[i].p === items[ordre[k]].p) ? { etat: "juste" } : { etat: "faux", message: "Compte les billes de chaque couleur." };
        },
        indice: "Plus il y a de billes d'une couleur, plus il est probable de la tirer.",
        correction: ordre.map(i => `${items[i].t} (${items[i].p === 0 ? "0" : items[i].p === 1 ? "1" : F(Math.round(items[i].p * tot), tot)})`).join(" ; ") + ".",
        bloquer: r.bloquer
      };
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: F3,
    id: "proba-de",
    titre: "Probabilités avec un dé",
    description: "Nombre d'issues favorables sur nombre d'issues.",
    generer() {
      const n = choisir([6, 6, 8, 10, 12]);
      const [nom, test] = choisir([
        ["obtenir un nombre pair", k => k % 2 === 0], ["obtenir 5", k => k === 5], ["obtenir un multiple de 3", k => k % 3 === 0],
        ["obtenir un nombre supérieur ou égal à 5", k => k >= 5], ["obtenir un nombre inférieur à 3", k => k < 3], ["obtenir un diviseur de 6", k => 6 % k === 0]
      ]);
      const fav = [...Array(n).keys()].map(k => k + 1).filter(test);
      return {
        consigne: `On lance un dé équilibré à ${n} faces numérotées de 1 à ${n}. Quelle est la probabilité de l'évènement « ${nom} » ?`,
        ligne: "[f]",
        verifier(v) {
          const r = verifierProba(v[0], fav.length, n);
          if (r.etat === "faux" && lireEntier(v[0].num) === n) r.message = "Le nombre total d'issues va au dénominateur.";
          return r;
        },
        indice: "Probabilité = nombre d'issues favorables ÷ nombre total d'issues.",
        correction: `Issues favorables : ${fav.join(", ")} (${fav.length}) sur ${n} issues : ${F(fav.length, n)}${simplifiable(fav.length, n) ? ` = ${F(fav.length / pgcd(fav.length, n), n / pgcd(fav.length, n))}` : ""}.`
      };
    }
  },

  {
    groupe: F3,
    id: "proba-sac",
    titre: "Probabilités avec un sac de billes",
    description: "Compter les billes.",
    generer() {
      const compo = [["rouge", alea(1, 6)], ["bleue", alea(1, 5)], ["verte", alea(0, 4)]].filter(([, k]) => k > 0);
      const tot = compo.reduce((s, [, k]) => s + k, 0);
      const [c, k] = choisir(compo);
      const contraire = Math.random() < 0.25;
      const fav = contraire ? tot - k : k;
      return {
        consigne: `Un sac contient ${compo.map(([c2, k2]) => k2 > 1 ? `${k2} billes ${c2}s` : `1 bille ${c2}`).join(", ")}. On tire une bille au hasard. Quelle est la probabilité de tirer une bille ${contraire ? "qui n'est pas " + c : c} ?`,
        figure: sac(compo),
        ligne: "[f]",
        verifier: v => verifierProba(v[0], fav, tot),
        indice: `Il y a ${tot} billes en tout.`,
        correction: `${fav} bille${fav > 1 ? "s" : ""} favorable${fav > 1 ? "s" : ""} sur ${tot} : ${F(fav, tot)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "proba-mot",
    titre: "Une lettre au hasard",
    description: "Attention aux lettres répétées.",
    generer() {
      const mot = choisir(["PROBABILITE", "MATHEMATIQUES", "ANANAS", "PAPILLON", "BANANE", "CHOCOLAT", "COLLEGE"]);
      const lettres = [...mot], n = lettres.length;
      const cas = choisir(["lettre", "voyelle"]);
      let fav, nom;
      if (cas === "voyelle") { fav = lettres.filter(l => "AEIOUY".includes(l)).length; nom = "une voyelle"; }
      else { const l = choisir(lettres.filter((x, i) => lettres.indexOf(x) !== i).concat(lettres)); fav = lettres.filter(x => x === l).length; nom = `la lettre ${l}`; }
      return {
        consigne: `On écrit chaque lettre du mot <strong>${mot}</strong> sur une carte, et on tire une carte au hasard. Quelle est la probabilité d'obtenir ${nom} ?`,
        ligne: "[f]",
        verifier: v => verifierProba(v[0], fav, n),
        indice: `Le mot a ${n} lettres : il y a ${n} cartes.`,
        correction: `${fav} carte${fav > 1 ? "s" : ""} sur ${n} : ${F(fav, n)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "quel-sac",
    titre: "Dans quel sac vaut-il mieux tirer ?",
    description: "Comparer deux probabilités.",
    generer() {
      let a1, t1, a2, t2;
      do { t1 = alea(4, 12); a1 = alea(1, t1 - 1); t2 = alea(4, 12); a2 = alea(1, t2 - 1); } while (a1 * t2 === a2 * t1 || a1 === a2 || t1 === t2);
      const bon = a1 * t2 > a2 * t1 ? "Sac A" : "Sac B";
      return {
        consigne: `On gagne si on tire une bille rouge. Sac A : ${a1} ${pluriel("rouge", a1)} et ${t1 - a1} ${pluriel("bleue", t1 - a1)}. Sac B : ${a2} ${pluriel("rouge", a2)} et ${t2 - a2} ${pluriel("bleue", t2 - a2)}. Dans quel sac vaut-il mieux tirer ?`,
        figure: [el("div", { class: "deux-sacs" }, el("div", {}, el("p", {}, "Sac A"), sac([["rouge", a1], ["bleue", t1 - a1]])), el("div", {}, el("p", {}, "Sac B"), sac([["rouge", a2], ["bleue", t2 - a2]])))],
        choix: ["Sac A", "Sac B"],
        verifier: (v, c) => ({ etat: c === bon ? "juste" : "faux", message: "Ce n'est pas le nombre de billes rouges qui compte, mais la probabilité : rouges ÷ total." }),
        indice: "Calcule la probabilité de tirer une rouge dans chaque sac, puis compare.",
        correction: `Sac A : ${F(a1, t1)} ≈ ${nb(Math.round(a1 / t1 * 100) / 100)} ; sac B : ${F(a2, t2)} ≈ ${nb(Math.round(a2 / t2 * 100) / 100)}. Il vaut mieux tirer dans le ${bon.toLowerCase()}.`
      };
    }
  },

  {
    groupe: F3,
    id: "roue",
    titre: "La roue de loterie",
    description: "Secteurs égaux : on compte les secteurs.",
    generer() {
      const n = choisir([4, 5, 6, 8, 10]);
      const pal = melanger(["rouge", "bleue", "verte", "jaune"]).slice(0, 3);
      const couleurs = [...Array(n)].map((_, i) => i < 3 ? pal[i] : choisir(pal));
      const c = choisir(pal), k = couleurs.filter(x => x === c).length;
      return {
        consigne: `La roue est partagée en ${n} secteurs égaux. Quelle est la probabilité que la flèche s'arrête sur la couleur <strong>${{ rouge: "rouge", bleue: "bleu", verte: "vert", jaune: "jaune" }[c]}</strong> ?`,
        figure: roue(melanger(couleurs)),
        ligne: "[f]",
        verifier(v) {
          const r = verifierProba(v[0], k, n);
          if (r.etat === "faux" && lireEntier(v[0].num) === 1 && lireEntier(v[0].den) === 3) r.message = "Il y a trois couleurs, mais elles n'occupent pas toutes autant de secteurs !";
          return r;
        },
        indice: "Compte les secteurs de cette couleur, et le nombre total de secteurs.",
        correction: `${k} secteur${k > 1 ? "s" : ""} sur ${n} : ${F(k, n)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "tirage-au-sort",
    titre: "Tombola et tirage au sort",
    description: "Une fraction, puis un pourcentage.",
    generer() {
      const [t, fav, tot] = choisir([
        (() => { const n = choisir([20, 25, 50, 100, 200]), g = alea(1, n / 5) ; return [`Dans une tombola, il y a ${n} billets dont ${g} gagnants. Léa achète un billet.`, g, n]; })(),
        (() => { const n = choisir([20, 25]), f = alea(8, n - 6); return [`Une classe compte ${n} élèves dont ${f} filles. On tire au sort un élève. Quelle est la probabilité que ce soit une fille ?`, f, n]; })()
      ]);
      return {
        consigne: `${t} Donne la probabilité ${t.includes("tombola") ? "qu'elle gagne " : ""}sous forme d'une fraction, puis d'un pourcentage.`,
        ligne: "[f] = [d] %",
        verifier(v) {
          const r = verifierProba(v[0], fav, tot);
          if (r.etat !== "juste") return r;
          return verifierNombre(v[1], 100 * fav / tot);
        },
        indice: `Pour le pourcentage, écris la fraction avec 100 au dénominateur.`,
        correction: `${F(fav, tot)} = ${F(nb(100 * fav / tot), 100)} = ${nb(100 * fav / tot)} %.`
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "deux-des",
    titre: "Deux dés : la somme",
    description: "Le tableau à double entrée des 36 issues.",
    generer() {
      const s = alea(2, 12), fav = 6 - Math.abs(7 - s);
      const table = el("table", { class: "tab-effectifs tab-des" });
      const tete = el("tr", {}, el("th", {}, "+"), ...[1, 2, 3, 4, 5, 6].map(k => el("th", {}, String(k))));
      table.append(tete);
      for (let i = 1; i <= 6; i++) table.append(el("tr", {}, el("th", {}, String(i)), ...[1, 2, 3, 4, 5, 6].map(j => el("td", { class: i + j === s ? "" : "" }, String(i + j)))));
      return {
        consigne: `On lance deux dés équilibrés à six faces et on additionne les deux nombres. Le tableau donne toutes les sommes. Quelle est la probabilité d'obtenir une somme de <strong>${s}</strong> ?`,
        figure: table,
        ligne: "[f]",
        verifier(v) {
          const r = verifierProba(v[0], fav, 36);
          if (r.etat === "faux" && lireEntier(v[0].den) === 11) r.message = "Il y a 11 sommes possibles, mais elles ne sont pas équiprobables : il faut compter les 36 cases du tableau.";
          return r;
        },
        indice: `Compte les cases où la somme vaut ${s}, sur les 36 cases.`,
        correction: `${fav} case${fav > 1 ? "s" : ""} sur 36 : ${F(fav, 36)}.`,
        surCorrection() { table.querySelectorAll("td").forEach(td => td.classList.toggle("case-favorable", Number(td.textContent) === s)); }
      };
    }
  },

  {
    groupe: F4,
    id: "arbre",
    titre: "Compter les issues avec un arbre",
    description: "Pièce et roue, menu, deux tirages…",
    generer() {
      const [t, n1, n2, l1, l2, q, fav] = choisir([
        ["On lance une pièce, puis on fait tourner une roue à 3 secteurs égaux : rouge, bleu, vert.", 2, 3, ["P", "F"], ["R", "B", "V"], "obtenir pile et rouge", 1],
        ["À la cantine, on choisit une entrée (salade ou soupe), puis un plat (poulet, poisson ou pâtes), au hasard.", 2, 3, ["salade", "soupe"], ["poulet", "poisson", "pâtes"], "avoir de la soupe", 3],
        ["Un sac contient une bille rouge et une bleue. On tire une bille, on la remet, puis on en tire une deuxième.", 2, 2, ["R", "B"], ["R", "B"], "tirer deux billes de la même couleur", 2],
        ["On lance deux pièces de monnaie.", 2, 2, ["P", "F"], ["P", "F"], "obtenir exactement une fois pile", 2],
        ["On lance un dé à 4 faces (1 à 4), puis une pièce.", 4, 2, ["1", "2", "3", "4"], ["P", "F"], "obtenir un nombre pair et face", 2]
      ]);
      const tot = n1 * n2;
      return {
        consigne: `${t} Toutes les issues sont équiprobables.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p class="rep">1. Nombre d'issues : [n]</p></div><div class="etape-pb"><p class="rep">2. Probabilité de l'évènement « ${q} » : [f]</p></div>`,
        verifier(v) {
          const n = lireNombre(v[0]);
          if (isNaN(n)) return { etat: "incomplet", message: "Donne le nombre d'issues." };
          if (n !== tot) return { etat: "faux", message: `Fais un arbre : ${n1} branches, puis ${n2} branches au bout de chacune.` };
          return verifierProba(v[1], fav, tot);
        },
        indice: `${n1} possibilités pour la première étape, et pour chacune ${n2} pour la seconde.`,
        correction: `${n1} × ${n2} = ${tot} issues : ${l1.flatMap(a => l2.map(b => a + "-" + b)).join(", ")}. Probabilité : ${F(fav, tot)}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */

  {
    groupe: F5,
    id: "frequence",
    titre: "Calculer une fréquence",
    description: "Nombre de fois ÷ nombre d'essais.",
    generer() {
      const n = choisir([20, 25, 40, 50, 100, 200]), k = alea(1, n / 2);
      const [t, ev] = choisir([[`Tom a lancé un dé ${n} fois. Il a obtenu ${k} fois le 6.`, "le 6"], [`Anna a lancé une pièce ${n} fois. Elle a obtenu ${k} fois pile.`, "pile"], [`Sur ${n} tirages avec remise, Noé a tiré ${k} fois une bille rouge.`, "une bille rouge"]]);
      return {
        consigne: `${t} Quelle est la fréquence d'apparition de ${ev} ? Donne une fraction, puis un nombre décimal.`,
        ligne: "[f] = [d]",
        verifier(v) {
          const r = verifierFraction(v[0], k, n);
          if (r.etat !== "juste") return r;
          return verifierNombre(v[1], k / n);
        },
        indice: "Fréquence = nombre de fois où l'évènement est réalisé ÷ nombre total d'essais.",
        correction: `${F(k, n)} = ${nb(k / n)}.`
      };
    }
  },

  {
    groupe: F5,
    id: "frequence-ou-probabilite",
    titre: "Fréquence ou probabilité : vrai ou faux ?",
    description: "Ce que disent les lancers répétés.",
    generer() {
      const [t, v, e] = choisir([
        ["Si je lance une pièce 10 fois, j'obtiendrai forcément 5 fois pile.", false, "La fréquence varie d'une série à l'autre ; elle se rapproche de 1/2 seulement quand on fait beaucoup de lancers."],
        ["Plus on fait de lancers, plus la fréquence se rapproche de la probabilité.", true, "C'est ce qu'on observe quand on répète une expérience un grand nombre de fois."],
        ["J'ai obtenu 4 fois pile de suite, donc au prochain lancer, face est plus probable.", false, "La pièce n'a pas de mémoire : la probabilité reste 1/2."],
        ["Deux élèves qui lancent 20 fois un dé peuvent trouver des fréquences différentes.", true, "Sur peu de lancers, les résultats varient beaucoup."],
        ["Une fréquence peut être égale à 1,5.", false, "Une fréquence est comprise entre 0 et 1, comme une probabilité."],
        ["Pour une punaise, on ne peut pas compter les issues : on estime la probabilité avec une fréquence sur beaucoup de lancers.", true, "Les deux issues ne sont pas équiprobables, donc on utilise les fréquences."]
      ]);
      return {
        consigne: `Vrai ou faux ? <strong>${t}</strong>`,
        choix: ["Vrai", "Faux"],
        verifier: (x, c) => ({ etat: (c === "Vrai") === v ? "juste" : "faux" }),
        indice: "La fréquence dépend des essais réalisés ; la probabilité est une valeur théorique.",
        correction: `${v ? "Vrai" : "Faux"} : ${e}`
      };
    }
  },

  {
    groupe: F5,
    id: "estimer-composition",
    titre: "Estimer à partir des fréquences",
    description: "Que contient le sac ?",
    generer() {
      const total = 10, rouges = alea(2, 8), n = 200;
      const obs = Math.round(n * rouges / total + alea(-6, 6));
      const options = melanger([rouges, rouges - 2, rouges + 2].filter(x => x > 0 && x < 10)).map(String);
      if (options.length < 3) return this.generer();
      return {
        consigne: `Un sac contient 10 billes, rouges ou bleues. Anna tire une bille, note sa couleur et la remet. Elle recommence ${n} fois : elle obtient ${obs} billes rouges. Combien le sac contient-il probablement de billes rouges ?`,
        choix: options,
        verifier: (v, c) => ({ etat: c === String(rouges) ? "juste" : "faux" }),
        indice: `Calcule la fréquence ${F(obs, n)}, puis cherche la fraction ${F("…", 10)} la plus proche.`,
        correction: `La fréquence est ${F(obs, n)} ≈ ${nb(Math.round(obs / n * 100) / 100)}, proche de ${F(rouges, 10)} = ${nb(rouges / 10)} : il y a probablement ${rouges} billes rouges.`
      };
    }
  }

];

/* ---------- Le test « Je me teste » : 10 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "10 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Reconnaître une expérience aléatoire", activites: ["aleatoire-ou-pas", "nombre-issues"] },
    { competence: "Les issues d'un évènement", activites: ["issues-evenement", "impossible-certain"] },
    { competence: "L'échelle des probabilités", activites: ["echelle", "est-probabilite"] },
    { competence: "Écrire une probabilité de plusieurs façons", activites: ["trois-ecritures"] },
    { competence: "Calculer une probabilité", activites: ["proba-de", "proba-mot"] },
    { competence: "Billes et roues", activites: ["proba-sac", "roue"] },
    { competence: "Comparer des probabilités", activites: ["quel-sac", "ranger-evenements"] },
    { competence: "Expériences à deux étapes", activites: ["arbre", "deux-des"] },
    { competence: "Calculer une fréquence", activites: ["frequence", "tirage-au-sort"] },
    { competence: "Fréquence et probabilité", activites: ["frequence-ou-probabilite", "estimer-composition"] }
  ]
};
