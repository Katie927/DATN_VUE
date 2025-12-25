<template>

    <div class="w-container">
        <div class="wrapper">
            <div class="nav-full">
                <nav>
                    <ul class="root">
                        <li v-for="item in visibleSidebar" :key="item.path">
                          <router-link
                            :to="item.path"
                            class="sidebar-link"
                            active-class="isActive"
                          >
                            <i :class="item.icon"></i>
                            <span>{{ item.label }}</span>
                          </router-link>
                        </li>
                        <li @click="handleLogout"> <a href="">
                                <i class="icon-LogOutSolidOff"></i><span>Đăng xuất</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="right-content">
                <router-view />
            </div>
        </div>
    </div>

</template>

<script setup>

    import "@/assets/styles/login-style.css";
    import { computed, ref } from "vue";
    import router from "@/router";
    import axios from "axios";

    const userSidebar = ref([
        { path: "/user/promotion", icon: "icon-MenuSolidOff", label: "Tổng quan"},
        { path: "/user/order", icon: "icon-BoxSolidOff", label: "Đơn hàng" },
        { path: "/admin/product/list", icon: "icon-MoonSolidOff", label: "ADMIN", roles: ["ROLE_ADMIN"] },
        { path: "/user/profile/my-info", icon: "icon-ShieldSolidOff", label: "Thông tin cá nhân" },
    ])


const handleLogout = async () => {
  try {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      console.warn("Không tìm thấy token, có thể đã đăng xuất.");
      if (router.currentRoute.value.path !== "/login") {
        router.push("/login");
      }
      return;
    }

    // Gọi API logout trước
    await axios.post(
      "http://localhost:8080/bej3/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Xóa token sau khi logout thành công
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    if (router.currentRoute.value.path !== "/login") {
      router.push("/login");
    }
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);

    // fallback: vẫn xóa token & redirect
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/login");
  }
};

import { jwtDecode } from "jwt-decode"

function getScopesFromToken() {
  const token = localStorage.getItem("token")
  if (!token) return []

  try {
    const decoded = jwtDecode(token)
    return decoded.scope?.split(" ") ?? []
  } catch {
    return []
  }
}
const scopes = ref(getScopesFromToken())
const roles = computed(() =>
  scopes.value.filter(s => s.startsWith("ROLE_"))
)
const visibleSidebar = computed(() =>
  userSidebar.value.filter(item =>
    !item.roles ||
    item.roles.some(r => roles.value.includes(r))
  )
)


</script>