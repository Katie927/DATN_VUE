<template>
  <div class="phone-shop-container">
    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm đơn hàng..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      <select v-model="filterType" class="filter-select">
        <option value="">Tất cả loại đơn</option>
        <option value="buy">Mua bán</option>
        <option value="repair">Sửa chữa</option>
      </select>
      <button class="add-order-btn" @click="openNewOrderForm">
        <span class="plus-icon">+</span>
        Thêm đơn hàng
      </button>
    </div>

    <!-- Orders Table -->
    <div class="table-wrapper">
      <table class="orders-table">
        <thead>
          <tr>
            <th style="width: 34px;">STT</th>
            <th>Loại đơn</th>
            <th>Khách hàng</th>
            <th>Địa chỉ</th>
            <th>Tổng giá</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(order, index) in orders" :key="order.id">
            <tr  class="order-row">
              <td class="order-stt">{{ index + 1 }}</td>
              <td>
                <span :class="`badge badge-${order.type}`">
                  {{ order.type === 0 ? 'Mua bán' : 'Sửa chữa' }}
                </span>
              </td>
              <td class="customer-name">{{ order.userName }}</td>
              <td class="address-type">
                <span :class="`addr-badge addr-${order.type}`">
                  {{ order.addressType === '1' ? 'Khách hàng' : 'Khách hàng' }}
                </span>
              </td>
              <td class="total-price">{{ formatPrice(order.totalPrice) }}</td>
              <td>
                <select
                  :value="order.status"
                  @change="updateOrderStatus(order.id, $event.target.value)"
                  class="status-select"
                  :class="`status-${order.status}`"
                >
                  <option value="0">Chờ xử lý</option>
                  <option value="1">Đang xử lý</option>
                  <option value="2">Hoàn thành</option>
                  <option value="3">Hủy</option>
                </select>
              </td>
              <td class="action-cell">
                <button class="btn-detail" @click="openOrderDetail(order.id)">Chi tiết</button>
              </td>
            </tr>
          </template>          
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="orders.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <p>Không có đơn hàng nào</p>
    </div>

    <!-- Modal Detail --> 
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditMode ? 'Chi tiết đơn hàng' : 'Thêm đơn hàng mới' }}</h2>
            <button class="close-btn" @click="closeModal">✕</button>
          </div>

          <div class="modal-body">
            <!-- Form fields only for new orders -->
            <template v-if="!isEditMode">
              <div class="form-group">
                <label>Loại đơn hàng</label>
                <select v-model="formData.type" class="form-input">
                  <option value="0">Mua bán điện thoại</option>
                  <option value="1">Sửa chữa điện thoại</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Tên khách hàng</label>
                  <input
                    v-model="formData.customerName"
                    type="text"
                    placeholder="Nhập tên khách hàng"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Số điện thoại</label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    class="form-input"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Địa chỉ</label>
                  <input
                    v-model="formData.address"
                    type="text"
                    placeholder="Nhập địa chỉ"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Loại địa chỉ</label>
                  <select v-model="formData.addressType" class="form-input">
                    <option value="1">Địa chỉ khách hàng</option>
                    <option value="2">Cửa hàng</option>
                  </select>
                </div>
              </div>

              <!-- Items section for new orders -->
              <div class="items-section">
                <div class="items-header">
                  <h3>
                    {{ formData.type === '0' ? 'Danh sách điện thoại' : 'Danh sách linh kiện' }}
                  </h3>
                  <button class="btn-add-item" @click="addItem">+ Thêm</button>
                </div>

                <div class="items-list">
                  <div v-for="(item, index) in formData.items" :key="index" class="item-row">
                    <input
                      v-model="item.name"
                      type="text"
                      :placeholder="formData.type === 'buy' ? 'Tên điện thoại' : 'Tên linh kiện'"
                      class="item-input"
                    />
                    <div class="quantity-price">
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        placeholder="SL"
                        class="item-input small"
                      />
                      <input
                        v-model.number="item.unitPrice"
                        type="number"
                        min="0"
                        placeholder="Đơn giá"
                        class="item-input small"
                      />
                      <span class="item-total">{{
                        formatPrice(item.quantity * item.unitPrice)
                      }}</span>
                      <button class="btn-remove-item" @click="removeItem(index)">✕</button>
                    </div>
                  </div>
                </div>

                <div class="items-summary">
                  <div class="summary-row">
                    <span>Tổng cộng:</span>
                    <span class="summary-value">{{ formatPrice(formData.totalPrice) }}</span>
                  </div>
                </div>
              </div>
            </template>

            <!-- Edit mode: only show editable fields -->
            <template v-else>
              <div class="info-group">
                <label>Loại đơn</label>
                <div class="info-value">{{ formData.type === '0' ? 'Mua bán' : 'Sửa chữa' }}</div>
              </div>

              <div class="form-row">
                <div class="info-group">
                  <label>Tên khách hàng</label>
                  <div class="info-value">{{ formData.userName }}</div>
                </div>
                <div class="info-group">
                  <label>Số điện thoại</label>
                  <div class="info-value">{{ formData.phoneNumber }}</div>
                </div>
                <div class="info-group">
                  <label>Địa chỉ</label>
                  <div class="info-value">{{ formData.address }}</div>
                </div>
              </div>

              <div class="form-row">
                <div class="info-group">
                  <label>Loại địa chỉ</label>
                  <div class="info-value">
                    {{ formData.type === '1' ? 'Địa chỉ khách hàng' : 'Cửa hàng' }}
                  </div>
                </div>
                <div class="info-group">
                  <label>Trạng thái</label>
                  <select v-model="formData.status" class="form-input">
                    <option value="0">Chờ xử lý</option>
                    <option value="1">Đang xử lý</option>
                    <option value="2">Hoàn thành</option>
                    <option value="3">Hủy</option>
                  </select>
                </div>
              </div>

              <div class="form-row" style="grid-template-columns: 1fr 1fr;">
                <div class="form-group">
                  <label>Cập nhật</label>
                  <textarea type="textarea" class="form-input" v-model="formData.newDescription" />
                </div>
                <!-- <div class="form-group">
                  <label>Ghi chú</label>
                  <textarea type="textarea" class="form-input" v-model="formData.description" />
                </div> -->
              </div>
              
              <div class="form-group">
                <label>Ghi chú</label>
                <textarea type="textarea" class="form-input" ref="noteField"
                    @input="autoResize" v-model="formData.description" />
              </div>

              <!-- Items section read-only -->
              <div class="items-section">
                <h3 class="items-title">
                  {{ formData.type === 'buy' ? 'Danh sách điện thoại' : 'Danh sách linh kiện' }}
                </h3>

                <table class="items-detail-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Màu</th>
                      <th>Phiên bản</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in formData.orderItems" :key="index">
                      <td>{{ item.productName }}</td>
                      <td>{{ item.color }}</td>
                      <td>{{ item.productAttName }}</td>
                      <td>{{ formatPrice(item.price) }}</td>
                      <td class="qty-cell">{{ item.quantity }}</td>
                      <td class="total-cell">{{ formatPrice(item.quantity * item.price) }}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="items-summary">
                  <div class="summary-row">
                    <span>Tổng cộng:</span>
                    <span class="summary-value">{{ formatPrice(formData.totalPrice) }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">
              {{ isEditMode ? 'Đóng' : 'Hủy' }}
            </button>
            <button v-if="!isEditMode" class="btn-save" @click="saveOrder">Lưu đơn hàng</button>
            <button v-else class="btn-save" @click="hanldeUpdateOrderStatus(editingOrderId)">Cập nhật trạng thái</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import axios from 'axios'
import router from '@/router'
import { ref, computed, watch, onMounted } from 'vue'
import { nextTick } from 'vue'

// State
const showModal = ref(false)
const isEditMode = ref(false)
const searchQuery = ref('')
const filterType = ref('')
const editingOrderId = ref(null)

// ============================================================================ FETCH ORDERS =========================
const orders = ref([ ])
const fetchOrders = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  
  try {
    const response = await axios.get("http://localhost:8080/bej3/manage/orders/get-all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    orders.value = response.data.result;
  } catch (error) {
    console.error("Lỗi", error);
    alert("Failed to fetch orders!!!!");

    if (error.response && (error.response.status === 401 || error.response.status === 500)) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }
};
onMounted(fetchOrders)

const fetchOrderDetails = async (orderId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/bej3/manage/orders/details/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.result;
  } catch (error) {
    console.error("Lỗi", error);
    alert("Failed to fetch order details!!!!");
  }
};
// =======================================================================================================================
const formData = ref({ })
const openOrderDetail = async (orderId) => {
  const details = await fetchOrderDetails(orderId)
  if (!details) return

  isEditMode.value = true
  editingOrderId.value = orderId

  formData.value = {
    type: details.type,
    userName: details.userName,
    phoneNumber: details.phoneNumber,
    address: details.address,
    addressType: details.addressType,
    status: details.status,
    description: details.description,
    orderItems: (details.orderItems || []).map(item => ({
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      productAttName: item.productAttName,
      color: item.color,
    })),
    totalPrice: details.totalPrice,
  }

  showModal.value = true
}
//======================================================================================================================
const hanldeUpdateOrderStatus = async (orderId) => {
  console.log("orderId:", orderId);
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    await axios.put(
      `http://localhost:8080/bej3/manage/orders/${orderId}/status`,
      {
        status: formData.value.status,
        note: formData.value.newDescription
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Cập nhật trạng thái đơn hàng thành công!!");
    openOrderDetail(orderId);
      
  } catch (error) {
    console.error("Lỗi", error);
    alert("Failed to update order status!!!!");

    if (error.response && (error.response.status === 401 || error.response.status === 500)) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }
};
//======================================================================================================================



// Computed
const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !filterType.value || order.type === filterType.value
    return matchesSearch && matchesType
  })
})

// Watch for items changes to update total
// watch(
//   () => formData.value.items,
//   () => {
//     formData.value.totalPrice = formData.value.items.reduce(
//       (sum, item) => sum + (item.quantity * item.unitPrice || 0),
//       0,
//     )
//   },
//   { deep: true },
// )

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const openNewOrderForm = () => {
  isEditMode.value = false
  editingOrderId.value = null
  formData.value = {
    type: 'buy',
    customerName: '',
    phone: '',
    address: '',
    addressType: '1',
    status: 'pending',
    items: [{ name: '', quantity: 1, unitPrice: 0 }],
    totalPrice: 0,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const addItem = () => {
  formData.value.items.push({ name: '', quantity: 1, unitPrice: 0 })
}

const removeItem = (index) => {
  formData.value.items.splice(index, 1)
}

const saveOrder = () => {
  if (isEditMode.value) {
    const orderIndex = orders.value.findIndex((o) => o.id === editingOrderId.value)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = formData.value.status
    }
  } else {
    orders.value.push({
      id: Math.max(...orders.value.map((o) => o.id), 0) + 1,
      ...formData.value,
    })
  }
  closeModal()
}

const updateOrderStatus = (orderId, newStatus) => {
  const order = orders.value.find((o) => o.id === orderId)
  if (order) {
    order.status = newStatus
  }
}


const noteField = ref(null);
const autoResize = () => {
  const el = noteField.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
};
watch(
  () => formData.value.description,
  async () => {
    await nextTick();     // đợi DOM update xong
    autoResize();         // resize theo data mới
  }
);
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Typography & Colors */
:root {
  --primary: #1a1a1a;
  --secondary: #2d2d2d;
  --accent: #d4af37;
  --light-bg: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666;
  --border-color: #e0e0e0;
  --success: #4caf50;
  --warning: #ff9800;
  --danger: #f44336;
  --info: #2196f3;
}

.phone-shop-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #fafafa;
  min-height: 100vh;
  padding: 32px;
}

/* Filters section moved to top, no header needed */
.filters-section {
  max-width: 1400px;
  margin: 0 auto 32px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.filter-select:hover,
.filter-select:focus {
  border-color: var(--accent);
  outline: none;
}

.add-order-btn {
  background: var(--accent);
  color: var(--primary);
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.add-order-btn:hover {
  background: #e5c158;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(212, 175, 55, 0.2);
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
}

/* Table */
.table-wrapper {
  max-width: 1400px;
  margin: 0 auto 32px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table thead {
  background: var(--light-bg);
  border-bottom: 2px solid var(--border-color);
}

.orders-table th {
  padding: 18px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.orders-table tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.orders-table tbody tr:hover {
  background: #f9f9f9;
}

.orders-table td {
  padding: 16px;
  font-size: 14px;
  color: var(--text-secondary);
}

.order-stt {
  font-weight: 600;
  color: var(--text-primary);
}

.customer-name {
  color: var(--text-primary);
  font-weight: 500;
}

/* Badges */
.badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-0 {
  background: #e3f2fd;
  color: #1565c0;
}

.badge-1 {
  background: #fff3e0;
  color: #e65100;
}

.addr-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.addr-1 {
  background: #f3e5f5;
  color: #6a1b9a;
}

.addr-0 {
  background: #e8f5e9;
  color: #2e7d32;
}

.total-price {
  font-weight: 600;
  color: var(--accent);
  font-size: 15px;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  background: white;
  transition: all 0.3s ease;
}

.status-select:focus {
  outline: none;
  border-color: var(--accent);
}

.status-pending {
  border-color: var(--warning);
  background: #fff8f0;
}

.status-processing {
  border-color: var(--info);
  background: #f0f7ff;
}

.status-completed {
  border-color: var(--success);
  background: #f0f8f4;
}

.status-cancelled {
  border-color: var(--danger);
  background: #fff0f0;
}

.action-cell {
  text-align: center;
}

.btn-detail {
  background: var(--accent);
  color: var(--primary);
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-detail:hover {
  background: #e5c158;
  transform: translateY(-2px);
}

/* Empty State */
.empty-state {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
  padding: 80px 32px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 24px;
  border-bottom: 2px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Added info-group styling for read-only fields */
.info-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  padding: 12px 16px;
  background: var(--light-bg);
  border-radius: 8px;
  border: 1px solid #00b63e;
  color: var(--text-secondary);
  font-size: 14px;
}

.form-input,
.form-row {
  width: 100%;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #00b63e;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

/* Items Section */
.items-section {
  background: var(--light-bg);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.items-header h3,
.items-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.items-title {
  margin-bottom: 16px;
}

.btn-add-item {
  background: var(--accent);
  color: var(--primary);
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.btn-add-item:hover {
  background: #e5c158;
  transform: translateY(-2px);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.item-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.item-input {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  background: white;
  transition: all 0.3s ease;
}

.item-input:focus {
  outline: none;
  border-color: var(--accent);
}

.item-input.small {
  width: 80px;
}

.quantity-price {
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
}

.item-total {
  font-weight: 600;
  color: var(--accent);
  min-width: 100px;
  text-align: right;
  font-size: 13px;
}

.btn-remove-item {
  background: #ffebee;
  color: var(--danger);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove-item:hover {
  background: var(--danger);
  color: white;
}

/* Read-only items display */
.items-list-readonly {
  background: white;
  border-radius: 6px;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.item-readonly-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  font-size: 13px;
}

.item-readonly-row:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 500;
  color: var(--text-primary);
}

.item-qty,
.item-price,
.item-total-readonly {
  text-align: right;
  color: var(--text-secondary);
}

.item-total-readonly {
  color: var(--accent);
  font-weight: 600;
}

.items-summary {
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-value {
  color: var(--accent);
  font-size: 16px;
}

/* Modal Footer */
.modal-footer {
  padding: 20px 24px;
  border-top: 2px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel,
.btn-save {
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-cancel {
  background: var(--light-bg);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-cancel:hover {
  background: var(--border-color);
}

.btn-save {
  background: var(--accent);
  color: var(--primary);
}

.btn-save:hover {
  background: #e5c158;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(212, 175, 55, 0.2);
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .phone-shop-container {
    padding: 16px;
  }

  .filters-section {
    margin-bottom: 16px;
    flex-direction: column;
  }

  .filter-select,
  .add-order-btn {
    width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .item-row {
    flex-direction: column;
  }

  .quantity-price {
    width: 100%;
    flex-wrap: wrap;
  }

  .item-total {
    width: 100%;
    margin-top: 8px;
  }

  .item-readonly-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .item-qty,
  .item-price,
  .item-total-readonly {
    text-align: left;
  }

  .orders-table {
    font-size: 12px;
  }

  .orders-table th,
  .orders-table td {
    padding: 12px 8px;
  }

  .modal-content {
    max-width: 95vw;
  }
}

/* Added table styling for items display in detail modal */
.items-detail-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
}

.items-detail-table thead {
  background: var(--light-bg);
  border-bottom: 1px solid var(--border-color);
}

.items-detail-table th {
  padding: 12px 16px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.items-detail-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
}

.items-detail-table tbody tr:last-child td {
  border-bottom: none;
}

.qty-cell {
  text-align: center;
  font-weight: 500;
}

.total-cell {
  text-align: right;
  font-weight: 600;
  color: var(--accent);
}
</style>
