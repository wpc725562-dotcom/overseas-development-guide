# 出国发展指南 · Overseas Development Guide

<p align="center">
  <img src="https://img.shields.io/badge/出国发展指南-留学·求职·生活-blue?style=for-the-badge&logo=github" alt="Badge">
  <img src="https://img.shields.io/badge/主攻-日本人文签-brightgreen?style=for-the-badge" alt="Japan">
  <img src="https://img.shields.io/badge/远期-澳洲482%2F189%2F190-orange?style=for-the-badge" alt="Australia">
  <img src="https://img.shields.io/badge/状态-持续完善-yellow?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/信息核验-8%2F8%20已核验-red?style=for-the-badge" alt="Verified">
</p>

> 面向计划 **出国留学 / 海外求职移民 / 海外生活** 的系统性个人指南。
> 由个人整理维护，涵盖从「为什么要出去」到「如何落地与长期发展」的完整路径。

## 🌐 在线网站

**https://wpc725562-dotcom.github.io/overseas-development-guide/**

> VitePress 构建 · 与专升本笔记站同款 Sakura 主题。本地预览：`npm run docs:dev`

## 📌 内容导航

| 板块 | 目录 | 说明 |
| --- | --- | --- |
| ✈️ 出国留学 | [`docs/study-abroad/`](docs/study-abroad/) | 选校定位、申请材料、语言考试、签证、留学时间线 |
| 💼 海外求职与移民 | [`docs/career-immigration/`](docs/career-immigration/) | 简历、求职渠道、面试、工签、移民路径 |
| 🏡 海外生活 | [`docs/living-abroad/`](docs/living-abroad/) | 落地安顿、租房、税务保险、文化适应 |
| ✅ 清单与工具 | [`docs/checklists/`](docs/checklists/) | 各种 checklist、模板、资源汇总表 |
| 👤 个人专属 | [`docs/personal/`](docs/personal/) | 个人路线图、行动表、官方核对清单 |

## 🚀 快速开始

从这些入口开始：

- 还不知道该去哪 → 先看 [整体决策框架](docs/read-me-first.md)
- 明确要留学 → [留学规划总览](docs/study-abroad/study-01-overview.md)
- 明确要找工作 → [海外求职总览](docs/career-immigration/career-01-overview.md)
- 目标**澳洲** → [澳洲签证/语言/求职平台速查](docs/career-immigration/countries/australia.md)
- 目标**日本** → [日本人文签/语言/求职平台速查](docs/career-immigration/countries/japan.md)
- 想快速列 To-do → [核心 Checklist](docs/checklists/core-checklist.md)
- 👤 **我的定制路线**（广东/全日制本科/信息安全/主攻日本）→ [个人专属板块](docs/personal/index.md)

## 🤝 说明

> [!NOTE]
> 本仓库为**个人用途**整理，信息可能存在时效性和地区差异。
> 涉及签证、移民、法律等专业事项时，请务必核实官方网站最新信息。

### 内容结构

```text
overseas-development-guide/
├── README.md                 # 本文件，总入口
├── package.json              # VitePress 站点脚本
├── .github/workflows/deploy.yml  # GitHub Pages 自动部署
├── docs/                     # VitePress 站点源
│   ├── index.md              # 站点首页
│   ├── .vitepress/           # 配置 + Sakura 主题
│   ├── read-me-first.md      # 决策框架
│   ├── study-abroad/         # 留学板块
│   ├── career-immigration/   # 求职 / 移民板块（含 countries 国别速查）
│   ├── living-abroad/        # 海外生活板块
│   ├── personal/             # 个人专属板块
│   ├── checklists/           # 清单、模板、资源
│   └── public/               # favicon / live2d / 音乐
└── scripts/                  # 迁移/维护脚本
```

## 📝 状态

- [x] VitePress 在线网站（Sakura 主题，GitHub Pages 部署）
- [x] 留学 / 求职移民 / 海外生活 三大板块
- [x] 按国别速查（澳洲、日本）+ 个人专属板块
- [ ] 内容持续完善