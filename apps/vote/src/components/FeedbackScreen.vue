<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  cancel: []
  send: [feedback: string]
}>()

const feedback = ref('')
const sent = ref(false)

function handleSend() {
  if (!feedback.value.trim()) return
  sent.value = true
  emit('send', feedback.value.trim())
}
</script>

<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
    <h2 class="text-[200%] font-title text-shadow-md text-shadow-black text-white text-center mb-6">
      Share your thoughts
    </h2>

    <template v-if="!sent">
      <textarea
        v-model="feedback"
        placeholder="Your feedback..."
        rows="5"
        class="w-[85vw] max-w-[400px] py-4 px-5 text-xl border-2 border-white rounded-xl bg-white text-black outline-none transition-colors duration-200 focus:border-black placeholder:text-black/40 font-title resize-none shadow-[0_0_32px_-3px_rgba(0,0,0,0.62)]"
      />

      <div class="flex gap-4 mt-6 w-[85vw] max-w-[400px]">
        <button
          @click="emit('cancel')"
          class="flex-1 py-4 px-6 text-xl font-semibold text-white bg-transparent border-2 border-white rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 font-title"
        >
          Cancel
        </button>
        <button
          @click="handleSend"
          :disabled="!feedback.trim()"
          class="flex-1 py-4 px-6 text-xl font-semibold text-black bg-[#E9BB23] shadow-[0_0_32px_-3px_rgba(0,0,0,0.62)] border-none rounded-xl cursor-pointer transition-all duration-200 hover:enabled:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed font-title"
        >
          Send
        </button>
      </div>
    </template>

    <template v-else>
      <p class="text-[150%] font-title text-shadow-md text-shadow-black text-white text-center mt-4">
        Thanks for your feedback, pirate!
      </p>
      <button
        @click="emit('cancel')"
        class="mt-6 py-4 px-8 text-xl font-semibold text-black bg-[#E9BB23] shadow-[0_0_32px_-3px_rgba(0,0,0,0.62)] border-none rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] font-title"
      >
        Back
      </button>
    </template>
  </div>
</template>
