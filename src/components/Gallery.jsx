// src/components/Gallery.jsx
import React from 'react';
import './Gallery.css';

const Gallery = ({ photos, onPhotoClick }) => {
  if (photos.length === 0) {
    return (
      <div className="empty-state">
        <p>📷 Chưa có ảnh nào</p>
        <p className="empty-hint">Nhấn nút camera để chụp ảnh đầu tiên</p>
      </div>
    );
  }

  return (
    <div className="gallery">
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          className="gallery-item"
          onClick={() => onPhotoClick(photo)}
        >
          <img 
            src={photo.webviewPath} 
            alt={photo.title}
            loading="lazy"
          />
          <div className="photo-overlay">
            <h3>{photo.title}</h3>
            <p>{new Date(photo.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;