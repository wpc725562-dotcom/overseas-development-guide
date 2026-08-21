import { defineConfig } from 'vitepress'

// GitHub Pages 项目站固定 base
const base = process.env.VITEPRESS_BASE || '/overseas-development-guide/'

export default defineConfig({
  title: '出国发展指南 · Overseas Guide',
  description: '出国留学 / 海外求职移民 / 海外生活 · 个人系统化指南',
  lang: 'zh-CN',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#e4596f' }],
    // PWA
    ['link', { rel: 'manifest', href: `${base}manifest.json` }],
    ['link', { rel: 'apple-touch-icon', href: `${base}icon-192.png` }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['script', {}, `if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('${base}sw.js').catch(() => {})); }`],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600;700&display=swap', rel: 'stylesheet' }],
  ],

  markdown: {
    math: true,
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: '出国发展指南',
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有结果',
            resetButtonTitle: '清空',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '🧭 决策框架', link: '/read-me-first' },
      {
        text: '✈️ 出国留学',
        items: [
          { text: '留学规划总览', link: '/study-abroad/' },
          { text: '选校与定位', link: '/study-abroad/study-02-choosing-school' },
          { text: '申请材料与文书', link: '/study-abroad/study-03-application-materials' },
          { text: '语言考试规划', link: '/study-abroad/study-04-language-tests' },
          { text: '签证办理', link: '/study-abroad/study-05-visa' },
          { text: '留学时间线', link: '/study-abroad/study-06-timeline' },
          { text: '奖学金与经费', link: '/study-abroad/study-07-funding' },
        ],
      },
      {
        text: '💼 求职移民',
        items: [
          { text: '海外求职总览', link: '/career-immigration/' },
          { text: '求职准备与定位', link: '/career-immigration/career-02-preparation' },
          { text: '简历与作品集', link: '/career-immigration/career-03-resume' },
          { text: '求职渠道与内推', link: '/career-immigration/career-04-channels' },
          { text: '面试准备', link: '/career-immigration/career-05-interview' },
          { text: '工作签证', link: '/career-immigration/career-06-work-visa' },
          { text: '移民路径', link: '/career-immigration/career-07-immigration' },
          { text: '🌏 按国别速查', link: '/career-immigration/countries/' },
        ],
      },
      {
        text: '🏡 海外生活',
        items: [
          { text: '海外生活总览', link: '/living-abroad/' },
          { text: '落地安顿', link: '/living-abroad/living-02-settling' },
          { text: '租房与居住', link: '/living-abroad/living-03-housing' },
          { text: '税务与社保', link: '/living-abroad/living-04-tax' },
          { text: '银行与金融', link: '/living-abroad/living-05-banking' },
          { text: '语言与文化适应', link: '/living-abroad/living-06-culture' },
        ],
      },
      {
        text: '👤 我的专属',
        items: [
          { text: '个人板块', link: '/personal/' },
          { text: '🧭 个人路线图', link: '/personal/route-plan' },
          { text: '📅 按月行动表', link: '/personal/monthly-plan' },
          { text: '⚖️ 澳日对比', link: '/personal/compare-au-jp' },
          { text: '💰 低成本方案', link: '/personal/cost-manage' },
          { text: '🔗 官方核对清单', link: '/personal/official-links' },
          { text: '🌟 GitHub 高星资源', link: '/personal/github-resources' },
        ],
      },
      { text: '✅ 核心 Checklist', link: '/checklists/core-checklist' },
      {
        text: 'GitHub',
        link: 'https://github.com/wpc725562-dotcom/overseas-development-guide',
      },
    ],
    sidebar: {
      '/read-me-first': [],
      '/study-abroad/': [
        {
          text: '✈️ 出国留学',
          items: [
            { text: '留学规划总览', link: '/study-abroad/' },
            { text: '选校与定位', link: '/study-abroad/study-02-choosing-school' },
            { text: '申请材料与文书', link: '/study-abroad/study-03-application-materials' },
            { text: '语言考试规划', link: '/study-abroad/study-04-language-tests' },
            { text: '签证办理', link: '/study-abroad/study-05-visa' },
            { text: '留学时间线', link: '/study-abroad/study-06-timeline' },
            { text: '奖学金与经费', link: '/study-abroad/study-07-funding' },
          ],
        },
      ],
      '/career-immigration/': [
        {
          text: '💼 海外求职与移民',
          items: [
            { text: '海外求职总览', link: '/career-immigration/' },
            { text: '求职准备与定位', link: '/career-immigration/career-02-preparation' },
            { text: '简历与作品集', link: '/career-immigration/career-03-resume' },
            { text: '求职渠道与内推', link: '/career-immigration/career-04-channels' },
            { text: '面试准备', link: '/career-immigration/career-05-interview' },
            { text: '工作签证', link: '/career-immigration/career-06-work-visa' },
            { text: '移民路径', link: '/career-immigration/career-07-immigration' },
          ],
        },
        {
          text: '🌏 按国别速查',
          items: [
            { text: '国别索引', link: '/career-immigration/countries/' },
            { text: '🇦🇺 澳大利亚', link: '/career-immigration/countries/australia' },
            { text: '🇯🇵 日本', link: '/career-immigration/countries/japan' },
          ],
        },
      ],
      '/living-abroad/': [
        {
          text: '🏡 海外生活',
          items: [
            { text: '海外生活总览', link: '/living-abroad/' },
            { text: '落地安顿', link: '/living-abroad/living-02-settling' },
            { text: '租房与居住', link: '/living-abroad/living-03-housing' },
            { text: '税务与社保', link: '/living-abroad/living-04-tax' },
            { text: '银行与金融', link: '/living-abroad/living-05-banking' },
            { text: '语言与文化适应', link: '/living-abroad/living-06-culture' },
          ],
        },
      ],
      '/personal/': [
        {
          text: '👤 我的专属',
          items: [
            { text: '个人板块', link: '/personal/' },
            { text: '🧭 个人路线图', link: '/personal/route-plan' },
            { text: '📅 按月行动表', link: '/personal/monthly-plan' },
            { text: '⚖️ 澳日对比', link: '/personal/compare-au-jp' },
            { text: '💰 低成本方案', link: '/personal/cost-manage' },
            { text: '🔗 官方核对清单', link: '/personal/official-links' },
            { text: '🌟 GitHub 高星资源', link: '/personal/github-resources' },
          ],
        },
      ],
      '/checklists/': [
        {
          text: '✅ 清单',
          items: [
            { text: '核心 Checklist', link: '/checklists/core-checklist' },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/wpc725562-dotcom/overseas-development-guide',
      },
    ],
    footer: {
      message: '仅供个人学习参考 · 签证/移民信息请以各国官方为准',
      copyright: '内容整理自公开信息与个人研究 · 非官方来源',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    lastUpdatedText: '最后更新',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切到浅色',
    darkModeSwitchTitle: '切到深色',
  },
})
