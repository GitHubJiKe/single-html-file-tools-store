// 表单构建器应用
const app = {
    // 数据库配置
    dbName: 'FormBuilderDB',
    dbVersion: 1,
    db: null,
    
    // 当前编辑的表单
    currentForm: {
        id: null,
        name: '',
        fields: [],
        createdAt: null,
        updatedAt: null
    },
    
    // 当前选中的字段
    selectedFieldId: null,
    currentEditingFieldId: null,
    currentTab: 'designer',
    currentFilterFormId: null,
    
    // 初始化应用
    async init() {
        await this.initDB();
        this.setupEventListeners();
        this.renderFormsList();
        this.renderResponsesList();
        this.showToast('应用已加载', 'success');
    },
    
    // 初始化数据库
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('forms')) {
                    const formStore = db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
                    formStore.createIndex('name', 'name', { unique: false });
                    formStore.createIndex('createdAt', 'createdAt', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('responses')) {
                    const responseStore = db.createObjectStore('responses', { keyPath: 'id', autoIncrement: true });
                    responseStore.createIndex('formId', 'formId', { unique: false });
                    responseStore.createIndex('submittedAt', 'submittedAt', { unique: false });
                }
            };
        });
    },
    
    // 设置事件监听
    setupEventListeners() {
        // 控件库拖拽
        document.querySelectorAll('.control-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('type', item.dataset.type);
            });
        });
    },
    
    // 处理拖拽
    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        document.getElementById('canvas').style.background = 'rgba(102, 126, 234, 0.05)';
    },
    
    handleDragLeave(event) {
        if (event.target.id === 'canvas') {
            document.getElementById('canvas').style.background = 'white';
        }
    },
    
    handleDrop(event) {
        event.preventDefault();
        document.getElementById('canvas').style.background = 'white';
        
        const type = event.dataTransfer.getData('type');
        if (type) {
            this.addField(type);
        }
    },
    
    // 添加字段
    addField(type) {
        const field = {
            id: 'field_' + Date.now(),
            type,
            label: this.getDefaultLabel(type),
            required: false,
            placeholder: '',
            options: ['checkbox', 'radio', 'select'].includes(type) ? 
                [{ id: 'opt_1', label: '选项1', value: 'opt_1' }] : [],
            defaultValue: '',
            helpText: '',
            minLength: '',
            maxLength: '',
            min: '',
            max: ''
        };
        
        this.currentForm.fields.push(field);
        this.renderCanvas();
        this.selectField(field.id);
    },
    
    // 获取默认标签
    getDefaultLabel(type) {
        const labels = {
            text: '单行文本',
            textarea: '多行文本',
            number: '数字',
            email: '邮箱',
            checkbox: '复选框',
            radio: '单选按钮',
            select: '下拉选择',
            date: '日期',
            time: '时间',
            rating: '评分'
        };
        return labels[type] || '字段';
    },
    
    // 删除字段
    deleteField(fieldId) {
        this.currentForm.fields = this.currentForm.fields.filter(f => f.id !== fieldId);
        this.selectedFieldId = null;
        this.renderCanvas();
        this.renderProperties();
    },
    
    // 选中字段
    selectField(fieldId) {
        this.selectedFieldId = fieldId;
        this.renderCanvas();
        this.renderProperties();
    },
    
    // 更新字段属性
    updateFieldProperty(fieldId, property, value) {
        const field = this.currentForm.fields.find(f => f.id === fieldId);
        if (field) {
            field[property] = value;
            this.renderCanvas();
            this.renderProperties();
        }
    },
    
    // 渲染画布
    renderCanvas() {
        const canvas = document.getElementById('canvas');
        const fields = this.currentForm.fields;
        
        if (fields.length === 0) {
            canvas.innerHTML = '<div class="canvas-empty">拖拽控件到这里开始设计表单</div>';
            return;
        }
        
        canvas.innerHTML = fields.map(field => `
            <div class="form-field ${this.selectedFieldId === field.id ? 'selected' : ''}" 
                 onclick="app.selectField('${field.id}')">
                <div class="form-field-header">
                    <div class="form-field-label">
                        ${field.label}
                        ${field.required ? '<span style="color: var(--danger);">*</span>' : ''}
                    </div>
                    <div class="form-field-actions">
                        <button class="btn-icon" onclick="app.deleteField('${field.id}'); event.stopPropagation();" title="删除">🗑️</button>
                    </div>
                </div>
                <div style="font-size: 12px; color: var(--text-light);">
                    ${this.getFieldTypeLabel(field.type)}
                </div>
            </div>
        `).join('');
    },
    
    // 获取字段类型标签
    getFieldTypeLabel(type) {
        const labels = {
            text: '单行文本',
            textarea: '多行文本',
            number: '数字',
            email: '邮箱',
            checkbox: '复选框',
            radio: '单选按钮',
            select: '下拉选择',
            date: '日期',
            time: '时间',
            rating: '评分'
        };
        return labels[type] || type;
    },
    
    // 渲染属性编辑器
    renderProperties() {
        const content = document.getElementById('properties-content');
        
        if (!this.selectedFieldId) {
            content.innerHTML = '选择一个控件开始编辑';
            return;
        }
        
        const field = this.currentForm.fields.find(f => f.id === this.selectedFieldId);
        if (!field) return;
        
        let html = `
            <div class="property-group">
                <div class="property-group-title">基本信息</div>
                <div class="property-item">
                    <label class="property-label">字段标签</label>
                    <input type="text" class="property-input" value="${field.label}" 
                           onchange="app.updateFieldProperty('${field.id}', 'label', this.value)">
                </div>
                <div class="property-item">
                    <label class="property-label">字段类型</label>
                    <div class="property-input" style="padding: 8px; background: #f0f0f0;">${this.getFieldTypeLabel(field.type)}</div>
                </div>
                <div class="property-item">
                    <label class="property-label">
                        <input type="checkbox" ${field.required ? 'checked' : ''} 
                               onchange="app.updateFieldProperty('${field.id}', 'required', this.checked)">
                        必填项
                    </label>
                </div>
            </div>
        `;
        
        if (field.type === 'text' || field.type === 'email' || field.type === 'number') {
            html += `
                <div class="property-group">
                    <div class="property-group-title">输入设置</div>
                    <div class="property-item">
                        <label class="property-label">占位符</label>
                        <input type="text" class="property-input" value="${field.placeholder}" 
                               onchange="app.updateFieldProperty('${field.id}', 'placeholder', this.value)">
                    </div>
                    ${field.type === 'text' ? `
                        <div class="property-item">
                            <label class="property-label">最小长度</label>
                            <input type="number" class="property-input" value="${field.minLength}" 
                                   onchange="app.updateFieldProperty('${field.id}', 'minLength', this.value)">
                        </div>
                        <div class="property-item">
                            <label class="property-label">最大长度</label>
                            <input type="number" class="property-input" value="${field.maxLength}" 
                                   onchange="app.updateFieldProperty('${field.id}', 'maxLength', this.value)">
                        </div>
                    ` : ''}
                    ${field.type === 'number' ? `
                        <div class="property-item">
                            <label class="property-label">最小值</label>
                            <input type="number" class="property-input" value="${field.min}" 
                                   onchange="app.updateFieldProperty('${field.id}', 'min', this.value)">
                        </div>
                        <div class="property-item">
                            <label class="property-label">最大值</label>
                            <input type="number" class="property-input" value="${field.max}" 
                                   onchange="app.updateFieldProperty('${field.id}', 'max', this.value)">
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        if (field.type === 'textarea') {
            html += `
                <div class="property-group">
                    <div class="property-group-title">文本框设置</div>
                    <div class="property-item">
                        <label class="property-label">占位符</label>
                        <input type="text" class="property-input" value="${field.placeholder}" 
                               onchange="app.updateFieldProperty('${field.id}', 'placeholder', this.value)">
                    </div>
                    <div class="property-item">
                        <label class="property-label">最大长度</label>
                        <input type="number" class="property-input" value="${field.maxLength}" 
                               onchange="app.updateFieldProperty('${field.id}', 'maxLength', this.value)">
                    </div>
                </div>
            `;
        }
        
        if (field.type === 'checkbox' || field.type === 'radio' || field.type === 'select') {
            html += `
                <div class="property-group">
                    <div class="property-group-title">选项设置</div>
                    <button class="btn btn-secondary" style="width: 100%; margin-bottom: 10px;" 
                            onclick="app.showOptionsModal('${field.id}')">编辑选项</button>
                    <div style="font-size: 12px; color: var(--text-light);">
                        已有 ${field.options.length} 个选项
                    </div>
                </div>
            `;
        }
        
        html += `
            <div class="property-group">
                <div class="property-group-title">帮助文本</div>
                <div class="property-item">
                    <input type="text" class="property-input" value="${field.helpText}" 
                           onchange="app.updateFieldProperty('${field.id}', 'helpText', this.value)" 
                           placeholder="为用户提供帮助信息">
                </div>
            </div>
        `;
        
        content.innerHTML = html;
    },
    
    // 显示选项编辑模态框
    showOptionsModal(fieldId) {
        const field = this.currentForm.fields.find(f => f.id === fieldId);
        if (!field) return;
        
        let optionsHtml = '';
        field.options.forEach((opt) => {
            optionsHtml += `
                <div class="option-item">
                    <input type="text" class="property-input" value="${opt.label}" 
                           data-option-id="${opt.id}" data-field-id="${fieldId}" placeholder="选项标签">
                    <button onclick="app.removeOption('${fieldId}', '${opt.id}')">删除</button>
                </div>
            `;
        });
        
        optionsHtml += `
            <button class="btn btn-secondary" style="width: 100%; margin-top: 10px;" 
                    onclick="app.addOption('${fieldId}')">➕ 添加选项</button>
        `;
        
        document.getElementById('options-content').innerHTML = optionsHtml;
        document.getElementById('options-modal').classList.add('active');
        this.currentEditingFieldId = fieldId;
    },
    
    // 添加选项
    addOption(fieldId) {
        const field = this.currentForm.fields.find(f => f.id === fieldId);
        if (field) {
            const newOpt = {
                id: 'opt_' + Date.now(),
                label: '新选项',
                value: 'opt_' + Date.now()
            };
            field.options.push(newOpt);
            this.showOptionsModal(fieldId);
        }
    },
    
    // 删除选项
    removeOption(fieldId, optionId) {
        const field = this.currentForm.fields.find(f => f.id === fieldId);
        if (field && field.options.length > 1) {
            field.options = field.options.filter(o => o.id !== optionId);
            this.showOptionsModal(fieldId);
        } else {
            this.showToast('至少需要保留一个选项', 'error');
        }
    },
    
    // 保存选项
    saveOptions() {
        const fieldId = this.currentEditingFieldId;
        const field = this.currentForm.fields.find(f => f.id === fieldId);
        if (!field) return;
        
        const inputs = document.querySelectorAll('[data-option-id]');
        inputs.forEach(input => {
            const optId = input.dataset.optionId;
            const opt = field.options.find(o => o.id === optId);
            if (opt) {
                opt.label = input.value || '未命名';
                opt.value = input.value || optId;
            }
        });
        
        this.closeModal();
        this.renderProperties();
        this.showToast('选项已保存', 'success');
    },
    
    // 保存表单
    async saveForm() {
        const formName = document.getElementById('form-name').value.trim();
        if (!formName) {
            this.showToast('请输入表单名称', 'error');
            return;
        }
        
        if (this.currentForm.fields.length === 0) {
            this.showToast('请至少添加一个字段', 'error');
            return;
        }
        
        const now = new Date().toISOString();
        const isNewForm = !this.currentForm.id;
        
        const form = {
            ...this.currentForm,
            name: formName,
            updatedAt: now
        };
        
        if (isNewForm) {
            form.createdAt = now;
            // 删除 null 的 id，让 IndexedDB 自动生成
            delete form.id;
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['forms'], 'readwrite');
            const store = transaction.objectStore('forms');
            const request = isNewForm ? store.add(form) : store.put(form);
            
            request.onerror = () => {
                this.showToast('保存失败: ' + request.error.message, 'error');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.currentForm.id = request.result;
                this.showToast('表单保存成功', 'success');
                this.renderFormsList();
                resolve(request.result);
            };
        });
    },
    
    // 加载表单
    async loadForm(formId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['forms'], 'readonly');
            const store = transaction.objectStore('forms');
            const request = store.get(formId);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                if (request.result) {
                    this.currentForm = JSON.parse(JSON.stringify(request.result));
                    document.getElementById('form-name').value = this.currentForm.name;
                    this.renderCanvas();
                    resolve(request.result);
                } else {
                    reject(new Error('表单不存在'));
                }
            };
        });
    },
    
    // 获取所有表单
    async getAllForms() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['forms'], 'readonly');
            const store = transaction.objectStore('forms');
            const request = store.getAll();
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },
    
    // 删除表单
    async deleteForm(formId) {
        if (!confirm('确定删除此表单吗？')) return;
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['forms'], 'readwrite');
            const store = transaction.objectStore('forms');
            const request = store.delete(formId);
            
            request.onerror = () => {
                this.showToast('删除失败', 'error');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.showToast('表单已删除', 'success');
                this.renderFormsList();
                resolve();
            };
        });
    },
    
    // 保存表单响应
    async saveResponse(formId, data) {
        const response = {
            formId,
            data,
            submittedAt: new Date().toISOString()
        };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['responses'], 'readwrite');
            const store = transaction.objectStore('responses');
            const request = store.add(response);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.showToast('数据提交成功', 'success');
                resolve(request.result);
            };
        });
    },
    
    // 获取所有响应
    async getAllResponses() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['responses'], 'readonly');
            const store = transaction.objectStore('responses');
            const request = store.getAll();
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },
    
    // 获取表单的所有响应
    async getFormResponses(formId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['responses'], 'readonly');
            const store = transaction.objectStore('responses');
            const index = store.index('formId');
            const request = index.getAll(parseInt(formId));
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },
    
    // 删除响应
    async deleteResponse(responseId) {
        if (!confirm('确定删除此数据吗？')) return;
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['responses'], 'readwrite');
            const store = transaction.objectStore('responses');
            const request = store.delete(responseId);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.showToast('数据已删除', 'success');
                this.renderResponsesList();
                resolve();
            };
        });
    },
    
    // 预览表单
    previewForm() {
        if (this.currentForm.fields.length === 0) {
            this.showToast('请至少添加一个字段', 'error');
            return;
        }
        
        this.showFormModal('表单预览', true);
    },
    
    // 显示表单模态框
    showFormModal(title, isPreview = false) {
        const modal = document.getElementById('form-modal');
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-submit').style.display = isPreview ? 'none' : 'block';
        
        let formHtml = '';
        this.currentForm.fields.forEach(field => {
            formHtml += this.renderFormField(field);
        });
        
        document.getElementById('modal-body').innerHTML = formHtml;
        modal.classList.add('active');
    },
    
    // 渲染表单字段
    renderFormField(field) {
        let html = `<div class="form-group">`;
        html += `<label>${field.label}${field.required ? '<span style="color: var(--danger);">*</span>' : ''}</label>`;
        
        switch (field.type) {
            case 'text':
            case 'email':
            case 'number':
                html += `<input type="${field.type === 'text' ? 'text' : field.type}" 
                                id="field_${field.id}" 
                                placeholder="${field.placeholder}"
                                ${field.required ? 'required' : ''}
                                ${field.minLength ? `minlength="${field.minLength}"` : ''}
                                ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                                ${field.type === 'number' && field.min ? `min="${field.min}"` : ''}
                                ${field.type === 'number' && field.max ? `max="${field.max}"` : ''}>`;
                break;
            
            case 'textarea':
                html += `<textarea id="field_${field.id}" 
                                  placeholder="${field.placeholder}"
                                  ${field.required ? 'required' : ''}
                                  ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}></textarea>`;
                break;
            
            case 'checkbox':
                html += `<div class="checkbox-group">`;
                field.options.forEach(opt => {
                    html += `<div class="checkbox-item">
                                <input type="checkbox" id="field_${field.id}_${opt.id}" value="${opt.value}">
                                <label for="field_${field.id}_${opt.id}">${opt.label}</label>
                            </div>`;
                });
                html += `</div>`;
                break;
            
            case 'radio':
                html += `<div class="radio-group">`;
                field.options.forEach(opt => {
                    html += `<div class="radio-item">
                                <input type="radio" id="field_${field.id}_${opt.id}" 
                                       name="field_${field.id}" value="${opt.value}" 
                                       ${field.required ? 'required' : ''}>
                                <label for="field_${field.id}_${opt.id}">${opt.label}</label>
                            </div>`;
                });
                html += `</div>`;
                break;
            
            case 'select':
                html += `<select id="field_${field.id}" ${field.required ? 'required' : ''}>
                            <option value="">请选择...</option>`;
                field.options.forEach(opt => {
                    html += `<option value="${opt.value}">${opt.label}</option>`;
                });
                html += `</select>`;
                break;
            
            case 'date':
                html += `<input type="date" id="field_${field.id}" ${field.required ? 'required' : ''}>`;
                break;
            
            case 'time':
                html += `<input type="time" id="field_${field.id}" ${field.required ? 'required' : ''}>`;
                break;
            
            case 'rating':
                html += `<div style="display: flex; gap: 10px; margin-top: 10px;">`;
                for (let i = 1; i <= 5; i++) {
                    html += `<input type="radio" id="field_${field.id}_${i}" 
                                   name="field_${field.id}" value="${i}" style="width: auto;">
                            <label for="field_${field.id}_${i}" style="margin: 0;">⭐</label>`;
                }
                html += `</div>`;
                break;
        }
        
        if (field.helpText) {
            html += `<small style="color: var(--text-light); display: block; margin-top: 5px;">${field.helpText}</small>`;
        }
        
        html += `</div>`;
        return html;
    },
    
    // 提交表单响应
    async submitFormResponse() {
        if (!this.currentForm.id) {
            this.showToast('请先保存表单', 'error');
            return;
        }
        
        const data = {};
        let isValid = true;
        
        this.currentForm.fields.forEach(field => {
            const element = document.getElementById(`field_${field.id}`);
            if (!element && field.type !== 'checkbox') return;
            
            if (field.type === 'checkbox') {
                const checked = document.querySelectorAll(`input[id^="field_${field.id}"]:checked`);
                data[field.label] = Array.from(checked).map(el => el.value);
            } else if (field.type === 'radio') {
                const checked = document.querySelector(`input[name="field_${field.id}"]:checked`);
                data[field.label] = checked ? checked.value : '';
            } else {
                data[field.label] = element.value;
            }
            
            if (field.required && !data[field.label]) {
                isValid = false;
                this.showToast(`${field.label} 为必填项`, 'error');
            }
        });
        
        if (!isValid) return;
        
        await this.saveResponse(this.currentForm.id, data);
        this.closeModal();
        this.renderResponsesList();
    },
    
    // 渲染表单列表
    async renderFormsList() {
        const forms = await this.getAllForms();
        const container = document.getElementById('forms-list');
        
        if (forms.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div style="font-size: 16px; margin-bottom: 10px;">还没有表单</div>
                    <div style="font-size: 12px; color: var(--text-light);">点击"新建表单"开始创建</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = forms.map(form => {
            const date = new Date(form.updatedAt).toLocaleDateString('zh-CN');
            return `
                <div class="list-card">
                    <div class="list-card-title">${form.name}</div>
                    <div class="list-card-meta">
                        <div>字段数: ${form.fields.length}</div>
                        <div>修改时间: ${date}</div>
                    </div>
                    <div class="list-card-actions">
                        <button class="btn btn-primary btn-sm" onclick="app.editForm(${form.id})">编辑</button>
                        <button class="btn btn-secondary btn-sm" onclick="app.publishForm(${form.id})">发布</button>
                        <button class="btn btn-danger btn-sm" onclick="app.deleteForm(${form.id})">删除</button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // 编辑表单
    async editForm(formId) {
        await this.loadForm(formId);
        this.switchTab('designer');
    },
    
    // 发布表单
    async publishForm(formId) {
        const form = await new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['forms'], 'readonly');
            const store = transaction.objectStore('forms');
            const request = store.get(formId);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
        
        this.currentForm = JSON.parse(JSON.stringify(form));
        this.showFormModal(`发布表单: ${form.name}`, false);
    },
    
    // 渲染响应列表
    async renderResponsesList() {
        const responses = await this.getAllResponses();
        const forms = await this.getAllForms();
        const container = document.getElementById('responses-list');
        
        if (responses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💾</div>
                    <div style="font-size: 16px; margin-bottom: 10px;">还没有提交的数据</div>
                    <div style="font-size: 12px; color: var(--text-light);">发布表单后可以收集数据</div>
                </div>
            `;
            return;
        }
        
        const formMap = {};
        forms.forEach(f => formMap[f.id] = f.name);
        
        let html = '<table class="table-view"><thead><tr><th>表单名称</th><th>提交时间</th><th>操作</th></tr></thead><tbody>';
        
        responses.forEach(response => {
            const date = new Date(response.submittedAt).toLocaleString('zh-CN');
            const formName = formMap[response.formId] || '已删除的表单';
            
            html += `
                <tr>
                    <td>${formName}</td>
                    <td>${date}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="app.viewResponse(${response.id})">查看</button>
                        <button class="btn btn-danger btn-sm" onclick="app.deleteResponse(${response.id})">删除</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    },
    
    // 查看响应
    viewResponse(responseId) {
        const transaction = this.db.transaction(['responses'], 'readonly');
        const store = transaction.objectStore('responses');
        const request = store.get(responseId);
        
        request.onsuccess = () => {
            const response = request.result;
            let content = '<div>';
            for (const [key, value] of Object.entries(response.data)) {
                const displayValue = Array.isArray(value) ? value.join(', ') : value;
                content += `<div class="form-group"><strong>${key}:</strong> <span>${displayValue}</span></div>`;
            }
            content += '</div>';
            
            const modal = document.getElementById('form-modal');
            document.getElementById('modal-title').textContent = '查看数据';
            document.getElementById('modal-submit').style.display = 'none';
            document.getElementById('modal-body').innerHTML = content;
            modal.classList.add('active');
        };
    },
    
    // 过滤响应
    async filterResponses() {
        const formId = document.getElementById('form-filter').value;
        this.currentFilterFormId = formId;
        
        if (!formId) {
            this.renderResponsesList();
            return;
        }
        
        const responses = await this.getFormResponses(formId);
        const forms = await this.getAllForms();
        const container = document.getElementById('responses-list');
        
        if (responses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💾</div>
                    <div style="font-size: 16px; margin-bottom: 10px;">此表单没有数据</div>
                </div>
            `;
            return;
        }
        
        const formMap = {};
        forms.forEach(f => formMap[f.id] = f.name);
        
        let html = '<table class="table-view"><thead><tr><th>表单名称</th><th>提交时间</th><th>操作</th></tr></thead><tbody>';
        
        responses.forEach(response => {
            const date = new Date(response.submittedAt).toLocaleString('zh-CN');
            const formName = formMap[response.formId] || '已删除的表单';
            
            html += `
                <tr>
                    <td>${formName}</td>
                    <td>${date}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="app.viewResponse(${response.id})">查看</button>
                        <button class="btn btn-danger btn-sm" onclick="app.deleteResponse(${response.id})">删除</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    },
    
    // 导出响应为Excel
    async exportResponses() {
        const responses = await this.getAllResponses();
        if (responses.length === 0) {
            this.showToast('没有数据可导出', 'error');
            return;
        }
        
        const forms = await this.getAllForms();
        const formMap = {};
        forms.forEach(f => formMap[f.id] = f.name);
        
        const data = responses.map(r => {
            const row = {
                '表单': formMap[r.formId] || '已删除',
                '提交时间': new Date(r.submittedAt).toLocaleString('zh-CN')
            };
            
            // 处理数据，将数组转换为字符串
            for (const [key, value] of Object.entries(r.data)) {
                if (Array.isArray(value)) {
                    // 复选框等多选类型的数据转换为逗号分隔的字符串
                    row[key] = value.join(', ');
                } else {
                    row[key] = value;
                }
            }
            
            return row;
        });
        
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '表单数据');
        XLSX.writeFile(workbook, `表单数据_${new Date().toISOString().split('T')[0]}_${Date.now()}.xlsx`);
        
        this.showToast('数据已导出', 'success');
    },
    
    // 渲染分析页面
    async renderAnalytics() {
        const responses = await this.getAllResponses();
        const forms = await this.getAllForms();
        const container = document.getElementById('analytics-content');
        
        if (responses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div style="font-size: 16px; margin-bottom: 10px;">还没有数据</div>
                </div>
            `;
            return;
        }
        
        // 统计信息
        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 30px;">';
        html += `
            <div class="chart-container" style="text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: var(--primary);">${responses.length}</div>
                <div style="font-size: 14px; color: var(--text-light);">总提交数</div>
            </div>
            <div class="chart-container" style="text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: var(--success);">${forms.length}</div>
                <div style="font-size: 14px; color: var(--text-light);">表单总数</div>
            </div>
        `;
        html += '</div>';
        
        // 按表单统计
        const formStats = {};
        responses.forEach(r => {
            if (!formStats[r.formId]) {
                formStats[r.formId] = 0;
            }
            formStats[r.formId]++;
        });
        
        html += '<div class="chart-container"><div class="chart-title">表单提交统计</div><div id="chart-form-stats" class="chart"></div></div>';
        
        container.innerHTML = html;
        
        // 绘制图表
        setTimeout(() => {
            const formMap = {};
            forms.forEach(f => formMap[f.id] = f.name);
            
            const chartData = Object.entries(formStats).map(([formId, count]) => ({
                name: formMap[formId] || '已删除',
                value: count
            }));
            
            const chart = echarts.init(document.getElementById('chart-form-stats'));
            chart.setOption({
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: chartData.map(d => d.name) },
                yAxis: { type: 'value' },
                series: [{ data: chartData.map(d => d.value), type: 'bar', itemStyle: { color: '#667eea' } }]
            });
        }, 0);
    },
    
    // 导出所有数据
    async exportAllData() {
        const forms = await this.getAllForms();
        const responses = await this.getAllResponses();
        
        const data = {
            forms: forms.map(f => ({ ...f, fields: f.fields })),
            responses: responses
        };
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `form-builder-backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('数据已导出', 'success');
    },
    
    // 导入数据
    importData(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // 导入表单
                for (const form of data.forms) {
                    delete form.id;
                    await new Promise((resolve, reject) => {
                        const transaction = this.db.transaction(['forms'], 'readwrite');
                        const store = transaction.objectStore('forms');
                        const request = store.add(form);
                        request.onerror = () => reject(request.error);
                        request.onsuccess = () => resolve();
                    });
                }
                
                // 导入响应
                for (const response of data.responses) {
                    delete response.id;
                    await new Promise((resolve, reject) => {
                        const transaction = this.db.transaction(['responses'], 'readwrite');
                        const store = transaction.objectStore('responses');
                        const request = store.add(response);
                        request.onerror = () => reject(request.error);
                        request.onsuccess = () => resolve();
                    });
                }
                
                this.showToast('数据导入成功', 'success');
                this.renderFormsList();
                this.renderResponsesList();
            } catch (error) {
                this.showToast('导入失败: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    },
    
    // 切换标签页
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // 更新标签页按钮
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // 更新内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + '-tab').classList.add('active');
        
        // 根据标签页加载数据
        if (tabName === 'forms') {
            this.renderFormsList();
        } else if (tabName === 'responses') {
            this.renderResponsesList();
        } else if (tabName === 'analytics') {
            this.renderAnalytics();
        } else if (tabName === 'designer') {
            if (!this.currentForm.id) {
                this.currentForm = {
                    id: null,
                    name: '',
                    fields: [],
                    createdAt: null,
                    updatedAt: null
                };
                document.getElementById('form-name').value = '';
                this.renderCanvas();
                this.renderProperties();
            }
        }
    },
    
    // 关闭模态框
    closeModal() {
        document.getElementById('form-modal').classList.remove('active');
        document.getElementById('options-modal').classList.remove('active');
    },
    
    // 显示提示
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },
    
    // 显示关于信息
    showAbout() {
        const modal = document.getElementById('form-modal');
        document.getElementById('modal-title').textContent = '关于表单构建器';
        document.getElementById('modal-submit').style.display = 'none';
        document.getElementById('modal-body').innerHTML = `
            <div style="line-height: 1.8;">
                <h3>表单构建器 v1.0</h3>
                <p>一个功能丰富的本地表单管理系统</p>
                
                <h4>主要功能：</h4>
                <ul style="margin-left: 20px;">
                    <li>✅ 配置化表单设计 - 支持10种控件类型</li>
                    <li>✅ 本地数据存储 - 使用IndexDB保存数据</li>
                    <li>✅ 表单发布 - 发布表单供用户填写</li>
                    <li>✅ 数据收集 - 收集和管理提交的数据</li>
                    <li>✅ 数据分析 - 可视化数据统计</li>
                    <li>✅ 导出功能 - 支持导出Excel和JSON格式</li>
                    <li>✅ 数据备份 - 支持导入导出数据备份</li>
                </ul>
                
                <h4>技术栈：</h4>
                <p>HTML5 + CSS3 + JavaScript + IndexDB + ECharts + SheetJS</p>
                
                <h4>设计理念：</h4>
                <p>Local-First - 所有数据本地存储，用户数据完全掌控，支持离线使用。</p>
            </div>
        `;
        modal.classList.add('active');
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});