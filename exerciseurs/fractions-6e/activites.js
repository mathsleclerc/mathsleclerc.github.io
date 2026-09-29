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

const nb = x => ecrireNombre(x);

const G1 = "Comprendre les fractions";
const G2 = "Additionner et soustraire";
const G3 = "Fraction d'une quantité et pourcentages";
const G4 = "Résoudre des problèmes";

function pgcd(a, b) { return b ? pgcd(b, a % b) : a; }
function ppcm(a, b) { return a / pgcd(a, b) * b; }

/* Pourcentages usuels du cours : [pourcentage, numérateur, dénominateur, en mots] */
const USUELS = [[50, 1, 2, "la moitié"], [25, 1, 4, "le quart"], [75, 3, 4, "les trois quarts"],
  [10, 1, 10, "le dixième"], [20, 1, 5, "le cinquième"], [100, 1, 1, "le tout"]];

/* Une bande partagée en b parts égales, dont a coloriées. */
function bande(b, a) {
  const l = 300 / b;
  const s = svg("svg", { viewBox: "-2 -2 304 54", width: 304, height: 54, role: "img", "aria-label": `Bande partagée en ${b} parts égales, dont ${a} coloriées` });
  for (let i = 0; i < b; i++) s.append(svg("rect", { x: i * l, y: 0, width: l, height: 50, class: "fig-part" + (i < a ? " coloriee" : "") }));
  return s;
}

/* Un problème à plusieurs questions. Réponse r : un nombre, ou [a, b] pour une fraction. */
function probleme(enonce, etapes) {
  const numeroter = etapes.length > 1;
  return {
    consigne: enonce,
    classeLigne: "etapes",
    ligne: etapes.map((e, k) => `<div class="etape-pb"><p>${numeroter ? k + 1 + ". " : ""}${e.q}</p><p class="rep">${Array.isArray(e.r) ? "[f]" : "[d]"} ${e.unite || ""}</p></div>`).join(""),
    verifier(v) {
      const res = etapes.map((e, k) => Array.isArray(e.r) ? verifierFraction(v[k], ...e.r) : verifierNombre(v[k], e.r));
      if (res.some(r => r.etat === "incomplet")) return { etat: "incomplet", message: "Réponds à chaque question." };
      const fausses = res.map((r, k) => r.etat === "faux" ? k : -1).filter(k => k >= 0);
      if (!fausses.length) return { etat: "juste" };
      const messages = fausses.map(k => etapes[k].piege?.(v[k]) || res[k].message).filter(Boolean);
      return { etat: "faux", message: (numeroter ? `À revoir : question ${fausses.map(k => k + 1).join(" et ")}. ` : "") + messages.join(" ") };
    },
    indice: "Écris chaque calcul. Pour ajouter ou enlever des fractions, écris-les d'abord avec le même dénominateur ; le tout s'écrit 1.",
    correction: etapes.map((e, k) => `<br>${numeroter ? k + 1 + ". " : ""}${e.calcul}`).join("")
  };
}

const ACTIVITES = [

  {
    groupe: G1,
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
          + (pgcd(a, b) > 1 ? ` En simplifiant, ${frac(a, b)} = ${frac(`${a} ÷ ${pgcd(a, b)}`, `${b} ÷ ${pgcd(a, b)}`)} = ${frac(a / pgcd(a, b), b / pgcd(a, b))} : c'est la fraction irréductible.` : ` Cette fraction est irréductible : on ne peut pas la simplifier.`)
      };
    }
  },

  {
    groupe: G1,
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
    groupe: G1,
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
    groupe: G1,
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
    groupe: G1,
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
    groupe: G1,
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

  /* ================= Additionner et soustraire ================= */

  {
    groupe: G2,
    id: "meme-denominateur",
    titre: "Même dénominateur",
    description: "On garde le dénominateur, on additionne ou on soustrait les numérateurs.",
    generer() {
      const b = alea(3, 12);
      const cas = choisir(["addition", "addition", "soustraction", "entier", "trou", "erreur"]);
      const regle = "On garde le dénominateur et on additionne (ou on soustrait) les numérateurs. On n'additionne jamais les dénominateurs.";
      // Réponse fraction, avec le message dédié si l'élève a additionné les dénominateurs
      const reponse = (n, d, v) => {
        const r = verifierFraction(v, n, d);
        if (r.etat === "faux" && lireEntier(v.den) === 2 * d) r.message = "On n'additionne jamais les dénominateurs : on garde le dénominateur.";
        return r;
      };
      if (cas === "addition" || cas === "soustraction") {
        let a, c;
        if (cas === "addition") { a = alea(1, b - 1); c = alea(1, b); }
        else { a = alea(2, b + 3); c = alea(1, a - 1); }
        const r = cas === "addition" ? a + c : a - c, op = cas === "addition" ? "+" : "−";
        return {
          consigne: "Calcule.",
          ligne: `${frac(a, b)} ${op} ${frac(c, b)} = [f]`,
          verifier: v => reponse(r, b, v[0]),
          indice: regle,
          correction: `${frac(a, b)} ${op} ${frac(c, b)} = ${frac(`${a} ${op} ${c}`, b)} = ${frac(r, b)}` + (r === b ? " = 1." : ".")
        };
      }
      if (cas === "entier") {
        const n = alea(1, 3), a = alea(1, b - 1), plus = Math.random() < 0.6;
        const r = plus ? n * b + a : n * b - a, op = plus ? "+" : "−";
        return {
          consigne: "Calcule.",
          ligne: `${n} ${op} ${frac(a, b)} = [f]`,
          verifier: v => verifierFraction(v[0], r, b),
          indice: `Écris d'abord ${n} sous forme d'une fraction de dénominateur ${b} : ${n} = ${frac("…", b)}.`,
          correction: `${n} = ${frac(n * b, b)}, donc ${n} ${op} ${frac(a, b)} = ${frac(n * b, b)} ${op} ${frac(a, b)} = ${frac(r, b)}.`
        };
      }
      if (cas === "trou") {
        const a = alea(1, b - 2), c = alea(1, b - a);
        const [ligne, attendu] = choisir([
          [`${frac(a, b)} + [f/${b}] = ${frac(a + c, b)}`, c],
          [`[f/${b}] + ${frac(c, b)} = ${frac(a + c, b)}`, a],
          [`${frac(a + c, b)} − [f/${b}] = ${frac(a, b)}`, c]
        ]);
        return {
          consigne: "Complète.",
          ligne,
          verifier: v => verifierNombre(v[0].num, attendu),
          indice: "Les dénominateurs sont les mêmes : il suffit de trouver le numérateur manquant.",
          correction: `Le numérateur manquant est ${attendu} : ${ligne.replace(/\[f\/\d+\]/, frac(attendu, b))}.`
        };
      }
      const a = alea(1, b - 2), c = alea(1, b - a), juste = Math.random() < 0.35;
      const resultat = juste ? frac(a + c, b) : frac(a + c, 2 * b);
      const options = ["Il a raison", "Il a tort"];
      return {
        consigne: `Hugo écrit : ${frac(a, b)} + ${frac(c, b)} = ${resultat}. A-t-il raison ?`,
        choix: options,
        verifier: (v, ch) => ({ etat: (ch === options[0]) === juste ? "juste" : "faux" }),
        indice: regle,
        correction: juste
          ? `Il a raison : on garde le dénominateur ${b} et on additionne les numérateurs.`
          : `Il a tort : il a additionné les dénominateurs. On garde le dénominateur : ${frac(a, b)} + ${frac(c, b)} = ${frac(a + c, b)}.`
      };
    }
  },

  {
    groupe: G2,
    id: "denominateurs-multiples",
    titre: "Un dénominateur multiple de l'autre",
    description: "Écrire les fractions avec le même dénominateur, puis calculer.",
    generer() {
      let b, k, d;
      do { b = alea(2, 6); k = alea(2, 4); d = b * k; } while (d > 20);
      const a = alea(1, b - 1), c = alea(1, d - 1);
      const plus = Math.random() < 0.5;
      // la fraction de petit dénominateur a/b devient (a × k)/d ; pour une soustraction, la plus grande en premier
      if (!plus && a * k === c) return this.generer();
      const premier = plus ? choisir(["petit", "grand"]) : a * k > c ? "petit" : "grand";
      const op = plus ? "+" : "−";
      const r = plus ? a * k + c : Math.abs(a * k - c);
      const gauche = premier === "petit" ? `${frac(a, b)} ${op} ${frac(c, d)}` : `${frac(c, d)} ${op} ${frac(a, b)}`;
      const milieu = premier === "petit" ? `[f/${d}] ${op} ${frac(c, d)}` : `${frac(c, d)} ${op} [f/${d}]`;
      return {
        consigne: `${d} est un multiple de ${b}. Écris les fractions avec le dénominateur ${d}, puis calcule.`,
        ligne: `${gauche} = ${milieu} = [f]`,
        verifier(v) {
          const n1 = lireEntier(v[0].num);
          if (isNaN(n1)) return { etat: "incomplet", message: "Complète toutes les cases." };
          const fin = verifierFraction(v[1], r, d);
          if (fin.etat === "incomplet") return fin;
          if (n1 !== a * k) return { etat: "faux", message: `Pour écrire ${frac(a, b)} avec le dénominateur ${d}, on multiplie le numérateur et le dénominateur par ${k}.` };
          return fin;
        },
        indice: `${b} × ${k} = ${d} : multiplie le numérateur et le dénominateur de ${frac(a, b)} par ${k}.`,
        correction: `${frac(a, b)} = ${frac(`${a} × ${k}`, `${b} × ${k}`)} = ${frac(a * k, d)}, donc ${gauche} = ${premier === "petit" ? `${frac(a * k, d)} ${op} ${frac(c, d)}` : `${frac(c, d)} ${op} ${frac(a * k, d)}`} = ${frac(r, d)}.`
      };
    }
  },

  {
    groupe: G2,
    id: "denominateurs-differents",
    titre: "Changer les deux dénominateurs",
    description: "Chercher des « parts communes » : un multiple des deux dénominateurs.",
    generer(stats = {}) {
      const [b, d] = melanger(choisir([[2, 3], [3, 4], [2, 5], [4, 5], [3, 5], [4, 6], [6, 8], [4, 10], [6, 9], [5, 6], [3, 8], [2, 7], [3, 10]]));
      const m = ppcm(b, d), kb = m / b, kd = m / d;
      let a = alea(1, b - 1), c = alea(1, d - 1);
      const plus = Math.random() < 0.55;
      if (!plus && a * kb === c * kd) return this.generer();
      // pour une soustraction, la plus grande fraction en premier
      let [x, y, kx, ky, bx, by] = [a, c, kb, kd, b, d];
      if (!plus && a * kb < c * kd) [x, y, kx, ky, bx, by] = [c, a, kd, kb, d, b];
      const op = plus ? "+" : "−", r = plus ? x * kx + y * ky : x * kx - y * ky;
      const defi = (stats.serie || 0) >= 3; // après 3 réussites de suite, on n'indique plus le dénominateur
      const correction = `${m} est un multiple de ${bx} et de ${by}. ${frac(x, bx)} = ${frac(`${x} × ${kx}`, `${bx} × ${kx}`)} = ${frac(x * kx, m)} et ${frac(y, by)} = ${frac(`${y} × ${ky}`, `${by} × ${ky}`)} = ${frac(y * ky, m)}.<br>Donc ${frac(x, bx)} ${op} ${frac(y, by)} = ${frac(x * kx, m)} ${op} ${frac(y * ky, m)} = ${frac(r, m)}.`;
      if (defi) {
        return {
          consigne: "Trois réussites de suite : cette fois, le dénominateur commun n'est plus donné. Calcule.",
          ligne: `${frac(x, bx)} ${op} ${frac(y, by)} = [f]`,
          verifier: v => verifierFraction(v[0], r, m),
          indice: `Cherche un nombre qui est un multiple de ${bx} et de ${by}, puis écris les deux fractions avec ce dénominateur.`,
          correction
        };
      }
      return {
        consigne: `Écris les fractions avec le dénominateur ${m}, puis calcule.`,
        ligne: `${frac(x, bx)} ${op} ${frac(y, by)} = [f/${m}] ${op} [f/${m}] = [f]`,
        verifier(v) {
          const n1 = lireEntier(v[0].num), n2 = lireEntier(v[1].num);
          if (isNaN(n1) || isNaN(n2)) return { etat: "incomplet", message: "Complète toutes les cases." };
          const fin = verifierFraction(v[2], r, m);
          if (fin.etat === "incomplet") return fin;
          if (n1 !== x * kx || n2 !== y * ky) return { etat: "faux", message: `Pour passer au dénominateur ${m}, multiplie numérateur et dénominateur par le même nombre : ${bx} × ${kx} = ${m} et ${by} × ${ky} = ${m}.` };
          return fin;
        },
        indice: `${bx} × ${kx} = ${m} et ${by} × ${ky} = ${m}.`,
        correction
      };
    }
  },

  {
    groupe: G2,
    id: "fraction-restante",
    titre: "La fraction restante",
    description: "1 − 5/8 = 8/8 − 5/8 = 3/8.",
    generer() {
      const b = alea(3, 12), a = alea(1, b - 1);
      const cas = choisir(["un", "un", "deux", "somme"]);
      if (cas === "un") {
        return {
          consigne: "Complète.",
          ligne: `1 − ${frac(a, b)} = [f] − ${frac(a, b)} = [f]`,
          verifier(v) {
            const debut = verifierFraction(v[0], b, b), fin = verifierFraction(v[1], b - a, b);
            if (debut.etat === "incomplet" || fin.etat === "incomplet") return { etat: "incomplet", message: "Complète toutes les cases." };
            if (debut.etat === "faux") return { etat: "faux", message: `Le tout s'écrit 1 = ${frac(b, b)} : même numérateur et même dénominateur.` };
            return fin;
          },
          indice: `Le tout (l'unité) s'écrit 1 = ${frac(2, 2)} = ${frac(3, 3)} = ${frac(4, 4)} = … Choisis le dénominateur ${b}.`,
          correction: `1 − ${frac(a, b)} = ${frac(b, b)} − ${frac(a, b)} = ${frac(b - a, b)}.`
        };
      }
      if (cas === "deux") {
        return {
          consigne: "Calcule.",
          ligne: `2 − ${frac(a, b)} = [f]`,
          verifier: v => verifierFraction(v[0], 2 * b - a, b),
          indice: `2 = ${frac(2 * b, b)}.`,
          correction: `2 − ${frac(a, b)} = ${frac(2 * b, b)} − ${frac(a, b)} = ${frac(2 * b - a, b)}.`
        };
      }
      if (a > b - 2) return this.generer();
      const c = alea(1, b - a - 1);
      return {
        consigne: `On utilise ${frac(a, b)} puis ${frac(c, b)} d'un tout. Quelle fraction reste-t-il ?`,
        ligne: "[f]",
        verifier: v => verifierFraction(v[0], b - a - c, b),
        indice: `Additionne d'abord ce qui est utilisé, puis enlève-le du tout : 1 = ${frac(b, b)}.`,
        correction: `${frac(a, b)} + ${frac(c, b)} = ${frac(a + c, b)}, et 1 − ${frac(a + c, b)} = ${frac(b, b)} − ${frac(a + c, b)} = ${frac(b - a - c, b)}.`
      };
    }
  },

  /* ================= Fraction d'une quantité et pourcentages ================= */

  {
    groupe: G3,
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
  },

  /* ================= Pourcentages ================= */

  {
    groupe: G3,
    id: "pourcentages-fractions",
    titre: "Pourcentages et fractions",
    description: "Relier, traduire : 25 % = 1/4, 26 % = 26/100…",
    generer() {
      const cas = choisir(["relier", "relier", "vers-fraction", "sur-cent", "vers-pourcentage", "vrai-faux"]);
      if (cas === "relier") {
        const paires = melanger([...USUELS]).slice(0, 5);
        const r = relier(paires.map(([t]) => ({ html: t + " %", cle: t })), paires.map(([t, a, b]) => ({ html: b === 1 ? "1" : frac(a, b), cle: t })));
        return {
          consigne: "Relie chaque pourcentage à la fraction égale : clique sur un pourcentage, puis sur sa fraction.",
          figure: r.noeud,
          verifier: r.verifier,
          indice: "50 % = la moitié, 25 % = le quart, 75 % = les trois quarts, 10 % = le dixième, 20 % = le cinquième, 100 % = le tout.",
          correction: "Les liens justes sont en vert, les liens faux en rouge. " + paires.map(([t, a, b, mots]) => `${t} % = ${b === 1 ? "1" : frac(a, b)} (${mots})`).join(" ; ") + ".",
          surCorrection: r.corriger,
          bloquer: r.bloquer
        };
      }
      if (cas === "vers-fraction") {
        const [t, a, b, mots] = choisir(USUELS.slice(0, 5));
        return {
          consigne: `Écris ${t} % sous forme d'une fraction simple.`,
          ligne: `${t} % = [f]`,
          verifier(v) {
            const r = verifierFraction(v[0], a, b);
            if (r.etat === "juste" && lireEntier(v[0].den) === 100) r.message = `C'est juste, et on peut simplifier : ${t} % = ${frac(a, b)}, c'est ${mots}.`;
            return r;
          },
          indice: `${t} % = ${frac(t, 100)}. Pense aux pourcentages usuels du cours.`,
          correction: `${t} % = ${frac(t, 100)} = ${frac(a, b)} : c'est ${mots}.`
        };
      }
      if (cas === "sur-cent") {
        const t = alea(1, 99);
        return {
          consigne: "Écris ce pourcentage sous forme d'une fraction de dénominateur 100.",
          ligne: `${t} % = [f/100]`,
          verifier: v => verifierNombre(v[0].num, t),
          indice: "Un pourcentage est une fraction de dénominateur 100 : t % = t/100.",
          correction: `${t} % = ${frac(t, 100)}.`
        };
      }
      if (cas === "vers-pourcentage") {
        const [t, a, b, mots] = choisir(USUELS.slice(0, 5));
        return {
          consigne: `Écris ${mots} (${frac(a, b)}) sous forme d'un pourcentage.`,
          ligne: `${frac(a, b)} = [n] %`,
          verifier: v => verifierNombre(v[0], t),
          indice: `Écris ${frac(a, b)} avec le dénominateur 100.`,
          correction: `${frac(a, b)} = ${frac(t, 100)} = ${t} %.`
        };
      }
      const [enonce, vrai, explication] = choisir([
        ["25 % = " + frac(2, 5), false, `25 % = ${frac(25, 100)} = ${frac(1, 4)}, pas ${frac(2, 5)} : on ne sépare pas les chiffres de 25 !`],
        ["75 % = " + frac(3, 4), true, `75 % = ${frac(75, 100)} = ${frac(3, 4)}.`],
        ["20 % = " + frac(1, 20), false, `20 % = ${frac(20, 100)} = ${frac(1, 5)}, c'est le cinquième.`],
        ["10 % = " + frac(1, 10), true, `10 % = ${frac(10, 100)} = ${frac(1, 10)}, c'est le dixième.`],
        ["50 %, c'est la moitié", true, `50 % = ${frac(50, 100)} = ${frac(1, 2)}.`],
        ["20 %, c'est le quart", false, `Le quart, c'est 25 % ; 20 %, c'est le cinquième.`],
        ["100 % = 1", true, "100 % = " + frac(100, 100) + " = 1 : c'est le tout."],
        ["30 % = " + frac(3, 10), true, `30 % = ${frac(30, 100)} = ${frac(3, 10)}.`]
      ]);
      return {
        consigne: `Nina affirme : « ${enonce} ». A-t-elle raison ?`,
        choix: ["Elle a raison", "Elle a tort"],
        verifier: (v, ch) => ({ etat: (ch === "Elle a raison") === vrai ? "juste" : "faux" }),
        indice: "Écris le pourcentage sous forme d'une fraction de dénominateur 100, puis compare.",
        correction: (vrai ? "Elle a raison. " : "Elle a tort. ") + explication
      };
    }
  },

  {
    groupe: G3,
    id: "quel-pourcentage",
    titre: "Quel pourcentage ?",
    description: "Quel pourcentage de la figure est colorié ? Quel pourcentage représente… ?",
    generer() {
      const cas = choisir(["cent", "bande", "effectif"]);
      if (cas === "cent") {
        const k = alea(3, 97), s = svg("svg", { viewBox: "0 0 204 204", width: 204, height: 204, role: "img", "aria-label": "Grille de 100 carreaux" });
        for (let i = 0; i < 100; i++) {
          s.append(svg("rect", { x: 2 + (i % 10) * 20, y: 2 + Math.floor(i / 10) * 20, width: 20, height: 20, class: "fig-part" + (i < k ? " coloriee" : "") }));
        }
        return {
          consigne: "Quel pourcentage du carré est colorié ?",
          figure: s,
          ligne: "[n] %",
          verifier: v => verifierNombre(v[0], k),
          indice: "Le carré est partagé en 100 carreaux : compte les lignes complètes (10 carreaux chacune), puis les carreaux restants.",
          correction: `${k} carreaux sur 100 sont coloriés : ${frac(k, 100)} = ${k} %.`
        };
      }
      if (cas === "bande") {
        const b = choisir([2, 4, 5, 10]), a = alea(1, b - 1), t = a * 100 / b;
        return {
          consigne: "Quel pourcentage de la bande est colorié ?",
          figure: bande(b, a),
          ligne: "[n] %",
          verifier: v => verifierNombre(v[0], t),
          indice: `La bande est partagée en ${b} parts égales. Écris la fraction coloriée, puis transforme-la en fraction de dénominateur 100.`,
          correction: `${frac(a, b)} de la bande est colorié, et ${frac(a, b)} = ${frac(t, 100)} = ${t} %.`
        };
      }
      const [n, k] = choisir([[20, alea(1, 19)], [25, alea(1, 24)], [50, alea(1, 49)], [10, alea(1, 9)], [4, alea(1, 3)], [5, alea(1, 4)]]);
      const f = 100 / n, t = k * f;
      const [texte, unite] = choisir([
        [`Dans une classe de ${n} élèves, ${k} sont externes.`, "des élèves sont externes"],
        [`Sur ${n} questions, Léo en a réussi ${k}.`, "des questions sont réussies"],
        [`Sur ${n} tirs au but, Inès en a marqué ${k}.`, "des tirs sont marqués"]
      ]);
      return {
        consigne: `${texte} Quel pourcentage ${unite} ?`,
        ligne: `${frac(k, n)} = [f/100] = [n] %`,
        verifier(v) {
          const a = lireEntier(v[0].num), b = lireNombre(v[1]);
          if (isNaN(a) || isNaN(b)) return { etat: "incomplet", message: "Complète les deux cases." };
          if (a === t && b === t) return { etat: "juste" };
          if (a !== t) return { etat: "faux", message: `Pour passer du dénominateur ${n} au dénominateur 100, on multiplie par ${f} le numérateur et le dénominateur.` };
          return { etat: "faux", message: `${frac(t, 100)} = ${t} %.` };
        },
        indice: `${n} × ${f} = 100 : écris ${frac(k, n)} avec le dénominateur 100.`,
        correction: `${frac(k, n)} = ${frac(`${k} × ${f}`, `${n} × ${f}`)} = ${frac(t, 100)} = ${t} %.`
      };
    }
  },

  {
    groupe: G3,
    id: "pourcentages-usuels",
    titre: "Pourcentages usuels d'une quantité",
    description: "50 %, 25 %, 75 %, 10 %, 20 % : utiliser la fraction.",
    generer() {
      const [t, a, b, mots] = choisir(USUELS.slice(0, 5));
      const Q = b * alea(3, 60), r = Q / b * a;
      const unite = choisir(["", "", " €", " g", " élèves", " km"]);
      return {
        consigne: `Calcule en utilisant la fraction correspondante.`,
        ligne: `${t} % de ${nb(Q)}${unite} = [d]${unite}`,
        verifier(v) {
          const res = verifierNombre(v[0], r);
          if (res.etat === "faux" && lireNombre(v[0]) === Q / b && a > 1) res.message = `Tu as calculé ${frac(1, b)} de ${nb(Q)}, mais ${t} % = ${frac(a, b)} : il faut en prendre ${a} fois plus.`;
          return res;
        },
        indice: `${t} % = ${frac(a, b)} : c'est ${mots}.`,
        correction: `${t} % de ${nb(Q)}, c'est ${mots} de ${nb(Q)} : ${nb(Q)} ÷ ${b}${a > 1 ? ` × ${a}` : ""} = ${nb(r)}${unite}.`
      };
    }
  },

  {
    groupe: G3,
    id: "calculer-pourcentage",
    titre: "Calculer un pourcentage",
    description: "t % d'une quantité = quantité ÷ 100 × t.",
    generer() {
      const t = choisir([alea(2, 9), alea(11, 49), alea(51, 99), 15, 18, 26, 30, 40, 60]);
      const Q = choisir([100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500]);
      const r = Q / 100 * t;
      const cas = choisir(["guide", "direct", "decompose"]);
      const correction = `${t} % de ${nb(Q)} = ${nb(Q)} ÷ 100 × ${t} = ${nb(Q / 100)} × ${t} = ${nb(r)}.`;
      if (cas === "guide") {
        return {
          consigne: "Complète.",
          ligne: `${t} % de ${nb(Q)} = ${nb(Q)} ÷ 100 × ${t} = [n] × ${t} = [n]`,
          verifier(v) {
            const x = v.map(lireNombre);
            if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les deux cases." };
            if (x[0] !== Q / 100) return { etat: "faux", message: `Commence par ${nb(Q)} ÷ 100 : c'est 1 % de ${nb(Q)}.` };
            return { etat: x[1] === r ? "juste" : "faux" };
          },
          indice: "Diviser par 100, c'est calculer 1 %. Ensuite, on multiplie par le pourcentage.",
          correction
        };
      }
      if (cas === "direct") {
        return {
          consigne: "Calcule.",
          ligne: `${t} % de ${nb(Q)} = [d]`,
          verifier: v => verifierNombre(v[0], r),
          indice: "t % d'une quantité = quantité ÷ 100 × t.",
          correction
        };
      }
      // Méthode du cours : 10 % + 1 %
      const d = Math.floor(t / 10), u = t % 10;
      if (!d || !u) return this.generer();
      return {
        consigne: `Calcule ${t} % de ${nb(Q)} en passant par 10 % et 1 %.`,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>10 % de ${nb(Q)} =</p><p class="rep">[n]</p></div>`
          + `<div class="etape-pb"><p>1 % de ${nb(Q)} =</p><p class="rep">[n]</p></div>`
          + `<div class="etape-pb"><p>${t} % de ${nb(Q)} = ${d * 10} % + ${u} % =</p><p class="rep">[n]</p></div>`,
        verifier(v) {
          const x = v.map(lireNombre);
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les trois cases." };
          const attendus = [Q / 10, Q / 100, r];
          const fausses = attendus.map((a, k) => x[k] === a ? -1 : k + 1).filter(k => k > 0);
          if (!fausses.length) return { etat: "juste" };
          return { etat: "faux", message: `À revoir : ligne ${fausses.join(" et ")}.` };
        },
        indice: "10 %, c'est le dixième (÷ 10) ; 1 %, c'est le centième (÷ 100).",
        correction: `10 % de ${nb(Q)} = ${nb(Q / 10)} ; 1 % de ${nb(Q)} = ${nb(Q / 100)}.<br>${d * 10} % de ${nb(Q)} = ${nb(Q / 10 * d)} et ${u} % de ${nb(Q)} = ${nb(Q / 100 * u)}, donc ${t} % de ${nb(Q)} = ${nb(Q / 10 * d)} + ${nb(Q / 100 * u)} = ${nb(r)}.`
      };
    }
  },

  /* ================= Problèmes ================= */

  {
    groupe: G4,
    id: "problemes-fractions",
    titre: "Problèmes de fractions",
    description: "Fraction restante, fraction d'une quantité, partages.",
    generer() {
      const modele = alea(0, 9);
      if (modele === 0) {
        const b = alea(4, 12), a = alea(1, b - 1);
        return probleme(`Un randonneur a parcouru ${frac(a, b)} d'un trajet.`, [
          { q: "Quelle fraction du trajet lui reste-t-il ?", r: [b - a, b], calcul: `1 − ${frac(a, b)} = ${frac(b, b)} − ${frac(a, b)} = ${frac(b - a, b)} du trajet.` }
        ]);
      }
      if (modele === 1) {
        const b = choisir([6, 8, 10, 12]), a = alea(1, b / 2 - 1), c = alea(1, b - a - 1);
        return probleme(`Paul mange ${frac(a, b)} d'un gâteau, Léa en mange ${frac(c, b)}.`, [
          { q: "Quelle fraction du gâteau reste-t-il ?", r: [b - a - c, b], calcul: `${frac(a, b)} + ${frac(c, b)} = ${frac(a + c, b)} sont mangés ; il reste 1 − ${frac(a + c, b)} = ${frac(b, b)} − ${frac(a + c, b)} = ${frac(b - a - c, b)} du gâteau.` }
        ]);
      }
      if (modele === 2) {
        const [x, y] = choisir([[2, 8], [2, 4], [3, 6], [4, 8], [3, 9], [5, 10], [2, 6], [4, 12]]);
        const m = y, a = 1, c = alea(1, Math.max(1, m - m / x - 1));
        const utilise = m / x * a + c;
        if (utilise >= m) return this.generer();
        return probleme(`Dans un jardin, ${frac(1, x)} de la surface est réservé aux légumes et ${frac(c, y)} aux fleurs ; le reste est en pelouse.`, [
          { q: "Quelle fraction du jardin est en pelouse ?", r: [m - utilise, m], calcul: `${frac(1, x)} = ${frac(m / x, m)}, donc légumes et fleurs occupent ${frac(m / x, m)} + ${frac(c, m)} = ${frac(utilise, m)}. Pelouse : ${frac(m, m)} − ${frac(utilise, m)} = ${frac(m - utilise, m)} du jardin.` }
        ]);
      }
      if (modele === 3) {
        const N = 6 * alea(3, 6), pied = N / 3, velo = N / 6, bus = N - pied - velo;
        return probleme(`Dans une classe de ${N} élèves, ${frac(1, 3)} des élèves viennent à pied, ${frac(1, 6)} à vélo et les autres en bus.`, [
          { q: "Quelle fraction des élèves vient en bus ?", r: [1, 2], calcul: `${frac(1, 3)} = ${frac(2, 6)}, donc ${frac(2, 6)} + ${frac(1, 6)} = ${frac(3, 6)} viennent à pied ou à vélo. En bus : ${frac(6, 6)} − ${frac(3, 6)} = ${frac(3, 6)}, c'est-à-dire ${frac(1, 2)} des élèves.` },
          { q: "Combien d'élèves viennent en bus ?", r: bus, unite: "élèves", calcul: `${frac(1, 2)} de ${N} : ${N} ÷ 2 = ${bus} élèves.` }
        ]);
      }
      if (modele === 4) {
        const P = 8 * alea(10, 30), sam = P / 4, dim = P / 8 * 3;
        return probleme(`Zoé lit un livre de ${P} pages. Elle en lit ${frac(1, 4)} le samedi et ${frac(3, 8)} le dimanche.`, [
          { q: "Quelle fraction du livre a-t-elle lue ?", r: [5, 8], calcul: `${frac(1, 4)} = ${frac(2, 8)}, donc ${frac(2, 8)} + ${frac(3, 8)} = ${frac(5, 8)} du livre.` },
          { q: "Combien de pages lui reste-t-il à lire ?", r: P - sam - dim, unite: "pages", calcul: `Il reste 1 − ${frac(5, 8)} = ${frac(3, 8)} du livre : ${P} ÷ 8 × 3 = ${P - sam - dim} pages.` }
        ]);
      }
      if (modele === 5) {
        const L = 12 * alea(2, 6);
        return probleme(`Pour peindre une clôture de ${L} m, Inès en peint ${frac(2, 3)} le samedi et ${frac(1, 4)} le dimanche.`, [
          { q: "Quelle fraction de la clôture est peinte ce week-end ?", r: [11, 12], calcul: `${frac(2, 3)} = ${frac(8, 12)} et ${frac(1, 4)} = ${frac(3, 12)}, donc ${frac(8, 12)} + ${frac(3, 12)} = ${frac(11, 12)}.` },
          { q: "Quelle fraction reste-t-il à peindre ?", r: [1, 12], calcul: `${frac(12, 12)} − ${frac(11, 12)} = ${frac(1, 12)}.` },
          { q: "Quelle longueur reste-t-il à peindre ?", r: L / 12, unite: "m", calcul: `${frac(1, 12)} de ${L} m : ${L} ÷ 12 = ${L / 12} m.` }
        ]);
      }
      if (modele === 6) {
        const b = choisir([3, 4, 5, 7]), a = alea(1, b - 1), N = b * alea(4, 8);
        return probleme(`Dans une classe de ${N} élèves, les ${frac(a, b)} sont demi-pensionnaires.`, [
          { q: "Combien d'élèves sont demi-pensionnaires ?", r: N / b * a, unite: "élèves", calcul: `${N} ÷ ${b} = ${N / b}, puis ${N / b} × ${a} = ${N / b * a} élèves.` },
          { q: "Combien ne le sont pas ?", r: N - N / b * a, unite: "élèves", calcul: `${N} − ${N / b * a} = ${N - N / b * a} élèves.` }
        ]);
      }
      if (modele === 7) {
        const [mot, b] = choisir([["du quart", 4], ["du tiers", 3], ["du cinquième", 5], ["de moitié", 2]]);
        const P = b * alea(8, 60), red = P / b;
        return probleme(`Un vélo coûte ${nb(P)} €. Pendant les soldes, son prix baisse ${mot}.`, [
          { q: "Quel est le montant de la réduction ?", r: red, unite: "€", calcul: `${frac(1, b)} de ${nb(P)} € : ${nb(P)} ÷ ${b} = ${nb(red)} €.` },
          { q: "Quel est le nouveau prix ?", r: P - red, unite: "€", calcul: `${nb(P)} − ${nb(red)} = ${nb(P - red)} €.`, piege: x => lireNombre(x) === red ? "Tu as donné la réduction : il faut l'enlever au prix de départ." : "" }
        ]);
      }
      if (modele === 8) {
        const b = choisir([3, 4, 5]), a = alea(1, b - 1), V = b * alea(6, 25);
        return probleme(`Un réservoir de ${V} L est rempli aux ${frac(a, b)}.`, [
          { q: "Combien de litres contient-il ?", r: V / b * a, unite: "L", calcul: `${V} ÷ ${b} × ${a} = ${V / b * a} L.` },
          { q: "Combien de litres faut-il ajouter pour le remplir ?", r: V - V / b * a, unite: "L", calcul: `${V} − ${V / b * a} = ${V - V / b * a} L (c'est aussi ${frac(b - a, b)} de ${V} L).` }
        ]);
      }
      const b = choisir([4, 5, 8, 10]), a = alea(1, b - 1), Q = b * alea(5, 50);
      return probleme(`Une recette demande ${Q} g de sucre. Tom n'en veut utiliser que les ${frac(a, b)}.`, [
        { q: "Quelle masse de sucre utilise-t-il ?", r: Q / b * a, unite: "g", calcul: `${Q} ÷ ${b} = ${Q / b}, puis ${Q / b} × ${a} = ${Q / b * a} g.` }
      ]);
    }
  },

  {
    groupe: G4,
    id: "problemes-pourcentages",
    titre: "Problèmes de pourcentages",
    description: "Soldes, effectifs, compositions…",
    generer() {
      const modele = alea(0, 3);
      if (modele === 0) {
        const t = choisir([10, 20, 25, 30, 50]), P = choisir([20, 40, 60, 80, 100, 120, 150, 200]);
        const red = P / 100 * t;
        return probleme(`Une veste coûte ${P} €. Elle est soldée à −${t} %.`, [
          { q: "Quel est le montant de la réduction ?", r: red, unite: "€", calcul: `${t} % de ${P} € = ${P} ÷ 100 × ${t} = ${nb(red)} €.` },
          { q: "Quel est le nouveau prix ?", r: P - red, unite: "€", calcul: `${P} − ${nb(red)} = ${nb(P - red)} €.`, piege: x => lireNombre(x) === red ? "Tu as donné la réduction : il faut l'enlever au prix de départ." : "" }
        ]);
      }
      if (modele === 1) {
        const N = choisir([200, 300, 400, 500, 600, 800]), t = choisir([20, 25, 30, 35, 40]);
        return probleme(`Un collège compte ${N} élèves ; ${t} % sont en 6e.`, [
          { q: "Combien y a-t-il d'élèves de 6e ?", r: N / 100 * t, unite: "élèves", calcul: `${t} % de ${N} = ${N} ÷ 100 × ${t} = ${N / 100 * t} élèves.` },
          { q: "Combien d'élèves ne sont pas en 6e ?", r: N - N / 100 * t, unite: "élèves", calcul: `${N} − ${N / 100 * t} = ${N - N / 100 * t} élèves.` }
        ]);
      }
      if (modele === 2) {
        const Q = choisir([100, 200, 300, 400, 500]), t = alea(5, 45);
        const [objet, quoi] = choisir([["Un gâteau de", "sucre"], ["Une barre de céréales de", "sucre"], ["Un sac de terreau de", "sable"]]);
        return probleme(`${objet} ${Q} g contient ${t} % de ${quoi}.`, [
          { q: `Quelle est la masse de ${quoi} ?`, r: Q / 100 * t, unite: "g", calcul: `${t} % de ${Q} g = ${Q} ÷ 100 × ${t} = ${nb(Q / 100 * t)} g.` }
        ]);
      }
      const N = choisir([20, 24, 28, 32, 40]), [t, a, b, mots] = choisir([USUELS[0], USUELS[1], USUELS[2]]);
      return probleme(`Dans une classe de ${N} élèves, ${t} % pratiquent un sport en club.`, [
        { q: "Combien d'élèves pratiquent un sport en club ?", r: N / b * a, unite: "élèves", calcul: `${t} %, c'est ${mots} : ${N} ÷ ${b}${a > 1 ? " × " + a : ""} = ${N / b * a} élèves.` },
        { q: "Quel pourcentage des élèves ne pratique pas de sport en club ?", r: 100 - t, unite: "%", calcul: `100 % − ${t} % = ${100 - t} %.` }
      ]);
    }
  }

];
