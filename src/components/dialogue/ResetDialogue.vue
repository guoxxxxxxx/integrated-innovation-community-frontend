<template>
    <el-dialog
      v-model="dialogVisible"
      title="找回密码"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
  
        <el-form-item label="验证码" prop="verificationCode">
          <div style="display: flex; justify-content: center; align-items: center;">
            <el-input 
              v-model="form.verificationCode" 
              autocomplete="off" 
              style="width: 180px; margin-right: 10px;"
            ></el-input>
            <el-button 
              type="primary" 
              size="small" 
              @click="sendVerificationCode"
              :disabled="isCountingDown"
            >{{ countDownText }}</el-button>
          </div>
        </el-form-item>
  
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
  
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
  
      <template #footer>
        <div class="footer-container">
          <span class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="handleReset">确认重置</el-button>
          </span>
          <div class="login-link">
            <span>想起密码了？</span>
            <el-link type="primary" @click="switchToLogin">去登录</el-link>
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
    get: () => store.showResetPasswordBox,
    set: (value) => store.setShowResetPasswordBox(value)
  })
  
  const formRef = ref(null)
  
  // 表单数据
  const form = ref({
    username: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // 验证规则
  const validatePass2 = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== form.value.newPassword) {
      callback(new Error('两次输入密码不一致'))
    } else {
      callback()
    }
  }
  
  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    verificationCode: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { len: 6, message: '验证码长度应为 6 位', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, validator: validatePass2, trigger: 'blur' }
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
    if (!form.value.username) {
      ElMessage.warning('请先输入用户名')
      return
    }
    
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
  
  // 重置密码处理
  const handleReset = async () => {
    if (!formRef.value) return
    
    await formRef.value.validate((valid, fields) => {
      if (valid) {
        // TODO: 调用重置密码接口
        console.log('重置密码表单数据:', form.value)
        ElMessage.success('密码重置成功')
        closeDialog()
        store.setShowLoginBox(true) // 重置成功后跳转到登录框
      } else {
        console.log('验证失败:', fields)
      }
    })
  }
  
  // 切换到登录对话框
  const switchToLogin = () => {
    closeDialog()
    store.setShowLoginBox(true)
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