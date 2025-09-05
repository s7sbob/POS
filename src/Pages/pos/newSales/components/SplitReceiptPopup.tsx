// src/Pages/pos/newSales/components/SplitReceiptPopup.tsx
import React, { useState, useEffect } from 'react';
import { OrderItem, OrderSummary as OrderSummaryType } from '../types/PosSystem';
import { TableSelection } from '../types/TableSystem';
import { Customer, CustomerAddress } from '../../../../utils/api/pagesApi/customersApi';
import { DeliveryCompany } from '../../../../utils/api/pagesApi/deliveryCompaniesApi';
import { useInvoiceManager } from '../hooks/useInvoiceManager';
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

  // التحقق من إمكانية إضافة ريسيت جديد
  const canAddNewReceipt = () => {
    // إذا مافيش ريسيتات أو آخر ريسيت مش فاضي
    return receipts.length === 0 || receipts[receipts.length - 1].length > 0;
  };

  // التحقق من إمكانية التأكيد
  const canConfirm = () => {
    // يجب أن تكون الفاتورة الأصلية غير فارغة
    const hasSourceItems = sourceItems.length > 0;
    
    // يجب أن يكون هناك ريسيت واحد على الأقل غير فارغ
    const hasNonEmptyReceipts = receipts.some(receipt => receipt.length > 0);
    
    // يجب ألا يكون هناك ريسيتات فارغة (كل الريسيتات إما ممتلئة أو محذوفة)
    const hasNoEmptyReceipts = receipts.every(receipt => receipt.length > 0);
    
    return hasSourceItems && hasNonEmptyReceipts && hasNoEmptyReceipts;
  };

  const addReceipt = () => {
    if (!canAddNewReceipt()) {
      alert('يجب تعبئة الريسيت السابق قبل إضافة ريسيت جديد');
      return;
    }
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

  const handleDropToReceipt = (receiptIndex: number) => {
    return (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedItem) return;
      
      if (draggedItem.quantity > 1) {
        setPendingDrop({
          item: draggedItem,
          targetIndex: receiptIndex
        });
        setQuantityPromptOpen(true);
      } else {
        moveItemToReceipt(draggedItem, receiptIndex, 1);
      }
      
      setDraggedItem(null);
    };
  };

  const handleDropToSource = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const isInSource = sourceItems.some(item => item.id === draggedItem.id);
    
    if (!isInSource && draggedItem.quantity > 1) {
      setPendingDrop({
        item: draggedItem,
        targetIndex: null
      });
      setQuantityPromptOpen(true);
    } else {
      moveItemToSource(draggedItem, draggedItem.quantity);
    }
    
    setDraggedItem(null);
  };

  const moveItemToReceipt = (item: OrderItem, receiptIndex: number, quantityToMove: number) => {
    const remainingQuantity = item.quantity - quantityToMove;
    const unitPrice = item.totalPrice / item.quantity;
    
    const newItemForReceipt: OrderItem = {
      ...item,
      id: uuidv4(),
      quantity: quantityToMove,
      totalPrice: unitPrice * quantityToMove
    };
    
    setReceipts(prev => 
      prev.map((list, idx) => {
        const filtered = list.filter(it => it.id !== item.id);
        if (idx === receiptIndex) {
          return [...filtered, newItemForReceipt];
        }
        return filtered;
      })
    );
    
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
      setSourceItems(prev => prev.filter(it => it.id !== item.id));
    }
  };

  const moveItemToSource = (item: OrderItem, quantityToMove: number) => {
    const unitPrice = item.totalPrice / item.quantity;
    
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

  const handleQuantityConfirm = (quantity: number) => {
    if (!pendingDrop) return;
    
    const { item, targetIndex } = pendingDrop;
    
    if (targetIndex === null) {
      moveItemToSource(item, quantity);
    } else {
      moveItemToReceipt(item, targetIndex, quantity);
    }
    
    setQuantityPromptOpen(false);
    setPendingDrop(null);
  };

  const removeReceipt = (index: number) => {
    const receiptItems = receipts[index];
    
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
      // التحقق الأول: عدم ترك الفاتورة الأصلية فارغة
      if (sourceItems.length === 0) {
        alert('⚠️ لا يمكن ترك الفاتورة الأصلية فارغة. يجب الاحتفاظ بعنصر واحد على الأقل.');
        return;
      }
      
      // التحقق الثاني: وجود ريسيتات فارغة
      const emptyReceipts = receipts.filter(receipt => receipt.length === 0);
      if (emptyReceipts.length > 0) {
        alert('⚠️ يوجد ريسيتات فارغة. يجب تعبئة كل الريسيتات أو حذف الفارغة منها قبل التأكيد.');
        return;
      }
      
      // التحقق الثالث: وجود ريسيت واحد على الأقل غير فارغ
      const nonEmptyReceipts = receipts.filter(receipt => receipt.length > 0);
      if (nonEmptyReceipts.length === 0) {
        alert('⚠️ يجب إضافة عناصر للريسيتات الجديدة قبل التأكيد.');
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

  // حساب الإحصائيات للعرض
  const nonEmptyReceiptsCount = receipts.filter(r => r.length > 0).length;
  const emptyReceiptsCount = receipts.filter(r => r.length === 0).length;

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
                  {/* <div>
                    <h3>الريسيتات الجديدة</h3>
                    <small>
                      ممتلئة: {nonEmptyReceiptsCount} | فارغة: {emptyReceiptsCount}
                    </small>
                  </div> */}
                  <button 
                    className={`${styles.addReceiptBtn} ${!canAddNewReceipt() ? styles.disabled : ''}`}
                    onClick={addReceipt}
                    disabled={!canAddNewReceipt()}
                    title={!canAddNewReceipt() ? 'يجب تعبئة الريسيت السابق أولاً' : 'إضافة ريسيت جديد'}
                  >
                    <AddIcon />
                    <span>إضافة ريسيت</span>
                  </button>
                </div>

                <div className={styles.receiptsGrid}>
                  {receipts.map((list, index) => (
                    <div key={index} className={`${styles.receiptCard} ${list.length === 0 ? styles.emptyReceiptCard : ''}`}>
                      <div className={styles.receiptHeader}>
                        <span>ريسيت {index + 1} {list.length === 0 && '(فارغ)'}</span>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => removeReceipt(index)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                      
                      <div 
                        className={`${styles.receiptDropZone} ${list.length === 0 ? styles.emptyReceiptDropZone : ''}`}
                        onDragOver={allowDrop}
                        onDrop={handleDropToReceipt(index)}
                      >
                        {list.length === 0 ? (
                          <div className={styles.emptyReceiptMessage}>
                            <p>⚠️ اسحب العناصر هنا</p>
                            <small>لا يمكن ترك الريسيت فارغاً</small>
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
                className={`${styles.confirmBtn} ${!canConfirm() ? styles.disabled : ''}`}
                onClick={handleConfirmSplit}
                disabled={!canConfirm()}
                title={
                  !canConfirm() 
                    ? 'تأكد من أن الفاتورة الأصلية غير فارغة وجميع الريسيتات ممتلئة' 
                    : 'تأكيد الفصل'
                }
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
