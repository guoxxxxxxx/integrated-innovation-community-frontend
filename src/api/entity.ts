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

// 文件信息上传其他元信息
export interface FileUploadOtherInfo {
    mode: string | null,   // 元信息所属模块: video | image | file
    videoMetadata: videoMetadata | null,
}

// 视频模块的元数据信息
export interface videoMetadata {
    title: string,
}

// 文件分块上传参数
export interface FileUploadMultiBlockParams {
    fileUUID: string,
    chunkSize: number,
    chunkId: number,
    chunkMd5: string,
    file: Blob | File,
}