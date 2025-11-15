<template>
  <div class="dashboard-container">
    <!-- Main Content -->
    <main class="dashboard-main">
      <div class="header-custom">
        <h1>Thống kê bán hàng & dịch vụ sửa chữa</h1>
        <span class="date-display">{{ currentDate }}</span>
      </div>

      <!-- Stats Cards Grid -->
      <section class="stats-section">
        <div class="stat-card revenue-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <p class="stat-label">Doanh Thu</p>
            <h2 class="stat-value">{{ formatCurrency(revenue) }}</h2>
            <p class="stat-change increase">+12% so với tuần trước</p>
          </div>
        </div>

        <div class="stat-card orders-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <p class="stat-label">Đơn Hàng</p>
            <h2 class="stat-value">{{ totalOrders }}</h2>
            <p class="stat-change">{{ pendingOrders }} đơn chờ xử lý</p>
          </div>
        </div>

        <div class="stat-card repair-card">
          <div class="stat-icon">🔧</div>
          <div class="stat-content">
            <p class="stat-label">Sửa Chữa</p>
            <h2 class="stat-value">{{ repairServices }}</h2>
            <p class="stat-change">{{ completedRepairs }} hoàn thành</p>
          </div>
        </div>

        <div class="stat-card customers-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <p class="stat-label">Khách Hàng Mới</p>
            <h2 class="stat-value">{{ newCustomers }}</h2>
            <p class="stat-change increase">+8% tăng mới</p>
          </div>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-section">
        <div class="chart-card">
          <h3 class="chart-title">Doanh Thu 7 Ngày Gần Đây</h3>
          <div class="simple-chart">
            <div class="chart-bars">
              <div class="bar-wrapper" v-for="(bar, index) in chartData" :key="index">
                <div class="bar" :style="{ height: bar.height + '%' }"></div>
                <span class="bar-label">{{ bar.day }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3 class="chart-title">Bán Hàng vs Sửa Chữa</h3>
          <div class="pie-chart-wrapper">
            <div class="pie">
              <div
                class="pie-segment sales"
                style="clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)"
              ></div>
              <div
                class="pie-segment repair"
                style="clip-path: polygon(50% 50%, 0% 100%, 50% 100%, 100% 100%, 100% 50%, 50% 0%)"
              ></div>
            </div>
            <div class="pie-legend">
              <div class="legend-item">
                <span class="legend-color sales"></span>
                <span>Bán hàng: 65%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color repair"></span>
                <span>Sửa chữa: 35%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Products & Services -->
      <section class="products-services-section">
        <div class="products-container">
          <h3 class="section-title">Sản Phẩm Bán Chạy Nhất</h3>
          <div class="products-list">
            <div class="product-item" v-for="(product, index) in topProducts" :key="index">
              <div class="product-info">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-qty">{{ product.quantity }} bán</span>
              </div>
              <div class="product-price">{{ formatCurrency(product.price) }}</div>
            </div>
          </div>
        </div>

        <div class="services-container">
          <h3 class="section-title">Dịch Vụ Sửa Chữa</h3>
          <div class="services-list">
            <div class="service-item" v-for="(service, index) in repairServices" :key="index">
              <div class="service-info">
                <span class="service-name">{{ service.name }}</span>
                <span class="service-count">{{ service.count }} lần</span>
              </div>
              <div class="service-price">{{ formatCurrency(service.price) }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Transactions -->
      <section class="transactions-section">
        <h3 class="section-title">Giao Dịch Gần Đây</h3>
        <div class="table-wrapper">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Mã GD</th>
                <th>Khách Hàng</th>
                <th>Loại</th>
                <th>Số Tiền</th>
                <th>Trạng Thái</th>
                <th>Ngày</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, index) in transactions" :key="index">
                <td class="transaction-id">{{ transaction.id }}</td>
                <td>{{ transaction.customer }}</td>
                <td>
                  <span class="badge" :class="'badge-' + transaction.type">
                    {{ transaction.type === 'sale' ? 'Bán hàng' : 'Sửa chữa' }}
                  </span>
                </td>
                <td class="amount">{{ formatCurrency(transaction.amount) }}</td>
                <td>
                  <span class="status" :class="'status-' + transaction.status">
                    {{ transaction.statusText }}
                  </span>
                </td>
                <td class="date">{{ transaction.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Data
const revenue = ref(45250)
const totalOrders = ref(156)
const pendingOrders = ref(12)
const repairServices = ref(89)
const completedRepairs = ref(74)
const newCustomers = ref(24)

const currentDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const chartData = [
  { day: 'T2', height: 45 },
  { day: 'T3', height: 62 },
  { day: 'T4', height: 55 },
  { day: 'T5', height: 78 },
  { day: 'T6', height: 88 },
  { day: 'T7', height: 72 },
  { day: 'CN', height: 95 },
]

const topProducts = [
  { name: 'iPhone 15 Pro Max', quantity: 42, price: 35000000 },
  { name: 'Samsung Galaxy S24', quantity: 38, price: 18000000 },
  { name: 'Xiaomi 14 Ultra', quantity: 35, price: 12000000 },
  { name: 'Google Pixel 8', quantity: 28, price: 16000000 },
]

const transactions = [
  {
    id: '#TXN001',
    customer: 'Nguyễn Văn A',
    type: 'sale',
    amount: 35000000,
    status: 'completed',
    statusText: 'Thành công',
    date: '2024-11-15',
  },
  {
    id: '#TXN002',
    customer: 'Trần Thị B',
    type: 'repair',
    amount: 1500000,
    status: 'completed',
    statusText: 'Thành công',
    date: '2024-11-15',
  },
  {
    id: '#TXN003',
    customer: 'Phạm Quốc C',
    type: 'sale',
    amount: 18000000,
    status: 'pending',
    statusText: 'Chờ xử lý',
    date: '2024-11-15',
  },
  {
    id: '#TXN004',
    customer: 'Lê Minh D',
    type: 'repair',
    amount: 800000,
    status: 'completed',
    statusText: 'Thành công',
    date: '2024-11-14',
  },
  {
    id: '#TXN005',
    customer: 'Võ Thanh E',
    type: 'sale',
    amount: 12000000,
    status: 'processing',
    statusText: 'Đang xử lý',
    date: '2024-11-14',
  },
  {
    id: '#TXN006',
    customer: 'Hoàng Anh F',
    type: 'repair',
    amount: 2000000,
    status: 'completed',
    statusText: 'Thành công',
    date: '2024-11-13',
  },
]

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%);
}

/* ===== HEADER ===== */
.dashboard-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 2.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.15);
  gap: 2rem;
  flex-wrap: wrap;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.date-display {
  font-size: 0.95rem;
  opacity: 0.95;
  font-weight: 500;
  white-space: nowrap;
}

.header-custom {
  max-width: 100%;
  margin-top: -20px;
  margin-left: -10px;
  padding: 1rem;
  color: #009981;
}
/* ===== MAIN CONTENT ===== */
.dashboard-main {
  padding: 2.5rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== STATS SECTION ===== */
.stats-section {
  margin-bottom: 3rem;
}

.stats-section::before {
  content: '';
  display: none;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.75rem;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(59, 130, 246, 0.2);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-icon {
  font-size: 2.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  word-break: break-word;
}

.stat-change {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

.stat-change.increase {
  color: #10b981;
  font-weight: 600;
}

/* ===== CHARTS SECTION ===== */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.chart-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.75rem;
  letter-spacing: -0.3px;
}

/* ===== BAR CHART ===== */
.simple-chart {
  height: 280px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chart-bars {
  display: flex;
  gap: 0.875rem;
  width: 100%;
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 0.5rem 0.5rem 0 0;
  min-height: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

.bar:hover {
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
  transform: scaleY(1.05);
}

.bar-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  margin-top: 0.5rem;
}

/* ===== PIE CHART ===== */
.pie-chart-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  height: 220px;
  flex-wrap: wrap;
}

.pie {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(#10b981 0deg 234deg, #f59e0b 234deg 360deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 150px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
  font-weight: 500;
}

.legend-color {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-color.sales {
  background: #10b981;
}

.legend-color.repair {
  background: #f59e0b;
}

/* ===== PRODUCTS & SERVICES SECTION ===== */
.products-services-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.products-container,
.services-container {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  letter-spacing: -0.3px;
}

.products-list,
.services-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.product-item,
.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  gap: 1rem;
}

.product-item:hover,
.service-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateX(4px);
}

.product-info,
.service-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  min-width: 0;
}

.product-name,
.service-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
  line-height: 1.3;
  word-break: break-word;
}

.product-qty,
.service-count {
  font-size: 0.8rem;
  color: #94a3b8;
}

.product-price,
.service-price {
  font-weight: 700;
  color: #3b82f6;
  font-size: 0.95rem;
  flex-shrink: 0;
  white-space: nowrap;
}

/* ===== TRANSACTIONS SECTION ===== */
.transactions-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.transactions-table thead {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.transactions-table th {
  padding: 1.125rem 1rem;
  text-align: left;
  font-weight: 700;
  color: #475569;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.transactions-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.95rem;
  color: #1e293b;
}

.transactions-table tbody tr {
  transition: background-color 0.2s ease;
}

.transactions-table tbody tr:hover {
  background: #f8fafc;
}

.transactions-table tbody tr:last-child td {
  border-bottom: none;
}

.transaction-id {
  font-weight: 600;
  color: #3b82f6;
  font-family: 'Monaco', 'Courier New', monospace;
}

.amount {
  font-weight: 700;
  color: #10b981;
}

.date {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* ===== BADGES & STATUS ===== */
.badge {
  display: inline-block;
  padding: 0.4rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.badge-sale {
  background: #dbeafe;
  color: #0c4a6e;
}

.badge-repair {
  background: #fef3c7;
  color: #78350f;
}

.status {
  display: inline-block;
  padding: 0.4rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.status-completed {
  background: #dcfce7;
  color: #166534;
}

.status-pending {
  background: #fed7aa;
  color: #92400e;
}

.status-processing {
  background: #e0e7ff;
  color: #3730a3;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .dashboard-main {
    padding: 2rem 1.5rem;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .products-services-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 0.95rem;
  }

  .header-stats {
    justify-content: center;
    width: 100%;
  }

  .dashboard-main {
    padding: 1.5rem 1rem;
  }

  .stats-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .chart-card {
    padding: 1.5rem;
  }

  .simple-chart {
    height: 240px;
  }

  .chart-bars {
    gap: 0.5rem;
  }

  .pie-chart-wrapper {
    gap: 1.5rem;
    height: auto;
  }

  .pie {
    width: 140px;
    height: 140px;
  }

  .transactions-table {
    font-size: 0.85rem;
  }

  .transactions-table th,
  .transactions-table td {
    padding: 0.85rem 0.5rem;
  }

  .product-item,
  .service-item {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .product-info,
  .service-info {
    width: 100%;
  }

  .product-price,
  .service-price {
    width: 100%;
    text-align: right;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 1.5rem;
  }

  .header-title {
    font-size: 1.25rem;
  }

  .header-subtitle {
    font-size: 0.85rem;
  }

  .dashboard-main {
    padding: 1rem;
  }

  .stats-section {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    padding: 1.25rem;
    gap: 1rem;
  }

  .stat-icon {
    font-size: 1.75rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-change {
    font-size: 0.75rem;
  }

  .chart-card {
    padding: 1rem;
  }

  .chart-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .simple-chart {
    height: 200px;
  }

  .chart-bars {
    gap: 0.375rem;
  }

  .bar-label {
    font-size: 0.7rem;
  }

  .transactions-table th,
  .transactions-table td {
    padding: 0.75rem 0.375rem;
    font-size: 0.75rem;
  }

  .badge,
  .status {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }

  .legend-item {
    font-size: 0.85rem;
  }
}
</style>
