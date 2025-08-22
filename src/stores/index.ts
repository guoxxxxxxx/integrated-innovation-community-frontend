import { defineStore } from 'pinia';
import type { UserInfo } from "@/api/entity"


export const useStore = defineStore('main', {
  state: () => ({
    currentUser: null as UserInfo | null,
    token: null as string | null, // 当前用户token
    remberme: true,     // 是否记住当前用户登录信息
    isLogin: false,
  }),
  actions: {
    setToken(value: string) {
      this.token = value
    },
    // 设置当前登录用户的信息
    setCurrentUser(value: UserInfo) {
      this.currentUser = value
    },
    // 登出
    logout() {
      this.currentUser = null
      this.token = null
      this.isLogin = false
    },
  },
  persist: {
    storage: localStorage,
  },
}) 