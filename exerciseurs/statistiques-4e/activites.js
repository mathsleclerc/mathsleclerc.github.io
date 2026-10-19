/* =====================================================================
   EXERCISEUR « STATISTIQUES » — 4e, chapitre 10

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Effectifs, fréquences, diagrammes";
const F2 = "Feuille 2 — Diagrammes circulaires";
const F3 = "Feuille 3 — Calculer une moyenne";
const F4 = "Feuille 4 — Déterminer une médiane";
const F5 = "Feuille 5 — Étendue et comparaison de séries";
const F6 = "Feuille 6 — Résoudre des problèmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const serie = (n, a, b) => Array.from({ length: n }, () => alea(a, b));
const somme = t => t.reduce((s, x) => s + x, 0);
const mediane = t => { const u = [...t].sort((x, y) => x - y), n = u.length; return n % 2 ? u[(n - 1) / 2] : (u[n / 2 - 1] + u[n / 2]) / 2; };
const liste = t => t.map(nb).join(" ; ");
const verifierArrondi = (s, exact, d = 1) => { const x = lireNombre(s); if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre dans la case." }; return Math.abs(x - Math.round(exact * 10 ** d) / 10 ** d) < 1e-9 || Math.abs(x - exact) < 1e-9 ? { etat: "juste" } : { etat: "faux" }; };
function tableau(vals, effs, t1 = "Valeur", t2 = "Effectif") {
  const td = v => `<td style="border:1px solid var(--bord);padding:4px 10px;text-align:center">${v}</td>`;
  return `<table style="border-collapse:collapse;margin:8px auto"><tr>${td("<strong>" + t1 + "</strong>")}${vals.map(td).join("")}</tr><tr>${td("<strong>" + t2 + "</strong>")}${effs.map(td).join("")}</tr></table>`;
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "frequence",
    titre: "Calculer une fréquence",
    description: "Effectif ÷ effectif total.",
    generer() {
      const tot = choisir([20, 25, 40, 50, 200]), k = Math.round(tot * alea(1, 19) / 20);
      const [quoi] = choisir([["élèves pratiquent un sport"], ["élèves sont demi-pensionnaires"], ["personnes préfèrent le chocolat"]]);
      return { consigne: `Sur ${tot} personnes interrogées, ${k} ${quoi}. Quelle est la fréquence correspondante, en pourcentage ?`, ligne: "[d] %", verifier: v => verifierNombre(v[0], rr(k / tot * 100)), indice: "Fréquence = effectif ÷ effectif total, puis × 100 pour le pourcentage.", correction: `${k} ÷ ${tot} = ${nb(k / tot)}, soit ${nb(k / tot * 100)} %.` };
    }
  },

  {
    groupe: F1,
    id: "effectif-manquant",
    titre: "Effectif manquant",
    description: "Avec l'effectif total.",
    generer() {
      const effs = serie(4, 2, 12), tot = somme(effs), i = alea(0, 3);
      const aff = effs.map((e, k) => k === i ? "?" : e);
      return { consigne: `L'effectif total est ${tot}. Quel est l'effectif manquant ?` + tableau(["A", "B", "C", "D"], aff), ligne: "[n]", verifier: v => verifierNombre(v[0], effs[i]), indice: "Effectif total moins la somme des effectifs connus.", correction: `${tot} − ${somme(effs) - effs[i]} = ${effs[i]}` };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "angle",
    titre: "Angle d'un secteur",
    description: "Fréquence × 360°.",
    generer() {
      const tot = choisir([18, 20, 24, 30, 36, 40, 60, 72, 120, 360]), k = alea(1, tot - 1);
      if (!Number.isInteger(k / tot * 360 * 10)) return this.generer();
      return { consigne: `Dans un diagramme circulaire représentant ${tot} personnes, quel est l'angle du secteur correspondant à ${k} personnes ?`, ligne: "[d] °", verifier: v => verifierNombre(v[0], rr(k / tot * 360)), indice: "Angle = effectif ÷ effectif total × 360°.", correction: `${k} ÷ ${tot} × 360 = ${nb(k / tot * 360)}°` };
    }
  },

  {
    groupe: F2,
    id: "lire-angle",
    titre: "Lire un diagramme circulaire",
    description: "De l'angle à l'effectif.",
    generer() {
      const tot = choisir([60, 120, 180, 240, 300, 360, 720]), a = choisir([30, 45, 60, 72, 90, 120, 144, 150]);
      if (!Number.isInteger(a / 360 * tot)) return this.generer();
      return { consigne: `Un diagramme circulaire représente ${tot} votes. Le secteur d'un candidat mesure ${a}°. Combien de voix a-t-il obtenues ?`, ligne: "[n]", verifier: v => verifierNombre(v[0], a / 360 * tot), indice: `Ce secteur représente ${a}/360 du total.`, correction: `${a} ÷ 360 × ${tot} = ${a / 360 * tot} voix.` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "moyenne",
    titre: "Moyenne d'une série",
    description: "Somme ÷ effectif.",
    generer() {
      const t = serie(alea(5, 8), 4, 20), m = somme(t) / t.length;
      return { consigne: `Calcule la moyenne de la série : ${liste(t)} (arrondie au dixième si besoin).`, ligne: "[d]", verifier: v => verifierArrondi(v[0], m), indice: "Additionne toutes les valeurs, puis divise par le nombre de valeurs.", correction: `${somme(t)} ÷ ${t.length} ${Number.isInteger(m * 10) ? "=" : "≈"} ${nb(Math.round(m * 10) / 10)}` };
    }
  },

  {
    groupe: F3,
    id: "ponderee",
    titre: "Moyenne pondérée",
    description: "Avec un tableau d'effectifs.",
    generer() {
      const v0 = alea(8, 14), vals = [0, 1, 2, 3, 4].map(k => v0 + k * choisir([1, 2])).filter((x, i, a) => a.indexOf(x) === i), effs = vals.map(() => alea(1, 8));
      const N = somme(effs), S = somme(vals.map((x, i) => x * effs[i])), m = S / N;
      return { consigne: "Calcule la moyenne de cette série (arrondie au dixième si besoin)." + tableau(vals, effs), ligne: "[d]", verifier: v => verifierArrondi(v[0], m), indice: "Multiplie chaque valeur par son effectif, additionne, puis divise par l'effectif total.", correction: `${vals.map((x, i) => x + " × " + effs[i]).join(" + ")} = ${S} ; ${S} ÷ ${N} ${Number.isInteger(m * 10) ? "=" : "≈"} ${nb(Math.round(m * 10) / 10)}` };
    }
  },

  {
    groupe: F3,
    id: "note-manquante",
    titre: "La note manquante",
    description: "Pour atteindre une moyenne.",
    generer() {
      const n = alea(3, 5), t = serie(n, 8, 17), x = alea(8, 20), cible = (somme(t) + x) / (n + 1);
      if (!Number.isInteger(cible)) return this.generer();
      return { consigne: `Lina a obtenu ${liste(t)}. Quelle note doit-elle avoir au contrôle suivant pour obtenir ${cible} de moyenne ?`, ligne: "[n]", verifier: v => verifierNombre(v[0], x), indice: `Il faut un total de ${n + 1} × ${cible}.`, correction: `Total nécessaire : ${n + 1} × ${cible} = ${(n + 1) * cible} ; elle a ${somme(t)} ; il lui faut ${x}.` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "mediane",
    titre: "Médiane d'une série",
    description: "Ranger, puis prendre le milieu.",
    generer() {
      const t = serie(alea(5, 10), 1, 30), m = mediane(t);
      return { consigne: `Détermine la médiane de la série : ${liste(t)}.`, ligne: "[d]", verifier: v => verifierNombre(v[0], m), indice: t.length % 2 ? `Range les ${t.length} valeurs : la médiane est la ${(t.length + 1) / 2}e.` : `Range les ${t.length} valeurs : la médiane est la moyenne des ${t.length / 2}e et ${t.length / 2 + 1}e.`, correction: `Série rangée : ${liste([...t].sort((a, b) => a - b))} ; médiane : ${nb(m)}.` };
    }
  },

  {
    groupe: F4,
    id: "mediane-tableau",
    titre: "Médiane avec un tableau",
    description: "Effectifs cumulés.",
    generer() {
      const vals = [36, 37, 38, 39, 40, 41], effs = vals.map(() => alea(1, 7)), N = somme(effs);
      const t = vals.flatMap((x, i) => Array(effs[i]).fill(x)), m = mediane(t);
      let c = 0; const cum = effs.map(e => (c += e));
      return { consigne: "Détermine la pointure médiane." + tableau(vals, effs, "Pointure"), ligne: "[d]", verifier: v => verifierNombre(v[0], m), indice: `Effectif total : ${N}. Calcule les effectifs cumulés pour trouver la ou les valeurs du milieu.`, correction: `N = ${N} ; effectifs cumulés : ${cum.join(" ; ")} ; médiane : ${nb(m)}.` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "etendue",
    titre: "Étendue",
    description: "Max − min.",
    generer() {
      const t = serie(alea(5, 9), -5, 40);
      return { consigne: `Calcule l'étendue de la série : ${liste(t)}.`, ligne: "[n]", verifier: v => verifierNombre(v[0], Math.max(...t) - Math.min(...t)), indice: "Plus grande valeur moins plus petite valeur.", correction: `${nb(Math.max(...t))} − ${Math.min(...t) < 0 ? "(" + nb(Math.min(...t)) + ")" : nb(Math.min(...t))} = ${Math.max(...t) - Math.min(...t)}` };
    }
  },

  {
    groupe: F5,
    id: "indicateur",
    titre: "Quel indicateur ?",
    description: "Moyenne, médiane, étendue.",
    generer() {
      const [q, r] = choisir([
        ["Quel indicateur est le plus influencé par une valeur extrême ?", "la moyenne"],
        ["Quel indicateur partage la série en deux groupes de même effectif ?", "la médiane"],
        ["Quel indicateur mesure la dispersion des valeurs ?", "l'étendue"],
        ["Dans une entreprise, quelques très hauts salaires faussent l'idée du salaire « courant ». Quel indicateur choisir ?", "la médiane"],
        ["Deux joueurs ont la même moyenne de points. Pour savoir lequel est le plus régulier, on compare…", "l'étendue"]
      ]);
      return { consigne: q, choix: ["la moyenne", "la médiane", "l'étendue"], verifier: choixVerif(r), indice: "Moyenne : sensible aux extrêmes ; médiane : milieu ; étendue : dispersion.", correction: `C'est ${r}.` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "valeur-extreme",
    titre: "Effet d'une valeur extrême",
    description: "Avant / après.",
    generer() {
      const t = serie(5, 2, 9), x = alea(40, 100), m1 = somme(t) / 5, m2 = (somme(t) + x) / 6;
      return { consigne: `Cinq amis ont ${liste(t)} € d'argent de poche. Un sixième arrive avec ${x} €. Quelle est la nouvelle moyenne (au dixième) ?`, ligne: "[d] €", verifier: v => verifierArrondi(v[0], m2), indice: "Ajoute la nouvelle valeur à la somme et divise par 6.", correction: `Avant : ${nb(Math.round(m1 * 10) / 10)} € ; après : ${somme(t) + x} ÷ 6 ≈ ${nb(Math.round(m2 * 10) / 10)} € : la moyenne augmente beaucoup.` };
    }
  }
];

/* ---------- Le test « Je me teste » : 10 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "10 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Calculer une fréquence", activites: ["frequence", "effectif-manquant"] },
    { competence: "Angle d'un diagramme circulaire", activites: ["angle"] },
    { competence: "Lire un diagramme circulaire", activites: ["lire-angle"] },
    { competence: "Calculer une moyenne", activites: ["moyenne"] },
    { competence: "Calculer une moyenne pondérée", activites: ["ponderee"] },
    { competence: "Déterminer une médiane", activites: ["mediane"] },
    { competence: "Médiane avec un tableau", activites: ["mediane-tableau"] },
    { competence: "Calculer une étendue", activites: ["etendue"] },
    { competence: "Choisir un indicateur", activites: ["indicateur"] },
    { competence: "Résoudre un problème", activites: ["note-manquante", "valeur-extreme"] }
  ]
};
