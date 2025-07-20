// 用户实体信息
export interface UserInfo {
    id: number,
    authUserId: number,
    nickname: string,
    avatar: string,
    birthday: string,
    email: string,
    gender: string,
    phone: string,
    registerTime: string,
    authInfo: null | AuthInfo;
}

// 用户权限信息
export interface AuthInfo {
    id: number,
    accountNonExpired: boolean,
    accountNonLocked: boolean,
    credentialsNonExpired: boolean,
    deleted: boolean,
    enabled: boolean,
    roleId: number,
    email: string,
    phone: string,
    lastLoginIp: string,
    lastLoginTime: string
}