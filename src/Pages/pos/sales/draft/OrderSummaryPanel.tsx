// import React from 'react';
// import { OrderSummary } from './types/PosSystem';

// interface OrderSummaryPanelProps {
//   orderNumber: string;
//   totalAmount: string;
//   orderSummary: OrderSummary;
//   customerName: string;
//   onCustomerNameChange: (name: string) => void;
//   onRemoveItem: (itemId: string) => void;
//   onSendOrder: () => void;
//   onPrintOrder: () => void;
//   onPayOrder: () => void;
//   className?: string;
// }

// const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({
//   orderNumber,
//   totalAmount,
//   orderSummary,
//   customerName,
//   onCustomerNameChange,
//   onRemoveItem,
//   onSendOrder,
//   onPrintOrder,
//   onPayOrder,
//   className = ''
// }) => {
//   return (
//     <div className={`order-container ${className}`}>
//       {/* Header */}
//       <div className="order-header">
//         <div className="order-number">{orderNumber}</div>
//         <div className="order-total">
//           <span>{totalAmount.split(' ')[0]}</span>
//           <span style={{ fontSize: '1.4rem', marginLeft: '0.4rem' }}>EGP</span>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="order-body">
//         <h3 className="order-title">Order Details</h3>

//         {/* Customer Info */}
//         <div className="customer-input-container">
//           <input
//             type="text"
//             placeholder="Walk in Customer"
//             value={customerName}
//             onChange={(e) => onCustomerNameChange(e.target.value)}
//             className="customer-input"
//           />
//           <button className="customer-button">
//             <img src="/images/img_group_1000004320.svg" alt="Add customer" />
//           </button>
//         </div>

//         {/* Order Items */}
//         <div className="order-items">
//           {orderSummary.items.map((item) => (
//             <div key={item.id} className="order-item">
//               <div className="item-details">
//                 <button onClick={() => onRemoveItem(item.id)} className="delete-button">
//                   <img src="/images/img_delete_02.svg" alt="Remove" />
//                 </button>
//                 <div className="item-info">
//                   <div className="item-name">
//                     {item.quantity} X {item.menuItem.name}
//                   </div>
//                   {item.extras.map((extra, index) => (
//                     <div key={index} className="item-extras">
//                       {extra.quantity} X {extra.name} ({extra.price})
//                       <span style={{ marginLeft: '3.2rem' }}>{extra.price * extra.quantity}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="item-prices">
//                 <div className="item-price">{item.menuItem.price * item.quantity}</div>
//                 <div className="item-total">{item.totalPrice}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="order-summary">
//         <div className="summary-rows">
//           {[
//             { label: 'Sub Total', value: orderSummary.subtotal },
//             { label: 'Discount', value: orderSummary.discount },
//             { label: 'Tax', value: orderSummary.tax },
//             { label: 'Service', value: orderSummary.service }
//           ].map(item => (
//             <div key={item.label} className="summary-row">
//               <span>{item.label}</span>
//               <span className="value">{item.value} <small>EGP</small></span>
//             </div>
//           ))}
//         </div>

//         <div className="summary-total">
//           <span>Total</span>
//           <span>{orderSummary.total} <small>EGP</small></span>
//         </div>

//         <div className="action-buttons">
//           <button onClick={onSendOrder} className="action-button send-button">
//             <img src="/images/img_tabler_send.svg" alt="Send" />
//             Send
//           </button>
//           <button onClick={onPrintOrder} className="action-button print-button">
//             <img src="/images/img_printer.svg" alt="Print" />
//             Print
//           </button>
//           <button onClick={onPayOrder} className="action-button pay-button">
//             <img src="/images/img_payment_02.svg" alt="Pay" />
//             Pay
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderSummaryPanel;
