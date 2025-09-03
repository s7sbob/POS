// src/Pages/pos/newSales/components/InvoiceSelectionPopup.tsx
import React from 'react';
// لاحظ أن هذا الملف موجود داخل src/Pages/pos/newSales/components
// لذلك يلزم أربعة مستويات صعود للوصول إلى src/utils
import { Invoice } from '../../../../utils/api/pagesApi/invoicesApi';
import styles from '../styles/InvoiceSelectionPopup.module.css';

interface InvoiceSelectionPopupProps {
  isOpen: boolean;
  invoices: Invoice[];
  onSelect: (invoice: Invoice) => void;
  onClose: () => void;
}

/**
 * عرض بسيط لإختيار واحدة من عدة فواتير على نفس الطاولة.
 * إذا كانت الطاولة تحتوي على أكثر من فاتورة، يتم فتح هذا البوب أب للسماح للمستخدم باختيار أي فاتورة يريد فتحها.
 */
const InvoiceSelectionPopup: React.FC<InvoiceSelectionPopupProps> = ({
  isOpen,
  invoices,
  onSelect,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>اختيار ريسيت</h3>
        <div className={styles.invoicesContainer}>
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className={styles.invoiceCard}
              onClick={() => onSelect(inv)}
            >
              <div className={styles.invoiceCode}>كود: {inv.backInvoiceCode || inv.androidInvoiceCode || inv.id}</div>
              <div className={styles.invoiceStatus}>الحالة: {inv.invoiceStatus === 1 ? 'قيد التحضير' : inv.invoiceStatus === 2 ? 'قيد التسليم' : inv.invoiceStatus === 3 ? 'مكتمل' : 'غير معروف'}</div>
              <div className={styles.invoiceItemsCount}>عدد العناصر: {inv.items?.length || 0}</div>
            </div>
          ))}
        </div>
        <button className={styles.closeButton} onClick={onClose}>إلغاء</button>
      </div>
    </div>
  );
};

export default InvoiceSelectionPopup;