<template>
  <div class="admin-container">
    <main class="admin-main">
      <div class="header-content">
        <h1>Quản Lý Slideshow</h1>
        <p class="header-subtitle">Chọn và sắp xếp các ảnh hiển thị trên trang chủ</p>
      </div>
      <!-- Khu vực upload và thêm ảnh -->
      <section class="upload-section">
        <div class="upload-card">
          <div
            class="upload-area"
            @click="triggerFileInput"
            :class="{ 'drag-over': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h3>Kéo thả hoặc click để thêm ảnh</h3>
            <p>Hỗ trợ JPG, PNG (tối đa 5MB)</p>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept="image/*"
              style="display: none"
              multiple
            />
          </div>
        </div>
      </section>

      <!-- Danh sách ảnh đã chọn -->
      <section class="images-section">
        <div class="section-header">
          <h2>Các ảnh đã chọn ({{ selectedImages.length }})</h2>
          <button v-if="selectedImages.length > 0" class="btn-clear" @click="clearAllImages">
            Xóa tất cả
          </button>
        </div>

        <div v-if="selectedImages.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <p>Chưa có ảnh nào được chọn</p>
          <small>Thêm ảnh bằng cách kéo thả hoặc click nút phía trên</small>
        </div>

        <div v-else class="images-grid">
          <div v-for="(image, index) in selectedImages" :key="index" class="image-card">
            <div class="image-wrapper">
              <img :src="image.preview" :alt="`Slide ${index + 1}`" />
              <div class="image-overlay">
                <button class="btn-icon remove" @click="removeImage(index)" title="Xóa">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div class="image-info">
              <p class="image-name">{{ image.name }}</p>
              <p class="image-size">{{ formatFileSize(image.size) }}</p>
              <input
                v-model="image.link"
                type="text"
                class="image-link-input"
                placeholder="Link khi click (tùy chọn)"
              />
            </div>
            <div class="image-order">
              <button
                @click="moveImage(index, -1)"
                :disabled="index === 0"
                class="btn-small"
                title="Di chuyển lên"
              >
                ↑
              </button>
              <span>{{ index + 1 }}</span>
              <button
                @click="moveImage(index, 1)"
                :disabled="index === selectedImages.length - 1"
                class="btn-small"
                title="Di chuyển xuống"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Preview slideshow -->
      <section class="preview-section">
        <h2>Xem Trước</h2>
        <div class="preview-container">
          <div v-if="selectedImages.length === 0" class="preview-empty">
            <p>Chưa có ảnh để xem trước</p>
          </div>
          <div v-else class="preview-slider">
            <div class="slide-wrapper">
              <img
                :src="selectedImages[currentPreviewIndex].preview"
                :alt="selectedImages[currentPreviewIndex].name"
              />
            </div>
            <div class="slide-controls">
              <button @click="prevSlide" class="btn-nav">←</button>
              <span class="slide-counter"
                >{{ currentPreviewIndex + 1 }} / {{ selectedImages.length }}</span
              >
              <button @click="nextSlide" class="btn-nav">→</button>
            </div>
            <div class="slide-dots">
              <button
                v-for="(_, index) in selectedImages"
                :key="index"
                :class="['dot', { active: index === currentPreviewIndex }]"
                @click="currentPreviewIndex = index"
              ></button>
            </div>
          </div>
        </div>
      </section>

      <!-- Nút hành động -->
      <section class="actions-section">
        <button v-if="selectedImages.length > 0" class="btn-primary" @click="saveChanges">
          💾 Lưu Thay Đổi
        </button>
        <button v-if="selectedImages.length > 0" class="btn-secondary" @click="exportData">
          📥 Xuất Dữ Liệu
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const isDragging = ref(false)
const selectedImages = ref([])
const currentPreviewIndex = ref(0)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  addImages(files)
  event.target.value = ''
}

const handleDrop = (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files).filter((file) =>
    file.type.startsWith('image/'),
  )
  addImages(files)
}

const addImages = (files) => {
  files.forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`Ảnh ${file.name} quá lớn (tối đa 5MB)`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImages.value.push({
        name: file.name,
        size: file.size,
        preview: e.target.result,
        link: '',
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
  if (currentPreviewIndex.value >= selectedImages.value.length) {
    currentPreviewIndex.value = Math.max(0, selectedImages.value.length - 1)
  }
}

const clearAllImages = () => {
  if (confirm('Bạn chắc chắn muốn xóa tất cả ảnh?')) {
    selectedImages.value = []
    currentPreviewIndex.value = 0
  }
}

const moveImage = (index, direction) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < selectedImages.value.length) {
    ;[selectedImages.value[index], selectedImages.value[newIndex]] = [
      selectedImages.value[newIndex],
      selectedImages.value[index],
    ]
    if (currentPreviewIndex.value === index) {
      currentPreviewIndex.value = newIndex
    }
  }
}

const nextSlide = () => {
  currentPreviewIndex.value = (currentPreviewIndex.value + 1) % selectedImages.value.length
}

const prevSlide = () => {
  currentPreviewIndex.value =
    (currentPreviewIndex.value - 1 + selectedImages.value.length) % selectedImages.value.length
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const saveChanges = () => {
  const data = selectedImages.value.map((img) => ({
    url: img.preview,
    link: img.link || '',
  }))
  console.log('Dữ liệu slideshow:', data)
  localStorage.setItem('sliderImages', JSON.stringify(data))
  alert('Lưu thay đổi thành công!')
}

const exportData = () => {
  const data = selectedImages.value.map((img) => ({
    url: img.preview,
    link: img.link || '',
  }))
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'slider-images.json'
  link.click()
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.admin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f9fc 0%, #e8f4f8 100%);
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.header-content {
  max-width: 100%;
  margin-top: -20px;
  padding: 1rem;
  color: #009981;
}

.admin-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 400;
}

.admin-main {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

/* Upload Section */
.upload-section {
  margin-bottom: 2.5rem;
}

.upload-card {
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.upload-area {
  padding: 2.5rem;
  border: 2px dashed #0066cc;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f0f7ff;
}

.upload-area.drag-over {
  border-color: #0052a3;
  background: #e6f2ff;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #0066cc;
  margin-bottom: 1rem;
  stroke-width: 1.5;
}

.upload-area h3 {
  font-size: 1.1rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.upload-area p {
  color: #666;
  font-size: 0.9rem;
}

/* Images Section */
.images-section {
  margin-bottom: 2.5rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.section-header h2 {
  font-size: 1.3rem;
  color: #1a1a1a;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #999;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  opacity: 0.3;
  stroke-width: 1.5;
}

.empty-state p {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #666;
}

.empty-state small {
  color: #999;
  font-size: 0.85rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.image-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #f9f9f9;
}

.image-card:hover {
  border-color: #0066cc;
  box-shadow: 0 4px 16px rgba(0, 102, 204, 0.12);
  transform: translateY(-4px);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 66.67%;
  overflow: hidden;
  background: #f0f0f0;
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.btn-icon {
  background: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-icon:hover {
  background: #ff4444;
  color: white;
  transform: scale(1.1);
}

.btn-icon svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.image-info {
  padding: 1rem;
}

.image-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-size {
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 0.75rem;
}

.image-link-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: inherit;
  transition: all 0.2s ease;
  margin-bottom: 0.75rem;
}

.image-link-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.image-order {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.btn-small {
  background: #f0f0f0;
  border: 1px solid #ddd;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
  transition: all 0.2s ease;
  min-width: 32px;
}

.btn-small:hover:not(:disabled) {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}

.btn-small:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Preview Section */
.preview-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 2.5rem;
}

.preview-section h2 {
  font-size: 1.3rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.preview-container {
  border-radius: 12px;
  overflow: hidden;
  background: #f9f9f9;
  min-height: 350px;
}

.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
  color: #999;
}

.preview-slider {
  position: relative;
}

.slide-wrapper {
  width: 100%;
  height: 350px;
  overflow: hidden;
  background: #f0f0f0;
}

.slide-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.slide-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.btn-nav {
  background: #0066cc;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-nav:hover {
  background: #0052a3;
  transform: scale(1.05);
}

.slide-counter {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

.slide-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #ddd;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dot.active {
  background: #0066cc;
  border-color: #0066cc;
}

.dot:hover {
  border-color: #0066cc;
}

/* Actions Section */
.actions-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary,
.btn-clear {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-primary {
  background: #0066cc;
  color: white;
}

.btn-primary:hover {
  background: #0052a3;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
  transform: translateY(-2px);
}

.btn-secondary {
  background: #e8f4f8;
  color: #0066cc;
  border: 1px solid #0066cc;
}

.btn-secondary:hover {
  background: #d0e8f0;
}

.btn-clear {
  background: transparent;
  color: #ff4444;
  font-size: 0.9rem;
  padding: 0.4rem 1rem;
  border: 1px solid #ff4444;
}

.btn-clear:hover {
  background: #fff0f0;
}

@media (max-width: 768px) {
  .admin-header {
    padding: 1.5rem 1rem;
  }

  .admin-header h1 {
    font-size: 1.5rem;
  }

  .admin-main {
    padding: 1rem;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }

  .upload-area {
    padding: 1.5rem;
  }

  .slide-controls {
    gap: 1rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .images-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .slide-controls {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
