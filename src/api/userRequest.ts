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


/**
 * 根据id查询指定用户的关注状态
 * @param sourceId 源用户id
 * @param targetId 目的用户id
 * @returns 关注状态
 */
export const queryUserFollowStatus = (sourceId: any, targetId: any) => {
  return request.get(`/user/follow/${sourceId}/${targetId}`)
}


/**
 * 根据目标用户id关注用户
 * @param targetId 目标用户id
 * @returns 关注状态
 */
export const followUser = (targetId: any) => {
  return request.post(`/user/follow/${targetId}`)
}


/**
 * 根据目标用户id取消关注用户
 * @param targetId 目标用户id
 * @returns 关注状态
 */
export const cancelFollowUser = (targetId: any) => {
  return request.post(`/user/follow/cancelFollow/${targetId}`)
}

