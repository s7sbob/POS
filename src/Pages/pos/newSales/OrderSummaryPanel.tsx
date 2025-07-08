import React from 'react';
import { OrderSummary } from './types/PosSystem';
import EditText from './components/ui/EditText';

interface OrderSummaryPanelProps {
  orderNumber: string;
  totalAmount: string;
  orderSummary: OrderSummary;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onRemoveItem: (itemId: string) => void;
  onSendOrder: () => void;
  onPrintOrder: () => void;
  onPayOrder: () => void;
  className?: string;
}

const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({
  orderNumber,
  totalAmount,
  orderSummary,
  customerName,
  onCustomerNameChange,
  onRemoveItem,
  onSendOrder,
  onPrintOrder,
  onPayOrder,
  className = ''
}) => {
  return (
    <div className={`bg-card rounded-2xl shadow-sm flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center">
        <EditText
          placeholder={orderNumber}
          value={orderNumber}
          variant="primary"
          className="flex-1 rounded-none rounded-tl-2xl border-r-0 font-nunito font-bold"
        />
        <div 
          className="bg-card  rounded-r-2xl"
          style={{ padding: 'min(1vh, 16px) min(1.5vw, 24px)' }}
        >
          <span 
            className="font-nunito font-bold text-primary-blue"
            style={{ fontSize: 'min(1.2vw, 20px)' }}
          >
            {totalAmount.split(' ')[0]}{' '}
          </span>
          <span 
            className="font-nunito font-bold text-primary-blue"
            style={{ fontSize: 'min(0.8vw, 10px)' }}
          >
            EGP
          </span>
        </div>
      </div>

      {/* Scrollable Middle: Order Details & Items */}
      <div className="flex-1 overflow-auto hidden-scroll min-h-0 p-3">
        <h3 
          className="font-nunito font-bold text-primary mb-4"
          style={{ fontSize: 'min(1.2vw, 20px)' }}
        >
          Order Details
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Walk in Customer"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              className="w-full border border-gray-300 rounded font-nunito text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
              style={{ 
                padding: 'min(0.8vh, 12px) min(0.8vw, 12px)',
                fontSize: 'min(0.9vw, 14px)'
              }}
            />
          </div>
          <button 
            className="bg-primary-blue rounded focus:outline-none focus:ring-2 focus:ring-primary-blue"
            style={{ padding: 'min(0.5vh, 8px)' }}
          >
            <img 
              src="/images/img_group_1000004320.svg" 
              alt="Add customer" 
              style={{ width: 'min(1.5vw, 24px)', height: 'min(1.5vw, 24px)' }}
            />
          </button>
        </div>

        <div className="space-y-1 mb-8">
          {orderSummary.items.map((item) => (
            <div key={item.id}>
              <div className="flex items-start justify-between py-1">
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="mt-1 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <img 
                      src="/images/img_delete_02.svg" 
                      alt="Remove" 
                      style={{ width: 'min(1vw, 12px)', height: 'min(1vw, 12px)' }}
                    />
                  </button>
                  <div className="flex-1">
                    <p 
                      className="font-nunito font-semibold text-primary"
                      style={{ fontSize: 'min(0.9vw, 12px)' }}
                    >
                      {item.quantity} X {item.menuItem.name}
                    </p>
                    {item.extras.map((extra, index) => (
                      <div 
                        key={index} 
                        className="text-secondary mt-1" 
                        style={{ fontSize: 'min(0.75vw, 10px)' }}
                      >
                        <span>{extra.quantity} X {extra.name} ({extra.price})</span>
                        <span className="ml-8">{extra.price * extra.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p 
                    className="font-nunito font-semibold text-primary"
                    style={{ fontSize: 'min(0.9vw, 12px)' }}
                  >
                    {item.menuItem.price * item.quantity}
                  </p>
                  <p 
                    className="font-nunito font-semibold text-primary-blue"
                    style={{ fontSize: 'min(0.9vw, 12px)' }}
                  >
                    {item.totalPrice}
                  </p>
                </div>
              </div>
              <div className="h-px bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Summary at Bottom */}
      <div className="flex-shrink-0 p-4 border-t">
        <div className="space-y-2">
          {[
            { label: 'Sub Total', value: orderSummary.subtotal },
            { label: 'Discount',  value: orderSummary.discount },
            { label: 'Tax',       value: orderSummary.tax },
            { label: 'Service',   value: orderSummary.service }
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center">
              <span 
                className="font-nunito font-medium text-primary"
                style={{ fontSize: 'min(0.9vw, 12px)' }}
              >
                {item.label}
              </span>
              <span 
                className="font-nunito font-bold text-primary"
                style={{ fontSize: 'min(0.9vw, 12px)' }}
              >
                {item.value} <span style={{ fontSize: 'min(0.7vw, 12px)' }}>EGP</span>
              </span>
            </div>
          ))}
        </div>

        <div className="h-px bg-gray-400 my-4"></div>

        <div className="flex justify-between items-center">
          <span 
            className="font-nunito font-bold text-primary"
            style={{ fontSize: 'min(1vw, 16px)' }}
          >
            Total
          </span>
          <span 
            className="font-nunito font-bold text-primary"
            style={{ fontSize: 'min(1vw, 16px)' }}
          >
            {orderSummary.total} <span style={{ fontSize: 'min(0.8vw, 14px)' }}>EGP</span>
          </span>
        </div>
      </div>

      {/* Fixed Action Buttons */}
      <div className="flex-shrink-0 p-4">
        <div className="grid grid-cols-3 gap-4">
          {[
            { onClick: onSendOrder,  bg: 'bg-primary-red',   icon: '/images/img_tabler_send.svg',    label: 'Send' },
            { onClick: onPrintOrder, bg: 'bg-primary-blue',  icon: '/images/img_printer.svg',       label: 'Print' },
            { onClick: onPayOrder,   bg: 'bg-primary-green', icon: '/images/img_payment_02.svg',    label: 'Pay' }
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              className={`flex flex-col items-center justify-center ${btn.bg} rounded text-white focus:outline-none`}
              style={{ padding: 'min(1vh, 16px)' }}
            >
              <img 
                src={btn.icon} 
                alt={btn.label} 
                className="mb-1"
                style={{ width: 'min(1.2vw, 20px)', height: 'min(1.2vw, 20px)' }}
              />
              <span 
                className="font-nunito font-bold"
                style={{ fontSize: 'min(1.2vw, 18px)' }}
              >
                {btn.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPanel;
