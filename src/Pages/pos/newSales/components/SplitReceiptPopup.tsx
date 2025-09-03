// src/Pages/pos/newSales/components/SplitReceiptPopup.tsx
import React, { useState, useEffect } from 'react';
import { OrderItem, OrderSummary as OrderSummaryType } from '../types/PosSystem';
import { TableSelection } from '../types/TableSystem';
// يجب استخدام مسار نسبي من المجلد الحالى للوصول إلى src/utils
import { Customer, CustomerAddress } from '../../../../utils/api/pagesApi/customersApi';
import { DeliveryCompany } from '../../../../utils/api/pagesApi/deliveryCompaniesApi';
import { useInvoiceManager } from '../hooks/useInvoiceManager';
import styles from '../styles/SplitReceiptPopup.module.css';

interface SplitReceiptPopupProps {
  isOpen: boolean;
  onClose: () => void;
  /** العناصر الموجودة في الفاتورة الحالية */
  orderItems: OrderItem[];
  /** نوع الطلب (Takeaway, Dine-in, ...etc) */
  orderType: string;
  /** الفاتورة الحالية فى وضع التعديل */
  currentInvoiceId: string | null;
  /** حالة الفاتورة الحالية */
  currentInvoiceStatus: number;
  /** تحديد الطاولة الحالية كى يتم نسخها للفواتير الجديدة */
  selectedTable: TableSelection | null;
  /** بيانات العميل الحالية */
  selectedCustomer: Customer | null;
  selectedAddress: CustomerAddress | null;
  selectedDeliveryCompany: DeliveryCompany | null;
  /** دالة تُستدعى بعد إتمام عملية الفصل بنجاح */
  onSplitComplete?: (remainingItems: OrderItem[]) => void;
}

/**
 * نافذة لفصل عناصر شيك إلى عدة شيكات جديدة. تتيح للمستخدم إنشاء عدة ريسيتس
 * ونقل العناصر بينها باستخدام السحب والإفلات، ثم تحديث الفاتورة الأصلية وإنشاء فواتير جديدة.
 */
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

  // العناصر المتبقية فى الفاتورة الأصلية
  const [sourceItems, setSourceItems] = useState<OrderItem[]>([]);
  // مصفوفة من القوائم، كل قائمة تمثل ريسيت جديد
  const [receipts, setReceipts] = useState<OrderItem[][]>([]);
  // العنصر الذى يتم سحبه حالياً
  const [draggedItem, setDraggedItem] = useState<OrderItem | null>(null);

  // عند فتح النافذة، انسخ العناصر الحالية
  useEffect(() => {
    if (isOpen) {
      setSourceItems([...orderItems]);
      setReceipts([]);
    }
  }, [isOpen, orderItems]);

  // إنشاء ريسيت جديد
  const addReceipt = () => {
    setReceipts((prev) => [...prev, []]);
  };

  // بدء السحب
  const handleDragStart = (item: OrderItem) => {
    return () => {
      setDraggedItem(item);
    };
  };

  // السماح بمنطقة الإسقاط
  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // إسقاط العنصر فى ريسيت معين
  const handleDropToReceipt = (receiptIndex: number) => {
    return (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedItem) return;
      const item = draggedItem;
      setDraggedItem(null);
      // حذف العنصر من المصدر وجميع الريسيتس قبل إضافته
      setSourceItems((prev) => prev.filter((it) => it.id !== item.id));
      setReceipts((prev) =>
        prev.map((list, idx) => {
          const filtered = list.filter((it) => it.id !== item.id);
          if (idx === receiptIndex) {
            return [...filtered, item];
          }
          return filtered;
        })
      );
    };
  };

  // إسقاط العنصر مرة أخرى فى المصدر
  const handleDropToSource = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;
    const item = draggedItem;
    setDraggedItem(null);
    // حذف من كل الريسيتس
    setReceipts((prev) => prev.map((list) => list.filter((it) => it.id !== item.id)));
    // إضافة للمصدر إذا لم يكن موجوداً
    setSourceItems((prev) => {
      if (prev.some((it) => it.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  // إنشاء ملخص بسيط للطلب بناءً على العناصر
  const buildOrderSummary = (items: OrderItem[]): OrderSummaryType => {
    const subtotal = items.reduce((sum, it) => sum + it.totalPrice, 0);
    // لا يوجد خصم أو ضريبة حالياً
    const discount = 0;
    const tax = 0;
    // قيمة الخدمة تعتمد على القسم
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

  // تنفيذ عملية الفصل
  const handleConfirmSplit = async () => {
    try {
      // تحديث الفاتورة الحالية إذا كنا فى وضع التعديل
      if (currentInvoiceId) {
        const updatedSummary = buildOrderSummary(sourceItems);
        // عند فصل الشيك يجب إرسال العناصر المتبقية فقط فى الفاتورة الأصلية.
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

      // إنشاء فواتير جديدة لكل ريسيت ممتلئ
      for (const receiptItems of receipts) {
        if (receiptItems.length === 0) continue;
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
      // إذا حدد المستخدم دالة بعد الفصل، قم بإرسال العناصر المتبقية
      if (onSplitComplete) {
        onSplitComplete(sourceItems);
      }
      onClose();
    } catch (error) {
      console.error('Error splitting receipt:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>فصل الشيك</h3>
        <div className={styles.splitContainer}>
          {/* قائمة العناصر المصدر */}
          <div
            className={styles.listContainer}
            onDragOver={allowDrop}
            onDrop={handleDropToSource}
          >
            <h4 className={styles.listTitle}>العناصر المتبقية</h4>
            {sourceItems.length === 0 && (
              <div className={styles.emptyMessage}>لا توجد عناصر متبقية</div>
            )}
            {sourceItems.map((item) => (
              <div
                key={item.id}
                className={styles.itemRow}
                draggable
                onDragStart={handleDragStart(item)}
              >
                <span className={styles.itemName}>{item.product.nameArabic}</span>
                <span className={styles.itemQty}>× {item.quantity}</span>
                <span className={styles.itemPrice}>{item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>
          {/* الريسيتس */}
          <div className={styles.receiptsContainer}>
            {receipts.map((list, index) => (
              <div
                key={index}
                className={styles.listContainer}
                onDragOver={allowDrop}
                onDrop={handleDropToReceipt(index)}
              >
                <h4 className={styles.listTitle}>ريسيت {index + 1}</h4>
                {list.length === 0 && (
                  <div className={styles.emptyMessage}>اسحب العناصر هنا</div>
                )}
                {list.map((item) => (
                  <div
                    key={item.id}
                    className={styles.itemRow}
                    draggable
                    onDragStart={handleDragStart(item)}
                  >
                    <span className={styles.itemName}>{item.product.nameArabic}</span>
                    <span className={styles.itemQty}>× {item.quantity}</span>
                    <span className={styles.itemPrice}>{item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))}
            <button className={styles.addReceiptBtn} onClick={addReceipt}>إضافة ريسيت</button>
          </div>
        </div>
        <div className={styles.actionsContainer}>
          <button className={styles.cancelBtn} onClick={onClose}>إلغاء</button>
          <button className={styles.confirmBtn} onClick={handleConfirmSplit}>تأكيد</button>
        </div>
      </div>
    </div>
  );
};

export default SplitReceiptPopup;