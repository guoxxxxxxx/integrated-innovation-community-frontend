import request from '@/api/request'

// 根据token查询当前用户的信息
export const queryUserInfoByToken = (token: string) => {
  return request.post(`/user/info/queryUserInfoByToken?token=${token}`)
}

