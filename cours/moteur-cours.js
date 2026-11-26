/* =====================================================================
   COURS INTERACTIFS — moteur commun
   - Chaque <section class="slide"> est une diapo 1280×720 (mise à l'échelle).
   - data-step="k"   : l'élément apparaît à l'étape k (et reste ensuite).
   - data-until="k"  : l'élément disparaît à l'étape k.
   - <input class="trou" data-rep="6" data-rev="k"> : case à compléter.
       L'élève peut taper sa réponse (Entrée pour vérifier) ;
       à l'étape k, la bonne réponse s'affiche.
   - Diapo.surEtape(idDiapo, fn) : fn(etape) est appelée à chaque changement.
   Clavier : → / Espace étape suivante, ← précédente, P stylo, X effacer,
             F plein écran, B écran noir, S sommaire, H aide.
   ===================================================================== */
(function () {
  const $ = s => document.querySelector(s);
  const NS = "http://www.w3.org/2000/svg";

  /* ---------- petits outils SVG, partagés avec les figures ---------- */
  function S(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function T(parent, x, y, txt, attrs = {}) {
    const a = { x, y, class: "lab", "text-anchor": "middle", ...attrs };
    if (a.fill) { a.style = "fill:" + a.fill + ";" + (a.style || ""); delete a.fill; } // le style passe avant la feuille CSS
    const t = S("text", a, parent); t.textContent = txt; return t;
  }
  /* écriture française d'un nombre : 1.5 → "1,5" ; avec deci=2 : "1,50" */
  function nb(x, deci) {
    const s = deci != null ? x.toFixed(deci) : String(Math.round(x * 1000) / 1000);
    return s.replace(".", ",");
  }
  function euros(x) { return Number.isInteger(Math.round(x * 100) / 100) ? nb(Math.round(x * 100) / 100) : nb(x, 2); }
  /* flèche courbe d'un point à un autre, au-dessus (sens = -1) ou en dessous (sens = 1) */
  function fleche(g, x1, x2, y, sens, label, couleur, attrs = {}, haut) {
    const h = (haut || Math.min(70, 26 + Math.abs(x2 - x1) * 0.18)) * sens;
    const grp = S("g", attrs, g);
    const d = `M${x1},${y} C${x1},${y + h} ${x2},${y + h} ${x2},${y}`;
    S("path", { d, class: "fl draw", stroke: couleur, pathLength: 1 }, grp);
    const a = 9, ang = sens < 0 ? 1 : -1;
    S("path", { d: `M${x2 - a * 0.7},${y + ang * -a * 1.1} L${x2},${y} L${x2 + a * 0.7},${y + ang * -a * 1.1}`, class: "fl", stroke: couleur }, grp);
    T(grp, (x1 + x2) / 2, y + h * 0.75 + sens * 4, label, { class: "lab gras", fill: couleur, style: "paint-order:stroke;stroke:#fff;stroke-width:7px;stroke-linejoin:round" });
    return grp;
  }

  /* ---------- moteur de diapo ---------- */
  const slides = [...document.querySelectorAll(".slide")];
  const stage = $("#stage");
  const hooks = {};
  let cur = 0, step = 0;

  function maxStep(sl) {
    let m = 0;
    sl.querySelectorAll("[data-step]").forEach(e => m = Math.max(m, +e.dataset.step));
    sl.querySelectorAll("[data-until]").forEach(e => m = Math.max(m, +e.dataset.until));
    sl.querySelectorAll("[data-rev]").forEach(e => m = Math.max(m, +e.dataset.rev));
    return m;
  }
  function applySteps(sl, k, anim) {
    sl.querySelectorAll("[data-step],[data-until]").forEach(e => {
      const s = +(e.dataset.step || 0), u = e.dataset.until != null ? +e.dataset.until : Infinity;
      const vis = k >= s && k < u, was = e.classList.contains("on");
      e.classList.toggle("on", vis);
      if (vis && !was && anim && s === k) { e.classList.remove("enter"); void e.getBoundingClientRect(); e.classList.add("enter"); }
      if (!vis) e.classList.remove("enter");
    });
    sl.querySelectorAll("input.trou").forEach(i => {
      const r = +i.dataset.rev;
      if (k >= r) {
        if (!i.disabled) i.dataset.saisie = i.value;
        const juste = i.dataset.saisie && egal(i.dataset.saisie, i.dataset.rep, i.dataset.entre) && !doublon(i, i.dataset.saisie);
        // réponse juste : on garde celle de l'élève ; sinon une bonne réponse pas déjà écrite dans une case « sœur »
        const r0 = i.dataset.rep.split("|")[0], mot0 = /^[a-zà-ÿ]{3,}$/i.test(r0) && !lettres(i); // un mot : on l'affiche bien orthographié
        i.value = juste ? (lettres(i) ? i.dataset.saisie.toUpperCase() : mot0 ? r0 : i.dataset.saisie)
          : i.dataset.rep.split("|").find(r => !prise(i, r)) || i.dataset.rep.split("|")[0];
        i.disabled = true;
        i.classList.remove("faux"); i.classList.toggle("juste", !!juste); i.classList.toggle("revele", !juste);
      } else if (i.disabled) {
        i.disabled = false; i.value = i.dataset.saisie || "";
        i.classList.remove("juste", "revele", "faux");
        if (i.value) verifier(i);
      }
    });
    if (hooks[sl.id]) hooks[sl.id].forEach(f => f(k));
  }
  function show(n, s, anim) {
    slides.forEach((sl, i) => sl.classList.toggle("active", i === n));
    cur = n; step = s; applySteps(slides[n], s, anim); clearPen(); ui();
    history.replaceState(null, "", "#" + (n + 1));
  }
  function next() { const m = maxStep(slides[cur]); if (step < m) { step++; applySteps(slides[cur], step, true); ui(); } else if (cur < slides.length - 1) show(cur + 1, 0, true); }
  function prev() { if (step > 0) { step--; applySteps(slides[cur], step, false); ui(); } else if (cur > 0) show(cur - 1, maxStep(slides[cur - 1]), false); }
  function ui() {
    const m = maxStep(slides[cur]), d = $("#dots"); d.innerHTML = "";
    for (let i = 1; i <= m; i++) { const e = document.createElement("i"); if (i <= step) e.className = "done"; d.appendChild(e); }
    $("#count").textContent = (cur + 1) + " / " + slides.length;
    stage.classList.toggle("sombre", slides[cur].classList.contains("titre"));
    document.querySelectorAll("#sommaire a").forEach((a, i) => a.classList.toggle("ici", i === cur));
  }

  /* ---------- cases à compléter ---------- */
  const norm = s => String(s).trim().replace(/\s|€|cm|km|kg|m$/g, "").replace(",", ".");
  const mot = s => String(s).toUpperCase().replace(/[\s\[\]()^°]/g, "");
  /* réponse attendue : un nombre, ou des lettres ; plusieurs réponses possibles séparées par | */
  function egal(a, b, entre) {
    if (entre) { // réponse libre : un nombre strictement compris entre deux bornes (data-entre="2,4|2,5")
      const [lo, hi] = entre.split("|").map(v => parseFloat(norm(v))), x = parseFloat(norm(a));
      return norm(a) !== "" && /^-?\d+(\.\d+)?$/.test(norm(a)) && x > lo && x < hi;
    }
    return String(b).split("|").some(r => {
      if (/^[\d\s,.\-]+$/.test(r.replace(/€|cm|km|kg|°/g, ""))) { const x = parseFloat(norm(a).replace("°", "")), y = parseFloat(norm(r).replace("°", "")); return norm(a) !== "" && !isNaN(x) && Math.abs(x - y) < 1e-9; }
      return mot(a) !== "" && mot(a) === mot(r);
    });
  }
  const lettres = i => /^[A-Z|]+$/.test(i.dataset.rep);
  /* cases « sœurs » : même paragraphe, mêmes réponses possibles (ex. EFG|GFE et GFE|EFG) : elles doivent être différentes */
  const cle = i => i.dataset.rep.split("|").sort().join("|");
  const soeurs = i => [...(i.closest("p") || i.parentNode).querySelectorAll("input.trou")].filter(j => j !== i && cle(j) === cle(i) && cle(i).includes("|"));
  const doublon = (i, v) => soeurs(i).some(j => j.value.trim() && mot(j.value) === mot(v) && (j.disabled || egal(j.value, j.dataset.rep)) && j.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_FOLLOWING);
  const prise = (i, v) => soeurs(i).some(j => j.value.trim() && mot(j.value) === mot(v) && (j.disabled || egal(j.value, j.dataset.rep)));
  function verifier(i) {
    if (!i.value.trim()) { i.classList.remove("juste", "faux"); return; }
    const ok = egal(i.value, i.dataset.rep, i.dataset.entre) && !doublon(i, i.value);
    i.classList.toggle("juste", ok); i.classList.toggle("faux", !ok);
  }
  document.querySelectorAll("input.trou").forEach(i => {
    const r0 = i.dataset.rep.split("|")[0];
    i.setAttribute("inputmode", /^[\d,]+$/.test(r0) ? "decimal" : "text"); i.setAttribute("autocomplete", "off"); i.setAttribute("autocapitalize", /^[A-Z|]+$/.test(i.dataset.rep) ? "characters" : "off");
    i.setAttribute("aria-label", "Case à compléter");
    i.style.width = Math.max(2.6, r0.length * 0.62 + 1.4) + "em";
    if (lettres(i)) i.style.textTransform = "uppercase";
    i.addEventListener("keydown", e => { if (e.key === "Enter") { verifier(i); i.blur(); } e.stopPropagation(); });
    i.addEventListener("input", () => i.classList.remove("juste", "faux"));
    i.addEventListener("change", () => verifier(i));
  });

  /* ---------- mise à l'échelle ---------- */
  function fit() { const s = Math.min(innerWidth / 1280, innerHeight / 720); stage.style.transform = `scale(${s})`; }
  addEventListener("resize", fit);

  /* ---------- stylo ---------- */
  const pen = $("#pen"), ctx = pen.getContext("2d");
  let penOn = false, drawing = false;
  function clearPen() { ctx.clearRect(0, 0, pen.width, pen.height); }
  function penPos(e) { const r = pen.getBoundingClientRect(); return [(e.clientX - r.left) * 1280 / r.width, (e.clientY - r.top) * 720 / r.height]; }
  pen.addEventListener("pointerdown", e => { drawing = true; pen.setPointerCapture(e.pointerId); const [x, y] = penPos(e); ctx.beginPath(); ctx.moveTo(x, y); });
  pen.addEventListener("pointermove", e => { if (!drawing) return; const [x, y] = penPos(e); ctx.lineTo(x, y); ctx.strokeStyle = "#c4302b"; ctx.lineWidth = 4; ctx.lineCap = ctx.lineJoin = "round"; ctx.stroke(); });
  pen.addEventListener("pointerup", () => drawing = false);
  function togglePen() { penOn = !penOn; pen.classList.toggle("active", penOn); $("#b-pen").classList.toggle("on", penOn); }

  /* ---------- barre ---------- */
  function fullscreen() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.(); }
  function panneau(id) { document.querySelectorAll(".panneau").forEach(p => p.id === id ? p.classList.toggle("ouvert") : p.classList.remove("ouvert")); }
  $("#b-prev").onclick = prev; $("#b-next").onclick = next;
  $("#b-pen").onclick = togglePen; $("#b-clear").onclick = clearPen;
  $("#b-fs").onclick = fullscreen;
  $("#b-help").onclick = () => panneau("aide"); $("#b-som").onclick = () => panneau("sommaire");
  const som = $("#sommaire ol");
  slides.forEach((sl, i) => {
    const li = document.createElement("li"), a = document.createElement("a");
    a.href = "#" + (i + 1); a.textContent = sl.dataset.titre || ("Diapo " + (i + 1));
    a.onclick = e => { e.preventDefault(); panneau(""); show(i, 0, true); };
    li.appendChild(a); som.appendChild(li);
  });
  $("#black").onclick = () => $("#black").style.display = "none";
  addEventListener("keydown", e => {
    if (e.target.closest && e.target.closest("input,button,select,textarea") && e.target.type !== "range" && (e.key === " " || e.key === "Enter")) return;
    if (e.target.type === "range" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) return;
    const k = e.key;
    if (k === "ArrowRight" || k === " " || k === "PageDown") { e.preventDefault(); next(); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); prev(); }
    else if (k === "p" || k === "P") togglePen();
    else if (k === "x" || k === "X") clearPen();
    else if (k === "f" || k === "F") fullscreen();
    else if (k === "b" || k === "B") { const b = $("#black"); b.style.display = b.style.display === "block" ? "none" : "block"; }
    else if (k === "h" || k === "H" || k === "?") panneau("aide");
    else if (k === "s" || k === "S") panneau("sommaire");
    else if (k === "Escape") panneau("");
  });
  /* clic sur le fond d'une diapo = étape suivante (pratique au tableau) */
  stage.addEventListener("click", e => {
    if (penOn || e.target.closest("button,a,input,svg,.fig,.panneau,#bar,label,.jeu")) return;
    if (!e.target.closest(".slide")) return;
    panneau(""); next();
  });

  window.Diapo = {
    S, T, nb, euros, fleche,
    surEtape(id, f) { (hooks[id] = hooks[id] || []).push(f); },
    etape: () => step,
    demarrer() {
      fit();
      const h = parseInt(location.hash.slice(1), 10);
      show(h >= 1 && h <= slides.length ? h - 1 : 0, 0, true);
    }
  };
})();
