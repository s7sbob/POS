// src/Pages/pos/newSales/components/InvoiceSelectionPopup.tsx
import React from 'react';
import { Invoice } from '../../../../utils/api/pagesApi/invoicesApi';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from '../styles/InvoiceSelectionPopup.module.css';

interface InvoiceSelectionPopupProps {
  isOpen: boolean;
  invoices: Invoice[];
  onSelect: (invoice: Invoice) => void;
  onClose: () => void;
}

const getStatusInfo = (status: number) => {
  switch (status) {
    case 1:
      return { label: 'قيد التحضير', class: 'preparing' };
    case 2:
      return { label: 'قيد التسليم', class: 'delivering' };
    case 3:
      return { label: 'مكتمل', class: 'completed' };
    default:
      return { label: 'غير معروف', class: 'unknown' };
  }
};

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
        <div className={styles.posSystem}>
          {/* زر الإغلاق */}
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
            <span>إغلاق</span>
          </button>

          <main className={styles.mainContent}>
            <div className={styles.header}>
              <ReceiptIcon className={styles.headerIcon} />
              <h2>اختيار الريسيت</h2>
              <p>يوجد عدة ريسيتات على هذه الطاولة، اختر الريسيت المطلوب</p>
            </div>

            <div className={styles.invoicesGrid}>
              {invoices.map((invoice) => {
                const statusInfo = getStatusInfo(invoice.invoiceStatus);
                
                return (
                  <div
                    key={invoice.id}
                    className={styles.invoiceCard}
                    onClick={() => onSelect(invoice)}
                  >
                    <div className={styles.invoiceHeader}>
                      <span className={styles.invoiceCode}>
                        #{invoice.backInvoiceCode || invoice.androidInvoiceCode || invoice.id?.slice(-6)}
                      </span>
                      <span className={`${styles.statusBadge} ${styles[statusInfo.class]}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    <div className={styles.invoiceContent}>
                      <div className={styles.invoiceDetail}>
                        <span className={styles.detailLabel}>عدد العناصر</span>
                        <span className={styles.detailValue}>{invoice.items?.length || 0}</span>
                      </div>
                      
                      {invoice.totalAfterTaxAndService && (
                        <div className={styles.invoiceDetail}>
                          <span className={styles.detailLabel}>المبلغ الإجمالي</span>
                          <span className={styles.detailValue}>
                            {invoice.totalAfterTaxAndService.toFixed(2)} جنيه
                          </span>
                        </div>
                      )}
                      
                      {invoice.createdAt && (
                        <div className={styles.invoiceDetail}>
                          <AccessTimeIcon className={styles.timeIcon} />
                          <span className={styles.detailValue}>
                            {new Date(invoice.createdAt).toLocaleString('ar-EG')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSelectionPopup;
