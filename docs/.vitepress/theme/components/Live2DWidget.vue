<template>
  <div class="live2d-controls">
    <button
      v-if="loaded && !disabled"
      class="live2d-close"
      type="button"
      aria-label="关闭看板娘"
      title="关闭看板娘"
      @click="disableWidget"
    >×</button>
    <button
      v-else-if="disabled && desktopEligible"
      class="live2d-restore"
      type="button"
      title="显示看板娘"
      @click="restoreWidget"
    >🌸 看板娘</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'

const MODEL_PATH = withBase('/live2d/model.json')
const STORAGE_KEY = 'overseas-live2d-disabled'
const loaded = ref(false)
const disabled = ref(false)
const desktopEligible = ref(false)
let loadTimer: ReturnType<typeof setTimeout> | null = null
let idleHandle: number | null = null

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

declare global {
  interface Window {
    L2Dwidget: any
  }
}

async function loadResources(): Promise<void> {
  // Font Awesome（live2d-widget 依赖）
  if (!document.querySelector('link[data-live2d="fa"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = withBase('/live2d/font-awesome.min.css')
    link.setAttribute('data-live2d', 'fa')
    document.head.appendChild(link)
  }

  // L2Dwidget JS（已本地化，不依赖 CDN）
  if (!window.L2Dwidget) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = withBase('/live2d/L2Dwidget.min.js')
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Live2D load failed'))
      document.head.appendChild(script)
    })
  }
}

function initWidget(): void {
  // L2Dwidget 的 webpack public path 已调整为根域名下的 /live2d/，
  // 会自动从本地加载 chunk (L2Dwidget.0.min.js) 与模型资源。
  window.L2Dwidget.init({
    tagMode: false,
    debug: false,
    model: {
      jsonPath: MODEL_PATH,
      scale: 1,
    },
    display: {
      superSample: 2,
      width: 200,
      height: 300,
      position: 'left',
      hOffset: 0,
      vOffset: -20,
    },
    mobile: {
      show: false,
      scale: 0.5,
      motion: false,
    },
    react: {
      opacityDefault: 0.8,
      opacityOnHover: 0.2,
    },
    dialog: {
      enable: false,
      hitokoto: false,
    },
    name: {
      canvas: 'live2dcanvas',
      div: 'live2d-widget',
    },
    dev: {
      border: false,
    },
  })
  loaded.value = true
}

function shouldLoad(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches
    && !connection?.saveData
}

async function loadWidget(): Promise<void> {
  if (disabled.value || loaded.value) return
  try {
    await loadResources()
    initWidget()
  } catch (e) {
    console.error('Live2D load failed:', e)
  }
}

function setWidgetVisible(visible: boolean): boolean {
  // 兼容修复前错误使用的 live2d-tooltip 容器 ID。
  const widget = document.getElementById('live2d-widget')
    || document.getElementById('live2d-tooltip')
    || document.getElementById('live2dcanvas')?.parentElement
  if (!widget) return false
  widget.style.display = visible ? '' : 'none'
  return true
}

function disableWidget(): void {
  disabled.value = true
  localStorage.setItem(STORAGE_KEY, '1')
  // L2Dwidget 没有可靠的销毁 API。保留已初始化实例，仅隐藏画布，
  // 避免恢复时重复创建 WebGL 上下文导致花屏。
  setWidgetVisible(false)
}

function restoreWidget(): void {
  disabled.value = false
  localStorage.removeItem(STORAGE_KEY)
  if (setWidgetVisible(true)) {
    loaded.value = true
    return
  }
  void loadWidget()
}

onMounted(() => {
  desktopEligible.value = shouldLoad()
  disabled.value = localStorage.getItem(STORAGE_KEY) === '1'
  if (!desktopEligible.value || disabled.value) return

  // 浏览器空闲时再加载 1MB+ 的模型；不支持 idle callback 时延迟加载。
  const idleWindow = window as IdleWindow
  if (idleWindow.requestIdleCallback) {
    idleHandle = idleWindow.requestIdleCallback(() => {
      void loadWidget()
    }, { timeout: 5000 })
  } else {
    loadTimer = setTimeout(() => {
      void loadWidget()
    }, 3000)
  }
})

onUnmounted(() => {
  if (loadTimer) clearTimeout(loadTimer)
  if (idleHandle !== null) {
    const idleWindow = window as IdleWindow
    idleWindow.cancelIdleCallback?.(idleHandle)
  }
})
</script>

<style scoped>
.live2d-close,
.live2d-restore {
  position: fixed;
  left: 16px;
  z-index: 102;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  color: var(--vp-c-text-2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, .1);
  backdrop-filter: blur(10px);
  cursor: pointer;
}
.live2d-close {
  bottom: 286px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
}
.live2d-restore {
  bottom: 18px;
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 12px;
}
.live2d-close:hover,
.live2d-restore:hover { color: var(--accent-color); border-color: var(--sakura-pink); }
@media (max-width: 899px) { .live2d-controls { display: none; } }
</style>
