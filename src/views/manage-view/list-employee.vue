<template>
<div class="kv-product">
    <div class="kv-container">
        <div class="kv-product-main-left">
                <!-- Header -->
            <div class="em-left-header">
                <h1 class="em-left-heading">Nhân viên</h1>
            </div>
        </div>
        <div class="kv-product-main-body">
            <!-- <div class="kv-product-main-left"> -->
                <!-- Header -->
                <!-- <div class="em-left-header">
                    <h1 class="em-left-heading">Nhân viên</h1>
                </div> -->

                <!-- Loại hàng -->
                <!-- <div class="em-left-content content-product-type">
                    <div class="em-left-content-title">
                        <h3 class="em-left-content-heading">Vai trò</h3>
                    </div>
                    <div class="product-type-group-check">
                        <label v-for="(item, index) in productTypes"
                            :key="index" class="container-check-box check-box-menu-type"
                        >
                        {{ item.label }}
                            <input
                                type="checkbox"
                                v-model="item.checked"
                            />
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div> -->

                <!-- Nhóm hàng -->
                <!-- <div class="em-left-content content-product-group">
                    <div class="em-left-content-title">
                        <h3 class="em-left-content-heading">Chức vụ</h3>
                    </div>
                    <div class="product-group-list">
                        <div class="product-group-icon-input">
                        <i class="product-group-search-icon fas fa-search" aria-hidden="true"></i>
                        <input
                            id="productGroupListSearch"
                            type="search"
                            class="form-control hide-show-product-group"
                            placeholder="Tìm kiếm nhóm hàng"
                        />
                        </div>

                        <div class="product-group-list-items">
                        <ul class="form-items">
                            <li
                            class="form-item"
                            >
                            <span class="item-name product-group-name"></span>
                            <i class="fas fa-pen" aria-hidden="true"></i>
                            </li>
                        </ul>
                        </div>
                    </div>
                </div> -->
                <!-- <aside class="em-left-pageside">
                    <label for="numberOfRecordsProduct">Số bản ghi</label>
                    <select name="Số bản ghi: " id="numberOfRecord"></select>
                </aside> -->
            <!-- </div> -->

            <div class="kv-product-main-right">
                <div class="product-right-header">
                    <!-- header filter search -->
                    <div class="header-filter-search">
                        <div class="input-group input-group-search-product-code" id="groupInputSearchProductCode">
                            <i class="input-group-icon fas fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                            <input type="text" name="" id="searchCodeName" class="form-control" placeholder="Tìm theo mã, Tên nhân viên">
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
                                <ul class="btn-add-product-list" id="btnAddProductList">
                                    <li>
                                        <button class="operation" id="addCommodityProductButton" data-action="" @click="showEmpployeeAdd = true">
                                        <i class="btn-icon fas fa-solid fa-plus" aria-hidden="true"></i>
                                        <span>Thêm nhân viên</span>
                                        </button>
                                    </li>
                                </ul>
                                
                            </li>

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
                                <th class="product-name" for="containerCheckBoxProductName">Mã nhân viên</th>
                                <th class="product-name" for="containerCheckBoxProductName">Tên nhân viên</th>
                                <th class="product-type" for="containerCheckBoxProductType">Số điện thoại</th>
                                <th class="selling-price" for="containerCheckBoxSellingPrice">Email</th>
                                <th class="cost-price" for="containerCheckBoxCostPrice">Ngày sinh</th>
                                <th class="trademark" for="containerCheckBoxTrademark">Địa chỉ</th>
                                <th class="inventory" for="containerCheckBoxInventory">Email</th>
                            </tr>
                        </thead>

                        <tbody>
                            <template v-for="employee in employeeData" :key="employee.id">
                                <tr class="kv-table-row" @click="toggleDetail(employee.id)">
                                    <td class="cell-check">
                                        <label class="container-check-box">
                                            <input type="checkbox" :value="employee.id" />
                                            <span class="checkmark"></span>
                                        </label>
                                    </td>
                                    <td class="cell-img">
                                        <img :src="employee.image" alt="img" style="width: 30px" />
                                    </td>
                                    <!-- <td class="cell-img"></td> -->
                                    <td class="product-name">{{ employee.id }}</td>
                                    <td class="product-type">{{ employee.fullName }}</td>
                                    <td class="selling-price">{{ employee.phoneNumber }}</td>
                                    <td class="cost-price">{{ employee.email }}</td>
                                    <td class="trademark">{{ employee.dob }}</td>
                                    <td class="inventory">{{ employee.address }}</td>
                                    <td class="inventory">{{ employee.email }}</td>
                                </tr>
                                <tr v-if="expandedId === employee.id">
                                    <td colspan="9" class="cell-detail p-0">
                                        <EmployeeDetails :employee-id ="employee.id"
                                                        @edit-user="handleEditUser" />
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

<EmployeeAdd v-if="showEmpployeeAdd" :user="selectedUser" @close="showEmpployeeAdd = false, selectedUser=null"/>

</template>

<script setup>

import '@/assets/styles/admin-css/kv-product.css'; 
import '@/assets/styles/admin-css/kv-style.css'; 

import axios from "axios";
import { ref, onMounted, watch } from 'vue';
import { useRouter } from "vue-router";
import EmployeeDetails from './employee-details.vue';

import EmployeeAdd from './employee-add.vue';

const router = useRouter();

const showEmpployeeAdd = ref(false)

const productTypes = ref([
  { label: 'Nhân viên', checked: true }
])

const employeeData = ref([])
const fetchEmployeeData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token không tồn tại!");
        router.push("/login"); // Chuyển hướng về trang login
        return;
    }
    try {
        const response = await axios.get(`http://localhost:8080/bej3/manage/users/search/role?roles=ADMIN&roles=EMPLOYEE_MANAGER&roles=SHOP_MANAGER`, {
            headers: {
                Authorization: `Bearer ${token}` // Gửi token trong header
            }
        });

        // console.log("Response Data:", response.data);
        employeeData.value = response.data.result;
        // console.log("Product Data in Vue:", productData.value);
    } catch (error) {
        console.error('Lỗi:', error);
        // Nếu lỗi 401 (Unauthorized) hoặc 403 (Forbidden), chuyển hướng về trang login
        if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 500)) {
            localStorage.removeItem("token"); // Xóa token cũ
            router.push("/login"); // Chuyển hướng về trang đăng nhập
        }
    }
};
onMounted(fetchEmployeeData);

// edit --------------------------------------------------------
const selectedUser = ref(false)
const handleEditUser = (user) => {
    selectedUser.value = {...user};
    showEmpployeeAdd.value = true;
}

const expandedId = ref(null)
function toggleDetail(id) {
  expandedId.value = expandedId.value === id ? null : id
  console.log(expandedId)
}

defineProps({
  employeeData: Array
})

watch(showEmpployeeAdd, (val) => {
  if (val) {
    document.body.style.overflow = "hidden"; // chặn cuộn nền
  } else {
    document.body.style.overflow = ""; // trả lại bình thường
  }
});

</script>