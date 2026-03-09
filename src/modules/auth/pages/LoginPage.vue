<template>
  <div class="login-container">

    <!-- LEFT SIDE -->
    <div class="login-left">
      <div class="logo">LOGI.WMS</div>

      <h1>
        Quản lý kho vận thông minh
        <br />
        & chính xác
      </h1>

      <p>
        Hệ thống tích hợp điều phối đơn hàng, báo cáo thời gian thực
        và tối ưu hóa quy trình nhập xuất.
      </p>
    </div>

    <!-- RIGHT SIDE -->
    <div class="login-right">

      <div class="login-card">

        <h2>Đăng nhập hệ thống</h2>

        <p class="sub">
          Chào mừng trở lại! Vui lòng nhập thông tin xác thực.
        </p>

        <form @submit.prevent="handleLogin">

          <!-- Warehouse -->
          <div class="form-group">
            <label>Mã kho làm việc</label>

            <select v-model="warehouseId">
              <option
                v-for="w in warehouses"
                :key="w.id"
                :value="w.id"
              >
                {{ w.code }} - {{ w.name }}
              </option>
            </select>
          </div>

          <!-- Username -->
          <div class="form-group">
            <label>Tên tài khoản</label>

            <input
              v-model="username"
              placeholder="Nhập tên tài khoản"
            />
          </div>

          <!-- Password -->
          <div class="form-group">
            <label>Mật khẩu</label>

            <input
              type="password"
              v-model="password"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <!-- ERROR -->
          <div v-if="message" class="error">
            {{ message }}
          </div>

          <button class="login-btn">
            Đăng nhập
          </button>

        </form>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getWarehouses } from "../services/warehouseService"
import { authStore } from "../store/authStore"
import type { LoginRequest } from "../type/auth"

const router = useRouter()

const username = ref("")
const password = ref("")
const warehouseId = ref<number | null>(null)

const warehouses = ref<any[]>([])
const message = ref("")

/**
 * LOAD WAREHOUSE LIST
 */
const loadWarehouses = async () => {
  try {
    const list = await getWarehouses() || []
    warehouses.value = list

    if (warehouses.value.length > 0) {
      warehouseId.value = warehouses.value[0].id
    }
  } catch (err) {
    console.error("Load warehouse failed", err)
    message.value = "Không thể tải danh sách kho"
  }
}

onMounted(loadWarehouses)

/**
 * LOGIN
 */
const handleLogin = async () => {
  message.value = ""

  if (!username.value || !password.value || !warehouseId.value) {
    message.value = "Vui lòng nhập đầy đủ thông tin"
    return
  }

  try {
    // use central store which handles token persistence
    const payload: LoginRequest = {
      username: username.value,
      password: password.value,
      warehouseId: warehouseId.value
    }

    await authStore.login(payload)

    router.push("/hello")
  } catch (err: any) {
    // backend may return { message } in error response
    message.value = err?.message || err?.response?.message || "Đăng nhập thất bại"
  }
}

</script>

<style scoped>

.login-container{
  display:flex;
  height:100vh;
}

.login-left{
  flex:1;
  background:#2f8aa6;
  color:white;
  padding:80px;
  display:flex;
  flex-direction:column;
  justify-content:center;
}

.logo{
  font-size:24px;
  font-weight:bold;
}

.login-left h1{
  font-size:36px;
  margin:20px 0;
}

.login-left p{
  width:380px;
  opacity:0.9;
}

.login-right{
  flex:1;
  display:flex;
  justify-content:center;
  align-items:center;
  background:#f6f6f6;
}

.login-card{
  width:380px;
}

.form-group{
  margin-bottom:16px;
  display:flex;
  flex-direction:column;
}

input,select{
  padding:10px;
  border:1px solid #ddd;
  border-radius:6px;
}

.login-btn{
  width:100%;
  padding:12px;
  border:none;
  background:#2f8aa6;
  color:white;
  border-radius:6px;
  cursor:pointer;
}

.login-btn:hover{
  opacity:0.9;
}

.error{
  background:#ffe3e3;
  color:#c92a2a;
  padding:10px;
  border-radius:6px;
  margin-bottom:12px;
}

</style>