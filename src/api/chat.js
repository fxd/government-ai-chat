import axios from 'axios'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('[API Request]', config.method.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.config.url, response.data)
    return response.data
  },
  (error) => {
    console.error('[API Error]', error.message, error.response?.data)
    return Promise.reject(error)
  }
)

/**
 * 发送对话消息
 * @param {number} knowledgeId - 知识库ID
 * @param {Array} messages - 消息列表 [{role: 'user'|'assistant', content: string}]
 * @returns {Promise}
 */
export const sendChatMessage = async (knowledgeId, messages) => {
  const response = await apiClient.post('/chat', {
    knowledge_id: knowledgeId,
    message: messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'system',
      content: msg.content
    }))
  })
  return response
}

/**
 * 获取知识库列表
 * @returns {Promise}
 */
export const getKnowledgeBases = async () => {
  // 暂时返回模拟数据，实际应该调用后端接口
  return {
    response_code: 200,
    data: [
      { knowledge_id: 1, title: '黄山市政务知识库', category: '政务' }
    ]
  }
}

/**
 * 获取历史对话列表
 * @returns {Promise}
 */
export const getChatHistory = async () => {
  // 从本地存储获取
  const history = localStorage.getItem('chat_history')
  return history ? JSON.parse(history) : []
}

/**
 * 保存对话历史
 * @param {Array} history - 对话历史列表
 */
export const saveChatHistory = async (history) => {
  localStorage.setItem('chat_history', JSON.stringify(history))
}

export default apiClient
