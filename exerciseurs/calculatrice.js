/* Calculatrice (avec la touche π) — pas besoin de modifier ce fichier.
   ajouterCalculatrice() place un bouton « Calculatrice » en bas de l'écran ; l'élève peut aussi utiliser la sienne. */

/* Calcul d'une expression : nombres (virgule ou point), + − × ÷, parenthèses, π.
   Multiplication implicite : 2π, 3(4+1). Renvoie NaN si l'expression est incorrecte. */
function evaluerExpression(texte) {
  const t = texte.replace(/\s/g, "").replace(/,/g, ".").replace(/[x*]/g, "×").replace(/[:/]/g, "÷").replace(/-/g, "−").replace(/pi/gi, "π");
  let i = 0;
  const voir = () => t[i];
  function nombre() {
    if (voir() === "π") { i++; return Math.PI; }
    if (voir() === "(") { i++; const v = somme(); if (voir() !== ")") throw 0; i++; return v; }
    const m = /^\d+(\.\d+)?|^\.\d+/.exec(t.slice(i));
    if (!m) throw 0;
    i += m[0].length;
    return Number(m[0]);
  }
  function facteur() {
    if (voir() === "−") { i++; return -facteur(); }
    if (voir() === "+") { i++; return facteur(); }
    let v = nombre();
    while (voir() === "π" || voir() === "(" || (/\d/.test(voir() || "") && t[i - 1] === ")")) v *= nombre(); // 2π, 3(…)
    return v;
  }
  function produit() {
    let v = facteur();
    while (voir() === "×" || voir() === "÷") {
      const op = t[i++], w = facteur();
      v = op === "×" ? v * w : v / w;
    }
    return v;
  }
  function somme() {
    let v = produit();
    while (voir() === "+" || voir() === "−") {
      const op = t[i++], w = produit();
      v = op === "+" ? v + w : v - w;
    }
    return v;
  }
  try {
    if (!t) return NaN;
    const v = somme();
    return i === t.length && isFinite(v) ? v : NaN;
  } catch { return NaN; }
}

function ajouterCalculatrice() {
  if (document.querySelector(".calculatrice")) return;
  const ecran = el("input", { class: "calc-ecran", type: "text", inputmode: "none", autocomplete: "off", spellcheck: "false", "aria-label": "Calcul" });
  const resultat = el("output", { class: "calc-resultat", "aria-live": "polite" });
  const inserer = txt => {
    const a = ecran.selectionStart ?? ecran.value.length, b = ecran.selectionEnd ?? a;
    ecran.value = ecran.value.slice(0, a) + txt + ecran.value.slice(b);
    ecran.setSelectionRange(a + txt.length, a + txt.length);
  };
  const calculer = () => {
    const v = evaluerExpression(ecran.value);
    if (isNaN(v)) { resultat.textContent = "Calcul incorrect"; resultat.classList.add("erreur"); return; }
    resultat.classList.remove("erreur");
    const arrondi = Math.round(v * 1e9) / 1e9;
    resultat.textContent = "= " + arrondi.toLocaleString("fr-FR", { maximumFractionDigits: 9, useGrouping: false });
  };
  const touches = [
    ["C", () => { ecran.value = ""; resultat.textContent = ""; }, "fonction"], ["←", () => {
      const a = ecran.selectionStart ?? ecran.value.length;
      if (a > 0) { ecran.value = ecran.value.slice(0, a - 1) + ecran.value.slice(a); ecran.setSelectionRange(a - 1, a - 1); }
    }, "fonction"], ["(", null], [")", null],
    ["7"], ["8"], ["9"], ["÷", null, "op"],
    ["4"], ["5"], ["6"], ["×", null, "op"],
    ["1"], ["2"], ["3"], ["−", null, "op"],
    ["0"], [","], ["π", null, "pi"], ["+", null, "op"],
    ["=", calculer, "egal"]
  ];
  const clavier = el("div", { class: "calc-touches" }, ...touches.map(([t, f, c = ""]) =>
    el("button", { type: "button", class: "calc-touche " + c, onclick: () => { (f || (() => inserer(t)))(); if (t !== "=") ecran.focus({ preventScroll: true }); } }, t)));
  ecran.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === "=") { e.preventDefault(); e.stopPropagation(); calculer(); } });
  const fermer = el("button", { type: "button", class: "calc-fermer", "aria-label": "Fermer la calculatrice" }, "✕");
  const panneau = el("div", { class: "calc-panneau", role: "dialog", "aria-label": "Calculatrice", hidden: "" },
    el("div", { class: "calc-tete" }, el("strong", {}, "Calculatrice"), fermer), ecran, resultat, clavier,
    el("p", { class: "calc-aide" }, "Tu peux aussi utiliser ta propre calculatrice."));
  const ouvrir = el("button", { type: "button", class: "calc-ouvrir" }, "🧮 Calculatrice");
  ouvrir.addEventListener("click", () => { panneau.hidden = !panneau.hidden; if (!panneau.hidden) ecran.focus({ preventScroll: true }); });
  fermer.addEventListener("click", () => { panneau.hidden = true; });
  document.body.append(el("div", { class: "calculatrice" }, panneau, ouvrir));
}
