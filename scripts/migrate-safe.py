# -*- coding: utf-8 -*-
"""Safe migration: only regex-replace links and PREPEND frontmatter. Never touch body."""
import re
from pathlib import Path

REPO = Path(r"C:\Users\Administrator\Desktop\deeepseek\overseas-development-guide\docs")

TITLES = {
    "read-me-first.md": ("🧭 整体决策框架", "为什么出去/去哪里/约束是什么"),
    "study-01-overview.md": ("留学规划总览", "选校/文书/语言/签证/时间线/经费 全流程"),
    "study-02-choosing-school.md": ("选校与定位", "国家选择、院校梯队、专业匹配、预算评估"),
    "study-03-application-materials.md": ("申请材料与文书", "成绩单、推荐信、PS、CV 撰写要点"),
    "study-04-language-tests.md": ("语言考试规划", "雅思/托福/多邻国/GRE/GMAT 选择与备考"),
    "study-05-visa.md": ("签证办理", "留学签证流程与材料清单（国别）"),
    "study-06-timeline.md": ("留学时间线", "准备到入学完整时间轴与追踪表"),
    "study-07-funding.md": ("奖学金与经费", "奖学金类型、申请渠道、经费规划"),
    "career-01-overview.md": ("海外求职总览", "简历/渠道/面试/工签/移民 全流程"),
    "career-02-preparation.md": ("求职准备与定位", "能力盘点、目标岗位方向、求职策略"),
    "career-03-resume.md": ("简历与作品集", "英文简历、LinkedIn、GitHub 作品集"),
    "career-04-channels.md": ("求职渠道与内推", "招聘网站、内推、猎头、校招"),
    "career-05-interview.md": ("面试准备", "技术面/行为面、谈薪与 offer"),
    "career-06-work-visa.md": ("工作签证", "各国工签类型与申请流程"),
    "career-07-immigration.md": ("移民路径", "技术移民、雇主担保、永居 PR"),
    "australia.md": ("🇦🇺 澳大利亚速查", "签证/语言/求职平台 · 2026 官方核验"),
    "japan.md": ("🇯🇵 日本速查", "人文签/语言/求职平台 · 2026 官方核验"),
    "_index.md": ("按国别速查", "澳洲/日本 签证·语言·求职平台"),
    "living-01-overview.md": ("海外生活总览", "落地安顿/租房/税务/银行/文化"),
    "living-02-settling.md": ("落地安顿", "入境后优先事项清单"),
    "living-03-housing.md": ("租房与居住", "找房渠道、合同注意、押金"),
    "living-04-tax.md": ("税务与社保", "报税、税务身份、医保社保"),
    "living-05-banking.md": ("银行与金融", "开户、汇款、信用卡、信用记录"),
    "living-06-culture.md": ("语言与文化适应", "语言提升、文化差异、社交融入"),
    "core-checklist.md": ("核心 Checklist", "全流程可勾选清单"),
    "route-plan.md": ("🧭 个人路线图", "专科→全日制本科→日本人文签 · 含澳洲分数测算"),
    "monthly-plan.md": ("📅 按月行动表", "2026.08→2029+ 逐月行动"),
    "compare-au-jp.md": ("⚖️ 澳洲 vs 日本", "资金成本 × 可达性 决策表"),
    "cost-manage.md": ("💰 没钱怎么走", "低成本路径与资金管理"),
    "official-links.md": ("🔗 官方信息核对清单", "8/8 已核验 · 只信官方源头"),
    "github-resources.md": ("🌟 GitHub 高星项目精选", "按你路线抓取的 top-star 资源"),
}

for f in REPO.rglob("*.md"):
    if ".vitepress" in f.parts:
        continue
    # Only touch files that already exist in git (content docs), skip new index.md files
    content = f.read_text(encoding="utf-8")

    # 1. Strip .md suffix from internal links
    new = re.sub(r'\]\(([^)#]+)\.md\)', r'](\1)', content)
    # 2. _index.md -> index
    new = re.sub(r'\]\(([^)#]+/)?_index\.md\)', r'](\1index)', new)
    # 3. Home links -> /
    new = re.sub(r'\]\(\.\./\.\./\.\./README\.md\)', r'](/)', new)
    new = re.sub(r'\]\(\.\./\.\./README\.md\)', r'](/)', new)
    new = re.sub(r'\]\(\.\./README\.md\)', r'](/)', new)
    new = re.sub(r'\]\(\.\./\.\./\.\./README\)', r'](/)', new)
    new = re.sub(r'\]\(\.\./\.\./README\)', r'](/)', new)
    new = re.sub(r'\]\(\.\./README\)', r'](/)', new)
    # 4. Fix cross-repo link in monthly-plan
    new = new.replace('](../../../zhuan-sheng-ben-notes/备考计划/README.md)', '](本地备考笔记，另一仓库)')

    if new != content:
        f.write_text(new, encoding="utf-8")
        print(f"links fixed: {f.name}")

    # 5. Prepend frontmatter if not present and we have a title
    if f.name in TITLES:
        body = f.read_text(encoding="utf-8")
        if not body.lstrip("\ufeff").startswith("---"):
            title, desc = TITLES[f.name]
            fm = f'---\ntitle: "{title}"\ndescription: "{desc}"\n---\n\n'
            f.write_text(fm + body, encoding="utf-8")
            print(f"frontmatter added: {f.name}")

print("DONE")
