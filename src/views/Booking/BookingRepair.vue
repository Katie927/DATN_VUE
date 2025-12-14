<template>
  <div class="container">
    <div class="max-width-container">
      <!-- Header -->
      <div class="header">
        <div class="icon-badge">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 class="main-title">Đặt Lịch Bảo Hành & Sửa Chữa</h1>
        <p class="subtitle">Hãy để chúng tôi giúp bạn khôi phục điện thoại của bạn</p>
      </div>

      <!-- Main Content Card -->
      <div class="card">
        <!-- Step 1: Form Input -->
        <div v-if="currentStep === 1" class="step-content fade-in">
          <h2 class="step-title">Thông Tin Của Bạn</h2>

          <form @submit.prevent="validateAndProceed" class="form">
            <!-- Full Name -->
            <div class="form-group">
              <label class="label">Họ và Tên *</label>
              <input
                v-model="form.fullName"
                type="text"
                placeholder="Nhập họ và tên đầy đủ"
                class="input"
              />
              <p v-if="errors.fullName" class="error-text">{{ errors.fullName }}</p>
            </div>

            <!-- Phone Number -->
            <div class="form-group">
              <label class="label">Số Điện Thoại *</label>
              <input
                v-model="form.phoneNumber"
                type="tel"
                placeholder="Nhập số điện thoại (10 chữ số)"
                class="input"
              />
              <p v-if="errors.phoneNumber" class="error-text">{{ errors.phoneNumber }}</p>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label class="label">Email *</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="Nhập địa chỉ email"
                class="input"
              />
              <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
            </div>

            <!-- Phone Model -->
            <div class="form-group">
              <label class="label">Dòng Máy Cần Sửa *</label>
              <input
                v-model="form.phoneModel"
                type="text"
                placeholder="Ví dụ: iPhone 13 Pro, Samsung Galaxy A52"
                class="input"
              />
              <p v-if="errors.phoneModel" class="error-text">{{ errors.phoneModel }}</p>
            </div>

            <!-- Error Description -->
            <div class="form-group">
              <label class="label">Mô Tả Lỗi *</label>
              <textarea
                v-model="form.errorDescription"
                placeholder="Mô tả chi tiết lỗi hoặc vấn đề của điện thoại..."
                rows="4"
                class="input textarea"
              />
              <p v-if="errors.errorDescription" class="error-text">{{ errors.errorDescription }}</p>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="button button-primary">Tiếp Tục →</button>
          </form>
        </div>

        <!-- Step 2: Review -->
        <div v-else-if="currentStep === 2" class="step-content fade-in">
          <h2 class="step-title">Xác Nhận Thông Tin</h2>

          <div class="review-items">
            <div class="review-item">
              <p class="review-label">Họ và Tên</p>
              <p class="review-value">{{ form.fullName }}</p>
            </div>

            <div class="review-item">
              <p class="review-label">Số Điện Thoại</p>
              <p class="review-value">{{ form.phoneNumber }}</p>
            </div>

            <div class="review-item">
              <p class="review-label">Email</p>
              <p class="review-value">{{ form.email }}</p>
            </div>

            <div class="review-item">
              <p class="review-label">Dòng Máy</p>
              <p class="review-value">{{ form.phoneModel }}</p>
            </div>

            <div class="review-item">
              <p class="review-label">Mô Tả Lỗi</p>
              <p class="review-value">{{ form.errorDescription }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="button-group">
            <button @click="goBack" class="button button-secondary">← Quay Lại</button>
            <button @click="handlePlaceOrder" class="button button-primary">Đặt Lịch Ngay</button>
          </div>
        </div>

        <!-- Step 3: Success -->
        <div v-else-if="currentStep === 3" class="step-content fade-in success-content">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 class="success-title">Đặt Lịch Thành Công!</h2>
          <p class="success-subtitle">Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>

          <button @click="resetForm" class="button button-primary">Quay về trang chủ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const currentStep = ref(1)
const confirmationCode = ref('')

const form = ref({
  fullName: '',
  phoneNumber: '',
  email: '',
  phoneModel: '',
  errorDescription: '',
})

const errors = ref({
  fullName: '',
  phoneNumber: '',
  email: '',
  phoneModel: '',
  errorDescription: '',
})

const validateFullName = (name) => {
  if (!name || name.trim() === '') {
    return 'Vui lòng nhập họ và tên'
  }
  if (name.trim().length < 3) {
    return 'Họ và tên phải có ít nhất 3 ký tự'
  }
  return ''
}

const validatePhone = (phoneNumber) => {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return 'Vui lòng nhập số điện thoại'
  }
  if (!/^[0-9]{10}$/.test(phoneNumber.replace(/\s/g, ''))) {
    return 'Số điện thoại phải gồm 10 chữ số'
  }
  return ''
}

const validatePhoneModel = (model) => {
  if (!model || model.trim() === '') {
    return 'Vui lòng nhập dòng máy'
  }
  if (model.trim().length < 3) {
    return 'Dòng máy phải có ít nhất 3 ký tự'
  }
  return ''
}

const validateErrorDescription = (desc) => {
  if (!desc || desc.trim() === '') {
    return 'Vui lòng mô tả lỗi'
  }
  if (desc.trim().length < 10) {
    return 'Mô tả lỗi phải có ít nhất 10 ký tự'
  }
  return ''
}

const validateAndProceed = () => {
  errors.value = {
    fullName: validateFullName(form.value.fullName),
    phoneNumber: validatePhone(form.value.phoneNumber),
    // email: validateEmail(form.value.email),
    phoneModel: validatePhoneModel(form.value.phoneModel),
    errorDescription: validateErrorDescription(form.value.errorDescription),
  }

  const hasErrors = Object.values(errors.value).some((error) => error !== '')

  if (!hasErrors) {
    currentStep.value = 2
  }
}

const goBack = () => {
  currentStep.value = 1
}

const bookAppointment = () => {
  confirmationCode.value = 'BH' + Date.now().toString().slice(-8).toUpperCase()
  currentStep.value = 3
}

const handlePlaceOrder = async () => {
  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");

  try {
    // Gán danh sách sản phẩm đã chọn vào form
    const orderData = {
      type: 1,
      description: form.value.phoneModel + ' | ' + form.value.errorDescription,
      address: form.value.address,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      items: []
    };

    console.log("Order data gửi lên:", JSON.stringify(orderData, null, 2));
    const response = await axios.post(
      'http://localhost:8080/bej3/cart/place-order',
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    bookAppointment();
    alert('Đặt lịch thành công!');
  } catch (error) {
    console.error('Lỗi khi đặt hàng:', error);
    alert('Không thể đặt hàng!');
  }
};

const resetForm = () => {
  form.value = {
    fullName: '',
    phoneNumber: '',
    email: '',
    phoneModel: '',
    errorDescription: '',
  }
  errors.value = {
    fullName: '',
    phoneNumber: '',
    email: '',
    phoneModel: '',
    errorDescription: '',
  }
  currentStep.value = 1
  confirmationCode.value = ''
}
</script>

<style scoped>
/* Complete CSS styling without external dependencies */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e8eef7 100%);
  padding: 48px 16px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    sans-serif;
}

.max-width-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: 48px;
}

.icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #2563eb;
  border-radius: 50%;
  margin-bottom: 16px;
}

.icon {
  width: 24px;
  height: 24px;
  color: white;
  stroke: currentColor;
  stroke-width: 2;
}

.main-title {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #64748b;
}

/* Card Styles */
.card {
  background-color: white;
  border-radius: 16px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  padding: 32px;
}

.step-content {
  animation: fadeIn 0.3s ease-out;
}

.step-title {
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 32px;
}

/* Form Styles */
.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.3s ease;
  color: #1e293b;
}

.input::placeholder {
  color: #cbd5e1;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input.textarea {
  resize: none;
  min-height: 100px;
}

.error-text {
  font-size: 14px;
  color: #dc2626;
  margin-top: 4px;
}

/* Button Styles */
.button {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.button-primary {
  background-color: #2563eb;
  color: white;
  width: 100%;
}

.button-primary:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
}

.button-primary:active {
  transform: translateY(0);
}

.button-secondary {
  background-color: #e2e8f0;
  color: #1e293b;
}

.button-secondary:hover {
  background-color: #cbd5e1;
}

/* Review Section */
.review-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.review-item {
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.review-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 600;
}

.review-value {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  word-break: break-word;
}

.button-group {
  display: flex;
  gap: 16px;
}

.button-group .button {
  flex: 1;
}

/* Success Section */
.success-content {
  text-align: center;
}

.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background-color: #dcfce7;
  border-radius: 50%;
  margin-bottom: 16px;
}

.success-icon svg {
  width: 32px;
  height: 32px;
  color: #16a34a;
  stroke: currentColor;
  stroke-width: 2;
}

.success-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.success-subtitle {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 32px;
}

.confirmation-box {
  background-color: #eff6ff;
  border: 2px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
}

.confirmation-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.confirmation-code {
  font-size: 28px;
  font-weight: 700;
  color: #2563eb;
  letter-spacing: 2px;
}

/* Footer */
.footer {
  text-align: center;
  margin-top: 32px;
  font-size: 14px;
  color: #64748b;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .card {
    padding: 24px;
  }

  .main-title {
    font-size: 28px;
  }

  .step-title {
    font-size: 24px;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group .button {
    width: 100%;
  }
}
</style>
