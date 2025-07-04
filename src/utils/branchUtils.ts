// File: src/utils/branchUtils.ts
import { Branch } from './api/authApi';

// الحصول على فروع المستخدم من localStorage
export const getUserBranchesFromStorage = (): Branch[] => {
  try {
    const branches = localStorage.getItem('user_branches');
    return branches ? JSON.parse(branches) : [];
  } catch (error) {
    console.error('Error getting user branches from storage:', error);
    return [];
  }
};

// الحصول على الفرع الافتراضي
export const getDefaultBranch = (): Branch | null => {
  const branches = getUserBranchesFromStorage();
  return branches.length > 0 ? branches[0] : null;
};

// الحصول على الفرع المختار حالياً
export const getCurrentBranch = (): Branch | null => {
  try {
    const currentBranch = localStorage.getItem('selected_branch');
    return currentBranch ? JSON.parse(currentBranch) : getDefaultBranch();
  } catch (error) {
    console.error('Error getting current branch:', error);
    return getDefaultBranch();
  }
};

// الحصول على فرع معين بالـ ID
export const getBranchById = (branchId: string): Branch | null => {
  const branches = getUserBranchesFromStorage();
  return branches.find(branch => branch.id === branchId) || null;
};

// حفظ فروع المستخدم في localStorage (يتم استدعاؤها عند تسجيل الدخول)
export const saveUserBranchesToStorage = (branches: Branch[]): void => {
  try {
    localStorage.setItem('user_branches', JSON.stringify(branches));
  } catch (error) {
    console.error('Error saving user branches to storage:', error);
  }
};

// حفظ الفرع المختار حالياً
export const setCurrentBranch = (branch: Branch): void => {
  try {
    localStorage.setItem('selected_branch', JSON.stringify(branch));
  } catch (error) {
    console.error('Error setting current branch:', error);
  }
};

// مسح فروع المستخدم من localStorage (عند تسجيل الخروج)
export const clearUserBranchesFromStorage = (): void => {
  try {
    localStorage.removeItem('user_branches');
    localStorage.removeItem('selected_branch');
  } catch (error) {
    console.error('Error clearing user branches from storage:', error);
  }
};

// التحقق من وجود فروع للمستخدم
export const hasUserBranches = (): boolean => {
  const branches = getUserBranchesFromStorage();
  return branches.length > 0;
};

// الحصول على أسماء الفروع فقط
export const getBranchNames = (): string[] => {
  const branches = getUserBranchesFromStorage();
  return branches.map(branch => branch.name);
};

// التحقق من صلاحية المستخدم على فرع معين
export const hasAccessToBranch = (branchId: string): boolean => {
  const branches = getUserBranchesFromStorage();
  return branches.some(branch => branch.id === branchId);
};
