/* Fonctionnement du site — pas besoin de modifier ce fichier. */

const TYPES = {
  cours:     { libelle: "Cours",             icone: "PDF" },
  exercices: { libelle: "Fiche d'exercices", icone: "EX" },
  corrige:   { libelle: "Corrigé",           icone: "✓" },
  video:     { libelle: "Vidéo",             icone: "▶" },
  lien:      { libelle: "Lien",              icone: "↗" },
  exerciseur:{ libelle: "Exerciseur",        icone: "✎" }
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

  const blocs = niv.chapitres.map((ch, i) => {
    const res = ch.ressources || [];
    const docs = res.filter(r => r.type !== "video");
    const vids = res.filter(r => r.type === "video");

    const corps = el("div", { class: "corps" });
    if (ch.description) corps.append(el("p", { class: "description" }, ch.description));

    if (docs.length) {
      const liste = el("div", { class: "ressources" });
      for (const r of docs) liste.append(carteRessource(r));
      corps.append(liste);
    }
    if (!docs.length && !vids.length) {
      corps.append(el("p", { class: "description" }, "Les documents de ce chapitre arrivent bientôt."));
    }
    if (vids.length) {
      const liste = el("div", { class: "videos" });
      for (const v of vids) liste.append(carteVideo(v));
      corps.append(liste);
    }

    const compte = [
      docs.length ? docs.length + " document" + (docs.length > 1 ? "s" : "") : null,
      vids.length ? vids.length + " vidéo" + (vids.length > 1 ? "s" : "") : null
    ].filter(Boolean).join(" · ") || "Bientôt";

    const details = el("details", { class: "chapitre" },
      el("summary", {},
        el("h2", {}, ch.titre),
        el("span", { class: "compte" }, compte),
        el("span", { class: "fleche", "aria-hidden": "true" }, "›")
      ),
      corps
    );
    if (i === 0) details.open = true; // premier chapitre ouvert
    details.dataset.texte = (ch.titre + " " + (ch.description || "") + " " + res.map(r => r.titre).join(" ")).toLowerCase();
    zone.append(details);
    return details;
  });

  recherche.addEventListener("input", () => {
    const q = recherche.value.trim().toLowerCase();
    for (const b of blocs) {
      const ok = !q || b.dataset.texte.includes(q);
      b.hidden = !ok;
      if (q && ok) b.open = true;
    }
  });

  piedDePage();
}

function carteRessource(r) {
  const t = TYPES[r.type] || TYPES.lien;
  const href = r.fichier || r.lien || "#";
  const estPdf = !!r.fichier;
  const estExerciseur = r.type === "exerciseur";
  const carte = el("div", { class: "ressource t-" + (TYPES[r.type] ? r.type : "lien") },
    el("span", { class: "icone", "aria-hidden": "true" }, t.icone),
    el("a", { class: "texte", href, target: estExerciseur ? "_self" : "_blank", rel: "noopener", style: "text-decoration:none" },
      el("strong", {}, r.titre || t.libelle),
      el("span", {}, estPdf ? "Ouvrir le PDF" : estExerciseur ? "S'entraîner en ligne" : "Ouvrir le lien")
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
