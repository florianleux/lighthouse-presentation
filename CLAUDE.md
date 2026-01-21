# lighthouse-presentation

Mono-repo pour les applications de présentation et de vote du projet Lighthouse Pirates.

## Structure

```
lighthouse-presentation/
├── apps/
│   ├── presentation/         # Site projeté en salle
│   └── vote/                 # App mobile participants
├── shared/
│   ├── types.ts              # Types Ably, avatars
│   ├── constants.ts          # Channels, états de session
│   └── avatars/              # Système d'avatars
├── pnpm-workspace.yaml
└── package.json
```

## Documentation

Les specs sont dans le dossier parent `../specs/`.

Voir [`../CLAUDE.md`](../CLAUDE.md) pour la documentation complète.

## Commandes

```bash
pnpm install
pnpm dev:presentation
pnpm dev:vote
```

## Lien avec BlackMarket

BlackMarket est dans un repo séparé (`../blackmarket/`).
Il est affiché en iframe via les URLs : `https://{branch}.blackmarket.com`
