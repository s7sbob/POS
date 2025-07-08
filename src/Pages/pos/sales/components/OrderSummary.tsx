// File: src/pages/pos/sales/components/OrderSummary.tsx
import React from 'react';
import { 
  Box, Typography, List, ListItem, 
  IconButton, Divider, Button, Grid
} from '@mui/material';
import { IconTrash, IconSend, IconPrinter, IconCreditCard, IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const OrderSummary: React.FC = () => {
  useTranslation();

  const orderItems = [
    { id: '1', name: 'Crepe', price: 50, quantity: 2, extras: 'Extra cheese', extraPrice: 20, total: 100 },
    { id: '2', name: 'Crepe', price: 50, quantity: 2, extras: 'Extra cheese', extraPrice: 20, total: 100 },
    { id: '3', name: 'Crepe', price: 50, quantity: 2, extras: 'Extra cheese', extraPrice: 20, total: 100 },
    { id: '4', name: 'Crepe', price: 50, quantity: 2, extras: 'Extra cheese', extraPrice: 20, total: 100 }
  ];

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'white'
    }}>
      {/* Order Header */}
      <Box sx={{ 
        height: '7%',
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '1vh 0.8vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <Typography sx={{ 
          fontWeight: 'bold',
          fontSize: '1.1vw'
        }}>
          #123
        </Typography>
        <Typography sx={{ 
          fontWeight: 'bold',
          fontSize: '1.8vw'
        }}>
          1250 EGP
        </Typography>
      </Box>

      {/* Order Details Header */}
      <Box sx={{ 
        height: '10%',
        padding: '1vh 0.8vw',
        borderBottom: '1px solid #e0e0e0',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Typography sx={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5vh',
          fontSize: '0.9vw'
        }}>
          Order Details
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.3vw',
          backgroundColor: '#f5f5f5',
          padding: '0.3vh 0.5vw',
          borderRadius: '0.2vw'
        }}>
          <IconUser size="0.8vw" color="#666" />
          <Typography sx={{ 
            color: 'text.secondary',
            fontSize: '0.7vw'
          }}>
            Walk in Customer
          </Typography>
        </Box>
      </Box>

      {/* Order Items */}
      <Box sx={{ 
        height: '58%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.3vw'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '0.15vw'
        }
      }}>
        <List sx={{ padding: 0 }}>
          {orderItems.map((item) => (
            <ListItem 
              key={item.id}
              sx={{ 
                borderBottom: '1px solid #f0f0f0',
                padding: '1vh 0.8vw',
                display: 'block'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                width: '100%',
                gap: '0.3vw'
              }}>
                <Box sx={{ 
                  width: '1vw', 
                  height: '1vw', 
                  backgroundColor: '#f0f0f0',
                  borderRadius: '0.1vw',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.2vh'
                }}>
                                  <IconButton 
                  size="small" 
                  sx={{ 
                    flexShrink: 0,
                    padding: '0.2vh'
                  }}
                >
                  <IconTrash size="0.8vw" />
                </IconButton>
                </Box>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.3vh'
                  }}>
                    <Typography sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.7vw',
                      lineHeight: 1.2
                    }}>
                      {item.quantity} × {item.name}
                    </Typography>
                    <Typography sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.7vw'
                    }}>
                      {item.price}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.3vh'
                  }}>
                    <Typography sx={{
                      color: 'text.secondary',
                      fontSize: '0.6vw',
                      lineHeight: 1
                    }}>
                      2 × {item.extras} [{item.extraPrice}]
                    </Typography>
                    <Typography sx={{ 
                      fontWeight: 'bold', 
                      color: '#2196F3',
                      fontSize: '0.7vw'
                    }}>
                      {item.total}
                    </Typography>
                  </Box>
                  
                  <Typography sx={{
                    color: 'text.secondary',
                    fontSize: '0.6vw'
                  }}>
                    {item.price}
                  </Typography>
                </Box>
                

              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Summary & Actions */}
      <Box sx={{ 
        height: '25%',
        padding: '1vh 0.8vw',
        borderTop: '1px solid #e0e0e0',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Summary */}
        <Box sx={{ flex: 0.6, marginBottom: '1vh' }}>
          {[
            { label: 'Sub Total', value: '250 EGP' },
            { label: 'Discount', value: '20 EGP' },
            { label: 'Tax', value: '50 EGP' },
            { label: 'Service', value: '70 EGP' }
          ].map((item) => (
            <Box key={item.label} sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.3vh' 
            }}>
              <Typography sx={{ fontSize: '0.7vw' }}>
                {item.label}
              </Typography>
              <Typography sx={{ 
                fontWeight: 'bold',
                fontSize: '0.7vw'
              }}>
                {item.value}
              </Typography>
            </Box>
          ))}
          
          <Divider sx={{ margin: '0.5vh 0' }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ 
              fontWeight: 'bold',
              fontSize: '0.9vw'
            }}>
              Total
            </Typography>
            <Typography sx={{ 
              fontWeight: 'bold',
              fontSize: '0.9vw'
            }}>
              320 EGP
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Grid container spacing="0.2vw" sx={{ flex: 0.4 }}>
          {[
            { icon: IconSend, label: 'Send', color: '#f44336' },
            { icon: IconPrinter, label: 'Print', color: '#2196F3' },
            { icon: IconCreditCard, label: 'Pay', color: '#4CAF50' }
          ].map((button) => (
            <Grid item xs={4} key={button.label} sx={{ height: '100%' }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<button.icon size="0.8vw" />}
                sx={{ 
                  backgroundColor: button.color,
                  color: 'white',
                  height: '100%',
                  fontWeight: 'bold',
                  fontSize: '0.6vw',
                  borderRadius: '0.2vw',
                  '&:hover': { 
                    backgroundColor: button.color,
                    filter: 'brightness(0.9)'
                  }
                }}
              >
                {button.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default OrderSummary;
