/* =====================================================================
   EXERCISEUR « PROPORTIONNALITÉ » — 4e, chapitre 1

   Les activités sont rangées comme les 7 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 14 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Reconnaître la proportionnalité";
const F2 = "Feuille 2 — Quatrième proportionnelle";
const F3 = "Feuille 3 — Vitesses et grandeurs quotients";
const F4 = "Feuille 4 — Pourcentages et coefficient multiplicateur";
const F5 = "Feuille 5 — Ratios, partages et échelles";
const F6 = "Feuille 6 — Une grandeur en fonction d'une autre";
const F7 = "Feuille 7 — Résoudre des problèmes";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => { const y = rr(x); return (y < 0 ? "−" : "") + ecrireNombre(Math.abs(y)); };
const euros = x => { const y = rr(x); return (Number.isInteger(y) ? nb(y) : y.toFixed(2).replace(".", ",")) + " €"; };
const choixVerif = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });
const verifierProche = (s, attendu, ecart) => {
  const x = lireNombre(s);
  if (isNaN(x)) return { etat: "incomplet", message: "Écris un nombre dans la case." };
  return Math.abs(x - attendu) <= ecart + 1e-9 ? { etat: "juste" } : { etat: "faux" };
};

function tableauHTML(l1, l2, t1, t2) {
  const td = v => `<td style="border:1px solid var(--bord);padding:4px 10px;text-align:center">${v}</td>`;
  return `<table style="border-collapse:collapse;margin:8px auto"><tr>${t1 ? td("<strong>" + t1 + "</strong>") : ""}${l1.map(td).join("")}</tr><tr>${t2 ? td("<strong>" + t2 + "</strong>") : ""}${l2.map(td).join("")}</tr></table>`;
}

/* Graphique : points [x, y] et courbes (listes de points), repère [0, X] × [0, Y] */
function graphique(X, Y, { points = [], courbes = [], nx = X, ny = 5, etiquettes = true, titreX = "", titreY = "" } = {}) {
  const L = 260, H = 170, m = 36, s = svg("svg", { viewBox: `0 0 ${L + m + 40} ${H + m + 16}`, width: L + m + 40, height: H + m + 16, role: "img", "aria-label": "Graphique" });
  const P = (x, y) => ({ x: m + x / X * L, y: H + 10 - y / Y * H });
  const txt = (x, y, t, anc) => s.append(svg("text", { x, y, style: `font-size:11px;fill:var(--texte-doux);text-anchor:${anc}` }, t));
  for (let k = 0; k <= nx; k++) {
    s.append(svg("line", { x1: P(k * X / nx, 0).x, y1: P(0, 0).y, x2: P(k * X / nx, 0).x, y2: P(0, Y).y, style: "stroke: var(--bord)" }));
    if (etiquettes) txt(P(k * X / nx, 0).x, P(0, 0).y + 14, nb(k * X / nx), "middle");
  }
  for (let k = 0; k <= ny; k++) {
    s.append(svg("line", { x1: P(0, 0).x, y1: P(0, k * Y / ny).y, x2: P(X, 0).x, y2: P(0, k * Y / ny).y, style: "stroke: var(--bord)" }));
    if (etiquettes && k) txt(P(0, 0).x - 4, P(0, k * Y / ny).y + 4, nb(k * Y / ny), "end");
  }
  s.append(svg("line", { x1: P(0, 0).x, y1: P(0, 0).y, x2: P(X, 0).x + 6, y2: P(0, 0).y, style: "stroke: var(--texte); stroke-width: 2" }));
  s.append(svg("line", { x1: P(0, 0).x, y1: P(0, 0).y, x2: P(0, 0).x, y2: P(0, Y).y - 6, style: "stroke: var(--texte); stroke-width: 2" }));
  if (titreX) txt(P(X, 0).x + 4, P(0, 0).y - 6, titreX, "end");
  if (titreY) txt(P(0, 0).x + 6, P(0, Y).y - 2, titreY, "start");
  courbes.forEach(c => s.append(svg("polyline", { points: c.map(([x, y]) => `${P(x, y).x},${P(x, y).y}`).join(" "), style: "fill:none; stroke: var(--cours); stroke-width: 2.5" })));
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
      const k = choisir([1.5, 2.5, 3, 4, 0.5, 1.2, 0.75, 2.4]), xs = melanger([2, 3, 4, 5, 6, 8, 10, 12]).slice(0, 4).sort((a, b) => a - b);
      const oui = Math.random() < 0.5;
      const ys = xs.map(x => rr(x * k));
      if (!oui) { const i = alea(1, 3); ys[i] = rr(ys[i] + choisir([0.5, -0.5, 1, 2])); }
      return {
        consigne: "Ce tableau est-il un tableau de proportionnalité ?" + tableauHTML(xs.map(nb), ys.map(nb), "x", "y"),
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === oui ? "juste" : "faux" }),
        indice: "Calcule y ÷ x pour chaque colonne : est-ce toujours le même nombre ?",
        correction: oui ? `Oui : on multiplie toujours par ${nb(k)}.` : `Non : ${xs.map((x, i) => nb(ys[i]) + " ÷ " + x + " = " + nb(rr(Math.round(ys[i] / x * 1000) / 1000))).join(" ; ")}.`
      };
    }
  },

  {
    groupe: F1,
    id: "produits-croix",
    titre: "Produits en croix",
    description: "a × d = b × c ?",
    generer() {
      const a = alea(2, 9), k = choisir([1.5, 2, 2.5, 3, 0.4, 1.2]), c = alea(2, 12);
      const b = rr(a * k); let d = rr(c * k);
      const oui = Math.random() < 0.5;
      if (!oui) d = rr(d + choisir([1, -1, 0.5]));
      return {
        consigne: "Les deux colonnes de ce tableau sont-elles proportionnelles ?" + tableauHTML([nb(a), nb(c)], [nb(b), nb(d)]),
        choix: ["Oui", "Non"],
        verifier: (v, ch) => ({ etat: (ch === "Oui") === oui ? "juste" : "faux" }),
        indice: "Compare les produits en croix : (en haut à gauche × en bas à droite) et (en bas à gauche × en haut à droite).",
        correction: `${nb(a)} × ${nb(d)} = ${nb(a * d)} et ${nb(b)} × ${nb(c)} = ${nb(b * c)} : ${oui ? "ils sont égaux, donc oui." : "ils sont différents, donc non."}`
      };
    }
  },

  {
    groupe: F1,
    id: "graphique",
    titre: "Graphique et proportionnalité",
    description: "Des points alignés avec l'origine ?",
    generer() {
      const type = choisir(["prop", "affine", "courbe"]), k = choisir([1, 2, 3]);
      const pts = [1, 2, 3, 4, 5].map(x => [x, type === "prop" ? k * x : type === "affine" ? 2 + k * x : 0.6 * x * x]);
      return {
        consigne: "Ce graphique représente-t-il une situation de proportionnalité ?",
        figure: graphique(6, 20, { points: pts, nx: 6, ny: 4 }),
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === (type === "prop") ? "juste" : "faux" }),
        indice: "Il faut que les points soient alignés ET que la droite passe par l'origine.",
        correction: type === "prop" ? "Oui : les points sont alignés avec l'origine." : type === "affine" ? "Non : les points sont alignés, mais pas avec l'origine." : "Non : les points ne sont pas alignés."
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
        ["Le prix payé et le volume d'essence (au même prix par litre).", true], ["La taille d'un enfant et son âge.", false],
        ["Le périmètre d'un cercle et son diamètre.", true], ["L'aire d'un disque et son rayon.", false],
        ["La distance de réaction et la vitesse d'une voiture.", true], ["La distance de freinage et la vitesse d'une voiture.", false],
        ["La masse d'eau et son volume.", true], ["Le prix d'un abonnement (10 € par mois + 2 € par séance) et le nombre de séances.", false],
        ["La tension et l'intensité aux bornes d'une résistance (loi d'Ohm).", true], ["Le volume d'un cube et la longueur de son arête.", false]
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
    titre: "Calculer x dans un tableau",
    description: "Le produit en croix.",
    generer() {
      const a = alea(2, 9), c = alea(2, 15), k = choisir([1.5, 2, 2.5, 3, 4, 0.5, 1.2, 0.8]);
      const b = rr(a * k), d = rr(c * k);
      const pos = alea(0, 3), vals = [a, c, b, d], rep = vals[pos];
      const aff = vals.map((x, i) => i === pos ? "<em>x</em>" : nb(x));
      const formule = ["b × c ÷ d", "a × d ÷ b", "a × d ÷ c", "b × c ÷ a"][pos]
        .replace("a", nb(a)).replace("b", nb(b)).replace("c", nb(c)).replace("d", nb(d));
      return {
        consigne: "Ce tableau est un tableau de proportionnalité. Calcule <em>x</em>." + tableauHTML([aff[0], aff[1]], [aff[2], aff[3]]),
        ligne: "<em>x</em> = [d]",
        verifier: v => verifierNombre(v[0], rep),
        indice: "Produit en croix : multiplie les deux nombres en diagonale, puis divise par le troisième.",
        correction: `<em>x</em> = ${formule} = ${nb(rep)}`
      };
    }
  },

  {
    groupe: F2,
    id: "probleme-quatrieme",
    titre: "Problèmes de proportionnalité",
    description: "Recettes, prix, consommations…",
    generer() {
      const [q, r, c, u] = choisir([
        (() => { const n = alea(3, 8), p = choisir([6.5, 7, 8.5, 9, 11]), m = alea(9, 15); return [`${n} places de cinéma coûtent ${euros(n * p)}. Combien coûtent ${m} places ?`, m * p, `1 place : ${euros(p)} ; ${m} places : ${euros(m * p)}.`, "€"]; })(),
        (() => { const n = choisir([8]), m = choisir([2, 4, 6, 10, 12]), b = choisir([1.5, 1.7, 2.5]); return [`${n} briques identiques pèsent ${nb(n * b)} kg. Combien pèsent ${m} briques ?`, m * b, `1 brique : ${nb(b)} kg ; ${m} briques : ${nb(m * b)} kg.`, "kg"]; })(),
        (() => { const c = choisir([4.5, 5, 5.5, 6, 6.5]), d = choisir([200, 300, 400]), D = choisir([500, 600, 700, 900]); return [`Une voiture consomme ${nb(c * d / 100)} L pour ${d} km. Combien consomme-t-elle pour ${D} km ?`, c * D / 100, `Pour 100 km : ${nb(c)} L ; pour ${D} km : ${nb(c * D / 100)} L.`, "L"]; })(),
        (() => { const n = 12, f = choisir([150, 180, 240]), m = choisir([4, 18, 30, 6]); return [`Pour ${n} cookies, il faut ${f} g de farine. Combien en faut-il pour ${m} cookies ?`, f * m / n, `${f} × ${m} ÷ ${n} = ${nb(f * m / n)} g.`, "g"]; })(),
        (() => { const t = choisir([2, 3, 4]), p = choisir([36, 45, 54, 60]), m = choisir([5, 6, 10]); return [`Une imprimante imprime ${p * t} pages en ${t} min. Combien de pages en ${m} min ?`, p * m, `En 1 min : ${p} pages ; en ${m} min : ${p * m} pages.`, "pages"]; })()
      ]);
      return { consigne: q, ligne: `[d] ${u}`, verifier: v => verifierNombre(v[0], rr(r)), indice: "Utilise un tableau, le retour à l'unité ou le produit en croix.", correction: c };
    }
  },

  /* ================= Feuille 3 ================= */
  {
    groupe: F3,
    id: "heures-decimales",
    titre: "Heures décimales",
    description: "1 h 45 min = 1,75 h.",
    generer() {
      const h = alea(0, 3), mn = choisir([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54]);
      const sens = Math.random() < 0.6;
      if (sens) return {
        consigne: `Convertis ${h ? h + " h " : ""}${mn} min en heures (écriture décimale).`,
        ligne: "[d] h", verifier: v => verifierNombre(v[0], rr(h + mn / 60)),
        indice: "Pour convertir des minutes en heures, on divise par 60.",
        correction: `${mn} min = ${mn} ÷ 60 h = ${nb(mn / 60)} h, donc ${nb(h + mn / 60)} h.`
      };
      return {
        consigne: `Convertis ${nb(h + mn / 60)} h en heures et minutes.`,
        ligne: "[n] h [n] min",
        verifier: v => { const a = lireEntier(v[0]), b = lireEntier(v[1]); if (isNaN(a) || isNaN(b)) return { etat: "incomplet", message: "Remplis les deux cases." }; return a === h && b === mn ? { etat: "juste" } : { etat: "faux" }; },
        indice: "Multiplie la partie décimale par 60 pour obtenir les minutes.",
        correction: `${nb(mn / 60)} h = ${nb(mn / 60)} × 60 min = ${mn} min : ${h} h ${mn} min.`
      };
    }
  },

  {
    groupe: F3,
    id: "vitesse",
    titre: "Distance, vitesse, durée",
    description: "d = v × t.",
    generer() {
      const v = choisir([40, 50, 60, 72, 80, 90, 100, 120, 130]), t = choisir([0.5, 0.75, 1.5, 2, 2.5, 3, 1.25]);
      const d = rr(v * t), dur = t => { const h = Math.floor(t), m = Math.round((t - h) * 60); return (h ? h + " h " : "") + (m ? m + " min" : ""); };
      const quoi = choisir(["d", "v", "t"]);
      if (quoi === "d") return { consigne: `Une voiture roule à ${v} km/h pendant ${dur(t)}. Quelle distance parcourt-elle ?`, ligne: "[d] km", verifier: x => verifierNombre(x[0], d), indice: "d = v × t, avec t en heures.", correction: `${dur(t)} = ${nb(t)} h ; d = ${v} × ${nb(t)} = ${nb(d)} km.` };
      if (quoi === "v") return { consigne: `Un train parcourt ${nb(d)} km en ${dur(t)}. Quelle est sa vitesse moyenne ?`, ligne: "[d] km/h", verifier: x => verifierNombre(x[0], v), indice: "v = d ÷ t, avec t en heures.", correction: `${dur(t)} = ${nb(t)} h ; v = ${nb(d)} ÷ ${nb(t)} = ${v} km/h.` };
      return { consigne: `Combien de temps faut-il pour parcourir ${nb(d)} km à ${v} km/h ? (réponse en heures décimales)`, ligne: "[d] h", verifier: x => verifierNombre(x[0], t), indice: "t = d ÷ v.", correction: `t = ${nb(d)} ÷ ${v} = ${nb(t)} h, soit ${dur(t)}.` };
    }
  },

  {
    groupe: F3,
    id: "conversion-vitesse",
    titre: "km/h et m/s",
    description: "Diviser ou multiplier par 3,6.",
    generer() {
      const ms = choisir([5, 10, 15, 20, 25, 30, 35, 40, 2.5, 12.5]), kmh = rr(ms * 3.6);
      return Math.random() < 0.5
        ? { consigne: `Convertis ${nb(kmh)} km/h en m/s.`, ligne: `${nb(kmh)} km/h = [d] m/s`, verifier: v => verifierNombre(v[0], ms), indice: "1 h = 3 600 s et 1 km = 1 000 m : on divise par 3,6.", correction: `${nb(kmh)} ÷ 3,6 = ${nb(ms)} m/s.` }
        : { consigne: `Convertis ${nb(ms)} m/s en km/h.`, ligne: `${nb(ms)} m/s = [d] km/h`, verifier: v => verifierNombre(v[0], kmh), indice: "En 1 h = 3 600 s, on parcourt 3 600 fois plus : on multiplie par 3,6.", correction: `${nb(ms)} × 3,6 = ${nb(kmh)} km/h.` };
    }
  },

  {
    groupe: F3,
    id: "grandeur-quotient",
    titre: "Débits et masses volumiques",
    description: "Des grandeurs « par ».",
    generer() {
      const [q, r, u, c] = choisir([
        (() => { const D = choisir([8, 10, 12, 15]), t = alea(5, 20); return [`Un robinet a un débit de ${D} L/min. Combien de temps faut-il pour remplir ${D * t} L ?`, t, "min", `${D * t} ÷ ${D} = ${t} min.`]; })(),
        (() => { const V = choisir([24, 36, 48, 60]), t = choisir([4, 6, 8, 12]); return [`Une pompe vide ${V} m³ en ${t} h. Quel est son débit ?`, V / t, "m³/h", `${V} ÷ ${t} = ${nb(V / t)} m³/h.`]; })(),
        (() => { const rho = choisir([2.7, 7.9, 8.9, 11.3]), V = choisir([10, 20, 50]); return [`Un métal a une masse volumique de ${nb(rho)} g/cm³. Quelle est la masse de ${V} cm³ de ce métal ?`, rho * V, "g", `${nb(rho)} × ${V} = ${nb(rho * V)} g.`]; })(),
        (() => { const c = choisir([5, 6, 7.5, 8]), d = choisir([200, 300, 450]); return [`Une voiture consomme ${nb(c)} L aux 100 km. Combien consomme-t-elle pour ${d} km ?`, c * d / 100, "L", `${nb(c)} × ${d / 100} = ${nb(c * d / 100)} L.`]; })()
      ]);
      return { consigne: q, ligne: `[d] ${u}`, verifier: v => verifierNombre(v[0], rr(r)), indice: "Regarde l'unité : « par » signifie « divisé par ».", correction: c };
    }
  },

  /* ================= Feuille 4 ================= */
  {
    groupe: F4,
    id: "appliquer",
    titre: "Prendre un pourcentage",
    description: "t % de Q = Q × t ÷ 100.",
    generer() {
      const t = choisir([1, 5, 10, 15, 20, 25, 30, 50, 75, 8, 12, 40, 2.5]), q = choisir([alea(2, 30) * 10, alea(10, 90) * 5, alea(2, 9) * 100]);
      return { consigne: `Calcule ${nb(t)} % de ${nb(q)}.`, ligne: `${nb(t)} % de ${nb(q)} = [d]`, verifier: v => verifierNombre(v[0], rr(q * t / 100)), indice: `Multiplie ${nb(q)} par ${nb(t)} ÷ 100 = ${nb(t / 100)}.`, correction: `${nb(q)} × ${nb(t / 100)} = ${nb(q * t / 100)}` };
    }
  },

  {
    groupe: F4,
    id: "calculer-pourcentage",
    titre: "Calculer un pourcentage",
    description: "Partie ÷ total.",
    generer() {
      const [tot, part] = choisir([[25, alea(1, 24)], [20, alea(1, 19)], [50, alea(1, 49)], [200, alea(1, 39) * 5], [40, alea(1, 39)], [80, alea(1, 15) * 4]]);
      const p = rr(part / tot * 100);
      return { consigne: `Dans un collège, ${part} élèves sur ${tot} font du sport en club. Quel pourcentage cela représente-t-il ?`, ligne: "[d] %", verifier: v => verifierNombre(v[0], p), indice: "Calcule partie ÷ total, puis multiplie par 100.", correction: `${part} ÷ ${tot} = ${nb(p / 100)}, soit ${nb(p)} %.` };
    }
  },

  {
    groupe: F4,
    id: "coefficient",
    titre: "Coefficient multiplicateur",
    description: "+t % → × (1 + t/100).",
    generer() {
      const t = choisir([2, 3, 5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75]), aug = Math.random() < 0.5;
      const k = rr(aug ? 1 + t / 100 : 1 - t / 100), sens = Math.random() < 0.6;
      if (sens) return { consigne: `Par quel nombre multiplie-t-on une quantité pour l'${aug ? "augmenter" : "diminuer"} de ${t} % ?`, ligne: "× [d]", verifier: v => verifierNombre(v[0], k), indice: aug ? "Augmenter de t %, c'est multiplier par 1 + t ÷ 100." : "Diminuer de t %, c'est multiplier par 1 − t ÷ 100.", correction: `${aug ? "1 + " : "1 − "}${nb(t / 100)} = ${nb(k)}.` };
      return { consigne: `Multiplier par ${nb(k)}, c'est augmenter ou diminuer de combien de pour cent ?`, choix: [`augmenter de ${t} %`, `diminuer de ${t} %`, `augmenter de ${nb(k * 100)} %`, `diminuer de ${nb(100 - t)} %`].filter((x, i, a) => a.indexOf(x) === i),
        verifier: choixVerif(`${aug ? "augmenter" : "diminuer"} de ${t} %`), indice: "Compare le coefficient à 1 : plus grand, c'est une hausse ; plus petit, une baisse.", correction: `${nb(k)} = 1 ${aug ? "+" : "−"} ${nb(t / 100)} : on ${aug ? "augmente" : "diminue"} de ${t} %.` };
    }
  },

  {
    groupe: F4,
    id: "nouveau-prix",
    titre: "Soldes et augmentations",
    description: "Calculer le nouveau prix.",
    generer() {
      const t = choisir([5, 10, 15, 20, 25, 30, 40, 50]), p = choisir([alea(2, 30) * 10, alea(4, 40) * 5]), aug = Math.random() < 0.4;
      const k = rr(aug ? 1 + t / 100 : 1 - t / 100), r = rr(p * k);
      return { consigne: aug ? `Un abonnement à ${euros(p)} augmente de ${t} %. Quel est son nouveau prix ?` : `Un article à ${euros(p)} est soldé à −${t} %. Quel est son nouveau prix ?`, ligne: "[d] €", verifier: v => verifierNombre(v[0], r), indice: `Multiplie le prix par le coefficient ${nb(k)}.`, correction: `${nb(p)} × ${nb(k)} = ${euros(r)}.` };
    }
  },

  {
    groupe: F4,
    id: "prix-initial",
    titre: "Retrouver le prix de départ",
    description: "On divise par le coefficient.",
    generer() {
      const t = choisir([10, 20, 25, 50, 5]), aug = Math.random() < 0.5, k = rr(aug ? 1 + t / 100 : 1 - t / 100);
      const p0 = choisir([20, 40, 60, 80, 100, 120, 200, 240, 300, 400]), p1 = rr(p0 * k);
      return { consigne: aug ? `Après une hausse de ${t} %, un prix est de ${euros(p1)}. Quel était le prix avant la hausse ?` : `Après une remise de ${t} %, un article coûte ${euros(p1)}. Quel était son prix avant la remise ?`, ligne: "[d] €", verifier: v => verifierNombre(v[0], p0), indice: `Le prix de départ a été multiplié par ${nb(k)} : on divise donc par ${nb(k)}.`, correction: `${nb(p1)} ÷ ${nb(k)} = ${euros(p0)}.` };
    }
  },

  {
    groupe: F4,
    id: "evolution",
    titre: "Pourcentage d'évolution",
    description: "De combien a-t-on augmenté ?",
    generer() {
      const p0 = choisir([20, 40, 50, 80, 120, 200, 250, 400]), t = choisir([5, 10, 15, 20, 25, 30, 40]), aug = Math.random() < 0.5;
      const p1 = rr(p0 * (aug ? 1 + t / 100 : 1 - t / 100));
      return { consigne: `Un prix passe de ${euros(p0)} à ${euros(p1)}. Quel est le pourcentage ${aug ? "d'augmentation" : "de baisse"} ?`, ligne: "[d] %", verifier: v => verifierNombre(v[0], t), indice: "Calcule le coefficient : nouveau prix ÷ ancien prix.", correction: `${nb(p1)} ÷ ${nb(p0)} = ${nb(p1 / p0)} : c'est ${aug ? "une hausse" : "une baisse"} de ${t} %.` };
    }
  },

  {
    groupe: F4,
    id: "successives",
    titre: "Évolutions successives",
    description: "On multiplie les coefficients.",
    generer() {
      const a = choisir([10, 20, 50]), b = choisir([10, 20, 50]), p = choisir([100, 200, 400]);
      const r = rr(p * (1 + a / 100) * (1 - b / 100));
      return { consigne: `Un prix de ${euros(p)} augmente de ${a} %, puis baisse de ${b} %. Quel est le prix final ?`, ligne: "[d] €", verifier: v => verifierNombre(v[0], r), indice: "Les pourcentages ne s'additionnent pas : multiplie par chacun des coefficients.", correction: `${nb(p)} × ${nb(1 + a / 100)} × ${nb(1 - b / 100)} = ${euros(r)}.` };
    }
  },

  /* ================= Feuille 5 ================= */
  {
    groupe: F5,
    id: "ratio-simplifier",
    titre: "Simplifier un ratio",
    description: "Comme une fraction.",
    generer() {
      const a = alea(1, 7), b = alea(1, 9), k = alea(2, 9);
      const g = (x, y) => y ? g(y, x % y) : x, d = g(a, b), a1 = a / d, b1 = b / d;
      return { consigne: `Écris le ratio ${a * k} : ${b * k} sous la forme la plus simple.`, ligne: "[n] : [n]", verifier: v => { const x = lireEntier(v[0]), y = lireEntier(v[1]); if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux cases." }; return x === a1 && y === b1 ? { etat: "juste" } : x * b1 === y * a1 ? { etat: "faux", message: "C'est égal, mais on peut encore simplifier." } : { etat: "faux" }; }, indice: "Divise les deux nombres par leur plus grand diviseur commun.", correction: `${a * k} : ${b * k} = ${a1} : ${b1} (on divise par ${k * d}).` };
    }
  },

  {
    groupe: F5,
    id: "ratio",
    titre: "Partager selon un ratio",
    description: "a : b → a + b parts.",
    generer() {
      const a = alea(1, 5), b = alea(1, 7), part = alea(2, 25), tot = (a + b) * part;
      const [contexte, u] = choisir([["bonbons entre Léa et Tom", ""], ["€ entre deux associés", "€"], ["kg de mortier (ciment : sable)", "kg"], ["L de boisson (sirop : eau)", "L"]]);
      return {
        consigne: `On partage ${tot} ${contexte} selon le ratio ${a} : ${b}. Quelles sont les deux parts ?`,
        ligne: `[d] ${u} et [d] ${u}`,
        verifier: v => { const x = lireNombre(v[0]), y = lireNombre(v[1]); if (isNaN(x) || isNaN(y)) return { etat: "incomplet", message: "Remplis les deux cases." }; return x === a * part && y === b * part ? { etat: "juste" } : { etat: "faux", message: x === b * part && y === a * part ? "Tu as inversé les deux parts." : "" }; },
        indice: `Partage ${tot} en ${a} + ${b} = ${a + b} parts égales.`,
        correction: `1 part = ${tot} ÷ ${a + b} = ${part} ; ${a} × ${part} = ${a * part} et ${b} × ${part} = ${b * part}.`
      };
    }
  },

  {
    groupe: F5,
    id: "echelle",
    titre: "Échelles",
    description: "Plan et réalité.",
    generer() {
      const e = choisir([100, 200, 500, 1000, 25000, 50000, 100000]), l = choisir([2, 3, 4, 5, 6, 7.5, 8, 12]);
      const reel = l * e; // en cm
      const [val, unite] = reel >= 100000 ? [reel / 100000, "km"] : [reel / 100, "m"];
      return Math.random() < 0.6
        ? { consigne: `Sur un plan à l'échelle 1/${nb(e)}, une longueur mesure ${nb(l)} cm. Quelle est la longueur réelle ?`, ligne: `[d] ${unite}`, verifier: v => verifierNombre(v[0], rr(val)), indice: `1 cm sur le plan représente ${nb(e)} cm en réalité. Attention à l'unité demandée.`, correction: `${nb(l)} × ${nb(e)} = ${nb(reel)} cm = ${nb(val)} ${unite}.` }
        : { consigne: `Sur un plan à l'échelle 1/${nb(e)}, quelle longueur représente ${nb(val)} ${unite} dans la réalité ?`, ligne: "[d] cm", verifier: v => verifierNombre(v[0], l), indice: `Convertis d'abord en cm, puis divise par ${nb(e)}.`, correction: `${nb(val)} ${unite} = ${nb(reel)} cm ; ${nb(reel)} ÷ ${nb(e)} = ${nb(l)} cm.` };
    }
  },

  /* ================= Feuille 6 ================= */
  {
    groupe: F6,
    id: "lire-graphique",
    titre: "Lire un graphique",
    description: "Image et antécédent par lecture.",
    generer() {
      const k = choisir([5, 10]), b = choisir([0, 0, 10]), X = 8, Y = k * X + b, pas = k === 5 ? 5 : 10;
      const Ym = Math.ceil(Y / pas) * pas, x = alea(1, 7);
      const fig = graphique(X, Ym, { courbes: [[[0, b], [X, Y]]], nx: 8, ny: Ym / pas, titreX: "durée (h)", titreY: "prix (€)" });
      return Math.random() < 0.5
        ? { consigne: `Le graphique donne le prix d'une location en fonction de la durée. Quel est le prix pour ${x} h ?`, figure: fig, ligne: "[d] €", verifier: v => verifierNombre(v[0], k * x + b), indice: `Pars de ${x} sur l'axe horizontal, monte jusqu'à la droite, puis lis sur l'axe vertical.`, correction: `Pour ${x} h, on lit ${k * x + b} €.` }
        : { consigne: `Le graphique donne le prix d'une location en fonction de la durée. Pour quelle durée paie-t-on ${k * x + b} € ?`, figure: fig, ligne: "[d] h", verifier: v => verifierNombre(v[0], x), indice: `Pars de ${k * x + b} sur l'axe vertical, va jusqu'à la droite, puis descends sur l'axe horizontal.`, correction: `On paie ${k * x + b} € pour ${x} h.` };
    }
  },

  {
    groupe: F6,
    id: "formule",
    titre: "Utiliser une formule",
    description: "Programme de calcul, tarifs…",
    generer() {
      const a = alea(2, 6), b = alea(1, 12), x = choisir([alea(2, 12), -alea(1, 5), alea(1, 9) / 2]);
      const [txt, f] = choisir([
        [`Choisir un nombre ; le multiplier par ${a} ; ajouter ${b} au résultat.`, t => a * t + b],
        [`Choisir un nombre ; lui ajouter ${b} ; multiplier le résultat par ${a}.`, t => a * (t + b)],
        [`Choisir un nombre ; le multiplier par lui-même ; soustraire ${b}.`, t => t * t - b]
      ]);
      return { consigne: `Programme de calcul : <em>${txt}</em> Quel résultat obtient-on avec ${nb(x)} ?`, ligne: "[r]", verifier: v => verifierNombre(v[0], rr(f(x))), indice: "Applique les étapes dans l'ordre.", correction: `On obtient ${nb(f(x))}.` };
    }
  },

  {
    groupe: F6,
    id: "remonter",
    titre: "Retrouver le nombre de départ",
    description: "Remonter un programme.",
    generer() {
      const a = alea(2, 7), b = alea(1, 15), x = alea(1, 15), r = a * x + b;
      return { consigne: `<em>Choisir un nombre ; le multiplier par ${a} ; ajouter ${b}.</em> On obtient ${r}. Quel nombre a-t-on choisi ?`, ligne: "[d]", verifier: v => verifierNombre(v[0], x), indice: `Remonte le programme : soustrais ${b}, puis divise par ${a}.`, correction: `(${r} − ${b}) ÷ ${a} = ${x}.` };
    }
  },

  /* ================= Feuille 7 ================= */
  {
    groupe: F7,
    id: "meilleur-prix",
    titre: "Le meilleur prix",
    description: "Comparer des prix au kilo.",
    generer() {
      const m1 = choisir([250, 500, 750]), m2 = choisir([1000, 1500, 2000]), p = choisir([3, 4, 5, 6, 8]);
      const p1 = rr(m1 / 1000 * p), p2 = rr(m2 / 1000 * (p + choisir([-0.4, -0.2, 0.2, 0.4])));
      const bonne = p1 / m1 < p2 / m2 ? `le paquet de ${m1} g` : `le paquet de ${nb(m2 / 1000)} kg`;
      return { consigne: `Un paquet de ${m1} g coûte ${euros(p1)} ; un paquet de ${nb(m2 / 1000)} kg coûte ${euros(p2)}. Lequel est le plus avantageux ?`, choix: [`le paquet de ${m1} g`, `le paquet de ${nb(m2 / 1000)} kg`], verifier: choixVerif(bonne), indice: "Calcule le prix d'un kilogramme pour chaque paquet.", correction: `Prix au kg : ${euros(p1 / m1 * 1000)} et ${euros(p2 / m2 * 1000)} : c'est ${bonne}.` };
    }
  },

  {
    groupe: F7,
    id: "probleme",
    titre: "Problèmes variés",
    description: "Choisir la bonne méthode.",
    generer() {
      const [q, r, u, c] = choisir([
        (() => { const e = choisir([20000, 25000, 50000]), l = choisir([6, 8, 12]), v = 4; const d = l * e / 100000; return [`Sur une carte au 1/${nb(e)}, un refuge est à ${l} cm. En marchant à ${v} km/h, combien de minutes faut-il ?`, d / v * 60, "min", `Distance : ${nb(d)} km ; durée : ${nb(d)} ÷ ${v} = ${nb(d / v)} h = ${nb(d / v * 60)} min.`]; })(),
        (() => { const a = choisir([2, 3]), b = choisir([3, 5, 7]), part = choisir([150, 200, 250]); return [`Deux associés ont investi dans le ratio ${a} : ${b}. Le bénéfice est de ${(a + b) * part} €. Combien reçoit celui qui a le plus investi ?`, b * part, "€", `${a + b} parts de ${part} € ; ${b} × ${part} = ${b * part} €.`]; })(),
        (() => { const p = choisir([80, 120, 150]), a = 40, b = 10; const r = rr(p * 0.6 * 0.9); return [`Un manteau à ${p} € est soldé à −${a} %, puis on enlève encore ${b} % sur le prix soldé. Prix payé ?`, r, "€", `${p} × 0,6 × 0,9 = ${nb(r)} €.`]; })(),
        (() => { const L = 80, l = 40, h = 30, D = 8; const V = L * l * h / 1000; return [`Un aquarium de ${L} cm × ${l} cm × ${h} cm est rempli avec un tuyau de débit ${D} L/min. Combien de minutes faut-il ?`, V / D, "min", `Volume : ${L * l * h} cm³ = ${nb(V)} L ; ${nb(V)} ÷ ${D} = ${nb(V / D)} min.`]; })()
      ]);
      return { consigne: q, ligne: `[d] ${u}`, verifier: v => verifierNombre(v[0], rr(r)), indice: "Repère les grandeurs et leurs unités, puis avance étape par étape.", correction: c };
    }
  }
];

/* ---------- Le test « Je me teste » : 14 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "14 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Reconnaître un tableau de proportionnalité", activites: ["tableau", "produits-croix"] },
    { competence: "Reconnaître la proportionnalité sur un graphique", activites: ["graphique"] },
    { competence: "Calculer une quatrième proportionnelle", activites: ["quatrieme"] },
    { competence: "Résoudre un problème de proportionnalité", activites: ["probleme-quatrieme"] },
    { competence: "Convertir une durée en heures décimales", activites: ["heures-decimales"] },
    { competence: "Utiliser d = v × t", activites: ["vitesse"] },
    { competence: "Convertir une vitesse", activites: ["conversion-vitesse"] },
    { competence: "Appliquer un pourcentage", activites: ["appliquer", "calculer-pourcentage"] },
    { competence: "Utiliser le coefficient multiplicateur", activites: ["coefficient", "nouveau-prix"] },
    { competence: "Retrouver une valeur de départ", activites: ["prix-initial"] },
    { competence: "Partager selon un ratio", activites: ["ratio"] },
    { competence: "Utiliser une échelle", activites: ["echelle"] },
    { competence: "Lire un graphique", activites: ["lire-graphique"] },
    { competence: "Résoudre un problème", activites: ["probleme", "meilleur-prix"] }
  ]
};
