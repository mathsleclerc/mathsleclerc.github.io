/* =====================================================================
   EXERCISEUR « CERCLES ET DISQUES » — 6e, chapitre 7

   Les activités sont regroupées comme les sept feuilles d'exercices.
   Chaque activité a un identifiant (utilisé dans l'adresse :
   …/cercles-disques-6e/#perimetre), un titre, une description et une
   fonction generer() qui fabrique une question au hasard.
   Les constructions utilisent le compas virtuel (geometrie.js).
   ===================================================================== */

const F1 = "Feuille 1 — Cercle et disque";
const F2 = "Feuille 2 — Programmes de construction";
const F3 = "Feuille 3 — Périmètre : calculs";
const F4 = "Feuille 4 — Périmètre : problèmes";
const F5 = "Feuille 5 — Médiatrice d'un segment";
const F6 = "Feuille 6 — Symétrique et bissectrice";
const F7 = "Feuille 7 — Distances et régionnement";

const W = 360, H = 230;       // petites figures
const CW = 640, CH = 420;     // figures de construction (en vraie grandeur : CM pixels par cm)

const nb = x => ecrireNombre(x);
const cm = x => nb(x) + " cm";
const unite = (x, u) => nb(x) + " " + u;
const arrondi = (x, p) => Math.round(x * 10 ** p + 1e-9 * Math.sign(x)) / 10 ** p;
const PRECISIONS = [{ p: 0, nom: "à l'unité" }, { p: 1, nom: "au dixième" }, { p: 2, nom: "au centième" }];
const cap = t => t[0].toUpperCase() + t.slice(1);
const angleNom = t => `<span class="angle">${t}</span>`;
const PI = "π";

function positionClic(s, e) {
  const p = s.createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(s.getScreenCTM().inverse());
}
const dist = (P, Q) => Math.hypot(P.x - Q.x, P.y - Q.y);
const angleDe = (C, M) => Math.atan2(M.y - C.y, M.x - C.x);

/* Vérifie un résultat arrondi : on reconnaît aussi les erreurs fréquentes (pas arrondi, mauvaise formule) */
function verifierArrondi(saisie, exact, p, pieges = []) {
  const x = lireNombre(saisie);
  if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre dans la case." };
  const bon = arrondi(exact, p);
  if (Math.abs(x - bon) < 1e-9) return { etat: "juste" };
  for (const [valeur, message] of pieges) if (Math.abs(x - arrondi(valeur, p)) < 1e-9 || Math.abs(x - valeur) < 1e-9) return { etat: "faux", message };
  if (Math.abs(x - exact) < 0.5 * 10 ** -p * 1.0001 + 1e-9 || Math.abs(x - arrondi(exact, p + 1)) < 1e-9 || Math.abs(x - arrondi(exact, p + 2)) < 1e-9)
    return { etat: "faux", message: `Le calcul est bon, mais vérifie l'arrondi : il faut ${["aucun chiffre", "un seul chiffre", "deux chiffres"][p]} après la virgule, et regarder le chiffre suivant.` };
  return { etat: "faux" };
}

/* ---------- Atelier de construction ----------
   Une suite d'étapes guidées. Types d'étape :
   champ (une mesure ou un calcul), clic (placer un point sur un segment), point (cliquer à un endroit),
   compas (tracer au compas, puis « J'ai tracé »), tracer (un bouton qui trace). Chaque étape a « Montre-moi ». */
function atelier(s, etapes, { compas = null, bloquerOutils = () => {}, consigne } = {}) {
  const message = el("p", { class: "atelier-message" });
  const actions = el("div", { class: "atelier-actions" });
  const pastilles = el("div", { class: "etapes-construction" }, ...etapes.map(e => el("span", {}, e.nom)));
  const controle = el("div", { class: "atelier-controle" }, pastilles, message, actions);
  if (compas) controle.append(barreCompas(compas));
  let k = -1, fini = false, actif = true, clic = null, pointClic = null, champ = null, point = null;
  const dire = (t, type = "") => { message.innerHTML = t; message.className = "atelier-message " + type; };
  const bouton = (t, f, c = "") => el("button", { type: "button", class: "btn " + c, onclick: () => { if (actif) f(); } }, t);

  const placerSurSegment = t => {
    pointClic?.remove();
    pointClic = dessinerPoint(s, V.plus(clic.depart, V.fois(clic.direction, t * CM)), clic.nom, { vers: V.normal(clic.direction), classe: "geo-point-eleve" });
    clic.valeur = t;
  };
  const placerLibre = q => {
    pointClic?.remove();
    pointClic = dessinerPoint(s, q, point.nom, { vers: point.vers || { x: 0.7, y: -1 }, classe: "geo-point-eleve" });
    point.valeur = q;
  };
  s.addEventListener("pointerdown", e => {
    if (!actif || e.target.closest(".compas, .outil-poignee")) return;
    const q = positionClic(s, e);
    if (clic) {
      const r = V.moins(q, clic.depart);
      const d = Math.abs(r.x * clic.direction.y - r.y * clic.direction.x);
      if (d > (e.target.closest(".instrument") ? 12 : 24)) return;
      e.stopPropagation();
      let t = Math.round((r.x * clic.direction.x + r.y * clic.direction.y) / CM * 10) / 10;
      placerSurSegment(Math.min(clic.longueur, Math.max(0, t)));
    } else if (point && !e.target.closest(".instrument")) {
      e.stopPropagation();
      placerLibre(q);
    }
  }, true);

  function etape(i) {
    k = i;
    const e = etapes[i];
    [...pastilles.children].forEach((p, j) => { p.className = j < i ? "faite" : j === i ? "en-cours" : ""; });
    e.avant?.();
    dire(e.texte);
    actions.replaceChildren();
    clic = null; pointClic = null; champ = null; point = null;
    if (e.champ) {
      const [avant, apres] = e.champ.split("[d]");
      champ = el("input", { class: "case", inputmode: "decimal", autocomplete: "off", "aria-label": "Réponse" });
      const ok = bouton("OK", () => {
        const v = lireNombre(champ.value);
        if (isNaN(v)) { dire("Écris un nombre.", "attention"); return; }
        const r = e.valider(v);
        if (r === true) reussir(); else dire(r, "attention");
      }, "principal");
      champ.addEventListener("keydown", ev => { if (ev.key === "Enter") { ev.preventDefault(); ev.stopPropagation(); ok.click(); } });
      actions.append(el("span", {}, avant), champ, el("span", {}, apres), ok);
    } else if (e.clic) {
      clic = { ...e.clic, valeur: null };
      actions.append(bouton("OK", () => {
        if (clic.valeur == null) { dire("Clique sur le segment pour placer le point.", "attention"); return; }
        if (Math.abs(clic.valeur - clic.cible) < 0.05) { clic = null; reussir(); } else dire(e.clic.message(clic.valeur), "attention");
      }, "principal"));
    } else if (e.point) {
      point = { ...e.point, valeur: null };
      actions.append(bouton("OK", () => {
        if (!point.valeur) { dire("Clique sur la figure pour placer le point.", "attention"); return; }
        if (dist(point.valeur, point.cible) <= (point.tol || 10)) { pointClic?.remove(); point = null; reussir(); }
        else dire(e.point.message || "Ce n'est pas le bon endroit : regarde bien où se coupent les traits.", "attention");
      }, "principal"));
    } else if (e.compas) {
      actions.append(bouton("J'ai tracé ✓", () => {
        const r = e.compas();
        if (r === true) reussir(); else dire(r, "attention");
      }, "principal"));
    } else if (e.tracer) {
      actions.append(bouton(e.bouton || "Tracer", () => {
        const r = e.tracer();
        if (r === true) reussir(); else dire(r, "attention");
      }, "principal"));
    }
    actions.append(bouton("Montre-moi", () => montrer(e), "discret"));
  }

  function montrer(e) {
    e.montrer?.();
    if (e.champ) { champ.value = ecrireNombre(e.reponse); dire(`La réponse est ${ecrireNombre(e.reponse)}. Clique sur OK.`, "bien"); }
    else if (e.clic) { placerSurSegment(e.clic.cible); dire("Voici où placer le point. Clique sur OK.", "bien"); }
    else if (e.point) { placerLibre(e.point.cible); dire("Voici où placer le point. Clique sur OK.", "bien"); }
    else if (e.compas) dire("Regarde comment placer le compas et tracer. Clique sur « J'ai tracé ».", "bien");
    else if (e.tracer) dire(`Clique sur « ${e.bouton || "Tracer"} ».`, "bien");
  }

  function reussir() {
    const e = etapes[k];
    e.dessin?.();
    if (k + 1 < etapes.length) { etape(k + 1); return; }
    fini = true;
    [...pastilles.children].forEach(p => { p.className = "faite"; });
    s.querySelectorAll(".instrument").forEach(i => i.classList.add("range"));
    compas?.bloquer();
    actions.replaceChildren();
    dire((e.fin || "Construction terminée !") + " Clique sur « Valider ».", "bien");
  }

  etape(0);
  return {
    consigne: consigne || "Suis les étapes de la construction. Si tu es bloqué, utilise « Montre-moi ».",
    figure: [s, controle],
    verifier: () => fini ? { etat: "juste" } : { etat: "incomplet", message: "Termine d'abord toutes les étapes de la construction." },
    indice: "Suis les étapes une par une ; le bouton « Montre-moi » aide à chaque étape.",
    correction: "Les étapes : " + etapes.map(e => e.nom.toLowerCase()).join(" → ") + ".",
    surCorrection() {
      while (!fini && k < etapes.length) {
        const e = etapes[k];
        e.montrer?.();
        if (e.clic) placerSurSegment(e.clic.cible);
        if (e.point) pointClic?.remove();
        reussir();
      }
    },
    bloquer() { actif = false; compas?.bloquer(); bloquerOutils(); }
  };
}

/* Boutons sous une figure avec compas : mode d'emploi et gomme */
function barreCompas(compas) {
  return el("div", { class: "outils-compas" },
    el("span", { class: "aide-compas" }, "Compas : glisse la pointe pour le déplacer, la mine pour l'écartement, ↻ pour tracer."),
    el("button", { type: "button", class: "btn discret", onclick: () => compas.effacerDernier() }, "↶ Effacer le dernier arc"),
    el("button", { type: "button", class: "btn discret", onclick: () => compas.effacerTout() }, "Tout effacer"));
}

function figureConstruction(etiquette = "Construction") {
  const s = figureGeo(CW, CH, etiquette);
  s.classList.add("construction", "geo-manipuler");
  return s;
}

/* Médiatrice de [AB] construite au compas ? Des arcs de même rayon r > AB/2, centrés en A et en B,
   passent par les deux points d'intersection. Renvoie { pts } ou un message. */
function mediatriceAuCompas(arcs, A, B, nA = "A", nB = "B") {
  const AB = dist(A, B);
  const arcsA = arcsDeCentre(arcs, A), arcsB = arcsDeCentre(arcs, B);
  if (!arcsA.length && !arcsB.length) return `Trace des arcs de cercle : la pointe du compas en ${nA}, puis en ${nB}.`;
  if (!arcsA.length) return `Il manque les arcs de centre ${nA}.`;
  if (!arcsB.length) return `Il manque les arcs de centre ${nB}.`;
  let message = `Les arcs de centre ${nA} et de centre ${nB} doivent avoir le même écartement.`;
  for (const a of arcsA) {
    if (a.r <= AB / 2 + 2) { message = `L'écartement doit être plus grand que la moitié de ${nA}${nB} : sinon les arcs ne se coupent pas.`; continue; }
    const pts = intersectionCercles(A, a.r, B, a.r);
    if (!arcsB.some(b => Math.abs(b.r - a.r) < 0.1 * CM)) continue;
    const ok = pts.map(P => arcsA.some(x => Math.abs(x.r - a.r) < 0.1 * CM && arcPassePar(x, P)) && arcsB.some(x => Math.abs(x.r - a.r) < 0.1 * CM && arcPassePar(x, P)));
    if (ok[0] && ok[1]) return { pts, r: a.r };
    message = "Les arcs doivent se couper deux fois : une fois de chaque côté du segment. Trace des arcs un peu plus longs.";
  }
  return message;
}
/* Trace à la place de l'élève les arcs de la médiatrice de [AB] */
function montrerMediatrice(compas, A, B) {
  const r = dist(A, B) * 0.72;
  const pts = intersectionCercles(A, r, B, r);
  for (const C of [A, B]) {
    compas.placer(C, r, angleDe(C, pts[0]));
    for (const P of pts) { const t = angleDe(C, P); compas.placer(C, r, t - 0.3); compas.tracer(t - 0.3, t + 0.3); }
  }
  return pts;
}

/* Une figure avec un compas libre (et ses boutons) pour s'aider */
function figureAvecCompas(s, aimants, P = { x: CW - 90, y: CH - 70 }) {
  const compas = creerCompas(s, { aimants, P, r: 1.5 * CM, a: Math.PI });
  return { compas, barre: barreCompas(compas) };
}

/* Petites figures pour « traduire une phrase » */
function miniFigure(type, d) {
  const s = figureGeo(150, 110, "Figure");
  const A = { x: 52, y: 58 }, B = { x: 108, y: 58 }, r = 30;
  if (type === "exterieur") { s.append(svg("rect", { x: 2, y: 2, width: 146, height: 106, class: "geo-zone" })); dessinerCercle(s, A, r, "geo-cercle"); s.append(svg("circle", { cx: A.x, cy: A.y, r: r - 1.2, fill: "var(--carte)" })); }
  if (type === "cercle") dessinerCercle(s, A, r, "geo-cercle");
  if (type === "disque") dessinerCercle(s, A, r, "geo-disque");
  const deux = ["mediatrice", "coteA", "coteB"].includes(type);
  if (type === "coteA") s.append(svg("rect", { x: 2, y: 2, width: 78, height: 106, class: "geo-zone" }));
  if (type === "coteB") s.append(svg("rect", { x: 80, y: 2, width: 68, height: 106, class: "geo-zone" }));
  if (deux) {
    dessinerTrait(s, { x: 80, y: 4 }, { x: 80, y: 106 }, "segment", type === "mediatrice" ? "geo-objet" : "geo-pointille");
    dessinerPoint(s, B, "B", { vers: { x: 0.5, y: -1 } });
  }
  dessinerPoint(s, A, "A", { vers: { x: -0.5, y: -1 } });
  if (!deux) dessinerTrait(s, A, { x: A.x + r, y: A.y }, "segment", "geo-pointille");
  return s;
}
const PHRASES_ZONES = {
  cercle: d => `les points situés à ${unite(d, "km")} de A`,
  disque: d => `les points situés à moins de ${unite(d, "km")} de A`,
  exterieur: d => `les points situés à plus de ${unite(d, "km")} de A`,
  mediatrice: () => "les points situés à égale distance de A et de B",
  coteA: () => "les points plus près de A que de B",
  coteB: () => "les points plus près de B que de A"
};
const NOMS_ZONES = {
  cercle: "le cercle de centre A", disque: "le disque de centre A", exterieur: "l'extérieur du disque de centre A",
  mediatrice: "la médiatrice de [AB]", coteA: "la partie du plan du côté de A par rapport à la médiatrice de [AB]",
  coteB: "la partie du plan du côté de B par rapport à la médiatrice de [AB]"
};

/* ---------- Programmes de construction (feuille 2) ---------- */
const PX = 30; // pixels par centimètre sur les figures des programmes (pas en vraie grandeur)
function figureProgramme(dessin, w = 420, h = 280) {
  const s = figureGeo(w, h, "Figure à construire");
  dessin(s);
  return s;
}
function arcSimple(s, C, r, a0, a1, classe = "geo-trait-fin") {
  const p0 = V.plus(C, V.fois(V.angle(a0), r)), p1 = V.plus(C, V.fois(V.angle(a1), r));
  s.append(svg("path", { d: `M${p0.x},${p0.y} A${r},${r} 0 ${Math.abs(a1 - a0) > Math.PI ? 1 : 0} 1 ${p1.x},${p1.y}`, class: classe, fill: "none" }));
}

const PROGRAMMES = [
  // 0 : deux cercles qui se coupent (fiche 2, exercice 2)
  () => {
    const d = alea(2, 4), O = { x: 210 - d * PX / 2, y: 140 }, P = { x: 210 + d * PX / 2, y: 140 };
    const [M, N] = intersectionCercles(O, d * PX, P, d * PX).sort((a, b) => a.y - b.y);
    return {
      figure: figureProgramme(s => {
        dessinerCercle(s, O, d * PX, "geo-cercle-fin"); dessinerCercle(s, P, d * PX, "geo-cercle-fin");
        dessinerTrait(s, O, P, "segment", "geo-objet"); dessinerTrait(s, M, N, "segment", "geo-objet");
        dessinerPoint(s, O, "O", { vers: { x: -1, y: 0.6 } }); dessinerPoint(s, P, "P", { vers: { x: 1, y: 0.6 } });
        dessinerPoint(s, M, "M", { vers: { x: 0, y: -1 } }); dessinerPoint(s, N, "N", { vers: { x: 0, y: 1 } });
        dessinerTexte(s, { x: 210, y: 128 }, cm(d), "geo-cote");
      }),
      trous: [
        { texte: "1. Tracer un segment [OP] de longueur [s].", options: [cm(d), cm(2 * d), cm(d / 2)] },
        { texte: "2. Tracer le cercle de centre O passant par [s].", options: ["P", "M", "O"] },
        { texte: "3. Tracer le cercle de centre [s] passant par O.", options: ["P", "M", "N"] },
        { texte: "4. Les deux cercles se coupent en M et N. Tracer le segment [s].", options: ["[MN]", "[OP]", "[OM]"] }
      ],
      etapes: [
        { texte: `Tracer un segment [OP] de longueur ${cm(d)}.` },
        { texte: "Tracer le cercle de centre O passant par P.", apres: [0] },
        { texte: "Tracer le cercle de centre P passant par O.", apres: [0] },
        { texte: "Placer M et N, les points d'intersection des deux cercles.", apres: [1, 2] },
        { texte: "Tracer le segment [MN].", apres: [3] }
      ]
    };
  },
  // 1 : cercle de diamètre [AB] et triangle (fiche 2, exercice 4)
  () => {
    const L = alea(4, 6), I = { x: 210, y: 150 }, A = { x: 210 - L * PX / 2, y: 150 }, B = { x: 210 + L * PX / 2, y: 150 };
    const t = -alea(40, 140) * DEG, C = V.plus(I, V.fois(V.angle(t), L * PX / 2));
    return {
      figure: figureProgramme(s => {
        dessinerCercle(s, I, L * PX / 2, "geo-cercle-fin");
        for (const [p, q] of [[A, B], [B, C], [C, A]]) dessinerTrait(s, p, q, "segment", "geo-objet");
        dessinerPoint(s, A, "A", { vers: { x: -1, y: 0.5 } }); dessinerPoint(s, B, "B", { vers: { x: 1, y: 0.5 } });
        dessinerPoint(s, I, "I", { vers: { x: 0, y: 1 } }); dessinerPoint(s, C, "C", { vers: V.moins(C, I) });
        codageLongueur(s, A, I, 2); codageLongueur(s, I, B, 2);
        dessinerTexte(s, { x: 210, y: 265 }, "AB = " + cm(L), "geo-cote");
      }),
      trous: [
        { texte: "1. Tracer un segment [AB] de longueur [s].", options: [cm(L), cm(L / 2), cm(2 * L)] },
        { texte: "2. Placer [s] du segment [AB].", options: ["le milieu I", "un point I quelconque", "le point C"] },
        { texte: "3. Tracer le cercle de [s] [AB].", options: ["diamètre", "rayon", "corde"] },
        { texte: "4. Placer un point C sur [s], puis tracer le triangle ABC.", options: ["le cercle", "le segment [AB]", "la droite (AB)"] }
      ],
      etapes: [
        { texte: `Tracer un segment [AB] de longueur ${cm(L)}.` },
        { texte: "Placer le milieu I du segment [AB].", apres: [0] },
        { texte: "Tracer le cercle de diamètre [AB] (centre I, passant par A).", apres: [1] },
        { texte: "Placer un point C sur le cercle.", apres: [2] },
        { texte: "Tracer le triangle ABC.", apres: [3] }
      ]
    };
  },
  // 2 : triangle au compas (fiche 2, exercice 3)
  () => {
    let a, b, c;
    do { c = alea(4, 6); b = alea(30, 55) / 10; a = alea(30, 55) / 10; } while (a + b <= c + 0.8 || a === b);
    const A = { x: 210 - c * PX / 2, y: 220 }, B = { x: 210 + c * PX / 2, y: 220 };
    const C = intersectionCercles(A, b * PX, B, a * PX).sort((p, q) => p.y - q.y)[0];
    return {
      figure: figureProgramme(s => {
        arcSimple(s, A, b * PX, angleDe(A, C) - 0.35, angleDe(A, C) + 0.35);
        arcSimple(s, B, a * PX, angleDe(B, C) - 0.35, angleDe(B, C) + 0.35);
        for (const [p, q] of [[A, B], [B, C], [C, A]]) dessinerTrait(s, p, q, "segment", "geo-objet");
        dessinerPoint(s, A, "A", { vers: { x: -1, y: 0.5 } }); dessinerPoint(s, B, "B", { vers: { x: 1, y: 0.5 } }); dessinerPoint(s, C, "C", { vers: { x: 0, y: -1 } });
        dessinerTexte(s, { x: 210, y: 248 }, cm(c), "geo-cote");
        dessinerTexte(s, V.plus(V.milieu(A, C), { x: -26, y: 0 }), cm(b), "geo-cote");
        dessinerTexte(s, V.plus(V.milieu(B, C), { x: 26, y: 0 }), cm(a), "geo-cote");
      }),
      trous: [
        { texte: "1. Tracer un segment [AB] de longueur [s].", options: [cm(c), cm(b), cm(a)] },
        { texte: "2. Tracer un arc de cercle de centre A et de rayon [s].", options: [cm(b), cm(a), cm(c)] },
        { texte: `3. Tracer un arc de cercle de centre [s] et de rayon ${cm(a)}.`, options: ["B", "A", "C"] },
        { texte: "4. Les deux arcs se coupent en C. Tracer [s].", options: ["le triangle ABC", "le cercle de centre C", "la droite (AB)"] }
      ],
      etapes: [
        { texte: `Tracer un segment [AB] de longueur ${cm(c)}.` },
        { texte: `Tracer un arc de cercle de centre A et de rayon ${cm(b)}.`, apres: [0] },
        { texte: `Tracer un arc de cercle de centre B et de rayon ${cm(a)}.`, apres: [0] },
        { texte: "Placer C, le point d'intersection des deux arcs.", apres: [1, 2] },
        { texte: "Tracer les segments [AC] et [BC].", apres: [3] }
      ]
    };
  },
  // 3 : rayon, diamètre, corde (fiche 1, exercice 7)
  () => {
    const r = alea(2, 4), O = { x: 210, y: 140 }, R = r * 25;
    const tA = alea(150, 200) * DEG, tE = alea(-60, 20) * DEG;
    const A = V.plus(O, V.fois(V.angle(tA), R)), B = V.plus(O, V.fois(V.angle(tA + Math.PI), R)), E = V.plus(O, V.fois(V.angle(tE), R));
    return {
      figure: figureProgramme(s => {
        dessinerCercle(s, O, R, "geo-cercle-fin");
        for (const [p, q] of [[A, B], [A, E], [O, E]]) dessinerTrait(s, p, q, "segment", "geo-objet");
        dessinerPoint(s, O, "O", { vers: { x: 0, y: 1 } }); dessinerPoint(s, A, "A", { vers: V.moins(A, O) });
        dessinerPoint(s, B, "B", { vers: V.moins(B, O) }); dessinerPoint(s, E, "E", { vers: V.moins(E, O) });
        dessinerTexte(s, { x: 210, y: 268 }, "OA = " + cm(r), "geo-cote");
      }),
      trous: [
        { texte: `1. Tracer un cercle de centre O et de [s] ${cm(r)}.`, options: ["rayon", "diamètre", "corde"] },
        { texte: "2. Placer un point A sur le cercle, puis tracer le [s] [AB].", options: ["diamètre", "rayon", "arc"] },
        { texte: "3. Placer un point E sur le cercle, puis tracer la [s] [AE].", options: ["corde", "rayon", "diamètre"] },
        { texte: "4. Tracer le [s] [OE].", options: ["rayon", "diamètre", "corde"] }
      ],
      etapes: [
        { texte: `Tracer un cercle de centre O et de rayon ${cm(r)}.` },
        { texte: "Placer un point A sur le cercle.", apres: [0] },
        { texte: "Tracer le diamètre [AB].", apres: [1] },
        { texte: "Placer un point E sur le cercle, puis tracer la corde [AE].", apres: [1] },
        { texte: "Tracer le rayon [OE].", apres: [3] }
      ]
    };
  },
  // 4 : cercle circonscrit (fiche 5, exercice 4)
  () => {
    const O = { x: 210, y: 140 }, R = 95;
    const pts = [alea(200, 230), alea(310, 340), alea(70, 110)].map(t => V.plus(O, V.fois(V.angle(t * DEG), R)));
    const [E, F, G] = pts;
    return {
      figure: figureProgramme(s => {
        dessinerCercle(s, O, R, "geo-cercle-fin");
        for (const [p, q] of [[E, F], [F, G], [G, E]]) dessinerTrait(s, p, q, "segment", "geo-objet");
        for (const [p, q] of [[E, F], [F, G]]) { const m = V.milieu(p, q), n = V.normal(V.unitaire(V.moins(q, p))); dessinerTrait(s, V.plus(m, V.fois(n, 120)), V.moins(m, V.fois(n, 120)), "segment", "geo-pointille"); }
        dessinerPoint(s, O, "O", { vers: { x: 1, y: 1 } });
        dessinerPoint(s, E, "E", { vers: V.moins(E, O) }); dessinerPoint(s, F, "F", { vers: V.moins(F, O) }); dessinerPoint(s, G, "G", { vers: V.moins(G, O) });
      }),
      etapes: [
        { texte: "Tracer un triangle EFG." },
        { texte: "Construire la médiatrice du segment [EF].", apres: [0] },
        { texte: "Construire la médiatrice du segment [FG].", apres: [0] },
        { texte: "Placer O, le point d'intersection des deux médiatrices.", apres: [1, 2] },
        { texte: "Tracer le cercle de centre O passant par E.", apres: [3] }
      ]
    };
  },
  // 5 : symétrique au compas (fiche 6)
  () => {
    const M = { x: 130, y: 90 }, E = { x: 250, y: 60 }, F = { x: 250, y: 230 }, M2 = { x: 370, y: 90 };
    return {
      figure: figureProgramme(s => {
        dessinerTrait(s, { x: 250, y: 15 }, { x: 250, y: 270 }, "segment", "geo-trait");
        dessinerTexte(s, { x: 266, y: 26 }, "(d)", "geo-nom");
        arcSimple(s, E, dist(E, M), angleDe(E, M2) - 0.3, angleDe(E, M2) + 0.3); arcSimple(s, F, dist(F, M), angleDe(F, M2) - 0.25, angleDe(F, M2) + 0.25);
        dessinerPoint(s, M, "M", { vers: { x: -1, y: 0 } }); dessinerPoint(s, M2, "M′", { vers: { x: 1, y: 0 } });
        dessinerPoint(s, E, "E", { vers: { x: -1, y: 0 } }); dessinerPoint(s, F, "F", { vers: { x: -1, y: 0 } });
      }),
      etapes: [
        { texte: "Tracer une droite (d) et placer un point M qui n'est pas sur (d)." },
        { texte: "Placer deux points E et F sur la droite (d).", apres: [0] },
        { texte: "Tracer un arc de cercle de centre E passant par M.", apres: [1] },
        { texte: "Tracer un arc de cercle de centre F passant par M.", apres: [1] },
        { texte: "Placer M′, le point d'intersection des deux arcs.", apres: [2, 3] }
      ]
    };
  }
];

/* ---------- Figures composées (feuille 4) ---------- */
function figureComposee() {
  const type = choisir(["demi", "quart", "stade", "carre", "troisQuarts"]);
  const s = figureGeo(W, H, "Figure");
  let P, calcul, exact;
  if (type === "demi") {
    const d = choisir([4, 5, 6, 7, 8, 9, 10, 12]), R = 75, C = { x: 180, y: 160 };
    s.append(svg("path", { d: `M${C.x - R},${C.y} A${R},${R} 0 0 1 ${C.x + R},${C.y} Z`, class: "geo-forme" }));
    dessinerTexte(s, { x: C.x, y: C.y + 22 }, String(d), "geo-cote");
    exact = Math.PI * d / 2 + d;
    calcul = `P = ${PI} × ${nb(d)} ÷ 2 + ${nb(d)}`;
    P = "un demi-disque : la moitié du cercle, plus le diamètre";
  } else if (type === "quart") {
    const r = choisir([3, 4, 5, 6, 8, 10]), R = 130, C = { x: 115, y: 190 };
    s.append(svg("path", { d: `M${C.x},${C.y} L${C.x + R},${C.y} A${R},${R} 0 0 0 ${C.x},${C.y - R} Z`, class: "geo-forme" }));
    dessinerTexte(s, { x: C.x + R / 2, y: C.y + 20 }, String(r), "geo-cote");
    dessinerTexte(s, { x: C.x - 14, y: C.y - R / 2 }, String(r), "geo-cote");
    codageAngleDroit(s, C, { x: 1, y: 0 }, { x: 0, y: -1 });
    exact = 2 * Math.PI * r / 4 + 2 * r;
    calcul = `P = 2 × ${PI} × ${nb(r)} ÷ 4 + ${nb(r)} + ${nb(r)}`;
    P = "un quart de disque : le quart du cercle, plus deux rayons";
  } else if (type === "troisQuarts") {
    const r = choisir([2, 3, 4, 5, 6]), R = 80, C = { x: 180, y: 115 };
    s.append(svg("path", { d: `M${C.x},${C.y} L${C.x + R},${C.y} A${R},${R} 0 1 1 ${C.x},${C.y - R} Z`, class: "geo-forme" }));
    dessinerTexte(s, { x: C.x + R / 2, y: C.y - 8 }, String(r), "geo-cote");
    codageAngleDroit(s, C, { x: 1, y: 0 }, { x: 0, y: -1 });
    exact = 2 * Math.PI * r * 3 / 4 + 2 * r;
    calcul = `P = 2 × ${PI} × ${nb(r)} × 3 ÷ 4 + ${nb(r)} + ${nb(r)}`;
    P = "les trois quarts d'un disque : les trois quarts du cercle, plus deux rayons";
  } else if (type === "stade") {
    const L = choisir([6, 8, 10, 12]), d = choisir([3, 4, 5, 6]), l = 170, h = 80, x0 = 95, y0 = 70;
    s.append(svg("path", { d: `M${x0},${y0} L${x0 + l},${y0} A${h / 2},${h / 2} 0 0 1 ${x0 + l},${y0 + h} L${x0},${y0 + h} A${h / 2},${h / 2} 0 0 1 ${x0},${y0} Z`, class: "geo-forme" }));
    dessinerTrait(s, { x: x0, y: y0 }, { x: x0, y: y0 + h }, "segment", "geo-pointille");
    dessinerTrait(s, { x: x0 + l, y: y0 }, { x: x0 + l, y: y0 + h }, "segment", "geo-pointille");
    dessinerTexte(s, { x: x0 + l / 2, y: y0 - 12 }, String(L), "geo-cote");
    dessinerTexte(s, { x: x0 + l - 14, y: y0 + h / 2 }, String(d), "geo-cote");
    exact = 2 * L + Math.PI * d;
    calcul = `P = ${nb(L)} + ${nb(L)} + ${PI} × ${nb(d)}`;
    P = "deux segments et deux demi-cercles, qui forment ensemble un cercle entier";
  } else {
    const a = choisir([4, 5, 6, 8, 10]), c = 110, x0 = 125, y0 = 95;
    s.append(svg("path", { d: `M${x0},${y0} A${c / 2},${c / 2} 0 0 1 ${x0 + c},${y0} L${x0 + c},${y0 + c} L${x0},${y0 + c} Z`, class: "geo-forme" }));
    dessinerTrait(s, { x: x0, y: y0 }, { x: x0 + c, y: y0 }, "segment", "geo-pointille");
    dessinerTexte(s, { x: x0 + c / 2, y: y0 + c + 20 }, String(a), "geo-cote");
    codageAngleDroit(s, { x: x0, y: y0 + c }, { x: 1, y: 0 }, { x: 0, y: -1 }); codageAngleDroit(s, { x: x0 + c, y: y0 + c }, { x: -1, y: 0 }, { x: 0, y: -1 });
    dessinerTexte(s, { x: x0 + c / 2, y: y0 + c / 2 }, "carré", "geo-cote");
    exact = 3 * a + Math.PI * a / 2;
    calcul = `P = 3 × ${nb(a)} + ${PI} × ${nb(a)} ÷ 2`;
    P = "trois côtés du carré et un demi-cercle (le quatrième côté est à l'intérieur)";
  }
  return { s, exact, calcul, explication: P };
}

/* =====================================================================
   LES ACTIVITÉS
   ===================================================================== */
const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "vocabulaire",
    titre: "Centre, rayon, diamètre, corde",
    description: "Nommer les éléments d'un cercle et passer du rayon au diamètre.",
    generer() {
      const [K, R, S, T, U, Vn] = tirerLettres(6);
      const s = figureGeo(W, H, "Cercle");
      const C = { x: 180, y: 115 }, ray = 85;
      let angles;
      do { angles = [alea(0, 359), alea(0, 359), alea(0, 359), alea(0, 359)]; }
      while (!(() => {
        const [a1, a2, a3, a4] = angles, tous = [a1, a1 + 180, a2, a3, a4];
        const d = (x, y) => Math.abs(((x - y) % 360 + 540) % 360 - 180);
        for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) if (d(tous[i], tous[j]) < 34) return false;
        return d(a3, a4) > 60 && d(a3, a4) < 130;
      })());
      const pt = t => V.plus(C, V.fois(V.angle(-t * DEG), ray));
      const pR = pt(angles[0]), pS = pt(angles[0] + 180), pT = pt(angles[1]), pU = pt(angles[2]), pV = pt(angles[3]);
      dessinerCercle(s, C, ray, "geo-cercle-fin");
      for (const [p, q] of [[pR, pS], [C, pT], [pU, pV]]) dessinerTrait(s, p, q, "segment", "geo-objet");
      dessinerPoint(s, C, K, { vers: { x: -0.4, y: 1 } });
      for (const [p, n] of [[pR, R], [pS, S], [pT, T], [pU, U], [pV, Vn]]) dessinerPoint(s, p, n, { vers: V.moins(p, C) });
      const lignes = melanger([
        { t: `${K} est`, o: ["le centre du cercle", "un point du cercle", "un diamètre"], c: `${K} est le centre du cercle` },
        { t: `[${K}${T}] est`, o: ["un rayon", "un diamètre", "une corde"], c: `[${K}${T}] est un rayon : il joint le centre à un point du cercle` },
        { t: `[${R}${S}] est`, o: ["un diamètre", "un rayon", "un arc de cercle"], c: `[${R}${S}] est un diamètre : c'est une corde qui passe par le centre` },
        { t: `[${U}${Vn}] est`, o: ["une corde", "un rayon", "un diamètre"], c: `[${U}${Vn}] est une corde : elle joint deux points du cercle, sans passer par le centre` },
        { t: `[${K}${R}] (non tracé) est`, o: ["un rayon", "un diamètre", "une corde"], c: `[${K}${R}] est aussi un rayon` }
      ]).slice(0, 3);
      const r = alea(12, 45) / 10, versDiametre = Math.random() < 0.5;
      const num = versDiametre
        ? { t: `${K}${T} = ${cm(r)}, donc ${R}${S} =`, rep: 2 * r, c: `${R}${S} = 2 × ${K}${T} = 2 × ${nb(r)} = ${cm(2 * r)} (le diamètre est le double du rayon)` }
        : { t: `${R}${S} = ${cm(2 * r)}, donc ${K}${U} =`, rep: r, c: `${K}${U} = ${R}${S} ÷ 2 = ${cm(r)} ([${K}${U}] est un rayon : la moitié du diamètre)` };
      const ordres = lignes.map(l => melanger(l.o.map((o, i) => ({ o, i }))));
      return {
        consigne: "Complète à l'aide de la figure.",
        figure: s,
        classeLigne: "etapes",
        ligne: lignes.map(l => `<div class="etape-pb enonce-ligne"><span>${l.t}</span>[s]</div>`).join("") + `<div class="etape-pb enonce-ligne"><span>${num.t}</span>[d]<span>cm</span></div>`,
        listes: ordres.map(o => o.map(x => x.o)),
        verifier(v) {
          if (v.slice(0, 3).some(x => x == null) || v[3] === "") return { etat: "incomplet", message: "Réponds aux quatre lignes." };
          const fausses = ordres.map((o, i) => o[v[i]].i === 0 ? 0 : i + 1).filter(Boolean);
          const n = verifierNombre(v[3], num.rep);
          if (n.etat === "incomplet") return n;
          if (n.etat === "faux") fausses.push(4);
          return fausses.length ? { etat: "faux", message: `À revoir : ligne${fausses.length > 1 ? "s" : ""} ${fausses.join(", ")}.` } : { etat: "juste" };
        },
        indice: "Un rayon joint le centre à un point du cercle ; une corde joint deux points du cercle ; un diamètre est une corde qui passe par le centre. Le diamètre est le double du rayon.",
        correction: lignes.map(l => l.c).join(" ; ") + " ; " + num.c + "."
      };
    }
  },

  {
    groupe: F1,
    id: "rayon-diametre",
    titre: "Rayon ou diamètre ?",
    description: "Compléter un tableau : le diamètre est le double du rayon.",
    generer() {
      const unites = ["cm", "cm", "m", "mm", "km"];
      const cols = Array.from({ length: 4 }, () => {
        const u = choisir(unites), r = Math.random() < 0.5 ? alea(1, 30) : alea(5, 95) / 10;
        return { u, r, donne: Math.random() < 0.5 ? "r" : "d" };
      });
      const cellule = (c, quoi) => c.donne === quoi ? unite(quoi === "r" ? c.r : 2 * c.r, c.u) : `[d] ${c.u}`;
      const table = `<table class="tab-effectifs"><tr><th>Rayon</th>${cols.map(c => `<td>${cellule(c, "r")}</td>`).join("")}</tr><tr><th>Diamètre</th>${cols.map(c => `<td>${cellule(c, "d")}</td>`).join("")}</tr></table>`;
      // ordre des cases : d'abord la ligne « rayon », puis la ligne « diamètre »
      const attendus = [...cols.filter(c => c.donne === "d").map(c => c.r), ...cols.filter(c => c.donne === "r").map(c => 2 * c.r)];
      return {
        consigne: "Complète le tableau.",
        ligne: table,
        verifier(v) {
          if (v.some(x => x === "")) return { etat: "incomplet", message: "Complète toutes les cases du tableau." };
          const faux = attendus.filter((a, i) => verifierNombre(v[i], a).etat !== "juste").length;
          return faux ? { etat: "faux", message: `${faux > 1 ? faux + " cases sont fausses" : "Une case est fausse"}.` } : { etat: "juste" };
        },
        indice: "Diamètre = 2 × rayon, et rayon = diamètre ÷ 2.",
        correction: cols.map(c => `rayon ${unite(c.r, c.u)} → diamètre ${unite(2 * c.r, c.u)}`).join(" ; ") + "."
      };
    }
  },

  {
    groupe: F1,
    id: "appartenance",
    titre: "Sur le cercle, dans le disque ?",
    description: "Comparer la distance au centre et le rayon, puis compléter avec ∈ ou ∉.",
    generer() {
      const [O, ...pts] = tirerLettres(4);
      const r = alea(20, 50) / 10, avecDiametre = Math.random() < 0.35;
      const distances = melanger([r, arrondi(r - alea(3, 15) / 10, 1), arrondi(r + alea(2, 15) / 10, 1)]);
      if (avecDiametre && Math.random() < 0.7) distances[distances.indexOf(Math.max(...distances))] = 2 * r; // piège : OM = diamètre
      const donnees = avecDiametre ? `de diamètre ${cm(2 * r)}` : `de rayon ${cm(r)}`;
      const lignes = [];
      pts.forEach((p, i) => { lignes.push({ p, objet: "𝒞", ok: Math.abs(distances[i] - r) < 1e-9 }, { p, objet: "𝒟", ok: distances[i] <= r + 1e-9 }); });
      return {
        consigne: `𝒞 et 𝒟 sont le cercle et le disque de centre ${O} et ${donnees}. On sait que ${pts.map((p, i) => `${O}${p} = ${cm(distances[i])}`).join(", ")}. Complète avec ∈ ou ∉.`,
        classeLigne: "etapes",
        ligne: lignes.map(l => `<div class="etape-pb enonce-ligne"><span>${l.p}</span>[s]<span>${l.objet}</span></div>`).join(""),
        listes: lignes.map(() => ["∈", "∉"]),
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Réponds à toutes les lignes." };
          const fausses = lignes.map((l, i) => (v[i] === 0) !== l.ok ? i + 1 : 0).filter(Boolean);
          if (!fausses.length) return { etat: "juste" };
          return { etat: "faux", message: `À revoir : ligne${fausses.length > 1 ? "s" : ""} ${fausses.join(", ")}.` + (avecDiametre ? ` Attention : on donne le diamètre, le rayon mesure ${cm(r)}.` : "") };
        },
        indice: `Compare chaque distance au rayon : égale → sur le cercle (et dans le disque) ; plus petite → dans le disque seulement ; plus grande → ni l'un ni l'autre.`,
        correction: (avecDiametre ? `Le rayon mesure ${nb(2 * r)} ÷ 2 = ${cm(r)}. ` : "") + pts.map((p, i) => `${O}${p} = ${cm(distances[i])} : ${p} ${lignes[2 * i].ok ? "∈" : "∉"} 𝒞 et ${p} ${lignes[2 * i + 1].ok ? "∈" : "∉"} 𝒟`).join(" ; ") + "."
      };
    }
  },

  {
    groupe: F1,
    id: "tracer-cercle",
    titre: "Tracer un cercle au compas",
    description: "De centre O et de rayon donné, passant par un point, ou de diamètre donné.",
    generer() {
      const s = figureConstruction();
      const type = choisir(["rayon", "rayon", "passant", "diametre"]);
      const aimants = [];
      const compas = creerCompas(s, { aimants, P: { x: CW - 90, y: CH - 60 }, r: 1.5 * CM, a: Math.PI });
      const verifierCercle = (C, r, nomC) => {
        if (cercleTrace(compas.arcs, C, r)) return true;
        const autour = arcsDeCentre(compas.arcs, C);
        if (!compas.arcs.length) return "Trace le cercle : fais tourner le compas avec la poignée ↻, sur un tour complet.";
        if (!autour.length) return `La pointe du compas doit être sur ${nomC}.`;
        if (!autour.some(a => Math.abs(a.r - r) < 0.1 * CM)) return `L'écartement n'est pas le bon : il doit être de ${cm(arrondi(r / CM, 1))}.`;
        return "Le cercle n'est pas complet : fais un tour entier avec la poignée ↻.";
      };
      if (type === "rayon") {
        const [O] = tirerLettres(1), r = choisir([1.5, 2, 2.5, 3, 3.5, 4, 2.4, 3.2, 2.8]);
        const C = { x: 280 + alea(-40, 40), y: 210 + alea(-20, 20) };
        aimants.push(C);
        dessinerPoint(s, C, O, { vers: { x: -0.6, y: -1 } });
        return atelier(s, [{
          nom: "Tracer le cercle",
          texte: `Trace le cercle de centre ${O} et de rayon ${cm(r)} : pointe sur ${O}, écartement ${cm(r)} (regarde la valeur affichée), puis un tour complet avec ↻.`,
          compas: () => verifierCercle(C, r * CM, O),
          montrer: () => { compas.placer(C, r * CM, 0); compas.tracer(0, 2 * Math.PI); },
          fin: `Bravo ! Tous les points de ce cercle sont à ${cm(r)} de ${O}.`
        }], { compas, consigne: "Fais glisser le compas : la pointe pour le déplacer, la mine pour régler l'écartement, la poignée ↻ pour tracer." });
      }
      if (type === "passant") {
        const [P, A] = tirerLettres(2);
        const C = { x: 260 + alea(-30, 30), y: 210 + alea(-20, 20) }, d = alea(18, 38) / 10, t = alea(0, 359) * DEG;
        const M = V.plus(C, V.fois(V.angle(t), d * CM));
        aimants.push(C, M);
        dessinerPoint(s, C, P, { vers: { x: -0.6, y: -1 } }); dessinerPoint(s, M, A, { vers: V.moins(M, C) });
        return atelier(s, [{
          nom: "Tracer le cercle",
          texte: `Trace le cercle de centre ${P} passant par ${A} : pointe sur ${P}, mine sur ${A}, puis un tour complet avec ↻.`,
          compas: () => verifierCercle(C, dist(C, M), P),
          montrer: () => { compas.placer(C, dist(C, M), t); compas.tracer(t, t + 2 * Math.PI); },
          fin: `Bravo ! Le rayon de ce cercle est ${P}${A}.`
        }], { compas, consigne: "Fais glisser le compas : la pointe pour le déplacer, la mine pour régler l'écartement, la poignée ↻ pour tracer." });
      }
      // de diamètre [EF] : mesurer, calculer, placer le milieu, tracer
      const [E, F, I] = tirerLettres(3);
      const L = alea(24, 34) * 2 / 10, alpha = alea(-12, 12), u = V.angle(-alpha * DEG);
      const A = { x: 170 + alea(0, 30), y: 200 }, B = V.plus(A, V.fois(u, L * CM)), M = V.milieu(A, B);
      aimants.push(A, B, M);
      dessinerTrait(s, A, B, "segment", "geo-trait-fin");
      dessinerPoint(s, A, E, { vers: V.fois(u, -1) }); dessinerPoint(s, B, F, { vers: u });
      const regle = creerRegle(11);
      regle.placer(40, 340, 0);
      s.insertBefore(regle, compas.noeud);
      const mRegle = rendreMobile(s, regle, { points: [A, B], angles: [-alpha, 180 - alpha] });
      return atelier(s, [
        { nom: "Mesurer", texte: `Mesure [${E}${F}] avec la règle (fais-la glisser, poignée ↻ pour la tourner).`, champ: `${E}${F} = [d] cm`,
          valider: v => Math.abs(v - L) < 0.05 || `Vérifie ta mesure : le zéro de la règle sur ${E}.`, montrer: () => regle.placer(A.x, A.y, -alpha), reponse: L },
        { nom: "Le centre", texte: `Le centre du cercle de diamètre [${E}${F}] est le milieu ${I} de [${E}${F}]. Calcule ${E}${I}.`, champ: `${E}${I} = [d] cm`,
          valider: v => Math.abs(v - L / 2) < 0.05 || `Le milieu est à la moitié : ${nb(L)} ÷ 2.`, reponse: L / 2 },
        { nom: "Placer le milieu", texte: `Clique sur le segment pour placer ${I} à ${cm(L / 2)} de ${E}.`,
          clic: { depart: A, direction: u, longueur: L, nom: I, cible: L / 2, message: t => `Ton point est à ${cm(t)} de ${E} : il doit être à ${cm(L / 2)}.` },
          dessin: () => dessinerPoint(s, M, I, { vers: V.normal(u) }) },
        { nom: "Tracer", texte: `Trace le cercle de centre ${I} passant par ${E} : pointe sur ${I}, mine sur ${E}, un tour complet avec ↻.`,
          avant: () => { regle.classList.add("range"); compas.premierPlan(); },
          compas: () => verifierCercle(M, L / 2 * CM, I),
          montrer: () => { const t = angleDe(M, A); compas.placer(M, L / 2 * CM, t); compas.tracer(t, t + 2 * Math.PI); },
          fin: `Bravo ! [${E}${F}] est un diamètre de ce cercle.` }
      ], { compas, bloquerOutils: () => mRegle.bloquer() });
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "completer-programme",
    titre: "Compléter un programme de construction",
    description: "Choisir les bons mots pour que le programme donne la figure.",
    generer() {
      const prog = choisir([PROGRAMMES[0], PROGRAMMES[1], PROGRAMMES[2], PROGRAMMES[3]])();
      const trous = prog.trous, ordres = trous.map(t => melanger(t.options.map((o, i) => ({ o, i }))));
      return {
        consigne: "Complète le programme de construction qui permet d'obtenir cette figure (elle n'est pas en vraie grandeur).",
        figure: prog.figure,
        classeLigne: "etapes",
        ligne: trous.map(t => `<div class="etape-pb enonce-ligne">${t.texte.replace("[s]", "</span>[s]<span>").replace(/^/, "<span>")}</span></div>`).join(""),
        listes: ordres.map(o => o.map(x => x.o)),
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Complète chaque étape." };
          const fausses = ordres.map((o, i) => o[v[i]].i === 0 ? 0 : i + 1).filter(Boolean);
          return fausses.length ? { etat: "faux", message: `À revoir : étape${fausses.length > 1 ? "s" : ""} ${fausses.join(", ")}.` } : { etat: "juste" };
        },
        indice: "« de centre O passant par P » : la pointe en O, la mine en P. « de diamètre [AB] » : le centre est le milieu de [AB].",
        correction: trous.map(t => t.texte.replace("[s]", t.options[0])).join("<br>")
      };
    }
  },

  {
    groupe: F2,
    id: "ordre-programme",
    titre: "Remettre un programme dans l'ordre",
    description: "Ranger les étapes qui permettent d'obtenir la figure.",
    generer() {
      const prog = choisir(PROGRAMMES)();
      const etapes = prog.etapes;
      const zone = el("div", { class: "ordre-etapes" });
      const reserve = el("div", { class: "ordre-reserve" }), liste = el("ol", { class: "ordre-liste", "data-vide": "Clique sur les étapes dans l'ordre" });
      let actif = true;
      melanger([...etapes.keys()]).forEach(i => {
        const b = el("button", { type: "button", class: "ordre-etape", "data-i": String(i) }, etapes[i].texte);
        b.addEventListener("click", () => {
          if (!actif) return;
          if (b.parentNode === reserve) { const li = el("li"); li.append(b); liste.append(li); }
          else { const li = b.parentNode; reserve.append(b); li.remove(); }
        });
        reserve.append(b);
      });
      zone.append(liste, reserve);
      return {
        consigne: "Voici une figure. Remets dans l'ordre les étapes de son programme de construction : clique sur les étapes dans l'ordre (clique à nouveau sur une étape rangée pour la retirer).",
        figure: [prog.figure, zone],
        verifier() {
          const ordre = [...liste.querySelectorAll(".ordre-etape")].map(b => Number(b.dataset.i));
          if (ordre.length < etapes.length) return { etat: "incomplet", message: "Range toutes les étapes avant de valider." };
          const place = [];
          for (let k = 0; k < ordre.length; k++) {
            const i = ordre[k];
            const manque = (etapes[i].apres || []).filter(j => !place.includes(j));
            if (manque.length) return { etat: "faux", message: `L'étape n° ${k + 1} (« ${etapes[i].texte} ») arrive trop tôt : il faut d'abord « ${etapes[manque[0]].texte} ».` };
            place.push(i);
          }
          return { etat: "juste" };
        },
        indice: "Commence par ce qui ne dépend de rien. Un point, un cercle ou un arc ne peut être utilisé qu'après avoir été construit.",
        correction: "Un ordre possible :<br>" + etapes.map((e, k) => `${k + 1}. ${e.texte}`).join("<br>"),
        bloquer() { actif = false; }
      };
    }
  },

  {
    groupe: F2,
    id: "construire-triangle",
    titre: "Construire un triangle au compas",
    description: "Connaissant les longueurs de ses trois côtés.",
    generer() {
      const s = figureConstruction();
      const [A, B, C] = tirerLettres(3);
      const equi = Math.random() < 0.25;
      let a, b, c;
      if (equi) a = b = c = alea(4, 6);
      else do { c = alea(45, 65) / 10; b = alea(30, 55) / 10; a = alea(30, 55) / 10; } while (a + b <= c + 1 || Math.abs(a - b) < 0.3);
      const pA = { x: 320 - c * CM / 2, y: 330 }, pB = { x: 320 + c * CM / 2, y: 330 };
      const pC = intersectionCercles(pA, b * CM, pB, a * CM).sort((p, q) => p.y - q.y)[0];
      dessinerTrait(s, pA, pB, "segment", "geo-objet");
      dessinerPoint(s, pA, A, { vers: { x: -1, y: 0.5 } }); dessinerPoint(s, pB, B, { vers: { x: 1, y: 0.5 } });
      const compas = creerCompas(s, { aimants: [pA, pB], P: { x: CW - 80, y: 80 }, r: 1.5 * CM, a: Math.PI });
      const arcPar = (centre, r, nom, ecart) => {
        const liste = arcsDeCentre(compas.arcs, centre);
        if (!liste.length) return `Trace un arc : la pointe du compas en ${nom}.`;
        if (!liste.some(x => Math.abs(x.r - r * CM) < 0.1 * CM)) return `L'écartement doit être de ${cm(r)} ${ecart}.`;
        if (!liste.some(x => Math.abs(x.r - r * CM) < 0.1 * CM && arcPassePar(x, pC))) return `Ton arc n'est pas au bon endroit : trace-le au-dessus du segment, là où se trouvera ${C}.`;
        return true;
      };
      const montrerArc = (centre, r) => { const t = angleDe(centre, pC); compas.placer(centre, r * CM, t - 0.35); compas.tracer(t - 0.35, t + 0.35); };
      return atelier(s, [
        { nom: `Arc de centre ${A}`, texte: `Le côté [${A}${B}] est tracé (${cm(c)}). Trace un arc de cercle de centre ${A} et de rayon ${A}${C} = ${cm(b)}, au-dessus du segment.`,
          compas: () => arcPar(pA, b, A, `(c'est la longueur ${A}${C})`), montrer: () => montrerArc(pA, b) },
        { nom: `Arc de centre ${B}`, texte: `Trace un arc de cercle de centre ${B} et de rayon ${B}${C} = ${cm(a)}. Il doit couper le premier arc.`,
          compas: () => arcPar(pB, a, B, `(c'est la longueur ${B}${C})`), montrer: () => montrerArc(pB, a) },
        { nom: "Placer " + C, texte: `Clique sur le point d'intersection des deux arcs : c'est ${C}.`,
          point: { cible: pC, nom: C, tol: 10, vers: { x: 0, y: -1 } },
          dessin: () => { dessinerPoint(s, pC, C, { vers: { x: 0, y: -1 } }); dessinerTrait(s, pA, pC, "segment", "geo-trace"); dessinerTrait(s, pB, pC, "segment", "geo-trace"); },
          fin: `Bravo ! Le triangle ${A}${B}${C} est construit${equi ? " : il est équilatéral" : ""}.` }
      ], { compas, consigne: `Construis le triangle ${A}${B}${C} tel que ${A}${B} = ${cm(c)}, ${A}${C} = ${cm(b)} et ${B}${C} = ${cm(a)}.` });
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: F3,
    id: "ordre-grandeur",
    titre: "Un ordre de grandeur du périmètre",
    description: "De tête, en prenant 3 pour π.",
    generer() {
      const u = choisir(["cm", "m", "km"]), rayon = Math.random() < 0.4;
      const v = choisir([2, 3, 4, 5, 6, 8, 10, 20, 30, 50]);
      const D = rayon ? 2 * v : v, attendu = 3 * D;
      return {
        consigne: `En prenant 3 pour ${PI}, donne de tête un ordre de grandeur du périmètre d'un disque de ${rayon ? "rayon" : "diamètre"} ${unite(v, u)}.`,
        ligne: `P ≈ [d] ${u}`,
        verifier(x) {
          const r = verifierNombre(x[0], attendu);
          if (r.etat === "faux" && rayon && Math.abs(lireNombre(x[0]) - 3 * v) < 1e-9) r.message = "Attention : on donne le rayon. Le diamètre est le double.";
          return r;
        },
        indice: `P = ${PI} × D ≈ 3 × D.`,
        correction: rayon ? `D = 2 × ${nb(v)} = ${unite(D, u)}, donc P ≈ 3 × ${nb(D)} = ${unite(attendu, u)}.` : `P ≈ 3 × ${nb(D)} = ${unite(attendu, u)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "perimetre",
    titre: "Calculer le périmètre d'un disque",
    description: "Choisir la formule, calculer avec π, arrondir.",
    generer() {
      const u = choisir(["cm", "cm", "m", "dm", "km", "mm"]), rayon = Math.random() < 0.5;
      const v = choisir([alea(2, 30), alea(15, 95) / 10]);
      const prec = choisir(PRECISIONS.slice(Math.random() < 0.2 ? 0 : 1));
      const D = rayon ? 2 * v : v, exact = Math.PI * D;
      const formules = ["P = π × D", "P = 2 × π × r", "P = π × r", "P = 2 × π × D"];
      return {
        consigne: `Un disque a pour ${rayon ? "rayon" : "diamètre"} ${unite(v, u)}. Calcule son périmètre, arrondi ${prec.nom}.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb enonce-ligne"><span>Formule :</span>[s]</div><div class="etape-pb enonce-ligne"><span>P ≈</span>[d]<span>${u}</span></div>`,
        listes: [formules],
        verifier(x) {
          if (x[0] == null || x[1] === "") return { etat: "incomplet", message: "Choisis la formule et écris le résultat." };
          if (x[0] >= 2) return { etat: "faux", message: `La formule n'est pas bonne : P = π × D, ou P = 2 × π × r (le diamètre, c'est 2 fois le rayon).` };
          const r = verifierArrondi(x[1], exact, prec.p, [[Math.PI * v * (rayon ? 1 : 2), rayon ? "Tu as utilisé le rayon comme si c'était le diamètre." : "Tu as doublé le diamètre : on donne déjà le diamètre."], [3.14 * D, `Utilise la touche ${PI} de la calculatrice, pas 3,14.`]]);
          return r;
        },
        indice: rayon ? `On connaît le rayon : P = 2 × ${PI} × r.` : `On connaît le diamètre : P = ${PI} × D.`,
        correction: (rayon ? `P = 2 × ${PI} × r = 2 × ${PI} × ${nb(v)}` : `P = ${PI} × D = ${PI} × ${nb(v)}`) + ` ≈ ${nb(exact.toFixed(5) * 1)}… donc P ≈ ${unite(arrondi(exact, prec.p), u)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "relier-perimetre",
    titre: "Relier chaque disque à son périmètre",
    description: "Attention au rayon et au diamètre !",
    generer() {
      let a, b;
      do { a = alea(1, 6); b = alea(1, 9); } while (a === b || a === 2 * b || b === 2 * a);
      const items = [
        { html: `Rayon ${cm(a)}`, p: 2 * Math.PI * a }, { html: `Diamètre ${cm(a)}`, p: Math.PI * a },
        { html: `Rayon ${cm(b)}`, p: 2 * Math.PI * b }, { html: `Diamètre ${cm(b)}`, p: Math.PI * b }
      ];
      const w = relier(items.map((it, i) => ({ html: it.html, cle: i })), items.map((it, i) => ({ html: cm(arrondi(it.p, 2)), cle: i })));
      return {
        consigne: "Relie chaque disque à son périmètre, arrondi au centième : clique à gauche, puis à droite.",
        figure: w.noeud,
        verifier: () => w.verifier(),
        indice: `Rayon r : P = 2 × ${PI} × r. Diamètre D : P = ${PI} × D.`,
        correction: items.map(it => `${it.html} → ${cm(arrondi(it.p, 2))}`).join(" ; ") + ".",
        surCorrection: () => w.corriger(),
        bloquer: () => w.bloquer()
      };
    }
  },

  {
    groupe: F3,
    id: "tableau-perimetre",
    titre: "Rayon, diamètre, périmètre",
    description: "Compléter un tableau, périmètres arrondis au dixième.",
    generer() {
      const cols = Array.from({ length: 4 }, () => ({ r: choisir([alea(1, 25), alea(5, 45) / 10]), donne: Math.random() < 0.5 ? "r" : "d" }));
      const u = choisir(["cm", "m"]);
      const lignes = [["Rayon", c => c.donne === "r" ? unite(c.r, u) : null, c => c.r], ["Diamètre", c => c.donne === "d" ? unite(2 * c.r, u) : null, c => 2 * c.r], ["Périmètre", () => null, c => 2 * Math.PI * c.r]];
      const attendus = [];
      const table = `<table class="tab-effectifs">${lignes.map(([titre, donne, val], li) => `<tr><th>${titre}</th>${cols.map(c => {
        const d = donne(c);
        if (d) return `<td>${d}</td>`;
        attendus.push({ v: val(c), perim: li === 2 });
        return `<td>[d] ${u}</td>`;
      }).join("")}</tr>`).join("")}</table>`;
      return {
        consigne: "Complète le tableau. Arrondis les périmètres au dixième.",
        ligne: table,
        verifier(v) {
          if (v.some(x => x === "")) return { etat: "incomplet", message: "Complète toutes les cases du tableau." };
          const faux = attendus.filter((a, i) => (a.perim ? verifierArrondi(v[i], a.v, 1) : verifierNombre(v[i], a.v)).etat !== "juste").length;
          return faux ? { etat: "faux", message: `${faux > 1 ? faux + " cases sont fausses" : "Une case est fausse"}.` } : { etat: "juste" };
        },
        indice: `D = 2 × r ; P = ${PI} × D (puis arrondir au dixième).`,
        correction: cols.map(c => `r = ${unite(c.r, u)}, D = ${unite(2 * c.r, u)}, P ≈ ${unite(arrondi(2 * Math.PI * c.r, 1), u)}`).join(" ; ") + "."
      };
    }
  },

  {
    groupe: F3,
    id: "trouver-erreur",
    titre: "Trouver l'erreur",
    description: "Repérer l'erreur d'un élève, puis donner le bon résultat.",
    generer() {
      const prenom = choisir(["Léo", "Inès", "Sami", "Jade", "Noah", "Lina", "Tom", "Maël"]);
      const cas = choisir(["rayon", "double", "arrondi", "pi"]);
      let phrase, exact, p = 1;
      const v = alea(3, 15);
      if (cas === "rayon") { exact = 2 * Math.PI * v; phrase = `« Un disque de rayon ${cm(v)} a pour périmètre ${PI} × ${nb(v)} ≈ ${cm(arrondi(Math.PI * v, 1))}. »`; }
      else if (cas === "double") { exact = Math.PI * v; phrase = `« Un disque de diamètre ${cm(v)} a pour périmètre 2 × ${PI} × ${nb(v)} ≈ ${cm(arrondi(2 * Math.PI * v, 1))}. »`; }
      else if (cas === "arrondi") { exact = Math.PI * v; const faux = Math.floor(exact * 100) / 100 === arrondi(exact, 1) ? Math.floor(exact * 100 + 1) / 100 : Math.floor(exact * 100) / 100; phrase = `« Un disque de diamètre ${cm(v)} a pour périmètre, arrondi au dixième, P ≈ ${cm(faux)}. »`; }
      else { exact = Math.PI * v; p = 2; phrase = `« Un disque de diamètre ${cm(v)} a pour périmètre, arrondi au centième, P ≈ 3 × ${nb(v)} = ${cm(3 * v)}. »`; }
      const erreurs = ["Le rayon a été utilisé comme si c'était le diamètre.", "Le diamètre a été doublé alors que ce n'était pas le rayon.", "Le résultat n'est pas arrondi au bon rang.", `${PI} a été remplacé par 3 : ce n'est qu'un ordre de grandeur.`];
      const bonne = { rayon: 0, double: 1, arrondi: 2, pi: 3 }[cas];
      const ordre = melanger(erreurs.map((e, i) => ({ e, i })));
      return {
        consigne: `${prenom} a écrit : ${phrase} Quelle est son erreur ? Donne ensuite le bon résultat, arrondi ${p === 1 ? "au dixième" : "au centième"}.`,
        classeLigne: "etapes",
        ligne: `<div class="etape"><span class="mot">L'erreur :</span>[s]</div><div class="etape-pb enonce-ligne"><span>Le bon résultat : P ≈</span>[d]<span>cm</span></div>`,
        listes: [ordre.map(o => o.e)],
        verifier(x) {
          if (x[0] == null || x[1] === "") return { etat: "incomplet", message: "Choisis l'erreur et écris le bon résultat." };
          if (ordre[x[0]].i !== bonne) return { etat: "faux", message: "Ce n'est pas la bonne erreur : refais le calcul toi-même et compare." };
          return verifierArrondi(x[1], exact, p);
        },
        indice: `Refais le calcul : P = ${PI} × D ou P = 2 × ${PI} × r, avec la touche ${PI}, puis arrondis.`,
        correction: `${erreurs[bonne]} Le bon calcul : ${cas === "rayon" ? `P = 2 × ${PI} × ${nb(v)}` : `P = ${PI} × ${nb(v)}`} ≈ ${cm(arrondi(exact, p))}.`
      };
    }
  },

  {
    groupe: F3,
    id: "a-l-envers",
    titre: "À l'envers : du périmètre au diamètre",
    description: "Retrouver le diamètre ou le rayon d'un disque.",
    generer() {
      const u = choisir(["cm", "m"]), P = alea(10, 120), chercheRayon = Math.random() < 0.45;
      const D = P / Math.PI, exact = chercheRayon ? D / 2 : D;
      return {
        consigne: `Un disque a un périmètre de ${unite(P, u)}. Quel est son ${chercheRayon ? "rayon" : "diamètre"}, arrondi au dixième ?`,
        ligne: `${chercheRayon ? "r" : "D"} ≈ [d] ${u}`,
        verifier: x => verifierArrondi(x[0], exact, 1, [[P * Math.PI, `On ne multiplie pas : P = ${PI} × D, donc D = P ÷ ${PI}.`], [D, "Ça, c'est le diamètre : le rayon est la moitié."], [D / 2, "Ça, c'est le rayon : le diamètre est le double."]].filter((_, i) => i === 0 || (i === 1 ? chercheRayon : !chercheRayon))),
        indice: `P = ${PI} × D, donc D = P ÷ ${PI}${chercheRayon ? ", puis r = D ÷ 2" : ""}.`,
        correction: `D = ${nb(P)} ÷ ${PI} ≈ ${nb(arrondi(D, 3))}…${chercheRayon ? `, donc r = D ÷ 2 ≈ ${unite(arrondi(exact, 1), u)}` : `, donc D ≈ ${unite(arrondi(exact, 1), u)}`}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "figures-composees",
    titre: "Périmètre de figures composées",
    description: "Demi-disque, quart de disque, stade… sans oublier les segments.",
    generer() {
      const f = figureComposee();
      return {
        consigne: "Calcule le périmètre de cette figure, arrondi au dixième. Les longueurs sont en cm.",
        figure: f.s,
        ligne: "P ≈ [d] cm",
        verifier: x => verifierArrondi(x[0], f.exact, 1),
        indice: "Le périmètre, c'est la longueur du tour de la figure : les morceaux de cercle, mais aussi les segments droits.",
        correction: `La figure est formée de ${f.explication}. ${f.calcul} ≈ ${cm(arrondi(f.exact, 1))}.`
      };
    }
  },

  {
    groupe: F4,
    id: "problemes",
    titre: "Problèmes de périmètre",
    description: "La roue, le bassin, la piste, le compteur.",
    generer() {
      const cas = choisir(["roue", "bassin", "piste", "compteur"]);
      if (cas === "roue") {
        const d = choisir([50, 55, 60, 65, 70, 75]), n = choisir([10, 20, 50, 100, 200]);
        const p1 = Math.PI * d, pn = n * Math.PI * d / 100;
        return {
          consigne: `La roue d'un vélo a un diamètre de ${unite(d, "cm")}.`,
          classeLigne: "etapes",
          ligne: `<div class="etape-pb"><p>a. Quelle distance le vélo parcourt-il quand la roue fait un tour ? (arrondie au dixième)</p><div class="rep">[d] cm</div></div><div class="etape-pb"><p>b. Et quand la roue fait ${n} tours ? Donne le résultat en mètres, arrondi au dixième.</p><div class="rep">[d] m</div></div>`,
          verifier(x) {
            if (x.some(v => v === "")) return { etat: "incomplet", message: "Réponds aux deux questions." };
            const a = verifierArrondi(x[0], p1, 1), b = verifierArrondi(x[1], pn, 1, [[n * Math.PI * d, "Convertis en mètres : 1 m = 100 cm."]]);
            if (a.etat === "juste" && b.etat === "juste") return { etat: "juste" };
            return { etat: "faux", message: (a.etat !== "juste" ? "Question a : " + (a.message || "revois le calcul.") + " " : "") + (b.etat !== "juste" ? "Question b : " + (b.message || "revois le calcul.") : "") };
          },
          indice: `En un tour, la roue parcourt son périmètre : ${PI} × D.`,
          correction: `a. P = ${PI} × ${d} ≈ ${unite(arrondi(p1, 1), "cm")}. b. ${n} × ${PI} × ${d} ≈ ${unite(arrondi(n * p1, 1), "cm")}, soit environ ${unite(arrondi(pn, 1), "m")}.`
        };
      }
      if (cas === "bassin") {
        const r = choisir([2, 2.5, 3, 3.5, 4, 5, 6]), prix = choisir([8, 9, 10, 12, 15]);
        const P = 2 * Math.PI * r, metres = Math.ceil(P);
        return {
          consigne: `Un bassin circulaire a un rayon de ${unite(r, "m")}. On veut l'entourer de grillage, vendu par mètres entiers à ${prix} € le mètre.`,
          classeLigne: "etapes",
          ligne: `<div class="etape-pb"><p>a. Calcule le périmètre du bassin, arrondi au centième.</p><div class="rep">[d] m</div></div><div class="etape-pb"><p>b. Combien de mètres de grillage faut-il acheter ?</p><div class="rep">[n] m</div></div><div class="etape-pb"><p>c. Combien cela coûte-t-il ?</p><div class="rep">[d] €</div></div>`,
          verifier(x) {
            if (x.some(v => v === "")) return { etat: "incomplet", message: "Réponds aux trois questions." };
            const a = verifierArrondi(x[0], P, 2), b = verifierNombre(x[1], metres), c = verifierNombre(x[2], metres * prix);
            if (b.etat === "faux" && lireNombre(x[1]) === Math.floor(P)) b.message = `${Math.floor(P)} m ne suffisent pas pour faire tout le tour !`;
            const msgs = [["a", a], ["b", b], ["c", c]].filter(([, r]) => r.etat !== "juste").map(([q, r]) => `Question ${q} : ${r.message || "revois le calcul."}`);
            return msgs.length ? { etat: "faux", message: msgs.join(" ") } : { etat: "juste" };
          },
          indice: "Le grillage doit faire tout le tour : on arrondit au mètre supérieur.",
          correction: `a. P = 2 × ${PI} × ${nb(r)} ≈ ${unite(arrondi(P, 2), "m")}. b. Il faut ${metres} m (${metres - 1} ne suffisent pas). c. ${metres} × ${prix} = ${metres * prix} €.`
        };
      }
      if (cas === "piste") {
        const L = choisir([80, 84, 85, 90, 100]), D = choisir([60, 64, 70, 73]);
        const P = 2 * L + Math.PI * D;
        return {
          consigne: `Une piste d'athlétisme est formée de deux lignes droites de ${unite(L, "m")} et de deux demi-cercles de diamètre ${unite(D, "m")}. Calcule la longueur d'un tour, arrondie au mètre.`,
          ligne: "Un tour ≈ [n] m",
          verifier: x => verifierArrondi(x[0], P, 0, [[2 * L + Math.PI * D / 2, "Il y a deux demi-cercles : ensemble, ils forment un cercle entier."], [Math.PI * D, "N'oublie pas les deux lignes droites."]]),
          indice: "Les deux demi-cercles forment ensemble un cercle entier.",
          correction: `2 × ${L} + ${PI} × ${D} ≈ ${unite(arrondi(P, 0), "m")}.`
        };
      }
      const d = choisir([50, 60, 70, 80]), km = choisir([1, 2, 5]);
      const tours = km * 100000 / (Math.PI * d);
      return {
        consigne: `La roue d'une trottinette a un diamètre de ${unite(d, "cm")}. Combien de tours complets doit-elle faire pour parcourir ${unite(km, "km")} ?`,
        ligne: "[n] tours",
        verifier(x) {
          const v = lireEntier(x[0]);
          if (isNaN(v)) return { etat: "incomplet", message: "Écris un nombre entier de tours." };
          if (v === Math.ceil(tours)) return { etat: "juste" };
          if (v === Math.floor(tours)) return { etat: "faux", message: `Avec ${v} tours, on n'a pas tout à fait parcouru ${unite(km, "km")}.` };
          return { etat: "faux", message: "Convertis d'abord la distance en cm, puis divise par le périmètre de la roue." };
        },
        indice: `${unite(km, "km")} = ${unite(km * 100000, "cm")}. Un tour = ${PI} × ${d} cm.`,
        correction: `${nb(km * 100000)} ÷ (${PI} × ${d}) ≈ ${nb(arrondi(tours, 1))} : il faut ${Math.ceil(tours)} tours complets.`
      };
    }
  },

  /* ================= Feuille 5 ================= */

  {
    groupe: F5,
    id: "est-ce-la-mediatrice",
    titre: "Est-ce la médiatrice ?",
    description: "Avec le codage, ou avec les arcs du compas.",
    generer() {
      const [X, Y] = tirerLettres(2);
      const s = figureGeo(W, H, "Segment et droite");
      const A = { x: 110 + alea(-10, 10), y: 120 }, B = { x: 250 + alea(-10, 10), y: 120 }, M = V.milieu(A, B), n = { x: 0, y: -1 };
      const cas = choisir(["oui", "milieu", "perp", "arcs-oui", "arcs-ecart"]);
      let options, bonne, correction;
      dessinerTrait(s, A, B, "segment", "geo-objet");
      dessinerPoint(s, A, X, { vers: { x: -1, y: 0.4 } }); dessinerPoint(s, B, Y, { vers: { x: 1, y: 0.4 } });
      if (cas.startsWith("arcs")) {
        const r1 = 0.68 * dist(A, B), r2 = cas === "arcs-oui" ? r1 : r1 * choisir([0.82, 1.2]);
        const pts = intersectionCercles(A, r1, B, r2);
        for (const [C, r] of [[A, r1], [B, r2]]) for (const P of pts) { const t = angleDe(C, P); arcSimple(s, C, r, t - 0.28, t + 0.28, "compas-arc"); }
        dessinerDroite(s, pts[0], V.unitaire(V.moins(pts[1], pts[0])), "(d)", W, H);
        dessinerTexte(s, { x: A.x - 12, y: 200 }, `rayon ${cm(arrondi(r1 / 28, 1))}`, "geo-cote");
        dessinerTexte(s, { x: B.x + 12, y: 200 }, `rayon ${cm(arrondi(r2 / 28, 1))}`, "geo-cote");
        options = ["Oui : les arcs ont le même écartement", "Non : les arcs n'ont pas le même écartement", "Non : (d) n'est pas perpendiculaire"];
        bonne = cas === "arcs-oui" ? 0 : 1;
        correction = cas === "arcs-oui" ? `Les arcs de centres ${X} et ${Y} ont le même rayon : leurs points d'intersection sont à égale distance de ${X} et de ${Y}, donc (d) est la médiatrice de [${X}${Y}].`
          : `Les arcs n'ont pas le même rayon : les points d'intersection ne sont pas à égale distance de ${X} et de ${Y}. (d) est perpendiculaire à [${X}${Y}] mais ne passe pas par son milieu.`;
      } else {
        let O = M, d = n;
        if (cas === "milieu") O = V.plus(A, V.fois(V.moins(B, A), choisir([0.3, 0.68])));
        if (cas === "perp") d = V.angle(-choisir([60, 120]) * DEG);
        dessinerDroite(s, O, d, "(d)", W, H);
        codageLongueur(s, A, M, 2); codageLongueur(s, M, B, 2);
        if (cas !== "perp") codageAngleDroit(s, O, { x: 1, y: 0 }, n);
        options = ["Oui", "Non : elle ne passe pas par le milieu", "Non : elle n'est pas perpendiculaire"];
        bonne = { oui: 0, milieu: 1, perp: 2 }[cas];
        correction = { oui: `(d) est perpendiculaire à [${X}${Y}] et passe par son milieu : c'est la médiatrice.`, milieu: "(d) est perpendiculaire au segment mais ne passe pas par son milieu.", perp: "(d) passe par le milieu, mais elle n'est pas perpendiculaire au segment." }[cas];
      }
      return {
        consigne: `La droite (d) est-elle la médiatrice du segment [${X}${Y}] ?`,
        figure: s,
        choix: options,
        verifier: (v, c) => ({ etat: c === options[bonne] ? "juste" : "faux" }),
        indice: `La médiatrice est perpendiculaire au segment et passe par son milieu. Au compas, on trace des arcs de même écartement, centrés en ${X} et en ${Y}.`,
        correction
      };
    }
  },

  {
    groupe: F5,
    id: "proprietes-mediatrice",
    titre: "Utiliser la médiatrice sans mesurer",
    description: "Longueurs égales, triangle isocèle, point à égale distance.",
    generer() {
      const [A, B, I, M, N] = tirerLettres(5);
      const ab = alea(40, 80) / 10, ma = arrondi(ab / 2 + alea(5, 30) / 10, 1), nb_ = arrondi(ab / 2 + alea(8, 35) / 10, 1);
      const s = figureGeo(W, H, "Médiatrice");
      const pA = { x: 110, y: 120 }, pB = { x: 250, y: 120 }, pI = V.milieu(pA, pB), pM = { x: 180, y: 40 }, pN = { x: 180, y: 205 };
      dessinerTrait(s, { x: 180, y: 8 }, { x: 180, y: 222 }, "segment", "geo-trait");
      dessinerTexte(s, { x: 196, y: 18 }, "(d)", "geo-nom");
      dessinerTrait(s, pA, pB, "segment", "geo-objet");
      for (const [p, q] of [[pM, pA], [pM, pB]]) dessinerTrait(s, p, q, "segment", "geo-trait-fin");
      dessinerPoint(s, pA, A, { vers: { x: -1, y: 0.3 } }); dessinerPoint(s, pB, B, { vers: { x: 1, y: 0.3 } });
      dessinerPoint(s, pI, I, { vers: { x: 0.8, y: 1 } }); dessinerPoint(s, pM, M, { vers: { x: 1, y: -0.3 } }); dessinerPoint(s, pN, N, { vers: { x: 1, y: 0.3 } });
      codageAngleDroit(s, pI, { x: 1, y: 0 }, { x: 0, y: -1 }); codageLongueur(s, pA, pI, 2); codageLongueur(s, pI, pB, 2);
      const opts = [[M, A, B, I], ["sur la médiatrice (d)", `au milieu de [${A}${B}]`, `sur le segment [${A}${B}]`]].map(o => melanger(o.map((x, i) => ({ x, i }))));
      const x = alea(25, 60) / 10;
      return {
        consigne: `(d) est la médiatrice de [${A}${B}]. ${M} et ${N} sont sur (d). On sait que ${A}${B} = ${cm(ab)}, ${M}${A} = ${cm(ma)} et ${N}${B} = ${cm(nb_)}. Complète sans mesurer.`,
        figure: s,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb enonce-ligne"><span>${A}${I} =</span>[d]<span>cm</span></div><div class="etape-pb enonce-ligne"><span>${M}${B} =</span>[d]<span>cm</span></div><div class="etape-pb enonce-ligne"><span>${N}${A} =</span>[d]<span>cm</span></div><div class="etape-pb enonce-ligne"><span>Le triangle ${M}${A}${B} est isocèle en</span>[s]</div><div class="etape-pb enonce-ligne"><span>Un point P vérifie P${A} = P${B} = ${cm(x)}. Il se trouve</span>[s]</div>`,
        listes: opts.map(o => o.map(y => y.x)),
        verifier(v) {
          if (v.some(y => y === "" || y == null)) return { etat: "incomplet", message: "Réponds à toutes les lignes." };
          const fausses = [];
          [ab / 2, ma, nb_].forEach((a, i) => { if (verifierNombre(v[i], a).etat !== "juste") fausses.push(i + 1); });
          if (opts[0][v[3]].i !== 0) fausses.push(4);
          if (opts[1][v[4]].i !== 0) fausses.push(5);
          return fausses.length ? { etat: "faux", message: `À revoir : ligne${fausses.length > 1 ? "s" : ""} ${fausses.join(", ")}.` } : { etat: "juste" };
        },
        indice: "Le milieu partage le segment en deux ; un point de la médiatrice est à égale distance des extrémités ; et un point à égale distance des extrémités est sur la médiatrice.",
        correction: `${A}${I} = ${nb(ab)} ÷ 2 = ${cm(ab / 2)} (milieu) ; ${M}${B} = ${M}${A} = ${cm(ma)} et ${N}${A} = ${N}${B} = ${cm(nb_)} (points de la médiatrice) ; ${M}${A}${B} est isocèle en ${M} ; P est sur la médiatrice (d).`
      };
    }
  },

  {
    groupe: F5,
    id: "mediatrice-compas",
    titre: "Construire la médiatrice au compas",
    description: "Deux arcs de même écartement de chaque côté, puis la droite.",
    generer() {
      const s = figureConstruction();
      const [X, Y] = tirerLettres(2);
      const L = alea(40, 70) / 10, alpha = alea(-20, 20) * DEG;
      const A = { x: 320 - L * CM / 2 * Math.cos(alpha), y: 210 - L * CM / 2 * Math.sin(alpha) }, B = { x: 320 + L * CM / 2 * Math.cos(alpha), y: 210 + L * CM / 2 * Math.sin(alpha) };
      dessinerTrait(s, A, B, "segment", "geo-objet");
      dessinerPoint(s, A, X, { vers: V.moins(A, B) }); dessinerPoint(s, B, Y, { vers: V.moins(B, A) });
      const compas = creerCompas(s, { aimants: [A, B], P: { x: CW - 80, y: CH - 50 }, r: 1.5 * CM, a: Math.PI });
      let pts = null;
      return atelier(s, [
        { nom: `Arcs de centre ${X}`, texte: `Pointe du compas en ${X}, écartement plus grand que la moitié de ${X}${Y} : trace un arc au-dessus du segment et un arc en dessous.`,
          compas: () => {
            const liste = arcsDeCentre(compas.arcs, A);
            if (!liste.length) return `Place la pointe du compas en ${X}, puis trace avec ↻.`;
            if (!liste.some(a => a.r > dist(A, B) / 2 + 2)) return `L'écartement est trop petit : il doit dépasser la moitié de ${X}${Y}.`;
            const ok = liste.some(a => { const p = intersectionCercles(A, a.r, B, a.r); return p.length && p.every(P => liste.some(x => Math.abs(x.r - a.r) < 0.1 * CM && arcPassePar(x, P))); });
            return ok || "Il faut un arc de chaque côté du segment, assez long (au-dessus et en dessous).";
          },
          montrer: () => { const r = dist(A, B) * 0.72; for (const P of intersectionCercles(A, r, B, r)) { const t = angleDe(A, P); compas.placer(A, r, t - 0.3); compas.tracer(t - 0.3, t + 0.3); } } },
        { nom: `Arcs de centre ${Y}`, texte: `Même écartement, pointe en ${Y} : trace deux arcs qui coupent les premiers.`,
          compas: () => { const r = mediatriceAuCompas(compas.arcs, A, B, X, Y); if (typeof r === "string") return r; pts = r.pts; return true; },
          montrer: () => { pts = montrerMediatrice(compas, A, B); } },
        { nom: "Tracer la droite", texte: "Les arcs se coupent en deux points. Clique sur « Tracer la droite » qui passe par ces deux points.", bouton: "Tracer la droite",
          tracer: () => { if (!pts) pts = intersectionCercles(A, dist(A, B) * 0.72, B, dist(A, B) * 0.72); return true; },
          dessin: () => { dessinerDroite(s, pts[0], V.unitaire(V.moins(pts[1], pts[0])), "(d)", CW, CH, "geo-trace"); for (const P of pts) dessinerPoint(s, P, "", {}); },
          fin: `Bravo ! Les deux points d'intersection sont à égale distance de ${X} et de ${Y} : (d) est la médiatrice de [${X}${Y}].` }
      ], { compas, consigne: `Construis au compas la médiatrice du segment [${X}${Y}].` });
    }
  },

  {
    groupe: F5,
    id: "cercle-circonscrit",
    titre: "Le cercle circonscrit",
    description: "Deux médiatrices au compas, puis le cercle qui passe par les trois sommets.",
    generer() {
      const s = figureConstruction();
      const [E, F, G, O] = tirerLettres(4);
      const C = { x: 300 + alea(-20, 20), y: 215 }, R = alea(30, 38) / 10 * CM;
      const pE = V.plus(C, V.fois(V.angle(alea(150, 185) * DEG), R)), pF = V.plus(C, V.fois(V.angle(alea(355, 390) * DEG), R)), pG = V.plus(C, V.fois(V.angle(alea(245, 290) * DEG), R));
      for (const [p, q] of [[pE, pF], [pF, pG], [pG, pE]]) dessinerTrait(s, p, q, "segment", "geo-objet");
      for (const [p, n] of [[pE, E], [pF, F], [pG, G]]) dessinerPoint(s, p, n, { vers: V.moins(p, C) });
      const aimants = [pE, pF, pG];
      const compas = creerCompas(s, { aimants, P: { x: CW - 70, y: CH - 50 }, r: 1.5 * CM, a: Math.PI });
      const etapeMed = (P, Q, nP, nQ) => {
        let pts = null;
        return {
          nom: `Médiatrice de [${nP}${nQ}]`, texte: `Construis au compas la médiatrice de [${nP}${nQ}] : des arcs de même écartement, centrés en ${nP} et en ${nQ}, qui se coupent de part et d'autre du côté.`,
          compas: () => { const r = mediatriceAuCompas(compas.arcs, P, Q, nP, nQ); if (typeof r === "string") return r; pts = r.pts; return true; },
          montrer: () => { pts = montrerMediatrice(compas, P, Q); },
          dessin: () => dessinerDroite(s, pts[0], V.unitaire(V.moins(pts[1], pts[0])), "", CW, CH, "geo-trace")
        };
      };
      return atelier(s, [
        etapeMed(pE, pF, E, F),
        etapeMed(pF, pG, F, G),
        { nom: "Le centre", texte: `Clique sur le point ${O} où les deux médiatrices se coupent.`, point: { cible: C, nom: O, tol: 9, message: "Ce n'est pas le point d'intersection des deux médiatrices." },
          dessin: () => { dessinerPoint(s, C, O, { vers: { x: 0.8, y: 1 } }); aimants.push(C); } },
        { nom: "Le cercle", texte: `Trace le cercle de centre ${O} passant par ${E} : pointe en ${O}, mine en ${E}, un tour complet avec ↻.`,
          compas: () => cercleTrace(compas.arcs, C, R) || (arcsDeCentre(compas.arcs, C).length ? "Le cercle doit passer par " + E + " et être complet (un tour entier avec ↻)." : `La pointe du compas doit être en ${O}.`),
          montrer: () => { const t = angleDe(C, pE); compas.placer(C, R, t); compas.tracer(t, t + 2 * Math.PI); },
          fin: `Bravo ! Le cercle passe par ${E}, ${F} et ${G} : c'est le cercle circonscrit au triangle.` }
      ], { compas, consigne: `Construis le cercle circonscrit au triangle ${E}${F}${G}.` });
    }
  },

  /* ================= Feuille 6 ================= */

  {
    groupe: F6,
    id: "symetrique-compas",
    titre: "Construire le symétrique d'un point au compas",
    description: "Deux arcs centrés sur l'axe, qui passent par le point.",
    generer() {
      const s = figureConstruction();
      const [M, E, F] = tirerLettres(3);
      const alpha = alea(60, 120) * DEG, u = V.angle(-alpha), O = { x: 330, y: 210 };
      dessinerDroite(s, O, u, "(d)", CW, CH, "geo-trait");
      const n = V.normal(u), dM = alea(25, 45) / 10 * CM, t = alea(-15, 15) / 10 * CM;
      const pM = V.plus(V.plus(O, V.fois(u, t)), V.fois(n, dM)), pM2 = V.plus(V.plus(O, V.fois(u, t)), V.fois(n, -dM));
      const pE = V.plus(O, V.fois(u, alea(25, 40) / 10 * CM)), pF = V.plus(O, V.fois(u, -alea(25, 40) / 10 * CM));
      dessinerPoint(s, pM, M, { vers: n });
      dessinerPoint(s, pE, E, { vers: V.fois(n, -1) }); dessinerPoint(s, pF, F, { vers: V.fois(n, -1) });
      const compas = creerCompas(s, { aimants: [pM, pE, pF], P: { x: 70, y: CH - 50 }, r: 1.5 * CM, a: 0 });
      const arcVers = (C, nom) => {
        const liste = arcsDeCentre(compas.arcs, C);
        if (!liste.length) return `Place la pointe du compas en ${nom}.`;
        if (!liste.some(a => Math.abs(a.r - dist(C, pM)) < 0.12 * CM)) return `L'arc doit passer par ${M} : mets la mine sur ${M}.`;
        if (!liste.some(a => arcPassePar(a, pM2))) return `Prolonge ton arc de l'autre côté de la droite (d) : c'est là que se trouvera ${M}′.`;
        return true;
      };
      const montrerArc = C => { const r = dist(C, pM), t1 = angleDe(C, pM), t2 = angleDe(C, pM2); compas.placer(C, r, t1); compas.tracer(t1, t1 + ((t2 - t1 + 3 * Math.PI) % (2 * Math.PI) - Math.PI) * 1.15); };
      return atelier(s, [
        { nom: `Arc de centre ${E}`, texte: `Trace un arc de cercle de centre ${E} passant par ${M} (pointe en ${E}, mine en ${M}), qui va de l'autre côté de (d).`, compas: () => arcVers(pE, E), montrer: () => montrerArc(pE) },
        { nom: `Arc de centre ${F}`, texte: `Trace un arc de cercle de centre ${F} passant par ${M}.`, compas: () => arcVers(pF, F), montrer: () => montrerArc(pF) },
        { nom: `Placer ${M}′`, texte: `Les deux arcs se coupent en ${M} et en un autre point : clique sur cet autre point, c'est ${M}′.`, point: { cible: pM2, nom: M + "′", tol: 9 },
          dessin: () => { dessinerPoint(s, pM2, M + "′", { vers: V.fois(n, -1) }); dessinerTrait(s, pM, pM2, "segment", "geo-pointille"); },
          fin: `Bravo ! (d) est la médiatrice de [${M}${M}′] : ${M}′ est le symétrique de ${M} par rapport à (d).` }
      ], { compas, consigne: `Construis au compas le point ${M}′, symétrique de ${M} par rapport à la droite (d).` });
    }
  },

  {
    groupe: F6,
    id: "bissectrice-calcul",
    titre: "Bissectrice : calculer un angle",
    description: "La bissectrice partage l'angle en deux angles égaux.",
    generer() {
      const xOy = angleNom("xOy"), xOz = angleNom("xOz"), zOy = angleNom("zOy");
      const cas = choisir(["moitie", "double", "plat", "demi"]);
      let consigne, ligne, attendu, correction;
      if (cas === "moitie") { const a = alea(10, 85) * 2; consigne = `Si ${xOy} = ${a}°, combien mesure ${xOz} ?`; ligne = `${xOz} = [d] °`; attendu = a / 2; correction = `${xOz} = ${a} ÷ 2 = ${a / 2}°.`; }
      else if (cas === "double") { const a = alea(10, 85); consigne = `Si ${zOy} = ${a}°, combien mesure ${xOy} ?`; ligne = `${xOy} = [d] °`; attendu = 2 * a; correction = `${xOy} = 2 × ${a} = ${2 * a}°.`; }
      else if (cas === "plat") { consigne = `Si ${xOy} est un angle plat, combien mesure ${xOz} ?`; ligne = `${xOz} = [d] °`; attendu = 90; correction = `Un angle plat mesure 180° : ${xOz} = 180 ÷ 2 = 90°.`; }
      else { const a = alea(11, 85) + 0.5; consigne = `Si ${xOz} = ${nb(a)}°, combien mesure ${xOy} ?`; ligne = `${xOy} = [d] °`; attendu = 2 * a; correction = `${xOy} = 2 × ${nb(a)} = ${nb(2 * a)}°.`; }
      const s = figureGeo(W, 190, "Angle et bissectrice");
      const O = { x: 70, y: 160 }, t = cas === "plat" ? 180 : 70;
      dessinerTrait(s, O, V.plus(O, V.fois(V.angle(0), 250)), "segment", "geo-objet");
      dessinerTrait(s, O, V.plus(O, V.fois(V.angle(-t * DEG), 150)), "segment", "geo-objet");
      dessinerTrait(s, O, V.plus(O, V.fois(V.angle(-t / 2 * DEG), 200)), "segment", "geo-trace");
      dessinerPoint(s, O, "O", { vers: { x: -1, y: 0.5 } });
      dessinerTexte(s, V.plus(O, V.fois(V.angle(0), 262)), "x", "geo-nom-angle");
      dessinerTexte(s, V.plus(O, V.fois(V.angle(-t * DEG), 165)), "y", "geo-nom-angle");
      dessinerTexte(s, V.plus(O, V.fois(V.angle(-t / 2 * DEG), 214)), "z", "geo-nom-angle");
      return {
        consigne: `[Oz) est la bissectrice de l'angle ${xOy}. ${consigne}`,
        figure: s, ligne,
        verifier: v => verifierNombre(v[0], attendu),
        indice: `La bissectrice partage l'angle en deux angles de même mesure : ${xOz} = ${zOy} = ${xOy} ÷ 2.`,
        correction
      };
    }
  },

  {
    groupe: F6,
    id: "bissectrice-compas",
    titre: "Construire la bissectrice au compas",
    description: "Un arc de centre O, deux arcs de même écartement, puis la demi-droite.",
    generer() {
      const s = figureConstruction();
      const theta = alea(45, 130), a0 = alea(-15, 10);
      const O = { x: 200, y: 330 }, u1 = V.angle(-a0 * DEG), u2 = V.angle(-(a0 + theta) * DEG);
      const L1 = 360, L2 = 280;
      dessinerTrait(s, O, V.plus(O, V.fois(u1, L1)), "segment", "geo-objet");
      dessinerTrait(s, O, V.plus(O, V.fois(u2, L2)), "segment", "geo-objet");
      dessinerPoint(s, O, "O", { vers: V.fois(V.plus(u1, u2), -1) });
      dessinerTexte(s, V.plus(O, V.fois(u1, L1 + 14)), "x", "geo-nom-angle");
      dessinerTexte(s, V.plus(O, V.fois(u2, L2 + 14)), "y", "geo-nom-angle");
      const aimants = [O];
      const compas = creerCompas(s, { aimants, P: { x: CW - 70, y: CH - 50 }, r: 1.5 * CM, a: Math.PI });
      let E = null, F = null, G = null, rEF = null;
      const bis = V.unitaire(V.plus(u1, u2));
      return atelier(s, [
        { nom: "Arc de centre O", texte: "Trace un arc de cercle de centre O qui coupe les deux côtés de l'angle.",
          compas: () => {
            const liste = arcsDeCentre(compas.arcs, O).filter(a => a.r > 1.2 * CM && a.r < 5.5 * CM);
            if (!arcsDeCentre(compas.arcs, O).length) return "Place la pointe du compas en O, puis trace avec ↻.";
            const bon = liste.find(a => arcPassePar(a, V.plus(O, V.fois(u1, a.r))) && arcPassePar(a, V.plus(O, V.fois(u2, a.r))));
            if (!bon) return "L'arc doit couper les deux côtés [Ox) et [Oy) : trace-le plus long (écartement entre 1,5 et 5 cm).";
            rEF = bon.r; E = V.plus(O, V.fois(u1, rEF)); F = V.plus(O, V.fois(u2, rEF));
            return true;
          },
          montrer: () => { rEF = 3.2 * CM; compas.placer(O, rEF, -a0 * DEG + 0.15); compas.tracer(-a0 * DEG + 0.15, -(a0 + theta) * DEG - 0.15); E = V.plus(O, V.fois(u1, rEF)); F = V.plus(O, V.fois(u2, rEF)); },
          dessin: () => { dessinerPoint(s, E, "E", { vers: { x: 0.3, y: 1 } }); dessinerPoint(s, F, "F", { vers: { x: -1, y: 0 } }); aimants.push(E, F); } },
        { nom: "Arcs de centres E et F", texte: "Avec un même écartement, trace un arc de centre E et un arc de centre F, qui se coupent à l'intérieur de l'angle.",
          compas: () => {
            const aE = arcsDeCentre(compas.arcs, E), aF = arcsDeCentre(compas.arcs, F);
            if (!aE.length || !aF.length) return `Il faut un arc de centre E et un arc de centre F.`;
            for (const a of aE) {
              if (!aF.some(b => Math.abs(b.r - a.r) < 0.1 * CM)) continue;
              const p = intersectionCercles(E, a.r, F, a.r).sort((P, Q) => dist(Q, O) - dist(P, O))[0];
              if (p && aE.some(x => arcPassePar(x, p)) && aF.some(x => Math.abs(x.r - a.r) < 0.1 * CM && arcPassePar(x, p))) { G = p; return true; }
            }
            return "Les deux arcs doivent avoir le même écartement et se couper à l'intérieur de l'angle.";
          },
          montrer: () => {
            const r = Math.max(dist(E, F) * 0.75, 2.2 * CM);
            G = intersectionCercles(E, r, F, r).sort((P, Q) => dist(Q, O) - dist(P, O))[0];
            for (const C of [E, F]) { const t = angleDe(C, G); compas.placer(C, r, t - 0.3); compas.tracer(t - 0.3, t + 0.3); }
          } },
        { nom: "Tracer [OG)", texte: "Les arcs se coupent en G. Clique sur « Tracer la demi-droite [OG) ».", bouton: "Tracer la demi-droite [OG)",
          tracer: () => true,
          dessin: () => { dessinerPoint(s, G, "G", { vers: bis }); dessinerTrait(s, O, V.plus(O, V.fois(V.unitaire(V.moins(G, O)), 400)), "segment", "geo-trace"); },
          fin: "Bravo ! [OG) est la bissectrice de l'angle : elle le partage en deux angles de même mesure." }
      ], { compas, consigne: `Construis au compas la bissectrice de l'angle ${angleNom("xOy")}.` });
    }
  },

  /* ================= Feuille 7 ================= */

  {
    groupe: F7,
    id: "traduire",
    titre: "Une phrase, une figure",
    description: "Cercle, disque, médiatrice ou demi-plan ?",
    generer() {
      const type = choisir(Object.keys(PHRASES_ZONES)), d = choisir([1, 1.5, 2, 2.5, 3, 4]);
      const autres = melanger(Object.keys(PHRASES_ZONES).filter(t => t !== type)).slice(0, 3);
      const options = melanger([type, ...autres]);
      return {
        consigne: `Quelle figure représente ${PHRASES_ZONES[type](d)} ? (en orange : la zone ; en bleu : la ligne)`,
        choix: options.map(t => miniFigure(t, d)),
        verifier: (v, c) => ({ etat: options[c] === type ? "juste" : "faux", message: options[c] !== type ? `Cette figure représente ${NOMS_ZONES[options[c]]}.` : "" }),
        indice: "« à d km » : le cercle ; « à moins de d km » : le disque ; « à égale distance de A et B » : la médiatrice ; « plus près de A » : du côté de A.",
        correction: `Ce sont les points de ${NOMS_ZONES[type]}.`
      };
    }
  },

  {
    groupe: F7,
    id: "selection-points",
    titre: "Quels points conviennent ?",
    description: "Sélectionner les points situés dans une zone, avec l'aide du compas.",
    generer() {
      const s = figureGeo(CW, 360, "Points");
      s.classList.add("construction", "geo-manipuler");
      const AB = alea(30, 40) / 10;
      const pA = { x: 320 - AB * CM / 2, y: 180 }, pB = { x: 320 + AB * CM / 2, y: 180 };
      const r1 = choisir([2.5, 3]), r2 = Math.max(choisir([1.5, 2, 2.5]), Math.ceil((AB + 1.2 - r1) * 2) / 2);
      const conditions = [
        { t: `à moins de ${cm(r1)} de A`, f: P => dist(P, pA) < r1 * CM, bords: P => [dist(P, pA) - r1 * CM], c: `les points du disque de centre A et de rayon ${cm(r1)}` },
        { t: `à plus de ${cm(r1)} de A`, f: P => dist(P, pA) > r1 * CM, bords: P => [dist(P, pA) - r1 * CM], c: `les points à l'extérieur du cercle de centre A et de rayon ${cm(r1)}` },
        { t: "plus près de A que de B", f: P => dist(P, pA) < dist(P, pB), bords: P => [dist(P, pA) - dist(P, pB)], c: "les points du côté de A par rapport à la médiatrice de [AB]" },
        { t: `à moins de ${cm(r1)} de A et plus près de B que de A`, f: P => dist(P, pA) < r1 * CM && dist(P, pB) < dist(P, pA), bords: P => [dist(P, pA) - r1 * CM, dist(P, pA) - dist(P, pB)], c: `les points du disque de centre A (rayon ${cm(r1)}) situés du côté de B par rapport à la médiatrice` },
        { t: `à moins de ${cm(r1)} de A et à moins de ${cm(r2)} de B`, f: P => dist(P, pA) < r1 * CM && dist(P, pB) < r2 * CM, bords: P => [dist(P, pA) - r1 * CM, dist(P, pB) - r2 * CM], c: `les points communs aux deux disques` }
      ];
      const cond = choisir(conditions);
      const noms = tirerLettres(12).filter(l => l !== "A" && l !== "B").slice(0, 9);
      // d'abord 3 points dans la zone et 3 en dehors, puis 3 au hasard
      const pts = [];
      const ajouter = (filtre, n) => {
        for (let essais = 0, k = 0; k < n && essais < 4000; essais++) {
          const P = { x: alea(40, CW - 40), y: alea(30, 330) };
          if (!filtre(P) || cond.bords(P).some(b => Math.abs(b) < 0.18 * CM)) continue;
          if (pts.some(Q => dist(P, Q) < 46) || dist(P, pA) < 30 || dist(P, pB) < 30) continue;
          pts.push(P); k++;
        }
      };
      ajouter(cond.f, 3); ajouter(P => !cond.f(P), 3); ajouter(() => true, 3);
      melanger(pts);
      dessinerPoint(s, pA, "A", { vers: { x: 0, y: 1 } }); dessinerPoint(s, pB, "B", { vers: { x: 0, y: 1 } });
      const choisis = new Set();
      let actif = true;
      const groupes = pts.map((P, i) => {
        const g = svg("g", { class: "pt-choix", tabindex: 0, role: "checkbox", "aria-checked": "false", "aria-label": "Point " + noms[i] },
          svg("circle", { cx: P.x, cy: P.y, r: 8 }), svg("text", { x: P.x + 16, y: P.y - 8 }, noms[i]));
        const basculer = () => { if (!actif) return; if (choisis.has(i)) choisis.delete(i); else choisis.add(i); g.classList.toggle("choisi", choisis.has(i)); g.setAttribute("aria-checked", String(choisis.has(i))); };
        g.addEventListener("pointerdown", e => { e.stopPropagation(); basculer(); });
        g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); basculer(); } });
        s.append(g);
        return g;
      });
      const { compas, barre } = figureAvecCompas(s, [pA, pB], { x: CW - 70, y: 320 });
      const bons = pts.map(cond.f);
      return {
        consigne: `Clique sur tous les points situés <strong>${cond.t}</strong>. AB = ${cm(AB)}. Tu peux utiliser le compas pour t'aider.`,
        figure: [s, barre],
        verifier() {
          if (!choisis.size) return { etat: "incomplet", message: "Clique sur les points qui conviennent." };
          const oublis = bons.filter((b, i) => b && !choisis.has(i)).length, trop = bons.filter((b, i) => !b && choisis.has(i)).length;
          if (!oublis && !trop) return { etat: "juste" };
          return { etat: "faux", message: [oublis ? `${oublis} point${oublis > 1 ? "s" : ""} oublié${oublis > 1 ? "s" : ""}` : "", trop ? `${trop} point${trop > 1 ? "s" : ""} en trop` : ""].filter(Boolean).join(", ") + "." };
        },
        indice: "Trace au compas les cercles utiles (et pense à la médiatrice de [AB] pour « plus près de »).",
        correction: `Il fallait sélectionner ${cond.c} : ${noms.filter((n, i) => bons[i]).join(", ")}.`,
        surCorrection() {
          if (cond.t.includes(cm(r1))) dessinerCercle(s, pA, r1 * CM, "geo-cercle");
          if (cond.t.includes(cm(r2)) && cond.t.includes("de B")) dessinerCercle(s, pB, r2 * CM, "geo-cercle");
          if (cond.t.includes("près")) dessinerDroite(s, V.milieu(pA, pB), { x: 0, y: 1 }, "", CW, 360, "geo-trace");
          groupes.forEach((g, i) => { if (bons[i]) g.classList.add("bon"); else if (choisis.has(i)) g.classList.add("mauvais"); });
        },
        bloquer() { actif = false; compas.bloquer(); }
      };
    }
  },

  {
    groupe: F7,
    id: "antennes",
    titre: "Les antennes",
    description: "Quels villages captent quelle antenne ? (avec l'échelle)",
    generer() {
      const s = figureGeo(CW, 380, "Carte");
      s.classList.add("construction", "geo-manipuler");
      s.append(svg("rect", { x: 0, y: 0, width: CW, height: 380, class: "carte-fond" }));
      const echelle = choisir([1, 2]);
      const pA = { x: 230 + alea(-20, 20), y: 190 + alea(-20, 20) }, pB = { x: 420 + alea(-20, 20), y: 190 + alea(-20, 20) };
      const kmA = arrondi(alea(20, 30) / 10 * echelle, 1), kmB = arrondi(alea(15, 25) / 10 * echelle, 1);
      const rA = kmA / echelle * CM, rB = kmB / echelle * CM;
      const cat = P => (dist(P, pA) <= rA ? 1 : 0) + (dist(P, pB) <= rB ? 2 : 0); // 0 aucune, 1 A, 2 B, 3 les deux
      let villages, tours = 0;
      do {
        villages = [];
        let essais = 0;
        while (villages.length < 5 && essais++ < 3000) {
          const P = { x: alea(40, CW - 40), y: alea(40, 340) };
          if (Math.abs(dist(P, pA) - rA) < 0.25 * CM || Math.abs(dist(P, pB) - rB) < 0.25 * CM) continue;
          if (villages.some(Q => dist(P, Q) < 70) || dist(P, pA) < 30 || dist(P, pB) < 30) continue;
          villages.push(P);
        }
      } while (new Set(villages.map(cat)).size < 3 && ++tours < 80);
      const sym = svg("g");
      for (const [P, n] of [[pA, "A"], [pB, "B"]]) sym.append(svg("path", { d: `M${P.x},${P.y} l-7,14 h14 z`, class: "carte-ville" }), svg("text", { x: P.x, y: P.y - 8, class: "carte-nom" }, "Antenne " + n));
      s.append(sym);
      villages.forEach((P, i) => s.append(svg("circle", { cx: P.x, cy: P.y, r: 6, class: "carte-ville" }), svg("text", { x: P.x, y: P.y - 12, class: "carte-nom" }, "V" + (i + 1))));
      // échelle
      s.append(svg("line", { x1: 30, y1: 360, x2: 30 + CM, y2: 360, stroke: "#1c2430", "stroke-width": 3 }), svg("text", { x: 30 + CM / 2, y: 350, class: "carte-echelle" }, `${unite(echelle, "km")}`));
      const { compas, barre } = figureAvecCompas(s, [pA, pB, ...villages], { x: CW - 70, y: 330 });
      const options = ["A seulement", "B seulement", "A et B", "aucune"];
      const rep = villages.map(P => ({ 1: 0, 2: 1, 3: 2, 0: 3 })[cat(P)]);
      return {
        consigne: `Sur la carte, 1 cm représente ${unite(echelle, "km")}. L'antenne A a une portée de ${unite(kmA, "km")}, l'antenne B une portée de ${unite(kmB, "km")}. Quelle(s) antenne(s) chaque village capte-t-il ? Trace les zones au compas.`,
        figure: [s, barre],
        classeLigne: "etapes",
        ligne: villages.map((P, i) => `<div class="etape-pb enonce-ligne"><span>V${i + 1} capte l'antenne :</span>[s]</div>`).join(""),
        listes: villages.map(() => options),
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Réponds pour chaque village." };
          const fausses = rep.map((r, i) => v[i] === r ? 0 : i + 1).filter(Boolean);
          return fausses.length ? { etat: "faux", message: `À revoir : V${fausses.join(", V")}.` } : { etat: "juste" };
        },
        indice: `Avec l'échelle : ${unite(kmA, "km")} sur le terrain, c'est ${cm(arrondi(kmA / echelle, 2))} sur la carte. La zone couverte est un disque de centre l'antenne.`,
        correction: `Zone de A : disque de centre A et de rayon ${cm(arrondi(kmA / echelle, 2))} ; zone de B : disque de rayon ${cm(arrondi(kmB / echelle, 2))}. ` + villages.map((P, i) => `V${i + 1} : ${options[rep[i]]}`).join(" ; ") + ".",
        surCorrection() { dessinerCercle(s, pA, rA, "geo-disque"); dessinerCercle(s, pB, rB, "geo-disque"); },
        bloquer() { compas.bloquer(); }
      };
    }
  },

  {
    groupe: F7,
    id: "tresor",
    titre: "La chasse au trésor",
    description: "À une distance donnée d'un point, et à égale distance de deux autres.",
    generer() {
      const s = figureGeo(CW, 400, "Carte");
      s.classList.add("construction", "geo-manipuler");
      s.append(svg("rect", { x: 0, y: 0, width: CW, height: 400, class: "carte-fond" }));
      const d = choisir([2, 2.5, 3]), P = { x: 300 + alea(-30, 30), y: 230 };
      let X, M, T, ok = false, tours = 0;
      while (!ok && tours++ < 5000) {
        X = V.plus(P, V.fois(V.angle(-alea(40, 140) * DEG), d * CM));
        const v = V.angle(alea(0, 179) * DEG), n = V.normal(v);
        // second point de la droite (X, v) sur le cercle : il doit être au sud du puits
        const t = -2 * ((X.x - P.x) * v.x + (X.y - P.y) * v.y), Y = V.plus(X, V.fois(v, t));
        if (Y.y < P.y + 25 || Math.abs(t) < 30) continue;
        const Q = V.plus(X, V.fois(v, alea(-60, 60))), e = alea(20, 32) / 10 * CM;
        M = V.plus(Q, V.fois(n, e)); T = V.moins(Q, V.fois(n, e));
        ok = [M, T].every(Z => Z.x > 40 && Z.x < CW - 40 && Z.y > 40 && Z.y < 360 && dist(Z, P) > 60 && dist(Z, X) > 40);
      }
      const lieu = (Z, nom) => { s.append(svg("circle", { cx: Z.x, cy: Z.y, r: 6, class: "carte-ville" }), svg("text", { x: Z.x, y: Z.y - 12, class: "carte-nom" }, nom)); };
      lieu(P, "puits P"); lieu(M, "moulin M"); lieu(T, "tour T");
      s.append(svg("path", { d: "M600,70 l-8,20 l8,-6 l8,6 z", fill: "#1c2430" }), svg("text", { x: 600, y: 62, class: "carte-nom" }, "N"));
      s.append(svg("line", { x1: 30, y1: 380, x2: 30 + CM, y2: 380, stroke: "#1c2430", "stroke-width": 3 }), svg("text", { x: 30 + CM / 2, y: 370, class: "carte-echelle" }, "1 km"));
      let marque = null, choisi = null, actif = true;
      s.addEventListener("pointerdown", e => {
        if (!actif || e.target.closest(".compas")) return;
        choisi = positionClic(s, e);
        marque?.remove();
        marque = dessinerPoint(s, choisi, "?", { classe: "geo-eleve" });
      });
      const { compas, barre } = figureAvecCompas(s, [P, M, T], { x: CW - 70, y: 350 });
      return {
        consigne: `Sur la carte, 1 cm représente 1 km. Le trésor est : à ${unite(d, "km")} exactement du puits P ; à égale distance du moulin M et de la tour T ; plus au nord que le puits. Clique pour placer le trésor (le compas peut t'aider).`,
        figure: [s, barre],
        verifier() {
          if (!choisi) return { etat: "incomplet", message: "Clique sur la carte pour placer le trésor." };
          if (dist(choisi, X) < 0.3 * CM) return { etat: "juste" };
          const surCercle = Math.abs(dist(choisi, P) - d * CM) < 0.3 * CM, surMed = Math.abs(dist(choisi, M) - dist(choisi, T)) < 0.4 * CM;
          return { etat: "faux", message: surCercle && surMed ? "Ce point vérifie les deux distances, mais il n'est pas au nord du puits." : surCercle ? "Ce point est bien à la bonne distance du puits, mais pas à égale distance de M et de T." : surMed ? "Ce point est bien à égale distance de M et de T, mais pas à la bonne distance du puits." : "" };
        },
        indice: `Le trésor est sur le cercle de centre P et de rayon ${cm(d)}, et sur la médiatrice de [MT].`,
        correction: `Le trésor est à l'intersection du cercle de centre P et de rayon ${cm(d)} et de la médiatrice de [MT] ; des deux points possibles, on garde celui qui est au nord du puits.`,
        surCorrection() {
          dessinerCercle(s, P, d * CM, "geo-cercle");
          const m = V.milieu(M, T), n = V.normal(V.unitaire(V.moins(T, M)));
          dessinerDroite(s, m, n, "", CW, 400, "geo-trace");
          dessinerPoint(s, X, "trésor", { classe: "geo-correct", vers: { x: 0, y: -1 } });
        },
        bloquer() { actif = false; compas.bloquer(); }
      };
    }
  }
];
