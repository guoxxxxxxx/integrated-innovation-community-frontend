import request from "./request"


// 文件分块上传预处理
import type { FileUploadOtherInfo } from "@/api/entity"
export const fileUploadPreHandle = async (filename: string, fileSize: number, md5: string, otherInfo: FileUploadOtherInfo | null) => {
    return request.post(`/file/upload/fileuploadPreHandle`, {
        filename,
        fileSize,
        md5,
        otherInfo
    })
}


// 文件分块上传
import type { FileUploadMultiBlockParams } from "@/api/entity"
export const uploadFileMultiBlock = async (params: FileUploadMultiBlockParams) => {
    const formData = new FormData()
    formData.append('fileUUID', params.fileUUID)
    formData.append('chunkSize', params.chunkSize.toString())
    formData.append('chunkId', params.chunkId.toString())
    formData.append('chunkMd5', params.chunkMd5)
    formData.append('file', params.file)

    return request.post(`/file/upload/uploadFileMultiBlock`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}


// 查询当前文件是否上传成功
export const checkFileUploadIsOk = async (fileUUID: string) => {
    return request.get(`/file/upload/checkFileUploadIsOk?fileUUID=${fileUUID}`)
}