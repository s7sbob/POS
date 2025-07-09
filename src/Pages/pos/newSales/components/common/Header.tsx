import React, { useState } from 'react';

const Header: React.FC = () => {
  const [selectedOrderType, setSelectedOrderType] = useState('Takeaway');

  const orderTypes = ['Takeaway', 'Dine In', 'Delivery'];

  return (
    <div className="header-content">
      {/* Logo */}
      <img src="/images/img_foodify_logo_2_78x166.png" alt="Foodify Logo" className="logo" />

      {/* Navigation */}
      <nav className="nav-items">
        <a href="#" className="nav-item">
          <img src="/images/img_sending_order.svg" alt="" />
          Today Orders
        </a>
        <a href="#" className="nav-item">
          <img src="/images/img_table_02.svg" alt="" />
          Table
        </a>
        <a href="#" className="nav-item">
          <img src="/images/img_discount_tag_01.svg" alt="" />
          Discount
        </a>
        <a href="#" className="nav-item">
          <img src="/images/img_delete_01.svg" alt="" />
          Void
        </a>
        <select 
          value={selectedOrderType}
          onChange={(e) => setSelectedOrderType(e.target.value)}
          style={{ 
            padding: '0.8rem 1.6rem', 
            borderRadius: '0.4rem',
            border: '0.1rem solid #ccc',
            fontSize: '1.6rem',
            fontFamily: 'Nunito, sans-serif'
          }}
        >
          {orderTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button style={{ 
          padding: '0.8rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}>
          <img src="/images/img_menu_01.svg" alt="Menu" style={{ width: '2.8rem', height: '2.8rem' }} />
        </button>
      </nav>
    </div>
  );
};

export default Header;
