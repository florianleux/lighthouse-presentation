---
theme: default
title: Let's build a lighthouse!
info: |
  ## Let's build a lighthouse!
  An interactive presentation where the audience votes to optimize Lighthouse scores.
  Together, we'll transform a struggling website into a high-performance beacon.
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

# Audience question

What's your knowledge level of Lighthouse?

<PollButtons pollId="knowledge-level" />

---

# The Lighthouse score

Google's open-source tool for auditing web page quality

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

# Why does it matters?

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

The 4  Lighthouse scores of our BlackMarket website are pretty low

<div class="grid grid-cols-4 gap-8 pt-8 text-center">
  <div>
    <div class="text-5xl font-bold text-red-500">38<span class="text-lg text-white opacity-50">/100</span></div>
    <div class="mt-2">Performance</div>
  </div>
  <div>
    <div class="text-5xl font-bold text-red-500">47<span class="text-lg text-white opacity-50">/100</span></div>
    <div class="mt-2">Accessibility</div>
  </div>
  <div>
    <div class="text-5xl font-bold text-red-500">35<span class="text-lg text-white opacity-50">/100</span></div>
    <div class="mt-2">Best Practices</div>
  </div>
  <div>
    <div class="text-5xl font-bold text-red-500">25<span class="text-lg text-white opacity-50">/100</span></div>
    <div class="mt-2">SEO</div>
  </div>
</div>

---

# Our mission

4 days to build the best lighthouse possible

One day = one floor = one subscore 

<div class="grid grid-cols-4 gap-4 pt-8 text-center">
  <div class="p-4 border rounded">
    <div class="font-bold">Day 1</div>
    <div>Performance</div>
    <div>38 --> ??</div>
  </div>
  <div class="p-4 border rounded">
    <div class="font-bold">Day 2</div>
    <div>Accessibility</div>
    <div>47 --> ??</div>

  </div>
  <div class="p-4 border rounded">
    <div class="font-bold">Day 3</div>
    <div>Best Practices</div>
    <div>35 --> ??</div>

  </div>
  <div class="p-4 border rounded">
    <div class="font-bold">Day 4</div>
    <div>SEO</div>
    <div>25 --> ??</div>

  </div>
</div>

At every step, we will need to decide with minimal information on what part of the subscore we want to focus, following our instinct!

---
layout: center
---

# DAY 1

---

# Day 1: Performance

<div class="absolute top-4  right-8 text-md text-center">
  Initial Score <div class="m-auto text-red-500 font-bold text-5xl">38</div>
</div>

## How fast does your page load and become interactive?

<div class="text-sm opacity-70 mb-4">
  Performance is measured by <strong>6 Core Web Vitals</strong>, each with different weights.
</div>

<div class="flex flex-wrap justify-center gap-3 text-center">
  <div class="p-3 border rounded w-[30%]">
    <div class="text-3xl font-bold text-green-400">TBT</div>
    <div class="text-xs opacity-70">Total Blocking Time</div>
    <div class="text-sm font-semibold mt-1">30%</div>
  </div>
  <div class="p-3 border rounded w-[30%]">
    <div class="text-3xl font-bold text-green-400">LCP</div>
    <div class="text-xs opacity-70">Largest Contentful Paint</div>
    <div class="text-sm font-semibold mt-1">25%</div>
  </div>
  <div class="p-3 border rounded w-[30%]">
    <div class="text-3xl font-bold text-blue-400">CLS</div>
    <div class="text-xs opacity-70">Cumulative Layout Shift</div>
    <div class="text-sm font-semibold mt-1">25%</div>
  </div>
  <div class="p-3 border rounded w-[30%]">
    <div class="text-3xl font-bold text-blue-400">FCP</div>
    <div class="text-xs opacity-70">First Contentful Paint</div>
    <div class="text-sm font-semibold mt-1">10%</div>
  </div>
  <div class="p-3 border rounded w-[30%]">
    <div class="text-3xl font-bold text-gray-400">SI</div>
    <div class="text-xs opacity-70">Speed Index</div>
    <div class="text-sm font-semibold mt-1">10%</div>
  </div>
</div>

---

# Day 1: LCP & CLS

<div class="grid grid-cols-2 gap-8">
  <div class="p-4 border rounded">
    <div class="text-3xl font-bold text-green-400 mb-2">LCP</div>
    <div class="text-lg font-semibold mb-2">Largest Contentful Paint</div>
    <div class="text-sm opacity-70 mb-3">Time until the largest visible element is rendered</div>
    <div class="text-xs mb-2"><strong>Weight:</strong> 25%</div>
    <div class="text-xs mb-2"><strong>Good:</strong> &lt; 2.5s</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-3xl font-bold text-blue-400 mb-2">CLS</div>
    <div class="text-lg font-semibold mb-2">Cumulative Layout Shift</div>
    <div class="text-sm opacity-70 mb-3">Measures unexpected layout shifts during page load</div>
    <div class="text-xs mb-2"><strong>Weight:</strong> 25%</div>
    <div class="text-xs mb-2"><strong>Good:</strong> &lt; 0.1</div>
  </div>
</div>

<!--
**LCP Common culprits:**
- Unoptimized hero images
- Slow server response
- Render-blocking resources
- Client-side rendering delays

**CLS Common culprits:**
- Images without dimensions
- Ads/embeds without reserved space
- Dynamically injected content
- Web fonts causing FOUT/FOIT
-->

---

# Day 1: FCP & TBT

<div class="grid grid-cols-2 gap-8">
  <div class="p-4 border rounded">
    <div class="text-3xl font-bold text-blue-400 mb-2">FCP</div>
    <div class="text-lg font-semibold mb-2">First Contentful Paint</div>
    <div class="text-sm opacity-70 mb-3">Time until the first text or image is painted</div>
    <div class="text-xs mb-2"><strong>Weight:</strong> 10%</div>
    <div class="text-xs mb-2"><strong>Good:</strong> &lt; 1.8s</div>
  </div>
  <div class="p-4 border rounded">
    <div class="text-3xl font-bold text-green-400 mb-2">TBT</div>
    <div class="text-lg font-semibold mb-2">Total Blocking Time</div>
    <div class="text-sm opacity-70 mb-3">Sum of all long tasks (>50ms) blocking the main thread</div>
    <div class="text-xs mb-2"><strong>Weight:</strong> 30%</div>
    <div class="text-xs mb-2"><strong>Good:</strong> &lt; 200ms</div>
  </div>
</div>

<!--
**FCP Common culprits:**
- Render-blocking CSS/JS
- Large DOM size
- Slow server response (TTFB)
- Unoptimized web fonts

**TBT Common culprits:**
- Long JavaScript tasks (>50ms)
- Heavy third-party scripts
- Large bundle sizes
- Inefficient event handlers
-->

---

# Day 1: The Choice

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <span class="text-2xlmb-2 font-light">Option A: </span>
    <span class="text-lg mb-3 font-bold">Images</span>
    <div class="text-sm opacity-70 mb-4 italic">Optimize visual content delivery and layout stability</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>LCP</code> - Largest Contentful Paint (25% weight)</li>
      <li><code>CLS</code> - Cumulative Layout Shift (25% weight)</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <span class="text-2xlmb-2 font-light">Option B: </span>
    <span class="text-lg mb-3 font-bold">Scripts</span>
    <div class="text-sm opacity-70 mb-4 italic">Reduce JavaScript blocking and improve interactivity</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>FCP</code> - First Contentful Paint (10% weight)</li>
      <li><code>TBT</code> - Total Blocking Time (30% weight)</li>
    </ul>
  </div>
</div>

---
layout: center
---

# Day 1: Vote

## Performance

<div class="text-4xl pt-4 opacity-50">Choose your optimization</div>

<VoteButtons :vote-index="0" label-a="Images" label-b="Scripts" :next-slide="15" />

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
layout: center
---

# DAY 2

---

# Day 2: Accessibility

<div class="absolute top-4  right-8 text-md text-center">
  Initial Score <div class="m-auto text-red-500 font-bold text-5xl">47</div>
</div>

## Can everyone use your site, including people with disabilities?

<div class="text-sm opacity-70 mb-4">
  Accessibility is measured by <strong>~60 pass/fail audits</strong> with weight-based scoring.
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

---

# Day 2: How Screen Readers Work

<div class="grid grid-cols-2 gap-6">
  <div>
    <div class="text-xl font-bold mb-3">The Accessibility Tree</div>
    <div class="text-sm opacity-70 mb-3">
      Browsers build an accessibility tree from your HTML, which screen readers use to announce content.
    </div>
    <div class="text-xs mb-2"><strong>What gets exposed:</strong></div>
    <ul class="text-xs opacity-70 mb-4">
      <li><strong>Role</strong> - What is it? (button, link, heading...)</li>
      <li><strong>Name</strong> - What's it called? (label, alt text...)</li>
      <li><strong>State</strong> - What's its status? (checked, expanded...)</li>
      <li><strong>Value</strong> - What's the current value? (input text...)</li>
    </ul>
    <div class="p-2 bg-blue-500/20 rounded text-xs">
      <strong>Tip:</strong> Use DevTools → Accessibility panel to inspect the tree
    </div>
  </div>
  <div>
    <div class="text-lg font-bold mb-2">Screen Reader Announcements</div>
    <div class="p-3 bg-gray-800 rounded font-mono text-xs mb-2">
      <div class="opacity-50 mb-1">&lt;button&gt;Submit&lt;/button&gt;</div>
      <div class="text-green-400">"Submit, button"</div>
    </div>
    <div class="p-3 bg-gray-800 rounded font-mono text-xs mb-2">
      <div class="opacity-50 mb-1">&lt;div onclick="submit()"&gt;Submit&lt;/div&gt;</div>
      <div class="text-red-400">"Submit" (no role announced)</div>
    </div>
    <div class="p-3 bg-gray-800 rounded font-mono text-xs">
      <div class="opacity-50 mb-1">&lt;img src="cat.jpg" /&gt;</div>
      <div class="text-red-400">"cat.jpg, image" (filename, not description)</div>
    </div>
    <div class="text-xs opacity-70 mt-3">
      Native HTML elements provide roles automatically. Generic elements like &lt;div&gt; and &lt;span&gt; have no role.
    </div>
  </div>
</div>

---

# Day 2: What is ARIA?

<div class="grid grid-cols-2 gap-6">
  <div>
    <div class="text-xl font-bold mb-3">ARIA = Accessible Rich Internet Applications</div>
    <div class="text-sm opacity-70 mb-3">
      HTML attributes that make dynamic content accessible to assistive technologies.
    </div>
    <div class="text-xs mb-2"><strong>Examples:</strong></div>
    <ul class="text-xs opacity-70">
      <li><code>role="menu"</code> - Announces element as menu</li>
      <li><code>aria-expanded="true"</code> - Indicates open state</li>
      <li><code>aria-label="Close"</code> - Provides accessible name</li>
    </ul>
    <div class="mt-4 p-3 border border-red-500 rounded bg-red-500/10">
      <div class="text-sm font-bold text-red-400 mb-1">⚠️ "No ARIA is better than bad ARIA"</div>
      <div class="text-xs opacity-70">
        WebAIM found pages with ARIA average <strong>41% more errors</strong> than those without.
      </div>
    </div>
  </div>
  <div class="p-4 border-2 border-amber-500 rounded bg-amber-500/10">
    <div class="text-lg font-bold mb-2 text-amber-400">First Rule of ARIA</div>
    <div class="text-xs italic mb-3">
      "If you can use a native HTML element with the semantics and behavior you require already built in, instead of re-purposing an element and adding ARIA, then do so."
    </div>
    <div class="text-xs opacity-50 mb-3">— W3C WAI-ARIA Authoring Practices</div>
    <div class="text-xs mb-2"><strong>If you use ARIA, you must:</strong></div>
    <ul class="text-xs opacity-70">
      <li>Implement keyboard behavior in JavaScript</li>
      <li>Manage focus states manually</li>
      <li>Keep ARIA states in sync with UI</li>
    </ul>
    <div class="text-sm mt-3 p-2 bg-green-500/20 rounded">
      <strong>Prefer:</strong> <code>&lt;button&gt;</code> over <code>&lt;div role="button"&gt;</code>
    </div>
  </div>
</div>

---

# Day 2: The Choice

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <span class="text-2xlmb-2 font-light">Option A: </span>
    <span class="text-lg mb-3 font-bold">Names & Labels</span>
    <div class="text-sm opacity-70 mb-4 italic">Ensure interactive elements are identifiable by assistive technologies</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>button-name</code> - Buttons have accessible name</li>
      <li><code>image-alt</code> - Images have alt text</li>
      <li><code>label</code> - Form inputs have labels</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <span class="text-2xlmb-2 font-light">Option B: </span>
    <span class="text-lg mb-3 font-bold">ARIA</span>
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

<VoteButtons :vote-index="1" label-a="Names & Labels" label-b="ARIA" :next-slide="26" />

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
layout: center
---

# DAY 3

---

# Day 3: Best Practices

<div class="absolute top-4  right-8 text-md text-center">
  Initial Score <div class="m-auto text-red-500 font-bold text-5xl">35</div>
</div>

## Does your site follow modern web standards and avoid deprecated patterns?

<div class="text-sm opacity-70 mb-4">
  Best Practices is measured by <strong>~20 pass/fail audits</strong> checking for deprecated APIs, security issues, and UX problems.
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

---

# Day 3: Console & DevTools Issues

<div class="grid grid-cols-2 gap-6">
  <div>
    <div class="text-xl font-bold mb-3">Why Console Errors Matter</div>
    <div class="text-sm opacity-70 mb-3">
      Errors and warnings in the browser console indicate problems that affect user experience and site reliability.
    </div>
    <div class="text-xs mb-2"><strong>Types of issues:</strong></div>
    <ul class="text-xs opacity-70 mb-4">
      <li><strong>JavaScript errors</strong> - Broken functionality</li>
      <li><strong>Network errors</strong> - Failed resources</li>
      <li><strong>Security warnings</strong> - Mixed content, CORS</li>
      <li><strong>Deprecation notices</strong> - APIs being removed</li>
    </ul>
    <div class="p-2 bg-red-500/20 rounded text-xs">
      <strong>Impact:</strong> Console errors often indicate bugs users will encounter
    </div>
  </div>
  <div>
    <div class="text-lg font-bold mb-2">Deprecated APIs</div>
    <div class="text-sm opacity-70 mb-3">
      Using deprecated APIs means your code may break in future browser versions.
    </div>
    <div class="p-3 bg-gray-800 rounded font-mono text-xs mb-2">
      <div class="text-amber-400">⚠️ [Deprecation] document.domain setter</div>
      <div class="text-xs opacity-50 mt-1">will be removed in M115</div>
    </div>
    <div class="p-3 bg-gray-800 rounded font-mono text-xs mb-2">
      <div class="text-amber-400">⚠️ [Deprecation] Unload event listeners</div>
      <div class="text-xs opacity-50 mt-1">unreliable on mobile</div>
    </div>
    <div class="text-xs opacity-70 mt-3">
      <strong>Lighthouse checks:</strong> deprecations, errors-in-console, inspector-issues
    </div>
  </div>
</div>

---

# Day 3: Permission APIs & User Trust

<div class="grid grid-cols-2 gap-6">
  <div>
    <div class="text-xl font-bold mb-3">The Permission Problem</div>
    <div class="text-sm opacity-70 mb-3">
      Requesting permissions too early destroys user trust and leads to permanent denials.
    </div>
    <div class="text-xs mb-2"><strong>Bad patterns:</strong></div>
    <div class="p-3 bg-gray-800 rounded font-mono text-xs mb-2">
      <div class="opacity-50">// On page load:</div>
      <div class="text-red-400">navigator.geolocation.getCurrentPosition()</div>
      <div class="text-red-400">Notification.requestPermission()</div>
    </div>
    <div class="text-xs opacity-70 mb-2">
      Users haven't even seen your content yet - why would they trust you with their location?
    </div>
    <div class="p-2 bg-amber-500/20 rounded text-xs">
      <strong>81%</strong> of users deny permissions requested on page load
    </div>
  </div>
  <div>
    <div class="text-lg font-bold mb-2">Best Practices</div>
    <ul class="text-xs opacity-70 mb-3">
      <li>Request permissions only when needed</li>
      <li>Explain why before asking</li>
      <li>Provide value before requesting access</li>
      <li>Accept "no" gracefully</li>
    </ul>
    <div class="p-3 border rounded mb-3">
      <div class="text-xs font-bold mb-1">Paste Prevention</div>
      <div class="text-xs opacity-70">
        Blocking paste on password/email fields forces users to type manually, increasing errors and frustration.
      </div>
      <div class="text-xs mt-2 text-red-400">
        <code>onpaste="return false"</code> ← Anti-pattern
      </div>
    </div>
    <div class="text-xs opacity-70">
      <strong>Lighthouse checks:</strong> geolocation-on-start, notification-on-start, paste-preventing-inputs
    </div>
  </div>
</div>

---

# Day 3: The Choice

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <span class="text-2xlmb-2 font-light">Option A: </span>
    <span class="text-lg mb-3 font-bold">General</span>
    <div class="text-sm opacity-70 mb-4 italic">Fix deprecated APIs and eliminate console errors</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>deprecations</code> - No deprecated APIs (weight 5)</li>
      <li><code>inspector-issues</code> - No DevTools issues (weight 1)</li>
      <li><code>errors-in-console</code> - No console errors (weight 1)</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <span class="text-2xlmb-2 font-light">Option B: </span>
    <span class="text-lg mb-3 font-bold">Trust & Safety</span>
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

<VoteButtons :vote-index="2" label-a="General" label-b="Trust & Safety" :next-slide="37" />

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
layout: center
---

# DAY 4

---

# Day 4: SEO

<div class="absolute top-4  right-8 text-md text-center">
  Initial Score <div class="m-auto text-red-500 font-bold text-5xl">25</div>
</div>

## Can search engines find, crawl, and understand your content?

<div class="text-sm opacity-70 mb-4">
  SEO is measured by <strong>10 pass/fail audits</strong> checking crawlability and content metadata.
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

---

# Day 4: How Search Engines Crawl

<div class="grid grid-cols-2 gap-6">
  <div>
    <div class="text-xl font-bold mb-3">The Crawling Process</div>
    <div class="text-sm opacity-70 mb-3">
      Search engines discover pages by following links and respecting crawl directives.
    </div>
    <div class="text-xs mb-2"><strong>How Googlebot works:</strong></div>
    <ul class="text-xs opacity-70 mb-4">
      <li><strong>Discover</strong> - Find URLs via links, sitemaps</li>
      <li><strong>Crawl</strong> - Fetch and render pages</li>
      <li><strong>Index</strong> - Store content in database</li>
      <li><strong>Rank</strong> - Order results by relevance</li>
    </ul>
    <div class="p-2 bg-blue-500/20 rounded text-xs">
      <strong>If bots can't crawl it, users can't find it in search</strong>
    </div>
  </div>
  <div>
    <div class="text-lg font-bold mb-2">Crawl Blockers</div>
    <div class="p-3 bg-gray-800 rounded font-mono text-xs mb-2">
      <div class="text-red-400">&lt;meta name="robots" content="noindex"&gt;</div>
      <div class="text-xs opacity-50 mt-1">Page won't appear in search results</div>
    </div>
    <div class="p-3 bg-gray-800 rounded font-mono text-xs mb-2">
      <div class="text-red-400">&lt;a href="javascript:goTo('page')"&gt;</div>
      <div class="text-xs opacity-50 mt-1">Bots can't follow JS links</div>
    </div>
    <div class="p-3 bg-gray-800 rounded font-mono text-xs mb-2">
      <div class="text-amber-400">robots.txt: Disallow: /</div>
      <div class="text-xs opacity-50 mt-1">Blocks entire site from crawling</div>
    </div>
    <div class="text-xs opacity-70 mt-3">
      <strong>Lighthouse checks:</strong> is-crawlable, crawlable-anchors, robots-txt
    </div>
  </div>
</div>

---

# Day 4: Search Result Snippets

<div class="grid grid-cols-2 gap-6">
  <div>
    <div class="text-xl font-bold mb-3">What Users See in Search</div>
    <div class="text-sm opacity-70 mb-3">
      Your page's title and description are the first impression users get.
    </div>
    <div class="p-4 bg-gray-800 rounded mb-3">
      <div class="text-blue-400 text-sm hover:underline cursor-pointer">Pirate Supplies - BlackMarket</div>
      <div class="text-green-400 text-xs">https://blackmarket.com/supplies</div>
      <div class="text-xs opacity-70 mt-1">Find the best pirate gear at unbeatable prices. Swords, hats, parrots and more. Free shipping on orders over 100 doubloons.</div>
    </div>
    <div class="text-xs opacity-70">
      Good snippets improve click-through rates (CTR), which can boost rankings.
    </div>
  </div>
  <div>
    <div class="text-lg font-bold mb-2">Common Issues</div>
    <div class="p-3 border rounded mb-2">
      <div class="text-xs font-bold text-red-400">Missing or generic titles</div>
      <div class="text-xs opacity-70 mt-1">"Home" or "Untitled" doesn't tell users what to expect</div>
    </div>
    <div class="p-3 border rounded mb-2">
      <div class="text-xs font-bold text-red-400">No meta description</div>
      <div class="text-xs opacity-70 mt-1">Google will auto-generate one (often poorly)</div>
    </div>
    <div class="p-3 border rounded mb-2">
      <div class="text-xs font-bold text-red-400">Vague link text</div>
      <div class="text-xs opacity-70 mt-1">"Click here" or "Read more" provides no context</div>
    </div>
    <div class="text-xs opacity-70 mt-3">
      <strong>Lighthouse checks:</strong> document-title, meta-description, link-text
    </div>
  </div>
</div>

---

# Day 4: The Choice

<div class="grid grid-cols-2 gap-8">
  <div class="p-6 border-2 border-blue-500 rounded">
    <span class="text-2xlmb-2 font-light">Option A: </span>
    <span class="text-lg mb-3 font-bold">Crawlability</span>
    <div class="text-sm opacity-70 mb-4 italic">Allow search engines to discover and index your pages</div>
    <div class="text-sm mb-1">Target audits:</div>
    <ul class="text-sm">
      <li><code>is-crawlable</code> - Page can be indexed (~4)</li>
      <li><code>crawlable-anchors</code> - Links are crawlable (1)</li>
      <li><code>robots-txt</code> - robots.txt is valid (1)</li>
    </ul>
  </div>
  <div class="p-6 border-2 border-amber-500 rounded">
    <span class="text-2xlmb-2 font-light">Option B: </span>
    <span class="text-lg mb-3 font-bold">Content</span>
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

<VoteButtons :vote-index="3" label-a="Crawlability" label-b="Content" :next-slide="48" />

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
  Let's build a lighthouse! - An interactive presentation
</div>
