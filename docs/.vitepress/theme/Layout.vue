<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <CursorGlow />
      <ReadingProgress />
      <SakuraPetals />
      <MusicPlayer />
    </template>

    <template #doc-before>
      <div class="doc-banner" :style="docBannerStyle" v-if="showBanner">
        <nav class="doc-breadcrumb" aria-label="面包屑导航">
          <a :href="withBase('/')">首页</a>
          <span aria-hidden="true">/</span>
          <template v-if="route.path.includes('/posts/')">
            <a :href="withBase('/posts/' + subjectSlug + '/')">{{ subjectLabel }}</a>
            <span aria-hidden="true">/</span>
          </template>
          <span aria-current="page">{{ frontmatter.title || '正文' }}</span>
        </nav>
        <h1 class="doc-title">{{ frontmatter.title || '专升本笔记' }}</h1>
        <div class="doc-meta" v-if="frontmatter.description">
          <span class="doc-date">{{ frontmatter.description }}</span>
        </div>
      </div>
    </template>

    <template #layout-bottom>
      <Live2DWidget />
      <BackToTop />
      <CopyToast />
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute, withBase } from 'vitepress'
import { computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import SakuraPetals from './components/SakuraPetals.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import BackToTop from './components/BackToTop.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import Live2DWidget from './components/Live2DWidget.vue'
import CursorGlow from './components/CursorGlow.vue'
import CopyToast from './components/CopyToast.vue'

const { frontmatter } = useData()
const route = useRoute()

const showBanner = computed(() => Boolean(frontmatter.value?.title) && route.path !== withBase('/'))

const subjectSlug = computed(() => {
  const m = route.path.match(/\/posts\/([^/]+)/)
  return m?.[1] || ''
})

const subjectLabel = computed(() => {
  const map: Record<string, string> = {
    computer: '计算机',
    english: '公共英语',
    math: '高等数学',
    politics: '政治理论',
  }
  return map[subjectSlug.value] || '历年真题'
})

const docBannerStyle = computed<Record<string, string>>(() => {
  const cover = frontmatter.value.cover
  if (cover) {
    const raw = String(cover)
    const href = raw.startsWith('http') ? raw : withBase(raw.startsWith('/') ? raw : `/${raw}`)
    const safe = href.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url("${safe}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {
    background: 'linear-gradient(135deg, var(--sakura-pink), var(--sakura-warm))',
  }
})

// 可选：代码/图片交互轻量增强（无 medium-zoom 依赖时跳过）
let cleanup: (() => void) | null = null
onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') document.documentElement.classList.remove('zoom-open')
  }
  window.addEventListener('keydown', onKey)
  cleanup = () => window.removeEventListener('keydown', onKey)
  watch(
    () => route.path,
    () => nextTick(() => {
      document.querySelectorAll('.vp-doc blockquote').forEach((el) => {
        if (!el.classList.contains('answer-box') && /答案/.test(el.textContent || '')) {
          el.classList.add('answer-box')
        }
      })
    }),
    { immediate: true },
  )
})
onUnmounted(() => cleanup?.())
</script>
