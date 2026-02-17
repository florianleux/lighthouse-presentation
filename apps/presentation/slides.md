---
theme: default
title: Let's build a lighthouse!
info: |
  ## Let's build a lighthouse!
  An interactive presentation where the audience votes to optimize Lighthouse Performance score.
  Together, we'll transform a struggling website into a high-performance beacon.
drawings:
  persist: false
aspectRatio: '1960/1104'
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

<div class="slide-bg" style="background-image: url('/backgrounds/home-2.png')">
</div>

---
transition: slide-down
---

<div class="slide-bg" style="background-image: url('/backgrounds/home-4.png')">

</div>

---
transition: slide-right
---

<div class="slide-bg" style="background-image: url('/backgrounds/home-3.png')">
<div class="text-4xl text-white font-title text-shadow-md">The Lighthouse score(s)</div>
<div class="text-left text-white text-lg text-shadow-md">Google's open-source tool for auditing web page quality</div>
<div class="grid grid-cols-4 gap-4  text-white pt-8 text-center text-shadow-md">
    <div class="absolute font-bold left-[22%] text-white top-[24%] text-4xl">Performance</div>
    <div class="absolute font-bold text-2xl left-[47%] text-white top-[43%] ">Accessibility</div>
    <div class="absolute font-bold text-2xl left-[67%] text-white top-[35%] ">Best<br>Practices</div>
    <div class="absolute text-2xl left-[90%] text-[#2a384c] top-[40%] font-bold">SEO</div>
</div>
</div>

---
transition: slide-up
---

<div class="slide-bg" style="background-image: url('/backgrounds/home-1.png')">

<div class="text-4xl text-shadow-md text-white font-title">Why does performance matters ?</div>

<div class="grid mt-15 pl-15 text-shadow-md grid-cols-2 gap-10 pt-4 text-white">
<div>
  <div>
    <div class="text-5xl font-bold">53%</div>
    <div>of users leave if page loads > 3s</div>
  </div>
  <div>
    <div class="text-5xl mt-10 font-bold">70%</div>
    <div class="font-bold">of consumers say speed affects their purchase decisions</div>
  </div>
</div>
<div class="mt-20">
  <div>
    <div class="text-5xl font-bold">32%</div>
    <div>increase in bounce rate when load time goes from 1s to 3s</div>
  </div>
  <div>
    <div class="text-5xl mt-10 font-bold">3x</div>
    <div>higher conversion rate for sites loading in 1s vs 5s</div>
  </div>
</div>


</div>

</div>

---
transition: slide-up
---

<div class="slide-bg" style="background-image: url('/backgrounds/home2-middle.png')"></div>

---

<div class="slide-bg" style="background-image: url('/backgrounds/home2-bottom.png')"></div>

  <div class="w-[68%] absolute right-[16%] top-[16%] aspect-[1960/1250] -rotate-1">
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

At every step, we will decide which optimization to apply, following our instincts!

---

<DayIntro :day="1" metric="cls" />

---

<MetricIntroLoader metric="cls" />

---

<ChoiceFromMetric :metric-index="0" />

---

<VoteFromMetric :metric-index="0" />

---
transition: fade
---

<WinnerDisplay :vote-index="0" />

---
transition: slide-up
---

<DetailSlideLoader metric="cls" :slide-index="1" />

---
transition: slide-up
---

<DetailSlideLoader metric="cls" :slide-index="2" />

---

<DayIntro :day="2" metric="fcp" />

---

<MetricIntroLoader metric="fcp" />

---
<ChoiceFromMetric :metric-index="1" />

---

<VoteFromMetric :metric-index="1" />

---

<WinnerDisplay :vote-index="1" />

---

<DetailSlideLoader metric="fcp" :slide-index="1" />

---

<DetailSlideLoader metric="fcp" :slide-index="2" />

---

<DetailSlideLoader metric="fcp" :slide-index="3" />

---

<DayIntro :day="3" metric="lcp" />

---

<MetricIntroLoader metric="lcp" />

---

<ChoiceFromMetric :metric-index="2" />

---

<VoteFromMetric :metric-index="2" />

---

<WinnerDisplay :vote-index="2" />

---

<DetailSlideLoader metric="lcp" :slide-index="1" />

---

<DetailSlideLoader metric="lcp" :slide-index="2" />

---

<DayIntro :day="4" metric="tbt" />

---

<MetricIntroLoader metric="tbt" />

---

<ChoiceFromMetric :metric-index="3" />

---
<VoteFromMetric :metric-index="3" />

---

<WinnerDisplay :vote-index="3" />

---

<DetailSlideLoader metric="tbt" :slide-index="1" />

---

<DetailSlideLoader metric="tbt" :slide-index="2" />

---

<DayIntro :day="5" metric="si" />

---

<MetricIntroLoader metric="si" />

---

<ChoiceFromMetric :metric-index="4" />

---

<VoteFromMetric :metric-index="4" />

---

<WinnerDisplay :vote-index="4" />

---

<DetailSlideLoader metric="si" :slide-index="1" />

---

<DetailSlideLoader metric="si" :slide-index="2" />

---

# Recap

## Lighthouse complete!

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

# Questions?

<div class="text-6xl pt-8">
  🏴‍☠️
</div>

<div class="pt-8 opacity-50">
  Let's build a lighthouse! - An interactive presentation
</div>
