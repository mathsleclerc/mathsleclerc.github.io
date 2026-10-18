/* =====================================================================
   EXERCISEUR « OPÉRATIONS SUR LES NOMBRES DÉCIMAUX » — 6e, chapitre 8

   Les activités sont rangées comme les 8 feuilles d'exercices du chapitre.
   Beaucoup de calcul mental et de contrôle (ordre de grandeur, virgule),
   des opérations posées case par case, et des problèmes avec schéma en barres.

   PARCOURS (en bas du fichier) : le test « Je me teste » en 18 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Additionner et soustraire";
const F2 = "Feuille 2 — Multiplier des décimaux";
const F3 = "Feuille 3 — Division décimale";
const F4 = "Feuille 4 — Contrôler un résultat";
const F5 = "Feuille 5 — Choisir l'opération";
const F6 = "Feuille 6 — Problèmes à étapes";
const F7 = "Feuille 7 — Valeur manquante";
const F8 = "Feuille 8 — Approfondissement";

const rr = x => Math.round(x * 1e6) / 1e6;                 // évite les 2,0999999 des calculs décimaux
const nb = x => ecrireNombre(rr(x));
const nbDec = x => (String(rr(x)).split(".")[1] || "").length; // nombre de chiffres après la virgule
const tirer = (min, max, d) => rr(alea(Math.round(min * 10 ** d), Math.round(max * 10 ** d)) / 10 ** d);
const euros = x => { const y = rr(x); return (Number.isInteger(y) ? nb(y) : y.toFixed(2).replace(".", ",")) + " €"; };
const fixe = (x, d) => d ? rr(x).toFixed(d).replace(".", ",") : String(rr(x)); // écriture avec d décimales (zéros ajoutés)
const egal = (x, y) => Math.abs(x - y) < 1e-9;
const SYMB = { "+": "+", "-": "−", "×": "×", "÷": "÷" };
const calculer = (a, op, b) => rr(op === "+" ? a + b : op === "-" ? a - b : op === "×" ? a * b : a / b);

/* Plusieurs étiquettes à sélectionner */
function selection(liste) {
  const choisies = new Set();
  let actif = true;
  const boutons = liste.map((t, i) => {
    const b = el("button", { type: "button", class: "btn etiquette-choix", "aria-pressed": "false" });
    b.innerHTML = t;
    b.addEventListener("click", () => {
      if (!actif) return;
      if (choisies.has(i)) choisies.delete(i); else choisies.add(i);
      b.setAttribute("aria-pressed", String(choisies.has(i)));
    });
    return b;
  });
  return { noeud: el("div", { class: "etiquettes" }, ...boutons), choisies, boutons, bloquer: () => { actif = false; } };
}

/* Un problème en plusieurs questions : etapes = [{ q, r, unite }] */
function probleme(enonce, etapes, { indice, correction, figure } = {}) {
  const numeroter = etapes.length > 1;
  return {
    consigne: enonce,
    figure,
    classeLigne: "etapes",
    ligne: etapes.map((e, k) => `<div class="etape-pb"><p>${numeroter ? k + 1 + ". " : ""}${e.q}</p><p class="rep">[d] ${e.unite || ""}</p></div>`).join(""),
    verifier(v) {
      const res = etapes.map((e, k) => verifierNombre(v[k], e.r));
      if (res.some(r => r.etat === "incomplet")) return { etat: "incomplet", message: "Réponds à chaque question." };
      const fausses = res.map((r, k) => r.etat === "faux" ? k + 1 : 0).filter(Boolean);
      if (!fausses.length) return { etat: "juste" };
      return { etat: "faux", message: numeroter ? `Revois ${fausses.length > 1 ? "les questions " + fausses.join(" et ") : "la question " + fausses[0]}.` : "" };
    },
    indice,
    correction: correction || etapes.map((e, k) => (numeroter ? k + 1 + ". " : "") + (e.c || nb(e.r) + " " + (e.unite || ""))).join("<br>")
  };
}

/* ---------- Schémas en barres (texte SVG, utilisable dans une liste de choix) ----------
   parts : [{ t, w }] ; total : texte au-dessus de l'accolade. Une part « ? » est en bleu. */
function schema(parts, total, L = 240) {
  const somme = parts.reduce((a, p) => a + p.w, 0), x0 = 6;
  let x = x0, s = `<svg viewBox="0 0 ${L + 12} 92" width="${L + 12}" height="92" class="fig-schema barres" role="img" aria-label="Schéma en barres">`;
  s += `<path d="M${x0},30 v-8 H${x0 + L} v8" class="accolade"/><text x="${x0 + L / 2}" y="16" class="${total === "?" ? "valeur" : ""}">${total}</text>`;
  for (const p of parts) {
    const l = L * p.w / somme;
    s += `<rect x="${x}" y="36" width="${l}" height="40" class="fig-part"/><text x="${x + l / 2}" y="62" class="${p.t === "?" ? "valeur" : ""}" style="font-size:${l < 46 ? 13 : 16}px">${p.t}</text>`;
    x += l;
  }
  return s + "</svg>";
}
/* Comparaison : deux barres, l'une plus longue de « ecart » */
function schemaComparaison(nom1, v1, nom2, v2, ecart, L = 240) {
  const max = Math.max(v1.w, v2.w), l1 = L * v1.w / max, l2 = L * v2.w / max, x0 = 62;
  let s = `<svg viewBox="0 0 ${x0 + L + 8} 96" width="${x0 + L + 8}" height="96" class="fig-schema barres" role="img" aria-label="Schéma de comparaison">`;
  s += `<text x="4" y="30" style="text-anchor:start;font-size:14px">${nom1}</text><rect x="${x0}" y="12" width="${l1}" height="28" class="fig-part"/><text x="${x0 + l1 / 2}" y="31" class="${v1.t === "?" ? "valeur" : ""}" style="font-size:15px">${v1.t}</text>`;
  s += `<text x="4" y="72" style="text-anchor:start;font-size:14px">${nom2}</text><rect x="${x0}" y="54" width="${l2}" height="28" class="fig-part"/><text x="${x0 + l2 / 2}" y="73" class="${v2.t === "?" ? "valeur" : ""}" style="font-size:15px">${v2.t}</text>`;
  const a = Math.min(l1, l2), b = Math.max(l1, l2), y = l1 > l2 ? 54 : 12;
  s += `<rect x="${x0 + a}" y="${y}" width="${b - a}" height="28" class="fig-part ecart"/><text x="${x0 + (a + b) / 2}" y="${y + 19}" style="font-size:13px">${ecart}</text>`;
  return s + "</svg>";
}

/* ---------- Opération posée, case par case ----------
   lignes : [{ signe, texte, saisie, fixes, trait }]
     texte  : l'écriture attendue (avec la virgule) ;
     saisie : "tout" (toute la ligne est à écrire), un Set de positions à cacher, ou rien ;
     fixes  : positions écrites d'office dans une ligne « tout » (le 0 du décalage) ;
     trait  : un trait au-dessus de la ligne.
   mode "colonne" : la virgule a sa propre colonne (addition, soustraction) ;
   mode "accrochee" : la virgule est collée au chiffre (multiplication : on aligne à droite). */
function grillePosee(lignes, { mode = "colonne", retenues = false } = {}) {
  const jetons = l => {
    if (mode === "colonne") return [...l.texte].map(c => ({ c }));
    const t = [];
    for (const c of l.texte) { if (c === ",") t[t.length - 1].virgule = true; else t.push({ c }); }
    return t;
  };
  const toutes = lignes.map(jetons);
  const W = Math.max(...toutes.map(t => t.length)) + (lignes.some(l => l.saisie === "tout") ? 1 : 0);
  const grille = el("div", { class: "pose-grille" });
  grille.style.gridTemplateColumns = `1.2em repeat(${W}, auto)`;
  const champs = [];
  let rang = 1;
  const nouveau = (ligne, col, attendu, petit = false) => {
    const i = el("input", { class: "case pose-case" + (petit ? " retenue" : ""), inputmode: "numeric", maxlength: "1", autocomplete: "off", "aria-label": petit ? "Retenue" : "Chiffre" });
    i.style.gridRow = String(ligne); i.style.gridColumn = String(col);
    i.addEventListener("input", () => {
      if (i.value.length === 1) { const k = champs.indexOf(i); const suivant = champs.slice(0, k).reverse().find(c => !c.retenue); suivant?.focus(); }
    });
    if (!petit) champs.push(Object.assign(i, { attendu }));
    grille.append(i);
    return i;
  };
  if (retenues) {
    const t0 = toutes[0], v = t0.findIndex(j => j.c === ","), colVirgule = v < 0 ? -1 : W - t0.length + v + 2;
    for (let col = 2; col < W + 1; col++) if (col !== colVirgule) nouveau(1, col, null, true);
    rang = 2;
  }
  lignes.forEach((l, k) => {
    const t = toutes[k], r = rang + k;
    if (l.signe) { const s = el("span", { class: "pose-signe" }, l.signe); s.style.gridRow = String(r); s.style.gridColumn = "1"; grille.append(s); }
    // une ligne « tout » a des cases sur toute la largeur (le nombre de chiffres n'est pas donné)
    const debut = l.saisie === "tout" ? 0 : W - t.length;
    for (let p = debut; p < W; p++) {
      const j = t[p - (W - t.length)] || { c: "" }, col = p + 2, pos = p - (W - t.length);
      const cacher = l.saisie === "tout" ? !(l.fixes?.has(pos)) && j.c !== "," : l.saisie?.has(pos);
      if (cacher) { const i = nouveau(r, col, j.c); if (j.virgule) i.classList.add("virgule"); }
      else {
        const c = el("span", { class: "pose-chiffre" + (j.virgule ? " virgule" : "") + (l.fixes?.has(pos) ? " decale" : "") }, j.c);
        c.style.gridRow = String(r); c.style.gridColumn = String(col);
        grille.append(c);
      }
    }
    if (l.trait) { const tr = el("span", { class: "pose-trait" }); tr.style.gridRow = String(r); tr.style.gridColumn = `1 / span ${W + 1}`; grille.append(tr); }
  });
  // on écrit de droite à gauche : on commence par la case la plus à droite de la première ligne à compléter
  return {
    noeud: el("div", { class: "pose" }, grille),
    champs,
    verifier() {
      if (champs.some(c => c.value === "" && /\d/.test(c.attendu))) return { etat: "incomplet", message: "Complète toutes les cases." };
      const faux = champs.filter(c => (c.value || "") !== c.attendu && !(c.attendu === "" && /^0?$/.test(c.value)));
      champs.forEach(c => c.classList.remove("mauvaise"));
      if (!faux.length) return { etat: "juste" };
      faux.forEach(c => c.classList.add("mauvaise"));
      return { etat: "faux", message: faux.length > 1 ? `${faux.length} chiffres sont faux (en rouge).` : "Un chiffre est faux (en rouge)." };
    },
    corriger() { champs.forEach(c => { c.value = c.attendu; c.classList.remove("mauvaise"); c.classList.add("bonne"); }); },
    bloquer() { grille.querySelectorAll("input").forEach(i => { i.disabled = true; }); },
    focus() { champs.slice().reverse().find(c => c.attendu !== undefined)?.focus({ preventScroll: true }); }
  };
}

/* Deux façons de poser : l'élève choisit la bonne, puis calcule dans la grille. */
function poserEnDeuxTemps(bonne, mauvaise, explication, grille) {
  const zone = el("div", { class: "pose-choix" });
  const msg = el("p", { class: "pot-message" }, "Quelle est la bonne façon de poser l'opération ? Clique dessus.");
  let fini = false, juste = null;
  const options = melanger([[bonne, true], [mauvaise, false]]).map(([html, ok]) => {
    const b = el("button", { type: "button", class: "btn pose-option" });
    b.innerHTML = html;
    b.addEventListener("click", () => {
      if (fini) return;
      if (!ok) { msg.innerHTML = explication; msg.className = "pot-message attention"; return; }
      fini = true;
      zone.replaceChildren(el("p", { class: "pot-message bien" }, "Oui ! Les virgules sont alignées. Calcule maintenant, chiffre par chiffre, en commençant par la droite."), grille.noeud);
      grille.focus();
    });
    if (ok) juste = b;
    return b;
  });
  zone.append(msg, el("div", { class: "pose-options" }, ...options));
  return { noeud: zone, pret: () => fini, montrer() { if (!fini) juste.click(); } };
}
const poseTexte = (lignes) => `<span class="pose-texte">${lignes.join("\n")}</span>`;
const aligneDroite = (t, W) => " ".repeat(Math.max(0, W - t.length)) + t;

/* ---------- Division décimale posée, étape par étape ----------
   texteA : le dividende écrit avec ses décimales (« 45,6 », « 9,00 ») ; b : un entier de 2 à 9. */
function divisionDecimale(texteA, b) {
  const [ent, decs = ""] = texteA.split(",");
  const A = ent + decs, L = A.length, c = ent.length - 1; // c : position du chiffre des unités
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
    const x = el("span", { class: "pot-case " + classe }, texte);
    x.style.gridColumn = String(col); x.style.gridRow = String(ligne);
    gauche.append(x);
    return x;
  };
  const ecrireEn = (n, fin, ligne, classe = "") => [...String(n)].map((ch, i, t) => place(ch, fin - t.length + 1 + i, ligne, classe));
  const champ = (fin, ligne, largeur) => {
    const i = el("input", { class: "case pot-champ", inputmode: "numeric", autocomplete: "off", "aria-label": "Nombre" });
    i.style.gridColumn = `${fin - largeur + 1} / span ${largeur}`; i.style.gridRow = String(ligne);
    gauche.append(i);
    i.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); ok.click(); } });
    return i;
  };
  const dire = (t, type = "") => { message.innerHTML = t; message.className = "pot-message " + type; };
  const chiffres = [...A].map((ch, i) => {
    const bt = el("button", { type: "button", class: "pot-chiffre" + (i === c && decs ? " virgule" : "") }, ch);
    bt.style.gridColumn = String(i + 2); bt.style.gridRow = "1";
    gauche.append(bt);
    return bt;
  });
  let etat = "attente", e = 0, P = 0, ligne = 1, k = 0, qTexte = "", reste = 0, actif = true, saisie = null, cases = [];
  let e0 = 0;
  while (Number(A.slice(0, e0 + 1)) < b) e0++;
  const valeurQ = () => Number(qTexte) / 10 ** (L - 1 - c);

  const commencer = () => {
    e = e0; P = Number(A.slice(0, e0 + 1));
    chiffres.forEach((x, j) => { x.disabled = true; x.classList.toggle("partiel", j <= e0); });
    cases = [...Array(L - e0)].map(() => el("span", { class: "pot-q" }));
    quotient.replaceChildren(...cases);
    etat = "attente";
  };
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
      if (e === c && decs) cases[k].classList.add("virgule");
      etapeProduit();
    } else if (etat === "produit") {
      if (x !== q * b) { dire(`Vérifie ton calcul : ${q} × ${b}.`, "attention"); return; }
      saisie.remove();
      ecrireEn(q * b, e + 2, ligne + 1, "souligne");
      etapeReste();
    } else if (etat === "reste") {
      if (x !== P - q * b) { dire(`Vérifie ta soustraction : ${nb(P)} − ${nb(q * b)}.`, "attention"); return; }
      saisie.remove();
      reste = x;
      ecrireEn(reste, e + 2, ligne + 2);
      if (e < L - 1) {
        e++; ligne += 2; k++;
        place(A[e], e + 2, ligne, "abaisse");
        chiffres[e].classList.add("abaisse-source");
        P = reste * 10 + Number(A[e]);
        const virgule = e === c + 1 ? " C'est le chiffre des dixièmes : on a écrit <strong>la virgule</strong> au quotient." : "";
        dire(`On abaisse le chiffre ${A[e]} : on obtient ${nb(P)}.${virgule}${P < b ? ` Attention : ${nb(P)} &lt; ${b}.` : ""}`, "bien");
        saisie = null; etat = "attente";
        setTimeout(() => { if (etat === "attente") etapeChiffre(); }, 1000);
      } else {
        etat = "fini"; saisie = null;
        ok.remove(); aide.remove();
        dire(reste === 0
          ? `Terminé ! Le reste est 0 : le quotient est <strong>${nb(valeurQ())}</strong>. Recopie-le, puis valide.`
          : `Le reste n'est pas 0 : on pourrait continuer en ajoutant des zéros.`, "bien");
      }
    }
  };
  ok.addEventListener("click", valider);
  aide.addEventListener("click", () => {
    if (!actif || !saisie) return;
    const q = Math.floor(P / b);
    saisie.value = etat === "chiffre" ? q : etat === "produit" ? q * b : P - q * b;
    valider();
  });
  commencer();
  dire((e0 ? `${A.slice(0, e0)} &lt; ${b} : on prend un chiffre de plus. ` : "") + `Premier dividende partiel : <strong>${nb(P)}</strong>.`, "bien");
  setTimeout(() => { if (etat === "attente" && actif) etapeChiffre(); }, 900);
  return {
    noeud,
    fini: () => etat === "fini",
    bloquer: () => { actif = false; ok.disabled = true; aide.disabled = true; },
    terminer() {
      actif = true;
      let tours = 0;
      while (etat !== "fini" && tours++ < 80) {
        if (etat === "attente") etapeChiffre();
        const q = Math.floor(P / b);
        saisie.value = etat === "chiffre" ? q : etat === "produit" ? q * b : P - q * b;
        valider();
      }
      actif = false;
    }
  };
}

/* ---------- Vocabulaire des opérations ---------- */
const VOCAB = {
  "+": { res: "la somme", ops: "un terme", mots: ["un terme", "la somme", "la différence"], phrase: (a, b) => `La somme de ${nb(a)} et ${nb(b)}` },
  "-": { res: "la différence", ops: "un terme", mots: ["un terme", "la somme", "la différence"], phrase: (a, b) => `La différence de ${nb(a)} et ${nb(b)}` },
  "×": { res: "le produit", ops: "un facteur", mots: ["un facteur", "le produit", "un terme"], phrase: (a, b) => `Le produit de ${nb(a)} par ${nb(b)}` },
  "÷": { res: "le quotient", mots: ["le dividende", "le diviseur", "le quotient"], phrase: (a, b) => `Le quotient de ${nb(a)} par ${nb(b)}` }
};
function nombresPour(op) {
  if (op === "+") return [tirer(1, 20, 1), tirer(0.5, 9, choisir([1, 2]))];
  if (op === "-") { const a = choisir([alea(5, 20), tirer(5, 20, 1)]); return [a, tirer(0.5, a - 1, choisir([1, 2]))]; }
  if (op === "×") return [choisir([0.5, 2.5, 0.25, 1.5, 0.2]), choisir([2, 4, 6, 8])];
  const b = choisir([2, 4, 5]); return [b * tirer(1, 9, 1), b];
}
function activiteVocabulaire(ops, groupe, id, titre, description) {
  return {
    groupe, id, titre, description,
    generer() {
      const op = choisir(ops), V = VOCAB[op];
      const [a, b] = nombresPour(op), r = calculer(a, op, b);
      const cas = choisir(["nom", "nom", "phrase", "calcul"]);
      const calc = `${nb(a)} ${SYMB[op]} ${nb(b)} = ${nb(r)}`;
      if (cas === "nom") {
        const k = op === "÷" ? alea(0, 2) : choisir([0, 1, 2]);
        const vise = [a, b, r][k];
        const bon = op === "÷" ? V.mots[k] : k === 2 ? V.res : V.ops;
        return {
          consigne: `Dans <strong>${calc}</strong>, le nombre <strong>${nb(vise)}</strong> est…`,
          choix: V.mots,
          verifier: (v, ch) => ({ etat: ch === bon ? "juste" : "faux" }),
          indice: op === "÷" ? "Dividende ÷ diviseur = quotient." : op === "×" ? "Facteur × facteur = produit." : `Terme ${SYMB[op]} terme = ${V.res}.`,
          correction: `Dans ${calc}, ${nb(vise)} est ${bon}.`
        };
      }
      if (cas === "phrase") return {
        consigne: "Calcule.",
        ligne: `${V.phrase(a, b)} est [d]`,
        verifier: v => verifierNombre(v[0], r),
        indice: `${V.res[0].toUpperCase() + V.res.slice(1)}, c'est le résultat d'une ${{ "+": "addition", "-": "soustraction", "×": "multiplication", "÷": "division" }[op]}.`,
        correction: `${calc}.`
      };
      const options = ["+", "-", "×", "÷"].map(o => `${nb(a)} ${SYMB[o]} ${nb(b)}`);
      return {
        consigne: `Quel calcul correspond à « ${V.phrase(a, b).replace(/^L/, "l")} » ?`,
        choix: options,
        verifier: (v, ch) => ({ etat: ch === `${nb(a)} ${SYMB[op]} ${nb(b)}` ? "juste" : "faux" }),
        indice: "Somme : addition ; différence : soustraction ; produit : multiplication ; quotient : division.",
        correction: `${V.phrase(a, b)} : ${calc}.`
      };
    }
  };
}

/* ---------- Petits problèmes pour choisir l'opération ---------- */
const PROBLEMES_OP = {
  tout: [
    () => { const a = tirer(8, 25, 2), b = tirer(1, 6, 2); return { t: `Un livre coûte ${euros(a)} et un stylo ${euros(b)}. Combien paie-t-on en tout ?`, a, b, u: "€" }; },
    () => { const a = tirer(3, 9, 1), b = tirer(2, 8, 2); return { t: `Le matin, Léa parcourt ${nb(a)} km à vélo, l'après-midi ${nb(b)} km. Quelle distance a-t-elle parcourue en tout ?`, a, b, u: "km" }; },
    () => { const a = tirer(0.5, 2, 2), b = tirer(0.2, 1, 2); return { t: `Dans un panier, il y a ${nb(a)} kg de pommes et ${nb(b)} kg de raisin. Quelle est la masse de fruits ?`, a, b, u: "kg" }; }
  ],
  partie: [
    () => { const a = tirer(2.5, 6, 1), b = tirer(0.5, 2, 2); return { t: `On coupe ${nb(b)} m dans un ruban de ${nb(a)} m. Quelle longueur de ruban reste-t-il ?`, a, b, u: "m" }; },
    () => { const a = tirer(10, 18, 1), b = tirer(4, 9, 2); return { t: `Une randonnée fait ${nb(a)} km. Aya a déjà parcouru ${nb(b)} km. Quelle distance lui reste-t-il ?`, a, b, u: "km" }; },
    () => { const a = choisir([10, 20, 50]), b = tirer(2, 9, 2); return { t: `Hugo paie ${euros(b)} avec un billet de ${a} €. Combien lui rend-on ?`, a, b, u: "€" }; }
  ],
  fois: [
    () => { const a = tirer(1.1, 2.5, 2), n = alea(3, 9); return { t: `Un ticket de bus coûte ${euros(a)}. Quel est le prix de ${n} tickets ?`, a, b: n, u: "€" }; },
    () => { const a = tirer(1.5, 4, 1), n = alea(3, 8); return { t: `Un sac de pommes de terre pèse ${nb(a)} kg. Combien pèsent ${n} sacs ?`, a, b: n, u: "kg" }; },
    () => { const a = tirer(0.25, 1.5, 2), n = alea(4, 9); return { t: `Un morceau de ficelle mesure ${nb(a)} m. Quelle longueur font ${n} morceaux ?`, a, b: n, u: "m" }; }
  ],
  partage: [
    () => { const n = alea(3, 6), p = tirer(1.2, 3.5, 2); return { t: `${n} cahiers identiques coûtent ${euros(n * p)}. Quel est le prix d'un cahier ?`, a: rr(n * p), b: n, u: "€" }; },
    () => { const n = alea(3, 8), p = tirer(0.5, 2, 2); return { t: `Un rouleau de ${nb(n * p)} m de tissu est coupé en ${n} morceaux de même longueur. Quelle est la longueur d'un morceau ?`, a: rr(n * p), b: n, u: "m" }; },
    () => { const n = alea(2, 5), p = tirer(0.15, 0.5, 2); return { t: `On partage ${nb(n * p)} L de sirop équitablement dans ${n} verres. Combien de litres dans chaque verre ?`, a: rr(n * p), b: n, u: "L" }; }
  ]
};
const OP_DU_TYPE = { tout: "+", partie: "-", fois: "×", partage: "÷" };
function schemaDuType(type, a, b) {
  const n = Number.isInteger(b) && b <= 9 ? b : 3; // parts égales : b parts si b est un petit entier
  if (type === "tout") return schema([{ t: nb(a), w: Math.max(a, b * 0.6) }, { t: nb(b), w: Math.max(b, a * 0.35) }], "?");
  if (type === "partie") return schema([{ t: nb(b), w: Math.max(b, a * 0.3) }, { t: "?", w: Math.max(Math.abs(a - b), a * 0.3) }], nb(a));
  if (type === "fois") return schema([...Array(n)].map(() => ({ t: nb(a), w: 1 })), "?");
  return schema([...Array(n)].map(() => ({ t: "?", w: 1 })), nb(a));
}

/* Des situations avec un nombre décimal a et un entier n, pour les quatre opérations */
const CONTEXTES = [
  { "+": (a, n) => `Un ruban mesure ${nb(a)} m. On y coud un autre ruban de ${n} m. Quelle est la longueur totale ?`,
    "-": (a, n) => `Un ruban mesure ${nb(a)} m. On en coupe ${n} m. Quelle longueur reste-t-il ?`,
    "×": (a, n) => `On achète ${n} rubans de ${nb(a)} m chacun. Quelle longueur de ruban a-t-on ?`,
    "÷": (a, n) => `Un ruban de ${nb(a)} m est coupé en ${n} morceaux de même longueur. Quelle est la longueur d'un morceau ?` },
  { "+": (a, n) => `Un jeu coûte ${euros(a)}. Un livre coûte ${n} € de plus. Quel est le prix du livre ?`,
    "-": (a, n) => `Inès a ${euros(a)}. Elle dépense ${n} €. Combien lui reste-t-il ?`,
    "×": (a, n) => `Une place de cinéma coûte ${euros(a)}. Combien coûtent ${n} places ?`,
    "÷": (a, n) => `${n} amis se partagent équitablement ${euros(a)}. Combien reçoit chacun ?` },
  { "+": (a, n) => `Un colis pèse ${nb(a)} kg. On y ajoute un objet de ${n} kg. Combien pèse le colis ?`,
    "-": (a, n) => `Un sac contient ${nb(a)} kg de farine. On en utilise ${n} kg. Quelle masse reste-t-il ?`,
    "×": (a, n) => `Une boîte pèse ${nb(a)} kg. Combien pèsent ${n} boîtes identiques ?`,
    "÷": (a, n) => `On répartit ${nb(a)} kg de bonbons dans ${n} sachets identiques. Combien pèse un sachet ?` }
];
function nombresContexte() {
  const n = alea(2, 6), q = tirer(1.2, 6, choisir([1, 2]));
  return { a: rr(n * q), n };
}

/* ---------- Problèmes à étapes ---------- */
const PROBLEMES_ETAPES = [
  () => {
    const [V, c] = choisir([[1.5, 20], [2, 25], [1.2, 25], [0.75, 20], [1.5, 25], [1.8, 40]]);
    const cl = rr(V * 100), n = rr(cl / c);
    return { enonce: `On verse ${nb(V)} L de jus d'orange dans des verres de ${c} cL.`, etapes: [
      { q: `Convertis ${nb(V)} L en centilitres.`, r: cl, unite: "cL", c: `${nb(V)} L = ${nb(cl)} cL` },
      { q: "Calcule le nombre de verres (le résultat peut être décimal).", r: n, unite: "verres", c: `${nb(cl)} ÷ ${c} = ${nb(n)}` },
      { q: "Combien de verres peut-on remplir complètement ?", r: Math.floor(n), unite: "verres", c: `${Math.floor(n)} verres pleins` }],
      indice: "1 L = 100 cL." };
  },
  () => {
    const p = choisir([0.75, 0.5, 0.6, 0.8, 1.25]), k = alea(5, 9), L = rr(p * k + choisir([2, 3, 4.5, 5]));
    const reste = rr(L - p * k), max = Math.floor(rr(reste / p));
    return { enonce: `Un fleuriste a ${nb(L)} m de ruban. Il utilise ${nb(p)} m de ruban par bouquet et il a déjà fait ${k} bouquets.`, etapes: [
      { q: "Quelle longueur de ruban a-t-il utilisée ?", r: rr(p * k), unite: "m", c: `${k} × ${nb(p)} = ${nb(p * k)} m` },
      { q: "Quelle longueur de ruban lui reste-t-il ?", r: reste, unite: "m", c: `${nb(L)} − ${nb(p * k)} = ${nb(reste)} m` },
      { q: "Combien de bouquets peut-il encore faire, au maximum ?", r: max, unite: "bouquets", c: `${max} bouquets : ${max} × ${nb(p)} = ${nb(max * p)} m, mais ${max + 1} bouquets demanderaient ${nb((max + 1) * p)} m` }],
      indice: "Calcule d'abord ce qu'il a utilisé." };
  },
  () => {
    const L = tirer(8, 15, 1), l = tirer(4, 7.9, 1), prix = choisir([2.5, 3, 3.2, 4, 1.5]);
    const per = rr(2 * (L + l));
    return { enonce: `Un jardin rectangulaire mesure ${nb(L)} m de long et ${nb(l)} m de large. On veut l'entourer d'un grillage vendu ${euros(prix)} le mètre.`, etapes: [
      { q: "Quelle longueur de grillage faut-il ?", r: per, unite: "m", c: `2 × (${nb(L)} + ${nb(l)}) = ${nb(per)} m` },
      { q: "Combien va-t-on payer ?", r: rr(per * prix), unite: "€", c: `${nb(per)} × ${nb(prix)} = ${nb(per * prix)} €` }],
      indice: "Le grillage fait le tour du jardin : c'est son périmètre." };
  },
  () => {
    const n = choisir([20, 24, 25, 30]), x = alea(8, 15), e = choisir([4.5, 3.5, 5, 2.5, 6.5]);
    const total = rr(n * x + n * e);
    return { enonce: `Pour une sortie, une classe de ${n} élèves loue un car à ${nb(n * x)} € et paie ${euros(e)} d'entrée par élève.`, etapes: [
      { q: "Quel est le prix total des entrées ?", r: rr(n * e), unite: "€", c: `${n} × ${nb(e)} = ${nb(n * e)} €` },
      { q: "Quel est le prix total de la sortie ?", r: total, unite: "€", c: `${nb(n * x)} + ${nb(n * e)} = ${nb(total)} €` },
      { q: "Ce prix est partagé équitablement entre les élèves. Combien paie chacun ?", r: rr(total / n), unite: "€", c: `${nb(total)} ÷ ${n} = ${nb(total / n)} €` }],
      indice: "Les entrées : un prix par élève. Le car : un seul prix pour toute la classe." };
  },
  () => {
    const p = choisir([1.64, 1.75, 1.82, 1.9, 1.58]), V = choisir([20, 25, 30, 40]), W = choisir([10, 50, 60]);
    return { enonce: `Léa a payé ${euros(p * V)} pour ${V} L d'essence.`, etapes: [
      { q: "Quel est le prix d'un litre d'essence ?", r: p, unite: "€", c: `${nb(p * V)} ÷ ${V} = ${nb(p)} €` },
      { q: `Combien paierait-elle pour ${W} L ?`, r: rr(p * W), unite: "€", c: `${W} × ${nb(p)} = ${nb(p * W)} €` }],
      indice: "Cherche d'abord le prix pour 1 L." };
  },
  () => {
    const m = choisir([0.6, 0.8, 1.2, 0.4]), n = 4, k = choisir([6, 10, 2, 5]);
    return { enonce: `Pour une recette, il faut ${nb(m)} kg de farine pour ${n} personnes.`, etapes: [
      { q: "Quelle masse de farine faut-il pour 1 personne ?", r: rr(m / n), unite: "kg", c: `${nb(m)} ÷ ${n} = ${nb(m / n)} kg` },
      { q: `Quelle masse de farine faut-il pour ${k} personnes ?`, r: rr(m / n * k), unite: "kg", c: `${k} × ${nb(m / n)} = ${nb(m / n * k)} kg` }],
      indice: "Calcule d'abord la masse pour 1 personne." };
  }
];

/* Carré magique (3 × 3) : le carré de Lo Shu, transformé en x → a + (x − 1) × d */
const LO_SHU = [[8, 1, 6], [3, 5, 7], [4, 9, 2]];

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  activiteVocabulaire(["+", "-"], F1, "vocabulaire-addition", "Terme, somme, différence", "Le vocabulaire de l'addition et de la soustraction."),

  {
    groupe: F1,
    id: "calcul-mental-addition",
    titre: "Calcul mental : additions et soustractions",
    description: "Des calculs à faire de tête, avec des dixièmes et des centièmes.",
    generer() {
      const cas = choisir(["dixiemes", "retenue", "entier", "soustraire", "centiemes"]);
      let a, b, op;
      if (cas === "dixiemes") { a = tirer(1, 9, 1); b = rr(alea(1, 9 - Math.round((a % 1) * 10)) / 10 + alea(1, 5)); op = "+"; }
      else if (cas === "retenue") { a = tirer(1, 9, 1); if (egal(a % 1, 0)) a = rr(a + 0.3); b = rr(1 - (a % 1) + alea(0, 4)); op = "+"; }
      else if (cas === "entier") { a = choisir([10, 5, 20, 8, 12]); b = tirer(1, a - 1, 1); op = "-"; }
      else if (cas === "soustraire") { b = tirer(1, 4, 1); a = rr(b + tirer(1, 5, 1)); op = "-"; }
      else { a = tirer(0.1, 3, 2); b = rr(Math.ceil(a) - a + alea(0, 2)); if (egal(b, 0)) b = 1; op = "+"; }
      const r = calculer(a, op, b);
      return {
        consigne: "Calcule de tête.",
        ligne: `${nb(a)} ${SYMB[op]} ${nb(b)} = [d]`,
        verifier: v => verifierNombre(v[0], r),
        indice: "Calcule séparément les unités, les dixièmes et les centièmes. 10 dixièmes font 1 unité.",
        correction: `${nb(a)} ${SYMB[op]} ${nb(b)} = ${nb(r)}.`
      };
    }
  },

  {
    groupe: F1,
    id: "completer",
    titre: "Compléter pour atteindre un nombre rond",
    description: "Les compléments à l'unité, à 10 ou à 100.",
    generer() {
      const cible = choisir([1, 1, 10, 10, 100, "suivant"]);
      let a, c;
      if (cible === "suivant") { a = tirer(2, 30, choisir([1, 2])); if (Number.isInteger(a)) a = rr(a + 0.4); c = Math.ceil(a); }
      else { c = cible; a = tirer(c / 100, c * 0.95, c === 1 ? 2 : choisir([1, 2])); if (Number.isInteger(a)) a = rr(a + 0.25); }
      const r = rr(c - a);
      return {
        consigne: "Complète.",
        ligne: `${nb(a)} + [d] = ${nb(c)}`,
        verifier: v => verifierNombre(v[0], r),
        indice: "Complète d'abord jusqu'au dixième suivant, puis jusqu'à l'unité, puis jusqu'au nombre visé.",
        correction: `${nb(a)} + ${nb(r)} = ${nb(c)}.`
      };
    }
  },

  {
    groupe: F1,
    id: "poser-addition",
    titre: "Poser une addition ou une soustraction",
    description: "Aligner les virgules, puis calculer chiffre par chiffre.",
    generer() {
      const op = choisir(["+", "+", "-"]);
      let a, b;
      do {
        a = op === "+" ? tirer(2, 99, choisir([1, 2])) : choisir([alea(10, 99), tirer(10, 99, 1)]);
        b = op === "+" ? tirer(0.5, 50, choisir([1, 2, 3])) : tirer(1, a - 1, choisir([1, 2]));
      } while (nbDec(a) === nbDec(b) || Number.isInteger(a) && Number.isInteger(b));
      const r = calculer(a, op, b), D = Math.max(nbDec(a), nbDec(b));
      const ta = fixe(a, D), tb = fixe(b, D), trs = fixe(r, D);
      const W = Math.max(ta.length, tb.length) + 1;
      const bonne = poseTexte([aligneDroite(ta, W), SYMB[op] + aligneDroite(tb, W - 1)]);
      const mauvaise = poseTexte([aligneDroite(String(nb(a)), W), SYMB[op] + aligneDroite(String(nb(b)), W - 1)]);
      const g = grillePosee([{ texte: ta }, { signe: SYMB[op], texte: tb }, { texte: trs, saisie: "tout", trait: true }], { retenues: true });
      const deux = poserEnDeuxTemps(bonne, mauvaise, "Non : ici, les chiffres sont alignés à droite, mais pas les virgules ! On aligne les virgules (et on peut compléter avec des zéros).", g);
      return {
        consigne: `Pose et calcule : <strong>${nb(a)} ${SYMB[op]} ${nb(b)}</strong>.`,
        figure: deux.noeud,
        verifier() {
          if (!deux.pret()) return { etat: "incomplet", message: "Choisis d'abord la bonne façon de poser l'opération." };
          return g.verifier();
        },
        indice: "Unités sous les unités, virgule sous la virgule. On commence par la droite, sans oublier les retenues (les petites cases du haut).",
        correction: `${nb(a)} ${SYMB[op]} ${nb(b)} = ${nb(r)}.`,
        surCorrection() { deux.montrer(); g.corriger(); },
        bloquer: g.bloquer
      };
    }
  },

  {
    groupe: F1,
    id: "calcul-astucieux",
    titre: "Calculer astucieusement",
    description: "Regrouper des termes qui font un nombre entier.",
    generer() {
      const paire = () => { const x = tirer(0.1, 9, choisir([1, 1, 2])); const n = Math.ceil(x) + alea(0, 4); return [x, rr(n - x)].map(rr); };
      const p1 = paire();
      const quatre = Math.random() < 0.5;
      let autres = quatre ? paire() : [tirer(1, 9, 1)];
      if (!quatre && egal(autres[0] % 1 + p1[0] % 1, 1)) autres = [rr(autres[0] + 0.1)];
      const termes = melanger([...p1, ...autres]);
      const total = rr(termes.reduce((s, x) => s + x, 0));
      const sel = selection(termes.map(nb));
      return {
        consigne: `Calcule astucieusement : <strong>${termes.map(nb).join(" + ")}</strong>.<br>Clique sur <strong>deux termes</strong> dont la somme est un nombre entier, puis écris le résultat.`,
        figure: sel.noeud,
        ligne: "Résultat : [d]",
        verifier(v) {
          if (sel.choisies.size !== 2) return { etat: "incomplet", message: "Sélectionne exactement deux termes." };
          const [i, j] = [...sel.choisies], s = rr(termes[i] + termes[j]);
          if (!Number.isInteger(s)) return { etat: "faux", message: `${nb(termes[i])} + ${nb(termes[j])} = ${nb(s)} : ce n'est pas un nombre entier. Regarde les chiffres après la virgule.` };
          return verifierNombre(v[0], total);
        },
        indice: "Cherche deux nombres dont les parties décimales se complètent : 0,3 et 0,7 ; 0,25 et 0,75…",
        correction: `(${nb(p1[0])} + ${nb(p1[1])})${quatre ? ` + (${nb(autres[0])} + ${nb(autres[1])})` : ` + ${nb(autres[0])}`} = ${nb(p1[0] + p1[1])} + ${quatre ? nb(autres[0] + autres[1]) : nb(autres[0])} = ${nb(total)}.`,
        surCorrection() { sel.boutons.forEach((b, i) => b.classList.toggle("bonne", p1.includes(termes[i]))); },
        bloquer: sel.bloquer
      };
    }
  },

  /* ================= Feuille 2 ================= */

  activiteVocabulaire(["×"], F2, "vocabulaire-multiplication", "Facteur, produit", "Le vocabulaire de la multiplication."),

  {
    groupe: F2,
    id: "fois-10",
    titre: "Multiplier par 10, 100, 1 000 ou par 0,1 ; 0,01 ; 0,001",
    description: "Les chiffres glissent dans le tableau de numération.",
    generer() {
      const grand = Math.random() < 0.5, k = alea(1, 3), f = grand ? 10 ** k : rr(10 ** -k);
      const x = choisir([tirer(1, 99, 2), tirer(0.1, 9, 3), alea(2, 999), tirer(10, 500, 1)]);
      const r = rr(x * f), trou = Math.random() < 0.3;
      return {
        consigne: trou ? "Complète." : "Calcule.",
        ligne: trou ? `[d] × ${nb(f)} = ${nb(r)}` : `${nb(x)} × ${nb(f)} = [d]`,
        verifier: v => {
          const res = verifierNombre(v[0], trou ? x : r);
          if (res.etat === "faux" && !trou) {
            const y = lireNombre(v[0]);
            if (egal(y, rr(x / f))) res.message = grand ? `Multiplier par ${nb(f)}, c'est rendre le nombre ${nb(f)} fois plus grand.` : `Multiplier par ${nb(f)}, c'est diviser par ${nb(1 / f)} : le nombre devient plus petit.`;
          }
          return res;
        },
        indice: grand ? `× ${nb(f)} : chaque chiffre prend une valeur ${nb(f)} fois plus grande (il glisse de ${k} rang${k > 1 ? "s" : ""} vers la gauche).`
          : `× ${nb(f)}, c'est ÷ ${nb(1 / f)} : chaque chiffre glisse de ${k} rang${k > 1 ? "s" : ""} vers la droite.`,
        correction: `${nb(x)} × ${nb(f)} = ${nb(r)}.`
      };
    }
  },

  {
    groupe: F2,
    id: "plus-grand-plus-petit",
    titre: "Plus grand ou plus petit ? (sans calculer)",
    description: "Multiplier par un nombre plus petit que 1 fait diminuer.",
    generer() {
      const a = choisir([tirer(2, 50, 1), alea(3, 90)]);
      const b = choisir([tirer(0.1, 0.9, choisir([1, 2])), tirer(1.1, 3, 1), 1, tirer(0.5, 0.99, 2)]);
      const signe = b < 1 ? "<" : b > 1 ? ">" : "=";
      return {
        consigne: "Sans calculer, complète par &lt;, = ou &gt;.",
        ligne: `${nb(a)} × ${nb(b)} [c] ${nb(a)}`,
        choix: ["<", "=", ">"],
        verifier: (v, c) => ({ etat: c === signe ? "juste" : "faux" }),
        indice: "Compare le deuxième facteur à 1 : multiplier par un nombre plus petit que 1, c'est prendre une partie du nombre.",
        correction: `${nb(b)} ${b < 1 ? "&lt;" : b > 1 ? "&gt;" : "="} 1, donc ${nb(a)} × ${nb(b)} ${signe === "<" ? "&lt;" : signe === ">" ? "&gt;" : "="} ${nb(a)}.`
      };
    }
  },

  {
    groupe: F2,
    id: "produit-connu",
    titre: "Déduire d'un produit connu",
    description: "Trouver des produits décimaux sans poser l'opération.",
    generer() {
      let p, q;
      do { p = alea(12, 99); q = alea(12, 99); } while (p % 10 === 0 || q % 10 === 0);
      const N = p * q;
      const variantes = melanger([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [2, 0], [0, 2]]).slice(0, 2);
      const calc = ([i, j]) => [rr(p / 10 ** i), rr(q / 10 ** j), rr(N / 10 ** (i + j))];
      const [c1, c2] = variantes.map(calc);
      return {
        consigne: `On sait que <strong>${p} × ${q} = ${nb(N)}</strong>. Sans poser, complète.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p class="rep">${nb(c1[0])} × ${nb(c1[1])} = [d]</p></div><div class="etape-pb"><p class="rep">${nb(c2[0])} × ${nb(c2[1])} = [d]</p></div>`,
        verifier(v) {
          const r = [verifierNombre(v[0], c1[2]), verifierNombre(v[1], c2[2])];
          if (r.some(x => x.etat === "incomplet")) return { etat: "incomplet", message: "Complète les deux calculs." };
          return r.every(x => x.etat === "juste") ? { etat: "juste" } : { etat: "faux", message: "Compte les chiffres après la virgule dans les deux facteurs." };
        },
        indice: "Les chiffres du produit sont ceux de " + nb(N) + ". Le produit a autant de chiffres après la virgule que les deux facteurs réunis.",
        correction: [c1, c2].map(c => `${nb(c[0])} × ${nb(c[1])} = ${nb(c[2])}`).join(" ; ") + "."
      };
    }
  },

  {
    groupe: F2,
    id: "placer-virgule",
    titre: "Placer la virgule dans le produit",
    description: "Les chiffres du produit sont donnés : où va la virgule ?",
    generer() {
      let a, b, P;
      do { a = tirer(1.1, 30, choisir([1, 2])); b = tirer(1.1, 9.9, 1); P = Math.round(a * b * 10 ** (nbDec(a) + nbDec(b))); }
      while (P % 10 === 0 || Number.isInteger(a) || Number.isInteger(b) || String(P).length <= nbDec(a) + nbDec(b));
      const chiffres = String(P), d = nbDec(a) + nbDec(b), bonne = chiffres.length - d;
      let pos = null, actif = true;
      const zone = el("div", { class: "virgule-zone" });
      const dessiner = () => {
        zone.replaceChildren();
        [...chiffres].forEach((c, i) => {
          if (i > 0) {
            const g = el("button", { type: "button", class: "virgule-trou" + (pos === i ? " choisi" : ""), "aria-label": `Virgule après le chiffre ${i}` }, pos === i ? "," : "");
            g.addEventListener("click", () => { if (actif) { pos = i; dessiner(); } });
            zone.append(g);
          }
          zone.append(el("span", { class: "virgule-chiffre" }, c));
        });
      };
      dessiner();
      return {
        consigne: `${nb(a)} × ${nb(b)} : les chiffres du produit sont ${chiffres}. Clique entre deux chiffres pour placer la virgule.`,
        figure: zone,
        verifier() {
          if (pos === null) return { etat: "incomplet", message: "Clique entre deux chiffres pour placer la virgule." };
          return pos === bonne ? { etat: "juste" } : { etat: "faux", message: `Fais un ordre de grandeur : ${nb(a)} × ${nb(b)}, c'est environ ${nb(Math.round(a) * Math.round(b))}.` };
        },
        indice: `${nb(a)} a ${nbDec(a)} chiffre${nbDec(a) > 1 ? "s" : ""} après la virgule, ${nb(b)} en a ${nbDec(b)} : le produit en a ${d}.`,
        correction: `${nb(a)} × ${nb(b)} = ${nb(a * b)} (${d} chiffres après la virgule ; ordre de grandeur : ${nb(Math.round(a))} × ${nb(Math.round(b))} = ${nb(Math.round(a) * Math.round(b))}).`,
        surCorrection() { pos = bonne; dessiner(); },
        bloquer: () => { actif = false; zone.querySelectorAll("button").forEach(b => { b.disabled = true; }); }
      };
    }
  },

  {
    groupe: F2,
    id: "poser-multiplication",
    titre: "Poser une multiplication",
    description: "Un ordre de grandeur, la multiplication posée, puis la virgule.",
    generer() {
      let a, b;
      do { a = tirer(1.2, choisir([9.9, 30]), choisir([1, 1, 2])); b = tirer(1.2, 9.8, 1); }
      while (Number.isInteger(a) || Math.round(b * 10) % 10 === 0 || Math.round(a * 10 ** nbDec(a)) % 10 === 0);
      const A = Math.round(a * 10 ** nbDec(a)), u = Math.round(b * 10) % 10, t = Math.floor(b);
      const r = rr(a * b), d = nbDec(a) + 1;
      const og = Math.round(a) * Math.round(b);
      const ogs = melanger([og, og * 10, rr(og / 10)]);
      const fin = el("input", { class: "case large", inputmode: "decimal", autocomplete: "off", "aria-label": "Produit" });
      const g = grillePosee([
        { texte: fixe(a, nbDec(a)) },
        { signe: "×", texte: fixe(b, 1) },
        { texte: String(A * u), saisie: "tout", trait: true },
        { signe: "+", texte: String(A * t) + "0", saisie: "tout", fixes: new Set([String(A * t).length]) },
        { texte: String(A * (10 * t + u)), saisie: "tout", trait: true }
      ], { mode: "accrochee" });
      return {
        consigne: `On veut calculer <strong>${nb(a)} × ${nb(b)}</strong>. Donne d'abord un ordre de grandeur, puis pose la multiplication sans t'occuper des virgules, et place la virgule à la fin.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Un ordre de grandeur du produit :</p>[s]</div>`,
        listes: [ogs.map(nb)],
        apresLigne: el("div", { class: "pose-pile" }, el("p", { class: "pose-titre" }, "2. Pose la multiplication sans les virgules :"), g.noeud,
          el("p", { class: "pose-titre" }, "3. Place la virgule :"), el("p", { class: "pose-fin" }, `${nb(a)} × ${nb(b)} = `, fin)),
        verifier(v) {
          if (v[0] == null) return { etat: "incomplet", message: "Choisis un ordre de grandeur." };
          if (!egal(ogs[v[0]], og)) return { etat: "faux", message: `Arrondis chaque facteur à l'unité : ${nb(Math.round(a))} × ${nb(Math.round(b))}.` };
          const res = g.verifier();
          if (res.etat !== "juste") return res;
          const x = lireNombre(fin.value);
          if (isNaN(x)) return { etat: "incomplet", message: "Écris le produit, avec sa virgule, sous la multiplication." };
          return egal(x, r) ? { etat: "juste" } : { etat: "faux", message: `Le produit a ${d} chiffres après la virgule. Compare-le à ton ordre de grandeur.` };
        },
        indice: `On multiplie ${A} par ${Math.round(b * 10)} comme des entiers, puis on place la virgule : ${d} chiffres après la virgule.`,
        correction: `${A} × ${Math.round(b * 10)} = ${nb(A * Math.round(b * 10))}, donc ${nb(a)} × ${nb(b)} = ${nb(r)} (ordre de grandeur : ${nb(og)}).`,
        surCorrection() { g.corriger(); fin.value = nb(r); },
        bloquer() { g.bloquer(); fin.disabled = true; }
      };
    }
  },

  /* ================= Feuille 3 ================= */

  activiteVocabulaire(["÷"], F3, "vocabulaire-division", "Dividende, diviseur, quotient", "Le vocabulaire de la division."),

  {
    groupe: F3,
    id: "division-mentale",
    titre: "Diviser de tête",
    description: "Des partages simples, et les divisions par 10, 100, 1 000.",
    generer() {
      const cas = choisir(["chiffres", "chiffres", "entier", "puissance"]);
      let a, b;
      if (cas === "chiffres") {
        // chaque chiffre du dividende est un multiple du diviseur : 8,46 ÷ 2
        b = alea(2, 4);
        const m = [...Array(Math.floor(9 / b) + 1).keys()].map(i => i * b), nonNul = m.filter(x => x > 0);
        a = rr(choisir(nonNul) + choisir(nonNul) / 10 + (Math.random() < 0.35 ? choisir(m) / 100 : 0));
      }
      else if (cas === "entier") { [a, b] = choisir([[9, 4], [7, 2], [3, 5], [1, 4], [3, 4], [11, 2], [13, 4], [2, 5], [7, 5], [1, 8], [5, 8], [6, 4]]); }
      else { b = choisir([10, 100, 1000]); a = choisir([tirer(1, 99, 1), alea(2, 900), tirer(0.5, 9, 2)]); }
      const r = rr(a / b);
      return {
        consigne: "Calcule de tête.",
        ligne: `${nb(a)} ÷ ${nb(b)} = [d]`,
        verifier: v => verifierNombre(v[0], r),
        indice: cas === "puissance" ? `Diviser par ${nb(b)} : chaque chiffre glisse de ${String(b).length - 1} rang${b > 10 ? "s" : ""} vers la droite.`
          : cas === "entier" ? `Pense à ${nb(a)} unités = ${nb(a * 10)} dixièmes = ${nb(a * 100)} centièmes.` : "Partage les unités, puis les dixièmes, puis les centièmes.",
        correction: `${nb(a)} ÷ ${nb(b)} = ${nb(r)} (on vérifie : ${nb(r)} × ${nb(b)} = ${nb(a)}).`
      };
    }
  },

  {
    groupe: F3,
    id: "division-posee",
    titre: "Poser une division décimale",
    description: "La division posée étape par étape, avec la virgule au quotient.",
    generer() {
      const b = alea(2, 9);
      let q, a, d;
      do {
        d = choisir([1, 1, 2]);
        q = rr(alea(1, 9) * (Math.random() < 0.5 ? 10 : 1) + alea(1, 99) / 10 ** d);
        if (Math.random() < 0.25) q = rr(Math.floor(q) + alea(1, 9) / 100); // un 0 au quotient (7,06)
        a = rr(b * q);
      } while (Math.floor(a) < b || nbDec(q) === 0 || String(Math.round(a * 10 ** nbDec(q))).length > 5);
      const texte = fixe(a, nbDec(q)); // on écrit les zéros nécessaires
      const w = divisionDecimale(texte, b);
      return {
        consigne: `Pose et effectue la division <strong>${texte} ÷ ${b}</strong>, étape par étape.${texte !== nb(a) ? ` (On a écrit ${nb(a)} = ${texte} pour pouvoir continuer.)` : ""}`,
        figure: w.noeud,
        ligne: `${texte} ÷ ${b} = [d]`,
        verifier(v) {
          if (!w.fini()) return { etat: "incomplet", message: "Termine d'abord la division, étape par étape (bouton OK sous la division)." };
          return verifierNombre(v[0], q);
        },
        indice: "Quand on abaisse le chiffre des dixièmes, on écrit la virgule au quotient. On vérifie : quotient × diviseur = dividende.",
        correction: `${texte} ÷ ${b} = ${nb(q)} (vérification : ${nb(q)} × ${b} = ${nb(a)}).`,
        surCorrection: () => w.terminer(),
        bloquer: w.bloquer
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "ordre-grandeur",
    titre: "Le bon ordre de grandeur",
    description: "Arrondir les nombres à une valeur simple pour estimer un résultat.",
    generer() {
      const op = choisir(["×", "×", "÷", "+", "-"]);
      let a, b, est, calc;
      if (op === "×") { const A = choisir([20, 30, 40, 50, 60, 80, 100, 200]), B = alea(2, 9); a = rr(A + tirer(-A * 0.08, A * 0.08, 1)); b = rr(B + tirer(-0.2, 0.2, 1)); est = A * B; calc = `${A} × ${B}`; }
      else if (op === "÷") { const B = alea(2, 9), Q = choisir([5, 10, 20, 30, 50]); a = rr(B * Q + tirer(-1.5, 1.5, 1)); b = rr(B + tirer(-0.15, 0.15, 2)); est = Q; calc = `${B * Q} ÷ ${B}`; }
      else { const A = choisir([500, 600, 700, 900]), B = choisir([100, 200, 300]); a = rr(A + tirer(-8, 8, 1)); b = rr(B + tirer(-8, 8, 2)); est = op === "+" ? A + B : A - B; calc = `${A} ${SYMB[op]} ${B}`; }
      const options = melanger([est, est * 10, rr(est / 10)]);
      return {
        consigne: `Quel est l'ordre de grandeur de <strong>${nb(a)} ${SYMB[op]} ${nb(b)}</strong> ?`,
        choix: options.map(nb),
        verifier: (v, c) => ({ etat: c === nb(est) ? "juste" : "faux" }),
        indice: "Remplace chaque nombre par un nombre proche et simple, puis calcule de tête.",
        correction: `${calc} = ${nb(est)}, donc ${nb(a)} ${SYMB[op]} ${nb(b)} ≈ ${nb(est)}.`
      };
    }
  },

  {
    groupe: F4,
    id: "bon-resultat",
    titre: "Sans poser, le bon résultat",
    description: "Ordre de grandeur, dernier chiffre, nombre de décimales.",
    generer() {
      let a, b;
      do { a = tirer(1.1, 60, 1); b = tirer(1.1, 9.9, 1); } while (Number.isInteger(a) || Number.isInteger(b) || Math.round(a * b * 100) % 10 === 0);
      const r = rr(a * b), autreChiffre = rr(r + choisir([0.03, -0.02, 0.05]));
      const options = melanger([r, rr(r * 10), rr(r / 10), autreChiffre]);
      return {
        consigne: `Sans poser l'opération, trouve le bon résultat : <strong>${nb(a)} × ${nb(b)}</strong>.`,
        choix: options.map(nb),
        verifier: (v, c) => ({ etat: c === nb(r) ? "juste" : "faux", message: c === nb(autreChiffre) ? `Regarde le dernier chiffre : ${String(Math.round(a * 10) % 10)} × ${String(Math.round(b * 10) % 10)} se termine par ${(Math.round(a * 10) % 10) * (Math.round(b * 10) % 10) % 10}.` : `Ordre de grandeur : ${Math.round(a)} × ${Math.round(b)} = ${Math.round(a) * Math.round(b)}.` }),
        indice: "Fais un ordre de grandeur, puis regarde le dernier chiffre et le nombre de chiffres après la virgule.",
        correction: `${nb(a)} × ${nb(b)} = ${nb(r)} : l'ordre de grandeur est ${Math.round(a) * Math.round(b)}, et le produit a 2 chiffres après la virgule.`
      };
    }
  },

  /* ================= Feuille 5 ================= */

  {
    groupe: F5,
    id: "quel-schema",
    titre: "Quel schéma pour ce problème ?",
    description: "Choisir le schéma en barres, l'opération, puis calculer.",
    generer() {
      const type = choisir(Object.keys(PROBLEMES_OP));
      const P = choisir(PROBLEMES_OP[type])();
      const autres = melanger(Object.keys(PROBLEMES_OP).filter(t => t !== type)).slice(0, 2);
      const types = melanger([type, ...autres]);
      const op = OP_DU_TYPE[type], r = calculer(P.a, op, P.b);
      return {
        consigne: P.t,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Quel schéma représente le problème ?</p>[s]</div><div class="etape-pb"><p>2. Quelle opération ?</p>[s]</div><div class="etape-pb"><p>3. Calcule.</p><p class="rep">[d] ${P.u}</p></div>`,
        listes: [types.map(t => schemaDuType(t, P.a, P.b)), ["+", "−", "×", "÷"]],
        verifier(v) {
          if (v[0] == null || v[1] == null || isNaN(lireNombre(v[2]))) return { etat: "incomplet", message: "Réponds aux trois questions." };
          if (types[v[0]] !== type) return { etat: "faux", message: "Ce n'est pas le bon schéma. Qu'est-ce qu'on cherche : le tout, une partie, ou une part égale ?" };
          if (["+", "-", "×", "÷"][v[1]] !== op) return { etat: "faux", message: "Le schéma est juste, mais pas l'opération." };
          return verifierNombre(v[2], r);
        },
        indice: "On cherche le tout ? On additionne (ou on multiplie si les parts sont égales). On cherche une partie ? On soustrait (ou on divise si les parts sont égales).",
        correction: `${nb(P.a)} ${SYMB[op]} ${nb(P.b)} = ${nb(r)} ${P.u}.`
      };
    }
  },

  {
    groupe: F5,
    id: "choisir-operation",
    titre: "Choisir l'opération",
    description: "Lire l'énoncé, choisir le calcul, puis l'effectuer.",
    generer() {
      const type = choisir(Object.keys(PROBLEMES_OP));
      const P = choisir(PROBLEMES_OP[type])();
      const op = OP_DU_TYPE[type], r = calculer(P.a, op, P.b);
      const calculs = ["+", "-", "×", "÷"].map(o => `${nb(P.a)} ${SYMB[o]} ${nb(P.b)}`);
      return {
        consigne: P.t,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Quel calcul ?</p>[s]</div><div class="etape-pb"><p>2. Effectue-le.</p><p class="rep">[d] ${P.u}</p></div>`,
        listes: [calculs],
        verifier(v) {
          if (v[0] == null) return { etat: "incomplet", message: "Choisis un calcul." };
          if (["+", "-", "×", "÷"][v[0]] !== op) return { etat: "faux", message: "Ce n'est pas le bon calcul. Fais un schéma en barres." };
          return verifierNombre(v[1], r);
        },
        indice: "Demande-toi ce que l'on cherche : un total, ce qui reste, plusieurs fois la même chose, ou une part ?",
        correction: `${nb(P.a)} ${SYMB[op]} ${nb(P.b)} = ${nb(r)} ${P.u}.`
      };
    }
  },

  {
    groupe: F5,
    id: "de-plus-de-moins",
    titre: "« De plus », « de moins » : attention !",
    description: "Le mot « moins » ne veut pas toujours dire soustraire.",
    generer() {
      const [nom1, nom2, grandeur, unite, base, ecart] = choisir([
        ["Léa", "son frère", "mesure", "m", tirer(1.3, 1.6, 2), tirer(0.08, 0.25, 2)],
        ["la tour A", "la tour B", "mesure", "m", tirer(150, 330, 1), tirer(20, 90, 1)],
        ["le vélo", "la trottinette", "coûte", "€", tirer(150, 300, 2), tirer(20, 90, 2)],
        ["le chien", "le chat", "pèse", "kg", tirer(8, 30, 1), tirer(2, 6, 1)]
      ]);
      const cas = alea(0, 3);
      const C = s => s[0].toUpperCase() + s.slice(1);
      const u = unite === "€" ? euros : x => `${nb(x)} ${unite}`;
      const textes = [
        [`${C(nom1)} ${grandeur} ${u(base)}. ${C(nom2)} ${grandeur} ${u(ecart)} de plus que ${nom1}.`, rr(base + ecart), "+"],
        [`${C(nom1)} ${grandeur} ${u(base)}. C'est ${u(ecart)} de plus que ${nom2}.`, rr(base - ecart), "-"],
        [`${C(nom1)} ${grandeur} ${u(base)}. ${C(nom2)} ${grandeur} ${u(ecart)} de moins que ${nom1}.`, rr(base - ecart), "-"],
        [`${C(nom1)} ${grandeur} ${u(base)}. C'est ${u(ecart)} de moins que ${nom2}.`, rr(base + ecart), "+"]
      ];
      const [texte, r, op] = textes[cas];
      const verbe = { mesure: "Combien mesure", coûte: "Combien coûte", pèse: "Combien pèse" }[grandeur];
      return {
        consigne: `${texte}<br>${verbe} ${nom2} ?`,
        ligne: `[d] ${unite}`,
        verifier(v) {
          const res = verifierNombre(v[0], r);
          if (res.etat === "faux" && egal(lireNombre(v[0]), op === "+" ? rr(base - ecart) : rr(base + ecart)))
            res.message = `Attention au piège ! Qui est le plus grand des deux ? Fais un schéma avec deux barres.`;
          return res;
        },
        indice: "Fais un schéma : deux barres, la plus longue dépasse de " + u(ecart) + ". Laquelle est la plus longue ?",
        correction: `${C(nom2)} ${grandeur} ${u(r)} (${nb(base)} ${SYMB[op]} ${nb(ecart)} = ${nb(r)}).`
      };
    }
  },

  {
    groupe: F5,
    id: "relier-probleme-calcul",
    titre: "Relier problème et calcul",
    description: "Quatre petits problèmes, quatre calculs avec les mêmes nombres.",
    generer() {
      const C = choisir(CONTEXTES), { a, n } = nombresContexte();
      const ops = ["+", "-", "×", "÷"];
      const r = relier(ops.map(o => ({ html: C[o](a, n), cle: o })), ops.map(o => ({ html: `${nb(a)} ${SYMB[o]} ${n}`, cle: o })));
      return {
        consigne: "Relie chaque problème au calcul qui le résout : clique sur un problème, puis sur un calcul.",
        figure: r.noeud,
        verifier: r.verifier,
        indice: "Un total : addition ; ce qui reste : soustraction ; plusieurs fois la même quantité : multiplication ; un partage en parts égales : division.",
        correction: ops.map(o => `${C[o](a, n)} → ${nb(a)} ${SYMB[o]} ${n}`).join("<br>"),
        surCorrection: r.corriger,
        bloquer: r.bloquer
      };
    }
  },

  {
    groupe: F5,
    id: "quel-probleme",
    titre: "Quel problème pour ce calcul ?",
    description: "Trouver l'énoncé qui se résout avec un calcul donné.",
    generer() {
      const C = choisir(CONTEXTES), { a, n } = nombresContexte();
      const op = choisir(["+", "-", "×", "÷"]);
      const options = melanger(["+", "-", "×", "÷"].filter(o => o !== op)).slice(0, 2).concat(op);
      const textes = melanger(options).map(o => [o, C[o](a, n)]);
      return {
        consigne: `Quel problème se résout avec le calcul <strong>${nb(a)} ${SYMB[op]} ${n}</strong> ?`,
        choix: textes.map(t => t[1]),
        verifier: (v, c) => ({ etat: c === C[op](a, n) ? "juste" : "faux" }),
        indice: "Pour chaque énoncé, demande-toi quelle opération tu ferais.",
        correction: C[op](a, n)
      };
    }
  },

  /* ================= Feuille 6 ================= */

  {
    groupe: F6,
    id: "probleme-etapes",
    titre: "Problèmes à étapes",
    description: "Le problème est découpé en questions qui se suivent.",
    generer() {
      const P = choisir(PROBLEMES_ETAPES)();
      return probleme(P.enonce, P.etapes, { indice: P.indice });
    }
  },

  {
    groupe: F6,
    id: "rendu-monnaie",
    titre: "Combien me rend-on ?",
    description: "Plusieurs achats, un billet, la monnaie.",
    generer() {
      const [nom, unite, prix] = choisir([["kg de pommes", "le kg", tirer(1.8, 3.2, 2)], ["baguettes", "l'une", tirer(0.95, 1.3, 2)], ["croissants", "l'un", tirer(0.9, 1.4, 2)], ["cahiers", "l'un", tirer(1.5, 3.5, 2)]]);
      const q = alea(2, 5), [autre, p2] = choisir([["un melon", tirer(2, 4, 2)], ["un jus de fruits", tirer(1.5, 3, 2)], ["un stylo", tirer(1, 2.5, 2)], ["une tarte", tirer(6, 12, 2)]]);
      const total = rr(q * prix + p2), billet = [10, 20, 50].find(x => x > total + 0.5) || 100;
      return probleme(`Mme Martin achète ${q} ${nom} à ${euros(prix)} ${unite} et ${autre} à ${euros(p2)}. Elle paie avec un billet de ${billet} €.`, [
        { q: "Combien coûtent ses achats ?", r: total, unite: "€", c: `${q} × ${nb(prix)} + ${nb(p2)} = ${nb(total)} €` },
        { q: "Combien lui rend-on ?", r: rr(billet - total), unite: "€", c: `${billet} − ${nb(total)} = ${nb(billet - total)} €` }
      ], { indice: "Calcule d'abord le prix des articles identiques." });
    }
  },

  /* ================= Feuille 7 ================= */

  {
    groupe: F7,
    id: "operation-trou",
    titre: "Opérations à trou",
    description: "Trouver le nombre manquant, avec un schéma en barres si besoin.",
    generer() {
      const forme = choisir(["a+?", "?+a", "?-a", "a-?", "a×?", "?÷a"]);
      let a, x, c, ligne, schemaTxt, calc;
      if (forme === "a+?" || forme === "?+a") { a = tirer(1, 20, choisir([1, 2])); x = tirer(0.5, 15, choisir([1, 2])); c = rr(a + x); ligne = forme === "a+?" ? `${nb(a)} + [d] = ${nb(c)}` : `[d] + ${nb(a)} = ${nb(c)}`; schemaTxt = schema([{ t: nb(a), w: a }, { t: "?", w: x }], nb(c)); calc = `${nb(c)} − ${nb(a)}`; }
      else if (forme === "?-a") { a = tirer(1, 10, choisir([1, 2])); c = tirer(1, 10, 1); x = rr(a + c); ligne = `[d] − ${nb(a)} = ${nb(c)}`; schemaTxt = schema([{ t: nb(a), w: a }, { t: nb(c), w: c }], "?"); calc = `${nb(c)} + ${nb(a)}`; }
      else if (forme === "a-?") { x = tirer(1, 8, choisir([1, 2])); c = tirer(1, 8, 1); a = rr(x + c); ligne = `${nb(a)} − [d] = ${nb(c)}`; schemaTxt = schema([{ t: "?", w: x }, { t: nb(c), w: c }], nb(a)); calc = `${nb(a)} − ${nb(c)}`; }
      else if (forme === "a×?") { a = alea(2, 6); x = tirer(0.5, 5, choisir([1, 2])); c = rr(a * x); ligne = `${a} × [d] = ${nb(c)}`; schemaTxt = schema([...Array(a)].map(() => ({ t: "?", w: 1 })), nb(c)); calc = `${nb(c)} ÷ ${a}`; }
      else { a = alea(2, 6); c = tirer(0.5, 6, choisir([1, 2])); x = rr(a * c); ligne = `[d] ÷ ${a} = ${nb(c)}`; schemaTxt = schema([...Array(a)].map(() => ({ t: nb(c), w: 1 })), "?"); calc = `${a} × ${nb(c)}`; }
      const figure = el("div", { class: "aide-schema", hidden: "" });
      figure.innerHTML = schemaTxt;
      return {
        consigne: "Trouve le nombre manquant.",
        ligne,
        apresLigne: figure,
        verifier(v) {
          const r = verifierNombre(v[0], x);
          if (r.etat === "faux") figure.hidden = false; // le schéma apparaît après une erreur
          return r;
        },
        indice: "Regarde le schéma en barres, affiché sous le calcul.",
        correction: `Le nombre manquant est ${calc} = ${nb(x)}.`,
        surCorrection() { figure.hidden = false; }
      };
    }
  },

  {
    groupe: F7,
    id: "egalite-schema",
    titre: "Le bon schéma pour l'égalité",
    description: "Associer une égalité à trou à son schéma, puis trouver le nombre.",
    generer() {
      const a = alea(3, 5), c = tirer(1.5, 6, 1), b = tirer(1.5, 6, 1);
      const cas = choisir(["a+?", "?-a", "a×?", "?÷a"]);
      let ligne, x, calc;
      const schemas = {
        "a+?": schema([{ t: nb(b), w: b }, { t: "?", w: c }], nb(rr(b + c))),
        "?-a": schema([{ t: nb(b), w: b }, { t: nb(c), w: c }], "?"),
        "a×?": schema([...Array(a)].map(() => ({ t: "?", w: 1 })), nb(rr(a * c))),
        "?÷a": schema([...Array(a)].map(() => ({ t: nb(c), w: 1 })), "?")
      };
      if (cas === "a+?") { ligne = `${nb(b)} + … = ${nb(b + c)}`; x = c; calc = `${nb(b + c)} − ${nb(b)}`; }
      else if (cas === "?-a") { ligne = `… − ${nb(b)} = ${nb(c)}`; x = rr(b + c); calc = `${nb(c)} + ${nb(b)}`; }
      else if (cas === "a×?") { ligne = `${a} × … = ${nb(a * c)}`; x = c; calc = `${nb(a * c)} ÷ ${a}`; }
      else { ligne = `… ÷ ${a} = ${nb(c)}`; x = rr(a * c); calc = `${a} × ${nb(c)}`; }
      const options = melanger([cas, ...melanger(Object.keys(schemas).filter(k => k !== cas)).slice(0, 2)]);
      return {
        consigne: `Voici une égalité à compléter : <strong>${ligne}</strong>`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Quel schéma la représente ?</p>[s]</div><div class="etape-pb"><p>2. Le nombre manquant :</p><p class="rep">[d]</p></div>`,
        listes: [options.map(k => schemas[k])],
        verifier(v) {
          if (v[0] == null) return { etat: "incomplet", message: "Choisis un schéma." };
          if (options[v[0]] !== cas) return { etat: "faux", message: "Ce n'est pas le bon schéma : où est le nombre manquant, dans le tout ou dans une partie ?" };
          return verifierNombre(v[1], x);
        },
        indice: "Dans une addition, le résultat est le tout ; dans une soustraction, le premier nombre est le tout.",
        correction: `Le nombre manquant est ${calc} = ${nb(x)}.`
      };
    }
  },

  {
    groupe: F7,
    id: "je-pense-nombre",
    titre: "Je pense à un nombre",
    description: "Remonter un programme de calcul à l'envers.",
    generer() {
      const x = choisir([alea(2, 12), tirer(1, 9, 1)]), k = alea(2, 5), b = tirer(1, 9, choisir([0, 1]));
      const cas = choisir(["×+", "×−", "+×"]);
      let texte, r, retour;
      if (cas === "×+") { r = rr(x * k + b); texte = `je le multiplie par ${k}, puis j'ajoute ${nb(b)}`; retour = `${nb(r)} − ${nb(b)} = ${nb(r - b)}, puis ${nb(r - b)} ÷ ${k} = ${nb(x)}`; }
      else if (cas === "×−") { r = rr(x * k - b); if (r <= 0) r = rr(x * k + b); texte = r === rr(x * k + b) ? `je le multiplie par ${k}, puis j'ajoute ${nb(b)}` : `je le multiplie par ${k}, puis j'enlève ${nb(b)}`; retour = r === rr(x * k + b) ? `${nb(r)} − ${nb(b)} = ${nb(r - b)}, puis ${nb(r - b)} ÷ ${k} = ${nb(x)}` : `${nb(r)} + ${nb(b)} = ${nb(r + b)}, puis ${nb(r + b)} ÷ ${k} = ${nb(x)}`; }
      else { r = rr((x + b) * k); texte = `j'ajoute ${nb(b)}, puis je multiplie par ${k}`; retour = `${nb(r)} ÷ ${k} = ${nb(r / k)}, puis ${nb(r / k)} − ${nb(b)} = ${nb(x)}`; }
      return {
        consigne: `Je pense à un nombre : ${texte}. Je trouve <strong>${nb(r)}</strong>. Quel est mon nombre ?`,
        ligne: "Mon nombre : [d]",
        verifier(v) {
          const res = verifierNombre(v[0], x);
          if (res.etat === "faux") res.message = "Vérifie en refaisant le programme avec ton nombre.";
          return res;
        },
        indice: "Pars de la fin et remonte : on défait chaque étape avec l'opération contraire, dans l'ordre inverse.",
        correction: `On remonte : ${retour}.`
      };
    }
  },

  {
    groupe: F7,
    id: "chiffres-caches",
    titre: "Chiffres cachés",
    description: "Retrouver les chiffres effacés d'une opération posée.",
    generer() {
      const op = choisir(["+", "+", "-"]);
      const D = choisir([1, 2]);
      let a, b, r;
      do {
        a = tirer(10, 99, D); b = tirer(10, op === "+" ? 99 : a - 1, D);
        r = calculer(a, op, b);
      } while (nbDec(a) < D || nbDec(b) < D || r <= 0);
      const lignes = [fixe(a, D), fixe(b, D), fixe(r, D)];
      const W = Math.max(...lignes.map(t => t.length));
      const pad = lignes.map(t => aligneDroite(t, W));
      // un chiffre caché au plus par colonne : la solution est unique
      const colonnes = melanger([...Array(W).keys()].filter(i => pad[0][i] !== ",")).slice(0, Math.min(4, W - 1));
      const caches = [new Set(), new Set(), new Set()];
      for (const col of colonnes) {
        const l = alea(0, 2), t = lignes[l], decal = W - t.length;
        if (col - decal >= 0 && /\d/.test(t[col - decal])) caches[l].add(col - decal);
      }
      if (caches.every(s => !s.size)) caches[2].add(lignes[2].length - 1);
      const g = grillePosee([{ texte: lignes[0], saisie: caches[0] }, { signe: SYMB[op], texte: lignes[1], saisie: caches[1] }, { texte: lignes[2], saisie: caches[2], trait: true }]);
      return {
        consigne: "Retrouve les chiffres effacés.",
        figure: g.noeud,
        verifier: () => g.verifier(),
        indice: "Commence par la colonne de droite, et n'oublie pas les retenues.",
        correction: `${nb(a)} ${SYMB[op]} ${nb(b)} = ${nb(r)}.`,
        surCorrection: g.corriger,
        bloquer: g.bloquer
      };
    }
  },

  {
    groupe: F7,
    id: "retrouver-prix",
    titre: "Retrouver une valeur",
    description: "Retrouver un prix ou une somme de départ.",
    generer() {
      if (Math.random() < 0.6) {
        const [obj, autre] = choisir([["stylos", "une gomme"], ["croissants", "une baguette"], ["cahiers", "une règle"], ["bouteilles d'eau", "un paquet de gâteaux"]]);
        const n = alea(2, 5), x = tirer(0.6, 3, 2), p = tirer(0.5, 3, 2), T = rr(n * x + p);
        return probleme(`Nina achète ${n} ${obj} identiques et ${autre} à ${euros(p)}. Elle paie ${euros(T)} en tout. Quel est le prix d'un des ${obj} ?`,
          [{ r: x, q: "Prix d'un objet :", unite: "€", c: `${nb(T)} − ${nb(p)} = ${nb(T - p)}, puis ${nb(T - p)} ÷ ${n} = ${nb(x)} €` }],
          { indice: "Enlève d'abord le prix de l'objet seul, puis partage." });
      }
      const d = tirer(3, 15, 2), r = tirer(2, 20, 2);
      return probleme(`Léa a dépensé ${euros(d)} au marché. Il lui reste ${euros(r)}. Combien avait-elle avant ?`,
        [{ r: rr(d + r), q: "Somme de départ :", unite: "€", c: `${nb(d)} + ${nb(r)} = ${nb(d + r)} €` }],
        { indice: "Fais un schéma : la somme de départ est le tout ; elle est partagée entre ce qui est dépensé et ce qui reste." });
    }
  },

  /* ================= Feuille 8 ================= */

  {
    groupe: F8,
    id: "compte-est-bon",
    titre: "Le compte est bon",
    description: "Écrire un calcul qui donne le nombre visé.",
    generer() {
      const jeux = [[0.5, 4, 2.5, 10], [3, 0.1, 7, 0.5], [2, 0.5, 6, 1.5], [5, 0.2, 3, 2.5], [4, 0.25, 8, 1.5], [0.1, 9, 2, 0.5]];
      const nombres = choisir(jeux);
      let cible, expr;
      for (let essai = 0; essai < 200; essai++) {
        const k = choisir([2, 3, 3]), pris = melanger([...nombres]).slice(0, k), ops = [...Array(k - 1)].map(() => choisir(["+", "-", "×", "÷"]));
        let v = pris[0], e = nb(pris[0]);
        for (let i = 1; i < k; i++) { v = calculer(v, ops[i - 1], pris[i]); e = (i > 1 ? `(${e})` : e) + ` ${SYMB[ops[i - 1]]} ${nb(pris[i])}`; }
        if (v > 0 && v < 100 && nbDec(v) <= 2 && !nombres.some(n => egal(n, v)) && !egal(v, 1)) { cible = v; expr = e; break; }
      }
      const champ = el("input", { class: "case compte-champ", autocomplete: "off", spellcheck: "false", "aria-label": "Ton calcul", placeholder: "ex. : (2 + 3) × 4" });
      return {
        consigne: `Avec les nombres <strong>${nombres.map(nb).join(" ; ")}</strong> et les quatre opérations, obtiens <strong>${nb(cible)}</strong>. Chaque nombre est utilisé au plus une fois. Tu peux utiliser des parenthèses.`,
        figure: el("div", { class: "compte-zone" }, champ, el("span", {}, ` = ${nb(cible)}`)),
        verifier() {
          const t = champ.value.trim();
          if (!t) return { etat: "incomplet", message: "Écris ton calcul dans la case." };
          const v = evaluerExpression(t);
          if (isNaN(v)) return { etat: "incomplet", message: "Ton calcul est mal écrit : utilise des nombres, + − × ÷ et des parenthèses." };
          const reste = [...nombres];
          for (const m of t.match(/\d+([.,]\d+)?/g) || []) {
            const x = Number(m.replace(",", ".")), i = reste.findIndex(n => egal(n, x));
            if (i < 0) return { etat: "faux", message: `Le nombre ${nb(x)} n'est pas dans la liste, ou tu l'as utilisé deux fois.` };
            reste.splice(i, 1);
          }
          return egal(v, cible) ? { etat: "juste" } : { etat: "faux", message: `Ton calcul donne ${nb(rr(v))}, pas ${nb(cible)}.` };
        },
        indice: "Multiplier par 0,5, c'est prendre la moitié ; multiplier par 0,1, c'est diviser par 10.",
        correction: `Une solution : ${expr} = ${nb(cible)}.`,
        bloquer: () => { champ.disabled = true; }
      };
    }
  },

  {
    groupe: F8,
    id: "carre-magique",
    titre: "Carré magique",
    description: "Compléter un carré dont toutes les sommes sont égales.",
    generer() {
      const a = choisir([0.1, 0.2, 0.5, 1.5, 0.25, 2.5]), d = choisir([0.1, 0.2, 0.5, 0.25, 1.5]);
      const val = x => rr(a + (x - 1) * d), S = rr(3 * val(5));
      const caches = new Set(melanger([[0, 1], [1, 0], [1, 2], [2, 1], [0, 0], [2, 2]]).slice(0, 4).map(([i, j]) => i * 3 + j));
      // on garde au plus deux cases cachées par ligne et par colonne, et le centre visible
      const champs = [];
      const table = el("table", { class: "carre-magique" });
      for (let i = 0; i < 3; i++) {
        const tr = el("tr");
        for (let j = 0; j < 3; j++) {
          const v = val(LO_SHU[i][j]);
          if (caches.has(i * 3 + j)) {
            const c = el("input", { class: "case", inputmode: "decimal", autocomplete: "off", "aria-label": `Ligne ${i + 1}, colonne ${j + 1}` });
            champs.push(Object.assign(c, { attendu: v }));
            tr.append(el("td", {}, c));
          } else tr.append(el("td", {}, nb(v)));
        }
        table.append(tr);
      }
      return {
        consigne: `Dans ce carré magique, la somme des trois nombres de chaque ligne, de chaque colonne et de chaque diagonale est <strong>${nb(S)}</strong>. Complète-le.`,
        figure: table,
        verifier() {
          if (champs.some(c => isNaN(lireNombre(c.value)))) return { etat: "incomplet", message: "Complète toutes les cases." };
          const faux = champs.filter(c => !egal(lireNombre(c.value), c.attendu));
          champs.forEach(c => c.classList.toggle("mauvaise", faux.includes(c)));
          return faux.length ? { etat: "faux", message: "Vérifie les sommes des lignes et des colonnes où il manque un seul nombre." } : { etat: "juste" };
        },
        indice: "Commence par une ligne, une colonne ou une diagonale où il ne manque qu'un nombre : c'est une soustraction.",
        correction: "Le carré complet : " + LO_SHU.map(l => l.map(x => nb(val(x))).join(" ; ")).join(" / ") + ".",
        surCorrection() { champs.forEach(c => { c.value = nb(c.attendu); c.classList.remove("mauvaise"); }); },
        bloquer: () => champs.forEach(c => { c.disabled = true; })
      };
    }
  },

  {
    groupe: F8,
    id: "deux-achats",
    titre: "Pastèque et ananas",
    description: "Deux achats qui diffèrent d'un article.",
    generer() {
      const [Xs, Ys, Yp] = choisir([["une pastèque", "un ananas", "ananas"], ["un classeur", "un stylo", "stylos"], ["une pizza", "une boisson", "boissons"], ["un melon", "une mangue", "mangues"]]);
      const x = tirer(2, 9, 2), y = tirer(0.8, 4, 2), k = alea(2, 3);
      const P1 = rr(x + k * y), P2 = rr(x + y);
      const Cap = t => t[0].toUpperCase() + t.slice(1);
      return probleme(`${Cap(Xs)} et ${k} ${Yp} coûtent ${euros(P1)}. ${Cap(Xs)} et ${Ys} coûtent ${euros(P2)}.`, [
        { q: `Quel est le prix d'${Ys} ?`, r: y, unite: "€", c: `La différence vient de ${k - 1 > 1 ? k - 1 + " " + Yp : Ys} : (${nb(P1)} − ${nb(P2)})${k > 2 ? ` ÷ ${k - 1}` : ""} = ${nb(y)} €` },
        { q: `Quel est le prix d'${Xs} ?`, r: x, unite: "€", c: `${nb(P2)} − ${nb(y)} = ${nb(x)} €` }
      ], { indice: "Compare les deux achats : qu'est-ce qui change de l'un à l'autre ?" });
    }
  },

  {
    groupe: F8,
    id: "trois-parts",
    titre: "Trois parts inégales",
    description: "Un partage avec « de plus » et « de moins ».",
    generer() {
      const [n1, n2, n3] = melanger(["Léo", "Tom", "Inès", "Aya", "Noé", "Lina"]).slice(0, 3);
      const t = tirer(8, 25, choisir([0, 1])), p = alea(2, 8), m = tirer(1, 5, choisir([0, 1]));
      const total = rr(3 * t + p - m);
      return probleme(`${n1}, ${n2} et ${n3} ont ${euros(total)} à eux trois. ${n1} a ${euros(p)} de plus que ${n2}. ${n3} a ${euros(m)} de moins que ${n2}. Combien chacun a-t-il ?`, [
        { q: `${n2} :`, r: t, unite: "€", c: `${n2} : (${nb(total)} − ${nb(p)} + ${nb(m)}) ÷ 3 = ${nb(t)} €` },
        { q: `${n1} :`, r: rr(t + p), unite: "€", c: `${n1} : ${nb(t)} + ${nb(p)} = ${nb(t + p)} €` },
        { q: `${n3} :`, r: rr(t - m), unite: "€", c: `${n3} : ${nb(t)} − ${nb(m)} = ${nb(t - m)} €` }
      ], { indice: `Fais un schéma avec trois barres. Si ${n1} donnait ses ${nb(p)} € en trop et si ${n3} recevait ses ${nb(m)} € manquants, les trois auraient autant que ${n2}.`,
        figure: (() => { const d = el("div", { class: "aide-schema" }); d.innerHTML = schema([{ t: n2, w: t }, { t: n1, w: t + p }, { t: n3, w: t - m }], euros(total), 280); return d; })() });
    }
  }

];

/* ---------- Le test « Je me teste » : 18 questions, une par compétence ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "18 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Le vocabulaire des opérations", activites: ["vocabulaire-addition", "vocabulaire-multiplication", "vocabulaire-division"] },
    { competence: "Additionner et soustraire de tête", activites: ["calcul-mental-addition", "completer"] },
    { competence: "Poser une addition ou une soustraction", activites: ["poser-addition"] },
    { competence: "Calculer astucieusement", activites: ["calcul-astucieux"] },
    { competence: "Multiplier par 10, 100… ou par 0,1 ; 0,01…", activites: ["fois-10"] },
    { competence: "Comparer un produit au premier facteur", activites: ["plus-grand-plus-petit"] },
    { competence: "Placer la virgule dans un produit", activites: ["produit-connu", "placer-virgule"] },
    { competence: "Poser une multiplication", activites: ["poser-multiplication"] },
    { competence: "Diviser de tête", activites: ["division-mentale"] },
    { competence: "Poser une division décimale", activites: ["division-posee"] },
    { competence: "Donner un ordre de grandeur", activites: ["ordre-grandeur"] },
    { competence: "Contrôler un résultat", activites: ["bon-resultat"] },
    { competence: "Choisir l'opération", activites: ["quel-schema", "choisir-operation", "quel-probleme"] },
    { competence: "« De plus », « de moins »", activites: ["de-plus-de-moins"] },
    { competence: "Résoudre un problème à étapes", activites: ["probleme-etapes", "rendu-monnaie"] },
    { competence: "Trouver un nombre manquant", activites: ["operation-trou", "egalite-schema", "je-pense-nombre"] },
    { competence: "Retrouver une valeur", activites: ["retrouver-prix", "chiffres-caches"] },
    { competence: "Aller plus loin", activites: ["deux-achats", "trois-parts", "carre-magique"] }
  ]
};
