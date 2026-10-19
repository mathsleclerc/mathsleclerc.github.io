/* =====================================================================
   EXERCISEUR « SYMÉTRIE CENTRALE » — 5e, chapitre 2

   Les activités sont rangées comme les 5 feuilles d'exercices du chapitre.
   Sur quadrillage, l'élève place des points en cliquant sur les nœuds.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Reconnaître une symétrie centrale";
const F2 = "Feuille 2 — Construire sur quadrillage";
const F3 = "Feuille 3 — Le centre, milieu de [AA′]";
const F4 = "Feuille 4 — Utiliser les propriétés";
const F5 = "Feuille 5 — Centres de symétrie";

const nb = x => ecrireNombre(Math.round(x * 1e6) / 1e6);
const STYLE_BLEU = "fill: color-mix(in srgb, var(--cours) 28%, transparent); stroke: var(--cours); stroke-width: 2.5; stroke-linejoin: round";
const STYLE_VERT = "fill: color-mix(in srgb, var(--corrige) 30%, transparent); stroke: var(--corrige); stroke-width: 2.5; stroke-linejoin: round";
const sym = (O, p) => [2 * O[0] - p[0], 2 * O[1] - p[1]];
const egaux = (p, q) => p[0] === q[0] && p[1] === q[1];

/* Un polygone sur le quadrillage g, sommets en carreaux */
function polygone(g, sommets, style = STYLE_BLEU) {
  const pts = sommets.map(([i, j]) => { const p = g.P(i, j); return p.x + "," + p.y; }).join(" ");
  const e = svg("polygon", { points: pts, style });
  g.svg.append(e);
  return e;
}
/* Un polygone « au hasard » de n sommets dans le rectangle [i0, i1] × [j0, j1] (sommets distincts) */
function polygoneHasard(n, i0, i1, j0, j1) {
  const cx = (i0 + i1) / 2, cy = (j0 + j1) / 2;
  const angles = melanger([...Array(n).keys()].map(k => k * 2 * Math.PI / n + Math.random() * 0.6)).sort((a, b) => a - b);
  const pts = angles.map(a => [Math.round(cx + Math.cos(a) * (i1 - i0) / 2), Math.round(cy + Math.sin(a) * (j1 - j0) / 2)]);
  const cles = new Set(pts.map(String));
  return cles.size === n ? pts : polygoneHasard(n, i0, i1, j0, j1);
}
function centreO(g, O) { dessinerPoint(g.svg, g.P(...O), "O", { vers: { x: 0.9, y: 0.9 } }); }

/* Clic sur les nœuds : renvoie la liste des points placés, au plus « max », nommés par noms[] */
function placerPoints(g, noms, C, L) {
  const places = [], marques = [];
  let actif = true;
  g.svg.classList.add("geo-clic");
  g.svg.addEventListener("pointerdown", e => {
    if (!actif) return;
    const { i, j } = g.position(e);
    const p = [Math.max(0, Math.min(C, Math.round(i))), Math.max(0, Math.min(L, Math.round(j)))];
    const k = places.findIndex(q => egaux(q, p));
    if (k >= 0) { places.splice(k, 1); marques.splice(k, 1)[0].remove(); }
    else {
      if (places.length === noms.length) { places.shift(); marques.shift().remove(); }
      places.push(p);
      marques.push(null);
    }
    marques.forEach(m => m?.remove());
    places.forEach((q, n) => { marques[n] = dessinerPoint(g.svg, g.P(...q), noms[n], { vers: { x: -0.9, y: -0.9 }, classe: "geo-eleve" }); });
  });
  return { places, bloquer: () => { actif = false; } };
}

/* Petite rosace SVG à n lobes */
function rosace(n) {
  const s = svg("svg", { viewBox: "-60 -60 120 120", width: 130, height: 130, role: "img", "aria-label": `Rosace à ${n} lobes` });
  for (let k = 0; k < n; k++) {
    const a = -Math.PI / 2 + k * 2 * Math.PI / n;
    s.append(svg("circle", { cx: 24 * Math.cos(a), cy: 24 * Math.sin(a), r: 24, style: STYLE_BLEU }));
  }
  s.append(svg("circle", { cx: 0, cy: 0, r: 50, style: "fill:none;stroke:var(--cours);stroke-width:2" }));
  return s;
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "reconnaitre",
    titre: "Demi-tour ou pas ?",
    description: "La figure verte est-elle l'image par la symétrie de centre O ?",
    generer() {
      const C = 12, L = 8, g = quadrillage(C, L, 28);
      const O = [6, 4];
      const P = polygoneHasard(alea(4, 5), 1, 5, 1, 7);
      const type = choisir(["demi-tour", "demi-tour", "axiale", "translation", "mauvais-centre"]);
      const image = {
        "demi-tour": P.map(p => sym(O, p)),
        "axiale": P.map(([i, j]) => [12 - i, j]),
        "translation": P.map(([i, j]) => [i + 6, j]),
        "mauvais-centre": P.map(p => sym([6, 4], p)).map(([i, j]) => [i, Math.min(8, Math.max(0, j - 1))])
      }[type];
      polygone(g, P); polygone(g, image, STYLE_VERT); centreO(g, O);
      const oui = type === "demi-tour";
      return {
        consigne: "La figure verte est-elle le symétrique de la figure bleue par rapport au point O ?",
        figure: g.svg,
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === oui ? "juste" : "faux" }),
        indice: "Imagine que tu fais tourner la figure bleue d'un demi-tour autour de O : retombe-t-elle exactement sur la verte ?",
        correction: oui ? "Oui : chaque sommet vert est le symétrique d'un sommet bleu, O est le milieu du segment qui les joint."
          : { "axiale": "Non : c'est une symétrie axiale (la figure est retournée comme par pliage).", "translation": "Non : la figure a glissé sans tourner.", "mauvais-centre": "Non : la figure a bien tourné d'un demi-tour, mais pas autour de O." }[type]
      };
    }
  },

  {
    groupe: F1,
    id: "droite-graduee",
    titre: "Symétriques sur une droite",
    description: "Trouver le symétrique d'un point par rapport à un autre.",
    generer() {
      const lettres = tirerLettres(7).sort();
      const pos = melanger([...Array(11).keys()]).slice(0, 7).sort((a, b) => a - b);
      const nom = x => lettres[pos.indexOf(x)];
      const paires = [];
      for (const c of pos) for (const a of pos) if (a !== c && pos.includes(2 * c - a)) paires.push([a, c]);
      if (!paires.length) return this.generer();
      const [a, c] = choisir(paires);
      const r = svg("svg", { viewBox: "0 0 440 60", width: 440, height: 60, class: "droite" });
      r.append(svg("line", { x1: 10, y1: 40, x2: 430, y2: 40, class: "axe" }));
      for (let k = 0; k <= 10; k++) r.append(svg("line", { x1: 20 + 40 * k, y1: 35, x2: 20 + 40 * k, y2: 45, class: "grad" }));
      pos.forEach((x, n) => {
        const g = svg("g", { class: "pt" }, svg("line", { x1: 20 + 40 * x - 6, y1: 34, x2: 20 + 40 * x + 6, y2: 46 }), svg("line", { x1: 20 + 40 * x - 6, y1: 46, x2: 20 + 40 * x + 6, y2: 34 }), svg("text", { x: 20 + 40 * x, y: 22 }, lettres[n]));
        r.append(g);
      });
      return {
        consigne: `Les points sont placés sur une droite graduée régulièrement. Quel est le symétrique de ${nom(a)} par rapport à ${nom(c)} ?`,
        figure: r,
        choix: lettres,
        verifier: (v, ch) => ({ etat: ch === nom(2 * c - a) ? "juste" : "faux" }),
        indice: `${nom(c)} doit être le milieu du segment : compte les graduations de ${nom(a)} à ${nom(c)}, puis reporte-les de l'autre côté.`,
        correction: `${nom(a)} est à ${Math.abs(c - a)} graduation${Math.abs(c - a) > 1 ? "s" : ""} de ${nom(c)} ; de l'autre côté, on trouve ${nom(2 * c - a)}.`
      };
    }
  },

  {
    groupe: F1,
    id: "vrai-faux",
    titre: "Vrai ou faux ?",
    description: "Les mots de la symétrie centrale.",
    generer() {
      const [t, v, e] = choisir([
        ["Si A′ est le symétrique de A par rapport à O, alors O est le milieu de [AA′].", true, "c'est la définition"],
        ["Si A′ est le symétrique de A par rapport à O, alors A, O et A′ sont alignés.", true, "O est le milieu de [AA′]"],
        ["Si OA = OA′, alors A′ est forcément le symétrique de A par rapport à O.", false, "il faut aussi que A, O et A′ soient alignés"],
        ["Le symétrique du point O par rapport à O est O lui-même.", true, "O est le milieu de [OO]"],
        ["La symétrie centrale retourne la figure comme un pliage.", false, "c'est la symétrie axiale ; la symétrie centrale fait tourner d'un demi-tour"],
        ["Si A′ est le symétrique de A par rapport à O, alors A est le symétrique de A′.", true, "O est aussi le milieu de [A′A]"],
        ["Un demi-tour, c'est un quart de tour.", false, "un demi-tour, c'est 180°"]
      ]);
      return {
        consigne: t,
        choix: ["Vrai", "Faux"],
        verifier: (x, c) => ({ etat: (c === "Vrai") === v ? "juste" : "faux" }),
        indice: "Le symétrique de A par rapport à O est le point A′ tel que O est le milieu de [AA′].",
        correction: `${v ? "Vrai" : "Faux"} : ${e}.`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "placer-point",
    titre: "Placer le symétrique d'un point",
    description: "Sur quadrillage, en cliquant.",
    generer() {
      const C = 12, L = 8, g = quadrillage(C, L, 30);
      const O = [alea(4, 8), alea(3, 5)];
      let A;
      do { A = [alea(0, C), alea(0, L)]; } while (egaux(A, O) || sym(O, A)[0] < 0 || sym(O, A)[0] > C || sym(O, A)[1] < 0 || sym(O, A)[1] > L);
      const S = sym(O, A);
      dessinerPoint(g.svg, g.P(...A), "A", { vers: { x: -0.8, y: -1 } });
      centreO(g, O);
      const pl = placerPoints(g, ["A′"], C, L);
      const di = O[0] - A[0], dj = O[1] - A[1];
      const trajet = `${Math.abs(di)} carreau${Math.abs(di) > 1 ? "x" : ""} vers la ${di >= 0 ? "droite" : "gauche"} et ${Math.abs(dj)} vers le ${dj >= 0 ? "bas" : "haut"}`;
      return {
        consigne: "Place le point A′, symétrique de A par rapport à O, en cliquant sur le quadrillage, puis valide.",
        figure: g.svg,
        verifier() {
          if (!pl.places.length) return { etat: "incomplet", message: "Clique sur un nœud du quadrillage." };
          return egaux(pl.places[0], S) ? { etat: "juste" } : { etat: "faux", message: egaux(pl.places[0], A) ? "Tu as cliqué sur A." : "" };
        },
        indice: "Compte les carreaux pour aller de A jusqu'à O, puis refais le même trajet à partir de O.",
        correction: `Pour aller de A à O : ${trajet}. On refait le même trajet à partir de O : c'est le point vert.`,
        surCorrection() { dessinerPoint(g.svg, g.P(...S), "A′", { vers: { x: 0.8, y: 1 }, classe: "geo-correct" }); },
        bloquer: pl.bloquer
      };
    }
  },

  {
    groupe: F2,
    id: "placer-triangle",
    titre: "Le symétrique d'un triangle",
    description: "Placer les trois sommets images.",
    generer() {
      const C = 14, L = 9, g = quadrillage(C, L, 26);
      const O = [7, alea(4, 5)];
      const T = polygoneHasard(3, 1, 5, 1, 8);
      if (T.some(p => { const s = sym(O, p); return s[0] < 0 || s[0] > C || s[1] < 0 || s[1] > L; })) return this.generer();
      polygone(g, T);
      const noms = ["A", "B", "C"];
      T.forEach((p, k) => dessinerPoint(g.svg, g.P(...p), noms[k], { vers: { x: -0.9, y: -0.6 } }));
      centreO(g, O);
      const pl = placerPoints(g, ["A′", "B′", "C′"], C, L);
      const S = T.map(p => sym(O, p));
      return {
        consigne: "Place les points A′, B′ et C′, symétriques de A, B et C par rapport à O (clique dans l'ordre A′, B′, C′ ; un clic sur un point l'efface).",
        figure: g.svg,
        verifier() {
          if (pl.places.length < 3) return { etat: "incomplet", message: "Place les trois points." };
          const faux = S.filter((s, k) => !egaux(pl.places[k], s)).length;
          return faux ? { etat: "faux", message: faux === 1 ? "Un des points est mal placé." : `${faux} points sont mal placés.` } : { etat: "juste" };
        },
        indice: "Pour chaque sommet, compte le trajet jusqu'à O et refais-le à partir de O.",
        correction: "Le triangle vert est l'image du triangle bleu : il est « tourné » d'un demi-tour autour de O.",
        surCorrection() { polygone(g, S, STYLE_VERT); },
        bloquer: pl.bloquer
      };
    }
  },

  {
    groupe: F2,
    id: "completer-cases",
    titre: "Compléter une figure",
    description: "Colorier des cases pour que O soit centre de symétrie.",
    generer() {
      const C = 10, L = 8, pas = 30, g = quadrillage(C, L, pas);
      const cle = (i, j) => i + "," + j;
      const symC = (i, j) => [C - 1 - i, L - 1 - j];
      const gauche = (i, j) => i < C / 2;
      const donnee = new Map();
      const d0 = [alea(1, 3), alea(2, 5)];
      donnee.set(cle(...d0), d0);
      const n = alea(6, 9);
      while (donnee.size < n) {
        const [i, j] = choisir([...donnee.values()]);
        const [di, dj] = choisir([[1, 0], [-1, 0], [0, 1], [0, -1]]);
        const c = [i + di, j + dj];
        if (c[0] >= 0 && c[1] >= 0 && c[1] < L && gauche(...c)) donnee.set(cle(...c), c);
      }
      const attendu = new Set([...donnee.values()].map(c => cle(...symC(...c))));
      const eleve = new Set(), rects = {};
      const cases = svg("g");
      for (let i = 0; i < C; i++) for (let j = 0; j < L; j++) {
        const p = g.P(i, j);
        rects[cle(i, j)] = svg("rect", { x: p.x, y: p.y, width: pas, height: pas, class: "case-quad" + (donnee.has(cle(i, j)) ? " donnee" : "") });
        cases.append(rects[cle(i, j)]);
      }
      g.svg.insertBefore(cases, g.fond);
      centreO(g, [C / 2, L / 2]);
      g.svg.classList.add("geo-clic");
      let actif = true;
      g.svg.addEventListener("pointerdown", e => {
        if (!actif) return;
        const { i, j } = g.position(e);
        const ci = Math.floor(i), cj = Math.floor(j);
        if (ci < 0 || cj < 0 || ci >= C || cj >= L || gauche(ci, cj)) return;
        const k = cle(ci, cj);
        if (eleve.has(k)) eleve.delete(k); else eleve.add(k);
        rects[k].classList.toggle("eleve", eleve.has(k));
      });
      return {
        consigne: "Colorie des cases (à droite) pour que le point O soit un centre de symétrie de la figure. Clique sur une case pour la colorier ou l'effacer.",
        figure: g.svg,
        verifier() {
          if (!eleve.size) return { etat: "incomplet", message: "Clique sur les cases à colorier." };
          const manque = [...attendu].filter(k => !eleve.has(k)).length, trop = [...eleve].filter(k => !attendu.has(k)).length;
          if (!manque && !trop) return { etat: "juste" };
          return { etat: "faux", message: [manque ? `il manque ${manque} case${manque > 1 ? "s" : ""}` : "", trop ? `${trop} case${trop > 1 ? "s sont" : " est"} en trop` : ""].filter(Boolean).join(" et ").replace(/^./, m => m.toUpperCase()) + "." };
        },
        indice: "Chaque case coloriée a son image de l'autre côté de O : même trajet, mais dans l'autre sens (en haut ↔ en bas, à gauche ↔ à droite).",
        correction: "En vert : les cases qu'il fallait colorier en plus ; en rouge : les cases en trop.",
        surCorrection() {
          for (const k of attendu) if (!eleve.has(k)) rects[k].classList.add("manque");
          for (const k of eleve) if (!attendu.has(k)) rects[k].classList.add("trop");
        },
        bloquer() { actif = false; }
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "trouver-centre",
    titre: "Retrouver le centre",
    description: "A′ est le symétrique de A : où est O ?",
    generer() {
      const C = 12, L = 8, g = quadrillage(C, L, 30);
      let A, B;
      do { A = [alea(0, C), alea(0, L)]; B = [alea(0, C), alea(0, L)]; } while ((A[0] + B[0]) % 2 || (A[1] + B[1]) % 2 || Math.abs(A[0] - B[0]) + Math.abs(A[1] - B[1]) < 4);
      const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      dessinerPoint(g.svg, g.P(...A), "A", { vers: { x: -0.8, y: -1 } });
      dessinerPoint(g.svg, g.P(...B), "A′", { vers: { x: 0.8, y: -1 } });
      const pl = placerPoints(g, ["O"], C, L);
      return {
        consigne: "A′ est le symétrique de A par rapport à un point O. Place le point O.",
        figure: g.svg,
        verifier() {
          if (!pl.places.length) return { etat: "incomplet", message: "Clique sur un nœud du quadrillage." };
          return egaux(pl.places[0], M) ? { etat: "juste" } : { etat: "faux" };
        },
        indice: "Le centre O est le milieu du segment [AA′].",
        correction: "O est le milieu de [AA′] : c'est le point vert.",
        surCorrection() { dessinerTrait(g.svg, g.P(...A), g.P(...B), "segment", "geo-trait"); dessinerPoint(g.svg, g.P(...M), "O", { vers: { x: 0.8, y: 1 }, classe: "geo-correct" }); },
        bloquer: pl.bloquer
      };
    }
  },

  {
    groupe: F3,
    id: "distance",
    titre: "Calculer une longueur",
    description: "OA = OA′ et AA′ = 2 × OA.",
    generer() {
      const x = alea(12, 75) / 10;
      const [q, r, e] = choisir([
        [`A′ est le symétrique de A par rapport à O, et OA = ${nb(x)} cm. Quelle est la longueur AA′ ?`, 2 * x, `O est le milieu de [AA′] : AA′ = 2 × ${nb(x)} = ${nb(2 * x)} cm.`],
        [`A′ est le symétrique de A par rapport à O, et AA′ = ${nb(2 * x)} cm. Quelle est la longueur OA′ ?`, x, `O est le milieu de [AA′] : OA′ = ${nb(2 * x)} ÷ 2 = ${nb(x)} cm.`],
        [`A′ est le symétrique de A par rapport à O, et OA = ${nb(x)} cm. Quelle est la longueur OA′ ?`, x, `O est le milieu de [AA′] : OA′ = OA = ${nb(x)} cm.`]
      ]);
      return {
        consigne: q,
        ligne: "[d] cm",
        verifier: v => verifierNombre(v[0], Math.round(r * 100) / 100),
        indice: "O est le milieu du segment [AA′].",
        correction: e
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "conservation",
    titre: "Ce que conserve un demi-tour",
    description: "Longueurs, angles, aires de l'image.",
    generer() {
      const l = alea(25, 90) / 10, a = alea(25, 130), ai = alea(6, 40);
      const [q, r, u, e] = choisir([
        [`Les triangles ABC et A′B′C′ sont symétriques par rapport à O. AB = ${nb(l)} cm. Quelle est la longueur A′B′ ?`, l, "cm", "longueurs"],
        [`Les triangles ABC et A′B′C′ sont symétriques par rapport à O. L'angle ABC mesure ${a}°. Combien mesure l'angle A′B′C′ ?`, a, "°", "angles"],
        [`Une figure a une aire de ${ai} cm². Quelle est l'aire de son symétrique par rapport à un point O ?`, ai, "cm²", "aires"],
        [`Un cercle a un rayon de ${nb(l)} cm. Quel est le rayon de son symétrique par rapport à un point O ?`, l, "cm", "longueurs (le rayon)"],
        [`Le quadrilatère ABCD a un périmètre de ${nb(4 * l)} cm. Quel est le périmètre de son symétrique par rapport à O ?`, 4 * l, "cm", "longueurs, donc les périmètres"]
      ]);
      return {
        consigne: q,
        ligne: `[d] ${u}`,
        verifier: v => verifierNombre(v[0], Math.round(r * 100) / 100),
        indice: "Une figure et son symétrique se superposent par un demi-tour.",
        correction: `La symétrie centrale conserve les ${e} : la réponse est ${nb(r)} ${u}.`
      };
    }
  },

  {
    groupe: F4,
    id: "images",
    titre: "Images de figures usuelles",
    description: "Droite, segment, cercle…",
    generer() {
      const [q, bonne, autres] = choisir([
        ["Le symétrique d'une droite (d) par rapport à un point O est…", "une droite parallèle à (d)", ["une droite perpendiculaire à (d)", "un segment"]],
        ["Le symétrique d'un segment [AB] par rapport à un point O est…", "un segment parallèle de même longueur", ["un segment perpendiculaire de même longueur", "un segment deux fois plus long"]],
        ["Le symétrique d'un cercle de centre K par rapport à O est…", "un cercle de même rayon, de centre K′", ["un cercle de centre K deux fois plus grand", "un cercle de même rayon, de centre O"]],
        ["Si A, B et C sont alignés, leurs symétriques A′, B′ et C′ par rapport à O sont…", "alignés", ["sur un cercle de centre O", "les sommets d'un triangle"]],
        ["Si M est le milieu de [AB], alors son symétrique M′ est…", "le milieu de [A′B′]", ["le point O", "le milieu de [AA′]"]]
      ]);
      return {
        consigne: q,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "La symétrie centrale conserve l'alignement, les longueurs et les milieux, et transforme une droite en droite parallèle.",
        correction: `${q.replace("…", "")} ${bonne}.`
      };
    }
  },

  {
    groupe: F4,
    id: "demontrer",
    titre: "Démontrer avec la symétrie",
    description: "Choisir la bonne justification.",
    generer() {
      const [q, bonne, autres] = choisir([
        ["O est le milieu de [AC] et de [BD]. Pourquoi AB = CD ?", "Car [CD] est le symétrique de [AB] par rapport à O, et la symétrie centrale conserve les longueurs.", ["Car on le mesure sur la figure.", "Car les droites (AB) et (CD) sont parallèles."]],
        ["O est le milieu de [AC] et de [BD]. Pourquoi (AB) // (CD) ?", "Car (CD) est le symétrique de (AB) par rapport à O, et le symétrique d'une droite est une droite parallèle.", ["Car AB = CD.", "Car ça se voit sur la figure."]],
        ["A′B′C′ est le symétrique de ABC par rapport à O. Pourquoi les deux triangles ont-ils la même aire ?", "Car la symétrie centrale conserve les aires.", ["Car ils ont un sommet commun.", "Car O est le milieu de [AB]."]]
      ]);
      return {
        consigne: q,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "En géométrie, on ne justifie pas par une mesure ou un dessin : on cite une propriété.",
        correction: bonne
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "lettres",
    titre: "Lettres et centre de symétrie",
    description: "La lettre reste-t-elle la même après un demi-tour ?",
    generer() {
      const [l, oui] = choisir([["H", true], ["N", true], ["O", true], ["S", true], ["X", true], ["Z", true], ["I", true], ["A", false], ["E", false], ["T", false], ["M", false], ["K", false], ["B", false], ["F", false], ["L", false], ["W", false]]);
      return {
        consigne: `La lettre <span style="font-size:2.4em;font-weight:700;color:var(--cours)">${l}</span> a-t-elle un centre de symétrie ?`,
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === oui ? "juste" : "faux" }),
        indice: "Retourne ta feuille d'un demi-tour (la tête en bas) : la lettre est-elle la même ?",
        correction: oui ? `Oui : après un demi-tour autour de son centre, la lettre ${l} reste identique.` : `Non : après un demi-tour, la lettre ${l} n'est plus la même (elle est « à l'envers »).`
      };
    }
  },

  {
    groupe: F5,
    id: "figures",
    titre: "Figures usuelles",
    description: "Ont-elles un centre de symétrie ?",
    generer() {
      const [f, oui, e] = choisir([
        ["un carré", true, "le point d'intersection des diagonales"], ["un rectangle", true, "le point d'intersection des diagonales"],
        ["un losange", true, "le point d'intersection des diagonales"], ["un parallélogramme", true, "le point d'intersection des diagonales"],
        ["un cercle", true, "son centre"], ["un segment", true, "son milieu"], ["un hexagone régulier", true, "son centre"],
        ["un triangle équilatéral", false, ""], ["un triangle isocèle", false, ""], ["un pentagone régulier", false, ""],
        ["un trapèze (non parallélogramme)", false, ""], ["un cerf-volant", false, ""]
      ]);
      return {
        consigne: `Est-ce que ${f} a un centre de symétrie ?`,
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === oui ? "juste" : "faux" }),
        indice: "Dessine la figure et fais-la tourner d'un demi-tour dans ta tête.",
        correction: oui ? `Oui : c'est ${e}.` : `Non : aucun demi-tour ne la laisse inchangée.`
      };
    }
  },

  {
    groupe: F5,
    id: "rosaces",
    titre: "Rosaces",
    description: "Combien de lobes pour un centre de symétrie ?",
    generer() {
      const n = alea(3, 8);
      return {
        consigne: `Cette rosace a ${n} lobes. A-t-elle un centre de symétrie ?`,
        figure: rosace(n),
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === (n % 2 === 0) ? "juste" : "faux" }),
        indice: "Après un demi-tour, chaque lobe doit tomber sur un autre lobe.",
        correction: n % 2 === 0 ? `Oui : avec ${n} lobes (nombre pair), chaque lobe a un lobe « opposé » : le centre de la rosace est centre de symétrie.` : `Non : avec ${n} lobes (nombre impair), un lobe vers le haut donnerait un lobe vers le bas, qui n'existe pas.`
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
    { competence: "Reconnaître une symétrie centrale", activites: ["reconnaitre"] },
    { competence: "Le symétrique d'un point (définition)", activites: ["vrai-faux", "droite-graduee"] },
    { competence: "Placer le symétrique d'un point", activites: ["placer-point"] },
    { competence: "Construire le symétrique d'une figure", activites: ["placer-triangle", "completer-cases"] },
    { competence: "Retrouver le centre de symétrie", activites: ["trouver-centre"] },
    { competence: "Calculer une longueur", activites: ["distance"] },
    { competence: "Ce que conserve la symétrie centrale", activites: ["conservation"] },
    { competence: "Images de droites, segments, cercles", activites: ["images"] },
    { competence: "Justifier avec une propriété", activites: ["demontrer"] },
    { competence: "Centre de symétrie d'une figure", activites: ["lettres", "figures", "rosaces"] }
  ]
};
