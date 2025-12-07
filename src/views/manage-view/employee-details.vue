<template>
  <tr v-if="employeeDetails" class="row-detail row-detail-commodity">
    <td colspan="9" class="cell-detail">
      <div class="product-detail">
        <div class="product-detail-container">
          <div class="product-detail-body">
            <div class="identification-item">
              <h3 class="identification-item-title">{{  }}</h3>
            </div>

            <div class="form-wrapper product-detail-body-container">
              <div class="product-detail-left">
                <div class="profile-img-detail-large">
                  <div class="wrap-img-detail-large">
                    <img class="preview-img-detail-large" src="" alt="Preview" />
                  </div>
                </div>
                
              </div>
              

              <div class="product-detail-right">
                <div class="product-detail-right-content">
                  <div class="product-detail-identification">
                    <div class="identification-group">
                      <div class="identification-item"><span class="identification-item-name">Mã nhân viên:</span><span class="identification-item-code">{{ employeeDetails.id }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Họ tên:</span><span class="identification-item-code">{{ employeeDetails.fullName  }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Ngày sinh:</span><span class="identification-item-code">{{ employeeDetails.dob  }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Giới tính:</span><span class="identification-item-code">{{ employeeDetails.fullName  }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Số CMND/CCCD:</span><span class="identification-item-code">{{ employeeDetails.name }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Phòng ban:</span><span class="identification-item-code">{{   }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Chức danh:</span><span class="identification-item-code">{{   }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Vị trí:</span><span class="identification-item-code"></span></div>
                    </div>
                  </div>

                  <div class="product-detail-identification">
                    <div class="identification-group">
                      <div class="identification-item"><span class="identification-item-name">Ngày bắt đầu làm việc:</span><span class="identification-item-code">{{   }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Số điện thoại:</span><span class="identification-item-code">{{ employeeDetails.phoneNumber }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Email:</span><span class="identification-item-code">{{ employeeDetails.email }}</span></div>
                      <div class="identification-item"><span class="identification-item-name"></span><span class="identification-item-code">{{   }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Giá bán:</span><span class="identification-item-code">{{   }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Địa chỉ:</span><span class="identification-item-code">{{ employeeDetails.address }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Trạng thái:</span><span class="identification-item-code"></span></div>
                    </div>
                  </div>

                  <div class="product-detail-description">
                    <div class="description-group">
                      <div class="description-item"><span class="description-item-name">Ghi chú</span><span class="description-item-code">{{   }}</span></div>
                      <!-- <div class="description-item"><span class="description-item-name">Ghi chú đặt hàng</span><span class="description-item-code">{{   }}</span></div>
                      <div class="description-item"><span class="description-item-name">Nhà cung cấp</span><span class="description-item-code">{{   }}</span></div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="add-edit-product">
              <button class="btn btn-success btn-edit-product" @click="handleEdit">Cập nhật</button>
              <button class="btn btn-red btn-lock-product" @click=" ">Lịch làm việc</button>
              <button class="btn btn-red btn-remove-product" @click=" ">Xóa</button>
              <button class="btn btn-more btn-more-product">...</button>
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup>

import '@/assets/styles/admin-css/kv-product.css'; 
import '@/assets/styles/admin-css/kv-style.css';
import router from '@/router';
import axios from 'axios';
import { ref, watch, onMounted } from 'vue';

const emit = defineEmits(['edit-user'])

const employeeDetails = ref(null);
const handleFetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if(!token){
        alert("Vui lòng đăng nhập lại!");
        router.push('/login');
        return;
    }

    try{
        const response = await axios.get(
            `http://localhost:8080/bej3/users/manage/${props.employeeId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        employeeDetails.value = response.data.result;
    } catch (error) {
        console.error("Lỗi", error);
        alert("Lỗi!");
    }
};
onMounted(async () => {
  await handleFetchUserProfile();
});

const props = defineProps({
    employeeId: {
        type: [String],
        required: true
    }
})
const handleEdit = () => {
  emit('edit-user', employeeDetails.value)
}

</script>

<style scoped>
.add-more {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ccc;
  cursor: pointer;
}
.add-more span {
  font-size: 24px;
  color: #999;
}

.profile-img-detail-group {
  display: flex;
  flex-wrap: wrap;
  gap: 18px; 
}

.profile-img-detail {
  width: calc(50% - 9px); 
}

/*  */
.variant-selector {
  margin-bottom: 10px;
}
.variant-btn {
  margin-right: 5px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  background: #f8f8f8;
  cursor: pointer;
}
.variant-btn.active {
  background: #009981;
  color: white;
  border-color: #009981;
}
</style>