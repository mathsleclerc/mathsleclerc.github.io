/* Cours interactif — Les nombres décimaux (6e) : figures et activités
   Les nombres sont manipulés en millièmes (entiers) pour éviter les erreurs d'arrondi. */
(function () {
  const { S, T, nb } = Diapo;
  const $ = s => document.querySelector(s);
  const C = { bleu: "#1f5fa8", vert: "#2e8b57", orange: "#d9822b", violet: "#6b5bb5", rouge: "#c4302b", jaune: "#d9a400", gris: "#8796aa", texte: "#1c2430", fonce: "#174a84", clair: "#e8f0fa" };
  const alea = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const choisir = t => t[Math.floor(Math.random() * t.length)];
  const melanger = t => { t = t.slice(); for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [t[i], t[j]] = [t[j], t[i]]; } return t; };
  function retour(el, classe, html) { el.className = "retour" + (classe ? " " + classe : ""); el.innerHTML = html; }
  /* m millièmes → écriture française sans zéro inutile : 7384 → "7,384", 7500 → "7,5" */
  const ecr = m => { const neg = m < 0; m = Math.abs(m); const e = Math.floor(m / 1000), d = String(m % 1000).padStart(3, "0").replace(/0+$/, ""); return (neg ? "−" : "") + e + (d ? "," + d : ""); };
  /* lecture d'une saisie → millièmes (ou NaN) */
  const lire = s => { s = String(s).trim().replace(/\s/g, "").replace(",", "."); if (!/^\d+(\.\d{0,3})?$/.test(s)) return NaN; return Math.round(parseFloat(s) * 1000); };
  function svgPt(svg, ev) { const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
  function glisser(svg, f) {
    let drag = false;
    svg.addEventListener("pointerdown", e => { e.stopPropagation(); drag = true; svg.setPointerCapture(e.pointerId); f(svgPt(svg, e)); });
    svg.addEventListener("pointermove", e => { if (drag) f(svgPt(svg, e)); });
    svg.addEventListener("pointerup", () => drag = false);
  }
  const fracH = (n, d) => `<span class="frac"><span>${n}</span><span>${d}</span></span>`;

  /* ---------- droite graduée générique (valeurs en millièmes) ---------- */
  function droite(g, o) {
    // o : {x0, x1, y, deb, fin, pas, lab (pas des étiquettes), taille}
    const X = m => o.x0 + (m - o.deb) / (o.fin - o.deb) * (o.x1 - o.x0);
    S("line", { x1: o.x0 - 20, y1: o.y, x2: o.x1 + 30, y2: o.y, class: "ln" }, g);
    S("path", { d: `M${o.x1 + 22},${o.y - 7} L${o.x1 + 32},${o.y} L${o.x1 + 22},${o.y + 7}`, fill: "none", stroke: C.texte, "stroke-width": 2.5 }, g);
    for (let m = o.deb; m <= o.fin; m += o.pas) {
      const grand = (m - o.deb) % o.lab === 0, moyen = !grand && o.mi && (m - o.deb) % o.mi === 0;
      const h = grand ? 16 : moyen ? 11 : 7;
      S("line", { x1: X(m), y1: o.y - h, x2: X(m), y2: o.y + h, stroke: C.texte, "stroke-width": grand ? 2.5 : 1.6 }, g);
      if (grand) T(g, X(m), o.y + 34, ecr(m), { class: "lab gras", style: `font-size:${o.taille || 22}px` });
    }
    return X;
  }
  function point(g, x, y, nom, coul, attrs = {}) {
    const grp = S("g", attrs, g);
    S("path", { d: `M${x - 8},${y - 8} L${x + 8},${y + 8} M${x + 8},${y - 8} L${x - 8},${y + 8}`, stroke: coul, "stroke-width": 3.5 }, grp);
    if (nom) T(grp, x, y - 26, nom, { class: "lab gras", fill: coul, style: "font-size:22px" });
    return grp;
  }

  /* ================= titre ================= */
  (function () {
    const svg = $("#fig-titre");
    T(svg, 130, 150, "4,32", { fill: "#ffd65c", style: "font-size:84px;font-weight:700" });
    T(svg, 360, 150, "4,5", { fill: "#9cc8ff", style: "font-size:84px;font-weight:700" });
    T(svg, 245, 150, "?", { fill: "#fff", style: "font-size:70px;font-weight:700" });
    T(svg, 130, 230, "32 > 5…", { fill: "rgba(255,255,255,.75)", style: "font-size:30px;font-style:italic" });
    T(svg, 360, 230, "…et alors ?", { fill: "rgba(255,255,255,.75)", style: "font-size:30px;font-style:italic" });
  })();

  /* ---------- carré de 100 (colorier n centièmes) ---------- */
  function carre100(svg, x0, y0, c, surChange) {
    let n = 0;
    function dessiner() {
      svg.innerHTML = "";
      for (let col = 0; col < 10; col++) for (let li = 0; li < 10; li++) {
        const k = col * 10 + li, on = k < n;
        const r = S("rect", { x: x0 + col * c, y: y0 + li * c, width: c, height: c, fill: on ? (col % 2 ? "#7fb0e6" : "#5b97da") : "#fff", stroke: "#b8c6d8", "stroke-width": 1, style: "cursor:pointer" }, svg);
        r.dataset.k = k;
      }
      for (let col = 0; col <= 10; col++) S("line", { x1: x0 + col * c, y1: y0, x2: x0 + col * c, y2: y0 + 10 * c, stroke: C.fonce, "stroke-width": col % 10 ? 2 : 3.5 }, svg);
      S("line", { x1: x0, y1: y0, x2: x0 + 10 * c, y2: y0, stroke: C.fonce, "stroke-width": 3.5 }, svg);
      S("line", { x1: x0, y1: y0 + 10 * c, x2: x0 + 10 * c, y2: y0 + 10 * c, stroke: C.fonce, "stroke-width": 3.5 }, svg);
      surChange(n);
    }
    glisser(svg, q => {
      const col = Math.floor((q.x - x0) / c), li = Math.floor((q.y - y0) / c);
      if (col < 0 || col > 9 || li < 0 || li > 9) return;
      const k = col * 10 + li + 1;
      if (k !== n) { n = k; dessiner(); }
    });
    svg.addEventListener("dblclick", () => { n = 0; dessiner(); });
    dessiner();
    return { val: () => n, poser(v) { n = v; dessiner(); } };
  }

  /* ================= unités de numération ================= */
  (function () {
    const svg = $("#fig-unites");
    carre100(svg, 110, 25, 40, n => {
      T(svg, 310, 455, "le carré entier : 1 unité · une colonne : 1 dixième · un petit carré : 1 centième", { class: "lab petit", style: "font-size:14px" });
      const d = Math.floor(n / 10), c = n % 10;
      $("#unites-lec").innerHTML = n === 0 ? `<span class="note">Clique dans le carré pour colorier.</span>`
        : n === 100 ? `100 centièmes = 10 dixièmes = <b>1 unité</b>`
        : `${n} centième${n > 1 ? "s" : ""} = <b class="c-bleu">${ecr(n * 10)}</b> = ${d} dixième${d > 1 ? "s" : ""} et ${c} centième${c > 1 ? "s" : ""}`;
    }).poser(37);
  })();

  /* ================= valeur de chaque chiffre ================= */
  (function () {
    const RANGS = [["centaines", "100"], ["dizaines", "10"], ["unités", "1"], ["dixièmes", "0,1"], ["centièmes", "0,01"], ["millièmes", "0,001"]];
    const VAL = [100000, 10000, 1000, 100, 10, 1]; // en millièmes
    let chiffres;
    function nouveau() {
      const nEnt = alea(1, 3), ent = [], dec = [];
      for (let i = 0; i < nEnt; i++) ent.push(i === 0 ? alea(1, 9) : alea(0, 9));
      dec.push(alea(0, 9), alea(0, 9), alea(1, 9));
      if (Math.random() < .5) dec[alea(0, 1)] = 0; // un zéro « au milieu »
      chiffres = [...Array(3 - nEnt).fill(null), ...ent, ...dec];
      const span = (d, i) => `<span class="c" data-i="${i}">${d}</span>`;
      $("#ch-nombre").innerHTML = chiffres.map((d, i) => d === null ? "" : span(d, i) + (i === 2 ? "<span>,</span>" : "")).join("");
      document.querySelectorAll("#ch-table tr:last-child td").forEach((td, i) => { td.textContent = chiffres[i] === null ? "" : chiffres[i]; td.classList.remove("actif"); });
      document.querySelectorAll("#ch-nombre .c").forEach(s => s.addEventListener("click", e => { e.stopPropagation(); montrer(+s.dataset.i); }));
      const termes = chiffres.map((d, i) => d ? `${d} × ${RANGS[i][1]}` : null).filter(Boolean);
      const total = chiffres.reduce((s, d, i) => s + (d || 0) * VAL[i], 0);
      $("#ch-dec").innerHTML = `<b>Décomposition :</b> ${ecr(total)} = ${termes.join(" + ")}`;
      retour($("#ch-ret"), "", "Clique sur un chiffre.");
    }
    function montrer(i) {
      document.querySelectorAll("#ch-nombre .c").forEach(s => s.classList.toggle("actif", +s.dataset.i === i));
      document.querySelectorAll("#ch-table tr td").forEach((td, k) => td.classList.toggle("actif", k === i));
      document.querySelectorAll("#ch-table th").forEach((th, k) => th.classList.toggle("actif", k === i));
      const d = chiffres[i], [rang, u] = RANGS[i];
      retour($("#ch-ret"), "ok", `Le ${d} est le chiffre des <b>${rang}</b> : il vaut ${d} × ${u} = <b>${ecr(d * VAL[i])}</b>.${d === 0 ? " Ce zéro est utile : il marque qu’il n’y a aucun" + (i < 3 ? "e " : " ") + rang.replace(/s$/, "") + "." : ""}`);
    }
    $("#ch-new").addEventListener("click", nouveau);
    nouveau();
  })();

  /* ================= zéros inutiles : vrai ou faux ================= */
  (function () {
    const Q = [
      ["7,50", "7,5", true, "Le 0 est à la fin de la partie décimale : il est inutile."],
      ["07,3", "7,3", true, "Le 0 est au début de la partie entière : il est inutile."],
      ["7,05", "7,5", false, "7,05 a 0 dixième et 5 centièmes, 7,5 a 5 dixièmes : ce zéro au milieu est utile."],
      ["12", "12,00", true, "12 = 12,0 = 12,00 : on peut écrire des zéros après la virgule."],
      ["3,40", "3,4", true, "Le 0 est à la fin de la partie décimale : il est inutile."],
      ["5,060", "5,6", false, "5,060 = 5,06 : 0 dixième et 6 centièmes. 5,6 a 6 dixièmes."],
      ["10,2", "1,02", false, "Le 0 de 10 est le chiffre des unités : il est utile (10 n’est pas 1)."],
      ["0,90", "0,9", true, "Le 0 est à la fin de la partie décimale : il est inutile."],
      ["2,007", "2,07", false, "2,007 a 7 millièmes, 2,07 a 7 centièmes : le zéro du milieu est utile."]
    ];
    let liste = melanger(Q), i = 0, score = 0, faits = 0, fini = false;
    const btns = [...document.querySelectorAll("#s-zeros .vf .btn")];
    function afficher() {
      const q = liste[i]; fini = false;
      $("#z-egal").textContent = `${q[0]} = ${q[1]}`;
      btns.forEach(b => { b.disabled = false; b.classList.remove("bon", "mauvais"); });
      retour($("#z-ret"), "", "Ces deux écritures désignent-elles le même nombre ?");
    }
    btns.forEach(b => b.addEventListener("click", () => {
      if (fini) return; fini = true; faits++;
      const q = liste[i], rep = b.dataset.r === "1", ok = rep === q[2]; if (ok) score++;
      btns.forEach(x => { x.disabled = true; if ((x.dataset.r === "1") === q[2]) x.classList.add("bon"); });
      if (!ok) b.classList.add("mauvais");
      retour($("#z-ret"), ok ? "ok" : "ko", `<b>${q[2] ? "Vrai" : "Faux"}.</b> ${q[3]}`);
      $("#z-score").textContent = `Bonnes réponses : ${score} sur ${faits}`;
    }));
    $("#z-new").addEventListener("click", () => { i = (i + 1) % liste.length; if (i === 0) liste = melanger(Q); afficher(); });
    afficher();
  })();

  /* ================= change d'écriture (fraction décimale ↔ écriture à virgule) ================= */
  (function () {
    let m, d, mode, score = 0, faits = 0;
    const q = $("#fj-q"), res = $("#fj-ret");
    const P10 = [1, 10, 100, 1000];
    function nouveau() {
      d = alea(1, 3); const ent = alea(0, 25), dec = alea(1, P10[d] - 1);
      const decM = dec * (1000 / P10[d]); if (decM % (1000 / P10[d - 1] || 1) === 0 && d > 1) return nouveau(); // le dernier chiffre n'est pas 0
      m = ent * 1000 + decM; mode = Math.random() < .5 ? "frac" : "virg";
      const num = m / (1000 / P10[d]);
      if (mode === "frac") {
        $("#fj-consigne").textContent = "Écris ce nombre sous la forme d’une fraction décimale.";
        q.innerHTML = `<span>${ecr(m)} =</span><span class="frac" style="font-size:.8em"><span><input class="champ" id="fj-n" inputmode="numeric" autocomplete="off" aria-label="Numérateur"></span><span><input class="champ" id="fj-d" inputmode="numeric" autocomplete="off" aria-label="Dénominateur"></span></span>`;
      } else {
        $("#fj-consigne").textContent = "Écris cette fraction décimale avec une virgule.";
        q.innerHTML = `<span class="frac" style="font-size:.8em"><span>${num.toLocaleString("fr-FR")}</span><span>${P10[d].toLocaleString("fr-FR")}</span></span><span>=</span><input class="champ" id="fj-v" inputmode="decimal" autocomplete="off" aria-label="Écriture à virgule">`;
      }
      q.querySelectorAll("input").forEach(i => i.addEventListener("keydown", e => { if (e.key === "Enter") verifier(); e.stopPropagation(); }));
      retour(res, "", "");
    }
    function verifier() {
      const num = m / (1000 / P10[d]);
      let ok, msg;
      if (mode === "frac") {
        const n = parseInt($("#fj-n").value.replace(/\s/g, ""), 10), den = parseInt($("#fj-d").value.replace(/\s/g, ""), 10);
        if (isNaN(n) || isNaN(den)) return;
        const puiss = [10, 100, 1000, 10000].includes(den);
        ok = puiss && n * 1000 === m * den;
        msg = ok ? (n === num ? `<b>Bravo !</b> ${ecr(m)} = ${fracH(num.toLocaleString("fr-FR"), P10[d].toLocaleString("fr-FR"))}` : `<b>Juste</b>, c’est bien une fraction décimale égale à ${ecr(m)}. La méthode donne directement ${fracH(num.toLocaleString("fr-FR"), P10[d].toLocaleString("fr-FR"))}.`)
          : !puiss ? "Le dénominateur d’une fraction décimale est 10, 100, 1 000…" : `Pas tout à fait. Le dernier chiffre est celui des ${["", "dixièmes", "centièmes", "millièmes"][d]} : le dénominateur est ${P10[d].toLocaleString("fr-FR")}.`;
      } else {
        const v = lire($("#fj-v").value); if (isNaN(v)) return;
        ok = v === m;
        msg = ok ? `<b>Bravo !</b> ${fracH(num.toLocaleString("fr-FR"), P10[d].toLocaleString("fr-FR"))} = ${ecr(m)}` : `Pas tout à fait : le dénominateur ${P10[d].toLocaleString("fr-FR")} indique ${d} chiffre${d > 1 ? "s" : ""} après la virgule.`;
      }
      faits++; if (ok) score++;
      retour(res, ok ? "ok" : "ko", msg);
      $("#fj-score").textContent = `Bonnes réponses : ${score} sur ${faits}`;
    }
    $("#fj-ok").addEventListener("click", verifier);
    $("#fj-voir").addEventListener("click", () => { const num = m / (1000 / P10[d]); retour(res, "", `${ecr(m)} = ${fracH(num.toLocaleString("fr-FR"), P10[d].toLocaleString("fr-FR"))} : le dernier chiffre est celui des ${["", "dixièmes", "centièmes", "millièmes"][d]}.`); });
    $("#fj-new").addEventListener("click", nouveau);
    nouveau();
  })();

  /* ================= nombre mixte : barres ================= */
  (function () {
    const svg = $("#fig-mixte"), sl = $("#mx-n");
    let d = 2;
    function dessiner() {
      const n = +sl.value, q = Math.floor(n / d), r = n % d, unites = Math.ceil(n / d);
      svg.innerHTML = "";
      const h = Math.min(34, 360 / Math.max(unites, 1) - 6), W = 480, x0 = 90;
      for (let u = 0; u < unites; u++) {
        const y = 20 + u * (h + 6);
        T(svg, 50, y + h / 2, "1 unité", { class: "lab petit", style: "font-size:13px" });
        for (let k = 0; k < d; k++) {
          const idx = u * d + k, on = idx < n;
          S("rect", { x: x0 + k * W / d, y, width: W / d, height: h, fill: on ? (u < q ? "#5b97da" : C.orange) : "#fff", stroke: C.fonce, "stroke-width": 1.5 }, svg);
        }
      }
      const dec = n * 1000 / d;
      $("#mx-lec").innerHTML = r === 0 ? `${fracH(n, d)} = <b>${q}</b>` : `${fracH(n, d)} = ${q} + ${fracH(r, d)} = <b class="c-bleu">${ecr(dec)}</b>`;
    }
    sl.addEventListener("input", dessiner);
    document.querySelectorAll("#mx-d .btn").forEach(b => b.addEventListener("click", () => { d = +b.dataset.d; document.querySelectorAll("#mx-d .btn").forEach(x => x.classList.toggle("sel", x === b)); dessiner(); }));
    dessiner();
  })();

  /* ================= le carré de 100 : pourcentages ================= */
  (function () {
    const svg = $("#fig-grille");
    const DEFIS = [() => { const p = 5 * alea(1, 19); return [p, `Colorie <b>${p} %</b> du carré.`]; },
      () => { const p = 10 * alea(1, 9); return [p, `Colorie <b>${ecr(p * 10)}</b> du carré (le carré entier vaut 1).`]; },
      () => { const [n, dd, p] = choisir([[1, 2, 50], [1, 4, 25], [3, 4, 75], [1, 5, 20], [1, 10, 10], [2, 5, 40]]); return [p, `Colorie les ${fracH(n, dd)} du carré.`]; },
      () => { const p = alea(11, 89); return [p, `Colorie <b>${ecr(p * 10)}</b> du carré (le carré entier vaut 1).`]; }];
    let cible;
    const grille = carre100(svg, 110, 30, 40, n => {
      $("#gr-lec").innerHTML = `${n} % = ${fracH(n, 100)} = <b class="c-bleu">${ecr(n * 10)}</b>`;
    });
    function nouveau() { const [p, txt] = choisir(DEFIS)(); cible = p; $("#gr-consigne").innerHTML = txt; grille.poser(0); retour($("#gr-ret"), "", ""); }
    $("#gr-ok").addEventListener("click", () => {
      const n = grille.val();
      retour($("#gr-ret"), n === cible ? "ok" : "ko", n === cible ? `<b>Bravo !</b> ${cible} petits carrés sur 100 : ${cible} % = ${ecr(cible * 10)}.` : `Tu as colorié ${n} petits carrés. Il en faut ${cible < n ? "moins" : "plus"}.`);
    });
    $("#gr-new").addEventListener("click", nouveau);
    nouveau();
  })();

  /* ================= demi-droite graduée : exemple du cours ================= */
  (function () {
    const svg = $("#fig-droite");
    const X = droite(svg, { x0: 80, x1: 1080, y: 110, deb: 0, fin: 2000, pas: 100, lab: 1000 });
    point(svg, X(600), 110, "A", C.bleu); point(svg, X(1400), 110, "B", C.bleu);
    point(svg, X(1750), 110, "C", C.vert, { "data-step": 4 });
    point(svg, X(300), 110, "D", C.vert, { "data-step": 4 });
  })();

  /* ================= à toi : lire et placer sur une demi-droite ================= */
  (function () {
    const svg = $("#fig-dj"), res = $("#dj-ret");
    const CONF = [{ deb: 0, fin: 2000, pas: 100, lab: 1000, demi: true }, { deb: 3000, fin: 5000, pas: 100, lab: 1000 }, { deb: 1200, fin: 1400, pas: 10, lab: 100 }, { deb: 0, fin: 1000, pas: 50, lab: 500, mi: 100 }];
    let cf, mode, cible, pos, X, score = 0, faits = 0;
    function dessiner() {
      svg.innerHTML = "";
      X = droite(svg, { x0: 90, x1: 1090, y: 120, deb: cf.deb, fin: cf.fin, pas: cf.pas, lab: cf.lab, mi: cf.mi });
      if (mode === "lire") point(svg, X(cible), 120, "A", C.bleu);
      else if (pos != null) point(svg, X(pos), 120, "A", C.violet);
    }
    function nouveau() {
      cf = choisir(CONF); mode = Math.random() < .5 ? "lire" : "placer";
      const pasCible = mode === "placer" && cf.demi ? cf.pas / 2 : cf.pas, n = (cf.fin - cf.deb) / pasCible;
      do { cible = cf.deb + pasCible * alea(1, n - 1); } while ((cible - cf.deb) % cf.lab === 0);
      pos = null;
      $("#dj-titre").textContent = mode === "lire" ? "Lis l’abscisse du point A" : "Place le point A";
      $("#dj-consigne").innerHTML = mode === "lire" ? "Quelle est l’abscisse du point A ? Commence par trouver le pas." : `Clique sur la demi-droite pour placer le point <b>A(${ecr(cible)})</b>.`;
      $("#dj-saisie").innerHTML = mode === "lire" ? `A( <input class="champ" id="dj-v" inputmode="decimal" autocomplete="off" aria-label="Abscisse de A"> )` : "";
      const v = $("#dj-v"); if (v) v.addEventListener("keydown", e => { if (e.key === "Enter") verifier(); e.stopPropagation(); });
      retour(res, "", ""); dessiner();
    }
    glisser(svg, q => {
      if (mode !== "placer") return;
      const pasP = cf.demi ? cf.pas / 2 : cf.pas;
      const m = cf.deb + Math.round(((q.x - 90) / 1000 * (cf.fin - cf.deb)) / pasP) * pasP;
      pos = Math.max(cf.deb, Math.min(cf.fin, m)); dessiner();
    });
    function verifier() {
      let ok;
      if (mode === "lire") { const v = lire($("#dj-v").value); if (isNaN(v)) return; ok = v === cible; }
      else { if (pos == null) return; ok = pos === cible; }
      faits++; if (ok) score++;
      retour(res, ok ? "ok" : "ko", ok ? `<b>Bravo !</b> Le pas est ${ecr(cf.pas)}, et A a pour abscisse ${ecr(cible)}.`
        : `Pas tout à fait. Entre deux nombres écrits, il y a ${cf.lab / cf.pas} intervalles : le pas est <b>${ecr(cf.pas)}</b>.${mode === "placer" ? " Tu as placé A en " + ecr(pos) + "." : ""}`);
      $("#dj-score").textContent = `Bonnes réponses : ${score} sur ${faits}`;
    }
    $("#dj-ok").addEventListener("click", verifier);
    $("#dj-voir").addEventListener("click", () => { if (mode === "placer") { pos = cible; dessiner(); } retour(res, "", `Le pas est ${ecr(cf.pas)} : A(${ecr(cible)}).`); });
    $("#dj-new").addEventListener("click", nouveau);
    nouveau();
  })();

  /* ================= à toi : <, > ou = ================= */
  (function () {
    let a, b, fini, score = 0, faits = 0, prec = -1;
    const st = (m, d) => { const e = Math.floor(m / 1000), r = String(m % 1000).padStart(3, "0").slice(0, d); return d ? e + "," + r : String(e); };
    function genere() {
      let t; do { t = alea(0, 4); } while (t === prec); prec = t;
      const n = alea(1, 20);
      if (t === 0) { const dd = alea(2, 8), e = alea(1, dd - 1), f = alea(1, 9); return [[n * 1000 + dd * 100, 1], [n * 1000 + e * 100 + f * 10, 2]]; }
      if (t === 1) { const c = alea(1, 9), dd = alea(1, 8); return [[n * 1000 + c * 10, 2], [n * 1000 + dd * 100, 1]]; }
      if (t === 2) { const dd = alea(1, 9), f = alea(1, 9); return [[n * 1000 + dd * 100, 1], [n * 1000 + dd * 100 + f, 3]]; }
      if (t === 3) { const n2 = n + alea(1, 9); return [[n2 * 1000 + alea(1, 9) * 100, 1], [n * 1000 + alea(11, 99) * 10, 2]]; }
      const dd = alea(1, 9); return [[n * 1000 + dd * 100, 2], [n * 1000 + dd * 100, 1]];
    }
    function nouveau() {
      [a, b] = melanger(genere()); fini = false;
      $("#du-a").textContent = st(...a); $("#du-b").textContent = st(...b); $("#du-sig").textContent = "?";
      $("#du-al").innerHTML = ""; retour($("#du-ret"), "", "Choisis le bon signe.");
    }
    document.querySelectorAll("#s-duel .signes .btn").forEach(btn => btn.addEventListener("click", () => {
      if (fini) return; fini = true; faits++;
      const bon = a[0] < b[0] ? "<" : a[0] > b[0] ? ">" : "=", ok = btn.dataset.s === bon; if (ok) score++;
      $("#du-sig").textContent = bon;
      // alignement avec les zéros inutiles ajoutés
      const dmax = Math.max(a[1], b[1], 1), sa = st(a[0], dmax), sb = st(b[0], dmax), L = Math.max(sa.length, sb.length);
      const pa = sa.padStart(L, " "), pb = sb.padStart(L, " ");
      let k = 0; while (k < L && pa[k] === pb[k]) k++;
      const marque = s => k < L ? s.slice(0, k) + "<b>" + s[k] + "</b>" + s.slice(k + 1) : s;
      $("#du-al").innerHTML = marque(pa) + "\n" + marque(pb);
      const pe = Math.floor(a[0] / 1000) !== Math.floor(b[0] / 1000);
      const expl = bon === "=" ? "Ce sont les mêmes nombres : un zéro à la fin de la partie décimale est inutile."
        : pe ? "Les parties entières sont différentes : on les compare d’abord."
        : "Mêmes parties entières : on compare rang par rang, après avoir ajouté des zéros pour avoir autant de chiffres après la virgule.";
      retour($("#du-ret"), ok ? "ok" : "ko", `<b>${ok ? "Bravo !" : "Pas tout à fait."}</b> ${st(...a)} ${bon} ${st(...b)}. ${expl}`);
      $("#du-score").textContent = `Bonnes réponses : ${score} sur ${faits}`;
    }));
    $("#du-new").addEventListener("click", nouveau);
    nouveau();
  })();

  /* ================= ranger ================= */
  (function () {
    let nombres, restants, croissant, choisis;
    function nouveau() {
      let n, a; do { n = alea(2, 8); a = alea(1, 8); } while (a === n);
      const set = new Set([n * 1000 + a * 100, n * 1000 + a * 10, n * 1000 + a * 110, a * 1000 + n * 100, n * 1000 + a * 100 + a]);
      nombres = [...set]; croissant = Math.random() < .6;
      zero();
    }
    function zero() {
      restants = melanger(nombres); choisis = [];
      $("#rg-consigne").innerHTML = `Clique sur les nombres dans l’ordre <b>${croissant ? "croissant (du plus petit au plus grand)" : "décroissant (du plus grand au plus petit)"}</b>.`;
      dessiner(); retour($("#rg-ret"), "", "");
    }
    function dessiner() {
      const p = $("#rg-pioche"); p.innerHTML = "";
      restants.forEach(m => { const b = document.createElement("button"); b.className = "btn"; b.textContent = ecr(m); b.addEventListener("click", () => clic(m, b)); p.appendChild(b); });
      $("#rg-rangee").innerHTML = choisis.map(ecr).join(croissant ? " &lt; " : " &gt; ") || `<span class="note">ton rangement apparaîtra ici</span>`;
    }
    function clic(m, b) {
      const att = croissant ? Math.min(...restants) : Math.max(...restants);
      if (m !== att) {
        b.classList.remove("secoue"); void b.offsetWidth; b.classList.add("secoue");
        retour($("#rg-ret"), "ko", `Non : ${ecr(att)} est ${croissant ? "plus petit" : "plus grand"} que ${ecr(m)}. Compare d’abord les parties entières, puis rang par rang.`);
        return;
      }
      restants = restants.filter(x => x !== m); choisis.push(m); dessiner();
      retour($("#rg-ret"), restants.length ? "" : "ok", restants.length ? "" : "<b>Bravo !</b> Les nombres sont bien rangés.");
    }
    $("#rg-zero").addEventListener("click", zero);
    $("#rg-new").addEventListener("click", nouveau);
    // la série du cours d'abord
    nombres = [5300, 5030, 5330, 3500, 5303]; croissant = true; zero();
  })();

  /* ================= encadrer : la loupe ================= */
  (function () {
    const svg = $("#fig-loupe");
    let v = 7384, niv = 0;
    const PREC = ["à l’unité", "au dixième", "au centième"], Q = [1000, 100, 10];
    function dessiner() {
      svg.innerHTML = "";
      const q = Q[niv], bas = Math.floor(v / q) * q, haut = bas + q;
      const X = droite(svg, { x0: 60, x1: 560, y: 190, deb: bas, fin: haut, pas: q / 10, lab: q, taille: 24 });
      for (let k = 1; k < 10; k++) T(svg, X(bas + k * q / 10), 225, ecr(bas + k * q / 10), { class: "lab petit", style: "font-size:12px" });
      point(svg, X(v), 190, ecr(v), C.rouge);
      S("path", { d: `M60,100 L560,100`, stroke: "none" }, svg);
      T(svg, 310, 40, `Zoom : ${["de 1 en 1", "de 0,1 en 0,1", "de 0,01 en 0,01"][niv]}`, { class: "lab petit", style: "font-size:15px" });
      $("#lp-lec").innerHTML = `${PREC[niv]} : <b class="c-bleu">${ecr(bas)}</b> &lt; ${ecr(v)} &lt; <b class="c-orange">${ecr(haut)}</b>`;
      $("#lp-moins").disabled = niv === 0; $("#lp-plus").disabled = niv === 2;
    }
    $("#lp-plus").addEventListener("click", () => { if (niv < 2) { niv++; dessiner(); } });
    $("#lp-moins").addEventListener("click", () => { if (niv > 0) { niv--; dessiner(); } });
    $("#lp-autre").addEventListener("click", () => { v = alea(1, 29) * 1000 + alea(1, 9) * 100 + alea(1, 9) * 10 + alea(1, 9); niv = 0; dessiner(); });
    dessiner();
  })();

  /* ================= intercaler ================= */
  (function () {
    const svg = $("#fig-inter");
    let m = 2450;
    function dessiner() {
      svg.innerHTML = "";
      const X = droite(svg, { x0: 90, x1: 1090, y: 120, deb: 2400, fin: 2500, pas: 10, lab: 100 });
      point(svg, X(m), 120, ecr(m), C.violet);
      T(svg, 590, 40, `2,40 < ${ecr(m)} < 2,50`, { class: "lab gras", fill: C.violet, style: "font-size:26px" });
    }
    glisser(svg, q => { m = Math.max(2401, Math.min(2499, 2400 + Math.round((q.x - 90) / 1000 * 100))); dessiner(); });
    dessiner();
  })();

  /* ================= arrondir : figure du cours ================= */
  (function () {
    const svg = $("#fig-arr");
    const X = droite(svg, { x0: 60, x1: 560, y: 170, deb: 7300, fin: 7400, pas: 10, lab: 100, taille: 24 });
    S("line", { x1: X(7350), y1: 120, x2: X(7350), y2: 215, stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "6 5" }, svg);
    T(svg, X(7350), 238, "7,35 : le milieu", { class: "lab petit", style: "font-size:14px" });
    point(svg, X(7384), 170, "7,384", C.rouge);
    S("path", { d: `M${X(7384)},135 C${X(7392)},110 ${X(7400) - 6},110 ${X(7400)},140`, fill: "none", stroke: C.vert, "stroke-width": 3 }, svg);
    T(svg, X(7392) + 30, 95, "plus proche", { class: "lab gras", fill: C.vert, style: "font-size:16px" });
  })();

  /* ================= à toi : arrondir ================= */
  (function () {
    const svg = $("#fig-aj"), res = $("#aj-ret"), inp = $("#aj-rep");
    const RANG = [["à l’unité", 1000, "dixièmes"], ["au dixième", 100, "centièmes"], ["au centième", 10, "millièmes"]];
    let v, r, def, exc, arr, score = 0, faits = 0;
    function figure(montrer) {
      svg.innerHTML = "";
      if (!montrer) return;
      const q = RANG[r][1], X = droite(svg, { x0: 60, x1: 560, y: 170, deb: def, fin: exc, pas: q / 10, lab: q, taille: 24 });
      S("line", { x1: X(def + q / 2), y1: 120, x2: X(def + q / 2), y2: 215, stroke: C.gris, "stroke-width": 2, "stroke-dasharray": "6 5" }, svg);
      T(svg, X(def + q / 2), 238, "le milieu", { class: "lab petit", style: "font-size:14px" });
      point(svg, X(v), 170, ecr(v), C.rouge);
    }
    function nouveau() {
      v = alea(0, 39) * 1000 + alea(0, 9) * 100 + alea(0, 9) * 10 + alea(1, 9); r = alea(0, 2);
      const q = RANG[r][1]; def = Math.floor(v / q) * q; exc = def + q;
      const suiv = Math.floor((v % q) / (q / 10)); arr = suiv >= 5 ? exc : def;
      $("#aj-consigne").innerHTML = `Arrondis <b>${ecr(v)}</b> ${RANG[r][0]}.`;
      inp.value = ""; retour(res, "", ""); figure(false); $("#aj-aide").textContent = "La droite graduée apparaît avec la correction.";
    }
    function ecrArr() { const d = [0, 1, 2][r]; const e = Math.floor(arr / 1000), f = String(arr % 1000).padStart(3, "0").slice(0, d); return d ? e + "," + f : String(e); }
    function verifier() {
      const x = lire(inp.value); if (isNaN(x)) return;
      faits++; const ok = x === arr; if (ok) score++;
      const q = RANG[r][1], suiv = Math.floor((v % q) / (q / 10));
      retour(res, ok ? "ok" : "ko", (ok ? "<b>Bravo !</b> " : "Pas tout à fait. ") + `${ecr(def)} &lt; ${ecr(v)} &lt; ${ecr(exc)}. Le chiffre des ${RANG[r][2]} est ${suiv} : ${suiv >= 5 ? "on prend la valeur par excès" : "on garde la valeur par défaut"}. L’arrondi ${RANG[r][0]} est <b>${ecrArr()}</b>.`);
      $("#aj-score").textContent = `Bonnes réponses : ${score} sur ${faits}`;
      figure(true); $("#aj-aide").textContent = "Le nombre est plus proche de son arrondi.";
    }
    $("#aj-ok").addEventListener("click", verifier);
    inp.addEventListener("keydown", e => { if (e.key === "Enter") verifier(); e.stopPropagation(); });
    $("#aj-voir").addEventListener("click", () => { inp.value = ecrArr(); retour(res, "", `L’arrondi de ${ecr(v)} ${RANG[r][0]} est <b>${ecrArr()}</b>.`); figure(true); });
    $("#aj-new").addEventListener("click", nouveau);
    nouveau();
  })();

  Diapo.demarrer();
})();
