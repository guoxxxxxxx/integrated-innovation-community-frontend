<template>
  <div style="text-align: center;margin: 0 20px">
    <div style="margin-top: 150px">
      <div style="font-size: 25px;font-weight: bold">登录</div>
      <div style="font-size: 14px;color: grey">在进入系统之前请先输入用户名和密码进行登录</div>
    </div>
    <div style="margin-top: 50px">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" maxlength="50" type="text" placeholder="用户名/邮箱">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" maxlength="50" style="margin-top: 10px" placeholder="密码">
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-row style="margin-top: 5px">
          <el-col :span="12" style="text-align: left">
            <el-form-item prop="remember">
              <el-checkbox v-model="form.remember" label="记住我" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-link @click="router.push('/reset')">忘记密码？</el-link>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="margin-top: 40px">
      <el-button @click="userLogin()" style="width: 270px" type="success" plain>立即登录</el-button>
    </div>
    <el-divider>
      <span style="color: grey;font-size: 13px">没有账号</span>
    </el-divider>
    <div>
      <el-button style="width: 270px" @click="router.push('/register')" type="warning" plain>注册账号</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import router from "@/router";
import { reactive, ref, onMounted } from "vue";
import { login, parseUserInfoByToken } from "@/api/authApi";
import { ElMessage } from 'element-plus'
import { useStore } from '@/stores';
import type { UserInfo } from '@/api/entity';

const store = useStore();

const formRef = ref()
const form = reactive({
  username: '',
  password: '',
  remember: true
})

const rules = {
  username: [
    { required: true, message: '请输入用户名' }
  ],
  password: [
    { required: true, message: '请输入密码' }
  ]
}

function userLogin() {
  formRef.value.validate((isValid: boolean) => {
    if (isValid) {
      login(form.username, form.password).then((resp) => {
        if (resp.data.status == 200) {
          store.setToken(resp.data.data.token);
          ElMessage.success(`登录成功`);
          store.remberme = form.remember;
          // 登录成功后查询用户信息并保存至store中
          console.log(resp.data.data);
          
          parseUserInfoByToken(resp.data.data.token).then((resp) => {
            if (resp.data.status == 200) {
              console.log(resp.data.data);              
              store.setCurrentUser(resp.data.data as UserInfo);
              router.push("/home");
            }
          })
        }
      })
    }
  });
}

onMounted(() => {
  if(store.remberme){
    // 验证用户token是否有效
    if (store.token) {
      parseUserInfoByToken(store.token).then((resp) => {
        if (resp.data.status == 200) {
          store.setCurrentUser(resp.data.data as UserInfo);
          router.push("/home"); // TODO 这里需要修改
        }
      })
    }
  }
});
</script>

<style scoped></style>