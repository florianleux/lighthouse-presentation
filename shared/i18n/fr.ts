// Dictionnaire FR — langue de référence (source de vérité des clés).
// Toute nouvelle chaîne affichée au public passe par ici, puis par en.ts.
// Syntaxe vue-i18n : {param} pour l'interpolation, « a | b » pour le pluriel.

export const fr = {
  common: {
    back: "Retour",
    counting: "Dépouillement...",
  },
  crewToast: {
    counter: "membre<br>d'équipage | membres<br>d'équipage",
    onBoard: "est à bord !",
  },
  dayIntro: {
    day: "Jour {day}/5",
  },
  outro: {
    endOfDay: "Fin du jour 5",
    lighthouseDone: "Phare <br> terminé !",
  },
  thankYou: {
    crew: "L'ÉQUIPAGE",
    organizers: "Un grand merci à l'équipe BDX I/O !",
    title: "Merci !",
  },
  winner: {
    crewVotedFor: "L'équipage a voté pour",
    noVote: "Aucun vote enregistré — retournez à la slide de vote",
  },
  poll: {
    responses: "{count}/{total}<br>réponses",
    stop: "Arrêter",
  },
  vote: {
    avatar: {
      boarding: "Embarquement...",
      gender: {
        female: "Femme",
        male: "Homme",
      },
      randomize: "GÉNÉRER UN AVATAR",
      skin: {
        dark: "Foncé",
        light: "Clair",
        mid: "Moyen",
      },
      spinning: "EN COURS...",
    },
    end: {
      discover: "Découvrir BlackMarket",
      feedback: "Partagez votre avis<br>avec le capitaine",
      thanks: "Merci d'avoir construit le phare !",
    },
    feedback: {
      cancel: "Annuler",
      placeholder: "Votre avis...",
      send: "Envoyer",
      thanks: "Merci pour votre avis, pirate !",
      title: "Partagez votre avis",
    },
    joinCrew: "REJOINDRE L'ÉQUIPAGE",
    name: {
      max: "Maximum {count} caractères",
      min: "Minimum {count} caractères",
      placeholder: "Votre nom",
    },
    participation: "{count}/{total} votes",
    poll: {
      admiral: "Amiral",
      captain: "Capitaine",
      newbie: "Matelot",
    },
    reconnecting: "Reconnexion...",
    status: {
      checkConnection: "Vérifiez votre connexion internet ou désactivez votre bloqueur de pubs",
      connecting: "Connexion...",
      error: "Erreur de connexion",
      notStarted: "La présentation n'a pas encore commencé",
      retry: "Réessayer",
      waiting: "En attente du capitaine...",
    },
    submit: {
      failed: "Envoi refusé. Vérifiez votre connexion internet, puis réessayez.",
      slow: "Connexion lente : l'envoi partira dès le retour du réseau.",
    },
    voiceCount: "{count} voix",
    waiting: {
      getReady: "Tenez-vous prêt pour votre prochaine aventure !",
      missed: "Oups, vous avez raté le vote !",
      nextVote: "Le capitaine vous préviendra du prochain vote !",
      thanks: "Merci pour votre vote !",
    },
  },
  choice: {
    option: "Option {letter}",
  },
  metricIntro: {
    average: "Moyen",
    demoAlt: "démo {metric}",
    good: "Bon",
    poor: "Mauvais",
  },
  metrics: {
    cls: {
      formula: "Instabilité du contenu pendant le chargement",
      options: {
        a: {
          subtitle: "Maîtriser ce que l'on publie",
          title: "Contenu",
        },
        b: {
          subtitle: "Dompter les injections",
          title: "Ads",
        },
      },
      tags: {
        "0": "Tueur de confiance",
        "1": "Impacte le SEO !",
      },
    },
    fcp: {
      formula: "Texte, image, SVG ou canvas",
      options: {
        a: {
          subtitle: "Livrer le premier octet au plus vite",
          title: "TTFB",
        },
        b: {
          subtitle: "Fluidifier l'affichage",
          title: "Le chemin de rendu critique",
        },
      },
      tags: {
        "0": "Quelque chose se passe-t-il ?",
        "1": "Un FCP bas est rassurant",
      },
    },
    lcp: {
      formula: "Temps de rendu du plus grand élément",
      options: {
        a: {
          subtitle: "[PLACEHOLDER sous-titre]",
          title: "[PLACEHOLDER Option A]",
        },
        b: {
          subtitle: "Jouer avec la zone grise...",
          title: "Focus sur le LCP",
        },
      },
      tags: {
        "0": "Core Web Vital : impacte le SEO !",
        "1": "Mesure la vitesse de chargement perçue",
      },
    },
    si: {
      formula: "Rapidité moyenne de l'affichage du contenu",
      options: {
        a: {
          subtitle: "Polices et fichiers textes",
          title: "Texte",
        },
        b: {
          subtitle: "Sur-mesure, compressées, intactes",
          title: "Images",
        },
      },
      tags: {
        "0": "Vitesse totale de remplissage, pas un instant",
        "1": "Mesuré en labo uniquement, pas sur le terrain",
      },
    },
    tbt: {
      formula: "Somme des temps de blocage au-delà de 50 ms",
      options: {
        a: {
          subtitle: "Envoyer le strict nécessaire",
          title: "Diète des données",
        },
        b: {
          subtitle: "La fantaisie a un coût",
          title: "Sobriété du design",
        },
      },
      tags: {
        "0": "Parsing JSON",
        "1": "Calculs de mise en page",
      },
    },
  },
  slides: {
    cls: {
      a1: {
        altAfter: "CLS après correction",
        altBefore: "CLS avant correction",
        codeAlt: "Image bannière",
        title: "Aucune dimension spécifiée : aucun espace réservé.",
      },
      a2: {
        altAfter: "CLS police après correction",
        altBefore: "CLS police avant correction",
        title: "Chaque police a sa propre empreinte.",
      },
      b1: {
        altAfter: "CLS publicités après correction",
        altBefore: "CLS publicités avant correction",
        title: "Pas de placeholder : décalage à l'injection.",
      },
      b2: {
        altAfter: "CLS bannière après correction",
        altBefore: "CLS bannière avant correction",
        title: "Le CLS a lieu<br>dans le flux.",
      },
    },
    fcp: {
      a1: {
        title: "La base de toutes les métriques.",
      },
      a2: {
        cache: "Utiliser le cache",
        cdn: "Utiliser un CDN",
        redirects: "Éviter les redirections",
      },
      b1: {
        interactivePixels: "pixels interactifs",
        rendering: "Rendu",
        stop: "stop !",
      },
      b2: {
        minify: "Minifier !",
        purge: "Purger !",
        question: "Remettre en question !",
      },
    },
    intro: {
      accessibility: "Accessibilité",
      agenticBrowsing: "Navigation<br>agentique",
      bestPractices: "Bonnes<br>pratiques",
      scoresSubtitle: "L'outil open-source de Google pour auditer la qualité des pages web",
      scoresTitle: "Les scores Lighthouse",
      whyStat: "d'<span class=\"font-bold\">abandon</span> en moins<br> sur les pages respectant<br> les standards de performance de Google",
      whyTitle: "Pourquoi la performance compte-t-elle ?",
    },
    lcp: {
      b1: {
        altDesktop: "LCP Bureau",
        altMobile: "LCP Mobile",
        title: "Le LCP varie selon le viewport",
      },
      b2: {
        title: "Et si on avait<br>le meilleur des<br>deux mondes ?",
      },
    },
    si: {
      a1: {
        cpuCost: "Coût CPU",
        none: "Aucune",
        title: "Compresser les fichiers texte !",
      },
      a2: {
        noCompression: "Aucune compression",
        title: "Les polices sont partout,<br>il faut les compresser !",
      },
      b1: {
        lossless: "Sans perte",
        lossy: "Avec perte",
        lossyLossless: "Avec / Sans perte",
        title: "Même image, formats différents.",
      },
      b2: {
        codeAlt: "Bannière promo",
        title: "Des images sur-mesure !",
      },
    },
    tbt: {
      a1: {
        title: "Paginer et filtrer côté backend",
      },
      a2: {
        title: "Filtrer les champs inutiles !",
      },
      b1: {
        alt: "Mise en page Masonry",
        title: "Layouts sophistiqués = JS lourd !",
      },
      b2: {
        alt: "Mise en page CSS Grid",
        title: "Le design en vaut-il le coût ?",
      },
    },
  },
}

export type Messages = typeof fr
