/* =====================================================================
   EXERCISEUR « SOLIDES, VOLUMES ET SECTIONS » — 3e, chapitre 11

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste ».
   ===================================================================== */

const F1 = "Feuille 1 — Volumes des solides usuels";
const F2 = "Feuille 2 — La sphère et la boule";
const F3 = "Feuille 3 — Sections planes";
const F4 = "Feuille 4 — Calculer dans une section";
const F5 = "Feuille 5 — Agrandir et réduire un solide";
const F6 = "Feuille 6 — Problèmes type brevet";
const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const arr = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const verifierArrondi = (s, exact, d = 1) => { const x = lireNombre(s); if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre dans la case." }; return Math.abs(x - arr(exact, d)) < 1e-9 ? { etat: "juste" } : Math.abs(x - exact) < 2 * 10 ** -d ? { etat: "faux", message: "Vérifie l'arrondi demandé." } : { etat: "faux" }; };

const ACTIVITES = [
  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "vol-pyramide",
    titre: "Volume d'une pyramide",
    description: "B × h ÷ 3.",
    generer() {
      const t = choisir(["carre", "rect", "tri"]), h = 3 * alea(2, 8);
      const [desc, B] = t === "carre" ? (c => [`base carrée de côté ${c} cm`, c * c])(alea(2, 10)) : t === "rect" ? ((a, b) => [`base rectangulaire de ${a} cm sur ${b} cm`, a * b])(alea(3, 10), alea(2, 8)) : ((b, hb) => [`base triangulaire de côté ${b} cm et de hauteur relative ${hb} cm`, b * hb / 2])(2 * alea(2, 6), alea(2, 8));
      return { consigne: `Calcule le volume d'une pyramide de ${desc} et de hauteur ${h} cm.`, ligne: "[d] cm³", verifier: v => verifierNombre(v[0], rr(B * h / 3)), indice: "V = aire de la base × hauteur ÷ 3.", correction: `𝓑 = ${nb(B)} cm² ; V = ${nb(B)} × ${h} ÷ 3 = ${nb(B * h / 3)} cm³` };
    }
  },

  {
    groupe: F1,
    id: "hauteur",
    titre: "Retrouver la hauteur",
    description: "h = 3V ÷ B.",
    generer() {
      const c = alea(2, 10), h = alea(2, 15), V = c * c * h / 3;
      if (!Number.isInteger(V * 10)) return this.generer();
      return { consigne: `Une pyramide à base carrée de côté ${c} cm a un volume de ${nb(V)} cm³. Quelle est sa hauteur ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], h), indice: "h = 3 × V ÷ aire de la base.", correction: `h = 3 × ${nb(V)} ÷ ${c * c} = ${h} cm` };
    }
  },

  {
    groupe: F1,
    id: "vol-cone",
    titre: "Volume d'un cône",
    description: "π r² h ÷ 3.",
    generer() {
      const r = alea(1, 9), h = alea(3, 15), diam = Math.random() < 0.3, V = Math.PI * r * r * h / 3;
      return { consigne: `Calcule le volume d'un cône de ${diam ? "diamètre " + 2 * r : "rayon " + r} cm et de hauteur ${h} cm, arrondi au dixième.`, ligne: "[d] cm³", verifier: v => verifierArrondi(v[0], V), indice: `V = π × r² × h ÷ 3${diam ? " (attention : le rayon est la moitié du diamètre)" : ""}.`, correction: `V = π × ${r}² × ${h} ÷ 3 = ${nb(r * r * h / 3)}π ≈ ${nb(arr(V))} cm³` };
    }
  },

  {
    groupe: F1,
    id: "conversion",
    titre: "Volumes et contenances",
    description: "cm³, L, mL.",
    generer() {
      const [q, r, c] = choisir([
        (() => { const v = alea(2, 90) * 10; return [`Convertis ${v} cm³ en litres.`, v / 1000, `1 L = 1 000 cm³ : ${nb(v / 1000)} L`]; })(),
        (() => { const v = alea(2, 30) / 10; return [`Convertis ${nb(v)} m³ en litres.`, v * 1000, `1 m³ = 1 000 L : ${nb(v * 1000)} L`]; })(),
        (() => { const v = alea(1, 50); return [`Convertis ${v} dm³ en litres.`, v, `1 dm³ = 1 L : ${v} L`]; })(),
        (() => { const v = alea(5, 95) * 10; return [`Convertis ${v} cm³ en centilitres.`, v / 10, `1 cL = 10 cm³ : ${nb(v / 10)} cL`]; })()
      ]);
      return { consigne: q, ligne: "[d]", verifier: v => verifierNombre(v[0], rr(r)), indice: "1 dm³ = 1 L ; 1 cm³ = 1 mL ; 1 m³ = 1 000 L.", correction: c };
    }
  },

  {
    groupe: F1,
    id: "vol-cylindre",
    titre: "Volume d'un cylindre ou d'un prisme",
    description: "B × h.",
    generer() {
      if (Math.random() < 0.5) { const r = alea(1, 9), h = alea(2, 20), V = Math.PI * r * r * h; return { consigne: `Calcule le volume d'un cylindre de rayon ${r} cm et de hauteur ${h} cm, arrondi au dixième.`, ligne: "[d] cm³", verifier: v => verifierArrondi(v[0], V), indice: "V = π × r² × h.", correction: `V = π × ${r}² × ${h} = ${r * r * h}π ≈ ${nb(arr(V))} cm³` }; }
      const a = alea(2, 10), b = alea(2, 10), h = alea(3, 15);
      return { consigne: `Un prisme droit a pour base un triangle rectangle dont les côtés de l'angle droit mesurent ${a} cm et ${b} cm. Sa hauteur est ${h} cm. Calcule son volume.`, ligne: "[d] cm³", verifier: v => verifierNombre(v[0], rr(a * b / 2 * h)), indice: "V = aire de la base × hauteur ; la base est un triangle rectangle.", correction: `𝓑 = ${a} × ${b} ÷ 2 = ${nb(a * b / 2)} cm² ; V = ${nb(rr(a * b / 2 * h))} cm³` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "vol-boule",
    titre: "Volume d'une boule",
    description: "4/3 π r³.",
    generer() {
      const r = choisir([1, 2, 3, 4, 5, 6, 10, 1.5, 2.5]), d = Math.random() < 0.3, V = 4 / 3 * Math.PI * r ** 3;
      return { consigne: `Calcule le volume d'une boule de ${d ? "diamètre " + nb(2 * r) : "rayon " + nb(r)} cm, arrondi au dixième.`, ligne: "[d] cm³", verifier: v => verifierArrondi(v[0], V), indice: `V = 4/3 × π × r³${d ? " (le rayon est la moitié du diamètre)" : ""}.`, correction: `V = 4/3 × π × ${nb(r)}³ ≈ ${nb(arr(V))} cm³` };
    }
  },

  {
    groupe: F2,
    id: "aire-sphere",
    titre: "Aire d'une sphère",
    description: "4 π r².",
    generer() {
      const r = choisir([1, 2, 3, 4, 5, 6, 8, 10, 12]), A = 4 * Math.PI * r * r;
      return { consigne: `Calcule l'aire d'une sphère de rayon ${r} cm, arrondie au dixième.`, ligne: "[d] cm²", verifier: v => verifierArrondi(v[0], A), indice: "A = 4 × π × r².", correction: `A = 4 × π × ${r}² = ${4 * r * r}π ≈ ${nb(arr(A))} cm²` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "nature-section",
    titre: "Nature d'une section",
    description: "Que voit-on quand on coupe ?",
    generer() {
      const [q, r] = choisir([
        ["un cube coupé par un plan parallèle à une face", "un carré"], ["un cylindre coupé par un plan parallèle à sa base", "un disque"],
        ["un cylindre coupé par un plan contenant son axe", "un rectangle"], ["une pyramide à base carrée coupée parallèlement à sa base", "un carré"],
        ["un cône coupé parallèlement à sa base", "un disque"], ["une boule coupée par un plan", "un disque"], ["un pavé droit coupé parallèlement à une face", "un rectangle"]
      ]);
      return { consigne: `Quelle est la section de ${q} ?`, choix: ["un carré", "un rectangle", "un disque", "un triangle"], verifier: choixVerif(r), indice: "Parallèlement à la base : même forme (prisme, cylindre) ou réduction (pyramide, cône).", correction: r + "." };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "rayon-section",
    titre: "Rayon d'une section de sphère",
    description: "Avec Pythagore.",
    generer() {
      const [d, r, R] = choisir([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), q = Math.random() < 0.6;
      return q ? { consigne: `Une sphère de rayon ${R} cm est coupée par un plan situé à ${d} cm du centre. Quel est le rayon du cercle de section ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], r), indice: "r² = R² − d² (théorème de Pythagore).", correction: `r² = ${R}² − ${d}² = ${r * r} ; r = ${r} cm` }
        : { consigne: `Une sphère de rayon ${R} cm est coupée par un plan ; la section est un cercle de rayon ${r} cm. À quelle distance du centre est le plan ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], d), indice: "d² = R² − r².", correction: `d² = ${R}² − ${r}² = ${d * d} ; d = ${d} cm` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "reduction-volume",
    titre: "Réduire un solide",
    description: "Volume × k³.",
    generer() {
      const h = choisir([6, 9, 10, 12, 15]), hp = choisir([1, 2, 3, 4, 5]).valueOf(), V = choisir([120, 270, 540, 600, 1000]);
      if (hp >= h) return this.generer();
      const k = hp / h, v = V * k ** 3;
      return { consigne: `Une pyramide de hauteur ${h} cm et de volume ${V} cm³ est coupée parallèlement à sa base, à ${hp} cm du sommet. Quel est le volume de la petite pyramide (au dixième) ?`, ligne: "[d] cm³", verifier: v2 => verifierArrondi(v2[0], v), indice: `Coefficient de réduction k = ${hp}/${h} ; le volume est multiplié par k³.`, correction: `k = ${hp}/${h} ; V = ${V} × (${hp}/${h})³ ≈ ${nb(arr(v))} cm³` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "probleme",
    titre: "Problèmes",
    description: "Cornets, tentes, agrandissements…",
    generer() {
      const [q, r, u, c, d] = choisir([
        (() => { const c = choisir([2, 2.4, 3]), h = choisir([1.5, 1.8, 2]); return [`Une tente est une pyramide régulière à base carrée de ${nb(c)} m de côté et de ${nb(h)} m de haut. Volume d'air (au centième) ?`, c * c * h / 3, "m³", `${nb(c)}² × ${nb(h)} ÷ 3 ≈ ${nb(arr(c * c * h / 3, 2))} m³`, 2]; })(),
        (() => { const r = 3, h = choisir([8, 10, 12]); const V = Math.PI * 9 * h / 3; return [`Un cornet conique a un rayon de 3 cm et une hauteur de ${h} cm. Combien de mL de glace contient-il (à l'unité) ?`, V, "mL", `π × 9 × ${h} ÷ 3 ≈ ${Math.round(V)} cm³ = ${Math.round(V)} mL`, 0]; })(),
        (() => { const V = choisir([20, 40, 50]), k = choisir([2, 3]); return [`Une pyramide de ${V} cm³ est agrandie : toutes ses longueurs sont multipliées par ${k}. Nouveau volume ?`, V * k ** 3, "cm³", `${V} × ${k}³ = ${V * k ** 3} cm³`, 0]; })()
      ]);
      return { consigne: q, ligne: `[d] ${u}`, verifier: v => verifierArrondi(v[0], r, d), indice: "Choisis la bonne formule de volume et respecte les unités.", correction: c };
    }
  }
];

/* ---------- Le test « Je me teste » ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "10 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Volume d'un cylindre ou d'un prisme", activites: ["vol-cylindre"] },
    { competence: "Volume d'une pyramide", activites: ["vol-pyramide"] },
    { competence: "Volume d'un cône", activites: ["vol-cone"] },
    { competence: "Conversions", activites: ["conversion"] },
    { competence: "Volume d'une boule", activites: ["vol-boule"] },
    { competence: "Aire d'une sphère", activites: ["aire-sphere"] },
    { competence: "Nature d'une section", activites: ["nature-section"] },
    { competence: "Section d'une sphère", activites: ["rayon-section"] },
    { competence: "Réduction d'un solide", activites: ["reduction-volume"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
