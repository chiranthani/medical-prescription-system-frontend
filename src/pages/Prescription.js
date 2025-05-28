import React, { useEffect, useState } from 'react';
import { Table,Tag, Button, Modal, Form, Input, Upload, message, Select, TimePicker, Layout } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../utils/api';
import dayjs from 'dayjs';
import MenuHeader from '../components/MenuHeader';
import { Content } from 'antd/es/layout/layout';
import Swal from 'sweetalert2';

const { TextArea } = Input;
const { Option } = Select;

const Prescription = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [quotationModalVisible, setQuotationModalVisible] = useState(false);


  const fetchPrescriptions = async () => {
    try {
      const res = await api.get('prescription/list');

      setData(res.data.data);
    } catch (err) {
      message.error('Failed to load prescriptions');
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleCreate = async (values) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('images[]', file.originFileObj);
    });
    formData.append('note', values.note);
    formData.append('delivery_address', values.address);
    formData.append('delivery_time', values.delivery_time);

    try {
      setLoading(true);
      const response = await api.post('prescription/create', formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status) {
        Swal.fire("Success", "" + response.data.message, "success");
          fetchPrescriptions();
          setVisible(false);
          form.resetFields();
          setFileList([]);
      } else {
        Swal.fire("Warning", "" + response.data.message, "warning");
      }

    } catch (err) {
      Swal.fire("Warning", "Failed to submit prescription", "warning");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Delivery Address', dataIndex: 'delivery_address', key: 'delivery_address' },
    { title: 'Delivery Time Slot', dataIndex: 'delivery_time', key: 'delivery_time' },
    { title: 'Note', dataIndex: 'note', key: 'note' },
    {
    title: 'Created Date',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => new Date(text).toLocaleDateString(),
  },
    {
    title: 'Quotation',
    key: 'quotation',
    render: (text, record) => {
      if (record.is_quotation_created == 0) {
        return <Tag color="orange"> Not yet</Tag>;
      } else {
        return (
          <Button type="primary" onClick={() => handleViewQuotation(record)}>
            View
          </Button>
        );
      }
    },
  },
  ];


  const handleViewQuotation = (record) => {
    setSelectedQuotation(record);
    setQuotationModalVisible(true);
  };

  const disabledFile = ({ fileList }) => {
    return fileList.length >= 5;
  };

  const handleStatusChanges = async (id,status) => {
    try {
      const response = await api.put(`quotation/status-change`, {'quotation_id':id,status });

      if (response.data.success) {
        Swal.fire("Success", response.data.message, "success");
        setQuotationModalVisible(false);
        fetchPrescriptions();
      } else {
        Swal.fire("Warning", response.data.message, "warning");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong while accepting", "error");
    }
  };

  return (
    <Layout>
      <MenuHeader />
      <Content style={{ padding: '50px' }}>
        <div>
          <h2>Prescriptions</h2>
          <div style={{ float: 'right', paddingBottom: '10px' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
              Create Prescription
            </Button>
          </div>

          <Table columns={columns} dataSource={data} rowKey="id" style={{ marginTop: 20 }} scroll={{ x: 'max-content' }}/>

          
          <Modal
            title="Create Prescription"
            open={visible}
            onCancel={() => setVisible(false)}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Save" 
          >
            <Form form={form} layout="vertical" onFinish={handleCreate}>
              <Form.Item
                name="images"
                label="Prescription Images"
                rules={[{ required: true, message: 'Please upload at least one image!' }]}
              >
                <Upload
                  listType="picture"
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={({ fileList }) => setFileList(fileList.slice(0, 5))}
                  multiple
                >
                  {fileList.length < 5 && (
                    <Button icon={<UploadOutlined />}>Upload (Max 5)</Button>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item name="address" label="Delivery Address" rules={[{ required: true }]}>
                <TextArea rows={3} placeholder="Enter delivery address" />
              </Form.Item>

              <Form.Item
                label="Delivery Time Slot"
                name="delivery_time"
                rules={[{ required: true, message: 'Please select a time slot' }]}
              >
                <Select placeholder="Select a 2-hour slot">
                  <Option value="8 AM - 10 AM">8 AM - 10 AM</Option>
                  <Option value="10 AM - 12 PM">10 AM - 12 PM</Option>
                  <Option value="12 PM - 2 PM">12 PM - 2 PM</Option>
                  <Option value="2 PM - 4 PM">2 PM - 4 PM</Option>
                  <Option value="4 PM - 6 PM">4 PM - 6 PM</Option>
                  <Option value="6 PM - 8 PM">6 PM - 8 PM</Option>
                </Select>
              </Form.Item>
              <Form.Item name="note" label="Note" rules={[{ required: false }]}>
                <TextArea rows={2} placeholder="Enter note" />
              </Form.Item>
            </Form>
          </Modal>


          <Modal
            title="Quotation Details"
            open={quotationModalVisible}
            onCancel={() => setQuotationModalVisible(false)}
            footer={null}
          >
            <p><strong>Delivery Address:</strong> {selectedQuotation?.delivery_address}</p>
            <p><strong>Delivery Time:</strong> {selectedQuotation?.delivery_time}</p>
            <p><strong>Note:</strong> {selectedQuotation?.note}</p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button danger onClick={() => handleStatusChanges(selectedQuotation.id,'reject')}>Reject</Button>
              <Button type="primary" onClick={() => handleStatusChanges(selectedQuotation.id,'accept')}>Accept</Button>
            </div>
          </Modal>

        </div>
      </Content>
    </Layout>

  );
};

export default Prescription;
