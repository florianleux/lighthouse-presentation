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
  <img src="/qr-code.png" alt="Scan to join" class="w-64 h-64" />
</div>


---

# Why Lighthouse?

<div class="grid grid-cols-2 gap-6 pt-4">
  <div class="p-4 border rounded">
    <div class="text-4xl font-bold text-orange-500 mb-1">53%</div>
    <div class="text-xs opacity-70">of users leave if page loads > 3s</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-4xl font-bold text-blue-500 mb-1">15%</div>
    <div class="text-xs opacity-70">of users have a disability</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-4xl font-bold text-green-500 mb-1">82%</div>
    <div class="text-xs opacity-70">of users won't buy from an unsecure site</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-4xl font-bold text-purple-500 mb-1">68%</div>
    <div class="text-xs opacity-70">of online experiences begin with search</div>
  </div>
</div>

---

# Lighthouse measures what matters

<div class="grid grid-cols-4 gap-4 pt-8 text-center">
  <div class="p-4">
    <div class="text-4xl mb-2">⚡</div>
    <div class="font-bold">Performance</div>
    <div class="text-xs opacity-70">Speed & efficiency</div>
  </div>
  <div class="p-4">
    <div class="text-4xl mb-2">♿</div>
    <div class="font-bold">Accessibility</div>
    <div class="text-xs opacity-70">Usable by everyone</div>
  </div>
  <div class="p-4">
    <div class="text-4xl mb-2">✅</div>
    <div class="font-bold">Best Practices</div>
    <div class="text-xs opacity-70">Modern standards</div>
  </div>
  <div class="p-4">
    <div class="text-4xl mb-2">🔍</div>
    <div class="font-bold">SEO</div>
    <div class="text-xs opacity-70">Search visibility</div>
  </div>
</div>
---

# Audience question

What's your knowledge level of Lighthouse?

<PollButtons pollId="knowledge-level" />

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

<div class="absolute inset-0">
  <BlackMarketIframe />
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

# Base Cleanup

## Proactive Design Matters

Before diving into optimizations, let's remove obvious UX anti-patterns that hurt scores.

<div class="grid grid-cols-2 gap-8 pt-4">
  <div class="p-4 border border-red-500/50 rounded bg-red-500/10">
    <div class="text-lg font-bold mb-2 text-red-400">Removed</div>
    <ul class="text-sm space-y-1">
      <li>6 spam popup modals</li>
      <li>8 promotional banners</li>
      <li>Dynamic layout shifts</li>
      <li>Font size changes</li>
    </ul>
  </div>
  <div class="p-4 border border-green-500/50 rounded bg-green-500/10">
    <div class="text-lg font-bold mb-2 text-green-400">Impact</div>
    <div class="text-3xl font-bold">+25 points</div>
    <div class="text-sm opacity-70">Performance: 31 → 56</div>
    <div class="text-sm opacity-70">CLS: 1.08 → 0.025</div>
  </div>
</div>

<div class="pt-6 text-center text-sm opacity-60">
  Good design is the first optimization. No code change needed - just remove bad patterns.
</div>

---

# Day 1: Performance

## How fast does your page load and become interactive?

<div class="text-sm opacity-70 mb-4">
  Performance is measured by <strong>6 Core Web Vitals</strong>, each with different weights.
</div>

<div class="grid grid-cols-3 gap-3 text-center text-sm">
  <div class="p-2 border rounded">
    <div class="font-bold text-green-400">TBT</div>
    <div class="text-xs opacity-70">30%</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-green-400">LCP</div>
    <div class="text-xs opacity-70">25%</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-blue-400">CLS</div>
    <div class="text-xs opacity-70">25%</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-blue-400">FCP</div>
    <div class="text-xs opacity-70">10%</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-gray-400">SI</div>
    <div class="text-xs opacity-70">10%</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-gray-400">TTI</div>
    <div class="text-xs opacity-70">0%</div>
  </div>
</div>

<div class="pt-4">
  Current score: <span class="text-red-500 font-bold text-2xl">32</span>
</div>

---

# Day 1: Comparison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-2">Option A</div>
    <div class="text-lg mb-3">Images</div>
    <div class="text-sm opacity-70 mb-4 italic">Optimize visual content delivery and layout stability</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>LCP</code> - Largest Contentful Paint (25%)</li>
      <li><code>CLS</code> - Cumulative Layout Shift (25%)</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-2">Option B</div>
    <div class="text-lg mb-3">Scripts</div>
    <div class="text-sm opacity-70 mb-4 italic">Reduce JavaScript blocking and improve interactivity</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>FCP</code> - First Contentful Paint (10%)</li>
      <li><code>TBT</code> - Total Blocking Time (30%)</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 1: Vote

## Performance

<div class="text-4xl pt-4 opacity-50">Choose your optimization</div>

<VoteButtons :vote-index="0" label-a="Images" label-b="Scripts" :next-slide="16" />

---

# Day 1: Winning Option

## Applied fixes details

<WinnerDisplay :vote-index="0" />

---

# Day 1: Patch 1

<PatchExplanation :vote-index="0" :patch-index="0" />

---

# Day 1: Patch 2

<PatchExplanation :vote-index="0" :patch-index="1" />

---

# Day 1: Patch 3

<PatchExplanation :vote-index="0" :patch-index="2" />

---

# Day 1: Application

<ApplicationDisplay :vote-index="0" category="Performance" floor="Floor 1" />

---

# Day 2: Accessibility

## Can everyone use your site, including people with disabilities?

<div class="text-sm opacity-70 mb-4">
  Accessibility is measured by <strong>~60 audits</strong> with weight-based scoring.
</div>

<div class="grid grid-cols-3 gap-3 text-center text-sm">
  <div class="p-2 border rounded">
    <div class="font-bold text-green-400">Critical</div>
    <div class="text-xs opacity-70">Weight 10</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-blue-400">Serious</div>
    <div class="text-xs opacity-70">Weight 3</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-gray-400">Minor</div>
    <div class="text-xs opacity-70">Weight 1</div>
  </div>
</div>

<div class="text-sm opacity-70 mt-4">
  Critical audits include: button-name, image-alt, label, aria-roles, aria-required-attr...
</div>

<div class="pt-4">
  Current score: <span class="text-red-500 font-bold text-2xl">45</span>
</div>

---

# Day 2: Comparison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-2">Option A</div>
    <div class="text-lg mb-3">Names & Labels</div>
    <div class="text-sm opacity-70 mb-4 italic">Ensure interactive elements are identifiable by assistive technologies</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>button-name</code> - Buttons have accessible name</li>
      <li><code>image-alt</code> - Images have alt text</li>
      <li><code>label</code> - Form inputs have labels</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-2">Option B</div>
    <div class="text-lg mb-3">ARIA</div>
    <div class="text-sm opacity-70 mb-4 italic">Implement correct ARIA attributes for screen reader compatibility</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>aria-roles</code> - Valid ARIA roles</li>
      <li><code>aria-required-attr</code> - Required ARIA attributes</li>
      <li><code>aria-valid-attr-value</code> - Valid attribute values</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 2: Vote

## Accessibility

<div class="text-4xl pt-4 opacity-50">Choose your optimization</div>

<VoteButtons :vote-index="1" label-a="Names & Labels" label-b="ARIA" :next-slide="24" />

---

# Day 2: Winning Option

## Applied fixes details

<WinnerDisplay :vote-index="1" />

---

# Day 2: Patch 1

<PatchExplanation :vote-index="1" :patch-index="0" />

---

# Day 2: Patch 2

<PatchExplanation :vote-index="1" :patch-index="1" />

---

# Day 2: Patch 3

<PatchExplanation :vote-index="1" :patch-index="2" />

---

# Day 2: Application

<ApplicationDisplay :vote-index="1" category="Accessibility" floor="Floor 2" />

---

# Day 3: Best Practices

## Does your site follow modern web standards and avoid deprecated patterns?

<div class="text-sm opacity-70 mb-4">
  Best Practices is measured by <strong>~20 audits</strong> checking for deprecated APIs, security issues, and UX problems.
</div>

<div class="grid grid-cols-3 gap-3 text-center text-sm">
  <div class="p-2 border rounded">
    <div class="font-bold text-green-400">Deprecations</div>
    <div class="text-xs opacity-70">Weight 5</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-blue-400">UX Issues</div>
    <div class="text-xs opacity-70">Weight 3</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-gray-400">Warnings</div>
    <div class="text-xs opacity-70">Weight 1</div>
  </div>
</div>

<div class="text-sm opacity-70 mt-4">
  Includes: deprecations, errors-in-console, inspector-issues, geolocation-on-start, notification-on-start...
</div>

<div class="pt-4">
  Current score: <span class="text-orange-500 font-bold text-2xl">58</span>
</div>

---

# Day 3: Comparison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-2">Option A</div>
    <div class="text-lg mb-3">General</div>
    <div class="text-sm opacity-70 mb-4 italic">Fix deprecated APIs and eliminate console errors</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>deprecations</code> - No deprecated APIs (weight 5)</li>
      <li><code>inspector-issues</code> - No DevTools issues (weight 1)</li>
      <li><code>errors-in-console</code> - No console errors (weight 1)</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-2">Option B</div>
    <div class="text-lg mb-3">Trust & Safety</div>
    <div class="text-sm opacity-70 mb-4 italic">Respect user permissions and avoid intrusive behaviors</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>geolocation-on-start</code> - No auto geolocation (weight 1)</li>
      <li><code>notification-on-start</code> - No auto notification (weight 1)</li>
      <li><code>paste-preventing-inputs</code> - Allow paste (weight 3)</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 3: Vote

## Best Practices

<div class="text-4xl pt-4 opacity-50">Choose your optimization</div>

<VoteButtons :vote-index="2" label-a="General" label-b="Trust & Safety" :next-slide="32" />

---

# Day 3: Winning Option

## Applied fixes details

<WinnerDisplay :vote-index="2" />

---

# Day 3: Patch 1

<PatchExplanation :vote-index="2" :patch-index="0" />

---

# Day 3: Patch 2

<PatchExplanation :vote-index="2" :patch-index="1" />

---

# Day 3: Patch 3

<PatchExplanation :vote-index="2" :patch-index="2" />

---

# Day 3: Application

<ApplicationDisplay :vote-index="2" category="Best Practices" floor="Floor 3" />

---

# Day 4: SEO

## Can search engines find, crawl, and understand your content?

<div class="text-sm opacity-70 mb-4">
  SEO is measured by <strong>10 audits</strong> checking crawlability and content metadata.
</div>

<div class="grid grid-cols-3 gap-3 text-center text-sm">
  <div class="p-2 border rounded">
    <div class="font-bold text-green-400">Critical</div>
    <div class="text-xs opacity-70">Weight ~4</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-blue-400">Standard</div>
    <div class="text-xs opacity-70">Weight 1</div>
  </div>
  <div class="p-2 border rounded">
    <div class="font-bold text-gray-400">Informative</div>
    <div class="text-xs opacity-70">Weight 0</div>
  </div>
</div>

<div class="text-sm opacity-70 mt-4">
  Includes: is-crawlable, document-title, meta-description, robots-txt, link-text, crawlable-anchors...
</div>

<div class="pt-4">
  Current score: <span class="text-red-500 font-bold text-2xl">41</span>
</div>

---

# Day 4: Comparison

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <div class="text-2xl font-bold mb-2">Option A</div>
    <div class="text-lg mb-3">Crawlability</div>
    <div class="text-sm opacity-70 mb-4 italic">Allow search engines to discover and index your pages</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>is-crawlable</code> - Page can be indexed (~4)</li>
      <li><code>crawlable-anchors</code> - Links are crawlable (1)</li>
      <li><code>robots-txt</code> - robots.txt is valid (1)</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <div class="text-2xl font-bold mb-2">Option B</div>
    <div class="text-lg mb-3">Content</div>
    <div class="text-sm opacity-70 mb-4 italic">Provide meaningful metadata for search result display</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>document-title</code> - Page has title (1)</li>
      <li><code>meta-description</code> - Has description (1)</li>
      <li><code>link-text</code> - Descriptive link text (1)</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 4: Vote

## SEO

<div class="text-4xl pt-4 opacity-50">Choose your optimization</div>

<VoteButtons :vote-index="3" label-a="Crawlability" label-b="Content" :next-slide="40" />

---

# Day 4: Winning Option

## Applied fixes details

<WinnerDisplay :vote-index="3" />

---

# Day 4: Patch 1

<PatchExplanation :vote-index="3" :patch-index="0" />

---

# Day 4: Patch 2

<PatchExplanation :vote-index="3" :patch-index="1" />

---

# Day 4: Patch 3

<PatchExplanation :vote-index="3" :patch-index="2" />

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
