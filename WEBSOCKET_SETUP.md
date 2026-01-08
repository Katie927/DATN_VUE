# Hướng dẫn Setup WebSocket cho Vue.js

## ✅ Đã hoàn thành

1. ✅ Tạo composable `useWebSocket.js` để quản lý WebSocket connection
2. ✅ Tích hợp WebSocket vào `NotificationsDropdown.vue` để nhận realtime notifications
3. ✅ Tích hợp WebSocket vào `App.vue` để tự động kết nối khi user login

## 📦 Cài đặt Dependencies

Chạy lệnh sau để cài đặt các thư viện cần thiết:

```bash
npm install sockjs-client @stomp/stompjs
```

## 🔧 Cấu hình

### 1. Environment Variables (Optional)

Tạo file `.env` hoặc cập nhật `vite.config.js`:

```env
VITE_API_BASE_URL=http://localhost:8080/bej3
```

Nếu không có, sẽ dùng default: `http://localhost:8080/bej3`

### 2. Kiểm tra Backend

Đảm bảo backend đang chạy và WebSocket endpoint `/bej3/ws` accessible.

## 🚀 Cách hoạt động

### Flow hoạt động:

1. **User Login** → Token được lưu vào `localStorage`
2. **App.vue mounted** → Tự động gọi `connect()` nếu có token
3. **useWebSocket.js** → 
   - Lấy userId từ API `/users/profile/my-info`
   - Kết nối WebSocket đến `/bej3/ws`
   - Subscribe vào `/topic/notifications/{userId}`
4. **Backend gửi notification** → 
   - Khi có đơn hàng mới hoặc cập nhật trạng thái
   - Backend gửi đến `/topic/notifications/{userId}`
5. **Frontend nhận notification** →
   - `NotificationsDropdown.vue` tự động cập nhật danh sách
   - Hiển thị notification mới ngay lập tức

## 📝 Chi tiết Implementation

### 1. useWebSocket.js

Composable này:
- Quản lý WebSocket connection lifecycle
- Tự động lấy userId từ API
- Subscribe vào topic notifications
- Emit custom event khi nhận notification

### 2. NotificationsDropdown.vue

Component này:
- Tự động kết nối WebSocket khi mount
- Nhận notifications realtime từ WebSocket
- Cập nhật UI ngay lập tức khi có notification mới
- Vẫn giữ chức năng fetch từ API để load notifications cũ

### 3. App.vue

App-level integration:
- Tự động kết nối WebSocket khi app khởi động (nếu user đã login)
- Tự động reconnect khi user login
- Tự động disconnect khi user logout

## 🧪 Test

### 1. Test WebSocket Connection

1. Login vào app
2. Mở browser console
3. Kiểm tra logs:
   ```
   ✅ Got userId from API: {userId}
   🔌 Connecting to WebSocket: http://localhost:8080/bej3/ws
   ✅ WebSocket connected
   ✅ Subscribed to: /topic/notifications/{userId}
   ```

### 2. Test Realtime Notification

1. Mở 2 browser windows:
   - Window 1: Login với user A
   - Window 2: Login với admin

2. Từ Window 2 (admin), tạo đơn hàng mới hoặc cập nhật trạng thái đơn hàng

3. Kiểm tra Window 1 (user A):
   - Notification dropdown tự động hiển thị notification mới
   - Console log: `📨 WebSocket notification received: {...}`

### 3. Test Database

Kiểm tra notification đã được lưu vào database:

```sql
SELECT id, recipient_id, title, body, created_at, is_read
FROM notification
ORDER BY created_at DESC
LIMIT 5;
```

## 🐛 Troubleshooting

### Không nhận được notification?

1. ✅ Kiểm tra WebSocket đã connect chưa?
   - Xem console log: `✅ WebSocket connected`

2. ✅ Kiểm tra đã subscribe chưa?
   - Xem console log: `✅ Subscribed to: /topic/notifications/{userId}`

3. ✅ Kiểm tra userId có đúng không?
   - Xem console log: `👤 Using userId for WebSocket: {userId}`
   - So sánh với userId trong database

4. ✅ Kiểm tra backend có gửi notification không?
   - Xem backend logs: `✅ Notification sent via WebSocket to user: {userId}`

5. ✅ Kiểm tra RabbitMQ đang chạy không?
   - Truy cập: http://localhost:15672
   - Kiểm tra STOMP plugin đã enable

### WebSocket không connect?

1. ✅ Kiểm tra token có trong localStorage không?
   ```javascript
   console.log(localStorage.getItem('token'))
   ```

2. ✅ Kiểm tra API `/users/profile/my-info` có trả về userId không?
   - Test trong browser console hoặc Postman

3. ✅ Kiểm tra backend WebSocket endpoint có accessible không?
   - Test: `ws://localhost:8080/bej3/ws`

### Notification không hiển thị trong UI?

1. ✅ Kiểm tra `handleWebSocketNotification` có được gọi không?
   - Xem console log: `📨 WebSocket notification received`

2. ✅ Kiểm tra notification có được thêm vào `notifications.value` không?
   - Xem console log: `✅ Added new notification from WebSocket`

3. ✅ Kiểm tra `filteredNotifications` computed có đúng không?
   - Xem Vue DevTools

## 📚 Tài liệu tham khảo

- Backend WebSocket Guide: `/home/quangnam/code/DATN_BE/FRONTEND_WEBSOCKET_GUIDE.md`
- Backend Test Guide: `/home/quangnam/code/DATN_BE/WEBSOCKET_TEST_GUIDE.md`

