/* =====================================================================
   EXERCISEUR « FRACTIONS ET DIVISIBILITÉ » — 5e, chapitre 3

   Les activités sont rangées comme les 7 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 14 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Multiples, diviseurs et critères";
const F2 = "Feuille 2 — Nombres premiers et décomposition";
const F3 = "Feuille 3 — Diviser par un nombre décimal";
const F4 = "Feuille 4 — Fractions égales et simplification";
const F5 = "Feuille 5 — Comparer des fractions";
const F6 = "Feuille 6 — Additionner et soustraire";
const F7 = "Feuille 7 — Résoudre des problèmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const F = (a, b) => frac(a, b);
const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
const egal = (x, y) => Math.abs(x - y) < 1e-9;
const ppcm = (a, b) => a * b / pgcd(a, b);
const PREMIERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const estPremier = n => n > 1 && [...Array(Math.floor(Math.sqrt(n)) - 1).keys()].map(k => k + 2).every(d => n % d);
const diviseurs = n => [...Array(n).keys()].map(k => k + 1).filter(d => n % d === 0);
const decomposer = n => { const f = []; let d = 2; while (n > 1) { if (n % d === 0) { f.push(d); n /= d; } else d++; } return f; };
const simp = (a, b) => { const g = pgcd(a, b); return [a / g, b / g]; };
const FS = (a, b) => { const [x, y] = simp(a, b); return y === 1 ? String(x) : F(x, y); };

function selection(liste) {
  const choisies = new Set();
  let actif = true;
  const boutons = liste.map((t, i) => {
    const b = el("button", { type: "button", class: "btn etiquette-choix", "aria-pressed": "false" });
    b.innerHTML = t;
    b.addEventListener("click", () => { if (!actif) return; choisies.has(i) ? choisies.delete(i) : choisies.add(i); b.setAttribute("aria-pressed", String(choisies.has(i))); });
    return b;
  });
  return { noeud: el("div", { class: "etiquettes" }, ...boutons), choisies, boutons, bloquer: () => { actif = false; } };
}
function champTexte(placeholder) {
  return el("input", { class: "case", type: "text", autocomplete: "off", spellcheck: "false", style: "width:min(14em,90vw);text-align:left", placeholder, "aria-label": "Ta réponse" });
}
/* Fraction irréductible attendue */
function verifierIrreductible(v, a, b) {
  const r = verifierFraction(v, a, b);
  if (r.etat !== "juste") return r;
  const n = lireEntier(v.num), d = lireEntier(v.den);
  return pgcd(n, d) === 1 ? { etat: "juste" } : { etat: "faux", message: "Ta fraction est juste mais elle n'est pas irréductible : simplifie encore." };
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */
  {
    groupe: F1,
    id: "multiple-ou-pas",
    titre: "Multiple ou pas ?",
    description: "Utiliser les tables et la division.",
    generer() {
      const b = alea(3, 15), k = alea(3, 15), oui = Math.random() < 0.5;
      const a = oui ? b * k : b * k + alea(1, b - 1);
      const [q, r] = [Math.floor(a / b), a % b];
      const forme = choisir([`${a} est-il un multiple de ${b} ?`, `${b} est-il un diviseur de ${a} ?`, `${a} est-il divisible par ${b} ?`]);
      return {
        consigne: forme,
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === oui ? "juste" : "faux" }),
        indice: `Effectue la division euclidienne de ${a} par ${b} : le reste est-il nul ?`,
        correction: oui ? `Oui : ${a} = ${b} × ${q}.` : `Non : ${a} = ${b} × ${q} + ${r}, le reste n'est pas nul.`
      };
    }
  },

  {
    groupe: F1,
    id: "tous-les-diviseurs",
    titre: "Tous les diviseurs",
    description: "Sélectionner tous les diviseurs d'un nombre.",
    generer() {
      const n = choisir([12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48]);
      const proposes = [...Array(Math.min(n, 24)).keys()].map(k => k + 1);
      if (!proposes.includes(n)) proposes.push(n);
      const sel = selection(proposes.map(String));
      const bons = proposes.map(x => n % x === 0);
      return {
        consigne: `Sélectionne tous les diviseurs de ${n}.`,
        figure: sel.noeud,
        verifier() {
          if (!sel.choisies.size) return { etat: "incomplet", message: "Sélectionne au moins un nombre." };
          const manque = bons.filter((b, i) => b && !sel.choisies.has(i)).length, trop = [...sel.choisies].filter(i => !bons[i]).length;
          return !manque && !trop ? { etat: "juste" } : { etat: "faux", message: trop ? "Un nombre choisi n'est pas un diviseur." : "Il manque des diviseurs." };
        },
        indice: `Cherche les produits égaux à ${n} : 1 × ${n}, 2 × …, 3 × …`,
        correction: `Diviseurs de ${n} : ${diviseurs(n).join(" ; ")}.`,
        surCorrection() { sel.boutons.forEach((b, i) => b.classList.toggle("bonne", bons[i])); },
        bloquer: sel.bloquer
      };
    }
  },

  {
    groupe: F1,
    id: "criteres",
    titre: "Critères de divisibilité",
    description: "Divisible par 2, 3, 5, 9, 10 ?",
    generer() {
      const n = alea(100, 9999);
      const div = [2, 3, 5, 9, 10];
      const sel = selection(div.map(d => "par " + d));
      const bons = div.map(d => n % d === 0);
      const somme = String(n).split("").reduce((s, c) => s + +c, 0);
      return {
        consigne: `Le nombre <strong>${nb(n)}</strong> est divisible… (sélectionne toutes les bonnes réponses, ou aucune)`,
        figure: sel.noeud,
        verifier() {
          const ok = bons.every((b, i) => b === sel.choisies.has(i));
          return ok ? { etat: "juste" } : { etat: "faux" };
        },
        indice: "2, 5, 10 : regarde le chiffre des unités. 3 et 9 : calcule la somme des chiffres.",
        correction: `Chiffre des unités : ${n % 10} ; somme des chiffres : ${somme}. ${nb(n)} est divisible ${bons.some(Boolean) ? div.filter((d, i) => bons[i]).map(d => "par " + d).join(", ") : "par aucun de ces nombres"}.`,
        surCorrection() { sel.boutons.forEach((b, i) => b.classList.toggle("bonne", bons[i])); },
        bloquer: sel.bloquer
      };
    }
  },

  {
    groupe: F1,
    id: "chiffre-manquant",
    titre: "Le chiffre manquant",
    description: "Compléter pour être divisible par 3 ou 9.",
    generer() {
      const d = choisir([3, 9]);
      let a, b, sols;
      do { a = alea(1, 9); b = alea(0, 9); sols = [...Array(10).keys()].filter(c => (a + c + b) % d === 0); } while (!sols.length);
      return {
        consigne: `Quel chiffre peut-on écrire à la place de … pour que ${a}…${b} soit divisible par ${d} ? (donne une réponse)`,
        ligne: `${a}[n]${b}`,
        verifier: v => { const c = lireEntier(v[0]); if (isNaN(c) || c < 0 || c > 9) return { etat: "incomplet", message: "Écris un chiffre de 0 à 9." }; return sols.includes(c) ? { etat: "juste", message: sols.length > 1 ? `Les réponses possibles étaient : ${sols.join(", ")}.` : "" } : { etat: "faux" }; },
        indice: `La somme des chiffres ${a} + … + ${b} doit être un multiple de ${d}.`,
        correction: `Réponses possibles : ${sols.join(", ")} (la somme des chiffres est alors un multiple de ${d}).`
      };
    }
  },

  /* ================= Feuille 2 ================= */
  {
    groupe: F2,
    id: "premier-ou-pas",
    titre: "Premier ou pas ?",
    description: "Reconnaître un nombre premier.",
    generer() {
      const n = Math.random() < 0.5 ? choisir(PREMIERS) : choisir([1, 4, 9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 57, 63, 91]);
      const p = estPremier(n), d = decomposer(n);
      return {
        consigne: `Le nombre <strong>${n}</strong> est-il premier ?`,
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === p ? "juste" : "faux" }),
        indice: "Un nombre premier a exactement deux diviseurs : 1 et lui-même. Teste les divisions par 2, 3, 5, 7…",
        correction: p ? `Oui : ${n} n'a que deux diviseurs, 1 et ${n}.` : n === 1 ? "Non : 1 n'a qu'un seul diviseur." : `Non : ${n} = ${d[0]} × ${n / d[0]}.`
      };
    }
  },

  {
    groupe: F2,
    id: "decomposer",
    titre: "Décomposer en facteurs premiers",
    description: "Écrire un nombre comme produit de nombres premiers.",
    generer() {
      let n;
      do { n = alea(12, 200); } while (estPremier(n) || decomposer(n).some(p => p > 29) || decomposer(n).length < 3);
      const f = decomposer(n);
      const champ = champTexte("ex. : 2 × 3 × 5");
      return {
        consigne: `Décompose <strong>${n}</strong> en produit de facteurs premiers (sépare les facteurs par ×, x ou *).`,
        figure: champ,
        verifier() {
          const t = champ.value.trim();
          if (!t) return { etat: "incomplet", message: "Écris la décomposition dans la case." };
          const g = (t.match(/\d+/g) || []).map(Number);
          if (!g.length) return { etat: "incomplet", message: "Écris des nombres séparés par ×." };
          const prod = g.reduce((a, b) => a * b, 1);
          if (prod !== n) return { etat: "faux", message: `Ton produit vaut ${prod}, pas ${n}.` };
          if (g.some(x => !estPremier(x))) return { etat: "faux", message: "Le produit est juste, mais certains facteurs ne sont pas premiers : décompose-les encore." };
          return { etat: "juste" };
        },
        indice: "Divise par 2 tant que c'est possible, puis par 3, puis par 5, 7…",
        correction: `${n} = ${f.join(" × ")}`,
        bloquer: () => { champ.disabled = true; }
      };
    }
  },

  {
    groupe: F2,
    id: "recomposer",
    titre: "Quel est ce nombre ?",
    description: "Retrouver un nombre à partir de sa décomposition.",
    generer() {
      const f = Array.from({ length: alea(2, 4) }, () => choisir([2, 2, 3, 3, 5, 7, 11])).sort((a, b) => a - b);
      const n = f.reduce((a, b) => a * b, 1);
      return {
        consigne: `Quel nombre a pour décomposition en facteurs premiers <strong>${f.join(" × ")}</strong> ?`,
        ligne: "[n]",
        verifier: v => verifierNombre(v[0], n),
        indice: "Effectue le produit.",
        correction: `${f.join(" × ")} = ${n}`
      };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "diviser-decimal",
    titre: "Diviser par un décimal",
    description: "Se ramener à un diviseur entier.",
    generer() {
      const p = choisir([1, 2]), d = alea(2, 9), q = alea(2, 15) * choisir([1, 1, 10]);
      const diviseur = d / 10 ** p, dividende = rr(diviseur * q);
      const k = 10 ** p;
      return {
        consigne: `Calcule : <strong>${nb(dividende)} ÷ ${nb(diviseur)}</strong>`,
        ligne: `${nb(dividende)} ÷ ${nb(diviseur)} = [d]`,
        verifier: v => verifierNombre(v[0], q),
        indice: `Multiplie le dividende et le diviseur par ${k} pour que le diviseur soit entier.`,
        correction: `${nb(dividende)} ÷ ${nb(diviseur)} = ${nb(dividende * k)} ÷ ${nb(diviseur * k)} = ${nb(q)}`
      };
    }
  },

  {
    groupe: F3,
    id: "division-probleme",
    titre: "Problèmes de division",
    description: "Combien de fois… ?",
    generer() {
      const [t, a, b, u, q] = choisir([
        (() => { const m = choisir([0.25, 0.5, 0.2, 0.75]), n = alea(6, 24); return [`Un ruban de ${nb(m * n)} m est coupé en morceaux de ${nb(m)} m. Combien de morceaux obtient-on ?`, m * n, m, "morceaux", n]; })(),
        (() => { const m = choisir([1.5, 0.75, 0.25, 0.2]), n = alea(4, 20); return [`Avec ${nb(m * n)} L de jus, combien de bouteilles de ${nb(m)} L peut-on remplir ?`, m * n, m, "bouteilles", n]; })(),
        (() => { const p = alea(12, 45) / 10, kg = choisir([1.5, 2.5, 0.5, 1.2]); return [`${nb(kg)} kg de fruits coûtent ${nb(rr(p * kg))} €. Quel est le prix d'un kilogramme ?`, p * kg, kg, "€", p]; })()
      ]);
      return {
        consigne: t,
        ligne: `[d] ${u}`,
        verifier: v => verifierNombre(v[0], rr(q)),
        indice: "C'est une division. Rends le diviseur entier en multipliant les deux nombres par 10 ou 100.",
        correction: `${nb(a)} ÷ ${nb(b)} = ${nb(q)} ${u}`
      };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "fraction-egale",
    titre: "Compléter une égalité de fractions",
    description: "Multiplier ou diviser en haut et en bas.",
    generer() {
      let a = alea(1, 9), b = alea(2, 9);
      [a, b] = simp(a, b);
      if (b === 1) return this.generer();
      const k = alea(2, 7), haut = Math.random() < 0.5, monter = Math.random() < 0.6;
      const [x, y, X, Y] = monter ? [a, b, a * k, b * k] : [a * k, b * k, a, b];
      const ligne = haut ? `${F(x, y)} = [f/${Y}]` : `${F(x, y)} = [f${X}/]`;
      return {
        consigne: "Complète l'égalité.",
        ligne,
        verifier: v => verifierFraction(v[0], X, Y),
        indice: monter ? "Par quel nombre a-t-on multiplié ? Fais la même chose en haut et en bas." : "Par quel nombre a-t-on divisé ? Fais la même chose en haut et en bas.",
        correction: `${F(x, y)} = ${F(monter ? `${x} × ${k}` : `${x} ÷ ${k}`, monter ? `${y} × ${k}` : `${y} ÷ ${k}`)} = ${F(X, Y)}`
      };
    }
  },

  {
    groupe: F4,
    id: "simplifier",
    titre: "Simplifier une fraction",
    description: "Jusqu'à la fraction irréductible.",
    generer() {
      let a = alea(1, 12), b = alea(2, 15);
      [a, b] = simp(a, b);
      if (b === 1) return this.generer();
      const k = choisir([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]);
      return {
        consigne: `Simplifie ${F(a * k, b * k)} pour obtenir une fraction irréductible.`,
        ligne: `${F(a * k, b * k)} = [f]`,
        verifier: v => verifierIrreductible(v[0], a, b),
        indice: "Cherche un diviseur commun au numérateur et au dénominateur (critères de divisibilité, tables…).",
        correction: `${F(a * k, b * k)} = ${F(`${a * k} ÷ ${k}`, `${b * k} ÷ ${k}`)} = ${F(a, b)}`
      };
    }
  },

  {
    groupe: F4,
    id: "entier-plus-fraction",
    titre: "Entier + fraction",
    description: "17/5 = 3 + 2/5",
    generer() {
      const d = alea(2, 9), e = alea(1, 8), r = alea(1, d - 1), n = e * d + r;
      return {
        consigne: `Écris ${F(n, d)} comme la somme d'un entier et d'une fraction inférieure à 1.`,
        ligne: `${F(n, d)} = [n] + [f/${d}]`,
        verifier: v => {
          const x = lireEntier(v[0]), y = lireEntier(v[1].num);
          if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux cases." };
          return x === e && y === r ? { etat: "juste" } : { etat: "faux" };
        },
        indice: `Effectue la division euclidienne de ${n} par ${d}.`,
        correction: `${n} = ${d} × ${e} + ${r}, donc ${F(n, d)} = ${e} + ${F(r, d)}.`
      };
    }
  },

  {
    groupe: F4,
    id: "ecritures",
    titre: "Fraction, décimal, pourcentage",
    description: "Un même nombre, plusieurs écritures.",
    generer() {
      const [a, b] = choisir([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [3, 20], [6, 5], [5, 4], [3, 2], [1, 20], [9, 10]]);
      const dec = rr(a / b), pc = rr(100 * a / b);
      const [q, r, l] = choisir([[`Écris ${F(a, b)} sous forme décimale.`, dec, "[d]"], [`Écris ${F(a, b)} sous forme de pourcentage.`, pc, "[d] %"], [`Écris ${nb(dec)} sous forme de pourcentage.`, pc, "[d] %"]]);
      return {
        consigne: q,
        ligne: l,
        verifier: v => verifierNombre(v[0], r),
        indice: `${F(a, b)} = ${F(a * 100 / b, 100)} si tu cherches un dénominateur 100.`,
        correction: `${F(a, b)} = ${nb(dec)} = ${nb(pc)} %`
      };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "comparer",
    titre: "Comparer deux fractions",
    description: "<, > ou = ?",
    generer() {
      const type = choisir(["meme", "multiple", "quelconque", "quelconque"]);
      let a, b, c, d;
      if (type === "meme") { b = d = alea(3, 12); a = alea(1, 15); c = alea(1, 15); }
      else if (type === "multiple") { b = alea(2, 6); d = b * alea(2, 4); a = alea(1, 2 * b); c = alea(1, 2 * d); if (Math.random() < 0.15) c = a * d / b; }
      else { [b, d] = choisir([[3, 4], [4, 5], [5, 6], [3, 5], [6, 8], [4, 6], [3, 8], [5, 7], [6, 9], [9, 12]]); a = alea(1, b + 2); c = alea(1, d + 2); }
      const cmp = Math.sign(a * d - c * b), signe = cmp < 0 ? "<" : cmp > 0 ? ">" : "=";
      const m = ppcm(b, d);
      return {
        consigne: "Compare les deux fractions.",
        ligne: `${F(a, b)} [c] ${F(c, d)}`,
        choix: ["<", "=", ">"],
        verifier: (v, ch) => ({ etat: ch === signe ? "juste" : "faux" }),
        indice: "Écris les deux fractions avec le même dénominateur, puis compare les numérateurs.",
        correction: b === d ? `Même dénominateur : on compare ${a} et ${c}, donc ${F(a, b)} ${signe} ${F(c, d)}.` : `${F(a, b)} = ${F(a * m / b, m)} et ${F(c, d)} = ${F(c * m / d, m)}, donc ${F(a, b)} ${signe} ${F(c, d)}.`
      };
    }
  },

  {
    groupe: F5,
    id: "plus-grande",
    titre: "La plus grande fraction",
    description: "Choisir parmi trois fractions.",
    generer() {
      const d = choisir([12, 24, 18, 20, 30]);
      const dens = diviseurs(d).filter(x => x > 1);
      const fr = [];
      while (fr.length < 3) {
        const den = choisir(dens), num = alea(1, den);
        const v = num / den;
        if (!fr.some(f => egal(f[0] / f[1], v))) fr.push([num, den]);
      }
      const max = fr.reduce((m, f) => f[0] / f[1] > m[0] / m[1] ? f : m);
      return {
        consigne: "Quelle est la plus grande de ces fractions ?",
        choix: fr.map(f => F(...f)),
        verifier: (v, c) => ({ etat: c === F(...max) ? "juste" : "faux" }),
        indice: `Écris-les toutes avec le dénominateur ${d}.`,
        correction: fr.map(f => `${F(...f)} = ${F(f[0] * d / f[1], d)}`).join(" ; ") + ` : la plus grande est ${F(...max)}.`
      };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "additionner",
    titre: "Additionner des fractions",
    description: "Même dénominateur, ou pas.",
    generer() {
      const type = choisir(["meme", "multiple", "quelconque"]);
      let b, d;
      if (type === "meme") b = d = alea(3, 12);
      else if (type === "multiple") { b = alea(2, 6); d = b * alea(2, 3); }
      else [b, d] = choisir([[3, 4], [2, 3], [4, 5], [5, 6], [3, 5], [4, 6], [6, 8], [2, 5]]);
      const a = alea(1, b), c = alea(1, d), m = ppcm(b, d);
      const n = a * m / b + c * m / d;
      return {
        consigne: `Calcule ${F(a, b)} + ${F(c, d)}.`,
        ligne: `${F(a, b)} + ${F(c, d)} = [f]`,
        verifier: v => verifierFraction(v[0], n, m),
        indice: b === d ? "Même dénominateur : on additionne les numérateurs." : "Écris d'abord les deux fractions avec le même dénominateur.",
        correction: (b === d ? "" : `${F(a, b)} + ${F(c, d)} = ${F(a * m / b, m)} + ${F(c * m / d, m)} `) + `= ${F(n, m)}` + (pgcd(n, m) > 1 ? ` = ${FS(n, m)}` : "")
      };
    }
  },

  {
    groupe: F6,
    id: "soustraire",
    titre: "Soustraire des fractions",
    description: "Avec ou sans nombre entier.",
    generer() {
      const type = choisir(["frac", "frac", "entier"]);
      if (type === "entier") {
        const e = alea(1, 3), d = alea(2, 9), c = alea(1, d - 1);
        return {
          consigne: `Calcule ${e} − ${F(c, d)}.`,
          ligne: `${e} − ${F(c, d)} = [f]`,
          verifier: v => verifierFraction(v[0], e * d - c, d),
          indice: `Écris ${e} sous la forme d'une fraction de dénominateur ${d}.`,
          correction: `${e} − ${F(c, d)} = ${F(e * d, d)} − ${F(c, d)} = ${F(e * d - c, d)}`
        };
      }
      let b, d, a, c, m;
      do {
        [b, d] = choisir([[3, 4], [2, 3], [4, 5], [5, 6], [3, 6], [4, 8], [2, 8], [6, 9], [3, 5], [4, 12]]);
        if (Math.random() < 0.5) [b, d] = [d, b];
        a = alea(1, b + 3); c = alea(1, d); m = ppcm(b, d);
      } while (a * m / b - c * m / d <= 0);
      const n = a * m / b - c * m / d;
      return {
        consigne: `Calcule ${F(a, b)} − ${F(c, d)}.`,
        ligne: `${F(a, b)} − ${F(c, d)} = [f]`,
        verifier: v => verifierFraction(v[0], n, m),
        indice: "Écris d'abord les deux fractions avec le même dénominateur.",
        correction: `${F(a, b)} − ${F(c, d)} = ${F(a * m / b, m)} − ${F(c * m / d, m)} = ${F(n, m)}` + (pgcd(n, m) > 1 ? ` = ${FS(n, m)}` : "")
      };
    }
  },

  {
    groupe: F6,
    id: "erreur-classique",
    titre: "Trouver l'erreur",
    description: "Le piège des dénominateurs.",
    generer() {
      const [b, d] = choisir([[3, 5], [2, 3], [4, 3], [2, 7], [5, 4]]), a = alea(1, b), c = alea(1, d), m = ppcm(b, d);
      const faux = Math.random() < 0.5;
      const prop = faux ? F(a + c, b + d) : F(a * m / b + c * m / d, m);
      return {
        consigne: `Est-il vrai que ${F(a, b)} + ${F(c, d)} = ${prop} ?`,
        choix: ["Vrai", "Faux"],
        verifier: (v, ch) => ({ etat: (ch === "Vrai") === !faux ? "juste" : "faux" }),
        indice: "On n'additionne jamais les dénominateurs !",
        correction: `${F(a, b)} + ${F(c, d)} = ${F(a * m / b, m)} + ${F(c * m / d, m)} = ${F(a * m / b + c * m / d, m)}` + (faux ? " : c'est faux (on a additionné les dénominateurs)." : " : c'est vrai.")
      };
    }
  },

  /* ================= Feuille 7 ================= */
  {
    groupe: F7,
    id: "part-restante",
    titre: "La part restante",
    description: "1 − … puis la quantité.",
    generer() {
      const [b, d] = choisir([[3, 4], [4, 6], [5, 4], [3, 6], [2, 5], [3, 8], [4, 5], [6, 4]]);
      const a = 1, c = alea(1, Math.max(1, d - 2)), m = ppcm(b, d);
      const pris = a * m / b + c * m / d;
      if (pris >= m) return this.generer();
      const reste = m - pris, total = m * alea(2, 12);
      const [enonce, quoi] = choisir([
        [`Inès lit un roman de ${total} pages : lundi, elle en lit ${F(a, b)} ; mardi, elle en lit ${F(c, d)}.`, "pages"],
        [`Paul a ${total} € : il dépense ${F(a, b)} de cette somme en livres et ${F(c, d)} en sorties.`, "€"],
        [`Un jardin mesure ${total} m² : ${F(a, b)} de la surface sont des légumes et ${F(c, d)} des fleurs ; le reste est une pelouse.`, "m²"]
      ]);
      return {
        consigne: enonce,
        classeLigne: "etapes",
        ligne: `<div class="etape-pb"><p>1. Quelle fraction du total reste-t-il ?</p><p class="rep">[f]</p></div><div class="etape-pb"><p>2. Combien cela fait-il de ${quoi} ?</p><p class="rep">[n] ${quoi}</p></div>`,
        verifier: v => {
          const r1 = verifierFraction(v[0], reste, m), r2 = verifierNombre(v[1], total / m * reste);
          if (r1.etat === "incomplet" || r2.etat === "incomplet") return { etat: "incomplet", message: "Réponds aux deux questions." };
          return r1.etat === "juste" && r2.etat === "juste" ? { etat: "juste" } : { etat: "faux", message: r1.etat !== "juste" ? "Revois la question 1." : "Revois la question 2." };
        },
        indice: `Additionne ${F(a, b)} et ${F(c, d)}, puis calcule 1 − ce résultat.`,
        correction: `${F(a, b)} + ${F(c, d)} = ${F(pris, m)}, il reste ${F(m, m)} − ${F(pris, m)} = ${F(reste, m)}.<br>${F(reste, m)} de ${total} : ${total} ÷ ${m} × ${reste} = ${total / m * reste} ${quoi}.`
      };
    }
  },

  {
    groupe: F7,
    id: "multiple-commun",
    titre: "Ensemble de nouveau",
    description: "Phares, engrenages : un multiple commun.",
    generer() {
      const [a, b] = choisir([[4, 6], [6, 8], [8, 12], [6, 10], [9, 12], [10, 15], [12, 18], [6, 9], [5, 7], [8, 10]]);
      const [t, u] = choisir([[`Un phare s'allume toutes les ${a} secondes, un autre toutes les ${b} secondes. Ils viennent de s'allumer ensemble. Dans combien de secondes s'allumeront-ils de nouveau ensemble ?`, "s"],
        [`Deux bus partent du même arrêt : l'un toutes les ${a} minutes, l'autre toutes les ${b} minutes. Ils partent ensemble à 8 h. Dans combien de minutes repartiront-ils ensemble ?`, "min"]]);
      const m = ppcm(a, b);
      return {
        consigne: t,
        ligne: `[n] ${u}`,
        verifier: v => verifierNombre(v[0], m),
        indice: `Écris les multiples de ${b} et cherche le premier qui est aussi un multiple de ${a}.`,
        correction: `Multiples de ${b} : ${[1, 2, 3, 4, 5].map(k => k * b).filter(x => x <= m).join(", ")}… ${m} est le plus petit multiple commun de ${a} et ${b}.`
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
    { competence: "Multiples et diviseurs", activites: ["multiple-ou-pas", "tous-les-diviseurs"] },
    { competence: "Critères de divisibilité", activites: ["criteres", "chiffre-manquant"] },
    { competence: "Nombres premiers", activites: ["premier-ou-pas"] },
    { competence: "Décomposer en facteurs premiers", activites: ["decomposer", "recomposer"] },
    { competence: "Diviser par un nombre décimal", activites: ["diviser-decimal"] },
    { competence: "Problème de division", activites: ["division-probleme"] },
    { competence: "Fractions égales", activites: ["fraction-egale"] },
    { competence: "Simplifier une fraction", activites: ["simplifier"] },
    { competence: "Fraction, décimal, pourcentage", activites: ["ecritures", "entier-plus-fraction"] },
    { competence: "Comparer des fractions", activites: ["comparer", "plus-grande"] },
    { competence: "Additionner des fractions", activites: ["additionner"] },
    { competence: "Soustraire des fractions", activites: ["soustraire", "erreur-classique"] },
    { competence: "Problème avec des fractions", activites: ["part-restante"] },
    { competence: "Multiple commun", activites: ["multiple-commun"] }
  ]
};
