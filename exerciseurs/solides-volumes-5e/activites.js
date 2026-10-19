/* =====================================================================
   EXERCISEUR « SOLIDES ET VOLUMES » — 5e, chapitre 12

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Solides et perspective";
const F2 = "Feuille 2 — Patrons";
const F3 = "Feuille 3 — Aire d'un disque";
const F4 = "Feuille 4 — Volumes et capacités";
const F5 = "Feuille 5 — Volume du pavé et du prisme";
const F6 = "Feuille 6 — Volume du cylindre, problèmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const arr1 = x => Math.round(x * 10) / 10;
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const PI = "π";

/* ---------- Cubes en perspective (même dessin qu'en 6e) ----------
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
/* Un « escalier » : les colonnes du fond sont les plus hautes, tous les cubes se devinent */
function escalier(R, C, max) {
  const H = [...Array(R)].map(() => Array(C).fill(0));
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const lim = Math.min(r ? H[r - 1][c] : max, c ? H[r][c - 1] : max);
    H[r][c] = alea(Math.max(1, lim - 1), lim);
  }
  return H;
}

/* ---------- Patrons de cube ---------- */
const PATRONS_OK = [
  "0,0 1,0 2,0 3,0 0,1 0,-1", "0,0 1,0 2,0 3,0 0,-1 1,1", "0,0 1,0 2,0 3,0 0,-1 2,1", "0,0 1,0 2,0 3,0 0,-1 3,1",
  "0,0 1,0 2,0 3,0 1,-1 1,1", "0,0 1,0 2,0 3,0 1,-1 2,1", "0,0 1,0 2,0 2,1 3,1 0,-1", "0,0 1,0 2,0 2,1 3,1 1,-1",
  "0,0 1,0 2,0 2,1 3,1 2,-1", "0,0 1,0 1,1 2,1 2,2 3,2", "0,0 1,0 2,0 2,1 3,1 4,1"
];
const PATRONS_NON = [
  "0,0 1,0 2,0 0,1 1,1 2,1", "0,0 1,0 2,0 3,0 4,0 1,1", "0,0 1,0 2,0 3,0 0,1 3,1", "0,0 1,0 2,0 3,0 1,1 1,-1 2,-1",
  "0,0 1,0 2,0 3,0 0,-1 0,1 1,1", "0,0 1,0 0,1 1,1 2,1 3,1", "0,0 1,0 2,0 3,0 1,-1 2,-1", "0,0 1,0 2,0 1,1 1,-1 1,2 1,-2",
  "0,0 1,0 2,0 3,0 0,1 1,1", "0,0 1,0 2,0 3,0 1,1 3,1", "0,0 1,0 2,0 3,0 0,1 2,1"
].filter(p => p.split(" ").length === 6);
function dessinPatron(cases, pas = 30) {
  let pts = cases.split(" ").map(c => c.split(",").map(Number));
  // rotation / symétrie au hasard
  const t = alea(0, 3), sym = Math.random() < 0.5;
  pts = pts.map(([x, y]) => { let p = [x, y]; for (let k = 0; k < t; k++) p = [-p[1], p[0]]; return sym ? [-p[0], p[1]] : p; });
  const mx = Math.min(...pts.map(p => p[0])), my = Math.min(...pts.map(p => p[1]));
  const W = (Math.max(...pts.map(p => p[0])) - mx + 1) * pas + 8, Hh = (Math.max(...pts.map(p => p[1])) - my + 1) * pas + 8;
  const s = svg("svg", { viewBox: `-4 -4 ${W} ${Hh}`, width: W, height: Hh, class: "fig-aire", role: "img", "aria-label": "Patron" });
  for (const [x, y] of pts) s.append(svg("rect", { x: (x - mx) * pas, y: (y - my) * pas, width: pas, height: pas, class: "aire-case" }));
  return s;
}

/* Un problème en plusieurs questions (réponses décimales) */
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

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "faces-aretes",
    titre: "Faces, arêtes, sommets",
    description: "Pavé, cube, prismes.",
    generer() {
      const [nom, n] = choisir([["un pavé droit", 4], ["un cube", 4], ["un prisme droit à base triangulaire", 3], ["un prisme droit à base pentagonale (5 côtés)", 5], ["un prisme droit à base hexagonale (6 côtés)", 6]]);
      const [quoi, val, expl] = choisir([["faces", n + 2, `${n} faces latérales + 2 bases`], ["arêtes", 3 * n, `${n} arêtes sur chaque base + ${n} arêtes latérales`], ["sommets", 2 * n, `${n} sommets sur chaque base`]]);
      return {
        consigne: `Combien ${nom} a-t-il de <strong>${quoi}</strong> ?`,
        ligne: `[n] ${quoi}`,
        verifier: v => verifierNombre(v[0], val),
        indice: "Imagine le solide : compte ce qu'il y a sur la base du dessous, sur celle du dessus, puis entre les deux.",
        correction: `${val} ${quoi} : ${expl}.`
      };
    }
  },

  {
    groupe: F1,
    id: "compter-cubes",
    titre: "Compter des cubes",
    description: "Empilements de petits cubes.",
    generer() {
      const H = escalier(alea(2, 3), alea(2, 3), alea(2, 3)), n = H.flat().reduce((a, b) => a + b, 0);
      return {
        consigne: "Combien de petits cubes forment cet assemblage ? (Il n'y a pas de trou caché.)",
        figure: assemblage(H, 30),
        ligne: "[n] cubes",
        verifier: v => verifierNombre(v[0], n),
        indice: "Compte colonne par colonne : chaque colonne va jusqu'au sol.",
        correction: `Par colonnes : ${H.flat().join(" + ")} = ${n} cubes.`
      };
    }
  },

  {
    groupe: F1,
    id: "perspective",
    titre: "Règles de la perspective cavalière",
    description: "Vrai ou faux ?",
    generer() {
      const [aff, vrai, expl] = choisir([
        ["La face avant est dessinée en vraie grandeur.", true, "c'est la règle"],
        ["Les arêtes cachées sont dessinées en pointillés.", true, "c'est la règle"],
        ["Des arêtes parallèles dans la réalité restent parallèles sur le dessin.", true, "c'est la règle"],
        ["Toutes les faces d'un cube sont dessinées comme des carrés.", false, "les faces de côté et du dessus deviennent des parallélogrammes"],
        ["Les fuyantes ont la même longueur que dans la réalité.", false, "elles sont en général réduites (souvent de moitié)"],
        ["Les angles droits restent toujours droits sur le dessin.", false, "seuls ceux de la face avant (et arrière) restent droits"],
        ["Des arêtes de même longueur dans la réalité ont toujours la même longueur sur le dessin.", false, "les fuyantes sont raccourcies"]
      ]);
      return {
        consigne: `Perspective cavalière : « ${aff} »`,
        choix: ["Vrai", "Faux"], verifier: choixVerif(vrai ? "Vrai" : "Faux"),
        indice: "La face avant est en vraie grandeur ; les fuyantes sont obliques et raccourcies ; le parallélisme est conservé.",
        correction: `${vrai ? "Vrai" : "Faux"} : ${expl}.`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "patron-cube",
    titre: "Patron de cube ou pas ?",
    description: "Imaginer le pliage.",
    generer() {
      const ok = Math.random() < 0.5, p = choisir(ok ? PATRONS_OK : PATRONS_NON);
      return {
        consigne: "Cette figure est-elle un patron de cube ?",
        figure: dessinPatron(p),
        choix: ["Oui", "Non"], verifier: choixVerif(ok ? "Oui" : "Non"),
        indice: "Choisis une face comme fond et replie les autres autour : deux faces ne doivent pas se superposer. Plus de 4 carrés alignés : impossible !",
        correction: ok ? "Oui : en pliant, on obtient les 6 faces sans chevauchement." : "Non : en pliant, deux carrés viennent au même endroit (et une face manque)."
      };
    }
  },

  {
    groupe: F2,
    id: "patron-solide",
    titre: "Quel solide ?",
    description: "Reconnaître un solide d'après son patron.",
    generer() {
      const [desc, bonne] = choisir([
        ["deux disques identiques et un rectangle", "un cylindre"],
        ["six carrés identiques", "un cube"],
        ["six rectangles, identiques deux à deux", "un pavé droit"],
        ["deux triangles identiques et trois rectangles", "un prisme droit à base triangulaire"],
        ["deux hexagones identiques et six rectangles", "un prisme droit à base hexagonale"]
      ]);
      const autres = ["un cylindre", "un cube", "un pavé droit", "un prisme droit à base triangulaire", "un prisme droit à base hexagonale"].filter(x => x !== bonne);
      return {
        consigne: `Un patron est formé de ${desc}. De quel solide s'agit-il ?`,
        choix: melanger([bonne, ...melanger(autres).slice(0, 2)]), verifier: choixVerif(bonne),
        indice: "Les deux faces identiques « isolées » sont les bases ; les rectangles forment les faces latérales.",
        correction: `C'est ${bonne}.`
      };
    }
  },

  {
    groupe: F2,
    id: "patron-cylindre",
    titre: "Le rectangle du patron du cylindre",
    description: "Sa longueur est 2 × π × r.",
    generer() {
      const r = choisir([1, 1.5, 2, 2.5, 3, 4, 5, 6]), h = alea(3, 12), diam = Math.random() < 0.3;
      const L = arr1(2 * Math.PI * r);
      return {
        consigne: `Un cylindre a pour ${diam ? "diamètre " + nb(2 * r) : "rayon " + nb(r)} cm et pour hauteur ${h} cm. Quelle est la longueur du rectangle de son patron (arrondie au dixième) ?`,
        ligne: "[d] cm",
        verifier: v => verifierNombre(v[0], L),
        indice: "Le rectangle s'enroule autour du disque de base : sa longueur est le périmètre du cercle, 2 × π × r.",
        correction: `${diam ? `Rayon : ${nb(r)} cm. ` : ""}2 × π × ${nb(r)} ≈ ${nb(L)} cm.`
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "aire-disque",
    titre: "Aire d'un disque",
    description: "π × r², arrondi au dixième.",
    generer() {
      const r = choisir([1, 2, 3, 4, 5, 6, 7, 8, 10, 1.5, 2.5, 0.5, 12]), diam = Math.random() < 0.35, u = choisir(["cm", "m", "dm"]);
      const A = arr1(Math.PI * r * r);
      return {
        consigne: `Calcule l'aire d'un disque de ${diam ? "diamètre " + nb(2 * r) : "rayon " + nb(r)} ${u} (arrondie au dixième).`,
        ligne: `[d] ${u}²`,
        verifier(v) {
          const x = lireNombre(v[0]);
          if (!isNaN(x) && diam && Math.abs(x - arr1(Math.PI * 4 * r * r)) < 1e-9) return { etat: "faux", message: "Attention : il faut utiliser le rayon, pas le diamètre." };
          if (!isNaN(x) && Math.abs(x - arr1(2 * Math.PI * r)) < 1e-9) return { etat: "faux", message: "Tu as calculé le périmètre 2 × π × r. L'aire, c'est π × r × r." };
          return verifierNombre(v[0], A);
        },
        indice: diam ? "Le rayon est la moitié du diamètre. Puis aire = π × r × r." : "Aire = π × r × r (touche π de la calculatrice).",
        correction: `${diam ? `r = ${nb(r)} ${u}. ` : ""}π × ${nb(r)}² = ${nb(rr(r * r))}π ≈ ${nb(A)} ${u}²`
      };
    }
  },

  {
    groupe: F3,
    id: "aire-portion",
    titre: "Demi-disque, quart de disque",
    description: "Une partie de l'aire du disque.",
    generer() {
      const r = alea(2, 10), [nom, k] = choisir([["un demi-disque", 2], ["un quart de disque", 4], ["un demi-disque", 2]]);
      const A = arr1(Math.PI * r * r / k);
      return {
        consigne: `Calcule l'aire d'${nom} de rayon ${r} cm (arrondie au dixième).`,
        ligne: "[d] cm²",
        verifier: v => verifierNombre(v[0], A),
        indice: `Calcule l'aire du disque entier, puis divise par ${k}.`,
        correction: `π × ${r}² ÷ ${k} = ${nb(r * r / k)}π ≈ ${nb(A)} cm²`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "convertir-volumes",
    titre: "Convertir des volumes",
    description: "m³, dm³, cm³, mm³ : × 1 000.",
    generer() {
      const U = ["m³", "dm³", "cm³", "mm³"], i = alea(0, 2), haut = Math.random() < 0.5;
      const [a, b] = haut ? [i, i + 1] : [i + 1, i];
      const x = choisir([alea(2, 9), alea(11, 95) / 10, alea(101, 999) / 100, alea(15, 950)]);
      const res = rr(haut ? x * 1000 : x / 1000);
      return {
        consigne: `Convertis : <strong>${nb(x)} ${U[a]}</strong> en ${U[b]}.`,
        ligne: `${nb(x)} ${U[a]} = [d] ${U[b]}`,
        verifier: v => verifierNombre(v[0], res),
        indice: "Entre deux unités de volume voisines, on multiplie ou on divise par 1 000 (et non par 10).",
        correction: `${nb(x)} ${U[a]} = ${nb(x)} ${haut ? "×" : "÷"} 1 000 = ${nb(res)} ${U[b]}`
      };
    }
  },

  {
    groupe: F4,
    id: "convertir-capacites",
    titre: "Volumes et capacités",
    description: "1 dm³ = 1 L, 1 cm³ = 1 mL.",
    generer() {
      const x = choisir([alea(2, 9), alea(12, 95) / 10, alea(120, 950)]);
      const [de, vers, f] = choisir([
        ["dm³", "L", 1], ["L", "dm³", 1], ["cm³", "mL", 1], ["mL", "cm³", 1], ["m³", "L", 1000], ["L", "m³", 0.001],
        ["cm³", "L", 0.001], ["L", "cm³", 1000], ["cL", "cm³", 10], ["dm³", "mL", 1000], ["cm³", "cL", 0.1]
      ]);
      const res = rr(x * f);
      return {
        consigne: `Convertis : <strong>${nb(x)} ${de}</strong> en ${vers}.`,
        ligne: `${nb(x)} ${de} = [d] ${vers}`,
        verifier: v => verifierNombre(v[0], res),
        indice: "1 dm³ = 1 L ; 1 cm³ = 1 mL ; 1 m³ = 1 000 L ; 1 L = 100 cL = 1 000 mL.",
        correction: `${nb(x)} ${de} = ${nb(res)} ${vers}`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "volume-pave",
    titre: "Volume d'un pavé ou d'un cube",
    description: "L × ℓ × h, a³",
    generer() {
      if (Math.random() < 0.3) {
        const a = choisir([2, 3, 4, 5, 6, 10, 1.5, 0.5]);
        return { consigne: `Calcule le volume d'un cube d'arête ${nb(a)} cm.`, ligne: "[d] cm³",
          verifier: v => verifierNombre(v[0], rr(a ** 3)), indice: "V = a × a × a.", correction: `${nb(a)} × ${nb(a)} × ${nb(a)} = ${nb(rr(a ** 3))} cm³` };
      }
      const L = alea(3, 15), l = alea(2, 10), h = choisir([alea(2, 12), alea(5, 45) / 10]), unites = Math.random() < 0.25;
      if (unites) {
        const Lm = choisir([1, 2, 3]);
        return { consigne: `Calcule le volume d'un pavé de ${Lm} m sur ${l * 10} cm sur ${L * 10} cm, en cm³.`, ligne: "[d] cm³",
          verifier: v => verifierNombre(v[0], Lm * 100 * l * 10 * L * 10),
          indice: "Exprime d'abord toutes les longueurs dans la même unité.",
          correction: `${Lm} m = ${Lm * 100} cm ; ${Lm * 100} × ${l * 10} × ${L * 10} = ${nb(Lm * 100 * l * 10 * L * 10)} cm³` };
      }
      const V = rr(L * l * h);
      return { consigne: `Calcule le volume d'un pavé droit de ${L} cm sur ${l} cm sur ${nb(h)} cm.`, ligne: "[d] cm³",
        verifier: v => verifierNombre(v[0], V), indice: "V = longueur × largeur × hauteur.", correction: `${L} × ${l} × ${nb(h)} = ${nb(V)} cm³` };
    }
  },

  {
    groupe: F5,
    id: "volume-prisme",
    titre: "Volume d'un prisme droit",
    description: "Aire de la base × hauteur.",
    generer() {
      const a = alea(2, 10), b = alea(2, 10), h = alea(3, 15), type = choisir(["rect", "tri", "base"]);
      if (type === "base") {
        const B = choisir([alea(5, 60), alea(15, 95) / 2]);
        return { consigne: `Un prisme droit a une base d'aire ${nb(B)} cm² et une hauteur de ${h} cm. Calcule son volume.`, ligne: "[d] cm³",
          verifier: v => verifierNombre(v[0], rr(B * h)), indice: "V = aire de la base × hauteur.", correction: `${nb(B)} × ${h} = ${nb(rr(B * h))} cm³` };
      }
      const B = rr(a * b / 2);
      return {
        consigne: `Un prisme droit a pour base un triangle rectangle dont les côtés de l'angle droit mesurent ${a} cm et ${b} cm. Sa hauteur est ${h} cm. Calcule son volume.`,
        ligne: "[d] cm³",
        verifier(v) {
          const x = lireNombre(v[0]);
          if (!isNaN(x) && Math.abs(x - a * b * h) < 1e-9) return { etat: "faux", message: "L'aire d'un triangle rectangle est la moitié de celle du rectangle : n'oublie pas ÷ 2." };
          return verifierNombre(v[0], rr(B * h));
        },
        indice: "Calcule d'abord l'aire du triangle de base (a × b ÷ 2), puis multiplie par la hauteur.",
        correction: `Aire de la base : ${a} × ${b} ÷ 2 = ${nb(B)} cm². Volume : ${nb(B)} × ${h} = ${nb(rr(B * h))} cm³`
      };
    }
  },

  {
    groupe: F5,
    id: "probleme-pave",
    titre: "Problèmes de remplissage",
    description: "Volume puis capacité en litres.",
    generer() {
      const L = alea(3, 8) * 10, l = alea(2, 6) * 10, h = alea(2, 6) * 10, V = L * l * h;
      return probleme(`Un aquarium a la forme d'un pavé de ${L} cm sur ${l} cm sur ${h} cm.`, [
        { q: "Son volume en cm³ :", r: V, unite: "cm³", c: `${L} × ${l} × ${h} = ${nb(V)} cm³` },
        { q: "Sa contenance en litres :", r: V / 1000, unite: "L", c: `${nb(V)} cm³ = ${nb(V / 1000)} dm³ = ${nb(V / 1000)} L` }
      ], "1 L = 1 dm³ = 1 000 cm³.");
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "volume-cylindre",
    titre: "Volume d'un cylindre",
    description: "π × r² × h, arrondi au dixième.",
    generer() {
      const r = choisir([1, 2, 3, 4, 5, 1.5, 2.5, 6]), h = alea(2, 15), diam = Math.random() < 0.3;
      const V = arr1(Math.PI * r * r * h);
      return {
        consigne: `Calcule le volume d'un cylindre de ${diam ? "diamètre " + nb(2 * r) : "rayon " + nb(r)} cm et de hauteur ${h} cm (arrondi au dixième).`,
        ligne: "[d] cm³",
        verifier: v => verifierNombre(v[0], V),
        indice: (diam ? "Le rayon est la moitié du diamètre. " : "") + "V = π × r × r × h.",
        correction: `${diam ? `r = ${nb(r)} cm. ` : ""}π × ${nb(r)}² × ${h} = ${nb(rr(r * r * h))}π ≈ ${nb(V)} cm³`
      };
    }
  },

  {
    groupe: F6,
    id: "probleme-cylindre",
    titre: "Contenance d'un récipient cylindrique",
    description: "En cm³ puis en litres ou centilitres.",
    generer() {
      const r = choisir([3, 4, 5, 6, 8, 10]), h = choisir([10, 12, 15, 20, 25]), V = Math.round(Math.PI * r * r * h);
      const enL = V >= 1000;
      return probleme(`Un récipient cylindrique a pour rayon ${r} cm et pour hauteur ${h} cm.`, [
        { q: "Son volume en cm³ (arrondi à l'unité) :", r: V, unite: "cm³", c: `π × ${r}² × ${h} = ${r * r * h}π ≈ ${nb(V)} cm³` },
        enL ? { q: "Sa contenance en litres (avec ce volume arrondi) :", r: V / 1000, unite: "L", c: `${nb(V)} cm³ = ${nb(V / 1000)} L` }
            : { q: "Sa contenance en centilitres (avec ce volume arrondi) :", r: V / 10, unite: "cL", c: `${nb(V)} cm³ = ${nb(V)} mL = ${nb(V / 10)} cL` }
      ], "V = π × r² × h ; 1 cm³ = 1 mL ; 1 L = 1 000 cm³ ; 1 cL = 10 mL.");
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Faces, arêtes, sommets", activites: ["faces-aretes"] },
    { competence: "Compter des cubes", activites: ["compter-cubes"] },
    { competence: "Perspective cavalière", activites: ["perspective"] },
    { competence: "Patrons du cube", activites: ["patron-cube"] },
    { competence: "Patrons des solides", activites: ["patron-solide", "patron-cylindre"] },
    { competence: "Aire d'un disque", activites: ["aire-disque", "aire-portion"] },
    { competence: "Convertir des volumes", activites: ["convertir-volumes"] },
    { competence: "Volumes et capacités", activites: ["convertir-capacites"] },
    { competence: "Volume d'un pavé", activites: ["volume-pave"] },
    { competence: "Volume d'un prisme droit", activites: ["volume-prisme"] },
    { competence: "Volume d'un cylindre", activites: ["volume-cylindre"] },
    { competence: "Problème de contenance", activites: ["probleme-pave", "probleme-cylindre"] }
  ]
};
