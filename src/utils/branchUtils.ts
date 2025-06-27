// File: src/utils/branchUtils.ts
import { Branch } from './api/authApi';

export const getUserBranchesFromStorage = (): Branch[] => {
  try {
    const branches = localStorage.getItem('user_branches');
    return branches ? JSON.parse(branches) : [];
  } catch (error) {
    console.error('Error getting branches from storage:', error);
    return [];
  }
};

export const getDefaultBranch = (): Branch | null => {
  const branches = getUserBranchesFromStorage();
  return branches.length > 0 ? branches[0] : null;
};

export const getCurrentBranch = (): Branch | null => {
  try {
    const currentBranch = localStorage.getItem('selected_branch');
    return currentBranch ? JSON.parse(currentBranch) : getDefaultBranch();
  } catch (error) {
    console.error('Error getting current branch:', error);
    return getDefaultBranch();
  }
};
