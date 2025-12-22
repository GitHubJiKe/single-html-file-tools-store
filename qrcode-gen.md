# 二维码生成器

**文件名**: `qrcode-gen.html`  
**创建日期**: 2025-12-19  
**最后更新**: 2025-12-19  
**代码行数**: 151 行  

---

## 📋 工具简介

二维码生成器，将文本或 URL 快速转换为二维码图片，支持在线预览、一键复制和下载，适用于分享链接、名片、WiFi 密码等场景。

---

## 🎯 核心功能

### 功能列表
1. **文本转二维码** - 将任意文本转换为二维码
2. **实时预览** - 输入文本后实时生成二维码
3. **一键复制** - 复制二维码图片到剪贴板
4. **下载图片** - 下载二维码为 PNG 图片
5. **尺寸调节** - 支持调整二维码大小

### 功能详情

#### 文本转二维码
- **实现方式**: 使用 qrious 库将文本编码为二维码
- **用户交互**: 在文本框输入内容，自动生成二维码

#### 实时预览
- **实现方式**: 监听文本框输入事件，实时更新二维码
- **用户交互**: 输入即生成，无需点击按钮

#### 一键复制
- **实现方式**: 使用 Canvas toBlob() 和 Clipboard API
- **用户交互**: 点击"复制"按钮，二维码图片复制到剪贴板

#### 下载图片
- **实现方式**: Canvas toDataURL() 转换为 PNG，创建下载链接
- **用户交互**: 点击"下载"按钮，保存为 PNG 文件

---

## 🔗 外部依赖

### CDN 链接
| 库名称 | 版本 | CDN 链接 | 用途 |
|--------|------|----------|------|
| qrious | 4.0.2 | https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js | 二维码生成库 |

### 依赖说明
- **qrious**: 一个轻量级的 JavaScript 二维码生成库，基于 Canvas 实现。选择这个库是因为它体积小（约 10KB）、API 简单、支持自定义尺寸和颜色，非常适合单文件 HTML 工具。

---

## 💻 核心实现逻辑

### 技术栈
- HTML5
- CSS3
- JavaScript (ES6+)
- Canvas API
- qrious 库
- Clipboard API

### 关键代码实现

#### 1. 二维码生成
```javascript
const qr = new QRious({
  element: document.getElementById('qrcode'),
  value: text,
  size: 256,
  level: 'H'  // 错误纠正级别：L/M/Q/H
});
```
**实现说明**: 使用 qrious 库创建二维码实例，指定 Canvas 元素、文本内容、尺寸和错误纠正级别。错误纠正级别 'H' 表示最高级别，可以容忍约 30% 的损坏。

#### 2. 实时生成
```javascript
textarea.addEventListener('input', function() {
  const text = this.value.trim();
  if (text) {
    qr.value = text;  // 更新二维码内容
  } else {
    // 清空二维码
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});
```
**实现说明**: 监听文本框的 input 事件，当内容变化时更新二维码的 value 属性，qrious 会自动重新渲染。

#### 3. 复制到剪贴板
```javascript
canvas.toBlob(function(blob) {
  const item = new ClipboardItem({ 'image/png': blob });
  navigator.clipboard.write([item])
    .then(() => alert('二维码已复制到剪贴板'))
    .catch(err => alert('复制失败：' + err));
});
```
**实现说明**: 使用 Canvas 的 toBlob() 方法将二维码转换为 Blob 对象，然后使用 Clipboard API 的 write() 方法写入剪贴板。

#### 4. 下载图片
```javascript
const dataURL = canvas.toDataURL('image/png');
const a = document.createElement('a');
a.href = dataURL;
a.download = 'qrcode.png';
a.click();
```
**实现说明**: 使用 Canvas 的 toDataURL() 方法将二维码转换为 base64 编码的 PNG 图片，创建一个临时的 `<a>` 标签触发下载。

### 数据流程
```
用户输入文本 → qrious 编码 → Canvas 渲染 → 显示二维码
                                    ↓
                            复制/下载操作
```

### 状态管理
- **qr**: qrious 实例，管理二维码的生成和更新
- **canvas**: Canvas 元素，存储二维码图像
- **text**: 当前输入的文本内容

---

## 🎨 用户界面

### 布局结构
- **顶部**: 标题
- **输入区域**: 文本框，用于输入要转换的文本
- **操作按钮**: 复制、下载
- **预览区域**: Canvas 元素，显示生成的二维码

### 交互设计
- **输入文本**: 在文本框输入，实时生成二维码
- **复制**: 点击按钮，复制二维码图片到剪贴板
- **下载**: 点击按钮，下载二维码为 PNG 文件

### 响应式设计
- **桌面端**: 标准布局，二维码居中显示
- **移动端**: 自适应宽度，按钮和文本框占满宽度

---

## 📝 使用说明

### 基本使用
1. 在文本框中输入要转换的文本或 URL
2. 二维码自动生成并显示
3. 点击"复制"按钮，复制到剪贴板
4. 或点击"下载"按钮，保存为 PNG 文件

### 高级功能
- **URL 分享**: 输入网址，生成二维码，方便手机扫码访问
- **WiFi 密码**: 输入 WiFi 密码，生成二维码，扫码连接
- **名片信息**: 输入联系方式，生成二维码名片

### 使用示例

**示例 1: 分享网址**
```
输入: https://example.com
操作: 自动生成二维码
结果: 用手机扫码即可访问该网址
```

**示例 2: WiFi 密码分享**
```
输入: WIFI:T:WPA;S:MyNetwork;P:MyPassword;;
操作: 生成二维码
结果: 扫码自动连接 WiFi（部分设备支持）
```

**示例 3: 文本分享**
```
输入: 这是一段要分享的文本
操作: 生成二维码，点击下载
结果: 保存为 qrcode.png 文件
```

---

## 🔧 技术细节

### API 使用
- **qrious API**: 二维码生成
  - `new QRious()`: 创建二维码实例
  - `value`: 设置二维码内容
  - `size`: 设置二维码尺寸
  - `level`: 设置错误纠正级别
  
- **Canvas API**: 图像处理
  - `toBlob()`: 转换为 Blob 对象
  - `toDataURL()`: 转换为 base64 字符串
  
- **Clipboard API**: 剪贴板操作
  - `navigator.clipboard.write()`: 写入剪贴板

### 性能优化
- qrious 库体积小（约 10KB），加载快
- 使用 Canvas 渲染，性能优秀
- 实时生成采用事件监听，无需轮询

### 浏览器兼容性
| 浏览器 | 最低版本 | 支持情况 |
|--------|---------|---------|
| Chrome | 63+ | ✅ 完全支持 |
| Firefox | 53+ | ✅ 完全支持 |
| Safari | 13.1+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |

**注意**: 
- Clipboard API 需要 HTTPS 或 localhost 环境
- 部分旧版浏览器可能不支持 ClipboardItem

---

## 🐛 已知问题

- [ ] Clipboard API 在 HTTP 环境下不可用（需要 HTTPS）
- [ ] 超长文本（> 2000 字符）可能导致二维码过于复杂，难以扫描

---

## 🚀 未来计划

- [ ] 添加二维码颜色自定义
- [ ] 支持添加 Logo 到二维码中心
- [ ] 添加二维码尺寸调节滑块
- [ ] 支持批量生成二维码
- [ ] 添加二维码扫描功能（使用摄像头）
- [ ] 支持更多二维码格式（vCard、WiFi 等）

---

## 📊 代码统计

- **总行数**: 151 行
- **HTML**: ~25 行
- **CSS**: ~60 行
- **JavaScript**: ~65 行
- **注释**: ~1 行

**代码分布**:
- 样式定义: 40%
- 二维码生成: 30%
- 事件处理: 20%
- 复制/下载: 10%

---

## 🔍 关键词

`二维码`, `QR Code`, `生成器`, `qrious`, `图片生成`, `实用工具`, `单文件HTML`, `无构建`

---

## 📚 相关资源

- [Simon Willison 单文件哲学](https://simonwillison.net/2025/Dec/10/html-tools/)
- [qrious 库文档](https://github.com/neocotic/qrious)
- [二维码规范](https://www.qrcode.com/en/)
- [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

---

*文档生成日期: 2025-12-22*  
*遵循单文件 HTML 工具开发规范*