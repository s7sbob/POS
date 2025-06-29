// File: src/pages/pos-screens/components/OptimizedDragTree.tsx
import React from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Chip,
  Paper,
  Collapse
} from '@mui/material';
import {
  IconEdit,
  IconPlus,
  IconGripVertical,
  IconArrowUp,
  IconArrowDown,
  IconChevronRight,
  IconChevronDown
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

// دالة debounce للتحكم في تكرار الأحداث
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const OptimizedDragTree: React.FC<Props> = React.memo(({ 
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
  const [, setDragPosition] = React.useState<{ x: number; y: number } | null>(null);

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

  // دالة محسنة للسحب مع requestAnimationFrame
  const updateDragPosition = React.useCallback(
    debounce((x: number, y: number) => {
      requestAnimationFrame(() => {
        setDragPosition({ x, y });
      });
    }, 16), // 60fps
    []
  );

  const moveScreen = React.useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newScreens = [...screens];
    const [movedScreen] = newScreens.splice(fromIndex, 1);
    newScreens.splice(toIndex, 0, movedScreen);
    
    onReorder(newScreens, parentId);
  }, [screens, onReorder, parentId]);

  // Drag handlers محسنة
  const handleDragStart = React.useCallback((e: React.DragEvent, screenId: string, index: number) => {
    setDraggedItem(screenId);
    e.dataTransfer.setData('text/plain', JSON.stringify({ screenId, index, parentId }));
    e.dataTransfer.effectAllowed = 'move';
    
    // تحسين الـ drag image
    const dragElement = e.currentTarget as HTMLElement;
    const rect = dragElement.getBoundingClientRect();
    
    // إنشاء drag image مخصص
    const dragImage = dragElement.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, rect.width / 2, rect.height / 2);
    
    // تنظيف drag image بعد فترة
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    
    // تحديث موضع السحب
    updateDragPosition(e.clientX, e.clientY);
  }, [parentId, updateDragPosition]);

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    if (e.clientX !== 0 && e.clientY !== 0) {
      updateDragPosition(e.clientX, e.clientY);
    }
  }, [updateDragPosition]);

  const handleDragEnd = React.useCallback(() => {
    setDraggedItem(null);
    setDragOverItem(null);
    setDragPosition(null);
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
        moveScreen(dragData.index, dropIndex);
      }
    } catch (error) {
      }
  }, [parentId, moveScreen]);

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

    const handleMoveUp = React.useCallback(() => {
      moveScreen(index, Math.max(0, index - 1));
    }, [index]);

    const handleMoveDown = React.useCallback(() => {
      moveScreen(index, Math.min(screens.length - 1, index + 1));
    }, [index]);

    return (
      <Box>
        {/* العنصر الرئيسي */}
        <Paper
  elevation={isDragOver ? 2 : 0}
  draggable
  onDragStart={(e) => handleDragStart(e, screen.id, index)}
  onDrag={handleDrag}
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
    // إزالة التدوير والانحناء - فقط شفافية
    opacity: isDragging ? 0.5 : 1,
    // تحسين الانتقالات بدون تدوير
    transition: isDragging 
      ? 'none' 
      : 'all 0.2s ease',
    // إزالة will-change للأداء الأفضل
    '&:hover': {
      backgroundColor: screen.colorHex ? `${screen.colorHex}25` : 'action.hover',
      // إزالة التحرك لأعلى أيضاً
      boxShadow: isDragging ? 'none' : 1,
    },
    '&:active': {
      cursor: 'grabbing',
    }
  }}
>
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

          {/* مقبض السحب */}
          <Box 
            sx={{ 
              mr: 1, 
              display: 'flex', 
              alignItems: 'center',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <IconGripVertical size={14} color="#999" />
          </Box>

          {/* أزرار الترتيب */}
          <Stack direction="column" spacing={0} sx={{ mr: 1 }}>
            <IconButton
              size="small"
              onClick={handleMoveUp}
              disabled={index === 0}
              sx={{ p: 0.25 }}
            >
              <IconArrowUp size={10} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleMoveDown}
              disabled={index === screens.length - 1}
              sx={{ p: 0.25 }}
            >
              <IconArrowDown size={10} />
            </IconButton>
          </Stack>
          
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
        </Paper>

        {/* الشاشات الفرعية */}
        {hasChildren && (
          <Collapse in={isExpanded}>
            <OptimizedDragTree
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

OptimizedDragTree.displayName = 'OptimizedDragTree';

export default OptimizedDragTree;
