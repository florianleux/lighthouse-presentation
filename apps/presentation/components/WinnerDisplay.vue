<script setup lang="ts">
import { computed } from 'vue'
import { voteStore } from '../setup/main'

const props = defineProps<{
  voteIndex: number
}>()

// Données des options par vote
const voteData = {
  0: {
    A: {
      title: 'Images & Transfer',
      fixes: [
        'Conversion images en WebP',
        'Ajout loading="lazy" below-fold',
        'Ajout attributs width et height',
        'Suppression CSS render-blocking',
        'Activation compression gzip/brotli'
      ]
    },
    B: {
      title: 'Fonts & JavaScript',
      fixes: [
        'font-display: swap sur toutes les fonts',
        'Suppression fonts render-blocking',
        'Ajout preconnect domaines externes',
        'Suppression lodash, moment, jQuery',
        'Suppression third-party scripts bloquants',
        'Suppression script inline 500ms'
      ]
    }
  },
  1: {
    A: {
      title: 'Visual',
      fixes: [
        'Amélioration contrastes (ratio 4.5:1)',
        'Ajout focus indicators visibles',
        'Labels sur tous les inputs',
        'Noms accessibles sur liens/boutons',
        'Contrôles sur médias auto-play'
      ]
    },
    B: {
      title: 'Semantic',
      fixes: [
        'Remplacement div cliquables par button',
        'Ajout attribut lang sur html',
        'Ajout skip link',
        'Correction keyboard traps',
        'Correction hiérarchie headings (h1→h2→h3)'
      ]
    }
  },
  2: {
    A: {
      title: 'Console & Security',
      fixes: [
        'Suppression console.log en production',
        'Ajout rel="noopener" sur liens externes',
        'Suppression document.write()',
        'Correction erreurs console',
        'Mise à jour librairies vulnérables'
      ]
    },
    B: {
      title: 'Modern Standards',
      fixes: [
        "Correction dimensions d'affichage images",
        'Vérification doctype',
        'Suppression demandes permissions agressives',
        'Ajout passive listeners (scroll, touch)',
        'Masquage source maps en production'
      ]
    }
  },
  3: {
    A: {
      title: 'Meta & Structure',
      fixes: [
        'Ajout title unique',
        'Ajout meta name="description"',
        'Un seul h1 par page',
        'Vérification viewport meta',
        'Ajout canonical URL'
      ]
    },
    B: {
      title: 'Content & Links',
      fixes: [
        'Texte de liens descriptif (pas de "click here")',
        'Attributs alt sur toutes les images',
        'Suppression meta noindex',
        'Navigation crawlable (vrais a href)',
        'Suppression chaînes de redirections'
      ]
    }
  }
}

const choice = computed(() => voteStore.getChoice(props.voteIndex))
const winner = computed(() => {
  const c = choice.value
  if (!c) return null
  return voteData[props.voteIndex as keyof typeof voteData][c as 'A' | 'B']
})
</script>

<template>
  <div v-if="choice && winner" class="mt-4">
    <div class="text-2xl mb-4">
      L'équipage a choisi : <span class="font-bold" :class="choice === 'A' ? 'text-blue-500' : 'text-amber-500'">Option {{ choice }}</span>
    </div>
    <div class="p-6 border-2 rounded-lg" :class="choice === 'A' ? 'border-blue-500' : 'border-amber-500'">
      <div class="text-xl font-bold mb-4">{{ winner.title }}</div>
      <ul class="space-y-2">
        <li v-for="fix in winner.fixes" :key="fix" class="flex items-start gap-2">
          <span class="text-green-500">✓</span>
          <span>{{ fix }}</span>
        </li>
      </ul>
    </div>
  </div>
  <div v-else class="mt-4 p-6 border rounded-lg text-center opacity-50">
    Aucun vote enregistré - retournez au slide de vote
  </div>
</template>
