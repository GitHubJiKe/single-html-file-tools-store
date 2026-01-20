# English Self Learner 工具文档

**文件名**: `index.html`  
**创建日期**: 2026-01-18  
**最后更新**: 2026-01-20  
**代码行数**: 约 480 行

---

## 📋 工具简介

English Self Learner 是一个基于交互式分词完形填空的英语自学系统。它允许用户导入自定义的英文句子及其单词级含义，通过实时校验和智能提示帮助用户加深对词汇和语法的记忆。

---

## 🎯 核心功能

### 功能列表

1. **分词完形填空** - 自动将句子拆分为单词输入框。
2. **多层级提示** - 顶部显示全句翻译，下方显示每个单词的精准含义。
3. **三击纠错逻辑** - 每个单词最多允许尝试 3 次，失败后自动显示正确答案（Hint 模式）。
4. **进度自动记忆** - 自动保存当前练习进度，刷新或重新打开页面可无缝接续。
5. **一键进入下一关** - 完成句子后，除了自动倒计时外，支持按 `Enter` 键立即跳转。
6. **非侵入式转场倒计时** - 完成句子后，在右上角弹出 10 秒倒计时，支持点击立即跳过。
7. **数据驱动** - 支持 JSON 格式的数据导入与导出。
8. **本地存储** - 自动保存数据和进度到浏览器的 `localStorage`。

### 功能详情

- **交互输入**
  - 实现方式：利用 Alpine.js 的 `x-model` 监听输入，通过正则提取字母数字进行模糊匹配。
  - 用户交互：输入正确后自动聚焦 (`focus`) 下一个单词。
- **进度持久化**
  - 实现方式：在切换句子时同步 `currentIndex` 到 `localStorage`。
  - 用户交互：无感记忆，无需手动保存。
- **全局捷径**
  - 实现方式：监听全局 `keydown.enter` 事件，结合句子查验状态。
  - 用户交互：完成后盲打 `Enter` 即可开启下一轮，体验极速流畅。
- **倒计时提示**
  - 实现方式：使用 `fixed top-18 right-8` 定位，无背景遮挡，确保用户可在倒计时期间复习句子。
  - 用户交互：视觉圆环进度条显示剩余时间。

---

## 🔗 外部依赖

### CDN 链接

| 库名称       | 版本   | CDN 链接                                                      | 用途             |
| ------------ | ------ | ------------------------------------------------------------- | ---------------- |
| DaisyUI      | latest | https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.min.css | 基础 UI 组件     |
| Tailwind CSS | latest | https://cdn.tailwindcss.com                                   | 响应式布局与样式 |
| Alpine.js    | 3.x.x  | https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js   | 响应式状态管理   |

---

## 💻 核心实现逻辑

### 技术栈

- HTML5 / CSS3
- Tailwind CSS (Utility Classes)
- Alpine.js (Reactive Logic)

### 关键代码实现

#### 1. 进度恢复逻辑

```javascript
const savedIndex = localStorage.getItem('english-learner-progress');
if (savedIndex !== null) {
  const index = parseInt(savedIndex);
  if (index >= 0 && index < this.sentences.length) {
    this.currentIndex = index;
  }
}
```

---

## 📝 使用说明

### 基本使用

1. 打开 `index.html`。
2. 点击 **Import**，粘贴符合规范的 JSON 数据。
3. 根据中文提示拼写单词，按 `Enter` 确认。
4. 句子完成后，右上角会出现倒计时，您可以趁此时机复习全句，或者按 `Enter` 快速进入下一句。
5. **断点续练**：随时关闭浏览器，下次打开将自动定位到您上次离开的句子。

---

## 📊 代码统计

- **总行数**: 约 480 行
- **HTML**: 280 行
- **JS/Alpine**: 200 行

---

## 🔍 关键词

`English Learning`, `Cloze Test`, `Memory Tool`, `Progress Persistence`, `Local-first`

---

_文档更新日期: 2026-01-20_  
_遵循单文件 HTML 工具开发规范_
