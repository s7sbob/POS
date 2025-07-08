// File: src/pages/pos/sales/components/CategorySidebar.tsx
import React, { useState } from 'react';
import { 
  Box, List, ListItem, ListItemButton,
  Avatar, Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const CategorySidebar: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('burgers');

  // زيادة عدد الفئات للاختبار
  const categories: Category[] = [
    { id: 'burgers', name: 'برجر', icon: '🍔', color: '#FF5722' },
    { id: 'fries', name: 'بطاطس', icon: '🍟', color: '#FF9800' },
    { id: 'pasta', name: 'باستا', icon: '🍝', color: '#4CAF50' },
    { id: 'pizza', name: 'بيتزا', icon: '🍕', color: '#2196F3' },
    { id: 'drinks', name: 'مشروبات', icon: '🥤', color: '#9C27B0' },
    { id: 'desserts', name: 'حلويات', icon: '🍰', color: '#E91E63' },
    { id: 'salads', name: 'سلطات', icon: '🥗', color: '#4CAF50' },
    { id: 'sandwiches', name: 'ساندوتش', icon: '🥪', color: '#795548' },
    { id: 'chicken', name: 'فراخ', icon: '🍗', color: '#FF5722' },
    { id: 'seafood', name: 'مأكولات بحرية', icon: '🦐', color: '#00BCD4' }
  ];

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      backgroundColor: '#f5f5f5',
      borderLeft: '1px solid #e0e0e0',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <List sx={{ 
        padding: '0.5vh 0.2vw',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8vh',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.2vw'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '0.1vw'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.1)'
        }
      }}>
        {categories.map((category) => (
          <ListItem 
            key={category.id} 
            disablePadding 
            sx={{ 
              minHeight: '10vh', // ارتفاع ثابت لكل عنصر
              flexShrink: 0
            }}
          >
            <ListItemButton
              selected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
              sx={{
                borderRadius: '0.4vw',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: 'white',
                padding: '0.8vh 0.1vw',
                '&.Mui-selected': {
                  backgroundColor: category.color + '20',
                  '&:hover': {
                    backgroundColor: category.color + '30',
                  }
                },
                '&:hover': {
                  backgroundColor: selectedCategory === category.id 
                    ? category.color + '30' 
                    : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <Avatar
                sx={{ 
                  width: '3.2vw', 
                  height: '3.2vw',
                  backgroundColor: selectedCategory === category.id ? category.color : 'grey.200',
                  fontSize: '1.6vw',
                  marginBottom: '0.4vh'
                }}
              >
                {category.icon}
              </Avatar>
              <Typography 
                sx={{ 
                  fontWeight: 'bold',
                  color: selectedCategory === category.id ? category.color : 'text.secondary',
                  textAlign: 'center',
                  fontSize: '0.65vw',
                  lineHeight: 1.1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  width: '100%',
                  maxHeight: '2.2vh'
                }}
              >
                {category.name}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CategorySidebar;
