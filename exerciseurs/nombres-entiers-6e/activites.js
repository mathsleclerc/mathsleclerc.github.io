/* =====================================================================
   EXERCISEUR « LES NOMBRES ENTIERS » — 6e, chapitre 1

   Les activités sont regroupées comme les cinq feuilles d'exercices.
   Chaque activité a un identifiant (utilisé dans l'adresse :
   …/nombres-entiers-6e/#chiffre-ou-nombre), un titre, une description
   et une fonction generer() qui fabrique une question au hasard.
   ===================================================================== */

const F1 = "Feuille 1 — Lire, écrire et décomposer";
const F2 = "Feuille 2 — Comparer, ranger, intercaler";
const F3 = "Feuille 3 — La demi-droite graduée";
const F4 = "Feuille 4 — Résoudre des problèmes";
const F5 = "Feuille 5 — La division euclidienne";

const nb = x => ecrireNombre(x);
const cap = t => t[0].toUpperCase() + t.slice(1);
const pluriel = (n, mot) => nb(n) + " " + mot + (n > 1 ? "s" : "");
const inf = "&lt;", sup = "&gt;";
const symbole = s => s === "<" ? inf : s === ">" ? sup : "=";

/* Rangs, de droite à gauche, avec le nom employé dans le cours. */
const RANGS = ["unités", "dizaines", "centaines", "unités de mille", "dizaines de mille", "centaines de mille",
  "unités de millions", "dizaines de millions", "centaines de millions",
  "unités de milliards", "dizaines de milliards", "centaines de milliards"];
const PUISSANCES = ["1", "10", "100", "1 000", "10 000", "100 000", "1 000 000", "10 000 000", "100 000 000",
  "1 000 000 000", "10 000 000 000", "100 000 000 000"];
const chiffreDe = (n, r) => Math.floor(n / 10 ** r) % 10;
const nbChiffres = n => String(n).length;

/* Un nombre au hasard de k chiffres, avec des zéros assez souvent (c'est là que sont les pièges). */
function nombreAuHasard(k, zeros = 0.3) {
  let s = String(alea(1, 9));
  for (let i = 1; i < k; i++) s += Math.random() < zeros ? "0" : String(alea(0, 9));
  return Number(s);
}

/* ---------- Écriture en lettres (règle du cours : traits d'union partout,
   sauf autour de million et milliard, qui sont des noms) ---------- */
const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
  "onze", "douze", "treize", "quatorze", "quinze", "seize"];
const DIZAINES = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante"];

function moinsDeCent(n) {
  if (n <= 16) return UNITES[n];
  if (n < 20) return "dix-" + UNITES[n - 10];
  if (n < 70) {
    const d = Math.floor(n / 10), u = n % 10;
    return DIZAINES[d] + (u === 0 ? "" : u === 1 ? "-et-un" : "-" + UNITES[u]);
  }
  if (n < 80) return "soixante-" + (n === 71 ? "et-onze" : moinsDeCent(n - 60));
  if (n === 80) return "quatre-vingts";
  return "quatre-vingt-" + moinsDeCent(n - 80);
}
/* « finale » : le groupe termine le nombre ou précède million/milliard (vingt et cent prennent alors un s). */
function moinsDeMille(n, finale) {
  const c = Math.floor(n / 100), r = n % 100;
  let t;
  if (c === 0) t = moinsDeCent(r);
  else t = (c === 1 ? "cent" : UNITES[c] + "-cent" + (r === 0 && finale ? "s" : "")) + (r ? "-" + moinsDeCent(r) : "");
  if (!finale) t = t.replace(/quatre-vingts$/, "quatre-vingt");
  return t;
}
function enLettres(n) {
  if (n === 0) return "zéro";
  const mld = Math.floor(n / 1e9), mio = Math.floor(n / 1e6) % 1000, mil = Math.floor(n / 1000) % 1000, u = n % 1000;
  const parties = [];
  if (mld) parties.push(moinsDeMille(mld, true) + " milliard" + (mld > 1 ? "s" : ""));
  if (mio) parties.push(moinsDeMille(mio, true) + " million" + (mio > 1 ? "s" : ""));
  let fin = "";
  if (mil) fin = mil === 1 ? "mille" : moinsDeMille(mil, false) + "-mille";
  if (u) fin += (fin ? "-" : "") + moinsDeMille(u, true);
  if (fin) parties.push(fin);
  return parties.join(" ");
}

/* Des nombres qui font travailler les règles : 80, 300, 21, 71, mille, millions… */
function nombrePourLettres() {
  const groupe = () => choisir([0, 0, 1, 7, 20, 21, 71, 80, 81, 90, 100, 200, 300, 380, 480, 604, 700, 999, alea(1, 999), alea(1, 999)]);
  let n;
  do {
    const k = choisir([2, 2, 3, 3, 4]); // nombre de classes
    n = 0;
    n = k === 4 ? alea(1, 99) : groupe(); // au plus 99 milliards
    for (let i = 1; i < k; i++) n = n * 1000 + groupe();
  } while (n < 1000 || n > 99e9);
  return n;
}

function ecrituresFausses(n) {
  const juste = enLettres(n);
  const essais = [
    t => t.replace(/mille(?!s)/, "milles"),
    t => t.replace(/quatre-vingts(?![a-z])/, "quatre-vingt"),
    t => t.replace(/quatre-vingt-mille/, "quatre-vingts-mille"),
    t => t.replace(/cents(?![a-z])/, "cent"),
    t => t.replace(/cent-(?!s)/, "cents-"),
    t => t.replace(/ (millions?|milliards?)/, "-$1"),
    t => t.replace(/(millions?|milliards?) /, "$1-"),
    t => t.replace(/millions/, "million"),
    t => t.replace(/milliards/, "milliard"),
    t => t.replace(/-et-un/, "-un"),
    t => t.replace(/-et-onze/, "-onze")
  ];
  const fausses = new Set();
  for (const f of melanger(essais)) {
    const t = f(juste);
    if (t !== juste) fausses.add(t);
  }
  // Erreurs sur la valeur : un chiffre déplacé ou changé
  let garde = 0;
  while (fausses.size < 3 && garde++ < 50) {
    const s = String(n).split("");
    const i = alea(0, s.length - 1), j = alea(0, s.length - 1);
    [s[i], s[j]] = [s[j], s[i]];
    if (s[0] === "0") continue;
    const m = Number(s.join(""));
    if (m !== n) fausses.add(enLettres(m));
  }
  return melanger([...fausses]).slice(0, 3);
}

/* ---------- Tableau de numération ---------- */
function tableauNumeration(n, { cliquable = false } = {}) {
  const k = Math.max(2, Math.ceil(nbChiffres(n) / 3));
  const classes = ["Unités", "Milliers", "Millions", "Milliards"].slice(0, k).reverse();
  const table = el("table", { class: "numeration" });
  table.append(el("tr", {}, ...classes.map(c => el("th", { colspan: "3" }, c))));
  table.append(el("tr", {}, ...classes.flatMap(() => ["C", "D", "U"].map(x => el("th", { class: "rang" }, x)))));
  const ligne = el("tr");
  const boutons = [];
  for (let r = 3 * k - 1; r >= 0; r--) {
    const cellule = el("td", { class: r % 3 === 0 && r > 0 ? "fin-classe" : "" });
    if (r < nbChiffres(n)) {
      const c = String(chiffreDe(n, r));
      if (cliquable) {
        const b = el("button", { type: "button", class: "chiffre", "data-rang": String(r), "aria-label": "Chiffre " + c }, c);
        boutons.push(b);
        cellule.append(b);
      } else cellule.append(c);
    }
    ligne.append(cellule);
  }
  table.append(ligne);
  return { table, boutons };
}

/* ---------- Demi-droite graduée ----------
   n intervalles ; la graduation k vaut debut + k × pas ; « etiquettes » : graduations dont on écrit la valeur. */
function demiDroite({ n, debut, pas, etiquettes, point = null, lettre = "A", principales = 0, clic = false, surligne = null }) {
  const x0 = 30, L = 420, y = 48, e = L / n, W = x0 + L + 34;
  const X = k => x0 + k * e;
  const s = svg("svg", { viewBox: `0 -30 ${W} 122`, width: W, height: 122, class: "droite" + (clic ? " droite-clic" : "") });
  s.append(svg("line", { x1: x0 - (debut ? 14 : 0), y1: y, x2: W - 10, y2: y, class: "axe" }));
  s.append(svg("path", { d: `M${W - 6},${y} l-11,-5.5 v11 z`, class: "fleche" }));
  for (let k = 0; k <= n; k++) {
    const grand = principales ? k % principales === 0 : k === 0 && !debut;
    s.append(svg("line", { x1: X(k), y1: y - (grand ? 11 : 7), x2: X(k), y2: y + (grand ? 11 : 7), class: grand ? "grad maj" : "grad" }));
  }
  // Une graduation repassée en orange (de k à k + 1)
  if (surligne != null) s.append(svg("line", { x1: X(surligne), y1: y, x2: X(surligne + 1), y2: y, class: "grad-surlignee" }));
  // Étiquettes : si deux nombres se chevauchent, le second passe au-dessus de l'axe, avec une flèche
  let finPrecedente = -Infinity;
  for (const k of [...etiquettes].sort((a, b) => a - b)) {
    const t = nb(debut + k * pas), longue = t.length > 7;
    const demiLargeur = t.length * (longue ? 3.6 : 4.6);
    const dessus = X(k) - demiLargeur < finPrecedente + 6;
    if (dessus) {
      s.append(svg("text", { x: X(k), y: y - 34, class: "etiq" + (longue ? " longue" : "") }, t),
        svg("line", { x1: X(k), y1: y - 29, x2: X(k), y2: y - 14, class: "etiq-fleche" }),
        svg("path", { d: `M${X(k) - 4},${y - 18} L${X(k)},${y - 12} L${X(k) + 4},${y - 18}`, class: "etiq-fleche" }));
    } else {
      s.append(svg("text", { x: X(k), y: y + 32, class: "etiq" + (longue ? " longue" : "") }, t));
      finPrecedente = X(k) + demiLargeur;
    }
  }
  const res = { svg: s, position: null, actif: true };
  res.marquer = (k, classe, texte) => {
    const g = svg("g", { class: classe },
      svg("line", { x1: X(k) - 7, y1: y - 7, x2: X(k) + 7, y2: y + 7 }),
      svg("line", { x1: X(k) - 7, y1: y + 7, x2: X(k) + 7, y2: y - 7 }),
      svg("text", { x: X(k), y: y - 16 }, texte));
    s.append(g);
    return g;
  };
  if (point != null) res.marquer(point, "pt", lettre);
  if (clic) {
    let g = null;
    const placer = k => {
      k = Math.max(0, Math.min(n, k));
      res.position = k;
      g?.remove();
      g = res.marquer(k, "pt", lettre);
    };
    s.setAttribute("tabindex", "0");
    s.setAttribute("aria-label", "Demi-droite graduée : clique pour placer le point, ou utilise les flèches du clavier.");
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
  return res;
}

/* Une graduation au hasard, avec des valeurs comme celles des fiches. */
function graduationAuHasard() {
  const type = choisir(["zero", "zero", "decale", "grand", "principales"]);
  if (type === "grand") {
    const pas = choisir([100000000, 1000000, 10000]);
    return { type, n: 10, pas, debut: alea(10, 99) * 10 * pas, principales: 0 };
  }
  if (type === "principales") {
    const pas = choisir([10, 50, 100, 1000]);
    return { type, n: 20, pas, debut: alea(1, 9) * 10 * pas, principales: 10 };
  }
  const pas = choisir([1, 2, 5, 10, 20, 25, 50, 100, 200, 500]);
  return { type, n: 10, pas, debut: type === "zero" ? 0 : alea(3, 40) * pas, principales: 0 };
}

/* ---------- Division posée, étape par étape ----------
   1. choisir le premier dividende partiel (clic sur les chiffres) ;
   2. à chaque étape : chiffre du quotient, produit, reste ; on abaisse le chiffre suivant. */
function divisionPosee(a, b) {
  const A = String(a), L = A.length;
  const gauche = el("div", { class: "pot-gauche" });
  gauche.style.gridTemplateColumns = `repeat(${L + 2}, 1.4em)`;
  const quotient = el("div", { class: "pot-quotient" });
  const potence = el("div", { class: "potence" }, gauche,
    el("div", { class: "pot-droite" }, el("div", { class: "pot-diviseur" }, String(b)), quotient));
  const message = el("p", { class: "pot-message" });
  const ok = el("button", { type: "button", class: "btn petit-btn" }, "OK");
  const aide = el("button", { type: "button", class: "btn discret petit-btn" }, "Montre-moi cette étape");
  const noeud = el("div", { class: "pot-bloc" }, potence, el("div", { class: "pot-controle" }, message, ok, aide));
  const place = (texte, col, ligne, classe = "") => {
    const c = el("span", { class: "pot-case " + classe }, texte);
    c.style.gridColumn = String(col); c.style.gridRow = String(ligne);
    gauche.append(c);
    return c;
  };
  // Écrit un nombre chiffre par chiffre, son dernier chiffre dans la colonne « fin »
  const ecrireNombreEn = (n, fin, ligne, classe = "") => [...String(n)].map((c, i, t) => place(c, fin - t.length + 1 + i, ligne, classe));
  const champ = (fin, ligne, largeur) => {
    const i = el("input", { class: "case pot-champ", inputmode: "numeric", autocomplete: "off", "aria-label": "Nombre" });
    i.style.gridColumn = `${fin - largeur + 1} / span ${largeur}`; i.style.gridRow = String(ligne);
    gauche.append(i);
    i.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); ok.click(); } });
    return i;
  };
  const dire = (t, type = "") => { message.innerHTML = t; message.className = "pot-message " + type; };

  // colonne du chiffre i du dividende : i + 2 (la colonne 1 sert au signe −)
  const chiffres = [...A].map((c, i) => {
    const bt = el("button", { type: "button", class: "pot-chiffre" }, c);
    bt.style.gridColumn = String(i + 2); bt.style.gridRow = "1";
    gauche.append(bt);
    return bt;
  });
  let etat = "choisir", e = 0, P = 0, ligne = 1, k = 0, qTexte = "", reste = 0, actif = true, saisie = null, cases = [];
  let e0 = 0;
  while (Number(A.slice(0, e0 + 1)) < b) e0++;

  const choisirPartiel = i => {
    if (!actif || etat !== "choisir") return;
    const x = Number(A.slice(0, i + 1));
    if (i < e0) { dire(`${nb(x)} &lt; ${b} : on ne peut pas mettre ${b} dans ${nb(x)}. Prends un chiffre de plus.`, "attention"); return; }
    if (i > e0) { dire(`On peut déjà mettre ${b} dans ${nb(Number(A.slice(0, e0 + 1)))} : prends moins de chiffres.`, "attention"); return; }
    chiffres.forEach((c, j) => { c.disabled = true; c.classList.toggle("partiel", j <= e0); });
    e = e0; P = x;
    const n = L - e0;
    cases = [...Array(n)].map(() => el("span", { class: "pot-q" }));
    quotient.replaceChildren(...cases);
    dire(`Premier dividende partiel : <strong>${nb(P)}</strong>. Le quotient aura ${n} chiffre${n > 1 ? "s" : ""}.`, "bien");
    etat = "attente";
    setTimeout(() => { if (etat === "attente") etapeChiffre(); }, 700);
  };
  chiffres.forEach((c, i) => c.addEventListener("click", () => choisirPartiel(i)));

  const etapeChiffre = () => {
    etat = "chiffre";
    saisie = el("input", { class: "case pot-champ q", inputmode: "numeric", autocomplete: "off", maxlength: "1", "aria-label": "Chiffre du quotient" });
    saisie.addEventListener("keydown", ev => { if (ev.key === "Enter") { ev.preventDefault(); ev.stopPropagation(); ok.click(); } });
    cases[k].replaceChildren(saisie);
    saisie.focus({ preventScroll: true });
    dire(`Dans <strong>${nb(P)}</strong>, combien de fois ${b} ? Écris le chiffre du quotient.`);
  };
  const etapeProduit = () => {
    etat = "produit";
    const larg = String(P).length;
    place("−", e + 2 - larg, ligne + 1, "signe");
    saisie = champ(e + 2, ligne + 1, larg);
    saisie.focus({ preventScroll: true });
    dire(`Calcule le produit : ${qTexte.at(-1)} × ${b}.`);
  };
  const etapeReste = () => {
    etat = "reste";
    saisie = champ(e + 2, ligne + 2, String(P).length);
    saisie.focus({ preventScroll: true });
    dire(`Soustrais : ${nb(P)} − ${nb(Number(qTexte.at(-1)) * b)}.`);
  };

  const valider = () => {
    if (!actif || !saisie) return;
    const x = lireEntier(saisie.value);
    if (isNaN(x)) { dire("Écris un nombre entier.", "attention"); return; }
    const q = Math.floor(P / b);
    if (etat === "chiffre") {
      if (x > 9 || x * b > P) { dire(`${x} × ${b} = ${nb(x * b)} : c'est plus que ${nb(P)} ! Essaie un chiffre plus petit.`, "attention"); return; }
      if ((x + 1) * b <= P) { dire(`${x + 1} × ${b} = ${nb((x + 1) * b)} : c'est encore plus petit que ${nb(P)}. Tu peux mettre plus !`, "attention"); return; }
      qTexte += String(x);
      cases[k].replaceChildren(String(x));
      etapeProduit();
    } else if (etat === "produit") {
      if (x !== q * b) { dire(`Vérifie ton calcul : ${q} × ${b}.`, "attention"); return; }
      saisie.remove();
      ecrireNombreEn(q * b, e + 2, ligne + 1, "souligne");
      etapeReste();
    } else if (etat === "reste") {
      if (x !== P - q * b) { dire(`Vérifie ta soustraction : ${nb(P)} − ${nb(q * b)}.`, "attention"); return; }
      saisie.remove();
      reste = x;
      ecrireNombreEn(reste, e + 2, ligne + 2);
      if (e < L - 1) {
        // on abaisse le chiffre suivant
        e++; ligne += 2; k++;
        place(A[e], e + 2, ligne, "abaisse");
        chiffres[e].classList.add("abaisse-source");
        P = reste * 10 + Number(A[e]);
        dire(`Le reste ${reste} est plus petit que ${b}. On abaisse le chiffre ${A[e]} : on obtient ${nb(P)}.`, "bien");
        saisie = null;
        etat = "attente";
        setTimeout(() => { if (etat === "attente") etapeChiffre(); }, 900);
      } else {
        etat = "fini"; saisie = null;
        ok.remove(); aide.remove();
        dire(`Terminé ! Le quotient est <strong>${nb(Number(qTexte))}</strong> et le reste est <strong>${reste}</strong> (${reste} &lt; ${b}). Complète l'égalité, puis valide.`, "bien");
      }
    }
  };
  ok.addEventListener("click", valider);
  // « Montre-moi » : fait l'étape en cours à la place de l'élève
  aide.addEventListener("click", () => {
    if (!actif) return;
    if (etat === "choisir") { choisirPartiel(e0); return; }
    if (!saisie) return;
    const q = Math.floor(P / b);
    saisie.value = etat === "chiffre" ? q : etat === "produit" ? q * b : P - q * b;
    valider();
  });
  dire(`Clique sur le dernier chiffre du <strong>premier dividende partiel</strong> : le plus petit nombre formé par les premiers chiffres de ${nb(a)} dans lequel on peut mettre ${b}.`);
  return {
    noeud,
    fini: () => etat === "fini",
    bloquer: () => { actif = false; ok.disabled = true; chiffres.forEach(c => { c.disabled = true; }); },
    /* Pour la correction : termine la division automatiquement */
    terminer() {
      actif = true;
      if (etat === "choisir") {
        chiffres.forEach((c, j) => { c.disabled = true; c.classList.toggle("partiel", j <= e0); });
        e = e0; P = Number(A.slice(0, e0 + 1));
        cases = [...Array(L - e0)].map(() => el("span", { class: "pot-q" }));
        quotient.replaceChildren(...cases);
        etat = "attente";
      }
      let tours = 0;
      while (etat !== "fini" && tours++ < 60) {
        if (etat === "attente") etapeChiffre();
        const q = Math.floor(P / b);
        saisie.value = etat === "chiffre" ? q : etat === "produit" ? q * b : P - q * b;
        valider();
      }
      actif = false;
    }
  };
}

/* ---------- Problèmes à plusieurs questions ----------
   etapes : [{ q, r, unite, calcul, piege? }] — piege(valeur) renvoie un message si l'erreur est classique. */
function probleme(enonce, etapes, conclusion = "") {
  return {
    consigne: enonce,
    classeLigne: "etapes",
    ligne: etapes.map((e, k) => `<div class="etape-pb"><p>${etapes.length > 1 ? (k + 1) + ". " : ""}${e.q}</p><p class="rep">[n] ${e.unite || ""}</p></div>`).join(""),
    verifier(v) {
      const x = v.map(lireNombre);
      if (x.some(isNaN)) return { etat: "incomplet", message: "Réponds à chaque question par un nombre." };
      const fausses = etapes.map((e, k) => k).filter(k => x[k] !== etapes[k].r);
      if (!fausses.length) return { etat: "juste" };
      const messages = fausses.map(k => etapes[k].piege?.(x[k])).filter(Boolean);
      return { etat: "faux", message: (etapes.length > 1 ? `À revoir : question ${fausses.map(k => k + 1).join(" et ")}. ` : "") + messages.join(" ") };
    },
    indice: "Écris chaque calcul et demande-toi ce que représente son résultat.",
    correction: etapes.map((e, k) => `<br>${etapes.length > 1 ? (k + 1) + ". " : ""}${e.calcul}`).join("") + (conclusion ? `<br>${conclusion}` : "")
  };
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "chiffre-ou-nombre",
    titre: "Chiffre ou nombre de… ?",
    description: "Ne pas confondre le chiffre des centaines et le nombre de centaines.",
    generer() {
      const n = nombreAuHasard(alea(5, 11));
      const r = alea(1, nbChiffres(n) - 2);
      const chiffre = chiffreDe(n, r), nombre = Math.floor(n / 10 ** r);
      const veutChiffre = Math.random() < 0.5;
      const attendu = veutChiffre ? chiffre : nombre;
      const explication = `Dans ${nb(n)}, le <strong>chiffre</strong> des ${RANGS[r]} est ${chiffre} (un seul chiffre, lu dans le tableau) ; le <strong>nombre</strong> de ${RANGS[r]} est ${nb(nombre)} (tout ce qui est écrit à gauche, ${RANGS[r]} comprises).`;
      return {
        consigne: `Dans le nombre <strong>${nb(n)}</strong>, quel est le ${veutChiffre ? "chiffre des" : "nombre de"} ${RANGS[r]} ?`,
        ligne: "[n]",
        verifier(v) {
          const res = verifierNombre(v[0], attendu);
          const x = lireNombre(v[0]);
          if (res.etat === "faux" && x === (veutChiffre ? nombre : chiffre)) {
            res.message = veutChiffre
              ? "Tu as donné le nombre de " + RANGS[r] + " : on demande le chiffre, c'est-à-dire un seul chiffre."
              : "Tu as donné le chiffre des " + RANGS[r] + " : on demande le nombre, c'est-à-dire tout ce qui est écrit à gauche, " + RANGS[r] + " comprises.";
          }
          return res;
        },
        indice: "Le chiffre des centaines est un seul chiffre ; le nombre de centaines, c'est tout ce qui est écrit à gauche, centaines comprises.",
        correction: explication
      };
    }
  },

  {
    groupe: F1,
    id: "tableau-numeration",
    titre: "Le tableau de numération",
    description: "Trouver le chiffre d'un rang dans le tableau.",
    generer() {
      const n = nombreAuHasard(alea(6, 11), 0.2);
      const r = alea(0, nbChiffres(n) - 1);
      const { table, boutons } = tableauNumeration(n, { cliquable: true });
      let choisi = null, actif = true;
      for (const b of boutons) {
        b.addEventListener("click", () => {
          if (!actif) return;
          choisi = Number(b.dataset.rang);
          for (const c of boutons) c.classList.toggle("choisi", c === b);
        });
      }
      return {
        consigne: `Voici le nombre <strong>${nb(n)}</strong> dans le tableau de numération. Clique sur le chiffre des <strong>${RANGS[r]}</strong>, puis valide.`,
        figure: table,
        verifier() {
          if (choisi == null) return { etat: "incomplet", message: "Clique sur un chiffre du tableau." };
          if (choisi === r) return { etat: "juste" };
          return { etat: "faux", message: `Tu as cliqué sur le chiffre des ${RANGS[choisi]}.` };
        },
        indice: "Repère d'abord la bonne classe (unités, milliers, millions, milliards), puis la colonne C, D ou U.",
        correction: `Le chiffre des ${RANGS[r]} est ${chiffreDe(n, r)} : il est entouré en vert dans le tableau.`,
        surCorrection() { boutons.find(b => Number(b.dataset.rang) === r).classList.add("bonne"); },
        bloquer() { actif = false; }
      };
    }
  },

  {
    groupe: F1,
    id: "ecrire-en-chiffres",
    titre: "Écrire en chiffres",
    description: "Passer de l'écriture en lettres à l'écriture en chiffres.",
    generer() {
      const n = nombrePourLettres();
      return {
        consigne: `Écris ce nombre en chiffres :<br><em>« ${cap(enLettres(n))} »</em>`,
        ligne: "[n]",
        verifier: v => verifierNombre(v[0], n),
        indice: "Découpe l'écriture autour des mots milliards, millions et mille, puis écris chaque classe avec trois chiffres (sans oublier les zéros).",
        correction: `On écrit ${nb(n)}. Dans le tableau, chaque classe a trois chiffres : n'oublie pas les zéros.`
      };
    }
  },

  {
    groupe: F1,
    id: "ecrire-en-lettres",
    titre: "Écrire en lettres",
    description: "Choisir la bonne écriture : traits d'union, « vingts », « cents », « mille »…",
    generer() {
      const n = nombrePourLettres();
      const juste = enLettres(n);
      const options = melanger([juste, ...ecrituresFausses(n)]);
      return {
        consigne: `Quelle est l'écriture en lettres de <strong>${nb(n)}</strong> ?`,
        choix: options,
        verifier: (v, c) => ({ etat: c === juste ? "juste" : "faux" }),
        indice: "Traits d'union partout, sauf autour de million et milliard. Mille est invariable. Vingt et cent prennent un s seulement s'ils sont multipliés et non suivis d'un autre nombre.",
        correction: `${nb(n)} s'écrit : <em>${juste}</em>.<br>Rappels : traits d'union partout sauf autour de million et milliard ; mille est invariable ; million et milliard prennent un s au pluriel ; vingt et cent prennent un s lorsqu'ils sont multipliés et non suivis d'un autre nombre.`
      };
    }
  },

  {
    groupe: F1,
    id: "decompositions",
    titre: "Décompositions",
    description: "Décomposition additive, canonique, et retrouver un nombre.",
    generer() {
      const n = nombreAuHasard(alea(4, 6), 0.3);
      const rangs = [...Array(nbChiffres(n)).keys()].reverse().filter(r => chiffreDe(n, r));
      const cas = alea(0, 3);
      if (cas === 0) {
        // Retrouver le nombre à partir de la décomposition canonique
        const ecriture = rangs.map(r => r === 0 ? String(chiffreDe(n, 0)) : `${chiffreDe(n, r)} × ${PUISSANCES[r]}`).join(" + ");
        return {
          consigne: "Retrouve le nombre.",
          ligne: `${ecriture} = [n]`,
          verifier: v => verifierNombre(v[0], n),
          indice: "Place chaque chiffre dans le tableau de numération, au bon rang. Attention aux rangs qui manquent : ce sont des zéros.",
          correction: `${ecriture} = ${nb(n)}.`
        };
      }
      if (cas === 1) {
        // Compléter la décomposition additive (un ou deux termes manquants)
        const termes = rangs.map(r => chiffreDe(n, r) * 10 ** r);
        const trous = melanger([...termes.keys()]).slice(0, Math.min(2, termes.length - 1));
        return {
          consigne: "Complète la décomposition additive.",
          ligne: `${nb(n)} = ` + termes.map((t, k) => trous.includes(k) ? "[n]" : nb(t)).join(" + "),
          verifier(v) {
            const x = v.map(lireNombre);
            if (x.some(isNaN)) return { etat: "incomplet", message: "Complète toutes les cases." };
            return { etat: trous.every((k, i) => x[i] === termes[k]) ? "juste" : "faux" };
          },
          indice: "Chaque terme correspond à un chiffre, suivi d'autant de zéros qu'il y a de rangs à sa droite.",
          correction: `${nb(n)} = ${termes.map(nb).join(" + ")}.`
        };
      }
      if (cas === 2) {
        // Compléter la décomposition canonique
        const trous = melanger(rangs.filter(r => r > 0)).slice(0, 2);
        const morceau = r => r === 0 ? String(chiffreDe(n, 0)) : `(${trous.includes(r) ? "[n]" : chiffreDe(n, r)} × ${PUISSANCES[r]})`;
        const ordre = rangs.filter(r => trous.includes(r));
        return {
          consigne: "Complète la décomposition canonique.",
          ligne: `${nb(n)} = ` + rangs.map(morceau).join(" + "),
          verifier(v) {
            const x = v.map(lireNombre);
            if (x.some(isNaN)) return { etat: "incomplet", message: "Complète toutes les cases." };
            return { etat: ordre.every((r, i) => x[i] === chiffreDe(n, r)) ? "juste" : "faux" };
          },
          indice: "Dans la décomposition canonique, on multiplie chaque chiffre par 1, 10, 100, 1 000…",
          correction: `${nb(n)} = ` + rangs.map(r => r === 0 ? String(chiffreDe(n, 0)) : `(${chiffreDe(n, r)} × ${PUISSANCES[r]})`).join(" + ") + "."
        };
      }
      // Décomposition non canonique (plus de 9 dans un rang)
      const c = alea(1, 9), d = alea(10, 19), u = alea(0, 19);
      const total = c * 100 + d * 10 + u;
      return {
        consigne: `Attention, cette décomposition n'est pas canonique ! Quel est le nombre formé de ${c} centaines, ${d} dizaines et ${u} unités ?`,
        ligne: "[n]",
        verifier: v => verifierNombre(v[0], total),
        indice: "Calcule chaque morceau séparément, puis additionne : 1 centaine = 100, 1 dizaine = 10.",
        correction: `${c} × 100 + ${d} × 10 + ${u} = ${nb(c * 100)} + ${nb(d * 10)} + ${u} = ${nb(total)}.`
      };
    }
  },

  {
    groupe: F1,
    id: "decompositions-utiles",
    titre: "Décompositions utiles",
    description: "7 815 = … × 100 + … ; 3 milliards = … millions.",
    generer() {
      const cas = alea(0, 2);
      if (cas === 0) {
        const n = nombreAuHasard(alea(4, 6), 0.2);
        const r = alea(1, Math.min(3, nbChiffres(n) - 1));
        const q = Math.floor(n / 10 ** r), reste = n % 10 ** r;
        return {
          consigne: "Complète l'égalité.",
          ligne: `${nb(n)} = [n] × ${PUISSANCES[r]} + [n]`,
          verifier(v) {
            const x = v.map(lireNombre);
            if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux cases." };
            if (x[0] === q && x[1] === reste) return { etat: "juste" };
            if (x[0] * 10 ** r + x[1] === n) return { etat: "faux", message: `L'égalité est vraie, mais le nombre de droite doit être plus petit que ${PUISSANCES[r]}.` };
            return { etat: "faux" };
          },
          indice: `Le premier nombre est le nombre de ${RANGS[r]} de ${nb(n)}.`,
          correction: `Le nombre de ${RANGS[r]} de ${nb(n)} est ${nb(q)} : ${nb(n)} = ${nb(q)} × ${PUISSANCES[r]} + ${nb(reste)}.`
        };
      }
      if (cas === 1) {
        const [consigne, attendu, unite, correction] = choisir([
          (() => { const a = alea(2, 9); return [`${a} milliards = [n] millions`, a * 1000, "", `1 milliard = 1 000 millions, donc ${a} milliards = ${nb(a * 1000)} millions.`]; })(),
          (() => { const a = alea(2, 9), b = alea(10, 999); return [`${a} milliards et ${b} millions = [n] millions`, a * 1000 + b, "", `${a} milliards = ${nb(a * 1000)} millions, donc ${a} milliards et ${b} millions = ${nb(a * 1000 + b)} millions.`]; })(),
          (() => { const a = alea(12, 999) * 100; return [`${nb(a)} = [n] centaines`, a / 100, "", `Le nombre de centaines de ${nb(a)} est ${nb(a / 100)}.`]; })(),
          (() => { const a = alea(12, 999) * 10; return [`${nb(a)} = [n] dizaines`, a / 10, "", `Le nombre de dizaines de ${nb(a)} est ${nb(a / 10)}.`]; })(),
          (() => { const a = alea(12, 999) * 1000; return [`${nb(a)} = [n] milliers`, a / 1000, "", `Le nombre de milliers de ${nb(a)} est ${nb(a / 1000)}.`]; })()
        ]);
        return {
          consigne: "Complète.",
          ligne: consigne,
          verifier: v => verifierNombre(v[0], attendu),
          indice: "1 dizaine = 10 ; 1 centaine = 100 ; 1 millier = 1 000 ; 1 milliard = 1 000 millions.",
          correction
        };
      }
      const n = alea(11, 99) * 100;
      const c = Math.floor(n / 1000), d = Math.floor(n / 100) % 10;
      const affirmations = [
        [`${nb(n)} = ${nb(n / 100)} centaines`, true],
        [`${nb(n)} = ${nb(n / 10)} dizaines`, true],
        [`${nb(n)} = ${c} milliers et ${d} centaines`, true],
        [`${nb(n)} = ${c} × 1 000 + ${d} × 10`, d === 0],
        [`${nb(n)} = ${nb(n / 100)} dizaines`, false],
        [`${nb(n)} = ${nb(n / 10)} centaines`, false]
      ];
      const [texte, vrai] = choisir(affirmations);
      return {
        consigne: `Vrai ou faux ?<br><strong>${texte}</strong>`,
        choix: ["Vrai", "Faux"],
        verifier: (v, ch) => ({ etat: (ch === "Vrai") === vrai ? "juste" : "faux" }),
        indice: `Le nombre de centaines de ${nb(n)} est ${nb(n / 100)}, son nombre de dizaines est ${nb(n / 10)}.`,
        correction: `C'est ${vrai ? "vrai" : "faux"}. ${nb(n)} = ${nb(n / 100)} centaines = ${nb(n / 10)} dizaines = ${c} × 1 000 + ${d} × 100.`
      };
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "comparer",
    titre: "Comparer deux nombres",
    description: "Compléter avec <, > ou =.",
    generer() {
      const cas = alea(0, 4);
      let a, b, ta, tb;
      if (cas === 0) {
        // mêmes chiffres, deux chiffres échangés
        // on recommence tant que l'échange est impossible (ex. 5 000 : un seul chiffre non nul)
        do {
          a = nombreAuHasard(alea(4, 7), 0.25);
          const s = String(a).split("");
          const i = alea(0, s.length - 1), j = alea(0, s.length - 1);
          [s[i], s[j]] = [s[j], s[i]];
          b = s[0] === "0" ? a : Number(s.join(""));
        } while (b === a);
      } else if (cas === 1) {
        // pas le même nombre de chiffres
        const k = alea(4, 7);
        a = Number("1" + "0".repeat(k - 1)) + alea(0, 10 ** (k - 2)); // petit nombre de k chiffres
        b = 10 ** (k - 1) - 1 - alea(0, 10 ** (k - 3));              // grand nombre de k − 1 chiffres
      } else if (cas === 2) {
        const k = alea(3, 6);
        a = 10 ** k - 1; b = 10 ** k;
      } else if (cas === 3) {
        a = nombreAuHasard(alea(4, 7), 0.2); b = a + choisir([-1, 1]) * 10 ** alea(0, nbChiffres(a) - 2);
      } else {
        const [x, y, ex, ey] = choisir([
          (() => { const k = alea(2, 9); return [k * 1e9, k * 1e9, `${k} milliards`, `${nb(k * 1000)} millions`]; })(),
          (() => { const k = alea(2, 9); return [k * 1e4, k * 1e4, `${k} dizaines de mille`, nb(k * 1e4)]; })(),
          (() => { const k = alea(2, 9); return [k * 1e5, k * 1e4, `${k} centaines de mille`, nb(k * 1e4)]; })(),
          (() => { const k = alea(12, 95); return [k * 1e6, k * 1e5, `${k} millions`, `${nb(k * 100)} milliers`]; })()
        ]);
        a = x; b = y; ta = ex; tb = ey;
      }
      if (Math.random() < 0.5) { [a, b] = [b, a]; [ta, tb] = [tb, ta]; }
      const s = a < b ? "<" : a > b ? ">" : "=";
      const A = ta || nb(a), B = tb || nb(b);
      let explication;
      if (ta) explication = `${A} = ${nb(a)} et ${B} = ${nb(b)}.`;
      else if (nbChiffres(a) !== nbChiffres(b)) explication = `${nb(a)} a ${nbChiffres(a)} chiffres et ${nb(b)} en a ${nbChiffres(b)} : celui qui a le plus de chiffres est le plus grand.`;
      else {
        let r = nbChiffres(a) - 1;
        while (r >= 0 && chiffreDe(a, r) === chiffreDe(b, r)) r--;
        explication = `Les deux nombres ont autant de chiffres. De gauche à droite, le premier chiffre qui diffère est celui des ${RANGS[r]} : ${chiffreDe(a, r)} ${symbole(s)} ${chiffreDe(b, r)}.`;
      }
      return {
        consigne: "Complète avec &lt;, &gt; ou =.",
        ligne: `${A} [c] ${B}`,
        choix: ["<", "=", ">"],
        verifier: (v, c) => ({ etat: c === s ? "juste" : "faux" }),
        indice: "Compte d'abord les chiffres. S'ils en ont autant, compare les chiffres de gauche à droite, jusqu'au premier qui diffère.",
        correction: `${explication} Donc ${A} ${symbole(s)} ${B}.`
      };
    }
  },

  {
    groupe: F2,
    id: "ranger",
    titre: "Ranger des nombres",
    description: "Ordre croissant ou décroissant, en cliquant sur les nombres.",
    generer() {
      const croissant = Math.random() < 0.5;
      let items;
      if (Math.random() < 0.4) {
        const [contexte, unite, liste] = choisir([
          ["Longueurs de fleuves", "km", [["Rhône", alea(780, 830)], ["Rhin", alea(1200, 1260)], ["Garonne", alea(600, 680)], ["Loire", alea(1000, 1030)], ["Seine", alea(740, 779)]]],
          ["Entrées des salles d'un cinéma", "entrées", (() => { const b = alea(2, 4) * 1000 + alea(0, 9) * 100; const s = String(b); return [["Salle 1", b + 8], ["Salle 2", alea(700, 990)], ["Salle 3", Number(s[0] + s[1] + "80")], ["Salle 4", 1000 + alea(10, 99)], ["Salle 5", Number(s[0] + "0" + s[1] + "4")]]; })()],
          ["Altitudes de sommets", "m", [["Mont Blanc", 4806], ["Pic du Midi", 2877], ["Puy de Dôme", 1465], ["Mont Ventoux", 1909], ["Puy de Sancy", 1886]]]
        ]);
        items = liste.map(([nom, v]) => ({ v, texte: `${nom} : ${nb(v)} ${unite}`, court: nom }));
        items.contexte = contexte;
      } else {
        items = null;
      }
      if (!items) {
        // mêmes chiffres dans un ordre différent : c'est là qu'on se trompe
        let base, vus = new Set(), garde = 0;
        while (vus.size < 5) {
          if (garde++ % 200 === 0) { base = String(nombreAuHasard(alea(4, 6), 0.15)).split(""); vus = new Set(); } // assez de chiffres différents
          const s = melanger([...base]);
          if (s[0] === "0") continue;
          const m = Number(s.slice(0, alea(Math.max(3, base.length - 1), base.length)).join(""));
          vus.add(m);
        }
        items = [...vus].map(v => ({ v, texte: nb(v), court: nb(v) }));
      }
      const ordreJuste = [...items.keys()].sort((i, j) => croissant ? items[i].v - items[j].v : items[j].v - items[i].v);
      const sens = croissant ? "<" : ">";
      const r = rangement(items, sens);
      return {
        consigne: `${items.contexte ? items.contexte + " : r" : "R"}ange dans l'ordre <strong>${croissant ? "croissant" : "décroissant"}</strong> (du plus ${croissant ? "petit au plus grand" : "grand au plus petit"}). Clique sur les nombres dans l'ordre ; clique à nouveau sur un nombre rangé pour le retirer.`,
        figure: r.noeud,
        verifier() {
          const ordre = r.ordre();
          if (ordre.length < items.length) return { etat: "incomplet", message: "Range tous les nombres avant de valider." };
          const k = ordre.findIndex((i, p) => items[i].v !== items[ordreJuste[p]].v);
          if (k < 0) return { etat: "juste" };
          return { etat: "faux", message: `Le ${k === 0 ? "premier" : (k + 1) + "e"} nombre n'est pas à sa place.` };
        },
        indice: croissant ? "Commence par le plus petit : le moins de chiffres, puis compare de gauche à droite." : "Commence par le plus grand : le plus de chiffres, puis compare de gauche à droite.",
        correction: ordreJuste.map(i => items.contexte ? `${items[i].court} (${nb(items[i].v)})` : items[i].texte).join(` ${symbole(sens)} `),
        bloquer: r.bloquer
      };
    }
  },

  {
    groupe: F2,
    id: "encadrer",
    titre: "Encadrer",
    description: "Par l'entier qui précède et qui suit, ou à la dizaine, centaine, millier près.",
    generer() {
      const cas = choisir(["entier", "dizaine", "centaine", "millier"]);
      const p = { entier: 1, dizaine: 10, centaine: 100, millier: 1000 }[cas];
      let n;
      do n = cas === "entier" ? nombreAuHasard(alea(4, 7), 0.5) : nombreAuHasard(alea(4, 6), 0.2);
      while (cas !== "entier" && n % p === 0);
      const bas = cas === "entier" ? n - 1 : Math.floor(n / p) * p, haut = cas === "entier" ? n + 1 : bas + p;
      const precision = { entier: "par l'entier qui le précède et celui qui le suit", dizaine: "à la dizaine près", centaine: "à la centaine près", millier: "au millier près" }[cas];
      const nom = { dizaine: "dizaines", centaine: "centaines", millier: "milliers" }[cas];
      return {
        consigne: `Encadre ${nb(n)} ${precision}.`,
        ligne: `[n] ${inf} ${nb(n)} ${inf} [n]`,
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux cases." };
          if (x[0] === bas && x[1] === haut) return { etat: "juste" };
          if (!(x[0] < n && n < x[1])) return { etat: "faux", message: "Ton encadrement n'est pas vrai : vérifie les signes &lt;." };
          if (cas !== "entier" && (x[0] % p || x[1] % p)) return { etat: "faux", message: `Les deux nombres doivent être des ${nom} entières (se terminer par ${"0".repeat(Math.log10(p))}).` };
          return { etat: "faux", message: `Les deux nombres doivent être ${cas === "entier" ? "les entiers juste avant et juste après" : `deux ${nom} qui se suivent`}.` };
        },
        indice: cas === "entier" ? "L'entier qui précède, c'est n − 1 ; celui qui suit, c'est n + 1." : `Cherche les deux ${nom} qui se suivent, l'une juste en dessous, l'autre juste au-dessus.`,
        correction: `${nb(bas)} ${inf} ${nb(n)} ${inf} ${nb(haut)}.`
      };
    }
  },

  {
    groupe: F2,
    id: "intercaler",
    titre: "Intercaler",
    description: "Trouver un entier entre deux nombres, quand c'est possible.",
    generer() {
      const a = nombreAuHasard(alea(4, 6), 0.3);
      const ecart = choisir([1, 2, 2, 3, 10, 1]);
      const b = a + ecart;
      let impossible = false;
      const bascule = el("button", { type: "button", class: "btn bascule", "aria-pressed": "false" }, "C'est impossible");
      bascule.addEventListener("click", () => {
        impossible = !impossible;
        bascule.setAttribute("aria-pressed", String(impossible));
      });
      return {
        consigne: "Intercale un nombre entier entre ces deux nombres. Si c'est impossible, clique sur « C'est impossible », puis valide.",
        ligne: `${nb(a)} ${inf} [n] ${inf} ${nb(b)}`,
        apresLigne: bascule,
        verifier(v) {
          if (impossible) return ecart === 1 ? { etat: "juste" } : { etat: "faux", message: `Il y a au moins un entier entre ${nb(a)} et ${nb(b)}, par exemple ${nb(a + 1)}.` };
          const x = lireNombre(v[0]);
          if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre, ou clique sur « C'est impossible »." };
          if (!Number.isInteger(x)) return { etat: "faux", message: "On demande un nombre entier." };
          if (x > a && x < b) return { etat: "juste" };
          return { etat: "faux", message: ecart === 1 ? "" : `${nb(x)} n'est pas compris entre ${nb(a)} et ${nb(b)}.` };
        },
        indice: "Deux entiers qui se suivent n'ont aucun entier entre eux.",
        correction: ecart === 1
          ? `${nb(a)} et ${nb(b)} se suivent : on ne peut intercaler aucun nombre entier entre eux.`
          : `Par exemple ${nb(a + 1)} : ${nb(a)} ${inf} ${nb(a + 1)} ${inf} ${nb(b)}.` + (ecart > 2 ? ` Tous les entiers de ${nb(a + 1)} à ${nb(b - 1)} conviennent.` : ""),
        bloquer() { bascule.disabled = true; }
      };
    }
  },

  {
    groupe: F2,
    id: "chiffre-manquant",
    titre: "Le chiffre manquant",
    description: "Trouver tous les chiffres possibles dans la case.",
    generer() {
      let A, B, p, s, possibles;
      do {
        B = nombreAuHasard(4, 0.2);
        const chiffres = String(B).split("");
        p = alea(0, 3);
        if (Math.random() < 0.5 && p < 3) { const q = alea(p + 1, 3); chiffres[q] = String(alea(0, 9)); }
        A = chiffres;
        s = choisir(["<", ">"]);
        possibles = [];
        for (let d = p === 0 ? 1 : 0; d <= 9; d++) {
          const t = [...A]; t[p] = String(d);
          const x = Number(t.join(""));
          if (s === "<" ? x < B : x > B) possibles.push(d);
        }
      } while (!possibles.length || possibles.length > 8);
      const affiche = A.map((c, i) => i === p ? '<span class="case-vide">□</span>' : c);
      affiche.splice(1, 0, "&nbsp;");
      const choisis = new Set();
      let actif = true;
      const boutons = [...Array(10).keys()].map(d => {
        const b = el("button", { type: "button", class: "btn chiffre-choix", "aria-pressed": "false" }, String(d));
        b.addEventListener("click", () => {
          if (!actif) return;
          if (choisis.has(d)) choisis.delete(d); else choisis.add(d);
          b.setAttribute("aria-pressed", String(choisis.has(d)));
        });
        return b;
      });
      return {
        consigne: "Quels chiffres peut-on écrire dans la case pour que l'inégalité soit vraie ? Sélectionne <strong>toutes</strong> les possibilités, puis valide.",
        ligne: `${affiche.join("")} ${symbole(s)} ${nb(B)}`,
        apresLigne: el("div", { class: "chiffres-choix" }, ...boutons),
        verifier() {
          if (!choisis.size) return { etat: "incomplet", message: "Sélectionne au moins un chiffre." };
          const manque = possibles.filter(d => !choisis.has(d)), trop = [...choisis].filter(d => !possibles.includes(d));
          if (!manque.length && !trop.length) return { etat: "juste" };
          const parties = [];
          if (manque.length) parties.push(`il manque ${manque.length > 1 ? manque.length + " chiffres" : "un chiffre"}`);
          if (trop.length) parties.push(`${trop.length > 1 ? trop.length + " chiffres ne conviennent" : "un chiffre ne convient"} pas`);
          return { etat: "faux", message: cap(parties.join(" et ")) + "." };
        },
        indice: "Essaie chaque chiffre de 0 à 9 dans la case, et compare de gauche à droite." + (p === 0 ? " Un nombre ne commence pas par 0." : ""),
        correction: `Les chiffres possibles sont : ${possibles.join(" ; ")}.`,
        surCorrection() { boutons.forEach((b, d) => b.classList.toggle("bonne", possibles.includes(d))); },
        bloquer() { actif = false; }
      };
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: F3,
    id: "valeur-graduation",
    titre: "Valeur d'une graduation",
    description: "Écart ÷ nombre d'intervalles.",
    generer() {
      const g = graduationAuHasard();
      let i, j;
      if (g.principales) { i = 0; j = 10; } else { i = alea(0, 3); j = alea(i + 2, Math.min(i + 6, g.n)); }
      const d = demiDroite({ ...g, etiquettes: [i, j], surligne: i });
      const ecart = (j - i) * g.pas;
      return {
        consigne: "Combien vaut une graduation ? C'est l'écart entre deux traits qui se suivent, comme celle repassée en orange.",
        figure: d.svg,
        ligne: "[n]",
        verifier(v) {
          const r = verifierNombre(v[0], g.pas);
          if (r.etat === "faux" && lireNombre(v[0]) === ecart / (j - i + 1)) r.message = "Attention : on compte les intervalles (les espaces entre les traits), pas les traits.";
          return r;
        },
        indice: "Calcule l'écart entre les deux nombres écrits, puis divise-le par le nombre d'intervalles entre eux.",
        correction: `Écart : ${nb(g.debut + j * g.pas)} − ${nb(g.debut + i * g.pas)} = ${nb(ecart)}. Il y a ${j - i} intervalles. ${nb(ecart)} ÷ ${j - i} = ${nb(g.pas)} : une graduation vaut ${nb(g.pas)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "lire-abscisse",
    titre: "Lire une abscisse",
    description: "Donner l'abscisse d'un point, même avec de grands nombres.",
    generer() {
      const g = graduationAuHasard();
      let i, j;
      if (g.principales) { i = 0; j = 10; } else { i = g.type === "zero" ? 0 : alea(0, 2); j = alea(i + 2, Math.min(i + 5, g.n - 2)); }
      let t;
      do t = alea(1, g.n); while (t === i || t === j);
      const lettre = choisir("ABCDEFGHKM".split(""));
      const d = demiDroite({ ...g, etiquettes: [i, j], point: t, lettre });
      const valeur = g.debut + t * g.pas;
      return {
        consigne: `Quelle est l'abscisse du point ${lettre} ?`,
        figure: d.svg,
        ligne: `${lettre}&thinsp;( [n] )`,
        verifier(v) {
          const r = verifierNombre(v[0], valeur);
          const x = lireNombre(v[0]);
          if (r.etat === "faux" && (x === t || x === t - i)) r.message = "Tu as compté les graduations : il faut tenir compte de la valeur d'une graduation.";
          return r;
        },
        indice: "Trouve d'abord la valeur d'une graduation (écart ÷ nombre d'intervalles), puis compte les graduations à partir d'un nombre connu.",
        correction: `Une graduation vaut ${nb(g.pas)}. Le point ${lettre} est à ${pluriel(Math.abs(t - i), "graduation")} ${t > i ? "après" : "avant"} ${nb(g.debut + i * g.pas)} : ${nb(g.debut + i * g.pas)} ${t > i ? "+" : "−"} ${Math.abs(t - i)} × ${nb(g.pas)} = ${nb(valeur)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "placer-point",
    titre: "Placer un point",
    description: "Placer un point d'abscisse donnée en cliquant.",
    generer() {
      const g = graduationAuHasard();
      if (g.type === "grand") g.type = "zero";
      const i = g.principales ? 0 : alea(0, 2), j = g.principales ? 10 : i + alea(1, 3);
      let t;
      do t = alea(0, g.n); while (t === i || t === j);
      const lettre = choisir("ABCDEFGHKM".split(""));
      const d = demiDroite({ ...g, etiquettes: [i, j], lettre, clic: true });
      const valeur = g.debut + t * g.pas;
      return {
        consigne: `Place le point ${lettre}(${nb(valeur)}) en cliquant sur la demi-droite graduée, puis valide.`,
        figure: d.svg,
        verifier() {
          if (d.position == null) return { etat: "incomplet", message: "Clique sur la demi-droite pour placer le point." };
          if (d.position === t) return { etat: "juste" };
          return { etat: "faux", message: `Ton point a pour abscisse ${nb(g.debut + d.position * g.pas)}.` };
        },
        indice: "Calcule d'abord la valeur d'une graduation, puis compte à partir d'un nombre écrit.",
        correction: `Une graduation vaut ${nb(g.pas)}. ${nb(valeur)} est à ${pluriel(Math.abs(t - i), "graduation")} ${t > i ? "après" : "avant"} ${nb(g.debut + i * g.pas)} : le point est placé en vert.`,
        surCorrection: () => d.marquer(t, "pt correct", lettre),
        bloquer() { d.actif = false; }
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "quelle-operation",
    titre: "Quelle opération ?",
    description: "Addition, soustraction ou multiplication ?",
    generer() {
      const a = alea(120, 900), b = alea(12, 99), c = alea(3, 30), c2 = c + alea(1, 4), prix = alea(2, 15);
      const [texte, op, calcul] = choisir([
        [`Léa a ${a} cartes. Pour son anniversaire, on lui en offre ${b}. Combien en a-t-elle maintenant ?`, "Addition", `${a} + ${b} = ${a + b}`],
        [`Deux classes partent en sortie : l'une a ${c} élèves, l'autre ${c2}. Combien d'élèves partent en tout ?`, "Addition", `${c} + ${c2} = ${c + c2}`],
        [`Paul a ${b} € de plus que Léo, qui a ${a} €. Combien Paul a-t-il ?`, "Addition", `${a} + ${b} = ${a + b} €`],
        [`Un libraire avait ${a} livres. Il en vend ${b}. Combien lui en reste-t-il ?`, "Soustraction", `${a} − ${b} = ${a - b}`],
        [`Tom mesure ${b + 100} cm et Lina ${b + 88} cm. Quel est l'écart entre leurs tailles ?`, "Soustraction", `${b + 100} − ${b + 88} = 12 cm`],
        [`Un vélo coûte ${a} € et une trottinette ${b + 100} €. Combien le vélo coûte-t-il de plus ?`, "Soustraction", `${a} − ${b + 100} = ${a - b - 100} €`],
        [`Un collège commande ${c} boîtes de ${b} craies. Combien de craies reçoit-il ?`, "Multiplication", `${c} × ${b} = ${c * b}`],
        [`Un cahier coûte ${prix} €. Combien coûtent ${c} cahiers ?`, "Multiplication", `${c} × ${prix} = ${c * prix} €`],
        [`Un car transporte ${b} passagers à chaque voyage. Il fait ${c} voyages complets. Combien de passagers a-t-il transportés ?`, "Multiplication", `${c} × ${b} = ${c * b}`]
      ]);
      const regle = { Addition: "on ajoute, on réunit ou on calcule un total", Soustraction: "on retire ou on calcule un écart", Multiplication: "on ajoute plusieurs fois le même nombre" }[op];
      return {
        consigne: `${texte}<br>Quelle opération faut-il faire ?`,
        choix: ["Addition", "Soustraction", "Multiplication"],
        verifier: (v, ch) => ({ etat: ch === op ? "juste" : "faux", message: ch !== op && /de plus/.test(texte) ? "Attention aux mots « de plus » : lis bien ce que l'on cherche." : "" }),
        indice: "Addition : ajouter, réunir, total. Soustraction : retirer, écart. Multiplication : ajouter plusieurs fois le même nombre.",
        correction: `${op} : ${regle}. Calcul : ${calcul}.`
      };
    }
  },

  {
    groupe: F4,
    id: "vocabulaire-operations",
    titre: "Vocabulaire des opérations",
    description: "Somme, différence, produit, termes, facteurs.",
    generer() {
      const a = alea(12, 99), b = alea(2, 11);
      if (Math.random() < 0.55) {
        const [mot, r, calcul] = choisir([
          ["La somme", a + b, `${a} + ${b} = ${a + b}`],
          ["La différence", a - b, `${a} − ${b} = ${a - b}`],
          ["Le produit", a * b, `${a} × ${b} = ${a * b}`]
        ]);
        const liaison = mot === "Le produit" ? "par" : "et";
        return {
          consigne: "Calcule.",
          ligne: `${mot} de ${a} ${liaison} ${b} est [n]`,
          verifier(v) {
            const res = verifierNombre(v[0], r);
            const x = lireNombre(v[0]);
            const noms = { [a + b]: "la somme", [a - b]: "la différence", [a * b]: "le produit" };
            if (res.etat === "faux" && noms[x]) res.message = `Tu as calculé ${noms[x]}.`;
            return res;
          },
          indice: "La somme est le résultat d'une addition, la différence celui d'une soustraction, le produit celui d'une multiplication.",
          correction: `${mot} de ${a} ${liaison} ${b} : ${calcul}.`
        };
      }
      const [question, options, bonne] = choisir([
        [`Dans ${a} × ${b} = ${a * b}, comment s'appellent ${a} et ${b} ?`, ["les facteurs", "les termes", "les produits"], "les facteurs"],
        [`Dans ${a} + ${b} = ${a + b}, comment s'appellent ${a} et ${b} ?`, ["les termes", "les facteurs", "les sommes"], "les termes"],
        [`Dans ${a} × ${b} = ${a * b}, comment s'appelle ${a * b} ?`, ["le produit", "la somme", "le facteur"], "le produit"],
        [`Dans ${a} − ${b} = ${a - b}, comment s'appelle ${a - b} ?`, ["la différence", "la somme", "le terme"], "la différence"],
        ["Dans quelle opération ne peut-on pas échanger les nombres sans changer le résultat ?", ["la soustraction", "l'addition", "la multiplication"], "la soustraction"]
      ]);
      return {
        consigne: question,
        choix: melanger([...options]),
        verifier: (v, ch) => ({ etat: ch === bonne ? "juste" : "faux" }),
        indice: "Addition : termes → somme. Soustraction : termes → différence. Multiplication : facteurs → produit.",
        correction: `Réponse : ${bonne}. Addition : les termes, le résultat est la somme ; soustraction : les termes, la différence ; multiplication : les facteurs, le produit.`
      };
    }
  },

  {
    groupe: F4,
    id: "problemes",
    titre: "Problèmes à étapes",
    description: "Des problèmes comme ceux de la fiche, avec de nouveaux nombres.",
    generer() {
      const modele = alea(0, 6);
      if (modele === 0) {
        const P = alea(10, 18) * 50, N = alea(Math.round(P * 0.5 / 10), Math.round(P * 0.8 / 10)) * 10, pp = alea(10, 15), pr = alea(5, 9);
        return probleme(`Une salle de concert comporte ${nb(P)} places assises. Le tarif plein est de ${pp} €, le tarif réduit de ${pr} €. Vendredi, la salle est pleine et ${nb(N)} personnes ont payé le tarif plein.`, [
          { q: "Combien de personnes ont payé le tarif réduit ?", r: P - N, unite: "personnes", calcul: `${nb(P)} − ${nb(N)} = ${nb(P - N)} personnes ont payé le tarif réduit.` },
          { q: "Quelle est la recette du vendredi ?", r: N * pp + (P - N) * pr, unite: "€", calcul: `${nb(N)} × ${pp} + ${nb(P - N)} × ${pr} = ${nb(N * pp)} + ${nb((P - N) * pr)} = ${nb(N * pp + (P - N) * pr)} €.` }
        ]);
      }
      if (modele === 1) {
        const C = alea(12, 30), L = alea(20, 48), V = alea(Math.floor(C * L / 200), Math.floor(C * L / 130)) * 100;
        return probleme(`Un libraire reçoit ${C} cartons contenant chacun ${L} livres. Il en vend ${nb(V)} dans le mois.`, [
          { q: "Combien de livres a-t-il reçus ?", r: C * L, unite: "livres", calcul: `${C} × ${L} = ${nb(C * L)} livres reçus.` },
          { q: "Combien de livres lui reste-t-il ?", r: C * L - V, unite: "livres", calcul: `${nb(C * L)} − ${nb(V)} = ${nb(C * L - V)} livres restants.` }
        ]);
      }
      if (modele === 2) {
        const J = alea(900, 1800), g = alea(100, 250), p = alea(40, 99);
        return probleme(`Une salle de sport compte ${nb(J)} adhérents en janvier. Elle en gagne ${g} en février, puis en perd ${p} en mars.`, [
          { q: "Combien d'adhérents compte-t-elle fin février ?", r: J + g, unite: "adhérents", calcul: `${nb(J)} + ${g} = ${nb(J + g)} adhérents fin février.` },
          { q: "Combien d'adhérents compte-t-elle fin mars ?", r: J + g - p, unite: "adhérents", calcul: `${nb(J + g)} − ${p} = ${nb(J + g - p)} adhérents fin mars.` }
        ]);
      }
      if (modele === 3) {
        const L = alea(30, 60), l = alea(15, L - 5), R = 50, per = 2 * (L + l), rouleaux = Math.ceil(per / R);
        return probleme(`Un terrain rectangulaire mesure ${L} m de long et ${l} m de large. On veut l'entourer d'un grillage vendu par rouleaux de ${R} m.`, [
          { q: "Quelle est son aire ?", r: L * l, unite: "m²", calcul: `Aire : ${L} × ${l} = ${nb(L * l)} m².`, piege: x => x === per ? "Tu as calculé le périmètre (le tour), pas l'aire." : "" },
          { q: "Quel est son périmètre ?", r: per, unite: "m", calcul: `Périmètre : 2 × (${L} + ${l}) = ${per} m.`, piege: x => x === L * l ? "Tu as calculé l'aire, pas le périmètre (le tour)." : "" },
          { q: "Combien de rouleaux entiers faut-il acheter ?", r: rouleaux, unite: "rouleaux", calcul: `${per} m ÷ ${R} m : ${Math.floor(per / R)} rouleaux ne suffisent pas (${Math.floor(per / R) * R} m), il en faut ${rouleaux}.`, piege: x => x === Math.floor(per / R) ? `Avec ${x} rouleaux, on n'a que ${x * R} m de grillage : ce n'est pas assez.` : "" }
        ]);
      }
      if (modele === 4) {
        const a = alea(2, 5), pa = alea(2, 6), b = alea(2, 4), ps = alea(1, 4), B = choisir([20, 50]);
        const total = a * pa + b * ps;
        return probleme(`Théo achète ${a} cahiers à ${pa} € et ${b} stylos à ${ps} €. Il paie avec un billet de ${B} €.`, [
          { q: "Combien dépense-t-il ?", r: total, unite: "€", calcul: `${a} × ${pa} + ${b} × ${ps} = ${a * pa} + ${b * ps} = ${total} €.` },
          { q: "Combien lui rend-on ?", r: B - total, unite: "€", calcul: `${B} − ${total} = ${B - total} €.` }
        ]);
      }
      if (modele === 5) {
        const n1 = alea(80, 180), p1 = alea(8, 12), n2 = alea(40, 110), p2 = alea(4, 7);
        return probleme(`Un cinéma vend ${n1} places au tarif plein de ${p1} € et ${n2} places au tarif réduit de ${p2} €.`, [
          { q: "Quelle est la recette de la séance ?", r: n1 * p1 + n2 * p2, unite: "€", calcul: `${n1} × ${p1} + ${n2} × ${p2} = ${nb(n1 * p1)} + ${nb(n2 * p2)} = ${nb(n1 * p1 + n2 * p2)} €.` },
          { q: "Combien de spectateurs y avait-il ?", r: n1 + n2, unite: "spectateurs", calcul: `${n1} + ${n2} = ${n1 + n2} spectateurs.` }
        ]);
      }
      const t = alea(10, 20), pt = alea(40, 80), c = alea(30, 70), pc = alea(15, 30);
      const total = t * pt + c * pc, budget = Math.round(total / 100) * 100 + choisir([-200, -100, 100, 200]);
      const q = probleme(`Une école achète ${t} tables à ${pt} € pièce et ${c} chaises à ${pc} € pièce. Elle dispose d'un budget de ${nb(budget)} €.`, [
        { q: "Quel est le prix total de l'achat ?", r: total, unite: "€", calcul: `${t} × ${pt} + ${c} × ${pc} = ${nb(t * pt)} + ${nb(c * pc)} = ${nb(total)} €.` }
      ], `${nb(total)} € ${total <= budget ? "&lt;" : "&gt;"} ${nb(budget)} € : le budget ${total <= budget ? "est" : "n'est pas"} suffisant.`);
      // Deuxième question : le budget suffit-il ?
      const verifierPrix = q.verifier;
      q.ligne = q.ligne.replace("<p>", "<p>1. ") + `<div class="etape-pb"><p>2. Le budget est-il suffisant ?</p>[s]</div>`;
      q.listes = [["Oui", "Non"]];
      q.verifier = v => {
        if (v[1] == null) return { etat: "incomplet", message: "Réponds aux deux questions." };
        const r = verifierPrix([v[0]]);
        const bon = (v[1] === 0) === (total <= budget);
        if (r.etat === "incomplet") return r;
        if (r.etat === "juste" && bon) return { etat: "juste" };
        return { etat: "faux", message: `À revoir : question ${[r.etat !== "juste" ? 1 : 0, bon ? 0 : 2].filter(Boolean).join(" et ")}.` };
      };
      q.correction = q.correction.replace("<br>", "<br>1. ").replace(/<br>(?=[^<]*$)/, "<br>2. ");
      return q;
    }
  },

  /* ================= Feuille 5 ================= */

  {
    groupe: F5,
    id: "poser-division",
    titre: "Poser une division",
    description: "La division euclidienne posée, étape par étape.",
    generer() {
      const b = Math.random() < 0.55 ? alea(2, 9) : alea(11, 35);
      const a = alea(Math.max(101, 10 * b + 1), b < 10 ? 9999 : 4999);
      const q = Math.floor(a / b), r = a % b;
      const w = divisionPosee(a, b);
      return {
        consigne: `Pose et effectue la division euclidienne de <strong>${nb(a)}</strong> par <strong>${b}</strong>, étape par étape.`,
        figure: w.noeud,
        ligne: `${nb(a)} = ${b} × [n] + [n]`,
        verifier(v) {
          if (!w.fini()) return { etat: "incomplet", message: "Termine d'abord la division, étape par étape (bouton OK sous la division)." };
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète l'égalité euclidienne." };
          return x[0] === q && x[1] === r ? { etat: "juste" } : { etat: "faux", message: "Recopie le quotient et le reste trouvés dans la division." };
        },
        indice: "À chaque étape : combien de fois le diviseur dans le dividende partiel ? On multiplie, on soustrait, puis on abaisse le chiffre suivant.",
        correction: `${nb(a)} = ${b} × ${nb(q)} + ${r}, avec ${r} &lt; ${b} : le quotient est ${nb(q)} et le reste ${r}.`,
        surCorrection: () => w.terminer(),
        bloquer: w.bloquer
      };
    }
  },

  {
    groupe: F5,
    id: "quotient-et-reste",
    titre: "Quotient et reste",
    description: "Effectuer une division euclidienne.",
    generer() {
      const b = Math.random() < 0.5 ? alea(2, 9) : alea(11, 60);
      const a = alea(b * 12, b < 10 ? 9999 : 9999);
      const q = Math.floor(a / b), r = a % b;
      return {
        consigne: `Effectue la division euclidienne de <strong>${nb(a)}</strong> par <strong>${b}</strong>. Tu peux la poser sur ton cahier.`,
        ligne: "Quotient : [n] &emsp; Reste : [n]",
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Donne le quotient et le reste." };
          if (x[0] === q && x[1] === r) return { etat: "juste" };
          if (x[1] >= b) return { etat: "faux", message: `Ton reste est plus grand que le diviseur ${b} (ou égal) : on peut encore mettre ${b} au moins une fois.` };
          if (x[0] === q) return { etat: "faux", message: `Le quotient est bon. Vérifie le reste : ${nb(a)} − ${b} × ${nb(q)}.` };
          return { etat: "faux" };
        },
        indice: "Cherche combien de fois le diviseur est contenu dans le dividende. Le reste doit être plus petit que le diviseur.",
        correction: `${nb(a)} = ${b} × ${nb(q)} + ${r}, avec ${r} ${inf} ${b} : le quotient est ${nb(q)} et le reste est ${r}.`
      };
    }
  },

  {
    groupe: F5,
    id: "egalite-euclidienne",
    titre: "L'égalité euclidienne",
    description: "dividende = diviseur × quotient + reste.",
    generer() {
      const b = alea(3, 50), q = alea(5, 200), r = alea(0, b - 1), a = b * q + r;
      const cas = alea(0, 2);
      if (cas === 0) {
        return {
          consigne: `Dans une division euclidienne, le diviseur est ${b}, le quotient est ${q} et le reste est ${r}. Quel est le dividende ?`,
          ligne: "Dividende : [n]",
          verifier: v => verifierNombre(v[0], a),
          indice: "dividende = diviseur × quotient + reste.",
          correction: `Dividende = ${b} × ${q} + ${r} = ${nb(b * q)} + ${r} = ${nb(a)}.`
        };
      }
      if (cas === 1) {
        return {
          consigne: `Complète l'égalité de la division euclidienne de ${nb(a)} par ${b}.`,
          ligne: `${nb(a)} = ${b} × [n] + [n]`,
          verifier(v) {
            const x = v.map(lireNombre);
            if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux cases." };
            if (x[0] === q && x[1] === r) return { etat: "juste" };
            if (b * x[0] + x[1] === a) return { etat: "faux", message: `L'égalité est vraie, mais le reste doit être plus petit que ${b}.` };
            return { etat: "faux" };
          },
          indice: "Le reste doit être strictement plus petit que le diviseur.",
          correction: `${nb(a)} = ${b} × ${q} + ${r}, avec ${r} ${inf} ${b}.`
        };
      }
      const type = choisir(["juste", "reste", "fausse"]);
      const [qq, rr] = type === "juste" ? [q, r] : type === "reste" ? [q - 1, r + b] : [q, r + alea(1, 3)];
      const options = ["Oui", "Non : le reste est trop grand", "Non : l'égalité est fausse"];
      const bonne = { juste: 0, reste: 1, fausse: 2 }[type];
      return {
        consigne: `L'égalité <strong>${nb(a)} = ${b} × ${qq} + ${rr}</strong> traduit-elle la division euclidienne de ${nb(a)} par ${b} ?`,
        choix: options,
        verifier: (v, ch) => ({ etat: ch === options[bonne] ? "juste" : "faux" }),
        indice: `Vérifie deux choses : le calcul ${b} × ${qq} + ${rr} donne-t-il bien ${nb(a)} ? Le reste est-il plus petit que ${b} ?`,
        correction: {
          juste: `${b} × ${qq} + ${rr} = ${nb(a)} et ${rr} ${inf} ${b} : c'est bien la division euclidienne.`,
          reste: `Le calcul est juste, mais le reste ${rr} n'est pas plus petit que ${b}. La division euclidienne est ${nb(a)} = ${b} × ${q} + ${r}.`,
          fausse: `${b} × ${qq} + ${rr} = ${nb(b * qq + rr)}, et non ${nb(a)} : l'égalité est fausse.`
        }[type]
      };
    }
  },

  {
    groupe: F5,
    id: "vocabulaire-division",
    titre: "Vocabulaire de la division",
    description: "Dividende, diviseur, quotient, reste.",
    generer() {
      let a, b, q, r;
      do { b = alea(4, 60); q = alea(10, 600); r = alea(1, b - 1); a = b * q + r; } while (new Set([a, b, q, r]).size < 4);
      const mot = choisir(["dividende", "diviseur", "quotient", "reste"]);
      const valeurs = { dividende: a, diviseur: b, quotient: q, reste: r };
      return {
        consigne: `Dans la division euclidienne de ${nb(a)} par ${b}, on obtient :<br><strong>${nb(a)} = ${b} × ${nb(q)} + ${r}</strong><br>Quel est le <strong>${mot}</strong> ?`,
        choix: melanger([a, b, q, r].map(nb)),
        verifier: (v, ch) => ({ etat: ch === nb(valeurs[mot]) ? "juste" : "faux" }),
        indice: "dividende = diviseur × quotient + reste.",
        correction: `${nb(a)} est le dividende, ${b} le diviseur, ${nb(q)} le quotient et ${r} le reste.`
      };
    }
  },

  {
    groupe: F5,
    id: "problemes-division",
    titre: "Problèmes de division",
    description: "Faut-il le quotient, le reste, ou le quotient + 1 ?",
    generer() {
      const modele = alea(0, 6);
      const dup = (a, b) => [Math.floor(a / b), a % b];
      if (modele <= 1) {
        const [enonce, a, b, quoi] = modele === 0
          ? (() => { const b = alea(12, 20), a = b * alea(8, 15) + alea(1, b - 1); return [`Nolan range ses ${a} photos dans un album. Chaque page contient ${b} photos. Combien de pages lui faut-il pour ranger toutes ses photos ?`, a, b, "pages"]; })()
          : (() => { const b = alea(45, 60), a = b * alea(4, 9) + alea(1, b - 1); return [`Un car peut transporter ${b} passagers. Combien faut-il de cars pour emmener ${a} personnes en sortie scolaire ?`, a, b, "cars"]; })();
        const [q, r] = dup(a, b);
        return probleme(enonce, [
          { q: `Combien de ${quoi} faut-il ?`, r: q + 1, unite: quoi,
            calcul: `${a} = ${b} × ${q} + ${r}. Avec ${q} ${quoi}, il en reste ${r} : il faut ${quoi === "cars" ? "un car" : "une page"} de plus, donc ${q + 1} ${quoi}.`,
            piege: x => x === q ? `Avec ${q} ${quoi}, il en reste ${r} de côté : il en faut un de plus.` : "" }
        ]);
      }
      if (modele === 2) {
        const b = alea(15, 30), a = b * alea(15, 30) + alea(1, b - 1), [q, r] = dup(a, b);
        return probleme(`Une maîtresse partage équitablement ${a} bonbons entre les ${b} élèves de sa classe.`, [
          { q: "Combien de bonbons chaque élève reçoit-il ?", r: q, unite: "bonbons", calcul: `${a} = ${b} × ${q} + ${r} : chaque élève reçoit ${q} bonbons.` },
          { q: "Combien de bonbons reste-t-il ?", r, unite: "bonbons", calcul: `Il reste ${r} bonbons.` }
        ]);
      }
      if (modele === 3) {
        const b = alea(12, 25), a = b * alea(8, 15) + alea(1, b - 1), [q, r] = dup(a, b);
        return probleme(`Un fleuriste dispose de ${a} roses et prépare des bouquets de ${b} roses.`, [
          { q: "Combien de bouquets complets peut-il faire ?", r: q, unite: "bouquets", calcul: `${a} = ${b} × ${q} + ${r} : ${q} bouquets complets.` },
          { q: "Combien de roses lui reste-t-il ?", r, unite: "roses", calcul: `Il reste ${r} roses.` },
          { q: "Combien de roses lui manque-t-il pour faire un bouquet de plus ?", r: b - r, unite: "roses", calcul: `${b} − ${r} = ${b - r} roses manquantes.` }
        ]);
      }
      if (modele === 4) {
        const b = 12;
        let a;
        do a = alea(800, 1500); while (a % b === 0);
        const [q, r] = dup(a, b);
        return probleme(`Une ferme récolte ${nb(a)} œufs. Ils sont rangés dans des boîtes de ${b}.`, [
          { q: "Combien de boîtes sont complètes ?", r: q, unite: "boîtes", calcul: `${nb(a)} = ${b} × ${q} + ${r} : ${q} boîtes complètes.` },
          { q: "Les œufs restants sont mis dans une dernière boîte. Combien de boîtes utilise-t-on en tout ?", r: q + 1, unite: "boîtes", calcul: `Il reste ${r} œufs, donc une boîte de plus : ${q + 1} boîtes.` }
        ]);
      }
      if (modele === 5) {
        const a = alea(300, 1500), [q, r] = dup(a, 7);
        return probleme(`Un projet dure ${nb(a)} jours. Une semaine compte 7 jours.`, [
          { q: "Combien de semaines entières cela représente-t-il ?", r: q, unite: "semaines", calcul: `${nb(a)} = 7 × ${q} + ${r} : ${q} semaines entières…` },
          { q: "Combien de jours en plus ?", r, unite: "jours", calcul: `… et ${r} jours en plus.` }
        ]);
      }
      const m = alea(3, 9), b = choisir([35, 40, 45, 60, 70]), a = m * 100, [q, r] = dup(a, b);
      return probleme(`Un ruban mesure ${m} m. On veut le découper en morceaux de ${b} cm.`, [
        { q: "Combien de morceaux entiers obtient-on ?", r: q, unite: "morceaux", calcul: `${m} m = ${a} cm, et ${a} = ${b} × ${q} + ${r} : ${q} morceaux.`, piege: x => x === 0 ? "Pense à convertir les mètres en centimètres : 1 m = 100 cm." : "" },
        { q: "Quelle longueur de ruban reste-t-il ?", r, unite: "cm", calcul: `Il reste ${r} cm.` }
      ]);
    }
  }

];
