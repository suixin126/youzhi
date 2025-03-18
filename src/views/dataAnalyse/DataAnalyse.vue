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
              <h3 class="text-gray-500 mb-2">总学习时长</h3>
              <div class="text-3xl font-semibold">156.5h</div>
            </div>
            <el-tag type="success" class="whitespace-nowrap">月同比增长 15%</el-tag>
          </div>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-gray-500 mb-2">完成任务</h3>
              <div class="text-3xl font-semibold text-green-500">89</div>
            </div>
            <el-tag type="info">完成率 92%</el-tag>
          </div>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-gray-500 mb-2">活跃天数</h3>
              <div class="text-3xl font-semibold text-orange-500">26</div>
            </div>
            <el-tag>本月已过 28 天</el-tag>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-gray-700 mb-4">学习时长趋势</h3>
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
              <el-progress :percentage="item.value" :color="item.color" :show-text="false" />
            </div>
          </div>
        </div>
      </div>

      <!-- 底部区域 -->
      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-gray-700 mb-4">任务完成详情</h3>
          <el-table :data="taskData" style="width: 100%" :border="false">
            <el-table-column prop="name" label="任务名称" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)" class="whitespace-nowrap">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-gray-700 mb-4">科目分布</h3>
          <div ref="subjectChartRef" class="w-full h-[300px]"></div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Search, Microphone, Bell } from "@element-plus/icons-vue";
import * as echarts from "echarts";
import { getWeekStudyTime } from "@/api/api.js";

const searchText = ref("");
const chartRef = ref<HTMLElement | null>(null);
const subjectChartRef = ref<HTMLElement | null>(null);

const efficiencyData = [
  { time: "上午", value: 85, color: "#409EFF" },
  { time: "下午", value: 75, color: "#67C23A" },
  { time: "晚上", value: 60, color: "#E6A23C" },
];

const taskData = [
  { name: "语文作业", status: "已完成" },
  { name: "数学练习", status: "已完成" },
  { name: "英语口语", status: "进行中" },
  { name: "物理实验", status: "待完成" },
  { name: "化学作业", status: "已完成" },
  { name: "生物笔记", status: "进行中" },
];

const getStatusType = (status: string) => {
  switch (status) {
    case "已完成":
      return "success";
    case "进行中":
      return "warning";
    case "待完成":
      return "danger";
    default:
      return "info";
  }
};

onMounted(() => {
  //初始化学习时长
  getWeekStudyTime().then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  });
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
      },
      series: [
        {
          data: [5.5, 6.1, 4.8, 7.0, 6.5, 6.0, 6.8],
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
        },
      ],
    });
  }

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
            { value: 28, name: "语文" },
            { value: 32, name: "数学" },
            { value: 25, name: "英语" },
            { value: 15, name: "其他" },
          ],
        },
      ],
    });
  }
});
</script>

<style scoped>
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