/* =====================================================================
   EXERCISEUR « PARALLÉLOGRAMMES » — 5e, chapitre 8

   Les activités sont rangées comme les 7 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Définition et vocabulaire";
const F2 = "Feuille 2 — Propriétés du parallélogramme";
const F3 = "Feuille 3 — Construire des parallélogrammes";
const F4 = "Feuille 4 — Reconnaître un parallélogramme";
const F5 = "Feuille 5 — Rectangle, losange, carré";
const F6 = "Feuille 6 — Aires et figures complexes";
const F7 = "Feuille 7 — Conversions et problèmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const egaux = (p, q) => p[0] === q[0] && p[1] === q[1];
const STYLE_BLEU = "fill: color-mix(in srgb, var(--cours) 22%, transparent); stroke: var(--cours); stroke-width: 2.5; stroke-linejoin: round";

function polygone(g, sommets, style = STYLE_BLEU) {
  g.svg.append(svg("polygon", { points: sommets.map(([i, j]) => { const p = g.P(i, j); return p.x + "," + p.y; }).join(" "), style }));
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "est-parallelogramme",
    titre: "Parallélogramme ou pas ?",
    description: "Sur quadrillage.",
    generer() {
      const g = quadrillage(12, 8, 28);
      const A = [alea(1, 3), alea(1, 3)], u = [alea(3, 6), alea(-1, 1)], v = [alea(-2, 2), alea(3, 4)];
      const para = Math.random() < 0.5;
      const B = [A[0] + u[0], A[1] + u[1]], D = [A[0] + v[0], A[1] + v[1]];
      let C = [B[0] + v[0], B[1] + v[1]];
      if (!para) C = [C[0] + choisir([-1, 1, 2]), C[1] + choisir([0, 1, -1])];
      const pts = [A, B, C, D];
      if (pts.some(([i, j]) => i < 0 || i > 12 || j < 0 || j > 8)) return this.generer();
      polygone(g, pts.map(([i, j]) => [i, 8 - j]));
      return {
        consigne: "Ce quadrilatère est-il un parallélogramme ?",
        figure: g.svg,
        choix: ["Oui", "Non"],
        verifier: (x, c) => ({ etat: (c === "Oui") === para ? "juste" : "faux" }),
        indice: "Compte les carreaux : les côtés opposés ont-ils le même « déplacement » (même direction et même longueur) ?",
        correction: para ? "Oui : les côtés opposés sont parallèles (même déplacement sur le quadrillage)." : "Non : deux côtés opposés ne sont pas parallèles."
      };
    }
  },

  {
    groupe: F1,
    id: "vocabulaire",
    titre: "Vocabulaire",
    description: "Côtés opposés, consécutifs, diagonales.",
    generer() {
      const [L1, L2, L3, L4] = choisir([["A", "B", "C", "D"], ["E", "F", "G", "H"], ["R", "S", "T", "U"], ["K", "L", "M", "N"]]);
      const [q, bonne, autres] = choisir([
        [`Dans le parallélogramme ${L1}${L2}${L3}${L4}, quel est le côté opposé à [${L1}${L2}] ?`, `[${L4}${L3}]`, [`[${L2}${L3}]`, `[${L1}${L3}]`]],
        [`Dans le parallélogramme ${L1}${L2}${L3}${L4}, quelles sont les diagonales ?`, `[${L1}${L3}] et [${L2}${L4}]`, [`[${L1}${L2}] et [${L3}${L4}]`, `[${L1}${L4}] et [${L2}${L3}]`]],
        [`Dans le parallélogramme ${L1}${L2}${L3}${L4}, quel côté est consécutif à [${L1}${L2}] ?`, `[${L2}${L3}]`, [`[${L4}${L3}]`, `[${L1}${L3}]`]],
        [`Dans le parallélogramme ${L1}${L2}${L3}${L4}, (${L1}${L4}) est parallèle à…`, `(${L2}${L3})`, [`(${L1}${L2})`, `(${L1}${L3})`]]
      ]);
      return {
        consigne: q,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Dessine le parallélogramme en tournant : les sommets se suivent dans l'ordre des lettres.",
        correction: `Réponse : ${bonne}.`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "longueurs",
    titre: "Longueurs dans un parallélogramme",
    description: "Côtés opposés et diagonales.",
    generer() {
      const a = alea(30, 90) / 10, b = alea(20, 60) / 10, d = alea(40, 120) / 10;
      const [q, r, e] = choisir([
        [`ABCD est un parallélogramme avec AB = ${nb(a)} cm. Quelle est la longueur DC ?`, a, "les côtés opposés ont la même longueur"],
        [`ABCD est un parallélogramme de centre O avec AC = ${nb(d)} cm. Quelle est la longueur AO ?`, d / 2, "les diagonales se coupent en leur milieu"],
        [`ABCD est un parallélogramme de centre O avec OB = ${nb(b)} cm. Quelle est la longueur BD ?`, 2 * b, "les diagonales se coupent en leur milieu"],
        [`ABCD est un parallélogramme avec AB = ${nb(a)} cm et BC = ${nb(b)} cm. Quel est son périmètre ?`, 2 * (a + b), "périmètre = 2 × (AB + BC)"]
      ]);
      return {
        consigne: q,
        ligne: "[d] cm",
        verifier: v => verifierNombre(v[0], rr(r)),
        indice: "Côtés opposés de même longueur ; diagonales qui se coupent en leur milieu.",
        correction: `${nb(r)} cm : ${e}.`
      };
    }
  },

  {
    groupe: F2,
    id: "angles",
    titre: "Angles dans un parallélogramme",
    description: "Opposés égaux, consécutifs supplémentaires.",
    generer() {
      const a = alea(30, 150);
      if (a === 90) return this.generer();
      const opp = Math.random() < 0.5;
      return {
        consigne: `EFGH est un parallélogramme et l'angle Ê mesure ${a}°. Combien mesure l'angle ${opp ? "Ĝ" : "F̂"} ?`,
        ligne: "[n] °",
        verifier: v => verifierNombre(v[0], opp ? a : 180 - a),
        indice: "Les angles opposés ont la même mesure ; deux angles consécutifs sont supplémentaires (180°).",
        correction: opp ? `Ĝ est opposé à Ê : ${a}°.` : `F̂ et Ê sont consécutifs : 180° − ${a}° = ${180 - a}°.`
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "placer-D",
    titre: "Placer le quatrième sommet",
    description: "Compléter un parallélogramme sur quadrillage.",
    generer() {
      const C0 = 12, L0 = 8, g = quadrillage(C0, L0, 28);
      const A = [alea(1, 4), alea(5, 7)], B = [A[0] + alea(4, 7), A[1] + alea(-1, 1)], C = [B[0] + alea(-2, 2), B[1] - alea(3, 4)];
      const D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
      if ([B, C, D].some(([i, j]) => i < 0 || i > C0 || j < 0 || j > L0)) return this.generer();
      g.svg.append(svg("polyline", { points: [A, B, C].map(([i, j]) => { const p = g.P(i, j); return p.x + "," + p.y; }).join(" "), style: "fill:none;stroke:var(--cours);stroke-width:2.5" }));
      [[A, "A"], [B, "B"], [C, "C"]].forEach(([p, n]) => dessinerPoint(g.svg, g.P(...p), n, { vers: { x: -0.8, y: -0.8 } }));
      let choisi = null, marque = null, actif = true;
      g.svg.classList.add("geo-clic");
      g.svg.addEventListener("pointerdown", e => {
        if (!actif) return;
        const { i, j } = g.position(e);
        choisi = [Math.max(0, Math.min(C0, Math.round(i))), Math.max(0, Math.min(L0, Math.round(j)))];
        marque?.remove(); marque = dessinerPoint(g.svg, g.P(...choisi), "D", { vers: { x: -0.8, y: -0.8 }, classe: "geo-eleve" });
      });
      return {
        consigne: "Place le point D pour que ABCD soit un parallélogramme (clique sur un nœud), puis valide.",
        figure: g.svg,
        verifier() {
          if (!choisi) return { etat: "incomplet", message: "Clique sur un nœud du quadrillage." };
          return egaux(choisi, D) ? { etat: "juste" } : { etat: "faux" };
        },
        indice: "Pour aller de A à D, on fait le même déplacement que pour aller de B à C.",
        correction: "Le déplacement de B à C, reproduit à partir de A, donne D (point vert).",
        surCorrection() { dessinerPoint(g.svg, g.P(...D), "D", { vers: { x: 0.8, y: 0.8 }, classe: "geo-correct" }); },
        bloquer() { actif = false; }
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "reconnaitre",
    titre: "Quelle propriété utiliser ?",
    description: "Démontrer que c'est un parallélogramme.",
    generer() {
      const [q, bonne, autres] = choisir([
        ["Les diagonales [AC] et [BD] du quadrilatère ABCD ont le même milieu O. Donc ABCD est un parallélogramme car…", "un quadrilatère dont les diagonales se coupent en leur milieu est un parallélogramme", ["un parallélogramme a des diagonales qui se coupent en leur milieu", "ses diagonales ont la même longueur"]],
        ["Le quadrilatère non croisé EFGH a ses côtés opposés de même longueur deux à deux. Donc…", "EFGH est un parallélogramme", ["EFGH est un rectangle", "EFGH est un losange"]],
        ["ABCD est un parallélogramme. Pourquoi AB = DC ?", "car les côtés opposés d'un parallélogramme ont la même longueur", ["car ABCD a des diagonales de même longueur", "car on l'a mesuré"]],
        ["Un quadrilatère a deux côtés parallèles et les deux autres de même longueur. Est-ce forcément un parallélogramme ?", "non (cela peut être un trapèze isocèle)", ["oui, toujours", "oui, si ses angles sont aigus"]]
      ]);
      return {
        consigne: q,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Attention au sens de la propriété : que sait-on, que veut-on démontrer ?",
        correction: bonne.charAt(0).toUpperCase() + bonne.slice(1) + "."
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "nature",
    titre: "Rectangle, losange ou carré ?",
    description: "Avec les diagonales ou les côtés.",
    generer() {
      const [cond, r] = choisir([
        ["ses diagonales ont la même longueur", "un rectangle"], ["ses diagonales sont perpendiculaires", "un losange"],
        ["il a un angle droit", "un rectangle"], ["deux côtés consécutifs ont la même longueur", "un losange"],
        ["ses diagonales sont perpendiculaires et de même longueur", "un carré"], ["il a un angle droit et deux côtés consécutifs égaux", "un carré"]
      ]);
      return {
        consigne: `ABCD est un parallélogramme et ${cond}. C'est…`,
        choix: ["un rectangle", "un losange", "un carré"],
        verifier: (v, c) => ({ etat: c === r ? "juste" : "faux" }),
        indice: "Rectangle : angle droit ou diagonales de même longueur. Losange : côtés consécutifs égaux ou diagonales perpendiculaires.",
        correction: `C'est ${r}.`
      };
    }
  },

  {
    groupe: F5,
    id: "vrai-faux",
    titre: "Vrai ou faux ?",
    description: "Familles de quadrilatères.",
    generer() {
      const [t, v] = choisir([
        ["Un carré est un rectangle.", true], ["Un carré est un losange.", true], ["Un rectangle est un carré.", false],
        ["Un losange est un parallélogramme.", true], ["Les diagonales d'un rectangle sont perpendiculaires.", false],
        ["Les diagonales d'un losange sont perpendiculaires.", true], ["Les diagonales d'un rectangle ont la même longueur.", true],
        ["Un parallélogramme a toujours un angle droit.", false], ["Un losange a quatre côtés de même longueur.", true]
      ]);
      return {
        consigne: t,
        choix: ["Vrai", "Faux"],
        verifier: (x, c) => ({ etat: (c === "Vrai") === v ? "juste" : "faux" }),
        indice: "Pense aux définitions et aux propriétés des diagonales.",
        correction: v ? "Vrai." : "Faux."
      };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "aire",
    titre: "Aire d'un parallélogramme",
    description: "Base × hauteur.",
    generer() {
      const b = alea(20, 150) / 10, h = alea(15, 90) / 10, c = rr(h + alea(3, 15) / 10);
      const trouverH = Math.random() < 0.25;
      if (trouverH) {
        const aire = rr(b * h);
        return {
          consigne: `Un parallélogramme a une aire de ${nb(aire)} cm² et une base de ${nb(b)} cm. Quelle est la hauteur relative à cette base ?`,
          ligne: "[d] cm",
          verifier: v => verifierNombre(v[0], h),
          indice: "Hauteur = aire ÷ base.",
          correction: `${nb(aire)} ÷ ${nb(b)} = ${nb(h)} cm`
        };
      }
      return {
        consigne: `Un parallélogramme a une base de ${nb(b)} cm, un autre côté de ${nb(c)} cm et une hauteur relative à la base de ${nb(h)} cm. Quelle est son aire ?`,
        ligne: "[d] cm²",
        verifier: v => verifierNombre(v[0], rr(b * h)),
        indice: "Aire = base × hauteur. L'autre côté ne sert pas !",
        correction: `${nb(b)} × ${nb(h)} = ${nb(b * h)} cm²`
      };
    }
  },

  {
    groupe: F6,
    id: "figure-complexe",
    titre: "Figures complexes",
    description: "Ajouter ou retirer des aires.",
    generer() {
      const L = alea(5, 12), l = alea(3, 8), h = alea(2, 5), t = alea(1, 4);
      const [q, r, c] = choisir([
        [`Une figure est formée d'un rectangle de ${L} cm sur ${l} cm et d'un parallélogramme de base ${L} cm et de hauteur ${h} cm collé sur sa longueur. Quelle est son aire ?`, L * l + L * h, `${L} × ${l} + ${L} × ${h} = ${L * l + L * h}`],
        [`Dans un rectangle de ${L} cm sur ${l} cm, on retire un triangle rectangle dont les côtés de l'angle droit mesurent ${t} cm et ${Math.min(h, l)} cm. Quelle est l'aire restante ?`, L * l - t * Math.min(h, l) / 2, `${L} × ${l} − ${t} × ${Math.min(h, l)} ÷ 2 = ${nb(L * l - t * Math.min(h, l) / 2)}`],
        [`Une figure est formée d'un parallélogramme de base ${L} cm et de hauteur ${l} cm, et d'un triangle de base ${L} cm et de hauteur ${h} cm. Quelle est son aire ?`, L * l + L * h / 2, `${L} × ${l} + ${L} × ${h} ÷ 2 = ${nb(L * l + L * h / 2)}`]
      ]);
      return {
        consigne: q,
        ligne: "[d] cm²",
        verifier: v => verifierNombre(v[0], rr(r)),
        indice: "Découpe la figure en morceaux simples ; additionne ou soustrais leurs aires.",
        correction: c + " cm²"
      };
    }
  },

  /* ================= Feuille 7 ================= */
  {
    groupe: F7,
    id: "convertir-aire",
    titre: "Convertir des aires",
    description: "×100 d'une unité à la suivante.",
    generer() {
      const U = ["km²", "hm²", "dam²", "m²", "dm²", "cm²", "mm²"];
      const i = alea(2, 5), j = Math.min(6, Math.max(0, i + choisir([-2, -1, 1, 2]))), x = choisir([alea(1, 99), alea(11, 999) / 10, alea(1, 9) / 10]);
      if (i === j) return this.generer();
      const r = rr(x * 100 ** (j - i));
      return {
        consigne: `Convertis : <strong>${nb(x)} ${U[i]}</strong> en ${U[j]}.`,
        ligne: `${nb(x)} ${U[i]} = [d] ${U[j]}`,
        verifier: v => verifierNombre(v[0], r),
        indice: "Pour les aires, on multiplie ou divise par 100 d'une unité à la suivante (deux colonnes par unité).",
        correction: `${nb(x)} ${U[i]} = ${nb(r)} ${U[j]} (${j > i ? "× " : "÷ "}${nb(100 ** Math.abs(j - i))})`
      };
    }
  },

  {
    groupe: F7,
    id: "hectares",
    titre: "Hectares et ares",
    description: "1 ha = 10 000 m², 1 a = 100 m².",
    generer() {
      const [q, r] = choisir([
        (() => { const x = alea(1, 90) / 10; return [`${nb(x)} ha = … m²`, x * 10000]; })(),
        (() => { const x = alea(1, 99) * 500; return [`${nb(x)} m² = … ha`, x / 10000]; })(),
        (() => { const x = alea(2, 60); return [`${x} a = … m²`, x * 100]; })(),
        (() => { const b = alea(5, 30) * 10, h = alea(5, 30) * 10; return [`Un champ en forme de parallélogramme a une base de ${b} m et une hauteur de ${h} m. Son aire en hectares est …`, b * h / 10000]; })()
      ]);
      return {
        consigne: q.replace("…", "?"),
        ligne: "[d]",
        verifier: v => verifierNombre(v[0], rr(r)),
        indice: "1 ha = 1 hm² = 10 000 m² et 1 a = 1 dam² = 100 m².",
        correction: q.replace("…", nb(r))
      };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Reconnaître un parallélogramme", activites: ["est-parallelogramme"] },
    { competence: "Vocabulaire", activites: ["vocabulaire"] },
    { competence: "Longueurs : côtés et diagonales", activites: ["longueurs"] },
    { competence: "Angles d'un parallélogramme", activites: ["angles"] },
    { competence: "Construire un parallélogramme", activites: ["placer-D"] },
    { competence: "Justifier avec une propriété", activites: ["reconnaitre"] },
    { competence: "Parallélogrammes particuliers", activites: ["nature"] },
    { competence: "Propriétés des quadrilatères", activites: ["vrai-faux"] },
    { competence: "Aire d'un parallélogramme", activites: ["aire"] },
    { competence: "Figures complexes", activites: ["figure-complexe"] },
    { competence: "Convertir des aires", activites: ["convertir-aire"] },
    { competence: "Hectares et ares", activites: ["hectares"] }
  ]
};
