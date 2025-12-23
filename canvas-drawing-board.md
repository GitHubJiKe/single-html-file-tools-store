# Canvas 在线画图工具

**文件名**: `canvas-drawing-board.html`  
**创建日期**: 2025-12-22  
**最后更新**: 2025-12-22  
**代码行数**: 873 行  

---

## 📋 工具简介

功能完整的 Canvas 在线画图工具，支持画笔/橡皮擦切换、完善的撤销重做功能、背景色和画笔颜色调节、画笔粗细设置、图片上传和调整、一键清空和下载图片，完美兼容移动端触摸操作。

---

## 🎯 核心功能

### 功能列表
1. **画笔工具** - 自由绘画，支持鼠标和触摸
2. **橡皮擦工具** - 擦除画布内容
3. **撤销重做** - 支持最多 50 步撤销和重做
4. **颜色设置** - 自定义背景色和画笔颜色
5. **画笔粗细** - 1-50px 可调节
6. **图片上传** - 上传图片到画布进行涂鸦 ⭐ 新增
7. **图片调整** - 调整图片大小和位置 ⭐ 新增
8. **清空画布** - 一键清空，带确认提示
9. **下载图片** - 保存为 PNG 格式

### 功能详情

#### 画笔工具
- **实现方式**: 使用 Canvas 2D API，监听鼠标和触摸事件
- **用户交互**: 点击"画笔"按钮，在画布上拖拽绘画

#### 橡皮擦工具
- **实现方式**: 使用 `destination-out` 合成模式擦除内容
- **用户交互**: 点击"橡皮擦"按钮，在画布上拖拽擦除

#### 撤销重做功能
- **实现方式**: 基于历史记录栈，保存每次绘画后的画布状态
- **用户交互**: 点击撤销/重做按钮，或使用快捷键 Ctrl+Z / Ctrl+Y

#### 颜色设置
- **实现方式**: HTML5 color input 控件
- **用户交互**: 点击颜色选择器，选择背景色或画笔颜色

#### 画笔粗细
- **实现方式**: number input 控件，动态设置 lineWidth
- **用户交互**: 输入数字或使用上下箭头调节 1-50px

#### 清空画布
- **实现方式**: 填充背景色覆盖整个画布
- **用户交互**: 点击"清空"按钮，确认后清空

#### 图片上传
- **实现方式**: 使用 FileReader API 读取本地图片文件
- **用户交互**: 点击"上传图片"按钮，选择图片文件

#### 图片调整
- **实现方式**: 拖拽移动图片位置，滑块调整图片大小（10%-200%）
- **用户交互**: 拖动图片移动，拖动滑块缩放，点击确认或取消

#### 下载图片
- **实现方式**: Canvas toDataURL() 转换为 PNG，创建下载链接
- **用户交互**: 点击"下载"按钮，自动下载 PNG 文件

---

## 🔗 外部依赖

### CDN 链接
无外部依赖，完全使用原生 JavaScript 和 Canvas API 实现。

### 依赖说明
- **Canvas 2D API**: 用于绘画功能
- **原生事件系统**: 处理鼠标和触摸事件
- **原生 DOM API**: 管理 UI 交互

---

## 💻 核心实现逻辑

### 技术栈
- HTML5
- CSS3 (Flexbox)
- JavaScript (ES6+)
- Canvas 2D API
- Touch Events API

### 关键代码实现

#### 1. 图片上传和调整 ⭐ 新增
```javascript
// 上传图片
uploadImageInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // 保存当前画布状态
      tempCanvasState = canvas.toDataURL();
      
      // 设置图片
      uploadedImage = img;
      originalImageWidth = img.width;
      originalImageHeight = img.height;
      
      // 计算初始位置和大小（居中显示，适应画布）
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1);
      imageWidth = img.width * scale;
      imageHeight = img.height * scale;
      imageX = (canvas.width - imageWidth) / 2;
      imageY = (canvas.height - imageHeight) / 2;
      
      // 进入图片调整模式
      isImageMode = true;
      imageControlPanel.style.display = 'block';
      
      // 绘制图片
      drawImageOnCanvas();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// 图片缩放
imageScale.addEventListener('input', function() {
  const scale = this.value / 100;
  // 保持中心点不变
  const centerX = imageX + imageWidth / 2;
  const centerY = imageY + imageHeight / 2;
  // 计算新的宽高
  imageWidth = originalImageWidth * scale * ...;
  imageHeight = originalImageHeight * scale * ...;
  // 重新计算位置
  imageX = centerX - imageWidth / 2;
  imageY = centerY - imageHeight / 2;
  drawImageOnCanvas();
});

// 图片拖拽
canvas.addEventListener('mousedown', function(e) {
  if (!isImageMode) return;
  // 检查是否点击在图片上
  if (x >= imageX && x <= imageX + imageWidth && 
      y >= imageY && y <= imageY + imageHeight) {
    isDraggingImage = true;
    dragStartX = x - imageX;
    dragStartY = y - imageY;
  }
});
```
**实现说明**: 使用 FileReader API 读取本地图片文件，转换为 base64 格式。图片上传后进入调整模式，保存当前画布状态以便取消操作。支持拖拽移动图片位置和滑块调整大小（10%-200%），缩放时保持图片中心点不变。确认后将图片固定到画布，可继续绘画。

#### 2. 历史记录管理（撤销重做）
```javascript
// 历史记录管理
let history = [];
let historyStep = -1;
const MAX_HISTORY = 50;

// 保存画布状态
function saveState() {
  // 移除当前步骤之后的所有历史记录
  if (historyStep < history.length - 1) {
    history = history.slice(0, historyStep + 1);
  }
  
  // 保存当前状态
  const imageData = canvas.toDataURL();
  history.push(imageData);
  
  // 限制历史记录数量
  if (history.length > MAX_HISTORY) {
    history.shift();
  } else {
    historyStep++;
  }
  
  updateUndoRedoButtons();
}

// 撤销
function undo() {
  if (historyStep > 0) {
    restoreState(historyStep - 1);
  }
}

// 重做
function redo() {
  if (historyStep < history.length - 1) {
    restoreState(historyStep + 1);
  }
}
```
**实现说明**: 使用数组作为历史记录栈，每次绘画结束后保存画布的 base64 图像数据。撤销时回退到上一个状态，重做时前进到下一个状态。限制最多保存 50 步历史记录以控制内存占用。

#### 3. 橡皮擦实现
```javascript
if (currentTool === 'pen') {
  ctx.strokeStyle = penColorInput.value;
  ctx.globalCompositeOperation = 'source-over';
} else if (currentTool === 'eraser') {
  ctx.strokeStyle = bgColorInput.value;
  ctx.globalCompositeOperation = 'destination-out';
}
```
**实现说明**: 橡皮擦使用 `destination-out` 合成模式，该模式会擦除目标区域的内容。这样可以实现真正的擦除效果，而不是简单地用背景色覆盖。

#### 4. 触摸事件支持
```javascript
function startDrawing(e) {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  if (e.type.includes('touch')) {
    lastX = (e.touches[0].clientX - rect.left) * scaleX;
    lastY = (e.touches[0].clientY - rect.top) * scaleY;
  } else {
    lastX = (e.clientX - rect.left) * scaleX;
    lastY = (e.clientY - rect.top) * scaleY;
  }
}

// 触摸事件监听
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing);
```
**实现说明**: 统一处理鼠标和触摸事件，通过检测事件类型来获取正确的坐标。使用 `passive: false` 允许阻止默认行为，防止页面滚动。计算缩放比例确保在不同屏幕尺寸下坐标准确。

#### 5. 响应式画布
```javascript
function initCanvas() {
  const containerWidth = canvas.parentElement.clientWidth - 40;
  const maxWidth = 800;
  const maxHeight = 600;
  
  if (window.innerWidth <= 768) {
    canvas.width = Math.min(containerWidth, maxWidth);
    canvas.height = Math.min(canvas.width * 0.75, maxHeight);
  } else {
    canvas.width = maxWidth;
    canvas.height = maxHeight;
  }
  
  // 填充背景色
  ctx.fillStyle = bgColorInput.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 保存初始状态
  saveState();
}
```
**实现说明**: 根据屏幕宽度动态调整画布尺寸。移动端使用容器宽度，保持 4:3 比例。桌面端使用固定尺寸 800x600。

#### 6. 键盘快捷键
```javascript
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();  // Ctrl+Shift+Z
      } else {
        undo();  // Ctrl+Z
      }
    } else if (e.key === 'y' || e.key === 'Y') {
      e.preventDefault();
      redo();  // Ctrl+Y
    }
  }
});
```
**实现说明**: 支持标准的撤销重做快捷键。Ctrl+Z 撤销，Ctrl+Y 或 Ctrl+Shift+Z 重做。兼容 Mac 的 Cmd 键。

### 数据流程

**绘画流程:**
```
用户操作（鼠标/触摸） → 获取坐标 → Canvas 绘制 → 停止绘画 → 保存状态到历史记录
```

**撤销重做流程:**
```
点击撤销/重做 → 从历史记录获取状态 → 恢复画布 → 更新按钮状态
```

**下载流程:**
```
点击下载 → Canvas.toDataURL() → 创建 <a> 标签 → 触发下载 → 清理
```

### 状态管理
- **isDrawing**: 是否正在绘画（boolean）
- **lastX, lastY**: 上一个绘画点的坐标（number）
- **currentTool**: 当前工具（'pen' | 'eraser'）
- **history**: 历史记录数组（Array<string>）
- **historyStep**: 当前历史记录位置（number）

---

## 🎨 用户界面

### 布局结构
- **顶部**: 标题
- **工具栏**: 
  - 工具选择（画笔/橡皮擦）
  - 颜色选择（背景色/画笔色）
  - 画笔粗细调节
  - 操作按钮（撤销/重做/清空/下载）
- **画布容器**: Canvas 元素，居中显示
- **状态消息**: 操作反馈提示

### 交互设计
- **工具切换**: 点击按钮，当前工具高亮显示
- **绘画**: 鼠标拖拽或手指触摸绘画
- **颜色选择**: 点击颜色选择器，弹出系统颜色面板
- **撤销重做**: 点击按钮或使用快捷键
- **清空**: 点击按钮，弹出确认对话框
- **下载**: 点击按钮，自动下载 PNG 文件

### 响应式设计
- **桌面端**（> 768px）
  - 画布尺寸：800x600px
  - 工具栏：多行布局，按钮横向排列
  
- **移动端**（≤ 768px）
  - 画布尺寸：自适应容器宽度，保持 4:3 比例
  - 工具栏：紧凑布局，按钮和输入框缩小
  - 触摸优化：按钮最小 44px，防止误触

---

## 📝 使用说明

### 基本使用
1. 打开工具，默认选中画笔工具
2. 在画布上拖拽鼠标或手指绘画
3. 使用颜色选择器调整画笔颜色
4. 调节画笔粗细（1-50px）
5. 点击"下载"按钮保存图片

### 高级功能

#### 撤销重做
- **撤销**: 点击"↶ 撤销"按钮或按 Ctrl+Z
- **重做**: 点击"↷ 重做"按钮或按 Ctrl+Y
- **支持**: 最多 50 步撤销历史

#### 橡皮擦
- 点击"🧹 橡皮擦"按钮切换到橡皮擦模式
- 在画布上拖拽擦除内容
- 橡皮擦粗细与画笔粗细相同

#### 图片上传和调整 ⭐ 新增
- **上传图片**: 点击"📷 上传图片"按钮，选择本地图片文件
- **调整位置**: 拖动图片可移动到任意位置
- **调整大小**: 拖动滑块调整图片大小（10%-200%）
- **确认添加**: 点击"✓ 确认"将图片固定到画布
- **取消操作**: 点击"✕ 取消"恢复原画布状态
- **继续绘画**: 确认后可在图片上继续涂鸦

#### 背景色更改
- 点击"背景色"颜色选择器
- 选择新颜色，画布背景自动更新
- 已绘制的内容不受影响

#### 清空画布
- 点击"🗑️ 清空"按钮
- 确认后清空画布，填充当前背景色
- 注意：清空操作会保存到历史记录，可以撤销

### 使用示例

**示例 1: 绘制简单图形**
```
场景: 绘制一个笑脸
操作:
1. 选择黑色画笔，粗细 5px
2. 绘制圆形轮廓
3. 绘制两个眼睛
4. 绘制嘴巴
5. 点击"下载"保存
结果: 下载 drawing-[时间戳].png 文件
```

**示例 2: 使用橡皮擦修正**
```
场景: 绘制时出错，需要修正
操作:
1. 绘制一条线，但画歪了
2. 点击"橡皮擦"按钮
3. 擦除错误的部分
4. 切换回"画笔"
5. 重新绘制正确的线条
结果: 图形修正完成
```

**示例 3: 撤销重做**
```
场景: 尝试不同的绘画效果
操作:
1. 绘制一个图形
2. 觉得不满意，按 Ctrl+Z 撤销
3. 重新绘制
4. 想看之前的效果，按 Ctrl+Y 重做
5. 对比后选择最终版本
结果: 找到最满意的效果
```

**示例 4: 移动端绘画**
```
场景: 在手机上绘画
操作:
1. 打开工具，画布自动适配屏幕
2. 用手指在屏幕上绘画
3. 双指缩放查看细节（如果需要）
4. 点击"下载"保存到相册
结果: 在移动端完成绘画创作
```

**示例 5: 图片上传和涂鸦** ⭐ 新增
```
场景: 在照片上添加标注和涂鸦
操作:
1. 点击"📷 上传图片"按钮
2. 选择一张照片（如风景照）
3. 图片自动居中显示，出现调整面板
4. 拖动图片调整位置，拖动滑块调整大小
5. 点击"✓ 确认"固定图片
6. 切换到画笔工具，在照片上添加标注
7. 点击"下载"保存编辑后的图片
结果: 照片上添加了手绘标注
```

**示例 6: 图片拼贴创作** ⭐ 新增
```
场景: 创作图片拼贴作品
操作:
1. 设置背景色为浅灰色
2. 上传第一张图片，调整到左上角，缩小到 50%
3. 点击"✓ 确认"
4. 再次上传第二张图片，调整到右下角
5. 点击"✓ 确认"
6. 使用画笔在图片之间绘制连接线
7. 添加文字标注（手绘）
8. 下载最终作品
结果: 完成一幅图片拼贴创意作品
```

---

## 🔧 技术细节

### API 使用
- **Canvas 2D API**: 绘画功能
  - `getContext('2d')`: 获取 2D 渲染上下文
  - `beginPath()`, `moveTo()`, `lineTo()`, `stroke()`: 绘制路径
  - `fillRect()`: 填充背景色
  - `toDataURL()`: 导出画布为 base64 图片
  - `getImageData()`, `putImageData()`: 获取和设置像素数据
  - `globalCompositeOperation`: 设置合成模式（橡皮擦）
  
- **Touch Events API**: 触摸支持
  - `touchstart`, `touchmove`, `touchend`: 触摸事件
  - `touches[0]`: 获取第一个触摸点
  
- **Keyboard Events API**: 快捷键
  - `keydown`: 键盘按下事件
  - `ctrlKey`, `metaKey`, `shiftKey`: 修饰键检测

### 性能优化
- 历史记录限制为 50 步，避免内存溢出
- 使用 `toDataURL()` 而不是 `getImageData()` 保存状态，减少内存占用
- 窗口大小变化时使用防抖（300ms），避免频繁重绘
- 触摸事件使用 `passive: false`，提高响应速度
- 使用 `lineCap: 'round'` 和 `lineJoin: 'round'` 提升绘画质量

### 浏览器兼容性
| 浏览器 | 最低版本 | 支持情况 |
|--------|---------|---------|
| Chrome | 32+ | ✅ 完全支持 |
| Firefox | 26+ | ✅ 完全支持 |
| Safari | 7+ | ✅ 完全支持 |
| Edge | 12+ | ✅ 完全支持 |
| Mobile Safari | iOS 7+ | ✅ 完全支持（触摸） |
| Chrome Mobile | Android 4.4+ | ✅ 完全支持（触摸） |

**注意**: 
- Canvas API 在所有现代浏览器中都有良好支持
- Touch Events API 在移动设备上支持良好
- 建议使用 HTTPS 以获得最佳体验

---

## 🐛 已知问题

- [ ] 快速连续绘画可能出现轻微延迟（移动端）
- [ ] 历史记录占用内存较大（50 步约 10-20MB）
- [ ] 窗口大小变化时画布会重置（已保存内容会恢复）

---

## 🚀 未来计划

- [ ] 添加更多绘画工具（矩形、圆形、直线）
- [ ] 支持图层功能
- [ ] 添加滤镜效果
- [ ] 支持导出为不同格式（JPG、SVG）
- [ ] 添加画笔预设（铅笔、毛笔、喷枪）
- [ ] 支持图片导入作为背景
- [ ] 添加文字工具
- [ ] 支持选区和移动
- [ ] 优化历史记录存储（使用 IndexedDB）
- [ ] 添加自动保存功能

---

## 📊 代码统计

- **总行数**: 873 行（+329 行）
- **HTML**: ~70 行
- **CSS**: ~240 行
- **JavaScript**: ~560 行
- **注释**: ~3 行

**代码分布**:
- 样式定义: 27%
- 绘画逻辑: 25%
- 图片上传和调整: 20% ⭐ 新增
- 历史记录管理: 15%
- 事件处理: 10%
- 工具切换: 3%

**新增功能代码**:
- 图片上传: ~80 行
- 图片调整: ~100 行
- 图片拖拽: ~70 行
- 控制面板: ~60 行
- CSS 样式: ~60 行

---

## 🔍 关键词

`Canvas`, `画图`, `绘画`, `橡皮擦`, `撤销重做`, `图片上传`, `图片调整`, `涂鸦`, `触摸支持`, `响应式`, `单文件HTML`, `无构建`, `原生API`

---

## 📚 相关资源

- [Simon Willison 单文件哲学](https://simonwillison.net/2025/Dec/10/html-tools/)
- [Canvas API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Touch Events API](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Canvas 教程](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

---

## 🎯 与其他工具的对比

### vs Canvas GIF 制作工具
| 特性 | Canvas 画图工具 | Canvas GIF 制作 |
|------|----------------|----------------|
| 主要用途 | 单张图片绘画 | 多张图片合成动图 |
| 撤销重做 | ✅ 完整支持（50步） | ❌ 不支持 |
| 橡皮擦 | ✅ 支持 | ❌ 不支持 |
| 九宫格 | ❌ 不支持 | ✅ 支持 |
| GIF 生成 | ❌ 不支持 | ✅ 支持 |
| 图片下载 | ✅ PNG 格式 | ✅ GIF 格式 |
| 代码行数 | 544 行 | 654 行 |
| 外部依赖 | 无 | gifshot@0.4.5 |

### 适用场景
- **Canvas 画图工具**: 适合快速绘制草图、标注、简单绘画
- **Canvas GIF 制作**: 适合制作动画、表情包、教学演示

---

*文档生成日期: 2025-12-22*  
*遵循单文件 HTML 工具开发规范*