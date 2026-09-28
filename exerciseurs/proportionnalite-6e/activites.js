/* =====================================================================
   EXERCISEUR « PROPORTIONNALITÉ » — 6e, chapitre 4

   Les activités suivent le plan de la leçon. Toujours des grandeurs, avec
   leurs unités ; la procédure la mieux adaptée dépend des nombres
   (linéarité multiplicative ou additive, retour à l'unité) ; pas de
   produit en croix. Surtout des nombres entiers, quelques décimaux simples.
   ===================================================================== */

const P1 = "Proportionnel ou pas ?";
const P2 = "Un tableau est-il de proportionnalité ?";
const P3 = "Compléter un tableau de proportionnalité";
const P4 = "Résoudre des problèmes";
const P5 = "Les échelles";

const nb = x => ecrireNombre(x);
const cap = t => t[0].toUpperCase() + t.slice(1);
const u = (x, unite) => unite ? `${nb(x)} ${unite}` : nb(x); // un nombre et son unité

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

function verifierCases(v, attendus) {
  const x = v.map(lireNombre);
  if (x.some(isNaN)) return { etat: "incomplet", message: "Complète toutes les cases." };
  const faux = attendus.filter((a, i) => Math.abs(x[i] - a) > 1e-9).length;
  if (!faux) return { etat: "juste" };
  return { etat: "faux", message: faux > 1 ? `${faux} cases sont fausses.` : "Une case est fausse." };
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

const ACTIVITES = [

  /* ================= 1. Proportionnel ou pas ? ================= */

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

  /* ================= 2. Un tableau est-il de proportionnalité ? ================= */

  {
    groupe: P2,
    id: "tableau-proportionnel",
    titre: "Tableau proportionnel ?",
    description: "Dire si un tableau est un tableau de proportionnalité.",
    generer() {
      const S = choisir(SITUATIONS.slice(0, 6));
      const t = S.taux();
      const x = alea(1, 3);
      const as = [x, 2 * x, 3 * x, choisir([5, 6, 7]) * x];
      const prop = Math.random() < 0.5;
      const fixe = alea(2, 6);
      const bs = as.map(a => prop ? a * t : a * t + fixe);
      const tb = tableau(S, as.map((a, i) => col(a, bs[i])));
      return {
        consigne: "Ce tableau est-il un tableau de proportionnalité ?",
        figure: noeud(tb.html),
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === prop ? "juste" : "faux" }),
        indice: `Compare les colonnes : ${u(as[1], S.u1) || nb(as[1])}, c'est 2 fois ${u(as[0], S.u1) || nb(as[0])}. La seconde ligne double-t-elle aussi ?`,
        correction: prop
          ? `Oui : on passe de la 1re ligne à la 2e en multipliant toujours par ${nb(t)} (c'est le ${S.expr}). Par exemple ${as[3]} × ${nb(t)} = ${nb(bs[3])}.`
          : `Non : ${nb(as[1])}, c'est 2 fois ${nb(as[0])}, mais ${nb(bs[1])} n'est pas 2 fois ${nb(bs[0])} (2 × ${nb(bs[0])} = ${nb(2 * bs[0])}).`
      };
    }
  },

  {
    groupe: P2,
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

  /* ================= 3. Compléter un tableau ================= */

  {
    groupe: P3,
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
      return {
        consigne: facteurCache ? "Complète la flèche, puis le tableau de proportionnalité." : "Complète le tableau de proportionnalité en utilisant la flèche.",
        ligne: tb.html,
        verifier: v => verifierCases(v, tb.attendus),
        indice: `${u(a2, S.u1)}, c'est ${k} fois ${diviser ? "moins" : "plus"} que ${u(a1, S.u1)}.`,
        correction: `${u(a2, S.u1)}, c'est ${k} fois ${diviser ? "moins" : "plus"} que ${u(a1, S.u1)}, donc on ${diviser ? "divise" : "multiplie"} aussi par ${k} : ${diviser ? `${u(a1 * t, S.u2)} ÷ ${k}` : `${k} × ${u(a1 * t, S.u2)}`} = ${u(a2 * t, S.u2)}.`
      };
    }
  },

  {
    groupe: P3,
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
        verifier: v => verifierCases(v, tb.attendus),
        indice: `${u(a3, S.u1)}, c'est ${somme ? `${u(a1, S.u1)} + ${u(a2, S.u1)}` : `${u(a2, S.u1)} − ${u(a1, S.u1)}`}. Fais la même chose sur la deuxième ligne.`,
        correction: `${nb(a3)} = ${somme ? `${a1} + ${a2}` : `${a2} − ${a1}`}, donc ${somme ? `${u(a1 * t, S.u2)} + ${u(a2 * t, S.u2)}` : `${u(a2 * t, S.u2)} − ${u(a1 * t, S.u2)}`} = ${u(a3 * t, S.u2)}.`
      };
    }
  },

  {
    groupe: P3,
    id: "retour-unite",
    titre: "Retour à l'unité",
    description: "Passer par la valeur pour 1 : 5 stylos → 1 stylo → 7 stylos.",
    generer() {
      const S = choisir(SITUATIONS);
      const t = S.taux();
      let a, c;
      do { a = alea(3, 8); c = alea(2, 9); } while (c % a === 0 || a % c === 0);
      const guide = Math.random() < 0.6;
      if (guide) {
        const tb = tableau(S, [col(a, a * t), col(1, t, false, true), col(c, c * t, false, true)],
          { fleches: [{ de: 0, a: 1, texte: `÷ ${a}` }, { de: 1, a: 2, texte: `× ${c}` }] });
        return {
          consigne: "Complète le tableau en passant par l'unité.",
          ligne: tb.html,
          verifier: v => verifierCases(v, tb.attendus),
          indice: `Commence par la valeur pour 1 : divise par ${a}.`,
          correction: `Pour 1 : ${u(a * t, S.u2)} ÷ ${a} = ${u(t, S.u2)}. Pour ${c} : ${c} × ${u(t, S.u2)} = ${u(c * t, S.u2)}.`
        };
      }
      const tb = tableau(S, [col(a, a * t), col(c, c * t, false, true)]);
      return {
        consigne: `Complète le tableau. Astuce : ${c} n'est ni un multiple ni un diviseur de ${a}… passe par la valeur pour 1.`,
        ligne: tb.html,
        verifier: v => verifierCases(v, tb.attendus),
        indice: `Calcule d'abord la valeur pour 1 (le ${S.expr}).`,
        correction: `Pour 1 : ${u(a * t, S.u2)} ÷ ${a} = ${u(t, S.u2)} (c'est le ${S.expr}). Pour ${c} : ${c} × ${u(t, S.u2)} = ${u(c * t, S.u2)}.`
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
    id: "choisis-ta-methode",
    titre: "Choisis ta méthode",
    description: "Choisir la procédure la mieux adaptée aux nombres.",
    generer() {
      const S = choisir(SITUATIONS);
      const t = S.taux();
      const methodes = ["Fois plus ou fois moins", "En additionnant deux colonnes", "Retour à l'unité"];
      const type = alea(0, 2);
      let cols, a3, correction;
      if (type === 0) {
        const a = alea(2, 5), k = alea(2, 4);
        cols = [col(a, a * t), col(a * k, a * k * t, false, true)]; a3 = a * k;
        correction = `${nb(a * k)}, c'est ${k} fois ${nb(a)} : ${k} × ${u(a * t, S.u2)} = ${u(a3 * t, S.u2)}.`;
      } else if (type === 1) {
        let a1, a2;
        do { a1 = alea(2, 6); a2 = alea(a1 + 1, 9); } while (a2 % a1 === 0);
        a3 = a1 + a2;
        cols = [col(a1, a1 * t), col(a2, a2 * t), col(a3, a3 * t, false, true)];
        correction = `${nb(a3)} = ${a1} + ${a2}, donc ${u(a1 * t, S.u2)} + ${u(a2 * t, S.u2)} = ${u(a3 * t, S.u2)}.`;
      } else {
        let a;
        do { a = alea(3, 8); a3 = alea(2, 9); } while (a3 % a === 0 || a % a3 === 0);
        cols = [col(a, a * t), col(a3, a3 * t, false, true)];
        correction = `Pour 1 : ${u(a * t, S.u2)} ÷ ${a} = ${u(t, S.u2)}, puis ${a3} × ${u(t, S.u2)} = ${u(a3 * t, S.u2)}.`;
      }
      const tb = tableau(S, cols);
      return {
        consigne: "Choisis la méthode la plus adaptée à ces nombres, puis complète le tableau.",
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>Méthode :</p>[s]</div><div class="etape-pb">${tb.html}</div>`,
        listes: [methodes],
        verifier(v) {
          if (v[0] == null) return { etat: "incomplet", message: "Choisis une méthode." };
          const r = verifierCases(v.slice(1), tb.attendus);
          if (r.etat === "juste" && v[0] !== type) return { etat: "juste", message: `Ta réponse est juste ! Mais ici, la méthode la plus rapide était : ${methodes[type].toLowerCase()}.` };
          return r;
        },
        indice: "Regarde les nombres : l'un est-il un multiple de l'autre ? Est-il la somme de deux autres ? Sinon, passe par l'unité.",
        correction: `Méthode la plus adaptée : ${methodes[type].toLowerCase()}. ${correction}`
      };
    }
  },

  {
    groupe: P3,
    id: "double-moitie",
    titre: "Double, triple, moitié, quart…",
    description: "Automatismes : les relations multiplicatives simples.",
    generer() {
      const mots = [["double", 2, "×"], ["triple", 3, "×"], ["quadruple", 4, "×"], ["moitié", 2, "÷"], ["tiers", 3, "÷"], ["quart", 4, "÷"]];
      const [mot, k, op] = choisir(mots);
      const n = op === "×" ? alea(3, 25) : k * alea(2, 25);
      const r = op === "×" ? n * k : n / k;
      const article = mot === "moitié" ? "La" : "Le";
      if (Math.random() < 0.6) {
        return {
          consigne: "Calcule.",
          ligne: `${article} ${mot} de ${nb(n)} = [n]`,
          verifier: v => verifierNombre(v[0], r),
          indice: `${article} ${mot}, c'est ${op === "×" ? "multiplier" : "diviser"} par ${k}.`,
          correction: `${article} ${mot} de ${nb(n)} : ${nb(n)} ${op} ${k} = ${nb(r)}.`
        };
      }
      const avecArticle = m => (m === "moitié" ? "la " : "le ") + m;
      const options = mots.map(m => avecArticle(m[0]));
      const [x, y] = [r, n];
      return {
        consigne: `Complète : ${nb(x)} est … de ${nb(y)}.`,
        choix: options,
        verifier: (v, c) => ({ etat: c === avecArticle(mot) ? "juste" : "faux" }),
        indice: `Calcule ${nb(x)} ÷ ${nb(y)} ou ${nb(y)} ÷ ${nb(x)}.`,
        correction: `${nb(y)} ${op} ${k} = ${nb(x)} : ${nb(x)} est ${mot === "moitié" ? "la" : "le"} ${mot} de ${nb(y)}.`
      };
    }
  },

  {
    groupe: P3,
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

  /* ================= 4. Résoudre des problèmes ================= */

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
        const t = alea(2, 6), a = alea(2, 5), c = alea(2, 9);
        S = { g1: "Masse de tomates", u1: "kg", g2: "Prix", u2: "€" };
        cols = [col(a, a * t), col(c, c * t, false, true)];
        texte = `${a} kg de tomates coûtent ${a * t} €. Combien coûtent ${c} kg de tomates ?`;
        phrase = r => `${c} kg de tomates coûtent ${nb(r)} €.`; faux = r => [`${nb(r)} kg de tomates coûtent ${c} €.`, `Le prix au kilo est ${nb(r)} €.`];
        calcul = `Prix au kilo : ${a * t} € ÷ ${a} = ${t} € ; ${c} × ${t} € = ${c * t} €.`;
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
      const phrases = melanger([phrase(r), ...faux(r)]);
      return {
        consigne: `${texte}<br>Complète le tableau, puis choisis la phrase réponse.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb">${tb.html}</div><div class="etape-pb"><p>Phrase réponse :</p>[s]</div>`,
        listes: [phrases],
        verifier(v) {
          const res = verifierCases([v[0]], tb.attendus);
          if (res.etat === "incomplet" || v[1] == null) return { etat: "incomplet", message: "Complète le tableau et choisis une phrase réponse." };
          if (res.etat === "faux") return { etat: "faux", message: "Le tableau n'est pas juste." };
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

  /* ================= 5. Les échelles ================= */

  {
    groupe: P5,
    id: "lire-echelle",
    titre: "Utiliser une échelle",
    description: "Sur la carte, 1 cm représente 5 km : distances réelles et sur la carte.",
    generer() {
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
    id: "mesurer-carte",
    titre: "Mesurer sur une carte",
    description: "Lire une distance avec la règle, puis utiliser l'échelle.",
    generer() {
      const k = choisir([2, 3, 4, 5, 10]);
      const d1 = alea(2, 5), d2 = alea(2, 5);
      const [A, B, C] = melanger(["Arnac", "Bellac", "Crozant", "Dun", "Évaux", "Felletin"]).slice(0, 3);
      const cm = 56, x0 = 30, y = 60, L = (d1 + d2) * cm;
      const s = svg("svg", { viewBox: `0 0 ${L + 70} 150`, width: L + 70, height: 150, class: "carte", role: "img", "aria-label": "Carte avec une route et une règle" });
      s.append(svg("rect", { x: 0, y: 0, width: L + 70, height: 150, rx: 10, class: "carte-fond" }));
      s.append(svg("path", { d: `M${x0},${y} L${x0 + L},${y}`, class: "carte-route" }));
      [[A, 0], [B, d1], [C, d1 + d2]].forEach(([n, p]) => {
        s.append(svg("circle", { cx: x0 + p * cm, cy: y, r: 6, class: "carte-ville" }), svg("text", { x: x0 + p * cm, y: y - 14, class: "carte-nom" }, n));
      });
      // règle graduée en cm
      s.append(svg("rect", { x: x0 - 6, y: y + 22, width: L + 12, height: 30, rx: 3, class: "carte-regle" }));
      for (let i = 0; i <= (d1 + d2) * 2; i++) {
        const xx = x0 + i * cm / 2, entier = i % 2 === 0;
        s.append(svg("line", { x1: xx, y1: y + 22, x2: xx, y2: y + 22 + (entier ? 12 : 7), class: "carte-grad" }));
        if (entier) s.append(svg("text", { x: xx, y: y + 47, class: "carte-cm" }, String(i / 2)));
      }
      s.append(svg("text", { x: x0 + L + 16, y: y + 47, class: "carte-cm" }, "cm"));
      s.append(svg("text", { x: (L + 70) / 2, y: 140, class: "carte-echelle" }, `Échelle : 1 cm sur la carte représente ${k} km`));
      const [depart, arrivee, dist] = choisir([[A, B, d1], [B, C, d2], [A, C, d1 + d2]]);
      return {
        consigne: `Sur cette carte, la règle est graduée en centimètres. Quelle est la distance réelle, par la route, entre ${depart} et ${arrivee} ?`,
        figure: s,
        ligne: `[d] km`,
        verifier(v) {
          const r = verifierNombre(v[0], dist * k);
          if (r.etat === "faux" && lireNombre(v[0]) === dist) r.message = `${dist} cm, c'est la distance sur la carte : il faut la convertir avec l'échelle.`;
          return r;
        },
        indice: `Lis la distance en cm sur la règle, puis multiplie par ${k} (1 cm représente ${k} km).`,
        correction: `Sur la carte, ${depart} et ${arrivee} sont à ${dist} cm. En réalité : ${dist} × ${k} km = ${dist * k} km.`
      };
    }
  }

];
