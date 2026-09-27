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

   Vidéo de correction d'une fiche : ajoutez à la fin de sa ligne
     correction: "https://youtu.be/..."
   → un bouton « Correction en vidéo » apparaît sous la fiche.

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
        titre: "Chapitre 1 — Les nombres entiers",
        ressources: [
        ]
      },
      {
        titre: "Chapitre 2 — Droites, Médiatrices et symétrie",
        ressources: [
          { type: "cours",     titre: "Cours — Droites, Médiatrices et symétrie",                    fichier: "pdf/6e/ch2-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Vocabulaire, notations et milieu",  fichier: "pdf/6e/ch2-exercices-1.pdf", correction: "https://youtu.be/h8VQU_azEbo" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Perpendiculaires et parallèles",   fichier: "pdf/6e/ch2-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Médiatrice et démonstration",      fichier: "pdf/6e/ch2-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : La symétrie axiale",               fichier: "pdf/6e/ch2-exercices-4.pdf" }
        ]
      },
      {
        titre: "Chapitre 3 — Fractions et partage",
        ressources: [
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
