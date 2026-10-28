/* Fonctionnement du site — pas besoin de modifier ce fichier. */

const TYPES = {
  cours:     { libelle: "Cours",             icone: "PDF" },
  exercices: { libelle: "Fiche d'exercices", icone: "EX" },
  corrige:   { libelle: "Corrigé",           icone: "✓" },
  video:     { libelle: "Vidéo",             icone: "▶" },
  lien:      { libelle: "Lien",              icone: "↗" },
  exerciseur:{ libelle: "Exerciseur",        icone: "✎" },
  activite:  { libelle: "Activité",          icone: "★" },
  test:      { libelle: "Se tester",         icone: "✓" }
};

function el(tag, attrs = {}, ...enfants) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of enfants) if (c != null) e.append(c);
  return e;
}

/* Dossier racine du site (là où se trouve app.js), pour construire les liens depuis n'importe quelle page */
const RACINE = new URL(".", document.currentScript ? document.currentScript.src : location.href);

/* Défilement doux, sauf si l'élève a demandé de réduire les animations */
const DEFILEMENT = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

function piedDePage() {
  const p = document.getElementById("pied");
  if (!p || p.dataset.fait) return;
  p.dataset.fait = "1";
  const qui = [SITE.presentation, SITE.college].filter(Boolean).join(", ");
  p.replaceChildren(el("div", { class: "pied-interieur" },
    el("p", { class: "pied-qui" }, el("strong", {}, SITE.titre), qui ? " · " + qui : ""),
    SITE.contact ? el("p", {}, SITE.contact) : null,
    el("nav", { class: "pied-liens", "aria-label": "Liens du pied de page" },
      el("a", { href: new URL("index.html", RACINE).href }, "Accueil"),
      el("a", { href: new URL("apropos.html", RACINE).href }, "À propos et mentions")),
    el("p", { class: "pied-annee" }, SITE.titre + " · " + new Date().getFullYear())
  ));
}

/* ---------- Page « À propos et mentions » ---------- */
function pageAPropos() {
  if (SITE.college) document.getElementById("ap-qui").textContent = "M. Leclerc, professeur de mathématiques au " + SITE.college + ".";
  if (SITE.contact) {
    const c = document.getElementById("ap-contact");
    c.textContent = SITE.contact;
    c.hidden = false;
  }
  piedDePage();
}

/* ---------- Améliorations communes à toutes les pages ---------- */

/* Lien « Aller au contenu » pour le clavier, visible seulement quand il reçoit le focus */
function lienEvitement() {
  const main = document.querySelector("main");
  if (!main || document.querySelector(".lien-evitement")) return;
  if (!main.id) main.id = "contenu";
  document.body.prepend(el("a", { class: "lien-evitement", href: "#" + main.id }, "Aller au contenu"));
}

/* Icône d'onglet, pour les pages qui n'en déclarent pas */
function iconeOnglet() {
  if (document.querySelector('link[rel="icon"]')) return;
  document.head.append(el("link", { rel: "icon", type: "image/svg+xml", href: new URL("favicon.svg", RACINE).href }));
}

/* Le lien « ← Sixième » d'un exerciseur ou d'une activité ramène au chapitre d'où l'on vient */
function lienRetourChapitre() {
  const a = document.querySelector(".bandeau .fil a");
  if (!a || typeof NIVEAUX === "undefined") return;
  const cible = new URL(a.getAttribute("href"), location.href);
  if (!/niveau\.html$/.test(cible.pathname) || cible.hash) return;
  const code = cible.searchParams.get("n");
  const niv = NIVEAUX[code];
  if (!niv) return;
  // chemin de cette page depuis la racine du site, sans index.html
  const ici = decodeURI(location.pathname).replace(/index\.html$/, "");
  const memePage = lien => lien && decodeURI(new URL(lien.split("#")[0], RACINE).pathname).replace(/index\.html$/, "") === ici;
  const i = niv.chapitres.findIndex(ch => (ch.ressources || []).some(r => memePage(r.lien)));
  if (i < 0) {
    if (!(niv.activites || []).some(r => memePage(r.lien))) return;
    cible.hash = "activites";
    a.href = cible.href;
    a.textContent = "← " + niv.nom + " · Activités";
    return;
  }
  cible.hash = "ch" + (i + 1);
  a.href = cible.href;
  // « Chapitre 3 — Fractions et partage » devient « Ch. 3 · Fractions et partage »
  const titre = niv.chapitres[i].titre.replace(/^Chapitre\s+(\d+)\s*[—–-]\s*/, "Ch. $1 · ");
  a.textContent = "← " + niv.nom + " · " + titre;
}

document.addEventListener("DOMContentLoaded", () => {
  lienEvitement();
  iconeOnglet();
  lienRetourChapitre();
});

function idYoutube(lien) {
  if (!lien) return null;
  if (/^[\w-]{11}$/.test(lien)) return lien;
  const m = lien.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/* Pictogrammes (traits, couleur héritée du texte) */
const ICONES = {
  cours:      '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  exercices:  '<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  corrige:    '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  video:      '<path d="M8 5.5v13l10.5-6.5z"/>',
  lien:       '<path d="M9 6h9v9M18 6L6 18"/>',
  exerciseur: '<path d="M4 20l1-5L15.5 4.5l4 4L9 19z"/><path d="M13 7l4 4"/>',
  activite:   '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
  test:       '<path d="M9 4h6v3H9z"/><path d="M8 5.5H6V21h12V5.5h-2"/><path d="M9 14l2 2 4-4"/>',
  chapitre:   '<path d="M4 5h16M4 12h16M4 19h10"/>',
  telecharger:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'
};
function icone(nom, classe = "picto") {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 24 24");
  s.setAttribute("class", classe);
  s.setAttribute("aria-hidden", "true");
  s.innerHTML = ICONES[nom] || ICONES.lien;
  return s;
}

/* ---------- Accueil ---------- */
function pageAccueil() {
  document.getElementById("titre").textContent = SITE.titre;
  document.getElementById("sous-titre").textContent = SITE.sousTitre;
  document.getElementById("message").textContent = SITE.message;
  const presentation = document.getElementById("presentation");
  if (presentation) {
    if (SITE.presentation) presentation.textContent = SITE.presentation; else presentation.hidden = true;
  }

  // Les niveaux : une ligne par niveau, comme un sommaire
  const grille = document.getElementById("grille");
  for (const [code, niv] of Object.entries(NIVEAUX)) {
    const n = niv.chapitres.length;
    const res = niv.chapitres.flatMap(ch => ch.ressources || []);
    const nbEx = res.filter(r => r.type === "exerciseur").length;
    const nbVid = res.filter(r => r.type === "video").length;
    const detail = n === 0 ? "Bientôt disponible" : [
      n + (n > 1 ? " chapitres" : " chapitre"),
      nbEx ? nbEx + (nbEx > 1 ? " exerciseurs" : " exerciseur") : null,
      nbVid ? nbVid + (nbVid > 1 ? " vidéos" : " vidéo") : null
    ].filter(Boolean).join(" · ");
    grille.append(el("a", { class: "carte-niveau" + (n === 0 ? " a-venir" : ""), href: "niveau.html?n=" + encodeURIComponent(code) },
      el("span", { class: "badge" }, code),
      el("span", { class: "carte-niveau-texte" },
        el("h3", {}, niv.nom),
        el("span", {}, detail)),
      el("span", { class: "fleche", "aria-hidden": "true" }, "›")
    ));
  }

  // Mode d'emploi (absent des anciennes versions de la page)
  const mode = document.getElementById("mode-emploi");
  if (mode) {
    const etapes = [
      ["cours", "Le cours et les fiches", "Retrouve le cours et les feuilles d'exercices vus en classe, à lire en ligne ou à télécharger."],
      ["exerciseur", "S'entraîner en ligne", "Des questions tirées au hasard et corrigées tout de suite : réessaie autant que tu veux."],
      ["test", "Se tester", "« Je me teste » fait le point sur tout un chapitre, avec un bilan à la fin."],
      ["video", "Vidéos et corrections", "Des vidéos pour revoir une notion, et la correction filmée de certaines fiches."]
    ];
    mode.append(...etapes.map(([type, titre, texte]) =>
      el("li", { class: "t-" + type },
        el("span", { class: "tuile" }, icone(type)),
        el("span", { class: "texte" }, el("strong", {}, titre), el("span", {}, texte)))));
  }

  videosRecentes();
  rechercheGlobale();
  piedDePage();
}

/* Chaîne YouTube sur l'accueil : bouton « S'abonner » et les 3 dernières vidéos (videos-recentes.js, mis à jour par GitHub) */
function videosRecentes() {
  const section = document.getElementById("youtube");
  const abonner = document.getElementById("abonner");
  if (!section || !abonner) return;
  if (!SITE.youtube) { section.hidden = abonner.hidden = true; return; }
  abonner.href = SITE.youtube + (SITE.youtube.includes("?") ? "&" : "?") + "sub_confirmation=1";
  abonner.prepend(icone("video"));
  const liste = typeof VIDEOS_RECENTES !== "undefined" ? VIDEOS_RECENTES.slice(0, 3) : [];
  document.getElementById("videos-recentes").append(...liste.map(v => carteVideo({ type: "video", titre: v.titre, lien: v.lien })));
}

/* Recherche dans tous les niveaux, depuis l'accueil */
function rechercheGlobale() {
  const champ = document.getElementById("recherche-globale");
  const zone = document.getElementById("resultats");
  if (!champ || !zone) return;

  // Index : chaque chapitre et chaque ressource de chaque niveau
  const index = [];
  for (const [code, niv] of Object.entries(NIVEAUX)) {
    const page = "niveau.html?n=" + encodeURIComponent(code);
    for (const r of niv.activites || []) {
      index.push({ type: r.type, titre: r.titre, ou: code + " · Activités", href: r.lien || page + "#activites",
        texte: normaliserRecherche(r.titre + " activite") });
    }
    niv.chapitres.forEach((ch, i) => {
      const ancre = page + "#ch" + (i + 1);
      index.push({ type: "chapitre", titre: ch.titre, ou: niv.nom, href: ancre,
        texte: normaliserRecherche(ch.titre + " " + (ch.description || "")) });
      for (const r of ch.ressources || []) {
        const t = TYPES[r.type] || TYPES.lien;
        // les vidéos se regardent dans la page du chapitre ; les autres ressources s'ouvrent directement
        const href = r.type === "video" ? ancre : (r.fichier || r.lien || ancre);
        index.push({ type: r.type, titre: r.titre || t.libelle, ou: code + " · " + ch.titre, href, pdf: !!r.fichier,
          texte: normaliserRecherche((r.titre || "") + " " + t.libelle + " " + ch.titre) });
      }
    });
  }

  const MAX = 20;
  const afficher = () => {
    const mots = normaliserRecherche(champ.value).split(/\s+/).filter(Boolean);
    zone.replaceChildren();
    if (mots.join("").length < 2) return;
    const trouves = index.filter(e => mots.every(m => e.texte.includes(m)))
      .sort((a, b) => (b.type === "chapitre") - (a.type === "chapitre")); // les chapitres d'abord
    if (!trouves.length) {
      zone.append(el("p", { class: "resultats-info" }, "Aucun résultat. Essaie un autre mot (par exemple « fraction », « symétrie », « vidéo »)."));
      return;
    }
    zone.append(el("p", { class: "resultats-info" },
      trouves.length + (trouves.length > 1 ? " résultats" : " résultat") +
      (trouves.length > MAX ? " : voici les " + MAX + " premiers. Ajoute un mot pour préciser ta recherche." : "")));
    zone.append(el("ul", { class: "resultats" }, ...trouves.slice(0, MAX).map(e =>
      el("li", {}, el("a", { class: "resultat t-" + (ICONES[e.type] ? e.type : "lien"), href: e.href, ...(e.pdf ? { target: "_blank", rel: "noopener" } : {}) },
        el("span", { class: "tuile" }, icone(e.type)),
        el("span", { class: "texte" },
          el("strong", {}, e.titre),
          el("span", {}, e.ou + (e.pdf ? " · PDF (nouvel onglet)" : ""))))))));
  };
  champ.addEventListener("input", afficher);
}

/* ---------- Page d'un niveau ---------- */
/* Texte sans accents ni majuscules, pour la recherche */
function normaliserRecherche(t) {
  return (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/* Sous-parties d'un chapitre : le cours, l'entraînement et le test, les vidéos */
const SOUS_PARTIES = [
  { titre: "Le cours", types: ["cours", "corrige"] },
  { titre: "S'entraîner et se tester", types: ["exerciseur", "test", "exercices", "activite", "lien"] },
  { titre: "Vidéos", types: ["video"] }
];

/* Titre affiché, plus court que celui de contenu.js (qui reste complet pour la recherche) :
   « Feuille d'exercices n°1 : Lire… » → « Fiche 1 · Lire… », « Vidéo — X » → « X », etc. */
function titreAffiche(r) {
  const t = r.titre || (TYPES[r.type] || TYPES.lien).libelle;
  let m;
  if (r.type === "exercices" && (m = t.match(/^Feuille d'exercices n°\s*(\d+)\s*:\s*(.+)$/))) return "Fiche " + m[1] + " · " + m[2];
  if (r.type === "cours" && /^Cours\s+—\s+/.test(t)) return "Cours";
  if (r.type === "test" && /^Je me teste\s+—\s+/.test(t)) return "Je me teste";
  if (r.type === "video" || r.type === "exerciseur") return t.replace(/^(Vidéo|Exerciseur)\s+—\s+/, "");
  return t;
}

/* « Chapitre 3 — Fractions et partage » → { num: "3", nom: "Fractions et partage" } */
function decouperChapitre(titre, repli) {
  const m = (titre || "").match(/^Chapitre\s+(\d+)\s*[—–-]\s*(.+)$/);
  return m ? { num: m[1], nom: m[2] } : { num: repli, nom: titre };
}

function pageNiveau() {
  const code = new URLSearchParams(location.search).get("n") || Object.keys(NIVEAUX)[0];
  const niv = NIVEAUX[code];
  if (!niv) { location.href = "index.html"; return; }

  document.title = niv.nom + " — " + SITE.titre;
  document.getElementById("lien-accueil").textContent = "← " + SITE.titre;
  document.getElementById("titre-niveau").textContent = niv.nom;

  const nav = document.getElementById("nav");
  for (const c of Object.keys(NIVEAUX)) {
    nav.append(el("a", { href: "niveau.html?n=" + encodeURIComponent(c), class: c === code ? "actif" : "",
      "aria-label": NIVEAUX[c].nom, ...(c === code ? { "aria-current": "page" } : {}) }, c));
  }

  const zone = document.getElementById("chapitres");
  const recherche = document.getElementById("recherche");

  if (niv.chapitres.length === 0) {
    recherche.hidden = true;
    zone.append(el("div", { class: "vide-niveau" }, "Les chapitres de " + niv.nom.toLowerCase() + " arrivent bientôt."));
    piedDePage();
    return;
  }

  // Chapitre ouvert au départ : celui marqué « enCours: true » dans contenu.js, sinon le premier
  const iEnCours = niv.chapitres.findIndex(ch => ch.enCours);
  const iOuvert = iEnCours >= 0 ? iEnCours : 0;
  const sections = niv.chapitres.map((ch, i) => ({ ch, id: "ch" + (i + 1), pastille: String(i + 1), ouvert: i === iOuvert, enCours: i === iEnCours }));
  // Section « Activités » (hors chapitres) : sa pastille ★ vient en premier, son bloc après les chapitres
  if (Array.isArray(niv.activites)) {
    sections.unshift({
      ch: { titre: "Activités", description: "Des activités interactives qui mélangent les notions de plusieurs chapitres.", ressources: niv.activites },
      id: "activites", pastille: "★", classe: "activites", vide: "Les activités arrivent bientôt."
    });
  }

  const blocs = sections.map(({ ch, id, ouvert, enCours, classe, vide, pastille }) => {
    const res = ch.ressources || [];
    const docs = res.filter(r => r.type !== "video");
    const vids = res.filter(r => r.type === "video");
    const elements = []; // chaque ressource affichée, pour la recherche

    const carte = r => {
      const e = r.type === "video" ? carteVideo(r)
        : r.type === "exerciseur" || r.type === "test" ? carteAction(r)
        : carteRessource(r);
      e.dataset.texte = normaliserRecherche(r.titre + " " + titreAffiche(r) + " " + (TYPES[r.type] || TYPES.lien).libelle);
      elements.push(e);
      return e;
    };

    const corps = el("div", { class: "corps" });
    if (ch.description) corps.append(el("p", { class: "description" }, ch.description));

    if (classe === "activites") {
      // pas de sous-parties pour les activités
      if (docs.length) corps.append(el("div", { class: "ressources" }, ...docs.map(carte)));
    } else {
      for (const sp of SOUS_PARTIES) {
        const liste = res.filter(r => sp.types.includes(r.type));
        if (!liste.length) continue;
        // l'exerciseur (bouton principal) puis « Je me teste » (bouton secondaire)
        const actions = liste.filter(r => r.type === "exerciseur").concat(liste.filter(r => r.type === "test"));
        const fiches = liste.filter(r => r.type === "exercices");
        const autres = liste.filter(r => !actions.includes(r) && r.type !== "exercices");
        const section = el("section", { class: "sous-partie" }, el("h3", { class: "onglet onglet-leger" }, el("span", {}, sp.titre)));
        if (actions.length) section.append(el("div", { class: "actions-chapitre" }, ...actions.map(carte)));
        if (autres.length) section.append(el("div", { class: sp.types.includes("video") ? "videos" : "ressources" }, ...autres.map(carte)));
        if (fiches.length) {
          // Les feuilles d'exercices sont regroupées dans un bloc qu'on déplie
          const nbCorr = fiches.filter(r => idYoutube(r.correction)).length;
          const groupe = el("details", { class: "groupe-fiches t-exercices" },
            el("summary", {},
              el("span", { class: "tuile" }, icone("exercices")),
              el("span", { class: "groupe-texte" },
                el("span", { class: "groupe-titre" }, "Feuilles d'exercices"),
                el("span", { class: "groupe-compte" }, fiches.length + (fiches.length > 1 ? " fiches" : " fiche") +
                  (nbCorr ? " · " + nbCorr + (nbCorr > 1 ? " corrections vidéo" : " correction vidéo") : ""))),
              el("span", { class: "fleche", "aria-hidden": "true" }, "›")),
            el("div", { class: "ressources" }, ...fiches.map(carte)));
          section.append(groupe);
        }
        corps.append(section);
      }
    }
    if (!res.length) corps.append(el("p", { class: "description" }, vide || "Les documents de ce chapitre arrivent bientôt."));
    corps.append(el("p", { class: "description aucun", hidden: "" }, "Aucune ressource ne correspond à ta recherche dans ce chapitre."));

    const mot = classe === "activites" ? " activité" : " document";
    const compte = [
      docs.length ? docs.length + mot + (docs.length > 1 ? "s" : "") : null,
      vids.length ? vids.length + " vidéo" + (vids.length > 1 ? "s" : "") : null
    ].filter(Boolean).join(" · ") || "Bientôt";

    const { num, nom } = decouperChapitre(ch.titre, pastille);
    const details = el("details", { class: "chapitre" + (classe ? " " + classe : "") + (enCours ? " en-cours" : ""), id },
      el("summary", {},
        el("span", { class: "num", "aria-hidden": "true" }, num),
        el("span", { class: "entete" },
          el("h2", {}, nom !== ch.titre ? el("span", { class: "invisible" }, "Chapitre " + num + " — ") : null, nom),
          el("span", { class: "compte" },
            enCours ? el("span", { class: "etiquette-en-cours" }, "En ce moment en classe") : null, compte)),
        el("span", { class: "fleche", "aria-hidden": "true" }, "›")
      ),
      corps
    );
    if (ouvert) details.open = true;
    details._ouvertAuDepart = !!ouvert;
    details._titre = normaliserRecherche(ch.titre + " " + (ch.description || ""));
    details._elements = elements;
    details._vide = !res.length;
    return details;
  });
  // les chapitres dans l'ordre, puis les activités
  for (const b of blocs) if (!b.classList.contains("activites")) zone.append(b);
  for (const b of blocs) if (b.classList.contains("activites")) zone.append(b);
  const blocsDansLOrdre = [...zone.querySelectorAll(":scope > .chapitre")];

  // ----- Pastilles de navigation : une par chapitre, toujours visibles -----
  const listePastilles = el("div", { class: "pastilles-liste" });
  const titrePastilles = el("p", { class: "pastilles-titre", "aria-hidden": "true" });
  const pastilles = el("nav", { class: "pastilles", "aria-label": "Aller au chapitre" }, listePastilles, titrePastilles);
  sections.forEach((s, i) => {
    const b = blocs[i];
    const { num, nom } = decouperChapitre(s.ch.titre, s.pastille);
    const p = el("a", { href: "#" + s.id, class: "pastille" + (b._vide ? " vide" : "") + (s.classe ? " " + s.classe : "") + (s.enCours ? " en-cours" : ""),
      "aria-label": s.ch.titre + (s.enCours ? " (en ce moment en classe)" : "") }, s.pastille);
    p._libelle = (s.classe ? "" : num + " · ") + nom;
    p.addEventListener("click", e => { e.preventDefault(); allerA(b); history.replaceState(null, "", "#" + s.id); });
    // au survol ou au focus, le titre du chapitre s'affiche sous les pastilles
    p.addEventListener("mouseenter", () => { titrePastilles.textContent = p._libelle; });
    p.addEventListener("focus", () => { titrePastilles.textContent = p._libelle; });
    p.addEventListener("mouseleave", () => marquer());
    p.addEventListener("blur", () => marquer());
    b._pastille = p;
    listePastilles.append(p);
  });
  recherche.after(pastilles);
  // fondu sur le bord quand la rangée de pastilles dépasse de l'écran
  const bordPastilles = () => {
    const l = listePastilles;
    l.classList.toggle("deborde-droite", l.scrollLeft + l.clientWidth < l.scrollWidth - 4);
  };
  listePastilles.addEventListener("scroll", bordPastilles, { passive: true });
  addEventListener("resize", bordPastilles);

  function allerA(b) {
    if (b.hidden) { recherche.value = ""; filtrer(); }
    b.open = true;
    b.scrollIntoView({ behavior: DEFILEMENT, block: "start" });
  }

  // Pastille du chapitre visible à l'écran
  let dernier = null;
  const marquer = () => {
    const haut = pastilles.getBoundingClientRect().bottom + 8;
    let courant = blocsDansLOrdre.find(b => !b.hidden);
    for (const b of blocsDansLOrdre) if (!b.hidden && b.getBoundingClientRect().top <= haut + 40) courant = b;
    // tout en bas de la page, les derniers blocs ne peuvent pas remonter jusqu'en haut : on prend le dernier visible
    if (scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2)
      for (const b of blocsDansLOrdre) if (!b.hidden && b.getBoundingClientRect().top < innerHeight - 80) courant = b;
    for (const b of blocs) {
      b._pastille.classList.toggle("actif", b === courant);
      if (b === courant) b._pastille.setAttribute("aria-current", "true"); else b._pastille.removeAttribute("aria-current");
    }
    if (courant) {
      titrePastilles.textContent = courant._pastille._libelle;
      if (courant !== dernier) {
        // la pastille active reste visible dans la rangée
        const p = courant._pastille, l = listePastilles;
        if (p.offsetLeft < l.scrollLeft || p.offsetLeft + p.offsetWidth > l.scrollLeft + l.clientWidth)
          l.scrollTo({ left: p.offsetLeft - l.clientWidth / 2 + p.offsetWidth / 2, behavior: DEFILEMENT });
        dernier = courant;
      }
    }
    bordPastilles();
  };
  addEventListener("scroll", marquer, { passive: true });

  // Lien direct vers un chapitre : niveau.html?n=6e#ch3
  const cible = blocs.find(b => "#" + b.id === location.hash);
  if (cible) { cible.open = true; setTimeout(() => cible.scrollIntoView({ block: "start" }), 50); }
  addEventListener("hashchange", () => { const b = blocs.find(b => "#" + b.id === location.hash); if (b) allerA(b); });

  // ----- Recherche : on n'affiche que les ressources qui correspondent -----
  function filtrer() {
    const mots = normaliserRecherche(recherche.value).split(/\s+/).filter(Boolean);
    const trouve = t => mots.every(m => t.includes(m));
    for (const b of blocs) {
      if (!mots.length) {
        b.hidden = false;
        b.open = b._ouvertAuDepart;
        for (const e of b._elements) e.hidden = false;
      } else if (trouve(b._titre)) {
        b.hidden = false; b.open = true; // le chapitre lui-même correspond : on montre tout
        for (const e of b._elements) e.hidden = false;
      } else {
        let n = 0;
        for (const e of b._elements) { e.hidden = !trouve(e.dataset.texte); if (!e.hidden) n++; }
        b.hidden = n === 0;
        b.open = n > 0;
      }
      // groupes de fiches : ouverts s'ils contiennent un résultat, masqués sinon ; sous-parties vides masquées
      for (const g of b.querySelectorAll(".groupe-fiches")) {
        const n = [...g.querySelectorAll("[data-texte]")].filter(e => !e.hidden).length;
        g.hidden = n === 0;
        g.open = mots.length > 0 && n > 0 && !trouve(b._titre);
      }
      for (const sp of b.querySelectorAll(".sous-partie")) sp.hidden = ![...sp.querySelectorAll("[data-texte]")].some(e => !e.hidden);
      b._pastille.classList.toggle("masquee", b.hidden);
    }
    const aucun = mots.length && blocs.every(b => b.hidden);
    document.getElementById("aucun-resultat").hidden = !aucun;
    marquer();
  }
  zone.append(el("p", { class: "vide-niveau", id: "aucun-resultat", hidden: "" }, "Aucun résultat. Essaie un autre mot (par exemple « fraction », « symétrie », « vidéo »)."));
  recherche.addEventListener("input", filtrer);

  // ----- Bouton « Haut de page » -----
  const haut = el("button", { class: "haut-de-page", type: "button", "aria-label": "Revenir en haut de la page", hidden: "" },
    "↑", el("span", {}, " Haut de page"));
  haut.addEventListener("click", () => scrollTo({ top: 0, behavior: DEFILEMENT }));
  addEventListener("scroll", () => { haut.hidden = scrollY < 500; }, { passive: true });
  document.body.append(haut);

  marquer();
  piedDePage();
}

/* Une ressource : une ligne entièrement cliquable, avec « Télécharger » et « Correction » à part */
function carteRessource(r) {
  const t = TYPES[r.type] || TYPES.lien;
  const href = r.fichier || r.lien || "#";
  const estPdf = !!r.fichier;
  const interne = r.type === "activite";
  const nouvelOnglet = !interne;
  const sousTitre = r.detail || (estPdf ? "PDF · nouvel onglet"
    : interne ? "Lancer l'activité" : "Ouvrir le lien · nouvel onglet");
  const carte = el("div", { class: "ressource t-" + (TYPES[r.type] ? r.type : "lien") },
    el("span", { class: "tuile" }, icone(TYPES[r.type] ? r.type : "lien")),
    el("a", { class: "texte", href, ...(nouvelOnglet ? { target: "_blank", rel: "noopener" } : {}),
      title: r.titre || t.libelle },
      el("strong", {}, titreAffiche(r)),
      el("span", {}, sousTitre),
      nouvelOnglet ? el("span", { class: "invisible" }, " (s'ouvre dans un nouvel onglet)") : null)
  );
  const idCorr = idYoutube(r.correction);
  if (idCorr) {
    const libelle = r.correctionTitre || "Correction en vidéo";
    carte.append(el("button", {
      class: "btn-correction", type: "button",
      onclick: () => ouvrirVideo(idCorr, (r.titre || t.libelle) + " — " + libelle)
    }, icone("video"), libelle));
  }
  if (estPdf) carte.append(el("a", { class: "telecharger bouton-icone", href, download: "",
    "aria-label": "Télécharger : " + (r.titre || t.libelle) + " (PDF)", title: "Télécharger le PDF" }, icone("telecharger")));
  return carte;
}

/* L'exerciseur (bouton principal) et « Je me teste » (bouton secondaire) */
function carteAction(r) {
  const test = r.type === "test";
  return el("a", { class: "action-chapitre " + (test ? "secondaire t-test" : "principale t-exerciseur"), href: r.lien || "#" },
    el("span", { class: "tuile" }, icone(r.type)),
    el("span", { class: "texte" },
      el("strong", {}, titreAffiche(r)),
      el("span", {}, r.detail || (test ? "Un test sur tout le chapitre, puis ton bilan" : "Exerciseur en ligne, corrigé tout de suite"))),
    el("span", { class: "fleche", "aria-hidden": "true" }, "→"));
}

function carteVideo(v) {
  const id = idYoutube(v.lien);
  const titre = titreAffiche(v);
  const legende = el("figcaption", {}, titre);
  if (!id) {
    return el("div", { class: "video" }, el("figure", {},
      el("div", { class: "vide" }, "Collez le lien YouTube de la vidéo dans contenu.js"), legende));
  }
  const cadre = el("div", { class: "cadre", role: "button", tabindex: "0", "aria-label": "Lire la vidéo : " + titre },
    el("img", { src: "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg", alt: "", loading: "lazy" }),
    el("span", { class: "play" }, icone("video"))
  );
  let lancee = false;
  const lancer = () => {
    if (lancee) return;
    lancee = true;
    const f = el("iframe", {
      src: "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0",
      title: v.titre || "Vidéo",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowfullscreen: ""
    });
    cadre.removeAttribute("role"); cadre.removeAttribute("tabindex");
    cadre.style.cursor = "default";
    cadre.replaceChildren(f);
  };
  cadre.addEventListener("click", lancer);
  cadre.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); lancer(); } });
  return el("div", { class: "video" }, el("figure", {}, cadre, legende));
}

/* ---------- Lecteur vidéo en surimpression ---------- */
let lecteur = null;
function ouvrirVideo(id, titre) {
  if (!lecteur) {
    const titreEl = el("strong", {});
    const cadre = el("div", { class: "lecteur-cadre" });
    const fermer = el("button", { class: "lecteur-fermer", type: "button", "aria-label": "Fermer" }, "✕");
    lecteur = el("dialog", { class: "lecteur" },
      el("div", { class: "lecteur-tete" }, titreEl, fermer), cadre);
    lecteur._titre = titreEl; lecteur._cadre = cadre;
    fermer.addEventListener("click", () => lecteur.close());
    lecteur.addEventListener("click", e => { if (e.target === lecteur) lecteur.close(); });
    lecteur.addEventListener("close", () => cadre.replaceChildren());
    document.body.append(lecteur);
  }
  lecteur._titre.textContent = titre;
  lecteur._cadre.replaceChildren(el("iframe", {
    src: "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0",
    title: titre,
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    allowfullscreen: ""
  }));
  lecteur.showModal();
}
