<template>
  <div class="giscus-wrap">
    <h2 class="giscus-title">💬 评论区</h2>
    <div ref="el" class="giscus" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'

const el = ref<HTMLElement | null>(null)
const route = useRoute()
const { isDark } = useData()

function loadGiscus() {
  if (!el.value) return
  el.value.innerHTML = ''
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', 'wpc725562-dotcom/overseas-development-guide')
  script.setAttribute('data-repo-id', 'R_kgDOT-XOwA')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDOT-XOwM4DD3Yg')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')
  el.value.appendChild(script)
}

onMounted(() => {
  // 主题切换时重新加载 giscus（换主题）
  watch(
    isDark,
    () => {
      nextTick(() => {
        const frame = el.value?.querySelector('iframe')
        if (frame && frame.contentWindow) {
          frame.contentWindow.postMessage(
            { giscus: { setConfig: { theme: isDark.value ? 'dark' : 'light' } } },
            'https://giscus.app'
          )
        }
      })
    }
  )
  loadGiscus()
  watch(
    () => route.path,
    () => nextTick(loadGiscus)
  )
})
</script>

<style scoped>
.giscus-wrap {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}
.giscus-title {
  font-size: 18px;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
}
</style>
