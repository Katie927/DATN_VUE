<template>
  <div class="employee-schedule">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="profile">
        <img src="https://i.pravatar.cc/100" alt="avatar" />
        <p class="name">Nguyễn Trọng Đức</p>
        <span class="email">duc.nt@zinza.com.vn</span>
      </div>
      <nav>
        <ul>
          <li :class="{ active: tab === 'schedule' }" @click="tab = 'schedule'">
            📅 Lịch làm việc
          </li>
          <li :class="{ active: tab === 'tasks' }" @click="tab = 'tasks'">✅ Công việc</li>
          <li>📂 Các yêu cầu</li>
          <li>📝 Các biên bản</li>
          <li>📚 Thư viện</li>
          <li>📋 Bảng tạm</li>
        </ul>
      </nav>
    </aside>

    <!-- Nội dung chính -->
    <main class="content">
      <!-- Lịch làm việc -->
      <section v-if="tab === 'schedule'">
        <header class="topbar">
          <div class="month-control">
            <button class="month-btn" @click="moveMonth(-1)">‹</button>
            <h2>{{ currentMonthName }}</h2>
            <button class="month-btn" @click="moveMonth(1)">›</button>
          </div>
          <button
            class="btn-toggle"
            :class="checkedIn && !checkedOut ? 'out' : 'in'"
            @click="handleCheck"
          >
            {{ checkedIn && !checkedOut ? 'Check-out' : 'Check-in' }}
          </button>
        </header>

        <div class="calendar">
          <div class="calendar-header">
            <div v-for="d in daysOfWeek" :key="d">{{ d }}</div>
          </div>
          <div class="calendar-grid">
            <div
              v-for="day in calendarDays"
              :key="day.date"
              class="calendar-cell"
              :class="{ today: day.isToday }"
            >
              <div class="date">{{ day.day }}</div>
              <div class="shifts">
                <div v-for="shift in mockShifts[day.date] || []" :key="shift.id" class="shift">
                  <span class="name">{{ shift.name }}</span>
                  <span v-if="shift.checkIn" class="time in">{{ shift.checkIn }}</span>
                  <span v-if="shift.checkOut" class="time out">{{ shift.checkOut }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Công việc -->
      <section v-else>
        <header class="topbar">
          <h2>Danh sách công việc</h2>
        </header>
        <div class="tasks">
          <h3>🕒 Cần làm</h3>
          <ul>
            <li v-for="task in pendingTasks" :key="task.id">
              <input type="checkbox" @change="toggleTask(task)" />
              {{ task.title }}
            </li>
          </ul>

          <h3>✅ Đã hoàn thành</h3>
          <ul class="done">
            <li v-for="task in doneTasks" :key="task.id">
              <input type="checkbox" checked disabled />
              {{ task.title }}
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const tab = ref('schedule')
const viewDate = ref(new Date())
const todayDate = new Date()

const checkedIn = ref(false)
const checkedOut = ref(false)

const mockShifts = {
  '2025-09-03': [
    { id: 1, name: 'anh.nt', checkIn: '08:54', checkOut: '17:55' },
    { id: 2, name: 'thach.dv', checkIn: '09:00', checkOut: '18:00' },
  ],
}

const tasks = ref([
  { id: 1, title: 'Hoàn thành báo cáo tuần', done: false },
  { id: 2, title: 'Họp dự án 9h sáng', done: false },
  { id: 3, title: 'Review code', done: true },
])

const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const currentMonthName = computed(() =>
  viewDate.value.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
  }),
)

function isoDate(date) {
  return date.toISOString().split('T')[0]
}

const calendarDays = computed(() => {
  const start = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1)
  const end = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 0)
  const days = []
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    days.push({
      day: d.getDate(),
      date: isoDate(new Date(d)),
      isToday: isoDate(new Date(d)) === isoDate(todayDate),
    })
  }
  return days
})

function moveMonth(offset) {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + offset, 1)
}

function handleCheck() {
  const key = isoDate(todayDate)
  if (!mockShifts[key]) mockShifts[key] = []

  let me = mockShifts[key].find((s) => s.name === 'anh.nt')
  if (!me) {
    me = { id: 'me', name: 'anh.nt', checkIn: null, checkOut: null }
    mockShifts[key].push(me)
  }

  if (!checkedIn.value) {
    me.checkIn = new Date().toTimeString().slice(0, 5)
    checkedIn.value = true
  } else if (!checkedOut.value) {
    me.checkOut = new Date().toTimeString().slice(0, 5)
    checkedOut.value = true
  }

  viewDate.value = new Date(viewDate.value)
}

onMounted(() => {
  setInterval(() => {
    const now = new Date()
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      checkedIn.value = false
      checkedOut.value = false
    }
  }, 60000)
})

const pendingTasks = computed(() => tasks.value.filter((t) => !t.done))
const doneTasks = computed(() => tasks.value.filter((t) => t.done))

function toggleTask(task) {
  task.done = !task.done
}
</script>

<style scoped>
.employee-schedule {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #3c2b8c, #5b4db5);
  color: white;
  padding: 16px;
}
.sidebar .profile {
  text-align: center;
  margin-bottom: 24px;
}
.sidebar .profile img {
  border-radius: 50%;
  margin-bottom: 8px;
}
.sidebar .name {
  font-weight: bold;
}
.sidebar .email {
  font-size: 12px;
  opacity: 0.8;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
}
.sidebar nav li {
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;
}
.sidebar nav li.active,
.sidebar nav li:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Content */
.content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.month-control {
  display: flex;
  align-items: center;
}
.month-btn {
  background: #7f5de9;
  color: white;
  font-size: 20px;
  border: none;
  padding: 6px 14px;
  margin: 0 8px;
  border-radius: 50%;
  cursor: pointer;
}
.month-btn:hover {
  background: #6545c2;
}
.actions button {
  margin-left: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.btn-toggle.in {
  background: #13c2c2;
  color: white;
}
.btn-toggle.out {
  background: #ff6b81;
  color: white;
}

/* Calendar */
.calendar {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f7f2ff;
  text-align: center;
  font-weight: bold;
  padding: 6px 0;
  color: #4b2c82;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.calendar-cell {
  border: 1px solid #eee;
  padding: 6px;
  min-height: 100px;
  position: relative;
  transition: background 0.3s;
}
.calendar-cell.today {
  border: 2px solid #7f5de9;
  background: #f2edff;
}
.date {
  font-weight: bold;
  margin-bottom: 4px;
}
.shift {
  font-size: 12px;
}
.time.in {
  color: #13c2c2;
  margin-left: 4px;
}
.time.out {
  color: #ff6b81;
  margin-left: 4px;
}

/* Tasks */
.tasks h3 {
  margin-top: 16px;
}
.tasks ul {
  list-style: none;
  padding: 0;
}
.tasks li {
  padding: 6px 0;
}
.tasks ul.done {
  color: gray;
  text-decoration: line-through;
}
</style>
