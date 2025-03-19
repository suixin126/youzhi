<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
  <div class="min-h-screen flex">
    <!-- 左侧品牌区域 -->
    <div
      class="w-1/2 relative bg-gradient-to-br from-indigo-500 to-purple-600 p-12 flex flex-col justify-between text-white"
    >
      <div class="text-2xl font-bold">悠智</div>
      <div class="z-10 relative">
        <h1 class="text-4xl font-bold mb-4">
          开启智慧生活<br />
          定制专属时光
        </h1>
        <p class="text-lg opacity-90">加入我们，探索更高效的时间管理方式</p>
      </div>
      <div class="absolute inset-0 opacity-10">
        <img
          :src="heroImage"
          alt="Office Scene"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="text-sm opacity-70">© 2024 悠智 保留所有权利</div>
    </div>
    <!-- 右侧登录区域 -->
    <div class="w-1/2 p-12 flex items-center justify-center">
      <div class="w-full max-w-md">
        <h2 class="text-2xl font-bold mb-2">创建账号</h2>
        <p class="text-gray-600 mb-8">加入悠智，开启智慧时光管理之旅</p>
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="relative">
            <el-input
              v-model="form.email"
              placeholder="电子邮箱"
              class="w-full !rounded-button"
            >
              <template #prefix>
                <el-icon>
                  <Message />
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="relative">
            <el-input
              v-model="form.phone"
              placeholder="手机号码"
              class="w-full !rounded-button"
            >
              <template #prefix>
                <el-icon>
                  <Iphone />
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="relative">
            <el-input
              v-model="form.username"
              placeholder="用户名"
              class="w-full !rounded-button"
            >
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="relative">
            <el-input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="设置密码"
              class="w-full !rounded-button"
            >
              <template #prefix>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
              <template #suffix>
                <el-icon
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                >
                  <el-icon>
                    <component :is="showPassword ? 'View' : 'Hide'" />
                  </el-icon>
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="relative">
            <el-input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="确认密码"
              class="w-full !rounded-button"
            >
              <template #prefix>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
              <template #suffix>
                <el-icon
                  class="cursor-pointer"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <el-icon>
                    <component :is="showConfirmPassword ? 'View' : 'Hide'" />
                  </el-icon>
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="flex items-center">
            <el-checkbox v-model="form.agreement">我已阅读并同意</el-checkbox>
            <a
              href="javascript:;"
              class="text-indigo-600 hover:text-indigo-800 ml-1 hover:underline"
              @click.prevent="showAgreement('user')"
            >
              用户协议
            </a>
            <span class="mx-1">和</span>
            <a
              href="javascript:;"
              class="text-indigo-600 hover:text-indigo-800 hover:underline"
              @click.prevent="showAgreement('privacy')"
            >
              隐私政策
            </a>
          </div>
          <!-- 协议内容对话框 -->
          <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="80%"
            top="5vh"
            custom-class="agreement-dialog"
          >
            <div class="max-h-[70vh] overflow-y-auto pr-4">
              <component :is="currentContent" />
            </div>

            <template #footer>
              <el-button
                type="primary"
                @click="dialogVisible = false"
                class="!px-6"
              >
                我已阅读
              </el-button>
            </template>
          </el-dialog>

          <el-button
            type="primary"
            class="w-full !rounded-button"
            @click="handleRegister"
          >
            立即注册
          </el-button>
          <div class="text-center text-gray-500">或通过以下方式登录</div>
          <div class="flex justify-center space-x-6">
            <el-button
              @click="handleUnfinishedFeature()"
              class="!rounded-button social-btn"
              :disabled="isProcessing"
            >
              <el-icon><i class="iconfont icon-weixin"></i></el-icon>
            </el-button>
            <el-button
              @click="handleUnfinishedFeature()"
              class="!rounded-button social-btn"
              :disabled="isProcessing"
            >
              <el-icon><i class="iconfont icon-QQ"></i></el-icon>
            </el-button>
            <el-button
              @click="handleUnfinishedFeature()"
              class="!rounded-button social-btn"
              :disabled="isProcessing"
            >
              <el-icon><i class="iconfont icon-weibo"></i></el-icon>
            </el-button>
          </div>
          <div class="text-center">
            <span class="text-gray-600">已有账号？</span>
            <a href="#/login" class="text-indigo-600 hover:text-indigo-800 ml-1"
              >立即登录</a
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, h, computed, shallowRef } from "vue";
import { register } from "@/api/api.js";
import { ElMessage, ElNotification } from "element-plus";
import { userIsExist } from "@/api/api.js";
import { useRouter } from "vue-router";
import UserAgreement from "./components/UserAgreement.vue";
import PrivacyPolicy from "./components/PrivacyPolicy.vue";
const router = useRouter();
const isProcessing = ref(false);
const dialogVisible = ref(false);
const agreementType = ref("user");
// 动态组件加载
const currentContent = shallowRef(UserAgreement);
// 对话框标题
const dialogTitle = computed(() => {
  return agreementType.value === "user" ? "用户协议" : "隐私政策";
});
const showAgreement = (type) => {
  agreementType.value = type;
  currentContent.value = type === "user" ? UserAgreement : PrivacyPolicy;
  dialogVisible.value = true;
};

const handleUnfinishedFeature = () => {
  isProcessing.value = true;

  ElNotification({
    title: "第三方登录功能开发进行时 🚧",
    message: "持续努力，敬请期待！",
    type: "warning",
    duration: 4500,
    offset: 60,
    customClass: "unfinished-notification",
    icon: () =>
      h(
        // 使用 Element Plus 的 h 函数
        "i",
        { class: "iconfont icon-construction text-xl text-amber-600" }
      ),
    onClick: () => {
      window.open("/roadmap", "_blank");
    },
  });

  // 防止重复点击
  setTimeout(() => {
    isProcessing.value = false;
  }, 3000);
};
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const form = reactive({
  email: "",
  phone: "",
  username: "",
  password: "",
  confirmPassword: "",
  agreement: false,
});
const heroImage =
  "https://ai-public.mastergo.com/ai/img_res/97e40bc1810d1014704b2b4144f7c143.jpg";
const handleRegister = () => {
  // 检测表单是否填写完整
  if (
    !form.email ||
    !form.phone ||
    !form.username ||
    !form.password ||
    !form.confirmPassword
  ) {
    ElMessage.error("请填写完整的表单");
    return;
  }
  // 检测密码是否一致
  if (form.password !== form.confirmPassword) {
    ElMessage.error("密码不一致");
    return;
  }
  //查询用户名是否存在
  userIsExist(form.username)
    .then((res) => {
      console.log(res);
      if (res.data.data == true) {
        ElMessage.error("用户名已存在");
        form.username = "";
        return;
      } else {
        register(
          {
            name: form.username,
            password: form.password,
            telephone: form.phone,
            email: form.email,
          },
          {
            "Content-Type": "application/json",
          }
        )
          .then((res) => {
            console.log(res);

            ElMessage.success("注册成功");
            router.push("/login");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>
<style lang="scss" scoped>
/* 自定义对话框样式 */
.agreement-dialog {
  @apply rounded-lg shadow-xl;

  .el-dialog__header {
    @apply border-b border-gray-200;
    margin-right: 0;
  }

  .el-dialog__title {
    @apply text-lg font-semibold text-gray-800;
  }

  .el-dialog__body {
    @apply pt-4 pb-6;
  }
}

/* 协议内容排版样式 */
.agreement-content {
  h2 {
    @apply text-lg font-medium mb-4 mt-6 text-gray-800;
  }

  p {
    @apply text-gray-600 leading-relaxed mb-4;
    text-indent: 2em;
  }

  ol {
    @apply list-decimal pl-6 space-y-3;
  }
}
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
