import React, { useState } from 'react';
import ImageFilters from './ImageFilters';
import { photoService } from '../services/photoService';
import './CameraButton.css';

const CameraButton = ({ onPhotoTaken }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [pendingTitle, setPendingTitle] = useState('');

  const handleTakePhoto = async () => {
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowModal(false); // Đóng modal trước khi chụp
    
    try {
      // Chụp ảnh (camera sẽ tự mở)
      const photo = await photoService.takePhotoOnly();
      
      // Lưu ảnh và tiêu đề tạm thời
      setCapturedImage(photo.webviewPath);
      setPendingTitle(title || 'Untitled');
      setTitle('');
      
      // Mở modal filter
      setShowFilters(true);
    } catch (error) {
      if (error.message !== 'Đã hủy chụp ảnh') {
        alert('Lỗi khi chụp ảnh: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = async (filteredImage) => {
    try {
      // Lưu ảnh đã filter
      const newPhoto = await photoService.saveFilteredPhoto(filteredImage, pendingTitle);
      onPhotoTaken(newPhoto);
      
      // Reset states
      setCapturedImage(null);
      setPendingTitle('');
      setShowFilters(false);
    } catch (error) {
      alert('Lỗi khi lưu ảnh: ' + error.message);
    }
  };

  const handleSkipFilter = async () => {
    try {
      // Lưu ảnh gốc không filter
      const newPhoto = await photoService.saveFilteredPhoto(capturedImage, pendingTitle);
      onPhotoTaken(newPhoto);
      
      // Reset states
      setCapturedImage(null);
      setPendingTitle('');
      setShowFilters(false);
    } catch (error) {
      alert('Lỗi khi lưu ảnh: ' + error.message);
    }
  };

  return (
    <>
      <button className="camera-fab" onClick={handleTakePhoto}>
        📷
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Chụp ảnh mới</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nhập tiêu đề (tùy chọn)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
              <div className="modal-actions">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="primary-btn"
                >
                  {isLoading ? '⏳ Đang xử lý...' : '📸 Chụp'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  disabled={isLoading}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFilters && capturedImage && (
        <ImageFilters
          isOpen={showFilters}
          imageData={capturedImage}
          onClose={handleSkipFilter}
          onApply={handleApplyFilter}
        />
      )}
    </>
  );
};

export default CameraButton;