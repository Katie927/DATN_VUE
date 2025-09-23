<template>

    <div class="w-container">
        <div class="wrapper">
            <div class="nav-full">
                <nav>
                    <ul class="root">
                        <li v-for="item in userSidebar" :key="item.path">
                            <router-link :class="{ isActive: $route.path === item.path }" :to="item.path">
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
    import { ref } from "vue";
    import router from "@/router";
    import axios from "axios";

    const userSidebar = ref([
        { path: "/user/promotion", icon: "icon-MenuSolidOff", label: "Tổng quan" },
        { path: "/user/order", icon: "icon-BoxSolidOff", label: "Đơn hàng" },
        { path: "/user/history", icon: "icon-MoonSolidOff", label: "Lịch sử mua hàng" },
        { path: "/user/profile/my-info", icon: "icon-ShieldSolidOff", label: "Thông tin cá nhân" },
    ])


    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            if (!token) {
                console.warn("Không tìm thấy token, có thể đã đăng xuất.");
                if (router.currentRoute.value.path !== '/login') {
                    router.push('/login');
                }
                return;
            }
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            await nextTick();

            await axios.post("http://localhost:8080/bej3/auth/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (router.currentRoute.value.path !== '/login') {
                router.push('/login');
            }
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        }
    }

</script>