import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [allPhotoFilenames, setAllPhotoFilenames] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // Number of photos to show initially
  const [albumTitle, setAlbumTitle] = useState('Gallery');
  const [error, setError] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]); // New state to hold all photo objects

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
          setAllPhotoFilenames(photoFilenames); // Store all filenames
        } else {
          setAllPhotoFilenames([]);
        }
      } catch (err) {
        setError('Could not load photos for this album. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [albumId]);

  useEffect(() => {
    // This effect creates the full list of photo objects once
    const allPhotoObjects = allPhotoFilenames.map(filename => {
      const encodedFilename = encodeURIComponent(filename);
      const imageUrl = getImageUrl(`albums/${albumId}/${encodedFilename}`);
      return {
        src: imageUrl,
        width: 800, // Placeholder width
        height: 600, // Placeholder height
      };
    });
    setAllPhotos(allPhotoObjects);
  }, [allPhotoFilenames, albumId]);

  useEffect(() => {
    // This effect updates the visible photos for the grid
    setPhotos(allPhotos.slice(0, visibleCount));
  }, [allPhotoFilenames, visibleCount, albumId]);

  const loadMoreRef = useRef(null);

  const handleLoadMore = useCallback(() => {
    // Prevent fetching more if all photos are already shown
    if (visibleCount < allPhotoFilenames.length) {
      setVisibleCount(prevCount => prevCount + 10); // Load 10 more photos
    }
  }, [visibleCount, allPhotoFilenames.length]);

  useEffect(() => {
    if (loading) return; // Don't set up observer until initial photos are loaded

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore(); // This will now only be called on user scroll
        }
      },
      { threshold: 1.0 } // Trigger when the element is fully in view
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleLoadMore, loading]);

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

          <div
            ref={loadMoreRef}
            style={{ height: '50px', visibility: allPhotoFilenames.length > photos.length ? 'visible' : 'hidden' }}
          />

          <Lightbox
            slides={allPhotos} // Pass all photos to the lightbox
            open={index >= 0}
            index={index}
            close={() => setIndex(-1)}
            plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
            on={{
              view: ({ index: currentIndex }) => {
                // If the user is viewing one of the last 3 loaded images, trigger load more
                if (currentIndex >= photos.length - 3) {
                  handleLoadMore();
                }
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
