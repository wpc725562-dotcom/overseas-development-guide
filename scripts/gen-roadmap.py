# -*- coding: utf-8 -*-
"""生成出国发展路线思维导图 PNG（PIL 绘制，无外部依赖）。"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1400, 900
IMG = Image.new("RGB", (W, H), "#fff9fb")
D = ImageDraw.Draw(IMG)

def font(sz):
    for name in ["msyh.ttc", "simhei.ttf", "simsun.ttc"]:
        try:
            return ImageFont.truetype(name, sz)
        except Exception:
            continue
    return ImageFont.load_default()

F_TITLE = font(38)
F_BIG = font(24)
F_MID = font(18)
F_SMALL = font(15)

PINK = "#e4596f"; DEEP = "#c8455e"
ORANGE = "#e6a23c"; GREEN = "#67c23a"; BLUE = "#409eff"; PURPLE = "#8e44ad"

def card(x, y, w, h, title, lines, color, fill):
    D.rounded_rectangle([x, y, x + w, y + h], radius=16, fill=fill, outline=color, width=3)
    D.text((x + 16, y + 10), title, font=F_BIG, fill=color)
    ty = y + 46
    for ln in lines:
        D.text((x + 16, ty), ln, font=F_SMALL, fill="#444")
        ty += 24

D.text((W // 2 - 230, 25), "出国发展 · 路线图", font=F_TITLE, fill=DEEP)
D.text((W // 2 - 200, 72), "学历 → 语言 → 主攻日本 → 远期澳洲", font=F_MID, fill="#888")

card(60, 130, 620, 160, "① 学历 · 全日制本科（进行中）", [
    "专升本 2027.3 考试 → 2027.9 入学",
    "信息安全专业 · 保留成绩单/课程说明",
], BLUE, "#eef6ff")

card(720, 130, 620, 160, "② 语言 · 日语 N2（与①并行）", [
    "JLPT 每年 7 月 / 12 月两场",
    "免费资源路线：Anki + NHK + 真题",
], PURPLE, "#f3eefb")

card(60, 330, 620, 180, "③ 主攻 · 日本人文签（2029 毕业前后）", [
    "技术·人文知识·国际业务（本科 or 10 年经验）",
    "信息安全技术岗不受 2026 语言新政影响",
    "求职：LinkedIn / daijob / Wantedly",
], ORANGE, "#fff8ec")

card(720, 330, 620, 180, "④ 远期 · 澳洲（日本 2-3 年后评估）", [
    "482 Skills in Demand / 189 / 190 / 491",
    "ICT 安全 = ANZSCO 262112 · ACS 评估",
    "目标分：雅思 8.0 + 海外经验 5-7 年 = 75-85 分",
], GREEN, "#f0f9ec")

D.line([680, 210, 720, 210], fill="#bbb", width=4)
D.line([680, 420, 720, 420], fill="#bbb", width=4)
D.line([370, 290, 370, 330], fill="#bbb", width=4)
D.line([1030, 290, 1030, 330], fill="#bbb", width=4)

D.rounded_rectangle([380, 560, 1020, 670], radius=18, fill="#e8f5e9", outline=GREEN, width=4)
D.text((440, 580), "🎯 目标：低成本主攻日本，先在日就业存钱", font=F_BIG, fill="#2e7d32")
D.text((440, 620), "再评估澳洲 482/189/190 · 全程信息以官方为准", font=F_MID, fill="#555")

D.text((W // 2 - 340, 720), "前 2 步是地基：本科 = 日本人文签钥匙；N2 = 日企技术岗敲门砖", font=F_SMALL, fill="#999")
D.text((W // 2 - 250, 750), "详见 docs/personal/route-plan.md · 澳日对比见 compare-au-jp.md", font=F_SMALL, fill="#bbb")

out = r"C:\Users\Administrator\Desktop\deeepseek\overseas-development-guide\docs\public\roadmap.png"
IMG.save(out)
print("saved:", out, os.path.getsize(out), "bytes")
