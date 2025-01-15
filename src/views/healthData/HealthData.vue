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
            <span class="text-3xl font-semibold text-blue-500">8</span>
          </div>
          <div class="flex items-center text-gray-500">
            <el-icon><Check /></el-icon>
            <span class="ml-1">已完成 5 项任务</span>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">学习时长</h3>
            <span class="text-3xl font-semibold text-emerald-500">6.5h</span>
          </div>
          <div class="flex items-center text-emerald-500">
            <el-icon><ArrowUp /></el-icon>
            <span class="ml-1">较昨日增加 1.2h</span>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">健康指数</h3>
            <span class="text-3xl font-semibold text-orange-500">85</span>
          </div>
          <div class="flex items-center text-gray-500">
            <el-icon><Heart /></el-icon>
            <span class="ml-1">状态良好</span>
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
                <div class="text-2xl font-semibold">8,562</div>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <div class="text-sm text-green-600 mb-2">运动时长</div>
                <div class="text-2xl font-semibold">45分钟</div>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="text-sm text-purple-600 mb-2">睡眠时长</div>
                <div class="text-2xl font-semibold">7.5小时</div>
              </div>
              <div class="bg-orange-50 rounded-lg p-4">
                <div class="text-sm text-orange-600 mb-2">心率</div>
                <div class="text-2xl font-semibold">72次/分</div>
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
                  今日步数已达标，建议傍晚进行20分钟中等强度有氧运动
                </p>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <h4 class="text-green-700 font-medium mb-2">饮食建议</h4>
                <p class="text-green-600">注意补充蛋白质，建议增加水果摄入量</p>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <h4 class="text-purple-700 font-medium mb-2">睡眠建议</h4>
                <p class="text-purple-600">
                  睡眠质量良好，建议保持规律作息时间
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
                  <span class="text-blue-500">85%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div
                    class="h-2 bg-blue-500 rounded-full"
                    style="width: 85%"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>运动时长</span>
                  <span class="text-green-500">60%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div
                    class="h-2 bg-green-500 rounded-full"
                    style="width: 60%"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>睡眠时长</span>
                  <span class="text-purple-500">90%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                  <div
                    class="h-2 bg-purple-500 rounded-full"
                    style="width: 90%"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium text-gray-900 mb-6">健康记录</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-500">2024-01-20</span>
                <span class="text-green-500">运动 45分钟</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">2024-01-19</span>
                <span class="text-blue-500">步行 12000步</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">2024-01-18</span>
                <span class="text-purple-500">睡眠 8小时</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";
import {
  Search,
  Bell,
  Check,
  ArrowUp,
  Microphone,
} from "@element-plus/icons-vue";

const searchText = ref("");
const avatarUrl =
  "https://ai-public.mastergo.com/ai/img_res/f2012dd9e331da49e4edd6ff48c1c57d.jpg";
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
  
  