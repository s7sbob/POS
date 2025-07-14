// src/Pages/pos/newSales/components/ActionButtons.tsx
import React from 'react';

interface ActionButtonsProps {
  selectedChips: string[];
  onChipClick: (chipType: string) => void;
  isExtraMode: boolean;
  isWithoutMode: boolean;
  onExtraClick: () => void;
  onWithoutClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedChips,
  onChipClick,
  isExtraMode,
  isWithoutMode,
  onExtraClick,
  onWithoutClick,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="action-buttons-bar">
      <div className="action-chips">
        <button 
          className={`action-chip extra ${selectedChips.includes('extra') || isExtraMode ? 'active' : ''}`}
          onClick={onExtraClick}
        >
          <img src="/images/img_addcircle.svg" alt="" />
          <span>Extra</span>
        </button>
        <button 
          className={`action-chip without ${selectedChips.includes('without') || isWithoutMode ? 'active' : ''}`}
          onClick={onWithoutClick}
        >
          <img src="/images/img_removecircle.svg" alt="" />
          <span>Without</span>
        </button>
        <button 
          className={`action-chip offer ${selectedChips.includes('offer') ? 'active' : ''}`}
          onClick={() => onChipClick('offer')}
        >
          <img src="/images/img_tags.svg" alt="" />
          <span>Offer</span>
        </button>
      </div>
      
      <div className="search-container">
        <img src="/images/img_search01.svg" alt="search" className="search-icon" />
        <input
          type="text"
          placeholder="Search"
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
