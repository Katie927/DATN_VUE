<template>
  <div class="notifications-wrapper">
    <button
      class="notifications-trigger"
      @click="isOpen = !isOpen"
      :class="{ 'has-unread': unreadCount > 0 }"
    >
      <svg class="icon-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>

    <!-- Dropdown Panel -->
    <div class="notifications-dropdown" v-show="isOpen">
      <div class="dropdown-header">
        <h3>Thông báo</h3>
        <button class="close-btn" @click="isOpen = false">✕</button>
      </div>
      <div class="actions-bar">
        <button class="mark-all-read-btn" @click="markAllAsRead">
          ✓ Đánh dấu tất cả là đã đọc
        </button>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-button"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="tab.value === 'unread'" class="tab-count">
            {{ unreadCount }}
          </span>
        </button>
      </div>

      <!-- Mark All As Read Button -->

      <!-- Notifications List -->
      <transition name="fade-slide" mode="out-in">
        <div class="notifications-list" :key="activeTab">
          <div v-if="filteredNotifications.length === 0" class="empty-state">
            <p>
              {{ activeTab === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo' }}
            </p>
          </div>

          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.isRead }"
          >
            <div class="notification-icon">
              <span class="icon" v-html="getIcon(notification.type)"></span>
            </div>

            <div class="notification-content">
              <p class="notification-title">{{ notification.title }}</p>
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ getTimeAgo(notification.createdAt) }}</span>
            </div>

            <button
              v-if="!notification.isRead"
              class="read-btn"
              @click="markAsRead(notification.id)"
            >
              ·
            </button>
          </div>
        </div>
      </transition>

      <!-- Load More -->
      <div v-if="notifications.length > 5" class="dropdown-footer">
        <button class="load-more-btn">Xem tất cả thông báo</button>
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="isOpen" class="notifications-overlay" @click="isOpen = false"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi') // dùng tiếng Việt

console.log('🔵 Notification component loaded!')

const isOpen = ref(false)
const activeTab = ref('unread')

const tabs = [
  { label: 'Chưa đọc', value: 'unread' },
  { label: 'Tất cả', value: 'all' },
]

const notifications = ref([])

/* 🟢 1. GỌI API LẤY THÔNG BÁO (THÊM LOG DEBUG) */
const fetchNotifications = async () => {
  const url = 'http://localhost:8080/bej3/api/notifications/my-notifications'

  console.log('🚀 Bắt đầu gọi API:', url)

  try {
    const res = await axios.get('http://localhost:8080/bej3/api/notifications/my-notifications', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    console.log('🟢 API trả về:', res.data)

    const list = res.data.result || []

    notifications.value = list.map((n) => ({
      id: n.id,
      type: n.type?.toLowerCase(),
      title: n.title,
      message: n.body,
      isRead: n.isRead,
      createdAt: new Date(n.createdAt),
    }))

    console.log('📦 Đã parse dữ liệu:', notifications.value)
  } catch (error) {
    console.error('🔴 Lỗi khi load thông báo:', error)

    if (error.response) {
      console.error('🔴 Response status:', error.response.status)
      console.error('🔴 Response data:', error.response.data)
    } else {
      console.error('🔴 Không kết nối được tới server')
    }
  }
}

onMounted(() => {
  console.log('⚡ onMounted() đã chạy!')
  fetchNotifications()
})

/* 🟢 Computed */
const unreadCount = computed(() => {
  const c = notifications.value.filter((n) => !n.isRead).length
  console.log('🔍 Số lượng chưa đọc:', c)
  return c
})

const filteredNotifications = computed(() => {
  console.log('🔍 Tab hiện tại:', activeTab.value)
  return activeTab.value === 'unread'
    ? notifications.value.filter((n) => !n.isRead)
    : notifications.value
})

/* 🟢 Icon */
const getIcon = (type) => {
  const icons = {
    order: '📦',
    promo: '🎉',
    delivery: '🚚',
    review: '⭐',
  }
  return icons[type] || '📢'
}

/* 🟢 Format thời gian */
const getTimeAgo = (date) => {
  return dayjs(date).fromNow()
}

/* 🟢 Mark as read */
const markAsRead = (id) => {
  console.log('🖊 Mark as read:', id)
  const n = notifications.value.find((x) => x.id === id)
  if (n) n.isRead = true
}

/* 🟢 Mark all */
const markAllAsRead = () => {
  console.log('🖊 Mark ALL as read')
  notifications.value.forEach((n) => (n.isRead = true))
}
</script>

<style scoped>
/* Variables */
:root {
  --color-primary: #e74c3c;
  --color-bg: #e70f0f;
  --color-border: #145ef1;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-unread-bg: #e22413;
  --color-hover: #167de4;
  --radius: 8px;
}

* {
  box-sizing: border-box;
}

.notifications-wrapper {
  position: relative;
}

/* Trigger Button */
.notifications-trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  transition: all 0.2s ease;
  border-radius: 50%;
}

.notifications-trigger:hover {
  background: var(--color-hover);
}

.notifications-trigger.has-unread {
  color: var(--color-primary);
}

.icon-bell {
  width: 24px;
  height: 24px;
}

.badge {
  position: absolute;
  top: 6px;
  right: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  background: rgb(224, 20, 20);
  color: rgb(245, 235, 235);
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Dropdown Panel */
.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 380px;
  max-height: 600px;
  margin-top: 8px;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(111, 167, 240);
  border-radius: var(--radius);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  animation: slideDown 0.2s ease;
  border-radius: 2%;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}

.dropdown-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-text-light);
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--color-text);
}

/* Tabs */
.tabs-container {
  display: flex;
  gap: 0;
  padding: 4px;
}

.tab-button {
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: 1px solid transparent;
  cursor: pointer;
  color: var(--color-text-light);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 12px;
}

.tab-button:hover {
  background: var(--color-hover);
  color: var(--color-text);
}

.tab-button.active {
  background: rgb(112, 247, 218);
  color: rgb(36, 35, 35);
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 15px;
  height: 15px;
  background: rgb(238, 109, 109);
  color: white;
  font-size: 10px;
  border-radius: 15px;
  padding: 0 6px;
  font-weight: bold;
}

/* Actions Bar */
.actions-bar {
  padding: 12px 2px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
}

.mark-all-read-btn {
  width: 60%;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid rgb(0, 0, 0);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mark-all-read-btn:hover {
  background: rgb(112, 247, 218);
  border-color: var(--color-primary);
}

/* Notifications List */
.notifications-list {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: transparent;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-light);
}

/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--color-text-light);
  font-size: 14px;
  text-align: center;
}

.empty-state p {
  margin: 0;
}

/* Notification Item */
.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.2s ease;
  cursor: pointer;
  position: relative;
}

.notification-item:hover {
  background: var(--color-hover);
}

.notification-item.unread {
  background: var(--color-unread-bg);
}

.notification-item.unread:hover {
  background: #cef3ed;
}

.notification-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-hover);
  border-radius: 50%;
  font-size: 20px;
}

.notification-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.notification-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  text-align: left;
}

.notification-message {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: var(--color-text-light);
  line-height: 1.4;
  text-align: left;
}

.notification-time {
  font-size: 12px;
  color: var(--color-text-light);
  align-self: flex-start;
}

.read-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.read-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Footer */
.dropdown-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
}

.load-more-btn {
  width: 100%;
  padding: 10px 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Overlay */
.notifications-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* Responsive */
@media (max-width: 600px) {
  .notifications-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    right: auto;
    width: 90%;
    max-width: 380px;
    transform: translate(-50%, -50%);
    max-height: 80vh;
  }
}

/* Transition for tab content */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Smooth Tab Button Animation */
.tab-button {
  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.2s ease;
}

.tab-button.active {
  transform: scale(1.01);
}
</style>
