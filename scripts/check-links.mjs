#!/usr/bin/env node
/**
 * 站点死链检查脚本（VitePress markdown 链接）
 * 用法：
 *   node scripts/check-links.mjs                # 检查全部（默认）
 *   node scripts/check-links.mjs --quick        # 只检查本地 .md 链接，跳过外链
 *   node scripts/check-links.mjs --json         # JSON 输出
 */
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, dirname, resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = join(ROOT, 'docs')
const QUICK = process.argv.includes('--quick')
const JSON_OUT = process.argv.includes('--json')

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (name.startsWith('.') || name === 'node_modules' || name === 'dist' || name === 'cache') continue
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (extname(p) === '.md') out.push(p)
  }
  return out
}

function resolveLink(fromFile, link) {
  // 去掉锚点、query
  const clean = link.split('#')[0].split('?')[0]
  if (!clean || /^https?:|^mailto:|^tel:/.test(clean)) return null // 外链跳过（quick 模式）
  if (QUICK && /^https?:/.test(clean)) return null
  const base = dirname(fromFile)
  let target = clean
  if (target.endsWith('.md')) target = target.slice(0, -3)
  // VitePress cleanUrls: /xxx 或 xxx -> xxx.md 或 xxx/index.md
  const candidates = [
    resolve(base, target + '.md'),
    resolve(base, target, 'index.md'),
    resolve(base, clean), // 原样（可能带 .md 或已存在）
  ]
  // 绝对路径（以 / 开头 → 先查 public 静态资源，再查 DOCS）
  if (clean.startsWith('/')) {
    const publicTargets = [join(ROOT, 'docs', 'public', clean.slice(1))]
    if (existsAny(publicTargets)) return [publicTargets[0]]
    return [join(DOCS, clean.slice(1) + '.md'), join(DOCS, clean.slice(1), 'index.md'), join(DOCS, clean.slice(1))]
  }
  return candidates
}

function existsAny(paths) {
  return paths.some((p) => { try { return statSync(p).isFile() } catch { return false } })
}

const files = walk(DOCS)
const broken = []
let totalLinks = 0

for (const f of files) {
  const content = readFileSync(f, 'utf-8')
  // markdown 链接 [text](target)：排除代码块内的误匹配（如 a[i][j]）
  // 只匹配 target 是「合理的链接形式」：含 / . : # 或为普通文件名
  const mdLinks = [...content.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)]
  for (const m of mdLinks) {
    const link = m[1]
    // 过滤误匹配：target 不含 / . : # 且不是常见文件扩展名 → 跳过（如 i≥j 场景的残留）
    if (!/[\/\.:#]/.test(link) && !/[a-zA-Z0-9_-]+\.[a-zA-Z]+/.test(link)) continue
    totalLinks++
    const resolved = resolveLink(f, link)
    if (!resolved) continue
    if (!existsAny(resolved)) broken.push({ file: f.slice(ROOT.length + 1), link })
  }
  // 图片链接 ![](/xxx.png)
  const imgLinks = [...content.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)]
  for (const m of imgLinks) {
    totalLinks++
    const link = m[1]
    if (/^https?:/.test(link)) continue
    const resolved = resolveLink(f, link)
    if (!resolved) continue
    if (!existsAny(resolved)) broken.push({ file: f.slice(ROOT.length + 1), link })
  }
}

// ============ Obsidian 双链检查 [[xxx]] ============
// 语义：目标相对仓库根解析；带 | 时取 | 前为路径；路径优先，再按 basename 全库匹配
// 检查全库（docs + 源库）中的所有 [[双链]]
const WIKI_RE = /\[\[([^\]]+?)\]\]/g
const allMd = walk(ROOT).filter((p) => !p.includes('node_modules') && !p.includes('.obsidian'))
const wikiBroken = []
let wikiTotal = 0
for (const f of allMd) {
  const content = readFileSync(f, 'utf-8')
  for (const m of content.matchAll(WIKI_RE)) {
    wikiTotal++
    let raw = m[1].trim()
    // 拆显示名：| 或 \| 都是「路径|显示名」分隔，取第一段为路径
    const target = raw.replace(/\\\|/g, '|').split('|')[0].trim()
    if (!target) continue
    const rel = target.replace(/\\/g, '/').replace(/^\/+/, '')
    // 路径优先：先去掉尾部转义 \ 再匹配
    const relClean = rel.replace(/\\+$/, '')
    const pathHit = allMd.find((p) => {
      const rp = p.slice(ROOT.length + 1).replace(/\\/g, '/')
      return rp === relClean + '.md' || rp === relClean || rp.startsWith(relClean + '/')
    })
    if (pathHit) continue
    // basename 匹配（Obsidian 语义：文件名去路径，也允许指向同名目录）
    // 归一化：去尾部/全部反斜杠转义、空格↔连字符、去 _ 前缀与括号
    const norm = (s) => s.replace(/\\/g, '').replace(/[_（）()]/g, '').replace(/\s+/g, '-').toLowerCase()
    const base = norm(relClean.split('/').pop())
    const baseHit = allMd.some((p) => {
      const name = norm(p.split(sep).pop().replace(/\.md$/, ''))
      return name === base || (name.includes(base) && base.length >= 4)
    })
    // 目录匹配：全库同名目录（Obsidian 可链接到文件夹）
    const dirHit = base.length >= 4 && allMd.some((p) => {
      const dirName = norm(p.split(sep).slice(-2)[0])
      return dirName === base
    })
    // 跳过已知的代码示例文档（agent-troubleshoot 讲链接修复，含伪链接）
    const isExampleDoc = f.includes('agent-troubleshoot')
    if (!baseHit && !dirHit && !isExampleDoc) wikiBroken.push({ file: f.slice(ROOT.length + 1), link: `[[${target}]]` })
  }
}

// 合并到输出
for (const b of wikiBroken) broken.push(b)
totalLinks += wikiTotal
const wikiNote = wikiTotal ? `（含 ${wikiTotal} 个 Obsidian 双链）` : ''

if (JSON_OUT) {
  console.log(JSON.stringify({ totalLinks, brokenCount: broken.length, broken }, null, 2))
  process.exit(broken.length ? 1 : 0)
}

if (broken.length === 0) {
  console.log(`✅ 无死链（检查 ${files.length} 个文件，${totalLinks} 个链接${wikiNote}）`)
} else {
  console.log(`❌ 发现 ${broken.length} 处死链（共 ${totalLinks} 个链接${wikiNote}）：`)
  for (const b of broken) console.log(`  ${b.file} -> ${b.link}`)
  process.exit(1)
}
