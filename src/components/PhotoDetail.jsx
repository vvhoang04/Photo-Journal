// src/components/PhotoDetail.jsx
import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import './PhotoDetail.css';

const PhotoDetail = ({ photo, onClose, onDelete, onUpdateTitle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(photo.title);
  const isWeb = Capacitor.getPlatform() === 'web';

  const handleSave = () => {
    if (newTitle.trim()) {
      onUpdateTitle(photo.id, newTitle.trim());
      setIsEditing(false);
    }
  };

  const handleShare = async () => {
    try {
      if (isWeb) {
        // Sử dụng Web Share API cho trình duyệt
        if (navigator.share) {
          // Convert base64 sang blob
          const response = await fetch(photo.webviewPath);
          const blob = await response.blob();
          const file = new File([blob], `${photo.title}.jpg`, { type: 'image/jpeg' });
          
          await navigator.share({
            title: photo.title,
            text: photo.title,
            files: [file]
          });
        } else {
          // Fallback: Download ảnh
          downloadImage(photo.webviewPath, photo.title);
          alert('Trình duyệt không hỗ trợ chia sẻ. Ảnh đã được tải xuống!');
        }
      } else {
        // Sử dụng Capacitor Share cho mobile
        const { Share } = await import('@capacitor/share');
        await Share.share({
          title: photo.title,
          text: photo.title,
          url: photo.webviewPath,
          dialogTitle: 'Chia sẻ ảnh'
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        alert('Lỗi khi chia sẻ: ' + error.message);
      }
    }
  };

  // Hàm download ảnh (fallback cho trình duyệt không hỗ trợ share)
  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa ảnh này?')) {
      onDelete(photo.id);
      onClose();
    }
  };

  return (
    <div className="photo-detail-overlay" onClick={onClose}>
      <div className="photo-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <img src={photo.webviewPath} alt={photo.title} />
        
        <div className="photo-info">
          {isEditing ? (
            <div className="edit-title">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Nhập tiêu đề"
                autoFocus
              />
              <button onClick={handleSave}>Lưu</button>
              <button onClick={() => setIsEditing(false)}>Hủy</button>
            </div>
          ) : (
            <div className="title-section">
              <h2>{photo.title}</h2>
              <button onClick={() => setIsEditing(true)}>✏️ Sửa</button>
            </div>
          )}
          
          <p className="date">
            📅 {new Date(photo.createdAt).toLocaleString('vi-VN')}
          </p>
          
          <div className="actions">
            <button onClick={handleShare} className="share-btn">
              📤 Chia sẻ
            </button>
            <button onClick={handleDelete} className="delete-btn">
              🗑️ Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;