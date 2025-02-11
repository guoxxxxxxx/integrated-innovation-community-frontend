<template>
  <el-dialog title="登录" v-model="dialogVisible" width="35%" center>
    <el-form :model="form" label-width="100px">
      <el-form-item label="用户名">
        <div style="display: flex; justify-content: center;">
          <el-input v-model="form.username" autocomplete="off" style="width: 180px;"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="密码">
        <div style="display: flex; justify-content: center;">
          <el-input type="password" v-model="form.password" autocomplete="off" style="width: 180px;"></el-input>
        </div>
        <div style="text-align: center; margin-left: 10px; font-size: 12px;">
          <a href="#" style="color: #409eff; cursor: pointer; text-decoration: none;" @click="switchToResetPassword">忘记密码？</a>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <div style="display: flex; justify-content: center; margin-bottom: 5px;">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="login">登录</el-button>
        </div>
        <div style="display: flex; justify-content: center; font-size: 12px; color: #666;">
          <span>还没有账户？<a href="#" style="color: #409eff; cursor: pointer; text-decoration: none;" @click="switchToRegister">点击注册</a></span>
        </div>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores'

const store = useStore()

/**
 * 切换到注册对话框
 */
const switchToRegister = () => {
  store.setShowLoginBox(false)
  store.setShowRegisterBox(true)
}

/**
 * 切换到重置密码对话框
 */
const switchToResetPassword = () => {
  store.setShowLoginBox(false)
  store.setShowResetPasswordBox(true)
}

const dialogVisible = computed({
  get: () => store.showLoginBox,
  set: (value) => store.setShowLoginBox(value)
})

const form = ref({
  username: '',
  password: '',
  verificationCode: ''
})

const countdown = ref(60)
const isCountingDown = ref(false)
const countDownText = computed(() => {
  return isCountingDown.value ? `${countdown.value}秒后重试` : '发送验证码'
})

const login = () => {
  // 这里应该是登录的逻辑
  console.log('登录逻辑')
  
}

const sendVerificationCode = () => {
  // 这里添加发送验证码的接口调用
  console.log('发送验证码')
  
  // 开始倒计时
  isCountingDown.value = true
  countdown.value = 60
  
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isCountingDown.value = false
      countdown.value = 60
    }
  }, 1000)
}
</script>

<style scoped>
.el-form-item__label {
  text-align: center;
}
</style>
