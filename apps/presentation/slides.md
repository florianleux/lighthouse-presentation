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
<div class="slide-bg" style="background-image: url('/backgrounds/home-bottom-left.webp')">
  <CrewJoinToast />
  <CrewScatter class="absolute top-[76%] bottom-[5%] right-[4%] left-[-2%]"/>
</div>

---
transition: slide-down
---

<div class="slide-bg" style="background-image: url('/backgrounds/home-bottom-right.webp')">
  <PollButtons poll-id="knowledge-level" />
</div>

---
transition: slide-right
---

<div class="slide-bg" style="background-image: url('/backgrounds/home-top-right.webp')">
<div class="text-4xl text-white font-title text-shadow-md">The Lighthouse score(s)</div>
<div class="text-left text-white text-lg text-shadow-md">Google's open-source tool for auditing web page quality</div>
<div class="grid grid-cols-4 gap-4  text-white pt-8 text-center text-shadow-md">
    <div v-click="4"  class="absolute font-bold left-[22%] text-white top-[24%] text-4xl">Performance</div>
    <div v-click="3"  class="absolute font-bold text-2xl left-[47%] text-white top-[43%] ">Accessibility</div>
    <div v-click="2"  class="absolute font-bold text-2xl left-[67%] text-white top-[35%] ">Best<br>Practices</div>
    <div v-click="1" class="absolute text-2xl left-[90%] text-[#2a384c] top-[40%] font-bold">SEO</div>
</div>
</div>

---
transition: slide-up
---

<div class="slide-bg" style="background-image: url('/backgrounds/home-top-left.webp')">
<div class="text-shadow-md text-white">
<div class="text-4xl text-white font-title">Why does performance matter?</div>


<div class="text-center">
    <div v-click class="text-9xl mt-20 text-white text-center font-bold">24%</div>
    <div v-click class="text-3xl">less <span class="font-bold">abandonment</span><br> on pages that meet<br> Google's performance standards</div>
</div>
</div>

</div>


---
transition: slide-up
---

<div class="slide-bg" style="background-image: url('/backgrounds/blackmarket-middle.webp')"></div>

---
transition: slide-up
---

<div class="slide-bg" style="background-image: url('/backgrounds/intro/6.webp')"></div>

  <div class="w-[68%] absolute right-[16%] top-[16%] aspect-[1960/1250] -rotate-1">
    <BlackMarketIframe />
  </div>

---
transition: slide-left
---

<div class="slide-bg" style="background-image: url('/backgrounds/score-2.webp');"></div>

---
transition: fade
---

<div class="slide-bg" style="background-image: url('/backgrounds/intro-ter-br.webp');"></div>

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
transition: slide-left
---
<Outro />

---
transition: slide-down
---
<OutroIframe />

---

<ThankYou />
