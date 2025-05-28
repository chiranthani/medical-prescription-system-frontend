import React, { useState } from 'react';
import { Modal, Form, AutoComplete, InputNumber, Button, message, Space } from 'antd';
import api from '../utils/api';

const CreateQuotationModal = ({ open, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [drugOptions, setDrugOptions] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);

  const fetchDrugs = async (searchText) => {
    try {
      const res = await api.get(`quotation/drug-list?search=${searchText}`);
      setDrugOptions(
        res.data.data.map((list) => ({
          value: list.drug.name,
          label: `${list.drug.name} (Stock: ${list.total_stock_qty})`,
          list, 
        }))
      );
    } catch {
     
    }
  };

  const handleAddDrug = () => {
    form
      .validateFields(['drug', 'qty'])
      .then(({ drug, qty }) => {
        const selected = drugOptions.find((d) => d.value === drug);
        if (!selected) {
          message.error('Please select a valid drug');
          return;
        }

        const drugData = selected.drug;

        if (qty > drugData.stock) {
          message.error(`Only ${drugData.stock} in stock`);
          return;
        }

        if (selectedDrugs.find((item) => item.drug.id === drugData.id)) {
          message.error('Drug already added');
          return;
        }

        setSelectedDrugs([...selectedDrugs, { drug: drugData, qty }]);
        form.resetFields(['drug', 'qty']);
      });
  };

  const handleSubmit = () => {
    if (selectedDrugs.length === 0) {
      message.warning('Please add at least one drug');
      return;
    }

    const result = selectedDrugs.map((item) => ({
      drug_id: item.drug.id,
      qty: item.qty,
    }));

    onSave(result);
  };

  return (
    <Modal
      title="Create Quotation"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="drug" label="Drug" rules={[{ required: true }]}>
          <AutoComplete
            options={drugOptions}
            onSearch={fetchDrugs}
            placeholder="Search drug by name"
            filterOption={false}
          />
        </Form.Item>

        <Form.Item name="qty" label="Quantity" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Button type="dashed" onClick={handleAddDrug} block>
          Add Drug
        </Button>
      </Form>

      <div style={{ marginTop: 20 }}>
        <h4>Selected Drugs</h4>
        {selectedDrugs.map((item, idx) => (
          <Space key={idx} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>{item.drug.name}</div>
            <div>Qty: {item.qty}</div>
            <Button type="link" danger onClick={() =>
              setSelectedDrugs(selectedDrugs.filter((_, i) => i !== idx))
            }>
              Remove
            </Button>
          </Space>
        ))}
      </div>
    </Modal>
  );
};

export default CreateQuotationModal;
