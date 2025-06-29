// File: cleanup-project.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanupProject() {
  console.log('🧹 بدء تنظيف المشروع...');
  
  const srcDir = path.join(__dirname, '..'); // العودة مستوى واحد للوصول لـ src
  
  function processFile(filePath) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // إزالة console statements
    const consoleRegex = /console\.(log|error|warn|info|debug)\([^;]*\);?\s*\n?/g;
    if (consoleRegex.test(content)) {
      content = content.replace(consoleRegex, '');
      modified = true;
    }
    
    // تبسيط try-catch blocks
    const patterns = [
      // إزالة setErr statements مع النص المحيط
      {
        regex: /\s*const msg = [^;]*\|\| t\([^;]*\);\s*\n/g,
        replacement: ''
      },
      {
        regex: /\s*setErr\([^)]*\);\s*\n/g,
        replacement: ''
      },
      {
        regex: /\s*setError\([^)]*\);\s*\n/g,
        replacement: ''
      },
      // تبسيط catch blocks الكاملة
      {
        regex: /} catch \([^)]*\) \{\s*const msg[^}]*setErr[^}]*throw [^;]*;\s*\n?\s*}/g,
        replacement: '} catch (error: any) {\n    throw error;\n  }'
      },
      {
        regex: /catch \([^)]*\) \{\s*const msg[^}]*setErr[^}]*throw [^;]*;\s*\n?\s*}/g,
        replacement: 'catch (error: any) {\n    throw error;\n  }'
      },
      // إزالة error state declarations
      {
        regex: /\s*const \[error, setErr\] = React\.useState\([^)]*\);\s*\n/g,
        replacement: ''
      },
      {
        regex: /\s*const \[error, setError\] = React\.useState\([^)]*\);\s*\n/g,
        replacement: ''
      },
      // إزالة error Snackbar components
      {
        regex: /\s*<Snackbar[^>]*error[^>]*>[\s\S]*?<\/Snackbar>\s*\n?/g,
        replacement: ''
      },
      {
        regex: /\s*<Snackbar[^>]*open=\{!!error\}[^>]*>[\s\S]*?<\/Snackbar>\s*\n?/g,
        replacement: ''
      }
    ];
    
    patterns.forEach(pattern => {
      const originalContent = content;
      content = content.replace(pattern.regex, pattern.replacement);
      if (content !== originalContent) {
        modified = true;
      }
    });
    
    // تنظيف imports غير المستخدمة
    const unusedImports = ['Snackbar', 'Alert'];
    
    unusedImports.forEach(importName => {
      // إزالة import من قائمة imports
      const importRegex = new RegExp(`\\s*,?\\s*${importName}\\s*,?`, 'g');
      const originalContent = content;
      content = content.replace(importRegex, '');
      if (content !== originalContent) {
        modified = true;
      }
    });
    
    // تنظيف imports فارغة أو مع فواصل زائدة
    content = content.replace(/import\s*{\s*,?\s*}\s*from[^;]*;\s*\n/g, '');
    content = content.replace(/import\s*{\s*,\s*([^}]+)\s*}\s*from/g, 'import { $1 } from');
    content = content.replace(/import\s*{\s*([^}]+)\s*,\s*}\s*from/g, 'import { $1 } from');
    
    // تنظيف أسطر فارغة متتالية
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ تم تنظيف: ${path.relative(process.cwd(), filePath)}`);
    }
  }
  
  function walkDirectory(dir) {
    if (!fs.existsSync(dir)) {
      console.error(`❌ المجلد غير موجود: ${dir}`);
      return;
    }
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // تجاهل مجلدات معينة
        if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
          walkDirectory(filePath);
        }
      } else {
        processFile(filePath);
      }
    });
  }
  
  walkDirectory(srcDir);
  console.log('🎉 تم تنظيف المشروع بنجاح!');
}

// تشغيل التنظيف
cleanupProject();
