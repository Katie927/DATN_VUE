<template>

    <div class="container">
        <div class="product-detail">
            <div class="box-header">
                <h1>{{ productDetails.name }}</h1>
            </div>
            <div class="box-detail-info">
                <div class="detail-info-left">
                    <div class="product-gallery">
                        <!-- Slider chính -->
                        <Swiper :loop="true" :navigation="true" :thumbs="{ swiper: thumbsSwiper }"
                            :modules="[Navigation, Thumbs]" class="main-slider"
                        >
                            <template v-if="isIntroImages === 1">
                                <SwiperSlide 
                                    v-for="(image, index) in productDetails?.introImages ?? []" 
                                    :key="'intro-' + index"
                                >
                                    <img :src="image?.url" class="main-image" />
                                </SwiperSlide>
                            </template>
                            <template v-else>
                                <SwiperSlide 
                                    v-for="(image, index) in productDetails?.variants?.[selectedVariantIndex]?.detailImages ?? []" 
                                    :key="'detail-' + index"
                                >
                                    <img :src="image?.url" class="main-image" />
                                </SwiperSlide>
                            </template>
                        </Swiper>

                        <!-- Danh sách màu sắc (thumbnail) -->
                        <div class="color-selector">
                            <div class="color-item" :class="{ active: isIntroImages === 1 }"
                                @click="isIntroImages = 1"
                            >
                                <img src="@/assets/icon/star.svg" class="color-thumb" alt="">
                                <p>Tính năng nổi bật</p>
                            </div>
                            <div v-for="(variant, index) in productDetails?.variants ?? []"
                                :key="index" class="color-item"
                                :class="{ active: selectedVariantIndex === index && isIntroImages === 0 }"
                                @click="selectVariant(index); isIntroImages = 0"
                            >
                                <img :src="variant.detailImages?.[0]?.url" class="color-thumb" />
                                <p>{{ variant.color }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="detail-info-right">
                    <div class="position-relative">
                        <div class="box-price">
                            <strong class="price"> {{ productDetails?.variants?.[selectedVariantIndex]?.attributes?.[selectedAttributeIndex]?.finalPrice
                                ?.toLocaleString('vi-VN') }} ₫ </strong>
                            <span class="last-price">{{ productDetails?.variants?.[selectedVariantIndex]?.attributes?.[selectedAttributeIndex]?.finalPrice
                                ?.toLocaleString('vi-VN') }} ₫</span>
                            <br>
                            <i style="font-size: 14px;">Máy nguyên seal chính hãng, kick hoạt bảo hành 8/2/2025 giá 26.990.000 (LH 1900 2091)</i>
                        </div>
                        
                    </div>
                    <div class="box-product-option version">
                        <strong class="label"> Lựa chọn phiên bản </strong>
                        <div class="list-option" id="option-version" data-id="5">
                            <div v-for="(attr, aIndex) in productDetails?.variants?.[selectedVariantIndex]?.attributes || []" 
                                :key="aIndex"
                                :class="['item-option', 'btn-active',
                                    { selected: aIndex === selectedAttributeIndex }
                                ]"
                                @click="selectAttribute(aIndex)"
                            >
                                <a href="javascript:void(0)" style="color: black;"><span>{{ attr.name }}</span></a>
                                <div class="color-price" style="padding: 0;">
                                    <p>{{ attr?.finalPrice
                                        ?.toLocaleString('vi-VN') }} ₫ </p>                                            
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="box-product-option color">
                        <strong class="label">
                            Lựa chọn màu
                        </strong>
                        <div class="list-option" id="option-color">
                            <div v-for="(variant, index) in productDetails?.variants ?? []" :key="index"
                                class="item-option btn-active" :class="{ selected: selectedVariantIndex === index }"
                                @click="selectVariant(index), isIntroImages = 0"
                            >
                                    <img :src="variant.detailImages?.[0]?.url" title="Samsung Galaxy S25 Ultra - 12GB/256GB Đen" alt="Samsung Galaxy S25 Ultra - 12GB/256GB Đen">
                                <div class="color-price">
                                    <span>{{ variant.color }}</span>
                                    <p>28,990,000 ₫ </p>                                            
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="box-order product-action">

                        <div class="box-order-btn">
                            <a title="MUA NGAY" data-returnurl="/dien-thoai/samsung-galaxy-s25?buy=1" href="javascript:;" class="add-buy order-btn btnQuickOrder inventory"><strong>MUA NGAY</strong><span>(Giao tận nhà hoặc nhận tại cửa hàng)</span></a>
                            <a @click="handleAddToCart" title="Thêm giỏ hàng" data-authorize="True" href="javascript:;" class="add-buy add-cart inventory">
                                <i class="icon-Cart1SolidOn"></i>
                                <label>Thêm giỏ hàng </label>
                            </a>
                        </div>
                        <div class="box-order-btn">
                            <a title="TRẢ GÓP 0%" href="" class="add-buy btn-installment order-btn btnInstallment"><strong>TRẢ GÓP 0%</strong><span>Không phí - Duyệt nhanh&nbsp;10p</span></a>
                            <a title="TRẢ GÓP 0%" href="" class="add-buy btn-installment order-btn btnInstallment"><strong>TRẢ GÓP QUA THẺ</strong><span>(Visa, Mastercard, JCB)</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>

</template>

<!--  -->
<script setup>

    import "@/assets/styles/style.css";
    import "@/assets/styles/product-detail.css";

    import { ref, onMounted } from "vue";
    import { Swiper, SwiperSlide } from "swiper/vue";
    import { Navigation, Thumbs } from "swiper/modules";
    import axios from "axios";
    import { useRoute } from 'vue-router';

    import "swiper/css";
    import "swiper/css/navigation";
    import "swiper/css/thumbs";
    

    const route = useRoute();
    
    const productDetails = ref({});
    const productId = route.params.productId;
    const fetchProductData = async () => {
        try{
            // console.log("id: "+productId)
            const response = await axios.get(`http://localhost:8080/bej3/home/product/${productId}`)
            productDetails.value = response.data.result;
        } catch (error) {
            console.error("Lỗi", error);
            alert("Không thể tải chi tiết sản phẩm!");
        }
    }
    onMounted(fetchProductData);
    // data
    const thumbsSwiper = ref(null);
    const selectedVariantIndex = ref(0);
    const selectedAttributeIndex = ref(0);
    const isIntroImages = ref(1)

    const selectVariant = (vIndex) => {
        selectedVariantIndex.value = vIndex;
        selectedAttributeIndex.value = 0; 
    };

    const selectAttribute = (aIndex) => {
        selectedAttributeIndex.value = aIndex;
        console.log();
        console.log(selectedAttributeIndex.value);

        console.log("selectedVariantIndex:", selectedVariantIndex.value)
        console.log("selectedAttributeIndex:", selectedAttributeIndex.value)

        const v = productDetails?.variants?.[selectedVariantIndex]
        console.log("variant:", v)

        const attrs = v?.attributes
        console.log("attributes:", attrs)

        const attr = attrs?.[selectedAttributeIndex]
        console.log("selected attribute:", attr)

        console.log("selected attribute id:", productDetails.value?.variants?.[selectedVariantIndex.value]?.attributes?.[selectedAttributeIndex.value]?.id)
    };

// ==================================== add to cart ====================================
    const handleAddToCart = async () => {
        const attrId = productDetails.value?.variants?.[selectedVariantIndex.value]?.attributes?.[selectedAttributeIndex.value]?.id;
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token không tồn tại!");
            router.push("/login"); // Chuyển hướng về trang login
            return;
        }
        console.log("Thêm vào giỏ hàng sản phẩm với attribute ID:", attrId);
        try{
            // console.log("id: "+productId)
            await axios.post(
                `http://localhost:8080/bej3/cart/add/${attrId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Thêm vào giỏ hàng thành công!");
        } catch (error) {
            console.error("Lỗi", error);
            alert("Thêm không thành công!");
        }
    };
// ==================================== add to cart ====================================



</script>


<style scoped>

.container {
    min-width: 1200px;
    width: 1200px;
    margin: 0 auto;
    padding: 0;
    background: unset;
    /* background-color: aliceblue; */
}

</style>