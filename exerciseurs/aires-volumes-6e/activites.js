/* =====================================================================
   EXERCISEUR « AIRES ET VOLUMES » — 6e, chapitre 13

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Aires par comptage";
const F2 = "Feuille 2 — Unités d'aire et conversions";
const F3 = "Feuille 3 — Aire du carré et du rectangle";
const F4 = "Feuille 4 — Problèmes d'aires";
const F5 = "Feuille 5 — Vision dans l'espace";
const F6 = "Feuille 6 — Volumes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const tirer = (min, max, d) => rr(alea(Math.round(min * 10 ** d), Math.round(max * 10 ** d)) / 10 ** d);
const m2 = u => `${u}<sup>2</sup>`;
const m3 = u => `${u}<sup>3</sup>`;

/* ---------- Figures sur quadrillage ----------
   cellules : Set de « i,j » ; demis : [{ i, j, coin }] (demi-carreau triangulaire, coin : 0 à 3) */
function polyomino(n, cols, lignes) {
  const cells = new Set([`${Math.floor(cols / 2)},${Math.floor(lignes / 2)}`]);
  while (cells.size < n) {
    const [i, j] = choisir([...cells]).split(",").map(Number);
    const [di, dj] = choisir([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    const ni = i + di, nj = j + dj;
    if (ni >= 1 && nj >= 1 && ni < cols - 1 && nj < lignes - 1) cells.add(`${ni},${nj}`);
  }
  return cells;
}
function perimetre(cells) {
  let p = 0;
  for (const c of cells) { const [i, j] = c.split(",").map(Number); for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!cells.has(`${i + di},${j + dj}`)) p++; }
  return p;
}
function dessinerFigure(q, cells, demis = []) {
  const g = svg("g", { class: "fig-aire" });
  for (const c of cells) { const [i, j] = c.split(",").map(Number); const A = q.P(i, j); g.append(svg("rect", { x: A.x, y: A.y, width: q.pas, height: q.pas, class: "aire-case" })); }
  for (const { i, j, coin } of demis) {
    const p = [q.P(i, j), q.P(i + 1, j), q.P(i + 1, j + 1), q.P(i, j + 1)];
    const tri = [0, 1, 2, 3].filter(k => k !== coin).map(k => p[k]);
    g.append(svg("polygon", { points: tri.map(a => `${a.x},${a.y}`).join(" "), class: "aire-case" }));
  }
  q.svg.append(g);
}
/* Des demi-carreaux collés au bord de la figure, sur des cases libres */
function ajouterDemis(cells, k, cols, lignes) {
  const demis = [], pris = new Set(cells);
  for (let essai = 0; essai < 200 && demis.length < k; essai++) {
    const [i, j] = choisir([...cells]).split(",").map(Number);
    const [di, dj] = choisir([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    const ni = i + di, nj = j + dj, cle = `${ni},${nj}`;
    if (ni < 0 || nj < 0 || ni >= cols || nj >= lignes || pris.has(cle)) continue;
    // le demi-carreau touche la figure par un côté entier
    const coin = di === 1 ? choisir([1, 2]) : di === -1 ? choisir([0, 3]) : dj === 1 ? choisir([2, 3]) : choisir([0, 1]);
    pris.add(cle); demis.push({ i: ni, j: nj, coin });
  }
  return demis;
}

/* ---------- Cubes en perspective ----------
   H[r][c] : hauteur de la colonne (r : profondeur, 0 au fond ; c : de gauche à droite) */
function assemblage(H, a = 38) {
  const R = H.length, C = H[0].length, maxH = Math.max(...H.flat());
  const cx = a * 0.866, cy = a * 0.5;
  const X = (r, c) => (c - r) * cx, Y = (r, c, z) => (c + r) * cy - z * a;
  const xs = [], ys = [];
  for (let r = 0; r <= R; r++) for (let c = 0; c <= C; c++) { xs.push(X(r, c)); ys.push(Y(r, c, 0), Y(r, c, maxH)); }
  const minX = Math.min(...xs) - 6, minY = Math.min(...ys) - 6, l = Math.max(...xs) - minX + 6, h = Math.max(...ys) - minY + 6;
  const s = svg("svg", { viewBox: `${minX} ${minY} ${l} ${h}`, width: l, height: h, class: "cubes", role: "img", "aria-label": "Assemblage de cubes" });
  const cubes = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) for (let z = 0; z < H[r][c]; z++) cubes.push([r, c, z]);
  cubes.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]) || p[2] - q[2]);
  const poly = (pts, classe) => s.append(svg("polygon", { points: pts.map(([x, y]) => `${x},${y}`).join(" "), class: classe }));
  for (const [r, c, z] of cubes) {
    const p = (dr, dc, dz) => [X(r + dr, c + dc), Y(r + dr, c + dc, z + dz)];
    poly([p(0, 0, 1), p(0, 1, 1), p(1, 1, 1), p(1, 0, 1)], "cube-dessus");
    poly([p(1, 0, 0), p(1, 1, 0), p(1, 1, 1), p(1, 0, 1)], "cube-gauche");
    poly([p(0, 1, 0), p(1, 1, 0), p(1, 1, 1), p(0, 1, 1)], "cube-droite");
  }
  return s;
}
/* Un « escalier » : les colonnes du fond sont les plus hautes, toutes les faces du dessus sont visibles */
function escalier(R, C, max) {
  const H = [...Array(R)].map(() => Array(C).fill(0));
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const lim = Math.min(r ? H[r - 1][c] : max, c ? H[r][c - 1] : max);
    H[r][c] = alea(Math.max(1, lim - 1), lim);
  }
  return H;
}

/* Un problème en plusieurs questions */
function probleme(enonce, etapes, indice) {
  const numeroter = etapes.length > 1;
  return {
    consigne: enonce,
    classeLigne: "etapes",
    ligne: etapes.map((e, k) => `<div class="etape-pb"><p>${numeroter ? k + 1 + ". " : ""}${e.q}</p><p class="rep">[d] ${e.unite || ""}</p></div>`).join(""),
    verifier(v) {
      const res = etapes.map((e, k) => verifierNombre(v[k], e.r));
      if (res.some(r => r.etat === "incomplet")) return { etat: "incomplet", message: "Réponds à chaque question." };
      const fausses = res.map((r, k) => r.etat === "faux" ? k + 1 : 0).filter(Boolean);
      return fausses.length ? { etat: "faux", message: numeroter ? `Revois ${fausses.length > 1 ? "les questions " + fausses.join(" et ") : "la question " + fausses[0]}.` : "" } : { etat: "juste" };
    },
    indice,
    correction: etapes.map((e, k) => (numeroter ? k + 1 + ". " : "") + e.c).join("<br>")
  };
}

const UNITES = ["mm", "cm", "dm", "m"];

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "aire-comptage",
    titre: "Aire par comptage",
    description: "Compter les carreaux et les demi-carreaux.",
    generer() {
      const cols = 10, lignes = 7, q = quadrillage(cols, lignes, 30);
      const cells = polyomino(alea(5, 12), cols, lignes), demis = ajouterDemis(cells, alea(0, 4), cols, lignes);
      dessinerFigure(q, cells, demis);
      const aire = cells.size + demis.length / 2;
      return {
        consigne: "Quelle est l'aire de cette figure, en carreaux ?",
        figure: q.svg,
        ligne: "[d] carreaux",
        verifier: v => verifierNombre(v[0], aire),
        indice: "Compte les carreaux entiers, puis les demi-carreaux : deux demi-carreaux font un carreau.",
        correction: `${cells.size} carreaux entiers${demis.length ? ` et ${demis.length} demi-carreaux (${nb(demis.length / 2)} carreau${demis.length > 2 ? "x" : ""})` : ""} : ${nb(aire)} carreaux.`
      };
    }
  },

  {
    groupe: F1,
    id: "aire-perimetre",
    titre: "Aire et périmètre",
    description: "Deux grandeurs différentes.",
    generer() {
      const cols = 10, lignes = 7, q = quadrillage(cols, lignes, 30);
      const cells = polyomino(alea(5, 11), cols, lignes);
      dessinerFigure(q, cells);
      const a = cells.size, p = perimetre(cells);
      return {
        consigne: "Le côté d'un carreau est l'unité de longueur ; le carreau est l'unité d'aire. Donne l'aire et le périmètre de la figure.",
        figure: q.svg,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p class="rep">Aire : [n] carreaux</p></div><div class="etape-pb"><p class="rep">Périmètre : [n] unités</p></div>`,
        verifier(v) {
          const r = [verifierNombre(v[0], a), verifierNombre(v[1], p)];
          if (r.some(x => x.etat === "incomplet")) return { etat: "incomplet", message: "Complète les deux cases." };
          if (r[0].etat === "faux" && lireNombre(v[0]) === p) return { etat: "faux", message: "Tu as échangé : l'aire, c'est la surface (on compte les carreaux) ; le périmètre, c'est le tour (on compte les côtés)." };
          return r.every(x => x.etat === "juste") ? { etat: "juste" } : { etat: "faux", message: r[0].etat === "faux" ? "Recompte les carreaux." : "Fais le tour de la figure en comptant chaque côté de carreau." };
        },
        indice: "Aire : le nombre de carreaux à l'intérieur. Périmètre : le nombre de côtés de carreaux sur le bord.",
        correction: `Aire : ${a} carreaux ; périmètre : ${p} unités.`
      };
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "unite-aire",
    titre: "Choisir l'unité d'aire",
    description: "mm², cm², m² ou km² ?",
    generer() {
      const [t, r] = choisir([
        ["L'aire d'un timbre-poste : 6…", "cm²"], ["L'aire d'une salle de classe : 60…", "m²"], ["L'aire de la France : 550 000…", "km²"], ["L'aire de l'ongle du petit doigt : 50…", "mm²"],
        ["L'aire d'une page de cahier : 500…", "cm²"], ["L'aire d'un terrain de football : 7 000…", "m²"], ["L'aire d'une ville : 105…", "km²"], ["L'aire d'une tête d'épingle : 2…", "mm²"]
      ]);
      const options = ["mm²", "cm²", "m²", "km²"];
      return {
        consigne: `Choisis l'unité adaptée : <strong>${t}</strong>`,
        choix: options.map(o => o.replace("²", "<sup>2</sup>")),
        verifier: (v, c) => ({ etat: c === r.replace("²", "<sup>2</sup>") ? "juste" : "faux" }),
        indice: "1 cm² est l'aire d'un carré de 1 cm de côté (à peu près un ongle de doigt), 1 m² celle d'un carré de 1 m de côté.",
        correction: `${t.replace("…", "")} ${r.replace("²", "<sup>2</sup>")}.`
      };
    }
  },

  {
    groupe: F2,
    id: "convertir-aires",
    titre: "Convertir des aires",
    description: "D'une unité à l'unité voisine : × 100 ou ÷ 100.",
    generer() {
      const i = alea(0, 3); let j; do { j = alea(0, 3); } while (j === i || Math.abs(i - j) > 2);
      const x = choisir([alea(1, 99), tirer(0.5, 50, 1), tirer(1, 9, 2), alea(100, 9000)]);
      const r = rr(x * 100 ** (i - j));
      return {
        consigne: "Convertis.",
        ligne: `${nb(x)} ${m2(UNITES[i])} = [d] ${m2(UNITES[j])}`,
        verifier(v) {
          const res = verifierNombre(v[0], r);
          if (res.etat === "faux" && Math.abs(lireNombre(v[0]) - rr(x * 10 ** (i - j))) < 1e-9) res.message = "Pour les aires, on multiplie ou on divise par 100 (et non par 10) d'une unité à la suivante.";
          return res;
        },
        indice: `1 ${m2("m")} = 100 ${m2("dm")} ; 1 ${m2("dm")} = 100 ${m2("cm")} ; 1 ${m2("cm")} = 100 ${m2("mm")}.`,
        correction: `${nb(x)} ${m2(UNITES[i])} = ${nb(x)} ${i > j ? "×" : "÷"} ${nb(100 ** Math.abs(i - j))} ${m2(UNITES[j])} = ${nb(r)} ${m2(UNITES[j])}.`
      };
    }
  },

  {
    groupe: F2,
    id: "comparer-aires",
    titre: "Comparer des aires",
    description: "On convertit dans la même unité.",
    generer() {
      const i = alea(1, 3), x = choisir([alea(1, 9), tirer(1, 5, 1)]);
      const y = rr(x * 100 * choisir([0.9, 1, 1.1, 0.5, 2]));
      const s = x * 100 < y ? "<" : x * 100 > y ? ">" : "=";
      return {
        consigne: "Complète par &lt;, = ou &gt;.",
        ligne: `${nb(x)} ${m2(UNITES[i])} [c] ${nb(y)} ${m2(UNITES[i - 1])}`,
        choix: ["<", "=", ">"],
        verifier: (v, c) => ({ etat: c === s ? "juste" : "faux" }),
        indice: `Convertis ${nb(x)} ${m2(UNITES[i])} en ${m2(UNITES[i - 1])} : × 100.`,
        correction: `${nb(x)} ${m2(UNITES[i])} = ${nb(x * 100)} ${m2(UNITES[i - 1])}, donc ${nb(x)} ${m2(UNITES[i])} ${s === "<" ? "&lt;" : s === ">" ? "&gt;" : "="} ${nb(y)} ${m2(UNITES[i - 1])}.`
      };
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: F3,
    id: "aire-rectangle",
    titre: "Aire d'un rectangle ou d'un carré",
    description: "L × ℓ, ou c × c.",
    generer() {
      if (Math.random() < 0.35) {
        const c = choisir([alea(2, 15), tirer(1.5, 9.5, 1)]), u = choisir(["cm", "m", "dm"]);
        return { consigne: `Calcule l'aire d'un carré de ${nb(c)} ${u} de côté.`, ligne: `[d] ${m2(u)}`, verifier: v => { const r = verifierNombre(v[0], c * c); if (r.etat === "faux" && Math.abs(lireNombre(v[0]) - 4 * c) < 1e-9) r.message = "Tu as calculé le périmètre (4 × c). L'aire, c'est c × c."; return r; }, indice: "Aire du carré = côté × côté.", correction: `${nb(c)} × ${nb(c)} = ${nb(c * c)} ${m2(u)}.` };
      }
      const L = choisir([alea(3, 20), tirer(2, 12, 1)]), l = choisir([alea(2, 9), tirer(1.5, 6, 1)]), u = choisir(["cm", "m"]);
      return {
        consigne: `Calcule l'aire d'un rectangle de ${nb(L)} ${u} de long et ${nb(l)} ${u} de large.`,
        ligne: `[d] ${m2(u)}`,
        verifier(v) { const r = verifierNombre(v[0], L * l); if (r.etat === "faux" && Math.abs(lireNombre(v[0]) - 2 * (L + l)) < 1e-9) r.message = "Tu as calculé le périmètre. L'aire, c'est L × ℓ."; return r; },
        indice: "Aire du rectangle = longueur × largeur.",
        correction: `${nb(L)} × ${nb(l)} = ${nb(L * l)} ${m2(u)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "meme-unite",
    titre: "Attention aux unités !",
    description: "Les longueurs doivent être dans la même unité.",
    generer() {
      const L = alea(2, 6), lcm = choisir([20, 25, 40, 50, 60, 75, 80]);
      const enCm = Math.random() < 0.5;
      const r = enCm ? L * 100 * lcm : rr(L * lcm / 100);
      return {
        consigne: `Un rectangle mesure ${L} m de long et ${lcm} cm de large. Calcule son aire en ${enCm ? m2("cm") : m2("m")}.`,
        ligne: `[d] ${enCm ? m2("cm") : m2("m")}`,
        verifier(v) { const res = verifierNombre(v[0], r); if (res.etat === "faux" && lireNombre(v[0]) === L * lcm) res.message = `${L} × ${lcm} mélange des mètres et des centimètres : convertis d'abord une des longueurs.`; return res; },
        indice: enCm ? `${L} m = ${L * 100} cm.` : `${lcm} cm = ${nb(lcm / 100)} m.`,
        correction: enCm ? `${L} m = ${L * 100} cm ; ${L * 100} × ${lcm} = ${nb(r)} ${m2("cm")}.` : `${lcm} cm = ${nb(lcm / 100)} m ; ${L} × ${nb(lcm / 100)} = ${nb(r)} ${m2("m")}.`
      };
    }
  },

  {
    groupe: F3,
    id: "perimetre-vers-aire",
    titre: "Du périmètre à l'aire",
    description: "Retrouver le côté, puis calculer l'aire.",
    generer() {
      if (Math.random() < 0.5) {
        const c = alea(2, 15);
        return probleme(`Un carré a un périmètre de ${4 * c} cm.`, [{ q: "Quelle est la longueur de son côté ?", r: c, unite: "cm", c: `${4 * c} ÷ 4 = ${c} cm` }, { q: "Quelle est son aire ?", r: c * c, unite: m2("cm"), c: `${c} × ${c} = ${c * c} ${m2("cm")}` }], "Le périmètre du carré, c'est 4 fois son côté.");
      }
      const L = alea(4, 12), l = alea(2, L - 1);
      return probleme(`Un rectangle a un périmètre de ${2 * (L + l)} cm et une longueur de ${L} cm.`, [{ q: "Quelle est sa largeur ?", r: l, unite: "cm", c: `(${2 * (L + l)} − 2 × ${L}) ÷ 2 = ${l} cm` }, { q: "Quelle est son aire ?", r: L * l, unite: m2("cm"), c: `${L} × ${l} = ${L * l} ${m2("cm")}` }], "Le périmètre, c'est 2 longueurs + 2 largeurs.");
    }
  },

  {
    groupe: F3,
    id: "plus-grand-terrain",
    titre: "Quel terrain est le plus grand ?",
    description: "Comparer les aires (et pas les périmètres).",
    generer() {
      let c, L, l; do { c = alea(10, 40); L = alea(15, 60); l = alea(8, L - 2); } while (c * c === L * l || (c * c > L * l) === (4 * c > 2 * (L + l)) && Math.random() < 0.6);
      const bon = c * c > L * l ? "Le terrain carré" : "Le terrain rectangulaire";
      return {
        consigne: `Un terrain carré a ${c} m de côté. Un terrain rectangulaire mesure ${L} m sur ${l} m. Lequel a la plus grande aire ?`,
        choix: ["Le terrain carré", "Le terrain rectangulaire"],
        verifier: (v, ch) => ({ etat: ch === bon ? "juste" : "faux", message: "Calcule les deux aires (et pas les périmètres)." }),
        indice: "Calcule l'aire de chaque terrain.",
        correction: `Carré : ${c} × ${c} = ${nb(c * c)} ${m2("m")} ; rectangle : ${L} × ${l} = ${nb(L * l)} ${m2("m")}. ${bon} est le plus grand.`
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "problemes-aires",
    titre: "Problèmes d'aires",
    description: "Peinture, carrelage, gazon, terrain…",
    generer() {
      const P = choisir([
        () => { const L = choisir([4, 5, 6]), h = choisir([2.5, 2.4, 3]), pl = 0.8, ph = 2, pot = choisir([10, 5]); const mur = rr(L * h), porte = rr(pl * ph), a = rr(mur - porte);
          return [`Sami veut peindre un mur de ${L} m de long et ${nb(h)} m de haut, dans lequel se trouve une porte de ${nb(pl)} m sur ${ph} m. Un pot de peinture permet de peindre ${pot} ${m2("m")}.`,
            [{ q: "Quelle est l'aire à peindre ?", r: a, unite: m2("m"), c: `${L} × ${nb(h)} − ${nb(pl)} × ${ph} = ${nb(mur)} − ${nb(porte)} = ${nb(a)} ${m2("m")}` }, { q: "Combien de pots doit-il acheter ?", r: Math.ceil(a / pot), unite: "pots", c: `${nb(a)} ÷ ${pot} = ${nb(rr(a / pot))} : il faut ${Math.ceil(a / pot)} pots` }]]; },
        () => { const L = alea(2, 5), l = alea(2, 4), c = choisir([20, 25, 50]); const n = (L * 100 / c) * (l * 100 / c);
          return [`On veut carreler le sol d'une pièce rectangulaire de ${L} m sur ${l} m avec des carreaux carrés de ${c} cm de côté.`,
            [{ q: "Combien de carreaux faut-il ?", r: n, unite: "carreaux", c: `Sur la longueur : ${L * 100} ÷ ${c} = ${L * 100 / c} ; sur la largeur : ${l * 100} ÷ ${c} = ${l * 100 / c} ; ${L * 100 / c} × ${l * 100 / c} = ${n} carreaux` }]]; },
        () => { const L = alea(10, 15), l = alea(6, 9), c = alea(2, 4), sachet = 25; const g = L * l - c * c;
          return [`Un jardin rectangulaire mesure ${L} m sur ${l} m. On y aménage un potager carré de ${c} m de côté ; le reste est semé de gazon. Un sachet de graines permet de semer ${sachet} ${m2("m")}.`,
            [{ q: "Quelle est l'aire semée de gazon ?", r: g, unite: m2("m"), c: `${L} × ${l} − ${c} × ${c} = ${L * l} − ${c * c} = ${g} ${m2("m")}` }, { q: "Combien de sachets faut-il ?", r: Math.ceil(g / sachet), unite: "sachets", c: `${g} ÷ ${sachet} = ${nb(rr(g / sachet))} : ${Math.ceil(g / sachet)} sachets` }]]; },
        () => { const L = alea(12, 25), l = alea(10, 20), p = choisir([65, 80, 85, 120, 150]);
          return [`Un terrain à bâtir rectangulaire mesure ${L} m sur ${l} m. Il est vendu ${p} € le mètre carré.`,
            [{ q: "Quelle est son aire ?", r: L * l, unite: m2("m"), c: `${L} × ${l} = ${L * l} ${m2("m")}` }, { q: "Quel est son prix ?", r: L * l * p, unite: "€", c: `${L * l} × ${p} = ${nb(L * l * p)} €` }]]; },
        () => { const L = 6, l = 4, a = choisir([2, 1.5, 2.5]), b = choisir([1.5, 1, 2]);
          return [`Une affiche rectangulaire mesure 60 cm sur 40 cm. On colle au centre une photo de ${nb(a)} dm sur ${nb(b)} dm.`,
            [{ q: `Quelle aire de l'affiche reste visible, en ${m2("dm")} ?`, r: rr(L * l - a * b), unite: m2("dm"), c: `60 cm = 6 dm et 40 cm = 4 dm ; 6 × 4 − ${nb(a)} × ${nb(b)} = 24 − ${nb(a * b)} = ${nb(L * l - a * b)} ${m2("dm")}` }]]; }
      ])();
      return probleme(P[0], P[1], "Fais un schéma, découpe en rectangles, et vérifie que les longueurs sont dans la même unité.");
    }
  },

  /* ================= Feuille 5 ================= */

  {
    groupe: F5,
    id: "compter-cubes",
    titre: "Combien de cubes ?",
    description: "Penser aux cubes cachés.",
    generer() {
      const H = escalier(alea(2, 3), alea(2, 3), alea(2, 3));
      const n = H.flat().reduce((a, b) => a + b, 0);
      const visibles = H.length * H[0].length; // une colonne par case du sol
      return {
        consigne: "Combien de cubes contient cet assemblage ? (Les cubes sont posés les uns sur les autres : il n'y a pas de trou.)",
        figure: assemblage(H),
        ligne: "[n] cubes",
        verifier(v) { const r = verifierNombre(v[0], n); if (r.etat === "faux" && lireNombre(v[0]) < n) r.message = "N'oublie pas les cubes cachés, sous les cubes du dessus et derrière."; return r; },
        indice: "Compte colonne par colonne : chaque colonne va jusqu'au sol.",
        correction: `Hauteurs des colonnes : ${H.map(l => l.join(" + ")).join(" + ")} = ${n} cubes (${visibles} colonnes).`
      };
    }
  },

  {
    groupe: F5,
    id: "grand-cube",
    titre: "Le grand cube",
    description: "Des petits cubes pour faire un grand cube.",
    generer() {
      const k = alea(2, 5);
      const cas = Math.random() < 0.6;
      if (cas) return {
        consigne: `On assemble des petits cubes pour former un grand cube de ${k} petits cubes d'arête. Combien de petits cubes faut-il ?`,
        figure: assemblage([...Array(k)].map(() => Array(k).fill(k)), k > 3 ? 20 : 26),
        ligne: "[n] petits cubes",
        verifier: v => verifierNombre(v[0], k ** 3),
        indice: `Une couche contient ${k} × ${k} cubes ; il y a ${k} couches.`,
        correction: `${k} × ${k} × ${k} = ${k ** 3} petits cubes.`
      };
      return {
        consigne: `Un grand cube de ${k + 1} petits cubes d'arête est peint à l'extérieur. Combien de petits cubes n'ont aucune face peinte ?`,
        figure: assemblage([...Array(k + 1)].map(() => Array(k + 1).fill(k + 1)), 22),
        ligne: "[n] petits cubes",
        verifier: v => verifierNombre(v[0], (k - 1) ** 3),
        indice: "Les cubes sans peinture forment un cube plus petit, à l'intérieur : on enlève une épaisseur de chaque côté.",
        correction: `Le cube intérieur a ${k + 1} − 2 = ${k - 1} cubes d'arête : ${k - 1} × ${k - 1} × ${k - 1} = ${(k - 1) ** 3}.`
      };
    }
  },

  /* ================= Feuille 6 ================= */

  {
    groupe: F6,
    id: "volume-pave",
    titre: "Le volume d'un pavé",
    description: "Une couche, puis le nombre de couches.",
    generer() {
      const L = alea(2, 5), P = alea(2, 4), h = alea(2, 4);
      const dessin = L * P * h <= 48;
      return {
        consigne: dessin ? "Les cubes ont 1 cm d'arête. Quel est le volume de ce pavé ?" : `Une boîte en forme de pavé mesure ${L} cm de long, ${P} cm de large et ${h} cm de haut. Quel est son volume ?`,
        figure: dessin ? assemblage([...Array(P)].map(() => Array(L).fill(h)), 26) : undefined,
        ligne: `[n] ${m3("cm")}`,
        verifier: v => verifierNombre(v[0], L * P * h),
        indice: "Compte les cubes d'une couche (longueur × largeur), puis multiplie par le nombre de couches.",
        correction: `Une couche : ${L} × ${P} = ${L * P} cubes ; ${h} couches : ${L * P} × ${h} = ${L * P * h} ${m3("cm")}.`
      };
    }
  },

  {
    groupe: F6,
    id: "cubes-manquants",
    titre: "Compléter un pavé",
    description: "Combien de cubes faut-il ajouter ?",
    generer() {
      const R = alea(2, 3), C = alea(2, 3), Hm = alea(2, 3);
      const H = escalier(R, C, Hm);
      const n = H.flat().reduce((a, b) => a + b, 0), tot = R * C * Hm;
      if (n === tot) return this.generer();
      return {
        consigne: `Combien de cubes faut-il ajouter pour obtenir un pavé complet de ${C} cubes de long, ${R} de profondeur et ${Hm} de haut ?`,
        figure: assemblage(H),
        ligne: "[n] cubes",
        verifier: v => verifierNombre(v[0], tot - n),
        indice: `Le pavé complet contient ${C} × ${R} × ${Hm} cubes. Compte ceux qui sont déjà là.`,
        correction: `Pavé complet : ${tot} cubes ; il y en a ${n} ; il faut en ajouter ${tot - n}.`
      };
    }
  },

  {
    groupe: F6,
    id: "dimension-manquante",
    titre: "Une dimension manquante",
    description: "Connaissant le volume et deux dimensions.",
    generer() {
      const L = alea(2, 6), P = alea(2, 5), h = alea(2, 6), V = L * P * h;
      return {
        consigne: `Avec ${V} cubes de 1 cm d'arête, Tom construit un pavé (sans trou) de ${L} cubes de long et ${P} cubes de large. Quelle est sa hauteur ?`,
        ligne: "[n] cubes",
        verifier: v => verifierNombre(v[0], h),
        indice: `Une couche contient ${L} × ${P} cubes.`,
        correction: `Une couche : ${L * P} cubes ; ${V} ÷ ${L * P} = ${h} couches.`
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
    { competence: "Mesurer une aire par comptage", activites: ["aire-comptage"] },
    { competence: "Distinguer aire et périmètre", activites: ["aire-perimetre"] },
    { competence: "Les unités d'aire", activites: ["unite-aire", "comparer-aires"] },
    { competence: "Convertir des aires", activites: ["convertir-aires"] },
    { competence: "Aire du carré et du rectangle", activites: ["aire-rectangle", "meme-unite"] },
    { competence: "Raisonner avec les aires", activites: ["perimetre-vers-aire", "plus-grand-terrain"] },
    { competence: "Résoudre un problème d'aires", activites: ["problemes-aires"] },
    { competence: "Compter des cubes", activites: ["compter-cubes", "grand-cube"] },
    { competence: "Volume d'un pavé", activites: ["volume-pave"] },
    { competence: "Raisonner avec les volumes", activites: ["cubes-manquants", "dimension-manquante"] }
  ]
};
