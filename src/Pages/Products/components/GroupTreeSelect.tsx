import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import { Group } from 'src/utils/api/groupsApi';

interface Props {
  groups: Group[];
  value?: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  excludeId?: string;
}

const GroupTreeSelect: React.FC<Props> = ({
  groups,
  value,
  onChange,
  label,
  disabled,
  excludeId
}) => {
  // تحويل الشجرة إلى قائمة مسطحة مع مستويات
  const flattenGroups = (groups: Group[], level = 0): Array<{ group: Group; level: number }> => {
    const result: Array<{ group: Group; level: number }> = [];
    
    groups.forEach(group => {
      if (group.id !== excludeId) {
        result.push({ group, level });
        if (group.children && group.children.length > 0) {
          result.push(...flattenGroups(group.children, level + 1));
        }
      }
    });
    
    return result;
  };

  const flatGroups = flattenGroups(groups);

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        <MenuItem value="">
          <em>اختر المجموعة</em>
        </MenuItem>
        {flatGroups.map(({ group, level }) => (
          <MenuItem key={group.id} value={group.id}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: level * 20 }} />
              <Typography>
                {'─'.repeat(level)} {group.name}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GroupTreeSelect;
