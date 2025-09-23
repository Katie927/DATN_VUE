<template>

    <div class="container">
        <div class="product-detail">
            <div class="box-header">
                <h1>Điện thoại Samsung Galaxy S25 Ultra - 12GB/256GB</h1>
            </div>
            <div class="box-detail-info">
                <div class="detail-info-left">
                    <div class="product-gallery">
                        <!-- Slider chính -->
                        <Swiper
                        :loop="true"
                        :navigation="true"
                        :thumbs="{ swiper: thumbsSwiper }"
                        :modules="[Navigation, Thumbs]"
                        class="main-slider"
                        >
                        <SwiperSlide v-for="(image, index) in productImages[selectedColor]" :key="index">
                            <img :src="image" class="main-image" />
                        </SwiperSlide>
                        </Swiper>

                        <!-- Danh sách màu sắc (thumbnail) -->
                        <div class="color-selector">
                            <div
                                v-for="(images, color) in productImages"
                                :key="color"
                                class="color-item"
                                :class="{ active: selectedColor === color }"
                                @click="selectColor(color)"
                            >
                                <img :src="images[0]" class="color-thumb" />
                                <p>{{ color }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="detail-info-right">
                    <div class="position-relative">
                        <div class="box-price">
                            <strong class="price"> 28,990,000 ₫ </strong>
                            <span class="last-price">33,990,000 ₫</span>
                            <br>
                            <i style="font-size: 14px;">Máy nguyên seal chính hãng, kick hoạt bảo hành 8/2/2025 giá 26.990.000 (LH 1900 2091)</i>
                        </div>
                        
                    </div>
                    <div class="box-product-option version">
                        <strong class="label"> Lựa chọn phiên bản </strong>
                        <div class="list-option" id="option-version" data-id="5">
                            <div class="item-option btn-active selected">
                                <a href=""><span>256GB</span></a>
                            </div>
                            <div class="item-option btn-active ">
                                <a href=""><span>512GB</span></a>
                            </div>
                            <div class="item-option btn-active ">
                                <a href=""><span>1TB</span></a>
                            </div>
                        </div>
                    </div>
                    <div class="box-product-option color">
                        <strong class="label">
                            Lựa chọn màu
                        </strong>
                        <div class="list-option" id="option-color">
                            <div data-name="Xanh Dương" data-hotsale="" data-limitstock="0" data-pricenote="Máy nguyên seal chính hãng, kick hoạt bảo hành 8/2/2025 giá 26.990.000 (LH 1900 2091)" data-buyonline="true" data-bestprice="28,990,000 ₫" data-lastprice="33,990,000 ₫" data-idx="0" data-hex="#d5dde0" data-title="" data-id="185" data-sku="S938B256XD" class="item-option btn-active">
                                        <img src="https://cdn.hoanghamobile.com/i/productlist/dst/Uploads/2025/01/23/galaxy-s25-ultra-titan-silver-blue-1-8225f9e1f4.png;trim.threshold=80;trim.percentpadding=0.5;mode=pad;paddingWidth=0;" title="Samsung Galaxy S25 Ultra - 12GB/256GB Xanh Dương" alt="Samsung Galaxy S25 Ultra - 12GB/256GB Xanh Dương">
                                <div class="color-price">
                                    <span>Xanh Dương</span>
                                    <p>28,990,000 ₫ </p>                                            
                                </div>
                            </div>
                            <div class="item-option btn-active">
                                        <img src="https://cdn.hoanghamobile.com/i/productlist/dst/Uploads/2025/01/23/galaxy-s25-ultra-titan-white-silver-1-e9f4db0fc4.png;trim.threshold=80;trim.percentpadding=0.5;mode=pad;paddingWidth=0;" title="Samsung Galaxy S25 Ultra - 12GB/256GB Bạc" alt="Samsung Galaxy S25 Ultra - 12GB/256GB Bạc">
                                <div class="color-price">
                                    <span>Bạc</span>
                                    <p>28,990,000 ₫ </p>                                            
                                </div>
                            </div>
                            <div class="item-option btn-active">
                                        <img src="https://cdn.hoanghamobile.com/i/productlist/dst/Uploads/2025/01/23/xam.png;trim.threshold=80;trim.percentpadding=0.5;mode=pad;paddingWidth=0;" title="Samsung Galaxy S25 Ultra - 12GB/256GB Xám" alt="Samsung Galaxy S25 Ultra - 12GB/256GB Xám">
                                <div class="color-price">
                                    <span>Xám</span>
                                    <p>28,990,000 ₫ </p>                                            
                                </div>
                            </div>
                            <div class="item-option btn-active selected">
                                        <img src="https://cdn.hoanghamobile.com/i/productlist/dst/Uploads/2025/01/23/galaxy-s25-ultra-titan-black-1-5ffaab118c.png;trim.threshold=80;trim.percentpadding=0.5;mode=pad;paddingWidth=0;" title="Samsung Galaxy S25 Ultra - 12GB/256GB Đen" alt="Samsung Galaxy S25 Ultra - 12GB/256GB Đen">
                                <div class="color-price">
                                    <span>Đen</span>
                                    <p>28,990,000 ₫ </p>                                            
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="box-order product-action">

                        <div class="box-order-btn">
                            <a title="MUA NGAY" data-returnurl="/dien-thoai/samsung-galaxy-s25?buy=1" data-sku="S931B256BAC" href="javascript:;" class="add-buy order-btn btnQuickOrder inventory"><strong>MUA NGAY</strong><span>(Giao tận nhà hoặc nhận tại cửa hàng)</span></a>
                            <a title="Thêm giỏ hàng" data-sku="S931B256BAC" data-authorize="True" href="javascript:;" class="add-buy add-cart inventory">
                                <i class="icon-Cart1SolidOn"></i>
                                <label>Thêm giỏ hàng </label>
                            </a>
                        </div>
                        <div class="box-order-btn">
                            <a title="TRẢ GÓP 0%" href="/tra-gop/dien-thoai/samsung-galaxy-s25" class="add-buy btn-installment order-btn btnInstallment" data-sku="S931B256BAC"><strong>TRẢ GÓP 0%</strong><span>Không phí - Duyệt nhanh&nbsp;10p</span></a>
                            <a title="TRẢ GÓP 0%" href="/tra-gop/dien-thoai/samsung-galaxy-s25?color=123&amp;prepay=5&amp;month=5&amp;card=True#estimation" class="add-buy btn-installment order-btn btnInstallment" data-sku="S931B256BAC"><strong>TRẢ GÓP QUA THẺ</strong><span>(Visa, Mastercard, JCB)</span></a>
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

    import { ref } from "vue";
    import { Swiper, SwiperSlide } from "swiper/vue";
    import { Navigation, Thumbs } from "swiper/modules";

    import "swiper/css";
    import "swiper/css/navigation";
    import "swiper/css/thumbs";

    
    // Dữ liệu: Danh sách ảnh theo màu sắc
    const productImages = {
    "Xanh dương": [
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/galaxy-s25-ultra-titan-silver-blue-1-8225f9e1f4.png",
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/galaxy-s25-ultra-titan-silver-blue-1-8225f9e1f4.png",
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/galaxy-s25-ultra-titan-silver-blue-1-8225f9e1f4.png",
    ],
    "Bạc": [
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/galaxy-s25-ultra-titan-white-silver-1-e9f4db0fc4.png",
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/galaxy-s25-ultra-titan-white-silver-1-e9f4db0fc4.png",
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/galaxy-s25-ultra-titan-white-silver-1-e9f4db0fc4.png",
    ],
    "Xám": [
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/xam.png",
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/xam.png",
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/xam.png",
    ],
    "Đen": [
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/galaxy-s25-ultra-titan-black-1-5ffaab118c.png",
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/galaxy-s25-ultra-titan-black-1-5ffaab118c.png",
        "https://cdn.hoanghamobile.com/i/previewV2/Uploads/2025/01/23/galaxy-s25-ultra-titan-black-1-5ffaab118c.png",
    ],
    };

    // Màu sắc đang được chọn (mặc định là xanh dương)
    const selectedColor = ref("Xanh dương");
    const thumbsSwiper = ref(null);

    // Khi chọn màu mới, cập nhật slider chính
    const selectColor = (color) => {
    selectedColor.value = color;
    };
    

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
