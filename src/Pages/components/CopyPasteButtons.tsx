// File: src/components/CopyPasteButtons.tsx
import React from 'react';
import { Button, Stack, Tooltip } from '@mui/material';
import { 
  IconCopy, 
  IconClipboard, 
  IconClipboardCheck, 
  IconTrashX 
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onCopy: () => void;
  onPaste: () => void;
  onClear: () => void;
  hasCopiedData: boolean;
  canCopy?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined' | 'text';
  showLabels?: boolean;
  direction?: 'row' | 'column';
  spacing?: number;
}

const CopyPasteButtons: React.FC<Props> = ({
  onCopy,
  onPaste,
  onClear,
  hasCopiedData,
  canCopy = true,
  size = 'small',
  variant = 'outlined',
  showLabels = true,
  direction = 'row',
  spacing = 1
}) => {
  const { t } = useTranslation();

  return (
    <Stack direction={direction} spacing={spacing}>
      <Tooltip title={t('common.copy')}>
        <span>
          <Button
            variant={variant}
            size={size}
            startIcon={<IconCopy size={16} />}
            onClick={onCopy}
            disabled={!canCopy}
            sx={{ minWidth: showLabels ? 80 : 'auto' }}
          >
            {showLabels ? t('common.copy') : ''}
          </Button>
        </span>
      </Tooltip>
      
      <Tooltip title={t('common.paste')}>
        <span>
          <Button
            variant={variant}
            size={size}
            startIcon={hasCopiedData ? <IconClipboardCheck size={16} /> : <IconClipboard size={16} />}
            onClick={onPaste}
            disabled={!hasCopiedData}
            color={hasCopiedData ? 'success' : 'inherit'}
            sx={{ minWidth: showLabels ? 80 : 'auto' }}
          >
            {showLabels ? t('common.paste') : ''}
          </Button>
        </span>
      </Tooltip>
      
      {hasCopiedData && (
        <Tooltip title={t('common.clearCopy')}>
          <span>
            <Button
              variant={variant}
              size={size}
              startIcon={<IconTrashX size={16} />}
              onClick={onClear}
              color="error"
              sx={{ minWidth: showLabels ? 80 : 'auto' }}
            >
              {showLabels ? t('common.clear') : ''}
            </Button>
          </span>
        </Tooltip>
      )}
    </Stack>
  );
};

export default CopyPasteButtons;
