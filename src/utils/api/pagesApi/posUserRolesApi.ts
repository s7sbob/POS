// File: project/src/utils/api/pagesApi/posUserRolesApi.ts
// This API layer provides functions for interacting with the POS user roles endpoints.
// It mirrors the existing API helpers used throughout the project and encapsulates
// all communication with the backend related to fetching and updating POS roles.

import api from '../../axios';

/**
 * Represents a single POS role record as returned from the backend.  The
 * `moduleId` property is returned as a string (e.g. "takeaway") while
 * `moduleIdValue` holds the numeric ModuleId that was used to request
 * the record.  Roles with a null `id` represent new assignments for the
 * current user; existing assignments will have a GUID in the `id` field.
 */
export interface PosUserRole {
  id: string | null;
  posRoleId: string;
  posRoleKey: string;
  posRoleDescription: string;
  userId: string;
  moduleId: string;
  moduleIdValue: number;
  branchId: string | null;
  companyID: string | null;
  isActive: boolean;
}

interface GetResponse {
  isvalid: boolean;
  errors: any[];
  data: PosUserRole[];
}

/**
 * Fetches all POS roles assigned to a user for a given module.  Internally
 * this performs a POST request to `/getPOSUserRoleByModuleId` with a body
 * containing the numeric `ModuleId` and the `UserId`.  If the backend
 * reports an error the promise will reject; otherwise it resolves to
 * the array of roles.  Empty arrays are returned when no roles are found.
 *
 * @param moduleId The numeric module identifier (1–5)
 * @param userId   The GUID of the user whose roles are being queried
 */
export const getByModuleId = async (
  moduleId: number,
  userId: string
): Promise<PosUserRole[]> => {
  try {
    const body = { ModuleId: moduleId, UserId: userId };
    const response = await api.post('/getPOSUserRoleByModuleId', body);
    const res: GetResponse = response.data;
    return res && Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    // Propagate the error to the caller so it can be handled in the UI
    throw error;
  }
};

/**
 * Persists the provided POS roles to the backend.  The API expects the
 * entire list of roles to be sent in one payload rather than only the
 * modified records.  Each object in the array must match the shape
 * returned from `getByModuleId` including any modified `isActive` flags.
 *
 * @param roles Array of role records encompassing all modules
 */
export const updateRoles = async (roles: PosUserRole[]): Promise<void> => {
  try {
    await api.post('/UpdatePOSUserRole', roles);
  } catch (error) {
    // Allow the caller to handle API errors (e.g. network or validation issues)
    throw error;
  }
};