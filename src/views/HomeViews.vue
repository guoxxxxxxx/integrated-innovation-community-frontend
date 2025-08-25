<template>
  <div class="home-container">
    <!-- 视频分类导航 -->
    <div class="category-nav-wrapper">
      <div class="category-nav">
        <a-button v-for="category in categories" :key="category" type="text" class="category-btn"
          :class="{ active: currentCategory === category }" @click="currentCategory = category">
          {{ category }}
        </a-button>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; height: 450px;">
      <!-- 左侧轮播图 -->
      <div
        style="display: flex; justify-content: center; align-items: center; width: 50%; height: 100%; margin-top: 40px;">
        <el-carousel :interval="4000" arrow="always" style="width: 100%; height: 400px;">
          <el-carousel-item v-for="item in carouselItems" :key="item.id">
            <img :src="item.image" alt="轮播图" style="width: 100%; height: 100%; border-radius: 8px; object-fit: cover;">
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 右侧视频列表 -->
      <div class="video-grid" style="width: 45%;">
        <div class="video-card" v-for="i in videoList.slice(0, 4)" :key="i.id" style="width: 100%; margin-bottom: 20px;">
          <div class="video-thumbnail" @click="playVideo(i.id)">
            <img :src="imageBaseUrl + i.coverName" alt="视频缩略图">
            <span class="duration">{{ formatDuration(i.duration) }}</span>
          </div>
          <div class="video-info">
            <h3 class="video-title" @click="playVideo(i.id)">{{ i.title }}</h3>
            <div class="video-meta" style="width: 100%; display: flex; justify-content: space-between;">
              <div style="display: flex; align-items: center;">
                <el-avatar size="small" :src="i.user.avatar" />
                <span class="author">{{ i.user.nickname }}</span>
              </div>
              <span class="views">播放量: {{ i.viewCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频列表 -->
    <div class="video-grid" style="margin-top: 90px;">
      <div class="video-card" v-for="i in videoList.slice(4, 20)" :key="i.id">
          <div class="video-thumbnail" @click="playVideo(i.id)">
            <img :src="imageBaseUrl + i.coverName" alt="视频缩略图">
            <span class="duration">{{ formatDuration(i.duration) }}</span>
          </div>
          <div class="video-info">
            <h3 class="video-title" @click="playVideo(i.id)">{{ i.title }}</h3>
            <div class="video-meta" style="width: 100%; display: flex; justify-content: space-between;">
              <div style="display: flex; align-items: center;">
                <el-avatar size="small" :src="i.user.avatar" />
                <span class="author">{{ i.user.nickname }}</span>
              </div>
              <span class="views">播放量: {{ i.viewCount }}</span>
            </div>
          </div>
      </div>
    </div>

    <div style="display: flex; justify-content: center;">
      <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>

    <!-- 一键滚动到顶的按钮 -->
    <div class="scroll-to-top" @click="scrollToTop">
      <el-button type="primary" :icon="ArrowUp" class="scroll-button" style="font-size: 24px;"></el-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElPagination, ElCarousel, ElCarouselItem } from 'element-plus'
import { ArrowUp } from '@element-plus/icons-vue'
import type { VideoInfo } from '@/api/entity';
import { getPage } from '@/api/videoApi'
import type { QueryCondition } from '@/api/videoApi'
import { imageBaseUrl } from '@/api/graphApi'
import router from '@/router';

const currentCategory = ref('推荐')
const categories = ['推荐', '音乐', '游戏', '动画', '科技', '生活', '美食', '体育']

// 视频列表
const videoList = ref<VideoInfo[]>([])

// 视频列表查询条件
const queryCondition = ref<QueryCondition>({
  pageNo: 1,
  pageSize: 16,
})
// 向后端服务器请求视频列表
const getVideoList = () => {
  getPage(queryCondition.value).then(resp => {
    if (resp.data.status == 200) {
      videoList.value = resp.data.data.data
      console.log(videoList.value)
    }
  })
}

// 计算属性，将秒转化为HH:mm:ss的的格式
const formatDuration = (duration: string) => {
  const seconds = parseInt(duration)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)
  const remainingSeconds = seconds - hours * 3600 - minutes * 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 进入播放界面
const playVideo = (videoId: number) => {
  router.push({ path: '/videoPlayer', query: { videoId: videoId } })
}

// 进入界面加载数据
onMounted(() => {
  getVideoList()
})

const carouselItems = ref([
  { id: 1, image: 'https://img.btstu.cn/api/images/5cab0ac9e12f9.jpg' },
  { id: 2, image: 'https://img.btstu.cn/api/images/5cab0ac9e12f9.jpg' },
  { id: 3, image: 'https://img.btstu.cn/api/images/5cab0ac9e12f9.jpg' },
  { id: 4, image: 'https://img.btstu.cn/api/images/5cab0ac9e12f9.jpg' },
  { id: 5, image: 'https://img.btstu.cn/api/images/5cab0ac9e12f9.jpg' }
])

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto 0;
  /* 为顶部导航栏留出空间 */
  padding: 20px;
}

.category-nav-wrapper {
  top: 90px;
  /* 顶部导航栏的高度 */
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.category-nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 12px 20px;
}

.category-nav::-webkit-scrollbar {
  display: none;
}

.category-btn {
  font-size: 15px;
  padding: 6px 16px;
  border-radius: 16px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.category-btn:hover {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
}

.category-btn.active {
  color: white;
  background: #1890ff;
}

.category-btn.active:hover {
  color: white;
  background: #40a9ff;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  margin-top: 20px;
  /* 为固定定位的导航栏留出空间 */
}

.video-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.video-card:hover {
  transform: translateY(-4px);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
}

.video-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
}

.video-info {
  padding: 8px 4px;
}

.video-title {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;

  display: -webkit-box;            /* Flex-like的伸缩盒子 */
  -webkit-box-orient: vertical;    /* 垂直排列 */
  -webkit-line-clamp: 2;           /* 限制最多两行 */
  overflow: hidden;                /* 超出隐藏 */
  text-overflow: ellipsis;         /* 多余显示省略号 */
  word-break: break-word;          /* 避免长单词撑破 */
}

.video-meta {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 8px;
}

.pagination {
  text-align: center;
  margin-top: 32px;
  padding-bottom: 24px;
}

.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.scroll-button {
  background-color: rgba(211, 211, 211, 1);
  /* 不再透明的浅灰色 */
  border: 2px solid #c0c0c0;
  /* 边界颜色稍微深一点的灰色 */
  border-radius: 8px;
  /* 圆角 */
  width: 40px;
  /* 设置宽度 */
  height: 40px;
  /* 设置高度 */
}
</style>
