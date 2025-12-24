# Markdown 转公众号格式工具

**文件名**: `markdown-to-wechat.html`  
**创建日期**: 2024-12-24  
**最后更新**: 2024-12-24  
**代码行数**: 1171 行  

---

## 📋 工具简介

一个强大的 Markdown 到微信公众号格式转换工具，支持实时预览、多主题切换和一键复制。将 Markdown 文本转换为适合微信公众号发布的富文本格式，保留完整的样式和排版，让内容创作者能够快速高效地准备公众号文章。

---

## 🎯 核心功能

### 功能列表
1. **实时 Markdown 解析** - 即时将 Markdown 语法转换为 HTML 并应用公众号样式
2. **多主题支持** - 提供 5 种精心设计的主题风格供选择
3. **左右分栏布局** - 左侧编辑器，右侧实时预览
4. **一键复制** - 保留样式复制到剪贴板，可直接粘贴到公众号编辑器
5. **移动端适配** - 响应式设计，支持移动设备使用
6. **快捷键支持** - Ctrl/Cmd+S 快速复制

### 功能详情
- **Markdown 解析**
  - 实现方式：自定义轻量级 Markdown 解析器，支持常用语法
  - 用户交互：实时输入，实时渲染预览
  - 支持语法：标题、粗体、斜体、引用、代码块、列表、表格、链接、图片等
  
- **主题切换**
  - 实现方式：CSS 类切换，每个主题独立样式定义
  - 用户交互：下拉选择主题，即时应用
  - 主题选项：微信绿、橙心、蓝调、紫罗兰、极简黑
  
- **样式复制**
  - 实现方式：使用 `document.execCommand('copy')` API 复制富文本
  - 用户交互：点击按钮或使用快捷键
  - 特点：保留所有 CSS 样式，可直接粘贴到公众号编辑器

---

## 🔗 外部依赖

### CDN 链接
| 库名称 | 版本 | CDN 链接 | 用途 |
|--------|------|----------|------|
| 无 | - | - | 纯原生实现，无外部依赖 |

### 依赖说明
- **纯原生实现**: 完全使用原生 JavaScript、HTML5 和 CSS3 实现，无需任何第三方库
- **零依赖**: 遵循单文件 HTML 工具哲学，可离线使用

---

## 💻 核心实现逻辑

### 技术栈
- HTML5
- CSS3 (Flexbox 布局、响应式设计)
- JavaScript (ES6+)
- 原生 DOM API

### 关键代码实现

#### 1. Markdown 解析器
```javascript
class SimpleMarkdownParser {
  constructor() {
    this.rules = [
      // 标题、粗体、斜体等规则
      { pattern: /^## (.*$)/gm, replacement: '<h2>$1</h2>' },
      { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' }
    ];
  }
  
  parse(markdown) {
    let html = markdown;
    // 1. 处理代码块
    html = this.parseCodeBlocks(html);
    // 2. 处理引用
    html = this.parseBlockquotes(html);
    // 3. 处理表格
    html = this.parseTables(html);
    // 4. 处理列表
    html = this.parseLists(html);
    // 5. 应用正则规则
    this.rules.forEach(rule => {
      html = html.replace(rule.pattern, rule.replacement);
    });
    // 6. 处理段落
    html = this.parseParagraphs(html);
    return html;
  }
}
```
**实现说明**: 采用分步解析策略，先处理块级元素（代码块、引用、表格、列表），再处理行内元素（粗体、斜体、链接），最后包装段落。避免了复杂的正则嵌套，提高了解析准确性。

#### 2. 表格解析
```javascript
parseTables(text) {
  const lines = text.split('\n');
  let result = [];
  let tableRows = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('|')) {
      // 检查分隔行 |---|---|
      if (line.match(/^\|?[\s\-:|]+\|?$/)) {
        continue; // 跳过分隔行
      }
      // 解析表格单元格
      const cells = line.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell);
      tableRows.push(cells);
    } else if (tableRows.length > 0) {
      // 表格结束，构建 HTML
      result.push(this.buildTable(tableRows));
      tableRows = [];
    }
  }
  return result.join('\n');
}
```
**实现说明**: 逐行扫描文本，识别包含 `|` 的行，跳过分隔行，收集表格行并构建 HTML 表格结构。

#### 3. 样式复制
```javascript
function copyToClipboard() {
  const content = document.getElementById('content');
  
  // 创建临时可编辑 div
  const tempDiv = document.createElement('div');
  tempDiv.contentEditable = true;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.innerHTML = content.innerHTML;
  document.body.appendChild(tempDiv);
  
  // 选择内容
  const range = document.createRange();
  range.selectNodeContents(tempDiv);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 复制到剪贴板
  document.execCommand('copy');
  
  // 清理
  document.body.removeChild(tempDiv);
  selection.removeAllRanges();
}
```
**实现说明**: 通过创建临时的 `contentEditable` 元素来保留样式，使用 `document.execCommand('copy')` 复制富文本内容到剪贴板，确保粘贴到公众号编辑器时样式完整。

### 数据流程
```
用户输入 Markdown → 实时监听 input 事件 → 调用解析器 parse() → 
生成 HTML → 应用主题样式 → 渲染到预览区 → 用户点击复制 → 
复制带样式的 HTML → 粘贴到公众号编辑器
```

### 状态管理
- **编辑器内容**: 存储在 `<textarea>` 的 `value` 中
- **预览内容**: 动态生成的 HTML，存储在 `#content` 元素中
- **当前主题**: 通过 CSS 类名 `theme-{name}` 控制
- **无持久化**: 不使用 localStorage，刷新页面内容清空

---

## 🎨 用户界面

### 布局结构
- **头部工具栏**: 
  - 左侧：工具标题
  - 右侧：主题选择器、清空按钮、复制按钮
- **主内容区（左右分栏）**:
  - 左侧：Markdown 编辑器（深色主题）
  - 右侧：实时预览区（白色背景）
- **提示消息**: 顶部居中浮动提示

### 交互设计
- **实时预览**: 输入 Markdown 后立即渲染预览
- **主题切换**: 下拉选择主题，预览区即时更新样式
- **复制反馈**: 复制成功/失败后显示 Toast 提示
- **清空确认**: 点击清空按钮弹出确认对话框
- **快捷键**: Ctrl/Cmd+S 触发复制操作

### 响应式设计
- **桌面端（>768px）**: 
  - 左右分栏，各占 50% 宽度
  - 编辑器和预览区等高
  - 工具栏横向排列
  
- **移动端（≤768px）**: 
  - 上下布局，编辑器在上（40vh），预览区在下
  - 工具栏按钮缩小
  - 字体和间距适配小屏幕

---

## 📝 使用说明

### 基本使用
1. 在左侧编辑器中粘贴或输入 Markdown 文本
2. 右侧预览区实时显示渲染效果
3. 在顶部选择喜欢的主题风格
4. 点击"📋 复制到公众号"按钮
5. 打开微信公众号编辑器，直接粘贴（Ctrl+V）

### 高级功能
- **主题定制**: 5 种主题可选
  - 微信绿：经典微信风格，适合官方、正式内容
  - 橙心：温暖活泼，适合生活、情感类内容
  - 蓝调：清爽专业，适合科技、商务类内容
  - 紫罗兰：优雅神秘，适合艺术、文化类内容
  - 极简黑：简约大气，适合设计、极简风格
  
- **快捷键操作**: 
  - `Ctrl+S` (Windows/Linux) 或 `Cmd+S` (Mac): 快速复制
  
- **清空内容**: 点击"清空"按钮可清除所有内容

### 使用示例
```
示例 1: 技术博客文章
操作: 
1. 粘贴 Markdown 格式的技术文章
2. 选择"蓝调"主题
3. 复制并粘贴到公众号
结果: 文章以专业的蓝色主题呈现，代码块高亮清晰

示例 2: 生活分享
操作:
1. 输入带图片和列表的 Markdown
2. 选择"橙心"主题
3. 复制到公众号
结果: 温暖的橙色调，适合生活类内容
```

---

## 🔧 技术细节

### API 使用
- **Selection API**: 用于选择和复制内容
  - `window.getSelection()`
  - `selection.addRange()`
  - `selection.removeAllRanges()`
  
- **Range API**: 用于创建文本范围
  - `document.createRange()`
  - `range.selectNodeContents()`
  
- **Clipboard API**: 用于复制操作
  - `document.execCommand('copy')` - 兼容性好的复制方法
  
- **DOM API**: 用于动态创建和操作元素
  - `createElement()`, `appendChild()`, `removeChild()`

### 性能优化
- **轻量级解析器**: 自实现解析器，避免引入大型 Markdown 库
- **最小化 DOM 操作**: 解析完成后一次性更新 innerHTML
- **CSS 类切换**: 主题切换仅改变类名，不重新渲染内容
- **无持久化开销**: 不使用 localStorage，减少 I/O 操作

### 浏览器兼容性
| 浏览器 | 最低版本 | 支持情况 |
|--------|---------|---------|
| Chrome | 60+ | ✅ 完全支持 |
| Firefox | 55+ | ✅ 完全支持 |
| Safari | 11+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |
| 移动端浏览器 | 现代版本 | ✅ 完全支持 |

**兼容性说明**:
- 使用 ES6+ 语法（类、箭头函数、模板字符串）
- Flexbox 布局需要现代浏览器支持
- `document.execCommand('copy')` 在主流浏览器中支持良好

---

## 🐛 已知问题

- [x] ~~代码块语言标识符暂未用于语法高亮~~ - 已实现基础代码块样式
- [ ] 嵌套列表支持有限 - 目前仅支持单层列表
- [ ] 图片仅支持 URL，不支持本地上传
- [ ] 复杂的 Markdown 语法（如脚注、任务列表）暂不支持
- [ ] 某些浏览器的复制功能可能受安全策略限制

---

## 🚀 未来计划

- [ ] 支持代码块语法高亮（集成轻量级高亮库）
- [ ] 添加本地图片上传和预览功能
- [ ] 支持自定义主题配色
- [ ] 添加 Markdown 语法快捷工具栏
- [ ] 支持导出为 HTML 文件
- [ ] 添加内容本地保存功能（localStorage）
- [ ] 支持更多 Markdown 扩展语法
- [ ] 添加字数统计功能
- [ ] 支持导入 Markdown 文件

---

## 📊 代码统计

- **总行数**: 1171 行
- **HTML**: ~150 行
- **CSS**: ~650 行（包含 5 个主题样式）
- **JavaScript**: ~350 行
- **注释**: ~20 行

**代码分布**:
- 样式代码占比最大（55%），因为包含了 5 套完整的主题样式
- JavaScript 逻辑清晰，解析器类独立封装
- HTML 结构简洁，语义化标签

---

## 🔍 关键词

`Markdown`, `公众号`, `富文本编辑`, `实时预览`, `主题切换`, `单文件HTML`, `无构建`, `内容创作`, `文本转换`, `样式复制`

---

## 📚 相关资源

- [Simon Willison 单文件哲学](https://simonwillison.net/2025/Dec/10/html-tools/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [微信公众号编辑器文档](https://mp.weixin.qq.com/)
- [MDN - Selection API](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)
- [MDN - document.execCommand](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)

---

## 💡 设计理念

### 为什么需要这个工具？
1. **公众号编辑器限制**: 微信公众号编辑器不支持 Markdown，但很多创作者习惯用 Markdown 写作
2. **样式统一性**: 手动调整公众号样式耗时费力，主题化的样式能保持内容一致性
3. **效率提升**: 一键复制粘贴，大幅提升发布效率
4. **离线可用**: 单文件设计，无需网络即可使用

### 设计亮点
- **轻量级解析器**: 不依赖大型 Markdown 库，代码简洁高效
- **公众号优化**: 样式专为公众号阅读体验设计（宽度 677px，行高 1.75）
- **主题多样性**: 5 种主题满足不同内容风格需求
- **零学习成本**: 界面直观，无需阅读文档即可上手

---

*文档生成日期: 2024-12-24*  
*遵循单文件 HTML 工具开发规范*