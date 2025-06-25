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

const buildTree = (screens: PosScreen[]): PosScreen[] => {
  const validScreens = screens.filter(screen => screen && screen.id);
  
  if (validScreens.length === 0) {
    return [];
  }

  const screenMap = new Map<string, PosScreen>();
  const roots: PosScreen[] = [];

  validScreens.forEach(screen => {
    screenMap.set(screen.id, { ...screen, children: [] });
  });

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

  const sortByDisplayOrder = (items: PosScreen[]): PosScreen[] => {
    return items.sort((a, b) => a.displayOrder - b.displayOrder).map(item => ({
      ...item,
      children: item.children ? sortByDisplayOrder(item.children) : []
    }));
  };

  return sortByDisplayOrder(roots);
};

export const getAll = async (): Promise<PosScreen[]> => {
  try {
    const response = await api.get('/GetAllScreens');
    
    if (!response.data || !response.data.data) {
      return [];
    }

    const rawScreens = response.data.data;
    
    const flatScreens = rawScreens
      .filter((raw: any) => raw && raw.screenId)
      .map(toPosScreen)
      .filter((screen: PosScreen) => screen && screen.id);
    
    return buildTree(flatScreens);
  } catch (error) {
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
  if (!body.screenName || body.screenName.trim() === '') {
    throw new Error('Screen name is required');
  }
  
  const requestBody = {
    screenName: body.screenName.trim(),
    ...(body.ParentScreenId && { ParentScreenId: body.ParentScreenId }),
    isVisible: Boolean(body.isVisible),
    displayOrder: Number(body.displayOrder),
    colorHex: body.colorHex,
    icon: body.icon
  };
  
  const { data } = await api.post('/AddScreen', requestBody);
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
  if (!body.screenName || body.screenName.trim() === '') {
    throw new Error('Screen name is required');
  }
  
  const requestBody = {
    Screenid: body.Screenid,
    screenName: body.screenName.trim(),
    ...(body.ParentScreenId && { ParentScreenId: body.ParentScreenId }),
    isVisible: Boolean(body.isVisible),
    displayOrder: Number(body.displayOrder),
    colorHex: body.colorHex,
    icon: body.icon
  };
  
  const { data } = await api.post('/updatescreen', requestBody);
  return toPosScreen(data.data);
};

export const reorderScreens = async (screens: Array<{
  screenId: string;
  displayOrder: number;
  parentScreenId?: string;
  screenName: string;
  isVisible: boolean;
  colorHex: string;
  icon: string;
}>): Promise<void> => {
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
