/* =====================================================================
   EXERCISEUR « DROITES, MÉDIATRICES ET SYMÉTRIE » — 6e, chapitre 2

   Les activités sont regroupées comme les quatre feuilles d'exercices.
   Chaque activité a un identifiant (utilisé dans l'adresse :
   …/droites-symetrie-6e/#notations), un titre, une description et une
   fonction generer() qui fabrique une question au hasard.
   ===================================================================== */

const F1 = "Feuille 1 — Vocabulaire, notations et milieu";
const F2 = "Feuille 2 — Perpendiculaires et parallèles";
const F3 = "Feuille 3 — Médiatrice et démonstration";
const F4 = "Feuille 4 — La symétrie axiale";

const W = 360, H = 210; // taille des figures

/* Propriétés du cours, telles qu'on les écrit après « Or : » */
const PROP = {
  mediatrice: "si un point appartient à la médiatrice d'un segment, alors il est à égale distance des deux extrémités.",
  reciproque: "si un point est à égale distance des deux extrémités d'un segment, alors il appartient à la médiatrice de ce segment.",
  perpPara: "si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles.",
  paraPerp: "si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre.",
  paraPara: "si deux droites sont parallèles à une même droite, alors elles sont parallèles entre elles.",
  symetrie: "la symétrie axiale conserve les longueurs.",
  milieu: "si un point est le milieu d'un segment, alors il le partage en deux longueurs égales, chacune égale à la moitié de la longueur du segment."
};
const CONSERVE = "La symétrie axiale conserve les longueurs, l'alignement, les angles, les aires et les milieux.";

const cap = t => t[0].toUpperCase() + t.slice(1);
const cm = x => ecrireNombre(x) + "\u00a0cm"; // espace insécable : « 4,5 cm » reste sur une ligne
const prime = t => t.split("").map(c => c + "′").join("");
const angle = t => `<span class="angle">${t}</span>`;
const pluriel = (n, mot) => n + " " + mot + (n > 1 ? "s" : "");

/* Un segment [AB] au hasard dans la figure ; w est une direction perpendiculaire, vers le haut. */
function segmentAuHasard(lmin = 150, lmax = 210, angleMax = 30) {
  const c = { x: W / 2 + alea(-20, 20), y: H / 2 + alea(-12, 12) };
  const u = V.angle(alea(-angleMax, angleMax) * DEG), l = alea(lmin, lmax);
  let w = V.normal(u);
  if (w.y > 0) w = V.fois(w, -1);
  return { A: V.moins(c, V.fois(u, l / 2)), B: V.plus(c, V.fois(u, l / 2)), u, w };
}

/* Coordonnées, dans la figure, d'un clic ou d'un toucher. */
function positionClic(s, e) {
  const p = s.createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(s.getScreenCTM().inverse());
}

const ACTIVITES = [

  /* ================= Feuille 1 ================= */

  {
    groupe: F1,
    id: "notations",
    titre: "Droite, demi-droite ou segment ?",
    description: "Choisir la bonne notation : [AB], [AB), (AB) ou AB.",
    generer() {
      const [X, Y] = tirerLettres(2);
      const nom = {
        [`[${X}${Y}]`]: `le segment d'extrémités ${X} et ${Y}`,
        [`[${X}${Y})`]: `la demi-droite d'origine ${X} passant par ${Y}`,
        [`[${Y}${X})`]: `la demi-droite d'origine ${Y} passant par ${X}`,
        [`(${X}${Y})`]: `la droite passant par ${X} et ${Y}`,
        [`${X}${Y}`]: `la longueur du segment [${X}${Y}]`
      };
      const options = Object.keys(nom);
      const verifier = bonne => (v, c) => ({ etat: c === bonne ? "juste" : "faux" });

      if (Math.random() < 0.6) {
        const bonne = choisir(options.slice(0, 4));
        const { A, B, w } = segmentAuHasard();
        const s = figureGeo(W, H, "Figure à nommer");
        if (bonne === `[${Y}${X})`) dessinerTrait(s, B, A, "demi", "geo-objet");
        else dessinerTrait(s, A, B, bonne[0] === "(" ? "droite" : bonne.endsWith(")") ? "demi" : "segment", "geo-objet");
        dessinerPoint(s, A, X, { vers: w });
        dessinerPoint(s, B, Y, { vers: w });
        return {
          consigne: "Quelle est la notation de la figure tracée en bleu ?",
          figure: s,
          choix: options.slice(0, 4),
          verifier: verifier(bonne),
          indice: "Regarde de chaque côté : un crochet quand le trait s'arrête sur le point, une parenthèse quand il continue.",
          correction: `La figure est ${nom[bonne]} : elle se note ${bonne}.`
        };
      }
      const bonne = choisir(options);
      const longueur = bonne === `${X}${Y}`;
      return {
        consigne: longueur
          ? `La distance entre ${X} et ${Y} vaut ${cm(alea(20, 95) / 10)}. Comment note-t-on cette distance ?`
          : `Comment note-t-on ${nom[bonne]} ?`,
        choix: options,
        verifier: verifier(bonne),
        indice: "[ ] : limité des deux côtés ; [ ) : limité d'un seul côté, par son origine ; ( ) : illimité des deux côtés ; sans rien : c'est un nombre, une longueur.",
        correction: longueur
          ? `Une distance est un nombre : on écrit ${X}${Y}, sans crochets ni parenthèses.`
          : `${cap(nom[bonne])} se note ${bonne}.`
      };
    }
  },

  {
    groupe: F1,
    id: "reconnaitre-figure",
    titre: "Reconnaître une figure",
    description: "Trouver la figure qui correspond à une notation.",
    generer() {
      const [X, Y] = tirerLettres(2);
      const types = melanger([
        ["segment", `[${X}${Y}]`, `le segment [${X}${Y}]`, `il s'arrête en ${X} et en ${Y}`],
        ["demiX", `[${X}${Y})`, `la demi-droite [${X}${Y})`, `elle part de ${X} et continue après ${Y}`],
        ["demiY", `[${Y}${X})`, `la demi-droite [${Y}${X})`, `elle part de ${Y} et continue après ${X}`],
        ["droite", `(${X}${Y})`, `la droite (${X}${Y})`, "elle continue des deux côtés"]
      ]);
      const cible = alea(0, 3);
      const inverse = Math.random() < 0.5;
      const figures = types.map(([t]) => {
        const s = figureGeo(170, 84, "Figure");
        let A = { x: 55, y: 44 }, B = { x: 115, y: 34 };
        if (inverse) [A, B] = [{ x: 115, y: 44 }, { x: 55, y: 34 }];
        if (t === "demiY") dessinerTrait(s, B, A, "demi", "geo-objet");
        else dessinerTrait(s, A, B, t === "droite" ? "droite" : t === "demiX" ? "demi" : "segment", "geo-objet");
        dessinerPoint(s, A, X, { vers: { x: 0, y: 1 } });
        dessinerPoint(s, B, Y, { vers: { x: 0, y: 1 } });
        return s;
      });
      return {
        consigne: `Clique sur la figure qui représente ${types[cible][1]}.`,
        choix: figures,
        verifier: (v, c) => c === cible ? { etat: "juste" } : { etat: "faux", message: `Tu as choisi ${types[c][2]}.` },
        indice: "Regarde où le trait s'arrête : sur un point (crochet) ou pas (parenthèse).",
        correction: `${cap(types[cible][2])} : ${types[cible][3]}.`
      };
    }
  },

  {
    groupe: F1,
    id: "appartenance",
    titre: "Appartient ou n'appartient pas",
    description: "Compléter avec ∈ ou ∉ en lisant une figure.",
    generer() {
      const [X, Y, P] = tirerLettres(3);
      const [type, notation] = choisir([
        ["droite", `(${X}${Y})`], ["segment", `[${X}${Y}]`], ["demiX", `[${X}${Y})`], ["demiY", `[${Y}${X})`]]);
      const place = choisir(["entre", "avant", "apres", "dehors"]);
      const { A, B, w } = segmentAuHasard(110, 140);
      const t = place === "entre" ? alea(25, 75) / 100 : place === "avant" ? -alea(38, 50) / 100
        : place === "apres" ? 1 + alea(38, 50) / 100 : alea(20, 80) / 100;
      const cote = choisir([-1, 1]);
      let M = V.plus(A, V.fois(V.moins(B, A), t));
      if (place === "dehors") M = V.plus(M, V.fois(w, cote * alea(32, 45)));
      const surDroite = place !== "dehors";
      const appartient = {
        droite: surDroite,
        segment: place === "entre",
        demiX: place === "entre" || place === "apres",
        demiY: place === "entre" || place === "avant"
      }[type];
      const signe = appartient ? "∈" : "∉";

      const s = figureGeo(W, H, "Figure");
      dessinerTrait(s, A, B, "droite");
      dessinerPoint(s, A, X, { vers: w });
      dessinerPoint(s, B, Y, { vers: w });
      dessinerPoint(s, M, P, { vers: place === "dehors" ? V.fois(w, cote) : V.fois(w, -1), classe: "geo-point-question" });

      let explication;
      if (!surDroite) explication = `${P} n'est pas sur la droite (${X}${Y})` + (type === "droite" ? "." : ` : il n'est donc pas non plus sur ${notation}.`);
      else if (type === "droite") explication = `${P} est sur la droite (${X}${Y}).`;
      else if (type === "segment") explication = appartient
        ? `${P} est sur la droite, entre ${X} et ${Y} : il est sur le segment.`
        : `${P} est bien sur la droite (${X}${Y}), mais pas entre ${X} et ${Y} : il n'est pas sur le segment.`;
      else {
        const [o, q] = type === "demiX" ? [X, Y] : [Y, X];
        explication = `La demi-droite ${notation} part de ${o} et passe par ${q}. ` + (appartient
          ? `${P} est du côté de ${q} : il est dessus.`
          : `${P} est de l'autre côté de ${o} : il n'est pas dessus.`);
      }
      return {
        consigne: "Complète avec ∈ (appartient à) ou ∉ (n'appartient pas à).",
        figure: s,
        ligne: `${P} [c] ${notation}`,
        choix: ["∈", "∉"],
        verifier: (v, c) => ({ etat: c === signe ? "juste" : "faux" }),
        indice: type === "droite"
          ? "Le point est-il exactement sur la droite ?"
          : `Attention : la droite tracée est plus longue que ${notation}. Repère où ${notation} commence et s'arrête.`,
        correction: `${explication} Donc ${P} ${signe} ${notation}.`
      };
    }
  },

  {
    groupe: F1,
    id: "milieu",
    titre: "Le milieu d'un segment",
    description: "Placer le milieu, calculer des longueurs.",
    generer() {
      const [X, Y, I] = tirerLettres(3);
      const indice = "Le milieu partage le segment en deux longueurs égales : chacune vaut la moitié de la longueur du segment.";
      if (Math.random() < 0.6) {
        const cas = alea(0, 2);
        if (cas === 0) {
          const L = alea(20, 160) / 10;
          return {
            consigne: `${I} est le milieu de [${X}${Y}] et ${X}${Y} = ${cm(L)}. Combien vaut ${X}${I} ?`,
            ligne: `${X}${I} = [d] cm`,
            verifier: v => verifierNombre(v[0], L / 2),
            indice,
            correction: `${X}${I} = ${X}${Y} ÷ 2 = ${ecrireNombre(L)} ÷ 2 = ${cm(L / 2)}.`
          };
        }
        const d = alea(15, 80) / 10;
        if (cas === 1) {
          return {
            consigne: `${I} est le milieu de [${X}${Y}] et ${X}${I} = ${cm(d)}. Combien vaut ${X}${Y} ?`,
            ligne: `${X}${Y} = [d] cm`,
            verifier(v) {
              const r = verifierNombre(v[0], 2 * d);
              if (r.etat === "faux" && lireNombre(v[0]) === d / 2) r.message = `${X}${I} est la moitié de ${X}${Y}, pas l'inverse.`;
              return r;
            },
            indice,
            correction: `${X}${Y} = 2 × ${X}${I} = 2 × ${ecrireNombre(d)} = ${cm(2 * d)}.`
          };
        }
        return {
          consigne: `${I} est le milieu de [${X}${Y}] et ${I}${Y} = ${cm(d)}. Combien vaut ${X}${I} ?`,
          ligne: `${X}${I} = [d] cm`,
          verifier: v => verifierNombre(v[0], d),
          indice,
          correction: `Le milieu est à égale distance des deux extrémités : ${X}${I} = ${I}${Y} = ${cm(d)}.`
        };
      }

      // Placer le milieu sur des graduations
      const n = 14, pas = 24, x0 = 22, y = 58;
      let a, b;
      do { a = alea(0, 6); b = alea(a + 4, n); } while ((b - a) % 2);
      const m = (a + b) / 2;
      const X_ = k => ({ x: x0 + k * pas, y });
      const s = figureGeo(2 * x0 + n * pas, 96, "Segment gradué");
      s.classList.add("geo-clic");
      dessinerTrait(s, X_(0), X_(n), "segment", "geo-trait-fin");
      for (let k = 0; k <= n; k++) s.append(svg("line", { x1: X_(k).x, y1: y - 5, x2: X_(k).x, y2: y + 5, class: "geo-graduation" }));
      dessinerTrait(s, X_(a), X_(b), "segment", "geo-objet");
      dessinerPoint(s, X_(a), X, { vers: { x: 0, y: -1 } });
      dessinerPoint(s, X_(b), Y, { vers: { x: 0, y: -1 } });
      let position = null, marque = null, actif = true;
      s.addEventListener("pointerdown", e => {
        if (!actif) return;
        const k = Math.max(0, Math.min(n, Math.round((positionClic(s, e).x - x0) / pas)));
        position = k;
        marque?.remove();
        marque = dessinerPoint(s, X_(k), I, { vers: { x: 0, y: 1 }, classe: "geo-eleve" });
      });
      const graduations = k => pluriel(k, "graduation");
      return {
        consigne: `Place le milieu ${I} du segment [${X}${Y}] en cliquant sur la bonne graduation, puis valide.`,
        figure: s,
        verifier() {
          if (position == null) return { etat: "incomplet", message: "Clique sur une graduation pour placer le point." };
          if (position === m) return { etat: "juste" };
          return { etat: "faux", message: `Ton point est à ${graduations(Math.abs(position - a))} de ${X} et à ${graduations(Math.abs(b - position))} de ${Y}.` };
        },
        indice: `Compte les graduations entre ${X} et ${Y}, puis prends la moitié.`,
        correction: `[${X}${Y}] mesure ${graduations(b - a)}. Son milieu est à ${graduations(m - a)} de ${X} et de ${Y} (en vert).`,
        surCorrection() {
          dessinerPoint(s, X_(m), I, { vers: { x: 0, y: 1 }, classe: "geo-correct" });
          codageLongueur(s, X_(a), X_(m), 2);
          codageLongueur(s, X_(m), X_(b), 2);
        },
        bloquer() { actif = false; }
      };
    }
  },

  /* ================= Feuille 2 ================= */

  {
    groupe: F2,
    id: "reconnaitre-droites",
    titre: "Perpendiculaires ou parallèles ?",
    description: "Lire la position de deux droites sur une figure codée.",
    generer() {
      const [n1, n2] = choisir([["(d1)", "(d2)"], ["(d)", "(d′)"], ["(u)", "(v)"]]);
      const cas = choisir(["perp", "para", "secantes"]);
      const a = alea(-40, 40) * DEG, u1 = V.angle(a), n = V.normal(u1);
      const O = { x: W / 2 + alea(-25, 25), y: H / 2 + alea(-12, 12) };
      const s = figureGeo(W, H, "Deux droites");
      if (cas === "para") {
        const ecart = alea(55, 80);
        dessinerDroite(s, V.moins(O, V.fois(n, ecart / 2)), u1, n1, W, H);
        dessinerDroite(s, V.plus(O, V.fois(n, ecart / 2)), u1, n2, W, H);
      } else {
        const u2 = cas === "perp" ? n : V.angle(a + choisir([-1, 1]) * alea(35, 62) * DEG);
        dessinerDroite(s, O, u1, n1, W, H);
        dessinerDroite(s, O, u2, n2, W, H);
        if (cas === "perp") codageAngleDroit(s, O, u1, u2);
      }
      const bonne = { perp: "⊥", para: "//", secantes: "ni l'un ni l'autre" }[cas];
      return {
        consigne: "Complète avec le bon symbole.",
        figure: s,
        ligne: `${n1} [c] ${n2}`,
        choix: ["⊥", "//", "ni l'un ni l'autre"],
        verifier: (v, c) => ({ etat: c === bonne ? "juste" : "faux" }),
        indice: "Les droites se coupent-elles ? Si oui, l'angle droit est-il codé par un petit carré ?",
        correction: {
          perp: `Les droites se coupent en formant un angle droit (codé par un petit carré) : ${n1} ⊥ ${n2}.`,
          para: `Les droites ne se coupent pas : elles sont parallèles, ${n1} // ${n2}.`,
          secantes: "Les droites se coupent, mais sans former d'angle droit : elles sont sécantes, ni perpendiculaires ni parallèles."
        }[cas]
      };
    }
  },

  {
    groupe: F2,
    id: "traduire",
    titre: "Traduire en langage mathématique",
    description: "Passer d'une phrase à une écriture avec ⊥ ou //, et inversement.",
    generer() {
      const [p, q] = choisir([["d1", "d2"], ["AB", "CD"], ["u", "v"], ["d", "d′"], ["EF", "GH"]]).map(x => `(${x})`);
      const nota = { perp: `${p} ⊥ ${q}`, para: `${p} // ${q}` };
      const lecture = "« ⊥ » se lit « est perpendiculaire à » et « // » se lit « est parallèle à ».";
      if (Math.random() < 0.6) {
        const [cas, phrase] = choisir([
          ["perp", `La droite ${p} est perpendiculaire à la droite ${q}.`],
          ["perp", `La droite ${p} coupe ${q} en formant un angle droit.`],
          ["para", `Les droites ${p} et ${q} ne se coupent jamais.`],
          ["para", `La droite ${p} est parallèle à la droite ${q}.`]
        ]);
        const options = [nota.perp, nota.para, `${p} ∈ ${q}`];
        return {
          consigne: `Traduis cette phrase par une écriture mathématique :<br><em>« ${phrase} »</em>`,
          choix: options,
          verifier: (v, c) => c === nota[cas] ? { etat: "juste" }
            : { etat: "faux", message: c === options[2] ? "Le symbole ∈ s'utilise pour un point qui appartient à une droite, pas pour deux droites." : "" },
          indice: lecture,
          correction: (phrase.includes("jamais") ? "Deux droites qui ne se coupent jamais sont parallèles. " : "")
            + (phrase.includes("angle droit") ? "Deux droites qui se coupent en formant un angle droit sont perpendiculaires. " : "")
            + `On écrit : ${nota[cas]}.`
        };
      }
      const cas = choisir(["perp", "para"]);
      const options = [
        `${p} est perpendiculaire à ${q}.`,
        `${p} est parallèle à ${q}.`,
        `${p} et ${q} sont sécantes sans être perpendiculaires.`
      ];
      const bonne = cas === "perp" ? 0 : 1;
      return {
        consigne: `Que signifie l'écriture <strong>${nota[cas]}</strong> ?`,
        choix: options,
        verifier: (v, c) => ({ etat: c === options[bonne] ? "juste" : "faux" }),
        indice: lecture,
        correction: `${nota[cas]} se lit : « ${options[bonne].slice(0, -1)} ».`
      };
    }
  },

  {
    groupe: F2,
    id: "proprietes-droites",
    titre: "Les propriétés des droites",
    description: "Utiliser une propriété pour conclure : ⊥ ou // ?",
    generer() {
      const [a, b, c] = melanger(["(d1)", "(d2)", "(d3)"]);
      const cas = choisir(["perpPara", "paraPerp", "paraPara", "rien"]);
      const donnees = {
        perpPara: `${a} ⊥ ${c} et ${b} ⊥ ${c}`,
        paraPerp: `${a} // ${b} et ${c} ⊥ ${a}`,
        paraPara: `${a} // ${c} et ${b} // ${c}`,
        rien: `${a} et ${c} sont sécantes, et ${b} et ${c} sont sécantes`
      }[cas];
      const [x, y] = cas === "paraPerp" ? [c, b] : [a, b];
      const options = [`${x} // ${y}`, `${x} ⊥ ${y}`, "On ne peut rien conclure"];
      const bonne = { perpPara: 0, paraPerp: 1, paraPara: 0, rien: 2 }[cas];

      // Figure à main levée, tournée au hasard
      const s = figureGeo(W, H, "Trois droites");
      const u = V.angle(alea(-20, 20) * DEG), n = V.normal(u);
      const C0 = { x: W / 2, y: H / 2 };
      const cote = choisir([-1, 1]);
      if (cas === "perpPara") {
        dessinerDroite(s, C0, u, c, W, H);
        for (const [nom, k] of [[a, -60 * cote], [b, 60 * cote]]) {
          const P = V.plus(C0, V.fois(u, k));
          dessinerDroite(s, P, n, nom, W, H);
          codageAngleDroit(s, P, u, n);
        }
      } else if (cas === "paraPerp") {
        const Pa = V.plus(C0, V.fois(n, 40 * cote)), Pb = V.moins(C0, V.fois(n, 40 * cote));
        dessinerDroite(s, Pa, u, a, W, H);
        dessinerDroite(s, Pb, u, b, W, H);
        const I = V.plus(Pa, V.fois(u, alea(-50, 50)));
        dessinerDroite(s, I, n, c, W, H);
        codageAngleDroit(s, I, u, V.fois(n, -cote));
      } else if (cas === "paraPara") {
        melanger([a, b, c]).forEach((nom, k) => dessinerDroite(s, V.plus(C0, V.fois(n, (k - 1) * 55)), u, nom, W, H));
      } else {
        dessinerDroite(s, C0, u, c, W, H);
        dessinerDroite(s, V.moins(C0, V.fois(u, 70)), V.tourner(u, { x: 0, y: 0 }, 58 * DEG), a, W, H);
        dessinerDroite(s, V.plus(C0, V.fois(u, 70)), V.tourner(u, { x: 0, y: 0 }, 118 * DEG), b, W, H);
      }
      return {
        consigne: `On sait que ${donnees}. Que peut-on en conclure ?`,
        figure: s,
        choix: options,
        verifier: (v, c2) => ({ etat: c2 === options[bonne] ? "juste" : "faux" }),
        indice: "Cherche dans le cours la propriété qui commence par ce que tu sais.",
        correction: cas === "rien"
          ? "Aucune propriété du cours ne permet de conclure : deux droites qui coupent une même droite peuvent être dans n'importe quelle position."
          : `<strong>Je sais que :</strong> ${donnees}.<br><strong>Or :</strong> ${PROP[cas]}<br><strong>Donc :</strong> ${options[bonne]}.`
      };
    }
  },

  /* ================= Feuille 3 ================= */

  {
    groupe: F3,
    id: "est-ce-la-mediatrice",
    titre: "Est-ce la médiatrice ?",
    description: "Reconnaître la médiatrice d'un segment grâce au codage.",
    generer() {
      const [X, Y, I] = tirerLettres(3);
      const cas = choisir(["oui", "milieu", "perp"]);
      const { A, B, u, w } = segmentAuHasard(180, 220, 20);
      const M = V.milieu(A, B);
      const s = figureGeo(W, H, "Segment et droite");
      let O = M, dir = w;
      if (cas === "milieu") O = V.plus(A, V.fois(V.moins(B, A), choisir([alea(24, 36), alea(64, 76)]) / 100));
      if (cas === "perp") dir = V.tourner(u, { x: 0, y: 0 }, choisir([-1, 1]) * alea(55, 68) * DEG);
      dessinerDroite(s, O, dir, "(d)", W, H);
      dessinerTrait(s, A, B, "segment", "geo-objet");
      dessinerPoint(s, A, X, { vers: V.moins(A, M) });
      dessinerPoint(s, B, Y, { vers: V.moins(B, M) });
      dessinerPoint(s, M, I, { vers: V.plus(V.fois(w, 1), V.fois(u, cas === "milieu" && O.x > M.x ? -1.2 : 1.2)) });
      codageLongueur(s, A, M, 2);
      codageLongueur(s, M, B, 2);
      if (cas !== "perp") codageAngleDroit(s, O, u, w);
      const options = ["Oui", "Non : elle ne passe pas par le milieu", "Non : elle n'est pas perpendiculaire"];
      const bonne = { oui: 0, milieu: 1, perp: 2 }[cas];
      return {
        consigne: `La droite (d) est-elle la médiatrice du segment [${X}${Y}] ? Aide-toi du codage.`,
        figure: s,
        choix: options,
        verifier: (v, c) => ({ etat: c === options[bonne] ? "juste" : "faux" }),
        indice: `La médiatrice de [${X}${Y}] est la droite perpendiculaire à [${X}${Y}] qui passe par son milieu : il faut les deux.`,
        correction: {
          oui: `(d) est perpendiculaire à [${X}${Y}] (angle droit codé) et passe par son milieu ${I} (longueurs égales codées) : c'est la médiatrice de [${X}${Y}].`,
          milieu: `(d) est bien perpendiculaire à [${X}${Y}], mais elle ne passe pas par son milieu ${I} : ce n'est pas la médiatrice.`,
          perp: `(d) passe bien par le milieu ${I} de [${X}${Y}], mais elle n'est pas perpendiculaire à [${X}${Y}] : ce n'est pas la médiatrice.`
        }[cas]
      };
    }
  },

  {
    groupe: F3,
    id: "propriete-mediatrice",
    titre: "Utiliser la propriété de la médiatrice",
    description: "Trouver une longueur ou la position d'un point, sans mesurer.",
    generer() {
      const [X, Y, M] = tirerLettres(3);
      const x = alea(15, 95) / 10;
      const r = Math.random();
      if (r < 0.55) {
        const [connu, cherche] = melanger([X, Y]);
        return {
          consigne: choisir([
            `${M} appartient à la médiatrice de [${X}${Y}] et ${M}${connu} = ${cm(x)}. Combien vaut ${M}${cherche} ?`,
            `La droite (d) est la médiatrice de [${X}${Y}]. ${M} est un point de (d) tel que ${M}${connu} = ${cm(x)}. Combien vaut ${M}${cherche} ?`
          ]),
          ligne: `${M}${cherche} = [d] cm`,
          verifier: v => verifierNombre(v[0], x),
          indice: "Un point de la médiatrice d'un segment est à égale distance des deux extrémités.",
          correction: `<strong>Je sais que :</strong> ${M} appartient à la médiatrice de [${X}${Y}].<br><strong>Or :</strong> ${PROP.mediatrice}<br><strong>Donc :</strong> ${M}${cherche} = ${M}${connu} = ${cm(x)}.`
        };
      }
      if (r < 0.8) {
        const options = [`${M} appartient à la médiatrice de [${X}${Y}].`, `${M} est le milieu de [${X}${Y}].`, "On ne peut rien dire."];
        return {
          consigne: `On sait que ${M}${X} = ${M}${Y} = ${cm(x)}. Que peut-on dire du point ${M} ?`,
          choix: melanger([...options]),
          verifier: (v, c) => c === options[0] ? { etat: "juste" }
            : { etat: "faux", message: c === options[1] ? `${M} n'est pas forcément sur le segment [${X}${Y}] : il peut être au-dessus ou en dessous.` : "" },
          indice: `${M} est à égale distance de ${X} et de ${Y}. Quelle propriété du cours parle de cette situation ?`,
          correction: `<strong>Je sais que :</strong> ${M}${X} = ${M}${Y}.<br><strong>Or :</strong> ${PROP.reciproque}<br><strong>Donc :</strong> ${M} appartient à la médiatrice de [${X}${Y}].`
        };
      }
      const options = [`${M}${X} = ${M}${Y}`, `${M}${X} = 2 × ${M}${Y}`, "On ne peut rien dire."];
      return {
        consigne: `${M} appartient à la médiatrice de [${X}${Y}]. Que peut-on dire des longueurs ${M}${X} et ${M}${Y} ?`,
        choix: melanger([...options]),
        verifier: (v, c) => ({ etat: c === options[0] ? "juste" : "faux" }),
        indice: "Relis la propriété de la médiatrice dans le cours.",
        correction: `<strong>Or :</strong> ${PROP.mediatrice} <strong>Donc :</strong> ${M}${X} = ${M}${Y}.`
      };
    }
  },

  {
    groupe: F3,
    id: "demonstration",
    titre: "Rédiger une démonstration",
    description: "Choisir les bonnes phrases : Je sais que… / Or… / Donc…",
    generer() {
      const [A, B, M] = tirerLettres(3);
      const x = alea(15, 95) / 10, X = cm(x);
      const [d1, d2, d3] = melanger(["(d1)", "(d2)", "(d3)"]);
      /* Dans chaque liste, la première phrase est la bonne. La deuxième phrase de « sais »
         est toujours la conclusion : c'est l'erreur la plus fréquente. */
      const sc = choisir([
        {
          enonce: `La droite (d) est la médiatrice de [${A}${B}] et ${M} est un point de (d) tel que ${M}${A} = ${X}. Démontre que ${M}${B} = ${X}.`,
          sais: [`(d) est la médiatrice de [${A}${B}] et le point ${M} appartient à (d).`, `${M}${B} = ${X}.`, `${M} est le milieu de [${A}${B}].`],
          or: "mediatrice", piege: "reciproque",
          donc: [`${M}${B} = ${M}${A}, c'est-à-dire ${M}${B} = ${X}.`, `${M} appartient à la médiatrice de [${A}${B}].`, `${M} est le milieu de [${A}${B}].`]
        },
        {
          enonce: `${M} est un point tel que ${M}${A} = ${M}${B} = ${X}. Démontre que ${M} appartient à la médiatrice de [${A}${B}].`,
          sais: [`${M}${A} = ${M}${B}.`, `${M} appartient à la médiatrice de [${A}${B}].`, `${M} est le milieu de [${A}${B}].`],
          or: "reciproque", piege: "mediatrice",
          donc: [`${M} appartient à la médiatrice de [${A}${B}].`, `${M} est le milieu de [${A}${B}].`, `${M}${A} = ${M}${B}.`]
        },
        {
          enonce: `Les droites ${d1} et ${d2} sont toutes les deux perpendiculaires à la droite ${d3}. Démontre que ${d1} et ${d2} sont parallèles.`,
          sais: [`${d1} ⊥ ${d3} et ${d2} ⊥ ${d3}.`, `${d1} // ${d2}.`, `${d1} ⊥ ${d2}.`],
          or: "perpPara", piege: "paraPerp",
          donc: [`${d1} // ${d2}.`, `${d1} ⊥ ${d2}.`, `${d3} // ${d1}.`]
        },
        {
          enonce: `Les droites ${d1} et ${d2} sont parallèles, et la droite ${d3} est perpendiculaire à ${d1}. Démontre que ${d3} ⊥ ${d2}.`,
          sais: [`${d1} // ${d2} et ${d3} ⊥ ${d1}.`, `${d3} ⊥ ${d2}.`, `${d3} // ${d2}.`],
          or: "paraPerp", piege: "perpPara",
          donc: [`${d3} ⊥ ${d2}.`, `${d3} // ${d2}.`, `${d1} ⊥ ${d2}.`]
        },
        {
          enonce: `Les droites ${d1} et ${d2} sont toutes les deux parallèles à la droite ${d3}. Démontre que ${d1} // ${d2}.`,
          sais: [`${d1} // ${d3} et ${d2} // ${d3}.`, `${d1} // ${d2}.`, `${d1} ⊥ ${d3}.`],
          or: "paraPara", piege: "perpPara",
          donc: [`${d1} // ${d2}.`, `${d1} ⊥ ${d2}.`, `${d1} ⊥ ${d3}.`]
        },
        {
          enonce: `${A}′ et ${B}′ sont les symétriques de ${A} et ${B} par rapport à la droite (d), et ${A}${B} = ${X}. Démontre que ${A}′${B}′ = ${X}.`,
          sais: [`[${A}′${B}′] est le symétrique du segment [${A}${B}] par rapport à (d).`, `${A}′${B}′ = ${X}.`, `(d) est la médiatrice de [${A}${B}].`],
          or: "symetrie", piege: "mediatrice",
          donc: [`${A}′${B}′ = ${A}${B}, c'est-à-dire ${A}′${B}′ = ${X}.`, `${A}′${B}′ = 2 × ${A}${B}.`, `(d) est la médiatrice de [${A}′${B}′].`]
        },
        {
          enonce: `${M} est le milieu de [${A}${B}] et ${A}${B} = ${cm(2 * x)}. Démontre que ${A}${M} = ${X}.`,
          sais: [`${M} est le milieu de [${A}${B}] et ${A}${B} = ${cm(2 * x)}.`, `${A}${M} = ${X}.`, `${M} appartient à la médiatrice de [${A}${B}].`],
          or: "milieu", piege: "mediatrice",
          donc: [`${A}${M} = ${A}${B} ÷ 2 = ${X}.`, `${A}${M} = ${A}${B} × 2 = ${cm(4 * x)}.`, `${A}${M} = ${A}${B} = ${cm(2 * x)}.`]
        }
      ]);
      const autres = melanger(Object.keys(PROP).filter(k => k !== sc.or && k !== sc.piege)).slice(0, 2);
      const or = [sc.or, sc.piege, ...autres].map(k => PROP[k]);
      // Mélange de chaque liste en retenant où sont passées les phrases d'origine
      const listes = [sc.sais, or, sc.donc].map(l => melanger(l.map((t, i) => ({ t, i }))));
      const bonnes = listes.map(l => l.findIndex(o => o.i === 0));
      const etapes = ["Je sais que", "Or", "Donc"];
      return {
        consigne: `${sc.enonce}<br>Pour chaque étape, choisis la bonne phrase.`,
        classeLigne: "demo",
        ligne: etapes.map(e => `<div class="etape"><span class="mot">${e} :</span>[s]</div>`).join(""),
        listes: listes.map(l => l.map(o => o.t)),
        verifier(v) {
          if (v.some(x => x == null)) return { etat: "incomplet", message: "Choisis une phrase pour chacune des trois étapes." };
          const fausses = etapes.filter((e, k) => v[k] !== bonnes[k]);
          if (!fausses.length) return { etat: "juste" };
          const conseils = [`À revoir : ${fausses.map(e => "« " + e + " »").join(", ")}.`];
          if (listes[0][v[0]].i === 1) conseils.push("Dans « Je sais que », on écrit les informations de l'énoncé, pas ce que l'on veut démontrer.");
          if (listes[1][v[1]].i === 1) conseils.push("Attention à ne pas confondre deux propriétés qui se ressemblent : relis bien le « si » et le « alors ».");
          return { etat: "faux", message: conseils.join(" ") };
        },
        indice: "« Or » est une propriété du cours : son « si » doit correspondre à ce que tu sais, et son « alors » à ce que tu veux démontrer.",
        correction: etapes.map((e, k) => `<br><strong>${e} :</strong> ${[sc.sais, or, sc.donc][k][0]}`).join(""),
        surCorrection() {
          document.querySelectorAll(".ligne.demo .liste").forEach((l, k) => l.children[bonnes[k]].classList.add("bonne"));
        }
      };
    }
  },

  /* ================= Feuille 4 ================= */

  {
    groupe: F4,
    id: "symetrique-point",
    titre: "Placer le symétrique d'un point",
    description: "Sur quadrillage, avec un axe vertical, horizontal ou en diagonale.",
    generer() {
      const C = 10, L = 8, g = quadrillage(C, L, 32);
      const type = choisir(["vertical", "horizontal", "diagonale", "antidiagonale"]);
      const cx = alea(3, 7), cy = alea(3, 5);
      const sym = {
        vertical: (i, j) => [2 * cx - i, j],
        horizontal: (i, j) => [i, 2 * cy - j],
        diagonale: (i, j) => [cx + (j - cy), cy + (i - cx)],
        antidiagonale: (i, j) => [cx - (j - cy), cy - (i - cx)]
      }[type];
      const dans = (i, j) => i >= 0 && i <= C && j >= 0 && j <= L;
      const surAxe = Math.random() < 0.1;
      let M, S;
      do {
        M = [alea(0, C), alea(0, L)];
        S = sym(...M);
      } while (!dans(...S) || (surAxe ? S[0] !== M[0] || S[1] !== M[1] : Math.abs(S[0] - M[0]) + Math.abs(S[1] - M[1]) < 2));
      const [N] = tirerLettres(1);
      const direction = { vertical: { x: 0, y: 1 }, horizontal: { x: 1, y: 0 }, diagonale: { x: 1, y: 1 }, antidiagonale: { x: 1, y: -1 } }[type];
      const largeur = +g.svg.getAttribute("width"), hauteur = +g.svg.getAttribute("height");
      dessinerDroite(g.svg, g.P(cx, cy), V.unitaire(direction), "(d)", largeur, hauteur, "geo-axe");
      const vers = { x: 0.8, y: -1 };
      dessinerPoint(g.svg, g.P(...M), N, { vers });
      g.svg.classList.add("geo-clic");
      let choisi = null, marque = null, actif = true;
      g.svg.addEventListener("pointerdown", e => {
        if (!actif) return;
        const { i, j } = g.position(e);
        choisi = [Math.max(0, Math.min(C, Math.round(i))), Math.max(0, Math.min(L, Math.round(j)))];
        marque?.remove();
        marque = dessinerPoint(g.svg, g.P(...choisi), N + "′", { vers, classe: "geo-eleve" });
      });
      const carreaux = k => pluriel(k, "carreau").replace("carreaus", "carreaux");
      const regle = {
        vertical: "sur la même ligne", horizontal: "sur la même colonne"
      }[type];
      let correction;
      if (surAxe) correction = `${N} est sur l'axe (d) : son symétrique ${N}′ est confondu avec ${N}.`;
      else if (regle) {
        const k = type === "vertical" ? Math.abs(M[0] - cx) : Math.abs(M[1] - cy);
        correction = `${N} est à ${carreaux(k)} de l'axe. On reporte ${carreaux(k)} de l'autre côté de l'axe, ${regle} : c'est le point vert.`;
      } else {
        correction = `Pour aller de ${N} à ${N}′, on se déplace de ${carreaux(Math.abs(S[0] - M[0]))} en diagonale, perpendiculairement à l'axe ; l'axe (d) est exactement au milieu. C'est le point vert.`;
      }
      return {
        consigne: `Place le point ${N}′, symétrique de ${N} par rapport à la droite (d), en cliquant sur le quadrillage, puis valide.`,
        figure: g.svg,
        verifier() {
          if (!choisi) return { etat: "incomplet", message: "Clique sur un nœud du quadrillage pour placer le point." };
          if (choisi[0] === S[0] && choisi[1] === S[1]) return { etat: "juste" };
          if (choisi[0] === M[0] && choisi[1] === M[1]) return { etat: "faux", message: `Tu as cliqué sur ${N} lui-même.` };
          return { etat: "faux" };
        },
        indice: regle
          ? `Compte les carreaux entre ${N} et l'axe, puis reporte le même nombre de l'autre côté, ${regle}.`
          : "L'axe suit une diagonale du quadrillage : déplace-toi en diagonale, perpendiculairement à l'axe, et compte les carreaux.",
        correction,
        surCorrection() { dessinerPoint(g.svg, g.P(...S), N + "′", { vers: { x: -0.8, y: 1 }, classe: "geo-correct" }); },
        bloquer() { actif = false; }
      };
    }
  },

  {
    groupe: F4,
    id: "completer-figure",
    titre: "Compléter une figure symétrique",
    description: "Colorier des cases pour obtenir une figure symétrique.",
    generer() {
      const C = 10, L = 8, pas = 30, g = quadrillage(C, L, pas);
      const vertical = Math.random() < 0.5;
      const axe = vertical ? 5 : 4;
      const donneeCote = (i, j) => vertical ? i < axe : j < axe;
      const sym = (i, j) => vertical ? [2 * axe - 1 - i, j] : [i, 2 * axe - 1 - j];
      const cle = (i, j) => i + "," + j;

      const donnee = new Map();
      const depart = vertical ? [alea(1, 4), alea(1, 6)] : [alea(1, 8), alea(1, 3)];
      donnee.set(cle(...depart), depart);
      const n = alea(6, 9);
      while (donnee.size < n) {
        const [i, j] = choisir([...donnee.values()]);
        const [di, dj] = choisir([[1, 0], [-1, 0], [0, 1], [0, -1]]);
        const c = [i + di, j + dj];
        if (c[0] >= 0 && c[0] < C && c[1] >= 0 && c[1] < L && donneeCote(...c)) donnee.set(cle(...c), c);
      }
      const attendu = new Set([...donnee.values()].map(c => cle(...sym(...c))));
      const eleve = new Set(), rects = {};
      const cases = svg("g");
      for (let i = 0; i < C; i++) for (let j = 0; j < L; j++) {
        const p = g.P(i, j);
        rects[cle(i, j)] = svg("rect", { x: p.x, y: p.y, width: pas, height: pas,
          class: "case-quad" + (donnee.has(cle(i, j)) ? " donnee" : "") });
        cases.append(rects[cle(i, j)]);
      }
      g.svg.insertBefore(cases, g.fond);
      const debut = vertical ? g.P(axe, 0) : g.P(0, axe), fin = vertical ? g.P(axe, L) : g.P(C, axe);
      const u = V.unitaire(V.moins(fin, debut));
      dessinerTrait(g.svg, V.moins(debut, V.fois(u, 10)), V.plus(fin, V.fois(u, 10)), "segment", "geo-axe");
      dessinerTexte(g.svg, vertical ? { x: fin.x + 16, y: fin.y - 4 } : { x: fin.x - 6, y: fin.y - 14 }, "(d)", "geo-nom");
      g.svg.classList.add("geo-clic");
      let actif = true;
      g.svg.addEventListener("pointerdown", e => {
        if (!actif) return;
        const { i, j } = g.position(e);
        const ci = Math.floor(i), cj = Math.floor(j);
        if (ci < 0 || cj < 0 || ci >= C || cj >= L || donneeCote(ci, cj)) return;
        const k = cle(ci, cj);
        if (eleve.has(k)) eleve.delete(k); else eleve.add(k);
        rects[k].classList.toggle("eleve", eleve.has(k));
      });
      const nb = k => pluriel(k, "case");
      return {
        consigne: "Colorie des cases pour que la figure soit symétrique par rapport à la droite (d). Clique sur une case pour la colorier ou l'effacer, puis valide.",
        figure: g.svg,
        verifier() {
          if (!eleve.size) return { etat: "incomplet", message: "Clique sur les cases à colorier, de l'autre côté de l'axe." };
          const manque = [...attendu].filter(k => !eleve.has(k)).length;
          const trop = [...eleve].filter(k => !attendu.has(k)).length;
          if (!manque && !trop) return { etat: "juste" };
          const parties = [];
          if (manque) parties.push(`il manque ${nb(manque)}`);
          if (trop) parties.push(`${nb(trop)} ${trop > 1 ? "sont" : "est"} en trop`);
          return { etat: "faux", message: cap(parties.join(" et ")) + "." };
        },
        indice: `Pour chaque case coloriée, compte à combien de cases elle est de l'axe, puis reporte le même nombre de l'autre côté, ${vertical ? "sur la même ligne" : "dans la même colonne"}.`,
        correction: "Chaque case a sa symétrique à la même distance de l'axe, de l'autre côté. En vert : les cases qu'il fallait colorier en plus ; en rouge : les cases en trop.",
        surCorrection() {
          for (const k of attendu) if (!eleve.has(k)) rects[k].classList.add("manque");
          for (const k of eleve) if (!attendu.has(k)) rects[k].classList.add("trop");
        },
        bloquer() { actif = false; }
      };
    }
  },

  {
    groupe: F4,
    id: "axes-de-symetrie",
    titre: "Axes de symétrie",
    description: "Compter les axes de symétrie d'une figure.",
    generer() {
      const regulier = (n, r) => [...Array(n)].map((_, k) => V.fois(V.angle(-Math.PI / 2 + 2 * Math.PI * k / n), r));
      const axesRegulier = n => [...Array(n)].map((_, k) => -90 + 180 * k / n);
      const pts = t => t.map(([x, y]) => ({ x, y }));
      const forme = choisir([
        { nom: "un carré", points: pts([[-50, -50], [50, -50], [50, 50], [-50, 50]]), axes: [0, 45, 90, 135] },
        { nom: "un rectangle", points: pts([[-65, -35], [65, -35], [65, 35], [-65, 35]]), axes: [0, 90] },
        { nom: "un losange", points: pts([[65, 0], [0, -42], [-65, 0], [0, 42]]), axes: [0, 90] },
        { nom: "un triangle équilatéral", points: regulier(3, 66), axes: axesRegulier(3) },
        { nom: "un triangle isocèle", points: pts([[0, -58], [42, 45], [-42, 45]]), axes: [90] },
        { nom: "un triangle quelconque", points: pts([[-55, 45], [60, 45], [-20, -50]]), axes: [] },
        { nom: "un parallélogramme", points: pts([[-65, 35], [25, 35], [65, -35], [-25, -35]]), axes: [] },
        { nom: "un trapèze isocèle", points: pts([[-65, 35], [65, 35], [32, -35], [-32, -35]]), axes: [90] },
        { nom: "un cerf-volant", points: pts([[0, -62], [42, -15], [0, 62], [-42, -15]]), axes: [90] },
        { nom: "un pentagone régulier", points: regulier(5, 64), axes: axesRegulier(5) },
        { nom: "un hexagone régulier", points: regulier(6, 64), axes: axesRegulier(6) },
        { nom: "la lettre H", points: pts([[-40, -50], [-20, -50], [-20, -10], [20, -10], [20, -50], [40, -50], [40, 50], [20, 50], [20, 10], [-20, 10], [-20, 50], [-40, 50]]), axes: [0, 90] },
        { nom: "la lettre T", points: pts([[-45, -50], [45, -50], [45, -30], [10, -30], [10, 50], [-10, 50], [-10, -30], [-45, -30]]), axes: [90] },
        { nom: "la lettre E", points: pts([[-35, -50], [35, -50], [35, -32], [-15, -32], [-15, -9], [25, -9], [25, 9], [-15, 9], [-15, 32], [35, 32], [35, 50], [-35, 50]]), axes: [0] },
        { nom: "la lettre L", points: pts([[-30, -50], [-10, -50], [-10, 30], [35, 30], [35, 50], [-30, 50]]), axes: [] },
        { nom: "la lettre Z", points: pts([[-35, -50], [35, -50], [35, -32], [-8, 32], [35, 32], [35, 50], [-35, 50], [-35, 32], [8, -32], [-35, -32]]), axes: [] },
        { nom: "une croix", points: pts([[-15, -50], [15, -50], [15, -15], [50, -15], [50, 15], [15, 15], [15, 50], [-15, 50], [-15, 15], [-50, 15], [-50, -15], [-15, -15]]), axes: [0, 45, 90, 135] },
        { nom: "une flèche", points: pts([[-55, -12], [10, -12], [10, -35], [55, 0], [10, 35], [10, 12], [-55, 12]]), axes: [0] }
      ]);
      const c = { x: 130, y: 100 };
      const s = figureGeo(260, 200, "Figure");
      const chemin = forme.points.map((p, k) => (k ? "L" : "M") + (c.x + p.x).toFixed(1) + "," + (c.y + p.y).toFixed(1)).join(" ") + " Z";
      s.append(svg("path", { d: chemin, class: "geo-forme" }));
      const n = forme.axes.length;
      return {
        consigne: "Combien cette figure a-t-elle d'axes de symétrie ?",
        figure: s,
        ligne: "[n] axe(s) de symétrie",
        verifier: v => verifierNombre(v[0], n),
        indice: "Imagine que tu plies la figure le long d'une droite : les deux moitiés doivent se superposer exactement. Pense aussi aux diagonales.",
        correction: n
          ? `C'est ${forme.nom} : ${n > 1 ? `il y a ${n} axes de symétrie, tracés` : "il y a 1 axe de symétrie, tracé"} en vert.`
          : `C'est ${forme.nom} : il n'y a aucun axe de symétrie, car aucun pliage ne permet de superposer les deux moitiés.`,
        surCorrection() {
          for (const a of forme.axes) dessinerTrait(s, c, V.plus(c, V.angle(a * DEG)), "droite", "geo-axe-correct");
        }
      };
    }
  },

  {
    groupe: F4,
    id: "conservation",
    titre: "Ce que conserve la symétrie",
    description: "Longueurs, angles, périmètres, aires, alignement, milieux.",
    generer() {
      const [X, Y, Z] = tirerLettres(3);
      const x = alea(15, 95) / 10;
      const cas = alea(0, 5);
      const indice = CONSERVE;
      if (cas === 0) {
        return {
          consigne: `Le segment [${prime(X + Y)}] est le symétrique du segment [${X}${Y}] par rapport à la droite (d), et ${X}${Y} = ${cm(x)}. Combien mesure ${prime(X + Y)} ?`,
          ligne: `${prime(X + Y)} = [d] cm`,
          verifier: v => verifierNombre(v[0], x),
          indice,
          correction: `La symétrie axiale conserve les longueurs : ${prime(X + Y)} = ${X}${Y} = ${cm(x)}.`
        };
      }
      if (cas === 1) {
        const a = alea(15, 165);
        const [ang, angP] = [angle(X + Y + Z), angle(prime(X + Y + Z))];
        return {
          consigne: `L'angle ${angP} est le symétrique de l'angle ${ang} par rapport à la droite (d), et ${ang} = ${a}°. Combien mesure ${angP} ?`,
          ligne: `${angP} = [n] °`,
          verifier: v => verifierNombre(v[0], a),
          indice,
          correction: `La symétrie axiale conserve les angles : ${angP} = ${ang} = ${a}°.`
        };
      }
      if (cas === 2) {
        const a = alea(30, 70) / 10, b = alea(30, 70) / 10;
        const c = alea(Math.ceil((Math.abs(a - b) + 0.6) * 10), Math.floor((a + b - 0.6) * 10)) / 10;
        const p = Math.round((a + b + c) * 10) / 10;
        return {
          consigne: `Les triangles ${X}${Y}${Z} et ${prime(X + Y + Z)} sont symétriques par rapport à la droite (d). On donne ${X}${Y} = ${cm(a)}, ${Y}${Z} = ${cm(b)} et ${X}${Z} = ${cm(c)}. Quel est le périmètre du triangle ${prime(X + Y + Z)} ?`,
          ligne: "[d] cm",
          verifier: v => verifierNombre(v[0], p),
          indice: "Les côtés du triangle symétrique ont les mêmes longueurs que ceux du triangle de départ.",
          correction: `La symétrie conserve les longueurs, donc les deux triangles ont les mêmes côtés et le même périmètre : ${ecrireNombre(a)} + ${ecrireNombre(b)} + ${ecrireNombre(c)} = ${cm(p)}.`
        };
      }
      if (cas === 3) {
        const A = alea(4, 60);
        return {
          consigne: `Une figure a une aire de ${A} cm². Quelle est l'aire de sa symétrique par rapport à une droite (d) ?`,
          ligne: "[d] cm²",
          verifier: v => verifierNombre(v[0], A),
          indice,
          correction: `La symétrie axiale conserve les aires : la figure symétrique a aussi une aire de ${A} cm².`
        };
      }
      const [consigne, options, correction] = cas === 4
        ? [`Les points ${X}, ${Y} et ${Z} sont alignés. Leurs symétriques ${X}′, ${Y}′ et ${Z}′ par rapport à la droite (d) sont-ils alignés ?`,
           ["Oui", "Non", "On ne peut pas savoir"],
           `La symétrie axiale conserve l'alignement : ${X}′, ${Y}′ et ${Z}′ sont alignés.`]
        : [`${Z} est le milieu du segment [${X}${Y}]. On construit les symétriques ${X}′, ${Y}′ et ${Z}′ de ces points par rapport à la droite (d). Que peut-on dire du point ${Z}′ ?`,
           [`${Z}′ est le milieu de [${X}′${Y}′].`, `${Z}′ est sur l'axe (d).`, "On ne peut rien dire."],
           `La symétrie axiale conserve les milieux : ${Z}′ est le milieu de [${X}′${Y}′].`];
      return {
        consigne,
        choix: melanger([...options]),
        verifier: (v, c) => ({ etat: c === options[0] ? "juste" : "faux" }),
        indice,
        correction
      };
    }
  }

];
