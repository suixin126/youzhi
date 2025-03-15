<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <div class="max-w-8xl mx-auto px-4 py-6 space-y-6">
      <div class="bg-white rounded-lg shadow-sm p-8">
        <!-- 个人信息 -->
        <div class="mb-12">
          <h2 class="text-xl font-medium mb-8">个人信息</h2>
          <div class="flex flex-col items-center mb-8">
            <el-avatar :size="120" :src="userInfo.avatar" />
            <el-button
              class="mt-4 rounded-md"
              type="primary"
              @click="changeAvatar()"
              >更换头像</el-button
            >
            <input
              ref="avatarInputRef"
              type="file"
              accept="image/*"
              style="display: none"
            />
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="text-gray-500">用户名</div>
              <div class="text-gray-900">{{ userInfo.username }}</div>
            </div>
            <div class="space-y-2">
              <div class="text-gray-500">学号</div>
              <div class="text-gray-900">{{ userInfo.stuId }}</div>
            </div>
            <div class="space-y-2">
              <div class="text-gray-500">手机号码</div>
              <div class="text-gray-900">{{ userInfo.phone }}</div>
            </div>
            <div class="space-y-2">
              <div class="text-gray-500">邮箱</div>
              <div class="text-gray-900">{{ userInfo.email }}</div>
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
                class="rounded-md whitespace-nowrap"
                @click="changePassword()"
                >修改</el-button
              >

              <el-dialog
                v-model="centerDialogVisible"
                title="密码修改"
                width="500"
                destroy-on-close
                center
                align-center
              >
                <div style="margin-bottom: 20px">
                  <span> 旧密码： </span>
                  <el-input
                    v-model="password1"
                    style="width: 240px; margin-left: 20px"
                    type="password"
                    placeholder="请输入"
                    show-password
                  />
                </div>
                <div style="margin-bottom: 20px">
                  <span> 新密码： </span>
                  <el-input
                    v-model="password2"
                    style="width: 240px; margin-left: 20px"
                    type="password"
                    placeholder="请输入"
                    show-password
                  />
                </div>
                <div style="margin-bottom: 20px">
                  <span> 确认密码： </span>
                  <el-input
                    v-model="password3"
                    style="width: 240px; margin-left: 6px"
                    type="password"
                    placeholder="请输入"
                    show-password
                  />
                </div>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="cancel()">取消</el-button>
                    <el-button type="primary" @click="save()"> 保存 </el-button>
                  </div>
                </template>
              </el-dialog>
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
import { onMounted, ref } from "vue";
import userStore from "@/store/user.js";
import { ElMessage } from "element-plus";
// 仓库
const store = userStore();
const { userInfo } = store;

// 选择头像
const avatarInputRef = ref(null);
const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      userInfo.avatar = e.target.result;
    };
    reader.onerror = () => {
      console.error("文件读取失败");
    };
    reader.readAsDataURL(file);
  }
};
const changeAvatar = () => {
  console.log("修改头像");
  avatarInputRef.value.click();
};
// 密码
const password1 = ref("");
const password2 = ref("");
const password3 = ref("");
// 是否展示弹窗
const centerDialogVisible = ref(false);
// 修改密码
const changePassword = () => {
  console.log("修改密码");
  centerDialogVisible.value = true;
};
// 取消修改
const cancel = () => {
  console.log("取消修改");
  centerDialogVisible.value = false;
};
// 保存修改
const save = () => {
  console.log("修改成功");
  if (password1.value !== userInfo.password) {
    ElMessage.error({
      message: "旧密码错误,修改失败",
    });
    console.log("旧密码错误");
  } else if (password2.value !== password3.value) {
    ElMessage.error({
      message: "两次输入的密码不一致,修改失败",
    });
    console.log("两次输入的密码不一致");
  } else {
    ElMessage.success({
      message: "修改成功",
    });
    centerDialogVisible.value = false;
  }
};
onMounted(() => {
  if (avatarInputRef.value) {
    avatarInputRef.value.addEventListener("change", handleAvatarChange);
  }
});

const searchText = ref("");

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
.el-input .el-input__wrapper {
  background-color: #f4f4f4;
  border: none;
  box-shadow: none !important;
}

.el-input .el-input__inner {
  height: 40px;
}

.el-input .el-input__prefix {
  left: 12px;
}

.el-input .el-input__suffix {
  right: 12px;
}
</style>
