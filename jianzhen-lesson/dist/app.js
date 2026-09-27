(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  if(!window.L){$('map-status').hidden=false;$('map-status').textContent='地图组件未加载，请刷新页面。下方仍可阅读课程概要与资料。';return;}
  const stops=[
  {
    "name": "对马与北路",
    "label": "对马",
    "at": [
      34.2,
      129.29
    ],
    "zoom": 6,
    "modern": "今日本对马岛；北九州与朝鲜半岛之间",
    "title": "看得见下一块陆地，就更容易过海吗？",
    "story": "唐代，日本派遣使节、留学生与僧人赴唐。早期航路常由北九州经壹岐、对马，沿朝鲜半岛海岸，再渡向山东。先看这条绕行的北路：它把一次远行拆成了多个海段。[1][2]",
    "key": "岛屿与海岸能提供定位、停靠和补给的机会，但海峡仍有风浪、海流；“靠近陆地”不等于安全。",
    "fun": "对马不是中国与日本之间的一座桥，却像海上的中间站。把它与两侧陆地一起看，才看得出小岛的交通价值。",
    "question": "绕远但有停靠点，与近一些却要连续航行几天，你会怎样选？",
    "answer": "先比较可用的港口、粮水、天气和船只性能，再看沿途是否得到接待与帮助。地图上有一个海湾，不等于你能自由使用它。",
    "look": "放大当前地点，切到卫星图，看对马与朝鲜半岛、九州的相对位置。橙线只是北路代表性走向。"
  },
  {
    "name": "五岛与东海",
    "label": "五岛列岛",
    "at": [
      32.75,
      128.75
    ],
    "zoom": 7,
    "modern": "今日本长崎县五岛列岛一带",
    "title": "为什么有人放弃绕行，直接横渡东海？",
    "story": "到了后来的航行中，使团也从五岛一带候风，直接横渡东海，前往长江口等中国沿海地区。航路的变化与朝鲜半岛局势、外交关系有关，不能只说是船变大了或路线变短了。[1][2][3]",
    "key": "自然条件决定不了唯一路线。某段岸线容易靠近，却可能因关系紧张而难以停靠；避开它，就可能要承担更长的连续跨海风险。",
    "fun": "五岛是部分使团横渡前最后的停靠点。站在出发者的视角看，身后是可以补给的岛，前面则是一整片东海。[1]",
    "question": "如果不允许使用原来的中途港口，最短路线还一定是最好的吗？",
    "answer": "“好路线”取决于可实际利用的条件，而不是只有长度。让孩子分别说出：绕路增加什么成本，直渡又增加什么风险。",
    "look": "用全图比较橙色北路与青色直渡线。另有经南西诸岛的南岛路，实际航次存在变化，本课不画成一张固定班次表。[4]"
  },
  {
    "name": "扬州与内河",
    "label": "扬州",
    "at": [
      32.4,
      119.42
    ],
    "zoom": 7,
    "modern": "今江苏扬州；靠近长江与运河的联系地带",
    "title": "到了中国海岸，离长安还有多远？",
    "story": "海船抵达中国并不等于已经到达唐朝首都。以长江口方向为例，扬州是海路与内河交通联系的重要城市。前往长安的人员还需继续利用水陆交通；并不是整条船上的人都一起入京。[1][3]",
    "key": "远途交通是一段段接续的：海港解决跨海，河流与运河连接内陆，陆路再通向目的地。",
    "fun": "鉴真与遣唐使的故事在这里相遇：日本僧人邀请这位扬州高僧赴日传授戒律，后来他又搭乘遣唐使归船东渡。[5][6]",
    "question": "为什么不能让海船一路开到长安？",
    "answer": "先看长安的位置，再看水系是否连通、河道水深与船型是否合适。换船、转陆路和补给，本身就是远行的重要环节。",
    "look": "在地图册上找长江、扬州和西安。本图不画精确内陆路线；扬州附近今天的岸线，也不能直接当作唐代海岸。"
  },
  {
    "name": "长安与求学",
    "label": "长安",
    "at": [
      34.26,
      108.94
    ],
    "zoom": 8,
    "modern": "唐都长安，今陕西西安一带",
    "title": "值得冒险带回去的，只有货物吗？",
    "story": "遣唐使承担外交使命，也带来求学者。他们关心制度、书籍、宗教与技艺。回国后，学到的知识要经过选择和调整，才能与当地社会结合；交流并不是把一座城市或一种文化原样搬走。[1][2]",
    "key": "解释一条路线，要同时问“怎样走”和“为什么值得走”。目的、组织和人的学习，让交通网络产生持续影响。",
    "fun": "唐招提寺的介绍记载，鉴真年轻时也曾在洛阳、长安学习，后来回到扬州。他东渡前，自己已经有过一段内陆求学经历。[5]",
    "question": "如果只能带回几箱书，为什么还要花时间跟老师学习？",
    "answer": "有些经验需要实践、示范和讨论，光靠文字难以学会。再想一想：一种制度在另一地实行，是否还要考虑当地需求和条件？",
    "look": "比较长安、扬州和日本的位置。地点编号是讲解顺序；从这一点起，我们转而讲鉴真753年成功东渡，不是接着同一使团的行程。"
  },
  {
    "name": "冲绳与岛链",
    "label": "冲绳",
    "at": [
      26.3,
      127.8
    ],
    "zoom": 6,
    "modern": "今冲绳本岛；南西诸岛的一部分",
    "title": "向日本航行，为什么先到了更南面的岛？",
    "story": "鉴真数次东渡未成，至753年第六次才成功。此次他在黄泗浦搭乘日本归船；赴日途中经过冲绳、屋久岛，再到九州南部。紫线只表示这次成功东渡的部分海段，不混入此前失败的行程。[5][6][7]",
    "key": "海路受风、海流、船况和停靠点影响，不能用两地之间一条直线代替。岛链提供落脚的机会，也隔着仍需认真应对的海段。",
    "fun": "“东渡”不是每一步都向正东。对着地图看，冲绳在长江口东南，而九州又在冲绳东北。[7]",
    "question": "岛很多，是不是就能每晚找一个地方安全靠岸？",
    "answer": "不一定。要看岛与岛的间距、港湾、礁石、水深、天气与岸上补给。可见的陆地与可用的港口，是两回事。",
    "look": "找冲绳与屋久岛，再看九州。海线从中国沿海区域开始，省略黄泗浦至开洋处的细段，不把沿岸各次停留画成精确航迹。"
  },
  {
    "name": "秋目登陆",
    "label": "秋目",
    "at": [
      31.39,
      130.16
    ],
    "zoom": 10,
    "modern": "今日本鹿儿岛县南萨摩市坊津町秋目",
    "title": "成功上岸，为什么还不是终点？",
    "story": "753年，鉴真在九州南部秋目登陆。经历多次受挫后，他已失去视力，仍在同行者与接应者的帮助下继续旅程。接下来还要经太宰府等地前往奈良，完成传授戒律的使命。[5][7][8]",
    "key": "一处登陆港连接海路和陆上接应。抵达岸边只是一次转换；持续的交通、接待与协作，才把人送到最终目的地。",
    "fun": "今天的秋目仍是面向海湾的聚落。切到卫星图，看看湾口、两侧山地和聚落分别在哪里，再想古船可能面临哪些选择。",
    "question": "讲鉴真的成功，只说“意志坚定”，还漏掉了哪些人和条件？",
    "answer": "还包括同行僧人、船员、邀请与接应者、船只、补给和航海经验。人的坚持重要，但不能代替实际协作与条件。",
    "look": "卫星图用于观察现代海湾，标记是区域定位，不是断言古代船只准确停在这个点。"
  },
  {
    "name": "奈良与传承",
    "label": "奈良",
    "at": [
      34.676,
      135.785
    ],
    "zoom": 10,
    "modern": "今日本奈良唐招提寺附近",
    "title": "海把两地隔开，也让什么流动起来？",
    "story": "754年，鉴真抵达奈良并在东大寺授戒；759年，唐招提寺建立，成为传授戒律、培养僧人的场所。把最后这一点与扬州连起来看：海上传递的不仅是物品，也有人、知识与实践。[7][9]",
    "key": "一次航行的意义可以延续到上岸以后。当地的需求、学习者与机构，让交流的影响留存下来。",
    "fun": "后来遣唐使的派遣终止，并不表示中日海上往来一起消失。商船等其他渠道仍在发挥作用，交流方式会随着时代变化。[2]",
    "question": "如果官方使团不再出发，是不是就没有文化交流了？",
    "answer": "区分使团、商人、僧人等不同参与者。结束一种组织方式，不等于海路消失；也不要把日本文化简单说成唐文化的复制品。",
    "look": "最后用地图册指出朝鲜半岛、九州、东海、扬州、长安、冲绳与奈良。请用“停靠点、风险、人的选择”解释其中两处联系。"
  }
];
  let selected=0, base='normal';
  const map=L.map('map',{scrollWheelZoom:false,zoomSnap:.25,minZoom:2,maxZoom:16,zoomControl:false});
  L.control.zoom({position:'topright',zoomInTitle:'放大地图',zoomOutTitle:'缩小地图'}).addTo(map);
  L.control.scale({imperial:false,maxWidth:100}).addTo(map);
  map.createPane('fallback').style.zIndex=150;
  if(window.LAND_DATA)L.geoJSON(window.LAND_DATA,{pane:'fallback',interactive:false,style:{color:'#9bb9b0',weight:.5,fillColor:'#e1e9dd',fillOpacity:1}}).addTo(map);
  const layers={
    normal:L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:16,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'}),
    satellite:L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:16,attribution:'Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community'})
  };
  Object.entries(layers).forEach(([key,layer])=>{
    let errors=0;
    layer.on('loading',()=>{errors=0;});
    layer.on('tileerror',()=>{errors++;if(key===base){$('map-status').textContent='部分在线底图未加载。地点和讲解仍可使用，可切换另一种底图或检查网络。';$('map-status').hidden=false;}});
    layer.on('load',()=>{if(key===base&&errors===0)$('map-status').hidden=true;});
  });layers.normal.addTo(map);
  const paths=[{"color": "#a95724", "points": [[33.6, 130.4], [33.8, 129.75], [34.2, 129.29], [34.75, 128.7], [34.4, 127.5], [34.2, 126], [35.5, 125.5], [37, 125.5], [37.9, 124], [37.85, 120.75]]}, {"color": "#087b87", "points": [[32.75, 128.75], [32.2, 126.8], [31.65, 124.8], [31.25, 122.5], [31.4, 121.9]]}, {"color": "#8064ad", "points": [[30.5, 122.6], [29.4, 123.8], [27.8, 125.7], [26.3, 127.8], [27.5, 128.7], [29, 129.5], [30.3, 130.65], [30.8, 130.4], [31.39, 130.16]]}];
  paths.forEach(p=>{L.polyline(p.points,{color:'#fff',weight:6,opacity:.8,interactive:false}).addTo(map);L.polyline(p.points,{color:p.color,weight:3,dashArray:'7 5',opacity:.95,interactive:false}).addTo(map);});
  const pointLayer=L.layerGroup().addTo(map),labelLayer=L.layerGroup().addTo(map);
  [['东 海',28.8,124.4],['黄 海',35.3,123.1],['朝鲜半岛',38,128],['屋久岛',30.3,132.1],['山东',36.5,119.4]].forEach(([name,lat,lng])=>L.marker([lat,lng],{interactive:false,keyboard:false,icon:L.divIcon({className:'ocean-label',html:name,iconSize:[110,24],iconAnchor:[55,12]})}).addTo(labelLayer));
  const fullBounds=[[24.5,106.5],[39.5,138.5]];
  const overview=()=>map.fitBounds(fullBounds,{padding:[24,28],animate:false});
  function drawPoints(){
    pointLayer.clearLayers();
    stops.forEach((s,i)=>{
      const m=L.marker(s.at,{keyboard:false,zIndexOffset:i===selected?900:100,icon:L.divIcon({className:'place-marker',html:`<button type="button" class="${i===selected?'active':''}" aria-label="查看${s.label}讲解">${i+1}</button>`,iconSize:[32,32],iconAnchor:[16,16]})}).addTo(pointLayer);
      m.bindTooltip(s.label,{permanent:true,direction:i===1?'left':'right',offset:i===1?[-13,0]:[13,0],className:'place-label'});
      const el=m.getElement();L.DomEvent.disableClickPropagation(el);el.querySelector('button').addEventListener('click',()=>select(i));
    });
  }
  function render(){
    const s=stops[selected];
    $('place-list').innerHTML=stops.map((p,i)=>`<button data-place="${i}" aria-pressed="${i===selected}"><span>${String(i+1).padStart(2,'0')}</span>${p.name}</button>`).join('');
    document.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.place))));
    $('story').innerHTML=`<p class="kicker">地点 ${String(selected+1).padStart(2,'0')} · ${s.name}</p><h2>${s.title}</h2><p class="modern">${s.modern}</p><p class="story-copy">${s.story}</p><div class="key"><span>地理关键点</span><p>${s.key}</p></div><div class="interesting"><span>有趣的一点</span><p>${s.fun}</p></div><div class="discussion"><span>一起想一想</span><p>${s.question}</p><button id="show-answer" aria-expanded="false">展开讨论提示</button><div id="answer" class="answer" hidden>${s.answer}</div></div><div class="look"><b>对照地图看</b>${s.look}</div>`;
    $('show-answer').addEventListener('click',()=>{const open=$('answer').hidden;$('answer').hidden=!open;$('show-answer').setAttribute('aria-expanded',String(open));$('show-answer').textContent=open?'收起讨论提示':'展开讨论提示';});
    $('position').textContent=`${String(selected+1).padStart(2,'0')} / 07`;
    $('previous').disabled=selected===0;$('next').disabled=selected===stops.length-1;
    drawPoints();
  }
  function select(i){if(i<0||i>=stops.length)return;selected=i;render();if(!map.getBounds().contains(stops[i].at))overview();}
  function setBase(key){
    if(key===base)return;
    map.removeLayer(layers[base]);base=key;$('map-status').hidden=true;layers[base].addTo(map);
    $('map-normal').setAttribute('aria-pressed',String(base==='normal'));$('map-satellite').setAttribute('aria-pressed',String(base==='satellite'));
    $('map').classList.toggle('satellite',base==='satellite');$('map-kind').textContent=base==='satellite'?'卫星实景图 · 现代影像，非实时画面':'普通地图 · 现代地名帮助定位';
  }
  $('map-normal').addEventListener('click',()=>setBase('normal'));$('map-satellite').addEventListener('click',()=>setBase('satellite'));
  $('previous').addEventListener('click',()=>select(selected-1));$('next').addEventListener('click',()=>select(selected+1));
  $('overview').addEventListener('click',overview);$('focus-place').addEventListener('click',()=>map.setView(stops[selected].at,stops[selected].zoom,{animate:false}));
  window.addEventListener('resize',()=>map.invalidateSize());
  overview();render();
})();
