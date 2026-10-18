/* =====================================================================
   EXERCISEUR « FRACTION QUOTIENT » — 6e, chapitre 10

   Les activités suivent les parties du cours : la fraction comme quotient
   (feuilles 1 et 2), puis décomposer et encadrer, comparer et ranger,
   multiplier une fraction par un entier (parties 3 à 5, sans fiche pour l'instant).

   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Fraction et division";
const F2 = "Feuille 2 — Le quotient";
const F3 = "Décomposer et encadrer une fraction";
const F4 = "Comparer et ranger des fractions";
const F5 = "Multiplier une fraction par un entier";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const F = (a, b) => frac(a, b);
const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
/* Une fraction a/b a une écriture décimale si, une fois simplifiée, son dénominateur n'a que des 2 et des 5 */
function estDecimale(a, b) {
  let d = b / pgcd(a, b);
  for (const p of [2, 5]) while (d % p === 0) d /= p;
  return d === 1;
}
const DEN_DECIMAUX = [2, 4, 5, 8, 10, 20, 25];
/* Une fraction non entière qui a une écriture décimale */
function fractionDecimale(max = 40) {
  let a, b;
  do { b = choisir(DEN_DECIMAUX); a = alea(1, max); } while (a % b === 0 || pgcd(a, b) !== 1 && Math.random() < 0.7);
  return [a, b];
}
const verifierEntier = (s, n) => {
  const x = lireNombre(s);
  if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre dans la case." };
  return Math.abs(x - n) < 1e-9 ? { etat: "juste" } : { etat: "faux" };
};
const noeudHTML = h => { const d = el("span", {}); d.innerHTML = h; return d; };

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "fraction-division",
    titre: "a/b = a ÷ b",
    description: "Passer de la fraction à la division, et inversement.",
    generer() {
      const b = alea(2, 12), a = alea(1, 30);
      if (Math.random() < 0.5) return {
        consigne: "Complète.",
        ligne: `${F(a, b)} = ${a} ÷ [n]`,
        verifier(v) {
          const r = verifierEntier(v[0], b);
          if (r.etat === "faux" && lireNombre(v[0]) === a) r.message = "Le numérateur se divise par le dénominateur.";
          return r;
        },
        indice: "La fraction a/b est le quotient de a par b.",
        correction: `${F(a, b)} = ${a} ÷ ${b}.`
      };
      return {
        consigne: "Écris cette division sous la forme d'une fraction.",
        ligne: `${a} ÷ ${b} = [f]`,
        verifier(v) {
          const r = verifierFraction(v[0], a, b);
          if (r.etat === "juste" && r.message) return { etat: "faux", message: `Cette fraction est égale, mais on attend directement ${a} ÷ ${b} sous forme de fraction.` };
          return r;
        },
        indice: "Le nombre qu'on divise va au numérateur, le diviseur au dénominateur.",
        correction: `${a} ÷ ${b} = ${F(a, b)}.`
      };
    }
  },

  {
    groupe: F1,
    id: "fraction-entier",
    titre: "Une fraction égale à un entier",
    description: "Quand le numérateur est un multiple du dénominateur.",
    generer() {
      const b = alea(2, 12), n = alea(0, 12), a = b * n;
      return {
        consigne: "Écris cette fraction sous la forme d'un nombre entier.",
        ligne: `${F(a, b)} = [n]`,
        verifier: v => verifierEntier(v[0], n),
        indice: `Combien de fois ${b} dans ${a} ?`,
        correction: `${a} ÷ ${b} = ${n}, donc ${F(a, b)} = ${n}.`
      };
    }
  },

  {
    groupe: F1,
    id: "ecriture-decimale",
    titre: "Écriture décimale d'une fraction",
    description: "Diviser le numérateur par le dénominateur.",
    generer() {
      const [a, b] = fractionDecimale();
      const r = rr(a / b);
      return {
        consigne: "Donne l'écriture décimale de cette fraction.",
        ligne: `${F(a, b)} = [d]`,
        verifier(v) {
          const r2 = verifierNombre(v[0], r);
          const x = String(v[0]).replace(/\s/g, "");
          if (r2.etat === "faux" && (x === `${a},${b}` || x === `${b},${a}`)) r2.message = `Attention : ${F(a, b)} n'est pas « ${a} virgule ${b} ». On divise ${a} par ${b}.`;
          return r2;
        },
        indice: `Calcule ${a} ÷ ${b} (de tête ou en posant la division au brouillon).`,
        correction: `${a} ÷ ${b} = ${nb(r)}, donc ${F(a, b)} = ${nb(r)}.`
      };
    }
  },

  {
    groupe: F1,
    id: "toutes-ecritures",
    titre: "Toutes les écritures d'un nombre",
    description: "Trouver les écritures égales à un nombre décimal.",
    generer() {
      const [d, bonnes, fausses] = choisir([
        [2.5, [[5, 2], [10, 4], [25, 10], "5 ÷ 2"], [[2, 5], "2 ÷ 5", [25, 100], [5, 4]]],
        [0.5, [[1, 2], [5, 10], [3, 6], "1 ÷ 2"], [[2, 1], [1, 5], "5 ÷ 1", [5, 100]]],
        [1.5, [[3, 2], [15, 10], [6, 4], "3 ÷ 2"], [[2, 3], [1, 5], [15, 100], "2 ÷ 3"]],
        [0.25, [[1, 4], [25, 100], [2, 8], "1 ÷ 4"], [[4, 1], [1, 25], [2, 5], "4 ÷ 1"]],
        [0.75, [[3, 4], [75, 100], [6, 8], "3 ÷ 4"], [[4, 3], [7, 5], [3, 75], [7, 50]]],
        [1.2, [[6, 5], [12, 10], [24, 20], "6 ÷ 5"], [[5, 6], [1, 2], [12, 100], "12 ÷ 100"]],
        [0.4, [[2, 5], [4, 10], [8, 20], "2 ÷ 5"], [[5, 2], [4, 100], [1, 4], "4 ÷ 1"]]
      ]);
      const ecrire = x => typeof x === "string" ? x : F(x[0], x[1]);
      const k = alea(2, 3);
      const liste = melanger([...melanger([...bonnes]).slice(0, k + 1), ...melanger([...fausses]).slice(0, 5 - k)]);
      const vrai = x => bonnes.includes(x);
      const choisies = new Set();
      let actif = true;
      const boutons = liste.map((x, i) => {
        const b = el("button", { type: "button", class: "btn etiquette-choix", "aria-pressed": "false" });
        b.innerHTML = ecrire(x);
        b.addEventListener("click", () => { if (!actif) return; choisies.has(i) ? choisies.delete(i) : choisies.add(i); b.setAttribute("aria-pressed", String(choisies.has(i))); });
        return b;
      });
      return {
        consigne: `Sélectionne <strong>toutes</strong> les écritures égales à <strong>${nb(d)}</strong>, puis valide.`,
        figure: el("div", { class: "etiquettes" }, ...boutons),
        verifier() {
          if (!choisies.size) return { etat: "incomplet", message: "Sélectionne au moins une écriture." };
          const manque = liste.filter((x, i) => vrai(x) && !choisies.has(i)).length, trop = [...choisies].filter(i => !vrai(liste[i])).length;
          if (!manque && !trop) return { etat: "juste" };
          return { etat: "faux", message: trop ? "Une des écritures choisies n'est pas égale à " + nb(d) + " : calcule le quotient." : "Il en manque." };
        },
        indice: "Pour chaque fraction, calcule le quotient du numérateur par le dénominateur.",
        correction: `${liste.filter(vrai).map(ecrire).join(" ; ")} sont égales à ${nb(d)}.`,
        surCorrection() { boutons.forEach((b, i) => b.classList.toggle("bonne", vrai(liste[i]))); },
        bloquer: () => { actif = false; }
      };
    }
  },

  {
    groupe: F1,
    id: "relier-fraction-decimal",
    titre: "Relier fraction et écriture décimale",
    description: "Attention aux pièges : 3/4 n'est pas 3,4 !",
    generer() {
      const pool = melanger([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 10], [7, 10], [9, 2], [7, 4], [3, 2], [1, 8], [6, 5], [7, 20]]);
      const choix = [];
      for (const f of pool) if (choix.length < 4 && !choix.some(g => g[0] / g[1] === f[0] / f[1])) choix.push(f);
      const r = relier(choix.map(([a, b]) => ({ html: F(a, b), cle: a / b })), choix.map(([a, b]) => ({ html: nb(a / b), cle: a / b })));
      return {
        consigne: "Relie chaque fraction à son écriture décimale : clique sur une fraction, puis sur un nombre.",
        figure: r.noeud,
        verifier: r.verifier,
        indice: "Divise le numérateur par le dénominateur.",
        correction: choix.map(([a, b]) => `${F(a, b)} = ${nb(a / b)}`).join(" ; ") + ".",
        surCorrection: r.corriger,
        bloquer: r.bloquer
      };
    }
  },

  {
    groupe: F1,
    id: "decimal-ou-pas",
    titre: "Nombre décimal ou pas ?",
    description: "La division s'arrête-t-elle ?",
    generer() {
      let a, b;
      if (Math.random() < 0.5) [a, b] = fractionDecimale(30);
      else do { b = choisir([3, 6, 7, 9, 11, 12, 15]); a = alea(1, 30); } while (estDecimale(a, b));
      const dec = estDecimale(a, b);
      const q = a / b, aff = dec ? nb(q) : nb(Math.floor(q * 10000) / 10000) + "…";
      return {
        consigne: `La fraction ${F(a, b)} est-elle un nombre décimal ?`,
        choix: ["Oui, c'est un nombre décimal", "Non, ce n'est pas un nombre décimal"],
        verifier: (v, c) => ({ etat: c.startsWith("Oui") === dec ? "juste" : "faux" }),
        indice: `Pose la division de ${a} par ${b} au brouillon : s'arrête-t-elle, ou les mêmes restes reviennent-ils sans fin ?`,
        correction: dec ? `${a} ÷ ${b} = ${aff} : la division s'arrête, ${F(a, b)} est un nombre décimal.` : `${a} ÷ ${b} = ${aff} : la division ne s'arrête jamais, ${F(a, b)} n'est pas un nombre décimal.`
      };
    }
  },

  {
    groupe: F1,
    id: "valeur-arrondie",
    titre: "Valeur arrondie d'une fraction",
    description: "Arrondir au dixième ou au centième.",
    generer() {
      let a, b;
      do { b = choisir([3, 6, 7, 9, 11, 12]); a = alea(1, 40); } while (estDecimale(a, b));
      const p = choisir([1, 2]), nom = p === 1 ? "au dixième" : "au centième";
      const r = Math.round(a / b * 10 ** p) / 10 ** p;
      const tronc = Math.floor(a / b * 10 ** p) / 10 ** p;
      return {
        consigne: `Donne la valeur arrondie de ${F(a, b)} ${nom}.`,
        ligne: `${F(a, b)} ≈ [d]`,
        verifier(v) {
          const res = verifierNombre(v[0], r);
          const x = lireNombre(v[0]);
          if (res.etat === "faux" && Math.abs(x - tronc) < 1e-9) res.message = `Regarde le chiffre suivant : ${a} ÷ ${b} = ${nb(Math.floor(a / b * 10000) / 10000)}…`;
          return res;
        },
        indice: `Calcule ${a} ÷ ${b} avec un chiffre de plus, puis arrondis.`,
        correction: `${a} ÷ ${b} = ${nb(Math.floor(a / b * 10000) / 10000)}…, donc ${F(a, b)} ≈ ${nb(r)} ${nom}.`
      };
    }
  },

  {
    groupe: F1,
    id: "vrai-faux",
    titre: "Vrai ou faux ?",
    description: "Des affirmations sur les fractions et les quotients.",
    generer() {
      const [a, b] = choisir([[1, 4], [3, 4], [1, 2], [3, 5], [7, 2], [2, 5], [9, 4]]);
      const n = alea(2, 9), m = n * alea(2, 6);
      const cas = choisir([
        [`${F(a, b)} = ${a},${b}`, false, `${F(a, b)} = ${a} ÷ ${b} = ${nb(a / b)}.`],
        [`${F(a, b)} = ${nb(a / b)}`, true, `${a} ÷ ${b} = ${nb(a / b)}.`],
        [`${F(m, n)} = ${m / n}`, true, `${m} ÷ ${n} = ${m / n}.`],
        [`${F(1, 3)} = 0,3`, false, `3 × 0,3 = 0,9, pas 1 : ${F(1, 3)} n'est pas un nombre décimal (0,333…).`],
        [`${F(a, b)} = ${F(b, a)}`, false, `${F(a, b)} = ${nb(a / b)} et ${F(b, a)} = ${nb(rr(b / a))}${estDecimale(b, a) ? "" : "…"}.`],
        [`${a} ÷ ${b} = ${F(a, b)}`, true, "Une fraction est le quotient du numérateur par le dénominateur."],
        [`${F(n, n)} = 1`, true, `${n} ÷ ${n} = 1.`],
        [`${F(0, n)} = 0`, true, `0 ÷ ${n} = 0.`]
      ]);
      return {
        consigne: `Vrai ou faux ? <strong>${cas[0]}</strong>`,
        choix: ["Vrai", "Faux"],
        verifier: (v, c) => ({ etat: (c === "Vrai") === cas[1] ? "juste" : "faux" }),
        indice: "Calcule le quotient du numérateur par le dénominateur.",
        correction: `${cas[1] ? "Vrai" : "Faux"} : ${cas[2]}`
      };
    }
  },

  {
    groupe: F1,
    id: "partager-longueur",
    titre: "Partager en parts égales",
    description: "Une réponse en fraction, puis en nombre décimal.",
    generer() {
      const [a, b] = fractionDecimale(20);
      const [texte, unite] = choisir([
        [`Un ruban de ${a} m est coupé en ${b} morceaux de même longueur.`, "m"],
        [`On partage ${a} kg de cerises en ${b} paniers identiques.`, "kg"],
        [`${b} amis se partagent équitablement ${a} litres de jus.`, "L"],
        [`Une planche de ${a} m est sciée en ${b} morceaux égaux.`, "m"]
      ]);
      return {
        consigne: `${texte}<br>Quelle est la mesure d'une part ? Donne-la sous forme d'une fraction, puis d'un nombre décimal.`,
        ligne: `[f] ${unite} = [d] ${unite}`,
        verifier(v) {
          const f = verifierFraction(v[0], a, b);
          if (f.etat === "incomplet") return f;
          if (f.etat === "faux") return { etat: "faux", message: `On partage ${a} en ${b} : c'est ${a} ÷ ${b}.` };
          return verifierNombre(v[1], a / b);
        },
        indice: `Une part, c'est ${a} ÷ ${b}.`,
        correction: `${a} ÷ ${b} = ${F(a, b)} = ${nb(a / b)} ${unite}.`
      };
    }
  },

  {
    groupe: F1,
    id: "placer-quotient",
    titre: "Placer un quotient sur la demi-droite",
    description: "a/b, c'est a fois la part 1/b.",
    generer() {
      const max = unitesDroite();
      let a, b; do { b = choisir([2, 3, 4, 5, 6, 8]); a = alea(1, max * b - 1); } while (a % b === 0);
      const d = droiteGraduee(b, { max, clic: true, lettre: "A" });
      return {
        consigne: `Place le point A d'abscisse ${F(a, b)} (clique sur la demi-droite, ou utilise les flèches du clavier).`,
        figure: d.svg,
        verifier() {
          if (d.position == null) return { etat: "incomplet", message: "Clique sur la demi-droite pour placer le point." };
          if (d.position === a) return { etat: "juste" };
          return { etat: "faux", message: `Ton point est à ${d.position} graduation${d.position > 1 ? "s" : ""} de 0. Chaque unité est partagée en ${b} : une graduation vaut ${F(1, b)}.` };
        },
        indice: `L'unité est partagée en ${b} parts égales : compte ${a} parts de ${F(1, b)} depuis 0.`,
        correction: `${F(a, b)} = ${a} × ${F(1, b)} : on compte ${a} graduations depuis 0${a > b ? ` (${F(a, b)} est entre ${Math.floor(a / b)} et ${Math.floor(a / b) + 1})` : ""}.`,
        surCorrection() { d.marquer(a, "pt correct", "A"); },
        bloquer: () => { d.actif = false; }
      };
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "quotient-produit",
    titre: "b × a/b = a",
    description: "Le quotient de a par b, multiplié par b, redonne a.",
    generer() {
      const b = alea(2, 13), a = alea(1, 30);
      const avant = Math.random() < 0.5;
      return {
        consigne: "Calcule, sans calculer l'écriture décimale de la fraction.",
        ligne: avant ? `${b} × ${F(a, b)} = [n]` : `${F(a, b)} × ${b} = [n]`,
        verifier(v) {
          const r = verifierEntier(v[0], a);
          if (r.etat === "faux" && lireNombre(v[0]) === a * b) r.message = "On ne multiplie pas le numérateur ici : multiplier par le dénominateur « annule » la division.";
          return r;
        },
        indice: `${F(a, b)} est le nombre qui, multiplié par ${b}, donne ${a}.`,
        correction: `${b} × ${F(a, b)} = ${a}.`
      };
    }
  },

  {
    groupe: F2,
    id: "completer-fraction",
    titre: "Compléter avec une fraction",
    description: "Le nombre manquant d'une multiplication est un quotient.",
    generer() {
      const b = alea(2, 12); let a; do { a = alea(1, 30); } while (a % b === 0);
      const avant = Math.random() < 0.5;
      return {
        consigne: "Complète avec une fraction.",
        ligne: avant ? `${b} × [f] = ${a}` : `[f] × ${b} = ${a}`,
        verifier(v) {
          const r = verifierFraction(v[0], a, b);
          if (r.etat === "faux" && lireEntier(v[0].num) === b && lireEntier(v[0].den) === a) r.message = `Attention : on cherche ${a} ÷ ${b}, pas ${b} ÷ ${a}.`;
          return r;
        },
        indice: `Le nombre qui, multiplié par ${b}, donne ${a}, c'est le quotient de ${a} par ${b}.`,
        correction: `${b} × ${F(a, b)} = ${a}.`
      };
    }
  },

  {
    groupe: F2,
    id: "calcul-mental-quotient",
    titre: "Calcul mental avec des quotients",
    description: "Une série rapide de calculs.",
    generer() {
      const cas = choisir(["produit", "entier", "decimal", "produit"]);
      if (cas === "produit") { const b = alea(2, 12), a = alea(1, 20); return { consigne: "Calcule de tête.", ligne: `${b} × ${F(a, b)} = [n]`, verifier: v => verifierEntier(v[0], a), indice: "b × a/b = a.", correction: `${b} × ${F(a, b)} = ${a}.` }; }
      if (cas === "entier") { const b = alea(2, 10), n = alea(1, 10); return { consigne: "Calcule de tête.", ligne: `${F(b * n, b)} = [n]`, verifier: v => verifierEntier(v[0], n), indice: `${b * n} ÷ ${b}.`, correction: `${b * n} ÷ ${b} = ${n}.` }; }
      const [a, b] = choisir([[1, 2], [3, 2], [5, 2], [1, 4], [3, 4], [1, 5], [2, 5], [7, 10], [9, 2], [6, 5]]);
      return { consigne: "Calcule de tête.", ligne: `${F(a, b)} = [d]`, verifier: v => verifierNombre(v[0], a / b), indice: `${a} ÷ ${b}.`, correction: `${F(a, b)} = ${nb(a / b)}.` };
    }
  },

  {
    groupe: F2,
    id: "problemes-quotient",
    titre: "Problèmes de quotient",
    description: "Des partages, réponse en fraction (et en décimal si possible).",
    generer() {
      const decimal = Math.random() < 0.6;
      let a, b;
      if (decimal) [a, b] = fractionDecimale(20);
      else do { b = choisir([3, 6, 7, 9]); a = alea(2, 20); } while (estDecimale(a, b));
      const [texte, unite] = choisir([
        [`${b} bouteilles identiques contiennent en tout ${a} litres d'eau. Quelle quantité d'eau contient une bouteille ?`, "L"],
        [`On partage équitablement ${a} gâteaux entre ${b} enfants. Quelle part de gâteau reçoit chaque enfant ?`, "gâteau(x)"],
        [`${b} pots de peinture identiques contiennent ${a} kg de peinture. Quelle est la masse de peinture d'un pot ?`, "kg"]
      ]);
      return {
        consigne: texte + (decimal ? " Donne la réponse sous forme d'une fraction, puis d'un nombre décimal." : " Donne la réponse sous forme d'une fraction."),
        ligne: decimal ? `[f] ${unite} = [d] ${unite}` : `[f] ${unite}`,
        verifier(v) {
          const f = verifierFraction(v[0], a, b);
          if (f.etat !== "juste") return f.etat === "faux" ? { etat: "faux", message: `On partage ${a} en ${b} parts égales.` } : f;
          return decimal ? verifierNombre(v[1], a / b) : f;
        },
        indice: `Une part : ${a} ÷ ${b}.`,
        correction: `${a} ÷ ${b} = ${F(a, b)}${decimal ? ` = ${nb(a / b)}` : ` (≈ ${nb(Math.round(a / b * 100) / 100)} : ce n'est pas un nombre décimal)`} ${unite}.`
      };
    }
  },

  /* ================= Décomposer et encadrer ================= */

  {
    groupe: F3,
    id: "nombre-mixte",
    titre: "Décomposer une fraction (nombre mixte)",
    description: "Un entier plus une fraction plus petite que 1.",
    generer() {
      const b = alea(2, 9), n = alea(1, 9), r = alea(1, b - 1), a = n * b + r;
      return {
        consigne: `Écris ${F(a, b)} sous la forme d'un nombre entier plus une fraction inférieure à 1.`,
        ligne: `${F(a, b)} = [n] + [f/${b}]`,
        verifier(v) {
          const e = lireNombre(v[0]), num = lireEntier(v[1].num);
          if (isNaN(e) || isNaN(num)) return { etat: "incomplet", message: "Complète les deux cases." };
          if (e === n && num === r) return { etat: "juste" };
          if (num >= b) return { etat: "faux", message: `La fraction doit être inférieure à 1 : son numérateur doit être plus petit que ${b}.` };
          return { etat: "faux", message: `Fais la division euclidienne de ${a} par ${b}.` };
        },
        indice: `Division euclidienne : ${a} = ${b} × … + …`,
        correction: `${a} = ${b} × ${n} + ${r}, donc ${F(a, b)} = ${n} + ${F(r, b)}.`
      };
    }
  },

  {
    groupe: F3,
    id: "encadrer",
    titre: "Encadrer entre deux entiers consécutifs",
    description: "Grâce au nombre mixte.",
    generer() {
      const b = alea(2, 9), n = alea(0, 9), r = alea(1, b - 1), a = n * b + r;
      return {
        consigne: "Encadre cette fraction entre deux nombres entiers consécutifs.",
        ligne: `[n] &lt; ${F(a, b)} &lt; [n]`,
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux cases." };
          if (x[0] === n && x[1] === n + 1) return { etat: "juste" };
          if (x[1] !== x[0] + 1) return { etat: "faux", message: "Les deux entiers doivent être consécutifs (qui se suivent)." };
          return { etat: "faux", message: `Décompose : ${a} = ${b} × … + …` };
        },
        indice: `Écris ${F(a, b)} comme un entier plus une fraction inférieure à 1.`,
        correction: `${F(a, b)} = ${n} + ${F(r, b)}, et ${F(r, b)} &lt; 1, donc ${n} &lt; ${F(a, b)} &lt; ${n + 1}.`
      };
    }
  },

  /* ================= Comparer et ranger ================= */

  {
    groupe: F4,
    id: "comparer-a-1",
    titre: "Plus petite ou plus grande que 1 ?",
    description: "Comparer le numérateur et le dénominateur.",
    generer() {
      const liste = [];
      while (liste.length < 4) {
        const b = alea(2, 15), a = choisir([alea(1, b - 1), b, alea(b + 1, 2 * b + 3), alea(1, b - 1)]);
        if (!liste.some(f => f[0] === a && f[1] === b)) liste.push([a, b]);
      }
      const rep = ([a, b]) => a < b ? 0 : a === b ? 1 : 2;
      return {
        consigne: "Compare chaque fraction à 1.",
        classeLigne: "etapes",
        ligne: liste.map(([a, b]) => `<div class="etape-pb enonce-ligne">${F(a, b)} [s]</div>`).join(""),
        listes: liste.map(() => ["&lt; 1", "= 1", "&gt; 1"]),
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Réponds pour chaque fraction." };
          const faux = liste.filter((f, i) => v[i] !== rep(f)).length;
          return faux ? { etat: "faux", message: faux > 1 ? `${faux} réponses sont fausses.` : "Une réponse est fausse." } : { etat: "juste" };
        },
        indice: "Numérateur plus petit que le dénominateur : la fraction est plus petite que 1.",
        correction: liste.map(([a, b]) => `${F(a, b)} ${["&lt;", "=", "&gt;"][rep([a, b])]} 1`).join(" ; ") + "."
      };
    }
  },

  {
    groupe: F4,
    id: "comparer-fractions",
    titre: "Comparer deux fractions",
    description: "Même dénominateur, même numérateur, comparaison à 1 ou à 1/2, dénominateurs multiples.",
    generer() {
      const cas = choisir(["den", "num", "un", "demi", "multiple"]);
      let a, b, c, d, expl;
      if (cas === "den") { b = d = alea(3, 13); do { a = alea(1, 2 * b); c = alea(1, 2 * b); } while (a === c); expl = `Même dénominateur : on compare les numérateurs, ${a} ${a < c ? "&lt;" : "&gt;"} ${c}.`; }
      else if (cas === "num") { a = c = alea(1, 9); do { b = alea(2, 12); d = alea(2, 12); } while (b === d); expl = `Même numérateur : la plus grande a le plus petit dénominateur (des parts plus grandes).`; }
      else if (cas === "un") { b = alea(3, 12); a = alea(1, b - 1); d = alea(3, 12); c = alea(d + 1, 2 * d); if (Math.random() < 0.5) [a, b, c, d] = [c, d, a, b]; expl = `L'une est plus petite que 1, l'autre plus grande que 1.`; }
      else if (cas === "demi") { do { b = alea(5, 15); a = alea(1, Math.ceil(b / 2) - 1); d = alea(5, 15); c = alea(Math.floor(d / 2) + 1, d - 1); } while (2 * a === b || 2 * c === d || b === d); if (Math.random() < 0.5) [a, b, c, d] = [c, d, a, b]; expl = `L'une est plus petite que ${F(1, 2)}, l'autre plus grande que ${F(1, 2)} (compare le double du numérateur au dénominateur).`; }
      else { b = alea(2, 6); const k = alea(2, 4); d = b * k; a = alea(1, 2 * b); do { c = alea(1, 2 * d); } while (c === a * k); expl = `${F(a, b)} = ${F(a * k, d)}, et ${a * k} ${a * k < c ? "&lt;" : "&gt;"} ${c}.`; if (Math.random() < 0.5) [a, b, c, d] = [c, d, a, b]; }
      const s = a * d < c * b ? "<" : a * d > c * b ? ">" : "=";
      const html = { "<": "&lt;", ">": "&gt;", "=": "=" };
      return {
        consigne: "Complète par &lt;, = ou &gt;.",
        ligne: `${F(a, b)} [c] ${F(c, d)}`,
        choix: ["<", "=", ">"],
        verifier: (v, ch) => ({ etat: ch === s ? "juste" : "faux" }),
        indice: "Regarde : même dénominateur ? même numérateur ? Sinon, compare chaque fraction à 1 ou à 1/2, ou écris-les avec le même dénominateur.",
        correction: `${F(a, b)} ${html[s]} ${F(c, d)}. ${expl}`
      };
    }
  },

  {
    groupe: F4,
    id: "ranger-fractions",
    titre: "Ranger des fractions",
    description: "Dans l'ordre croissant ou décroissant.",
    generer() {
      const croissant = Math.random() < 0.6;
      let items;
      if (Math.random() < 0.5) {
        const b = alea(3, 9), nums = melanger([...Array(2 * b).keys()].map(i => i + 1)).slice(0, 5);
        items = nums.map(a => ({ v: a / b, h: F(a, b) }));
      } else {
        const b = alea(4, 9);
        items = melanger([{ v: 1, h: "1" }, { v: (b - 1) / b, h: F(b - 1, b) }, { v: (b + 1) / b, h: F(b + 1, b) }, { v: 2, h: "2" }, { v: (2 * b + 1) / b, h: F(2 * b + 1, b) }, { v: 1 + 1 / (b + 1), h: `1 + ${F(1, b + 1)}` }]).slice(0, 5);
      }
      if (new Set(items.map(x => x.v)).size < items.length) return this.generer();
      const r = rangement(items.map(x => ({ texte: noeudHTML(x.h) })), croissant ? "<" : ">");
      const ordre = [...items.keys()].sort((i, j) => croissant ? items[i].v - items[j].v : items[j].v - items[i].v);
      return {
        consigne: `Range ces nombres dans l'ordre ${croissant ? "croissant (du plus petit au plus grand)" : "décroissant (du plus grand au plus petit)"} : clique dessus dans l'ordre.`,
        figure: r.noeud,
        verifier() {
          const o = r.ordre();
          if (o.length < items.length) return { etat: "incomplet", message: "Range tous les nombres." };
          return o.every((i, k) => items[i].v === items[ordre[k]].v) ? { etat: "juste" } : { etat: "faux", message: "Compare chaque fraction à 1 et à 2, ou regarde les numérateurs quand les dénominateurs sont égaux." };
        },
        indice: "Même dénominateur : on compare les numérateurs. Sinon, écris chaque fraction comme un entier plus une fraction.",
        correction: ordre.map(i => items[i].h).join(croissant ? " &lt; " : " &gt; ") + ".",
        bloquer: r.bloquer
      };
    }
  },

  /* ================= Multiplier une fraction par un entier ================= */

  {
    groupe: F5,
    id: "fraction-fois-entier",
    titre: "Multiplier une fraction par un entier",
    description: "On multiplie le numérateur, on garde le dénominateur.",
    generer() {
      const b = alea(2, 11), a = alea(1, b + 3), n = alea(2, 9);
      const avant = Math.random() < 0.6;
      return {
        consigne: "Calcule. Donne le résultat sous forme d'une fraction.",
        ligne: avant ? `${n} × ${F(a, b)} = [f]` : `${F(a, b)} × ${n} = [f]`,
        verifier(v) {
          const r = verifierFraction(v[0], n * a, b);
          if (r.etat === "faux" && lireEntier(v[0].num) === n * a && lireEntier(v[0].den) === n * b) r.message = `On ne multiplie pas le dénominateur : ${n} × ${F(a, b)} = ${F(a, b)} + ${F(a, b)} + … (${n} fois), les parts restent des ${b}<sup>e</sup>s.`;
          return r;
        },
        indice: `${n} × ${F(a, b)}, c'est ${n} fois ${a} part${a > 1 ? "s" : ""} de ${F(1, b)}.`,
        correction: `${n} × ${F(a, b)} = ${F(`${n} × ${a}`, b)} = ${F(n * a, b)}${(n * a) % b === 0 ? ` = ${n * a / b}` : ""}.`
      };
    }
  },

  {
    groupe: F5,
    id: "fraction-quantite",
    titre: "Fraction d'une quantité",
    description: "Deux façons : diviser puis multiplier, ou multiplier puis diviser.",
    generer() {
      const b = choisir([2, 3, 4, 5, 6, 8, 10]), a = alea(1, b - 1);
      const q = choisir([b * alea(2, 12), alea(5, 40)]);
      const [nom, unite] = choisir([["kg de pommes", "kg"], ["L d'eau", "L"], ["km", "km"], ["€", "€"], ["élèves", "élèves"]]);
      const qq = unite === "élèves" ? b * alea(2, 8) : q;
      const r = rr(a * qq / b);
      if (!estDecimale(a * qq, b)) return this.generer();
      return {
        consigne: `Calcule ${F(a, b)} de ${qq} ${nom}.`,
        ligne: `[d] ${unite}`,
        verifier: v => verifierNombre(v[0], r),
        indice: `${F(a, b)} de ${qq}, c'est (${qq} ÷ ${b}) × ${a}, ou (${qq} × ${a}) ÷ ${b}.`,
        correction: `(${qq} × ${a}) ÷ ${b} = ${a * qq} ÷ ${b} = ${nb(r)} ${unite}.`
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
    { competence: "La fraction, quotient de deux entiers", activites: ["fraction-division", "fraction-entier"] },
    { competence: "Écriture décimale d'une fraction", activites: ["ecriture-decimale", "relier-fraction-decimal"] },
    { competence: "Décimal ou pas ? Valeur arrondie", activites: ["decimal-ou-pas", "valeur-arrondie"] },
    { competence: "Résoudre un problème de partage", activites: ["partager-longueur", "problemes-quotient"] },
    { competence: "Le quotient : b × a/b = a", activites: ["quotient-produit", "completer-fraction"] },
    { competence: "Décomposer une fraction", activites: ["nombre-mixte"] },
    { competence: "Encadrer et placer une fraction", activites: ["encadrer", "placer-quotient"] },
    { competence: "Comparer des fractions", activites: ["comparer-fractions", "comparer-a-1"] },
    { competence: "Ranger des fractions", activites: ["ranger-fractions"] },
    { competence: "Multiplier une fraction par un entier", activites: ["fraction-fois-entier", "fraction-quantite"] }
  ]
};
