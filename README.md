# lighthouse-presentation

Interactive presentation & mobile voting app for **Lighthouse Pirates**.

## Overview

A 45-minute interactive presentation where the audience votes to optimize a Vue.js/Nuxt app's Lighthouse scores. 4 votes cover the 4 Lighthouse categories: Performance, Accessibility, Best Practices, and SEO.

## Structure

```
lighthouse-presentation/
├── apps/
│   ├── presentation/         # Projected slides (HTML/CSS/JS)
│   └── vote/                 # Mobile voting app (HTML/CSS/JS)
├── shared/
│   ├── types.ts              # Shared message types
│   ├── constants.ts          # Config, session states
│   └── avatars/              # Pirate avatar generation
└── pnpm-workspace.yaml
```

## Tech Stack

- **Frontend**: HTML/CSS/JavaScript + Tailwind CSS
- **Real-time**: Firebase Firestore
- **Deployment**: Netlify (2 sites)

## Development

```bash
pnpm install
pnpm dev:presentation
pnpm dev:vote
```

## Related

- [blackmarket](https://github.com/florianleux/blackmarket) - Demo app displayed in iframe
- See `../specs/` for full documentation
