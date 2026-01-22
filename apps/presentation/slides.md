---
theme: default
title: Lighthouse Pirates
info: |
  ## Lighthouse Pirates
  Let's optimize Lighthouse scores together!
  4 votes = 4 Lighthouse categories
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Join the crew!

Scan the QR code to join the crew

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

# About me

## Florian Leux

- Web Developer
- Performance Expert
- Lighthouse Pirate

---

# Audience question

What's your knowledge level of Lighthouse?

<div class="grid grid-cols-3 gap-4 pt-8 text-center">
  <div class="p-4 border rounded">
    <div class="text-4xl mb-2">🌱</div>
    <div>Beginner</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-4xl mb-2">🌿</div>
    <div>Intermediate</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-4xl mb-2">🌳</div>
    <div>Expert</div>
  </div>
</div>

---

# The Pirate Adventure (1/2)

## Let's build a lighthouse

Narrative context to be defined (TBD)

<div class="flex justify-center pt-8">
  <div class="text-8xl">🏗️</div>
</div>

---

# The Pirate Adventure (2/2)

Narrative context continued (TBD)

<div class="flex justify-center pt-8">
  <div class="text-8xl">⚓</div>
</div>

---

# The BlackMarket

Our pirate test shop

<div class="flex justify-center pt-8">
  <div class="p-8 border rounded">
    <div class="text-2xl mb-4">🏪 BlackMarket</div>
    <div class="text-sm opacity-70">Nuxt 3 app with 40 anti-patterns</div>
  </div>
</div>

---

# Baseline Scores

The 4 starting Lighthouse scores

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

# Day 1: Performance

## Lighthouse Performance Criteria

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)
- Speed Index

<div class="pt-4">
  Current score: <span class="text-red-500 font-bold text-2xl">32</span>
</div>

---

# Day 1: Comparison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-4">Option A</div>
    <div class="text-lg mb-4">Images & Transfer</div>
    <ul class="text-sm">
      <li>Convert images to WebP</li>
      <li>Add loading="lazy" below-fold</li>
      <li>Add width and height attributes</li>
      <li>Remove render-blocking CSS</li>
      <li>Enable gzip/brotli compression</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-4">Option B</div>
    <div class="text-lg mb-4">Fonts & JavaScript</div>
    <ul class="text-sm">
      <li>font-display: swap on all fonts</li>
      <li>Remove render-blocking fonts</li>
      <li>Add preconnect for external domains</li>
      <li>Remove lodash, moment, jQuery</li>
      <li>Remove blocking third-party scripts</li>
      <li>Remove 500ms inline script</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 1: Vote

## Performance

<div class="text-4xl pt-4 opacity-50">Choose your optimization</div>

<VoteButtons :vote-index="0" label-a="Images & Transfer" label-b="Fonts & JS" :next-slide="12" />

---

# Day 1: Winning Option

## Applied fixes details

<WinnerDisplay :vote-index="0" />

---

# Day 1: Application

<ApplicationDisplay :vote-index="0" category="Performance" floor="Floor 1" />

---

# Day 2: Accessibility

## Lighthouse Accessibility Criteria

- Color Contrast
- Interactive Elements
- ARIA Attributes
- Semantic HTML
- Keyboard Navigation

<div class="pt-4">
  Current score: <span class="text-red-500 font-bold text-2xl">45</span>
</div>

---

# Day 2: Comparison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-4">Option A</div>
    <div class="text-lg mb-4">Visual</div>
    <ul class="text-sm">
      <li>Improve contrasts (4.5:1 ratio)</li>
      <li>Add visible focus indicators</li>
      <li>Labels on all inputs</li>
      <li>Accessible names on links/buttons</li>
      <li>Controls on auto-play media</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-4">Option B</div>
    <div class="text-lg mb-4">Semantic</div>
    <ul class="text-sm">
      <li>Replace clickable divs with buttons</li>
      <li>Add lang attribute to html</li>
      <li>Add skip link</li>
      <li>Fix keyboard traps</li>
      <li>Fix heading hierarchy (h1→h2→h3)</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 2: Vote

## Accessibility

<div class="text-4xl pt-4 opacity-50">Choose your optimization</div>

<VoteButtons :vote-index="1" label-a="Visual" label-b="Semantic" :next-slide="17" />

---

# Day 2: Winning Option

## Applied fixes details

<WinnerDisplay :vote-index="1" />

---

# Day 2: Application

<ApplicationDisplay :vote-index="1" category="Accessibility" floor="Floor 2" />

---

# Day 3: Best Practices

## Lighthouse Best Practices Criteria

- Console Errors
- HTTPS
- Deprecated APIs
- Browser Compatibility
- Security Issues

<div class="pt-4">
  Current score: <span class="text-orange-500 font-bold text-2xl">58</span>
</div>

---

# Day 3: Comparison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-4">Option A</div>
    <div class="text-lg mb-4">Console & Security</div>
    <ul class="text-sm">
      <li>Remove console.log in production</li>
      <li>Add rel="noopener" on external links</li>
      <li>Remove document.write()</li>
      <li>Fix console errors</li>
      <li>Update vulnerable libraries</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-4">Option B</div>
    <div class="text-lg mb-4">Modern Standards</div>
    <ul class="text-sm">
      <li>Fix image display dimensions</li>
      <li>Verify doctype</li>
      <li>Remove aggressive permission requests</li>
      <li>Add passive listeners (scroll, touch)</li>
      <li>Hide source maps in production</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 3: Vote

## Best Practices

<div class="text-4xl pt-4 opacity-50">Choose your optimization</div>

<VoteButtons :vote-index="2" label-a="Console & Security" label-b="Modern Standards" :next-slide="22" />

---

# Day 3: Winning Option

## Applied fixes details

<WinnerDisplay :vote-index="2" />

---

# Day 3: Application

<ApplicationDisplay :vote-index="2" category="Best Practices" floor="Floor 3" />

---

# Day 4: SEO

## Lighthouse SEO Criteria

- Meta Tags
- Crawlability
- Mobile Friendly
- Structured Data
- Link Text

<div class="pt-4">
  Current score: <span class="text-red-500 font-bold text-2xl">41</span>
</div>

---

# Day 4: Comparison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-4">Option A</div>
    <div class="text-lg mb-4">Meta & Structure</div>
    <ul class="text-sm">
      <li>Add unique title</li>
      <li>Add meta name="description"</li>
      <li>One h1 per page</li>
      <li>Verify viewport meta</li>
      <li>Add canonical URL</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-4">Option B</div>
    <div class="text-lg mb-4">Content & Links</div>
    <ul class="text-sm">
      <li>Descriptive link text (no "click here")</li>
      <li>Alt attributes on all images</li>
      <li>Remove meta noindex</li>
      <li>Crawlable navigation (real a href)</li>
      <li>Remove redirect chains</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 4: Vote

## SEO

<div class="text-4xl pt-4 opacity-50">Choose your optimization</div>

<VoteButtons :vote-index="3" label-a="Meta & Structure" label-b="Content & Links" :next-slide="27" />

---

# Day 4: Winning Option

## Applied fixes details

<WinnerDisplay :vote-index="3" />

---

# Day 4: Application

<ApplicationDisplay :vote-index="3" category="SEO" floor="Complete + Lantern" />

---

# Recap

## Lighthouse complete!

<PathDisplay />

---

# Best Solution

## Optimal combination

<BestPath />

---

# Conclusion

## What we learned

- Lighthouse optimizations have measurable impact
- Each category has its own criteria
- Optimization choices are often trade-offs
- The key is to prioritize based on context

<div class="pt-8 text-center">
  (TBD)
</div>

---
layout: center
---

# Questions?

<div class="text-6xl pt-8">
  🏴‍☠️
</div>

<div class="pt-8 opacity-50">
  Lighthouse Pirates - An interactive presentation
</div>
