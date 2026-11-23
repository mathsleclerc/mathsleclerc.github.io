/* Cours interactif — Les angles (6e) : figures et activités */
(function () {
  const { S, T, nb } = Diapo;
  const $ = s => document.querySelector(s);
  const C = { bleu: "#1f5fa8", vert: "#2e8b57", orange: "#d9822b", violet: "#6b5bb5", rouge: "#c4302b", jaune: "#d9a400", gris: "#8796aa", texte: "#1c2430", fonce: "#174a84" };

  /* ---------- géométrie (angles en degrés, sens direct, y vers le bas à l'écran) ---------- */
  const rad = a => a * Math.PI / 180;
  const P = (O, a, r) => [O[0] + r * Math.cos(rad(a)), O[1] - r * Math.sin(rad(a))];
  const f = x => x.toFixed(1);
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
      if (d % 10 === 0 && (!petit || d % 30 === 0)) {
        const fs = petit ? 11 : 13, a = P(O, d, R * 0.84), b = P(O, d, R * 0.7);
        T(grp, a[0], a[1] - (d === 0 || d === 180 ? 8 : 0), String(d), { style: `font-size:${fs}px;font-weight:700`, fill: C.fonce });
        T(grp, b[0], b[1] - (d === 0 || d === 180 ? 8 : 0), String(180 - d), { style: `font-size:${fs}px;font-weight:700`, fill: C.rouge });
      }
    }
    S("line", { x1: O[0] - R, y1: O[1], x2: O[0] + R, y2: O[1], stroke: C.bleu, "stroke-width": 2 }, grp);
    S("path", { d: `M${O[0] - 8},${O[1]} L${O[0] + 8},${O[1]} M${O[0]},${O[1] - 8} L${O[0]},${O[1]}`, stroke: C.bleu, "stroke-width": 2 }, grp);
    return grp;
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
    const svg = $("#fig-mesurer"), O = [310, 470], R = 260;
    demi(svg, O, 0, 295); demi(svg, O, 130, 290);
    secteur(svg, O, 0, 130, 45, C.orange, {}, .3);
    const A = P(O, 0, 290), B = P(O, 130, 285);
    T(svg, A[0] - 6, A[1] + 24, "A", { class: "lab gras", style: "font-size:22px" });
    T(svg, B[0] - 22, B[1], "B", { class: "lab gras", style: "font-size:22px" });
    T(svg, O[0], O[1] + 26, "O", { class: "lab gras", style: "font-size:22px" });
    rapporteur(svg, O, R, { "data-step": 1 });
    const g1 = S("g", { "data-step": 1, "data-until": 2 }, svg);
    S("circle", { cx: O[0], cy: O[1], r: 16, fill: "none", stroke: C.rouge, "stroke-width": 4 }, g1);
    const g2 = S("g", { "data-step": 2 }, svg), z = P(O, 0, R * 0.84);
    S("circle", { cx: z[0], cy: z[1] - 8, r: 16, fill: "none", stroke: C.rouge, "stroke-width": 3 }, g2);
    T(g2, z[0] - 10, z[1] + 40, "le 0 est sur [OA)", { class: "lab gras", fill: C.rouge, style: "font-size:16px" });
    const g3 = S("g", { "data-step": 3 }, svg);
    S("path", { d: arcD(O, 2, 128, R * 0.84 + 18), fill: "none", stroke: C.vert, "stroke-width": 4, "marker-end": "" }, g3);
    const t = P(O, 130, R * 0.84);
    S("circle", { cx: t[0], cy: t[1], r: 18, fill: "none", stroke: C.vert, "stroke-width": 4 }, g3);
    const g4 = S("g", { "data-step": 4 }, svg), u = P(O, 130, R * 0.7);
    S("line", { x1: u[0] - 14, y1: u[1] + 10, x2: u[0] + 14, y2: u[1] - 10, stroke: C.rouge, "stroke-width": 4 }, g4);
    T(g4, 310, 40, "On lit 130° sur la graduation qui part du 0 de [OA), et non 50°.", { class: "lab gras", fill: C.vert, style: "font-size:17px" });
  })();

  /* ================= 7. jeu : lire une mesure ================= */
  (function () {
    const svg = $("#fig-lire"), O = [310, 470], R = 260;
    const rep = $("#lire-rep"), ret = $("#lire-retour");
    let m = 50, base = 0, essais = 0, reussis = 0;
    function nouveau() {
      do { m = 10 + 5 * Math.floor(Math.random() * 33); } while (m === 90);
      base = Math.random() < .5 ? 0 : 180;
      svg.innerHTML = "";
      const aB = base === 0 ? m : 180 - m;
      rapporteur(svg, O, R);
      demi(svg, O, base, 295, { style: "stroke-width:3" }); demi(svg, O, aB, 290, { style: "stroke-width:3" });
      const a1 = Math.min(base, aB), a2 = Math.max(base, aB);
      secteur(svg, O, a1, a2, 45, C.orange, {}, .35);
      const A = P(O, base, 290), B = P(O, aB, 290);
      T(svg, A[0], A[1] + 24, "A", { class: "lab gras", style: "font-size:22px" });
      const ob = P(O, aB, 312); T(svg, ob[0], ob[1], "B", { class: "lab gras", style: "font-size:22px" });
      T(svg, O[0], O[1] + 26, "O", { class: "lab gras", style: "font-size:22px" });
      rep.value = ""; ret.className = "retour"; ret.textContent = "Pense à partir du 0 qui est sur le côté [OA).";
    }
    function verifier() {
      const v = parseInt(rep.value, 10); if (isNaN(v)) return;
      essais++;
      if (v === m) { reussis++; ret.className = "retour ok"; ret.innerHTML = `<b>Bravo !</b> L’angle mesure ${m}°. Il est ${m < 90 ? "aigu : moins de 90°" : "obtus : plus de 90°"}, ça colle.`; }
      else if (v === 180 - m) { ret.className = "retour ko"; ret.innerHTML = `<b>Mauvaise graduation !</b> Tu as lu ${v}°. L’angle est ${m < 90 ? "aigu" : "obtus"}, il mesure donc ${m < 90 ? "moins" : "plus"} de 90°. Pars du 0 qui est sur [OA).`; }
      else { ret.className = "retour ko"; ret.innerHTML = `Pas tout à fait. Suis la graduation qui part du 0 de [OA) jusqu’au côté [OB).`; }
      $("#lire-score").textContent = `Bonnes réponses : ${reussis} sur ${essais}`;
    }
    $("#lire-ok").addEventListener("click", verifier);
    rep.addEventListener("keydown", e => { if (e.key === "Enter") verifier(); e.stopPropagation(); });
    $("#lire-new").addEventListener("click", nouveau);
    $("#lire-voir").addEventListener("click", () => { ret.className = "retour"; ret.innerHTML = `<span class="ang">AOB</span> = <b>${m}°</b> (et non ${180 - m}°) : l’angle est ${m < 90 ? "aigu" : "obtus"}.`; });
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
    rapporteur(svg, O, R, { "data-step": 2, "data-until": 4 });
    const g3 = S("g", { "data-step": 3 }, svg);
    const r1 = P(O, 37, R + 4), r2 = P(O, 37, R + 22);
    S("line", { x1: r1[0], y1: r1[1], x2: r2[0], y2: r2[1], stroke: C.rouge, "stroke-width": 5, "stroke-linecap": "round" }, g3);
    const g3b = S("g", { "data-step": 3, "data-until": 4 }, svg), lb = P(O, 37, R * 0.84);
    S("circle", { cx: lb[0], cy: lb[1], r: 15, fill: "none", stroke: C.rouge, "stroke-width": 3 }, g3b);
    T(g3b, r2[0] + 46, r2[1] - 6, "repère", { class: "lab gras", fill: C.rouge });
    const g4 = S("g", { "data-step": 4 }, svg);
    demi(g4, O, 37, 330, { class: "ln draw", pathLength: 1, style: `stroke:${C.bleu};stroke-width:3.5` });
    lettre(g4, O, 37, 350, "y");
    secteur(g4, O, 0, 37, 70, C.bleu);
    const m = P(O, 18.5, 100); T(g4, m[0], m[1], "37°", { class: "lab gras", fill: C.bleu, style: "font-size:22px" });
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
    rapporteur(svg, A, 140, { "data-step": 2, "data-until": 3 });
    const g2 = S("g", { "data-step": 2 }, svg);
    demi(g2, A, 50, 350, { class: "ln draw", pathLength: 1, style: `stroke:${C.bleu};stroke-width:3` });
    lettre(g2, A, 50, 370, "x", { fill: C.bleu });
    S("path", { d: arcD(A, 0, 50, 50), fill: "none", stroke: C.bleu, "stroke-width": 3 }, g2);
    let m = P(A, 25, 78); T(g2, m[0], m[1], "50°", { class: "lab gras", fill: C.bleu });
    rapporteur(svg, B, 140, { "data-step": 3, "data-until": 4 });
    const g3 = S("g", { "data-step": 3 }, svg);
    demi(g3, B, 140, 350, { class: "ln draw", pathLength: 1, style: `stroke:${C.vert};stroke-width:3` });
    lettre(g3, B, 140, 370, "y", { fill: C.vert });
    S("path", { d: arcD(B, 140, 180, 50), fill: "none", stroke: C.vert, "stroke-width": 3 }, g3);
    m = P(B, 160, 80); T(g3, m[0], m[1], "40°", { class: "lab gras", fill: C.vert });
    const g4 = S("g", { "data-step": 4 }, svg);
    S("circle", { cx: Cp[0], cy: Cp[1], r: 14, fill: "none", stroke: C.rouge, "stroke-width": 3 }, g4);
    croix(g4, Cp);
    T(g4, Cp[0], Cp[1] - 30, "C", { class: "lab gras", style: "font-size:24px" });
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

  Diapo.demarrer();
})();
