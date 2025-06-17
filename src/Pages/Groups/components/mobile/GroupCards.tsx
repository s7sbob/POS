// File: src/pages/groups/components/mobile/GroupCards.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box,
  Grid,
  Chip
} from '@mui/material';
import {
  IconEdit,
  IconPlus
} from '@tabler/icons-react';
import { Group } from 'src/utils/api/pagesApi/groupsApi';
import { useTranslation } from 'react-i18next';
import { StatusPill } from '../StatusPill';

interface Props {
  groups: Group[];
  onEdit: (group: Group) => void;
  onAddChild: (parentGroup: Group) => void;
  loading: boolean;
}

const GroupCards: React.FC<Props> = ({ 
  groups, 
  onEdit, 
  onAddChild, 
  loading 
}) => {
  const { t } = useTranslation();

  // تحويل الشجرة إلى قائمة مسطحة للعرض في الكروت
  const flattenGroups = (groups: Group[], level = 0, parentName = ''): Array<{ group: Group; level: number; parentName: string }> => {
    const result: Array<{ group: Group; level: number; parentName: string }> = [];
    
    groups.forEach(group => {
      result.push({ group, level, parentName });
      if (group.children && group.children.length > 0) {
        result.push(...flattenGroups(group.children, level + 1, group.name));
      }
    });
    
    return result;
  };

  const flatGroups = flattenGroups(groups);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (flatGroups.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {t('groups.noGroups')}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {flatGroups.map(({ group, level, parentName }) => (
        <Grid item xs={12} sm={6} md={4} key={group.id}>
          <Card sx={{ 
            height: '100%',
            borderRadius: { xs: 1, sm: 2 },
            backgroundColor: group.backgroundColor !== '123' ? `#${group.backgroundColor}` : undefined,
            color: group.fontColor !== '123' ? `#${group.fontColor}` : undefined,
            opacity: group.isActive ? 1 : 0.7,
            border: level > 0 ? '2px solid' : 'none',
            borderColor: level > 0 ? 'primary.light' : 'transparent',
            ml: level * 1 // إزاحة بسيطة للمستويات
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack spacing={2}>
                {/* مستوى المجموعة */}
                {level > 0 && (
                  <Box>
                    <Chip
                      label={`${t('groups.level')} ${level}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </Box>
                )}

                {/* اسم المجموعة */}
                <Typography 
                  variant="h6" 
                  component="div"
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    fontWeight: 'bold',
                    lineHeight: 1.2
                  }}
                >
                  {'─'.repeat(level)} {group.name}
                </Typography>

                {/* المجموعة الأب */}
                {parentName && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      fontStyle: 'italic'
                    }}
                  >
                    {t('groups.parentGroup')}: {parentName}
                  </Typography>
                )}

                {/* عدد المجموعات الفرعية */}
                {group.children && group.children.length > 0 && (
                  <Typography 
                    variant="body2" 
                    color="primary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {t('groups.childrenCount')}: {group.children.length}
                  </Typography>
                )}

                {/* حالة المجموعة */}
                <Box>
                  <StatusPill isActive={group.isActive} />
                </Box>

                {/* الأزرار */}
                <Stack direction="row" spacing={1} justifyContent="center">
                  <IconButton
                    onClick={() => onAddChild(group)}
                    size="small"
                    sx={{
                      backgroundColor: 'action.hover',
                      '&:hover': {
                        backgroundColor: 'success.light',
                        color: 'success.contrastText'
                      }
                    }}
                  >
                    <IconPlus size={18} />
                  </IconButton>
                  
                  <IconButton
                    onClick={() => onEdit(group)}
                    size="small"
                    sx={{
                      backgroundColor: 'action.hover',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText'
                      }
                    }}
                  >
                    <IconEdit size={18} />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default GroupCards;
