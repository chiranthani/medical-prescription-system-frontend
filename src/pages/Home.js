import React from 'react';
import { Layout } from 'antd';
import MenuHeader from '../components/MenuHeader';

const { Content } = Layout;

const Home = () => {
  return (
    <Layout>
      <MenuHeader />
      <Content style={{ padding: '50px' }}>
        <h1>Welcome to the Home Page</h1>
        <p>This is a basic layout using Ant Design.</p>
      </Content>

    </Layout>
  );
};

export default Home;
