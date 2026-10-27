/* =====================================================================
   EXERCISEUR « EXPÉRIENCES À DEUX ÉPREUVES » — 3e, chapitre 15

   Les activités sont rangées comme les 6 feuilles d'exercices du chapitre.
   Les probabilités se donnent sous forme de fraction (simplifiée ou non) ou de décimal.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 12 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Lister les issues";
const F2 = "Feuille 2 — Tableaux à double entrée";
const F3 = "Feuille 3 — Arbres pondérés";
const F4 = "Feuille 4 — Avec ou sans remise";
const F5 = "Feuille 5 — « Au moins un » et contraire";
const F6 = "Feuille 6 — Problèmes type brevet";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
const Fr = (a, b) => { const g = pgcd(a, b); return b / g === 1 ? String(a / g) : frac(a / g, b / g); };
const simp = (a, b) => frac(a, b) + (pgcd(a, b) > 1 ? " = " + Fr(a, b) : "");
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const DES = [1, 2, 3, 4, 5, 6].flatMap(i => [1, 2, 3, 4, 5, 6].map(j => [i, j]));

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "denombrer",
    titre: "Combien d'issues ?",
    description: "Arbre : on multiplie.",
    generer() {
      const [q, n, ind] = choisir([
        ["On lance trois fois une pièce. Combien y a-t-il d'issues ?", 8, "2 × 2 × 2"],
        ["On lance une pièce puis un dé à six faces. Combien y a-t-il d'issues ?", 12, "2 × 6"],
        ["On lance deux dés à six faces. Combien y a-t-il d'issues ?", 36, "6 × 6"],
        ["Un menu propose 3 entrées et 4 plats. Combien de menus « entrée + plat » différents ?", 12, "3 × 4"],
        ["Un menu propose 2 entrées, 3 plats et 2 desserts. Combien de menus complets différents ?", 12, "2 × 3 × 2"],
        ["Combien de codes à deux chiffres (de 0 à 9) existe-t-il ?", 100, "10 × 10"],
        ["On fait tourner une roue à 5 secteurs puis on lance un dé à six faces. Combien y a-t-il d'issues ?", 30, "5 × 6"]
      ]);
      return { consigne: q, ligne: "[n]", verifier: v => verifierNombre(v[0], n), indice: "Fais un arbre : on multiplie les nombres d'issues de chaque épreuve.", correction: `${ind} = ${n} issues.` };
    }
  },

  {
    groupe: F1,
    id: "pieces",
    titre: "Lancers de pièces",
    description: "Issues équiprobables.",
    generer() {
      const n = choisir([2, 3, 3]), k = alea(0, n), comb = n === 2 ? [1, 2, 1][k] : [1, 3, 3, 1][k], tot = 2 ** n;
      return { consigne: `On lance ${n} fois une pièce équilibrée. Quelle est la probabilité d'obtenir exactement ${k} fois Pile ?`, ligne: "[f]", verifier: v => verifierFraction(v[0], comb, tot), indice: `Fais un arbre : il y a ${tot} issues équiprobables.`, correction: `${comb} issue${comb > 1 ? "s" : ""} sur ${tot} : P = ${simp(comb, tot)}.` };
    }
  },

  {
    groupe: F1,
    id: "piege",
    titre: "Le piège de Léo",
    description: "Issues équiprobables ou non ?",
    generer() {
      const [q, bonne, faux, corr] = choisir([
        ["On lance deux pièces. Léo dit : « Trois issues : 2 Pile, 2 Face ou une de chaque. Donc P(une de chaque) = 1/3. » A-t-il raison ?", "Non, c'est 1/2", ["Oui", "Non, c'est 1/4"], "Les 4 issues équiprobables sont PP, PF, FP, FF : « une de chaque » en regroupe 2, donc P = 2/4 = 1/2."],
        ["On lance deux dés. Léa dit : « Les sommes vont de 2 à 12, il y en a 11, donc P(somme = 7) = 1/11. » A-t-elle raison ?", "Non, c'est 1/6", ["Oui", "Non, c'est 1/12"], "Les sommes ne sont pas équiprobables : 7 s'obtient de 6 façons sur 36, donc P = 6/36 = 1/6."],
        ["On lance deux dés. Obtenir « 6 puis 6 » et obtenir « 1 puis 6 » : est-ce aussi probable ?", "Oui, 1/36 chacun", ["Non, le double 6 est plus rare", "Non, « 1 puis 6 » est plus rare"], "Chaque couple (6 ; 6) ou (1 ; 6) est une issue parmi 36 issues équiprobables : P = 1/36 pour chacun."]
      ]);
      return { consigne: q, choix: melanger([bonne, ...faux]), verifier: choixVerif(bonne), indice: "Liste les issues avec un arbre : sont-elles toutes équiprobables ?", correction: corr };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "somme-des",
    titre: "Somme de deux dés",
    description: "Tableau des 36 issues.",
    generer() {
      const cas = choisir(["egal", "egal", "sup", "double"]);
      if (cas === "double") return { consigne: "On lance deux dés équilibrés. Quelle est la probabilité d'obtenir un double ?", ligne: "[f]", verifier: v => verifierFraction(v[0], 6, 36), indice: "Fais un tableau à double entrée : 36 issues.", correction: `6 doubles sur 36 issues : P = ${simp(6, 36)}.` };
      if (cas === "egal") {
        const s = alea(2, 12), n = 6 - Math.abs(7 - s);
        return { consigne: `On lance deux dés équilibrés. Quelle est la probabilité que la somme soit égale à ${s} ?`, ligne: "[f]", verifier: v => verifierFraction(v[0], n, 36), indice: "Fais un tableau à double entrée des sommes : 36 issues équiprobables.", correction: `${n} issue${n > 1 ? "s" : ""} sur 36 : P = ${simp(n, 36)}.` };
      }
      const t = alea(8, 11), m = DES.filter(([i, j]) => i + j >= t).length;
      return { consigne: `On lance deux dés équilibrés. Quelle est la probabilité que la somme soit supérieure ou égale à ${t} ?`, ligne: "[f]", verifier: v => verifierFraction(v[0], m, 36), indice: "Compte dans le tableau des sommes les cases qui conviennent.", correction: `${m} issues sur 36 : P = ${simp(m, 36)}.` };
    }
  },

  {
    groupe: F2,
    id: "produit-des",
    titre: "Produit de deux dés",
    description: "Pair, multiple, supérieur à…",
    generer() {
      const [txt, f] = choisir([
        ["pair", p => p % 2 === 0], ["impair", p => p % 2 === 1], ["un multiple de 3", p => p % 3 === 0],
        ["un multiple de 5", p => p % 5 === 0], ["supérieur ou égal à 20", p => p >= 20], ["égal à 6", p => p === 6], ["égal à 12", p => p === 12]
      ]);
      const m = DES.filter(([i, j]) => f(i * j)).length;
      return { consigne: `On lance deux dés équilibrés et on multiplie les deux nombres. Quelle est la probabilité que le produit soit ${txt} ?`, ligne: "[f]", verifier: v => verifierFraction(v[0], m, 36), indice: "Construis le tableau des 36 produits et compte les cases qui conviennent.", correction: `${m} cases sur 36 : P = ${simp(m, 36)}.` };
    }
  },

  {
    groupe: F2,
    id: "roue-piece",
    titre: "Roue et pièce",
    description: "Deux épreuves différentes.",
    generer() {
      const n = choisir([3, 4, 5]), k = alea(1, n - 1), cote = choisir(["Pile", "Face"]);
      return { consigne: `Une roue a ${n} secteurs égaux numérotés de 1 à ${n}. On la fait tourner puis on lance une pièce équilibrée. Quelle est la probabilité d'obtenir un nombre inférieur ou égal à ${k} et ${cote} ?`, ligne: "[f]", verifier: v => verifierFraction(v[0], k, 2 * n), indice: `Il y a ${n} × 2 = ${2 * n} issues équiprobables. Combien conviennent ?`, correction: `${k} issue${k > 1 ? "s" : ""} favorable${k > 1 ? "s" : ""} sur ${2 * n} : P = ${simp(k, 2 * n)} (ou ${frac(k, n)} × ${frac(1, 2)}).` };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "arbre-decimal",
    titre: "Arbre pondéré (décimaux)",
    description: "On multiplie le long d'un chemin.",
    generer() {
      const p = alea(2, 9) / 10, q = alea(2, 9) / 10, cas = choisir(["deux", "aucun", "aucun"]);
      const [debut, deux, aucun] = choisir([
        [`Un feu A est vert avec la probabilité ${nb(p)} ; un feu B, indépendant, est vert avec la probabilité ${nb(q)}.`, "les deux feux soient verts", "aucun des deux feux ne soit vert"],
        [`Un basketteur réussit son premier lancer franc avec la probabilité ${nb(p)} et le second, indépendamment, avec la probabilité ${nb(q)}.`, "le basketteur réussisse les deux lancers", "le basketteur rate les deux lancers"]
      ]);
      const r = cas === "deux" ? rr(p * q) : rr((1 - p) * (1 - q));
      return { consigne: `${debut} Quelle est la probabilité que ${cas === "deux" ? deux : aucun} ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], r), indice: cas === "deux" ? "Sur l'arbre, multiplie les probabilités le long du chemin." : `Sur chaque branche « non », la probabilité est 1 − p : ${nb(1 - p)} et ${nb(1 - q)}.`, correction: cas === "deux" ? `${nb(p)} × ${nb(q)} = ${nb(r)}` : `${nb(1 - p)} × ${nb(1 - q)} = ${nb(r)}` };
    }
  },

  {
    groupe: F3,
    id: "avec-remise",
    titre: "Tirages avec remise",
    description: "Même urne aux deux tirages.",
    generer() {
      const r = alea(2, 5), v = alea(2, 6), t = r + v, cas = choisir(["RR", "VV", "meme", "diff"]);
      const num = { RR: r * r, VV: v * v, meme: r * r + v * v, diff: 2 * r * v }[cas], den = t * t;
      const txt = { RR: "deux boules rouges", VV: "deux boules vertes", meme: "deux boules de la même couleur", diff: "deux boules de couleurs différentes" }[cas];
      const det = { RR: `${frac(r, t)} × ${frac(r, t)}`, VV: `${frac(v, t)} × ${frac(v, t)}`, meme: `${frac(r, t)} × ${frac(r, t)} + ${frac(v, t)} × ${frac(v, t)}`, diff: `${frac(r, t)} × ${frac(v, t)} + ${frac(v, t)} × ${frac(r, t)}` }[cas];
      return { consigne: `Une urne contient ${r} boules rouges et ${v} vertes. On tire une boule, on la remet, puis on en tire une seconde. Quelle est la probabilité d'obtenir ${txt} ?`, ligne: "[f]", verifier: x => verifierFraction(x[0], num, den), indice: `Avec remise, chaque tirage donne rouge avec la probabilité ${frac(r, t)}. ${cas === "meme" || cas === "diff" ? "Additionne les chemins qui conviennent." : ""}`, correction: `${det} = ${simp(num, den)}` };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "sans-remise",
    titre: "Tirages sans remise",
    description: "Il y a un objet de moins.",
    generer() {
      const r = alea(2, 5), v = alea(2, 6), t = r + v, cas = choisir(["RR", "VV", "meme"]);
      const num = { RR: r * (r - 1), VV: v * (v - 1), meme: r * (r - 1) + v * (v - 1) }[cas], den = t * (t - 1);
      const txt = { RR: "deux boules rouges", VV: "deux boules vertes", meme: "deux boules de la même couleur" }[cas];
      const det = { RR: `${frac(r, t)} × ${frac(r - 1, t - 1)}`, VV: `${frac(v, t)} × ${frac(v - 1, t - 1)}`, meme: `${frac(r, t)} × ${frac(r - 1, t - 1)} + ${frac(v, t)} × ${frac(v - 1, t - 1)}` }[cas];
      return { consigne: `Une urne contient ${r} boules rouges et ${v} vertes. On tire successivement deux boules, sans remise. Quelle est la probabilité d'obtenir ${txt} ?`, ligne: "[f]", verifier: x => verifierFraction(x[0], num, den), indice: `Au second tirage, il ne reste que ${t - 1} boules.`, correction: `${det} = ${simp(num, den)}` };
    }
  },

  {
    groupe: F4,
    id: "seconde-branche",
    titre: "La seconde branche",
    description: "Quelle probabilité écrire ?",
    generer() {
      const r = alea(2, 6), v = alea(2, 6), t = r + v, remise = Math.random() < 0.5;
      const num = remise ? r : r - 1, den = remise ? t : t - 1;
      return { consigne: `Un sac contient ${r} bonbons à la fraise et ${v} au citron. On en prend un, ${remise ? "on le remet dans le sac" : "on le mange"}, puis on en prend un second. Le premier était à la fraise : quelle est la probabilité que le second soit aussi à la fraise ?`, ligne: "[f]", verifier: x => verifierFraction(x[0], num, den), indice: remise ? "Le sac n'a pas changé." : "Il manque un bonbon à la fraise dans le sac.", correction: remise ? `Le sac est le même : P = ${simp(num, den)}.` : `Il reste ${r - 1} bonbons à la fraise sur ${t - 1} : P = ${simp(num, den)}.` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "au-moins-un",
    titre: "Au moins un 6",
    description: "1 − P(aucun).",
    generer() {
      const n = choisir([2, 2, 3]), num = 6 ** n - 5 ** n, den = 6 ** n;
      const face = choisir(["6", "1", "nombre pair"]);
      if (face === "nombre pair") { const d = 2 ** n; return { consigne: `On lance ${n} fois un dé équilibré. Quelle est la probabilité d'obtenir au moins une fois un nombre pair ?`, ligne: "[f]", verifier: x => verifierFraction(x[0], d - 1, d), indice: "Le contraire de « au moins un nombre pair » est « que des nombres impairs ».", correction: `P(aucun pair) = ${frac(1, 2)}${n === 3 ? "³" : "²"} = ${frac(1, d)}, donc P = 1 − ${frac(1, d)} = ${frac(d - 1, d)}.` }; }
      return { consigne: `On lance ${n} fois un dé équilibré. Quelle est la probabilité d'obtenir au moins un ${face} ?`, ligne: "[f]", verifier: x => verifierFraction(x[0], num, den), indice: `Le contraire de « au moins un ${face} » est « aucun ${face} ».`, correction: `P(aucun ${face}) = ${frac(5, 6)}${n === 3 ? "³" : "²"} = ${frac(5 ** n, den)}, donc P = 1 − ${frac(5 ** n, den)} = ${frac(num, den)}.` };
    }
  },

  {
    groupe: F5,
    id: "au-moins-decimal",
    titre: "Au moins une panne",
    description: "Avec des décimaux.",
    generer() {
      const p = choisir([0.05, 0.1, 0.2, 0.02]), q = choisir([0.1, 0.05, 0.3, 0.04]), r = rr(1 - (1 - p) * (1 - q));
      return { consigne: `Un appareil contient deux composants qui tombent en panne indépendamment, avec les probabilités ${nb(p)} et ${nb(q)}. Quelle est la probabilité qu'au moins un composant tombe en panne ?`, ligne: "[d]", verifier: x => verifierNombre(x[0], r), indice: "Calcule d'abord la probabilité qu'aucun ne tombe en panne.", correction: `P(aucune panne) = ${nb(1 - p)} × ${nb(1 - q)} = ${nb((1 - p) * (1 - q))} ; P = 1 − ${nb((1 - p) * (1 - q))} = ${nb(r)}.` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "roues",
    titre: "Deux roues de loterie",
    description: "Type brevet.",
    generer() {
      const a = choisir([3, 4, 5]), b = choisir([2, 4, 5, 6]), cas = choisir(["deux", "un", "aucun"]);
      const num = { deux: 1, un: (b - 1) + (a - 1), aucun: (a - 1) * (b - 1) }[cas], den = a * b;
      const txt = { deux: "les deux roues tombent sur leur secteur gagnant", un: "exactement une roue tombe sur son secteur gagnant", aucun: "aucune roue ne tombe sur son secteur gagnant" }[cas];
      return { consigne: `La roue A a ${a} secteurs égaux dont 1 gagnant ; la roue B a ${b} secteurs égaux dont 1 gagnant. On fait tourner les deux roues. Quelle est la probabilité que ${txt} ?`, ligne: "[f]", verifier: x => verifierFraction(x[0], num, den), indice: `Arbre : P(A gagnant) = ${frac(1, a)}, P(B gagnant) = ${frac(1, b)}.`, correction: { deux: `${frac(1, a)} × ${frac(1, b)} = ${frac(1, den)}`, un: `${frac(1, a)} × ${frac(b - 1, b)} + ${frac(a - 1, a)} × ${frac(1, b)} = ${simp(num, den)}`, aucun: `${frac(a - 1, a)} × ${frac(b - 1, b)} = ${simp(num, den)}` }[cas] };
    }
  },

  {
    groupe: F6,
    id: "equitable",
    titre: "Jeu équitable ?",
    description: "Comparer deux probabilités.",
    generer() {
      const [regle, m] = choisir([
        ["Léa gagne si le produit des deux dés est pair", 27], ["Léa gagne si la somme des deux dés est paire", 18],
        ["Léa gagne si le produit des deux dés est un multiple de 3", 20], ["Léa gagne si la somme des deux dés est supérieure ou égale à 7", 21],
        ["Léa gagne si les deux dés donnent le même nombre ou deux nombres qui se suivent", 16]
      ]);
      const r = m === 18 ? "Oui, il est équitable" : m > 18 ? "Non, Léa est avantagée" : "Non, Tom est avantagé";
      return { consigne: `On lance deux dés. ${regle} ; sinon, Tom gagne. Le jeu est-il équitable ?`, choix: ["Oui, il est équitable", "Non, Léa est avantagée", "Non, Tom est avantagé"], verifier: choixVerif(r), indice: "Compte dans le tableau à double entrée les 36 issues favorables à Léa.", correction: `Léa a ${m} issues favorables sur 36 : P = ${simp(m, 36)}${m === 18 ? "" : m > 18 ? " > 1/2" : " < 1/2"}. ${r}.` };
    }
  },

  {
    groupe: F6,
    id: "test-medical",
    titre: "Test de dépistage",
    description: "Arbre à deux niveaux.",
    generer() {
      const m = choisir([0.01, 0.02, 0.05, 0.1]), s = choisir([0.9, 0.95, 0.99]), f = choisir([0.02, 0.05, 0.1]);
      const r = rr(m * s + (1 - m) * f);
      return { consigne: `Une maladie touche ${nb(m * 100)} % de la population. Le test est positif chez ${nb(s * 100)} % des malades et chez ${nb(f * 100)} % des personnes saines. Quelle est la probabilité qu'une personne prise au hasard ait un test positif ?`, ligne: "[d]", verifier: x => verifierNombre(x[0], r), indice: "Arbre : malade / sain, puis positif / négatif. Additionne les deux chemins « positif ».", correction: `${nb(m)} × ${nb(s)} + ${nb(1 - m)} × ${nb(f)} = ${nb(m * s)} + ${nb((1 - m) * f)} = ${nb(r)}` };
    }
  }
];

/* ---------- Le test « Je me teste » : 12 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "12 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Dénombrer les issues", activites: ["denombrer"] },
    { competence: "Arbre des possibles", activites: ["pieces"] },
    { competence: "Issues équiprobables ou non", activites: ["piege"] },
    { competence: "Tableau à double entrée", activites: ["somme-des", "produit-des"] },
    { competence: "Deux épreuves différentes", activites: ["roue-piece"] },
    { competence: "Arbre pondéré", activites: ["arbre-decimal"] },
    { competence: "Tirages avec remise", activites: ["avec-remise"] },
    { competence: "Tirages sans remise", activites: ["sans-remise"] },
    { competence: "Avec ou sans remise ?", activites: ["seconde-branche"] },
    { competence: "« Au moins un »", activites: ["au-moins-un", "au-moins-decimal"] },
    { competence: "Problème type brevet", activites: ["roues", "test-medical"] },
    { competence: "Jeu équitable ?", activites: ["equitable"] }
  ]
};
