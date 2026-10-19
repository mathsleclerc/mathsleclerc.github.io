/* =====================================================================
   EXERCISEUR « PYRAMIDES, CÔNES ET REPÉRAGE DANS L'ESPACE » — 4e, chapitre 12

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Reconnaître les solides";
const F2 = "Feuille 2 — Patrons de pyramides et de cônes";
const F3 = "Feuille 3 — Volume d'une pyramide";
const F4 = "Feuille 4 — Volume d'un cône";
const F5 = "Feuille 5 — Se repérer dans l'espace";
const F6 = "Feuille 6 — Résoudre des problèmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const arr = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const verifierArrondi = (s, exact, d = 1) => { const x = lireNombre(s); if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre dans la case." }; return Math.abs(x - arr(exact, d)) < 1e-9 ? { etat: "juste" } : Math.abs(x - exact) < 2 * 10 ** -d ? { etat: "faux", message: "Vérifie l'arrondi demandé." } : { etat: "faux" }; };

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "nommer",
    titre: "Quel solide ?",
    description: "Pyramide, cône, prisme, cylindre.",
    generer() {
      const [d, r] = choisir([
        ["Une base en forme de disque et un sommet.", "un cône de révolution"], ["Deux bases en forme de disques superposables et parallèles.", "un cylindre"],
        ["Une base polygonale et des faces latérales triangulaires ayant un sommet commun.", "une pyramide"], ["Deux bases polygonales superposables et des faces latérales rectangulaires.", "un prisme droit"],
        ["Quatre faces, toutes triangulaires.", "une pyramide"], ["Une base carrée et quatre faces triangulaires.", "une pyramide"]
      ]);
      return { consigne: `Quel solide a : « ${d} » ?`, choix: ["une pyramide", "un cône de révolution", "un prisme droit", "un cylindre"], verifier: choixVerif(r), indice: "Pyramide et cône ont un sommet ; prisme et cylindre ont deux bases.", correction: `C'est ${r}.` };
    }
  },

  {
    groupe: F1,
    id: "compter",
    titre: "Faces, arêtes, sommets",
    description: "D'une pyramide.",
    generer() {
      const n = alea(3, 10), q = choisir(["faces", "arêtes", "sommets"]), r = { faces: n + 1, arêtes: 2 * n, sommets: n + 1 }[q];
      const base = { 3: "triangulaire", 4: "carrée", 5: "pentagonale", 6: "hexagonale" }[n] || `à ${n} côtés`;
      return { consigne: `Combien une pyramide à base ${base} a-t-elle de ${q} ?`, ligne: "[n]", verifier: v => verifierNombre(v[0], r), indice: `La base a ${n} côtés : compte la base, les faces latérales, les arêtes de la base et les arêtes latérales.`, correction: q === "faces" ? `1 base + ${n} faces latérales = ${r}.` : q === "arêtes" ? `${n} arêtes de base + ${n} arêtes latérales = ${r}.` : `${n} sommets de base + 1 sommet = ${r}.` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "secteur",
    titre: "Patron d'un cône",
    description: "L'angle du secteur.",
    generer() {
      const [r, g] = choisir([[2, 6], [3, 5], [1, 4], [2, 5], [3, 9], [4, 6], [3, 6], [2, 8]]);
      return { consigne: `Le patron d'un cône de rayon ${r} cm et de génératrice ${g} cm comporte un secteur de rayon ${g} cm. Quel est l'angle de ce secteur ?`, ligne: "[d] °", verifier: v => verifierNombre(v[0], rr(360 * r / g)), indice: `L'arc du secteur a la même longueur que le périmètre de la base : il représente ${r}/${g} du cercle de rayon ${g}.`, correction: `${r} ÷ ${g} × 360° = ${nb(360 * r / g)}°` };
    }
  },

  {
    groupe: F2,
    id: "patron-pyramide",
    titre: "Patron d'une pyramide",
    description: "Combien de faces ?",
    generer() {
      const n = alea(3, 8);
      return { consigne: `Le patron d'une pyramide à base de ${n} côtés est formé de la base et de combien de triangles ?`, ligne: "[n] triangles", verifier: v => verifierNombre(v[0], n), indice: "Une face latérale par côté de la base.", correction: `${n} triangles (un par côté de la base).` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
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
    groupe: F3,
    id: "hauteur",
    titre: "Retrouver la hauteur",
    description: "h = 3V ÷ B.",
    generer() {
      const c = alea(2, 10), h = alea(2, 15), V = c * c * h / 3;
      if (!Number.isInteger(V * 10)) return this.generer();
      return { consigne: `Une pyramide à base carrée de côté ${c} cm a un volume de ${nb(V)} cm³. Quelle est sa hauteur ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], h), indice: "h = 3 × V ÷ aire de la base.", correction: `h = 3 × ${nb(V)} ÷ ${c * c} = ${h} cm` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "vol-cone",
    titre: "Volume d'un cône",
    description: "π r² h ÷ 3.",
    generer() {
      const r = alea(1, 9), h = alea(3, 15), diam = Math.random() < 0.3, V = Math.PI * r * r * h / 3;
      return { consigne: `Calcule le volume d'un cône de ${diam ? "diamètre " + 2 * r : "rayon " + r} cm et de hauteur ${h} cm, arrondi au dixième.`, ligne: "[d] cm³", verifier: v => verifierArrondi(v[0], V), indice: `V = π × r² × h ÷ 3${diam ? " (attention : le rayon est la moitié du diamètre)" : ""}.`, correction: `V = π × ${r}² × ${h} ÷ 3 = ${nb(r * r * h / 3)}π ≈ ${nb(arr(V))} cm³` };
    }
  },

  {
    groupe: F4,
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

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "coordonnees",
    titre: "Coordonnées dans un pavé",
    description: "Abscisse, ordonnée, altitude.",
    generer() {
      const L = alea(2, 8), l = alea(2, 6), h = alea(2, 5);
      const pts = { A: [L, 0, 0], B: [L, l, 0], C: [0, l, 0], D: [0, 0, h], E: [L, 0, h], F: [L, l, h], G: [0, l, h] };
      const k = choisir(Object.keys(pts)), p = pts[k];
      return { consigne: `Le pavé droit OABCDEFG a pour dimensions OA = ${L} (abscisses), OC = ${l} (ordonnées) et OD = ${h} (altitudes). La face OABC est la base ; D, E, F, G sont respectivement au-dessus de O, A, B, C. Quelles sont les coordonnées de ${k} ?`, ligne: "( [d] ; [d] ; [d] )", verifier: v => { const x = v.map(lireNombre); if (x.some(isNaN)) return { etat: "incomplet", message: "Remplis les trois coordonnées." }; return x.every((t, i) => t === p[i]) ? { etat: "juste" } : { etat: "faux" }; }, indice: "Abscisse : selon [OA) ; ordonnée : selon [OC) ; altitude : selon [OD).", correction: `${k}(${p.join(" ; ")})` };
    }
  },

  {
    groupe: F5,
    id: "terre",
    titre: "Latitude et longitude",
    description: "Se repérer sur la Terre.",
    generer() {
      const [q, r] = choisir([
        ["La latitude d'un point de l'équateur est…", "0°"], ["La latitude du pôle Nord est…", "90° Nord"],
        ["La longitude d'un point du méridien de Greenwich est…", "0°"], ["Paris est située dans l'hémisphère…", "Nord"],
        ["Une ville à l'ouest du méridien de Greenwich a une longitude…", "Ouest"]
      ]);
      const choix = { "0°": ["0°", "90° Nord", "180°"], "90° Nord": ["0°", "90° Nord", "180°"], "Nord": ["Nord", "Sud"], "Ouest": ["Est", "Ouest"] }[r];
      return { consigne: q, choix, verifier: choixVerif(r), indice: "La latitude se mesure depuis l'équateur, la longitude depuis le méridien de Greenwich.", correction: r + "." };
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

/* ---------- Le test « Je me teste » : 10 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "10 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Reconnaître un solide", activites: ["nommer"] },
    { competence: "Faces, arêtes, sommets", activites: ["compter"] },
    { competence: "Patrons", activites: ["secteur", "patron-pyramide"] },
    { competence: "Volume d'une pyramide", activites: ["vol-pyramide"] },
    { competence: "Retrouver une hauteur", activites: ["hauteur"] },
    { competence: "Volume d'un cône", activites: ["vol-cone"] },
    { competence: "Volumes et contenances", activites: ["conversion"] },
    { competence: "Coordonnées dans un pavé", activites: ["coordonnees"] },
    { competence: "Se repérer sur la Terre", activites: ["terre"] },
    { competence: "Résoudre un problème", activites: ["probleme"] }
  ]
};
