# Phân tích Guideline WebSocket - Đánh giá Logic và Đề xuất Cải thiện

## ✅ Những điểm ĐÚNG trong Guideline

1. **Cấu trúc tổng quan**: Guideline rất chi tiết và đầy đủ
2. **Subscribe là bắt buộc**: Đúng - chỉ connect không đủ, phải subscribe
3. **Topic-based approach**: Khuyến nghị đúng cho trường hợp này
4. **Reconnection logic**: Có đề cập đến auto-reconnect
5. **Cleanup**: Có nhắc đến disconnect khi logout/unmount

## ⚠️ Những vấn đề cần SỬA trong Guideline

### 1. **Lấy UserId - Endpoint không đúng**

**Vấn đề**: Guideline đề cập `/auth/me` nhưng trong codebase hiện tại:
- Không có endpoint `/auth/me`
- Thay vào đó dùng `/users/profile/my-info` để lấy thông tin user
- Hoặc decode JWT token để lấy userId

**Giải pháp**: Cần sửa guideline để phù hợp với codebase:

```javascript
// ❌ SAI (theo guideline hiện tại)
const response = await axios.get('/auth/me');

// ✅ ĐÚNG (theo codebase hiện tại)
// Cách 1: Gọi API profile
const response = await axios.get('http://localhost:8080/bej3/users/profile/my-info', {
  headers: { Authorization: `Bearer ${token}` }
});
const userId = response.data.result.id; // hoặc phoneNumber tùy backend

// Cách 2: Decode JWT token (nhanh hơn, không cần API call)
import { jwtDecode } from 'jwt-decode';
const token = localStorage.getItem('token');
const decoded = jwtDecode(token);
const userId = decoded.sub || decoded.userId || decoded.phoneNumber; // Tùy backend
```

### 2. **Ví dụ React trong Vue.js Project**

**Vấn đề**: Guideline có ví dụ React nhưng project này là Vue.js

**Giải pháp**: Cần thêm ví dụ Vue.js hoặc sửa lại ví dụ cho Vue:

```javascript
// ✅ Ví dụ Vue.js Composition API
import { ref, onMounted, onUnmounted } from 'vue'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

export function useWebSocketNotifications() {
  const stompClient = ref(null)
  const isConnected = ref(false)

  const connect = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No token found, cannot connect WebSocket')
      return
    }

    // Lấy userId từ JWT token
    const decoded = jwtDecode(token)
    const userId = decoded.sub || decoded.userId || decoded.phoneNumber

    const baseUrl = 'http://localhost:8080/bej3'
    const wsUrl = `${baseUrl}/ws`
    const socket = new SockJS(wsUrl)

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('✅ WebSocket connected')
        isConnected.value = true
        
        // Subscribe vào topic notifications
        client.subscribe(
          `/topic/notifications/${userId}`,
          (message) => {
            const notification = JSON.parse(message.body)
            console.log('📨 Notification received:', notification)
            
            // Emit event để các component khác có thể listen
            window.dispatchEvent(new CustomEvent('websocket-notification', {
              detail: notification
            }))
          }
        )
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame)
        isConnected.value = false
      },
      onWebSocketError: (event) => {
        console.error('❌ WebSocket error:', event)
        isConnected.value = false
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket disconnected')
        isConnected.value = false
      }
    })

    client.activate()
    stompClient.value = client
  }

  const disconnect = () => {
    if (stompClient.value) {
      stompClient.value.deactivate()
      stompClient.value = null
      isConnected.value = false
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    connect,
    disconnect
  }
}
```

### 3. **Thiếu thư viện trong package.json**

**Vấn đề**: Guideline yêu cầu cài `sockjs-client` và `@stomp/stompjs` nhưng chưa có trong package.json

**Giải pháp**: Cần thêm vào checklist và hướng dẫn cài đặt:

```bash
npm install sockjs-client @stomp/stompjs
```

### 4. **Cấu trúc Notification Object - Cần xác nhận**

**Vấn đề**: Guideline định nghĩa notification object nhưng cần kiểm tra với backend xem có khớp không.

**Kiểm tra**: Trong `NotificationsDropdown.vue`, code đang parse như sau:
```javascript
notifications.value = list.map((n) => ({
  id: n.id,
  type: n.type?.toLowerCase(),
  title: n.title,
  message: n.body,  // ← Dùng 'body' không phải 'message'
  isRead: n.read,   // ← Dùng 'read' không phải 'isRead'
  createdAt: new Date(n.createdAt),
  resourceId: n.resourceId,
}))
```

**Đề xuất**: Guideline nên đồng bộ với cấu trúc thực tế từ backend:
```typescript
interface NotificationPayload {
  id: string;
  type: string;              // ORDER_PLACED, ORDER_STATUS_UPDATE, ...
  title: string;
  body: string;              // ← Không phải 'message'
  read: boolean;            // ← Không phải 'isRead'
  createdAt: string;         // ISO 8601 timestamp
  resourceId?: string;       // ID của order hoặc resource liên quan
  metadata?: {               // Optional
    orderId?: string;
    orderType?: string;
    oldStatus?: string;
    newStatus?: string;
    userId?: string;
  };
}
```

### 5. **Topic vs User Queue - Cần làm rõ**

**Vấn đề**: Guideline đề cập cả topic và user queue nhưng không rõ khi nào dùng cái nào.

**Giải pháp**: Làm rõ hơn:

- **Topic-based** (`/topic/notifications/{userId}`): 
  - ✅ Đơn giản, không cần authentication trong WebSocket connection
  - ✅ Phù hợp khi userId là public hoặc không nhạy cảm
  - ✅ Khuyến nghị cho hầu hết trường hợp

- **User-specific Queue** (`/user/{userId}/queue/notifications`):
  - ⚠️ Cần authentication trong WebSocket connection
  - ⚠️ userId phải khớp với principal name trong JWT token
  - ⚠️ Phức tạp hơn nhưng bảo mật hơn
  - Chỉ dùng khi cần bảo mật cao

### 6. **Reconnection Logic - Cần cải thiện**

**Vấn đề**: Guideline có đề cập nhưng chưa chi tiết về edge cases.

**Đề xuất**: Thêm logic xử lý:
- Reconnect khi token hết hạn
- Reconnect khi user login lại
- Tránh reconnect khi user đã logout

```javascript
// ✅ Ví dụ cải thiện
const client = new Client({
  // ... config
  reconnectDelay: 5000,
  onConnect: () => {
    // Subscribe lại sau khi reconnect
    subscribeToNotifications()
  },
  onDisconnect: () => {
    // Chỉ reconnect nếu user vẫn đang login
    const token = localStorage.getItem('token')
    if (token) {
      console.log('🔄 Will reconnect in 5 seconds...')
    }
  }
})
```

### 7. **Cleanup khi Logout - Cần nhấn mạnh**

**Vấn đề**: Guideline có đề cập nhưng chưa rõ cách implement trong Vue.

**Giải pháp**: Thêm ví dụ cụ thể:

```javascript
// Trong ViewUser.vue hoặc component logout
const handleLogout = async () => {
  // 1. Disconnect WebSocket TRƯỚC KHI logout
  if (stompClient.value) {
    stompClient.value.deactivate()
    stompClient.value = null
  }
  
  // 2. Sau đó mới logout và xóa token
  await axios.post('/auth/logout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  localStorage.removeItem('token')
  router.push('/login')
}
```

### 8. **Base URL - Nên dùng environment variable**

**Vấn đề**: Guideline hardcode `http://localhost:8080/bej3`

**Giải pháp**: Nên dùng environment variable:

```javascript
// .env
VITE_API_BASE_URL=http://localhost:8080/bej3

// Trong code
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/bej3'
const wsUrl = `${baseUrl}/ws`
```

### 9. **Test Code - Cần cập nhật**

**Vấn đề**: Test code trong guideline dùng `Stomp.over()` (stompjs cũ) nhưng guideline khuyến nghị `@stomp/stompjs` (mới hơn).

**Giải pháp**: Cập nhật test code:

```javascript
// ❌ CŨ (stompjs)
const client = Stomp.over(socket);

// ✅ MỚI (@stomp/stompjs)
import { Client } from '@stomp/stompjs';
const client = new Client({
  webSocketFactory: () => socket,
  // ...
});
client.activate();
```

## 📋 Checklist cải thiện cho Guideline

- [ ] ✅ Sửa endpoint lấy userId từ `/auth/me` → `/users/profile/my-info` hoặc decode JWT
- [ ] ✅ Thêm ví dụ Vue.js thay vì chỉ React
- [ ] ✅ Cập nhật cấu trúc Notification object để khớp với backend (body, read)
- [ ] ✅ Làm rõ khi nào dùng topic vs user queue
- [ ] ✅ Thêm logic xử lý reconnect khi token hết hạn
- [ ] ✅ Thêm ví dụ cleanup khi logout trong Vue
- [ ] ✅ Khuyến nghị dùng environment variable cho base URL
- [ ] ✅ Cập nhật test code dùng `@stomp/stompjs` thay vì `stompjs` cũ
- [ ] ✅ Thêm hướng dẫn cài đặt dependencies vào checklist
- [ ] ✅ Thêm ví dụ tích hợp với `NotificationsDropdown.vue` hiện có

## 🎯 Đề xuất Implementation cho Project

### Bước 1: Cài đặt dependencies
```bash
npm install sockjs-client @stomp/stompjs
```

### Bước 2: Tạo WebSocket service/composable
Tạo file `src/composables/useWebSocket.js` hoặc `src/services/websocket.js`

### Bước 3: Tích hợp vào NotificationsDropdown.vue
- Kết nối WebSocket khi component mount
- Subscribe vào topic notifications
- Update notifications list khi nhận được message mới
- Disconnect khi component unmount

### Bước 4: Tích hợp vào layout/Header.vue
- Kết nối WebSocket khi user login
- Disconnect khi user logout

## ✅ Kết luận

Guideline về cơ bản là **ĐÚNG** về logic, nhưng cần:
1. **Cập nhật** để phù hợp với codebase hiện tại (endpoint, Vue.js)
2. **Làm rõ** một số điểm về topic vs queue
3. **Bổ sung** ví dụ Vue.js cụ thể
4. **Đồng bộ** cấu trúc notification object với backend

Sau khi sửa các điểm trên, guideline sẽ hoàn chỉnh và sẵn sàng để implement.

