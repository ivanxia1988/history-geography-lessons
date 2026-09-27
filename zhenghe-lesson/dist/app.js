(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  if(!window.L){$('map-status').hidden=false;$('map-status').textContent='地图组件未加载，请刷新页面。下方仍可阅读课程概要与资料。';return;}
  const stops=[
    {name:'长乐候风',label:'长乐',at:[25.96,119.62],zoom:8,modern:'今福建福州长乐一带',title:'船已经备好，为什么还要等？',story:'1405—1433年间，郑和船队七下西洋。船队从太仓等地集结出发，福建长乐则是重要的候风、补给与开洋地点。带够粮水、组织船只之后，还需要选择合适的风和海况。',key:'海路也有季节节奏。等待合适的风，不是浪费时间，而是把自然条件纳入航行计划。',fun:'中国国家博物馆收藏的“郑和铸青铜钟”，把航海史落在了一件实物上：即使组织庞大船队的人，也关心航海平安。',question:'如果今天逆风，等几天可能转为顺风，你会怎么选？',answer:'比较赶路的必要性、粮水消耗、船只性能和海况。等风有成本，冒险出航也有成本；不能只根据“早出发就早到”判断。',look:'先找中国东南沿海，再沿海岸向南看。郑和要去的“西洋”，不能直接理解成今天的西欧。'},
    {name:'占城停靠',label:'占城',at:[13.78,109.24],zoom:7,modern:'今越南中部沿海；图示为区域代表点',title:'为什么要把港口一个个接起来？',story:'占城是郑和航行中到访的地区之一。沿途停靠不能只理解成“顺路休息”：大型船队要补给、联络当地、获取海路消息，也承担对外交往任务。',key:'海上的距离不是唯一成本。可靠的港口，把水、食物、修整和信息连接成可以利用的交通网络。',fun:'今天看地图，陆地常是主角；换成航海者的视角，一段海岸上有没有可停靠的港湾，可能比内陆有多大更重要。',question:'有指南针，是否就不再需要向导和港口？',answer:'指南针帮助判断方向，却不能自动告诉你暗礁、水深、风浪、剩余粮水或当地关系。确定方向与安全到达是两回事。',look:'对照卫星图，看海岸的曲折与内陆山地。古代占城的范围、港口位置与今天的行政区不能简单等同。'},
    {name:'马六甲海峡',label:'满剌加',at:[2.19,102.25],zoom:6,modern:'满剌加：今马来西亚马六甲一带',title:'一条窄水道，为什么这么重要？',story:'满剌加是郑和航路上的重要节点。马来半岛与苏门答腊岛之间的马六甲海峡，联系着南海方向与印度洋方向。要理解这处港口，先看它所在的通道。',key:'海峡把大范围交通集中到较窄的水域。关键位置可以带来交易与交往机会，也会产生通航和安全问题。',fun:'陆地面积不大，不等于交通作用小。把地图缩小，再放大，才能同时看见“连接两边”的位置与海峡本身。',question:'为什么掌握一处海峡，有时比拥有很长的海岸更有影响力？',answer:'关键是有多少航路需要通过、替代路线要绕多远，以及能否提供可靠的通航和港口服务。地理位置有利，也需要相应的组织能力。',look:'切到“卫星实景图”，找出海峡东北侧的马来半岛和西南侧的苏门答腊岛；再用“查看全程”看它连接哪两边。'},
    {name:'锡兰与印度洋',label:'锡兰',at:[6.03,80.22],zoom:6,modern:'今斯里兰卡；图示取南部沿海代表点',title:'岛屿的位置，怎样影响航路？',story:'离开东南亚向西，船队进入印度洋。锡兰位于印度半岛东南方向，是下西洋到访地区之一。在地图上观察这座岛，就能把孟加拉湾与更西侧的阿拉伯海联系起来。',key:'远航不是永远贴着海岸走，也包含跨海段。岛屿、海岸和停靠点，帮助航海者组织跨海前后的行程。',fun:'从东南亚看印度西岸，不能只盯着“向西”两个字：印度半岛伸入海中，半岛与岛屿的位置会影响实际通行方向。',question:'从马六甲到印度西岸，能否把两点一连就当作航线？',answer:'还要检查连线是否穿过陆地，并考虑季节、洋流、礁区、停靠点和当时掌握的海路知识。地图上的概略线只能说明联系。',look:'找出斯里兰卡与印度半岛南端的相对位置。图中海线沿岛南侧作概略连接，不是复原每一次实际航迹。'},
    {name:'古里贸易港',label:'古里',at:[11.25,75.77],zoom:7,modern:'今印度西海岸科泽科德（Kozhikode / Calicut）',title:'到了一个港口，还会接上哪些地方？',story:'古里是印度洋贸易网络中的重要港口。郑和前几次远航到达这里，后来航行的范围继续扩展，古里也发挥中转作用。船队进入的是已有商人、商品与航路往来的世界。',key:'一个港口的价值，不只是它本身出产什么，还包括它连接哪些人、货物和远方地点。',fun:'古里位于印度西岸。把它与中国东南沿海放在同一张地图上，会发现海路把相隔很远的地区联系了起来。',question:'为什么交易中心不一定建在最大国家的首都？',answer:'海港的岸线、腹地、航路和服务条件可能比离政治中心近更重要。商业网络与政治中心的位置，不一定重合。',look:'先辨认印度半岛东西两岸，再看古里朝向哪片海。接下来的两个地点是不同方向的延伸，不是“从一个直接开到另一个”的日程。'},
    {name:'忽鲁谟斯',label:'忽鲁谟斯',at:[27.06,56.46],zoom:7,modern:'今伊朗霍尔木兹岛一带',title:'另一处入口，连接另一片贸易网络',story:'后续航次把活动范围延伸到忽鲁谟斯等地。它位于波斯湾入口附近，联系海湾内外的贸易。和马六甲一样，理解这里的意义，要把港口放回海峡与周边地区的关系中。',key:'地图上的“入口”会影响海路如何汇集。比较两个海峡，可以把一种地理解释迁移到另一个地方。',fun:'图上把这条西向联系单独标成分支：七次航行的航线与支队安排不同，并非所有船只都来过这里。',question:'忽鲁谟斯与马六甲的位置有什么相似？又有什么不同？',answer:'相似的是都靠近重要通道；不同的是连接的海域、腹地和贸易网络不同。先指出位置，再解释影响，不要直接套用同一结论。',look:'在卫星图上观察霍尔木兹海峡。注意忽鲁谟斯的代表点在岛上，不能把它与今天所有同名区域混为一处。'},
    {name:'东非海岸',label:'麻林',at:[-3.22,40.12],zoom:7,modern:'麻林：今肯尼亚马林迪一带，代表东非到访地区',title:'越过印度洋，仍要靠一站站接续',story:'郑和船队的部分航次及支队到达东非沿海。这里用麻林代表东非方向。回看整张地图，中国、东南亚、印度、西亚与东非的联系，需要海路、港口、人员和当地交往共同维持。',key:'远航能力来自一整套条件：船舶与导航、粮水与修整、季节判断、财政组织和对外关系。',fun:'从中国到非洲，不需要经过欧洲。沿着印度洋看世界，会得到与从陆地出发很不一样的空间认识。',question:'如果有更大的船，却没有可靠的补给与港口关系，还能走得更远吗？',answer:'不一定。船越大、人员越多，组织与补给任务也越大。请用季风、海峡、港口三个词，各解释一次等待、绕行或停靠。',look:'用“查看全程”把东非与中国放回同一张地图，再到自己的地图册上指出南海、马六甲海峡和印度洋。'}
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
  const paths=[
    {color:'#a95724',points:[[25.96,119.62],[23.3,118.5],[20,114],[16,111],[13.78,109.24],[10.8,110],[6,108],[1.3,105],[.9,104.3],[1.1,103.5],[1.6,103],[2.19,102.25],[3,101],[5,98.4],[6.5,95],[6,88],[6.03,80.22],[5.65,80.1],[6.5,79.2],[8.1,77.3],[9.8,76],[11.25,75.77]]},
    {color:'#087b87',points:[[11.25,75.77],[14,72],[18,65],[22,60.5],[25.2,57.6],[26.1,56.6],[27.06,56.46]]},
    {color:'#087b87',points:[[11.25,75.77],[8,64],[4,54],[0,45],[-3.22,40.12]]}
  ];
  paths.forEach(p=>{L.polyline(p.points,{color:'#fff',weight:6,opacity:.8,interactive:false}).addTo(map);L.polyline(p.points,{color:p.color,weight:3,dashArray:'7 5',opacity:.95,interactive:false}).addTo(map);});
  const pointLayer=L.layerGroup().addTo(map),labelLayer=L.layerGroup().addTo(map);
  [['南 海',15,115],['印 度 洋',-1,78],['孟加拉湾',14,88],['阿拉伯海',17,66]].forEach(([name,lat,lng])=>L.marker([lat,lng],{interactive:false,keyboard:false,icon:L.divIcon({className:'ocean-label',html:name,iconSize:[110,24],iconAnchor:[55,12]})}).addTo(labelLayer));
  const fullBounds=[[-8,35],[33,124]];
  const overview=()=>map.fitBounds(fullBounds,{padding:[24,28],animate:false});
  function drawPoints(){
    pointLayer.clearLayers();
    stops.forEach((s,i)=>{
      const m=L.marker(s.at,{keyboard:false,zIndexOffset:i===selected?900:100,icon:L.divIcon({className:'place-marker',html:`<button type="button" class="${i===selected?'active':''}" aria-label="查看${s.label}讲解">${i+1}</button>`,iconSize:[32,32],iconAnchor:[16,16]})}).addTo(pointLayer);
      m.bindTooltip(s.label,{permanent:true,direction:i===4?'left':'right',offset:i===4?[-13,0]:[13,0],className:'place-label'});
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
