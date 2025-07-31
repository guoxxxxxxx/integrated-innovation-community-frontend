<template>
  <div class="top-bar">
    <div class="logo">
      <h1>融合创新社区</h1>
    </div>
    <div class="nav-buttons">
      <a-input-search placeholder="搜索..." style="width: 200px; margin-right: 12px" :allowClear="true" enter-button />
      <a-button type="text" style="margin-right: -12px" @click="enterDemo">进入demo</a-button>
      <a-button type="text" style="margin-right: -12px">首页</a-button>
      <a-button type="text" style="margin-right: -12px">论坛</a-button>
      <a-button type="text" style="margin-right: -12px" @click="openAuthorBlog">作者的博客</a-button>
      <div class="message-dropdown">
        <a-button type="text">消息</a-button>
        <div class="dropdown-content">
          <div class="message-item">
            <a-button type="text" block>回复我的</a-button>
            <span class="unread-dot" v-if="messageUnreadStatus.replies"></span>
          </div>
          <div class="message-item">
            <a-button type="text" block>@我的</a-button>
            <span class="unread-dot" v-if="messageUnreadStatus.mentions"></span>
          </div>
          <div class="message-item">
            <a-button type="text" block>收到的赞</a-button>
            <span class="unread-dot" v-if="messageUnreadStatus.likes"></span>
          </div>
          <div class="message-item">
            <a-button type="text" block>系统消息</a-button>
            <span class="unread-dot" v-if="messageUnreadStatus.system"></span>
          </div>
        </div>
      </div>
      <div class="avatar-dropdown">
        <a-avatar :size="32" style="cursor: pointer" :src="store.currentUser?.avatar">
          <template #icon><user-outlined /></template>
        </a-avatar>
        <div class="avatar-dropdown-content" v-if="store.isLogin">
          <div class="user-nickname text-center">{{ store.currentUser?.nickname || '未登录用户' }}</div>
          <div class="user-stats">
            <a-button type="text" class="stat-item">
              <div class="stat-num">{{ currentUser?.followingCount || 0 }}</div>
              <div class="stat-label">关注</div>
            </a-button>
            <a-button type="text" class="stat-item">
              <div class="stat-num">{{ currentUser?.followersCount || 0 }}</div>
              <div class="stat-label">粉丝</div>
            </a-button>
            <a-button type="text" class="stat-item">
              <div class="stat-num">{{ currentUser?.postsCount || 0 }}</div>
              <div class="stat-label">动态</div>
            </a-button>
          </div>
          <a-button type="text" block class="dropdown-btn">个人中心</a-button>
          <a-button type="text" block class="dropdown-btn">投稿管理</a-button>
          <div class="divider"></div>
          <a-button type="text" block class="dropdown-btn logout-btn" @click="logout">退出登录</a-button>
        </div>

        <div class="avatar-dropdown-content" v-if="!store.isLogin">
          <div class="login-prompt text-center">
            <p class="login-message">登录后你可以：</p>
            <div class="login-benefits">
              <span class="benefit">📺查看高清视频</span>
              <span style="border-left: 1px solid lightgray; height: 20px; margin: 0 8px;"></span>
              <span class="benefit">💬发表评论/点赞</span>
            </div>
            <div class="divider"></div>
            <a-button type="primary" block class="login-btn" @click="store.setShowLoginBox(true)">立即登录</a-button>
            <div class="divider"></div>
            <p class="register-prompt">还没有账号？<a href="#" class="register-link" @click="store.setShowRegisterBox(true)">点我注册</a></p>
          </div>
        </div>
      </div>
    </div>
    <LoginDiolague />
    <RegisterDiolague />
    <ResetDiolague />
  </div>
</template>

<script setup>
import { Button as AButton, Input, Avatar as AAvatar } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { reactive, onMounted } from 'vue';
import { useStore } from '@/stores';
import LoginDiolague from '@/components/dialogue/LoginDialogue.vue';
import RegisterDiolague from '@/components/dialogue/RegisterDialogue.vue';
import ResetDiolague from '@/components/dialogue/ResetDialogue.vue';
import { queryUserInfoByToken } from '@/api/userRequest';
import { topSuccessTips } from '@/utils';
import { ElMessageBox } from 'element-plus';
import router from '@/router';
const store = useStore()

const { Search: AInputSearch } = Input;

// 未读消息状态
const messageUnreadStatus = reactive({
  replies: true,
  mentions: true,
  likes: false,
  system: false
})

// 打开作者的博客
const openAuthorBlog = () => {
  window.open('http://flashpipi.cn', '_blank')
}

// 进入demo界面
const enterDemo = () => {
  router.push('/demo')
}

// 查询当前用户的信息
const getCurrentUserInfo = () => {
  queryUserInfoByToken(store.currentToken).then(res => {
    console.log(res.data)
    store.currentUser = res.data.data
  })
}

// 退出登录
const logout = () => {
  // 显示确认对话框
  ElMessageBox.confirm('确定退出吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.currentToken = '';
    store.isLogin = false;
    store.currentUser = {};
    topSuccessTips('退出登录成功');
  }).catch(() => {
    // 取消操作
  });
}

onMounted(() => {
  // 如果当前用户已登录，则查询当前用户的信息
  if (store.isLogin) {
    getCurrentUserInfo()
  }
})
</script>

<style scoped>
.top-bar {
  width: 100%;
  height: 64px;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #1890ff;
}

.nav-buttons {
  display: flex;
  gap: 16px;
}

/* 消息下拉菜单样式 */
.message-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fff;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 4px 0;
  z-index: 1000;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.message-dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content .ant-btn {
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  margin: 0;
}

.dropdown-content .ant-btn:hover {
  background-color: rgba(24, 144, 255, 0.15);
}

/* 未读红点样式 */
.message-item {
  position: relative;
}

.unread-dot {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: #ff4d4f;
  border-radius: 50%;
}

/* 登录提示样式 */
.login-prompt {
  padding: 16px;
}

.login-message {
  font-size: 14px;
  text-align: left;
}

.login-benefits {
  display: flex;
  justify-content: space-between;
  color: #1890ff;
  /* 和立即登录按钮相同的颜色 */
  font-size: 12px;
  /* 字体小一点 */
}

.benefit {
  margin-right: 10px;
  font-size: 12px;
}

/* 注册提示样式 */
.register-prompt {
  font-size: 12px;
  text-align: center;
}

.register-link {
  color: #1890ff;
  cursor: pointer;
}

/* 搜索框样式 */
.search-input {
  border-radius: 20px;
}

.search-input :deep(.ant-input) {
  border-radius: 20px 0 0 20px;
}

.search-input :deep(.ant-input-search-button) {
  border-radius: 0 20px 20px 0 !important;
  height: 32px;
}

.search-input :deep(.ant-input:focus),
.search-input :deep(.ant-input:hover) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 添加按钮悬浮效果 */
.nav-buttons :deep(.ant-btn) {
  transition: background-color 0.3s;
}

.nav-buttons :deep(.ant-btn:hover) {
  background-color: rgba(24, 144, 255, 0.15) !important;
}

/* 头像下拉菜单样式 */
.avatar-dropdown {
  position: relative;
  display: inline-block;
}

.avatar-dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #fff;
  min-width: 300px;
  /* 设置宽度大一点 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 16px;
  z-index: 1000;
  top: 100%;
}

.avatar-dropdown:hover .avatar-dropdown-content {
  display: block;
}

.text-center {
  text-align: center;
}

.user-nickname {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
  height: auto;
  padding: 4px 8px;
}

.stat-num {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.dropdown-btn {
  height: 36px;
  margin: 4px 0;
  text-align: left;
}

.divider {
  height: 1px;
  background-color: #e8e8e8;
  margin: 8px 0;
}

.logout-btn {
  color: #ff4d4f;
}

.logout-btn:hover {
  color: #ff7875 !important;
  background-color: rgba(255, 77, 79, 0.1) !important;
}

@media screen and (max-width: 768px) {
  .logo h1 {
    font-size: 1.2rem;
  }

  .nav-buttons {
    gap: 8px;
  }
}
</style>
