// src/services/photoService.js
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const PHOTOS_KEY = 'photos';
const isWeb = Capacitor.getPlatform() === 'web';

// ========== CHỤP ẢNH VÀ LƯU LUÔN ==========

async function takePhoto(title) {
  try {
    if (isWeb) {
      return await takePhotoWithWebcam(title);
    } else {
      const { Camera } = await import('@capacitor/camera');
      return await takePhotoMobile(title, Camera);
    }
  } catch (error) {
    console.error('Error taking photo:', error);
    throw error;
  }
}

async function takePhotoWithWebcam(title) {
  return new Promise((resolve, reject) => {
    const modal = createCameraModal();
    const { video, canvas, stream, cleanup } = setupCamera(modal);

    const captureBtn = modal.querySelector('.capture-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    captureBtn.onclick = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const base64Data = canvas.toDataURL('image/jpeg', 0.9);
      cleanup();

      const newPhoto = {
        id: new Date().getTime().toString(),
        filepath: `photo_${new Date().getTime()}.jpg`,
        webviewPath: base64Data,
        title: title || 'Untitled',
        createdAt: new Date().toISOString()
      };

      addPhotoToStorage(newPhoto).then(() => resolve(newPhoto));
    };

    cancelBtn.onclick = () => {
      cleanup();
      reject(new Error('Đã hủy chụp ảnh'));
    };
  });
}

// ========== CHỤP ẢNH NHƯNG CHƯA LƯU (ĐỂ FILTER) ==========

async function takePhotoOnly(title) {
  try {
    if (isWeb) {
      return await takePhotoWebOnly();
    } else {
      const { Camera } = await import('@capacitor/camera');
      return await takePhotoMobileOnly(Camera);
    }
  } catch (error) {
    console.error('Error taking photo:', error);
    throw error;
  }
}

async function takePhotoWebOnly() {
  return new Promise((resolve, reject) => {
    const modal = createCameraModal();
    const { video, canvas, cleanup } = setupCamera(modal);

    const captureBtn = modal.querySelector('.capture-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    captureBtn.onclick = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const base64Data = canvas.toDataURL('image/jpeg', 0.9);
      cleanup();

      resolve({
        webviewPath: base64Data,
        timestamp: new Date().getTime()
      });
    };

    cancelBtn.onclick = () => {
      cleanup();
      reject(new Error('Đã hủy chụp ảnh'));
    };
  });
}

// ========== TẠO MODAL CAMERA ==========

function createCameraModal() {
  const modal = document.createElement('div');
  modal.innerHTML = `
    <style>
      .camera-modal {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .camera-video {
        max-width: 90%;
        max-height: 70vh;
        border-radius: 12px;
        background: #000;
      }
      .camera-controls {
        margin-top: 20px;
        display: flex;
        gap: 15px;
      }
      .camera-btn {
        padding: 15px 30px;
        font-size: 18px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
      }
      .capture-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .cancel-btn {
        background: #e0e0e0;
        color: #333;
      }
    </style>
    <div class="camera-modal">
      <video class="camera-video" autoplay></video>
      <canvas style="display: none;"></canvas>
      <div class="camera-controls">
        <button class="camera-btn capture-btn">📸 Chụp ảnh</button>
        <button class="camera-btn cancel-btn">❌ Hủy</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  return modal;
}

function setupCamera(modal) {
  const video = modal.querySelector('.camera-video');
  const canvas = modal.querySelector('canvas');
  let stream = null;

  navigator.mediaDevices.getUserMedia({ 
    video: { 
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      facingMode: 'user'
    } 
  })
  .then(mediaStream => {
    stream = mediaStream;
    video.srcObject = stream;
  })
  .catch(err => {
    document.body.removeChild(modal);
    throw new Error('Không thể truy cập camera: ' + err.message);
  });

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    document.body.removeChild(modal);
  };

  return { video, canvas, stream, cleanup };
}

// ========== LƯU ẢNH ĐÃ FILTER ==========

async function saveFilteredPhoto(imageData, title) {
  const newPhoto = {
    id: new Date().getTime().toString(),
    filepath: `photo_${new Date().getTime()}.jpg`,
    webviewPath: imageData,
    title: title || 'Untitled',
    createdAt: new Date().toISOString()
  };

  await addPhotoToStorage(newPhoto);
  return newPhoto;
}

// ========== MOBILE FUNCTIONS ==========

async function takePhotoMobile(title, Camera) {
  const photo = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: 'Uri',
    source: 'CAMERA'
  });

  const fileName = `photo_${new Date().getTime()}.${photo.format}`;
  const { Filesystem, Directory } = await import('@capacitor/filesystem');
  
  let base64Data;
  if (photo.path) {
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    base64Data = await convertBlobToBase64(blob);
  } else {
    base64Data = photo.base64String;
  }

  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data
  });

  const fileUri = await Filesystem.getUri({
    directory: Directory.Data,
    path: fileName
  });

  const newPhoto = {
    id: new Date().getTime().toString(),
    filepath: fileName,
    webviewPath: fileUri.uri,
    title: title || 'Untitled',
    createdAt: new Date().toISOString()
  };

  await addPhotoToStorage(newPhoto);
  return newPhoto;
}

async function takePhotoMobileOnly(Camera) {
  const photo = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: 'Uri',
    source: 'CAMERA'
  });

  return {
    webviewPath: photo.webPath,
    timestamp: new Date().getTime()
  };
}

function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// ========== STORAGE FUNCTIONS ==========

async function addPhotoToStorage(photo) {
  const photos = await getAllPhotos();
  photos.unshift(photo);
  await Preferences.set({
    key: PHOTOS_KEY,
    value: JSON.stringify(photos)
  });
}

async function getAllPhotos() {
  const { value } = await Preferences.get({ key: PHOTOS_KEY });
  return value ? JSON.parse(value) : [];
}

async function deletePhoto(photoId) {
  const photos = await getAllPhotos();
  const updatedPhotos = photos.filter(p => p.id !== photoId);
  await Preferences.set({
    key: PHOTOS_KEY,
    value: JSON.stringify(updatedPhotos)
  });
}

async function updatePhotoTitle(photoId, newTitle) {
  const photos = await getAllPhotos();
  const photoIndex = photos.findIndex(p => p.id === photoId);
  
  if (photoIndex !== -1) {
    photos[photoIndex].title = newTitle;
    await Preferences.set({
      key: PHOTOS_KEY,
      value: JSON.stringify(photos)
    });
  }
}

async function getPhotoWebviewPath(filepath) {
  return filepath;
}

// ========== EXPORT ==========

export const photoService = {
  takePhoto,
  takePhotoOnly,
  saveFilteredPhoto,
  getAllPhotos,
  deletePhoto,
  updatePhotoTitle,
  getPhotoWebviewPath
};