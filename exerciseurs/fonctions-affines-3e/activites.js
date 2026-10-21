/* =====================================================================
   EXERCISEUR « FONCTIONS LINÉAIRES ET AFFINES » — 3e, chapitre 13

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Fonctions linéaires";
const F2 = "Feuille 2 — Pourcentages et fonctions linéaires";
const F3 = "Feuille 3 — Fonctions affines";
const F4 = "Feuille 4 — Représentations graphiques";
const F5 = "Feuille 5 — Déterminer une fonction affine";
const F6 = "Feuille 6 — Problèmes type brevet";

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
/* a x + b écrit proprement */
function aff(a, b) {
  let s = a === 0 ? "" : a === 1 ? "x" : a === -1 ? "−x" : nb(a) + "x";
  if (b !== 0 || s === "") s += s === "" ? nb(b) : (b > 0 ? " + " : " − ") + nb(Math.abs(b));
  return s;
}
const deuxNb = (a, b) => v => { const x = v.map(lireNombre); if (x.some(isNaN)) return { etat: "incomplet", message: "Remplis les deux cases." }; return Math.abs(x[0] - a) < 1e-9 && Math.abs(x[1] - b) < 1e-9 ? { etat: "juste" } : { etat: "faux" }; };

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "lineaire-image",
    titre: "Image ou antécédent (linéaire)",
    description: "f(x) = ax.",
    generer() {
      const a = choisir([2, 3, 4, 5, -2, -3, 0.5, 1.5, -0.5, 2.5]), x = nz(-8, 8), q = Math.random() < 0.5;
      return q ? { consigne: `f est la fonction linéaire f(x) = ${aff(a, 0)}. Calcule f(${nb(x)}).`, ligne: `f(${nb(x)}) = [d]`, verifier: v => verifierNombre(v[0], rr(a * x)), indice: "Multiplie x par le coefficient.", correction: `f(${nb(x)}) = ${nb(a)} × ${nbp(x)} = ${nb(rr(a * x))}` }
        : { consigne: `f(x) = ${aff(a, 0)}. Quel est l'antécédent de ${nb(rr(a * x))} ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], x), indice: "Divise par le coefficient.", correction: `${nb(rr(a * x))} ÷ ${nbp(a)} = ${nb(x)}` };
    }
  },

  {
    groupe: F1,
    id: "coefficient",
    titre: "Trouver le coefficient",
    description: "À partir d'une image.",
    generer() {
      const a = choisir([2, 3, 4, 6, 7, -2, -4, 0.5, 1.5, 2.5, -1.5]), x = choisir([2, 4, 5, -2, 10, 3, -4]);
      return { consigne: `f est une fonction linéaire telle que f(${nb(x)}) = ${nb(rr(a * x))}. Quel est son coefficient ?`, ligne: "a = [d]", verifier: v => verifierNombre(v[0], a), indice: "a = f(x) ÷ x.", correction: `a = ${nb(rr(a * x))} ÷ ${nbp(x)} = ${nb(a)}` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "coef-pourcentage",
    titre: "Coefficient multiplicateur",
    description: "Hausse ou baisse de t %.",
    generer() {
      const t = choisir([5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 2.5]), h = Math.random() < 0.5;
      const k = rr(h ? 1 + t / 100 : 1 - t / 100);
      return { consigne: `${h ? "Augmenter" : "Diminuer"} un prix de ${nb(t)} %, c'est le multiplier par… ?`, ligne: "× [d]", verifier: v => verifierNombre(v[0], k), indice: h ? "1 + t/100." : "1 − t/100.", correction: `${h ? "1 + " : "1 − "}${nb(t / 100)} = ${nb(k)}` };
    }
  },

  {
    groupe: F2,
    id: "prix",
    titre: "Nouveau prix, prix initial",
    description: "Avec le coefficient.",
    generer() {
      const t = choisir([10, 20, 25, 30, 40, 50, 15]), h = Math.random() < 0.5, k = rr(h ? 1 + t / 100 : 1 - t / 100), p = choisir([20, 40, 60, 80, 120, 200, 240]), q = Math.random() < 0.6;
      const np = rr(p * k);
      return q ? { consigne: `Un article à ${p} € ${h ? "augmente" : "baisse"} de ${t} %. Quel est son nouveau prix ?`, ligne: "[d] €", verifier: v => verifierNombre(v[0], np), indice: `Multiplie par ${nb(k)}.`, correction: `${p} × ${nb(k)} = ${nb(np)} €` }
        : { consigne: `Après une ${h ? "hausse" : "baisse"} de ${t} %, un article coûte ${nb(np)} €. Quel était son prix initial ?`, ligne: "[d] €", verifier: v => verifierNombre(v[0], p), indice: `Prix initial × ${nb(k)} = ${nb(np)} : divise par ${nb(k)}.`, correction: `${nb(np)} ÷ ${nb(k)} = ${p} €` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "reconnaitre",
    titre: "Affine, linéaire, ni l'un ni l'autre ?",
    description: "Reconnaître la forme ax + b.",
    generer() {
      const [e, r] = choisir([["f(x) = 3x − 5", "affine non linéaire"], ["f(x) = −7x", "linéaire"], ["f(x) = x² + 2", "ni affine ni linéaire"], ["f(x) = 4", "affine non linéaire"], ["f(x) = x/3", "linéaire"], ["f(x) = 2/x", "ni affine ni linéaire"], ["f(x) = 5 − x", "affine non linéaire"], ["f(x) = 3(x + 1) − 3", "linéaire"]]);
      return { consigne: `La fonction ${e} est…`, choix: ["linéaire", "affine non linéaire", "ni affine ni linéaire"], verifier: choixVerif(r), indice: "Linéaire : ax ; affine : ax + b. Développe si besoin.", correction: `${e} est ${r}${e.includes("3(x + 1)") ? " (car elle vaut 3x)" : ""}.` };
    }
  },

  {
    groupe: F3,
    id: "affine-image",
    titre: "Image par une fonction affine",
    description: "f(x) = ax + b.",
    generer() {
      const a = nz(-5, 5), b = nz(-9, 9), x = alea(-6, 6), q = Math.random() < 0.6;
      return q ? { consigne: `f(x) = ${aff(a, b)}. Calcule f(${nb(x)}).`, ligne: `f(${nb(x)}) = [d]`, verifier: v => verifierNombre(v[0], a * x + b), indice: "Remplace x par le nombre.", correction: `f(${nb(x)}) = ${nb(a * x + b)}` }
        : { consigne: `f(x) = ${aff(a, b)}. Quel est l'antécédent de ${nb(a * x + b)} ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], x), indice: `Résous ${aff(a, b)} = ${nb(a * x + b)}.`, correction: `${aff(a, 0)} = ${nb(a * x)} ; x = ${nb(x)}` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "lire-ab",
    titre: "Lire a et b sur un graphique",
    description: "Coefficient directeur, ordonnée à l'origine.",
    generer() {
      const a = choisir([1, 2, -1, -2, 0.5, -0.5, 3]), b = alea(-3, 3);
      const fig = repere({ xmin: -4, xmax: 4, ymin: -5, ymax: 5, courbes: [echantillon(x => a * x + b, -4, 4)] });
      return { consigne: "Voici la droite représentant une fonction affine f(x) = ax + b. Lis a et b.", figure: fig, ligne: "a = [d] et b = [d]", verifier: deuxNb(a, b), indice: "b : là où la droite coupe l'axe vertical. a : quand x augmente de 1, de combien monte (ou descend) la droite ?", correction: `b = ${nb(b)} et a = ${nb(a)} : f(x) = ${aff(a, b)}` };
    }
  },

  {
    groupe: F4,
    id: "point-droite",
    titre: "Le point est-il sur la droite ?",
    description: "Calculer f(x).",
    generer() {
      const a = nz(-4, 4), b = nz(-6, 6), x = nz(-5, 5), oui = Math.random() < 0.5, y = oui ? a * x + b : a * x + b + choisir([-2, -1, 1, 2]);
      return { consigne: `Le point A(${nb(x)} ; ${nb(y)}) est-il sur la droite représentant f(x) = ${aff(a, b)} ?`, choix: ["oui", "non"], verifier: choixVerif(oui ? "oui" : "non"), indice: `Calcule f(${nb(x)}).`, correction: `f(${nb(x)}) = ${nb(a * x + b)} ${oui ? "=" : "≠"} ${nb(y)}` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "deux-images",
    titre: "Fonction affine par deux images",
    description: "a = (y₂ − y₁)/(x₂ − x₁).",
    generer() {
      const a = choisir([1, 2, 3, -1, -2, -3, 0.5, 1.5, -0.5]), b = alea(-8, 8), x1 = alea(-4, 2), x2 = x1 + alea(1, 5);
      const y1 = rr(a * x1 + b), y2 = rr(a * x2 + b);
      return { consigne: `f est affine, f(${nb(x1)}) = ${nb(y1)} et f(${nb(x2)}) = ${nb(y2)}. Détermine a et b tels que f(x) = ax + b.`, ligne: "a = [d] et b = [d]", verifier: deuxNb(a, b), indice: "a = (f(x₂) − f(x₁)) ÷ (x₂ − x₁), puis b = f(x₁) − a × x₁.", correction: `a = (${nb(y2)} − ${nbp(y1)}) ÷ (${nb(x2)} − ${nbp(x1)}) = ${nb(a)} ; b = ${nb(y1)} − ${nb(a)} × ${nbp(x1)} = ${nb(b)}` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "tarifs",
    titre: "Comparer deux tarifs",
    description: "Linéaire contre affine.",
    generer() {
      const p = alea(5, 12), q = alea(2, p - 2), n = alea(4, 15), ab = (p - q) * n;
      return { consigne: `Tarif A : ${p} € par séance (fonction linéaire). Tarif B : abonnement de ${ab} € puis ${q} € par séance (fonction affine). Pour combien de séances les deux tarifs sont-ils égaux ?`, ligne: "[n] séances", verifier: v => verifierNombre(v[0], n), indice: `Résous ${p}x = ${q}x + ${ab}.`, correction: `${p - q}x = ${ab} ; x = ${n} séances (${p * n} €)` };
    }
  },

  {
    groupe: F6,
    id: "modele",
    titre: "Modéliser",
    description: "Écrire la fonction d'une situation.",
    generer() {
      const [txt, bonne, autres] = choisir([
        ["Un taxi facture 4 € de prise en charge et 1,80 € par km. Prix pour x km ?", "P(x) = 1,8x + 4", ["P(x) = 4x + 1,8", "P(x) = 5,8x", "P(x) = 1,8(x + 4)"]],
        ["Une bougie de 20 cm diminue de 2 cm par heure. Hauteur après x heures ?", "h(x) = 20 − 2x", ["h(x) = 2x − 20", "h(x) = 20x − 2", "h(x) = 18x"]],
        ["Un forfait coûte 15 € par mois. Coût pour x mois ?", "C(x) = 15x", ["C(x) = x + 15", "C(x) = 15", "C(x) = 15x + 15"]],
        ["L'abonnement annuel d'eau est 60 € et le m³ coûte 3,50 €. Facture pour x m³ ?", "F(x) = 3,5x + 60", ["F(x) = 60x + 3,5", "F(x) = 63,5x", "F(x) = 3,5(x + 60)"]]
      ]);
      return { consigne: txt, choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne), indice: "La partie fixe est b ; ce qui est payé « par unité » est a.", correction: bonne };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Fonction linéaire : image, antécédent", activites: ["lineaire-image"] },
    { competence: "Coefficient d'une fonction linéaire", activites: ["coefficient"] },
    { competence: "Coefficient multiplicateur", activites: ["coef-pourcentage"] },
    { competence: "Calculs de pourcentages", activites: ["prix"] },
    { competence: "Reconnaître une fonction affine", activites: ["reconnaitre"] },
    { competence: "Image par une fonction affine", activites: ["affine-image"] },
    { competence: "Lire a et b sur un graphique", activites: ["lire-ab"] },
    { competence: "Point sur une droite", activites: ["point-droite"] },
    { competence: "Déterminer une fonction affine", activites: ["deux-images"] },
    { competence: "Déterminer une fonction affine", activites: ["deux-images"] },
    { competence: "Comparer deux tarifs", activites: ["tarifs"] },
    { competence: "Modéliser une situation", activites: ["modele"] }
  ]
};
