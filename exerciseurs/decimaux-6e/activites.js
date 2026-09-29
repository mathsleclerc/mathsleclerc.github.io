/* =====================================================================
   EXERCISEUR « NOMBRES DÉCIMAUX » — 6e, chapitre 6

   Jusqu'aux millièmes. Pour éviter les erreurs de calcul de l'ordinateur,
   les nombres sont manipulés en millièmes entiers (3,25 → 3250) et ne
   sont convertis qu'à l'affichage. On parle d'arrondi ; graphiques dans
   le premier quadrant, sans nombres négatifs.
   ===================================================================== */

const D1 = "Différentes représentations";
const D2 = "Comparer, ranger, demi-droite graduée";
const D3 = "Encadrer et intercaler";
const D4 = "Valeurs approchées et arrondis";
const D5 = "Graphique cartésien";

/* ---------- Écriture des nombres (en millièmes) ---------- */
const d = m => ecrireNombre(Math.round(m) / 1000);                  // 3250 → « 3,25 »
const dFixe = (m, k) => {                                            // 3500, 2 → « 3,50 »
  const [e, f] = (Math.round(m) / 1000).toFixed(k).split(".");
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (f ? "," + f : "");
};
const enMilliemes = s => Math.round(lireNombre(s) * 1000);
const cap = t => t[0].toUpperCase() + t.slice(1);
const inf = "&lt;", sup = "&gt;";
const symbole = s => s === "<" ? inf : s === ">" ? sup : "=";

/* Un décimal au hasard : e chiffres avant la virgule, k après (en millièmes) */
function decimal(e, k, zeros = 0.25) {
  let s = String(alea(1, 9));
  for (let i = 1; i < e; i++) s += Math.random() < zeros ? "0" : String(alea(0, 9));
  let f = "";
  for (let i = 0; i < k; i++) f += Math.random() < zeros ? "0" : String(alea(0, 9));
  if (k) f = f.slice(0, -1) + String(alea(1, 9)); // le dernier chiffre n'est pas un zéro
  return Number(s) * 1000 + (k ? Number(f.padEnd(3, "0")) : 0);
}

/* Rangs : 3 = unités de mille, 0 = unités, −1 = dixièmes, −3 = millièmes */
const RANGS = { 3: "unités de mille", 2: "centaines", 1: "dizaines", 0: "unités", "-1": "dixièmes", "-2": "centièmes", "-3": "millièmes" };
const chiffreDe = (m, r) => Math.floor(m / 10 ** (r + 3)) % 10;
const nombreDe = (m, r) => Math.floor(m / 10 ** (r + 3));
const FRACTION_UNITE = { "-1": 10, "-2": 100, "-3": 1000 };

/* ---------- Tableau de numération décimal ---------- */
function tableauDecimal(m, { cliquable = false } = {}) {
  const rangs = [3, 2, 1, 0, -1, -2, -3];
  const noms = ["Unités de mille", "Centaines", "Dizaines", "Unités", "Dixièmes", "Centièmes", "Millièmes"];
  const table = el("table", { class: "numeration decimale" });
  table.append(el("tr", {}, ...noms.map((n, i) => el("th", { class: i === 3 ? "virgule-apres" : "" }, n))));
  const ligne = el("tr");
  const boutons = [];
  const entiers = String(Math.floor(m / 1000)).length;
  rangs.forEach(r => {
    const td = el("td", { class: r === 0 ? "virgule-apres" : "" });
    if (r < entiers) {
      const c = String(chiffreDe(m, r));
      if (cliquable) {
        const b = el("button", { type: "button", class: "chiffre", "data-rang": String(r) }, c);
        boutons.push(b);
        td.append(b);
      } else td.append(c);
    }
    ligne.append(td);
  });
  table.append(ligne);
  return { table, boutons };
}

/* ---------- Demi-droite graduée (valeurs en millièmes) ----------
   n intervalles ; la graduation k vaut debut + k × pas ; clic : l'élève place un point. */
function droite({ n = 10, debut, pas, etiquettes, point = null, lettre = "A", clic = false, principales = 0, classePoint = "pt" }) {
  const x0 = 30, L = 440, y = 48, e = L / n, W = x0 + L + 34;
  const X = k => x0 + k * e;
  const s = svg("svg", { viewBox: `0 0 ${W} 92`, width: W, height: 92, class: "droite" + (clic ? " droite-clic" : "") });
  s.append(svg("line", { x1: x0 - (debut ? 14 : 0), y1: y, x2: W - 10, y2: y, class: "axe" }),
    svg("path", { d: `M${W - 6},${y} l-11,-5.5 v11 z`, class: "fleche" }));
  for (let k = 0; k <= n; k++) {
    const grand = principales ? k % principales === 0 : false;
    s.append(svg("line", { x1: X(k), y1: y - (grand ? 11 : 7), x2: X(k), y2: y + (grand ? 11 : 7), class: grand ? "grad maj" : "grad" }));
  }
  for (const k of etiquettes) s.append(svg("text", { x: X(k), y: y + 32, class: "etiq" }, d(debut + k * pas)));
  const res = { svg: s, position: null, actif: true };
  res.marquer = (k, classe, texte) => {
    const g = svg("g", { class: classe },
      svg("line", { x1: X(k) - 7, y1: y - 7, x2: X(k) + 7, y2: y + 7 }),
      svg("line", { x1: X(k) - 7, y1: y + 7, x2: X(k) + 7, y2: y - 7 }),
      svg("text", { x: X(k), y: y - 16 }, texte));
    s.append(g);
    return g;
  };
  if (point != null) res.marquer(point, classePoint, lettre);
  if (clic) {
    let g = null;
    const placer = k => {
      k = Math.max(0, Math.min(n, k));
      res.position = k;
      g?.remove();
      g = res.marquer(k, "pt", lettre);
    };
    s.setAttribute("tabindex", "0");
    s.addEventListener("pointerdown", ev => {
      if (!res.actif) return;
      const p = s.createSVGPoint();
      p.x = ev.clientX; p.y = ev.clientY;
      placer(Math.round((p.matrixTransform(s.getScreenCTM().inverse()).x - x0) / e));
    });
    s.addEventListener("keydown", ev => {
      if (!res.actif || (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft")) return;
      ev.preventDefault();
      placer((res.position ?? 0) + (ev.key === "ArrowRight" ? 1 : -1));
    });
  }
  res.X = X; res.y = y;
  return res;
}

/* ---------- Repère cartésien (premier quadrant) ----------
   xmax, ymax : bornes ; pasX, pasY : graduations ; tout en unités réelles */
function repere({ xmax = 6, ymax = 5, pasX = 1, pasY = 1, nomX = "", nomY = "", etiqX = pasX, etiqY = pasY, largeur = 420, hauteur = 330, fin = 0 }) {
  const g0 = { x: 52, y: hauteur - 42 }, lx = largeur - 80, ly = hauteur - 70;
  const X = v => g0.x + v / xmax * lx, Y = v => g0.y - v / ymax * ly;
  const s = svg("svg", { viewBox: `0 0 ${largeur} ${hauteur}`, width: largeur, height: hauteur, class: "repere", role: "img", "aria-label": "Repère" });
  const pasGrille = fin || Math.min(pasX, pasY);
  for (let v = 0; v <= xmax + 1e-9; v += fin || pasX) s.append(svg("line", { x1: X(v), y1: Y(0), x2: X(v), y2: Y(ymax), class: "grille" }));
  for (let v = 0; v <= ymax + 1e-9; v += fin || pasY) s.append(svg("line", { x1: X(0), y1: Y(v), x2: X(xmax), y2: Y(v), class: "grille" }));
  s.append(svg("line", { x1: X(0), y1: Y(0), x2: X(xmax) + 14, y2: Y(0), class: "axe-rep" }),
    svg("line", { x1: X(0), y1: Y(0), x2: X(0), y2: Y(ymax) - 14, class: "axe-rep" }),
    svg("path", { d: `M${X(xmax) + 18},${Y(0)} l-10,-5 v10 z`, class: "fleche-rep" }),
    svg("path", { d: `M${X(0)},${Y(ymax) - 18} l-5,10 h10 z`, class: "fleche-rep" }));
  for (let v = 0; v <= xmax + 1e-9; v += etiqX) s.append(svg("text", { x: X(v), y: Y(0) + 20, class: "rep-etiq" }, ecrireNombre(Math.round(v * 100) / 100)));
  for (let v = etiqY; v <= ymax + 1e-9; v += etiqY) s.append(svg("text", { x: X(0) - 8, y: Y(v) + 5, class: "rep-etiq gauche" }, ecrireNombre(Math.round(v * 100) / 100)));
  if (nomX) s.append(svg("text", { x: X(xmax) + 6, y: Y(0) - 10, class: "rep-nom droite-nom" }, nomX));
  if (nomY) s.append(svg("text", { x: X(0) + 8, y: Y(ymax) - 8, class: "rep-nom" }, nomY));
  return { svg: s, X, Y, pasGrille };
}
function pointRepere(r, x, y, nom, classe = "rep-point") {
  const g = svg("g", { class: classe },
    svg("line", { x1: r.X(x) - 6, y1: r.Y(y) - 6, x2: r.X(x) + 6, y2: r.Y(y) + 6 }),
    svg("line", { x1: r.X(x) - 6, y1: r.Y(y) + 6, x2: r.X(x) + 6, y2: r.Y(y) - 6 }),
    svg("text", { x: r.X(x) + 10, y: r.Y(y) - 8 }, nom));
  r.svg.append(g);
  return g;
}

/* Données de graphiques de la vie courante */
function donneesGraphique() {
  return choisir([
    () => { const base = alea(8, 12); const t = [0, 2, 5, 8, 10, 11, 9, 6, 3].map(v => base + v);
      return { titre: "Température relevée dans la journée", xs: [8, 9, 10, 11, 12, 13, 14, 15, 16], ys: t, nomX: "heure (h)", nomY: "température (°C)", uX: "h", uY: "°C", xmin: 8, pasX: 1, ymax: base + 14, pasY: 2,
        question: (x, y) => [`Quelle température fait-il à ${x} h ?`, y, "°C"], inverse: (x, y) => [`À quelle heure la température est-elle de ${y} °C pour la première fois ?`, x, "h"] }; },
    () => { const t = [50, 54, 58, 61, 64, 66, 68, 70, 72]; return { titre: "Taille d'un bébé selon son âge", xs: [0, 1, 2, 3, 4, 5, 6, 7, 8], ys: t, nomX: "âge (mois)", nomY: "taille (cm)", uX: "mois", uY: "cm", xmin: 0, pasX: 1, ymax: 80, pasY: 10, origineY: 40,
        question: (x, y) => [`Quelle est la taille du bébé à ${x} mois ?`, y, "cm"], inverse: (x, y) => [`À quel âge le bébé mesure-t-il ${y} cm ?`, x, "mois"] }; },
    () => { const t = [5, 20, 35, 50, 62, 74, 84, 92, 100]; return { titre: "Recharge d'un téléphone", xs: [0, 10, 20, 30, 40, 50, 60, 70, 80], ys: t, nomX: "durée (min)", nomY: "charge (%)", uX: "min", uY: "%", xmin: 0, pasX: 10, ymax: 100, pasY: 10,
        question: (x, y) => [`Quelle est la charge après ${x} minutes ?`, y, "%"], inverse: (x, y) => [`Au bout de combien de minutes la charge atteint-elle ${y} % ?`, x, "min"] }; }
  ])();
}
/* Graphique en ligne brisée : axes gradués avec les grandeurs et leurs unités */
function graphique(D, { largeur = 440, hauteur = 320, petit = false } = {}) {
  const x0 = D.xmin, n = D.xs.length - 1, y0 = D.origineY || 0;
  const g0 = { x: petit ? 34 : 56, y: hauteur - (petit ? 24 : 44) }, lx = largeur - g0.x - (petit ? 12 : 40), ly = g0.y - (petit ? 12 : 36);
  const X = v => g0.x + (v - x0) / (D.xs[n] - x0) * lx, Y = v => g0.y - (v - y0) / (D.ymax - y0) * ly;
  const s = svg("svg", { viewBox: `0 0 ${largeur} ${hauteur}`, width: largeur, height: hauteur, class: "repere graphique" + (petit ? " petit" : ""), role: "img", "aria-label": D.titre });
  for (const v of D.xs) s.append(svg("line", { x1: X(v), y1: Y(y0), x2: X(v), y2: Y(D.ymax), class: "grille" }));
  for (let v = y0; v <= D.ymax; v += D.pasY) s.append(svg("line", { x1: X(x0), y1: Y(v), x2: X(D.xs[n]), y2: Y(v), class: "grille" }));
  s.append(svg("line", { x1: X(x0), y1: Y(y0), x2: X(D.xs[n]) + 8, y2: Y(y0), class: "axe-rep" }), svg("line", { x1: X(x0), y1: Y(y0), x2: X(x0), y2: Y(D.ymax) - 8, class: "axe-rep" }));
  if (!petit) {
    for (const v of D.xs) s.append(svg("text", { x: X(v), y: Y(y0) + 18, class: "rep-etiq" }, String(v)));
    for (let v = y0; v <= D.ymax; v += D.pasY) s.append(svg("text", { x: X(x0) - 8, y: Y(v) + 5, class: "rep-etiq gauche" }, String(v)));
    s.append(svg("text", { x: X(D.xs[n]), y: Y(y0) + 36, class: "rep-nom droite-nom" }, D.nomX), svg("text", { x: X(x0) + 6, y: Y(D.ymax) - 16, class: "rep-nom" }, D.nomY));
  }
  s.append(svg("polyline", { points: D.xs.map((v, i) => `${X(v)},${Y(D.ys[i])}`).join(" "), class: "courbe" }));
  D.xs.forEach((v, i) => s.append(svg("circle", { cx: X(v), cy: Y(D.ys[i]), r: petit ? 2.5 : 4, class: "courbe-point" })));
  return { svg: s, X, Y };
}

const ACTIVITES = [

  /* ================= Différentes représentations ================= */

  {
    groupe: D1,
    id: "tableau-numeration",
    titre: "Le tableau de numération",
    description: "Trouver le chiffre d'un rang, de part et d'autre de la virgule.",
    generer() {
      const m = decimal(alea(1, 4), 3, 0.15);
      const entiers = String(Math.floor(m / 1000)).length;
      const r = choisir([-1, -2, -3, -1, -2, ...[0, 1, 2, 3].slice(0, entiers)]);
      const { table, boutons } = tableauDecimal(m, { cliquable: true });
      let choisi = null, actif = true;
      boutons.forEach(b => b.addEventListener("click", () => {
        if (!actif) return;
        choisi = Number(b.dataset.rang);
        boutons.forEach(c => c.classList.toggle("choisi", c === b));
      }));
      return {
        consigne: `Voici le nombre <strong>${d(m)}</strong> dans le tableau de numération. Clique sur le chiffre des <strong>${RANGS[r]}</strong>, puis valide.`,
        figure: table,
        verifier() {
          if (choisi == null) return { etat: "incomplet", message: "Clique sur un chiffre du tableau." };
          return choisi === r ? { etat: "juste" } : { etat: "faux", message: `Tu as cliqué sur le chiffre des ${RANGS[choisi]}.` };
        },
        indice: "Après la virgule : dixièmes, puis centièmes, puis millièmes. Avant la virgule : unités, dizaines, centaines…",
        correction: `Le chiffre des ${RANGS[r]} est ${chiffreDe(m, r)} (entouré en vert).`,
        surCorrection() { boutons.find(b => Number(b.dataset.rang) === r).classList.add("bonne"); },
        bloquer() { actif = false; }
      };
    }
  },

  {
    groupe: D1,
    id: "chiffre-ou-nombre",
    titre: "Chiffre ou nombre de… ?",
    description: "Le chiffre des dixièmes n'est pas le nombre de dixièmes.",
    generer() {
      const m = decimal(alea(2, 4), 3, 0.15);
      const r = choisir([-1, -2, -1, -2, 0, 1]);
      const veutChiffre = Math.random() < 0.5;
      const c = chiffreDe(m, r), n = nombreDe(m, r);
      const attendu = veutChiffre ? c : n;
      return {
        consigne: `Dans le nombre <strong>${d(m)}</strong>, quel est le ${veutChiffre ? "chiffre des" : "nombre de"} ${RANGS[r]} ?`,
        ligne: "[n]",
        verifier(v) {
          const res = verifierNombre(v[0], attendu);
          if (res.etat === "faux" && lireNombre(v[0]) === (veutChiffre ? n : c)) res.message = veutChiffre
            ? `Tu as donné le nombre de ${RANGS[r]} : on demande un seul chiffre.`
            : `Tu as donné le chiffre des ${RANGS[r]} : le nombre de ${RANGS[r]}, c'est tout ce qui est écrit à gauche, ${RANGS[r]} compris, sans la virgule.`;
          return res;
        },
        indice: `Le chiffre des ${RANGS[r]} est un seul chiffre. Le nombre de ${RANGS[r]}, c'est tout ce qui est à gauche, ${RANGS[r]} compris.`,
        correction: `Dans ${d(m)}, le chiffre des ${RANGS[r]} est ${c} ; le nombre de ${RANGS[r]} est ${ecrireNombre(n)} (tout ce qui est à gauche, ${RANGS[r]} compris).`
      };
    }
  },

  {
    groupe: D1,
    id: "ecrire-en-chiffres",
    titre: "Écrire en chiffres",
    description: "12 unités et 7 centièmes, 305 millièmes…",
    generer() {
      const [texte, m] = choisir([
        () => { const u = alea(2, 40), c = alea(1, 9); return [`${u} unités et ${c} centièmes`, u * 1000 + c * 10]; },
        () => { const u = alea(2, 40), c = alea(1, 9); return [`${u} unités et ${c} millièmes`, u * 1000 + c]; },
        () => { const u = alea(1, 20), c = alea(10, 99); return [`${u} unités et ${c} millièmes`, u * 1000 + c]; },
        () => { const c = alea(11, 99); return [`${c} centièmes`, c * 10]; },
        () => { const c = alea(101, 999); return [`${c} millièmes`, c]; },
        () => { const c = alea(12, 99); return [`${c} dixièmes`, c * 100]; },
        () => { const a = alea(1, 9), b = alea(1, 9); return [`${a} dixièmes et ${b} millièmes`, a * 100 + b]; },
        () => { const u = alea(1, 9), a = alea(1, 9), b = alea(1, 9); return [`${u} unités, ${a} dixièmes et ${b} millièmes`, u * 1000 + a * 100 + b]; }
      ])();
      return {
        consigne: `Écris ce nombre avec une virgule :<br><em>« ${texte} »</em>`,
        ligne: "[d]",
        verifier(v) {
          const x = enMilliemes(v[0]);
          if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre." };
          return x === m ? { etat: "juste" } : { etat: "faux", message: "Place chaque chiffre dans le tableau de numération : attention aux zéros." };
        },
        indice: "1 dixième = 0,1 ; 1 centième = 0,01 ; 1 millième = 0,001. Pense aux zéros pour les rangs vides.",
        correction: `« ${texte} » s'écrit ${d(m)}.`
      };
    }
  },

  {
    groupe: D1,
    id: "virgule-fraction",
    titre: "Virgule et fraction décimale",
    description: "4,39 = 439/100 et 327/100 = 3,27.",
    generer() {
      const k = alea(1, 3), den = 10 ** k;
      let partie;
      do partie = alea(1, den - 1); while (partie % 10 === 0); // le dernier chiffre après la virgule n'est pas un zéro
      const v = (Math.random() < 0.25 ? 0 : alea(1, 40) * 1000) + partie * 10 ** (3 - k);
      const num = v / 10 ** (3 - k);
      if (Math.random() < 0.5) {
        return {
          consigne: "Écris ce nombre sous la forme d'une fraction décimale.",
          ligne: `${d(v)} = [f]`,
          verifier(x) {
            const n = lireEntier(x[0].num), q = lireEntier(x[0].den);
            if (isNaN(n) || isNaN(q)) return { etat: "incomplet", message: "Complète le numérateur et le dénominateur." };
            if (!/^10*$/.test(String(q))) return { etat: "faux", message: "Une fraction décimale a pour dénominateur 10, 100, 1 000…" };
            return Math.abs(n / q * 1000 - v) < 1e-6 ? { etat: "juste" } : { etat: "faux" };
          },
          indice: `Le dernier chiffre est celui des ${RANGS[-k]} : le dénominateur est ${ecrireNombre(den)}.`,
          correction: `${d(v)} = ${ecrireNombre(num)} ${RANGS[-k]} = ${frac(ecrireNombre(num), ecrireNombre(den))}.`
        };
      }
      return {
        consigne: "Écris ce nombre avec une virgule.",
        ligne: `${frac(ecrireNombre(num), ecrireNombre(den))} = [d]`,
        verifier: x => verifierNombre(x[0], v / 1000),
        indice: `${ecrireNombre(den)} au dénominateur : le chiffre des unités de ${ecrireNombre(num)} devient le chiffre des ${RANGS[-k]}.`,
        correction: `${frac(ecrireNombre(num), ecrireNombre(den))} = ${ecrireNombre(num)} ${RANGS[-k]} = ${d(v)}.`
      };
    }
  },

  {
    groupe: D1,
    id: "decompositions",
    titre: "Décompositions",
    description: "63,58 = 60 + 3 + 0,5 + 0,08, ou avec des fractions décimales.",
    generer() {
      const m = decimal(alea(2, 3), 3, 0.25);
      const rangs = [3, 2, 1, 0, -1, -2, -3].filter(r => chiffreDe(m, r) && m >= 10 ** (r + 3));
      const terme = r => chiffreDe(m, r) * 10 ** (r + 3);
      if (Math.random() < 0.55) {
        const trous = melanger([...rangs]).slice(0, Math.min(2, rangs.length - 1));
        return {
          consigne: "Complète la décomposition additive.",
          ligne: `${d(m)} = ` + rangs.map(r => trous.includes(r) ? "[d]" : d(terme(r))).join(" + "),
          verifier(v) {
            const x = v.map(enMilliemes);
            if (x.some(isNaN)) return { etat: "incomplet", message: "Complète toutes les cases." };
            const attendus = rangs.filter(r => trous.includes(r)).map(terme);
            return attendus.every((a, i) => a === x[i]) ? { etat: "juste" } : { etat: "faux" };
          },
          indice: "Chaque terme correspond à un seul chiffre : 0,5 pour 5 dixièmes, 0,08 pour 8 centièmes…",
          correction: `${d(m)} = ${rangs.map(r => d(terme(r))).join(" + ")}.`
        };
      }
      const e = Math.floor(m / 1000), f = m % 1000;
      return {
        consigne: "Complète avec une fraction décimale.",
        ligne: `${d(m)} = ${ecrireNombre(e)} + [f/1000]`,
        verifier: v => verifierNombre(v[0].num, f),
        indice: "La partie décimale, écrite en millièmes.",
        correction: `${d(m)} = ${ecrireNombre(e)} + ${frac(f, "1 000")} (${f} millièmes).`
      };
    }
  },

  {
    groupe: D1,
    id: "nombre-mixte",
    titre: "Nombre mixte",
    description: "3,4 = 3 + 4/10 ; 2 + 3/4 = 2,75.",
    generer() {
      const cas = choisir(["vers-mixte", "vers-mixte", "vers-decimal", "simples"]);
      if (cas === "vers-mixte") {
        const k = alea(1, 2), den = 10 ** k, e = alea(1, 20), n = k === 1 ? alea(1, 9) : alea(1, 99);
        const m = e * 1000 + n * 10 ** (3 - k);
        return {
          consigne: "Écris ce nombre comme la somme d'un entier et d'une fraction décimale inférieure à 1.",
          ligne: `${d(m)} = [n] + [f/${den}]`,
          verifier(v) {
            const a = lireEntier(v[0]), b = lireEntier(v[1].num);
            if (isNaN(a) || isNaN(b)) return { etat: "incomplet", message: "Complète les deux cases." };
            return a === e && b === n ? { etat: "juste" } : { etat: "faux" };
          },
          indice: "La partie entière est avant la virgule ; la partie décimale s'écrit en dixièmes ou en centièmes.",
          correction: `${d(m)} = ${e} + ${frac(n, den)}.`
        };
      }
      if (cas === "vers-decimal") {
        const e = alea(1, 20), k = alea(1, 3), den = 10 ** k, n = alea(1, den - 1);
        const m = e * 1000 + n * 10 ** (3 - k);
        return {
          consigne: "Écris ce nombre avec une virgule.",
          ligne: `${e} + ${frac(n, ecrireNombre(den))} = [d]`,
          verifier: v => verifierNombre(v[0], m / 1000),
          indice: `${frac(n, ecrireNombre(den))} = ${ecrireNombre(n)} ${RANGS[-k]}.`,
          correction: `${e} + ${frac(n, ecrireNombre(den))} = ${d(m)}.`
        };
      }
      const [a, b, val] = choisir([[1, 2, 500], [1, 4, 250], [3, 4, 750], [1, 5, 200], [2, 5, 400], [3, 5, 600], [4, 5, 800]]);
      const e = alea(1, 15);
      return {
        consigne: "Écris ce nombre avec une virgule.",
        ligne: `${e} + ${frac(a, b)} = [d]`,
        verifier: v => verifierNombre(v[0], e + val / 1000),
        indice: `Écris d'abord ${frac(a, b)} avec le dénominateur 10 ou 100.`,
        correction: `${frac(a, b)} = ${d(val)}, donc ${e} + ${frac(a, b)} = ${d(e * 1000 + val)}.`
      };
    }
  },

  {
    groupe: D1,
    id: "pourcentages",
    titre: "Décimaux, fractions et pourcentages",
    description: "0,25 = 25 % = 1/4 ; 0,07 = 7 %.",
    generer() {
      const cas = choisir(["relier", "vers-pourcent", "vers-decimal", "fraction"]);
      const usuels = [[500, "50 %", frac(1, 2)], [250, "25 %", frac(1, 4)], [750, "75 %", frac(3, 4)], [100, "10 %", frac(1, 10)], [200, "20 %", frac(1, 5)], [1000, "100 %", "1"]];
      if (cas === "relier") {
        const choix = melanger([...usuels]).slice(0, 5);
        const r = relier(choix.map(([m]) => ({ html: d(m), cle: m })), choix.map(([m, p]) => ({ html: p, cle: m })));
        return {
          consigne: "Relie chaque nombre décimal au pourcentage égal.",
          figure: r.noeud,
          verifier: r.verifier,
          indice: "Un pourcentage, c'est un nombre de centièmes : 25 % = 25 centièmes = 0,25.",
          correction: choix.map(([m, p, f]) => `${d(m)} = ${p} = ${f}`).join(" ; ") + ".",
          surCorrection: r.corriger,
          bloquer: r.bloquer
        };
      }
      if (cas === "vers-pourcent") {
        const t = choisir([alea(1, 9), alea(11, 99), alea(11, 99), 120, 150]);
        return {
          consigne: "Écris ce nombre sous forme d'un pourcentage.",
          ligne: `${d(t * 10)} = [n] %`,
          verifier(v) {
            const r = verifierNombre(v[0], t);
            if (r.etat === "faux" && t < 10 && lireNombre(v[0]) === t * 10) r.message = `${d(t * 10)}, c'est ${t} centième${t > 1 ? "s" : ""}, donc ${t} %.`;
            return r;
          },
          indice: "Un pourcentage est un nombre de centièmes.",
          correction: `${d(t * 10)} = ${frac(t, 100)} = ${t} %.`
        };
      }
      if (cas === "vers-decimal") {
        const t = choisir([alea(1, 9), alea(11, 99), alea(11, 99)]);
        return {
          consigne: "Écris ce pourcentage avec une virgule.",
          ligne: `${t} % = [d]`,
          verifier(v) {
            const r = verifierNombre(v[0], t / 100);
            if (r.etat === "faux" && t < 10 && lireNombre(v[0]) === t / 10) r.message = `${t} % = ${t} centièmes = ${d(t * 10)}, et non ${t} dixièmes.`;
            return r;
          },
          indice: `${t} % = ${frac(t, 100)}.`,
          correction: `${t} % = ${frac(t, 100)} = ${d(t * 10)}.`
        };
      }
      const [m, p, f] = choisir(usuels.slice(0, 5));
      return {
        consigne: "Complète.",
        ligne: `${f} = [d] = [n] %`,
        verifier(v) {
          const a = lireNombre(v[0]), b = lireNombre(v[1]);
          if (isNaN(a) || isNaN(b)) return { etat: "incomplet", message: "Complète les deux cases." };
          return Math.round(a * 1000) === m && b === m / 10 ? { etat: "juste" } : { etat: "faux" };
        },
        indice: "Écris d'abord la fraction avec le dénominateur 100.",
        correction: `${f} = ${frac(m / 10, 100)} = ${d(m)} = ${p}.`
      };
    }
  },

  {
    groupe: D1,
    id: "bon-zero",
    titre: "Où mettre les zéros ?",
    description: "3,40 = 3,4 mais 3,04 ≠ 3,4.",
    generer() {
      const a = alea(1, 20), b = alea(1, 9), c = alea(1, 9);
      const [gauche, droite, vrai, explication] = choisir([
        [`${a},${b}0`, `${a},${b}`, true, `On ne change pas un nombre en ajoutant un zéro à droite de sa partie décimale.`],
        [`${a},0${b}`, `${a},${b}`, false, `${a},0${b} a ${b} centièmes et 0 dixième ; ${a},${b} a ${b} dixièmes.`],
        [`${a}`, `${a},0`, true, "Un nombre entier est aussi un nombre décimal : on peut ajouter « ,0 »."],
        [`${a},${b}00`, `${a},${b}`, true, "Les zéros à droite de la partie décimale peuvent être supprimés."],
        [`${a},${b}${c}`, `${a},${c}${b}`, b === c, b === c ? "Les deux écritures sont identiques." : "Les chiffres ne sont pas au même rang."],
        [`${a},${b}`, `${a},${b}0`, true, "On peut ajouter un zéro à droite de la partie décimale."],
        [`${a}0,${b}`, `${a},${b}`, false, `Un zéro avant la virgule change la partie entière : ${a}0 ≠ ${a}.`],
        [`0,${b}`, `0,0${b}`, false, `0,${b} = ${b} dixièmes ; 0,0${b} = ${b} centièmes.`]
      ]);
      return {
        consigne: `Vrai ou faux ?<br><strong>${gauche} = ${droite}</strong>`,
        choix: ["Vrai", "Faux"],
        verifier: (v, ch) => ({ etat: (ch === "Vrai") === vrai ? "juste" : "faux" }),
        indice: "Place les deux nombres dans le tableau de numération et compare chaque rang.",
        correction: `${vrai ? "Vrai" : "Faux"} : ${explication}`
      };
    }
  },

  /* ================= Comparer, ranger, demi-droite ================= */

  {
    groupe: D2,
    id: "comparer",
    titre: "Comparer",
    description: "7,26 et 7,3 ; 5,41 et 5,409 ; 3,50 et 3,5…",
    generer() {
      const e = alea(1, 30);
      const [A, B] = choisir([
        () => { const b = alea(1, 8), c = alea(1, 9); return [[e * 1000 + b * 100 + c * 10, 2], [e * 1000 + (b + 1) * 100, 1]]; },       // 7,26 et 7,3
        () => { const b = alea(1, 9), c = alea(1, 8); return [[e * 1000 + b * 100 + c * 10, 2], [e * 1000 + b * 100 + (c - 1) * 10 + alea(1, 9), 3]]; }, // 5,41 et 5,409
        () => { const b = alea(1, 9); return [[e * 1000 + b * 100, 2], [e * 1000 + b * 100, 1]]; },                                         // 3,50 et 3,5
        () => [[e * 1000 + 990, 2], [(e + 1) * 1000 + 100, 1]],                                                                            // 0,99 et 1,1
        () => { const b = alea(1, 9); return [[e * 1000 + b * 10, 2], [e * 1000 + b * 100, 1]]; },                                         // 12,05 et 12,5
        () => { const x = decimal(alea(1, 2), alea(1, 3)); return [[x, 3], [x + choisir([-1, 1]) * choisir([1, 10, 100]), 3]]; },
        () => [[decimal(1, 2), 2], [decimal(2, 1), 1]]
      ])();
      let [a, ka] = A, [b, kb] = B;
      if (Math.random() < 0.5) [[a, ka], [b, kb]] = [[b, kb], [a, ka]];
      const s = a < b ? "<" : a > b ? ">" : "=";
      const ea = Math.floor(a / 1000), eb = Math.floor(b / 1000);
      let explication;
      if (ea !== eb) explication = `On compare d'abord les parties entières : ${ea} ${symbole(ea < eb ? "<" : ">")} ${eb}.`;
      else if (a === b) explication = "Les parties entières sont égales, et les chiffres de chaque rang aussi (les zéros à droite ne comptent pas).";
      else {
        let r = -1;
        while (chiffreDe(a, r) === chiffreDe(b, r)) r--;
        explication = `Les parties entières sont égales (${ea}). On compare ensuite rang par rang : le premier chiffre qui diffère est celui des ${RANGS[r]} : ${chiffreDe(a, r)} ${symbole(s)} ${chiffreDe(b, r)}.`;
      }
      return {
        consigne: "Complète avec &lt;, &gt; ou =.",
        ligne: `${dFixe(a, Math.max(ka, 0))} [c] ${dFixe(b, Math.max(kb, 0))}`,
        choix: ["<", "=", ">"],
        verifier: (v, c) => ({ etat: c === s ? "juste" : "faux", message: c !== s && ea === eb ? "Attention : on ne compare pas les parties décimales comme des nombres entiers (26 > 3, mais 0,26 < 0,3) !" : "" }),
        indice: "Compare d'abord les parties entières, puis les dixièmes, puis les centièmes… Tu peux ajouter des zéros pour avoir autant de chiffres après la virgule.",
        correction: `${explication} Donc ${dFixe(a, ka)} ${symbole(s)} ${dFixe(b, kb)}.`
      };
    }
  },

  {
    groupe: D2,
    id: "ranger",
    titre: "Ranger",
    description: "Ordre croissant ou décroissant, en cliquant sur les nombres.",
    generer() {
      const croissant = Math.random() < 0.5;
      let items, contexte = "";
      if (Math.random() < 0.35) {
        const [ctx, u, noms, base] = choisir([
          ["Sauts en longueur", "m", ["Adam", "Bilal", "Célian", "Dario", "Élias"], 6000],
          ["Temps au 100 m", "s", ["Léa", "Inès", "Nora", "Zoé", "Mia"], 13000],
          ["Masses de colis", "kg", ["Colis A", "Colis B", "Colis C", "Colis D", "Colis E"], 2000]
        ]);
        contexte = ctx;
        const a = alea(1, 8);
        const vals = melanger([base + a * 100 + 50, base + (a + 1) * 100, base + a * 100 + 5, base + a * 100 + 80, base + a * 100 + 500]);
        items = noms.map((nom, i) => ({ v: vals[i], texte: `${nom} : ${d(vals[i])} ${u}`, court: `${nom} (${d(vals[i])} ${u})` }));
      } else {
        const e = alea(1, 9), f = alea(1, 9), g = alea(1, 9);
        const vals = [e * 1000 + f * 100, e * 1000 + f * 10, e * 1000 + f * 100 + g * 10, e * 1000 + f * 10 + g, f * 1000 + e * 100].map(Math.round);
        items = [...new Set(vals)].map(v => ({ v, texte: d(v), court: d(v) }));
      }
      const r = rangement(items, croissant ? "<" : ">");
      const ordre = [...items.keys()].sort((i, j) => croissant ? items[i].v - items[j].v : items[j].v - items[i].v);
      return {
        consigne: `${contexte ? contexte + " : r" : "R"}ange dans l'ordre <strong>${croissant ? "croissant" : "décroissant"}</strong>${contexte === "Temps au 100 m" ? " (le plus petit temps est le meilleur)" : ""}. Clique sur les nombres dans l'ordre.`,
        figure: r.noeud,
        verifier() {
          const o = r.ordre();
          if (o.length < items.length) return { etat: "incomplet", message: "Range tous les nombres avant de valider." };
          const k = o.findIndex((i, p) => items[i].v !== items[ordre[p]].v);
          return k < 0 ? { etat: "juste" } : { etat: "faux", message: `Le ${k === 0 ? "premier" : (k + 1) + "e"} nombre n'est pas à sa place.` };
        },
        indice: "Compare d'abord les parties entières, puis les dixièmes, puis les centièmes…",
        correction: ordre.map(i => items[i].court).join(` ${symbole(croissant ? "<" : ">")} `),
        bloquer: r.bloquer
      };
    }
  },

  {
    groupe: D2,
    id: "lire-abscisse",
    titre: "Lire une abscisse",
    description: "Demi-droite graduée au dixième ou au centième.",
    generer() {
      const pas = choisir([100, 100, 10, 50, 20]); // 0,1 ; 0,01 ; 0,05 ; 0,02
      const debut = pas === 10 ? alea(10, 99) * 100 : pas === 100 ? alea(0, 12) * 1000 : alea(1, 9) * 1000;
      const lettre = choisir("ABCDEFGHKM".split(""));
      const t = choisir([1, 2, 3, 4, 6, 7, 8, 9]);
      const dr = droite({ debut, pas, etiquettes: [0, 10], point: t, lettre, principales: 5 });
      const v = debut + t * pas;
      return {
        consigne: `Quelle est l'abscisse du point ${lettre} ?`,
        figure: dr.svg,
        ligne: `${lettre}&thinsp;( [d] )`,
        verifier(x) {
          const r = verifierNombre(x[0], v / 1000);
          if (r.etat === "faux" && lireNombre(x[0]) === t) r.message = "Tu as compté les graduations : il faut les multiplier par la valeur d'une graduation.";
          return r;
        },
        indice: `Entre ${d(debut)} et ${d(debut + 10 * pas)}, il y a 10 intervalles : une graduation vaut ${d(10 * pas)} ÷ 10.`,
        correction: `Une graduation vaut ${d(pas)}. ${lettre} est à ${t} graduation${t > 1 ? "s" : ""} de ${d(debut)} : ${d(debut)} + ${t} × ${d(pas)} = ${d(v)}.`
      };
    }
  },

  {
    groupe: D2,
    id: "placer-point",
    titre: "Placer un point",
    description: "Cliquer sur la demi-droite pour placer W(5,65).",
    generer() {
      const pas = choisir([100, 10, 50]);
      const debut = pas === 10 ? alea(10, 99) * 100 : alea(0, 12) * 1000;
      const lettre = choisir("RSTUVW".split(""));
      const t = choisir([1, 2, 3, 4, 6, 7, 8, 9]);
      const dr = droite({ debut, pas, etiquettes: [0, 10], lettre, clic: true, principales: 5 });
      const v = debut + t * pas;
      return {
        consigne: `Place le point ${lettre}(${d(v)}) en cliquant sur la demi-droite graduée, puis valide.`,
        figure: dr.svg,
        verifier() {
          if (dr.position == null) return { etat: "incomplet", message: "Clique sur la demi-droite pour placer le point." };
          return dr.position === t ? { etat: "juste" } : { etat: "faux", message: `Ton point a pour abscisse ${d(debut + dr.position * pas)}.` };
        },
        indice: `Une graduation vaut ${d(pas)}.`,
        correction: `${d(v)} = ${d(debut)} + ${t} × ${d(pas)} : le point est à ${t} graduation${t > 1 ? "s" : ""} de ${d(debut)} (en vert).`,
        surCorrection: () => dr.marquer(t, "pt correct", lettre),
        bloquer() { dr.actif = false; }
      };
    }
  },

  {
    groupe: D2,
    id: "zoom",
    titre: "Le zoom",
    description: "Zoomer entre deux graduations pour placer un point au centième.",
    generer() {
      const e = alea(1, 12), a = alea(0, 9), b = alea(1, 9);
      const v = e * 1000 + a * 100 + b * 10;
      const lettre = choisir("RSTUVW".split(""));
      // Demi-droite du haut : de e à e + 1, en dixièmes ; celle du bas : zoom entre e,a et e,(a+1), en centièmes
      const haut = droite({ debut: e * 1000, pas: 100, etiquettes: [0, 10], principales: 5 });
      haut.svg.append(svg("rect", { x: haut.X(a), y: haut.y - 14, width: haut.X(a + 1) - haut.X(a), height: 28, class: "zoom-cadre" }));
      const bas = droite({ debut: e * 1000 + a * 100, pas: 10, etiquettes: [0, 10], lettre, clic: true, principales: 5 });
      const lien = svg("svg", { viewBox: "0 0 504 40", width: 504, height: 40, class: "zoom-lien" },
        svg("line", { x1: haut.X(a), y1: 0, x2: bas.X(0), y2: 40 }), svg("line", { x1: haut.X(a + 1), y1: 0, x2: bas.X(10), y2: 40 }));
      return {
        consigne: `On zoome sur la partie encadrée. Place le point ${lettre}(${d(v)}) sur la demi-droite du bas.`,
        figure: el("div", { class: "zoom" }, haut.svg, lien, bas.svg),
        verifier() {
          if (bas.position == null) return { etat: "incomplet", message: "Clique sur la demi-droite du bas." };
          return bas.position === b ? { etat: "juste" } : { etat: "faux", message: `Ton point a pour abscisse ${d(e * 1000 + a * 100 + bas.position * 10)}.` };
        },
        indice: `Sur la demi-droite du bas, on va de ${d(e * 1000 + a * 100)} à ${d(e * 1000 + (a + 1) * 100)} : une graduation vaut 0,01.`,
        correction: `${d(v)} est entre ${d(e * 1000 + a * 100)} et ${d(e * 1000 + (a + 1) * 100)}, à ${b} centième${b > 1 ? "s" : ""} de ${d(e * 1000 + a * 100)} (en vert).`,
        surCorrection: () => bas.marquer(b, "pt correct", lettre),
        bloquer() { bas.actif = false; }
      };
    }
  },

  /* ================= Encadrer et intercaler ================= */

  {
    groupe: D3,
    id: "encadrer",
    titre: "Encadrer",
    description: "À l'unité, au dixième, au centième.",
    generer() {
      const [nom, p] = choisir([["à l'unité", 1000], ["au dixième", 100], ["au centième", 10]]);
      let m;
      do m = decimal(alea(1, 3), 3, 0.2); while (m % p === 0);
      const bas = Math.floor(m / p) * p, haut = bas + p;
      return {
        consigne: `Encadre ${d(m)} ${nom}.`,
        ligne: `[d] ${inf} ${d(m)} ${inf} [d]`,
        verifier(v) {
          const x = v.map(enMilliemes);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux cases." };
          if (x[0] === bas && x[1] === haut) return { etat: "juste" };
          if (!(x[0] < m && m < x[1])) return { etat: "faux", message: "Ton encadrement n'est pas vrai : vérifie les signes &lt;." };
          return { etat: "faux", message: `Les deux nombres doivent se suivre ${nom} : ils diffèrent de ${d(p)}.` };
        },
        indice: `Garde les chiffres jusqu'${p === 1000 ? "aux unités" : p === 100 ? "aux dixièmes" : "aux centièmes"}, puis ajoute ${d(p)} pour la borne du haut.`,
        correction: `${d(bas)} ${inf} ${d(m)} ${inf} ${d(haut)}.`
      };
    }
  },

  {
    groupe: D3,
    id: "intercaler",
    titre: "Intercaler",
    description: "Trouver un nombre entre 4,5 et 4,6, entre 9,99 et 10…",
    generer() {
      const [a, b] = choisir([
        () => { const x = alea(1, 20) * 1000 + alea(0, 8) * 100; return [x, x + 100]; },
        () => { const x = alea(1, 20) * 1000 + alea(0, 98) * 10; return [x, x + 10]; },
        () => { const x = alea(1, 20) * 1000; return [x - 10, x]; },
        () => { const x = alea(1, 20); return [x * 1000, (x + 1) * 1000]; },
        () => { const x = alea(1, 20) * 1000 + alea(1, 9) * 100; return [x, x + 1]; }
      ])();
      return {
        consigne: "Intercale un nombre décimal entre ces deux nombres.",
        ligne: `${d(a)} ${inf} [d] ${inf} ${d(b)}`,
        verifier(v) {
          const x = lireNombre(v[0]);
          if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre." };
          if (x * 1000 > a + 1e-9 && x * 1000 < b - 1e-9) return { etat: "juste" };
          return { etat: "faux", message: `${ecrireNombre(x)} n'est pas compris entre ${d(a)} et ${d(b)}. Astuce : écris ${d(a)} avec un chiffre de plus après la virgule.` };
        },
        indice: "Écris les deux nombres avec un chiffre de plus après la virgule (ajoute des zéros), puis cherche un nombre entre les deux.",
        correction: `Par exemple ${(b - a) % 2 === 0 ? d((a + b) / 2) : dFixe(a, 3) + "5"}. Il y a toujours un nombre décimal entre deux nombres décimaux différents.`
      };
    }
  },

  {
    groupe: D3,
    id: "combien-de-nombres",
    titre: "Combien de nombres entre les deux ?",
    description: "Entre deux décimaux, on peut toujours intercaler.",
    generer() {
      const x = alea(1, 20), f = alea(1, 8);
      const [texte, bonne, explication] = choisir([
        [`Combien y a-t-il de nombres décimaux entre ${x},${f} et ${x},${f + 1} ?`, "une infinité", `On peut toujours ajouter des chiffres : ${x},${f}1 ; ${x},${f}01 ; ${x},${f}001…`],
        [`Combien y a-t-il de nombres entiers entre ${x} et ${x + 1} ?`, "aucun", `${x} et ${x + 1} sont deux entiers qui se suivent.`],
        [`Combien y a-t-il de nombres décimaux entre ${x} et ${x + 1} ?`, "une infinité", `Par exemple ${x},1 ; ${x},01 ; ${x},001… et bien d'autres.`],
        [`Combien y a-t-il de nombres avec un seul chiffre après la virgule entre ${x},${f} et ${x},${f + 1} ?`, "aucun", `${x},${f} et ${x},${f + 1} se suivent au dixième : il faut un deuxième chiffre après la virgule.`]
      ]);
      return {
        consigne: texte,
        choix: ["aucun", "un seul", "9", "une infinité"],
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Peut-on écrire un nombre avec plus de chiffres après la virgule ?",
        correction: `Réponse : ${bonne}. ${explication}`
      };
    }
  },

  /* ================= Arrondis ================= */

  {
    groupe: D4,
    id: "arrondir",
    titre: "Arrondir",
    description: "À l'unité, au dixième, au centième.",
    generer() {
      const [nom, p] = choisir([["à l'unité", 1000], ["au dixième", 100], ["au centième", 10]]);
      let m;
      if (Math.random() < 0.25) { // cas des retenues : 9,96 → 10,0
        const e = alea(1, 19);
        m = p === 1000 ? e * 1000 + alea(5, 9) * 100 + alea(0, 99) : p === 100 ? e * 1000 + 900 + alea(50, 99) : e * 1000 + 990 + alea(5, 9);
      } else do m = decimal(alea(1, 2), 3, 0.15); while (m % p === 0);
      const r = Math.floor((m + p / 2) / p) * p;
      const suivant = { 1000: "dixièmes", 100: "centièmes", 10: "millièmes" }[p];
      const tronque = Math.floor(m / p) * p;
      return {
        consigne: `Arrondis ${d(m)} ${nom}.`,
        ligne: "[d]",
        verifier(v) {
          const x = enMilliemes(v[0]);
          if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre." };
          if (x === r) return { etat: "juste" };
          if (x === tronque && r !== tronque) return { etat: "faux", message: `Tu as seulement coupé le nombre. Regarde le chiffre des ${suivant} : il est supérieur ou égal à 5.` };
          if (x === tronque + p && r === tronque) return { etat: "faux", message: `Regarde le chiffre des ${suivant} : il est inférieur à 5, on garde le même chiffre.` };
          return { etat: "faux" };
        },
        indice: `Regarde le chiffre des ${suivant} : s'il vaut 0, 1, 2, 3 ou 4, on arrondit en dessous ; s'il vaut 5, 6, 7, 8 ou 9, on arrondit au-dessus.`,
        correction: `${d(tronque)} ${inf} ${d(m)} ${inf} ${d(tronque + p)}. Le chiffre des ${suivant} est ${chiffreDe(m, Math.log10(p) - 4)} : l'arrondi ${nom} est ${d(r)}.`
      };
    }
  },

  {
    groupe: D4,
    id: "arrondi-demi-droite",
    titre: "L'arrondi sur la demi-droite",
    description: "L'arrondi, c'est la graduation la plus proche.",
    generer() {
      const auDixieme = Math.random() < 0.6;
      const pas = auDixieme ? 100 : 10;
      const debut = auDixieme ? alea(0, 15) * 1000 : alea(10, 99) * 100;
      let k, reste;
      do { k = alea(0, 9); reste = alea(1, 9) * pas / 10; } while (reste === pas / 2 && Math.random() < 0.7);
      const m = debut + k * pas + reste;
      // la demi-droite est graduée plus finement pour situer le point : 100 petits intervalles
      const dr = droite({ n: 10, debut, pas, etiquettes: [0, 10], principales: 5, clic: true, lettre: "↓" });
      const X = t => dr.X(0) + (t - debut) / (10 * pas) * (dr.X(10) - dr.X(0));
      dr.svg.append(svg("circle", { cx: X(m), cy: dr.y, r: 5, class: "pt-nombre" }), svg("text", { x: X(m), y: dr.y - 14, class: "etiq-nombre" }, d(m)));
      const r = Math.floor((m + pas / 2) / pas) * pas;
      return {
        consigne: `Le point rouge a pour abscisse ${d(m)}. Clique sur la graduation la plus proche : c'est l'arrondi ${auDixieme ? "au dixième" : "au centième"}.`,
        figure: dr.svg,
        verifier() {
          if (dr.position == null) return { etat: "incomplet", message: "Clique sur une graduation." };
          return debut + dr.position * pas === r ? { etat: "juste" } : { etat: "faux", message: `Tu as choisi ${d(debut + dr.position * pas)} : est-ce vraiment la plus proche ?` };
        },
        indice: "Parmi les deux graduations qui entourent le point, laquelle est la plus proche ?",
        correction: `${d(m)} est entre ${d(Math.floor(m / pas) * pas)} et ${d(Math.floor(m / pas) * pas + pas)} ; la plus proche est ${d(r)} : c'est l'arrondi ${auDixieme ? "au dixième" : "au centième"}.`,
        bloquer() { dr.actif = false; }
      };
    }
  },

  {
    groupe: D4,
    id: "arrondi-vie-courante",
    titre: "Arrondir dans la vie courante",
    description: "Prix au centime, temps au dixième, distances à l'unité…",
    generer() {
      const [texte, m, p, unite] = choisir([
        () => { let m; do m = alea(1000, 9999); while (m % 10 === 0); return [`Après une réduction, le prix calculé d'un article est ${d(m)} €. On ne peut payer qu'au centime près : quel prix paie-t-on (arrondi au centime) ?`, m, 10, "€"]; },
        () => { const m = 12000 + alea(0, 999); return [`Au chronomètre, Léa court le 100 m en ${d(m)} s. Le tableau d'affichage arrondit au dixième. Quel temps affiche-t-il ?`, m, 100, "s"]; },
        () => { const m = alea(2, 30) * 1000 + alea(1, 999); return [`Le GPS indique ${d(m)} km. Arrondis cette distance à l'unité.`, m, 1000, "km"]; },
        () => { const m = alea(1, 5) * 1000 + alea(1, 999); return [`Un paquet pèse ${d(m)} kg. Arrondis sa masse au dixième.`, m, 100, "kg"]; }
      ])();
      const r = Math.floor((m + p / 2) / p) * p;
      return {
        consigne: texte,
        ligne: `[d] ${unite}`,
        verifier(v) {
          const x = enMilliemes(v[0]);
          if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre." };
          return x === r ? { etat: "juste" } : { etat: "faux" };
        },
        indice: { 10: "Au centime près : 2 chiffres après la virgule.", 100: "Au dixième : 1 chiffre après la virgule.", 1000: "À l'unité : aucun chiffre après la virgule." }[p],
        correction: `L'arrondi de ${d(m)} ${p === 10 ? "au centième" : p === 100 ? "au dixième" : "à l'unité"} est ${d(r)} ${unite}.`
      };
    }
  },

  /* ================= Graphique cartésien ================= */

  {
    groupe: D5,
    id: "lire-coordonnees",
    titre: "Lire les coordonnées d'un point",
    description: "Abscisse, puis ordonnée.",
    generer() {
      const demi = Math.random() < 0.5;
      const r = repere({ xmax: 6, ymax: 5, pasX: 1, pasY: 1, fin: demi ? 0.5 : 0 });
      const noms = tirerLettres(3);
      const pts = [];
      while (pts.length < 3) {
        const x = alea(demi ? 1 : 1, demi ? 11 : 6) / (demi ? 2 : 1), y = alea(1, demi ? 9 : 5) / (demi ? 2 : 1);
        if (pts.every(p => p.x !== x || p.y !== y)) pts.push({ x, y });
      }
      pts.forEach((p, i) => pointRepere(r, p.x, p.y, noms[i]));
      const k = alea(0, 2), P = pts[k];
      return {
        consigne: `Quelles sont les coordonnées du point ${noms[k]} ?`,
        figure: r.svg,
        ligne: `${noms[k]}&thinsp;( [d] ; [d] )`,
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète l'abscisse et l'ordonnée." };
          if (x[0] === P.x && x[1] === P.y) return { etat: "juste" };
          if (x[0] === P.y && x[1] === P.x) return { etat: "faux", message: "Tu as inversé : on écrit d'abord l'abscisse (axe horizontal), puis l'ordonnée (axe vertical)." };
          return { etat: "faux" };
        },
        indice: `On lit d'abord l'abscisse sur l'axe horizontal, puis l'ordonnée sur l'axe vertical.${demi ? " Attention : il y a deux carreaux par unité." : ""}`,
        correction: `${noms[k]}(${ecrireNombre(P.x)} ; ${ecrireNombre(P.y)}) : abscisse ${ecrireNombre(P.x)} (horizontal), ordonnée ${ecrireNombre(P.y)} (vertical).`
      };
    }
  },

  {
    groupe: D5,
    id: "placer-repere",
    titre: "Placer un point dans un repère",
    description: "Cliquer pour placer A(2,5 ; 4).",
    generer() {
      const demi = Math.random() < 0.6;
      const r = repere({ xmax: 6, ymax: 5, pasX: 1, pasY: 1, fin: demi ? 0.5 : 0 });
      r.svg.classList.add("geo-clic");
      const nom = choisir(tirerLettres(4));
      const P = { x: alea(1, demi ? 11 : 6) / (demi ? 2 : 1), y: alea(1, demi ? 9 : 5) / (demi ? 2 : 1) };
      let choisi = null, marque = null, actif = true;
      r.svg.addEventListener("pointerdown", e => {
        if (!actif) return;
        const p = r.svg.createSVGPoint();
        p.x = e.clientX; p.y = e.clientY;
        const q = p.matrixTransform(r.svg.getScreenCTM().inverse());
        const pasG = demi ? 0.5 : 1;
        const vx = Math.round((q.x - r.X(0)) / (r.X(pasG) - r.X(0))) * pasG, vy = Math.round((r.Y(0) - q.y) / (r.Y(0) - r.Y(pasG))) * pasG;
        if (vx < 0 || vy < 0 || vx > 6 || vy > 5) return;
        choisi = { x: vx, y: vy };
        marque?.remove();
        marque = pointRepere(r, vx, vy, nom, "rep-point eleve");
      });
      return {
        consigne: `Place le point ${nom}(${ecrireNombre(P.x)} ; ${ecrireNombre(P.y)}) en cliquant dans le repère, puis valide.`,
        figure: r.svg,
        verifier() {
          if (!choisi) return { etat: "incomplet", message: "Clique dans le repère pour placer le point." };
          if (choisi.x === P.x && choisi.y === P.y) return { etat: "juste" };
          if (choisi.x === P.y && choisi.y === P.x) return { etat: "faux", message: "Tu as inversé l'abscisse et l'ordonnée." };
          return { etat: "faux", message: `Ton point a pour coordonnées (${ecrireNombre(choisi.x)} ; ${ecrireNombre(choisi.y)}).` };
        },
        indice: "L'abscisse (le 1er nombre) se lit sur l'axe horizontal ; l'ordonnée (le 2e) sur l'axe vertical.",
        correction: `On avance de ${ecrireNombre(P.x)} vers la droite, puis on monte de ${ecrireNombre(P.y)} (en vert).`,
        surCorrection() { pointRepere(r, P.x, P.y, nom, "rep-point correct"); },
        bloquer() { actif = false; }
      };
    }
  },

  {
    groupe: D5,
    id: "lire-graphique",
    titre: "Lire un graphique",
    description: "Température, taille, recharge : lire une valeur.",
    generer() {
      const D = donneesGraphique();
      const g = graphique(D);
      const i = alea(1, D.xs.length - 2);
      const inverse = Math.random() < 0.4;
      // Lecture inverse seulement si la valeur n'est atteinte qu'une fois
      const unique = D.ys.indexOf(D.ys[i]) === D.ys.lastIndexOf(D.ys[i]);
      const [question, reponse, unite] = inverse && unique ? D.inverse(D.xs[i], D.ys[i]) : D.question(D.xs[i], D.ys[i]);
      return {
        consigne: `${D.titre}. ${question}`,
        figure: g.svg,
        ligne: `[d] ${unite}`,
        verifier(v) {
          const r = verifierNombre(v[0], reponse);
          if (r.etat === "faux" && (lireNombre(v[0]) === D.xs[i] || lireNombre(v[0]) === D.ys[i])) r.message = "Tu as lu sur le mauvais axe.";
          return r;
        },
        indice: inverse ? `Pars de ${D.ys[i]} sur l'axe vertical, va jusqu'à la courbe, puis descends lire sur l'axe horizontal.` : `Pars de ${D.xs[i]} sur l'axe horizontal, monte jusqu'à la courbe, puis lis sur l'axe vertical.`,
        correction: `Au point de la courbe d'abscisse ${D.xs[i]} ${D.uX}, l'ordonnée est ${D.ys[i]} ${D.uY}.`,
        surCorrection() {
          g.svg.append(svg("path", { d: `M${g.X(D.xs[i])},${g.Y(D.origineY || 0)} V${g.Y(D.ys[i])} H${g.X(D.xmin)}`, class: "lecture" }));
        }
      };
    }
  },

  {
    groupe: D5,
    id: "quel-graphique",
    titre: "Du tableau au graphique",
    description: "Choisir le graphique qui correspond à un tableau de valeurs.",
    generer() {
      const D = donneesGraphique();
      const n = 5;
      const idx = [0, 2, 4, 6, 8];
      const base = { ...D, xs: idx.map(i => D.xs[i]), ys: idx.map(i => D.ys[i]) };
      const permuts = [[0, 1, 2, 3, 4], [0, 2, 1, 3, 4], [0, 1, 2, 4, 3]];
      const options = melanger(permuts.map((p, k) => ({ k, D: { ...base, ys: p.map(i => base.ys[i]) } })));
      const tab = `<table class="tab-effectifs"><tr><th>${cap(D.nomX)}</th>${base.xs.map(x => `<td>${x}</td>`).join("")}</tr><tr><th>${cap(D.nomY)}</th>${base.ys.map(y => `<td>${y}</td>`).join("")}</tr></table>`;
      const cadre = el("div");
      cadre.innerHTML = `<p class="diag-titre">${D.titre}</p>` + tab;
      return {
        consigne: "Quel graphique représente ce tableau ? Clique dessus.",
        figure: cadre,
        choix: options.map(o => graphique(o.D, { largeur: 190, hauteur: 140, petit: true }).svg),
        verifier: (v, c) => ({ etat: options[c].k === 0 ? "juste" : "faux", message: options[c]?.k !== 0 ? "Compare les points un par un avec les colonnes du tableau." : "" }),
        indice: "Chaque colonne du tableau donne un point : l'abscisse en haut, l'ordonnée en bas.",
        correction: "Le bon graphique place chaque point du tableau : " + base.xs.map((x, i) => `(${x} ; ${base.ys[i]})`).join(", ") + "."
      };
    }
  }

];
