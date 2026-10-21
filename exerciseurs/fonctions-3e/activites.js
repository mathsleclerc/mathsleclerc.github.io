/* =====================================================================
   EXERCISEUR « NOTION DE FONCTION » — 3e, chapitre 4

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Vocabulaire et notations";
const F2 = "Feuille 2 — Calculer des images";
const F3 = "Feuille 3 — Chercher des antécédents";
const F4 = "Feuille 4 — Tableaux de valeurs et tableur";
const F5 = "Feuille 5 — Lire un graphique";
const F6 = "Feuille 6 — Tracer une courbe, résoudre un problème";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const nbp = x => x < 0 ? "(" + nb(x) + ")" : nb(x);
const nz = (a, b) => { let x = 0; while (x === 0) x = alea(a, b); return x; };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const NOMS = ["f", "g", "h", "k"];
/* a x² + b x + c écrit proprement */
function poly(a, b, c) {
  const t = [[a, "x²"], [b, "x"], [c, ""]].filter(([k]) => k !== 0);
  if (!t.length) return "0";
  return t.map(([k, l], i) => {
    const m = Math.abs(k), s = l ? (m === 1 ? l : nb(m) + l) : nb(m);
    return i === 0 ? (k < 0 ? "−" : "") + s : (k < 0 ? " − " : " + ") + s;
  }).join("");
}

/* ---------- Repère SVG avec abscisses et ordonnées négatives ---------- */
function repere({ xmin, xmax, ymin, ymax, courbes = [], points = [] }) {
  const L = 300, H = 230, m = 22;
  const W = L + 2 * m, Ht = H + 2 * m;
  const X = x => m + (x - xmin) / (xmax - xmin) * L, Y = y => m + H - (y - ymin) / (ymax - ymin) * H;
  const s = svg("svg", { viewBox: `0 0 ${W} ${Ht}`, width: W, height: Ht, class: "graphique-fct", role: "img", "aria-label": "Courbe d'une fonction" });
  const trait = (x1, y1, x2, y2, st) => s.append(svg("line", { x1, y1, x2, y2, style: st }));
  const texte = (x, y, t, ancre = "middle") => { const e = svg("text", { x, y, "text-anchor": ancre, style: "font-size:10px;fill:currentColor" }); e.textContent = t; s.append(e); };
  for (let x = xmin; x <= xmax; x++) trait(X(x), Y(ymin), X(x), Y(ymax), "stroke:#c9d3df;stroke-width:0.7");
  for (let y = ymin; y <= ymax; y++) trait(X(xmin), Y(y), X(xmax), Y(y), "stroke:#c9d3df;stroke-width:0.7");
  trait(X(xmin), Y(0), X(xmax) + 10, Y(0), "stroke:#1D4E89;stroke-width:1.6");
  trait(X(0), Y(ymin), X(0), Y(ymax) - 10, "stroke:#1D4E89;stroke-width:1.6");
  for (let x = xmin; x <= xmax; x++) if (x !== 0) texte(X(x), Y(0) + 12, nb(x));
  for (let y = ymin; y <= ymax; y++) if (y !== 0) texte(X(0) - 4, Y(y) + 3.5, nb(y), "end");
  texte(X(0) - 4, Y(0) + 12, "0", "end");
  for (const c of courbes) s.append(svg("polyline", { points: c.filter(([, y]) => y >= ymin - 0.5 && y <= ymax + 0.5).map(([x, y]) => `${X(x)},${Y(y)}`).join(" "), style: "fill:none;stroke:#E07A5F;stroke-width:2.5;stroke-linejoin:round" }));
  for (const [x, y] of points) s.append(svg("circle", { cx: X(x), cy: Y(y), r: 3.5, style: "fill:#1D4E89" }));
  return s;
}
const echantillon = (f, a, b, n = 80) => Array.from({ length: n + 1 }, (_, k) => { const x = a + (b - a) * k / n; return [x, f(x)]; });
/* fonctions « du second degré » à valeurs entières aux points entiers, avec leur fenêtre */
const COURBES = [
  { f: x => x * x - 2 * x - 3, xmin: -3, xmax: 5, ymin: -5, ymax: 6 },
  { f: x => -x * x + 2 * x + 3, xmin: -3, xmax: 5, ymin: -6, ymax: 5 },
  { f: x => x * x - 4, xmin: -4, xmax: 4, ymin: -5, ymax: 6 },
  { f: x => -x * x + 4 * x, xmin: -2, xmax: 6, ymin: -6, ymax: 5 },
  { f: x => x * x + 2 * x - 2, xmin: -5, xmax: 3, ymin: -4, ymax: 7 },
  { f: x => -x * x - 2 * x + 5, xmin: -5, xmax: 3, ymin: -5, ymax: 7 }
];

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "vocabulaire",
    titre: "Image ou antécédent ?",
    description: "Traduire f(a) = b.",
    generer() {
      const f = choisir(NOMS), a = nz(-9, 9), b = nz(-9, 9);
      if (a === b) return this.generer();
      const q = choisir(["image", "antécédent"]);
      const bonne = q === "image" ? nb(b) : nb(a);
      return { consigne: `On sait que ${f}(${nb(a)}) = ${nb(b)}. Complète : « ${q === "image" ? `L'image de ${nb(a)} par ${f} est …` : `Un antécédent de ${nb(b)} par ${f} est …`} »`, choix: melanger([nb(a), nb(b)]), verifier: choixVerif(bonne), indice: "Dans f(a) = b, b est l'image de a, et a est un antécédent de b.", correction: q === "image" ? `L'image de ${nb(a)} est ${nb(b)}.` : `Un antécédent de ${nb(b)} est ${nb(a)}.` };
    }
  },

  {
    groupe: F1,
    id: "programme",
    titre: "Programme de calcul",
    description: "Une fonction cachée.",
    generer() {
      const a = alea(2, 6), b = alea(1, 9), plus = Math.random() < 0.5, x = nz(-6, 8), r = plus ? a * x + b : a * x - b;
      return { consigne: `Programme : « choisir un nombre ; le multiplier par ${a} ; ${plus ? "ajouter" : "soustraire"} ${b} ». On note p la fonction associée. Calcule p(${nb(x)}).`, ligne: `p(${nb(x)}) = [d]`, verifier: v => verifierNombre(v[0], r), indice: `p(x) = ${a}x ${plus ? "+" : "−"} ${b}.`, correction: `p(${nb(x)}) = ${a} × ${nbp(x)} ${plus ? "+" : "−"} ${b} = ${nb(r)}` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "image",
    titre: "Calculer une image",
    description: "Remplacer x dans la formule.",
    generer() {
      const f = choisir(NOMS), a = choisir([1, 2, 3, -1, -2, 0]), b = alea(-6, 6), c = alea(-9, 9), x = nz(-4, 5);
      if (a === 0 && b === 0) return this.generer();
      const v = a * x * x + b * x + c;
      return { consigne: `${f}(x) = ${poly(a, b, c)}. Calcule ${f}(${nb(x)}).`, ligne: `${f}(${nb(x)}) = [d]`, verifier: v2 => verifierNombre(v2[0], v), indice: x < 0 ? `Remplace x par (${nb(x)}) : attention, (${nb(x)})² est positif.` : "Remplace x par le nombre, en respectant les priorités.", correction: `${f}(${nb(x)}) = ${nb(v)}` };
    }
  },

  {
    groupe: F2,
    id: "image-produit",
    titre: "Image d'un produit",
    description: "(x + a)(x + b).",
    generer() {
      const a = nz(-6, 6), b = nz(-6, 6), x = alea(-5, 5), v = (x + a) * (x + b);
      const fac = c => `(x ${c < 0 ? "−" : "+"} ${Math.abs(c)})`;
      return { consigne: `g(x) = ${fac(a)}${fac(b)}. Calcule g(${nb(x)}).`, ligne: `g(${nb(x)}) = [d]`, verifier: v2 => verifierNombre(v2[0], v), indice: "Calcule chaque parenthèse, puis multiplie.", correction: `g(${nb(x)}) = ${nbp(x + a)} × ${nbp(x + b)} = ${nb(v)}` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "antecedent",
    titre: "Antécédent par une fonction affine",
    description: "Résoudre f(x) = b.",
    generer() {
      const a = choisir([2, 3, 4, 5, -2, -3, -4]), b = nz(-9, 9), x = choisir([alea(-8, 8), alea(-15, 15) / 2]), y = rr(a * x + b);
      if (!Number.isInteger(y)) return this.generer();
      return { consigne: `f(x) = ${poly(0, a, b)}. Quel est l'antécédent de ${nb(y)} par f ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], x), indice: `Résous l'équation ${poly(0, a, b)} = ${nb(y)}.`, correction: `${poly(0, a, 0)} = ${nb(y)} ${b > 0 ? "−" : "+"} ${Math.abs(b)} = ${nb(y - b)} ; x = ${nb(y - b)} ÷ ${nbp(a)} = ${nb(x)}` };
    }
  },

  {
    groupe: F3,
    id: "antecedent-carre",
    titre: "Antécédents par x ↦ x²",
    description: "Zéro, un ou deux.",
    generer() {
      const k = choisir([1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 0, -4, -9, -25, 7, 5]);
      const bonne = k < 0 ? "aucun" : k === 0 ? "0" : Number.isInteger(Math.sqrt(k)) ? `${Math.sqrt(k)} et −${Math.sqrt(k)}` : `√${k} et −√${k}`;
      const opts = k < 0 ? ["aucun", `${Math.sqrt(-k)} et −${Math.sqrt(-k)}`, `−${Math.sqrt(-k)}`] : k === 0 ? ["0", "aucun", "1 et −1"] : [bonne, Number.isInteger(Math.sqrt(k)) ? `${Math.sqrt(k)}` : `√${k}`, "aucun"];
      return { consigne: `k(x) = x². Quels sont les antécédents de ${nb(k)} par k ?`, choix: melanger(opts), verifier: choixVerif(bonne), indice: "Un carré n'est jamais négatif ; un nombre positif a deux racines carrées opposées.", correction: k < 0 ? "Aucun : un carré est toujours positif." : k === 0 ? "Seulement 0." : `x² = ${k} : ${bonne}.` };
    }
  },

  {
    groupe: F3,
    id: "tableau",
    titre: "Lire un tableau de valeurs",
    description: "Images et antécédents.",
    generer() {
      const c = choisir(COURBES), xs = [-2, -1, 0, 1, 2, 3].map(x => x + (c.xmin + c.xmax) / 2 - 1).map(Math.round), ys = xs.map(c.f);
      const t = `<table class="tab-effectifs"><tr><th>x</th>${xs.map(x => `<td>${nb(x)}</td>`).join("")}</tr><tr><th>f(x)</th>${ys.map(y => `<td>${nb(y)}</td>`).join("")}</tr></table>`;
      const i = alea(0, 5);
      if (Math.random() < 0.5) return { consigne: `Voici un tableau de valeurs de f :${t}Quelle est l'image de ${nb(xs[i])} ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], ys[i]), indice: "L'image se lit sur la deuxième ligne, sous le nombre.", correction: `f(${nb(xs[i])}) = ${nb(ys[i])}` };
      const ant = xs.filter((x, k) => ys[k] === ys[i]);
      const bonne = ant.map(nb).join(" et ");
      const autres = melanger(xs.filter(x => !ant.includes(x))).slice(0, 2).map(nb);
      return { consigne: `Voici un tableau de valeurs de f :${t}Quel(s) antécédent(s) de ${nb(ys[i])} lit-on dans le tableau ?`, choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne), indice: "Les antécédents se lisent sur la première ligne, au-dessus du nombre.", correction: `Dans le tableau, ${nb(ys[i])} a pour antécédent(s) ${bonne}.` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "tableur",
    titre: "Formule de tableur",
    description: "Traduire f(x).",
    generer() {
      const a = alea(2, 7), b = alea(1, 9);
      const [e, bonne, autres] = choisir([
        [`${a}x + ${b}`, `=${a}*B1+${b}`, [`=${a}B1+${b}`, `=${a}*(B1+${b})`, `=B1*B1+${b}`]],
        [`x² − ${b}`, `=B1^2-${b}`, [`=B1*2-${b}`, `=(B1-${b})^2`, `=B1^2*${b}`]],
        [`${a}(x − ${b})`, `=${a}*(B1-${b})`, [`=${a}*B1-${b}`, `=${a}(B1)-${b}`, `=(${a}*B1)^${b}`]],
        [`${a}x²`, `=${a}*B1^2`, [`=(${a}*B1)^2`, `=${a}*B1*2`, `=${a}^2*B1`]]
      ]);
      return { consigne: `Dans un tableur, x est en B1. Quelle formule taper en B2 pour calculer f(x) = ${e} ?`, choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne), indice: "Une formule commence par = ; « * » multiplie, « ^2 » met au carré ; attention aux parenthèses.", correction: bonne };
    }
  },

  {
    groupe: F4,
    id: "completer",
    titre: "Compléter un tableau",
    description: "Calculer plusieurs images.",
    generer() {
      const a = choisir([1, -1, 2]), b = alea(-4, 4), c = alea(-5, 5), xs = [-2, -1, 0, 1, 2];
      const f = x => a * x * x + b * x + c, i = alea(0, 4), j = (i + alea(1, 4)) % 5;
      return { consigne: `f(x) = ${poly(a, b, c)}. Complète : f(${nb(xs[i])}) et f(${nb(xs[j])}).`, ligne: `f(${nb(xs[i])}) = [d] et f(${nb(xs[j])}) = [d]`, verifier: v => { const r = [verifierNombre(v[0], f(xs[i])), verifierNombre(v[1], f(xs[j]))]; if (r.some(e => e.etat === "incomplet")) return { etat: "incomplet", message: "Remplis les deux cases." }; return r.every(e => e.etat === "juste") ? { etat: "juste" } : { etat: "faux" }; }, indice: "Remplace x par chaque nombre.", correction: `f(${nb(xs[i])}) = ${nb(f(xs[i]))} ; f(${nb(xs[j])}) = ${nb(f(xs[j]))}` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "lire-image",
    titre: "Lire une image",
    description: "Sur la courbe.",
    generer() {
      const c = choisir(COURBES);
      let x; do { x = alea(c.xmin + 1, c.xmax - 1); } while (c.f(x) < c.ymin || c.f(x) > c.ymax);
      return { consigne: "Voici la courbe d'une fonction f. Lis l'image de " + nb(x) + " par f.", figure: repere({ ...c, courbes: [echantillon(c.f, c.xmin, c.xmax)] }), ligne: `f(${nb(x)}) = [d]`, verifier: v => verifierNombre(v[0], c.f(x)), indice: `Pars de ${nb(x)} sur l'axe horizontal, rejoins la courbe, puis lis l'ordonnée.`, correction: `f(${nb(x)}) = ${nb(c.f(x))}` };
    }
  },

  {
    groupe: F5,
    id: "lire-antecedents",
    titre: "Lire des antécédents",
    description: "Sur la courbe.",
    generer() {
      const c = choisir(COURBES);
      const xs = []; for (let x = c.xmin; x <= c.xmax; x++) xs.push(x);
      const vals = xs.map(c.f).filter(y => y >= c.ymin && y <= c.ymax);
      const y = choisir(vals), ant = xs.filter(x => c.f(x) === y);
      if (ant.length < 2) return this.generer();
      const [a1, a2] = ant;
      return { consigne: `Voici la courbe d'une fonction f. Lis les deux antécédents de ${nb(y)} par f.`, figure: repere({ ...c, courbes: [echantillon(c.f, c.xmin, c.xmax)] }), ligne: "[d] et [d]", verifier: v => { const x = v.map(lireNombre); if (x.some(isNaN)) return { etat: "incomplet", message: "Remplis les deux cases." }; return (x[0] === a1 && x[1] === a2) || (x[0] === a2 && x[1] === a1) ? { etat: "juste" } : { etat: "faux" }; }, indice: `Trace l'horizontale à la hauteur ${nb(y)} et lis les abscisses des points d'intersection.`, correction: `Les antécédents de ${nb(y)} sont ${nb(a1)} et ${nb(a2)}.` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "point-courbe",
    titre: "Le point est-il sur la courbe ?",
    description: "Calculer f(a) et comparer.",
    generer() {
      const a = choisir([1, -1, 2]), b = alea(-4, 4), c = alea(-5, 5), x = nz(-4, 4), f = x => a * x * x + b * x + c, oui = Math.random() < 0.5, y = oui ? f(x) : f(x) + choisir([-2, -1, 1, 2]);
      return { consigne: `f(x) = ${poly(a, b, c)}. Le point A(${nb(x)} ; ${nb(y)}) appartient-il à la courbe de f ?`, choix: ["oui", "non"], verifier: choixVerif(oui ? "oui" : "non"), indice: `Calcule f(${nb(x)}) et compare avec l'ordonnée ${nb(y)}.`, correction: `f(${nb(x)}) = ${nb(f(x))} ${oui ? "= " : "≠ "}${nb(y)} : ${oui ? "oui, A est sur la courbe." : "non, A n'est pas sur la courbe."}` };
    }
  },

  {
    groupe: F6,
    id: "probleme",
    titre: "Problèmes",
    description: "Enclos, taxi, chute…",
    generer() {
      const t = alea(1, 3);
      if (t === 1) { const p = choisir([20, 24, 28, 32, 40]), h = p / 2, x = alea(1, h - 1); return { consigne: `Avec ${p} m de grillage, on entoure un enclos rectangulaire de largeur x. Son aire est A(x) = x(${h} − x). Calcule A(${x}).`, ligne: "[d] m²", verifier: v => verifierNombre(v[0], x * (h - x)), indice: `A(${x}) = ${x} × (${h} − ${x}).`, correction: `A(${x}) = ${x} × ${h - x} = ${x * (h - x)} m²` }; }
      if (t === 2) { const a = choisir([1.5, 1.8, 2, 2.2]), b = choisir([3, 4, 5]), d = alea(5, 30); return { consigne: `Le prix d'une course de taxi de d km est P(d) = ${nb(a)}d + ${b} (en €). Combien coûte une course de ${d} km ?`, ligne: "[d] €", verifier: v => verifierNombre(v[0], rr(a * d + b)), indice: `Calcule P(${d}).`, correction: `P(${d}) = ${nb(a)} × ${d} + ${b} = ${nb(rr(a * d + b))} €` }; }
      const s = alea(1, 4); return { consigne: `La distance (en m) parcourue par une pierre qui tombe pendant t secondes est d(t) = 5t². Au bout de combien de secondes a-t-elle parcouru ${5 * s * s} m ?`, ligne: "[d] s", verifier: v => verifierNombre(v[0], s), indice: `Résous 5t² = ${5 * s * s} (t est positif).`, correction: `t² = ${s * s}, donc t = ${s} s` };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Image et antécédent : vocabulaire", activites: ["vocabulaire"] },
    { competence: "Fonction et programme de calcul", activites: ["programme"] },
    { competence: "Calculer une image", activites: ["image"] },
    { competence: "Calculer une image", activites: ["image-produit"] },
    { competence: "Chercher un antécédent", activites: ["antecedent"] },
    { competence: "Antécédents par la fonction carré", activites: ["antecedent-carre"] },
    { competence: "Lire un tableau de valeurs", activites: ["tableau"] },
    { competence: "Tableur", activites: ["tableur", "completer"] },
    { competence: "Lire une image sur un graphique", activites: ["lire-image"] },
    { competence: "Lire des antécédents sur un graphique", activites: ["lire-antecedents"] },
    { competence: "Point sur une courbe", activites: ["point-courbe"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
