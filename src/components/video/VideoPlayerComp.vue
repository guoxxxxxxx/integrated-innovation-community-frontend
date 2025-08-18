<template>
  <div class="container" style="width: 100%;">
    <div class="video-container">
      <div
        class="video-wrapper"
        @mouseenter="showControls = true"
        @mouseleave="showControls = false"
      >
        <video
          ref="videoPlayer"
          class="video-js vjs-default-skin"
          controls
          preload="auto"
          width="1200"
          height="675"
        ></video>

        <!-- 右下角控制面板 -->
        <div class="custom-controls" :class="{ show: showControls }">
          <!-- 分辨率切换 -->
          <div class="control-item">
            <select
              v-model="currentResolution"
              @change="changeResolution(currentResolution)"
            >
              <option
                v-for="(path, key) in resolutionPath"
                :key="key"
                :value="key"
              >
                {{ key }}
              </option>
            </select>
          </div>

          <!-- 倍速切换 -->
          <div class="control-item">
            <select
              v-model="currentSpeed"
              @change="changePlaybackRate(currentSpeed)"
            >
              <option v-for="rate in speedOptions" :key="rate" :value="rate">
                {{ rate }}x
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="comment-container" style="width: 100%;">
      <div class="inner-container" style="width: 40%; margin: 0 auto;">
        <u-comment
          :config="config"
          @submit="submit"
          @reply-page="replyPage"
        >
        </u-comment>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, reactive } from "vue";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { videoPlayerBaseUrl, getVideoById } from "@/api/videoApi";
import { useRoute } from "vue-router";
import { useStore } from "@/stores";

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

/**
 * 评论功能开始位置
 */
import emoji from "@/assets/static/emoji/emoji";
import { UToast } from "undraw-ui";
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
  console.log("分页加载回复 parentId:", parentId);
  // TODO 可以请求后端接口加载分页回复
  finish({
    total: 0,
    list: [],
  });
};

/**
 * 评论功能结束位置
 */

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
    } catch {}
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
};

onMounted(() => {
  getCurrentVideo();
  getCommentList(currentVideoId, 1, 10);
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