/* =====================================================================
   EXERCISEUR « STATISTIQUES » — 5e, chapitre 10

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Recueillir et organiser";
const F2 = "Feuille 2 — Effectifs et fréquences";
const F3 = "Feuille 3 — Diagrammes en barres et circulaires";
const F4 = "Feuille 4 — Histogrammes et graphiques";
const F5 = "Feuille 5 — La moyenne";
const F6 = "Feuille 6 — Interpréter et critiquer";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const somme = l => l.reduce((a, b) => a + b, 0);

function diagrammeBarres(etiquettes, valeurs, max, pas) {
  const L = 60 + etiquettes.length * 70, H = 190, s = svg("svg", { viewBox: `0 0 ${L} ${H}`, width: L, height: H, role: "img", "aria-label": "Diagramme en barres" });
  const Y = v => 160 - v / max * 140;
  for (let v = 0; v <= max; v += pas) {
    s.append(svg("line", { x1: 40, y1: Y(v), x2: L - 10, y2: Y(v), style: "stroke: var(--bord)" }));
    s.append(svg("text", { x: 34, y: Y(v) + 4, style: "font-size:12px;text-anchor:end;fill:var(--texte-doux)" }, nb(v)));
  }
  etiquettes.forEach((e, i) => {
    const x = 55 + i * 70;
    s.append(svg("rect", { x, y: Y(valeurs[i]), width: 40, height: 160 - Y(valeurs[i]), style: "fill: color-mix(in srgb, var(--cours) 45%, transparent); stroke: var(--cours)" }));
    s.append(svg("text", { x: x + 20, y: 178, style: "font-size:12px;text-anchor:middle;fill:var(--texte)" }, e));
  });
  s.append(svg("line", { x1: 40, y1: 160, x2: L - 10, y2: 160, style: "stroke: var(--texte); stroke-width: 2" }));
  return s;
}
function tableauHTML(l1, l2, t1, t2) {
  const td = v => `<td style="border:1px solid var(--bord);padding:4px 10px;text-align:center">${v}</td>`;
  return `<table style="border-collapse:collapse;margin:8px auto"><tr>${td("<strong>" + t1 + "</strong>")}${l1.map(td).join("")}</tr><tr>${td("<strong>" + t2 + "</strong>")}${l2.map(td).join("")}</tr></table>`;
}
const CATEGORIES = [
  ["Sport préféré", ["Foot", "Basket", "Danse", "Judo"]], ["Fruit préféré", ["Pomme", "Banane", "Fraise", "Kiwi"]],
  ["Transport", ["À pied", "Vélo", "Bus", "Voiture"]], ["Animal préféré", ["Chien", "Chat", "Lapin", "Poisson"]]
];

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "caractere",
    titre: "Qualitatif ou quantitatif ?",
    description: "La nature d'un caractère.",
    generer() {
      const [c, q] = choisir([["la couleur des yeux", false], ["la pointure", true], ["le sport préféré", false], ["le nombre de frères et sœurs", true],
        ["la taille (en cm)", true], ["la marque du téléphone", false], ["le temps de trajet (en minutes)", true], ["le pays de naissance", false], ["la note au contrôle", true], ["le moyen de transport", false]]);
      return {
        consigne: `On étudie ${c} des élèves d'un collège. Ce caractère est…`,
        choix: ["qualitatif", "quantitatif"],
        verifier: (v, x) => ({ etat: (x === "quantitatif") === q ? "juste" : "faux" }),
        indice: "Quantitatif : la réponse est un nombre que l'on peut mesurer ou compter. Qualitatif : la réponse est une catégorie.",
        correction: `${c.charAt(0).toUpperCase() + c.slice(1)} est un caractère ${q ? "quantitatif (un nombre)" : "qualitatif (une catégorie)"}.`
      };
    }
  },

  {
    groupe: F1,
    id: "compter",
    titre: "Compter les effectifs",
    description: "Dans une liste de données.",
    generer() {
      const vals = Array.from({ length: alea(15, 22) }, () => alea(2, 7));
      const v = choisir(vals);
      return {
        consigne: `Voici les notes (sur 8) de ${vals.length} élèves : ${vals.join(" ; ")}. Quel est l'effectif de la note ${v} ?`,
        ligne: "[n]",
        verifier: x => verifierNombre(x[0], vals.filter(y => y === v).length),
        indice: `Compte toutes les fois où apparaît ${v} (barre-les au fur et à mesure).`,
        correction: `La note ${v} apparaît ${vals.filter(y => y === v).length} fois.`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "frequence",
    titre: "Calculer une fréquence",
    description: "Effectif ÷ effectif total.",
    generer() {
      const tot = choisir([20, 25, 40, 50, 10, 200]), e = alea(1, tot - 1);
      const forme = choisir(["décimal", "pourcentage"]);
      const f = rr(e / tot);
      return {
        consigne: `Dans une enquête auprès de ${tot} personnes, ${e} ont répondu « oui ». Quelle est la fréquence des « oui », ${forme === "décimal" ? "sous forme décimale" : "en pourcentage"} ?`,
        ligne: forme === "décimal" ? "[d]" : "[d] %",
        verifier: v => verifierNombre(v[0], forme === "décimal" ? f : rr(100 * f)),
        indice: "Fréquence = effectif de la valeur ÷ effectif total.",
        correction: `${e} ÷ ${tot} = ${nb(f)}, soit ${nb(100 * f)} %.`
      };
    }
  },

  {
    groupe: F2,
    id: "effectif-depuis-frequence",
    titre: "Retrouver un effectif",
    description: "À partir d'un pourcentage.",
    generer() {
      const tot = choisir([200, 300, 400, 500, 25, 50]), p = choisir([10, 20, 25, 30, 40, 60, 12, 8]);
      if (!Number.isInteger(tot * p / 100)) return this.generer();
      return {
        consigne: `Un collège compte ${tot} élèves ; ${p} % sont demi-pensionnaires. Combien d'élèves sont demi-pensionnaires ?`,
        ligne: "[n]",
        verifier: v => verifierNombre(v[0], tot * p / 100),
        indice: "Divise par 100, puis multiplie par le pourcentage.",
        correction: `${tot} ÷ 100 × ${p} = ${tot * p / 100}`
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "lire-barres",
    titre: "Lire un diagramme en barres",
    description: "Effectifs et total.",
    generer() {
      const [titre, cats] = choisir(CATEGORIES), vals = cats.map(() => alea(1, 12));
      const q = choisir(["un", "total", "diff"]), i = alea(0, 3), j = (i + alea(1, 3)) % 4;
      const [txt, r] = q === "un" ? [`Combien d'élèves ont choisi « ${cats[i]} » ?`, vals[i]] : q === "total" ? ["Combien d'élèves ont été interrogés ?", somme(vals)] : [`Combien d'élèves de plus ont choisi « ${cats[i]} » plutôt que « ${cats[j]} » ? (nombre négatif si moins)`, vals[i] - vals[j]];
      return {
        consigne: `${titre} des élèves d'une classe. ${txt}`,
        figure: diagrammeBarres(cats, vals, 12, 2),
        ligne: q === "diff" ? "[r]" : "[n]",
        verifier: v => verifierNombre(v[0], r),
        indice: "Lis la hauteur de chaque barre sur l'axe vertical (graduations de 2 en 2).",
        correction: `Effectifs : ${cats.map((c, k) => c + " " + vals[k]).join(", ")}. Réponse : ${nb(r)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "angle",
    titre: "Angles d'un diagramme circulaire",
    description: "Fréquence × 360°.",
    generer() {
      const tot = choisir([20, 24, 30, 36, 40, 60, 72, 90]), e = alea(1, tot - 1);
      return {
        consigne: `Sur ${tot} élèves interrogés, ${e} préfèrent le basket. Quel est l'angle du secteur « basket » dans le diagramme circulaire ?`,
        ligne: "[d] °",
        verifier: v => verifierNombre(v[0], rr(e / tot * 360)),
        indice: `${tot} élèves correspondent à 360°. Combien de degrés pour 1 élève ?`,
        correction: `1 élève : 360 ÷ ${tot} = ${nb(360 / tot)}° ; ${e} élèves : ${nb(e * 360 / tot)}°.`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "choisir-representation",
    titre: "Choisir une représentation",
    description: "Barres, circulaire, histogramme, graphique.",
    generer() {
      const [s, r] = choisir([
        ["l'évolution du nombre d'habitants d'une ville de 1990 à 2025", "un graphique cartésien"],
        ["la température heure par heure pendant une journée", "un graphique cartésien"],
        ["la part de chaque parti dans les votes d'une élection", "un diagramme circulaire"],
        ["la répartition d'un budget en dépenses", "un diagramme circulaire"],
        ["les tailles des élèves regroupées par classes de 5 cm", "un histogramme"],
        ["les masses de colis regroupées par classes de 1 kg", "un histogramme"],
        ["le nombre d'élèves pratiquant chaque sport", "un diagramme en barres"],
        ["le nombre de livres empruntés par chaque classe", "un diagramme en barres"]
      ]);
      return {
        consigne: `Quelle représentation est la plus adaptée pour montrer ${s} ?`,
        choix: ["un diagramme en barres", "un diagramme circulaire", "un histogramme", "un graphique cartésien"],
        verifier: (v, c) => ({ etat: c === r ? "juste" : "faux" }),
        indice: "Évolution dans le temps → graphique ; parts d'un tout → circulaire ; classes → histogramme ; comparer des effectifs → barres.",
        correction: `C'est ${r}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "moyenne",
    titre: "Calculer une moyenne",
    description: "Somme ÷ effectif.",
    generer() {
      const n = alea(4, 7), vals = Array.from({ length: n }, () => alea(4, 20));
      const m = rr(somme(vals) / n);
      if (!Number.isInteger(m * 100)) return this.generer();
      return {
        consigne: `Calcule la moyenne de la série : ${vals.join(" ; ")}.`,
        ligne: "[d]",
        verifier: v => verifierNombre(v[0], m),
        indice: "Additionne toutes les valeurs, puis divise par le nombre de valeurs.",
        correction: `${somme(vals)} ÷ ${n} = ${nb(m)}`
      };
    }
  },

  {
    groupe: F5,
    id: "note-manquante",
    titre: "La note manquante",
    description: "Atteindre une moyenne.",
    generer() {
      const n = alea(2, 4), vals = Array.from({ length: n }, () => alea(8, 17)), cible = alea(10, 15);
      const x = cible * (n + 1) - somme(vals);
      if (x < 0 || x > 20) return this.generer();
      return {
        consigne: `Inès a eu ${vals.join(", ")}. Quelle note doit-elle obtenir au contrôle suivant pour avoir exactement ${cible} de moyenne ?`,
        ligne: "[n]",
        verifier: v => verifierNombre(v[0], x),
        indice: `Pour une moyenne de ${cible} sur ${n + 1} notes, il faut un total de ${cible} × ${n + 1}.`,
        correction: `Total nécessaire : ${cible} × ${n + 1} = ${cible * (n + 1)} ; elle a déjà ${somme(vals)} : il lui faut ${x}.`
      };
    }
  },

  {
    groupe: F5,
    id: "moyenne-tableau",
    titre: "Moyenne à partir d'un tableau",
    description: "Valeurs et effectifs.",
    generer() {
      const valeurs = [0, 1, 2, 3], eff = valeurs.map(() => alea(1, 8));
      const tot = somme(eff), s = somme(valeurs.map((v, i) => v * eff[i])), m = rr(s / tot);
      if (!Number.isInteger(m * 100)) return this.generer();
      return {
        consigne: "Le tableau donne le nombre de buts marqués par une équipe à chaque match. Calcule le nombre moyen de buts par match." + tableauHTML(valeurs, eff, "Buts", "Matchs"),
        ligne: "[d]",
        verifier: v => verifierNombre(v[0], m),
        indice: "Calcule le nombre total de buts (buts × matchs), puis divise par le nombre total de matchs.",
        correction: `Total des buts : ${valeurs.map((v, i) => v + " × " + eff[i]).join(" + ")} = ${s} ; matchs : ${tot} ; moyenne : ${s} ÷ ${tot} = ${nb(m)}.`
      };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "comparer-proportions",
    titre: "Comparer des proportions",
    description: "Effectifs ou fréquences ?",
    generer() {
      const n1 = choisir([20, 25, 30, 40]), n2 = choisir([50, 60, 80, 100]);
      const f1 = choisir([0.2, 0.3, 0.4, 0.5, 0.6]), f2 = choisir([0.25, 0.35, 0.45, 0.55]);
      const e1 = rr(n1 * f1), e2 = rr(n2 * f2);
      if (!Number.isInteger(e1) || !Number.isInteger(e2)) return this.generer();
      const bonne = f1 > f2 ? "la classe A" : "le club B";
      return {
        consigne: `Dans la classe A, ${e1} élèves sur ${n1} jouent d'un instrument. Dans le club B, ${e2} membres sur ${n2}. Où la proportion de musiciens est-elle la plus grande ?`,
        choix: ["la classe A", "le club B"],
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Compare les fréquences, pas les effectifs : les deux groupes n'ont pas la même taille.",
        correction: `A : ${e1} ÷ ${n1} = ${nb(f1 * 100)} % ; B : ${e2} ÷ ${n2} = ${nb(f2 * 100)} %. C'est ${bonne}.`
      };
    }
  }
];

/* ---------- Le test « Je me teste » : 10 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "10 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Nature d'un caractère", activites: ["caractere"] },
    { competence: "Compter des effectifs", activites: ["compter"] },
    { competence: "Calculer une fréquence", activites: ["frequence"] },
    { competence: "Utiliser un pourcentage", activites: ["effectif-depuis-frequence"] },
    { competence: "Lire un diagramme en barres", activites: ["lire-barres"] },
    { competence: "Angles d'un diagramme circulaire", activites: ["angle"] },
    { competence: "Choisir une représentation", activites: ["choisir-representation"] },
    { competence: "Calculer une moyenne", activites: ["moyenne", "moyenne-tableau"] },
    { competence: "Atteindre une moyenne", activites: ["note-manquante"] },
    { competence: "Comparer des proportions", activites: ["comparer-proportions"] }
  ]
};
