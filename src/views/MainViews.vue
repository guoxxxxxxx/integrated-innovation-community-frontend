<template>
    <div>
      <!-- 回到顶部 -->
      <a-back-top style="right: 24px;bottom: 72px;">
        <a-button shape="circle" size="large">
          <template #icon>
            <up-outlined />
          </template>
        </a-button>
      </a-back-top>
  
      <div>
        <!-- 导航栏 -->
        <top-bar></top-bar>
        <!-- 主体 -->
        <router-view></router-view>
        <!-- 下部 -->
        <foot-bar></foot-bar>
      </div>
    </div>
  </template>
  
  <script setup>
  import TopBar from '@/components/common/TopBar.vue';
  import FootBar from '@/components/common/FootBar.vue';
  </script>