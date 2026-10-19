/* =====================================================================
   EXERCISEUR « CALCUL LITTÉRAL : RAISONNER ET RÉSOUDRE » — 5e, chapitre 11

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Démontrer avec des lettres";
const F2 = "Feuille 2 — Contre-exemples et conjectures";
const F3 = "Feuille 3 — Tester une solution";
const F4 = "Feuille 4 — Résoudre des équations";
const F5 = "Feuille 5 — Mettre un problème en équation";
const F6 = "Feuille 6 — Programmes et algorithmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
/* Monôme a·x écrit proprement : 1x → x */
const mono = (a, l = "x") => a === 1 ? l : nb(a) + l;
/* a x + b écrit proprement (b peut être négatif) */
const lin = (a, b, l = "x") => (a ? mono(a, l) : "") + (b ? (a ? (b > 0 ? " + " : " − ") + nb(Math.abs(b)) : nb(b)) : (a ? "" : "0"));
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });

function champ(placeholder = "ex. : 3n + 2") {
  return el("input", { class: "case", type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false",
    style: "width:min(13em,85vw);text-align:left", placeholder, "aria-label": "Ton expression" });
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "pair-impair",
    titre: "Pairs, impairs, multiples",
    description: "Quelle expression est toujours paire ? multiple de 3 ?",
    generer() {
      const [q, bonne, autres, expl] = choisir([
        ["n est un nombre entier. Quelle expression est <strong>toujours paire</strong> ?", "2n", ["n + 2", "2n + 1"], "2n = 2 × n est un multiple de 2."],
        ["n est un nombre entier. Quelle expression est <strong>toujours impaire</strong> ?", "2n + 1", ["n + 1", "2n"], "2n est pair, donc 2n + 1 est le nombre impair qui le suit."],
        ["n est un nombre entier. Quelle expression est <strong>toujours un multiple de 3</strong> ?", "3n + 6", ["n + 3", "3n + 1"], "3n + 6 = 3(n + 2) est un multiple de 3."],
        ["n est un nombre entier. Quelle expression est <strong>toujours un multiple de 5</strong> ?", "5n + 10", ["n + 5", "5n + 2"], "5n + 10 = 5(n + 2) est un multiple de 5."],
        ["n est un nombre entier. Quelle expression représente <strong>le nombre pair qui suit 2n</strong> ?", "2n + 2", ["2n + 1", "3n"], "Les nombres pairs vont de 2 en 2 : après 2n vient 2n + 2."],
        ["n est un nombre entier. Quelle expression représente <strong>trois entiers consécutifs</strong> ?", "n ; n + 1 ; n + 2", ["n ; 2n ; 3n", "n ; n + 2 ; n + 4"], "Des entiers consécutifs se suivent de 1 en 1."]
      ]);
      return { consigne: q, choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne),
        indice: "Un nombre pair s'écrit 2 × (un entier) ; un multiple de 3 s'écrit 3 × (un entier).",
        correction: `Réponse : ${bonne}. ${expl}` };
    }
  },

  {
    groupe: F1,
    id: "somme-consecutifs",
    titre: "Démontrer en réduisant",
    description: "n + (n + 1) + (n + 2) = …",
    generer() {
      const [e, att, txt, concl] = choisir([
        ["n + (n + 1) + (n + 2)", "3*n+3", "3n + 3", "3n + 3 = 3(n + 1) : la somme de trois entiers consécutifs est un multiple de 3."],
        ["n + (n + 1)", "2*n+1", "2n + 1", "2n + 1 est impair : la somme de deux entiers consécutifs est impaire."],
        ["(n − 1) + n + (n + 1)", "3*n", "3n", "La somme de trois entiers consécutifs est le triple de celui du milieu."],
        ["2n + 2(n + 1)", "4*n+2", "4n + 2", "4n + 2 = 2(2n + 1) : le résultat est pair."],
        ["n + (n + 1) + (n + 2) + (n + 3)", "4*n+6", "4n + 6", "4n + 6 = 2(2n + 3) : la somme de quatre entiers consécutifs est paire."]
      ]);
      const c = champ();
      return {
        consigne: `Écris la forme réduite de <strong>${e}</strong>.`,
        figure: c,
        verifier() {
          const t = c.value.trim();
          if (!t) return { etat: "incomplet", message: "Écris ton expression dans la case." };
          if (!lireExpression(t)) return { etat: "incomplet", message: "Ton expression est mal écrite : vérifie les signes et les parenthèses." };
          if (!equivalentes(t, att, ["n"])) return { etat: "faux" };
          const k = nbTermes(t);
          if (k === -1 || k > 2) return { etat: "faux", message: "Ton expression est juste, mais elle n'est pas réduite." };
          return { etat: "juste" };
        },
        indice: "Compte les n, puis additionne les nombres seuls.",
        correction: `${e} = ${txt}. ${concl}`,
        bloquer: () => { c.disabled = true; }
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "vrai-faux",
    titre: "Toujours vrai ?",
    description: "Démontrer ou trouver un contre-exemple.",
    generer() {
      const [aff, vrai, ex] = choisir([
        ["La somme de deux nombres pairs est paire.", true, "2a + 2b = 2(a + b)"],
        ["La somme de deux nombres impairs est impaire.", false, "3 + 5 = 8 est pair"],
        ["Le produit de deux entiers consécutifs est pair.", true, "l'un des deux est pair"],
        ["Tout nombre impair est premier.", false, "9 = 3 × 3 est impair mais pas premier"],
        ["Pour tout nombre x, 2x est plus grand que x.", false, "pour x = 0 : 2 × 0 = 0, ce n'est pas plus grand"],
        ["La somme de trois entiers consécutifs est un multiple de 3.", true, "n + (n + 1) + (n + 2) = 3(n + 1)"],
        ["Pour tout nombre x, x² + 1 est différent de 0.", true, "x² est positif ou nul, donc x² + 1 vaut au moins 1"],
        ["Un nombre divisible par 2 et par 4 est divisible par 8.", false, "4 est divisible par 2 et par 4, mais pas par 8"],
        ["Pour tout nombre x, (x + 2)² = x² + 4.", false, "pour x = 1 : 3² = 9 mais 1² + 4 = 5"],
        ["Le double d'un nombre impair est pair.", true, "2 × (un entier) est toujours pair"]
      ]);
      return {
        consigne: `« ${aff} » Cette affirmation est-elle toujours vraie ?`,
        choix: ["Toujours vraie", "Fausse (contre-exemple)"],
        verifier: (v, c) => ({ etat: (c === "Toujours vraie") === vrai ? "juste" : "faux" }),
        indice: "Teste plusieurs exemples (0 ; 1 ; 2 ; 9…). Un seul contre-exemple suffit pour prouver que c'est faux.",
        correction: vrai ? `Toujours vraie : ${ex}.` : `Fausse : ${ex}.`
      };
    }
  },

  {
    groupe: F2,
    id: "trouver-contre-exemple",
    titre: "Choisir un contre-exemple",
    description: "Quel nombre montre que c'est faux ?",
    generer() {
      const [aff, bonne, autres, expl] = choisir([
        ["Pour tout nombre x, x² est plus grand que x.", "0,5", ["3", "10"], "0,5² = 0,25 et 0,25 < 0,5"],
        ["Pour tout nombre x, 3x est plus grand que x.", "0", ["2", "5"], "3 × 0 = 0 : ce n'est pas plus grand que 0"],
        ["Tout nombre qui se termine par 4 est divisible par 4.", "14", ["24", "44"], "14 = 4 × 3 + 2 : le reste n'est pas nul"],
        ["Tout multiple de 3 est impair.", "6", ["9", "15"], "6 est un multiple de 3 et il est pair"],
        ["Pour tout entier n, n² + n + 1 est premier.", "4", ["1", "2"], "4² + 4 + 1 = 21 = 3 × 7"],
        ["Pour tout nombre x, x + x = x × x.", "3", ["0", "2"], "3 + 3 = 6 mais 3 × 3 = 9"],
        ["Tout nombre divisible par 3 est divisible par 9.", "12", ["18", "27"], "12 est divisible par 3 mais pas par 9"]
      ]);
      return {
        consigne: `« ${aff} » Quel nombre est un <strong>contre-exemple</strong> ?`,
        choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne),
        indice: "Teste l'affirmation avec chacun des nombres proposés : un contre-exemple la rend fausse.",
        correction: `${bonne} est un contre-exemple : ${expl}.`
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "tester-solution",
    titre: "Le nombre est-il solution ?",
    description: "On remplace x par le nombre dans chaque membre.",
    generer() {
      const a = alea(2, 6), c = alea(1, a - 1), b = alea(0, 9), x0 = alea(1, 8), test = choisir([x0, x0, x0 + 1, x0 - 1]);
      const d = a * x0 + b - c * x0;
      const g = a * test + b, dr = c * test + d, oui = g === dr;
      return {
        consigne: `Le nombre <strong>${test}</strong> est-il solution de l'équation <strong>${lin(a, b)} = ${lin(c, d)}</strong> ?`,
        choix: ["Oui", "Non"], verifier: choixVerif(oui ? "Oui" : "Non"),
        indice: "Calcule séparément le membre de gauche et le membre de droite en remplaçant x par le nombre, puis compare.",
        correction: `À gauche : ${a} × ${test}${b ? " + " + b : ""} = ${g}. À droite : ${c === 1 ? "" : c + " × "}${test}${d ? (d > 0 ? " + " : " − ") + Math.abs(d) : ""} = ${dr}. ${oui ? "Les deux membres sont égaux : " + test + " est solution." : "Les deux membres sont différents : " + test + " n'est pas solution."}`
      };
    }
  },

  {
    groupe: F3,
    id: "quelle-solution",
    titre: "Trouver la solution parmi trois",
    description: "Tester chaque nombre proposé.",
    generer() {
      const a = alea(2, 9), x0 = alea(1, 10), b = alea(1, 15), type = choisir(["+", "−", "×"]);
      const eq = type === "+" ? `${a}x + ${b} = ${a * x0 + b}` : type === "−" ? `${a}x − ${b} = ${a * x0 - b}` : `${a}x = ${a * x0}`;
      const autres = melanger([...new Set([x0 + 1, x0 + 2, x0 - 1, x0 + b, Math.max(0, x0 - 2)])].filter(v => v !== x0 && v >= 0)).slice(0, 2);
      return {
        consigne: `Quelle est la solution de l'équation <strong>${eq}</strong> ?`,
        choix: melanger([x0, ...autres].map(String)), verifier: choixVerif(String(x0)),
        indice: "Remplace x par chaque nombre proposé : un seul rend l'égalité vraie.",
        correction: `x = ${x0} car ${type === "×" ? `${a} × ${x0} = ${a * x0}` : type === "+" ? `${a} × ${x0} + ${b} = ${a * x0 + b}` : `${a} × ${x0} − ${b} = ${a * x0 - b}`}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "resoudre-addition",
    titre: "Équations x + b = c et x − b = c",
    description: "On soustrait ou on ajoute b.",
    generer() {
      const dec = Math.random() < 0.3, b = dec ? alea(11, 59) / 10 : alea(2, 40), x = dec ? alea(5, 99) / 10 : alea(1, 60);
      const type = choisir(["+", "+", "−", "b+"]);
      const c = type === "−" ? rr(x - b) : rr(x + b);
      if (c < 0) return this.generer();
      const eq = type === "+" ? `x + ${nb(b)} = ${nb(c)}` : type === "b+" ? `${nb(b)} + x = ${nb(c)}` : `x − ${nb(b)} = ${nb(c)}`;
      return {
        consigne: `Résous l'équation <strong>${eq}</strong>.`,
        ligne: "x = [r]",
        verifier: v => verifierNombre(v[0], x),
        indice: type === "−" ? `Pour défaire « − ${nb(b)} », on ajoute ${nb(b)}.` : `Pour défaire « + ${nb(b)} », on soustrait ${nb(b)}.`,
        correction: type === "−" ? `x = ${nb(c)} + ${nb(b)} = ${nb(x)}` : `x = ${nb(c)} − ${nb(b)} = ${nb(x)}`
      };
    }
  },

  {
    groupe: F4,
    id: "resoudre-produit",
    titre: "Équations ax = c",
    description: "On divise par a.",
    generer() {
      const a = choisir([2, 3, 4, 5, 6, 8, 10, 12]), x = choisir([alea(2, 15), alea(2, 15), alea(5, 95) / 10, 0.25, 0.75, 2.5]);
      const c = rr(a * x), quotient = Math.random() < 0.2;
      if (quotient) {
        const q = alea(2, 12), k = choisir([2, 4, 5, 10]);
        return { consigne: `Résous l'équation <strong>x ÷ ${k} = ${q}</strong>.`, ligne: "x = [r]",
          verifier: v => verifierNombre(v[0], q * k),
          indice: `Pour défaire « ÷ ${k} », on multiplie par ${k}.`, correction: `x = ${q} × ${k} = ${q * k}` };
      }
      return {
        consigne: `Résous l'équation <strong>${a}x = ${nb(c)}</strong>.`,
        ligne: "x = [r]",
        verifier: v => verifierNombre(v[0], x),
        indice: `${a}x veut dire ${a} × x : pour trouver x, on divise par ${a}.`,
        correction: `x = ${nb(c)} ÷ ${a} = ${nb(x)}`
      };
    }
  },

  {
    groupe: F4,
    id: "resoudre-deux-etapes",
    titre: "Équations ax + b = c",
    description: "Deux étapes : on défait dans l'ordre inverse.",
    generer() {
      const a = alea(2, 9), x = alea(1, 12), b = alea(1, 20), moins = Math.random() < 0.4;
      const c = moins ? a * x - b : a * x + b;
      if (c < 0) return this.generer();
      const eq = moins ? `${a}x − ${b} = ${c}` : `${a}x + ${b} = ${c}`;
      return {
        consigne: `Résous l'équation <strong>${eq}</strong>.`,
        ligne: "x = [r]",
        verifier: v => verifierNombre(v[0], x),
        indice: moins ? `Ajoute d'abord ${b} aux deux membres, puis divise par ${a}.` : `Soustrais d'abord ${b} aux deux membres, puis divise par ${a}.`,
        correction: `${a}x = ${c} ${moins ? "+" : "−"} ${b} = ${a * x}, donc x = ${a * x} ÷ ${a} = ${x}. Vérification : ${a} × ${x} ${moins ? "−" : "+"} ${b} = ${c}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "choisir-equation",
    titre: "Choisir la bonne équation",
    description: "Traduire un énoncé par une équation.",
    generer() {
      const a = alea(3, 9), b = alea(10, 60), p = alea(2, 9), n = alea(3, 8);
      const [enonce, bonne, autres] = choisir([
        [`Léa a x euros. Elle reçoit ${a} € et a maintenant ${b} €.`, `x + ${a} = ${b}`, [`${a}x = ${b}`, `x − ${a} = ${b}`]],
        [`Après avoir dépensé ${a} €, il reste ${b} € à Tom, qui avait x euros.`, `x − ${a} = ${b}`, [`x + ${a} = ${b}`, `${a} − x = ${b}`]],
        [`${n} cahiers identiques coûtent ${n * p} € en tout. Un cahier coûte x euros.`, `${n}x = ${n * p}`, [`x + ${n} = ${n * p}`, `x ÷ ${n} = ${n * p}`]],
        [`Un carré de côté x cm a un périmètre de ${4 * p} cm.`, `4x = ${4 * p}`, [`x² = ${4 * p}`, `x + 4 = ${4 * p}`]],
        [`On partage x bonbons entre ${n} enfants ; chacun en reçoit ${p}.`, `x ÷ ${n} = ${p}`, [`${n}x = ${p}`, `x − ${n} = ${p}`]],
        [`${n} places de cinéma à x € et un pop-corn à ${a} € coûtent ${n * p + a} €.`, `${n}x + ${a} = ${n * p + a}`, [`${n}(x + ${a}) = ${n * p + a}`, `x + ${n} + ${a} = ${n * p + a}`]],
        [`Dans un triangle, deux angles mesurent ${30 + a}° et ${b + 20}° ; le troisième mesure x°.`, `x + ${30 + a} + ${b + 20} = 180`, [`x = ${30 + a} + ${b + 20}`, `3x = 180`]]
      ]);
      return { consigne: enonce + " Quelle équation traduit cette situation ?", choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne),
        indice: "Écris la phrase avec des nombres à la place de x, puis remplace par la lettre.", correction: `L'équation est ${bonne}.` };
    }
  },

  {
    groupe: F5,
    id: "probleme",
    titre: "Résoudre un problème",
    description: "Mettre en équation puis résoudre.",
    generer() {
      const n = alea(3, 8), p = choisir([alea(3, 15), alea(5, 40) / 2]), a = alea(2, 9), ang1 = alea(30, 80), ang2 = alea(20, 70);
      const [enonce, unite, rep, eq] = choisir([
        [`Un rectangle a une largeur de ${n} cm et une aire de ${nb(n * p)} cm². Quelle est sa longueur ?`, "cm", p, `${n}x = ${nb(n * p)}`],
        [`Un carré a un périmètre de ${nb(4 * p)} cm. Quelle est la longueur de son côté ?`, "cm", p, `4x = ${nb(4 * p)}`],
        [`Dans un triangle, deux angles mesurent ${ang1}° et ${ang2}°. Quelle est la mesure du troisième ?`, "°", 180 - ang1 - ang2, `x + ${ang1} + ${ang2} = 180`],
        [`${n} amis partagent une addition équitablement ; chacun paie ${nb(p)} €. Quel est le montant de l'addition ?`, "€", rr(n * p), `x ÷ ${n} = ${nb(p)}`],
        [`Une famille achète ${n} places de cinéma et un pop-corn à ${a} €. Elle paie ${nb(n * p + a)} €. Quel est le prix d'une place ?`, "€", p, `${n}x + ${a} = ${nb(n * p + a)}`],
        [`J'ai un nombre. Je lui ajoute son double et j'obtiens ${3 * n * a}. Quel est ce nombre ?`, "", n * a, `x + 2x = ${3 * n * a}, soit 3x = ${3 * n * a}`]
      ]);
      return {
        consigne: enonce,
        ligne: `x = [d] ${unite}`,
        verifier: v => verifierNombre(v[0], rep),
        indice: "Choisis l'inconnue x, écris l'équation, puis résous-la.",
        correction: `On résout ${eq} : x = ${nb(rep)}${unite ? " " + unite : ""}.`
      };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "programme-calcul",
    titre: "Faire tourner un programme",
    description: "Dans un sens… ou à l'envers.",
    generer() {
      const a = alea(2, 6), b = alea(1, 12), plus = Math.random() < 0.5, depart = alea(0, 12), envers = Math.random() < 0.4;
      const res = plus ? a * depart + b : a * depart - b;
      const prog = `Choisir un nombre → le multiplier par ${a} → ${plus ? "ajouter" : "soustraire"} ${b}.`;
      if (envers) return {
        consigne: `Programme : ${prog}<br>Le résultat est <strong>${nb(res)}</strong>. Quel nombre a-t-on choisi au départ ?`,
        ligne: "Nombre de départ : [r]",
        verifier: v => verifierNombre(v[0], depart),
        indice: `Remonte le programme avec les opérations inverses : ${plus ? "soustraire" : "ajouter"} ${b}, puis diviser par ${a}.`,
        correction: `${a}x ${plus ? "+" : "−"} ${b} = ${nb(res)} donne ${a}x = ${a * depart}, donc x = ${depart}.`
      };
      return {
        consigne: `Programme : ${prog}<br>Quel est le résultat si l'on choisit <strong>${depart}</strong> ?`,
        ligne: "Résultat : [r]",
        verifier: v => verifierNombre(v[0], res),
        indice: "Effectue les étapes dans l'ordre.",
        correction: `${depart} × ${a} = ${a * depart}, puis ${a * depart} ${plus ? "+" : "−"} ${b} = ${nb(res)}.`
      };
    }
  },

  {
    groupe: F6,
    id: "programme-expression",
    titre: "Le programme en une expression",
    description: "Le nombre de départ s'appelle x.",
    generer() {
      const a = alea(2, 7), b = alea(2, 9);
      const [prog, bonne, autres] = choisir([
        [`multiplier par ${a} → ajouter ${b}`, `${a}x + ${b}`, [`${a}(x + ${b})`, `${a} + ${b}x`]],
        [`ajouter ${b} → multiplier par ${a}`, `${a}(x + ${b})`, [`${a}x + ${b}`, `x + ${a * b}`]],
        [`multiplier par ${a} → soustraire ${b}`, `${a}x − ${b}`, [`${a}(x − ${b})`, `${b} − ${a}x`]],
        [`calculer le carré → ajouter ${b}`, `x² + ${b}`, [`(x + ${b})²`, `2x + ${b}`]],
        [`ajouter ${b} → calculer le carré`, `(x + ${b})²`, [`x² + ${b}`, `x² + ${b * b}`]]
      ]);
      return { consigne: `Programme : choisir un nombre x → ${prog}. Quelle expression donne le résultat ?`,
        choix: melanger([bonne, ...autres]), verifier: choixVerif(bonne),
        indice: "Quand on ajoute avant de multiplier, il faut des parenthèses.", correction: `Le résultat est ${bonne}.` };
    }
  },

  {
    groupe: F6,
    id: "boucle",
    titre: "Variables et boucles",
    description: "Que dit le lutin à la fin ?",
    generer() {
      const depart = alea(0, 10), k = alea(2, 9), a = alea(2, 9), type = choisir(["ajouter", "ajouter", "multiplier"]);
      if (type === "multiplier") {
        const kk = alea(2, 4), aa = choisir([2, 3]), d0 = alea(1, 5), fin = d0 * aa ** kk;
        return { consigne: `mettre n à ${d0}<br>répéter ${kk} fois : mettre n à n × ${aa}<br>dire n<br>Quelle valeur est affichée ?`,
          ligne: "n = [n]", verifier: v => verifierNombre(v[0], fin),
          indice: `n est multiplié par ${aa} à chaque tour, ${kk} fois.`,
          correction: `${d0}${(" × " + aa).repeat(kk)} = ${fin}` };
      }
      const fin = depart + k * a;
      return {
        consigne: `mettre n à ${depart}<br>répéter ${k} fois : ajouter ${a} à n<br>dire n<br>Quelle valeur est affichée ?`,
        ligne: "n = [n]", verifier: v => verifierNombre(v[0], fin),
        indice: `À chaque tour, n augmente de ${a}. Il y a ${k} tours.`,
        correction: `${depart} + ${k} × ${a} = ${fin}`
      };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Pairs, impairs, multiples avec des lettres", activites: ["pair-impair"] },
    { competence: "Démontrer en réduisant", activites: ["somme-consecutifs"] },
    { competence: "Valider ou réfuter une affirmation", activites: ["vrai-faux"] },
    { competence: "Choisir un contre-exemple", activites: ["trouver-contre-exemple"] },
    { competence: "Tester si un nombre est solution", activites: ["tester-solution", "quelle-solution"] },
    { competence: "Résoudre x + b = c", activites: ["resoudre-addition"] },
    { competence: "Résoudre ax = c", activites: ["resoudre-produit"] },
    { competence: "Résoudre ax + b = c", activites: ["resoudre-deux-etapes"] },
    { competence: "Mettre en équation", activites: ["choisir-equation"] },
    { competence: "Résoudre un problème", activites: ["probleme"] },
    { competence: "Programme de calcul", activites: ["programme-calcul", "programme-expression"] },
    { competence: "Variables et boucles", activites: ["boucle"] }
  ]
};
