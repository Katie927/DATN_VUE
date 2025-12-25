<template>
  <section class="kv-navbar kv-navbar-main">
    <div class="kv-container kv-navbar-container">
      <ul class="kv-navbar-items">
        <li v-for="item in navbarItems" :key="item.id" class="kv-navbar-item" @click="go(item.link)">
            <i :class="`kv-navbar-item-icon ${item.icon}`"></i>
            <p class="kv-navbar-item-content">{{ item.label }}</p>
          <ul v-if="item.dropdown" class="kv-dropdown-list scope">
            <li v-for="(dropdownItem, index) in item.dropdown" :key="index" class="scope">
              <a :href="dropdownItem.link" class="kv-dropdown-link">
                <i :class="`fa-fw ${dropdownItem.icon} icon-item`"></i>
                <span class="binding">{{ dropdownItem.label }}</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>

import '@/assets/styles/admin-css/kv-style.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';

import { ref } from 'vue';

const navbarItems = ref([
  { id: 1, icon: 'fas fa-eye', label: 'Tổng quan', link: '/admin/statistics' },
  {
    id: 2, icon: 'fas fa-cube', label: 'Hàng hóa', dropdown: [
      { label: 'Danh mục', icon: 'fas fa-table-list', link: '/admin/product/list' },
      // { label: 'Thiết lập giá', icon: 'fas fa-tags', link: 'price_book.html' },
      // { label: 'Kiểm kho', icon: 'fas fa-clipboard-check', link: 'stock_takes.html' }
    ]
  },
  {
    id: 3, icon: 'fas fa-exchange', label: 'Giao dịch', dropdown: [
      { label: 'Đơn hàng', icon: 'fas fa-inbox', link: '/admin/product/order' },
      // { label: 'Hóa đơn', icon: 'fas fa-file-invoice-dollar', link: '' },
      // { label: 'Vận đơn', icon: 'fas fa-file-edit', link: '' },
      // { label: 'Trả hàng', icon: 'fas fa-reply-all', link: '' },
      // { label: 'Nhập hàng', icon: 'fas fa-cart-flatbed', link: '' },//
      // { label: 'Xuất hủy', icon: 'fas fa-hand-holding-dollar', link: '' }
    ]
  },
  {
    id: 4, icon: 'fas fa-user-group', label: 'Người dùng', dropdown: [
      { label: 'Nhân viên', icon: 'fas fa-user-friends', link: '/admin/employee' },
      { label: 'Khách hàng', icon: 'fas fa-calendar-alt', link: '/admin/customer' },
      // { label: 'Bảng tính lương', icon: 'fas fa-coins', link: '' },
      // { label: 'Lịch làm việc', icon: 'fas fa-sack-dollar', link: '' },
      // { label: 'Thiết lập chung', icon: 'fas fa-cog', link: '' }
    ]
  },
  //  {
  //    id: 5, icon: 'fas fa-user-tie', label: 'Đối tác', dropdown: [
  //      { label: 'Khách hàng', icon: 'fas fa-user-alt', link: '' },
  //      { label: 'Đối tác giao hàng', icon: 'fas fa-people-carry-box', link: '' }
  //    ]
  //  },
  // {
  //   id: 6, icon: 'fas fa-chart-simple', label: 'Báo cáo', dropdown: [
  //     { label: 'Cuối ngày', icon: 'fas fa-chart-pie', link: '' },
  //     { label: 'Bán hàng', icon: 'fas fa-paste', link: '' },
  //     { label: 'Đặt hàng', icon: 'fas fa-inbox', link: '' },
  //     { label: 'Hàng hóa', icon: 'fas fa-cube', link: '' },
  //     { label: 'Khách hàng', icon: 'fas fa-user-alt', link: '' },
  //     { label: 'Nhà cung cấp', icon: 'fas fa-users-line', link: '' },
  //     { label: 'Nhân viên', icon: 'fas fa-id-badge', link: '' },
  //     { label: 'Kênh bán hàng', icon: 'fab fa-slideshare', link: '' },
  //     { label: 'Tài chính', icon: 'fas fa-chart-line', link: '' }
  //   ]
  // },
  { id: 7, icon: 'fas fa-basket-shopping', label: 'Bán hàng', link: '/' }
]);

import { useRouter } from 'vue-router'

const router = useRouter()

const go = (link) => {
  if (link) router.push(link)
}

</script>




<style scoped>

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: Arial, Helvetica, sans-serif;
}

.mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

ul {
  list-style: none;
}

.active{
  color: #010101;
  border-bottom: 2px solid #00b63e; /* Loại bỏ border-bottom cho thẻ được chọn */
}

.remove-active{
  color: #666;
  border-bottom: 2px solid transparent;
}

.invalid, .exists {
  font-size: 14px;
  min-width: 250px;
  outline: none;
  border: none;
  border-bottom: 1px solid #ddd;
}

.invalid:focus{
  color: red;
  border-bottom: 2px solid #00b63e;
}

.invalid-barcode{
  color: red;
}

.info-barcode{
  color: #00b63e;
}

.exists:focus{
  color: red;
  border-bottom: 2px solid #00b63e;
}

.rotate {
  transform: rotate(180deg);
  transition: transform 0.3s ease; /* Thêm transition cho hiệu ứng mượt mà */
}

.fa-close{
  border-radius: 4px;
  cursor: pointer;
  color: #15171a !important;
}

.fa-close:hover{
  background-color: #f2f2f2;
}

.kv-container {
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: auto;
  margin-right: auto;
}

table {
  width: 100%;
  margin: 0;
  max-width: none;
  border-collapse: separate;
  border-spacing: 0;
  empty-cells: show;
  border-width: 0;
  outline: 0;
}

th,
td {
  padding: 10px;
  text-align: left;
}

td {
  border-top: 1px solid #ddd;
}

th {
  background-color: #e6f1fe;
}

tr:nth-child(even) {
  background-color: #f7f8f9;
}

tr:hover {
  background-color: #e6f1fe;
}

/* tr:last-child:hover {
  padding-bottom: 100px;
} */

img {
  vertical-align: middle;
}

a {
  color: #15171a;
  text-decoration: none;
}

.btn{
    display: inline-block;
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 4px;
}

.btn-primary{
  background-color: #0070f4;
  box-shadow: 1px 1px 2px rgba(0, 112, 244, .8);
  color: #fff;
  border-radius: 4px;
  border: none;
}

.btn-primary:focus, .btn-primary:hover{
  background-color: #005886;
  box-shadow: 1px 1px 2px rgba(0, 88, 134, .8);
  outline: none;
  cursor: pointer;
}

.btn-success{
    background-color: #00b63e;
  box-shadow: 1px 1px 2px rgba(0, 182, 62, .8);
  color: #fff;
  border-radius: 4px;
  border: none;
}

.btn-success:focus, .btn-success:hover{
  background-color: #419543;
  box-shadow: 1px 1px 2px rgba(65, 149, 67, .8);
  outline: none;
  cursor: pointer;
}

.btn-default{
  background-color: #677484;
  box-shadow: 1px 1px 2px rgba(103, 116, 132,.8);
  color: #fff;
  border-radius: 4px;
  border: none;
}

.btn-default:hover{
  background-color: #787b7d;
  box-shadow: 1px 1px 2px rgba(120, 123, 125,.8);
  outline: none;
  cursor: pointer;
}

.btn-red{
  background-color: #ed232f;
  box-shadow: 1px 1px 2px rgba(237, 35, 47, .8);
  color: #fff;
  border-radius: 4px;
  border: none;
}

.btn-red:hover{
  background-color: #be1c26;
  box-shadow: 1px 1px 2px rgba(190, 28, 38, .8);
  outline: none;
  cursor: pointer;
}

.btn-more{
  background-color: #fff;
  box-shadow: 1px 1px 2px rgba(255, 255, 255, .8);
  color: #010101;
  border-radius: 4px;
  border: 1px solid #e1e3e6;
}

.btn-more:hover{
  background-color: #e1e3e6;
  box-shadow: 1px 1px 2px rgba(225, 227, 230, .8);
  outline: none;
  cursor: pointer;
}

.btn-white{
    background-color: #fff;
    box-shadow: 1px 1px 2px rgba(255, 255, 255, .8);
    color: #15171a;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.btn-white:hover{
  background-color: #e1e3e6;
  box-shadow: 1px 1px 2px rgba(225, 227, 230, .8);
  outline: none;
  cursor: pointer;
}

.form-group{
  flex: 1 1 50%;
  padding-left: 10px;
  padding-right: 25px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.form-group input:focus{
  outline: none;
  border-bottom: 2px solid #00b63e;
}

.form-wrap{
  position: relative;
}

.form-list{
  position: absolute;
  top: 27px;
  left: 0;
  background-color: #f2f2f2;
  border-radius: 4px;
}

.form-list li{
  min-width: 250px;
  padding: 0 12px;
  line-height: 36px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between; 
}

.form-list li:hover{
  background-color: #e6f1fe;
  cursor: pointer;
}

.form-list{
    font-size: 13px;
    display: none;
  }
  
.item-name{
    flex-grow: 1;
  }

  .kv-navbar-main ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
  }
</style>