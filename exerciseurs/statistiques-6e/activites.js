/* =====================================================================
   EXERCISEUR « STATISTIQUES » — 6e, chapitre 14

   Les activités sont rangées comme les 5 feuilles d'exercices du chapitre.
   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Recueillir et organiser des données";
const F2 = "Feuille 2 — Tableaux à double entrée";
const F3 = "Feuille 3 — Construire et filtrer un tableau";
const F4 = "Feuille 4 — Diagrammes en barres";
const F5 = "Feuille 5 — Diagrammes circulaires et études de cas";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const dir = phi => ({ x: Math.cos(phi * DEG), y: -Math.sin(phi * DEG) });
const pt = (O, phi, r) => V.plus(O, V.fois(dir(phi), r));

/* Un tableau HTML : entetes (1re ligne), lignes [[titre, …valeurs]] ; une valeur null devient une case à remplir */
function tableau(entetes, lignes, { cases = [] } = {}) {
  const t = el("table", { class: "tab-effectifs" });
  t.append(el("tr", {}, ...entetes.map(h => el("th", {}, h))));
  for (const l of lignes) t.append(el("tr", {}, el("th", {}, l[0]), ...l.slice(1).map(v => {
    if (v !== null) return el("td", {}, typeof v === "number" ? nb(v) : v);
    const i = el("input", { class: "case", inputmode: "decimal", autocomplete: "off", "aria-label": "Case à compléter" });
    cases.push(i);
    return el("td", {}, i);
  })));
  return t;
}

/* ---------- Diagramme en barres ---------- */
function diagrammeBarres(noms, valeurs, { pas = 2, titreY = "Effectif", hauteurs = null } = {}) {
  const max = Math.max(...valeurs), haut = Math.ceil((max + 1) / pas) * pas;
  const x0 = 50, y0 = 230, H = 200, larg = Math.min(70, 380 / noms.length), L = x0 + noms.length * larg + 20;
  const Y = v => y0 - v / haut * H;
  const s = svg("svg", { viewBox: `0 0 ${L} 280`, width: L, height: 280, class: "barres-stat", role: "img", "aria-label": "Diagramme en barres" });
  for (let v = 0; v <= haut; v += pas) {
    s.append(svg("line", { x1: x0, y1: Y(v), x2: L - 10, y2: Y(v), class: "barres-grille" }));
    s.append(svg("text", { x: x0 - 8, y: Y(v) + 5, class: "barres-axe-txt", "text-anchor": "end" }, String(v)));
  }
  s.append(svg("line", { x1: x0, y1: y0, x2: x0, y2: y0 - H - 10, class: "barres-axe" }), svg("line", { x1: x0, y1: y0, x2: L - 10, y2: y0, class: "barres-axe" }));
  s.append(svg("text", { x: 8, y: 14, class: "barres-axe-txt", "text-anchor": "start" }, titreY));
  noms.forEach((n, i) => {
    const v = (hauteurs || valeurs)[i], x = x0 + i * larg + larg * 0.18;
    s.append(svg("rect", { x, y: Y(v), width: larg * 0.64, height: y0 - Y(v), class: "barre" }));
    s.append(svg("text", { x: x + larg * 0.32, y: y0 + 20, class: "barres-axe-txt", "text-anchor": "middle" }, n));
  });
  return s;
}

/* ---------- Diagramme circulaire (comme au chapitre 5) ---------- */
const COULEURS = ["#3f7fd0", "#e8821e", "#2e8b57", "#b83280", "#d4a017"];
function diagrammeCirculaire(parts, taille = 240) {
  const s = svg("svg", { viewBox: `0 0 ${taille} ${taille}`, width: taille, height: taille, class: "diagramme", role: "img", "aria-label": "Diagramme circulaire" });
  const C = { x: taille / 2, y: taille / 2 }, r = taille / 2 - 14;
  let debut = 90;
  parts.forEach((p, i) => {
    const fin = debut - p.angle, P1 = pt(C, debut, r), P2 = pt(C, fin, r);
    s.append(svg("path", { d: `M${C.x},${C.y} L${P1.x},${P1.y} A${r},${r} 0 ${p.angle > 180 ? 1 : 0} 1 ${P2.x},${P2.y} Z`, fill: COULEURS[i % 5], class: "secteur" }));
    const M = pt(C, (debut + fin) / 2, r * 0.6);
    s.append(svg("text", { x: M.x, y: M.y + 5, class: "secteur-texte" }, p.nom));
    debut = fin;
  });
  return s;
}

/* ---------- Des données ---------- */
const ENQUETES = [
  ["On demande aux élèves de la 6e A leur sport préféré.", "les élèves de la 6e A", "le sport préféré"],
  ["On relève la taille des joueurs d'une équipe de basket.", "les joueurs de l'équipe", "la taille"],
  ["On note la couleur des voitures garées sur le parking du collège.", "les voitures du parking", "la couleur"],
  ["On demande aux habitants d'un immeuble leur nombre d'enfants.", "les habitants de l'immeuble", "le nombre d'enfants"],
  ["On relève la température chaque jour du mois de mars.", "les jours du mois de mars", "la température"],
  ["On demande aux clients d'un magasin leur moyen de transport.", "les clients du magasin", "le moyen de transport"]
];
const CATEGORIES = [
  ["Transport", ["Bus", "Vélo", "Voiture", "À pied", "Train"]],
  ["Sport", ["Foot", "Basket", "Natation", "Judo", "Danse"]],
  ["Animal", ["Chien", "Chat", "Lapin", "Poisson", "Oiseau"]],
  ["Fruit", ["Pomme", "Banane", "Fraise", "Orange", "Kiwi"]]
];

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "population-caractere",
    titre: "Population et caractère",
    description: "Sur qui porte l'enquête ? Qu'étudie-t-on ?",
    generer() {
      const [t, pop, car] = choisir(ENQUETES);
      const demande = Math.random() < 0.5 ? "population" : "caractère";
      const bon = demande === "population" ? pop : car;
      const autres = melanger(ENQUETES.filter(e => e[0] !== t)).slice(0, 2).map(e => demande === "population" ? e[1] : e[2]);
      return {
        consigne: `${t} Quel est ${demande === "population" ? "la population étudiée" : "le caractère étudié"} ?`,
        choix: melanger([bon, demande === "population" ? car : pop, ...autres]),
        verifier: (v, c) => ({ etat: c === bon ? "juste" : "faux" }),
        indice: "La population, ce sont les individus sur qui porte l'enquête ; le caractère, c'est ce qu'on étudie chez eux.",
        correction: `Population : ${pop} ; caractère : ${car}.`
      };
    }
  },

  {
    groupe: F1,
    id: "compter-effectifs",
    titre: "Compter les effectifs",
    description: "À partir d'une liste de réponses.",
    generer() {
      const n = alea(15, 28), valeurs = [0, 1, 2, 3, 4];
      const poids = [3, 5, 4, 2, 1];
      const rep = [...Array(n)].map(() => { let r = Math.random() * 15; for (let k = 0; k < 5; k++) { r -= poids[k]; if (r < 0) return k; } return 4; });
      const v = choisir(valeurs.filter(k => rep.includes(k)));
      const eff = rep.filter(x => x === v).length;
      const cas = choisir(["effectif", "effectif", "au-moins"]);
      const aum = alea(2, 3), effAum = rep.filter(x => x >= aum).length;
      return {
        consigne: `On a demandé à ${n} élèves : « Combien as-tu de frères et sœurs ? » Voici les réponses :<br><span class="liste-donnees">${rep.join(" ; ")}</span><br>${cas === "effectif" ? `Quel est l'effectif de la valeur ${v} ?` : `Combien d'élèves ont au moins ${aum} frères et sœurs ?`}`,
        ligne: "[n] élèves",
        verifier: x => verifierNombre(x[0], cas === "effectif" ? eff : effAum),
        indice: "Barre les réponses au fur et à mesure que tu les comptes.",
        correction: cas === "effectif" ? `${eff} élèves ont répondu ${v}.` : `${valeurs.filter(k => k >= aum).map(k => `${rep.filter(x => x === k).length} (pour ${k})`).join(" + ")} = ${effAum} élèves.`
      };
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "lire-double-entree",
    titre: "Lire un tableau à double entrée",
    description: "À l'intersection d'une ligne et d'une colonne.",
    generer() {
      const [cat, noms] = choisir(CATEGORIES);
      const cols = noms.slice(0, 3), lignes = ["6e", "5e"];
      const val = lignes.map(() => cols.map(() => alea(3, 25)));
      const totL = val.map(l => l.reduce((a, b) => a + b, 0)), totC = cols.map((_, j) => val[0][j] + val[1][j]), tot = totL[0] + totL[1];
      const t = tableau(["", ...cols, "Total"], [...lignes.map((l, i) => [l, ...val[i], totL[i]]), ["Total", ...totC, tot]]);
      const q = choisir([
        [`Combien d'élèves de ${lignes[0]} ont choisi « ${cols[1]} » ?`, val[0][1]],
        [`Combien d'élèves de ${lignes[1]} ont choisi « ${cols[0]} » ?`, val[1][0]],
        [`Combien d'élèves ont choisi « ${cols[2]} » en tout ?`, totC[2]],
        [`Combien y a-t-il d'élèves de ${lignes[1]} en tout ?`, totL[1]],
        [`Combien d'élèves ont été interrogés ?`, tot],
        [`Combien d'élèves de ${lignes[0]} n'ont pas choisi « ${cols[0]} » ?`, totL[0] - val[0][0]]
      ]);
      return {
        consigne: `On a demandé aux élèves de 6e et de 5e leur réponse (${cat.toLowerCase()}). ${q[0]}`,
        figure: t,
        ligne: "[n] élèves",
        verifier: v => verifierNombre(v[0], q[1]),
        indice: "Repère la bonne ligne et la bonne colonne. La dernière ligne et la dernière colonne donnent les totaux.",
        correction: `La réponse est ${q[1]}.`
      };
    }
  },

  {
    groupe: F2,
    id: "completer-double-entree",
    titre: "Compléter un tableau à double entrée",
    description: "Avec les totaux, on retrouve les cases manquantes.",
    generer() {
      const cols = ["Filles", "Garçons"], lignes = ["Foot", "Tennis", "Judo"];
      const val = lignes.map(() => cols.map(() => alea(5, 30)));
      const totL = val.map(l => l[0] + l[1]), totC = [0, 1].map(j => val.reduce((s, l) => s + l[j], 0)), tot = totC[0] + totC[1];
      const grille = [...lignes.map((l, i) => [l, ...val[i], totL[i]]), ["Total", ...totC, tot]];
      // on cache 3 cases, une par ligne différente, toujours retrouvables
      const caches = melanger([[0, 1], [1, 2], [2, 1], [3, 2], [0, 3], [1, 1]]).slice(0, 3).filter((c, i, t) => t.findIndex(d => d[0] === c[0]) === i);
      const attendus = [];
      const lignesAff = grille.map((l, i) => l.map((v, j) => { const c = caches.find(([a, b]) => a === i && b === j); if (c) { attendus.push(v); return null; } return v; }));
      const cases = [];
      const t = tableau(["Sport", ...cols, "Total"], lignesAff, { cases });
      return {
        consigne: "Voici les licenciés d'un club sportif. Complète le tableau.",
        figure: t,
        verifier() {
          const x = cases.map(c => lireNombre(c.value));
          if (x.some(isNaN)) return { etat: "incomplet", message: "Complète toutes les cases." };
          const faux = cases.filter((c, i) => x[i] !== attendus[i]);
          cases.forEach(c => c.classList.toggle("mauvaise", faux.includes(c)));
          return faux.length ? { etat: "faux", message: "Utilise les totaux : Filles + Garçons = Total, et la somme d'une colonne donne la ligne Total." } : { etat: "juste" };
        },
        indice: "Sur chaque ligne : Filles + Garçons = Total. Dans chaque colonne, la somme des sports donne le total.",
        correction: "Le tableau complet : " + grille.map(l => `${l[0]} : ${l.slice(1).join(" ; ")}`).join(" — ") + ".",
        surCorrection() { cases.forEach((c, i) => { c.value = attendus[i]; c.classList.remove("mauvaise"); }); },
        bloquer: () => cases.forEach(c => { c.disabled = true; })
      };
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: F3,
    id: "filtrer-tableau",
    titre: "Filtrer un tableau",
    description: "Ne garder que les lignes qui vérifient une condition.",
    generer() {
      const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
      const pluie = jours.map(() => choisir([0, alea(1, 20), alea(1, 20)]));
      const seuil = choisir([5, 8, 10]);
      const sens = choisir(["plus", "moins"]);
      const ok = pluie.map(p => sens === "plus" ? p > seuil : p < seuil);
      if (!ok.some(Boolean) || ok.every(Boolean)) return this.generer();
      const t = tableau(["Jour", "Pluie (mm)"], jours.map((j, i) => [j, pluie[i]]));
      const choisis = new Set(); let actif = true;
      const boutons = jours.map((j, i) => { const b = el("button", { type: "button", class: "btn etiquette-choix", "aria-pressed": "false" }, j); b.addEventListener("click", () => { if (!actif) return; choisis.has(i) ? choisis.delete(i) : choisis.add(i); b.setAttribute("aria-pressed", String(choisis.has(i))); }); return b; });
      return {
        consigne: `Voici la hauteur de pluie tombée chaque jour d'une semaine. Sélectionne les jours où il est tombé <strong>${sens} de ${seuil} mm</strong>.`,
        figure: [t, el("div", { class: "etiquettes" }, ...boutons)],
        verifier() {
          if (!choisis.size) return { etat: "incomplet", message: "Sélectionne au moins un jour." };
          return jours.every((j, i) => ok[i] === choisis.has(i)) ? { etat: "juste" } : { etat: "faux", message: `Compare chaque valeur à ${seuil} : « ${sens} de ${seuil} » ${sens === "plus" ? "exclut" : "exclut aussi"} ${seuil} lui-même.` };
        },
        indice: `Passe en revue chaque jour et compare à ${seuil} mm.`,
        correction: `Jours retenus : ${jours.filter((j, i) => ok[i]).join(", ")}.`,
        surCorrection() { boutons.forEach((b, i) => b.classList.toggle("bonne", ok[i])); },
        bloquer: () => { actif = false; }
      };
    }
  },

  {
    groupe: F3,
    id: "lire-tableau-donnees",
    titre: "Lire un tableau de mesures",
    description: "Chercher une valeur, calculer un écart.",
    generer() {
      const jours = [0, 3, 7, 10, 14];
      let h = 2; const tailles = jours.map((j, i) => i ? (h = rr(h + alea(8, 30) / 10)) : 2);
      const t = tableau(["Jour", ...jours.map(String)], [["Taille (cm)", ...tailles]]);
      const q = choisir([
        [`Quelle taille mesure la plante au jour ${jours[2]} ?`, tailles[2], "cm"],
        [`De combien la plante a-t-elle grandi entre le jour ${jours[1]} et le jour ${jours[3]} ?`, rr(tailles[3] - tailles[1]), "cm"],
        [`De combien la plante a-t-elle grandi en tout ?`, rr(tailles[4] - tailles[0]), "cm"],
        [`Quel jour la plante mesurait-elle ${nb(tailles[3])} cm ?`, jours[3], ""]
      ]);
      return {
        consigne: `Inès mesure une plante. ${q[0]}`,
        figure: t,
        ligne: `[d] ${q[2]}`,
        verifier: v => verifierNombre(v[0], q[1]),
        indice: "Repère la bonne colonne dans le tableau ; pour une évolution, fais une soustraction.",
        correction: `La réponse est ${nb(q[1])} ${q[2]}.`
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "lire-barres",
    titre: "Lire un diagramme en barres",
    description: "La hauteur d'une barre est l'effectif.",
    generer() {
      const [cat, noms] = choisir(CATEGORIES);
      const k = alea(4, 5), pas = choisir([1, 2, 5]);
      const vals = noms.slice(0, k).map(() => pas * alea(1, 8));
      const s = diagrammeBarres(noms.slice(0, k), vals, { pas, titreY: "Effectif" });
      const i = alea(0, k - 1), max = Math.max(...vals);
      const q = choisir([
        [`Combien d'élèves ont répondu « ${noms[i]} » ?`, vals[i], "[n] élèves"],
        ["Combien d'élèves ont été interrogés en tout ?", vals.reduce((a, b) => a + b, 0), "[n] élèves"],
        vals.filter(v => v === max).length === 1 ? ["Quelle réponse est la plus fréquente ? Donne son effectif.", max, "[n] élèves"] : [`Combien d'élèves ont répondu « ${noms[i]} » ?`, vals[i], "[n] élèves"]
      ]);
      return {
        consigne: `Le diagramme donne les réponses des élèves d'une classe (${cat.toLowerCase()}). ${q[0]}`,
        figure: s,
        ligne: q[2],
        verifier: v => verifierNombre(v[0], q[1]),
        indice: `Regarde la graduation de l'axe vertical : elle va de ${pas} en ${pas}.`,
        correction: `${noms.slice(0, k).map((n, j) => `${n} : ${vals[j]}`).join(" ; ")}. La réponse est ${q[1]}.`
      };
    }
  },

  {
    groupe: F4,
    id: "bon-diagramme",
    titre: "Le bon diagramme",
    description: "Quel diagramme correspond au tableau ?",
    generer() {
      const [, noms] = choisir(CATEGORIES);
      const vals = noms.slice(0, 4).map(() => alea(1, 9));
      if (new Set(vals).size < 3) return this.generer();
      const faux1 = [...vals]; const i = alea(0, 3); faux1[i] = faux1[i] + choisir([-1, 1, 2]) || 3;
      const faux2 = melanger([...vals]); if (faux2.every((v, j) => v === vals[j])) faux2.reverse();
      const options = melanger([[vals, true], [faux1, false], [faux2, false]]);
      const t = tableau(["Réponse", ...noms.slice(0, 4)], [["Effectif", ...vals]]);
      return {
        consigne: "Quel diagramme en barres représente ce tableau ?",
        figure: t,
        choix: options.map(([v]) => diagrammeBarres(noms.slice(0, 4), v, { pas: 1 })),
        verifier: (v, c) => ({ etat: options[c][1] ? "juste" : "faux", message: "Compare la hauteur de chaque barre à l'effectif du tableau." }),
        indice: "Vérifie chaque barre, une par une.",
        correction: "Le bon diagramme a des barres de hauteurs " + vals.join(", ") + "."
      };
    }
  },

  {
    groupe: F4,
    id: "diagramme-correct",
    titre: "Ce diagramme est-il correct ?",
    description: "Les hauteurs doivent être proportionnelles aux effectifs.",
    generer() {
      const base = alea(2, 6), vals = [base, 2 * base, 3 * base];
      const correct = Math.random() < 0.5;
      const hauteurs = correct ? vals : [base, 2 * base, 4 * base];
      return {
        consigne: `Noé a représenté les effectifs ${vals.join(", ")} par ce diagramme en barres. Son diagramme est-il correct ?`,
        figure: diagrammeBarres(["A", "B", "C"], hauteurs, { pas: base, titreY: "" }),
        choix: ["Oui", "Non"],
        verifier: (v, c) => ({ etat: (c === "Oui") === correct ? "juste" : "faux" }),
        indice: `L'effectif de C est 3 fois celui de A : sa barre doit être 3 fois plus haute.`,
        correction: correct ? "Oui : les hauteurs sont proportionnelles aux effectifs." : `Non : la barre C est 4 fois plus haute que la barre A, alors que ${vals[2]} = 3 × ${vals[0]}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */

  {
    groupe: F5,
    id: "angle-secteur",
    titre: "Calculer l'angle d'un secteur",
    description: "Angle = effectif × (360° ÷ total).",
    generer() {
      const total = choisir([36, 40, 60, 72, 90, 120, 180]);
      const parAngle = 360 / total;
      let eff; do { eff = alea(1, total - 1); } while (!Number.isInteger(eff * parAngle));
      const [t, u] = choisir([[`Sur ${total} élèves, ${eff} vont en vacances à la mer.`, "élèves"], [`Dans un collège, ${eff} élèves sur ${total} ont choisi l'espagnol.`, "élèves"], [`Une famille a trié ${total} kg de déchets, dont ${eff} kg de verre.`, "kg"]]);
      return {
        consigne: `${t} Quel est l'angle du secteur correspondant dans un diagramme circulaire ?`,
        ligne: "[n] °",
        verifier: v => verifierNombre(v[0], eff * parAngle),
        indice: `Le disque entier (360°) représente les ${total} ${u}. Une unité représente donc 360 ÷ ${total} = ${nb(parAngle)}°.`,
        correction: `360 ÷ ${total} = ${nb(parAngle)}° pour 1 ; ${eff} × ${nb(parAngle)} = ${eff * parAngle}°.`
      };
    }
  },

  {
    groupe: F5,
    id: "lire-circulaire",
    titre: "Lire un diagramme circulaire",
    description: "Retrouver un effectif à partir d'un angle.",
    generer() {
      const total = choisir([40, 60, 120, 36, 72]);
      const angles = choisir([[180, 90, 90], [180, 90, 60, 30], [120, 120, 90, 30], [90, 90, 90, 90], [180, 120, 60], [150, 90, 60, 60]]);
      if (angles.some(a => !Number.isInteger(a * total / 360))) return this.generer();
      const noms = ["Anglais", "Espagnol", "Allemand", "Italien"].slice(0, angles.length);
      const i = alea(0, angles.length - 1);
      return {
        consigne: `${total} élèves ont choisi une langue vivante. Dans le diagramme, le secteur « ${noms[i]} » mesure ${angles[i]}°. Combien d'élèves ont choisi l'${noms[i].toLowerCase()} ?`,
        figure: diagrammeCirculaire(angles.map((a, j) => ({ angle: a, nom: noms[j].slice(0, 3) + "." }))),
        ligne: "[n] élèves",
        verifier: v => verifierNombre(v[0], angles[i] * total / 360),
        indice: `${angles[i]}°, c'est quelle fraction de 360° ? (180° : la moitié ; 90° : le quart…)`,
        correction: `${angles[i]}° sur 360°, c'est ${angles[i]} ÷ 360 du total : ${total} × ${angles[i]} ÷ 360 = ${angles[i] * total / 360} élèves.`
      };
    }
  },

  {
    groupe: F5,
    id: "quel-type-diagramme",
    titre: "Barres ou circulaire ?",
    description: "Choisir le diagramme adapté.",
    generer() {
      const [t, r, e] = choisir([
        ["Montrer la part de chaque langue choisie parmi tous les élèves.", "circulaire", "on veut voir des parts d'un tout"],
        ["Comparer le nombre de jours de pluie chaque mois de l'année.", "en barres", "on compare des effectifs, et il y a beaucoup de valeurs"],
        ["Montrer comment se répartit le budget d'une famille.", "circulaire", "on veut voir des parts d'un tout"],
        ["Comparer les notes obtenues (de 0 à 20) dans une classe.", "en barres", "on compare des effectifs pour beaucoup de valeurs"],
        ["Montrer la part de chaque type de déchet dans la poubelle.", "circulaire", "on veut voir des parts d'un tout"],
        ["Comparer le nombre de livres lus par chaque élève.", "en barres", "on compare des effectifs"]
      ]);
      return {
        consigne: `Quel diagramme choisir ? <strong>${t}</strong>`,
        choix: ["en barres", "circulaire"],
        verifier: (v, c) => ({ etat: c === r ? "juste" : "faux" }),
        indice: "Le diagramme circulaire montre la part de chaque catégorie dans un tout ; le diagramme en barres compare des effectifs.",
        correction: `Un diagramme ${r} : ${e}.`
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
    { competence: "Population et caractère", activites: ["population-caractere"] },
    { competence: "Compter des effectifs", activites: ["compter-effectifs"] },
    { competence: "Lire un tableau à double entrée", activites: ["lire-double-entree"] },
    { competence: "Compléter un tableau", activites: ["completer-double-entree"] },
    { competence: "Lire et filtrer un tableau", activites: ["filtrer-tableau", "lire-tableau-donnees"] },
    { competence: "Lire un diagramme en barres", activites: ["lire-barres"] },
    { competence: "Construire un diagramme en barres", activites: ["bon-diagramme", "diagramme-correct"] },
    { competence: "Calculer l'angle d'un secteur", activites: ["angle-secteur"] },
    { competence: "Lire un diagramme circulaire", activites: ["lire-circulaire"] },
    { competence: "Choisir un diagramme", activites: ["quel-type-diagramme"] }
  ]
};
