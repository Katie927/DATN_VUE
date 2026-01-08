# Hướng dẫn Kết nối WebSocket cho Frontend (Vue.js)

## Tổng quan

Sau khi frontend kết nối đến `/bej3/ws`, cần **subscribe vào các destination** để nhận thông báo. Backend sẽ tự động push notification khi có đơn hàng mới hoặc cập nhật trạng thái.

## Bước 1: Cài đặt Dependencies

```bash
npm install sockjs-client @stomp/stompjs
```

## Bước 2: Kết nối WebSocket

### Sử dụng Composable (Khuyến nghị)

Đã tạo sẵn composable `useWebSocket.js` trong `src/composables/`. Sử dụng như sau:

```javascript
import { useWebSocketNotifications } from '@/composables/useWebSocket'

// Trong component
const { isConnected, connect, disconnect } = useWebSocketNotifications((notification) => {
  // Xử lý notification khi nhận được
  console.log('📨 Notification:', notification)
  // Thêm vào danh sách notifications, hiển thị toast, etc.
})
```

### Manual Setup (Nếu cần tùy chỉnh)

```javascript
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { jwtDecode } from 'jwt-decode'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/bej3'
const wsUrl = `${baseUrl}/ws`

// Lấy userId từ JWT token
const token = localStorage.getItem('token')
const decoded = jwtDecode(token)
const userId = decoded.sub || decoded.userId || decoded.phoneNumber

// Tạo SockJS connection
const socket = new SockJS(wsUrl)

// Tạo STOMP client
const stompClient = new Client({
  webSocketFactory: () => socket,
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  onConnect: () => {
    console.log('✅ WebSocket connected')
    // Bước 3: Subscribe sau khi connect
    subscribeToNotifications()
  },
  onStompError: (frame) => {
    console.error('❌ STOMP error:', frame)
  },
  onWebSocketError: (event) => {
    console.error('❌ WebSocket error:', event)
  }
})

// Kết nối
stompClient.activate()
```

## Bước 3: Subscribe để nhận thông báo

Sau khi kết nối thành công, **bắt buộc phải subscribe** vào các destination sau:

### Cách 1: Topic-based (Khuyến nghị - Đơn giản nhất)

```javascript
function subscribeToNotifications() {
  // Lấy userId từ JWT token hoặc API
  const userId = getUserId() // Xem cách lấy userId bên dưới
  
  // Subscribe vào topic notifications của user
  const subscription = stompClient.subscribe(
    `/topic/notifications/${userId}`, 
    (message) => {
      const notification = JSON.parse(message.body)
      handleNotification(notification)
    }
  )
  
  console.log('✅ Subscribed to:', `/topic/notifications/${userId}`)
}

function handleNotification(notification) {
  console.log('📨 Received notification:', notification)
  
  // Xử lý notification
  switch(notification.type) {
    case 'ORDER_PLACED':
      // Đơn hàng mới được tạo
      showNotification(notification.title, notification.body)
      break
    case 'ORDER_STATUS_UPDATE':
      // Trạng thái đơn hàng được cập nhật
      showNotification(notification.title, notification.body)
      updateOrderStatus(notification.metadata?.orderId, notification.metadata?.newStatus)
      break
    default:
      showNotification(notification.title, notification.body)
  }
}
```

### Cách 2: User-specific Queue (Cần authentication)

Nếu bạn muốn dùng user-specific queue, cần đảm bảo WebSocket connection có authentication:

```javascript
// Kết nối với JWT token (nếu cần)
const token = localStorage.getItem('token')

stompClient.configure({
  connectHeaders: {
    Authorization: `Bearer ${token}`
  }
})

// Subscribe
stompClient.subscribe(
  `/user/${userId}/queue/notifications`,
  (message) => {
    const notification = JSON.parse(message.body)
    handleNotification(notification)
  }
)
```

**Lưu ý**: Với user-specific queue, userId phải khớp với principal name (phone number) trong JWT token.

### Cách 3: Admin/Staff - Subscribe broadcast

Nếu user là Admin, có thể subscribe vào topic broadcast:

```javascript
// Subscribe vào broadcast notifications (cho admin)
stompClient.subscribe(
  '/topic/notifications',
  (message) => {
    const notification = JSON.parse(message.body)
    handleNotification(notification)
  }
)
```

## Lấy UserId

### Cách 1: Từ JWT Token (Nhanh nhất - Khuyến nghị)

```javascript
import { jwtDecode } from 'jwt-decode'

function getUserIdFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return null
  
  try {
    const decoded = jwtDecode(token)
    // Backend có thể dùng sub, userId, phoneNumber, hoặc username
    const userId = decoded.sub || decoded.userId || decoded.phoneNumber || decoded.username
    return userId
  } catch (error) {
    console.error('❌ Error decoding token:', error)
    return null
  }
}
```

### Cách 2: Từ API (Fallback)

```javascript
import axios from 'axios'

async function getUserIdFromAPI() {
  const token = localStorage.getItem('token')
  if (!token) return null
  
  try {
    const response = await axios.get('http://localhost:8080/bej3/users/profile/my-info', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.result?.id || response.data.result?.phoneNumber
  } catch (error) {
    console.error('❌ Error fetching user profile:', error)
    return null
  }
}
```

## Ví dụ hoàn chỉnh (Vue.js Composition API)

### Sử dụng Composable (Đã tích hợp sẵn)

```vue
<template>
  <div>
    <div v-if="isConnected">✅ WebSocket Connected</div>
    <div v-else>❌ WebSocket Disconnected</div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useWebSocketNotifications } from '@/composables/useWebSocket'

const handleNotification = (notification) => {
  console.log('📨 Notification received:', notification)
  // Thêm vào danh sách notifications
  // Hiển thị toast notification
  // Update UI
}

const { isConnected, connect, disconnect } = useWebSocketNotifications(handleNotification)

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    connect()
  }
})

onUnmounted(() => {
  disconnect()
})
</script>
```

### Tích hợp vào NotificationsDropdown.vue

Đã được tích hợp sẵn trong `src/components/notification/NotificationsDropdown.vue`:

```vue
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useWebSocketNotifications } from '@/composables/useWebSocket'

const notifications = ref([])

// Xử lý notification từ WebSocket
const handleWebSocketNotification = (notification) => {
  const newNotification = {
    id: notification.id,
    type: notification.type?.toLowerCase() || 'order',
    title: notification.title,
    message: notification.body,
    isRead: notification.read || false,
    createdAt: new Date(notification.createdAt || notification.timestamp || new Date()),
    resourceId: notification.resourceId || notification.metadata?.orderId,
  }
  
  // Thêm vào đầu danh sách
  notifications.value.unshift(newNotification)
}

// Setup WebSocket
const { connect, disconnect } = useWebSocketNotifications(handleWebSocketNotification)

onMounted(() => {
  // Fetch notifications từ API
  fetchNotifications()
  
  // Kết nối WebSocket nếu user đã login
  const token = localStorage.getItem('token')
  if (token) {
    connect()
  }
  
  // Listen cho custom event
  window.addEventListener('websocket-notification', (event) => {
    handleWebSocketNotification(event.detail)
  })
})

onUnmounted(() => {
  window.removeEventListener('websocket-notification', handleWebSocketNotification)
  disconnect()
})

// Watch token để reconnect khi user login
watch(() => localStorage.getItem('token'), (newToken, oldToken) => {
  if (newToken && !oldToken) {
    connect()
  } else if (!newToken && oldToken) {
    disconnect()
  }
})
</script>
```

### Tích hợp vào App.vue (Global)

Đã được tích hợp sẵn trong `src/App.vue`:

```vue
<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useWebSocketNotifications } from '@/composables/useWebSocket'

// Setup WebSocket connection globally
const { connect, disconnect } = useWebSocketNotifications()

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    connect()
  }
})

onUnmounted(() => {
  disconnect()
})

// Watch token để reconnect khi user login/logout
watch(() => localStorage.getItem('token'), (newToken, oldToken) => {
  if (newToken && !oldToken) {
    connect()
  } else if (!newToken && oldToken) {
    disconnect()
  }
})
</script>
```

## Cấu trúc Notification Object

Khi nhận được notification, bạn sẽ nhận object có cấu trúc:

```typescript
interface NotificationPayload {
  id: string                    // UUID của notification
  type: string                   // ORDER_PLACED, ORDER_STATUS_UPDATE, ...
  title: string                  // Tiêu đề thông báo
  body: string                   // Nội dung thông báo (không phải 'message')
  read: boolean                  // Trạng thái đã đọc (không phải 'isRead')
  createdAt: string              // ISO 8601 timestamp
  resourceId?: string            // ID của order hoặc resource liên quan
  metadata?: {                   // Metadata tùy chọn
    orderId?: string
    orderType?: string
    oldStatus?: string
    newStatus?: string
    userId?: string
  }
}
```

**Lưu ý quan trọng**: 
- Backend trả về `body` không phải `message`
- Backend trả về `read` không phải `isRead`
- Cần map lại khi hiển thị trong UI

## Checklist cho Frontend Developer

- [x] ✅ Cài đặt thư viện: `sockjs-client` và `@stomp/stompjs`
- [x] ✅ Tạo composable `useWebSocket.js` trong `src/composables/`
- [x] ✅ Tích hợp WebSocket vào `App.vue` để kết nối khi app khởi động
- [x] ✅ Tích hợp WebSocket vào `NotificationsDropdown.vue` để nhận notifications
- [ ] ✅ Lấy `userId` từ JWT token (đã implement trong composable)
- [ ] ✅ Subscribe vào `/topic/notifications/{userId}` sau khi connect thành công (đã implement)
- [ ] ✅ Xử lý notification khi nhận được (đã implement trong NotificationsDropdown)
- [ ] ✅ Disconnect WebSocket khi user logout (đã implement trong App.vue)
- [ ] ✅ Handle reconnection nếu connection bị mất (đã implement trong composable)

## Lưu ý quan trọng

1. **Bắt buộc phải subscribe**: Chỉ kết nối WebSocket thôi chưa đủ, **phải subscribe** vào destination mới nhận được notification.

2. **UserId là bắt buộc**: Cần có `userId` để subscribe. Lấy từ:
   - JWT token (decode để lấy thông tin user) - **Khuyến nghị**
   - API `/users/profile/my-info` (fallback)

3. **Topic-based vs User Queue**:
   - **Topic-based** (`/topic/notifications/{userId}`): Đơn giản, không cần authentication trong WebSocket connection, khuyến nghị dùng
   - **User Queue** (`/user/{userId}/queue/notifications`): Cần authentication, userId phải khớp với principal name

4. **Reconnection**: Đã implement auto-reconnect trong composable (reconnectDelay: 5000ms)

5. **Cleanup**: Luôn disconnect và unsubscribe khi component unmount hoặc user logout (đã implement)

6. **Environment Variables**: Có thể dùng `VITE_API_BASE_URL` trong `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/bej3
   ```

## Test nhanh

1. Mở browser console
2. Đăng nhập vào ứng dụng
3. Kiểm tra console xem có log "✅ WebSocket connected" và "✅ Subscribed to: /topic/notifications/{userId}"
4. Tạo một đơn hàng mới (qua API hoặc UI)
5. Kiểm tra console xem có nhận được notification không

```javascript
// Test trong browser console (sau khi đã login)
// Kiểm tra WebSocket connection
console.log('WebSocket status:', window.stompClient)

// Listen cho notification event
window.addEventListener('websocket-notification', (event) => {
  console.log('📨 Notification:', event.detail)
})
```

## Troubleshooting

### Không nhận được notification?

1. ✅ Kiểm tra đã subscribe chưa? (Xem console log "✅ Subscribed to:")
2. ✅ UserId có đúng không? (Kiểm tra trong JWT token)
3. ✅ WebSocket đã connect thành công chưa? (Xem console log "✅ WebSocket connected")
4. ✅ Kiểm tra backend logs xem có gửi notification không
5. ✅ Kiểm tra RabbitMQ Management UI (http://localhost:15672) xem có message trong queue không
6. ✅ Kiểm tra userId trong topic có khớp với userId trong notification không

### Connection failed?

1. ✅ Kiểm tra URL: `http://localhost:8080/bej3/ws` (có context-path `/bej3`)
2. ✅ Kiểm tra CORS configuration
3. ✅ Kiểm tra RabbitMQ đang chạy không
4. ✅ Kiểm tra STOMP plugin đã enable chưa
5. ✅ Kiểm tra token có hợp lệ không

### Notification không hiển thị trong UI?

1. ✅ Kiểm tra `handleWebSocketNotification` có được gọi không
2. ✅ Kiểm tra notification object có đúng format không (body, read)
3. ✅ Kiểm tra `notifications.value` có được update không
4. ✅ Kiểm tra Vue reactivity (sử dụng `ref`, `reactive`)

## Cấu trúc File đã tạo

```
src/
├── composables/
│   └── useWebSocket.js          # Composable WebSocket (đã tạo)
├── components/
│   └── notification/
│       └── NotificationsDropdown.vue  # Đã tích hợp WebSocket
└── App.vue                      # Đã tích hợp WebSocket global
```

## Tóm tắt Implementation

✅ **Đã hoàn thành**:
1. Cài đặt dependencies (`sockjs-client`, `@stomp/stompjs`)
2. Tạo composable `useWebSocket.js`
3. Tích hợp vào `NotificationsDropdown.vue`
4. Tích hợp vào `App.vue` để kết nối global
5. Auto-reconnect khi connection mất
6. Auto-connect khi user login
7. Auto-disconnect khi user logout

🎯 **Sẵn sàng sử dụng**: Chỉ cần đảm bảo backend đang chạy và RabbitMQ đã được cấu hình đúng.

