// src/Pages/pos/newSales/components/ProductOptionsPopup.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PosProduct, PosPrice, ProductOptionGroup, ProductOptionItem, SelectedOption } from '../types/PosSystem';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from '../styles/ProductOptionsPopup.module.css';

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
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [groupSelections, setGroupSelections] = useState<{[groupId: string]: {[itemId: string]: number}}>({});
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  useEffect(() => {
    if (isOpen && product) {
      setSelectedOptions([]);
      setGroupSelections({});
      setCurrentGroupIndex(0);
    }
  }, [isOpen, product]);

  if (!isOpen || !product || !selectedPrice) return null;

  const optionGroups = product.productOptionGroups || [];

  if (optionGroups.length === 0) {
    onComplete([]);
    return null;
  }

  const currentGroup = optionGroups[currentGroupIndex];

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

  const handleCardClick = (group: ProductOptionGroup, item: ProductOptionItem) => {
    const currentCount = groupSelections[group.id]?.[item.id] || 0;
    const totalSelected = Object.values(groupSelections[group.id] || {}).reduce((sum, count) => sum + count, 0);
    const otherItemsTotal = totalSelected - currentCount;
    
    if (group.allowMultiple) {
      // للمجموعات المتعددة: زيادة الكمية
      if (otherItemsTotal < group.maxSelection) {
        handleItemSelection(group, item, 1);
      }
    } else {
      // للمجموعات الفردية: تغيير الحالة
      handleItemSelection(group, item, currentCount > 0 ? -1 : 1);
    }
  };

  const isCurrentGroupValid = (): boolean => {
    const selections = groupSelections[currentGroup.id] || {};
    const totalSelected = Object.values(selections).reduce((sum, count) => sum + count, 0);
    
    if (currentGroup.isRequired) {
      return totalSelected >= currentGroup.minSelection;
    }
    
    return true; // المجموعات غير المطلوبة صحيحة دائما
  };

  const isAllGroupsValid = (): boolean => {
    return optionGroups.every(group => {
      const selections = groupSelections[group.id] || {};
      const totalSelected = Object.values(selections).reduce((sum, count) => sum + count, 0);
      
      if (group.isRequired) {
        return totalSelected >= group.minSelection;
      }
      
      return totalSelected === 0 || totalSelected >= group.minSelection;
    });
  };

  const handleNext = () => {
    if (currentGroupIndex < optionGroups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
    }
  };

  const handleComplete = () => {
    const allSelectedOptions: SelectedOption[] = [];
    
    optionGroups.forEach(group => {
      const selections = groupSelections[group.id] || {};
      Object.entries(selections).forEach(([itemId, count]) => {
        if (count > 0) {
          const item = group.optionItems.find(i => i.id === itemId);
          if (item) {
            allSelectedOptions.push({
              groupId: group.id,
              itemId: itemId,
              itemName: item.name,
              quantity: count,
              extraPrice: item.extraPrice,
              isCommentOnly: item.isCommentOnly
            });
          }
        }
      });
    });
    
    onComplete(allSelectedOptions);
  };

  const calculateTotalPrice = () => {
    let total = selectedPrice.price * quantity;
    
    optionGroups.forEach(group => {
      const selections = groupSelections[group.id] || {};
      Object.entries(selections).forEach(([itemId, count]) => {
        if (count > 0) {
          const item = group.optionItems.find(i => i.id === itemId);
          if (item) {
            total += item.extraPrice * count * quantity;
          }
        }
      });
    });
    
    return total;
  };

  const selections = groupSelections[currentGroup.id] || {};
  const totalSelected = Object.values(selections).reduce((sum, count) => sum + count, 0);

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
<div className={styles.popupHeader}>
  <div className={styles.popupTitleSection}>
    <h3 className={styles.popupTitle}>{product.nameArabic}</h3>
    <div className={styles.popupSubtitle}>
      {selectedPrice.nameArabic} - {t("pos.newSales.products.quantity")}: {quantity}
    </div>
  </div>
  <div style={{ display: 'flex', gap: '8px' }}>
    {currentGroupIndex > 0 && (
      <button 
        className={styles.popupClose} 
        onClick={handlePrevious}
        title={t("pos.newSales.actions.backToPreviousGroup")}
      >
        <ArrowBackIcon />
      </button>
    )}
    <button className={styles.popupClose} onClick={onClose}>
      <CloseIcon />
    </button>
  </div>
</div>
        
        <div className={styles.popupBody}>
          {/* مؤشر التقدم */}
          <div className={styles.progressIndicator}>
            <div className={styles.progressText}>
              {t("pos.newSales.products.groupCount", { current: currentGroupIndex + 1, total: optionGroups.length })}
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${((currentGroupIndex + 1) / optionGroups.length) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.optionsContainer}>
            <div className={styles.optionGroup}>
              <div className={styles.groupHeader}>
                <div className={styles.groupTitle}>
                  <span className={styles.groupName}>{currentGroup.name}</span>
                  {currentGroup.isRequired && (
                    <span className={styles.requiredBadge}>{t("pos.newSales.products.required")}</span>
                  )}
                </div>
                <div className={styles.groupInfo}>
                  <span className={styles.selectionCount}>
                    {t("pos.newSales.productOptions.selectionCount", { selected: totalSelected, max: currentGroup.maxSelection })}
                  </span>
                  {currentGroup.minSelection > 0 && (
                    <span className={styles.minSelection}>
                      {t("pos.newSales.productOptions.minSelection", { min: currentGroup.minSelection })}
                    </span>
                  )}
                </div>
              </div>
              
              <div className={styles.optionsGrid}>
                {currentGroup.optionItems
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => {
                    const itemCount = selections[item.id] || 0;
                    const canAdd = currentGroup.allowMultiple 
                      ? totalSelected < currentGroup.maxSelection
                      : itemCount === 0;
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`${styles.optionCard} ${itemCount > 0 ? styles.selected : ''}`}
                        onClick={() => handleCardClick(currentGroup, item)}
                      >
                        <div className={styles.optionContent}>
                          <div className={styles.optionInfo}>
                            <div className={styles.optionName}>{item.name}</div>
                            {item.extraPrice > 0 && (
                              <div className={styles.optionPrice}>
                                +{item.extraPrice} {t("pos.newSales.products.currency")}
                              </div>
                            )}
                          </div>
                          
                          <div className={styles.optionControls}>
                            {currentGroup.allowMultiple ? (
                              <div className={styles.quantitySection}>
                                {itemCount > 0 && (
                                  <button
                                    className={styles.removeBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleItemSelection(currentGroup, item, -1);
                                    }}
                                  >
                                    <RemoveIcon />
                                  </button>
                                )}
                                
                                {itemCount > 0 ? (
                                  <div className={styles.quantityBadge}>
                                    {itemCount}
                                  </div>
                                ) : canAdd ? (
                                  <div className={styles.addIcon}>
                                    <AddIcon />
                                  </div>
                                ) : (
                                  <div className={styles.maxReached}>
                                    <span>{t("pos.newSales.productOptions.maxReached")}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className={styles.singleSelect}>
                                {itemCount > 0 ? (
                                  <div className={styles.selectedIcon}>
                                    <CheckIcon />
                                  </div>
                                ) : (
                                  <div className={styles.unselectedIcon}>
                                    <AddIcon />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          
          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>{t("pos.newSales.products.total")}:</span>
              <span className={styles.totalValue}>{calculateTotalPrice().toFixed(2)} {t("pos.newSales.products.currency")}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.popupFooter}>
          <button className={styles.btnCancel} onClick={onClose}>
            {t("pos.newSales.actions.cancel")}
          </button>
          
          {currentGroupIndex < optionGroups.length - 1 ? (
            <button
              className={styles.btnConfirm}
              onClick={handleNext}
              disabled={currentGroup.isRequired && !isCurrentGroupValid()}
            >
              {t("pos.newSales.actions.next")}
              <ArrowForwardIcon />
            </button>
          ) : (
            <button
              className={styles.btnConfirm}
              onClick={handleComplete}
              disabled={!isAllGroupsValid()}
            >
              {t("pos.newSales.actions.confirmSelection")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOptionsPopup;
