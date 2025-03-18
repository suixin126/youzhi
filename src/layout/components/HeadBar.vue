<template>
  <div class="headBar-contain">
    <!-- 顶部搜索栏 -->
    <div class="mb-8 flex items-center justify-between">
      <div class="relative flex-1 max-w-2xl mx-auto">
        <el-input placeholder="搜索任务或日程..." class="!rounded-full">
          <template #prefix>
            <el-icon class="text-gray-400">
              <Search />
            </el-icon>
          </template>
          <template #suffix>
            <el-icon class="text-gray-400 cursor-pointer">
              <Microphone />
            </el-icon>
          </template>
        </el-input>
      </div>
      <div class="flex items-center">
        <el-badge :value="informCount" class="mr-4" @click="openInformDialog()">
          <el-icon class="text-xl text-gray-600">
            <Bell />
          </el-icon>
        </el-badge>
        <el-avatar :size="40" src="https://ai-public.mastergo.com/ai/img_res/c1d274010034e005082b120c3099585a.jpg"
          @click="toPersonal()" />
      </div>
    </div>

    <el-dialog v-model="informDialogVisible" title="通知消息" width="30%">
      <span v-if="informCount == 0">暂无消息</span>
      <!-- 通知消息列表 -->
      <div v-for="(item, index) in informs" :key="index" class="inform-item">
        <div class="inform-title">{{ item.title }}</div>
        <div class="inform-content">{{ item.content }}</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="informDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="markAsRead">一键已读</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

// 通知消息数据
const informs = ref([
  { title: '新任务提醒', content: '您有一个新的任务需要处理' },
  { title: '日程安排', content: '明天上午10点有一个会议' },
  { title: '消息通知', content: '您有一条新的消息' }
]);

//消息数量
const informCount = ref(informs.value.length);

// 控制通知对话框的显示状态
const informDialogVisible = ref(false);

// 打开通知对话框
const openInformDialog = () => {
  informDialogVisible.value = true;
};

// 一键已读
const markAsRead = () => {
  informs.value = [];
  informCount.value = 0;
};

// 跳转到个人中心
const toPersonal = () => {
  router.push('/personalInformation');
};
</script>

<style lang="scss" scoped>
.headBar-contain {
  padding-top: 20px;
}

.inform-item {
  margin: 10px 0px;
}

.inform-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.inform-content {
  color: #666;
  font-size: small;
}

.el-badge,
.el-avatar {
  cursor: pointer;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>