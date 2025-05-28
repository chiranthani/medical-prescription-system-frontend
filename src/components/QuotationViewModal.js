import React from 'react';
import { Modal, Descriptions, Table, Image } from 'antd';

const QuotationViewModal = ({ open, onClose, quotation }) => {
  if (!quotation) return null;

  const columns = [
    {
      title: 'Drug',
      dataIndex: ['drug', 'name'], 
      key: 'name',
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price', 
      key: 'unit_price',
      render: (price) => `Rs. ${price}`
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => `Rs. ${record.total_amount}`
    }
  ];

  return (
    <Modal
      title="Quotation Details"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
     <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 16, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16 }}>Quotation Info</h3>

        <div style={{ display: 'flex', marginBottom: 8 }}>
            <div style={{ width: 150, fontWeight: 'bold' }}>User Status:</div>
            <div>{quotation.user_status ?? '-'}</div>
        </div>

        <div style={{ display: 'flex', marginBottom: 8 }}>
            <div style={{ width: 150, fontWeight: 'bold' }}>Total Amount:</div>
            <div>Rs. {quotation.total_amount }</div>
        </div>

        <div style={{ display: 'flex', marginBottom: 8 }}>
            <div style={{ width: 150, fontWeight: 'bold' }}>Note:</div>
            <div>{quotation.note ?? '-'}</div>
        </div>
        <div style={{ display: 'flex', marginBottom: 8 }}>
            <div style={{ width: 150, fontWeight: 'bold' }}>Create At:</div>
            <div>{new Date(quotation.created_at).toLocaleDateString() ?? '-'}</div>
        </div>
        </div>


      <h4>Quotation Items</h4>
      <Table
        dataSource={quotation.items}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </Modal>
  );
};

export default QuotationViewModal;
