/* Calcul littéral pour les exerciseurs — pas besoin de modifier ce fichier.
   lireExpression(texte) renvoie une fonction f(valeurs) ou null si l'expression est mal écrite.
   L'élève peut écrire : 3x + 2 ; 3*x ; 3×x ; x² ; x^2 ; 2(x + 1) ; 0,5x ; x³ ; ab …
   equivalentes(texte, attendu, lettres) teste l'égalité sur plusieurs valeurs.
   nbTermes(texte) compte les termes (au premier niveau) : sert à vérifier qu'une expression est réduite. */

function lireExpression(texte) {
  const t = String(texte).replace(/\s/g, "").replace(/,/g, ".").replace(/[×·*]/g, "*").replace(/[÷:/]/g, "/")
    .replace(/[−–]/g, "-").replace(/²/g, "^2").replace(/³/g, "^3");
  if (!t) return null;
  let i = 0;
  const voir = () => t[i];
  const debutAtome = c => c !== undefined && (/[0-9.a-zA-Z(]/.test(c));
  function atome() {
    const c = voir();
    if (c === "(") { i++; const f = somme(); if (voir() !== ")") throw 0; i++; return f; }
    const m = /^(\d+\.?\d*|\.\d+)/.exec(t.slice(i));
    if (m) { i += m[0].length; const v = Number(m[0]); return () => v; }
    if (/[a-zA-Z]/.test(c || "")) { i++; return vals => { if (!(c in vals)) throw 0; return vals[c]; }; }
    throw 0;
  }
  function puissance() {
    const a = atome();
    if (voir() === "^") { i++; const e = facteur(); return v => a(v) ** e(v); }
    return a;
  }
  function facteur() {
    if (voir() === "-") { i++; const f = facteur(); return v => -f(v); }
    if (voir() === "+") { i++; return facteur(); }
    return puissance();
  }
  function produit() {
    let f = facteur();
    for (;;) {
      const c = voir();
      if (c === "*" || c === "/") { i++; const g = facteur(), h = f; f = c === "*" ? v => h(v) * g(v) : v => h(v) / g(v); }
      else if (debutAtome(c)) { const g = puissance(), h = f; f = v => h(v) * g(v); }   // multiplication implicite : 3x, 2(x+1), ab
      else return f;
    }
  }
  function somme() {
    let f = produit();
    while (voir() === "+" || voir() === "-") {
      const c = t[i++], g = produit(), h = f;
      f = c === "+" ? v => h(v) + g(v) : v => h(v) - g(v);
    }
    return f;
  }
  try {
    const f = somme();
    if (i !== t.length) return null;
    return f;
  } catch { return null; }
}

function equivalentes(texte, attendu, lettres = ["x"]) {
  const f = lireExpression(texte), g = lireExpression(attendu);
  if (!f || !g) return false;
  const essais = [-2.5, 0, 1, 3, 7.3, 0.4];
  try {
    return essais.every((a, k) => {
      const vals = {};
      lettres.forEach((l, j) => { vals[l] = essais[(k + j * 2) % essais.length] + j; });
      const x = f(vals), y = g(vals);
      return isFinite(x) && Math.abs(x - y) < 1e-6 * Math.max(1, Math.abs(y));
    });
  } catch { return false; }
}

/* Nombre de termes au premier niveau (hors parenthèses) ; -1 si l'expression contient encore des parenthèses */
function nbTermes(texte) {
  const t = String(texte).replace(/\s/g, "").replace(/[−–]/g, "-");
  if (/[()]/.test(t)) return -1;
  return t.replace(/^[+-]/, "").split(/[+-]/).filter(Boolean).length;
}

/* Écriture « jolie » d'une expression tapée par l'élève (pour les messages) */
function joli(texte) { return String(texte).replace(/\*/g, " × ").replace(/\^2/g, "²").replace(/\^3/g, "³").replace(/-/g, " − ").replace(/\+/g, " + ").replace(/\s+/g, " ").trim(); }
