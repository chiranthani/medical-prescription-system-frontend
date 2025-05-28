import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Form, Input, Button, message } from 'antd';
import MenuHeader from '../components/MenuHeader';
import Swal from 'sweetalert2';
import api from '../utils/api';

const { Content } = Layout;

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const onFinish = async (values) => {
    if (!email) {
      message.error('Missing email for OTP verification.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('otp-verify', {
        email,
        otp: values.otp,
      });

      if (response.data.status) {
        Swal.fire("Success", "OTP verified successfully! Congrats, you can access to system", "success").then(() => {
            navigate('/login');
        });
        
      } else {
        Swal.fire("Warning", "" + response.data.message, "warning");
      }
    } catch (error) {
        Swal.fire("Warning", "Failed to verify OTP", "warning");
    } finally {
      setLoading(false);
    }
  };

//   const resendOtp = async () => {
//     if (!email) {
//         Swal.fire("Warning", "" + response.data.message, "warning");
//       message.error('Missing email to resend OTP.');
//       return;
//     }

//     setResending(true);
//     try {
//       const response = await axios.post('/api/resend-otp', { email });
//       if (response.data.success) {
//         message.success('OTP resent successfully!');
//       } else {
//         message.error(response.data.message || 'Failed to resend OTP.');
//       }
//     } catch (error) {
//       message.error('Error resending OTP.');
//     } finally {
//       setResending(false);
//     }
//   };

  return (
    <Layout>
      <MenuHeader />
      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: 400, margin: 'auto' }}>
          <h2>OTP Verification</h2>
          <p>Please enter the OTP sent to <strong>{email}</strong></p>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="OTP"
              name="otp"
              rules={[
                { required: true, message: 'Please enter the OTP' },
                { len: 4, message: 'OTP must be 4 digits' },
              ]}
            >
              <Input maxLength={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Verify OTP
              </Button>
            </Form.Item>

            {/* <Form.Item>
              <Button type="link" onClick={resendOtp} loading={resending}>
                Resend OTP
              </Button>
            </Form.Item> */}
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default OTPVerification;
