<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div>
          <h1 class="header-title">Đơn hàng đã đặt</h1>
          <p class="header-sub">Quản lý và theo dõi các đơn hàng của bạn</p>
        </div>

        <div class="header-right">
          <div class="order-counter">
            <span class="bell">🔔</span>
            <span class="order-count">{{ orders.length }} đơn</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Filter -->
      <div class="filter-wrapper">
        <button
          v-for="status in ['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Hoàn thành']"
          :key="status"
          @click="filterStatus = status === 'Tất cả' ? null : status"
          :class="[
            'filter-btn',
            (!filterStatus && status === 'Tất cả') || filterStatus === status
              ? 'filter-btn-active'
              : '',
          ]"
        >
          {{ status }}
        </button>
      </div>

      <!-- Orders -->
      <div v-if="filteredOrders.length > 0" class="orders-grid">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          @click="selectOrder(order)"
          class="order-card"
        >
          <div class="order-inner">
            <div class="order-top">
              <div>
                <h3 class="order-number">{{ order.orderNumber }}</h3>
                <p class="order-date">{{ formatDate(order.orderAt) }}</p>
              </div>
              <div :class="['modal-status', getStatusColor(order.type)]">
                {{ order.type === 0 ? 'Mua bán' : 'Sửa chữa' }}
              </div>

              <div :class="['order-status', getStatusColor(order.status)]">
                {{
                  {
                    0: 'Chờ xử lý',
                    1: 'Chờ xác nhận',
                    2: 'Đã xác nhận',
                    3: 'Đang xử lý',
                    4: 'Đã hủy',
                    5: 'Hoàn thành',
                  }[order.status] || 'Không xác định'
                }}
              </div>
            </div>

            <div class="order-items-box">
              <p v-for="(item, index) in order.orderItems" :key="index" class="order-item-name">
                • {{ item.productName + ' - ' + item.color + ' - ' + item.productAttName }} (x{{
                  item.quantity
                }})
              </p>
            </div>

            <div class="order-bottom">
              <div>
                <p class="order-total-label">Tổng tiền</p>
                <p class="order-total">{{ formatPrice(order.totalPrice) }}</p>
              </div>

              <div class="order-detail-btn">
                <span>Xem chi tiết</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="empty">
        <div class="empty-icon">📦</div>
        <h3 class="empty-title">Không có đơn hàng</h3>
        <p class="empty-sub">Bạn chưa có đơn hàng nào phù hợp với bộ lọc này</p>
      </div>
    </div>

    <!-- MODAL -->
    <transition name="modal">
      <div v-if="selectedOrder" class="modal">
        <div class="modal-overlay" @click="selectedOrder = null"></div>

        <div class="modal-box">
          <button class="modal-close" @click="selectedOrder = null">✕</button>

          <div class="modal-content">
            <!-- HEADER -->
            <div class="modal-header">
              <div class="modal-header-info">
                <h2 class="modal-title">{{ selectedOrder.orderNumber }}</h2>
                <p class="modal-date">
                  <i class="icon">🕒</i>
                  {{ formatDate(selectedOrder.orderAt) }}
                </p>
              </div>
              <div :class="['modal-status', getStatusColor(selectedOrder.type)]">
                {{
                  {
                    0: 'Đơn mua',
                    1: 'Đơn sửa chữa',
                  }[selectedOrder.status] || 'Không xác định'
                }}
              </div>

              <div :class="['modal-status', getStatusColor(selectedOrder.status)]">
                {{
                  {
                    0: 'Chờ xử lý',
                    1: 'Chờ xác nhận',
                    2: 'Đã xác nhận',
                    3: 'Đang xử lý',
                    4: 'Đã hủy',
                    5: 'Hoàn thành',
                  }[selectedOrder.status] || 'Không xác định'
                }}
              </div>
            </div>

            <!-- CUSTOMER + SHIPPING -->
            <div class="modal-info-section">
              <!-- CUSTOMER -->
              <div class="info-block">
                <h4 class="info-title">Thông tin khách hàng</h4>

                <div class="info-group">
                  <p><strong>👤 Khách hàng:</strong> {{ selectedOrder.userName }}</p>
                  <p><strong>📧 Email:</strong> {{ selectedOrder.email }}</p>
                  <p><strong>📱 Số điện thoại:</strong> {{ selectedOrder.phoneNumber }}</p>
                  <p><strong>📍 Địa chỉ:</strong> {{ selectedOrder.address }}</p>
                </div>
              </div>

              <!-- SHIPPING -->
              <div class="info-block">
                <h4 class="info-title">Thông tin giao hàng</h4>

                <div class="info-group">
                  <p>
                    <strong>🚚 Dịch vụ:</strong>
                    {{
                      {
                        0: 'Mua bán',
                        1: 'Sửa chữa',
                      }[selectedOrder.type] || 'Không xác định'
                    }}
                  </p>
                  <!-- <p><strong>📦 Dự kiến giao:</strong> {{ selectedOrder.updateAt }}</p> -->
                  <p><strong>📦 Mô tả:</strong> {{ selectedOrder.description }}</p>
                </div>
              </div>
            </div>

            <!-- ITEMS -->
            <div class="modal-items-section">
              <h4 class="info-title">Chi tiết sản phẩm</h4>

              <div class="item-list">
                <div v-for="(item, idx) in selectedOrder.orderItems" :key="idx" class="item-row">
                  <div class="item-left">
                    <p class="item-name">
                      {{ item.productName + ' - ' + item.color + ' - ' + item.productAttName }}
                    </p>
                    <p class="item-qty">x{{ item.quantity }}</p>
                  </div>

                  <div class="item-price">
                    {{ formatPrice(item.quantity * item.price) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- SUMMARY -->
            <div class="summary-box">
              <div class="summary-row">
                <span>Tạm tính</span>
                <b>{{ formatPrice(selectedOrder.totalPrice) }}</b>
              </div>

              <div class="summary-row">
                <span>Phí vận chuyển</span>
                <b>{{ formatPrice(selectedOrder.totalPrice) }}</b>
              </div>

              <div class="summary-total">
                <span>Tổng cộng</span>
                <p class="summary-total-value">
                  {{ formatPrice(selectedOrder.totalPrice) }}
                </p>
              </div>
            </div>

            <!-- ACTIONS -->
            <div class="modal-actions">
              <!-- <button class="btn-primary">💬 Liên hệ hỗ trợ</button> -->

              <button
                v-if="selectedOrder.status === 1"
                class="btn-primary"
                @click="confirmOrder(selectedOrder.id)"
              >
                ✅ Xác nhận đơn
              </button>
              <!-- <button class="btn-outline">🖨 Xác nhận đơn</button> -->
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Mock data
const orders = ref([])

const selectedOrder = ref(null)
const filterStatus = ref(null)

const filteredOrders = computed(() => {
  if (!filterStatus.value) return orders.value
  return orders.value.filter((order) => order.status === filterStatus.value)
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  await fetchOrders()

  const orderId = route.query.orderId
  if (orderId) {
    const found = orders.value.find((o) => o.id == orderId)
    if (found) {
      selectedOrder.value = found
    }
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const getStatusColor = (status) => {
  const colors = {
    0: 'bg-yellow-100 text-yellow-800', // Chờ xử lý (hiện tại)
    1: 'bg-blue-100 text-blue-800', // Đang xử lý
    2: 'bg-green-100 text-green-800', // Hoàn thành
    3: 'bg-red-100 text-red-800', // Đã hủy
    4: 'bg-orange-100 text-orange-800', // Chờ xác nhận
  }
  return colors[status] || 'bg-slate-100 text-slate-800'
}

const selectOrder = (order) => {
  selectedOrder.value = order
}

// ==============================================
// Fetch product data from backend
import axios from 'axios'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import router from '@/router'

const fetchOrders = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const response = await axios.get('http://localhost:8080/bej3/cart/my-order', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    orders.value = response.data.result
  } catch (error) {
    console.error('Lỗi', error)
    alert('Failed to fetch orders!!!!')

    if (error.response && (error.response.status === 401 || error.response.status === 500)) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
}
onMounted(fetchOrders)

const confirmOrder = async (orderId) => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }
  try {
    await axios.put(`http://localhost:8080/bej3/orders/repair-order/${orderId}/confirm`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    alert('Order confirmed successfully!')
    fetchOrders()
  } catch (error) {
    console.error('Lỗi', error)
    alert('Failed to confirm orders!!!!')

    if (error.response && (error.response.status === 401 || error.response.status === 500)) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
}
</script>

<style scoped>
/* ---------------------- */
/*   PAGE & LAYOUT       */
/* ---------------------- */

.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8fafc, #eff6ff, #eef2ff);
}

.header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
}

.header-sub {
  margin-top: 4px;
  color: #475569;
}

.order-counter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f1f5f9;
  border-radius: 10px;
}

.order-count {
  font-weight: 600;
  color: #334155;
}

.content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* ---------------------- */
/*     FILTER BUTTONS     */
/* ---------------------- */

.filter-wrapper {
  margin-bottom: 32px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-btn {
  padding: 10px 24px;
  border-radius: 999px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}

.filter-btn:hover {
  border-color: #818cf8;
}

.filter-btn-active {
  background: #4f46e5;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

/* ---------------------- */
/*     ORDER CARDS        */
/* ---------------------- */

.orders-grid {
  display: grid;
  gap: 24px;
}

.order-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.order-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #818cf8;
}

.order-inner {
  padding: 24px;
}

.order-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.order-number {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.order-date {
  margin-top: 4px;
  font-size: 14px;
  color: #64748b;
}

.order-status {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.order-items-box {
  background: #f8fafc;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;
}

.order-item-name {
  font-weight: 600;
  color: #334155;
}

.order-more-items {
  font-size: 14px;
  color: #64748b;
}

.order-bottom {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}

.order-total-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
}

.order-total {
  font-size: 24px;
  font-weight: 700;
  color: #4f46e5;
}

.order-detail-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4f46e5;
  transition: 0.2s ease;
}

.order-card:hover .order-detail-btn {
  transform: translateX(4px);
}

/* ---------------------- */
/*       EMPTY STATE      */
/* ---------------------- */

.empty {
  text-align: center;
  padding: 64px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.empty-sub {
  color: #64748b;
}

/* ---------------------- */
/*       MODAL           */
/* ---------------------- */

/* MODAL BASE */
.modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
}

.modal-box {
  position: relative;
  background: white;
  width: 100%;
  max-width: 760px;
  border-radius: 18px;
  overflow-y: auto;
  max-height: 92vh;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: modalPop 0.22s ease;
}

@keyframes modalPop {
  from {
    transform: scale(0.94);
    opacity: 0;
  }
}

/* CLOSE BUTTON */
.modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: #f1f5f9;
  font-size: 20px;
  transition: 0.2s;
}
.modal-close:hover {
  background: #e2e8f0;
}

/* CONTENT */
.modal-content {
  padding: 36px;
}

/* HEADER */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;
  margin-bottom: 28px;
}

.modal-title {
  font-size: 26px;
  font-weight: 700;
}

.modal-date {
  color: #64748b;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.modal-status {
  padding: 8px 18px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
}

/* INFO GRID */
.modal-info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-bottom: 36px;
}

.info-title {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
}

.info-group p {
  margin: 6px 0;
  color: #334155;
  font-size: 15px;
}

/* ITEMS */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
  margin-bottom: 36px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.item-name {
  font-weight: 600;
  color: #1e293b;
}

.item-qty {
  color: #64748b;
  font-size: 14px;
}

.item-price {
  font-weight: 600;
  color: #0f172a;
}

/* SUMMARY */
.summary-box {
  background: #eef2ff;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.summary-total-value {
  font-size: 24px;
  font-weight: 700;
  color: #4f46e5;
}

/* ACTIONS */
.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  background: #4f46e5;
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-primary:hover {
  background: #4338ca;
}

.btn-outline {
  flex: 1;
  padding: 14px;
  background: white;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.btn-outline:hover {
  background: #f8fafc;
}

/* STATUS COLORS */
.status-pending {
  background: #fef9c3;
  color: #854d0e;
}
.status-delivering {
  background: #dbeafe;
  color: #1e40af;
}
.status-success {
  background: #dcfce7;
  color: #166534;
}
</style>
