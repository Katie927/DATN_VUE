<template>
  <div class="app-container" :class="{ dark: isDarkMode }">
    <!-- Header with sticky position -->
    <header class="header">
      <div class="header-left">
        <h1 class="app-title">🔧 Sửa chữa Điện thoại</h1>
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
      <!-- Top Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📱</div>
          <div class="stat-info">
            <div class="stat-label">Đang sửa</div>
            <div class="stat-value">{{ pendingTasks.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-label">Hoàn thành hôm nay</div>
            <div class="stat-value">{{ completedTasks.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏰</div>
          <div class="stat-info">
            <div class="stat-label">Trung bình thời gian</div>
            <div class="stat-value">2.5h</div>
          </div>
        </div>
      </div>

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
          <div
            v-for="day in weekDays"
            :key="day.date"
            class="day-column"
            :class="{ today: day.isToday }"
          >
            <div class="day-header">
              <div class="day-name">{{ day.name }}</div>
              <div class="day-date">{{ day.date }}</div>
            </div>
            <!-- CHANGE: Removed shift sections, display all staff in single area with balanced heights -->
            <div class="staff-list">
              <div v-for="staff in day.allStaff" :key="staff" class="staff-item">
                {{ staff }}
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
            <h3 class="card-title">🔴 Công việc chưa hoàn thành</h3>
            <span class="task-count pending-count">{{ pendingTasks.length }}</span>
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
                <div class="task-details">
                  <span class="task-name">{{ task.name }}</span>
                  <span class="task-device">{{ task.device }}</span>
                </div>
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
            <h3 class="card-title">🟢 Công việc đã hoàn thành</h3>
            <span class="task-count completed-count">{{ completedTasks.length }}</span>
          </div>
          <div class="tasks-list">
            <!-- CHANGE: Completed tasks now have enabled checkbox to move back to pending -->
            <div v-for="task in completedTasks" :key="task.id" class="task-item completed">
              <input
                type="checkbox"
                :id="`completed-task-${task.id}`"
                checked
                @change="uncompleteTasks(task.id)"
                class="task-checkbox"
              />
              <label :for="`completed-task-${task.id}`" class="task-label">
                <div class="task-details">
                  <span class="task-name">{{ task.name }}</span>
                  <span class="task-device">{{ task.device }}</span>
                </div>
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
  name: 'Trần Văn B',
  email: 'tranvanb@phone.com',
  phone: '0987654321',
  department: 'Sửa chữa điện thoại',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=repair1',
})

const notifications = ref([
  { id: 1, icon: '⚠️', text: 'Khách hàng chờ sửa iPhone bị vỡ màn hình', time: '10 phút trước' },
  { id: 2, icon: '✅', text: 'Hoàn thành sửa Samsung Galaxy A53', time: '45 phút trước' },
  { id: 3, icon: '📦', text: 'Linh kiện thay thế đã về kho', time: '2 giờ trước' },
])

const allTasks = ref([
  {
    id: 1,
    name: 'Thay pin',
    device: 'iPhone 13 Pro',
    time: '09:00',
    selected: false,
    completed: false,
  },
  {
    id: 2,
    name: 'Sửa màn hình vỡ',
    device: 'Samsung Galaxy S23',
    time: '10:30',
    selected: false,
    completed: false,
  },
  {
    id: 3,
    name: 'Thay cổng sạc',
    device: 'Xiaomi 12',
    time: '11:00',
    selected: false,
    completed: false,
  },
  {
    id: 4,
    name: 'Vệ sinh bụi',
    device: 'iPhone 14',
    time: '14:00',
    selected: false,
    completed: true,
  },
  {
    id: 5,
    name: 'Thay loa ngoài',
    device: 'Oppo A54',
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
  const todayDate = today.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })

  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1 + currentWeekOffset.value * 7)

  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
  const staffList = ['Trần B', 'Lê C', 'Phạm D', 'Hoàng E', 'Nguyễn F']

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })

    // CHANGE: Combine morning and afternoon staff, check if day is today
    const morning = staffList.slice(0, Math.floor(Math.random() * 3) + 2)
    const afternoon = staffList.slice(0, Math.floor(Math.random() * 3) + 2)
    const allStaff = [...new Set([...morning, ...afternoon])]

    days.push({
      name: dayNames[i],
      date: dateStr,
      allStaff: allStaff,
      isToday: dateStr === todayDate && currentWeekOffset.value === 0,
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

// CHANGE: New function to move task from completed back to pending
const uncompleteTasks = (taskId) => {
  const task = allTasks.value.find((t) => t.id === taskId)
  if (task) {
    task.completed = false
  }
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
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background 0.3s ease;
}

.app-container.dark {
  background: linear-gradient(135deg, #1a2e1a 0%, #1f3a1f 100%);
  color: #e0e0e0;
}

/* CHANGE: Header is now sticky */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid #10b981;
}

.app-container.dark .header {
  background: rgba(26, 46, 26, 0.95);
  border-bottom-color: #34d399;
}

.app-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #10b981;
}

.app-container.dark .app-title {
  color: #34d399;
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
  background: rgba(26, 46, 26, 0.95);
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
  background: rgba(16, 185, 129, 0.05);
}

.app-container.dark .dropdown-item:hover {
  background: rgba(52, 211, 153, 0.1);
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
  border: 2px solid #10b981;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #10b981;
}

.app-container.dark .stat-card {
  background: rgba(26, 46, 26, 0.95);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.app-container.dark .stat-label {
  color: #aaa;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #10b981;
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
  background: rgba(26, 46, 26, 0.95);
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
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-nav:hover {
  background: #059669;
  transform: translateY(-2px);
}

.week-range {
  font-weight: 600;
  color: #10b981;
  min-width: 200px;
  text-align: center;
}

.app-container.dark .week-range {
  color: #34d399;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.day-column {
  background: rgba(16, 185, 129, 0.05);
  border-radius: 8px;
  padding: 1rem;
  border: 2px solid #10b981;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

/* CHANGE: Highlight today's date with different background */
.day-column.today {
  background: rgba(16, 185, 129, 0.15);
  border-color: #047857;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.app-container.dark .day-column {
  background: rgba(52, 211, 153, 0.1);
  border-color: #34d399;
}

.app-container.dark .day-column.today {
  background: rgba(52, 211, 153, 0.2);
  border-color: #10b981;
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.3);
}

.day-header {
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #10b981;
}

.day-name {
  font-weight: 700;
  color: #10b981;
  font-size: 0.95rem;
}

.day-date {
  font-size: 0.85rem;
  color: #666;
}

.app-container.dark .day-date {
  color: #aaa;
}

/* CHANGE: Unified staff list with balanced heights */
.staff-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  background: white;
  border-radius: 6px;
  padding: 0.75rem;
  min-height: 120px;
}

.app-container.dark .staff-list {
  background: rgba(255, 255, 255, 0.05);
}

.staff-item {
  padding: 0.5rem 0;
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
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
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: white;
}

.pending-count {
  background: #ef4444;
}

.completed-count {
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
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 6px;
  border-left: 3px solid #ef4444;
  transition: all 0.3s;
}

.task-item.completed {
  background: rgba(16, 185, 129, 0.1);
  border-left-color: #10b981;
  opacity: 0.7;
}

.task-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #10b981;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.task-label {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  gap: 0.75rem;
}

.task-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.task-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.app-container.dark .task-name {
  color: #e0e0e0;
}

.task-device {
  font-size: 0.8rem;
  color: #999;
}

.app-container.dark .task-device {
  color: #aaa;
}

.task-time {
  font-size: 0.8rem;
  color: #999;
  white-space: nowrap;
}

.app-container.dark .task-time {
  color: #aaa;
}

.btn-complete {
  background: #10b981;
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
  background: #059669;
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
  background: #1a2e1a;
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
  border: 3px solid #10b981;
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
  background: #10b981;
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
  background: #059669;
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
  border-color: #10b981;
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

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
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

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
