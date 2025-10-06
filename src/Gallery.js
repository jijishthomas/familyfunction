import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Breadcrumb, Spin, Alert } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { RowsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/rows.css';
import { fetchAlbumPhotos, getImageUrl } from './api'; // your helper functions

const { Title } = Typography;

const Gallery = () => {
  const { albumId } = useParams();
  const [index, setIndex] = useState(-1);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [albumTitle, setAlbumTitle] = useState('Gallery');
  const [error, setError] = useState(null);

  // Helper to make titles look nice (e.g., "prewedding" -> "Pre Wedding")
  const formatTitle = (id) =>
    id ? id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1') : 'Gallery';

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAlbumPhotos(albumId);

        let photoFilenames = [];
        if (data && Array.isArray(data.photos)) {
          photoFilenames = data.photos;
          setAlbumTitle(formatTitle(data.album));
        } else if (Array.isArray(data)) {
          // Fallback if the API returns a direct array of strings/objects
          photoFilenames = data;
        }

        if (photoFilenames.length > 0) {
          const formattedPhotos = photoFilenames.map(filename => {
            // URL-encode the filename to handle spaces and other special characters
            const encodedFilename = encodeURIComponent(filename);
            // Construct the full URL for the image
            const imageUrl = getImageUrl(`albums/${albumId}/${encodedFilename}`);
            return {
              src: imageUrl,
              width: 800, // Placeholder width
              height: 600, // Placeholder height
            };
          });
          setPhotos(formattedPhotos);
        } else {
          // If no photos are found, set an empty array
          setPhotos([]);
        }
      } catch (err) {
        setError('Could not load photos for this album. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [albumId]);

  return (
    <div style={{ padding: '24px 0' }}>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item><Link to="/albums"><HomeOutlined /> Albums</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{albumTitle}</Breadcrumb.Item>
      </Breadcrumb>
      <Title level={2} style={{ marginBottom: '24px' }}>{albumTitle}</Title>

      {loading && <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>}
      {error && <Alert message="Error" description={error} type="error" showIcon style={{ width: '100%' }} />}

      {!loading && !error && (
        <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '8px', background: '#fff' }}>
          {photos.length > 0 ? (
            <RowsPhotoAlbum
              photos={photos}
              targetRowHeight={150}    // controls thumbnail row height
              onClick={({ index }) => setIndex(index)}
            />
          ) : (
            <Alert message="This album is empty." type="info" showIcon />
          )}

          <Lightbox
            slides={photos}
            open={index >= 0}
            index={index}
            close={() => setIndex(-1)}
            plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
