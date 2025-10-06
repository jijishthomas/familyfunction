import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Row, Col, Spin, Alert } from 'antd';
import { fetchAlbums } from './api';

const { Title } = Typography;

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to make titles look nice (e.g., "prewedding" -> "Pre Wedding")
  const formatTitle = (id) =>
    id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1');

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        setLoading(true);
        const data = await fetchAlbums();
        // The API returns { albums: ["id1", "id2"] }. We need to transform it.
        if (data && Array.isArray(data.albums)) {
          const formattedAlbums = data.albums.map((albumId) => ({
            id: albumId,
            title: formatTitle(albumId),
            // The cover URL will now need to be constructed or returned by the API.
            // For now, we can use a placeholder.
            cover: `https://placehold.co/600x400/00b96b/white?text=${formatTitle(albumId)}`,
          }));
          setAlbums(formattedAlbums);
        } else {
          // Handle cases where the response is not in the expected format
          throw new Error("Received invalid album data from the server.");
        }
      } catch (err) {
        setError('Could not load albums. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadAlbums();
  }, []);

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        Photo Albums
      </Title>
      <Row gutter={[24, 24]}>
        {loading && <div style={{ width: '100%', textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>}
        {error && <Alert message="Error" description={error} type="error" showIcon style={{ width: '100%' }} />}
        {!loading && !error && albums.map((album) => (
          <Col xs={24} sm={12} md={8} lg={6} key={album.id}>
            <Link to={`/gallery/${album.id}`}>
              <Card
                hoverable
                cover={<img alt={album.title} src={album.cover} style={{ height: 180, objectFit: 'cover' }} />}
              >
                <Card.Meta title={album.title} />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Albums;