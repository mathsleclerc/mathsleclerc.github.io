/* =====================================================================
   EXERCISEUR « PROPORTIONNALITÉ » — 6e, chapitre 4

   Les activités sont rangées comme les 5 feuilles d'exercices du chapitre.
   Toujours des grandeurs, avec leurs unités ; la procédure la mieux adaptée
   dépend des nombres (linéarité multiplicative ou additive, retour à
   l'unité) ; pas de produit en croix.

   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const P1 = "Feuille 1 — Proportionnel ou pas ?";
const P2 = "Feuille 2 — Multiplier, diviser, additionner";
const P3 = "Feuille 3 — Le retour à l'unité";
const P4 = "Feuille 4 — Résoudre des problèmes";
const P5 = "Feuille 5 — Les échelles";

const nb = x => ecrireNombre(x);
const cap = t => t[0].toUpperCase() + t.slice(1);
const u = (x, unite) => unite ? `${nb(x)} ${unite}` : nb(x); // un nombre et son unité
const r2 = x => Math.round(x * 100) / 100; // évite les 2,0999999 des calculs décimaux
/* Un prix : 6 €, 4,50 € (deux chiffres après la virgule s'il y a des centimes) */
const euros = x => { const y = r2(x); return (Number.isInteger(y) ? nb(y) : y.toFixed(2).replace(".", ",")) + " €"; };

/* ---------- Situations de proportionnalité ----------
   g1, u1 : première grandeur et son unité ; g2, u2 : seconde ; taux : valeur pour 1 unité de g1 */
const SITUATIONS = [
  { g1: "Masse de pommes", u1: "kg", g2: "Prix", u2: "€", taux: () => alea(2, 5), expr: "prix au kilo",
    phrase: (a, b) => `${u(a, "kg")} de pommes coûtent ${u(b, "€")}`, faux: "nombre de pommes" },
  { g1: "Nombre de cahiers", u1: "", g2: "Prix", u2: "€", taux: () => alea(2, 4), expr: "prix d'un cahier",
    phrase: (a, b) => `${nb(a)} cahiers coûtent ${u(b, "€")}`, faux: "masse des cahiers" },
  { g1: "Nombre de personnes", u1: "", g2: "Masse de farine", u2: "g", taux: () => 10 * alea(4, 8), expr: "masse de farine par personne",
    phrase: (a, b) => `pour ${nb(a)} personnes, une recette demande ${u(b, "g")} de farine`, faux: "nombre d'œufs" },
  { g1: "Durée", u1: "h", g2: "Distance", u2: "km", taux: () => alea(12, 20), expr: "distance parcourue en une heure",
    phrase: (a, b) => `en ${u(a, "h")}, un cycliste parcourt ${u(b, "km")}`, faux: "vitesse du vent" },
  { g1: "Durée", u1: "min", g2: "Volume d'eau", u2: "L", taux: () => alea(6, 12), expr: "nombre de litres par minute",
    phrase: (a, b) => `en ${u(a, "min")}, un robinet remplit ${u(b, "L")} d'eau`, faux: "température de l'eau" },
  { g1: "Durée", u1: "min", g2: "Nombre de battements", u2: "", taux: () => 5 * alea(12, 16), expr: "nombre de battements par minute",
    phrase: (a, b) => `en ${u(a, "min")}, le cœur de Léo bat ${nb(b)} fois`, faux: "âge de Léo" },
  { g1: "Longueur de tissu", u1: "m", g2: "Prix", u2: "€", taux: () => choisir([3, 4, 6, 8, 9, 2.5, 3.5]), expr: "prix au mètre",
    phrase: (a, b) => `${u(a, "m")} de tissu coûtent ${u(b, "€")}`, faux: "couleur du tissu" }
];
const tete = (g, unite) => unite ? `${g} (${unite})` : g;
const libelle = (g, unite) => g.toLowerCase() + (unite ? ` (en ${unite})` : "");

/* Des achats à l'unité, avec des prix décimaux (feuille 3) : [pluriel, singulier, féminin ?] */
const ARTICLES = [["stylos", "stylo"], ["croissants", "croissant"], ["timbres", "timbre"], ["bouteilles d'eau", "bouteille", true],
  ["roses", "rose", true], ["cahiers", "cahier"], ["briques de jus", "brique", true], ["places de cinéma", "place", true]];
const PRIX_UNITAIRES = [0.45, 0.6, 0.7, 0.75, 0.85, 0.9, 1.2, 1.25, 1.39, 1.5, 1.8, 2.1, 2.5, 3.5];
const situationAchat = ([pluriel]) => ({ g1: "Nombre de " + pluriel, u1: "", g2: "Prix", u2: "€" });

/* ---------- Tableau de proportionnalité ----------
   cols : [{ a, b }] — une valeur, ou null pour une case à trouver.
   fleches : [{ de, a, texte, trou }] au-dessus des colonnes ; coef : { texte, trou } à droite.
   Dans un texte de flèche, « [n] » est un facteur à trouver (valeur : trou).
   Renvoie le HTML (avec les cases [d]) et les valeurs attendues, dans l'ordre des cases. */
function tableau(S, cols, { fleches = [], coef = null, cliquable = false } = {}) {
  const attendus = [];
  const n = cols.length;
  let h = `<div class="tprop" style="--n:${n}">`;
  for (const f of fleches) {
    h += `<div class="tp-fleche" style="grid-column:${f.de + 2} / ${f.a + 3}; --span:${f.a - f.de + 1}"><span>${f.texte.replace("[n]", "[d]")}</span></div>`;
    if (f.texte.includes("[n]")) attendus.push(f.trou);
  }
  for (const [ligne, g, unite] of [["a", S.g1, S.u1], ["b", S.g2, S.u2]]) {
    const r = ligne === "a" ? 2 : 3;
    h += `<div class="tp-tete" style="grid-row:${r}">${tete(g, unite)}</div>`;
    cols.forEach((c, i) => {
      const v = c[ligne];
      const style = `style="grid-row:${r}; grid-column:${i + 2}"`;
      if (v == null) { h += `<div class="tp-case" ${style}>[d]</div>`; attendus.push(c["v" + ligne]); }
      else if (cliquable && ligne === "b") h += `<button type="button" class="tp-case tp-clic" data-i="${i}" ${style}>${nb(v)}</button>`;
      else h += `<div class="tp-case" ${style}>${nb(v)}</div>`;
    });
  }
  if (coef) {
    h += `<div class="tp-coef" style="grid-column:${n + 2}"><span>${coef.texte.replace("[n]", "[d]")}</span></div>`;
    if (coef.texte.includes("[n]")) attendus.push(coef.trou);
  }
  return { html: h + "</div>", attendus };
}
/* Colonne : { a, b } ; pour une case à trouver, on garde la valeur attendue dans va / vb */
const col = (a, b, cacheA = false, cacheB = false) => ({ a: cacheA ? null : a, b: cacheB ? null : b, va: a, vb: b });

/* Tableau à plusieurs lignes (une recette…) : lignes = [{ tete, valeurs: [{ v, cache }] }] */
function tableauLignes(lignes) {
  const n = lignes[0].valeurs.length, attendus = [];
  let h = `<div class="tprop" style="--n:${n}">`;
  lignes.forEach((l, k) => {
    const r = k + 2;
    h += `<div class="tp-tete" style="grid-row:${r}">${l.tete}</div>`;
    l.valeurs.forEach((c, i) => {
      const style = `style="grid-row:${r}; grid-column:${i + 2}"`;
      if (c.cache) { h += `<div class="tp-case" ${style}>[d]</div>`; attendus.push(c.v); }
      else h += `<div class="tp-case" ${style}>${nb(c.v)}</div>`;
    });
  });
  return { html: h + "</div>", attendus };
}

function verifierCases(v, attendus) {
  const x = v.map(lireNombre);
  if (x.some(isNaN)) return { etat: "incomplet", message: "Complète toutes les cases." };
  const faux = attendus.filter((a, i) => Math.abs(x[i] - a) > 1e-9).length;
  if (!faux) return { etat: "juste" };
  return { etat: "faux", message: faux > 1 ? `${faux} cases sont fausses.` : "Une case est fausse." };
}

/* L'erreur de Lina : ajouter la différence (« 2 h → 18 €, donc 5 h → 18 + 3 »).
   Renvoie le piège à tester sur la case numéro i : de (a1 → b1) vers a2. */
function piegeAdditif(i, a1, b1, a2, S) {
  const d = Math.abs(a2 - a1), valeur = a2 > a1 ? b1 + d : b1 - d;
  const s = a2 > a1 ? "de plus" : "de moins";
  return { i, valeur, message: `Attention : ${u(d, S.u1) || nb(d)} ${s} ne font pas ${u(d, S.u2)} ${s} ! On n'ajoute pas la différence : utilise « fois plus », une addition de colonnes ou le retour à l'unité.` };
}
function verifierTableau(v, attendus, pieges = []) {
  const r = verifierCases(v, attendus);
  if (r.etat !== "faux") return r;
  const x = v.map(lireNombre);
  for (const p of pieges) {
    if (Math.abs(x[p.i] - p.valeur) < 1e-9 && Math.abs(p.valeur - attendus[p.i]) > 1e-9) return { etat: "faux", message: p.message };
  }
  return r;
}
const noeud = html => { const d = el("div", { class: "tp-conteneur" }); d.innerHTML = html; return d; };

/* Étiquettes à sélectionner (plusieurs choix possibles) */
function etiquettes(liste) {
  const choisies = new Set();
  let actif = true;
  const boutons = liste.map((t, i) => {
    const b = el("button", { type: "button", class: "btn etiquette-choix", "aria-pressed": "false" }, t);
    b.addEventListener("click", () => {
      if (!actif) return;
      if (choisies.has(i)) choisies.delete(i); else choisies.add(i);
      b.setAttribute("aria-pressed", String(choisies.has(i)));
    });
    return b;
  });
  return { noeud: el("div", { class: "etiquettes" }, ...boutons), choisies, boutons, bloquer: () => { actif = false; } };
}

/* Un nombre au hasard pour la première grandeur */
const petit = () => alea(2, 9);

/* Une ligne d'un problème à étapes : texte, puis la case et son unité */
const etape = (texte, unite = "", trou = "[d]") => `<div class="etape-pb"><p>${texte}</p><p class="rep">${trou} ${unite}</p></div>`;

/* Une règle graduée au millimètre, dessinée (pour lire une échelle graphique ou une distance) */
function regleDessinee(s, x0, y, cm, longueurCm) {
  s.append(svg("rect", { x: x0 - 8, y, width: longueurCm * cm + 16, height: 32, rx: 3, class: "carte-regle" }));
  for (let mm = 0; mm <= longueurCm * 10; mm++) {
    const xx = x0 + mm * cm / 10, l = mm % 10 === 0 ? 13 : mm % 5 === 0 ? 9 : 5;
    s.append(svg("line", { x1: xx, y1: y, x2: xx, y2: y + l, class: "carte-grad" }));
    if (mm % 10 === 0) s.append(svg("text", { x: xx, y: y + 26, class: "carte-cm" }, String(mm / 10)));
  }
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: P1,
    id: "double-moitie",
    titre: "Automatismes : double, moitié, fois moins…",
    description: "Les relations multiplicatives simples, avec des entiers et des décimaux.",
    generer() {
      const mots = [["double", 2, "×"], ["triple", 3, "×"], ["quadruple", 4, "×"], ["moitié", 2, "÷"], ["tiers", 3, "÷"], ["quart", 4, "÷"]];
      const cas = choisir(["mot", "mot", "fois", "choix"]);
      const decimal = Math.random() < 0.4;
      if (cas === "fois") {
        const k = alea(2, 6), plus = Math.random() < 0.5;
        const n = plus ? (decimal ? alea(11, 45) / 10 : alea(3, 15)) : k * (decimal ? alea(5, 30) / 10 : alea(2, 15));
        const r = r2(plus ? n * k : n / k);
        return {
          consigne: "Calcule.",
          ligne: `${k} fois ${plus ? "plus" : "moins"} que ${nb(r2(n))} = [d]`,
          verifier(v) {
            const res = verifierNombre(v[0], r), x = lireNombre(v[0]);
            if (res.etat === "faux" && Math.abs(x - (plus ? n + k : n - k)) < 1e-9) res.message = `« ${k} fois ${plus ? "plus" : "moins"} », ce n'est pas ${plus ? "+" : "−"} ${k} : on ${plus ? "multiplie" : "divise"} par ${k}.`;
            return res;
          },
          indice: `« ${k} fois plus » : × ${k} ; « ${k} fois moins » : ÷ ${k}.`,
          correction: `${nb(r2(n))} ${plus ? "×" : "÷"} ${k} = ${nb(r)}.`
        };
      }
      const [mot, k, op] = choisir(mots);
      const article = mot === "moitié" ? "La" : "Le";
      if (cas === "mot") {
        const n = op === "×" ? (decimal ? alea(11, 60) / 10 : alea(3, 25)) : k * (decimal ? alea(5, 40) / 10 : alea(2, 25));
        const r = r2(op === "×" ? n * k : n / k);
        return {
          consigne: "Calcule.",
          ligne: `${article} ${mot} de ${nb(r2(n))} = [d]`,
          verifier: v => verifierNombre(v[0], r),
          indice: `${article} ${mot}, c'est ${op === "×" ? "multiplier" : "diviser"} par ${k}.`,
          correction: `${article} ${mot} de ${nb(r2(n))} : ${nb(r2(n))} ${op} ${k} = ${nb(r)}.`
        };
      }
      const n = op === "×" ? alea(3, 25) : k * alea(2, 25);
      const r = op === "×" ? n * k : n / k;
      const avecArticle = m => (m === "moitié" ? "la " : "le ") + m;
      const options = mots.map(m => avecArticle(m[0]));
      return {
        consigne: `Complète : ${nb(r)} est … de ${nb(n)}.`,
        choix: options,
        verifier: (v, c) => ({ etat: c === avecArticle(mot) ? "juste" : "faux" }),
        indice: `Calcule ${nb(r)} ÷ ${nb(n)} ou ${nb(n)} ÷ ${nb(r)}.`,
        correction: `${nb(n)} ${op} ${k} = ${nb(r)} : ${nb(r)} est ${avecArticle(mot)} de ${nb(n)}.`
      };
    }
  },

  {
    groupe: P1,
    id: "deux-grandeurs",
    titre: "Les deux grandeurs",
    description: "Repérer les deux grandeurs d'une situation, avec leurs unités.",
    generer() {
      const S = choisir(SITUATIONS);
      const a = petit(), b = a * S.taux();
      const bonnes = [libelle(S.g1, S.u1), libelle(S.g2, S.u2)];
      const autres = melanger(SITUATIONS.filter(x => x !== S).flatMap(x => [libelle(x.g1, x.u1), libelle(x.g2, x.u2)]))
        .filter(t => !bonnes.includes(t));
      const liste = melanger([...bonnes, S.faux, ...[...new Set(autres)].slice(0, 2)]);
      const et = etiquettes(liste);
      return {
        consigne: `« ${cap(S.phrase(a, b))}. »<br>Quelles sont les <strong>deux grandeurs</strong> de cette situation ? Sélectionne-les, puis valide.`,
        figure: et.noeud,
        verifier() {
          const choix = [...et.choisies].map(i => liste[i]);
          if (choix.length !== 2) return { etat: "incomplet", message: "Sélectionne exactement deux grandeurs." };
          return { etat: choix.every(c => bonnes.includes(c)) ? "juste" : "faux" };
        },
        indice: "Une grandeur, c'est ce que l'on peut mesurer ou compter, avec une unité : une masse en kg, un prix en €, une durée en min…",
        correction: `Grandeur 1 : ${bonnes[0]} ; grandeur 2 : ${bonnes[1]}.`,
        surCorrection() { et.boutons.forEach((b, i) => b.classList.toggle("bonne", bonnes.includes(liste[i]))); },
        bloquer: et.bloquer
      };
    }
  },

  {
    groupe: P1,
    id: "proportionnel-ou-pas",
    titre: "Proportionnel ou pas ?",
    description: "Reconnaître une situation de proportionnalité, et le justifier.",
    generer() {
      const t = alea(2, 6);
      const [texte, prop, bonne] = choisir([
        [`Au marché, les pommes coûtent ${t} € le kilo. On s'intéresse au prix payé selon la masse de pommes achetée.`, true, "Le prix au kilo est toujours le même : si la masse double, le prix double aussi."],
        [`Au repos, le cœur de Léo bat ${60 + 5 * t} fois par minute. On s'intéresse au nombre de battements selon la durée.`, true, "Le nombre de battements par minute est toujours le même."],
        [`Un robinet laisse couler ${t + 5} L d'eau par minute. On s'intéresse au volume d'eau selon la durée.`, true, "Le nombre de litres par minute est toujours le même."],
        [`Une recette de crêpes demande ${10 * (t + 3)} g de farine par personne. On s'intéresse à la masse de farine selon le nombre de personnes.`, true, "La masse de farine par personne est toujours la même."],
        ["On s'intéresse au périmètre d'un carré selon la longueur de son côté.", true, "Le périmètre est toujours 4 fois la longueur du côté."],
        ["On s'intéresse à la taille d'un enfant selon son âge.", false, "Quand l'âge double, la taille ne double pas."],
        [`Un taxi fait payer ${t} € de prise en charge, puis 2 € par kilomètre. On s'intéresse au prix de la course selon la distance.`, false, "Il y a une somme fixe à payer en plus : si la distance double, le prix ne double pas."],
        [`Un club de sport demande ${10 * t} € d'inscription, puis 5 € par séance. On s'intéresse au prix payé selon le nombre de séances.`, false, "Il y a une somme fixe à payer en plus : si le nombre de séances double, le prix ne double pas."],
        ["On s'intéresse à la température extérieure selon l'heure de la journée.", false, "La température monte puis redescend : elle n'est pas obtenue en multipliant l'heure par un même nombre."],
        [`Un magasin fait une promotion : « 3 paquets de gâteaux pour le prix de 2 ». Un paquet coûte ${t} €. On s'intéresse au prix payé selon le nombre de paquets.`, false, "Avec la promotion, 3 paquets ne coûtent pas 3 fois le prix d'un paquet."]
      ]);
      const pieges = prop
        ? ["Il y a une somme fixe à payer en plus.", "Les deux grandeurs n'augmentent pas en même temps."]
        : ["Les deux grandeurs augmentent en même temps, donc c'est proportionnel.", "On multiplie toujours par le même nombre."];
      const raisons = melanger([bonne, ...pieges]);
      return {
        consigne: texte,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>Est-ce une situation de proportionnalité ?</p>[s]</div><div class="etape-pb"><p>Pourquoi ?</p>[s]</div>`,
        listes: [["Oui", "Non"], raisons],
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Réponds aux deux questions." };
          if ((v[0] === 0) !== prop) return { etat: "faux", message: "Pour vérifier, demande-toi : si la première grandeur double, est-ce que la seconde double aussi ?" };
          if (raisons[v[1]] !== bonne) return { etat: "faux", message: "Ta réponse est juste, mais pas ta justification." + (raisons[v[1]].includes("augmentent en même temps") ? " Attention : deux grandeurs peuvent augmenter ensemble sans être proportionnelles !" : "") };
          return { etat: "juste" };
        },
        indice: "Deux grandeurs sont proportionnelles quand on passe de l'une à l'autre en multipliant toujours par le même nombre.",
        correction: `${prop ? "C'est" : "Ce n'est pas"} une situation de proportionnalité. ${bonne}`
      };
    }
  },

  {
    groupe: P1,
    id: "langage-courant",
    titre: "« Prix au kilo », « par minute »…",
    description: "Comprendre et utiliser les expressions de la vie courante.",
    generer() {
      if (Math.random() < 0.4) {
        const paires = melanger([
          ["prix au kilo", "le prix de 1 kg"],
          ["battements par minute", "le nombre de battements en 1 minute"],
          ["kilomètres par heure (km/h)", "la distance parcourue en 1 heure"],
          ["litres par minute", "le volume d'eau qui coule en 1 minute"],
          ["grammes par personne", "la masse pour 1 personne"],
          ["prix au mètre", "le prix de 1 m"]
        ]).slice(0, 4);
        const r = relier(paires.map(([e], i) => ({ html: e, cle: i })), paires.map(([, s], i) => ({ html: s, cle: i })));
        return {
          consigne: "Relie chaque expression à sa signification : clique sur une expression, puis sur ce qu'elle veut dire.",
          figure: r.noeud,
          verifier: r.verifier,
          indice: "« par » ou « au » veut dire « pour 1 » : le prix au kilo, c'est le prix pour 1 kg.",
          correction: paires.map(([e, s]) => `${e} : ${s}`).join(" ; ") + ".",
          surCorrection: r.corriger,
          bloquer: r.bloquer
        };
      }
      const [enonceDirect, enonceInverse] = choisir([
        [(t, k) => [`Le prix au kilo des tomates est de ${t} €. Combien coûtent ${k} kg de tomates ?`, t * k, "€", `${k} × ${t} € = ${t * k} €`],
         (t, k) => [`${k} kg de tomates coûtent ${t * k} €. Quel est le prix au kilo ?`, t, "€", `${t * k} € ÷ ${k} = ${t} € : c'est le prix de 1 kg.`]],
        [(t, k) => [`Le cœur de Zoé bat ${t * 10} fois par minute. Combien de fois bat-il en ${k} minutes ?`, t * 10 * k, "battements", `${k} × ${t * 10} = ${t * 10 * k} battements`],
         (t, k) => [`En ${k} minutes, le cœur de Zoé bat ${t * 10 * k} fois. Combien de battements par minute ?`, t * 10, "battements par minute", `${t * 10 * k} ÷ ${k} = ${t * 10} battements en 1 minute`]],
        [(t, k) => [`Un robinet débite ${t} litres par minute. Quel volume d'eau coule en ${k} minutes ?`, t * k, "L", `${k} × ${t} L = ${t * k} L`],
         (t, k) => [`En ${k} minutes, un robinet remplit ${t * k} L. Combien de litres par minute ?`, t, "L par minute", `${t * k} L ÷ ${k} = ${t} L en 1 minute`]]
      ]);
      const t = alea(3, 9), k = alea(2, 8);
      const [consigne, r, unite, calcul] = (Math.random() < 0.5 ? enonceDirect : enonceInverse)(t, k);
      return {
        consigne,
        ligne: `[d] ${unite}`,
        verifier: v => verifierNombre(v[0], r),
        indice: "« Par minute », « au kilo » : c'est la valeur pour 1 unité.",
        correction: calcul + "."
      };
    }
  },

  {
    groupe: P1,
    id: "tableau-proportionnel",
    titre: "Tableau proportionnel ?",
    description: "Dire si un tableau est un tableau de proportionnalité, et le justifier.",
    generer() {
      const type = choisir(["prop", "prop", "fixe", "promo", "carre"]);
      let S, as, bs, prop, i = 0, j = 1, contexte = "";
      if (type === "carre") {
        const aire = Math.random() < 0.6;
        S = { g1: "Côté", u1: "cm", g2: aire ? "Aire" : "Périmètre", u2: aire ? "cm²" : "cm" };
        as = [2, 3, 4, 6]; bs = as.map(a => aire ? a * a : 4 * a); prop = !aire; j = 2;
        contexte = "On s'intéresse à des carrés de différentes tailles. ";
      } else if (type === "promo") {
        S = choisir([situationAchat(ARTICLES[0]), situationAchat(ARTICLES[5]), situationAchat(ARTICLES[1])]);
        const t = choisir([0.8, 1.2, 1.5, 2, 2.5]);
        as = choisir([[1, 2, 3, 10], [1, 2, 5, 10], [1, 3, 4, 10]]);
        bs = as.map(a => r2(a * t));
        bs[3] = r2(bs[3] - choisir([1, 2, 3]) * (t >= 1.5 ? 1 : 0.5));
        prop = false; j = 3;
        contexte = "Un magasin fait une promotion sur les grandes quantités. ";
      } else {
        S = choisir(SITUATIONS.slice(0, 6));
        const t = S.taux(), x = alea(1, 3), fixe = alea(2, 6);
        as = [x, 2 * x, 3 * x, choisir([5, 6, 7]) * x];
        prop = type === "prop";
        bs = as.map(a => prop ? a * t : a * t + fixe);
      }
      const k = as[j] / as[i], t0 = r2(bs[0] / as[0]);
      const tb = tableau(S, as.map((a, n) => col(a, bs[n])));
      const raisonProp = `On passe toujours de la 1re ligne à la 2e en multipliant par ${nb(t0)}.`;
      const raisonNon = `${nb(as[j])}, c'est ${k} fois ${nb(as[i])}, mais ${nb(bs[j])} n'est pas ${k} fois ${nb(bs[i])}.`;
      const raisons = melanger([raisonProp, raisonNon, "Les nombres des deux lignes augmentent en même temps."]);
      const bonne = prop ? raisonProp : raisonNon;
      return {
        consigne: contexte + "Ce tableau est-il un tableau de proportionnalité ?",
        figure: noeud(tb.html),
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Est-ce un tableau de proportionnalité ?</p>[s]</div><div class="etape-pb"><p>2. Pourquoi ?</p>[s]</div>`,
        listes: [["Oui", "Non"], raisons],
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Réponds aux deux questions." };
          if ((v[0] === 0) !== prop) return { etat: "faux", message: `Compare deux colonnes : ${nb(as[j])}, c'est ${k} fois ${nb(as[i])}. Que devient la 2e ligne ?` };
          if (raisons[v[1]] !== bonne) return { etat: "faux", message: "Ta réponse est juste, mais pas ta justification." + (raisons[v[1]].includes("augmentent") ? " Deux grandeurs peuvent augmenter ensemble sans être proportionnelles !" : "") };
          return { etat: "juste" };
        },
        indice: `Compare les colonnes : ${nb(as[j])}, c'est ${k} fois ${nb(as[i])}. La seconde ligne est-elle aussi multipliée par ${k} ?`,
        correction: prop
          ? `Oui : ${raisonProp}`
          : `Non : ${raisonNon} (${k} × ${nb(bs[i])} = ${nb(r2(k * bs[i]))}). Un seul contre-exemple suffit.`
      };
    }
  },

  {
    groupe: P1,
    id: "contre-exemple",
    titre: "Trouver le contre-exemple",
    description: "Choisir deux colonnes qui prouvent que le tableau n'est pas proportionnel.",
    generer() {
      const [S, t, contexte] = choisir([
        [situationAchat(["pamplemousses"]), choisir([1.2, 1.5, 0.8]), "Au marché, le prix baisse quand on achète beaucoup de pamplemousses."],
        [situationAchat(["tickets de manège"]), choisir([1.5, 2, 2.5]), "À la fête foraine, les grands carnets de tickets sont moins chers."],
        [{ g1: "Données", u1: "Go", g2: "Prix par mois", u2: "€" }, choisir([0.5, 1]), "Un opérateur propose des forfaits de téléphone."],
        [situationAchat(ARTICLES[0]), choisir([0.8, 1.2]), "Des stylos sont en promotion par lots."]
      ]);
      const as = S.u1 === "Go" ? choisir([[2, 4, 10, 20], [5, 10, 20, 50]]) : choisir([[1, 2, 4, 10], [2, 4, 5, 10], [1, 3, 6, 12], [1, 2, 5, 10]]);
      const bs = as.map(a => r2(a * t));
      // une ou deux colonnes « en promotion » : moins chères que la proportionnalité
      const modifiees = Math.random() < 0.5 ? [3] : [2, 3];
      for (const m of modifiees) bs[m] = r2(bs[m] - Math.max(0.5, r2(bs[m] * choisir([0.1, 0.2, 0.25]))));
      const paires = [];
      for (let p = 0; p < 4; p++) for (let q = p + 1; q < 4; q++) {
        if (as[q] % as[p] === 0 && Math.abs(bs[q] - as[q] / as[p] * bs[p]) > 1e-9) paires.push([p, q]);
      }
      if (!paires.length || paires.length === 6) return this.generer();
      const tb = tableau(S, as.map((a, n) => col(a, bs[n])), { cliquable: true });
      const n = noeud(tb.html);
      const cases = [...n.querySelectorAll(".tp-clic")];
      let choisies = [], actif = true;
      cases.forEach(c => c.addEventListener("click", () => {
        if (!actif) return;
        const i = Number(c.dataset.i);
        choisies = choisies.includes(i) ? choisies.filter(x => x !== i) : [...choisies, i].slice(-2);
        cases.forEach((x, k) => x.classList.toggle("choisie", choisies.includes(k)));
      }));
      const phrase = ([p, q]) => `${u(as[q], S.u1) || nb(as[q])}, c'est ${as[q] / as[p]} fois ${u(as[p], S.u1) || nb(as[p])}, mais ${u(bs[q], S.u2)} n'est pas ${as[q] / as[p]} fois ${u(bs[p], S.u2)} (${as[q] / as[p]} × ${nb(bs[p])} = ${nb(r2(as[q] / as[p] * bs[p]))}).`;
      return {
        consigne: `${contexte} Ce tableau n'est pas un tableau de proportionnalité. Clique sur <strong>deux cases de la 2e ligne</strong> qui le prouvent, puis valide.`,
        figure: n,
        verifier() {
          if (choisies.length !== 2) return { etat: "incomplet", message: "Clique sur deux cases de la deuxième ligne." };
          const [p, q] = [...choisies].sort((x, y) => x - y);
          if (as[q] % as[p] !== 0) return { etat: "faux", message: `${nb(as[q])} n'est pas un multiple de ${nb(as[p])} : avec ces deux colonnes, on ne voit pas facilement de contre-exemple. Choisis deux colonnes où l'une est 2, 3… fois l'autre.` };
          if (Math.abs(bs[q] - as[q] / as[p] * bs[p]) < 1e-9) return { etat: "faux", message: `Ces deux colonnes respectent la proportionnalité : ${as[q] / as[p]} × ${nb(bs[p])} = ${nb(bs[q])}. Cherche ailleurs.` };
          return { etat: "juste", message: phrase([p, q]) };
        },
        indice: "Cherche deux colonnes où le nombre du haut est 2, 3 ou 10 fois plus grand. Le prix est-il aussi 2, 3 ou 10 fois plus grand ?",
        correction: `Par exemple : ${phrase(paires[0])} Un seul contre-exemple suffit.`,
        surCorrection() { paires[0].forEach(k => cases[k].classList.add("bonne")); },
        bloquer() { actif = false; }
      };
    }
  },

  {
    groupe: P1,
    id: "intrus",
    titre: "Trouver l'intrus",
    description: "Une seule case empêche le tableau d'être proportionnel.",
    generer() {
      const S = choisir(SITUATIONS.slice(0, 6));
      const t = S.taux();
      const as = melanger([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 4).sort((p, q) => p - q);
      const bs = as.map(a => a * t);
      const k = alea(1, 3);
      const vrai = bs[k];
      bs[k] = vrai + choisir([-1, 1]) * (t > 5 ? alea(2, 5) : 1);
      const tb = tableau(S, as.map((a, i) => col(a, bs[i])), { cliquable: true });
      const n = noeud(tb.html);
      let choisi = null, actif = true;
      const cases = [...n.querySelectorAll(".tp-clic")];
      cases.forEach(c => c.addEventListener("click", () => {
        if (!actif) return;
        choisi = Number(c.dataset.i);
        cases.forEach(x => x.classList.toggle("choisie", x === c));
      }));
      return {
        consigne: "Ce tableau devrait être un tableau de proportionnalité, mais une case de la 2e ligne est fausse. Clique sur l'intrus, puis valide.",
        figure: n,
        verifier() {
          if (choisi == null) return { etat: "incomplet", message: "Clique sur une case de la deuxième ligne." };
          return { etat: choisi === k ? "juste" : "faux", message: choisi === k ? "" : `${nb(as[choisi])} × ${nb(t)} = ${nb(as[choisi] * t)} : cette case est juste.` };
        },
        indice: "Trouve d'abord par quel nombre on multiplie la 1re ligne pour obtenir la 2e, dans les colonnes qui semblent justes.",
        correction: `On multiplie par ${nb(t)} (${S.expr}) : ${nb(as[k])} × ${nb(t)} = ${nb(vrai)}, et non ${nb(bs[k])}.`,
        surCorrection() { cases[k].classList.add("bonne"); },
        bloquer() { actif = false; }
      };
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: P2,
    id: "fois-plus",
    titre: "Fois plus, fois moins",
    description: "Linéarité multiplicative : 3 fois plus de kg, 3 fois plus d'€.",
    generer() {
      const S = choisir(SITUATIONS);
      const t = S.taux(), a = alea(2, 5), k = alea(2, 5);
      const diviser = Math.random() < 0.35;
      const [a1, a2] = diviser ? [a * k, a] : [a, a * k];
      const facteurCache = Math.random() < 0.4;
      const texte = (diviser ? "÷ " : "× ") + (facteurCache ? "[n]" : k);
      const tb = tableau(S, [col(a1, a1 * t), col(a2, a2 * t, false, true)], { fleches: [{ de: 0, a: 1, texte, trou: k }] });
      const piege = piegeAdditif(tb.attendus.length - 1, a1, a1 * t, a2, S);
      return {
        consigne: facteurCache ? "Complète la flèche, puis le tableau de proportionnalité." : "Complète le tableau de proportionnalité en utilisant la flèche.",
        ligne: tb.html,
        verifier: v => verifierTableau(v, tb.attendus, [piege]),
        indice: `${u(a2, S.u1) || nb(a2)}, c'est ${k} fois ${diviser ? "moins" : "plus"} que ${u(a1, S.u1) || nb(a1)}.`,
        correction: `${u(a2, S.u1) || nb(a2)}, c'est ${k} fois ${diviser ? "moins" : "plus"} que ${u(a1, S.u1) || nb(a1)}, donc on ${diviser ? "divise" : "multiplie"} aussi par ${k} : ${diviser ? `${u(a1 * t, S.u2)} ÷ ${k}` : `${k} × ${u(a1 * t, S.u2)}`} = ${u(a2 * t, S.u2)}.`
      };
    }
  },

  {
    groupe: P2,
    id: "en-additionnant",
    titre: "En additionnant",
    description: "Linéarité additive : 3 kg + 5 kg = 8 kg, donc prix(3 kg) + prix(5 kg).",
    generer() {
      const S = choisir(SITUATIONS);
      const t = S.taux();
      let a1, a2;
      do { a1 = alea(2, 7); a2 = alea(a1 + 1, 9); } while (a2 % a1 === 0);
      const somme = Math.random() < 0.7;
      const a3 = somme ? a1 + a2 : a2 - a1;
      const tb = tableau(S, [col(a1, a1 * t), col(a2, a2 * t), col(a3, a3 * t, false, true)]);
      return {
        consigne: `Complète le tableau de proportionnalité en utilisant les deux premières colonnes (${nb(a3)} = ${somme ? `${a1} + ${a2}` : `${a2} − ${a1}`}).`,
        ligne: tb.html,
        verifier: v => verifierTableau(v, tb.attendus, [piegeAdditif(0, a2, a2 * t, a3, S)]),
        indice: `${u(a3, S.u1) || nb(a3)}, c'est ${somme ? `${u(a1, S.u1) || nb(a1)} + ${u(a2, S.u1) || nb(a2)}` : `${u(a2, S.u1) || nb(a2)} − ${u(a1, S.u1) || nb(a1)}`}. Fais la même chose sur la deuxième ligne.`,
        correction: `${nb(a3)} = ${somme ? `${a1} + ${a2}` : `${a2} − ${a1}`}, donc ${somme ? `${u(a1 * t, S.u2)} + ${u(a2 * t, S.u2)}` : `${u(a2 * t, S.u2)} − ${u(a1 * t, S.u2)}`} = ${u(a3 * t, S.u2)}.`
      };
    }
  },

  {
    groupe: P2,
    id: "recette",
    titre: "Adapter une recette",
    description: "Un tableau à plusieurs lignes : farine, œufs, lait… pour plus ou moins de personnes.",
    generer() {
      const p = choisir([2, 4, 6]);
      const cibles = melanger([...new Set([p / 2, 2 * p, 3 * p, p + p / 2].filter(x => x >= 1 && x !== p))]).slice(0, 3);
      const plat = choisir(["crêpes", "pâte à pizza", "gâteau au yaourt", "pancakes"]);
      const ingredients = melanger([
        ["Farine (en g)", 50 * alea(3, 8)], ["Œufs", p], ["Lait (en cL)", 10 * alea(2, 6)],
        ["Beurre (en g)", 20 * alea(1, 4)], ["Sucre (en g)", 20 * alea(2, 6)]
      ]).slice(0, alea(2, 3));
      const lignes = [{ tete: "Nombre de personnes", valeurs: [p, ...cibles].map(v => ({ v })) },
        ...ingredients.map(([nom, q]) => ({ tete: nom, valeurs: [{ v: q }, ...cibles.map(c => ({ v: q / p * c, cache: true }))] }))];
      const tb = tableauLignes(lignes);
      const calcul = c => c === p / 2 ? `${nb(c)} = ${p} ÷ 2 : on divise par 2` : c % p === 0 ? `${nb(c)} = ${c / p} × ${p} : on multiplie par ${c / p}` : `${nb(c)} = ${p} + ${p / 2} : on additionne la colonne de ${p} et celle de ${p / 2}`;
      return {
        consigne: `Voici une recette de ${plat} pour ${p} personnes. Les quantités sont proportionnelles au nombre de personnes : complète le tableau.`,
        ligne: tb.html,
        verifier(v) {
          const r = verifierCases(v, tb.attendus);
          if (r.etat !== "faux") return r;
          // l'erreur de Lina : ajouter la différence de personnes
          const x = v.map(lireNombre);
          let k = 0;
          for (const [, q] of ingredients) for (const c of cibles) { if (x[k] === q + (c - p) && q + (c - p) !== q / p * c) return { etat: "faux", message: "Attention : on n'ajoute pas la différence du nombre de personnes ! Multiplie, divise ou additionne des colonnes." }; k++; }
          return r;
        },
        indice: `Compare chaque nombre de personnes à ${p} : le double ? la moitié ? ${p} + la moitié ?`,
        correction: cibles.map(c => `Pour ${nb(c)} personnes : ${calcul(c)} — ` + ingredients.map(([nom, q]) => `${nom.split(" (")[0].toLowerCase()} : ${nb(q / p * c)}`).join(", ") + ".").join("<br>")
      };
    }
  },

  {
    groupe: P2,
    id: "trouver-erreur",
    titre: "Trouver l'erreur",
    description: "Un élève s'est trompé : explique son erreur et calcule la bonne valeur.",
    generer() {
      const [nom, il, S, t, phrase] = choisir([
        ["Lina", "Elle", { g1: "Durée", u1: "h", g2: "Gain", u2: "€" }, choisir([8, 9, 10, 12]), (a, b) => `pour ${a} h de baby-sitting, je gagne ${b} €`],
        ["Tom", "Il", { g1: "Masse de pommes", u1: "kg", g2: "Prix", u2: "€" }, choisir([2, 3, 4]), (a, b) => `${a} kg de pommes coûtent ${b} €`],
        ["Inès", "Elle", { g1: "Durée", u1: "min", g2: "Volume d'eau", u2: "L" }, choisir([6, 8, 12, 15]), (a, b) => `en ${a} min, le robinet remplit ${b} L`],
        ["Noé", "Il", { g1: "Nombre de personnes", u1: "", g2: "Farine", u2: "g" }, choisir([40, 50, 60, 75]), (a, b) => `pour ${a} personnes, il faut ${b} g de farine`]
      ]);
      const unite1 = S.u1 || "personnes";
      if (Math.random() < 0.6) {
        const a1 = alea(2, 4), d = alea(1, 4), a2 = a1 + d;
        if (a2 % a1 === 0) return this.generer();
        const b1 = a1 * t, faux = b1 + d, juste = a2 * t;
        const options = melanger([
          `${il} a ajouté ${d} parce qu'il y a ${d} ${unite1} de plus. Mais ${d} ${unite1} ne correspondent pas à ${u(d, S.u2)}.`,
          `${il} aurait dû soustraire ${d}.`,
          `${il} aurait dû calculer ${b1} × ${d}.`
        ]);
        const bonne = options.find(o => o.includes("ne correspondent pas"));
        return {
          consigne: `${nom} dit : « ${cap(phrase(a1, b1))}, donc ${phrase(a2, `${b1} + ${d} = ${faux}`)}. »`,
          classeLigne: "etapes",
          ligne: `<div class="etape-pb"><p>1. Quelle est son erreur ?</p>[s]</div>` + etape(`2. Quel est le bon résultat pour ${u(a2, S.u1) || a2 + " personnes"} ?`, S.u2),
          listes: [options],
          verifier(v) {
            if (v[0] == null || isNaN(lireNombre(v[1]))) return { etat: "incomplet", message: "Réponds aux deux questions." };
            if (options[v[0]] !== bonne) return { etat: "faux", message: "Relis l'explication : la proportionnalité ne se traduit pas par une addition de la différence." };
            return verifierNombre(v[1], juste);
          },
          indice: `Calcule d'abord la valeur pour 1 : ${b1} ÷ ${a1}.`,
          correction: `${nom} a ajouté la différence, ce qui ne marche pas. Pour 1 : ${b1} ÷ ${a1} = ${nb(t)} ${S.u2}, donc pour ${a2} : ${a2} × ${nb(t)} = ${u(juste, S.u2)}.`
        };
      }
      const k = alea(2, 4), a2 = alea(2, 3), a1 = a2 * k, b1 = a1 * t, faux = b1 * k, juste = b1 / k;
      const options = melanger([
        `${u(a2, S.u1) || a2 + " personnes"}, c'est ${k} fois moins : il fallait diviser par ${k}, pas multiplier.`,
        `${il} aurait dû ajouter ${k}.`,
        `${il} aurait dû multiplier par ${a2}.`
      ]);
      const bonne = options.find(o => o.includes("fois moins"));
      return {
        consigne: `${nom} dit : « ${cap(phrase(a1, b1))}. ${cap(u(a2, S.u1) || a2 + " personnes")}, c'est ${k} fois moins, donc ${b1} × ${k} = ${u(faux, S.u2)}. »`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Quelle est son erreur ?</p>[s]</div>` + etape(`2. Quel est le bon résultat pour ${u(a2, S.u1) || a2 + " personnes"} ?`, S.u2),
        listes: [options],
        verifier(v) {
          if (v[0] == null || isNaN(lireNombre(v[1]))) return { etat: "incomplet", message: "Réponds aux deux questions." };
          if (options[v[0]] !== bonne) return { etat: "faux", message: "« Fois moins » : est-ce une multiplication ou une division ?" };
          return verifierNombre(v[1], juste);
        },
        indice: `« ${k} fois moins » : on divise par ${k}.`,
        correction: `« ${k} fois moins », c'est une division : ${b1} ÷ ${k} = ${u(juste, S.u2)}.`
      };
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: P3,
    id: "retour-unite",
    titre: "Retour à l'unité",
    description: "Passer par la valeur pour 1 : 5 stylos → 1 stylo → 7 stylos, avec des prix décimaux.",
    generer() {
      const mode = choisir(["entier", "decimal", "decimal", "fraction"]);
      if (mode === "fraction") {
        const a = choisir([3, 6, 7, 9]), m = alea(2, 3);
        let T;
        do T = alea(a + 1, 4 * a); while (T % a === 0);
        const fruit = choisir(["pommes", "poires", "cerises", "abricots"]);
        return {
          consigne: `${a} kg de ${fruit} coûtent ${T} €.`,
          classeLigne: "etapes",
          ligne: etape("1. Calcule le prix d'un kilo. La division ne tombe pas juste : écris-le sous forme de fraction.", "€", "[f]")
            + etape(`2. Calcule le prix de ${a * m} kg de ${fruit}.`, "€"),
          verifier(v) {
            const f = verifierFraction(v[0], T, a);
            if (f.etat === "incomplet" || isNaN(lireNombre(v[1]))) return { etat: "incomplet", message: "Réponds aux deux questions." };
            if (f.etat === "faux") return { etat: "faux", message: f.message || `Le prix d'un kilo, c'est ${T} ÷ ${a}, qui s'écrit ${frac(T, a)}.` };
            const r = verifierNombre(v[1], T * m);
            if (r.etat === "faux") r.message = `${a * m} kg, c'est ${m} fois ${a} kg : pas besoin du prix d'un kilo !`;
            return r;
          },
          indice: `Le prix d'un kilo, c'est ${T} ÷ ${a}. Et ${a * m} kg, c'est combien de fois ${a} kg ?`,
          correction: `1 kg coûte ${T} ÷ ${a} = ${frac(T, a)} €. ${a * m} kg, c'est ${m} fois ${a} kg : ${m} × ${T} = ${T * m} €.`
        };
      }
      let S, t, a, c;
      if (mode === "decimal") {
        const art = choisir(ARTICLES);
        S = situationAchat(art); t = choisir(PRIX_UNITAIRES);
      } else { S = choisir(SITUATIONS); t = S.taux(); }
      do { a = alea(3, 8); c = alea(2, 11); } while (c % a === 0 || a % c === 0);
      const b = r2(a * t), bc = r2(c * t);
      const guide = Math.random() < 0.6;
      const pour1 = `Pour 1 : ${u(b, S.u2)} ÷ ${a} = ${u(t, S.u2)}`;
      if (guide) {
        const tb = tableau(S, [col(a, b), col(1, t, false, true), col(c, bc, false, true)],
          { fleches: [{ de: 0, a: 1, texte: `÷ ${a}` }, { de: 1, a: 2, texte: `× ${c}` }] });
        return {
          consigne: "Complète le tableau en passant par l'unité.",
          ligne: tb.html,
          verifier: v => verifierTableau(v, tb.attendus, [piegeAdditif(1, a, b, c, S)]),
          indice: `Commence par la valeur pour 1 : divise par ${a}.`,
          correction: `${pour1}. Pour ${c} : ${c} × ${u(t, S.u2)} = ${u(bc, S.u2)}.`
        };
      }
      const tb = tableau(S, [col(a, b), col(c, bc, false, true)]);
      return {
        consigne: `Complète le tableau. Astuce : ${c} n'est ni un multiple ni un diviseur de ${a}… passe par la valeur pour 1.`,
        ligne: tb.html,
        verifier: v => verifierTableau(v, tb.attendus, [piegeAdditif(0, a, b, c, S)]),
        indice: "Calcule d'abord la valeur pour 1 (une division), puis multiplie.",
        correction: `${pour1}. Pour ${c} : ${c} × ${u(t, S.u2)} = ${u(bc, S.u2)}.`
      };
    }
  },

  {
    groupe: P3,
    id: "coefficient",
    titre: "Le coefficient",
    description: "On passe d'une ligne à l'autre en multipliant par un même nombre.",
    generer() {
      const S = choisir(SITUATIONS);
      const t = S.taux();
      const as = melanger([2, 3, 4, 5, 6, 7, 8, 10]).slice(0, 4).sort((p, q) => p - q);
      const trous = melanger([1, 2, 3]).slice(0, 2);
      const enHaut = Math.random() < 0.3; // une case à trouver dans la première ligne
      const cols = as.map((a, i) => col(a, a * t, enHaut && i === trous[1], !(enHaut && i === trous[1]) && trous.includes(i)));
      const tb = tableau(S, cols, { coef: { texte: "× [n]", trou: t } });
      return {
        consigne: "Trouve le nombre par lequel on multiplie la 1re ligne pour obtenir la 2e, puis complète le tableau.",
        ligne: tb.html,
        verifier: v => verifierCases(v, tb.attendus),
        indice: `Utilise la colonne complète : ${u(as[0], S.u1) || nb(as[0])} → ${u(as[0] * t, S.u2)}. Par combien multiplie-t-on ?`,
        correction: `${nb(as[0])} × ${nb(t)} = ${nb(as[0] * t)} : on multiplie par ${nb(t)} (c'est le ${S.expr}). Pour aller de la 2e ligne à la 1re, on divise par ${nb(t)}.`
      };
    }
  },

  {
    groupe: P3,
    id: "combien-au-maximum",
    titre: "Combien au maximum ?",
    description: "Avec 20 €, combien d'entrées à 3,50 € peut-on acheter ?",
    generer() {
      const [objet, sing, lieu] = choisir([["entrées", "une entrée", "à la piscine"], ["places", "une place", "au cinéma"], ["tickets", "un ticket", "de bus"], ["tours de manège", "un tour", "à la fête foraine"]]);
      const p = choisir([1.5, 1.8, 2.4, 2.5, 3.5, 4.5, 1.2, 3.2]), a = alea(3, 8), m = alea(4, 9);
      const T = r2(a * p);
      let B = Math.ceil(m * p);
      if (B >= (m + 1) * p) B = Math.floor(m * p);
      const max = Math.floor(B / p + 1e-9);
      return {
        consigne: `${cap(objet)} ${lieu} : ${a} ${objet} coûtent ${euros(T)}. Mathis a ${B} €.`,
        classeLigne: "etapes",
        ligne: etape(`1. Combien coûte ${sing} ?`, "€") + etape(`2. Combien de ${objet} peut-il acheter au maximum ?`, objet, "[n]"),
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Réponds aux deux questions." };
          if (Math.abs(x[0] - p) > 1e-9) return { etat: "faux", message: `Pour le prix d'${sing.startsWith("une") ? "une seule" : "un seul"} : ${euros(T)} ÷ ${a}.` };
          if (x[1] === max) return { etat: "juste" };
          if (x[1] > max) return { etat: "faux", message: `${x[1]} ${objet} coûteraient ${x[1]} × ${euros(p)} = ${euros(x[1] * p)} : c'est plus que ${B} €.` };
          return { etat: "faux", message: `Avec ${B} €, on peut en acheter plus : essaie ${x[1] + 1} × ${euros(p)}.` };
        },
        indice: "Calcule le prix d'une seule, puis essaie : combien en faut-il pour arriver le plus près possible de la somme, sans la dépasser ?",
        correction: `1 coûte ${euros(T)} ÷ ${a} = ${euros(p)}. ${max} × ${euros(p)} = ${euros(max * p)} et ${max + 1} × ${euros(p)} = ${euros((max + 1) * p)} (trop cher) : Mathis peut acheter ${max} ${objet} au maximum.`
      };
    }
  },

  {
    groupe: P3,
    id: "unite-duree",
    titre: "Par minute, par heure",
    description: "360 bouchons en 8 min : combien en 1 minute ? en 1 heure ?",
    generer() {
      const [machine, objet] = choisir([["Une machine fabrique", "bouchons"], ["Une imprimante imprime", "pages"], ["Une chaîne remplit", "bouteilles"], ["Une boulangerie industrielle cuit", "baguettes"]]);
      const m = alea(3, 8), v = 5 * alea(3, 12), N = m * v;
      let c;
      do c = alea(2, 12); while (c % m === 0 || m % c === 0);
      return {
        consigne: `${machine} ${N} ${objet} en ${m} minutes, toujours au même rythme.`,
        classeLigne: "etapes",
        ligne: etape("1. Combien en 1 minute ?", objet, "[n]") + etape(`2. Combien en ${c} minutes ?`, objet, "[n]") + etape("3. Combien en 1 heure ?", objet, "[n]"),
        verifier(x) {
          x = x.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Réponds aux trois questions." };
          if (x[0] !== v) return { etat: "faux", message: `En 1 minute : ${N} ÷ ${m}.` };
          if (x[1] !== c * v) return { etat: "faux", message: `En ${c} minutes : ${c} fois plus qu'en 1 minute.` };
          if (x[2] === 100 * v) return { etat: "faux", message: "Attention : 1 heure = 60 minutes, pas 100 !" };
          return x[2] === 60 * v ? { etat: "juste" } : { etat: "faux", message: "1 heure = 60 minutes." };
        },
        indice: "Passe par la valeur pour 1 minute. Et rappelle-toi : 1 h = 60 min.",
        correction: `En 1 minute : ${N} ÷ ${m} = ${v} ${objet}. En ${c} minutes : ${c} × ${v} = ${c * v} ${objet}. En 1 heure (60 minutes) : 60 × ${v} = ${nb(60 * v)} ${objet}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: P4,
    id: "choisis-ta-methode",
    titre: "Choisis ta méthode",
    description: "Choisir la procédure la mieux adaptée aux nombres.",
    generer() {
      const S = choisir(SITUATIONS);
      const t = S.taux();
      const methodes = ["Fois plus ou fois moins", "En additionnant deux colonnes", "Retour à l'unité"];
      const type = alea(0, 2);
      let cols, a3, correction, piege;
      if (type === 0) {
        const a = alea(2, 5), k = alea(2, 4);
        cols = [col(a, a * t), col(a * k, a * k * t, false, true)]; a3 = a * k;
        correction = `${nb(a * k)}, c'est ${k} fois ${nb(a)} : ${k} × ${u(a * t, S.u2)} = ${u(a3 * t, S.u2)}.`;
        piege = piegeAdditif(0, a, a * t, a3, S);
      } else if (type === 1) {
        let a1, a2;
        do { a1 = alea(2, 6); a2 = alea(a1 + 1, 9); } while (a2 % a1 === 0);
        a3 = a1 + a2;
        cols = [col(a1, a1 * t), col(a2, a2 * t), col(a3, a3 * t, false, true)];
        correction = `${nb(a3)} = ${a1} + ${a2}, donc ${u(a1 * t, S.u2)} + ${u(a2 * t, S.u2)} = ${u(a3 * t, S.u2)}.`;
        piege = piegeAdditif(0, a2, a2 * t, a3, S);
      } else {
        let a;
        do { a = alea(3, 8); a3 = alea(2, 9); } while (a3 % a === 0 || a % a3 === 0);
        cols = [col(a, a * t), col(a3, a3 * t, false, true)];
        correction = `Pour 1 : ${u(a * t, S.u2)} ÷ ${a} = ${u(t, S.u2)}, puis ${a3} × ${u(t, S.u2)} = ${u(a3 * t, S.u2)}.`;
        piege = piegeAdditif(0, a, a * t, a3, S);
      }
      const tb = tableau(S, cols);
      return {
        consigne: "Choisis la méthode la plus adaptée à ces nombres, puis complète le tableau.",
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>Méthode :</p>[s]</div><div class="etape-pb">${tb.html}</div>`,
        listes: [methodes],
        verifier(v) {
          if (v[0] == null) return { etat: "incomplet", message: "Choisis une méthode." };
          const r = verifierTableau(v.slice(1), tb.attendus, [piege]);
          if (r.etat === "juste" && v[0] !== type) return { etat: "juste", message: `Ta réponse est juste ! Mais ici, la méthode la plus rapide était : ${methodes[type].toLowerCase()}.` };
          return r;
        },
        indice: "Regarde les nombres : l'un est-il un multiple de l'autre ? Est-il la somme de deux autres ? Sinon, passe par l'unité.",
        correction: `Méthode la plus adaptée : ${methodes[type].toLowerCase()}. ${correction}`
      };
    }
  },

  {
    groupe: P4,
    id: "indiquer-procedure",
    titre: "Indiquer la procédure",
    description: "Compléter le tableau et dire pour chaque case : multiplier, diviser, additionner ou unité.",
    generer() {
      const art = choisir(ARTICLES), S = situationAchat(art);
      const a = choisir([6, 8, 10]), p = choisir([0.6, 0.9, 1.2, 1.5, 0.75, 2.5, 1.8]);
      const k = choisir([2, 3]);
      const colonnes = [a / 2, k * a, a + a / 2, 1];
      // la dernière colonne : un nombre qu'on n'obtient qu'en passant par l'unité
      const connus = [a, ...colonnes];
      const sommes = new Set(connus.flatMap(x => connus.map(y => x + y)));
      const candidats = [];
      for (let x = 2; x <= 12; x++) if (!connus.includes(x) && !sommes.has(x) && !connus.some(y => x % y === 0 && y > 1) && !connus.some(y => y % x === 0)) candidats.push(x);
      if (!candidats.length) return this.generer();
      colonnes.push(choisir(candidats));
      const PROC = ["multiplier", "diviser", "additionner", "unité"];
      const attenduesProc = [1, 0, 2, 1, 3];
      const tb = tableau(S, [col(a, r2(a * p)), ...colonnes.map(c => col(c, r2(c * p), false, true))]);
      return {
        consigne: `${a} ${art[0]} coûtent ${euros(a * p)}. Complète le tableau, puis indique pour chaque colonne la procédure utilisée.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb">${tb.html}</div>` + colonnes.map(c => `<div class="etape-pb enonce-ligne"><span>Pour ${nb(c)} :</span>[s]</div>`).join(""),
        listes: colonnes.map(() => PROC),
        verifier(v) {
          const prix = v.slice(0, 5), procs = v.slice(5);
          if (procs.some(x => x == null)) return { etat: "incomplet", message: "Choisis une procédure pour chaque colonne." };
          const r = verifierCases(prix, tb.attendus);
          if (r.etat !== "juste") return r.etat === "incomplet" ? r : { etat: "faux", message: r.message + " Vérifie les prix." };
          const fausses = procs.map((x, i) => x === attenduesProc[i] ? 0 : i + 1).filter(Boolean);
          if (fausses.length) return { etat: "faux", message: `Les prix sont justes, mais revois la procédure pour ${fausses.map(i => nb(colonnes[i - 1])).join(" et ")}.` };
          return { etat: "juste" };
        },
        indice: `Compare chaque nombre à ${a} : la moitié ? ${k} fois plus ? ${a} + sa moitié ? Pour 1, on divise par ${a}. Le dernier : on passe par 1.`,
        correction: [
          `${nb(a / 2)} = ${a} ÷ 2 (diviser) : ${euros(a * p)} ÷ 2 = ${euros(a / 2 * p)}`,
          `${k * a} = ${k} × ${a} (multiplier) : ${k} × ${euros(a * p)} = ${euros(k * a * p)}`,
          `${a + a / 2} = ${a} + ${a / 2} (additionner) : ${euros(a * p)} + ${euros(a / 2 * p)} = ${euros((a + a / 2) * p)}`,
          `1 = ${a} ÷ ${a} (diviser) : ${euros(a * p)} ÷ ${a} = ${euros(p)}`,
          `${colonnes[4]} (unité) : ${colonnes[4]} × ${euros(p)} = ${euros(colonnes[4] * p)}`
        ].join("<br>")
      };
    }
  },

  {
    groupe: P4,
    id: "deux-facons",
    titre: "De deux façons",
    description: "Calculer le même prix par l'addition de colonnes, puis par l'unité.",
    generer() {
      const art = choisir(ARTICLES), a = choisir([4, 6, 8, 10]), p = choisir([0.6, 0.9, 1.2, 1.5, 2.2, 0.75, 1.8]);
      const m = choisir([1, 2]), c = m * a + a / 2;
      const T = r2(a * p), moitie = r2(T / 2), total = r2(c * p);
      const decomposition = m === 1 ? `${a} + ${a / 2}` : `${a} + ${a} + ${a / 2}`;
      return {
        consigne: `${a} ${art[0]} coûtent ${euros(T)}. Calcule le prix de ${c} ${art[0]} de deux façons.`,
        classeLigne: "etapes",
        ligne: `<p><strong>Méthode 1 : en additionnant</strong> (${c} = ${decomposition})</p>`
          + etape(`${a / 2} ${art[0]} (la moitié de ${a}) coûtent`, "€") + etape(`donc ${c} ${art[0]} coûtent`, "€")
          + `<p><strong>Méthode 2 : avec l'unité</strong></p>`
          + etape(`1 ${art[1]} coûte`, "€") + etape(`donc ${c} ${art[0]} coûtent`, "€"),
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux méthodes." };
          const att = [moitie, total, p, total], noms = ["la moitié", "le total de la méthode 1", "le prix d'un seul", "le total de la méthode 2"];
          const fausses = att.map((a2, i) => Math.abs(x[i] - a2) < 1e-9 ? -1 : i).filter(i => i >= 0);
          if (!fausses.length) return { etat: "juste", message: "Les deux méthodes donnent bien le même résultat !" };
          return { etat: "faux", message: `À revoir : ${fausses.map(i => noms[i]).join(", ")}.` };
        },
        indice: `Méthode 1 : la moitié de ${euros(T)}, puis additionne. Méthode 2 : ${euros(T)} ÷ ${a}, puis × ${c}.`,
        correction: `Méthode 1 : ${a / 2} ${art[0]} coûtent ${euros(T)} ÷ 2 = ${euros(moitie)}, donc ${c} ${art[0]} coûtent ${m === 1 ? `${euros(T)} + ${euros(moitie)}` : `${euros(T)} + ${euros(T)} + ${euros(moitie)}`} = ${euros(total)}.<br>`
          + `Méthode 2 : 1 ${art[1]} coûte ${euros(T)} ÷ ${a} = ${euros(p)}, donc ${c} × ${euros(p)} = ${euros(total)}.`
      };
    }
  },

  {
    groupe: P4,
    id: "fois-plus-fois-moins",
    titre: "« 4 fois plus », « 4 fois moins »",
    description: "Traduire ces expressions par une multiplication ou une division.",
    generer() {
      const k = alea(2, 6), n = alea(3, 30);
      const [texte, r, unite, op] = choisir([
        [`Une trottinette coûte ${n * 2} €. Un vélo coûte ${k} fois plus cher. Combien coûte le vélo ?`, n * 2 * k, "€", "×"],
        [`Un vélo coûte ${n * 2 * k} €. Une trottinette coûte ${k} fois moins cher. Combien coûte la trottinette ?`, n * 2, "€", "÷"],
        [`Tom a ${n} billes. Léa en a ${k} fois plus. Combien Léa a-t-elle de billes ?`, n * k, "billes", "×"],
        [`Tom a ${n * k} billes. Léa en a ${k} fois moins. Combien Léa a-t-elle de billes ?`, n, "billes", "÷"],
        [`Un chat pèse ${n % 6 + 3} kg. Un chien est ${k} fois plus lourd. Combien pèse le chien ?`, (n % 6 + 3) * k, "kg", "×"],
        [`Une tour mesure ${(n + 10) * k} m. Une maison est ${k} fois moins haute. Quelle est la hauteur de la maison ?`, n + 10, "m", "÷"]
      ]);
      const donnee = op === "×" ? r / k : r * k;
      return {
        consigne: texte,
        ligne: `[d] ${unite}`,
        verifier(v) {
          const res = verifierNombre(v[0], r);
          const x = lireNombre(v[0]);
          if (res.etat === "faux" && (x === donnee + k || x === donnee - k)) res.message = `« ${k} fois ${op === "×" ? "plus" : "moins"} », ce n'est pas ${op === "×" ? "+" : "−"} ${k} : c'est ${op === "×" ? "× " + k : "÷ " + k}.`;
          if (res.etat === "faux" && x === (op === "×" ? donnee / k : donnee * k)) res.message = `Attention : « ${k} fois ${op === "×" ? "plus" : "moins"} », c'est ${op === "×" ? "une multiplication" : "une division"}.`;
          return res;
        },
        indice: `« ${k} fois plus » : on multiplie par ${k}. « ${k} fois moins » : on divise par ${k}.`,
        correction: `« ${k} fois ${op === "×" ? "plus" : "moins"} », c'est ${op} ${k} : ${nb(donnee)} ${op} ${k} = ${nb(r)} ${unite}.`
      };
    }
  },

  {
    groupe: P4,
    id: "problemes",
    titre: "Problèmes de proportionnalité",
    description: "Recettes, prix au kilo, carburant… avec un tableau et une phrase réponse.",
    generer() {
      const modele = alea(0, 4);
      let S, cols, texte, phrase, faux, calcul;
      if (modele === 0) {
        const p = choisir([2, 4]), q = p === 2 ? choisir([6, 8, 10]) : choisir([6, 10, 12]), f = choisir([60, 80, 100, 120]);
        S = { g1: "Nombre de personnes", u1: "", g2: "Masse de farine", u2: "g" };
        cols = [col(p, f), col(q, f / p * q, false, true)];
        texte = `Une recette de gâteau pour ${p} personnes demande ${f} g de farine. Quelle masse de farine faut-il pour ${q} personnes ?`;
        phrase = r => `Il faut ${nb(r)} g de farine pour ${q} personnes.`; faux = r => [`Il faut ${nb(r)} personnes.`, `Il faut ${nb(r)} g de farine pour ${p} personnes.`];
        calcul = q % p === 0 ? `${q} personnes, c'est ${q / p} fois ${p} personnes : ${q / p} × ${f} g = ${nb(f / p * q)} g.` : `Pour 1 personne : ${f} g ÷ ${p} = ${f / p} g ; pour ${q} : ${q} × ${f / p} g = ${nb(f / p * q)} g.`;
      } else if (modele === 1) {
        const t = choisir([2, 3, 4, 2.5, 1.8, 3.2]), a = alea(2, 5), c = alea(2, 9);
        if (a === c) return this.generer();
        S = { g1: "Masse de tomates", u1: "kg", g2: "Prix", u2: "€" };
        cols = [col(a, r2(a * t)), col(c, r2(c * t), false, true)];
        texte = `${a} kg de tomates coûtent ${euros(a * t)}. Combien coûtent ${c} kg de tomates ?`;
        phrase = r => `${c} kg de tomates coûtent ${nb(r)} €.`; faux = r => [`${nb(r)} kg de tomates coûtent ${c} €.`, `Le prix au kilo est ${nb(r)} €.`];
        calcul = `Prix au kilo : ${euros(a * t)} ÷ ${a} = ${euros(t)} ; ${c} × ${euros(t)} = ${euros(c * t)}.`;
      } else if (modele === 2) {
        const l = choisir([5, 6, 7, 8]), d = choisir([150, 250, 300, 350]);
        S = { g1: "Distance", u1: "km", g2: "Carburant", u2: "L" };
        cols = [col(100, l), col(d, l * d / 100, false, true)];
        texte = `Une voiture consomme ${l} L de carburant pour 100 km. Combien consomme-t-elle pour ${d} km ?`;
        phrase = r => `Pour ${d} km, la voiture consomme ${nb(r)} L.`; faux = r => [`Pour ${nb(r)} km, la voiture consomme ${l} L.`, `La voiture parcourt ${nb(r)} km.`];
        const c = Math.floor(d / 100), reste = d % 100;
        calcul = `${d} km = ${c} × 100 km${reste ? " + 50 km" : ""} : ${c} × ${l} L${reste ? ` + ${nb(l / 2)} L (la moitié de ${l} L)` : ""} = ${nb(l * d / 100)} L.`;
      } else if (modele === 3) {
        const b = 5 * alea(13, 17), m = alea(3, 10);
        S = { g1: "Durée", u1: "min", g2: "Nombre de battements", u2: "" };
        cols = [col(1, b), col(m, b * m, false, true)];
        texte = `Au repos, le cœur de Nina bat ${b} fois par minute. Combien de fois bat-il en ${m} minutes ?`;
        phrase = r => `En ${m} minutes, le cœur de Nina bat ${nb(r)} fois.`; faux = r => [`En ${nb(r)} minutes, le cœur de Nina bat ${b} fois.`, `Le cœur de Nina bat ${nb(r)} fois par minute.`];
        calcul = `${m} × ${b} battements = ${nb(b * m)} battements.`;
      } else {
        const t = alea(3, 9), a = alea(2, 4) * 2, c = a / 2 * alea(3, 5);
        S = { g1: "Longueur de tissu", u1: "m", g2: "Prix", u2: "€" };
        cols = [col(a, a * t), col(c, c * t, false, true)];
        texte = `${a} m de tissu coûtent ${a * t} €. Combien coûtent ${c} m de ce tissu ?`;
        phrase = r => `${c} m de tissu coûtent ${nb(r)} €.`; faux = r => [`${nb(r)} m de tissu coûtent ${c} €.`, `Le prix au mètre est ${nb(r)} €.`];
        calcul = `${c} m, c'est ${c / (a / 2)} fois ${a / 2} m, et ${a / 2} m coûtent la moitié de ${a * t} € = ${a / 2 * t} € : ${c / (a / 2)} × ${a / 2 * t} € = ${c * t} €.`;
      }
      const tb = tableau(S, cols);
      const r = tb.attendus[0];
      const piege = piegeAdditif(0, cols[0].va, cols[0].vb, cols[1].va, S);
      const phrases = melanger([phrase(r), ...faux(r)]);
      return {
        consigne: `${texte}<br>Complète le tableau, puis choisis la phrase réponse.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb">${tb.html}</div><div class="etape-pb"><p>Phrase réponse :</p>[s]</div>`,
        listes: [phrases],
        verifier(v) {
          const res = verifierTableau([v[0]], tb.attendus, [piege]);
          if (res.etat === "incomplet" || v[1] == null) return { etat: "incomplet", message: "Complète le tableau et choisis une phrase réponse." };
          if (res.etat === "faux") return { etat: "faux", message: res.message.includes("Attention") ? res.message : "Le tableau n'est pas juste." };
          return phrases[v[1]] === phrase(r) ? { etat: "juste" } : { etat: "faux", message: "Le calcul est juste, mais relis bien ta phrase réponse : répond-elle à la question ?" };
        },
        indice: "Repère les deux grandeurs, puis cherche la méthode la plus simple : fois plus, en additionnant, ou retour à l'unité.",
        correction: `${calcul}<br>${phrase(r)}`
      };
    }
  },

  {
    groupe: P4,
    id: "piege",
    titre: "Proportionnel ou piège ?",
    description: "Avant de calculer, vérifier que la situation est proportionnelle.",
    generer() {
      const t = alea(2, 6), k = alea(2, 5);
      const [texte, prop, r, unite, explication] = choisir([
        [`${k} kg de pommes coûtent ${k * t} €. Combien coûtent ${2 * k} kg ?`, true, 2 * k * t, "€", `C'est proportionnel (prix au kilo constant) : 2 fois plus de pommes, donc 2 × ${k * t} € = ${2 * k * t} €.`],
        [`Un robinet remplit ${k * t} L en ${k} min. Quel volume remplit-il en ${3 * k} min ?`, true, 3 * k * t, "L", `C'est proportionnel (débit constant) : 3 fois plus de temps, donc 3 × ${k * t} L = ${3 * k * t} L.`],
        ["Un enfant de 4 ans mesure 1 m. Combien mesurera-t-il à 8 ans ?", false, null, "m", "Ce n'est pas proportionnel : la taille ne double pas quand l'âge double. On ne peut pas savoir par un calcul."],
        [`Un œuf dur cuit en ${8 + k} minutes. Combien de temps faut-il pour cuire ${k + 1} œufs ensemble dans la même casserole ?`, false, null, "min", `Ce n'est pas proportionnel : les œufs cuisent en même temps, il faut toujours ${8 + k} minutes !`],
        [`À 10 h, il fait ${10 + t} °C. Quelle température fera-t-il à 20 h ?`, false, null, "°C", "Ce n'est pas proportionnel : la température ne double pas quand l'heure double. On ne peut pas savoir par un calcul."],
        [`Paul a 12 ans et pèse ${35 + t} kg. Combien pèsera-t-il à 24 ans ?`, false, null, "kg", "Ce n'est pas proportionnel : la masse ne double pas quand l'âge double. On ne peut pas savoir par un calcul."]
      ]);
      return {
        consigne: texte,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>Peut-on répondre avec la proportionnalité ?</p>[s]</div><div class="etape-pb"><p>Si oui, écris la réponse (sinon, laisse vide) :</p><p class="rep">[d] ${unite}</p></div>`,
        listes: [["Oui, c'est une situation de proportionnalité", "Non, ce n'est pas une situation de proportionnalité"]],
        verifier(v) {
          if (v[0] == null) return { etat: "incomplet", message: "Réponds d'abord à la première question." };
          if ((v[0] === 0) !== prop) return { etat: "faux", message: prop ? "Relis bien : y a-t-il une valeur « par unité » qui reste la même ?" : "Attention au piège : si la première grandeur double, la seconde double-t-elle vraiment ?" };
          if (!prop) return { etat: "juste" };
          return verifierNombre(v[1], r);
        },
        indice: "Avant de calculer, demande-toi : si la première grandeur double, la seconde double-t-elle aussi ?",
        correction: explication
      };
    }
  },

  {
    groupe: P4,
    id: "defi-peinture",
    titre: "Défi : les pots de peinture",
    description: "Un problème en plusieurs étapes, où il faut arrondir au pot supérieur.",
    generer() {
      const c = choisir([4, 5, 6, 8, 10]), L1 = alea(2, 4), S1 = c * L1;
      const V = choisir([2, 2.5, 3, 5]), P = alea(15, 32);
      let S, litres, pots;
      do { litres = choisir([alea(5, 14), alea(5, 14) + 0.5]); S = c * litres; pots = Math.ceil(litres / V - 1e-9); } while (Math.abs(litres / V - Math.round(litres / V)) < 1e-9 || !Number.isInteger(S));
      return {
        consigne: `Pour peindre ${S1} m² de mur, il faut ${L1} L de peinture. La peinture est vendue en pots de ${nb(V)} L, à ${P} € le pot. Combien faut-il dépenser pour peindre ${S} m² de mur ?`,
        classeLigne: "etapes",
        ligne: etape("1. Combien de m² peint-on avec 1 L ?", "m²") + etape(`2. Combien de litres faut-il pour ${S} m² ?`, "L")
          + etape("3. Combien de pots faut-il acheter ?", "pots", "[n]") + etape("4. Combien faut-il dépenser ?", "€"),
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Réponds aux quatre questions." };
          if (x[0] !== c) return { etat: "faux", message: `Avec 1 L : ${S1} ÷ ${L1}.` };
          if (Math.abs(x[1] - litres) > 1e-9) return { etat: "faux", message: `1 L peint ${c} m² : pour ${S} m², il faut ${S} ÷ ${c} litres.` };
          if (x[2] === pots - 1) return { etat: "faux", message: `${pots - 1} pots font ${nb((pots - 1) * V)} L : ce n'est pas assez ! On ne peut pas acheter un morceau de pot.` };
          if (x[2] !== pots) return { etat: "faux", message: `Il faut ${nb(litres)} L, et chaque pot contient ${nb(V)} L.` };
          return verifierNombre(v[3], pots * P);
        },
        indice: "Étape par étape : 1 L peint combien de m² ? Combien de litres en tout ? Un pot entamé doit être acheté entier.",
        correction: `1 L peint ${S1} ÷ ${L1} = ${c} m². Pour ${S} m², il faut ${S} ÷ ${c} = ${nb(litres)} L. ${pots - 1} pots font ${nb((pots - 1) * V)} L (pas assez) : il faut ${pots} pots, soit ${pots} × ${P} = ${pots * P} €.`
      };
    }
  },

  /* ================= Feuille 5 ================= */

  {
    groupe: P5,
    id: "lire-echelle",
    titre: "Utiliser une échelle",
    description: "1 cm représente 5 km, 4 cm représentent 10 km, 1 cm représente 500 m…",
    generer() {
      const mode = choisir(["unitaire", "unitaire", "non-unitaire", "conversion"]);
      if (mode === "non-unitaire") {
        const [kc, R] = choisir([[4, 10], [2, 3], [2, 5], [4, 6], [5, 10], [4, 2]]), q = R / kc;
        const d = choisir([alea(3, 12), alea(3, 9) + 0.5]);
        const S = { g1: "Sur la carte", u1: "cm", g2: "Dans la réalité", u2: "km" };
        const tb = tableau(S, [col(kc, R), col(1, q, false, true), col(d, r2(d * q), false, true)]);
        return {
          consigne: `Sur une carte, ${kc} cm représentent ${R} km. Complète le tableau : que représente 1 cm ? et ${nb(d)} cm ?`,
          ligne: tb.html,
          verifier: v => verifierCases(v, tb.attendus),
          indice: `Commence par 1 cm : ${R} km ÷ ${kc}.`,
          correction: `1 cm représente ${R} ÷ ${kc} = ${nb(q)} km. ${nb(d)} cm représentent ${nb(d)} × ${nb(q)} = ${nb(r2(d * q))} km.`
        };
      }
      if (mode === "conversion") {
        const k = choisir([200, 250, 500]), d = choisir([alea(3, 12), alea(2, 9) + 0.5, alea(21, 79) / 10]);
        const reel = r2(d * k);
        return {
          consigne: `Sur une carte, 1 cm représente ${k} m. Deux villages sont à ${nb(d)} cm l'un de l'autre sur la carte.`,
          classeLigne: "etapes",
          ligne: etape("1. Quelle est la distance réelle en mètres ?", "m") + etape("2. Écris-la en kilomètres.", "km"),
          verifier(v) {
            const x = v.map(lireNombre);
            if (x.some(isNaN)) return { etat: "incomplet", message: "Réponds aux deux questions." };
            if (Math.abs(x[0] - reel) > 1e-9) return { etat: "faux", message: `${nb(d)} cm représentent ${nb(d)} × ${k} m.` };
            if (Math.abs(x[1] - reel / 1000) > 1e-9) return { etat: "faux", message: "1 km = 1 000 m : on divise par 1 000." };
            return { etat: "juste" };
          },
          indice: "Multiplie par l'échelle, puis convertis : 1 km = 1 000 m.",
          correction: `${nb(d)} × ${k} m = ${nb(reel)} m, et ${nb(reel)} m = ${nb(reel / 1000)} km.`
        };
      }
      const plan = Math.random() < 0.3;
      const k = plan ? choisir([2, 3, 4, 5]) : choisir([2, 3, 4, 5, 10, 20, 25]);
      const ur = plan ? "m" : "km";
      const d = Math.random() < 0.25 ? alea(2, 9) + 0.5 : alea(2, 12);
      const versReel = Math.random() < 0.6;
      const S = { g1: `Distance sur ${plan ? "le plan" : "la carte"}`, u1: "cm", g2: "Distance réelle", u2: ur };
      const tb = tableau(S, [col(1, k), col(d, d * k, !versReel, versReel)], { coef: { texte: `× ${k}` } });
      return {
        consigne: `Sur ${plan ? "le plan d'une maison" : "une carte"}, 1 cm représente ${k} ${ur} dans la réalité. Complète le tableau.`,
        ligne: tb.html,
        verifier: v => verifierCases(v, tb.attendus),
        indice: `Chaque centimètre représente ${k} ${ur} : on multiplie par ${k} pour passer à la réalité, on divise par ${k} pour revenir ${plan ? "au plan" : "à la carte"}.`,
        correction: versReel
          ? `${nb(d)} cm représentent ${nb(d)} × ${k} ${ur} = ${nb(d * k)} ${ur}.`
          : `${nb(d * k)} ${ur} ÷ ${k} = ${nb(d)} : cela fait ${nb(d)} cm sur ${plan ? "le plan" : "la carte"}.`
      };
    }
  },

  {
    groupe: P5,
    id: "echelle-graphique",
    titre: "L'échelle graphique",
    description: "Mesurer le segment d'échelle, trouver ce que représente 1 cm, puis les distances.",
    generer() {
      const [g, R] = choisir([[2, 10], [2, 5], [4, 10], [3, 15], [2, 20], [4, 2]]), q = R / g;
      const cm = 50, x0 = 30, s = svg("svg", { viewBox: "0 0 330 120", width: 330, height: 120, class: "carte", role: "img", "aria-label": "Échelle graphique et règle" });
      s.append(svg("rect", { x: 0, y: 0, width: 330, height: 120, rx: 10, class: "carte-fond" }));
      for (let i = 0; i < g; i++) s.append(svg("rect", { x: x0 + i * cm, y: 28, width: cm, height: 10, class: i % 2 ? "echelle-blanc" : "echelle-noir" }));
      s.append(svg("text", { x: x0, y: 20, class: "carte-cm" }, "0"), svg("text", { x: x0 + g * cm, y: 20, class: "carte-cm" }, `${R} km`));
      regleDessinee(s, x0, 50, cm, 5.5);
      const [A, B, C, D] = melanger(["Montclair", "Bellerive", "Lavaur", "Saint-Aubin", "Arnac", "Felletin"]);
      const d1 = choisir([alea(3, 9), alea(2, 7) + 0.5]), d2 = choisir([alea(3, 12), alea(21, 79) / 10]);
      return {
        consigne: `Voici l'échelle graphique d'une carte routière, avec une règle graduée en centimètres posée dessous.`,
        figure: s,
        classeLigne: "etapes",
        ligne: etape("1. Quelle distance réelle représente 1 cm sur cette carte ?", "km")
          + etape(`2. Sur la carte, ${A} et ${B} sont à ${nb(d1)} cm. Quelle est la distance réelle ?`, "km")
          + etape(`3. Sur la carte, ${C} et ${D} sont à ${nb(d2)} cm. Quelle est la distance réelle ?`, "km"),
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Réponds aux trois questions." };
          if (Math.abs(x[0] - q) > 1e-9) return { etat: "faux", message: x[0] === R ? `${R} km, c'est ce que représente tout le segment, qui mesure ${g} cm.` : `Le segment d'échelle mesure ${g} cm et représente ${R} km.` };
          const fausses = [[x[1], d1], [x[2], d2]].map(([y, d], i) => Math.abs(y - r2(d * q)) < 1e-9 ? 0 : i + 2).filter(Boolean);
          return fausses.length ? { etat: "faux", message: `À revoir : question ${fausses.join(" et ")}.` } : { etat: "juste" };
        },
        indice: "Lis sur la règle la longueur du segment d'échelle, puis divise la distance réelle par cette longueur.",
        correction: `Le segment mesure ${g} cm et représente ${R} km : 1 cm représente ${R} ÷ ${g} = ${nb(q)} km.<br>${nb(d1)} × ${nb(q)} = ${nb(r2(d1 * q))} km ; ${nb(d2)} × ${nb(q)} = ${nb(r2(d2 * q))} km.`
      };
    }
  },

  {
    groupe: P5,
    id: "mesurer-carte",
    titre: "Mesurer sur une carte",
    description: "Lire une distance au millimètre avec la règle, puis utiliser l'échelle.",
    generer() {
      const k = choisir([2, 3, 4, 5, 10]);
      const d1 = alea(15, 50) / 10, d2 = alea(15, 50) / 10;
      const [A, B, C] = melanger(["Arnac", "Bellac", "Crozant", "Dun", "Évaux", "Felletin"]).slice(0, 3);
      const cm = 56, x0 = 30, y = 60, L = (d1 + d2) * cm, W = Math.ceil(d1 + d2) * cm + 70;
      const s = svg("svg", { viewBox: `0 0 ${W} 150`, width: W, height: 150, class: "carte", role: "img", "aria-label": "Carte avec une route et une règle" });
      s.append(svg("rect", { x: 0, y: 0, width: W, height: 150, rx: 10, class: "carte-fond" }));
      s.append(svg("path", { d: `M${x0},${y} L${x0 + L},${y}`, class: "carte-route" }));
      [[A, 0], [B, d1], [C, d1 + d2]].forEach(([n, p]) => {
        s.append(svg("circle", { cx: x0 + p * cm, cy: y, r: 5, class: "carte-ville" }), svg("text", { x: x0 + p * cm, y: y - 14, class: "carte-nom" }, n));
      });
      regleDessinee(s, x0, y + 18, cm, Math.ceil(d1 + d2));
      s.append(svg("text", { x: W / 2, y: 140, class: "carte-echelle" }, `Échelle : 1 cm sur la carte représente ${k} km`));
      const [depart, arrivee, dist] = choisir([[A, B, d1], [B, C, d2], [A, C, r2(d1 + d2)]]);
      const reel = r2(dist * k);
      return {
        consigne: `La règle est graduée en centimètres et en millimètres. Mesure la distance entre ${depart} et ${arrivee} sur la carte, puis calcule la distance réelle par la route.`,
        figure: s,
        classeLigne: "etapes",
        ligne: etape("1. Distance sur la carte :", "cm") + etape("2. Distance réelle :", "km"),
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Réponds aux deux questions." };
          if (Math.abs(x[0] - dist) > 1e-9) return { etat: "faux", message: `Relis la règle : compte les centimètres, puis les millimètres (chaque petit trait vaut 1 mm = 0,1 cm).` };
          if (Math.abs(x[1] - dist) < 1e-9) return { etat: "faux", message: `${nb(dist)} cm, c'est la distance sur la carte : il faut la convertir avec l'échelle.` };
          return verifierNombre(v[1], reel);
        },
        indice: `Lis la distance en cm sur la règle (au millimètre près), puis multiplie par ${k}.`,
        correction: `Sur la carte, ${depart} et ${arrivee} sont à ${nb(dist)} cm. En réalité : ${nb(dist)} × ${k} km = ${nb(reel)} km.`
      };
    }
  },

  {
    groupe: P5,
    id: "mesurer-regle",
    titre: "Mesurer avec la règle",
    description: "Placer la règle virtuelle entre deux lieux, mesurer au millimètre, puis utiliser l'échelle.",
    generer() {
      const [k, ur] = choisir([[500, "m"], [250, "m"], [200, "m"], [2, "km"], [5, "km"]]);
      const W = 600, H = 400;
      const lieux = melanger([["Port", "le Port"], ["Phare", "le Phare"], ["Grotte", "la Grotte"], ["Village", "le Village"], ["Moulin", "le Moulin"], ["Plage", "la Plage"]]).slice(0, 4);
      const noms = lieux.map(l => l[0]), [deA, deB] = [lieux[0][1], lieux[1][1]];
      let A, B, Lcm, angle;
      do {
        Lcm = alea(30, 100) / 10; angle = alea(-170, 170);
        A = { x: alea(80, W - 80), y: alea(70, H - 150) };
        B = V.plus(A, V.fois(V.angle(angle * DEG), Lcm * CM));
      } while (B.x < 60 || B.x > W - 60 || B.y < 50 || B.y > H - 130);
      const s = figureGeo(W, H, "Carte d'une île");
      s.append(svg("path", { d: `M40,60 Q${W / 2},0 ${W - 40},50 Q${W + 10},${H / 2} ${W - 50},${H - 90} Q${W / 2},${H - 40} 50,${H - 100} Q-10,${H / 2} 40,60 Z`, class: "carte-fond" }));
      const autres = [];
      while (autres.length < 2) {
        const P = { x: alea(60, W - 60), y: alea(50, H - 140) };
        if ([A, B, ...autres].every(Q => Math.hypot(P.x - Q.x, P.y - Q.y) > 90)) autres.push(P);
      }
      [[A, noms[0]], [B, noms[1]], [autres[0], noms[2]], [autres[1], noms[3]]].forEach(([P, n]) => {
        s.append(svg("circle", { cx: P.x, cy: P.y, r: 5, class: "carte-ville" }), svg("text", { x: P.x, y: P.y - 12, class: "carte-nom" }, n));
      });
      s.append(svg("text", { x: W / 2, y: H - 16, class: "carte-echelle" }, `Échelle : 1 cm sur la carte représente ${k} ${ur}`));
      const regle = creerRegle(11);
      regle.placer(40, H - 100, 0);
      s.append(regle);
      const mobile = rendreMobile(s, regle, { points: [A, B], angles: [angle, angle + 180] });
      const reel = r2(Lcm * k);
      return {
        consigne: `Fais glisser la règle (la poignée ↻ la fait tourner) pour mesurer la distance à vol d'oiseau entre ${deA} et ${deB}, au millimètre près.`,
        figure: s,
        classeLigne: "etapes",
        ligne: etape("1. Distance sur la carte :", "cm") + etape("2. Distance réelle :", ur),
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Réponds aux deux questions." };
          if (Math.abs(x[0] - Lcm) > 0.051) return { etat: "faux", message: `Vérifie ta mesure : place le zéro de la règle sur ${deA}, et le bord de la règle sur ${deB}.` };
          if (Math.abs(x[1] - r2(x[0] * k)) < 1e-9 || Math.abs(x[1] - reel) < 1e-9) return { etat: "juste" };
          return { etat: "faux", message: `Avec l'échelle : ${nb(x[0])} cm représentent ${nb(x[0])} × ${k} ${ur}.` };
        },
        indice: "Pose le zéro de la règle sur le premier lieu, puis tourne-la jusqu'au second. Ensuite, multiplie par l'échelle.",
        correction: `Sur la carte, la distance est ${nb(Lcm)} cm. Dans la réalité : ${nb(Lcm)} × ${k} ${ur} = ${nb(reel)} ${ur}${ur === "m" && reel >= 1000 ? ` = ${nb(reel / 1000)} km` : ""}.`,
        // la règle à l'endroit : on part du lieu qui la garde lisible
        surCorrection: () => Math.abs(angle) <= 90 ? regle.placer(A.x, A.y, angle) : regle.placer(B.x, B.y, angle + 180),
        bloquer: mobile.bloquer
      };
    }
  }

];

/* ---------- Le test « Je me teste » : une question par compétence ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Automatismes", activites: ["double-moitie"] },
    { competence: "Reconnaître une situation de proportionnalité", activites: ["proportionnel-ou-pas", "deux-grandeurs", "langage-courant"] },
    { competence: "Un tableau est-il proportionnel ?", activites: ["tableau-proportionnel", "contre-exemple", "intrus"] },
    { competence: "Multiplier ou diviser", activites: ["fois-plus"] },
    { competence: "Additionner des colonnes", activites: ["en-additionnant", "recette"] },
    { competence: "Repérer une erreur", activites: ["trouver-erreur"] },
    { competence: "Le retour à l'unité", activites: ["retour-unite", "coefficient"] },
    { competence: "Utiliser la valeur pour 1", activites: ["combien-au-maximum", "unite-duree"] },
    { competence: "Choisir sa procédure", activites: ["choisis-ta-methode", "indiquer-procedure", "deux-facons"] },
    { competence: "Résoudre un problème", activites: ["problemes", "piege", "fois-plus-fois-moins"] },
    { competence: "Utiliser une échelle", activites: ["lire-echelle", "echelle-graphique"] },
    { competence: "Mesurer sur une carte", activites: ["mesurer-carte", "mesurer-regle"] }
  ]
};
