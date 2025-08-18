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