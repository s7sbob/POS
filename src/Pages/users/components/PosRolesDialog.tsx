// File: project/src/Pages/users/components/PosRolesDialog.tsx
// This dialog allows administrators to view and edit a user's POS roles.  It
// presents a tabbed interface for each POS module (Takeaway, Dine‑in, etc.)
// plus an "All" tab that groups roles by module.  Changes can be previewed
// before saving and are persisted via the `updateRoles` API helper.

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Stack,
  Checkbox,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  getByModuleId,
  updateRoles,
  PosUserRole
} from 'src/utils/api/pagesApi/posUserRolesApi';

// Definition of the POS modules.  These should be kept in sync with the
// backend numeric ModuleId values.  The labels are displayed in the UI.
const MODULE_TABS = [
  { id: 1, label: 'Takeaway' },
  { id: 2, label: 'Dine‑in' },
  { id: 3, label: 'Delivery' },
  { id: 4, label: 'Pickup' },
  { id: 5, label: 'Delivery Company' }
];

interface PosRolesDialogProps {
  /**
   * Controls whether the dialog is visible.  When false the component
   * renders nothing and resets its internal state on the next open.
   */
  open: boolean;
  /** Called when the dialog should be closed without saving changes. */
  onClose: () => void;
  /** The ID of the user whose roles are being managed. */
  userId: string;
}

const PosRolesDialog: React.FC<PosRolesDialogProps> = ({ open, onClose, userId }) => {
  const { t } = useTranslation();
  // Index of the currently selected tab (0–MODULE_TABS.length for module tabs, last index for "All")
  const [selectedTab, setSelectedTab] = useState<number>(0);
  // Tracks whether the preview mode is active.  When true the dialog
  // displays a summary of changes rather than the editable lists.
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  // Stores the current roles for each module keyed by ModuleId.  When a
  // module's roles are modified the corresponding array is updated here.
  const [rolesByModule, setRolesByModule] = useState<Record<number, PosUserRole[]>>({});
  // Stores a snapshot of the roles as originally loaded.  This is used to
  // compute changes for the preview view.
  const [originalRoles, setOriginalRoles] = useState<Record<number, PosUserRole[]>>({});
  // Indicates whether any async operation (loading or saving) is in progress.
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Loads roles for a specific module if they have not been loaded already.
   * The results are cached in both `rolesByModule` and `originalRoles`.  If
   * another request is currently in progress the call silently returns.
   */
  const loadRolesForModule = async (moduleId: number) => {
    if (!userId || loading || rolesByModule[moduleId]) {
      return;
    }
    try {
      setLoading(true);
      const roles = await getByModuleId(moduleId, userId);
      // Defensive copy to ensure state updates don't mutate the original array
      setRolesByModule(prev => ({ ...prev, [moduleId]: roles.map(r => ({ ...r })) }));
      setOriginalRoles(prev => ({ ...prev, [moduleId]: roles.map(r => ({ ...r })) }));
    } catch (err) {
      // Errors are surfaced via the global error handler configured in axios.
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads all modules when the "All" tab is selected.  Modules that have
   * already been loaded are skipped.  Requests are fired sequentially to
   * respect the loading flag, but the UI remains responsive because state
   * updates occur after each fetch.
   */
  const loadAllModules = async () => {
    for (const mod of MODULE_TABS) {
      // eslint-disable-next-line no-await-in-loop
      await loadRolesForModule(mod.id);
    }
  };

  // Whenever the dialog opens or the selected tab changes, trigger the
  // appropriate loading behaviour.  This effect also resets the dialog
  // state when it is closed.
  useEffect(() => {
    if (open) {
      // If "All" tab is selected, ensure every module is loaded
      if (selectedTab === MODULE_TABS.length) {
        loadAllModules();
      } else {
        const moduleId = MODULE_TABS[selectedTab]?.id;
        if (moduleId) {
          loadRolesForModule(moduleId);
        }
      }
    } else {
      // Reset state when closed so a fresh state is used next time
      setSelectedTab(0);
      setPreviewMode(false);
      setRolesByModule({});
      setOriginalRoles({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedTab]);

  /**
   * Handles switching between tabs.  Selecting the last tab (index equal
   * to MODULE_TABS.length) activates the "All" view.
   */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  /**
   * Toggles the active status of a given role for a specified module.  The
   * change is reflected immediately in the UI but not persisted until the
   * user clicks the Save button.
   */
  const handleCheckboxChange = (moduleId: number, index: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    setRolesByModule(prev => {
      const currentRoles = prev[moduleId] ? [...prev[moduleId]] : [];
      if (currentRoles[index]) {
        currentRoles[index] = { ...currentRoles[index], isActive: checked };
      }
      return { ...prev, [moduleId]: currentRoles };
    });
  };

  /**
   * Determines whether there are any unsaved changes across all modules.
   * This function compares the current role arrays against their original
   * counterparts and returns true if at least one `isActive` flag differs.
   */
  const hasChanges = (): boolean => {
    for (const mod of MODULE_TABS) {
      const current = rolesByModule[mod.id];
      const original = originalRoles[mod.id];
      if (!current || !original) continue;
      for (let i = 0; i < current.length; i += 1) {
        if (current[i].isActive !== original[i]?.isActive) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Collects all roles from every module into a single array.  This is
   * necessary because the backend expects a full payload containing all
   * records, not just the modified ones.
   */
  const collectAllRoles = (): PosUserRole[] => {
    const combined: PosUserRole[] = [];
    MODULE_TABS.forEach(mod => {
      const list = rolesByModule[mod.id];
      if (list && list.length > 0) {
        combined.push(...list.map(item => ({ ...item })));
      }
    });
    return combined;
  };

  /**
   * Persists the current roles to the backend.  If the operation
   * succeeds, the dialog is closed.  In case of failure the user will be
   * notified through the global error handler.
   */
  const handleSave = async () => {
    if (!hasChanges()) {
      onClose();
      return;
    }
    const payload = collectAllRoles();
    try {
      setLoading(true);
      await updateRoles(payload);
      // Reflect the current state as the new original to avoid re‑prompting
      setOriginalRoles(prev => ({ ...rolesByModule }));
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggles between edit mode and preview mode.  Preview mode displays a
   * summary of all changes grouped by module with before/after values.
   */
  const handlePreviewToggle = () => {
    setPreviewMode(prev => !prev);
  };

  /**
   * Computes a list of differences between the current roles and the
   * originally loaded roles.  Each entry contains the module name, role
   * description, and the before/after boolean values.  This is used
   * exclusively in preview mode.
   */
  const computeChanges = () => {
    const changes: Array<{
      moduleName: string;
      description: string;
      before: boolean;
      after: boolean;
    }> = [];
    MODULE_TABS.forEach(mod => {
      const current = rolesByModule[mod.id];
      const original = originalRoles[mod.id];
      if (!current || !original) return;
      current.forEach((role, idx) => {
        const orig = original[idx];
        if (orig && role.isActive !== orig.isActive) {
          changes.push({
            moduleName: mod.label,
            description: role.posRoleDescription,
            before: orig.isActive,
            after: role.isActive
          });
        }
      });
    });
    return changes;
  };

  // Render a single module's role list with checkboxes.  Used in both
  // module‑specific views and in the aggregated "All" view.
  const renderRoleList = (moduleId: number) => {
    const roles = rolesByModule[moduleId];
    if (loading && (!roles || roles.length === 0)) {
      return (
        <Stack alignItems="center" sx={{ py: 3 }}>
          <CircularProgress size={24} />
        </Stack>
      );
    }
    if (!roles || roles.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          {t('users.noRoles') || 'No roles found for this module.'}
        </Typography>
      );
    }
    return (
      <Stack spacing={1} sx={{ my: 1 }}>
        {roles.map((role, index) => (
          <Stack
            key={`${moduleId}-${role.posRoleId}`}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Checkbox
              checked={role.isActive}
              onChange={handleCheckboxChange(moduleId, index)}
              color="primary"
            />
            <Typography variant="body2">{role.posRoleDescription}</Typography>
          </Stack>
        ))}
      </Stack>
    );
  };

  // Render the preview view summarising all changes.  If there are no
  // modifications the user is informed accordingly.
  const renderPreview = () => {
    const changes = computeChanges();
    return (
      <Box sx={{ mt: 2 }}>
        {changes.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            {t('users.noChanges') || 'You have not made any changes.'}
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('users.module') || 'Module'}</TableCell>
                <TableCell>{t('users.role') || 'Role'}</TableCell>
                <TableCell>{t('users.before') || 'Before'}</TableCell>
                <TableCell>{t('users.after') || 'After'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {changes.map((chg, idx) => (
                <TableRow key={idx}>
                  <TableCell>{chg.moduleName}</TableCell>
                  <TableCell>{chg.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={chg.before ? t('users.active') || 'Active' : t('users.inactive') || 'Inactive'}
                      color={chg.before ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={chg.after ? t('users.active') || 'Active' : t('users.inactive') || 'Inactive'}
                      color={chg.after ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('users.posRolesTitle') || 'POS Roles'}</DialogTitle>
      <DialogContent>
        {!previewMode && (
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {MODULE_TABS.map((mod, idx) => (
              <Tab key={mod.id} label={mod.label} value={idx} />
            ))}
            <Tab label={t('users.all') || 'All'} value={MODULE_TABS.length} />
          </Tabs>
        )}

        {/* Content area */}
        <Box sx={{ mt: 2 }}>
          {previewMode ? (
            renderPreview()
          ) : selectedTab === MODULE_TABS.length ? (
            // All modules view: render each module with a divider
            <Box>
              {MODULE_TABS.map((mod, idx) => (
                <Box key={mod.id} sx={{ mb: idx === MODULE_TABS.length - 1 ? 0 : 3 }}>
                  <Divider textAlign="left" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {mod.label}
                    </Typography>
                  </Divider>
                  {renderRoleList(mod.id)}
                </Box>
              ))}
            </Box>
          ) : (
            // Single module view
            renderRoleList(MODULE_TABS[selectedTab].id)
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel') || 'Cancel'}
        </Button>
        {/* Toggle preview button */}
        <Button onClick={handlePreviewToggle} disabled={loading || !hasChanges()}>
          {previewMode ? (t('users.back') || 'Back') : (t('users.preview') || 'Preview')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !hasChanges()}
        >
          {t('common.save') || 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PosRolesDialog;