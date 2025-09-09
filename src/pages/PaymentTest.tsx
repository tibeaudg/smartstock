import React from 'react';
import { PaymentTestSuite } from '@/components/payments/PaymentTestSuite';
import { Layout } from '@/components/Layout';

export const PaymentTestPage: React.FC = () => {
  return (
    <Layout>
      <PaymentTestSuite />
    </Layout>
  );
};
