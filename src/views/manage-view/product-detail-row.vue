<!-- components/ProductDetailRow.vue -->
<template>
  <tr v-if="productDetails" class="row-detail row-detail-commodity">
    <td colspan="9" class="cell-detail">
      <div class="product-detail">
        <div class="product-detail-container">
          <div class="product-detail-body">
            <div class="identification-item">
              <h3 class="identification-item-title">{{ productDetails.name }}</h3>
            </div>

            <div class="variant-selector">
              <button
                v-for="(variant, vIndex) in productDetails.variants || []"
                :key="variant.id"
                :class="['variant-btn', { active: vIndex === selectedVariantIndex }]"
                @click="selectVariant(vIndex)"
              >
                {{ variant.color || 'Variant ' + (vIndex + 1) }}
              </button>
            </div>
            <!--  Attribute selector -->
            <div class="attribute-selector" v-if="productDetails.variants?.[selectedVariantIndex]?.attributes?.length">
              <button
                v-for="(attr, aIndex) in productDetails.variants[selectedVariantIndex].attributes"
                :key="aIndex"
                :class="['variant-btn', { active: aIndex === selectedAttributeIndex }]"
                @click="selectAttribute(aIndex)"
              >
                {{ attr.name }}
              </button>
            </div>

            <div class="form-wrapper product-detail-body-container">
              <div class="product-detail-left">
                <!-- <div class="profile-img-detail-large">
                  <div class="wrap-img-detail-large">
                    <img class="preview-img-detail-large" :src="productDetails?.variants?.[selectedVariantIndex]?.detailImages?.[0]" alt="Preview" />
                  </div>
                </div> -->
                <div class="profile-img-detail-group">
                  <div
                    v-for="(img, index) in productDetails?.variants?.[selectedVariantIndex]?.detailImages || []"
                    :key="img"
                    class="profile-img-detail"
                  >
                    <div class="wrap-img-detail">
                      <img :class="'preview-img-detail-' + (index + 1)" :src="img.url" alt="Preview" />
                    </div>
                  </div>
                  <div
                    v-for="n in (11 - productDetails?.variants?.[0]?.detailImages?.length)"
                    :key="'empty-' + n"
                    class="profile-img-detail"
                  >
                    <div class="wrap-img-detail add-more">
                      <span>+</span>
                    </div>
                  </div>
                </div>
                
                
              </div>
              

              <div class="product-detail-right">
                <div class="product-detail-right-content">
                  <div class="product-detail-identification">
                    <div class="identification-group">
                      <div class="identification-item"><span class="identification-item-name">Mã hàng:</span><span class="identification-item-code">{{ productDetails.name }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Nhóm hàng:</span><span class="identification-item-code">{{ productDetails.name }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Loại hàng:</span><span class="identification-item-code">{{ productDetails.name }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Thương hiệu:</span><span class="identification-item-code">{{ productDetails.name }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Giá bán:</span><span class="identification-item-code">{{ productDetails.variants[selectedVariantIndex].attributes[selectedAttributeIndex].originalPrice.toLocaleString('vi-VN') }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Giá vốn:</span><span class="identification-item-code">{{ productDetails.variants[selectedVariantIndex].attributes[selectedAttributeIndex].finalPrice.toLocaleString('vi-VN') }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Giá niêm yết:</span><span class="identification-item-code">{{ productDetails.name }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Vị trí:</span><span class="identification-item-code"></span></div>
                    </div>
                  </div>

                  <div class="product-detail-identification">
                    <div class="identification-group">
                      <div class="identification-item"><span class="identification-item-name">Tồn kho:</span><span class="identification-item-code">{{ productDetails.variants[selectedVariantIndex].attributes[selectedAttributeIndex].stockQuantity }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Đã bán:</span><span class="identification-item-code">{{ productDetails.variants[selectedVariantIndex].attributes[selectedAttributeIndex].soldQuantity }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Ngày nhập hàng</span><span class="identification-item-code">{{ productDetails.createDate }}</span></div>
                      <div class="identification-item"><span class="identification-item-name"></span><span class="identification-item-code">{{ productDetails.createDate }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Giá bán:</span><span class="identification-item-code">{{ productDetails.variants[selectedVariantIndex].attributes[selectedAttributeIndex].originalPrice.toLocaleString('vi-VN') }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Giá vốn:</span><span class="identification-item-code">{{ productDetails.variants[selectedVariantIndex].attributes[selectedAttributeIndex].finalPrice.toLocaleString('vi-VN') }}</span></div>
                      <div class="identification-item"><span class="identification-item-name">Trạng thái:</span><span class="identification-item-code"></span></div>
                    </div>
                  </div>

                  <div class="product-detail-description">
                    <div class="description-group">
                      <div class="description-item"><span class="description-item-name">Mô tả</span><span class="description-item-code">{{ productDetails.name }}</span></div>
                      <div class="description-item"><span class="description-item-name">Ghi chú đặt hàng</span><span class="description-item-code">{{ productDetails.name }}</span></div>
                      <div class="description-item"><span class="description-item-name">Nhà cung cấp</span><span class="description-item-code">{{ productDetails.name }}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="add-edit-product">
              <button class="btn btn-success btn-edit-product" @click="emit('edit-product', productDetails)">Cập nhật</button>
              <button class="btn btn-red btn-lock-product" @click="handleInactiveProduct">Ngừng kinh doanh</button>
              <button class="btn btn-red btn-remove-product" @click="handleDeleteProduct">Xóa</button>
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

import axios from 'axios';
import { ref, watch } from 'vue';

const props = defineProps({
  productId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['edit-product', 'deleted-success']);

// --- details ------------------------------------------------------------------------------------
const selectedVariantIndex = ref(0);
const selectedAttributeIndex = ref(0);

const selectVariant = (vIndex) => {
  selectedVariantIndex.value = vIndex;
  // selectedAttributeIndex.value = 0; // reset attribute khi đổi variant
};

const selectAttribute = (aIndex) => {
  selectedAttributeIndex.value = aIndex;
};

const productDetails = ref(null)
const handleFetchProductDetails = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vui lòng đăng nhập lại!");
    router.push('/login');
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:8080/bej3/manage/product/${props.productId}`,
      // `https://btn-bej3-api.onrender.com/bej3/admin/product/${props.productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    productDetails.value = response.data.result;
  } catch (error) {
    console.error("Lỗi", error);
    alert("Lỗi!");
  }
};
watch(
  () => props.productId,
  (newId) => {
    if (newId) {
      handleFetchProductDetails();
    }
  },
  { immediate: true }
);


// delete------------------------------------------------------------------------------------------
const handleDeleteProduct = async () => {
  if (!confirm(`Bạn có chắc muốn xóa sản phẩm: ${props.productId}?`)) return;

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vui lòng đăng nhập lại!");
    router.push('/login');
    return;
  }

  try {
    await axios.delete(`http://localhost:8080/bej3/manage/product/delete/${props.productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    alert("Xóa thành công!");
    emit('deleted-success');  // báo cha load lại danh sách
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    alert("Xóa thất bại!");
  }
};

//inactinve --------------------------------------------------------------------------------------------
// const handleInactiveProduct = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     alert("Vui lòng đăng nhập lại!");
//     router.push('/login');
//     return;
//   }

//   try {
//     await axios.put(`http://localhost:8080/bej3/admin/product/inactive/${props.product.id}`, null, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     alert("Cập nhật thành công!");
//     emit('deleted-success');  // báo cha load lại danh sách
//   } catch (error) {
//     console.error("Lỗi khi xóa:", error);
//     alert("Xóa thất bại!");
//   }
// };

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