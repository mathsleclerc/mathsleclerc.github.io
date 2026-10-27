/* =====================================================================
   EXERCISEUR « REPÉRAGE DANS L'ESPACE ET SUR LA SPHÈRE » — 3e, chapitre 17

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   Le globe est dessiné en perspective (même projection que les fiches).
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Se repérer dans un pavé droit";
const F2 = "Feuille 2 — Repérage dans l'espace : problèmes";
const F3 = "Feuille 3 — La sphère terrestre";
const F4 = "Feuille 4 — Latitude et longitude";
const F5 = "Feuille 5 — Calculer sur la sphère terrestre";
const F6 = "Feuille 6 — Problèmes type brevet";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const triple = p => `(${p.map(nb).join(" ; ")})`;
const verifierTriple = (v, p) => {
  const x = v.map(lireNombre);
  if (x.some(isNaN)) return { etat: "incomplet", message: "Remplis les trois coordonnées." };
  return x.every((a, i) => a === p[i]) ? { etat: "juste" } : { etat: "faux" };
};
const latTxt = p => p === 0 ? "0°" : `${Math.abs(p)}° ${p > 0 ? "N" : "S"}`;
const lonTxt = l => l === 0 ? "0°" : `${Math.abs(l)}° ${l > 0 ? "E" : "O"}`;
const geo = (p, l) => `(${latTxt(p)} ; ${lonTxt(l)})`;

/* ---------- Globe en perspective (longitude face à l'œil : 25°, élévation 20°) ---------- */
const RAD = Math.PI / 180, LZ = 25, EL = 20;
const proj = (p, l, R) => [R * Math.cos(p * RAD) * Math.sin((l - LZ) * RAD), -R * (Math.sin(p * RAD) * Math.cos(EL * RAD) - Math.cos(p * RAD) * Math.cos((l - LZ) * RAD) * Math.sin(EL * RAD))];
const visible = (p, l) => Math.cos(p * RAD) * Math.cos((l - LZ) * RAD) * Math.cos(EL * RAD) + Math.sin(p * RAD) * Math.sin(EL * RAD) > 0.02;
function globe(points) {
  const R = 140, C = 160, s = figureGeo(2 * C, 2 * C, "Globe terrestre");
  const P = (p, l) => { const [x, y] = proj(p, l, R); return [C + x, C + y]; };
  s.append(svg("circle", { cx: C, cy: C, r: R, style: "fill:#f3f6fa;stroke:var(--cours);stroke-width:2" }));
  const courbe = (pts, style) => {
    let seg = [];
    const fin = () => { if (seg.length > 1) s.append(svg("polyline", { points: seg.map(q => q.join(",")).join(" "), style: "fill:none;" + style })); seg = []; };
    pts.forEach(([p, l]) => { if (visible(p, l)) seg.push(P(p, l)); else fin(); }); fin();
  };
  const pas = []; for (let k = -180; k <= 180; k += 3) pas.push(k);
  [-60, -30, 30, 60].forEach(p => courbe(pas.map(l => [p, l]), "stroke:#aab;stroke-width:1"));
  courbe(pas.map(l => [0, l]), "stroke:#d62828;stroke-width:2");
  [-60, -30, 30, 60, 90].forEach(l => courbe(pas.filter(p => p >= -90 && p <= 90).map(p => [p, l]), "stroke:#aab;stroke-width:1"));
  courbe(pas.filter(p => p >= -90 && p <= 90).map(p => [p, 0]), "stroke:#e07a5f;stroke-width:2");
  const etiq = (p, l, t) => { const [x, y] = P(p, l); s.append(svg("text", { x, y, style: "font-size:10px;text-anchor:middle;paint-order:stroke;stroke:#fff;stroke-width:3px" }, t)); };
  [[-60, "60° O"], [-30, "30° O"], [0, "0°"], [30, "30° E"], [60, "60° E"], [90, "90° E"]].forEach(([l, t]) => etiq(-9, l, t));
  [[30, "30° N"], [60, "60° N"]].forEach(([p, t]) => etiq(p, -45, t));
  [[-30, "30° S"], [-60, "60° S"]].forEach(([p, t]) => etiq(p, 15, t));
  points.forEach(([p, l, nom]) => { const [x, y] = P(p, l); s.append(svg("circle", { cx: x, cy: y, r: 5, style: "fill:#2a9d8f;stroke:#fff;stroke-width:1.5" })); s.append(svg("text", { x: x + 8, y: y - 6, style: "font-size:15px;font-weight:700;paint-order:stroke;stroke:#fff;stroke-width:3px" }, nom)); });
  return s;
}
const POINTS_VISIBLES = [];
[-60, -30, 0, 30, 60].forEach(p => [-60, -30, 0, 30, 60, 90].forEach(l => { if (visible(p, l) && proj(p, l, 1)[0] ** 2 + proj(p, l, 1)[1] ** 2 < 0.8) POINTS_VISIBLES.push([p, l]); }));

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "sommets",
    titre: "Coordonnées d'un sommet",
    description: "Pavé d'origine O.",
    generer() {
      const a = alea(2, 9), b = alea(2, 7), c = alea(2, 6);
      const [txt, p] = choisir([
        ["du sommet opposé à O", [a, b, c]], ["du sommet situé à la verticale de O, sur le « plafond »", [0, 0, c]],
        ["du sommet du sol situé sur l'axe des abscisses (autre que O)", [a, 0, 0]], ["du sommet du sol opposé à O", [a, b, 0]],
        ["du sommet du plafond situé au-dessus du point (0 ; b ; 0)", [0, b, c]]
      ].map(([t, q]) => [t.replace("b ;", `${b} ;`), q]));
      return { consigne: `Un pavé droit a pour dimensions ${a} (longueur, axe des abscisses), ${b} (profondeur, axe des ordonnées) et ${c} (hauteur, axe des altitudes). L'origine O est un de ses sommets. Quelles sont les coordonnées ${txt} ?`, ligne: "( [r] ; [r] ; [r] )", verifier: v => verifierTriple(v, p), indice: "Pour chaque axe, le sommet est soit à 0, soit à la dimension du pavé.", correction: `${triple(p)}` };
    }
  },

  {
    groupe: F1,
    id: "milieux",
    titre: "Milieux et centres",
    description: "Moitié des dimensions.",
    generer() {
      const a = 2 * alea(1, 5), b = 2 * alea(1, 4), c = 2 * alea(1, 3);
      const [txt, p] = choisir([["du centre du pavé", [a / 2, b / 2, c / 2]], ["du centre de la face du plafond", [a / 2, b / 2, c]], ["du centre de la face du sol", [a / 2, b / 2, 0]], ["du milieu de l'arête verticale issue de O", [0, 0, c / 2]], ["du milieu de l'arête qui joint O au point (" + a + " ; 0 ; 0)", [a / 2, 0, 0]]]);
      return { consigne: `Un pavé droit de dimensions ${a}, ${b} et ${c} a un sommet en O (0 ; 0 ; 0) et le sommet opposé en (${a} ; ${b} ; ${c}). Quelles sont les coordonnées ${txt} ?`, ligne: "( [r] ; [r] ; [r] )", verifier: v => verifierTriple(v, p), indice: "Le milieu est « à mi-chemin » : on prend la moitié de la dimension sur l'axe concerné.", correction: triple(p) };
    }
  },

  {
    groupe: F1,
    id: "face",
    titre: "Sur quelle face ?",
    description: "Une coordonnée fixe.",
    generer() {
      const a = alea(4, 8), b = alea(3, 6), c = alea(2, 5);
      const cas = choisir([["le sol", [alea(1, a - 1), alea(1, b - 1), 0]], ["le plafond", [alea(1, a - 1), alea(1, b - 1), c]], ["à l'intérieur", [alea(1, a - 1), alea(1, b - 1), alea(1, c - 1)]], ["à l'extérieur", [alea(1, a - 1), b + alea(1, 3), alea(1, c - 1)]]]);
      return { consigne: `Un pavé a pour sommets O (0 ; 0 ; 0) et (${a} ; ${b} ; ${c}). Où se trouve le point ${triple(cas[1])} ?`, choix: ["le sol", "le plafond", "à l'intérieur", "à l'extérieur"], verifier: choixVerif(cas[0]), indice: `À l'intérieur : 0 < x < ${a}, 0 < y < ${b} et 0 < z < ${c}. Sur le sol : altitude 0.`, correction: `${cas[0] === "le sol" ? "Altitude 0 : il est sur le sol." : cas[0] === "le plafond" ? `Altitude ${c} : il est sur le plafond.` : cas[0] === "à l'intérieur" ? "Les trois coordonnées sont strictement entre 0 et les dimensions." : `Son ordonnée dépasse ${b} : il est à l'extérieur.`}` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "robot",
    titre: "Déplacer un robot",
    description: "Ajouter les déplacements.",
    generer() {
      const d = [alea(-3, 5), alea(-2, 4), alea(-2, 3)], dep = [alea(0, 4), alea(0, 3), alea(0, 3)], arr = dep.map((x, i) => x + d[i]);
      if (arr.some(x => x < 0)) return this.generer();
      const mots = (n, axe) => n === 0 ? "" : `${Math.abs(n)} selon ${axe} ${n > 0 ? "en avant" : "en arrière"}`;
      const txt = [mots(d[0], "l'abscisse"), mots(d[1], "l'ordonnée"), d[2] === 0 ? "" : `${d[2] > 0 ? "monte" : "descend"} de ${Math.abs(d[2])}`].filter(Boolean).join(", ");
      return { consigne: `Un robot est en ${triple(dep)}. Il se déplace de ${txt}. Quelles sont ses nouvelles coordonnées ?`, ligne: "( [r] ; [r] ; [r] )", verifier: v => verifierTriple(v, arr), indice: "Ajoute (ou retire) chaque déplacement à la coordonnée correspondante.", correction: triple(arr) };
    }
  },

  {
    groupe: F2,
    id: "trajet",
    titre: "Plus court trajet le long des arêtes",
    description: "Somme des écarts.",
    generer() {
      const A = [alea(0, 6), alea(0, 4), alea(0, 3)], B = [alea(0, 6), alea(0, 4), alea(0, 3)], n = A.reduce((s, x, i) => s + Math.abs(x - B[i]), 0);
      if (n === 0) return this.generer();
      return { consigne: `Dans un casier, un robot ne se déplace que d'une case à la fois, parallèlement à un axe. Combien de déplacements au minimum pour aller de ${triple(A)} à ${triple(B)} ?`, ligne: "[n] déplacements", verifier: v => verifierNombre(v[0], n), indice: "Calcule l'écart sur chaque axe, puis ajoute.", correction: `${A.map((x, i) => Math.abs(x - B[i])).join(" + ")} = ${n}` };
    }
  },

  {
    groupe: F2,
    id: "distance",
    titre: "Distance dans un pavé",
    description: "Pythagore deux fois.",
    generer() {
      const [a, b, c, d] = choisir([[3, 4, 12, 13], [6, 8, 24, 26], [2, 3, 6, 7], [1, 2, 2, 3], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11]]);
      return { consigne: `Quelle est la distance entre O (0 ; 0 ; 0) et le point (${a} ; ${b} ; ${c}) ? (unité : m)`, ligne: "[d] m", verifier: v => verifierNombre(v[0], d), indice: "Calcule d'abord la diagonale du sol avec Pythagore, puis utilise la hauteur.", correction: `Sol : ${a}² + ${b}² = ${a * a + b * b} ; puis ${a * a + b * b} + ${c}² = ${d * d} = ${d}² : distance ${d} m.` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "vocabulaire",
    titre: "Vocabulaire du globe",
    description: "Équateur, parallèles, méridiens.",
    generer() {
      const [q, r, f] = choisir([
        ["Comment s'appelle le grand cercle perpendiculaire à l'axe des pôles ?", "l'équateur", ["un méridien", "le méridien de Greenwich"]],
        ["Comment s'appellent les demi-cercles qui joignent les deux pôles ?", "les méridiens", ["les parallèles", "les tropiques"]],
        ["Comment s'appellent les cercles parallèles à l'équateur ?", "les parallèles", ["les méridiens", "les grands cercles"]],
        ["Quel méridien sert de référence pour les longitudes ?", "le méridien de Greenwich", ["l'équateur", "le méridien de Paris"]],
        ["Quel est le plus long des parallèles ?", "l'équateur", ["le cercle polaire", "le tropique du Cancer"]],
        ["Tous les points d'un même méridien ont la même…", "longitude", ["latitude", "altitude"]],
        ["Tous les points d'un même parallèle ont la même…", "latitude", ["longitude", "distance au pôle Est"]]
      ]);
      return { consigne: q, choix: melanger([r, ...f]), verifier: choixVerif(r), indice: "Parallèles : cercles « horizontaux ». Méridiens : demi-cercles d'un pôle à l'autre.", correction: `Réponse : ${r}.` };
    }
  },

  {
    groupe: F3,
    id: "hemisphere",
    titre: "Dans quel hémisphère ?",
    description: "N/S et E/O.",
    generer() {
      const p = choisir([-1, 1]) * alea(5, 80), l = choisir([-1, 1]) * alea(5, 175), axe = choisir(["NS", "EO"]);
      const r = axe === "NS" ? (p > 0 ? "Nord" : "Sud") : (l > 0 ? "Est" : "Ouest");
      return { consigne: `Un lieu a pour coordonnées ${geo(p, l)}. Dans quel hémisphère ${axe === "NS" ? "(Nord ou Sud)" : "(Est ou Ouest)"} est-il ?`, choix: axe === "NS" ? ["Nord", "Sud"] : ["Est", "Ouest"], verifier: choixVerif(r), indice: axe === "NS" ? "C'est la latitude (écrite en premier) qui indique Nord ou Sud." : "C'est la longitude (écrite en second) qui indique Est ou Ouest.", correction: `Hémisphère ${r}.` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "lire-globe",
    titre: "Lire des coordonnées",
    description: "Sur un globe quadrillé.",
    generer() {
      const [p, l] = choisir(POINTS_VISIBLES), bonne = geo(p, l);
      const leurres = new Set([geo(-p || 30, l), geo(p, -l || 30), geo(l <= 60 && l >= -60 ? l : 30, p), geo(p, l + (l < 90 ? 30 : -30))]);
      leurres.delete(bonne);
      return { consigne: "Quelles sont les coordonnées géographiques du point M ? (parallèles et méridiens tous les 30°)", figure: globe([[p, l, "M"]]), choix: melanger([bonne, ...[...leurres].slice(0, 3)]), verifier: choixVerif(bonne), indice: "Latitude : sur quel parallèle est M (Nord ou Sud de l'équateur rouge) ? Longitude : sur quel méridien (Est ou Ouest de Greenwich, en orange) ?", correction: `M ${bonne}.` };
    }
  },

  {
    groupe: F4,
    id: "meme-ligne",
    titre: "Même parallèle ou même méridien ?",
    description: "Comparer des coordonnées.",
    generer() {
      const p = choisir([-1, 1]) * alea(10, 70), l = choisir([-1, 1]) * alea(10, 150), cas = choisir(["parallele", "meridien", "aucun"]);
      const q = cas === "parallele" ? [p, -l] : cas === "meridien" ? [-p, l] : [-p, -l];
      const r = { parallele: "même parallèle", meridien: "même méridien", aucun: "ni l'un ni l'autre" }[cas];
      return { consigne: `Les lieux A ${geo(p, l)} et B ${geo(...q)} sont-ils sur le même parallèle, sur le même méridien, ou ni l'un ni l'autre ?`, choix: ["même parallèle", "même méridien", "ni l'un ni l'autre"], verifier: choixVerif(r), indice: "Même parallèle : même latitude (N/S compris). Même méridien : même longitude (E/O compris).", correction: `${r[0].toUpperCase() + r.slice(1)} : ${cas === "parallele" ? "les latitudes sont égales" : cas === "meridien" ? "les longitudes sont égales" : "latitudes et longitudes sont différentes (attention à N/S et E/O)"}.` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "arc-meridien",
    titre: "Distance sur un méridien",
    description: "Proportionnelle à l'écart.",
    generer() {
      const e = choisir([9, 18, 36, 45, 72, 90, 27, 54]), memeH = Math.random() < 0.5;
      const p1 = memeH ? alea(e + 1, 85) : alea(1, e - 1), p2 = memeH ? p1 - e : -(e - p1);
      const d = e / 360 * 40000;
      return { consigne: `Deux villes sont sur le même méridien, aux latitudes ${latTxt(p1)} et ${latTxt(p2)}. En prenant 40 000 km pour la longueur d'un grand cercle, quelle distance les sépare le long du méridien ?`, ligne: "[d] km", verifier: v => verifierNombre(v[0], d), indice: memeH ? "Même hémisphère : on soustrait les latitudes." : "Hémisphères différents : on additionne les latitudes.", correction: `Écart : ${e}° ; ${e}/360 × 40 000 = ${nb(d)} km.` };
    }
  },

  {
    groupe: F5,
    id: "fuseaux",
    titre: "Heure solaire",
    description: "15° par heure.",
    generer() {
      const h = alea(8, 16), dl = choisir([-1, 1]) * 15 * alea(1, 6), r = ((h + dl / 15) % 24 + 24) % 24;
      return { consigne: `Il est ${h} h (heure solaire) sur le méridien de Greenwich. Quelle heure solaire est-il au même instant sur le méridien ${lonTxt(dl)} ?`, ligne: "[n] h", verifier: v => verifierNombre(v[0], r), indice: "La Terre tourne de 15° par heure, vers l'Est : à l'Est, il est plus tard.", correction: `${Math.abs(dl)}° = ${Math.abs(dl / 15)} h ${dl > 0 ? "de plus" : "de moins"} : ${r} h.` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "equateur",
    titre: "Voyage sur l'équateur",
    description: "Écart de longitude.",
    generer() {
      const l1 = -alea(1, 9) * 10, l2 = alea(1, 9) * 10, e = l2 - l1, d = rr(e / 360 * 40000);
      return { consigne: `Un navire suit l'équateur de la longitude ${lonTxt(l1)} à la longitude ${lonTxt(l2)} (vers l'Est). Quelle distance parcourt-il (au km près) ? On prend 40 000 km pour l'équateur.`, ligne: "[d] km", verifier: v => verifierNombre(v[0], Math.round(d)), indice: "Ouest et Est : on additionne les longitudes pour obtenir l'écart.", correction: `Écart : ${-l1} + ${l2} = ${e}° ; ${e}/360 × 40 000 ≈ ${Math.round(d)} km.` };
    }
  },

  {
    groupe: F6,
    id: "parallele",
    titre: "Rayon d'un parallèle",
    description: "r = R × cos(latitude).",
    generer() {
      const p = choisir([30, 45, 50, 60, 40, 20]), r = Math.round(6370 * Math.cos(p * RAD));
      return { consigne: `La Terre a un rayon de 6 370 km. Quel est le rayon du parallèle de latitude ${p}° N (au km près) ?`, ligne: "[d] km", verifier: v => verifierNombre(v[0], r), indice: "Dans le triangle rectangle formé par le centre de la Terre, le centre du parallèle et un point du parallèle : r = R × cos(latitude).", correction: `6 370 × cos ${p}° ≈ ${r} km.` };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Coordonnées d'un sommet", activites: ["sommets"] },
    { competence: "Milieux et centres", activites: ["milieux"] },
    { competence: "Situer un point dans un pavé", activites: ["face"] },
    { competence: "Se déplacer dans l'espace", activites: ["robot", "trajet"] },
    { competence: "Distance dans un pavé", activites: ["distance"] },
    { competence: "Vocabulaire du globe", activites: ["vocabulaire"] },
    { competence: "Hémisphères", activites: ["hemisphere"] },
    { competence: "Lire latitude et longitude", activites: ["lire-globe"] },
    { competence: "Même parallèle, même méridien", activites: ["meme-ligne"] },
    { competence: "Distance sur un méridien", activites: ["arc-meridien"] },
    { competence: "Heure solaire", activites: ["fuseaux"] },
    { competence: "Problème sur la sphère", activites: ["equateur", "parallele"] }
  ]
};
