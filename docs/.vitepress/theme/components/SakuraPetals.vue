<template>
  <div class="petals" aria-hidden="true">
    <svg v-for="p in petals" :key="p.i"
      class="petal"
      :style="p.style"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C8.5 2 5 5 5 8c0 4 7 12 7 12s7-8 7-12c0-3-3.5-6-7-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const petals = ref<Array<{ i: number; style: Record<string, string> }>>([])
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  petals.value = Array.from({ length: 16 }, (_, i) => {
    // 每片花瓣独立的横向漂移终点，避免 16 片同步移动
    const drift = Math.round(-60 + Math.random() * 160)
    return {
      i,
      style: {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${10 + Math.random() * 15}s`,
        width: `${10 + Math.random() * 14}px`,
        height: `${10 + Math.random() * 14}px`,
        opacity: String(0.12 + Math.random() * 0.25),
        color: `hsl(${340 + Math.random() * 20}, 70%, 70%)`,
        '--drift': `${drift}px`,
      } as Record<string, string>,
    }
  })
})
</script>

<style scoped>
.petals {
  position: fixed; inset: 0; pointer-events: none; z-index: 10; overflow: hidden;
}
.petal {
  position: absolute; top: -30px;
  animation: fall linear infinite;
  transform-origin: center;
}
@keyframes fall {
  0%   { transform: translateY(-30px) rotate(0deg) translateX(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.5; }
  100% { transform: translateY(105vh) rotate(540deg) translateX(var(--drift, 80px)); opacity: 0; }
}
</style>
