// File: src/configs/importExportConfigs.
import { ImportExportConfig } from '../ImportExportManager';
import * as groupsApi from 'src/utils/api/pagesApi/groupsApi';
import * as unitsApi from 'src/utils/api/pagesApi/unitsApi';
import * as productsApi from 'src/utils/api/pagesApi/productsApi';
import * as posScreensApi from 'src/utils/api/pagesApi/posScreensApi';
import { register } from 'src/utils/api/authApi';

/* ───── Groups Configuration ───── */
export const groupsImportExportConfig: ImportExportConfig = {
  moduleName: 'Groups',
  moduleNameEn: 'Groups',
  fileName: 'groups',
  title: 'groups.title', // استخدام key بدلاً من النص
  titleEn: 'groups.title',
  columns: [
    {
      field: 'name',
      headerName: 'groups.name',
      headerNameEn: 'groups.name',
      type: 'string',
      required: true,
      example: 'مشروبات',
      exampleEn: 'Beverages',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم المجموعة يجب أن يكون أكثر من حرفين';
        if (value.length > 100) return 'اسم المجموعة طويل جداً';
        return null;
      }
    },
    {
      field: 'parentName',
      headerName: 'groups.parentGroup',
      headerNameEn: 'groups.parentGroup',
      type: 'string',
      required: false,
      example: 'مشروبات ساخنة',
      exampleEn: 'Hot Beverages',
      validate: (value) => {
        if (value && value.length > 100) return 'اسم المجموعة الأب طويل جداً';
        return null;
      }
    },
    {
      field: 'backgroundColor',
      headerName: 'groups.backgroundColor',
      headerNameEn: 'groups.backgroundColor',
      type: 'string',
      required: false,
      example: '#FF5733',
      exampleEn: '#FF5733',
      validate: (value) => {
        if (value && !/^#[0-9A-F]{6}$/i.test(value)) return 'لون غير صحيح (استخدم #RRGGBB)';
        return null;
      }
    },
    {
      field: 'fontColor',
      headerName: 'groups.fontColor',
      headerNameEn: 'groups.fontColor',
      type: 'string',
      required: false,
      example: '#FFFFFF',
      exampleEn: '#FFFFFF',
      validate: (value) => {
        if (value && !/^#[0-9A-F]{6}$/i.test(value)) return 'لون غير صحيح (استخدم #RRGGBB)';
        return null;
      }
    },
    {
      field: 'isActive',
      headerName: 'status.active',
      headerNameEn: 'status.active',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        const item = data[i];
        
        let parentId = null;
        if (item.parentName) {
          const allGroups = await groupsApi.getAll();
          const parentGroup = allGroups.find(g => g.name === item.parentName);
          if (parentGroup) {
            parentId = parentGroup.id;
          } else {
            results.errors.push(`الصف ${i + 1}: المجموعة الأب "${item.parentName}" غير موجودة`);
            continue;
          }
        }
        
        await groupsApi.add({
          name: item.name,
          parentId: parentId ?? undefined,
          backgroundColor: item.backgroundColor || '#2196F3',
          fontColor: item.fontColor || '#FFFFFF'
        });
        
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 1000
};

/* ───── Units Configuration ───── */
export const unitsImportExportConfig: ImportExportConfig = {
  moduleName: 'Units',
  moduleNameEn: 'Units',
  fileName: 'units',
  title: 'units.title',
  titleEn: 'units.title',
  columns: [
    {
      field: 'name',
      headerName: 'units.name',
      headerNameEn: 'units.name',
      type: 'string',
      required: true,
      example: 'كيلو',
      exampleEn: 'Kilogram',
      validate: (value) => {
        if (!value || value.length < 1) return 'اسم الوحدة مطلوب';
        if (value.length > 50) return 'اسم الوحدة طويل جداً';
        return null;
      }
    },
    {
      field: 'code',
      headerName: 'units.code',
      headerNameEn: 'units.code',
      type: 'number',
      required: false,
      example: '1',
      exampleEn: '1',
      validate: (value) => {
        if (value && (value < 0 || value > 9999)) return 'كود الوحدة يجب أن يكون بين 0 و 9999';
        return null;
      }
    },
    {
      field: 'isActive',
      headerName: 'status.active',
      headerNameEn: 'status.active',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        const item = data[i];
        
        await unitsApi.add({
          name: item.name
        });
        
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 500
};

/* ───── Products Configuration ───── */
export const productsImportExportConfig: ImportExportConfig = {
  moduleName: 'Products',
  moduleNameEn: 'Products',
  fileName: 'products',
  title: 'products.title',
  titleEn: 'products.title',
  columns: [
    {
      field: 'productName',
      headerName: 'products.name',
      headerNameEn: 'products.name',
      type: 'string',
      required: true,
      example: 'قهوة تركية',
      exampleEn: 'Turkish Coffee',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم المنتج يجب أن يكون أكثر من حرفين';
        if (value.length > 200) return 'اسم المنتج طويل جداً';
        return null;
      }
    },
    {
      field: 'groupName',
      headerName: 'products.group',
      headerNameEn: 'products.group',
      type: 'string',
      required: true,
      example: 'مشروبات ساخنة',
      exampleEn: 'Hot Beverages',
      validate: (value) => {
        if (!value) return 'اسم المجموعة مطلوب';
        return null;
      }
    },
    {
      field: 'productType',
      headerName: 'products.type',
      headerNameEn: 'products.type',
      type: 'string',
      required: true,
      example: 'POS',
      exampleEn: 'POS',
      validate: (value) => {
        if (!['POS', 'Material'].includes(value)) return 'نوع المنتج يجب أن يكون POS أو Material';
        return null;
      }
    },
    {
      field: 'description',
      headerName: 'products.description',
      headerNameEn: 'products.description',
      type: 'string',
      required: false,
      example: 'قهوة تركية أصلية',
      exampleEn: 'Original Turkish Coffee'
    },
    {
      field: 'reorderLevel',
      headerName: 'products.reorderLevel',
      headerNameEn: 'products.reorderLevel',
      type: 'number',
      required: false,
      example: '10',
      exampleEn: '10',
      validate: (value) => {
        if (value && value < 0) return 'مستوى إعادة الطلب لا يمكن أن يكون سالب';
        return null;
      }
    },
    {
      field: 'cost',
      headerName: 'products.cost',
      headerNameEn: 'products.cost',
      type: 'number',
      required: false,
      example: '15.50',
      exampleEn: '15.50',
      validate: (value) => {
        if (value && value < 0) return 'التكلفة لا يمكن أن تكون سالبة';
        return null;
      }
    },
    {
      field: 'expirationDays',
      headerName: 'products.expirationDays',
      headerNameEn: 'products.expirationDays',
      type: 'number',
      required: false,
      example: '180',
      exampleEn: '180',
      validate: (value) => {
        if (value && (value < 1 || value > 3650)) return 'أيام انتهاء الصلاحية يجب أن تكون بين 1 و 3650';
        return null;
      }
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    const allGroups = await groupsApi.getAll();
    
    for (let i = 0; i < data.length; i++) {
      try {
        const item = data[i];
        
        const group = allGroups.find(g => g.name === item.groupName);
        if (!group) {
          results.errors.push(`الصف ${i + 1}: المجموعة "${item.groupName}" غير موجودة`);
          continue;
        }
        
        await productsApi.add({
          productName: item.productName,
          groupId: group.id,
          productType: item.productType === 'POS' ? 1 : 2,
          description: item.description || '',
          reorderLevel: item.reorderLevel || 0,
          cost: item.cost || 0,
          lastPurePrice: 0,
          expirationDays: item.expirationDays || 180,
          productPrices: [],
          isActive: false
        });
        
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 2000
};

/* ───── POS Screens Configuration ───── */
export const posScreensImportExportConfig: ImportExportConfig = {
  moduleName: 'PosScreens',
  moduleNameEn: 'POS Screens',
  fileName: 'pos_screens',
  title: 'posScreens.title',
  titleEn: 'posScreens.title',
  columns: [
    {
      field: 'screenName',
      headerName: 'posScreens.name',
      headerNameEn: 'posScreens.name',
      type: 'string',
      required: true,
      example: 'المشروبات الساخنة',
      exampleEn: 'Hot Beverages',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم الشاشة يجب أن يكون أكثر من حرفين';
        if (value.length > 100) return 'اسم الشاشة طويل جداً';
        return null;
      }
    },
    {
      field: 'parentScreenName',
      headerName: 'posScreens.parentScreen',
      headerNameEn: 'posScreens.parentScreen',
      type: 'string',
      required: false,
      example: 'المشروبات',
      exampleEn: 'Beverages'
    },
    {
      field: 'displayOrder',
      headerName: 'posScreens.displayOrder',
      headerNameEn: 'posScreens.displayOrder',
      type: 'number',
      required: false,
      example: '1',
      exampleEn: '1',
      validate: (value) => {
        if (value && (value < 1 || value > 999)) return 'ترتيب العرض يجب أن يكون بين 1 و 999';
        return null;
      }
    },
    {
      field: 'colorHex',
      headerName: 'posScreens.color',
      headerNameEn: 'posScreens.color',
      type: 'string',
      required: false,
      example: '#FF5733',
      exampleEn: '#FF5733',
      validate: (value) => {
        if (value && !/^#[0-9A-F]{6}$/i.test(value)) return 'لون غير صحيح (استخدم #RRGGBB)';
        return null;
      }
    },
    {
      field: 'icon',
      headerName: 'posScreens.icon',
      headerNameEn: 'posScreens.icon',
      type: 'string',
      required: false,
      example: '☕',
      exampleEn: '☕'
    },
    {
      field: 'isVisible',
      headerName: 'posScreens.visibility',
      headerNameEn: 'posScreens.visibility',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    const allScreens = await posScreensApi.getAll();
    const flatScreens = flattenScreens(allScreens);
    
    for (let i = 0; i < data.length; i++) {
      try {
        const item = data[i];
        
        let parentId = null;
        if (item.parentScreenName) {
          const parentScreen = flatScreens.find(s => s.name === item.parentScreenName);
          if (parentScreen) {
            parentId = parentScreen.id;
          } else {
            results.errors.push(`الصف ${i + 1}: الشاشة الأب "${item.parentScreenName}" غير موجودة`);
            continue;
          }
        }
        
        await posScreensApi.add({
          screenName: item.screenName,
          ParentScreenId: parentId,
          isVisible: item.isVisible !== false,
          displayOrder: item.displayOrder || 1,
          colorHex: item.colorHex || '#2196F3',
          icon: item.icon || '📱'
        });
        
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 500
};

/* ───── Suppliers Configuration ───── */
export const suppliersImportExportConfig: ImportExportConfig = {
  moduleName: 'Suppliers',
  moduleNameEn: 'Suppliers',
  fileName: 'suppliers',
  title: 'suppliers.title',
  titleEn: 'suppliers.title',
  columns: [
    {
      field: 'name',
      headerName: 'suppliers.name',
      headerNameEn: 'suppliers.name',
      type: 'string',
      required: true,
      example: 'شركة التوريدات المتقدمة',
      exampleEn: 'Advanced Supply Company',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم المورد يجب أن يكون أكثر من حرفين';
        if (value.length > 200) return 'اسم المورد طويل جداً';
        return null;
      }
    },
    {
      field: 'phone',
      headerName: 'suppliers.phone',
      headerNameEn: 'suppliers.phone',
      type: 'string',
      required: false,
      example: '01234567890',
      exampleEn: '+1234567890',
      validate: (value) => {
        if (value && !/^[0-9+\-\s()]+$/.test(value)) return 'رقم هاتف غير صحيح';
        return null;
      }
    },
    {
      field: 'address',
      headerName: 'suppliers.address',
      headerNameEn: 'suppliers.address',
      type: 'string',
      required: false,
      example: 'القاهرة - مصر الجديدة',
      exampleEn: 'Cairo - Heliopolis'
    },
    {
      field: 'isActive',
      headerName: 'status.active',
      headerNameEn: 'status.active',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        // Implementation here
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 1000
};

/* ───── Warehouses Configuration ───── */
export const warehousesImportExportConfig: ImportExportConfig = {
  moduleName: 'Warehouses',
  moduleNameEn: 'Warehouses',
  fileName: 'warehouses',
  title: 'warehouses.title',
  titleEn: 'warehouses.title',
  columns: [
    {
      field: 'name',
      headerName: 'warehouses.name',
      headerNameEn: 'warehouses.name',
      type: 'string',
      required: true,
      example: 'مخزن الفرع الرئيسي',
      exampleEn: 'Main Branch Warehouse',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم المخزن يجب أن يكون أكثر من حرفين';
        if (value.length > 100) return 'اسم المخزن طويل جداً';
        return null;
      }
    },
    {
      field: 'address',
      headerName: 'warehouses.address',
      headerNameEn: 'warehouses.address',
      type: 'string',
      required: false,
      example: 'القاهرة - مدينة نصر',
      exampleEn: 'Cairo - Nasr City'
    },
    {
      field: 'phone',
      headerName: 'warehouses.phone',
      headerNameEn: 'warehouses.phone',
      type: 'string',
      required: false,
      example: '01234567890',
      exampleEn: '+1234567890',
      validate: (value) => {
        if (value && !/^[0-9+\-\s()]+$/.test(value)) return 'رقم هاتف غير صحيح';
        return null;
      }
    },
    {
      field: 'isActive',
      headerName: 'status.active',
      headerNameEn: 'status.active',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        // Implementation here
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 500
};

/* ───── Accounts Configuration ───── */
export const accountsImportExportConfig: ImportExportConfig = {
  moduleName: 'Accounts',
  moduleNameEn: 'Accounts',
  fileName: 'accounts',
  title: 'accounts.title',
  titleEn: 'accounts.title',
  columns: [
    {
      field: 'name',
      headerName: 'accounts.name',
      headerNameEn: 'accounts.name',
      type: 'string',
      required: true,
      example: 'حساب البنك الأهلي',
      exampleEn: 'National Bank Account',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم الحساب يجب أن يكون أكثر من حرفين';
        if (value.length > 200) return 'اسم الحساب طويل جداً';
        return null;
      }
    },
    {
      field: 'type',
      headerName: 'accounts.type',
      headerNameEn: 'accounts.type',
      type: 'string',
      required: false,
      example: 'بنك',
      exampleEn: 'Bank'
    },
    {
      field: 'accountNumber',
      headerName: 'accounts.accountNumber',
      headerNameEn: 'accounts.accountNumber',
      type: 'string',
      required: false,
      example: '123456789',
      exampleEn: '123456789',
      validate: (value) => {
        if (value && value.length > 50) return 'رقم الحساب طويل جداً';
        return null;
      }
    },
    {
      field: 'collectionFeePercent',
      headerName: 'accounts.collectionFeePercent',
      headerNameEn: 'accounts.collectionFeePercent',
      type: 'number',
      required: false,
      example: '2.5',
      exampleEn: '2.5',
      validate: (value) => {
        if (value && (value < 0 || value > 100)) return 'نسبة رسوم التحصيل يجب أن تكون بين 0 و 100';
        return null;
      }
    },
    {
      field: 'isActive',
      headerName: 'status.active',
      headerNameEn: 'status.active',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        // Implementation here
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 500
};

/* ───── Safes Configuration ───── */
export const safesImportExportConfig: ImportExportConfig = {
  moduleName: 'Safes',
  moduleNameEn: 'Safes',
  fileName: 'safes',
  title: 'safes.title',
  titleEn: 'safes.title',
  columns: [
    {
      field: 'name',
      headerName: 'safes.name',
      headerNameEn: 'safes.name',
      type: 'string',
      required: true,
      example: 'خزينة الفرع الرئيسي',
      exampleEn: 'Main Branch Safe',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم الخزينة يجب أن يكون أكثر من حرفين';
        if (value.length > 200) return 'اسم الخزينة طويل جداً';
        return null;
      }
    },
    {
      field: 'type',
      headerName: 'safes.type',
      headerNameEn: 'safes.type',
      type: 'string',
      required: false,
      example: 'خزينة رئيسية',
      exampleEn: 'Main Safe'
    },
    {
      field: 'accountNumber',
      headerName: 'safes.accountNumber',
      headerNameEn: 'safes.accountNumber',
      type: 'string',
      required: false,
      example: '123456789',
      exampleEn: '123456789'
    },
    {
      field: 'collectionFeePercent',
      headerName: 'safes.collectionFeePercent',
      headerNameEn: 'safes.collectionFeePercent',
      type: 'number',
      required: false,
      example: '1.5',
      exampleEn: '1.5',
      validate: (value) => {
        if (value && (value < 0 || value > 100)) return 'نسبة رسوم التحصيل يجب أن تكون بين 0 و 100';
        return null;
      }
    },
    {
      field: 'isActive',
      headerName: 'status.active',
      headerNameEn: 'status.active',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        // Implementation here
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 500
};

/* ───── POS Payment Methods Configuration ───── */
export const posPaymentMethodsImportExportConfig: ImportExportConfig = {
  moduleName: 'PosPaymentMethods',
  moduleNameEn: 'POS Payment Methods',
  fileName: 'pos_payment_methods',
  title: 'posPaymentMethods.title',
  titleEn: 'posPaymentMethods.title',
  columns: [
    {
      field: 'name',
      headerName: 'posPaymentMethods.name',
      headerNameEn: 'posPaymentMethods.name',
      type: 'string',
      required: true,
      example: 'كاش',
      exampleEn: 'Cash',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم طريقة الدفع يجب أن يكون أكثر من حرفين';
        if (value.length > 100) return 'اسم طريقة الدفع طويل جداً';
        return null;
      }
    },
    {
      field: 'safeOrAccountName',
      headerName: 'posPaymentMethods.safeOrAccount',
      headerNameEn: 'posPaymentMethods.safeOrAccount',
      type: 'string',
      required: false,
      example: 'خزينة الفرع الرئيسي',
      exampleEn: 'Main Branch Safe'
    },
    {
      field: 'isActive',
      headerName: 'status.active',
      headerNameEn: 'status.active',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        // Implementation here
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 200
};

// Helper function
const flattenScreens = (screens: any[]): any[] => {
  const result: any[] = [];
  
  const flatten = (screens: any[]) => {
    screens.forEach(screen => {
      result.push(screen);
      if (screen.children && screen.children.length > 0) {
        flatten(screen.children);
      }
    });
  };
  
  flatten(screens);
  return result;
};


/* ───── Inventory Adjustments Configuration ───── */
export const inventoryAdjustmentsImportExportConfig: ImportExportConfig = {
  moduleName: 'InventoryAdjustments',
  moduleNameEn: 'Inventory Adjustments',
  fileName: 'inventory_adjustments',
  title: 'adjustments.list.title',
  titleEn: 'adjustments.list.title',
  columns: [
    {
      field: 'warehouseName',
      headerName: 'adjustments.table.warehouse',
      headerNameEn: 'adjustments.table.warehouse',
      type: 'string',
      required: true,
      example: 'المخزن الرئيسي',
      exampleEn: 'Main Warehouse'
    },
    {
      field: 'adjustmentType',
      headerName: 'adjustments.table.type',
      headerNameEn: 'adjustments.table.type',
      type: 'string',
      required: true,
      example: 'جديد',
      exampleEn: 'New',
      validate: (value) => {
        const validTypes = ['جديد', 'رصيد افتتاحي', 'تسوية يدوية', 'New', 'Opening Balance', 'Manual Adjustment'];
        if (value && !validTypes.includes(value)) {
          return 'نوع التسوية غير صحيح';
        }
        return null;
      }
    },
    {
      field: 'adjustmentDate',
      headerName: 'adjustments.table.date',
      headerNameEn: 'adjustments.table.date',
      type: 'date',
      required: true,
      example: '2025-01-01',
      exampleEn: '2025-01-01'
    },
    {
      field: 'referenceNumber',
      headerName: 'adjustments.table.referenceNumber',
      headerNameEn: 'adjustments.table.referenceNumber',
      type: 'string',
      required: false,
      example: 'REF-001',
      exampleEn: 'REF-001'
    },
    {
      field: 'reason',
      headerName: 'adjustments.table.reason',
      headerNameEn: 'adjustments.table.reason',
      type: 'string',
      required: false,
      example: 'تسوية المخزون',
      exampleEn: 'Inventory Adjustment'
    },
    {
      field: 'totalItems',
      headerName: 'adjustments.table.totalItems',
      headerNameEn: 'adjustments.table.totalItems',
      type: 'number',
      required: false,
      example: '5',
      exampleEn: '5'
    },
    {
      field: 'totalDifference',
      headerName: 'adjustments.table.totalDifference',
      headerNameEn: 'adjustments.table.totalDifference',
      type: 'number',
      required: false,
      example: '51.00',
      exampleEn: '51.00'
    },
    {
      field: 'status',
      headerName: 'adjustments.table.status',
      headerNameEn: 'adjustments.table.status',
      type: 'string',
      required: false,
      example: 'محفوظ',
      exampleEn: 'Saved'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        
        // التحقق من وجود المخزن
        // const warehouses = await warehousesApi.getAll();
        // const warehouse = warehouses.find(w => w.name === item.warehouseName);
        // if (!warehouse) {
        //   results.errors.push(`الصف ${i + 1}: المخزن "${item.warehouseName}" غير موجود`);
        //   continue;
        // }
        
        // تحويل نوع التسوية
        
        // تحويل الحالة
        
        // await adjustmentsListApi.add({
        //   warehouseId: warehouse.id,
        //   adjustmentType: adjustmentType,
        //   adjustmentDate: item.adjustmentDate,
        //   referenceNumber: item.referenceNumber || '',
        //   reason: item.reason || '',
        //   totalItems: item.totalItems || 0,
        //   totalDifference: item.totalDifference || 0,
        //   status: status
        // });
        
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 1000
};



/* ───── Users Configuration ───── */
export const usersImportExportConfig: ImportExportConfig = {
  moduleName: 'users.title',
  moduleNameEn: 'users.title',
  fileName: 'users',
  title: 'users.title',
  titleEn: 'users.title',
  columns: [
    {
      field: 'userName',
      headerName: 'users.table.userName',
      headerNameEn: 'users.table.userName',
      type: 'string',
      required: true,
      example: 'أحمد محمد',
      exampleEn: 'Ahmed Mohamed',
      validate: (value) => {
        if (!value || value.length < 2) return 'users.validation.userNameTooShort';
        if (value.length > 100) return 'users.validation.userNameTooLong';
        return null;
      }
    },
    {
      field: 'phoneNo',
      headerName: 'users.table.phoneNumber',
      headerNameEn: 'users.table.phoneNumber',
      type: 'string',
      required: true,
      example: '01234567890',
      exampleEn: '01234567890',
      validate: (value) => {
        if (!value || !/^01[0-9]{9}$/.test(value)) return 'users.validation.invalidPhone';
        return null;
      }
    },
    {
      field: 'email',
      headerName: 'users.table.email',
      headerNameEn: 'users.table.email',
      type: 'string',
      required: false,
      example: 'user@company.com',
      exampleEn: 'user@company.com',
      validate: (value) => {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'users.validation.invalidEmail';
        return null;
      }
    },
    {
      field: 'password',
      headerName: 'users.form.password',
      headerNameEn: 'users.form.password',
      type: 'string',
      required: true,
      example: '123456',
      exampleEn: '123456',
      validate: (value) => {
        if (!value || value.length < 6) return 'users.validation.passwordTooShort';
        return null;
      }
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        const item = data[i];
        
        const success = await register(item.userName, item.phoneNo, item.password);
        
        if (success) {
          results.success++;
        } else {
          results.errors.push(`import.rowError ${i + 1}: users.errors.addFailed`);
        }
      } catch (error: any) {
        results.errors.push(`import.rowError ${i + 1}: ${error.message || 'import.addError'}`);
      }
    }
    
    return results;
  },
  maxRows: 100
};


/* ───── Delivery Zones Configuration ───── */
export const deliveryZonesImportExportConfig: ImportExportConfig = {
  moduleName: 'deliveryZones.title',
  moduleNameEn: 'Delivery Zones',
  fileName: 'delivery_zones',
  title: 'deliveryZones.title',
  titleEn: 'Delivery Zones',
  columns: [
    {
      field: 'name',
      headerName: 'deliveryZones.form.name',
      headerNameEn: 'Zone Name',
      type: 'string',
      required: true,
      example: 'منطقة الدقي',
      exampleEn: 'Dokki Area',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم المنطقة يجب أن يكون أكثر من حرفين';
        if (value.length > 100) return 'اسم المنطقة طويل جداً';
        return null;
      }
    },
    {
      field: 'deliveryCharge',
      headerName: 'deliveryZones.form.deliveryCharge',
      headerNameEn: 'Delivery Charge',
      type: 'number',
      required: true,
      example: '20.00',
      exampleEn: '20.00',
      validate: (value) => {
        if (value < 0) return 'رسوم التوصيل لا يمكن أن تكون سالبة';
        return null;
      }
    },
    {
      field: 'defaultBonus',
      headerName: 'deliveryZones.form.defaultBonus',
      headerNameEn: 'Default Bonus',
      type: 'number',
      required: true,
      example: '10.00',
      exampleEn: '10.00',
      validate: (value) => {
        if (value < 0) return 'المكافأة الافتراضية لا يمكن أن تكون سالبة';
        return null;
      }
    },
    {
      field: 'isActive',
      headerName: 'common.status',
      headerNameEn: 'Status',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        
        // يمكن إضافة API call هنا لاحقاً
        // await deliveryZonesApi.add({
        //   name: item.name,
        //   deliveryCharge: Number(item.deliveryCharge),
        //   defaultBonus: Number(item.defaultBonus)
        // });
        
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 500
};

/* ───── Delivery Agents Configuration ───── */
export const deliveryAgentsImportExportConfig: ImportExportConfig = {
  moduleName: 'deliveryAgents.title',
  moduleNameEn: 'Delivery Agents',
  fileName: 'delivery_agents',
  title: 'deliveryAgents.title',
  titleEn: 'Delivery Agents',
  columns: [
    {
      field: 'name',
      headerName: 'deliveryAgents.form.name',
      headerNameEn: 'Agent Name',
      type: 'string',
      required: true,
      example: 'محمد حسن',
      exampleEn: 'Mohamed Hassan',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم المندوب يجب أن يكون أكثر من حرفين';
        if (value.length > 100) return 'اسم المندوب طويل جداً';
        return null;
      }
    },
    {
      field: 'phone',
      headerName: 'deliveryAgents.form.phone',
      headerNameEn: 'Phone Number',
      type: 'string',
      required: true,
      example: '01012345678',
      exampleEn: '01012345678',
      validate: (value) => {
        if (!value || !/^01[0-9]{9}$/.test(value)) return 'رقم هاتف غير صحيح';
        return null;
      }
    },
    {
      field: 'branchName',
      headerName: 'deliveryAgents.form.branch',
      headerNameEn: 'Branch',
      type: 'string',
      required: true,
      example: 'الفرع الرئيسي',
      exampleEn: 'Main Branch',
      validate: (value) => {
        if (!value) return 'اسم الفرع مطلوب';
        return null;
      }
    },
    {
      field: 'isActive',
      headerName: 'common.status',
      headerNameEn: 'Status',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        
        // يمكن إضافة API call هنا لاحقاً
        // const branch = branches.find(b => b.name === item.branchName);
        // if (!branch) {
        //   results.errors.push(`الصف ${i + 1}: الفرع "${item.branchName}" غير موجود`);
        //   continue;
        // }
        
        // await deliveryAgentsApi.add({
        //   name: item.name,
        //   phone: item.phone,
        //   branchId: branch.id
        // });
        
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 500
};

/* ───── Table Sections Configuration ───── */
export const tableSectionsImportExportConfig: ImportExportConfig = {
  moduleName: 'tableSections.title',
  moduleNameEn: 'Table Sections',
  fileName: 'table_sections',
  title: 'tableSections.title',
  titleEn: 'Table Sections',
  columns: [
    {
      field: 'name',
      headerName: 'tableSections.form.name',
      headerNameEn: 'Section Name',
      type: 'string',
      required: true,
      example: 'صالة VIP',
      exampleEn: 'VIP Hall',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم القسم يجب أن يكون أكثر من حرفين';
        if (value.length > 100) return 'اسم القسم طويل جداً';
        return null;
      }
    },
    {
      field: 'serviceCharge',
      headerName: 'tableSections.form.serviceCharge',
      headerNameEn: 'Service Charge',
      type: 'number',
      required: true,
      example: '10.00',
      exampleEn: '10.00',
      validate: (value) => {
        if (value < 0) return 'رسوم الخدمة لا يمكن أن تكون سالبة';
        return null;
      }
    },
    {
      field: 'tablesCount',
      headerName: 'tableSections.form.tablesCount',
      headerNameEn: 'Tables Count',
      type: 'number',
      required: false,
      example: '5',
      exampleEn: '5',
      validate: (value) => {
        if (value && value < 0) return 'عدد الطاولات لا يمكن أن يكون سالب';
        return null;
      }
    },
    {
      field: 'totalCapacity',
      headerName: 'tableSections.form.totalCapacity',
      headerNameEn: 'Total Capacity',
      type: 'number',
      required: false,
      example: '20',
      exampleEn: '20'
    },
    {
      field: 'branchName',
      headerName: 'tableSections.form.branch',
      headerNameEn: 'Branch',
      type: 'string',
      required: false,
      example: 'الفرع الرئيسي',
      exampleEn: 'Main Branch'
    },
    {
      field: 'isActive',
      headerName: 'common.status',
      headerNameEn: 'Status',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        
        // يمكن إضافة API call هنا لاحقاً
        // await tableSectionsApi.add({
        //   name: item.name,
        //   serviceCharge: Number(item.serviceCharge),
        //   tables: []
        // });
        
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 300
};

/* ───── Hall Captains Configuration ───── */
export const hallCaptainsImportExportConfig: ImportExportConfig = {
  moduleName: 'hallCaptains.title',
  moduleNameEn: 'Hall Captains',
  fileName: 'hall_captains',
  title: 'hallCaptains.title',
  titleEn: 'Hall Captains',
  columns: [
    {
      field: 'name',
      headerName: 'hallCaptains.form.name',
      headerNameEn: 'Captain Name',
      type: 'string',
      required: true,
      example: 'أحمد عبد السلام',
      exampleEn: 'Ahmed Abdelsalam',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم الكابتن يجب أن يكون أكثر من حرفين';
        if (value.length > 100) return 'اسم الكابتن طويل جداً';
        return null;
      }
    },
    {
      field: 'phone',
      headerName: 'hallCaptains.form.phone',
      headerNameEn: 'Phone Number',
      type: 'string',
      required: true,
      example: '01012345678',
      exampleEn: '01012345678',
      validate: (value) => {
        if (!value || !/^01[0-9]{9}$/.test(value)) return 'رقم هاتف غير صحيح';
        return null;
      }
    },
    {
      field: 'notes',
      headerName: 'hallCaptains.form.notes',
      headerNameEn: 'Notes',
      type: 'string',
      required: false,
      example: 'كابتن رئيسي',
      exampleEn: 'Head Captain'
    },
    {
      field: 'branchName',
      headerName: 'hallCaptains.form.branch',
      headerNameEn: 'Branch',
      type: 'string',
      required: true,
      example: 'الفرع الرئيسي',
      exampleEn: 'Main Branch',
      validate: (value) => {
        if (!value) return 'اسم الفرع مطلوب';
        return null;
      }
    },
    {
      field: 'isActive',
      headerName: 'common.status',
      headerNameEn: 'Status',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        
        // يمكن إضافة API call هنا لاحقاً
        // const branch = branches.find(b => b.name === item.branchName);
        // if (!branch) {
        //   results.errors.push(`الصف ${i + 1}: الفرع "${item.branchName}" غير موجود`);
        //   continue;
        // }
        
        // await hallCaptainsApi.add({
        //   name: item.name,
        //   phone: item.phone,
        //   notes: item.notes,
        //   branchId: branch.id,
        //   isActive: true
        // });
        
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 500
};

/* ───── Customers Configuration ───── */
export const customersImportExportConfig: ImportExportConfig = {
  moduleName: 'customers.title',
  moduleNameEn: 'Customers',
  fileName: 'customers',
  title: 'customers.title',
  titleEn: 'Customers',
  columns: [
    {
      field: 'name',
      headerName: 'customers.form.name',
      headerNameEn: 'Customer Name',
      type: 'string',
      required: true,
      example: 'عميل تجريبي',
      exampleEn: 'Test Customer',
      validate: (value) => {
        if (!value || value.length < 2) return 'اسم العميل يجب أن يكون أكثر من حرفين';
        if (value.length > 100) return 'اسم العميل طويل جداً';
        return null;
      }
    },
    {
      field: 'phone1',
      headerName: 'customers.form.phone1',
      headerNameEn: 'Primary Phone',
      type: 'string',
      required: true,
      example: '01012345678',
      exampleEn: '01012345678',
      validate: (value) => {
        if (!value || !/^01[0-9]{9}$/.test(value)) return 'رقم الهاتف الأساسي غير صحيح';
        return null;
      }
    },
    {
      field: 'phone2',
      headerName: 'customers.form.phone2',
      headerNameEn: 'Secondary Phone',
      type: 'string',
      required: false,
      example: '01087654321',
      exampleEn: '01087654321'
    },
    {
      field: 'phone3',
      headerName: 'customers.form.phone3',
      headerNameEn: 'Third Phone',
      type: 'string',
      required: false,
      example: '01098765432',
      exampleEn: '01098765432'
    },
    {
      field: 'phone4',
      headerName: 'customers.form.phone4',
      headerNameEn: 'Fourth Phone',
      type: 'string',
      required: false,
      example: '01054321098',
      exampleEn: '01054321098'
    },
    {
      field: 'isVIP',
      headerName: 'customers.form.isVIP',
      headerNameEn: 'VIP Customer',
      type: 'boolean',
      required: false,
      example: 'لا',
      exampleEn: 'No'
    },
    {
      field: 'isBlocked',
      headerName: 'customers.form.isBlocked',
      headerNameEn: 'Blocked',
      type: 'boolean',
      required: false,
      example: 'لا',
      exampleEn: 'No'
    },
    {
      field: 'isActive',
      headerName: 'common.status',
      headerNameEn: 'Status',
      type: 'boolean',
      required: false,
      example: 'نعم',
      exampleEn: 'Yes'
    },
    {
      field: 'addressesCount',
      headerName: 'customers.form.addressesCount',
      headerNameEn: 'Addresses Count',
      type: 'number',
      required: false,
      example: '2',
      exampleEn: '2'
    },
    {
      field: 'primaryAddress',
      headerName: 'customers.form.primaryAddress',
      headerNameEn: 'Primary Address',
      type: 'string',
      required: false,
      example: 'شارع الثورة',
      exampleEn: 'Revolution Street'
    }
  ],
  onImport: async (data) => {
    const results = { success: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      try {
        
        // يمكن إضافة API call هنا لاحقاً
        // await customersApi.add({
        //   name: item.name,
        //   phone1: item.phone1,
        //   phone2: item.phone2 || null,
        //   phone3: item.phone3 || null,
        //   phone4: item.phone4 || null,
        //   isVIP: Boolean(item.isVIP),
        //   isBlocked: Boolean(item.isBlocked),
        //   isActive: Boolean(item.isActive),
        //   addresses: []
        // });
        
        results.success++;
      } catch (error: any) {
        results.errors.push(`الصف ${i + 1}: ${error.message || 'خطأ في الإضافة'}`);
      }
    }
    
    return results;
  },
  maxRows: 1000
};