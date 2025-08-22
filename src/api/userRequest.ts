import request from '@/api/request'

// 根据token查询当前用户的信息
export const queryUserInfoByToken = (token: string) => {
  return request.post(`/user/info/queryUserInfoByToken?token=${token}`)
}


/**
 * 根据主键修改用户信息
 * @param id 主键
 * @param nickname 用户昵称
 * @param avatar 用户头像路径
 * @param gender 用户性别
 * @param birthday 用户生日
 * @param phone 用户手机号
 * @returns 更改过后的用户信息
 */
export const updateUserInfoById = (id: any, nickname: any, avatar: any, gender: any, birthday: any, phone: any) => {
  return request.post(`/user/info/update`, {
    id,
    nickname,
    avatar,
    gender,
    birthday,
    phone
  })
}

