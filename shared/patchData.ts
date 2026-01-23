// Lighthouse metrics that can be impacted
export type LighthouseMetric = 'FCP' | 'LCP' | 'TBT' | 'CLS' | 'SI' | 'TTI'

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
      title: 'Visual Cues',
      patches: [
        {
          title: 'Improve contrasts (4.5:1 ratio)',
          summary: 'Ensure text is readable for everyone',
          before: {
            language: 'css',
            code: `.product-title {
  color: #999999; /* Gray on white */
  /* Contrast ratio: 2.5:1 (FAIL) */
}`
          },
          after: {
            language: 'css',
            code: `.product-title {
  color: #595959; /* Darker gray */
  /* Contrast ratio: 7:1 (PASS AA & AAA) */
}`
          },
          whyMatters: [
            'WCAG requires 4.5:1 contrast for normal text',
            'Low contrast affects users with low vision',
            '~8% of men have color vision deficiency'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        },
        {
          title: 'Add visible focus indicators',
          summary: 'Show where keyboard focus is',
          before: {
            language: 'css',
            code: `button:focus,
a:focus,
input:focus {
  outline: none; /* WCAG violation */
}`
          },
          after: {
            language: 'css',
            code: `button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 3px solid #4A90D9;
  outline-offset: 2px;
}`
          },
          whyMatters: [
            'Keyboard users need to see where focus is',
            'outline: none removes the only indicator',
            ':focus-visible shows outline only for keyboard'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        },
        {
          title: 'Labels on all inputs',
          summary: 'Associate labels with form fields',
          before: {
            language: 'html',
            code: `<input
  type="text"
  placeholder="Search..."
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
  type="text"
  placeholder="Search..."
/>`
          },
          whyMatters: [
            'Screen readers need labels to describe inputs',
            'Placeholder text disappears when typing',
            'Labels also increase click target area'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        }
      ]
    },
    B: {
      title: 'Semantic HTML',
      patches: [
        {
          title: 'Replace divs with buttons',
          summary: 'Use proper interactive elements',
          before: {
            language: 'html',
            code: `<div
  role="button"
  onclick="addToCart()"
  class="btn"
>
  Add to Cart
</div>
<!-- Missing keyboard support -->`
          },
          after: {
            language: 'html',
            code: `<button
  type="button"
  onclick="addToCart()"
  class="btn"
>
  Add to Cart
</button>
<!-- Keyboard accessible by default -->`
          },
          whyMatters: [
            'Divs are not keyboard accessible by default',
            'Buttons work with Enter and Space keys',
            'Screen readers announce buttons correctly'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        },
        {
          title: 'Add lang attribute to html',
          summary: 'Declare the page language',
          before: {
            language: 'html',
            code: `<html>
  <head>...</head>
  <!-- No language declared -->
</html>`
          },
          after: {
            language: 'html',
            code: `<html lang="en">
  <head>...</head>
  <!-- Language declared for screen readers -->
</html>`
          },
          whyMatters: [
            'Screen readers use lang to select voice',
            'Without lang, pronunciation may be wrong',
            'Required by WCAG 3.1.1 (Level A)'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        },
        {
          title: 'Fix heading hierarchy',
          summary: 'Use headings in order (h1→h2→h3)',
          before: {
            language: 'html',
            code: `<h1>BlackMarket</h1>
<h4>Products</h4>  <!-- Skipped h2, h3 -->
<h6>Sword</h6>     <!-- Skipped h5 -->`
          },
          after: {
            language: 'html',
            code: `<h1>BlackMarket</h1>
<h2>Products</h2>
<h3>Sword</h3>
<!-- Proper hierarchy for navigation -->`
          },
          whyMatters: [
            'Screen reader users navigate by headings',
            'Skipping levels breaks document outline',
            'Headings should reflect content structure'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        }
      ]
    }
  },

  // Vote 2: Best Practices
  2: {
    A: {
      title: 'Console',
      patches: [
        {
          title: 'Remove console.log in production',
          summary: 'Clean up debugging statements',
          before: {
            language: 'javascript',
            code: `function addToCart(item) {
  console.log('Adding to cart:', item);
  console.log('Current cart:', cart);
  console.log('User:', currentUser);
  // Logs sensitive data in production
}`
          },
          after: {
            language: 'javascript',
            code: `function addToCart(item) {
  // Use proper logging service
  // or remove in production build
  cart.add(item);
}`
          },
          whyMatters: [
            'Console logs expose internal data publicly',
            'Performance cost from serializing objects',
            'Clutters browser console for debugging'
          ],
          metrics: [
            { metric: 'TBT', impact: 'low', description: 'Minor performance gain' }
          ]
        },
        {
          title: 'Remove document.write()',
          summary: 'Avoid deprecated DOM API',
          before: {
            language: 'javascript',
            code: `// In page load
document.write('<p>Loading...</p>');
// Blocks parsing and can wipe page`
          },
          after: {
            language: 'javascript',
            code: `// Use modern DOM methods
const p = document.createElement('p');
p.textContent = 'Loading...';
document.body.appendChild(p);`
          },
          whyMatters: [
            'document.write() blocks HTML parsing',
            'Can wipe entire page if called after load',
            'Deprecated and flagged by Lighthouse'
          ],
          metrics: [
            { metric: 'FCP', impact: 'medium', description: 'Removes parsing block' }
          ]
        },
        {
          title: 'Fix console errors',
          summary: 'Handle undefined functions and errors',
          before: {
            language: 'javascript',
            code: `// Calling undefined function
undefinedFunction();

// Unhandled promise rejection
Promise.reject('Error');

// Results in console errors`
          },
          after: {
            language: 'javascript',
            code: `// Remove or define the function
// definedFunction();

// Handle promise rejections
Promise.reject('Error')
  .catch(err => handleError(err));`
          },
          whyMatters: [
            'Console errors indicate broken functionality',
            'Lighthouse flags JavaScript errors',
            'Errors can break subsequent scripts'
          ],
          metrics: [
            { metric: 'TBT', impact: 'low', description: 'Prevents error handling overhead' }
          ]
        }
      ]
    },
    B: {
      title: 'Browser APIs',
      patches: [
        {
          title: 'Remove aggressive permission requests',
          summary: 'Only request permissions on user gesture',
          before: {
            language: 'javascript',
            code: `// On page load (bad practice)
navigator.geolocation.getCurrentPosition(
  pos => console.log(pos)
);
Notification.requestPermission();
// Browser may block these`
          },
          after: {
            language: 'javascript',
            code: `// Only on user interaction
button.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(
    pos => showNearbyStores(pos)
  );
});
// User understands why`
          },
          whyMatters: [
            'Auto-requests without context are annoying',
            'Browsers may block repeated requests',
            'Users more likely to accept with context'
          ],
          metrics: [
            { metric: 'TBT', impact: 'low', description: 'Removes blocking API calls' }
          ]
        },
        {
          title: 'Add passive listeners',
          summary: 'Improve scroll performance',
          before: {
            language: 'javascript',
            code: `document.addEventListener(
  'touchstart',
  handleTouch,
  { passive: false }
);
// Browser waits to see if preventDefault`
          },
          after: {
            language: 'javascript',
            code: `document.addEventListener(
  'touchstart',
  handleTouch,
  { passive: true }
);
// Browser scrolls immediately`
          },
          whyMatters: [
            'Non-passive listeners block scrolling',
            'Browser waits to see if preventDefault called',
            'Passive listeners allow immediate scroll'
          ],
          metrics: [
            { metric: 'TBT', impact: 'medium', description: 'Smoother scrolling' }
          ]
        },
        {
          title: 'Hide source maps in production',
          summary: 'Protect source code from exposure',
          before: {
            language: 'javascript',
            code: `// nuxt.config.ts
export default {
  sourcemap: {
    client: true,  // Exposes source code
    server: true
  }
}`
          },
          after: {
            language: 'javascript',
            code: `// nuxt.config.ts
export default {
  sourcemap: {
    client: false, // Hidden in production
    server: false
  }
}`
          },
          whyMatters: [
            'Source maps expose original source code',
            'Competitors can see your implementation',
            'Security: easier to find vulnerabilities'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'Smaller download (no .map files)' }
          ]
        }
      ]
    }
  },

  // Vote 3: SEO
  3: {
    A: {
      title: 'Meta Tags',
      patches: [
        {
          title: 'Add unique title',
          summary: 'Set descriptive page title',
          before: {
            language: 'html',
            code: `<head>
  <!-- No title tag -->
</head>
<!-- Browser shows URL in tab -->`
          },
          after: {
            language: 'html',
            code: `<head>
  <title>
    BlackMarket - Pirate Gear & Accessories
  </title>
</head>
<!-- Descriptive title in search results -->`
          },
          whyMatters: [
            'Title appears in search results',
            'Used for browser tabs and bookmarks',
            'Most important on-page SEO element'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        },
        {
          title: 'Add meta description',
          summary: 'Control search result snippet',
          before: {
            language: 'html',
            code: `<head>
  <title>BlackMarket</title>
  <!-- No meta description -->
</head>
<!-- Google generates random snippet -->`
          },
          after: {
            language: 'html',
            code: `<head>
  <title>BlackMarket</title>
  <meta
    name="description"
    content="Premium pirate gear and accessories.
    Swords, hats, and more for your adventures."
  />
</head>`
          },
          whyMatters: [
            'Description appears in search results',
            'Good descriptions improve click-through',
            'Without it, Google picks random text'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        },
        {
          title: 'One h1 per page',
          summary: 'Single main heading for clarity',
          before: {
            language: 'html',
            code: `<h1>BlackMarket</h1>
<h1>Best Deals!</h1>
<h1>Contact Us</h1>
<!-- Multiple h1 tags confuse crawlers -->`
          },
          after: {
            language: 'html',
            code: `<h1>BlackMarket - Pirate Gear Shop</h1>
<h2>Best Deals!</h2>
<h2>Contact Us</h2>
<!-- Clear hierarchy, one main heading -->`
          },
          whyMatters: [
            'h1 should identify the main topic',
            'Multiple h1s dilute importance signal',
            'Better structure helps crawlers understand'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        }
      ]
    },
    B: {
      title: 'Content',
      patches: [
        {
          title: 'Descriptive link text',
          summary: 'Replace "click here" with meaningful text',
          before: {
            language: 'html',
            code: `<p>
  To see our products,
  <a href="/products">click here</a>.
</p>
<p>
  <a href="/about">Read more</a>
</p>
<!-- "click here" and "read more" are useless -->`
          },
          after: {
            language: 'html',
            code: `<p>
  Browse our
  <a href="/products">pirate gear collection</a>.
</p>
<p>
  <a href="/about">Learn about BlackMarket</a>
</p>
<!-- Links describe their destination -->`
          },
          whyMatters: [
            'Screen readers list links by text',
            '"Click here" provides no context',
            'Descriptive links help SEO and accessibility'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        },
        {
          title: 'Alt attributes on images',
          summary: 'Describe images for SEO and accessibility',
          before: {
            language: 'html',
            code: `<img src="/sword.webp" alt="image" />
<img src="/hat.webp" alt="" />
<img src="/flag.webp" />
<!-- Generic or missing alt text -->`
          },
          after: {
            language: 'html',
            code: `<img
  src="/sword.webp"
  alt="Steel pirate cutlass with leather grip"
/>
<img
  src="/hat.webp"
  alt="Black tricorn captain's hat"
/>`
          },
          whyMatters: [
            'Alt text helps image search ranking',
            'Screen readers read alt to users',
            'Displayed if image fails to load'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        },
        {
          title: 'Crawlable navigation',
          summary: 'Use real links instead of JavaScript',
          before: {
            language: 'html',
            code: `<nav>
  <span @click="goTo('products')">
    Products
  </span>
  <span @click="goTo('about')">
    About
  </span>
</nav>
<!-- Crawlers can't follow JS clicks -->`
          },
          after: {
            language: 'html',
            code: `<nav>
  <a href="/products">Products</a>
  <a href="/about">About</a>
</nav>
<!-- Real links that crawlers can follow -->`
          },
          whyMatters: [
            'Search crawlers need real <a href> links',
            'JavaScript navigation is often invisible',
            'Proper links also help keyboard users'
          ],
          metrics: [
            { metric: 'LCP', impact: 'low', description: 'No performance impact' }
          ]
        }
      ]
    }
  }
}
