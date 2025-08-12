<template>
    <div class="comment-section">
      <!-- 新评论输入 -->
      <div class="comment-input">
        <img class="avatar" :src="userAvatar" alt="用户头像" />
        <textarea
          v-model="newComment"
          placeholder="友善交流，理性发言..."
          @keydown.enter.prevent="submitComment"
        ></textarea>
        <button class="submit-btn" @click="submitComment">发表评论</button>
      </div>
  
      <div class="comment-count">{{ comments.length }} 条评论</div>
  
      <!-- 评论列表 -->
      <div class="comment-list">
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @reply="handleReply"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue'
  
  interface Comment {
    id: number
    username: string
    avatar: string
    content: string
    time: string
    likes: number
    replies: Comment[]
  }
  
  const userAvatar = 'https://i.pravatar.cc/40?img=1'
  
  const comments = ref<Comment[]>([
    {
      id: 1,
      username: '小明',
      avatar: 'https://i.pravatar.cc/40?img=2',
      content: '这个视频太棒了！👍',
      time: '2 小时前',
      likes: 5,
      replies: [
        {
          id: 2,
          username: '阿花',
          avatar: 'https://i.pravatar.cc/40?img=3',
          content: '同感，学到了很多！',
          time: '1 小时前',
          likes: 1,
          replies: []
        }
      ]
    }
  ])
  
  const newComment = ref('')
  
  // 发布一级评论
  const submitComment = () => {
    if (!newComment.value.trim()) return
    comments.value.unshift({
      id: Date.now(),
      username: '我',
      avatar: userAvatar,
      content: newComment.value.trim(),
      time: '刚刚',
      likes: 0,
      replies: []
    })
    newComment.value = ''
  }
  
  // 处理回复
  const handleReply = (parentId: number, content: string) => {
    const addReply = (list: Comment[]): boolean => {
      for (const c of list) {
        if (c.id === parentId) {
          c.replies.unshift({
            id: Date.now(),
            username: '我',
            avatar: userAvatar,
            content,
            time: '刚刚',
            likes: 0,
            replies: []
          })
          return true
        }
        if (addReply(c.replies)) return true
      }
      return false
    }
    addReply(comments.value)
  }
  
  /**
   * 递归组件 CommentItem
   */
  const CommentItem = {
    props: {
      comment: {
        type: Object as () => Comment,
        required: true
      }
    },
    emits: ['reply'],
    setup(props: any, { emit }: any) {
      const showReply = ref(false)
      const replyContent = ref('')
  
      const toggleReplyBox = () => {
        showReply.value = !showReply.value
      }
      const submitReply = () => {
        if (!replyContent.value.trim()) return
        emit('reply', props.comment.id, replyContent.value.trim())
        replyContent.value = ''
        showReply.value = false
      }
  
      return {
        showReply,
        replyContent,
        toggleReplyBox,
        submitReply
      }
    },
    template: `
    <div class="comment-item">
      <img class="avatar" :src="comment.avatar" alt="头像" />
      <div class="comment-body">
        <div class="comment-header">
          <span class="username">{{ comment.username }}</span>
          <span class="time">{{ comment.time }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        <div class="comment-actions">
          <span class="action-btn">👍 {{ comment.likes }}</span>
          <span class="action-btn" @click="toggleReplyBox">回复</span>
        </div>
  
        <div v-if="showReply" class="reply-box">
          <textarea v-model="replyContent" placeholder="写下你的回复..."></textarea>
          <button class="submit-btn" @click="submitReply">发送</button>
        </div>
  
        <div class="replies" v-if="comment.replies.length > 0">
          <CommentItem
            v-for="child in comment.replies"
            :key="child.id"
            :comment="child"
            @reply="$emit('reply', $event[0], $event[1])"
          />
        </div>
      </div>
    </div>
    `
  }
  </script>
  
  <style scoped>
  .comment-section {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji";
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  }
  .comment-input {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  textarea {
    flex: 1;
    min-height: 60px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    font-size: 14px;
    resize: vertical;
    transition: border-color 0.3s;
  }
  textarea:focus {
    outline: none;
    border-color: #00a1d6;
  }
  .submit-btn {
    padding: 6px 14px;
    background: #00a1d6;
    border: none;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    user-select: none;
    transition: background-color 0.3s;
  }
  .submit-btn:hover {
    background: #008bbd;
  }
  .comment-count {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
  }
  .comment-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .comment-body {
    flex: 1;
  }
  .comment-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
  .username {
    font-weight: 600;
    color: #333;
  }
  .time {
    color: #999;
    font-size: 12px;
  }
  .comment-content {
    margin: 8px 0;
    font-size: 15px;
    line-height: 1.5;
    color: #444;
    white-space: pre-wrap;
  }
  .comment-actions {
    display: flex;
    gap: 24px;
    font-size: 13px;
    color: #666;
  }
  .action-btn {
    cursor: pointer;
    user-select: none;
    transition: color 0.3s;
  }
  .action-btn:hover {
    color: #00a1d6;
  }
  .reply-box {
    margin-top: 8px;
  }
  .reply-box textarea {
    width: 100%;
    min-height: 50px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 14px;
    resize: vertical;
    transition: border-color 0.3s;
  }
  .reply-box textarea:focus {
    outline: none;
    border-color: #00a1d6;
  }
  .replies {
    margin-left: 48px;
    margin-top: 12px;
    border-left: 2px solid #f0f0f0;
    padding-left: 12px;
  }
  </style>