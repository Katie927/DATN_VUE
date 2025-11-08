<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="logo-section">
          <div class="logo-box">
            <span>📱</span>
          </div>
          <div>
            <h1>Quản lý đơn hàng</h1>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <!-- Controls Section -->
      <div class="controls-section">
        <div class="search-filter-row">
          <!-- Search Bar -->
          <div class="search-bar">
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm số đơn, khách hàng..." />
          </div>

          <!-- Filter by Type -->
          <select v-model="selectedType">
            <option value="">Tất cả loại đơn</option>
            <option value="buy_sell">Mua bán</option>
            <option value="repair">Sửa chữa</option>
          </select>

          <!-- Add Order Button -->
          <button @click="showAddForm = !showAddForm" class="btn-add-order">+ Thêm đơn hàng</button>
        </div>

        <!-- Add Order Form -->
        <div v-if="showAddForm" class="form-add-order">
          <h2>Thêm đơn hàng mới</h2>

          <div class="order-details-grid">
            <div class="form-group">
              <label>Loại đơn hàng *</label>
              <select v-model="newOrder.type">
                <option value="">Chọn loại...</option>
                <option value="buy_sell">Mua bán</option>
                <option value="repair">Sửa chữa</option>
              </select>
            </div>

            <div class="form-group">
              <label>Tên khách hàng *</label>
              <input v-model="newOrder.customer" type="text" placeholder="Nhập tên khách hàng..." />
            </div>

            <div class="form-group">
              <label>Địa chỉ giao hàng *</label>
              <select v-model="newOrder.addressType">
                <option value="customer">Địa chỉ khách hàng</option>
                <option value="shop">Cửa hàng</option>
              </select>
            </div>

            <div class="form-group">
              <label>Địa chỉ chi tiết *</label>
              <input v-model="newOrder.address" type="text" placeholder="Nhập địa chỉ..." />
            </div>
          </div>

          <!-- Items Section -->
          <div class="items-section">
            <label>Sản phẩm/Dịch vụ *</label>
            <div v-for="(item, idx) in newOrder.items" :key="idx" class="item-row">
              <input
                v-model="item.name"
                type="text"
                :placeholder="
                  newOrder.type === 'buy_sell' ? 'Tên điện thoại...' : 'Tên linh kiện...'
                "
              />
              <input v-model.number="item.quantity" type="number" min="1" placeholder="SL" />
              <input v-model.number="item.price" type="number" min="0" placeholder="Giá" />
              <button @click="newOrder.items.splice(idx, 1)" class="btn-remove-item">✕</button>
            </div>
            <button
              @click="newOrder.items.push({ name: '', quantity: 1, price: 0 })"
              class="btn-add-item"
            >
              + Thêm sản phẩm
            </button>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button @click="showAddForm = false" class="btn-cancel">Hủy</button>
            <button @click="addOrder" class="btn-submit">Tạo đơn hàng</button>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="orders-table-wrapper">
        <table class="orders-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Loại đơn</th>
              <th>Sản phẩm/Dịch vụ</th>
              <th>Tổng giá</th>
              <th>Khách hàng</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>#{{ String(order.id).padStart(4, '0') }}</td>
              <td>
                <span v-if="order.type === 'buy_sell'" class="badge-buy">Mua bán</span>
                <span v-else class="badge-repair">Sửa chữa</span>
              </td>
              <td>
                <div v-for="item in order.items" :key="item.name">
                  {{ item.name }} ({{ item.quantity }}x) -
                  {{ formatPrice(item.quantity * item.price) }}
                </div>
              </td>
              <td class="text-total">{{ formatPrice(order.totalPrice) }}</td>
              <td>{{ order.customer }}</td>
              <td>
                <span v-if="order.addressType === 'customer'">👤 </span>
                <span v-else>🏪 </span>
                {{ order.address }}
              </td>
              <td>
                <select v-model="order.status" class="status-select">
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Hủy</option>
                </select>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="no-orders">Không có đơn hàng phù hợp</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary Stats -->
      <div class="summary-grid">
        <div class="summary-card">
          <p>Tổng đơn hàng</p>
          <p>{{ orders.length }}</p>
        </div>
        <div class="summary-card">
          <p>Chờ xử lý</p>
          <p>{{ orders.filter((o) => o.status === 'pending').length }}</p>
        </div>
        <div class="summary-card">
          <p>Hoàn thành</p>
          <p>{{ orders.filter((o) => o.status === 'completed').length }}</p>
        </div>
        <div class="summary-card">
          <p>Tổng doanh thu</p>
          <p>{{ formatPrice(orders.reduce((sum, o) => sum + o.totalPrice, 0)) }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showAddForm = ref(false)
const searchQuery = ref('')
const selectedType = ref('')

const newOrder = ref({
  type: '',
  customer: '',
  address: '',
  addressType: 'customer',
  items: [{ name: '', quantity: 1, price: 0 }],
})

const orders = ref([
  {
    id: 1001,
    type: 'buy_sell',
    customer: 'Nguyễn Văn A',
    address: '123 Đường Lê Lợi, Q.1, TP.HCM',
    addressType: 'customer',
    items: [{ name: 'iPhone 15 Pro Max', quantity: 1, price: 35000000 }],
    totalPrice: 35000000,
    status: 'completed',
  },
  {
    id: 1002,
    type: 'repair',
    customer: 'Trần Thị B',
    address: '456 Đường Nguyễn Huệ, Q.1, TP.HCM',
    addressType: 'shop',
    items: [
      { name: 'Thay pin', quantity: 1, price: 500000 },
      { name: 'Thay kính', quantity: 1, price: 800000 },
    ],
    totalPrice: 1300000,
    status: 'processing',
  },
  {
    id: 1003,
    type: 'buy_sell',
    customer: 'Lê Văn C',
    address: '789 Đường Trần Hưng Đạo, Q.5, TP.HCM',
    addressType: 'customer',
    items: [{ name: 'Samsung Galaxy S24', quantity: 2, price: 18000000 }],
    totalPrice: 36000000,
    status: 'pending',
  },
])

const filteredOrders = computed(() =>
  orders.value.filter((order) => {
    const matchesType = !selectedType.value || order.type === selectedType.value
    const matchesSearch =
      !searchQuery.value ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(order.id).includes(searchQuery.value)
    return matchesType && matchesSearch
  }),
)

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const addOrder = () => {
  if (!newOrder.value.type || !newOrder.value.customer || !newOrder.value.address) {
    alert('Vui lòng điền đầy đủ thông tin')
    return
  }
  if (newOrder.value.items.some((item) => !item.name || item.price <= 0)) {
    alert('Vui lòng điền đầy đủ thông tin sản phẩm')
    return
  }
  const totalPrice = newOrder.value.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  orders.value.unshift({
    id: Math.max(...orders.value.map((o) => o.id), 0) + 1,
    type: newOrder.value.type,
    customer: newOrder.value.customer,
    address: newOrder.value.address,
    addressType: newOrder.value.addressType,
    items: [...newOrder.value.items],
    totalPrice,
    status: 'pending',
  })
  newOrder.value = {
    type: '',
    customer: '',
    address: '',
    addressType: 'customer',
    items: [{ name: '', quantity: 1, price: 0 }],
  }
  showAddForm.value = false
}
</script>

<style scoped>
/* Global Container */
.app-container {
  min-height: 100vh;
  background-color: #0f172a;
  color: #f1f5f9;
  font-family: Arial, sans-serif;
}

/* Header */
.header {
  border-bottom: 1px solid #1e293b;
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(5px);
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.logo-box {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(to bottom right, #10b981, #059669);
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: white;
}
.store-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}
.store-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}
.store-info .store-name {
  color: #34d399;
  font-weight: 500;
}

/* Main */
.main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
.controls-section {
  margin-bottom: 2rem;
}
.search-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}
.search-bar input,
select,
input[type='number'],
input[type='text'] {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  color: #f1f5f9;
  padding: 0.625rem 0.75rem;
  outline: none;
  transition: 0.2s;
}
.search-bar input::placeholder {
  color: #64748b;
}
.search-bar input:focus,
select:focus,
input[type='number']:focus,
input[type='text']:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
}
.btn-add-order {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.btn-add-order:hover {
  background-color: #059669;
}

/* Form */
.form-add-order {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 1.5rem;
}
.order-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}
@media (min-width: 768px) {
  .order-details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #d1d5db;
}
.items-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #d1d5db;
}
.item-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.btn-remove-item {
  background-color: rgba(185, 28, 28, 0.3);
  border: none;
  color: #f87171;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
.btn-add-item {
  background-color: #1e293b;
  border: 1px solid #334155;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  color: #f1f5f9;
  cursor: pointer;
}
.btn-add-item:hover {
  background-color: #2c3a4a;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
.btn-cancel {
  background-color: #1e293b;
  border: 1px solid #334155;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  color: #f1f5f9;
  cursor: pointer;
}
.btn-cancel:hover {
  background-color: #2c3a4a;
}
.btn-submit {
  background-color: #10b981;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
}
.btn-submit:hover {
  background-color: #059669;
}

/* Table */
.orders-table-wrapper {
  overflow-x: auto;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
}
.orders-table th,
.orders-table td {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.875rem;
}
.orders-table thead tr {
  background-color: rgba(15, 23, 42, 0.3);
  border-bottom: 1px solid #334155;
}
.orders-table tbody tr:hover {
  background-color: rgba(30, 41, 59, 0.3);
}
.badge-buy {
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
.badge-repair {
  background-color: rgba(192, 132, 252, 0.2);
  color: #c084fc;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
.text-total {
  color: #34d399;
  font-weight: 600;
}
.status-select {
  background-color: rgba(30, 41, 59, 0.2);
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
.no-orders {
  text-align: center;
  padding: 3rem 0;
  color: #94a3b8;
}

/* Summary */
.summary-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 2rem;
}
@media (min-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.summary-card {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
}
.summary-card p:first-child {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
}
.summary-card p:last-child {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
}
</style>
