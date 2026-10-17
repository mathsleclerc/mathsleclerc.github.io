/* =====================================================================
   EXERCISEUR « FRACTIONS » — 6e

   Les activités sont rangées comme les feuilles d'exercices du chapitre 3.
   Chaque activité a :
     id          → utilisé dans l'adresse : …/fractions-6e/#lire-fraction
     titre, description
     generer()   → fabrique une question au hasard

   Une question contient : consigne, figure (facultatif), ligne (avec les
   cases à compléter, voir moteur.js), verifier(), indice et correction.

   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const inf = "&lt;", sup = "&gt;";
const symbole = s => s === "<" ? inf : s === ">" ? sup : "=";
const LETTRES = "ABCDEFGHKM".split("");
const graduations = n => n + (n > 1 ? " graduations" : " graduation");

const nb = x => ecrireNombre(x);

const F1 = "Feuille 1 — Fractions et partage de surfaces";
const F2 = "Feuille 2 — Fractions de longueurs et de grandeurs";
const F3 = "Feuille 3 — Égalités de fractions";
const F4 = "Feuille 4 — Fractions d'une quantité";
const F5 = "Feuille 5 — Pourcentages simples et fractions";
const F6 = "Feuille 6 — Fractions sur une demi-droite graduée";
const F7 = "Feuille 7 — Additionner et soustraire des fractions";
const F8 = "Feuille 8 — Problèmes de fraction restante";

function pgcd(a, b) { return b ? pgcd(b, a % b) : a; }
function ppcm(a, b) { return a / pgcd(a, b) * b; }

/* Pourcentages usuels du cours : [pourcentage, numérateur, dénominateur, en mots] */
const USUELS = [[50, 1, 2, "la moitié"], [25, 1, 4, "le quart"], [75, 3, 4, "les trois quarts"],
  [10, 1, 10, "le dixième"], [20, 1, 5, "le cinquième"], [100, 1, 1, "le tout"]];

const NOMS_PARTS = { 2: "demis", 3: "tiers", 4: "quarts", 5: "cinquièmes", 6: "sixièmes", 7: "septièmes", 8: "huitièmes", 9: "neuvièmes", 10: "dixièmes", 12: "douzièmes" };
const nomParts = b => NOMS_PARTS[b] || b + "es parts";

/* Message quand l'élève a additionné (ou soustrait) les numérateurs ET les dénominateurs. */
function piegeDenominateurs(v, x, bx, y, by, plus) {
  const n = lireEntier(v.num), d = lireEntier(v.den);
  const attenduN = plus ? x + y : x - y, attenduD = plus ? bx + by : Math.abs(bx - by);
  if (n === attenduN && d === attenduD) {
    return `On ne peut pas ${plus ? "additionner" : "soustraire"} les numérateurs et les dénominateurs : `
      + `des ${nomParts(bx)} et des ${nomParts(by)} ne sont pas les mêmes parts. Cherche d'abord des parts communes.`;
  }
  return "";
}

/* ---------- Figures ---------- */

/* Une bande partagée en b parts égales, dont a coloriées. */
function bande(b, a) {
  const l = 300 / b;
  const s = svg("svg", { viewBox: "-2 -2 304 54", width: 304, height: 54, role: "img", "aria-label": `Bande partagée en ${b} parts égales, dont ${a} coloriées` });
  for (let i = 0; i < b; i++) s.append(svg("rect", { x: i * l, y: 0, width: l, height: 50, class: "fig-part" + (i < a ? " coloriee" : "") }));
  return s;
}

/* Une bande partagée en b parts égales : a parts bleues, puis c parts vertes. */
function bandeDeuxCouleurs(b, a, c) {
  const l = 300 / b;
  const s = svg("svg", { viewBox: "-2 -2 304 54", width: 304, height: 54, role: "img",
    "aria-label": `Bande partagée en ${b} parts égales : ${a} parts bleues et ${c} parts vertes` });
  for (let i = 0; i < b; i++) {
    s.append(svg("rect", { x: i * l, y: 0, width: l, height: 50, class: "fig-part" + (i < a ? " bleue" : i < a + c ? " verte" : "") }));
  }
  return s;
}

/* Deux bandes de même longueur, l'une sous l'autre. */
function deuxBandes(haut, bas) {
  return el("div", { style: "display:grid;gap:10px;justify-items:center" }, haut, bas);
}

/* Secteur de disque (angles en radians, 0 = en haut). */
function secteur(c, r, a1, a2) {
  const pt = a => (c + r * Math.sin(a)).toFixed(2) + "," + (c - r * Math.cos(a)).toFixed(2);
  return `M${c},${c} L${pt(a1)} A${r},${r} 0 ${a2 - a1 > Math.PI ? 1 : 0} 1 ${pt(a2)} Z`;
}

/* Rend cliquables les parts (.fig-part) d'une ou plusieurs figures : un clic colorie, un autre efface. */
function partsACliquer(figures) {
  const parts = figures.flatMap(f => [...f.querySelectorAll(".fig-part")]);
  let actif = true;
  for (const f of figures) f.classList.add("fig-clic");
  for (const p of parts) {
    p.setAttribute("tabindex", "0");
    p.setAttribute("role", "button");
    const basculer = () => { if (actif) p.classList.toggle("coloriee"); };
    p.addEventListener("click", basculer);
    p.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); e.stopPropagation(); basculer(); } });
  }
  return {
    compte: () => parts.filter(p => p.classList.contains("coloriee")).length,
    montrer(n) { parts.forEach((p, i) => p.classList.toggle("coloriee", i < n)); },
    bloquer() { actif = false; for (const f of figures) f.classList.add("bloquee"); }
  };
}

/* Une figure de b parts, à colorier : bande, disque ou rectangle quadrillé. */
function figureVide(forme, b) {
  if (forme === "disque") return disque(b, 0);
  if (forme === "grille") return rectangle(b, 0, choisir(dispositionsRectangle(b).filter(d => d[0] > 1)));
  return bande(b, 0);
}

/* Schéma « en barre » d'une quantité N partagée en b parts, dont a prises. */
function schemaQuantite(N, unite, b, a) {
  const L = 300, x0 = 10, l = L / b;
  const s = svg("svg", { viewBox: `0 0 ${L + 20} 122`, width: L + 20, height: 122, class: "fig-schema", role: "img",
    "aria-label": `Schéma : ${N} ${unite} partagés en ${b} parts égales, ${a} parts prises` });
  s.append(svg("path", { d: `M${x0},34 v-8 H${x0 + L} v8`, class: "accolade" }),
    svg("text", { x: x0 + L / 2, y: 18 }, `${nb(N)} ${unite}`.trim()));
  for (let i = 0; i < b; i++) s.append(svg("rect", { x: x0 + i * l, y: 38, width: l, height: 42, class: "fig-part" + (i < a ? " coloriee" : "") }));
  s.append(svg("path", { d: `M${x0},86 v8 H${x0 + a * l} v-8`, class: "accolade" }),
    svg("text", { x: x0 + a * l / 2, y: 114 }, `${a} part${a > 1 ? "s" : ""}`));
  return {
    noeud: s,
    remplir(valeur) {
      if (s.querySelector(".valeur")) return;
      for (let i = 0; i < b; i++) s.append(svg("text", { x: x0 + (i + 0.5) * l, y: 65, class: "valeur", style: b > 8 ? "font-size:14px" : "" }, nb(valeur)));
    }
  };
}

/* Un problème à plusieurs questions. Réponse r : un nombre, ou [a, b] pour une fraction. */
function probleme(enonce, etapes) {
  const numeroter = etapes.length > 1;
  return {
    consigne: enonce,
    classeLigne: "etapes",
    ligne: etapes.map((e, k) => `<div class="etape-pb"><p>${numeroter ? k + 1 + ". " : ""}${e.q}</p><p class="rep">${Array.isArray(e.r) ? "[f]" : "[d]"} ${e.unite || ""}</p></div>`).join(""),
    verifier(v) {
      const res = etapes.map((e, k) => Array.isArray(e.r) ? verifierFraction(v[k], ...e.r) : verifierNombre(v[k], e.r));
      if (res.some(r => r.etat === "incomplet")) return { etat: "incomplet", message: "Réponds à chaque question." };
      const fausses = res.map((r, k) => r.etat === "faux" ? k : -1).filter(k => k >= 0);
      if (!fausses.length) return { etat: "juste" };
      const messages = fausses.map(k => etapes[k].piege?.(v[k]) || res[k].message).filter(Boolean);
      return { etat: "faux", message: (numeroter ? `À revoir : question ${fausses.map(k => k + 1).join(" et ")}. ` : "") + messages.join(" ") };
    },
    indice: "Écris chaque calcul. Pour ajouter ou enlever des fractions, écris-les d'abord avec le même dénominateur ; le tout s'écrit 1.",
    correction: etapes.map((e, k) => `<br>${numeroter ? k + 1 + ". " : ""}${e.calcul}`).join("")
  };
}

/* « Colorier une fraction » : a/b, avec une figure (a < b) ou plusieurs bandes unités (a > b). */
function questionColorier(a, b, forme) {
  const plusQueUn = a > b;
  const unites = plusQueUn ? Math.min(4, Math.ceil(a / b) + (Math.random() < 0.4 ? 1 : 0)) : 1;
  const figures = Array.from({ length: unites }, () => plusQueUn ? bande(b, 0) : figureVide(forme, b));
  const c = partsACliquer(figures);
  const n = Math.floor(a / b), r = a % b;
  return {
    consigne: plusQueUn
      ? `Chaque bande représente une unité. Colorie ${frac(a, b)} en cliquant sur les parts, puis valide.`
      : `Colorie ${frac(a, b)} de la figure en cliquant sur les parts, puis valide.`,
    figure: figures,
    verifier() {
      const k = c.compte();
      if (!k) return { etat: "incomplet", message: "Clique sur les parts pour les colorier (un nouveau clic efface)." };
      if (k === a) return { etat: "juste" };
      return { etat: "faux", message: `Tu as colorié ${k} part${k > 1 ? "s" : ""} : cela fait ${frac(k, b)}${plusQueUn ? " d'unité" : ""}.` };
    },
    indice: plusQueUn
      ? `Chaque unité est partagée en ${b} parts égales. ${frac(a, b)}, c'est ${a} parts : ${frac(a, b)} = ${n} + ${frac(r, b)}.`
      : `La figure est partagée en ${b} parts égales (le dénominateur) : colorie-en ${a} (le numérateur).`,
    correction: plusQueUn
      ? `${frac(a, b)} = ${frac(n * b, b)} + ${frac(r, b)} = ${n} + ${frac(r, b)} : on colorie ${n > 1 ? n + " unités complètes" : "une unité complète"} et ${r} part${r > 1 ? "s" : ""} de l'unité suivante.`
      : `La figure est partagée en ${b} parts égales : on en colorie ${a}.`,
    surCorrection: () => c.montrer(a),
    bloquer: c.bloquer
  };
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "lire-fraction",
    titre: "Lire une fraction",
    description: "Quelle fraction de la figure est coloriée ?",
    generer() {
      const b = alea(2, 10);
      const plusQueUn = Math.random() < 0.25;
      const a = plusQueUn ? alea(b + 1, 2 * b - 1) : alea(1, b - 1);
      const forme = choisir(["disque", "rectangle", "bande"]);
      // Toutes les unités ont le même découpage
      const disposition = choisir(dispositionsRectangle(b));
      const dessiner = n => forme === "disque" ? disque(b, n) : forme === "bande" ? bande(b, n) : rectangle(b, n, disposition);
      const figures = [];
      for (let reste = a; reste > 0; reste -= b) figures.push(dessiner(Math.min(b, reste)));
      return {
        consigne: plusQueUn
          ? "Chaque figure représente une unité. Quelle fraction d'unité est coloriée ?"
          : "Quelle fraction de la figure est coloriée ?",
        figure: figures,
        ligne: "[f]",
        verifier: v => verifierFraction(v[0], a, b),
        indice: "Compte en combien de parts égales l'unité est partagée : c'est le dénominateur. Compte ensuite les parts coloriées : c'est le numérateur.",
        correction: `L'unité est partagée en ${b} parts égales et ${a} parts sont coloriées : la fraction coloriée est ${frac(a, b)}.`
          + (pgcd(a, b) > 1 ? ` En simplifiant, ${frac(a, b)} = ${frac(`${a} ÷ ${pgcd(a, b)}`, `${b} ÷ ${pgcd(a, b)}`)} = ${frac(a / pgcd(a, b), b / pgcd(a, b))} : c'est la fraction irréductible.` : ` Cette fraction est irréductible : on ne peut pas la simplifier.`)
      };
    }
  },

  {
    groupe: F1,
    id: "parts-egales",
    titre: "Des parts égales ?",
    description: "Les parts sont-elles égales ? Si oui, quelle fraction est coloriée ?",
    generer() {
      const egal = Math.random() < 0.5;
      const part = (d, coloriee) => svg("path", { d, class: "fig-part" + (coloriee ? " coloriee" : "") });
      let s, b, a, explication;
      if (egal) {
        const type = choisir(["bande", "disque", "diagonales", "diagonale"]);
        if (type === "bande") { b = alea(2, 8); a = alea(1, b - 1); s = rectangle(b, a, [1, b]); explication = `Les ${b} parts ont la même largeur.`; }
        else if (type === "disque") { b = alea(3, 8); a = alea(1, b - 1); s = disque(b, a); explication = `Les ${b} parts ont le même angle.`; }
        else if (type === "diagonales") {
          b = 4; a = alea(1, 3);
          s = svg("svg", { viewBox: "-2 -2 164 164", width: 164, height: 164, role: "img", "aria-label": "Carré partagé par ses deux diagonales" });
          const coins = [[0, 0], [160, 0], [160, 160], [0, 160]];
          coins.forEach((p, i) => { const q = coins[(i + 1) % 4]; s.append(part(`M80,80 L${p} L${q} Z`, i < a)); });
          explication = "Les deux diagonales partagent le carré en 4 triangles superposables.";
        } else {
          b = 2; a = 1;
          s = svg("svg", { viewBox: "-2 -2 244 124", width: 244, height: 124, role: "img", "aria-label": "Rectangle partagé par une diagonale" });
          s.append(part("M0,0 L240,0 L240,120 Z", true), part("M0,0 L0,120 L240,120 Z", false));
          explication = "La diagonale partage le rectangle en 2 triangles superposables.";
        }
      } else {
        const type = choisir(["bande", "disque", "carre"]);
        if (type === "bande" || type === "disque") {
          b = alea(3, 5);
          let poids;
          do poids = Array.from({ length: b }, () => alea(1, 3)); while (new Set(poids).size === 1);
          const total = poids.reduce((x, y) => x + y);
          a = alea(1, b - 1);
          const colories = new Set(melanger([...Array(b).keys()]).slice(0, a));
          let cumul = 0;
          if (type === "bande") {
            s = svg("svg", { viewBox: "-2 -2 304 64", width: 304, height: 64, role: "img", "aria-label": `Bande partagée en ${b} parts` });
            poids.forEach((w, i) => { const l = 300 * w / total; s.append(svg("rect", { x: cumul, y: 0, width: l, height: 60, class: "fig-part" + (colories.has(i) ? " coloriee" : "") })); cumul += l; });
            explication = "Les parts n'ont pas toutes la même largeur.";
          } else {
            s = svg("svg", { viewBox: "0 0 160 160", width: 160, height: 160, role: "img", "aria-label": `Disque partagé en ${b} parts` });
            poids.forEach((w, i) => { const t = 2 * Math.PI * w / total; s.append(part(secteur(80, 70, cumul, cumul + t), colories.has(i))); cumul += t; });
            explication = "Les parts n'ont pas toutes le même angle.";
          }
        } else {
          b = 3; a = 1;
          s = svg("svg", { viewBox: "-2 -2 164 164", width: 164, height: 164, role: "img", "aria-label": "Carré partagé en 3 triangles" });
          const coloriee = alea(0, 2);
          s.append(part("M0,0 L0,160 L160,160 Z", coloriee === 0), part("M0,0 L160,0 L80,80 Z", coloriee === 1), part("M160,0 L160,160 L80,80 Z", coloriee === 2));
          explication = "Le grand triangle est la moitié du carré, les deux petits en sont chacun le quart : les 3 parts ne sont pas égales, ce ne sont pas des tiers.";
        }
      }
      return {
        consigne: "Observe la figure.",
        figure: s,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Les parts sont-elles égales ?</p><p class="rep">[s]</p></div>`
          + `<div class="etape-pb"><p>2. Si oui, quelle fraction de la figure est coloriée ?</p><p class="rep">[f]</p></div>`,
        listes: [["Oui", "Non"]],
        verifier(v) {
          if (v[0] == null) return { etat: "incomplet", message: "Réponds d'abord à la question 1." };
          if (!egal) {
            return v[0] === 1 ? { etat: "juste" }
              : { etat: "faux", message: "Compare bien la taille des parts : une fraction n'a de sens que si les parts sont de même grandeur." };
          }
          if (v[0] === 1) return { etat: "faux", message: "Regarde mieux : les parts ont toutes la même taille." };
          const r = verifierFraction(v[1], a, b);
          if (r.etat === "incomplet") r.message = "Les parts sont égales : écris la fraction coloriée.";
          return r;
        },
        indice: "Les parts doivent avoir exactement la même taille (même aire) : on pourrait les superposer.",
        correction: egal
          ? `Oui, les parts sont égales. ${explication} ${a} part${a > 1 ? "s" : ""} sur ${b} ${a > 1 ? "sont coloriées" : "est coloriée"} : ${frac(a, b)}.`
          : `Non. ${explication} On ne peut pas écrire la fraction coloriée en comptant les parts.`
      };
    }
  },

  {
    groupe: F1,
    id: "colorier",
    titre: "Colorier une fraction",
    description: "Colorier la fraction demandée d'une figure.",
    generer() {
      const forme = choisir(["bande", "disque", "grille"]);
      const b = forme === "grille" ? choisir([4, 6, 8, 9, 10, 12]) : alea(2, 10);
      return questionColorier(alea(1, b - 1), b, forme);
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "colorier-plus-que-un",
    titre: "Colorier une fraction supérieure à 1",
    description: "Représenter 7/3, 9/5… avec des bandes unités.",
    generer() {
      const b = alea(2, 6), a = alea(b + 1, 3 * b - 1);
      if (a % b === 0) return this.generer();
      return questionColorier(a, b);
    }
  },

  {
    groupe: F2,
    id: "entier-et-fraction",
    titre: "Entier et fraction",
    description: "7/3 = 6/3 + 1/3 = 2 + 1/3, et dans l'autre sens.",
    generer() {
      const b = alea(2, 9), n = alea(1, 5), r = alea(1, b - 1), a = n * b + r;
      if (Math.random() < 0.3) {
        return {
          consigne: "Écris sous la forme d'une seule fraction.",
          ligne: `${n} + ${frac(r, b)} = [f/${b}]`,
          verifier: v => verifierNombre(v[0].num, a),
          indice: `Écris d'abord ${n} avec le dénominateur ${b} : ${n} = ${frac("…", b)}.`,
          correction: `${n} = ${frac(n * b, b)}, donc ${n} + ${frac(r, b)} = ${frac(n * b, b)} + ${frac(r, b)} = ${frac(a, b)}.`
        };
      }
      return {
        consigne: "Écris cette fraction comme la somme d'un nombre entier et d'une fraction inférieure à 1.",
        ligne: `${frac(a, b)} = [f/${b}] + [f/${b}] = [n] + [f/${b}]`,
        verifier(v) {
          const x = [v[0].num, v[1].num, v[2], v[3].num].map(lireEntier);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète toutes les cases avec des nombres entiers." };
          if (x[0] !== n * b || x[1] !== r) {
            if (x[0] + x[1] === a) return { etat: "faux", message: `Ton égalité est vraie, mais la première fraction doit faire un nombre entier d'unités : ${frac(b, b)}, ${frac(2 * b, b)}, ${frac(3 * b, b)}…, et la seconde doit être inférieure à 1.` };
            return { etat: "faux", message: `Cherche le plus grand multiple de ${b} inférieur à ${a}.` };
          }
          if (x[2] !== n) return { etat: "faux", message: `${frac(n * b, b)} = ${n * b} ÷ ${b}.` };
          return x[3] === r ? { etat: "juste" } : { etat: "faux" };
        },
        indice: `Cherche combien de fois ${b} « rentre » dans ${a}.`,
        correction: `${a} = ${n} × ${b} + ${r}, donc ${frac(a, b)} = ${frac(n * b, b)} + ${frac(r, b)} = ${n} + ${frac(r, b)}.`
      };
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: F3,
    id: "egalites-bandes",
    titre: "Égalités avec des bandes",
    description: "Lire ou colorier deux bandes qui représentent la même longueur.",
    generer() {
      let b, k;
      do { b = alea(2, 5); k = alea(2, 4); } while (b * k > 15);
      const a = alea(1, b - 1), B = b * k, A = a * k;
      if (Math.random() < 0.5) {
        const petitEnHaut = Math.random() < 0.6;
        const [h, bas] = petitEnHaut ? [[a, b], [A, B]] : [[A, B], [a, b]];
        return {
          consigne: "Les deux bandes ont la même longueur et la même partie coloriée. Complète l'égalité illustrée.",
          figure: deuxBandes(bande(h[1], h[0]), bande(bas[1], bas[0])),
          ligne: `${frac(...h)} = [f]`,
          verifier(v) {
            const r = verifierFraction(v[0], ...bas);
            if (r.etat === "juste" && (lireEntier(v[0].num) !== bas[0] || lireEntier(v[0].den) !== bas[1])) {
              return { etat: "faux", message: "Ta fraction est bien égale, mais écris celle de la seconde bande : compte ses parts." };
            }
            return r;
          },
          indice: "Compte les parts de la seconde bande (dénominateur), puis ses parts coloriées (numérateur).",
          correction: petitEnHaut
            ? `Chaque part de la première bande a été partagée en ${k} : ${frac(a, b)} = ${frac(`${a} × ${k}`, `${b} × ${k}`)} = ${frac(A, B)}.`
            : `On regroupe les parts ${k} par ${k} : ${frac(A, B)} = ${frac(`${A} ÷ ${k}`, `${B} ÷ ${k}`)} = ${frac(a, b)}.`
        };
      }
      const seconde = bande(B, 0), c = partsACliquer([seconde]);
      return {
        consigne: "Colorie la seconde bande pour qu'elle représente la même longueur que la première, puis complète l'égalité.",
        figure: deuxBandes(bande(b, a), seconde),
        ligne: `${frac(a, b)} = [f/${B}]`,
        verifier(v) {
          const n = lireEntier(v[0].num), coloriees = c.compte();
          if (!coloriees || isNaN(n)) return { etat: "incomplet", message: "Colorie la seconde bande et complète le numérateur." };
          if (coloriees !== A) return { etat: "faux", message: `Tu as colorié ${coloriees} parts : ce n'est pas la même longueur que sur la première bande.` };
          if (n !== A) return { etat: "faux", message: "Ta bande est juste : compte ses parts coloriées pour trouver le numérateur." };
          return { etat: "juste" };
        },
        indice: `Chaque part de la première bande correspond à ${k} parts de la seconde.`,
        correction: `Chaque part de la première bande correspond à ${k} parts de la seconde : on colorie ${a} × ${k} = ${A} parts. ${frac(a, b)} = ${frac(`${a} × ${k}`, `${b} × ${k}`)} = ${frac(A, B)}.`,
        surCorrection: () => c.montrer(A),
        bloquer: c.bloquer
      };
    }
  },

  {
    groupe: F3,
    id: "egalites",
    titre: "Fractions égales",
    description: "Compléter une égalité de fractions.",
    generer() {
      const b = alea(2, 10), k = alea(2, 6), a = alea(1, 2 * b);
      // [ligne, réponse, réponse de l'élève qui ajoute (ou enlève) le même nombre]
      const variantes = [
        [`${frac(a, b)} = [f/${b * k}]`, a * k, a + (b * k - b)],
        [`${frac(a, b)} = [f${a * k}/]`, b * k, b + (a * k - a)],
        [`${frac(a * k, b * k)} = [f/${b}]`, a, a * k - (b * k - b)],
        [`${frac(a * k, b * k)} = [f${a}/]`, b, b * k - (a * k - a)]
      ];
      const i = alea(0, 3);
      const [ligne, attendu, ajout] = variantes[i];
      return {
        consigne: "Complète l'égalité.",
        ligne,
        verifier(v) {
          const reponse = i % 2 === 0 ? v[0].num : v[0].den;
          const r = verifierNombre(reponse, attendu);
          if (r.etat === "faux" && lireNombre(reponse) === ajout) {
            r.message = `On ne peut pas ${i < 2 ? "ajouter" : "enlever"} le même nombre en haut et en bas : il faut ${i < 2 ? "multiplier" : "diviser"} le numérateur et le dénominateur par le même nombre.`;
          }
          return r;
        },
        indice: "Une fraction ne change pas quand on multiplie (ou divise) son numérateur et son dénominateur par un même nombre.",
        correction: i < 2
          ? `On multiplie le numérateur et le dénominateur par ${k} : ${frac(a, b)} = ${frac(`${a} × ${k}`, `${b} × ${k}`)} = ${frac(a * k, b * k)}.`
          : `On divise le numérateur et le dénominateur par ${k} : ${frac(a * k, b * k)} = ${frac(`${a * k} ÷ ${k}`, `${b * k} ÷ ${k}`)} = ${frac(a, b)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "trouver-intrus",
    titre: "Trouver l'intrus",
    description: "Quatre fractions sont égales, une ne l'est pas.",
    generer() {
      let a, b;
      do { b = alea(2, 7); a = alea(1, b - 1); } while (pgcd(a, b) !== 1);
      const ks = melanger([1, 2, 3, 4, 5, 6, 7, 8, 10]).slice(0, 4);
      if (100 % b === 0 && Math.random() < 0.5) ks[3] = 100 / b;
      const egales = [...new Set(ks)].map(k => [a * k, b * k]);
      if (egales.length < 4) return this.generer();
      const piege = choisir(["ajout", "ajout", "voisin"]);
      let intrus, pourquoi;
      if (piege === "ajout") {
        const d = alea(1, 4);
        intrus = [a + d, b + d];
        pourquoi = `on a ajouté ${d} au numérateur et au dénominateur de ${frac(a, b)}, ce qui ne donne pas une fraction égale`;
      } else {
        const k = alea(2, 5);
        intrus = [a * k, b * k + choisir([-1, 1])];
        pourquoi = `pour être égale à ${frac(a, b)}, son dénominateur devrait être ${b} × ${k} = ${b * k}`;
      }
      const html = frac(...intrus);
      const choix = melanger([...egales, intrus]).map(f => frac(...f));
      return {
        consigne: "Trouve l'intrus : quatre de ces fractions sont égales, une ne l'est pas.",
        choix,
        verifier: (v, ch) => ch === html ? { etat: "juste" } : { etat: "faux", message: `La fraction choisie est égale à ${frac(a, b)} : ce n'est pas l'intrus.` },
        indice: `Simplifie chaque fraction (divise le numérateur et le dénominateur par un même nombre) : quatre d'entre elles donnent ${frac(a, b)}.`,
        correction: `${egales.map(f => frac(...f)).join(", ")} sont égales à ${frac(a, b)} (on a multiplié le numérateur et le dénominateur par un même nombre). L'intrus est ${html} : ${pourquoi}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "quantite-schema",
    titre: "Fraction d'une quantité avec un schéma",
    description: "Une part (÷ b), puis a parts (× a), sur un schéma en barre.",
    generer() {
      const b = choisir([3, 4, 5, 6, 8, 10]), a = alea(2, b - 1), part = alea(2, b > 6 ? 9 : 15), N = b * part;
      const [objet, unite] = choisir([["billes", "billes"], ["élèves", "élèves"], ["€", "€"], ["cm de ruban", "cm"], ["g de farine", "g"], ["L d'eau", "L"]]);
      const schema = schemaQuantite(N, objet, b, a);
      return {
        consigne: `Utilise le schéma pour calculer ${frac(a, b)} de ${nb(N)} ${objet}.`,
        figure: schema.noeud,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Une part : ${nb(N)} ÷ ${b} =</p><p class="rep">[n] ${unite}</p></div>`
          + `<div class="etape-pb"><p>2. ${a} parts, donc ${frac(a, b)} de ${nb(N)} ${objet} =</p><p class="rep">[n] ${unite}</p></div>`,
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux cases." };
          if (x[0] !== part) return { etat: "faux", message: `On partage ${nb(N)} en ${b} parts égales : on divise par ${b}.` };
          schema.remplir(part);
          if (x[1] === part * a) return { etat: "juste" };
          if (Number.isInteger(N / a) && x[1] === N / a * b) return { etat: "faux", message: "Tu as divisé par le numérateur. Le dénominateur indique en combien de parts on partage." };
          return { etat: "faux", message: `Une part vaut ${nb(part)} ${unite} : prends-en ${a}.` };
        },
        indice: `Le schéma est partagé en ${b} parts égales : une part vaut ${nb(N)} ÷ ${b}. Ensuite, on prend ${a} parts.`,
        correction: `Une part : ${nb(N)} ÷ ${b} = ${nb(part)} ${unite}. ${a} parts : ${nb(part)} × ${a} = ${nb(part * a)} ${unite}. Donc ${frac(a, b)} de ${nb(N)} ${objet} = ${nb(part * a)} ${unite}.`,
        bloquer: () => schema.remplir(part)
      };
    }
  },

  {
    groupe: F4,
    id: "fraction-d-une-quantite",
    titre: "Fraction d'une quantité",
    description: "Calculer une fraction d'un nombre, dans des problèmes.",
    generer() {
      const b = choisir([2, 3, 4, 5, 6, 8, 10]), a = alea(1, b - 1), N = b * alea(2, 12);
      const part = N / b, res = part * a;
      const f = frac(a, b), les = a === 1 ? "le" : "les";
      const [texte, unite] = choisir([
        [`Dans une classe de ${N} élèves, ${les} ${f} sont demi-pensionnaires. Combien d'élèves sont demi-pensionnaires ?`, "élèves"],
        [`Léa a lu ${les} ${f} d'un livre de ${N} pages. Combien de pages a-t-elle lues ?`, "pages"],
        [`Un gâteau pèse ${N} g. On en mange ${les} ${f}. Quelle masse de gâteau a-t-on mangée ?`, "g"],
        [`Un film dure ${N} minutes. Sarah en a regardé ${les} ${f}. Combien de minutes a-t-elle regardées ?`, "min"],
        [`Une bouteille contient ${N} cL de jus. On en verse ${les} ${f} dans des verres. Combien de centilitres a-t-on versés ?`, "cL"],
        [`Calcule ${les} ${f} de ${N}.`, ""]
      ]);
      return {
        consigne: texte,
        ligne: `[n] ${unite}`,
        verifier(v) {
          const r = verifierNombre(v[0], res), x = lireNombre(v[0]);
          if (r.etat !== "faux") return r;
          if (a > 1 && x === part) r.message = `Tu as calculé ${frac(1, b)} de ${N}. Il en faut ${a} fois plus.`;
          else if (a > 1 && Number.isInteger(N / a) && x === N / a * b) r.message = `Tu as divisé par ${a}, le numérateur. Le dénominateur indique en combien de parts on partage : on divise par ${b}.`;
          return r;
        },
        indice: `Commence par calculer ${frac(1, b)} de ${N}, c'est-à-dire ${N} ÷ ${b}.`,
        correction: `${frac(1, b)} de ${N}, c'est ${N} ÷ ${b} = ${part}.`
          + (a > 1 ? ` Donc ${f} de ${N}, c'est ${part} × ${a} = ${res}.` : "")
      };
    }
  },

  /* ================= Feuille 5 ================= */

  {
    groupe: F5,
    id: "pourcentages-fractions",
    titre: "Pourcentages et fractions",
    description: "Relier, traduire : 25 % = 1/4, 26 % = 26/100…",
    generer() {
      const cas = choisir(["relier", "relier", "vers-fraction", "sur-cent", "vers-pourcentage", "vrai-faux"]);
      if (cas === "relier") {
        const paires = melanger([...USUELS]).slice(0, 5);
        const r = relier(paires.map(([t]) => ({ html: t + " %", cle: t })), paires.map(([t, a, b]) => ({ html: b === 1 ? "1" : frac(a, b), cle: t })));
        return {
          consigne: "Relie chaque pourcentage à la fraction égale : clique sur un pourcentage, puis sur sa fraction.",
          figure: r.noeud,
          verifier: r.verifier,
          indice: "50 % = la moitié, 25 % = le quart, 75 % = les trois quarts, 10 % = le dixième, 20 % = le cinquième, 100 % = le tout.",
          correction: "Les liens justes sont en vert, les liens faux en rouge. " + paires.map(([t, a, b, mots]) => `${t} % = ${b === 1 ? "1" : frac(a, b)} (${mots})`).join(" ; ") + ".",
          surCorrection: r.corriger,
          bloquer: r.bloquer
        };
      }
      if (cas === "vers-fraction") {
        const [t, a, b, mots] = choisir(USUELS.slice(0, 5));
        return {
          consigne: `Écris ${t} % sous forme d'une fraction simple.`,
          ligne: `${t} % = [f]`,
          verifier(v) {
            const r = verifierFraction(v[0], a, b);
            if (r.etat === "juste" && lireEntier(v[0].den) === 100) r.message = `C'est juste, et on peut simplifier : ${t} % = ${frac(a, b)}, c'est ${mots}.`;
            if (r.etat === "faux" && lireEntier(v[0].num) === Math.floor(t / 10) && lireEntier(v[0].den) === t % 10) {
              r.message = `On ne sépare pas les chiffres de ${t} ! ${t} % = ${frac(t, 100)} : ${t} parts sur 100.`;
            }
            return r;
          },
          indice: `${t} % = ${frac(t, 100)}. Pense aux pourcentages usuels du cours.`,
          correction: `${t} % = ${frac(t, 100)} = ${frac(a, b)} : c'est ${mots}.`
        };
      }
      if (cas === "sur-cent") {
        const t = alea(1, 99);
        return {
          consigne: "Écris ce pourcentage sous forme d'une fraction de dénominateur 100.",
          ligne: `${t} % = [f/100]`,
          verifier: v => verifierNombre(v[0].num, t),
          indice: "Un pourcentage est une fraction de dénominateur 100 : t % = t/100.",
          correction: `${t} % = ${frac(t, 100)}.`
        };
      }
      if (cas === "vers-pourcentage") {
        const [t, a, b, mots] = choisir(USUELS.slice(0, 5));
        return {
          consigne: `Écris ${mots} (${frac(a, b)}) sous forme d'un pourcentage.`,
          ligne: `${frac(a, b)} = [n] %`,
          verifier: v => verifierNombre(v[0], t),
          indice: `Écris ${frac(a, b)} avec le dénominateur 100.`,
          correction: `${frac(a, b)} = ${frac(t, 100)} = ${t} %.`
        };
      }
      const [enonce, vrai, explication] = choisir([
        ["25 % = " + frac(2, 5), false, `25 % = ${frac(25, 100)} = ${frac(1, 4)}, pas ${frac(2, 5)} : on ne sépare pas les chiffres de 25 !`],
        ["75 % = " + frac(3, 4), true, `75 % = ${frac(75, 100)} = ${frac(3, 4)}.`],
        ["20 % = " + frac(1, 20), false, `20 % = ${frac(20, 100)} = ${frac(1, 5)}, c'est le cinquième.`],
        ["10 % = " + frac(1, 10), true, `10 % = ${frac(10, 100)} = ${frac(1, 10)}, c'est le dixième.`],
        ["50 %, c'est la moitié", true, `50 % = ${frac(50, 100)} = ${frac(1, 2)}.`],
        ["20 %, c'est le quart", false, `Le quart, c'est 25 % ; 20 %, c'est le cinquième.`],
        ["100 % = 1", true, "100 % = " + frac(100, 100) + " = 1 : c'est le tout."],
        ["30 % = " + frac(3, 10), true, `30 % = ${frac(30, 100)} = ${frac(3, 10)}.`]
      ]);
      return {
        consigne: `Nina affirme : « ${enonce} ». A-t-elle raison ?`,
        choix: ["Elle a raison", "Elle a tort"],
        verifier: (v, ch) => ({ etat: (ch === "Elle a raison") === vrai ? "juste" : "faux" }),
        indice: "Écris le pourcentage sous forme d'une fraction de dénominateur 100, puis compare.",
        correction: (vrai ? "Elle a raison. " : "Elle a tort. ") + explication
      };
    }
  },

  {
    groupe: F5,
    id: "quel-pourcentage",
    titre: "Quel pourcentage ?",
    description: "Quel pourcentage de la figure est colorié ? Quel pourcentage représente… ?",
    generer() {
      const cas = choisir(["cent", "bande", "effectif"]);
      if (cas === "cent") {
        const k = alea(3, 97), s = svg("svg", { viewBox: "0 0 204 204", width: 204, height: 204, role: "img", "aria-label": "Grille de 100 carreaux" });
        for (let i = 0; i < 100; i++) {
          s.append(svg("rect", { x: 2 + (i % 10) * 20, y: 2 + Math.floor(i / 10) * 20, width: 20, height: 20, class: "fig-part" + (i < k ? " coloriee" : "") }));
        }
        return {
          consigne: "Quel pourcentage du carré est colorié ?",
          figure: s,
          ligne: "[n] %",
          verifier: v => verifierNombre(v[0], k),
          indice: "Le carré est partagé en 100 carreaux : compte les lignes complètes (10 carreaux chacune), puis les carreaux restants.",
          correction: `${k} carreaux sur 100 sont coloriés : ${frac(k, 100)} = ${k} %.`
        };
      }
      if (cas === "bande") {
        const b = choisir([2, 4, 5, 10]), a = alea(1, b - 1), t = a * 100 / b;
        return {
          consigne: "Quel pourcentage de la bande est colorié ?",
          figure: bande(b, a),
          ligne: "[n] %",
          verifier: v => verifierNombre(v[0], t),
          indice: `La bande est partagée en ${b} parts égales. Écris la fraction coloriée, puis transforme-la en fraction de dénominateur 100.`,
          correction: `${frac(a, b)} de la bande est colorié, et ${frac(a, b)} = ${frac(t, 100)} = ${t} %.`
        };
      }
      const [n, k] = choisir([[20, alea(1, 19)], [25, alea(1, 24)], [50, alea(1, 49)], [10, alea(1, 9)], [4, alea(1, 3)], [5, alea(1, 4)]]);
      const f = 100 / n, t = k * f;
      const [texte, unite] = choisir([
        [`Dans une classe de ${n} élèves, ${k} sont externes.`, "des élèves sont externes"],
        [`Sur ${n} questions, Léo en a réussi ${k}.`, "des questions sont réussies"],
        [`Sur ${n} tirs au but, Inès en a marqué ${k}.`, "des tirs sont marqués"]
      ]);
      return {
        consigne: `${texte} Quel pourcentage ${unite} ?`,
        ligne: `${frac(k, n)} = [f/100] = [n] %`,
        verifier(v) {
          const a = lireEntier(v[0].num), b = lireNombre(v[1]);
          if (isNaN(a) || isNaN(b)) return { etat: "incomplet", message: "Complète les deux cases." };
          if (a === t && b === t) return { etat: "juste" };
          if (a !== t) return { etat: "faux", message: `Pour passer du dénominateur ${n} au dénominateur 100, on multiplie par ${f} le numérateur et le dénominateur.` };
          return { etat: "faux", message: `${frac(t, 100)} = ${t} %.` };
        },
        indice: `${n} × ${f} = 100 : écris ${frac(k, n)} avec le dénominateur 100.`,
        correction: `${frac(k, n)} = ${frac(`${k} × ${f}`, `${n} × ${f}`)} = ${frac(t, 100)} = ${t} %.`
      };
    }
  },

  {
    groupe: F5,
    id: "pourcentages-usuels",
    titre: "Pourcentages usuels d'une quantité",
    description: "50 %, 25 %, 75 %, 10 %, 20 % : utiliser la fraction.",
    generer() {
      const [t, a, b, mots] = choisir(USUELS.slice(0, 5));
      const Q = b * alea(3, 60), r = Q / b * a;
      const unite = choisir(["", "", " €", " g", " élèves", " km"]);
      return {
        consigne: `Calcule en utilisant la fraction correspondante.`,
        ligne: `${t} % de ${nb(Q)}${unite} = [d]${unite}`,
        verifier(v) {
          const res = verifierNombre(v[0], r);
          if (res.etat === "faux" && lireNombre(v[0]) === Q / b && a > 1) res.message = `Tu as calculé ${frac(1, b)} de ${nb(Q)}, mais ${t} % = ${frac(a, b)} : il faut en prendre ${a} fois plus.`;
          return res;
        },
        indice: `${t} % = ${frac(a, b)} : c'est ${mots}.`,
        correction: `${t} % de ${nb(Q)}, c'est ${mots} de ${nb(Q)} : ${nb(Q)} ÷ ${b}${a > 1 ? ` × ${a}` : ""} = ${nb(r)}${unite}.`
      };
    }
  },

  {
    groupe: F5,
    id: "calculer-pourcentage",
    titre: "Calculer un pourcentage",
    description: "t % d'une quantité = quantité ÷ 100 × t.",
    generer() {
      const t = choisir([alea(2, 9), alea(11, 49), alea(51, 99), 15, 18, 26, 30, 40, 60]);
      const Q = choisir([100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500]);
      const r = Q / 100 * t;
      const cas = choisir(["guide", "direct", "decompose"]);
      const correction = `${t} % de ${nb(Q)} = ${nb(Q)} ÷ 100 × ${t} = ${nb(Q / 100)} × ${t} = ${nb(r)}.`;
      if (cas === "guide") {
        return {
          consigne: "Complète.",
          ligne: `${t} % de ${nb(Q)} = ${nb(Q)} ÷ 100 × ${t} = [n] × ${t} = [n]`,
          verifier(v) {
            const x = v.map(lireNombre);
            if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux cases." };
            if (x[0] !== Q / 100) return { etat: "faux", message: `Commence par ${nb(Q)} ÷ 100 : c'est 1 % de ${nb(Q)}.` };
            return { etat: x[1] === r ? "juste" : "faux" };
          },
          indice: "Diviser par 100, c'est calculer 1 %. Ensuite, on multiplie par le pourcentage.",
          correction
        };
      }
      if (cas === "direct") {
        return {
          consigne: "Calcule.",
          ligne: `${t} % de ${nb(Q)} = [d]`,
          verifier: v => verifierNombre(v[0], r),
          indice: "t % d'une quantité = quantité ÷ 100 × t.",
          correction
        };
      }
      // Méthode du cours : 10 % + 1 %
      const d = Math.floor(t / 10), u = t % 10;
      if (!d || !u) return this.generer();
      return {
        consigne: `Calcule ${t} % de ${nb(Q)} en passant par 10 % et 1 %.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>10 % de ${nb(Q)} =</p><p class="rep">[n]</p></div>`
          + `<div class="etape-pb"><p>1 % de ${nb(Q)} =</p><p class="rep">[n]</p></div>`
          + `<div class="etape-pb"><p>${t} % de ${nb(Q)} = ${d * 10} % + ${u} % =</p><p class="rep">[n]</p></div>`,
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les trois cases." };
          const attendus = [Q / 10, Q / 100, r];
          const fausses = attendus.map((a, k) => x[k] === a ? -1 : k + 1).filter(k => k > 0);
          if (!fausses.length) return { etat: "juste" };
          return { etat: "faux", message: `À revoir : ligne ${fausses.join(" et ")}.` };
        },
        indice: "10 %, c'est le dixième (÷ 10) ; 1 %, c'est le centième (÷ 100).",
        correction: `10 % de ${nb(Q)} = ${nb(Q / 10)} ; 1 % de ${nb(Q)} = ${nb(Q / 100)}.<br>${d * 10} % de ${nb(Q)} = ${nb(Q / 10 * d)} et ${u} % de ${nb(Q)} = ${nb(Q / 100 * u)}, donc ${t} % de ${nb(Q)} = ${nb(Q / 10 * d)} + ${nb(Q / 100 * u)} = ${nb(r)}.`
      };
    }
  },

  {
    groupe: F5,
    id: "problemes-pourcentages",
    titre: "Problèmes de pourcentages",
    description: "Soldes, effectifs, compositions…",
    generer() {
      const modele = alea(0, 3);
      if (modele === 0) {
        const t = choisir([10, 20, 25, 30, 50]), P = choisir([20, 40, 60, 80, 100, 120, 150, 200]);
        const red = P / 100 * t;
        return probleme(`Une veste coûte ${P} €. Elle est soldée à −${t} %.`, [
          { q: "Quel est le montant de la réduction ?", r: red, unite: "€", calcul: `${t} % de ${P} € = ${P} ÷ 100 × ${t} = ${nb(red)} €.` },
          { q: "Quel est le nouveau prix ?", r: P - red, unite: "€", calcul: `${P} − ${nb(red)} = ${nb(P - red)} €.`, piege: x => lireNombre(x) === red ? "Tu as donné la réduction : il faut l'enlever au prix de départ." : "" }
        ]);
      }
      if (modele === 1) {
        const N = choisir([200, 300, 400, 500, 600, 800]), t = choisir([20, 25, 30, 35, 40]);
        return probleme(`Un collège compte ${N} élèves ; ${t} % sont en 6e.`, [
          { q: "Combien y a-t-il d'élèves de 6e ?", r: N / 100 * t, unite: "élèves", calcul: `${t} % de ${N} = ${N} ÷ 100 × ${t} = ${N / 100 * t} élèves.` },
          { q: "Combien d'élèves ne sont pas en 6e ?", r: N - N / 100 * t, unite: "élèves", calcul: `${N} − ${N / 100 * t} = ${N - N / 100 * t} élèves.` }
        ]);
      }
      if (modele === 2) {
        const Q = choisir([100, 200, 300, 400, 500]), t = alea(5, 45);
        const [objet, quoi] = choisir([["Un gâteau de", "sucre"], ["Une barre de céréales de", "sucre"], ["Un sac de terreau de", "sable"]]);
        return probleme(`${objet} ${Q} g contient ${t} % de ${quoi}.`, [
          { q: `Quelle est la masse de ${quoi} ?`, r: Q / 100 * t, unite: "g", calcul: `${t} % de ${Q} g = ${Q} ÷ 100 × ${t} = ${nb(Q / 100 * t)} g.` }
        ]);
      }
      const N = choisir([20, 24, 28, 32, 40]), [t, a, b, mots] = choisir([USUELS[0], USUELS[1], USUELS[2]]);
      return probleme(`Dans une classe de ${N} élèves, ${t} % pratiquent un sport en club.`, [
        { q: "Combien d'élèves pratiquent un sport en club ?", r: N / b * a, unite: "élèves", calcul: `${t} %, c'est ${mots} : ${N} ÷ ${b}${a > 1 ? " × " + a : ""} = ${N / b * a} élèves.` },
        { q: "Quel pourcentage des élèves ne pratique pas de sport en club ?", r: 100 - t, unite: "%", calcul: `100 % − ${t} % = ${100 - t} %.` }
      ]);
    }
  },

  /* ================= Feuille 6 ================= */

  {
    groupe: F6,
    id: "lire-abscisse",
    titre: "Lire une abscisse",
    description: "Lire l'abscisse d'un point sur une demi-droite graduée.",
    generer() {
      const b = alea(2, 8), lettre = choisir(LETTRES);
      let a;
      do a = alea(1, unitesDroite() * b - 1); while (a % b === 0);
      return {
        consigne: `Quelle est l'abscisse du point ${lettre} ? Donne-la sous forme d'une fraction.`,
        figure: droiteGraduee(b, { point: a, lettre }).svg,
        ligne: `${lettre}&thinsp;( [f] )`,
        verifier: v => verifierFraction(v[0], a, b),
        indice: "Compte en combien de parts égales l'unité (de 0 à 1) est partagée.",
        correction: `L'unité est partagée en ${b} parts égales : chaque graduation vaut ${frac(1, b)}. Le point ${lettre} est à ${graduations(a)} de l'origine, donc son abscisse est ${frac(a, b)}.`
      };
    }
  },

  {
    groupe: F6,
    id: "placer-point",
    titre: "Placer un point",
    description: "Placer un point d'abscisse donnée sur une demi-droite graduée.",
    generer() {
      const b = alea(2, 6), lettre = choisir(LETTRES);
      let a;
      do a = alea(1, unitesDroite() * b - 1); while (a % b === 0);
      const d = droiteGraduee(b, { lettre, clic: true });
      return {
        consigne: `Place le point ${lettre} d'abscisse ${frac(a, b)} en cliquant sur la demi-droite graduée, puis valide.`,
        figure: d.svg,
        verifier() {
          if (d.position == null) return { etat: "incomplet", message: "Clique sur la demi-droite pour placer le point." };
          if (d.position === a) return { etat: "juste" };
          if (a > b && d.position < b) {
            return { etat: "faux", message: `${frac(a, b)} est plus grand que 1 : il y a plus de ${b} parts, donc le point est après 1. ${frac(a, b)} = ${Math.floor(a / b)} + ${frac(a % b, b)}.` };
          }
          return { etat: "faux", message: `Ton point a pour abscisse ${frac(d.position, b)}.` };
        },
        indice: `L'unité est partagée en ${b} parts égales : chaque graduation vaut ${frac(1, b)}.`,
        correction: `Chaque graduation vaut ${frac(1, b)}. On compte ${graduations(a)} à partir de 0 : le point ${lettre} est placé en vert.`,
        surCorrection: () => d.marquer(a, "pt correct", lettre),
        bloquer: () => { d.actif = false; }
      };
    }
  },

  {
    groupe: F6,
    id: "placer-differents",
    titre: "Placer avec un autre dénominateur",
    description: "Placer 3/2 ou 2/3 sur une demi-droite graduée en sixièmes.",
    generer() {
      const [m, q] = choisir([[4, 2], [6, 2], [6, 3], [8, 2], [8, 4], [9, 3], [10, 2], [10, 5], [12, 2], [12, 3], [12, 4], [12, 6]]);
      const max = unitesDroite(), k = m / q, lettre = choisir(LETTRES);
      let p;
      do p = alea(1, max * q - 1); while (p % q === 0 || pgcd(p, q) !== 1);
      const cible = p * k;
      const d = droiteGraduee(m, { lettre, clic: true, max });
      return {
        consigne: `L'unité est partagée en ${m} parts égales. Place le point ${lettre} d'abscisse ${frac(p, q)}, puis valide.`,
        figure: d.svg,
        verifier() {
          if (d.position == null) return { etat: "incomplet", message: "Clique sur la demi-droite pour placer le point." };
          if (d.position === cible) return { etat: "juste" };
          if (d.position === p) return { etat: "faux", message: `Tu as compté ${graduations(p)}, mais chaque graduation vaut ${frac(1, m)}, pas ${frac(1, q)}.` };
          return { etat: "faux", message: `Ton point a pour abscisse ${frac(d.position, m)}.` };
        },
        indice: `Écris ${frac(p, q)} avec le dénominateur ${m} : ${frac(p, q)} = ${frac(`${p} × ${k}`, `${q} × ${k}`)}.`,
        correction: `${frac(p, q)} = ${frac(`${p} × ${k}`, `${q} × ${k}`)} = ${frac(cible, m)} : on compte ${graduations(cible)} à partir de 0. Le point ${lettre} est placé en vert.`,
        surCorrection: () => d.marquer(cible, "pt correct", lettre),
        bloquer: () => { d.actif = false; }
      };
    }
  },

  {
    groupe: F6,
    id: "encadrer",
    titre: "Encadrer entre deux entiers",
    description: "Entre quels nombres entiers consécutifs se trouve la fraction ?",
    generer() {
      const b = alea(2, 9), n = alea(0, 5), r = alea(1, b - 1), a = n * b + r;
      return {
        consigne: "Encadre cette fraction entre deux nombres entiers consécutifs.",
        ligne: `[n] ${inf} ${frac(a, b)} ${inf} [n]`,
        verifier(v) {
          const e1 = lireEntier(v[0]), e2 = lireEntier(v[1]);
          if (isNaN(e1) || isNaN(e2)) return { etat: "incomplet", message: "Complète les deux cases avec des nombres entiers." };
          if (e1 === n && e2 === n + 1) return { etat: "juste" };
          if (e2 !== e1 + 1) return { etat: "faux", message: "Les deux nombres entiers doivent être consécutifs (comme 4 et 5)." };
          return { etat: "faux" };
        },
        indice: `Cherche combien de fois ${b} « rentre » dans ${a}.`,
        correction: n === 0
          ? `Le numérateur ${a} est plus petit que le dénominateur ${b}, donc ${frac(a, b)} ${inf} 1 : 0 ${inf} ${frac(a, b)} ${inf} 1.`
          : `${a} = ${n} × ${b} + ${r}, donc ${frac(a, b)} = ${n} + ${frac(r, b)}. Comme ${frac(r, b)} est compris entre 0 et 1 : ${n} ${inf} ${frac(a, b)} ${inf} ${n + 1}.`
      };
    }
  },

  {
    groupe: F6,
    id: "relier-ecritures",
    titre: "Relier les écritures égales",
    description: "11/6 = 1 + 5/6, 9/4 = 2 + 1/4…",
    generer() {
      const dens = melanger([2, 3, 4, 5, 6, 8]).slice(0, 2);
      const items = [], valeurs = new Set();
      while (items.length < 4) {
        const b = choisir(dens), n = alea(1, 3), r = Math.random() < 0.15 ? 0 : alea(1, b - 1);
        const a = n * b + r, cle = (a / b).toFixed(6);
        if (valeurs.has(cle)) continue;
        valeurs.add(cle);
        items.push({ a, b, n, r, cle });
      }
      const droite = it => it.r ? `${it.n} + ${frac(it.r, it.b)}` : String(it.n);
      const rel = relier(items.map(it => ({ html: frac(it.a, it.b), cle: it.cle })), items.map(it => ({ html: droite(it), cle: it.cle })));
      return {
        consigne: "Relie chaque fraction à l'écriture égale : clique sur une fraction, puis sur son écriture.",
        figure: rel.noeud,
        verifier: rel.verifier,
        indice: "Cherche combien d'unités entières il y a dans chaque fraction : par exemple, dans des sixièmes, 6 sixièmes font 1 unité.",
        correction: "Les liens justes sont en vert, les liens faux en rouge. "
          + items.map(it => `${frac(it.a, it.b)} = ${it.r ? `${frac(it.n * it.b, it.b)} + ${frac(it.r, it.b)} = ` : ""}${droite(it)}`).join(" ; ") + ".",
        surCorrection: rel.corriger,
        bloquer: rel.bloquer
      };
    }
  },

  {
    groupe: F6,
    id: "comparer",
    titre: "Comparer",
    description: "Comparer une fraction à 1, ou deux fractions de même dénominateur.",
    generer() {
      const b = alea(2, 12);
      if (Math.random() < 0.5) {
        const a = Math.random() < 0.15 ? b : choisir([alea(1, b - 1), alea(b + 1, 2 * b + 3)]);
        const s = a < b ? "<" : a > b ? ">" : "=";
        return {
          consigne: "Compare cette fraction à 1 : choisis le bon symbole.",
          ligne: `${frac(a, b)} [c] 1`,
          choix: ["<", "=", ">"],
          verifier: v => ({ etat: v[0] === s ? "juste" : "faux" }),
          indice: "Compare le numérateur et le dénominateur.",
          correction: a === b
            ? `Le numérateur est égal au dénominateur, donc ${frac(a, b)} = 1.`
            : `Le numérateur ${a} est ${a < b ? "plus petit" : "plus grand"} que le dénominateur ${b}, donc ${frac(a, b)} ${symbole(s)} 1.`
        };
      }
      const a1 = alea(1, 2 * b);
      let a2;
      do a2 = alea(1, 2 * b); while (a2 === a1);
      const s = a1 < a2 ? "<" : ">";
      return {
        consigne: "Compare ces deux fractions : choisis le bon symbole.",
        ligne: `${frac(a1, b)} [c] ${frac(a2, b)}`,
        choix: ["<", "=", ">"],
        verifier: v => ({ etat: v[0] === s ? "juste" : "faux" }),
        indice: "Les deux fractions ont le même dénominateur : compare les numérateurs.",
        correction: `Les deux fractions ont le même dénominateur ${b}. On compare les numérateurs : ${a1} ${symbole(s)} ${a2}, donc ${frac(a1, b)} ${symbole(s)} ${frac(a2, b)}.`
      };
    }
  },

  /* ================= Feuille 7 ================= */

  {
    groupe: F7,
    id: "addition-bande",
    titre: "L'addition sur une bande",
    description: "Écrire l'addition représentée par une bande à deux couleurs.",
    generer() {
      const b = alea(4, 12), a = alea(1, b - 2), c = alea(1, b - a);
      const egale = (v, n, d) => { const x = lireEntier(v.num), y = lireEntier(v.den); return !isNaN(x) && !isNaN(y) && y > 0 && x * d === n * y; };
      return {
        consigne: "La bande représente une unité. Écris l'addition représentée (les parts bleues plus les parts vertes), puis le résultat.",
        figure: bandeDeuxCouleurs(b, a, c),
        ligne: "[f] + [f] = [f]",
        verifier(v) {
          if (v.some(f => f.num === "" || f.den === "")) return { etat: "incomplet", message: "Complète les trois fractions." };
          const termes = (egale(v[0], a, b) && egale(v[1], c, b)) || (egale(v[0], c, b) && egale(v[1], a, b));
          if (!termes) return { etat: "faux", message: `Compte les parts bleues, puis les parts vertes : chacune vaut ${frac(1, b)} de la bande.` };
          const r = verifierFraction(v[2], a + c, b);
          if (r.etat === "faux" && lireEntier(v[2].den) === 2 * b) r.message = "Les parts ne changent pas de taille : on garde le dénominateur, on n'additionne pas les dénominateurs.";
          return r;
        },
        indice: `La bande est partagée en ${b} parts égales : chaque part vaut ${frac(1, b)}.`,
        correction: `${a} part${a > 1 ? "s" : ""} bleue${a > 1 ? "s" : ""} et ${c} part${c > 1 ? "s" : ""} verte${c > 1 ? "s" : ""} sur ${b} : ${frac(a, b)} + ${frac(c, b)} = ${frac(a + c, b)}` + (a + c === b ? " = 1." : ".")
      };
    }
  },

  {
    groupe: F7,
    id: "meme-denominateur",
    titre: "Même dénominateur",
    description: "On garde le dénominateur, on additionne ou on soustrait les numérateurs.",
    generer() {
      const b = alea(3, 12);
      const cas = choisir(["addition", "addition", "soustraction", "entier", "trou", "erreur"]);
      const regle = "On garde le dénominateur et on additionne (ou on soustrait) les numérateurs. On n'additionne jamais les dénominateurs.";
      // Réponse fraction, avec le message dédié si l'élève a additionné les dénominateurs
      const reponse = (n, d, v) => {
        const r = verifierFraction(v, n, d);
        if (r.etat === "faux" && lireEntier(v.den) === 2 * d) r.message = "On n'additionne jamais les dénominateurs : on garde le dénominateur.";
        return r;
      };
      if (cas === "addition" || cas === "soustraction") {
        let a, c;
        if (cas === "addition") { a = alea(1, b - 1); c = alea(1, b); }
        else { a = alea(2, b + 3); c = alea(1, a - 1); }
        const r = cas === "addition" ? a + c : a - c, op = cas === "addition" ? "+" : "−";
        return {
          consigne: "Calcule.",
          ligne: `${frac(a, b)} ${op} ${frac(c, b)} = [f]`,
          verifier: v => reponse(r, b, v[0]),
          indice: regle,
          correction: `${frac(a, b)} ${op} ${frac(c, b)} = ${frac(`${a} ${op} ${c}`, b)} = ${frac(r, b)}` + (r === b ? " = 1." : ".")
        };
      }
      if (cas === "entier") {
        const n = alea(1, 3), a = alea(1, b - 1), plus = Math.random() < 0.6;
        const r = plus ? n * b + a : n * b - a, op = plus ? "+" : "−";
        return {
          consigne: "Calcule.",
          ligne: `${n} ${op} ${frac(a, b)} = [f]`,
          verifier: v => verifierFraction(v[0], r, b),
          indice: `Écris d'abord ${n} sous forme d'une fraction de dénominateur ${b} : ${n} = ${frac("…", b)}.`,
          correction: `${n} = ${frac(n * b, b)}, donc ${n} ${op} ${frac(a, b)} = ${frac(n * b, b)} ${op} ${frac(a, b)} = ${frac(r, b)}.`
        };
      }
      if (cas === "trou") {
        const a = alea(1, b - 2), c = alea(1, b - a);
        const [ligne, attendu] = choisir([
          [`${frac(a, b)} + [f/${b}] = ${frac(a + c, b)}`, c],
          [`[f/${b}] + ${frac(c, b)} = ${frac(a + c, b)}`, a],
          [`${frac(a + c, b)} − [f/${b}] = ${frac(a, b)}`, c]
        ]);
        return {
          consigne: "Complète.",
          ligne,
          verifier: v => verifierNombre(v[0].num, attendu),
          indice: "Les dénominateurs sont les mêmes : il suffit de trouver le numérateur manquant.",
          correction: `Le numérateur manquant est ${attendu} : ${ligne.replace(/\[f\/\d+\]/, frac(attendu, b))}.`
        };
      }
      const a = alea(1, b - 2), c = alea(1, b - a), juste = Math.random() < 0.35;
      const resultat = juste ? frac(a + c, b) : frac(a + c, 2 * b);
      const options = ["Il a raison", "Il a tort"];
      return {
        consigne: `Hugo écrit : ${frac(a, b)} + ${frac(c, b)} = ${resultat}. A-t-il raison ?`,
        choix: options,
        verifier: (v, ch) => ({ etat: (ch === options[0]) === juste ? "juste" : "faux" }),
        indice: regle,
        correction: juste
          ? `Il a raison : on garde le dénominateur ${b} et on additionne les numérateurs.`
          : `Il a tort : il a additionné les dénominateurs. On garde le dénominateur : ${frac(a, b)} + ${frac(c, b)} = ${frac(a + c, b)}.`
      };
    }
  },

  {
    groupe: F7,
    id: "trois-fractions",
    titre: "Aller plus loin",
    description: "Trois fractions, sommes plus grandes que 1… (1/6 + 1/6 + 1/6, 3/4 + 5/8 = 11/8)",
    generer() {
      const cas = choisir(["trois", "trois", "decomposer", "multiple"]);
      if (cas === "trois") {
        const b = alea(3, 12), moins = Math.random() < 0.3;
        const t = [alea(1, b), alea(1, b), alea(1, b)];
        if (moins && t[0] + t[1] <= t[2]) return this.generer();
        const r = moins ? t[0] + t[1] - t[2] : t[0] + t[1] + t[2], op = moins ? "−" : "+";
        return {
          consigne: "Calcule.",
          ligne: `${frac(t[0], b)} + ${frac(t[1], b)} ${op} ${frac(t[2], b)} = [f]`,
          verifier(v) {
            const res = verifierFraction(v[0], r, b), d = lireEntier(v[0].den);
            if (res.etat === "faux" && (d === 3 * b || (!moins && d === 2 * b) || (moins && d === b))) {
              res.message = d === b ? "Garde bien le dénominateur, et fais les calculs dans l'ordre sur les numérateurs." : "On n'additionne jamais les dénominateurs : on garde le dénominateur.";
            }
            return res;
          },
          indice: "Même dénominateur : on le garde, et on calcule avec les numérateurs, de gauche à droite.",
          correction: `${frac(t[0], b)} + ${frac(t[1], b)} ${op} ${frac(t[2], b)} = ${frac(`${t[0]} + ${t[1]} ${op} ${t[2]}`, b)} = ${frac(r, b)}` + (r > b && r % b ? ` = ${Math.floor(r / b)} + ${frac(r % b, b)}.` : r % b === 0 ? ` = ${r / b}.` : ".")
        };
      }
      if (cas === "decomposer") {
        const b = alea(3, 10), a = alea(2, b - 1), c = alea(b - a + 1, b - 1);
        if (a + c === b) return this.generer();
        const s = a + c, n = Math.floor(s / b), r = s % b;
        return {
          consigne: "Calcule, puis écris le résultat comme la somme d'un entier et d'une fraction inférieure à 1.",
          ligne: `${frac(a, b)} + ${frac(c, b)} = [f/${b}] = [n] + [f/${b}]`,
          verifier(v) {
            const x = [v[0].num, v[1], v[2].num].map(lireEntier);
            if (x.some(isNaN)) return { etat: "incomplet", message: "Complète toutes les cases." };
            if (x[0] !== s) return { etat: "faux", message: "On garde le dénominateur et on additionne les numérateurs." };
            if (x[1] !== n || x[2] !== r) return { etat: "faux", message: `Le résultat est plus grand que 1 : ${frac(b, b)} = 1. Combien de fois ${b} « rentre » dans ${s} ?` };
            return { etat: "juste" };
          },
          indice: `${frac(b, b)} = 1.`,
          correction: `${frac(a, b)} + ${frac(c, b)} = ${frac(s, b)} = ${frac(b, b)} + ${frac(r, b)} = ${n} + ${frac(r, b)}.`
        };
      }
      let b, k, d;
      do { b = alea(2, 6); k = alea(2, 4); d = b * k; } while (d > 16);
      const a = alea(1, b - 1), c = alea(1, d - 1);
      if (a * k + c <= d) return this.generer();
      const r = a * k + c;
      return {
        consigne: `Écris les fractions avec le dénominateur ${d}, puis calcule. Le résultat est plus grand que 1.`,
        ligne: `${frac(a, b)} + ${frac(c, d)} = [f/${d}] + ${frac(c, d)} = [f]`,
        verifier(v) {
          const n1 = lireEntier(v[0].num);
          if (isNaN(n1)) return { etat: "incomplet", message: "Complète toutes les cases." };
          const fin = verifierFraction(v[1], r, d);
          if (fin.etat === "incomplet") return fin;
          if (n1 !== a * k) return { etat: "faux", message: `Pour écrire ${frac(a, b)} avec le dénominateur ${d}, on multiplie le numérateur et le dénominateur par ${k}.` };
          if (fin.etat === "faux") fin.message = piegeDenominateurs(v[1], a, b, c, d, true) || fin.message;
          return fin;
        },
        indice: `${b} × ${k} = ${d} : multiplie le numérateur et le dénominateur de ${frac(a, b)} par ${k}.`,
        correction: `${frac(a, b)} = ${frac(`${a} × ${k}`, `${b} × ${k}`)} = ${frac(a * k, d)}, donc ${frac(a, b)} + ${frac(c, d)} = ${frac(a * k, d)} + ${frac(c, d)} = ${frac(r, d)}`
          + (r % d ? ` = ${Math.floor(r / d)} + ${frac(r % d, d)}.` : ` = ${r / d}.`)
      };
    }
  },

  {
    groupe: F7,
    id: "denominateurs-multiples",
    titre: "Un dénominateur multiple de l'autre",
    description: "Écrire les fractions avec le même dénominateur, puis calculer.",
    generer() {
      let b, k, d;
      do { b = alea(2, 6); k = alea(2, 4); d = b * k; } while (d > 20);
      const a = alea(1, b - 1), c = alea(1, d - 1);
      const plus = Math.random() < 0.5;
      // la fraction de petit dénominateur a/b devient (a × k)/d ; pour une soustraction, la plus grande en premier
      if (!plus && a * k === c) return this.generer();
      const premier = plus ? choisir(["petit", "grand"]) : a * k > c ? "petit" : "grand";
      const op = plus ? "+" : "−";
      const r = plus ? a * k + c : Math.abs(a * k - c);
      const gauche = premier === "petit" ? `${frac(a, b)} ${op} ${frac(c, d)}` : `${frac(c, d)} ${op} ${frac(a, b)}`;
      const milieu = premier === "petit" ? `[f/${d}] ${op} ${frac(c, d)}` : `${frac(c, d)} ${op} [f/${d}]`;
      return {
        consigne: `${d} est un multiple de ${b}. Écris les fractions avec le dénominateur ${d}, puis calcule.`,
        ligne: `${gauche} = ${milieu} = [f]`,
        verifier(v) {
          const n1 = lireEntier(v[0].num);
          if (isNaN(n1)) return { etat: "incomplet", message: "Complète toutes les cases." };
          const fin = verifierFraction(v[1], r, d);
          if (fin.etat === "incomplet") return fin;
          if (n1 !== a * k) return { etat: "faux", message: `Pour écrire ${frac(a, b)} avec le dénominateur ${d}, on multiplie le numérateur et le dénominateur par ${k}.` };
          if (fin.etat === "faux") {
            fin.message = (premier === "petit" ? piegeDenominateurs(v[1], a, b, c, d, plus) : piegeDenominateurs(v[1], c, d, a, b, plus)) || fin.message;
          }
          return fin;
        },
        indice: `${b} × ${k} = ${d} : multiplie le numérateur et le dénominateur de ${frac(a, b)} par ${k}.`,
        correction: `${frac(a, b)} = ${frac(`${a} × ${k}`, `${b} × ${k}`)} = ${frac(a * k, d)}, donc ${gauche} = ${premier === "petit" ? `${frac(a * k, d)} ${op} ${frac(c, d)}` : `${frac(c, d)} ${op} ${frac(a * k, d)}`} = ${frac(r, d)}.`
      };
    }
  },

  {
    groupe: F7,
    id: "denominateurs-differents",
    titre: "Changer les deux dénominateurs",
    description: "Chercher des « parts communes » : un multiple des deux dénominateurs.",
    generer(stats = {}) {
      const [b, d] = melanger(choisir([[2, 3], [3, 4], [2, 5], [4, 5], [3, 5], [4, 6], [6, 8], [4, 10], [6, 9], [5, 6], [3, 8], [2, 7], [3, 10]]));
      const m = ppcm(b, d), kb = m / b, kd = m / d;
      let a = alea(1, b - 1), c = alea(1, d - 1);
      const plus = Math.random() < 0.55;
      if (!plus && a * kb === c * kd) return this.generer();
      // pour une soustraction, la plus grande fraction en premier
      let [x, y, kx, ky, bx, by] = [a, c, kb, kd, b, d];
      if (!plus && a * kb < c * kd) [x, y, kx, ky, bx, by] = [c, a, kd, kb, d, b];
      const op = plus ? "+" : "−", r = plus ? x * kx + y * ky : x * kx - y * ky;
      const defi = (stats.serie || 0) >= 3; // après 3 réussites de suite, on n'indique plus le dénominateur
      const correction = `${m} est un multiple de ${bx} et de ${by}. ${frac(x, bx)} = ${frac(`${x} × ${kx}`, `${bx} × ${kx}`)} = ${frac(x * kx, m)} et ${frac(y, by)} = ${frac(`${y} × ${ky}`, `${by} × ${ky}`)} = ${frac(y * ky, m)}.<br>Donc ${frac(x, bx)} ${op} ${frac(y, by)} = ${frac(x * kx, m)} ${op} ${frac(y * ky, m)} = ${frac(r, m)}.`;
      if (defi) {
        return {
          consigne: "Trois réussites de suite : cette fois, le dénominateur commun n'est plus donné. Calcule.",
          ligne: `${frac(x, bx)} ${op} ${frac(y, by)} = [f]`,
          verifier(v) {
            const res = verifierFraction(v[0], r, m);
            if (res.etat === "faux") res.message = piegeDenominateurs(v[0], x, bx, y, by, plus) || res.message;
            return res;
          },
          indice: `Cherche un nombre qui est un multiple de ${bx} et de ${by}, puis écris les deux fractions avec ce dénominateur.`,
          correction
        };
      }
      return {
        consigne: `Écris les fractions avec le dénominateur ${m}, puis calcule.`,
        ligne: `${frac(x, bx)} ${op} ${frac(y, by)} = [f/${m}] ${op} [f/${m}] = [f]`,
        verifier(v) {
          const n1 = lireEntier(v[0].num), n2 = lireEntier(v[1].num);
          if (isNaN(n1) || isNaN(n2)) return { etat: "incomplet", message: "Complète toutes les cases." };
          const fin = verifierFraction(v[2], r, m);
          if (fin.etat === "incomplet") return fin;
          if (n1 !== x * kx || n2 !== y * ky) return { etat: "faux", message: `Pour passer au dénominateur ${m}, multiplie numérateur et dénominateur par le même nombre : ${bx} × ${kx} = ${m} et ${by} × ${ky} = ${m}.` };
          if (fin.etat === "faux" && lireEntier(v[2].den) === 2 * m) fin.message = "Les fractions ont maintenant le même dénominateur : on le garde, on n'additionne pas les dénominateurs.";
          return fin;
        },
        indice: `${bx} × ${kx} = ${m} et ${by} × ${ky} = ${m}.`,
        correction
      };
    }
  },

  /* ================= Feuille 8 ================= */

  {
    groupe: F8,
    id: "fraction-restante",
    titre: "La fraction restante",
    description: "1 − 5/8 = 8/8 − 5/8 = 3/8.",
    generer() {
      const b = alea(3, 12), a = alea(1, b - 1);
      const cas = choisir(["un", "un", "deux", "somme"]);
      if (cas === "un") {
        return {
          consigne: "Complète.",
          ligne: `1 − ${frac(a, b)} = [f] − ${frac(a, b)} = [f]`,
          verifier(v) {
            const debut = verifierFraction(v[0], b, b), fin = verifierFraction(v[1], b - a, b);
            if (debut.etat === "incomplet" || fin.etat === "incomplet") return { etat: "incomplet", message: "Complète toutes les cases." };
            if (debut.etat === "faux") return { etat: "faux", message: `Le tout s'écrit 1 = ${frac(b, b)} : même numérateur et même dénominateur.` };
            return fin;
          },
          indice: `Le tout (l'unité) s'écrit 1 = ${frac(2, 2)} = ${frac(3, 3)} = ${frac(4, 4)} = … Choisis le dénominateur ${b}.`,
          correction: `1 − ${frac(a, b)} = ${frac(b, b)} − ${frac(a, b)} = ${frac(b - a, b)}.`
        };
      }
      if (cas === "deux") {
        return {
          consigne: "Calcule.",
          ligne: `2 − ${frac(a, b)} = [f]`,
          verifier: v => verifierFraction(v[0], 2 * b - a, b),
          indice: `2 = ${frac(2 * b, b)}.`,
          correction: `2 − ${frac(a, b)} = ${frac(2 * b, b)} − ${frac(a, b)} = ${frac(2 * b - a, b)}.`
        };
      }
      if (a > b - 2) return this.generer();
      const c = alea(1, b - a - 1);
      return {
        consigne: `On utilise ${frac(a, b)} puis ${frac(c, b)} d'un tout. Quelle fraction reste-t-il ?`,
        ligne: "[f]",
        verifier: v => verifierFraction(v[0], b - a - c, b),
        indice: `Additionne d'abord ce qui est utilisé, puis enlève-le du tout : 1 = ${frac(b, b)}.`,
        correction: `${frac(a, b)} + ${frac(c, b)} = ${frac(a + c, b)}, et 1 − ${frac(a + c, b)} = ${frac(b, b)} − ${frac(a + c, b)} = ${frac(b - a - c, b)}.`
      };
    }
  },

  {
    groupe: F8,
    id: "problemes-fractions",
    titre: "Problèmes de fractions",
    description: "Fraction restante, fraction d'une quantité, partages.",
    generer() {
      const modele = alea(0, 9);
      if (modele === 0) {
        const b = alea(4, 12), a = alea(1, b - 1);
        return probleme(`Un randonneur a parcouru ${frac(a, b)} d'un trajet.`, [
          { q: "Quelle fraction du trajet lui reste-t-il ?", r: [b - a, b], calcul: `1 − ${frac(a, b)} = ${frac(b, b)} − ${frac(a, b)} = ${frac(b - a, b)} du trajet.` }
        ]);
      }
      if (modele === 1) {
        const b = choisir([6, 8, 10, 12]), a = alea(1, b / 2 - 1), c = alea(1, b - a - 1);
        return probleme(`Paul mange ${frac(a, b)} d'un gâteau, Léa en mange ${frac(c, b)}.`, [
          { q: "Quelle fraction du gâteau reste-t-il ?", r: [b - a - c, b], calcul: `${frac(a, b)} + ${frac(c, b)} = ${frac(a + c, b)} sont mangés ; il reste 1 − ${frac(a + c, b)} = ${frac(b, b)} − ${frac(a + c, b)} = ${frac(b - a - c, b)} du gâteau.` }
        ]);
      }
      if (modele === 2) {
        const [x, y] = choisir([[2, 8], [2, 4], [3, 6], [4, 8], [3, 9], [5, 10], [2, 6], [4, 12]]);
        const m = y, a = 1, c = alea(1, Math.max(1, m - m / x - 1));
        const utilise = m / x * a + c;
        if (utilise >= m) return this.generer();
        return probleme(`Dans un jardin, ${frac(1, x)} de la surface est réservé aux légumes et ${frac(c, y)} aux fleurs ; le reste est en pelouse.`, [
          { q: "Quelle fraction du jardin est en pelouse ?", r: [m - utilise, m], calcul: `${frac(1, x)} = ${frac(m / x, m)}, donc légumes et fleurs occupent ${frac(m / x, m)} + ${frac(c, m)} = ${frac(utilise, m)}. Pelouse : ${frac(m, m)} − ${frac(utilise, m)} = ${frac(m - utilise, m)} du jardin.` }
        ]);
      }
      if (modele === 3) {
        const N = 6 * alea(3, 6), pied = N / 3, velo = N / 6, bus = N - pied - velo;
        return probleme(`Dans une classe de ${N} élèves, ${frac(1, 3)} des élèves viennent à pied, ${frac(1, 6)} à vélo et les autres en bus.`, [
          { q: "Quelle fraction des élèves vient en bus ?", r: [1, 2], calcul: `${frac(1, 3)} = ${frac(2, 6)}, donc ${frac(2, 6)} + ${frac(1, 6)} = ${frac(3, 6)} viennent à pied ou à vélo. En bus : ${frac(6, 6)} − ${frac(3, 6)} = ${frac(3, 6)}, c'est-à-dire ${frac(1, 2)} des élèves.` },
          { q: "Combien d'élèves viennent en bus ?", r: bus, unite: "élèves", calcul: `${frac(1, 2)} de ${N} : ${N} ÷ 2 = ${bus} élèves.` }
        ]);
      }
      if (modele === 4) {
        const P = 8 * alea(10, 30), sam = P / 4, dim = P / 8 * 3;
        return probleme(`Zoé lit un livre de ${P} pages. Elle en lit ${frac(1, 4)} le samedi et ${frac(3, 8)} le dimanche.`, [
          { q: "Quelle fraction du livre a-t-elle lue ?", r: [5, 8], calcul: `${frac(1, 4)} = ${frac(2, 8)}, donc ${frac(2, 8)} + ${frac(3, 8)} = ${frac(5, 8)} du livre.` },
          { q: "Combien de pages lui reste-t-il à lire ?", r: P - sam - dim, unite: "pages", calcul: `Il reste 1 − ${frac(5, 8)} = ${frac(3, 8)} du livre : ${P} ÷ 8 × 3 = ${P - sam - dim} pages.` }
        ]);
      }
      if (modele === 5) {
        const L = 12 * alea(2, 6);
        return probleme(`Pour peindre une clôture de ${L} m, Inès en peint ${frac(2, 3)} le samedi et ${frac(1, 4)} le dimanche.`, [
          { q: "Quelle fraction de la clôture est peinte ce week-end ?", r: [11, 12], calcul: `${frac(2, 3)} = ${frac(8, 12)} et ${frac(1, 4)} = ${frac(3, 12)}, donc ${frac(8, 12)} + ${frac(3, 12)} = ${frac(11, 12)}.` },
          { q: "Quelle fraction reste-t-il à peindre ?", r: [1, 12], calcul: `${frac(12, 12)} − ${frac(11, 12)} = ${frac(1, 12)}.` },
          { q: "Quelle longueur reste-t-il à peindre ?", r: L / 12, unite: "m", calcul: `${frac(1, 12)} de ${L} m : ${L} ÷ 12 = ${L / 12} m.` }
        ]);
      }
      if (modele === 6) {
        const b = choisir([3, 4, 5, 7]), a = alea(1, b - 1), N = b * alea(4, 8);
        return probleme(`Dans une classe de ${N} élèves, les ${frac(a, b)} sont demi-pensionnaires.`, [
          { q: "Combien d'élèves sont demi-pensionnaires ?", r: N / b * a, unite: "élèves", calcul: `${N} ÷ ${b} = ${N / b}, puis ${N / b} × ${a} = ${N / b * a} élèves.` },
          { q: "Combien ne le sont pas ?", r: N - N / b * a, unite: "élèves", calcul: `${N} − ${N / b * a} = ${N - N / b * a} élèves.` }
        ]);
      }
      if (modele === 7) {
        const [mot, b] = choisir([["du quart", 4], ["du tiers", 3], ["du cinquième", 5], ["de moitié", 2]]);
        const P = b * alea(8, 60), red = P / b;
        return probleme(`Un vélo coûte ${nb(P)} €. Pendant les soldes, son prix baisse ${mot}.`, [
          { q: "Quel est le montant de la réduction ?", r: red, unite: "€", calcul: `${frac(1, b)} de ${nb(P)} € : ${nb(P)} ÷ ${b} = ${nb(red)} €.` },
          { q: "Quel est le nouveau prix ?", r: P - red, unite: "€", calcul: `${nb(P)} − ${nb(red)} = ${nb(P - red)} €.`, piege: x => lireNombre(x) === red ? "Tu as donné la réduction : il faut l'enlever au prix de départ." : "" }
        ]);
      }
      if (modele === 8) {
        const b = choisir([3, 4, 5]), a = alea(1, b - 1), V = b * alea(6, 25);
        return probleme(`Un réservoir de ${V} L est rempli aux ${frac(a, b)}.`, [
          { q: "Combien de litres contient-il ?", r: V / b * a, unite: "L", calcul: `${V} ÷ ${b} × ${a} = ${V / b * a} L.` },
          { q: "Combien de litres faut-il ajouter pour le remplir ?", r: V - V / b * a, unite: "L", calcul: `${V} − ${V / b * a} = ${V - V / b * a} L (c'est aussi ${frac(b - a, b)} de ${V} L).` }
        ]);
      }
      const b = choisir([4, 5, 8, 10]), a = alea(1, b - 1), Q = b * alea(5, 50);
      return probleme(`Une recette demande ${Q} g de sucre. Tom n'en veut utiliser que les ${frac(a, b)}.`, [
        { q: "Quelle masse de sucre utilise-t-il ?", r: Q / b * a, unite: "g", calcul: `${Q} ÷ ${b} = ${Q / b}, puis ${Q / b} × ${a} = ${Q / b * a} g.` }
      ]);
    }
  }

];

/* ---------- Le test « Je me teste » : une question par compétence ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "10 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Lire une fraction", activites: ["lire-fraction", "parts-egales"] },
    { competence: "Représenter une fraction", activites: ["colorier"] },
    { competence: "Fractions supérieures à 1", activites: ["colorier-plus-que-un", "entier-et-fraction"] },
    { competence: "Fractions égales", activites: ["egalites", "egalites-bandes"] },
    { competence: "Fraction d'une quantité", activites: ["fraction-d-une-quantite", "quantite-schema"] },
    { competence: "Pourcentages et fractions", activites: ["pourcentages-fractions", "quel-pourcentage"] },
    { competence: "Calculer un pourcentage", activites: ["pourcentages-usuels", "calculer-pourcentage"] },
    { competence: "Demi-droite graduée", activites: ["lire-abscisse", "placer-point", "placer-differents"] },
    { competence: "Additionner et soustraire", activites: ["meme-denominateur", "addition-bande", "denominateurs-multiples"] },
    { competence: "Fraction restante", activites: ["fraction-restante", "problemes-fractions"] }
  ]
};
