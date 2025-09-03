// src/Pages/pos/newSales/components/SplitReceiptPopup.tsx
import React, { useState, useEffect } from 'react';
import { OrderItem, OrderSummary as OrderSummaryType } from '../types/PosSystem';
import { TableSelection } from '../types/TableSystem';
import { Customer, CustomerAddress } from '../../../../utils/api/pagesApi/customersApi';
import { DeliveryCompany } from '../../../../utils/api/pagesApi/deliveryCompaniesApi';
import { useInvoiceManager } from '../hooks/useInvoiceManager';
// إزالة QuantitySplitPopup import
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/SplitReceiptPopup.module.css';

interface SplitReceiptPopupProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  orderType: string;
  currentInvoiceId: string | null;
  currentInvoiceStatus: number;
  selectedTable: TableSelection | null;
  selectedCustomer: Customer | null;
  selectedAddress: CustomerAddress | null;
  selectedDeliveryCompany: DeliveryCompany | null;
  onSplitComplete?: (remainingItems: OrderItem[]) => void;
}

// نافذة بسيطة لاختيار الكمية عند السحب
interface QuantityPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  maxQuantity: number;
  itemName: string;
}

const QuantityPrompt: React.FC<QuantityPromptProps> = ({
  isOpen,
  onClose,
  onConfirm,
  maxQuantity,
  itemName
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.quantityPromptOverlay}>
      <div className={styles.quantityPromptContainer}>
        <div className={styles.quantityPromptHeader}>
          <h4>نقل كمية من: {itemName}</h4>
          <button className={styles.quantityPromptClose} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div className={styles.quantityPromptContent}>
          <p>اختر الكمية المراد نقلها (الحد الأقصى: {maxQuantity})</p>
          
          <div className={styles.quantityControls}>
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.min(maxQuantity, Math.max(1, val)));
              }}
              min={1}
              max={maxQuantity}
            />
            
            <button 
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
        </div>
        
        <div className={styles.quantityPromptActions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            إلغاء
          </button>
          <button 
            className={styles.confirmBtn} 
            onClick={() => onConfirm(quantity)}
          >
            نقل
          </button>
        </div>
      </div>
    </div>
  );
};

const SplitReceiptPopup: React.FC<SplitReceiptPopupProps> = ({
  isOpen,
  onClose,
  orderItems,
  orderType,
  currentInvoiceId,
  currentInvoiceStatus,
  selectedTable,
  selectedCustomer,
  selectedAddress,
  selectedDeliveryCompany,
  onSplitComplete
}) => {
  const { saveInvoice } = useInvoiceManager();
  
  const [sourceItems, setSourceItems] = useState<OrderItem[]>([]);
  const [receipts, setReceipts] = useState<OrderItem[][]>([]);
  const [draggedItem, setDraggedItem] = useState<OrderItem | null>(null);
  const [targetReceiptIndex, setTargetReceiptIndex] = useState<number | null>(null);
  
  // نافذة اختيار الكمية
  const [quantityPromptOpen, setQuantityPromptOpen] = useState(false);
  const [pendingDrop, setPendingDrop] = useState<{
    item: OrderItem;
    targetIndex: number | null; // null للمصدر
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSourceItems([...orderItems]);
      setReceipts([]);
    }
  }, [isOpen, orderItems]);

  const addReceipt = () => {
    setReceipts((prev) => [...prev, []]);
  };

  const handleDragStart = (item: OrderItem) => {
    return () => {
      setDraggedItem(item);
    };
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // تعامل مع إسقاط العنصر في ريسيت معين
  const handleDropToReceipt = (receiptIndex: number) => {
    return (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedItem) return;
      
      // إذا الكمية أكبر من 1، اعرض نافذة اختيار الكمية
      if (draggedItem.quantity > 1) {
        setPendingDrop({
          item: draggedItem,
          targetIndex: receiptIndex
        });
        setQuantityPromptOpen(true);
      } else {
        // نقل العنصر مباشرة
        moveItemToReceipt(draggedItem, receiptIndex, 1);
      }
      
      setDraggedItem(null);
    };
  };

  // تعامل مع إسقاط العنصر مرة أخرى في المصدر
  const handleDropToSource = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    // إذا العنصر في ريسيت ومش في المصدر، وكميته > 1
    const isInSource = sourceItems.some(item => item.id === draggedItem.id);
    
    if (!isInSource && draggedItem.quantity > 1) {
      setPendingDrop({
        item: draggedItem,
        targetIndex: null // null يعني المصدر
      });
      setQuantityPromptOpen(true);
    } else {
      // نقل العنصر مباشرة للمصدر
      moveItemToSource(draggedItem, draggedItem.quantity);
    }
    
    setDraggedItem(null);
  };

  // نقل كمية معينة لريسيت
  const moveItemToReceipt = (item: OrderItem, receiptIndex: number, quantityToMove: number) => {
    const remainingQuantity = item.quantity - quantityToMove;
    const unitPrice = item.totalPrice / item.quantity;
    
    // إنشاء العنصر الجديد للريسيت
    const newItemForReceipt: OrderItem = {
      ...item,
      id: uuidv4(),
      quantity: quantityToMove,
      totalPrice: unitPrice * quantityToMove
    };
    
    // إضافة للريسيت المستهدف
    setReceipts(prev => 
      prev.map((list, idx) => {
        const filtered = list.filter(it => it.id !== item.id);
        if (idx === receiptIndex) {
          return [...filtered, newItemForReceipt];
        }
        return filtered;
      })
    );
    
    // تحديث أو حذف من المصدر
    if (remainingQuantity > 0) {
      const updatedSourceItem: OrderItem = {
        ...item,
        quantity: remainingQuantity,
        totalPrice: unitPrice * remainingQuantity
      };
      setSourceItems(prev => 
        prev.map(it => it.id === item.id ? updatedSourceItem : it)
      );
    } else {
      // حذف من المصدر
      setSourceItems(prev => prev.filter(it => it.id !== item.id));
    }
  };

  // نقل كمية معينة للمصدر
  const moveItemToSource = (item: OrderItem, quantityToMove: number) => {
    const unitPrice = item.totalPrice / item.quantity;
    
    // البحث عن العنصر في الريسيتات وتحديثه أو حذفه
    const updatedReceipts = receipts.map(list => {
      const existingItem = list.find(it => it.id === item.id);
      if (!existingItem) return list;
      
      const remainingQuantity = existingItem.quantity - quantityToMove;
      
      if (remainingQuantity > 0) {
        return list.map(it => 
          it.id === item.id 
            ? { ...it, quantity: remainingQuantity, totalPrice: unitPrice * remainingQuantity }
            : it
        );
      } else {
        return list.filter(it => it.id !== item.id);
      }
    });
    
    setReceipts(updatedReceipts);
    
    // إضافة أو تحديث في المصدر
    const existingSourceItem = sourceItems.find(it => it.product.id === item.product.id);
    if (existingSourceItem) {
      const newQuantity = existingSourceItem.quantity + quantityToMove;
      setSourceItems(prev =>
        prev.map(it =>
          it.id === existingSourceItem.id
            ? { ...it, quantity: newQuantity, totalPrice: unitPrice * newQuantity }
            : it
        )
      );
    } else {
      const newSourceItem: OrderItem = {
        ...item,
        id: uuidv4(),
        quantity: quantityToMove,
        totalPrice: unitPrice * quantityToMove
      };
      setSourceItems(prev => [...prev, newSourceItem]);
    }
  };

  // تأكيد نقل الكمية
  const handleQuantityConfirm = (quantity: number) => {
    if (!pendingDrop) return;
    
    const { item, targetIndex } = pendingDrop;
    
    if (targetIndex === null) {
      // نقل للمصدر
      moveItemToSource(item, quantity);
    } else {
      // نقل لريسيت
      moveItemToReceipt(item, targetIndex, quantity);
    }
    
    setQuantityPromptOpen(false);
    setPendingDrop(null);
  };

  const removeReceipt = (index: number) => {
    const receiptItems = receipts[index];
    
    // إرجاع كل العناصر للمصدر
    receiptItems.forEach(item => {
      const existingSourceItem = sourceItems.find(si => si.product.id === item.product.id);
      if (existingSourceItem) {
        const unitPrice = item.totalPrice / item.quantity;
        const newQuantity = existingSourceItem.quantity + item.quantity;
        setSourceItems(prev =>
          prev.map(si =>
            si.id === existingSourceItem.id
              ? { ...si, quantity: newQuantity, totalPrice: unitPrice * newQuantity }
              : si
          )
        );
      } else {
        setSourceItems(prev => [...prev, item]);
      }
    });
    
    setReceipts(prev => prev.filter((_, idx) => idx !== index));
  };

  const buildOrderSummary = (items: OrderItem[]): OrderSummaryType => {
    const subtotal = items.reduce((sum, it) => sum + it.totalPrice, 0);
    const discount = 0;
    const tax = 0;
    const servicePercentage = selectedTable?.section?.serviceCharge || 0;
    const service = (subtotal * servicePercentage) / 100;
    const totalAfterDiscount = subtotal - discount;
    const totalAfterTaxAndService = totalAfterDiscount + tax + service;
    
    return {
      items,
      subtotal,
      discount,
      tax,
      service,
      total: totalAfterTaxAndService,
      totalAfterDiscount,
      totalAfterTaxAndService
    };
  };

  const handleConfirmSplit = async () => {
    try {
      // التحقق من عدم ترك الفاتورة الأصلية فارغة
      if (sourceItems.length === 0) {
        alert('لا يمكن ترك الفاتورة الأصلية فارغة. يجب الاحتفاظ بعنصر واحد على الأقل.');
        return;
      }
      
      // فلترة الريسيتات غير الفارغة
      const nonEmptyReceipts = receipts.filter(receipt => receipt.length > 0);
      
      if (nonEmptyReceipts.length === 0) {
        alert('يجب إضافة عناصر للريسيتات الجديدة قبل التأكيد.');
        return;
      }

      // تحديث الفاتورة الحالية
      if (currentInvoiceId) {
        const updatedSummary = buildOrderSummary(sourceItems);
        await saveInvoice(
          updatedSummary,
          orderType,
          [],
          currentInvoiceStatus,
          {
            isEditMode: true,
            invoiceId: currentInvoiceId,
            selectedCustomer,
            selectedAddress,
            selectedDeliveryCompany,
            selectedTable,
            servicePercentage: selectedTable?.section?.serviceCharge || 0,
            taxPercentage: 0,
            discountPercentage: 0,
            notes: undefined,
            preserveMissingItems: false
          }
        );
      }

      // إنشاء فواتير جديدة للريسيتات غير الفارغة فقط
      for (const receiptItems of nonEmptyReceipts) {
        const summary = buildOrderSummary(receiptItems);
        await saveInvoice(
          summary,
          orderType,
          [],
          1,
          {
            isEditMode: false,
            invoiceId: null,
            selectedCustomer,
            selectedAddress,
            selectedDeliveryCompany,
            selectedTable,
            servicePercentage: selectedTable?.section?.serviceCharge || 0,
            taxPercentage: 0,
            discountPercentage: 0,
            notes: undefined
          }
        );
      }

      if (onSplitComplete) {
        onSplitComplete(sourceItems);
      }
      
      onClose();
    } catch (error) {
      console.error('Error splitting receipt:', error);
      alert('حدث خطأ أثناء فصل الشيك. يرجى المحاولة مرة أخرى.');
    }
  };

  if (!isOpen) return null;

  // التحقق من إمكانية التأكيد
  const canConfirm = sourceItems.length > 0 && receipts.some(receipt => receipt.length > 0);

  return (
    <>
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.posSystem}>
            <button className={styles.closeBtn} onClick={onClose}>
              <CloseIcon />
              <span>إغلاق</span>
            </button>

            <main className={styles.mainContent}>
              {/* قسم العناصر المتبقية */}
              <section className={styles.sourceSection}>
                <div className={styles.sectionHeader}>
                  <h3>العناصر المتبقية ({sourceItems.length})</h3>
                  <small>الفاتورة الأصلية</small>
                </div>
                
                <div 
                  className={styles.sourceDropZone}
                  onDragOver={allowDrop}
                  onDrop={handleDropToSource}
                >
                  {sourceItems.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>⚠️ لا يمكن ترك الفاتورة الأصلية فارغة</p>
                    </div>
                  ) : (
                    <div className={styles.itemsList}>
                      {sourceItems.map((item) => (
                        <div
                          key={item.id}
                          className={styles.draggableItem}
                          draggable
                          onDragStart={handleDragStart(item)}
                        >
                          <div className={styles.itemContent}>
                            <DragIndicatorIcon className={styles.dragIcon} />
                            <div className={styles.itemInfo}>
                              <span className={styles.itemName}>{item.product.nameArabic}</span>
                              <small className={styles.itemQuantity}>× {item.quantity}</small>
                            </div>
                            <span className={styles.itemPrice}>{item.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* قسم الريسيتات */}
              <section className={styles.receiptsSection}>
                <div className={styles.sectionHeader}>
                  <h3>الريسيتات الجديدة ({receipts.filter(r => r.length > 0).length})</h3>
                  <button className={styles.addReceiptBtn} onClick={addReceipt}>
                    <AddIcon />
                    <span>إضافة ريسيت</span>
                  </button>
                </div>

                <div className={styles.receiptsGrid}>
                  {receipts.map((list, index) => (
                    <div key={index} className={styles.receiptCard}>
                      <div className={styles.receiptHeader}>
                        <span>ريسيت {index + 1}</span>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => removeReceipt(index)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                      
                      <div 
                        className={`${styles.receiptDropZone} ${list.length === 0 ? styles.emptyReceipt : ''}`}
                        onDragOver={allowDrop}
                        onDrop={handleDropToReceipt(index)}
                      >
                        {list.length === 0 ? (
                          <div >
                            <p>اسحب العناصر هنا</p>
                          </div>
                        ) : (
                          <>
                            <div className={styles.itemsList}>
                              {list.map((item) => (
                                <div
                                  key={item.id}
                                  className={styles.draggableItem}
                                  draggable
                                  onDragStart={handleDragStart(item)}
                                >
                                  <div className={styles.itemContent}>
                                    <DragIndicatorIcon className={styles.dragIcon} />
                                    <div className={styles.itemInfo}>
                                      <span className={styles.itemName}>{item.product.nameArabic}</span>
                                      <small className={styles.itemQuantity}>× {item.quantity}</small>
                                    </div>
                                    <span className={styles.itemPrice}>{item.totalPrice.toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className={styles.receiptTotal}>
                              <span>الإجمالي: {list.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            <div className={styles.actionsBar}>
              <button className={styles.cancelBtn} onClick={onClose}>
                إلغاء
              </button>
              <button 
                className={styles.confirmBtn}
                onClick={handleConfirmSplit}
                disabled={!canConfirm}
              >
                <ReceiptIcon />
                <span>تأكيد الفصل</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* نافذة اختيار الكمية */}
      <QuantityPrompt
        isOpen={quantityPromptOpen}
        onClose={() => {
          setQuantityPromptOpen(false);
          setPendingDrop(null);
        }}
        onConfirm={handleQuantityConfirm}
        maxQuantity={pendingDrop?.item.quantity || 1}
        itemName={pendingDrop?.item.product.nameArabic || ''}
      />
    </>
  );
};

export default SplitReceiptPopup;
