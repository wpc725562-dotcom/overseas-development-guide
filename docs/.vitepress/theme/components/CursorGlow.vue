<template>
  <div ref="glow" class="cursor-glow" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const glow = ref<HTMLElement>()
let rafId: number | null = null
let targetX = 0
let targetY = 0
let curX = 0
let curY = 0

function onMove(e: MouseEvent) {
  targetX = e.clientX
  targetY = e.clientY
  if (rafId === null) rafId = requestAnimationFrame(loop)
}

function loop() {
  // 平滑跟随
  curX += (targetX - curX) * 0.18
  curY += (targetY - curY) * 0.18
  if (glow.value) {
    glow.value.style.transform = `translate(${curX}px, ${curY}px)`
  }
  if (Math.abs(targetX - curX) > 0.5 || Math.abs(targetY - curY) > 0.5) {
    rafId = requestAnimationFrame(loop)
  } else {
    rafId = null
  }
}

onMounted(() => {
  // 仅桌面端启用（触屏无意义且会增加负担）
  if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('mousemove', onMove, { passive: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.cursor-glow {
  position: fixed;
  top: 0; left: 0;
  width: 240px; height: 240px;
  margin-left: -120px;
  margin-top: -120px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(circle, rgba(228,89,111,0.10), transparent 60%);
  mix-blend-mode: multiply;
  opacity: 0;
  animation: fade-in 0.6s 0.2s ease forwards;
}
@keyframes fade-in { to { opacity: 1; } }

/* 暗黑模式用 screen 混合，让光晕在暗色上更明显 */
:global(.dark) .cursor-glow {
  mix-blend-mode: screen;
  background: radial-gradient(circle, rgba(245,184,196,0.10), transparent 60%);
}

/* 触屏设备隐藏 */
@media (hover: none) {
  .cursor-glow { display: none; }
}
</style>
