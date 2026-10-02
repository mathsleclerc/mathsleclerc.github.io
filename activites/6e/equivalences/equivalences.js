/* =====================================================================
   ACTIVITÉ « RÉSOLUTION DE PROBLÈMES — ÉQUIVALENCES » — 6e
   Version interactive de la fiche d'activité. Deux plateaux s'équilibrent
   ou deux paniers ont le même prix : on retrouve ce que vaut chaque objet.
   Règle d'or : ce que l'on fait d'un côté, on le fait de l'autre.
   L'élève manipule les balances, fait lui-même les calculs dans le carnet,
   puis complète les phrases réponses. Nombres entiers.
   Utilise el() (app.js) et alea(), choisir(), melanger(), svg(),
   ecrireNombre(), lireNombre() (moteur.js).
   ===================================================================== */

/* ---------- Objets ---------- */
const OBJ = {
  orange:   { e: "🍊", un: "orange", des: "oranges", art: "Une orange", le: "l'orange" },
  pomme:    { e: "🍎", un: "pomme", des: "pommes", art: "Une pomme", le: "la pomme" },
  poire:    { e: "🍐", un: "poire", des: "poires", art: "Une poire", le: "la poire" },
  kiwi:     { e: "🥝", un: "kiwi", des: "kiwis", art: "Un kiwi", le: "le kiwi" },
  banane:   { e: "🍌", un: "banane", des: "bananes", art: "Une banane", le: "la banane" },
  citron:   { e: "🍋", un: "citron", des: "citrons", art: "Un citron", le: "le citron" },
  melon:    { e: "🍈", un: "melon", des: "melons", art: "Un melon", le: "le melon" },
  ananas:   { e: "🍍", un: "ananas", des: "ananas", art: "Un ananas", le: "l'ananas" },
  pasteque: { e: "🍉", un: "pastèque", des: "pastèques", art: "Une pastèque", le: "la pastèque" },
  cahier:   { e: "📒", un: "cahier", des: "cahiers", art: "Un cahier" },
  stylo:    { e: "🖊️", un: "stylo", des: "stylos", art: "Un stylo" },
  regle:    { e: "📏", un: "règle", des: "règles", art: "Une règle" },
  compas:   { dessin: "compas", un: "compas", des: "compas", art: "Un compas", l: 32 },
  livre:    { e: "📘", un: "livre", des: "livres", art: "Un livre" },
  crayon:   { e: "✏️", un: "crayon", des: "crayons", art: "Un crayon" },
  croissant:{ e: "🥐", un: "croissant", des: "croissants", art: "Un croissant" },
  chocolat: { e: "🍫", un: "tablette de chocolat", des: "tablettes de chocolat", art: "Une tablette de chocolat" },
  jus:      { e: "🧃", un: "brique de jus", des: "briques de jus", art: "Une brique de jus" },
  menuE:    { dessin: "menu", classe: "menu-enfant", texte: "enfant", un: "menu enfant", des: "menus enfant", art: "Un menu enfant", l: 50 },
  menuA:    { dessin: "menu", classe: "menu-adulte", texte: "adulte", un: "menu adulte", des: "menus adultes", art: "Un menu adulte", l: 50 },
  etoile:   { e: "⭐", un: "étoile", des: "étoiles", art: "Une étoile" },
  rond:     { e: "🔵", un: "rond", des: "ronds", art: "Un rond" },
  carre:    { e: "🟩", un: "carré", des: "carrés", art: "Un carré" }
};
/* Masses possibles en grammes : [min, max, pas] */
const MASSES = {
  orange: [150, 250, 50], pomme: [100, 200, 50], poire: [100, 250, 50], kiwi: [50, 100, 50],
  banane: [100, 200, 50], citron: [50, 150, 50], melon: [800, 1500, 100], ananas: [500, 1500, 100],
  pasteque: [2000, 5000, 500]
};
/* Prix possibles en euros : [min, max] */
const PRIX = {
  cahier: [2, 5], stylo: [1, 3], regle: [1, 4], compas: [3, 8], livre: [5, 12], crayon: [1, 2],
  croissant: [1, 2], chocolat: [2, 4], jus: [1, 3], menuE: [4, 7], menuA: [8, 15]
};
const PAIRES_PRIX = [
  { types: ["cahier", "stylo"], lieu: "Au magasin" }, { types: ["regle", "compas"], lieu: "Au magasin" },
  { types: ["livre", "crayon"], lieu: "À la librairie" }, { types: ["croissant", "jus"], lieu: "À la boulangerie" },
  { types: ["chocolat", "jus"], lieu: "À l'épicerie" }, { types: ["menuE", "menuA"], lieu: "À la cantine" }
];

/* ---------- Écriture ---------- */
const N = x => ecrireNombre(x);
const nb = (n, X) => `${n} ${n > 1 ? OBJ[X].des : OBJ[X].un}`;
const minuscule = s => s.charAt(0).toLowerCase() + s.slice(1);
const majuscule = s => s.charAt(0).toUpperCase() + s.slice(1);
const dUn = X => (OBJ[X].art.startsWith("Une") ? "d'une " : "d'un ") + OBJ[X].un;
const ICONE = X => `<span class="ico-texte" aria-hidden="true">${OBJ[X].e || ""}</span>`;
function liste(items) {
  const t = Object.entries(items).filter(([, n]) => n > 0).map(([X, n]) => nb(n, X));
  return t.length > 1 ? t.slice(0, -1).join(", ") + " et " + t[t.length - 1] : t[0] || "rien";
}

/* ---------- Données : plateaux et balances ---------- */
const P = (items = {}, w = 0) => ({ items: { ...items }, w, cache: false });
const B = (iG, wG, iD, wD) => ({ G: P(iG, wG), D: P(iD, wD) });
const autre = c => (c === "G" ? "D" : "G");
const types = p => Object.keys(p.items).filter(X => p.items[X] > 0);
const nbObjets = p => types(p).reduce((s, X) => s + p.items[X], 0);
const vide = p => nbObjets(p) === 0 && p.w === 0;
function nettoyer(b) { for (const c of ["G", "D"]) for (const X of Object.keys(b[c].items)) if (!b[c].items[X]) delete b[c].items[X]; }
const pas = (min, max, step) => min + step * alea(0, Math.round((max - min) / step));

/* ---------- Les situations ---------- */
const ETAPES = [
  {
    titre: "Pour commencer",
    mission: "Les deux plateaux sont équilibrés. Pour trouver la masse d'un objet, il faut qu'il se retrouve seul sur un plateau. Règle d'or : ce que tu fais d'un côté, tu le fais aussi de l'autre ! Clique sur un poids pour l'enlever des deux côtés. Quand il ne reste que des objets identiques, utilise « Partager ».",
    fixes: [
      () => ({ visuel: "balance", unite: "g", balances: [B({ orange: 3 }, 0, {}, 600)], inconnues: ["orange"], valeurs: { orange: 200 },
        enonce: "Les deux plateaux sont équilibrés. Combien pèse une orange ?",
        correction: "3 oranges pèsent 600 g, donc 1 orange pèse 600 : 3 = 200 g." }),
      () => ({ visuel: "balance", unite: "g", balances: [B({ melon: 1 }, 500, {}, 2000)], inconnues: ["melon"], valeurs: { melon: 1500 },
        enonce: "Les deux plateaux sont équilibrés. Combien pèse le melon ?",
        correction: "Le melon et le poids pèsent ensemble 2 000 g, donc le melon pèse 2 000 − 500 = 1 500 g." })
    ],
    generer: genUneInconnue
  },
  {
    titre: "Deux objets à trouver",
    mission: "Deux balances équilibrées, deux objets inconnus. Compare-les : si une balance contient tout ce qu'il y a sur l'autre, retire l'autre balance ! Quand tu connais la masse d'un objet, le bouton « Remplacer » le change en poids sur l'autre balance.",
    fixes: [
      () => ({ visuel: "balance", unite: "g", balances: [B({ pomme: 3, ananas: 1 }, 0, {}, 1400), B({ pomme: 1, ananas: 1 }, 0, {}, 800)],
        inconnues: ["pomme", "ananas"], valeurs: { pomme: 300, ananas: 500 },
        enonce: "Les deux balances sont équilibrées. Combien pèse une pomme ? Et un ananas ?",
        correction: "La deuxième balance porte 1 pomme et 1 ananas, soit 800 g. En retirant cela de la première, il reste 2 pommes : 1 400 − 800 = 600 g. Donc 1 pomme pèse 600 : 2 = 300 g, et 1 ananas pèse 800 − 300 = 500 g." }),
      () => ({ visuel: "balance", unite: "g", construire: true, types: ["kiwi", "poire"],
        balances: [B({ kiwi: 4, poire: 2 }, 0, {}, 700), B({ kiwi: 2, poire: 2 }, 0, {}, 500)],
        inconnues: ["kiwi", "poire"], valeurs: { kiwi: 100, poire: 150 },
        enonce: "4 kiwis et 2 poires pèsent 700 g. 2 kiwis et 2 poires pèsent 500 g. Construis d'abord les deux balances qui représentent la situation, puis trouve la masse d'un kiwi et celle d'une poire.",
        correction: "Les deux situations contiennent 2 poires. En les retirant, la différence vient des 2 kiwis en trop : 700 − 500 = 200 g. Donc 1 kiwi pèse 200 : 2 = 100 g. Puis 2 poires pèsent 500 − 2 × 100 = 300 g, donc 1 poire pèse 300 : 2 = 150 g." })
    ],
    generer: () => genDeuxInconnues("g")
  },
  {
    titre: "Les paniers",
    mission: "Même méthode avec des prix : deux paniers ont chacun leur prix. Enlever le contenu d'un panier de l'autre, c'est aussi enlever son prix.",
    fixes: [
      () => ({ visuel: "panier", unite: "€", balances: [B({ cahier: 2, stylo: 1 }, 0, {}, 11), B({ cahier: 1, stylo: 1 }, 0, {}, 7)],
        inconnues: ["cahier", "stylo"], valeurs: { cahier: 4, stylo: 3 },
        enonce: "Au magasin, 2 cahiers et 1 stylo coûtent 11 €. 1 cahier et 1 stylo coûtent 7 €. Quel est le prix d'un cahier ? Et celui d'un stylo ?",
        correction: "Les deux paniers contiennent 1 cahier et 1 stylo. La différence est donc le cahier en trop : 11 − 7 = 4 € pour 1 cahier. Puis 1 stylo coûte 7 − 4 = 3 €." })
    ],
    generer: () => genDeuxInconnues("€")
  },
  {
    titre: "Pour aller plus loin",
    mission: "Ici, retirer un panier de l'autre ne suffit plus. Astuce : prends d'abord un panier 2 fois (tout est doublé : les objets et le prix). Ensuite, tu pourras lui retirer l'autre panier.",
    fixes: [
      () => ({ visuel: "panier", unite: "€", balances: [B({ regle: 1, compas: 2 }, 0, {}, 13), B({ regle: 2, compas: 3 }, 0, {}, 21)],
        inconnues: ["compas", "regle"], valeurs: { regle: 3, compas: 5 },
        enonce: "1 règle et 2 compas coûtent 13 €. 2 règles et 3 compas coûtent 21 €. Quel est le prix d'un compas ? Et celui d'une règle ?",
        correction: "Si 1 règle et 2 compas coûtent 13 €, alors 2 règles et 4 compas coûtent 2 × 13 = 26 €. Or 2 règles et 3 compas coûtent 21 € : la différence est 1 compas, donc 1 compas coûte 26 − 21 = 5 €. Enfin 1 règle coûte 13 − 2 × 5 = 3 €." }),
      () => ({ visuel: "panier", unite: "€", balances: [B({ menuE: 3, menuA: 1 }, 0, {}, 29), B({ menuE: 1, menuA: 2 }, 0, {}, 33)],
        inconnues: ["menuE", "menuA"], valeurs: { menuE: 5, menuA: 14 },
        enonce: "À la cantine, 3 menus enfant et 1 menu adulte coûtent 29 €. 1 menu enfant et 2 menus adultes coûtent 33 €. Quel est le prix d'un menu enfant ? Et d'un menu adulte ?",
        correction: "Si 3 menus enfant et 1 menu adulte coûtent 29 €, alors 6 menus enfant et 2 menus adultes coûtent 2 × 29 = 58 €. Or 1 menu enfant et 2 menus adultes coûtent 33 € : la différence est 5 menus enfant, soit 58 − 33 = 25 €. Donc 1 menu enfant coûte 25 : 5 = 5 €, et 1 menu adulte coûte 29 − 3 × 5 = 14 €." })
    ],
    generer: genDoubler
  },
  {
    titre: "Le défi",
    mission: "Plus aucun nombre : seulement des formes ! Enlève les mêmes formes des deux côtés. Quand tu sais ce que vaut une forme, remplace-la sur l'autre balance.",
    fixes: [
      () => ({ visuel: "balance", unite: null,
        balances: [B({ etoile: 3, rond: 1 }, 0, { etoile: 2, rond: 4 }, 0), B({ carre: 1, rond: 2 }, 0, { etoile: 1, rond: 3 }, 0)],
        inconnues: ["etoile", "carre"], valeurs: { etoile: 3, carre: 4 },
        enonce: "Les deux balances sont équilibrées. Combien de ronds vaut une étoile ? Et un carré ?",
        correction: "<strong>Balance du haut :</strong> on retire 2 étoiles et 1 rond de chaque côté. Il reste 1 étoile d'un côté et 3 ronds de l'autre : 1 étoile vaut 3 ronds. <strong>Balance du bas :</strong> on retire 2 ronds de chaque côté. Il reste 1 carré d'un côté, 1 étoile et 1 rond de l'autre. Donc 1 carré vaut 3 + 1 = 4 ronds." })
    ],
    generer: genDefi
  }
];

function genUneInconnue() {
  const X = choisir(Object.keys(MASSES)), v = pas(...MASSES[X]);
  const type = choisir(["k", "p", "kp", "kp"]);
  const p = choisir([100, 200, 250, 300, 500, 1000].filter(q => q !== v));
  const base = { visuel: "balance", unite: "g", inconnues: [X], valeurs: { [X]: v } };
  if (type === "k") {
    const k = alea(2, X === "pasteque" ? 3 : 5), W = k * v;
    return { ...base, balances: [B({ [X]: k }, 0, {}, W)],
      enonce: `Les deux plateaux sont équilibrés. Combien pèse ${minuscule(OBJ[X].art)} ?`,
      correction: `${nb(k, X)} pèsent ${N(W)} g, donc 1 ${OBJ[X].un} pèse ${N(W)} : ${k} = ${N(v)} g.` };
  }
  if (type === "p") {
    const W = v + p;
    return { ...base, balances: [B({ [X]: 1 }, p, {}, W)],
      enonce: `Les deux plateaux sont équilibrés. Combien pèse ${OBJ[X].le} ?`,
      correction: `${majuscule(OBJ[X].le)} et le poids pèsent ensemble ${N(W)} g, donc ${OBJ[X].le} pèse ${N(W)} − ${N(p)} = ${N(v)} g.` };
  }
  const k = alea(2, X === "pasteque" ? 2 : 4), W = k * v + p;
  return { ...base, balances: [B({ [X]: k }, p, {}, W)],
    enonce: `Les deux plateaux sont équilibrés. Les ${OBJ[X].des} sont identiques. Combien pèse ${minuscule(OBJ[X].art)} ?`,
    correction: `On enlève ${N(p)} g de chaque côté : ${nb(k, X)} pèsent ${N(W)} − ${N(p)} = ${N(k * v)} g. Donc 1 ${OBJ[X].un} pèse ${N(k * v)} : ${k} = ${N(v)} g.` };
}

/* Deux balances : A = a X + b Y et B = c X + b Y (a > c) : B est contenue dans A */
function genDeuxInconnues(unite) {
  let X, Y, x, y, lieu = "";
  if (unite === "g") {
    [X, Y] = melanger(Object.keys(MASSES).filter(f => f !== "pasteque")).slice(0, 2);
    do { x = pas(...MASSES[X]); y = pas(...MASSES[Y]); } while (x === y);
  } else {
    const paire = choisir(PAIRES_PRIX);
    [X, Y] = melanger([...paire.types]); lieu = paire.lieu;
    do { x = alea(...PRIX[X]); y = alea(...PRIX[Y]); } while (x === y);
  }
  const c = alea(1, 2), a = c + alea(1, 2), b = alea(1, 2);
  const A = { [X]: a, [Y]: b }, Bi = { [X]: c, [Y]: b };
  const W1 = a * x + b * y, W2 = c * x + b * y, D = W1 - W2;
  const ordre = Math.random() < 0.5 ? [0, 1] : [1, 0]; // position de A et de B
  const balances = [];
  balances[ordre[0]] = B(A, 0, {}, W1);
  balances[ordre[1]] = B(Bi, 0, {}, W2);
  const panier = unite === "€";
  const nom = i => panier ? `le panier ${"①②"[i]}` : `la balance ${"①②"[i]}`;
  const de = i => panier ? `du panier ${"①②"[i]}` : `de la balance ${"①②"[i]}`;
  const u = v => `${N(v)} ${unite}`;
  const v1 = panier ? "coûte" : "pèse", vn = panier ? "coûtent" : "pèsent";
  const ordreTypes = melanger([X, Y]);
  const s = { visuel: panier ? "panier" : "balance", unite, balances, inconnues: ordreTypes, valeurs: { [X]: x, [Y]: y } };
  if (panier) {
    s.enonce = `${lieu}, ${liste(balances[0].G.items)} coûtent ${u(balances[0].D.w)}. ${majuscule(liste(balances[1].G.items))} coûtent ${u(balances[1].D.w)}. Quel est le prix ${dUn(ordreTypes[0])} ? Et celui ${dUn(ordreTypes[1])} ?`;
  } else if (Math.random() < 0.35) {
    s.construire = true; s.types = [X, Y];
    s.enonce = `${majuscule(liste(balances[0].G.items))} pèsent ${u(balances[0].D.w)}. ${majuscule(liste(balances[1].G.items))} pèsent ${u(balances[1].D.w)}. Construis d'abord les deux balances qui représentent la situation, puis trouve la masse ${dUn(ordreTypes[0])} et celle ${dUn(ordreTypes[1])}.`;
  } else {
    s.enonce = `Les deux balances sont équilibrées. Combien pèse ${minuscule(OBJ[ordreTypes[0]].art)} ? Et ${minuscule(OBJ[ordreTypes[1]].art)} ?`;
  }
  const iB = ordre[1], iA = ordre[0];
  let t = `${majuscule(nom(iB))} contient ${liste(Bi)}, soit ${u(W2)}. En retirant cela ${de(iA)}, il reste ${nb(a - c, X)} : ${N(W1)} − ${N(W2)} = ${u(D)}. `;
  t += a - c > 1 ? `Donc 1 ${OBJ[X].un} ${v1} ${N(D)} : ${a - c} = ${u(x)}. ` : `Donc 1 ${OBJ[X].un} ${v1} ${u(x)}. `;
  const retire = c > 1 ? `${c} × ${N(x)}` : N(x);
  t += b > 1 ? `Puis ${nb(b, Y)} ${vn} ${N(W2)} − ${retire} = ${u(b * y)}, donc 1 ${OBJ[Y].un} ${v1} ${N(b * y)} : ${b} = ${u(y)}.`
             : `Puis 1 ${OBJ[Y].un} ${v1} ${N(W2)} − ${retire} = ${u(y)}.`;
  s.correction = t;
  return s;
}

/* Deux paniers : B = k × A − d Z, il faut d'abord prendre A k fois */
function genDoubler() {
  let essai = 0;
  while (true) {
    essai++;
    const paire = choisir(PAIRES_PRIX), [X, Y] = paire.types;
    const val = { [X]: alea(...PRIX[X]), [Y]: alea(...PRIX[Y]) };
    if (val[X] === val[Y]) continue;
    const A = { [X]: alea(1, 3), [Y]: alea(1, 3) };
    const k = A[X] + A[Y] <= 3 && Math.random() < 0.3 ? 3 : 2;
    const Z = choisir([X, Y]), O = Z === X ? Y : X;
    const kA = { [X]: k * A[X], [Y]: k * A[Y] };
    const d = alea(1, kA[Z] - 1);
    const Bi = { ...kA, [Z]: kA[Z] - d };
    if (kA[X] + kA[Y] > 10 && essai < 50) continue;
    if (Bi[X] <= A[X] && Bi[Y] <= A[Y]) continue; // B contenu dans A : pas besoin de doubler
    const prix = it => it[X] * val[X] + it[Y] * val[Y];
    const W1 = prix(A), W2 = prix(Bi), kW = k * W1;
    let t = `Si ${liste(A)} coûtent ${N(W1)} €, alors ${liste(kA)} coûtent ${k} × ${N(W1)} = ${N(kW)} €. Or ${liste(Bi)} coûtent ${N(W2)} € : la différence est ${nb(d, Z)}, soit ${N(kW)} − ${N(W2)} = ${N(d * val[Z])} €. `;
    t += d > 1 ? `Donc 1 ${OBJ[Z].un} coûte ${N(d * val[Z])} : ${d} = ${N(val[Z])} €. ` : `Donc 1 ${OBJ[Z].un} coûte ${N(val[Z])} €. `;
    const retire = A[Z] > 1 ? `${A[Z]} × ${N(val[Z])}` : N(val[Z]);
    t += A[O] > 1 ? `Enfin ${nb(A[O], O)} coûtent ${N(W1)} − ${retire} = ${N(A[O] * val[O])} €, donc 1 ${OBJ[O].un} coûte ${N(A[O] * val[O])} : ${A[O]} = ${N(val[O])} €.`
                  : `Enfin 1 ${OBJ[O].un} coûte ${N(W1)} − ${retire} = ${N(val[O])} €.`;
    return { visuel: "panier", unite: "€", balances: [B(A, 0, {}, W1), B(Bi, 0, {}, W2)], inconnues: [Z, O], valeurs: val,
      enonce: `${paire.lieu}, ${liste(A)} coûtent ${N(W1)} €. ${majuscule(liste(Bi))} coûtent ${N(W2)} €. Quel est le prix ${dUn(Z)} ? Et celui ${dUn(O)} ?`,
      correction: t };
  }
}

function genDefi() {
  const s = alea(2, 4), c = alea(1, 2), b = alea(0, 2), t = alea(1, 2), e = alea(0, 2);
  const haut = B({ etoile: c + 1, rond: b }, 0, { etoile: c, rond: b + s }, 0);
  const bas = B({ carre: 1, rond: e }, 0, { etoile: 1, rond: e + t }, 0);
  for (const bal of [haut, bas]) if (Math.random() < 0.5) [bal.G, bal.D] = [bal.D, bal.G];
  for (const bal of [haut, bas]) nettoyer(bal);
  const retire1 = b ? `${nb(c, "etoile")} et ${nb(b, "rond")}` : nb(c, "etoile");
  const corr = `<strong>Balance ① :</strong> on retire ${retire1} de chaque côté. Il reste 1 étoile d'un côté et ${nb(s, "rond")} de l'autre : 1 étoile vaut ${s} ronds. `
    + `<strong>Balance ② :</strong> ${e ? `on retire ${nb(e, "rond")} de chaque côté. Il reste` : "il y a"} 1 carré d'un côté, 1 étoile et ${nb(t, "rond")} de l'autre. Donc 1 carré vaut ${s} + ${t} = ${s + t} ronds.`;
  return { visuel: "balance", unite: null, balances: [haut, bas], inconnues: ["etoile", "carre"], valeurs: { etoile: s, carre: s + t },
    enonce: "Les deux balances sont équilibrées. Combien de ronds vaut une étoile ? Et un carré ?", correction: corr };
}

/* ---------- État ---------- */
const $ = id => document.getElementById(id);
const reussies = ETAPES.map(() => 0), vues = ETAPES.map(() => 0);
let etape = 0, numero = 0, S = null;

function nouvelleSituation() {
  const E = ETAPES[etape], i = vues[etape]++;
  const sit = i < E.fixes.length ? E.fixes[i]() : E.generer();
  numero = i + 1;
  demarrer(sit);
}
function demarrer(sit) {
  S = { sit, bal: [], carnet: [], hist: [], essais: 0, fini: false, mode: sit.construire ? "construire" : "resoudre" };
  S.bal = sit.construire ? sit.balances.map(() => B({}, 0, {}, 0)) : JSON.parse(JSON.stringify(sit.balances));
  $("numero").textContent = `Situation n° ${numero}`;
  $("consigne").textContent = sit.enonce;
  $("correction").hidden = true;
  $("correction").innerHTML = `<strong>Correction :</strong> ${sit.correction}`;
  coach("");
  afficherPhrases();
  afficher();
}

/* ---------- Noms ---------- */
const panier = () => S.sit.visuel === "panier";
const plusieurs = () => S.bal.length > 1;
const num = i => "①②③"[i];
const leB = i => panier() ? (plusieurs() ? `le panier ${num(i)}` : "le panier") : (plusieurs() ? `la balance ${num(i)}` : "la balance");
const duB = i => panier() ? (plusieurs() ? `du panier ${num(i)}` : "du panier") : (plusieurs() ? `de la balance ${num(i)}` : "de la balance");
const prefixe = i => plusieurs() ? `${majuscule(leB(i))} : ` : "";
const valeur = (w, cache = false) => (cache ? "?" : N(w)) + (S.sit.unite ? " " + S.sit.unite : "");

/* ---------- Dessin ---------- */
function dessinerObjet(X) {
  const o = OBJ[X], g = svg("g");
  if (o.dessin === "compas") {
    g.append(svg("path", { d: "M0,-38 L-10,-2 M0,-38 L10,-2", class: "compas-trait" }),
      svg("circle", { cx: 0, cy: -40, r: 4.5, class: "compas-tete" }),
      svg("path", { d: "M8,-8 L12,0 L13,-9 Z", class: "compas-mine" }));
  } else if (o.dessin === "menu") {
    g.append(svg("rect", { x: -23, y: -30, width: 46, height: 28, rx: 6, class: "menu " + o.classe }),
      svg("text", { x: 0, y: -21, class: "texte-menu" }, "menu"),
      svg("text", { x: 0, y: -8, class: "texte-menu" }, o.texte));
  } else {
    g.append(svg("text", { x: 0, y: -6, class: "emoji" }, o.e));
  }
  return g;
}
const largeur = X => OBJ[X].l || 36;

function dessinerPoids(w, cache) {
  const lab = valeur(w, cache), L = Math.max(54, 18 + 9.5 * lab.length);
  const g = svg("g", { class: cache ? "cache" : "" });
  if (panier()) {
    g.append(svg("path", { d: `M${-L / 2},-30 H${L / 2 - 12} L${L / 2},-15 L${L / 2 - 12},0 H${-L / 2} Z`, class: "etiq" }),
      svg("circle", { cx: L / 2 - 11, cy: -15, r: 3, class: "etiq-trou" }),
      svg("text", { x: -5, y: -9, class: "texte-etiq" }, lab));
  } else {
    g.append(svg("circle", { cx: 0, cy: -33, r: 5, fill: "none", stroke: "var(--poids)", "stroke-width": 3 }),
      svg("path", { d: `M${-L / 2 + 7},-30 L${L / 2 - 7},-30 L${L / 2},0 L${-L / 2},0 Z`, class: "poids" }),
      svg("text", { x: 0, y: -9, class: "texte-poids" }, lab));
  }
  return { g, L };
}

/* Place les objets d'un plateau en rangées (de bas en haut), centrées sur x = 0 */
function remplirPlateau(groupe, i, cote, p) {
  const elems = [];
  if (p.w > 0 || p.cache) elems.push({ type: "w", ...dessinerPoids(p.w, p.cache) });
  for (const X of types(p)) for (let k = 0; k < p.items[X]; k++) elems.push({ type: "o", X, g: dessinerObjet(X), L: largeur(X) });
  const rangees = [[]];
  let larg = 0;
  for (const e of elems) {
    if (larg + e.L > 204 && rangees[rangees.length - 1].length) { rangees.push([]); larg = 0; }
    rangees[rangees.length - 1].push(e); larg += e.L + 2;
  }
  rangees.forEach((r, j) => {
    const total = r.reduce((s, e) => s + e.L + 2, -2);
    let x = -total / 2;
    for (const e of r) {
      const conteneur = svg("g", { transform: `translate(${x + e.L / 2},${-j * 42})`, class: "objet", tabindex: 0, role: "button" });
      conteneur.append(svg("rect", { x: -e.L / 2, y: -40, width: e.L, height: 40, fill: "transparent" }), e.g);
      const agir = () => e.type === "w" ? clicPoids(i, cote) : clicObjet(i, cote, e.X);
      conteneur.setAttribute("aria-label", e.type === "w" ? `Enlever ${valeur(p.w, p.cache)} des deux côtés` : `Enlever 1 ${OBJ[e.X].un} des deux côtés`);
      if (S.mode === "resoudre") {
        conteneur.addEventListener("click", agir);
        conteneur.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); agir(); } });
      }
      groupe.append(conteneur);
      x += e.L + 2;
    }
  });
}

function decrirePlateau(p) {
  const t = [];
  if (types(p).length) t.push(liste(p.items));
  if (p.w > 0 || p.cache) t.push(valeur(p.w, p.cache));
  return t.join(" et ") || "rien";
}

function dessinerBalance(i) {
  const b = S.bal[i];
  const etiquette = `${majuscule(leB(i))} : à gauche ${decrirePlateau(b.G)}, à droite ${decrirePlateau(b.D)}.`;
  if (panier()) {
    const s = svg("svg", { viewBox: "0 0 560 220", class: "dessin", role: "img", "aria-label": etiquette });
    for (const [cote, x0, titre] of [["G", 14, "Panier"], ["D", 310, "Prix"]]) {
      s.append(svg("rect", { x: x0, y: 8, width: 236, height: 204, rx: 14, class: "boite" }),
        svg("text", { x: x0 + 118, y: 32, class: "boite-titre" }, titre));
      const g = svg("g", { transform: `translate(${x0 + 118},196)` });
      remplirPlateau(g, i, cote, b[cote]);
      s.append(g);
    }
    s.append(svg("text", { x: 280, y: 128, class: "egal" }, "="));
    return s;
  }
  const s = svg("svg", { viewBox: "0 0 560 250", class: "dessin", role: "img", "aria-label": etiquette });
  s.append(svg("path", { d: "M280 55 L252 236 L308 236 Z", class: "pied" }),
    svg("rect", { x: 205, y: 234, width: 150, height: 10, rx: 5, class: "pied" }));
  const mobile = svg("g", { class: "mobile" });
  mobile.append(svg("rect", { x: 97, y: 45, width: 366, height: 10, rx: 5, class: "barre-fleau" }),
    svg("circle", { cx: 280, cy: 50, r: 8, class: "pivot" }));
  for (const [cote, cx] of [["G", 105], ["D", 455]]) {
    mobile.append(svg("line", { x1: cx, y1: 50, x2: cx - 96, y2: 175, class: "fil" }),
      svg("line", { x1: cx, y1: 50, x2: cx + 96, y2: 175, class: "fil" }),
      svg("path", { d: `M${cx - 108},175 L${cx + 108},175 L${cx + 92},189 L${cx - 92},189 Z`, class: "plateau-fond" }));
    const g = svg("g", { transform: `translate(${cx},175)` });
    remplirPlateau(g, i, cote, b[cote]);
    mobile.append(g);
  }
  s.append(mobile);
  return s;
}

function secouer(i) {
  const bloc = $("scene").children[i];
  const cible = bloc && bloc.querySelector(panier() ? ".egal" : ".mobile");
  if (!cible) return;
  cible.classList.remove("secoue");
  void cible.getBoundingClientRect();
  cible.classList.add("secoue");
}

/* ---------- Affichage ---------- */
function afficher() {
  const scene = $("scene");
  scene.replaceChildren();
  S.bal.forEach((b, i) => {
    const bloc = el("div", { class: "bloc" });
    if (plusieurs()) bloc.append(el("div", { class: "bloc-tete" }, (panier() ? "Panier " : "Balance ") + num(i)));
    bloc.append(dessinerBalance(i));
    bloc.append(S.mode === "construire" ? outilsConstruction(i) : outilsBalance(i));
    scene.append(bloc);
  });
  const outils = $("outils");
  outils.replaceChildren(
    el("button", { class: "btn", type: "button", onclick: annuler, ...(S.hist.length ? {} : { disabled: "" }) }, "↶ Annuler"),
    el("button", { class: "btn", type: "button", onclick: () => demarrer(S.sit) }, "Recommencer"),
    el("button", { class: "btn", type: "button", onclick: coupDePouce }, "Coup de pouce"),
    el("button", { class: "btn" + (S.fini ? " principal" : ""), type: "button", onclick: nouvelleSituation }, "Situation suivante →"));
  afficherCarnet();
  afficherEtapes();
}

function bouton(texte, action, titre) {
  const b = el("button", { class: "btn", type: "button", onclick: action }, texte);
  if (titre) b.title = titre;
  return b;
}

function outilsBalance(i) {
  const barre = el("div", { class: "barre-outils" });
  barre.append(bouton("Partager", () => partager(i), "Partager chaque côté en parts égales"));
  if (plusieurs()) {
    const j = 1 - i;
    barre.append(bouton(`Retirer ${leB(j)}`, () => retirer(i, j), `Enlever de ${leB(i)} tout le contenu de ${leB(j)}`));
    if (etape === 3) { // « Pour aller plus loin » : on peut prendre un panier plusieurs fois
      barre.append(bouton("Prendre 2 fois", () => multiplier(i, 2), "Tout doubler des deux côtés"));
      barre.append(bouton("Prendre 3 fois", () => multiplier(i, 3), "Tout tripler des deux côtés"));
    }
  }
  for (const k of remplacements(i)) {
    const par = k.w !== undefined ? valeur(k.w) : nb(k.m, k.Y);
    const b = bouton("", () => remplacer(i, k));
    b.innerHTML = `Remplacer ${ICONE(k.X)} par ${par}`;
    barre.append(b);
  }
  return barre;
}

function outilsConstruction(i) {
  const zone = el("div", { class: "construire" });
  const gauche = el("div", { class: "cote" }, el("span", { class: "lib" }, "Plateau de gauche :"));
  for (const X of S.sit.types) {
    const p = S.bal[i].G;
    gauche.append(el("span", { class: "compteur" },
      el("button", { class: "btn", type: "button", "aria-label": `Enlever 1 ${OBJ[X].un}`, onclick: () => { if (p.items[X]) { p.items[X]--; nettoyer(S.bal[i]); afficher(); } } }, "−"),
      el("span", { class: "ico", "aria-hidden": "true" }, OBJ[X].e),
      el("button", { class: "btn", type: "button", "aria-label": `Ajouter 1 ${OBJ[X].un}`, onclick: () => { if (nbObjets(p) < 10) { p.items[X] = (p.items[X] || 0) + 1; afficher(); } } }, "+")));
  }
  const champ = el("input", { class: "case", inputmode: "numeric", "aria-label": "Masse sur le plateau de droite" });
  if (S.bal[i].D.w) champ.value = S.bal[i].D.w;
  champ.addEventListener("change", () => { const v = lireNombre(champ.value); S.bal[i].D.w = Number.isInteger(v) && v > 0 ? v : 0; afficher(); });
  const droite = el("div", { class: "cote" }, el("span", { class: "lib" }, "Plateau de droite :"), champ, el("span", { class: "unite" }, S.sit.unite));
  zone.append(gauche, droite);
  if (i === S.bal.length - 1) zone.append(el("div", { class: "cote" }, el("button", { class: "btn principal", type: "button", onclick: validerConstruction }, "Valider mes balances")));
  return zone;
}

/* ---------- Carnet ---------- */
const enAttente = () => S.carnet.some(c => c.calc && !c.fait);
function noter(texte, calcul) { S.carnet.push({ texte: majuscule(texte), ...(calcul || {}) }); }

function afficherCarnet() {
  const ol = $("carnet");
  ol.replaceChildren();
  if (!S.carnet.length) {
    ol.append(el("li", { class: "vide" }, S.mode === "construire" ? "Construis d'abord les balances." : "Rien pour l'instant : agis sur les balances."));
    return;
  }
  let premier = null;
  S.carnet.forEach(c => {
    const li = el("li", { class: c.calc && !c.fait ? "a-faire" : "" });
    li.append(el("span", { class: "action" }, c.texte));
    if (c.calc) {
      const ligne = el("span", { class: "calcul" }, `${c.calc} = `);
      if (c.fait) {
        ligne.append(el("strong", {}, N(c.attendu)), c.unite ? " " + c.unite : "");
      } else {
        const champ = el("input", { class: "case petit", inputmode: "numeric", "aria-label": `Résultat de ${c.calc}` });
        const ok = () => validerCalcul(c, champ);
        champ.addEventListener("keydown", e => { if (e.key === "Enter") ok(); });
        ligne.append(champ, c.unite ? " " + c.unite : "", el("button", { class: "btn petit", type: "button", onclick: ok }, "OK"));
        premier = premier || champ;
      }
      li.append(ligne);
    }
    ol.append(li);
  });
  ol.scrollTop = ol.scrollHeight;
  if (premier) premier.focus({ preventScroll: true });
}

function validerCalcul(c, champ) {
  const v = lireNombre(champ.value);
  if (isNaN(v)) { coach("Écris le résultat du calcul dans la case.", "attention"); return; }
  if (v !== c.attendu) {
    champ.classList.add("faux");
    coach(`Ce n'est pas ça : recalcule ${c.calc}.`, "attention");
    return;
  }
  c.fait = true;
  const p = S.bal[c.cible[0]][c.cible[1]];
  if (!S.carnet.some(d => d !== c && d.calc && !d.fait && d.cible[0] === c.cible[0] && d.cible[1] === c.cible[1])) p.cache = false;
  coach("Exact ! La balance est mise à jour.", "ok");
  afficher();
}

/* ---------- Actions sur les balances ---------- */
function sauver() { S.hist.push(JSON.stringify({ bal: S.bal, carnet: S.carnet })); }
function annuler() {
  if (!S.hist.length) return;
  const h = JSON.parse(S.hist.pop());
  S.bal = h.bal; S.carnet = h.carnet;
  coach("");
  afficher();
}
function bloque() {
  if (S.mode !== "resoudre") return true;
  if (enAttente()) { coach("Termine d'abord le calcul dans le carnet de calculs.", "attention"); afficherCarnet(); return true; }
  return false;
}
const nomCote = () => panier() ? "côté" : "plateau";

function clicObjet(i, cote, X) {
  if (bloque()) return;
  const b = S.bal[i], p = b[cote], q = b[autre(cote)];
  if (q.items[X] > 0) {
    sauver();
    p.items[X]--; q.items[X]--; nettoyer(b);
    noter(`${prefixe(i)}on enlève 1 ${OBJ[X].un} de chaque côté.`);
    coach(`Tu as enlevé 1 ${OBJ[X].un} de chaque côté : c'est toujours équilibré.`, "ok");
    afficher();
  } else {
    secouer(i);
    coach(panier()
      ? `Il n'y a pas de ${OBJ[X].un} de l'autre côté. Si on enlève ${minuscule(OBJ[X].art)} du panier sans changer le prix, le panier n'a plus ce prix-là !`
      : `Il n'y a pas de ${OBJ[X].un} sur l'autre plateau. Si tu l'enlèves d'un seul côté, la balance penche !`, "attention");
  }
}

function clicPoids(i, cote) {
  if (bloque()) return;
  const b = S.bal[i], p = b[cote], q = b[autre(cote)], w = p.w;
  if (q.w >= w) {
    sauver();
    const avant = q.w;
    p.w = 0; q.w -= w;
    if (q.w > 0) {
      q.cache = true;
      noter(`${prefixe(i)}on enlève ${valeur(w)} de chaque côté.`, { calc: `${N(avant)} − ${N(w)}`, attendu: q.w, unite: S.sit.unite, cible: [i, autre(cote)] });
      coach("Complète le calcul dans le carnet pour connaître ce qui reste.", "ok");
    } else {
      noter(`${prefixe(i)}on enlève ${valeur(w)} de chaque côté.`);
      coach(`Tu as enlevé ${valeur(w)} de chaque côté.`, "ok");
    }
    afficher();
  } else {
    secouer(i);
    coach(q.w === 0
      ? `Il n'y a pas ${panier() ? "d'argent" : "de poids"} de l'autre côté : on ne peut pas enlever ${valeur(w)} des deux côtés.`
      : `De l'autre côté, il n'y a que ${valeur(q.w)} : on ne peut pas y enlever ${valeur(w)}. Essaie plutôt avec le plus petit.`, "attention");
  }
}

/* Partage possible ? un côté : n objets identiques (et rien d'autre) ; l'autre : une valeur seule ou une seule sorte d'objets */
function infoPartage(b) {
  const possibles = [];
  for (const cote of ["G", "D"]) {
    const p = b[cote], q = b[autre(cote)];
    if (types(p).length !== 1 || p.w > 0) continue;
    const X = types(p)[0], n = p.items[X];
    if (types(q).length === 0 && q.w > 0) possibles.push({ cote, X, n, poids: q.w });
    else if (types(q).length === 1 && q.w === 0 && types(q)[0] !== X) possibles.push({ cote, X, n, Y: types(q)[0], m: q.items[types(q)[0]] });
  }
  // de préférence un partage qui tombe juste, puis un objet déjà seul
  return possibles.find(c => c.n > 1 && (c.poids !== undefined ? c.poids : c.m) % c.n === 0)
    || possibles.find(c => c.n === 1) || possibles[0] || null;
}

function partager(i) {
  if (bloque()) return;
  const b = S.bal[i], info = infoPartage(b);
  if (!info) {
    secouer(i);
    coach(`Pour partager, il ne doit rester qu'une seule sorte d'objets d'un côté, et rien d'autre. Enlève d'abord ce qui est en trop${plusieurs() ? ` sur ${leB(i)}` : ""}.`, "attention");
    return;
  }
  if (info.n === 1) { coach(`${OBJ[info.X].art} est déjà seul${OBJ[info.X].art.startsWith("Une") ? "e" : ""} de son côté : pas besoin de partager.`, "attention"); return; }
  const total = info.poids !== undefined ? info.poids : info.m;
  if (total % info.n !== 0) { coach(`${N(total)} ne se partage pas en ${info.n} parts entières : vérifie tes balances.`, "attention"); return; }
  sauver();
  const p = b[info.cote], q = b[autre(info.cote)];
  p.items = { [info.X]: 1 };
  const texte = `${prefixe(i)}on partage chaque côté en ${info.n} parts égales et on garde une part : il reste 1 ${OBJ[info.X].un}.`;
  if (info.poids !== undefined) {
    q.w = info.poids / info.n; q.cache = true;
    noter(texte, { calc: `${N(info.poids)} : ${info.n}`, attendu: q.w, unite: S.sit.unite, cible: [i, autre(info.cote)] });
  } else {
    q.items = { [info.Y]: info.m / info.n };
    noter(texte, { calc: `${info.m} : ${info.n}`, attendu: info.m / info.n, unite: OBJ[info.Y].des, cible: [i, autre(info.cote)] });
  }
  coach("Complète le calcul dans le carnet.", "ok");
  afficher();
}

function multiplier(i, k) {
  if (bloque()) return;
  const b = S.bal[i];
  if ((nbObjets(b.G) + nbObjets(b.D)) * k > 14) { coach("Cela ferait beaucoup trop d'objets sur la balance ! Essaie autre chose.", "attention"); return; }
  sauver();
  const calculs = [];
  for (const c of ["G", "D"]) {
    const p = b[c];
    for (const X of types(p)) p.items[X] *= k;
    if (p.w > 0) { const avant = p.w; p.w *= k; p.cache = true; calculs.push({ calc: `${k} × ${N(avant)}`, attendu: p.w, unite: S.sit.unite, cible: [i, c] }); }
  }
  const texte = `${prefixe(i)}on prend tout ${k} fois, des deux côtés : on a maintenant ${decrirePlateau(b.G)} d'un côté.`;
  if (!calculs.length) noter(texte);
  calculs.forEach((c, j) => noter(j === 0 ? texte : `${prefixe(i)}et de l'autre côté :`, c));
  coach(calculs.length ? "Tout est pris " + k + " fois, des deux côtés. Complète le calcul dans le carnet." : "Tout est pris " + k + " fois, des deux côtés.", "ok");
  afficher();
}

const memes = (a, b) => ["G", "D"].every(c => a[c].w === b[c].w
  && [...new Set([...types(a[c]), ...types(b[c])])].every(X => (a[c].items[X] || 0) === (b[c].items[X] || 0)));
function inclus(petit, grand) {
  if (vide(petit.G) && vide(petit.D)) return false;
  return ["G", "D"].every(c => grand[c].w >= petit[c].w && types(petit[c]).every(X => (grand[c].items[X] || 0) >= petit[c].items[X]));
}

function retirer(i, j) {
  if (bloque()) return;
  const A = S.bal[i], Bj = S.bal[j];
  if (memes(A, Bj)) { coach(`${majuscule(leB(i))} et ${leB(j)} sont identiques : il ne resterait rien !`, "attention"); return; }
  if (!inclus(Bj, A)) {
    secouer(i);
    let raison = "";
    for (const c of ["G", "D"]) {
      for (const X of types(Bj[c])) if ((A[c].items[X] || 0) < Bj[c].items[X]) { raison = `il y a ${nb(Bj[c].items[X], X)} dans ${leB(j)}, mais seulement ${A[c].items[X] || 0} dans ${leB(i)}`; break; }
      if (!raison && A[c].w < Bj[c].w) raison = `${leB(j)} vaut ${valeur(Bj[c].w)}, c'est plus que ${leB(i)}`;
      if (raison) break;
    }
    coach(`Impossible : ${raison}. On ne peut retirer ${leB(j)} que si ${leB(i)} contient tout ce qu'il y a dedans.`, "attention");
    return;
  }
  sauver();
  const calculs = [];
  for (const c of ["G", "D"]) {
    for (const X of types(Bj[c])) A[c].items[X] -= Bj[c].items[X];
    if (Bj[c].w > 0) {
      const avant = A[c].w;
      A[c].w -= Bj[c].w;
      if (A[c].w > 0) { A[c].cache = true; calculs.push({ calc: `${N(avant)} − ${N(Bj[c].w)}`, attendu: A[c].w, unite: S.sit.unite, cible: [i, c] }); }
    }
  }
  nettoyer(A);
  const texte = `On retire tout le contenu ${duB(j)} de chaque côté ${duB(i)}.`;
  if (!calculs.length) noter(texte);
  calculs.forEach((c, k) => noter(k === 0 ? texte : "Et de l'autre côté :", c));
  coach(calculs.length ? "Complète le calcul dans le carnet." : "C'est fait !", "ok");
  afficher();
}

/* Ce que l'on connaît : une balance avec 1 objet seul d'un côté, et une valeur (ou une seule sorte d'objets) de l'autre */
function connus() {
  const res = [];
  S.bal.forEach((b, i) => {
    for (const cote of ["G", "D"]) {
      const p = b[cote], q = b[autre(cote)];
      if (types(p).length !== 1 || p.w > 0 || p.items[types(p)[0]] !== 1) continue;
      const X = types(p)[0];
      if (types(q).length === 0 && q.w > 0 && !q.cache) res.push({ X, src: i, w: q.w });
      else if (types(q).length === 1 && q.w === 0 && types(q)[0] !== X) res.push({ X, src: i, Y: types(q)[0], m: q.items[types(q)[0]] });
    }
  });
  return res;
}
const remplacements = i => connus().filter(k => k.src !== i && ["G", "D"].some(c => S.bal[i][c].items[k.X] > 0));

function remplacer(i, k) {
  if (bloque()) return;
  sauver();
  const b = S.bal[i], par = k.w !== undefined ? valeur(k.w) : nb(k.m, k.Y);
  let aCalculer = false;
  for (const c of ["G", "D"]) {
    const p = b[c], n = p.items[k.X];
    if (!n) continue;
    delete p.items[k.X];
    const texte = `${prefixe(i)}on remplace ${n > 1 ? `chacun des ${nb(n, k.X)}` : `1 ${OBJ[k.X].un}`} par ${par}.`;
    if (k.w !== undefined) {
      const avant = p.w;
      p.w = avant + n * k.w;
      if (avant > 0 || n > 1) {
        p.cache = true; aCalculer = true;
        const calc = avant > 0 ? (n > 1 ? `${N(avant)} + ${n} × ${N(k.w)}` : `${N(avant)} + ${N(k.w)}`) : `${n} × ${N(k.w)}`;
        noter(texte, { calc, attendu: p.w, unite: S.sit.unite, cible: [i, c] });
      } else noter(texte);
    } else {
      p.items[k.Y] = (p.items[k.Y] || 0) + n * k.m;
      noter(texte);
    }
  }
  coach(aCalculer ? "Complète le calcul dans le carnet." : "Remplacement fait : la balance est toujours équilibrée.", "ok");
  afficher();
}

/* ---------- Construction des balances ---------- */
function validerConstruction() {
  const attendues = S.sit.balances, restantes = [...attendues.keys()];
  for (let i = 0; i < S.bal.length; i++) {
    const b = S.bal[i];
    if (vide(b.G) || !b.D.w) { coach(`${majuscule(leB(i))} n'est pas terminée : place les fruits à gauche et écris la masse à droite.`, "attention"); return; }
    const k = restantes.find(r => memes(b, attendues[r]));
    if (k === undefined) { secouer(i); coach(`${majuscule(leB(i))} ne correspond à aucune phrase de l'énoncé. Relis-le bien !`, "attention"); return; }
    restantes.splice(restantes.indexOf(k), 1);
  }
  S.mode = "resoudre";
  coach("Tes deux balances représentent bien la situation. À toi de trouver les masses !", "ok");
  afficher();
}

/* ---------- Coup de pouce ---------- */
function coupDePouce() {
  if (S.mode === "construire") { coach("Lis la première phrase : place à gauche les fruits dont on parle, et écris à droite leur masse totale. Même chose pour la deuxième balance.", "attention"); return; }
  if (enAttente()) { coach("Commence par terminer le calcul dans le carnet.", "attention"); return; }
  const sc = S.bal.map((b, i) => i);
  for (const i of sc) {
    const b = S.bal[i];
    const commun = types(b.G).find(X => b.D.items[X] > 0);
    if (commun) { coach(`Sur ${leB(i)}, il y a des ${OBJ[commun].des} des deux côtés : clique dessus pour en enlever de chaque côté.`); return; }
    if (b.G.w > 0 && b.D.w > 0) { coach(`Sur ${leB(i)}, il y a ${panier() ? "de l'argent" : "des poids"} des deux côtés : clique sur le plus petit pour l'enlever de chaque côté.`); return; }
  }
  for (const i of sc) {
    const info = infoPartage(S.bal[i]);
    if (info && info.n > 1) { coach(`Sur ${leB(i)}, il ne reste que des ${OBJ[info.X].des} d'un côté : utilise « Partager ».`); return; }
  }
  for (const i of sc) if (remplacements(i).length) { coach(`Tu connais la valeur ${dUn(remplacements(i)[0].X)} : sur ${leB(i)}, utilise le bouton « Remplacer ».`); return; }
  if (plusieurs()) {
    if (etape === 3 && !S.carnet.some(c => c.texte.includes("fois"))) {
      for (const i of sc) for (const k of [2, 3]) {
        const fois = JSON.parse(JSON.stringify(S.bal[i]));
        for (const c of ["G", "D"]) { for (const X of types(fois[c])) fois[c].items[X] *= k; fois[c].w *= k; }
        if (inclus(S.bal[1 - i], fois)) { coach(`Prends ${leB(i)} ${k} fois : tu pourras ensuite lui retirer ${leB(1 - i)}.`); return; }
      }
    }
    for (const i of sc) if (!memes(S.bal[i], S.bal[1 - i]) && inclus(S.bal[1 - i], S.bal[i])) { coach(`${majuscule(leB(i))} contient tout ce qu'il y a dans ${leB(1 - i)} : retire ${leB(1 - i)} !`); return; }
    for (const i of sc) for (const k of [2, 3]) {
      const fois = JSON.parse(JSON.stringify(S.bal[i]));
      for (const c of ["G", "D"]) { for (const X of types(fois[c])) fois[c].items[X] *= k; fois[c].w *= k; }
      if (inclus(S.bal[1 - i], fois)) { coach(`Aucune balance ne contient l'autre. Prends ${leB(i)} ${k} fois : tu pourras ensuite lui retirer ${leB(1 - i)}.`); return; }
    }
  }
  coach("Chaque objet cherché est seul d'un côté ? Alors tu as trouvé ! Complète les phrases réponses.");
}

/* ---------- Phrases réponses ---------- */
function afficherPhrases() {
  const zone = $("phrases");
  zone.replaceChildren(el("h3", {}, "Ta réponse"));
  const u = S.sit.unite;
  const verbe = u === "g" ? "pèse" : u === "€" ? "coûte" : "vaut";
  const champs = S.sit.inconnues.map(X => {
    const champ = el("input", { class: "case", inputmode: "numeric", "aria-label": `${OBJ[X].art} ${verbe}` });
    champ.addEventListener("keydown", e => { if (e.key === "Enter") verifier(); });
    champ.addEventListener("input", () => champ.classList.remove("juste", "faux"));
    zone.append(el("div", { class: "phrase" }, `${OBJ[X].art} ${verbe}`, champ, `${u || "ronds"}.`));
    return { X, champ };
  });
  const voir = el("button", { class: "btn", type: "button", hidden: "", onclick: () => { $("correction").hidden = false; } }, "Voir la correction");
  zone.append(el("div", { class: "actions" }, el("button", { class: "btn principal", type: "button", onclick: verifier }, "Vérifier"), voir));
  S.champs = champs; S.voir = voir;
}

function verifier() {
  let toutJuste = true, incomplet = false;
  for (const { X, champ } of S.champs) {
    const v = lireNombre(champ.value);
    champ.classList.remove("juste", "faux");
    if (isNaN(v)) { incomplet = true; toutJuste = false; continue; }
    const ok = v === S.sit.valeurs[X];
    champ.classList.add(ok ? "juste" : "faux");
    if (!ok) toutJuste = false;
  }
  if (incomplet && !S.champs.some(c => c.champ.classList.contains("faux"))) { coach("Complète toutes les phrases avec un nombre.", "attention"); return; }
  if (toutJuste) {
    if (!S.fini) { S.fini = true; reussies[etape]++; }
    coach(`${choisir(BRAVO)} Tu as trouvé ${S.sit.inconnues.length > 1 ? "les deux valeurs" : "la bonne valeur"}. Passe à la situation suivante !`, "ok");
    $("correction").hidden = false;
    afficher();
    return;
  }
  S.essais++;
  S.voir.hidden = false;
  coach("Une réponse au moins n'est pas juste (case rouge). Utilise les balances : chaque objet cherché doit se retrouver seul d'un côté.", "attention");
}

/* ---------- Étapes et coach ---------- */
function coach(html, type = "") {
  const c = $("coach");
  c.className = "coach " + type;
  c.innerHTML = html;
}

function afficherEtapes() {
  const nav = $("etapes");
  nav.replaceChildren(...ETAPES.map((E, i) => el("button", {
    class: "etape" + (i === etape ? " active" : "") + (reussies[i] > 0 && i !== etape ? " faite" : ""), type: "button",
    onclick: () => { if (i !== etape) { etape = i; afficherMission(); nouvelleSituation(); } }
  }, el("span", { class: "num" }, String(i + 1)), E.titre)));
  $("reussies").textContent = reussies[etape];
}
function afficherMission() {
  $("titre-etape").textContent = `Étape ${etape + 1} — ${ETAPES[etape].titre}`;
  $("texte-mission").textContent = ETAPES[etape].mission;
}

/* ---------- Lancement ---------- */
if (window.self !== window.top) document.body.classList.add("integre");
piedDePage();
afficherMission();
nouvelleSituation();
