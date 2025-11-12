// Initialize CodeMirror editors
let hbsEditor, jsonEditor;

// Example content with SEO-friendly examples
const exampleTemplate = `<div class="user-profile" itemscope itemtype="https://schema.org/Person">
  <h1 itemprop="name">{{name}}</h1>
  <p><strong>Email:</strong> <span itemprop="email">{{email}}</span></p>
  {{#if age}}
    <p><strong>Age:</strong> <span itemprop="age">{{age}}</span></p>
  {{/if}}
  {{#if isAdmin}}
    <span class="badge admin">Administrator</span>
  {{/if}}
  {{#if skills}}
    <h2>Skills:</h2>
    <ul>
      {{#each skills}}
        <li itemprop="knowsAbout">{{this}}</li>
      {{/each}}
    </ul>
  {{/if}}
</div>`;

const exampleData = {
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "isAdmin": true,
  "skills": ["JavaScript", "HTML", "CSS", "Node.js"]
};

// Track usage for analytics
const usageStats = {
    renders: 0,
    formats: 0,
    validations: 0
};

// Initialize editors when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEditors();
    setupEventListeners();
    loadFromStorage();
    trackPageView();
});

function initializeEditors() {
    // Handlebars Editor
    hbsEditor = CodeMirror.fromTextArea(document.getElementById('templateEditor'), {
        mode: 'handlebars',
        theme: 'material-darker',
        lineNumbers: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        extraKeys: {
            "Ctrl-S": function(instance) { renderTemplate(); },
            "Ctrl-O": function(instance) { document.getElementById('templateFile').click(); },
            "Ctrl-Alt-F": function(instance) { formatHandlebars(); },
            "Ctrl-F": function(instance) { CodeMirror.commands.find(instance); },
            "F11": function(instance) { instance.setOption("fullScreen", !instance.getOption("fullScreen")); },
            "Esc": function(instance) { if (instance.getOption("fullScreen")) instance.setOption("fullScreen", false); }
        }
    });

    // JSON Editor
    jsonEditor = CodeMirror.fromTextArea(document.getElementById('dataEditor'), {
        mode: 'application/json',
        theme: 'material-darker',
        lineNumbers: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        extraKeys: {
            "Ctrl-S": function(instance) { renderTemplate(); },
            "Ctrl-O": function(instance) { document.getElementById('dataFile').click(); },
            "Ctrl-Alt-F": function(instance) { formatJSON(); },
            "Ctrl-Shift-V": function(instance) { validateJSON(); },
            "Ctrl-F": function(instance) { CodeMirror.commands.find(instance); },
            "F11": function(instance) { instance.setOption("fullScreen", !instance.getOption("fullScreen")); },
            "Esc": function(instance) { if (instance.getOption("fullScreen")) instance.setOption("fullScreen", false); }
        }
    });

    // Set initial content
    hbsEditor.setValue(exampleTemplate);
    jsonEditor.setValue(JSON.stringify(exampleData, null, 2));

    // Update status bars
    updateEditorStatus(hbsEditor, 'hbs');
    updateEditorStatus(jsonEditor, 'json');

    // Add change listeners for status updates
    hbsEditor.on('change', () => {
        updateEditorStatus(hbsEditor, 'hbs');
        autoSave();
    });

    jsonEditor.on('change', () => {
        updateEditorStatus(jsonEditor, 'json');
        autoSave();
    });

    // Add cursor activity listeners
    hbsEditor.on('cursorActivity', () => updateCursorPosition(hbsEditor, 'hbs'));
    jsonEditor.on('cursorActivity', () => updateCursorPosition(jsonEditor, 'json'));
}

function setupEventListeners() {
    // Theme switchers
    document.getElementById('hbsTheme').addEventListener('change', function(e) {
        hbsEditor.setOption('theme', e.target.value);
        trackEvent('Theme Change', 'Handlebars', e.target.value);
    });

    document.getElementById('jsonTheme').addEventListener('change', function(e) {
        jsonEditor.setOption('theme', e.target.value);
        trackEvent('Theme Change', 'JSON', e.target.value);
    });

    // File input handlers
    document.getElementById('templateFile').addEventListener('change', function(e) {
        loadFile(e.target.files[0], hbsEditor, 'Handlebars');
        trackEvent('File Upload', 'Handlebars');
    });

    document.getElementById('dataFile').addEventListener('change', function(e) {
        loadFile(e.target.files[0], jsonEditor, 'JSON');
        trackEvent('File Upload', 'JSON');
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            renderTemplate();
        }
    });

    // Track visibility for analytics
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            trackEvent('Page Visibility', 'Visible');
        }
    });
}

function updateEditorStatus(editor, type) {
    const content = editor.getValue();
    const size = new Blob([content]).size;
    const lineInfo = `${editor.lineCount()} lines`;
    const sizeInfo = `${formatFileSize(size)}`;
    
    document.getElementById(`${type}LineInfo`).textContent = lineInfo;
    document.getElementById(`${type}SizeInfo`).textContent = `Size: ${sizeInfo}`;
}

function updateCursorPosition(editor, type) {
    const cursor = editor.getCursor();
    document.getElementById(`${type}LineInfo`).textContent = `Line: ${cursor.line + 1}, Column: ${cursor.ch + 1}`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format Handlebars template
function formatHandlebars() {
    try {
        let template = hbsEditor.getValue();
        
        // Basic formatting
        template = template
            .replace(/\{\{#[^*]/g, '{{#')
            .replace(/\{\{\/[^*]/g, '{{/')
            .replace(/\{\{else\}\}/g, '\n    {{else}}\n')
            .replace(/\{\{#[^*]\}\}/g, '{{#$1}}\n')
            .replace(/\{\{\/[^*]\}\}/g, '\n{{/$1}}');
        
        hbsEditor.setValue(template);
        usageStats.formats++;
        trackEvent('Format', 'Handlebars');
        showSuccess('Handlebars template formatted!');
    } catch (error) {
        showError('Error formatting template: ' + error.message);
    }
}

// Format JSON
function formatJSON() {
    try {
        const jsonData = JSON.parse(jsonEditor.getValue());
        jsonEditor.setValue(JSON.stringify(jsonData, null, 2));
        usageStats.formats++;
        trackEvent('Format', 'JSON');
        showSuccess('JSON formatted successfully!');
    } catch (error) {
        showError('Invalid JSON: ' + error.message);
    }
}

// Validate JSON
function validateJSON() {
    try {
        JSON.parse(jsonEditor.getValue());
        usageStats.validations++;
        trackEvent('Validation', 'JSON', 'success');
        showSuccess('✓ JSON is valid!');
    } catch (error) {
        trackEvent('Validation', 'JSON', 'error');
        showError('✗ Invalid JSON: ' + error.message);
    }
}

// Load file into editor
function loadFile(file, editor, type) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                if (type === 'JSON') {
                    const jsonData = JSON.parse(e.target.result);
                    editor.setValue(JSON.stringify(jsonData, null, 2));
                } else {
                    editor.setValue(e.target.result);
                }
                showSuccess(`${type} file loaded successfully!`);
            } catch (error) {
                showError(`Error loading ${type} file: ${error.message}`);
            }
        };
        reader.readAsText(file);
    }
}

// Render template
function renderTemplate() {
    const templateContent = hbsEditor.getValue();
    const dataContent = jsonEditor.getValue();
    
    hideMessages();

    if (!templateContent.trim()) {
        showError('Please provide a Handlebars template.');
        return;
    }

    if (!dataContent.trim()) {
        showError('Please provide JSON data.');
        return;
    }

    try {
        const data = JSON.parse(dataContent);
        const template = Handlebars.compile(templateContent);
        const renderedHtml = template(data);
        
        document.getElementById('previewContent').innerHTML = renderedHtml;
        document.getElementById('previewInfo').textContent = 'Output rendered successfully';
        
        usageStats.renders++;
        trackEvent('Render', 'Template', 'success');
        showSuccess('Template rendered successfully!');
        
    } catch (error) {
        const errorHtml = `
            <div style="padding: 20px; background: #5c2a2a; border-radius: 8px; border-left: 4px solid #e74c3c;">
                <h3 style="color: #ff6b6b; margin-bottom: 10px;">🚫 Rendering Error</h3>
                <pre style="color: #ff9999; font-family: 'Fira Code', monospace; white-space: pre-wrap;">${error.message}</pre>
            </div>
        `;
        document.getElementById('previewContent').innerHTML = errorHtml;
        document.getElementById('previewInfo').textContent = 'Error rendering template';
        
        trackEvent('Render', 'Template', 'error');
        showError('Error rendering template: ' + error.message);
    }
}

// Copy output to clipboard
function copyOutput() {
    const htmlContent = document.getElementById('previewContent').innerHTML;
    navigator.clipboard.writeText(htmlContent).then(() => {
        trackEvent('Copy', 'HTML');
        showSuccess('HTML copied to clipboard!');
    }).catch(() => {
        showError('Failed to copy HTML to clipboard');
    });
}

// Clear preview
function clearPreview() {
    document.getElementById('previewContent').innerHTML = `
        <div class="empty-state">
            <h3>🚀 Ready to Render</h3>
            <p>Write your Handlebars template and JSON data, then click Render to see the output here.</p>
        </div>
    `;
    document.getElementById('previewInfo').textContent = 'No output generated';
    trackEvent('Clear', 'Preview');
    showSuccess('Preview cleared');
}

// Message functions
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(hideMessages, 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(hideMessages, 3000);
}

function hideMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// Auto-save to localStorage
function autoSave() {
    const template = hbsEditor.getValue();
    const data = jsonEditor.getValue();
    localStorage.setItem('handlebarsTemplate', template);
    localStorage.setItem('handlebarsData', data);
}

// Load from localStorage
function loadFromStorage() {
    const savedTemplate = localStorage.getItem('handlebarsTemplate');
    const savedData = localStorage.getItem('handlebarsData');
    
    if (savedTemplate && savedTemplate !== exampleTemplate) {
        hbsEditor.setValue(savedTemplate);
    }
    if (savedData && savedData !== JSON.stringify(exampleData, null, 2)) {
        jsonEditor.setValue(savedData);
    }
}

// Analytics functions (basic implementation)
function trackPageView() {
    console.log('Page viewed:', window.location.href);
    // Integrate with your analytics service here
}

function trackEvent(category, action, label) {
    console.log('Event tracked:', { category, action, label });
    // Integrate with your analytics service here
}

// Register Handlebars helpers
Handlebars.registerHelper('eq', function(a, b) { return a === b; });
Handlebars.registerHelper('neq', function(a, b) { return a !== b; });
Handlebars.registerHelper('gt', function(a, b) { return a > b; });
Handlebars.registerHelper('lt', function(a, b) { return a < b; });
Handlebars.registerHelper('formatDate', function(date) { return new Date(date).toLocaleDateString(); });
Handlebars.registerHelper('upper', function(str) { return str?.toUpperCase?.() || str; });
Handlebars.registerHelper('lower', function(str) { return str?.toLowerCase?.() || str; });

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
});