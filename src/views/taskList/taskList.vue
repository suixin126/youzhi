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
            <span class="text-gray-500 ml-3">已完成
              {{taskList.filter((task) => task.status === 1).length}}
              项任务</span>
          </div>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="text-gray-600 mb-2">学习时长</div>
          <div class="flex items-end">
            <span class="text-4xl font-medium">{{ todayStudyTime }}h</span>
            <span class="text-gray-500 ml-3">较昨日{{
              todayStudyTime - yesterDatyStudyTime > 0 ? "增加" : "减少"
            }}{{
                todayStudyTime - yesterDatyStudyTime > 0
                  ? (todayStudyTime - yesterDatyStudyTime).toFixed(1)
                  : (yesterDatyStudyTime - todayStudyTime).toFixed(1)
              }}h</span>
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
              <el-table-column prop="startTime" :formatter="formatTime" label="开始时间" width="180" />
              <el-table-column prop="priority" label="优先级" width="100">
                <template #default="{ row }">
                  <el-tag size="small">
                    {{ row.priority }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button type="danger" @click="deleteSTask(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 右侧新建任务 -->
        <div class="w-96">
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-medium">新建任务</h2>
              <el-button :type="isListening ? 'info' : 'primary'" class="flex items-center !rounded-button"
                @click="toggleRecording">
                <el-icon class="mr-1">
                  <Microphone />
                </el-icon>
                {{ isListening ? "停止录音" : "语音输入" }}
              </el-button>
            </div>

            <div class="space-y-4">
              <div>
                <el-radio-group v-model="taskType" class="mb-4">
                  <el-radio-button value="small">小任务</el-radio-button>
                  <el-radio-button value="big">大任务</el-radio-button>
                </el-radio-group>
              </div>

              <el-input v-model="newTask.description" placeholder="输入任务名称" />

              <el-date-picker v-if="taskType == 'small'" v-model="newTask.startTime" type="datetime"
                placeholder="选择开始时间" style="width: 100%" />

              <el-date-picker v-if="taskType == 'small'" v-model="newTask.endTime" type="datetime" placeholder="选择截止时间"
                style="width: 100%" />

              <el-select v-if="taskType == 'small'" v-model="newTask.priority" placeholder="选择优先级" style="width: 100%">
                <el-option label="1" value="1" />
                <el-option label="2" value="2" />
                <el-option label="3" value="3" />
                <el-option label="4" value="4" />
                <el-option label="5" value="5" />
              </el-select>
              <div v-if="taskType == 'small'">
                <div class="mb-2">任务标签</div>
                <el-select v-model="newTask.tags" multiple filterable allow-create placeholder="请添加标签" />
              </div>

              <el-dialog v-model="centerDialogVisible" width="700" align-center>
                <div class="border rounded p-4">
                  <!-- 标题和添加按钮 -->
                  <div class="flex items-center justify-between mb-4">
                    <span class="font-medium">子任务列表（共{{ totalSubTasks }}项）</span>
                    <el-button type="primary" size="small" class="!rounded-button" @click="addSubTask">
                      添加子任务
                    </el-button>
                  </div>

                  <!-- 分页内容 -->
                  <template v-if="paginatedSubTasks.length > 0">
                    <!-- 子任务列表 -->
                    <div v-for="(subTask, index) in paginatedSubTasks" :key="currentPage * pageSize + index"
                      class="mb-4 space-y-2">
                      <div class="flex gap-2 items-center">
                        <el-input v-model="subTask.description" placeholder="任务名称" class="flex-1" />
                        <el-select v-model="subTask.priority" placeholder="优先级" class="w-28">
                          <el-option label="1" value="1" />
                          <el-option label="2" value="2" />
                          <el-option label="3" value="3" />
                          <el-option label="4" value="4" />
                          <el-option label="5" value="5" />
                        </el-select>
                        <el-button type="danger" size="small" class="!rounded-button"
                          @click="removeSubTask(index)">删除</el-button>
                      </div>

                      <div class="flex gap-2">
                        <el-date-picker v-model="subTask.startTime" type="datetime" placeholder="开始时间" class="flex-1" />
                        <el-date-picker v-model="subTask.endTime" type="datetime" placeholder="截止时间" class="flex-1" />
                      </div>

                      <div class="flex gap-2">
                        <el-select v-model="subTask.tags" multiple placeholder="选择标签" class="flex-1">
                          <el-option v-for="tag in tagOptions" :key="tag" :label="tag" :value="tag" />
                        </el-select>
                      </div>
                    </div>

                    <!-- 分页控件 -->
                    <el-pagination small layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize"
                      :total="totalSubTasks" @current-change="handlePageChange" class="mt-4 justify-center" />
                  </template>

                  <!-- 无数据提示 -->
                  <div v-else class="text-gray-400 text-center py-4">
                    暂无子任务，点击上方按钮添加
                  </div>
                </div>

                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="commitTask()">确认</el-button>
                  </div>
                </template>
              </el-dialog>

              <el-button type="primary" class="w-full !rounded-button" @click="createTask">
                创建任务
              </el-button>
              <div style="margin-bottom: 10px; font-size: small; color: #22c55e">
                注：大任务由AI智能分解
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="fullscreen-loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">任务分解中...</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onUnmounted,
  computed,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getTasksInfo,
  addTask,
  addBigTask,
  updateStatus,
  addBigTask1,
  deleteTask,
  getWeekStudyTime,
  getHealthData,
} from "@/api/api.js";
import { format } from "date-fns";
import { calculateHealthPoint } from "@/utils/healthyMethods.js";
// 分页相关状态
const currentPage = ref(1);
const pageSize = ref(5);
const totalSubTasks = computed(() => newTask.value.subTasks.length);
const paginatedSubTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return newTask.value.subTasks.slice(start, start + pageSize.value);
});
// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page;
};
const isListening = ref(false);
let recognition = null;

// 初始化语音识别
const initializeRecognition = async () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("当前浏览器不支持语音识别");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    stream.getTracks().forEach((track) => track.stop());
  } catch (error) {
    console.error("麦克风权限被拒绝或获取失败:", error);
    return false;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "zh-CN"; // 设置中文识别

  recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcriptResult = event.results[current][0].transcript;
    newTask.value.description = event.results[current][0].transcript;
  };

  recognition.onerror = (event) => {
    console.error("语音识别错误:", event.error);
  };
  return true;
};

// 切换录音状态
const toggleRecording = async () => {
  if (!recognition) return;

  if (!isListening.value) {
    const hasPermission = await initializeRecognition();
    if (hasPermission) {
      recognition.start();
    } else {
      alert("需要麦克风权限才能使用语音识别功能");
    }
  } else {
    recognition.stop();
  }
  isListening.value = !isListening.value;
};

// 初始化组件时加载语音识别
onMounted(() => {
  initializeRecognition();
});
onUnmounted(() => {
  recognition.stop();
  recognition = null;
  isListening.value = false;
});
// 格式化日期
const formatTime = (row, column, cellValue) => {
  if (!cellValue) return ""; // 如果没有值，返回空字符串
  const time = new Date(cellValue); // 将字符串转换为 Date 对象
  const hours = time.getHours().toString().padStart(2, "0"); // 获取小时并补零
  const minutes = time.getMinutes().toString().padStart(2, "0"); // 获取分钟并补零
  return `${hours}:${minutes}`; // 返回 HH:mm 格式
};
const centerDialogVisible = ref(false);
//当天的健康数据
const healthy = ref({
  point: 0, // 指数
  stepCount: 0, // 步数
  sleepTime: 0, // 睡眠时长
  heartRate: 0, // 心率
});
let healthyState = ref("");
const taskList = ref([]);
const addSubTask = () => {
  newTask.value.subTasks.push({
    description: "",
    priority: null,
    startTime: "",
    endTime: "",
    tags: [],
    repeat: "false",
  });
  // 自动跳转到最后一页
  currentPage.value = Math.ceil(newTask.value.subTasks.length / pageSize.value);
};
const removeSubTask = (index) => {
  newTask.value.subTasks.splice(index, 1);
  // 如果当前页没有数据且不是第一页，返回上一页
  if (paginatedSubTasks.value.length === 0 && currentPage.value > 1) {
    currentPage.value--;
  }
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

const tagOptions = reactive([]);
const selectedTags = ref([]);

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
// 任务状态切换
const toggleCheck = (row) => {
  if (row.status === 1) {
    row.status = 0;
  } else {
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
const formatDate = (date) => {
  return format(date, "hh:mm");
};
const formatT = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  // 获取小时、分钟和秒数，并进行补零操作
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  return formattedDate;
};
// 创建任务
const createTask = () => {
  if (!newTask.value.description) {
    ElMessage.warning("请输入任务名称");
    return;
  }

  if (taskType.value === "small") {
    taskList.value.push({
      description: newTask.value.description,
      endTime: newTask.value.endTime,
      priority: newTask.value.priority,
      tags: newTask.value.tags,
      state: 0,
      startTime: newTask.value.startTime,
      subTasks: newTask.value.subTasks,
      repeat: "false",
    });
    const date = new Date(newTask.value.startTime);
    const formattedDate = formatT(date);
    const date1 = new Date(newTask.value.startTime);
    const formattedDate1 = formatT(date1);
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
        taskList.value.length = 0;
        getTasksInfo().then((res) => {
          if (res.data.data) {
            res.data.data.forEach((item) => {
              taskList.value.push(item);
            });
            taskList.value = taskList.value.sort((a, b) => {
              const dateA = new Date(a.startTime).getTime(); // 获取时间戳
              const dateB = new Date(b.startTime).getTime(); // 获取时间戳
              return dateA - dateB;
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
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
        console.log(newTask.value.subTasks);
        newTask.value.subTasks.forEach((item) => {
          console.log(item.endTime);
        });
        centerDialogVisible.value = true;
        ElMessage.success("创建任务成功");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
const yesterDatyStudyTime = ref(0);
const todayStudyTime = ref(0);

// 添加大任务
const commitTask = () => {
  newTask.value.subTasks.forEach((item) => {
    console.log(item.endTime);
    console.log(item.startTime);
    if (!(typeof item.endTime === "string")) {
      item.endTime = formatT(item.endTime);
    }
    if (!(typeof item.startTime === "string")) {
      item.startTime = formatT(item.startTime);
    }
  });
  console.log(newTask.value.subTasks);
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
  });
  taskList.value.length = 0;
  // 重新获取
  getTasksInfo().then((res) => {
    if (res.data.data) {
      res.data.data.forEach((item) => {
        taskList.value.push(item);
      });
      taskList.value = taskList.value.sort((a, b) => {
        const dateA = new Date(a.startTime).getTime(); // 获取时间戳
        const dateB = new Date(b.startTime).getTime(); // 获取时间戳
        return dateA - dateB;
      });
    }
  });
  centerDialogVisible.value = false;
};

onBeforeMount(() => {
  getWeekStudyTime()
    .then((res) => {
      if (res.data.data.length !== 0) {
        if (res.data.data[0].workDate == new Date().toISOString().split('T')[0]) {
          todayStudyTime.value = parseFloat(
            (res.data.data[0].totalDuration / 60).toFixed(1)
          );
          if (res.data.data.length > 1) {
            yesterDatyStudyTime.value = parseFloat(
              (res.data.data[1].totalDuration / 60).toFixed(1)
            )
          }
        }
        else {
          yesterDatyStudyTime.value = parseFloat(
            (res.data.data[0].totalDuration / 60).toFixed(1)
          );
        }

      }
    })
    .catch((err) => {
      console.log(err);
    });
  getTasksInfo().then((res) => {
    if (res.data.data) {
      res.data.data.forEach((item) => {
        taskList.value.push(item);
      });
      taskList.value = taskList.value.sort((a, b) => {
        const dateA = new Date(a.startTime).getTime(); // 获取时间戳
        const dateB = new Date(b.startTime).getTime(); // 获取时间戳
        return dateA - dateB;
      });
    }
  });

  //获取今日的健康数据
  getHealthData()
    .then((res) => {
      if (res.data.data == null) {
        //只提醒一次
        if (localStorage.getItem("message") == null) {
          localStorage.setItem("message", "true");
          ElMessage.error(res.data.message);
        }
        return;
      }
      //初始化用户今日健康数据
      healthy.value.heartRate = Math.round(res.data.data[0].heartRate);
      healthy.value.stepCount = Math.round(res.data.data[0].stepCount);
      healthy.value.sleepTime = Math.round(res.data.data[0].sleepTime);
      //计算健康指数
      calculateHealthPoint(healthy, healthyState);
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<style scoped>
/* 分页样式调整 */
:deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
}

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

.fullscreen-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 16px;
  color: #606266;
  font-size: 14px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
