import request from '@/api/request'

// 发送验证码
export const sendVerificationCode = (email: string, mode: string) => {
  return request.post(`/auth/common/sendAuthCode?email=${email}&mode=${mode}`)
}

