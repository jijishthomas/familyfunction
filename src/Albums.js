import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Row, Col } from 'antd';

const { Title } = Typography;

const Albums = () => {
  const albumsData = [
    { id: 1, title: 'Summer Reunion', cover: 'https://placehold.co/600x400/00b96b/white?text=Summer' },
    { id: 2, title: 'Winter Holidays', cover: 'https://placehold.co/600x400/0050b3/white?text=Winter' },
    { id: 3, title: 'Spring Picnic', cover: 'https://placehold.co/600x400/7cb305/white?text=Spring' },
    { id: 4, title: 'Grandma\'s Birthday', cover: 'https://placehold.co/600x400/d4380d/white?text=Birthday' },
    // Add more albums as needed
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        Shijo & Serin's Marriage Function
      </Title>
      <Row gutter={[24, 24]}>
        {albumsData.map((album) => (
          <Col xs={24} sm={12} md={8} lg={6} key={album.id}>
            <Card
              hoverable
              cover={<img alt={album.title} src={album.cover} style={{ height: 180, objectFit: 'cover' }} />}
              actions={[
                <Link to={`/gallery/${album.id}`} key="view">
                  View Album
                </Link>,
              ]}
            >
              <Card.Meta title={album.title} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Albums;