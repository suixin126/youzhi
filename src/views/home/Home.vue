<template>
  <!-- 全屏加载组件 -->
  <div v-if="isLoading" class="fullscreen-loading">
    <div class="loading-spinner"></div>
    <div class="loading-text">拼命加载中...</div>
  </div>
  <div class="min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <div class="pt-4 pb-8 max-w-8xl mx-auto px-4">
      <!-- 状态卡片 -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">今日待办</h3>
            <span class="text-3xl font-semibold text-blue-500">{{
              taskList.length
            }}</span>
          </div>
          <div class="flex items-center text-gray-600">
            <el-icon class="mr-2"><Check /></el-icon>
            <span
              >已完成
              {{ taskList.filter((task) => task.status === 1).length }}
              项任务</span
            >
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">学习时长</h3>
            <span class="text-3xl font-semibold text-green-500"
              >{{ todayStudyTime }}h</span
            >
          </div>
          <div class="flex items-center text-gray-600">
            <el-icon
              v-if="todayStudyTime - yesterDatyStudyTime > 0"
              class="mr-2"
            >
              <ArrowUp />
            </el-icon>
            <el-icon v-else class="mr-2">
              <ArrowDown />
            </el-icon>
            <span
              >较昨日{{
                todayStudyTime - yesterDatyStudyTime > 0 ? "增加" : "减少"
              }}{{
                todayStudyTime - yesterDatyStudyTime > 0
                  ? (todayStudyTime - yesterDatyStudyTime).toFixed(1)
                  : (yesterDatyStudyTime - todayStudyTime).toFixed(1)
              }}h</span
            >
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">健康指数</h3>
            <span class="text-3xl font-semibold text-orange-500">{{
              healthy.point
            }}</span>
          </div>
          <div class="flex items-center text-gray-600">
            <el-icon class="mr-2"><Star /></el-icon>
            <span> {{ healthyState }} </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <!-- 左侧日程区域 -->
        <div class="col-span-2 space-y-6">
          <!-- 今日日程 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium mb-6">今日日程</h3>
            <div class="flex space-x-4 mb-6">
              <el-button
                :class="{
                  '!bg-blue-500 text-white': filterStatus === 'all',
                  '!bg-gray-200 text-gray-600': filterStatus !== 'all',
                }"
                @click="filterStatus = 'all'"
                class="!rounded-button"
              >
                全部
              </el-button>
              <el-button
                :class="{
                  '!bg-blue-500 text-white': filterStatus === 'completed',
                  '!bg-gray-200 text-gray-600': filterStatus !== 'completed',
                }"
                @click="filterStatus = 'completed'"
                class="!rounded-button"
              >
                已完成
              </el-button>
              <el-button
                :class="{
                  '!bg-blue-500 text-white': filterStatus === 'pending',
                  '!bg-gray-200 text-gray-600': filterStatus !== 'pending',
                }"
                @click="filterStatus = 'pending'"
                class="!rounded-button"
              >
                未完成
              </el-button>
            </div>
            <div class="space-y-4">
              <div
                class="flex items-start p-4 bg-blue-50 rounded-lg"
                v-for="(item, index) in currentTaskList"
                :key="index"
              >
                <div class="w-20">
                  <div
                    style="text-align: center; line-height: 50px"
                    class="text-lg font-medium"
                  >
                    {{ item.startTime.split("T")[1].split(":")[0] }}:{{
                      item.startTime.split("T")[1].split(":")[1]
                    }}
                  </div>
                </div>
                <div class="flex-1 ml-4">
                  <div
                    style="text-align: center; line-height: 50px"
                    class="font-medium"
                  >
                    {{ item.description }}
                  </div>
                </div>
                <div style="text-align: center; line-height: 50px">
                  <el-button
                    :type="item.status === 1 ? 'success' : 'danger'"
                    class="!rounded-button"
                    @click="changeStatus(item)"
                    >{{ item.status !== 1 ? "未完成" : "已完成" }}</el-button
                  >
                </div>
                <div
                  style="
                    text-align: center;
                    line-height: 50px;
                    margin-left: 20px;
                  "
                >
                  <!-- 查看详情按钮 -->
                  <el-button
                    type="primary"
                    class="!rounded-button"
                    @click="showDetailDialog(item)"
                    >查看详情</el-button
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 日历显示 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium">日历</h3>
            </div>
            <el-calendar
              ref="calendar"
              v-model="value"
              @input="handleCellClick"
            >
              <template #header>
                <span>{{ formatDate(value) }}</span>
                <el-button-group>
                  <el-button size="small" @click="selectDate('prev-year')">
                    上一年
                  </el-button>
                  <el-button size="small" @click="selectDate('prev-month')">
                    上个月
                  </el-button>
                  <el-button size="small" @click="selectDate('today')"
                    >今天</el-button
                  >
                  <el-button size="small" @click="selectDate('next-month')">
                    下个月
                  </el-button>
                  <el-button size="small" @click="selectDate('next-year')">
                    下一年
                  </el-button>
                </el-button-group>
              </template>
            </el-calendar>
          </div>
        </div>

        <!-- 右侧信息栏 -->
        <div class="space-y-6">
          <!-- 健康状态 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium mb-6">健康状态</h3>
            <div class="space-y-6">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">今日步数</span>
                  <span class="font-medium">{{ healthy.stepCount }} 步</span>
                </div>
                <!-- 总2万步 -->
                <el-progress
                  :percentage="
                    (healthy.stepCount * 100) / targets.totalFoot >= 100
                      ? 100
                      : parseFloat(
                          (
                            (healthy.stepCount * 100) /
                            targets.totalFoot
                          ).toFixed(1)
                        )
                  "
                  color="#10B981"
                />
              </div>

              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">睡眠时长</span>
                  <span class="font-medium">{{ healthy.sleepTime }} 小时</span>
                </div>
                <!-- 总8h -->
                <el-progress
                  :percentage="
                    (healthy.sleepTime * 100) / targets.totalSleepTime >= 100
                      ? 100
                      : parseFloat(
                          (
                            (healthy.sleepTime * 100) /
                            targets.totalSleepTime
                          ).toFixed(1)
                        )
                  "
                  color="#F59E0B"
                />
              </div>
            </div>
          </div>

          <!-- 待办任务 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-medium mb-6">今日待办</h3>
            <div class="space-y-4">
              <div
                v-for="(item, index) in taskList.filter(
                  (task) => task.status !== 1
                )"
                :key="index"
                :class="
                  index % 2
                    ? 'flex items-center justify-between p-3 bg-red-50 rounded-lg'
                    : 'flex items-center justify-between p-3 bg-orange-50 rounded-lg'
                "
              >
                <span class="font-medium">{{ item.description }}</span>
                <span class="text-red-500 text-sm"
                  >{{ item.startTime.split("T")[1].split(":")[0] }}:{{
                    item.startTime.split("T")[1].split(":")[1]
                  }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <!-- 某日的任务 -->
      <el-dialog
        :show-close="false"
        v-model="showDialog"
        title="任务管理"
        width="80%"
        center
      >
        <el-table :data="currentTasks" border style="width: 100%">
          <el-table-column prop="description" label="任务描述" width="200">
            <template #default="{ row }">
              <el-input v-model="row.description"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="180">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.startTime"
                type="datetime"
                format="YYYY-MM-DD HH:mm"
              ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="截至时间" width="180">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.endTime"
                type="datetime"
                format="YYYY-MM-DD HH:mm"
              ></el-date-picker>
            </template>
          </el-table-column>
          <!-- 优先级 -->
          <el-table-column prop="priority" label="优先级" width="120">
            <template #default="{ row }">
              <el-select v-model="row.priority">
                <el-option
                  v-for="item in priorityOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </template>
          </el-table-column>
          <!-- 标签 -->
          <el-table-column prop="tags" label="标签">
            <template #default="{ row }">
              <el-select
                v-model="row.tags"
                multiple
                filterable
                allow-create
                placeholder="请添加标签"
              />
            </template>
          </el-table-column>

          <!-- 是否完成 -->
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-button
                @click="BenDichangeStatus(row)"
                :type="row.status === 1 ? 'success' : 'danger'"
                >{{ row.status === 1 ? "已完成" : "未完成" }}</el-button
              >
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-button
                type="danger"
                icon="Delete"
                circle
                @click="handleTasksDelete(row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[3, 5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tasks.length"
        >
        </el-pagination>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="cancelTasks()">取消</el-button>
            <el-button type="primary" @click="saveTasks()"> 保存 </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 详情信息 -->
      <el-dialog
        :show-close="false"
        v-model="detailVisible"
        title="任务详情"
        width="60%"
        center
      >
        <!-- 将 detailTask 对象包装成数组 -->
        <el-table :data="[detailTask]" style="width: 100%">
          <!-- 任务描述 -->
          <el-table-column prop="description" label="任务描述" width="300">
            <template #default="{ row }">
              <el-input v-model="row.description" />
            </template>
          </el-table-column>

          <!-- 开始时间 -->
          <el-table-column prop="startTime" label="开始时间">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.startTime"
                type="datetime"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </template>
          </el-table-column>

          <!-- 截止时间 -->
          <el-table-column prop="endTime" label="截止时间">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.endTime"
                type="datetime"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </template>
          </el-table-column>

          
        </el-table>
        <el-table :data="[detailTask]" style="width: 100%">
          <!-- 优先级 -->
          <el-table-column prop="priority" label="优先级" width="120">
            <template #default="{ row }">
              <el-select v-model="row.priority">
                <el-option
                  v-for="item in priorityOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </template>
          </el-table-column>

          <!-- 标签 -->
          <el-table-column prop="tags" label="标签">
            <template #default="{ row }">
              <el-select
                v-model="row.tags"
                multiple
                filterable
                allow-create
                placeholder="请添加标签"
              />
            </template>
          </el-table-column>

          <!-- 状态 -->
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-button
                @click="BenDichangeStatus(row)"
                :type="row.status === 1 ? 'success' : 'danger'"
              >
                {{ row.status === 1 ? "已完成" : "未完成" }}
              </el-button>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button
                type="danger"
                icon="Delete"
                circle
                @click="handleTaskDelete(row)"
              />
            </template>
          </el-table-column>
        </el-table>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="cancelTask()">取消</el-button>
            <el-button type="primary" @click="saveTask()">保存</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onBeforeMount, computed } from "vue";
import { format } from "date-fns";
import { ElMessageBox, type CalendarInstance, ElMessage } from "element-plus";
import {
  getTasksInfo,
  getRandomTask,
  deleteTask,
  updateStatus,
  updateTaskInfo,
  getWeekStudyTime,
  getHealthData,
} from "@/api/api.js";
import { ArrowDown } from "@element-plus/icons-vue";
let targets = reactive({
  totalFoot: 1,
  totalSleepTime: 1,
});
import { calculateHealthPoint } from "@/utils/healthyMethods.js";
// 全屏动画加载
const isLoading = ref(true);
// 当前页数
const currentPage = ref(1);
// 每页大小
const pageSize = ref(3);
const yesterDatyStudyTime = ref(0);
const todayStudyTime = ref(0);
// 当前任务
const currentTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tasks.slice(start, end);
});
// 处理大小变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
};
// 处理当前页
const handleCurrentChange = (page) => {
  currentPage.value = page;
};
// 本地状态改变
const BenDichangeStatus = (item) => {
  if (item.status === 1) {
    item.status = -1;
  } else {
    item.status = 1;
  }
};
// 优先级
const priorityOptions = [1, 2, 3, 4, 5];
// 某日的任务
let tasks = reactive([]);
// 某日任务展示
const showDialog = ref(false);
// 修改状态
const changeStatus = (item) => {
  if (item.status === 1) {
    item.status = -1;
  } else {
    item.status = 1;
  }
  taskList.forEach((task) => {
    if (task.id === item.id) {
      task.status = item.status;
    }
  });
  updateStatus(
    {
      taskId: item.id,
      status: item.status,
    },
    {
      "Content-Type": "application/json",
    }
  )
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
// 任务详情取消
const cancelTask = () => {
  detailVisible.value = false;
  detailTask = {};
  taskList.length = 0;
  // 重新获取任务
  getTasksInfo()
    .then((res) => {
      if (res.data.data) {
        res.data.data.forEach((item) => {
          taskList.push(item);
        });
        currentTaskList = taskList.sort((a, b) => {
          const dateA = new Date(a.startTime).getTime(); // 获取时间戳
          const dateB = new Date(b.startTime).getTime(); // 获取时间戳
          return dateA - dateB;
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// 多任务取消
const cancelTasks = () => {
  showDialog.value = false;
};
// 删除多任务
const handleTasksDelete = (row) => {
  ElMessageBox.confirm("是否删除该任务?", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteTask(
        {
          taskId: row.id,
        },
        {
          "Content-Type": "application/json",
        }
      )
        .then((res) => {
          console.log(res.data);
          ElMessage({
            type: "success",
            message: "删除成功",
          });
          const index = tasks.findIndex((item) => item.id === row.id);
          if (index !== -1) {
            tasks.splice(index, 1);
          }
        })
        .catch((err) => {
          ElMessage({
            type: "error",
            message: err.message,
          });
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
// 删除单任务
const handleTaskDelete = (row) => {
  ElMessageBox.confirm("是否删除该任务?", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteTask(
        {
          taskId: row.id,
        },
        {
          "Content-Type": "application/json",
        }
      )
        .then((res) => {
          console.log(res.data);
          ElMessage({
            type: "success",
            message: "删除成功",
          });
          const index = currentTaskList.findIndex((item) => item.id === row.id);
          if (index !== -1) {
            currentTaskList.splice(index, 1);
          }
          detailVisible.value = false;
          detailTask = {};
        })
        .catch((err) => {
          ElMessage({
            type: "error",
            message: err.message,
          });
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
// 保存多修改
const saveTasks = () => {
  ElMessageBox.confirm("是否保存更改?", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "修改成功",
      });
      updateTaskInfo(tasks, {
        "Content-Type": "application/json",
      });
      showDialog.value = false;
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消修改",
      });
    });
};
// 保存单个任务
const saveTask = () => {
  ElMessageBox.confirm("是否保存更改?", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      updateTaskInfo([detailTask], {
        "Content-Type": "application/json",
      })
        .then((res) => {
          console.log(res.data);
          ElMessage({
            type: "success",
            message: "修改成功",
          });
          detailVisible.value = false;
          detailTask = {};
        })
        .catch((err) => {
          console.log(err);
        });

      taskList.length = 0;
      // 重新获取任务
      getTasksInfo()
        .then((res) => {
          if (res.data.data) {
            res.data.data.forEach((item) => {
              taskList.push(item);
            });
            currentTaskList = taskList.sort((a, b) => {
              const dateA = new Date(a.startTime).getTime(); // 获取时间戳
              const dateB = new Date(b.startTime).getTime(); // 获取时间戳
              return dateA - dateB;
            });
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消修改",
      });
    });
};
//当天的健康数据
const healthy = ref({
  point: 0, // 指数
  stepCount: 0, // 步数
  sleepTime: 0, // 睡眠时长
  heartRate: 0, // 心率
});
// 健康状态
const healthyState = ref("");
// 任务类型选择
const filterStatus = ref("all");
// 任务列表
const taskList = reactive([]);
// 当前选择的任务
let currentTaskList = reactive([]);
// 当前的详情任务
let detailTask = reactive({});
const value = ref(new Date());
// 任务详情展示
const detailVisible = ref(false);
const showDetailDialog = (task) => {
  console.log(task);
  detailTask = JSON.parse(JSON.stringify(task));
  detailVisible.value = true;
};
// 处理日历单元格点击事件
const handleCellClick = (date) => {
  tasks.length = 0;
  showDialog.value = true;
  const formatTime = formatDate(date);
  getRandomTask({
    date: formatTime,
  }).then((res) => {
    console.log(res.data);
    res.data.data.forEach((item) => {
      tasks.push(item);
    });
  });
};

const calendar = ref<CalendarInstance>();
// 日期切换逻辑
const selectDate = (type) => {
  let date = new Date(value.value);

  switch (type) {
    case "prev-year":
      date.setFullYear(date.getFullYear() - 1);
      break;
    case "prev-month":
      date.setMonth(date.getMonth() - 1);
      break;
    case "today":
      date = new Date();
      break;
    case "next-month":
      date.setMonth(date.getMonth() + 1);
      break;
    case "next-year":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  value.value = date;
};
// 格式化日期函数
const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};
watch(filterStatus, (newValue) => {
  if (newValue === "all") {
    currentTaskList = [...taskList];
  } else if (newValue === "completed") {
    currentTaskList = taskList.filter((task) => task.status === 1);
  } else {
    currentTaskList = taskList.filter((task) => task.status !== 1);
  }
});
const loadAllData = async () => {
  getTasksInfo()
    .then((res) => {
      if (res.data.data) {
        res.data.data.forEach((item) => {
          taskList.push(item);
        });
        currentTaskList = taskList.sort((a, b) => {
          const dateA = new Date(a.startTime).getTime(); // 获取时间戳
          const dateB = new Date(b.startTime).getTime(); // 获取时间戳
          return dateA - dateB;
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
  getWeekStudyTime()
    .then((res) => {
      if (res.data.data.length !== 0) {
        todayStudyTime.value = parseFloat(
          (res.data.data[0].totalDuration / 60).toFixed(1)
        );
        yesterDatyStudyTime.value = parseFloat(
          (res.data.data[1].totalDuration / 60).toFixed(1)
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });

  //获取今日的健康数据
  getHealthData()
    .then((res) => {
      if (res.data.data == null) {
        ElMessage.error(res.data.message);
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
};
// 初始化加载
onBeforeMount(async () => {
  if (localStorage.getItem("isLoading")) {
    isLoading.value =
      localStorage.getItem("isLoading") === "false" ? false : true;
  }
  if (localStorage.getItem("targets")) {
    targets = JSON.parse(localStorage.getItem("targets"));
  }
  try {
    // 同时等待：1.所有数据加载 2.至少1秒时长
    await Promise.all([
      loadAllData(),
      setTimeout(() => {
        isLoading.value = false;
      }, 1000),
    ]);
  } catch (error) {
    ElMessage.error(`数据加载失败: ${error.message}`);
  } finally {
    localStorage.setItem("isLoading", "false");
  }
});
</script>

<style scoped>
/* 全屏加载样式 */

:deep(.el-input__wrapper) {
  background-color: #f3f4f6;
  border: none;
  box-shadow: none !important;
  padding-left: 1rem;
  padding-right: 1rem;
}

:deep(.el-input__inner) {
  font-size: 0.875rem;
  height: 2.5rem;
}

:deep(.el-progress-bar__outer) {
  background-color: #f3f4f6 !important;
  height: 8px !important;
}

:deep(.el-button) {
  height: 2.25rem;
  padding: 0 1rem;
}

:deep(.el-input__suffix) {
  color: #6b7280;
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
