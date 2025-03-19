<template>
  <el-dialog
    v-model="dialogVisible"
    title="任务管理"
    width="80%"
    @close="handleClose"
  >
    <el-table :data="localTasks" border style="width: 100%">
      <!-- 任务描述 -->
      <el-table-column prop="description" label="任务描述" width="200">
        <template #default="{ row }">
          <el-input v-model="row.description" />
        </template>
      </el-table-column>

      <!-- 开始时间 -->
      <el-table-column prop="startTime" label="开始时间" width="180">
        <template #default="{ row }">
          <el-date-picker
            v-model="row.startTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm"
          />
        </template>
      </el-table-column>

      <!-- 截止时间 -->
      <el-table-column prop="endTime" label="截止时间" width="180">
        <template #default="{ row }">
          <el-date-picker
            v-model="row.endTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm"
          />
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

      <!-- 操作列 -->
      <el-table-column label="操作" width="80">
        <template #default="{ $index }">
          <el-button
            type="danger"
            icon="Delete"
            circle
            @click="handleDelete($index)"
          />
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认修改 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  tasks: {
    default: () => [],
    required: true,
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:visible", "update:tasks", "confirm"]);

// 修改1：使用ref创建响应式副本
const localTasks = ref([]);
// 修改2：正确初始化dialogVisible
const dialogVisible = ref(props.visible);

// 修改3：完善watch监听
watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val;
    if (val) {
      // 深拷贝创建副本
      localTasks.value = JSON.parse(JSON.stringify(props.tasks));
    }
  }
);

// 修改4：添加dialogVisible的watch同步到父组件
watch(dialogVisible, (val) => {
  emit("update:visible", val);
});

// 修改5：完善关闭处理
const handleClose = () => {
  dialogVisible.value = false;
  emit("update:visible", false);
};

// 其他保持原有代码不变
</script>
<style lang="scss" scoped>
.el-table {
  margin: 20px 0;

  :deep(.el-input__inner) {
    border: none;
    padding: 0;
  }

  :deep(.el-date-editor) {
    width: 100%;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
