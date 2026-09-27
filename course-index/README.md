# 跟着历史读地图 · 课程目录

`courses.json` 保存30课的标题、问题和已发布网址。未完成课程的 `url` 为 `null`，页面不提供无效入口。

第一至第三课是独立网站。后续课程使用 `lessons/NN/lesson.json` 保存内容，`lesson-template/` 保存共用地图模板；只有具备完整地图节点的课程才会生成网页与讲解稿。当前04—12课已完成，13—30课仍是待完成提纲，详见 `PROGRESS.md`。

在本目录运行：

```bash
python3 build_lessons.py
python3 build_catalog.py
```

逐课完成内容核对与网页检查后，使用 `python3 build_lessons.py --link` 更新已完成课程的目录链接，再运行 `python3 build_catalog.py`。同步更新根目录 README 与《30天亲子历史地理谈话方案.md》，然后重新发布本目录的 Sites 项目。GitHub推送不会自动发布Sites。

本地预览：`python3 -m http.server 8767 --bind 127.0.0.1 --directory dist`。公开访问，无需登录。
