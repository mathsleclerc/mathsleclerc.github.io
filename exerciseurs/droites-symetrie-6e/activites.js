/* =====================================================================
   EXERCISEUR « DROITES, MÉDIATRICES ET SYMÉTRIE » — 6e, chapitre 2

   Les activités sont regroupées comme les quatre feuilles d'exercices.
   Chaque activité a un identifiant (utilisé dans l'adresse :
   …/droites-symetrie-6e/#notations), un titre, une description et une
   fonction generer() qui fabrique une question au hasard.
   ===================================================================== */

const F1 = "Feuille 1 — Vocabulaire, notations et milieu";
const F2 = "Feuille 2 — Perpendiculaires et parallèles";
const F3 = "Feuille 3 — Médiatrice et démonstration";
const F4 = "Feuille 4 — La symétrie axiale";

const W = 360, H = 210; // taille des figures

/* Propriétés du cours, telles qu'on les écrit après « Or : » */
const PROP = {
  mediatrice: "si un point appartient à la médiatrice d'un segment, alors il est à égale distance des deux extrémités.",
  reciproque: "si un point est à égale distance des deux extrémités d'un segment, alors il appartient à la médiatrice de ce segment.",
  symetrie: "la symétrie axiale conserve les longueurs.",
  milieu: "si un point est le milieu d'un segment, alors il le partage en deux longueurs égales, chacune égale à la moitié de la longueur du segment.",
  symLongueurs: "la symétrie axiale conserve les longueurs.",
  symAires: "la symétrie axiale conserve les aires.",
  symMilieux: "la symétrie axiale conserve les milieux.",
  symDefinition: "si un point M′ est le symétrique d'un point M par rapport à une droite (d), alors (d) est la médiatrice du segment [MM′].",
  symAxe: "si un point appartient à l'axe de symétrie, alors il est son propre symétrique."
};

/* Direction d'un angle en degrés (sens inverse des aiguilles d'une montre), dans le repère de l'écran */
const dir = phi => ({ x: Math.cos(phi * DEG), y: -Math.sin(phi * DEG) });

/* ---------- Démonstration : Je sais que / Or / Donc ----------
   sc : { enonce, sais: [bonne, fausses…], or, piege, donc: [bonne, fausses…] }
   pool : propriétés (clés de PROP) parmi lesquelles on tire les propositions fausses de « Or ». */
function demonstration(sc, pool) {
  const autres = melanger(pool.filter(k => k !== sc.or && k !== sc.piege)).slice(0, 2);
  const or = [sc.or, sc.piege, ...autres].map(k => PROP[k]);
  const listes = [sc.sais, or, sc.donc].map(l => melanger(l.map((t, i) => ({ t, i }))));
  const bonnes = listes.map(l => l.findIndex(o => o.i === 0));
  const etapes = ["Je sais que", "Or", "Donc"];
  return {
    consigne: `${sc.enonce}<br>Pour chaque étape, choisis la bonne phrase.`,
    classeLigne: "demo",
    ligne: etapes.map(e => `<div class="etape"><span class="mot">${e} :</span>[s]</div>`).join(""),
    listes: listes.map(l => l.map(o => o.t)),
    verifier(v) {
      if (v.some(x => x == null)) return { etat: "incomplet", message: "Choisis une phrase pour chacune des trois étapes." };
      const fausses = etapes.filter((e, k) => v[k] !== bonnes[k]);
      if (!fausses.length) return { etat: "juste" };
      const conseils = [`À revoir : ${fausses.map(e => "« " + e + " »").join(", ")}.`];
      if (listes[0][v[0]].i === 1) conseils.push("Dans « Je sais que », on écrit les informations de l'énoncé, pas ce que l'on veut démontrer.");
      if (listes[1][v[1]].i === 1) conseils.push("Attention à ne pas confondre deux propriétés qui se ressemblent : relis bien le « si » et le « alors ».");
      return { etat: "faux", message: conseils.join(" ") };
    },
    indice: "« Or » est une propriété du cours : son « si » doit correspondre à ce que tu sais, et son « alors » à ce que tu veux démontrer.",
    correction: etapes.map((e, k) => `<br><strong>${e} :</strong> ${[sc.sais, or, sc.donc][k][0]}`).join(""),
    surCorrection() {
      document.querySelectorAll(".ligne.demo .liste").forEach((l, k) => l.children[bonnes[k]].classList.add("bonne"));
    }
  };
}

/* ---------- Atelier de construction ----------
   Une suite d'étapes guidées. Chaque étape est l'une de :
   champ (une mesure ou un calcul à écrire), clic (placer un point sur une droite),
   tracer (placer l'équerre puis tracer), codage (choisir ce qu'il faut coder).
   Chaque étape a un bouton « Montre-moi ». */
function atelier(s, etapes, bloquerOutils) {
  const message = el("p", { class: "atelier-message" });
  const actions = el("div", { class: "atelier-actions" });
  const pastilles = el("div", { class: "etapes-construction" }, ...etapes.map(e => el("span", {}, e.nom)));
  const controle = el("div", { class: "atelier-controle" }, pastilles, message, actions);
  let k = -1, fini = false, clic = null, pointClic = null, actif = true, champ = null, choix = null;
  const dire = (t, type = "") => { message.innerHTML = t; message.className = "atelier-message " + type; };
  const bouton = (t, f, c = "") => el("button", { type: "button", class: "btn " + c, onclick: () => { if (actif) f(); } }, t);

  // Placer un point sur une droite par un clic (arrondi au millimètre)
  const placerPoint = t => {
    pointClic?.remove();
    pointClic = dessinerPoint(s, V.plus(clic.depart, V.fois(clic.direction, t * CM)), clic.nom, { vers: V.normal(clic.direction), classe: "geo-point-eleve" });
    clic.valeur = t;
  };
  // Phase de capture : un clic tout près de la droite place le point, même si une règle est posée dessus
  s.addEventListener("pointerdown", e => {
    if (!actif || !clic || e.target.closest(".outil-poignee")) return;
    const p = s.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(s.getScreenCTM().inverse());
    const r = V.moins(q, clic.depart);
    const distance = Math.abs(r.x * clic.direction.y - r.y * clic.direction.x);
    if (distance > (e.target.closest(".instrument") ? 12 : 24)) return; // trop loin : on laisse faire (déplacer la règle…)
    e.stopPropagation();
    let t = Math.round((r.x * clic.direction.x + r.y * clic.direction.y) / CM * 10) / 10;
    t = Math.min(clic.longueur, Math.max(clic.deuxSens ? -clic.longueur : 0, t));
    placerPoint(t);
  }, true);

  function etape(i) {
    k = i;
    const e = etapes[i];
    [...pastilles.children].forEach((p, j) => { p.className = j < i ? "faite" : j === i ? "en-cours" : ""; });
    e.avant?.();
    dire(e.texte);
    actions.replaceChildren();
    clic = null; pointClic = null; champ = null; choix = null;
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
      champ.focus({ preventScroll: true });
    } else if (e.clic) {
      clic = { ...e.clic, valeur: null };
      actions.append(bouton("OK", () => {
        if (clic.valeur == null) { dire("Clique sur la droite pour placer le point.", "attention"); return; }
        if (Math.abs(clic.valeur - clic.cible) < 0.05) { clic = null; reussir(); } else dire(e.clic.message(clic.valeur), "attention");
      }, "principal"));
    } else if (e.tracer) {
      actions.append(bouton("Tracer", () => {
        const r = e.tracer();
        if (r === true) reussir(); else dire(r, "attention");
      }, "principal"));
    } else if (e.codage) {
      choix = new Set();
      e.codage.forEach(([t], j) => {
        const b = el("button", { type: "button", class: "btn etiquette-choix", "aria-pressed": "false" }, t);
        b.addEventListener("click", () => { if (!actif) return; if (choix.has(j)) choix.delete(j); else choix.add(j); b.setAttribute("aria-pressed", String(choix.has(j))); });
        actions.append(b);
      });
      actions.append(bouton("OK", () => {
        const juste = e.codage.every(([, besoin], j) => besoin === choix.has(j));
        if (juste) reussir(); else dire("Pas tout à fait : on code ce qui montre que la droite est la médiatrice, et seulement cela.", "attention");
      }, "principal"));
    }
    actions.append(bouton("Montre-moi", () => montrer(e), "discret"));
  }

  function montrer(e) {
    e.montrer?.();
    if (e.champ) { champ.value = ecrireNombre(e.reponse); dire(`Regarde la règle : on lit ${ecrireNombre(e.reponse)}. Clique sur OK.`, "bien"); }
    else if (e.clic) { placerPoint(e.clic.cible); dire("Voici où placer le point. Clique sur OK.", "bien"); }
    else if (e.tracer) dire("Voici comment placer l'équerre. Clique sur « Tracer ».", "bien");
    else if (e.codage) {
      [...actions.querySelectorAll(".etiquette-choix")].forEach((b, j) => {
        const besoin = e.codage[j][1];
        if (besoin) choix.add(j); else choix.delete(j);
        b.setAttribute("aria-pressed", String(besoin));
      });
      dire("Voici ce qu'il faut coder. Clique sur OK.", "bien");
    }
  }

  function reussir() {
    const e = etapes[k];
    e.dessin?.();
    if (k + 1 < etapes.length) { etape(k + 1); return; }
    fini = true;
    [...pastilles.children].forEach(p => { p.className = "faite"; });
    s.querySelectorAll(".instrument").forEach(i => i.classList.add("range")); // on estompe les instruments
    actions.replaceChildren();
    dire((e.fin || "Construction terminée !") + " Clique sur « Valider ».", "bien");
  }

  etape(0);
  return {
    consigne: "Suis les étapes de la construction. Fais glisser les instruments, et tourne-les avec la poignée ↻. Si tu es bloqué, utilise « Montre-moi ».",
    figure: [s, controle],
    verifier: () => fini ? { etat: "juste" } : { etat: "incomplet", message: "Termine d'abord toutes les étapes de la construction." },
    indice: "Suis les étapes une par une ; le bouton « Montre-moi » aide à chaque étape.",
    correction: "Les étapes : " + etapes.map(e => e.nom.toLowerCase()).join(" → ") + ".",
    surCorrection() {
      // termine la construction à la place de l'élève
      while (!fini && k < etapes.length) {
        const e = etapes[k];
        e.montrer?.();
        if (e.clic) placerPoint(e.clic.cible);
        reussir();
      }
    },
    bloquer() { actif = false; bloquerOutils(); }
  };
}

/* ---------- Programmes de construction ----------
   Chaque programme donne sa figure et ses étapes ; « apres » : les étapes nécessaires avant. */
const PX = 30; // pixels par centimètre sur les figures des programmes
function figureProgramme(dessin) {
  const s = figureGeo(420, 300, "Figure à construire");
  dessin(s);
  return s;
}
const PROGRAMMES = [
  () => {
    const a = alea(5, 8), h = alea(2, 4);
    const A = { x: 210 - a * PX / 2, y: 220 }, B = { x: 210 + a * PX / 2, y: 220 }, I = { x: 210, y: 220 }, C = { x: 210, y: 220 - h * PX };
    return {
      figure: figureProgramme(s => {
        dessinerTrait(s, { x: 210, y: 260 }, { x: 210, y: 30 }, "segment", "geo-trait");
        dessinerTexte(s, { x: 226, y: 40 }, "(d)", "geo-nom");
        for (const [p, q] of [[A, B], [A, C], [B, C]]) dessinerTrait(s, p, q, "segment", "geo-objet");
        dessinerPoint(s, A, "A", { vers: { x: -1, y: 0.5 } }); dessinerPoint(s, B, "B", { vers: { x: 1, y: 0.5 } });
        dessinerPoint(s, I, "I", { vers: { x: -0.6, y: 1 } }); dessinerPoint(s, C, "C", { vers: { x: 1, y: -0.4 } });
        codageAngleDroit(s, I, { x: 1, y: 0 }, { x: 0, y: -1 }); codageLongueur(s, A, I, 2); codageLongueur(s, I, B, 2);
      }),
      etapes: [
        { texte: `Trace un segment [AB] de ${a} cm.` },
        { texte: "Place le milieu I de [AB].", apres: [0] },
        { texte: "Trace la droite (d) perpendiculaire à [AB] passant par I.", apres: [1] },
        { texte: `Place un point C sur (d) tel que IC = ${h} cm.`, apres: [2] },
        { texte: "Trace les segments [AC] et [BC].", apres: [3] }
      ]
    };
  },
  () => {
    const d = alea(2, 4);
    const H = { x: 210, y: 150 }, M = { x: 210 - d * PX, y: 150 }, M2 = { x: 210 + d * PX, y: 150 };
    return {
      figure: figureProgramme(s => {
        dessinerTrait(s, { x: 210, y: 20 }, { x: 210, y: 280 }, "segment", "geo-trait");
        dessinerTexte(s, { x: 226, y: 32 }, "(d)", "geo-nom");
        dessinerTrait(s, { x: M.x - 30, y: 150 }, { x: M2.x + 30, y: 150 }, "segment", "geo-trait-fin");
        dessinerPoint(s, M, "M", { vers: { x: 0, y: -1 } }); dessinerPoint(s, M2, "M′", { vers: { x: 0, y: -1 } }); dessinerPoint(s, H, "H", { vers: { x: 0.7, y: 1 } });
        codageAngleDroit(s, H, { x: 1, y: 0 }, { x: 0, y: -1 }); codageLongueur(s, M, H, 1); codageLongueur(s, H, M2, 1);
      }),
      etapes: [
        { texte: "Trace une droite (d)." },
        { texte: "Place un point M qui n'est pas sur (d).", apres: [0] },
        { texte: "Trace la perpendiculaire à (d) passant par M ; elle coupe (d) en H.", apres: [1] },
        { texte: "Place M′ sur cette perpendiculaire, de l'autre côté de (d), tel que HM′ = HM.", apres: [2] },
        { texte: "Code la figure (angle droit et longueurs égales).", apres: [3] }
      ]
    };
  },
  () => {
    const a = alea(5, 8), b = alea(3, 5);
    const A = { x: 210 - a * PX / 2, y: 240 }, B = { x: 210 + a * PX / 2, y: 240 }, C = { x: B.x, y: 240 - b * PX }, D = { x: A.x, y: 240 - b * PX };
    return {
      figure: figureProgramme(s => {
        dessinerTrait(s, { x: A.x, y: 275 }, { x: A.x, y: 20 }, "segment", "geo-trait-fin");
        dessinerTrait(s, { x: B.x, y: 275 }, { x: B.x, y: 20 }, "segment", "geo-trait-fin");
        for (const [p, q] of [[A, B], [B, C], [C, D], [D, A]]) dessinerTrait(s, p, q, "segment", "geo-objet");
        dessinerPoint(s, A, "A", { vers: { x: -1, y: 0.6 } }); dessinerPoint(s, B, "B", { vers: { x: 1, y: 0.6 } });
        dessinerPoint(s, C, "C", { vers: { x: 1, y: -0.6 } }); dessinerPoint(s, D, "D", { vers: { x: -1, y: -0.6 } });
        codageAngleDroit(s, A, { x: 1, y: 0 }, { x: 0, y: -1 }); codageAngleDroit(s, B, { x: -1, y: 0 }, { x: 0, y: -1 });
      }),
      etapes: [
        { texte: `Trace un segment [AB] de ${a} cm.` },
        { texte: "Trace la perpendiculaire à [AB] passant par A.", apres: [0] },
        { texte: "Trace la perpendiculaire à [AB] passant par B.", apres: [0] },
        { texte: `Place D sur la perpendiculaire passant par A, tel que AD = ${b} cm.`, apres: [1] },
        { texte: `Place C sur la perpendiculaire passant par B, du même côté que D, tel que BC = ${b} cm.`, apres: [2, 3] },
        { texte: "Trace le segment [DC].", apres: [3, 4] }
      ]
    };
  },
  () => {
    const A = { x: 200, y: 90 }, P = { x: 200, y: 230 };
    return {
      figure: figureProgramme(s => {
        dessinerTrait(s, { x: 20, y: 230 }, { x: 400, y: 230 }, "segment", "geo-objet");
        dessinerTexte(s, { x: 390, y: 250 }, "(d)", "geo-nom");
        dessinerTrait(s, { x: 200, y: 280 }, { x: 200, y: 20 }, "segment", "geo-trait");
        dessinerTexte(s, { x: 218, y: 30 }, "(d1)", "geo-nom");
        dessinerTrait(s, { x: 20, y: 90 }, { x: 400, y: 90 }, "segment", "geo-objet");
        dessinerTexte(s, { x: 390, y: 80 }, "(d2)", "geo-nom");
        dessinerPoint(s, A, "A", { vers: { x: -0.8, y: -1 } });
        codageAngleDroit(s, P, { x: 1, y: 0 }, { x: 0, y: -1 }); codageAngleDroit(s, A, { x: 1, y: 0 }, { x: 0, y: 1 });
      }),
      etapes: [
        { texte: "Trace une droite (d) et place un point A qui n'est pas sur (d)." },
        { texte: "Trace la droite (d1) perpendiculaire à (d) passant par A.", apres: [0] },
        { texte: "Trace la droite (d2) perpendiculaire à (d1) passant par A.", apres: [1] },
        { texte: "Code les deux angles droits.", apres: [2] }
      ]
    };
  },
  () => {
    const a = alea(6, 9), b = alea(2, 3);
    const A = { x: 210 - a * PX / 2, y: 150 }, C = { x: 210 + a * PX / 2, y: 150 }, O = { x: 210, y: 150 }, B = { x: 210, y: 150 - b * PX }, D = { x: 210, y: 150 + b * PX };
    return {
      figure: figureProgramme(s => {
        dessinerTrait(s, A, C, "segment", "geo-trait");
        dessinerTrait(s, { x: 210, y: 20 }, { x: 210, y: 280 }, "segment", "geo-trait-fin");
        dessinerTexte(s, { x: 228, y: 276 }, "(d)", "geo-nom");
        for (const [p, q] of [[A, B], [B, C], [C, D], [D, A]]) dessinerTrait(s, p, q, "segment", "geo-objet");
        dessinerPoint(s, A, "A", { vers: { x: -1, y: 0 } }); dessinerPoint(s, C, "C", { vers: { x: 1, y: 0 } });
        dessinerPoint(s, B, "B", { vers: { x: 0.8, y: -1 } }); dessinerPoint(s, D, "D", { vers: { x: 0.8, y: 1 } }); dessinerPoint(s, O, "O", { vers: { x: -1, y: 1 } });
        codageAngleDroit(s, O, { x: 1, y: 0 }, { x: 0, y: -1 }); codageLongueur(s, A, O, 1); codageLongueur(s, O, C, 1);
        codageLongueur(s, O, B, 2); codageLongueur(s, O, D, 2);
      }),
      etapes: [
        { texte: `Trace un segment [AC] de ${a} cm.` },
        { texte: "Trace la médiatrice (d) de [AC] ; elle coupe [AC] en O.", apres: [0] },
        { texte: `Place un point B sur (d) tel que OB = ${b} cm.`, apres: [1] },
        { texte: `Place un point D sur (d), de l'autre côté de [AC], tel que OD = ${b} cm.`, apres: [1] },
        { texte: "Trace le quadrilatère ABCD.", apres: [2, 3] }
      ]
    };
  },
  () => {
    const A = { x: 80, y: 80 }, B = { x: 150, y: 220 }, A2 = { x: 340, y: 80 }, B2 = { x: 270, y: 220 };
    return {
      figure: figureProgramme(s => {
        dessinerTrait(s, { x: 210, y: 20 }, { x: 210, y: 280 }, "segment", "geo-trait");
        dessinerTexte(s, { x: 226, y: 32 }, "(d)", "geo-nom");
        dessinerTrait(s, A, A2, "segment", "geo-trait-fin"); dessinerTrait(s, B, B2, "segment", "geo-trait-fin");
        dessinerTrait(s, A, B, "segment", "geo-objet"); dessinerTrait(s, A2, B2, "segment", "geo-objet");
        dessinerPoint(s, A, "A", { vers: { x: -1, y: -0.5 } }); dessinerPoint(s, B, "B", { vers: { x: -1, y: 0.5 } });
        dessinerPoint(s, A2, "A′", { vers: { x: 1, y: -0.5 } }); dessinerPoint(s, B2, "B′", { vers: { x: 1, y: 0.5 } });
        codageAngleDroit(s, { x: 210, y: 80 }, { x: 1, y: 0 }, { x: 0, y: -1 }); codageAngleDroit(s, { x: 210, y: 220 }, { x: 1, y: 0 }, { x: 0, y: -1 });
      }),
      etapes: [
        { texte: "Trace une droite (d) et un segment [AB] qui ne la coupe pas." },
        { texte: "Construis A′, le symétrique de A par rapport à (d).", apres: [0] },
        { texte: "Construis B′, le symétrique de B par rapport à (d).", apres: [0] },
        { texte: "Trace le segment [A′B′].", apres: [1, 2] }
      ]
    };
  }
];

const cap = t => t[0].toUpperCase() + t.slice(1);
const cm = x => ecrireNombre(x) + "\u00a0cm"; // espace insécable : « 4,5 cm » reste sur une ligne
const prime = t => t.split("").map(c => c + "′").join("");
const angle = t => `<span class="angle">${t}</span>`;
const pluriel = (n, mot) => n + " " + mot + (n > 1 ? "s" : "");

/* Un segment [AB] au hasard dans la figure ; w est une direction perpendiculaire, vers le haut. */
function segmentAuHasard(lmin = 150, lmax = 210, angleMax = 30) {
  const c = { x: W / 2 + alea(-20, 20), y: H / 2 + alea(-12, 12) };
  const u = V.angle(alea(-angleMax, angleMax) * DEG), l = alea(lmin, lmax);
  let w = V.normal(u);
  if (w.y > 0) w = V.fois(w, -1);
  return { A: V.moins(c, V.fois(u, l / 2)), B: V.plus(c, V.fois(u, l / 2)), u, w };
}

/* Coordonnées, dans la figure, d'un clic ou d'un toucher. */
function positionClic(s, e) {
  const p = s.createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(s.getScreenCTM().inverse());
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "notations",
    titre: "Droite, demi-droite ou segment ?",
    description: "Choisir la bonne notation : [AB], [AB), (AB) ou AB.",
    generer() {
      const [X, Y] = tirerLettres(2);
      const nom = {
        [`[${X}${Y}]`]: `le segment d'extrémités ${X} et ${Y}`,
        [`[${X}${Y})`]: `la demi-droite d'origine ${X} passant par ${Y}`,
        [`[${Y}${X})`]: `la demi-droite d'origine ${Y} passant par ${X}`,
        [`(${X}${Y})`]: `la droite passant par ${X} et ${Y}`,
        [`${X}${Y}`]: `la longueur du segment [${X}${Y}]`
      };
      const options = Object.keys(nom);
      const verifier = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });

      if (Math.random() < 0.6) {
        const bonne = choisir(options.slice(0, 4));
        const { A, B, w } = segmentAuHasard();
        const s = figureGeo(W, H, "Figure à nommer");
        if (bonne === `[${Y}${X})`) dessinerTrait(s, B, A, "demi", "geo-objet");
        else dessinerTrait(s, A, B, bonne[0] === "(" ? "droite" : bonne.endsWith(")") ? "demi" : "segment", "geo-objet");
        dessinerPoint(s, A, X, { vers: w });
        dessinerPoint(s, B, Y, { vers: w });
        return {
          consigne: "Quelle est la notation de la figure tracée en bleu ?",
          figure: s,
          choix: options.slice(0, 4),
          verifier: verifier(bonne),
          indice: "Regarde de chaque côté : un crochet quand le trait s'arrête sur le point, une parenthèse quand il continue.",
          correction: `La figure est ${nom[bonne]} : elle se note ${bonne}.`
        };
      }
      const bonne = choisir(options);
      const longueur = bonne === `${X}${Y}`;
      return {
        consigne: longueur
          ? `La distance entre ${X} et ${Y} vaut ${cm(alea(20, 95) / 10)}. Comment note-t-on cette distance ?`
          : `Comment note-t-on ${nom[bonne]} ?`,
        choix: options,
        verifier: verifier(bonne),
        indice: "[ ] : limité des deux côtés ; [ ) : limité d'un seul côté, par son origine ; ( ) : illimité des deux côtés ; sans rien : c'est un nombre, une longueur.",
        correction: longueur
          ? `Une distance est un nombre : on écrit ${X}${Y}, sans crochets ni parenthèses.`
          : `${cap(nom[bonne])} se note ${bonne}.`
      };
    }
  },

  {
    groupe: F1,
    id: "reconnaitre-figure",
    titre: "Reconnaître une figure",
    description: "Trouver la figure qui correspond à une notation.",
    generer() {
      const [X, Y] = tirerLettres(2);
      const types = melanger([
        ["segment", `[${X}${Y}]`, `le segment [${X}${Y}]`, `il s'arrête en ${X} et en ${Y}`],
        ["demiX", `[${X}${Y})`, `la demi-droite [${X}${Y})`, `elle part de ${X} et continue après ${Y}`],
        ["demiY", `[${Y}${X})`, `la demi-droite [${Y}${X})`, `elle part de ${Y} et continue après ${X}`],
        ["droite", `(${X}${Y})`, `la droite (${X}${Y})`, "elle continue des deux côtés"]
      ]);
      const cible = alea(0, 3);
      const inverse = Math.random() < 0.5;
      const figures = types.map(([t]) => {
        const s = figureGeo(170, 84, "Figure");
        let A = { x: 55, y: 44 }, B = { x: 115, y: 34 };
        if (inverse) [A, B] = [{ x: 115, y: 44 }, { x: 55, y: 34 }];
        if (t === "demiY") dessinerTrait(s, B, A, "demi", "geo-objet");
        else dessinerTrait(s, A, B, t === "droite" ? "droite" : t === "demiX" ? "demi" : "segment", "geo-objet");
        dessinerPoint(s, A, X, { vers: { x: 0, y: 1 } });
        dessinerPoint(s, B, Y, { vers: { x: 0, y: 1 } });
        return s;
      });
      return {
        consigne: `Clique sur la figure qui représente ${types[cible][1]}.`,
        choix: figures,
        verifier: (v, c) => c === cible ? { etat: "juste" } : { etat: "faux", message: `Tu as choisi ${types[c][2]}.` },
        indice: "Regarde où le trait s'arrête : sur un point (crochet) ou pas (parenthèse).",
        correction: `${cap(types[cible][2])} : ${types[cible][3]}.`
      };
    }
  },

  {
    groupe: F1,
    id: "appartenance",
    titre: "Appartient ou n'appartient pas",
    description: "Lire une figure (droites, triangle, quadrilatère) et compléter avec ∈ ou ∉.",
    generer() {
      const s = figureGeo(W + 40, H + 70, "Figure");
      const Lw = W + 40, Lh = H + 70;
      const aff = [];     // affirmations possibles : [point, objet, appartient ?]
      const type = choisir(["triangle", "quadrilatere", "droites"]);
      const lettres = tirerLettres(9);
      const P = (x, y) => ({ x, y });
      const sur = (A, B, t) => V.plus(A, V.fois(V.moins(B, A), t));
      const nomPt = (p, n, vers) => dessinerPoint(s, p, n, { vers });
      if (type === "triangle") {
        const [A, B, C, M, N, R, Q, S] = lettres;
        const pA = P(80, 230), pB = P(300, 245), pC = P(170 + alea(-30, 30), 70);
        dessinerTrait(s, pA, pB, "droite", "geo-trait-fin");                // la droite (AB) est tracée en entier
        dessinerTrait(s, pA, pC, "demi", "geo-trait-fin");                  // la demi-droite [AC)
        for (const [p, q] of [[pA, pB], [pB, pC], [pC, pA]]) dessinerTrait(s, p, q, "segment", "geo-objet");
        const pM = sur(pA, pB, alea(30, 70) / 100), pN = sur(pA, pB, alea(125, 140) / 100), pR = sur(pB, pC, alea(30, 70) / 100);
        const pQ = sur(pA, pC, alea(125, 140) / 100), pS = P((pA.x + pB.x + pC.x) / 3, (pA.y + pB.y + pC.y) / 3);
        nomPt(pA, A, { x: -1, y: 0.4 }); nomPt(pB, B, { x: 1, y: 0.4 }); nomPt(pC, C, { x: 0, y: -1 });
        nomPt(pM, M, { x: 0, y: 1 }); nomPt(pN, N, { x: 0, y: 1 }); nomPt(pR, R, { x: 1, y: -0.3 }); nomPt(pQ, Q, { x: -1, y: 0 }); nomPt(pS, S, { x: 0, y: -1 });
        aff.push([M, `[${A}${B}]`, true], [M, `(${A}${B})`, true], [N, `[${A}${B}]`, false], [N, `(${A}${B})`, true], [N, `[${B}${A})`, false], [N, `[${A}${B})`, true],
          [R, `[${B}${C}]`, true], [R, `[${A}${B}]`, false], [Q, `[${A}${C})`, true], [Q, `[${A}${C}]`, false], [S, `[${A}${B}]`, false], [S, `[${B}${C}]`, false],
          [C, `[${A}${C}]`, true], [A, `[${B}${C}]`, false], [B, `(${A}${B})`, true]);
      } else if (type === "quadrilatere") {
        const [A, B, C, D, O, M, N, R] = lettres;
        const pA = P(70, 220), pB = P(290, 235), pC = P(320, 70), pD = P(110, 60);
        dessinerTrait(s, pB, pD, "droite", "geo-trait-fin");               // la droite (BD)
        for (const [p, q] of [[pA, pB], [pB, pC], [pC, pD], [pD, pA], [pA, pC]]) dessinerTrait(s, p, q, "segment", "geo-objet");
        dessinerTrait(s, pB, pD, "segment", "geo-objet");
        // O : intersection des diagonales
        const d1 = V.moins(pC, pA), d2 = V.moins(pD, pB);
        const t = ((pB.x - pA.x) * d2.y - (pB.y - pA.y) * d2.x) / (d1.x * d2.y - d1.y * d2.x);
        const pO = sur(pA, pC, t), pM = sur(pA, pB, alea(35, 65) / 100), pN = sur(pB, pD, alea(118, 130) / 100), pR = sur(pC, pD, alea(35, 65) / 100);
        nomPt(pA, A, { x: -1, y: 0.5 }); nomPt(pB, B, { x: 1, y: 0.5 }); nomPt(pC, C, { x: 1, y: -0.5 }); nomPt(pD, D, { x: -1, y: -0.5 });
        nomPt(pO, O, { x: 1, y: 0.2 }); nomPt(pM, M, { x: 0, y: 1 }); nomPt(pN, N, { x: -1, y: 0 }); nomPt(pR, R, { x: 0, y: -1 });
        aff.push([O, `[${A}${C}]`, true], [O, `[${B}${D}]`, true], [O, `[${A}${B}]`, false], [M, `[${A}${B}]`, true], [M, `[${C}${D}]`, false],
          [N, `(${B}${D})`, true], [N, `[${B}${D}]`, false], [N, `[${B}${D})`, true], [R, `[${C}${D}]`, true], [R, `[${A}${C}]`, false], [A, `[${B}${D}]`, false], [D, `(${B}${D})`, true]);
      } else {
        const [A, B, C, M, N, R] = lettres;
        // trois droites qui se coupent deux à deux en A, B et C
        const pA = P(90, 220), pB = P(310, 210), pC = P(200, 70);
        const noms = ["(d1)", "(d2)", "(d3)"];
        const droites = [[pA, pB, noms[0]], [pB, pC, noms[1]], [pC, pA, noms[2]]];
        for (const [p, q, n] of droites) {
          dessinerTrait(s, p, q, "droite", "geo-objet");
          const u = V.unitaire(V.moins(q, p));
          dessinerTexte(s, V.plus(V.plus(q, V.fois(u, 60)), V.fois(V.normal(u), 14)), n, "geo-nom");
        }
        const pM = sur(pA, pB, alea(130, 145) / 100), pN = sur(pB, pC, alea(35, 65) / 100), pR = P(200, 170);
        nomPt(pA, A, { x: -0.3, y: 1 }); nomPt(pB, B, { x: 0.3, y: 1 }); nomPt(pC, C, { x: 1, y: -0.3 });
        nomPt(pM, M, { x: 0, y: 1 }); nomPt(pN, N, { x: 1, y: 0 }); nomPt(pR, R, { x: 0, y: -1 });
        aff.push([A, noms[0], true], [A, noms[2], true], [A, noms[1], false], [B, noms[0], true], [B, noms[2], false], [C, noms[1], true], [C, noms[0], false],
          [M, noms[0], true], [M, `[${A}${B}]`, false], [N, noms[1], true], [N, `[${B}${C}]`, true], [R, noms[0], false], [R, noms[2], false]);
      }
      // 4 affirmations, avec au moins un piège (appartient à la droite mais pas au segment…)
      const choisies = melanger(aff).slice(0, 4);
      return {
        consigne: "Complète avec ∈ (appartient à) ou ∉ (n'appartient pas à). Les traits fins prolongent la figure.",
        figure: s,
        classeLigne: "etapes",
        ligne: choisies.map(([p, o]) => `<div class="etape-pb enonce-ligne"><span>${p}</span>[s]<span>${o}</span></div>`).join(""),
        listes: choisies.map(() => ["∈", "∉"]),
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Réponds aux quatre lignes." };
          const fausses = choisies.map(([, , ok], i) => (v[i] === 0) !== ok ? i + 1 : 0).filter(Boolean);
          return fausses.length ? { etat: "faux", message: `À revoir : ligne${fausses.length > 1 ? "s" : ""} ${fausses.join(", ")}. Attention : un segment s'arrête à ses extrémités, une demi-droite part de son origine.` } : { etat: "juste" };
        },
        indice: "[AB] : entre A et B seulement ; [AB) : part de A et passe par B ; (AB) : continue des deux côtés.",
        correction: choisies.map(([p, o, ok]) => `${p} ${ok ? "∈" : "∉"} ${o}`).join(" ; ") + "."
      };
    }
  },

  {
    groupe: F1,
    id: "milieu",
    titre: "Le milieu d'un segment",
    description: "Trouver la longueur d'un segment ou de sa moitié.",
    generer() {
      const [X, Y, I] = tirerLettres(3);
      const cas = choisir(["moitie", "moitie", "double", "autre-moitie", "probleme"]);
      let consigne, ligne, attendu, correction, connu, etiquette;
      if (cas === "moitie") {
        const L = alea(20, 160) / 10; connu = "total";
        consigne = `${I} est le milieu de [${X}${Y}] et ${X}${Y} = ${cm(L)}. Combien mesure ${X}${I} ?`;
        ligne = `${X}${I} = [d] cm`; attendu = L / 2; etiquette = `${X}${Y} = ${cm(L)}`;
        correction = `${X}${I} = ${X}${Y} ÷ 2 = ${ecrireNombre(L)} ÷ 2 = ${cm(L / 2)}.`;
      } else if (cas === "double") {
        const dm = alea(15, 80) / 10; connu = "moitie";
        consigne = `${I} est le milieu de [${X}${Y}] et ${X}${I} = ${cm(dm)}. Combien mesure ${X}${Y} ?`;
        ligne = `${X}${Y} = [d] cm`; attendu = 2 * dm; etiquette = `${X}${I} = ${cm(dm)}`;
        correction = `${X}${Y} = 2 × ${X}${I} = 2 × ${ecrireNombre(dm)} = ${cm(2 * dm)}.`;
      } else if (cas === "autre-moitie") {
        const dm = alea(15, 80) / 10; connu = "autre";
        consigne = `${I} est le milieu de [${X}${Y}] et ${I}${Y} = ${cm(dm)}. Combien mesure ${X}${I} ?`;
        ligne = `${X}${I} = [d] cm`; attendu = dm; etiquette = `${I}${Y} = ${cm(dm)}`;
        correction = `Le milieu est à égale distance des extrémités : ${X}${I} = ${I}${Y} = ${cm(dm)}.`;
      } else {
        const L = alea(40, 250) / 10; connu = "total";
        consigne = `Deux bornes ${X} et ${Y} sont distantes de ${ecrireNombre(L)} km sur une route droite. Une aire de repos ${I} est installée au milieu. À quelle distance de ${X} se trouve-t-elle ?`;
        ligne = `${X}${I} = [d] km`; attendu = L / 2; etiquette = `${X}${Y} = ${ecrireNombre(L)} km`;
        correction = `${X}${I} = ${ecrireNombre(L)} ÷ 2 = ${ecrireNombre(L / 2)} km.`;
      }
      // Coup de pouce : un schéma codé, affiché à la demande
      const schema = figureGeo(360, 110, "Schéma");
      const A = { x: 40, y: 60 }, B = { x: 320, y: 60 }, M = { x: 180, y: 60 };
      dessinerTrait(schema, A, B, "segment", "geo-objet");
      dessinerPoint(schema, A, X); dessinerPoint(schema, B, Y); dessinerPoint(schema, M, I);
      codageLongueur(schema, A, M, 2); codageLongueur(schema, M, B, 2);
      // le « ? » est au-dessus de ce que l'on cherche ; la longueur connue est écrite en dessous
      const posConnu = { total: { x: 180, y: 100 }, moitie: { x: 110, y: 100 }, autre: { x: 250, y: 100 } }[connu];
      const posCherche = { total: { x: 110, y: 26 }, moitie: { x: 180, y: 26 }, autre: { x: 110, y: 26 } }[connu];
      dessinerTexte(schema, posConnu, etiquette, "geo-mesure");
      dessinerTexte(schema, posCherche, `${ligne.split(" =")[0]} = ?`, "geo-mesure");
      schema.style.display = "none";
      const pouce = el("button", { type: "button", class: "btn discret" }, "💡 Coup de pouce : voir un schéma");
      pouce.addEventListener("click", () => { schema.style.display = ""; pouce.remove(); });
      return {
        consigne, ligne,
        apresLigne: [pouce, schema],
        verifier(v) {
          const r = verifierNombre(v[0], attendu);
          if (r.etat === "faux" && cas !== "autre-moitie" && Math.abs(lireNombre(v[0]) - (cas === "double" ? attendu / 4 : attendu * 4)) < 1e-9) r.message = cas === "double" ? "Le segment entier est deux fois plus long que sa moitié." : "La moitié, c'est diviser par 2.";
          return r;
        },
        indice: "Le milieu partage le segment en deux longueurs égales : chacune vaut la moitié de la longueur du segment.",
        correction
      };
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "reconnaitre-droites",
    titre: "Perpendiculaires ou parallèles ?",
    description: "Lire la position de plusieurs droites sur une figure codée.",
    generer() {
      const Lw = W + 40, Lh = H + 60;
      const s = figureGeo(Lw, Lh, "Plusieurs droites");
      const a = alea(-25, 25) * DEG, u = V.angle(a), n = V.normal(u);
      const C0 = { x: Lw / 2, y: Lh / 2 };
      const noms = melanger(["(d1)", "(d2)", "(d3)", "(d4)"]);
      const [dA, dB, dC, dD] = noms;
      // dA et dB parallèles ; dC perpendiculaire aux deux (codée) ; dD oblique
      const ecart = alea(60, 85);
      const pA = V.moins(C0, V.fois(n, ecart / 2)), pB = V.plus(C0, V.fois(n, ecart / 2));
      const pC = V.plus(C0, V.fois(u, alea(-110, -60)));
      const uD = V.angle(a + choisir([-1, 1]) * alea(35, 60) * DEG), pD = V.plus(C0, V.fois(u, alea(60, 110)));
      dessinerDroite(s, pA, u, dA, Lw, Lh);
      dessinerDroite(s, pB, u, dB, Lw, Lh);
      dessinerDroite(s, pC, n, dC, Lw, Lh);
      dessinerDroite(s, pD, uD, dD, Lw, Lh);
      // codage des angles droits entre dC et dA, dC et dB
      const inter = (P, v, Q, w) => { const t = ((Q.x - P.x) * w.y - (Q.y - P.y) * w.x) / (v.x * w.y - v.y * w.x); return V.plus(P, V.fois(v, t)); };
      codageAngleDroit(s, inter(pA, u, pC, n), u, n);
      codageAngleDroit(s, inter(pB, u, pC, n), u, V.fois(n, -1));
      const rel = { [`${dA}|${dB}`]: "//", [`${dA}|${dC}`]: "⊥", [`${dB}|${dC}`]: "⊥", [`${dA}|${dD}`]: "aucun des deux", [`${dB}|${dD}`]: "aucun des deux", [`${dC}|${dD}`]: "aucun des deux" };
      const paires = melanger(Object.keys(rel));
      const choisies = [paires.find(k => rel[k] === "//"), paires.find(k => rel[k] === "⊥"), paires.find(k => rel[k] === "aucun des deux")];
      melanger(choisies);
      const options = ["⊥", "//", "aucun des deux"];
      return {
        consigne: "Pour chaque paire de droites, choisis le bon symbole. Les angles droits sont codés.",
        figure: s,
        classeLigne: "etapes",
        ligne: choisies.map(k => { const [x, y] = k.split("|"); return `<div class="etape-pb enonce-ligne"><span>${x}</span>[s]<span>${y}</span></div>`; }).join(""),
        listes: choisies.map(() => options),
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Réponds aux trois lignes." };
          const fausses = choisies.map((k, i) => options[v[i]] === rel[k] ? 0 : i + 1).filter(Boolean);
          return fausses.length ? { etat: "faux", message: `À revoir : ligne${fausses.length > 1 ? "s" : ""} ${fausses.join(", ")}.` } : { etat: "juste" };
        },
        indice: "Perpendiculaires : elles se coupent avec un angle droit codé. Parallèles : elles ne se coupent jamais.",
        correction: choisies.map(k => { const [x, y] = k.split("|"); return rel[k] === "aucun des deux" ? `${x} et ${y} sont sécantes sans angle droit` : `${x} ${rel[k]} ${y}`; }).join(" ; ") + "."
      };
    }
  },

  {
    groupe: F2,
    id: "traduire",
    titre: "Traduire en langage mathématique",
    description: "Passer d'une phrase à une écriture avec ⊥ ou //, et inversement.",
    generer() {
      const [p, q] = choisir([["d1", "d2"], ["AB", "CD"], ["u", "v"], ["d", "d′"], ["EF", "GH"]]).map(x => `(${x})`);
      const nota = { perp: `${p} ⊥ ${q}`, para: `${p} // ${q}` };
      const lecture = "« ⊥ » se lit « est perpendiculaire à » et « // » se lit « est parallèle à ».";
      if (Math.random() < 0.6) {
        const [cas, phrase] = choisir([
          ["perp", `La droite ${p} est perpendiculaire à la droite ${q}.`],
          ["perp", `La droite ${p} coupe ${q} en formant un angle droit.`],
          ["para", `Les droites ${p} et ${q} ne se coupent jamais.`],
          ["para", `La droite ${p} est parallèle à la droite ${q}.`]
        ]);
        const options = [nota.perp, nota.para, `${p} ∈ ${q}`];
        return {
          consigne: `Traduis cette phrase par une écriture mathématique :<br><em>« ${phrase} »</em>`,
          choix: options,
          verifier: (v, c) => c === nota[cas] ? { etat: "juste" }
            : { etat: "faux", message: c === options[2] ? "Le symbole ∈ s'utilise pour un point qui appartient à une droite, pas pour deux droites." : "" },
          indice: lecture,
          correction: (phrase.includes("jamais") ? "Deux droites qui ne se coupent jamais sont parallèles. " : "")
            + (phrase.includes("angle droit") ? "Deux droites qui se coupent en formant un angle droit sont perpendiculaires. " : "")
            + `On écrit : ${nota[cas]}.`
        };
      }
      const cas = choisir(["perp", "para"]);
      const options = [
        `${p} est perpendiculaire à ${q}.`,
        `${p} est parallèle à ${q}.`,
        `${p} et ${q} sont sécantes sans être perpendiculaires.`
      ];
      const bonne = cas === "perp" ? 0 : 1;
      return {
        consigne: `Que signifie l'écriture <strong>${nota[cas]}</strong> ?`,
        choix: options,
        verifier: (v, c) => ({ etat: c === options[bonne] ? "juste" : "faux" }),
        indice: lecture,
        correction: `${nota[cas]} se lit : « ${options[bonne].slice(0, -1)} ».`
      };
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: F3,
    id: "est-ce-la-mediatrice",
    titre: "Est-ce la médiatrice ?",
    description: "Reconnaître la médiatrice d'un segment grâce au codage.",
    generer() {
      const [X, Y, I] = tirerLettres(3);
      const cas = choisir(["oui", "milieu", "perp"]);
      const { A, B, u, w } = segmentAuHasard(180, 220, 20);
      const M = V.milieu(A, B);
      const s = figureGeo(W, H, "Segment et droite");
      let O = M, dir = w;
      if (cas === "milieu") O = V.plus(A, V.fois(V.moins(B, A), choisir([alea(24, 36), alea(64, 76)]) / 100));
      if (cas === "perp") dir = V.tourner(u, { x: 0, y: 0 }, choisir([-1, 1]) * alea(55, 68) * DEG);
      dessinerDroite(s, O, dir, "(d)", W, H);
      dessinerTrait(s, A, B, "segment", "geo-objet");
      dessinerPoint(s, A, X, { vers: V.moins(A, M) });
      dessinerPoint(s, B, Y, { vers: V.moins(B, M) });
      dessinerPoint(s, M, I, { vers: V.plus(V.fois(w, 1), V.fois(u, cas === "milieu" && O.x > M.x ? -1.2 : 1.2)) });
      codageLongueur(s, A, M, 2);
      codageLongueur(s, M, B, 2);
      if (cas !== "perp") codageAngleDroit(s, O, u, w);
      const options = ["Oui", "Non : elle ne passe pas par le milieu", "Non : elle n'est pas perpendiculaire"];
      const bonne = { oui: 0, milieu: 1, perp: 2 }[cas];
      return {
        consigne: `La droite (d) est-elle la médiatrice du segment [${X}${Y}] ? Aide-toi du codage.`,
        figure: s,
        choix: options,
        verifier: (v, c) => ({ etat: c === options[bonne] ? "juste" : "faux" }),
        indice: `La médiatrice de [${X}${Y}] est la droite perpendiculaire à [${X}${Y}] qui passe par son milieu : il faut les deux.`,
        correction: {
          oui: `(d) est perpendiculaire à [${X}${Y}] (angle droit codé) et passe par son milieu ${I} (longueurs égales codées) : c'est la médiatrice de [${X}${Y}].`,
          milieu: `(d) est bien perpendiculaire à [${X}${Y}], mais elle ne passe pas par son milieu ${I} : ce n'est pas la médiatrice.`,
          perp: `(d) passe bien par le milieu ${I} de [${X}${Y}], mais elle n'est pas perpendiculaire à [${X}${Y}] : ce n'est pas la médiatrice.`
        }[cas]
      };
    }
  },

  {
    groupe: F3,
    id: "propriete-mediatrice",
    titre: "Utiliser la propriété de la médiatrice",
    description: "Trouver une longueur ou la position d'un point, sans mesurer.",
    generer() {
      const [X, Y, M] = tirerLettres(3);
      const x = alea(15, 95) / 10;
      const r = Math.random();
      if (r < 0.55) {
        const [connu, cherche] = melanger([X, Y]);
        return {
          consigne: choisir([
            `${M} appartient à la médiatrice de [${X}${Y}] et ${M}${connu} = ${cm(x)}. Combien vaut ${M}${cherche} ?`,
            `La droite (d) est la médiatrice de [${X}${Y}]. ${M} est un point de (d) tel que ${M}${connu} = ${cm(x)}. Combien vaut ${M}${cherche} ?`
          ]),
          ligne: `${M}${cherche} = [d] cm`,
          verifier: v => verifierNombre(v[0], x),
          indice: "Un point de la médiatrice d'un segment est à égale distance des deux extrémités.",
          correction: `<strong>Je sais que :</strong> ${M} appartient à la médiatrice de [${X}${Y}].<br><strong>Or :</strong> ${PROP.mediatrice}<br><strong>Donc :</strong> ${M}${cherche} = ${M}${connu} = ${cm(x)}.`
        };
      }
      if (r < 0.8) {
        const options = [`${M} appartient à la médiatrice de [${X}${Y}].`, `${M} est le milieu de [${X}${Y}].`, "On ne peut rien dire."];
        return {
          consigne: `On sait que ${M}${X} = ${M}${Y} = ${cm(x)}. Que peut-on dire du point ${M} ?`,
          choix: melanger([...options]),
          verifier: (v, c) => c === options[0] ? { etat: "juste" }
            : { etat: "faux", message: c === options[1] ? `${M} n'est pas forcément sur le segment [${X}${Y}] : il peut être au-dessus ou en dessous.` : "" },
          indice: `${M} est à égale distance de ${X} et de ${Y}. Quelle propriété du cours parle de cette situation ?`,
          correction: `<strong>Je sais que :</strong> ${M}${X} = ${M}${Y}.<br><strong>Or :</strong> ${PROP.reciproque}<br><strong>Donc :</strong> ${M} appartient à la médiatrice de [${X}${Y}].`
        };
      }
      const options = [`${M}${X} = ${M}${Y}`, `${M}${X} = 2 × ${M}${Y}`, "On ne peut rien dire."];
      return {
        consigne: `${M} appartient à la médiatrice de [${X}${Y}]. Que peut-on dire des longueurs ${M}${X} et ${M}${Y} ?`,
        choix: melanger([...options]),
        verifier: (v, c) => ({ etat: c === options[0] ? "juste" : "faux" }),
        indice: "Relis la propriété de la médiatrice dans le cours.",
        correction: `<strong>Or :</strong> ${PROP.mediatrice} <strong>Donc :</strong> ${M}${X} = ${M}${Y}.`
      };
    }
  },

  {
    groupe: F3,
    id: "demonstration",
    titre: "Rédiger une démonstration",
    description: "Avec la médiatrice : Je sais que… / Or… / Donc…",
    generer() {
      const [A, B, M] = tirerLettres(3);
      const x = alea(15, 95) / 10, X = cm(x);
      const sc = choisir([
        {
          enonce: `La droite (d) est la médiatrice de [${A}${B}] et ${M} est un point de (d) tel que ${M}${A} = ${X}. Démontre que ${M}${B} = ${X}.`,
          sais: [`(d) est la médiatrice de [${A}${B}] et le point ${M} appartient à (d).`, `${M}${B} = ${X}.`, `${M} est le milieu de [${A}${B}].`],
          or: "mediatrice", piege: "reciproque",
          donc: [`${M}${B} = ${M}${A}, c'est-à-dire ${M}${B} = ${X}.`, `${M} appartient à la médiatrice de [${A}${B}].`, `${M} est le milieu de [${A}${B}].`]
        },
        {
          enonce: `${M} appartient à la médiatrice du segment [${A}${B}]. Démontre que ${M}${A} = ${M}${B}.`,
          sais: [`${M} appartient à la médiatrice de [${A}${B}].`, `${M}${A} = ${M}${B}.`, `${M} est le milieu de [${A}${B}].`],
          or: "mediatrice", piege: "reciproque",
          donc: [`${M}${A} = ${M}${B}.`, `${M} est le milieu de [${A}${B}].`, `(${M}${A}) est perpendiculaire à (${M}${B}).`]
        },
        {
          enonce: `${M} est un point tel que ${M}${A} = ${M}${B} = ${X}. Démontre que ${M} appartient à la médiatrice de [${A}${B}].`,
          sais: [`${M}${A} = ${M}${B}.`, `${M} appartient à la médiatrice de [${A}${B}].`, `${M} est le milieu de [${A}${B}].`],
          or: "reciproque", piege: "mediatrice",
          donc: [`${M} appartient à la médiatrice de [${A}${B}].`, `${M} est le milieu de [${A}${B}].`, `${M}${A} = ${M}${B}.`]
        },
        {
          enonce: `Sur une carte, un phare ${M} est à ${X} de la ville ${A} et à ${X} de la ville ${B}. Démontre que le phare est sur la médiatrice du segment [${A}${B}].`,
          sais: [`${M}${A} = ${M}${B} = ${X}.`, `${M} appartient à la médiatrice de [${A}${B}].`, `${M} est le milieu de [${A}${B}].`],
          or: "reciproque", piege: "mediatrice",
          donc: [`${M} appartient à la médiatrice de [${A}${B}].`, `${M} est le milieu de [${A}${B}].`, `(${A}${B}) est la médiatrice de [${M}${A}].`]
        }
      ]);
      return demonstration(sc, ["mediatrice", "reciproque", "milieu", "symetrie"]);
    }
  },

  {
    groupe: F3,
    id: "construire-mediatrice",
    titre: "Construire la médiatrice",
    description: "Mesurer, placer le milieu, poser l'équerre, tracer, coder.",
    generer() {
      const Lw = 640, Lh = 440;
      const s = figureGeo(Lw, Lh, "Construction");
      s.classList.add("construction", "geo-manipuler");
      const [X, Y, I] = tirerLettres(3);
      const L = alea(25, 45) * 2 / 10;              // longueur en cm, avec un nombre pair de millimètres
      const alpha = alea(-15, 15);
      const u = dir(alpha), n = V.normal(u);
      const A = { x: 80 + alea(0, 30), y: 250 }, B = V.plus(A, V.fois(u, L * CM)), M = V.milieu(A, B);
      dessinerTrait(s, A, B, "segment", "geo-objet");
      dessinerPoint(s, A, X, { vers: V.fois(u, -1) });
      dessinerPoint(s, B, Y, { vers: u });
      const regle = creerRegle(11), equerre = creerEquerre();
      regle.placer(40, 330, 0); equerre.placer(300, 425, 0);
      s.append(regle);
      const mRegle = rendreMobile(s, regle, { points: [A, B], angles: [-alpha, 180 - alpha] });
      const mEquerre = rendreMobile(s, equerre, { points: [M], angles: [0, 90, 180, 270].map(k => k - alpha) });
      return atelier(s, [
        {
          nom: "Mesurer",
          texte: `Mesure le segment [${X}${Y}] avec la règle : le zéro sur ${X}, la règle le long du segment.`,
          champ: `${X}${Y} = [d] cm`,
          valider: v => Math.abs(v - L) < 0.05 || `Vérifie ta mesure : le zéro de la règle doit être sur ${X} et on lit la graduation sous ${Y}.`,
          montrer: () => regle.placer(A.x, A.y, -alpha),
          reponse: L
        },
        {
          nom: "Calculer",
          texte: `Où placer le milieu ${I} ? Calcule la distance ${X}${I}.`,
          champ: `${X}${I} = [d] cm`,
          valider: v => Math.abs(v - L / 2) < 0.05 || `Le milieu est à la moitié de ${X}${Y} : ${ecrireNombre(L)} ÷ 2.`,
          reponse: L / 2
        },
        {
          nom: "Placer le milieu",
          texte: `Clique sur le segment pour placer ${I} à ${ecrireNombre(L / 2)} cm de ${X} (aide-toi de la règle).`,
          clic: { depart: A, direction: u, longueur: L, nom: I, cible: L / 2, message: t => `Ton point est à ${ecrireNombre(t)} cm de ${X} : il doit être à ${ecrireNombre(L / 2)} cm.` }
        },
        {
          nom: "Équerre",
          texte: `Pose l'équerre : un côté de l'angle droit le long de [${X}${Y}], le sommet de l'angle droit sur ${I}. Puis clique sur « Tracer ».`,
          avant: () => s.append(equerre),
          tracer: () => mEquerre.surPoint(M) ? true : `L'équerre n'est pas bien placée : le sommet de l'angle droit doit être exactement sur ${I}, et un côté le long du segment.`,
          montrer: () => equerre.placer(M.x, M.y, -alpha),
          dessin: () => { dessinerDroite(s, M, n, "(d)", Lw, Lh, "geo-trace"); }
        },
        {
          nom: "Coder",
          texte: "Code la figure : que faut-il indiquer pour montrer que (d) est la médiatrice ?",
          codage: [["L'angle droit en " + I, true], [`Les longueurs égales ${X}${I} = ${I}${Y}`, true], ["La longueur de (d)", false]],
          dessin: () => { codageAngleDroit(s, M, u, n); codageLongueur(s, A, M, 2); codageLongueur(s, M, B, 2); },
          fin: `Bravo ! (d) est perpendiculaire à [${X}${Y}] et passe par son milieu ${I} : c'est la médiatrice de [${X}${Y}].`
        }
      ], () => { mRegle.bloquer(); mEquerre.bloquer(); });
    }
  },

  {
    groupe: F3,
    id: "programme-construction",
    titre: "Le programme de construction",
    description: "Remettre dans l'ordre les étapes qui permettent d'obtenir la figure.",
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
        consigne: `Voici une figure. Remets dans l'ordre les étapes de son programme de construction : clique sur les étapes dans l'ordre (clique à nouveau sur une étape rangée pour la retirer).`,
        figure: [prog.figure, zone],
        verifier() {
          const ordre = [...liste.querySelectorAll(".ordre-etape")].map(b => Number(b.dataset.i));
          if (ordre.length < etapes.length) return { etat: "incomplet", message: "Range toutes les étapes avant de valider." };
          // chaque étape doit venir après celles dont elle a besoin
          const place = [];
          for (let k = 0; k < ordre.length; k++) {
            const i = ordre[k];
            const manque = (etapes[i].apres || []).filter(j => !place.includes(j));
            if (manque.length) return { etat: "faux", message: `L'étape n° ${k + 1} (« ${etapes[i].texte} ») arrive trop tôt : il faut d'abord « ${etapes[manque[0]].texte} ».` };
            place.push(i);
          }
          return { etat: "juste" };
        },
        indice: "Commence par ce qui ne dépend de rien. Un point ou une droite ne peut être utilisé qu'après avoir été construit.",
        correction: "Un ordre possible :<br>" + etapes.map((e, k) => `${k + 1}. ${e.texte}`).join("<br>"),
        bloquer() { actif = false; }
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "symetrique-point",
    titre: "Placer le symétrique d'un point",
    description: "Sur quadrillage, avec un axe vertical, horizontal ou en diagonale.",
    generer() {
      const C = 10, L = 8, g = quadrillage(C, L, 32);
      const type = choisir(["vertical", "horizontal", "diagonale", "antidiagonale"]);
      const cx = alea(3, 7), cy = alea(3, 5);
      const sym = {
        vertical: (i, j) => [2 * cx - i, j],
        horizontal: (i, j) => [i, 2 * cy - j],
        diagonale: (i, j) => [cx + (j - cy), cy + (i - cx)],
        antidiagonale: (i, j) => [cx - (j - cy), cy - (i - cx)]
      }[type];
      const dans = (i, j) => i >= 0 && i <= C && j >= 0 && j <= L;
      const surAxe = Math.random() < 0.1;
      let M, S;
      do {
        M = [alea(0, C), alea(0, L)];
        S = sym(...M);
      } while (!dans(...S) || (surAxe ? S[0] !== M[0] || S[1] !== M[1] : Math.abs(S[0] - M[0]) + Math.abs(S[1] - M[1]) < 2));
      const [N] = tirerLettres(1);
      const direction = { vertical: { x: 0, y: 1 }, horizontal: { x: 1, y: 0 }, diagonale: { x: 1, y: 1 }, antidiagonale: { x: 1, y: -1 } }[type];
      const largeur = +g.svg.getAttribute("width"), hauteur = +g.svg.getAttribute("height");
      dessinerDroite(g.svg, g.P(cx, cy), V.unitaire(direction), "(d)", largeur, hauteur, "geo-axe");
      const vers = { x: 0.8, y: -1 };
      dessinerPoint(g.svg, g.P(...M), N, { vers });
      g.svg.classList.add("geo-clic");
      let choisi = null, marque = null, actif = true;
      g.svg.addEventListener("pointerdown", e => {
        if (!actif) return;
        const { i, j } = g.position(e);
        choisi = [Math.max(0, Math.min(C, Math.round(i))), Math.max(0, Math.min(L, Math.round(j)))];
        marque?.remove();
        marque = dessinerPoint(g.svg, g.P(...choisi), N + "′", { vers, classe: "geo-eleve" });
      });
      const carreaux = k => pluriel(k, "carreau").replace("carreaus", "carreaux");
      const regle = {
        vertical: "sur la même ligne", horizontal: "sur la même colonne"
      }[type];
      let correction;
      if (surAxe) correction = `${N} est sur l'axe (d) : son symétrique ${N}′ est confondu avec ${N}.`;
      else if (regle) {
        const k = type === "vertical" ? Math.abs(M[0] - cx) : Math.abs(M[1] - cy);
        correction = `${N} est à ${carreaux(k)} de l'axe. On reporte ${carreaux(k)} de l'autre côté de l'axe, ${regle} : c'est le point vert.`;
      } else {
        correction = `Pour aller de ${N} à ${N}′, on se déplace de ${carreaux(Math.abs(S[0] - M[0]))} en diagonale, perpendiculairement à l'axe ; l'axe (d) est exactement au milieu. C'est le point vert.`;
      }
      return {
        consigne: `Place le point ${N}′, symétrique de ${N} par rapport à la droite (d), en cliquant sur le quadrillage, puis valide.`,
        figure: g.svg,
        verifier() {
          if (!choisi) return { etat: "incomplet", message: "Clique sur un nœud du quadrillage pour placer le point." };
          if (choisi[0] === S[0] && choisi[1] === S[1]) return { etat: "juste" };
          if (choisi[0] === M[0] && choisi[1] === M[1]) return { etat: "faux", message: `Tu as cliqué sur ${N} lui-même.` };
          return { etat: "faux" };
        },
        indice: regle
          ? `Compte les carreaux entre ${N} et l'axe, puis reporte le même nombre de l'autre côté, ${regle}.`
          : "L'axe suit une diagonale du quadrillage : déplace-toi en diagonale, perpendiculairement à l'axe, et compte les carreaux.",
        correction,
        surCorrection() { dessinerPoint(g.svg, g.P(...S), N + "′", { vers: { x: -0.8, y: 1 }, classe: "geo-correct" }); },
        bloquer() { actif = false; }
      };
    }
  },

  {
    groupe: F4,
    id: "completer-figure",
    titre: "Compléter une figure symétrique",
    description: "Colorier des cases pour obtenir une figure symétrique.",
    generer() {
      const C = 10, L = 8, pas = 30, g = quadrillage(C, L, pas);
      const vertical = Math.random() < 0.5;
      const axe = vertical ? 5 : 4;
      const donneeCote = (i, j) => vertical ? i < axe : j < axe;
      const sym = (i, j) => vertical ? [2 * axe - 1 - i, j] : [i, 2 * axe - 1 - j];
      const cle = (i, j) => i + "," + j;

      const donnee = new Map();
      const depart = vertical ? [alea(1, 4), alea(1, 6)] : [alea(1, 8), alea(1, 3)];
      donnee.set(cle(...depart), depart);
      const n = alea(6, 9);
      while (donnee.size < n) {
        const [i, j] = choisir([...donnee.values()]);
        const [di, dj] = choisir([[1, 0], [-1, 0], [0, 1], [0, -1]]);
        const c = [i + di, j + dj];
        if (c[0] >= 0 && c[0] < C && c[1] >= 0 && c[1] < L && donneeCote(...c)) donnee.set(cle(...c), c);
      }
      const attendu = new Set([...donnee.values()].map(c => cle(...sym(...c))));
      const eleve = new Set(), rects = {};
      const cases = svg("g");
      for (let i = 0; i < C; i++) for (let j = 0; j < L; j++) {
        const p = g.P(i, j);
        rects[cle(i, j)] = svg("rect", { x: p.x, y: p.y, width: pas, height: pas,
          class: "case-quad" + (donnee.has(cle(i, j)) ? " donnee" : "") });
        cases.append(rects[cle(i, j)]);
      }
      g.svg.insertBefore(cases, g.fond);
      const debut = vertical ? g.P(axe, 0) : g.P(0, axe), fin = vertical ? g.P(axe, L) : g.P(C, axe);
      const u = V.unitaire(V.moins(fin, debut));
      dessinerTrait(g.svg, V.moins(debut, V.fois(u, 10)), V.plus(fin, V.fois(u, 10)), "segment", "geo-axe");
      dessinerTexte(g.svg, vertical ? { x: fin.x + 16, y: fin.y - 4 } : { x: fin.x - 6, y: fin.y - 14 }, "(d)", "geo-nom");
      g.svg.classList.add("geo-clic");
      let actif = true;
      g.svg.addEventListener("pointerdown", e => {
        if (!actif) return;
        const { i, j } = g.position(e);
        const ci = Math.floor(i), cj = Math.floor(j);
        if (ci < 0 || cj < 0 || ci >= C || cj >= L || donneeCote(ci, cj)) return;
        const k = cle(ci, cj);
        if (eleve.has(k)) eleve.delete(k); else eleve.add(k);
        rects[k].classList.toggle("eleve", eleve.has(k));
      });
      const nb = k => pluriel(k, "case");
      return {
        consigne: "Colorie des cases pour que la figure soit symétrique par rapport à la droite (d). Clique sur une case pour la colorier ou l'effacer, puis valide.",
        figure: g.svg,
        verifier() {
          if (!eleve.size) return { etat: "incomplet", message: "Clique sur les cases à colorier, de l'autre côté de l'axe." };
          const manque = [...attendu].filter(k => !eleve.has(k)).length;
          const trop = [...eleve].filter(k => !attendu.has(k)).length;
          if (!manque && !trop) return { etat: "juste" };
          const parties = [];
          if (manque) parties.push(`il manque ${nb(manque)}`);
          if (trop) parties.push(`${nb(trop)} ${trop > 1 ? "sont" : "est"} en trop`);
          return { etat: "faux", message: cap(parties.join(" et ")) + "." };
        },
        indice: `Pour chaque case coloriée, compte à combien de cases elle est de l'axe, puis reporte le même nombre de l'autre côté, ${vertical ? "sur la même ligne" : "dans la même colonne"}.`,
        correction: "Chaque case a sa symétrique à la même distance de l'axe, de l'autre côté. En vert : les cases qu'il fallait colorier en plus ; en rouge : les cases en trop.",
        surCorrection() {
          for (const k of attendu) if (!eleve.has(k)) rects[k].classList.add("manque");
          for (const k of eleve) if (!attendu.has(k)) rects[k].classList.add("trop");
        },
        bloquer() { actif = false; }
      };
    }
  },

  {
    groupe: F4,
    id: "axes-de-symetrie",
    titre: "Axes de symétrie",
    description: "Compter les axes de symétrie d'une figure.",
    generer() {
      const regulier = (n, r) => [...Array(n)].map((_, k) => V.fois(V.angle(-Math.PI / 2 + 2 * Math.PI * k / n), r));
      const axesRegulier = n => [...Array(n)].map((_, k) => -90 + 180 * k / n);
      const pts = t => t.map(([x, y]) => ({ x, y }));
      const forme = choisir([
        { nom: "un carré", points: pts([[-50, -50], [50, -50], [50, 50], [-50, 50]]), axes: [0, 45, 90, 135] },
        { nom: "un rectangle", points: pts([[-65, -35], [65, -35], [65, 35], [-65, 35]]), axes: [0, 90] },
        { nom: "un losange", points: pts([[65, 0], [0, -42], [-65, 0], [0, 42]]), axes: [0, 90] },
        { nom: "un triangle équilatéral", points: regulier(3, 66), axes: axesRegulier(3) },
        { nom: "un triangle isocèle", points: pts([[0, -58], [42, 45], [-42, 45]]), axes: [90] },
        { nom: "un triangle quelconque", points: pts([[-55, 45], [60, 45], [-20, -50]]), axes: [] },
        { nom: "un parallélogramme", points: pts([[-65, 35], [25, 35], [65, -35], [-25, -35]]), axes: [] },
        { nom: "un trapèze isocèle", points: pts([[-65, 35], [65, 35], [32, -35], [-32, -35]]), axes: [90] },
        { nom: "un cerf-volant", points: pts([[0, -62], [42, -15], [0, 62], [-42, -15]]), axes: [90] },
        { nom: "un pentagone régulier", points: regulier(5, 64), axes: axesRegulier(5) },
        { nom: "un hexagone régulier", points: regulier(6, 64), axes: axesRegulier(6) },
        { nom: "la lettre H", points: pts([[-40, -50], [-20, -50], [-20, -10], [20, -10], [20, -50], [40, -50], [40, 50], [20, 50], [20, 10], [-20, 10], [-20, 50], [-40, 50]]), axes: [0, 90] },
        { nom: "la lettre T", points: pts([[-45, -50], [45, -50], [45, -30], [10, -30], [10, 50], [-10, 50], [-10, -30], [-45, -30]]), axes: [90] },
        { nom: "la lettre E", points: pts([[-35, -50], [35, -50], [35, -32], [-15, -32], [-15, -9], [25, -9], [25, 9], [-15, 9], [-15, 32], [35, 32], [35, 50], [-35, 50]]), axes: [0] },
        { nom: "la lettre L", points: pts([[-30, -50], [-10, -50], [-10, 30], [35, 30], [35, 50], [-30, 50]]), axes: [] },
        { nom: "la lettre Z", points: pts([[-35, -50], [35, -50], [35, -32], [-8, 32], [35, 32], [35, 50], [-35, 50], [-35, 32], [8, -32], [-35, -32]]), axes: [] },
        { nom: "une croix", points: pts([[-15, -50], [15, -50], [15, -15], [50, -15], [50, 15], [15, 15], [15, 50], [-15, 50], [-15, 15], [-50, 15], [-50, -15], [-15, -15]]), axes: [0, 45, 90, 135] },
        { nom: "une flèche", points: pts([[-55, -12], [10, -12], [10, -35], [55, 0], [10, 35], [10, 12], [-55, 12]]), axes: [0] }
      ]);
      const c = { x: 130, y: 100 };
      const s = figureGeo(260, 200, "Figure");
      const chemin = forme.points.map((p, k) => (k ? "L" : "M") + (c.x + p.x).toFixed(1) + "," + (c.y + p.y).toFixed(1)).join(" ") + " Z";
      s.append(svg("path", { d: chemin, class: "geo-forme" }));
      const n = forme.axes.length;
      return {
        consigne: "Combien cette figure a-t-elle d'axes de symétrie ?",
        figure: s,
        ligne: "[n] axe(s) de symétrie",
        verifier: v => verifierNombre(v[0], n),
        indice: "Imagine que tu plies la figure le long d'une droite : les deux moitiés doivent se superposer exactement. Pense aussi aux diagonales.",
        correction: n
          ? `C'est ${forme.nom} : ${n > 1 ? `il y a ${n} axes de symétrie, tracés` : "il y a 1 axe de symétrie, tracé"} en vert.`
          : `C'est ${forme.nom} : il n'y a aucun axe de symétrie, car aucun pliage ne permet de superposer les deux moitiés.`,
        surCorrection() {
          for (const a of forme.axes) dessinerTrait(s, c, V.plus(c, V.angle(a * DEG)), "droite", "geo-axe-correct");
        }
      };
    }
  },

  {
    groupe: F4,
    id: "construire-symetrique",
    titre: "Construire le symétrique d'un point",
    description: "Sans quadrillage : équerre, règle, puis report de la longueur.",
    generer() {
      const Lw = 640, Lh = 460;
      const s = figureGeo(Lw, Lh, "Construction");
      s.classList.add("construction", "geo-manipuler");
      const [Mn, Hn] = tirerLettres(2);
      const beta = choisir([alea(-60, -20), alea(20, 60), alea(95, 150)]);
      const u = dir(beta), n0 = V.normal(u);
      const Hp = { x: 300 + alea(-30, 30), y: 220 + alea(-20, 20) };
      const d = alea(20, 38) / 10;                       // distance MH en cm
      const cote = choisir([-1, 1]);
      const nn = V.fois(n0, cote);
      const Mp = V.plus(Hp, V.fois(nn, d * CM));
      dessinerDroite(s, Hp, u, "(d)", Lw, Lh);
      dessinerPoint(s, Mp, Mn, { vers: nn });
      const regle = creerRegle(9), equerre = creerEquerre();
      regle.placer(40, 400, 0); equerre.placer(300, 445, 0);
      s.append(equerre);
      const angleH = Math.atan2(Mp.y - Hp.y, Mp.x - Hp.x) / DEG; // direction de H vers M, à l'écran
      const mEquerre = rendreMobile(s, equerre, { points: [Hp], angles: [0, 90, 180, 270].map(k => k - beta) });
      const mRegle = rendreMobile(s, regle, { points: [Hp, Mp], angles: [angleH, angleH + 180] });
      return atelier(s, [
        {
          nom: "Perpendiculaire",
          texte: `Place l'équerre : un côté de l'angle droit le long de (d), l'autre côté passant par ${Mn}. Fais-la glisser le long de (d). Puis clique sur « Tracer ».`,
          tracer: () => mEquerre.surPoint(Hp) ? true : `L'équerre n'est pas bien placée : un côté le long de (d), et l'autre côté doit passer exactement par ${Mn}.`,
          montrer: () => equerre.placer(Hp.x, Hp.y, -beta),
          dessin: () => {
            dessinerTrait(s, V.moins(Hp, V.fois(nn, 5.5 * CM)), V.plus(Hp, V.fois(nn, 5.5 * CM)), "segment", "geo-trace");
            dessinerPoint(s, Hp, Hn, { vers: V.plus(V.fois(u, 1), V.fois(nn, -0.6)) });
            codageAngleDroit(s, Hp, u, nn);
          }
        },
        {
          nom: "Mesurer",
          avant: () => s.append(regle),
          texte: `La perpendiculaire coupe (d) en ${Hn}. Mesure ${Mn}${Hn} avec la règle.`,
          champ: `${Mn}${Hn} = [d] cm`,
          valider: v => Math.abs(v - d) < 0.05 || `Vérifie ta mesure : le zéro de la règle sur ${Hn} (ou sur ${Mn}), la règle le long de la perpendiculaire.`,
          montrer: () => regle.placer(Hp.x, Hp.y, angleH),
          reponse: d
        },
        {
          nom: "Reporter",
          texte: `Place ${Mn}′ sur la perpendiculaire, de l'autre côté de (d), tel que ${Hn}${Mn}′ = ${Hn}${Mn} = ${ecrireNombre(d)} cm. Clique sur la perpendiculaire.`,
          clic: { depart: Hp, direction: V.fois(nn, -1), longueur: 5.5, nom: Mn + "′", cible: d, deuxSens: true,
            message: t => t < 0 ? `Ce point est du même côté que ${Mn} : ${Mn}′ doit être de l'autre côté de (d).` : `Ton point est à ${ecrireNombre(t)} cm de ${Hn} : il doit être à ${ecrireNombre(d)} cm.` },
          dessin: () => { codageLongueur(s, Hp, Mp, 2); codageLongueur(s, Hp, V.plus(Hp, V.fois(nn, -d * CM)), 2); },
          fin: `Bravo ! (d) est la médiatrice de [${Mn}${Mn}′] : ${Mn}′ est le symétrique de ${Mn} par rapport à (d).`
        }
      ], () => { mRegle.bloquer(); mEquerre.bloquer(); });
    }
  },

  {
    groupe: F4,
    id: "demonstration-symetrie",
    titre: "Rédiger une démonstration avec la symétrie",
    description: "Je sais que… / Or… / Donc…, avec les propriétés de la symétrie axiale.",
    generer() {
      const [A, B, C, I] = tirerLettres(4);
      const x = alea(15, 95) / 10, X = cm(x);
      const a = alea(30, 70) / 10, b = alea(30, 70) / 10, c = alea(Math.ceil((Math.abs(a - b) + 0.6) * 10), Math.floor((a + b - 0.6) * 10)) / 10;
      const p = Math.round((a + b + c) * 10) / 10, aire = alea(6, 40);
      const sc = choisir([
        {
          enonce: `${A}′ et ${B}′ sont les symétriques de ${A} et ${B} par rapport à la droite (d), et ${A}${B} = ${X}. Démontre que ${A}′${B}′ = ${X}.`,
          sais: [`Le segment [${A}′${B}′] est le symétrique du segment [${A}${B}] par rapport à (d).`, `${A}′${B}′ = ${X}.`, `(d) est la médiatrice de [${A}${B}].`],
          or: "symLongueurs", piege: "mediatrice",
          donc: [`${A}′${B}′ = ${A}${B}, c'est-à-dire ${A}′${B}′ = ${X}.`, `${A}′${B}′ = 2 × ${A}${B}.`, `(d) est la médiatrice de [${A}′${B}′].`]
        },
        {
          enonce: `${A}′ est le symétrique de ${A} par rapport à la droite (d). Démontre que (d) est la médiatrice du segment [${A}${A}′].`,
          sais: [`${A}′ est le symétrique de ${A} par rapport à (d).`, `(d) est la médiatrice de [${A}${A}′].`, `${A} appartient à (d).`],
          or: "symDefinition", piege: "reciproque",
          donc: [`(d) est la médiatrice de [${A}${A}′].`, `${A}${A}′ = 2 × ${A}(d).`, `${A} et ${A}′ sont confondus.`]
        },
        {
          enonce: `Le point ${A} appartient à la droite (d). Démontre que ${A} est son propre symétrique par rapport à (d).`,
          sais: [`${A} appartient à l'axe de symétrie (d).`, `${A} est son propre symétrique.`, `${A} est le milieu de (d).`],
          or: "symAxe", piege: "symDefinition",
          donc: [`Le symétrique de ${A} par rapport à (d) est ${A} lui-même.`, `(d) est la médiatrice de [${A}${A}].`, `${A} n'a pas de symétrique.`]
        },
        {
          enonce: `Les triangles ${A}${B}${C} et ${A}′${B}′${C}′ sont symétriques par rapport à la droite (d). Le périmètre du triangle ${A}${B}${C} est ${cm(p)}. Démontre que le périmètre de ${A}′${B}′${C}′ est ${cm(p)}.`,
          sais: [`Le triangle ${A}′${B}′${C}′ est le symétrique du triangle ${A}${B}${C} par rapport à (d).`, `Le périmètre de ${A}′${B}′${C}′ est ${cm(p)}.`, `(d) est la médiatrice de [${A}${B}].`],
          or: "symLongueurs", piege: "symAires",
          donc: [`Les côtés des deux triangles ont les mêmes longueurs : le périmètre de ${A}′${B}′${C}′ est aussi ${cm(p)}.`, `Le périmètre de ${A}′${B}′${C}′ est 2 × ${cm(p)}.`, `Les deux triangles ont la même aire.`]
        },
        {
          enonce: `${I} est le milieu de [${A}${B}]. ${A}′, ${B}′ et ${I}′ sont les symétriques de ${A}, ${B} et ${I} par rapport à (d). Démontre que ${I}′ est le milieu de [${A}′${B}′].`,
          sais: [`${I} est le milieu de [${A}${B}], et ${A}′, ${B}′, ${I}′ sont les symétriques de ${A}, ${B}, ${I} par rapport à (d).`, `${I}′ est le milieu de [${A}′${B}′].`, `${I} appartient à (d).`],
          or: "symMilieux", piege: "milieu",
          donc: [`${I}′ est le milieu de [${A}′${B}′].`, `${I}′ = ${I}.`, `(d) est la médiatrice de [${A}′${B}′].`]
        },
        {
          enonce: `La figure F′ est la symétrique de la figure F par rapport à la droite (d), et l'aire de F est ${aire} cm². Démontre que l'aire de F′ est ${aire} cm².`,
          sais: [`F′ est la symétrique de F par rapport à (d).`, `L'aire de F′ est ${aire} cm².`, `F et F′ ont le même périmètre.`],
          or: "symAires", piege: "symLongueurs",
          donc: [`L'aire de F′ est égale à l'aire de F : ${aire} cm².`, `L'aire de F′ est ${2 * aire} cm².`, `F′ = F.`]
        }
      ]);
      return demonstration(sc, ["symLongueurs", "symAires", "symMilieux", "symDefinition", "symAxe", "mediatrice", "reciproque"]);
    }
  },

];
