<template>
  <header class="header">
    <div class="header-bg">
      <div class="header-content">
        <h1 class="title">
          <span class="title-main">黄山市人民政府</span>
          <span class="title-sub">www.huangshan.gov.cn</span>
        </h1>
        
        <div class="search-box">
          <div class="search-tabs">
            <span 
              v-for="tab in tabs" 
              :key="tab.key"
              :class="['tab', { active: activeTab === tab.key }]"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </span>
          </div>
          <div class="search-input-wrapper">
            <input 
              type="text" 
              class="search-input"
              placeholder="请输入关键词"
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const tabs = [
  { key: 'all', label: '一网搜' },
  { key: 'site', label: '本站' }
]

const activeTab = ref('all')
const searchKeyword = ref('')

const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  // 实际项目中这里会跳转到搜索结果页
  console.log('搜索:', searchKeyword.value)
}
</script>

<style scoped lang="scss">
.header {
  flex-shrink: 0;
}

.header-bg {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;

  // 山水背景图案
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.2' d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: cover;
    background-position: bottom;
    opacity: 0.5;
  }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  .title-main {
    font-size: 28px;
    font-weight: bold;
    color: #d63027;
    margin-bottom: 4px;
  }

  .title-sub {
    font-size: 14px;
    color: #666;
  }
}

.search-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.search-tabs {
  display: flex;
  gap: 20px;

  .tab {
    font-size: 14px;
    color: #666;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      color: #1677ff;
    }

    &.active {
      color: #1677ff;
      background: rgba(22, 119, 255, 0.1);
    }
  }
}

.search-input-wrapper {
  display: flex;
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  border: none;
  padding: 12px 20px;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #999;
  }
}

.search-btn {
  width: 48px;
  border: none;
  background: #1677ff;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;

  &:hover {
    background: #4096ff;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .header-bg {
    padding: 16px;
  }

  .title {
    .title-main {
      font-size: 22px;
    }

    .title-sub {
      font-size: 12px;
    }
  }

  .search-input-wrapper {
    max-width: 100%;
  }
}
</style>
