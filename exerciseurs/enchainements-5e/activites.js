/* =====================================================================
   EXERCISEUR « ENCHAÎNEMENTS D'OPÉRATIONS » — 5e, chapitre 1

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Vocabulaire et sens des opérations";
const F2 = "Feuille 2 — Priorités opératoires";
const F3 = "Feuille 3 — Parenthèses et nature d'une expression";
const F4 = "Feuille 4 — Traduire par une seule expression";
const F5 = "Feuille 5 — Distributivité et calcul astucieux";
const F6 = "Feuille 6 — Résoudre des problèmes";
const F7 = "Feuille 7 — Durées et horaires";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const egal = (x, y) => Math.abs(x - y) < 1e-9;
const NATURES = ["une somme", "une différence", "un produit", "un quotient"];
/* Écriture d'une expression : * → ×, / → ÷, - → − */
const ecr = s => s.replace(/\*/g, " × ").replace(/\//g, " ÷ ").replace(/ - /g, " − ").replace(/\./g, ",");
/* Valeur d'une expression écrite avec * / + - et parenthèses (sans priorité cachée : celle de JavaScript est la bonne) */
const val = s => rr(Function('"use strict";return (' + s.replace(/\[/g, "(").replace(/\]/g, ")") + ")")());
const fdur = d => (d >= 60 ? Math.floor(d / 60) + " h " : "") + (d % 60 ? (d % 60) + " min" : "");
const avecUnite = (x, u) => nb(x) + (u ? " " + u : "");

/* Une question « calculer cette expression » ; etapes : liste d'écritures intermédiaires pour la correction */
function calculerExpr(expr, etapes, indice) {
  const r = val(expr);
  return {
    consigne: `Calcule : <span class="expr">${ecr(expr)}</span>`,
    ligne: `${ecr(expr)} = [d]`,
    verifier: v => verifierNombre(v[0], r),
    indice,
    correction: [ecr(expr), ...etapes.map(ecr), nb(r)].join(" = ")
  };
}

/* Champ texte pour écrire une expression (le compte est bon) */
function champExpression() {
  const i = el("input", { class: "case", type: "text", autocomplete: "off", spellcheck: "false",
    style: "width:min(16em,90vw);text-align:left", "aria-label": "Ton expression", placeholder: "ex. : (3 + 5) × 2" });
  return i;
}
function nombresUtilises(texte) {
  return (texte.match(/\d+([.,]\d+)?/g) || []).map(t => Number(t.replace(",", ".")));
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "vocabulaire",
    titre: "Somme, différence, produit ou quotient ?",
    description: "Nommer le résultat d'une opération.",
    generer() {
      const a = alea(12, 60), b = alea(2, 9);
      const [mot, r, op] = choisir([
        ["la somme", a + b, "+"], ["la différence", a - b, "−"], ["le produit", a * b, "×"], ["le quotient", a * b / b, "÷"]
      ]);
      const x = op === "÷" ? a * b : a;
      const bonne = { "la somme": "somme", "la différence": "différence", "le produit": "produit", "le quotient": "quotient" }[mot];
      return {
        consigne: `${nb(r)} est … de ${nb(x)} ${op === "×" || op === "÷" ? "par" : "et de"} ${b}. Quel mot convient ?`,
        choix: ["somme", "différence", "produit", "quotient"],
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Vérifie quelle opération donne ce résultat : +, −, × ou ÷ ?",
        correction: `${nb(x)} ${op} ${b} = ${nb(r)} : ${nb(r)} est ${mot} de ${nb(x)} ${op === "×" || op === "÷" ? "par" : "et de"} ${b}.`
      };
    }
  },

  {
    groupe: F1,
    id: "termes-facteurs",
    titre: "Termes ou facteurs ?",
    description: "Le vocabulaire des nombres d'un calcul.",
    generer() {
      const a = alea(3, 15), b = alea(3, 15);
      const [calc, bonne] = choisir([[`${a} + ${b}`, "termes"], [`${a + b} − ${b}`, "termes"], [`${a} × ${b}`, "facteurs"]]);
      const [n1, n2] = calc.split(/ [+−×] /);
      return {
        consigne: `Dans le calcul ${calc}, comment appelle-t-on les nombres ${n1} et ${n2} ?`,
        choix: ["des termes", "des facteurs"],
        verifier: (v, c) => ({ etat: c === "des " + bonne ? "juste" : "faux" }),
        indice: "On parle de facteurs dans une multiplication, de termes dans une addition ou une soustraction.",
        correction: bonne === "facteurs" ? "Dans un produit, les nombres multipliés sont les facteurs." : "Dans une somme ou une différence, les nombres sont les termes."
      };
    }
  },

  {
    groupe: F1,
    id: "calculer-mots",
    titre: "Calculer à partir d'une phrase",
    description: "La somme de…, le produit de…",
    generer() {
      const [txt, r] = choisir([
        (() => { const a = alea(11, 49) / 10, b = alea(11, 49) / 10; return [`la somme de ${nb(a)} et de ${nb(b)}`, a + b]; })(),
        (() => { const a = alea(5, 15), b = alea(11, 49) / 10; return [`la différence de ${a} et de ${nb(b)}`, a - b]; })(),
        (() => { const a = alea(2, 9) / 10, b = alea(3, 9); return [`le produit de ${nb(a)} par ${b}`, a * b]; })(),
        (() => { const a = choisir([20, 30, 40, 50]), b = choisir([0.02, 0.03, 0.04]); return [`le produit de ${a} par ${nb(b)}`, a * b]; })(),
        (() => { const b = alea(3, 9), q = alea(3, 12); return [`le quotient de ${b * q} par ${b}`, q]; })(),
        (() => { const a = alea(3, 30); return [`le double de ${nb(a + 0.5)}`, 2 * (a + 0.5)]; })(),
        (() => { const a = alea(3, 25) * 2; return [`la moitié de ${a}`, a / 2]; })()
      ]);
      return {
        consigne: `Calcule ${txt}.`,
        ligne: "[d]",
        verifier: v => verifierNombre(v[0], rr(r)),
        indice: "Somme : +, différence : −, produit : ×, quotient : ÷. Le double : × 2, la moitié : ÷ 2.",
        correction: `${txt.charAt(0).toUpperCase() + txt.slice(1)} est égal(e) à ${nb(r)}.`
      };
    }
  },

  {
    groupe: F1,
    id: "choisir-operation",
    titre: "Quelle opération ?",
    description: "Choisir l'opération qui résout le problème.",
    generer() {
      const a = alea(4, 9), b = alea(12, 30);
      const [t, op, r] = choisir([
        [`Un carton contient ${a} boîtes de ${b} œufs. Combien d'œufs y a-t-il en tout ?`, "×", a * b],
        [`${a * b} élèves sont répartis en ${a} groupes égaux. Combien y a-t-il d'élèves par groupe ?`, "÷", b],
        [`Un livre a ${b * 10} pages. Tom en a lu ${b * 10 - a * 7}. Combien lui en reste-t-il ?`, "−", a * 7],
        [`Lina a ${b} € et reçoit ${a * 5} € pour son anniversaire. Combien a-t-elle maintenant ?`, "+", b + a * 5],
        [`Des stylos coûtent ${a} € chacun. Avec ${a * b} €, combien peut-on en acheter ?`, "÷", b],
        [`Léo mesure ${130 + b} cm et sa sœur ${130 + b + a} cm. Quel est l'écart de taille ?`, "−", a]
      ]);
      return {
        consigne: t + "<br>Quelle opération faut-il effectuer ?",
        choix: ["+", "−", "×", "÷"],
        verifier: (v, c) => ({ etat: c === op ? "juste" : "faux" }),
        indice: "Ajouter → +, enlever ou chercher un écart → −, répéter une même quantité → ×, partager en parts égales → ÷.",
        correction: `Il faut effectuer une ${{ "+": "addition", "−": "soustraction", "×": "multiplication", "÷": "division" }[op]} : le résultat est ${nb(r)}.`
      };
    }
  },

  {
    groupe: F1,
    id: "ordre-grandeur",
    titre: "Le résultat vraisemblable",
    description: "Contrôler avec un ordre de grandeur.",
    generer() {
      const [calc, r, og] = choisir([
        (() => { const a = alea(4, 9) * 10 + choisir([-1, 1]), b = alea(2, 6) * 10 + choisir([-1, 1]); return [`${a} × ${b}`, a * b, `${Math.round(a / 10) * 10} × ${Math.round(b / 10) * 10} = ${nb(Math.round(a / 10) * 10 * Math.round(b / 10) * 10)}`]; })(),
        (() => { const a = alea(31, 89) / 10, b = alea(21, 69) / 10; return [`${nb(a)} × ${nb(b)}`, a * b, `${Math.round(a)} × ${Math.round(b)} = ${Math.round(a) * Math.round(b)}`]; })(),
        (() => { const a = alea(2, 8) * 100 - alea(1, 4), b = alea(2, 8) * 100 + alea(1, 4); return [`${a} + ${b}`, a + b, `${Math.round(a / 100) * 100} + ${Math.round(b / 100) * 100} = ${nb(Math.round(a / 100) * 100 + Math.round(b / 100) * 100)}`]; })(),
        (() => { const d = alea(2, 4) * 10 + 1, q = alea(12, 48); return [`${d * q} ÷ ${d}`, q, `environ ${nb(Math.round(d * q / 100) * 100)} ÷ ${d - 1}`]; })()
      ]);
      const opts = melanger([r, r * 10, r / 10]).map(x => nb(rr(x)));
      return {
        consigne: `Sans poser le calcul, quel est le résultat de <strong>${calc}</strong> ?`,
        choix: opts,
        verifier: (v, c) => ({ etat: c === nb(rr(r)) ? "juste" : "faux" }),
        indice: "Arrondis chaque nombre pour calculer un ordre de grandeur.",
        correction: `Ordre de grandeur : ${og}. Le résultat est ${nb(rr(r))}.`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "priorite-simple",
    titre: "La multiplication d'abord",
    description: "Deux opérations, sans parenthèses.",
    generer() {
      const a = alea(2, 20), b = alea(2, 9), c = alea(2, 9);
      const [e, et] = choisir([
        [`${a} + ${b}*${c}`, [`${a} + ${b * c}`]],
        [`${b}*${c} + ${a}`, [`${b * c} + ${a}`]],
        [`${b * c + a} - ${b}*${c}`, [`${b * c + a} - ${b * c}`]],
        [`${a} + ${b * c}/${b}`, [`${a} + ${c}`]],
        [`${a + b * 3} - ${b * c}/${c}`, [`${a + b * 3} - ${b}`]]
      ]);
      return calculerExpr(e, et, "La multiplication et la division sont prioritaires sur l'addition et la soustraction.");
    }
  },

  {
    groupe: F2,
    id: "gauche-droite",
    titre: "De gauche à droite",
    description: "Des opérations de même priorité.",
    generer() {
      const a = alea(20, 60), b = alea(2, 15), c = alea(2, 15);
      const d = alea(2, 6), q = alea(2, 6), m = alea(2, 5);
      const [e, et] = choisir([
        [`${a} - ${b} + ${c}`, [`${a - b} + ${c}`]],
        [`${a} - ${b} - ${c}`, [`${a - b} - ${c}`]],
        [`${d * q}/${d}*${m}`, [`${q}*${m}`]],
        [`${d * q * m}/${q}/${m}`, [`${d * m}/${m}`]]
      ]);
      return calculerExpr(e, et, "Quand les opérations ont la même priorité, on calcule de gauche à droite.");
    }
  },

  {
    groupe: F2,
    id: "trois-operations",
    titre: "Calculer en plusieurs étapes",
    description: "Trois opérations, sans parenthèses.",
    generer() {
      const a = alea(10, 60), b = alea(2, 9), c = alea(2, 9), d = alea(2, 9), e2 = alea(2, 6);
      const [e, et] = choisir([
        [`${a} + ${b}*${c} - ${d}`, [`${a} + ${b * c} - ${d}`, `${a + b * c} - ${d}`]],
        [`${b}*${c} - ${d * e2}/${e2}`, [`${b * c} - ${d}`]],
        [`${a + b * c} - ${b}*${c} + ${d}`, [`${a + b * c} - ${b * c} + ${d}`, `${a} + ${d}`]],
        [`${b * e2}/${e2}*${c} + ${d}`, [`${b}*${c} + ${d}`, `${b * c} + ${d}`]],
        [`${d} + ${b}*${c}*${e2}`, [`${d} + ${b * c}*${e2}`, `${d} + ${b * c * e2}`]]
      ]);
      return calculerExpr(e, et, "D'abord × et ÷ (de gauche à droite), puis + et − (de gauche à droite).");
    }
  },

  {
    groupe: F2,
    id: "vrai-faux-priorites",
    titre: "Vrai ou faux ?",
    description: "Repérer les erreurs de priorité.",
    generer() {
      const a = alea(2, 9), b = alea(2, 9), c = alea(2, 9), n = alea(15, 40);
      const [e, propose] = choisir([
        [`${a} + ${b}*${c}`, choisir([(a + b) * c, a + b * c])],
        [`${n} - ${b} + ${c}`, choisir([n - (b + c), n - b + c])],
        [`${n + b * c} - ${b}*${c}`, choisir([(n + b * c - b) * c, n])],
        [`${b * c * 2}/${c}*2`, choisir([b * 4, b])]
      ]);
      const r = val(e), vrai = egal(r, propose);
      return {
        consigne: `Est-il vrai que <strong>${ecr(e)} = ${nb(propose)}</strong> ?`,
        choix: ["Vrai", "Faux"],
        verifier: (v, c2) => ({ etat: (c2 === "Vrai") === vrai ? "juste" : "faux" }),
        indice: "Respecte les priorités : × et ÷ d'abord ; à priorité égale, de gauche à droite.",
        correction: `${ecr(e)} = ${nb(r)} : c'est ${vrai ? "vrai" : "faux"}.`
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "parentheses",
    titre: "Calculs avec parenthèses",
    description: "Les parenthèses en premier.",
    generer() {
      const a = alea(2, 12), b = alea(2, 9), c = alea(2, 9), d = alea(2, 6);
      const [e, et] = choisir([
        [`(${a} + ${b})*${c}`, [`${a + b}*${c}`]],
        [`${c}*(${a + b} - ${b})`, [`${c}*${a}`]],
        [`(${a * d + d} - ${d})/${d}`, [`${a * d}/${d}`]],
        [`${(a + b) * c + 5} - (${a} + ${b})*${c}`, [`${(a + b) * c + 5} - ${a + b}*${c}`, `${(a + b) * c + 5} - ${(a + b) * c}`]],
        [`(${a} + ${b})*(${c} + ${d})`, [`${a + b}*${c + d}`]],
        [`${a} + ${b}*(${c} + ${d})`, [`${a} + ${b}*${c + d}`, `${a} + ${b * (c + d)}`]]
      ]);
      return calculerExpr(e, et, "On effectue d'abord les calculs entre parenthèses.");
    }
  },

  {
    groupe: F3,
    id: "crochets",
    titre: "Parenthèses dans des crochets",
    description: "Commencer par les plus intérieures.",
    generer() {
      const a = alea(2, 6), b = alea(2, 6), c = alea(2, 5), k = alea(2, 4);
      const n = k * (a + b) * c + alea(5, 30);
      const [e, et] = choisir([
        [`${n} - [${c}*(${a} + ${b})]`, [`${n} - [${c}*${a + b}]`, `${n} - ${c * (a + b)}`]],
        [`${k}*[${a * c + 20} - (${a} + ${a * c - a})]`, [`${k}*[${a * c + 20} - ${a * c}]`, `${k}*20`]],
        [`[${a} + ${b}*(${c + 1} - 1)]*${k}`, [`[${a} + ${b}*${c}]*${k}`, `[${a} + ${b * c}]*${k}`, `${a + b * c}*${k}`]]
      ]);
      return calculerExpr(e, et, "On calcule d'abord dans les parenthèses les plus intérieures, puis dans les crochets.");
    }
  },

  {
    groupe: F3,
    id: "trait-fraction",
    titre: "Le trait de fraction",
    description: "Numérateur et dénominateur d'abord.",
    generer() {
      const q = alea(2, 9), d1 = alea(2, 4), d2 = alea(2, 3), den = d1 * d2;
      const num = q * den, x = alea(1, num - 1);
      const [haut, bas, h, b] = choisir([
        [`${x} + ${num - x}`, `${d1} × ${d2}`, num, den],
        [`${num + x} − ${x}`, `${den + d1} − ${d1}`, num, den],
        [`${q} × ${den}`, `${d1 + 1} + ${den - d1 - 1}`, num, den]
      ]);
      return {
        consigne: `Calcule : ${frac(haut, bas)}`,
        figure: undefined,
        ligne: `${frac(haut, bas)} = [d]`,
        verifier: v => verifierNombre(v[0], q),
        indice: "Le trait de fraction joue le rôle de parenthèses : calcule le numérateur et le dénominateur, puis divise.",
        correction: `${frac(haut, bas)} = ${frac(h, b)} = ${q}`
      };
    }
  },

  {
    groupe: F3,
    id: "nature",
    titre: "La nature d'une expression",
    description: "Somme, différence, produit ou quotient ?",
    generer() {
      const a = alea(2, 20), b = alea(2, 9), c = alea(2, 9);
      const [e, k] = choisir([
        [`${a} + ${b} × ${c}`, 0], [`(${a} + ${b}) × ${c}`, 2], [`${a + b * c} − ${b} × ${c}`, 1], [`(${a + b * c} − ${b}) × ${c}`, 2],
        [`${b} × ${c} + ${a}`, 0], [`(${a * b} − ${b}) ÷ ${b}`, 3], [`${a * b} − ${b} ÷ ${b}`, 1], [`${b} × (${c} + ${a})`, 2],
        [`(${a} + ${b}) ÷ (${c} + 1)`, 3], [`${a} × ${b} − ${c}`, 1]
      ]);
      return {
        consigne: `L'expression <strong>${e}</strong> est…`,
        choix: NATURES,
        verifier: (v, ch) => ({ etat: ch === NATURES[k] ? "juste" : "faux" }),
        indice: "Cherche la dernière opération à effectuer en respectant les priorités.",
        correction: `La dernière opération effectuée est ${["une addition", "une soustraction", "une multiplication", "une division"][k]} : c'est ${NATURES[k]}.`
      };
    }
  },

  {
    groupe: F3,
    id: "placer-parentheses",
    titre: "Où placer les parenthèses ?",
    description: "Choisir l'écriture qui donne le bon résultat.",
    generer() {
      const a = alea(2, 9), b = alea(2, 9), c = alea(2, 6);
      const ecritures = [`${a} + ${b} × ${c}`, `(${a} + ${b}) × ${c}`, `${a} + (${b} × ${c})`];
      const cible = (a + b) * c;
      return {
        consigne: `Quelle écriture est égale à <strong>${cible}</strong> ?`,
        choix: melanger([...ecritures]),
        verifier: (v, ch) => ({ etat: ch === ecritures[1] ? "juste" : "faux" }),
        indice: "Calcule chaque écriture en respectant les priorités.",
        correction: `(${a} + ${b}) × ${c} = ${a + b} × ${c} = ${cible}. Sans parenthèses (ou avec les parenthèses autour du produit), on obtient ${a + b * c}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "programme-calcul",
    titre: "Programme de calcul",
    description: "Appliquer un programme à un nombre.",
    generer() {
      const n = choisir([alea(2, 12), alea(2, 12) + 0.5]);
      const a = alea(2, 9), b = alea(2, 6);
      const [etapes, f, expr] = choisir([
        [[`Ajouter ${a}.`, `Multiplier le résultat par ${b}.`], x => (x + a) * b, x => `(${nb(x)} + ${a}) × ${b}`],
        [[`Multiplier par ${b}.`, `Ajouter ${a}.`], x => x * b + a, x => `${nb(x)} × ${b} + ${a}`],
        [[`Soustraire 1.`, `Multiplier par ${b}.`, `Ajouter ${a}.`], x => (x - 1) * b + a, x => `(${nb(x)} − 1) × ${b} + ${a}`],
        [[`Multiplier par 2.`, `Ajouter ${a}.`, `Multiplier le résultat par ${b}.`], x => (2 * x + a) * b, x => `(${nb(x)} × 2 + ${a}) × ${b}`]
      ]);
      return {
        consigne: `Voici un programme de calcul :<br>• Choisir un nombre.<br>• ${etapes.join("<br>• ")}<br>Quel résultat obtient-on avec ${nb(n)} ?`,
        ligne: "[d]",
        verifier: v => verifierNombre(v[0], rr(f(n))),
        indice: "Suis les étapes dans l'ordre, ou écris une seule expression avec des parenthèses.",
        correction: `${expr(n)} = ${nb(rr(f(n)))}`
      };
    }
  },

  {
    groupe: F4,
    id: "phrase-expression",
    titre: "De la phrase à l'expression",
    description: "Choisir l'expression qui traduit la phrase.",
    generer() {
      const a = alea(2, 12), b = alea(2, 9), c = alea(2, 9);
      const items = [
        [`la somme de ${a} et du produit de ${b} par ${c}`, `${a} + ${b} × ${c}`],
        [`le produit de la somme de ${a} et de ${b} par ${c}`, `(${a} + ${b}) × ${c}`],
        [`la différence entre ${a + 30} et le produit de ${b} par ${c}`, `${a + 30} − ${b} × ${c}`],
        [`le produit de la différence entre ${a + 30} et ${b} par ${c}`, `(${a + 30} − ${b}) × ${c}`],
        [`le triple de la somme de ${a} et de ${b}`, `3 × (${a} + ${b})`],
        [`la somme du triple de ${a} et de ${b}`, `3 × ${a} + ${b}`]
      ];
      const k = alea(0, items.length - 1), paire = k % 2 === 0 ? k + 1 : k - 1;
      const [phrase, bonne] = items[k];
      const autres = items.filter((_, i) => i !== k && i !== paire).map(x => x[1]);
      return {
        consigne: `Quelle expression traduit : « ${phrase} » ?`,
        choix: melanger([bonne, items[paire][1], choisir(autres)]),
        verifier: (v, ch) => ({ etat: ch === bonne ? "juste" : "faux" }),
        indice: "Le premier mot (somme, différence, produit…) donne la dernière opération à effectuer.",
        correction: `« ${phrase} » s'écrit ${bonne}.`
      };
    }
  },

  {
    groupe: F4,
    id: "phrase-calcul",
    titre: "Calculer une phrase",
    description: "Traduire, puis calculer.",
    generer() {
      const a = alea(2, 15), b = alea(2, 9), c = alea(2, 9);
      const [phrase, expr] = choisir([
        [`le double de la somme de ${a} et de ${b}`, `2*(${a} + ${b})`],
        [`la somme du double de ${a} et de ${b}`, `2*${a} + ${b}`],
        [`la moitié de la différence entre ${a + 2 * b + 10} et ${a}`, `(${a + 2 * b + 10} - ${a})/2`],
        [`le produit de ${c} par la somme de ${a} et de ${b}`, `${c}*(${a} + ${b})`],
        [`le quotient de la somme de ${a * c} et de ${b * c} par ${c}`, `(${a * c} + ${b * c})/${c}`]
      ]);
      return {
        consigne: `Calcule ${phrase}.`,
        ligne: "[d]",
        verifier: v => verifierNombre(v[0], val(expr)),
        indice: "Écris d'abord l'expression : la dernière opération est donnée par le premier mot de la phrase.",
        correction: `${ecr(expr)} = ${nb(val(expr))}`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "developper",
    titre: "Développer avec la distributivité",
    description: "k × (a + b) = k × a + k × b",
    generer() {
      const k = alea(3, 12), a = choisir([10, 20, 100]), b = alea(1, 9), plus = choisir([true, false]);
      const s = plus ? "+" : "−", r = plus ? k * (a + b) : k * (a - b);
      return {
        consigne: `Complète, puis calcule : ${k} × (${a} ${s} ${b})`,
        ligne: `${k} × (${a} ${s} ${b}) = ${k} × ${a} ${s} ${k} × [n] = [n]`,
        verifier: v => {
          const x = lireEntier(v[0]), y = lireNombre(v[1]);
          if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux cases." };
          return x === b && y === r ? { etat: "juste" } : { etat: "faux", message: x !== b ? `Le facteur ${k} multiplie chaque terme de la parenthèse.` : "" };
        },
        indice: "On multiplie chaque terme de la parenthèse par le facteur devant.",
        correction: `${k} × (${a} ${s} ${b}) = ${k} × ${a} ${s} ${k} × ${b} = ${k * a} ${s} ${k * b} = ${r}`
      };
    }
  },

  {
    groupe: F5,
    id: "astucieux",
    titre: "Calcul mental astucieux",
    description: "× 99, × 101, × 19, × 102…",
    generer() {
      const k = alea(12, 49), [m, base, ec] = choisir([[99, 100, -1], [101, 100, 1], [98, 100, -2], [102, 100, 2], [19, 20, -1], [21, 20, 1], [9, 10, -1], [11, 10, 1], [1001, 1000, 1]]);
      const r = k * m, s = ec > 0 ? "+" : "−";
      return {
        consigne: `Calcule mentalement : <strong>${k} × ${m}</strong>`,
        ligne: `${k} × ${m} = [n]`,
        verifier: v => verifierNombre(v[0], r),
        indice: `Écris ${m} = ${base} ${s} ${Math.abs(ec)} et utilise la distributivité.`,
        correction: `${k} × ${m} = ${k} × (${base} ${s} ${Math.abs(ec)}) = ${nb(k * base)} ${s} ${k * Math.abs(ec)} = ${nb(r)}`
      };
    }
  },

  {
    groupe: F5,
    id: "factoriser",
    titre: "Factoriser pour calculer",
    description: "k × a + k × b = k × (a + b)",
    generer() {
      const [a, b] = choisir([[13, 87], [45, 55], [27, 73], [6, 4], [7, 3], [15, 85], [36, 64]]);
      const k = choisir([alea(3, 29), alea(11, 49) / 10]);
      const plus = choisir([true, false]);
      const [x, y] = plus ? [a, b] : [a + b + 10, 10];
      const sx = plus ? "+" : "−", tot = plus ? a + b : x - y;
      const r = rr(k * tot);
      return {
        consigne: `Calcule astucieusement : <strong>${nb(k)} × ${x} ${sx} ${nb(k)} × ${y}</strong>`,
        ligne: "[d]",
        verifier: v => verifierNombre(v[0], r),
        indice: `Le facteur ${nb(k)} est commun : ${nb(k)} × (${x} ${sx} ${y}).`,
        correction: `${nb(k)} × ${x} ${sx} ${nb(k)} × ${y} = ${nb(k)} × (${x} ${sx} ${y}) = ${nb(k)} × ${tot} = ${nb(r)}`
      };
    }
  },

  {
    groupe: F5,
    id: "distrib-vrai-faux",
    titre: "Distributivité : vrai ou faux ?",
    description: "Repérer les erreurs classiques.",
    generer() {
      const k = alea(3, 9), a = alea(5, 20), b = alea(2, 9);
      const [t, vrai, exp] = choisir([
        [`${k} × (${a} + ${b}) = ${k} × ${a} + ${b}`, false, `il faut aussi multiplier ${b} par ${k} : ${k} × ${a} + ${k} × ${b}`],
        [`${k} × (${a} + ${b}) = ${k} × ${a} + ${k} × ${b}`, true, "c'est la distributivité"],
        [`${k} × (${a} − ${b}) = ${k * a} − ${k * b}`, true, `${k} × ${a} − ${k} × ${b} = ${k * a} − ${k * b}`],
        [`${k} × (${a} − ${b}) = ${k * a} − ${b}`, false, `il faut aussi multiplier ${b} par ${k}`],
        [`${k} × ${a + 10} = ${k} × ${a} + ${k} × 10`, true, `${a + 10} = ${a} + 10`],
        [`${k} × ${a} + ${k} × ${b} = ${k} × (${a} + ${b})`, true, "on a factorisé par " + k]
      ]);
      return {
        consigne: `Vrai ou faux ? <strong>${t}</strong>`,
        choix: ["Vrai", "Faux"],
        verifier: (v, c) => ({ etat: (c === "Vrai") === vrai ? "juste" : "faux" }),
        indice: "Dans k × (a + b), le facteur k multiplie chaque terme.",
        correction: `${vrai ? "Vrai" : "Faux"} : ${exp}.`
      };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "probleme-expression",
    titre: "Quelle expression pour ce problème ?",
    description: "Traduire un problème par une seule expression.",
    generer() {
      const a = alea(2, 5), p = alea(6, 15), b = alea(2, 6), q = alea(2, 9), m = a * p + q < 50 ? choisir([50, 100]) : 100;
      const [t, bonne, fausses, r, u] = choisir([
        [`Inès a ${m} €. Elle achète ${a} livres à ${p} € et un DVD à ${q} €. Combien lui reste-t-il ?`,
          `${m} − (${a} × ${p} + ${q})`, [`${m} − ${a} × ${p} + ${q}`, `(${m} − ${a}) × ${p} + ${q}`], m - (a * p + q), "€"],
        [`Au cinéma, ${a} adultes paient ${p} € et ${b} enfants paient ${q} €. Quel est le prix total ?`,
          `${a} × ${p} + ${b} × ${q}`, [`(${a} + ${b}) × (${p} + ${q})`, `${a} × (${p} + ${b}) × ${q}`], a * p + b * q, "€"],
        [`${a * 2} amis achètent ${a} pizzas à ${p} € et partagent la note en parts égales. Combien paie chacun ?`,
          `${a} × ${p} ÷ ${a * 2}`, [`${a} + ${p} ÷ ${a * 2}`, `${a} × (${p} − ${a * 2})`], rr(p / 2), "€"],
        [`Une classe de ${20 + q} élèves et ${a} accompagnateurs paient chacun ${p} € d'entrée. Quel est le prix total ?`,
          `(${20 + q} + ${a}) × ${p}`, [`${20 + q} + ${a} × ${p}`, `${20 + q} × ${a} + ${p}`], (20 + q + a) * p, "€"]
      ]);
      return {
        consigne: t,
        choix: melanger([bonne, ...fausses]),
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Repère l'ordre des étapes et pense aux parenthèses pour le calcul à faire en premier.",
        correction: `${bonne} = ${nb(r)} ${u}`
      };
    }
  },

  {
    groupe: F6,
    id: "probleme-etapes",
    titre: "Problèmes à étapes",
    description: "Résoudre et vérifier la vraisemblance.",
    generer() {
      const a = alea(2, 5), p = alea(8, 15), b = alea(2, 6), q = choisir([4.5, 6.5, 7.5, 5.5]), reste = alea(5, 30);
      const [t, expr, u] = choisir([
        [`Au cinéma, ${a} adultes paient ${p} € chacun et ${b} enfants ${nb(q)} € chacun. Quel est le prix total ?`, `${a}*${p} + ${b}*${q}`, "€"],
        [`Un fleuriste a ${a * 12 * 10 + reste} roses. Il fait ${a * 10} bouquets de 12 roses. Combien lui en reste-t-il ?`, `${a * 12 * 10 + reste} - ${a * 10}*12`, "roses"],
        [`Une carte de piscine coûte 25 €, puis chaque entrée ${nb(q)} €. Combien coûtent ${p} entrées avec la carte ?`, `25 + ${p}*${q}`, "€"],
        [`Un cycliste fait ${a} tours d'un circuit de 4,2 km, puis ${b} tours d'un circuit de 2,5 km. Quelle distance a-t-il parcourue ?`, `${a}*4.2 + ${b}*2.5`, "km"]
      ]);
      const r = val(expr);
      return {
        consigne: t,
        ligne: `[d] ${u}`,
        verifier: v => verifierNombre(v[0], r),
        indice: "Écris une seule expression, puis calcule en respectant les priorités.",
        correction: `${ecr(expr)} = ${nb(r)} ${u}`
      };
    }
  },

  {
    groupe: F6,
    id: "compte-est-bon",
    titre: "Le compte est bon",
    description: "Écrire une expression qui atteint la cible.",
    generer() {
      const tirages = [
        [[3, 5, 8, 10], 95, "10 × 8 + 5 × 3"], [[2, 4, 6, 25], 156, "25 × 6 + 4 + 2"], [[3, 7, 9, 50], 471, "50 × 9 + 7 × 3"],
        [[1, 4, 5, 8, 75], 309, "75 × 4 + 8 + 1"], [[2, 3, 7, 9], 90, "(7 + 3) × 9"], [[2, 5, 6, 10, 100], 456, "(100 − 10) × 5 + 6"],
        [[2, 3, 4, 6], 24, "6 × 3 + 4 + 2"], [[1, 3, 5, 7, 25], 180, "(5 + 1) × 25 + 3 × 7 + ..."],
        [[2, 5, 7, 10], 63, "7 × 10 − 5 − 2"], [[3, 4, 6, 50], 312, "50 × 6 + 4 × 3"], [[2, 4, 8, 9, 25], 211, "25 × 8 + 9 + 2"],
        [[1, 5, 6, 9, 10], 59, "6 × 10 − 1"], [[2, 3, 6, 75], 228, "75 × 3 + 6 ÷ 2"]
      ];
      const [nombres, cible, sol] = choisir(tirages);
      const champ = champExpression();
      return {
        consigne: `Avec les nombres <strong>${nombres.join(" ; ")}</strong> (chacun au plus une fois), les opérations + − × ÷ et des parenthèses, écris une expression égale à <strong>${cible}</strong>.`,
        figure: champ,
        verifier() {
          const t = champ.value.trim();
          if (!t) return { etat: "incomplet", message: "Écris ton expression dans la case." };
          const x = evaluerExpression(t);
          if (isNaN(x)) return { etat: "incomplet", message: "Ton expression est mal écrite (vérifie les parenthèses et les signes)." };
          const dispo = [...nombres];
          for (const n of nombresUtilises(t)) {
            const i = dispo.findIndex(d => d === n);
            if (i < 0) return { etat: "faux", message: `Le nombre ${nb(n)} n'est pas disponible (ou il est utilisé deux fois).` };
            dispo.splice(i, 1);
          }
          return egal(x, cible) ? { etat: "juste" } : { etat: "faux", message: `Ton expression vaut ${nb(rr(x))}, pas ${cible}.` };
        },
        indice: "Cherche d'abord un produit proche de la cible, puis ajuste avec les nombres restants.",
        correction: `Une solution possible : ${sol} = ${cible}.`,
        bloquer: () => { champ.disabled = true; }
      };
    }
  },
  /* ================= Feuille 7 ================= */
  {
    groupe: F7,
    id: "convertir-durees",
    titre: "Convertir des durées",
    description: "1 h = 60 min ; 0,5 h = 30 min.",
    generer() {
      const type = choisir(["hmin-min", "min-hmin", "dec-hmin"]);
      if (type === "hmin-min") {
        const h = alea(1, 5), m = alea(1, 59);
        return { consigne: `Convertis <strong>${h} h ${m} min</strong> en minutes.`, ligne: "[n] min",
          verifier: v => verifierNombre(v[0], 60 * h + m), indice: "1 h = 60 min : multiplie les heures par 60, puis ajoute les minutes.",
          correction: `${h} × 60 + ${m} = ${60 * h + m} min` };
      }
      if (type === "min-hmin") {
        const n = alea(61, 400), h = Math.floor(n / 60), m = n % 60;
        return { consigne: `Convertis <strong>${n} min</strong> en heures et minutes.`, ligne: "[n] h [n] min",
          verifier: v => { const a = verifierNombre(v[0], h), b = verifierNombre(v[1], m); return a.etat === "incomplet" || b.etat === "incomplet" ? { etat: "incomplet", message: "Remplis les deux cases." } : a.etat === "juste" && b.etat === "juste" ? { etat: "juste" } : { etat: "faux" }; },
          indice: "Cherche combien de fois 60 min il y a dans ce nombre : c'est la division euclidienne par 60.",
          correction: `${n} = 60 × ${h} + ${m} : ${n} min = ${h} h ${m} min` };
      }
      const [d, m] = choisir([[0.5, 30], [0.25, 15], [0.75, 45], [0.1, 6], [0.2, 12]]), h = alea(0, 4);
      return { consigne: `Convertis <strong>${nb(h + d)} h</strong> en heures et minutes.`, ligne: "[n] h [n] min",
        verifier: v => { const a = verifierNombre(v[0], h), b = verifierNombre(v[1], m); return a.etat === "incomplet" || b.etat === "incomplet" ? { etat: "incomplet", message: "Remplis les deux cases." } : a.etat === "juste" && b.etat === "juste" ? { etat: "juste" } : (lireNombre(v[1]) === Math.round(d * 100) ? { etat: "faux", message: "Attention : une heure n'a que 60 minutes. Calcule " + nb(d) + " × 60." } : { etat: "faux" }); },
        indice: `${nb(d)} h, c'est ${nb(d)} × 60 min.`, correction: `${nb(h + d)} h = ${h} h + ${nb(d)} × 60 min = ${h} h ${m} min` };
    }
  },

  {
    groupe: F7,
    id: "calculer-duree",
    titre: "Calculer une durée",
    description: "Entre deux horaires.",
    generer() {
      const dep = alea(6 * 60, 18 * 60) , du = alea(20, 300), arr = dep + du;
      const f = x => `${Math.floor(x / 60)} h ${String(x % 60).padStart(2, "0")}`;
      return {
        consigne: `Un car part à <strong>${f(dep)}</strong> et arrive à <strong>${f(arr)}</strong>. Combien de temps a duré le trajet ?`,
        ligne: "[n] h [n] min",
        verifier: v => { const a = verifierNombre(v[0], Math.floor(du / 60)), b = verifierNombre(v[1], du % 60); return a.etat === "incomplet" || b.etat === "incomplet" ? { etat: "incomplet", message: "Remplis les deux cases (0 si besoin)." } : a.etat === "juste" && b.etat === "juste" ? { etat: "juste" } : { etat: "faux" }; },
        indice: "Avance jusqu'à l'heure ronde suivante, puis d'heure en heure, puis jusqu'à l'arrivée, et additionne les bonds.",
        correction: `Durée : ${fdur(du)}.`
      };
    }
  },

  {
    groupe: F7,
    id: "horaire-arrivee",
    titre: "Trouver un horaire",
    description: "Départ + durée = arrivée.",
    generer() {
      const dep = alea(7 * 60, 22 * 60), du = alea(25, 240), arr = (dep + du) % 1440;
      const f = x => `${Math.floor(x / 60)} h ${String(x % 60).padStart(2, "0")}`;
      return {
        consigne: `Un film commence à <strong>${f(dep)}</strong> et dure <strong>${fdur(du)}</strong>. À quelle heure se termine-t-il ?`,
        ligne: "[n] h [n]",
        verifier: v => { const a = verifierNombre(v[0], Math.floor(arr / 60)), b = verifierNombre(v[1], arr % 60); return a.etat === "incomplet" || b.etat === "incomplet" ? { etat: "incomplet", message: "Remplis les deux cases." } : a.etat === "juste" && b.etat === "juste" ? { etat: "juste" } : { etat: "faux" }; },
        indice: "Ajoute les heures, puis les minutes. Si tu dépasses 60 min, convertis 60 min en 1 h (et après 24 h, on recommence à 0 h).",
        correction: `Il se termine à ${f(arr)}.`
      };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "13 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Le vocabulaire des opérations", activites: ["vocabulaire", "termes-facteurs"] },
    { competence: "Choisir l'opération", activites: ["choisir-operation"] },
    { competence: "Contrôler avec un ordre de grandeur", activites: ["ordre-grandeur"] },
    { competence: "Les priorités opératoires", activites: ["priorite-simple", "trois-operations"] },
    { competence: "Calculer de gauche à droite", activites: ["gauche-droite"] },
    { competence: "Calculer avec des parenthèses", activites: ["parentheses", "crochets"] },
    { competence: "Le trait de fraction", activites: ["trait-fraction"] },
    { competence: "La nature d'une expression", activites: ["nature"] },
    { competence: "Traduire par une expression", activites: ["phrase-expression", "programme-calcul"] },
    { competence: "Développer avec la distributivité", activites: ["developper", "distrib-vrai-faux"] },
    { competence: "Calculer astucieusement", activites: ["astucieux", "factoriser"] },
    { competence: "Résoudre un problème", activites: ["probleme-expression", "probleme-etapes"] },
    { competence: "Durées et horaires", activites: ["convertir-durees", "calculer-duree", "horaire-arrivee"] }
  ]
};
