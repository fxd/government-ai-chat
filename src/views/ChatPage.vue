<template>
  <div class="chat-page">
    <!-- 移动端菜单按钮 -->
    <div class="mobile-menu-btn" @click="toggleSidebar">
      <span class="hamburger"></span>
    </div>

    <!-- 左侧边栏 -->
    <Sidebar 
      :class="['sidebar', { 'sidebar-open': isSidebarOpen }]"
      @close="isSidebarOpen = false"
    />

    <!-- 遮罩层 -->
    <div 
      v-if="isSidebarOpen" 
      class="sidebar-overlay"
      @click="isSidebarOpen = false"
    ></div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 头部 -->
      <Header />

      <!-- 对话区域 -->
      <div class="chat-container" ref="chatContainer">
        <!-- 欢迎页 -->
        <WelcomeCard v-if="!hasMessages" @select-question="handleSelectQuestion" />

        <!-- 消息列表 -->
        <MessageList 
          v-else
          :messages="messages"
          :is-loading="isLoading"
        />
      </div>

      <!-- 输入区域 -->
      <InputArea 
        @send="handleSend"
        :disabled="isLoading"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat.js'
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'
import WelcomeCard from '@/components/WelcomeCard.vue'
import MessageList from '@/components/MessageList.vue'
import InputArea from '@/components/InputArea.vue'

const chatStore = useChatStore()
// 使用 storeToRefs 保持响应性
const { messages, isLoading, hasMessages } = storeToRefs(chatStore)
// 方法可以直接解构
const { sendMessage, loadConversations } = chatStore

const chatContainer = ref(null)
const isSidebarOpen = ref(false)

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 处理发送消息
const handleSend = async (content) => {
  await sendMessage(content)
  scrollToBottom()
}

// 处理选择推荐问题
const handleSelectQuestion = (question) => {
  sendMessage(question)
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// 初始化
onMounted(() => {
  loadConversations()
})
</script>

<style scoped lang="scss">
.chat-page {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1000;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .hamburger {
    display: block;
    width: 20px;
    height: 2px;
    background: #333;
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 2px;
      background: #333;
      left: 0;
    }

    &::before {
      top: -6px;
    }

    &::after {
      top: 6px;
    }
  }
}

.sidebar {
  width: 280px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  z-index: 100;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f7fa;
}

// 移动端适配
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

    &.sidebar-open {
      transform: translateX(0);
    }
  }

  .sidebar-overlay {
    display: block;
  }

  .chat-container {
    padding: 16px;
    padding-top: 60px;
  }
}
</style>
