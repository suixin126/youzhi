<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 主内容区 -->
    <div class="max-w-8xl mx-auto px-3 pt-4 pb-8">
      <!-- 概览数据 -->
      <div class="mb-8 grid grid-cols-3 gap-6">
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <div class="mb-2 text-gray-600">今日待办</div>
          <div class="flex items-end justify-between">
            <div class="text-3xl font-semibold">8</div>
            <div class="text-sm text-gray-500">已完成 5 项任务</div>
          </div>
        </div>
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <div class="mb-2 text-gray-600">学习时长</div>
          <div class="flex items-end justify-between">
            <div class="text-3xl font-semibold">6.5h</div>
            <div class="flex items-center text-sm text-green-500">
              <el-icon><ArrowUp /></el-icon>
              较昨日增加 1.2h
            </div>
          </div>
        </div>
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <div class="mb-2 text-gray-600">健康指数</div>
          <div class="flex items-end justify-between">
            <div class="text-3xl font-semibold">85</div>
            <div class="flex items-center text-sm text-green-500">
              <el-icon><Heart /></el-icon>
              状态良好
            </div>
          </div>
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="mb-8 grid grid-cols-3 gap-6">
        <div class="col-span-2 rounded-lg bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-medium">任务列表</h2>
          <el-table :data="tasks" style="width: 100%">
            <el-table-column width="50">
              <template #default="scope">
                <el-checkbox v-model="scope.row.completed" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="任务名称" />
            <el-table-column prop="deadline" label="截止时间" width="120" />
            <el-table-column width="100">
              <template #default="scope">
                <el-tag
                  :type="
                    scope.row.priority === '高'
                      ? 'danger'
                      : scope.row.priority === '中'
                      ? 'warning'
                      : 'info'
                  "
                  size="small"
                >
                  {{ scope.row.priority }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 新建任务 -->
        <div class="rounded-lg bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-medium">新建任务</h2>
          <el-form>
            <el-form-item>
              <el-input v-model="newTask.name" placeholder="输入任务名称" />
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="newTask.deadline"
                type="datetime"
                placeholder="选择截止时间"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="newTask.priority"
                placeholder="选择优先级"
                style="width: 100%"
              >
                <el-option label="低" value="低" />
                <el-option label="中" value="中" />
                <el-option label="高" value="高" />
              </el-select>
            </el-form-item>
            <el-button
              type="primary"
              class="w-full !rounded-button"
              @click="createTask"
              >创建任务</el-button
            >
          </el-form>

          <!-- 任务标签 -->
          <div class="mt-6">
            <h3 class="mb-3 text-sm font-medium text-gray-600">任务标签</h3>
            <div class="flex flex-wrap gap-2">
              <el-tag type="danger">紧急</el-tag>
              <el-tag type="primary">学习</el-tag>
              <el-tag type="success">作业</el-tag>
              <el-tag type="warning">考试</el-tag>
              <el-tag>课程</el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 任务统计 -->
      <div class="grid grid-cols-4 gap-6">
        <div class="rounded-lg bg-red-50 p-6">
          <div class="text-red-600">紧急任务</div>
          <div class="mt-2 text-2xl font-semibold text-red-600">3</div>
        </div>
        <div class="rounded-lg bg-green-50 p-6">
          <div class="text-green-600">已完成</div>
          <div class="mt-2 text-2xl font-semibold text-green-600">12</div>
        </div>
        <div class="rounded-lg bg-blue-50 p-6">
          <div class="text-blue-600">进行中</div>
          <div class="mt-2 text-2xl font-semibold text-blue-600">5</div>
        </div>
        <div class="rounded-lg bg-orange-50 p-6">
          <div class="text-orange-600">待开始</div>
          <div class="mt-2 text-2xl font-semibold text-orange-600">8</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";
import {
  Monitor,
  House,
  List,
  DataLine,
  TrendCharts,
  Setting,
  Search,
  Microphone,
  Bell,
  ArrowUp,
//   Heart,
} from "@element-plus/icons-vue";

const searchText = ref("");

const tasks = ref([
  {
    name: "完成数学分析第三章习题",
    deadline: "2024-01-20 23:59",
    priority: "高",
    completed: false,
  },
  {
    name: "准备英语演讲",
    deadline: "2024-01-21 14:00",
    priority: "中",
    completed: false,
  },
  {
    name: "物理实验报告",
    deadline: "2024-01-22 18:00",
    priority: "低",
    completed: false,
  },
]);

const newTask = ref({
  name: "",
  deadline: "",
  priority: "低",
});

const createTask = () => {
  if (newTask.value.name && newTask.value.deadline) {
    tasks.value.push({
      name: newTask.value.name,
      deadline: newTask.value.deadline,
      priority: newTask.value.priority,
      completed: false,
    });
    newTask.value = {
      name: "",
      deadline: "",
      priority: "低",
    };
  }
};
</script>
  
<style scoped>
.el-input__wrapper {
  box-shadow: none !important;
  border: 1px solid #e5e7eb;
}
.el-input__wrapper:hover {
  border-color: #3b82f6;
}
.el-input__wrapper.is-focus {
  border-color: #3b82f6;
}
</style>
  
  