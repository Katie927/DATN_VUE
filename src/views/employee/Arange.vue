<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <h1>Chọn Nhân Viên Làm Ca</h1>
        <p class="date">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="section">
        <!-- Danh Sách Nhân Viên Sẵn Có -->
        <div class="section-header">
          <h2>Danh Sách Nhân Viên Sẵn Có</h2>
          <span class="employee-count">{{ filteredEmployees.length }} nhân viên</span>
        </div>

        <!-- 🟩 Thanh tìm kiếm -->
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã nhân viên..."
            class="search-input"
          />
        </div>

        <div class="table-wrapper">
          <table class="employee-table">
            <thead>
              <tr>
                <th class="checkbox-col">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="checkbox"
                  />
                </th>
                <th>STT</th>
                <th>Họ và Tên</th>
                <th>Số Điện Thoại</th>
                <th>Mã Nhân Viên</th>
                <th>Chức Vụ</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(employee, index) in filteredEmployees"
                :key="employee.id"
                class="employee-row"
              >
                <td class="checkbox-col">
                  <input type="checkbox" v-model="selected" :value="employee.id" class="checkbox" />
                </td>
                <td class="stt">{{ index + 1 }}</td>
                <td class="name">{{ employee.name }}</td>
                <td class="phone">{{ employee.phone }}</td>
                <td class="employee-id">{{ employee.employeeId }}</td>
                <td class="role">{{ employee.role }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Action Button -->
        <div class="action-section">
          <button @click="addToShift" :disabled="selected.length === 0" class="btn-add">
            <span class="btn-icon">+</span>
            Thêm Vào Ca Làm ({{ selected.length }} người)
          </button>
        </div>
      </div>

      <!-- Ca Làm Hiện Tại -->
      <div class="section">
        <div class="section-header">
          <h2>Nhân Viên Trong Ca Làm</h2>
          <span class="shift-count">{{ shiftEmployees.length }} người</span>
        </div>

        <div class="shift-list">
          <div v-if="shiftEmployees.length === 0" class="empty-state">
            <p>Chưa có nhân viên nào được thêm vào ca làm</p>
          </div>
          <div v-else>
            <div v-for="(employee, index) in shiftEmployees" :key="employee.id" class="shift-item">
              <div class="shift-item-content">
                <div class="shift-item-number">{{ index + 1 }}</div>
                <div class="shift-item-info">
                  <div class="shift-item-name">{{ employee.name }}</div>
                  <div class="shift-item-details">
                    {{ employee.employeeId }} • {{ employee.role }} • {{ employee.phone }}
                  </div>
                </div>
              </div>
              <button @click="removeFromShift(employee.id)" class="btn-remove">Xóa</button>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="submit-section" v-if="shiftEmployees.length > 0">
          <button @click="submitShift" class="btn-submit">
            Xác Nhận Ca Làm ({{ shiftEmployees.length }} người)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(
  new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

const employees = ref([
  { id: 1, name: 'Nguyễn Văn A', phone: '0912345678', employeeId: 'NV001', role: 'Quản Lý' },
  {
    id: 2,
    name: 'Trần Thị B',
    phone: '0987654321',
    employeeId: 'NV002',
    role: 'Nhân Viên Bán Hàng',
  },
  { id: 3, name: 'Lê Minh C', phone: '0901234567', employeeId: 'NV003', role: 'Thủ Kho' },
  {
    id: 4,
    name: 'Phạm Hoàng D',
    phone: '0923456789',
    employeeId: 'NV004',
    role: 'Nhân Viên Bán Hàng',
  },
  {
    id: 5,
    name: 'Vũ Thanh E',
    phone: '0945678901',
    employeeId: 'NV005',
    role: 'Nhân Viên Bán Hàng',
  },
  { id: 6, name: 'Đặng Hữu F', phone: '0967890123', employeeId: 'NV006', role: 'Bảo Vệ' },
  {
    id: 7,
    name: 'Bùi Quốc G',
    phone: '0978901234',
    employeeId: 'NV007',
    role: 'Nhân Viên Bán Hàng',
  },
  { id: 8, name: 'Hoàng Kim H', phone: '0989012345', employeeId: 'NV008', role: 'Quản Lý Ca' },
])

const selected = ref([])
const shiftEmployees = ref([])
const selectAll = ref(false)

// 🟩 Thêm biến tìm kiếm
const searchQuery = ref('')

// 🟩 computed để lọc danh sách nhân viên
const filteredEmployees = computed(() => {
  if (!searchQuery.value.trim()) return employees.value
  const q = searchQuery.value.toLowerCase()
  return employees.value.filter(
    (e) => e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q),
  )
})

const toggleSelectAll = () => {
  if (selectAll.value) {
    selected.value = filteredEmployees.value.map((e) => e.id)
  } else {
    selected.value = []
  }
}

const addToShift = () => {
  const selectedEmployees = employees.value.filter(
    (e) => selected.value.includes(e.id) && !shiftEmployees.value.find((se) => se.id === e.id),
  )
  shiftEmployees.value.push(...selectedEmployees)
  selected.value = []
  selectAll.value = false
}

const removeFromShift = (employeeId) => {
  shiftEmployees.value = shiftEmployees.value.filter((e) => e.id !== employeeId)
}

const submitShift = () => {
  const employeeNames = shiftEmployees.value.map((e) => e.name).join(', ')
  alert(`Ca làm được xác nhận với ${shiftEmployees.value.length} nhân viên:\n${employeeNames}`)
}
</script>

<style scoped>
/* 🟩 CSS mới cho thanh tìm kiếm */
.search-box {
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ccd6e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Header */
.header {
  margin-bottom: 30px;
}

.header-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header h1 {
  font-size: 28px;
  color: #1a1a2e;
  margin-bottom: 8px;
  font-weight: 600;
}

.date {
  font-size: 14px;
  color: #7a8a99;
  text-transform: capitalize;
}

/* Main Content */
.main-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
}

.section-header h2 {
  font-size: 18px;
  color: #1a1a2e;
  font-weight: 600;
}

.employee-count,
.shift-count {
  font-size: 13px;
  background: #e8f0fe;
  color: #1967d2;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
  margin-bottom: 20px;
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.employee-table thead {
  background: #f8f9fb;
}

.employee-table th {
  padding: 14px 12px;
  text-align: left;
  font-weight: 600;
  color: #5a6c7d;
  border-bottom: 2px solid #e8ecf1;
}

.employee-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #f0f2f5;
  color: #2d3748;
}

.employee-row:hover {
  background: #f8f9fb;
}

.checkbox-col {
  width: 50px;
  text-align: center;
}

.stt {
  width: 50px;
  color: #7a8a99;
  font-weight: 500;
}

.name {
  font-weight: 500;
  color: #1a1a2e;
}

.phone {
  color: #7a8a99;
  font-family: 'Courier New', monospace;
}

.employee-id {
  color: #7a8a99;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.role {
  padding: 6px 12px;
  background: #e8f0fe;
  color: #1967d2;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

/* Checkbox */
.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #1967d2;
}

.checkbox:hover {
  transform: scale(1.1);
}

/* Action Section */
.action-section {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-add {
  flex: 1;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-add:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 18px;
  font-weight: bold;
}

/* Shift List */
.shift-list {
  max-height: 500px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a0aec0;
}

.shift-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background: #f8f9fb;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.shift-item:hover {
  background: #f0f2f5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.shift-item-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.shift-item-number {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  flex-shrink: 0;
}

.shift-item-info {
  flex: 1;
}

.shift-item-name {
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.shift-item-details {
  font-size: 12px;
  color: #7a8a99;
}

.btn-remove {
  padding: 6px 12px;
  background: #fee;
  color: #e53e3e;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: #fdd;
  transform: scale(1.05);
}

/* Submit Section */
.submit-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #f0f2f5;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 12px;
  }

  .header-content {
    padding: 20px;
  }

  .header h1 {
    font-size: 22px;
  }

  .section {
    padding: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .employee-table {
    font-size: 12px;
  }

  .employee-table th,
  .employee-table td {
    padding: 10px 8px;
  }

  .role {
    font-size: 11px;
    padding: 4px 8px;
  }
}

/* Scrollbar */
.table-wrapper::-webkit-scrollbar,
.shift-list::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.table-wrapper::-webkit-scrollbar-track,
.shift-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb,
.shift-list::-webkit-scrollbar-thumb {
  background: #bcc0c4;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover,
.shift-list::-webkit-scrollbar-thumb:hover {
  background: #a0a8ae;
}
</style>
