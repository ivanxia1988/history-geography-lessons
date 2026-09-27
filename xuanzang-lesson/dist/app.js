/* City coordinates are approximate modern reference positions.
 * Historical paths are schematic links, not reconstructed trekking tracks. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  if (!window.L) {
    $('map-status').hidden = false;
    $('map-status').textContent = '地图组件未加载，请刷新页面。下方仍可查看史料与讲解说明。';
    return;
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = {mode:'journey', direction:'out', selected:3, choice:null, showTerrain:true, showTowns:false, atlasRoute:false};
  const start = [34.26,108.94], destination = [25.1367,85.4439];
  const bounds = L.latLngBounds([[22.5,63],[46,112.5]]);
  const map = L.map('map',{zoomControl:false,scrollWheelZoom:false,zoomSnap:0.25,minZoom:3,maxZoom:8,maxBounds:[[5,40],[59,132]],maxBoundsViscosity:0.7});
  L.control.zoom({position:'topright',zoomInTitle:'放大地图',zoomOutTitle:'缩小地图'}).addTo(map);
  L.control.scale({position:'bottomleft',imperial:false,maxWidth:110}).addTo(map);
  // Keep the network-independent fallback below raster tiles, not in the default overlay pane.
  map.createPane('fallback').style.zIndex = '150';
  if(window.LAND_DATA) L.geoJSON(window.LAND_DATA,{pane:'fallback',style:{color:'#a4b5ab',weight:0.6,fillColor:'#e6e8d9',fillOpacity:1},interactive:false}).addTo(map);
  const terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',{maxNativeZoom:13,maxZoom:8,attribution:'Tiles © Esri · Esri, USGS, NOAA',crossOrigin:true});
  const modern = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:8,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',crossOrigin:true});
  terrain.addTo(map);
  let tileFailures = 0, tileSuccesses = 0;
  [terrain,modern].forEach(layer => {
    layer.on('loading',()=>{tileFailures=0;tileSuccesses=0;});
    layer.on('tileload',()=>{tileSuccesses++;if(!tileFailures) $('map-status').hidden=true;});
    layer.on('tileerror',()=>{tileFailures++;$('map-status').hidden=false;$('map-status').textContent='部分在线底图暂未加载。历史点位仍可探索；请检查网络后重新打开这一视图。';});
    layer.on('load',()=>{if(tileFailures===0&&tileSuccesses>0) $('map-status').hidden=true;});
  });
  const geography = L.layerGroup().addTo(map), towns = L.layerGroup(), routeLayer=L.layerGroup().addTo(map), points=L.layerGroup().addTo(map);
  const label=(at,text,type='') => L.marker(at,{interactive:false,keyboard:false,icon:L.divIcon({className:'geo-label '+type,html:text,iconSize:[150,24],iconAnchor:[75,12]})});
  [
    [[44,84.5],'天 山',''],[[38.6,84.8],'塔克拉玛干沙漠','desert'],[[32.7,89.8],'青 藏 高 原','plateau'],
    [[29,84],'喜马拉雅山',''],[[38,73.1],'帕米尔',''],[[35.2,70.7],'兴都库什山',''],
    [[37.4,99.5],'祁连山',''],[[42.1,98.2],'荒漠与戈壁','desert']
  ].forEach(([at,text,type])=>label(at,text,type).addTo(geography));
  const townData=[['凉州（今武威）',37.93,102.64],['瓜州',40.53,95.78],['伊吾（今哈密一带）',42.82,93.51],['高昌故城',42.86,89.53],['龟兹（今库车一带）',41.72,82.96],['碎叶附近',42.8,75.2],['撒马尔罕',39.65,66.96],['巴尔赫',36.76,66.89],['梵衍那（今巴米扬）',34.83,67.83],['犍陀罗地区',34,71.57],['于阗（今和田一带）',37.11,79.92],['敦煌',40.14,94.66]];
  townData.forEach(([name,lat,lng])=>L.circleMarker([lat,lng],{radius:4,color:'#486353',weight:1.5,fillColor:'#fff',fillOpacity:1}).bindTooltip(name,{className:'town-tooltip'}).addTo(towns));
  const outPath=[start,[36.06,103.83],[37.93,102.64],[38.93,100.45],[39.74,98.51],[40.53,95.78],[42.82,93.51],[42.86,89.53],[42.06,86.57],[41.72,82.96],[41.17,80.26],[42.2,79],[42.42,77.1],[42.8,75.2],[42.9,71.37],[41.31,69.28],[39.65,66.96],[37.25,67.27],[36.76,66.89],[34.83,67.83],[34.55,69.2],[34,71.57],[33.75,72.82],[34.08,74.8],[31.63,74.87],[29.97,76.88],[27.05,79.92],destination];
  const backPath=[destination,[27.05,79.92],[33.75,72.82],[34,71.57],[35,69.3],[36.73,68.86],[37.1,70.5],[37.7,73.5],[37.77,75.23],[38.42,77.25],[39.47,75.99],[37.88,77.41],[37.11,79.92],[37.06,82.69],[38.14,85.53],[39.02,88.17],[40.14,94.66],[39.74,98.51],[38.93,100.45],[37.93,102.64],[36.06,103.83],start];
  const outStops=[
    {name:'长安',short:'长安出发',at:start,modern:'今天的陕西西安一带',tag:'先看目标，再看方向',title:'印度在西南，路却先向西北',text:'玄奘要去印度求法，解答他在研读佛典时遇到的疑问。去程先沿河西走廊进入西域，再经中亚向南。目的地的方位，并不等于每一步都沿那个方向走。',fact:'向西南的直线会遇到大片高原与山地；而向西北，可以利用已有人走过的交通网络。',question:'如果路更短，却连续多天找不到补给，你还会选它吗？',answer:'先比较每段能否取得水、食物与向导。更短不一定更快，也不一定更安全。',zoom:4.5},
    {name:'河西走廊',short:'河西走廊',at:[38.93,100.45],modern:'祁连山北侧的狭长地带',tag:'水源把城镇串起来',title:'两侧难走，中间为什么有路？',text:'祁连山与北侧干旱地区之间，城镇和绿洲提供了通行条件。玄奘沿河西西行。但越过边关之后，荒漠里并不是处处能找到水，补给中断就可能危及生命。',fact:'山地既是屏障，也为部分绿洲提供水源。地形与水源，要放在一起看。',question:'为什么商路常把一个个绿洲连起来，而不是画一条直线？',answer:'人和牲畜都要补水、休息。绿洲还可能提供粮食、向导与下一段路的信息。打开“补给城镇”看看。',zoom:5.5},
    {name:'高昌',short:'高昌与龟兹',at:[42.86,89.53],modern:'高昌：今吐鲁番附近；龟兹：今库车一带',tag:'人也会改变路线',title:'能走下去，不只靠一双脚',text:'玄奘到达高昌后，经历挽留与交涉，获得了继续西行的资助与帮助。再向西经过龟兹等地。城镇和寺院不仅是地图上的点，也是人员、物资与知识的连接处。',fact:'路线取决于自然条件，也取决于当地统治者、僧人、商旅和向导的支持。',question:'同一条路，得到当地支持和没有支持，难度会一样吗？',answer:'马匹、粮食、通行介绍和语言帮助，会改变一段路的实际可行性。地理从来不是唯一原因。',zoom:5.5},
    {name:'凌山地段',short:'翻越天山',at:[42.2,79],modern:'今天天山范围内；具体古山口存在考证分歧',tag:'去程 · 冰雪险阻',title:'为什么有路，也不能随时出发？',text:'《慈恩传》记载玄奘曾因雪路未开而等待。翻越凌山时，冰雪与严寒让行走、做饭和宿营都变得困难，同行人畜也有伤亡。这里不能与回程的帕米尔路段混为一处。',fact:'季节改变道路的通行条件。低温、慢速行进和补给消耗，还会相互加重。',question:'如果山口积雪未消，继续走和留下等，各有什么代价？',answer:'继续走增加失温、滑坠和迷路的风险；等待则消耗时间与物资。需要比较实际条件，不能只说“勇敢就能过去”。',zoom:6},
    {name:'中亚',short:'绕行中亚',at:[39.65,66.96],modern:'伊塞克湖、碎叶、撒马尔罕等地区',tag:'从向西，到向南',title:'地图上的“大绕路”，有它的条件',text:'离开天山后，玄奘经过伊塞克湖一带和多个中亚城镇，再转向南方。看似绕行，却联系着既有通道、聚落及当地提供的帮助，并不是在一片空白土地上随意选路。',fact:'古代长途旅行常把一段段有条件通行的路接起来。整条线路的可行性，比两点间的距离更重要。',question:'如果你只知道前面两三站，能一次规划出几千公里外的最好路线吗？',answer:'未必。商人、寺院和当地向导提供的消息，会让旅行者不断调整。不要用今天完整地图上的信息替古人做决定。',zoom:5},
    {name:'兴都库什',short:'穿过山地',at:[34.83,67.83],modern:'今阿富汗巴米扬及邻近山地',tag:'另一道高山门槛',title:'绕开大片高原，不等于绕开所有山',text:'玄奘经今阿富汗地区的山地与谷地，继续进入印度次大陆西北部。旅途中仍要面对高山、风雪与复杂道路，也会在沿途宗教中心停留访问。',fact:'可行的路，常常是在多个困难之间作比较，而不是找到一条完全没有困难的路。',question:'既然绕行后仍然要翻山，绕行还有意义吗？',answer:'有可能。比较的是整个旅程：高海拔持续多久、有没有谷地与城镇、补给能否接续，而不只是“是否有山”。',zoom:6},
    {name:'那烂陀',short:'印度求学',at:destination,modern:'今印度比哈尔邦，那烂陀遗址',tag:'到达之后，还有学习',title:'取经不只是“拿到经书就回来”',text:'玄奘在印度广泛游学、访问圣迹，并在那烂陀学习佛学。地图用那烂陀代表这一阶段，省略了印度境内的许多游学行程。寻找老师与知识，也是路线的一部分。',fact:'交通网络不仅运送商品，也连接学习、宗教与文化交流。',question:'返程要携带经书、组织运输，你还会完全照原路走吗？',answer:'先考虑当时能获得的支持、道路、季节和运输条件。点击“回程”，看看他怎样经过帕米尔与于阗东归。',zoom:5.5}
  ];
  const backStops=[
    {...outStops[6],short:'离开印度',title:'带着知识踏上归途',tag:'回程 · 目标变了',text:'结束在印度的游学后，玄奘踏上归程。此时不仅要让人回去，还要把经书等物品带回。去程与回程的条件、任务和沿途安排并不完全相同。'},
    {name:'山地归途',short:'经今阿富汗',at:[35,69.3],modern:'今阿富汗及其东北方向的山地区域',tag:'翻山与谷地相接',title:'回家仍要穿过山地',text:'玄奘归程经过印度次大陆西北部和今阿富汗一带，再向帕米尔方向东行。区域中的高山与河谷，让道路不断转折；图上的连线只帮助识别大方向。',fact:'古籍里的国家和地名，与现代国家边界不能一一重合。',question:'用今天的地图看古代旅行，哪些信息有用，哪些可能误导？',answer:'山脉位置与大尺度地形有助于定位；现代国界、公路和机场，不能直接当成古人的通行条件。',zoom:5.5},
    {name:'帕米尔',short:'跨越帕米尔',at:[37.7,73.5],modern:'帕米尔地区，继续通向今塔什库尔干一带',tag:'回程 · 高山与补给',title:'这里的难，不只是“海拔高”',text:'《大唐西域记》描述葱岭一带山岭重叠、风雪严寒，波谜罗川植被稀少，部分路段少有人烟。高山环境、长距离行走和补给不足，会把困难叠加起来。',fact:'“葱岭”是古代范围较广的地理称呼，不能直接等同于现代帕米尔边界。图示也不确定到某一个山口。',question:'荒漠缺水和高山风雪，哪一种更难？',answer:'先定义难在哪里：水源、低温、缺氧、食物、宿营还是迷路。不同人、季节和装备，可能得到不同答案。',zoom:6},
    {name:'于阗',short:'于阗与绿洲',at:[37.11,79.92],modern:'今新疆和田一带',tag:'沿盆地边缘前进',title:'沙漠边缘，为什么串着城镇？',text:'玄奘越过帕米尔地区后，经今塔什库尔干等地，在西域有转折与停留，随后经于阗等绿洲东行。观察塔里木盆地：许多聚落位于山地与沙漠之间能得到水的地方。',fact:'山地来水、适宜土地与聚落相互联系。绿洲网络让荒漠边缘成为可利用的通道。',question:'穿过沙漠中心看着更近，为什么不直接走？',answer:'更短的路线如果缺乏水源和补给，就可能付出更大的代价。想起第一环节中你选择的理由。',zoom:5.5},
    {name:'敦煌',short:'经敦煌东归',at:[40.14,94.66],modern:'河西走廊西端附近的交通节点',tag:'回到熟悉的交通网络',title:'一座城镇，连接不止一个方向',text:'归程从西域东行到敦煌，再沿河西一带返回内地。作为交通节点，敦煌联系着不同方向的道路；人在这里停留，也带来了知识、信仰与艺术。',fact:'一条“丝绸之路”其实包含许多相互连接、不断变化的线路。',question:'为什么交通节点也容易成为文化交流的地方？',answer:'不同语言、信仰和手艺的人停留、交易与共同生活，使这里不仅交换货物，也交换经验。',zoom:5.5},
    {name:'长安',short:'返回长安',at:start,modern:'645年回到长安',tag:'回到起点，认识已不同',title:'同一个起点，一张更丰富的世界地图',text:'玄奘回到长安后从事翻译。旅行的意义不仅在于克服路途困难，也在于把沿途的见闻与所学带回来。现在再看往返线路，试着解释其中的一次转向。',fact:'去程与回程不同；自然条件、交通网络与人的目的共同影响选择。',question:'你能用“因为……所以……”解释地图上的一处绕行吗？',answer:'例如：因为连续补给比直线更短重要，所以要借助绿洲与城镇。再补一句：这不是唯一原因，还要考虑当时的支持、道路和求学安排。',zoom:4.5}
  ];
  const stops=()=>state.direction==='back'?backStops:outStops;
  const fit=()=>map.fitBounds(bounds,{padding:[24,24],animate:false});
  function switchBase(){
    const atlas=state.mode==='atlas';
    if(atlas){if(map.hasLayer(terrain))map.removeLayer(terrain);if(!map.hasLayer(modern))modern.addTo(map);}
    else{if(map.hasLayer(modern))map.removeLayer(modern);if(!map.hasLayer(terrain))terrain.addTo(map);}
  }
  function route(path,color,dashed=false,weight=3.5){
    L.polyline(path,{color:'#fff',opacity:.8,weight:weight+3,interactive:false}).addTo(routeLayer);
    return L.polyline(path,{color,weight,opacity:.9,dashArray:dashed?'8 7':null,interactive:false}).addTo(routeLayer);
  }
  function point(at,name,index,kind,active,endpoint=false){
    const marker=L.marker(at,{keyboard:false,zIndexOffset:active?1000:300,icon:L.divIcon({className:'point-icon '+(kind==='back'?'return':''),html:`<button type="button" class="${active?'active':''}" aria-label="${name}${endpoint?'':'，查看讲解'}">${endpoint?'●':index+1}</button>`,iconSize:[30,30],iconAnchor:[15,15]})}).addTo(points);
    const small=window.innerWidth<760;
    const labelDirection=name==='帕米尔'?'bottom':name==='凌山地段'?'top':'right';
    marker.bindTooltip(name,{permanent:(!small||active||endpoint||index===0||index===stops().length-1),direction:labelDirection,offset:labelDirection==='right'?[12,0]:[0,12],className:'place-tooltip'});
    const el=marker.getElement();
    L.DomEvent.disableClickPropagation(el);
    el.querySelector('button').addEventListener('click',()=>{if(endpoint){if(state.mode==='guess')choose(state.choice||'north');return;}selectStop(index);});
  }
  function renderMap(){
    routeLayer.clearLayers();points.clearLayers();
    if(state.showTerrain){if(!map.hasLayer(geography))geography.addTo(map);}else if(map.hasLayer(geography))map.removeLayer(geography);
    if(state.showTowns){if(!map.hasLayer(towns))towns.addTo(map);}else if(map.hasLayer(towns))map.removeLayer(towns);
    if(state.mode==='guess'){
      if(state.choice==='direct')route([start,destination],'#734b88',true,3);
      if(state.choice==='north')route(outPath,'#734b88',true,3);
      point(start,'长安',0,'out',false,true);point(destination,'那烂陀 · 求学地',1,'out',false,true);
      $('legend').innerHTML='<span><i class="line hypothetical"></i> '+(state.choice?'你的设想 · 示意连线':'选择后显示你的设想')+'</span>';
    }else if(state.mode==='journey'||state.atlasRoute){
      if(state.direction!=='back')route(outPath,'#b84225');
      if(state.direction!=='out')route(backPath,'#007b80',true);
      const selected=stops();
      selected.forEach((s,i)=>point(s.at,s.name,i,state.direction,i===state.selected));
      if(state.direction==='both'){
        L.circleMarker([37.7,73.5],{radius:7,color:'#007b80',weight:2,fillColor:'#fff',fillOpacity:1}).bindTooltip('帕米尔 · 回程',{permanent:true,direction:'bottom',className:'place-tooltip'}).on('click',()=>{state.direction='back';state.selected=2;render();}).addTo(points);
      }
      $('legend').innerHTML=(state.direction!=='back'?'<span><i class="line"></i> 去程：先西北，再向南</span>':'')+(state.direction!=='out'?'<span><i class="line back"></i> 回程：经帕米尔东归</span>':'');
    }else{
      $('legend').innerHTML='<span>现代地名与国界仅用于定位；可勾选“叠加历史路线”作对照。</span>';
    }
  }
  function renderStory(){
    if(state.mode==='guess'){
      const feedback=state.choice==='direct'?'<strong>距离近，不代表更好走。</strong>这条直线穿过大片高原与山地。要考虑连续高海拔、水源、食物和向导；不是说这里绝对无法通行。':state.choice==='north'?'<strong>你注意到了可接续的通道。</strong>往西北可以利用河西走廊与绿洲城镇，但仍要跨过荒漠和雪山。图上先显示大方向，下一步再看史实。':'';
      $('story').innerHTML=`<p class="kicker">先作选择 · 不急着看答案</p><h2>如果你来选路</h2><p class="story-copy">你在长安，要到印度求学。没有汽车，也无法一次带够全程的水和粮食。</p><p class="story-copy">先看地图，你倾向于怎样走？</p><div class="choice-list"><button class="choice" data-choice="direct" aria-pressed="${state.choice==='direct'}">向西南，尽量走直线<small>目的地就在那个方向，先缩短距离。</small></button><button class="choice" data-choice="north" aria-pressed="${state.choice==='north'}">先向西北，连接沿途城镇<small>绕远一些，寻找可以接续的通道。</small></button></div>${feedback?`<div class="feedback">${feedback}</div>`:''}<button class="primary" id="reveal-route">看看玄奘实际怎样走 →</button><p class="visit-note">把你的理由说出来，再打开路线。</p>`;
      document.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.choice)));
      $('reveal-route').addEventListener('click',()=>setMode('journey'));
      return;
    }
    if(state.mode==='atlas'){
      $('story').innerHTML='<p class="kicker">把故事放回真实位置</p><h2>换一张地图，你还能找到吗？</h2><p class="story-copy">现在显示现代地图。也可以打开纸质地图册，试着完成这三件事。</p><ol class="check-list"><li><b>01</b>找到两道不同的山地门槛<small>天山在北，帕米尔在更西南。指出哪一段属于去程，哪一段属于回程。</small></li><li><b>02</b>观察青藏高原的范围<small>从长安到那烂陀画一条直线，沿线会遇到怎样的地形？</small></li><li><b>03</b>找到沙漠边缘的城镇<small>比较库车、和田与塔克拉玛干沙漠的位置。</small></li></ol><div class="atlas-locations"><button data-locate="tian">找天山</button><button data-locate="pamir">找帕米尔</button><button data-locate="tibet">找青藏高原</button><button data-locate="nalanda">找那烂陀</button></div><a class="map-link" id="external-map" href="https://www.openstreetmap.org/#map=4/35/88" target="_blank" rel="noopener noreferrer">在 OpenStreetMap 中继续看 ↗</a><p class="visit-note">现代国界不等于唐代国界。看完可切回“跟着玄奘走”，验证自己的解释。</p>';
      const locations={tian:[42.5,81,6],pamir:[38,73.5,6],tibet:[32,88,5],nalanda:[25.1367,85.4439,8]};
      document.querySelectorAll('[data-locate]').forEach(b=>b.addEventListener('click',()=>{const [a,o,z]=locations[b.dataset.locate];map.setView([a,o],z,{animate:!reduceMotion});}));
      return;
    }
    const s=stops()[state.selected];
    $('story').innerHTML=`<p class="kicker">${state.direction==='back'?'回程':state.direction==='both'?'往返对照 · 去程节点':'去程'} · ${String(state.selected+1).padStart(2,'0')} / ${String(stops().length).padStart(2,'0')}</p><h2>${s.title}</h2><p class="modern-name">${s.name} · ${s.modern}</p><p class="story-copy">${s.text}</p><span class="region-tag">${s.tag}</span><div class="fact"><span class="fact-label">看地图时，抓住这一点</span><p>${s.fact}</p></div><div class="question"><span class="fact-label">一起想一想</span><p>${s.question}</p><button id="hint-toggle" aria-expanded="false">展开讨论提示</button><div class="answer" id="hint-answer" hidden>${s.answer}</div></div><div class="pager"><button class="secondary" id="prev-stop" ${state.selected===0?'disabled':''}>← 上一站</button><button class="secondary" id="focus-stop">放大这一段</button></div><button class="primary" id="next-stop">${state.selected===stops().length-1?(state.direction==='back'?'去真实地图找一找 →':'看看不同的回程 →'):'下一站 →'}</button>`;
    $('hint-toggle').addEventListener('click',()=>{const open=$('hint-toggle').getAttribute('aria-expanded')==='true';$('hint-toggle').setAttribute('aria-expanded',String(!open));$('hint-toggle').textContent=open?'展开讨论提示':'收起讨论提示';$('hint-answer').hidden=open;});
    $('prev-stop').addEventListener('click',()=>selectStop(state.selected-1));
    $('focus-stop').addEventListener('click',()=>{map.setView(s.at,s.zoom,{animate:!reduceMotion});document.dispatchEvent(new Event('lesson-focus'));});
    $('next-stop').addEventListener('click',()=>{if(state.selected<stops().length-1)selectStop(state.selected+1);else if(state.direction!=='back'){state.direction='back';state.selected=0;render();fit();}else setMode('atlas');});
  }
  function renderStops(){
    $('stops-section').hidden=state.mode!=='journey';
    $('stops-title').textContent=state.direction==='back'?'沿回程探索':state.direction==='both'?'去程节点 · 点击地图上的帕米尔看回程':'沿去程探索';
    $('stop-list').innerHTML=stops().map((s,i)=>`<button data-stop="${i}" aria-pressed="${i===state.selected}"><span>${String(i+1).padStart(2,'0')}</span>${s.short}</button>`).join('');
    $('stop-list').style.gridTemplateColumns=window.innerWidth>1050?`repeat(${stops().length}, minmax(0,1fr))`:'';
    document.querySelectorAll('[data-stop]').forEach(b=>b.addEventListener('click',()=>selectStop(Number(b.dataset.stop))));
  }
  function render(){
    document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));
    document.querySelectorAll('[data-route]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.route===state.direction)));
    $('route-switch').hidden=state.mode!=='journey';
    $('map-heading').hidden=state.mode==='journey';
    $('map-heading').textContent=state.mode==='atlas'?'现代地图 · 观察真实地名与位置':'先观察地形，再选择路线';
    $('route-toggle-label').hidden=state.mode!=='atlas';
    $('terrain-toggle').checked=state.showTerrain;$('town-toggle').checked=state.showTowns;$('route-toggle').checked=state.atlasRoute;
    switchBase();renderMap();renderStory();renderStops();
    document.dispatchEvent(new CustomEvent('lesson-state',{detail:{...state,stops:stops(),outStops,backStops,outPath,backPath,townData}}));
  }
  function selectStop(i){if(i<0||i>=stops().length)return;state.selected=i;render();if(!map.getBounds().contains(stops()[i].at))fit();}
  function setMode(mode){state.mode=mode;render();fit();}
  function choose(choice){state.choice=choice;render();fit();}
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
  document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>{state.direction=b.dataset.route;state.selected=0;render();fit();}));
  $('overview').addEventListener('click',()=>{fit();document.dispatchEvent(new Event('lesson-overview'));});
  $('terrain-toggle').addEventListener('change',e=>{state.showTerrain=e.target.checked;renderMap();document.dispatchEvent(new CustomEvent('lesson-labels',{detail:{showTerrain:state.showTerrain,showTowns:state.showTowns}}));});
  $('town-toggle').addEventListener('change',e=>{state.showTowns=e.target.checked;renderMap();document.dispatchEvent(new CustomEvent('lesson-labels',{detail:{showTerrain:state.showTerrain,showTowns:state.showTowns}}));});
  $('route-toggle').addEventListener('change',e=>{state.atlasRoute=e.target.checked;renderMap();document.dispatchEvent(new CustomEvent('lesson-route-overlay',{detail:state.atlasRoute}));});
  map.on('moveend',()=>{const a=$('external-map');if(a){const c=map.getCenter();a.href=`https://www.openstreetmap.org/#map=${Math.round(map.getZoom())}/${c.lat.toFixed(4)}/${c.lng.toFixed(4)}`;}});
  let resizeTimer;
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{map.invalidateSize();renderMap();renderStops();},180);});
  document.addEventListener('lesson-select',e=>{
    const d=e.detail;
    if(d.direction) state.direction=d.direction;
    state.mode='journey';state.selected=Math.max(0,Math.min(d.index,stops().length-1));render();
  });
  document.addEventListener('lesson-flat',()=>{requestAnimationFrame(()=>{map.invalidateSize();fit();});});
  document.addEventListener('lesson-mode',e=>setMode(e.detail));
  fit();render();
})();
