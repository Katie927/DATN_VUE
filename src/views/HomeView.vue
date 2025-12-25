
<template>
  <div class="w-container body-wrapper">
    <div class="wrapper">
      <div class="nav-full">
        <nav>
          <h2>Danh mục</h2>
          <ul class="root">
            <li v-for="(item, index) in categories" :key="index" @click="goToCategory(item.categoryId)">
              <a href="" @click.prevent >
                <label for=""><img :src="item.imgSrc" :alt="item.name"></label>
                <span>{{ item.name }}</span>
              </a>
            </li>
          </ul>
          
        </nav>
      </div>
  <!-- main-content -->
      <div class="right-content">
        <!-- top-slider -->
        <section>
          <div class="container"> 
            <div class="top-slider">
              <div class="slider-container">
                <Swiper
                  :loop="true"
                  :autoplay="{ delay: 3000, disableOnInteraction: false }"
                  :navigation="true"
                  :pagination="{ clickable: true }"
                  :modules="[Navigation, Pagination]"
                  class="main-slider"
                >
                  <SwiperSlide v-for="(item, index) in sliderImages" :key="index">
                    <a :href="item.link" target="_blank">
                      <img :src="item.url" alt="Slide Image" class="slide-image" />
                    </a>
                  </SwiperSlide>
                </Swiper>

              </div>
            </div>
          </div>
        </section>

        <!-- product-list -->
        <section>
          <div class="container list-for-you">
            <div class="title">
              Dành cho bạn
            </div>
            <div class="v5-list">
              <div class="v5-list-items">
                <div class="v5-list-container">
                  <div id="pageHolder" class="v5-grid-items item-4" style="grid-template-columns: repeat(4, minmax(0, 1fr));">
                    <div class="pj16-item" style="grid-row: span 1; grid-column: span 2; padding: 0; justify-content:center; background: rgba(238, 255, 247, 1);">
                      <div class="item-img-video-gif">
                        <a title="Gaming REDMAGIC 10 PRO 12GB/256GB" href="https://hoanghamobile.com/dien-thoai/redmagic-10-pro-16gb-512gb" data-id="0" class="" style="width: 100%;">
                          <i class="icon-PlayCircleSolidOn" id="play-icon-0" style="position: absolute; bottom: 12px; left: 12px; font-size: 40px; opacity: 0.5; display: none;"></i>
                          <img alt="Gaming REDMAGIC 10 PRO 12GB/256GB" src="https://cdn.hoanghamobile.com/Uploads/2024/12/25/r…;trim.threshold=0;trim.percentpadding=0;width=480" id="product-img-0" data-id="0" style="width: 100%; display: none;">
                          <video id="video-player-0" data-id="0" data-src="https://cdn.hoanghamobile.com/FetchVideo?src=/Uploads/2024/12/25/rm-10-pro-desktop.mp4" type="video/mp4" class="embed-responsive-item auto-play" style="background-color: black; width: 100%; pointer-events: none; display: block;" muted="muted" autoplay="autoplay" loop="loop" playsinline="playsinline" src="https://cdn.hoanghamobile.com/FetchVideo?src=/Uploads/2024/12/25/rm-10-pro-desktop.mp4">
                            <source src="" type="video/mp4">
                            Your browser does not support the video tag.
                          </video>
                        </a>
                      </div>
                    </div>
                    <div  v-for="(product, index) in productData"  :key="index" 
                      class="pj16-item" 
                        :style="{
                          gridRow: 'span 1',
                          gridColumn: 'span 1',
                          padding: '12px 12px 12px 12px'
                        }">
                      <div class="pj16-item-info" v-if="product">
                        <div class="img">
                          <div class="img-info">
                            <span class="left-sticker"> Góp 0%, 0 phí </span>
                            <router-link :to="`/product-detail/${product.id}`">
                              <img :src="product.image" :alt="product.name" style="max-width: 140px; max-height: 100%;">
                            </router-link>
                          </div>
                          <div class="specs">
                            <!-- <ul v-if="product.attributes && product.attributes.length > 0">
                              <li v-for="(attribute, i) in product.attributes" :key="i" class="spec-item">
                                <label>
                                  <span :class="['icon-CPU', 'icon-Battery', 'icon-Storage'][i % 3]"></span>
                                </label>
                                <div><span>{{ attribute }}</span></div>
                              </li>
                            </ul> -->
                          </div>
                        </div>
                        <h3>
                          <router-link :to="`/product-detail/${product.id}`">{{ product.name }}</router-link>
                        </h3>
                        <div class="item-gap8px">
                          <div class="price price-last">
                            <span style="text-decoration: line-through;" v-if="product.originalPrice">
                              <s>{{ product.variant.finalPrice == product.variant.originalPrice ? product.variant.finalPrice.toLocaleString('vi-VN') + " ₫" : "" }}</s>
                              
                            </span>
                            <span v-if="product.discount">- {{ product.discount }}%</span>
                          </div>
                          <div class="price">
                            <strong>{{ product.variant.finalPrice > 0 ? product.variant.finalPrice.toLocaleString('vi-VN') + " ₫" : "Liên hệ" }}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>

                  <!--  -->
                  
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
    
</template>

<script setup>
  import "@/assets/styles/style.css";
  import "@/assets/styles/home-style.css";
  import "@/assets/styles/product-list.css";
  import { onMounted, ref } from "vue";

  import { Swiper, SwiperSlide } from "swiper/vue";
  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/pagination";
  import { Navigation, Pagination } from "swiper/modules";
  import axios from "axios";
  import { useRouter } from "vue-router";


  const images = import.meta.glob('/src/assets/img/side-bar-img/*', { eager: true });
  // console.log(images)
  const categories = ref([
    { name: "Điện thoại", imgSrc: '/src/assets/img/side-bar-img/mobile.png', categoryId: 10 }, 
    { name: "Sửa chữa", imgSrc: '/src/assets/img/side-bar-img/logo-sua-chua.png', categoryId: 24 },
    { name: "Laptop", imgSrc: '/src/assets/img/side-bar-img/laptop.png', categoryId: 11 },
    { name: "Tablet", imgSrc: '/src/assets/img/side-bar-img/tablet.png', categoryId: 12 },
    { name: "Đồng hồ", imgSrc: '/src/assets/img/side-bar-img/dong-ho.png', categoryId: 13},
    { name: "Phụ kiện", imgSrc: '/src/assets/img/side-bar-img/phu-kien.png', categoryId: 14 }
  ]);

  const sliderImages = ref([
    {
      url: "/src/assets/img/main-slider-img/16e-dat-truoc-ngay-1200x375.png",
      link: "",
    },
    {
      url: "/src/assets/img/main-slider-img/pre-oder-xiaomi-web1200.png",
      link: "",
    },
    {
      url: "/src/assets/img/main-slider-img/s25-ultra-1200x375.png",
      link: "",
    },
    {
      url: "/src/assets/img/main-slider-img/banner-iphone-16-series_638761814156857415.png",
      link: "",
    },
    {
      url: "/src/assets/img/main-slider-img/redmi-pad-pro-01.jpg",
      link: "",
    },
    {
      url: "/src/assets/img/main-slider-img/pad-11-web.png",
      link: "",
    },
  ]);

  const productData = ref([])
  const fetchProductData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/bej3/home');
      productData.value = response.data.result.products;
    } catch (error) {
      console.error('Error: ', error);
    }
  };
  onMounted(fetchProductData);

  // const thumbsSwiper = ref(null);
  const router = useRouter()
  const goToCategory = (categoryId) => {
    router.push({
      path: '/search',
      query: {
        categoryId
      }
    })
  }
  
  
</script>

<style scoped>
  .nav-full nav ul li > a:hover {
    background: #EBEBEB;
  }
  .nav-full nav ul li > a{
    font-weight: 700;
  }

  
</style>

