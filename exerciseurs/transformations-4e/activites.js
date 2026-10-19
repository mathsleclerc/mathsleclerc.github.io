/* =====================================================================
   EXERCISEUR « TRANSFORMATIONS DU PLAN » — 4e, chapitre 11

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   Sur quadrillage, les points sont repérés par leurs coordonnées (x ; y).
   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Reconnaître une transformation";
const F2 = "Feuille 2 — Construire l'image par une translation";
const F3 = "Feuille 3 — Propriétés de la translation";
const F4 = "Feuille 4 — La rotation";
const F5 = "Feuille 5 — Agrandissement et réduction";
const F6 = "Feuille 6 — Frises, pavages, problèmes";

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

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "reconnaitre",
    titre: "Quelle transformation ?",
    description: "Symétries, translation, rotation.",
    generer() {
      const base = tr(MOTIF, 2, 2), t = choisir(["translation", "symétrie axiale", "symétrie centrale", "rotation"]);
      const img = t === "translation" ? tr(base, alea(6, 8), choisir([-1, 0, 1])) : t === "symétrie axiale" ? symV(base, 7) : t === "symétrie centrale" ? rot(base, [7, 5], 2) : rot(base, [7, 5], 1);
      return { consigne: "Quelle transformation permet de passer du motif bleu au motif orange ?", figure: grille(16, 8, [{ pts: base, coul: "var(--cours)" }, { pts: img, coul: "var(--exercices)" }]), choix: ["translation", "symétrie axiale", "symétrie centrale", "rotation"], verifier: choixVerif(t), indice: "Le motif est-il retourné (symétrie axiale) ? a-t-il fait un demi-tour ? un quart de tour ? a-t-il seulement glissé ?", correction: `C'est une ${t}${t === "rotation" ? " (d'un quart de tour)" : ""}.` };
    }
  },

  {
    groupe: F1,
    id: "conserve",
    titre: "Ce qui est conservé",
    description: "Longueurs, angles, aires…",
    generer() {
      const [q, r, c] = choisir([
        ["Une translation conserve-t-elle les longueurs ?", "Oui", "Les translations, rotations et symétries conservent les longueurs."],
        ["Un agrandissement de rapport 2 conserve-t-il les longueurs ?", "Non", "Les longueurs sont multipliées par 2."],
        ["Un agrandissement de rapport 2 conserve-t-il les angles ?", "Oui", "Les angles sont conservés."],
        ["Par une translation, l'image d'une droite est-elle toujours parallèle à cette droite ?", "Oui", "C'est une propriété de la translation."],
        ["Par une rotation de 90°, l'image d'une droite est-elle parallèle à cette droite ?", "Non", "Elle lui est perpendiculaire."],
        ["Une rotation conserve-t-elle les aires ?", "Oui", "La figure image est superposable à la figure de départ."]
      ]);
      return { consigne: q, choix: ["Oui", "Non"], verifier: choixVerif(r), indice: "Translation, rotation et symétries ne déforment pas les figures.", correction: `${r}. ${c}` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "image-translation",
    titre: "Image d'un point par une translation",
    description: "Même déplacement.",
    generer() {
      const A = [alea(0, 5), alea(0, 5)], B = [A[0] + alea(-4, 6), A[1] + alea(-4, 5)], M = [alea(-3, 8), alea(-3, 8)];
      const dx = B[0] - A[0], dy = B[1] - A[1], R = [M[0] + dx, M[1] + dy];
      return { consigne: `Dans un repère, A${coords(A)} et B${coords(B)}. Quelles sont les coordonnées de l'image de M${coords(M)} par la translation qui transforme A en B ?`, ligne: "( [r] ; [r] )", verifier: v => verifierPoint(v, R), indice: `De A à B, on se déplace de ${dx} en abscisse et de ${dy} en ordonnée : on applique le même déplacement à M.`, correction: `Déplacement : ${dx >= 0 ? "+" : ""}${nb(dx)} ; ${dy >= 0 ? "+" : ""}${nb(dy)}. Image de M : ${coords(R)}.` };
    }
  },

  {
    groupe: F2,
    id: "deplacement",
    titre: "Décrire une translation",
    description: "De combien de carreaux ?",
    generer() {
      const dx = alea(1, 8), dy = alea(-3, 3), base = tr(MOTIF, 1, 4);
      return { consigne: "Le motif bleu a été transformé en le motif orange par une translation. De combien de carreaux vers la droite, et de combien vers le haut (négatif si vers le bas) ?", figure: grille(14, 10, [{ pts: base, coul: "var(--cours)" }, { pts: tr(base, dx, dy), coul: "var(--exercices)" }]), ligne: "[r] vers la droite ; [r] vers le haut", verifier: v => verifierPoint(v, [dx, dy]), indice: "Suis un sommet du motif bleu jusqu'au sommet correspondant du motif orange.", correction: `${dx} carreaux vers la droite et ${dy} vers le haut.` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "proprietes",
    titre: "Utiliser les propriétés",
    description: "Longueurs, angles, aires conservés.",
    generer() {
      const [L, a, S] = [alea(30, 90) / 10, alea(25, 120), alea(40, 200) / 10], q = choisir(["L", "a", "S"]);
      const map = { L: [`la longueur D'E'`, L, "cm"], a: [`l'angle D'E'F'`, a, "°"], S: [`l'aire de D'E'F'`, S, "cm²"] }[q];
      return { consigne: `Le triangle D'E'F' est l'image du triangle DEF par une translation. DE = ${nb(L)} cm, l'angle DEF mesure ${a}° et l'aire de DEF vaut ${nb(S)} cm². Que vaut ${map[0]} ?`, ligne: `[d] ${map[2]}`, verifier: v => verifierNombre(v[0], map[1]), indice: "Une translation conserve les longueurs, les angles et les aires.", correction: `${nb(map[1])} ${map[2]} : la translation conserve les longueurs, les angles et les aires.` };
    }
  },

  {
    groupe: F3,
    id: "parallelogramme",
    titre: "Translation et parallélogramme",
    description: "ABM'M est un parallélogramme.",
    generer() {
      const [A, B, M, Mp] = tirerLettres(4);
      const bonne = `${A}${B}${Mp}${M}`;
      return { consigne: `La translation qui transforme ${A} en ${B} transforme ${M} en ${Mp}. Quel quadrilatère est un parallélogramme ?`, choix: melanger([bonne, `${A}${B}${M}${Mp}`, `${A}${M}${B}${Mp}`]), verifier: choixVerif(bonne), indice: "On part de A, on va en B, puis à l'image de M, puis on revient à M.", correction: `${bonne} est un parallélogramme (les côtés [${A}${B}] et [${M}${Mp}] sont parallèles et de même longueur).` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
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
    groupe: F4,
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

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "agrandissement",
    titre: "Longueurs, aires, volumes",
    description: "k, k², k³.",
    generer() {
      const k = choisir([2, 3, 4, 0.5, 10, 1.5, 0.1]), quoi = choisir(["longueur", "aire", "volume"]), v = choisir([2, 3, 4, 5, 6, 8, 12]);
      const f = { longueur: [k, "cm"], aire: [k * k, "cm²"], volume: [k ** 3, "cm³"] }[quoi];
      return { consigne: `Une figure est ${k > 1 ? "agrandie" : "réduite"} avec le rapport ${nb(k)}. Une ${quoi} de la figure de départ vaut ${v} ${f[1]}. Que vaut-elle sur la nouvelle figure ?`, ligne: `[d] ${f[1]}`, verifier: x => verifierNombre(x[0], rr(v * f[0])), indice: "Longueurs × k ; aires × k² ; volumes × k³.", correction: `${v} × ${nb(f[0])} = ${nb(v * f[0])} ${f[1]} (${quoi === "longueur" ? "× k" : quoi === "aire" ? "× k²" : "× k³"}).` };
    }
  },

  {
    groupe: F5,
    id: "trouver-k",
    titre: "Trouver le rapport",
    description: "À partir des longueurs ou des aires.",
    generer() {
      const k = choisir([2, 3, 4, 5]), aire = Math.random() < 0.5, L = alea(2, 6);
      return aire
        ? { consigne: `Un carré a une aire de ${L * L} cm². Après agrandissement, son aire vaut ${L * L * k * k} cm². Quel est le rapport d'agrandissement ?`, ligne: "k = [d]", verifier: v => verifierNombre(v[0], k), indice: "L'aire est multipliée par k² : cherche k tel que k² = aire finale ÷ aire initiale.", correction: `${L * L * k * k} ÷ ${L * L} = ${k * k} = ${k}² : k = ${k}.` }
        : { consigne: `Un segment de ${L} cm mesure ${L * k} cm après agrandissement. Quel est le rapport ?`, ligne: "k = [d]", verifier: v => verifierNombre(v[0], k), indice: "k = longueur finale ÷ longueur initiale.", correction: `${L * k} ÷ ${L} = ${k}.` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "probleme",
    titre: "Problèmes",
    description: "Maquettes, photocopies…",
    generer() {
      const [q, r, u, c] = choisir([
        (() => { const e = choisir([18, 24, 43]), l = choisir([20, 25, 30]); return [`Une maquette de voiture au 1/${e} mesure ${l} cm. Quelle est la longueur réelle (en cm) ?`, l * e, "cm", `${l} × ${e} = ${l * e} cm`]; })(),
        (() => { const L = choisir([10, 20, 30]); return [`Une pizza de ${L} cm de diamètre est agrandie en une pizza de ${2 * L} cm. Par combien est multipliée la quantité de garniture (proportionnelle à l'aire) ?`, 4, "", "Rapport 2 : l'aire est multipliée par 2² = 4."]; })(),
        (() => { const v = choisir([5, 8, 10]); return [`Un aquarium contient ${v} L. On double toutes ses dimensions. Combien contiendra le nouvel aquarium ?`, 8 * v, "L", `Volume × 2³ = × 8 : ${8 * v} L.`]; })()
      ]);
      return { consigne: q, ligne: `[d] ${u}`, verifier: v => verifierNombre(v[0], r), indice: "Longueurs × k ; aires × k² ; volumes × k³.", correction: c };
    }
  }
];

/* ---------- Le test « Je me teste » : 10 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "10 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Reconnaître une transformation", activites: ["reconnaitre"] },
    { competence: "Propriétés conservées", activites: ["conserve"] },
    { competence: "Image d'un point par une translation", activites: ["image-translation"] },
    { competence: "Décrire une translation", activites: ["deplacement"] },
    { competence: "Utiliser les propriétés de la translation", activites: ["proprietes", "parallelogramme"] },
    { competence: "Reconnaître une rotation", activites: ["rotation"] },
    { competence: "Propriétés de la rotation", activites: ["rotation-proprietes"] },
    { competence: "Agrandissement : longueurs, aires, volumes", activites: ["agrandissement"] },
    { competence: "Trouver un rapport", activites: ["trouver-k"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
