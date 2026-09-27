from pathlib import Path
from html import escape
from urllib.parse import urlparse
import json
root=Path(__file__).parent
courses=json.loads((root/'courses.json').read_text())
assert len(courses)==30 and [c['number'] for c in courses]==list(range(1,31))
cards=[]
for c in courses:
    n=f"{c['number']:02d}";title=escape(c['title']);question=escape(c['question'])
    body=f'<span class="number">第 {n} 课</span><h2>{title}</h2><p>{question}</p>'
    if c['url']:
        assert urlparse(c['url']).scheme=='https'
        cards.append(f'<a class="course ready" href="{escape(c["url"],quote=True)}" aria-label="打开第{n}课：{title}">{body}<span class="status">打开课程 →</span></a>')
    else:cards.append(f'<article class="course pending">{body}<span class="status">待制作</span></article>')
count=sum(bool(c['url']) for c in courses)
availability=f'30 课已全部完成 · 选择任一课程开始' if count==30 else f'已完成 {count} 课 · 其余课程逐课制作'
html='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>跟着历史读地图 · 30课目录</title><meta name="description" content="面向初中生的亲子历史地理课程，沿着地图理解历史中的道路与选择。"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="style.css"></head><body><header><span class="brand">经纬 · 跟着历史读地图</span><span>亲子共读 / 初中阶段</span></header><main><div class="intro"><p class="eyebrow">30 个主题 · 每次约 15—20 分钟</p><h1>今天，沿着地图讲一个故事。</h1><p class="description">选择一课进入互动地图，再拿出地图册，看看历史发生在哪里。</p><p class="availability">AVAILABILITY</p></div><section class="courses" aria-label="30课课程清单">CARDS</section><p class="note">按话题衔接安排，并非年代顺序。每课可独立学习，不必按日历连续完成。</p></main><footer>先理解人与地方的关系，再记住地名和年代。</footer></body></html>'''
(root/'dist/index.html').write_text(html.replace('AVAILABILITY',availability).replace('CARDS','\n'.join(cards)))
print(f'已生成 {len(courses)} 课目录，{count} 个有效课程入口')
