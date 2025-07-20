import request from '@/api/request'

// 发送验证码
export const sendAuthCode = (email: string, mode: string) => {
  return request.get(`/auth/common/sendAuthCode?email=${email}&mode=${mode}`)
}


// 用户注册
export const register = (email: string, password: string, authCode: string) => {
  return request.post("/auth/user/register", {
    "username": email, "password": password, "authCode": authCode
  })
};


// 用户登录
export const login = (email: string, password: string) => {
  return request.post("/auth/user/login", {
    email, password
  })
}


// 根据用户token查询用户详细信息
export const parseUserInfoByToken = (token: string) => {
  return request.post(`/auth/user/parseUserInfoByToken/${token}`)
}


// 找回密码--验证验证码是否正确
export const validAuthCode = (email: string, authCode: string) => {
  return request.post(`/auth/common/validAuthCode/${email}/${authCode}`)
}


// 重置密码
export const reset = (email: string, password: string, authCode: string) => {
  return request.post("/auth/user/reset", { email, password, authCode })
}