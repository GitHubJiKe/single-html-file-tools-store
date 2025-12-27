# URL 文本压缩工具

**文件名**: `url-text-compressor.html`  
**创建日期**: 2025-12-27  
**最后更新**: 2025-12-27  
**代码行数**: 400 行  

---

## 📋 工具简介

URL 文本压缩工具是一个纯客户端运行的 Web 工具，允许用户将任意文本压缩并嵌入到 URL 的查询参数中。生成的链接可以分享给他人，打开时自动解压并显示原始文本。该工具特别适合在无法使用传统存储后端，或需要快速分享自包含文本片段的场景。

---

## 🎯 核心功能

### 功能列表
1. **文本压缩**: 使用 lz-string 算法高效压缩文本。
2. **链接生成**: 将压缩数据编码为 URL 参数，生成可分享链接。
3. **自动恢复**: 页面加载时检测 URL 参数并自动解压恢复内容。
4. **一键复制**: 方便地将生成的长链接复制到剪贴板。

### 功能详情
- **文本压缩与链接生成**
  - 实现方式：利用 `LZString.compressToEncodedURIComponent(string)` 进行压缩，确保生成的字符串对 URL 友好。
  - 用户交互：输入文本后点击“压缩并生成链接”，下方即时显示结果。
  
- **自动恢复**
  - 实现方式：在 `DOMContentLoaded` 事件中检查 `?data=` 参数，若存在则调用 `LZString.decompressFromEncodedURIComponent(data)`。
  - 用户交互：打开带有参数的链接，页面文本框自动填充原始内容。

---

## 🔗 外部依赖

### CDN 链接
| 库名称 | 版本 | CDN 链接 | 用途 |
|--------|------|----------|------|
| lz-string | 1.5.0 | https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js | 提供高效的文本压缩与解压算法 |

### 依赖说明
- **lz-string**: 专为存储设计的压缩库，生成的压缩字符串不包含 URL 非法字符，非常适合将数据压缩到 URL 查询参数中。

---

## 💻 核心实现逻辑

### 技术栈
- HTML5
- CSS3 (Variables, Dark mode support)
- JavaScript (ES6+, Vanilla)

### 关键代码实现

#### 1. 压缩逻辑
```javascript
function generateLink() {
    const text = textInput.value;
    // 使用 LZString 压缩
    const compressed = LZString.compressToEncodedURIComponent(text);
    
    // 构建 URL
    const url = new URL(window.location.href);
    url.searchParams.set('data', compressed);
    const finalUrl = url.toString();
    // ...
}
```
**实现说明**: 获取用户输入，调用 `compressToEncodedURIComponent` 得到压缩串，利用 `URL` API 修改当前页面 URL 的搜索参数，生成最终分享链接。

#### 2. 解压逻辑
```javascript
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    
    if (data) {
        try {
            const decompressed = LZString.decompressFromEncodedURIComponent(data);
            if (decompressed) {
                textInput.value = decompressed;
                // 更新统计信息等
            }
        } catch (e) {
            // 错误处理
        }
    }
});
```
**实现说明**: 页面加载时解析 query string，提取 `data` 参数。如果存在，尝试解压。解压成功则填充到文本框，失败则提示错误。

### 数据流程
```
用户输入文本 → LZString压缩 → URL编码 → 生成分享链接
    ↑                                       ↓
  文本显示 ← LZString解压 ← URL解码 ← 用户打开链接
```

### 状态管理
- **URL 参数**: 唯一的状态来源。页面无 Session 或 LocalStorage 依赖，所有数据包含在 URL 的 `?data=` 参数中。

---

## 🎨 用户界面

### 布局结构
- **Header**: 标题与副标题。
- **Input Group**: 大文本输入区域。
- **Actions**: 清空和压缩按钮。
- **Result Area**: 链接展示、复制按钮及压缩率统计。
- **Toast**: 浮动提示信息。

### 交互设计
- **输入**: 支持大段文本粘贴，文本框可调整高度。
- **反馈**: 操作成功（如复制、生成、解压）有 Toast 提示；错误有相应提示。
- **动态展示**: 结果区域默认为隐藏，生成结果后通过动画滑入显示。

### 响应式设计
- **自适应**: 容器宽度最大 800px，在移动端自动适配屏幕宽度。
- **暗黑模式**: 支持系统级暗黑模式，自动切换配色方案。

---

## 📝 使用说明

### 基本使用
1. 在输入框粘贴或输入需要分享的文本。
2. 点击“压缩并生成链接”按钮。
3. 点击生成的链接旁的“复制”按钮。
4. 将链接发送给他人，对方打开即可看到原始内容。

### 高级功能
- **统计信息**: 生成链接后，会显示原始大小、URL 长度及压缩/膨胀率，帮助用户判断压缩效果。

---

## 🔧 技术细节

### API 使用
- **URL / URLSearchParams**: 用于解析和构建查询参数。
- **navigator.clipboard**: 用于实现一键复制功能。
- **history.pushState**: 用于在清空时移除 URL 参数而不刷新页面。

### 性能优化
- **lz-string**: 轻量级库，压缩速度快，解压开销小。
- **无 DOM 抖动**: 主要操作集中在值修改和类名切换，无频繁重排。

### 浏览器兼容性
| 浏览器 | 支持情况 | 备注 |
|--------|---------|------|
| Chrome | ✅ 完全支持 | |
| Firefox | ✅ 完全支持 | |
| Safari | ✅ 完全支持 | |
| Edge | ✅ 完全支持 | |
| IE | ⚠️ 部分支持 | 可能不支持 URLSearchParams 或 CSS 变量 |

---

## 🐛 已知问题
- [ ] URL 长度限制：虽然进行了压缩，但极长的文本生成的 URL可能超过浏览器限制（通常 2000-8000 字符），导致截断无法解压。

---

## 🚀 未来计划
- [ ] 添加二维码生成功能，直接分享移动端。
- [ ] 支持简单的加密功能（密码保护）。

---

## 📊 代码统计
- **总行数**: ~400 行
- **HTML/CSS/JS**: 全集成在单文件

---

## 🔍 关键词
`压缩`, `URL分享`, `lz-string`, `单文件HTML`, `无服务`

---

## 📚 相关资源
- [lz-string GitHub](https://github.com/pieroxy/lz-string)
- [Simon Willison 单文件哲学](https://simonwillison.net/2025/Dec/10/html-tools/)

---

*文档生成日期: 2025-12-27*  
*遵循单文件 HTML 工具开发规范*
