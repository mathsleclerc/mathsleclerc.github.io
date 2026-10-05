/* Fonctionnement du site — pas besoin de modifier ce fichier. */

const TYPES = {
  cours:     { libelle: "Cours",             icone: "PDF" },
  exercices: { libelle: "Fiche d'exercices", icone: "EX" },
  corrige:   { libelle: "Corrigé",           icone: "✓" },
  video:     { libelle: "Vidéo",             icone: "▶" },
  lien:      { libelle: "Lien",              icone: "↗" },
  exerciseur:{ libelle: "Exerciseur",        icone: "✎" },
  activite:  { libelle: "Activité",          icone: "★" }
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

function piedDePage() {
  const p = document.getElementById("pied");
  if (p) p.textContent = SITE.titre + " · " + new Date().getFullYear();
}

function idYoutube(lien) {
  if (!lien) return null;
  if (/^[\w-]{11}$/.test(lien)) return lien;
  const m = lien.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/* ---------- Accueil ---------- */
function pageAccueil() {
  document.getElementById("titre").textContent = SITE.titre;
  document.getElementById("sous-titre").textContent = SITE.sousTitre;
  document.getElementById("message").textContent = SITE.message;
  const grille = document.getElementById("grille");
  for (const [code, niv] of Object.entries(NIVEAUX)) {
    const n = niv.chapitres.length;
    grille.append(el("a", { class: "carte-niveau", href: "niveau.html?n=" + encodeURIComponent(code) },
      el("span", { class: "badge" }, code),
      el("h2", {}, niv.nom),
      el("p", {}, n === 0 ? "Bientôt disponible" : n + (n > 1 ? " chapitres" : " chapitre"))
    ));
  }
  piedDePage();
}

/* ---------- Page d'un niveau ---------- */
/* Texte sans accents ni majuscules, pour la recherche */
function normaliser(t) {
  return (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/* Sous-parties d'un chapitre : le cours, l'entraînement (exerciseur en premier), les vidéos */
const SOUS_PARTIES = [
  { titre: "Le cours", types: ["cours", "corrige"] },
  { titre: "S'entraîner", types: ["exerciseur", "exercices", "activite", "lien"] },
  { titre: "Vidéos", types: ["video"] }
];

function pageNiveau() {
  const code = new URLSearchParams(location.search).get("n") || Object.keys(NIVEAUX)[0];
  const niv = NIVEAUX[code];
  if (!niv) { location.href = "index.html"; return; }

  document.title = niv.nom + " — " + SITE.titre;
  document.getElementById("lien-accueil").textContent = "← " + SITE.titre;
  document.getElementById("titre-niveau").textContent = "Mathématiques — " + niv.nom;

  const nav = document.getElementById("nav");
  for (const c of Object.keys(NIVEAUX)) {
    nav.append(el("a", { href: "niveau.html?n=" + encodeURIComponent(c), class: c === code ? "actif" : "" }, c));
  }

  const zone = document.getElementById("chapitres");
  const recherche = document.getElementById("recherche");

  if (niv.chapitres.length === 0) {
    recherche.hidden = true;
    zone.append(el("div", { class: "vide-niveau" }, "Les chapitres de " + niv.nom.toLowerCase() + " arrivent bientôt."));
    piedDePage();
    return;
  }

  // Section « Activités » (hors chapitres), affichée en premier si le niveau en a une
  const sections = niv.chapitres.map((ch, i) => ({ ch, id: "ch" + (i + 1), pastille: String(i + 1), ouvert: i === 0 }));
  if (Array.isArray(niv.activites)) {
    sections.unshift({
      ch: { titre: "Activités", description: "Des activités interactives qui mélangent les notions de plusieurs chapitres.", ressources: niv.activites },
      id: "activites", pastille: "★", classe: "activites", vide: "Les activités arrivent bientôt."
    });
  }

  const blocs = sections.map(({ ch, id, ouvert, classe, vide }) => {
    const res = ch.ressources || [];
    const docs = res.filter(r => r.type !== "video");
    const vids = res.filter(r => r.type === "video");
    const elements = []; // chaque ressource affichée, pour la recherche

    const carte = r => {
      const e = r.type === "video" ? carteVideo(r) : carteRessource(r);
      e.dataset.texte = normaliser(r.titre + " " + (TYPES[r.type] || TYPES.lien).libelle);
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
        const liste = res.filter(r => sp.types.includes(r.type))
          .sort((a, b) => (b.type === "exerciseur") - (a.type === "exerciseur")); // l'exerciseur en premier
        if (!liste.length) continue;
        const fiches = liste.filter(r => r.type === "exercices");
        const autres = liste.filter(r => r.type !== "exercices");
        const section = el("section", { class: "sous-partie" }, el("h3", {}, sp.titre));
        if (autres.length) section.append(el("div", { class: sp.types.includes("video") ? "videos" : "ressources" }, ...autres.map(carte)));
        if (fiches.length) {
          // Les feuilles d'exercices sont regroupées dans un bloc qu'on déplie
          const groupe = el("details", { class: "groupe-fiches" },
            el("summary", {},
              el("span", { class: "groupe-icone", "aria-hidden": "true" }, "EX"),
              el("span", { class: "groupe-titre" }, "Feuilles d'exercices"),
              el("span", { class: "groupe-compte" }, fiches.length + (fiches.length > 1 ? " fiches" : " fiche")),
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

    const details = el("details", { class: "chapitre" + (classe ? " " + classe : ""), id },
      el("summary", {},
        el("h2", {}, ch.titre),
        el("span", { class: "compte" }, compte),
        el("span", { class: "fleche", "aria-hidden": "true" }, "›")
      ),
      corps
    );
    if (ouvert) details.open = true; // premier chapitre ouvert
    details._ouvertAuDepart = !!ouvert;
    details._titre = normaliser(ch.titre + " " + (ch.description || ""));
    details._elements = elements;
    details._vide = !res.length;
    zone.append(details);
    return details;
  });

  // ----- Pastilles de navigation : une par chapitre, toujours visibles -----
  const pastilles = el("nav", { class: "pastilles", "aria-label": "Aller au chapitre" });
  sections.forEach((s, i) => {
    const b = blocs[i];
    const p = el("a", { href: "#" + s.id, class: "pastille" + (b._vide ? " vide" : "") + (s.classe ? " " + s.classe : ""), title: s.ch.titre, "aria-label": s.ch.titre }, s.pastille);
    p.addEventListener("click", e => { e.preventDefault(); allerA(b); history.replaceState(null, "", "#" + s.id); });
    b._pastille = p;
    pastilles.append(p);
  });
  recherche.after(pastilles);

  function allerA(b) {
    if (b.hidden) { recherche.value = ""; filtrer(); }
    b.open = true;
    b.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Pastille du chapitre visible à l'écran
  const marquer = () => {
    const haut = pastilles.getBoundingClientRect().bottom + 8;
    let courant = blocs.find(b => !b.hidden);
    for (const b of blocs) if (!b.hidden && b.getBoundingClientRect().top <= haut + 40) courant = b;
    for (const b of blocs) b._pastille.classList.toggle("actif", b === courant);
  };
  addEventListener("scroll", marquer, { passive: true });

  // Lien direct vers un chapitre : niveau.html?n=6e#ch3
  const cible = blocs.find(b => "#" + b.id === location.hash);
  if (cible) { cible.open = true; setTimeout(() => cible.scrollIntoView({ block: "start" }), 50); }
  addEventListener("hashchange", () => { const b = blocs.find(b => "#" + b.id === location.hash); if (b) allerA(b); });

  // ----- Recherche : on n'affiche que les ressources qui correspondent -----
  function filtrer() {
    const mots = normaliser(recherche.value).split(/\s+/).filter(Boolean);
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
  haut.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  addEventListener("scroll", () => { haut.hidden = scrollY < 500; }, { passive: true });
  document.body.append(haut);

  marquer();
  piedDePage();
}

function carteRessource(r) {
  const t = TYPES[r.type] || TYPES.lien;
  const href = r.fichier || r.lien || "#";
  const estPdf = !!r.fichier;
  const estExerciseur = r.type === "exerciseur" || r.type === "activite";
  const carte = el("div", { class: "ressource t-" + (TYPES[r.type] ? r.type : "lien") },
    el("span", { class: "icone", "aria-hidden": "true" }, t.icone),
    el("a", { class: "texte", href, target: estExerciseur ? "_self" : "_blank", rel: "noopener", style: "text-decoration:none" },
      el("strong", {}, r.titre || t.libelle),
      el("span", {}, estPdf ? "Ouvrir le PDF" : r.type === "activite" ? "Lancer l'activité" : estExerciseur ? "S'entraîner en ligne" : "Ouvrir le lien")
    ),
    estPdf ? el("a", { class: "telecharger", href, download: "" }, "Télécharger") : null
  );
  const idCorr = idYoutube(r.correction);
  if (idCorr) {
    const libelle = r.correctionTitre || "Correction en vidéo";
    carte.append(el("button", {
      class: "btn-video", type: "button",
      onclick: () => ouvrirVideo(idCorr, (r.titre || t.libelle) + " — " + libelle)
    }, el("span", { class: "btn-video-icone", "aria-hidden": "true" }), libelle));
  }
  return carte;
}

function carteVideo(v) {
  const id = idYoutube(v.lien);
  const legende = el("figcaption", {}, v.titre || "Vidéo");
  if (!id) {
    return el("div", { class: "video" }, el("figure", {},
      el("div", { class: "vide" }, "Collez le lien YouTube de la vidéo dans contenu.js"), legende));
  }
  const cadre = el("div", { class: "cadre", role: "button", tabindex: "0", "aria-label": "Lire la vidéo : " + (v.titre || "") },
    el("img", { src: "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg", alt: "", loading: "lazy" }),
    el("span", { class: "play" })
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
