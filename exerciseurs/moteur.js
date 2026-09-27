/* Moteur commun des exerciseurs (mode entraînement) — pas besoin de modifier ce fichier.
   Il utilise el() et piedDePage() définis dans app.js. */

/* ---------- Outils ---------- */
function alea(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function choisir(t) { return t[Math.floor(Math.random() * t.length)]; }
function melanger(t) {
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}
function frac(a, b) { return `<span class="frac"><span>${a}</span><span>${b}</span></span>`; }
function ecrireNombre(x) { return x.toLocaleString("fr-FR", { maximumFractionDigits: 6 }); }
function lireNombre(s) {
  s = String(s).replace(/\s/g, "").replace(",", ".");
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
}
function lireEntier(s) { const x = lireNombre(s); return Number.isInteger(x) ? x : NaN; }

function svg(tag, attrs = {}, ...enfants) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...enfants);
  return e;
}

/* ---------- Vérifications usuelles ---------- */
function verifierFraction(v, a, b) {
  const n = lireEntier(v.num), d = lireEntier(v.den);
  if (isNaN(n) || isNaN(d)) return { etat: "incomplet", message: "Écris un nombre entier au numérateur et au dénominateur." };
  if (d === 0) return { etat: "faux", message: "Le dénominateur ne peut pas être 0." };
  if (n * b === a * d) {
    if (n === a && d === b) return { etat: "juste" };
    return { etat: "juste", message: `Ta fraction est égale à ${frac(a, b)}.` };
  }
  if (n === b && d === a) return { etat: "faux", message: "Attention : tu as inversé le numérateur et le dénominateur." };
  return { etat: "faux" };
}

function verifierNombre(s, attendu) {
  const x = lireNombre(s);
  if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre dans la case." };
  return Math.abs(x - attendu) < 1e-9 ? { etat: "juste" } : { etat: "faux" };
}

/* ---------- Figures ---------- */
function disque(b, colories) {
  const r = 70, c = 80;
  const s = svg("svg", { viewBox: "0 0 160 160", width: 160, height: 160, role: "img",
    "aria-label": `Disque partagé en ${b} parts égales, dont ${colories} coloriées` });
  for (let i = 0; i < b; i++) {
    const a1 = (i / b) * 2 * Math.PI - Math.PI / 2, a2 = ((i + 1) / b) * 2 * Math.PI - Math.PI / 2;
    const pt = a => (c + r * Math.cos(a)).toFixed(2) + "," + (c + r * Math.sin(a)).toFixed(2);
    const d = b === 1
      ? `M${c - r},${c} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0`
      : `M${c},${c} L${pt(a1)} A${r},${r} 0 ${a2 - a1 > Math.PI ? 1 : 0} 1 ${pt(a2)} Z`;
    s.append(svg("path", { d, class: "fig-part" + (i < colories ? " coloriee" : "") }));
  }
  return s;
}

function rectangle(b, colories) {
  const dispositions = [[1, b]];
  for (let l = 2; l <= 4; l++) if (b % l === 0 && b / l >= l) dispositions.push([l, b / l]);
  const [lig, col] = choisir(dispositions);
  const cw = Math.min(50, 240 / col), ch = lig === 1 ? 60 : 40;
  const w = cw * col, h = ch * lig;
  const s = svg("svg", { viewBox: `-2 -2 ${w + 4} ${h + 4}`, width: w + 4, height: h + 4, role: "img",
    "aria-label": `Rectangle partagé en ${b} parts égales, dont ${colories} coloriées` });
  const pleines = new Set(melanger([...Array(b).keys()]).slice(0, colories));
  for (let i = 0; i < b; i++) {
    s.append(svg("rect", { x: (i % col) * cw, y: Math.floor(i / col) * ch, width: cw, height: ch,
      class: "fig-part" + (pleines.has(i) ? " coloriee" : "") }));
  }
  return s;
}

/* Nombre d'unités de la demi-droite : 2 sur téléphone (pour qu'elle reste lisible), 3 sinon. */
function unitesDroite() { return window.innerWidth < 560 ? 2 : 3; }

/* Demi-droite graduée de 0 à max, unité partagée en b parts.
   Avec clic: true, l'élève place le point (souris, doigt ou flèches du clavier). */
function droiteGraduee(b, { max = unitesDroite(), point = null, lettre = "A", clic = false } = {}) {
  const x0 = 30, U = 190, y = 50, pas = U / b;
  const X = k => x0 + k * pas;
  const L = x0 + max * U + 40;
  const s = svg("svg", { viewBox: `0 0 ${L} 92`, width: L, height: 92, class: "droite" + (clic ? " droite-clic" : "") });
  s.append(svg("line", { x1: x0, y1: y, x2: L - 12, y2: y, class: "axe" }));
  s.append(svg("path", { d: `M${L - 8},${y} l-11,-5.5 v11 z`, class: "fleche" }));
  for (let k = 0; k <= max * b; k++) {
    const maj = k % b === 0;
    s.append(svg("line", { x1: X(k), y1: y - (maj ? 10 : 6), x2: X(k), y2: y + (maj ? 10 : 6), class: maj ? "grad maj" : "grad" }));
    if (maj) s.append(svg("text", { x: X(k), y: y + 32, class: "etiq" }, String(k / b)));
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
      k = Math.max(0, Math.min(max * b, k));
      res.position = k;
      g?.remove();
      g = res.marquer(k, "pt", lettre);
    };
    s.setAttribute("tabindex", "0");
    s.setAttribute("aria-label", "Demi-droite graduée : clique pour placer le point, ou utilise les flèches du clavier.");
    s.addEventListener("pointerdown", e => {
      if (!res.actif) return;
      const p = s.createSVGPoint();
      p.x = e.clientX; p.y = e.clientY;
      const q = p.matrixTransform(s.getScreenCTM().inverse());
      placer(Math.round((q.x - x0) / pas));
    });
    s.addEventListener("keydown", e => {
      if (!res.actif || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
      e.preventDefault();
      placer((res.position ?? 0) + (e.key === "ArrowRight" ? 1 : -1));
    });
  }
  return res;
}

/* ---------- Lignes de réponse ----------
   Dans q.ligne, les cases à compléter s'écrivent :
     [n]      un nombre entier          [d]    un nombre décimal
     [f]      une fraction complète     [f/12] numérateur à trouver, dénominateur 12
     [f3/]    dénominateur à trouver    [c]    un symbole choisi parmi q.choix       */
function construireLigne(ligne, modele) {
  const trous = [];
  ligne.innerHTML = modele.replace(/\[(n|d|c)\]|\[f(\d*)\/?(\d*)\]/g, (m, t, num, den) => {
    trous.push(t ? { type: t } : { type: "f", num, den });
    return `<span data-trou="${trous.length - 1}"></span>`;
  });
  const cases = [], lecteurs = [];
  const nouvelleCase = (mode, etiquette) => {
    const i = el("input", { class: "case" + (mode === "decimal" ? " large" : ""), inputmode: mode,
      autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-label": etiquette });
    cases.push(i);
    return i;
  };
  let choix = null;
  trous.forEach((t, k) => {
    const place = ligne.querySelector(`[data-trou="${k}"]`);
    if (t.type === "n" || t.type === "d") {
      const i = nouvelleCase(t.type === "n" ? "numeric" : "decimal", "Réponse");
      place.replaceWith(i);
      lecteurs.push(() => i.value);
    } else if (t.type === "c") {
      choix = el("span", { class: "case-choix", "aria-label": "Symbole à choisir" }, "?");
      place.replaceWith(choix);
      lecteurs.push(() => choix.dataset.valeur ?? "");
    } else {
      const haut = t.num || nouvelleCase("numeric", "Numérateur");
      const bas = t.den || nouvelleCase("numeric", "Dénominateur");
      place.replaceWith(el("span", { class: "frac frac-saisie" }, el("span", {}, haut), el("span", {}, bas)));
      lecteurs.push(() => ({ num: t.num || haut.value, den: t.den || bas.value }));
    }
  });
  return { cases, choix, lire: () => lecteurs.map(f => f()) };
}

/* ---------- Pages ---------- */
const BRAVO = ["Bravo !", "Exact !", "Très bien !", "Parfait !", "C'est juste !"];

function lancerExerciseur({ intro, activites }) {
  if (window.self !== window.top) document.body.classList.add("integre"); // affiché dans une iframe
  const app = document.getElementById("app");
  const scores = {};
  const melange = {
    id: "melange", titre: "Tout mélanger", description: "Des questions de toutes les activités, au hasard.",
    generer() { const a = choisir(activites); return Object.assign(a.generer(), { etiquette: a.titre }); }
  };

  function afficher() {
    const id = decodeURIComponent(location.hash.slice(1));
    const act = id === "melange" ? melange : activites.find(a => a.id === id);
    app.replaceChildren();
    if (act) pageActivite(act); else pageMenu();
  }

  function carte(a, badge, classe = "") {
    return el("a", { class: "carte-activite " + classe, href: "#" + a.id },
      el("span", { class: "badge" }, badge),
      el("div", {}, el("h2", {}, a.titre), el("p", {}, a.description)));
  }

  function pageMenu() {
    app.append(el("p", { class: "intro" }, intro));
    const grille = el("div", { class: "grille-activites" });
    activites.forEach((a, i) => grille.append(carte(a, String(i + 1))));
    grille.append(carte(melange, "Mix", "melange"));
    app.append(grille);
  }

  function pageActivite(act) {
    const s = scores[act.id] ||= { tentees: 0, reussies: 0, serie: 0 };
    const reussies = el("strong"), serie = el("strong");
    const majScore = () => {
      reussies.textContent = s.reussies + " / " + s.tentees;
      serie.textContent = s.serie;
    };
    const numero = el("span", { class: "num" });
    const corps = el("div", { class: "exercice-corps" });
    app.append(
      el("div", { class: "barre" },
        el("a", { class: "retour", href: "#" }, "← Toutes les activités"),
        el("div", { class: "score" },
          el("span", { class: "pastille" }, "Réussies du premier coup : ", reussies),
          el("span", { class: "pastille" }, "Série : ", serie))),
      el("section", { class: "exercice" },
        el("div", { class: "exercice-tete" }, el("h2", {}, act.titre), numero),
        corps));
    majScore();

    let n = 0;
    nouvelleQuestion();

    function nouvelleQuestion() {
      n++;
      numero.textContent = "Question " + n;
      const q = act.generer();
      let essais = 0, finie = false;

      corps.replaceChildren();
      if (q.etiquette) corps.append(el("p", { class: "etiquette" }, q.etiquette));
      const consigne = el("p", { class: "consigne" });
      consigne.innerHTML = q.consigne;
      corps.append(consigne);
      if (q.figure) corps.append(el("div", { class: "figure" }, ...[].concat(q.figure)));
      const ligne = el("div", { class: "ligne" });
      const saisie = construireLigne(ligne, q.ligne || "");
      if (q.ligne) corps.append(ligne);
      const actions = el("div", { class: "actions" });
      const retour = el("div", { class: "retour-eleve", "aria-live": "polite" });
      corps.append(actions, retour);

      corps.onkeydown = e => {
        if (e.key !== "Enter" || e.target.tagName === "BUTTON") return;
        e.preventDefault();
        if (!finie) valider();
      };

      function message(classe, titre, ...textes) {
        const boite = el("div", { class: "message " + classe });
        boite.innerHTML = (titre ? `<strong class="titre">${titre}</strong> ` : "") + textes.filter(Boolean).join(" ");
        retour.replaceChildren(boite);
      }

      function boutonsSaisie() {
        const liste = [];
        if (q.choix) {
          for (const c of q.choix) {
            liste.push(el("button", { class: "btn btn-choix", type: "button", onclick: () => {
              saisie.choix.textContent = c;
              saisie.choix.dataset.valeur = c;
              valider();
            } }, c));
          }
        } else {
          liste.push(el("button", { class: "btn principal", type: "button", onclick: valider }, "Valider"));
        }
        if (essais > 0) liste.push(el("button", { class: "btn", type: "button", onclick: voirCorrection }, "Voir la correction"));
        else liste.push(el("button", { class: "btn discret", type: "button", onclick: nouvelleQuestion }, "Passer"));
        actions.replaceChildren(...liste);
      }

      function boutonSuivant() {
        const b = el("button", { class: "btn principal", type: "button", onclick: nouvelleQuestion }, "Question suivante →");
        actions.replaceChildren(b);
        b.focus({ preventScroll: true });
      }

      function terminer() {
        finie = true;
        for (const c of saisie.cases) c.disabled = true;
        q.bloquer?.();
        boutonSuivant();
      }

      function valider() {
        const r = q.verifier(saisie.lire());
        if (r.etat === "incomplet") { message("incomplet", "", r.message); return; }
        essais++;
        if (essais === 1) s.tentees++;
        if (r.etat === "juste") {
          if (essais === 1) { s.reussies++; s.serie++; }
          message("juste", choisir(BRAVO), r.message);
          terminer();
        } else {
          if (essais === 1) s.serie = 0;
          message("faux", "Pas tout à fait…", r.message, q.indice);
          boutonsSaisie();
          const vide = saisie.cases.find(c => c.value === "") || saisie.cases[0];
          vide?.focus({ preventScroll: true });
        }
        majScore();
      }

      function voirCorrection() {
        message("correction", "Correction :", q.correction);
        q.surCorrection?.();
        terminer();
      }

      boutonsSaisie();
      saisie.cases[0]?.focus({ preventScroll: true });
    }
  }

  window.addEventListener("hashchange", () => { afficher(); window.scrollTo(0, 0); });
  afficher();
  piedDePage();
}
