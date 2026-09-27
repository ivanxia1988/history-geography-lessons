/* DEM-backed terrain. Camera samples illustrate geography, not a reconstructed ancient trail. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mountains = {
    tian: {title:'天山 · 山谷与雪山',direction:'out',index:3,center:[79.20,42.20],zoom:12,pitch:72,bearing:30,
      points:[[79.16,42.16],[79.18,42.18],[79.20,42.20],[79.22,42.22]],
      cues:['先看两侧山坡：平面上的一条线，落到地面有多难走？','观察谷底与山脊的高差。谷地可以引路，也可能被陡坡截断。','把视线抬向积雪山体：季节会改变哪些通行条件？','再想一想：找到山谷，是否就等于找到了安全通道？']},
    pamir: {title:'帕米尔 · 高山与河谷',direction:'back',index:2,center:[72.20,37.80],zoom:12,pitch:72,bearing:65,
      points:[[72.14,37.79],[72.17,37.80],[72.20,37.80],[72.23,37.81]],
      cues:['这是帕米尔的地形观察区，不代表玄奘经过的确切山口。','看连绵山脊：一座山后面，还有多少道屏障？','即使谷地能走，食物、燃料与宿营地又在哪里？','把这里与荒漠比较：两种环境里的补给难题有何不同？']}
  };
  let map, lesson, loaded=false, visible=true, broken=false, markers=[], labels=[], lastKey='', run=0, timer=null, playing=false, internal=false, currentMountain='tian';
  const status = (message='') => { $('terrain-status').textContent=message; $('terrain-status').hidden=!message; };
  const progress = message => { $('flight-progress').textContent=message; };
  const activeMountain = () => lesson?.direction==='back'&&lesson.selected===2?'pamir':lesson?.direction!=='back'&&lesson?.selected===3?'tian':null;
  function stop(message){
    run++;clearTimeout(timer);timer=null;playing=false;
    if(map)map.stop();
    $('flight-stop').disabled=true;$('flight-play').textContent='逐站飞行';$('valley-tour').textContent='山谷巡游';
    if(message)progress(message);
  }
  function show3d(on){
    if(on&&broken){status('当前设备无法显示三维地形，可继续使用平面地图。');return;}
    if(!on)stop();
    visible=on;
    $('map-3d').hidden=!on;$('map').hidden=on;$('flight-controls').hidden=!on;
    $('map-wrap').classList.toggle('is-3d',on);
    $('view-3d').setAttribute('aria-pressed',String(on));$('view-2d').setAttribute('aria-pressed',String(!on));
    $('scene-badge').hidden=!on;$('terrain-status').hidden=!on||!$('terrain-status').textContent;
    document.querySelector('.north').hidden=on;
    if(on){if(!map)initialize();else{map.resize();sync(true);}}
    else document.dispatchEvent(new Event('lesson-flat'));
  }
  function fail(message){broken=true;stop();show3d(false);$('view-3d').disabled=true;progress(message);$('map-status').textContent=message;$('map-status').hidden=false;}
  function initialize(){
    if(!window.maplibregl){fail('三维组件未加载，已显示平面地图。请刷新后重试。');return;}
    try{
      map=new maplibregl.Map({container:'map-3d',center:mountains.tian.center,zoom:12,pitch:72,bearing:30,
        maxPitch:80,minZoom:3,maxZoom:15,renderWorldCopies:false,attributionControl:false,
        canvasContextAttributes:{antialias:true},
        style:{version:8,sources:{
          imagery:{type:'raster',tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],tileSize:256,maxzoom:18,attribution:'Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community'},
          elevation:{type:'raster-dem',tiles:['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],tileSize:256,maxzoom:15,encoding:'terrarium',attribution:'<a href="https://registry.opendata.aws/terrain-tiles/" target="_blank" rel="noopener">Terrain © Mapzen / source contributors</a>'}
        },layers:[{id:'background',type:'background',paint:{'background-color':'#b0cbd9'}},{id:'satellite',type:'raster',source:'imagery',paint:{'raster-saturation':-.12,'raster-contrast':.08}}],terrain:{source:'elevation',exaggeration:1},sky:{'sky-color':'#92b6d4','horizon-color':'#dde8ec','fog-color':'#d9e6ee','sky-horizon-blend':.8,'horizon-fog-blend':.5,'fog-ground-blend':.65}}
      });
      map.addControl(new maplibregl.NavigationControl({visualizePitch:true}),'top-right');
      map.addControl(new maplibregl.FullscreenControl({container:$('map-wrap')}),'top-right');
      map.addControl(new maplibregl.ScaleControl({maxWidth:100,unit:'metric'}),'bottom-left');
      map.addControl(new maplibregl.AttributionControl({compact:true}),'bottom-right');
      map.scrollZoom.disable();
      map.on('load',()=>{loaded=true;sync(true);});
      map.on('idle',()=>{
        if(map.queryTerrainElevation(map.getCenter())!==null){status();$('map-3d').dataset.terrainReady='true';}
      });
      map.on('error',e=>{
        if(/elevation|terrarium|tile|fetch|ajax/i.test(String(e.error?.message||'')))status('部分地形或影像尚未加载，请稍候或切换平面地图。');
      });
      map.on('webglcontextlost',()=>fail('三维显示暂时中断，已切回平面地图。刷新页面可重试。'));
      map.on('movestart',e=>{if(e.originalEvent)stop('已暂停飞行。你可以自由观察，或重新开始。');});
      map.on('zoomend',renderLabels);
      map.on('moveend',()=>{const c=map.getCenter();$('map-3d').dataset.camera=`${c.lng.toFixed(4)},${c.lat.toFixed(4)} / 倾角 ${Math.round(map.getPitch())}°`;});
    }catch(error){fail('当前浏览器无法启用三维地形，已显示平面地图。可换用支持 WebGL 的浏览器。');}
  }
  function cameraForStop(){
    const kind=activeMountain();
    if(kind){currentMountain=kind;return mountains[kind];}
    const s=lesson.stops[lesson.selected];
    return {center:[s.at[1],s.at[0]],zoom:s.name==='兴都库什'?11.5:s.name==='河西走廊'?9:10.3,pitch:s.name==='兴都库什'?70:58,bearing:-25,title:s.name};
  }
  function fly(camera,duration=4500){
    if(!map||!loaded||!visible)return;
    map.flyTo({center:camera.center,zoom:camera.zoom,pitch:camera.pitch,bearing:camera.bearing,duration:reduced?0:duration,essential:false});
    $('scene-name').textContent=camera.title||lesson.stops[lesson.selected].name;
    $('scene-detail').textContent=activeMountain()?'代表性地形观察区 · 非确定古道':'现代地表 · 对照历史地点';
  }
  function overview(){
    if(!map||!loaded||!visible)return;
    stop('全程俯瞰：点击地点，再飞入当地地形。');
    map.fitBounds([[63,22.5],[112.5,46]],{padding:45,pitch:15,bearing:0,duration:reduced?0:2000});
    $('scene-name').textContent='从长安到印度次大陆';$('scene-detail').textContent='路线概览 · 放大后观察真实高差';
  }
  function lineData(){
    const lines=[];
    const add=(p,color)=>lines.push({type:'Feature',properties:{color},geometry:{type:'LineString',coordinates:p.map(a=>[a[1],a[0]])}});
    if(lesson.mode==='guess'){
      if(lesson.choice==='direct')add([lesson.outPath[0],lesson.outPath.at(-1)],'#e5abff');
      if(lesson.choice==='north')add(lesson.outPath,'#e5abff');
    }else if(lesson.mode==='journey'||lesson.atlasRoute){
      if(lesson.direction!=='back')add(lesson.outPath,'#ffb276');
      if(lesson.direction!=='out')add(lesson.backPath,'#72e4d5');
    }
    return {type:'FeatureCollection',features:lines};
  }
  function renderRoutes(){
    if(!loaded)return;
    const data=lineData();
    if(map.getSource('lesson-route'))map.getSource('lesson-route').setData(data);
    else{
      map.addSource('lesson-route',{type:'geojson',data});
      map.addLayer({id:'route-shadow',type:'line',source:'lesson-route',maxzoom:9,paint:{'line-color':'#172b37','line-width':6,'line-opacity':.65}});
      map.addLayer({id:'route-line',type:'line',source:'lesson-route',maxzoom:9,paint:{'line-color':['get','color'],'line-width':3,'line-dasharray':[3,1]}});
    }
    markers.forEach(m=>m.remove());markers=[];
    const items=lesson.mode==='guess'?[lesson.outStops[0],lesson.outStops.at(-1)]:lesson.stops;
    items.forEach((s,i)=>{
      const b=document.createElement('button');b.type='button';b.className='point3d'+(i===lesson.selected?' active':'');
      b.textContent=s.name;b.setAttribute('aria-label',`飞到${s.name}`);
      b.addEventListener('click',()=>{if(lesson.mode==='guess')return;stop();document.dispatchEvent(new CustomEvent('lesson-select',{detail:{index:i}}));});
      markers.push(new maplibregl.Marker({element:b,anchor:'bottom'}).setLngLat([s.at[1],s.at[0]]).addTo(map));
    });
    renderLabels();
  }
  function renderLabels(){
    labels.forEach(m=>m.remove());labels=[];
    if(!loaded||!lesson)return;
    let places=[];
    if(lesson.showTerrain&&map.getZoom()<8)places=[['天山',44,84.5],['青藏高原',32.7,89.8],['塔克拉玛干沙漠',38.6,84.8],['帕米尔',38,73.1],['喜马拉雅山',29,84]];
    if(lesson.showTowns)places=places.concat(lesson.townData);
    places.forEach(([name,lat,lng])=>{const el=document.createElement('span');el.className='geo3d';el.textContent=name;labels.push(new maplibregl.Marker({element:el}).setLngLat([lng,lat]).addTo(map));});
  }
  function sync(force=false){
    if(!lesson||!loaded)return;
    renderRoutes();
    const key=`${lesson.mode}/${lesson.direction}/${lesson.selected}`;
    const changed=key!==lastKey;lastKey=key;
    $('valley-tour').disabled=!activeMountain();
    if(!visible)return;
    if(force||changed){
      if(lesson.mode==='guess'){overview();return;}
      fly(cameraForStop(),force?0:4500);
      if(!playing)progress('点击地点飞到下一站；“山谷巡游”可近距离观察天山与帕米尔。');
    }
  }
  function select(direction,index){internal=true;document.dispatchEvent(new CustomEvent('lesson-select',{detail:{direction,index}}));internal=false;}
  function schedule(fn,ms){clearTimeout(timer);timer=setTimeout(fn,ms);}
  function playJourney(){
    if(!loaded||!visible)return;
    stop();playing=true;const token=run;
    $('flight-play').textContent='飞行中…';$('flight-stop').disabled=false;
    let i=lesson.selected>=lesson.stops.length-1?0:lesson.selected;
    const direction=lesson.direction==='back'?'back':'out';
    const step=()=>{
      if(token!==run)return;
      select(direction,i);
      fly(cameraForStop(),5000);
      progress(`逐站飞行 · ${i+1} / ${lesson.stops.length} · ${lesson.stops[i].name}。抵达后留出时间观察与讨论。`);
      schedule(()=>{if(token!==run)return;if(++i>=lesson.stops.length){stop('本段行程已走完。可切换去程／回程，继续探索。');}else step();},reduced?6000:11000);
    };step();
  }
  function playValley(){
    const kind=activeMountain();if(!kind||!loaded||!visible)return;
    stop();playing=true;currentMountain=kind;const token=run,scene=mountains[kind];
    $('valley-tour').textContent='巡游中…';$('flight-stop').disabled=false;
    let i=0;
    const step=()=>{
      if(token!==run)return;
      const camera={...scene,center:scene.points[i]};
      if(i===0)fly(camera,3500);
      else map.easeTo({...camera,duration:reduced?0:8000,easing:t=>t});
      progress(`山谷巡游 · ${i+1} / ${scene.points.length} · ${scene.cues[i]}`);
      schedule(()=>{if(token!==run)return;if(++i>=scene.points.length)stop('巡游结束。试着解释：谷底、山口与山脊，哪一种位置更可能容纳道路？');else step();},reduced?6000:i===0?6500:10500);
    };step();
  }
  document.addEventListener('lesson-state',e=>{
    if(!internal)stop();lesson=e.detail;
    if(lesson.mode==='atlas'){show3d(false);lastKey='';return;}
    sync();
  });
  document.addEventListener('lesson-labels',e=>{Object.assign(lesson,e.detail);renderLabels();});
  document.addEventListener('lesson-route-overlay',e=>{lesson.atlasRoute=e.detail;renderRoutes();});
  document.addEventListener('lesson-overview',overview);
  document.addEventListener('lesson-focus',()=>{stop();fly(cameraForStop());});
  $('view-3d').addEventListener('click',()=>{if(lesson?.mode==='atlas')document.dispatchEvent(new CustomEvent('lesson-mode',{detail:'journey'}));show3d(true);});
  $('view-2d').addEventListener('click',()=>show3d(false));
  $('flight-play').addEventListener('click',playJourney);$('valley-tour').addEventListener('click',playValley);
  $('flight-stop').addEventListener('click',()=>stop('已暂停。可自由观察，或从当前地点重新开始。'));
  $('camera-low').addEventListener('click',()=>{stop();const c=cameraForStop();fly({...c,zoom:Math.max(12,c.zoom),pitch:76},2200);progress('低空观察：看近处山坡与远处山脊如何相互遮挡。');});
  $('camera-top').addEventListener('click',()=>{stop();map.easeTo({pitch:0,bearing:0,duration:reduced?0:1500});progress('垂直俯瞰：比较谷地的走向，再切回低空观察。');});
  for(const [id,angle] of [['camera-left',-35],['camera-right',35]])$(id).addEventListener('click',()=>{stop();map.easeTo({bearing:map.getBearing()+angle,duration:reduced?0:900});});
  for(const [id,key] of [['scene-tian','tian'],['scene-pamir','pamir']])$(id).addEventListener('click',()=>{stop();const s=mountains[key];select(s.direction,s.index);fly(s);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop('已暂停。回到页面后可继续探索。');});
  window.addEventListener('pagehide',()=>stop());
  show3d(true);
})();
