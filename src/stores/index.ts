import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    currentUser: {
      id: '',
      authUserId: '',
      nickname: '未命名',
      avatar: '@/assets/images/default_avatar.png',
      birthday: '',
      email: '',
      gender: '',
      phone: '',
      registerTime: '',
    },
    isLogin: false,    // 当前用户是否登录
    currentToken: '', // 当前用户token
    showLoginBox: false,    // 是否显示登录框
    showRegisterBox: false, // 是否显示注册框
    showResetPasswordBox: false, // 是否显示重置密码框
  }),
  actions: {
    setShowLoginBox(value: boolean) {
      this.showLoginBox = value
    },
    setShowRegisterBox(value: boolean) {
      this.showRegisterBox = value
    },
    setShowResetPasswordBox(value: boolean) {
      this.showResetPasswordBox = value
    },
    setCurrentToken(value: string) {
      this.currentToken = value
    },
    setIsLogin(value: boolean) {
      this.isLogin = value
    }
  }
}) 