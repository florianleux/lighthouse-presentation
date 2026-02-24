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

<div class="slide-bg" style="background-image: url('/backgrounds/intro/1.png')">
  <CrewScatter class="absolute top-[76%] bottom-[5%] right-[4%] left-[-2%]"/>
</div>

---
transition: slide-down
---

<div class="slide-bg" style="background-image: url('/backgrounds/intro/2.png')">
  <PollButtons poll-id="knowledge-level" />
</div>

---
transition: slide-right
---

<div class="slide-bg" style="background-image: url('/backgrounds/intro/3.png')">
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

<div class="slide-bg" style="background-image: url('/backgrounds/intro/4.png')">

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

<div class="slide-bg" style="background-image: url('/backgrounds/intro/5.png')"></div>

---
transition: slide-up
---

<div class="slide-bg" style="background-image: url('/backgrounds/intro/6.png')"></div>

  <div class="w-[68%] absolute right-[16%] top-[16%] aspect-[1960/1250] -rotate-1">
    <BlackMarketIframe />
  </div>

---
transition: slide-left
---

<div class="slide-bg" style="background-image: url('/backgrounds/score-2.png');"></div>

---
transition: fade
---

<div class="slide-bg" style="background-image: url('/backgrounds/score-3.png');"></div>

---
transition: fade
---

<DayIntro :day="1" metric="cls" />

---
transition: slide-left
---

<MetricIntroLoader metric="cls" />

---
transition: slide-up
---

<ChoiceFromMetric :metric-index="0" />

---
transition: slide-right
---

<VoteSlide :metric-index="0" />

---
transition: fade
---

<WinnerDisplay :vote-index="0" />

---
transition: slide-up
---

<DetailSlideLoader metric="cls" :slide-index="1" />

---
transition: fade
---

<DetailSlideLoader metric="cls" :slide-index="2" />

---
transition: fade
---

<DayIntro :day="2" metric="fcp" />

---
transition: slide-left
---

<MetricIntroLoader metric="fcp" />

---
transition: slide-up
---

<ChoiceFromMetric :metric-index="1" />

---
transition: slide-right
---

<VoteSlide :metric-index="1" />

---
transition: fade
---

<WinnerDisplay :vote-index="1" />

---
transition: slide-up
---

<DetailSlideLoader metric="fcp" :slide-index="1" />

---
transition: slide-left
---

<DetailSlideLoader metric="fcp" :slide-index="2" />

---
transition: fade
---

<DetailSlideLoader metric="fcp" :slide-index="3" />

---
transition: fade
---

<DayIntro :day="3" metric="lcp" />

---
transition: slide-left
---

<MetricIntroLoader metric="lcp" />

---
transition: slide-up
---

<ChoiceFromMetric :metric-index="2" />

---
transition: slide-right
---

<VoteSlide :metric-index="2" />

---
transition: fade
---

<WinnerDisplay :vote-index="2" />

---
transition: slide-up
---

<DetailSlideLoader metric="lcp" :slide-index="1" />

---
transition: slide-left
---

<DetailSlideLoader metric="lcp" :slide-index="2" />

---
transition: fade
---

<DetailSlideLoader metric="lcp" :slide-index="3" />

---
transition: fade
---

<DayIntro :day="4" metric="tbt" />

---
transition: slide-left
---

<MetricIntroLoader metric="tbt" />

---
transition: slide-up
---

<ChoiceFromMetric :metric-index="3" />

---
transition: slide-right
---

<VoteSlide :metric-index="3" />

---
transition: fade
---

<WinnerDisplay :vote-index="3" />

---
transition: slide-up
---

<DetailSlideLoader metric="tbt" :slide-index="1" />

---
transition: fade
---

<DetailSlideLoader metric="tbt" :slide-index="2" />

---
transition: fade
---

<DayIntro :day="5" metric="si" />

---
transition: slide-left
---

<MetricIntroLoader metric="si" />

---
transition: slide-up
---

<ChoiceFromMetric :metric-index="4" />

---
transition: slide-right
---

<VoteSlide :metric-index="4" />

---
transition: fade
---

<WinnerDisplay :vote-index="4" />

---
transition: slide-up
---

<DetailSlideLoader metric="si" :slide-index="1" />

---
transition: fade
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
