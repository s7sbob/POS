// File: src/pages/pos-screens/components/mobile/ScreenCards.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box,
  Avatar,
  Collapse
} from '@mui/material';
import {
  IconEdit,
  IconPlus,
  IconChevronRight,
  IconChevronDown
} from '@tabler/icons-react';
import { PosScreen } from 'src/utils/api/pagesApi/posScreensApi';
import { useTranslation } from 'react-i18next';
import { StatusPill } from '../StatusPill';
import { VisibilityPill } from '../VisibilityPill';

interface Props {
  screens: PosScreen[];
  onEdit: (screen: PosScreen) => void;
  onAddChild: (parentScreen: PosScreen) => void;
  loading: boolean;
  level?: number;
}

const ScreenCards: React.FC<Props> = ({ 
  screens, 
  onEdit, 
  onAddChild, 
  loading,
  level = 0 
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (screenId: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(screenId)) {
      newExpanded.delete(screenId);
    } else {
      newExpanded.add(screenId);
    }
    setExpanded(newExpanded);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>{t('common.loading')}</Typography>
      </Box>
    );
  }

  if (screens.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {t('posScreens.noScreens')}
        </Typography>
      </Box>
    );
  }

  const ScreenCard: React.FC<{ screen: PosScreen; index: number }> = ({ screen }) => {
    const hasChildren = screen.children && screen.children.length > 0;
    const isExpanded = expanded.has(screen.id);

    return (
      <Box sx={{ ml: level * 2 }}>
        <Card sx={{ 
          mb: 2,
          borderRadius: { xs: 1, sm: 2 },
          boxShadow: { xs: 1, sm: 2 },
          backgroundColor: screen.colorHex ? `${screen.colorHex}20` : undefined,
          borderLeft: screen.colorHex ? `4px solid ${screen.colorHex}` : undefined
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {hasChildren && (
                  <IconButton
                    size="small"
                    onClick={() => toggleExpanded(screen.id)}
                  >
                    {isExpanded ? (
                      <IconChevronDown size={16} />
                    ) : (
                      <IconChevronRight size={16} />
                    )}
                  </IconButton>
                )}

                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    backgroundColor: screen.colorHex,
                    fontSize: '1rem'
                  }}
                >
                  {screen.icon}
                </Avatar>

                <Typography 
                  variant="h6" 
                  component="div"
                  sx={{ 
                    flex: 1,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    fontWeight: 'bold'
                  }}
                >
                  {screen.name}
                </Typography>

                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    backgroundColor: 'background.paper',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  #{screen.displayOrder}
                </Typography>
              </Box>

              {/* Status Pills */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <VisibilityPill isVisible={screen.isVisible} />
                <StatusPill isActive={screen.isActive} />
              </Stack>

              {/* Actions */}
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <IconButton
                  size="small"
                  onClick={() => onAddChild(screen)}
                  sx={{
                    backgroundColor: 'action.hover',
                    '&:hover': {
                      backgroundColor: 'success.light',
                      color: 'success.contrastText'
                    }
                  }}
                >
                  <IconPlus size={16} />
                </IconButton>
                
                <IconButton 
                  onClick={() => onEdit(screen)} 
                  size="small"
                  sx={{
                    backgroundColor: 'action.hover',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    }
                  }}
                >
                  <IconEdit size={16} />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Children */}
        {hasChildren && (
          <Collapse in={isExpanded}>
            <ScreenCards
              screens={screen.children!}
              onEdit={onEdit}
              onAddChild={onAddChild}
              loading={false}
              level={level + 1}
            />
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {screens.map((screen, index) => (
        <ScreenCard key={screen.id} screen={screen} index={index} />
      ))}
    </Box>
  );
};

export default ScreenCards;
