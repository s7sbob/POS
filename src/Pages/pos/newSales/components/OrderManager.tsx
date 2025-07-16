// src/Pages/pos/newSales/components/OrderManager.tsx - الكود الكامل المُحدث
import React from 'react';
import { PosProduct, PosPrice, SelectedOption, OrderItem, SubItem } from '../types/PosSystem';
import * as posService from '../../../../services/posService';

interface OrderManagerProps {
  keypadValue: string;
  isExtraMode: boolean;
  isWithoutMode: boolean;
  selectedOrderItemId: string | null;
  onOrderAdd: (orderItem: OrderItem) => void;
  onOrderUpdate: (itemId: string, updateType: 'addSubItem' | 'removeSubItem', data: any) => void;
  onModeReset: () => void;
  onLoadNormalProducts: () => void;
}

export const useOrderManager = ({
  keypadValue,
  isExtraMode,
  isWithoutMode,
  selectedOrderItemId,
  onOrderAdd,
  onOrderUpdate,
  onModeReset,
  onLoadNormalProducts
}: OrderManagerProps) => {
  
  const addToOrder = React.useCallback((
    product: PosProduct, 
    price: PosPrice, 
    selectedOptions: SelectedOption[]
  ) => {
    const quantity = parseInt(keypadValue) || 1;
    const basePrice = posService.calculateTotalPrice(price.price, selectedOptions, quantity);
    
    // إذا كان Extra أو Without mode مع منتج محدد
    if ((isExtraMode || isWithoutMode) && selectedOrderItemId) {
      const subItem: SubItem = {
        id: `${product.id}_${price.id}_${Date.now()}`,
        type: isExtraMode ? 'extra' : 'without',
        name: `${product.nameArabic}${price.nameArabic ? ` - ${price.nameArabic}` : ''}`,
        quantity,
        price: isWithoutMode ? 0 : basePrice,
        productId: product.id
      };
      
      onOrderUpdate(selectedOrderItemId, 'addSubItem', subItem);
    } else {
      // إضافة منتج جديد (سواء عادي أو Extra/Without منفصل)
      const subItems: SubItem[] = [];
      
      // تحويل الخيارات إلى sub-items
      selectedOptions.forEach(option => {
        subItems.push({
          id: `option_${option.itemId}_${Date.now()}`,
          type: 'option',
          name: option.itemName,
          quantity: option.quantity,
          price: option.extraPrice * option.quantity,
          isRequired: true,
          groupId: option.groupId
        });
      });
      
      const orderItem: OrderItem = {
        id: `${product.id}_${price.id}_${Date.now()}`,
        product,
        selectedPrice: price,
        quantity,
        totalPrice: basePrice,
        subItems: subItems.length > 0 ? subItems : undefined,
        // إضافة كمنتج Extra/Without منفصل إذا لم يكن هناك منتج محدد
        isExtra: isExtraMode && !selectedOrderItemId,
        isWithout: isWithoutMode && !selectedOrderItemId,
      };

      onOrderAdd(orderItem);
    }
    
    onModeReset();
    onLoadNormalProducts();
  }, [
    keypadValue, 
    isExtraMode, 
    isWithoutMode, 
    selectedOrderItemId, 
    onOrderAdd,
    onOrderUpdate,
    onModeReset, 
    onLoadNormalProducts
  ]);

  const removeSubItem = React.useCallback((orderItemId: string, subItemId: string) => {
    onOrderUpdate(orderItemId, 'removeSubItem', subItemId);
  }, [onOrderUpdate]);

  return { addToOrder, removeSubItem };
};
