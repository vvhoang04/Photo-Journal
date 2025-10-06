// src/components/ImageFilters.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ImageFilters.css';

const ImageFilters = ({ isOpen, imageData, onClose, onApply }) => {
  const canvasRef = useRef(null);
  const [originalImage, setOriginalImage] = useState(imageData);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hueRotate: 0
  });

  const presetFilters = {
    normal: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, blur: 0, hueRotate: 0 },
    grayscale: { brightness: 100, contrast: 100, saturate: 0, grayscale: 100, sepia: 0, blur: 0, hueRotate: 0 },
    sepia: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 100, blur: 0, hueRotate: 0 },
    vintage: { brightness: 110, contrast: 120, saturate: 80, grayscale: 0, sepia: 40, blur: 0, hueRotate: 0 },
    cool: { brightness: 105, contrast: 100, saturate: 120, grayscale: 0, sepia: 0, blur: 0, hueRotate: 180 },
    warm: { brightness: 110, contrast: 100, saturate: 120, grayscale: 0, sepia: 0, blur: 0, hueRotate: 30 },
    dramatic: { brightness: 90, contrast: 150, saturate: 80, grayscale: 0, sepia: 0, blur: 0, hueRotate: 0 },
  };

  useEffect(() => {
    if (isOpen && imageData) {
      setOriginalImage(imageData);
      setTimeout(() => applyFilters(), 100);
    }
  }, [filters, isOpen, imageData]);

  const applyFilters = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.filter = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturate}%)
        grayscale(${filters.grayscale}%)
        sepia(${filters.sepia}%)
        blur(${filters.blur}px)
        hue-rotate(${filters.hueRotate}deg)
      `;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    
    img.src = originalImage;
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: parseFloat(value)
    }));
  };

  const applyPreset = (presetName) => {
    setFilters(presetFilters[presetName]);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    const filteredImage = canvas.toDataURL('image/jpeg', 0.9);
    onApply(filteredImage);
    onClose();
  };

  const handleReset = () => {
    setFilters(presetFilters.normal);
  };

  if (!isOpen) return null;

  return (
    <div className="filter-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filter-header">
          <h2>🎨 Chỉnh sửa ảnh</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="filter-content">
          <div className="filter-preview">
            <canvas ref={canvasRef} />
          </div>

          <div className="filter-controls">
            <div className="preset-filters">
              <h3>Bộ lọc có sẵn</h3>
              <div className="preset-grid">
                {Object.keys(presetFilters).map(preset => (
                  <button
                    key={preset}
                    className="preset-btn"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset === 'normal' ? '🔄 Gốc' :
                     preset === 'grayscale' ? '⚫ Đen trắng' :
                     preset === 'sepia' ? '🟤 Sepia' :
                     preset === 'vintage' ? '📷 Vintage' :
                     preset === 'cool' ? '❄️ Lạnh' :
                     preset === 'warm' ? '🔥 Ấm' :
                     '🎭 Kịch tính'}
                  </button>
                ))}
              </div>
            </div>

            <div className="manual-controls">
              <h3>Tùy chỉnh</h3>
              
              <div className="control-item">
                <label>☀️ Độ sáng: {filters.brightness}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.brightness}
                  onChange={(e) => handleFilterChange('brightness', e.target.value)}
                />
              </div>

              <div className="control-item">
                <label>🔆 Độ tương phản: {filters.contrast}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.contrast}
                  onChange={(e) => handleFilterChange('contrast', e.target.value)}
                />
              </div>

              <div className="control-item">
                <label>🎨 Độ bão hòa: {filters.saturate}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.saturate}
                  onChange={(e) => handleFilterChange('saturate', e.target.value)}
                />
              </div>

              <div className="control-item">
                <label>⚫ Đen trắng: {filters.grayscale}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.grayscale}
                  onChange={(e) => handleFilterChange('grayscale', e.target.value)}
                />
              </div>

              <div className="control-item">
                <label>🟤 Sepia: {filters.sepia}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.sepia}
                  onChange={(e) => handleFilterChange('sepia', e.target.value)}
                />
              </div>

              <div className="control-item">
                <label>🌀 Làm mờ: {filters.blur}px</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={filters.blur}
                  onChange={(e) => handleFilterChange('blur', e.target.value)}
                />
              </div>

              <div className="control-item">
                <label>🌈 Xoay màu: {filters.hueRotate}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={filters.hueRotate}
                  onChange={(e) => handleFilterChange('hueRotate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button className="reset-btn" onClick={handleReset}>
            🔄 Đặt lại
          </button>
          <button className="cancel-btn" onClick={onClose}>
            ❌ Hủy
          </button>
          <button className="apply-btn" onClick={handleApply}>
            ✅ Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageFilters;