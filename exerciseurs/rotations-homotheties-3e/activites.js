/* =====================================================================
   EXERCISEUR « ROTATIONS ET HOMOTHÉTIES » — 3e, chapitre 16

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   Certaines activités reprennent l'exerciseur de 4e (transformations).
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Reconnaître une transformation";
const F2 = "Feuille 2 — La rotation";
const F3 = "Feuille 3 — Construire l'image par une homothétie";
const F4 = "Feuille 4 — Le rapport d'une homothétie";
const F5 = "Feuille 5 — Propriétés de l'homothétie";
const F6 = "Feuille 6 — Problèmes type brevet";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const coords = (p) => `(${nb(p[0])} ; ${nb(p[1])})`;
const verifierPoint = (v, p) => { const x = lireNombre(v[0]), y = lireNombre(v[1]); if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux coordonnées." }; return x === p[0] && y === p[1] ? { etat: "juste" } : x === p[1] && y === p[0] ? { etat: "faux", message: "Tu as inversé l'abscisse et l'ordonnée." } : { etat: "faux" }; };

/* Quadrillage avec un motif (liste de points) et éventuellement son image */
function grille(L, H, motifs) {
  const pas = 24, m = 12, s = figureGeo(L * pas + 2 * m, H * pas + 2 * m, "Quadrillage");
  const P = (x, y) => `${m + x * pas},${m + (H - y) * pas}`;
  for (let i = 0; i <= L; i++) s.append(svg("line", { x1: m + i * pas, y1: m, x2: m + i * pas, y2: m + H * pas, style: "stroke:var(--bord);stroke-width:1" }));
  for (let j = 0; j <= H; j++) s.append(svg("line", { x1: m, y1: m + j * pas, x2: m + L * pas, y2: m + j * pas, style: "stroke:var(--bord);stroke-width:1" }));
  motifs.forEach(({ pts, coul, nom }) => {
    s.append(svg("polygon", { points: pts.map(p => P(...p)).join(" "), style: `fill:${coul};fill-opacity:.35;stroke:${coul};stroke-width:2` }));
    if (nom) { const c = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]); s.append(svg("text", { x: m + c[0] * pas, y: m + (H - c[1]) * pas + 5, style: "font-size:14px;font-weight:700;text-anchor:middle" }, nom)); }
  });
  return s;
}
const MOTIF = [[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]];
const tr = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
const symV = (pts, a) => pts.map(([x, y]) => [2 * a - x, y]);
const rot = (pts, [cx, cy], q) => pts.map(([x, y]) => { let u = x - cx, v = y - cy; for (let k = 0; k < (q + 4) % 4; k++) [u, v] = [-v, u]; return [cx + u, cy + v]; });

const hom = (pts, [cx, cy], k) => pts.map(([x, y]) => [cx + k * (x - cx), cy + k * (y - cy)]);
const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
const signe = k => (k < 0 ? "−" : "") + nb(Math.abs(k));

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "reconnaitre",
    titre: "Quelle transformation ?",
    description: "Symétries, translation, rotation, homothétie.",
    generer() {
      const base = tr(MOTIF, 2, 1), t = choisir(["translation", "symétrie axiale", "symétrie centrale", "rotation", "homothétie"]);
      const img = t === "translation" ? tr(base, alea(6, 8), choisir([-1, 0, 1])) : t === "symétrie axiale" ? symV(base, 7) : t === "symétrie centrale" ? rot(base, [7, 4], 2) : t === "rotation" ? rot(base, [7, 4], choisir([1, -1])) : hom(base, [16, 0], 0.5);
      return { consigne: "Quelle transformation permet de passer du motif bleu au motif orange ?", figure: grille(16, 8, [{ pts: base, coul: "var(--cours)" }, { pts: img, coul: "var(--exercices)" }]), choix: ["translation", "symétrie axiale", "symétrie centrale", "rotation", "homothétie"], verifier: choixVerif(t), indice: "Le motif a-t-il changé de taille (homothétie) ? est-il retourné (symétrie axiale) ? a-t-il tourné d'un demi-tour, d'un quart de tour ? a-t-il seulement glissé ?", correction: `C'est une ${t}${t === "rotation" ? " (d'un quart de tour)" : t === "homothétie" ? " (une réduction : les longueurs sont divisées par 2)" : ""}.` };
    }
  },

  {
    groupe: F1,
    id: "conserve",
    titre: "Ce qui est conservé",
    description: "Longueurs, angles, aires…",
    generer() {
      const [q, r, c] = choisir([
        ["Une rotation conserve-t-elle les longueurs ?", "Oui", "Les translations, rotations et symétries conservent les longueurs."],
        ["Une homothétie de rapport 3 conserve-t-elle les longueurs ?", "Non", "Les longueurs sont multipliées par 3."],
        ["Une homothétie de rapport −2 conserve-t-elle les angles ?", "Oui", "Une homothétie conserve toujours les angles."],
        ["Par une homothétie, l'image d'une droite est-elle parallèle à cette droite ?", "Oui", "Une homothétie conserve le parallélisme : l'image d'une droite lui est parallèle."],
        ["Par une rotation de 90°, l'image d'une droite est-elle parallèle à cette droite ?", "Non", "Elle lui est perpendiculaire."],
        ["Une homothétie de rapport 0,5 conserve-t-elle les aires ?", "Non", "Les aires sont multipliées par 0,5² = 0,25."],
        ["L'homothétie de rapport −1 conserve-t-elle les longueurs ?", "Oui", "C'est la symétrie centrale."],
        ["Une rotation conserve-t-elle les aires ?", "Oui", "La figure image est superposable à la figure de départ."]
      ]);
      return { consigne: q, choix: ["Oui", "Non"], verifier: choixVerif(r), indice: "Translation, rotation et symétries ne déforment pas les figures ; une homothétie change les longueurs (sauf si k = 1 ou −1) mais pas les angles.", correction: `${r}. ${c}` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "rotation",
    titre: "Rotation d'un quart de tour",
    description: "Sur quadrillage.",
    generer() {
      const O = [6, 5], q = choisir([1, -1, 2]), base = tr(MOTIF, 7, 5);
      const bonne = q === 1 ? "90° anti-horaire" : q === -1 ? "90° horaire" : "180°";
      return { consigne: "Le motif orange est l'image du motif bleu par une rotation de centre O (point noir). Quel est l'angle de la rotation ?", figure: (() => { const s = grille(14, 11, [{ pts: base, coul: "var(--cours)" }, { pts: rot(base, O, q), coul: "var(--exercices)" }]); s.append(svg("circle", { cx: 12 + 6 * 24, cy: 12 + 6 * 24, r: 4, style: "fill:var(--texte)" })); s.append(svg("text", { x: 12 + 6 * 24 - 12, y: 12 + 6 * 24 + 16, style: "font-size:14px" }, "O")); return s; })(), choix: ["90° anti-horaire", "90° horaire", "180°"], verifier: choixVerif(bonne), indice: "Repère dans quel sens le motif a tourné autour de O, et de combien.", correction: `Rotation de ${bonne}.` };
    }
  },

  {
    groupe: F2,
    id: "rotation-proprietes",
    titre: "Propriétés de la rotation",
    description: "OM' = OM.",
    generer() {
      const om = alea(20, 80) / 10, a = choisir([30, 45, 60, 90, 120]);
      return Math.random() < 0.5
        ? { consigne: `M' est l'image de M par la rotation de centre O et d'angle ${a}°. OM = ${nb(om)} cm. Que vaut OM' ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], om), indice: "Une rotation de centre O conserve la distance à O.", correction: `OM' = OM = ${nb(om)} cm.` }
        : { consigne: `M' est l'image de M par la rotation de centre O et d'angle ${a}°. Que mesure l'angle MOM' ?`, ligne: "[n] °", verifier: v => verifierNombre(v[0], a), indice: "C'est l'angle de la rotation.", correction: `L'angle MOM' mesure ${a}°.` };
    }
  },

  {
    groupe: F2,
    id: "rosace",
    titre: "Rosaces",
    description: "Angle = 360° ÷ n.",
    generer() {
      const n = choisir([3, 4, 5, 6, 8, 9, 10, 12, 18, 20, 24, 36]);
      return Math.random() < 0.6
        ? { consigne: `Une rosace compte ${n} motifs identiques, régulièrement répartis autour du centre O. Quel est l'angle de la rotation de centre O qui transforme un motif en son voisin ?`, ligne: "[n] °", verifier: v => verifierNombre(v[0], 360 / n), indice: "Un tour complet fait 360°.", correction: `360 ÷ ${n} = ${360 / n}°.` }
        : { consigne: `On construit une rosace en répétant la rotation de centre O et d'angle ${360 / n}°. Combien de motifs compte la rosace ?`, ligne: "[n] motifs", verifier: v => verifierNombre(v[0], n), indice: "Combien de fois cet angle tient-il dans 360° ?", correction: `360 ÷ ${360 / n} = ${n} motifs.` };
    }
  },

  {
    groupe: F2,
    id: "hexagone",
    titre: "Dans un polygone régulier",
    description: "Image d'un sommet.",
    generer() {
      const n = choisir([4, 6, 8]), L = "ABCDEFGH".slice(0, n), a = 360 / n, i = alea(0, n - 1), p = alea(1, n - 1), horaire = Math.random() < 0.4;
      const j = ((horaire ? i - p : i + p) % n + n) % n;
      const nom = { 4: "carré", 6: "hexagone régulier", 8: "octogone régulier" }[n];
      return { consigne: `${L} est un ${nom} de centre O, dont les sommets sont nommés dans le sens anti-horaire. Quelle est l'image de ${L[i]} par la rotation de centre O et d'angle ${p * a}°, dans le sens ${horaire ? "horaire" : "anti-horaire"} ?`, choix: L.split(""), verifier: choixVerif(L[j]), indice: `Un angle de ${a}° fait passer d'un sommet au suivant.`, correction: `${p * a}° = ${p} × ${a}° : on avance de ${p} sommet${p > 1 ? "s" : ""} dans le sens ${horaire ? "horaire" : "anti-horaire"}, on arrive en ${L[j]}.` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "droite-graduee",
    titre: "Sur une droite graduée",
    description: "Abscisse de l'image.",
    generer() {
      const o = alea(-3, 3), a = o + choisir([-4, -3, -2, -1, 1, 2, 3, 4]), k = choisir([2, 3, -1, -2, 0.5, -0.5, 1.5]);
      const r = rr(o + k * (a - o));
      return { consigne: `Sur une droite graduée, O a pour abscisse ${signe(o)} et A pour abscisse ${signe(a)}. Quelle est l'abscisse de l'image de A par l'homothétie de centre O et de rapport ${signe(k)} ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], r), indice: `OA = ${Math.abs(a - o)} : l'image est à ${nb(Math.abs(k * (a - o)))} de O, ${k > 0 ? "du même côté que A" : "de l'autre côté de O"}.`, correction: `${signe(o)} + ${k < 0 ? "(" + signe(k) + ")" : signe(k)} × ${a - o < 0 ? "(" + signe(a - o) + ")" : signe(a - o)} = ${signe(r)}` };
    }
  },

  {
    groupe: F3,
    id: "coordonnees",
    titre: "Sur quadrillage",
    description: "Coordonnées de l'image.",
    generer() {
      const O = [alea(0, 4), alea(0, 4)], k = choisir([2, 3, -1, -2, 0.5, -0.5]);
      let A; do { A = [O[0] + alea(-3, 3) * (Math.abs(k) === 0.5 ? 2 : 1), O[1] + alea(-3, 3) * (Math.abs(k) === 0.5 ? 2 : 1)]; } while (A[0] === O[0] && A[1] === O[1]);
      const R = [rr(O[0] + k * (A[0] - O[0])), rr(O[1] + k * (A[1] - O[1]))], dx = A[0] - O[0], dy = A[1] - O[1];
      return { consigne: `Dans un repère, O${coords(O)} et A${coords(A)}. Quelles sont les coordonnées de l'image de A par l'homothétie de centre O et de rapport ${signe(k)} ?`, ligne: "( [r] ; [r] )", verifier: v => verifierPoint(v, R), indice: `De O à A, on se déplace de ${signe(dx)} en abscisse et ${signe(dy)} en ordonnée : on multiplie ce déplacement par ${signe(k)}.`, correction: `Déplacement × ${signe(k)} : ${signe(k * dx)} ; ${signe(k * dy)}. Image : ${coords(R)}.` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "trouver-k",
    titre: "Trouver le rapport",
    description: "Longueurs et position du centre.",
    generer() {
      const [a, b] = choisir([[2, 6], [3, 9], [4, 10], [6, 3], [8, 2], [5, 7.5], [4, 4], [10, 4], [2, 7]]), entre = Math.random() < 0.5, k = rr((entre ? -1 : 1) * b / a);
      return { consigne: `A' est l'image de A par une homothétie de centre O. OA = ${nb(a)} cm, OA' = ${nb(b)} cm et ${entre ? "O appartient au segment [AA']" : "A' appartient à la demi-droite [OA)"}. Quel est le rapport ? (valeur décimale)`, ligne: "k = [d]", verifier: v => verifierNombre(v[0], k), indice: `|k| = OA' ÷ OA. ${entre ? "O est entre A et A' : k est négatif." : "A et A' sont du même côté de O : k est positif."}`, correction: `${nb(b)} ÷ ${nb(a)} = ${nb(b / a)}, et k est ${entre ? "négatif" : "positif"} : k = ${signe(k)}.` };
    }
  },

  {
    groupe: F4,
    id: "agrandir-reduire",
    titre: "Agrandissement ou réduction ?",
    description: "Selon la valeur de k.",
    generer() {
      const k = choisir([3, -3, 0.5, -0.5, 1.5, -0.2, 2.5, -4, 0.8, -1]);
      const r = Math.abs(k) === 1 ? "ni l'un ni l'autre" : Math.abs(k) > 1 ? "un agrandissement" : "une réduction";
      return { consigne: `L'homothétie de rapport ${signe(k)} est…`, choix: ["un agrandissement", "une réduction", "ni l'un ni l'autre"], verifier: choixVerif(r), indice: "On regarde la valeur de |k| : plus grande ou plus petite que 1 ?", correction: Math.abs(k) === 1 ? "|k| = 1 : les longueurs ne changent pas (c'est la symétrie centrale)." : `|k| = ${nb(Math.abs(k))} ${Math.abs(k) > 1 ? "> 1" : "< 1"} : c'est ${r}${k < 0 ? " (la figure est en plus « retournée » de l'autre côté de O)" : ""}.` };
    }
  },

  {
    groupe: F4,
    id: "reciproque",
    titre: "Dans l'autre sens",
    description: "Rapport inverse.",
    generer() {
      const [p, q] = choisir([[4, 1], [2, 1], [1, 3], [1, 5], [3, 2], [2, 5]]), neg = Math.random() < 0.5, s = neg ? -1 : 1;
      return { consigne: `L'homothétie de centre O et de rapport ${neg ? "−" : ""}${q === 1 ? p : p + "/" + q} transforme A en B. Quel est le rapport de l'homothétie de centre O qui transforme B en A ?`, ligne: "k = [f]", verifier: v => { const n = lireEntier(v[0].num), d = lireEntier(v[0].den); if (isNaN(n) || isNaN(d)) return { etat: "incomplet", message: "Écris un entier (éventuellement négatif) en haut et en bas." }; return n * p === s * q * d ? { etat: "juste" } : { etat: "faux" }; }, indice: "Pour revenir en arrière, on divise au lieu de multiplier : le rapport est l'inverse.", correction: `L'inverse de ${neg ? "−" : ""}${q === 1 ? p : frac(p, q)} : k = ${neg ? "−" : ""}${p === 1 ? q : frac(q, p)}.` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "longueurs-aires",
    titre: "Longueurs et aires",
    description: "× |k| et × k².",
    generer() {
      const k = choisir([2, 3, -2, -3, 0.5, -0.5, 1.5, -4, 10]), aire = Math.random() < 0.5, v = choisir([2, 3, 4, 5, 6, 8, 12]);
      const f = aire ? k * k : Math.abs(k), u = aire ? "cm²" : "cm";
      return { consigne: `Une figure est transformée par une homothétie de rapport ${signe(k)}. ${aire ? "Son aire" : "Un de ses côtés"} mesure ${v} ${u}. Combien mesure ${aire ? "l'aire" : "le côté"} de la figure image ?`, ligne: `[d] ${u}`, verifier: x => verifierNombre(x[0], rr(v * f)), indice: aire ? "Les aires sont multipliées par k² (toujours positif)." : "Les longueurs sont multipliées par |k| (une longueur est toujours positive).", correction: `${v} × ${nb(f)} = ${nb(v * f)} ${u} (${aire ? "× k²" : "× |k|"}).` };
    }
  },

  {
    groupe: F5,
    id: "angle-conserve",
    titre: "Angles et parallélisme",
    description: "Ce que l'homothétie conserve.",
    generer() {
      const a = alea(25, 140), k = choisir([3, -2, 0.5, -1.5]);
      return Math.random() < 0.5
        ? { consigne: `Le triangle A'B'C' est l'image de ABC par une homothétie de rapport ${signe(k)}. L'angle ABC mesure ${a}°. Que mesure l'angle A'B'C' ?`, ligne: "[n] °", verifier: v => verifierNombre(v[0], a), indice: "Une homothétie conserve les angles.", correction: `${a}° : une homothétie conserve les angles.` }
        : { consigne: `Par une homothétie de rapport ${signe(k)}, le segment [AB] a pour image [A'B']. Que peut-on dire des droites (AB) et (A'B') ?`, choix: ["Elles sont parallèles", "Elles sont perpendiculaires", "On ne peut rien dire"], verifier: choixVerif("Elles sont parallèles"), indice: "Une homothétie conserve le parallélisme.", correction: "Elles sont parallèles (ou confondues si le centre est sur (AB))." };
    }
  },

  {
    groupe: F5,
    id: "k-depuis-aire",
    titre: "Trouver k avec les aires",
    description: "k² = rapport des aires.",
    generer() {
      const k = choisir([2, 3, 4, 5, 0.5]), S = choisir([2, 3, 4, 5, 8, 12]), S2 = rr(S * k * k);
      return { consigne: `Par une homothétie de rapport positif, une figure d'aire ${nb(S)} cm² devient une figure d'aire ${nb(S2)} cm². Quel est le rapport ?`, ligne: "k = [d]", verifier: v => verifierNombre(v[0], k), indice: "Les aires sont multipliées par k² : calcule le quotient des aires, puis sa racine carrée.", correction: `${nb(S2)} ÷ ${nb(S)} = ${nb(k * k)} = ${nb(k)}² : k = ${nb(k)}.` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "probleme",
    titre: "Problèmes",
    description: "Projecteur, ombres, maquettes…",
    generer() {
      const [q, r, u, c] = choisir([
        (() => { const k = choisir([40, 50, 60, 80]), l = choisir([2, 3, 3.5]); return [`Un projecteur réalise une homothétie de rapport ${k}. Une diapositive mesure ${nb(l)} cm de large. Quelle est la largeur de l'image projetée, en m ?`, rr(k * l / 100), "m", `${k} × ${nb(l)} = ${nb(k * l)} cm = ${nb(k * l / 100)} m.`]; })(),
        (() => { const d = choisir([0.5, 1, 2]), D = choisir([4, 5, 6]), h = choisir([20, 30, 40]); return [`Une lampe éclaire une silhouette de ${h} cm placée à ${nb(d)} m d'elle. L'écran est à ${D} m de la lampe. Quelle est la hauteur de l'ombre, en cm ?`, rr(h * D / d), "cm", `Rapport ${nb(D)} ÷ ${nb(d)} = ${nb(D / d)} : ${h} × ${nb(D / d)} = ${nb(h * D / d)} cm.`]; })(),
        (() => { const e = choisir([100, 200, 50]), S = choisir([6, 12, 20]); return [`Une maquette est une réduction de rapport 1/${e}. Une façade de la maquette a une aire de ${S} cm². Quelle est l'aire réelle, en m² ?`, rr(S * e * e / 10000), "m²", `Aires × ${e}² = ${e * e} : ${S} × ${e * e} = ${S * e * e} cm² = ${nb(S * e * e / 10000)} m².`]; })(),
        (() => { const S = choisir([3, 4, 5, 6]), k = choisir([-2, -3, 2]); return [`Un triangle d'aire ${S} cm² subit une rotation de 90°, puis une homothétie de rapport ${signe(k)}. Quelle est l'aire finale ?`, S * k * k, "cm²", `La rotation conserve l'aire ; l'homothétie la multiplie par ${k * k} : ${S * k * k} cm².`]; })()
      ]);
      return { consigne: q, ligne: `[d] ${u}`, verifier: v => verifierNombre(v[0], r), indice: "Longueurs × |k| ; aires × k² ; une rotation ne change rien.", correction: c };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Reconnaître une transformation", activites: ["reconnaitre"] },
    { competence: "Ce qui est conservé", activites: ["conserve"] },
    { competence: "Angle d'une rotation", activites: ["rotation", "hexagone"] },
    { competence: "Propriétés de la rotation", activites: ["rotation-proprietes"] },
    { competence: "Rosaces", activites: ["rosace"] },
    { competence: "Image par une homothétie", activites: ["droite-graduee", "coordonnees"] },
    { competence: "Trouver le rapport", activites: ["trouver-k"] },
    { competence: "Agrandissement ou réduction", activites: ["agrandir-reduire", "reciproque"] },
    { competence: "Longueurs et aires", activites: ["longueurs-aires"] },
    { competence: "Angles et parallélisme", activites: ["angle-conserve"] },
    { competence: "Rapport et aires", activites: ["k-depuis-aire"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
