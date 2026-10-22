/* =====================================================================
   EXERCISEUR « TRIGONOMÉTRIE » — 3e, chapitre 14

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste ».
   ===================================================================== */

const F1 = "Feuille 1 — Vocabulaire et formules";
const F2 = "Feuille 2 — Utiliser la calculatrice";
const F3 = "Feuille 3 — Calculer une longueur";
const F4 = "Feuille 4 — Calculer un angle";
const F5 = "Feuille 5 — Choisir la bonne méthode";
const F6 = "Feuille 6 — Problèmes type brevet";
const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const arr = (x, d) => Math.round(x * 10 ** d) / 10 ** d;
const cosd = a => Math.cos(a * Math.PI / 180), acosd = x => Math.acos(x) * 180 / Math.PI;
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const verifierArrondi = (s, exact, d = 1) => {
  const x = lireNombre(s);
  if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre dans la case." };
  if (Math.abs(x - arr(exact, d)) < 1e-9) return { etat: "juste" };
  if (Math.abs(x - exact) < 2 * 10 ** -d) return { etat: "faux", message: "Presque : vérifie l'arrondi demandé." };
  return { etat: "faux" };
};

/* Triangle rectangle en A ; angle marqué en B. etiq : { AB, AC, BC, angle } */
function figTrigo([A, B, C], etiq = {}) {
  const s = figureGeo(300, 200, "Triangle rectangle");
  const flip = Math.random() < 0.5;
  const P = { A: { x: flip ? 250 : 50, y: 170 }, B: { x: flip ? 50 : 250, y: 170 }, C: { x: flip ? 250 : 50, y: 40 } };
  [["A", "B"], ["B", "C"], ["C", "A"]].forEach(([p, q]) => dessinerTrait(s, P[p], P[q]));
  codageAngleDroit(s, P.A, V.moins(P.B, P.A), V.moins(P.C, P.A));
  const G = { x: 150, y: 125 };
  [["A", A], ["B", B], ["C", C]].forEach(([k, n]) => dessinerTexte(s, V.plus(P[k], V.fois(V.unitaire(V.moins(P[k], G)), 16)), n, "geo-nom"));
  // arc de l'angle en B
  const u = V.unitaire(V.moins(P.A, P.B)), w = V.unitaire(V.moins(P.C, P.B)), r = 34;
  const a1 = V.plus(P.B, V.fois(u, r)), a2 = V.plus(P.B, V.fois(w, r));
  s.append(svg("path", { d: `M${a1.x},${a1.y} A${r},${r} 0 0 ${flip ? 0 : 1} ${a2.x},${a2.y}`, style: "fill:none;stroke:var(--exercices);stroke-width:2.5" }));
  if (etiq.angle) dessinerTexte(s, V.plus(P.B, V.fois(V.unitaire(V.plus(u, w)), 54)), etiq.angle, "geo-nom");
  const cote = (p, q, t) => { if (!t) return; const m = V.milieu(P[p], P[q]); dessinerTexte(s, V.plus(m, V.fois(V.unitaire(V.moins(m, G)), 18)), t, "geo-nom"); };
  cote("A", "B", etiq.AB); cote("A", "C", etiq.AC); cote("B", "C", etiq.BC);
  return s;
}

const ACTIVITES = [
  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "vocabulaire",
    titre: "Hypoténuse, adjacent, opposé",
    description: "Nommer les côtés.",
    generer() {
      const [A, B, C] = tirerLettres(3), q = choisir(["hyp", "adj", "opp"]);
      const rep = { hyp: `[${B}${C}]`, adj: `[${A}${B}]`, opp: `[${A}${C}]` }[q];
      return { consigne: `Le triangle ${A}${B}${C} est rectangle en ${A}. Quel est ${q === "hyp" ? "l'hypoténuse" : q === "adj" ? "le côté adjacent à l'angle " + A + B + C : "le côté opposé à l'angle " + A + B + C} (angle marqué) ?`, figure: figTrigo([A, B, C]), choix: melanger([`[${B}${C}]`, `[${A}${B}]`, `[${A}${C}]`]), verifier: choixVerif(rep), indice: "Hypoténuse : en face de l'angle droit. Adjacent : touche l'angle marqué. Opposé : ne le touche pas.", correction: `C'est ${rep}.` };
    }
  },

  {
    groupe: F1,
    id: "ecrire-cos",
    titre: "Écrire le cosinus",
    description: "Adjacent sur hypoténuse.",
    generer() {
      const [A, B, C] = tirerLettres(3), autre = Math.random() < 0.5;
      const ang = autre ? `${A}${C}${B}` : `${A}${B}${C}`, bonne = autre ? `${A}${C}/${B}${C}` : `${A}${B}/${B}${C}`;
      return { consigne: `${A}${B}${C} est rectangle en ${A}. Que vaut cos ${ang} ?`, choix: melanger([`${A}${B}/${B}${C}`, `${A}${C}/${B}${C}`, `${B}${C}/${A}${B}`, `${A}${B}/${A}${C}`]), verifier: choixVerif(bonne), indice: "cos = côté adjacent ÷ hypoténuse.", correction: `cos ${ang} = ${bonne}` };
    }
  },

  {
    groupe: F1,
    id: "quelle-formule",
    titre: "SOH CAH TOA",
    description: "Quel rapport ?",
    generer() {
      const [a, b, bonne] = choisir([["l'opposé", "l'hypoténuse", "le sinus"], ["l'adjacent", "l'hypoténuse", "le cosinus"], ["l'opposé", "l'adjacent", "la tangente"]]);
      return { consigne: `Le quotient de ${a} par ${b} (pour un angle aigu d'un triangle rectangle) est…`, choix: ["le sinus", "le cosinus", "la tangente"], verifier: choixVerif(bonne), indice: "SOH CAH TOA : Sinus = Opposé/Hypoténuse, Cosinus = Adjacent/Hypoténuse, Tangente = Opposé/Adjacent.", correction: bonne + "." };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "calc-cos",
    titre: "Calculer un cosinus",
    description: "Touche cos.",
    generer() {
      const a = choisir([alea(5, 85), 30, 45, 60]);
      return { consigne: `Donne cos ${a}° arrondi au millième.`, ligne: `cos ${a}° ≈ [d]`, verifier: v => verifierArrondi(v[0], cosd(a), 3), indice: "Calculatrice en mode degrés, touche cos.", correction: `cos ${a}° ≈ ${nb(arr(cosd(a), 3))}` };
    }
  },

  {
    groupe: F2,
    id: "calc-angle",
    titre: "Retrouver l'angle",
    description: "Touche cos⁻¹.",
    generer() {
      const c = choisir([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8, 0.9, 0.95]);
      return { consigne: `Le cosinus d'un angle aigu vaut ${nb(c)}. Donne la mesure de l'angle arrondie au dixième de degré.`, ligne: "[d] °", verifier: v => verifierArrondi(v[0], acosd(c), 1), indice: "Touches 2nde puis cos (ou cos⁻¹).", correction: `cos⁻¹(${nb(c)}) ≈ ${nb(arr(acosd(c), 1))}°` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "adjacent",
    titre: "Calculer le côté adjacent",
    description: "adj = hyp × cos.",
    generer() {
      const [A, B, C] = tirerLettres(3), h = alea(30, 150) / 10, a = alea(15, 75), r = h * cosd(a);
      return { consigne: `${A}${B}${C} est rectangle en ${A}, ${B}${C} = ${nb(h)} cm et l'angle ${A}${B}${C} mesure ${a}°. Calcule ${A}${B} (arrondi au dixième).`, figure: figTrigo([A, B, C], { BC: nb(h) + " cm", AB: "?", angle: a + "°" }), ligne: `${A}${B} ≈ [d] cm`, verifier: v => verifierArrondi(v[0], r), indice: `cos ${a}° = ${A}${B} ÷ ${nb(h)}, donc ${A}${B} = ${nb(h)} × cos ${a}°.`, correction: `${A}${B} = ${nb(h)} × cos ${a}° ≈ ${nb(arr(r, 1))} cm` };
    }
  },

  {
    groupe: F3,
    id: "hypotenuse",
    titre: "Calculer l'hypoténuse",
    description: "hyp = adj ÷ cos.",
    generer() {
      const [A, B, C] = tirerLettres(3), ad = alea(20, 120) / 10, a = alea(15, 70), r = ad / cosd(a);
      return { consigne: `${A}${B}${C} est rectangle en ${A}, ${A}${B} = ${nb(ad)} cm et l'angle ${A}${B}${C} mesure ${a}°. Calcule ${B}${C} (arrondi au dixième).`, figure: figTrigo([A, B, C], { AB: nb(ad) + " cm", BC: "?", angle: a + "°" }), ligne: `${B}${C} ≈ [d] cm`, verifier: v => verifierArrondi(v[0], r), indice: `cos ${a}° = ${nb(ad)} ÷ ${B}${C}, donc ${B}${C} = ${nb(ad)} ÷ cos ${a}°.`, correction: `${B}${C} = ${nb(ad)} ÷ cos ${a}° ≈ ${nb(arr(r, 1))} cm` };
    }
  },

  {
    groupe: F3,
    id: "sin-tan-longueur",
    titre: "Avec le sinus ou la tangente",
    description: "Calculer le côté opposé.",
    generer() {
      const [A, B, C] = tirerLettres(3), a = alea(15, 70), d2r = Math.PI / 180;
      if (Math.random() < 0.5) { const h = alea(30, 150) / 10, r = h * Math.sin(a * d2r);
        return { consigne: `${A}${B}${C} est rectangle en ${A}, ${B}${C} = ${nb(h)} cm et l'angle ${A}${B}${C} mesure ${a}°. Calcule ${A}${C} (arrondi au dixième).`, figure: figTrigo([A, B, C], { BC: nb(h) + " cm", AC: "?", angle: a + "°" }), ligne: `${A}${C} ≈ [d] cm`, verifier: v => verifierArrondi(v[0], r), indice: `[${A}${C}] est opposé à l'angle, [${B}${C}] est l'hypoténuse : sinus.`, correction: `${A}${C} = ${nb(h)} × sin ${a}° ≈ ${nb(arr(r, 1))} cm` }; }
      const ad = alea(20, 120) / 10, r = ad * Math.tan(a * d2r);
      return { consigne: `${A}${B}${C} est rectangle en ${A}, ${A}${B} = ${nb(ad)} cm et l'angle ${A}${B}${C} mesure ${a}°. Calcule ${A}${C} (arrondi au dixième).`, figure: figTrigo([A, B, C], { AB: nb(ad) + " cm", AC: "?", angle: a + "°" }), ligne: `${A}${C} ≈ [d] cm`, verifier: v => verifierArrondi(v[0], r), indice: `[${A}${C}] est opposé, [${A}${B}] est adjacent : tangente.`, correction: `${A}${C} = ${nb(ad)} × tan ${a}° ≈ ${nb(arr(r, 1))} cm` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "angle",
    titre: "Calculer un angle",
    description: "cos⁻¹(adj ÷ hyp).",
    generer() {
      const [A, B, C] = tirerLettres(3), h = alea(40, 150) / 10, ad = alea(10, Math.floor(h * 10) - 5) / 10, r = acosd(ad / h);
      return { consigne: `${A}${B}${C} est rectangle en ${A}, ${A}${B} = ${nb(ad)} cm et ${B}${C} = ${nb(h)} cm. Calcule l'angle ${A}${B}${C} (arrondi au dixième de degré).`, figure: figTrigo([A, B, C], { AB: nb(ad) + " cm", BC: nb(h) + " cm", angle: "?" }), ligne: `${A}${B}${C} ≈ [d] °`, verifier: v => verifierArrondi(v[0], r), indice: `cos ${A}${B}${C} = ${nb(ad)} ÷ ${nb(h)}, puis touche cos⁻¹.`, correction: `cos ${A}${B}${C} = ${nb(ad)} ÷ ${nb(h)} ; angle ≈ ${nb(arr(r, 1))}°` };
    }
  },

  {
    groupe: F4,
    id: "angle-sin-tan",
    titre: "Angle avec sin⁻¹ ou tan⁻¹",
    description: "Deux côtés connus.",
    generer() {
      const [A, B, C] = tirerLettres(3), r2d = 180 / Math.PI;
      if (Math.random() < 0.5) { const h = alea(40, 150) / 10, op = alea(10, Math.floor(h * 10) - 5) / 10, r = Math.asin(op / h) * r2d;
        return { consigne: `${A}${B}${C} est rectangle en ${A}, ${A}${C} = ${nb(op)} cm et ${B}${C} = ${nb(h)} cm. Calcule l'angle ${A}${B}${C} (au dixième de degré).`, figure: figTrigo([A, B, C], { AC: nb(op) + " cm", BC: nb(h) + " cm", angle: "?" }), ligne: `${A}${B}${C} ≈ [d] °`, verifier: v => verifierArrondi(v[0], r), indice: `sin ${A}${B}${C} = ${nb(op)} ÷ ${nb(h)}, puis sin⁻¹.`, correction: `sin = ${nb(op)} ÷ ${nb(h)} ; angle ≈ ${nb(arr(r, 1))}°` }; }
      const ad = alea(20, 120) / 10, op = alea(10, 120) / 10, r = Math.atan(op / ad) * r2d;
      return { consigne: `${A}${B}${C} est rectangle en ${A}, ${A}${B} = ${nb(ad)} cm et ${A}${C} = ${nb(op)} cm. Calcule l'angle ${A}${B}${C} (au dixième de degré).`, figure: figTrigo([A, B, C], { AB: nb(ad) + " cm", AC: nb(op) + " cm", angle: "?" }), ligne: `${A}${B}${C} ≈ [d] °`, verifier: v => verifierArrondi(v[0], r), indice: `tan ${A}${B}${C} = ${nb(op)} ÷ ${nb(ad)}, puis tan⁻¹.`, correction: `tan = ${nb(op)} ÷ ${nb(ad)} ; angle ≈ ${nb(arr(r, 1))}°` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "quelle-operation",
    titre: "Multiplier ou diviser ?",
    description: "Le bon calcul.",
    generer() {
      const a = alea(20, 70), x = alea(3, 12), cherche = choisir(["adj", "hyp"]);
      const bonne = cherche === "adj" ? `${x} × cos ${a}°` : `${x} ÷ cos ${a}°`;
      return { consigne: cherche === "adj" ? `Dans un triangle rectangle, l'hypoténuse mesure ${x} cm et un angle aigu ${a}°. Quel calcul donne le côté adjacent à cet angle ?` : `Dans un triangle rectangle, le côté adjacent à un angle de ${a}° mesure ${x} cm. Quel calcul donne l'hypoténuse ?`, choix: melanger([`${x} × cos ${a}°`, `${x} ÷ cos ${a}°`, `cos ${a}° ÷ ${x}`]), verifier: choixVerif(bonne), indice: "Pars de cos = adjacent ÷ hypoténuse et utilise le produit en croix.", correction: bonne + (cherche === "hyp" ? " (l'hypoténuse est plus longue que le côté adjacent)." : ".") };
    }
  },

  {
    groupe: F5,
    id: "outil",
    titre: "Pythagore ou trigonométrie ?",
    description: "Choisir l'outil.",
    generer() {
      const [q, r] = choisir([["On connaît les deux côtés de l'angle droit ; on cherche l'hypoténuse.", "Pythagore"], ["On connaît l'hypoténuse et un angle ; on cherche le côté opposé.", "sinus"], ["On connaît les deux côtés de l'angle droit ; on cherche un angle.", "tangente"], ["On connaît un angle et le côté adjacent ; on cherche l'hypoténuse.", "cosinus"], ["On connaît l'hypoténuse et un côté ; on cherche le troisième côté.", "Pythagore"], ["On connaît un angle et le côté adjacent ; on cherche le côté opposé.", "tangente"]]);
      return { consigne: q + " Quel outil utiliser ?", choix: ["Pythagore", "cosinus", "sinus", "tangente"], verifier: choixVerif(r), indice: "Pas d'angle en jeu : Pythagore. Sinon SOH CAH TOA.", correction: r + "." };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "probleme",
    titre: "Problèmes",
    description: "Échelles, toboggans, rampes…",
    generer() {
      const [q, r, u, c] = choisir([
        (() => { const L = choisir([5, 6, 8, 13]), a = choisir([65, 70, 75]); return [`Une échelle de ${L} m fait un angle de ${a}° avec le sol. À quelle distance du mur est son pied (au cm) ?`, L * cosd(a), "m", `${L} × cos ${a}° ≈ ${nb(arr(L * cosd(a), 2))} m`]; })(),
        (() => { const L = choisir([13, 10, 6.5]), d = choisir([5, 2.5, 3]); return [`Une échelle de ${nb(L)} m a son pied à ${nb(d)} m du mur. Quel angle fait-elle avec le sol (au dixième de degré) ?`, acosd(d / L), "°", `cos α = ${nb(d)} ÷ ${nb(L)} ; α ≈ ${nb(arr(acosd(d / L), 1))}°`]; })(),
        (() => { const L = choisir([3, 3.5, 4]), a = choisir([30, 35, 40]); return [`Un toboggan de ${nb(L)} m fait un angle de ${a}° avec le sol. Quelle distance au sol occupe-t-il (au cm) ?`, L * cosd(a), "m", `${nb(L)} × cos ${a}° ≈ ${nb(arr(L * cosd(a), 2))} m`]; })(),
        (() => { const d = choisir([2, 3, 5]), a = choisir([8, 10, 12]); return [`Un avion monte avec un angle de ${a}° ; il survole un point à ${d} km (au sol) de son point de départ. Distance parcourue en vol (au mètre) ?`, d * 1000 / cosd(a), "m", `${d * 1000} ÷ cos ${a}° ≈ ${nb(Math.round(d * 1000 / cosd(a)))} m`]; })()
      ]);
      const d = u === "°" ? 1 : u === "m" && r > 100 ? 0 : 2;
      return { consigne: q, ligne: `[d] ${u}`, verifier: v => verifierArrondi(v[0], r, d), indice: "Fais un schéma, repère l'angle, l'hypoténuse et le côté adjacent.", correction: c };
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
    { competence: "SOH CAH TOA", activites: ["quelle-formule"] },
    { competence: "Écrire un cosinus", activites: ["ecrire-cos"] },
    { competence: "Calculatrice", activites: ["calc-cos", "calc-angle"] },
    { competence: "Calculer le côté adjacent", activites: ["adjacent"] },
    { competence: "Calculer l'hypoténuse", activites: ["hypotenuse"] },
    { competence: "Calculer avec sinus ou tangente", activites: ["sin-tan-longueur"] },
    { competence: "Calculer un angle (cosinus)", activites: ["angle"] },
    { competence: "Calculer un angle (sinus, tangente)", activites: ["angle-sin-tan"] },
    { competence: "Multiplier ou diviser ?", activites: ["quelle-operation"] },
    { competence: "Choisir l'outil", activites: ["outil"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
