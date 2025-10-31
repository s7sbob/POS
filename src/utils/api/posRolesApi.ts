// File: src/utils/api/posRolesApi.ts
//
// This module encapsulates all API calls related to POS role
// authorization.  It exposes two helper functions: one to check
// whether a given user has permission to perform a specific POS
// action (identified by its role key and module id), and another
// to validate the credentials of a higher‑level user when a
// permission check fails.  By centralizing these calls we keep
// the business logic out of the UI components and make it
// straightforward to swap out endpoint details if the backend
// implementation changes.

import api from 'src/utils/axios';

/**
 * Checks whether the supplied user has the specified POS role
 * enabled for a given module.  Under the hood this calls the
 * `/UserHasPosRole` endpoint via a GET request with the
 * appropriate query parameters.  The backend returns a JSON
 * structure with an `isvalid` flag and a boolean `data` field
 * indicating whether the user is permitted.  This helper
 * unpacks the response and returns the boolean directly.
 *
 * @param userId    The GUID of the user to check
 * @param roleKey   The role key (e.g. "change_payment_method_after_end")
 * @param moduleId  The numeric module identifier (1–5)
 *
 * @returns A promise that resolves to true if the user has the role
 */
export const userHasPosRole = async (
  userId: string,
  roleKey: string,
  moduleId: number
): Promise<boolean> => {
  try {
    const params = {
      UserId: userId,
      RoleKey: roleKey,
      ModuleId: moduleId
    };
    const response = await api.get('/UserHasPosRole', { params });
    const data = response.data;
    if (data && data.isvalid === true && typeof data.data === 'boolean') {
      return data.data;
    }
    // In case the backend returns an unexpected shape, assume false
    return false;
  } catch (error) {
    // Network or other errors should be interpreted as lack of permission
    console.error('Error checking POS role:', error);
    return false;
  }
};

/**
 * Validates the credentials of a higher‑level user when a POS role
 * check fails.  This helper posts the provided username and
 * password to a dedicated endpoint (`/PosRoleLogin`) that should
 * be implemented on the server.  The expected response has an
 * `isvalid` flag and a `data` boolean indicating whether the
 * credentials correspond to a user with the required permission.
 *
 * Note: The backend team must implement the `/PosRoleLogin`
 * endpoint to accept arbitrary credentials and return a simple
 * success/failure indicator without issuing an auth token.  Until
 * then this helper will always resolve to false.
 *
 * @param username The phone number or username of the higher‑level user
 * @param password The password for the higher‑level user
 * @param roleKey  The role the user is attempting to fulfil
 * @param moduleId The numeric module identifier
 *
 * @returns A promise that resolves to true if the credentials are valid
 */
export const validateHigherUserCredentials = async (
  username: string,
  password: string,
  roleKey: string,
  moduleId: number
): Promise<boolean> => {
  try {
    const body = {
      username,
      password,
      roleKey,
      moduleId
    };
    // TODO: Update the endpoint path when the backend team
    // implements the actual POS role login API.
    const response = await api.post('/PosRoleLogin', body);
    const data = response.data;
    if (data && data.isvalid === true && typeof data.data === 'boolean') {
      return data.data;
    }
    return false;
  } catch (error) {
    console.error('Error validating higher user credentials:', error);
    return false;
  }
};
