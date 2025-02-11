import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    currentUser: {
        nickname: '未登录',
        avatar: '@/assets/images/default_avatar.png',
        isLogin: false
    },
    showLoginBox: false,
    showRegisterBox: false,
    showResetPasswordBox: false,
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
    }
  }
}) 