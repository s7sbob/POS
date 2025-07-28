// src/Pages/pos/newSales/components/paymentPopup components/PaymentLeft.tsx
import React from 'react';
import PaymentOrderSummary from './PaymentOrderSummary';
import styles from './styles/PaymentLeft.module.css';

interface PaymentLeftProps {
  orderSummary: any;
  selectedCustomer: any;
  selectedAddress: any;
  orderType: string;
  deliveryCharge: number;
}

const PaymentLeft: React.FC<PaymentLeftProps> = ({
  orderSummary,
  selectedCustomer,
  selectedAddress,
  orderType,
  deliveryCharge,
}) => {
  return (
    <div className={styles.container}>
        <PaymentOrderSummary 
          orderSummary={orderSummary}
          selectedCustomer={selectedCustomer}
          selectedAddress={selectedAddress}
          orderType={orderType}
          deliveryCharge={deliveryCharge} onGoBack={function (): void {
            throw new Error('Function not implemented.');
          } }        />
    </div>
  );
};

export default PaymentLeft;
