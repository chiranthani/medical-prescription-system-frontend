import React from 'react';
import { Layout, Carousel } from 'antd';
import MenuHeader from '../components/MenuHeader';

const { Content } = Layout;

const Home = () => {
  const slideTextStyle = {
    textAlign: 'center',
    fontSize: '24px',
    color: '#fff',
    padding: '10px 20px',
  };

  return (
    <Layout>
      <MenuHeader />
      <Content style={{ padding: 0 }}>
         <div style={{ padding: '20px' }}>
          <h1>Welcome!!</h1>
        </div>
        <div
          style={{
            height: '400px',
            backgroundImage: 'url(/home.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Carousel autoplay>
              <div>
                <h3 style={slideTextStyle}>Upload your prescription easily</h3>
              </div>
              <div>
                <h3 style={slideTextStyle}>Get quick quotes from pharmacies</h3>
              </div>
              <div>
                <h3 style={slideTextStyle}>Fast and safe home delivery</h3>
              </div>
            </Carousel>
          </div>
        </div>

       
      </Content>
    </Layout>
  );
};

export default Home;
