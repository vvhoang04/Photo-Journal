# 📸 Photo Journal - Nhật ký ảnh

Ứng dụng chụp ảnh, chỉnh sửa và quản lý ảnh cá nhân được xây dựng bằng **React**, **Vite** và **Capacitor**.

---

## 📋 Mô tả dự án

Photo Journal là ứng dụng cho phép người dùng chụp ảnh, áp dụng bộ lọc, và lưu trữ ảnh cục bộ trên thiết bị.  
Ứng dụng hỗ trợ đa nền tảng: **Web, Android, iOS**.

---

## ✨ Tính năng chính

### 🎯 Yêu cầu cơ bản

| Tính năng | Mô tả |
|-----------|-------|
| 📷 **Chụp ảnh từ camera** | Hỗ trợ webcam trên máy tính và camera trên mobile |
| ✏️ **Nhập tiêu đề** | Đặt tên cho ảnh trước khi chụp |
| 💾 **Lưu trữ cục bộ** | Lưu ảnh và metadata vào Capacitor Preferences |
| 🖼️ **Gallery** | Hiển thị ảnh dạng lưới với tiêu đề và ngày chụp |
| 🔍 **Xem chi tiết** | Xem ảnh full size với đầy đủ thông tin |

### 🚀 Tính năng mở rộng

#### 🎨 Chỉnh sửa ảnh với bộ lọc

**7 Preset Filters:**
- 🔄 Gốc
- ⚫ Đen trắng
- 🟤 Sepia
- 📷 Vintage
- ❄️ Lạnh
- 🔥 Ấm
- 🎭 Kịch tính

**Tùy chỉnh thủ công:**
- ☀️ Độ sáng (0-200%)
- 🔆 Độ tương phản (0-200%)
- 🎨 Độ bão hòa (0-200%)
- ⚫ Grayscale (0-100%)
- 🟤 Sepia (0-100%)
- 🌀 Làm mờ (0-10px)
- 🌈 Xoay màu (0-360°)

#### 📱 Các tính năng khác
- ✏️ **Sửa tiêu đề**: Chỉnh sửa tiêu đề ảnh sau khi chụp  
- 🗑️ **Xóa ảnh**: Xóa ảnh với xác nhận  
- 📤 **Chia sẻ ảnh**: Sử dụng Web Share API / Capacitor Share API  
- 📅 **Hiển thị timestamp**: Ngày giờ chụp ảnh  

---

## 🛠️ Công nghệ sử dụng

Frontend: React 18, CSS3, Canvas API
Build Tool: Vite
Framework: Capacitor (Cross-platform)
Storage: Capacitor Preferences, Filesystem
Camera: Capacitor Camera API + WebRTC

### 📦 Capacitor Plugins

- `@capacitor/camera` - Truy cập camera  
- `@capacitor/filesystem` - Lưu trữ file  
- `@capacitor/preferences` - Lưu metadata  
- `@capacitor/share` - Chia sẻ ảnh  

---

## 📁 Cấu trúc dự án

photo-journal/
├── src/
│ ├── components/
│ │ ├── Gallery.jsx # Hiển thị danh sách ảnh dạng lưới
│ │ ├── Gallery.css
│ │ ├── PhotoDetail.jsx # Chi tiết ảnh + sửa/xóa
│ │ ├── PhotoDetail.css
│ │ ├── CameraButton.jsx # Nút chụp ảnh + modal nhập tiêu đề
│ │ ├── CameraButton.css
│ │ ├── ImageFilters.jsx # Modal chỉnh sửa ảnh với filters
│ │ └── ImageFilters.css
│ ├── services/
│ │ └── photoService.js # Logic xử lý camera, lưu/đọc ảnh
│ ├── App.jsx # Component chính
│ ├── App.css
│ └── main.jsx # Entry point
├── android/ # Capacitor Android project
├── ios/ # Capacitor iOS project
├── public/
├── .gitignore
├── README.md
├── package.json
├── vite.config.js
├── capacitor.config.json
└── index.html

## 🎯 Chi tiết các file quan trọng

### 📄 `photoService.js`
Quản lý tất cả logic liên quan đến ảnh:

| Function | Mô tả |
|----------|-------|
| `takePhoto()` | Chụp ảnh và lưu luôn |
| `takePhotoOnly()` | Chụp ảnh để áp dụng filter |
| `saveFilteredPhoto()` | Lưu ảnh đã chỉnh sửa |
| `getAllPhotos()` | Lấy danh sách ảnh |
| `deletePhoto()` | Xóa ảnh |
| `updatePhotoTitle()` | Cập nhật tiêu đề |

### 📄 `Gallery.jsx`
- Grid layout responsive  
- Hover effect với overlay hiển thị tiêu đề  
- Empty state khi chưa có ảnh  

### 📄 `PhotoDetail.jsx`
- Hiển thị ảnh full size  
- Chỉnh sửa tiêu đề inline  
- Nút chia sẻ và xóa  
- Hỗ trợ Web Share API  

### 📄 `ImageFilters.jsx`
- Canvas API để áp dụng filters  
- 7 preset filters  
- 7 thanh slider tùy chỉnh  
- Preview real-time  

### 📄 `CameraButton.jsx`
- Modal nhập tiêu đề  
- Tích hợp camera  
- Tự động mở modal filter sau khi chụp  

---

## 🚀 Hướng dẫn chạy

### Chạy trên Web (Development)

npm install
npm run dev
Mở trình duyệt tại http://localhost:5173

### Build cho Android

npm run build
npx cap sync android
npx cap open android

### Build cho iOS

npm run build
npx cap sync ios
npx cap open ios

### 🎨 UI/UX Features
Feature	Mô tả
🌈 Gradient Background	Màu tím đẹp mắt (#667eea → #764ba2)
✨ Smooth Animations	Fade in, slide up, hover effects
📱 Responsive Design	Hoạt động tốt trên mobile và desktop
📭 Empty State	Hướng dẫn rõ ràng khi chưa có ảnh
⏳ Loading States	Indicator khi đang xử lý
⚠️ Error Handling	Thông báo lỗi thân thiện

🔑 Điểm nổi bật
🎨 Bộ lọc ảnh chuyên nghiệp - 7 preset + tùy chỉnh thủ công

🌐 Cross-platform - Một code base chạy trên web, Android, iOS

📸 Camera preview - Xem trước camera trước khi chụp

💾 Offline-first - Tất cả dữ liệu lưu cục bộ

✨ Modern UI - Animations mượt, responsive design

📝 Ghi chú kỹ thuật
Platform	Camera API	Storage
Web	WebRTC API	Preferences (base64)
Mobile	Capacitor Camera	Filesystem + Preferences

Ảnh lưu dưới dạng base64 trong Preferences (web)

Ảnh lưu dưới dạng file trong Filesystem (mobile)

Hỗ trợ Web Share API cho trình duyệt hiện đại

📸 Screensh
1. Trang chủ
   ![image alt](https://github.com/vvhoang04/Photo-Journal/blob/a17776c09393f8d9c3de9b232f6ff8c5ef2f1afe/Trangchu.png)
2. Chụp ảnh
    ![image alt](https://github.com/vvhoang04/Photo-Journal/blob/38c16a6936a2726416af075d17da6de6aad98a7e/Ch%E1%BB%A5p-%E1%BA%A3nh.png)
3. Thêm tiêu đề
    ![image alt](https://github.com/vvhoang04/Photo-Journal/blob/a17776c09393f8d9c3de9b232f6ff8c5ef2f1afe/Trangchu.png)
4. Sửa tiêu đề
    ![image alt](https://github.com/vvhoang04/Photo-Journal/blob/a17776c09393f8d9c3de9b232f6ff8c5ef2f1afe/Trangchu.png)
5. Filter
     ![image alt](https://github.com/vvhoang04/Photo-Journal/blob/a17776c09393f8d9c3de9b232f6ff8c5ef2f1afe/Trangchu.png)
6. chia sẻ
     ![image alt](https://github.com/vvhoang04/Photo-Journal/blob/a17776c09393f8d9c3de9b232f6ff8c5ef2f1afe/Trangchu.png)










