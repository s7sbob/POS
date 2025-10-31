// File: src/components/PosRoleAuthDialog.tsx
//
// A reusable dialog component that displays a message when the
// current user lacks the required POS role to perform an action.
// It shows an explanation and allows a higher‑level user to
// authenticate by entering their phone number (or username) and
// password.  Upon submission it calls the provided `onLogin`
// callback which should invoke an API to validate the credentials
// via the backend.  If the credentials are valid the calling
// component can proceed with the pending action; otherwise
// the dialog remains open and displays an error message.

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PosRoleAuthDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<boolean>;
  roleDescription?: string;
}

/**
 * Displays a modal dialog informing the user that they lack permission
 * to perform an action, and prompts for credentials of a higher‑level
 * user.  The dialog remains open until either the user cancels or
 * valid credentials are provided.  Error messages are shown when
 * authentication fails.
 */
const PosRoleAuthDialog: React.FC<PosRoleAuthDialogProps> = ({
  open,
  onClose,
  onLogin,
  roleDescription
}) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const success = await onLogin(username, password);
      if (success) {
        // Reset fields on successful login
        setUsername('');
        setPassword('');
        setError(null);
        onClose();
      } else {
        setError(t('pos.roles.invalidCredentials') || 'بيانات الاعتماد غير صحيحة');
      }
    } catch (err) {
      setError(t('pos.roles.loginFailed') || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{t('pos.roles.permissionRequired') || 'صلاحية مطلوبة'}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          {roleDescription || t('pos.roles.youDoNotHavePermission') || 'ليس لديك الصلاحية لتنفيذ هذا الإجراء.'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {t('pos.roles.enterHigherUserCredentials') || 'يرجى إدخال بيانات مستخدم لديه صلاحية أعلى:'}
        </Typography>
        <TextField
          margin="dense"
          label={t('auth.phoneNo') || 'رقم الهاتف'}
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="dense"
          label={t('auth.password') || 'كلمة المرور'}
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {error && (
          <Typography variant="body2" color="error" style={{ marginTop: 8 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={loading} color="inherit">
          {t('common.cancel') || 'إلغاء'}
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !username || !password} variant="contained" color="primary">
          {t('auth.login.title') || 'دخول'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PosRoleAuthDialog;
