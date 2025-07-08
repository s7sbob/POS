// File: src/pages/pos/sales/components/NumberPadBar.tsx
import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { IconBackspace } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const NumberPadBar: React.FC = () => {
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = useState('5');

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'C'];

  const handleNumberClick = (value: string) => {
    if (value === 'C') {
      setDisplayValue('');
    } else if (value === '.') {
      if (!displayValue.includes('.')) {
        setDisplayValue(prev => prev + '.');
      }
    } else {
      setDisplayValue(prev => prev === '0' ? value : prev + value);
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      padding: '0.5vh 1vw',
      backgroundColor: 'white',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5vw'
    }}>
      {/* Display Value - عرض ثابت */}
      <Paper 
        elevation={0}
        sx={{ 
          width: '12vw',
          height: '80%',
          backgroundColor: '#2196F3',
          borderRadius: '0.5vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Typography 
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            fontSize: '2.2vw',
            lineHeight: 1
          }}
        >
          {displayValue || '0'}
        </Typography>
      </Paper>

      {/* Number Buttons Container */}
      <Box sx={{ 
        flex: 1,
        height: '80%',
        display: 'flex',
        gap: '0.3vw'
      }}>
        {numbers.map((num) => (
          <Button
            key={num}
            variant="outlined"
            onClick={() => handleNumberClick(num)}
            sx={{ 
              flex: 1,
              height: '100%',
              fontSize: '1.1vw',
              fontWeight: 'bold',
              borderColor: '#e0e0e0',
              color: num === 'C' ? '#f44336' : 'text.primary',
              borderRadius: '0.3vw',
              minWidth: 0,
              '&:hover': { 
                backgroundColor: num === 'C' ? '#ffebee' : '#f5f5f5' 
              }
            }}
          >
            {num === 'C' ? <IconBackspace size="1.2vw" /> : num}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default NumberPadBar;
