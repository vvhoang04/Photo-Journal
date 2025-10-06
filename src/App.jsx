// src/App.jsx
import React, { useState, useEffect } from 'react';
import Gallery from './components/Gallery';
import PhotoDetail from './components/PhotoDetail';
import CameraButton from './components/CameraButton';
import { photoService } from './services/photoService';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load photos khi mount
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const loadedPhotos = await photoService.getAllPhotos();
      
      // Cập nhật webviewPath cho mỗi ảnh
      const photosWithPaths = await Promise.all(
        loadedPhotos.map(async (photo) => {
          const webviewPath = await photoService.getPhotoWebviewPath(photo.filepath);
          return { ...photo, webviewPath };
        })
      );
      
      setPhotos(photosWithPaths);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoTaken = async (newPhoto) => {
    setPhotos([newPhoto, ...photos]);
  };

  const handleDeletePhoto = async (photoId) => {
    await photoService.deletePhoto(photoId);
    setPhotos(photos.filter(p => p.id !== photoId));
  };

  const handleUpdateTitle = async (photoId, newTitle) => {
    await photoService.updatePhotoTitle(photoId, newTitle);
    setPhotos(photos.map(p => 
      p.id === photoId ? { ...p, title: newTitle } : p
    ));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto({ ...selectedPhoto, title: newTitle });
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📸 Photo Journal</h1>
        <p className="subtitle">Nhật ký ảnh của bạn</p>
      </header>

      <main className="app-content">
        {isLoading ? (
          <div className="loading">⏳ Đang tải...</div>
        ) : (
          <Gallery 
            photos={photos} 
            onPhotoClick={setSelectedPhoto}
          />
        )}
      </main>

      <CameraButton onPhotoTaken={handlePhotoTaken} />

      {selectedPhoto && (
        <PhotoDetail
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDelete={handleDeletePhoto}
          onUpdateTitle={handleUpdateTitle}
        />
      )}
    </div>
  );
}

export default App;