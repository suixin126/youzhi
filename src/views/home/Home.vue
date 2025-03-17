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
            <span class="text-3xl font-semibold text-blue-500">{{
              totalNum
            }}</span>
          </div>
          <div class="flex items-center text-gray-600">
            <el-icon class="mr-2"><Check /></el-icon>
            <span>已完成 {{ finishedTaskNum }} 项任务</span>
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
            <span class="text-3xl font-semibold text-orange-500">{{
              healthy.point
            }}</span>
          </div>
          <div class="flex items-center text-gray-600">
            <el-icon class="mr-2"><Star /></el-icon>
            <span> {{ healthyState }} </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <!-- 左侧日程区域 -->
        <div class="col-span-2 space-y-6">
          <!-- 今日日程 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium mb-6">今日日程</h3>
            <div class="flex space-x-4 mb-6">
              <el-button
                :class="{
                  '!bg-blue-500 text-white': filterStatus === 'all',
                  '!bg-gray-200 text-gray-600': filterStatus !== 'all',
                }"
                @click="filterStatus = 'all'"
                class="!rounded-button"
              >
                全部
              </el-button>
              <el-button
                :class="{
                  '!bg-blue-500 text-white': filterStatus === 'completed',
                  '!bg-gray-200 text-gray-600': filterStatus !== 'completed',
                }"
                @click="filterStatus = 'completed'"
                class="!rounded-button"
              >
                已完成
              </el-button>
              <el-button
                :class="{
                  '!bg-blue-500 text-white': filterStatus === 'pending',
                  '!bg-gray-200 text-gray-600': filterStatus !== 'pending',
                }"
                @click="filterStatus = 'pending'"
                class="!rounded-button"
              >
                未完成
              </el-button>
            </div>
            <div class="space-y-4">
              <div
                class="flex items-start p-4 bg-blue-50 rounded-lg"
                v-for="(item, index) in currentTasks"
                :key="index"
              >
                <div class="w-20">
                  <div
                    style="text-align: center; line-height: 50px"
                    class="text-lg font-medium"
                  >
                    {{ item.timeStart.split(" ")[1] }}
                  </div>
                </div>
                <div class="flex-1 ml-4">
                  <div
                    style="text-align: center; line-height: 50px"
                    class="font-medium"
                  >
                    {{ item.name }}
                  </div>
                </div>
                <div style="text-align: center; line-height: 50px">
                  <el-button
                    :type="item.state ? 'primary' : ''"
                    class="!rounded-button"
                    >{{ item.state === 0 ? "未完成" : "已完成" }}</el-button
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 日历显示 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium">日历</h3>
            </div>
            <el-calendar
              ref="calendar"
              v-model="value"
              @input="handleCellClick"
            >
              <template #header>
                <span>{{ formatDate(value) }}</span>
                <el-button-group>
                  <el-button size="small" @click="selectDate('prev-year')">
                    上一年
                  </el-button>
                  <el-button size="small" @click="selectDate('prev-month')">
                    上个月
                  </el-button>
                  <el-button size="small" @click="selectDate('today')"
                    >今天</el-button
                  >
                  <el-button size="small" @click="selectDate('next-month')">
                    下个月
                  </el-button>
                  <el-button size="small" @click="selectDate('next-year')">
                    下一年
                  </el-button>
                </el-button-group>
              </template>
            </el-calendar>
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
                  <span class="font-medium">{{ healthy.footNum }} 步</span>
                </div>
                <!-- 总2万步 -->
                <el-progress
                  :percentage="parseFloat((healthy.footNum / 200).toFixed(1))"
                  color="#10B981"
                />
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">专注时长</span>

                  <span class="font-medium">{{ healthy.studyTime }} 小时</span>
                </div>
                <!-- 总6小时 -->
                <el-progress
                  :percentage="
                    parseFloat(((healthy.studyTime * 100) / 6).toFixed(1))
                  "
                  color="#3B82F6"
                />
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">睡眠时长</span>
                  <span class="font-medium">{{ healthy.sleepTime }} 小时</span>
                </div>
                <!-- 总8h -->
                <el-progress
                  :percentage="
                    parseFloat(((healthy.sleepTime * 100) / 8).toFixed(1))
                  "
                  color="#F59E0B"
                />
              </div>
            </div>
          </div>

          <!-- 待办任务 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium mb-6">今日待办</h3>
            <div class="space-y-4">
              <div
                v-for="(item, index) in notFinishedTasks"
                :key="index"
                :class="
                  index % 2
                    ? 'flex items-center justify-between p-3 bg-red-50 rounded-lg'
                    : 'flex items-center justify-between p-3 bg-orange-50 rounded-lg'
                "
              >
                <span class="font-medium">{{ item.name }}</span>
                <span class="text-red-500 text-sm">{{
                  item.timeStart.split(" ")[1]
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from "vue";
import {
  Bell,
  Check,
  ArrowUp,
  Star,
  Microphone,
} from "@element-plus/icons-vue";
import userStore from "@/store/user.js";
import { format } from "date-fns";
import type { CalendarDateType, CalendarInstance } from "element-plus";
import type { ElCalendar } from "element-plus";
import { getHealthyState } from "@/utils/healthy.js";
const store = userStore();
const { tasks, healthy } = store;
const totalNum = tasks.length;
const finishedTaskNum = tasks.filter((task) => task.state === 1).length;
const healthyState = ref("");
const filterStatus = ref("all");
let currentTasks = [...tasks];
let notFinishedTasks = tasks.filter((task) => task.state === 0);
const value = ref(new Date());
// 处理日历单元格点击事件
const handleCellClick = (date) => {
  const formDate = formatDate(date);
  console.log(formDate);
};

const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return;
  calendar.value.selectDate(val);
};
// 格式化日期函数
const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};
watch(filterStatus, (newValue) => {
  if (newValue === "all") {
    currentTasks = [...tasks];
  } else if (newValue === "completed") {
    currentTasks = tasks.filter((task) => task.state === 1);
  } else {
    currentTasks = tasks.filter((task) => task.state === 0);
  }
});
onMounted(() => {
  healthyState.value = getHealthyState(healthy.point);
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
