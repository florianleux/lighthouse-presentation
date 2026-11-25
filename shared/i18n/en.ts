import type { Messages } from './fr'

// Dictionnaire EN — reprend l'EN d'avant la traduction FR (commit 810a595)
// quand il existait ; les chaînes ajoutées depuis sont traduites du FR.
// Même structure que fr.ts (vérifiée par le type Messages).

export const en: Messages = {
  common: {
    back: "Back",
    counting: "Counting votes...",
  },
  crewToast: {
    counter: "crew<br>member | crew<br>members",
    onBoard: "joined!",
  },
  dayIntro: {
    day: "Day {day}/5",
  },
  outro: {
    endOfDay: "End of day 5",
    lighthouseDone: "Lighthouse <br> complete!",
  },
  thankYou: {
    crew: "THE CREW",
    organizers: "A huge thank you to the BDX I/O team!",
    title: "Thank you!",
  },
  winner: {
    crewVotedFor: "The crew has voted for",
    noVote: "No vote recorded - go back to the vote slide",
  },
  poll: {
    responses: "{count}/{total}<br>answered",
    stop: "Stop",
  },
  vote: {
    avatar: {
      boarding: "Boarding...",
      gender: {
        female: "Female",
        male: "Male",
      },
      randomize: "RANDOMIZE",
      skin: {
        dark: "Dark",
        light: "Light",
        mid: "Medium",
      },
      spinning: "SPINNING...",
    },
    end: {
      discover: "Take a look at BlackMarket",
      feedback: "Share your thoughts<br>with the captain",
      thanks: "Thank you for building the lighthouse!",
    },
    feedback: {
      cancel: "Cancel",
      placeholder: "Your feedback...",
      send: "Send",
      thanks: "Thanks for your feedback, pirate!",
      title: "Share your thoughts",
    },
    joinCrew: "JOIN THE CREW",
    name: {
      max: "Maximum {count} characters",
      min: "Minimum {count} characters",
      placeholder: "Your Name",
    },
    participation: "{count}/{total} voted",
    poll: {
      admiral: "Admiral",
      captain: "Captain",
      newbie: "Newbie",
    },
    reconnecting: "Reconnecting...",
    status: {
      checkConnection: "Check your internet connection",
      connecting: "Connecting...",
      error: "Connection error",
      notStarted: "The presentation hasn't started yet",
      retry: "Retry",
      waiting: "Waiting for the captain...",
    },
    submit: {
      failed: "Couldn't send. Check your internet connection, then try again.",
      slow: "Slow connection: it will be sent as soon as you're back online.",
    },
    voiceCount: "{count} votes",
    waiting: {
      getReady: "Get ready for your next adventure!",
      missed: "Oooops you missed the vote !",
      nextVote: "The captain will let you know about the next vote!",
      thanks: "Thanks for your vote!",
    },
  },
  choice: {
    option: "Option {letter}",
  },
  metricIntro: {
    average: "Average",
    demoAlt: "{metric} demo",
    good: "Good",
    poor: "Poor",
  },
  metrics: {
    cls: {
      formula: "Unexpected movement during loading",
      options: {
        a: {
          subtitle: "Control what you own",
          title: "Content",
        },
        b: {
          subtitle: "Tame the injected",
          title: "Ads",
        },
      },
      tags: {
        "0": "Trust killer",
        "1": "Will impact SEO!",
      },
    },
    fcp: {
      formula: "Text, image, SVG or canvas",
      options: {
        a: {
          subtitle: "Reduce the time of delivery",
          title: "TTFB",
        },
        b: {
          subtitle: "Smooth the painting process",
          title: "The critical rendering path",
        },
      },
      tags: {
        "0": "Is anything happening?",
        "1": "Low FCP is reassuring",
      },
    },
    lcp: {
      formula: "Time to render largest element",
      options: {
        a: {
          subtitle: "[PLACEHOLDER subtitle]",
          title: "[PLACEHOLDER Option A]",
        },
        b: {
          subtitle: "Save effort, target smart",
          title: "Focus on LCP",
        },
      },
      tags: {
        "0": "Core Web Vital: Impacts SEO!",
        "1": "Measures perceived load speed",
      },
    },
    si: {
      formula: "How quickly content is visually displayed",
      options: {
        a: {
          subtitle: "Compress and trim",
          title: "Leaner text",
        },
        b: {
          subtitle: "Tailored, compressed, intact",
          title: "Smarter images",
        },
      },
      tags: {
        "0": "Total filling speed, not a moment",
        "1": "Lab only, not measured in the field",
      },
    },
    tbt: {
      formula: "Sum of blocking time beyond 50ms",
      options: {
        a: {
          subtitle: "Don't parse the unnecessary",
          title: "Data Parsimony",
        },
        b: {
          subtitle: "Fanciness has a cost",
          title: "Design Sobriety",
        },
      },
      tags: {
        "0": "JSON parsing",
        "1": "Layout calculations",
      },
    },
  },
  slides: {
    cls: {
      a1: {
        altAfter: "CLS after fix",
        altBefore: "CLS before fix",
        codeAlt: "Banner image",
        title: "No size specified: no space reserved.",
      },
      a2: {
        altAfter: "Font CLS after fix",
        altBefore: "Font CLS before fix",
        title: "Every font has its own footprint.",
      },
      b1: {
        altAfter: "Ads CLS after fix",
        altBefore: "Ads CLS before fix",
        title: "No placeholder: layout shift at injection.",
      },
      b2: {
        altAfter: "Banner CLS after fix",
        altBefore: "Banner CLS before fix",
        title: "CLS happens mostly<br> in the flow.",
      },
    },
    fcp: {
      a1: {
        title: "The starting point for all other metrics.",
      },
      a2: {
        cache: "Cache your assets",
        cdn: "Setup a CDN",
        redirects: "Avoid redirects",
      },
      b1: {
        interactivePixels: "interactive pixels",
        rendering: "Rendering",
        stop: "stop!",
      },
      b2: {
        minify: "Minify it!",
        purge: "Purge it!",
        question: "Question it!",
      },
    },
    intro: {
      accessibility: "Accessibility",
      agenticBrowsing: "Agentic<br>browsing",
      bestPractices: "Best<br>Practices",
      scoresSubtitle: "Google's open-source tool for auditing web page quality",
      scoresTitle: "The Lighthouse score(s)",
      whyStat: "less <span class=\"font-bold\">abandonment</span><br> on pages that meet<br> Google's performance standards",
      whyTitle: "Why does performance matter?",
    },
    lcp: {
      b1: {
        altDesktop: "LCP Desktop",
        altMobile: "LCP Mobile",
        title: "LCP changes with screen size",
      },
      b2: {
        title: "What if we could<br> have the best of<br> both worlds?",
      },
    },
    si: {
      a1: {
        cpuCost: "CPU cost",
        none: "None",
        title: "Compress your text files!",
      },
      a2: {
        noCompression: "No compression",
        title: "Fonts are everywhere, compress them!",
      },
      b1: {
        lossless: "Lossless",
        lossy: "Lossy",
        lossyLossless: "Lossy / Lossless",
        title: "Same image, different formats.",
      },
      b2: {
        codeAlt: "Promo Banner",
        title: "Tailor your images to the browser!",
      },
    },
    tbt: {
      a1: {
        title: "Paginate and filter on the backend",
      },
      a2: {
        title: "Trim down the unused fields!",
      },
      b1: {
        alt: "Masonry layout",
        title: "Fancy layouts might require heavy JS!",
      },
      b2: {
        alt: "CSS Grid layout",
        title: "Is the design worth the cost?",
      },
    },
  },
}
