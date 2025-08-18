<template>
  <div class="comment-list">
    <h3>评论区 ({{ comments.length }})</h3>

    <!-- 一级评论 -->
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <div class="comment-header">
        <strong>用户{{ comment.uid }}</strong>
        <span class="time">{{ formatTime(comment.createTime) }}</span>
      </div>
      <div class="comment-content" v-html="comment.content"></div>
      <div class="comment-meta">
        👍 {{ comment.likes || 0 }} · 来自 {{ comment.ipCity || comment.ipAddress || '未知' }}
      </div>

      <!-- 二级评论 -->
      <div class="reply-list" v-if="comment.reply && comment.reply.length">
        <div
          v-for="reply in comment.reply"
          :key="reply.id"
          class="reply"
        >
          <div class="reply-header">
            <strong>用户{{ reply.uid }}</strong>
            <span class="time">{{ formatTime(reply.createTime) }}</span>
          </div>
          <div class="reply-content" v-html="reply.content"></div>
          <div class="reply-meta">
            👍 {{ reply.likes || 0 }} · 来自 {{ reply.ipCity || reply.ipAddress || '未知' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getVideoCommentPageList } from "@/api/commentApi"  // 你之前写过的接口方法

const comments = ref<any[]>([])

const formatTime = (timeStr: string) => {
  const d = new Date(timeStr)
  return d.toLocaleString()
}

// 模拟加载评论
onMounted(() => {
  loadComments()
})

const loadComments = () => {
  getVideoCommentPageList(3, 1, 10, false, false, false, false).then((resp: any) => {
    if (resp.data.status === 200) {
      comments.value = resp.data.data.data
    }
  })
}
</script>

<style scoped>
.comment-list {
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
}
.comment {
  border-bottom: 1px solid #eee;
  padding: 0.5rem 0;
}
.comment-header,
.reply-header {
  font-size: 14px;
  color: #333;
  display: flex;
  justify-content: space-between;
}
.comment-content,
.reply-content {
  margin: 0.25rem 0;
  font-size: 15px;
}
.comment-meta,
.reply-meta {
  font-size: 12px;
  color: #666;
}
.reply-list {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  padding-left: 1rem;
  border-left: 2px solid #eee;
}
.reply {
  margin-bottom: 0.5rem;
}
.time {
  color: #999;
  font-size: 12px;
}
</style>