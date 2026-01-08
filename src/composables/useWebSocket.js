import { ref, onUnmounted } from 'vue'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { jwtDecode } from 'jwt-decode'

/**
 * Composable để quản lý WebSocket connection cho notifications
 * 
 * @param {Function} onNotification - Callback khi nhận được notification
 * @returns {Object} { isConnected, connect, disconnect }
 */
export function useWebSocketNotifications(onNotification = null) {
  const stompClient = ref(null)
  const isConnected = ref(false)
  const subscriptions = ref([])

  /**
   * Lấy userId từ JWT token
   */
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('⚠️ No token found, cannot get userId')
      return null
    }

    try {
      const decoded = jwtDecode(token)
      // Backend có thể dùng sub, userId, hoặc phoneNumber làm identifier
      // Cần kiểm tra với backend để biết chính xác field nào
      const userId = decoded.sub || decoded.userId || decoded.phoneNumber || decoded.username
      
      if (!userId) {
        console.error('❌ Cannot find userId in token:', decoded)
        // Fallback: Gọi API để lấy userId
        return null
      }
      
      return userId
    } catch (error) {
      console.error('❌ Error decoding token:', error)
      return null
    }
  }

  /**
   * Lấy userId từ API (fallback nếu không có trong token)
   * Backend trả về userId trong field 'id' của response.data.result
   */
  const getUserIdFromAPI = async () => {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
      const axios = (await import('axios')).default
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/bej3'
      const response = await axios.get(`${baseUrl}/users/profile/my-info`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Backend trả về userId trong field 'id'
      const userId = response.data.result?.id
      if (userId) {
        console.log('✅ Got userId from API:', userId)
        return userId
      }
      
      console.warn('⚠️ No userId found in API response:', response.data)
      return null
    } catch (error) {
      console.error('❌ Error fetching user profile:', error)
      return null
    }
  }

  /**
   * Kết nối WebSocket
   */
  const connect = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('⚠️ No token found, cannot connect WebSocket')
      return
    }

    // Nếu đã kết nối rồi thì không kết nối lại
    if (stompClient.value && isConnected.value) {
      console.log('✅ WebSocket already connected')
      return
    }

    // Lấy userId - ưu tiên từ API vì backend dùng phoneNumber làm JWT subject, không phải userId
    let userId = await getUserIdFromAPI()
    
    // Fallback: thử lấy từ token (nhưng thường không có userId trong token)
    if (!userId) {
      console.log('🔄 Trying to get userId from token...')
      userId = getUserIdFromToken()
    }

    if (!userId) {
      console.error('❌ Cannot get userId, cannot connect WebSocket')
      return
    }
    
    console.log('👤 Using userId for WebSocket:', userId)

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/bej3'
    const wsUrl = `${baseUrl}/ws`

    console.log('🔌 Connecting to WebSocket:', wsUrl)
    console.log('👤 UserId:', userId)

    const socket = new SockJS(wsUrl)
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('✅ WebSocket connected')
        isConnected.value = true
        subscribeToNotifications(client, userId)
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
        subscriptions.value = []
      }
    })

    client.activate()
    stompClient.value = client
  }

  /**
   * Subscribe vào topic notifications
   */
  const subscribeToNotifications = (client, userId) => {
    if (!userId) {
      console.error('❌ UserId is required for subscription')
      return
    }

    // Subscribe vào queue notifications của user
    // RabbitMQ STOMP broker không hỗ trợ dynamic topics, nên dùng queue với tên cụ thể
    const queue = `/queue/notifications.${userId}`
    const subscription = client.subscribe(queue, (message) => {
      try {
        const notification = JSON.parse(message.body)
        console.log('📨 Notification received:', notification)
        
        // Gọi callback nếu có
        if (onNotification && typeof onNotification === 'function') {
          onNotification(notification)
        }

        // Emit custom event để các component khác có thể listen
        window.dispatchEvent(new CustomEvent('websocket-notification', {
          detail: notification
        }))
      } catch (error) {
        console.error('❌ Error parsing notification:', error)
      }
    })

    subscriptions.value.push(subscription)
    console.log('✅ Subscribed to:', queue)

    // Nếu là admin, có thể subscribe thêm vào broadcast
    // Uncomment nếu cần:
    // const role = localStorage.getItem('role')
    // if (role === 'ADMIN') {
    //   subscribeToBroadcast(client)
    // }
  }

  /**
   * Subscribe vào broadcast notifications (cho admin)
   */
  const subscribeToBroadcast = (client) => {
    const subscription = client.subscribe(
      '/topic/notifications',
      (message) => {
        try {
          const notification = JSON.parse(message.body)
          console.log('📨 Broadcast notification received:', notification)
          
          if (onNotification && typeof onNotification === 'function') {
            onNotification(notification)
          }

          window.dispatchEvent(new CustomEvent('websocket-notification', {
            detail: notification
          }))
        } catch (error) {
          console.error('❌ Error parsing broadcast notification:', error)
        }
      }
    )
    subscriptions.value.push(subscription)
    console.log('✅ Subscribed to broadcast notifications')
  }

  /**
   * Ngắt kết nối WebSocket
   */
  const disconnect = () => {
    if (stompClient.value) {
      // Unsubscribe tất cả
      subscriptions.value.forEach(sub => {
        try {
          sub.unsubscribe()
        } catch (error) {
          console.error('❌ Error unsubscribing:', error)
        }
      })
      subscriptions.value = []

      // Disconnect
      try {
        stompClient.value.deactivate()
      } catch (error) {
        console.error('❌ Error disconnecting:', error)
      }
      
      stompClient.value = null
      isConnected.value = false
      console.log('✅ WebSocket disconnected')
    }
  }

  // Cleanup khi component unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    connect,
    disconnect
  }
}

