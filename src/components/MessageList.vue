<template>
  <div class="message-list">
    <div 
      v-for="message in messages" 
      :key="message.id"
      :class="['message-item', message.role]"
    >
      <!-- AI头像 -->
      <div v-if="message.role === 'assistant'" class="avatar ai-avatar">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      </div>

      <!-- 消息内容 -->
      <div class="message-content">
        <div 
          class="message-bubble"
          :class="{ 'error': message.isError }"
        >
          <!-- 用户消息直接显示 -->
          <template v-if="message.role === 'user'">
            {{ message.content }}
          </template>
          
          <!-- AI消息使用Markdown渲染 -->
          <template v-else>
            <div class="markdown-body" v-html="renderMarkdown(message.content)"></div>
          </template>
        </div>
        <div class="message-time">{{ formatTime(message.timestamp) }}</div>
      </div>

      <!-- 用户头像 -->
      <div v-if="message.role === 'user'" class="avatar user-avatar">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="#fff" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="message-item assistant">
      <div class="avatar ai-avatar">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      </div>
      <div class="message-content">
        <div class="message-bubble loading">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="loading-text">AI正在思考中...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { renderMarkdown } from '@/utils/markdown.js'

defineProps({
  messages: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style scoped lang="scss">
.message-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &.user {
    flex-direction: row-reverse;
  }
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-avatar {
  background: linear-gradient(135deg, #1677ff 0%, #4096ff 100%);
}

.user-avatar {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 70%;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;

  &.loading {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &.error {
    background: #fff2f0;
    border: 1px solid #ffccc7;
    color: #ff4d4f;
  }
}

.message-item.assistant .message-bubble {
  background: #e6f7ff;
  color: #333;
  border-top-left-radius: 4px;
}

.message-item.user .message-bubble {
  background: #fff;
  color: #333;
  border: 1px solid #e8e8e8;
  border-top-right-radius: 4px;
}

.message-time {
  font-size: 12px;
  color: #999;
  padding: 0 4px;
}

.message-item.user .message-time {
  text-align: right;
}

// 加载动画
.loading-dots {
  display: flex;
  gap: 4px;

  span {
    width: 6px;
    height: 6px;
    background: #1677ff;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.loading-text {
  font-size: 13px;
  color: #666;
}

// Markdown样式
.markdown-body {
  :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
    margin: 16px 0 8px;
    font-weight: bold;
  }

  :deep(h1) { font-size: 18px; }
  :deep(h2) { font-size: 16px; }
  :deep(h3) { font-size: 14px; }

  :deep(p) {
    margin: 8px 0;
  }

  :deep(ul), :deep(ol) {
    margin: 8px 0;
    padding-left: 20px;
  }

  :deep(li) {
    margin: 4px 0;
  }

  :deep(code) {
    background: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 13px;
  }

  :deep(pre) {
    background: #f5f7fa;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 8px 0;

    code {
      background: none;
      padding: 0;
    }
  }

  :deep(a) {
    color: #1677ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(strong) {
    font-weight: bold;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;

    th, td {
      border: 1px solid #e8e8e8;
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background: #f5f7fa;
      font-weight: bold;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .message-content {
    max-width: 80%;
  }

  .message-bubble {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
