import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Breadcrumb } from 'antd';

import { HomeOutlined } from '@ant-design/icons';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";


import { RowsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/rows.css';

const { Title } = Typography;

const Gallery = () => {
  const { albumId } = useParams();
  const [index, setIndex] = useState(-1);

  // In a real app, this data would likely come from a shared source or API
  const albumsData = [
    { id: 1, title: 'Summer Reunion' },
    { id: 2, title: 'Winter Holidays' },
    { id: 3, title: 'Spring Picnic' },
    { id: 4, title: "Grandma's Birthday" },
  ];

  const currentAlbum = albumsData.find((album) => album.id === parseInt(albumId)) || { title: 'Gallery' };

  const photos = [
    { src: 'https://placehold.co/800x600', width: 800, height: 600 },
    { src: 'https://placehold.co/600x800', width: 600, height: 800 },
    { src: 'https://placehold.co/1200x800', width: 1200, height: 800 },
    // Add more photos as needed
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item><Link to="/albums"><HomeOutlined /> Albums</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{currentAlbum.title}</Breadcrumb.Item>
      </Breadcrumb>
      <Title level={2} style={{ marginBottom: '24px' }}>{currentAlbum.title}</Title>
      <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '8px', background: '#fff' }}>
        <RowsPhotoAlbum photos={photos} targetRowHeight={150} onClick={({ index }) => setIndex(index)} />

        <Lightbox
          slides={photos}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          // enable optional lightbox plugins
          plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        />
      </div>
    </div>
  );
};

export default Gallery;