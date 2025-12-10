<template>
  <div>
    <section class="top-heading">
      <div class="slide-deal-header slick-initialized slick-slider">
        <button class="slick-prev slick arrow"></button>
        <div class="slick-list slide-deal-item draggeble">
          <a href="" class="deal-header">
            <i class="icon-ChangeSolidOff"></i>
            <span>Thu cũ giá cao toàn bộ sản phẩm</span>
          </a>
        </div>
        <button class="slick-next slick arrow"></button>
      </div>
    </section>

    <section class="w-container">
      <div class="logo-search-user">
        <div class="logo">
          <router-link to="/">
            <img class="logo-img" src="@/assets/img/logo2.png" alt="" />
          </router-link>
        </div>

        <div class="search">
          <div class="search-box">
            <form action="/tim-kiem" method="get">
              <div class="search-bg">
                <input
                  type="text"
                  name="kwd"
                  id="kwd"
                  placeholder="Hôm nay bạn muốn tìm kiếm gì?"
                />
                <button type="submit">
                  <i class="icon-SearchSolidOff"></i>
                  <span>Tìm kiếm</span>
                </button>
              </div>
            </form>
          </div>
          <div class="search-sugget">
            <strong>Từ khóa xu hướng</strong>
            <a href="">Galaxy S25</a>
            <a href="">Iphone 16</a>
            <a href="">Galaxy S23 Ultra</a>
            <a href="">Oppo Find X8</a>
          </div>
        </div>
        <div class="quick-for-user">
          <router-link to="/user/booking" class="shop-location">
            <i class="icon-location"></i>
            <span>Đặt lịch sửa chữa</span>
          </router-link>
          <router-link
            :to="userIsLoggedIn ? '/user/profile/my-info' : '/login'"
            class="member-login"
          >
            <i class="icon-UserSolidOff"></i>
            <span>{{ displayName }}</span>
          </router-link>

          <NotificationsDropdown />

          <router-link to="/user/cart" class="cart text-link">
            <i class="icon-CartSolidOff"></i>
            <label for="" id="cart-total" class="cart-counter">0</label>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'
import { userBus } from './userBus' 
import '@/assets/styles/header-style.css'
import '@/assets/styles/style.css'
import '@/assets/slick/slick.css'
import '@/assets/slick/jquery-3.7.1.min.js'
import '@/assets/slick/slick.min.js'
import NotificationsDropdown from '@/components/notification/NotificationsDropdown.vue'

defineProps(['updateIsHidden'])
const emit = defineEmits(['updateIsHidden'])

const lastScrollPosition = ref(0)
const isHidden = ref(false)
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleScroll = () => {
  let currentScroll = window.scrollY
  let scrollThreshold = 50 // Ngưỡng cuộn

  if (Math.abs(currentScroll - lastScrollPosition.value) < scrollThreshold) {
    return
  }

  if (currentScroll > lastScrollPosition.value) {
    isHidden.value = true
  } else {
    isHidden.value = false
  }

  emit('updateIsHidden', isHidden.value)
  lastScrollPosition.value = currentScroll
}

const currentUser = ref({})
const userIsLoggedIn = computed(() => !!localStorage.getItem('token'))
const displayName = computed(() => {
  return userIsLoggedIn.value ? currentUser.value.fullName || 'Người dùng' : 'Tài khoản'
})

const fetchUserProfile = async () => {
  const token = localStorage.getItem("token")
  if (!token) return

  try {
    const resp = await axios.get("http://localhost:8080/bej3/users/profile/my-info", {
      headers: { Authorization: `Bearer ${token}` }
    })
    currentUser.value = resp.data.result
  } catch (_) {
    localStorage.removeItem("token")
  }
}
onMounted(fetchUserProfile)
watch(() => userBus.refreshProfile.value, () => {
  fetchUserProfile()
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<style scoped>
.logo {
  width: 100%;
}

.logo-img {
  width: 100%;
  height: 110px;
  object-fit: contain;
  margin-top: -30px;
  margin-left: 10px;
}
</style>
