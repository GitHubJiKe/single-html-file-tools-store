# 在线简历制作工具

**文件名**: `resume-builder.html`  
**创建日期**: 2024-12-24  
**最后更新**: 2024-12-24  
**代码行数**: 1595 行  

---

## 📋 工具简介

一个功能完善的在线简历制作工具，支持多种主题风格、多格式导出和本地数据持久化。用户可以通过结构化的表单输入简历信息，实时预览效果，并导出为 Markdown、JSON、PNG 或 PDF 格式。支持 JSON 数据导入导出，方便用户备份和迁移简历数据。

---

## 🎯 核心功能

### 功能列表
1. **结构化简历编辑** - 模块化输入基本信息、工作经历、核心技能和其他信息
2. **多主题预览** - 提供 4 种精美主题风格（经典蓝、现代绿、优雅紫、极简黑）
3. **多格式导出** - 支持导出为 Markdown、JSON、PNG、PDF 四种格式
4. **JSON 导入导出** - 支持导入 JSON 文件快速恢复简历数据
5. **本地数据持久化** - 使用 IndexedDB 自动保存，刷新页面不丢失数据
6. **左右分栏布局** - 左侧编辑器，右侧实时预览
7. **移动端适配** - 响应式设计，支持移动设备使用
8. **头像上传** - 支持上传个人头像并实时预览
9. **动态列表管理** - 可动态添加/删除工作经历和技能项
10. **技能等级评估** - 使用星级（1-5星）直观展示技能熟练度

### 功能详情

#### 基本信息模块
- **字段包含**: 姓名、年龄、性别、院校、专业、学历、职业、联系方式（邮箱、电话、微信）
- **头像上传**: 支持本地图片上传，转为 Base64 存储
- **实时预览**: 输入即时反映到右侧预览区

#### 工作经历模块
- **动态添加**: 可添加多段工作经历
- **字段包含**: 任职公司、起止时间、职位/职称、工作内容
- **灵活管理**: 每项经历可独立删除

#### 核心技能模块
- **动态添加**: 可添加多项技能
- **星级评价**: 每项技能支持 1-5 星熟练度评级
- **可视化展示**: 使用星星图标直观展示技能水平

#### 导入导出功能
- **Markdown 导出**: 结构化文本格式，适合版本控制
- **JSON 导出**: 完整数据结构，支持备份和迁移
- **JSON 导入**: 支持导入之前导出的 JSON 文件，快速恢复简历
- **PNG 导出**: 高清图片格式，适合直接分享
- **PDF 导出**: 专业文档格式，支持多页内容自动分页

#### 数据持久化
- **自动保存**: 每次编辑自动保存到 IndexedDB
- **自动加载**: 刷新页面自动加载上次编辑内容
- **示例数据**: 首次使用提供完整示例简历，便于理解功能

---

## 🔗 外部依赖

### CDN 链接
| 库名称 | 版本 | CDN 链接 | 用途 |
|--------|------|----------|------|
| html2canvas | 1.4.1 | https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js | 将 HTML 转换为 Canvas，用于 PNG/PDF 导出 |
| jsPDF | 2.5.1 | https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js | 生成 PDF 文件 |

### 依赖说明
- **html2canvas**: 用于将预览区域的 HTML 渲染为 Canvas，支持 PNG 和 PDF 导出
- **jsPDF**: 用于将 Canvas 转换为 PDF 文档，支持多页内容自动分页
- **浏览器 API**: 
  - `IndexedDB` - 本地数据存储
  - `FileReader` - 读取上传的文件（头像、JSON）
  - `Blob` & `URL.createObjectURL` - 文件下载

---

## 💻 核心实现逻辑

### 技术栈
- HTML5
- CSS3 (Flexbox 布局、Grid 布局、响应式设计、渐变背景)
- JavaScript (ES6+)
- IndexedDB API
- File API
- Canvas API (通过 html2canvas)

### 关键代码实现

#### 1. 数据结构设计
```javascript
let resumeData = {
  // 基本信息
  avatar: '',           // Base64 编码的头像
  name: '',
  age: '',
  gender: '',
  school: '',
  major: '',
  education: '',
  profession: '',
  email: '',
  phone: '',
  wechat: '',
  
  // 工作经历数组
  workExperiences: [
    {
      company: '',
      period: '',
      position: '',
      content: ''
    }
  ],
  
  // 技能数组
  skills: [
    {
      name: '',
      level: 0  // 1-5 星级
    }
  ],
  
  // 其他信息
  otherInfo: ''
};
```
**设计说明**: 采用扁平化的数据结构，所有字段都是字符串或简单数组，便于 JSON 序列化和 IndexedDB 存储。工作经历和技能使用数组存储，支持动态添加。

#### 2. IndexedDB 数据持久化
```javascript
// 初始化数据库
function initDB() {
  const request = indexedDB.open('ResumeBuilderDB', 1);
  
  request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains('resumes')) {
      db.createObjectStore('resumes', { keyPath: 'id' });
    }
  };
  
  request.onsuccess = (event) => {
    db = event.target.result;
    loadFromDB();
  };
}

// 保存到数据库
function saveToDB() {
  if (!db) return;
  const transaction = db.transaction(['resumes'], 'readwrite');
  const store = transaction.objectStore('resumes');
  const data = {
    id: 'current',
    ...resumeData,
    lastModified: new Date().toISOString()
  };
  store.put(data);
}

// 从数据库加载
function loadFromDB() {
  const transaction = db.transaction(['resumes'], 'readonly');
  const store = transaction.objectStore('resumes');
  const request = store.get('current');
  
  request.onsuccess = (event) => {
    const data = event.target.result;
    if (data) {
      resumeData = { ...data };
      restoreFormData();
      updatePreview(true);
    }
  };
}
```
**实现说明**: 使用 IndexedDB 存储简历数据，支持离线使用。每次编辑自动保存，页面加载时自动恢复。使用固定 ID 'current' 存储当前编辑的简历。

#### 3. 动态表单管理
```javascript
// 添加工作经历
let workIdCounter = 0;
function addWorkExperience(data = null, skipUpdate = false) {
  const id = workIdCounter++;
  const item = document.createElement('div');
  item.className = 'dynamic-item';
  item.dataset.id = id;
  
  item.innerHTML = `
    <div class="dynamic-item-header">
      <span class="dynamic-item-title">工作经历 ${workList.children.length + 1}</span>
      <button class="dynamic-item-remove" onclick="removeWorkExperience(${id})">×</button>
    </div>
    <div class="form-group">
      <label>公司名称</label>
      <input type="text" id="work-company-${id}" value="${data?.company || ''}" 
             placeholder="请输入公司名称" oninput="updatePreview()">
    </div>
    <!-- 更多字段... -->
  `;
  
  workList.appendChild(item);
  if (!skipUpdate) {
    updatePreview();
  }
}

// 收集表单数据
function collectFormData() {
  // 收集工作经历
  resumeData.workExperiences = [];
  document.querySelectorAll('#workList .dynamic-item').forEach(item => {
    const id = item.dataset.id;
    resumeData.workExperiences.push({
      company: document.getElementById(`work-company-${id}`).value,
      period: document.getElementById(`work-period-${id}`).value,
      position: document.getElementById(`work-position-${id}`).value,
      content: document.getElementById(`work-content-${id}`).value
    });
  });
}
```
**实现说明**: 使用计数器生成唯一 ID，每个动态项都有独立的表单元素。`skipUpdate` 参数用于批量恢复数据时避免多次触发预览更新，提高性能。

#### 4. 技能星级评分
```javascript
// 添加技能
function addSkill(data = null, skipUpdate = false) {
  const id = skillIdCounter++;
  item.innerHTML = `
    <div class="form-group">
      <label>熟练程度</label>
      <div class="skill-rating" id="skill-rating-${id}">
        ${[1,2,3,4,5].map(i => 
          `<span class="star ${data && i <= data.level ? 'active' : ''}" 
                 onclick="setSkillLevel(${id}, ${i})">★</span>`
        ).join('')}
      </div>
    </div>
  `;
}

// 设置技能等级
function setSkillLevel(skillId, level) {
  const rating = document.getElementById(`skill-rating-${skillId}`);
  const stars = rating.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < level) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
  updatePreview();
}
```
**实现说明**: 使用星星图标表示技能等级，通过 CSS 类 `active` 控制高亮状态。点击星星时设置对应等级，所有小于等于该等级的星星都会高亮。

#### 5. JSON 导入导出
```javascript
// 导出 JSON
function exportJSON() {
  collectFormData();
  const json = JSON.stringify(resumeData, null, 2);
  downloadFile(json, 'resume.json', 'application/json');
  showToast('JSON 导出成功');
}

// 导入 JSON
function handleImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // 验证数据结构
      if (!validateResumeData(importedData)) {
        showToast('JSON 数据格式不正确', 'error');
        return;
      }
      
      // 确认导入
      if (!confirm('导入将覆盖当前所有内容，是否继续？')) {
        return;
      }
      
      // 清空现有表单
      document.getElementById('workList').innerHTML = '';
      document.getElementById('skillList').innerHTML = '';
      workIdCounter = 0;
      skillIdCounter = 0;
      
      // 更新数据
      resumeData = { ...importedData };
      
      // 恢复表单数据
      restoreFormData();
      updatePreview(true);
      saveToDB();
      
      showToast('导入成功');
    } catch (error) {
      showToast('JSON 文件解析失败', 'error');
    }
  };
  
  reader.readAsText(file);
}

// 验证简历数据结构
function validateResumeData(data) {
  if (!data || typeof data !== 'object') return false;
  
  // 检查字段类型
  const stringFields = ['avatar', 'name', 'age', 'gender', 'school', 
                        'major', 'education', 'profession', 'email', 
                        'phone', 'wechat', 'otherInfo'];
  for (const field of stringFields) {
    if (data[field] !== undefined && typeof data[field] !== 'string') {
      return false;
    }
  }
  
  // 检查工作经历数组
  if (data.workExperiences !== undefined) {
    if (!Array.isArray(data.workExperiences)) return false;
    for (const work of data.workExperiences) {
      if (typeof work !== 'object') return false;
    }
  }
  
  // 检查技能数组
  if (data.skills !== undefined) {
    if (!Array.isArray(data.skills)) return false;
    for (const skill of data.skills) {
      if (skill.level !== undefined && 
          (typeof skill.level !== 'number' || 
           skill.level < 0 || skill.level > 5)) {
        return false;
      }
    }
  }
  
  return true;
}
```
**实现说明**: 导出时将 `resumeData` 对象序列化为 JSON 字符串。导入时先验证数据结构的完整性和正确性，防止格式错误的 JSON 导致程序异常。验证包括字段类型检查、数组结构检查和技能等级范围检查。

#### 6. PDF 导出与分页
```javascript
async function exportPDF() {
  showToast('正在生成 PDF...');
  
  const element = document.getElementById('resumePreview');
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  });
  
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // A4 纸张尺寸（mm）
  const pageWidth = 210;
  const pageHeight = 297;
  
  // 计算图片在 PDF 中的尺寸
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  // 如果内容高度小于一页，直接添加
  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  } else {
    // 内容超过一页，需要分页
    let heightLeft = imgHeight;
    let position = 0;
    
    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // 添加后续页面
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
  }
  
  pdf.save('resume.pdf');
  showToast('PDF 导出成功');
}
```
**实现说明**: 使用 html2canvas 将预览区域转换为高清 Canvas，再通过 jsPDF 生成 PDF。关键是处理多页内容：当内容高度超过 A4 页面高度时，通过调整图片位置（负偏移）实现分页效果，确保完整内容都能导出。

#### 7. 实时预览更新
```javascript
function updatePreview(skipCollect = false) {
  // 收集表单数据（可选）
  if (!skipCollect) {
    collectFormData();
  }
  saveToDB();
  
  const preview = document.getElementById('resumePreview');
  const theme = document.getElementById('themeSelect').value;
  preview.className = `resume-preview theme-${theme}`;
  
  // 生成预览 HTML
  let html = '';
  
  // 头部
  html += '<div class="resume-header">';
  if (resumeData.avatar) {
    html += `<div class="resume-avatar"><img src="${resumeData.avatar}" alt="头像"></div>`;
  }
  html += `<div class="resume-name">${resumeData.name || '姓名'}</div>`;
  html += `<div class="resume-title">${resumeData.profession || '职业'}</div>`;
  
  // 联系方式
  const contacts = [];
  if (resumeData.email) contacts.push(`📧 ${resumeData.email}`);
  if (resumeData.phone) contacts.push(`📱 ${resumeData.phone}`);
  if (resumeData.wechat) contacts.push(`💬 ${resumeData.wechat}`);
  if (contacts.length > 0) {
    html += `<div class="resume-contact">${contacts.join(' | ')}</div>`;
  }
  html += '</div>';
  
  // 主体内容（工作经历、技能等）
  html += '<div class="resume-body">';
  // ... 生成各个模块的 HTML
  html += '</div>';
  
  preview.innerHTML = html;
}
```
**实现说明**: `skipCollect` 参数用于优化性能，在批量恢复数据时跳过表单数据收集，直接使用已有的 `resumeData`。预览 HTML 通过字符串拼接生成，根据主题应用不同的 CSS 类。

#### 8. 头像上传处理
```javascript
function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    resumeData.avatar = e.target.result;  // Base64 字符串
    const avatarPreview = document.getElementById('avatarPreview');
    avatarPreview.innerHTML = `<img src="${e.target.result}" alt="头像">`;
    updatePreview();
  };
  reader.readAsDataURL(file);
}
```
**实现说明**: 使用 FileReader API 将上传的图片文件转换为 Base64 编码的 Data URL，直接存储在 `resumeData` 中。这样可以将头像数据完整保存到 IndexedDB 和导出的 JSON 中，无需额外的文件管理。

---

## 🎨 UI/UX 设计

### 布局设计
- **左右分栏**: 编辑器和预览区各占 50% 宽度，实时同步
- **响应式布局**: 移动端自动切换为上下布局
- **固定头部**: 工具栏固定在顶部，方便随时操作

### 主题风格
1. **经典蓝**: 蓝紫渐变，专业稳重
2. **现代绿**: 绿色渐变，清新活力
3. **优雅紫**: 粉紫渐变，温柔优雅
4. **极简黑**: 纯黑背景，简约大气

### 交互设计
- **即时反馈**: 所有输入实时更新预览
- **Toast 提示**: 操作成功/失败都有明确提示
- **确认对话框**: 清空和导入等危险操作需要确认
- **下拉菜单**: 导出选项收纳在下拉菜单中，界面简洁

### 视觉元素
- **圆角设计**: 所有卡片、按钮使用圆角，柔和友好
- **阴影效果**: 适度使用阴影增强层次感
- **图标 Emoji**: 使用 Emoji 图标，简洁直观
- **渐变背景**: 主题头部使用渐变背景，视觉冲击力强

---

## 📱 移动端适配

### 响应式策略
```css
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;  /* 上下布局 */
  }
  .editor-panel, .preview-panel {
    max-height: 50vh;  /* 各占一半屏幕高度 */
  }
  .form-row {
    grid-template-columns: 1fr;  /* 单列表单 */
  }
  .resume-preview {
    transform: scale(0.85);  /* 缩小预览以适应屏幕 */
  }
}
```

### 移动端优化
- **触摸优化**: 按钮和交互区域足够大，易于点击
- **滚动优化**: 编辑器和预览区独立滚动
- **表单优化**: 移动端表单字段堆叠显示，避免横向滚动
- **预览缩放**: 移动端预览区自动缩小，完整显示内容

---

## 🔧 使用说明

### 基本使用流程
1. **填写基本信息**: 在左侧表单中输入个人信息
2. **上传头像**: 点击"上传头像"按钮选择图片
3. **添加工作经历**: 点击"+ 添加工作经历"按钮，填写工作信息
4. **添加技能**: 点击"+ 添加技能"按钮，填写技能名称并设置星级
5. **选择主题**: 在顶部下拉框中选择喜欢的主题风格
6. **导出简历**: 点击"导出"按钮，选择导出格式

### 数据管理
- **自动保存**: 无需手动保存，每次编辑自动保存到本地
- **导出备份**: 建议定期导出 JSON 格式备份数据
- **导入恢复**: 需要恢复数据时，点击"导入"按钮选择 JSON 文件
- **清空重置**: 点击"清空"按钮可清除所有数据，重新开始

### 导出格式选择
- **Markdown**: 适合版本控制、纯文本编辑
- **JSON**: 适合数据备份、跨设备迁移
- **PNG**: 适合快速分享、在线展示
- **PDF**: 适合打印、正式投递

### 技巧和建议
1. **使用示例数据**: 首次使用时会自动加载示例简历，可以参考格式
2. **导出 JSON 模板**: 先导出一份 JSON，可以作为模板批量修改
3. **多主题预览**: 导出前可以切换不同主题预览效果
4. **工作内容格式**: 工作内容支持换行，建议使用项目符号（- 或 •）列举
5. **技能分类**: 可以按技术栈、工具、软技能等分类添加

---

## ⚠️ 注意事项

### 浏览器兼容性
- **推荐浏览器**: Chrome 90+、Edge 90+、Firefox 88+、Safari 14+
- **必需特性**: IndexedDB、FileReader API、Canvas API
- **不支持**: IE 11 及以下版本

### 数据安全
- **本地存储**: 所有数据存储在浏览器本地 IndexedDB 中
- **清除数据**: 清除浏览器数据会删除所有简历信息
- **定期备份**: 建议定期导出 JSON 备份，防止数据丢失
- **隐私保护**: 数据不会上传到服务器，完全离线使用

### 导出限制
- **PNG/PDF 大小**: 内容过多可能导致导出文件较大
- **图片限制**: 头像建议使用小于 2MB 的图片
- **PDF 分页**: 超长内容会自动分页，但可能在不理想的位置断页
- **样式保留**: Markdown 导出会丢失样式，仅保留文本结构

### 性能优化
- **实时预览**: 大量内容时可能有轻微延迟，属正常现象
- **批量操作**: 恢复数据时使用批量模式，避免多次触发预览更新
- **图片优化**: 上传头像前建议压缩图片，提高加载速度

---

## 🐛 已知问题

### 当前版本已修复的问题
1. ✅ **导入 JSON 后技能不显示**: 已修复，通过 `skipUpdate` 参数优化批量恢复逻辑
2. ✅ **PDF 导出内容截断**: 已修复，实现多页自动分页
3. ✅ **刷新页面默认数据不显示**: 已修复，优化初始化加载流程

### 未来可能的改进
- 支持自定义主题颜色
- 支持简历模板切换（不同布局风格）
- 支持多份简历管理
- 支持在线图片 URL 作为头像
- 优化 PDF 导出的分页逻辑（智能断页）
- 支持简历内容的拖拽排序
- 支持更多导出格式（如 Word、HTML）

---

## 📊 代码统计

### 代码结构
- **HTML**: ~830 行（52%）
  - 结构: ~130 行
  - 样式: ~700 行
- **JavaScript**: ~765 行（48%）
  - 数据管理: ~200 行
  - 表单处理: ~250 行
  - 导入导出: ~200 行
  - 预览渲染: ~115 行

### 功能模块
| 模块 | 行数 | 占比 |
|------|------|------|
| 样式定义 | 700 | 44% |
| 表单管理 | 250 | 16% |
| 数据持久化 | 200 | 13% |
| 导入导出 | 200 | 13% |
| 预览渲染 | 115 | 7% |
| HTML 结构 | 130 | 8% |

---

## 🔄 更新日志

### v1.0.0 (2024-12-24)
- ✨ 初始版本发布
- ✨ 实现基本信息、工作经历、技能、其他信息模块
- ✨ 支持 4 种主题风格
- ✨ 支持 Markdown、JSON、PNG、PDF 导出
- ✨ 实现 IndexedDB 数据持久化
- ✨ 支持头像上传
- ✨ 实现移动端适配
- ✨ 添加 JSON 导入功能
- 🐛 修复导入 JSON 后技能不显示的问题
- 🐛 修复 PDF 导出内容截断的问题
- 🐛 修复刷新页面默认数据不显示的问题

---

## 💡 设计思路

### 架构设计
1. **单一数据源**: 使用 `resumeData` 对象作为唯一数据源，所有操作都围绕它进行
2. **双向绑定**: 表单输入 → 数据对象 → 预览渲染，形成完整的数据流
3. **批量优化**: 恢复数据时使用 `skipUpdate` 参数，避免多次触发更新
4. **自动持久化**: 每次更新自动保存到 IndexedDB，无需用户手动操作

### 用户体验
1. **零学习成本**: 界面直观，操作简单，无需阅读文档即可使用
2. **即时反馈**: 所有操作都有视觉反馈，用户清楚知道发生了什么
3. **容错设计**: 危险操作需要确认，导入数据会验证格式
4. **示例引导**: 首次使用提供完整示例，帮助用户理解功能

### 技术选型
1. **纯前端实现**: 无需后端，可完全离线使用
2. **单文件架构**: 所有代码在一个 HTML 文件中，易于分发
3. **最小依赖**: 仅依赖 2 个 CDN 库，保持轻量
4. **渐进增强**: 核心功能不依赖外部库，导出功能作为增强

---

## 🎓 学习价值

### 适合学习的知识点
1. **IndexedDB 应用**: 完整的 CRUD 操作示例
2. **FileReader API**: 图片上传和文件读取
3. **动态 DOM 操作**: 动态列表的添加、删除和数据收集
4. **Canvas 应用**: 通过 html2canvas 学习 Canvas 使用
5. **PDF 生成**: 学习 jsPDF 的基本使用和分页处理
6. **响应式设计**: Flexbox、Grid 和媒体查询的实际应用
7. **数据验证**: JSON 数据结构的完整性验证
8. **性能优化**: 批量操作的性能优化技巧

### 代码亮点
1. **数据结构验证**: 完整的 JSON 数据验证逻辑
2. **批量更新优化**: `skipUpdate` 参数避免多次渲染
3. **PDF 分页算法**: 自动计算分页位置的实现
4. **Base64 图片处理**: 图片转 Base64 并持久化存储
5. **主题系统**: 通过 CSS 类切换实现多主题

---

## 📚 参考资源

### 相关文档
- [IndexedDB API - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)
- [FileReader API - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)
- [html2canvas 文档](https://html2canvas.hertzen.com/)
- [jsPDF 文档](https://github.com/parallax/jsPDF)

### 类似工具
- [简历生成器](https://www.resumebuilder.com/)
- [超级简历](https://www.wondercv.com/)
- [五百丁简历](https://www.500d.me/)

---

**最后更新**: 2024-12-24  
**维护者**: CatPaw AI  
**许可证**: MIT