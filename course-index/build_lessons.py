"""Build independent lesson pages and printable reading scripts from reviewed content."""
from pathlib import Path
from html import escape as e
from urllib.parse import urlparse
import argparse,json,shutil
ROOT=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--link',action='store_true');args=parser.parse_args()
asset=ROOT/'dist/lesson-assets';asset.mkdir(parents=True,exist_ok=True)
for src in (ROOT/'lesson-template').iterdir():
    if src.is_dir():shutil.copytree(src,asset/src.name,dirs_exist_ok=True)
    else:shutil.copy2(src,asset/src.name)
ready=[]
for source in sorted((ROOT/'lessons').glob('*/lesson.json')):
    d=json.loads(source.read_text())
    if 'stops' not in d:continue
    n=d['number'];slug=f'{n:02d}'
    assert source.parent.name==slug and 4<=n<=30
    assert 4<=len(d['stops'])<=8 and d.get('sourceChecked') and d['sources']
    for stop in d['stops']:
        assert all(isinstance(stop[k],str) and stop[k].strip() for k in ['name','label','title','story','key','fun','question','answer','look','modern'])
        lat,lon=stop['at'];assert -85<=lat<=85 and -180<=lon<=180 and 2<=stop['zoom']<=16
    for path in d['paths']:
        assert len(path['points'])>=2 and path['label']
        assert all(-85<=lat<=85 and -180<=lon<=180 for lat,lon in path['points'])
    for s in d['sources']:assert urlparse(s['url']).scheme=='https'
    out=ROOT/'dist/lessons'/slug;out.mkdir(parents=True,exist_ok=True)
    script=json.dumps(d,ensure_ascii=False).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
    sources=''.join(f'<li><a href="{e(s["url"],quote=True)}" target="_blank" rel="noopener noreferrer">{e(s["title"])}</a></li>' for s in d['sources'])
    paragraphs=[];md=[f'# 第{slug}课｜{d["title"]}',f'\n{d["era"]}\n',f'## 开场\n\n{d["opening"]}',f'## 故事主线\n\n{d["outline"]}']
    for i,s in enumerate(d['stops'],1):
        paragraphs.append(f'<section><h3>{i:02d} · {e(s["name"])}｜{e(s["title"])}</h3><p>{e(s["story"])}</p><p><b>关键点：</b>{e(s["key"])}</p><p><b>趣味点：</b>{e(s["fun"])}</p><p><b>互动：</b>{e(s["question"])}</p><p><b>家长提示：</b>{e(s["answer"])}</p><p><b>看图：</b>{e(s["look"])}</p></section>')
        md.append(f'## {i:02d} · {s["name"]}｜{s["title"]}\n\n{s["story"]}\n\n**地理关键点：**{s["key"]}\n\n**趣味点：**{s["fun"]}\n\n**互动问题：**{s["question"]}\n\n**家长讨论提示：**{s["answer"]}\n\n**看图：**{s["look"]}\n\n**定位：**{s["modern"]}；{s["at"]}')
    md.extend([f'## 收尾讨论\n\n{d["discussion"]}',f'## 讲述边界\n\n{d["boundary"]}\n\n{d["mapNote"]}\n\n现代国界与影像仅用于定位。设问、假设情境及因果比较属于教学设计，不是当事人原话。', '## 资料来源\n\n'+'\n'.join(f'- [{s["title"]}]({s["url"]})' for s in d['sources'])])
    (source.parent/'讲解稿.md').write_text('\n\n'.join(md)+'\n')
    legend=''.join(f'<span><i class="line" style="border-color:{e(p["color"],quote=True)}"></i>{e(p["label"])}</span>' for p in d['paths'])
    html=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第{slug}课｜{e(d['title'])}</title><meta name="description" content="{e(d['opening'],quote=True)}"><link rel="icon" href="../../lesson-assets/favicon.svg"><link rel="stylesheet" href="../../lesson-assets/vendor/leaflet.css"><link rel="stylesheet" href="../../lesson-assets/style.css"><script defer src="../../lesson-assets/vendor/leaflet.js"></script><script defer src="../../lesson-assets/vendor/land.js"></script><script defer src="../../lesson-assets/app.js"></script></head><body>
<header><div class="brand"><span class="mark">经纬</span>跟着历史读地图</div><a class="home-link" href="../../">← 课程目录</a></header><main>
<div class="intro"><div><p class="eyebrow">第{slug}课 · 亲子共读约15—20分钟</p><h1>{e(d['title'])}</h1></div></div><p class="era">{e(d['era'])}</p>
<p class="opening"><b>先想一想</b>{e(d['opening'])}</p><nav id="place-list" class="place-list" aria-label="选择讲解地点"></nav>
<section class="workspace" aria-label="地图与地点讲解"><div class="map-column"><div class="toolbar"><div class="map-switch" aria-label="选择底图"><button id="map-normal" aria-pressed="true">普通地图</button><button id="map-satellite" aria-pressed="false">卫星实景图</button></div><button class="quiet" id="overview">查看全图</button></div><div class="map-wrap"><div id="map" aria-label="课程地点地图，可拖动和缩放"></div><div class="map-status" id="map-status" role="status" hidden></div></div><div class="map-footer"><span id="map-kind">普通地图 · 现代地名帮助定位</span><button id="focus-place" class="quiet">放大当前地点</button></div><div class="legend">{legend}</div><p class="caption">{e(d['mapNote'])}</p><div class="pager"><button id="previous">← 上一地点</button><span id="position"></span><button id="next">下一地点 →</button></div></div><aside id="story" class="story" aria-label="地点讲解" aria-live="polite"></aside></section>
<section class="wind-note"><div><p class="eyebrow">从地点回到整个故事</p><h2>把线索串起来</h2></div><div><p>{e(d['outline'])}</p><p><b>抓住关键：</b>{e(d['key'])}</p></div></section>
<section class="takeaway"><span>最后一起讨论</span><p>{e(d['discussion'])}</p></section>
<details class="reading"><summary>展开完整讲解稿 · 可连续阅读</summary>{''.join(paragraphs)}</details>
<details class="sources"><summary>给家长：史料、讲解顺序与地图说明</summary><div class="source-grid"><div><h2>怎么讲</h2><p>先用2分钟讨论开场问题，再沿地图地点讲解8—10分钟。挑两处切换卫星影像观察，留出4—6分钟让孩子解释。最后用地图册重新定位。</p><p>讲解稿的设问和因果比较是教学设计，不是史料中的原话；现代地貌观察不能独自证明古代路线。</p></div><div><h2>资料来源</h2><ol>{sources}</ol></div><div><h2>讲述边界</h2><p>{e(d['boundary'])}</p><p>点位取现代地点或区域代表位置；现代国界不等于历史国界。卫星图非实时画面，也非古代地貌复原。</p><p>普通地图：© OpenStreetMap contributors。卫星影像：Esri及数据提供方。备用陆地轮廓：Natural Earth。在线底图需要联网。</p></div></div></details>
</main><footer><span>先在网页上理解关系，再到地图册找到位置。</span><a href="../../">返回30课课程目录 →</a></footer><script id="lesson-data" type="application/json">{script}</script><noscript><p>互动地图需要JavaScript，完整讲解稿和资料仍可展开阅读。</p></noscript></body></html>'''
    (out/'index.html').write_text(html);ready.append(n)
if args.link:
    p=ROOT/'courses.json';courses=json.loads(p.read_text())
    for c in courses:
        if c['number'] in ready:c['url']=f'https://history-geography-lessons-cheng.ivanxia1988.chatgpt.site/lessons/{c["number"]:02d}/'
    p.write_text(json.dumps(courses,ensure_ascii=False,indent=2)+'\n')
print('Built lessons: '+', '.join(f'{n:02d}' for n in ready))
