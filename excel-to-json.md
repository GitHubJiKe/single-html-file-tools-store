# Excel 转 JSON 工具

**文件名**: `excel-to-json.html`  
**创建日期**: 2025-01-25  
**最后更新**: 2025-01-25  
**代码行数**: 716 行  

---

## 📋 工具简介

Excel 转 JSON 工具是一个纯浏览器端的数据转换工具，可以将 Excel 文件（.xlsx / .xls）快速转换为 JSON 格式。工具支持多工作表解析、实时预览、自定义转换选项，无需上传到服务器，所有数据处理都在本地完成，保护数据隐私。

**适用场景**:
- 开发者需要将 Excel 数据导入到应用中
- 数据分析师需要将表格数据转换为 JSON 格式
- 前端开发需要 Mock 数据时快速生成 JSON
- API 开发需要测试数据时批量转换表格数据

---

## 🎯 核心功能

### 功能列表
1. **文件上传** - 支持点击上传和拖拽上传 Excel 文件
2. **Excel 解析** - 完整解析 .xlsx 和 .xls 格式文件
3. **多工作表支持** - 自动识别所有 Sheet，可独立查看转换
4. **转换选项** - 灵活配置转换规则（首行作为表头、空值处理）
5. **JSON 预览** - 实时预览转换后的 JSON 结构
6. **数据统计** - 显示工作表的行列数统计信息
7. **一键下载** - 将转换后的 JSON 数据下载到本地

### 功能详情

#### 文件上传
- **实现方式**: 
  - 使用 HTML5 File API 处理文件选择
  - 支持拖拽上传（Drag & Drop API）
  - 文件类型验证（MIME type 和文件扩展名双重校验）
- **用户交互**: 
  - 点击上传区域打开文件选择对话框
  - 拖拽文件到指定区域自动上传
  - 实时显示文件名和大小信息

#### Excel 解析
- **实现方式**: 
  - 使用 SheetJS (xlsx.js) 库进行 Excel 文件解析
  - FileReader API 读取文件为 ArrayBuffer
  - 支持 Excel 97-2003 (.xls) 和 Excel 2007+ (.xlsx) 格式
- **用户交互**: 
  - 自动解析上传的 Excel 文件
  - 提取所有工作表信息
  - 显示解析进度和结果提示

#### 多工作表支持
- **实现方式**: 
  - 遍历 workbook.SheetNames 获取所有工作表
  - 为每个工作表单独转换为 JSON
  - 使用 Tab 标签切换不同工作表
- **用户交互**: 
  - 顶部显示所有工作表标签
  - 点击标签切换查看不同工作表的 JSON 数据
  - 当前选中的标签高亮显示

#### 转换选项
- **首行作为表头**: 
  - 开启时：第一行作为对象的键名（key）
  - 关闭时：使用数字索引（A, B, C...）作为键名
- **包含空值**: 
  - 开启时：空单元格转换为 null
  - 关闭时：空单元格不包含在 JSON 中

#### JSON 预览
- **实现方式**: 
  - 使用 JSON.stringify 格式化输出
  - 代码高亮样式（深色主题 + 等宽字体）
  - 可滚动查看大数据量
- **用户交互**: 
  - 实时显示当前选中工作表的 JSON 数据
  - 美化格式，缩进为 2 个空格
  - 最大高度 600px，超出部分可滚动

#### 数据下载
- **实现方式**: 
  - 使用 Blob API 创建 JSON 文件
  - URL.createObjectURL 生成下载链接
  - 动态创建 `<a>` 标签触发下载
- **下载逻辑**: 
  - 单工作表：下载该工作表的 JSON 数组
  - 多工作表：下载包含所有工作表的 JSON 对象（键为工作表名）

---

## 🔗 外部依赖

### CDN 链接
| 库名称 | 版本 | CDN 链接 | 用途 |
|--------|------|----------|------|
| SheetJS (xlsx) | 0.18.5 | https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js | Excel 文件解析和转换 |

### 依赖说明

#### SheetJS (xlsx.js)
- **为什么选择**: SheetJS 是目前最成熟的 JavaScript Excel 处理库，支持几乎所有 Excel 格式
- **核心功能**: 
  - 解析 Excel 二进制数据
  - 支持 .xls 和 .xlsx 格式
  - 将工作表转换为 JSON 数组
  - 提供丰富的配置选项
- **使用的 API**: 
  - `XLSX.read(data, options)`: 读取 Excel 文件
  - `XLSX.utils.sheet_to_json(worksheet, options)`: 将工作表转为 JSON
- **优势**: 
  - 纯客户端实现，无需服务器
  - 性能优秀，支持大文件
  - 社区活跃，文档完善

---

## 💻 核心实现逻辑

### 技术栈
- **HTML5**: 语义化标签、File API、Drag & Drop API
- **CSS3**: Flexbox/Grid 布局、渐变背景、过渡动画
- **JavaScript (ES6+)**: 箭头函数、模板字符串、解构赋值
- **SheetJS**: Excel 解析和数据转换

### 关键代码实现

#### 1. 文件上传与读取
```javascript
function handleFile(file) {
  // 文件类型验证
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
    showToast('请上传有效的Excel文件', 'error');
    return;
  }
  
  // 使用 FileReader 读取文件
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    workbook = XLSX.read(data, { type: 'array' });
  };
  reader.readAsArrayBuffer(file);
}
```
**实现说明**: 
- 通过 MIME type 和文件扩展名双重验证确保文件合法
- 使用 FileReader 的 `readAsArrayBuffer` 方法读取二进制数据
- 将 ArrayBuffer 转换为 Uint8Array 供 SheetJS 使用

#### 2. Excel 转 JSON
```javascript
function convertToJSON() {
  const firstRowAsHeader = document.getElementById('firstRowAsHeader').checked;
  const includeEmpty = document.getElementById('includeEmpty').checked;
  
  jsonData = {};
  
  // 遍历所有工作表
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    
    // 转换为 JSON
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: firstRowAsHeader ? undefined : 1,
      defval: includeEmpty ? null : undefined,
      blankrows: false
    });
    
    jsonData[sheetName] = data;
  });
}
```
**实现说明**: 
- `header: undefined` 表示使用第一行作为键名
- `header: 1` 表示使用默认列名（A, B, C...）
- `defval: null` 表示空值转换为 null
- `defval: undefined` 表示忽略空值
- `blankrows: false` 跳过空白行

#### 3. 多工作表标签切换
```javascript
function displayPreview() {
  const sheetNames = Object.keys(jsonData);
  
  // 创建工作表标签
  sheetNames.forEach((sheetName, index) => {
    const tab = document.createElement('button');
    tab.className = 'sheet-tab';
    tab.textContent = sheetName;
    tab.onclick = () => showSheet(sheetName);
    
    if (index === 0) {
      tab.classList.add('active');
      currentSheet = sheetName;
    }
    
    sheetTabs.appendChild(tab);
  });
}

function showSheet(sheetName) {
  currentSheet = sheetName;
  
  // 更新标签状态
  const tabs = sheetTabs.querySelectorAll('.sheet-tab');
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.textContent === sheetName);
  });
  
  // 显示 JSON 内容
  const data = jsonData[sheetName];
  jsonContent.textContent = JSON.stringify(data, null, 2);
}
```
**实现说明**: 
- 动态创建标签按钮，每个工作表一个标签
- 使用 `classList.toggle` 切换激活状态
- JSON.stringify 第三个参数设置缩进为 2 个空格

#### 4. JSON 文件下载
```javascript
function downloadJSON() {
  const sheetNames = Object.keys(jsonData);
  let dataToDownload;
  let filename;
  
  // 单工作表：直接下载数组
  // 多工作表：下载对象（包含所有工作表）
  if (sheetNames.length === 1) {
    dataToDownload = jsonData[sheetNames[0]];
    filename = `${sheetNames[0]}_${Date.now()}.json`;
  } else {
    dataToDownload = jsonData;
    filename = `excel_data_${Date.now()}.json`;
  }
  
  // 创建 Blob 并下载
  const jsonString = JSON.stringify(dataToDownload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
}
```
**实现说明**: 
- 根据工作表数量决定下载格式（数组 vs 对象）
- 使用时间戳生成唯一文件名
- 通过 Blob 和 ObjectURL 实现纯前端下载
- 下载后释放 URL 对象避免内存泄漏

### 数据流程
```
用户上传文件 
  → FileReader 读取二进制
    → SheetJS 解析 Excel
      → 提取工作表信息
        → 用户选择转换选项
          → 转换为 JSON
            → 预览显示
              → 下载 JSON 文件
```

### 状态管理
- **currentFile**: 当前上传的文件对象
- **workbook**: SheetJS 解析后的工作簿对象
- **jsonData**: 转换后的 JSON 数据（对象，键为工作表名）
- **currentSheet**: 当前预览的工作表名称

---

## 🎨 用户界面

### 布局结构
1. **头部区域** (`header`)
   - 工具标题和描述
   - 渐变紫色背景，白色文字

2. **上传区域** (`upload-section`)
   - 虚线边框的拖拽上传框
   - 文件信息显示（文件名、大小、清除按钮）

3. **工具栏** (`toolbar`)
   - 转换选项（复选框）
   - 操作按钮（转换、下载）

4. **预览区域** (`preview-section`)
   - 工作表标签切换
   - JSON 代码预览框（深色主题）
   - 数据统计信息

5. **空状态** (`empty-state`)
   - 未上传文件时显示的提示信息

### 交互设计

#### 上传交互
- **点击上传**: 点击上传区域打开文件选择框
- **拖拽上传**: 拖拽文件到上传区域，边框变绿色
- **拖拽悬停**: 拖拽时上传框高亮显示
- **文件验证**: 非 Excel 文件弹出错误提示

#### 转换交互
- **选项配置**: 转换前可配置首行表头和空值处理
- **按钮状态**: 上传文件后启用"转换"按钮
- **转换反馈**: 转换成功显示成功提示
- **预览显示**: 自动显示第一个工作表的 JSON

#### 预览交互
- **标签切换**: 点击工作表标签切换不同数据
- **代码滚动**: 大数据量时可在预览框内滚动
- **统计信息**: 实时显示当前工作表的行列数

#### 下载交互
- **下载按钮**: 转换后启用"下载"按钮
- **文件命名**: 根据工作表名称和时间戳自动命名
- **下载反馈**: 下载成功显示提示消息

### 响应式设计

#### 桌面端 (> 768px)
- 最大宽度 1400px，居中显示
- 工具栏横向布局，元素并排
- JSON 预览框最大高度 600px
- 上传区域 padding 40px

#### 移动端 (≤ 768px)
- 头部标题字号缩小为 24px
- 上传区域 padding 减小为 20px
- 工具栏改为纵向布局，元素垂直排列
- 工具组元素占满宽度
- JSON 预览框最大高度 400px
- 按钮居中对齐

### 视觉设计
- **主题色**: 紫色渐变 (#667eea → #764ba2)
- **卡片**: 白色背景，20px 圆角，阴影效果
- **按钮**: 渐变紫色主按钮，绿色成功按钮，红色清除按钮
- **代码预览**: 深色主题 (#282c34)，等宽字体
- **Toast 提示**: 固定定位右上角，淡入淡出动画

---

## 📝 使用说明

### 基本使用

**方式一：点击上传**
1. 点击上传区域（虚线框）
2. 在弹出的文件选择框中选择 Excel 文件
3. 点击"转换为JSON"按钮
4. 查看 JSON 预览
5. 点击"下载JSON"保存文件

**方式二：拖拽上传**
1. 将 Excel 文件拖拽到上传区域
2. 文件自动上传并显示信息
3. 点击"转换为JSON"按钮
4. 查看 JSON 预览
5. 点击"下载JSON"保存文件

### 转换选项说明

#### 首行作为表头（默认开启）
- **开启**: 
  ```json
  [
    { "姓名": "张三", "年龄": "25", "城市": "北京" },
    { "姓名": "李四", "年龄": "30", "城市": "上海" }
  ]
  ```
- **关闭**: 
  ```json
  [
    { "A": "姓名", "B": "年龄", "C": "城市" },
    { "A": "张三", "B": "25", "C": "北京" },
    { "A": "李四", "B": "30", "C": "上海" }
  ]
  ```

#### 包含空值（默认关闭）
- **开启**: 空单元格转换为 `null`
  ```json
  [
    { "姓名": "张三", "年龄": null, "城市": "北京" }
  ]
  ```
- **关闭**: 空单元格不包含在 JSON 中
  ```json
  [
    { "姓名": "张三", "城市": "北京" }
  ]
  ```

### 多工作表处理

**单工作表 Excel**
- 下载的 JSON 文件是一个数组
- 文件名：`工作表名_时间戳.json`

**多工作表 Excel**
- 下载的 JSON 文件是一个对象
- 每个工作表作为对象的一个属性
- 文件名：`excel_data_时间戳.json`
- 结构示例：
  ```json
  {
    "Sheet1": [...],
    "Sheet2": [...],
    "销售数据": [...]
  }
  ```

### 使用示例

**示例 1: 用户数据表**
```
Excel 表格:
| 姓名 | 年龄 | 邮箱 |
|------|------|------|
| 张三 | 25   | zhang@example.com |
| 李四 | 30   | li@example.com |

转换结果:
[
  {
    "姓名": "张三",
    "年龄": 25,
    "邮箱": "zhang@example.com"
  },
  {
    "姓名": "李四",
    "年龄": 30,
    "邮箱": "li@example.com"
  }
]
```

**示例 2: 产品数据表**
```
Excel 表格 (多工作表):
- 产品信息 Sheet
- 库存信息 Sheet

转换结果:
{
  "产品信息": [
    { "产品ID": "P001", "名称": "笔记本", "价格": 5999 }
  ],
  "库存信息": [
    { "仓库": "A", "数量": 100 }
  ]
}
```

### 常见问题

**Q: 支持哪些 Excel 格式？**
A: 支持 .xlsx (Excel 2007+) 和 .xls (Excel 97-2003) 格式。

**Q: 文件大小有限制吗？**
A: 理论上没有硬性限制，但建议不超过 10MB，过大文件可能导致浏览器性能问题。

**Q: 数据会上传到服务器吗？**
A: 不会，所有处理都在浏览器本地完成，数据不会离开您的设备。

**Q: 如何处理合并单元格？**
A: 合并单元格只会保留第一个单元格的值，其他单元格为空。

**Q: 数字格式会丢失吗？**
A: 数字会保留为数字类型，日期会转换为数字或字符串（取决于 Excel 中的格式）。

---

## 🔧 技术细节

### API 使用

#### HTML5 File API
- **FileReader**: 读取文件内容
  - `readAsArrayBuffer()`: 将文件读取为 ArrayBuffer
  - `onload`: 读取完成回调
  - `onerror`: 读取错误回调

#### Drag & Drop API
- **dragover**: 拖拽悬停事件
- **dragleave**: 拖拽离开事件
- **drop**: 放置文件事件
- **dataTransfer.files**: 获取拖拽的文件列表

#### Blob API
- `new Blob()`: 创建二进制对象
- `URL.createObjectURL()`: 生成临时 URL
- `URL.revokeObjectURL()`: 释放 URL 资源

#### SheetJS API
- `XLSX.read(data, options)`: 解析 Excel 数据
  - `type: 'array'`: 输入数据类型为 ArrayBuffer
- `XLSX.utils.sheet_to_json(worksheet, options)`: 工作表转 JSON
  - `header`: 表头处理方式
  - `defval`: 空值默认值
  - `blankrows`: 是否包含空行

### 性能优化

#### 大文件处理
- 使用 ArrayBuffer 而不是 Base64 读取文件，减少内存占用
- JSON 预览限制最大高度，避免渲染过多 DOM
- 使用 `textContent` 而不是 `innerHTML` 提升性能

#### 内存管理
- 下载后立即释放 ObjectURL
- 清除文件时重置所有全局变量
- 避免重复解析，缓存 workbook 对象

#### 用户体验
- 文件上传后立即显示信息，给予反馈
- 转换和下载操作显示 Toast 提示
- 按钮状态管理，避免误操作
- 响应式设计，适配各种设备

### 浏览器兼容性

| 浏览器 | 最低版本 | 支持情况 | 说明 |
|--------|---------|---------|------|
| Chrome | 51+ | ✅ 完全支持 | 推荐使用 |
| Firefox | 54+ | ✅ 完全支持 | 推荐使用 |
| Safari | 10+ | ✅ 完全支持 | macOS/iOS |
| Edge | 79+ | ✅ 完全支持 | Chromium 内核 |
| IE | - | ❌ 不支持 | 不支持 ES6+ 语法 |

**兼容性要求**:
- 支持 ES6 语法（箭头函数、模板字符串等）
- 支持 File API 和 FileReader
- 支持 Drag & Drop API
- 支持 Blob 和 URL API

---

## 🐛 已知问题

- [ ] 包含图片的 Excel 文件，图片数据会丢失
- [ ] 日期格式可能转换为数字（Excel 内部存储格式）
- [ ] 公式单元格只保留计算结果，不保留公式本身
- [ ] 特殊格式（货币、百分比）可能丢失格式信息
- [ ] 非常大的文件（>50MB）可能导致浏览器卡顿

---

## 🚀 未来计划

### 功能增强
- [ ] 支持 JSON 转 Excel（反向转换）
- [ ] 支持 CSV 格式导入导出
- [ ] 添加数据过滤功能（按列筛选）
- [ ] 支持数据类型推断（字符串、数字、日期、布尔）
- [ ] 添加列映射功能（自定义键名）
- [ ] 支持批量转换（多文件）

### 体验优化
- [ ] 添加进度条显示（大文件解析）
- [ ] 支持键盘快捷键（Ctrl+V 粘贴、Ctrl+S 下载等）
- [ ] 添加数据验证规则配置
- [ ] 支持预览限制（只显示前 N 行）
- [ ] 添加深色模式切换

### 性能优化
- [ ] 使用 Web Worker 处理大文件解析
- [ ] 虚拟滚动优化大数据量预览
- [ ] 分片下载大 JSON 文件
- [ ] 压缩 JSON 输出（去除空格）

---

## 📊 代码统计

- **总行数**: 716 行
- **HTML**: 约 120 行
- **CSS**: 约 290 行
- **JavaScript**: 约 300 行
- **注释**: 约 6 行

### 代码结构
```
├── HTML 结构 (120 行)
│   ├── 头部 (20 行)
│   ├── 上传区域 (30 行)
│   ├── 工具栏 (30 行)
│   ├── 预览区域 (25 行)
│   └── Toast 提示 (15 行)
│
├── CSS 样式 (290 行)
│   ├── 基础样式 (40 行)
│   ├── 布局样式 (80 行)
│   ├── 组件样式 (120 行)
│   └── 响应式样式 (50 行)
│
└── JavaScript 逻辑 (300 行)
    ├── 变量定义 (20 行)
    ├── 事件监听 (40 行)
    ├── 文件处理 (60 行)
    ├── Excel 转换 (80 行)
    ├── 预览显示 (50 行)
    └── 工具函数 (50 行)
```

---

## 🔍 关键词

`Excel`, `JSON`, `转换`, `数据处理`, `SheetJS`, `文件上传`, `拖拽上传`, `多工作表`, `单文件HTML`, `无构建`, `浏览器端`, `数据隐私`

---

## 📚 相关资源

### 官方文档
- [SheetJS 官方文档](https://docs.sheetjs.com/)
- [SheetJS GitHub](https://github.com/SheetJS/sheetjs)
- [File API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [Drag and Drop API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [Blob API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

### 相关工具
- [JSON Formatter](./json-formatter.html) - JSON 格式化工具
- [Base64 Codec](./base64-codec.html) - Base64 编解码工具

### 设计理念
- [Simon Willison 单文件哲学](https://simonwillison.net/2025/Dec/10/html-tools/)

---

## 💡 开发笔记

### 为什么选择 SheetJS？
1. **功能完善**: 支持几乎所有 Excel 格式和功能
2. **纯客户端**: 无需服务器，保护用户隐私
3. **性能优秀**: 能够处理大型 Excel 文件
4. **社区支持**: 活跃的社区和详细的文档
5. **MIT 许可**: 开源免费，可商用

### 设计考虑
1. **数据隐私**: 所有数据在浏览器本地处理，不上传服务器
2. **易用性**: 支持拖拽上传，操作简单直观
3. **灵活性**: 提供转换选项，满足不同需求
4. **兼容性**: 支持主流浏览器，响应式设计
5. **反馈及时**: 每个操作都有明确的反馈提示

### 技术亮点
1. **零依赖构建**: 单文件实现，无需 npm、webpack 等工具
2. **离线可用**: 下载后可在本地直接使用（需要 CDN 连接）
3. **类型安全**: 文件类型双重验证，防止错误上传
4. **内存管理**: 及时释放资源，避免内存泄漏
5. **错误处理**: 完善的错误捕获和用户提示

---

*文档生成日期: 2025-01-25*  
*遵循单文件 HTML 工具开发规范*