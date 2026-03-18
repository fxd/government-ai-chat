<template>
  <aside class="sidebar">
    <!-- AI政务问答标题 -->
    <div class="sidebar-header">
      <h2 class="sidebar-title">AI+政务问答</h2>
      <span class="beta-tag">试运行</span>
    </div>

    <!-- 新建对话按钮 -->
    <button class="new-chat-btn" @click="handleNewChat">
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
      新建对话
    </button>

    <!-- 高频办事 -->
    <div class="section">
      <h3 class="section-title">高频办事</h3>
      <div class="quick-actions">
        <button 
          v-for="item in quickActions" 
          :key="item.key"
          class="quick-action-btn"
          @click="handleQuickAction(item)"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="label">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- 个性卡片 -->
    <div class="section">
      <h3 class="section-title">个性卡片</h3>
      <div class="card-list">
        <div 
          v-for="card in personalCards" 
          :key="card.key"
          class="card-item"
          @click="handleCardClick(card)"
        >
          <span class="card-icon">{{ card.icon }}</span>
          <span class="card-label">{{ card.label }}</span>
        </div>
      </div>
    </div>

    <!-- 常见问题 -->
    <div class="section">
      <h3 class="section-title">常见问题</h3>
      <ul class="faq-list">
        <li 
          v-for="(question, index) in faqList" 
          :key="index"
          class="faq-item"
          @click="handleFaqClick(question)"
        >
          {{ question }}
        </li>
      </ul>
    </div>

    <!-- 历史对话 -->
    <div class="section history-section">
      <div class="history-header">
        <h3 class="section-title">历史对话</h3>
        <button 
          v-if="conversations.length > 0"
          class="clear-btn"
          @click="handleClearAll"
        >
          清空
        </button>
      </div>
      <div class="conversation-list">
        <div 
          v-for="conv in conversations" 
          :key="conv.id"
          :class="['conversation-item', { active: currentConversationId === conv.id }]"
          @click="handleSelectConversation(conv.id)"
        >
          <svg class="chat-icon" viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          <span class="conv-title">{{ conv.title }}</span>
          <button 
            class="delete-btn"
            @click.stop="handleDeleteConversation(conv.id)"
          >
            ×
          </button>
        </div>
        <div v-if="conversations.length === 0" class="empty-history">
          暂无历史对话
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useChatStore } from '@/stores/chat.js'

const emit = defineEmits(['close'])

const chatStore = useChatStore()
const { 
  conversations, 
  currentConversationId, 
  startNewChat, 
  loadConversation,
  deleteConversation,
  clearAllConversations,
  sendMessage 
} = chatStore

// 高频办事
const quickActions = [
  { key: 'pension', label: '养老保险', icon: '👴' },
  { key: 'fund', label: '公积金', icon: '🏠' },
  { key: 'card', label: '社保卡', icon: '💳' },
  { key: 'medical', label: '医疗保险', icon: '🏥' },
  { key: 'property', label: '不动产', icon: '🏢' },
  { key: 'passport', label: '护照', icon: '🛂' }
]

// 个性卡片
const personalCards = [
  { key: 'leader', label: '领导名片', icon: '👤' },
  { key: 'org', label: '机构名片', icon: '🏛️' },
  { key: 'data', label: '政府数据', icon: '📊' },
  { key: 'video', label: '视频影像', icon: '🎥' }
]

// 常见问题
const faqList = [
  '如何办理养老保险？',
  '公积金提取条件是什么？',
  '社保卡丢失怎么补办？',
  '医疗保险报销比例是多少？'
]

// 新建对话
const handleNewChat = () => {
  startNewChat()
  emit('close')
}

// 选择历史对话
const handleSelectConversation = (id) => {
  loadConversation(id)
  emit('close')
}

// 删除对话
const handleDeleteConversation = (id) => {
  if (confirm('确定要删除这条对话记录吗？')) {
    deleteConversation(id)
  }
}

// 清空所有对话
const handleClearAll = () => {
  if (confirm('确定要清空所有对话记录吗？此操作不可恢复。')) {
    clearAllConversations()
  }
}

// 快速办事点击
const handleQuickAction = (item) => {
  const questions = {
    pension: '我想了解养老保险的办理流程',
    fund: '公积金怎么提取？',
    card: '社保卡丢失了怎么补办？',
    medical: '医疗保险报销比例是多少？',
    property: '不动产证怎么办理？',
    passport: '护照办理需要什么材料？'
  }
  sendMessage(questions[item.key] || `我想了解${item.label}的相关信息`)
  emit('close')
}

// 卡片点击
const handleCardClick = (card) => {
  sendMessage(`我想查看${card.label}`)
  emit('close')
}

// FAQ点击
const handleFaqClick = (question) => {
  sendMessage(question)
  emit('close')
}
</script>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.sidebar-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.beta-tag {
  font-size: 12px;
  color: #1677ff;
  background: rgba(22, 119, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

.new-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px;
  padding: 12px;
  background: #1677ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #4096ff;
  }
}

.section {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 4px;
  background: #f5f7fa;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }

  .icon {
    font-size: 20px;
  }

  .label {
    font-size: 12px;
    color: #666;
  }
}

.card-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.card-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }

  .card-icon {
    font-size: 16px;
  }

  .card-label {
    font-size: 13px;
    color: #666;
  }
}

.faq-list {
  list-style: none;
}

.faq-item {
  padding: 10px 0;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.3s;

  &:hover {
    color: #1677ff;
  }

  &:last-child {
    border-bottom: none;
  }
}

.history-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .clear-btn {
    font-size: 12px;
    color: #999;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      color: #ff4d4f;
    }
  }
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 4px;

  &:hover {
    background: #f5f7fa;

    .delete-btn {
      opacity: 1;
    }
  }

  &.active {
    background: #e6f7ff;
  }

  .chat-icon {
    color: #999;
    flex-shrink: 0;
  }

  .conv-title {
    flex: 1;
    font-size: 13px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .delete-btn {
    opacity: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 16px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background: #ff4d4f;
      color: #fff;
    }
  }
}

.empty-history {
  text-align: center;
  padding: 20px;
  font-size: 13px;
  color: #999;
}
</style>
