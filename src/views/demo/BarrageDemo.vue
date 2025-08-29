<template>
  <div style="display: flex; justify-content: center;">
    <div class="video-container">
      <video
        ref="videoRef"
        id="videoPlayer"
        class="video-js vjs-default-skin"
        controls
        preload="auto"
        width="640"
        height="360"
      ></video>

      <div class="danmu-layer">
        <div
          v-for="(danmu, index) in danmuList"
          :key="danmu.id"
          class="danmu-item"
          :style="{
            top: danmu.top + 'px',
            color: danmu.color,
            fontSize: danmu.fontSize + 'px',
            transform: 'translateX(' + danmu.left + 'px)',
            transition: 'transform ' + danmu.duration + 's linear'
          }"
          @transitionend="removeDanmu(danmu.id)"
        >
          {{ danmu.content }}
        </div>
      </div>

      <div class="danmu-input">
        <input v-model="inputContent" placeholder="输入弹幕..." />
        <button @click="sendDanmu">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const videoRef = ref(null)
const inputContent = ref('')
const danmuList = reactive([])

const videoId = 1
const userId = 'u123'
const videoSrc =
  'http://192.168.2.4:11000/api/iic/v1/video/videos/d8316482-7d52-4f25-bd9a-154bd90b2c3e/v3/index.m3u8'

let ws
let player
let idCounter = 0

const laneCount = 10 // 弹幕轨道数
const lanes = Array(laneCount).fill(null) // 每条轨道存放最后一个弹幕的结束时间

onMounted(() => {
  player = videojs(videoRef.value, {
    autoplay: false,
    controls: true,
    preload: 'auto',
    fluid: false
  })

  player.src({
    src: videoSrc,
    type: 'application/x-mpegURL'
  })

  ws = new WebSocket('ws://192.168.2.4:11006/comment/socket/videoBarrage')

  ws.onopen = () => console.log('WebSocket 已连接')
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('收到弹幕数据:', data)
    if (Array.isArray(data)) data.forEach((d) => addDanmu(d))
    else addDanmu(data)
  }

  ws.onclose = () => console.log('WebSocket 已关闭')
})

onBeforeUnmount(() => {
  if (player) player.dispose()
  if (ws) ws.close()
})

// 分配轨道
function getAvailableLane(duration) {
  const now = Date.now()
  for (let i = 0; i < laneCount; i++) {
    if (!lanes[i] || lanes[i] < now) {
      lanes[i] = now + duration * 1000
      return i
    }
  }
  // 如果都被占用，随机返回一个
  const randomLane = Math.floor(Math.random() * laneCount)
  lanes[randomLane] = now + duration * 1000
  return randomLane
}

// 添加弹幕
function addDanmu(d) {
  const content = typeof d === 'string' ? d : d.content || ''
  if (!content) return

  const duration = 8 // 弹幕飞屏时间
  const lane = getAvailableLane(duration)
  const laneHeight = 360 / laneCount

  const danmu = {
    id: idCounter++,
    content,
    top: lane * laneHeight,
    color: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
    fontSize: 16 + Math.random() * 8,
    left: 640,
    duration
  }

  danmuList.push(danmu)

  setTimeout(() => {
    danmu.left = -danmu.content.length * 16 - 50
  }, 50)
}

// 移除弹幕
function removeDanmu(id) {
  const index = danmuList.findIndex(d => d.id === id)
  if (index !== -1) danmuList.splice(index, 1)
}

// 发送弹幕
function sendDanmu() {
  if (!inputContent.value) return

  const msg = {
    type: 'sendBarrage',
    videoId,
    userId,
    content: inputContent.value,
    timestamp: player.currentTime()
  }

  ws.send(JSON.stringify(msg))
  inputContent.value = ''

  addDanmu(msg)
}
</script>

<style scoped>
.video-container {
  position: relative;
  width: 640px;
}

.danmu-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 360px;
  pointer-events: none;
  overflow: hidden;
}

.danmu-item {
  position: absolute;
  white-space: nowrap;
  font-weight: bold;
}

.danmu-input {
  margin-top: 8px;
  display: flex;
}

.danmu-input input {
  flex: 1;
  padding: 4px 8px;
}

.danmu-input button {
  margin-left: 4px;
  padding: 4px 8px;
}
</style>