
<template>
    <div class="w-container login-form-container" style="background-color: white;">
      <div class="login-title">
        <h3 class="login-title-border" 
              :class="{formActive: isLoginForm}" @click="isLoginForm = true"
        >
            Đăng nhập
        </h3>
        <h3 class="login-title-border" 
              :class="{formActive: !isLoginForm}" @click="isLoginForm = false"
        >
            Đăng ký
        </h3>
      </div>
      <!-- Form login -->
      <div class="login-form" v-if="isLoginForm">
        <form action="" class="form-create-user" @submit.prevent="handleLogin">
          <div class="login-row login-row-aa">
            <label for="">Số điện thoại</label>
            <input type="text" name="phoneNumber" id="phoneNumber" placeholder="Nhập số điện thoại" required
                  v-model="loginData.phoneNumber">
          </div>
          <div class="login-row">
            <label for="">Mật khẩu</label>
            <input type="password" name="password" id="password" placeholder="Nhập mật khẩu" required
                  v-model="loginData.password">
          </div>

          <!-- <div class="password-forget">
            <a href="">Quên mật khẩu</a>
          </div> -->
          <div class="login-button">
            <button type="submit">Đăng nhập</button>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>

      <!-- Form sign up -->
      <div class="login-form" v-else>
        <form class="form-create-user" @submit.prevent="handleSignUp">
          <div class="login-row">
            <label>Số điện thoại</label>
            <input type="text" placeholder="Nhập số điện thoại" required v-model="signUpData.phoneNumber">
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
          </div>
          <div class="login-row">
            <label>Email</label>
            <input type="text" placeholder="Nhập email" required v-model="signUpData.email">
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
          </div>
          <div class="login-row">
            <label>Họ tên</label>
            <input type="text" placeholder="Họ tên" required v-model="signUpData.fullName">
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
          </div>
          <div class="login-row">
            <label>Mật khẩu</label>
            <input type="password" placeholder="Nhập mật khẩu" required v-model="signUpData.password">
            <span v-if="errors.password" class="error">{{ errors.password }}</span>
          </div>
          <div class="login-row">
            <label>Nhập lại mật khẩu</label>
            <input type="password" placeholder="Nhập lại mật khẩu" required v-model="signUpData.retypePassword">
            <span v-if="errors.retypePassword" class="error">{{ errors.retypePassword }}</span>
          </div>

          <div class="login-button">
            <button type="submit">Đăng ký</button>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>

    </div>
    
</template>

<script setup>

    import "@/assets/styles/login-style.css";
    import "@/assets/styles/style.css";
    import router from "@/router";
    import axios from "axios";
    import { userBus } from "@/components/layout/userBus";

    import { ref, watch } from "vue";

    const isLoginForm = ref(true);

    const errorMessage = ref("");

// login
    const loginData = ref({
      phoneNumber: "",
      password: "",
    })
    const handleLogin = async() => {
      errorMessage.value = "";

      try {
        const response = await axios.post("http://localhost:8080/bej3/auth/log-in", {
          phoneNumber: loginData.value.phoneNumber,
          password: loginData.value.password,
        })
        console.log(response.data.result)
        if(response.data.result){
          const {token, authenticated} = response.data.result;
          if(authenticated == true){
            localStorage.setItem("token", token);
            router.push("user/profile/my-info")
          }
          userBus.refreshProfile.value++
        }
        
      } catch (error) {
        alert(errorMessage)
      }
    }

// sign up
    const errors = ref({});
    const signUpData = ref({
      email: "",
      phoneNumber: "",
      fullName: "",
      password: "",
      retypePassword: "",
    });

    const validateSignUpForm = () => {
      errors.value = {};

      if (!signUpData.value.email.includes("@")) {
        errors.value.email = "Email không hợp lệ.";
      }

      if (signUpData.value.password.length < 5) {
        errors.value.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      }

      if (signUpData.value.password !== signUpData.value.retypePassword) {
        errors.value.retypePassword = "Mật khẩu không khớp.";
      }

      return Object.keys(errors.value).length === 0;
    };

    const handleSignUp = async () => {
      errorMessage.value = "";

      if (!validateSignUpForm()) {
        return;
      }

      try {
        const response = await axios.post("http://localhost:8080/bej3/users/create", {
          email: signUpData.value.email,
          password: signUpData.value.password,
          fullName: signUpData.value.fullName,
          phoneNumber: signUpData.value.phoneNumber,
        });

        errorMessage.value = "Tạo người dùng thành công!";
        
        alert(response.data.message||"Tạo người dùng thành công!");
        // Reset form sau khi đăng ký thành công
        signUpData.value = { email: "", password: "", retypePassword: "" };
        isLoginForm.value = true; // Chuyển sang form đăng nhập sau khi đăng ký thành công
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage.value = error.response.data.message;
        } else {
          errorMessage.value = "Đã xảy ra lỗi, vui lòng thử lại.";
        }
      }
    };

    // Xóa lỗi khi người dùng nhập lại thông tin đúng
  watch(signUpData, () => {
    errorMessage.value = "";
    errors.value = {};
  }, { deep: true });
    
</script>

<style scoped>
.error {
  color: red;
  font-size: 14px;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}

</style>

