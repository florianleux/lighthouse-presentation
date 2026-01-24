// Performance metrics (Core Web Vitals)
export type PerformanceMetric = 'FCP' | 'LCP' | 'TBT' | 'CLS' | 'SI' | 'TTI'

// Accessibility audits (all weight 10 - Critical)
export type AccessibilityMetric =
  // a11y-names-labels group (Option A)
  | 'button-name'
  | 'image-alt'
  | 'label'
  // a11y-aria group (Option B)
  | 'aria-roles'
  | 'aria-required-attr'
  | 'aria-valid-attr-value'

// Best Practices audits (weight 5, 3, 1)
export type BestPracticesMetric =
  // best-practices-general group (Option A)
  | 'deprecations'
  | 'third-party-cookies'
  | 'errors-in-console'
  // best-practices-trust-safety + ux groups (Option B)
  | 'geolocation-on-start'
  | 'notification-on-start'
  | 'paste-preventing-inputs'

// SEO audits (is-crawlable weight ~4.04, others weight 1)
export type SEOMetric =
  // seo-crawl group (Option A)
  | 'is-crawlable'
  | 'crawlable-anchors'
  | 'robots-txt'
  // seo-content group (Option B)
  | 'document-title'
  | 'meta-description'
  | 'link-text'

// Union of all category metrics
export type CategoryMetric = PerformanceMetric | AccessibilityMetric | BestPracticesMetric | SEOMetric

// Keep backward compatibility alias
export type LighthouseMetric = CategoryMetric

export interface CodeSnippet {
  language: string // 'html', 'javascript', 'css', 'vue'
  code: string
}

export interface PatchExplanation {
  title: string
  summary: string
  before: CodeSnippet
  after: CodeSnippet
  whyMatters: string[]
  metrics: {
    metric: LighthouseMetric
    impact: 'high' | 'medium' | 'low'
    description: string
  }[]
}

export interface VoteOptionPatches {
  title: string
  patches: [PatchExplanation, PatchExplanation, PatchExplanation]
}

export interface VotePatchData {
  A: VoteOptionPatches
  B: VoteOptionPatches
}

export const PATCH_DATA: Record<number, VotePatchData> = {
  // Vote 0: Performance
  0: {
    A: {
      title: 'Images',
      patches: [
        {
          title: 'Convert images to WebP',
          summary: 'Modern image format with 25-35% smaller file sizes',
          before: {
            language: 'html',
            code: `<img src="/products/sword.png" />
<!-- File size: 6.4 MB -->`
          },
          after: {
            language: 'html',
            code: `<img src="/products/sword.webp" />
<!-- File size: 180 KB (97% smaller) -->`
          },
          whyMatters: [
            'PNG files are ~6.4MB each (1500x1500 uncompressed)',
            'WebP provides 25-35% smaller files with same quality',
            'Faster download = faster Largest Contentful Paint'
          ],
          metrics: [
            { metric: 'LCP', impact: 'high', description: 'Reduces LCP by ~1.5-2s on 4G' },
            { metric: 'SI', impact: 'medium', description: 'Faster visual completion' }
          ]
        },
        {
          title: 'Add loading="lazy" below-fold',
          summary: 'Defer loading of off-screen images',
          before: {
            language: 'html',
            code: `<!-- All images load immediately -->
<img src="/products/item1.webp" />
<img src="/products/item2.webp" />
<img src="/products/item3.webp" />`
          },
          after: {
            language: 'html',
            code: `<!-- Hero loads immediately -->
<img src="/products/item1.webp" />
<!-- Below-fold images lazy load -->
<img src="/products/item2.webp" loading="lazy" />
<img src="/products/item3.webp" loading="lazy" />`
          },
          whyMatters: [
            'All images load eagerly by default',
            'Below-fold images compete for bandwidth',
            'Lazy loading defers non-critical images'
          ],
          metrics: [
            { metric: 'LCP', impact: 'medium', description: 'More bandwidth for hero image' },
            { metric: 'TBT', impact: 'low', description: 'Reduces main thread work' }
          ]
        },
        {
          title: 'Add width/height attributes',
          summary: 'Reserve space to prevent layout shifts',
          before: {
            language: 'html',
            code: `<img src="/products/item.webp" />
<!-- Browser doesn't know size until loaded -->`
          },
          after: {
            language: 'html',
            code: `<img
  src="/products/item.webp"
  width="300"
  height="300"
/>
<!-- Browser reserves 300x300 space -->`
          },
          whyMatters: [
            'Without dimensions, browser cannot reserve space',
            'Content shifts when image loads (CLS penalty)',
            'Explicit dimensions enable aspect-ratio calculation'
          ],
          metrics: [
            { metric: 'CLS', impact: 'high', description: 'Eliminates image layout shifts' }
          ]
        }
      ]
    },
    B: {
      title: 'Scripts',
      patches: [
        {
          title: 'Remove heavy libraries',
          summary: 'Remove jQuery, Lodash, and Moment.js (226KB saved)',
          before: {
            language: 'html',
            code: `<script src="jquery.min.js"></script>    <!-- 87KB -->
<script src="lodash.min.js"></script>   <!-- 72KB -->
<script src="moment.min.js"></script>   <!-- 67KB -->
<!-- Total: 226KB of unused code -->`
          },
          after: {
            language: 'html',
            code: `<!-- Removed: Use native APIs instead -->
<!-- document.querySelector() vs jQuery -->
<!-- Array methods vs Lodash -->
<!-- Intl.DateTimeFormat vs Moment -->`
          },
          whyMatters: [
            'jQuery (87KB), Lodash (72KB), Moment (67KB) = 226KB',
            'Modern browsers have native alternatives',
            'Unused code blocks main thread during parse'
          ],
          metrics: [
            { metric: 'TBT', impact: 'high', description: 'Reduces blocking time by ~300ms' },
            { metric: 'FCP', impact: 'medium', description: 'Faster initial render' }
          ]
        },
        {
          title: 'Remove third-party scripts',
          summary: 'Remove Three.js, D3.js, Chart.js (unused)',
          before: {
            language: 'html',
            code: `<script src="three.min.js"></script>   <!-- 150KB -->
<script src="d3.min.js"></script>      <!-- 90KB -->
<script src="chart.min.js"></script>   <!-- 60KB -->
<!-- Never used in the application -->`
          },
          after: {
            language: 'html',
            code: `<!-- Removed unused visualization libraries -->
<!-- Only load what you actually use -->`
          },
          whyMatters: [
            'Three.js, D3.js, Chart.js add ~300KB total',
            'These libraries are never used in the app',
            'Each script blocks rendering while parsing'
          ],
          metrics: [
            { metric: 'TBT', impact: 'high', description: 'Reduces TBT by ~400ms' },
            { metric: 'TTI', impact: 'medium', description: 'Faster time to interactive' }
          ]
        },
        {
          title: 'Remove blocking inline script',
          summary: 'Remove 500ms artificial delay in head',
          before: {
            language: 'html',
            code: `<head>
  <script>
    // Blocking script - runs before render
    const start = Date.now();
    while (Date.now() - start < 500) {}
  </script>
</head>`
          },
          after: {
            language: 'html',
            code: `<head>
  <!-- No blocking scripts -->
  <!-- Move scripts to end of body or use defer -->
</head>`
          },
          whyMatters: [
            'Inline scripts in <head> block rendering',
            'This script adds 500ms artificial delay',
            'Nothing can render until script completes'
          ],
          metrics: [
            { metric: 'FCP', impact: 'high', description: 'Removes 500ms delay' },
            { metric: 'LCP', impact: 'high', description: 'Content appears 500ms sooner' }
          ]
        }
      ]
    }
  },

  // Vote 1: Accessibility
  1: {
    A: {
      title: 'Names & Labels',
      patches: [
        {
          title: 'Replace divs with buttons',
          summary: 'Use proper interactive elements',
          before: {
            language: 'html',
            code: `<!-- TheHeader.vue - non-semantic buttons -->
<div role="button" class="cursor-pointer">
  Sell
</div>
<div role="button" class="cursor-pointer">
  Need help?
</div>
<!-- Missing keyboard support -->`
          },
          after: {
            language: 'html',
            code: `<!-- TheHeader.vue - semantic buttons -->
<button type="button" class="cursor-pointer">
  Sell
</button>
<button type="button" class="cursor-pointer">
  Need help?
</button>
<!-- Keyboard accessible by default -->`
          },
          whyMatters: [
            'Divs are not keyboard accessible by default',
            'Buttons work with Enter and Space keys',
            'Screen readers announce buttons correctly'
          ],
          metrics: [
            { metric: 'button-name', impact: 'high', description: 'Interactive elements are accessible' }
          ]
        },
        {
          title: 'Add alt text to images',
          summary: 'Describe images for screen readers',
          before: {
            language: 'html',
            code: `<!-- ProductCard.vue -->
<img :src="product.image" />

<!-- TheHeader.vue -->
<img src="/images/logo.png" alt="image" />`
          },
          after: {
            language: 'html',
            code: `<!-- ProductCard.vue -->
<img :src="product.image" :alt="product.name" />

<!-- TheHeader.vue -->
<img src="/images/logo.png" alt="BlackMarket logo" />`
          },
          whyMatters: [
            'Screen readers need alt to describe images',
            'Required by WCAG 1.1.1 (Level A)',
            'Also helps SEO image indexing'
          ],
          metrics: [
            { metric: 'image-alt', impact: 'high', description: 'All images have descriptive alt' }
          ]
        },
        {
          title: 'Labels on all inputs',
          summary: 'Associate labels with form fields',
          before: {
            language: 'html',
            code: `<input
  placeholder="Search for pirate gear..."
/>
<!-- No label - screen readers can't identify -->`
          },
          after: {
            language: 'html',
            code: `<label for="search" class="sr-only">
  Search products
</label>
<input
  id="search"
  placeholder="Search for pirate gear..."
/>`
          },
          whyMatters: [
            'Screen readers need labels to describe inputs',
            'Placeholder text disappears when typing',
            'Labels also increase click target area'
          ],
          metrics: [
            { metric: 'label', impact: 'high', description: 'All form fields have labels' }
          ]
        }
      ]
    },
    B: {
      title: 'ARIA',
      patches: [
        {
          title: 'Use valid ARIA roles',
          summary: 'Replace invalid role values with standard ones',
          before: {
            language: 'html',
            code: `<!-- app.vue - invalid custom roles -->
<div role="pirate-button">Click me</div>
<div role="treasure-chest">Content here</div>
<span role="gold-counter">5 coins</span>
<!-- Invalid roles are ignored by AT -->`
          },
          after: {
            language: 'html',
            code: `<!-- app.vue - valid ARIA roles -->
<button type="button">Click me</button>
<div role="region" aria-label="Treasure">Content here</div>
<span role="status">5 coins</span>
<!-- Semantic elements or valid roles -->`
          },
          whyMatters: [
            'Invalid roles are ignored by assistive tech',
            'Screen readers can\'t identify custom roles',
            'Use standard roles from WAI-ARIA spec'
          ],
          metrics: [
            { metric: 'aria-roles', impact: 'high', description: 'All ARIA roles are valid' }
          ]
        },
        {
          title: 'Add required ARIA attributes',
          summary: 'Provide missing ARIA state attributes',
          before: {
            language: 'html',
            code: `<!-- app.vue - missing required attributes -->
<div role="checkbox">Remember me</div>
<div role="slider">Volume</div>
<div role="combobox">Select option</div>
<!-- AT cannot determine state -->`
          },
          after: {
            language: 'html',
            code: `<!-- app.vue - complete ARIA attributes -->
<div role="checkbox" aria-checked="false">Remember me</div>
<div role="slider" aria-valuenow="50"
     aria-valuemin="0" aria-valuemax="100">Volume</div>
<div role="combobox" aria-expanded="false">Select</div>
<!-- AT can announce current state -->`
          },
          whyMatters: [
            'ARIA roles require specific attributes',
            'checkbox needs aria-checked state',
            'slider needs aria-valuenow/min/max'
          ],
          metrics: [
            { metric: 'aria-required-attr', impact: 'high', description: 'ARIA roles have required attributes' }
          ]
        },
        {
          title: 'Fix invalid ARIA attribute values',
          summary: 'Use valid values for ARIA attributes',
          before: {
            language: 'html',
            code: `<!-- app.vue - invalid ARIA values -->
<div role="slider" aria-valuenow="invalid">Volume</div>
<div role="progressbar" aria-valuenow="fifty">Loading</div>
<!-- aria-valuenow must be a number -->`
          },
          after: {
            language: 'html',
            code: `<!-- app.vue - valid ARIA values -->
<div role="slider" aria-valuenow="50">Volume</div>
<div role="progressbar" aria-valuenow="50">Loading</div>
<!-- aria-valuenow is now a valid number -->`
          },
          whyMatters: [
            'aria-valuenow requires a numeric value',
            'Invalid values are ignored by assistive tech',
            'Users cannot determine slider/progress state'
          ],
          metrics: [
            { metric: 'aria-valid-attr-value', impact: 'high', description: 'ARIA attributes have valid values' }
          ]
        }
      ]
    }
  },

  // Vote 2: Best Practices
  2: {
    A: {
      title: 'General',
      patches: [
        {
          title: 'Remove third-party cookie trackers',
          summary: 'Avoid tracking users without consent',
          before: {
            language: 'html',
            code: `<!-- app.vue - hidden tracking iframe -->
<iframe
  src="https://youtube.com/embed/..."
  style="display:none"
></iframe>

// Insecure cookie
document.cookie = 'tracker=value; path=/'`
          },
          after: {
            language: 'html',
            code: `<!-- Load third-party only with consent -->
<iframe
  v-if="hasConsent"
  src="https://youtube.com/embed/..."
></iframe>

// Secure cookie with SameSite
document.cookie = 'session=value; SameSite=Strict; Secure'`
          },
          whyMatters: [
            'Third-party cookies track users across sites',
            'Hidden iframes can set tracking cookies',
            'GDPR/CCPA require consent for tracking'
          ],
          metrics: [
            { metric: 'third-party-cookies', impact: 'high', description: 'No tracking without consent' }
          ]
        },
        {
          title: 'Remove document.write()',
          summary: 'Avoid deprecated DOM API',
          before: {
            language: 'javascript',
            code: `// nuxt.config.ts - head script
innerHTML: \`document.write(
  '<div>Injected via document.write</div>'
);\`
// Blocks parsing and can wipe page`
          },
          after: {
            language: 'javascript',
            code: `// Removed - use modern DOM methods
const div = document.createElement('div')
div.textContent = 'Injected content'
document.body.appendChild(div)`
          },
          whyMatters: [
            'document.write() blocks HTML parsing',
            'Can wipe entire page if called after load',
            'Deprecated and flagged by Lighthouse'
          ],
          metrics: [
            { metric: 'deprecations', impact: 'high', description: 'No deprecated APIs used' }
          ]
        },
        {
          title: 'Fix console errors',
          summary: 'Handle undefined functions and errors',
          before: {
            language: 'javascript',
            code: `// app.vue - causes console errors
undefinedFunction()

// Unhandled promise rejection
Promise.reject('Error')

// Results in red errors in console`
          },
          after: {
            language: 'javascript',
            code: `// Removed undefined function call

// Handle promise rejections
Promise.reject('Error')
  .catch(err => handleError(err))`
          },
          whyMatters: [
            'Console errors indicate broken functionality',
            'Lighthouse flags JavaScript errors',
            'Errors can break subsequent scripts'
          ],
          metrics: [
            { metric: 'errors-in-console', impact: 'high', description: 'No JS errors in console' }
          ]
        }
      ]
    },
    B: {
      title: 'Trust & Safety',
      patches: [
        {
          title: 'Remove geolocation on page load',
          summary: 'Only request location on user gesture',
          before: {
            language: 'javascript',
            code: `// app.vue - onMounted() (bad practice)
navigator.geolocation.getCurrentPosition(
  () => console.log('Location obtained')
)
// Requests location immediately on load`
          },
          after: {
            language: 'javascript',
            code: `// Only on user interaction
button.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
    pos => showNearbyStores(pos)
  )
})
// User understands why`
          },
          whyMatters: [
            'Auto-requests without context are annoying',
            'Browsers may block repeated requests',
            'Users more likely to accept with context'
          ],
          metrics: [
            { metric: 'geolocation-on-start', impact: 'high', description: 'Geolocation only on user action' }
          ]
        },
        {
          title: 'Remove notification on page load',
          summary: 'Only request notifications on user gesture',
          before: {
            language: 'javascript',
            code: `// app.vue - onMounted() (bad practice)
Notification.requestPermission()
// Requests notification immediately on load
// Users don't understand why`
          },
          after: {
            language: 'javascript',
            code: `// Only on user interaction
button.addEventListener('click', () => {
  Notification.requestPermission()
    .then(showNotificationPrefs)
})
// User requested notifications`
          },
          whyMatters: [
            'Auto-requests without context are intrusive',
            'Browsers may auto-deny repeated requests',
            'Users more likely to accept with context'
          ],
          metrics: [
            { metric: 'notification-on-start', impact: 'high', description: 'No intrusive notification prompts' }
          ]
        },
        {
          title: 'Allow paste in input fields',
          summary: 'Don\'t block password managers',
          before: {
            language: 'html',
            code: `<!-- app.vue - blocking paste -->
<input type="password" onpaste="return false" />

// JavaScript paste blocking
input.addEventListener('paste', e => {
  e.preventDefault()
  console.log('Paste blocked!')
})`
          },
          after: {
            language: 'html',
            code: `<!-- app.vue - allow paste -->
<input type="password" />

// Paste allowed for password managers
// and accessibility
// (removed paste prevention)`
          },
          whyMatters: [
            'Blocking paste breaks password managers',
            'Users rely on pasting strong passwords',
            'Forces manual typing which is error-prone'
          ],
          metrics: [
            { metric: 'paste-preventing-inputs', impact: 'high', description: 'Users can paste in inputs' }
          ]
        }
      ]
    }
  },

  // Vote 3: SEO
  3: {
    A: {
      title: 'Crawlability',
      patches: [
        {
          title: 'Remove noindex meta tag',
          summary: 'Allow search engines to index the page',
          before: {
            language: 'html',
            code: `<!-- nuxt.config.ts head meta -->
<meta name="robots" content="noindex, nofollow">
<!-- Page hidden from search engines -->`
          },
          after: {
            language: 'html',
            code: `<!-- nuxt.config.ts head meta -->
<meta name="robots" content="index, follow">
<!-- Page visible in search results -->`
          },
          whyMatters: [
            'noindex prevents page from appearing in search',
            'nofollow prevents crawlers from following links',
            'Often left accidentally from staging'
          ],
          metrics: [
            { metric: 'is-crawlable', impact: 'high', description: 'Page is indexable by search engines' }
          ]
        },
        {
          title: 'Make navigation crawlable',
          summary: 'Use real links instead of JavaScript',
          before: {
            language: 'html',
            code: `<!-- TheHeader.vue -->
<div
  v-for="category in categories"
  @click="navigateToCategory(category.id)"
>
  {{ category.name }}
</div>
<!-- Crawlers can't follow JS clicks -->`
          },
          after: {
            language: 'html',
            code: `<!-- TheHeader.vue -->
<a
  v-for="category in categories"
  :href="\`/category/\${category.id}\`"
>
  {{ category.name }}
</a>
<!-- Real links that crawlers can follow -->`
          },
          whyMatters: [
            'Search crawlers need real <a href> links',
            'JavaScript navigation is often invisible',
            'Proper links also help keyboard users'
          ],
          metrics: [
            { metric: 'crawlable-anchors', impact: 'high', description: 'Navigation links are crawlable' }
          ]
        },
        {
          title: 'Fix robots.txt blocking crawlers',
          summary: 'Allow search engines to access the site',
          before: {
            language: 'text',
            code: `# public/robots.txt
User-agent: *
Disallow: /
# Blocks ALL crawlers from entire site`
          },
          after: {
            language: 'text',
            code: `# public/robots.txt
User-agent: *
Allow: /
Disallow: /api/
# Only block sensitive paths`
          },
          whyMatters: [
            'Disallow: / blocks all pages from indexing',
            'Site will not appear in search results',
            'Only block admin/api paths'
          ],
          metrics: [
            { metric: 'robots-txt', impact: 'high', description: 'robots.txt allows crawling' }
          ]
        }
      ]
    },
    B: {
      title: 'Content',
      patches: [
        {
          title: 'Add unique page title',
          summary: 'Set descriptive page title',
          before: {
            language: 'javascript',
            code: `// pages/index.vue
// No useHead() or title configuration
export default {
  // Page lacks any title definition
}`
          },
          after: {
            language: 'javascript',
            code: `// pages/index.vue
useHead({
  title: 'BlackMarket - Pirate Gear & Accessories'
})
// Descriptive title in search results`
          },
          whyMatters: [
            'Title appears in search results',
            'Used for browser tabs and bookmarks',
            'Most important on-page SEO element'
          ],
          metrics: [
            { metric: 'document-title', impact: 'high', description: 'Page has descriptive title' }
          ]
        },
        {
          title: 'Add meta description',
          summary: 'Control search result snippet',
          before: {
            language: 'javascript',
            code: `// pages/index.vue
// No meta description defined
useHead({
  title: 'BlackMarket'
})
// Google generates random snippet`
          },
          after: {
            language: 'javascript',
            code: `// pages/index.vue
useSeoMeta({
  title: 'BlackMarket',
  description: 'Premium pirate gear and accessories. Swords, hats, and more.'
})
// Controlled search snippet`
          },
          whyMatters: [
            'Description appears in search results',
            'Good descriptions improve click-through',
            'Without it, Google picks random text'
          ],
          metrics: [
            { metric: 'meta-description', impact: 'high', description: 'Search snippet is controlled' }
          ]
        },
        {
          title: 'Descriptive link text',
          summary: 'Replace "click here" with meaningful text',
          before: {
            language: 'html',
            code: `<!-- TheFooter.vue -->
<a href="#">Click here</a>
<a href="#">Read more</a>
<a href="#">Learn more</a>
<!-- Generic link text is useless -->`
          },
          after: {
            language: 'html',
            code: `<!-- TheFooter.vue -->
<a href="/products">Browse our collection</a>
<a href="/about">Learn about BlackMarket</a>
<a href="/contact">Contact our crew</a>
<!-- Links describe their destination -->`
          },
          whyMatters: [
            'Screen readers list links by text',
            '"Click here" provides no context',
            'Descriptive links help SEO and accessibility'
          ],
          metrics: [
            { metric: 'link-text', impact: 'high', description: 'Links describe destination' }
          ]
        }
      ]
    }
  }
}
