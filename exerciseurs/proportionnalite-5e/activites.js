/* =====================================================================
   EXERCISEUR « PROPORTIONNALITÉ » — 5e, chapitre 9

   Les activités sont rangées comme les 7 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Reconnaître la proportionnalité";
const F2 = "Feuille 2 — Calculer une quatrième proportionnelle";
const F3 = "Feuille 3 — Pourcentages";
const F4 = "Feuille 4 — Vitesses et échelles";
const F5 = "Feuille 5 — Représentation graphique";
const F6 = "Feuille 6 — Partager selon un ratio";
const F7 = "Feuille 7 — Résoudre des problèmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const euros = x => { const y = rr(x); return (Number.isInteger(y) ? nb(y) : y.toFixed(2).replace(".", ",")) + " €"; };

function tableauHTML(l1, l2, t1, t2) {
  const td = v => `<td style="border:1px solid var(--bord);padding:4px 10px;text-align:center">${v}</td>`;
  return `<table style="border-collapse:collapse;margin:8px auto"><tr>${td("<strong>" + t1 + "</strong>")}${l1.map(td).join("")}</tr><tr>${td("<strong>" + t2 + "</strong>")}${l2.map(td).join("")}</tr></table>`;
}
/* Petit graphique : points [x, y], dans un repère [0, X] × [0, Y] */
function graphique(points, X, Y, { droite = false, etiquettes = false, nx = X, ny = 5 } = {}) {
  const L = 200, H = 150, m = 30, s = svg("svg", { viewBox: `0 0 ${L + m + 10} ${H + m + 6}`, width: L + m + 10, height: H + m + 6, role: "img", "aria-label": "Graphique" });
  const P = (x, y) => ({ x: m + x / X * L, y: H + 4 - y / Y * H });
  const txt = (x, y, t, anc) => s.append(svg("text", { x, y, style: `font-size:11px;fill:var(--texte-doux);text-anchor:${anc}` }, t));
  for (let k = 0; k <= nx; k++) {
    s.append(svg("line", { x1: P(k * X / nx, 0).x, y1: P(0, 0).y, x2: P(k * X / nx, 0).x, y2: P(0, Y).y, style: "stroke: var(--bord)" }));
    if (etiquettes) txt(P(k * X / nx, 0).x, P(0, 0).y + 14, nb(k * X / nx), "middle");
  }
  for (let k = 0; k <= ny; k++) {
    s.append(svg("line", { x1: P(0, 0).x, y1: P(0, k * Y / ny).y, x2: P(X, 0).x, y2: P(0, k * Y / ny).y, style: "stroke: var(--bord)" }));
    if (etiquettes && k) txt(P(0, 0).x - 4, P(0, k * Y / ny).y + 4, nb(k * Y / ny), "end");
  }
  s.append(svg("line", { x1: P(0, 0).x, y1: P(0, 0).y, x2: P(X, 0).x + 4, y2: P(0, 0).y, style: "stroke: var(--texte); stroke-width: 2" }));
  s.append(svg("line", { x1: P(0, 0).x, y1: P(0, 0).y, x2: P(0, 0).x, y2: P(0, Y).y - 4, style: "stroke: var(--texte); stroke-width: 2" }));
  if (droite) { const [a, b] = droite; s.append(svg("line", { x1: P(a[0], a[1]).x, y1: P(a[0], a[1]).y, x2: P(b[0], b[1]).x, y2: P(b[0], b[1]).y, style: "stroke: var(--cours); stroke-width: 2.5" })); }
  points.forEach(([x, y]) => s.append(svg("circle", { cx: P(x, y).x, cy: P(x, y).y, r: 4.5, style: "fill: var(--cours)" })));
  return s;
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "tableau",
    titre: "Tableau de proportionnalité ?",
    description: "Le même coefficient partout ?",
    generer() {
      const k = choisir([1.5, 2, 2.5, 3, 4, 0.5, 1.2, 5]), xs = melanger([2, 3, 4, 5, 6, 8, 10]).slice(0, 4).sort((a, b) => a - b);
      const oui = Math.random() < 0.5;
      const ys = xs.map(x => rr(x * k));
      if (!oui) { const i = alea(1, 3); ys[i] = rr(ys[i] + choisir([1, -1, 2])); }
      return {
        consigne: "Ce tableau est-il un tableau de proportionnalité ?" + tableauHTML(xs.map(nb), ys.map(nb), "Quantité", "Prix (€)"),
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === oui ? "juste" : "faux" }),
        indice: "Calcule le quotient prix ÷ quantité pour chaque colonne : est-il toujours le même ?",
        correction: oui ? `Oui : on multiplie toujours par ${nb(k)}.` : `Non : les quotients ne sont pas tous égaux (${xs.map((x, i) => nb(ys[i]) + " ÷ " + x + " = " + nb(ys[i] / x)).join(" ; ")}).`
      };
    }
  },

  {
    groupe: F1,
    id: "situation",
    titre: "Situation de proportionnalité ?",
    description: "Dans la vie courante.",
    generer() {
      const [t, v] = choisir([
        ["Le prix payé et la masse de pommes achetées (au même prix au kg).", true], ["La taille d'une personne et son âge.", false],
        ["Le périmètre d'un carré et la longueur de son côté.", true], ["L'aire d'un carré et la longueur de son côté.", false],
        ["La distance parcourue à vitesse constante et la durée.", true], ["Le prix d'une course de taxi (prise en charge + prix au km) et la distance.", false],
        ["La quantité de farine et le nombre de crêpes, pour une même recette.", true], ["La température et l'heure de la journée.", false],
        ["Une longueur sur un plan et la longueur réelle correspondante.", true], ["Le prix d'un forfait téléphonique (abonnement fixe) et le nombre d'appels.", false]
      ]);
      return {
        consigne: t + " Ces deux grandeurs sont-elles proportionnelles ?",
        choix: ["Oui", "Non"],
        verifier: (x, c) => ({ etat: (c === "Oui") === v ? "juste" : "faux" }),
        indice: "Si on double l'une, l'autre double-t-elle ? Si l'une vaut 0, l'autre vaut-elle 0 ?",
        correction: v ? "Oui, elles sont proportionnelles." : "Non, elles ne sont pas proportionnelles."
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "quatrieme",
    titre: "Quatrième proportionnelle",
    description: "Linéarité, retour à l'unité, coefficient.",
    generer() {
      const [q, r, c] = choisir([
        (() => { const n = alea(3, 6), p = choisir([0.4, 0.5, 0.8, 1.2, 1.5, 2.5]), m = alea(7, 15); return [`${n} cahiers coûtent ${euros(n * p)}. Combien coûtent ${m} cahiers ?`, m * p, `1 cahier : ${euros(n * p)} ÷ ${n} = ${euros(p)} ; ${m} cahiers : ${m} × ${euros(p)} = ${euros(m * p)}`]; })(),
        (() => { const n = alea(2, 5), p = alea(15, 45) / 10, m = alea(6, 12); return [`${n} kg de pommes coûtent ${euros(n * p)}. Combien coûtent ${m} kg ?`, m * p, `1 kg : ${euros(p)} ; ${m} kg : ${euros(m * p)}`]; })(),
        (() => { const c = alea(4, 8), d = 100 * alea(2, 5), D = 100 * alea(6, 12); return [`Une voiture consomme ${nb(c * d / 100)} L pour ${d} km. Combien consomme-t-elle pour ${D} km ?`, c * D / 100, `Pour 100 km : ${c} L ; pour ${D} km : ${nb(c * D / 100)} L`]; })(),
        (() => { const n = alea(2, 4) * 4, f = 25 * alea(4, 10) / 4, m = alea(2, 6) * 4; return [`Pour ${n} crêpes, il faut ${nb(f * n / 4)} g de farine. Combien en faut-il pour ${m} crêpes ?`, f * m / 4, `Pour 4 crêpes : ${nb(f)} g ; pour ${m} crêpes : ${nb(f * m / 4)} g`]; })()
      ]);
      return {
        consigne: q,
        ligne: "[d]",
        verifier: v => verifierNombre(v[0], rr(r)),
        indice: "Cherche d'abord la valeur pour une unité (ou un multiple pratique).",
        correction: c
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "appliquer",
    titre: "Prendre un pourcentage",
    description: "Diviser par 100, multiplier par t.",
    generer() {
      const t = choisir([1, 5, 10, 15, 20, 25, 30, 50, 75, 8, 12, 40]), q = choisir([alea(2, 30) * 10, alea(10, 90) * 5, alea(2, 9) * 100]);
      return {
        consigne: `Calcule ${t} % de ${nb(q)}.`,
        ligne: `${t} % de ${nb(q)} = [d]`,
        verifier: v => verifierNombre(v[0], rr(q / 100 * t)),
        indice: `Divise ${nb(q)} par 100, puis multiplie par ${t}.`,
        correction: `${nb(q)} ÷ 100 × ${t} = ${nb(q / 100 * t)}`
      };
    }
  },

  {
    groupe: F3,
    id: "calculer-pourcentage",
    titre: "Calculer un pourcentage",
    description: "Partie ÷ total.",
    generer() {
      const [tot, part] = choisir([[25, alea(1, 24)], [20, alea(1, 19)], [50, alea(1, 49)], [200, alea(1, 39) * 5], [40, alea(1, 39)], [10, alea(1, 9)]]);
      const p = rr(part / tot * 100);
      const [qui] = choisir([["élèves"], ["spectateurs"], ["joueurs"]]);
      return {
        consigne: `Sur ${tot} ${qui}, ${part} ont répondu « oui ». Quel pourcentage cela représente-t-il ?`,
        ligne: "[d] %",
        verifier: v => verifierNombre(v[0], p),
        indice: `Écris la fraction ${frac(part, tot)} avec le dénominateur 100.`,
        correction: `${frac(part, tot)} = ${frac(nb(p), 100)}, soit ${nb(p)} %.`
      };
    }
  },

  {
    groupe: F3,
    id: "soldes",
    titre: "Soldes et augmentations",
    description: "Le nouveau prix.",
    generer() {
      const prix = choisir([alea(2, 30) * 10, alea(5, 40) * 5]), t = choisir([10, 20, 25, 30, 40, 50, 15, 5]), baisse = Math.random() < 0.7;
      const r = rr(baisse ? prix - prix / 100 * t : prix + prix / 100 * t);
      return {
        consigne: baisse ? `Un article coûte ${euros(prix)}. Il est soldé à −${t} %. Quel est son nouveau prix ?` : `Un abonnement coûte ${euros(prix)}. Il augmente de ${t} %. Quel est son nouveau prix ?`,
        ligne: "[d] €",
        verifier: v => verifierNombre(v[0], r),
        indice: `Calcule d'abord ${t} % de ${euros(prix)}, puis ${baisse ? "retire-le" : "ajoute-le"}.`,
        correction: `${t} % de ${euros(prix)} = ${euros(prix / 100 * t)} ; nouveau prix : ${euros(r)}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "vitesse",
    titre: "Vitesse moyenne",
    description: "d = v × t",
    generer() {
      const v = choisir([4, 5, 12, 15, 20, 30, 45, 60, 80, 90, 120]), t = choisir([0.5, 1.5, 2, 2.5, 3, 0.25, 4]);
      const hm = h => { const H = Math.floor(h), M = Math.round((h - H) * 60); return (H ? H + " h" : "") + (M ? (H ? " " : "") + M + " min" : ""); };
      const type = choisir(["d", "v", "t"]);
      const [q, r, u, c] = {
        d: [`Un véhicule roule à ${v} km/h pendant ${hm(t)}. Quelle distance parcourt-il ?`, v * t, "km", `${v} × ${nb(t)} = ${nb(v * t)} km`],
        v: [`Un véhicule parcourt ${nb(v * t)} km en ${hm(t)}. Quelle est sa vitesse moyenne ?`, v, "km/h", `${nb(v * t)} ÷ ${nb(t)} = ${v} km/h`],
        t: [`Combien de temps faut-il pour parcourir ${nb(v * t)} km à ${v} km/h ? (réponse en heures, nombre décimal)`, t, "h", `${nb(v * t)} ÷ ${v} = ${nb(t)} h, soit ${hm(t)}`]
      }[type];
      return {
        consigne: q,
        ligne: `[d] ${u}`,
        verifier: x => verifierNombre(x[0], rr(r)),
        indice: "Distance = vitesse × durée (durée en heures : 30 min = 0,5 h, 15 min = 0,25 h).",
        correction: c
      };
    }
  },

  {
    groupe: F4,
    id: "echelle",
    titre: "Échelles",
    description: "Plan et réalité.",
    generer() {
      const e = choisir([100, 200, 500, 1000, 25000, 50000]), l = alea(2, 12);
      const reel = l * e;           // en cm
      const conv = reel >= 100000 ? [reel / 100000, "km"] : [reel / 100, "m"];
      const sens = Math.random() < 0.6;
      return {
        consigne: sens ? `Sur un plan à l'échelle 1/${nb(e)}, une longueur mesure ${l} cm. Quelle est la longueur réelle (en ${conv[1]}) ?` : `Sur un plan à l'échelle 1/${nb(e)}, quelle longueur (en cm) représente ${nb(conv[0])} ${conv[1]} dans la réalité ?`,
        ligne: sens ? `[d] ${conv[1]}` : "[d] cm",
        verifier: v => verifierNombre(v[0], sens ? rr(conv[0]) : l),
        indice: `Échelle 1/${nb(e)} : 1 cm sur le plan représente ${nb(e)} cm en réalité.`,
        correction: sens ? `${l} × ${nb(e)} = ${nb(reel)} cm = ${nb(conv[0])} ${conv[1]}` : `${nb(conv[0])} ${conv[1]} = ${nb(reel)} cm ; ${nb(reel)} ÷ ${nb(e)} = ${l} cm`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "graphique",
    titre: "Graphique et proportionnalité",
    description: "Points alignés avec l'origine ?",
    generer() {
      const type = choisir(["prop", "affine", "courbe", "prop"]);
      const xs = [1, 2, 3, 4, 5], a = choisir([1.5, 2, 1, 1.8]);
      const pts = xs.map(x => [x, type === "prop" ? a * x : type === "affine" ? 2 + x * 1.2 : 0.35 * x * x]);
      return {
        consigne: "Ce graphique représente-t-il une situation de proportionnalité ?",
        figure: graphique(pts, 6, 10, { nx: 6 }),
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === (type === "prop") ? "juste" : "faux" }),
        indice: "Les points sont-ils alignés ? La droite passe-t-elle par l'origine ?",
        correction: type === "prop" ? "Oui : les points sont alignés avec l'origine." : type === "affine" ? "Non : les points sont alignés, mais pas avec l'origine." : "Non : les points ne sont pas alignés."
      };
    }
  },

  {
    groupe: F5,
    id: "lire-graphique",
    titre: "Lire un graphique",
    description: "Une droite qui passe par l'origine.",
    generer() {
      const k = choisir([2, 3, 4, 5]), x = alea(1, 5);
      return {
        consigne: `Le graphique représente le prix (en €, verticalement) en fonction de la masse (en kg, horizontalement). Quel est le prix de ${x} kg ?`,
        figure: graphique([], 6, 6 * k, { droite: [[0, 0], [6, 6 * k]], etiquettes: true, nx: 6, ny: 6 }),
        ligne: "[d] €",
        verifier: v => verifierNombre(v[0], k * x),
        indice: "Repère le prix pour 1 kg (premier point), puis utilise la proportionnalité.",
        correction: `1 kg coûte ${k} € ; ${x} kg coûtent ${k * x} €.`
      };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "ratio",
    titre: "Partager selon un ratio",
    description: "a : b → a + b parts.",
    generer() {
      const a = alea(1, 5), b = alea(1, 6), part = alea(2, 15), tot = (a + b) * part;
      const [contexte, u] = choisir([["bonbons entre Léa et Tom", ""], ["€ entre deux associés", "€"], ["kg de mortier (ciment : sable)", "kg"], ["L de boisson (sirop : eau)", "L"]]);
      return {
        consigne: `On partage ${tot} ${contexte} selon le ratio ${a} : ${b}. Quelles sont les deux parts ?`,
        ligne: `[d] ${u} et [d] ${u}`,
        verifier: v => {
          const x = lireNombre(v[0]), y = lireNombre(v[1]);
          if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux cases." };
          return x === a * part && y === b * part ? { etat: "juste" } : { etat: "faux", message: x === b * part && y === a * part ? "Tu as inversé les deux parts." : "" };
        },
        indice: `Partage ${tot} en ${a} + ${b} = ${a + b} parts égales.`,
        correction: `1 part = ${tot} ÷ ${a + b} = ${part} ; ${a} × ${part} = ${a * part} et ${b} × ${part} = ${b * part}.`
      };
    }
  },

  /* ================= Feuille 7 ================= */
  {
    groupe: F7,
    id: "meilleur-prix",
    titre: "Le meilleur prix",
    description: "Comparer des prix unitaires.",
    generer() {
      const n1 = choisir([4, 6, 8]), n2 = choisir([10, 12, 16, 20]), p = alea(30, 90) / 100;
      const p1 = rr(n1 * p), p2 = rr(n2 * (p + choisir([-0.05, -0.03, 0.03, 0.05])));
      const u1 = p1 / n1, u2 = p2 / n2;
      const bonne = u1 < u2 ? `le paquet de ${n1}` : `le paquet de ${n2}`;
      return {
        consigne: `Le paquet de ${n1} yaourts coûte ${euros(p1)} ; le paquet de ${n2} coûte ${euros(p2)}. Lequel est le plus avantageux ?`,
        choix: [`le paquet de ${n1}`, `le paquet de ${n2}`],
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Calcule le prix d'un yaourt dans chaque paquet.",
        correction: `Prix d'un yaourt : ${nb(rr(Math.round(u1 * 1000) / 1000))} € et ${nb(rr(Math.round(u2 * 1000) / 1000))} € : c'est ${bonne}.`
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
    { competence: "Reconnaître un tableau de proportionnalité", activites: ["tableau"] },
    { competence: "Reconnaître une situation de proportionnalité", activites: ["situation"] },
    { competence: "Calculer une quatrième proportionnelle", activites: ["quatrieme"] },
    { competence: "Appliquer un pourcentage", activites: ["appliquer"] },
    { competence: "Calculer un pourcentage", activites: ["calculer-pourcentage"] },
    { competence: "Soldes et augmentations", activites: ["soldes"] },
    { competence: "Vitesse moyenne", activites: ["vitesse"] },
    { competence: "Échelles", activites: ["echelle"] },
    { competence: "Reconnaître graphiquement la proportionnalité", activites: ["graphique"] },
    { competence: "Lire un graphique", activites: ["lire-graphique"] },
    { competence: "Partager selon un ratio", activites: ["ratio"] },
    { competence: "Comparer des prix", activites: ["meilleur-prix"] }
  ]
};
