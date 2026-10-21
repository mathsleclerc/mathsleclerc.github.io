/* =====================================================================
   EXERCISEUR « THÉORÈME DE THALÈS ET TRIANGLES SEMBLABLES » — 3e, chapitre 9

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste ».
   ===================================================================== */

const F1 = "Feuille 1 — Triangles semblables";
const F2 = "Feuille 2 — Thalès : configuration emboîtée";
const F3 = "Feuille 3 — Thalès : configuration papillon";
const F4 = "Feuille 4 — Les droites sont-elles parallèles ?";
const F5 = "Feuille 5 — Agrandissement et réduction";
const F6 = "Feuille 6 — Problèmes type brevet";
const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });

/* Figure de Thalès : triangle ABC (A en haut), M sur [AB], N sur [AC] au rapport k.
   etiq : { AM, MB, AB, AN, NC, AC, MN, BC } textes à écrire. */
function figThales([A, B, C, M, N], k, etiq = {}) {
  const s = figureGeo(320, 210, "Configuration de Thalès");
  const PA = { x: 120 + alea(-30, 30), y: 22 }, PB = { x: 30, y: 185 }, PC = { x: 290, y: 185 };
  const PM = V.plus(PA, V.fois(V.moins(PB, PA), k)), PN = V.plus(PA, V.fois(V.moins(PC, PA), k));
  [[PA, PB], [PB, PC], [PC, PA]].forEach(([p, q]) => dessinerTrait(s, p, q));
  dessinerTrait(s, PM, PN, "segment", "geo-trait geo-orange");
  const G = { x: 150, y: 120 };
  [[PA, A], [PB, B], [PC, C], [PM, M], [PN, N]].forEach(([p, n]) => dessinerTexte(s, V.plus(p, V.fois(V.unitaire(V.moins(p, G)), 16)), n, "geo-nom"));
  const cote = (p, q, t, d = 1) => { if (!t) return; const m = V.milieu(p, q), w = V.fois(V.unitaire(V.normal(V.moins(q, p))), 14 * d); dessinerTexte(s, V.plus(m, w), t, "geo-nom"); };
  cote(PA, PM, etiq.AM, 1); cote(PM, PB, etiq.MB, 1); cote(PA, PN, etiq.AN, -1); cote(PN, PC, etiq.NC, -1);
  cote(PB, PC, etiq.BC, -1); cote(PM, PN, etiq.MN, 1);
  if (etiq.AB) dessinerTexte(s, V.plus(V.milieu(PA, PB), { x: -26, y: 0 }), etiq.AB, "geo-nom");
  if (etiq.AC) dessinerTexte(s, V.plus(V.milieu(PA, PC), { x: 30, y: 0 }), etiq.AC, "geo-nom");
  const st = svg("style", {}, ".geo-orange{stroke:var(--exercices)}"); s.append(st);
  return s;
}
const noms = () => { const L = tirerLettres(5); return L; };
/* Triplets « jolis » : longueurs du grand triangle et rapport k */
function config() {
  const k = choisir([0.25, 0.4, 0.5, 0.6, 0.75, 2 / 3, 1 / 3, 0.8]);
  const base = choisir([[6, 9, 12], [10, 15, 20], [12, 18, 15], [9, 12, 15], [15, 6, 12], [30, 24, 18]]);
  const [AB, AC, BC] = base.map(x => x * (k === 2 / 3 || k === 1 / 3 ? 1 : 1));
  if (![AB, AC, BC].every(x => Number.isInteger(rr(x * k * 10)))) return config();
  return { k, AB, AC, BC, AM: rr(AB * k), AN: rr(AC * k), MN: rr(BC * k) };
}

const ACTIVITES = [
  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "semblables-angles",
    titre: "Semblables ? (angles)",
    description: "Deux angles égaux suffisent.",
    generer() {
      const a = alea(30, 80), b = alea(30, 100 - Math.floor(a / 2)), c = 180 - a - b, oui = Math.random() < 0.5;
      const [d, e] = oui ? [a, c] : [a, c + choisir([-10, 5, 10])];
      if (!oui && (e === b || e <= 0)) return this.generer();
      return { consigne: `Le triangle ABC a des angles de ${a}° et ${b}°. Le triangle DEF a des angles de ${d}° et ${e}°. Sont-ils semblables ?`, choix: ["oui", "non"], verifier: choixVerif(oui ? "oui" : "non"), indice: "Calcule le troisième angle de chaque triangle (somme = 180°), puis compare.", correction: `ABC : ${a}°, ${b}°, ${c}° ; DEF : ${d}°, ${e}°, ${180 - d - e}°. ${oui ? "Mêmes angles : semblables." : "Angles différents : pas semblables."}` };
    }
  },

  {
    groupe: F1,
    id: "semblables-cotes",
    titre: "Côtés homologues",
    description: "Coefficient et longueur manquante.",
    generer() {
      const base = choisir([[3, 4, 5], [4, 6, 7], [5, 6, 8], [6, 8, 9]]), k = choisir([1.5, 2, 2.5, 3, 0.5]), i = alea(1, 2);
      return { consigne: `Les triangles ABC et DEF sont semblables (A ↔ D, B ↔ E, C ↔ F). AB = ${nb(base[0])} cm, BC = ${nb(base[1])} cm, AC = ${nb(base[2])} cm et DE = ${nb(base[0] * k)} cm. Calcule ${i === 1 ? "EF" : "DF"}.`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], rr(base[i] * k)), indice: `Coefficient : DE ÷ AB.`, correction: `k = ${nb(base[0] * k)} ÷ ${nb(base[0])} = ${nb(k)} ; ${i === 1 ? "EF" : "DF"} = ${nb(base[i])} × ${nb(k)} = ${nb(rr(base[i] * k))} cm` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "rapports",
    titre: "Écrire les rapports",
    description: "Petit triangle sur grand triangle.",
    generer() {
      const [A, B, C, M, N] = noms();
      const bonne = `${A}${M}/${A}${B} = ${A}${N}/${A}${C} = ${M}${N}/${B}${C}`;
      return { consigne: `(${M}${N}) ∥ (${B}${C}), ${M} ∈ [${A}${B}] et ${N} ∈ [${A}${C}]. Quelle égalité est vraie ?`, figure: figThales([A, B, C, M, N], choisir([0.4, 0.5, 0.6])),
        choix: melanger([bonne, `${A}${M}/${M}${B} = ${A}${N}/${N}${C} = ${M}${N}/${B}${C}`, `${A}${M}/${A}${B} = ${A}${C}/${A}${N} = ${M}${N}/${B}${C}`, `${A}${B}/${A}${M} = ${A}${N}/${A}${C} = ${B}${C}/${M}${N}`]),
        verifier: choixVerif(bonne), indice: "Petit triangle au numérateur, grand triangle au dénominateur, côté par côté depuis le sommet commun.", correction: bonne };
    }
  },

  {
    groupe: F2,
    id: "calcul",
    titre: "Calculer une longueur",
    description: "Avec le produit en croix.",
    generer() {
      const [A, B, C, M, N] = noms(), c = config();
      const quoi = choisir(["MN", "AC", "AN", "BC"]);
      const etiq = { AM: nb(c.AM), MB: nb(c.AB - c.AM) };
      let rep, det;
      if (quoi === "MN") { etiq.BC = nb(c.BC); etiq.MN = "?"; rep = c.MN; det = `${M}${N} = ${nb(c.AM)} × ${nb(c.BC)} ÷ ${nb(c.AB)}`; }
      if (quoi === "AC") { etiq.AN = nb(c.AN); rep = c.AC; det = `${A}${C} = ${nb(c.AB)} × ${nb(c.AN)} ÷ ${nb(c.AM)}`; }
      if (quoi === "AN") { etiq.AC = nb(c.AC); rep = c.AN; det = `${A}${N} = ${nb(c.AM)} × ${nb(c.AC)} ÷ ${nb(c.AB)}`; }
      if (quoi === "BC") { etiq.MN = nb(c.MN); etiq.BC = "?"; rep = c.BC; det = `${B}${C} = ${nb(c.AB)} × ${nb(c.MN)} ÷ ${nb(c.AM)}`; }
      const nom = { MN: M + N, AC: A + C, AN: A + N, BC: B + C }[quoi];
      return { consigne: `(${M}${N}) ∥ (${B}${C}). Les longueurs sont en cm. Calcule ${nom}.`, figure: figThales([A, B, C, M, N], c.k, etiq), ligne: `${nom} = [d] cm`, verifier: v => verifierNombre(v[0], rep),
        indice: `Attention : ${A}${B} = ${A}${M} + ${M}${B} = ${nb(c.AB)}. Écris les trois rapports égaux, puis utilise le produit en croix.`, correction: `${A}${M}/${A}${B} = ${A}${N}/${A}${C} = ${M}${N}/${B}${C} avec ${A}${B} = ${nb(c.AB)} ; ${det} = ${nb(rep)} cm.` };
    }
  },

  {
    groupe: F2,
    id: "coefficient",
    titre: "Coefficient de réduction",
    description: "AM/AB.",
    generer() {
      const c = config(), [A, B, C, M, N] = noms();
      return { consigne: `(${M}${N}) ∥ (${B}${C}) avec ${A}${M} = ${nb(c.AM)} cm et ${A}${B} = ${nb(c.AB)} cm. Par quel nombre multiplie-t-on les longueurs du triangle ${A}${B}${C} pour obtenir celles de ${A}${M}${N} ? (écriture décimale, arrondie au centième si besoin)`, ligne: "[d]", verifier: v => { const x = lireNombre(v[0]); if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre." }; return Math.abs(x - c.k) < 0.006 ? { etat: "juste" } : { etat: "faux" }; }, indice: `Calcule ${A}${M} ÷ ${A}${B}.`, correction: `${nb(c.AM)} ÷ ${nb(c.AB)} ≈ ${nb(Math.round(c.k * 100) / 100)}` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "papillon",
    titre: "Configuration papillon",
    description: "Les droites se croisent en O.",
    generer() {
      const k = choisir([1.5, 2, 2.5, 3, 0.5, 1.2]), OA = choisir([2, 3, 4, 5, 6]), OB = choisir([2, 3, 4, 5]), AB = choisir([3, 4, 5, 6]), q = alea(1, 2);
      const OC = rr(OA * k), OD = rr(OB * k), CD = rr(AB * k);
      return q === 1
        ? { consigne: `(AC) et (BD) sont sécantes en O, avec O entre A et C et entre B et D ; (AB) ∥ (CD). OA = ${nb(OA)} cm, OC = ${nb(OC)} cm, OB = ${nb(OB)} cm. Calcule OD.`, ligne: "OD = [d] cm", verifier: v => verifierNombre(v[0], OD), indice: "OA/OC = OB/OD = AB/CD.", correction: `OA/OC = OB/OD donc OD = ${nb(OC)} × ${nb(OB)} ÷ ${nb(OA)} = ${nb(OD)} cm` }
        : { consigne: `(AC) et (BD) sont sécantes en O, avec O entre A et C et entre B et D ; (AB) ∥ (CD). OA = ${nb(OA)} cm, OC = ${nb(OC)} cm, AB = ${nb(AB)} cm. Calcule CD.`, ligne: "CD = [d] cm", verifier: v => verifierNombre(v[0], CD), indice: "OA/OC = AB/CD.", correction: `CD = ${nb(OC)} × ${nb(AB)} ÷ ${nb(OA)} = ${nb(CD)} cm` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "reciproque",
    titre: "Parallèles ou non ?",
    description: "Réciproque ou contraposée.",
    generer() {
      const c = config(), oui = Math.random() < 0.5, [A, B, C, M, N] = noms();
      const AN = oui ? c.AN : rr(c.AN + choisir([0.5, -0.5, 1]));
      return { consigne: `${M} ∈ [${A}${B}] et ${N} ∈ [${A}${C}] avec ${A}${M} = ${nb(c.AM)}, ${A}${B} = ${nb(c.AB)}, ${A}${N} = ${nb(AN)} et ${A}${C} = ${nb(c.AC)} (en cm). Les droites (${M}${N}) et (${B}${C}) sont-elles parallèles ?`, choix: ["Oui", "Non"], verifier: choixVerif(oui ? "Oui" : "Non"), indice: `Compare ${A}${M}/${A}${B} et ${A}${N}/${A}${C}.`, correction: `${A}${M}/${A}${B} ≈ ${nb(Math.round(c.AM / c.AB * 1000) / 1000)} et ${A}${N}/${A}${C} ≈ ${nb(Math.round(AN / c.AC * 1000) / 1000)} : ${oui ? "égaux, donc parallèles (réciproque du théorème de Thalès)." : "différents, donc pas parallèles (contraposée)."}` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "k-aire-volume",
    titre: "Longueurs, aires, volumes",
    description: "× k, × k², × k³.",
    generer() {
      const k = choisir([2, 3, 0.5, 10, 1.5]), t = choisir(["longueur", "aire", "volume"]), v0 = choisir([4, 6, 8, 12, 20, 40]);
      const p = { longueur: 1, aire: 2, volume: 3 }[t], u = { longueur: "cm", aire: "cm²", volume: "cm³" }[t], r = rr(v0 * k ** p);
      return { consigne: `Une figure est ${k > 1 ? "agrandie" : "réduite"} avec le coefficient ${nb(k)}. ${t === "longueur" ? "Une longueur" : t === "aire" ? "Une aire" : "Un volume"} de ${v0} ${u} devient… ?`, ligne: `[d] ${u}`, verifier: v => verifierNombre(v[0], r), indice: `Les longueurs sont multipliées par k, les aires par k², les volumes par k³.`, correction: `${v0} × ${nb(k)}${p > 1 ? (p === 2 ? "²" : "³") : ""} = ${nb(r)} ${u}` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "probleme",
    titre: "Problèmes",
    description: "Ombres, rivières, rampes…",
    generer() {
      const [q, r, u, c] = choisir([
        (() => { const b = choisir([1, 1.5, 2]), o = choisir([1.5, 2, 2.5, 3]), O = o * choisir([6, 8, 10, 12]); return [`Un bâton vertical de ${nb(b)} m a une ombre de ${nb(o)} m. Au même moment, l'ombre d'un arbre mesure ${nb(O)} m. Quelle est la hauteur de l'arbre ?`, b * O / o, "m", `${nb(b)} × ${nb(O)} ÷ ${nb(o)} = ${nb(b * O / o)} m`]; })(),
        (() => { const am = choisir([10, 12, 20]), mb = choisir([15, 18, 30]), mn = choisir([8, 10, 12]); return [`Pour mesurer la largeur BC d'une rivière, on place A, M, N avec M ∈ [AB], N ∈ [AC] et (MN) ∥ (BC). AM = ${am} m, MB = ${mb} m et MN = ${mn} m. Quelle est la largeur BC ?`, mn * (am + mb) / am, "m", `AB = ${am + mb} m ; BC = ${am + mb} × ${mn} ÷ ${am} = ${nb(mn * (am + mb) / am)} m`]; })(),
        (() => { const L = 5, h = 0.8, d = choisir([1, 2, 2.5, 4]); return [`Une rampe de ${L} m de long monte de ${nb(h)} m. Quelle est la hauteur de la rampe à ${nb(d)} m de son point de départ (mesuré le long de la rampe) ?`, h * d / L, "m", `${nb(h)} × ${nb(d)} ÷ ${L} = ${nb(h * d / L)} m`]; })()
      ]);
      return { consigne: q, ligne: `[d] ${u}`, verifier: v => verifierNombre(v[0], rr(r)), indice: "Repère deux triangles emboîtés avec des côtés parallèles (les verticales sont parallèles).", correction: c };
    }
  },

  {
    groupe: F6,
    id: "quel-theoreme",
    titre: "Thalès ou Pythagore ?",
    description: "Choisir le bon outil.",
    generer() {
      const [q, r] = choisir([
        ["On veut calculer l'hypoténuse d'un triangle rectangle dont on connaît les deux autres côtés.", "Théorème de Pythagore"],
        ["On veut prouver que deux droites sont parallèles connaissant quatre longueurs.", "Réciproque du théorème de Thalès"],
        ["On veut prouver qu'un triangle est rectangle connaissant ses trois côtés.", "Réciproque du théorème de Pythagore"],
        ["On connaît deux droites parallèles et on veut calculer une longueur dans des triangles emboîtés.", "Théorème de Thalès"]
      ]);
      return { consigne: q + " Quel outil utiliser ?", choix: ["Théorème de Pythagore", "Réciproque du théorème de Pythagore", "Théorème de Thalès", "Réciproque du théorème de Thalès"], verifier: choixVerif(r), indice: "Pythagore : triangle rectangle. Thalès : droites parallèles.", correction: r + "." };
    }
  },

  {
    groupe: F6,
    id: "mixte",
    titre: "Pythagore puis Thalès",
    description: "Deux étapes.",
    generer() {
      const [a, b, c] = choisir([[6, 8, 10], [9, 12, 15], [5, 12, 13], [12, 16, 20]]), k = choisir([0.25, 0.5, 0.75]);
      return { consigne: `ABC est rectangle en A avec AB = ${a} cm et AC = ${b} cm. M ∈ [AB] avec AM = ${nb(a * k)} cm et N ∈ [AC] avec (MN) ∥ (BC). Calcule MN.`, ligne: "MN = [d] cm", verifier: v => verifierNombre(v[0], rr(c * k)), indice: "Calcule d'abord BC avec le théorème de Pythagore, puis MN avec le théorème de Thalès.", correction: `BC = √(${a * a} + ${b * b}) = ${c} cm ; MN = ${c} × ${nb(a * k)} ÷ ${a} = ${nb(c * k)} cm.` };
    }
  }
];

/* ---------- Le test « Je me teste » ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Reconnaître des triangles semblables", activites: ["semblables-angles"] },
    { competence: "Utiliser des triangles semblables", activites: ["semblables-cotes"] },
    { competence: "Écrire les rapports de Thalès", activites: ["rapports"] },
    { competence: "Calculer une longueur (emboîtée)", activites: ["calcul"] },
    { competence: "Calculer une longueur (emboîtée)", activites: ["calcul"] },
    { competence: "Calculer une longueur (papillon)", activites: ["papillon"] },
    { competence: "Coefficient de réduction", activites: ["coefficient"] },
    { competence: "Parallèles ou non ?", activites: ["reciproque"] },
    { competence: "Longueurs, aires, volumes", activites: ["k-aire-volume"] },
    { competence: "Thalès ou Pythagore ?", activites: ["quel-theoreme"] },
    { competence: "Résoudre un problème", activites: ["probleme"] },
    { competence: "Pythagore puis Thalès", activites: ["mixte"] }
  ]
};
