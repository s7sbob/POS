// src/Pages/pos/newSales/components/TableSelectionPopup.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TableSection, Table, TableSelection } from '../types/TableSystem';
import { UnclosedTableInvoice } from '../../../../utils/api/pagesApi/unclosedTablesApi';
import * as unclosedTablesApi from '../../../../utils/api/pagesApi/unclosedTablesApi';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from '../styles/TableSelectionPopup.module.css';

interface TableSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTable: (selection: TableSelection) => void;
  tableSections: TableSection[];
  onViewOrder?: (invoiceData: any) => void; // إضافة جديدة لمعاينة الطلب
}

const TableSelectionPopup: React.FC<TableSelectionPopupProps> = ({
  isOpen,
  onClose,
  onSelectTable,
  tableSections,
  onViewOrder
}) => {
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] = useState<TableSection | null>(null);
  const [unclosedTables, setUnclosedTables] = useState<UnclosedTableInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDurations, setOpenDurations] = useState<{[key: string]: string}>({});

  // تحديث حالة الطاولات كل دقيقة
  useEffect(() => {
    if (!isOpen) return;

    const loadUnclosedTables = async () => {
      try {
        setLoading(true);
        const response = await unclosedTablesApi.getBranchUnclosedTables();
        setUnclosedTables(response.data);
      } catch (error) {
        console.error('Error loading unclosed tables:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUnclosedTables();
    
    // تحديث كل دقيقة
    const interval = setInterval(loadUnclosedTables, 60000);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  // تحديث عدادات الوقت كل ثانية
useEffect(() => {
  const updateDurations = () => {
    const newDurations: {[key: string]: string} = {};
    unclosedTables.forEach(invoice => {
      if (invoice.tableDTO?.id) {
        const timeToUse = invoice.createdAt !== '0001-01-01T00:00:00' && invoice.createdAt 
          ? invoice.createdAt 
          : invoice.preparedAt || invoice.completedAt;
        
        const startTime = new Date(timeToUse);
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        newDurations[invoice.tableDTO.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    });
    setOpenDurations(newDurations);
  };

  updateDurations();
  const interval = setInterval(updateDurations, 1000); // كل ثانية لتحديث مباشر
  
  return () => clearInterval(interval);
}, [unclosedTables]);


  useEffect(() => {
    if (isOpen && tableSections.length > 0) {
      setSelectedSection(tableSections[0]);
    }
  }, [isOpen, tableSections]);

  if (!isOpen) return null;

  const handleSectionClick = (section: TableSection) => {
    setSelectedSection(section);
  };

  const getTableInvoice = (tableId: string) => {
    return unclosedTables.find(invoice => invoice.tableDTO?.id === tableId);
  };

  const isTableOccupied = (tableId: string) => {
    return !!getTableInvoice(tableId);
  };

const handleTableClick = (table: Table) => {
  if (!selectedSection) return;

  const invoice = getTableInvoice(table.id || '');
  
  if (invoice) {
    // ✅ إذا كانت الطاولة مشغولة: اختارها أولاً ثم اعرض الطلب
    onSelectTable({
      section: selectedSection,
      table: table
    });
    
    // ثم اعرض محتويات الطلب
    if (onViewOrder) {
      onViewOrder(invoice);
    }
  } else {
    // إذا كانت الطاولة فارغة، اختيارها فقط وبدء فاتورة جديدة
    onSelectTable({
      section: selectedSection,
      table: table
    });
    
    // إشارة لبدء فاتورة جديدة
    if (onViewOrder) {
      onViewOrder({ isNewInvoice: true });
    }
  }
};
  const displayedTables = selectedSection?.tables || [];

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
        <div className={styles.posSystem}>
          {/* زر الإغلاق */}
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
            <span>{t("pos.newSales.actions.close")}</span>
          </button>

          <main className={styles.mainContent}>
            {/* قسم الطاولات */}
            <section className={styles.productsSection}>
              {loading && (
                <div className={styles.tableLoadingMessage}>
                  <div className={styles.loadingSpinner}></div>
                  <span>{t("pos.newSales.messages.updatingTableStatus")}</span>
                </div>
              )}
              
              <div className={styles.productGrid}>
                {displayedTables.map((table) => {
                  const occupied = isTableOccupied(table.id || '');
                  const invoice = getTableInvoice(table.id || '');
                  const duration = openDurations[table.id || ''] || '00:00';
                  
                  return (
                    <div
                      key={table.id}
                      className={`${styles.productItem} ${!occupied ? styles.available : invoice?.invoiceStatus === 1 ? styles.preparing : styles.delivering}`}
                      onClick={() => handleTableClick(table)}
                    >
                      <div className={styles.productImage}>
                        <img 
                          src="/images/default-table.png" 
                          alt={table.name}
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder.png';
                          }}
                        />
                        
                        {/* أيقونة الحالة */}
                        <div className={`${styles.statusIcon} ${!occupied ? styles.availableIcon : invoice?.invoiceStatus === 1 ? styles.preparingIcon : styles.deliveringIcon}`}>
                          {!occupied ? '🟢' : invoice?.invoiceStatus === 1 ? '🔴' : '🔵'}
                        </div>
                        
                        {/* أيقونة العرض للطاولات المشغولة */}
                        {occupied && (
                          <div className={styles.viewIcon}>
                            <VisibilityIcon />
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.productName}>
                        <span>{table.name}</span>
                        <small>{table.capacity} {t("pos.newSales.table.persons")}</small>
                        
                        <div className={`${styles.status} ${occupied ? styles.occupied : styles.available}`}>
                          {occupied ? t("pos.newSales.table.occupied") : t("pos.newSales.table.available")}
                        </div>
                        
                        {/* معلومات إضافية للطاولات المشغولة */}
                        {occupied && invoice && (
                          <div className={styles.occupiedInfo}>
                            <div className={styles.orderTotal}>
                              {invoice.totalAfterTaxAndService.toFixed(2)} {t("pos.newSales.products.currency")}
                            </div>
                            
                            <div className={styles.openDuration}>
                              <AccessTimeIcon style={{ fontSize: 14 }} />
                              <span>{duration}</span>
                            </div>
                            

                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* الشريط الجانبي للأقسام */}
            <aside className={styles.categoriesSidebar}>
              <div className={styles.categoriesList}>
                {tableSections.map((section) => {
                  // حساب عدد الطاولات المشغولة في هذا القسم
                  const occupiedCount = section.tables.filter(table => 
                    isTableOccupied(table.id || '')
                  ).length;
                  
                  return (
                    <div
                      key={section.id}
                      className={`${styles.categoryItem} ${selectedSection?.id === section.id ? styles.active : ''}`}
                      onClick={() => handleSectionClick(section)}
                    >
                      <img 
                        src="/images/default-section.png" 
                        alt={section.name}
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.png';
                        }}
                      />
                      <div>
                        <span>{section.name}</span>
                        <br />
                        <small>{section.serviceCharge}% {t("pos.newSales.table.service")}</small>
                        <br />
                        <small className={styles.occupiedStats}>
                          {occupiedCount}/{section.tables.length} {t("pos.newSales.table.occupied")}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TableSelectionPopup;
