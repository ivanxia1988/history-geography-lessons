# 跟着历史读地图 · 课程目录

`courses.json` 保存30课的标题、问题和已发布网址。未完成课程的 `url` 为 `null`，页面不提供无效入口。

更新课程地址后执行 `python3 build_catalog.py`，生成 `dist/index.html`；同步更新工作区《30天亲子历史地理谈话方案.md》的网页列，然后重新发布本目录的 Sites 项目。第一课与第二课是独立网站，不改变其内容。

本地预览：`python3 -m http.server 8767 --bind 127.0.0.1 --directory dist`。公开访问，无需登录。
