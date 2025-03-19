<template>
  <div class="headBar-contain">
    <!-- 顶部搜索栏 -->
    <div class="mb-8 flex items-center justify-between">
      <div class="relative flex-1 max-w-2xl mx-auto">
        <el-input
          v-model="taskName"
          placeholder="搜索任务或日程..."
          class="!rounded-full"
          @input="handleInput"
          @focus="showSuggestions = true"
        >
          <template #prefix>
            <el-icon @click="queryTask" class="text-gray-400">
              <Search />
            </el-icon>
          </template>
        </el-input>

        <!-- 任务列表下拉框 -->
        <div
          ref="container"
          v-if="showSuggestions && taskList.length"
          class="suggestion-list"
        >
          <div
            v-for="task in taskList"
            :key="task.id"
            class="suggestion-item"
            @click="selectTask(task)"
          >
            {{ task.description }}
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <el-badge :value="informCount" class="mr-4" @click="openInformDialog()">
          <el-icon class="text-xl text-gray-600">
            <Bell />
          </el-icon>
        </el-badge>
        <el-avatar :size="40" :src="userInfo.avatar" @click="toPersonal()" />
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

    <el-dialog v-model="tasksDialogVisible" title="任务列表" width="80%">
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
              @click="changeStatus(row)"
              :type="row.status === 1 ? 'success' : 'info'"
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
              @click="handleTaskDelete(row)"
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
        :total="taskList.length"
      >
      </el-pagination>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelTasks()">取消</el-button>
          <el-button type="primary" @click="saveTasks()"> 保存 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref,computed } from "vue";
import { useRouter } from "vue-router";
import userStore from "@/store/user.js";
import {
  searchTask,
  updateStatus,
  deleteTask,
  updateTaskInfo,
} from "@/api/api.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { onClickOutside } from "@vueuse/core";
const currentPage = ref(1);
const pageSize = ref(3);
const currentTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return taskList.slice(start, end);
});
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
};
const taskName = ref("");
const router = useRouter();
const store = userStore();
const { userInfo } = store;
const tasksDialogVisible = ref(false);
const taskList = reactive([]);
const showSuggestions = ref(false);
const container = ref(null);
// 点击外部关闭下拉
onClickOutside(container, () => {
  showSuggestions.value = false;
});
// 输入处理（添加防抖）
let timeout = null;
const handleInput = () => {
  timeout = setTimeout(async () => {
    try {
      const res = await searchTask({ keyword: taskName.value });
      taskList.length = 0; // 清空旧数据
      if (res.data.data?.length) {
        taskList.push(...res.data.data);
      }
      console.log(taskList);
      showSuggestions.value = taskName.value.length > 0;
    } catch (err) {
      console.error(err);
    }
  }, 300);
};
const cancelTasks = () => {
  taskList.length = 0;
  tasksDialogVisible.value = false;
};
// 选择任务
const selectTask = (task) => {
  taskName.value = task.description;
  showSuggestions.value = false;
  taskList.length = 0; // 清空搜索结果
};
const saveTasks = () => {
  ElMessageBox.confirm("是否保存修改？", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      updateTaskInfo(taskList, {
        "Content-Type": "application/json",
      })
        .then((res) => {
          console.log(res.data);
          ElMessage({
            message: "修改成功",
            type: "success",
          });
          tasksDialogVisible.value = false;
        })
        .catch((err) => {
          console.log(err.message);
        });
    })
    .catch(() => {
      ElMessage({
        message: "取消修改",
        type: "info",
      });
    });
};
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
};
// 删除任务
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
          const index = taskList.findIndex((item) => item.id === row.id);
          if (index !== -1) {
            taskList.splice(index, 1);
          }
          tasksDialogVisible.value = false;
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
const priorityOptions = [1, 2, 3, 4, 5];
// 搜索按钮处理
const queryTask = () => {
  showSuggestions.value = false;
  searchTask({ keyword: taskName.value })
    .then((res) => {
      taskList.length = 0;
      if (res.data.data?.length) {
        taskList.push(...res.data.data);
        tasksDialogVisible.value = true;
      } else {
        ElMessage.info("没有找到相关任务");
      }
    })
    .catch((err) => {
      ElMessage.error(err.message);
    });
};

// 通知消息数据
const informs = ref([
  { title: "新任务提醒", content: "您有一个新的任务需要处理" },
  { title: "日程安排", content: "明天上午10点有一个会议" },
  { title: "消息通知", content: "您有一条新的消息" },
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
  router.push("/personalInformation");
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
.text-gray-400:hover {
  cursor: pointer;
}
.suggestion-list {
  position: absolute;
  z-index: 9999;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}

.suggestion-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
}
</style>
