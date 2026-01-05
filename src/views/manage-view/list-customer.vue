<template>
<div class="kv-product">
    <div class="kv-container">
        <div class="kv-product-main-left">
                <!-- Header -->
                <div class="em-left-header">
                    <h1 class="em-left-heading">Khách hàng</h1>
                </div>
        </div>
        <div class="kv-product-main-body">

            <div class="kv-product-main-right">
                <div class="product-right-header">
                    <!-- header filter search -->
                    <div class="header-filter-search">
                        <div class="input-group input-group-search-product-code" id="groupInputSearchProductCode">
                            <i class="input-group-icon fas fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                            <input type="text" class="form-control" id="searchCodeName" placeholder="Tìm theo số điện thoại"
                                    v-model="phoneNumber" @keyup.enter="handleSearch">
                        </div>

                        <div class="choosed-items" style="display: none;">
                            <div class="choosed-number">
                                <span>Đã chọn</span>
                                <div id="selectedCountProduct">0</div>
                            </div>
                            <i class="btn-icon fas fa-solid fa-times" id="btnIconCloseProduct" aria-hidden="true"></i>
                        </div>
                    </div>

                </div>

                <!-- product table -->
                <div class="table-container">
                    <table class="employee-table-list">
                        <thead class="table-header">
                            <tr class="table-row-header">
                                <!-- <th id="cellCheckAll">
                                    <label class="container-check-box">
                                        <input
                                        class="check-all"
                                        type="checkbox"
                                        id="checkAllProduct"
                                        @change="toggleCheckAll"
                                        />
                                        <span class="checkmark"></span>
                                    </label>
                                </th> -->
                                <th class="cell-img" for="containerCheckBoxCellImgProduct">
                                    <a href="#" class="k-link"></a>
                                </th>
                                <!-- <th class="cell-img" for="containerCheckBoxCellImgProduct">
                                    <a href="#" class="k-link"></a>
                                </th> -->
                                <th class="product-name" for="containerCheckBoxProductName">Mã khách hàng</th>
                                <th class="product-name" for="containerCheckBoxProductName">Tên khách hàng</th>
                                <th class="product-type" for="containerCheckBoxProductType">Số điện thoại</th>
                                <th class="selling-price" for="containerCheckBoxSellingPrice">CCCD/CMND</th>
                                <th class="cost-price" for="containerCheckBoxCostPrice">Ngày sinh</th>
                                <th class="trademark" for="containerCheckBoxTrademark">Địa chỉ</th>
                                <th class="inventory" for="containerCheckBoxInventory">Email</th>
                            </tr>
                        </thead>

                        <tbody>
                            <template v-for="customer in customerData" :key="customer.id">
                                <tr class="kv-table-row" @click="toggleDetail(customer.id)">
                                    <!-- <td class="cell-check">
                                        <label class="container-check-box">
                                            <input type="checkbox" :value="customer.id" />
                                            <span class="checkmark"></span>
                                        </label>
                                    </td> -->
                                    <td class="cell-img">
                                        <img :src="customer.image" alt="img" style="width: 30px" />
                                    </td>
                                    <!-- <td class="cell-img"></td> -->
                                    <td class="product-name">{{ customer.id }}</td>
                                    <td class="product-type">{{ customer.fullName }}</td>
                                    <td class="selling-price">{{ customer.phoneNumber }}</td>
                                    <td class="cost-price">{{ customer.phoneNumber }}</td>
                                    <td class="trademark">{{ customer.dob }}</td>
                                    <td class="inventory">{{ customer.address }}</td>
                                    <td class="inventory">{{ customer.email }}</td>
                                </tr>
                                <tr v-if="expandedId === customer.id">
                                    <td colspan="9" class="cell-detail p-0">
                                        <EmployeeDetails :employee-id ="customer.id"
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
  { label: 'USER', checked: true },
])

const customerData = ref([])
const fetchCustomerData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token không tồn tại!");
        router.push("/login"); // Chuyển hướng về trang login
        return;
    }
    try {
        const response = await axios.get(`http://localhost:8080/bej3/manage/users/search/role?roles=USER`, {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });
        customerData.value = response.data.result;
    } catch (error) {
        console.error('Lỗi:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 500)) {
            localStorage.removeItem("token"); 
            router.push("/login"); 
        }
    }
};
onMounted(fetchCustomerData);

const phoneNumber = ref("");
const handleSearch = () => {
  if (!phoneNumber.value.trim()) return;
  searchByPhoneNumber(phoneNumber.value);
};
const searchByPhoneNumber = async (phoneNumber) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token không tồn tại!");
        router.push("/login"); 
        return;
    }
    try {
        const response = await axios.get(`http://localhost:8080/bej3/manage/users/search`, {
            params: { phoneNumber: phoneNumber },
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });
        customerData.value = [response.data.result];
    } catch (error) {
        console.error('Lỗi:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem("token"); 
            router.push("/login"); 
        }
    }
};

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