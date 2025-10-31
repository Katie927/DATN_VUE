<template>
  <div class="app-container" :class="{ dark: isDarkMode }">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <h1 class="app-title">📱 Chăm sóc Khách hàng</h1>
      </div>
      <div class="header-right">
        <button class="btn-dark-mode" @click="isDarkMode = !isDarkMode">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
        <!-- Bell icon with dropdown notifications -->
        <div class="notifications-dropdown">
          <button class="btn-bell" @click="showNotifications = !showNotifications">
            🔔
            <span v-if="notifications.length > 0" class="notif-badge">{{
              notifications.length
            }}</span>
          </button>
          <div v-if="showNotifications" class="dropdown-menu">
            <div class="dropdown-header">Thông báo</div>
            <div class="dropdown-list">
              <div v-for="notif in notifications" :key="notif.id" class="dropdown-item">
                <div class="notif-icon">{{ notif.icon }}</div>
                <div class="notif-content">
                  <p class="notif-text">{{ notif.text }}</p>
                  <span class="notif-time">{{ notif.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="avatar-container">
          <img
            :src="currentUser.avatar"
            :alt="currentUser.name"
            class="avatar"
            @click="showProfile = true"
          />
          <span class="user-name">{{ currentUser.name }}</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Weekly Schedule - Full Width -->
      <div class="card schedule-card">
        <div class="schedule-header">
          <h2 class="card-title">📅 Lịch làm việc tuần</h2>
          <div class="week-nav">
            <button class="btn-nav" @click="previousWeek">← Tuần trước</button>
            <span class="week-range">{{ weekRange }}</span>
            <button class="btn-nav" @click="nextWeek">Tuần sau →</button>
          </div>
        </div>

        <div class="schedule-grid">
          <div v-for="day in weekDays" :key="day.date" class="day-column">
            <div class="day-header">
              <div class="day-name">{{ day.name }}</div>
              <div class="day-date">{{ day.date }}</div>
            </div>
            <div class="shifts">
              <div class="shift morning">
                <div class="shift-time">Sáng (8-12h)</div>
                <div v-for="staff in day.morning" :key="staff" class="staff-item">
                  {{ staff }}
                </div>
              </div>
              <div class="shift afternoon">
                <div class="shift-time">Chiều (13-18h)</div>
                <div v-for="staff in day.afternoon" :key="staff" class="staff-item">
                  {{ staff }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks Section -->
      <div class="tasks-section">
        <!-- Pending Tasks -->
        <div class="card tasks-card">
          <div class="tasks-header">
            <h3 class="card-title">📋 Công việc chưa hoàn thành</h3>
            <span class="task-count">{{ pendingTasks.length }}</span>
          </div>
          <div class="tasks-list">
            <div v-for="task in pendingTasks" :key="task.id" class="task-item pending">
              <input
                type="checkbox"
                :id="`task-${task.id}`"
                v-model="task.selected"
                class="task-checkbox"
              />
              <label :for="`task-${task.id}`" class="task-label">
                <span class="task-name">{{ task.name }}</span>
                <span class="task-time">{{ task.time }}</span>
              </label>
            </div>
          </div>
          <button v-if="hasSelectedTasks" class="btn-complete" @click="completeTasks">
            ✓ Hoàn thành ({{ selectedCount }})
          </button>
        </div>

        <!-- Completed Tasks -->
        <div class="card tasks-card">
          <div class="tasks-header">
            <h3 class="card-title">✅ Công việc đã hoàn thành</h3>
            <span class="task-count completed">{{ completedTasks.length }}</span>
          </div>
          <div class="tasks-list">
            <div v-for="task in completedTasks" :key="task.id" class="task-item completed">
              <input type="checkbox" checked disabled class="task-checkbox" />
              <label class="task-label">
                <span class="task-name">{{ task.name }}</span>
                <span class="task-time">{{ task.time }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Profile Modal -->
    <div v-if="showProfile" class="modal-overlay" @click="showProfile = false">
      <div class="modal-content" @click.stop>
        <button class="btn-close" @click="showProfile = false">✕</button>
        <div v-if="!editingProfile" class="profile-view">
          <img :src="currentUser.avatar" :alt="currentUser.name" class="profile-avatar" />
          <h2 class="profile-name">{{ currentUser.name }}</h2>
          <p class="profile-info">📧 {{ currentUser.email }}</p>
          <p class="profile-info">📱 {{ currentUser.phone }}</p>
          <p class="profile-info">🏢 {{ currentUser.department }}</p>
          <button class="btn-edit" @click="editingProfile = true">Chỉnh sửa thông tin</button>
        </div>
        <div v-else class="profile-edit">
          <h2 class="profile-title">Chỉnh sửa thông tin</h2>
          <div class="form-group">
            <label>Tên:</label>
            <input v-model="currentUser.name" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="currentUser.email" type="email" class="form-input" />
          </div>
          <div class="form-group">
            <label>Điện thoại:</label>
            <input v-model="currentUser.phone" type="tel" class="form-input" />
          </div>
          <div class="form-group">
            <label>Phòng ban:</label>
            <input v-model="currentUser.department" type="text" class="form-input" />
          </div>
          <div class="form-actions">
            <button class="btn-save" @click="editingProfile = false">Lưu</button>
            <button class="btn-cancel" @click="editingProfile = false">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isDarkMode = ref(false)
const showProfile = ref(false)
const editingProfile = ref(false)
const showNotifications = ref(false)
const currentWeekOffset = ref(0)

const currentUser = ref({
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@phone.com',
  phone: '0912345678',
  department: 'Chăm sóc khách hàng',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer1',
})

const notifications = ref([
  { id: 1, icon: '📞', text: 'Khách hàng cần tư vấn iPhone 15', time: '5 phút trước' },
  { id: 2, icon: '⭐', text: 'Đánh giá tích cực từ khách hàng', time: '30 phút trước' },
  { id: 3, icon: '📦', text: 'Hàng mới về: Samsung Galaxy S24', time: '1 giờ trước' },
])

const allTasks = ref([
  {
    id: 1,
    name: 'Tư vấn khách hàng về iPhone 15 Pro',
    time: '09:00',
    selected: false,
    completed: false,
  },
  { id: 2, name: 'Xử lý khiếu nại về bảo hành', time: '10:30', selected: false, completed: false },
  {
    id: 3,
    name: 'Cập nhật thông tin khách hàng VIP',
    time: '11:00',
    selected: false,
    completed: false,
  },
  { id: 4, name: 'Gọi điện xác nhận đơn hàng', time: '14:00', selected: false, completed: true },
  {
    id: 5,
    name: 'Gửi email khuyến mãi cho khách hàng',
    time: '15:30',
    selected: false,
    completed: true,
  },
])

const pendingTasks = computed(() => allTasks.value.filter((t) => !t.completed))
const completedTasks = computed(() => allTasks.value.filter((t) => t.completed))
const hasSelectedTasks = computed(() => allTasks.value.some((t) => t.selected && !t.completed))
const selectedCount = computed(
  () => allTasks.value.filter((t) => t.selected && !t.completed).length,
)

const weekDays = computed(() => {
  const days = []
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1 + currentWeekOffset.value * 7)

  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
  const staffList = ['Nguyễn A', 'Trần B', 'Lê C', 'Phạm D', 'Hoàng E']

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    days.push({
      name: dayNames[i],
      date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      morning: staffList.slice(0, Math.floor(Math.random() * 3) + 2),
      afternoon: staffList.slice(0, Math.floor(Math.random() * 3) + 2),
    })
  }
  return days
})

const weekRange = computed(() => {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1 + currentWeekOffset.value * 7)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const formatDate = (d) =>
    d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return `${formatDate(monday)} - ${formatDate(sunday)}`
})

const previousWeek = () => {
  currentWeekOffset.value--
}

const nextWeek = () => {
  currentWeekOffset.value++
}

const completeTasks = () => {
  allTasks.value.forEach((task) => {
    if (task.selected && !task.completed) {
      task.completed = true
      task.selected = false
    }
  })
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background 0.3s ease;
}

.app-container.dark {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #e0e0e0;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid #3b82f6;
  position: relative;
}

.app-container.dark .header {
  background: rgba(30, 30, 46, 0.95);
  border-bottom-color: #60a5fa;
}

.app-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #3b82f6;
}

.app-container.dark .app-title {
  color: #60a5fa;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-dark-mode {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s;
}

.btn-dark-mode:hover {
  background: rgba(0, 0, 0, 0.1);
}

.app-container.dark .btn-dark-mode:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Bell icon dropdown styles */
.notifications-dropdown {
  position: relative;
}

.btn-bell {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s;
  position: relative;
}

.btn-bell:hover {
  background: rgba(0, 0, 0, 0.1);
}

.app-container.dark .btn-bell:hover {
  background: rgba(255, 255, 255, 0.1);
}

.notif-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  min-width: 300px;
  max-width: 400px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.app-container.dark .dropdown-menu {
  background: rgba(30, 30, 46, 0.95);
}

.dropdown-header {
  padding: 1rem;
  font-weight: 700;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
}

.app-container.dark .dropdown-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.dropdown-list {
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: rgba(59, 130, 246, 0.05);
}

.app-container.dark .dropdown-item:hover {
  background: rgba(96, 165, 250, 0.1);
}

.notif-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
}

.notif-text {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #333;
}

.app-container.dark .notif-text {
  color: #e0e0e0;
}

.notif-time {
  font-size: 0.75rem;
  color: #999;
}

.app-container.dark .notif-time {
  color: #aaa;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #3b82f6;
  transition: transform 0.3s;
}

.avatar:hover {
  transform: scale(1.1);
}

.user-name {
  font-weight: 600;
  color: #333;
}

.app-container.dark .user-name {
  color: #e0e0e0;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.app-container.dark .card {
  background: rgba(30, 30, 46, 0.95);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
}

.app-container.dark .card-title {
  color: #f0f0f0;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.week-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-nav {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-nav:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.week-range {
  font-weight: 600;
  color: #3b82f6;
  min-width: 200px;
  text-align: center;
}

.app-container.dark .week-range {
  color: #60a5fa;
}

/* Schedule grid with balanced shift heights */
.schedule-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.day-column {
  background: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
  padding: 1rem;
  border: 2px solid #3b82f6;
  display: flex;
  flex-direction: column;
}

.app-container.dark .day-column {
  background: rgba(96, 165, 250, 0.1);
  border-color: #60a5fa;
}

.day-header {
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #3b82f6;
}

.day-name {
  font-weight: 700;
  color: #3b82f6;
  font-size: 0.95rem;
}

.day-date {
  font-size: 0.85rem;
  color: #666;
}

.app-container.dark .day-date {
  color: #aaa;
}

.shifts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.shift {
  background: white;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.85rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100px;
}

.app-container.dark .shift {
  background: rgba(255, 255, 255, 0.05);
}

.shift.morning {
  border-left: 3px solid #fbbf24;
}

.shift.afternoon {
  border-left: 3px solid #f87171;
}

.shift-time {
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
}

.app-container.dark .shift-time {
  color: #e0e0e0;
}

.staff-item {
  padding: 0.25rem 0;
  color: #666;
  font-size: 0.8rem;
}

.app-container.dark .staff-item {
  color: #aaa;
}

.tasks-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.tasks-card {
  display: flex;
  flex-direction: column;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.task-count {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.task-count.completed {
  background: #10b981;
}

.tasks-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
  transition: all 0.3s;
}

.task-item.completed {
  background: rgba(16, 185, 129, 0.05);
  border-left-color: #10b981;
  opacity: 0.7;
}

.task-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.task-label {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.task-name {
  font-weight: 500;
  color: #333;
}

.app-container.dark .task-name {
  color: #e0e0e0;
}

.task-time {
  font-size: 0.8rem;
  color: #999;
}

.app-container.dark .task-time {
  color: #aaa;
}

.btn-complete {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.btn-complete:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.app-container.dark .modal-content {
  background: #1a1a2e;
  color: #e0e0e0;
}

.btn-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.profile-view {
  text-align: center;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 3px solid #3b82f6;
}

.profile-name {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
}

.app-container.dark .profile-name {
  color: #f0f0f0;
}

.profile-info {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.95rem;
}

.app-container.dark .profile-info {
  color: #aaa;
}

.btn-edit {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s;
}

.btn-edit:hover {
  background: #2563eb;
}

.profile-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.app-container.dark .profile-title {
  color: #f0f0f0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.app-container.dark .form-group label {
  color: #e0e0e0;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.app-container.dark .form-input {
  background: rgba(255, 255, 255, 0.1);
  border-color: #444;
  color: #e0e0e0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-save,
.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save {
  background: #10b981;
  color: white;
}

.btn-save:hover {
  background: #059669;
}

.btn-cancel {
  background: #ef4444;
  color: white;
}

.btn-cancel:hover {
  background: #dc2626;
}

@media (max-width: 1200px) {
  .schedule-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .tasks-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .schedule-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .schedule-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .week-nav {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
