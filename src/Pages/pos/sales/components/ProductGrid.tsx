// File: src/pages/pos/sales/components/ProductGrid.tsx
import React from 'react';
import { 
  Box, Card, CardMedia, CardContent, 
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductGrid: React.FC = () => {
  const { t } = useTranslation();

  const products: Product[] = Array.from({ length: 18 }, (_, index) => ({
    id: `${index + 1}`,
    name: 'كريب فراخ',
    price: 100,
    image: `https://picsum.photos/195/187?random=${index + 1}`,
    category: 'wraps'
  }));

  const handleProductClick = (product: Product) => {
    console.log('Adding product:', product);
  };

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      overflow: 'auto',
      backgroundColor: '#f5f5f5',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      '&::-webkit-scrollbar': {
        width: '8px'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '4px'
      }
    }}>
      {/* الصف الأول */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'nowrap'
      }}>
        {products.slice(0, 6).map((product) => (
          <Card 
            key={product.id}
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              },
              borderRadius: '16px',
              overflow: 'hidden',
              width: '195px',
              height: '269px',
              backgroundColor: 'white',
              position: 'relative',
              flexShrink: 0
            }}
            onClick={() => handleProductClick(product)}
          >
            <CardMedia
              component="img"
              sx={{ 
                width: '195px',
                height: '187px',
                objectFit: 'cover',
                borderRadius: '16px'
              }}
              image={product.image}
              alt={product.name}
            />
            <CardContent sx={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '82px',
              padding: '8px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              '&:last-child': { 
                paddingBottom: '8px' 
              }
            }}>
              <Typography 
                sx={{ 
                  color: 'black',
                  fontSize: '16px',
                  fontFamily: 'Cairo',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '4px'
                }}
              >
                {product.name}
              </Typography>
              <Typography 
                sx={{ 
                  textAlign: 'center'
                }}
              >
                <span style={{
                  color: 'black',
                  fontSize: '20px',
                  fontFamily: 'Cairo',
                  fontWeight: '600'
                }}>
                  {product.price}{' '}
                </span>
                <span style={{
                  color: 'black',
                  fontSize: '12px',
                  fontFamily: 'Cairo',
                  fontWeight: '600'
                }}>
                  EGP
                </span>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* الصف الثاني */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'nowrap'
      }}>
        {products.slice(6, 12).map((product) => (
          <Card 
            key={product.id}
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              },
              borderRadius: '16px',
              overflow: 'hidden',
              width: '195px',
              height: '269px',
              backgroundColor: 'white',
              position: 'relative',
              flexShrink: 0
            }}
            onClick={() => handleProductClick(product)}
          >
            <CardMedia
              component="img"
              sx={{ 
                width: '195px',
                height: '187px',
                objectFit: 'cover',
                borderRadius: '16px'
              }}
              image={product.image}
              alt={product.name}
            />
            <CardContent sx={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '82px',
              padding: '8px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              '&:last-child': { 
                paddingBottom: '8px' 
              }
            }}>
              <Typography 
                sx={{ 
                  color: 'black',
                  fontSize: '16px',
                  fontFamily: 'Cairo',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '4px'
                }}
              >
                {product.name}
              </Typography>
              <Typography 
                sx={{ 
                  textAlign: 'center'
                }}
              >
                <span style={{
                  color: 'black',
                  fontSize: '20px',
                  fontFamily: 'Cairo',
                  fontWeight: '600'
                }}>
                  {product.price}{' '}
                </span>
                <span style={{
                  color: 'black',
                  fontSize: '12px',
                  fontFamily: 'Cairo',
                  fontWeight: '600'
                }}>
                  EGP
                </span>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* الصف الثالث */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'nowrap'
      }}>
        {products.slice(12, 18).map((product) => (
          <Card 
            key={product.id}
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              },
              borderRadius: '16px',
              overflow: 'hidden',
              width: '195px',
              height: '269px',
              backgroundColor: 'white',
              position: 'relative',
              flexShrink: 0
            }}
            onClick={() => handleProductClick(product)}
          >
            <CardMedia
              component="img"
              sx={{ 
                width: '195px',
                height: '187px',
                objectFit: 'cover',
                borderRadius: '16px'
              }}
              image={product.image}
              alt={product.name}
            />
            <CardContent sx={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '82px',
              padding: '8px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              '&:last-child': { 
                paddingBottom: '8px' 
              }
            }}>
              <Typography 
                sx={{ 
                  color: 'black',
                  fontSize: '16px',
                  fontFamily: 'Cairo',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '4px'
                }}
              >
                {product.name}
              </Typography>
              <Typography 
                sx={{ 
                  textAlign: 'center'
                }}
              >
                <span style={{
                  color: 'black',
                  fontSize: '20px',
                  fontFamily: 'Cairo',
                  fontWeight: '600'
                }}>
                  {product.price}{' '}
                </span>
                <span style={{
                  color: 'black',
                  fontSize: '12px',
                  fontFamily: 'Cairo',
                  fontWeight: '600'
                }}>
                  EGP
                </span>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ProductGrid;
