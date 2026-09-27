# 第一课：玄奘取经互动地图

目标：让初中生先比较可能的路线，再探索去程、回程及地形与补给的关系，最后转到地图册或现实地图定位。

实现：单页静态网页，Leaflet 1.9.4，地形底图使用 Esri World Shaded Relief，备用陆地轮廓来自 Natural Earth；不需要账户数据、定位或分析统计。

文件：`dist/index.html`、`dist/style.css`、`dist/app.js`、`dist/vendor/`。路线是依据史料整理的关键节点概略连线，不是考古定位的徒步轨迹。山脉名称标注代表区域，不代表精确范围；凌山具体山口存在争议。

验证：JavaScript语法、页面资源、去回程切换、节点选择、问题反馈、地形和补给提示开关、缩放和手机布局。此目录为后续独立课程的首课示例，不自动生成剩余29课。

本地预览：在本目录执行 `python3 -m http.server 8765 --bind 127.0.0.1 --directory dist`，打开 `http://127.0.0.1:8765`。

## 三维地形升级

默认打开天山的三维地形；使用 MapLibre GL JS 5.6.0、Mapzen Terrain Tiles（Terrarium 编码、256 像素、高程比例 1）与 Esri World Imagery。无需地图 API 密钥。所有浏览器库保存在 `dist/vendor/`，在线高程和影像仍需要网络。

- `dist/terrain3d.js`：三维地形、逐站飞行、天山与帕米尔巡游、暂停、旋转、俯瞰、二维回退。
- `dist/app.js`：保留课程状态与平面地图，通过自定义事件同步三维节点和讲解。
- `dist/index.html` / `dist/style.css`：三维视图入口、控制区、数据说明和手机布局。

历史点位和近距离观察镜头分开处理。巡游采用代表性现代地形观察点，不声称还原具体古道。概略路线只在较小比例尺显示，避免被误认为可逐段跟随的道路。

验证方式：`node --check dist/app.js`、`node --check dist/terrain3d.js`；浏览器实测地形加载、巡游自动推进及暂停、逐站飞行与讲解同步、现代地图/二维/三维切换，以及 390 像素手机布局。发布时保留公开访问。
