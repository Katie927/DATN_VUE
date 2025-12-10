<template>
    <div class="title">
        Cập nhật thông tin cá nhân
    </div>
    <div class="member-info-wrapper">
        <div class="member-infomation">
            <div class="account-form">
                <form action="" @submit.prevent="updateMyInfo">
                    <div class="form-controls">
                        <label for="">Họ tên</label>
                        <div class="controls">
                            <input type="text" id="fullName" v-model="userData.fullName">
                        </div>
                    </div>
                    <div class="form-controls">
                        <label for="">Điện thoại</label>
                        <div class="controls">
                            <input type="text" id="phoneNumber" v-model="userData.phoneNumber" readonly="true">
                        </div>
                    </div>
                    <div class="form-controls">
                        <label for="">Email</label>
                        <div class="controls">
                            <input type="text" id="email" v-model="userData.email">
                        </div>
                    </div>
                    <div class="form-controls">
                        <label for="">Địa chỉ</label>
                        <div class="controls">
                            <input type="text" id="address" v-model="userData.address">
                        </div>
                    </div>
                    <div class="form-controls">
                        <label for="dob">Ngày sinh</label>
                        <div class="controls">
                            <input type="date" id="dob" v-model="userData.dob" pattern="\d{4}-\d{2}-\d{2}">
                        </div>
                    </div>
                    <div class="form-controls">
                        <label for="">Mật khẩu mới</label>
                        <div class="controls">
                            <input type="text" id="password" v-model="userData.password">
                        </div>
                    </div>
                    <div class="form-controls">
                        <label for="">Xác nhận mật khẩu mới</label>
                        <div class="controls">
                            <input type="text" >
                        </div>
                    </div>
                    <div class="form-controls">
                        <div class="controls submit-controls">
                            <button type="submit">XÁC NHẬN</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>

    import "@/assets/styles/user-style.css";
    import axios from "axios";
    import { onMounted, ref } from "vue";
    import { useRouter } from "vue-router";

    // user data
    const router = useRouter();   
    const userData = ref({
        fullName: '',
        email: '',
        phoneNumber: '',
        dob: '',
        address: '',
        password: ''
    });
    const fetchUserProfile = async () => {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) {
            console.error("Token không tồn tại!");
            router.push("/login"); // Chuyển hướng về trang login
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/bej3/users/profile/my-info`, {
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong header
                }
            });

            const data = response.data.result;

            userData.value = {
                fullName: data.fullName || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                dob: data.dob || '',
                address: data.address || '',
                password: ''   
            };

            // userData.value = response.data.result; // Gán dữ liệu user
        } catch (error) {
            console.error('Lỗi:', error);

            // Nếu lỗi 401 (Unauthorized) hoặc 403 (Forbidden), chuyển hướng về trang login
            if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 500)) {
                localStorage.removeItem("token"); // Xóa token cũ
                router.push("/login"); // Chuyển hướng về trang đăng nhập
            }
        }
    };
    onMounted(fetchUserProfile);

    const updateMyInfo = async() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token không tồn tại!");
            router.push("/login");
            return;
        }
        try {
            console.log("Payload FE gửi:", JSON.stringify(userData.value));
            await axios.put("http://localhost:8080/bej3/users/profile/my-info/update", 
            userData.value, 
            {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                 }
            });

            // console.log("Cập nhật thành công!", response.data);
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Cập nhật thất bại!");
        }
    }

</script> 