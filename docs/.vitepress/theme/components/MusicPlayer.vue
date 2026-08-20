<template>
  <button
    class="music-toggle"
    :class="{ playing: playing, buffering: buffering }"
    :title="buffering ? '加载中...' : (playing ? '暂停' : '♪ 播放')"
    :aria-label="buffering ? '音乐加载中' : (playing ? '暂停背景音乐' : '播放背景音乐')"
    :aria-pressed="playing"
    type="button"
    @click.stop="toggle"
  >
    <span class="music-icon">{{ buffering ? '⟳' : '♪' }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'

const playing = ref(false)
const buffering = ref(false)
let audio: HTMLAudioElement | null = null
let sourceAttached = false

const onPlay = () => { playing.value = true; buffering.value = false }
const onPause = () => { playing.value = false }
const onEnded = () => { playing.value = false }
const onWaiting = () => { buffering.value = true }
const onCanPlay = () => { buffering.value = false }
const onError = (e: Event) => {
  console.error('音乐加载失败:', audio?.error?.message || e)
  playing.value = false
  buffering.value = false
}

onMounted(() => {
  // 不在首屏设置 src；只有用户主动播放时才开始请求 4MB+ 音频。
  audio = new Audio()
  audio.loop = true
  audio.preload = 'none'
  audio.addEventListener('play', onPlay)
  audio.addEventListener('pause', onPause)
  audio.addEventListener('ended', onEnded)
  audio.addEventListener('waiting', onWaiting)
  audio.addEventListener('canplay', onCanPlay)
  audio.addEventListener('error', onError)
})

onUnmounted(() => {
  if (!audio) return
  audio.pause()
  audio.removeEventListener('play', onPlay)
  audio.removeEventListener('pause', onPause)
  audio.removeEventListener('ended', onEnded)
  audio.removeEventListener('waiting', onWaiting)
  audio.removeEventListener('canplay', onCanPlay)
  audio.removeEventListener('error', onError)
  audio.src = ''
  audio = null
})

function toggle() {
  if (!audio) return
  if (audio.paused) {
    if (!sourceAttached) {
      audio.src = withBase('/music.mp3')
      sourceAttached = true
    }
    buffering.value = true
    audio.play().then(() => {
      buffering.value = false
    }).catch((e) => {
      console.error('音乐播放失败:', e)
      playing.value = false
      buffering.value = false
    })
  } else {
    audio.pause()
  }
}
</script>

<style scoped>
.music-toggle {
  position: fixed;
  bottom: 32px;
  right: 88px;
  z-index: 101;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.music-toggle:hover {
  color: var(--sakura-deep);
  border-color: var(--sakura-pink);
  box-shadow: 0 4px 16px rgba(232, 138, 154, 0.25);
}
.music-toggle.playing {
  border-color: var(--sakura-pink);
  color: var(--sakura-deep);
  box-shadow: 0 0 16px rgba(255, 183, 197, 0.4);
}
.music-toggle.playing .music-icon {
  animation: music-spin 3s linear infinite;
}
.music-toggle.buffering .music-icon {
  animation: music-spin 0.8s linear infinite;
  opacity: 0.7;
}

@keyframes music-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .music-toggle { bottom: 24px; right: 76px; width: 40px; height: 40px; font-size: 18px; }
}
</style>
