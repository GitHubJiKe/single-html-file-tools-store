# Local Bookmark Manager (本地站点收藏管理器)

**文件名**: `local-bookmark-manager.html`  
**创建日期**: 2024-12-31  
**最后更新**: 2024-12-31  
**代码行数**: 约 500 行  

---

## 📋 工具简介

Local Bookmark Manager 是一款轻量级、本地优先的浏览器端站点收藏工具。它不依赖于任何服务器或数据库，所有数据均安全地存储在浏览器的 `localStorage` 中。它旨在为用户提供一个快速、高效的方式来收集、检索和整理常用的网页链接。

---

## 🎯 核心功能

### 功能列表
1. **收藏管理** - 支持添加、编辑、删除网页收藏。
2. **即时检索** - 支持对标题、URL 和标签的模糊搜索。
3. **本地存储** - 使用 LocalStorage 实现数据的持久化，确保护密性。
4. **数据迁移** - 提供 JSON 格式的导出与导入功能，方便备份与迁移。
5. **UI/UX** - 现代化的毛玻璃风格界面，支持响应式布局（适配手机与桌面端）。

### 功能详情
- **智能 Favicon**
  - 实现方式：利用 Google Favicon API 根据 URL 自动抓取站点图标。
  - 用户交互：在卡片左侧展示，方便快速视觉识别。
  
- **标签过滤**
  - 实现方式：支持对收藏项标记多个标签。
  - 用户交互：通过搜索框键入标签名即可快速筛选。

---

## 🔗 外部依赖

### CDN 链接
| 库名称 | 版本 | CDN 链接 | 用途 |
|--------|------|----------|------|
| Lucide Icons | 0.321.0 | https://cdn.jsdelivr.net/npm/lucide-static@0.321.0/font/lucide.min.css | 矢量图标显示 |

---

## 💻 核心实现逻辑

### 技术栈
- **HTML5**: 语义化结构。
- **CSS3**: Flexbox, Grid 布局，Backdrop-filter (毛玻璃)。
- **Vanilla JavaScript**: 原生逻辑处理，无框架依赖。

### 关键代码实现

#### 1. 数据持久化与渲染
```javascript
function saveBookmark() {
    // ... 获取输入 ...
    if (editingId) {
        // 更新逻辑
    } else {
        // 新增逻辑
    }
    localStorage.setItem('local_bookmarks', JSON.stringify(bookmarks));
    render();
}
```
**实现说明**: 利用浏览器原生的存储能力，确保刷新页面或重启浏览器后数据不丢失。

#### 2. 即时搜索过滤
```javascript
const filtered = bookmarks.filter(b => 
    b.title.toLowerCase().includes(filter.toLowerCase()) ||
    b.url.toLowerCase().includes(filter.toLowerCase()) ||
    (b.tags && b.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())))
);
```
**实现说明**: 每当搜索框内容改变时，动态计算满足条件的项并重新渲染 DOM，确报检索的平滑性。

---

## 🎨 用户界面

### 布局结构
- **顶部固定栏**: 包含 Logo、搜索框和主操作按钮。
- **主内容区**: 响应式卡片流布局，自动根据屏幕宽度调整列数。

### 交互设计
- **悬浮操作**: 只有当鼠标悬浮在卡片上时，才会显示编辑和删除操作，保持界面整洁。
- **一键复制**: 整合了剪贴板 API，方便快速分享链接。

---

## 📝 使用说明

### 基本使用
1. 点击右上角“添加收藏”。
2. 输入网站名称和 URL。
3. 点击“确认保存”。

### 数据备份
- 点击下载图标，即可下载包含所有收藏数据的 `json` 文件。
- 重装系统或更换浏览器后，点击上传图标并选择备份文件即可恢复。

---

## 🔍 关键词

`Bookmark`, `LocalStorage`, `Local-first`, `Search`, `Single-HTML`, `Efficiency`

---

*文档生成日期: 2024-12-31*  
*遵循单文件 HTML 工具开发规范*
