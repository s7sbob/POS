// File: src/pages/pos-screens/components/ScreenTreeSelect.tsx
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PosScreen } from 'src/utils/api/pagesApi/posScreensApi';

interface Props {
  screens: PosScreen[];
  value?: string;
  onChange: (value: string) => void;
  label: string;
  excludeId?: string;
}

const ScreenTreeSelect: React.FC<Props> = ({ 
  screens, 
  value, 
  onChange, 
  label,
  excludeId 
}) => {
  const { t } = useTranslation();

  const renderScreenOptions = (screens: PosScreen[], level = 0): React.ReactNode[] => {
    const options: React.ReactNode[] = [];

    screens.forEach(screen => {
      // استبعاد الشاشة المحددة وأطفالها
      if (excludeId && screen.id === excludeId) {
        return;
      }

      const indent = '—'.repeat(level);
      options.push(
        <MenuItem key={screen.id} value={screen.id}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              {indent} {screen.name}
            </Typography>
          </Box>
        </MenuItem>
      );

      if (screen.children && screen.children.length > 0) {
        options.push(...renderScreenOptions(screen.children, level + 1));
      }
    });

    return options;
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        displayEmpty
      >
        <MenuItem value="">
          <em>{t('posScreens.noParent')}</em>
        </MenuItem>
        {renderScreenOptions(screens)}
      </Select>
    </FormControl>
  );
};

export default ScreenTreeSelect;
