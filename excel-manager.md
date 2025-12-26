# Excel 在线管理工具

**文件名**: `excel-manager.html`  
**创建日期**: 2025-12-26  
**最后更新**: 2025-12-26  
**代码行数**: ~800 行  

---

## 📋 工具简介

一款完全免费开源的 Excel 在线管理工具，支持 Excel 文件的上传、在线编辑、本地缓存管理。基于 SheetJS 和 Handsontable 实现 Excel 编辑功能，使用 IndexedDB 实现文件本地持久化存储，无需服务器即可完成所有操作。

**特点**：100% 免费开源库，无需商业授权，支持基础 Excel 功能编辑。

---

## 🎯 核心功能

### 功能列表
1. **文件上传** - 支持点击上传和拖拽上传 Excel 文件
2. **文件列表管理** - 集中查看所有已上传的文件，支持打开、导出、删除操作
3. **在线编辑** - 完整的 Excel 编辑功能，包括单元格编辑、公式计算、格式设置等
4. **本地缓存** - 使用 IndexedDB 实现文件本地存储，支持离线访问
5. **文件导出** - 支持将编辑后的文件导出为 Excel 格式

### 功能详情

- **文件上传功能**
  - 实现方式：支持点击上传和拖拽上传两种方式
  - 文件格式：支持 .xlsx 和 .xls 格式
  - 用户交互：拖拽区域带有视觉反馈，文件上传后自动保存到 IndexedDB
  
- **文件列表视图**
  - 实现方式：卡片式网格布局，展示文件基本信息
  - 显示内容：文件名、文件大小、上传时间
  - 用户交互：提供打开、导出、删除三个操作按钮
  
- **在线编辑器**
  - 实现方式：集成 SpreadJS 专业电子表格组件
  - 编辑功能：完整支持 Excel 所有功能，包括公式、格式、图表等
  - 用户交互：提供保存、下载、关闭三个操作按钮
  
- **本地存储**
  - 实现方式：使用 IndexedDB 存储文件的 ArrayBuffer 数据
  - 数据结构：包含 id、name、data、size、uploadDate 字段
  - 持久化：数据永久保存在浏览器本地，清除浏览器数据后才会丢失

---

## 🔗 外部依赖

### CDN 链接
| 库名称 | 版本 | CDN 链接 | 用途 |
|--------|------|----------|------|
| SheetJS (xlsx) | 0.18.5 | https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js | Excel 文件解析和生成 |
| Handsontable | 12.3.1 | https://cdn.jsdelivr.net/npm/handsontable@12.3.1/dist/handsontable.full.min.js | 电子表格编辑器 |
| Handsontable CSS | 12.3.1 | https://cdn.jsdelivr.net/npm/handsontable@12.3.1/dist/handsontable.full.min.css | 电子表格样式 |

### 依赖说明
- **SheetJS (xlsx)**: 免费开源的 Excel 文件处理库，选择此库是因为：
  - 完全免费，MIT 许可证
  - 支持 Excel 文件格式解析（.xlsx, .xls）
  - 纯 JavaScript 实现，无需构建步骤
  - 社区活跃，文档完善
  - 支持浏览器和 Node.js 环境

- **Handsontable**: 开源的电子表格编辑器（使用非商业授权），选择此库是因为：
  - 免费版本可用于非商业项目
  - 提供类似 Excel 的编辑体验
  - 支持行列调整、上下文菜单等交互
  - 性能优秀，支持大量数据
  - 纯 JavaScript 实现，无需构建

---

## 💻 核心实现逻辑

### 技术栈
- HTML5
- CSS3 (Flexbox & Grid 布局)
- JavaScript (ES6+)
- IndexedDB API
- FileReader API
- SheetJS 0.18.5 (MIT 许可证)
- Handsontable 12.3.1 (非商业授权)

### 关键代码实现

#### 1. IndexedDB 数据库管理
```javascript
class ExcelDB {
    async init() {
        // 创建或打开数据库
        const request = indexedDB.open('ExcelManagerDB', 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // 创建对象存储，使用自增 ID 作为主键
            const objectStore = db.createObjectStore('files', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            // 创建索引用于查询
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('uploadDate', 'uploadDate', { unique: false });
        };
    }
    
    async saveFile(name, data, size) {
        // 保存文件到 IndexedDB
        const file = {
            name: name,
            data: data, // ArrayBuffer 格式
            size: size,
            uploadDate: new Date().toISOString()
        };
        // 使用事务添加数据
        const transaction = this.db.transaction(['files'], 'readwrite');
        const objectStore = transaction.objectStore('files');
        return objectStore.add(file);
    }
}
```
**实现说明**: 封装 IndexedDB 操作，提供增删改查接口。使用 Promise 包装异步操作，便于 async/await 调用。

#### 2. 文件上传处理
```javascript
async handleFileUpload(files) {
    for (const file of files) {
        // 验证文件格式
        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            alert('请上传 Excel 文件');
            continue;
        }
        
        // 使用 FileReader 读取文件为 ArrayBuffer
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            await this.db.saveFile(file.name, arrayBuffer, file.size);
            await this.loadFileList();
        };
        reader.readAsArrayBuffer(file);
    }
}
```
**实现说明**: 使用 FileReader API 将文件读取为 ArrayBuffer 格式，便于存储和后续处理。支持批量上传多个文件。

#### 3. SpreadJS 集成与 Excel 文件加载
```javascript
async openFile(id) {
    const file = await this.db.getFile(id);
    
    // 使用 ExcelIO 将 ArrayBuffer 转换为 SpreadJS JSON 格式
    await new Promise((resolve, reject) => {
        this.excelIO.open(file.data, (json) => {
            // 将 JSON 数据加载到 SpreadJS 工作簿
            this.spread.fromJSON(json);
            resolve();
        }, reject);
    });
    
    // 显示编辑器界面
    this.switchTab('editor');
}
```
**实现说明**: SpreadJS 的 ExcelIO 模块负责 Excel 文件格式的解析，将二进制数据转换为内部 JSON 格式，然后加载到工作簿实例中。

#### 4. 保存编辑后的文件
```javascript
async saveCurrentFile() {
    // 将 SpreadJS 工作簿导出为 JSON
    const json = this.spread.toJSON();
    
    // 将 JSON 转换回 Excel 格式
    await new Promise((resolve, reject) => {
        this.excelIO.save(json, (blob) => {
            // 将 Blob 转换为 ArrayBuffer 存储
            const reader = new FileReader();
            reader.onload = async (e) => {
                await this.db.updateFile(this.currentFileId, e.target.result);
                resolve();
            };
            reader.readAsArrayBuffer(blob);
        }, reject);
    });
}
```
**实现说明**: 保存流程是加载的逆过程，将 SpreadJS 数据转换为 Excel 格式的 Blob，再转为 ArrayBuffer 更新到 IndexedDB。

### 数据流程
```
文件上传 → FileReader(读取为ArrayBuffer) → IndexedDB(存储) 
          ↓
文件列表 ← IndexedDB(查询所有文件)
          ↓
打开文件 → IndexedDB(获取ArrayBuffer) → ExcelIO.open(解析) → SpreadJS(显示)
          ↓
编辑操作 → SpreadJS(实时编辑)
          ↓
保存文件 → SpreadJS.toJSON() → ExcelIO.save(导出) → ArrayBuffer → IndexedDB(更新)
          ↓
下载文件 → ExcelIO.save(导出) → Blob → 浏览器下载
```

### 状态管理
- **currentFileId**: 当前打开的文件 ID，用于保存和下载操作
- **spread**: SpreadJS 工作簿实例，全局唯一
- **db**: IndexedDB 连接实例，全局唯一
- **excelIO**: Excel 导入导出实例，全局唯一

---

## 🎨 用户界面

### 布局结构
- **顶部标题区**: 渐变色背景，显示工具名称和描述
- **标签导航栏**: 三个标签页 - 上传文件、文件列表、在线编辑
- **内容区域**: 根据选中标签显示不同内容

### 交互设计
- **文件上传**
  - 点击上传：点击上传区域触发文件选择框
  - 拖拽上传：支持拖拽文件到上传区域
  - 视觉反馈：拖拽时上传区域变色，鼠标悬停时边框高亮
  
- **文件列表**
  - 网格布局：自适应卡片式布局，每行最多 3 个
  - 操作按钮：每个文件卡片包含打开、导出、删除按钮
  - 空状态提示：无文件时显示友好的空状态提示
  
- **在线编辑**
  - 工具栏：显示文件名和操作按钮（保存、下载、关闭）
  - 编辑区域：SpreadJS 编辑器，支持多 Sheet 页切换
  - 空状态提示：未打开文件时显示提示信息

### 响应式设计
- **桌面端 (>768px)**
  - 文件列表：3 列网格布局
  - 编辑器高度：600px
  - 按钮布局：水平排列
  
- **移动端 (≤768px)**
  - 文件列表：单列布局
  - 编辑器高度：400px（适应小屏幕）
  - 按钮布局：垂直堆叠，便于触控
  - 标签文字：缩小字号，优化空间利用

---

## 📝 使用说明

### 基本使用
1. **上传文件**
   - 点击"上传文件"标签
   - 点击上传区域或拖拽 Excel 文件到页面
   - 等待上传成功提示

2. **查看文件列表**
   - 点击"文件列表"标签
   - 查看所有已上传的文件信息
   - 使用操作按钮管理文件

3. **编辑文件**
   - 在文件列表中点击"打开"按钮
   - 自动跳转到编辑器页面
   - 像使用 Excel 一样编辑文件
   - 点击"保存"按钮保存更改

4. **下载文件**
   - 在编辑器中点击"下载"按钮
   - 或在文件列表中点击"导出"按钮
   - 文件将下载到本地

### 高级功能
- **批量上传**: 一次选择多个 Excel 文件同时上传
- **公式计算**: 支持 Excel 所有公式函数
- **格式设置**: 支持单元格格式、条件格式、数据验证
- **多 Sheet 管理**: 支持多工作表切换和编辑
- **离线使用**: 所有数据存储在本地，无需网络连接

### 使用示例
```
示例 1: 管理年度财务报表
操作: 
  1. 上传公司年度财务报表 Excel 文件
  2. 在编辑器中修改数据和公式
  3. 保存更改到本地缓存
  4. 需要时导出最新版本

结果: 所有修改自动保存，数据永不丢失，可随时访问编辑

示例 2: 批量处理多个数据表
操作:
  1. 一次性拖拽上传 10 个 Excel 文件
  2. 在文件列表中逐个打开编辑
  3. 编辑完成后批量导出

结果: 高效管理多个文件，无需反复上传下载
```

---

## 🔧 技术细节

### API 使用
- **IndexedDB API**: 用于本地数据持久化存储
  - `indexedDB.open()`: 打开/创建数据库
  - `objectStore.add()`: 添加数据
  - `objectStore.get()`: 查询数据
  - `objectStore.put()`: 更新数据
  - `objectStore.delete()`: 删除数据
  
- **FileReader API**: 用于读取本地文件
  - `readAsArrayBuffer()`: 将文件读取为 ArrayBuffer
  
- **Blob API**: 用于文件下载
  - `URL.createObjectURL()`: 创建下载链接
  
- **Drag and Drop API**: 用于拖拽上传
  - `dragover`: 拖拽悬停事件
  - `drop`: 拖拽释放事件

### 性能优化
- **懒加载**: SpreadJS 仅在需要时初始化，减少初始加载时间
- **事务优化**: IndexedDB 操作使用事务批处理，提升性能
- **内存管理**: 关闭编辑器时清理 SpreadJS 实例，避免内存泄漏
- **文件大小显示**: 使用单位换算优化大文件显示

### 浏览器兼容性
| 浏览器 | 最低版本 | 支持情况 |
|--------|---------|---------|
| Chrome | 24+ | ✅ 完全支持 (IndexedDB, FileReader) |
| Firefox | 16+ | ✅ 完全支持 |
| Safari | 10+ | ✅ 完全支持 |
| Edge | 12+ | ✅ 完全支持 |
| IE | 11 | ⚠️ 部分支持 (需 polyfill) |

**注意**: IndexedDB 和 FileReader API 是关键依赖，低于推荐版本的浏览器可能无法正常使用。

---

## 🐛 已知问题

- [ ] 大文件（>50MB）上传可能导致浏览器卡顿
- [ ] 移动端编辑体验不如桌面端流畅
- [ ] Safari 浏览器在私密浏览模式下 IndexedDB 可能不可用
- [ ] 仅支持单个工作表编辑，多工作表文件只显示第一个sheet
- [ ] 不支持复杂公式、图表、形状等高级Excel功能

---

## 🚀 未来计划

- [ ] 添加文件搜索和过滤功能
- [ ] 支持更多文件格式（CSV、ODS）
- [ ] 实现文件版本历史管理
- [ ] 添加数据统计和可视化功能
- [ ] 优化大文件处理性能
- [ ] 支持云端同步（可选）
- [ ] 添加多语言支持

---

## 📊 代码统计

- **总行数**: 654 行
- **HTML**: 约 150 行
- **CSS**: 约 180 行
- **JavaScript**: 约 310 行
- **注释**: 约 14 行

---

## 🔍 关键词

`Excel`, `在线编辑`, `SheetJS`, `Handsontable`, `IndexedDB`, `本地存储`, `文件管理`, `单文件HTML`, `无构建`, `离线应用`, `电子表格`, `免费开源`

---

## 📚 相关资源

- [Simon Willison 单文件哲学](https://simonwillison.net/2025/Dec/10/html-tools/)
- [SpreadJS 官方文档](https://www.grapecity.com/spreadjs/docs/latest/)
- [IndexedDB API 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)
- [FileReader API 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)

---

## ⚠️ 使用注意事项

1. **数据安全**: 所有数据存储在浏览器本地 IndexedDB 中，清除浏览器数据会导致文件丢失，请定期导出重要文件
2. **存储限制**: 浏览器对 IndexedDB 有存储配额限制（通常为可用磁盘空间的 50%），超出配额将无法上传新文件
3. **授权说明**: 
   - SheetJS 使用 Apache-2.0 许可证，完全免费
   - Handsontable 使用非商业授权（`non-commercial-and-evaluation`），个人和非商业项目免费使用
   - 如需商业用途，建议购买 Handsontable 商业许可证或替换为其他完全免费的编辑器
4. **浏览器支持**: 建议使用最新版本的 Chrome、Firefox 或 Edge 浏览器以获得最佳体验
5. **功能限制**: 本工具仅支持基础 Excel 编辑功能，复杂公式、图表、VBA 等高级功能不被支持

---

*文档生成日期: 2025-12-26*  
*遵循单文件 HTML 工具开发规范*