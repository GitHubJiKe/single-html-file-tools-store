# 中国古诗词检索查看工具

**文件名**: `poetry-search.html`  
**创建日期**: 2026-01-23  
**最后更新**: 2026-01-23  
**代码行数**: 约 240 行

---

## 📋 工具简介

“纸墨之间”是一个极致优雅的中国古诗词检索与品读工具。采用象牙白与墨黑的古典配色，结合思源宋体（Noto Serif SC），为用户提供如临宣纸的沉浸式阅读体验。

---

## 🎯 核心功能

### 功能列表

1. **多维检索** - 支持按题目、作者、诗句或标签（如“豪放”）进行搜索。
2. **沉浸式品读** - 提供高行间距、宋体排版的深度阅读模式。
3. **珍藏系统** - 允许用户收藏心仪诗篇，并持久化存储。
4. **一键拓印** - 支持一键复制诗词全文及其元数据。
5. **本地优先** - 内置经典诗词数据，无网亦可品读。

### 功能详情

- **视觉设计**
    - 实现方式：自定义 Tailwind 颜色体系与 Google Fonts 集成。
    - 用户交互：搜索建议与平滑的详情跳转动画。
- **状态管理**
    - 实现方式：利用 Alpine.js 的全局 `poetryApp` 对象管理检索与视图切换。

---

## 🔗 外部依赖

### CDN 链接

| 库名称        | 版本    | CDN 链接                                                      | 用途           |
| ------------- | ------- | ------------------------------------------------------------- | -------------- |
| DaisyUI       | latest  | https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.min.css | UI 组件库      |
| Tailwind CSS  | latest  | https://cdn.tailwindcss.com                                   | 响应式样式     |
| Alpine.js     | 3.x.x   | https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js   | 交互逻辑       |
| Noto Serif SC | webfont | Google Fonts                                                  | 中文书法级字体 |

---

## 💻 核心实现逻辑

### 技术栈

- HTML5 / CSS3
- Tailwind CSS
- Alpine.js (Lightweight State Management)

### 关键代码实现

#### 1. 动态过滤逻辑

```javascript
get filteredPoems() {
    let results = this.showFavorites
        ? this.poems.filter(p => this.favorites.includes(p.id))
        : this.poems;
    // ... 基于 searchQuery 进行子字符串匹配
}
```

#### 2. 自定义设计系统

```javascript
colors: {
    ivory: '#FDFBF7',  // 象牙白
    ink: '#1A1A1A',    // 墨黑
    cinnabar: '#991B1B' // 朱砂红
}
```

---

## 🎨 用户界面

### 布局结构

- **顶部 (Header)**: 书法体标题与现代极简检索框。
- **列表页**: 垂直排列的诗词索引，带悬浮变色反馈。
- **详情页**: 居中大字排版，强调呼吸感与留白。

---

## 📝 使用说明

### 基本使用

1. 打开 `poetry-search.html`。
2. 在顶部搜索框输入关键词（如“李白”或“明月”）。
3. 点击列表中的项进入详情页阅读。
4. 点击红色的爱心图标收藏此诗。

---

## 📊 代码统计

- **总行数**: 238 行
- **HTML/Alpine**: 140 行
- **JSON 数据**: 60 行
- **CSS**: 40 行

---

## 🔍 关键词

`Ancient Poetry`, `Chinese Culture`, `Minimalist Reader`, `Alpine.js`, `Noto Serif`

---

_文档生成日期: 2026-01-23_  
_遵循单文件 HTML 工具开发规范_
