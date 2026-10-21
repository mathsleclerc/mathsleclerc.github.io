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
   → un bouton « Correction en vidéo » apparaît à côté de la fiche.

   Chapitre étudié en ce moment en classe : ajoutez sous son titre
     enCours: true,
   → il s'ouvre tout seul sur la page du niveau, avec l'étiquette
     « En ce moment en classe ». Un seul chapitre par niveau ; pensez à
     déplacer la ligne quand vous changez de chapitre.

   Attention : chaque ligne se termine par une virgule, et les textes
   sont entre guillemets "comme ceci".
   ===================================================================== */

const SITE = {
  titre: "Maths avec M. Leclerc",
  sousTitre: "Cours, fiches d'exercices et vidéos pour le collège",
  message: "Choisis ton niveau pour retrouver les cours, les exercices et les vidéos de chaque chapitre.",
  // Ligne affichée au-dessus du titre, sur la page d'accueil
  presentation: "Le site des élèves de M. Leclerc, professeur de mathématiques",
  // Nom du collège, affiché dans le pied de page (laisser "" pour ne rien afficher)
  college: "",
  // Phrase de contact du pied de page (laisser "" pour ne rien afficher)
  contact: ""
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
        enCours: true,
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
          { type: "exercices", titre: "Feuille d'exercices n°8 : Approfondissement",              fichier: "pdf/6e/ch8-exercices-8.pdf" },
          { type: "test", titre: "Je me teste — Opérations", lien: "exerciseurs/operations-6e/#je-me-teste", detail: "18 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les opérations", lien: "exerciseurs/operations-6e/" }
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
          { type: "exercices", titre: "Feuille d'exercices n°8 : Bilan : triangles",           fichier: "pdf/6e/ch9-exercices-8.pdf" },
          { type: "test", titre: "Je me teste — Triangles", lien: "exerciseurs/triangles-6e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les triangles", lien: "exerciseurs/triangles-6e/" }
        ]
      },
      {
        titre: "Chapitre 10 — Fraction quotient",
        ressources: [
          { type: "cours",     titre: "Cours — Fraction quotient",                             fichier: "pdf/6e/ch10-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Fraction et division",        fichier: "pdf/6e/ch10-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Le quotient",                 fichier: "pdf/6e/ch10-exercices-2.pdf" },
          { type: "test", titre: "Je me teste — Fraction quotient", lien: "exerciseurs/fraction-quotient-6e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur la fraction quotient", lien: "exerciseurs/fraction-quotient-6e/" }
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
          { type: "exercices", titre: "Feuille d'exercices n°5 : Fréquence et probabilité",    fichier: "pdf/6e/ch11-exercices-5.pdf" },
          { type: "test", titre: "Je me teste — Probabilités", lien: "exerciseurs/probabilites-6e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les probabilités", lien: "exerciseurs/probabilites-6e/" }
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
          { type: "exercices", titre: "Feuille d'exercices n°5 : Problèmes de durées",         fichier: "pdf/6e/ch12-exercices-5.pdf" },
          { type: "test", titre: "Je me teste — Repérage dans le temps", lien: "exerciseurs/temps-6e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les durées", lien: "exerciseurs/temps-6e/" }
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
          { type: "exercices", titre: "Feuille d'exercices n°6 : Volumes",                     fichier: "pdf/6e/ch13-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Aires et volumes", lien: "exerciseurs/aires-volumes-6e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les aires et les volumes", lien: "exerciseurs/aires-volumes-6e/" }
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
          { type: "exercices", titre: "Feuille d'exercices n°5 : Diagrammes circulaires et études de cas", fichier: "pdf/6e/ch14-exercices-5.pdf" },
          { type: "test", titre: "Je me teste — Statistiques", lien: "exerciseurs/statistiques-6e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner sur les statistiques", lien: "exerciseurs/statistiques-6e/" }
        ]
      }
    ]
  },

  "5e": {
    nom: "Cinquième",
    chapitres: [
      {
        titre: "Chapitre 1 — Enchaînements d'opérations",
        ressources: [
          { type: "cours",     titre: "Cours — Enchaînements d'opérations", fichier: "pdf/5e/ch1-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Vocabulaire et sens des opérations", fichier: "pdf/5e/ch1-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Priorités opératoires", fichier: "pdf/5e/ch1-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Parenthèses et nature d'une expression", fichier: "pdf/5e/ch1-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Traduire par une seule expression", fichier: "pdf/5e/ch1-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Distributivité et calcul astucieux", fichier: "pdf/5e/ch1-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Résoudre des problèmes", fichier: "pdf/5e/ch1-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Durées et horaires", fichier: "pdf/5e/ch1-exercices-7.pdf" },
          { type: "test", titre: "Je me teste — Enchaînements d'opérations", lien: "exerciseurs/enchainements-5e/#je-me-teste", detail: "13 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : enchaînements d'opérations", lien: "exerciseurs/enchainements-5e/" }
        ]
      },
      {
        titre: "Chapitre 2 — La symétrie centrale",
        ressources: [
          { type: "cours",     titre: "Cours — La symétrie centrale", fichier: "pdf/5e/ch2-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Reconnaître une symétrie centrale", fichier: "pdf/5e/ch2-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Construire sur quadrillage", fichier: "pdf/5e/ch2-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Construire sur papier blanc", fichier: "pdf/5e/ch2-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Utiliser les propriétés", fichier: "pdf/5e/ch2-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Centres de symétrie, frises et rosaces", fichier: "pdf/5e/ch2-exercices-5.pdf" },
          { type: "test", titre: "Je me teste — La symétrie centrale", lien: "exerciseurs/symetrie-centrale-5e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : la symétrie centrale", lien: "exerciseurs/symetrie-centrale-5e/" }
        ]
      },
      {
        titre: "Chapitre 3 — Fractions et divisibilité",
        ressources: [
          { type: "cours",     titre: "Cours — Fractions et divisibilité", fichier: "pdf/5e/ch3-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Multiples, diviseurs et critères", fichier: "pdf/5e/ch3-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Nombres premiers et décomposition", fichier: "pdf/5e/ch3-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Diviser par un nombre décimal", fichier: "pdf/5e/ch3-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Fractions égales et simplification", fichier: "pdf/5e/ch3-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Comparer des fractions", fichier: "pdf/5e/ch3-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Additionner et soustraire des fractions", fichier: "pdf/5e/ch3-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Résoudre des problèmes", fichier: "pdf/5e/ch3-exercices-7.pdf" },
          { type: "test", titre: "Je me teste — Fractions et divisibilité", lien: "exerciseurs/fractions-5e/#je-me-teste", detail: "14 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : fractions et divisibilité", lien: "exerciseurs/fractions-5e/" }
        ]
      },
      {
        titre: "Chapitre 4 — Angles et parallélisme",
        ressources: [
          { type: "cours",     titre: "Cours — Angles et parallélisme", fichier: "pdf/5e/ch4-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Angles particuliers", fichier: "pdf/5e/ch4-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Alternes-internes et correspondants", fichier: "pdf/5e/ch4-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Angles et droites parallèles", fichier: "pdf/5e/ch4-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : La somme des angles d'un triangle", fichier: "pdf/5e/ch4-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Construire des triangles", fichier: "pdf/5e/ch4-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Démontrer avec les angles", fichier: "pdf/5e/ch4-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Angles et parallélisme", lien: "exerciseurs/angles-paralleles-5e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : angles et parallélisme", lien: "exerciseurs/angles-paralleles-5e/" }
        ]
      },
      {
        titre: "Chapitre 5 — Nombres relatifs et repérage",
        ressources: [
          { type: "cours",     titre: "Cours — Nombres relatifs et repérage", fichier: "pdf/5e/ch5-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Découvrir les nombres relatifs", fichier: "pdf/5e/ch5-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : La droite graduée", fichier: "pdf/5e/ch5-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Repérage dans le plan", fichier: "pdf/5e/ch5-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Comparer et ranger", fichier: "pdf/5e/ch5-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Additionner des relatifs", fichier: "pdf/5e/ch5-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Soustraire des relatifs", fichier: "pdf/5e/ch5-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Enchaîner les calculs, problèmes", fichier: "pdf/5e/ch5-exercices-7.pdf" },
          { type: "test", titre: "Je me teste — Nombres relatifs et repérage", lien: "exerciseurs/relatifs-5e/#je-me-teste", detail: "14 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : nombres relatifs et repérage", lien: "exerciseurs/relatifs-5e/" }
        ]
      },
      {
        titre: "Chapitre 6 — Triangles : droites remarquables et aire",
        ressources: [
          { type: "cours",     titre: "Cours — Triangles : droites remarquables et aire", fichier: "pdf/5e/ch6-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Médiatrices et cercle circonscrit", fichier: "pdf/5e/ch6-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Les hauteurs", fichier: "pdf/5e/ch6-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Les médianes", fichier: "pdf/5e/ch6-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Aire d'un triangle", fichier: "pdf/5e/ch6-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Aires : figures composées et médiane", fichier: "pdf/5e/ch6-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Triangles particuliers et synthèse", fichier: "pdf/5e/ch6-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Triangles : droites remarquables et aire", lien: "exerciseurs/triangles-5e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : triangles : droites remarquables et aire", lien: "exerciseurs/triangles-5e/" }
        ]
      },
      {
        titre: "Chapitre 7 — Calcul littéral et puissances",
        ressources: [
          { type: "cours",     titre: "Cours — Calcul littéral et puissances", fichier: "pdf/5e/ch7-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Écrire avec des lettres", fichier: "pdf/5e/ch7-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Carrés et cubes", fichier: "pdf/5e/ch7-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Calculer la valeur d'une expression", fichier: "pdf/5e/ch7-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Tester une égalité, somme ou produit", fichier: "pdf/5e/ch7-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Réduire une expression", fichier: "pdf/5e/ch7-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Développer et factoriser", fichier: "pdf/5e/ch7-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Motifs et formules", fichier: "pdf/5e/ch7-exercices-7.pdf" },
          { type: "test", titre: "Je me teste — Calcul littéral et puissances", lien: "exerciseurs/calcul-litteral-5e/#je-me-teste", detail: "14 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : calcul littéral et puissances", lien: "exerciseurs/calcul-litteral-5e/" }
        ]
      },
      {
        titre: "Chapitre 8 — Parallélogrammes",
        ressources: [
          { type: "cours",     titre: "Cours — Parallélogrammes", fichier: "pdf/5e/ch8-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Définition et vocabulaire", fichier: "pdf/5e/ch8-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Propriétés du parallélogramme", fichier: "pdf/5e/ch8-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Construire des parallélogrammes", fichier: "pdf/5e/ch8-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Reconnaître un parallélogramme", fichier: "pdf/5e/ch8-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Rectangle, losange, carré", fichier: "pdf/5e/ch8-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Aires et figures complexes", fichier: "pdf/5e/ch8-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Conversions et problèmes", fichier: "pdf/5e/ch8-exercices-7.pdf" },
          { type: "test", titre: "Je me teste — Parallélogrammes", lien: "exerciseurs/parallelogrammes-5e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : parallélogrammes", lien: "exerciseurs/parallelogrammes-5e/" }
        ]
      },
      {
        titre: "Chapitre 9 — Proportionnalité",
        ressources: [
          { type: "cours",     titre: "Cours — Proportionnalité", fichier: "pdf/5e/ch9-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Reconnaître la proportionnalité", fichier: "pdf/5e/ch9-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Calculer une quatrième proportionnelle", fichier: "pdf/5e/ch9-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Pourcentages", fichier: "pdf/5e/ch9-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Vitesses et échelles", fichier: "pdf/5e/ch9-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Représentation graphique", fichier: "pdf/5e/ch9-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Partager selon un ratio", fichier: "pdf/5e/ch9-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Résoudre des problèmes", fichier: "pdf/5e/ch9-exercices-7.pdf" },
          { type: "test", titre: "Je me teste — Proportionnalité", lien: "exerciseurs/proportionnalite-5e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : proportionnalité", lien: "exerciseurs/proportionnalite-5e/" }
        ]
      },
      {
        titre: "Chapitre 10 — Statistiques",
        ressources: [
          { type: "cours",     titre: "Cours — Statistiques", fichier: "pdf/5e/ch10-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Recueillir et organiser", fichier: "pdf/5e/ch10-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Effectifs et fréquences", fichier: "pdf/5e/ch10-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Diagrammes en barres et circulaires", fichier: "pdf/5e/ch10-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Histogrammes et graphiques", fichier: "pdf/5e/ch10-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : La moyenne", fichier: "pdf/5e/ch10-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Interpréter et critiquer", fichier: "pdf/5e/ch10-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Statistiques", lien: "exerciseurs/statistiques-5e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : statistiques", lien: "exerciseurs/statistiques-5e/" }
        ]
      },
      {
        titre: "Chapitre 11 — Calcul littéral : raisonner et résoudre",
        ressources: [
          { type: "cours",     titre: "Cours — Calcul littéral : raisonner et résoudre", fichier: "pdf/5e/ch11-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Démontrer avec des lettres", fichier: "pdf/5e/ch11-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Contre-exemples et conjectures", fichier: "pdf/5e/ch11-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Tester une solution", fichier: "pdf/5e/ch11-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Résoudre des équations", fichier: "pdf/5e/ch11-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Mettre un problème en équation", fichier: "pdf/5e/ch11-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Programmes et algorithmes", fichier: "pdf/5e/ch11-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Calcul littéral : raisonner et résoudre", lien: "exerciseurs/equations-5e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : calcul littéral : raisonner et résoudre", lien: "exerciseurs/equations-5e/" }
        ]
      },
      {
        titre: "Chapitre 12 — Solides et volumes",
        ressources: [
          { type: "cours",     titre: "Cours — Solides et volumes", fichier: "pdf/5e/ch12-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Solides et perspective", fichier: "pdf/5e/ch12-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Patrons", fichier: "pdf/5e/ch12-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Aire d'un disque", fichier: "pdf/5e/ch12-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Volumes et capacités", fichier: "pdf/5e/ch12-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Volume du pavé et du prisme", fichier: "pdf/5e/ch12-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Volume du cylindre, problèmes", fichier: "pdf/5e/ch12-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Solides et volumes", lien: "exerciseurs/solides-volumes-5e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : solides et volumes", lien: "exerciseurs/solides-volumes-5e/" }
        ]
      },
      {
        titre: "Chapitre 13 — Probabilités",
        ressources: [
          { type: "cours",     titre: "Cours — Probabilités", fichier: "pdf/5e/ch13-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Vocabulaire des probabilités", fichier: "pdf/5e/ch13-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : L'échelle des probabilités", fichier: "pdf/5e/ch13-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Calculer une probabilité", fichier: "pdf/5e/ch13-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Roues, urnes et jeux", fichier: "pdf/5e/ch13-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Fréquences et probabilités", fichier: "pdf/5e/ch13-exercices-5.pdf" },
          { type: "test", titre: "Je me teste — Probabilités", lien: "exerciseurs/probabilites-5e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : probabilités", lien: "exerciseurs/probabilites-5e/" }
        ]
      },
      {
        titre: "Chapitre 14 — Grandeurs en fonction l'une de l'autre",
        ressources: [
          { type: "cours",     titre: "Cours — Grandeurs en fonction l'une de l'autre", fichier: "pdf/5e/ch14-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : En fonction de…", fichier: "pdf/5e/ch14-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Tableaux de valeurs", fichier: "pdf/5e/ch14-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Construire un graphique", fichier: "pdf/5e/ch14-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Lire un graphique", fichier: "pdf/5e/ch14-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Graphique et proportionnalité", fichier: "pdf/5e/ch14-exercices-5.pdf" },
          { type: "test", titre: "Je me teste — Grandeurs en fonction l'une de l'autre", lien: "exerciseurs/fonctions-5e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : grandeurs en fonction l'une de l'autre", lien: "exerciseurs/fonctions-5e/" }
        ]
      }
    ]
  },

  "4e": {
    nom: "Quatrième",
    chapitres: [
      {
        titre: "Chapitre 1 — Proportionnalité",
        ressources: [
          { type: "cours",     titre: "Cours — Proportionnalité", fichier: "pdf/4e/ch1-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Reconnaître la proportionnalité", fichier: "pdf/4e/ch1-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Quatrième proportionnelle", fichier: "pdf/4e/ch1-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Vitesses et grandeurs quotients", fichier: "pdf/4e/ch1-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Pourcentages et coefficient multiplicateur", fichier: "pdf/4e/ch1-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Ratios, partages et échelles", fichier: "pdf/4e/ch1-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Une grandeur en fonction d'une autre", fichier: "pdf/4e/ch1-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Résoudre des problèmes", fichier: "pdf/4e/ch1-exercices-7.pdf" },
          { type: "test", titre: "Je me teste — Proportionnalité", lien: "exerciseurs/proportionnalite-4e/#je-me-teste", detail: "14 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : proportionnalité", lien: "exerciseurs/proportionnalite-4e/" }
        ]
      },
      {
        titre: "Chapitre 2 — Nombres relatifs",
        ressources: [
          { type: "cours",     titre: "Cours — Nombres relatifs", fichier: "pdf/4e/ch2-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Additionner et soustraire (rappels)", fichier: "pdf/4e/ch2-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Multiplier deux relatifs", fichier: "pdf/4e/ch2-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Produits de plusieurs facteurs", fichier: "pdf/4e/ch2-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Diviser des relatifs", fichier: "pdf/4e/ch2-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Enchaîner les opérations", fichier: "pdf/4e/ch2-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Programmes de calcul et problèmes", fichier: "pdf/4e/ch2-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Nombres relatifs", lien: "exerciseurs/relatifs-4e/#je-me-teste", detail: "14 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : nombres relatifs", lien: "exerciseurs/relatifs-4e/" }
        ]
      },
      {
        titre: "Chapitre 3 — Racine carrée et théorème de Pythagore",
        ressources: [
          { type: "cours",     titre: "Cours — Racine carrée et théorème de Pythagore", fichier: "pdf/4e/ch3-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Carrés et racines carrées", fichier: "pdf/4e/ch3-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Calculer l'hypoténuse", fichier: "pdf/4e/ch3-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Calculer un côté de l'angle droit", fichier: "pdf/4e/ch3-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Le triangle est-il rectangle ?", fichier: "pdf/4e/ch3-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Triangle rectangle et cercle circonscrit", fichier: "pdf/4e/ch3-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Résoudre des problèmes", fichier: "pdf/4e/ch3-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Racine carrée et théorème de Pythagore", lien: "exerciseurs/pythagore-4e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : racine carrée et théorème de Pythagore", lien: "exerciseurs/pythagore-4e/" }
        ]
      },
      {
        titre: "Chapitre 4 — Fractions et nombres rationnels",
        ressources: [
          { type: "cours",     titre: "Cours — Fractions et nombres rationnels", fichier: "pdf/4e/ch4-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Nombres premiers et décomposition", fichier: "pdf/4e/ch4-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Simplifier, fractions égales", fichier: "pdf/4e/ch4-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Comparer, additionner, soustraire", fichier: "pdf/4e/ch4-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Multiplier des fractions", fichier: "pdf/4e/ch4-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Inverse et division", fichier: "pdf/4e/ch4-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Enchaîner les opérations", fichier: "pdf/4e/ch4-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Résoudre des problèmes", fichier: "pdf/4e/ch4-exercices-7.pdf" },
          { type: "test", titre: "Je me teste — Fractions et nombres rationnels", lien: "exerciseurs/fractions-4e/#je-me-teste", detail: "14 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : fractions et nombres rationnels", lien: "exerciseurs/fractions-4e/" }
        ]
      },
      {
        titre: "Chapitre 5 — Calcul littéral",
        ressources: [
          { type: "cours",     titre: "Cours — Calcul littéral", fichier: "pdf/4e/ch5-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Expressions littérales", fichier: "pdf/4e/ch5-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Réduire une expression", fichier: "pdf/4e/ch5-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Développer", fichier: "pdf/4e/ch5-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Factoriser", fichier: "pdf/4e/ch5-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : La double distributivité", fichier: "pdf/4e/ch5-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Démontrer avec le calcul littéral", fichier: "pdf/4e/ch5-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Calcul littéral", lien: "exerciseurs/calcul-litteral-4e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : calcul littéral", lien: "exerciseurs/calcul-litteral-4e/" }
        ]
      },
      {
        titre: "Chapitre 6 — Droite des milieux et théorème de Thalès",
        ressources: [
          { type: "cours",     titre: "Cours — Droite des milieux et théorème de Thalès", fichier: "pdf/4e/ch6-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : La droite des milieux", fichier: "pdf/4e/ch6-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Écrire les rapports de Thalès", fichier: "pdf/4e/ch6-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Calculer des longueurs", fichier: "pdf/4e/ch6-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Parallèles ou non ?", fichier: "pdf/4e/ch6-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Résoudre des problèmes", fichier: "pdf/4e/ch6-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Bilan : Thalès et Pythagore", fichier: "pdf/4e/ch6-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Droite des milieux et théorème de Thalès", lien: "exerciseurs/thales-4e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : droite des milieux et théorème de Thalès", lien: "exerciseurs/thales-4e/" }
        ]
      },
      {
        titre: "Chapitre 7 — Probabilités",
        ressources: [
          { type: "cours",     titre: "Cours — Probabilités", fichier: "pdf/4e/ch7-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Vocabulaire des probabilités", fichier: "pdf/4e/ch7-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Calculer des probabilités", fichier: "pdf/4e/ch7-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Contraire, « et », « ou »", fichier: "pdf/4e/ch7-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Expériences à deux épreuves", fichier: "pdf/4e/ch7-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Fréquences et simulation", fichier: "pdf/4e/ch7-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Résoudre des problèmes", fichier: "pdf/4e/ch7-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Probabilités", lien: "exerciseurs/probabilites-4e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : probabilités", lien: "exerciseurs/probabilites-4e/" }
        ]
      },
      {
        titre: "Chapitre 8 — Trigonométrie : le cosinus",
        ressources: [
          { type: "cours",     titre: "Cours — Trigonométrie : le cosinus", fichier: "pdf/4e/ch8-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Vocabulaire et cosinus", fichier: "pdf/4e/ch8-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Utiliser la calculatrice", fichier: "pdf/4e/ch8-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Calculer le côté adjacent", fichier: "pdf/4e/ch8-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Calculer l'hypoténuse", fichier: "pdf/4e/ch8-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Calculer un angle", fichier: "pdf/4e/ch8-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Problèmes et pour aller plus loin", fichier: "pdf/4e/ch8-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Trigonométrie : le cosinus", lien: "exerciseurs/trigonometrie-4e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : trigonométrie : le cosinus", lien: "exerciseurs/trigonometrie-4e/" }
        ]
      },
      {
        titre: "Chapitre 9 — Puissances",
        ressources: [
          { type: "cours",     titre: "Cours — Puissances", fichier: "pdf/4e/ch9-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Puissances d'un nombre", fichier: "pdf/4e/ch9-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Calculer avec des puissances", fichier: "pdf/4e/ch9-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Puissances de 10", fichier: "pdf/4e/ch9-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Calculer avec des puissances de 10", fichier: "pdf/4e/ch9-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Notation scientifique", fichier: "pdf/4e/ch9-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Préfixes et ordres de grandeur", fichier: "pdf/4e/ch9-exercices-6.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°7 : Résoudre des problèmes", fichier: "pdf/4e/ch9-exercices-7.pdf" },
          { type: "test", titre: "Je me teste — Puissances", lien: "exerciseurs/puissances-4e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : puissances", lien: "exerciseurs/puissances-4e/" }
        ]
      },
      {
        titre: "Chapitre 10 — Statistiques",
        ressources: [
          { type: "cours",     titre: "Cours — Statistiques", fichier: "pdf/4e/ch10-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Effectifs, fréquences, diagrammes", fichier: "pdf/4e/ch10-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Diagrammes circulaires", fichier: "pdf/4e/ch10-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Calculer une moyenne", fichier: "pdf/4e/ch10-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Déterminer une médiane", fichier: "pdf/4e/ch10-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Étendue et comparaison de séries", fichier: "pdf/4e/ch10-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Résoudre des problèmes", fichier: "pdf/4e/ch10-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Statistiques", lien: "exerciseurs/statistiques-4e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : statistiques", lien: "exerciseurs/statistiques-4e/" }
        ]
      },
      {
        titre: "Chapitre 11 — Transformations du plan",
        ressources: [
          { type: "cours",     titre: "Cours — Transformations du plan", fichier: "pdf/4e/ch11-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Reconnaître une transformation", fichier: "pdf/4e/ch11-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Construire l'image par une translation", fichier: "pdf/4e/ch11-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Propriétés de la translation", fichier: "pdf/4e/ch11-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : La rotation", fichier: "pdf/4e/ch11-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Agrandissement et réduction", fichier: "pdf/4e/ch11-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Frises, pavages, problèmes", fichier: "pdf/4e/ch11-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Transformations du plan", lien: "exerciseurs/transformations-4e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : transformations du plan", lien: "exerciseurs/transformations-4e/" }
        ]
      },
      {
        titre: "Chapitre 12 — Pyramides, cônes et repérage dans l'espace",
        ressources: [
          { type: "cours",     titre: "Cours — Pyramides, cônes et repérage dans l'espace", fichier: "pdf/4e/ch12-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Reconnaître les solides", fichier: "pdf/4e/ch12-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Patrons de pyramides et de cônes", fichier: "pdf/4e/ch12-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Volume d'une pyramide", fichier: "pdf/4e/ch12-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Volume d'un cône", fichier: "pdf/4e/ch12-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Se repérer dans l'espace", fichier: "pdf/4e/ch12-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Résoudre des problèmes", fichier: "pdf/4e/ch12-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Pyramides, cônes et repérage dans l'espace", lien: "exerciseurs/solides-4e/#je-me-teste", detail: "10 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : pyramides, cônes et repérage dans l'espace", lien: "exerciseurs/solides-4e/" }
        ]
      },
      {
        titre: "Chapitre 13 — Équations",
        ressources: [
          { type: "cours",     titre: "Cours — Équations", fichier: "pdf/4e/ch13-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Équation et solution", fichier: "pdf/4e/ch13-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Équations simples", fichier: "pdf/4e/ch13-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Résoudre ax + b = cx + d", fichier: "pdf/4e/ch13-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Développer avant de résoudre", fichier: "pdf/4e/ch13-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Mettre en équation", fichier: "pdf/4e/ch13-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Résoudre des problèmes", fichier: "pdf/4e/ch13-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Équations", lien: "exerciseurs/equations-4e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : équations", lien: "exerciseurs/equations-4e/" }
        ]
      }
    ]
  },

  "3e": {
    nom: "Troisième",
    chapitres: [
      {
        titre: "Chapitre 1 — Arithmétique",
        ressources: [
          { type: "cours",     titre: "Cours — Arithmétique", fichier: "pdf/3e/ch1-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : La division euclidienne", fichier: "pdf/3e/ch1-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Multiples et diviseurs", fichier: "pdf/3e/ch1-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Nombres premiers", fichier: "pdf/3e/ch1-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Décomposer en facteurs premiers", fichier: "pdf/3e/ch1-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Fractions irréductibles", fichier: "pdf/3e/ch1-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Problèmes : diviseurs et multiples communs", fichier: "pdf/3e/ch1-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Arithmétique", lien: "exerciseurs/arithmetique-3e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : arithmétique", lien: "exerciseurs/arithmetique-3e/" }
        ]
      },
      {
        titre: "Chapitre 2 — Calcul littéral : développer",
        ressources: [
          { type: "cours",     titre: "Cours — Calcul littéral : développer", fichier: "pdf/3e/ch2-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Expressions, valeurs et réductions", fichier: "pdf/3e/ch2-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Distributivité simple", fichier: "pdf/3e/ch2-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Double distributivité", fichier: "pdf/3e/ch2-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Identités remarquables", fichier: "pdf/3e/ch2-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Programmes de calcul", fichier: "pdf/3e/ch2-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Démontrer et utiliser un tableur", fichier: "pdf/3e/ch2-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Calcul littéral : développer", lien: "exerciseurs/calcul-litteral-3e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : calcul littéral : développer", lien: "exerciseurs/calcul-litteral-3e/" }
        ]
      },
      {
        titre: "Chapitre 3 — Théorème de Pythagore et réciproque",
        ressources: [
          { type: "cours",     titre: "Cours — Théorème de Pythagore et réciproque", fichier: "pdf/3e/ch3-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Calculer l'hypoténuse", fichier: "pdf/3e/ch3-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Calculer un côté de l'angle droit", fichier: "pdf/3e/ch3-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Le triangle est-il rectangle ?", fichier: "pdf/3e/ch3-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Valeurs exactes, aires et périmètres", fichier: "pdf/3e/ch3-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Pythagore dans l'espace", fichier: "pdf/3e/ch3-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Problèmes type brevet", fichier: "pdf/3e/ch3-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Théorème de Pythagore et réciproque", lien: "exerciseurs/pythagore-3e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : théorème de Pythagore et réciproque", lien: "exerciseurs/pythagore-3e/" }
        ]
      },
      {
        titre: "Chapitre 4 — Notion de fonction",
        ressources: [
          { type: "cours",     titre: "Cours — Notion de fonction", fichier: "pdf/3e/ch4-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Vocabulaire et notations", fichier: "pdf/3e/ch4-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Calculer des images", fichier: "pdf/3e/ch4-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Chercher des antécédents", fichier: "pdf/3e/ch4-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Tableaux de valeurs et tableur", fichier: "pdf/3e/ch4-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Lire un graphique", fichier: "pdf/3e/ch4-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Tracer une courbe, résoudre un problème", fichier: "pdf/3e/ch4-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Notion de fonction", lien: "exerciseurs/fonctions-3e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : notion de fonction", lien: "exerciseurs/fonctions-3e/" }
        ]
      },
      {
        titre: "Chapitre 5 — Équations du premier degré",
        ressources: [
          { type: "cours",     titre: "Cours — Équations du premier degré", fichier: "pdf/3e/ch5-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Tester, résoudre des équations simples", fichier: "pdf/3e/ch5-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Résoudre ax + b = cx + d", fichier: "pdf/3e/ch5-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Parenthèses et quotients", fichier: "pdf/3e/ch5-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Mettre en équation", fichier: "pdf/3e/ch5-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Problèmes type brevet", fichier: "pdf/3e/ch5-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Équations et fonctions", fichier: "pdf/3e/ch5-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Équations du premier degré", lien: "exerciseurs/equations-3e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : équations du premier degré", lien: "exerciseurs/equations-3e/" }
        ]
      },
      {
        titre: "Chapitre 6 — Probabilités",
        ressources: [
          { type: "cours",     titre: "Cours — Probabilités", fichier: "pdf/3e/ch6-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Vocabulaire des probabilités", fichier: "pdf/3e/ch6-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Calculer des probabilités", fichier: "pdf/3e/ch6-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Contraire, « et », « ou »", fichier: "pdf/3e/ch6-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Situations sans équiprobabilité", fichier: "pdf/3e/ch6-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Fréquences et simulation", fichier: "pdf/3e/ch6-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Problèmes type brevet", fichier: "pdf/3e/ch6-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Probabilités", lien: "exerciseurs/probabilites-3e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : probabilités", lien: "exerciseurs/probabilites-3e/" }
        ]
      },
      {
        titre: "Chapitre 7 — Calcul littéral : factoriser",
        ressources: [
          { type: "cours",     titre: "Cours — Calcul littéral : factoriser", fichier: "pdf/3e/ch7-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Facteur commun simple", fichier: "pdf/3e/ch7-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Une expression en facteur commun", fichier: "pdf/3e/ch7-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Factoriser avec a² − b²", fichier: "pdf/3e/ch7-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Développer ou factoriser ?", fichier: "pdf/3e/ch7-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Calculer astucieusement", fichier: "pdf/3e/ch7-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Démontrer, problèmes type brevet", fichier: "pdf/3e/ch7-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Calcul littéral : factoriser", lien: "exerciseurs/factoriser-3e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : calcul littéral : factoriser", lien: "exerciseurs/factoriser-3e/" }
        ]
      },
      {
        titre: "Chapitre 8 — Équations produit nul et x² = a",
        ressources: [
          { type: "cours",     titre: "Cours — Équations produit nul et x² = a", fichier: "pdf/3e/ch8-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Équations produit nul", fichier: "pdf/3e/ch8-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Factoriser pour résoudre", fichier: "pdf/3e/ch8-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Les équations x² = a", fichier: "pdf/3e/ch8-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Choisir la bonne méthode", fichier: "pdf/3e/ch8-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Problèmes de géométrie", fichier: "pdf/3e/ch8-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Problèmes type brevet", fichier: "pdf/3e/ch8-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Équations produit nul et x² = a", lien: "exerciseurs/equations-produit-3e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : équations produit nul et x² = a", lien: "exerciseurs/equations-produit-3e/" }
        ]
      },
      {
        titre: "Chapitre 9 — Théorème de Thalès et triangles semblables",
        ressources: [
          { type: "cours",     titre: "Cours — Théorème de Thalès et triangles semblables", fichier: "pdf/3e/ch9-cours.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°1 : Triangles semblables", fichier: "pdf/3e/ch9-exercices-1.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°2 : Thalès : configuration emboîtée", fichier: "pdf/3e/ch9-exercices-2.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°3 : Thalès : configuration papillon", fichier: "pdf/3e/ch9-exercices-3.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°4 : Les droites sont-elles parallèles ?", fichier: "pdf/3e/ch9-exercices-4.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°5 : Agrandissement et réduction", fichier: "pdf/3e/ch9-exercices-5.pdf" },
          { type: "exercices", titre: "Feuille d'exercices n°6 : Problèmes type brevet", fichier: "pdf/3e/ch9-exercices-6.pdf" },
          { type: "test", titre: "Je me teste — Théorème de Thalès et triangles semblables", lien: "exerciseurs/thales-3e/#je-me-teste", detail: "12 questions sur tout le chapitre, puis ton bilan" },
          { type: "exerciseur", titre: "Exerciseur — S'entraîner : théorème de Thalès et triangles semblables", lien: "exerciseurs/thales-3e/" }
        ]
      }
    ]
  }

};
