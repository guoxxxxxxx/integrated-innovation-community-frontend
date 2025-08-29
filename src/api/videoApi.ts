import request from "./request"
import { baseUrl } from "./request";
import type {} from './entity'

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
    categoryId?: number | any,
}
/**
 * 根据条件获取分页查询信息
 * @param condition 查询条件
 * @returns 分页结果
 */
export const getPage = (condition: QueryCondition) => {
    return request.get('/video/video/getPage', { params: condition});
}


export const getVideoById = (id: any) => {
    return request.get(`/video/video/${id}`)
}


/**
 * 给视频点赞
 * @param videoId 视频id
 * @returns 点赞状态信息
 */
export const likeVideo = (videoId: any) => {
    return request.post(`/video/videoLikes/likes/${videoId}`)
}


/**
 * 给视频取消点赞
 * @param videoId 视频id
 * @returns 
 */
export const cancelLikeVideo = (videoId: any) => {
    return request.post(`/video/videoLikes/cancelLikes/${videoId}`)
}


/**
 * 给视频点收藏
 * @param videoId 视频id
 * @returns 
 */
export const favorVideo = (videoId: any) => {
    return request.post(`/video/videoLikes/favor/${videoId}`)
}


/**
 * 取消给视频点收藏
 * @param videoId 视频id
 * @returns 
 */
export const cancelFavorVideo = (videoId: any) => {
    return request.post(`/video/videoLikes/cancelFavor/${videoId}`)
}


/**
 * 获取用户视频的点赞收藏状态
 * @param videoId 视频id
 * @param userId 用户id
 * @returns 
 */
export const getVideoLikeAndFavorStatus = (videoId: any, userId: any) => {
    return request.get(`/video/videoLikes/${videoId}/${userId}`)
}


/**
 * 获取视频的所有类别
 * @returns 所有视频分类
 */
export const getAllVideoClass = () => {
    return request.get(`/video/videoCategory`)
}