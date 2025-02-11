<template>
  <div class="home-container">
    <!-- 视频分类导航 -->
    <div class="category-nav-wrapper">
      <div class="category-nav">
        <a-button 
          v-for="category in categories" 
          :key="category"
          type="text"
          class="category-btn"
          :class="{ active: currentCategory === category }"
          @click="currentCategory = category"
        >
          {{ category }}
        </a-button>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; height: 450px;">
      <!-- 左侧轮播图 -->
      <div style="display: flex; justify-content: center; align-items: center; width: 50%; height: 100%; margin-top: 40px;">
        <el-carousel :interval="4000" arrow="always" style="width: 100%; height: 400px;">
          <el-carousel-item v-for="item in carouselItems" :key="item.id">
            <img :src="item.image" alt="轮播图" style="width: 100%; height: 100%; border-radius: 8px; object-fit: cover;">
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 右侧视频列表 -->
      <div class="video-grid" style="width: 45%;">
        <div class="video-card" v-for="i in 4" :key="i" style="width: 100%; margin-bottom: 20px;">
          <div class="video-thumbnail">
            <img src="/src/assets/default_avatar.png" alt="视频缩略图">
            <span class="duration">12:34</span>
          </div>
          <div class="video-info">
            <h3 class="video-title">示例视频标题{{ i }}</h3>
            <div class="video-meta">
              <span class="author">作者名称</span>
              <span class="views">1.2万次观看</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频列表 -->
    <div class="video-grid">
      <div class="video-card" v-for="i in 12" :key="i">
        <div class="video-thumbnail">
          <img src="/src/assets/default_avatar.png" alt="视频缩略图">
          <span class="duration">12:34</span>
        </div>
        <div class="video-info">
          <h3 class="video-title">示例视频标题{{ i }}</h3>
          <div class="video-meta">
            <span class="author">作者名称</span>
            <span class="views">1.2万次观看</span>
          </div>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: center;">
      <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>
    
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElPagination, ElCarousel, ElCarouselItem } from 'element-plus'

const currentCategory = ref('推荐')
const categories = ['推荐', '音乐', '游戏', '动画', '科技', '生活', '美食', '体育']

const carouselItems = ref([
  { id: 1, image: 'https://img.btstu.cn/api/images/5cab0ac9e12f9.jpg' },
  { id: 2, image: 'https://img.btstu.cn/api/images/5cab0ac9e12f9.jpg' },
  { id: 3, image: 'https://img.btstu.cn/api/images/5cab0ac9e12f9.jpg' },
  { id: 4, image: 'https://img.btstu.cn/api/images/5cab0ac9e12f9.jpg' },
  { id: 5, image: 'https://img.btstu.cn/api/images/5cab0ac9e12f9.jpg' }
])
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto 0; /* 为顶部导航栏留出空间 */
  padding: 20px;
}

.category-nav-wrapper {
  top: 90px; /* 顶部导航栏的高度 */
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
  margin-top: 20px; /* 为固定定位的导航栏留出空间 */
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
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
</style>
