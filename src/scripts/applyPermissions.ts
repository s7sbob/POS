// File: scripts/applyPermissions.ts
import fs from 'fs';

const PAGES_TO_UPDATE = [
  'src/pages/products/ProductsPage.tsx',
  'src/pages/groups/GroupsPage.tsx',
  'src/pages/units/UnitsPage.tsx',
  'src/pages/suppliers/SuppliersPage.tsx',
  'src/pages/warehouses/WarehousesPage.tsx',
  'src/pages/accounts/AccountsPage.tsx',
  'src/pages/safes/SafesPage.tsx',
  'src/pages/pos-screens/PosScreensPage.tsx',
  'src/pages/pos-payment-methods/PosPaymentMethodsPage.tsx',
  // أضف باقي الصفحات
];

const PERMISSION_PROPS_INTERFACE = `
interface PermissionProps {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canView?: boolean;
}
`;

const PERMISSION_PROPS_DESTRUCTURING = `
  canAdd = false,
  canEdit = false,
  canDelete = false,
  canExport = false,
  canImport = false,
  canView = true,
`;

// دالة لتحديث ملف واحد
function updatePageFile(filePath: string) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // إضافة interface للصلاحيات
    if (!content.includes('interface PermissionProps')) {
      const interfaceIndex = content.indexOf('interface Props');
      if (interfaceIndex !== -1) {
        content = content.slice(0, interfaceIndex) + PERMISSION_PROPS_INTERFACE + '\n' + content.slice(interfaceIndex);
      }
    }
    
    // تحديث Props interface
    content = content.replace(
      /interface Props\s*{/,
      'interface Props extends PermissionProps {'
    );
    
    // إضافة destructuring للصلاحيات
    const componentMatch = content.match(/const\s+\w+Page:\s*React\.FC<Props>\s*=\s*\(\s*{([^}]*)}\s*\)/);
    if (componentMatch && !componentMatch[1].includes('canAdd')) {
      const newProps = componentMatch[1].trim() ? componentMatch[1] + ',\n' + PERMISSION_PROPS_DESTRUCTURING : PERMISSION_PROPS_DESTRUCTURING;
      content = content.replace(componentMatch[0], componentMatch[0].replace(componentMatch[1], newProps));
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error);
  }
}

// تطبيق التحديثات على كل الصفحات
PAGES_TO_UPDATE.forEach(updatePageFile);

console.log('🎉 All pages updated with permission props!');
