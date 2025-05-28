import React, { useState } from 'react';
import { Layout, Form, Input, Button, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MenuHeader from '../components/MenuHeader';
import dayjs from 'dayjs';
import api from '../utils/api';
import Swal from 'sweetalert2';

const { Content } = Layout;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        if (values.password !== values.confirm_password) {
            Swal.fire("Warning", "Passwords do not match!", "warning");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('register', {
                name: values.name,
                email: values.email,
                contact_no: values.contact_no,
                dob: values.dob.format('YYYY-MM-DD'),
                address: values.address,
                password: values.password,
                password_confirmation: values.confirm_password
            });

            if (response.data.status) {
                Swal.fire("Success", response.data.message, "success").then(() => {
                    navigate('/verify-otp', { state: { email: values.email } });
                });
            } else {
                Swal.fire("Warning", "" + response.data.message, "warning");
            }
        } catch (error) {
            if (error.response && error.response.data?.message) {
                Swal.fire("Warning", "" + error.response.data.message, "warning");
            } else {
                Swal.fire("Warning", "Registration failed. Please try again", "warning");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <MenuHeader />
            <Content style={{ padding: '50px' }}>
                <div style={{ maxWidth: 500, margin: 'auto' }}>
                    <h2>Register</h2>
                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter your name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email!' },
                                { type: 'email', message: 'Enter a valid email!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Contact No"
                            name="contact_no"
                            rules={[{ required: true, message: 'Please enter your contact number!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Date of Birth"
                            name="dob"
                            rules={[{ required: true, message: 'Please select your date of birth!' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabledDate={(current) => {
                                    return current && current > dayjs().subtract(18, 'year').endOf('day');
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please enter your address!' }]}
                        >
                            <Input.TextArea rows={2} />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter a password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            name="confirm_password"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
};

export default Register;
