import React, { useState } from 'react';
import { Layout, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MenuHeader from '../components/MenuHeader';
import api from '../utils/api';
import 'antd/dist/reset.css';
import Swal from 'sweetalert2';
import { setToken } from '../utils/auth';

const { Content } = Layout;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await api.post('login', {
                email: values.email,
                password: values.password,
            });

            if (response.data.status) {
                setToken(response.data.data.access_token)
                localStorage.setItem('userType',response.data.data.user.user_type);
                navigate('/home');
            } else {
                Swal.fire("Warning", "" + response.data.message, "warning");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                Swal.fire("Warning", "" + error.response.data.message, "warning");
            } else {
                Swal.fire("Warning", "Login failed. Please try again", "warning");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <MenuHeader />
            <Content style={{ padding: '50px' }}>
                <div style={{ maxWidth: 400, margin: '50px auto' }}>
                    <h2>Login</h2>
                    <Form
                        name="login"
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ email: '', password: '' }}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email!' },
                                { type: 'email', message: 'Please enter a valid email!' },
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>

        </Layout>
    );
};

export default Login;
