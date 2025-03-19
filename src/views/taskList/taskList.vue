<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto max-w-7xl">
      <!-- 顶部数据概览 -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="text-gray-600 mb-2">今日待办</div>
          <div class="flex items-end">
            <span class="text-4xl font-medium">{{ taskList.length }}</span>
            <span class="text-gray-500 ml-3"
              >已完成 {{ finishedTasks.length }} 项任务</span
            >
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
            <span class="text-4xl font-medium">{{ healthy.point }}</span>
            <span class="text-green-500 ml-3">{{ healthyState }}</span>
          </div>
        </div>
      </div>

      <div class="flex gap-8">
        <!-- 左侧任务列表 -->
        <div class="flex-1">
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h2 class="text-xl font-medium mb-6">任务列表</h2>
            <el-table :data="taskList" style="width: 100%">
              <el-table-column width="55">
                <template #default="{ row }">
                  <div class="check-box" @click="toggleCheck(row)">
                    {{ row.status === 1 ? "✓" : "□" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="任务名称" />
              <el-table-column prop="endTime" label="截止时间" width="180" />
              <el-table-column prop="priority" label="优先级" width="100">
                <template #default="{ row }">
                  <el-tag :type="getPriorityType(row.priority)" size="small">
                    {{ row.priority }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button type="danger" @click="deleteSTask(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 底部任务统计 -->
          <div class="grid grid-cols-4 gap-6 mt-8">
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <div class="text-orange-500 mb-2">大任务</div>
              <div class="text-3xl font-medium">{{ bigTasks.length }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧新建任务 -->
        <div class="w-96">
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-medium">新建任务</h2>
              <el-button
                type="primary"
                class="flex items-center !rounded-button"
              >
                <el-icon class="mr-1"><Microphone /></el-icon>
                {{ isLuZhi ? "停止录音" : "语音输入" }}
              </el-button>
            </div>

            <div class="space-y-4">
              <div>
                <el-radio-group v-model="taskType" class="mb-4">
                  <el-radio-button value="small">小任务</el-radio-button>
                  <el-radio-button value="big">大任务</el-radio-button>
                </el-radio-group>
              </div>

              <el-input
                v-model="newTask.description"
                placeholder="输入任务名称"
              />

              <el-date-picker
                v-if="taskType == 'small'"
                v-model="newTask.startTime"
                type="datetime"
                placeholder="选择开始时间"
                style="width: 100%"
              />

              <el-date-picker
                v-if="taskType == 'small'"
                v-model="newTask.endTime"
                type="datetime"
                placeholder="选择截止时间"
                style="width: 100%"
              />

              <el-select
                v-if="taskType == 'small'"
                v-model="newTask.priority"
                placeholder="选择优先级"
                style="width: 100%"
              >
                <el-option label="1" value="1" />
                <el-option label="2" value="2" />
                <el-option label="3" value="3" />
                <el-option label="4" value="4" />
                <el-option label="5" value="5" />
              </el-select>
              <div>
                <div class="mb-2" v-if="taskType == 'small'">任务标签</div>
                <div class="flex flex-wrap gap-2" v-if="taskType == 'small'">
                  <el-select
                    v-model="newTask.tags"
                    multiple
                    placeholder="选择标签"
                    class="flex-1"
                  >
                    <el-option
                      v-for="tag in tagOptions"
                      :key="tag"
                      :label="tag"
                      :value="tag"
                    />
                  </el-select>
                </div>
              </div>

              <el-dialog v-model="centerDialogVisible" width="700" align-center>
                <div class="border rounded p-4">
                  <div class="flex items-center justify-between mb-4">
                    <span class="font-medium">子任务列表</span>
                    <el-button
                      type="primary"
                      size="small"
                      class="!rounded-button"
                      @click="addSubTask"
                    >
                      添加子任务
                    </el-button>
                  </div>
                  <div
                    v-for="(subTask, index) in newTask.subTasks"
                    :key="index"
                    class="mb-4 space-y-2"
                  >
                    <div class="flex gap-2 items-center">
                      <el-input
                        v-model="subTask.description"
                        placeholder="任务名称"
                        class="flex-1"
                      />
                      <el-select
                        v-model="subTask.priority"
                        placeholder="优先级"
                        class="w-28"
                      >
                        <el-option label="高" value="high" />
                        <el-option label="中" value="medium" />
                        <el-option label="低" value="low" />
                      </el-select>
                      <el-button
                        type="danger"
                        size="small"
                        class="!rounded-button"
                        @click="removeSubTask(index)"
                        >删除</el-button
                      >
                    </div>

                    <div class="flex gap-2">
                      <el-date-picker
                        v-model="subTask.startTime"
                        type="datetime"
                        placeholder="开始时间"
                        class="flex-1"
                      />
                      <el-date-picker
                        v-model="subTask.endTime"
                        type="datetime"
                        placeholder="截止时间"
                        class="flex-1"
                      />
                    </div>

                    <div class="flex gap-2">
                      <el-select
                        v-model="subTask.tags"
                        multiple
                        placeholder="选择标签"
                        class="flex-1"
                      >
                        <el-option
                          v-for="tag in tagOptions"
                          :key="tag"
                          :label="tag"
                          :value="tag"
                        />
                      </el-select>
                    </div>
                  </div>
                </div>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false"
                      >取消</el-button
                    >
                    <el-button type="primary" @click="commitTask()">
                      确认
                    </el-button>
                  </div>
                </template>
              </el-dialog>

              <el-button
                type="primary"
                class="w-full !rounded-button"
                @click="createTask"
              >
                创建任务
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-animation">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import userStore from "@/store/user.js";
import { getHealthyState } from "@/utils/healthy.js";
import { formatDate } from "@/utils/formDate.js";
import {
  getTasksInfo,
  addTask,
  addBigTask,
  updateStatus,
  addBigTask1,
  deleteTask,
} from "@/api/api.js";

const centerDialogVisible = ref(false);
const store = userStore();
const { tasks, healthy } = store;
// 使用 computed 创建响应式计算属性
const bigTasks = computed(() =>
  tasks.filter((task) => task.subTasks.length !== 0)
);

let healthyState = ref("");
const taskList = ref([]);
const finishedTasks = computed(() =>
  taskList.value.filter((task) => task.status === 1)
);
const addSubTask = () => {
  console.log(666);
  newTask.value.subTasks.push({
    description: "",
    priority: null,
    startTime: "",
    endTime: "",
    tags: [],
    repeat: "false",
  });
};
const removeSubTask = (index) => {
  newTask.value.subTasks.splice(index, 1);
};
const taskType = ref("small");
// 新任务
const newTask = ref({
  id: "",
  description: "",
  startTime: "",
  endTime: "",
  repeat: "false",
  priority: "",
  tags: [],
  subTasks: [],
});

const tagOptions = reactive(["学习", "紧急", "日常"]);
const selectedTags = ref([]);

const getPriorityType = (priority) => {
  const types = {
    高: "danger",
    中: "warning",
    低: "info",
  };
  return types[priority] || "info";
};
const deleteSTask = (row) => {
  ElMessageBox.confirm("确认删除?", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 找到任务在数组中的索引
      const index = taskList.value.findIndex((item) => item.id === row.id);
      if (index !== -1) {
        deleteTask(
          {
            taskId: row.id,
          },
          {
            "Content-Type": "application/json",
          }
        ).then((res) => {
          console.log(res.data);
        });

        // 删除任务
        taskList.value.splice(index, 1);
        ElMessage({
          type: "success",
          message: "Delete completed",
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
};
const isLuZhi = ref(false);
// 任务状态切换
const toggleCheck = (row) => {
  if(row.status === 1){
    row.status = 0;
  }else {
    row.status = 1;
  }
  updateStatus(
    {
      taskId: parseInt(row.id),
      status: parseInt(row.status),
    },
    {
      "Content-Type": "application/json",
    }
  ).then((res) => {
    console.log(res.data);
  });
};
const isLoading = ref(false);
// 创建任务
const createTask = () => {
  if (!newTask.value.description) {
    ElMessage.warning("请输入任务名称");
    return;
  }

  if (taskType.value === "small") {
    const date = new Date(newTask.value.startTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    // 获取小时、分钟和秒数，并进行补零操作
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    const date1 = new Date(newTask.value.startTime);
    const year1 = date1.getFullYear();
    const month1 = String(date.getMonth() + 1).padStart(2, "0");
    const day1 = String(date.getDate()).padStart(2, "0");
    // 获取小时、分钟和秒数，并进行补零操作
    const hours1 = String(date.getHours()).padStart(2, "0");
    const minutes1 = String(date.getMinutes()).padStart(2, "0");
    const seconds1 = String(date.getSeconds()).padStart(2, "0");
    const formattedDate1 = `${year1}-${month1}-${day1}T${hours1}:${minutes1}:${seconds1}`;
    newTask.value.endTime = formatDate(newTask.value.endTime);
    if (!newTask.value.endTime) {
      ElMessage.warning("请选择截止时间");
      return;
    }
    if (!newTask.value.priority) {
      ElMessage.warning("请选择优先级");
      return;
    }
    addTask(
      {
        description: newTask.value.description,
        priority: newTask.value.priority,
        repeat: false,
        startTime: formattedDate,
        endTime: formattedDate1,
        estimatedTime: 6000,
        tags: newTask.value.tags,
        dependsOn: [],
        uses: [],
        affectedBy: [],
      },
      {
        "Content-Type": "application/json",
      }
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    taskList.value.push({
      description: newTask.value.description,
      endTime: newTask.value.endTime,
      priority: newTask.value.priority,
      tags: newTask.value.tags,
      state: 0,
      startTime: "",
      subTasks: newTask.value.subTasks,
      repeat: "false",
    });
    // 重置表单
    newTask.value = {
      id: "",
      description: "",
      startTime: "",
      endTime: "",
      priority: "",
      tags: [],
      subTasks: [],
      repeat: "false",
    };
    selectedTags.value = [];
    ElMessage.success("创建任务成功");
  } else {
    console.log("大任务");
    isLoading.value = true;
    addBigTask(
      {
        taskPrompt: newTask.value.description,
      },
      {
        "Content-Type": "application/json",
      }
    )
      .then((res) => {
        console.log(res.data);
        isLoading.value = false;
        res.data.data.sub_tasks.forEach((item) => {
          newTask.value.subTasks.push(item);
        });
        newTask.value.subTasks.forEach((item) => {
          console.log(item.endTime);
        });
        taskList.value.push({
          description: newTask.value.description,
          endTime: newTask.value.endTime,
          priority: newTask.value.priority,
          tags: newTask.value.tags,
          state: 0,
          startTime: newTask.value.startTime,
          subTasks: newTask.value.subTasks,
          repeat: newTask.value.repeat,
        });
        centerDialogVisible.value = true;
        ElMessage.success("创建任务成功");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
// 添加大任务
const commitTask = () => {
  addBigTask1(
    {
      main_task: newTask.value.description,
      sub_tasks: newTask.value.subTasks,
    },
    {
      "Content-Type": "application/json",
    }
  ).then((res) => {
    console.log(res.data);
  });

  centerDialogVisible.value = false;
};
onMounted(() => {
  healthyState.value = getHealthyState(healthy.point);
  getTasksInfo().then((res) => {
    console.log(res.data);
    res.data.data.forEach((item) => {
      item.startTime = formatDate(item.startTime);
      item.endTime = formatDate(item.endTime);
      taskList.value.push(item);
    });
  });
});
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
.check-box:hover {
  cursor: pointer;
}

/* 加载动画样式 */
.loading-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
