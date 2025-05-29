import React, { useEffect, useState } from 'react';
import { Modal, Form, AutoComplete, InputNumber, Button, Image, Row, Col } from 'antd';
import api from '../utils/api';
import Swal from 'sweetalert2';
import { IMG_BASE_URL } from '../utils/auth';

const CreateQuotationModal = ({ open, onClose, onSave, prescription }) => {
    const [form] = Form.useForm();
    const [drugOptions, setDrugOptions] = useState([]);
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [drugLabel, setDrugLabel] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchDrugs = async (searchText) => {
        try {
            const res = await api.get(`quotation/drug-list?search=${searchText}`);
            setDrugOptions(
                res.data.data.map((list) => ({
                    value: `${list.drug.name} (Stock: ${list.total_stock_qty})`,
                    label: `${list.drug.name} (Stock: ${list.total_stock_qty})`,
                    drug: list,
                }))
            );
        } catch {

        }
    };

    const handleAddDrug = () => {
        form.validateFields(['drug', 'qty']).then(({ drug, qty }) => {

            const selected = drugOptions.find((d) => d.drug.drug_item_id == drug.drug_item_id);

            if (!selected) {
                Swal.fire("Warning", "Please select a valid drug", "warning");
                return;
            }

            if (!qty || isNaN(qty) || parseInt(qty) <= 0) {
                Swal.fire("Warning", "Please enter a valid quantity", "warning");
                return;
            }

            const drugData = selected.drug;

            if (qty > drugData.total_stock_qty) {
                Swal.fire("Warning", "Only " + drugData.total_stock_qty + " in stock", "warning");
                return;
            }

            const alreadyAdded = selectedDrugs.find(
                (item) => item.drug_id == drugData.drug_item_id
            );

            if (alreadyAdded) {
                Swal.fire("Warning", "Drug already added", "warning");
                return;
            }

            setSelectedDrugs([...selectedDrugs, {
                drug_id: drugData.drug_item_id,
                name: drugData.drug.name,
                quantity: qty,
                unit_price: drugData.item_price_rate,
                total: drugData.item_price_rate * qty,
                stock_id: drugData.id
            }]);
            setDrugLabel('');
            form.resetFields(['drug', 'qty']);
        });
    };

  const handleSubmit = async () => {
        if (selectedDrugs.length == 0) {
            Swal.fire("Warning", "Please add at least one drug", "warning");
            return;
        }
       try {
            setLoading(true);
            await onSave(selectedDrugs);
            setSelectedDrugs([]);
            onClose(); 
        } catch (err) {
            Swal.fire("Error", "Failed to send quotation", "error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal
            title="Create Quotation"
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            okText="Send Quotation"
            width={1000}
            confirmLoading={loading}
        >
            <Row gutter={24}>
                <Col span={12}>
                    <h4>Prescription Images</h4>
                    <Image.PreviewGroup>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {prescription?.images?.map((img, idx) => (
                                <Image
                                    key={idx}
                                    src={`${IMG_BASE_URL}${img.image_path}`}
                                    alt={`Prescription ${idx + 1}`}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover', border: '1px solid #ddd' }}
                                />
                            ))}
                        </div>
                    </Image.PreviewGroup>
                </Col>
                <Col span={12}>
                    <Form form={form} layout="vertical">
                        <Form.Item name="drug" label="Drug" rules={[{ required: true }]}>
                            <AutoComplete
                                labelInValue
                                value={drugLabel}
                                onChange={(text) => setDrugLabel(text)}
                                onSelect={(value, option) => {
                                    form.setFieldsValue({ drug: option.drug });

                                }}
                                options={drugOptions}
                                onSearch={fetchDrugs}
                                placeholder="Search drug by name"
                                filterOption={false}
                            />
                        </Form.Item>

                        <Form.Item name="qty" label="Quantity" rules={[{ required: true }]}>
                            <InputNumber min={1} style={{ width: '100%' }}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Form.Item>

                        <Button type="dashed" onClick={handleAddDrug} block>
                            Add Drug
                        </Button>
                    </Form>

                    <div style={{ marginTop: 20 }}>
                        <h4>Selected Drugs</h4>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 100px 150px 80px',
                                fontWeight: 'bold',
                                padding: '6px 0',
                                borderBottom: '2px solid #000',
                            }}
                        >
                            <div>Drug</div>
                            <div>Qty</div>
                            <div>Amount</div>
                            <div></div>
                        </div>

                        {selectedDrugs.map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 100px 150px 80px',
                                    alignItems: 'center',
                                    padding: '6px 0',
                                    borderBottom: '1px solid #f0f0f0',
                                }}
                            >
                                <div>{item.name}</div>

                                <div>
                                    {item.qty} x {item.unit_price}
                                </div>
                                <div>{item.total}</div>
                                <Button
                                    type="link"
                                    danger
                                    onClick={() => setSelectedDrugs(selectedDrugs.filter((_, i) => i !== idx))}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </Modal>
    );
};

export default CreateQuotationModal;
