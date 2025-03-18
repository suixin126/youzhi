<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
  <div class="min-h-screen flex">
    <!-- 左侧品牌区域 -->
    <div
      class="w-1/2 relative bg-gradient-to-br from-indigo-500 to-purple-600 p-12 flex flex-col justify-between text-white">
      <div class="text-2xl font-bold">悠智</div>

      <div class="z-10 relative">
        <h1 class="text-4xl font-bold mb-4">
          智慧管理时光<br />
          悠然规划人生
        </h1>
        <p class="text-lg opacity-90">基于知识图谱的智能日程管理专家</p>
      </div>

      <div class="absolute inset-0 opacity-10">
        <img :src="heroImage" alt="Office Scene" class="w-full h-full object-cover" />
      </div>

      <div class="text-sm opacity-70">© 2024 悠智 保留所有权利</div>
    </div>

    <!-- 右侧登录区域 -->
    <div class="w-1/2 p-12 flex items-center justify-center">
      <div class="w-full max-w-md">
        <h2 class="text-2xl font-bold mb-2">欢迎使用悠智</h2>
        <p class="text-gray-600 mb-8">请登录您的账号以开始使用</p>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="relative">
            <el-input v-model="form.username" placeholder="用户名" class="w-full !rounded-button">
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </div>

          <div class="relative">
            <el-input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="密码"
              class="w-full !rounded-button">
              <template #prefix>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
              <template #suffix>
                <el-icon class="cursor-pointer" @click="showPassword = !showPassword">
                  <component :is="showPassword ? 'View' : 'Hide'" />
                </el-icon>
              </template>
            </el-input>
          </div>

          <div class="flex items-center justify-between">
            <el-checkbox v-model="form.remember">记住密码</el-checkbox>
            <a href="#" class="text-indigo-600 hover:text-indigo-800">忘记密码？</a>
          </div>

          <el-button type="primary" class="w-full !rounded-button" @click="handleLogin">
            登录
          </el-button>

          <div class="text-center text-gray-500">或通过以下方式登录</div>

          <div class="flex justify-center space-x-6">
            <el-button class="!rounded-button social-btn">
              <el-icon><i class="iconfont icon-weixin"></i></el-icon>
            </el-button>
            <el-button class="!rounded-button social-btn">
              <el-icon><i class="iconfont icon-QQ"></i></el-icon>
            </el-button>
            <el-button class="!rounded-button social-btn">
              <el-icon><i class="iconfont icon-weibo"></i></el-icon>
            </el-button>
          </div>

          <div class="text-center">
            <span class="text-gray-600">还没有账号？</span>
            <a href="#/register" class="text-indigo-600 hover:text-indigo-800 ml-1">立即注册</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { login } from "@/api/api.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const showPassword = ref(false);

const form = reactive({
  username: "",
  password: "",
  remember: false,
});

const heroImage =
  "https://ai-public.mastergo.com/ai/img_res/97e40bc1810d1014704b2b4144f7c143.jpg";

// 登录
const handleLogin = () => {
  if (!form.username || !form.password) {
    ElMessage.error("请输入用户名和密码");
    return;
  }
  login(
    {
      name: form.username,
      password: form.password,
    },
    {
      "Content-Type": "application/json",
    }
  ).then((res) => {
    console.log(res);
    if (res.data.status === 200) {
      ElMessage.success("登录成功");
      // 设置token
      localStorage.setItem("token", res.data.data.token);
      router.push("/");
    } else {
      ElMessage.error(res.data.message);
    }
  });
};
</script>

<style scoped>
.social-btn {
  @apply w-12 h-12 p-0 flex items-center justify-center text-xl text-gray-600 hover:text-indigo-600 transition-colors duration-200;
}

:deep(.el-input__wrapper) {
  @apply shadow-none;
}

:deep(.el-input__inner) {
  @apply text-base;
}

:deep(.el-input__prefix) {
  @apply mr-2;
}

:deep(.el-input__suffix) {
  @apply ml-2;
}
</style>