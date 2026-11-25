---
theme: default
colorSchema: light
title: À l'abordage de Lighthouse !
info: |
  ## À l'abordage de Lighthouse !
  Présentation interactive où l'audience vote pour optimiser le score Performance Lighthouse.
  Ensemble, transformons un site en difficulté en phare haute performance.
drawings:
  persist: false
aspectRatio: '1960/1104'
transition: slide-left
mdc: true
fonts:
  provider: none
  sans: 'Crimson Text'
  serif: 'Germania One'
  mono: 'Fira Code'
css: unocss
---

<style src="./styles/theme.css"></style>
<style src="./styles/modals.css"></style>
<script setup>
import { sessionStore } from './setup/main'
</script>

<!-- Mode local : pas d'app de vote, donc fond sans QR code -->
<div
  class="slide-bg"
  :style="{ backgroundImage: localizedBg(`/backgrounds/${sessionStore.localMode ? 'home-bottom-left-local' : 'home-bottom-left'}.webp`) }"
>
  <CrewJoinToast />
  <CrewScatter class="absolute top-[76%] bottom-[5%] right-[4%] left-[-2%]"/>
</div>

---
transition: slide-down
---

<div class="slide-bg" :style="{ backgroundImage: localizedBg('/backgrounds/poll-br.webp') }">
  <PollButtons poll-id="knowledge-level" />
</div>

---
transition: slide-right
---

<div class="slide-bg" style="background-image: url('/backgrounds/home-top-right.webp')">
<div class="text-4xl text-white font-title text-shadow-md">{{ $t('slides.intro.scoresTitle') }}</div>
<div class="text-left text-white text-lg text-shadow-md">{{ $t('slides.intro.scoresSubtitle') }}</div>
<div class="grid grid-cols-4 gap-4  text-white pt-8 text-center text-shadow-lg text-shadow-black">
    <div v-click="5"  class="absolute font-bold left-[19%] text-white top-[24%] text-5xl">Performance</div>
    <div v-click="4"  class="absolute font-bold text-[1.1rem] left-[43%] -translate-x-1/2 text-white top-[51%] " v-html="$t('slides.intro.agenticBrowsing')"></div>
    <div v-click="3"  class="absolute font-bold text-4xl left-[44%] text-white top-[41%] ">{{ $t('slides.intro.accessibility') }}</div>
    <div v-click="2"  class="absolute font-bold text-4xl left-[65%] text-white top-[28%] " v-html="$t('slides.intro.bestPractices')"></div>
    <div v-click="1" class="absolute text-4xl left-[89%] text-[#2a384c] top-[40%] font-bold">SEO</div>
</div>
</div>

---
transition: slide-up
---

<div class="slide-bg" style="background-image: url('/backgrounds/home-top-left.webp')">
<div class="text-shadow-md text-white">
<div class="text-4xl text-white font-title">{{ $t('slides.intro.whyTitle') }}</div>


<div class="text-center">
    <div v-click class="text-9xl mt-20 text-white text-center font-bold">24%</div>
    <div v-click class="text-4xl" v-html="$t('slides.intro.whyStat')"></div>
</div>
</div>

</div>


---
transition: slide-up
---

<div class="slide-bg" :style="{ backgroundImage: localizedBg('/backgrounds/blackmarket-middle.webp') }"></div>

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

<div class="slide-bg" :style="{ backgroundImage: localizedBg('/backgrounds/intro-ter-br.webp') }"></div>

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
transition: fade
---

<DetailSlideLoader metric="fcp" :slide-index="2" />

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
transition: fade
---

<DetailSlideLoader metric="lcp" :slide-index="2" />

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
clicks: 6
---
<OutroIframe />

---

<ThankYou />
