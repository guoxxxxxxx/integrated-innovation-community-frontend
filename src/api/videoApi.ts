import request from "./request"
import { baseUrl } from "./request";

export const videoPlayerBaseUrl = baseUrl + '/video/videos/';

/**
 * 查询条件
 */
export interface QueryCondition {
    pageNo: number | any,
    pageSize?: number | any,
    clazz?: string | any,
    sortByViewsCount?: boolean | any,
    sortByViewsCountDesc?: boolean | any,
    uid?: number | any,
    startUploadTime?: string | any,
    endUploadTime?: string | any,
    sortByUploadTime?: boolean | any,
    sortByUploadTimeDesc?: boolean | any,
}
/**
 * 根据条件获取分页查询信息
 * @param condition 查询条件
 * @returns 分页结果
 */
export const getPage = (condition: QueryCondition) => {
    return request.get('/video/video/getPage', { params: condition});
}


export const getVideoById = (id: number) => {
    return request.get(`/video/video/${id}`)
}