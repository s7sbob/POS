// File: src/utils/api/pagesApi/posScreensApi.ts
import api from '../../axios';

export type PosScreen = {
  id: string;
  name: string;
  parentId: string | null;
  parentScreen: PosScreen | null;
  subScreens: PosScreen[];
  isVisible: boolean;
  displayOrder: number;
  colorHex: string;
  icon: string;
  products: any[];
  isActive: boolean;
  createdOn: string;
  lastModifiedOn: string;
  createUser: string;
  lastModifyUser: string;
  createCompany: string;
  createBranch: string;
  children?: PosScreen[];
};

const toPosScreen = (raw: any): PosScreen => {
  if (!raw || !raw.screenId) {
    console.warn('Invalid screen data:', raw);
    return null as any;
  }

  return {
    id: raw.screenId,
    name: raw.screenName || '',
    parentId: raw.parentScreenId || null,
    parentScreen: raw.parentScreen ? toPosScreen(raw.parentScreen) : null,
    subScreens: (raw.subScreens || []).filter((s: any) => s !== null).map(toPosScreen) || [],
    isVisible: Boolean(raw.isVisible),
    displayOrder: Number(raw.displayOrder) || 0,
    colorHex: raw.colorHex || '#2196F3',
    icon: raw.icon || '📱',
    products: raw.products || [],
    isActive: Boolean(raw.isActive),
    createdOn: raw.createDate || '',
    lastModifiedOn: raw.lastModifyDate || '',
    createUser: raw.createUser || '',
    lastModifyUser: raw.lastModifyUser || '',
    createCompany: raw.createCompany || '',
    createBranch: raw.createBranch || '',
  };
};

// تحويل البيانات المسطحة إلى هيكل شجري محسن
const buildTree = (screens: PosScreen[]): PosScreen[] => {
  console.log('Building tree from screens:', screens);
  
  // فلترة الشاشات الصحيحة فقط
  const validScreens = screens.filter(screen => screen && screen.id);
  
  if (validScreens.length === 0) {
    console.warn('No valid screens found');
    return [];
  }

  const screenMap = new Map<string, PosScreen>();
  const roots: PosScreen[] = [];

  // إنشاء خريطة للشاشات
  validScreens.forEach(screen => {
    screenMap.set(screen.id, { ...screen, children: [] });
  });

  // بناء الشجرة
  validScreens.forEach(screen => {
    const screenNode = screenMap.get(screen.id)!;
    if (screen.parentId && screenMap.has(screen.parentId)) {
      const parent = screenMap.get(screen.parentId)!;
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(screenNode);
    } else {
      roots.push(screenNode);
    }
  });

  // ترتيب العناصر حسب displayOrder
  const sortByDisplayOrder = (items: PosScreen[]): PosScreen[] => {
    return items.sort((a, b) => a.displayOrder - b.displayOrder).map(item => ({
      ...item,
      children: item.children ? sortByDisplayOrder(item.children) : []
    }));
  };

  const result = sortByDisplayOrder(roots);
  console.log('Built tree result:', result);
  return result;
};

/* ---------------- API Functions ---------------- */

export const getAll = async (): Promise<PosScreen[]> => {
  try {
    console.log('Fetching all screens...');
    const response = await api.get('/GetAllScreens');
    console.log('API Response:', response.data);
    
    if (!response.data || !response.data.data) {
      console.warn('Invalid API response structure');
      return [];
    }

    const rawScreens = response.data.data;
    console.log('Raw screens from API:', rawScreens);
    
    // تحويل البيانات الخام وفلترة العناصر الصحيحة
    const flatScreens = rawScreens
      .filter((raw: any) => raw && raw.screenId) // فلترة العناصر الصحيحة فقط
      .map(toPosScreen)
      .filter((screen: PosScreen) => screen && screen.id); // فلترة مرة أخرى بعد التحويل
    
    console.log('Converted flat screens:', flatScreens);
    
    const treeResult = buildTree(flatScreens);
    console.log('Final tree result:', treeResult);
    
    return treeResult;
  } catch (error) {
    console.error('Error in getAll:', error);
    throw error;
  }
};

export const getById = async (id: string): Promise<PosScreen> => {
  const { data } = await api.get(`/GetScreenById?id=${id}`);
  return toPosScreen(data.data);
};

export const add = async (body: {
  screenName: string;
  ParentScreenId?: string;
  isVisible: boolean;
  displayOrder: number;
  colorHex: string;
  icon: string;
}): Promise<PosScreen> => {
  const { data } = await api.post('/AddScreen', body);
  return toPosScreen(data.data);
};

export const update = async (body: {
  Screenid: string;
  screenName: string;
  ParentScreenId?: string;
  isVisible: boolean;
  displayOrder: number;
  colorHex: string;
  icon: string;
}): Promise<PosScreen> => {
  const { data } = await api.post('/updatescreen', body);
  return toPosScreen(data.data);
};

// دالة لإعادة ترتيب الشاشات
export const reorderScreens = async (screens: Array<{
  screenId: string;
  displayOrder: number;
  parentScreenId?: string;
  screenName: string;
  isVisible: boolean;
  colorHex: string;
  icon: string;
}>): Promise<void> => {
  // تحديث كل شاشة بترتيبها الجديد مع جميع البيانات المطلوبة
  await Promise.all(
    screens.map(screen => 
      api.post('/updatescreen', {
        Screenid: screen.screenId,
        screenName: screen.screenName,
        ParentScreenId: screen.parentScreenId,
        isVisible: screen.isVisible,
        displayOrder: screen.displayOrder,
        colorHex: screen.colorHex,
        icon: screen.icon
      })
    )
  );
};
