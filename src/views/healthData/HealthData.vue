<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <div class="max-w-8xl mx-auto px-3 pt-4 pb-8">
      <!-- 状态概览卡片 -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">今日待办</h3>
            <span class="text-3xl font-semibold text-blue-500">{{
              tasks.length
            }}</span>
          </div>
          <div class="flex items-center text-gray-500">
            <el-icon>
              <Check />
            </el-icon>
            <span class="ml-1">已完成 {{ finishedTasks.length }} 项任务</span>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">学习时长</h3>
            <span class="text-3xl font-semibold text-emerald-500">6.5h</span>
          </div>
          <div class="flex items-center text-emerald-500">
            <el-icon>
              <ArrowUp />
            </el-icon>
            <span class="ml-1">较昨日增加 1.2h</span>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">健康指数</h3>
            <span class="text-3xl font-semibold text-orange-500">{{
              healthy.point
            }}</span>
          </div>
          <div class="flex items-center text-gray-500">
            <span class="ml-1">{{ healthyState }}</span>
          </div>
        </div>
      </div>

      <!-- 健康数据和目标区域 -->
      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2">
          <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-6">健康数据概览</h3>
            <div class="grid grid-cols-2 gap-6">
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="text-sm text-blue-600 mb-2">今日步数</div>
                <div class="text-2xl font-semibold">{{ healthy.footNum }}</div>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <div class="text-sm text-green-600 mb-2">运动时长</div>
                <div class="text-2xl font-semibold">
                  {{ healthy.sportTime }}分钟
                </div>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="text-sm text-purple-600 mb-2">睡眠时长</div>
                <div class="text-2xl font-semibold">
                  {{ healthy.sleepTime }}小时
                </div>
              </div>
              <div class="bg-orange-50 rounded-lg p-4">
                <div class="text-sm text-orange-600 mb-2">心率</div>
                <div class="text-2xl font-semibold">{{ healthy.bpm }}次/分</div>
              </div>
            </div>
          </div>

          <!-- 健康建议区域 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 mb-6">健康建议</h3>
            <div class="space-y-4">
              <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="text-blue-700 font-medium mb-2">运动建议</h4>
                <p class="text-blue-600">
                  {{ healthy.sportAdvice }}
                </p>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <h4 class="text-green-700 font-medium mb-2">饮食建议</h4>
                <p class="text-green-600">{{ healthy.foodAdvice }}</p>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <h4 class="text-purple-700 font-medium mb-2">睡眠建议</h4>
                <p class="text-purple-600">
                  {{ healthy.sleepAdvice }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧健康目标和记录 -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 mb-6">健康目标</h3>
            <div class="space-y-6">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>每日步数</span>
                  <span class="text-blue-500">{{ footRatio * 100 }}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div class="h-2 bg-blue-500 rounded-full" :style="{ width: footRatio * 100 + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>运动时长</span>
                  <span class="text-green-500">{{ sportRatio * 100 }}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div class="h-2 bg-green-500 rounded-full" :style="{ width: sportRatio * 100 + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>睡眠时长</span>
                  <span class="text-purple-500">{{ sleepRatio * 100 }}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div class="h-2 bg-purple-500 rounded-full" :style="{ width: sleepRatio * 100 + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-sm relative">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium text-gray-900">健康记录</h3>
              <el-button size="small" @click="showHealthDialog = true" class="!rounded-button">
                查询近30天
              </el-button>
            </div>

            <div class="space-y-4">
              <!-- 最近3天数据展示（示例数据） -->
              <div v-for="(item, index) in visibleHealthData" :key="index" class="flex justify-between items-center">
                <span class="text-gray-500">{{ item.date }}</span>
                <span :class="typeColorMap[item.type]">
                  {{ item.typeLabel }} {{ item.value }}{{ item.unit }}
                </span>
              </div>

              <!-- 数据过多时显示省略号 -->
              <div v-if="showEllipsis" class="text-center text-gray-400">
                ...
              </div>
            </div>

            <!-- 健康数据弹窗 -->
            <el-dialog v-model="showHealthDialog" title="近30天健康数据" width="80%">
              <el-table :data="healthData" style="width: 100%" max-height="400">
                <el-table-column prop="date" label="日期" width="120" />
                <el-table-column label="步数" width="120">
                  <template #default="{ row }">
                    {{ row.steps || 0 }} 步
                  </template>
                </el-table-column>
                <el-table-column label="运动时长" width="120">
                  <template #default="{ row }">
                    {{ row.exercise || 0 }} 分钟
                  </template>
                </el-table-column>
                <el-table-column label="睡眠时长" width="120">
                  <template #default="{ row }">
                    {{ row.sleep || 0 }} 小时
                  </template>
                </el-table-column>
                <el-table-column label="心率" prop="heartRate">
                  <template #default="{ row }">
                    {{ row.heartRate || "--" }} bpm
                  </template>
                </el-table-column>
              </el-table>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import userStore from "@/store/user.js";
import {
  getHealthyState,
  totalFoot,
  totalSleepTime,
  totalSportTime,
} from "@/utils/healthy.js";
import { importHealthData, getHealthData, getHealthDataList, getHealthSuggestion } from "@/api/api.js";
const store = userStore();
const { tasks, healthy } = store;
const finishedTasks = tasks.filter((task) => task.state === 1);
const healthyState = ref("");
const footRatio = parseFloat((healthy.footNum / totalFoot).toFixed(1));
const sportRatio = parseFloat((healthy.sportTime / totalSportTime).toFixed(1));
const sleepRatio = parseFloat((healthy.sleepTime / totalSleepTime).toFixed(1));
const showHealthDialog = ref(false);
const visibleCount = 6;
const healthData = [];
const showEllipsis = computed(() => {
  return healthData.length > visibleCount;
});
const visibleHealthData = computed(() => {
  return healthData.slice(0, visibleCount).map((item) => ({
    ...item,
    typeLabel: getTypeLabel(item.type),
    unit: getUnit(item.type),
  }));
});
const getTypeLabel = (type) => {
  const labels = {
    sport: "运动",
    foot: "步行",
    sleep: "睡眠",
  };
  return labels[type] || "";
};
const getUnit = (type) => {
  const units = {
    sport: "分钟",
    foot: "步",
    sleep: "小时",
  };
  return units[type] || "";
};
const typeColorMap = {
  sport: "text-green-500",
  foot: "text-blue-500",
  sleep: "text-purple-500",
};
const generateDemoData = () => {
  // 生成30天示例数据
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    healthData.push({
      date: date.toISOString().split("T")[0],
      type: ["sport", "foot", "sleep"][i % 3],
      steps: Math.floor(Math.random() * 10000),
      exercise: Math.floor(Math.random() * 120),
      sleep: (Math.random() * 8 + 4).toFixed(1),
      heartRate: Math.floor(Math.random() * 40 + 60),
    });
  }
  return healthData;
};
onMounted(() => {
  healthyState.value = getHealthyState(healthy.point);
  generateDemoData();
});
</script>

<style scoped>
.el-input :deep(.el-input__wrapper) {
  background-color: #f3f4f6;
  border: none;
  box-shadow: none !important;
}

.el-input :deep(.el-input__inner) {
  height: 40px;
}

.el-input :deep(.el-input__inner)::placeholder {
  color: #9ca3af;
}
</style>
