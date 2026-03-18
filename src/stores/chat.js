import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendChatMessage, getChatHistory, saveChatHistory } from '@/api/chat.js'

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref([])
  const isLoading = ref(false)
  const currentConversationId = ref(null)
  const conversations = ref([])
  const knowledgeId = ref(1) // 默认知识库ID

  // Getters
  const hasMessages = computed(() => messages.value.length > 0)
  
  const currentConversation = computed(() => {
    return conversations.value.find(c => c.id === currentConversationId.value)
  })

  // Actions
  /**
   * 发送消息
   * @param {string} content - 消息内容
   */
  const sendMessage = async (content) => {
    console.log('[ChatStore] sendMessage called:', content)
    if (!content.trim() || isLoading.value) {
      console.log('[ChatStore] blocked: empty content or isLoading')
      return
    }

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    }
    messages.value.push(userMessage)
    console.log('[ChatStore] user message added:', userMessage)

    // 创建新对话（如果是第一条消息）
    if (messages.value.length === 1) {
      createConversation(content.trim().slice(0, 20) + '...')
    }

    isLoading.value = true

    try {
      // 准备消息历史
      const messageHistory = messages.value.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      console.log('[ChatStore] calling API with:', { knowledgeId: knowledgeId.value, messageHistory })

      // 调用API
      const response = await sendChatMessage(knowledgeId.value, messageHistory)
      console.log('[ChatStore] API response:', response)

      if (response.response_code === 200 && response.message) {
        // 获取最后一条AI回复
        const aiResponse = response.message[response.message.length - 1]
        
        // 添加AI消息
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date().toISOString()
        }
        messages.value.push(aiMessage)
        console.log('[ChatStore] AI message added:', aiMessage)

        // 保存对话
        saveCurrentConversation()
      } else {
        throw new Error(response.response_msg || '请求失败')
      }
    } catch (error) {
      console.error('[ChatStore] send message failed:', error)
      
      // 添加错误消息
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '抱歉，服务暂时不可用，请稍后重试。错误: ' + error.message,
        timestamp: new Date().toISOString(),
        isError: true
      }
      messages.value.push(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 创建新对话
   * @param {string} title - 对话标题
   */
  const createConversation = (title) => {
    const conversation = {
      id: Date.now().toString(),
      title: title || '新对话',
      timestamp: new Date().toISOString(),
      messages: []
    }
    conversations.value.unshift(conversation)
    currentConversationId.value = conversation.id
    return conversation
  }

  /**
   * 保存当前对话
   */
  const saveCurrentConversation = () => {
    if (!currentConversationId.value) return

    const conversation = conversations.value.find(c => c.id === currentConversationId.value)
    if (conversation) {
      conversation.messages = [...messages.value]
      conversation.timestamp = new Date().toISOString()
      
      // 保存到本地存储
      localStorage.setItem('conversations', JSON.stringify(conversations.value))
    }
  }

  /**
   * 加载对话列表
   */
  const loadConversations = () => {
    const saved = localStorage.getItem('conversations')
    if (saved) {
      conversations.value = JSON.parse(saved)
    }
  }

  /**
   * 加载指定对话
   * @param {string} conversationId - 对话ID
   */
  const loadConversation = (conversationId) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      currentConversationId.value = conversationId
      messages.value = [...conversation.messages]
    }
  }

  /**
   * 新建对话
   */
  const startNewChat = () => {
    messages.value = []
    currentConversationId.value = null
  }

  /**
   * 删除对话
   * @param {string} conversationId - 对话ID
   */
  const deleteConversation = (conversationId) => {
    const index = conversations.value.findIndex(c => c.id === conversationId)
    if (index > -1) {
      conversations.value.splice(index, 1)
      localStorage.setItem('conversations', JSON.stringify(conversations.value))
      
      // 如果删除的是当前对话，清空消息
      if (currentConversationId.value === conversationId) {
        startNewChat()
      }
    }
  }

  /**
   * 清空所有对话
   */
  const clearAllConversations = () => {
    conversations.value = []
    localStorage.removeItem('conversations')
    startNewChat()
  }

  /**
   * 重新生成回复
   * @param {number} messageId - 消息ID
   */
  const regenerateResponse = async (messageId) => {
    // 找到对应的用户消息
    const messageIndex = messages.value.findIndex(m => m.id === messageId)
    if (messageIndex === -1) return

    // 删除AI回复及之后的消息
    messages.value = messages.value.slice(0, messageIndex + 1)

    // 重新发送
    const userMessage = messages.value[messageIndex]
    await sendMessage(userMessage.content)
  }

  return {
    // State
    messages,
    isLoading,
    currentConversationId,
    conversations,
    knowledgeId,
    // Getters
    hasMessages,
    currentConversation,
    // Actions
    sendMessage,
    createConversation,
    loadConversations,
    loadConversation,
    startNewChat,
    deleteConversation,
    clearAllConversations,
    regenerateResponse
  }
})
