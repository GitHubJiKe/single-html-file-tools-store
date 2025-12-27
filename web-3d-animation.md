# Web 3D 动画视图生成器

**文件名**: `web-3d-animation.html`  
**创建日期**: 2025-12-27  
**最后更新**: 2025-12-27  
**代码行数**: ~600 行  

---

## 📋 工具简介

Web 3D 动画视图生成器是一个基于 Three.js 的轻量级在线 3D 动画制作工具。专为非专业用户设计，支持导入标准 3D 模型（GLTF/OBJ），通过直观的时间轴界面编辑关键帧动画，并直接在浏览器中导出为 WebM 视频。无需安装任何软件或插件，完全纯前端运行。

---

## 🎯 核心功能

### 功能列表
1.  **模型导入**: 支持 GLTF/GLB 和 OBJ 格式的拖拽导入与自动缩放。
2.  **可视化编辑**: 提供场景大纲（Outliner）、属性面板和 3D 视口，支持对象选择与变换（位移/旋转/缩放）。
3.  **时间轴动画**: 支持关键帧的添加、删除与自动插值（位置/旋转/缩放）。
4.  **视频导出**: 内置 WebM 录制功能，可将制作好的动画高清导出。
5.  **项目保存**: 支持将当前项目状态保存为 JSON 文件。

### 功能详情
-   **场景编辑**
    -   实现方式：集成 `Three.js` 及其 `TransformControls`，实现类 Unity/Blender 的操作体验。
    -   用户交互：点击大纲或场景中的物体进行选中，使用 Gizmo 轴进行拖拽修改。

-   **动画系统**
    -   实现方式：自定义关键帧插值引擎。在 `requestAnimationFrame` 循环中根据当前时间查找相邻关键帧并进行插值（Lerp）。
    -   用户交互：在时间轴上拖动指针预览，点击“添加关键帧”记录当前状态。

-   **视频导出**
    -   实现方式：使用 `webm-writer.js` 库，逐帧渲染 Canvas 内容并编码为视频流。
    -   用户交互：点击导出按钮，系统自动后台逐帧渲染（非实时）以保证不掉帧，完成后触发下载。

---

## 🔗 外部依赖

### CDN 链接
| 库名称 | 版本 | CDN 链接 | 用途 |
|--------|------|----------|------|
| Three.js | 0.150.1 | https://unpkg.com/three@0.150.1/build/three.module.js | 3D 渲染引擎 |
| es-module-shims | 1.6.3 | https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js | Import Maps 支持 |
| webm-writer | 0.3.0 | https://cdn.jsdelivr.net/npm/webm-writer@0.3.0/webm-writer.js | 视频编码导出 |

### 依赖说明
-   **Three.js**: 核心 3D 引擎。
-   **webm-writer**: 小巧的 WebM 视频编码库，无需后端 ffmpeg 支持。

---

## 💻 核心实现逻辑

### 技术栈
-   HTML5 Canvas
-   Three.js (ES Modules)
-   Vanilla JS (ES6+)

### 关键代码实现

#### 1. 关键帧插值
```javascript
// 简化的插值逻辑
const alpha = (time - prevKey.time) / duration;
obj.position.lerpVectors(prevKey.position, nextKey.position, alpha);
obj.scale.lerpVectors(prevKey.scale, nextKey.scale, alpha);
// 欧拉角插值...
```
**实现说明**: 在每一帧更新循环中，根据时间戳计算插值系数 `alpha`，混合前后两个关键帧的状态。

#### 2. 视频导出
```javascript
for (let i = 0; i < totalFrames; i++) {
    const time = i / fps;
    app.currentTime = time;
    animator.update(0); // 强制更新到指定时间
    app.renderer.render(app.scene, app.camera);
    videoWriter.addFrame(app.renderer.domElement);
}
```
**实现说明**: 导出时暂停主循环，手动步进时间轴，截取每一帧画面传给 VideoWriter，确保导出的视频流畅且不依赖客户端实时性能。

### 数据流程
```
文件导入 -> Three.js Mesh -> 用户编辑 -> 关键帧数据(JSON) -> 渲染循环 -> Canvas -> 视频流
```

### 状态管理
-   **app.scene**: Three.js 场景图。
-   **app.animations**: 存储所有对象的关键帧数据结构 `[{ uuid, keys: [] }]`。

---

## 🎨 用户界面

### 布局结构
-   **顶部**: 工具栏（导入、保存、导出）。
-   **左侧**: 场景大纲（树状列表）。
-   **中间**: 3D 视口。
-   **右侧**: 属性面板（变换数值）。
-   **底部**: 时间轴控制区。

### 交互设计
-   **暗色主题**: 类似专业 IDE 的沉浸式体验。
-   **Gizmo 操作**: 直观的 3D 变换手柄。

---

## 📝 使用说明

### 基本使用
1.  点击“导入模型”加载 .glb 文件。
2.  在视口中选中模型。
3.  调整时间轴指针到 0s，点击“添加关键帧”。
4.  移动指针到 2s，移动模型位置，再次点击“添加关键帧”。
5.  点击播放预览动画。
6.  点击“导出视频”保存为 .webm 文件。

---

## 🔧 技术细节

### API 使用
-   **URL.createObjectURL**: 处理本地文件预览。
-   **requestAnimationFrame**: 驱动渲染循环。

### 性能优化
-   **按需更新**: 仅在需要时刷新 UI 面板。
-   **导出优化**: 导出时降低 Canvas 分辨率或使用离屏渲染（当前版本直接录制屏幕）。

### 浏览器兼容性
| 浏览器 | 支持情况 | 备注 |
|--------|---------|------|
| Chrome | ✅ 完全支持 | |
| Firefox | ✅ 完全支持 | |
| Safari | ✅ 完全支持 | |
| Edge | ✅ 完全支持 | |

---

## 🐛 已知问题
-   [ ] 大模型（>50MB）导入可能会卡顿。
-   [ ] 不支持骨骼动画（Skeletal Animation）的混合，仅支持变换动画。

---

## 🚀 未来计划
-   [ ] 支持材质编辑器。
-   [ ] 添加相机路径动画。
-   [ ] 支持骨骼动画导入与重定向。

---

## 📊 代码统计
-   **总行数**: ~600 行
-   **JS**: ~400 行

---

## 🔍 关键词
`3D`, `Three.js`, `动画制作`, `WebM`, `单文件HTML`
