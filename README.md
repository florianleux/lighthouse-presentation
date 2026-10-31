# Let's build a Lighthouse

[Page du projet / Project page](https://florianleux.fr/dev/keynotes/lets-build-a-lighthouse) · [App de vote / Voting app](https://pirate-crew.florianleux.fr)

![Let's build a Lighthouse – slide](https://florianleux.fr/lets-build-a-lighthouse/lighthouse-01.webp)

## 🇫🇷 En français

Une conférence interactive sur le score Lighthouse et la performance web, sur le thème des pirates. Ce repo contient les slides et l'application de vote.

Le public joue un équipage pirate. Sa mission : améliorer le score Lighthouse de [BlackMarket](https://github.com/florianleux/blackmarket), une fausse boutique au score catastrophique.

Pour chaque catégorie du score, le public vote sur son téléphone pour choisir le correctif à appliquer. Le phare à l'écran se met à jour, et les slides suivantes parlent du correctif choisi. Chaque présentation est donc différente.

Présentée pour la première fois à la BackCon 2026, la conférence technique interne de Back Market, devant 75 personnes.

- **`apps/presentation`** : les slides projetées
- **`apps/vote`** : l'application de vote sur mobile
- Les votes arrivent en temps réel grâce à Firebase

## 🇬🇧 In English

An interactive talk about Lighthouse scores and web performance, with a pirate theme. This repo holds the slides and the voting app.

The audience plays a pirate crew. Their mission: improve the Lighthouse score of [BlackMarket](https://github.com/florianleux/blackmarket), a fake shop with a terrible score.

For each part of the score, the audience votes on their phone to pick the fix to apply. The lighthouse on screen updates, and the next slides cover the chosen fix. No two talks are the same.

First given at BackCon 2026, Back Market's internal tech conference, to an audience of 75.

- **`apps/presentation`**: the projected slides
- **`apps/vote`**: the mobile voting app
- Votes arrive in real time through Firebase

## Stack

HTML · CSS · JavaScript · Tailwind CSS · Firebase Firestore · pnpm workspaces · Netlify

## Lancer en local / Run locally

```bash
pnpm install
pnpm dev:presentation
pnpm dev:vote
```
