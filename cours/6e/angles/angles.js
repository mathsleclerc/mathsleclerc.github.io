/* Cours interactif — Les angles (6e) : figures et activités */
(function () {
  const { S, T, nb } = Diapo;
  const $ = s => document.querySelector(s);
  const C = { bleu: "#1f5fa8", vert: "#2e8b57", orange: "#d9822b", violet: "#6b5bb5", rouge: "#c4302b", jaune: "#d9a400", gris: "#8796aa", texte: "#1c2430", fonce: "#174a84" };

  /* ---------- géométrie (angles en degrés, sens direct, y vers le bas à l'écran) ---------- */
  const rad = a => a * Math.PI / 180;
  const P = (O, a, r) => [O[0] + r * Math.cos(rad(a)), O[1] - r * Math.sin(rad(a))];
  const f = x => x.toFixed(1);
  const alea = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const choisir = t => t[Math.floor(Math.random() * t.length)];
  function arcD(O, a1, a2, r) { const p = P(O, a1, r), q = P(O, a2, r); return `M${f(p[0])},${f(p[1])} A${r},${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${f(q[0])},${f(q[1])}`; }
  function secteur(g, O, a1, a2, r, coul, attrs = {}, opac = .25) {
    const grp = S("g", attrs, g), p = P(O, a1, r), q = P(O, a2, r);
    S("path", { d: `M${f(O[0])},${f(O[1])} L${f(p[0])},${f(p[1])} A${r},${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${f(q[0])},${f(q[1])} Z`, fill: coul, opacity: opac }, grp);
    S("path", { d: arcD(O, a1, a2, r), fill: "none", stroke: coul, "stroke-width": 3 }, grp);
    return grp;
  }
  function demi(g, O, a, L, attrs = {}) { const q = P(O, a, L); return S("line", { x1: f(O[0]), y1: f(O[1]), x2: f(q[0]), y2: f(q[1]), class: "ln", ...attrs }, g); }
  function croix(g, X, attrs = {}) { const s = 6; const grp = S("g", attrs, g); S("path", { d: `M${X[0] - s},${X[1] - s} L${X[0] + s},${X[1] + s} M${X[0] + s},${X[1] - s} L${X[0] - s},${X[1] + s}`, stroke: C.texte, "stroke-width": 2.5 }, grp); return grp; }
  function droit(g, O, a, s = 18, attrs = {}) {
    const p = P(O, a, s), q = P(O, a + 90, s), m = [p[0] + q[0] - O[0], p[1] + q[1] - O[1]];
    return S("path", { d: `M${f(p[0])},${f(p[1])} L${f(m[0])},${f(m[1])} L${f(q[0])},${f(q[1])}`, fill: "none", stroke: C.texte, "stroke-width": 2, ...attrs }, g);
  }
  function lettre(g, O, a, r, txt, attrs = {}) { const p = P(O, a, r); return T(g, p[0], p[1], txt, { class: "lab gras", style: "font-style:italic;font-size:22px", ...attrs }); }
  function svgPt(svg, ev) { const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
  function glisser(svg, surPoint) {
    let drag = false;
    svg.addEventListener("pointerdown", e => { drag = true; svg.setPointerCapture(e.pointerId); surPoint(svgPt(svg, e)); });
    svg.addEventListener("pointermove", e => { if (drag) surPoint(svgPt(svg, e)); });
    svg.addEventListener("pointerup", () => drag = false);
  }

  /* ---------- rapporteur : demi-disque au-dessus de la base, centre O ----------
     graduation extérieure : 0 à droite ; graduation intérieure : 0 à gauche */
  function rapporteur(g, O, R, attrs = {}) {
    const grp = S("g", attrs, g), petit = R < 200;
    S("path", { d: `M${O[0] + R},${O[1]} A${R},${R} 0 0 0 ${O[0] - R},${O[1]} Z`, fill: "rgba(31,95,168,.07)", stroke: C.bleu, "stroke-width": 2 }, grp);
    S("path", { d: arcD(O, 0, 180, R * 0.55), fill: "none", stroke: "rgba(31,95,168,.35)", "stroke-width": 1.5 }, grp);
    for (let d = 0; d <= 180; d += petit ? 5 : 1) {
      const l = d % 10 === 0 ? R * 0.075 : d % 5 === 0 ? R * 0.05 : R * 0.025;
      const p = P(O, d, R), q = P(O, d, R - l);
      S("line", { x1: f(p[0]), y1: f(p[1]), x2: f(q[0]), y2: f(q[1]), stroke: C.bleu, "stroke-width": d % 10 ? 1 : 1.6 }, grp);
      if (d % 10 === 0) {
        const fs = petit ? 10 : 13, a = P(O, d, R * 0.84), b = P(O, d, R * 0.7);
        T(grp, a[0], a[1] - (d === 0 || d === 180 ? 8 : 0), String(d), { style: `font-size:${fs}px;font-weight:700`, fill: C.fonce });
        T(grp, b[0], b[1] - (d === 0 || d === 180 ? 8 : 0), String(180 - d), { style: `font-size:${fs}px;font-weight:700`, fill: C.rouge });
      }
    }
    S("line", { x1: O[0] - R, y1: O[1], x2: O[0] + R, y2: O[1], stroke: C.bleu, "stroke-width": 2 }, grp);
    S("path", { d: `M${O[0] - 8},${O[1]} L${O[0] + 8},${O[1]} M${O[0]},${O[1] - 8} L${O[0]},${O[1]}`, stroke: C.bleu, "stroke-width": 2 }, grp);
    return grp;
  }


  /* ---------- rapporteur que l'on déplace (glisser) et que l'on tourne (poignée orange) ----------
     depart = [x, y, angle] ; cible = [x, y, angle ou liste d'angles] (ou une liste de cibles) : il s'y cale quand on s'en approche,
     et son contour devient vert quand il est bien placé */
  const ecartAngle = (a, b) => ((a - b) % 360 + 540) % 360 - 180;
  function rapporteurMobile(svg, R, depart, cible, attrs = {}) {
    const grp = S("g", attrs, svg);
    const corps = rapporteur(grp, [0, 0], R);
    corps.style.cursor = "grab";
    const bord = corps.querySelector("path");
    const h = P([0, 0], 90, R + 30), poignee = S("g", { style: "cursor:grab" }, grp);
    S("line", { x1: 0, y1: -R, x2: 0, y2: h[1] + 18, stroke: C.orange, "stroke-width": 3 }, poignee);
    S("circle", { cx: h[0], cy: h[1], r: 26, fill: "transparent" }, poignee); // zone de prise large (doigt)
    S("circle", { cx: h[0], cy: h[1], r: 18, fill: C.orange, stroke: "#fff", "stroke-width": 3 }, poignee);
    T(poignee, h[0], h[1] + 1, "↻", { fill: "#fff", style: "font-size:22px;font-weight:700" });
    let [x, y, th] = depart;
    const cibles = Array.isArray(cible[0]) ? cible : [cible];
    const angles = c => [].concat(c[2]);
    const calque = S("g", {}, grp); // repères dessinés sur le rapporteur (ils bougent avec lui)
    const place = () => cibles.some(c => Math.hypot(x - c[0], y - c[1]) < 0.5 && angles(c).some(a => Math.abs(ecartAngle(th, a)) < 0.5));
    function poser(anim) {
      grp.style.transition = anim ? "transform .9s ease" : "none";
      grp.style.transform = `translate(${x}px,${y}px) rotate(${-th}deg)`;
      const ok = place();
      bord.setAttribute("stroke", ok ? C.vert : C.bleu); bord.setAttribute("stroke-width", ok ? 4 : 2);
      bord.setAttribute("fill", ok ? "rgba(46,139,87,.08)" : "rgba(31,95,168,.07)");
    }
    let mode = null, dx = 0, dy = 0;
    grp.addEventListener("pointerdown", e => {
      e.stopPropagation(); e.preventDefault();
      const q = svgPt(svg, e);
      mode = poignee.contains(e.target) ? "tourne" : "glisse";
      dx = q.x - x; dy = q.y - y;
      grp.setPointerCapture(e.pointerId);
    });
    grp.addEventListener("pointermove", e => {
      if (!mode) return;
      const q = svgPt(svg, e);
      if (mode === "glisse") {
        x = q.x - dx; y = q.y - dy;
        for (const c of cibles) if (Math.hypot(x - c[0], y - c[1]) < 16) {
          x = c[0]; y = c[1];
          for (const a of angles(c)) if (Math.abs(ecartAngle(th, a)) < 4) th = a;
        }
      } else {
        th = Math.atan2(y - q.y, q.x - x) * 180 / Math.PI - 90;
        for (const c of cibles) if (Math.hypot(x - c[0], y - c[1]) < 0.5) for (const a of angles(c)) if (Math.abs(ecartAngle(th, a)) < 4) th = a;
      }
      poser(false);
    });
    const fin = () => { mode = null; };
    grp.addEventListener("pointerup", fin); grp.addEventListener("pointercancel", fin);
    poser(false);
    return {
      calque, el: grp, place,
      aller(cx, cy, cth) { x = cx; y = cy; th = cth; poser(true); },
      depart() { [x, y, th] = depart; poser(true); }
    };
  }

  /* ================= 1. titre ================= */
  (function () {
    const svg = $("#fig-titre");
    const O1 = [20, 130], O2 = [190, 410];
    secteur(svg, O1, 0, 25, 70, "#ffb066", {}, .35);
    demi(svg, O1, 0, 490, { style: "stroke:#ffb066;stroke-width:5" }); demi(svg, O1, 25, 490, { style: "stroke:#ffb066;stroke-width:5" });
    secteur(svg, O2, 0, 65, 50, "#9cc8ff", {}, .35);
    demi(svg, O2, 0, 120, { style: "stroke:#9cc8ff;stroke-width:5" }); demi(svg, O2, 65, 120, { style: "stroke:#9cc8ff;stroke-width:5" });
  })();

  /* ================= 2. définition ================= */
  (function () {
    const svg = $("#fig-def"), O = [130, 440];
    secteur(svg, O, 12, 58, 70, C.orange);
    demi(svg, O, 12, 450); demi(svg, O, 58, 430);
    lettre(svg, O, 12, 475, "x"); lettre(svg, O, 58, 455, "y");
    T(svg, O[0] - 6, O[1] + 26, "O", { class: "lab gras", style: "font-size:22px" });
    S("circle", { cx: O[0], cy: O[1], r: 5, fill: C.texte }, svg);
    const g1 = S("g", { "data-step": 1 }, svg);
    S("circle", { cx: O[0], cy: O[1], r: 13, fill: "none", stroke: C.rouge, "stroke-width": 3 }, g1);
    T(g1, O[0] + 10, O[1] + 70, "sommet", { class: "lab gras", fill: C.rouge });
    const g2 = S("g", { "data-step": 2 }, svg);
    demi(g2, O, 12, 450, { style: `stroke:${C.bleu};stroke-width:5;opacity:.6` }); demi(g2, O, 58, 430, { style: `stroke:${C.bleu};stroke-width:5;opacity:.6` });
    let p = P(O, 12, 330); T(g2, p[0], p[1] + 30, "côté [Ox)", { class: "lab gras", fill: C.bleu });
    p = P(O, 58, 300); T(g2, p[0] - 70, p[1], "côté [Oy)", { class: "lab gras", fill: C.bleu });
    const g3 = S("g", { "data-step": 3 }, svg);
    const A = P(O, 12, 300), B = P(O, 58, 250);
    croix(g3, A); croix(g3, B);
    T(g3, A[0] + 4, A[1] - 22, "A", { class: "lab gras", style: "font-size:22px" });
    T(g3, B[0] + 24, B[1] - 4, "B", { class: "lab gras", style: "font-size:22px" });
  })();

  /* ================= 3. nommer ================= */
  (function () {
    const svg = $("#fig-nom"), F = [340, 440];
    const aG = 113, aE = 189;
    secteur(svg, F, aG, aE, 60, C.orange, {}, .35);
    demi(svg, F, aG, 380); demi(svg, F, aE, 320);
    const G = P(F, aG, 300), E = P(F, aE, 250);
    for (const [X, n, d] of [[G, "G", [22, -6]], [E, "E", [-4, -24]], [F, "F", [16, 22]]]) {
      S("circle", { cx: X[0], cy: X[1], r: 5, fill: C.texte }, svg);
      T(svg, X[0] + d[0], X[1] + d[1], n, { class: "lab gras", style: "font-size:24px" });
    }
    const g = S("g", { "data-step": 2 }, svg);
    S("circle", { cx: F[0], cy: F[1], r: 14, fill: "none", stroke: C.rouge, "stroke-width": 3 }, g);
  })();

  /* ================= 4. taille ================= */
  (function () {
    const svg = $("#fig-taille"), sl = $("#taille-l");
    function render() {
      svg.innerHTML = "";
      const L = +sl.value, O1 = [30, 160], O2 = [200, 430];
      secteur(svg, O1, 0, 25, 70, C.orange, {}, .3);
      demi(svg, O1, 0, 560, { style: `stroke:${C.orange};stroke-width:4` }); demi(svg, O1, 25, 560, { style: `stroke:${C.orange};stroke-width:4` });
      secteur(svg, O2, 0, 65, Math.min(55, L * 0.6), C.fonce, {}, .3);
      demi(svg, O2, 0, L, { style: `stroke:${C.fonce};stroke-width:4` }); demi(svg, O2, 65, L, { style: `stroke:${C.fonce};stroke-width:4` });
      const g = S("g", { "data-step": 1 }, svg);
      T(g, O1[0] + 120, O1[1] - 22, "25°", { class: "lab gras", fill: C.orange });
      T(g, O2[0] + 70, O2[1] - 60, "65°", { class: "lab gras", fill: C.fonce });
    }
    sl.addEventListener("input", () => { render(); rafraichir("s-taille"); });
    render();
  })();
  /* réapplique l'étape courante quand une figure est redessinée */
  function rafraichir(id) { const sl = document.getElementById(id); if (sl.classList.contains("active")) sl.querySelectorAll("svg [data-step]").forEach(e => e.classList.toggle("on", Diapo.etape() >= +e.dataset.step)); }

  /* ================= 5. types d'angles ================= */
  (function () {
    const svg = $("#fig-types"), sl = $("#types-a"), O = [310, 330];
    let a = 40;
    function type(a) { return a < 90 ? "aigu" : a === 90 ? "droit" : a < 180 ? "obtus" : "plat"; }
    function render() {
      svg.innerHTML = "";
      if (a === 90) droit(svg, O, 0, 26); else secteur(svg, O, 0, a, 55, C.bleu);
      demi(svg, O, 0, 280); demi(svg, O, a, 270, { style: `stroke:${C.bleu};stroke-width:3.5` });
      const h = P(O, a, 270); S("circle", { cx: h[0], cy: h[1], r: 13, fill: C.bleu, style: "cursor:grab" }, svg);
      S("circle", { cx: O[0], cy: O[1], r: 5, fill: C.texte }, svg);
      T(svg, O[0] + 2, O[1] + 26, "O", { class: "lab gras", style: "font-size:22px;font-style:italic" });
      lettre(svg, O, 0, 296, "x"); const q = P(O, a, 300); T(svg, q[0], q[1], "y", { class: "lab gras", style: "font-size:22px;font-style:italic" });
      if (a !== 90) { const m = P(O, a / 2, 85); T(svg, m[0], m[1], a + "°", { class: "lab gras", fill: C.bleu, style: "font-size:22px" }); }
      const t = type(a);
      document.querySelectorAll("#types > div").forEach(d => d.classList.toggle("actif", d.dataset.t === t));
      $("#types-lec").innerHTML = `<span class="ang">xOy</span> = ${a}° : angle <span class="c-bleu">${t}</span>`;
      sl.value = a;
    }
    sl.addEventListener("input", () => { a = +sl.value; render(); });
    glisser(svg, q => { let d = Math.atan2(O[1] - q.y, q.x - O[0]) * 180 / Math.PI; if (d < -90) d = 180; a = Math.max(1, Math.min(180, Math.round(d))); render(); });
    render();
  })();

  /* ================= 6. mesurer ================= */
  (function () {
    const svg = $("#fig-mesurer"), O = [300, 455], R = 240, aA = 20, aB = 150; // AOB = 130°
    demi(svg, O, aA, 300); demi(svg, O, aB, 290);
    secteur(svg, O, aA, aB, 42, C.orange, {}, .3);
    const A = P(O, aA, 300), B = P(O, aB, 290);
    T(svg, A[0] - 2, A[1] + 24, "A", { class: "lab gras", style: "font-size:22px" });
    T(svg, B[0] - 4, B[1] - 22, "B", { class: "lab gras", style: "font-size:22px" });
    T(svg, O[0] + 4, O[1] + 26, "O", { class: "lab gras", style: "font-size:22px" });
    S("circle", { cx: O[0], cy: O[1], r: 4.5, fill: C.texte }, svg);
    const rap = rapporteurMobile(svg, R, [310, 575, 0], [O[0], O[1], aA]);
    const L = rap.calque;
    // repères sur le rapporteur, dans ses propres coordonnées
    const g1 = S("g", { "data-step": 1, "data-until": 2 }, L);
    S("circle", { cx: 0, cy: 0, r: 16, fill: "none", stroke: C.rouge, "stroke-width": 4 }, g1);
    const g2 = S("g", { "data-step": 2 }, L), z = P([0, 0], 0, R * 0.84);
    S("circle", { cx: z[0], cy: z[1] - 8, r: 16, fill: "none", stroke: C.rouge, "stroke-width": 3 }, g2);
    const g3 = S("g", { "data-step": 3 }, L);
    S("path", { d: arcD([0, 0], 2, 128, R * 0.84 + 18), fill: "none", stroke: C.vert, "stroke-width": 4 }, g3);
    const t = P([0, 0], 130, R * 0.84);
    S("circle", { cx: t[0], cy: t[1], r: 18, fill: "none", stroke: C.vert, "stroke-width": 4 }, g3);
    const g4 = S("g", { "data-step": 4 }, L), u = P([0, 0], 130, R * 0.7);
    S("line", { x1: u[0] - 14, y1: u[1] + 10, x2: u[0] + 14, y2: u[1] - 10, stroke: C.rouge, "stroke-width": 4 }, g4);
    const n2 = S("g", { "data-step": 2, "data-until": 3 }, svg);
    T(n2, 470, 30, "Le 0 du rapporteur est sur le côté [OA).", { class: "lab gras", fill: C.rouge, style: "font-size:17px" });
    const n4 = S("g", { "data-step": 3 }, svg);
    T(n4, 310, 30, "On lit 130° sur la graduation qui part du 0 de [OA), et non 50°.", { class: "lab gras", fill: C.vert, style: "font-size:17px" });
    let avant = -1;
    Diapo.surEtape("s-mesurer", k => {
      const p = k === 0 ? 0 : k === 1 ? 1 : 2;
      if (p === avant) return; avant = p;
      if (p === 0) rap.depart(); else if (p === 1) rap.aller(O[0], O[1], 0); else rap.aller(O[0], O[1], aA);
    });
  })();

  /* ================= 7. jeu : lire une mesure (rapporteur à placer soi-même) ================= */
  (function () {
    const svg = $("#fig-lire"), O = [310, 390], R = 220;
    const rep = $("#lire-rep"), ret = $("#lire-retour");
    let m = 50, rap = null, essais = 0, reussis = 0;
    function nouveau() {
      do { m = 10 + 5 * Math.floor(Math.random() * 33); } while (m === 90);
      const th0 = alea(-25, 25), surDroite = Math.random() < .5;
      const dA = surDroite ? th0 : th0 + 180, dB = surDroite ? th0 + m : th0 + 180 - m;
      const autre = surDroite ? th0 + m - 180 : th0 + 180 - m; // base le long de [OB)
      svg.innerHTML = "";
      demi(svg, O, dA, 255, { style: "stroke-width:3" }); demi(svg, O, dB, 250, { style: "stroke-width:3" });
      const [a1, a2] = surDroite ? [dA, dB] : [dB, dA];
      secteur(svg, O, a1, a2, 40, C.orange, {}, .35);
      const A = P(O, dA, 275), B = P(O, dB, 272);
      T(svg, A[0], A[1], "A", { class: "lab gras", style: "font-size:22px" });
      T(svg, B[0], B[1], "B", { class: "lab gras", style: "font-size:22px" });
      const o = P(O, (a1 + a2) / 2 + 180, 26); T(svg, o[0], o[1], "O", { class: "lab gras", style: "font-size:22px" });
      S("circle", { cx: O[0], cy: O[1], r: 4.5, fill: C.texte }, svg);
      rap = rapporteurMobile(svg, R, [310, 590, 0], [O[0], O[1], [th0, autre]]);
      rep.value = ""; ret.className = "retour";
      ret.textContent = "Place le rapporteur : son centre sur O et sa base le long d’un côté. Il devient vert quand il est bien placé.";
    }
    function verifier() {
      const v = parseInt(rep.value, 10); if (isNaN(v)) return;
      if (!rap.place()) { ret.className = "retour ko"; ret.innerHTML = "<b>Place d’abord ton rapporteur !</b> Son centre doit être sur le sommet O, et sa base le long d’un côté de l’angle (le contour devient vert)."; return; }
      essais++;
      if (v === m) { reussis++; ret.className = "retour ok"; ret.innerHTML = `<b>Bravo !</b> L’angle mesure ${m}°. Il est ${m < 90 ? "aigu : moins de 90°" : "obtus : plus de 90°"}, ça colle.`; }
      else if (v === 180 - m) { ret.className = "retour ko"; ret.innerHTML = `<b>Mauvaise graduation !</b> Tu as lu ${v}°. L’angle est ${m < 90 ? "aigu" : "obtus"}, il mesure donc ${m < 90 ? "moins" : "plus"} de 90°. Lis la graduation qui part du 0 posé sur un côté.`; }
      else { ret.className = "retour ko"; ret.innerHTML = `Pas tout à fait. Suis la graduation qui part du 0 posé sur un côté, jusqu’à l’autre côté.`; }
      $("#lire-score").textContent = `Bonnes réponses : ${reussis} sur ${essais}`;
    }
    $("#lire-ok").addEventListener("click", verifier);
    rep.addEventListener("keydown", e => { if (e.key === "Enter") verifier(); e.stopPropagation(); });
    $("#lire-new").addEventListener("click", nouveau);
    $("#lire-voir").addEventListener("click", () => {
      ret.className = "retour"; ret.innerHTML = `<span class="ang">AOB</span> = <b>${m}°</b> (et non ${180 - m}°) : l’angle est ${m < 90 ? "aigu" : "obtus"}.`;
    });
    nouveau();
  })();

  /* ================= 8. tracer ================= */
  (function () {
    const svg = $("#fig-tracer"), O = [310, 470], R = 260;
    const g1 = S("g", { "data-step": 1 }, svg);
    demi(g1, O, 0, 295, { class: "ln draw", pathLength: 1 });
    lettre(g1, O, 0, 300, "x", { y: O[1] + 26 });
    S("circle", { cx: O[0], cy: O[1], r: 5, fill: C.texte }, g1);
    T(g1, O[0], O[1] + 26, "O", { class: "lab gras", style: "font-size:22px;font-style:italic" });
    const g3 = S("g", { "data-step": 3 }, svg);
    const r1 = P(O, 37, R + 4), r2 = P(O, 37, R + 22);
    S("line", { x1: r1[0], y1: r1[1], x2: r2[0], y2: r2[1], stroke: C.rouge, "stroke-width": 5, "stroke-linecap": "round" }, g3);
    T(S("g", { "data-step": 3, "data-until": 4 }, svg), r2[0] + 50, r2[1] - 6, "repère", { class: "lab gras", fill: C.rouge });
    const g4 = S("g", { "data-step": 4 }, svg);
    demi(g4, O, 37, 330, { class: "ln draw", pathLength: 1, style: `stroke:${C.bleu};stroke-width:3.5` });
    lettre(g4, O, 37, 350, "y");
    secteur(g4, O, 0, 37, 70, C.bleu);
    const m = P(O, 18.5, 100); T(g4, m[0], m[1], "37°", { class: "lab gras", fill: C.bleu, style: "font-size:22px" });
    const rap = rapporteurMobile(svg, R, [300, 580, -12], [O[0], O[1], 0]);
    const lb = P([0, 0], 37, R * 0.84);
    S("circle", { cx: lb[0], cy: lb[1], r: 15, fill: "none", stroke: C.rouge, "stroke-width": 3, "data-step": 3 }, rap.calque);
    let avant = -1;
    Diapo.surEtape("s-tracer", k => {
      const p = k < 2 || k >= 4 ? 0 : 1;
      if (p === avant) return; avant = p;
      if (p === 0) rap.depart(); else rap.aller(O[0], O[1], 0);
    });
  })();

  /* ================= 9. adjacents ================= */
  (function () {
    const svg = $("#fig-adj"), O = [190, 420], Z = 95;
    let t = 35;
    function render() {
      svg.innerHTML = "";
      secteur(svg, O, 0, t, 80, C.vert);
      secteur(svg, O, t, Z, 110, C.orange);
      demi(svg, O, 0, 400); demi(svg, O, Z, 330); demi(svg, O, t, 360, { style: `stroke:${C.violet};stroke-width:4` });
      const h = P(O, t, 360); S("circle", { cx: h[0], cy: h[1], r: 13, fill: C.violet, style: "cursor:grab" }, svg);
      lettre(svg, O, 0, 420, "x"); lettre(svg, O, Z, 352, "z"); lettre(svg, O, t, 385, "y");
      S("circle", { cx: O[0], cy: O[1], r: 5, fill: C.texte }, svg);
      T(svg, O[0] - 4, O[1] + 26, "O", { class: "lab gras", style: "font-size:22px;font-style:italic" });
      let m = P(O, t / 2, 125); T(svg, m[0], m[1], t + "°", { class: "lab gras", fill: C.vert, style: "font-size:22px" });
      m = P(O, (t + Z) / 2, 150); T(svg, m[0], m[1], (Z - t) + "°", { class: "lab gras", fill: C.orange, style: "font-size:22px" });
      $("#adj-lec").innerHTML = `<span class="ang">xOz</span> = <span class="c-vert">${t}°</span> + <span class="c-orange">${Z - t}°</span> = ${Z}°`;
    }
    glisser(svg, q => { const d = Math.atan2(O[1] - q.y, q.x - O[0]) * 180 / Math.PI; t = Math.max(5, Math.min(Z - 5, Math.round(d))); render(); });
    render();
  })();

  /* ================= 10. calculer ================= */
  (function () {
    let svg = $("#fig-calc-a"), O = [280, 185];
    demi(svg, O, 0, 240); demi(svg, O, 180, 240); demi(svg, O, 125, 165);
    secteur(svg, O, 0, 125, 40, C.bleu);
    secteur(svg, O, 125, 180, 58, C.orange, { "data-step": 3 });
    lettre(svg, O, 0, 258, "x", { y: O[1] - 16 }); lettre(svg, O, 180, 258, "z", { y: O[1] - 16 }); lettre(svg, O, 125, 182, "y");
    T(svg, O[0] + 2, O[1] + 22, "O", { class: "lab gras", style: "font-size:20px;font-style:italic" });
    let m = P(O, 62, 70); T(svg, m[0], m[1], "125°", { class: "lab gras", fill: C.bleu });
    m = P(O, 152, 88); T(svg, m[0], m[1], "55°", { class: "lab gras", fill: C.orange, "data-step": 3 });
    svg = $("#fig-calc-b"); O = [180, 195];
    demi(svg, O, 0, 330); demi(svg, O, 90, 175); demi(svg, O, 34, 300);
    droit(svg, O, 0, 16);
    secteur(svg, O, 0, 34, 80, C.bleu);
    secteur(svg, O, 34, 90, 60, C.orange, { "data-step": 7 });
    lettre(svg, O, 0, 348, "x", { y: O[1] - 16 }); lettre(svg, O, 90, 190, "z", { x: O[0] + 18 }); lettre(svg, O, 34, 318, "y");
    T(svg, O[0] - 14, O[1] + 14, "O", { class: "lab gras", style: "font-size:20px;font-style:italic" });
    m = P(O, 17, 110); T(svg, m[0], m[1], "34°", { class: "lab gras", fill: C.bleu });
    m = P(O, 62, 88); T(svg, m[0], m[1], "56°", { class: "lab gras", fill: C.orange, "data-step": 7 });
  })();

  /* ================= 11. bissectrice ================= */
  (function () {
    const svg = $("#fig-bis"), sl = $("#bis-a"), O = [290, 410];
    function code(g, a, r) { const p = P(O, a, r - 9), q = P(O, a, r + 9); S("line", { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: C.orange, "stroke-width": 3 }, g); }
    function render() {
      svg.innerHTML = "";
      const a = +sl.value, h = a / 2;
      secteur(svg, O, 0, h, 90, C.orange, {}, .22); secteur(svg, O, h, a, 90, C.orange, {}, .22);
      code(svg, h / 2, 90); code(svg, h + h / 2, 90);
      demi(svg, O, 0, 290); demi(svg, O, a, 290);
      demi(svg, O, h, 300, { style: `stroke:${C.orange};stroke-width:3.5;stroke-dasharray:10 7` });
      lettre(svg, O, 0, 306, "x", { y: O[1] + 24 }); lettre(svg, O, a, 310, "y"); lettre(svg, O, h, 322, "z", { fill: C.orange });
      S("circle", { cx: O[0], cy: O[1], r: 5, fill: C.texte }, svg);
      T(svg, O[0], O[1] + 26, "O", { class: "lab gras", style: "font-size:22px;font-style:italic" });
      let m = P(O, h / 2, 128); T(svg, m[0], m[1], nb(h) + "°", { class: "lab gras", fill: C.orange });
      m = P(O, h + h / 2, 128); T(svg, m[0], m[1], nb(h) + "°", { class: "lab gras", fill: C.orange });
      $("#bis-lec").innerHTML = `<span class="ang">xOz</span> = <span class="ang">zOy</span> = ${a} ÷ 2 = <span class="c-orange">${nb(h)}°</span>`;
    }
    sl.addEventListener("input", render);
    render();
  })();

  /* ================= 12. main levée ================= */
  (function () {
    const svg = $("#fig-main");
    const A = [90, 265], B = [510, 265], Cc = [318, 72];
    const tr = (p, q, k) => { const mx = (p[0] + q[0]) / 2 + k, my = (p[1] + q[1]) / 2 - k; return `M${p[0]},${p[1]} Q${mx},${my} ${q[0]},${q[1]}`; };
    for (const [p, q, k] of [[A, B, 5], [B, Cc, -6], [Cc, A, 4]]) S("path", { d: tr(p, q, k), fill: "none", stroke: C.texte, "stroke-width": 2.6, "stroke-linecap": "round" }, svg);
    S("path", { d: arcD(A, 0, 43, 52), fill: "none", stroke: C.bleu, "stroke-width": 2.5 }, svg);
    S("path", { d: arcD(B, 137, 180, 52), fill: "none", stroke: C.vert, "stroke-width": 2.5 }, svg);
    T(svg, A[0] + 88, A[1] - 26, "50°", { class: "lab gras", fill: C.bleu });
    T(svg, B[0] - 88, B[1] - 24, "40°", { class: "lab gras", fill: C.vert });
    T(svg, (A[0] + B[0]) / 2, A[1] + 30, "5 cm", { class: "lab gras" });
    T(svg, A[0] - 20, A[1] + 6, "A", { class: "lab gras", style: "font-size:22px" });
    T(svg, B[0] + 20, B[1] + 6, "B", { class: "lab gras", style: "font-size:22px" });
    T(svg, Cc[0], Cc[1] - 22, "C", { class: "lab gras", style: "font-size:22px" });
    T(svg, 540, 30, "main levée", { class: "lab petit", style: "font-style:italic" });
  })();

  /* ================= 13. triangle en vraie grandeur ================= */
  (function () {
    const svg = $("#fig-tri"), u = 80; // 1 cm = 80 unités
    const A = [150, 480], B = [150 + 5 * u, 480];
    const AC = 5 * Math.sin(rad(40)) / Math.sin(rad(90)) * u, Cp = P(A, 50, AC);
    const g1 = S("g", { "data-step": 1 }, svg);
    S("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], class: "ln draw", pathLength: 1, style: "stroke-width:3" }, g1);
    croix(g1, A); croix(g1, B);
    T(g1, A[0] - 22, A[1] + 8, "A", { class: "lab gras", style: "font-size:22px" });
    T(g1, B[0] + 22, B[1] + 8, "B", { class: "lab gras", style: "font-size:22px" });
    T(g1, (A[0] + B[0]) / 2, A[1] + 34, "5 cm", { class: "lab gras" });
    const g2 = S("g", { "data-step": 2 }, svg);
    demi(g2, A, 50, 350, { class: "ln draw", pathLength: 1, style: `stroke:${C.bleu};stroke-width:3` });
    lettre(g2, A, 50, 370, "x", { fill: C.bleu });
    S("path", { d: arcD(A, 0, 50, 50), fill: "none", stroke: C.bleu, "stroke-width": 3 }, g2);
    let m = P(A, 25, 78); T(g2, m[0], m[1], "50°", { class: "lab gras", fill: C.bleu });
    const g3 = S("g", { "data-step": 3 }, svg);
    demi(g3, B, 140, 350, { class: "ln draw", pathLength: 1, style: `stroke:${C.vert};stroke-width:3` });
    lettre(g3, B, 140, 370, "y", { fill: C.vert });
    S("path", { d: arcD(B, 140, 180, 50), fill: "none", stroke: C.vert, "stroke-width": 3 }, g3);
    m = P(B, 160, 80); T(g3, m[0], m[1], "40°", { class: "lab gras", fill: C.vert });
    const g4 = S("g", { "data-step": 4 }, svg);
    S("circle", { cx: Cp[0], cy: Cp[1], r: 14, fill: "none", stroke: C.rouge, "stroke-width": 3 }, g4);
    croix(g4, Cp);
    T(g4, Cp[0], Cp[1] - 30, "C", { class: "lab gras", style: "font-size:24px" });
    const rap = rapporteurMobile(svg, 140, [560, 190, 0], [[A[0], A[1], 0], [B[0], B[1], 0]]);
    let avant = -1;
    Diapo.surEtape("s-triangle", k => {
      const p = k === 2 ? 1 : k === 3 ? 2 : 0;
      if (p === avant) return; avant = p;
      if (p === 1) rap.aller(A[0], A[1], 0); else if (p === 2) rap.aller(B[0], B[1], 0); else rap.depart();
    });
  })();

  /* ================= 15. diagramme circulaire ================= */
  (function () {
    const svg = $("#fig-sport"), O = [310, 300], r = 210;
    const parts = [["Football", 120, C.bleu], ["Danse", 90, C.orange], ["Handball", 60, C.vert], ["Natation", 90, C.violet]];
    S("circle", { cx: O[0], cy: O[1], r, fill: "#fff", stroke: C.texte, "stroke-width": 2.5 }, svg);
    S("circle", { cx: O[0], cy: O[1], r: 4, fill: C.texte }, svg);
    demi(svg, O, 90, r, { "data-step": 1 });
    let deb = 90;
    parts.forEach(([nom, ang, coul], i) => {
      const a2 = deb, a1 = deb - ang;
      const g = secteur(svg, O, a1, a2, r, coul, { "data-step": i + 2 }, .3);
      demi(g, O, a1, r);
      const mid = P(O, (a1 + a2) / 2, r * 0.58);
      T(g, mid[0], mid[1] - 12, nom, { class: "lab gras", fill: coul });
      T(g, mid[0], mid[1] + 14, ang + "°", { class: "lab gras", fill: coul });
      deb = a1;
    });
    T(svg, O[0], 40, "Sport préféré des 24 élèves", { class: "lab gras", "data-step": 6 });
  })();

  /* ======================================================================
     MANIPULATIONS AJOUTÉES
     ====================================================================== */
  const dir = (Y, X) => Math.atan2(Y[1] - X[1], X[0] - Y[0]) * 180 / Math.PI; // direction de [YX)
  function petitAngle(d1, d2) { const e = ((d2 - d1) % 360 + 360) % 360; return e <= 180 ? [d1, d1 + e] : [d2, d2 + 360 - e]; }
  function retour(el, classe, html) { el.className = "retour" + (classe ? " " + classe : ""); el.innerHTML = html; }

  /* ----- Nommer un angle en cliquant sur trois points ----- */
  (function () {
    const svg = $("#fig-clic"), res = $("#clic-ret"), nom = $("#clic-nom");
    const PTS = { A: [90, 390], B: [330, 500], C: [570, 330], D: [260, 85] };
    const OFF = { A: [-24, 6], B: [6, 28], C: [26, 4], D: [0, -26] };
    const ANGLES = [["B", "A", "C"], ["C", "A", "D"], ["B", "A", "D"], ["A", "C", "B"], ["A", "C", "D"], ["B", "C", "D"], ["A", "B", "C"], ["A", "D", "C"]];
    let cible, clics = [], fini = false, score = 0, essais = 0;
    function arc(g, X, Y, Z, coul, r) { const [a1, a2] = petitAngle(dir(PTS[Y], PTS[X]), dir(PTS[Y], PTS[Z])); return secteur(g, PTS[Y], a1, a2, r, coul, {}, .35); }
    function dessiner() {
      svg.innerHTML = "";
      const seg = (u, v) => S("line", { x1: PTS[u][0], y1: PTS[u][1], x2: PTS[v][0], y2: PTS[v][1], class: "ln" }, svg);
      seg("A", "B"); seg("B", "C"); seg("C", "D"); seg("D", "A"); seg("A", "C");
      arc(svg, cible[0], cible[1], cible[2], C.orange, 58);
      if (clics.length === 3 && !fini) {} // rien
      if (fini && clics.length === 3 && new Set(clics).size === 3) arc(svg, clics[0], clics[1], clics[2], C.bleu, 38);
      for (const k in PTS) {
        const g = S("g", { style: "cursor:pointer" }, svg), [x, y] = PTS[k], i = clics.indexOf(k);
        S("circle", { cx: x, cy: y, r: 26, fill: i >= 0 ? "rgba(31,95,168,.18)" : "transparent", stroke: i >= 0 ? C.bleu : "none", "stroke-width": 2 }, g);
        S("circle", { cx: x, cy: y, r: 6, fill: C.texte }, g);
        T(g, x + OFF[k][0], y + OFF[k][1], k, { class: "lab gras", style: "font-size:24px" });
        g.addEventListener("click", e => { e.stopPropagation(); clic(k); });
      }
      nom.innerHTML = clics.length ? `<span class="ang">${clics.join("")}</span>` : `<span class="note">clique sur un point</span>`;
    }
    function clic(k) {
      if (fini || clics.includes(k)) return;
      clics.push(k); dessiner();
      if (clics.length < 3) return;
      fini = true; essais++;
      const [x, y, z] = cible, ok = clics[1] === y && new Set([clics[0], clics[2]]).size === 2 && [x, z].includes(clics[0]) && [x, z].includes(clics[2]);
      if (ok) { score++; retour(res, "ok", `<b>Bravo !</b> L’angle orange se note <span class="ang">${x + y + z}</span> ou <span class="ang">${z + y + x}</span> : le sommet ${y} est au milieu.`); }
      else if (clics[1] !== y) retour(res, "ko", `<b>Attention au sommet !</b> Le sommet de l’angle orange est ${y} : sa lettre doit être <b>au milieu</b>. Tu as nommé (en bleu) un angle de sommet ${clics[1]}.`);
      else retour(res, "ko", `Le sommet ${y} est bien au milieu, mais l’angle bleu que tu as nommé n’est pas l’angle orange : regarde sur quels côtés il s’appuie.`);
      dessiner();
      $("#clic-score").textContent = `Bonnes réponses : ${score} sur ${essais}`;
    }
    function nouveau() {
      let c; do { c = choisir(ANGLES); } while (cible && c.join("") === cible.join(""));
      cible = c; clics = []; fini = false;
      retour(res, "", "Clique sur trois points, dans l’ordre, pour écrire le nom de l’angle orange.");
      dessiner();
    }
    $("#clic-eff").addEventListener("click", () => { clics = []; fini = false; retour(res, "", "Clique sur trois points, dans l’ordre, pour écrire le nom de l’angle orange."); dessiner(); });
    $("#clic-new").addEventListener("click", nouveau);
    nouveau();
  })();

  /* ----- Estimer avant de mesurer ----- */
  (function () {
    const svg = $("#fig-est"), O = [310, 400], R = 220, res = $("#est-ret"), inp = $("#est-rep");
    let m, th0, type = null, rap, fait = false;
    function nouveau() {
      do { m = alea(12, 168); } while (Math.abs(m - 90) < 8);
      th0 = alea(-20, 20); type = null; fait = false;
      svg.innerHTML = "";
      demi(svg, O, th0, 260, { style: "stroke-width:3" }); demi(svg, O, th0 + m, 255, { style: "stroke-width:3" });
      secteur(svg, O, th0, th0 + m, 45, C.orange, {}, .35);
      S("circle", { cx: O[0], cy: O[1], r: 4.5, fill: C.texte }, svg);
      rap = rapporteurMobile(svg, R, [310, 640, 0], [O[0], O[1], th0], { style: "opacity:0;pointer-events:none" });
      document.querySelectorAll("#est-type .btn").forEach(b => b.classList.remove("sel"));
      inp.value = ""; retour(res, "", "1. Aigu ou obtus ?  2. Estime sa mesure.  3. Clique sur « Mesurer ».");
    }
    document.querySelectorAll("#est-type .btn").forEach(b => b.addEventListener("click", () => {
      if (fait) return; type = b.dataset.t;
      document.querySelectorAll("#est-type .btn").forEach(x => x.classList.toggle("sel", x === b));
    }));
    function mesurer() {
      const v = parseInt(inp.value, 10);
      if (!type || isNaN(v)) { retour(res, "ko", "Choisis d’abord <b>aigu</b> ou <b>obtus</b>, puis écris ton estimation."); return; }
      fait = true;
      rap.el.style.opacity = 1; rap.el.style.pointerEvents = "auto"; rap.aller(O[0], O[1], th0);
      const bonType = (m < 90 ? "aigu" : "obtus") === type, e = Math.abs(v - m);
      const avis = e <= 10 ? "Excellente estimation !" : e <= 20 ? "Bonne estimation." : "Ton estimation est loin : compare avec un angle droit (90°) ou avec la moitié d’un angle droit (45°).";
      retour(res, bonType && e <= 20 ? "ok" : "ko", `L’angle mesure <b>${m}°</b> : il est ${m < 90 ? "aigu" : "obtus"}${bonType ? "" : " (et non " + type + ")"}. Tu avais estimé ${v}° : écart de ${e}°. ${avis}`);
    }
    $("#est-ok").addEventListener("click", mesurer);
    inp.addEventListener("keydown", e => { if (e.key === "Enter") mesurer(); e.stopPropagation(); });
    $("#est-new").addEventListener("click", nouveau);
    nouveau();
  })();

  /* ----- Défi : tracer un angle de mesure donnée ----- */
  (function () {
    const svg = $("#fig-trace2"), O = [300, 440], R = 230, res = $("#tr2-ret");
    let m, d, rap, gY, essais = 0, reussis = 0;
    function dessinerOy() {
      gY.innerHTML = "";
      demi(gY, O, d, 290, { style: `stroke:${C.violet};stroke-width:3.5;pointer-events:none` });
      const h = P(O, d, 290);
      S("circle", { cx: h[0], cy: h[1], r: 26, fill: "transparent", style: "cursor:grab" }, gY);
      S("circle", { cx: h[0], cy: h[1], r: 16, fill: C.violet, stroke: "#fff", "stroke-width": 3, style: "cursor:grab" }, gY);
      const l = P(O, d, 318); T(gY, l[0], l[1], "y", { class: "lab gras", style: "font-size:22px;font-style:italic;pointer-events:none" });
    }
    function nouveau() {
      do { m = alea(15, 165); } while (Math.abs(m - 90) < 6);
      d = m < 90 ? alea(120, 170) : alea(10, 60);
      $("#tr2-m").textContent = m;
      svg.innerHTML = "";
      demi(svg, O, 0, 300, { style: "stroke-width:3" });
      lettre(svg, O, 0, 312, "x", { y: O[1] + 26 });
      S("circle", { cx: O[0], cy: O[1], r: 5, fill: C.texte }, svg);
      T(svg, O[0], O[1] + 26, "O", { class: "lab gras", style: "font-size:22px;font-style:italic" });
      rap = rapporteurMobile(svg, R, [300, 600, 0], [O[0], O[1], 0]);
      gY = S("g", {}, svg); dessinerOy();
      retour(res, "", "Place le rapporteur, puis fais tourner [Oy) avec la poignée violette. Clique sur « Vérifier » quand tu as fini.");
    }
    let drag = false;
    svg.addEventListener("pointerdown", e => { if (!gY.contains(e.target)) return; e.stopPropagation(); drag = true; svg.setPointerCapture(e.pointerId); });
    svg.addEventListener("pointermove", e => { if (!drag) return; const q = svgPt(svg, e); d = Math.max(1, Math.min(179, Math.round(Math.atan2(O[1] - q.y, q.x - O[0]) * 180 / Math.PI))); dessinerOy(); });
    svg.addEventListener("pointerup", () => drag = false);
    $("#tr2-ok").addEventListener("click", () => {
      essais++;
      if (Math.abs(d - m) <= 1) { reussis++; retour(res, "ok", `<b>Bravo !</b> Ton angle <span class="ang">xOy</span> mesure ${d}°.`); }
      else if (Math.abs(d - (180 - m)) <= 1) retour(res, "ko", `<b>Mauvaise graduation !</b> Ton angle mesure ${d}° = 180° − ${m}°. Lis la graduation qui part du 0 posé sur [Ox). ${m < 90 ? "Un angle de " + m + "° est aigu." : "Un angle de " + m + "° est obtus."}`);
      else retour(res, "ko", `Ton angle mesure ${d}°, il fallait ${m}°. Vérifie le placement du rapporteur et ta lecture.`);
      $("#tr2-score").textContent = `Bonnes réponses : ${reussis} sur ${essais}`;
    });
    $("#tr2-voir").addEventListener("click", () => { rap.aller(O[0], O[1], 0); d = m; dessinerOy(); retour(res, "", `Voici l’angle <span class="ang">xOy</span> de ${m}° : on part du 0 posé sur [Ox).`); });
    $("#tr2-new").addEventListener("click", nouveau);
    nouveau();
  })();

  /* ----- Adjacents ou pas ? ----- */
  (function () {
    const svg = $("#fig-adjtri"), res = $("#adj-ret"), crit = [...document.querySelectorAll("#adj-crit li")];
    let cas, prec = null, essais = 0, reussis = 0, repondu = false;
    function genere() {
      let t; do { t = alea(0, 4); } while (t === prec); prec = t;
      const r = alea(-25, 50), a = alea(35, 55), b = alea(35, 55), O = [310, 420];
      if (t === 0 || t === 4) return { adj: true, crit: [true, true, true], dessin: g => duo(g, O, [r, r + a], O, [r + a, r + a + b]), texte: "Même sommet, un côté commun, et ils sont de part et d’autre de ce côté : ils sont adjacents." };
      if (t === 1) return { adj: false, crit: [true, true, false], dessin: g => duo(g, O, [r, r + a + b], O, [r, r + a], true), texte: "Ils ont le même sommet et un côté commun, mais ils sont du même côté de ce côté commun : l’un est dans l’autre. Ils ne sont pas adjacents." };
      if (t === 2) { const c = alea(20, 35); return { adj: false, crit: [true, false, null], dessin: g => duo(g, O, [r, r + a], O, [r + a + c, r + a + c + b]), texte: "Ils ont le même sommet, mais pas de côté commun. Ils ne sont pas adjacents." }; }
      const O1 = [140, 420], O2 = [480, 420];
      return { adj: false, crit: [false, false, null], dessin: g => { S("line", { x1: 30, y1: 420, x2: 600, y2: 420, class: "ln" }, g); duo(g, O1, [0, a + 10], O2, [180 - b - 10, 180]); }, texte: "Ils n’ont pas le même sommet. Ils ne sont pas adjacents." };
    }
    function duo(g, O1, [p1, q1], O2, [p2, q2], emboite) {
      secteur(g, O1, p1, q1, emboite ? 130 : 95, C.vert, {}, .3);
      secteur(g, O2, p2, q2, emboite ? 80 : 125, C.orange, {}, .3);
      for (const [O, d] of [[O1, p1], [O1, q1], [O2, p2], [O2, q2]]) demi(g, O, d, 280, { style: "stroke-width:3" });
      for (const O of [O1, O2]) S("circle", { cx: O[0], cy: O[1], r: 5, fill: C.texte }, g);
    }
    function nouveau() {
      cas = genere(); repondu = false; svg.innerHTML = ""; cas.dessin(svg);
      crit.forEach(li => { li.className = ""; li.querySelector("b").textContent = "?"; });
      document.querySelectorAll("#adj-choix .btn").forEach(b => { b.disabled = false; b.classList.remove("bon", "mauvais"); });
      retour(res, "", "Les angles vert et orange sont-ils adjacents ?");
    }
    document.querySelectorAll("#adj-choix .btn").forEach(b => b.addEventListener("click", () => {
      if (repondu) return; repondu = true; essais++;
      const oui = b.dataset.r === "oui", ok = oui === cas.adj; if (ok) reussis++;
      document.querySelectorAll("#adj-choix .btn").forEach(x => { x.disabled = true; if ((x.dataset.r === "oui") === cas.adj) x.classList.add("bon"); });
      if (!ok) b.classList.add("mauvais");
      cas.crit.forEach((v, i) => { crit[i].className = v === null ? "na" : v ? "oui" : "non"; crit[i].querySelector("b").textContent = v === null ? "–" : v ? "✓" : "✗"; });
      retour(res, ok ? "ok" : "ko", `<b>${ok ? "Bravo !" : "Pas tout à fait."}</b> ${cas.texte}`);
      $("#adj-score").textContent = `Bonnes réponses : ${reussis} sur ${essais}`;
    }));
    $("#adj-new").addEventListener("click", nouveau);
    nouveau();
  })();

  /* ----- Placer soi-même la bissectrice ----- */
  (function () {
    const svg = $("#fig-bis2"), O = [300, 420], res = $("#bis2-ret");
    let a, z;
    function dessiner() {
      svg.innerHTML = "";
      const g1 = z, g2 = a - z, egal = Math.abs(g1 - g2) < 1e-9;
      secteur(svg, O, 0, z, 90, egal ? C.vert : C.bleu, {}, .25);
      secteur(svg, O, z, a, 110, egal ? C.vert : C.orange, {}, .25);
      if (egal) for (const t of [z / 2, z + (a - z) / 2]) { const p = P(O, t, 81), q = P(O, t, 99); S("line", { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: C.vert, "stroke-width": 3 }, svg); }
      demi(svg, O, 0, 290); demi(svg, O, a, 290);
      lettre(svg, O, 0, 306, "x", { y: O[1] + 24 }); lettre(svg, O, a, 312, "y");
      S("circle", { cx: O[0], cy: O[1], r: 5, fill: C.texte }, svg);
      T(svg, O[0], O[1] + 26, "O", { class: "lab gras", style: "font-size:22px;font-style:italic" });
      const gz = S("g", { style: "cursor:grab" }, svg);
      demi(gz, O, z, 300, { style: `stroke:${C.violet};stroke-width:3.5;stroke-dasharray:10 7` });
      const h = P(O, z, 300);
      S("circle", { cx: h[0], cy: h[1], r: 26, fill: "transparent" }, gz);
      S("circle", { cx: h[0], cy: h[1], r: 16, fill: C.violet, stroke: "#fff", "stroke-width": 3 }, gz);
      lettre(gz, O, z, 328, "z", { fill: C.violet });
      let p = P(O, z / 2, 140); T(svg, p[0], p[1], nb(g1) + "°", { class: "lab gras", fill: egal ? C.vert : C.bleu });
      p = P(O, z + (a - z) / 2, 160); T(svg, p[0], p[1], nb(g2) + "°", { class: "lab gras", fill: egal ? C.vert : C.orange });
      $("#bis2-lec").innerHTML = `<span class="ang">xOz</span> = <span class="${egal ? "c-vert" : "c-bleu"}">${nb(g1)}°</span> &nbsp;et&nbsp; <span class="ang">zOy</span> = <span class="${egal ? "c-vert" : "c-orange"}">${nb(g2)}°</span>`;
      if (egal) retour(res, "ok", `<b>Bravo !</b> [Oz) partage <span class="ang">xOy</span> en deux angles adjacents de même mesure : ${nb(a)} ÷ 2 = ${nb(z)}°. C’est la bissectrice.`);
      else retour(res, "", "Fais tourner [Oz) avec la poignée violette jusqu’à obtenir deux angles de même mesure.");
    }
    function nouveau() { a = 2 * alea(25, 80); z = Math.random() < .5 ? alea(8, Math.round(a / 2) - 10) : alea(Math.round(a / 2) + 10, a - 8); dessiner(); }
    let drag = false;
    svg.addEventListener("pointerdown", e => { e.stopPropagation(); drag = true; svg.setPointerCapture(e.pointerId); bouger(e); });
    svg.addEventListener("pointermove", e => { if (drag) bouger(e); });
    svg.addEventListener("pointerup", () => drag = false);
    function bouger(e) { const q = svgPt(svg, e); let t = Math.atan2(O[1] - q.y, q.x - O[0]) * 180 / Math.PI; if (t < -90) t += 360; z = Math.max(2, Math.min(a - 2, Math.round(t))); dessiner(); }
    $("#bis2-new").addEventListener("click", nouveau);
    nouveau();
  })();

  /* ----- Diagramme circulaire : on change les effectifs ----- */
  (function () {
    const svg = $("#fig-diag2"), O = [310, 290], r = 220;
    const SPORTS = [["Football", C.bleu], ["Danse", C.orange], ["Handball", C.vert], ["Natation", C.violet]];
    const ins = [...document.querySelectorAll("#diag2-tab input")];
    const ecrire = x => (Math.abs(x - Math.round(x * 10) / 10) < 1e-9 ? "" : "≈ ") + nb(Math.round(x * 10) / 10);
    function dessiner() {
      const eff = ins.map(i => Math.max(0, parseInt(i.value, 10) || 0)), tot = eff.reduce((s, x) => s + x, 0);
      svg.innerHTML = "";
      S("circle", { cx: O[0], cy: O[1], r, fill: "#fff", stroke: C.texte, "stroke-width": 2.5 }, svg);
      $("#diag2-tot").textContent = tot;
      if (!tot) { $("#diag2-calc").textContent = "Mets au moins un élève !"; document.querySelectorAll("#diag2-tab .ang-cell").forEach(c => c.textContent = "–"); return; }
      const u = 360 / tot;
      const ex = Math.abs(u - Math.round(u * 10) / 10) < 1e-9, uu = nb(Math.round(u * 10) / 10);
      $("#diag2-calc").innerHTML = ex ? `360 ÷ ${tot} = ${uu} : un élève est représenté par un angle de ${uu}°.`
        : `360 ÷ ${tot} ≈ ${uu} : un élève est représenté par un angle d’environ ${uu}° (valeur arrondie au dixième).`;
      let deb = 90;
      eff.forEach((e, i) => {
        const ang = e * u, cell = document.querySelectorAll("#diag2-tab .ang-cell")[i];
        cell.textContent = ecrire(ang);
        if (!e) return;
        const [nom, coul] = SPORTS[i], a1 = deb - ang;
        if (ang >= 359.999) S("circle", { cx: O[0], cy: O[1], r, fill: coul, opacity: .3 }, svg);
        else { secteur(svg, O, a1, deb, r, coul, {}, .3); demi(svg, O, a1, r); demi(svg, O, deb, r); }
        if (ang >= 18) { const mid = P(O, (a1 + deb) / 2, r * 0.6); T(svg, mid[0], mid[1] - 11, nom, { class: "lab gras", fill: coul }); T(svg, mid[0], mid[1] + 13, ecrire(ang) + "°", { class: "lab gras", fill: coul }); }
        deb = a1;
      });
      S("circle", { cx: O[0], cy: O[1], r: 4, fill: C.texte }, svg);
    }
    ins.forEach(i => { i.addEventListener("input", dessiner); i.addEventListener("keydown", e => e.stopPropagation()); });
    $("#diag2-zero").addEventListener("click", () => { [8, 6, 4, 6].forEach((v, k) => ins[k].value = v); dessiner(); });
    dessiner();
  })();

  Diapo.demarrer();
})();
