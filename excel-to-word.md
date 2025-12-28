# Excel 转 Word 文档生成器

**文件名**: `excel-to-word.html`  
**创建日期**: 2025-12-28  
**最后更新**: 2025-12-28  
**代码行数**: ~420 行  

---

## 📋 工具简介

Excel 转 Word 文档生成器是一个高效的办公自动化工具，允许用户上传 Excel 数据表，通过自定义的 Word 模板（支持变量占位符），批量生成独立的 Word 文档并打包下载。适用于批量制作通知单、证书、合同、工资条等场景。

---

## 🎯 核心功能

### 功能列表
1.  **数据导入**: 支持 .xlsx/.xls 格式，自动识别表头并预览数据。
2.  **模板编辑**: 提供所见即所得的变量插入功能，支持 `{{字段名}}` 语法。
3.  **单份预览**: 可实时生成第一条数据的 Word 文档进行效果确认。
4.  **批量导出**: 支持自定义文件名规则，一键生成所有文档并打包为 ZIP 下载。

### 功能详情
-   **数据解析**
    -   实现方式：使用 `SheetJS` 读取 Excel 文件，转换为 JSON 对象数组。
    -   用户交互：拖拽或点击上传，表格实时渲染预览，支持翻页查看（预览模式限制前 5 条）。

-   **文档生成**
    -   实现方式：基于 `docx.js` 动态构建 Word 文档流，支持段落文本的变量替换。
    -   用户交互：在文本框中编辑模板，点击上方列名标签可快速插入占位符。

-   **批量处理**
    -   实现方式：使用 `JSZip` 创建压缩包，分批次（Chunking）处理文档生成任务以避免浏览器卡顿。
    -   用户交互：进度条实时反馈处理进度，完成后自动触发下载。

---

## 🔗 外部依赖

### CDN 链接
| 库名称 | 版本 | CDN 链接 | 用途 |
|--------|------|----------|------|
| xlsx | 0.18.5 | https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js | Excel 解析 |
| docx | 7.8.2 | https://cdn.jsdelivr.net/npm/docx@7.8.2/build/index.min.js | Word 文档生成 |
| jszip | 3.10.1 | https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js | ZIP 打包 |
| FileSaver | 2.0.5 | https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js | 文件保存 |

---

## 💻 核心实现逻辑

### 技术栈
-   HTML5 (FileReader API)
-   JavaScript (ES6+, Async/Await)
-   SheetJS / Docx.js / JSZip

### 关键代码实现

#### 1. 变量替换逻辑
```javascript
replacePlaceholders: function(text, row) {
    return text.replace(/\{\{(.+?)\}\}/g, (match, key) => {
        const val = row[key.trim()];
        return val !== undefined ? val : match;
    });
}
```
**实现说明**: 使用正则全局匹配 `{{...}}` 模式，从当前行数据对象 `row` 中查找对应值进行替换。

#### 2. 批量分片处理
```javascript
const processBatch = async (startIndex) => {
    // 每次处理 10 条，避免主线程阻塞
    const endIndex = Math.min(startIndex + batchSize, total);
    for (let i = startIndex; i < endIndex; i++) {
        // Generate Blob -> Zip.file
    }
    if (processed < total) setTimeout(() => processBatch(endIndex), 0);
};
```
**实现说明**: 前端批量生成大量文件属于计算密集型任务，通过 `setTimeout` 将任务分解到下一个事件循环，保持 UI 响应。

---

## 🎨 用户界面

### 布局结构
-   **左侧导航**: 步骤条（1.导入 -> 2.模板 -> 3.导出）。
-   **右侧工作区**: 根据步骤切换显示不同内容面板。
-   **暗色风格**: 统一的 VS Code 风格深色主题。

---

## 📝 使用说明

### 基本使用
1.  **上传**: 导入包含数据的 Excel 文件。
2.  **编辑**: 在模板输入框中撰写文档内容，点击 `姓名` 等标签插入变量。
3.  **预览**: 点击“预览单份文档”下载查看效果。
4.  **导出**: 设置文件名规则（如 `{{姓名}}_通知书`），点击“开始批量生成”。

---

## 🔧 技术细节

### API 使用
-   **docx.Document / Packer**: 构建 Word 文档对象模型并序列化为 Blob。

### 性能限制
-   浏览器内存限制：建议一次处理不超过 500 条记录，否则可能导致页面崩溃。

### 浏览器兼容性
| 浏览器 | 支持情况 | 备注 |
|--------|---------|------|
| Chrome | ✅ 完全支持 | |
| Firefox | ✅ 完全支持 | |
| Edge | ✅ 完全支持 | |
| IE | ❌ 不支持 | 依赖 ES6+ 特性 |

---

## 🐛 已知问题
-   [ ] 目前仅支持纯文本段落模板，不支持保留 Excel 中的原有样式或插入图片。
-   [ ] 导出的 Word 文档样式较为基础（默认字体字号）。

---

## 🚀 未来计划
-   [ ] 支持富文本模板编辑器。
-   [ ] 支持条件渲染语法（如 `{{#if 分数<60}}不及格{{/if}}`）。

---

## 📊 代码统计
-   **总行数**: ~420 行

---

## 🔍 关键词
`Excel转Word`, `批量生成`, `SheetJS`, `docx.js`, `办公自动化`
