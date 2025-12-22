# JSON 格式化与字段折叠工具

**文件名**: `json-formatter.html`  
**创建日期**: 2025-12-19  
**最后更新**: 2025-12-19  
**代码行数**: 222 行  

---

## 📋 工具简介

JSON 格式化与字段折叠工具，支持快速格式化和美化 JSON 数据，提供语法高亮、字段折叠、一键复制等功能，帮助开发者更好地查看和调试 JSON 结构。

---

## 🎯 核心功能

### 功能列表
1. **JSON 格式化** - 将压缩的 JSON 转换为易读格式
2. **语法高亮** - 不同类型的值使用不同颜色显示
3. **字段折叠** - 支持展开/折叠对象和数组
4. **一键复制** - 快速复制格式化后的 JSON
5. **错误提示** - 显示 JSON 解析错误信息

### 功能详情

#### JSON 格式化
- **实现方式**: 使用 `JSON.parse()` 和 `JSON.stringify()` 进行解析和格式化
- **用户交互**: 输入 JSON 字符串，点击"格式化"按钮

#### 语法高亮
- **实现方式**: 正则表达式匹配不同类型的值，添加 HTML 标签和 CSS 类
- **用户交互**: 自动应用，无需用户操作

#### 字段折叠
- **实现方式**: 为对象和数组添加折叠按钮，点击切换显示/隐藏
- **用户交互**: 点击 `▼` 或 `▶` 图标展开/折叠

---

## 🔗 外部依赖

### CDN 链接
无外部依赖，完全使用原生 JavaScript 实现。

### 依赖说明
- **原生 JSON API**: 使用浏览器内置的 `JSON.parse()` 和 `JSON.stringify()` 方法
- **原生 Clipboard API**: 使用 `navigator.clipboard.writeText()` 实现复制功能

---

## 💻 核心实现逻辑

### 技术栈
- HTML5
- CSS3
- JavaScript (ES6+)
- 原生 JSON API
- 原生 Clipboard API

### 关键代码实现

#### 1. JSON 格式化
```javascript
function formatJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    const formatted = JSON.stringify(parsed, null, 2);
    return { success: true, data: formatted };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```
**实现说明**: 使用 `JSON.parse()` 验证 JSON 合法性，然后使用 `JSON.stringify(obj, null, 2)` 格式化，第三个参数 `2` 表示缩进 2 个空格。

#### 2. 语法高亮
```javascript
function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
    function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
}
```
**实现说明**: 使用正则表达式匹配 JSON 中的不同类型（字符串、数字、布尔值、null、键名），为每种类型添加对应的 CSS 类名。

#### 3. 字段折叠
```javascript
function addCollapsible(html) {
  // 为对象和数组添加折叠按钮
  html = html.replace(/(\{|\[)/g, '<span class="collapsible">▼</span>$1');
  
  // 绑定点击事件
  document.querySelectorAll('.collapsible').forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('collapsed');
      this.textContent = this.classList.contains('collapsed') ? '▶' : '▼';
      // 切换内容显示/隐藏
      const content = this.nextElementSibling;
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
  });
}
```
**实现说明**: 在对象 `{` 和数组 `[` 前添加折叠按钮，点击按钮切换内容的显示状态。

### 数据流程
```
用户输入 JSON → JSON.parse() 验证 → JSON.stringify() 格式化 → 语法高亮 → 添加折叠功能 → 显示结果
```

### 状态管理
- **inputJSON**: 用户输入的原始 JSON 字符串
- **formattedJSON**: 格式化后的 JSON 字符串
- **isCollapsed**: 各字段的折叠状态（通过 DOM 类名管理）

---

## 🎨 用户界面

### 布局结构
- **顶部**: 标题
- **输入区域**: 文本框，用于输入原始 JSON
- **操作按钮**: 格式化、复制、清空
- **输出区域**: 显示格式化后的 JSON，支持语法高亮和折叠

### 交互设计
- **格式化**: 点击按钮，解析并格式化 JSON
- **复制**: 点击按钮，复制格式化后的 JSON 到剪贴板
- **清空**: 点击按钮，清空输入和输出
- **折叠**: 点击 `▼` 或 `▶` 图标，展开/折叠字段

### 响应式设计
- **桌面端**: 标准布局，按钮横向排列
- **移动端**: 按钮自适应，文本框和输出区域占满宽度

---

## 📝 使用说明

### 基本使用
1. 在输入框中粘贴或输入 JSON 字符串
2. 点击"格式化"按钮
3. 查看格式化后的 JSON，支持语法高亮
4. 点击"复制"按钮，复制到剪贴板

### 高级功能
- **字段折叠**: 点击对象或数组前的 `▼` 图标，折叠该字段
- **错误提示**: 如果 JSON 格式错误，会显示错误信息
- **清空**: 点击"清空"按钮，重置输入和输出

### 使用示例

**示例 1: 格式化压缩的 JSON**
```
输入: {"name":"John","age":30,"city":"New York"}
操作: 点击"格式化"
结果:
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

**示例 2: 处理嵌套 JSON**
```
输入: {"user":{"name":"John","address":{"city":"NY","zip":"10001"}}}
操作: 点击"格式化"，然后折叠 address 字段
结果: address 字段被折叠，只显示 "address": {...}
```

---

## 🔧 技术细节

### API 使用
- **JSON.parse()**: 解析 JSON 字符串，验证合法性
- **JSON.stringify()**: 将 JavaScript 对象转换为格式化的 JSON 字符串
- **navigator.clipboard.writeText()**: 复制文本到剪贴板
- **正则表达式**: 用于语法高亮和字段匹配

### 性能优化
- 使用原生 API，无需外部库，加载速度快
- 语法高亮使用正则表达式一次性处理，效率高
- DOM 操作最小化，只在必要时更新

### 浏览器兼容性
| 浏览器 | 最低版本 | 支持情况 |
|--------|---------|---------|
| Chrome | 63+ | ✅ 完全支持 |
| Firefox | 53+ | ✅ 完全支持 |
| Safari | 13.1+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |

**注意**: Clipboard API 需要 HTTPS 或 localhost 环境。

---

## 🐛 已知问题

- [ ] 超大 JSON（> 1MB）可能导致浏览器卡顿
- [ ] 字段折叠功能在深层嵌套时可能不够直观

---

## 🚀 未来计划

- [ ] 添加 JSON 压缩功能
- [ ] 支持 JSON 路径查询
- [ ] 添加 JSON 差异对比
- [ ] 支持导入/导出 JSON 文件
- [ ] 添加 JSON Schema 验证
- [ ] 优化大文件处理性能

---

## 📊 代码统计

- **总行数**: 222 行
- **HTML**: ~30 行
- **CSS**: ~80 行
- **JavaScript**: ~110 行
- **注释**: ~2 行

**代码分布**:
- 样式定义: 36%
- JSON 处理: 30%
- 语法高亮: 20%
- 事件处理: 14%

---

## 🔍 关键词

`JSON`, `格式化`, `语法高亮`, `字段折叠`, `开发工具`, `单文件HTML`, `无构建`, `原生JavaScript`

---

## 📚 相关资源

- [Simon Willison 单文件哲学](https://simonwillison.net/2025/Dec/10/html-tools/)
- [JSON 规范](https://www.json.org/)
- [MDN - JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

---

*文档生成日期: 2025-12-22*  
*遵循单文件 HTML 工具开发规范*