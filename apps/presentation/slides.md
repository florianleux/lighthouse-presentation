---
theme: default
title: Lighthouse Pirates
info: |
  ## Lighthouse Pirates
  Optimisons ensemble les scores Lighthouse !
  4 votes = 4 catégories Lighthouse
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Join the crew!

Scannez le QR code pour rejoindre l'équipage

<div class="flex justify-center pt-8">
  <div class="w-64 h-64 bg-gray-200 flex items-center justify-center">
    QR Code
  </div>
</div>

<div class="text-center pt-4">
  vote.lighthouse-pirates.com
</div>

<CrewDisplay />

---

# Présentation personnelle

## Florian Leux

- Développeur Web
- Expert Performance
- Pirate du Lighthouse

---

# Question audience

Quel est votre niveau de connaissance de Lighthouse ?

<div class="grid grid-cols-3 gap-4 pt-8 text-center">
  <div class="p-4 border rounded">
    <div class="text-4xl mb-2">🌱</div>
    <div>Débutant</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-4xl mb-2">🌿</div>
    <div>Intermédiaire</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-4xl mb-2">🌳</div>
    <div>Expert</div>
  </div>
</div>

---

# L'Aventure Pirate (1/2)

## Let's build a lighthouse

Contexte narratif à définir (TBD)

<div class="flex justify-center pt-8">
  <div class="text-8xl">🏗️</div>
</div>

---

# L'Aventure Pirate (2/2)

Suite du contexte narratif (TBD)

<div class="flex justify-center pt-8">
  <div class="text-8xl">⚓</div>
</div>

---

# Le BlackMarket

Notre boutique pirate cobaye

<div class="flex justify-center pt-8">
  <div class="p-8 border rounded">
    <div class="text-2xl mb-4">🏪 BlackMarket</div>
    <div class="text-sm opacity-70">Application Nuxt 3 avec 40 anti-patterns</div>
  </div>
</div>

---

# Scores Baseline

Les 4 scores Lighthouse de départ

<div class="grid grid-cols-4 gap-8 pt-8 text-center">
  <div>
    <div class="text-5xl font-bold text-red-500">32</div>
    <div class="mt-2">Performance</div>
  </div>
  <div>
    <div class="text-5xl font-bold text-red-500">45</div>
    <div class="mt-2">Accessibility</div>
  </div>
  <div>
    <div class="text-5xl font-bold text-orange-500">58</div>
    <div class="mt-2">Best Practices</div>
  </div>
  <div>
    <div class="text-5xl font-bold text-red-500">41</div>
    <div class="mt-2">SEO</div>
  </div>
</div>

---

# Mission

## 4 days to build the best lighthouse possible

<div class="grid grid-cols-4 gap-4 pt-8 text-center">
  <div class="p-4 border rounded">
    <div class="font-bold">Day 1</div>
    <div>Performance</div>
  </div>
  <div class="p-4 border rounded">
    <div class="font-bold">Day 2</div>
    <div>Accessibility</div>
  </div>
  <div class="p-4 border rounded">
    <div class="font-bold">Day 3</div>
    <div>Best Practices</div>
  </div>
  <div class="p-4 border rounded">
    <div class="font-bold">Day 4</div>
    <div>SEO</div>
  </div>
</div>

---

# Day 1 : Performance

## Critères Lighthouse Performance

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)
- Speed Index

<div class="pt-4">
  Score actuel : <span class="text-red-500 font-bold text-2xl">32</span>
</div>

---

# Day 1 : Comparaison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-4">Option A</div>
    <div class="text-lg mb-4">Images & Transfer</div>
    <ul class="text-sm">
      <li>Conversion images en WebP</li>
      <li>Ajout loading="lazy" below-fold</li>
      <li>Ajout attributs width et height</li>
      <li>Suppression CSS render-blocking</li>
      <li>Activation compression gzip/brotli</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-4">Option B</div>
    <div class="text-lg mb-4">Fonts & JavaScript</div>
    <ul class="text-sm">
      <li>font-display: swap sur toutes les fonts</li>
      <li>Suppression fonts render-blocking</li>
      <li>Ajout preconnect domaines externes</li>
      <li>Suppression lodash, moment, jQuery</li>
      <li>Suppression third-party scripts bloquants</li>
      <li>Suppression script inline 500ms</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 1 : Vote

## Performance

<div class="text-4xl pt-4 opacity-50">Choisissez votre optimisation</div>

<VoteButtons :vote-index="0" label-a="Images & Transfer" label-b="Fonts & JS" :next-slide="12" />

---

# Day 1 : Option Gagnante

## Détail des fixes appliqués

<WinnerDisplay :vote-index="0" />

---

# Day 1 : Application

<ApplicationDisplay :vote-index="0" category="Performance" floor="Étage 1" />

---

# Day 2 : Accessibility

## Critères Lighthouse Accessibility

- Color Contrast
- Interactive Elements
- ARIA Attributes
- Semantic HTML
- Keyboard Navigation

<div class="pt-4">
  Score actuel : <span class="text-red-500 font-bold text-2xl">45</span>
</div>

---

# Day 2 : Comparaison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-4">Option A</div>
    <div class="text-lg mb-4">Visual</div>
    <ul class="text-sm">
      <li>Amélioration contrastes (ratio 4.5:1)</li>
      <li>Ajout focus indicators visibles</li>
      <li>Labels sur tous les inputs</li>
      <li>Noms accessibles sur liens/boutons</li>
      <li>Contrôles sur médias auto-play</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-4">Option B</div>
    <div class="text-lg mb-4">Semantic</div>
    <ul class="text-sm">
      <li>Remplacement div cliquables par button</li>
      <li>Ajout attribut lang sur html</li>
      <li>Ajout skip link</li>
      <li>Correction keyboard traps</li>
      <li>Correction hiérarchie headings (h1→h2→h3)</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 2 : Vote

## Accessibility

<div class="text-4xl pt-4 opacity-50">Choisissez votre optimisation</div>

<VoteButtons :vote-index="1" label-a="Visual" label-b="Semantic" :next-slide="17" />

---

# Day 2 : Option Gagnante

## Détail des fixes appliqués

<WinnerDisplay :vote-index="1" />

---

# Day 2 : Application

<ApplicationDisplay :vote-index="1" category="Accessibility" floor="Étage 2" />

---

# Day 3 : Best Practices

## Critères Lighthouse Best Practices

- Console Errors
- HTTPS
- Deprecated APIs
- Browser Compatibility
- Security Issues

<div class="pt-4">
  Score actuel : <span class="text-orange-500 font-bold text-2xl">58</span>
</div>

---

# Day 3 : Comparaison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-4">Option A</div>
    <div class="text-lg mb-4">Console & Security</div>
    <ul class="text-sm">
      <li>Suppression console.log en production</li>
      <li>Ajout rel="noopener" sur liens externes</li>
      <li>Suppression document.write()</li>
      <li>Correction erreurs console</li>
      <li>Mise à jour librairies vulnérables</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-4">Option B</div>
    <div class="text-lg mb-4">Modern Standards</div>
    <ul class="text-sm">
      <li>Correction dimensions d'affichage images</li>
      <li>Vérification doctype</li>
      <li>Suppression demandes permissions agressives</li>
      <li>Ajout passive listeners (scroll, touch)</li>
      <li>Masquage source maps en production</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 3 : Vote

## Best Practices

<div class="text-4xl pt-4 opacity-50">Choisissez votre optimisation</div>

<VoteButtons :vote-index="2" label-a="Console & Security" label-b="Modern Standards" :next-slide="22" />

---

# Day 3 : Option Gagnante

## Détail des fixes appliqués

<WinnerDisplay :vote-index="2" />

---

# Day 3 : Application

<ApplicationDisplay :vote-index="2" category="Best Practices" floor="Étage 3" />

---

# Day 4 : SEO

## Critères Lighthouse SEO

- Meta Tags
- Crawlability
- Mobile Friendly
- Structured Data
- Link Text

<div class="pt-4">
  Score actuel : <span class="text-red-500 font-bold text-2xl">41</span>
</div>

---

# Day 4 : Comparaison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-4">Option A</div>
    <div class="text-lg mb-4">Meta & Structure</div>
    <ul class="text-sm">
      <li>Ajout title unique</li>
      <li>Ajout meta name="description"</li>
      <li>Un seul h1 par page</li>
      <li>Vérification viewport meta</li>
      <li>Ajout canonical URL</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-4">Option B</div>
    <div class="text-lg mb-4">Content & Links</div>
    <ul class="text-sm">
      <li>Texte de liens descriptif (pas de "click here")</li>
      <li>Attributs alt sur toutes les images</li>
      <li>Suppression meta noindex</li>
      <li>Navigation crawlable (vrais a href)</li>
      <li>Suppression chaînes de redirections</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 4 : Vote

## SEO

<div class="text-4xl pt-4 opacity-50">Choisissez votre optimisation</div>

<VoteButtons :vote-index="3" label-a="Meta & Structure" label-b="Content & Links" :next-slide="27" />

---

# Day 4 : Option Gagnante

## Détail des fixes appliqués

<WinnerDisplay :vote-index="3" />

---

# Day 4 : Application

<ApplicationDisplay :vote-index="3" category="SEO" floor="Complet + Lanterne" />

---

# Récapitulation

## Phare terminé !

<PathDisplay />

---

# Meilleure Solution

## Combinaison optimale

<BestPath />

---

# Conclusion

## Ce qu'on a appris

- Les optimisations Lighthouse ont un impact mesurable
- Chaque catégorie a ses propres critères
- Les choix d'optimisation sont souvent des compromis
- L'important est de prioriser selon le contexte

<div class="pt-8 text-center">
  (TBD)
</div>

---
layout: center
---

# Questions ?

<div class="text-6xl pt-8">
  🏴‍☠️
</div>

<div class="pt-8 opacity-50">
  Lighthouse Pirates - Une présentation interactive
</div>
