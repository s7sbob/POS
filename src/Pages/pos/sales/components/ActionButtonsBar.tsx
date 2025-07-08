// File: src/pages/pos/sales/components/ActionButtonsBar.tsx
import React, { useState } from 'react';
import { 
  Box, Button, Grid, TextField, InputAdornment 
} from '@mui/material';
import { IconSearch, IconPlus, IconMinus, IconTag, IconSortAscending } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const ActionButtonsBar: React.FC = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      padding: '0.5vh 1vw',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Grid container spacing="0.5vw" alignItems="center" sx={{ height: '100%' }}>
        {/* Action Buttons */}
        <Grid item xs={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<IconPlus size="1vw" />}
            sx={{ 
              backgroundColor: '#4CAF50',
              color: 'white',
              height: '100%',
              fontSize: '0.9vw',
              fontWeight: 'bold',
              borderRadius: '0.3vw',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Extra
          </Button>
        </Grid>
        
        <Grid item xs={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<IconMinus size="1vw" />}
            sx={{ 
              backgroundColor: '#f44336',
              color: 'white',
              height: '100%',
              fontSize: '0.9vw',
              fontWeight: 'bold',
              borderRadius: '0.3vw',
              '&:hover': { backgroundColor: '#da190b' }
            }}
          >
            Without
          </Button>
        </Grid>
        
        <Grid item xs={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<IconTag size="1vw" />}
            sx={{ 
              backgroundColor: '#FF9800',
              color: 'white',
              height: '100%',
              fontSize: '0.9vw',
              fontWeight: 'bold',
              borderRadius: '0.3vw',
              '&:hover': { backgroundColor: '#e68900' }
            }}
          >
            Offer
          </Button>
        </Grid>

        {/* Search */}
        <Grid item xs={4}>
          <TextField
            fullWidth
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.2vw" />
                </InputAdornment>
              ),
              sx: {
                fontSize: '0.9vw',
                height: '100%'
              }
            }}
            sx={{
              height: '100%',
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5',
                height: '100%',
                borderRadius: '0.3vw'
              }
            }}
          />
        </Grid>

        {/* Sort Button */}
        <Grid item xs={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<IconSortAscending size="1vw" />}
            sx={{ 
              backgroundColor: '#2196F3',
              color: 'white',
              height: '100%',
              fontSize: '0.9vw',
              fontWeight: 'bold',
              borderRadius: '0.3vw',
              '&:hover': { backgroundColor: '#1976D2' }
            }}
          >
            Sort
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActionButtonsBar;
