# Local Bookmark Manager Design v20241231

## 设计愿景与调性定义
- **调性**：克制、效率、专注、未来感。
- **视觉风格**：采用极简主义风格，结合毛玻璃效果（Glassmorphism）和精致的阴影，营造出轻盈且高端的质感。

## 设计规范系统

### 1. 色彩体系 (Colors)
- **Primary**: `#6366f1` (Indigo - 活力与科技)
- **Success**: `#10b981` (Emerald)
- **Danger**: `#ef4444` (Rose)
- **Background**: `#f8fafc` (Light) / `#0f172a` (Dark)
- **Card/Surface**: `rgba(255, 255, 255, 0.7)` with `backdrop-filter: blur(10px)`

### 2. 栅格与布局 (Layout)
- **容器宽度**: 最大 1000px，居中显示。
- **内间距 (Padding)**: 基础单位 4px (4, 8, 16, 24, 32)。
- **栅格**: 自适应网格布局，大屏幕显示多列卡片，小屏幕单列。

### 3. 排版 (Typography)
- **字体**: `Inter`, `-apple-system`, `system-ui`, sans-serif.
- **层级**:
  - H1: 24px, Bold.
  - H2: 18px, Semi-bold.
  - Body: 14px, Regular.

## 核心视图视觉解析
- **顶部检索区**: 固定在顶部的搜索栏，带有半透明毛玻璃底色。左侧是 Logo，中间是宽大的搜索框，右侧是“添加”按钮。
- **内容展示区**: 采用瀑布流或网格布局的卡片流。每张卡片包含：
  - 网站图标（通过 favicon API 获取）。
  - 网站标题（超出两行省略）。
  - URL（淡灰色小字）。
  - 标签组（彩色小丸子风格）。
  - 操作按钮（编辑、删除，仅在悬浮时显示或置于卡片底部）。
- **侧边/浮层面板**: 用于添加和编辑收藏的表单，采用右侧滑出或中心弹窗形式。

## 关键交互与微动画说明
- **Hover 效果**: 卡片悬浮时轻轻上移并增加阴影深度。
- **搜索过滤**: 列表项使用 `opacity` 和 `transform: scale` 的组合实现平滑的淡入淡出。
- **反馈动画**: 成功添加或删除后的轻量消息提醒（Toasts）。

## 前端开发实施建议
- **布局方案**: 使用 `display: grid` 和 `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))` 实现完美的响应式卡片流。
- **动画实现**: 利用 CSS `transition` 和极简的 `Web Animations API` 保证 60fps 的流畅度。
- **图标方案**: 使用 Lucide Icons 进行点缀。
- **状态同步**: 确保搜索关键词改变时，DOM 的更新最小化，可考虑使用模板字符串配合差异化渲染逻辑。
