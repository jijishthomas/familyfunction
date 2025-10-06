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
  const [error, setError] = useState(null);

  // Example album data for breadcrumb
  const albumsData = [
    { id: 1, title: 'Pre Wedding' },
    { id: 2, title: 'Post Wedding' },
    { id: 3, title: 'Wedding Ceremony' },
    { id: 4, title: 'Reception' },
  ];
  const currentAlbum = albumsData.find(album => album.id === parseInt(albumId)) || { title: 'Gallery' };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        // The API should return a complete array of photo objects.
        // Each object must have a pre-signed `src`, `width`, and `height`.
        // Example: [{ src: "https://...<pre-signed-url>...", width: 800, height: 600 }, ...]
        const data = await fetchAlbumPhotos(albumId);

        let photoFilenames = [];
        if (data && Array.isArray(data.photos)) {
          photoFilenames = data.photos;
        } else if (Array.isArray(data)) {
          // Fallback if the API returns a direct array of strings/objects
          photoFilenames = data;
        }

        if (photoFilenames.length > 0) {
          // Helper: try multiple encodings for a filename and pick the first URL that responds
          const resolveImageUrl = async (filename) => {
            const basePath = `albums/${albumId}`;

            // Candidate variants:
            const raw = getImageUrl(`${basePath}/${filename}`);
            const encoded = getImageUrl(`${basePath}/${encodeURIComponent(filename)}`);
            const plusSpaces = getImageUrl(`${basePath}/${filename.replace(/ /g, '+')}`);
            const encodedURI = getImageUrl(`${basePath}/${encodeURI(filename)}`);

            const candidates = [encoded, raw, plusSpaces, encodedURI];

            // Try HEAD on each candidate in order and return the first OK one.
            for (const url of candidates) {
              try {
                // Use HEAD to avoid downloading the full image. CORS may block this; ignore errors.
                const res = await fetch(url, { method: 'HEAD' });
                if (res && res.ok) return url;
              } catch (e) {
                // ignore and try next
                // console.debug(`HEAD failed for ${url}`, e);
              }
            }

            // If none succeeded (CORS or 404), fall back to the encoded URL which is the safest for paths
            return encoded;
          };

          const formattedPhotos = await Promise.all(
            photoFilenames.map(async (filename) => {
              const imageUrl = await resolveImageUrl(filename);
              return {
                src: imageUrl,
                width: 800,
                height: 600,
                key: filename,
              };
            })
          );

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
        <Breadcrumb.Item>{currentAlbum.title}</Breadcrumb.Item>
      </Breadcrumb>
      <Title level={2} style={{ marginBottom: '24px' }}>{currentAlbum.title}</Title>

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
