import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    currentUser: {
        nickname: '未登录',
        avatar: '@/assets/images/default_avatar.png',
        isLogin: false
    }
  }),
  actions: {
    // 在这里添加你需要的actions
  }
}) 