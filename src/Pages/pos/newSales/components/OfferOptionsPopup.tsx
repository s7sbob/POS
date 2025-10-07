// src/Pages/pos/newSales/components/OfferOptionsPopup.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { OfferData, OfferGroup, OfferItem, SelectedOfferItem, PosProduct, PosPrice } from '../types/PosSystem';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from '../styles/ProductOptionsPopup.module.css';

interface OfferOptionsPopupProps {
  offer: OfferData | null;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (selectedItems: SelectedOfferItem[]) => void;
  getProductByPriceId: (priceId: string) => Promise<{ product: PosProduct; price: PosPrice } | null>;
}

const OfferOptionsPopup: React.FC<OfferOptionsPopupProps> = ({
  offer,
  quantity,
  isOpen,
  onClose,
  onComplete,
  getProductByPriceId
}) => {
  const { t } = useTranslation();
  
  // ✅ جميع الـ useState في البداية
  const [selectedItems, setSelectedItems] = useState<SelectedOfferItem[]>([]);
  const [groupSelections, setGroupSelections] = useState<{[groupId: string]: {[itemId: string]: number}}>({});
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [productsData, setProductsData] = useState<{[priceId: string]: { product: PosProduct; price: PosPrice }}>({});
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

// إضافة useRef لتتبع حالة التحميل
const loadingRef = useRef(false);

const loadProductsData = useCallback(async () => {
  if (!offer || loadingRef.current) return;
  
  loadingRef.current = true; // ✅ منع التحميل المتكرر
  setLoading(true);
  
  const newProductsData: {[priceId: string]: { product: PosProduct; price: PosPrice }} = {};
  
  try {
    const uniquePriceIds = [...new Set(offer.offerItems.map(item => item.productPriceId))];
    
    await Promise.all(uniquePriceIds.map(async (priceId) => {
      try {
        const productData = await getProductByPriceId(priceId);
        if (productData) {
          newProductsData[priceId] = productData;
        }
      } catch (error) {
        console.error('خطأ في تحميل بيانات المنتج:', priceId, error);
      }
    }));
    
    setProductsData(newProductsData);
    setDataLoaded(true);
    console.log('✅ تم تحميل بيانات المنتجات بنجاح');
  } catch (error) {
    console.error('خطأ في تحميل بيانات المنتجات:', error);
  } finally {
    setLoading(false);
    loadingRef.current = false; // ✅ إعادة تعيين حالة التحميل
  }
}, [offer, getProductByPriceId]);


const handleItemSelection = useCallback((group: OfferGroup, offerItem: OfferItem, change: number) => {
  const newSelections = { ...groupSelections };
  
  if (!newSelections[group.id]) {
    newSelections[group.id] = {};
  }
  
  const currentCount = newSelections[group.id][offerItem.id] || 0;
  const newCount = Math.max(0, currentCount + change);
  
  const totalSelected = Object.values(newSelections[group.id]).reduce((sum, count) => sum + count, 0);
  const otherItemsTotal = totalSelected - currentCount;
  
  // تحديث الاختيارات حسب القواعد
  if (newCount + otherItemsTotal <= group.maxSelection) {
    newSelections[group.id][offerItem.id] = newCount;
    setGroupSelections(newSelections);
    
    // تحديث selectedItems مع السعر الصحيح
    const productData = productsData[offerItem.productPriceId];
    if (productData) {
      setSelectedItems(prev => {
        const filtered = prev.filter(item => item.offerItemId !== offerItem.id);
        
        if (newCount > 0) {
          // ✅ حساب السعر الصحيح حسب useOriginalPrice
          const correctPrice = offerItem.useOriginalPrice 
            ? productData.price.price 
            : (offerItem.customPrice || 0);
            
          filtered.push({
            groupId: group.id,
            offerItemId: offerItem.id,
            productPriceId: offerItem.productPriceId,
            quantity: newCount,
            price: correctPrice,
            productName: productData.product.nameArabic,
            priceName: productData.price.nameArabic, // ✅ إضافة اسم السعر
            isFixed: false
          });
          
          console.log(`✅ تم اختيار: ${productData.product.nameArabic} - ${productData.price.nameArabic} × ${newCount}`);
        }
        
        return filtered;
      });
    }
  }
}, [groupSelections, productsData]);



  const handleCardClick = useCallback((group: OfferGroup, offerItem: OfferItem) => {
    const currentCount = groupSelections[group.id]?.[offerItem.id] || 0;
    const totalSelected = Object.values(groupSelections[group.id] || {}).reduce((sum, count) => sum + count, 0);
    const otherItemsTotal = totalSelected - currentCount;
    
    // إضافة أو إزالة عنصر
    if (otherItemsTotal < group.maxSelection) {
      handleItemSelection(group, offerItem, currentCount > 0 ? -currentCount : 1);
    }
  }, [groupSelections, handleItemSelection]);

  const isCurrentGroupValid = useCallback((): boolean => {
    if (!offer || offer.offerGroups.length === 0) return true;
    
    const currentGroup = offer.offerGroups[currentGroupIndex];
    const selections = groupSelections[currentGroup.id] || {};
    const totalSelected = Object.values(selections).reduce((sum, count) => sum + count, 0);
    
    if (currentGroup.isMandatory) {
      return totalSelected >= currentGroup.minSelection;
    }
    
    return true;
  }, [offer, currentGroupIndex, groupSelections]);

  const isAllGroupsValid = useCallback((): boolean => {
    if (!offer) return false;
    
    return offer.offerGroups.every(group => {
      const selections = groupSelections[group.id] || {};
      const totalSelected = Object.values(selections).reduce((sum, count) => sum + count, 0);
      
      if (group.isMandatory) {
        return totalSelected >= group.minSelection;
      }
      
      return totalSelected === 0 || totalSelected >= group.minSelection;
    });
  }, [offer, groupSelections]);

const calculateTotalPrice = useCallback(() => {
  if (!offer) return 0;
  
  if (offer.priceType === 'Fixed') {
    return offer.fixedPrice * quantity;
  }
  
  // للعروض الديناميكية: احسب من المنتجات المختارة
  const dynamicTotal = selectedItems.reduce((total, item) => {
    // استخدام السعر المحسوب بالفعل من البيانات
    let itemPrice = item.price;
    
    // التأكد من استخدام السعر الصحيح
    const productData = productsData[item.productPriceId];
    if (productData && item.isFixed) {
      // للعناصر الثابتة: تحقق من useOriginalPrice
      const offerItem = offer.offerItems.find(oi => oi.id === item.offerItemId);
      if (offerItem) {
        itemPrice = offerItem.useOriginalPrice 
          ? productData.price.price 
          : (offerItem.customPrice || 0);
      }
    }
    
    return total + (itemPrice * item.quantity);
  }, 0);
  
  return dynamicTotal * quantity;
}, [offer, quantity, selectedItems, productsData]);


useEffect(() => {
  if (isOpen && offer) {
    console.log('🔄 تهيئة العرض...');
    setSelectedItems([]);
    setGroupSelections({});
    setCurrentGroupIndex(0);
    setDataLoaded(false);
    loadingRef.current = false; // ✅ إعادة تعيين المرجع
  }
}, [isOpen, offer]); // ✅ إزالة loadProductsData من dependencies

// useEffect منفصل للتحميل
useEffect(() => {
  if (isOpen && offer && !dataLoaded && !loadingRef.current) {
    loadProductsData();
  }
}, [isOpen, offer, dataLoaded, loadProductsData]);

// إضافة العناصر الثابتة (Fixed Items) تلقائياً - مصحح للـ loop
useEffect(() => {
  if (!offer || Object.keys(productsData).length === 0 || !dataLoaded) {
    return;
  }

  const fixedOfferItems = offer.offerItems.filter(item => 
    !item.offerGroupId && item.isDefaultSelected
  );

  if (fixedOfferItems.length === 0) {
    return; // لا توجد عناصر ثابتة
  }

  console.log('🔄 معالجة العناصر الثابتة:', fixedOfferItems.length);

  const newFixedItems: SelectedOfferItem[] = [];
  
  fixedOfferItems.forEach(item => {
    const productData = productsData[item.productPriceId];
    if (productData) {
      const correctPrice = item.useOriginalPrice 
        ? productData.price.price 
        : (item.customPrice || 0);
        
      newFixedItems.push({
        groupId: null,
        offerItemId: item.id,
        productPriceId: item.productPriceId,
        quantity: item.quantity,
        price: correctPrice,
        productName: productData.product.nameArabic,
        priceName: productData.price.nameArabic,
        isFixed: true
      });
    }
  });

  // ✅ التحقق من وجود العناصر قبل التحديث لمنع الـ loop
  setSelectedItems(prev => {
    // التحقق من أن العناصر الثابتة غير موجودة بالفعل
    const currentFixedItems = prev.filter(item => item.isFixed);
    
    // إذا كان عدد العناصر الثابتة نفسه، لا تحدث
    if (currentFixedItems.length === newFixedItems.length) {
      const allItemsExist = newFixedItems.every(newItem =>
        currentFixedItems.some(existingItem => 
          existingItem.offerItemId === newItem.offerItemId &&
          existingItem.price === newItem.price &&
          existingItem.quantity === newItem.quantity
        )
      );
      
      if (allItemsExist) {
        console.log('📊 العناصر الثابتة موجودة بالفعل، لا حاجة للتحديث');
        return prev; // ✅ منع التحديث غير الضروري
      }
    }
    
    // إزالة العناصر الثابتة القديمة وإضافة الجديدة
    const nonFixedItems = prev.filter(item => !item.isFixed);
    console.log('📊 إجمالي العناصر الثابتة المضافة:', newFixedItems.length);
    return [...nonFixedItems, ...newFixedItems];
  });
}, [offer, productsData, dataLoaded]); // ✅ dependencies محددة بوضوح



  // ✅ المعالجات بعد كل الـ hooks
  const handleNext = () => {
    if (offer && currentGroupIndex < offer.offerGroups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
    }
  };

  const handleComplete = () => {
    onComplete(selectedItems);
  };

  // ✅ جميع الـ early returns بعد كل الـ hooks
  if (!isOpen || !offer) return null;

  if (loading) {
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContent}>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div>جاري تحميل بيانات العرض...</div>
          </div>
        </div>
      </div>
    );
  }

  const offerGroups = offer.offerGroups || [];
  
  // إذا لم تكن هناك مجموعات، أضف العناصر الثابتة مباشرة
  if (offerGroups.length === 0) {
    setTimeout(() => onComplete(selectedItems), 100);
    return null;
  }

  const currentGroup = offerGroups[currentGroupIndex];
const currentGroupItems = currentGroup.items || [];
  const selections = groupSelections[currentGroup.id] || {};
  const totalSelected = Object.values(selections).reduce((sum, count) => sum + count, 0);

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <div className={styles.popupTitleSection}>
            <h3 className={styles.popupTitle}>🏷️ {offer.name}</h3>
            <div className={styles.popupSubtitle}>
              {t("pos.newSales.products.quantity")}: {quantity} | 
              {offer.priceType === 'Fixed' ? ` السعر: ${offer.fixedPrice} ج.م` : ' سعر متغير'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentGroupIndex > 0 && (
              <button 
                className={styles.popupClose} 
                onClick={handlePrevious}
                title="الرجوع للمجموعة السابقة"
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
              مجموعة {currentGroupIndex + 1} من {offerGroups.length}
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${((currentGroupIndex + 1) / offerGroups.length) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.optionsContainer}>
            <div className={styles.optionGroup}>
              <div className={styles.groupHeader}>
                <div className={styles.groupTitle}>
                  <span className={styles.groupName}>{currentGroup.title}</span>
                  {currentGroup.isMandatory && (
                    <span className={styles.requiredBadge}>مطلوب</span>
                  )}
                </div>
                <div className={styles.groupInfo}>
                  <span className={styles.selectionCount}>
                    مختار: {totalSelected} / {currentGroup.maxSelection}
                  </span>
                  {currentGroup.minSelection > 0 && (
                    <span className={styles.minSelection}>
                      الحد الأدنى: {currentGroup.minSelection}
                    </span>
                  )}
                </div>
              </div>
              
              <div className={styles.optionsGrid}>
                {currentGroupItems.map((offerItem) => {
                  const productData = productsData[offerItem.productPriceId];
                  if (!productData) return null;
                  
                  const itemCount = selections[offerItem.id] || 0;
                  const canAdd = totalSelected < currentGroup.maxSelection;
                  
                  const displayPrice = offerItem.useOriginalPrice 
                    ? productData.price.price 
                    : (offerItem.customPrice || 0);
                  
                  return (
                    <div 
                      key={offerItem.id} 
                      className={`${styles.optionCard} ${itemCount > 0 ? styles.selected : ''}`}
                      onClick={() => handleCardClick(currentGroup, offerItem)}
                    >
                      <div className={styles.optionContent}>
                        <div className={styles.optionInfo}>
                          <div className={styles.optionName}>
                            {productData.product.nameArabic}
                          </div>
                          {displayPrice > 0 && (
                            <div className={styles.optionPrice}>
                              {displayPrice} ج.م
                            </div>
                          )}
                          {offerItem.quantity > 1 && (
                            <div className={styles.optionQuantity}>
                              الكمية: {offerItem.quantity}
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.optionControls}>
                          <div className={styles.quantitySection}>
                            {itemCount > 0 && (
                              <button
                                className={styles.removeBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemSelection(currentGroup, offerItem, -1);
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
                                <span>تم الوصول للحد الأقصى</span>
                              </div>
                            )}
                            
                            {itemCount > 0 && canAdd && (
                              <button
                                className={styles.addBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemSelection(currentGroup, offerItem, 1);
                                }}
                              >
                                <AddIcon />
                              </button>
                            )}
                          </div>
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
              <span className={styles.totalLabel}>المجموع:</span>
              <span className={styles.totalValue}>
                {calculateTotalPrice().toFixed(2)} ج.م
              </span>
            </div>
          </div>
        </div>
        
        <div className={styles.popupFooter}>
          <button className={styles.btnCancel} onClick={onClose}>
            إلغاء
          </button>
          
          {currentGroupIndex < offerGroups.length - 1 ? (
            <button
              className={styles.btnConfirm}
              onClick={handleNext}
              disabled={currentGroup.isMandatory && !isCurrentGroupValid()}
            >
              التالي
              <ArrowForwardIcon />
            </button>
          ) : (
            <button
              className={styles.btnConfirm}
              onClick={handleComplete}
              disabled={!isAllGroupsValid()}
            >
              تأكيد الاختيار
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferOptionsPopup;
