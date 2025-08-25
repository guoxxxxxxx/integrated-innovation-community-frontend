<template>
  <div class="container" style="width: 100%;">
    <div class="video-container">
      <div class="video-wrapper" @mouseenter="showControls = true" @mouseleave="showControls = false">
        <video ref="videoPlayer" class="video-js vjs-default-skin" controls preload="auto" width="1200"
          height="675"></video>

        <!-- 右下角控制面板 -->
        <div class="custom-controls" :class="{ show: showControls }">
          <!-- 分辨率切换 -->
          <div class="control-item">
            <select v-model="currentResolution" @change="changeResolution(currentResolution)">
              <option v-for="(path, key) in resolutionPath" :key="key" :value="key">
                {{ key }}
              </option>
            </select>
          </div>

          <!-- 倍速切换 -->
          <div class="control-item">
            <select v-model="currentSpeed" @change="changePlaybackRate(currentSpeed)">
              <option v-for="rate in speedOptions" :key="rate" :value="rate">
                {{ rate }}x
              </option>
            </select>
          </div>
        </div>
      </div>


      <div class="details-container"
        style="margin-top: 20px; padding: 16px; border-radius: 8px; background: #f9f9f9; box-shadow: 0 2px 6px rgba(0,0,0,0.1); max-width: 1200px; margin-left: auto; margin-right: auto;">

        <div class="video-star-container" style="display: flex; justify-content: space-around; margin-bottom: 16px;">

          <!-- 播放量 -->
          <div class="show-count" style="display: flex; align-items: center;">
            <el-icon style="color: #409EFF; margin-right: 6px; font-size: 20px;">
              <View />
            </el-icon>
            <span style="font-size: 0.95em; color: #606266;">播放量: {{ currentVideoInfo?.viewCount }}</span>
          </div>

          <!-- 点赞数 -->
          <div class="likes-container" v-if="status.likes" @click="cancelLikeBtnClick"
            style="display: flex; align-items: center; cursor: pointer; transition: transform 0.2s;"
            @mouseenter="hoverEnter($event)" @mouseleave="hoverLeave($event)">
            <el-icon style="color: #F56C6C; margin-right: 6px; font-size: 20px;">
              <CaretTop />
            </el-icon>
            <span style="font-size: 0.95em; color: #606266;">点赞数: {{ currentVideoInfo?.likes }}</span>
          </div>

          <div class="likes-container" v-if="!status.likes" @click="likeBtnClick"
            style="display: flex; align-items: center; cursor: pointer; transition: transform 0.2s;"
            @mouseenter="hoverEnter($event)" @mouseleave="hoverLeave($event)">
            <el-icon style="color: gray; margin-right: 6px; font-size: 20px;">
              <CaretTop />
            </el-icon>
            <span style="font-size: 0.95em; color: #606266;">点赞数: {{ currentVideoInfo?.likes }}</span>
          </div>


          <!-- 收藏数 -->
          <div class="star-container" v-if="!status.favor" @click="favorBtnClick"
            style="display: flex; align-items: center; cursor: pointer; transition: transform 0.2s;"
            @mouseenter="hoverEnter($event)" @mouseleave="hoverLeave($event)">
            <el-icon style="color: #E6A23C; margin-right: 6px; font-size: 20px;">
              <Star />
            </el-icon>
            <span style="font-size: 0.95em; color: #606266;">收藏数: {{ currentVideoInfo?.favorite }}</span>
          </div>

          <div class="star-container" v-if="status.favor" @click="cancelFavorBtnClick"
            style="display: flex; align-items: center; cursor: pointer; transition: transform 0.2s;"
            @mouseenter="hoverEnter($event)" @mouseleave="hoverLeave($event)">
            <el-icon style="color: #E6A23C; margin-right: 6px; font-size: 20px;">
              <StarFilled />
            </el-icon>
            <span style="font-size: 0.95em; color: #606266;">收藏数: {{ currentVideoInfo?.favorite }}</span>
          </div>

        </div>
        <hr>

        <!-- 视频标题 -->
        <div class="video-title" style="margin-bottom: 12px;">
          <h3 style="font-size: 1.8em; font-weight: 600; color: #333; line-height: 1.2; margin: 0;">
            {{ currentVideoInfo?.title }}
          </h3>
          <div class="flex gap-2" style="margin-top: 15px;">
            类别：
            <el-tag>{{ currentVideoInfo?.category == null ? "未定义" : currentVideoInfo?.category }}</el-tag>
            <span style="margin-left: 10px;">标签：</span>
            <el-tag style="margin-left: 6px;" type="success"
              v-for="(value, index) in currentVideoInfo?.tag?.replace(/^\[|\]$/g, '')?.split(',') || []" :key="index">
              {{ value }}
            </el-tag>
          </div>
        </div>

        <!-- 作者信息 -->
        <div class="author-info" style="display: flex; align-items: center; margin-bottom: 12px;">
          <el-avatar :size="40" :src="currentVideoInfo?.user?.avatar" style="margin-right: 12px;"></el-avatar>
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 500; color: #555;">{{ currentVideoInfo?.user?.nickname }}</span>
          </div>
          <div class="follow-btn" v-if="pinia.currentUser?.id !== currentVideoInfo?.userId">
            <el-button type="primary" size="small" style="margin-left: 20px;" v-if="!status.follow"
              @click="follow(currentVideoInfo?.userId)">+关注</el-button>
            <el-button type="primary" size="small" v-else @mouseenter="follow_hover = true"
              @click="cancelFollow(currentVideoInfo?.userId)" @mouseleave="follow_hover = false" :style="{
                marginLeft: '20px',
                backgroundColor: follow_hover ? '#FFE0E0' : '#E0F0FF',
                color: follow_hover ? '#FF4D4F' : '#409EFF',
                borderColor: follow_hover ? '#FFE0E0' : '#E0F0FF'
              }">
              {{ follow_hover ? '取消关注' : '已关注' }}
            </el-button>
          </div>

        </div>

        <!-- 视频描述 -->
        <div class="details" style="font-size: 1em; color: #666; line-height: 1.6; white-space: pre-wrap;">
          {{ currentVideoInfo?.description }}
        </div>

      </div>
    </div>


    <div class="comment-container" style="width: 100%;">
      <div class="inner-container" style="width: 40%; margin: 0 auto;">
        <u-comment :config="config" @submit="submit" @reply-page="replyPage">
        </u-comment>
      </div>
      <div style="display: flex; width: 100%; justify-content: center; margin-top: 20px;">
        <el-pagination background layout="prev, pager, next" :total="commentTotal" :current-page="commentPageNo"
          :current-size="commentPageSize" @current-change="changeCommentPage" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, reactive } from "vue";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { videoPlayerBaseUrl, getVideoById, getVideoLikeAndFavorStatus, likeVideo, cancelLikeVideo, favorVideo, cancelFavorVideo } from "@/api/videoApi";
import { useRoute } from "vue-router";
import { useStore } from "@/stores";
import { View, Star, CaretTop, StarFilled } from "@element-plus/icons-vue";
import { cancelFollowUser, followUser, queryUserFollowStatus } from '@/api/userRequest'

const follow_hover = ref(false);

// 当前登录用户对当前界面的视频的点赞状态以及收藏状态和对视频作者的关注状态
const status = reactive({
  follow: false,
  likes: false,
  favor: false,
})

// script setup
const hoverEnter = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (target) target.style.transform = 'scale(1.1)';
}

const hoverLeave = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (target) target.style.transform = 'scale(1)';
}

// 视频 DOM 元素引用
const videoPlayer = ref<HTMLVideoElement | null>(null);
// video.js 播放器实例
let player: any = null;

const pinia = useStore();

// 分辨率数据
const resolutionPath = ref<Record<string, string> | null>(null);
const currentResolution = ref<string>("master");

// 倍速相关
const speedOptions = [0.5, 1, 1.25, 1.5, 2];
const currentSpeed = ref<number>(1);

// 当前视频信息
const currentVideoInfo = ref<any>(null);

const route = useRoute();
const currentVideoId = route.query.videoId;

const showControls = ref(false);

// 当前视频评论总数
const commentTotal = ref(0);
const commentPageSize = ref(10);
const commentPageNo = ref(1);

const changeCommentPage = (pageNo: number) => {
  commentPageNo.value = pageNo;
  getCommentList(currentVideoId, pageNo, commentPageSize.value)
}

/**
 * 查询指定用户的关注状态
 * @param sourceId 源用户id
 * @param targetId 目标用户id
 */
const queryFollowStatus = (sourceId: any, targetId: any) => {
  console.log("???");

  queryUserFollowStatus(sourceId, targetId).then((resp) => {
    if (resp.data.status === 200) {
      status.follow = resp.data.data.status;
    }
  })
}


/**
 * 关注用户
 * @param targetId 目标用户id
 */
const follow = (targetId: any) => {
  followUser(targetId).then((resp) => {
    if (resp.data.status === 200) {
      status.follow = resp.data.data.status;
    }
  })
}

/**
 * 取消关注用户
 * @param targetId 目标用户id
 */
const cancelFollow = (targetId: any) => {
  cancelFollowUser(targetId).then((resp) => {
    if (resp.data.status === 200) {
      status.follow = resp.data.data.status;
    }
  })
}

/**
 * 评论功能开始位置
 */
import emoji from "@/assets/static/emoji/emoji";
import type {
  CommentReplyPageApi,
  CommentSubmitApi,
  ConfigApi,
  CommentApi,
} from "undraw-ui";
import { ElMessage } from "element-plus";
import {
  getVideoCommentPageList,
  sendVideoComment,
  sendVideoReply,
  getVideoReplyPageList
} from "@/api/commentApi";

// 配置项
const config = reactive<ConfigApi>({
  user: {
    id: pinia.currentUser?.id!,
    username: pinia.currentUser?.nickname!,
    avatar: pinia.currentUser?.avatar!,
  }, // 当前用户信息
  emoji: emoji, // 表情包数据
  comments: [], // 评论数据
  relativeTime: true, // 开启人性化时间
  page: true, // 开启分页
  show: {
    likes: false,
    level: false,
    address: true
  },
});

// 提交评论事件
const submit = async ({ content, parentId, finish }: CommentSubmitApi) => {
  try {
    if (parentId === null) {
      // 提交一级评论
      const res = await sendVideoComment(content, currentVideoId)
      if (res.data.status === 200) {
        ElMessage.success("提交成功")
        // 刷新评论列表
        await getCommentList(currentVideoId, 1, 10)
        // 调用 finish 通知组件更新（可选）
        finish && finish()
      } else {
        ElMessage.error(res.data.message || "提交失败")
      }
    } else {
      // 提交回复
      const res = await sendVideoReply(content, parentId)
      if (res.data.status === 200) {
        ElMessage.success("提交成功")
        // 刷新评论列表
        await getCommentList(currentVideoId, 1, 10)
        finish && finish()
      } else {
        ElMessage.error(res.data.message || "提交失败")
      }
    }
  } catch (error) {
    console.error("提交评论失败:", error)
    ElMessage.error("网络异常，提交失败")
  }
}

// 获取评论列表
const getCommentList = (
  vid: any,
  pageNo: number,
  pageSize: number
) => {
  getVideoCommentPageList(
    vid,
    pageNo,
    pageSize,
    false,
    false,
    false,
    false
  ).then((resp) => {
    if (resp.data.status === 200) {
      const rawList = resp.data.data.data || [];
      config.comments = rawList;
      commentTotal.value = resp.data.data.total;
    }
  });
};

// 点赞按钮事件
const like = (id: string, finish: () => void) => {
  console.log("点赞: " + id);
  setTimeout(() => {
    finish();
  }, 200);
};

// 回复分页
const replyPage = ({ parentId, current, size, finish }: CommentReplyPageApi) => {
  getVideoReplyPageList(parentId, current, size).then((resp) => {
    if (resp.data.status == 200) {
      finish({
        total: resp.data.data.total,
        list: resp.data.data.list
      })
    }
  })
};

/**
 * 评论功能结束位置
 */


/**
 * 获取界面的状态信息
 */
const getStatus = () => {
  getVideoLikeAndFavorStatus(route.query.videoId, pinia.currentUser?.id).then((resp) => {
    if (resp.data.status == 200) {
      status.likes = resp.data.data.likes;
      status.favor = resp.data.data.favor;
    }
  })
}

/**
 * 给当前视频点赞
 */
const likeBtnClick = () => {
  likeVideo(route.query.videoId).then((resp) => {
    if (resp.data.status == 200) {
      status.likes = resp.data.data.likes;
      status.favor = resp.data.data.favor;
      if (currentVideoInfo?.value) {
        currentVideoInfo.value.likes = (currentVideoInfo.value.likes || 0) + 1;
      }
    }
  })
}

/**
 * 给当前视频取消点赞
 */
const cancelLikeBtnClick = () => {
  cancelLikeVideo(route.query.videoId).then((resp) => {
    if (resp.data.status == 200) {
      status.likes = resp.data.data.likes;
      status.favor = resp.data.data.favor;
      if (currentVideoInfo?.value) {
        currentVideoInfo.value.likes = (currentVideoInfo.value.likes || 1) - 1;
      }
    }
  })
}

const favorBtnClick = () => {
  favorVideo(route.query.videoId).then((resp) => {
    if (resp.data.status == 200) {
      status.likes = resp.data.data.likes;
      status.favor = resp.data.data.favor;
      if (currentVideoInfo?.value) {
        currentVideoInfo.value.favorite = (currentVideoInfo.value.favorite || 0) + 1;
      }
    }
  })
}

const cancelFavorBtnClick = () => {
  cancelFavorVideo(route.query.videoId).then((resp) => {
    if (resp.data.status == 200) {
      status.likes = resp.data.data.likes;
      status.favor = resp.data.data.favor;
      if (currentVideoInfo?.value) {
        currentVideoInfo.value.favorite = (currentVideoInfo.value.favorite || 1) - 1
      }
    }
  })
}


/**
 * 更新播放器播放源
 */
const updateSource = (src: string) => {
  if (!player || !src) return;

  const currentTime = player.currentTime ? player.currentTime() : 0;
  const wasPlaying = player.paused ? !player.paused() : false;

  player.pause();
  player.src({ src, type: "application/x-mpegURL" });

  player.one("loadedmetadata", () => {
    try {
      player.currentTime(currentTime);
    } catch { }
    if (wasPlaying) {
      setTimeout(() => {
        player.play();
      }, 100);
    }
  });
};

/**
 * 初始化播放器
 */
const initPlayer = (src: string) => {
  if (!videoPlayer.value) return;

  if (!player) {
    player = videojs(videoPlayer.value, {
      sources: [{ src, type: "application/x-mpegURL" }],
      autoplay: false,
      controls: true,
      fluid: true,
    });

    player.ready(() => {
      player.playbackRate(currentSpeed.value);
    });
  } else {
    updateSource(src);
  }
};

/**
 * 切换分辨率
 */
const changeResolution = (key: string) => {
  if (!resolutionPath.value) return;
  const src = videoPlayerBaseUrl + resolutionPath.value[key];
  updateSource(src);
};

/**
 * 切换倍速
 */
const changePlaybackRate = (speed: number) => {
  if (!player) return;
  player.playbackRate(speed);
};

/**
 * 获取视频信息并初始化
 */
const getCurrentVideo = async () => {
  const videoId = Number(route.query.videoId);
  try {
    const resp = await getVideoById(videoId);
    if (resp.data.status === 200) {
      currentVideoInfo.value = resp.data.data;
      const resolutionJson: Record<string, string> = JSON.parse(
        currentVideoInfo.value.resolution
      );
      console.log(currentVideoInfo.value)
      resolutionPath.value = resolutionJson;
      if (resolutionJson.master) {
        currentResolution.value = "master";
        const videoSrc = videoPlayerBaseUrl + resolutionJson.master;
        initPlayer(videoSrc);
      }
    }
  } catch (error) {
    console.error("获取视频失败:", error);
  }
  queryFollowStatus(pinia.currentUser?.id, currentVideoInfo.value.userId)
};

onMounted(() => {
  getCurrentVideo();
  getCommentList(currentVideoId, 1, 10);
  getStatus();
});

onBeforeUnmount(() => {
  if (player) {
    player.dispose();
    player = null;
  }
});
</script>

<style scoped>
.video-container {
  max-width: 1200px;
  margin: 20px auto;
}

.video-wrapper {
  position: relative;
  margin-top: 100px;
}

.custom-controls {
  position: absolute;
  bottom: 50px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.custom-controls.show {
  opacity: 1;
}

.control-item select {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 14px;
}
</style>