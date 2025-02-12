<template>
  <el-dialog title="登录" v-model="dialogVisible" width="35%" center>
    <el-form :model="loginForm" label-width="100px">
      <el-form-item label="邮箱">
        <div style="display: flex; justify-content: center;">
          <el-input v-model="loginForm.email" autocomplete="off" style="width: 180px;"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="密码">
        <div style="display: flex; justify-content: center;">
          <el-input type="password" v-model="loginForm.password" autocomplete="off" style="width: 180px;"></el-input>
        </div>
        <div style="text-align: center; margin-left: 10px; font-size: 12px;">
          <a href="#" style="color: #409eff; cursor: pointer; text-decoration: none;"
            @click="switchToResetPassword">忘记密码？</a>
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
          <span>还没有账户？<a href="#" style="color: #409eff; cursor: pointer; text-decoration: none;"
              @click="switchToRegister">点击注册</a></span>
        </div>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores'
import request from '@/api/request'
import { topSuccessTips } from '@/utils'
import { queryUserInfoByToken } from '@/api/userRequest'
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

const loginForm = ref({
  email: '',
  password: '',
  authCode: ''
})

const countdown = ref(60)
const isCountingDown = ref(false)
const countDownText = computed(() => {
  return isCountingDown.value ? `${countdown.value}秒后重试` : '发送验证码'
})

/**
 * 登录逻辑
 */
const login = () => {
  request.post('/auth/user/login', loginForm.value)
    .then(res => {
      if (res.data.status == 200) {
        store.setCurrentToken(res.data.data.token)
        store.setIsLogin(true)
        dialogVisible.value = false
        // 查询当前用户的信息
        queryUserInfoByToken(store.currentToken).then(res => {
          store.currentUser = res.data.data
        })
        topSuccessTips("登录成功")
      }
    });
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
