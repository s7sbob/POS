// src/Pages/pos/newSales/components/TableSelectionPopup.tsx
import React, { useState, useEffect } from 'react';
import { TableSection, Table, TableSelection } from '../types/TableSystem';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/TableSelectionPopup.module.css';

interface TableSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTable: (selection: TableSelection) => void;
  tableSections: TableSection[];
}

const TableSelectionPopup: React.FC<TableSelectionPopupProps> = ({
  isOpen,
  onClose,
  onSelectTable,
  tableSections
}) => {
  const [selectedSection, setSelectedSection] = useState<TableSection | null>(null);

  useEffect(() => {
    if (isOpen && tableSections.length > 0) {
      setSelectedSection(tableSections[0]);
    }
  }, [isOpen, tableSections]);

  if (!isOpen) return null;

  const handleSectionClick = (section: TableSection) => {
    setSelectedSection(section);
  };

  const handleTableClick = (table: Table) => {
    if (selectedSection && !table.isOccupied) {
      onSelectTable({
        section: selectedSection,
        table: table
      });
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
            <span>إغلاق</span>
          </button>

          <main className={styles.mainContent}>
            {/* قسم الطاولات */}
            <section className={styles.productsSection}>
              <div className={styles.productGrid}>
                {displayedTables.map((table) => (
                  <div
                    key={table.id}
                    className={`${styles.productItem} ${table.isOccupied ? styles.occupied : ''}`}
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
                    </div>
                    <div className={styles.productName}>
                      <span>{table.name}</span>
                      <small>{table.capacity} أشخاص</small>
                      <div className={`${styles.status} ${table.isOccupied ? styles.occupied : styles.available}`}>
                        {table.isOccupied ? 'مشغولة' : 'متاحة'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* الشريط الجانبي للأقسام */}
            <aside className={styles.categoriesSidebar}>
              <div className={styles.categoriesList}>
                {tableSections.map((section) => (
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
                      <small>{section.serviceCharge}% خدمة</small>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TableSelectionPopup;
