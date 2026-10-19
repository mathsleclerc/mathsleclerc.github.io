/* =====================================================================
   EXERCISEUR « CALCUL LITTÉRAL ET PUISSANCES » — 5e, chapitre 7

   Les activités sont rangées comme les 7 feuilles d'exercices du chapitre.
   Les expressions tapées par l'élève sont lues par litteral.js (3x + 2, x², 2(x + 1)…).
   PARCOURS (en bas du fichier) : le test « Je me teste » en 14 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Écrire avec des lettres";
const F2 = "Feuille 2 — Carrés et cubes";
const F3 = "Feuille 3 — Calculer la valeur d'une expression";
const F4 = "Feuille 4 — Tester une égalité, somme ou produit";
const F5 = "Feuille 5 — Réduire une expression";
const F6 = "Feuille 6 — Développer et factoriser";
const F7 = "Feuille 7 — Motifs et formules";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const egal = (x, y) => Math.abs(x - y) < 1e-9;
/* Monôme a·x écrit proprement : 1x → x, −1x → −x */
const mono = (a, l = "x") => a === 1 ? l : a === -1 ? "−" + l : nb(a) + l;
/* a x + b écrit proprement */
const lin = (a, b, l = "x") => (a ? mono(a, l) : "") + (b ? (a ? (b > 0 ? " + " : " − ") + nb(Math.abs(b)) : nb(b)) : (a ? "" : "0"));

function champ(placeholder = "ex. : 3x + 2") {
  return el("input", { class: "case", type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false",
    style: "width:min(13em,85vw);text-align:left", placeholder, "aria-label": "Ton expression" });
}
/* Question où l'élève tape une expression : attendu (texte), reduite = nombre maximal de termes (ou null) */
function questionExpression({ consigne, attendu, lettres = ["x"], termes = null, indice, correction, sansParentheses = false }) {
  const c = champ();
  return {
    consigne,
    figure: c,
    verifier() {
      const t = c.value.trim();
      if (!t) return { etat: "incomplet", message: "Écris ton expression dans la case." };
      if (!lireExpression(t)) return { etat: "incomplet", message: "Ton expression est mal écrite : vérifie les signes et les parenthèses." };
      if (!equivalentes(t, attendu, lettres)) return { etat: "faux" };
      const n = nbTermes(t);
      if (sansParentheses && n === -1) return { etat: "faux", message: "Ton expression est juste, mais il reste des parenthèses : développe." };
      if (termes !== null && (n === -1 || n > termes)) return { etat: "faux", message: "Ton expression est juste, mais elle n'est pas réduite." };
      return { etat: "juste" };
    },
    indice, correction,
    bloquer: () => { c.disabled = true; }
  };
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "traduire",
    titre: "Traduire une phrase",
    description: "Le double, le carré, le successeur…",
    generer() {
      const k = alea(2, 9);
      const items = [
        [`le double de n`, "2n"], [`le triple de n`, "3n"], [`le carré de n`, "n²"], [`le cube de n`, "n³"],
        [`le successeur de n`, "n + 1"], [`le prédécesseur de n`, "n − 1"], [`la somme de n et de ${k}`, `n + ${k}`],
        [`le double de n, augmenté de ${k}`, `2n + ${k}`], [`le double de la somme de n et de ${k}`, `2(n + ${k})`],
        [`le carré de la somme de n et de ${k}`, `(n + ${k})²`], [`la somme du carré de n et de ${k}`, `n² + ${k}`], [`la moitié de n`, "n ÷ 2"]
      ];
      const k0 = alea(0, items.length - 1), [p, bonne] = items[k0];
      const autres = melanger(items.filter((_, i) => i !== k0).map(x => x[1])).slice(0, 2);
      return {
        consigne: `Quelle expression traduit « ${p} » ?`,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Le premier mot (double, carré, somme…) indique la dernière opération à effectuer.",
        correction: `« ${p} » s'écrit ${bonne}.`
      };
    }
  },

  {
    groupe: F1,
    id: "conventions",
    titre: "Conventions d'écriture",
    description: "Supprimer les signes ×.",
    generer() {
      const k = alea(2, 9);
      const [e, bonne, autres] = choisir([
        [`${k} × x`, `${k}x`, [`x${k}`, `${k} + x`]], [`x × ${k}`, `${k}x`, [`x${k}`, `x + ${k}`]], [`x × x`, "x²", ["2x", "xx2"]],
        [`a × b × ${k}`, `${k}ab`, [`${k} + ab`, `ab${k}`]], [`${k} × (x + 1)`, `${k}(x + 1)`, [`${k}x + 1`, `(x + 1)${k}`]],
        [`1 × y`, "y", ["1", "1 + y"]], [`x × x × x`, "x³", ["3x", "x + x + x"]], [`${k} × x × x`, `${k}x²`, [`${2 * k}x`, `(${k}x)²`]]
      ]);
      return {
        consigne: `Quelle est l'écriture simplifiée de <strong>${e}</strong> ?`,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "On supprime le signe × devant une lettre ou une parenthèse, et on écrit le nombre en premier. x × x = x².",
        correction: `${e} = ${bonne}`
      };
    }
  },

  {
    groupe: F1,
    id: "formules",
    titre: "Formules de géométrie et de la vie courante",
    description: "Périmètre, aire, prix…",
    generer() {
      const p = choisir([1.5, 2.5, 3.2, 0.8]);
      const [q, bonne, autres] = choisir([
        ["Périmètre d'un carré de côté c :", "4c", ["c²", "c + 4"]],
        ["Aire d'un carré de côté c :", "c²", ["4c", "2c"]],
        ["Périmètre d'un rectangle de longueur L et de largeur ℓ :", "2(L + ℓ)", ["Lℓ", "L + ℓ"]],
        ["Aire d'un rectangle de longueur L et de largeur ℓ :", "Lℓ", ["2(L + ℓ)", "L + ℓ"]],
        ["Volume d'un cube d'arête a :", "a³", ["3a", "6a²"]],
        [`Prix de n objets à ${nb(p)} € l'un :`, `${nb(p)}n`, [`${nb(p)} + n`, `n ÷ ${nb(p)}`]],
        ["Périmètre d'un triangle équilatéral de côté a :", "3a", ["a³", "a + 3"]]
      ]);
      return {
        consigne: q,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Fais un dessin et pense à la formule avec des nombres, puis remplace-les par des lettres.",
        correction: `${q} ${bonne}.`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "carres-cubes",
    titre: "Carrés et cubes",
    description: "Les carrés de 0 à 12, quelques cubes.",
    generer() {
      const cube = Math.random() < 0.3, n = cube ? choisir([1, 2, 3, 4, 5, 10]) : alea(0, 12);
      return {
        consigne: `Calcule de tête : <strong>${n}${cube ? "³" : "²"}</strong>`,
        ligne: `${n}${cube ? "³" : "²"} = [n]`,
        verifier: v => verifierNombre(v[0], n ** (cube ? 3 : 2)),
        indice: cube ? `${n}³ = ${n} × ${n} × ${n}` : `${n}² = ${n} × ${n}`,
        correction: `${n}${cube ? "³" : "²"} = ${cube ? `${n} × ${n} × ${n}` : `${n} × ${n}`} = ${nb(n ** (cube ? 3 : 2))}`
      };
    }
  },

  {
    groupe: F2,
    id: "ecrire-carre",
    titre: "Écrire comme un carré",
    description: "64 = …²",
    generer() {
      const cube = Math.random() < 0.3, n = cube ? choisir([2, 3, 4, 5, 10]) : alea(2, 12);
      const v = n ** (cube ? 3 : 2);
      return {
        consigne: `Complète : <strong>${nb(v)} = …${cube ? "³" : "²"}</strong>`,
        ligne: `${nb(v)} = [n] ${cube ? "³" : "²"}`,
        verifier: x => verifierNombre(x[0], n),
        indice: cube ? "Cherche le nombre qui, multiplié trois fois par lui-même, donne ce résultat." : "Cherche le nombre qui, multiplié par lui-même, donne ce résultat.",
        correction: `${nb(v)} = ${n}${cube ? "³" : "²"}`
      };
    }
  },

  {
    groupe: F2,
    id: "priorites-puissances",
    titre: "Priorités avec des puissances",
    description: "Les puissances d'abord.",
    generer() {
      const a = alea(2, 6), b = alea(2, 5), c = alea(2, 4);
      const [e, r, d] = choisir([
        [`${a} + ${b}²`, a + b * b, `${a} + ${b * b}`], [`(${a} + ${b})²`, (a + b) ** 2, `${a + b}²`],
        [`${c} × ${b}²`, c * b * b, `${c} × ${b * b}`], [`(${c} × ${b})²`, (c * b) ** 2, `${c * b}²`],
        [`${a}² − ${b}²`, a * a - b * b, `${a * a} − ${b * b}`], [`${b}³ + ${a}`, b ** 3 + a, `${b ** 3} + ${a}`],
        [`10² − ${a} × ${b}`, 100 - a * b, `100 − ${a * b}`]
      ]);
      return {
        consigne: `Calcule : <strong>${e}</strong>`,
        ligne: `${e} = [r]`,
        verifier: v => verifierNombre(v[0], r),
        indice: "Les parenthèses d'abord, puis les puissances, puis × et ÷, puis + et −.",
        correction: `${e} = ${d} = ${nb(r)}`
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "substitution",
    titre: "Remplacer la lettre par un nombre",
    description: "Calculer la valeur d'une expression.",
    generer() {
      const x = choisir([alea(0, 10), alea(1, 9) + 0.5]), a = alea(2, 6), b = alea(1, 9);
      const [e, f, d] = choisir([
        [`${a}x + ${b}`, v => a * v + b, v => `${a} × ${nb(v)} + ${b}`],
        [`${a}x − ${b}`, v => a * v - b, v => `${a} × ${nb(v)} − ${b}`],
        [`x² + ${b}`, v => v * v + b, v => `${nb(v)}² + ${b}`],
        [`${a}x²`, v => a * v * v, v => `${a} × ${nb(v)}²`],
        [`${a}(x + ${b})`, v => a * (v + b), v => `${a} × (${nb(v)} + ${b})`],
        [`x² − ${a}x`, v => v * v - a * v, v => `${nb(v)}² − ${a} × ${nb(v)}`]
      ]);
      return {
        consigne: `Calcule la valeur de <strong>${e}</strong> pour x = ${nb(x)}.`,
        ligne: "[r]",
        verifier: v => verifierNombre(v[0], rr(f(x))),
        indice: "Remplace x par le nombre en remettant les signes ×, puis respecte les priorités (puissances d'abord).",
        correction: `${d(x)} = ${nb(f(x))}`
      };
    }
  },

  {
    groupe: F3,
    id: "formule-valeur",
    titre: "Utiliser une formule",
    description: "Prix, périmètre, aire…",
    generer() {
      const [q, r, u] = choisir([
        (() => { const k = alea(3, 25); return [`Un taxi coûte P = 4 + 1,5k euros pour k kilomètres. Combien coûte une course de ${k} km ?`, 4 + 1.5 * k, "€"]; })(),
        (() => { const L = alea(3, 15), l = alea(2, 9); return [`Le périmètre d'un rectangle est P = 2(L + ℓ). Calcule P pour L = ${L} cm et ℓ = ${l} cm.`, 2 * (L + l), "cm"]; })(),
        (() => { const c = alea(2, 12); return [`L'aire d'un carré est A = c². Calcule A pour c = ${c} m.`, c * c, "m²"]; })(),
        (() => { const a = alea(2, 10); return [`Le volume d'un cube est V = a³. Calcule V pour a = ${a} cm.`, a ** 3, "cm³"]; })(),
        (() => { const n = alea(5, 40); return [`Un abonnement coûte 15 € plus 2,5 € par séance : P = 15 + 2,5n. Combien pour ${n} séances ?`, 15 + 2.5 * n, "€"]; })()
      ]);
      return {
        consigne: q,
        ligne: `[d] ${u}`,
        verifier: v => verifierNombre(v[0], rr(r)),
        indice: "Remplace chaque lettre par sa valeur, puis calcule.",
        correction: `Le résultat est ${nb(r)} ${u}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "tester",
    titre: "Tester une égalité",
    description: "Vraie ou fausse pour cette valeur ?",
    generer() {
      const x0 = alea(-2, 6), a = alea(1, 5), b = alea(-5, 9), c = a + alea(1, 3) * choisir([1, -1]);
      const vraie = Math.random() < 0.5;
      const d = vraie ? (a - c) * x0 + b : (a - c) * x0 + b + choisir([1, -1, 2]);   // a x0 + b = c x0 + d
      const g = a * x0 + b, h = c * x0 + d;
      return {
        consigne: `L'égalité <strong>${lin(a, b)} = ${lin(c, d)}</strong> est-elle vraie pour x = ${nb(x0)} ?`,
        choix: ["Vraie", "Fausse"],
        verifier: (v, ch) => ({ etat: (ch === "Vraie") === (g === h) ? "juste" : "faux" }),
        indice: "Calcule séparément chaque membre, puis compare.",
        correction: `Membre de gauche : ${nb(g)} ; membre de droite : ${nb(h)}. L'égalité est ${g === h ? "vraie" : "fausse"} pour x = ${nb(x0)}.`
      };
    }
  },

  {
    groupe: F4,
    id: "nature",
    titre: "Somme ou produit ?",
    description: "La dernière opération.",
    generer() {
      const a = alea(2, 9), b = alea(1, 9);
      const [e, r] = choisir([[`${a}x + ${b}`, "une somme"], [`${a}(x + ${b})`, "un produit"], [`${a}x − ${b}`, "une différence"], [`x² + ${b}`, "une somme"],
        [`(x + ${b})²`, "un carré (un produit)"], [`${a}ab`, "un produit"], [`(x + 1)(x + ${b})`, "un produit"], [`${b} − ${a}x²`, "une différence"]]);
      const choixL = ["une somme", "une différence", "un produit", "un carré (un produit)"];
      return {
        consigne: `L'expression <strong>${e}</strong> est…`,
        choix: choixL,
        verifier: (v, c) => ({ etat: c === r || (r === "un carré (un produit)" && c === "un produit") ? "juste" : "faux" }),
        indice: "Quelle est la dernière opération à effectuer si l'on remplace x par un nombre ?",
        correction: `${e} est ${r}.`
      };
    }
  },

  {
    groupe: F4,
    id: "contre-exemple",
    titre: "Trouver un contre-exemple",
    description: "Une affirmation est-elle toujours vraie ?",
    generer() {
      const [aff, vrai, ex] = choisir([
        ["Pour tout nombre x, x² est plus grand que x.", false, "pour x = 0,5 : 0,5² = 0,25 < 0,5"],
        ["Pour tout nombre x, 2x + 3x = 5x.", true, "c'est la distributivité : (2 + 3)x = 5x"],
        ["Pour tout nombre x, (x + 1)² = x² + 1.", false, "pour x = 1 : 2² = 4 mais 1² + 1 = 2"],
        ["Pour tout nombre x, 3(x + 2) = 3x + 6.", true, "c'est la distributivité"],
        ["Pour tout nombre x, x + x = x².", false, "pour x = 3 : 3 + 3 = 6 mais 3² = 9"],
        ["Pour tout entier n, n + (n + 1) est impair.", true, "n + n + 1 = 2n + 1, un nombre pair plus 1"]
      ]);
      return {
        consigne: aff + " Cette affirmation est-elle toujours vraie ?",
        choix: ["Toujours vraie", "Fausse (contre-exemple)"],
        verifier: (v, c) => ({ etat: (c === "Toujours vraie") === vrai ? "juste" : "faux" }),
        indice: "Teste avec plusieurs nombres (0 ; 1 ; 0,5 ; 3…). Un seul contre-exemple suffit pour prouver que c'est faux.",
        correction: vrai ? `Toujours vraie : ${ex}.` : `Fausse : ${ex}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "reduire",
    titre: "Réduire une expression",
    description: "3x + 5x = 8x",
    generer() {
      const a = alea(1, 9), b = alea(1, 9) * choisir([1, 1, -1]), c = alea(1, 9), d = alea(0, 9) * choisir([1, -1]);
      const type = choisir(["simple", "constantes", "carres"]);
      if (type === "simple") {
        if (a + b === 0) return this.generer();
        const e = `${mono(a)} ${b > 0 ? "+" : "−"} ${mono(Math.abs(b))}`;
        return questionExpression({ consigne: `Réduis : <strong>${e}</strong>`, attendu: `${a + b}*x`, termes: 1,
          indice: "Additionne les « nombres de x » : ax + bx = (a + b)x.", correction: `${e} = ${mono(a + b)}` });
      }
      if (type === "constantes") {
        const e = `${mono(a)} + ${c}${d ? (d > 0 ? " + " : " − ") + mono(Math.abs(d)) : ""} ${b > 0 ? "+" : "−"} ${Math.abs(b)}`;
        const att = `${a + d}*x + ${c + b}`;
        return questionExpression({ consigne: `Réduis : <strong>${e}</strong>`, attendu: att, termes: 2,
          indice: "Regroupe les termes en x, puis les nombres seuls.", correction: `${e} = ${lin(a + d, c + b)}` });
      }
      const e = `${mono(a, "x²")} + ${mono(c)} + ${mono(Math.abs(b), "x²")}`;
      return questionExpression({ consigne: `Réduis : <strong>${e}</strong>`, attendu: `${a + Math.abs(b)}*x^2 + ${c}*x`, termes: 2,
        indice: "On ne peut regrouper que les x² entre eux et les x entre eux.", correction: `${e} = ${mono(a + Math.abs(b), "x²")} + ${mono(c)}` });
    }
  },

  {
    groupe: F5,
    id: "reduire-vrai-faux",
    titre: "Erreurs de réduction",
    description: "Vrai ou faux ?",
    generer() {
      const a = alea(2, 9), b = alea(2, 9);
      const [e, v, ex] = choisir([
        [`${a}x + ${b} = ${a + b}x`, false, `on ne peut pas ajouter des x et un nombre seul`],
        [`${a}x + ${b}x = ${a + b}x`, true, `(${a} + ${b})x = ${a + b}x`],
        [`x × x = 2x`, false, "x × x = x²"],
        [`x + x = 2x`, true, "x + x = 2 × x"],
        [`${a}x − x = ${a - 1}x`, true, `${a}x − 1x = ${a - 1}x`],
        [`${a}x − x = ${a}`, false, `${a}x − x = ${a - 1}x`],
        [`x² + x = x³`, false, "x² et x ne se regroupent pas"]
      ]);
      return {
        consigne: `Vrai ou faux ? <strong>${e}</strong>`,
        choix: ["Vrai", "Faux"],
        verifier: (x, c) => ({ etat: (c === "Vrai") === v ? "juste" : "faux" }),
        indice: "Teste avec un nombre, par exemple x = 2.",
        correction: `${v ? "Vrai" : "Faux"} : ${ex}.`
      };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "developper",
    titre: "Développer",
    description: "k(a + b) = ka + kb",
    generer() {
      const k = alea(2, 9), a = alea(1, 6), b = alea(1, 9) * choisir([1, -1]);
      const e = `${k}(${mono(a)} ${b > 0 ? "+" : "−"} ${Math.abs(b)})`;
      return questionExpression({ consigne: `Développe : <strong>${e}</strong>`, attendu: `${k * a}*x + ${k * b}`, termes: 2, sansParentheses: true,
        indice: `Multiplie chaque terme de la parenthèse par ${k}.`, correction: `${e} = ${k} × ${mono(a)} ${b > 0 ? "+" : "−"} ${k} × ${Math.abs(b)} = ${lin(k * a, k * b)}` });
    }
  },

  {
    groupe: F6,
    id: "developper-reduire",
    titre: "Développer puis réduire",
    description: "Deux étapes.",
    generer() {
      const k = alea(2, 6), a = alea(1, 5), b = alea(1, 6), c = alea(1, 9);
      const e = `${k}(${mono(a)} + ${b}) + ${mono(c)}`;
      return questionExpression({ consigne: `Développe puis réduis : <strong>${e}</strong>`, attendu: `${k * a + c}*x + ${k * b}`, termes: 2, sansParentheses: true,
        indice: "Développe d'abord la parenthèse, puis regroupe les termes en x.", correction: `${e} = ${mono(k * a)} + ${k * b} + ${mono(c)} = ${lin(k * a + c, k * b)}` });
    }
  },

  {
    groupe: F6,
    id: "factoriser",
    titre: "Factoriser",
    description: "ka + kb = k(a + b)",
    generer() {
      const k = alea(2, 9), b = alea(1, 9) * choisir([1, -1]);
      const e = `${mono(k)} ${b > 0 ? "+" : "−"} ${k * Math.abs(b)}`;
      const bonne = `${k}(x ${b > 0 ? "+" : "−"} ${Math.abs(b)})`;
      const autres = [`${k}(x ${b > 0 ? "+" : "−"} ${k * Math.abs(b)})`, `x(${k} ${b > 0 ? "+" : "−"} ${Math.abs(b)})`];
      return {
        consigne: `Quelle est la factorisation de <strong>${e}</strong> ?`,
        choix: melanger([bonne, ...autres]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: `${k} est un facteur commun : ${mono(k)} = ${k} × x et ${k * Math.abs(b)} = ${k} × ${Math.abs(b)}.`,
        correction: `${e} = ${bonne}`
      };
    }
  },

  /* ================= Feuille 7 ================= */
  {
    groupe: F7,
    id: "motif",
    titre: "Motifs : trouver la formule",
    description: "Combien d'éléments à l'étape n ?",
    generer() {
      const a = alea(2, 6), b = alea(0, 5);
      const etapes = [1, 2, 3, 4].map(n => a * n + b);
      const N = alea(10, 60);
      const quoi = choisir(["allumettes", "jetons", "carreaux"]);
      return {
        consigne: `On construit des motifs. Nombre de ${quoi} : étape 1 → ${etapes[0]}, étape 2 → ${etapes[1]}, étape 3 → ${etapes[2]}, étape 4 → ${etapes[3]}. Combien de ${quoi} à l'étape ${N} ?`,
        ligne: `[n] ${quoi}`,
        verifier: v => verifierNombre(v[0], a * N + b),
        indice: `On ajoute ${a} ${quoi} à chaque étape. Trouve une formule du type ${a}n + …`,
        correction: `Formule : ${lin(a, b, "n")}. Pour n = ${N} : ${a} × ${N}${b ? " + " + b : ""} = ${a * N + b}.`
      };
    }
  },

  {
    groupe: F7,
    id: "motif-formule",
    titre: "Motifs : écrire la formule",
    description: "Taper l'expression en fonction de n.",
    generer() {
      const a = alea(2, 6), b = alea(1, 5);
      const etapes = [1, 2, 3, 4].map(n => a * n + b);
      const c = champ("ex. : 3n + 1");
      return {
        consigne: `Nombre d'éléments : étape 1 → ${etapes[0]}, étape 2 → ${etapes[1]}, étape 3 → ${etapes[2]}, étape 4 → ${etapes[3]}. Écris le nombre d'éléments à l'étape n.`,
        figure: c,
        verifier() {
          const t = c.value.trim();
          if (!t) return { etat: "incomplet", message: "Écris ta formule dans la case." };
          if (!lireExpression(t)) return { etat: "incomplet", message: "Ta formule est mal écrite." };
          return equivalentes(t, `${a}*n + ${b}`, ["n"]) ? { etat: "juste" } : { etat: "faux" };
        },
        indice: `De combien augmente-t-on à chaque étape ? Vérifie ta formule avec n = 1.`,
        correction: `${lin(a, b, "n")} (vérification : pour n = 1, ${a} + ${b} = ${a + b}).`,
        bloquer: () => { c.disabled = true; }
      };
    }
  }
];

/* ---------- Le test « Je me teste » : 14 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "14 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Traduire une phrase par une expression", activites: ["traduire"] },
    { competence: "Conventions d'écriture", activites: ["conventions"] },
    { competence: "Produire une formule", activites: ["formules"] },
    { competence: "Carrés et cubes", activites: ["carres-cubes", "ecrire-carre"] },
    { competence: "Priorités avec des puissances", activites: ["priorites-puissances"] },
    { competence: "Calculer par substitution", activites: ["substitution"] },
    { competence: "Utiliser une formule", activites: ["formule-valeur"] },
    { competence: "Tester une égalité", activites: ["tester"] },
    { competence: "Somme ou produit ?", activites: ["nature"] },
    { competence: "Contre-exemple", activites: ["contre-exemple"] },
    { competence: "Réduire une expression", activites: ["reduire", "reduire-vrai-faux"] },
    { competence: "Développer", activites: ["developper", "developper-reduire"] },
    { competence: "Factoriser", activites: ["factoriser"] },
    { competence: "Motifs et formules", activites: ["motif", "motif-formule"] }
  ]
};
