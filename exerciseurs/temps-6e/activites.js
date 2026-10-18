/* =====================================================================
   EXERCISEUR « REPÉRAGE DANS LE TEMPS » — 6e, chapitre 12

   Les activités sont rangées comme les 5 feuilles d'exercices du chapitre.
   On distingue l'horaire (14 h 05) et la durée (2 h 15 min).
   PARCOURS (en bas du fichier) : le test « Je me teste » en 10 questions.
   ===================================================================== */

const F1 = "Feuille 1 — Lire l'heure, unités de durée";
const F2 = "Feuille 2 — Convertir des durées";
const F3 = "Feuille 3 — Écriture décimale d'une durée";
const F4 = "Feuille 4 — Calculer avec des horaires et des durées";
const F5 = "Feuille 5 — Problèmes de durées";

const rr = x => Math.round(x * 1e6) / 1e6;
const nb = x => ecrireNombre(rr(x));
const deux = m => String(m).padStart(2, "0");
/* Un horaire (en minutes depuis minuit) : « 14 h 05 » ; une durée (en minutes) : « 2 h 15 min » */
const horaire = t => { t = ((t % 1440) + 1440) % 1440; return `${Math.floor(t / 60)} h ${deux(t % 60)}`; };
const duree = d => { const h = Math.floor(d / 60), m = d % 60; return h && m ? `${h} h ${m} min` : h ? `${h} h` : `${m} min`; };
const dir = phi => ({ x: Math.cos(phi * DEG), y: -Math.sin(phi * DEG) });
const pt = (O, phi, r) => V.plus(O, V.fois(dir(phi), r));

/* Vérifie une réponse « [n] h [n] min » */
function verifierHM(v, attendu, { horaireAttendu = false } = {}) {
  const h = lireNombre(v[0]), m = lireNombre(v[1]);
  if (isNaN(h) || isNaN(m)) return { etat: "incomplet", message: "Complète les heures et les minutes (écris 0 s'il n'y en a pas)." };
  if (m >= 60) return { etat: "faux", message: "Les minutes doivent être inférieures à 60 : 60 min = 1 h." };
  const t = h * 60 + m;
  const bon = horaireAttendu ? ((attendu % 1440) + 1440) % 1440 : attendu;
  return t === bon ? { etat: "juste" } : { etat: "faux" };
}

/* ---------- Horloge (comme au chapitre 5) ---------- */
function horloge(h, m) {
  const s = svg("svg", { viewBox: "0 0 260 260", width: 230, height: 230, class: "horloge", role: "img", "aria-label": "Horloge" });
  const C = { x: 130, y: 130 };
  s.append(svg("circle", { cx: 130, cy: 130, r: 118, class: "h-cadran" }));
  for (let k = 0; k < 60; k++) {
    const phi = 90 - 6 * k, gros = k % 5 === 0;
    const a = pt(C, phi, 112), b = pt(C, phi, gros ? 98 : 106);
    s.append(svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: gros ? "h-grad gros" : "h-grad" }));
    if (gros) { const t = pt(C, phi, 84); s.append(svg("text", { x: t.x, y: t.y + 6, class: "h-num" }, String(k / 5 || 12))); }
  }
  const aiguille = (phi, l, classe) => { const b = pt(C, phi, l); s.append(svg("line", { x1: 130, y1: 130, x2: b.x, y2: b.y, class: classe })); };
  aiguille(90 - (30 * (h % 12) + m / 2), 58, "h-heures");
  aiguille(90 - 6 * m, 88, "h-minutes");
  s.append(svg("circle", { cx: 130, cy: 130, r: 5, class: "h-centre" }));
  return s;
}

/* Un problème en plusieurs questions ; une étape est en « h min » (hm: true) ou un nombre */
function probleme(enonce, etapes, indice) {
  const numeroter = etapes.length > 1;
  return {
    consigne: enonce,
    classeLigne: "etapes",
    ligne: etapes.map((e, k) => `<div class="etape-pb"><p>${numeroter ? k + 1 + ". " : ""}${e.q}</p><p class="rep">${e.hm ? "[n] h [n] min" : "[d] " + (e.unite || "")}</p></div>`).join(""),
    verifier(v) {
      let i = 0;
      const res = etapes.map(e => {
        if (e.hm) { const r = verifierHM([v[i], v[i + 1]], e.r, { horaireAttendu: e.horaire }); i += 2; return r; }
        return verifierNombre(v[i++], e.r);
      });
      if (res.some(r => r.etat === "incomplet")) return { etat: "incomplet", message: "Réponds à chaque question (écris 0 s'il n'y a pas de minutes)." };
      const fausses = res.map((r, k) => r.etat === "faux" ? k + 1 : 0).filter(Boolean);
      if (!fausses.length) return { etat: "juste" };
      return { etat: "faux", message: numeroter ? `Revois ${fausses.length > 1 ? "les questions " + fausses.join(" et ") : "la question " + fausses[0]}.` : (res[0].message || "") };
    },
    indice,
    correction: etapes.map((e, k) => (numeroter ? k + 1 + ". " : "") + e.c).join("<br>")
  };
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "lire-heure",
    titre: "Lire l'heure",
    description: "La petite aiguille pour les heures, la grande pour les minutes.",
    generer() {
      const h = alea(1, 11), m = choisir([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, alea(1, 59)]);
      const soir = Math.random() < 0.4;
      return {
        consigne: `Quelle heure est-il ? (C'est ${soir ? "l'après-midi ou le soir" : "le matin"}.)`,
        figure: horloge(h, m),
        ligne: "[n] h [n] min",
        verifier(v) {
          const r = verifierHM(v, (soir ? h + 12 : h) * 60 + m);
          if (r.etat === "faux" && soir && lireNombre(v[0]) === h) r.message = `C'est l'après-midi : on ajoute 12 h, ${h} h devient ${h + 12} h.`;
          if (r.etat === "faux" && lireNombre(v[1]) === m && Math.abs(lireNombre(v[0]) - h) === 1) r.message = "Regarde bien la petite aiguille : elle n'a pas encore atteint l'heure suivante.";
          return r;
        },
        indice: "La grande aiguille indique les minutes (chaque chiffre vaut 5 min). La petite aiguille indique l'heure.",
        correction: `Il est ${horaire((soir ? h + 12 : h) * 60 + m)}.`
      };
    }
  },

  {
    groupe: F1,
    id: "unites-duree",
    titre: "Les unités de durée",
    description: "1 h = 60 min, 1 jour = 24 h…",
    generer() {
      const k = alea(2, 5);
      const [l, r] = choisir([
        ["1 h = [n] min", 60], ["1 min = [n] s", 60], ["1 jour = [n] h", 24], ["1 semaine = [n] jours", 7], ["1 siècle = [n] ans", 100],
        ["1 an = [n] jours (année non bissextile)", 365], [`${k} h = [n] min`, 60 * k], [`${k} jours = [n] h`, 24 * k], [`${k} semaines = [n] jours`, 7 * k],
        ["une demi-heure = [n] min", 30], ["un quart d'heure = [n] min", 15], ["trois quarts d'heure = [n] min", 45], [`${k} min = [n] s`, 60 * k]
      ]);
      return {
        consigne: "Complète.",
        ligne: l,
        verifier: v => verifierNombre(v[0], r),
        indice: "1 min = 60 s ; 1 h = 60 min ; 1 jour = 24 h ; 1 semaine = 7 jours ; 1 an = 365 jours ; 1 siècle = 100 ans.",
        correction: l.replace("[n]", nb(r)) + "."
      };
    }
  },

  {
    groupe: F1,
    id: "horaire-ou-duree",
    titre: "Horaire ou durée ?",
    description: "« À quelle heure ? » ou « combien de temps ? »",
    generer() {
      const [t, r] = choisir([
        ["Le film commence à 20 h 30.", "horaire"], ["Le film dure 1 h 50 min.", "durée"], ["Le cours de maths a lieu à 10 h 05.", "horaire"],
        ["La récréation dure 15 min.", "durée"], ["Je me lève à 7 h.", "horaire"], ["J'ai dormi 9 h.", "durée"], ["Le train arrive à 11 h 43.", "horaire"],
        ["Le trajet a duré 2 h 15 min.", "durée"], ["Il faut 45 min de cuisson.", "durée"], ["La boulangerie ouvre à 6 h 30.", "horaire"]
      ]);
      return {
        consigne: `« ${t} » : ce nombre est…`,
        choix: ["un horaire", "une durée"],
        verifier: (v, c) => ({ etat: c === "un " + r || c === "une " + r ? "juste" : "faux" }),
        indice: "Un horaire répond à « à quelle heure ? » ; une durée répond à « combien de temps ? ».",
        correction: r === "horaire" ? "C'est un horaire : il répond à « à quelle heure ? »." : "C'est une durée : elle répond à « combien de temps ? »."
      };
    }
  },

  {
    groupe: F1,
    id: "choisir-unite",
    titre: "Choisir l'unité qui convient",
    description: "s, min, h, jours ou ans ?",
    generer() {
      const [t, r] = choisir([
        ["La durée d'un battement de cils : 1…", "s"], ["La durée d'un match de football : 90…", "min"], ["La durée d'une nuit de sommeil : 9…", "h"],
        ["La durée des grandes vacances : 60…", "jours"], ["L'âge de mon grand-père : 72…", "ans"], ["La durée d'une chanson : 3…", "min"],
        ["Le temps pour courir 100 m : 15…", "s"], ["La durée d'une journée d'école : 7…", "h"], ["L'âge de la tour Eiffel : environ 135…", "ans"], ["La durée d'un mois : 30…", "jours"]
      ]);
      return {
        consigne: `Choisis l'unité : <strong>${t}</strong>`,
        choix: ["s", "min", "h", "jours", "ans"],
        verifier: (v, c) => ({ etat: c === r ? "juste" : "faux" }),
        indice: "Imagine la durée réelle : quelques secondes, quelques minutes, quelques heures… ?",
        correction: `${t.replace("…", "")} ${r}.`
      };
    }
  },

  {
    groupe: F1,
    id: "ranger-durees",
    titre: "Ranger des durées",
    description: "De la plus courte à la plus longue.",
    generer() {
      const pool = melanger([
        ["90 s", 1.5], ["2 min", 2], ["1 h", 60], ["50 min", 50], ["1 h 10 min", 70], ["100 min", 100], ["1 jour", 1440], ["20 h", 1200],
        ["3 h", 180], ["200 min", 200], ["1 semaine", 10080], ["150 h", 9000], ["45 min", 45], ["une demi-heure", 30], ["2 h 30 min", 150]
      ]);
      const items = [];
      for (const p of pool) if (items.length < 5 && !items.some(q => q[1] === p[1])) items.push(p);
      const ordre = [...items.keys()].sort((i, j) => items[i][1] - items[j][1]);
      const r = rangement(items.map(x => ({ texte: x[0] })), "<");
      return {
        consigne: "Range ces durées de la plus courte à la plus longue : clique dessus dans l'ordre.",
        figure: r.noeud,
        verifier() {
          const o = r.ordre();
          if (o.length < items.length) return { etat: "incomplet", message: "Range toutes les durées." };
          return o.every((i, k) => items[i][1] === items[ordre[k]][1]) ? { etat: "juste" } : { etat: "faux", message: "Convertis toutes les durées dans la même unité (en minutes, par exemple)." };
        },
        indice: "Convertis tout en minutes : 1 h = 60 min, 1 jour = 1 440 min.",
        correction: ordre.map(i => items[i][0]).join(" &lt; ") + ".",
        bloquer: r.bloquer
      };
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "convertir-minutes",
    titre: "Convertir en minutes ou en secondes",
    description: "D'une grande unité vers une petite : on multiplie.",
    generer() {
      if (Math.random() < 0.6) {
        const h = alea(1, 9), m = alea(0, 59);
        return {
          consigne: "Convertis en minutes.", ligne: `${h} h ${m} min = [n] min`,
          verifier(v) { const r = verifierNombre(v[0], 60 * h + m); if (r.etat === "faux" && lireNombre(v[0]) === 100 * h + m) r.message = "1 h = 60 min, pas 100 min !"; return r; },
          indice: "1 h = 60 min.", correction: `${h} × 60 + ${m} = ${60 * h + m} min.`
        };
      }
      const m = alea(1, 9), s = alea(0, 59);
      return {
        consigne: "Convertis en secondes.", ligne: `${m} min ${s} s = [n] s`,
        verifier: v => verifierNombre(v[0], 60 * m + s), indice: "1 min = 60 s.", correction: `${m} × 60 + ${s} = ${60 * m + s} s.`
      };
    }
  },

  {
    groupe: F2,
    id: "convertir-h-min",
    titre: "Convertir en heures et minutes",
    description: "La division euclidienne par 60.",
    generer() {
      const n = alea(61, 600);
      return {
        consigne: `Convertis <strong>${n} min</strong> en heures et minutes.`,
        ligne: `${n} min = [n] h [n] min`,
        verifier(v) {
          const r = verifierHM(v, n);
          if (r.etat === "faux" && lireNombre(v[0]) === Math.floor(n / 100)) r.message = "On divise par 60 (et pas par 100) : 1 h = 60 min.";
          return r;
        },
        indice: `Division euclidienne : ${n} = 60 × … + …`,
        correction: `${n} = 60 × ${Math.floor(n / 60)} + ${n % 60}, donc ${n} min = ${Math.floor(n / 60)} h ${n % 60} min.`
      };
    }
  },

  {
    groupe: F2,
    id: "convertir-jours",
    titre: "Convertir en jours et heures",
    description: "Ou en heures, minutes et secondes.",
    generer() {
      if (Math.random() < 0.6) {
        const n = alea(25, 200);
        return {
          consigne: `Convertis <strong>${n} h</strong> en jours et heures.`,
          ligne: `${n} h = [n] jours [n] h`,
          verifier(v) { const j = lireNombre(v[0]), h = lireNombre(v[1]); if (isNaN(j) || isNaN(h)) return { etat: "incomplet", message: "Complète les deux cases." }; return j * 24 + h === n && h < 24 ? { etat: "juste" } : { etat: "faux" }; },
          indice: "1 jour = 24 h : division euclidienne par 24.",
          correction: `${n} = 24 × ${Math.floor(n / 24)} + ${n % 24}, donc ${n} h = ${Math.floor(n / 24)} jours ${n % 24} h.`
        };
      }
      const n = alea(3700, 12000), h = Math.floor(n / 3600), m = Math.floor(n % 3600 / 60), s = n % 60;
      return {
        consigne: `Convertis <strong>${nb(n)} s</strong> en heures, minutes et secondes.`,
        ligne: `${nb(n)} s = [n] h [n] min [n] s`,
        verifier(v) { const x = v.map(lireNombre); if (x.some(isNaN)) return { etat: "incomplet", message: "Complète les trois cases." }; return x[0] === h && x[1] === m && x[2] === s ? { etat: "juste" } : { etat: "faux" }; },
        indice: "1 h = 3 600 s. Divise d'abord par 3 600, puis le reste par 60.",
        correction: `${nb(n)} = 3 600 × ${h} + ${nb(n % 3600)} et ${nb(n % 3600)} = 60 × ${m} + ${s}, donc ${h} h ${m} min ${s} s.`
      };
    }
  },

  {
    groupe: F2,
    id: "comparer-durees",
    titre: "Comparer des durées",
    description: "On convertit dans la même unité.",
    generer() {
      const [g, d] = choisir([
        () => { const a = alea(61, 200); const h = Math.floor(a / 60), m = a % 60 + choisir([-5, 0, 5]); return [[`${a} min`, a], [`${h} h ${Math.max(0, m)} min`, 60 * h + Math.max(0, m)]]; },
        () => { const m = alea(2, 6); const s = 60 * m + choisir([-20, 0, 20]); return [[`${m} min`, 60 * m], [`${s} s`, s]]; },
        () => { const j = alea(2, 5); const h = 24 * j + choisir([-6, 0, 6]); return [[`${j} jours`, 24 * j], [`${h} h`, h]]; },
        () => { const a = alea(4, 8); const mo = 12 * a + choisir([-4, 0, 4]); return [[`${a} ans`, 12 * a], [`${mo} mois`, mo]]; }
      ])();
      const s = g[1] < d[1] ? "<" : g[1] > d[1] ? ">" : "=";
      return {
        consigne: "Complète par &lt;, = ou &gt;.",
        ligne: `${g[0]} [c] ${d[0]}`,
        choix: ["<", "=", ">"],
        verifier: (v, c) => ({ etat: c === s ? "juste" : "faux" }),
        indice: "Convertis les deux durées dans la même unité.",
        correction: `${g[0]} ${s === "<" ? "&lt;" : s === ">" ? "&gt;" : "="} ${d[0]}.`
      };
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: F3,
    id: "decimal-vers-hmin",
    titre: "Des heures décimales aux heures et minutes",
    description: "On multiplie la partie décimale par 60.",
    generer() {
      const h = alea(0, 6), d = choisir([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9]);
      const x = rr(h + d);
      if (x === 0) return this.generer();
      return {
        consigne: `Convertis <strong>${nb(x)} h</strong> en heures et minutes.`,
        ligne: `${nb(x)} h = [n] h [n] min`,
        verifier(v) {
          const r = verifierHM(v, Math.round(x * 60));
          if (r.etat === "faux" && lireNombre(v[0]) === h && lireNombre(v[1]) === Math.round(d * 100)) r.message = `Attention : ${nb(d)} h, ce n'est pas ${Math.round(d * 100)} min ! On calcule ${nb(d)} × 60.`;
          return r;
        },
        indice: `${nb(d)} h = ${nb(d)} × 60 min.`,
        correction: `${nb(x)} h = ${h} h + ${nb(d)} × 60 min = ${h} h ${Math.round(d * 60)} min.`
      };
    }
  },

  {
    groupe: F3,
    id: "hmin-vers-decimal",
    titre: "Écrire une durée en heures décimales",
    description: "30 min = 0,5 h, 15 min = 0,25 h…",
    generer() {
      const h = alea(0, 5), m = choisir([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54]);
      return {
        consigne: "Écris cette durée en heures, avec un nombre décimal.",
        ligne: `${h ? h + " h " : ""}${m} min = [d] h`,
        verifier(v) {
          const r = verifierNombre(v[0], rr(h + m / 60));
          if (r.etat === "faux" && Math.abs(lireNombre(v[0]) - (h + m / 100)) < 1e-9) r.message = `${m} min, ce n'est pas 0,${deux(m)} h : on calcule ${m} ÷ 60.`;
          return r;
        },
        indice: `${m} min = ${m} ÷ 60 h.`,
        correction: `${m} min = ${m} ÷ 60 h = ${nb(m / 60)} h, donc ${h ? h + " h " : ""}${m} min = ${nb(h + m / 60)} h.`
      };
    }
  },

  {
    groupe: F3,
    id: "vrai-faux-decimal",
    titre: "Vrai ou faux : heures décimales",
    description: "Le piège de la virgule.",
    generer() {
      const [t, v, e] = choisir([
        ["1,5 h = 1 h 50 min", false, "1,5 h = 1 h + 0,5 × 60 min = 1 h 30 min."],
        ["1,5 h = 1 h 30 min", true, "0,5 h = 30 min."],
        ["0,25 h = 15 min", true, "0,25 × 60 = 15."],
        ["2,2 h = 2 h 20 min", false, "0,2 × 60 = 12 : 2,2 h = 2 h 12 min."],
        ["0,1 h = 6 min", true, "0,1 × 60 = 6."],
        ["1 h 15 min = 1,15 h", false, "15 min = 0,25 h : 1 h 15 min = 1,25 h."],
        ["3,75 h = 3 h 45 min", true, "0,75 × 60 = 45."],
        ["45 min = 0,45 h", false, "45 min = 0,75 h."]
      ]);
      return {
        consigne: `Vrai ou faux ? <strong>${t}</strong>`,
        choix: ["Vrai", "Faux"],
        verifier: (x, c) => ({ etat: (c === "Vrai") === v ? "juste" : "faux" }),
        indice: "Une heure, c'est 60 minutes, pas 100 : on multiplie la partie décimale par 60.",
        correction: `${v ? "Vrai" : "Faux"} : ${e}`
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "duree-entre",
    titre: "La durée entre deux horaires",
    description: "En passant par une heure ronde.",
    generer() {
      const debut = alea(6 * 60, 18 * 60), d = alea(20, 300);
      return {
        consigne: `Combien de temps s'écoule-t-il entre <strong>${horaire(debut)}</strong> et <strong>${horaire(debut + d)}</strong> ?`,
        ligne: "[n] h [n] min",
        verifier: v => verifierHM(v, d),
        indice: "Fais une frise : va d'abord jusqu'à l'heure ronde suivante, puis jusqu'à l'heure d'arrivée.",
        correction: debut % 60 === 0 || debut + d <= Math.ceil(debut / 60) * 60 ? `De ${horaire(debut)} à ${horaire(debut + d)} : ${duree(d)}.`
          : `De ${horaire(debut)} à ${horaire(Math.ceil(debut / 60) * 60)} : ${Math.ceil(debut / 60) * 60 - debut} min ; puis jusqu'à ${horaire(debut + d)} : ${duree(debut + d - Math.ceil(debut / 60) * 60)}. En tout : ${duree(d)}.`
      };
    }
  },

  {
    groupe: F4,
    id: "horaire-fin",
    titre: "Trouver l'horaire de fin",
    description: "Horaire de début + durée.",
    generer() {
      const debut = alea(8 * 60, 21 * 60), d = alea(25, 200);
      const [t] = choisir([[`Un match commence à ${horaire(debut)} et dure ${duree(d)}.`], [`Une séance de cinéma commence à ${horaire(debut)}. Le film dure ${d} min.`], [`Un train part à ${horaire(debut)}. Le trajet dure ${duree(d)}.`]]);
      return {
        consigne: `${t} À quelle heure se termine-t-il ?`,
        ligne: "[n] h [n] min",
        verifier: v => verifierHM(v, debut + d, { horaireAttendu: true }),
        indice: "Ajoute les heures, puis les minutes. Si on dépasse 60 min, on ajoute 1 h.",
        correction: `${horaire(debut)} + ${duree(d)} = ${horaire(debut + d)}.`
      };
    }
  },

  {
    groupe: F4,
    id: "horaire-debut",
    titre: "Trouver l'horaire de début",
    description: "Horaire de fin − durée.",
    generer() {
      const fin = alea(10 * 60, 22 * 60), d = alea(25, 240);
      return {
        consigne: `Inès est arrivée à ${horaire(fin)} après un trajet de ${duree(d)}. À quelle heure est-elle partie ?`,
        ligne: "[n] h [n] min",
        verifier: v => verifierHM(v, fin - d, { horaireAttendu: true }),
        indice: "On remonte le temps : on enlève la durée à l'horaire d'arrivée.",
        correction: `${horaire(fin)} − ${duree(d)} = ${horaire(fin - d)}.`
      };
    }
  },

  {
    groupe: F4,
    id: "calculer-durees",
    titre: "Calculer avec des durées",
    description: "Additionner, soustraire, multiplier.",
    generer() {
      const a = alea(30, 200), b = alea(20, 120);
      const cas = choisir(["+", "-", "×"]);
      let r, txt;
      if (cas === "+") { r = a + b; txt = `${duree(a)} + ${duree(b)}`; }
      else if (cas === "-") { const g = Math.max(a, b) + 30, p = Math.min(a, b); r = g - p; txt = `${duree(g)} − ${duree(p)}`; }
      else { const k = alea(2, 4); r = a * k; txt = `${duree(a)} × ${k}`; }
      return {
        consigne: "Calcule.",
        ligne: `${txt} = [n] h [n] min`,
        verifier: v => verifierHM(v, r),
        indice: "Calcule les heures et les minutes séparément, puis convertis : 60 min = 1 h.",
        correction: `${txt} = ${duree(r)}.`
      };
    }
  },

  /* ================= Feuille 5 ================= */

  {
    groupe: F5,
    id: "problemes-durees",
    titre: "Problèmes de durées",
    description: "Horaire de début, horaire de fin ou durée ?",
    generer() {
      const P = choisir([
        () => { const prep = alea(15, 40), cuis = alea(20, 60), service = alea(18 * 60, 20 * 60 + 30); return ["Pour un gâteau, il faut " + prep + " min de préparation et " + cuis + " min de cuisson. Malik veut servir le gâteau à " + horaire(service) + ".", [{ q: "Combien de temps faut-il en tout ?", hm: true, r: prep + cuis, c: `${prep} + ${cuis} = ${prep + cuis} min = ${duree(prep + cuis)}` }, { q: "À quelle heure, au plus tard, doit-il commencer ?", hm: true, horaire: true, r: service - prep - cuis, c: `${horaire(service)} − ${duree(prep + cuis)} = ${horaire(service - prep - cuis)}` }]]; },
        () => { const couche = alea(20 * 60 + 30, 22 * 60), leve = alea(6 * 60 + 30, 7 * 60 + 30); const d = 1440 - couche + leve; return [`Léo se couche à ${horaire(couche)} et se lève à ${horaire(leve)}.`, [{ q: "Combien de temps dort-il par nuit ?", hm: true, r: d, c: `Jusqu'à minuit : ${duree(1440 - couche)} ; puis ${duree(leve)} : ${duree(d)}` }]]; },
        () => { const debut = alea(19 * 60 + 30, 20 * 60 + 45), spect = alea(80, 120), entr = choisir([15, 20, 25]); return [`Un spectacle de ${duree(spect)} commence à ${horaire(debut)}. Il y a un entracte de ${entr} min.`, [{ q: "À quelle heure se termine-t-il ?", hm: true, horaire: true, r: debut + spect + entr, c: `${horaire(debut)} + ${duree(spect)} + ${entr} min = ${horaire(debut + spect + entr)}` }]]; },
        () => { const dep = alea(7 * 60, 10 * 60), d = alea(70, 200); return [`Un train part de Paris à ${horaire(dep)} et arrive à Lyon à ${horaire(dep + d)}.`, [{ q: "Combien de temps dure le trajet ?", hm: true, r: d, c: `De ${horaire(dep)} à ${horaire(dep + d)} : ${duree(d)}` }]]; },
        () => { const tour = choisir([90, 96, 100, 120, 80]); return [`Un satellite fait le tour de la Terre en ${duree(tour)}.`, [{ q: "Combien de tours complets fait-il en une journée (24 h) ?", r: Math.floor(1440 / tour), unite: "tours", c: `24 h = 1 440 min ; 1 440 ÷ ${tour} = ${nb(rr(1440 / tour))} : ${Math.floor(1440 / tour)} tours complets` }]]; },
        () => { const jours = [alea(330, 420), alea(330, 420), alea(180, 240), alea(360, 420), alea(300, 380)]; const tot = jours.reduce((a, b) => a + b, 0); return [`Voici la durée des cours de Noé : lundi ${duree(jours[0])}, mardi ${duree(jours[1])}, mercredi ${duree(jours[2])}, jeudi ${duree(jours[3])}, vendredi ${duree(jours[4])}.`, [{ q: "Quelle est la durée de ses cours dans la semaine ?", hm: true, r: tot, c: `En tout : ${duree(tot)}` }]]; }
      ])();
      return probleme(P[0], P[1], "Repère si on cherche un horaire de début, un horaire de fin ou une durée. Fais une frise.");
    }
  }

];

/* ---------- Le test « Je me teste » : 10 questions ---------- */
const PARCOURS = {
  id: "je-me-teste",
  titre: "Je me teste",
  description: "10 questions sur tout le chapitre, un seul essai, puis un bilan de ce qui est à revoir.",
  etapes: [
    { competence: "Lire l'heure", activites: ["lire-heure"] },
    { competence: "Les unités de durée", activites: ["unites-duree", "choisir-unite", "horaire-ou-duree"] },
    { competence: "Convertir en minutes ou en secondes", activites: ["convertir-minutes"] },
    { competence: "Convertir en heures et minutes", activites: ["convertir-h-min", "convertir-jours"] },
    { competence: "Comparer et ranger des durées", activites: ["comparer-durees", "ranger-durees"] },
    { competence: "Les heures décimales", activites: ["decimal-vers-hmin", "hmin-vers-decimal", "vrai-faux-decimal"] },
    { competence: "Calculer une durée", activites: ["duree-entre"] },
    { competence: "Calculer un horaire", activites: ["horaire-fin", "horaire-debut"] },
    { competence: "Opérations sur les durées", activites: ["calculer-durees"] },
    { competence: "Résoudre un problème de durées", activites: ["problemes-durees"] }
  ]
};
