import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, message } from 'antd';
import FormContainer from './DKG_FormContainer';
import Heading from './DKG_Heading';
import axios from 'axios';

const PurchaseOrderDetails = ({ tenderId }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseOrderDetails = async () => {
      try {
        const res = await axios.get(`/api/vendor-master/approvedVendorData/${tenderId}`);
        if (res.data.responseStatus.statusCode === 0) {
          setOrderData(res.data.responseData);
        } else {
          message.error('Failed to fetch purchase order details');
        }
      } catch (error) {
        console.error('Error fetching purchase order details:', error);
        message.error('An error occurred while fetching purchase order details');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrderDetails();
  }, [tenderId]);

  if (loading) return <Spin tip="Loading Purchase Order..." />;

  if (!orderData) {
    return (
      <FormContainer>
        <Heading title="Purchase Order Details" />
        <p>vendor quotation is qualified, but the purchase order has not been generated yet.</p>
      </FormContainer>
    );
  }

  const {
    tenderNumber,
    purchaseOrder,
    deliveryAndAcceptanceStatus,
    paymentStatus,
    paymentUTRNumber,
    date,
    tenderRequestCopy,
    poCopy,
  } = orderData;

 return (
  <FormContainer>
    <Heading title={`Purchase Order for Tender ID: ${tenderNumber}`} />
    <div style={{ padding: '24px' }}>
      <div>
        <Descriptions
          column={1}
          bordered
          size="middle"
          labelStyle={{ fontWeight: '600', backgroundColor: '#fafafa', width: '30%' }}
          contentStyle={{ backgroundColor: '#fff' }}
        >
          <Descriptions.Item label="Tender Number">{tenderNumber || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Purchase Order">{purchaseOrder || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Delivery & Acceptance Status">
            {deliveryAndAcceptanceStatus !== 'null' ? deliveryAndAcceptanceStatus : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            {paymentStatus !== 'null' ? paymentStatus : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Payment UTR Number">
            {paymentUTRNumber !== 'null' ? paymentUTRNumber : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {date ? new Date(date).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Tender Request Copy">
            {tenderRequestCopy !== 'null' ? tenderRequestCopy : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="PO Copy">
            {poCopy !== 'null' ? poCopy : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  </FormContainer>
);
}

export default PurchaseOrderDetails;
