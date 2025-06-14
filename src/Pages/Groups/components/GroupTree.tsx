import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Collapse,
  Box} from '@mui/material';
import {
  IconChevronRight,
  IconChevronDown,
  IconEdit,
  IconPlus
} from '@tabler/icons-react';
import { Group } from 'src/utils/api/pagesApi/groupsApi';
import { useTranslation } from 'react-i18next';
import { StatusPill } from './StatusPill';

interface Props {
  groups: Group[];
  onEdit: (group: Group) => void;
  onAddChild: (parentGroup: Group) => void;
  level?: number;
}

const GroupTree: React.FC<Props> = ({ 
  groups, 
  onEdit, 
  onAddChild, 
  level = 0 
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (groupId: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpanded(newExpanded);
  };

  const GroupItem: React.FC<{ group: Group }> = ({ group }) => {
    const hasChildren = group.children && group.children.length > 0;
    const isExpanded = expanded.has(group.id);

    return (
      <Box>
        <Card 
          sx={{ 
            mb: 1, 
            ml: level * 3,
            backgroundColor: group.backgroundColor !== '123' ? `#${group.backgroundColor}` : undefined,
            color: group.fontColor !== '123' ? `#${group.fontColor}` : undefined
          }}
        >
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* زر التوسيع/الطي */}
              {hasChildren && (
                <IconButton
                  size="small"
                  onClick={() => toggleExpanded(group.id)}
                >
                  {isExpanded ? (
                    <IconChevronDown size={16} />
                  ) : (
                    <IconChevronRight size={16} />
                  )}
                </IconButton>
              )}
              
              {/* اسم المجموعة */}
              <Typography variant="body1" sx={{ flex: 1 }}>
                {group.name}
              </Typography>
              
              {/* كود المجموعة */}
              <Typography variant="body2" color="text.secondary">
                {t('groups.code')}: {group.code}
              </Typography>
              
              {/* حالة المجموعة */}
<StatusPill isActive={group.isActive} />

              
              {/* أزرار الإجراءات */}
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => onAddChild(group)}
                  title={t('groups.addChild')}
                >
                  <IconPlus size={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onEdit(group)}
                  title={t('groups.edit')}
                >
                  <IconEdit size={16} />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* المجموعات الفرعية */}
        {hasChildren && (
          <Collapse in={isExpanded}>
            <GroupTree
              groups={group.children!}
              onEdit={onEdit}
              onAddChild={onAddChild}
              level={level + 1}
            />
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {groups.map((group) => (
        <GroupItem key={group.id} group={group} />
      ))}
    </Box>
  );
};

export default GroupTree;
