<template>

    <section class="top-heading">
        <div class="slide-deal-header slick-initialized slick-slider">
            <button class="slick-prev slick arrow"> 

            </button>
            <div class="slick-list slide-deal-item draggeble">
                <a href="" class="deal-header">
                    <i class="icon-ChangeSolidOff"></i>
                    <span>Thu cũ giá cao toàn bộ sản phẩm</span>
                </a>
            </div>
            <button class="slick-next slick arrow">

            </button>
        </div>
    </section>
    <section class="w-container">
        <div class="logo-search-user">
            <div class="logo">
                <router-link to="/">
                    <img src="@/assets/img/logo.svg" alt="">
                </router-link>
            </div>
            <div class="search">
                <div class="search-box">
                    <form action="/tim-kiem" method="get">
                        <div class="search-bg">
                            <input type="text" name="kwd" id="kwd" placeholder="Hôm nay bạn muốn tìm kiếm gì?">
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
                <router-link to="" class="shop-location">
                    <i class="icon-location"></i>
                    <span>Tìm siêu thị</span>
                </router-link>
                <router-link :to="userIsLoggedIn ? '/user/profile/my-info' : '/login'" class="member-login">
                    <i class="icon-UserSolidOff"></i>
                    <span>{{displayName}}</span>
                </router-link>
                <router-link to="" class="cart text-link">
                    <i class="icon-CartSolidOff"></i>
                    <label for="" id="cart-total" class="cart-counter">0</label>
                </router-link>
            </div>

        </div>
    </section>

</template>


<script setup>
    import { ref, computed, onMounted, onUnmounted } from "vue";
    import "@/assets/styles/header-style.css";
    import "@/assets/styles/style.css";
    import "@/assets/slick/slick.css";
    import "@/assets/slick/jquery-3.7.1.min.js";
    import "@/assets/slick/slick.min.js";

    defineProps(["updateIsHidden"]);
    const emit = defineEmits(["updateIsHidden"]);

    const lastScrollPosition = ref(0);
    const isHidden = ref(false);

    const handleScroll = () => {
        let currentScroll = window.scrollY;
        let scrollThreshold = 50; // Ngưỡng cuộn

        if (Math.abs(currentScroll - lastScrollPosition.value) < scrollThreshold) {
            return;
        }

        if (currentScroll > lastScrollPosition.value) {
            isHidden.value = true;
        } else {
            isHidden.value = false;
        }

        emit("updateIsHidden", isHidden.value);
        lastScrollPosition.value = currentScroll;
    };

    onMounted(() => {
        window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener("scroll", handleScroll);
    });

    const userIsLoggedIn = computed(() => {
        return !!localStorage.getItem("token");
    });

    const displayName = computed(() => userIsLoggedIn.value ? localStorage.getItem("name") || "Người dùng" : "Tài khoản");
</script>



