<template>
  <div class="welcome-card">
    <div class="welcome-content">
      <div class="ai-avatar">
        <svg viewBox="0 0 24 24" width="48" height="48">
          <path fill="#1677ff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      </div>
      <h2 class="welcome-title">您好，我是AI政务助手</h2>
      <p class="welcome-desc">
        我可以帮您解答黄山市政务相关问题，包括养老保险、公积金、社保卡、医疗保险等业务咨询。
      </p>
      <button class="refresh-btn" @click="refreshQuestions">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        换一换
      </button>
    </div>

    <div class="suggested-questions">
      <h3 class="questions-title">您可以问我：</h3>
      <div class="question-tags">
        <button 
          v-for="(question, index) in currentQuestions" 
          :key="index"
          class="question-tag"
          @click="selectQuestion(question)"
        >
          {{ question }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['select-question'])

// 推荐问题池
const questionPool = [
  '如何办理养老保险？',
  '公积金提取需要什么材料？',
  '社保卡丢失怎么补办？',
  '医疗保险报销比例是多少？',
  '不动产证办理流程是什么？',
  '护照办理需要多长时间？',
  '如何查询社保缴费记录？',
  '公积金贷款利率是多少？',
  '医保卡可以在外地使用吗？',
  '如何申请低保？',
  '居住证怎么办理？',
  '车辆年检需要准备什么？'
]

const currentIndex = ref(0)

// 当前显示的问题（每次显示4个）
const currentQuestions = computed(() => {
  const questions = []
  for (let i = 0; i < 4; i++) {
    const index = (currentIndex.value + i) % questionPool.length
    questions.push(questionPool[index])
  }
  return questions
})

// 刷新问题
const refreshQuestions = () => {
  currentIndex.value = (currentIndex.value + 4) % questionPool.length
}

// 选择问题
const selectQuestion = (question) => {
  emit('select-question', question)
}
</script>

<style scoped lang="scss">
.welcome-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-content {
  text-align: center;
  margin-bottom: 40px;
}

.ai-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.welcome-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #1677ff;
    color: #1677ff;
  }

  svg {
    transition: transform 0.3s;
  }

  &:hover svg {
    transform: rotate(180deg);
  }
}

.suggested-questions {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.questions-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.question-tag {
  padding: 10px 16px;
  background: #f5f7fa;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
    border-color: #1677ff;
    color: #1677ff;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .welcome-card {
    padding: 20px 16px;
  }

  .welcome-title {
    font-size: 20px;
  }

  .question-tags {
    gap: 8px;
  }

  .question-tag {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
