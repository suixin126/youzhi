<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto max-w-7xl">
      <!-- 顶部数据概览 -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="text-gray-600 mb-2">今日待办</div>
          <div class="flex items-end">
            <span class="text-4xl font-medium">8</span>
            <span class="text-gray-500 ml-3">已完成 5 项任务</span>
          </div>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="text-gray-600 mb-2">学习时长</div>
          <div class="flex items-end">
            <span class="text-4xl font-medium">6.5h</span>
            <span class="text-green-500 ml-3">较昨日增加 1.2h</span>
          </div>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="text-gray-600 mb-2">健康指数</div>
          <div class="flex items-end">
            <span class="text-4xl font-medium">85</span>
            <span class="text-green-500 ml-3">状态良好</span>
          </div>
        </div>
      </div>

      <div class="flex gap-8">
        <!-- 左侧任务列表 -->
        <div class="flex-1">
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h2 class="text-xl font-medium mb-6">任务列表</h2>
            <el-table :data="taskList" style="width: 100%">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="name" label="任务名称" />
              <el-table-column prop="deadline" label="截止时间" width="180" />
              <el-table-column prop="priority" label="优先级" width="100">
                <template #default="{ row }">
                  <el-tag :type="getPriorityType(row.priority)" size="small">
                    {{ row.priority }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 底部任务统计 -->
          <div class="grid grid-cols-4 gap-6 mt-8">
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <div class="text-red-500 mb-2">紧急任务</div>
              <div class="text-3xl font-medium">3</div>
            </div>
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <div class="text-green-500 mb-2">已完成</div>
              <div class="text-3xl font-medium">12</div>
            </div>
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <div class="text-blue-500 mb-2">进行中</div>
              <div class="text-3xl font-medium">5</div>
            </div>
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <div class="text-orange-500 mb-2">待开始</div>
              <div class="text-3xl font-medium">8</div>
            </div>
          </div>
        </div>

        <!-- 右侧新建任务 -->
        <div class="w-96">
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-medium">新建任务</h2>
              <el-button type="primary" class="flex items-center !rounded-button" @click="startVoiceInput">
                <el-icon class="mr-1"><Microphone /></el-icon>
                语音输入
              </el-button>
            </div>

            <div class="space-y-4">
              <div>
                <el-radio-group v-model="taskType" class="mb-4">
                  <el-radio-button label="small">小任务</el-radio-button>
                  <el-radio-button label="big">大任务</el-radio-button>
                </el-radio-group>
              </div>

              <el-input v-model="newTask.name" placeholder="输入任务名称" />

              <el-date-picker
                v-model="newTask.deadline"
                type="datetime"
                placeholder="选择截止时间"
                style="width: 100%"
              />

              <el-select v-model="newTask.priority" placeholder="选择优先级" style="width: 100%">
                <el-option label="低" value="低" />
                <el-option label="中" value="中" />
                <el-option label="高" value="高" />
              </el-select>

              <template v-if="taskType === 'big'">
                <div class="border rounded p-4">
                  <div class="flex items-center justify-between mb-4">
                    <span class="font-medium">子任务列表</span>
                    <el-button type="primary" size="small" class="!rounded-button" @click="addSubTask">
                      添加子任务
                    </el-button>
                  </div>
                  <div v-for="(subTask, index) in newTask.subTasks" :key="index" class="flex items-center gap-2 mb-2">
                    <el-input v-model="subTask.name" placeholder="子任务名称" />
                    <el-button type="danger" size="small" class="!rounded-button" @click="removeSubTask(index)">
                      删除
                    </el-button>
                  </div>
                </div>
              </template>

              <div>
                <div class="mb-2">任务标签</div>
                <div class="flex flex-wrap gap-2">
                  <el-tag 
                    v-for="tag in tags" 
                    :key="tag"
                    :type="getTagType(tag)"
                    class="cursor-pointer"
                    @click="toggleTag(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>

              <el-button type="primary" class="w-full !rounded-button" @click="createTask">
                创建任务
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Microphone } from '@element-plus/icons-vue';

interface SubTask {
  name: string;
}

interface Task {
  name: string;
  deadline: string;
  priority: string;
  subTasks: SubTask[];
  tags: string[];
}

const taskType = ref('small');
const newTask = ref<Task>({
  name: '',
  deadline: '',
  priority: '',
  subTasks: [],
  tags: []
});

const taskList = ref([
  { name: '完成数学分析第二章习题', deadline: '2024-01-20 23:59', priority: '高' },
  { name: '准备英语演讲', deadline: '2024-01-21 14:00', priority: '中' },
  { name: '物理实验报告', deadline: '2024-01-22 18:00', priority: '低' }
]);

const tags = ['紧急', '学习', '作业', '考试', '课程'];
const selectedTags = ref<string[]>([]);

const getPriorityType = (priority: string) => {
  const types: Record<string, string> = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  };
  return types[priority] || 'info';
};

const getTagType = (tag: string) => {
  const types: Record<string, string> = {
    '紧急': 'danger',
    '学习': 'primary',
    '作业': 'success',
    '考试': 'warning',
    '课程': 'info'
  };
  return types[tag] || 'default';
};

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

const addSubTask = () => {
  newTask.value.subTasks.push({ name: '' });
};

const removeSubTask = (index: number) => {
  newTask.value.subTasks.splice(index, 1);
};

const startVoiceInput = () => {
  ElMessage.success('开始语音输入');
  // 实际项目中这里需要调用语音识别API
};

const createTask = () => {
  if (!newTask.value.name) {
    ElMessage.warning('请输入任务名称');
    return;
  }
  if (!newTask.value.deadline) {
    ElMessage.warning('请选择截止时间');
    return;
  }
  if (!newTask.value.priority) {
    ElMessage.warning('请选择优先级');
    return;
  }

  taskList.value.push({
    name: newTask.value.name,
    deadline: newTask.value.deadline,
    priority: newTask.value.priority
  });

  // 重置表单
  newTask.value = {
    name: '',
    deadline: '',
    priority: '',
    subTasks: [],
    tags: []
  };
  selectedTags.value = [];
  
  ElMessage.success('创建任务成功');
};
</script>

<style scoped>
.el-input :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e5e7eb;
}
.el-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff;
}
.el-date-picker {
  --el-datepicker-border-color: #e5e7eb;
}
</style>

