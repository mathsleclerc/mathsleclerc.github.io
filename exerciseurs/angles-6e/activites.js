/* =====================================================================
   EXERCISEUR « ANGLES » — 6e, chapitre 5

   Vocabulaire, nature, rapporteur (lire, mesurer, tracer), bissectrice,
   calculs (angle plat, adjacents, opposés par le sommet), diagrammes
   circulaires et horloge. Les angles dans un triangle sont au chapitre 9.
   ===================================================================== */

const A1 = "Vocabulaire et notation";
const A2 = "La nature d'un angle";
const A3 = "Estimer et mesurer";
const A4 = "Tracer un angle";
const A5 = "La bissectrice";
const A6 = "Calculer avec les angles";
const A7 = "Diagrammes circulaires";
const A8 = "Pour le plaisir";

/* Notation avec le chapeau sur la lettre du sommet : ang("x", "O", "y") → xÔy */
const ang = (a, s, b) => `<span class="nom-angle">${a}<span class="angle">${s}</span>${b}</span>`;
const deg = x => `${x}°`;

/* Direction (dans le repère de l'écran) d'un angle en degrés compté dans le sens inverse des aiguilles d'une montre */
const dir = phi => ({ x: Math.cos(phi * DEG), y: -Math.sin(phi * DEG) });
const pt = (O, phi, r) => V.plus(O, V.fois(dir(phi), r));
const normaliser = a => ((a % 360) + 540) % 360 - 180; // entre −180 et 180

/* Un angle dessiné : sommet O, côtés d'angles alpha et alpha + theta */
function dessinerAngle(s, O, alpha, theta, { l1 = 190, l2 = 190, noms = ["x", "O", "y"], arc = true, classeCotes = "geo-objet" } = {}) {
  const A = pt(O, alpha, l1), B = pt(O, alpha + theta, l2);
  dessinerTrait(s, O, A, "segment", classeCotes);
  dessinerTrait(s, O, B, "segment", classeCotes);
  if (arc && theta > 0 && theta < 180) arcAngle(s, O, alpha, alpha + theta, 34);
  dessinerPoint(s, O, noms[1], { vers: V.fois(dir(alpha + theta / 2), -1) });
  dessinerTexte(s, pt(O, alpha - 6, l1 - 6), noms[0], "geo-nom-angle");
  dessinerTexte(s, pt(O, alpha + theta + 6, l2 - 6), noms[2], "geo-nom-angle");
  return { A, B };
}
/* Arc d'angle entre les directions phi1 et phi2 (phi2 > phi1), avec un texte facultatif */
function arcAngle(s, O, phi1, phi2, r, texte = "", classe = "geo-arc") {
  const P1 = pt(O, phi1, r), P2 = pt(O, phi2, r);
  s.append(svg("path", { d: `M${P1.x},${P1.y} A${r},${r} 0 ${phi2 - phi1 > 180 ? 1 : 0} 0 ${P2.x},${P2.y}`, class: classe }));
  if (texte) dessinerTexte(s, pt(O, (phi1 + phi2) / 2, r + 20), texte, "geo-mesure");
}

/* ---------- Le rapporteur ----------
   Deux graduations : l'extérieure part de 0 à gauche, l'intérieure (rouge) de 0 à droite.
   Position : centre (tx, ty) et rotation rot (en degrés, sens de l'écran). */
function creerRapporteur(R = 150) {
  const g = svg("g", { class: "rapporteur" });
  const Rp = R + 12;
  g.append(svg("path", { d: `M${-Rp},0 A${Rp},${Rp} 0 0 1 ${Rp},0 Z`, class: "rap-fond" }));
  for (let d = 0; d <= 180; d++) {
    const l = d % 10 === 0 ? 13 : d % 5 === 0 ? 9 : 5;
    const p1 = pt({ x: 0, y: 0 }, d, Rp), p2 = pt({ x: 0, y: 0 }, d, Rp - l);
    g.append(svg("line", { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, class: "rap-grad" }));
    if (d % 10 === 0) {
      const e = pt({ x: 0, y: 0 }, d, Rp - 21), i = pt({ x: 0, y: 0 }, d, Rp - 45);
      g.append(svg("text", { x: e.x, y: e.y + 4, class: "rap-ext" }, String(180 - d)));
      g.append(svg("text", { x: i.x, y: i.y + 4, class: "rap-int" }, String(d)));
    }
  }
  g.append(svg("line", { x1: -Rp, y1: 0, x2: Rp, y2: 0, class: "rap-base" }),
    svg("line", { x1: 0, y1: 0, x2: 0, y2: -18, class: "rap-base" }),
    svg("circle", { cx: 0, cy: 0, r: 3.5, class: "rap-centre" }));
  const poignee = svg("g", { class: "rap-poignee" },
    svg("circle", { cx: Rp + 22, cy: 0, r: 13 }),
    svg("text", { x: Rp + 22, y: 5 }, "↻"));
  g.append(poignee);
  g.poignee = poignee;
  g.pos = { x: 0, y: 0, rot: 0 };
  g.placer = (x, y, rot) => {
    g.pos = { x, y, rot: ((rot % 360) + 360) % 360 };
    g.setAttribute("transform", `translate(${x},${y}) rotate(${g.pos.rot})`);
  };
  return g;
}
function coordonnees(s, e) {
  const p = s.createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(s.getScreenCTM().inverse());
}
/* Rend le rapporteur déplaçable (glisser) et orientable (poignée ↻), avec aimantation */
function rapporteurMobile(s, rap, aimants) {
  let mode = null, depart = null, actif = true;
  const debut = (e, m) => {
    if (!actif) return;
    e.preventDefault(); e.stopPropagation();
    mode = m;
    const p = coordonnees(s, e);
    depart = { px: p.x, py: p.y, ...rap.pos };
    s.setPointerCapture?.(e.pointerId);
  };
  rap.addEventListener("pointerdown", e => debut(e, e.target.closest(".rap-poignee") ? "tourner" : "glisser"));
  s.addEventListener("pointermove", e => {
    if (!mode) return;
    const p = coordonnees(s, e);
    if (mode === "glisser") {
      let x = depart.x + p.x - depart.px, y = depart.y + p.y - depart.py;
      const c = aimants.centre;
      if (Math.hypot(x - c.x, y - c.y) < 14) { x = c.x; y = c.y; }
      rap.placer(x, y, rap.pos.rot);
    } else {
      let rot = Math.atan2(p.y - rap.pos.y, p.x - rap.pos.x) / DEG;
      for (const r of aimants.rotations) if (Math.abs(normaliser(rot - r)) < 4) rot = r;
      rap.placer(rap.pos.x, rap.pos.y, rot);
    }
  });
  const fin = () => { mode = null; };
  s.addEventListener("pointerup", fin);
  s.addEventListener("pointercancel", fin);
  return { bloquer: () => { actif = false; } };
}
const bienPlace = (rap, aimants) =>
  Math.hypot(rap.pos.x - aimants.centre.x, rap.pos.y - aimants.centre.y) < 1 &&
  aimants.rotations.some(r => Math.abs(normaliser(rap.pos.rot - r)) < 0.5);

/* Une demi-droite que l'on fait tourner autour de O en tirant sa poignée (angle entier) */
function demiDroiteMobile(s, O, phi0, longueur, nom) {
  const g = svg("g", { class: "rayon-mobile" });
  const trait = svg("line", { class: "rayon-trait" });
  const poignee = svg("circle", { r: 11, class: "rayon-poignee" });
  const etiquette = svg("text", { class: "geo-nom-angle" }, nom);
  g.append(trait, poignee, etiquette);
  s.append(g);
  const res = { phi: phi0, actif: true, touche: false };
  const placer = phi => {
    res.phi = Math.round(phi);
    const B = pt(O, res.phi, longueur), E = pt(O, res.phi + 5, longueur + 10);
    trait.setAttribute("x1", O.x); trait.setAttribute("y1", O.y);
    trait.setAttribute("x2", B.x); trait.setAttribute("y2", B.y);
    poignee.setAttribute("cx", B.x); poignee.setAttribute("cy", B.y);
    etiquette.setAttribute("x", E.x); etiquette.setAttribute("y", E.y + 5);
  };
  placer(phi0);
  let tire = false;
  poignee.addEventListener("pointerdown", e => { if (!res.actif) return; e.preventDefault(); tire = true; s.setPointerCapture?.(e.pointerId); });
  s.addEventListener("pointermove", e => {
    if (!tire) return;
    const p = coordonnees(s, e);
    res.touche = true;
    placer(Math.atan2(O.y - p.y, p.x - O.x) / DEG);
  });
  s.addEventListener("pointerup", () => { tire = false; });
  res.tourner = d => { if (res.actif) { res.touche = true; placer(res.phi + d); } };
  return res;
}
const boutonsRotation = rayon => el("div", { class: "rotation" },
  el("span", {}, "Faire tourner :"),
  ...[[-5, "↻ 5°"], [-1, "↻ 1°"], [1, "↺ 1°"], [5, "↺ 5°"]].map(([d, t]) => el("button", { type: "button", class: "btn", onclick: () => rayon.tourner(d) }, t)));

/* Une figure « angle » de taille standard */
const figure = (l = 560, h = 380) => figureGeo(l, h, "Figure");

/* ---------- Diagramme circulaire ---------- */
const COULEURS = ["#3f7fd0", "#e8821e", "#2e8b57", "#b83280", "#d4a017"];
function diagramme(parts, { r = 100, legende = true, taille = 250 } = {}) {
  const s = svg("svg", { viewBox: `0 0 ${taille} ${taille}`, width: taille, height: taille, class: "diagramme", role: "img", "aria-label": "Diagramme circulaire" });
  const C = { x: taille / 2, y: taille / 2 };
  let debut = 90; // on part de midi, dans le sens des aiguilles d'une montre
  parts.forEach((p, i) => {
    const fin = debut - p.angle;
    const P1 = pt(C, debut, r), P2 = pt(C, fin, r);
    s.append(svg("path", { d: `M${C.x},${C.y} L${P1.x},${P1.y} A${r},${r} 0 ${p.angle > 180 ? 1 : 0} 1 ${P2.x},${P2.y} Z`, fill: COULEURS[i % 5], class: "secteur" }));
    if (legende) {
      const M = pt(C, (debut + fin) / 2, r * 0.62);
      s.append(svg("text", { x: M.x, y: M.y + 5, class: "secteur-texte" }, p.nom));
    }
    debut = fin;
  });
  return s;
}

/* ---------- Horloge ---------- */
function horloge(h, m) {
  const s = svg("svg", { viewBox: "0 0 260 260", width: 230, height: 230, class: "horloge", role: "img", "aria-label": `Horloge : ${h} h ${m || ""}` });
  const C = { x: 130, y: 130 };
  s.append(svg("circle", { cx: 130, cy: 130, r: 118, class: "h-cadran" }));
  for (let k = 0; k < 60; k++) {
    const phi = 90 - 6 * k, gros = k % 5 === 0;
    const a = pt(C, phi, 112), b = pt(C, phi, gros ? 98 : 106);
    s.append(svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: gros ? "h-grad gros" : "h-grad" }));
    if (gros) { const t = pt(C, phi, 84); s.append(svg("text", { x: t.x, y: t.y + 6, class: "h-num" }, String(k / 5 || 12))); }
  }
  const aiguille = (phi, l, classe) => { const b = pt(C, phi, l); s.append(svg("line", { x1: 130, y1: 130, x2: b.x, y2: b.y, class: classe })); };
  aiguille(90 - (30 * (h % 12) + m / 2), 58, "h-heures");
  aiguille(90 - 6 * m, 88, "h-minutes");
  s.append(svg("circle", { cx: 130, cy: 130, r: 5, class: "h-centre" }));
  return s;
}

const ACTIVITES = [

  /* ================= Vocabulaire et notation ================= */

  {
    groupe: A1,
    id: "sommet-cotes",
    titre: "Sommet et côtés",
    description: "Reconnaître le sommet et les côtés d'un angle.",
    generer() {
      const [S, P, Q] = tirerLettres(3);
      const s = figure();
      const alpha = alea(-20, 60), theta = alea(35, 140);
      const O = { x: 200 + alea(-20, 20), y: 250 };
      const A = pt(O, alpha, 150), B = pt(O, alpha + theta, 150);
      dessinerTrait(s, O, A, "demi", "geo-objet");
      dessinerTrait(s, O, B, "demi", "geo-objet");
      arcAngle(s, O, alpha, alpha + theta, 34);
      dessinerPoint(s, O, S, { vers: V.fois(dir(alpha + theta / 2), -1) });
      dessinerPoint(s, A, P, { vers: dir(alpha - 90) });
      dessinerPoint(s, B, Q, { vers: dir(alpha + theta + 90) });
      const cotes = melanger([`[${S}${P}) et [${S}${Q})`, `[${P}${S}) et [${Q}${S})`, `(${S}${P}) et (${S}${Q})`, `[${S}${P}] et [${S}${Q}]`]);
      const bonne = `[${S}${P}) et [${S}${Q})`;
      return {
        consigne: `Voici l'angle ${ang(P, S, Q)}.`,
        figure: s,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>Quel est son sommet ?</p>[s]</div><div class="etape-pb"><p>Quels sont ses côtés ?</p>[s]</div>`,
        listes: [melanger([S, P, Q]), cotes],
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Réponds aux deux questions." };
          const sommets = this.listes[0];
          const fautes = [];
          if (sommets[v[0]] !== S) fautes.push("le sommet");
          if (cotes[v[1]] !== bonne) fautes.push("les côtés");
          return fautes.length ? { etat: "faux", message: `À revoir : ${fautes.join(" et ")}.` } : { etat: "juste" };
        },
        indice: "Les côtés d'un angle sont deux demi-droites qui partent du sommet : le sommet est l'origine commune.",
        correction: `Le sommet est ${S} (la lettre sous le chapeau) ; les côtés sont les demi-droites ${bonne}, qui partent du sommet.`
      };
    }
  },

  {
    groupe: A1,
    id: "nommer-angle",
    titre: "Nommer un angle",
    description: "Le chapeau se place sur la lettre du sommet.",
    generer() {
      const troisPoints = Math.random() < 0.5;
      const [a, S, b] = troisPoints ? tirerLettres(3) : [choisir(["x", "u", "r"]), choisir(tirerLettres(4)), null];
      const c = troisPoints ? b : { x: "y", u: "v", r: "s" }[a];
      const s = figure();
      const alpha = alea(-15, 40), theta = alea(40, 130);
      const O = { x: 210, y: 260 };
      const A = pt(O, alpha, 170), B = pt(O, alpha + theta, 170);
      dessinerTrait(s, O, A, "demi", "geo-objet");
      dessinerTrait(s, O, B, "demi", "geo-objet");
      arcAngle(s, O, alpha, alpha + theta, 34);
      dessinerPoint(s, O, S, { vers: V.fois(dir(alpha + theta / 2), -1) });
      if (troisPoints) {
        dessinerPoint(s, A, a, { vers: dir(alpha - 90) });
        dessinerPoint(s, B, c, { vers: dir(alpha + theta + 90) });
      } else {
        dessinerTexte(s, pt(O, alpha - 7, 175), a, "geo-nom-angle");
        dessinerTexte(s, pt(O, alpha + theta + 7, 175), c, "geo-nom-angle");
      }
      const justes = [ang(a, S, c), ang(c, S, a)];
      const options = melanger([choisir(justes), `<span class="angle">${a}</span>${S}${c}`, `${S}${a}<span class="angle">${c}</span>`, `<span class="angle">${S}</span>${a}${c}`]);
      return {
        consigne: "Quelle est la bonne notation de cet angle ?",
        figure: s,
        choix: options,
        verifier: (v, ch) => ({ etat: justes.includes(ch) ? "juste" : "faux" }),
        indice: "La lettre du sommet se place au milieu, sous le chapeau.",
        correction: `Le sommet est ${S} : il est au milieu, sous le chapeau. On écrit ${justes[0]} (ou ${justes[1]}).`
      };
    }
  },

  /* ================= La nature d'un angle ================= */

  {
    groupe: A2,
    id: "nature-figure",
    titre: "Aigu, droit, obtus ou plat ?",
    description: "Reconnaître la nature d'un angle sur une figure.",
    generer() {
      const nature = choisir(["aigu", "aigu", "droit", "obtus", "obtus", "plat"]);
      const theta = { aigu: alea(4, 14) * 5, droit: 90, obtus: alea(22, 34) * 5, plat: 180 }[nature];
      const s = figure();
      const alpha = alea(-40, 40);
      const O = { x: 280, y: 220 };
      dessinerAngle(s, O, alpha, theta, { l1: alea(120, 190), l2: alea(120, 190), arc: theta < 180 });
      if (theta === 180) arcAngle(s, O, alpha, alpha + 179.9, 30);
      return {
        consigne: "Quelle est la nature de cet angle ? Tu peux utiliser ton équerre sur l'écran.",
        figure: s,
        choix: ["aigu", "droit", "obtus", "plat"],
        verifier: (v, c) => ({ etat: c === nature ? "juste" : "faux" }),
        indice: "Compare l'angle avec un angle droit (le coin de ton équerre) : plus petit, égal ou plus grand ?",
        correction: `Cet angle mesure ${theta}° : c'est un angle ${nature}. Aigu : entre 0° et 90° ; droit : 90° ; obtus : entre 90° et 180° ; plat : 180°.`
      };
    }
  },

  {
    groupe: A2,
    id: "nature-mesure",
    titre: "D'après la mesure",
    description: "89° : aigu ; 91° : obtus ; 180° : plat…",
    generer() {
      const m = choisir([0, 90, 180, alea(1, 89), alea(1, 89), alea(85, 89), alea(91, 95), alea(91, 179), alea(91, 179)]);
      const nature = m === 0 ? "nul" : m < 90 ? "aigu" : m === 90 ? "droit" : m < 180 ? "obtus" : "plat";
      return {
        consigne: `Un angle mesure ${m}°. Quelle est sa nature ?`,
        choix: ["nul", "aigu", "droit", "obtus", "plat"],
        verifier: (v, c) => ({ etat: c === nature ? "juste" : "faux" }),
        indice: "Nul : 0° ; aigu : entre 0° et 90° ; droit : 90° ; obtus : entre 90° et 180° ; plat : 180°.",
        correction: `${m}° : c'est un angle ${nature}${nature === "aigu" ? " (entre 0° et 90°)" : nature === "obtus" ? " (entre 90° et 180°)" : ""}.`
      };
    }
  },

  /* ================= Estimer et mesurer ================= */

  {
    groupe: A3,
    id: "estimer",
    titre: "Estimer un angle",
    description: "Trouver la mesure la plus proche, sans rapporteur.",
    generer() {
      const theta = alea(2, 34) * 5;
      const s = figure();
      const alpha = alea(-30, 40);
      dessinerAngle(s, { x: 270, y: 240 }, alpha, theta, { l1: 170, l2: 170 });
      const options = [theta];
      while (options.length < 4) {
        const x = alea(1, 17) * 10;
        if (options.every(o => Math.abs(o - x) >= 30)) options.push(x);
      }
      const choix = options.sort((a, b) => a - b).map(deg);
      return {
        consigne: "Sans mesurer, quelle est la mesure de cet angle ?",
        figure: s,
        choix,
        verifier: (v, c) => ({ etat: c === deg(theta) ? "juste" : "faux" }),
        indice: "Compare d'abord avec un angle droit (90°) : l'angle est-il plus petit ou plus grand ? Puis avec la moitié d'un angle droit (45°)…",
        correction: `Cet angle mesure ${theta}° : il est ${theta < 90 ? "aigu, plus petit qu'un angle droit" : theta === 90 ? "droit" : "obtus, plus grand qu'un angle droit"}.`
      };
    }
  },

  {
    groupe: A3,
    id: "lire-rapporteur",
    titre: "Lire un rapporteur",
    description: "Le rapporteur est bien placé : lire la bonne graduation.",
    generer() {
      const theta = alea(2, 34) * 5;
      const s = figure(560, 330);
      const alpha = choisir([0, 0, alea(-20, 20)]);
      const O = { x: 280, y: 265 };
      const rap = creerRapporteur();
      // Le zéro est sur le premier côté (graduation rouge) ou sur le second (graduation noire)
      const surPremier = Math.random() < 0.5;
      rap.placer(O.x, O.y, surPremier ? -alpha : 180 - (alpha + theta));
      rap.poignee.remove();
      s.append(rap);
      dessinerAngle(s, O, alpha, theta, { l1: 205, l2: 205, arc: false });
      return {
        consigne: "Le rapporteur est bien placé. Quelle est la mesure de l'angle ?",
        figure: s,
        ligne: `${ang("x", "O", "y")} = [n] °`,
        verifier(v) {
          const r = verifierNombre(v[0], theta);
          if (r.etat === "faux" && lireNombre(v[0]) === 180 - theta) r.message = `Tu as lu la mauvaise graduation ! Cet angle est ${theta < 90 ? "aigu : sa mesure est plus petite" : "obtus : sa mesure est plus grande"} que 90°.`;
          return r;
        },
        indice: "Repère le côté qui passe par le zéro, puis lis sur la graduation qui part de ce zéro. L'angle est-il aigu ou obtus ?",
        correction: `Le zéro de la graduation ${surPremier ? "rouge (intérieure)" : "noire (extérieure)"} est sur un côté ; on lit sur cette graduation : ${theta}°. Vérification : l'angle est ${theta < 90 ? "aigu" : theta === 90 ? "droit" : "obtus"}.`
      };
    }
  },

  {
    groupe: A3,
    id: "mesurer-rapporteur",
    titre: "Mesurer au rapporteur",
    description: "Placer soi-même le rapporteur, puis lire la mesure.",
    generer() {
      const theta = alea(2, 34) * 5;
      const s = figure(620, 470);
      s.classList.add("geo-manipuler");
      const alpha = alea(-30, 30);
      const O = { x: 330 + alea(-20, 20), y: 300 };
      dessinerAngle(s, O, alpha, theta, { l1: alea(170, 215), l2: alea(170, 215) });
      const rap = creerRapporteur();
      rap.placer(150, 440, 0);
      s.append(rap);
      const aimants = { centre: O, rotations: [-alpha, 180 - (alpha + theta)].map(r => ((r % 360) + 360) % 360) };
      const mobile = rapporteurMobile(s, rap, aimants);
      return {
        consigne: "Fais glisser le rapporteur et tourne-le avec la poignée ↻ : son centre sur le sommet, le zéro sur un côté. Puis lis la mesure.",
        figure: s,
        ligne: `${ang("x", "O", "y")} = [n] °`,
        verifier(v) {
          const r = verifierNombre(v[0], theta);
          if (r.etat === "faux" && lireNombre(v[0]) === 180 - theta) r.message = `Tu as lu la mauvaise graduation : l'angle est ${theta < 90 ? "aigu" : "obtus"}.`;
          else if (r.etat === "faux" && !bienPlace(rap, aimants)) r.message = "Vérifie d'abord la position du rapporteur : le centre sur le sommet O, le zéro sur un côté.";
          return r;
        },
        indice: "1. Le centre du rapporteur sur le sommet. 2. Le zéro d'une graduation sur un côté. 3. On lit sur la graduation qui part de ce zéro.",
        correction: `L'angle mesure ${theta}° : le rapporteur est maintenant bien placé.`,
        surCorrection() { rap.placer(O.x, O.y, aimants.rotations[0]); },
        bloquer: mobile.bloquer
      };
    }
  },

  /* ================= Tracer un angle ================= */

  {
    groupe: A4,
    id: "tracer-angle",
    titre: "Tracer un angle",
    description: "Faire tourner le second côté jusqu'à la mesure demandée.",
    generer() {
      const theta = alea(2, 34) * 5 + choisir([0, 0, 0, 2, 3]);
      const s = figure(560, 330);
      s.classList.add("geo-manipuler");
      const alpha = choisir([0, 0, alea(-15, 15)]);
      const O = { x: 280, y: 265 };
      const rap = creerRapporteur();
      rap.placer(O.x, O.y, -alpha);
      rap.poignee.remove();
      s.append(rap);
      dessinerTrait(s, O, pt(O, alpha, 220), "segment", "geo-objet");
      dessinerPoint(s, O, "O", { vers: { x: 0, y: 1 } });
      dessinerTexte(s, pt(O, alpha - 5, 225), "x", "geo-nom-angle");
      const rayon = demiDroiteMobile(s, O, alpha + 45, 205, "y");
      return {
        consigne: `Le rapporteur est placé sur [Ox). Fais tourner la demi-droite [Oy) en tirant le point rond, pour que ${ang("x", "O", "y")} = ${theta}°.`,
        figure: s,
        apresLigne: boutonsRotation(rayon),
        verifier() {
          if (!rayon.touche) return { etat: "incomplet", message: "Fais tourner la demi-droite [Oy) en tirant le point rond, ou avec les boutons." };
          const mesure = Math.abs(normaliser(rayon.phi - alpha));
          if (Math.abs(mesure - theta) <= 1) return { etat: "juste" };
          if (Math.abs(mesure - (180 - theta)) <= 1) return { etat: "faux", message: `Ton angle mesure ${mesure}° : tu as lu la graduation noire au lieu de la rouge, qui part de [Ox).` };
          return { etat: "faux", message: `Ton angle mesure ${mesure}°.` };
        },
        indice: "Le zéro est sur [Ox) : utilise la graduation qui part de ce zéro (la rouge). Un angle de moins de 90° est aigu.",
        correction: `On lit ${theta} sur la graduation rouge, qui part de [Ox). La bonne position est tracée en vert.`,
        surCorrection() { dessinerTrait(s, O, pt(O, alpha + theta, 205), "segment", "geo-axe-correct"); },
        bloquer() { rayon.actif = false; }
      };
    }
  },

  /* ================= La bissectrice ================= */

  {
    groupe: A5,
    id: "bissectrice-calcul",
    titre: "Calculer avec la bissectrice",
    description: "La bissectrice partage l'angle en deux angles de même mesure.",
    generer() {
      const s = figure();
      const alpha = alea(-10, 25);
      const O = { x: 200, y: 260 };
      const cas = choisir(["moitie", "moitie", "double", "reconnaitre"]);
      if (cas === "reconnaitre") {
        const egal = Math.random() < 0.5;
        const t1 = alea(4, 10) * 5, t2 = egal ? t1 : t1 + choisir([-1, 1]) * alea(1, 3) * 5;
        dessinerAngle(s, O, alpha, t1 + t2, { noms: ["x", "O", "y"], arc: false });
        dessinerTrait(s, O, pt(O, alpha + t1, 190), "segment", "geo-objet");
        dessinerTexte(s, pt(O, alpha + t1 + 4, 198), "z", "geo-nom-angle");
        arcAngle(s, O, alpha, alpha + t1, 60, `${t1}°`);
        arcAngle(s, O, alpha + t1, alpha + t1 + t2, 85, `${t2}°`);
        return {
          consigne: `La demi-droite [Oz) est-elle la bissectrice de l'angle ${ang("x", "O", "y")} ?`,
          figure: s,
          choix: ["Oui", "Non"],
          verifier: (v, c) => ({ etat: (c === "Oui") === egal ? "juste" : "faux" }),
          indice: "La bissectrice partage l'angle en deux angles de même mesure.",
          correction: egal
            ? `Oui : ${ang("x", "O", "z")} = ${ang("z", "O", "y")} = ${t1}°, donc [Oz) partage l'angle en deux angles égaux.`
            : `Non : ${ang("x", "O", "z")} = ${t1}° et ${ang("z", "O", "y")} = ${t2}° ne sont pas égaux.`
        };
      }
      const moitie = alea(10, 80);
      const total = moitie * 2;
      dessinerAngle(s, O, alpha, total, { arc: false });
      dessinerTrait(s, O, pt(O, alpha + moitie, 190), "segment", "geo-objet");
      dessinerTexte(s, pt(O, alpha + moitie + 4, 198), "z", "geo-nom-angle");
      arcAngle(s, O, alpha, alpha + moitie, 50, "", "geo-arc code1");
      arcAngle(s, O, alpha + moitie, alpha + total, 50, "", "geo-arc code1");
      if (cas === "moitie") {
        return {
          consigne: `[Oz) est la bissectrice de ${ang("x", "O", "y")}, et ${ang("x", "O", "y")} = ${total}°. Combien mesure ${ang("x", "O", "z")} ?`,
          figure: s,
          ligne: `${ang("x", "O", "z")} = [n] °`,
          verifier(v) {
            const r = verifierNombre(v[0], moitie);
            if (r.etat === "faux" && lireNombre(v[0]) === total * 2) r.message = "La bissectrice partage l'angle en deux : on divise par 2, on ne multiplie pas.";
            return r;
          },
          indice: "La bissectrice partage l'angle en deux angles de même mesure.",
          correction: `${ang("x", "O", "z")} = ${total}° ÷ 2 = ${moitie}°.`
        };
      }
      return {
        consigne: `[Oz) est la bissectrice de ${ang("x", "O", "y")}, et ${ang("x", "O", "z")} = ${moitie}°. Combien mesure ${ang("x", "O", "y")} ?`,
        figure: s,
        ligne: `${ang("x", "O", "y")} = [n] °`,
        verifier(v) {
          const r = verifierNombre(v[0], total);
          if (r.etat === "faux" && lireNombre(v[0]) === moitie / 2) r.message = `${ang("x", "O", "z")} n'est que la moitié de ${ang("x", "O", "y")} : il faut multiplier par 2.`;
          return r;
        },
        indice: `${ang("x", "O", "y")} est formé de deux angles de ${moitie}°.`,
        correction: `${ang("x", "O", "y")} = 2 × ${moitie}° = ${total}°.`
      };
    }
  },

  {
    groupe: A5,
    id: "placer-bissectrice",
    titre: "Placer la bissectrice",
    description: "Faire tourner une demi-droite pour partager l'angle en deux.",
    generer() {
      const total = alea(3, 17) * 10; // la moitié tombe sur une graduation de 5°
      const s = figure(560, 330);
      s.classList.add("geo-manipuler");
      const alpha = 0;
      const O = { x: 280, y: 265 };
      const rap = creerRapporteur();
      rap.placer(O.x, O.y, 0);
      rap.poignee.remove();
      s.append(rap);
      dessinerAngle(s, O, alpha, total, { l1: 220, l2: 220, arc: false });
      const rayon = demiDroiteMobile(s, O, alpha + (total > 60 ? 10 : total + 20), 200, "z");
      return {
        consigne: `${ang("x", "O", "y")} = ${total}°. Fais tourner [Oz) pour qu'elle soit la bissectrice de ${ang("x", "O", "y")}.`,
        figure: s,
        apresLigne: boutonsRotation(rayon),
        verifier() {
          if (!rayon.touche) return { etat: "incomplet", message: "Fais tourner la demi-droite [Oz) en tirant le point rond, ou avec les boutons." };
          const m = normaliser(rayon.phi - alpha);
          if (Math.abs(m - total / 2) <= 2) return { etat: "juste" };
          return { etat: "faux", message: `Pour l'instant, ${ang("x", "O", "z")} = ${m}° et ${ang("z", "O", "y")} = ${total - m}° : ils ne sont pas égaux.` };
        },
        indice: `Calcule d'abord la moitié de ${total}°, puis lis-la sur la graduation rouge.`,
        correction: `${total}° ÷ 2 = ${total / 2}° : la bissectrice fait un angle de ${total / 2}° avec [Ox). Elle est tracée en vert.`,
        surCorrection() { dessinerTrait(s, O, pt(O, alpha + total / 2, 200), "segment", "geo-axe-correct"); },
        bloquer() { rayon.actif = false; }
      };
    }
  },

  /* ================= Calculer avec les angles ================= */

  {
    groupe: A6,
    id: "angle-plat",
    titre: "Avec un angle plat",
    description: "x, O et z alignés : les deux angles font 180° ensemble.",
    generer() {
      const a = alea(20, 160);
      const s = figure(560, 300);
      const O = { x: 280, y: 230 }, base = alea(-10, 10);
      dessinerTrait(s, pt(O, base + 180, 230), pt(O, base, 230), "segment", "geo-objet");
      dessinerTrait(s, O, pt(O, base + a, 190), "segment", "geo-objet");
      dessinerPoint(s, O, "O", { vers: { x: 0, y: 1 } });
      dessinerTexte(s, pt(O, base + 3, 235), "x", "geo-nom-angle");
      dessinerTexte(s, pt(O, base + 177, 235), "z", "geo-nom-angle");
      dessinerTexte(s, pt(O, base + a + 5, 200), "y", "geo-nom-angle");
      arcAngle(s, O, base, base + a, 45, `${a}°`);
      arcAngle(s, O, base + a, base + 180, 60, "?");
      return {
        consigne: `Les points x, O et z sont alignés et ${ang("x", "O", "y")} = ${a}°. Calcule ${ang("y", "O", "z")}.`,
        figure: s,
        ligne: `${ang("y", "O", "z")} = [n] °`,
        verifier: v => verifierNombre(v[0], 180 - a),
        indice: `x, O et z sont alignés : ${ang("x", "O", "z")} est un angle plat, il mesure 180°.`,
        correction: `${ang("x", "O", "z")} est plat (180°), donc ${ang("y", "O", "z")} = 180° − ${a}° = ${180 - a}°.`
      };
    }
  },

  {
    groupe: A6,
    id: "adjacents",
    titre: "Angles adjacents",
    description: "Même sommet, un côté commun : on additionne les mesures.",
    generer() {
      const a = alea(4, 14) * 5 + alea(0, 4), b = alea(4, 14) * 5 + alea(0, 4);
      const s = figure();
      const O = { x: 170, y: 290 }, base = alea(-5, 10);
      for (const [phi, n] of [[base, "x"], [base + a, "y"], [base + a + b, "z"]]) {
        dessinerTrait(s, O, pt(O, phi, 230), "segment", "geo-objet");
        dessinerTexte(s, pt(O, phi + 3, 240), n, "geo-nom-angle");
      }
      dessinerPoint(s, O, "O", { vers: V.fois(dir(base + (a + b) / 2), -1) });
      const total = Math.random() < 0.6;
      arcAngle(s, O, base, base + a, 60, `${a}°`);
      arcAngle(s, O, base + a, base + a + b, 90, total ? `${b}°` : "?");
      if (total) arcAngle(s, O, base, base + a + b, 130, "?", "geo-arc pointille");
      else arcAngle(s, O, base, base + a + b, 130, `${a + b}°`, "geo-arc pointille");
      return {
        consigne: total
          ? `Les angles ${ang("x", "O", "y")} et ${ang("y", "O", "z")} sont adjacents. ${ang("x", "O", "y")} = ${a}° et ${ang("y", "O", "z")} = ${b}°. Calcule ${ang("x", "O", "z")}.`
          : `Les angles ${ang("x", "O", "y")} et ${ang("y", "O", "z")} sont adjacents. ${ang("x", "O", "z")} = ${a + b}° et ${ang("x", "O", "y")} = ${a}°. Calcule ${ang("y", "O", "z")}.`,
        figure: s,
        ligne: `${total ? ang("x", "O", "z") : ang("y", "O", "z")} = [n] °`,
        verifier: v => verifierNombre(v[0], total ? a + b : b),
        indice: `Les deux angles adjacents forment ensemble ${ang("x", "O", "z")} : ${ang("x", "O", "z")} = ${ang("x", "O", "y")} + ${ang("y", "O", "z")}.`,
        correction: total ? `${ang("x", "O", "z")} = ${a}° + ${b}° = ${a + b}°.` : `${ang("y", "O", "z")} = ${a + b}° − ${a}° = ${b}°.`
      };
    }
  },

  {
    groupe: A6,
    id: "opposes-sommet",
    titre: "Angles opposés par le sommet",
    description: "Deux droites sécantes : les angles opposés ont la même mesure.",
    generer() {
      const a = alea(25, 155);
      const s = figure(560, 360);
      const O = { x: 280, y: 180 }, base = alea(-15, 15);
      dessinerTrait(s, pt(O, base + 180, 220), pt(O, base, 220), "segment", "geo-objet");
      dessinerTrait(s, pt(O, base + a + 180, 170), pt(O, base + a, 170), "segment", "geo-objet");
      dessinerPoint(s, O, "O", { vers: dir(base - 90) });
      for (const [phi, n, r] of [[base, "a", 228], [base + 180, "a′", 228], [base + a, "b", 180], [base + a + 180, "b′", 180]]) dessinerTexte(s, pt(O, phi + 4, r), n, "geo-nom-angle");
      arcAngle(s, O, base, base + a, 40, `${a}°`);
      arcAngle(s, O, base + 180, base + a + 180, 40, "?");
      arcAngle(s, O, base + a, base + 180, 55, "?", "geo-arc pointille");
      return {
        consigne: `Les droites (aa′) et (bb′) sont sécantes en O, et ${ang("a", "O", "b")} = ${a}°. Calcule les deux angles marqués « ? ».`,
        figure: s,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p class="rep">${ang("a′", "O", "b′")} = [n] °</p></div><div class="etape-pb"><p class="rep">${ang("b", "O", "a′")} = [n] °</p></div>`,
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux angles." };
          const fautes = [];
          if (x[0] !== a) fautes.push(`${ang("a′", "O", "b′")} est opposé par le sommet à ${ang("a", "O", "b")}`);
          if (x[1] !== 180 - a) fautes.push(`${ang("b", "O", "a′")} forme un angle plat avec ${ang("a", "O", "b")}`);
          return fautes.length ? { etat: "faux", message: "Indice : " + fautes.join(" ; ") + "." } : { etat: "juste" };
        },
        indice: "Deux angles opposés par le sommet ont la même mesure. Et a, O, a′ sont alignés : cela forme un angle plat.",
        correction: `${ang("a′", "O", "b′")} et ${ang("a", "O", "b")} sont opposés par le sommet, donc ${ang("a′", "O", "b′")} = ${a}°.<br>a, O et a′ sont alignés, donc ${ang("b", "O", "a′")} = 180° − ${a}° = ${180 - a}°.`
      };
    }
  },

  /* ================= Diagrammes circulaires ================= */

  {
    groupe: A7,
    id: "lire-diagramme",
    titre: "Lire un diagramme circulaire",
    description: "Relier la mesure d'un secteur à une part du total.",
    generer() {
      const jeux = choisir([
        { titre: "Sport préféré des élèves", noms: ["Foot", "Danse", "Judo", "Natation"] },
        { titre: "Moyen de transport pour venir au collège", noms: ["Bus", "Vélo", "À pied", "Voiture"] },
        { titre: "Fruit préféré", noms: ["Pomme", "Banane", "Fraise", "Kiwi"] }
      ]);
      const decoupes = choisir([[180, 90, 60, 30], [120, 120, 90, 30], [90, 90, 120, 60], [180, 60, 60, 60], [150, 90, 90, 30], [240, 60, 30, 30]]);
      const angles = melanger([...decoupes]);
      const parts = jeux.noms.map((nom, i) => ({ nom, angle: angles[i] }));
      const total = choisir([24, 36, 60, 120, 360 / 30 * 10]);
      const i = alea(0, 3), p = parts[i];
      const frac = { 180: "la moitié", 90: "le quart", 120: "le tiers", 60: "le sixième", 30: "le douzième", 240: "les deux tiers", 150: "les cinq douzièmes" }[p.angle];
      const cas = choisir(["effectif", "effectif", "partie"]);
      const s = diagramme(parts);
      const legende = el("p", { class: "diag-titre" }, jeux.titre);
      if (cas === "partie" && ["la moitié", "le quart", "le tiers"].includes(frac)) {
        const options = ["la moitié", "le quart", "le tiers", "le sixième"];
        return {
          consigne: `Le secteur « ${p.nom} » a un angle de ${p.angle}°. Quelle part du disque représente-t-il ?`,
          figure: [s, legende],
          choix: options,
          verifier: (v, c) => ({ etat: c === frac ? "juste" : "faux" }),
          indice: "Le disque entier fait 360°. La moitié : 180° ; le quart : 90° ; le tiers : 120°.",
          correction: `360° ÷ ${360 / p.angle} = ${p.angle}° : c'est ${frac} du disque.`
        };
      }
      const eff = total * p.angle / 360;
      return {
        consigne: `On a interrogé ${total} personnes. Le secteur « ${p.nom} » mesure ${p.angle}°. Combien de personnes ont répondu « ${p.nom} » ?`,
        figure: [s, legende],
        ligne: "[n] personnes",
        verifier(v) {
          const r = verifierNombre(v[0], eff);
          if (r.etat === "faux" && lireNombre(v[0]) === p.angle) r.message = "Tu as donné la mesure de l'angle, pas le nombre de personnes.";
          return r;
        },
        indice: `Le disque entier (360°) représente les ${total} personnes. Quelle part du disque fait ${p.angle}° ?`,
        correction: `${p.angle}° = ${360 / p.angle === Math.round(360 / p.angle) ? `360° ÷ ${360 / p.angle}` : `${p.angle / 30} × 30°`}, donc le secteur représente ${frac} des ${total} personnes : ${nbr(eff)} personnes.`
      };
    }
  },

  {
    groupe: A7,
    id: "angle-secteur",
    titre: "Calculer l'angle d'un secteur",
    description: "Proportionnalité : 360° pour le total, … pour une catégorie.",
    generer() {
      const total = choisir([12, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90]);
      const unite = 360 / total;
      const k = alea(1, total - 1);
      const [texte, nom] = choisir([
        [`Dans un collège, on a interrogé ${total} élèves : ${k} viennent à vélo.`, "Vélo"],
        [`Dans une classe de ${total} élèves, ${k} ont un chat.`, "Chat"],
        [`Sur ${total} spectateurs, ${k} ont préféré le film d'animation.`, "Animation"]
      ]);
      return {
        consigne: `${texte} On veut représenter ces résultats par un diagramme circulaire. Quel est l'angle du secteur « ${nom} » ?`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>Angle pour 1 personne : 360° ÷ ${total} =</p><p class="rep">[n] °</p></div><div class="etape-pb"><p>Angle du secteur « ${nom} » :</p><p class="rep">[n] °</p></div>`,
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux cases." };
          if (x[0] !== unite) return { etat: "faux", message: `Le disque entier fait 360° pour ${total} personnes : 1 personne correspond à 360° ÷ ${total}.` };
          return verifierNombre(v[1], k * unite);
        },
        indice: "Le nombre de personnes et l'angle sont proportionnels : 360° correspondent à toutes les personnes.",
        correction: `360° ÷ ${total} = ${unite}° pour 1 personne, donc ${k} × ${unite}° = ${k * unite}° pour le secteur « ${nom} ».`
      };
    }
  },

  {
    groupe: A7,
    id: "quel-diagramme",
    titre: "Quel diagramme ?",
    description: "Choisir le diagramme qui correspond à un tableau.",
    generer() {
      const total = choisir([12, 24, 36]);
      const u = 360 / total;
      let e;
      do { e = [alea(1, total / 2), alea(1, total / 3), alea(1, total / 3)]; } while (e[0] + e[1] + e[2] >= total || new Set(e).size < 3);
      e.push(total - e[0] - e[1] - e[2]);
      const noms = ["A", "B", "C", "D"];
      const bon = e.map((x, i) => ({ nom: noms[i], angle: x * u }));
      const faux1 = e.map((x, i) => ({ nom: noms[i], angle: e[[1, 0, 3, 2][i]] * u }));
      const faux2 = e.map((x, i) => ({ nom: noms[i], angle: e[[2, 3, 0, 1][i]] * u }));
      const options = melanger([bon, faux1, faux2].map((p, i) => ({ p, i })));
      const tab = `<table class="tab-effectifs"><tr><th>Réponse</th>${noms.map(n => `<th>${n}</th>`).join("")}<th>Total</th></tr><tr><th>Effectif</th>${e.map(x => `<td>${x}</td>`).join("")}<td>${total}</td></tr></table>`;
      const cadre = el("div");
      cadre.innerHTML = tab;
      return {
        consigne: "Quel diagramme circulaire représente ce tableau ? Clique dessus.",
        figure: cadre,
        choix: options.map(o => diagramme(o.p, { taille: 150, r: 64 })),
        verifier: (v, c) => ({ etat: options[c].i === 0 ? "juste" : "faux" }),
        indice: `Le plus grand effectif doit avoir le plus grand secteur. Chaque personne correspond à 360° ÷ ${total} = ${u}°.`,
        correction: `Chaque personne correspond à ${u}° : A → ${e[0] * u}°, B → ${e[1] * u}°, C → ${e[2] * u}°, D → ${e[3] * u}°.`
      };
    }
  },

  /* ================= Pour le plaisir ================= */

  {
    groupe: A8,
    id: "horloge",
    titre: "L'angle des aiguilles",
    description: "Quel angle forment les aiguilles d'une horloge ?",
    generer() {
      const h = alea(1, 11), demi = Math.random() < 0.3;
      const m = demi ? 30 : 0;
      const brut = Math.abs((30 * h + m / 2) - 6 * m);
      const angle = Math.min(brut, 360 - brut);
      return {
        consigne: `Il est ${h} h${demi ? " 30" : ""}. Quel est le plus petit angle formé par les deux aiguilles ?`,
        figure: horloge(h, m),
        ligne: "[d] °",
        verifier: v => verifierNombre(v[0], angle),
        indice: demi
          ? "Entre deux nombres de l'horloge, il y a 30°. Attention : à la demie, la petite aiguille est au milieu entre deux nombres !"
          : "Le tour complet fait 360° et il y a 12 nombres : entre deux nombres qui se suivent, il y a 360° ÷ 12 = 30°.",
        correction: demi
          ? `Entre deux nombres, il y a 30°. La grande aiguille est sur le 6 ; la petite est à mi-chemin entre le ${h} et le ${h + 1}. L'angle mesure ${angle}°.`
          : `Entre deux nombres, il y a 30°. Les aiguilles sont séparées de ${Math.min(h, 12 - h)} intervalles : ${Math.min(h, 12 - h)} × 30° = ${angle}°.`
      };
    }
  }

];

function nbr(x) { return ecrireNombre(x); } // nombre écrit à la française
