/* =====================================================================
   EXERCISEUR « GRANDEURS EN FONCTION L'UNE DE L'AUTRE » — 5e, chapitre 14

   Les activités sont rangées comme les 5 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — En fonction de…";
const F2 = "Feuille 2 — Tableaux de valeurs";
const F3 = "Feuille 3 — Construire un graphique";
const F4 = "Feuille 4 — Lire un graphique";
const F5 = "Feuille 5 — Graphique et proportionnalité";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const q = (y, x) => { const v = y / x, r2 = Math.round(v * 100) / 100; return (Math.abs(v - r2) < 1e-9 ? "= " : "≈ ") + nb(r2); };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });

/* ---------- Repère SVG ----------
   graphique({ xmax, ymax, px, py, nomX, nomY, courbes: [[[x, y], …]], points: [[x, y]], etiquetteX, etiquetteY })
   px, py : pas des graduations numérotées ; le quadrillage suit l'unité « grille » */
function graphique({ xmax, ymax, px = 1, py = 1, gx = px, gy = py, nomX = "", nomY = "", courbes = [], points = [] }) {
  const L = 300, H = 220, m = { g: 38, d: 30, h: 22, b: 30 };
  const W = L + m.g + m.d, Ht = H + m.h + m.b;
  const X = x => m.g + x / xmax * L, Y = y => m.h + H - y / ymax * H;
  const s = svg("svg", { viewBox: `0 0 ${W} ${Ht}`, width: W, height: Ht, class: "graphique-fct", role: "img", "aria-label": "Graphique" });
  const trait = (x1, y1, x2, y2, st) => s.append(svg("line", { x1, y1, x2, y2, style: st }));
  for (let x = 0; x <= xmax + 1e-9; x += gx) trait(X(x), Y(0), X(x), Y(ymax), "stroke:#c9d3df;stroke-width:0.7");
  for (let y = 0; y <= ymax + 1e-9; y += gy) trait(X(0), Y(y), X(xmax), Y(y), "stroke:#c9d3df;stroke-width:0.7");
  trait(X(0), Y(0), X(xmax) + 14, Y(0), "stroke:#1D4E89;stroke-width:1.6");
  trait(X(0), Y(0), X(0), Y(ymax) - 14, "stroke:#1D4E89;stroke-width:1.6");
  const texte = (x, y, t, ancre = "middle") => { const e = svg("text", { x, y, "text-anchor": ancre, style: "font-size:11px;fill:currentColor" }); e.textContent = t; s.append(e); };
  for (let x = 0; x <= xmax + 1e-9; x += px) texte(X(x), Y(0) + 14, nb(x));
  for (let y = py; y <= ymax + 1e-9; y += py) texte(X(0) - 5, Y(y) + 4, nb(y), "end");
  texte(X(xmax) + 14, Y(0) - 6, nomX, "end"); texte(X(0) + 6, m.h - 8, nomY, "start");
  for (const c of courbes) s.append(svg("polyline", { points: c.map(([x, y]) => `${X(x)},${Y(y)}`).join(" "), style: "fill:none;stroke:#E07A5F;stroke-width:2.5;stroke-linejoin:round" }));
  for (const [x, y] of points) {
    trait(X(x) - 5, Y(y) - 5, X(x) + 5, Y(y) + 5, "stroke:#E07A5F;stroke-width:2.2"); trait(X(x) - 5, Y(y) + 5, X(x) + 5, Y(y) - 5, "stroke:#E07A5F;stroke-width:2.2");
  }
  return s;
}
const echantillon = (f, a, b, n = 60) => Array.from({ length: n + 1 }, (_, k) => { const x = a + (b - a) * k / n; return [x, f(x)]; });

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "depend",
    titre: "Une grandeur dépend-elle de l'autre ?",
    description: "Reconnaître une dépendance.",
    generer() {
      const [g1, g2, oui] = choisir([
        ["du côté d'un carré", "l'aire du carré", true], ["de la durée d'un trajet à vitesse constante", "la distance parcourue", true],
        ["du nombre de croissants achetés", "le prix payé", true], ["du rayon d'un cercle", "le périmètre du cercle", true],
        ["de la masse de pommes achetées", "le prix payé", true], ["du prénom d'un élève", "sa pointure", false],
        ["de la couleur d'une voiture", "sa vitesse maximale", false], ["du jour de la semaine", "le résultat d'un lancer de dé", false]
      ]);
      return {
        consigne: `Peut-on exprimer ${g2} en fonction ${g1} ?`,
        choix: ["Oui", "Non"], verifier: choixVerif(oui ? "Oui" : "Non"),
        indice: "Si on connaît la première grandeur, peut-on calculer ou prévoir la seconde ?",
        correction: oui ? `Oui : ${g2} dépend ${g1}.` : `Non : ${g2} ne dépend pas ${g1}.`
      };
    }
  },

  {
    groupe: F1,
    id: "formule-situation",
    titre: "Choisir la formule",
    description: "Traduire une situation par une formule.",
    generer() {
      const a = alea(2, 9), b = alea(10, 30), p = choisir([1.2, 1.5, 2.5, 0.8, 3]);
      const [sit, bonne, autres] = choisir([
        [`Le prix P de n baguettes à ${nb(p)} € l'une.`, `P = ${nb(p)} × n`, [`P = ${nb(p)} + n`, `P = n ÷ ${nb(p)}`]],
        [`Le prix P d'un taxi : ${b} € de prise en charge, puis ${a} € par kilomètre parcouru (d km).`, `P = ${b} + ${a} × d`, [`P = ${a} + ${b} × d`, `P = (${b} + ${a}) × d`]],
        ["Le périmètre P d'un carré de côté c.", "P = 4 × c", ["P = c × c", "P = c + 4"]],
        ["L'aire A d'un carré de côté c.", "A = c × c", ["A = 4 × c", "A = 2 × c"]],
        [`La distance d parcourue en t heures à ${a * 10} km/h.`, `d = ${a * 10} × t`, [`d = ${a * 10} + t`, `d = t ÷ ${a * 10}`]],
        [`Le nombre T de tables quand on range n élèves par ${a} (sans reste).`, `T = n ÷ ${a}`, [`T = ${a} × n`, `T = n − ${a}`]]
      ]);
      return {
        consigne: sit + " Quelle formule convient ?",
        choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne),
        indice: "Teste la formule avec un exemple chiffré simple.",
        correction: bonne
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "calculer-formule",
    titre: "Calculer avec une formule",
    description: "Compléter un tableau de valeurs.",
    generer() {
      const a = alea(2, 6), b = alea(1, 12), x = choisir([0, 1, 2, 3, 4, 5, 6, 10, 0.5, 1.5]);
      const [f, val, det] = choisir([
        [`y = ${a}x + ${b}`, a * x + b, `${a} × ${nb(x)} + ${b}`], [`y = ${a}x − ${b}`, a * x - b, `${a} × ${nb(x)} − ${b}`],
        ["y = x² + 1", x * x + 1, `${nb(x)}² + 1 = ${nb(x * x)} + 1`], [`y = ${b} − 2x`, b - 2 * x, `${b} − 2 × ${nb(x)}`],
        [`y = ${a}(x + 1)`, a * (x + 1), `${a} × (${nb(x)} + 1)`]
      ]);
      return {
        consigne: `Avec la formule <strong>${f}</strong>, quelle est la valeur de y pour <strong>x = ${nb(x)}</strong> ?`,
        ligne: "y = [r]", verifier: v => verifierNombre(v[0], rr(val)),
        indice: "Remplace x par sa valeur, puis calcule en respectant les priorités.",
        correction: `y = ${det} = ${nb(val)}`
      };
    }
  },

  {
    groupe: F2,
    id: "lire-tableau",
    titre: "Lire un tableau de valeurs",
    description: "Trouver une valeur dans un tableau.",
    generer() {
      const a = alea(2, 5), b = alea(0, 10), xs = [0, 1, 2, 3, 4, 5, 6].slice(0, alea(5, 7)), ys = xs.map(x => a * x + b);
      const k = alea(0, xs.length - 1), sens = Math.random() < 0.5;
      const tab = `<table class="tab-effectifs"><tr><th>Nombre de séances</th>${xs.map(x => `<td>${x}</td>`).join("")}</tr><tr><th>Prix (€)</th>${ys.map(y => `<td>${y}</td>`).join("")}</tr></table>`;
      return {
        consigne: `Ce tableau donne le prix payé en fonction du nombre de séances.<br>${tab}${sens ? `Quel est le prix pour ${xs[k]} séance${xs[k] > 1 ? "s" : ""} ?` : `Combien de séances peut-on faire pour ${ys[k]} € ?`}`,
        ligne: sens ? "[d] €" : "[n] séances", verifier: v => verifierNombre(v[0], sens ? ys[k] : xs[k]),
        indice: sens ? "Cherche le nombre de séances dans la première ligne, puis lis en dessous." : "Cherche le prix dans la deuxième ligne, puis lis au-dessus.",
        correction: sens ? `${xs[k]} séance(s) → ${ys[k]} €.` : `${ys[k]} € → ${xs[k]} séance(s).`
      };
    }
  },

  {
    groupe: F2,
    id: "trouver-formule",
    titre: "Retrouver la formule",
    description: "À partir d'un tableau.",
    generer() {
      const a = alea(2, 6), xs = [0, 1, 2, 3, 4];
      let b; do { b = alea(1, 9); } while (b === a);
      const [f, g] = choisir([[x => a * x, `y = ${a}x`], [x => a * x + b, `y = ${a}x + ${b}`], [x => x + b, `y = x + ${b}`]]);
      const bonne = g, autres = [`y = ${a}x + ${b}`, `y = ${a}x`, `y = x + ${b}`, `y = ${b}x + ${a}`].filter(x => x !== bonne);
      const tab = `<table class="tab-effectifs"><tr><th>x</th>${xs.map(x => `<td>${x}</td>`).join("")}</tr><tr><th>y</th>${xs.map(x => `<td>${f(x)}</td>`).join("")}</tr></table>`;
      return {
        consigne: `Quelle formule permet d'obtenir ce tableau ?<br>${tab}`,
        choix: melanger([bonne, ...melanger(autres).slice(0, 2)]), verifier: choixVerif(bonne),
        indice: "Regarde la valeur de y pour x = 0, puis de combien y augmente quand x augmente de 1.",
        correction: `${bonne} : pour x = 0, y = ${f(0)} ; y augmente de ${f(1) - f(0)} à chaque fois.`
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "lire-point",
    titre: "Lire les coordonnées d'un point",
    description: "Abscisse sur l'axe horizontal, ordonnée sur l'axe vertical.",
    generer() {
      const x = alea(1, 9), y = alea(1, 9);
      return {
        consigne: "Ce point représente une ligne d'un tableau de valeurs. Lis la valeur sur chaque axe.",
        figure: graphique({ xmax: 10, ymax: 10, px: 1, py: 1, nomX: "x", nomY: "y", points: [[x, y]] }),
        ligne: "x = [n] et y = [n]",
        verifier(v) {
          const a = verifierNombre(v[0], x), b = verifierNombre(v[1], y);
          if (a.etat === "incomplet" || b.etat === "incomplet") return { etat: "incomplet", message: "Remplis les deux cases." };
          if (lireNombre(v[0]) === y && lireNombre(v[1]) === x && x !== y) return { etat: "faux", message: "Tu as inversé : x se lit sur l'axe horizontal, y sur l'axe vertical." };
          return a.etat === "juste" && b.etat === "juste" ? { etat: "juste" } : { etat: "faux" };
        },
        indice: "Descends verticalement jusqu'à l'axe horizontal pour lire x, puis va horizontalement jusqu'à l'axe vertical pour lire y.",
        correction: `Le point correspond à x = ${x} et y = ${y}.`
      };
    }
  },

  {
    groupe: F3,
    id: "relier",
    titre: "Relier les points ou non ?",
    description: "Courbe ou nuage de points.",
    generer() {
      const [sit, relier, expl] = choisir([
        ["la taille d'un enfant en fonction de son âge", true, "la taille varie de façon continue"],
        ["la température relevée au cours d'une journée", true, "la température existe à chaque instant"],
        ["le prix payé en fonction du nombre de places de cinéma achetées", false, "on ne peut pas acheter 2,5 places"],
        ["la note d'un élève à chaque contrôle de l'année", false, "il n'y a rien entre deux contrôles"],
        ["la distance parcourue par une voiture en fonction du temps", true, "le temps s'écoule de façon continue"],
        ["le nombre d'élèves présents chaque jour de la semaine", false, "il n'y a pas de valeur entre deux jours"]
      ]);
      return {
        consigne: `On représente ${sit}. Doit-on relier les points par une courbe ?`,
        choix: ["Oui, par une courbe", "Non, nuage de points"], verifier: choixVerif(relier ? "Oui, par une courbe" : "Non, nuage de points"),
        indice: "La grandeur en abscisse peut-elle prendre toutes les valeurs (même décimales) ?",
        correction: `${relier ? "Oui" : "Non"} : ${expl}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "lire-graphique",
    titre: "Lire un graphique",
    description: "Trouver une valeur sur la courbe.",
    generer() {
      const a = choisir([1, 2, 3, 4, 5]), b = choisir([0, 2, 4, 5, 10]);
      const f = x => a * x + b, xmax = 10, ymax = Math.ceil((a * 10 + b) / 10) * 10;
      const py = ymax <= 20 ? 2 : ymax <= 40 ? 5 : 10;
      const sens = Math.random() < 0.5, x0 = alea(1, 9), y0 = f(x0);
      if (py === 10 && y0 % 2) return this.generer();
      return {
        consigne: sens ? `Ce graphique donne le prix (en €) en fonction de la durée (en h). Lis le prix pour <strong>${x0} h</strong>.` : `Ce graphique donne le prix (en €) en fonction de la durée (en h). Pour quelle durée le prix est-il de <strong>${y0} €</strong> ?`,
        figure: graphique({ xmax, ymax, px: 1, py, gx: 1, gy: py / (py === 5 ? 5 : py === 10 ? 5 : 2), nomX: "h", nomY: "€", courbes: [[[0, b], [10, f(10)]]] }),
        ligne: sens ? "[d] €" : "[d] h", verifier: v => verifierNombre(v[0], sens ? y0 : x0),
        indice: sens ? "Pars de la durée sur l'axe horizontal, monte jusqu'à la droite, puis lis sur l'axe vertical." : "Pars du prix sur l'axe vertical, va jusqu'à la droite, puis descends sur l'axe horizontal.",
        correction: sens ? `Pour ${x0} h, on lit ${y0} €.` : `Pour ${y0} €, on lit ${x0} h.`
      };
    }
  },

  {
    groupe: F4,
    id: "interpreter",
    titre: "Interpréter un graphique",
    description: "Le trajet d'un cycliste.",
    generer() {
      const v1 = choisir([10, 15, 20]), t1 = choisir([1, 2]), p = choisir([0.5, 1]), t2 = choisir([1, 2]), v2 = choisir([10, 20]);
      const d1 = v1 * t1, d2 = d1 + v2 * t2, T = t1 + p + t2;
      const pts = [[0, 0], [t1, d1], [t1 + p, d1], [T, d2]];
      const ymax = Math.ceil(d2 / 10) * 10;
      const q = choisir(["pause", "total", "debut"]);
      const Q = { pause: [`Pendant combien de temps (en h) le cycliste s'est-il arrêté ?`, p, "h", "La pause correspond au palier horizontal : la distance ne change pas."],
        total: ["Quelle distance totale (en km) a-t-il parcourue ?", d2, "km", "Lis la distance à la fin du trajet."],
        debut: [`Quelle distance (en km) a-t-il parcourue pendant la première heure ?`, v1, "km", "Lis la distance pour 1 h."] }[q];
      return {
        consigne: "Ce graphique donne la distance parcourue par un cycliste (en km) en fonction du temps (en h). " + Q[0],
        figure: graphique({ xmax: Math.ceil(T), ymax, px: 0.5, py: 10, gx: 0.5, gy: 5, nomX: "h", nomY: "km", courbes: [pts] }),
        ligne: `[d] ${Q[2]}`, verifier: v => verifierNombre(v[0], Q[1]),
        indice: Q[3], correction: `Réponse : ${nb(Q[1])} ${Q[2]}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "proportionnel-graphique",
    titre: "Proportionnalité : le graphique",
    description: "Une droite qui passe par l'origine ?",
    generer() {
      const type = choisir(["prop", "prop", "affine", "courbe", "brisee"]), a = choisir([0.5, 1, 1.5, 2]);
      const courbe = { prop: [[0, 0], [10, 10 * a]], affine: [[0, 2], [10, 2 + 10 * a * 0.8]], courbe: echantillon(x => x * x / 10 * a, 0, 10), brisee: [[0, 0], [4, 8 * a], [10, 10 * a]] }[type];
      const ymax = Math.ceil(Math.max(...courbe.map(p => p[1])) / 5) * 5 || 5;
      return {
        consigne: "Ce graphique représente-t-il une situation de proportionnalité ?",
        figure: graphique({ xmax: 10, ymax, px: 2, py: ymax > 10 ? 5 : 2, gx: 1, gy: 1, courbes: [courbe] }),
        choix: ["Oui", "Non"], verifier: choixVerif(type === "prop" ? "Oui" : "Non"),
        indice: "Proportionnalité ⇔ une droite (ou des points alignés) qui passe par l'origine.",
        correction: { prop: "Oui : c'est une droite qui passe par l'origine.", affine: "Non : c'est une droite, mais elle ne passe pas par l'origine.", courbe: "Non : ce n'est pas une droite.", brisee: "Non : ce n'est pas une seule droite." }[type]
      };
    }
  },

  {
    groupe: F5,
    id: "proportionnel-tableau",
    titre: "Proportionnalité : le tableau",
    description: "Les points seraient-ils alignés avec l'origine ?",
    generer() {
      const k = choisir([1.5, 2, 3, 4, 2.5]), xs = melanger([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 4).sort((a, b) => a - b);
      const prop = Math.random() < 0.5, b = alea(1, 4);
      const ys = xs.map(x => rr(prop ? k * x : k * x + b));
      const tab = `<table class="tab-effectifs"><tr><th>x</th>${xs.map(x => `<td>${x}</td>`).join("")}</tr><tr><th>y</th>${ys.map(y => `<td>${nb(y)}</td>`).join("")}</tr></table>`;
      return {
        consigne: `Ce tableau est-il un tableau de proportionnalité ? (Si oui, sa représentation graphique est formée de points alignés avec l'origine.)<br>${tab}`,
        choix: ["Oui", "Non"], verifier: choixVerif(prop ? "Oui" : "Non"),
        indice: "Calcule y ÷ x pour chaque colonne : obtient-on toujours le même nombre ?",
        correction: prop ? `Oui : y ÷ x = ${nb(k)} dans chaque colonne.` : `Non : ${nb(ys[0])} ÷ ${xs[0]} ${q(ys[0], xs[0])} et ${nb(ys[1])} ÷ ${xs[1]} ${q(ys[1], xs[1])} : les quotients sont différents.`
      };
    }
  },

  {
    groupe: F5,
    id: "proportionnel-formule",
    titre: "Proportionnalité : la formule",
    description: "y = a × x ?",
    generer() {
      const a = alea(2, 9), b = alea(1, 9);
      const [f, prop] = choisir([[`y = ${a}x`, true], [`y = ${a}x + ${b}`, false], [`y = x + ${b}`, false], [`y = x²`, false], [`y = ${a} × x`, true], [`P = 4 × c (périmètre d'un carré)`, true], [`A = c × c (aire d'un carré)`, false]]);
      return {
        consigne: `La situation décrite par la formule <strong>${f}</strong> est-elle une situation de proportionnalité ?`,
        choix: ["Oui", "Non"], verifier: choixVerif(prop ? "Oui" : "Non"),
        indice: "Une situation de proportionnalité s'écrit y = (un nombre fixe) × x.",
        correction: prop ? "Oui : la formule est du type y = a × x (droite passant par l'origine)." : "Non : la formule n'est pas du type y = a × x."
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
    { competence: "« En fonction de »", activites: ["depend"] },
    { competence: "Choisir une formule", activites: ["formule-situation"] },
    { competence: "Calculer avec une formule", activites: ["calculer-formule"] },
    { competence: "Lire un tableau de valeurs", activites: ["lire-tableau"] },
    { competence: "Retrouver une formule", activites: ["trouver-formule"] },
    { competence: "Lire les coordonnées d'un point", activites: ["lire-point"] },
    { competence: "Courbe ou nuage de points", activites: ["relier"] },
    { competence: "Lire un graphique", activites: ["lire-graphique"] },
    { competence: "Interpréter un graphique", activites: ["interpreter"] },
    { competence: "Proportionnalité et graphique", activites: ["proportionnel-graphique"] },
    { competence: "Proportionnalité et tableau", activites: ["proportionnel-tableau"] },
    { competence: "Proportionnalité et formule", activites: ["proportionnel-formule"] }
  ]
};
