/* =====================================================================
   CONTENU DU SITE — c'est le SEUL fichier à modifier pour ajouter
   un cours, une fiche d'exercices ou une vidéo.

   Pour ajouter une ressource dans un chapitre, copiez une ligne comme :
     { type: "cours", titre: "Cours", fichier: "pdf/6e/mon-cours.pdf" },
   et changez le titre et le nom du fichier.

   Types possibles :
     "cours"      → un PDF de cours
     "exercices"  → une fiche d'exercices (PDF)
     "corrige"    → un corrigé (PDF)
     "video"      → une vidéo YouTube : mettre  lien: "https://www.youtube.com/watch?v=..."
     "lien"       → un autre site :     mettre  lien: "https://..."

   Attention : chaque ligne se termine par une virgule, et les textes
   sont entre guillemets "comme ceci".
   ===================================================================== */

const SITE = {
  titre: "Maths avec M. Leclerc",
  sousTitre: "Cours, fiches d'exercices et vidéos pour le collège",
  message: "Choisissez votre niveau pour retrouver les cours, les exercices et les vidéos de chaque chapitre."
};

const NIVEAUX = {

  "6e": {
    nom: "Sixième",
    chapitres: [
      {
        titre: "Chapitre 1 — Exemple de chapitre",
        description: "Ce chapitre montre à quoi ressemble une page. Remplacez-le par vos vrais chapitres.",
        ressources: [
          { type: "cours",     titre: "Cours (exemple)",              fichier: "pdf/6e/exemple-cours.pdf" },
          { type: "exercices", titre: "Fiche d'exercices (exemple)",  fichier: "pdf/6e/exemple-exercices.pdf" },
          { type: "video",     titre: "Vidéo du chapitre",            lien: "" }
        ]
      }
    ]
  },

  "5e": {
    nom: "Cinquième",
    chapitres: []
  },

  "4e": {
    nom: "Quatrième",
    chapitres: []
  },

  "3e": {
    nom: "Troisième",
    chapitres: []
  }

};
