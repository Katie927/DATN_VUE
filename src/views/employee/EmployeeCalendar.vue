<template>
  <div class="wsm-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="logo">
        <a href="#" class="logo-link">
          <img src="/placeholder.svg" alt="WSM" />
          <span class="logo-text">WSM</span>
        </a>
      </div>

      <!-- User Info Card -->
      <div class="user-info-card">
        <img class="user-avatar" src="/placeholder.svg" alt="User" />
        <div class="user-info">
          <div class="user-name">Nguyễn Trọng Đức</div>
          <div class="user-email">duc.nt@zinza.com.vn</div>
        </div>
        <div class="user-cover"></div>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <div class="nav-filter">
          <input
            type="text"
            v-model="searchFilter"
            placeholder="Tìm tính năng"
            class="nav-search"
          />
        </div>

        <ul class="menu-list">
          <li class="menu-item" :class="{ active: activeTab === 'calendar' }">
            <a href="#" class="menu-link" @click="activeTab = 'calendar'">
              <i class="icon-calendar">📅</i>
              <span>Lịch làm việc</span>
            </a>
          </li>

          <li class="menu-item" :class="{ active: activeTab === 'tasks' }">
            <a href="#" class="menu-link" @click="activeTab = 'tasks'">
              <i class="icon-tasks">📋</i>
              <span>Công việc</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <button class="sidebar-toggle" @click="toggleSidebar">
            <i class="icon-menu">☰</i>
          </button>
        </div>

        <div class="header-center">
          <div class="announcement">
            <i class="icon-flag">🚩</i>
            <marquee>
              Thông báo, kể từ ngày 1/10/2025 đối với các Yêu cầu cập nhật thời gian làm việc, ACE
              ngoài việc điền lí do thì cần bổ sung thêm ảnh làm evidence. Điều này làm giảm thời
              gian xét duyệt và tăng tính chính xác, tin cậy. Xin chân thành cảm ơn!
            </marquee>
          </div>
        </div>

        <div class="header-right">
          <!-- Added WiFi status indicator -->
          <div class="wifi-status" :class="{ connected: isConnectedToCompanyWifi }">
            <i class="icon-wifi"></i>
            <span>{{ isConnectedToCompanyWifi ? 'WiFi Công ty' : 'Không kết nối' }}</span>
          </div>

          <button class="header-btn" @click="showSettings = true">
            <i class="icon-settings">⚙️</i>
          </button>

          <div class="notification-dropdown" :class="{ active: showNotifications }">
            <button class="header-btn" @click="toggleNotifications">
              <i class="icon-bell">🔔</i>
              <span class="notification-badge" v-if="notificationCount > 0">{{
                notificationCount
              }}</span>
            </button>

            <div class="dropdown-menu" v-show="showNotifications">
              <div class="dropdown-header">
                <h4>Thông báo</h4>
              </div>
              <div class="notification-tabs">
                <button
                  v-for="tab in notificationTabs"
                  :key="tab.key"
                  :class="{ active: activeNotificationTab === tab.key }"
                  @click="activeNotificationTab = tab.key"
                >
                  {{ tab.label }} [{{ tab.count }}]
                </button>
              </div>
              <div class="notification-list">
                <div
                  v-for="notification in filteredNotifications"
                  :key="notification.id"
                  class="notification-item"
                >
                  <div class="notification-content">
                    <div class="notification-text">{{ notification.text }}</div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                  <button class="notification-delete" @click="deleteNotification(notification.id)">
                    <i class="icon-trash">🗑️</i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="user-dropdown" :class="{ active: showUserMenu }">
            <button class="user-btn" @click="toggleUserMenu">
              <img class="user-avatar-small" src="/placeholder.svg" alt="User" />
            </button>

            <div class="dropdown-menu" v-show="showUserMenu">
              <div class="dropdown-header">
                <img class="user-avatar" src="/placeholder.svg" alt="User" />
                <div class="user-info">
                  <div class="user-name">Nguyễn Trọng Đức</div>
                  <div class="user-email">duc.nt@zinza.com.vn</div>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">Thông tin cá nhân</a>
              <a href="#" class="dropdown-item">Danh sách yêu cầu</a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item logout">Đăng xuất</a>
            </div>
          </div>
        </div>
      </header>

      <!-- Added tab navigation between calendar and tasks -->
      <div class="content-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'calendar' }"
          @click="activeTab = 'calendar'"
        >
          <i class="icon-calendar">📅</i>
          Lịch làm việc
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'tasks' }"
          @click="activeTab = 'tasks'"
        >
          <i class="icon-tasks">📋</i>
          Công việc
        </button>
      </div>

      <!-- Calendar Content -->
      <main class="page-content" v-show="activeTab === 'calendar'">
        <div class="calendar-container">
          <div class="calendar-header">
            <h1>{{ currentMonthName }} {{ currentYear }}</h1>
            <div class="calendar-controls">
              <button v-if="canCheckIn" class="btn btn-success" @click="checkIn">
                <i class="icon-sign-in">✅</i>
                Check-in
              </button>
              <button v-if="canCheckOut" class="btn btn-danger" @click="checkOut">
                <i class="icon-sign-out">❌</i>
                Check-out
              </button>
              <button class="btn btn-primary" @click="goToToday">
                <i class="icon-calendar">📅</i>
                Hôm nay
              </button>
              <div class="btn-group">
                <button class="btn btn-primary" @click="previousMonth">
                  <i class="icon-chevron-left">◀</i>
                </button>
                <button class="btn btn-primary" @click="nextMonth">
                  <i class="icon-chevron-right">▶</i>
                </button>
              </div>
            </div>
          </div>

          <div class="calendar-table">
            <table class="table">
              <thead>
                <tr>
                  <th v-for="day in weekDays" :key="day">{{ day }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="week in calendarWeeks" :key="week.id">
                  <td v-for="day in week.days" :key="day.date" :class="getDayClasses(day)">
                    <div class="day-header">
                      <div class="day-number">{{ day.day }}</div>
                    </div>

                    <!-- Removed check-in/check-out buttons from day cells, only show holiday badge -->
                    <div class="day-top-section">
                      <div v-if="day.holiday" class="holiday-badge">
                        {{ day.holiday }}
                      </div>
                    </div>

                    <!-- Show check times when user has checked in/out -->
                    <div v-if="day.checkTimes.length > 0" class="check-times">
                      <div
                        v-for="time in day.checkTimes"
                        :key="time.id"
                        :class="['time-badge', time.type]"
                      >
                        {{ time.time }}
                      </div>
                    </div>

                    <!-- Fixed colleagues section below check times -->
                    <div
                      v-if="day.colleagues && day.colleagues.length > 0"
                      class="colleagues-section"
                    >
                      <div class="colleagues-header">Cùng ca:</div>
                      <div class="colleagues-list">
                        <div
                          v-for="colleague in day.colleagues"
                          :key="colleague.id"
                          class="colleague-item"
                          :title="colleague.name"
                        >
                          <img
                            :src="colleague.avatar"
                            :alt="colleague.name"
                            class="colleague-avatar"
                          />
                          <span class="colleague-name">{{ colleague.shortName }}</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="day.events.length > 0" class="day-events">
                      <div v-for="event in day.events" :key="event.id" class="event">
                        <img :src="event.icon" :alt="event.type" class="event-icon" />
                        <span class="event-text">{{ event.text }}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <!-- Added Tasks Content -->
      <main class="page-content" v-show="activeTab === 'tasks'">
        <div class="tasks-container">
          <div class="tasks-header">
            <h1>Quản lý công việc</h1>
            <button class="btn btn-primary" @click="showAddTaskModal = true">
              <i class="icon-plus">➕</i>
              Thêm công việc
            </button>
          </div>

          <div class="tasks-content">
            <div class="tasks-section">
              <h3>Công việc cần làm ({{ todoTasks.length }})</h3>
              <div class="tasks-table-container">
                <table class="tasks-table">
                  <thead>
                    <tr>
                      <!-- Added checkbox column header -->
                      <th style="width: 50px">Chọn</th>
                      <th>Công việc</th>
                      <th>Mô tả</th>
                      <th>Độ ưu tiên</th>
                      <th>Hạn hoàn thành</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="task in todoTasks" :key="task.id" class="task-row">
                      <td class="task-title-cell">{{ task.title }}</td>
                      <td class="task-description-cell">{{ task.description }}</td>
                      <td>
                        <span class="task-priority" :class="task.priority">
                          {{ getPriorityText(task.priority) }}
                        </span>
                      </td>
                      <td class="task-deadline-cell">{{ task.deadline }}</td>
                      <!-- Changed to selection checkbox only -->
                      <td class="task-checkbox-cell">
                        <label class="task-checkbox">
                          <input type="checkbox" v-model="selectedTaskIds" :value="task.id" />
                          <span class="checkmark"></span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- Added complete button below the table -->
                <div class="table-actions" v-if="selectedTaskIds.length > 0">
                  <button class="btn btn-success" @click="completeSelectedTasks">
                    <i class="icon-check">✓</i>
                    Hoàn thành ({{ selectedTaskIds.length }})
                  </button>
                </div>
              </div>
            </div>

            <div class="tasks-section">
              <h3>Công việc đã hoàn thành ({{ completedTasks.length }})</h3>
              <div class="tasks-table-container">
                <table class="tasks-table">
                  <thead>
                    <tr>
                      <th>Công việc</th>
                      <th>Mô tả</th>
                      <th>Ngày hoàn thành</th>
                      <th>Hoàn thành</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="task in completedTasks"
                      :key="task.id"
                      class="task-row completed-task"
                    >
                      <td class="task-title-cell">{{ task.title }}</td>
                      <td class="task-description-cell">{{ task.description }}</td>
                      <td class="task-completed-date-cell">{{ task.completedDate }}</td>
                      <td class="task-checkbox-cell">
                        <label class="task-checkbox">
                          <input
                            type="checkbox"
                            :checked="task.completed"
                            @change="toggleTaskStatus(task.id)"
                          />
                          <span class="checkmark"></span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="modal-overlay" @click="showSettings = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>Layout Settings</h4>
          <button class="modal-close" @click="showSettings = false">
            <i class="icon-close">✖</i>
          </button>
        </div>
        <div class="modal-body">
          <div class="settings-section">
            <h5>App Layout</h5>
            <div class="setting-item">
              <label class="switch">
                <input type="checkbox" v-model="settings.fixedHeader" />
                <span class="slider"></span>
              </label>
              <span>Fixed Header</span>
            </div>
            <div class="setting-item">
              <label class="switch">
                <input type="checkbox" v-model="settings.fixedNavigation" />
                <span class="slider"></span>
              </label>
              <span>Fixed Navigation</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Added Add Task Modal -->
    <div v-if="showAddTaskModal" class="modal-overlay" @click="showAddTaskModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>Thêm công việc mới</h4>
          <button class="modal-close" @click="showAddTaskModal = false">
            <i class="icon-close">✖</i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addNewTask">
            <div class="form-group">
              <label>Tiêu đề công việc</label>
              <input type="text" v-model="newTask.title" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="newTask.description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Độ ưu tiên</label>
              <select v-model="newTask.priority" class="form-control">
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
            <div class="form-group">
              <label>Hạn hoàn thành</label>
              <input type="date" v-model="newTask.deadline" class="form-control" required />
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showAddTaskModal = false">
                Hủy
              </button>
              <button type="submit" class="btn btn-primary">Thêm công việc</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const sidebarCollapsed = ref(false)
const searchFilter = ref('')
const expandedMenus = ref({
  requests: false,
  minutes: false,
  library: false,
})
const showNotifications = ref(false)
const showUserMenu = ref(false)
const showSettings = ref(false)
const activeNotificationTab = ref('general')
const activeTab = ref('calendar')

const isCheckedIn = ref(false)
const hasCheckedOut = ref(false)
const currentMonth = ref(8) // September (0-indexed)
const currentYear = ref(2025)

const settings = ref({
  fixedHeader: true,
  fixedNavigation: true,
})

const weekDays = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật']
const monthNames = [
  'Tháng một',
  'Tháng hai',
  'Tháng ba',
  'Tháng tư',
  'Tháng năm',
  'Tháng sáu',
  'Tháng bảy',
  'Tháng tám',
  'Tháng chín',
  'Tháng mười',
  'Tháng mười một',
  'Tháng mười hai',
]

const notificationTabs = [
  { key: 'general', label: 'Chung', count: 0 },
  { key: 'requests', label: 'Yêu cầu', count: 3 },
  { key: 'minutes', label: 'Biên bản', count: 4 },
  { key: 'interviews', label: 'Cuộc phỏng vấn', count: 0 },
]

const notifications = ref([
  {
    id: 1,
    type: 'requests',
    text: 'Nguyễn Thành Hải đã phê duyệt Xin cấp phát thiết bị của bạn',
    time: '16:45 09-09-2025',
  },
  {
    id: 2,
    type: 'requests',
    text: 'Nguyễn Thành Hải đã phê duyệt Xin cấp phát thiết bị của bạn',
    time: '09:35 08-07-2025',
  },
  {
    id: 3,
    type: 'minutes',
    text: 'Nguyễn Thành Hải đã phê duyệt Biên bản bàn giao tài sản của bạn',
    time: '13:33 12-09-2025',
  },
])

const getLocalDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const generateCalendarData = () => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay() + 1) // Start from Monday

  const weeks = []
  let currentDate = new Date(startDate)
  const today = getLocalDateString(new Date())

  for (let week = 0; week < 6; week++) {
    const days = []
    for (let day = 0; day < 7; day++) {
      const isCurrentMonth = currentDate.getMonth() === month
      const dateString = getLocalDateString(currentDate)
      const isToday = dateString === today
      const isPast = currentDate < new Date().setHours(0, 0, 0, 0)

      days.push({
        date: dateString,
        day: currentDate.getDate(),
        isCurrentMonth,
        isPast,
        isToday,
        isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
        holiday: isCurrentMonth && currentDate.getDate() === 1 && month === 8 ? 'Quốc Khánh' : null,
        checkTimes:
          isCurrentMonth && isPast
            ? [
                { id: 1, time: '08:54', type: 'on-time' },
                { id: 2, time: '17:55', type: 'on-time' },
              ]
            : [],
        colleagues:
          isCurrentMonth && currentDate.getDate() === 3
            ? [
                { id: 1, name: 'Nguyễn Văn A', shortName: 'A', avatar: '/placeholder.svg' },
                { id: 2, name: 'Trần Thị B', shortName: 'B', avatar: '/placeholder.svg' },
                { id: 3, name: 'Lê Văn C', shortName: 'C', avatar: '/placeholder.svg' },
              ]
            : isCurrentMonth && currentDate.getDate() === 4
              ? [
                  { id: 1, name: 'Nguyễn Văn A', shortName: 'A', avatar: '/placeholder.svg' },
                  { id: 4, name: 'Phạm Văn D', shortName: 'D', avatar: '/placeholder.svg' },
                ]
              : isCurrentMonth && currentDate.getDate() === 5
                ? [
                    { id: 2, name: 'Trần Thị B', shortName: 'B', avatar: '/placeholder.svg' },
                    { id: 5, name: 'Hoàng Văn E', shortName: 'E', avatar: '/placeholder.svg' },
                  ]
                : [],
        events:
          isCurrentMonth && currentDate.getDate() === 1
            ? [
                { id: 1, type: 'birthday', icon: '/placeholder.svg', text: 'thai.nd' },
                { id: 2, type: 'anniversary', icon: '/placeholder.svg', text: 'manh.ld' },
              ]
            : [],
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }
    weeks.push({ id: week, days })

    // Stop if we've covered the entire month and some of next month
    if (currentDate.getMonth() !== month && week >= 4) break
  }

  return weeks
}

const calendarWeeks = ref(generateCalendarData())

// WiFi and check-in state
const isConnectedToCompanyWifi = ref(true) // Simulate WiFi connection
const showAddTaskModal = ref(false)

const newTask = ref({
  title: '',
  description: '',
  priority: 'medium',
  deadline: '',
})

const selectedTaskIds = ref([])

const tasks = ref([
  {
    id: 1,
    title: 'Hoàn thành báo cáo tháng 9',
    description: 'Tổng hợp và phân tích dữ liệu kinh doanh tháng 9',
    priority: 'high',
    deadline: '2025-09-30',
    completed: false,
    completedDate: null,
  },
  {
    id: 2,
    title: 'Họp team weekly',
    description: 'Cuộc họp hàng tuần với team development',
    priority: 'medium',
    deadline: '2025-09-27',
    completed: false,
    completedDate: null,
  },
  {
    id: 3,
    title: 'Review code cho dự án ABC',
    description: 'Kiểm tra và đánh giá code của các thành viên',
    priority: 'medium',
    deadline: '2025-09-28',
    completed: true,
    completedDate: '2025-09-25',
  },
])

// Computed properties
const currentMonthName = computed(() => monthNames[currentMonth.value])

const canCheckIn = computed(() => {
  return !isCheckedIn.value && !hasCheckedOut.value
})

const canCheckOut = computed(() => {
  return isCheckedIn.value && !hasCheckedOut.value
})

const notificationCount = computed(() => {
  return notifications.value.length
})

const filteredNotifications = computed(() => {
  if (activeNotificationTab.value === 'general') {
    return notifications.value.filter((n) => n.type === 'general')
  }
  return notifications.value.filter((n) => n.type === activeNotificationTab.value)
})

const todoTasks = computed(() => {
  return tasks.value.filter((task) => !task.completed)
})

const completedTasks = computed(() => {
  return tasks.value.filter((task) => task.completed)
})

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleSubmenu = (menu) => {
  expandedMenus.value[menu] = !expandedMenus.value[menu]
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const deleteNotification = (id) => {
  const index = notifications.value.findIndex((n) => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const checkIn = () => {
  isCheckedIn.value = true
  const now = new Date()
  const today = getLocalDateString(now)
  const time = now.toTimeString().slice(0, 5)

  // Add check-in time to today's calendar entry
  calendarWeeks.value.forEach((week) => {
    week.days.forEach((day) => {
      if (day.date === today) {
        day.checkTimes.push({ id: Date.now(), time, type: 'on-time' })
      }
    })
  })
}

const checkOut = () => {
  hasCheckedOut.value = true
  const now = new Date()
  const today = getLocalDateString(now)
  const time = now.toTimeString().slice(0, 5)

  // Add check-out time to today's calendar entry
  calendarWeeks.value.forEach((week) => {
    week.days.forEach((day) => {
      if (day.date === today) {
        day.checkTimes.push({ id: Date.now(), time, type: 'on-time' })
      }
    })
  })
}

const goToToday = () => {
  const today = new Date()
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
  calendarWeeks.value = generateCalendarData()
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  calendarWeeks.value = generateCalendarData()
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  calendarWeeks.value = generateCalendarData()
}

const getDayClasses = (day) => {
  return {
    past: day.isPast,
    'current-month': day.isCurrentMonth,
    weekend: day.isWeekend,
    holiday: day.holiday,
    today: day.isToday,
  }
}

const toggleTaskStatus = (taskId) => {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) {
    task.completed = !task.completed
    if (task.completed) {
      task.completedDate = new Date().toLocaleDateString('vi-VN')
    } else {
      task.completedDate = null
    }
  }
}

const completeSelectedTasks = () => {
  const now = new Date().toLocaleDateString('vi-VN')
  selectedTaskIds.value.forEach((taskId) => {
    const task = tasks.value.find((t) => t.id === taskId)
    if (task && !task.completed) {
      task.completed = true
      task.completedDate = now
    }
  })
  // Clear selection after completing
  selectedTaskIds.value = []
}

const deleteTask = (taskId) => {
  const index = tasks.value.findIndex((t) => t.id === taskId)
  if (index > -1) {
    tasks.value.splice(index, 1)
  }
}

const addNewTask = () => {
  const task = {
    id: Date.now(),
    title: newTask.value.title,
    description: newTask.value.description,
    priority: newTask.value.priority,
    deadline: newTask.value.deadline,
    completed: false,
    completedDate: null,
  }

  tasks.value.push(task)

  // Reset form
  newTask.value = {
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
  }

  showAddTaskModal.value = false
}

const getPriorityText = (priority) => {
  const priorities = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
  }
  return priorities[priority] || priority
}

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notification-dropdown')) {
      showNotifications.value = false
    }
    if (!e.target.closest('.user-dropdown')) {
      showUserMenu.value = false
    }
  })

  // Simulate WiFi connection check
  setInterval(() => {
    // In real app, this would check actual WiFi connection
    // isConnectedToCompanyWifi.value = checkCompanyWifiConnection()
  }, 5000)
})
</script>

<style scoped>
.wsm-dashboard {
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8f9fa;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar-collapsed {
  width: 70px;
}

.logo {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-link {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
}

.logo img {
  width: 32px;
  height: 32px;
}

.logo-text {
  margin-left: 0.5rem;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-info-card {
  position: relative;
  padding: 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem;
  border-radius: 8px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.user-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.875rem;
  opacity: 0.8;
}

.nav-menu {
  padding: 1rem 0;
}

.nav-search {
  width: calc(100% - 2rem);
  padding: 0.5rem;
  margin: 0 1rem 1rem 1rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-search::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 0.25rem;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
}

.menu-link:hover,
.menu-item.active .menu-link {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-link i {
  width: 20px;
  margin-right: 0.75rem;
}

.submenu-arrow {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.submenu-arrow.rotated {
  transform: rotate(180deg);
}

.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(0, 0, 0, 0.1);
}

.submenu a {
  display: block;
  padding: 0.5rem 1rem 0.5rem 3rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;
}

.submenu a:hover {
  color: white;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Reduced padding from 1.5rem to 0.5rem to bring calendar closer to header */
.page-content {
  flex: 1;
  padding: 0 1.5rem 1.5rem 1.5rem;
  overflow-y: auto;
}

.header {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 60px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.sidebar-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.sidebar-toggle:hover {
  background: #f8f9fa;
}

.header-center {
  flex: 1;
  margin: 0 1rem;
}

.announcement {
  display: flex;
  align-items: center;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 0.5rem;
  color: #856404;
}

.announcement i {
  margin-right: 0.5rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
  position: relative;
}

.header-btn:hover {
  background: #f8f9fa;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-btn {
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

/* Dropdown Styles */
.notification-dropdown,
.user-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  z-index: 1000;
}

.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
}

.dropdown-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.dropdown-divider {
  height: 1px;
  background: #e9ecef;
  margin: 0.5rem 0;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #495057;
  text-decoration: none;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item.logout {
  color: #dc3545;
}

.notification-tabs {
  display: flex;
  border-bottom: 1px solid #e9ecef;
}

.notification-tabs button {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6c757d;
  transition: all 0.2s ease;
}

.notification-tabs button.active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f8f9fa;
}

.notification-content {
  flex: 1;
}

.notification-text {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #6c757d;
}

.notification-delete {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
}

/* Content Tabs */
.content-tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 0 1rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #495057;
}

.tab-btn.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.tab-btn i {
  margin-right: 0.5rem;
}

/* Calendar Styles */
.calendar-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.calendar-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn i {
  margin-right: 0.5rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #1e7e34;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-group {
  display: flex;
}

.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.btn-group .btn:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.calendar-table {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  border-bottom: 1px solid #e9ecef;
}

.table td {
  padding: 0;
  border: 1px solid #e9ecef;
  vertical-align: top;
  height: 120px;
  width: 14.28%;
  position: relative;
}

.table td.past {
  background: #f8f9fa;
}

.table td.weekend {
  background: #fff5f5;
}

.table td.holiday {
  background: #fff3cd;
}

.table td.today {
  background: #e3f2fd;
  border: 2px solid #2196f3;
}

.table td:not(.current-month) {
  color: #ccc;
  background: #fafafa;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.day-number {
  font-weight: 600;
  font-size: 0.875rem;
}

/* Simplified day-top-section to only show holidays */
.day-top-section {
  min-height: 24px;
}

.holiday-badge {
  background: #ffc107;
  color: #212529;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0.25rem;
  text-align: center;
}

.colleagues-section {
  margin: 0.25rem;
}

.colleagues-header {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.colleagues-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.colleague-item {
  display: flex;
  align-items: center;
  background: #e3f2fd;
  border-radius: 12px;
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
}

.colleague-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 0.25rem;
}

.colleague-name {
  font-weight: 500;
}

.check-times {
  margin: 0.25rem;
}

.time-badge {
  display: inline-block;
  background: #28a745;
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0.125rem;
}

.time-badge.late {
  background: #ffc107;
  color: #212529;
}

.time-badge.early {
  background: #17a2b8;
}

.day-events {
  margin: 0.25rem;
}

.event {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.event-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.25rem;
}

.event-text {
  font-size: 0.75rem;
  color: #495057;
}

/* Tasks Styles */
.tasks-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tasks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.tasks-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.tasks-content {
  padding: 1.5rem;
}

.tasks-section {
  margin-bottom: 2rem;
}

.tasks-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #495057;
}

.tasks-table-container {
  overflow-x: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
}

.tasks-table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #e9ecef;
  white-space: nowrap;
}

.tasks-table td {
  padding: 1rem;
  border-bottom: 1px solid #f8f9fa;
  vertical-align: middle;
}

.task-row:hover {
  background: #f8f9fa;
}

.task-row.completed-task {
  color: #6c757d;
  background: #f8f9fa;
}

.task-title-cell {
  font-weight: 500;
  min-width: 200px;
}

.task-description-cell {
  max-width: 300px;
  word-wrap: break-word;
}

.task-priority {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.task-priority.high {
  background: #f8d7da;
  color: #721c24;
}

.task-priority.medium {
  background: #fff3cd;
  color: #856404;
}

.task-priority.low {
  background: #d1ecf1;
  color: #0c5460;
}

.task-deadline-cell,
.task-completed-date-cell {
  white-space: nowrap;
}

/* Simplified task checkbox cell to center align */
.task-checkbox-cell {
  text-align: center;
  width: 50px;
}

.task-checkbox {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.task-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.task-checkbox:hover .checkmark {
  border-color: #007bff;
}

.task-checkbox input:checked ~ .checkmark {
  background: #007bff;
  border-color: #007bff;
}

.task-checkbox input:checked ~ .checkmark:after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Added styles for table actions section below the table */
.table-actions {
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.modal-close:hover {
  background: #f8f9fa;
}

.modal-body {
  padding: 1.5rem;
}

.settings-section h5 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.setting-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.setting-item span {
  margin-left: 0.75rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #007bff;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: fixed;
    top: 0;
    left: -100%;
    z-index: 1000;
    transition: left 0.3s ease;
  }

  .sidebar.active {
    left: 0;
  }

  .main-content {
    width: 100%;
  }

  .calendar-header {
    flex-direction: column;
    gap: 1rem;
  }

  .calendar-controls {
    flex-wrap: wrap;
  }

  .tasks-table-container {
    font-size: 0.875rem;
  }

  .tasks-table th,
  .tasks-table td {
    padding: 0.5rem;
  }

  .task-description-cell {
    max-width: 150px;
  }
}
</style>
