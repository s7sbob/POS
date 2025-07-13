// src/Pages/pos/newSales/components/ProductOptionsPopup.tsx
import React, { useState, useEffect } from 'react';
import { PosProduct, PosPrice, ProductOptionGroup, ProductOptionItem, SelectedOption } from '../types/PosSystem';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ProductOptionsPopupProps {
  product: PosProduct | null;
  selectedPrice: PosPrice | null;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (selectedOptions: SelectedOption[]) => void;
}

const ProductOptionsPopup: React.FC<ProductOptionsPopupProps> = ({
  product,
  selectedPrice,
  quantity,
  isOpen,
  onClose,
  onComplete
}) => {
  // ✅ ALL HOOKS MUST BE AT THE TOP - ALWAYS CALLED IN SAME ORDER
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [groupSelections, setGroupSelections] = useState<{[groupId: string]: {[itemId: string]: number}}>({});

  // ✅ useEffect is now always called in the same position
  useEffect(() => {
    if (isOpen && product) {
      setCurrentGroupIndex(0);
      setSelectedOptions([]);
      setGroupSelections({});
    }
  }, [isOpen, product]);

  // ✅ NOW we can do conditional rendering/early returns
  if (!isOpen || !product || !selectedPrice) {
    return null;
  }

  const optionGroups = product.productOptionGroups || [];
  
  if (optionGroups.length === 0) {
    onComplete([]);
    return null;
  }

  const currentGroup = optionGroups[currentGroupIndex];
  
  if (!currentGroup) {
    onComplete(selectedOptions);
    return null;
  }

  const handleItemSelection = (group: ProductOptionGroup, item: ProductOptionItem, change: number) => {
    const newSelections = { ...groupSelections };
    
    if (!newSelections[group.id]) {
      newSelections[group.id] = {};
    }
    
    const currentCount = newSelections[group.id][item.id] || 0;
    const newCount = Math.max(0, currentCount + change);
    
    const totalSelected = Object.values(newSelections[group.id]).reduce((sum, count) => sum + count, 0);
    const otherItemsTotal = totalSelected - currentCount;
    
    if (group.allowMultiple) {
      if (newCount + otherItemsTotal <= group.maxSelection) {
        newSelections[group.id][item.id] = newCount;
      }
    } else {
      if (newCount > 0) {
        newSelections[group.id] = { [item.id]: 1 };
      } else {
        newSelections[group.id][item.id] = 0;
      }
    }
    
    setGroupSelections(newSelections);
  };

  const isGroupValid = (group: ProductOptionGroup): boolean => {
    const selections = groupSelections[group.id] || {};
    const totalSelected = Object.values(selections).reduce((sum, count) => sum + count, 0);
    
    if (group.isRequired) {
      return totalSelected >= group.minSelection;
    }
    
    return totalSelected === 0 || totalSelected >= group.minSelection;
  };

  const canSkipGroup = (group: ProductOptionGroup): boolean => {
    return !group.isRequired;
  };

  const handleNext = () => {
    const selections = groupSelections[currentGroup.id] || {};
    
    Object.entries(selections).forEach(([itemId, count]) => {
      if (count > 0) {
        const item = currentGroup.optionItems.find(i => i.id === itemId);
        if (item) {
          const existingIndex = selectedOptions.findIndex(
            opt => opt.groupId === currentGroup.id && opt.itemId === itemId
          );
          
          const newOption: SelectedOption = {
            groupId: currentGroup.id,
            itemId: itemId,
            itemName: item.name,
            quantity: count,
            extraPrice: item.extraPrice,
            isCommentOnly: item.isCommentOnly
          };
          
          if (existingIndex >= 0) {
            selectedOptions[existingIndex] = newOption;
          } else {
            selectedOptions.push(newOption);
          }
        }
      }
    });
    
    if (currentGroupIndex < optionGroups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
    } else {
      onComplete(selectedOptions);
    }
  };

  const handleSkip = () => {
    if (currentGroupIndex < optionGroups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
    } else {
      onComplete(selectedOptions);
    }
  };

  const handleBack = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
    }
  };

  const currentSelections = groupSelections[currentGroup.id] || {};
  const totalSelected = Object.values(currentSelections).reduce((sum, count) => sum + count, 0);

  return (
    <div className="popup-overlay">
      <div className="popup-content options-popup">
        <div className="popup-header">
          <div className="popup-title-section">
            <h3 className="popup-title">{product.nameArabic}</h3>
            <div className="popup-subtitle">
              {selectedPrice.nameArabic} - الكمية: {quantity}
            </div>
          </div>
          <button className="popup-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="popup-body">
          <div className="group-header">
            <h4 className="group-title">{currentGroup.name}</h4>
            <div className="group-progress">
              {currentGroupIndex + 1} من {optionGroups.length}
            </div>
          </div>
          
          <div className="group-info">
            <div className="selection-info">
              {currentGroup.isRequired && (
                <span className="required-badge">مطلوب</span>
              )}
              <span className="selection-count">
                تم اختيار {totalSelected} من {currentGroup.maxSelection}
              </span>
            </div>
            
            {currentGroup.minSelection > 0 && (
              <div className="min-selection">
                الحد الأدنى: {currentGroup.minSelection}
              </div>
            )}
          </div>
          
          <div className="options-list">
            {currentGroup.optionItems
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((item) => {
                const itemCount = currentSelections[item.id] || 0;
                const canAdd = currentGroup.allowMultiple 
                  ? totalSelected < currentGroup.maxSelection
                  : itemCount === 0;
                
                return (
                  <div key={item.id} className="option-item">
                    <div className="option-info">
                      <div className="option-name">{item.name}</div>
                      {item.extraPrice > 0 && (
                        <div className="option-price">
                          +{item.extraPrice} EGP
                        </div>
                      )}
                      {item.isCommentOnly && (
                        <div className="comment-only">تعليق فقط</div>
                      )}
                    </div>
                    
                    <div className="option-controls">
                      {currentGroup.allowMultiple ? (
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn minus"
                            onClick={() => handleItemSelection(currentGroup, item, -1)}
                            disabled={itemCount === 0}
                          >
                            <RemoveIcon />
                          </button>
                          <span className="quantity-display">{itemCount}</span>
                          <button
                            className="quantity-btn plus"
                            onClick={() => handleItemSelection(currentGroup, item, 1)}
                            disabled={!canAdd}
                          >
                            <AddIcon />
                          </button>
                        </div>
                      ) : (
                        <button
                          className={`select-btn ${itemCount > 0 ? 'selected' : ''}`}
                          onClick={() => handleItemSelection(currentGroup, item, itemCount > 0 ? -1 : 1)}
                        >
                          {itemCount > 0 ? 'مختار' : 'اختيار'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        
        <div className="popup-footer">
          <div className="footer-buttons">
            <button className="btn-cancel" onClick={onClose}>
              إلغاء
            </button>
            
            {currentGroupIndex > 0 && (
              <button className="btn-back" onClick={handleBack}>
                رجوع
              </button>
            )}
            
            {canSkipGroup(currentGroup) && (
              <button className="btn-skip" onClick={handleSkip}>
                تخطي
              </button>
            )}
            
            <button
              className="btn-next"
              onClick={handleNext}
              disabled={!isGroupValid(currentGroup)}
            >
              {currentGroupIndex < optionGroups.length - 1 ? 'التالي' : 'إنهاء'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOptionsPopup;
