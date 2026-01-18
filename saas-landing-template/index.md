# SaaS 出海产品落地页模板 (VortexSaaS)

**文件名**: `index.html`  
**创建日期**: 2026-01-18  
**最后更新**: 2026-01-18  
**代码行数**: 约 350 行

---

## 📋 工具简介

这是一个专为 SaaS 出海业务设计的现代、高转化率单文件落地页模板。它融合了 2025/26 年最流行的设计趋势，包括深色模式、玻璃拟态、流光边框动画以及响应式分栏布局。开发者只需修改一个 `.html` 文件即可极速上线产品主页。

---

## 🎯 核心功能

### 功能列表

1. **响应式设计** - 完美适配手机、平板及桌面端。
2. **暗黑模式优先** - 采用深邃的 Slate 颜色体系。
3. **Waitlist 收集系统** - 预置 Alpine.js 逻辑。
4. **定价切换器** - 支持月付/年付价格动态切换（-20% 折扣逻辑）。
5. **Bento Grid 特性展示** - 现代化的功能卡片布局。
6. **FAQ 手风琴** - DaisyUI 原生组件实现交互。

### 功能详情

- **视觉流光 (Glow Border)**
    - 实现方式：CSS 自定义动画 `border-rotate` 搭配渐变背景。
    - 用户交互：在 Hero 下方的预览卡片上自动循环。
- **状态管理 (Alpine.js)**
    - 实现方式：`x-data` 统一管理 `isAnnual`, `waitlistEmail`, `submitted` 等状态。
    - 用户交互：点击 Toggle 实时切换所有价格卡片。

---

## 🔗 外部依赖

### CDN 链接

| 库名称       | 版本   | CDN 链接                                                      | 用途           |
| ------------ | ------ | ------------------------------------------------------------- | -------------- |
| DaisyUI      | latest | https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.min.css | 组件库         |
| Tailwind CSS | latest | https://cdn.tailwindcss.com                                   | 样式布局       |
| Alpine.js    | 3.x.x  | https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js   | 交互逻辑       |
| Outfit Font  | -      | Google Fonts                                                  | 现代无衬线字体 |

---

## 💻 核心实现逻辑

### 技术栈

- HTML5 / CSS3 / JavaScript (ES6+)
- Tailwind CSS (Utility-first)
- DaisyUI (Component classes)
- Alpine.js (Lightweight reactive state)

### 关键代码实现

#### 1. 定价切换逻辑

```javascript
// Alpine.js data structure
{
    isAnnual: false,
    // ...
}
```

**实现说明**: 通过 `x-model` 绑定到 Toggle，并在价格显示处使用 `x-text` 进行三元运算切换数值。

#### 2. 毛玻璃卡片 (Glassmorphism)

```css
.glass-card {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 📝 使用说明

### 基本使用

1. 打开 `index.html`。
2. 搜索 `VortexSaaS` 替换为您自己的品牌名。
3. 修改 `Pricing` 部分的数值和特性。
4. 将文件上传至 GitHub Pages, Netlify 或 Vercel。

### 交互示例

- **加入 Waitlist**: 在 Hero 区域输入邮箱，点击 "Join Waitlist"，按钮将进入 Success 状态。
- **切换价格**: 滚动至 Pricing 区域，点击 Toggle 即可看到年付优惠后的价格。

---

## 📊 代码统计

- **总行数**: 约 350 行
- **HTML**: ~70%
- **CSS**: ~10% (内联 style 为主)
- **JavaScript**: ~20% (Alpine.js 为主)

---

## 🔍 关键词

`SaaS`, `Landing Page`, `落地页模板`, `出海`, `TailwindCSS`, `DaisyUI`, `Single HTML`

---

_文档生成日期: 2026-01-18_  
_遵循单文件 HTML 工具开发规范_
