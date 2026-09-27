(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  if(!window.L){$('map-status').hidden=false;$('map-status').textContent='地图组件未加载，请刷新页面。下方仍可阅读课程概要与资料。';return;}
  const lesson=JSON.parse($('lesson-data').textContent);
  const stops=lesson.stops;
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
  const paths=lesson.paths;
  paths.forEach(p=>{L.polyline(p.points,{color:'#fff',weight:6,opacity:.8,interactive:false}).addTo(map);L.polyline(p.points,{color:p.color,weight:3,dashArray:'7 5',opacity:.95,interactive:false}).addTo(map);});
  const pointLayer=L.layerGroup().addTo(map);
  const fullBounds=L.latLngBounds(stops.map(s=>s.at));
  paths.forEach(p=>p.points.forEach(at=>fullBounds.extend(at)));
  const overview=()=>map.fitBounds(fullBounds,{padding:[45,45],maxZoom:12,animate:false});
  function drawPoints(){
    pointLayer.clearLayers();
    stops.forEach((s,i)=>{
      const m=L.marker(s.at,{keyboard:false,zIndexOffset:i===selected?900:100,icon:L.divIcon({className:'place-marker',html:`<button type="button" class="${i===selected?'active':''}" aria-label="查看${s.label}讲解">${i+1}</button>`,iconSize:[32,32],iconAnchor:[16,16]})}).addTo(pointLayer);
      m.bindTooltip(s.label,{permanent:i===selected,direction:'top',offset:[0,-12],className:'place-label'});
      const el=m.getElement();L.DomEvent.disableClickPropagation(el);el.querySelector('button').addEventListener('click',()=>select(i));
    });
  }
  function render(){
    const s=stops[selected];
    $('place-list').innerHTML=stops.map((p,i)=>`<button data-place="${i}" aria-pressed="${i===selected}"><span>${String(i+1).padStart(2,'0')}</span>${p.name}</button>`).join('');
    document.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.place))));
    $('story').innerHTML=`<p class="kicker">地点 ${String(selected+1).padStart(2,'0')} · ${s.name}</p><h2>${s.title}</h2><p class="modern">${s.modern}</p><p class="story-copy">${s.story}</p><div class="key"><span>地理关键点</span><p>${s.key}</p></div><div class="interesting"><span>有趣的一点</span><p>${s.fun}</p></div><div class="discussion"><span>一起想一想</span><p>${s.question}</p><button id="show-answer" aria-expanded="false">展开讨论提示</button><div id="answer" class="answer" hidden>${s.answer}</div></div><div class="look"><b>对照地图看</b>${s.look}</div>`;
    $('show-answer').addEventListener('click',()=>{const open=$('answer').hidden;$('answer').hidden=!open;$('show-answer').setAttribute('aria-expanded',String(open));$('show-answer').textContent=open?'收起讨论提示':'展开讨论提示';});
    $('position').textContent=`${String(selected+1).padStart(2,'0')} / ${String(stops.length).padStart(2,'0')}`;
    $('previous').disabled=selected===0;$('next').disabled=selected===stops.length-1;
    drawPoints();
  }
  function select(i){if(i<0||i>=stops.length)return;selected=i;render();map.setView(stops[i].at,stops[i].zoom,{animate:false});}
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
