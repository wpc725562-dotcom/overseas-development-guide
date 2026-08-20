<template>
  <Transition name="copy-toast">
    <div v-if="visible" class="copy-toast" role="status" aria-live="polite">✓ 代码已复制</div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function onClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (!target?.closest('.vp-doc button.copy')) return
  visible.value = true
  clearTimeout(timer)
  timer = setTimeout(() => { visible.value = false }, 1600)
}

onMounted(() => document.addEventListener('click', onClick))
onUnmounted(() => {
  document.removeEventListener('click', onClick)
  clearTimeout(timer)
})
</script>

<style scoped>
.copy-toast { position: fixed; right: 24px; bottom: 88px; z-index: 1002; padding: 10px 14px; border-radius: 12px; color: #fff; background: rgba(36, 42, 48, .92); box-shadow: 0 8px 28px rgba(0,0,0,.2); font-size: 13px; }
.copy-toast-enter-active, .copy-toast-leave-active { transition: opacity .2s, transform .2s; }
.copy-toast-enter-from, .copy-toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
