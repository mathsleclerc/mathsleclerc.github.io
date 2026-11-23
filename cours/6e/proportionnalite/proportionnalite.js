/* Cours interactif — Proportionnalité (6e) : figures et activités */
(function () {
  const { S, T, nb, euros, fleche } = Diapo;
  const $ = s => document.querySelector(s);
  const C = { bleu: "#1f5fa8", vert: "#2e8b57", orange: "#d9822b", violet: "#6b5bb5", rouge: "#c4302b", jaune: "#d9a400", gris: "#8796aa", texte: "#1c2430" };
  const COUL = ["#1f5fa8", "#d9822b", "#2e8b57", "#b83280", "#6b5bb5", "#0f8a8a", "#c4302b"];

  /* ================= 1. titre : un tableau décoratif ================= */
  (function () {
    const svg = $("#fig-titre"), w = 90, h = 70, x0 = 10, y0 = 140;
    [["1", "3"], ["2", "6"], ["4", "12"], ["5", "15"]].forEach(([a, b], i) => {
      for (let r = 0; r < 2; r++) {
        S("rect", { x: x0 + i * w, y: y0 + r * h, width: w, height: h, fill: "rgba(255,255,255,.08)", stroke: "rgba(255,255,255,.55)", "stroke-width": 2 }, svg);
        T(svg, x0 + i * w + w / 2, y0 + r * h + h / 2, r ? b : a, { fill: "#fff", style: "font-size:30px;font-weight:700" });
      }
    });
    const xr = x0 + 4 * w;
    S("path", { d: `M${xr + 6},${y0 + 35} C${xr + 50},${y0 + 35} ${xr + 50},${y0 + 105} ${xr + 6},${y0 + 105}`, fill: "none", stroke: "#ffd65c", "stroke-width": 3 }, svg);
    S("path", { d: `M${xr + 16},${y0 + 97} L${xr + 6},${y0 + 105} L${xr + 16},${y0 + 113}`, fill: "none", stroke: "#ffd65c", "stroke-width": 3 }, svg);
    T(svg, xr + 66, y0 + 70, "× 3", { fill: "#ffd65c", style: "font-size:34px;font-weight:700" });
  })();

  /* ================= 2. tomates : double droite graduée ================= */
  (function () {
    const svg = $("#fig-tomates"), sl = $("#tom-m");
    const X = m => 60 + m * 100, Y1 = 140, Y2 = 280;
    let m = 2;
    function render() {
      svg.innerHTML = "";
      T(svg, 30, 70, "Masse de tomates (en kg)", { class: "lab gras", "text-anchor": "start", fill: C.bleu });
      T(svg, 30, 350, "Prix à payer (en €)", { class: "lab gras", "text-anchor": "start", fill: C.orange });
      S("line", { x1: 40, y1: Y1, x2: 580, y2: Y1, class: "ln" }, svg);
      S("line", { x1: 40, y1: Y2, x2: 580, y2: Y2, class: "ln" }, svg);
      for (let k = 0; k <= 10; k++) {
        const v = k / 2, x = X(v), grand = k % 2 === 0;
        S("line", { x1: x, y1: Y1 - (grand ? 9 : 5), x2: x, y2: Y1 + (grand ? 9 : 5), class: "ln" }, svg);
        S("line", { x1: x, y1: Y2 - (grand ? 9 : 5), x2: x, y2: Y2 + (grand ? 9 : 5), class: "ln" }, svg);
        if (grand) { T(svg, x, Y1 - 26, nb(v), { fill: C.bleu }); T(svg, x, Y2 + 28, nb(3 * v), { fill: C.orange }); }
      }
      const x = X(m);
      S("line", { x1: x, y1: Y1, x2: x, y2: Y2, stroke: C.vert, "stroke-width": 3, "stroke-dasharray": "7 6" }, svg);
      S("circle", { cx: x, cy: Y1, r: 11, fill: C.bleu, style: "cursor:grab" }, svg);
      S("circle", { cx: x, cy: Y2, r: 11, fill: C.orange, style: "cursor:grab" }, svg);
      T(svg, x + (m > 4 ? -46 : 46), (Y1 + Y2) / 2, "× 3", { class: "lab gras", fill: C.vert, style: "font-size:24px" });
      $("#tom-lec").innerHTML = `<span class="c-bleu">${nb(m)} kg</span> → ${nb(m)} × 3 = <span class="c-orange">${euros(3 * m)} €</span>`;
      sl.value = m;
    }
    sl.addEventListener("input", e => { m = +e.target.value; render(); });
    let drag = false;
    function fromPt(ev) {
      const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY;
      const q = p.matrixTransform(svg.getScreenCTM().inverse());
      m = Math.max(0, Math.min(5, Math.round((q.x - 60) / 50) / 2)); render();
    }
    svg.addEventListener("pointerdown", e => { drag = true; svg.setPointerCapture(e.pointerId); fromPt(e); });
    svg.addEventListener("pointermove", e => { if (drag) fromPt(e); });
    svg.addEventListener("pointerup", () => drag = false);
    render();
  })();

  /* ================= tableau SVG générique ================= */
  function tableau(svg, o) {
    // o : {x, y, wl, wc, h, lignes:[titre1,titre2], cols:[[v1,v2,step],...]}
    const g = S("g", {}, svg);
    o.lignes.forEach((t, r) => {
      S("rect", { x: o.x, y: o.y + r * o.h, width: o.wl, height: o.h, class: "cell tete" }, g);
      T(g, o.x + o.wl / 2, o.y + r * o.h + o.h / 2, t, { class: "lab gras" });
    });
    o.cols.forEach((c, i) => {
      const x = o.x + o.wl + i * o.wc;
      for (let r = 0; r < 2; r++) {
        S("rect", { x, y: o.y + r * o.h, width: o.wc, height: o.h, class: "cell" }, g);
        if (c[r] != null) T(g, x + o.wc / 2, o.y + r * o.h + o.h / 2, c[r], { class: "lab gras", style: "font-size:24px", "data-step": c[2 + r] ?? c[2] });
      }
    });
    return i => o.x + o.wl + i * o.wc + o.wc / 2;
  }

  /* ================= 3. escalade ================= */
  (function () {
    const svg = $("#fig-escalade");
    const cx = tableau(svg, { x: 30, y: 170, wl: 250, wc: 150, h: 64, lignes: ["Nombre de séances", "Prix (en €)"],
      cols: [["1", "14", 0, 1], ["2", "18", 0, 2]] });
    fleche(svg, cx(0), cx(1), 170, -1, "× 2", C.bleu, { "data-step": 3 });
    fleche(svg, cx(0), cx(1), 298, 1, "× 2 ?", C.rouge, { "data-step": 3 });
    const g = S("g", { "data-step": 3 }, svg);
    T(g, 310, 400, "2 × 14 = 28 et pas 18 !", { class: "lab gras", fill: C.rouge, style: "font-size:24px" });
  })();

  /* ================= 4. Hugo ================= */
  (function () {
    const svg = $("#fig-hugo"), sol = 545, k = 170; // 1 m = 170 px
    const Y = h => sol - h * k;
    // axe gradué
    S("line", { x1: 50, y1: sol, x2: 50, y2: Y(3), class: "ln" }, svg);
    for (let h = 0; h <= 3; h += 0.5) {
      S("line", { x1: 44, y1: Y(h), x2: 56, y2: Y(h), class: "ln" }, svg);
      T(svg, 30, Y(h), nb(h) + " m", { class: "lab petit", "text-anchor": "end", x: 40 });
    }
    S("line", { x1: 40, y1: sol, x2: 610, y2: sol, class: "ln" }, svg);
    // porte
    S("rect", { x: 95, y: Y(2), width: 105, height: 2 * k, fill: "#f3e3cf", stroke: "#a0764a", "stroke-width": 3 }, svg);
    S("circle", { cx: 182, cy: Y(1), r: 5, fill: "#a0764a" }, svg);
    T(svg, 147, Y(2) - 18, "une porte : 2 m", { class: "lab petit" });
    function perso(cx, H, coul, attrs = {}) {
      const g = S("g", attrs, svg), top = sol - H, r = H * 0.075;
      S("circle", { cx, cy: top + r, r, fill: coul }, g);
      S("rect", { x: cx - H * 0.11, y: top + 2.25 * r, width: H * 0.22, height: H * 0.36, rx: H * 0.05, fill: coul }, g);
      const w = Math.max(4, H * 0.045);
      S("line", { x1: cx - H * 0.06, y1: top + H * 0.55, x2: cx - H * 0.07, y2: sol, stroke: coul, "stroke-width": w, "stroke-linecap": "round" }, g);
      S("line", { x1: cx + H * 0.06, y1: top + H * 0.55, x2: cx + H * 0.07, y2: sol, stroke: coul, "stroke-width": w, "stroke-linecap": "round" }, g);
      S("line", { x1: cx - H * 0.11, y1: top + 2.6 * r, x2: cx - H * 0.19, y2: top + H * 0.5, stroke: coul, "stroke-width": w, "stroke-linecap": "round" }, g);
      S("line", { x1: cx + H * 0.11, y1: top + 2.6 * r, x2: cx + H * 0.19, y2: top + H * 0.5, stroke: coul, "stroke-width": w, "stroke-linecap": "round" }, g);
      return g;
    }
    perso(300, 1.4 * k, C.bleu);
    S("line", { x1: 50, y1: Y(1.4), x2: 360, y2: Y(1.4), stroke: C.bleu, "stroke-width": 2, "stroke-dasharray": "5 5" }, svg);
    T(svg, 300, sol + 22, "Hugo à 10 ans : 1,40 m", { class: "lab gras", fill: C.bleu, style: "font-size:16px" });
    const geant = perso(480, 2.8 * k, "#b4bfcc", { opacity: .9 });
    S("line", { x1: 50, y1: Y(2.8), x2: 560, y2: Y(2.8), stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "5 5" }, svg);
    T(svg, 480, sol + 22, "à 20 ans : 2,80 m ?", { class: "lab gras", fill: C.doux || "#5a6778", style: "font-size:16px" });
    const croix = S("g", { "data-step": 3 }, svg);
    S("line", { x1: 400, y1: Y(2.7), x2: 560, y2: Y(0.9), stroke: C.rouge, "stroke-width": 9, "stroke-linecap": "round" }, croix);
    S("line", { x1: 560, y1: Y(2.7), x2: 400, y2: Y(0.9), stroke: C.rouge, "stroke-width": 9, "stroke-linecap": "round" }, croix);
    void geant;
  })();

  /* ================= 5. jeu de tri ================= */
  (function () {
    const SITU = [
      ["Au marché, les pommes coûtent 3 € le kilo. On s’intéresse au prix payé selon la masse de pommes achetée.", true, "Le prix au kilo est toujours le même : si la masse double, le prix double aussi.", "Pommes à 3 € le kilo"],
      ["Un taxi fait payer 4 € de prise en charge, puis 2 € par kilomètre. On s’intéresse au prix de la course selon la distance.", false, "Il y a une somme fixe à payer en plus : si la distance double, le prix ne double pas.", "Taxi avec prise en charge"],
      ["Une imprimante imprime 30 pages par minute. On s’intéresse au nombre de pages imprimées selon la durée d’impression.", true, "Le nombre de pages par minute est toujours le même.", "Imprimante : 30 pages par minute"],
      ["On s’intéresse à la pointure d’une personne selon son âge.", false, "Quand l’âge double, la pointure ne double pas : on finit par s’arrêter de grandir.", "Pointure et âge"],
      ["On s’intéresse au périmètre d’un carré selon la longueur de son côté.", true, "Le périmètre est toujours 4 fois la longueur du côté.", "Périmètre d’un carré"],
      ["Au parking, on paie 4 € la première heure, puis 2 € par heure supplémentaire. On s’intéresse au prix payé selon la durée de stationnement.", false, "La première heure ne coûte pas le même prix que les suivantes : si la durée double, le prix ne double pas.", "Parking"],
      ["Au cinéma, une place coûte 8 €. On s’intéresse au prix payé selon le nombre de places.", true, "Le prix d’une place est toujours le même : si le nombre de places double, le prix double aussi.", "Places de cinéma à 8 €"],
      ["Un magasin fait une promotion : « 3 paquets de gâteaux pour le prix de 2 ». Un paquet coûte 2 €. On s’intéresse au prix payé selon le nombre de paquets.", false, "Avec la promotion, 3 paquets ne coûtent pas 3 fois le prix d’un paquet.", "Promotion « 3 pour le prix de 2 »"]
    ];
    let ordre, i, score;
    const btns = [...document.querySelectorAll(".tri-choix .btn")], ret = $("#tri-retour"), suite = $("#tri-suite");
    function melanger(a) { a = a.slice(); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; }
    function zero(aleatoire) {
      ordre = aleatoire ? melanger(SITU) : SITU.slice(); i = 0; score = 0;
      $("#bac-oui").innerHTML = ""; $("#bac-non").innerHTML = ""; afficher();
    }
    function afficher() {
      const s = ordre[i];
      $("#tri-num").textContent = `Situation ${i + 1} sur ${ordre.length}`;
      $("#tri-texte").textContent = s[0];
      btns.forEach(b => { b.disabled = false; b.classList.remove("bon", "mauvais"); });
      ret.className = "tri-retour"; ret.textContent = "Vote avec la classe (un doigt : proportionnel, deux doigts : pas proportionnel), puis clique.";
      suite.disabled = true; suite.textContent = i < ordre.length - 1 ? "Situation suivante" : "Voir mon score";
    }
    btns.forEach(b => b.addEventListener("click", () => {
      const s = ordre[i], rep = b.dataset.r === "oui", ok = rep === s[1];
      if (ok) score++;
      btns.forEach(x => { x.disabled = true; if ((x.dataset.r === "oui") === s[1]) x.classList.add("bon"); });
      if (!ok) b.classList.add("mauvais");
      ret.className = "tri-retour " + (ok ? "ok" : "ko");
      ret.innerHTML = `<b>${ok ? "Bravo !" : "Pas tout à fait."}</b> ${s[1] ? "C’est" : "Ce n’est pas"} une situation de proportionnalité. ${s[2]}`;
      const li = document.createElement("li"); li.textContent = s[3];
      $(s[1] ? "#bac-oui" : "#bac-non").appendChild(li);
      suite.disabled = false;
    }));
    suite.addEventListener("click", () => {
      if (i < ordre.length - 1) { i++; afficher(); return; }
      $("#tri-texte").innerHTML = `<span>Tu as trouvé <b>${score} bonne${score > 1 ? "s" : ""} réponse${score > 1 ? "s" : ""}</b> sur ${ordre.length}.</span>`;
      ret.className = "tri-retour"; ret.textContent = score === ordre.length ? "Parfait ! Tu sais reconnaître une situation de proportionnalité." : "Relis les explications, puis clique sur « Recommencer » pour réessayer dans un autre ordre.";
      suite.disabled = true; btns.forEach(x => x.disabled = true);
    });
    $("#tri-zero").addEventListener("click", () => zero(true));
    zero(false);
  })();

  /* ================= cahiers ================= */
  function cahier(g, x, y, coul, w = 18, h = 26) {
    const c = S("g", {}, g);
    S("rect", { x, y, width: w, height: h, rx: 3, fill: coul }, c);
    S("rect", { x: x + 5, y: y + 6, width: w - 9, height: 5, rx: 1.5, fill: "#fff", opacity: .85 }, c);
    for (let k = 0; k < 4; k++) S("circle", { cx: x + 1.5, cy: y + 4 + k * (h - 8) / 3, r: 1.8, fill: "#fff" }, c);
    return c;
  }
  const PAS = 22, LARG_PAQ = 4 * PAS + 8; // un paquet de 4 cahiers
  function paquet(g, x, y, n = 4, pointille = false) {
    const w = n * PAS + 8;
    S("rect", { x: x - 2, y: y - 6, width: w, height: 38, rx: 8, fill: "none", stroke: C.gris, "stroke-width": 2, "stroke-dasharray": pointille ? "5 4" : null }, g);
    for (let k = 0; k < n; k++) cahier(g, x + 4 + k * PAS, y, COUL[k % COUL.length]);
    return w;
  }
  function rangee(svg, y, etiquette, sousEtiq, groupes, prix, sousPrix, stepIcones, stepPrix) {
    const g = S("g", { "data-step": stepIcones }, svg);
    T(g, 72, y + 8, etiquette, { class: "lab gras" });
    if (sousEtiq) T(g, 72, y + 34, sousEtiq, { class: "lab petit" });
    let x = 140;
    for (const n of groupes) { x += paquet(g, x, y - 4, Math.abs(n), n < 0) + 8; }
    const gp = S("g", { "data-step": stepPrix }, svg);
    T(gp, 600, y + 8, prix, { class: "lab gras", "text-anchor": "end", fill: C.orange, style: "font-size:28px" });
    if (sousPrix) T(gp, 600, y + 38, sousPrix, { class: "lab petit", "text-anchor": "end" });
  }

  /* ================= 6. multiplier ou diviser ================= */
  (function () {
    const svg = $("#fig-mult");
    T(svg, 72, 40, "Cahiers", { class: "lab petit" }); T(svg, 600, 40, "Prix", { class: "lab petit", "text-anchor": "end" });
    rangee(svg, 100, "4 cahiers", null, [4], "6 €", null, 0, 0);
    rangee(svg, 260, "12 cahiers", "= 3 × 4", [4, 4, 4], "18 €", "= 3 × 6", 1, 2);
    rangee(svg, 420, "2 cahiers", "= 4 ÷ 2", [-2], "3 €", "= 6 ÷ 2", 3, 5);
    const g1 = S("g", { "data-step": 1 }, svg); T(g1, 330, 185, "3 fois plus de cahiers…", { class: "lab", fill: C.vert });
    const g2 = S("g", { "data-step": 2 }, svg); T(g2, 330, 335, "… donc 3 fois plus cher", { class: "lab", fill: C.vert });
    const g3 = S("g", { "data-step": 5 }, svg); T(g3, 330, 510, "2 fois moins de cahiers, donc 2 fois moins cher", { class: "lab", fill: C.vert });
  })();

  /* ================= 7. additionner ================= */
  (function () {
    const svg = $("#fig-add");
    T(svg, 72, 40, "Cahiers", { class: "lab petit" }); T(svg, 600, 40, "Prix", { class: "lab petit", "text-anchor": "end" });
    rangee(svg, 100, "12 cahiers", null, [4, 4, 4], "18 €", null, 0, 0);
    rangee(svg, 220, "2 cahiers", null, [-2], "3 €", null, 0, 0);
    const g = S("g", { "data-step": 1 }, svg);
    T(g, 300, 300, "+", { class: "lab gras", style: "font-size:40px", fill: C.vert });
    S("line", { x1: 30, y1: 330, x2: 600, y2: 330, stroke: C.vert, "stroke-width": 3 }, g);
    rangee(svg, 390, "14 cahiers", "= 12 + 2", [4, 4, 4, -2], "21 €", "= 18 + 3", 1, 3);
  })();

  /* ================= 8. retour à l'unité ================= */
  (function () {
    const svg = $("#fig-unite");
    T(svg, 72, 40, "Cahiers", { class: "lab petit" }); T(svg, 600, 40, "Prix", { class: "lab petit", "text-anchor": "end" });
    rangee(svg, 100, "4 cahiers", null, [4], "6 €", null, 0, 0);
    // 1 cahier
    const g1 = S("g", { "data-step": 1 }, svg);
    T(g1, 72, 268, "1 cahier", { class: "lab gras" });
    S("rect", { x: 138, y: 244, width: 34, height: 44, rx: 8, fill: "none", stroke: C.violet, "stroke-width": 3 }, g1);
    cahier(g1, 144, 251, COUL[0], 22, 30);
    T(g1, 600, 268, "1,50 €", { class: "lab gras", "text-anchor": "end", fill: C.orange, style: "font-size:28px" });
    T(g1, 600, 298, "= 6 ÷ 4", { class: "lab petit", "text-anchor": "end" });
    T(g1, 340, 205, "÷ 4 : le prix d’un seul cahier", { class: "lab", fill: C.violet });
    // 7 cahiers
    const g2 = S("g", { "data-step": 2 }, svg);
    T(g2, 72, 428, "7 cahiers", { class: "lab gras" });
    for (let k = 0; k < 7; k++) {
      cahier(g2, 140 + k * 36, 404, COUL[k % COUL.length], 22, 30);
      T(g2, 151 + k * 36, 452, "1,50", { class: "lab petit", style: "font-size:13px" });
    }
    T(g2, 600, 428, "10,50 €", { class: "lab gras", "text-anchor": "end", fill: C.orange, style: "font-size:28px" });
    T(g2, 600, 458, "= 7 × 1,50", { class: "lab petit", "text-anchor": "end" });
    T(g2, 340, 365, "× 7 : sept fois le prix d’un cahier", { class: "lab", fill: C.violet });
  })();

  /* ================= 9. tableau récapitulatif ================= */
  (function () {
    const svg = $("#fig-tab");
    const cx = tableau(svg, { x: 40, y: 170, wl: 250, wc: 130, h: 64, lignes: ["Nombre de cahiers", "Prix (en €)"],
      cols: [["4", "6", 0], ["12", "18", 1], ["2", "3", 2], ["14", "21", 3], ["1", "1,50", 4]] });
    fleche(svg, cx(0), cx(1), 170, -1, "× 3", C.bleu, { "data-step": 1 }, 40);
    fleche(svg, cx(0), cx(2), 170, -1, "÷ 2", C.vert, { "data-step": 2 }, 78);
    fleche(svg, cx(0), cx(4), 170, -1, "÷ 4", C.violet, { "data-step": 4 }, 118);
    const n = S("g", { "data-step": 3 }, svg);
    T(n, cx(3), 345, "14 = 12 + 2 donc 21 = 18 + 3", { class: "lab gras", fill: C.orange });
    S("path", { d: `M${cx(3)},312 L${cx(3)},325`, class: "fl", stroke: C.orange }, n);
    const d = S("g", { "data-step": 5 }, svg), xr = 40 + 250 + 5 * 130;
    S("path", { d: `M${xr + 6},202 C${xr + 60},202 ${xr + 60},266 ${xr + 6},266`, class: "fl draw", stroke: C.rouge, pathLength: 1 }, d);
    S("path", { d: `M${xr + 16},258 L${xr + 6},266 L${xr + 16},274`, class: "fl", stroke: C.rouge }, d);
    T(d, xr + 112, 222, "× 1,5", { class: "lab gras", fill: C.rouge, style: "font-size:24px" });
    T(d, xr + 112, 250, "(prix d’un cahier)", { class: "lab petit" });
  })();

  /* ================= 10. choisir sa procédure ================= */
  (function () {
    const P = {
      3: { prix: "2,10",
        mult: ["top", "3 = 6 ÷ 2, donc 3 stylos coûtent 4,20 ÷ 2 = <b>2,10 €</b>.", "Un seul calcul : c’est le plus simple."],
        add: ["non", "Pour additionner, il faut connaître le prix de deux quantités dont la somme fait 3. Ici, on ne connaît que le prix de 6 stylos."],
        unite: ["ok", "1 stylo coûte 4,20 ÷ 6 = 0,70 €, donc 3 stylos coûtent 3 × 0,70 = <b>2,10 €</b>.", "Ça marche, mais il faut deux calculs."] },
      9: { prix: "6,30",
        add: ["top", "9 = 6 + 3, donc 9 stylos coûtent 4,20 + 2,10 = <b>6,30 €</b>.", "On utilise le prix de 3 stylos trouvé juste avant."],
        mult: ["ok", "9 = 3 × 3, donc 9 stylos coûtent 3 × 2,10 = <b>6,30 €</b>.", "Ça marche aussi, en partant du prix de 3 stylos."],
        unite: ["ok", "1 stylo coûte 4,20 ÷ 6 = 0,70 €, donc 9 stylos coûtent 9 × 0,70 = <b>6,30 €</b>.", "Ça marche aussi."] },
      5: { prix: "3,50",
        unite: ["top", "1 stylo coûte 4,20 ÷ 6 = 0,70 €, donc 5 stylos coûtent 5 × 0,70 = <b>3,50 €</b>.", "Ici, passer par l’unité est le plus simple."],
        mult: ["non", "On ne passe pas de 6 (ou de 3) à 5 en multipliant ou en divisant par un nombre entier."],
        add: ["ok", "2 = 6 ÷ 3, donc 2 stylos coûtent 4,20 ÷ 3 = 1,40 €. Puis 5 = 3 + 2, donc 5 stylos coûtent 2,10 + 1,40 = <b>3,50 €</b>.", "Ça marche, mais c’est plus long : on combine deux procédures."] }
    };
    const VERD = { top: "Le plus simple ici", ok: "Ça marche aussi", non: "Pas directement" };
    let n = "3";
    const bn = [...document.querySelectorAll("#proc-n .btn")], bp = [...document.querySelectorAll("#proc-p .btn")], res = $("#proc-res");
    bn.forEach(b => b.addEventListener("click", () => {
      n = b.dataset.n; bn.forEach(x => x.classList.toggle("sel", x === b)); bp.forEach(x => x.classList.remove("sel"));
      res.innerHTML = `<span class="note">Prix de ${n} stylos : quelle procédure choisis-tu ?</span>`;
    }));
    bp.forEach(b => b.addEventListener("click", () => {
      bp.forEach(x => x.classList.toggle("sel", x === b));
      const [v, txt, com] = P[n][b.dataset.p];
      res.innerHTML = `<span class="verdict ${v}">${VERD[v]}</span><p>${txt}</p>${com ? `<p class="note" style="margin-top:10px">${com}</p>` : ""}`;
      if (v !== "non") { const td = document.querySelector(`#proc-tab td[data-n="${n}"]`); if (td.classList.contains("vide")) { td.textContent = P[n].prix; td.classList.remove("vide"); td.classList.add("neuf"); } }
    }));
  })();

  /* ================= 11. échelle graphique ================= */
  (function () {
    const svg = $("#fig-ech"), x0 = 80, u = 160, y = 82;
    for (let k = 0; k < 3; k++) S("rect", { x: x0 + k * u, y, width: u, height: 20, fill: k % 2 ? "#fff" : C.texte, stroke: C.texte, "stroke-width": 2 }, svg);
    for (let k = 0; k <= 3; k++) T(svg, x0 + k * u, y - 22, k === 3 ? "150 m" : String(50 * k), { class: "lab gras" });
    for (let k = 0; k < 3; k++) {
      const a = x0 + k * u + 6, b = x0 + (k + 1) * u - 6;
      S("path", { d: `M${a},120 Q${a},130 ${a + 10},130 L${(a + b) / 2 - 8},130 Q${(a + b) / 2},130 ${(a + b) / 2},140 Q${(a + b) / 2},130 ${(a + b) / 2 + 8},130 L${b - 10},130 Q${b},130 ${b},120`, fill: "none", stroke: C.orange, "stroke-width": 2 }, svg);
      T(svg, (a + b) / 2, 158, "1 cm", { class: "lab", fill: C.orange });
    }
    T(svg, 700, 92, "Chaque carreau", { class: "lab" }); T(svg, 700, 118, "de 1 cm représente", { class: "lab" }); T(svg, 700, 144, "50 m.", { class: "lab gras" });
  })();

  /* ================= 12. carte ================= */
  (function () {
    const svg = $("#fig-carte"), u = 40, ox = 10, oy = 15, NX = 15, NY = 11;
    const villes = [{ nom: "Montclair", x: 2, y: 6 }, { nom: "Rivebelle", x: 9.5, y: 6 }];
    const P = v => [ox + v.x * u, oy + v.y * u];
    let drag = null;
    function render() {
      svg.innerHTML = "";
      S("rect", { x: ox, y: oy, width: NX * u, height: NY * u, fill: "#eef6e8" }, svg);
      S("path", { d: `M${ox},${oy + 90} C160,60 260,190 380,120 S560,40 ${ox + NX * u},70`, fill: "none", stroke: "#8cc4ec", "stroke-width": 14, "stroke-linecap": "round" }, svg);
      for (const [x, y, r] of [[470, 330, 40], [520, 360, 32], [120, 380, 34]]) S("circle", { cx: x, cy: y, r, fill: "#cfe6c2" }, svg);
      for (let i = 0; i <= NX; i++) S("line", { x1: ox + i * u, y1: oy, x2: ox + i * u, y2: oy + NY * u, stroke: "#c8d6e6", "stroke-width": 1 }, svg);
      for (let j = 0; j <= NY; j++) S("line", { x1: ox, y1: oy + j * u, x2: ox + NX * u, y2: oy + j * u, stroke: "#c8d6e6", "stroke-width": 1 }, svg);
      // échelle graphique
      S("rect", { x: ox + 14, y: oy + NY * u - 58, width: 130, height: 46, rx: 8, fill: "#fff", stroke: "#c8d6e6" }, svg);
      S("rect", { x: ox + 30, y: oy + NY * u - 30, width: u, height: 8, fill: C.texte }, svg);
      T(svg, ox + 30, oy + NY * u - 44, "0", { class: "lab petit" }); T(svg, ox + 30 + u, oy + NY * u - 44, "2 km", { class: "lab petit", "text-anchor": "start", x: ox + 26 + u });
      const [a, b] = villes.map(P);
      S("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: C.rouge, "stroke-width": 3, "stroke-dasharray": "8 6" }, svg);
      const d = Math.hypot(villes[0].x - villes[1].x, villes[0].y - villes[1].y);
      const d1 = Math.round(d * 10) / 10, exact = Math.abs(d * 10 - Math.round(d * 10)) < 1e-6;
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      S("rect", { x: mx - 46, y: my - 32, width: 92, height: 28, rx: 7, fill: "#fff", stroke: C.rouge }, svg);
      T(svg, mx, my - 18, (exact ? "" : "≈ ") + nb(d1) + " cm", { class: "lab gras", fill: C.rouge, style: "font-size:17px" });
      villes.forEach((v, i) => {
        const [x, y] = P(v);
        S("circle", { cx: x, cy: y, r: 13, fill: i ? C.violet : C.bleu, stroke: "#fff", "stroke-width": 3, style: "cursor:grab", "data-v": i }, svg);
        T(svg, x, y + 28, v.nom, { class: "lab gras", style: "font-size:17px;paint-order:stroke;stroke:#fff;stroke-width:4px" });
      });
      const km = d1 * 2, env = exact ? "" : "≈ ";
      $("#carte-lec").innerHTML = `<span style="white-space:nowrap">Sur la carte : <b class="c-rouge">${env}${nb(d1)} cm</b></span> → <span style="white-space:nowrap">dans la réalité : <b class="c-vert">${env}${nb(d1)} × 2 = ${nb(km)} km</b></span>`;
    }
    function pt(ev) { const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
    svg.addEventListener("pointerdown", e => {
      const q = pt(e); let best = -1, dm = 30;
      villes.forEach((v, i) => { const [x, y] = P(v), dd = Math.hypot(q.x - x, q.y - y); if (dd < dm) { dm = dd; best = i; } });
      if (best >= 0) { drag = best; svg.setPointerCapture(e.pointerId); }
    });
    svg.addEventListener("pointermove", e => {
      if (drag == null) return;
      const q = pt(e), v = villes[drag];
      v.x = Math.max(0.5, Math.min(NX - 0.5, Math.round((q.x - ox) / u * 2) / 2));
      v.y = Math.max(0.5, Math.min(NY - 0.5, Math.round((q.y - oy) / u * 2) / 2));
      render();
    });
    svg.addEventListener("pointerup", () => drag = null);
    render();
  })();

  Diapo.demarrer();
})();
