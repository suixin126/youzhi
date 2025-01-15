<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <div class="max-w-8xl mx-auto px-4 py-6 space-y-6">
      <div class="bg-white rounded-lg shadow-sm p-8">
        <!-- 个人信息 -->
        <div class="mb-12">
          <h2 class="text-xl font-medium mb-8">个人信息</h2>
          <div class="flex flex-col items-center mb-8">
            <el-avatar :size="120" :src="userAvatar" />
            <el-button class="mt-4 !rounded-button" type="primary"
              >更换头像</el-button
            >
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="text-gray-500">用户名</div>
              <div class="text-gray-900">陈思远</div>
            </div>
            <div class="space-y-2">
              <div class="text-gray-500">学号</div>
              <div class="text-gray-900">2021001234</div>
            </div>
            <div class="space-y-2">
              <div class="text-gray-500">手机号码</div>
              <div class="text-gray-900">138****5678</div>
            </div>
            <div class="space-y-2">
              <div class="text-gray-500">邮箱</div>
              <div class="text-gray-900">chen****@email.com</div>
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div class="mb-12">
          <h2 class="text-xl font-medium mb-6">通知设置</h2>
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-gray-700">每日学习提醒</span>
              <el-switch v-model="notifications.daily" />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">任务到期提醒</span>
              <el-switch v-model="notifications.task" />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">系统通知</span>
              <el-switch v-model="notifications.system" />
            </div>
          </div>
        </div>

        <!-- 安全设置 -->
        <div>
          <h2 class="text-xl font-medium mb-6">安全设置</h2>
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-gray-700 mb-1">修改密码</div>
                <div class="text-gray-500 text-sm">
                  上次修改时间：2024-01-15
                </div>
              </div>
              <el-button
                type="primary"
                class="!rounded-button whitespace-nowrap"
                >修改</el-button
              >
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-gray-700 mb-1">双重认证</div>
                <div class="text-gray-500 text-sm">
                  启用双重认证提高账号安全性
                </div>
              </div>
              <el-switch v-model="security.twoFactor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";
import { Search, Microphone, Bell } from "@element-plus/icons-vue";

const searchText = ref("");
const userAvatar =
  "https://ai-public.mastergo.com/ai/img_res/c8458fa65be755b3454edbc742e77195.jpg";

const notifications = ref({
  daily: true,
  task: true,
  system: false,
});

const security = ref({
  twoFactor: false,
});
</script>
  
  <style scoped>
.el-input :deep(.el-input__wrapper) {
  background-color: #f4f4f4;
  border: none;
  box-shadow: none !important;
}

.el-input :deep(.el-input__inner) {
  height: 40px;
}

.el-input :deep(.el-input__prefix) {
  left: 12px;
}

.el-input :deep(.el-input__suffix) {
  right: 12px;
}
</style>
  
  