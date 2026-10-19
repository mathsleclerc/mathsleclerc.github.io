/* =====================================================================
   EXERCISEUR « NOMBRES RELATIFS ET REPÉRAGE » — 5e, chapitre 5

   Les activités sont rangées comme les 7 feuilles d'exercices du chapitre.
   Les cases [r] acceptent le signe moins (clavier complet sur téléphone).
   PARCOURS (en bas du fichier) : le test « Je me teste » en 14 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Découvrir les nombres relatifs";
const F2 = "Feuille 2 — La droite graduée";
const F3 = "Feuille 3 — Repérage dans le plan";
const F4 = "Feuille 4 — Comparer et ranger";
const F5 = "Feuille 5 — Additionner";
const F6 = "Feuille 6 — Soustraire";
const F7 = "Feuille 7 — Enchaîner les calculs, problèmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };   // −3,5
const sg = x => (rr(x) > 0 ? "+" : "") + nb(x);                                               // +3,5 / −3,5
const par = x => "(" + sg(x) + ")";                                                           // (−3,5)
const relatif = (min, max, dec = 0) => rr(alea(min * 10 ** dec, max * 10 ** dec) / 10 ** dec);
const verifierRel = (v, r) => verifierNombre(v, rr(r));
const STYLE_POINT = "stroke: var(--cours); stroke-width: 3; stroke-linecap: round";
const STYLE_ELEVE = "stroke: var(--exercices); stroke-width: 3; stroke-linecap: round";
const STYLE_BON = "stroke: var(--corrige); stroke-width: 3; stroke-linecap: round";
const STYLE_TXT = "font-size: 15px; font-weight: 700; text-anchor: middle";

/* Droite graduée de min à max, pas = valeur d'un petit intervalle, étiquettes tous les « etiq » */
function droiteRel(min, max, pas, etiq, { points = [], clic = false } = {}) {
  const n = Math.round((max - min) / pas), w = Math.min(560, Math.max(320, n * 26)), u = (w - 50) / n;
  const X = v => 25 + (v - min) / pas * u, H = 90, y = 50;
  const s = svg("svg", { viewBox: `0 0 ${w} ${H}`, width: w, height: H, class: "droite" + (clic ? " droite-clic" : "") });
  s.append(svg("line", { x1: 8, y1: y, x2: w - 8, y2: y, class: "axe" }));
  for (let k = 0; k <= n; k++) {
    const v = rr(min + k * pas), maj = Math.abs(v / etiq - Math.round(v / etiq)) < 1e-9;
    s.append(svg("line", { x1: X(v), y1: y - (maj ? 9 : 5), x2: X(v), y2: y + (maj ? 9 : 5), class: maj ? "grad maj" : "grad" }));
    if (maj) s.append(svg("text", { x: X(v), y: y + 30, class: "etiq" }, nb(v)));
  }
  const croix = (v, nom, style) => {
    const g = svg("g", {}, svg("line", { x1: X(v) - 6, y1: y - 6, x2: X(v) + 6, y2: y + 6, style }), svg("line", { x1: X(v) - 6, y1: y + 6, x2: X(v) + 6, y2: y - 6, style }),
      svg("text", { x: X(v), y: y - 14, style: STYLE_TXT + ";fill:" + (style === STYLE_POINT ? "var(--cours)" : style === STYLE_BON ? "var(--corrige)" : "var(--exercices)") }, nom));
    s.append(g); return g;
  };
  points.forEach(([v, nom]) => croix(v, nom, STYLE_POINT));
  const res = { svg: s, valeur: null, actif: true, croix };
  if (clic) {
    let g = null;
    s.addEventListener("pointerdown", e => {
      if (!res.actif) return;
      const p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      const q = p.matrixTransform(s.getScreenCTM().inverse());
      const k = Math.max(0, Math.min(n, Math.round((q.x - 25) / u)));
      res.valeur = rr(min + k * pas);
      g?.remove(); g = croix(res.valeur, clic, STYLE_ELEVE);
    });
  }
  return res;
}

/* Repère quadrillé de −m à m en abscisse et en ordonnée */
function repere(m, { points = [], clic = false } = {}) {
  const pas = 26, c = m * pas + 22, L = 2 * c;
  const s = svg("svg", { viewBox: `0 0 ${L} ${L}`, width: L, height: L, role: "img", "aria-label": "Repère" });
  const P = (x, y) => ({ x: c + x * pas, y: c - y * pas });
  for (let k = -m; k <= m; k++) {
    s.append(svg("line", { x1: P(k, -m).x, y1: P(k, -m).y, x2: P(k, m).x, y2: P(k, m).y, style: "stroke: var(--bord); stroke-width: 1" }));
    s.append(svg("line", { x1: P(-m, k).x, y1: P(-m, k).y, x2: P(m, k).x, y2: P(m, k).y, style: "stroke: var(--bord); stroke-width: 1" }));
  }
  s.append(svg("line", { x1: P(-m, 0).x - 8, y1: P(0, 0).y, x2: P(m, 0).x + 12, y2: P(0, 0).y, style: "stroke: var(--texte); stroke-width: 2" }));
  s.append(svg("line", { x1: P(0, 0).x, y1: P(0, -m).y + 8, x2: P(0, 0).x, y2: P(0, m).y - 12, style: "stroke: var(--texte); stroke-width: 2" }));
  for (let k = -m; k <= m; k++) if (k) {
    s.append(svg("text", { x: P(k, 0).x, y: P(k, 0).y + 15, style: "font-size: 11px; text-anchor: middle; fill: var(--texte-doux)" }, nb(k)));
    s.append(svg("text", { x: P(0, k).x - 6, y: P(0, k).y + 4, style: "font-size: 11px; text-anchor: end; fill: var(--texte-doux)" }, nb(k)));
  }
  const croix = (x, y, nom, style, coul) => {
    const p = P(x, y), g = svg("g", {}, svg("line", { x1: p.x - 6, y1: p.y - 6, x2: p.x + 6, y2: p.y + 6, style }), svg("line", { x1: p.x - 6, y1: p.y + 6, x2: p.x + 6, y2: p.y - 6, style }),
      svg("text", { x: p.x + 12, y: p.y - 8, style: STYLE_TXT + ";fill:" + coul }, nom));
    s.append(g); return g;
  };
  points.forEach(([x, y, nom]) => croix(x, y, nom, STYLE_POINT, "var(--cours)"));
  const res = { svg: s, valeur: null, actif: true, croix };
  if (clic) {
    let g = null;
    s.style.cursor = "crosshair";
    s.addEventListener("pointerdown", e => {
      if (!res.actif) return;
      const p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      const q = p.matrixTransform(s.getScreenCTM().inverse());
      const x = Math.max(-m, Math.min(m, Math.round((q.x - c) / pas))), y = Math.max(-m, Math.min(m, Math.round((c - q.y) / pas)));
      res.valeur = [x, y];
      g?.remove(); g = croix(x, y, clic, STYLE_ELEVE, "var(--exercices)");
    });
  }
  return res;
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "traduire",
    titre: "Traduire une situation",
    description: "Températures, altitudes, dates…",
    generer() {
      const n = alea(2, 40);
      const [t, r] = choisir([
        [`Il fait ${n} degrés au-dessous de zéro.`, -n], [`Il fait ${n} degrés au-dessus de zéro.`, n],
        [`Un plongeur est à ${n * 2} m sous la surface de l'eau.`, -2 * n], [`Un avion vole à ${n * 250} m d'altitude.`, 250 * n],
        [`L'ascenseur est au ${Math.min(n, 5)}e sous-sol.`, -Math.min(n, 5)], [`Ce roi est né en l'an ${n * 10} avant J.-C.`, -10 * n],
        [`Le compte de Léo a un découvert de ${n} €.`, -n], [`Tom a gagné ${n} points.`, n]
      ]);
      return {
        consigne: `${t} Quel nombre relatif traduit cette situation ?`,
        ligne: "[r]",
        verifier: v => verifierRel(v[0], r),
        indice: "Au-dessous de zéro, sous le niveau de la mer, avant J.-C., en sous-sol, une dette : on utilise un nombre négatif.",
        correction: `On écrit ${sg(r)}.`
      };
    }
  },

  {
    groupe: F1,
    id: "oppose",
    titre: "Opposé et distance à zéro",
    description: "Le signe et la distance à zéro.",
    generer() {
      const x = choisir([relatif(-20, 20), relatif(-99, 99, 1)]);
      const opp = Math.random() < 0.5;
      return {
        consigne: opp ? `Quel est l'opposé de ${nb(x)} ?` : `Quelle est la distance à zéro de ${nb(x)} ?`,
        ligne: "[r]",
        verifier: v => verifierRel(v[0], opp ? -x : Math.abs(x)),
        indice: opp ? "L'opposé a la même distance à zéro et le signe contraire." : "La distance à zéro est le nombre « sans son signe » : elle est toujours positive.",
        correction: opp ? `L'opposé de ${nb(x)} est ${nb(-x)}.` : `La distance à zéro de ${nb(x)} est ${nb(Math.abs(x))}.`
      };
    }
  },

  {
    groupe: F1,
    id: "positif-negatif",
    titre: "Positif ou négatif ?",
    description: "Strictement positif, strictement négatif…",
    generer() {
      const x = choisir([relatif(-50, -1), relatif(1, 50), 0, relatif(-99, 99, 1)]);
      const r = x > 0 ? "strictement positif" : x < 0 ? "strictement négatif" : "à la fois positif et négatif";
      return {
        consigne: `Le nombre ${nb(x)} est…`,
        choix: ["strictement positif", "strictement négatif", "à la fois positif et négatif"],
        verifier: (v, c) => ({ etat: c === r ? "juste" : "faux" }),
        indice: "0 est le seul nombre à la fois positif et négatif.",
        correction: `${nb(x)} est ${r}.`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "lire-abscisse",
    titre: "Lire une abscisse",
    description: "Sur une droite graduée.",
    generer() {
      const [pas, etiq] = choisir([[1, 1], [1, 2], [0.5, 1], [0.1, 0.5], [2, 10], [5, 10]]);
      const n = 14, min = rr(-Math.round(alea(5, 9)) * pas), max = rr(min + n * pas);
      const v = rr(min + alea(1, n - 1) * pas);
      const d = droiteRel(min, max, pas, etiq, { points: [[v, "A"]] });
      return {
        consigne: "Quelle est l'abscisse du point A ?",
        figure: d.svg,
        ligne: "A( [r] )",
        verifier: x => verifierRel(x[0], v),
        indice: `Regarde d'abord ce que vaut un petit intervalle : ici ${nb(pas)}.`,
        correction: `Chaque petit intervalle vaut ${nb(pas)} : A a pour abscisse ${nb(v)}.`
      };
    }
  },

  {
    groupe: F2,
    id: "placer-abscisse",
    titre: "Placer un point",
    description: "Cliquer sur la droite graduée.",
    generer() {
      const [pas, etiq] = choisir([[1, 1], [0.5, 1], [1, 2], [0.5, 2]]);
      const min = -6, max = 6, v = rr(min + alea(1, (max - min) / pas - 1) * pas);
      if (v === 0) return this.generer();
      const d = droiteRel(min, max, pas, etiq, { clic: "B" });
      return {
        consigne: `Place le point B d'abscisse ${nb(v)} en cliquant sur la droite, puis valide.`,
        figure: d.svg,
        verifier() {
          if (d.valeur === null) return { etat: "incomplet", message: "Clique sur la droite graduée." };
          if (egal(d.valeur, -v)) return { etat: "faux", message: "Tu as placé l'opposé : regarde le signe !" };
          return egal(d.valeur, v) ? { etat: "juste" } : { etat: "faux" };
        },
        indice: v < 0 ? "Un nombre négatif est à gauche de 0." : "Un nombre positif est à droite de 0.",
        correction: `B est à ${nb(Math.abs(v))} unité${Math.abs(v) >= 2 ? "s" : ""} ${v < 0 ? "à gauche" : "à droite"} de 0 (point vert).`,
        surCorrection() { d.croix(v, "B", STYLE_BON); },
        bloquer() { d.actif = false; }
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "lire-coordonnees",
    titre: "Lire des coordonnées",
    description: "Abscisse, puis ordonnée.",
    generer() {
      const x = alea(-5, 5), y = alea(-5, 5);
      if (!x && !y) return this.generer();
      const r = repere(5, { points: [[x, y, "M"]] });
      return {
        consigne: "Quelles sont les coordonnées du point M ?",
        figure: r.svg,
        ligne: "M( [r] ; [r] )",
        verifier: v => {
          const a = lireNombre(v[0]), b = lireNombre(v[1]);
          if (isNaN(a) || isNaN(b)) return { etat: "incomplet", message: "Remplis les deux cases." };
          if (a === y && b === x && x !== y) return { etat: "faux", message: "Tu as inversé l'abscisse et l'ordonnée." };
          return a === x && b === y ? { etat: "juste" } : { etat: "faux" };
        },
        indice: "D'abord l'abscisse (lue sur l'axe horizontal), puis l'ordonnée (axe vertical).",
        correction: `M(${nb(x)} ; ${nb(y)})`
      };
    }
  },

  {
    groupe: F3,
    id: "placer-point",
    titre: "Placer un point dans un repère",
    description: "Cliquer sur le quadrillage.",
    generer() {
      const x = alea(-5, 5), y = alea(-5, 5);
      if (!x || !y) return this.generer();
      const r = repere(5, { clic: "N" });
      return {
        consigne: `Place le point N(${nb(x)} ; ${nb(y)}) en cliquant sur le quadrillage, puis valide.`,
        figure: r.svg,
        verifier() {
          if (!r.valeur) return { etat: "incomplet", message: "Clique sur un nœud du quadrillage." };
          const [a, b] = r.valeur;
          if (a === y && b === x) return { etat: "faux", message: "Tu as inversé l'abscisse et l'ordonnée." };
          return a === x && b === y ? { etat: "juste" } : { etat: "faux" };
        },
        indice: "Avance d'abord horizontalement de l'abscisse, puis verticalement de l'ordonnée.",
        correction: `On se déplace de ${nb(x)} horizontalement puis de ${nb(y)} verticalement (point vert).`,
        surCorrection() { r.croix(x, y, "N", STYLE_BON, "var(--corrige)"); },
        bloquer() { r.actif = false; }
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "comparer",
    titre: "Comparer deux relatifs",
    description: "< ou > ?",
    generer() {
      let a, b;
      do { a = choisir([relatif(-20, 20), relatif(-99, 99, 1)]); b = choisir([relatif(-20, 20), -Math.abs(rr(a + choisir([-1, 1, 0.1, -0.1, 2])))]); } while (egal(a, b));
      const signe = a < b ? "<" : ">";
      return {
        consigne: "Compare les deux nombres.",
        ligne: `${nb(a)} [c] ${nb(b)}`,
        choix: ["<", ">"],
        verifier: (v, c) => ({ etat: c === signe ? "juste" : "faux" }),
        indice: "Entre deux nombres négatifs, le plus petit est celui qui est le plus loin de zéro.",
        correction: `${nb(a)} ${signe} ${nb(b)}`
      };
    }
  },

  {
    groupe: F4,
    id: "plus-petit",
    titre: "Le plus petit, le plus grand",
    description: "Choisir parmi plusieurs nombres.",
    generer() {
      const l = [];
      while (l.length < 4) { const x = choisir([relatif(-15, 15), relatif(-99, 99, 1)]); if (!l.some(y => egal(x, y))) l.push(x); }
      const petit = Math.random() < 0.5, r = petit ? Math.min(...l) : Math.max(...l);
      return {
        consigne: `Quel est le plus ${petit ? "petit" : "grand"} de ces nombres ?`,
        choix: l.map(nb),
        verifier: (v, c) => ({ etat: c === nb(r) ? "juste" : "faux" }),
        indice: "Place-les mentalement sur une droite graduée.",
        correction: `Dans l'ordre croissant : ${[...l].sort((x, y) => x - y).map(nb).join(" < ")}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "additionner",
    titre: "Additionner deux relatifs",
    description: "Même signe ou signes contraires.",
    generer(st) {
      const dec = st && st.serie > 4 ? 1 : 0;
      const a = relatif(-20, 20, dec), b = relatif(-20, 20, dec);
      const r = rr(a + b);
      const regle = Math.sign(a) === Math.sign(b) || !a || !b ? "même signe : on additionne les distances à zéro et on garde le signe" : "signes contraires : on soustrait les distances à zéro et on prend le signe du plus « loin » de zéro";
      return {
        consigne: `Calcule ${par(a)} + ${par(b)}.`,
        ligne: `${par(a)} + ${par(b)} = [r]`,
        verifier: v => verifierRel(v[0], r),
        indice: "Même signe : on additionne les distances à zéro. Signes contraires : on les soustrait.",
        correction: `${par(a)} + ${par(b)} = ${sg(r)} (${regle}).`
      };
    }
  },

  {
    groupe: F5,
    id: "additionner-plusieurs",
    titre: "Additionner plusieurs relatifs",
    description: "Regrouper positifs et négatifs.",
    generer() {
      const l = Array.from({ length: alea(3, 5) }, () => relatif(-15, 15)).map(x => x || 1);
      const pos = l.filter(x => x > 0).reduce((s, x) => s + x, 0), neg = l.filter(x => x < 0).reduce((s, x) => s + x, 0);
      return {
        consigne: `Calcule ${l.map(par).join(" + ")}.`,
        ligne: "[r]",
        verifier: v => verifierRel(v[0], pos + neg),
        indice: "Additionne d'abord tous les positifs, puis tous les négatifs.",
        correction: `Positifs : ${sg(pos)} ; négatifs : ${nb(neg)} ; total : ${sg(pos + neg)}.`
      };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "soustraire",
    titre: "Soustraire deux relatifs",
    description: "Ajouter l'opposé.",
    generer(st) {
      const dec = st && st.serie > 4 ? 1 : 0;
      const a = relatif(-20, 20, dec), b = relatif(-20, 20, dec) || 3;
      return {
        consigne: `Calcule ${par(a)} − ${par(b)}.`,
        ligne: `${par(a)} − ${par(b)} = [r]`,
        verifier: v => verifierRel(v[0], a - b),
        indice: "Soustraire un nombre, c'est additionner son opposé.",
        correction: `${par(a)} − ${par(b)} = ${par(a)} + ${par(-b)} = ${sg(a - b)}`
      };
    }
  },

  {
    groupe: F6,
    id: "ecart",
    titre: "Calculer un écart",
    description: "Températures, altitudes, dates.",
    generer() {
      const [t, h, b, u] = choisir([
        (() => { const m = alea(-25, 5), M = m + alea(3, 25); return [`La température minimale est ${nb(m)} °C et la maximale ${nb(M)} °C. Quel est l'écart ?`, M, m, "°C"]; })(),
        (() => { const n = alea(100, 600), d = alea(-400, -100); return [`Une montgolfière est à ${n} m d'altitude, juste au-dessus d'un plongeur à ${nb(d)} m. Quelle distance les sépare ?`, n, d, "m"]; })(),
        (() => { const nais = -alea(300, 600), mort = nais + alea(40, 90); return [`Un savant grec est né en ${nb(nais)} et mort en ${nb(mort)}. Combien d'années a-t-il vécu ?`, mort, nais, "ans"]; })()
      ]);
      return {
        consigne: t,
        ligne: `[r] ${u}`,
        verifier: v => verifierRel(v[0], h - b),
        indice: "L'écart, c'est le plus grand moins le plus petit.",
        correction: `${nb(h)} − ${par(b)} = ${nb(h)} + ${nb(-b)} = ${nb(h - b)} ${u}`
      };
    }
  },

  /* ================= Feuille 7 ================= */
  {
    groupe: F7,
    id: "enchainer",
    titre: "Enchaîner additions et soustractions",
    description: "Écritures simplifiées.",
    generer() {
      const l = Array.from({ length: alea(3, 5) }, () => alea(1, 15) * choisir([1, -1]));
      const txt = l.map((x, i) => i === 0 ? nb(x) : (x < 0 ? " − " : " + ") + Math.abs(x)).join("");
      const r = l.reduce((s, x) => s + x, 0);
      return {
        consigne: `Calcule : ${txt}`,
        ligne: `${txt} = [r]`,
        verifier: v => verifierRel(v[0], r),
        indice: "Calcule de gauche à droite, ou regroupe les nombres « avec + » et les nombres « avec − ».",
        correction: `${txt} = ${nb(r)}`
      };
    }
  },

  {
    groupe: F7,
    id: "simplifier",
    titre: "Simplifier l'écriture",
    description: "Enlever les parenthèses.",
    generer() {
      const a = relatif(-12, 12) || 4, b = relatif(-12, 12) || -5, op = choisir(["+", "−"]);
      const bonne = nb(a) + ((op === "+" ? b : -b) < 0 ? " − " : " + ") + Math.abs(b);
      const fausse1 = nb(a) + ((op === "+" ? -b : b) < 0 ? " − " : " + ") + Math.abs(b);
      const fausse2 = nb(-a) + ((op === "+" ? b : -b) < 0 ? " − " : " + ") + Math.abs(b);
      return {
        consigne: `Quelle est l'écriture simplifiée de ${par(a)} ${op} ${par(b)} ?`,
        choix: melanger([bonne, fausse1, fausse2]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Transforme d'abord la soustraction en addition de l'opposé, puis enlève les parenthèses et le signe + de l'addition.",
        correction: `${par(a)} ${op} ${par(b)} s'écrit ${bonne} (= ${nb(op === "+" ? a + b : a - b)}).`
      };
    }
  },

  {
    groupe: F7,
    id: "probleme",
    titre: "Problèmes",
    description: "Une seule expression avec des relatifs.",
    generer() {
      const [t, r, u] = choisir([
        (() => { const d = alea(-10, -1), m = alea(5, 15), b = alea(2, 10); return [`À 6 h, il fait ${nb(d)} °C. La température monte de ${m} °C, puis baisse de ${b} °C. Quelle température fait-il ensuite ?`, d + m - b, "°C"]; })(),
        (() => { const s = alea(-80, -10), dep = alea(50, 150), p = alea(20, 90); return [`Un compte bancaire est à ${nb(s)} €. On dépose ${dep} €, puis on paie ${p} €. Quel est le solde ?`, s + dep - p, "€"]; })(),
        (() => { const e = alea(1, 6), d1 = alea(3, 8), m = alea(1, 4), d2 = alea(1, 5); return [`Un ascenseur part de l'étage ${e}, descend de ${d1} étages, monte de ${m} puis descend de ${d2}. À quel étage arrive-t-il ?`, e - d1 + m - d2, ""]; })(),
        (() => { const p = -alea(50, 200), r1 = alea(20, 60), d = alea(30, 100); return [`Un sous-marin est à ${nb(p)} m. Il remonte de ${r1} m puis descend de ${d} m. À quelle altitude est-il ?`, p + r1 - d, "m"]; })()
      ]);
      return {
        consigne: t,
        ligne: `[r] ${u}`,
        verifier: v => verifierRel(v[0], r),
        indice: "Monter ou ajouter : + ; descendre ou payer : −.",
        correction: `Le résultat est ${nb(r)} ${u}.`
      };
    }
  }
];

const egal = (x, y) => Math.abs(x - y) < 1e-9;

/* ---------- Le test « Je me teste » : 14 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "14 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Traduire une situation par un relatif", activites: ["traduire"] },
    { competence: "Opposé et distance à zéro", activites: ["oppose", "positif-negatif"] },
    { competence: "Lire une abscisse", activites: ["lire-abscisse"] },
    { competence: "Placer un point sur une droite graduée", activites: ["placer-abscisse"] },
    { competence: "Lire des coordonnées", activites: ["lire-coordonnees"] },
    { competence: "Placer un point dans un repère", activites: ["placer-point"] },
    { competence: "Comparer deux relatifs", activites: ["comparer"] },
    { competence: "Ranger des relatifs", activites: ["plus-petit"] },
    { competence: "Additionner deux relatifs", activites: ["additionner"] },
    { competence: "Additionner plusieurs relatifs", activites: ["additionner-plusieurs"] },
    { competence: "Soustraire deux relatifs", activites: ["soustraire"] },
    { competence: "Calculer un écart", activites: ["ecart"] },
    { competence: "Enchaîner les calculs", activites: ["enchainer", "simplifier"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
