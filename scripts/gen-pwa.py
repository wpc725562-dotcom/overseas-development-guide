# -*- coding: utf-8 -*-
"""生成 PWA 资源：PNG 图标 + manifest.json + sw.js（两站共用）
用法：python scripts/gen-pwa.py <site-name> <site-title> <public-dir>
"""
import sys, pathlib

# 站点参数
site = sys.argv[1]          # 如 overseas-development-guide
title = sys.argv[2]         # 如 出国发展指南
public = pathlib.Path(sys.argv[3])  # docs/public 目录

# 1. 生成 PNG 图标（192 和 512）：用 PIL 画一个圆角方块 + 字母
from PIL import Image, ImageDraw, ImageFont

def make_icon(size, letter, out):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # 圆角背景（玫红渐变近似：纯色）
    radius = size // 5
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=(228, 89, 111, 255))
    # 白色字母
    try:
        font = ImageFont.truetype("msyh.ttc", size // 2)
    except Exception:
        font = ImageFont.load_default()
    # 居中
    bbox = d.textbbox((0, 0), letter, font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((size - w) / 2 - bbox[0], (size - h) / 2 - bbox[1]), letter, font=font, fill=(255, 255, 255, 255))
    img.save(out, "PNG")
    print(f"  icon {size}: {out}")

letter = "出" if "overseas" in site else "专"
make_icon(192, letter, public / "icon-192.png")
make_icon(512, letter, public / "icon-512.png")

# 2. manifest.json
manifest = {
    "name": title,
    "short_name": title[:4],
    "description": f"{title} · PWA",
    "lang": "zh-CN",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#fff9fb",
    "theme_color": "#e4596f",
    "icons": [
        {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
    ],
}
(public / "manifest.json").write_text(
    __import__("json").dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
)
print(f"  manifest.json: {public / 'manifest.json'}")

# 3. service worker（缓存首页 + 关键资源；离线基本可用）
sw = """// PWA Service Worker
const CACHE = 'pwa-' + new Date().toISOString().split('T')[0];
const CORE = ['/', '/index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// 网络优先，失败回退缓存（页面导航缓存首页）
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match('/')))
  );
});
"""
(public / "sw.js").write_text(sw, encoding="utf-8")
print(f"  sw.js: {public / 'sw.js'}")
print("DONE")
