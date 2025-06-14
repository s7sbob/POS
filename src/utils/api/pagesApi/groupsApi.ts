import api from '../../axios';

export type Group = {
  id: string;
  code: number;
  name: string;
  parentId: string | null;
  parentGroup: string | null;
  backgroundColor: string;
  fontColor: string;
  isActive: boolean;
  createdOn: string;
  lastModifiedOn: string;
  createUser: string;
  lastModifyUser: string;
  createCompany: string;
  createBranch: string;
  children?: Group[];
};

const toGroup = (raw: any): Group => ({
  id: raw.groupID,
  code: raw.groupCode,
  name: raw.groupName,
  parentId: raw.parentID,
  parentGroup: raw.parentGroup,
  backgroundColor: raw.backcolor,
  fontColor: raw.fontColor,
  isActive: raw.isActive,
  createdOn: raw.createDate,
  lastModifiedOn: raw.lastModifyDate,
  createUser: raw.createUser,
  lastModifyUser: raw.lastModifyUser,
  createCompany: raw.createCompany,
  createBranch: raw.createBranch,
});

// تحويل البيانات المسطحة إلى هيكل شجري
const buildTree = (groups: Group[]): Group[] => {
  const groupMap = new Map<string, Group>();
  const roots: Group[] = [];

  // إنشاء خريطة للمجموعات
  groups.forEach(group => {
    groupMap.set(group.id, { ...group, children: [] });
  });

  // بناء الشجرة
  groups.forEach(group => {
    const groupNode = groupMap.get(group.id)!;
    if (group.parentId && groupMap.has(group.parentId)) {
      const parent = groupMap.get(group.parentId)!;
      parent.children!.push(groupNode);
    } else {
      roots.push(groupNode);
    }
  });

  return roots;
};

/* ---------------- API ---------------- */

export const getAll = async () => {
  const response = await api.get('/getGroups');
  const flatGroups = response.data.data.map(toGroup);
  return buildTree(flatGroups);
};

export const getById = async (id: string) => {
  const { data } = await api.get(`/getGroup?GroupID=${id}`);
  return toGroup(data.data);
};

export const add = async (body: { 
  name: string; 
  parentId?: string; 
  backgroundColor?: string; 
  fontColor?: string;
  isActive?: boolean; // إضافة الحقل
}) => {
  const { data } = await api.post(
    '/addGroup',
    null,
    { 
      params: { 
        GroupName: body.name,
        parentid: body.parentId || '',
        backcolor: body.backgroundColor || '123',
        FontColor: body.fontColor || '123',
        isActive: body.isActive ?? true // تمرير الحالة للـ API
      } 
    }
  );
  return toGroup(data.data);
};

export const update = async (group: Group) => {
  const { data } = await api.post(
    '/UpdateGroup',
    null,
    {
      params: {
        GroupID: group.id,
        GroupName: group.name,
        parentid: group.parentId || '',
        backcolor: group.backgroundColor,
        FontColor: group.fontColor,
        isActive: group.isActive // تمرير الحالة للـ API
      },
    }
  );
  return toGroup(data.data);
};

