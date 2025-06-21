// File: src/pages/pos-screens/components/SimpleScreenTree.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Collapse,
  Box,
  Avatar,
} from '@mui/material';
import {
  IconChevronRight,
  IconChevronDown,
  IconEdit,
  IconPlus,
  IconArrowUp,
  IconArrowDown
} from '@tabler/icons-react';
import { PosScreen } from 'src/utils/api/pagesApi/posScreensApi';
import { useTranslation } from 'react-i18next';
import { StatusPill } from './StatusPill';
import { VisibilityPill } from './VisibilityPill';

interface Props {
  screens: PosScreen[];
  onEdit: (screen: PosScreen) => void;
  onAddChild: (parentScreen: PosScreen) => void;
  onReorder: (reorderedScreens: PosScreen[]) => void;
  level?: number;
}

const SimpleScreenTree: React.FC<Props> = ({ 
  screens, 
  onEdit, 
  onAddChild, 
  onReorder,
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

const moveScreen = (index: number, direction: 'up' | 'down') => {
  if (
    (direction === 'up' && index === 0) ||
    (direction === 'down' && index === screens.length - 1)
  ) {
    return;
  }

  const newScreens = [...screens];
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  
  // تبديل المواضع
  [newScreens[index], newScreens[targetIndex]] = [newScreens[targetIndex], newScreens[index]];
  
  // تحديث displayOrder مع الحفاظ على جميع البيانات
  const updatedScreens = newScreens.map((screen, idx) => ({
    ...screen, // الحفاظ على جميع البيانات الأصلية
    displayOrder: idx + 1
  }));
  
  onReorder(updatedScreens);
};

  const ScreenItem: React.FC<{ 
    screen: PosScreen; 
    index: number; 
  }> = ({ screen, index }) => {
    const hasChildren = screen.children && screen.children.length > 0;
    const isExpanded = expanded.has(screen.id);

    return (
      <Box>
        <Card 
          sx={{ 
            mb: 1, 
            ml: level * 3,
            backgroundColor: screen.colorHex ? `${screen.colorHex}20` : undefined,
            borderLeft: screen.colorHex ? `4px solid ${screen.colorHex}` : undefined
          }}
        >
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* أزرار الترتيب */}
              <Stack direction="column" spacing={0}>
                <IconButton
                  size="small"
                  onClick={() => moveScreen(index, 'up')}
                  disabled={index === 0}
                  sx={{ p: 0.5 }}
                >
                  <IconArrowUp size={12} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveScreen(index, 'down')}
                  disabled={index === screens.length - 1}
                  sx={{ p: 0.5 }}
                >
                  <IconArrowDown size={12} />
                </IconButton>
              </Stack>

              {/* زر التوسيع/الطي */}
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
              
              {/* أيقونة الشاشة */}
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  backgroundColor: screen.colorHex,
                  fontSize: '0.875rem'
                }}
              >
                {screen.icon}
              </Avatar>

              {/* اسم الشاشة */}
              <Typography variant="body1" sx={{ flex: 1 }}>
                {screen.name}
              </Typography>

              {/* ترتيب العرض */}
              <Typography variant="caption" color="text.secondary">
                #{screen.displayOrder}
              </Typography>

              {/* حالة الرؤية */}
              <VisibilityPill isVisible={screen.isVisible} />

              {/* حالة النشاط */}
              <StatusPill isActive={screen.isActive} />

              {/* أزرار الإجراءات */}
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => onAddChild(screen)}
                  title={t('posScreens.addChild')}
                >
                  <IconPlus size={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onEdit(screen)}
                  title={t('posScreens.edit')}
                >
                  <IconEdit size={16} />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* الشاشات الفرعية */}
        {hasChildren && (
          <Collapse in={isExpanded}>
            <SimpleScreenTree
              screens={screen.children!}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onReorder={(reorderedChildren) => {
                // تحديث الشاشات الفرعية
                const updatedScreens = screens.map(s => 
                  s.id === screen.id 
                    ? { ...s, children: reorderedChildren }
                    : s
                );
                onReorder(updatedScreens);
              }}
              level={level + 1}
            />
          </Collapse>
        )}
      </Box>
    );
  };

  if (screens.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {t('posScreens.noScreens')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {screens.map((screen, index) => (
        <ScreenItem 
          key={screen.id} 
          screen={screen} 
          index={index}
        />
      ))}
    </Box>
  );
};

export default SimpleScreenTree;
