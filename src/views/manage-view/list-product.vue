<template>

    <div class="kv-product">
        <div class="kv-container">
            <div class="kv-product-main-body">
                <!-- left -->
                <div class="kv-product-main-left">
                    <!-- Header -->
                    <div class="em-left-header">
                        <h1 class="em-left-heading">Hàng hóa</h1>
                    </div>

                    <!-- Loại hàng -->
                    <div class="em-left-content content-product-type">
                        <div class="em-left-content-title">
                            <h3 class="em-left-content-heading">Loại hàng</h3>
                        </div>
                        <div class="product-type-group-check">
                            <label
                            v-for="(item, index) in productTypes"
                            :key="index"
                            class="container-check-box check-box-menu-type"
                            >
                            {{ item.name }}
                                <input
                                    type="checkbox"
                                    v-model="item.checked"
                                />
                                <span class="checkmark"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Nhóm hàng -->
                    <div class="em-left-content content-product-group">
                        <div class="em-left-content-title">
                            <h3 class="em-left-content-heading">Nhóm hàng</h3>
                        </div>
                        <div class="product-group-list">
                            <div class="product-group-icon-input">
                                <i class="product-group-search-icon fas fa-search" aria-hidden="true"></i>
                                <input id="productGroupListSearch" type="search"
                                    class="form-control hide-show-product-group" placeholder="Tìm kiếm nhóm hàng"
                                    v-model="searchKeyword"
                                />
                            </div>

                        </div>
                    </div>
                    <!-- <aside class="em-left-pageside">
                        <label for="numberOfRecordsProduct">Số bản ghi</label>
                        <select name="Số bản ghi: " id="numberOfRecord"></select>
                    </aside> -->
                </div>

                <!-- right -->
                <div class="kv-product-main-right">
                    <div class="product-right-header">
                        <!-- header filter search -->
                        <div class="header-filter-search">
                            <div class="input-group input-group-search-product-code" id="groupInputSearchProductCode">
                                <i class="input-group-icon fas fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                                    <input type="text" name="" id="searchCodeName" class="form-control" placeholder="Tìm theo mã, Tên hàng"
                                        v-model="keyWord" @keyup.enter="handleSearchProduct">
                            </div>

                            <div class="choosed-items" style="display: none;">
                                <div class="choosed-number">
                                    <span>Đã chọn</span>
                                    <div id="selectedCountProduct">0</div>
                                </div>
                                <i class="btn-icon fas fa-solid fa-times" id="btnIconCloseProduct" aria-hidden="true"></i>
                            </div>
                        </div>

                        <!-- header filter buttons -->
                        <div class="header-filter-buttons">
                            <ul class="header-filter-button-items">
                                <li class="header-filter-button-item" id="addMoreProductButton">
                                    <button class="btn-success">
                                        <i class="btn-icon fas fa-solid fa-plus" aria-hidden="true"></i>
                                        <span>Thêm mới</span>
                                        <span></span>
                                        <i class="btn-icon fas fa-solid fa-caret-down" aria-hidden="true"></i>
                                    </button>
                                    <ul class="btn-add-product-list" id="btnAddProductList" style="z-index: 11;">
                                        <li>
                                            <button class="operation" id="addCommodityProductButton" data-action="" @click="showProductAdd = true">
                                                <i class="btn-icon fas fa-solid fa-plus" aria-hidden="true"></i>
                                                <span>Thêm hàng hóa</span>
                                            </button>
                                            
                                        </li>
                                        <li>
                                            <button class="operation" id="addServiceProductButton" data-action="">
                                                <i class="btn-icon fas fa-solid fa-plus" aria-hidden="true"></i>
                                                <span>Thêm dịch vụ</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button class="operation" id="addComboProductButton" data-action="">
                                            <i class="btn-icon fas fa-solid fa-plus" aria-hidden="true"></i>
                                            <span>Thêm Combo-đóng gói</span>
                                            </button>
                                        </li>
                                    </ul>
                                    
                                </li>
                            
                                <!-- <li class="header-filter-button-item">
                                    <button class="btn-success" id="" data-action="importFile">
                                    <i class="btn-icon fas fa-solid fa-file-import" aria-hidden="true"></i>
                                    <span>Import</span>
                                    </button>
                                </li>

                                <li class="header-filter-button-item">
                                    <button class="btn-success" id="" data-action="exportFile">
                                    <i class="btn-icon fas fa-solid fa-file-export" aria-hidden="true"></i>
                                    <span>Xuất file</span>
                                    </button>
                                </li> -->

                                <li class="header-filter-button-item">
                                    <button class="btn-success k-link">
                                        <i class="btn-icon fas fa-solid fa-list" aria-hidden="true"></i>
                                        <span></span>
                                        <i class="btn-icon fas fa-solid fa-caret-down" aria-hidden="true"></i>
                                    </button>
                                    <ul class="">
                                        <li class="">
                                            <div class="animation-container animation-container-product" id="animationContainerProduct">
                                                <label class="container-check-box check-box-menu">Hình ảnh
                                                    <input id="containerCheckBoxCellImgProduct" type="checkbox" checked="checked">
                                                    <span class="checkmark"></span>
                                                </label>

                                                <label class="container-check-box check-box-menu">Mã hàng
                                                    <input id="containerCheckBoxProductCode" type="checkbox" checked="checked">
                                                    <span class="checkmark"></span>
                                                </label>

                                                <label class="container-check-box check-box-menu">Tên hàng
                                                    <input id="containerCheckBoxProductName" type="checkbox" checked="checked">
                                                    <span class="checkmark"></span>
                                                </label>

                                                <label class="container-check-box check-box-menu">Nhóm hàng
                                                    <input id="containerCheckBoxProductGroup" type="checkbox" checked="checked">
                                                    <span class="checkmark"></span>
                                                </label>


                                                <label class="container-check-box check-box-menu">Giá bán
                                                    <input id="containerCheckBoxSellingPrice" type="checkbox" checked="checked">
                                                    <span class="checkmark"></span>
                                                </label>

                                                <label class="container-check-box check-box-menu">Giá vốn
                                                    <input id="containerCheckBoxCostPrice" type="checkbox" checked="checked">
                                                    <span class="checkmark"></span>
                                                </label>

                                                <label class="container-check-box check-box-menu">Thương hiệu
                                                    <input id="containerCheckBoxTrademark" type="checkbox" checked="checked">
                                                    <span class="checkmark"></span>
                                                </label>

                                                <label class="container-check-box check-box-menu">Tồn kho
                                                    <input id="containerCheckBoxInventory" type="checkbox" checked="checked">
                                                    <span class="checkmark"></span>
                                                </label>

                                                <label class="container-check-box check-box-menu">Vị trí
                                                    <input id="containerCheckBoxLocation" type="checkbox" checked="checked">
                                                    <span class="checkmark"></span>
                                                </label>

                                                <label class="container-check-box check-box-menu">Trạng thái
                                                    <input id="containerCheckBoxProductStatus" type="checkbox" checked="checked">
                                                    <span class="checkmark"></span>
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- product table -->
                    <div class="table-container">
                        <table class="employee-table-list">
                            <thead class="table-header">
                                <tr class="table-row-header">
                                    <th id="cellCheckAll">
                                        <label class="container-check-box">
                                            <input
                                            class="check-all"
                                            type="checkbox"
                                            id="checkAllProduct"
                                            @change="toggleCheckAll"
                                            />
                                            <span class="checkmark"></span>
                                        </label>
                                    </th>
                                    <th class="cell-img" for="containerCheckBoxCellImgProduct">
                                        <a href="#" class="k-link"></a>
                                    </th>
                                    <!-- <th class="cell-img" for="containerCheckBoxCellImgProduct">
                                        <a href="#" class="k-link"></a>
                                    </th> -->
                                    <th class="product-name" for="containerCheckBoxProductName">Tên hàng</th>
                                   
                                    <!-- <th class="inventory" for="containerCheckBoxInventory">Màu</th>
                                    <th class="product-type" for="containerCheckBoxProductType">Giá vốn</th> -->
                                    <th class="selling-price" for="containerCheckBoxSellingPrice">Giá bán</th>
                                
                                    <th class="cost-price" for="containerCheckBoxCostPrice">Thương hiệu</th>
                                    <th class="trademark" for="containerCheckBoxTrademark">Đã bán</th>
                                    <th class="inventory" for="containerCheckBoxInventory">Tồn kho</th>
                                    <th class="inventory" for="containerCheckBoxInventory">Trạng thái</th>
                                </tr>
                            </thead>

                            <tbody>
                                <template v-for="(product, index) in productData" :key="product.id">
                                    <tr class="kv-table-row" @click="toggleDetail(product.id)" >
                                        <td class="cell-check">
                                            <label class="container-check-box">
                                                <input type="checkbox" :value="product.id" />
                                                <span class="checkmark"></span>
                                            </label>
                                        </td>
                                        <td class="cell-img">
                                            <img :src="product.image" alt="img" style="width: 43px" />
                                        </td>
                                        <td class="product-name">{{ product.name }}</td>
                                        <!-- <td class="inventory">{{ product.color }}</td> -->
                                        <!-- <td class="product-type">{{ product.name }}</td>
                                        <td class="selling-price">{{ product.originalPrice.toLocaleString('vi-VN') }}</td> -->
                                        <td class="cost-price">{{ product.variant.finalPrice.toLocaleString('vi-VN') }}</td>
                                        <td class="cost-price">{{ product.name }}</td>
                                        <!-- <td class="trademark">{{ product.name }}</td> -->
                                        <td class="inventory">{{ product.name }}</td>
                                        <td class="inventory">{{ product.status }}</td>
                                        <td class="inventory">{{ product.status }}</td>
                                    </tr>
                                    <tr v-if="expandedId === product.id">
                                        <td colspan="9" class="cell-detail p-0">
                                            <ProductDetailRow :product-id ="product.id" @edit-product="handleEditProduct"
                                                                                    @deleted-success="fetchProductData"/>
                                        </td>
                                    </tr>
                                </template>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <ProductAdd v-if="showProductAdd" :product="selectedProduct"  @close="showProductAdd = false, selectedProduct = null"
                                        @added-success="fetchProductData" />
</template>

<script setup>

import '@/assets/styles/admin-css/kv-product.css'; 
import '@/assets/styles/admin-css/kv-style.css'; 

import ProductDetailRow from "@/views/manage-view/product-detail-row.vue";
import ProductAdd from './product-add.vue';

import axios from "axios";
import { ref, computed, onMounted, watch } from 'vue'
import router from '@/router';

const productTypes = ref([ ])

const searchKeyword = ref('')
const productGroups = ref(['Sách', 'Kéo'])

const filteredProductGroups = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()
  return productGroups.value.filter(group =>
    group.toLowerCase().includes(keyword)
  )
})

const productData = ref([ ])
const fetchProductData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token không tồn tại!");
        router.push("/login"); // Chuyển hướng về trang login
        return;
    }
    try {
      const [productListResponse, categoryListResponse] = await Promise.all([
            axios.get("http://localhost:8080/bej3/manage/product/list", {
                headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8080/bej3/admin/category", {
                headers: { Authorization: `Bearer ${token}` },
            }),
        ]);
      // console.log("Response Data:", response.data);
      productData.value = productListResponse.data.result;
      productTypes.value = categoryListResponse.data.result;
    } catch (error) {
        console.error('Lỗi:', error);
        // Nếu lỗi 401 (Unauthorized) hoặc 403 (Forbidden), chuyển hướng về trang login
        if (error.response && (error.response.status === 401 || error.response.status === 500)) {
            localStorage.removeItem("token"); // Xóa token cũ
            router.push("/login"); // Chuyển hướng về trang đăng nhập
        }
    }
};
onMounted(async () => {
  await fetchProductData();
});

const expandedId = ref(null)
function toggleDetail(id) {
    // console.log('Chọn product:', id);
  expandedId.value = expandedId.value === id ? null : id
}

defineProps({
  productData: Array
})

const showProductAdd = ref(false);
const selectedProduct = ref(null);

watch(showProductAdd, (val) => {
  if (val) {
    document.body.style.overflow = "hidden"; // chặn cuộn nền
  } else {
    document.body.style.overflow = ""; // trả lại bình thường
  }
});
const handleEditProduct = (product) => {
    selectedProduct.value = { ...product };  // clone product
    showProductAdd.value = true;
};

//==============================================================   search product ==   ================================
const keyWord = ref("");
const handleSearchProduct = () => {
  if (!keyWord.value.trim()) return;
  searchProduct(keyWord.value);
};
const searchProduct = async (keyWord) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token không tồn tại!");
        router.push("/login"); 
        return;
    }
    try {
        const response = await axios.get(`http://localhost:8080/bej3/home/products/search`, {
            params: { name: keyWord },
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });
        productData.value = [response.data.result];
    } catch (error) {
        console.error('Lỗi:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem("token"); 
            router.push("/login"); 
        }
    }
};

</script>

<style scoped>




</style>