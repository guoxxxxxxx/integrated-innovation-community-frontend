import request from "./request"
import { MAX_FILE_SIZE } from '@/api/config'

import type { FileUploadOtherInfo } from "@/api/entity"

/**
 * 文件分块上传预处理
 * @param filename 原始文件名
 * @param fileSize 文件大小
 * @param md5 文件的md5码
 * @param otherInfo 文件其他元数据信息
 * @returns 在服务器中的文件的uuid标识以及一些分块信息等
 */
export const fileUploadPreHandle = async (filename: string, fileSize: number, md5: string, otherInfo: FileUploadOtherInfo | null) => {
    return request.post(`/file/upload/fileuploadPreHandle`, {
        filename,
        fileSize,
        md5,
        otherInfo
    })
}



import type { FileUploadMultiBlockParams } from "@/api/entity"
/**
 * 文件分块上传
 * @param params 文件上传分块参数 
 * @param config 请求配置
 * @returns 
 */
export const uploadFileMultiBlock = async (params: FileUploadMultiBlockParams, config?: any) => {
    const formData = new FormData()
    formData.append('fileUUID', params.fileUUID)
    formData.append('chunkSize', params.chunkSize.toString())
    formData.append('chunkId', params.chunkId.toString())
    formData.append('chunkMd5', params.chunkMd5)
    formData.append('file', params.file)

    return request.post(`/file/upload/uploadFileMultiBlock`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        ...config
    })
}


// 查询当前文件是否上传成功
export const checkFileUploadIsOk = async (fileUUID: string) => {
    return request.get(`/file/upload/checkFileUploadIsOk?fileUUID=${fileUUID}`)
}


/**
 * 视频封面上传
 * @param file 封面图片
 * @param md5 封面md5码
 * @param config 配置
 * @returns 返回封面图片在服务器中的路径
 */
export const videoCoverUpload = async (file: File, md5: string, config?: any) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('originName', file.name)
    formData.append('size', file.size.toString())
    formData.append('md5', md5)


    return request.post(`/file/upload/videoCoverUpload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        ...config
    })
}
