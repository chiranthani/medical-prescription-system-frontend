import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Badge, notification,Typography ,Dropdown, List } from 'antd';
import { isAuthenticated, fetchUserType } from '../utils/auth';
import api from '../utils/api';

const { Header } = Layout;
const { Text } = Typography;

const MenuHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const navigate = useNavigate();
  const [lastNotificationIds, setLastNotificationIds] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    setUserType(localStorage.getItem('userType'));
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('userType')
      setIsLoggedIn(false);
      navigate('/');
      console.log('logged out');
    } else {
      navigate('/login');
    }
  };

  const handleMenuClick = async ({ key }) => {
    setUserType(userType);
    const routes = {
      home: '/',
      prescription: '/prescriptions',
      quotation: '/quotations',
      login: '/login',
      register: '/register'
    };

    if (routes[key]) {
      navigate(routes[key]);
    }
  };

  const fetchNotifications = async () => {
  try {
    const res = await api.get('notification'); 
    const notifications = res.data.data || []; 
    setNotificationsCount(notifications.length);
    setNotifications(notifications);

    const newNotifs = notifications.filter(n => !lastNotificationIds.includes(n.id));

    if (newNotifs.length > 0) {
      newNotifs.forEach(n => {
        notification.info({
          message: 'New Notification',
          description: n.data?.message || 'You have a new update',
          placement: 'topRight',
        });
      });

      setLastNotificationIds(notifications.map(n => n.id));
    }
  } catch (err) {
    console.error('Failed to fetch notifications', err);
  }
};

  useEffect(() => {
    if (!isLoggedIn) return;


    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleRegisterClick = () => {
    navigate('/register');
  };


  const notificationMenu = (
  <div style={{ width: 300, maxHeight: 400, overflowY: 'auto', padding: 10, backgroundColor:'white' }}>
    {notifications.length > 0 ? (
      <>
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Text>{item.data?.message || 'New update'}</Text>
            </List.Item>
          )}
        />
       
      </>
    ) : (
      <Text type="secondary">No new notifications</Text>
    )}
  </div>
);

  return (
    <Header
      style={{
        backgroundColor: '#001529',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['home']}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        onClick={handleMenuClick}
      >
        <Menu.Item key="home">Home</Menu.Item>
        {userType == 'user' && (
          <>
            <Menu.Item key="prescription">Prescription</Menu.Item>
          </>
        )}
         {userType == 'pharmacy' && (
          <>
            <Menu.Item key="quotation">Quotation</Menu.Item>
            
          </>
        )}
      </Menu>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
        {!isLoggedIn ? (
          <>
            <Button type="primary" onClick={handleAuthClick}>
              Login
            </Button>
            <Button onClick={handleRegisterClick}>Register</Button>
          </>
        ) : (<>
            <div style={{ cursor: 'pointer', marginRight:'15px' }}>
             <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
              <div style={{ cursor: 'pointer' }}>
                <Badge count={notificationsCount} offset={[10, 0]}>
                  <span style={{ color: '#fff' }}>Notifications</span>
                </Badge>
              </div>
            </Dropdown>

            </div>
            <div>
                <Button type="primary" key={'logout'} onClick={handleAuthClick}>
                  Logout
                </Button>
            </div>
        </>)}
      </div>
    </Header>
  );
};

export default MenuHeader;
