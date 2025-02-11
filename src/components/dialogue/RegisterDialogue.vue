<template>
  <el-dialog
    v-model="dialogVisible"
    title="注册"
    width="35%"
    :close-on-click-modal="false"
    center
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      status-icon
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" autocomplete="off" style="width: 200px;"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          autocomplete="off"
          show-password
          style="width: 200px;"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          autocomplete="off"
          show-password
          style="width: 200px;"
        ></el-input>
      </el-form-item>

      <el-form-item label="验证码" prop="verificationCode">
        <div style="display: flex; justify-content: center; align-items: center;">
          <el-input 
            v-model="form.verificationCode" 
            autocomplete="off" 
            style="width: 200px; margin-right: 10px;"
          ></el-input>
          <el-button 
            type="primary" 
            size="small" 
            @click="sendVerificationCode"
            :disabled="isCountingDown"
          >{{ countDownText }}</el-button>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="footer-container">
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="handleRegister">注册</el-button>
        </span>
        <div class="login-link">
          <span>已有账号？</span>
          <el-link type="primary" @click="switchToLogin" style="font-size: 12px;">点我登录</el-link>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from '@/stores'

const store = useStore()

const dialogVisible = computed({
  get: () => store.showRegisterBox,
  set: (value) => store.setShowRegisterBox(value)
})  
const formRef = ref(null)

// 切换到登录对话框
const switchToLogin = () => {
  closeDialog() // 关闭注册对话框
  store.setShowLoginBox(true) // 打开登录对话框
}

// 表单数据
const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
})

// 验证规则
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { min: 3, max: 200, message: '请输入邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度应为 6 位', trigger: 'blur' }
  ]
}

// 倒计时相关
const countdown = ref(60)
const isCountingDown = ref(false)
const countDownText = computed(() => {
  return isCountingDown.value ? `${countdown.value}秒后重试` : '发送验证码'
})

// 发送验证码
const sendVerificationCode = () => {
  // TODO: 调用发送验证码接口
  console.log('发送验证码')
  
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

// 注册处理
const handleRegister = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      // TODO: 调用注册接口
      console.log('注册表单数据:', form.value)
      ElMessage.success('注册成功')
      closeDialog()
    } else {
      console.log('验证失败:', fields)
    }
  })
}

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

// 暴露方法供父组件调用
defineExpose({
  dialogVisible
})
</script>

<style scoped>
.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

.login-link {
  font-size: 12px;
  text-align: center;
}
</style>
