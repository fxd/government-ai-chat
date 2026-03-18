<template>
  <div class="input-area">
    <div class="input-wrapper">
      <!-- 深度思考按钮 -->
      <button 
        :class="['thinking-btn', { active: isDeepThinking }]"
        @click="toggleDeepThinking"
        title="深度思考模式"
      >
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
        </svg>
        深度思考(R)
      </button>

      <!-- 输入框 -->
      <div class="input-box">
        <textarea
          ref="textareaRef"
          v-model="inputText"
          class="chat-input"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :disabled="disabled"
          @keydown.enter.prevent="handleEnter"
          @input="handleInput"
          rows="1"
        ></textarea>
        
        <!-- 字数统计 -->
        <span class="char-count" :class="{ 'near-limit': inputText.length > maxLength * 0.9 }">
          {{ inputText.length }}/{{ maxLength }}
        </span>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <!-- 语音输入 -->
        <button 
          class="action-btn voice-btn"
          :class="{ recording: isRecording }"
          @click="toggleVoiceInput"
          title="语音输入"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path fill="currentColor" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>

        <!-- 更多操作 -->
        <button class="action-btn more-btn" title="更多">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>

        <!-- 发送按钮 -->
        <button 
          :class="['send-btn', { active: canSend }]"
          :disabled="!canSend || disabled"
          @click="handleSend"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="input-footer">
      <span class="usage-hint">
        AI生成内容仅供参考，具体政策以官方文件为准
      </span>
    </div>

    <!-- 语音输入弹窗 -->
    <div v-if="isRecording" class="voice-modal" @click="stopVoiceInput">
      <div class="voice-content" @click.stop>
        <div class="voice-animation">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="voice-text">正在聆听...</p>
        <p class="voice-hint">点击任意位置停止</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '请输入您的问题，例如：如何办理养老保险？'
  },
  maxLength: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits(['send'])

const textareaRef = ref(null)
const inputText = ref('')
const isDeepThinking = ref(false)
const isRecording = ref(false)

// 是否可以发送
const canSend = computed(() => {
  return inputText.value.trim().length > 0 && !props.disabled
})

// 切换深度思考
const toggleDeepThinking = () => {
  isDeepThinking.value = !isDeepThinking.value
}

// 处理输入
const handleInput = () => {
  // 自动调整高度
  nextTick(() => {
    const textarea = textareaRef.value
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  })
}

// 处理回车键
const handleEnter = (e) => {
  if (!e.shiftKey) {
    handleSend()
  } else {
    // Shift+Enter 换行
    inputText.value += '\n'
    handleInput()
  }
}

// 发送消息
const handleSend = () => {
  if (!canSend.value) return

  const content = inputText.value.trim()
  emit('send', content)
  
  // 清空输入框
  inputText.value = ''
  
  // 重置高度
  nextTick(() => {
    const textarea = textareaRef.value
    if (textarea) {
      textarea.style.height = 'auto'
    }
  })
}

// 切换语音输入
const toggleVoiceInput = () => {
  if (isRecording.value) {
    stopVoiceInput()
  } else {
    startVoiceInput()
  }
}

// 开始语音输入
const startVoiceInput = () => {
  isRecording.value = true
  
  // 模拟语音输入（实际项目使用 Web Speech API）
  setTimeout(() => {
    if (isRecording.value) {
      inputText.value = '我想了解养老保险的办理流程'
      stopVoiceInput()
    }
  }, 3000)
}

// 停止语音输入
const stopVoiceInput = () => {
  isRecording.value = false
}
</script>

<style scoped lang="scss">
.input-area {
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 12px 20px 16px;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: #f5f7fa;
  border-radius: 12px;
  padding: 8px;
}

.thinking-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;

  &:hover {
    border-color: #1677ff;
    color: #1677ff;
  }

  &.active {
    background: #e6f7ff;
    border-color: #1677ff;
    color: #1677ff;
  }
}

.input-box {
  flex: 1;
  position: relative;
  min-width: 0;
}

.chat-input {
  width: 100%;
  min-height: 40px;
  max-height: 120px;
  padding: 10px 50px 10px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #1677ff;
  }

  &::placeholder {
    color: #999;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
}

.char-count {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 11px;
  color: #999;
  pointer-events: none;

  &.near-limit {
    color: #ff4d4f;
  }
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e8e8e8;
    color: #333;
  }

  &.recording {
    background: #ff4d4f;
    color: #fff;
    animation: pulse 1.5s infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.send-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d9d9d9;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: not-allowed;
  transition: all 0.3s;

  &.active {
    background: #1677ff;
    cursor: pointer;

    &:hover {
      background: #4096ff;
    }
  }
}

.input-footer {
  margin-top: 8px;
  text-align: center;
}

.usage-hint {
  font-size: 12px;
  color: #999;
}

// 语音输入弹窗
.voice-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.voice-content {
  background: #fff;
  border-radius: 16px;
  padding: 40px 60px;
  text-align: center;
}

.voice-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 40px;
  margin-bottom: 20px;

  span {
    width: 4px;
    background: #1677ff;
    border-radius: 2px;
    animation: sound 1s infinite ease-in-out;

    &:nth-child(1) { height: 20px; animation-delay: 0s; }
    &:nth-child(2) { height: 30px; animation-delay: 0.1s; }
    &:nth-child(3) { height: 40px; animation-delay: 0.2s; }
    &:nth-child(4) { height: 30px; animation-delay: 0.3s; }
    &:nth-child(5) { height: 20px; animation-delay: 0.4s; }
  }
}

@keyframes sound {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

.voice-text {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.voice-hint {
  font-size: 13px;
  color: #999;
}

// 移动端适配
@media (max-width: 768px) {
  .input-area {
    padding: 8px 12px 12px;
  }

  .thinking-btn {
    padding: 6px 8px;
    font-size: 12px;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  .chat-input {
    font-size: 13px;
  }

  .action-btn, .send-btn {
    width: 32px;
    height: 32px;
  }
}
</style>
