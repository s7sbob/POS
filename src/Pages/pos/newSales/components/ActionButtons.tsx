// src/Pages/pos/newSales/components/ActionButtons.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ActionButtonsProps {
  selectedChips: string[];
  onChipClick: (chipType: string) => void;
  isExtraMode: boolean;
  isWithoutMode: boolean;
  showOffers: boolean; // إضافة جديدة
  onExtraClick: () => void;
  onWithoutClick: () => void;
  onOffersClick: () => void; // إضافة جديدة
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasSelectedOrderItem: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedChips,
  onChipClick,
  isExtraMode,
  isWithoutMode,
  showOffers, // إضافة جديدة
  onExtraClick,
  onWithoutClick,
  onOffersClick, // إضافة جديدة
  searchQuery,
  onSearchChange,
  hasSelectedOrderItem
}) => {
  const { t } = useTranslation();

  return (
    <div className="action-buttons-bar">
      <div className="action-chips">
        <button 
          className={`action-chip extra ${selectedChips.includes('extra') || isExtraMode ? 'active' : ''} ${!hasSelectedOrderItem ? 'disabled' : ''}`}
          onClick={hasSelectedOrderItem ? onExtraClick : undefined}
          disabled={!hasSelectedOrderItem}
          title={!hasSelectedOrderItem ? t('pos.newSales.messages.selectProductFirst') : ''}
        >
          <img src="/images/img_addcircle.svg" alt="" />
          <span>{t("pos.newSales.actions.extra")}</span>
        </button>

        <button 
          className={`action-chip without ${selectedChips.includes('without') || isWithoutMode ? 'active' : ''} ${!hasSelectedOrderItem ? 'disabled' : ''}`}
          onClick={hasSelectedOrderItem ? onWithoutClick : undefined}
          disabled={!hasSelectedOrderItem}
          title={!hasSelectedOrderItem ? t('pos.newSales.messages.selectProductFirst') : ''}
        >
          <img src="/images/img_removecircle.svg" alt="" />
          <span>{t("pos.newSales.actions.without")}</span>
        </button>

        <button 
          className={`action-chip offer ${selectedChips.includes('offer') || showOffers ? 'active' : ''}`}
          onClick={onOffersClick} // تحديث المعالج
        >
          <img src="/images/img_tags.svg" alt="" />
          <span>{t("pos.newSales.actions.offer")}</span>
        </button>
      </div>
      
      <div className="search-container">
        <img src="/images/img_search01.svg" alt="search" className="search-icon" />
        <input
          type="text"
          placeholder={showOffers ? "البحث في العروض..." : t("pos.newSales.actions.search")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <button className="filter-button">
          <img src="/images/img_group_7.svg" alt="Filter" />
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
