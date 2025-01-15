<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- 主要内容区域 -->
    <div class="pt-4 pb-8 max-w-8xl mx-auto px-4">
      <!-- 状态卡片 -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">今日待办</h3>
            <span class="text-3xl font-semibold text-blue-500">8</span>
          </div>
          <div class="flex items-center text-gray-600">
            <el-icon class="mr-2"><Check /></el-icon>
            <span>已完成 5 项任务</span>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">学习时长</h3>
            <span class="text-3xl font-semibold text-green-500">6.5h</span>
          </div>
          <div class="flex items-center text-gray-600">
            <el-icon class="mr-2"><ArrowUp /></el-icon>
            <span>较昨日增加 1.2h</span>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">健康指数</h3>
            <span class="text-3xl font-semibold text-orange-500">85</span>
          </div>
          <div class="flex items-center text-gray-600">
            <el-icon class="mr-2"><Star /></el-icon>
            <span>状态良好</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <!-- 左侧日程区域 -->
        <div class="col-span-2 space-y-6">
          <!-- 今日日程 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium mb-6">今日日程</h3>
            <div class="space-y-4">
              <div class="flex items-start p-4 bg-blue-50 rounded-lg">
                <div class="w-20">
                  <div class="text-lg font-medium">09:00</div>
                  <div class="text-sm text-gray-500">2小时</div>
                </div>
                <div class="flex-1 ml-4">
                  <div class="font-medium">高等数学课程</div>
                  <div class="text-sm text-gray-500">理工楼 B304</div>
                </div>
                <div>
                  <el-button type="primary" class="!rounded-button"
                    >进行中</el-button
                  >
                </div>
              </div>

              <div class="flex items-start p-4 hover:bg-gray-50 rounded-lg">
                <div class="w-20">
                  <div class="text-lg font-medium">11:30</div>
                  <div class="text-sm text-gray-500">1小时</div>
                </div>
                <div class="flex-1 ml-4">
                  <div class="font-medium">小组项目讨论</div>
                  <div class="text-sm text-gray-500">图书馆讨论室3</div>
                </div>
                <div>
                  <el-button class="!rounded-button">未开始</el-button>
                </div>
              </div>

              <div class="flex items-start p-4 hover:bg-gray-50 rounded-lg">
                <div class="w-20">
                  <div class="text-lg font-medium">14:00</div>
                  <div class="text-sm text-gray-500">3小时</div>
                </div>
                <div class="flex-1 ml-4">
                  <div class="font-medium">算法练习</div>
                  <div class="text-sm text-gray-500">自习</div>
                </div>
                <div>
                  <el-button class="!rounded-button">未开始</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习数据分析 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium">学习数据分析</h3>
              <div class="flex space-x-2">
                <el-button
                  :class="{ '!bg-blue-50': activeChart === 'week' }"
                  @click="activeChart = 'week'"
                  class="!rounded-button"
                  >周</el-button
                >
                <el-button
                  :class="{ '!bg-blue-50': activeChart === 'month' }"
                  @click="activeChart = 'month'"
                  class="!rounded-button"
                  >月</el-button
                >
                <el-button
                  :class="{ '!bg-blue-50': activeChart === 'year' }"
                  @click="activeChart = 'year'"
                  class="!rounded-button"
                  >年</el-button
                >
              </div>
            </div>
            <div ref="chartRef" class="h-64"></div>
          </div>
        </div>

        <!-- 右侧信息栏 -->
        <div class="space-y-6">
          <!-- 健康状态 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium mb-6">健康状态</h3>
            <div class="space-y-6">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">今日步数</span>
                  <span class="font-medium">6,832 步</span>
                </div>
                <el-progress :percentage="68" color="#10B981" />
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">专注时长</span>
                  <span class="font-medium">4.5 小时</span>
                </div>
                <el-progress :percentage="75" color="#3B82F6" />
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">睡眠时长</span>
                  <span class="font-medium">7.2 小时</span>
                </div>
                <el-progress :percentage="90" color="#F59E0B" />
              </div>
            </div>
          </div>

          <!-- 待办任务 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium mb-6">待办任务</h3>
            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <span class="font-medium">数学作业</span>
                <span class="text-red-500 text-sm">今天 23:59</span>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
              >
                <span class="font-medium">英语演讲准备</span>
                <span class="text-orange-500 text-sm">明天 14:00</span>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <span class="font-medium">实验报告</span>
                <span class="text-blue-500 text-sm">后天 18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  Bell,
  Check,
  ArrowUp,
  Star,
  Microphone,
} from "@element-plus/icons-vue";
import * as echarts from "echarts";

const searchText = ref("");
const activeChart = ref("week");
const chartRef = ref<HTMLElement>();
const avatarUrl =
  "https://ai-public.mastergo.com/ai/img_res/aa07b5a5ec09b2a702f6add3b996b7f8.jpg";

onMounted(() => {
  const chart = echarts.init(chartRef.value as HTMLElement);

  const option = {
    animation: false,
    grid: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      axisLine: {
        lineStyle: {
          color: "#E5E7EB",
        },
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 8,
      interval: 2,
      axisLine: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "#E5E7EB",
        },
      },
    },
    series: [
      {
        data: [5.8, 6.0, 5.2, 6.5, 6.2, 5.9, 6.8],
        type: "line",
        smooth: true,
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: "#3B82F6",
        },
        itemStyle: {
          color: "#3B82F6",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(59, 130, 246, 0.2)",
              },
              {
                offset: 1,
                color: "rgba(59, 130, 246, 0)",
              },
            ],
          },
        },
      },
    ],
  };

  chart.setOption(option);
});
</script>
  
  <style scoped>
:deep(.el-input__wrapper) {
  background-color: #f3f4f6;
  border: none;
  box-shadow: none !important;
  padding-left: 1rem;
  padding-right: 1rem;
}

:deep(.el-input__inner) {
  font-size: 0.875rem;
  height: 2.5rem;
}

:deep(.el-progress-bar__outer) {
  background-color: #f3f4f6 !important;
  height: 8px !important;
}

:deep(.el-button) {
  height: 2.25rem;
  padding: 0 1rem;
}

:deep(.el-input__suffix) {
  color: #6b7280;
}
</style>
  
  