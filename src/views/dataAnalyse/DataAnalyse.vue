<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <div class="max-w-8xl mx-auto px-4 py-6 space-y-6">
      <!-- 关键指标卡片 -->
      <div class="grid grid-cols-3 gap-6">
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-gray-500 mb-2">总学习时长(本周)</h3>
              <div class="text-3xl font-semibold">{{ totalTime }}h</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-gray-500 mb-2">完成任务(本周)</h3>
              <div class="text-3xl font-semibold text-green-500">
                {{ taskList.filter((task) => task.status === 1).length }}
              </div>
            </div>
            <el-tag type="info">完成率 {{ completedRate }}%</el-tag>
          </div>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-gray-500 mb-2">活跃天数（本周）</h3>
              <div class="text-3xl font-semibold text-orange-500">
                {{ huoyueDays }}
              </div>
            </div>
            <el-tag>本周已过 {{ days }} 天</el-tag>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-gray-700 mb-4">学习时长趋势(本周)</h3>
          <div ref="chartRef" class="w-full h-[300px]"></div>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-gray-700 mb-4">学习效率分析</h3>
          <div class="space-y-6">
            <div v-for="(item, index) in efficiencyData" :key="index">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">{{ item.time }}</span>
                <span class="text-gray-900">{{ item.value }}%</span>
              </div>
              <el-progress
                :percentage="item.value"
                :color="item.color"
                :show-text="false"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 底部区域 -->
      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-gray-700 mb-4">任务完成详情(本周)</h3>
          <el-table :data="currentTasks" style="width: 100%" :border="false">
            <el-table-column prop="description" label="任务名称" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag
                  :type="getStatusType(scope.row.status)"
                  class="whitespace-nowrap"
                >
                  {{ scope.row.status === 1 ? "已完成" : " 未完成" }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
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
          </div>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-gray-700 mb-4">标签分布</h3>
          <!-- 加载动画容器 -->
          <div
            v-if="isLoading"
            class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 animate-fade-out"
            style="animation-delay: 1s; animation-fill-mode: forwards"
          >
            <!-- 旋转指示器 -->
            <div class="animate-spin mb-2">
              <svg
                class="w-8 h-8 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <span class="text-gray-600 text-sm">加载中...</span>
          </div>
          <div ref="subjectChartRef" class="w-full h-[255px]"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from "vue";
import * as echarts from "echarts";
import { getWeekStudyTime, getRandomTask } from "@/api/api.js";
import { format } from "date-fns";
import { ElMessage } from "element-plus";
const currentPage = ref(1);
const pageSize = ref(3);
let taskList = reactive([]);
const completedRate = computed(() => {
  const totalLength = taskList.length;
  const completedLength = taskList.filter((task) => task.status === 1).length;
  const rate = ((completedLength / totalLength) * 100).toFixed(1);
  return rate;
});
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

const totalTime = ref(0);
const chartRef = ref<HTMLElement | null>(null);
const subjectChartRef = ref<HTMLElement | null>(null);

const efficiencyData = [
  { time: "上午", value: 85, color: "#409EFF" },
  { time: "下午", value: 75, color: "#67C23A" },
  { time: "晚上", value: 60, color: "#E6A23C" },
];

const getStatusType = (status) => {
  switch (status) {
    case 1:
      return "success";
    default:
      return "danger";
  }
};
const today = new Date();
const days = ref(0);
const weekDays = [7, 1, 2, 3, 4, 5, 6];
const huoyueDays = ref(0);
let tasksTime = reactive([]);
// 格式化日期函数
const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};
const loadAllData = async () => {
  // 获取近七天任务
  for (let i = 0; i < 7; i++) {
    let date = new Date(today);
    date.setDate(today.getDate() - i);
    getRandomTask({
      date: formatDate(date),
    }).then((res) => {
      res.data.data.forEach((item) => {
        taskList.push(item);
      });
    });
  }
  days.value = weekDays[today.getDay()];
  //初始化学习时长
  getWeekStudyTime()
    .then((res) => {
      res.data.data.forEach((item) => {
        totalTime.value += item.totalDuration;
        const week = weekDays[new Date(item.workDate).getDay()];
        tasksTime.push({
          week: week,
          time: item.totalDuration,
        });
      });
      const index = tasksTime.findIndex((task) => task.week === 1);
      tasksTime = tasksTime.splice(0, index + 1);
      tasksTime.reverse();
      while (tasksTime.length < 7) {
        tasksTime.push({
          week: tasksTime.length,
          time: 0,
        });
      }
      tasksTime.forEach((item) => {
        item.time = parseFloat((item.time / 60).toFixed(1));
      });
      totalTime.value = parseFloat((totalTime.value / 60).toFixed(1));

      // 初始化图表
      if (chartRef.value) {
        const chart = echarts.init(chartRef.value);
        chart.setOption({
          animation: false,
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            boundaryGap: false,
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: `{value}小时`,
            },
          },
          series: [
            {
              data: tasksTime.map((t) => t.time),
              type: "line",
              smooth: true,
              areaStyle: {
                opacity: 0.1,
              },
              lineStyle: {
                width: 2,
              },
              itemStyle: {
                color: "#409EFF",
              },
              label: {
                show: true,
                position: "top",
                color: "#409EFF", // 添加文本颜色
                fontSize: 12, // 调整字号
                fontWeight: "bold", // 加粗显示
                formatter: (params) => {
                  // 使用回调函数确保正确获取数值
                  return `${params.value} 小时`;
                },
              },
            },
          ],
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
const isLoading = ref(true);
const initChart = () => {
  const studyValue = taskList.filter((task) =>
    task.tags.includes("学习")
  ).length;
  const lifeValue = taskList.filter((task) =>
    task.tags.includes("生活")
  ).length;
  const courseValue = taskList.filter((task) =>
    task.tags.includes("课程")
  ).length;
  const otherValue = taskList.filter(
    (task) =>
      !task.tags.includes("学习") &&
      !task.tags.includes("生活") &&
      !task.tags.includes("课程")
  ).length;
  if (subjectChartRef.value) {
    const subjectChart = echarts.init(subjectChartRef.value);
    subjectChart.setOption({
      animation: false,
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: "{b}: {c}%",
          },
          data: [
            { value: studyValue, name: "学习" },
            { value: lifeValue, name: "生活" },
            { value: courseValue, name: "课程" },
            { value: otherValue, name: "其他" },
          ],
        },
      ],
    });
  }
};
onMounted(async () => {
  if (localStorage.getItem("星期一")) {
    huoyueDays.value++;
  }
  if (localStorage.getItem("星期二")) {
    huoyueDays.value++;
  }
  if (localStorage.getItem("星期三")) {
    huoyueDays.value++;
  }
  if (localStorage.getItem("星期四")) {
    huoyueDays.value++;
  }
  if (localStorage.getItem("星期五")) {
    huoyueDays.value++;
  }
  if (localStorage.getItem("星期六")) {
    huoyueDays.value++;
  }
  if (localStorage.getItem("星期日")) {
    huoyueDays.value++;
  }
  try {
    await Promise.all([loadAllData()]);
  } catch (error) {
    ElMessage.error(`数据加载失败: ${error.message}`);
  } finally {
    // 1秒后隐藏加载动画并初始化图表
    setTimeout(() => {
      isLoading.value = false;
      initChart(); // 你的图表初始化逻辑
    }, 1000);
  }
});
</script>

<style scoped>
/* 自定义渐隐动画 */
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
}
.animate-fade-out {
  animation: fade-out 0.5s ease-in;
}
.el-input :deep(.el-input__wrapper) {
  border-radius: 24px;
  box-shadow: 0 0 0 1px #e5e7eb;
}

.el-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff;
}

.el-table :deep(.el-table__cell) {
  padding: 12px;
}

.el-table :deep(.el-table__header) {
  background-color: #f9fafb;
}
</style>
