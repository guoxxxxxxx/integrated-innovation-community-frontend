<template>
  <div class="video-container">
    <div class="video-wrapper">
      <video
        ref="videoPlayer"
        class="video-js vjs-default-skin"
        controls
        preload="auto"
        width="800"
        height="450"
      ></video>

      <!-- 右下角控制面板 -->
      <div class="custom-controls">
        <!-- 分辨率切换 -->
        <div class="control-item">
          <select v-model="currentResolution" @change="changeResolution(currentResolution)">
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
          <select v-model="currentSpeed" @change="changePlaybackRate(currentSpeed)">
            <option v-for="rate in speedOptions" :key="rate" :value="rate">
              {{ rate }}x
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { videoPlayerBaseUrl, getVideoById } from '@/api/videoApi'
import { useRoute } from 'vue-router'

// 视频 DOM 元素引用
const videoPlayer = ref<HTMLVideoElement | null>(null)
// video.js 播放器实例
let player: any = null

// 分辨率数据
const resolutionPath = ref<Record<string, string> | null>(null)
const currentResolution = ref<string>('master')

// 倍速相关
const speedOptions = [0.5, 1, 1.25, 1.5, 2]
const currentSpeed = ref<number>(1)

// 当前视频信息
const currentVideoInfo = ref<any>(null)

const route = useRoute()

/**
 * 更新播放器播放源（不销毁播放器）
 */
const updateSource = (src: string) => {
  if (!player || !src) return

  const currentTime = player.currentTime ? player.currentTime() : 0
  const wasPlaying = player.paused ? !player.paused() : false

  player.pause()
  player.src({ src, type: 'application/x-mpegURL' })

  player.one('loadedmetadata', () => {
    try { player.currentTime(currentTime) } catch {}
    if (wasPlaying) {
      setTimeout(() => { player.play() }, 100)
    }
  })
}

/**
 * 初始化播放器（只在第一次调用）
 */
const initPlayer = (src: string) => {
  if (!videoPlayer.value) return

  if (!player) {
    player = videojs(videoPlayer.value, {
      sources: [{ src, type: 'application/x-mpegURL' }],
      autoplay: false,
      controls: true,
      fluid: true
    })

    player.ready(() => {
      player.playbackRate(currentSpeed.value)
    })
  } else {
    updateSource(src)
  }
}

/**
 * 切换分辨率
 */
const changeResolution = (key: string) => {
  if (!resolutionPath.value) return
  const src = videoPlayerBaseUrl + resolutionPath.value[key]
  updateSource(src)
}

/**
 * 切换倍速
 */
const changePlaybackRate = (speed: number) => {
  if (!player) return
  player.playbackRate(speed)
}

/**
 * 获取视频信息并初始化
 */
const getCurrentVideo = async () => {
  const videoId = Number(route.query.videoId)
  try {
    const resp = await getVideoById(videoId)
    if (resp.data.status === 200) {
      currentVideoInfo.value = resp.data.data
      const resolutionJson: Record<string, string> = JSON.parse(
        currentVideoInfo.value.resolution
      )
      resolutionPath.value = resolutionJson
      if (resolutionJson.master) {
        currentResolution.value = 'master'
        const videoSrc = videoPlayerBaseUrl + resolutionJson.master
        initPlayer(videoSrc)
      }
    }
  } catch (error) {
    console.error('获取视频失败:', error)
  }
}

onMounted(() => {
  getCurrentVideo()
})

onBeforeUnmount(() => {
  if (player) {
    player.dispose()
    player = null
  }
})
</script>

<style scoped>
.video-container {
  max-width: 900px;
  margin: 20px auto;
}

.video-wrapper {
  position: relative;
}

/* 自定义控制栏样式 */
.custom-controls {
  position: absolute;
  bottom: 50px; /* 离底部的距离，可调节 */
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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