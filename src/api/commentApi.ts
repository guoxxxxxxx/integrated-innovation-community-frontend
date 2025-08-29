import type { AnyColumn } from "element-plus/es/components/table-v2/src/common.mjs";
import request from "./request";


/**
 * 发送一个评论
 * @param content 评论内容
 * @param videoId 评论所属视频id
 * @returns 
 */
export const sendVideoComment = (content: string, videoId: any) => {
  return request.post("/comment/videoComment", {
    "content": content,
    "vid": videoId
  })
}


/**
 * 回复一条评论信息
 * @param content 回复内容
 * @param parentId 评论内依赖关系
 * @returns 
 */
export const sendVideoReply = (content: string, parentId: any) => {
    return request.post("/comment/videoReply", {
        "content": content,
        "parentId": parentId
    })
}


/**
 * 分页获取评论列表
 * @param videoId 视频id
 * @param pageNo 页码
 * @param pageSize 页大小
 * @param sortByDate 是否根据日期排序
 * @param sortByDateAsc 是否根据日期降序
 * @param sortByHot 是否按照热度排序
 * @param sortByHotAsc 是否按照热度降序
 * @returns 
 */
export const getVideoCommentPageList = (videoId: any, pageNo: number, pageSize: number, sortByDate: boolean = false, sortByDateAsc: boolean = false,
    sortByHot: boolean = false, sortByHotAsc: boolean = false
) => {
    return request.get("/comment/videoComment", {
        params:{
            "vid": videoId,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "sortByDate": sortByDate,
            "sortByDateAsc": sortByDateAsc,
            "sortByHot": sortByHot,
            "sortByHotAsc": sortByHotAsc
        }
    })
}


/**
 * 分页获取回复列表
 * @param parentId 父id
 * @param pageNo 页码
 * @param pageSize 页面大小
 * @returns 结果
 */
export const getVideoReplyPageList = (parentId: any, pageNo: number, pageSize: number) => {
    return request.get(`/comment/videoReply/getPageFormat/${parentId}/${pageNo}/${pageSize}`)
}


/**
 * 根据视频id、视频内容以及视频播放结点保存弹幕信息
 * @param videoId 视频id
 * @param content 弹幕内容
 * @param videoPlayProgress 视频播放进度
 * @returns 保存至数据库中的数据
 */
export const sendVideoBarrage = (videoId: any, content: string, videoPlayProgress: number) => {
    return request.post(`/comment/barrage`, {
        data: content,
        vid: videoId,
        videoPlayProgress: videoPlayProgress
    })
}


/**
 * 根据条件查询相应的信息
 * @param vid 视频id
 * @param maxCount 最大数量限制
 * @param start 开始时间
 * @param end 结束时间
 * @returns 符合条件的弹幕信息
 */
export const getVideoBarrage = (vid: any, maxCount: number, start: number, end: number) => {
    return request.get(`/comment/barrage`, {
        params: {
            vid: vid,
            maxCount: maxCount,
            start: start,
            end: end
        }
    })
}