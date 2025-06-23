// File: scripts/updatePagesWithPermissions.js
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

// الصفحات المطلوب تحديثها
const PAGES_TO_UPDATE = [
  'src/Pages/products/ProductsPage.tsx',
  'src/Pages/groups/GroupsPage.tsx', 
  'src/Pages/units/UnitsPage.tsx',
  'src/Pages/suppliers/SuppliersPage.tsx',
  'src/Pages/warehouses/WarehousesPage.tsx',
  'src/Pages/accounts/AccountsPage.tsx',
  'src/Pages/safes/SafesPage.tsx',
  'src/Pages/pos-screens/PosScreensPage.tsx',
  'src/Pages/pos-payment-methods/PosPaymentMethodsPage.tsx',
  'src/Pages/inventory/adjustments-list/AdjustmentsListPage.tsx',
  'src/Pages/purchase-orders/PurchaseOrdersPage.tsx',
  'src/Pages/purchases/PurchasesPage.tsx',
  'src/Pages/reports/ProductBalanceReportPage.tsx'
];

// Interface للصلاحيات
const PERMISSION_INTERFACE = `
interface PermissionProps {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canView?: boolean;
}`;

// Props destructuring
const PERMISSION_PROPS = `  canAdd = false,
  canEdit = false,
  canDelete = false,
  canExport = false,
  canImport = false,
  canView = true,`;

// دالة لتحديث ملف واحد
function updatePageFile(filePath) {
  try {
    if (!existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. إضافة PermissionProps interface
    if (!content.includes('interface PermissionProps')) {
      const importIndex = content.lastIndexOf('import');
      const nextLineIndex = content.indexOf('\n', importIndex);
      content = content.slice(0, nextLineIndex + 1) + PERMISSION_INTERFACE + '\n' + content.slice(nextLineIndex + 1);
      modified = true;
    }

    // 2. تحديث Props interface
    if (content.includes('interface Props') && !content.includes('extends PermissionProps')) {
      content = content.replace(
        /interface Props(\s*{)/g,
        'interface Props extends PermissionProps$1'
      );
      modified = true;
    }

    // 3. إضافة Props interface إذا مش موجود
    if (!content.includes('interface Props')) {
      const permissionInterfaceIndex = content.indexOf('interface PermissionProps');
      const nextInterfaceIndex = content.indexOf('\n}', permissionInterfaceIndex) + 2;
      const propsInterface = `
interface Props extends PermissionProps {
  // Add other props here if needed
}`;
      content = content.slice(0, nextInterfaceIndex) + propsInterface + '\n' + content.slice(nextInterfaceIndex);
      modified = true;
    }

    // 4. تحديث Component props
    const componentRegex = /const\s+(\w+):\s*React\.FC<[^>]*>\s*=\s*\(\s*{([^}]*)}\s*\)/;
    const componentMatch = content.match(componentRegex);
    
    if (componentMatch && !componentMatch[2].includes('canAdd')) {
      const existingProps = componentMatch[2].trim();
      const newProps = existingProps ? 
        `${existingProps},\n${PERMISSION_PROPS}` : 
        PERMISSION_PROPS;
      
      content = content.replace(componentMatch[0], 
        componentMatch[0].replace(`{${componentMatch[2]}}`, `{\n${newProps}\n  ...otherProps\n}`)
      );
      modified = true;
    }

    // 5. تحديث الأزرار والعناصر المحمية
    // Add button with permission
    if (content.includes('IconPlus') && !content.includes('canAdd &&')) {
      content = content.replace(
        /<Button([^>]*startIcon={<IconPlus[^>]*>)/g,
        '{canAdd && (\n        <Button$1'
      );
      content = content.replace(
        /(<Button[^>]*IconPlus[^>]*>[^<]*<\/Button>)/g,
        '$1\n        )}'
      );
      modified = true;
    }

    // Edit button with permission  
    if (content.includes('IconEdit') && !content.includes('canEdit &&')) {
      content = content.replace(
        /<IconButton([^>]*onClick[^>]*handleEdit[^>]*>)/g,
        '{canEdit && (\n                    <IconButton$1'
      );
      content = content.replace(
        /(<IconButton[^>]*handleEdit[^>]*>[^<]*<\/IconButton>)/g,
        '$1\n                  )}'
      );
      modified = true;
    }

    // Delete button with permission
    if (content.includes('IconTrash') && !content.includes('canDelete &&')) {
      content = content.replace(
        /<IconButton([^>]*onClick[^>]*handleDelete[^>]*>)/g,
        '{canDelete && (\n                    <IconButton$1'
      );
      content = content.replace(
        /(<IconButton[^>]*handleDelete[^>]*>[^<]*<\/IconButton>)/g,
        '$1\n                  )}'
      );
      modified = true;
    }

    // ImportExportManager with permissions
    if (content.includes('ImportExportManager') && !content.includes('showImport=')) {
      content = content.replace(
        /(<ImportExportManager[^>]*)/g,
        '$1\n          showImport={canImport}\n          showExport={canExport}'
      );
      modified = true;
    }

    // حفظ الملف إذا تم تعديله
    if (modified) {
      writeFileSync(filePath, content);
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }

  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// تشغيل السكريبت
console.log('🚀 Starting automatic page updates...\n');

PAGES_TO_UPDATE.forEach(updatePageFile);

console.log('\n🎉 All pages processed!');
console.log('\n📝 Next steps:');
console.log('1. Review the updated files');
console.log('2. Test each page to ensure permissions work correctly');
console.log('3. Add any missing imports if needed');
