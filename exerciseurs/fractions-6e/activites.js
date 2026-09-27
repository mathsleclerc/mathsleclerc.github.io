/* =====================================================================
   EXERCISEUR « FRACTIONS » — 6e

   Chaque activité a :
     id          → utilisé dans l'adresse : …/fractions-6e/#lire-fraction
     titre, description
     generer()   → fabrique une question au hasard

   Une question contient : consigne, figure (facultatif), ligne (avec les
   cases à compléter, voir moteur.js), verifier(), indice et correction.
   ===================================================================== */

const inf = "&lt;", sup = "&gt;";
const symbole = s => s === "<" ? inf : s === ">" ? sup : "=";
const LETTRES = "ABCDEFGHKM".split("");
const graduations = n => n + (n > 1 ? " graduations" : " graduation");

const ACTIVITES = [

  {
    id: "lire-fraction",
    titre: "Lire une fraction",
    description: "Quelle fraction de la figure est coloriée ?",
    generer() {
      const b = alea(2, 10);
      const plusQueUn = Math.random() < 0.25;
      const a = plusQueUn ? alea(b + 1, 2 * b - 1) : alea(1, b - 1);
      const forme = choisir([disque, rectangle]);
      const figures = [];
      for (let reste = a; reste > 0; reste -= b) figures.push(forme(b, Math.min(b, reste)));
      return {
        consigne: plusQueUn
          ? "Chaque figure représente une unité. Quelle fraction d'unité est coloriée ?"
          : "Quelle fraction de la figure est coloriée ?",
        figure: figures,
        ligne: "[f]",
        verifier: v => verifierFraction(v[0], a, b),
        indice: "Compte en combien de parts égales l'unité est partagée : c'est le dénominateur. Compte ensuite les parts coloriées : c'est le numérateur.",
        correction: `L'unité est partagée en ${b} parts égales et ${a} parts sont coloriées : la fraction coloriée est ${frac(a, b)}.`
      };
    }
  },

  {
    id: "lire-abscisse",
    titre: "Lire une abscisse",
    description: "Lire l'abscisse d'un point sur une demi-droite graduée.",
    generer() {
      const b = alea(2, 8), lettre = choisir(LETTRES);
      let a;
      do a = alea(1, unitesDroite() * b - 1); while (a % b === 0);
      return {
        consigne: `Quelle est l'abscisse du point ${lettre} ? Donne-la sous forme d'une fraction.`,
        figure: droiteGraduee(b, { point: a, lettre }).svg,
        ligne: `${lettre}&thinsp;( [f] )`,
        verifier: v => verifierFraction(v[0], a, b),
        indice: "Compte en combien de parts égales l'unité (de 0 à 1) est partagée.",
        correction: `L'unité est partagée en ${b} parts égales : chaque graduation vaut ${frac(1, b)}. Le point ${lettre} est à ${graduations(a)} de l'origine, donc son abscisse est ${frac(a, b)}.`
      };
    }
  },

  {
    id: "placer-point",
    titre: "Placer un point",
    description: "Placer un point d'abscisse donnée sur une demi-droite graduée.",
    generer() {
      const b = alea(2, 6), lettre = choisir(LETTRES);
      let a;
      do a = alea(1, unitesDroite() * b - 1); while (a % b === 0);
      const d = droiteGraduee(b, { lettre, clic: true });
      return {
        consigne: `Place le point ${lettre} d'abscisse ${frac(a, b)} en cliquant sur la demi-droite graduée, puis valide.`,
        figure: d.svg,
        verifier() {
          if (d.position == null) return { etat: "incomplet", message: "Clique sur la demi-droite pour placer le point." };
          if (d.position === a) return { etat: "juste" };
          return { etat: "faux", message: `Ton point a pour abscisse ${frac(d.position, b)}.` };
        },
        indice: `L'unité est partagée en ${b} parts égales : chaque graduation vaut ${frac(1, b)}.`,
        correction: `Chaque graduation vaut ${frac(1, b)}. On compte ${graduations(a)} à partir de 0 : le point ${lettre} est placé en vert.`,
        surCorrection: () => d.marquer(a, "pt correct", lettre),
        bloquer: () => { d.actif = false; }
      };
    }
  },

  {
    id: "quotient",
    titre: "Fraction et quotient",
    description: "Une fraction est le résultat d'une division.",
    generer() {
      const b = alea(2, 12);
      let a;
      do a = alea(1, 15); while (a % b === 0);
      const [consigne, ligne] = choisir([
        ["Complète avec une fraction.", `${b} × [f] = ${a}`],
        ["Complète avec une fraction.", `[f] × ${b} = ${a}`],
        ["Écris le quotient sous forme d'une fraction.", `${a} ÷ ${b} = [f]`],
        [`Quel nombre, multiplié par ${b}, donne ${a} ? Réponds par une fraction.`, "[f]"]
      ]);
      return {
        consigne, ligne,
        verifier: v => verifierFraction(v[0], a, b),
        indice: `Rappel : ${frac("<i>a</i>", "<i>b</i>")} est le nombre qui, multiplié par <i>b</i>, donne <i>a</i>.`,
        correction: `${frac(a, b)} est le nombre qui, multiplié par ${b}, donne ${a} : ${b} × ${frac(a, b)} = ${a}. C'est le quotient ${a} ÷ ${b}.`
      };
    }
  },

  {
    id: "egalites",
    titre: "Fractions égales",
    description: "Compléter une égalité de fractions.",
    generer() {
      const b = alea(2, 10), k = alea(2, 6), a = alea(1, 2 * b);
      const variantes = [
        [`${frac(a, b)} = [f/${b * k}]`, a * k],
        [`${frac(a, b)} = [f${a * k}/]`, b * k],
        [`${frac(a * k, b * k)} = [f/${b}]`, a],
        [`${frac(a * k, b * k)} = [f${a}/]`, b]
      ];
      const i = alea(0, 3);
      const [ligne, attendu] = variantes[i];
      return {
        consigne: "Complète l'égalité.",
        ligne,
        verifier: v => verifierNombre(i % 2 === 0 ? v[0].num : v[0].den, attendu),
        indice: "Une fraction ne change pas quand on multiplie (ou divise) son numérateur et son dénominateur par un même nombre.",
        correction: i < 2
          ? `On multiplie le numérateur et le dénominateur par ${k} : ${frac(a, b)} = ${frac(`${a} × ${k}`, `${b} × ${k}`)} = ${frac(a * k, b * k)}.`
          : `On divise le numérateur et le dénominateur par ${k} : ${frac(a * k, b * k)} = ${frac(`${a * k} ÷ ${k}`, `${b * k} ÷ ${k}`)} = ${frac(a, b)}.`
      };
    }
  },

  {
    id: "comparer",
    titre: "Comparer",
    description: "Comparer une fraction à 1, ou deux fractions de même dénominateur.",
    generer() {
      const b = alea(2, 12);
      if (Math.random() < 0.5) {
        const a = Math.random() < 0.15 ? b : choisir([alea(1, b - 1), alea(b + 1, 2 * b + 3)]);
        const s = a < b ? "<" : a > b ? ">" : "=";
        return {
          consigne: "Compare cette fraction à 1 : choisis le bon symbole.",
          ligne: `${frac(a, b)} [c] 1`,
          choix: ["<", "=", ">"],
          verifier: v => ({ etat: v[0] === s ? "juste" : "faux" }),
          indice: "Compare le numérateur et le dénominateur.",
          correction: a === b
            ? `Le numérateur est égal au dénominateur, donc ${frac(a, b)} = 1.`
            : `Le numérateur ${a} est ${a < b ? "plus petit" : "plus grand"} que le dénominateur ${b}, donc ${frac(a, b)} ${symbole(s)} 1.`
        };
      }
      const a1 = alea(1, 2 * b);
      let a2;
      do a2 = alea(1, 2 * b); while (a2 === a1);
      const s = a1 < a2 ? "<" : ">";
      return {
        consigne: "Compare ces deux fractions : choisis le bon symbole.",
        ligne: `${frac(a1, b)} [c] ${frac(a2, b)}`,
        choix: ["<", "=", ">"],
        verifier: v => ({ etat: v[0] === s ? "juste" : "faux" }),
        indice: "Les deux fractions ont le même dénominateur : compare les numérateurs.",
        correction: `Les deux fractions ont le même dénominateur ${b}. On compare les numérateurs : ${a1} ${symbole(s)} ${a2}, donc ${frac(a1, b)} ${symbole(s)} ${frac(a2, b)}.`
      };
    }
  },

  {
    id: "entier-et-fraction",
    titre: "Entier et fraction",
    description: "Décomposer une fraction, l'encadrer entre deux entiers.",
    generer() {
      const b = alea(2, 9), n = alea(1, 5), r = alea(1, b - 1), a = n * b + r;
      const indice = `Cherche combien de fois ${b} « rentre » dans ${a}.`;
      if (Math.random() < 0.5) {
        return {
          consigne: "Écris cette fraction comme la somme d'un nombre entier et d'une fraction inférieure à 1.",
          ligne: `${frac(a, b)} = [n] + [f/${b}]`,
          verifier(v) {
            const e = lireEntier(v[0]), x = lireEntier(v[1].num);
            if (isNaN(e) || isNaN(x)) return { etat: "incomplet", message: "Complète les deux cases avec des nombres entiers." };
            if (e === n && x === r) return { etat: "juste" };
            if (e * b + x === a) return { etat: "faux", message: "Ton égalité est vraie, mais la fraction doit être inférieure à 1." };
            return { etat: "faux" };
          },
          indice,
          correction: `${a} = ${n} × ${b} + ${r}, donc ${frac(a, b)} = ${frac(n * b, b)} + ${frac(r, b)} = ${n} + ${frac(r, b)}.`
        };
      }
      return {
        consigne: "Encadre cette fraction entre deux nombres entiers consécutifs.",
        ligne: `[n] ${inf} ${frac(a, b)} ${inf} [n]`,
        verifier(v) {
          const e1 = lireEntier(v[0]), e2 = lireEntier(v[1]);
          if (isNaN(e1) || isNaN(e2)) return { etat: "incomplet", message: "Complète les deux cases avec des nombres entiers." };
          if (e1 === n && e2 === n + 1) return { etat: "juste" };
          if (e2 !== e1 + 1) return { etat: "faux", message: "Les deux nombres entiers doivent être consécutifs (comme 4 et 5)." };
          return { etat: "faux" };
        },
        indice,
        correction: `${a} = ${n} × ${b} + ${r}, donc ${frac(a, b)} = ${n} + ${frac(r, b)}. Comme ${frac(r, b)} est compris entre 0 et 1 : ${n} ${inf} ${frac(a, b)} ${inf} ${n + 1}.`
      };
    }
  },

  {
    id: "fractions-decimales",
    titre: "Fractions décimales",
    description: "Passer d'une fraction décimale à un nombre décimal, et inversement.",
    generer() {
      const p = alea(1, 3), den = 10 ** p;
      const unite = ["dixième", "centième", "millième"][p - 1];
      let a;
      do a = alea(1, 3 * den); while (a % 10 === 0);
      const texte = ecrireNombre(a / den);
      const lecture = `« ${a} ${unite}${a > 1 ? "s" : ""} »`;
      const indice = `${frac(1, den)} se lit « un ${unite} ».`;
      if (Math.random() < 0.5) {
        return {
          consigne: "Écris cette fraction décimale sous forme d'un nombre décimal.",
          ligne: `${frac(a, den)} = [d]`,
          verifier: v => verifierNombre(v[0], a / den),
          indice,
          correction: `${frac(a, den)} se lit ${lecture} : ${frac(a, den)} = ${texte}.`
        };
      }
      return {
        consigne: "Complète avec une fraction décimale.",
        ligne: `${texte} = [f/${den}]`,
        verifier: v => verifierNombre(v[0].num, a),
        indice,
        correction: `${texte} se lit ${lecture}, donc ${texte} = ${frac(a, den)}.`
      };
    }
  },

  {
    id: "fraction-d-une-quantite",
    titre: "Fraction d'une quantité",
    description: "Calculer une fraction d'un nombre, dans des problèmes.",
    generer() {
      const b = choisir([2, 3, 4, 5, 6, 8, 10]), a = alea(1, b - 1), N = b * alea(2, 12);
      const part = N / b, res = part * a;
      const f = frac(a, b), les = a === 1 ? "le" : "les";
      const [texte, unite] = choisir([
        [`Dans une classe de ${N} élèves, ${les} ${f} sont demi-pensionnaires. Combien d'élèves sont demi-pensionnaires ?`, "élèves"],
        [`Léa a lu ${les} ${f} d'un livre de ${N} pages. Combien de pages a-t-elle lues ?`, "pages"],
        [`Un gâteau pèse ${N} g. On en mange ${les} ${f}. Quelle masse de gâteau a-t-on mangée ?`, "g"],
        [`Un film dure ${N} minutes. Sarah en a regardé ${les} ${f}. Combien de minutes a-t-elle regardées ?`, "min"],
        [`Une bouteille contient ${N} cL de jus. On en verse ${les} ${f} dans des verres. Combien de centilitres a-t-on versés ?`, "cL"],
        [`Calcule ${les} ${f} de ${N}.`, ""]
      ]);
      return {
        consigne: texte,
        ligne: `[n] ${unite}`,
        verifier(v) {
          const r = verifierNombre(v[0], res);
          if (r.etat === "faux" && a > 1 && lireNombre(v[0]) === part) {
            r.message = `Tu as calculé ${frac(1, b)} de ${N}. Il en faut ${a} fois plus.`;
          }
          return r;
        },
        indice: `Commence par calculer ${frac(1, b)} de ${N}, c'est-à-dire ${N} ÷ ${b}.`,
        correction: `${frac(1, b)} de ${N}, c'est ${N} ÷ ${b} = ${part}.`
          + (a > 1 ? ` Donc ${f} de ${N}, c'est ${part} × ${a} = ${res}.` : "")
      };
    }
  }

];
