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
     "test"       → le test « Je me teste » d'un exerciseur, affiché dans « Se tester » :
                    mettre  lien: "exerciseurs/.../#je-me-teste"  (et  detail: "…" pour le sous-titre)

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
      { type: "activite", titre: "Résolution de problèmes — Équivalences", lien: "activites/6e/equivalences/" },
      { type: "activite", titre: "Les triominos des écritures décimales", lien: "activites/6e/triominos/" }
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
          { type: "cours",     titre: "Cours — Fractions et partage",                                fichier: "pdf/6e/ch3-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Fractions et partage de surfaces",  fichier: "pdf/6e/ch3-exercices-1.pdf", correction: "https://youtu.be/StCESByUlJg" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Fractions de longueurs et de grandeurs", fichier: "pdf/6e/ch3-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Égalités de fractions",             fichier: "pdf/6e/ch3-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Fractions d'une quantité",          fichier: "pdf/6e/ch3-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Pourcentages simples et fractions", fichier: "pdf/6e/ch3-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Fractions sur une demi-droite graduée", fichier: "pdf/6e/ch3-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Additionner et soustraire des fractions", fichier: "pdf/6e/ch3-exercices-7.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°8 : Problèmes de fraction restante",   fichier: "pdf/6e/ch3-exercices-8.pdf" },
          { type: "video",     titre: "Vidéo — Comprendre une fraction",                             lien: "https://www.youtube.com/watch?v=SdMpLup_zgk" },
          { type: "video",     titre: "Vidéo — Fraction d'une grandeur",                             lien: "https://www.youtube.com/watch?v=8mmIgYtxUCY" },
          { type: "video",     titre: "Vidéo — Fractions égales",                                    lien: "https://www.youtube.com/watch?v=Q2Wu3A9cWbI" },
          { type: "video",     titre: "Vidéo — Pourcentages",                                        lien: "https://www.youtube.com/watch?v=2Oxn5MHV1Bo" },
          { type: "video",     titre: "Vidéo — Fractions sur une demi-droite graduée",               lien: "https://www.youtube.com/watch?v=1y_zYfl0uZg" },
          { type: "video",     titre: "Vidéo — Additionner et soustraire des fractions",             lien: "https://www.youtube.com/watch?v=O6vJTgzxZX8" },
          { type: "test", titre: "Je me teste — Fractions", lien: "exerciseurs/fractions-6e/#je-me-teste", detail: "15 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les fractions", lien: "exerciseurs/fractions-6e/" }
        ]
      },
      {
        titre: "Chapitre 4 — Proportionnalité",
        ressources: [
          { type: "cours",     titre: "Cours — Proportionnalité",                                 fichier: "pdf/6e/ch4-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Proportionnel ou pas ?",         fichier: "pdf/6e/ch4-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Multiplier, diviser, additionner", fichier: "pdf/6e/ch4-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Le retour à l'unité",            fichier: "pdf/6e/ch4-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Résoudre des problèmes",         fichier: "pdf/6e/ch4-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Les échelles",                   fichier: "pdf/6e/ch4-exercices-5.pdf" },
          { type: "test", titre: "Je me teste — Proportionnalité", lien: "exerciseurs/proportionnalite-6e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur la proportionnalité", lien: "exerciseurs/proportionnalite-6e/" }
        ]
      },
      {
        titre: "Chapitre 5 — Angles",
        ressources: [
          { type: "cours",     titre: "Cours — Angles",                                           fichier: "pdf/6e/ch5-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Vocabulaire et notations",       fichier: "pdf/6e/ch5-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Mesurer un angle",               fichier: "pdf/6e/ch5-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Tracer un angle",                fichier: "pdf/6e/ch5-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Calculer la mesure d'un angle",  fichier: "pdf/6e/ch5-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : La bissectrice",                 fichier: "pdf/6e/ch5-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Construire une figure",          fichier: "pdf/6e/ch5-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Le diagramme circulaire",        fichier: "pdf/6e/ch5-exercices-7.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°8 : Problèmes",                      fichier: "pdf/6e/ch5-exercices-8.pdf" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les angles", lien: "exerciseurs/angles-6e/" }
        ]
      },
      {
        titre: "Chapitre 6 — Nombres décimaux",
        ressources: [
          { type: "cours",     titre: "Cours — Nombres décimaux",                                 fichier: "pdf/6e/ch6-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Valeur des chiffres et décompositions", fichier: "pdf/6e/ch6-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Fractions décimales et écriture à virgule", fichier: "pdf/6e/ch6-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Pourcentage et nombre mixte",    fichier: "pdf/6e/ch6-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Décimaux sur une demi-droite graduée", fichier: "pdf/6e/ch6-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Comparer, ranger, encadrer, intercaler", fichier: "pdf/6e/ch6-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Arrondir un nombre décimal",     fichier: "pdf/6e/ch6-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Problèmes bilan",                fichier: "pdf/6e/ch6-exercices-7.pdf" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les nombres décimaux", lien: "exerciseurs/decimaux-6e/" }
        ]
      },
      {
        titre: "Chapitre 7 — Cercles et disques",
        ressources: [
          { type: "cours",     titre: "Cours — Cercles et disques",                               fichier: "pdf/6e/ch7-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Cercle et disque",               fichier: "pdf/6e/ch7-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Programmes de construction",     fichier: "pdf/6e/ch7-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Périmètre : calculs",            fichier: "pdf/6e/ch7-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Périmètre : problèmes",          fichier: "pdf/6e/ch7-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Médiatrice d'un segment",        fichier: "pdf/6e/ch7-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Symétrique et bissectrice",      fichier: "pdf/6e/ch7-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Distances et régionnement",      fichier: "pdf/6e/ch7-exercices-7.pdf" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les cercles et les disques", lien: "exerciseurs/cercles-disques-6e/" }
        ]
      },
      {
        titre: "Chapitre 8 — Opérations sur les nombres décimaux",
        ressources: [
          { type: "cours",     titre: "Cours — Opérations sur les nombres décimaux",              fichier: "pdf/6e/ch8-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Additionner et soustraire",      fichier: "pdf/6e/ch8-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Multiplier des décimaux",        fichier: "pdf/6e/ch8-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Division décimale",              fichier: "pdf/6e/ch8-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Contrôler un résultat",          fichier: "pdf/6e/ch8-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Choisir l'opération",            fichier: "pdf/6e/ch8-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Problèmes à étapes",             fichier: "pdf/6e/ch8-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Valeur manquante",               fichier: "pdf/6e/ch8-exercices-7.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°8 : Approfondissement",              fichier: "pdf/6e/ch8-exercices-8.pdf" }
        ]
      },
      {
        titre: "Chapitre 9 — Triangles",
        ressources: [
          { type: "cours",     titre: "Cours — Triangles",                                     fichier: "pdf/6e/ch9-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Vocabulaire et codage",       fichier: "pdf/6e/ch9-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Construire avec trois longueurs", fichier: "pdf/6e/ch9-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Construire avec des angles",  fichier: "pdf/6e/ch9-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Triangles particuliers",      fichier: "pdf/6e/ch9-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Somme des angles : calculer", fichier: "pdf/6e/ch9-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Somme des angles : construire et raisonner", fichier: "pdf/6e/ch9-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Médiatrices et cercle circonscrit", fichier: "pdf/6e/ch9-exercices-7.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°8 : Bilan : triangles",           fichier: "pdf/6e/ch9-exercices-8.pdf" }
        ]
      },
      {
        titre: "Chapitre 10 — Fraction quotient",
        ressources: [
          { type: "cours",     titre: "Cours — Fraction quotient",                             fichier: "pdf/6e/ch10-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Fraction et division",        fichier: "pdf/6e/ch10-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Le quotient",                 fichier: "pdf/6e/ch10-exercices-2.pdf" }
        ]
      },
      {
        titre: "Chapitre 11 — Probabilités",
        ressources: [
          { type: "cours",     titre: "Cours — Probabilités",                                  fichier: "pdf/6e/ch11-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Expériences aléatoires et évènements", fichier: "pdf/6e/ch11-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : L'échelle des probabilités",  fichier: "pdf/6e/ch11-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Calculer une probabilité",    fichier: "pdf/6e/ch11-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Expériences à deux étapes",   fichier: "pdf/6e/ch11-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Fréquence et probabilité",    fichier: "pdf/6e/ch11-exercices-5.pdf" }
        ]
      },
      {
        titre: "Chapitre 12 — Repérage dans le temps",
        ressources: [
          { type: "cours",     titre: "Cours — Repérage dans le temps",                        fichier: "pdf/6e/ch12-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Lire l'heure, unités de durée", fichier: "pdf/6e/ch12-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Convertir des durées",        fichier: "pdf/6e/ch12-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Écriture décimale d'une durée", fichier: "pdf/6e/ch12-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Calculer avec des horaires et des durées", fichier: "pdf/6e/ch12-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Problèmes de durées",         fichier: "pdf/6e/ch12-exercices-5.pdf" }
        ]
      },
      {
        titre: "Chapitre 13 — Aires et volumes",
        ressources: [
          { type: "cours",     titre: "Cours — Aires et volumes",                              fichier: "pdf/6e/ch13-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Aires par comptage",          fichier: "pdf/6e/ch13-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Unités d'aire et conversions", fichier: "pdf/6e/ch13-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Aire du carré et du rectangle", fichier: "pdf/6e/ch13-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Problèmes d'aires",           fichier: "pdf/6e/ch13-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Vision dans l'espace",        fichier: "pdf/6e/ch13-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Volumes",                     fichier: "pdf/6e/ch13-exercices-6.pdf" }
        ]
      },
      {
        titre: "Chapitre 14 — Statistiques",
        ressources: [
          { type: "cours",     titre: "Cours — Statistiques",                                  fichier: "pdf/6e/ch14-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Recueillir et organiser des données", fichier: "pdf/6e/ch14-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Tableaux à double entrée",    fichier: "pdf/6e/ch14-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Construire et filtrer un tableau", fichier: "pdf/6e/ch14-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Diagrammes en barres",        fichier: "pdf/6e/ch14-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Diagrammes circulaires et études de cas", fichier: "pdf/6e/ch14-exercices-5.pdf" }
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
