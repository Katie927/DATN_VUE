<template>
<section class="add-product" id="addProduct" style="display: block;">
    <div class="mask mask-1"></div>
      <div id="containerAddProduct">
        <!-- add product header -->
        <div class="add-product-head header">
          <div class="add-product-head-title header-title">
            <span id="titleAddProduct" class="add-product-title-heading span-heading">Thêm hàng hóa</span>
            <i class="add-product-icon fas fa-solid fa-close" aria-hidden="true" 
                  @click="$emit('close')"></i>
          </div>
          
        </div>
        <!-- add product container -->
        <div class="add-product-container">

          <!-- form content -->
          <div class="tab-content tab-content-form-product" style="display: block;">
            <div class="form-wrapper">

              <!-- left content -->
              <div class="info-form-image-add-product left-content-info-product">
                <!-- variant selector -->
                <div class="variant-selector">
                  <button :class="['variant-btn', { active: vIndex === selectedVariantIndex }]"
                    v-for="(variant, vIndex) in form.variants || []" :key="variant.id"
                    @click="selectVariant(vIndex)"
                  >
                      {{ variant.color || 'Variant ' + (vIndex + 1) }}
                  </button>
                </div>
                <!-- Initialization information -->
                <div class="information-group information-group-form-product">
                  <!-- Mã hàng -->
                  <div class="form-group form-group-product">
                    <label class="form-label">
                      Mã hàng
                      <i class="parameter-type-icon fas fa-solid fa-circle-info" title="Mã hàng là thông tin duy nhất" aria-hidden="true"></i>
                      <span class="sr-only">Mã hàng là thông tin duy nhất</span>
                    </label>
                    <div class="form-wrap form-wrap-product">
                      <input class="form-control form-control-form-group-product" type="text"
                        placeholder="Mã hàng tự động" readonly="true" v-model="form.id"
                      />
                    </div>
                  </div>

                  <!-- Mã vạch -->
                  <!-- Tên hàng -->
                  <div class="form-group form-group-product">
                    <label class="form-label">
                      Tên hàng
                    </label>
                    <div class="form-wrap form-wrap-product">
                      <input class="form-control form-control-form-group-product" type="text"
                        required v-model="form.name"
                      />
                    </div>
                  </div>

                  <!-- Nhóm hàng -->
                  <div class="form-group form-group-product">
                    <label class="form-label">Loại hàng</label>
                    <div class="form-wrap form-wrap-product">
                      <select 
                        class="form-control form-control-form-group-product"
                        v-model="form.category.id"
                      >
                        <option disabled value="">---Lựa chọn---</option>
                        <option v-for="c in categories" :key="c.id" :value="c.id">
                          {{ c.name }}
                        </option>
                      </select>

                      <div class="group-icon-add-new">
                        <i class="show-hide-icon fas fa-solid fa-sort-down" aria-hidden="true"></i>
                        <a href="#" 
                          class="add-product-group-icon btn-icon add-group-product fas fa-solid fa-plus"
                          title="Thêm nhóm hàng mới"
                          aria-hidden="true"
                          @click.prevent="addGroup"></a>
                        <span class="sr-only">Thêm nhóm hàng mới</span>
                      </div>
                    </div>
                  </div>

                  <!-- Thương hiệu -->
                  <div class="form-group form-group-product">
                    <label class="form-label">
                      Thương hiệu
                    </label>
                    <div class="form-wrap form-wrap-product">
                      <input id="productTrademark"  class="form-control form-control-form-group-product"
                        type="text"   placeholder="---Chọn thương hiệu---"
                        v-model="form.name"
                      />
                      <div class="group-icon-add-new">
                        <i class="show-hide-icon fas fa-solid fa-sort-down" id="hideAddProductTrademarkForm" aria-hidden="true"></i>
                        <a href="#" class="add-trademark-icon btn-icon add-group-product fas fa-solid fa-plus"
                          title="Thêm thương hiệu mới"  id="addProductTrademarkForm"
                          aria-hidden="true"
                          @click.prevent="addBrand"></a>
                        <span class="sr-only">Thêm thương hiệu mới</span>
                      </div>
                    </div>
                  </div>

                  <!-- Vị trí -->
                  <div class="form-group form-group-product">
                    <label class="form-label">
                      Vị trí
                      <i class="parameter-type-icon fas fa-solid fa-circle-info" title="Sử dụng để ghi lại vị trí cửa hàng còn bán" aria-hidden="true"></i>
                    </label>
                    <div class="form-wrap form-wrap-product">
                      <input id="productLocation"   class="form-control form-control-form-group-product"
                        type="text"   v-model="form.location"
                      />
                      <div class="group-icon-add-new">
                        <i class="show-hide-icon fas fa-solid fa-pen" id="hideAddAccountFormproduct" aria-hidden="true"></i>
                        <a href="#" class="add-account-icon btn-icon add-group-product fas fa-solid fa-plus"
                          title="Thêm vị trí mới"  id="addNewAccountFormAddProduct" aria-hidden="true"  
                          @click.prevent="addLocation"></a>
                        <span class="sr-only">Thêm vị trí mới</span>
                      </div>
                    </div>
                  </div>
                </div>

                  <div class="form-image-product" style="margin-right: 34px; margin-top: 39px;">
                    <div class="form-image-group">
                      <div>
                        <div class="wrap-img wrap-img-form-product">
                          <label for="mainProductImg" class="custom-upload-btn">
                              <img  id="mainPreviewImg"   :src="form.imagePreview || ''" alt="Preview Image" />
                          </label>
                        </div>
                        <div class="dropzone">
                          <div class="upload-button" id="mainUploadBtn" data-preview-id="mainPreviewImg">
                              <input type="file" id="mainProductImg" accept="image/*"
                                @change="e => handleMainImageChange(e)"
                              />
                          </div>
                        </div>
                      </div>

                      <div class="form-image-product" style="margin-left: 7px; width: 170px;"
                          v-for="(img, index) in form.introImagesPreview" :key="index">
                        <div class="wrap-img wrap-img-form-product" style="margin-left: 7px; width: 170px;">
                          <label class="custom-upload-btn" style="margin-left: 7px; width: 170px;">
                            <img v-if="img && img.url" :src="img.url" alt="Preview Image"
                                style="width:100%; height:100%; object-fit:cover;" />
                            <span v-else>Chưa có ảnh</span>
                            <input type="file" accept="image/*" style="display:none;"
                                  @change="e => replaceIntroImage(e, index)" />
                          </label>
                          <button type="button" @click="removeIntroImage(index)">X</button>
                        </div>
                      </div>
                      <div style="display: block; height:31px; width:31px; padding:9px;">
                        <label class="custom-upload-btn" style="display:block; height:31px; width:31px; padding:9px;">
                          <span>+</span>
                          <input type="file" accept="image/*" style="display:none;" @change="addIntroImage" />
                        </label>
                      </div>
                    </div>
                  </div>
        <!-- Variant Images -->
                <div v-for="(variant, vIndex) in form.variants" :key="variant.id">
                  <div class="form-group form-price-add-product">
                      <label class="form-label"> Màu sắc </label>
                      <div class="form-wrap form-wrap-product">
                        <input type="text"  class="form-control form-control-form-price-add-product"
                          v-model="variant.color"
                        />
                      </div>
                      <div class="variant-selector">
                        <button class="variant-btn" @click="removeVariant(vIndex)">
                            Xóa
                        </button>
                      </div>
                  </div>
                  <div class="form-image-group">
                    <div class="form-image-product" style="margin-left: 7px;"
                      v-for="(img, index) in variant.detailImagesPreview"
                      :key="index"
                    >
                      <div class="wrap-img wrap-img-form-product">
                        <label :for="`productImg-${vIndex}-${index}`" class="custom-upload-btn">
                          <img v-if="img?.url" :src="img.url" alt="Preview Image"/>
                          <span v-else>Chưa có ảnh</span>
                        </label>
                        <input type="file" :id="`productImg-${vIndex}-${index}`"
                          accept="image/*" style="display:none;"
                          @change="e => replaceDetailImage(e, vIndex, index)"
                        />
                      </div>
                      <button type="button" @click="removeDetailImage(vIndex, index)">X</button>
                    </div>

                    <!-- nút thêm ảnh -->
                    <div class="form-image-product add-btn" style="margin-left: 7px;">
                      <label class="custom-upload-btn" style="display: block; height: 31px; width: 31px; padding: 9px;">
                        <span>+</span>
                        <input type="file" accept="image/*" style="display:none;"
                          @change="e => addDetailImage(e, vIndex)"
                        />
                      </label>
                    </div>
                  </div>

                </div>
                <div class="variant-selector">
                  <button type="button" class="variant-btn" @click="addVariant">
                      Thêm
                  </button>
                </div>

                
              </div>

              <!-- right content -->
              <div class="info-form-price-add-product right-content-info-product">
                <div class="variant-selector">
                  <button :class="['variant-btn', { active: aIndex === selectedAttributeIndex }]"
                    v-for="(attr, aIndex) in form.variants[selectedVariantIndex].attributes || []" :key="aIndex" :value="aIndex"
                    @click="selectAttribute(aIndex)"
                  >
                      {{ attr.name || 'Attr ' + (aIndex + 1)}}
                  </button>
                  <!-- Thêm Attribute mới -->
                  <button @click="addAttribute">
                    + 
                  </button>
                </div>

                <div class="information-group information-group-form-product">
                  <!--  -->
                  <div class="form-group form-price-add-product">
                    <label class="form-label">
                      Phiên bản
                    </label>
                    <div class="form-wrap form-wrap-product">
                      <input type="text" class="form-control form-control-form-price-add-product"
                        v-model="form.variants[selectedVariantIndex].attributes[selectedAttributeIndex].name"
                      />
                    </div>
                    <div class="variant-selector">
                        <button class="variant-btn" @click="removeAttribute(aIndex)">
                            Xóa
                        </button>
                    </div>
                  </div>
                  <!--  -->
                  <div class="form-group form-price-add-product">
                    <label class="form-label">
                      Giá vốn
                      <i class="parameter-type-icon fas fa-solid fa-circle-info" aria-hidden="true"
                        title="Giá vốn dùng để tính lợi nhuận cho sản phẩm (sẽ tự động thay đổi khi thay đổi phương pháp tính giá vốn)"
                      ></i>
                    </label>
                    <div class="form-wrap form-wrap-product">
                      <input type="text" class="form-control form-control-form-price-add-product"
                        v-model="form.variants[selectedVariantIndex].attributes[selectedAttributeIndex].originalPrice"
                      />
                    </div>
                  </div>

                  <div class="form-group form-price-add-product">
                    <label class="form-label">
                      Giá niêm yết
                      <i class="parameter-type-icon fas fa-solid fa-circle-info"
                        title="Giá niêm yết hãng đưa ra" aria-hidden="true"
                      ></i>
                      <span class="sr-only">
                        Giá niêm yết hãng đưa ra
                      </span>
                    </label>
                    <div class="form-wrap form-wrap-product">
                      <input type="text" class="form-control form-control-form-price-add-product"
                        v-model="form.variants[selectedVariantIndex].attributes[selectedAttributeIndex].originalPrice"
                      />
                    </div>
                  </div>

                  <div class="form-group form-price-add-product">
                    <label class="form-label">Giá bán</label>
                    <div class="form-wrap form-wrap-product">
                      <input  type="text"  class="form-control form-control-form-price-add-product"
                        v-model="form.variants[selectedVariantIndex].attributes[selectedAttributeIndex].finalPrice"
                      />
                      <i id="tagsIconProduct" class="parameter-type-icon fas fa-solid fa-tags" aria-hidden="true"></i>
                    </div>
                  </div>

                  <div class="form-group form-price-add-product">
                    <label class="form-label">
                      Tồn kho
                      <i class="parameter-type-icon fas fa-solid fa-circle-info"
                        title="Số lượng tồn kho của sản phẩm (sẽ tự động tạo ra phiếu kiểm kho cho sản phẩm)"
                        aria-hidden="true"
                      ></i>
                    </label>
                    <div class="form-wrap form-wrap-product">
                      <input  type="text" class="form-control form-control-form-price-add-product"
                        v-model="form.variants[selectedVariantIndex].attributes[selectedAttributeIndex].stockQuantity"
                      />
                    </div>
                  </div>
                  <div class="form-group form-price-add-product">
                    <label class="form-label">
                      Đã bán
                    </label>
                    <div class="form-wrap form-wrap-product">
                      <input  type="text" class="form-control form-control-form-price-add-product"
                        v-model="form.variants[selectedVariantIndex].attributes[selectedAttributeIndex].soldQuantity"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- product information below-->
          </div>

          <!-- detail product -->
          <div class="detail-product">
            <!-- detail product container -->
            <div class="detail-product-container">
              <div class="detail-group detail-group-form-product">
                <!-- detail inventory levels -->
                <div class="form-group form-detail-inventory-add-product">
                  <h3 class="form-title form-title-inventory">
                    <span class="form-span form-span-inventory">Định mức tồn</span>
                  </h3>
                  <div class="form-wrapper form-wrapper-detail-inventory">
                    <div class="form-wrap form-wrap-product-detail-inventory">
                      <label class="form-label form-label-wrap-detail-inventory">
                        Ít nhất
                      </label>
                      <div class="form-label-icon form-label-icon-inventory">
                        <input type="text"  class="form-control form-control-inventory-levels-detail"   placeholder="0"
                          v-model="form.minInventory"
                        />
                      </div>
                    </div>

                    <div class="form-wrap form-wrap-product-detail-inventory">
                      <label class="form-label form-label-wrap-detail-inventory">
                        Nhiều nhất
                      </label>
                      <div class="form-label-icon form-label-icon-inventory">
                        <input type="text" class="form-control form-control-inventory-levels-detail"
                          placeholder="999,999,999" v-model="form.maxInventory"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- detail description -->
                <div class="form-group form-detail-description-add-product">
                  <h3 class="form-title form-title-description">
                    <span class="form-span form-span-description">Mô tả</span>
                  </h3>
                  <div class="form-wrapper form-wrapper-detail-description">
                    <div class="form-wrap form-wrap-product-detail-description">
                      <div class="form-label-icon form-label-icon-description">
                        <textarea
                          class="product-desc form-input"
                          v-model="form.description"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- detail notes -->
                
              </div>
            </div>
          </div>
        </div>

        <!-- add product bottom -->
        <div class="add-product-bottom">
          <button id="btnSaveApplicationProductMore"  class="btn btn-success btn-success-bottom"
                  @click="form.id ? handleUpdate() : handleAddNew()">
            <i class="btn-success-icon fas" 
              :class="form.id ? 'fa-pen' : 'fa-floppy-disk'" 
              aria-hidden="true"></i>
            <span>{{ form.id ? 'Cập nhật' : 'Thêm mới' }}</span>
          </button>

          <button id="btnSaveApplicationProductCopy" class="btn btn-success btn-success-bottom">
            <i class="btn-success-icon fas fa-solid fa-floppy-disk" aria-hidden="true"></i>
            <span>Lưu &amp; Sao chép</span>
          </button>

          <button id="cancelAddProduct" class="btn btn-default btn-default-bottom">
            <i class="btn-success-icon fas fa-solid fa-ban" aria-hidden="true"></i>
            <span>Bỏ qua</span>
          </button>
        </div>
    </div>
</section>

</template>

<script setup>

import '@/assets/styles/admin-css/kv-product.css'; 
import '@/assets/styles/admin-css/kv-style.css';
import router from '@/router';
import axios from 'axios';

import { reactive, watch, ref, onMounted, toRaw } from 'vue'

const form = reactive({
  id: '',
  name: '',
  image: null,             // file chính
  imagePreview: '',        // preview (bỏ qua khi gửi)
  category: {
    name: '',
  },
  status: 1,
  createDate: '',
  introImages: [           // list ảnh giới thiệu
    {
      id: null,
      file: null           // file upload
    }
  ],
  introImagesPreview: [],  // bỏ qua khi gửi
  variants: [
    {
      id: null,
      color: '',
      detailImages: [      // list ảnh chi tiết
        {
          id: null,
          file: null
        }
      ],
      detailImagesPreview: [], // bỏ qua
      attributes: [
        {
          id: null,
          name: '',
          originalPrice: 0,
          finalPrice: 0,
          discount: 0,
          stockQuantity: 0,
          soldQuantity: 0,
        }
      ]
    }
  ]
});

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
});

watch(
  () => props.product,
  (newVal) => {
    if (newVal && Object.keys(newVal).length) {
      form.id = newVal.id;
      form.name = newVal.name;
      form.status = newVal.status ?? 1;
      form.createDate = newVal.createDate ?? null;
      form.category = newVal.category;
      // ảnh chính
      form.image = newVal.image || null;                     // chỉ set khi user upload ảnh mới
      form.imagePreview = newVal.image || null; // preview ảnh cũ

      // intro images (6 ảnh)
      form.introImages = (newVal.introImages || []).map(img => ({
        id: img.id,
        file: null   // ảnh cũ thì chưa có file mới
      })); // File[]
      form.introImagesPreview = [...(newVal.introImages || [])]; // URL[]

      // variants
      form.variants = (newVal.variants || []).map(v => {
        return {
          id: v.id,
          color: v.color,
          detailImages: (v.detailImages || []).map(img => ({
            id: img.id,
            file: null   // ảnh cũ thì chưa có file mới
          })),
          detailImagesPreview: [...(v.detailImages || [])], // URL[]
          attributes: (v.attributes || []).map(attr => ({
            id: attr.id,
            name: attr.name,
            originalPrice: attr.originalPrice ?? 0,
            finalPrice: attr.finalPrice ?? 0,
            discount: attr.discount ?? 0,
            stockQuantity: attr.stockQuantity ?? 0,
            soldQuantity: attr.soldQuantity ?? 0
          }))
        };
      });
    } else {
      // reset mặc định
      form.image = null;
      form.imagePreview = null;
      form.introImages = [];
      form.introImagesPreview = [];
      form.variants = [
        {
          id: null,
          color: '',
          detailImages: [],
          detailImagesPreview: [],
          attributes: [
            {
              id: null,
              name: '',
              originalPrice: 0,
              finalPrice: 0,
              discount: 0,
              stockQuantity: 0,
              soldQuantity: 0
            }
          ]
        }
      ];
    }
  },
  { immediate: true }
);

// add new -----------------------------------------------------------------------------
function objectToFormData(obj, formData = new FormData(), parentKey = "") {
  if (obj === null || obj === undefined) return formData;

  // Nếu là file
  if (obj instanceof File || obj instanceof Blob) {
    if (parentKey) {
      formData.append(parentKey, obj);
      console.log(`[FormData-Check] ${parentKey} -> File(${obj.name})`);
    }
  }
  // Nếu là array
  else if (Array.isArray(obj)) {
    obj.forEach((value, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : `${index}`;
      objectToFormData(value, formData, key);
    });
  }
  // Nếu là object
  else if (typeof obj === "object" && !(obj instanceof Date)) {
    Object.keys(obj).forEach((key) => {
      if (key.toLowerCase().includes("preview") || key === "createDate") return;

      const value = obj[key];
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      // xử lý riêng cho image chính
      if (key === "image") {
        if (value instanceof File) {
          formData.append(fullKey, value);
          console.log(`[FormData-Check] ${fullKey} -> File(${value.name})`);
        } else {
          // formData.append(fullKey, null);
          // console.log(`[FormData-Check] ${fullKey} -> null`);
        }
      }
      // xử lý riêng cho introImages và detailImages
      else if (parentKey.endsWith("introImages") || parentKey.endsWith("detailImages")) {
        // xử lý riêng cho từng ảnh trong list
        if (key === "file" && value instanceof File) {
          // ảnh mới
          formData.append(fullKey, value);
          console.log(`[FormData-Check] ${fullKey} -> File(${value.name})`);
        } 
        else if (key === "id" && value) {
          // ảnh cũ
          formData.append(fullKey, value);
          console.log(`[FormData-Check] ${fullKey} -> old image id=${value}`);
        } 
        // bỏ qua url (server không cần)
        else if (key === "url") {
          console.log(`[FormData-Check] ${fullKey} -> skipped (url only)`);
        }
      }
      else {
        objectToFormData(value, formData, fullKey);
      }
    });
  }
  // Bỏ qua Date
  else if (obj instanceof Date) {
    return formData;
  }
  // Nếu là primitive
  else {
    if (parentKey && obj !== null) {
      formData.append(parentKey, obj);
      console.log(`[FormData-Check] ${parentKey} -> ${obj}`);
    }
  }

  return formData;
}


// add api ===============================================================
const emit = defineEmits(['added-success', 'close']);
const handleAddNew = async () => {
  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");

  try {
    // convert reactive form -> FormData
    const formData = objectToFormData(toRaw(form)); 

    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`[FormData] ${key} -> File(${value.name})`);
      } else {
        console.log(`[FormData] ${key} -> ${value}`);
      }
    }
 
    await axios.post(
      "http://localhost:8080/bej3/manage/product/add",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data"
        }
      }
    );

    alert("Thêm hàng hóa thành công!");
    emit("added-success, close");
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error.message);
    if (error.response) {
      console.error("Chi tiết:", error.response.data);
      if ([401, 403].includes(error.response.status)) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
    alert("Thêm hàng hóa thất bại!");
  }
};
// update api ===============================================================
const handleUpdate = async () => {
  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");

  if (!form.id) {
    alert("Không tìm thấy ID sản phẩm để cập nhật!");
    return;
  }

  try {
    const formData = objectToFormData(toRaw(form));
    // for (let [k, v] of formData.entries()) {
    //   console.log(k, v);
    // }
    await axios.put(
      `http://localhost:8080/bej3/manage/product/update/${form.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    alert("Cập nhật hàng hóa thành công!");
    emit("added-success");
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.message);
    if (error.response) {
      console.error("Chi tiết:", error.response.data);
      if ([401, 403].includes(error.response.status)) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
    alert("Cập nhật hàng hóa thất bại!");
  }
};
// update api ===============================================================

// preview img -----------------------------------------------------------
const handleMainImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.image = file; // giữ file gốc để gửi
    form.imagePreview = URL.createObjectURL(file); // giữ preview để hiển thị
  } else {
    form.image = null;
    form.imagePreview = '';
  }
};
//
// Thêm ảnh mới
function addImage(list, previewList, file) {
  list.push({ id: null, file });   // wrap object
  previewList.push({
    id: null,
    url: URL.createObjectURL(file)
  });
}

// Thay thế ảnh trong list
function replaceImage(list, previewList, index, file) {
  list[index] = { 
    id: list[index]?.id ?? null, 
    file 
  };
  previewList[index] = {
    id: previewList[index]?.id ?? null,
    url: URL.createObjectURL(file)
  };
}

// Xóa ảnh
function removeImage(list, previewList, index) {
  list.splice(index, 1);
  previewList.splice(index, 1);
}

// Intro images
const addIntroImage = (event) => {
  const file = event.target.files?.[0];
  if (file) addImage(form.introImages, form.introImagesPreview, file);
  event.target.value = "";
};

const replaceIntroImage = (event, index) => {
  const file = event.target.files?.[0];
  if (file) replaceImage(form.introImages, form.introImagesPreview, index, file);
  event.target.value = "";
};

const removeIntroImage = (index) => {
  removeImage(form.introImages, form.introImagesPreview, index);
};

// Detail images
const addDetailImage = (event, vIndex) => {
  const file = event.target.files?.[0];
  if (file) addImage(form.variants[vIndex].detailImages, form.variants[vIndex].detailImagesPreview, file);
  event.target.value = "";
};

const replaceDetailImage = (event, vIndex, index) => {
  const file = event.target.files?.[0];
  if (file) replaceImage(form.variants[vIndex].detailImages, form.variants[vIndex].detailImagesPreview, index, file);
  event.target.value = "";
};

const removeDetailImage = (vIndex, index) => {
  removeImage(form.variants[vIndex].detailImages, form.variants[vIndex].detailImagesPreview, index);
};


// them variant -------------------------------------------------------------------------------
const addVariant = () => {
  form.variants.push({
    id: null,
    color: '',
    detailImages: [], 
    detailImagesPreview: [],
    attributes: [
      {
        name: '',
        originalPrice: 0,
        finalPrice: 0,
        discount: 0,
        stockQuantity: 0,
        soldQuantity: 0
      }
    ]
  });
};
// ---
const removeVariant = (vIndex) => {
  if (confirm("Bạn có chắc muốn xóa variant này không?")) {
    if (form.variants.length > 1) {
      form.variants.splice(vIndex, 1);
    } else {
      // reset lại variant cuối cùng thay vì xóa hết
      form.variants[0] = {
        id: null,
        color: '',
        detailImages: [],
        detailImagesPreview: [],
        attributes: [
          {
            name: '',
            originalPrice: 0,
            finalPrice: 0,
            discount: 0,
            stockQuantity: 0,
            soldQuantity: 0
          }
        ]
      };
    }
  }
};

// attribute -------------------------------------------------------------------------------
const addAttribute = () => {
  const variant = form.variants[selectedVariantIndex.value];
  if (!variant.attributes) variant.attributes = [];

  variant.attributes.push({
    name: '',
    originalPrice: 0,
    finalPrice: 0,
    discount: 0,
    stockQuantity: 0,
    soldQuantity: 0
  });

  selectedAttributeIndex.value = variant.attributes.length - 1;
};
// ----
const removeAttribute = (aIndex) => {
  const variant = form.variants[selectedVariantIndex.value];
  if (!variant || !variant.attributes) return;

  if (confirm("Bạn có chắc muốn xóa attribute này không?")) {
    if (variant.attributes.length > 1) {
      variant.attributes.splice(aIndex, 1);
      // nếu đang xoá cái attribute đang chọn thì reset lại index
      if (selectedAttributeIndex.value >= variant.attributes.length) {
        selectedAttributeIndex.value = variant.attributes.length - 1;
      }
    } else {
      // reset lại attribute cuối cùng thay vì xóa hết
      variant.attributes[0] = {
        name: '',
        originalPrice: 0,
        finalPrice: 0,
        discount: 0,
        stockQuantity: 0,
        soldQuantity: 0
      };
      selectedAttributeIndex.value = 0;
    }
  }
};

// select variant
const selectedVariantIndex = ref(0)
const selectedAttributeIndex = ref(0)
function selectVariant(index) {
  selectedVariantIndex.value = index
}
const selectAttribute = (index) => {
  selectedAttributeIndex.value = parseInt(index);
};

// category 
const categories = ref([]);
const fetchCategories = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:8080/bej3/admin/category", {
    headers: { Authorization: `Bearer ${token}` },
  });
  categories.value = res.data.result;
};
onMounted(async () => {
  await fetchCategories();
});
</script>


<style scoped>

.variant-selector {
  margin: 10px;
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


.form-control-form-group-product {
  -webkit-appearance: none; /* Chrome, Safari */
  -moz-appearance: none;    /* Firefox */
  appearance: none;         /* chuẩn */
  padding-right: 30px;      /* chừa chỗ cho icon custom */
  background: white;        /* đảm bảo không bị trong suốt */
}

.form-wrap-product {
  position: relative;
}

.show-hide-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none; /* để click vào icon vẫn bấm được select */
  font-size: 16px;
  color: #4d4d4d;
}

</style>