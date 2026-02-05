---
theme: default
title: Let's build a lighthouse!
info: |
  ## Let's build a lighthouse!
  An interactive presentation where the audience votes to optimize Lighthouse Performance score.
  Together, we'll transform a struggling website into a high-performance beacon.
drawings:
  persist: false
transition: slide-left
mdc: true
fonts:
  sans: 'Crimson Text'
  serif: 'Germania One'
  mono: 'Fira Code'
css: unocss
---

<style src="./styles/theme.css"></style>
<style src="./styles/modals.css"></style>

# Join the crew!

Scan the QR code to join the crew

<div class="flex justify-center pt-8">
  <img src="/qr-code.png" alt="Scan to join" class="w-64 h-64" />
</div>

---

# Audience question

What's your knowledge level of Lighthouse?

<PollButtons pollId="knowledge-level" />

---

# The Lighthouse score

Google's open-source tool for auditing web page quality

<div class="grid grid-cols-4 gap-4 pt-8 text-center">
  <div class="p-4 border-2 border-orange-500 rounded">
    <div class="text-4xl mb-2">⚡</div>
    <div class="font-bold">Performance</div>
    <div class="text-xs opacity-70">Speed & efficiency</div>
  </div>
  <div class="p-4 opacity-50">
    <div class="text-4xl mb-2">♿</div>
    <div class="font-bold">Accessibility</div>
    <div class="text-xs opacity-70">Usable by everyone</div>
  </div>
  <div class="p-4 opacity-50">
    <div class="text-4xl mb-2">✅</div>
    <div class="font-bold">Best Practices</div>
    <div class="text-xs opacity-70">Modern standards</div>
  </div>
  <div class="p-4 opacity-50">
    <div class="text-4xl mb-2">🔍</div>
    <div class="font-bold">SEO</div>
    <div class="text-xs opacity-70">Search visibility</div>
  </div>
</div>

<div class="text-center pt-4 text-sm opacity-70">Today we focus on <strong>Performance</strong></div>

---

# Why Performance matters?

<div class="grid grid-cols-2 gap-6 pt-4">
  <div class="p-4 border rounded">
    <div class="text-4xl font-bold text-orange-500 mb-1">53%</div>
    <div class="text-xs opacity-70">of users leave if page loads > 3s</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-4xl font-bold text-blue-500 mb-1">70%</div>
    <div class="text-xs opacity-70">of consumers say speed affects purchase decisions</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-4xl font-bold text-green-500 mb-1">2x</div>
    <div class="text-xs opacity-70">faster sites see 2x conversion rates</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-4xl font-bold text-purple-500 mb-1">100ms</div>
    <div class="text-xs opacity-70">delay = 1% drop in revenue (Amazon)</div>
  </div>
</div>

---

# Our example

Our pirate test shop

<div class="flex justify-center pt-8">
  <div class="p-8 border rounded">
    <div class="text-2xl mb-4">🏪 BlackMarket</div>
  </div>
</div>

---

<div class="absolute inset-0">
  <BlackMarketIframe />
</div>

---

# Our starting point

The Performance score of our BlackMarket website is pretty low

<div class="text-center pt-8">
  <div class="text-8xl font-bold text-red-500">38<span class="text-2xl text-white opacity-50">/100</span></div>
  <div class="mt-4 text-2xl">Performance</div>
</div>

---

# Our mission

5 days to build the best lighthouse possible

One day = one floor = one Performance metric

<div class="grid grid-cols-5 gap-3 pt-8 text-center">
  <div class="p-3 border rounded">
    <div class="font-bold">Day 1</div>
    <div>CLS</div>
    <div class="text-xs opacity-70">Layout Shift</div>
  </div>
  <div class="p-3 border rounded">
    <div class="font-bold">Day 2</div>
    <div>FCP</div>
    <div class="text-xs opacity-70">First Paint</div>
  </div>
  <div class="p-3 border rounded">
    <div class="font-bold">Day 3</div>
    <div>LCP</div>
    <div class="text-xs opacity-70">Largest Paint</div>
  </div>
  <div class="p-3 border rounded">
    <div class="font-bold">Day 4</div>
    <div>TBT</div>
    <div class="text-xs opacity-70">Blocking Time</div>
  </div>
  <div class="p-3 border rounded">
    <div class="font-bold">Day 5</div>
    <div>SI</div>
    <div class="text-xs opacity-70">Speed Index</div>
  </div>
</div>

At every step, we will decide which optimization to apply, following our instinct!

---
layout: center
---

# DAY 1

---

<MetricIntro
  h1="CLS"
  h2="Cumulative Layout Shift"
  :weight="25"
  :thresholds="[0.1, 0.25]"
  h3="Impact fraction × Distance fraction"
  :tags="['Core Web Vital : Impact SEO !', 'High CLS destroys trust','User initiated shifts are excluded','Only the worst burst of shift counts']"
  :business-info="[
    { company: 'Yahoo! Japan', comment: 'Reduced CLS by 0.2 → 15% increase in page views' },
  ]"
>
  <template #right>
    <div class="w-full h-full bg-gray-700 rounded flex items-center justify-center text-gray-400">
      Video Placeholder - FCP
    </div>
  </template>
</MetricIntro>

---

<ChoiceFromMetric :metric-index="0" />

---
layout: center
---

<VoteFromMetric :metric-index="0" />

---

<WinnerDisplay :vote-index="0" />

---

# Day 1: Application

<ApplicationDisplayFromMetric :metric-index="0" />

---
layout: center
---

# DAY 2

---

<MetricIntro
  h1="FCP"
  h2="First Contentful Paint"
  :weight="10"
  :thresholds="['1.8 sec', '3.0 sec']"
  h3="Text, image, SVG or canvas"
  :tags="['All about perception', 'Low FCP is reassuring']"
>
  <template #bottom>
    <div class="mt-20 relative">
          <div class="flex justify-around mb-2 text-sm font-semibold">
        <span class="text-blue-500">TTFB</span>
        <span class="text-green-500">Rendering path</span>
      </div>
      <!-- Timeline bar -->
      <div class="h-2 bg-gray-300 rounded-full relative">
        <!-- TTFB section -->
        <div class="absolute left-0 w-1/2 h-full bg-blue-400 rounded-l-full"></div>
        <!-- Rendering path section -->
        <div class="absolute left-1/2 w-1/2 h-full bg-green-400 rounded-r-full"></div>
      </div>
      <!-- Markers -->
      <div class="flex justify-between mt-1">
        <div class="flex flex-col items-center">
          <span class="text-sm mt-1">Request</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-sm mt-1">First byte</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-sm mt-1">Display</span>
        </div>
      </div>
    </div>
  </template>
  <template #right>
    <div class="w-full h-full bg-gray-700 rounded flex items-center justify-center text-gray-400">
      Video Placeholder - FCP
    </div>
  </template>
</MetricIntro>

---

# Day 2: The Choice

<ChoiceFromMetric :metric-index="1" />

---
layout: center
---

# Day 2: Vote

## FCP - First Contentful Paint

<VoteFromMetric :metric-index="1" />

---

# Day 2: Winning Option

<WinnerDisplay :vote-index="1" />

---

# Day 2: Application

<ApplicationDisplayFromMetric :metric-index="1" />

---
layout: center
---

# DAY 3

---

# Day 3: LCP

<div class="absolute top-4 right-8 text-md text-center">
  Weight <div class="m-auto text-orange-500 font-bold text-3xl">25%</div>
</div>

## Largest Contentful Paint

<div class="text-sm opacity-70 mb-4">
  Time until the largest content element is rendered. Lower is better.
</div>

<div class="grid grid-cols-2 gap-6 pt-4">
  <div class="p-4 border rounded">
    <div class="text-xl font-bold mb-2">What it measures</div>
    <div class="text-sm opacity-70">
      How quickly the main content of a page is loaded and visible to users.
    </div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-xl font-bold mb-2">Good score</div>
    <div class="text-3xl font-bold text-green-400">&lt; 2.5s</div>
  </div>
</div>

---

# Day 3: The Choice

<ChoiceFromMetric :metric-index="2" />

---
layout: center
---

# Day 3: Vote

## LCP - Largest Contentful Paint

<VoteFromMetric :metric-index="2" />

---

# Day 3: Winning Option

<WinnerDisplay :vote-index="2" />

---

# Day 3: Application

<ApplicationDisplayFromMetric :metric-index="2" />

---
layout: center
---

# DAY 4

---

# Day 4: TBT

<div class="absolute top-4 right-8 text-md text-center">
  Weight <div class="m-auto text-orange-500 font-bold text-3xl">30%</div>
</div>

## Total Blocking Time

<div class="text-sm opacity-70 mb-4">
  Sum of all long tasks (>50ms) blocking the main thread. Lower is better.
</div>

<div class="grid grid-cols-2 gap-6 pt-4">
  <div class="p-4 border rounded">
    <div class="text-xl font-bold mb-2">What it measures</div>
    <div class="text-sm opacity-70">
      How long the main thread is blocked, preventing user interaction.
    </div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-xl font-bold mb-2">Good score</div>
    <div class="text-3xl font-bold text-green-400">&lt; 200ms</div>
  </div>
</div>

---

# Day 4: The Choice

<ChoiceFromMetric :metric-index="3" />

---
layout: center
---

# Day 4: Vote

## TBT - Total Blocking Time

<VoteFromMetric :metric-index="3" />

---

# Day 4: Winning Option

<WinnerDisplay :vote-index="3" />

---

# Day 4: Application

<ApplicationDisplayFromMetric :metric-index="3" />

---
layout: center
---

# DAY 5

---

# Day 5: SI

<div class="absolute top-4 right-8 text-md text-center">
  Weight <div class="m-auto text-orange-500 font-bold text-3xl">10%</div>
</div>

## Speed Index

<div class="text-sm opacity-70 mb-4">
  How quickly content is visually displayed during page load. Lower is better.
</div>

<div class="grid grid-cols-2 gap-6 pt-4">
  <div class="p-4 border rounded">
    <div class="text-xl font-bold mb-2">What it measures</div>
    <div class="text-sm opacity-70">
      The average time at which visible parts of the page are displayed.
    </div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-xl font-bold mb-2">Good score</div>
    <div class="text-3xl font-bold text-green-400">&lt; 3.4s</div>
  </div>
</div>

---

# Day 5: The Choice

<ChoiceFromMetric :metric-index="4" />

---
layout: center
---

# Day 5: Vote

## SI - Speed Index

<VoteFromMetric :metric-index="4" />

---

# Day 5: Winning Option

<WinnerDisplay :vote-index="4" />

---

# Day 5: Application

<ApplicationDisplayFromMetric :metric-index="4" />

---

# Recap

## Lighthouse complete!

<PathDisplay />

---

# Conclusion

## What we learned

- Performance optimizations have measurable impact
- 5 Performance metrics: CLS (25%), FCP (10%), LCP (25%), TBT (30%), SI (10%)
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
  Let's build a lighthouse! - An interactive presentation
</div>
