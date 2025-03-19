<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
const isLoading = ref(true);
const days = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

onBeforeMount(() => {
  isLoading.value = localStorage.getItem("isLoading") ? false : true;
  setTimeout(() => {
    isLoading.value = false;
    localStorage.setItem("isLoading", "false");
  }, 1000);
  let dayItem = ref("");
  const AppToday = new Date();
  dayItem = days[AppToday.getDay()];
  localStorage.setItem(dayItem,1);
});
</script>

<template>
  <div>
    <!-- 全屏加载组件 -->
    <div v-if="isLoading" class="fullscreen-loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">拼命加载中...</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.fullscreen-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 16px;
  color: #606266;
  font-size: 14px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
