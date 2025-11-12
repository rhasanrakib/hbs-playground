# HBS Playground 🚀

A professional online Handlebars template renderer and compiler. Test your Handlebars templates with JSON data in real-time with a beautiful, VS Code-like interface.

## ✨ Features

- **🎯 Real-time Rendering** - See instant HTML output as you type
- **💻 Professional Editor** - VS Code-like interface with syntax highlighting
- **📁 File Support** - Upload .hbs and .json files directly
- **🔧 Code Formatting** - Auto-format Handlebars and JSON code
- **✅ Validation** - JSON syntax validation with error highlighting
- **🎨 Multiple Themes** - Dark themes (Material Darker, Dracula)
- **⌨️ Keyboard Shortcuts** - Professional developer shortcuts
- **💾 Auto-save** - Automatically saves your work locally
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **🔒 Privacy Focused** - All processing happens in your browser
- **🔍 SEO Optimized** - Search engine friendly with proper meta tags

## 🚀 Quick Start

1. **Write Template** - Enter your Handlebars template in the left editor
2. **Add JSON Data** - Provide JSON data in the right editor  
3. **Click Render** - See instant HTML output in the preview panel
4. **Format Code** - Use format buttons for clean, readable code

### Example

**Handlebars Template:**
```handlebars
<div class="user-profile">
  <h1>{{name}}</h1>
  <p><strong>Email:</strong> {{email}}</p>
  {{#if age}}
    <p><strong>Age:</strong> {{age}}</p>
  {{/if}}
</div>
```

**JSON Data:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

### Keyboard Shortcuts
- `Ctrl+S` / `Cmd+S` - Render template

- `Ctrl+O` / `Cmd+O` - Open file

- `Ctrl+Alt+F` / `Cmd+Alt+F` - Format code

- `Ctrl+Shift+V` / `Cmd+Shift+V` - Validate JSON

- `Ctrl+F` / `Cmd+F` - Find in editor

- `F11` - Toggle fullscreen

- Esc - Exit fullscreen

### 🎯 Use Cases
- Testing Templates - Verify Handlebars templates before deployment

- Learning Handlebars - Experiment with syntax and helpers

- Debugging - Identify template rendering issues

- Rapid Prototyping - Quick HTML generation from JSON data

- Code Formatting - Beautify Handlebars and JSON code

### 🔧 Supported Handlebars Features
- Basic Expressions - {{variable}}
- Block Helpers - {{#if}}, {{#each}}, {{#with}}
- Custom Helpers - eq, gt, lt, upper, lower, formatDate
- Conditionals - {{#if}}...{{else}}...{{/if}}
- Iteration - {{#each array}}...{{/each}}

### 🌐 Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### 📁 File Support
- Templates: .hbs, .handlebars, .html
- Data: .json files
- Upload: Drag & drop or file selector
- Export: Copy rendered HTML to clipboard

### 🔒 Privacy & Security
- Local Processing - All rendering happens in your browser
- No Server Storage - Your code never leaves your device
- Secure - HTTPS encryption and security headers
- Transparent - Open about data handling practices

### 📄 Legal
- [Terms of Service](https://hbsplayground.xyz/terms)
- [Privacy Policy](https://hbsplayground.xyz/privacy)

### 🛠️ Technical Stack
- Frontend: HTML5, CSS3, JavaScript (ES6+)

- Editors: CodeMirror with syntax highlighting

- Templating: Handlebars.js compiler

- Styling: Custom CSS with dark theme

- Icons: SVG icons for better performance

<hr/>
<br>
Happy Coding! 🎉 Test your Handlebars templates with ease at <a href="https://hbsplayground.xyz/">hbsplayground.xyz</a>