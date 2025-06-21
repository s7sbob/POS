// File: src/pages/pos-screens/components/SmoothScreenTree.tsx
import React from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Collapse,
  Avatar,
  Chip
} from '@mui/material';
import {
  IconChevronRight,
  IconChevronDown,
  IconEdit,
  IconPlus,
  IconGripVertical
} from '@tabler/icons-react';
import { PosScreen } from 'src/utils/api/pagesApi/posScreensApi';
import { useTranslation } from 'react-i18next';

interface Props {
  screens: PosScreen[];
  onEdit: (screen: PosScreen) => void;
  onAddChild: (parentScreen: PosScreen) => void;
  onReorder: (reorderedScreens: PosScreen[], parentId?: string) => void;
  level?: number;
  parentId?: string;
}

const SmoothScreenTree: React.FC<Props> = React.memo(({ 
  screens, 
  onEdit, 
  onAddChild, 
  onReorder,
  level = 0,
  parentId
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = React.useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = React.useState<string | null>(null);

  const toggleExpanded = React.useCallback((screenId: string) => {
    setExpanded(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(screenId)) {
        newExpanded.delete(screenId);
      } else {
        newExpanded.add(screenId);
      }
      return newExpanded;
    });
  }, []);

  const handleDragStart = React.useCallback((e: React.DragEvent, screenId: string, index: number) => {
    setDraggedItem(screenId);
    e.dataTransfer.setData('text/plain', JSON.stringify({ screenId, index, parentId }));
    e.dataTransfer.effectAllowed = 'move';
    
    // إضافة تأثير بصري
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, [parentId]);

  const handleDragEnd = React.useCallback((e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverItem(null);
    
    // إزالة التأثير البصري
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent, screenId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(screenId);
  }, []);

  const handleDragLeave = React.useCallback(() => {
    setDragOverItem(null);
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverItem(null);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      // تأكد من أن السحب في نفس المستوى
      if (dragData.parentId === parentId && dragData.index !== dropIndex) {
        const newScreens = [...screens];
        const [movedScreen] = newScreens.splice(dragData.index, 1);
        newScreens.splice(dropIndex, 0, movedScreen);
        onReorder(newScreens, parentId);
      }
    } catch (error) {
      console.error('Drop error:', error);
    }
  }, [screens, onReorder, parentId]);

  const ScreenItem: React.FC<{ 
    screen: PosScreen; 
    index: number;
  }> = React.memo(({ screen, index }) => {
    const hasChildren = screen.children && screen.children.length > 0;
    const isExpanded = expanded.has(screen.id);
    const isDragging = draggedItem === screen.id;
    const isDragOver = dragOverItem === screen.id;

    const handleEdit = React.useCallback(() => {
      onEdit(screen);
    }, [screen]);

    const handleAddChild = React.useCallback(() => {
      onAddChild(screen);
    }, [screen]);

    const handleToggleExpanded = React.useCallback(() => {
      toggleExpanded(screen.id);
    }, [screen.id]);

    return (
      <Box>
        {/* العنصر الرئيسي */}
        <Box
          draggable
          onDragStart={(e) => handleDragStart(e, screen.id, index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, screen.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 0.5,
            px: 1,
            ml: level * 2,
            backgroundColor: isDragOver 
              ? 'primary.light' 
              : screen.colorHex 
                ? `${screen.colorHex}15` 
                : 'background.paper',
            borderLeft: screen.colorHex ? `3px solid ${screen.colorHex}` : undefined,
            borderRadius: 1,
            mb: 0.5,
            minHeight: 40,
            cursor: 'grab',
            opacity: isDragging ? 0.5 : 1,
            transform: isDragging ? 'rotate(5deg)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: screen.colorHex ? `${screen.colorHex}25` : 'action.hover',
              transform: isDragging ? 'rotate(5deg)' : 'translateY(-1px)',
              boxShadow: isDragging ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
            },
            '&:active': {
              cursor: 'grabbing',
              transform: 'rotate(5deg) scale(1.02)',
            }
          }}
        >
          {/* مقبض السحب */}
          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            <IconGripVertical size={14} color="#999" />
          </Box>

          {/* زر التوسيع/الطي */}
          {hasChildren && (
            <IconButton
              size="small"
              onClick={handleToggleExpanded}
              sx={{ p: 0.25, mr: 0.5 }}
            >
              {isExpanded ? (
                <IconChevronDown size={14} />
              ) : (
                <IconChevronRight size={14} />
              )}
            </IconButton>
          )}
          
          {/* أيقونة الشاشة */}
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24, 
              backgroundColor: screen.colorHex,
              fontSize: '0.7rem',
              mr: 1
            }}
          >
            {screen.icon}
          </Avatar>

          {/* اسم الشاشة */}
          <Typography 
            variant="body2" 
            sx={{ 
              flex: 1, 
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {screen.name}
          </Typography>

          {/* ترتيب العرض */}
          <Chip
            label={`#${screen.displayOrder}`}
            size="small"
            variant="outlined"
            sx={{ 
              height: 20,
              fontSize: '0.7rem',
              mr: 1
            }}
          />

          {/* حالات مضغوطة */}
          <Stack direction="row" spacing={0.5} sx={{ mr: 1 }}>
            {!screen.isVisible && (
              <Chip
                label="مخفي"
                size="small"
                color="warning"
                sx={{ height: 18, fontSize: '0.65rem' }}
              />
            )}
            {!screen.isActive && (
              <Chip
                label="غير نشط"
                size="small"
                color="default"
                sx={{ height: 18, fontSize: '0.65rem' }}
              />
            )}
          </Stack>

          {/* أزرار الإجراءات */}
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={handleAddChild}
              sx={{ p: 0.25 }}
            >
              <IconPlus size={14} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleEdit}
              sx={{ p: 0.25 }}
            >
              <IconEdit size={14} />
            </IconButton>
          </Stack>
        </Box>

        {/* الشاشات الفرعية */}
        {hasChildren && (
          <Collapse in={isExpanded}>
            <SmoothScreenTree
              screens={screen.children!}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onReorder={(reorderedChildren) => onReorder(reorderedChildren, screen.id)}
              level={level + 1}
              parentId={screen.id}
            />
          </Collapse>
        )}
      </Box>
    );
  });

  if (screens.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('posScreens.noScreens')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
      {screens.map((screen, index) => (
        <ScreenItem 
          key={screen.id} 
          screen={screen} 
          index={index}
        />
      ))}
    </Box>
  );
});

SmoothScreenTree.displayName = 'SmoothScreenTree';

export default SmoothScreenTree;
