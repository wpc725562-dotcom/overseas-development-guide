<template>
  <button
    class="back-to-top"
    :class="{ visible: show }"
    @click="scrollToTop"
    aria-label="回到顶部"
    title="回到顶部"
  >
    <span class="arrow">↑</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)
let ticking = false

function update() {
  show.value = window.scrollY > 300
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    update()
    ticking = false
  })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 100;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(16px);
  pointer-events: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.back-to-top:hover {
  color: var(--accent-color);
  border-color: var(--accent-color);
  box-shadow: 0 4px 16px rgba(254, 150, 0, 0.2);
}

.back-to-top.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.arrow {
  line-height: 1;
  margin-top: -2px;
}
</style>
