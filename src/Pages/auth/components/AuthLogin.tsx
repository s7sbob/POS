// File: src/pages/auth/components/AuthLogin.tsx
import React from 'react';
import { 
  Box, 
  Stack, 
  Button, 
  Typography, 
  FormGroup, 
  FormControlLabel,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { IconEye, IconEyeOff, IconPhone, IconLock, IconBuilding } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface Props {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
  onSubmit: (phone: string, password: string, tenantId: string) => void; // ⭐ إضافة tenantId
  isLoading?: boolean;
}

const AuthLogin: React.FC<Props> = ({ 
  subtitle, 
  subtext, 
  onSubmit, 
  isLoading = false 
}) => {
  const { t } = useTranslation();
  // tenantId is controlled by the company code input.  When this component is
  // rendered under the `/:tenantId/auth/login` route we populate the field
  // from the URL parameter.  If the user edits the company code the URL is
  // updated accordingly.
  const params = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const [tenantId, setTenantId] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  React.useEffect(() => {
    const savedPhone = localStorage.getItem('remembered_phone');
    const savedTenantId = localStorage.getItem('remembered_tenant'); // ⭐ إضافة حفظ TenantId
    const savedRemember = localStorage.getItem('remember_me') === 'true';
    
    if (savedRemember && savedPhone) {
      setPhone(savedPhone);
      setRememberMe(true);
    }
    
    if (savedRemember && savedTenantId) {
      setTenantId(savedTenantId);
      // Persist the tenant in tenant_id so that API requests include it.
      localStorage.setItem('tenant_id', savedTenantId);
    }

    // If the URL contains a tenantId (e.g. `/myCompany/auth/login`) and
    // there is no remembered tenant, populate the field from the URL.
    if (params.tenantId && !savedTenantId) {
      setTenantId(params.tenantId);
      // Persist the tenant when coming from the URL so that API requests include it.
      localStorage.setItem('tenant_id', params.tenantId);
    }
  }, []);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rememberMe) {
      localStorage.setItem('remembered_phone', phone);
      localStorage.setItem('remembered_tenant', tenantId); // ⭐ حفظ TenantId
      localStorage.setItem('remember_me', 'true');
    } else {
      localStorage.removeItem('remembered_phone');
      localStorage.removeItem('remembered_tenant'); // ⭐ مسح TenantId
      localStorage.removeItem('remember_me');
    }
    
    onSubmit(phone, password, tenantId); // ⭐ تمرير tenantId
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {subtext}

      <form onSubmit={handle}>
        <Stack spacing={2}>
          {/* ⭐ إضافة حقل TenantId */}
          <Box>
            <CustomFormLabel htmlFor="tenantId">{t('auth.login.tenantId')}</CustomFormLabel>
            <CustomTextField 
              id="tenantId" 
              fullWidth 
              value={tenantId} 
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => {
                const value = e.target.value as string;
                setTenantId(value);
                // Persist the tenantId in localStorage so that it is used for API headers.
                // Only store non-empty values.
                if (value && value.trim().length > 0) {
                  localStorage.setItem('tenant_id', value.trim());
                  // When the user edits the company code update the URL to
                  // reflect the new tenantId.  Only navigate when there is
                  // actual input to avoid empty prefixes.
                  navigate(`/${value}/auth/login`, { replace: true });
                } else {
                  localStorage.removeItem('tenant_id');
                }
              }}
              placeholder={t('auth.login.tenantPlaceholder')}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconBuilding size={20} />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="phone">{t('auth.login.phoneNumber')}</CustomFormLabel>
            <CustomTextField 
              id="phone" 
              fullWidth 
              value={phone} 
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPhone(e.target.value)}
              placeholder={t('auth.login.phonePlaceholder')}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconPhone size={20} />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          
          <Box>
            <CustomFormLabel htmlFor="password">{t('auth.login.password')}</CustomFormLabel>
            <CustomTextField 
              id="password" 
              type={showPassword ? 'text' : 'password'}
              fullWidth 
              value={password} 
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
              placeholder={t('auth.login.passwordPlaceholder')}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconLock size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <FormGroup>
              <FormControlLabel 
                control={
                  <CustomCheckbox 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                } 
                label={t('auth.login.rememberMe')}
              />
            </FormGroup>
            <Typography 
              component={Link} 
              // Provide a relative path so that the tenant prefix is preserved.
              to="auth/forgot-password"
              sx={{ 
                color: 'primary.main', 
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {t('auth.login.forgotPassword')}
            </Typography>
          </Stack>

          <Button 
            variant="contained" 
            type="submit" 
            fullWidth
            disabled={isLoading || !tenantId.trim() || !phone.trim() || !password.trim()} // ⭐ إضافة tenantId للتحقق
            sx={{ 
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            {isLoading ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={20} color="inherit" />
                <Typography>{t('auth.login.signingIn')}</Typography>
              </Stack>
            ) : (
              t('auth.login.signIn')
            )}
          </Button>
        </Stack>
      </form>

      {subtitle}
    </>
  );
};

export default AuthLogin;
