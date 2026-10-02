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
     "exerciseur" → un exerciseur en ligne du site : mettre  lien: "exerciseurs/..."
     "activite"   → une activité interactive : mettre  lien: "activites/6e/..."

   Section « Activités » d'un niveau (en haut de la page, hors chapitres) :
   déposez l'activité dans le dossier activites/6e/ (un fichier .html, ou un
   dossier contenant un index.html), puis ajoutez une ligne dans « activites » :
     { type: "activite", titre: "Mon activité", lien: "activites/6e/mon-activite.html" },

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
    activites: [
    ],
    chapitres: [
      {
        titre: "Chapitre 1 — Les nombres entiers",
        ressources: [
          { type: "cours",     titre: "Cours — Les nombres entiers",                                fichier: "pdf/6e/ch1-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Lire, écrire et décomposer",       fichier: "pdf/6e/ch1-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Comparer, ranger, intercaler",     fichier: "pdf/6e/ch1-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : La demi-droite graduée",           fichier: "pdf/6e/ch1-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Résoudre des problèmes",           fichier: "pdf/6e/ch1-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : La division euclidienne",          fichier: "pdf/6e/ch1-exercices-5.pdf" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les nombres entiers",           lien: "exerciseurs/nombres-entiers-6e/" }
        ]
      },
      {
        titre: "Chapitre 2 — Droites, Médiatrices et symétrie",
        ressources: [
          { type: "cours",     titre: "Cours — Droites, Médiatrices et symétrie",                    fichier: "pdf/6e/ch2-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Vocabulaire, notations et milieu",  fichier: "pdf/6e/ch2-exercices-1.pdf", correction: "https://youtu.be/h8VQU_azEbo" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Perpendiculaires et parallèles",   fichier: "pdf/6e/ch2-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Médiatrice et démonstration",      fichier: "pdf/6e/ch2-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : La symétrie axiale",               fichier: "pdf/6e/ch2-exercices-4.pdf" },
          { type: "video",     titre: "Vidéo — Construire des perpendiculaires et des parallèles",  lien: "https://youtu.be/wzWZq0QiLlU" },
          { type: "video",     titre: "Vidéo — La symétrie axiale",                                 lien: "https://www.youtube.com/watch?v=comZ5rHHkS0" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les droites et la symétrie",    lien: "exerciseurs/droites-symetrie-6e/" }
        ]
      },
      {
        titre: "Chapitre 3 — Fractions et partage",
        ressources: [
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les fractions", lien: "exerciseurs/fractions-6e/" }
        ]
      },
      {
        titre: "Chapitre 4 — Proportionnalité",
        ressources: [
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur la proportionnalité", lien: "exerciseurs/proportionnalite-6e/" }
        ]
      },
      {
        titre: "Chapitre 5 — Angles",
        ressources: [
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les angles", lien: "exerciseurs/angles-6e/" }
        ]
      },
      {
        titre: "Chapitre 6 — Nombres décimaux",
        ressources: [
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les nombres décimaux", lien: "exerciseurs/decimaux-6e/" }
        ]
      },
      {
        titre: "Chapitre 7 — Cercles et disques",
        ressources: [
        ]
      },
      {
        titre: "Chapitre 8 — Opérations sur les nombres décimaux",
        ressources: [
        ]
      },
      {
        titre: "Chapitre 9 — Triangles",
        ressources: [
        ]
      },
      {
        titre: "Chapitre 10 — Fraction quotient",
        ressources: [
        ]
      },
      {
        titre: "Chapitre 11 — Probabilités",
        ressources: [
        ]
      },
      {
        titre: "Chapitre 12 — Repérage dans le temps",
        ressources: [
        ]
      },
      {
        titre: "Chapitre 13 — Aires et volumes",
        ressources: [
        ]
      },
      {
        titre: "Chapitre 14 — Statistiques",
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
