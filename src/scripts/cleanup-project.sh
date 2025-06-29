#!/bin/bash
# File: cleanup-project.sh

echo "🧹 بدء تنظيف المشروع..."

# إنشاء backup
echo "📦 إنشاء backup..."
cp -r src src_backup_$(date +%Y%m%d_%H%M%S)

# مسح console.log
echo "🗑️ مسح console.log statements..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i.bak -E '
/console\.(log|error|warn|info|debug)/d
'

# تنظيف try-catch blocks
echo "🔧 تنظيف try-catch blocks..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i.bak -E '
# إزالة setErr و setError statements
/setErr\(.*\);?/d
/setError\(.*\);?/d
# إزالة const msg = ... statements
/const msg = .*\|\| t\(/d
# تبسيط catch blocks
s/} catch \(e: any\) \{[^}]*setErr[^}]*throw e;/} catch (e: any) {\
    throw e;/g
s/} catch \(error: any\) \{[^}]*setErr[^}]*throw error;/} catch (error: any) {\
    throw error;/g
'

# مسح ملفات backup
find src -name "*.bak" -delete

echo "✅ تم تنظيف المشروع بنجاح!"
echo "📁 تم إنشاء backup في: src_backup_*"
