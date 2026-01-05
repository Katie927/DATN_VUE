
<template>
  <div class="w-container body-wrapper">
    <div class="wrapper">
      <div class="nav-full">
        <nav>
          <h2>Danh mục</h2>
          <ul class="root">
            <li v-for="(item, index) in categories" :key="index" @click="fetchByCategory(item.categoryId)">
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
                    <div  v-for="(product, index) in products"  :key="index" 
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
                          </div>
                        </div>
                        <h3>
                          <router-link :to="`/product-detail/${product.id}`">{{ product.name }}</router-link>
                        </h3>
                        <div class="item-gap8px">
                          <div class="price price-last">
                            <span style="text-decoration: line-through;" v-if="product.originalPrice">
                              <s>{{ product.finalPrice == product.originalPrice ? product.finalPrice.toLocaleString('vi-VN') + " ₫" : "" }}</s>
                              
                            </span>
                            <span v-if="product.discount">- {{ product.discount }}%</span>
                          </div>
                          <div class="price">
                            <strong>{{ product.finalPrice > 0 ? product.finalPrice.toLocaleString('vi-VN') + " ₫" : "Liên hệ" }}</strong>
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
// -------------------------------------------------------------- script setup --------------------------------------------------------------
<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router'

  const categories = ref([
    { name: "Điện thoại", imgSrc: '/src/assets/img/side-bar-img/mobile.png', categoryId: 10 }, 
    { name: "Linh kiện", imgSrc: '/src/assets/img/side-bar-img/logo-sua-chua.png', categoryId: 24 },
    { name: "Phụ kiện", imgSrc: '/src/assets/img/side-bar-img/laptop.png', categoryId: 12 },
    { name: "Sửa chữa", imgSrc: '/src/assets/img/side-bar-img/tablet.png', categoryId: 33 },
    { name: "Dịch vụ", imgSrc: '/src/assets/img/side-bar-img/dong-ho.png', categoryId: 11},
  ]);


  const route = useRoute()
  const keyword = ref(route.query.kw || '')
  const products = ref([])

  const fetchProducts = async () => {
    if (!keyword.value) return

    const res = await axios.get(
      'http://localhost:8080/bej3/home/products/search/page',
      {
        params: {
          name: keyword.value,
          // page: 1,
          // size: 10
        }
      }
    )

    products.value = res.data.result.content
  }
  watch(
    () => route.query.kw,
    (newKw) => {
      keyword.value = newKw
      fetchProducts()
    },
    { immediate: true }
  )

  const fetchByCategory = async (categoryId) => {
  const res = await axios.get(
      `http://localhost:8080/bej3/home/products/category/${categoryId}`
    )
    products.value = res.data.result
  }

  watch(
    () => route.query.categoryId,
    (id) => {
      if (id) fetchByCategory(id)
    },
    { immediate: true }
  )
</script>
