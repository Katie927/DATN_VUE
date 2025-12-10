<template>
<section class="add-employee" id="addEmployee">
    <div class="mask mask-1"></div>

    <div id="containerAddEmployee">
      <!-- add employee header -->
      <div class="add-employee-head header">
        <div class="add-employee-head-title header-title">
          <span class="add-employee-title-heading span-heading">Thêm mới nhân viên</span>
          <i class="add-employee-icon fas fa-solid fa-close" id="closeAddEmployee" @click="closeForm"></i>
        </div>
      </div>

      <!-- add employee container -->
      <div class="add-employee-container">
        <div class="active-info-setting">
            <a href="#"  :class="{ active: isEInfoForm }"  @click.prevent="isEInfoForm = true">
                Thông tin
            </a>
            <a href="#"  :class="{ active: !isEInfoForm }"  @click.prevent="isEInfoForm = false">
                Thiết lập lương
            </a>
        </div>

        <!-- form content -->
        <div class="tab-content" v-if="isEInfoForm">

          <div class="form-wrapper">
            <!-- left content -->
            <div class="profile-img">
              <div class="wrap-img">
                <img id="previewImg" src="" alt="Preview Image" style="display: none" />
                <i id="wrapImgIcon" class="fas fa-solid fa-camera"></i>
              </div>

              <div class="dropzone">
                <div class="upload-button">
                  <label for="employeeImg" class="custom-upload-btn">Chọn ảnh</label>
                  <input type="file" id="employeeImg" accept="image/*" onchange="previewImage(event)"/>

                  <div class="upload-status-total">
                    <em>drop files here to upload*</em>
                    <strong class="upload-status"></strong>
                    <span id="imagePath" class="file-name"></span><strong>100%</strong>
                  </div>
                  <!-- uploadImage function() -->
                </div>
              </div>
            </div>

            <!-- right content -->
            <div class="information">
              <div class="detail-information">
                <!-- Initialization information -->
                <div class="information-group">
                  <div class="information-title">
                    <span class="info-heading info-heading-add-employee">Thông tin khởi tạo</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Mã nhân viên</label>
                    <div class="form-wrap">
                      <input id="employeeCode" class="form-control" type="text" placeholder="Mã nhân viên tự động"
                            v-model="form.id" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Tên nhân viên</label>
                    <div class="form-wrap">
                      <input id="employeeName" class="form-control" type="text" 
                          v-model="form.fullName"/>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Số điện thoại</label>
                    <div class="form-wrap">
                      <input id="phoneNumber" class="form-control" type="tel" placeholder="0123-456-789"
                        pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required maxlength="10"
                        v-model="form.phoneNumber"/>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Chức vụ</label>
                    <div class="form-wrap">
                      <div class="select-salary-branch">
                        <input id="salaryBranch" class="form-control" role="listbox" v-model="form.roles">
                        <i id="salaryBranchSortDownIcon" class="salary-branch-icon fas fa-solid fa-sort-down"></i>
                      </div>
                      <div id="branchListId" class="form-list branch-list-items">
                        <ul id="branchItemsId" class="form-items">
                          <!-- <div class="select-salary-branch-search">
                            <input class="form-control" id="searchSalaryBranch">
                            <i id="searchSalaryBranchIcon" class="fas fa-solid fa-search"></i>
                          </div> -->
                            <!-- 
                          <li class="form-item">
                            <span class="item-name branch-name"></span>Chi nhánh trung tâm
                            <i class="fas fa-solid fa-check"></i>
                          </li> -->

                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Chi nhánh làm việc</label>
                    <div class="form-wrap">
                      <input id="workingBranch" class="form-control" value="Chi nhánh trung tâm" />
                      <div id="locationListId" class="form-list location-list-items">
                        <!-- <ul class="form-items">
                          <li class="form-item">
                            <span class="item-name location-name">Chi nhánh trung tâm</span>
                            <i class="fas fa-solid fa-check"></i>
                          </li>

                          <li class="form-item">
                            <span class="item-name location-name">Địa điểm kinh doanh</span>
                            <i class="fas fa-solid fa-check"></i>
                          </li>
                        </ul> -->
                      </div>

                    </div>
                  </div>

                </div>

                <!-- button add more information -->
                <!-- <button class="btn btn-form" id="toggleButton">
                  <span>Thêm thông tin</span>
                  <i class="btn-form-icon fas fa-solid fa-angle-down"></i>
                </button> -->

                <div class="hide-show-information" id="hideShowInformation">

                  <!-- Personal information -->
                  <div class="information-group">
                    <div class="information-title">
                      <span class="info-heading info-heading-add-employee">Thông tin cá nhân</span>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Số CMND/CCCD</label>
                      <div class="form-wrap">
                        <input id="idCard" class="form-control" type="number" placeholder="012345678901"
                          maxlength="12" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Ngày sinh</label>
                      <div class="form-wrap">
                        <input id="dateOfBirth" class="form-control" type="date" 
                                v-model="form.dob"/>
                      </div>
                    </div>

                    <!-- <div class="form-group">
                      <label for="employeeGender" class="form-label">Giới tính</label>
                      <input id="employeeGender" type="text">
                      <div class="form-wrap" id="formWrapGender">
                        <input type="radio" id="employeeMale" name="gender" class="" value="Nam" />
                        <label for="employeeMale">Nam</label>
                        <input type="radio" id="employeeFemale" name="gender" class="" value="Nữ" />
                        <label for="employeeFemale">Nữ</label>
                      </div>
                    </div> -->
                  </div>
                  <!-- Contact info -->
                  <div class="information-group">
                    <div class="information-title">
                      <span class="info-heading info-heading-add-employee">Thông tin liên hệ</span>
                    </div>


                    <div class="form-group">
                      <label class="form-label">Địa chỉ</label>
                      <div class="form-wrap">
                        <input id="employeeAddress" class="form-control" type="text" v-model="form.address"/>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Khu vực</label>
                      <div class="form-wrap">
                        <input id="employeeArea" class="form-control" type="text" placeholder="Chọn Tỉnh/TP - Quận/Huyện" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Email</label>
                      <div class="form-wrap">
                        <input id="employeeEmail" class="form-control" type="email" v-model="form.email" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Phường xã</label>
                      <div class="form-wrap">
                        <input id="communeWard" class="form-control" type="text" placeholder="Chọn Phường/Xã" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Facebook</label>
                      <div class="form-wrap">
                        <input id="employeeFacebook" class="form-control" type="text" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- add employee bottom -->
          <div class="add-employee-bottom">
            <button id="btnSaveApplicationEmployee" class="btn btn-success btn-success-bottom" @click="handleUpdateUserProfile">
              <i class="btn-success-icon fas fa-solid fa-floppy-disk"></i>
              <span>Lưu</span>
            </button>
            <button class="btn btn-default btn-default-bottom" id="cancelAddEmployee">
              <i class="btn-success-icon fas fa-solid fa-ban"></i>
              <span>Bỏ qua</span>
            </button>
            
          </div>
        </div>
  


        <!-- set salary -->
        <div class="set-salary" v-else>

          <!-- set salary container -->
          <div class="set-salary-container">
            <div class="pay-rate">
              <div class="pay-rate-group">

                <!-- pay rate header -->
                <div class="pay-rate-group-head header">
                  <div class="pay-rate-group-head-title header-title">
                    <i class="pay-rate-group-icon fas fa-solid fa-money-check-dollar"></i>
                    <span class="span-heading">Nhân viên</span>
                  </div>

                  <!-- pay content -->
                  <div class="pay-content">
                    <div class="pay-content-select">
                      <div class="pay-rate-select-content">
                        <label class="form-label" for="salaryType">Loại lương</label>
                        <div class="form-label-icon">
                          <select class="salary-type form-select" name="salary-type" id="salaryType"
                            aria-placeholder="---Chọn loại lương---">
                            <option value="salaryDefault">---Chọn loại lương---</option>
                            <option value="workShift">Theo ca làm việc</option>
                            <option value="workingHour">Theo giờ làm việc</option>
                            <option value="workingDay">Theo ngày công chuẩn</option>
                            <option value="fixedSalary">Cố định</option>
                          </select>
                          <i class="salary-type-icon  fa fa-solid fa-circle-info"></i>
                        </div>
                      </div>

                      <div class="pay-rate-select-content">
                        <label class="form-label" for="salaryRate">Mức lương</label>
                        <div class="form-label-icon">
                          <input class="salary-rate form-input" name="salary-rate" id="salaryRate">
                          </input>
                          <span class="form-span salary-rate-span">/kỳ lương</span>
                          <button class="btn-toggle btn-toggle-salary" id="btnToggleSetSalary">
                            <i class="salary-rate-icon fa fa-solid fa-ellipsis-v"></i>
                          </button>
                          
                        </div>
                      </div>
                    </div>
                    <!-- table set salary-->
                    <div class="table-set-salary-application table-application-container">
                      <table class="employee-table-list table-salary">
                        <thead class="table-header-salary">
                          <tr class="table-row-header-salary">
                            <th class="table-title-salary"></th>
                            <th class="weekdays"><span>Ngày thường</span></th>
                            <th class="saturday"><span>Thứ 7</span></th>
                            <th class="sunday"><span>Chủ nhật</span></th>
                            <th class="day-off"><span>Ngày nghỉ</span></th>
                            <th class="holidays"><span>Ngày lễ tết</span></th>
                          </tr>
                        </thead>
                        <tbody class="table-body">
                          <tr class="table-row-data-salary">
                            <td class="table-title-salary"><span>Hệ số lương trên giờ</span></td>
                            <td class="weekdays">
                              <div class="row-data-salary">
                                <input id="priceWeekDays" type="number" placeholder="150" class="hide-spinner">
                                <!-- price toggle -->
                                <label for="priceWeekDays" class="price-toggle">
                                  <div class="btn-price-toggle">
                                    <button class="btn btn-VND btn-default">
                                      <span>VND</span>
                                    </button>
                                    <button class="btn btn-percent btn-success">
                                      <span>%</span>
                                    </button>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td class="saturday">
                              <div class="row-data-salary">
                                <input id="saturday" type="number" placeholder="200" class="hide-spinner">
                                <!-- price toggle -->
                                <label for="priceSaturday" class="price-toggle">
                                  <div class="btn-price-toggle">
                                    <button class="btn btn-VND btn-default">
                                      <span>VND</span>
                                    </button>
                                    <button class="btn btn-percent btn-success">
                                      <span>%</span>
                                    </button>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td class="sunday">
                              <div class="row-data-salary">
                                <input id="priceSunday" type="number" placeholder="200" class="hide-spinner">
                                <!-- price toggle -->
                                <label for="priceSunday" class="price-toggle">
                                  <div class="btn-price-toggle">
                                    <button class="btn btn-VND btn-default">
                                      <span>VND</span>
                                    </button>
                                    <button class="btn btn-percent btn-success">
                                      <span>%</span>
                                    </button>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td class="day-off">
                              <div class="row-data-salary">
                                <input id="priceDayOff" type="number" placeholder="200" class="hide-spinner">
                                <!-- price toggle -->
                                <label for="priceDayOff" class="price-toggle">
                                  <div class="btn-price-toggle">
                                    <button class="btn btn-VND btn-default">
                                      <span>VND</span>
                                    </button>
                                    <button class="btn btn-percent btn-success">
                                      <span>%</span>
                                    </button>
                                  </div>
                                </label>
                              </div>
                            </td>
                            <td class="holidays">
                              <div class="row-data-salary">
                                <input id="priceHolidays" type="number" placeholder="300" class="hide-spinner">
                                <!-- price toggle -->
                                <label for="priceHolidays" class="price-toggle">
                                  <div class="btn-price-toggle">
                                    <button class="btn btn-VND btn-default">
                                      <span>VND</span>
                                    </button>
                                    <button class="btn btn-percent btn-success">
                                      <span>%</span>
                                    </button>
                                  </div>
                                </label>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- pay rate standard -->
                <div class="pay-rate-standard">
                  <div class="pay-set-salary-rate-standard">
                    <label for="btnToggleSetRate" class="toggle-standard">Lương làm thêm giờ</label>
                    <button class="btn-toggle btn-toggle-standard" id="btnToggleSetRate">
                      <i class="btn-toggle-icon fas fa-solid fa-circle"></i>
                    </button>
                    
                  </div>

                  <!-- table overtime salary-->
                  <div class="table-salary-application table-application-container">
                    <table class="employee-table-list table-salary">
                      <thead class="table-header-salary">
                        <tr class="table-row-header-salary">
                          <th class="table-title-salary"></th>
                          <th class="weekdays"><span>Ngày thường</span></th>
                          <th class="saturday"><span>Thứ 7</span></th>
                          <th class="sunday"><span>Chủ nhật</span></th>
                          <th class="day-off"><span>Ngày nghỉ</span></th>
                          <th class="holidays"><span>Ngày lễ tết</span></th>
                        </tr>
                      </thead>
                      <tbody class="table-body">
                        <tr class="table-row-data-salary">
                          <td class="table-title-salary"><span>Hệ số lương trên giờ</span></td>
                          <td class="weekdays">
                            <div class="row-data-salary">
                              <input id="priceWeekDays" type="number" placeholder="150" class="hide-spinner">
                              <!-- price toggle -->
                              <label for="priceWeekDays" class="price-toggle">
                                <div class="btn-price-toggle">
                                  <button class="btn btn-VND btn-default">
                                    <span>VND</span>
                                  </button>
                                  <button class="btn btn-percent btn-success">
                                    <span>%</span>
                                  </button>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td class="saturday">
                            <div class="row-data-salary">
                              <input id="saturday" type="number" placeholder="200" class="hide-spinner">
                              <!-- price toggle -->
                              <label for="priceSaturday" class="price-toggle">
                                <div class="btn-price-toggle">
                                  <button class="btn btn-VND btn-default">
                                    <span>VND</span>
                                  </button>
                                  <button class="btn btn-percent btn-success">
                                    <span>%</span>
                                  </button>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td class="sunday">
                            <div class="row-data-salary">
                              <input id="priceSunday" type="number" placeholder="200" class="hide-spinner">
                              <!-- price toggle -->
                              <label for="priceSunday" class="price-toggle">
                                <div class="btn-price-toggle">
                                  <button class="btn btn-VND btn-default">
                                    <span>VND</span>
                                  </button>
                                  <button class="btn btn-percent btn-success">
                                    <span>%</span>
                                  </button>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td class="day-off">
                            <div class="row-data-salary">
                              <input id="priceDayOff" type="number" placeholder="200" class="hide-spinner">
                              <!-- price toggle -->
                              <label for="priceDayOff" class="price-toggle">
                                <div class="btn-price-toggle">
                                  <button class="btn btn-VND btn-default">
                                    <span>VND</span>
                                  </button>
                                  <button class="btn btn-percent btn-success">
                                    <span>%</span>
                                  </button>
                                </div>
                              </label>
                            </div>
                          </td>
                          <td class="holidays">
                            <div class="row-data-salary">
                              <input id="priceHolidays" type="number" placeholder="300" class="hide-spinner">
                              <!-- price toggle -->
                              <label for="priceHolidays" class="price-toggle">
                                <div class="btn-price-toggle">
                                  <button class="btn btn-VND btn-default">
                                    <span>VND</span>
                                  </button>
                                  <button class="btn btn-percent btn-success">
                                    <span>%</span>
                                  </button>
                                </div>
                              </label>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- pay update -->
              <div class="pay-rate-update">
                <button id="btnCreatTemplate" class="btn btn-success">
                  <i class="btn-success-icon fas fa-solid fa-plus"></i>
                  <span>Tạo mới mẫu lương</span>
                </button>
                


                <span class="otherSpan">Hoặc</span>

                <div class="pay-rate-form">
                  <label class="form-label" for="rateType"></label>
                  <div class="form-label-select">
                    <select class="form-rate-type form-select" name="rate-type" id="rateType"
                      aria-placeholder="Chọn mẫu lương hiện có">
                      <option value="payDefault">Chọn mẫu lương hiện có</option>
                      <option value="rateDefault">Nhân viên chính thức</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <!-- add employee bottom -->
            <div class="add-employee-bottom">
              <button id="btnSaveSetSalary" class="btn btn-success btn-success-bottom">
                <i class="btn-success-icon fas fa-solid fa-floppy-disk"></i>
                <span>Lưu</span>
              </button>

              <button class="btn btn-default btn-default-bottom" id="cancelSetSalary">
                <i class="btn-success-icon fas fa-solid fa-ban"></i>
                <span>Bỏ qua</span>
              </button>

            </div>
          </div>

        </div>
        <!-- add new application -->
        
      </div>
    </div>
  </section>

</template>

<script setup>
import '@/assets/styles/admin-css/kv-employee.css'; 
import '@/assets/styles/admin-css/kv-style.css';
import axios from 'axios';

import { reactive, ref, watch } from "vue";

const isEInfoForm = ref(true);
const emit = defineEmits(['updated-success', 'close']);

const form = reactive({
  id: '',
  fullName: '',
  address: '',
  dob: '',
  email: '',
  phoneNumber: '',
  roles: [],
})

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
});

watch(
  () => props.user,
  (newVal) => {
    console.log('User received:', newVal);

    if (newVal && Object.keys(newVal).length > 0) {
      // === TRƯỜNG HỢP EDIT ===
      form.id = newVal.id ?? '';
      form.fullName = newVal.fullName ?? '';
      form.address = newVal.address ?? '';
      form.dob = newVal.dob ?? '';
      form.email = newVal.email ?? '';
      form.phoneNumber = newVal.phoneNumber ?? '';
      form.roles = (newVal.roles || []).map(role => role.name);
    } else {
      // === TRƯỜNG HỢP ADD MỚI ===
      resetForm();
    }
  },
  { immediate: true }
);
function resetForm() {
  form.id = '';
  form.fullName = '';
  form.address = '';
  form.dob = '';
  form.email = '';
  form.phoneNumber = '';
  form.roles = [];
}

// ---------update -------------------------------------------------
const handleUpdateUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");

  if (!form.id) {
    alert("Không tìm thấy ID người dùng!");
    return;
  }

  try {
    await axios.put(
      `http://localhost:8080/bej3/manage/users/update/${form.id}`,
      form, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Cập nhật thông tin thành công!");
    emit("adupdated-success"); 
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error.message);
    if (error.response) {
      console.error("Chi tiết:", error.response.data);
      if ([401, 403].includes(error.response.status)) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
    alert("Cập nhật thông tin thất bại!");
  }
};
// ---------update -------------------------------------------------


// hàm đóng form
function closeForm() {
  resetForm();        // xoá toàn bộ dữ liệu trong form
  emit('close');      // báo cho cha biết để ẩn form
}


// roles 
// const roles = ref([]);
// const fetchRoles = async () => {
//   const token = localStorage.getItem("token");
//   const res = await axios.get("http://localhost:8080/bej3/manage/roles", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   categories.value = res.data.result;
// };
// onMounted(async () => {
//   await fetchCategories();
// });
</script>



<style scoped>

.form-group{
    flex:  0;
}

.active-info-setting a {
  color: #333;
  text-decoration: none;
  padding: 8px 12px;
}

.active-info-setting a.active {
  color: #010101;
  border-bottom: 2px solid #00b63e;
}

</style>