import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Select, TimePicker, Layout } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../utils/api';
import dayjs from 'dayjs';
import MenuHeader from '../components/MenuHeader';
import { Content } from 'antd/es/layout/layout';
import Swal from 'sweetalert2';
import CreateQuotationModal from '../components/CreateQuotationModal';

const { TextArea } = Input;
const { Option } = Select;

const Quotation = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [quotationModalVisible, setQuotationModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

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
          setQuotationModalVisible(false);
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
    { title: 'Delivery address', dataIndex: 'delivery_address', key: 'delivery_address' },
    { title: 'Delivery Time', dataIndex: 'delivery_time', key: 'delivery_time' },
    { title: 'Note', dataIndex: 'note', key: 'note' },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleDateString(),
    },
      {
    title: 'Quotation',
    key: 'quotation',
    render: (_, record) => {
      if (record.is_quotation_created == 0 && isToday(record.created_at)) {
        return (
          <Button type="primary" onClick={() => handleCreateQuotation(record)}>
            Create
          </Button>
        );
      } else if (record.is_quotation_created == 1 && record.quotation) {
        return <span>{record.quotation.user_status}</span>;
      } else {
        return <span style={{ color: '#aaa' }}>Not available</span>;
      }
    },
  },
  ];

  const disabledFile = ({ fileList }) => {
    return fileList.length >= 5;
  };

  const isToday = (date) => {
   return dayjs(date).isSame(dayjs(), 'day');
  };

  const handleCreateQuotation = (record) => {
  };

  return (
    <Layout>
      <MenuHeader />
      <Content style={{ padding: '50px' }}>
        <div>
          <h2>Prescriptions</h2>

          <Table columns={columns} dataSource={data}
           rowKey="id" style={{ marginTop: 20 }}
           rowClassName={(record) => (isToday(record.created_at) ? 'today-row' : '')} />
        </div>

        <CreateQuotationModal
          open={quotationModalVisible}
          onClose={() => setQuotationModalVisible(false)}
          onSave={(drugArray) => {
            console.log('Send to API:', drugArray);
            // POST to `quotation/create`
            setQuotationModalVisible(false);
          }}
        />
      </Content>
    </Layout>

  );
};

export default Quotation;
